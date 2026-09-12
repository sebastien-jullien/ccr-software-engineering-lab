/**
 * TOOLING-EXPERIMENT-001 — tests unitaires de la v0.
 *
 * Ils qualifient le comportement du logiciel, et rien d'autre.
 * Le succès du dogfood est une autre question, et il n'est pas testable ici.
 *
 * Aucun état CCR réel, aucun fournisseur, aucun run protégé.
 * Chaque test qui a besoin d'un dépôt travaille dans un dépôt Git temporaire.
 */

import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  CREATABLE,
  OUTCOME,
  blobOf,
  canonicalize,
  check,
  checkEvidence,
  claimsOf,
  createDecision,
  load,
  main,
  parse,
  renderResume,
  save,
  serialize,
  update,
  writeAtomic,
  MalformedCheckpoint,
  UpdateRefused,
} from '../program-state.mjs';

/* ------------------------------------------------------------------ *
 * Harnais : dépôt Git temporaire
 * ------------------------------------------------------------------ */

const created = [];

function tempRepo() {
  const root = mkdtempSync(join(tmpdir(), 'program-state-'));
  created.push(root);
  execFileSync('git', ['-C', root, 'init', '-q']);
  execFileSync('git', ['-C', root, 'config', 'user.email', 'test@example.invalid']);
  execFileSync('git', ['-C', root, 'config', 'user.name', 'test']);
  writeFileSync(join(root, '.gitattributes'), '* text eol=lf\n');
  return root;
}

function commitAll(root, message) {
  execFileSync('git', ['-C', root, 'add', '-A']);
  execFileSync('git', ['-C', root, 'commit', '-q', '-m', message]);
  return execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
}

after(() => {
  for (const dir of created) rmSync(dir, { recursive: true, force: true });
});

function evidenceFor(subject, field, value, extra = {}) {
  return {
    id: extra.id || 'ev-1',
    kind: extra.kind || 'repo-path',
    ref: extra.ref || 'SOURCE.md',
    policy: extra.policy || 'VERIFIABLE',
    supports: { subject, field, value },
    ...(extra.observed ? { observed: extra.observed } : {}),
  };
}

function baseState(overrides = {}) {
  return {
    checkpoint: { format_version: 1, updated_at: '2026-09-12T00:00:00Z' },
    git_context: {
      repository: 'temp',
      branch: 'main',
      observed_base_head: 'aaaaaaaa',
      observed_base_tree: 'bbbbbbbb',
    },
    streams: [],
    decisions: [],
    next_action: { state: 'NOT_YET_SELECTED', evidence: [] },
    ...overrides,
  };
}

/* ------------------------------------------------------------------ *
 * Analyse et sérialisation
 * ------------------------------------------------------------------ */

test('JSON illisible lève MalformedCheckpoint', () => {
  assert.throws(() => parse('{ pas du json'), MalformedCheckpoint);
  assert.throws(() => parse('[]'), MalformedCheckpoint);
});

test('la sérialisation canonique est byte-stable sur un aller-retour', () => {
  const root = tempRepo();
  const file = join(root, 'PROGRAM-STATE.json');
  const state = baseState({
    streams: [
      {
        evidence: [],
        state: 'OPEN',
        id: 's1',
        updated_at: '2026-09-12T00:00:00Z',
        type: 'CASE',
        title: 'désordonné exprès',
      },
    ],
  });
  save(file, state);
  const first = readFileSync(file, 'utf8');
  save(file, load(file));
  const second = readFileSync(file, 'utf8');
  assert.equal(first, second, 'un aller-retour sans changement sémantique doit être byte-stable');
  assert.ok(first.endsWith('}\n'), 'un seul saut de ligne final');
  assert.ok(!first.includes('\r'), 'LF uniquement');
  assert.equal(first.split('\n')[1], '  "checkpoint": {', 'indentation 2 espaces');
});

test('l’ordre des clés est fixe, indépendamment de l’ordre d’insertion', () => {
  const a = canonicalize({ next_action: { state: 'UNKNOWN' }, checkpoint: { updated_at: 'x', format_version: 1 } });
  assert.deepEqual(Object.keys(a), ['checkpoint', 'next_action']);
  assert.deepEqual(Object.keys(a.checkpoint), ['format_version', 'updated_at']);
});

/* ------------------------------------------------------------------ *
 * Incertitude
 * ------------------------------------------------------------------ */

test('UNKNOWN, UNRESOLVED et NOT_YET_SELECTED sont acceptés, jamais coercés', () => {
  const root = tempRepo();
  commitAll(root, 'init');
  const state = baseState({
    streams: [{ id: 's1', title: 't', type: 'CASE', state: 'UNKNOWN', updated_at: 'UNKNOWN', evidence: [] }],
    decisions: [{ id: 'd1', question: 'q', state: 'UNRESOLVED', evidence: [] }],
    next_action: { state: 'NOT_YET_SELECTED', evidence: [] },
  });
  const report = check(state, root);
  assert.equal(
    report.findings.filter((f) => f.outcome === OUTCOME.MALFORMED).length,
    0,
    'les valeurs d’incertitude ne sont pas malformées',
  );
  assert.equal(state.streams[0].state, 'UNKNOWN', 'la valeur n’est pas réécrite');
});

test('une clôture affirmée sur une date inconnue est INCOMPLETE', () => {
  const root = tempRepo();
  writeFileSync(join(root, 'SOURCE.md'), 'source\n');
  commitAll(root, 'init');
  const state = baseState({
    streams: [
      {
        id: 's1',
        title: 't',
        type: 'CASE',
        state: 'CLOSED',
        updated_at: 'UNKNOWN',
        evidence: [evidenceFor('stream:s1', 'state', 'CLOSED')],
      },
    ],
  });
  const report = check(state, root);
  assert.ok(
    report.material.some((f) => f.outcome === OUTCOME.INCOMPLETE && f.subject === 'stream:s1'),
    'une clôture fabriquée sur un état insuffisant doit être rejetée',
  );
});

/* ------------------------------------------------------------------ *
 * Relation typée preuve → affirmation
 * ------------------------------------------------------------------ */

