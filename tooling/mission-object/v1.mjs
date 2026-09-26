/**
 * Mission Object V1 — représentation, reconnaissance C-1 RAFFINÉE, validation
 * V1 et P-HR-01, rendu et inspection déterministes.
 *
 * Conforme à l'autorité 101 (`101-HANDOFF-ROUTING-P-HR-01-MISSION-OBJECT-V1.md`),
 * sous les autorités 98 (spécification de P-HR-01), 99 (reconnaissance du V0
 * historique) et 100 (gel de la transaction d'implémentation), et à elles seules.
 *
 * Trois règles gouvernent ce fichier :
 *
 *   - la représentation se décide par `representation.authority` SEUL, sauf le
 *     V0 historique, reconnu de l'extérieur par l'autorité 14 épinglée : aucune
 *     devinette de schéma, aucune discrimination par l'appelant ou le contexte ;
 *   - une reconnaissance V1 ne retombe JAMAIS sur la validation V0 : un objet
 *     reconnu V1 et invalide est rejeté, jamais réexaminé comme V0 ;
 *   - aucune conversion V0 → V1 ni V1 → V0 : rien ici ne réécrit un objet.
 *
 * Les champs hérités d'un objet V1 sont validés par le validateur V0 existant,
 * inchangé : c'est l'incorporation par référence de la sémantique V0 (autorité
 * 98 § 10), pas une reconnaissance V0.
 *
 * Aucune dépendance externe. Aucun réseau. Aucune horloge. Aucun accès Git.
 */

import { readFileSync } from 'node:fs';

import { MissionObjectError, ROOT_ELEMENTS, normativeElements, parse } from './mission-object.mjs';
import { validate as validateLegacyV0 } from './validate.mjs';
import { render as renderV0 } from './render.mjs';

/* ------------------------------------------------------------------ *
 * Identités d'autorité
 * ------------------------------------------------------------------ */

/**
 * SEULE autorité Mission Object V1 supportée : REPO_PATH + GIT_BLOB de
 * l'autorité 101. Le blob est l'identité mécanique des octets de ce document ;
 * le document ne peut pas la porter lui-même.
 */
export const V1_AUTHORITY = Object.freeze({
  path: '101-HANDOFF-ROUTING-P-HR-01-MISSION-OBJECT-V1.md',
  blob: 'e9bb02ccf30fbedaf5b1bdca652f7af99f0baad2',
});

/** Autorité V0 historique ÉPINGLÉE — autorité 99 § 4. Valeur factuelle du dépôt. */
export const PINNED_V0_AUTHORITY = Object.freeze({
  path: '14-TOOLING-EXPERIMENT-002-MISSION-OBJECT-V0.md',
  blob: '7d634c855ab9de8c66a21c134b03de8f118c3de4',
});

/* ------------------------------------------------------------------ *
 * Vocabulaires clos — autorités 98 § 11-12 et 101 § 4-7
 * ------------------------------------------------------------------ */

/** Champs propres à V1. Aucun autre n'existe. */
export const V1_ONLY_FIELDS = Object.freeze(['representation', 'handoff_contract']);

/** Les seize éléments hérités : sémantique V0 incorporée par référence. */
export const INHERITED_ELEMENTS = Object.freeze([...ROOT_ELEMENTS]);

export const HANDOFF_CONTRACT_KEYS = Object.freeze([
  'version',
  'next_control_stage',
  'return_destination',
  'stage_ordering_dependency',
  'persistence_ownership',
]);

/** Domaines clos à un seul membre. Aucune extension n'existe. */
export const P_HR_01_VERSION = 'P_HR_01';
export const NEXT_CONTROL_STAGE = 'EXECUTOR_DISPATCH';
export const STAGE_ORDERING_DEPENDENCY = 'P_HR_01_LINEAR_V1';
export const PERSISTENCE_OWNERSHIP = 'ORCHESTRATION';

export const MISSION_BASENAME = 'mission.json';
export const RESULT_BASENAME = 'result.json';

/** Cycle de vie fixe P_HR_01_LINEAR_V1 — autorité 98 § 13. Une séquence, pas un graphe. */
export const LIFECYCLE = Object.freeze([
  'HANDOFF_RESOLVED',
  'MISSION_FROZEN',
  'EXECUTOR_DISPATCHED',
  'EXECUTOR_RETURNED',
  'RESULT_PERSISTED',
  'RESULT_CONSUMED',
]);

