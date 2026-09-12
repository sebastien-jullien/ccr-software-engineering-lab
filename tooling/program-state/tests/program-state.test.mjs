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
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  OUTCOME,
  blobOf,
  canonicalize,
  check,
  checkEvidence,
  claimsOf,
  load,
  parse,
  renderResume,
  save,
  serialize,
  update,
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

test('mkdir de test : aucun état CCR réel n’est touché', () => {
  const root = tempRepo();
  mkdirSync(join(root, 'vide'), { recursive: true });
  assert.ok(existsSync(join(root, 'vide')));
  assert.ok(root.includes('program-state-'), 'les tests restent dans un répertoire temporaire');
});