test('une référence qui existe ne soutient rien par sa seule existence', () => {
  const root = tempRepo();
  writeFileSync(join(root, 'EVALUATION.md'), 'contenu\n');
  commitAll(root, 'init');
  const state = baseState({
    streams: [
      {
        id: 'case-x',
        title: 't',
        type: 'CASE',
        state: 'CLOSED',
        updated_at: '2026-09-12T00:00:00Z',
        evidence: [
          {
            id: 'ev-1',
            kind: 'repo-path',
            ref: 'EVALUATION.md',
            policy: 'VERIFIABLE',
            supports: { subject: 'stream:case-x', field: 'title', value: 't' },
          },
        ],
      },
    ],
  });
  const report = check(state, root);
  const verdict = report.findings.find((f) => f.subject === 'stream:case-x' && f.field === 'state');
  assert.equal(verdict.outcome, OUTCOME.UNSUPPORTED, 'EVALUATION.md existe mais ne dit pas que l’état est CLOSED');
});

test('la preuve ne soutient que le triplet exact sujet / champ / valeur', () => {
  const root = tempRepo();
  writeFileSync(join(root, 'SOURCE.md'), 'source\n');
  commitAll(root, 'init');
  const state = baseState({
    streams: [
      {
        id: 's1',
        title: 't',
        type: 'CASE',
        state: 'CLOSED',
        updated_at: '2026-09-12T00:00:00Z',
        evidence: [evidenceFor('stream:s1', 'state', 'OPEN')],
      },
    ],
  });
  const verdict = check(state, root).findings.find((f) => f.subject === 'stream:s1' && f.field === 'state');
  assert.equal(verdict.outcome, OUTCOME.UNSUPPORTED, 'une preuve pour OPEN ne soutient pas CLOSED');
});

test('une preuve exacte et vérifiable rend l’affirmation CURRENT', () => {
  const root = tempRepo();
  writeFileSync(join(root, 'SOURCE.md'), 'source\n');
  commitAll(root, 'init');
  const blob = blobOf(root, 'SOURCE.md');
  const state = baseState({
    streams: [
      {
        id: 's1',
        title: 't',
        type: 'CASE',
        state: 'CLOSED',
        updated_at: '2026-09-12T00:00:00Z',
        evidence: [evidenceFor('stream:s1', 'state', 'CLOSED', { observed: { blob } })],
      },
    ],
  });
  const verdict = check(state, root).findings.find((f) => f.subject === 'stream:s1' && f.field === 'state');
  assert.equal(verdict.outcome, OUTCOME.CURRENT);
});

/* ------------------------------------------------------------------ *
 * Identité de contenu
 * ------------------------------------------------------------------ */

test('blobOf reproduit l’identité Git du contenu sous les attributs du chemin', () => {
  const root = tempRepo();
  writeFileSync(join(root, 'SOURCE.md'), 'a\nb\n');
  const head = commitAll(root, 'init');
  assert.ok(head);
  const indexBlob = execFileSync('git', ['-C', root, 'rev-parse', ':SOURCE.md'], { encoding: 'utf8' }).trim();
  assert.equal(blobOf(root, 'SOURCE.md'), indexBlob);
});

test('un contenu modifié produit SOURCE_CHANGED', () => {
  const root = tempRepo();
  writeFileSync(join(root, 'SOURCE.md'), 'avant\n');
  commitAll(root, 'init');
  const blob = blobOf(root, 'SOURCE.md');
  writeFileSync(join(root, 'SOURCE.md'), 'après\n');

  const entry = evidenceFor('stream:s1', 'state', 'CLOSED', { observed: { blob } });
  assert.equal(checkEvidence(entry, root).outcome, OUTCOME.SOURCE_CHANGED);
});

test('une référence de dépôt absente produit REFERENCE_MISSING', () => {
  const root = tempRepo();
  commitAll(root, 'init');
  const entry = evidenceFor('stream:s1', 'state', 'CLOSED', { ref: 'ABSENT.md' });
  assert.equal(checkEvidence(entry, root).outcome, OUTCOME.REFERENCE_MISSING);
});

/* ------------------------------------------------------------------ *
 * Contexte Git
 * ------------------------------------------------------------------ */

test('l’avancement de HEAD seul est informatif, jamais périmé ni contradictoire', () => {
  const root = tempRepo();
  writeFileSync(join(root, 'SOURCE.md'), 'source\n');
  const first = commitAll(root, 'init');
  const blob = blobOf(root, 'SOURCE.md');

  const state = baseState({
    git_context: {
      repository: 'temp',
      branch: 'main',
      observed_base_head: first,
      observed_base_tree: 'ignoré',
    },
    streams: [
      {
        id: 's1',
        title: 't',
        type: 'CASE',
        state: 'CLOSED',
        updated_at: '2026-09-12T00:00:00Z',
        evidence: [evidenceFor('stream:s1', 'state', 'CLOSED', { observed: { blob } })],
      },
    ],
  });

  writeFileSync(join(root, 'UNRELATED.md'), 'sans rapport\n');
  const second = commitAll(root, 'commit sans rapport');
  assert.notEqual(first, second);

  const report = check(state, root);
  assert.equal(report.exitCode, 0, 'HEAD qui avance ne doit pas faire échouer check');
  assert.equal(report.material.length, 0);
  assert.ok(
    report.findings.some((f) => f.outcome === OUTCOME.REPOSITORY_ADVANCED),
    'l’avancement est signalé, mais seulement comme information',
  );
});

/* ------------------------------------------------------------------ *
 * Politiques d'accès
 * ------------------------------------------------------------------ */

