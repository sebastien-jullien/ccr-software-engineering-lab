/**
 * TOOLING-EXPERIMENT-001 — point de reprise d'état de programme durable.
 *
 * Conforme à la prédéclaration gelée
 * `09-TOOLING-EXPERIMENT-001-PROGRAM-STATE.md`, et à elle seule.
 *
 * Trois commandes : resume · check · update.
 * Aucune dépendance externe. Aucune mutation Git. Aucun réseau.
 *
 * Règles portées par ce fichier, dans l'ordre où elles comptent :
 *
 *   - une référence qui existe ne prouve rien ; seule une relation typée
 *     preuve → affirmation (subject · field · value) peut soutenir un état ;
 *   - la dérive d'une source se mesure par identité de contenu Git, jamais
 *     par un horodatage ;
 *   - l'avancement de HEAD n'est pas une péremption : ce fichier est lui-même
 *     suivi par Git, et le commiter fait avancer HEAD ;
 *   - l'accessibilité courante n'est pas la vérité historique ;
 *   - une source SEALED n'est jamais déréférencée.
 */

import { existsSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';

/* ------------------------------------------------------------------ *
 * Vocabulaires
 * ------------------------------------------------------------------ */

export const UNCERTAIN = ['UNKNOWN', 'UNRESOLVED', 'NOT_APPLICABLE', 'NOT_YET_SELECTED'];

export const STREAM_STATES = ['OPEN', 'IMPLEMENTED', 'CLOSED', 'UNKNOWN', 'UNRESOLVED', 'NOT_APPLICABLE'];
export const DECISION_STATES = ['PENDING', 'RATIFIED', 'UNKNOWN', 'UNRESOLVED'];

/**
 * Amendement 001 : une décision nouvellement créée porte un état substantiel.
 * Les valeurs d'incertitude ne sont pas créables — on ne crée pas une décision
 * pour dire qu'on ignore s'il y en a une.
 */
export const DECISION_CREATE_STATES = ['PENDING', 'RATIFIED'];

/**
 * Collections dont la création explicite est autorisée.
 *   decision — amendement 001
 *   stream   — amendement 003
 * Toute autre collection reste non créable : il n'y a pas de CRUD générique.
 */
export const CREATABLE = ['decision', 'stream'];
export const NEXT_ACTION_STATES = ['NOT_YET_SELECTED', 'SELECTED', 'UNKNOWN', 'UNRESOLVED'];

export const EVIDENCE_POLICIES = ['VERIFIABLE', 'OPAQUE_BUT_ESTABLISHED', 'SEALED'];
export const EVIDENCE_KINDS = [
  'repo-path',
  'commit',
  'observation',
  'external-artifact',
  'session',
  'decision',
  'recommendation',
];

/** Issues de vérification d'une preuve ou d'une affirmation. */
export const OUTCOME = Object.freeze({
  CURRENT: 'CURRENT',
  SOURCE_CHANGED: 'SOURCE_CHANGED',
  REFERENCE_MISSING: 'REFERENCE_MISSING',
  UNSUPPORTED: 'UNSUPPORTED',
  INCOMPLETE: 'INCOMPLETE',
  UNVERIFIED: 'UNVERIFIED',
  UNREACHABLE: 'UNREACHABLE',
  CONTRADICTION: 'CONTRADICTION',
  MALFORMED: 'MALFORMED',
  REPOSITORY_ADVANCED: 'REPOSITORY_ADVANCED_SINCE_RECORDED_CONTEXT',
});

/**
 * Constats matériels : ils font échouer `check`.
 *
 * UNVERIFIED, UNREACHABLE et REPOSITORY_ADVANCED n'en font pas partie —
 * une limite de vérification n'est pas une fausseté.
 */
const MATERIAL = new Set([
  OUTCOME.SOURCE_CHANGED,
  OUTCOME.REFERENCE_MISSING,
  OUTCOME.UNSUPPORTED,
  OUTCOME.INCOMPLETE,
  OUTCOME.CONTRADICTION,
  OUTCOME.MALFORMED,
]);

/** Précédence lorsqu'aucune preuve d'une affirmation n'est CURRENT. */
const PRECEDENCE = [
  OUTCOME.SOURCE_CHANGED,
  OUTCOME.REFERENCE_MISSING,
  OUTCOME.UNREACHABLE,
  OUTCOME.UNVERIFIED,
];

export const OBSERVATION_RECORD = '04-OBSERVATION-RECORD.md';

/* ------------------------------------------------------------------ *
 * Sérialisation canonique
 * ------------------------------------------------------------------ */

const KEY_ORDER = {
  root: ['checkpoint', 'git_context', 'streams', 'decisions', 'next_action'],
  checkpoint: ['format_version', 'updated_at'],
  git_context: ['repository', 'branch', 'observed_base_head', 'observed_base_tree'],
  stream: ['id', 'title', 'type', 'state', 'updated_at', 'evidence'],
  decision: ['id', 'question', 'state', 'evidence'],
  next_action: ['state', 'value', 'evidence'],
  evidence: ['id', 'kind', 'ref', 'policy', 'supports', 'observed'],
  supports: ['subject', 'field', 'value'],
  observed: ['blob'],
};

function ordered(source, keys) {
  const out = {};
  for (const key of keys) {
    if (source !== null && source !== undefined && source[key] !== undefined) out[key] = source[key];
  }
  return out;
}

function canonicalEvidence(entry) {
  const out = ordered(entry, KEY_ORDER.evidence);
  if (out.supports !== undefined) out.supports = ordered(out.supports, KEY_ORDER.supports);
  if (out.observed !== undefined) out.observed = ordered(out.observed, KEY_ORDER.observed);
  return out;
}

/** Reconstruit l'objet dans l'ordre de clés gelé. */
export function canonicalize(state) {
  const out = ordered(state, KEY_ORDER.root);
  if (out.checkpoint !== undefined) out.checkpoint = ordered(out.checkpoint, KEY_ORDER.checkpoint);
  if (out.git_context !== undefined) out.git_context = ordered(out.git_context, KEY_ORDER.git_context);
  if (Array.isArray(out.streams)) {
    out.streams = out.streams.map((stream) => {
      const s = ordered(stream, KEY_ORDER.stream);
      if (Array.isArray(s.evidence)) s.evidence = s.evidence.map(canonicalEvidence);
      return s;
    });
  }
  if (Array.isArray(out.decisions)) {
    out.decisions = out.decisions.map((decision) => {
      const d = ordered(decision, KEY_ORDER.decision);
      if (Array.isArray(d.evidence)) d.evidence = d.evidence.map(canonicalEvidence);
      return d;
    });
  }
  if (out.next_action !== undefined) {
    const n = ordered(out.next_action, KEY_ORDER.next_action);
    if (Array.isArray(n.evidence)) n.evidence = n.evidence.map(canonicalEvidence);
    out.next_action = n;
  }
  return out;
}

/** Indentation 2, LF, un saut de ligne final. Byte-stable. */
export function serialize(state) {
  return JSON.stringify(canonicalize(state), null, 2) + '\n';
}

export class MalformedCheckpoint extends Error {}

export function parse(text) {
  let value;
  try {
    value = JSON.parse(text);
  } catch (error) {
    throw new MalformedCheckpoint('JSON illisible : ' + error.message);
  }
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new MalformedCheckpoint('la racine doit être un objet');
  }
  return value;
}