/** Une erreur V1 porte un code stable ; le texte n'est que de la prose. */
export class MissionObjectV1Error extends Error {
  constructor(code, message, details) {
    super(message);
    this.name = 'MissionObjectV1Error';
    this.code = code;
    this.details = details === undefined ? null : details;
  }
}

/* ------------------------------------------------------------------ *
 * Outils
 * ------------------------------------------------------------------ */

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function own(object, key) {
  return isPlainObject(object) && Object.prototype.hasOwnProperty.call(object, key);
}

function exactKeys(value, expected) {
  if (!isPlainObject(value)) return false;
  const keys = Object.keys(value);
  return keys.length === expected.length && expected.every((key) => own(value, key));
}

function error(path, code, message) {
  return { path, code, message };
}

/* ------------------------------------------------------------------ *
 * Chemins canoniques — autorité 98 § 12
 * ------------------------------------------------------------------ */

/**
 * Chemin relatif au dépôt, en séparateurs canoniques : ni absolu, ni `\`, ni
 * segment vide, ni `.`, ni `..`. Rend la liste des défauts, vide si canonique.
 */
function pathDefects(value) {
  const defects = [];
  if (typeof value !== 'string' || value === '') return ['chaîne non vide attendue'];
  if (value.includes('\\')) defects.push('séparateurs canoniques "/" exigés');
  if (value.startsWith('/') || /^[A-Za-z]:/.test(value)) defects.push('chemin absolu refusé');
  const segments = value.split('/');
  if (segments.includes('..')) defects.push('segment ".." refusé');
  if (segments.some((segment) => segment === '' || segment === '.')) {
    defects.push('segment vide ou "." refusé : forme non canonique');
  }
  return defects;
}

/**
 * Destination de retour canonique d'une mission : le `result.json` du
 * répertoire de son `mission.json`. Dérivation mécanique, jamais un choix.
 */
export function canonicalReturnDestination(missionPath) {
  const defects = pathDefects(missionPath);
  if (defects.length > 0) {
    throw new MissionObjectV1Error('MISSION_PATH_INVALID', 'chemin de mission invalide : ' + defects.join(' ; '), {
      missionPath: missionPath ?? null,
    });
  }
  const segments = missionPath.split('/');
  if (segments[segments.length - 1] !== MISSION_BASENAME) {
    throw new MissionObjectV1Error(
      'MISSION_PATH_INVALID',
      'le Mission Object porteur de P-HR-01 est le fichier ' + MISSION_BASENAME + ' de son répertoire',
      { missionPath },
    );
  }
  segments[segments.length - 1] = RESULT_BASENAME;
  return segments.join('/');
}

/* ------------------------------------------------------------------ *
 * Représentation — IP-01
 * ------------------------------------------------------------------ */

/** L'encodage exact de `representation` d'un Mission Object V1. Rien de plus. */
export function v1Representation() {
  return {
    authority: {
      locator: { kind: 'REPO_PATH', value: V1_AUTHORITY.path },
      identity: { kind: 'GIT_BLOB', value: V1_AUTHORITY.blob },
    },
  };
}

/** Égalité EXACTE avec l'identité V1 supportée : forme close, valeurs exactes. */
export function isExactV1Representation(representation) {
  if (!exactKeys(representation, ['authority'])) return false;
  const authority = representation.authority;
  if (!exactKeys(authority, ['locator', 'identity'])) return false;
  const { locator, identity } = authority;
  return (
    exactKeys(locator, ['kind', 'value']) &&
    exactKeys(identity, ['kind', 'value']) &&
    locator.kind === 'REPO_PATH' &&
    locator.value === V1_AUTHORITY.path &&
    identity.kind === 'GIT_BLOB' &&
    identity.value === V1_AUTHORITY.blob
  );
}

/** CAS F : `representation.authority` désigne l'autorité 14 épinglée, par chemin ou par blob. */
function identifiesV0(representation) {
  const authority = isPlainObject(representation) ? representation.authority : undefined;
  if (!isPlainObject(authority)) return false;
  const locator = isPlainObject(authority.locator) ? authority.locator.value : undefined;
  const identity = isPlainObject(authority.identity) ? authority.identity.value : undefined;
  return locator === PINNED_V0_AUTHORITY.path || identity === PINNED_V0_AUTHORITY.blob;
}