test('une preuve SEALED n’est jamais déréférencée', () => {
  const root = tempRepo();
  commitAll(root, 'init');

  /* Deux pièges mécaniques. Si la source était ouverte, chacun produirait un
   * constat distinct et reconnaissable. */
  writeFileSync(join(root, 'SEALED-PRESENT.md'), 'ne doit pas être lu\n');

  const present = {
    id: 'ev-sealed-1',
    kind: 'repo-path',
    ref: 'SEALED-PRESENT.md',
    policy: 'SEALED',
    supports: { subject: 'stream:s1', field: 'state', value: 'CLOSED' },
    observed: { blob: '0000000000000000000000000000000000000000' },
  };
  const absent = {
    id: 'ev-sealed-2',
    kind: 'repo-path',
    ref: 'SEALED-ABSENT.md',
    policy: 'SEALED',
    supports: { subject: 'stream:s1', field: 'state', value: 'CLOSED' },
  };

  assert.equal(existsSync(join(root, 'SEALED-PRESENT.md')), true);
  assert.equal(existsSync(join(root, 'SEALED-ABSENT.md')), false);

  const onPresent = checkEvidence(present, root);
  const onAbsent = checkEvidence(absent, root);

  assert.equal(onPresent.outcome, OUTCOME.UNVERIFIED);
  assert.notEqual(
    onPresent.outcome,
    OUTCOME.SOURCE_CHANGED,
    'le blob enregistré est volontairement faux : un SOURCE_CHANGED prouverait une lecture',
  );
  assert.equal(onAbsent.outcome, OUTCOME.UNVERIFIED);
  assert.notEqual(
    onAbsent.outcome,
    OUTCOME.REFERENCE_MISSING,
    'la référence est absente : un REFERENCE_MISSING prouverait une résolution',
  );
});

test('une preuve SEALED soutient toujours l’affirmation sans la rendre UNSUPPORTED', () => {
  const root = tempRepo();
  commitAll(root, 'init');
  const state = baseState({
    streams: [
      {
        id: 's13',
        title: 'session',
        type: 'SESSION',
        state: 'CLOSED',
        updated_at: '2026-09-12T00:00:00Z',
        evidence: [
          evidenceFor('stream:s13', 'state', 'CLOSED', {
            id: 'ev-sealed',
            kind: 'session',
            ref: 'RUN-PROTECTED',
            policy: 'SEALED',
          }),
        ],
      },
    ],
  });
  const verdict = check(state, root).findings.find((f) => f.subject === 'stream:s13' && f.field === 'state');
  assert.equal(verdict.outcome, OUTCOME.UNVERIFIED);
  assert.notEqual(verdict.outcome, OUTCOME.UNSUPPORTED);
  assert.equal(check(state, root).exitCode, 0, 'une limite de vérification n’est pas un échec matériel');
});

test('OPAQUE_BUT_ESTABLISHED ne déréférence pas et ne devient pas UNSUPPORTED', () => {
  const root = tempRepo();
  commitAll(root, 'init');
  const entry = evidenceFor('stream:s1', 'state', 'CLOSED', {
    kind: 'session',
    ref: 'AGENT CCR LAB #12',
    policy: 'OPAQUE_BUT_ESTABLISHED',
  });
  assert.equal(checkEvidence(entry, root).outcome, OUTCOME.UNVERIFIED);
});

test('une preuve externe vérifiable mais absente est UNREACHABLE, et n’invalide pas l’histoire', () => {
  const root = tempRepo();
  commitAll(root, 'init');
  const missing = join(root, 'scratch', 'artifact.json');
  assert.equal(existsSync(missing), false);

  const state = baseState({
    streams: [
      {
        id: 's1',
        title: 't',
        type: 'CASE',
        state: 'CLOSED',
        updated_at: '2026-09-12T00:00:00Z',
        evidence: [
          evidenceFor('stream:s1', 'state', 'CLOSED', {
            kind: 'external-artifact',
            ref: missing,
            policy: 'VERIFIABLE',
          }),
        ],
      },
    ],
  });
  const report = check(state, root);
  const verdict = report.findings.find((f) => f.subject === 'stream:s1' && f.field === 'state');
  assert.equal(verdict.outcome, OUTCOME.UNREACHABLE, 'inaccessible aujourd’hui');
  assert.equal(report.material.length, 0, 'inaccessible n’est pas historiquement faux');
  assert.equal(report.exitCode, 0);
});

/* ------------------------------------------------------------------ *
 * Recommandation et ratification
 * ------------------------------------------------------------------ */

test('une recommandation ne peut pas prouver RATIFIED', () => {
  const root = tempRepo();
  writeFileSync(join(root, 'RECO.md'), 'je recommande\n');
  commitAll(root, 'init');
  const state = baseState({
    decisions: [
      {
        id: 'd1',
        question: 'faut-il faire X ?',
        state: 'RATIFIED',
        evidence: [
          evidenceFor('decision:d1', 'state', 'RATIFIED', { kind: 'recommendation', ref: 'RECO.md' }),
        ],
      },
    ],
  });
  const verdict = check(state, root).findings.find((f) => f.subject === 'decision:d1');
  assert.equal(verdict.outcome, OUTCOME.UNSUPPORTED, 'une recommandation n’est pas une ratification');
});

/* ------------------------------------------------------------------ *
 * Contradiction
 * ------------------------------------------------------------------ */

test('deux valeurs soutenues et incompatibles produisent une contradiction', () => {
  const root = tempRepo();
  writeFileSync(join(root, 'A.md'), 'a\n');
  writeFileSync(join(root, 'B.md'), 'b\n');
  commitAll(root, 'init');
  const state = baseState({
    streams: [
      {
        id: 's1',
        title: 't',
        type: 'CASE',
        state: 'CLOSED',
        updated_at: '2026-09-12T00:00:00Z',
        evidence: [
          evidenceFor('stream:s1', 'state', 'CLOSED', { id: 'ev-a', ref: 'A.md' }),
          evidenceFor('stream:s1', 'state', 'OPEN', { id: 'ev-b', ref: 'B.md' }),
        ],
      },
    ],
  });
  const report = check(state, root);
  assert.ok(report.material.some((f) => f.outcome === OUTCOME.CONTRADICTION));
});