export function load(path) {
  return parse(readFileSync(path, 'utf8'));
}

let temporaryCounter = 0;

/**
 * Remplacement atomique : un voisin temporaire complet, fermé, puis renommé
 * par-dessus la destination. Un lecteur voit l'ancien instantané complet ou le
 * nouveau, jamais un JSON partiel.
 */
export function writeAtomic(path, text) {
  temporaryCounter += 1;
  const temporary = path + '.tmp-' + process.pid + '-' + temporaryCounter;
  writeFileSync(temporary, text, 'utf8');
  try {
    renameSync(temporary, path);
  } catch (error) {
    try {
      rmSync(temporary, { force: true });
    } catch {
      /* le nettoyage du temporaire ne doit pas masquer l'erreur d'origine */
    }
    throw error;
  }
}

export function save(path, state) {
  writeAtomic(path, serialize(state));
}

/* ------------------------------------------------------------------ *
 * Git, en lecture seule
 * ------------------------------------------------------------------ */

function git(repoRoot, args) {
  try {
    return execFileSync('git', ['-C', repoRoot, ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return null;
  }
}

/**
 * Identité de contenu Git d'un chemin de dépôt, sous les attributs de ce
 * chemin. C'est la seule mesure de dérive de source admise.
 */
export function blobOf(repoRoot, relPath) {
  const absolute = join(repoRoot, relPath);
  if (!existsSync(absolute)) return null;
  return git(repoRoot, ['hash-object', '--path=' + relPath, absolute]);
}

export function currentHead(repoRoot) {
  return git(repoRoot, ['rev-parse', 'HEAD']);
}

function commitExists(repoRoot, ref) {
  return git(repoRoot, ['cat-file', '-e', ref + '^{commit}']) !== null;
}

function observationExists(repoRoot, id) {
  const path = join(repoRoot, OBSERVATION_RECORD);
  if (!existsSync(path)) return false;
  const text = readFileSync(path, 'utf8');
  return text.includes('## Observation ' + id);
}

/* ------------------------------------------------------------------ *
 * Vérification d'une entrée de preuve
 * ------------------------------------------------------------------ */

/**
 * Une source SEALED n'est jamais ouverte, résolue ni interrogée : seule sa
 * politique est lue. Une source opaque ne devient pas fausse parce que la
 * v0 ne sait pas l'ouvrir.
 */
export function checkEvidence(entry, repoRoot) {
  if (entry.policy === 'SEALED') {
    return { outcome: OUTCOME.UNVERIFIED, note: 'source scellée — jamais déréférencée' };
  }
  if (entry.policy === 'OPAQUE_BUT_ESTABLISHED') {
    return { outcome: OUTCOME.UNVERIFIED, note: 'établissement antérieur, source non vérifiable par la v0' };
  }

  switch (entry.kind) {
    case 'repo-path':
    case 'recommendation': {
      const observed = blobOf(repoRoot, entry.ref);
      if (observed === null) {
        return { outcome: OUTCOME.REFERENCE_MISSING, note: 'chemin de dépôt absent' };
      }
      const recorded = entry.observed && entry.observed.blob;
      if (recorded !== undefined && recorded !== null && recorded !== observed) {
        return {
          outcome: OUTCOME.SOURCE_CHANGED,
          note: 'blob enregistré ' + recorded + ' — blob courant ' + observed,
        };
      }
      return { outcome: OUTCOME.CURRENT };
    }
    case 'commit':
      return commitExists(repoRoot, entry.ref)
        ? { outcome: OUTCOME.CURRENT }
        : { outcome: OUTCOME.REFERENCE_MISSING, note: 'commit introuvable' };
    case 'observation':
      return observationExists(repoRoot, entry.ref)
        ? { outcome: OUTCOME.CURRENT }
        : { outcome: OUTCOME.REFERENCE_MISSING, note: 'observation absente du registre' };
    case 'external-artifact':
      return existsSync(entry.ref)
        ? { outcome: OUTCOME.CURRENT }
        : { outcome: OUTCOME.UNREACHABLE, note: 'artefact externe actuellement inaccessible' };
    default:
      return { outcome: OUTCOME.UNVERIFIED, note: 'référence non résoluble mécaniquement' };
  }
}

/**
 * Une recommandation ne peut pas soutenir une ratification.
 * C'est une confusion qui s'est produite dans ce projet.
 */
function evidenceMaySupport(entry, claim) {
  if (entry.kind === 'recommendation' && claim.field === 'state' && claim.value === 'RATIFIED') {
    return false;
  }
  return true;
}

/* ------------------------------------------------------------------ *
 * Affirmations structurées
 * ------------------------------------------------------------------ */

export function claimsOf(state) {
  const claims = [];
  for (const stream of state.streams || []) {
    claims.push({
      subject: 'stream:' + stream.id,
      field: 'state',
      value: stream.state,
      evidence: stream.evidence || [],
      label: stream.title || stream.id,
    });
  }
  for (const decision of state.decisions || []) {
    claims.push({
      subject: 'decision:' + decision.id,
      field: 'state',
      value: decision.state,
      evidence: decision.evidence || [],
      label: decision.question || decision.id,
    });
  }
  const next = state.next_action;
  if (next) {
    claims.push({
      subject: 'next_action',
      field: 'state',
      value: next.state,
      evidence: next.evidence || [],
      label: 'action suivante',
    });
    if (next.state === 'SELECTED') {
      claims.push({
        subject: 'next_action',
        field: 'value',
        value: next.value,
        evidence: next.evidence || [],
        label: 'valeur de l’action suivante',
      });
    }
  }
  return claims;
}

function evaluateClaim(claim, repoRoot) {
  const matching = (claim.evidence || []).filter(
    (entry) =>
      entry.supports &&
      entry.supports.subject === claim.subject &&
      entry.supports.field === claim.field &&
      entry.supports.value === claim.value,
  );
  const admissible = matching.filter((entry) => evidenceMaySupport(entry, claim));

  if (admissible.length === 0) {
    /* Une valeur d'incertitude décline d'affirmer ; elle n'exige donc aucune
     * preuve. La provenance est requise pour affirmer, jamais pour dire que
     * rien n'est établi. */
    if (UNCERTAIN.includes(claim.value)) {
      return {
        outcome: OUTCOME.UNVERIFIED,
        note: 'valeur d’incertitude — aucune preuve requise',
        checked: [],
      };
    }
    const note =
      matching.length > 0
        ? 'seules des preuves inadmissibles pour cette affirmation'
        : 'aucune relation de preuve ne désigne ce sujet, ce champ et cette valeur';
    return { outcome: OUTCOME.UNSUPPORTED, note, checked: [] };
  }

  const checked = admissible.map((entry) => ({ entry, result: checkEvidence(entry, repoRoot) }));
  if (checked.some((item) => item.result.outcome === OUTCOME.CURRENT)) {
    return { outcome: OUTCOME.CURRENT, checked };
  }
  for (const candidate of PRECEDENCE) {
    const hit = checked.find((item) => item.result.outcome === candidate);
    if (hit) return { outcome: candidate, note: hit.result.note, checked };
  }
  return { outcome: OUTCOME.UNVERIFIED, checked };
}

/* ------------------------------------------------------------------ *
 * Contrôles structurels
 * ------------------------------------------------------------------ */

function structuralFindings(state) {
  const findings = [];
  const bad = (subject, note) =>
    findings.push({ outcome: OUTCOME.MALFORMED, subject, field: '-', note });

  if (!state.checkpoint || typeof state.checkpoint.format_version !== 'number') {
    bad('checkpoint', 'format_version absent ou non numérique');
  }
  if (!state.git_context) bad('git_context', 'contexte Git absent');
  for (const key of ['streams', 'decisions']) {
    if (!Array.isArray(state[key])) bad(key, 'doit être un tableau');
  }
  if (!state.next_action) bad('next_action', 'action suivante absente');

  for (const stream of state.streams || []) {
    if (!stream.id) bad('stream:?', 'identifiant absent');
    if (!STREAM_STATES.includes(stream.state)) {
      bad('stream:' + stream.id, 'état hors vocabulaire : ' + String(stream.state));
    }
  }
  for (const decision of state.decisions || []) {
    if (!decision.id) bad('decision:?', 'identifiant absent');
    if (!DECISION_STATES.includes(decision.state)) {
      bad('decision:' + decision.id, 'état hors vocabulaire : ' + String(decision.state));
    }
  }
  if (state.next_action && !NEXT_ACTION_STATES.includes(state.next_action.state)) {
    bad('next_action', 'état hors vocabulaire : ' + String(state.next_action.state));
  }

  for (const entry of allEvidence(state)) {
    if (!EVIDENCE_KINDS.includes(entry.kind)) {
      bad('evidence:' + (entry.id || '?'), 'kind hors vocabulaire : ' + String(entry.kind));
    }
    if (!EVIDENCE_POLICIES.includes(entry.policy)) {
      bad('evidence:' + (entry.id || '?'), 'policy hors vocabulaire : ' + String(entry.policy));
    }
    if (!entry.supports || !entry.supports.subject || !entry.supports.field) {
      bad('evidence:' + (entry.id || '?'), 'relation supports incomplète');
    }
  }
  return findings;
}

function allEvidence(state) {
  const out = [];
  for (const stream of state.streams || []) out.push(...(stream.evidence || []));
  for (const decision of state.decisions || []) out.push(...(decision.evidence || []));
  if (state.next_action) out.push(...(state.next_action.evidence || []));
  return out;
}

/** Une clôture ne peut pas reposer sur un état inconnu ou absent. */
function completenessFindings(state) {
  const findings = [];
  for (const stream of state.streams || []) {
    if (stream.state === 'CLOSED') {
      const stamp = stream.updated_at;
      if (!stamp || UNCERTAIN.includes(stamp)) {
        findings.push({
          outcome: OUTCOME.INCOMPLETE,
          subject: 'stream:' + stream.id,
          field: 'updated_at',
          note: 'clôture affirmée sans date d’établissement',
        });
      }
    }
  }
  const next = state.next_action;
  if (next && next.state === 'SELECTED' && (next.value === undefined || next.value === null || next.value === '')) {
    findings.push({
      outcome: OUTCOME.INCOMPLETE,
      subject: 'next_action',
      field: 'value',
      note: 'action déclarée SELECTED sans valeur',
    });
  }
  return findings;
}

/**
 * Contradiction : deux valeurs distinctes pour le même sujet et le même
 * champ, chacune réellement soutenue par une preuve vérifiée.
 * L'existence d'un fichier n'est pas une contradiction.
 */
function contradictionFindings(state, repoRoot) {
  const byKey = new Map();
  for (const entry of allEvidence(state)) {
    if (!entry.supports) continue;
    const key = entry.supports.subject + '\u0000' + entry.supports.field;
    if (!byKey.has(key)) byKey.set(key, new Map());
    const values = byKey.get(key);
    if (!values.has(entry.supports.value)) values.set(entry.supports.value, []);
    values.get(entry.supports.value).push(entry);
  }

  const findings = [];
  for (const [key, values] of byKey) {
    if (values.size < 2) continue;
    const supported = [];
    for (const [value, entries] of values) {
      const ok = entries.some((entry) => checkEvidence(entry, repoRoot).outcome === OUTCOME.CURRENT);
      if (ok) supported.push(value);
    }
    if (supported.length >= 2) {
      const [subject, field] = key.split('\u0000');
      findings.push({
        outcome: OUTCOME.CONTRADICTION,
        subject,
        field,
        note: 'valeurs soutenues incompatibles : ' + supported.join(' / '),
      });
    }
  }
  return findings;
}

/* ------------------------------------------------------------------ *
 * check
 * ------------------------------------------------------------------ */

export function check(state, repoRoot) {
  const findings = [...structuralFindings(state)];

  if (!findings.some((f) => f.outcome === OUTCOME.MALFORMED)) {
    for (const claim of claimsOf(state)) {
      const evaluation = evaluateClaim(claim, repoRoot);
      findings.push({
        outcome: evaluation.outcome,
        subject: claim.subject,
        field: claim.field,
        value: claim.value,
        label: claim.label,
        note: evaluation.note,
      });
    }
    findings.push(...completenessFindings(state));
    findings.push(...contradictionFindings(state, repoRoot));
  }

  const head = currentHead(repoRoot);
  const recorded = state.git_context && state.git_context.observed_base_head;
  if (head && recorded && head !== recorded) {
    findings.push({
      outcome: OUTCOME.REPOSITORY_ADVANCED,
      subject: 'git_context',
      field: 'observed_base_head',
      note: 'contexte enregistré ' + recorded + ' — HEAD courant ' + head,
    });
  }

  const material = findings.filter((f) => MATERIAL.has(f.outcome));
  return { findings, material, exitCode: material.length === 0 ? 0 : 1 };
}

/* ------------------------------------------------------------------ *
 * Rendu
 * ------------------------------------------------------------------ */

const BLIND_SPOT =
  'ANGLE MORT — un événement opérationnel que personne n’a consigné est ' +
  'indétectable par cet outil. Ce rapport ne promet pas la fraîcheur : il ' +
  'promet de ne jamais affirmer une fraîcheur qu’il n’a pas vérifiée.';

function line(label, value) {
  return '  ' + String(label).padEnd(30) + String(value);
}

export function renderResume(state, repoRoot) {
  const report = check(state, repoRoot);
  const byClaim = new Map();
  for (const f of report.findings) {
    if (f.subject && f.field) byClaim.set(f.subject + '\u0000' + f.field, f);
  }
  const out = [];

  out.push('POINT DE REPRISE — ÉTAT DE PROGRAMME DURABLE');
  out.push('');
  out.push(line('mis à jour le', (state.checkpoint && state.checkpoint.updated_at) || 'UNKNOWN'));
  if (state.git_context) {
    out.push(line('dépôt', state.git_context.repository || 'UNKNOWN'));
    out.push(line('branche', state.git_context.branch || 'UNKNOWN'));
    out.push(line('contexte de base observé', state.git_context.observed_base_head || 'UNKNOWN'));
  }
  out.push('');

  /* 1. ce qui attend, d'abord */
  const pending = (state.decisions || []).filter((d) => d.state === 'PENDING');
  const unresolved = [
    ...(state.streams || []).filter((s) => UNCERTAIN.includes(s.state)),
    ...(state.decisions || []).filter((d) => UNCERTAIN.includes(d.state)),
  ];

  out.push('EN ATTENTE ET NON RÉSOLU');
  if (pending.length === 0 && unresolved.length === 0) {
    out.push(line('décisions humaines en attente', '0'));
    out.push(line('éléments non résolus', '0'));
  } else {
    for (const d of pending) out.push(line('DÉCISION EN ATTENTE', d.id + ' — ' + (d.question || '')));
    for (const item of unresolved) out.push(line(String(item.state), item.id));
  }
  out.push('');

  /* 2. état courant */
  out.push('FLUX');
  for (const stream of state.streams || []) {
    const verdict = byClaim.get('stream:' + stream.id + '\u0000state');
    out.push(line(stream.state, stream.id + ' — ' + (stream.title || '')));
    out.push(line('', '  vérification : ' + (verdict ? verdict.outcome : 'UNKNOWN')));
  }
  out.push('');

  out.push('DÉCISIONS');
  if ((state.decisions || []).length === 0) out.push(line('aucune', ''));
  for (const decision of state.decisions || []) {
    const verdict = byClaim.get('decision:' + decision.id + '\u0000state');
    out.push(line(decision.state, decision.id + ' — ' + (decision.question || '')));
    out.push(line('', '  vérification : ' + (verdict ? verdict.outcome : 'UNKNOWN')));
  }
  out.push('');

  /* 3. action suivante */
  out.push('ACTION SUIVANTE');
  const next = state.next_action || {};
  if (next.state === 'SELECTED') {
    out.push(line('SELECTED', next.value || ''));
  } else {
    out.push(line(next.state || 'UNKNOWN', ''));
  }
  out.push('');

  /* 4. preuves */
  out.push('RÉFÉRENCES DE PREUVE');
  for (const entry of allEvidence(state)) {
    const supports = entry.supports || {};
    out.push(
      line(
        entry.policy + ' / ' + entry.kind,
        entry.ref + '  →  ' + supports.subject + ' · ' + supports.field + ' = ' + supports.value,
      ),
    );
  }
  out.push('');

  /* 5. ce qui n'a pas pu être vérifié */
  out.push('NON VÉRIFIÉ MÉCANIQUEMENT');
  const unverified = report.findings.filter(
    (f) => f.outcome === OUTCOME.UNVERIFIED || f.outcome === OUTCOME.UNREACHABLE,
  );
  if (unverified.length === 0) out.push(line('aucun', ''));
  for (const f of unverified) out.push(line(f.outcome, f.subject + ' · ' + f.field));
  out.push('');

  const informational = report.findings.filter((f) => f.outcome === OUTCOME.REPOSITORY_ADVANCED);
  if (informational.length > 0) {
    out.push('INFORMATION');
    for (const f of informational) out.push(line(f.outcome, f.note || ''));
    out.push('');
  }

  if (report.material.length > 0) {
    out.push('CONSTATS MATÉRIELS');
    for (const f of report.material) {
      out.push(line(f.outcome, f.subject + ' · ' + f.field + (f.note ? ' — ' + f.note : '')));
    }
    out.push('');
  }

  out.push(BLIND_SPOT);
  return out.join('\n') + '\n';
}

export function renderCheck(report) {
  const out = [];
  for (const f of report.findings) {
    out.push(
      [f.outcome, f.subject || '-', f.field || '-', f.note ? '— ' + f.note : ''].join('  ').trimEnd(),
    );
  }
  out.push('');
  out.push('constats matériels : ' + report.material.length);
  return out.join('\n') + '\n';
}

/* ------------------------------------------------------------------ *
 * update
 * ------------------------------------------------------------------ */

export class UpdateRefused extends Error {}

/**
 * Validation du point de reprise ENTIER, telle que l'amendement 001 l'exige :
 * une création qui rendrait l'ensemble incohérent doit échouer, même si
 * l'entrée ajoutée est correcte prise isolément.
 */
export function validateCandidate(candidate) {
  return [...structuralFindings(candidate), ...completenessFindings(candidate)];
}

/**
 * Amendement 001 — création explicite d'UNE décision.
 *
 * Rend un point de reprise candidat complet ; n'écrit rien. L'appelant
 * n'écrit qu'après un retour réussi, de sorte qu'un échec laisse
 * PROGRAM-STATE.json inchangé, à l'octet près.
 */
export function createDecision(state, spec) {
  const { id, question, decisionState, evidence, now } = spec;

  if (!id) throw new UpdateRefused('création refusée : id absent');
  if (!question) throw new UpdateRefused('création refusée : question absente');
  if (!DECISION_CREATE_STATES.includes(decisionState)) {
    throw new UpdateRefused('création refusée : état illégal — ' + String(decisionState));
  }
  if ((state.decisions || []).some((decision) => decision.id === id)) {
    throw new UpdateRefused('création refusée : identifiant de décision déjà existant — ' + id);
  }

  const subject = 'decision:' + id;
  const supporting = (evidence || []).filter(
    (entry) =>
      entry.supports &&
      entry.supports.subject === subject &&
      entry.supports.field === 'state' &&
      entry.supports.value === decisionState,
  );
  if (supporting.length === 0) {
    throw new UpdateRefused(
      'création refusée : aucune preuve ne soutient ' + subject + ' · state = ' + decisionState,
    );
  }
  for (const entry of supporting) {
    if (!evidenceMaySupport(entry, { field: 'state', value: decisionState })) {
      throw new UpdateRefused(
        'création refusée : preuve inadmissible pour cette affirmation — ' + (entry.id || entry.ref),
      );
    }
  }

  const candidate = JSON.parse(JSON.stringify(state));
  candidate.decisions = [...(candidate.decisions || []), {
    id,
    question,
    state: decisionState,
    evidence: supporting,
  }];
  candidate.checkpoint.updated_at = now;

  const problems = validateCandidate(candidate);
  if (problems.length > 0) {
    const first = problems[0];
    throw new UpdateRefused(
      'création refusée : point de reprise candidat invalide — ' +
        first.outcome + ' ' + first.subject + (first.note ? ' : ' + first.note : ''),
    );
  }
  return candidate;
}

const SUBSTANTIVE = new Set(['state', 'value']);

function locate(state, subject) {
  if (subject === 'next_action') return { holder: state.next_action, kind: 'next_action' };
  if (subject.startsWith('stream:')) {
    const id = subject.slice('stream:'.length);
    const holder = (state.streams || []).find((s) => s.id === id);
    return holder ? { holder, kind: 'stream' } : null;
  }
  if (subject.startsWith('decision:')) {
    const id = subject.slice('decision:'.length);
    const holder = (state.decisions || []).find((d) => d.id === id);
    return holder ? { holder, kind: 'decision' } : null;
  }
  return null;
}

function legalValue(kind, field, value) {
  if (field !== 'state') return true;
  if (kind === 'stream') return STREAM_STATES.includes(value);
  if (kind === 'decision') return DECISION_STATES.includes(value);
  if (kind === 'next_action') return NEXT_ACTION_STATES.includes(value);
  return false;
}

/**
 * N'écrit que PROGRAM-STATE.json, et seulement avec une provenance.
 * Ne commite pas, ne pousse pas, ne choisit pas, ne ratifie pas.
 */
export function update(state, change) {
  const { subject, field, value, evidence, now } = change;
  const found = locate(state, subject);
  if (!found) throw new UpdateRefused('sujet inconnu : ' + subject);
  if (!legalValue(found.kind, field, value)) {
    throw new UpdateRefused('valeur illégale pour ' + found.kind + '.' + field + ' : ' + String(value));
  }

  /* Amendement 002 — tout se construit dans un candidat complet en mémoire.
   * Rien n'est appliqué à l'état de l'appelant avant que le candidat entier
   * ait été validé, donc aucun état intermédiaire — ancien soutien retiré,
   * nouveau absent — ne peut exister ni être persisté. */
  const candidate = JSON.parse(JSON.stringify(state));
  const target = locate(candidate, subject);

  if (SUBSTANTIVE.has(field)) {
    const supporting = (evidence || []).filter(
      (entry) =>
        entry.supports &&
        entry.supports.subject === subject &&
        entry.supports.field === field &&
        entry.supports.value === value,
    );
    if (supporting.length === 0) {
      throw new UpdateRefused(
        'changement substantiel refusé : aucune preuve ne soutient ' +
          subject + ' · ' + field + ' = ' + String(value),
      );
    }
    for (const entry of supporting) {
      if (!evidenceMaySupport(entry, { field, value })) {
        throw new UpdateRefused('preuve inadmissible pour cette affirmation : ' + (entry.id || entry.ref));
      }
    }

    /* Amendement 002 — supersession du soutien ACTIF.
     * Le soutien actif du sujet exact ET du champ exact est retiré de
     * l'instantané courant ; celui des autres champs et des autres sujets est
     * intact. L'histoire n'est pas perdue : elle vit dans l'historique Git du
     * point de reprise, qui est un fichier suivi.
     *
     * Une mise à jour à valeur égale n'est donc jamais une opération vide
     * lorsque la provenance diffère : c'est la seule façon d'affirmer qu'une
     * affirmation a été revérifiée contre la source d'aujourd'hui. */
    const retained = (target.holder.evidence || []).filter(
      (entry) =>
        !(entry.supports && entry.supports.subject === subject && entry.supports.field === field),
    );
    target.holder.evidence = [...retained, ...supporting];
  }

  target.holder[field] = value;
  if (target.kind === 'stream') target.holder.updated_at = now;
  candidate.checkpoint.updated_at = now;

  const problems = validateCandidate(candidate);
  if (problems.length > 0) {
    const first = problems[0];
    throw new UpdateRefused(
      'mise à jour refusée : point de reprise candidat invalide — ' +
        first.outcome + ' ' + first.subject + (first.note ? ' : ' + first.note : ''),
    );
  }

  /* Le candidat est valide : il devient l'état courant, en place. */
  state.checkpoint = candidate.checkpoint;
  state.git_context = candidate.git_context;
  state.streams = candidate.streams;
  state.decisions = candidate.decisions;
  state.next_action = candidate.next_action;
  return state;
}

/**
 * Amendement 003 — création explicite d'UN flux.
 *
 * Même discipline que la création d'une décision : un candidat complet est
 * rendu, rien n'est écrit, et l'appelant n'écrit qu'après un retour réussi.
 * L'état doit appartenir au vocabulaire déjà accepté ; aucun jeton de cycle
 * de vie n'est introduit ici.
 */
export function createStream(state, spec) {
  const { id, title, type, streamState, evidence, now } = spec;

  if (!id) throw new UpdateRefused('création refusée : id absent');
  if (!title) throw new UpdateRefused('création refusée : title absent');
  if (!type) throw new UpdateRefused('création refusée : type absent');
  if (!streamState) throw new UpdateRefused('création refusée : state absent');
  if (!STREAM_STATES.includes(streamState)) {
    throw new UpdateRefused('création refusée : état hors vocabulaire — ' + String(streamState));
  }
  if ((state.streams || []).some((stream) => stream.id === id)) {
    throw new UpdateRefused('création refusée : identifiant de flux déjà existant — ' + id);
  }

  const subject = 'stream:' + id;
  const supporting = (evidence || []).filter(
    (entry) =>
      entry.supports &&
      entry.supports.subject === subject &&
      entry.supports.field === 'state' &&
      entry.supports.value === streamState,
  );
  if (supporting.length === 0) {
    throw new UpdateRefused(
      'création refusée : aucune preuve ne soutient ' + subject + ' · state = ' + streamState,
    );
  }
  for (const entry of supporting) {
    if (!evidenceMaySupport(entry, { field: 'state', value: streamState })) {
      throw new UpdateRefused(
        'création refusée : preuve inadmissible pour cette affirmation — ' + (entry.id || entry.ref),
      );
    }
  }

  const candidate = JSON.parse(JSON.stringify(state));
  candidate.streams = [...(candidate.streams || []), {
    id,
    title,
    type,
    state: streamState,
    updated_at: now,
    evidence: supporting,
  }];
  candidate.checkpoint.updated_at = now;

  const problems = validateCandidate(candidate);
  if (problems.length > 0) {
    const first = problems[0];
    throw new UpdateRefused(
      'création refusée : point de reprise candidat invalide — ' +
        first.outcome + ' ' + first.subject + (first.note ? ' : ' + first.note : ''),
    );
  }
  return candidate;
}

/* ------------------------------------------------------------------ *
 * CLI
 * ------------------------------------------------------------------ */

function parseFlags(argv) {
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i].startsWith('--')) {
      flags[argv[i].slice(2)] = argv[i + 1];
      i += 1;
    }
  }
  return flags;
}