/**
 * Champs hérités d'un objet V1 : les éléments dont la sémantique V0 est
 * incorporée par référence. Projection transitoire destinée à la validation et
 * au rendu de CES champs seulement : jamais un Mission Object V0, jamais
 * reconnue, validée comme mission entière ou dispatchée comme V0.
 */
export function inheritedFields(object) {
  const out = {};
  for (const key of Object.keys(object)) {
    if (!V1_ONLY_FIELDS.includes(key)) out[key] = object[key];
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * Reconnaissance C-1 RAFFINÉE — IP-02, autorité 99 § 7
 * ------------------------------------------------------------------ */

/**
 * Classe un objet dans exactement un des cas A..F.
 *
 *   A  representation absente + validation V0 épinglée PASS + aucun champ V1   LEGACY_V0
 *   B  representation absente + validation V0 épinglée FAIL                    REJET
 *   C  representation absente + champ propre à V1 présent                      REJET
 *   D  representation présente + autorité V1 supportée exacte                  V1
 *   E  representation présente + autorité inconnue / discordante               REJET
 *   F  representation présente + tentative d'identifier V0                     REJET
 *
 * Le cas D ne dit que la représentation : la validation V1 suit, et un échec
 * est un rejet. Aucun cas ne retombe sur un autre.
 */
export function recognizeRepresentation(object) {
  if (!own(object, 'representation')) {
    const v1Fields = V1_ONLY_FIELDS.filter((key) => own(object, key));
    if (v1Fields.length > 0) {
      return {
        case: 'C',
        representation: null,
        errors: v1Fields.map((key) =>
          error(key, 'V1_ONLY_FIELD_WITHOUT_REPRESENTATION', 'champ propre à V1 sans representation : ni V0, ni V1'),
        ),
      };
    }
    const report = validateLegacyV0(object);
    if (!report.ok) {
      return {
        case: 'B',
        representation: null,
        errors: report.errors.map((entry) => error(entry.path, 'LEGACY_V0_VALIDATION_FAILED', entry.message)),
      };
    }
    return { case: 'A', representation: 'LEGACY_V0', errors: [], legacyValidation: report };
  }

  if (isExactV1Representation(object.representation)) {
    return { case: 'D', representation: 'V1', errors: [] };
  }
  if (identifiesV0(object.representation)) {
    return {
      case: 'F',
      representation: null,
      errors: [
        error(
          'representation',
          'REPRESENTATION_IDENTIFIES_V0',
          'le V0 historique ne porte aucune representation : il est identifié de l’extérieur',
        ),
      ],
    };
  }
  return {
    case: 'E',
    representation: null,
    errors: [error('representation', 'UNKNOWN_REPRESENTATION', 'autorité de représentation inconnue ou non supportée')],
  };
}

/* ------------------------------------------------------------------ *
 * Validation du contrat P-HR-01 — autorité 98 § 11-12
 * ------------------------------------------------------------------ */

const DOMAIN_RULES = Object.freeze([
  { key: 'version', value: P_HR_01_VERSION, code: 'UNKNOWN_P_HR_VERSION' },
  { key: 'next_control_stage', value: NEXT_CONTROL_STAGE, code: 'NEXT_CONTROL_STAGE_MISMATCH' },
  { key: 'stage_ordering_dependency', value: STAGE_ORDERING_DEPENDENCY, code: 'ORDERING_MISMATCH' },
  { key: 'persistence_ownership', value: PERSISTENCE_OWNERSHIP, code: 'PERSISTENCE_OWNER_MISMATCH' },
]);

function returnDestinationErrors(value, missionPath) {
  const path = 'handoff_contract.return_destination';
  const out = [];
  for (const defect of pathDefects(value)) out.push(error(path, 'RETURN_DESTINATION_MISMATCH', defect));
  if (value.split('/').pop() !== RESULT_BASENAME) {
    out.push(error(path, 'RETURN_DESTINATION_MISMATCH', 'nom de base exactement ' + RESULT_BASENAME + ' exigé'));
  }
  if (out.length > 0) return out;

  if (missionPath === undefined) {
    return [
      error(
        path,
        'HANDOFF_CONTEXT_REQUIRED',
        'chemin de mission.json requis : le répertoire de mission n’est pas établi, la validation n’est pas complète',
      ),
    ];
  }
  let expected;
  try {
    expected = canonicalReturnDestination(missionPath);
  } catch (caught) {
    return [error(path, caught.code, caught.message)];
  }
  if (value !== expected) {
    return [error(path, 'RETURN_DESTINATION_MISMATCH', 'même répertoire de mission exigé : attendu ' + expected)];
  }
  return [];
}

/**
 * Validation COMPLÈTE d'un handoff_contract présent. Un membre absent, en trop,
 * mal typé ou hors domaine est un refus : aucune valeur par défaut, aucune
 * réparation, aucune valeur de handoff additionnelle.
 */
export function validateHandoffContract(contract, options = {}) {
  const { missionPath } = options;
  const errors = [];
  if (!isPlainObject(contract)) {
    errors.push(error('handoff_contract', 'HANDOFF_CONTRACT_MALFORMED', 'objet attendu'));
    return { ok: false, errors };
  }
  for (const key of Object.keys(contract)) {
    if (!HANDOFF_CONTRACT_KEYS.includes(key)) {
      errors.push(
        error('handoff_contract.' + key, 'HANDOFF_CONTRACT_MALFORMED', 'membre inconnu : aucune valeur de handoff additionnelle'),
      );
    }
  }
  for (const key of HANDOFF_CONTRACT_KEYS) {
    if (!own(contract, key)) {
      errors.push(error('handoff_contract.' + key, 'HANDOFF_CONTRACT_INCOMPLETE', 'membre requis absent'));
    } else if (typeof contract[key] !== 'string') {
      errors.push(error('handoff_contract.' + key, 'HANDOFF_CONTRACT_MALFORMED', 'chaîne attendue'));
    }
  }
  for (const rule of DOMAIN_RULES) {
    if (typeof contract[rule.key] === 'string' && contract[rule.key] !== rule.value) {
      errors.push(
        error(
          'handoff_contract.' + rule.key,
          rule.code,
          'hors du domaine clos { ' + rule.value + ' } : ' + JSON.stringify(contract[rule.key]),
        ),
      );
    }
  }
  if (typeof contract.return_destination === 'string') {
    errors.push(...returnDestinationErrors(contract.return_destination, missionPath));
  }
  return { ok: errors.length === 0, errors };
}

/* ------------------------------------------------------------------ *
 * Validation V1 et acceptation V1-capable — IP-01 / IP-02
 * ------------------------------------------------------------------ */

/**
 * Validation d'un Mission Object V1 : représentation exacte, champs hérités
 * sous la validation V0 existante, et handoff_contract complet s'il est présent.
 */
export function validateMissionObjectV1(object, options = {}) {
  const { missionPath } = options;
  const errors = [];
  if (!isPlainObject(object)) {
    return { ok: false, errors: [error('', 'NOT_A_MISSION_OBJECT', 'un Mission Object est un objet JSON')], pHr01: null };
  }
  if (!isExactV1Representation(object.representation)) {
    errors.push(error('representation', 'UNKNOWN_REPRESENTATION', 'representation V1 exacte exigée'));
  }
  for (const entry of validateLegacyV0(inheritedFields(object)).errors) {
    errors.push(error(entry.path, 'INHERITED_FIELD_INVALID', entry.message));
  }
  const active = own(object, 'handoff_contract');
  if (active) errors.push(...validateHandoffContract(object.handoff_contract, { missionPath }).errors);
  return { ok: errors.length === 0, errors, pHr01: active ? 'ACTIVE' : 'INACTIVE' };
}

/**
 * Point d'entrée V1-capable : reconnaissance puis, selon le cas, acceptation.
 *
 *   A  accepté comme LEGACY_V0, sémantique V0, P-HR-01 NON APPLICABLE
 *   D  accepté comme V1 si la validation V1 passe, P-HR-01 ACTIVE ou INACTIVE
 *   B, C, E, F, et D invalide : rejeté
 */
export function acceptMissionObject(object, options = {}) {
  const recognition = recognizeRepresentation(object);
  if (recognition.case === 'A') {
    return {
      accepted: true,
      case: 'A',
      representation: 'LEGACY_V0',
      pHr01: 'NOT_APPLICABLE',
      errors: [],
    };
  }
  if (recognition.case !== 'D') {
    return {
      accepted: false,
      case: recognition.case,
      representation: null,
      pHr01: null,
      errors: recognition.errors,
    };
  }
  const validation = validateMissionObjectV1(object, options);
  return {
    accepted: validation.ok,
    case: 'D',
    representation: 'V1',
    pHr01: validation.ok ? validation.pHr01 : null,
    errors: validation.errors,
  };
}

/* ------------------------------------------------------------------ *
 * Rendu déterministe et inspection — IP-10
 * ------------------------------------------------------------------ */

function section(title) {
  return [title, '-'.repeat(title.length)];
}

function v1Sections(object) {
  const representation = [
    '',
    ...section('REPRÉSENTATION'),
    '  MISSION OBJECT V1   REPO_PATH ' + V1_AUTHORITY.path + '  GIT_BLOB ' + V1_AUTHORITY.blob,
    '  CHAMPS HÉRITÉS      sémantique V0 incorporée par référence : REPO_PATH ' +
      PINNED_V0_AUTHORITY.path +
      '  GIT_BLOB ' +
      PINNED_V0_AUTHORITY.blob,
  ];
  const title = section('P-HR-01 — CONTRAT DE HANDOFF');
  if (!own(object, 'handoff_contract')) {
    return { representation: [...representation, '', ...title, '  ÉTAT                        INACTIF — aucun handoff_contract'], handoff: [] };
  }
  const contract = object.handoff_contract;
  const handoff = [
    '',
    ...title,
    '  ÉTAT                        ACTIF — validation complète passée',
    '  version                     = ' + contract.version,
    '  next_control_stage          = ' +
      contract.next_control_stage +
      '   [assertion contre l’opération réellement demandée avant dispatch ; ne sélectionne rien]',
    '  return_destination          = ' + contract.return_destination,
    '  stage_ordering_dependency   = ' + contract.stage_ordering_dependency + '   [ ' + LIFECYCLE.join(' → ') + ' ]',
    '  persistence_ownership       = ' + contract.persistence_ownership,
  ];
  return { representation, handoff };
}

/**
 * Rend l'enveloppe d'un Mission Object V1 ACCEPTÉ, et sa trace.
 *
 * Les champs hérités sont rendus par le rendu V0 existant, inchangé ; les
 * sections V1 sont insérées après l'identité. Mêmes octets d'entrée, mêmes
 * octets de sortie.
 */
export function renderMissionObjectV1(object, options = {}) {
  const verdict = acceptMissionObject(object, options);
  if (!verdict.accepted || verdict.representation !== 'V1') {
    throw new MissionObjectV1Error('NOT_AN_ACCEPTED_V1', 'seul un Mission Object V1 accepté est rendu par ce rendu', {
      case: verdict.case,
      errors: verdict.errors,
    });
  }
  const base = renderV0(inheritedFields(object));
  const lines = base.text.split('\n');
  lines.pop(); /* le texte V0 se termine par une fin de ligne */
  const identity = base.trace.find((span) => span.path === 'identity');
  const at = identity.to;
  const { representation, handoff } = v1Sections(object);
  const inserted = [...representation, ...handoff];

  const trace = [];
  for (const span of base.trace) {
    if (span.to <= at) trace.push({ ...span });
  }
  trace.push({ path: 'representation', kind: 'representation', from: at, to: at + representation.length });
  if (handoff.length > 0) {
    trace.push({
      path: 'handoff_contract',
      kind: 'handoff_contract',
      from: at + representation.length,
      to: at + inserted.length,
    });
  }
  for (const span of base.trace) {
    if (span.to > at) trace.push({ ...span, from: span.from + inserted.length, to: span.to + inserted.length });
  }
  const text = [...lines.slice(0, at), ...inserted, ...lines.slice(at)].join('\n') + '\n';
  return { text, trace };
}

/** Éléments normatifs d'un objet V1 : ceux du schéma V0 hérité, plus les deux champs V1. */
export function normativeElementsV1(object) {
  const out = normativeElements(inheritedFields(object));
  out.push({ path: 'representation', kind: 'representation' });
  if (own(object, 'handoff_contract')) out.push({ path: 'handoff_contract', kind: 'handoff_contract' });
  return out;
}

/** Couverture de rendu V1 : deux parcours indépendants, un seul schéma. */
export function renderCoverageV1(object, options = {}) {
  const expected = new Set(normativeElementsV1(object).map((entry) => entry.path));
  const { trace } = renderMissionObjectV1(object, options);
  const traced = new Set(trace.map((span) => span.path));
  const omitted = [...expected].filter((path) => !traced.has(path));
  const invented = [...traced].filter((path) => !expected.has(path));
  const empty = trace.filter((span) => span.to <= span.from).map((span) => span.path);
  return {
    expected: expected.size,
    rendered: traced.size,
    omitted,
    invented,
    empty,
    complete: omitted.length === 0 && invented.length === 0 && empty.length === 0,
  };
}

/**
 * Rendu V1-capable : un LEGACY V0 est rendu par le rendu V0, octet pour octet ;
 * un V1 accepté par le rendu V1 ; tout le reste est refusé.
 */
export function renderAccepted(object, options = {}) {
  const verdict = acceptMissionObject(object, options);
  if (verdict.accepted && verdict.representation === 'LEGACY_V0') return renderV0(object);
  if (verdict.accepted && verdict.representation === 'V1') return renderMissionObjectV1(object, options);
  throw new MissionObjectV1Error('MISSION_OBJECT_REJECTED', 'Mission Object rejeté : cas ' + verdict.case, {
    case: verdict.case,
    errors: verdict.errors,
  });
}

/** Inspection déterministe : cas, représentation, verdict, état P-HR-01, contrat. */
export function inspect(object, options = {}) {
  const verdict = acceptMissionObject(object, options);
  const contract =
    verdict.accepted && verdict.pHr01 === 'ACTIVE'
      ? Object.fromEntries(HANDOFF_CONTRACT_KEYS.map((key) => [key, object.handoff_contract[key]]))
      : null;
  return {
    case: verdict.case,
    representation: verdict.representation,
    accepted: verdict.accepted,
    pHr01: verdict.pHr01,
    contract,
    errors: verdict.errors,
  };
}

/* ------------------------------------------------------------------ *
 * CLI
 * ------------------------------------------------------------------ */

const USAGE =
  'usage :\n' +
  '  v1.mjs inspect <mission.json> [--mission-path <chemin-relatif-au-depot>]\n' +
  '  v1.mjs render  <mission.json> [--mission-path <chemin-relatif-au-depot>]\n' +
  '\n' +
  'Le chemin de mission, relatif au depot, n est employe que pour verifier la\n' +
  'destination de retour d un handoff_contract present. Par defaut : le chemin\n' +
  'donne, s il est relatif.\n';

function defaultMissionPath(argument) {
  if (/^[A-Za-z]:/.test(argument) || argument.startsWith('/') || argument.startsWith('\\')) return undefined;
  return argument.split('\\').join('/');
}

export function main(argv) {
  const [command, file, ...rest] = argv;
  if (!['inspect', 'render'].includes(command) || !file) {
    process.stderr.write(USAGE);
    return 2;
  }
  let missionPath = defaultMissionPath(file);
  if (rest.length === 2 && rest[0] === '--mission-path') missionPath = rest[1];
  else if (rest.length !== 0) {
    process.stderr.write(USAGE);
    return 2;
  }

  let object;
  try {
    object = parse(readFileSync(file, 'utf8'));
  } catch (caught) {
    process.stderr.write('MALFORMED  ' + (caught instanceof MissionObjectError ? caught.message : String(caught.message)) + '\n');
    return 2;
  }

  if (command === 'render') {
    try {
      process.stdout.write(renderAccepted(object, { missionPath }).text);
      return 0;
    } catch (caught) {
      if (!(caught instanceof MissionObjectV1Error)) throw caught;
      process.stderr.write('REJET  ' + caught.code + '  cas ' + String(caught.details && caught.details.case) + '\n');
      return 1;
    }
  }

  const report = inspect(object, { missionPath });
  let text = '';
  text += 'CAS              ' + report.case + '\n';
  text += 'REPRESENTATION   ' + (report.representation ?? 'AUCUNE') + '\n';
  text += 'VERDICT          ' + (report.accepted ? 'ACCEPTE' : 'REJETE') + '\n';
  text += 'P-HR-01          ' + (report.pHr01 ?? 'NON ETABLI') + '\n';
  if (report.contract !== null) {
    for (const key of HANDOFF_CONTRACT_KEYS) text += '  ' + key.padEnd(27) + '= ' + report.contract[key] + '\n';
  }
  for (const entry of report.errors) text += 'ERREUR  ' + entry.code + '  ' + entry.path + '  ' + entry.message + '\n';
  process.stdout.write(text);
  return report.accepted ? 0 : 1;
}

if (process.argv[1] && /[\\/]mission-object[\\/]v1\.mjs$/.test(process.argv[1])) {
  process.exitCode = main(process.argv.slice(2));
}