test('un fichier qui existe ne crée aucune contradiction', () => {
  const root = tempRepo();
  writeFileSync(join(root, 'EVALUATION.md'), 'présent\n');
  commitAll(root, 'init');
  const blob = blobOf(root, 'EVALUATION.md');
  const state = baseState({
    streams: [
      {
        id: 's1',
        title: 't',
        type: 'CASE',
        state: 'OPEN',
        updated_at: '2026-09-12T00:00:00Z',
        evidence: [
          evidenceFor('stream:s1', 'state', 'OPEN', { ref: 'EVALUATION.md', observed: { blob } }),
        ],
      },
    ],
  });
  const report = check(state, root);
  assert.equal(
    report.findings.filter((f) => f.outcome === OUTCOME.CONTRADICTION).length,
    0,
    'la présence d’un fichier n’est pas une affirmation incompatible',
  );
  assert.equal(report.exitCode, 0);
});

/* ------------------------------------------------------------------ *
 * update
 * ------------------------------------------------------------------ */

test('update refuse un changement substantiel sans preuve', () => {
  const state = baseState({
    streams: [{ id: 's1', title: 't', type: 'CASE', state: 'OPEN', updated_at: 'x', evidence: [] }],
  });
  assert.throws(
    () => update(state, { subject: 'stream:s1', field: 'state', value: 'CLOSED', evidence: [], now: 'N' }),
    UpdateRefused,
  );
  assert.equal(state.streams[0].state, 'OPEN', 'l’état n’a pas bougé');
});

test('update refuse un sujet inconnu et une valeur illégale', () => {
  const state = baseState({
    streams: [{ id: 's1', title: 't', type: 'CASE', state: 'OPEN', updated_at: 'x', evidence: [] }],
  });
  assert.throws(() => update(state, { subject: 'stream:absent', field: 'state', value: 'CLOSED', now: 'N' }), UpdateRefused);
  assert.throws(
    () =>
      update(state, {
        subject: 'stream:s1',
        field: 'state',
        value: 'INVENTÉ',
        evidence: [evidenceFor('stream:s1', 'state', 'INVENTÉ')],
        now: 'N',
      }),
    UpdateRefused,
  );
});

test('update refuse une recommandation comme preuve de ratification', () => {
  const state = baseState({
    decisions: [{ id: 'd1', question: 'q', state: 'PENDING', evidence: [] }],
  });
  assert.throws(
    () =>
      update(state, {
        subject: 'decision:d1',
        field: 'state',
        value: 'RATIFIED',
        evidence: [evidenceFor('decision:d1', 'state', 'RATIFIED', { kind: 'recommendation' })],
        now: 'N',
      }),
    UpdateRefused,
  );
  assert.equal(state.decisions[0].state, 'PENDING');
});

test('update accepte avec preuve, estampille, et n’écrit que le point de reprise', () => {
  const root = tempRepo();
  writeFileSync(join(root, 'SOURCE.md'), 'source\n');
  writeFileSync(join(root, 'AUTRE.md'), 'intact\n');
  commitAll(root, 'init');
  const file = join(root, 'PROGRAM-STATE.json');

  const state = baseState({
    streams: [{ id: 's1', title: 't', type: 'CASE', state: 'OPEN', updated_at: 'avant', evidence: [] }],
  });
  save(file, state);
  const otherBefore = readFileSync(join(root, 'AUTRE.md'), 'utf8');

  const loaded = load(file);
  update(loaded, {
    subject: 'stream:s1',
    field: 'state',
    value: 'CLOSED',
    evidence: [evidenceFor('stream:s1', 'state', 'CLOSED')],
    now: '2026-09-12T12:00:00Z',
  });
  save(file, loaded);

  const after = load(file);
  assert.equal(after.streams[0].state, 'CLOSED');
  assert.equal(after.streams[0].updated_at, '2026-09-12T12:00:00Z', 'estampille mécanique du flux');
  assert.equal(after.checkpoint.updated_at, '2026-09-12T12:00:00Z', 'estampille mécanique du point de reprise');
  assert.equal(after.streams[0].evidence.length, 1, 'la preuve fournie est conservée');
  assert.equal(readFileSync(join(root, 'AUTRE.md'), 'utf8'), otherBefore, 'aucun autre fichier touché');
});

/* ------------------------------------------------------------------ *
 * resume
 * ------------------------------------------------------------------ */

test('resume rend d’abord ce qui est en attente ou non résolu', () => {
  const root = tempRepo();
  writeFileSync(join(root, 'SOURCE.md'), 'source\n');
  commitAll(root, 'init');
  const state = baseState({
    streams: [{ id: 's1', title: 'flux', type: 'CASE', state: 'OPEN', updated_at: 'x', evidence: [] }],
    decisions: [{ id: 'd1', question: 'faut-il continuer ?', state: 'PENDING', evidence: [] }],
  });
  const text = renderResume(state, root);
  const pendingAt = text.indexOf('EN ATTENTE ET NON RÉSOLU');
  const streamsAt = text.indexOf('FLUX');
  const nextAt = text.indexOf('ACTION SUIVANTE');
  assert.ok(pendingAt >= 0 && streamsAt > pendingAt, 'les éléments en attente viennent avant les flux');
  assert.ok(nextAt > streamsAt);
  assert.ok(text.includes('DÉCISION EN ATTENTE'));
  assert.ok(text.includes('faut-il continuer ?'));
});

test('resume rend NOT_YET_SELECTED honnêtement et énonce son angle mort', () => {
  const root = tempRepo();
  commitAll(root, 'init');
  const text = renderResume(baseState(), root);
  assert.ok(text.includes('NOT_YET_SELECTED'), 'l’absence de choix est dite, pas inventée');
  assert.ok(text.includes('ANGLE MORT'), 'l’outil énonce sa propre limite');
  assert.ok(text.includes('personne n’a consigné'));
});

test('resume expose les références de preuve et ce qui n’a pas pu être vérifié', () => {
  const root = tempRepo();
  commitAll(root, 'init');
  const state = baseState({
    streams: [
      {
        id: 's1',
        title: 'flux',
        type: 'CASE',
        state: 'CLOSED',
        updated_at: '2026-09-12T00:00:00Z',
        evidence: [
          evidenceFor('stream:s1', 'state', 'CLOSED', {
            kind: 'session',
            ref: 'AGENT CCR LAB #12',
            policy: 'OPAQUE_BUT_ESTABLISHED',
          }),
        ],
      },
    ],
  });
  const text = renderResume(state, root);
  assert.ok(text.includes('RÉFÉRENCES DE PREUVE'));
  assert.ok(text.includes('AGENT CCR LAB #12'));
  assert.ok(text.includes('NON VÉRIFIÉ MÉCANIQUEMENT'));
  assert.ok(text.includes(OUTCOME.UNVERIFIED));
});