const USAGE = [
  'usage :',
  '  program-state.mjs resume <PROGRAM-STATE.json>',
  '  program-state.mjs check  <PROGRAM-STATE.json>',
  '  program-state.mjs update <PROGRAM-STATE.json> --subject <s> --field <f> --value <v> [--evidence <json>]',
  '  program-state.mjs update <PROGRAM-STATE.json> --create decision --id <id> --question <q> --state <s> --evidence <json>',
  '  program-state.mjs update <PROGRAM-STATE.json> --create stream   --id <id> --title <t> --type <ty> --state <s> --evidence <json>',
  '',
  'La création est un mode explicite : sans --create, un identifiant inconnu',
  'reste une erreur. Une faute de frappe ne crée jamais une entrée.',
].join('\n');

export function main(argv) {
  const [command, path, ...rest] = argv;
  if (!command || !path) {
    process.stderr.write(USAGE + '\n');
    return 2;
  }
  const file = resolve(path);
  const repoRoot = dirname(file);

  let state;
  try {
    state = load(file);
  } catch (error) {
    process.stderr.write('MALFORMED — ' + error.message + '\n');
    return 2;
  }

  if (command === 'check') {
    const report = check(state, repoRoot);
    process.stdout.write(renderCheck(report));
    return report.exitCode;
  }
  if (command === 'resume') {
    process.stdout.write(renderResume(state, repoRoot));
    return check(state, repoRoot).exitCode;
  }
  if (command === 'update') {
    const flags = parseFlags(rest);
    let evidence = [];
    if (flags.evidence) {
      try {
        const parsed = JSON.parse(flags.evidence);
        evidence = Array.isArray(parsed) ? parsed : [parsed];
      } catch (error) {
        process.stderr.write('REFUSED — preuve JSON illisible : ' + error.message + '\n');
        return 2;
      }
    }
    const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

    /* Mode de création explicite — amendement 001. Sans --create, rien de ce
     * qui suit n'est atteignable, et un identifiant inconnu reste un refus. */
    if (flags.create !== undefined) {
      if (!CREATABLE.includes(flags.create)) {
        process.stderr.write(
          'REFUSED — type de création inconnu : ' + String(flags.create) +
            ' (créable : ' + CREATABLE.join(', ') + ')\n',
        );
        return 2;
      }
      let candidate;
      try {
        candidate =
          flags.create === 'decision'
            ? createDecision(state, {
                id: flags.id,
                question: flags.question,
                decisionState: flags.state,
                evidence,
                now,
              })
            : createStream(state, {
                id: flags.id,
                title: flags.title,
                type: flags.type,
                streamState: flags.state,
                evidence,
                now,
              });
      } catch (error) {
        process.stderr.write('REFUSED — ' + error.message + '\n');
        return 2;
      }
      save(file, candidate);
      process.stdout.write(
        (flags.create === 'decision' ? 'décision créée : ' : 'flux créé : ') + flags.id + '\n',
      );
      return 0;
    }

    try {
      update(state, {
        subject: flags.subject,
        field: flags.field,
        value: flags.value,
        evidence,
        now,
      });
    } catch (error) {
      process.stderr.write('REFUSED — ' + error.message + '\n');
      return 2;
    }
    save(file, state);
    process.stdout.write('écrit : ' + file + '\n');
    return 0;
  }

  process.stderr.write(USAGE + '\n');
  return 2;
}

if (process.argv[1] && process.argv[1].endsWith('program-state.mjs')) {
  process.exitCode = main(process.argv.slice(2));
}