/* ------------------------------------------------------------------ *
 * Structure
 * ------------------------------------------------------------------ */

test('un état hors vocabulaire est MALFORMED', () => {
  const root = tempRepo();
  commitAll(root, 'init');
  const state = baseState({
    streams: [{ id: 's1', title: 't', type: 'CASE', state: 'PRESQUE_FINI', updated_at: 'x', evidence: [] }],
  });
  const report = check(state, root);
  assert.ok(report.material.some((f) => f.outcome === OUTCOME.MALFORMED));
  assert.notEqual(report.exitCode, 0);
});

test('claimsOf n’émet la valeur d’action suivante que lorsqu’elle est SELECTED', () => {
  const withoutValue = claimsOf(baseState());
  assert.equal(withoutValue.filter((c) => c.subject === 'next_action').length, 1);

  const withValue = claimsOf(
    baseState({ next_action: { state: 'SELECTED', value: 'faire X', evidence: [] } }),
  );
  assert.equal(withValue.filter((c) => c.subject === 'next_action').length, 2);
});

test('une action SELECTED sans valeur est INCOMPLETE', () => {
  const root = tempRepo();
  commitAll(root, 'init');
  const state = baseState({ next_action: { state: 'SELECTED', evidence: [] } });
  const report = check(state, root);
  assert.ok(report.material.some((f) => f.outcome === OUTCOME.INCOMPLETE && f.subject === 'next_action'));
});

/* ------------------------------------------------------------------ *
 * Amendement 001 — création explicite d'une décision
 * ------------------------------------------------------------------ */

function checkpointOnDisk(root) {
  const file = join(root, 'PROGRAM-STATE.json');
  const state = baseState({
    streams: [{ id: 's1', title: 't', type: 'CASE', state: 'OPEN', updated_at: 'x', evidence: [] }],
  });
  save(file, state);
  return file;
}

function createEvidence(id, value, extra = {}) {
  return {
    id: 'ev-new',
    kind: extra.kind || 'decision',
    ref: extra.ref || 'ratification humaine explicite',
    policy: extra.policy || 'OPAQUE_BUT_ESTABLISHED',
    supports: { subject: 'decision:' + id, field: 'state', value },
  };
}

function createArgs(file, id, question, state, evidence) {
  const args = ['update', file, '--create', 'decision'];
  if (id !== null) args.push('--id', id);
  if (question !== null) args.push('--question', question);
  if (state !== null) args.push('--state', state);
  if (evidence !== null) args.push('--evidence', JSON.stringify(evidence));
  return args;
}

test('création d’une décision RATIFIED réussie', () => {
  const root = tempRepo();
  commitAll(root, 'init');
  const file = checkpointOnDisk(root);

  const code = main(createArgs(file, 'd-new', 'faut-il accepter ?', 'RATIFIED', createEvidence('d-new', 'RATIFIED')));
  assert.equal(code, 0);

  const after = load(file);
  assert.equal(after.decisions.length, 1);
  assert.equal(after.decisions[0].id, 'd-new');
  assert.equal(after.decisions[0].state, 'RATIFIED');
  assert.equal(after.decisions[0].question, 'faut-il accepter ?');
  assert.equal(after.decisions[0].evidence.length, 1, 'la preuve fournie est conservée');
  assert.notEqual(after.checkpoint.updated_at, '2026-09-12T00:00:00Z', 'métadonnée estampillée');
});

test('création d’une décision PENDING réussie', () => {
  const root = tempRepo();
  commitAll(root, 'init');
  const file = checkpointOnDisk(root);

  const code = main(createArgs(file, 'd-pend', 'question ouverte ?', 'PENDING', createEvidence('d-pend', 'PENDING')));
  assert.equal(code, 0);
  assert.equal(load(file).decisions[0].state, 'PENDING');
});

test('identifiant dupliqué rejeté, octets inchangés', () => {
  const root = tempRepo();
  commitAll(root, 'init');
  const file = checkpointOnDisk(root);
  main(createArgs(file, 'd-dup', 'q', 'RATIFIED', createEvidence('d-dup', 'RATIFIED')));

  const before = readFileSync(file);
  const code = main(createArgs(file, 'd-dup', 'q bis', 'RATIFIED', createEvidence('d-dup', 'RATIFIED')));
  assert.equal(code, 2);
  assert.deepEqual(readFileSync(file), before, 'échec de création = 0 octet écrit');
  assert.equal(load(file).decisions.length, 1);
});

test('type de création inconnu rejeté — aucune création de flux', () => {
  const root = tempRepo();
  commitAll(root, 'init');
  const file = checkpointOnDisk(root);
  const before = readFileSync(file);

  for (const type of ['stream', 'streams', 'evidence', 'next_action', 'collection']) {
    const code = main(['update', file, '--create', type, '--id', 'x', '--question', 'q', '--state', 'RATIFIED']);
    assert.equal(code, 2, 'création refusée pour le type ' + type);
  }
  assert.deepEqual(readFileSync(file), before);
  assert.deepEqual(CREATABLE, ['decision'], 'une seule collection créable, gelée');
});

test('champs requis absents rejetés', () => {
  const root = tempRepo();
  commitAll(root, 'init');
  const file = checkpointOnDisk(root);
  const before = readFileSync(file);

  assert.equal(main(createArgs(file, null, 'q', 'RATIFIED', createEvidence('x', 'RATIFIED'))), 2, 'id absent');
  assert.equal(main(createArgs(file, 'd1', null, 'RATIFIED', createEvidence('d1', 'RATIFIED'))), 2, 'question absente');
  assert.deepEqual(readFileSync(file), before);
});

test('état illégal à la création rejeté, y compris les valeurs d’incertitude', () => {
  const root = tempRepo();
  commitAll(root, 'init');
  const file = checkpointOnDisk(root);
  const before = readFileSync(file);

  for (const value of ['UNKNOWN', 'UNRESOLVED', 'CLOSED', 'INVENTÉ']) {
    const code = main(createArgs(file, 'd1', 'q', value, createEvidence('d1', value)));
    assert.equal(code, 2, 'état refusé à la création : ' + value);
  }
  assert.deepEqual(readFileSync(file), before);
});

test('preuve absente ou ne soutenant pas l’état exact rejetée', () => {
  const root = tempRepo();
  commitAll(root, 'init');
  const file = checkpointOnDisk(root);
  const before = readFileSync(file);

  assert.equal(main(createArgs(file, 'd1', 'q', 'RATIFIED', null)), 2, 'aucune preuve');
  assert.equal(main(createArgs(file, 'd1', 'q', 'RATIFIED', [])), 2, 'preuve vide');
  assert.equal(
    main(createArgs(file, 'd1', 'q', 'RATIFIED', createEvidence('d1', 'PENDING'))),
    2,
    'la preuve soutient un autre état',
  );
  assert.equal(
    main(createArgs(file, 'd1', 'q', 'RATIFIED', createEvidence('autre', 'RATIFIED'))),
    2,
    'la preuve soutient un autre sujet',
  );
  assert.equal(
    main(createArgs(file, 'd1', 'q', 'RATIFIED', createEvidence('d1', 'RATIFIED', { kind: 'recommendation' }))),
    2,
    'une recommandation ne peut pas créer une ratification',
  );
  assert.deepEqual(readFileSync(file), before);
});

test('la validation porte sur le point de reprise candidat ENTIER', () => {
  const root = tempRepo();
  commitAll(root, 'init');
  const file = join(root, 'PROGRAM-STATE.json');

  /* Le point de reprise contient déjà un flux hors vocabulaire : la décision
   * ajoutée est correcte en elle-même, mais le candidat entier ne l'est pas. */
  const broken = baseState({
    streams: [{ id: 's1', title: 't', type: 'CASE', state: 'PRESQUE_FINI', updated_at: 'x', evidence: [] }],
  });
  writeFileSync(file, JSON.stringify(broken, null, 2) + '\n');
  const before = readFileSync(file);

  const code = main(createArgs(file, 'd1', 'q', 'RATIFIED', createEvidence('d1', 'RATIFIED')));
  assert.equal(code, 2, 'candidat entier invalide');
  assert.deepEqual(readFileSync(file), before, 'rien n’est écrit');

  const candidateError = () =>
    createDecision(broken, {
      id: 'd1',
      question: 'q',
      decisionState: 'RATIFIED',
      evidence: [createEvidence('d1', 'RATIFIED')],
      now: 'N',
    });
  assert.throws(candidateError, UpdateRefused);
});

test('la mutation ordinaire d’un identifiant inconnu reste rejetée', () => {
  const root = tempRepo();
  commitAll(root, 'init');
  const file = checkpointOnDisk(root);
  const before = readFileSync(file);

  const code = main([
    'update', file,
    '--subject', 'decision:jamais-cree',
    '--field', 'state',
    '--value', 'RATIFIED',
    '--evidence', JSON.stringify(createEvidence('jamais-cree', 'RATIFIED')),
  ]);
  assert.equal(code, 2, 'sans --create, un identifiant inconnu est une erreur');
  assert.deepEqual(readFileSync(file), before, 'aucun upsert implicite');
  assert.equal(load(file).decisions.length, 0);
});

test('le remplacement est atomique et laisse un JSON complet et valide', () => {
  const root = tempRepo();
  commitAll(root, 'init');
  const file = checkpointOnDisk(root);

  /* Propriété exigée, vérifiée mécaniquement sur cette plateforme :
   * renommer par-dessus une destination existante réussit et laisse un
   * instantané complet — jamais un JSON tronqué. */
  const code = main(createArgs(file, 'd-atom', 'q', 'RATIFIED', createEvidence('d-atom', 'RATIFIED')));
  assert.equal(code, 0);

  const text = readFileSync(file, 'utf8');
  assert.ok(text.startsWith('{\n'), 'début complet');
  assert.ok(text.endsWith('}\n'), 'fin complète, un seul saut de ligne');
  assert.doesNotThrow(() => JSON.parse(text), 'JSON intégralement analysable');
  assert.equal(load(file).decisions[0].id, 'd-atom');

  const leftovers = readdirSync(root).filter((name) => name.includes('.tmp-'));
  assert.deepEqual(leftovers, [], 'aucun fichier temporaire résiduel');

  /* writeAtomic écrase bien une destination existante, sur cette plateforme. */
  const probe = join(root, 'probe.txt');
  writeFileSync(probe, 'ancien contenu\n');
  writeAtomic(probe, 'nouveau contenu\n');
  assert.equal(readFileSync(probe, 'utf8'), 'nouveau contenu\n');
  assert.deepEqual(readdirSync(root).filter((n) => n.includes('.tmp-')), []);
});

test('la création n’altère aucune décision existante', () => {
  const root = tempRepo();
  commitAll(root, 'init');
  const file = join(root, 'PROGRAM-STATE.json');
  const state = baseState({
    decisions: [
      {
        id: 'd-exist',
        question: 'déjà là ?',
        state: 'RATIFIED',
        evidence: [createEvidence('d-exist', 'RATIFIED')],
      },
    ],
  });
  save(file, state);

  assert.equal(main(createArgs(file, 'd-new', 'q', 'PENDING', createEvidence('d-new', 'PENDING'))), 0);
  const after = load(file);
  assert.equal(after.decisions.length, 2);
  assert.equal(after.decisions[0].id, 'd-exist');
  assert.equal(after.decisions[0].state, 'RATIFIED');
  assert.equal(after.decisions[1].id, 'd-new');
});

/* ------------------------------------------------------------------ *
 * Amendement 002 — supersession du soutien actif et rafraîchissement
 * ------------------------------------------------------------------ */

test('ANCIEN → NOUVEAU : l’ancien soutien est retiré, le nouveau est actif, sans contradiction', () => {
  const root = tempRepo();
  writeFileSync(join(root, 'SOURCE.md'), 'source\n');
  commitAll(root, 'init');

  const state = baseState({
    streams: [
      {
        id: 's1',
        title: 't',
        type: 'CASE',
        state: 'OPEN',
        updated_at: '2026-09-12T00:00:00Z',
        evidence: [evidenceFor('stream:s1', 'state', 'OPEN', { id: 'ev-old', ref: 'SOURCE.md' })],
      },
    ],
  });

  update(state, {
    subject: 'stream:s1',
    field: 'state',
    value: 'CLOSED',
    evidence: [evidenceFor('stream:s1', 'state', 'CLOSED', { id: 'ev-new', ref: 'SOURCE.md' })],
    now: '2026-09-12T12:00:00Z',
  });

  const ids = state.streams[0].evidence.map((e) => e.id);
  assert.deepEqual(ids, ['ev-new'], 'le soutien de l’ancienne valeur n’est plus actif');
  assert.equal(state.streams[0].state, 'CLOSED');

  const report = check(state, root);
  assert.equal(
    report.findings.filter((f) => f.outcome === OUTCOME.CONTRADICTION).length,
    0,
    'plus aucune valeur concurrente soutenue',
  );
  assert.equal(report.material.length, 0);
});

test('rafraîchissement à valeur égale : accepté, ancien soutien retiré, nouveau actif', () => {
  const root = tempRepo();
  writeFileSync(join(root, 'A.md'), 'a\n');
  writeFileSync(join(root, 'B.md'), 'b\n');
  commitAll(root, 'init');

  const state = baseState({
    streams: [
      {
        id: 's1',
        title: 't',
        type: 'CASE',
        state: 'IMPLEMENTED',
        updated_at: 'avant',
        evidence: [evidenceFor('stream:s1', 'state', 'IMPLEMENTED', { id: 'ev-a', ref: 'A.md' })],
      },
    ],
  });

  update(state, {
    subject: 'stream:s1',
    field: 'state',
    value: 'IMPLEMENTED',
    evidence: [evidenceFor('stream:s1', 'state', 'IMPLEMENTED', { id: 'ev-b', ref: 'B.md' })],
    now: '2026-09-12T12:00:00Z',
  });

  assert.equal(state.streams[0].state, 'IMPLEMENTED', 'la valeur sémantique ne bouge pas');
  assert.deepEqual(
    state.streams[0].evidence.map((e) => e.id),
    ['ev-b'],
    'une valeur égale avec provenance nouvelle n’est pas une opération vide',
  );
  assert.equal(state.streams[0].updated_at, '2026-09-12T12:00:00Z');
});

test('le soutien d’un AUTRE champ du même sujet est préservé', () => {
  const root = tempRepo();
  writeFileSync(join(root, 'SOURCE.md'), 'source\n');
  commitAll(root, 'init');

  const state = baseState({
    next_action: {
      state: 'SELECTED',
      value: 'ANCIENNE ACTION',
      evidence: [
        evidenceFor('next_action', 'state', 'SELECTED', { id: 'ev-state', ref: 'SOURCE.md' }),
        evidenceFor('next_action', 'value', 'ANCIENNE ACTION', { id: 'ev-old-value', ref: 'SOURCE.md' }),
      ],
    },
  });

  update(state, {
    subject: 'next_action',
    field: 'value',
    value: 'NOUVELLE ACTION',
    evidence: [evidenceFor('next_action', 'value', 'NOUVELLE ACTION', { id: 'ev-new-value', ref: 'SOURCE.md' })],
    now: 'N',
  });

  const ids = state.next_action.evidence.map((e) => e.id).sort();
  assert.deepEqual(ids, ['ev-new-value', 'ev-state'], 'seul le soutien du champ visé est remplacé');
  assert.equal(state.next_action.state, 'SELECTED');
  assert.equal(state.next_action.value, 'NOUVELLE ACTION');
});

test('le soutien d’un AUTRE sujet est préservé', () => {
  const root = tempRepo();
  writeFileSync(join(root, 'SOURCE.md'), 'source\n');
  commitAll(root, 'init');

  const state = baseState({
    streams: [
      {
        id: 's1',
        title: 't1',
        type: 'CASE',
        state: 'OPEN',
        updated_at: 'x',
        evidence: [evidenceFor('stream:s1', 'state', 'OPEN', { id: 'ev-s1', ref: 'SOURCE.md' })],
      },
      {
        id: 's2',
        title: 't2',
        type: 'CASE',
        state: 'OPEN',
        updated_at: 'x',
        evidence: [evidenceFor('stream:s2', 'state', 'OPEN', { id: 'ev-s2', ref: 'SOURCE.md' })],
      },
    ],
  });

  update(state, {
    subject: 'stream:s1',
    field: 'state',
    value: 'CLOSED',
    evidence: [evidenceFor('stream:s1', 'state', 'CLOSED', { id: 'ev-s1b', ref: 'SOURCE.md' })],
    now: '2026-09-12T12:00:00Z',
  });

  assert.deepEqual(state.streams[1].evidence.map((e) => e.id), ['ev-s2'], 'l’autre sujet est intact');
  assert.equal(state.streams[1].state, 'OPEN');
});

test('preuve de remplacement invalide : point de reprise inchangé, octet pour octet', () => {
  const root = tempRepo();
  writeFileSync(join(root, 'SOURCE.md'), 'source\n');
  commitAll(root, 'init');
  const file = join(root, 'PROGRAM-STATE.json');
  save(
    file,
    baseState({
      streams: [
        {
          id: 's1',
          title: 't',
          type: 'CASE',
          state: 'OPEN',
          updated_at: 'x',
          evidence: [evidenceFor('stream:s1', 'state', 'OPEN', { id: 'ev-old', ref: 'SOURCE.md' })],
        },
      ],
    }),
  );
  const before = readFileSync(file);

  const code = main([
    'update', file,
    '--subject', 'stream:s1',
    '--field', 'state',
    '--value', 'CLOSED',
    '--evidence', JSON.stringify(evidenceFor('stream:s1', 'state', 'OPEN', { ref: 'SOURCE.md' })),
  ]);
  assert.equal(code, 2, 'la preuve soutient l’ancienne valeur, pas la nouvelle');
  assert.deepEqual(readFileSync(file), before, 'aucun octet écrit');
});

test('échec de validation du candidat ENTIER : point de reprise inchangé', () => {
  const root = tempRepo();
  writeFileSync(join(root, 'SOURCE.md'), 'source\n');
  commitAll(root, 'init');
  const file = join(root, 'PROGRAM-STATE.json');
  save(file, baseState({ next_action: { state: 'NOT_YET_SELECTED', evidence: [] } }));
  const before = readFileSync(file);

  /* Passer à SELECTED sans valeur rend le candidat entier INCOMPLETE. */
  const code = main([
    'update', file,
    '--subject', 'next_action',
    '--field', 'state',
    '--value', 'SELECTED',
    '--evidence', JSON.stringify(evidenceFor('next_action', 'state', 'SELECTED', { ref: 'SOURCE.md' })),
  ]);
  assert.equal(code, 2);
  assert.deepEqual(readFileSync(file), before, 'aucun état intermédiaire persisté');
  assert.equal(load(file).next_action.state, 'NOT_YET_SELECTED');
});

test('SOURCE_CHANGED est matériel avant rafraîchissement, et résolu après', () => {
  const root = tempRepo();
  writeFileSync(join(root, 'TOOL.mjs'), 'version 1\n');
  commitAll(root, 'init');
  const blobBefore = blobOf(root, 'TOOL.mjs');
  const file = join(root, 'PROGRAM-STATE.json');

  save(
    file,
    baseState({
      streams: [
        {
          id: 'tool',
          title: 'outil',
          type: 'TOOLING_EXPERIMENT',
          state: 'IMPLEMENTED',
          updated_at: '2026-09-12T00:00:00Z',
          evidence: [
            evidenceFor('stream:tool', 'state', 'IMPLEMENTED', {
              id: 'ev-v1',
              ref: 'TOOL.mjs',
              observed: { blob: blobBefore },
            }),
          ],
        },
      ],
    }),
  );

  /* La source change légitimement : l'affirmation reste vraie, la provenance
   * devient périmée. Le détecteur doit le dire. */
  writeFileSync(join(root, 'TOOL.mjs'), 'version 2 amendée\n');
  const blobAfter = blobOf(root, 'TOOL.mjs');
  assert.notEqual(blobAfter, blobBefore);

  const beforeRefresh = check(load(file), root);
  assert.ok(
    beforeRefresh.material.some(
      (f) => f.outcome === OUTCOME.SOURCE_CHANGED && f.subject === 'stream:tool',
    ),
    'dérive détectée, et matérielle',
  );

  const code = main([
    'update', file,
    '--subject', 'stream:tool',
    '--field', 'state',
    '--value', 'IMPLEMENTED',
    '--evidence', JSON.stringify(
      evidenceFor('stream:tool', 'state', 'IMPLEMENTED', {
        id: 'ev-v2',
        ref: 'TOOL.mjs',
        observed: { blob: blobAfter },
      }),
    ),
  ]);
  assert.equal(code, 0, 'rafraîchissement autorisé à valeur égale');

  const after = load(file);
  assert.deepEqual(after.streams[0].evidence.map((e) => e.id), ['ev-v2'], 'provenance périmée retirée');
  assert.equal(after.streams[0].evidence[0].observed.blob, blobAfter);

  const afterRefresh = check(after, root);
  assert.equal(
    afterRefresh.findings.filter((f) => f.outcome === OUTCOME.SOURCE_CHANGED).length,
    0,
    'SOURCE_CHANGED résolu',
  );
  assert.equal(afterRefresh.material.length, 0);
  assert.equal(afterRefresh.exitCode, 0);
});

test('la source finale de l’outil ne contient aucun octet NUL littéral', () => {
  const bytes = readFileSync(new URL('../program-state.mjs', import.meta.url));
  let literal = 0;
  for (const byte of bytes) if (byte === 0) literal += 1;
  assert.equal(literal, 0, 'les séparateurs sont écrits en échappement de source, pas en octet brut');
});

test('le séparateur de clé composite reste un caractère impossible dans un identifiant', () => {
  const root = tempRepo();
  writeFileSync(join(root, 'SOURCE.md'), 'source\n');
  commitAll(root, 'init');

  /* Deux relations dont les paires (sujet, champ) sont distinctes, mais dont
   * la concaténation par une ESPACE serait identique — « s | a b » contre
   * « s a | b ». Avec un séparateur visible, elles seraient regroupées et
   * produiraient une contradiction fantôme. */
  const state = baseState({
    streams: [
      {
        id: 's1',
        title: 't',
        type: 'CASE',
        state: 'OPEN',
        updated_at: 'x',
        evidence: [
          evidenceFor('stream:s1', 'state', 'OPEN', { id: 'ev-claim', ref: 'SOURCE.md' }),
          {
            id: 'ev-x',
            kind: 'repo-path',
            ref: 'SOURCE.md',
            policy: 'VERIFIABLE',
            supports: { subject: 's', field: 'a b', value: 'V1' },
          },
          {
            id: 'ev-y',
            kind: 'repo-path',
            ref: 'SOURCE.md',
            policy: 'VERIFIABLE',
            supports: { subject: 's a', field: 'b', value: 'V2' },
          },
        ],
      },
    ],
  });

  const report = check(state, root);
  assert.equal(
    report.findings.filter((f) => f.outcome === OUTCOME.CONTRADICTION).length,
    0,
    'aucune contradiction fantôme : le séparateur ne peut pas apparaître dans un identifiant',
  );
});

test('mkdir de test : aucun état CCR réel n’est touché', () => {
  const root = tempRepo();
  mkdirSync(join(root, 'vide'), { recursive: true });
  assert.ok(existsSync(join(root, 'vide')));
  assert.ok(root.includes('program-state-'), 'les tests restent dans un répertoire temporaire');
});
