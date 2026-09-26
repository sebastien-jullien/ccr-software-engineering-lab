/**
 * P-HR-01 — résolveur, cycle de vie inter-acteurs, P_HR_01_RESULT_ADMISSION,
 * non-contournement et frontière produit. Autorité 101, sous les autorités 98,
 * 99 et 100.
 *
 * Chaque transaction s'exécute contre un VRAI dépôt Git temporaire, créé HORS
 * du dépôt du Lab : gel, persistance et admission lisent l'historique commis,
 * jamais une copie de travail.
 */

import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, sep } from 'node:path';

import { validate } from '../validate.mjs';
import { V1_AUTHORITY, acceptMissionObject, v1Representation } from '../v1.mjs';
import {
  EVENT_SOURCES,
  LIFECYCLE,
  PHr01Run,
  PHr01Stop,
  constructMissionObjectV1,
  isAcceptedResult,
  requireAcceptedResult,
  resolveHandoffContract,
} from '../p-hr-01.mjs';
import { parse as parseResult } from '../../result-instance/result-instance.mjs';
import { projectResult } from '../../console/result-adapter.mjs';

const HERE = import.meta.dirname;
const TOOLING = join(HERE, '..', '..');
const LAB_ROOT = join(TOOLING, '..');

const MISSION_PATH = 'missions/900-p-hr-01-fixture/mission.json';
const RESULT_PATH = 'missions/900-p-hr-01-fixture/result.json';
const DISPATCH = 'EXECUTOR_DISPATCH';

/* ------------------------------------------------------------------ *
 * Dépôts temporaires
 * ------------------------------------------------------------------ */

const ROOTS = [];
after(() => {
  for (const root of ROOTS) rmSync(root, { recursive: true, force: true });
});

function git(root, argv) {
  return execFileSync('git', argv, { cwd: root, encoding: 'utf8', windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function commitAll(root, message) {
  git(root, ['add', '-A']);
  git(root, ['-c', 'user.name=fixture', '-c', 'user.email=fixture@local', 'commit', '-q', '-m', message]);
  return git(root, ['rev-parse', 'HEAD']);
}

function tempRepository() {
  const root = mkdtempSync(join(tmpdir(), 'p-hr-01-'));
  ROOTS.push(root);
  git(root, ['init', '-q']);
  git(root, ['config', 'core.autocrlf', 'false']);
  writeFileSync(join(root, 'README.md'), 'fixture\n');
  commitAll(root, 'init');
  return root;
}

function put(root, path, bytes) {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), bytes);
}

function gitBlobId(bytes) {
  const header = Buffer.concat([Buffer.from('blob ' + bytes.length, 'ascii'), Buffer.from([0])]);
  return createHash('sha1').update(header).update(bytes).digest('hex');
}

/* ------------------------------------------------------------------ *
 * Fabriques
 * ------------------------------------------------------------------ */

/** Champs hérités d'une mission : sémantique V0, aucun champ V1. */
function fields(extra = {}) {
  return {
    identity: {
      id: '900-p-hr-01-fixture',
      class: 'P_HR_01_FIXTURE',
      addressee: 'AGENT_CCR_LAB_FIXTURE',
      target_project: 'CCR_SOFTWARE_ENGINEERING_LAB',
    },
    references: [
      { id: 'ref-return', role: 'DELIVERABLE', locator: { kind: 'REPO_PATH', value: RESULT_PATH }, identity_required: false },
    ],
    effects: [{ id: 'e-produce', mode: 'REQUIRED', action: 'PRODUCE_RESULT_INSTANCE', cardinality: 1, target: 'ref-return' }],
    return_contract: [
      {
        id: 'rf-outcome',
        fact: 'mission.outcome',
        acquisition: 'MEASURED',
        value_type: 'SYMBOL',
        allowed_values: { type: 'SET', members: [{ type: 'SYMBOL', value: 'PASS' }, { type: 'SYMBOL', value: 'FAIL' }] },
      },
    ],
    next_consequences: [{ id: 'nc-return', kind: 'DETERMINED', action: 'RETURN_RESULT_INSTANCE', no_new_gate: true }],
    terminal: { halt_after_return: true },
    ...extra,
  };
}

function reference(identity) {
  return {
    locator: { kind: 'REPO_PATH', value: identity.path },
    identity: { kind: 'GIT_BLOB', value: identity.blob },
  };
}

function resultInstance(frozen, mutate) {
  const instance = {
    representation: {
      authority: {
        locator: { kind: 'REPO_PATH', value: '23-TOOLING-EXPERIMENT-003-RESULT-INSTANCE-V0.md' },
        identity: { kind: 'GIT_BLOB', value: '1676b3de4546b40a801d0a400b4c47ddd9b82062' },
      },
    },
    execution: { id: '900-p-hr-01-fixture' },
    source: { kind: 'MISSION', authority: reference(frozen) },
    reported_by: { executor: 'AGENT_CCR_LAB_FIXTURE' },
    return_contract: { authority: reference(frozen) },
    reported_entries: [
      { kind: 'REPORTED_VALUE', fact: { defined_by: 'RETURN_CONTRACT', id: 'rf-outcome' }, value: { type: 'SYMBOL', value: 'PASS' } },
    ],
  };
  if (mutate) mutate(instance);
  return Buffer.from(JSON.stringify(instance, null, 2) + '\n', 'utf8');
}

/** Opération demandée ; un `kind` explicitement `undefined` reste `undefined`. */
function operation(frozen, ...kind) {
  return { kind: kind.length > 0 ? kind[0] : DISPATCH, mission: { path: frozen.path, blob: frozen.blob } };
}

function resolved() {
  const root = tempRepository();
  const run = new PHr01Run({ repositoryRoot: root });
  const built = run.resolveAndConstruct({ missionPath: MISSION_PATH, fields: fields() });
  return { root, run, built };
}

function frozenScenario() {
  const scenario = resolved();
  put(scenario.root, MISSION_PATH, scenario.built.bytes);
  commitAll(scenario.root, 'freeze mission');
  const frozen = scenario.run.verifyFreeze();
  return { ...scenario, frozen };
}

async function dispatchedScenario() {
  const scenario = frozenScenario();
  const payloads = [];
  await scenario.run.dispatch(operation(scenario.frozen), async (payload) => {
    payloads.push(payload);
  });
  return { ...scenario, payloads };
}

async function returnedScenario(mutate) {
  const scenario = await dispatchedScenario();
  const bytes = resultInstance(scenario.frozen, mutate);
  put(scenario.root, RESULT_PATH, bytes); /* l'exécutant retourne exactement là */
  const returned = scenario.run.ingestReturn({ path: RESULT_PATH, bytes: readFileSync(join(scenario.root, RESULT_PATH)) });
  return { ...scenario, bytes, returned };
}

async function persistedScenario() {
  const scenario = await returnedScenario();
  commitAll(scenario.root, 'persist result'); /* l'orchestration persiste les octets exacts */
  const persisted = scenario.run.verifyPersistence({ actor: 'ORCHESTRATION' });
  return { ...scenario, persisted };
}

function stops(code) {
  return (error) => {
    assert.ok(error instanceof PHr01Stop, 'arrêt P-HR-01 attendu, obtenu : ' + String(error && error.stack));
    assert.equal(error.code, code, error.message);
    return true;
  };
}

function eventNames(run) {
  return run.events().map((record) => record.event);
}

/* ================================================================== *
 * IP-03 — résolveur P-HR-01 et construction V1
 * ================================================================== */

test('IP-03 : le résolveur rend les cinq valeurs exactes, dérivées du seul chemin de mission', () => {
  assert.deepEqual(resolveHandoffContract(MISSION_PATH), {
    version: 'P_HR_01',
    next_control_stage: 'EXECUTOR_DISPATCH',
    return_destination: RESULT_PATH,
    stage_ordering_dependency: 'P_HR_01_LINEAR_V1',
    persistence_ownership: 'ORCHESTRATION',
  });
  assert.equal(resolveHandoffContract('a/b/c/mission.json').return_destination, 'a/b/c/result.json');
  assert.ok(Object.isFrozen(resolveHandoffContract(MISSION_PATH)));
});

test('IP-03 : aucune valeur choisie par l’appelant', () => {
  assert.equal(resolveHandoffContract.length, 1, 'une seule entrée : le chemin de mission');
  assert.deepEqual(
    resolveHandoffContract(MISSION_PATH, { next_control_stage: 'RESULT_ADMISSION', persistence_ownership: 'EXECUTOR' }),
    resolveHandoffContract(MISSION_PATH),
  );
  for (const key of ['representation', 'handoff_contract']) {
    assert.throws(
      () => constructMissionObjectV1({ fields: { ...fields(), [key]: {} }, missionPath: MISSION_PATH, pHr01: true }),
      stops('CALLER_SELECTED_V1_FIELD'),
    );
  }
});

test('IP-03 : chemin de mission non canonique → STOP', () => {
  for (const bad of ['missions/x/other.json', '/abs/mission.json', 'a\\mission.json', 'a/../mission.json', '', undefined]) {
    assert.throws(() => resolveHandoffContract(bad), stops('MISSION_PATH_INVALID'), String(bad));
  }
});

test('IP-03 : construction V1 — représentation exacte, contrat résolu, octets et identité', () => {
  const active = constructMissionObjectV1({ fields: fields(), missionPath: MISSION_PATH, pHr01: true });
  assert.deepEqual(active.object.representation, v1Representation());
  assert.deepEqual(active.object.handoff_contract, resolveHandoffContract(MISSION_PATH));
  assert.deepEqual(JSON.parse(active.bytes.toString('utf8')), JSON.parse(JSON.stringify(active.object)));
  assert.equal(active.blob, gitBlobId(active.bytes));
  assert.equal(active.bytes.includes(0x0d), false, 'LF seulement');
  assert.ok(Object.isFrozen(active.object) && Object.isFrozen(active.object.handoff_contract));
  assert.equal(acceptMissionObject(active.object, { missionPath: MISSION_PATH }).pHr01, 'ACTIVE');

  const inactive = constructMissionObjectV1({ fields: fields(), missionPath: MISSION_PATH, pHr01: false });
  assert.equal('handoff_contract' in inactive.object, false);
  assert.equal(acceptMissionObject(inactive.object).pHr01, 'INACTIVE');

  assert.throws(() => constructMissionObjectV1({ fields: fields(), missionPath: MISSION_PATH }), stops('MISSION_OBJECT_V1_INVALID'));
  const broken = fields();
  broken.effects[0].mode = 'ENCOURAGED';
  assert.throws(() => constructMissionObjectV1({ fields: broken, missionPath: MISSION_PATH, pHr01: true }), stops('MISSION_OBJECT_V1_INVALID'));
});

test('IP-03 : HANDOFF_RESOLVED établi par le résolveur, appliqué par la construction, et seulement en cas de succès', () => {
  const { run, built } = resolved();
  assert.deepEqual(eventNames(run), ['HANDOFF_RESOLVED']);
  const [record] = run.events();
  assert.equal(record.source, EVENT_SOURCES.HANDOFF_RESOLVED);
  assert.deepEqual(record.contract, built.object.handoff_contract);
  assert.equal(record.missionPath, MISSION_PATH);

  const failing = new PHr01Run({ repositoryRoot: tempRepository() });
  const broken = fields();
  delete broken.terminal;
  assert.throws(() => failing.resolveAndConstruct({ missionPath: MISSION_PATH, fields: broken }), stops('MISSION_OBJECT_V1_INVALID'));
  assert.deepEqual(eventNames(failing), []);
  assert.throws(() => run.resolveAndConstruct({ missionPath: MISSION_PATH, fields: fields() }), stops('EVENT_ALREADY_ESTABLISHED'));
});

/* ================================================================== *
 * IP-04 — vérification du gel
 * ================================================================== */

test('IP-04 : MISSION_FROZEN = identité commise exacte d’un V1 validé et actif', () => {
  const { root, run, built, frozen } = frozenScenario();
  assert.equal(frozen.path, MISSION_PATH);
  assert.equal(frozen.blob, built.blob);
  assert.equal(frozen.blob, git(root, ['rev-parse', 'HEAD:' + MISSION_PATH]));
  assert.equal(frozen.commit, git(root, ['rev-parse', 'HEAD']));
  assert.deepEqual(frozen.contract, built.object.handoff_contract);
  assert.deepEqual(eventNames(run), ['HANDOFF_RESOLVED', 'MISSION_FROZEN']);
  assert.equal(run.events()[1].source, EVENT_SOURCES.MISSION_FROZEN);
  assert.throws(() => run.verifyFreeze(), stops('EVENT_ALREADY_ESTABLISHED'));
});

test('IP-04 / FC-13 : une copie de travail seule, ou une enveloppe rendue, n’est pas un gel', () => {
  const { root, run, built } = resolved();
  put(root, 'missions/900-p-hr-01-fixture/envelope.md', 'MISSION 900\n');
  commitAll(root, 'envelope only');
  put(root, MISSION_PATH, built.bytes); /* écrite, jamais commise */
  assert.throws(() => run.verifyFreeze(), stops('MISSION_NOT_IN_CANONICAL_HISTORY'));
  assert.deepEqual(eventNames(run), ['HANDOFF_RESOLVED']);
  assert.throws(() => run.assertPreDispatch(operation({ path: MISSION_PATH, blob: built.blob })), stops('UNKNOWN_PREDECESSOR'));
});

test('IP-04 : le gel exige HANDOFF_RESOLVED dans l’état faisant autorité', () => {
  const { root } = frozenScenario();
  const fresh = new PHr01Run({ repositoryRoot: root });
  assert.throws(() => fresh.verifyFreeze(), stops('UNKNOWN_PREDECESSOR'));
  assert.deepEqual(eventNames(fresh), []);
});

const COMMITTED_CONTRACT_DEFECTS = [
  { rule: 'FC-04', code: 'UNKNOWN_P_HR_VERSION', mutate: (c) => (c.version = 'P_HR_02') },
  { rule: 'FC-05', code: 'HANDOFF_CONTRACT_INCOMPLETE', mutate: (c) => delete c.persistence_ownership },
  { rule: 'FC-06', code: 'HANDOFF_CONTRACT_MALFORMED', mutate: (c) => (c.route = 'RESULT_ADMISSION') },
  { rule: 'FC-07', code: 'NEXT_CONTROL_STAGE_MISMATCH', mutate: (c) => (c.next_control_stage = 'RESULT_ADMISSION') },
  { rule: 'FC-08', code: 'RETURN_DESTINATION_MISMATCH', mutate: (c) => (c.return_destination = 'missions/901-autre/result.json') },
  { rule: 'FC-09', code: 'ORDERING_MISMATCH', mutate: (c) => (c.stage_ordering_dependency = 'P_HR_01_GRAPH') },
  { rule: 'FC-10', code: 'PERSISTENCE_OWNER_MISMATCH', mutate: (c) => (c.persistence_ownership = 'EXECUTOR') },
];

for (const defect of COMMITTED_CONTRACT_DEFECTS) {
  test('IP-04 / ' + defect.rule + ' : un contrat commis défectueux arrête le gel — ' + defect.code, () => {
    const { root, run, built } = resolved();
    const object = JSON.parse(built.bytes.toString('utf8'));
    defect.mutate(object.handoff_contract);
    put(root, MISSION_PATH, JSON.stringify(object, null, 2) + '\n');
    commitAll(root, 'defective contract');
    assert.throws(() => run.verifyFreeze(), stops(defect.code));
    assert.deepEqual(eventNames(run), ['HANDOFF_RESOLVED']);
  });
}

test('IP-04 / FC-02 / FC-03 : un V0, un V1 inactif ou une représentation rejetée n’entrent jamais dans P-HR-01', () => {
  const cases = [
    { object: fields(), code: 'P_HR_01_NOT_ACTIVE' },
    { object: { representation: v1Representation(), ...fields() }, code: 'P_HR_01_NOT_ACTIVE' },
    { object: { ...fields(), handoff_contract: resolveHandoffContract(MISSION_PATH) }, code: 'V1_ONLY_FIELD_WITHOUT_REPRESENTATION' },
    {
      object: { representation: { authority: { locator: { kind: 'REPO_PATH', value: 'x.md' } } }, ...fields(), handoff_contract: resolveHandoffContract(MISSION_PATH) },
      code: 'UNKNOWN_REPRESENTATION',
    },
  ];
  for (const entry of cases) {
    const { root, run } = resolved();
    put(root, MISSION_PATH, JSON.stringify(entry.object, null, 2) + '\n');
    commitAll(root, 'not an active V1');
    assert.throws(() => run.verifyFreeze(), stops(entry.code));
    assert.deepEqual(eventNames(run), ['HANDOFF_RESOLVED'], 'aucun P-HR-01 synthétisé');
  }
});

/* ================================================================== *
 * IP-05 — garde d'assertion de l'opération demandée
 * ================================================================== */

test('IP-05 : la garde affirme seulement — elle ne choisit, ne rend ni ne déclenche aucune opération', () => {
  const { run, frozen } = frozenScenario();
  const verdict = run.assertPreDispatch(operation(frozen));
  assert.deepEqual(verdict, { asserted: true });
  assert.ok(Object.isFrozen(verdict));
  assert.deepEqual(eventNames(run), ['HANDOFF_RESOLVED', 'MISSION_FROZEN'], 'affirmer n’est pas dispatcher');
});

test('IP-05 / FC-12 : opération demandée ≠ EXECUTOR_DISPATCH → STOP, aucun dispatch', async () => {
  const { run, frozen } = frozenScenario();
  let calls = 0;
  for (const kind of ['RESULT_ADMISSION', 'executor_dispatch', 'EXECUTOR_RETURN', '', undefined, null]) {
    assert.throws(() => run.assertPreDispatch(operation(frozen, kind)), stops('REQUESTED_OPERATION_MISMATCH'));
    await assert.rejects(
      run.dispatch(operation(frozen, kind), () => {
        calls += 1;
      }),
      stops('REQUESTED_OPERATION_MISMATCH'),
    );
  }
  assert.equal(calls, 0, 'l’opération de dispatch n’a jamais été invoquée');
  assert.deepEqual(eventNames(run), ['HANDOFF_RESOLVED', 'MISSION_FROZEN']);
  assert.throws(() => run.assertPreDispatch('EXECUTOR_DISPATCH'), stops('REQUESTED_OPERATION_MALFORMED'));
});

test('IP-05 / FC-11 : la mission demandée n’est pas la mission gelée → STOP', () => {
  const { run, frozen } = frozenScenario();
  assert.throws(
    () => run.assertPreDispatch({ kind: DISPATCH, mission: { path: frozen.path, blob: '0'.repeat(40) } }),
    stops('FROZEN_IDENTITY_MISMATCH'),
  );
  assert.throws(
    () => run.assertPreDispatch({ kind: DISPATCH, mission: { path: 'missions/901/mission.json', blob: frozen.blob } }),
    stops('FROZEN_IDENTITY_MISMATCH'),
  );
});

test('FC-11 : contrat muté après le gel → STOP avant tout dispatch', async () => {
  const { root, run, frozen, built } = frozenScenario();
  const mutated = JSON.parse(built.bytes.toString('utf8'));
  mutated.handoff_contract.return_destination = 'missions/901-autre/result.json';
  put(root, MISSION_PATH, JSON.stringify(mutated, null, 2) + '\n');
  commitAll(root, 'mutate contract after freeze');
  let calls = 0;
  assert.throws(() => run.assertPreDispatch(operation(frozen)), stops('CONTRACT_MUTATED_AFTER_FREEZE'));
  await assert.rejects(
    run.dispatch(operation(frozen), () => {
      calls += 1;
    }),
    stops('CONTRACT_MUTATED_AFTER_FREEZE'),
  );
  const newBlob = git(root, ['rev-parse', 'HEAD:' + MISSION_PATH]);
  assert.throws(() => run.assertPreDispatch({ kind: DISPATCH, mission: { path: MISSION_PATH, blob: newBlob } }), stops('FROZEN_IDENTITY_MISMATCH'));
  assert.equal(calls, 0);
  assert.deepEqual(eventNames(run), ['HANDOFF_RESOLVED', 'MISSION_FROZEN']);
});

test('FC-11 : le contrat gelé est immuable en mémoire', async () => {
  const { run, frozen } = frozenScenario();
  assert.throws(() => {
    frozen.contract.next_control_stage = 'RESULT_ADMISSION';
  }, TypeError);
  assert.throws(() => {
    run.events()[1].blob = '0'.repeat(40);
  }, TypeError);
  await run.dispatch(operation(frozen), (payload) => {
    assert.throws(() => {
      payload.contract.persistence_ownership = 'EXECUTOR';
    }, TypeError);
    assert.throws(() => {
      payload.mission.blob = '0'.repeat(40);
    }, TypeError);
  });
  assert.equal(frozen.contract.persistence_ownership, 'ORCHESTRATION');
});

test('next_control_stage : assertion seulement — ni PROGRAM-STATE, ni next_consequences, ni procédure', () => {
  /* Une mission dont les conséquences et la procédure « annoncent » autre chose :
     la garde n'en lit rien, son verdict ne change pas. */
  const root = tempRepository();
  const run = new PHr01Run({ repositoryRoot: root });
  const loud = fields({
    next_consequences: [{ id: 'nc-route', kind: 'DETERMINED', action: 'ROUTE_TO_RESULT_ADMISSION', no_new_gate: true }],
    procedure: { strict_order: true, steps: [{ order: 1, id: 's-admit', effect: 'e-produce', atomic: true }] },
  });
  const built = run.resolveAndConstruct({ missionPath: MISSION_PATH, fields: loud });
  put(root, MISSION_PATH, built.bytes);
  put(root, 'PROGRAM-STATE.json', JSON.stringify({ next_action: { value: 'RESULT_ADMISSION' } }) + '\n');
  commitAll(root, 'loud mission');
  const frozen = run.verifyFreeze();
  assert.deepEqual(run.assertPreDispatch(operation(frozen)), { asserted: true });
  assert.throws(() => run.assertPreDispatch(operation(frozen, 'RESULT_ADMISSION')), stops('REQUESTED_OPERATION_MISMATCH'));
  assert.throws(() => run.assertPreDispatch(operation(frozen, 'ROUTE_TO_RESULT_ADMISSION')), stops('REQUESTED_OPERATION_MISMATCH'));

  const code = executableCode(readFileSync(join(HERE, '..', 'p-hr-01.mjs'), 'utf8'));
  for (const banned of ['PROGRAM-STATE', 'program-state', 'next_consequences', 'procedure', 'steps', 'effects']) {
    assert.ok(!code.includes(banned), 'la garde ne lit pas ' + banned);
  }
});

/* ================================================================== *
 * IP-06 — observation du dispatch effectif
 * ================================================================== */

test('IP-06 : EXECUTOR_DISPATCHED n’est établi qu’après le succès de l’opération de dispatch effective', async () => {
  const { run, frozen, built } = frozenScenario();
  const seen = [];
  await run.dispatch(operation(frozen), async (payload) => {
    seen.push(eventNames(run));
    assert.deepEqual({ ...payload.mission }, { path: MISSION_PATH, blob: frozen.blob, commit: frozen.commit });
    assert.deepEqual(payload.contract, frozen.contract);
    assert.equal(payload.contract.return_destination, RESULT_PATH, 'destination exacte transmise à l’exécutant');
    assert.deepEqual(payload.missionBytes, built.bytes, 'octets commis exacts de la mission gelée');
  });
  assert.deepEqual(seen, [['HANDOFF_RESOLVED', 'MISSION_FROZEN']], 'pendant l’opération, rien n’est encore établi');
  assert.deepEqual(eventNames(run), ['HANDOFF_RESOLVED', 'MISSION_FROZEN', 'EXECUTOR_DISPATCHED']);
  assert.equal(run.events()[2].source, EVENT_SOURCES.EXECUTOR_DISPATCHED);
  await assert.rejects(run.dispatch(operation(frozen), () => {}), stops('EVENT_ALREADY_ESTABLISHED'));
});

test('IP-06 : un dispatch échoué n’établit rien ; « dispatchable » n’est pas dispatché', async () => {
  const { run, frozen } = frozenScenario();
  await assert.rejects(
    run.dispatch(operation(frozen), async () => {
      throw new Error('transport indisponible');
    }),
    stops('DISPATCH_FAILED'),
  );
  assert.deepEqual(eventNames(run), ['HANDOFF_RESOLVED', 'MISSION_FROZEN']);
  assert.throws(() => run.ingestReturn({ path: RESULT_PATH, bytes: resultInstance(frozen) }), stops('UNKNOWN_PREDECESSOR'));
  await assert.rejects(run.dispatch(operation(frozen)), stops('DISPATCH_OPERATION_REQUIRED'));
});

test('IP-06 : deux dispatchs concurrents → STOP', async () => {
  const { run, frozen } = frozenScenario();
  let release;
  const first = run.dispatch(operation(frozen), () => new Promise((resolve) => (release = resolve)));
  await new Promise((resolve) => setImmediate(resolve));
  await assert.rejects(run.dispatch(operation(frozen), () => {}), stops('DISPATCH_IN_PROGRESS'));
  release();
  await first;
  assert.deepEqual(eventNames(run).at(-1), 'EXECUTOR_DISPATCHED');
});

test('IP-06 / FC-13 : dispatch avant gel → STOP, opération jamais invoquée', async () => {
  const { run, built } = resolved();
  let calls = 0;
  await assert.rejects(
    run.dispatch({ kind: DISPATCH, mission: { path: MISSION_PATH, blob: built.blob } }, () => {
      calls += 1;
    }),
    stops('UNKNOWN_PREDECESSOR'),
  );
  assert.equal(calls, 0);
  const empty = new PHr01Run({ repositoryRoot: tempRepository() });
  await assert.rejects(empty.dispatch({ kind: DISPATCH, mission: {} }, () => (calls += 1)), stops('UNKNOWN_PREDECESSOR'));
  assert.equal(calls, 0);
});

/* ================================================================== *
 * IP-07 — ingestion du retour
 * ================================================================== */

test('IP-07 : EXECUTOR_RETURNED — retour reçu au chemin exact, validé, adossé à la mission gelée', async () => {
  const { run, bytes, returned } = await returnedScenario();
  assert.deepEqual({ ...returned }, { path: RESULT_PATH, blob: gitBlobId(bytes) });
  assert.deepEqual(eventNames(run), ['HANDOFF_RESOLVED', 'MISSION_FROZEN', 'EXECUTOR_DISPATCHED', 'EXECUTOR_RETURNED']);
  const record = run.events()[3];
  assert.equal(record.source, EVENT_SOURCES.EXECUTOR_RETURNED);
  assert.equal(record.sha256, createHash('sha256').update(bytes).digest('hex'));
  assert.throws(() => run.ingestReturn({ path: RESULT_PATH, bytes }), stops('EVENT_ALREADY_ESTABLISHED'));
});

test('FC-14 : état de dispatch faisant autorité perdu avant le retour → STOP, jamais reconstruit', async () => {
  const { root, frozen } = await dispatchedScenario();
  const bytes = resultInstance(frozen);
  put(root, RESULT_PATH, bytes);
  const lost = new PHr01Run({ repositoryRoot: root });
  assert.throws(() => lost.ingestReturn({ path: RESULT_PATH, bytes }), stops('UNKNOWN_PREDECESSOR'));
  /* même en rétablissant résolution et gel, le dispatch perdu ne se reconstruit pas */
  const rebuilt = new PHr01Run({ repositoryRoot: root });
  rebuilt.resolveAndConstruct({ missionPath: MISSION_PATH, fields: fields() });
  rebuilt.verifyFreeze();
  assert.throws(() => rebuilt.ingestReturn({ path: RESULT_PATH, bytes }), stops('UNKNOWN_PREDECESSOR'));
  assert.deepEqual(eventNames(rebuilt), ['HANDOFF_RESOLVED', 'MISSION_FROZEN']);
});

test('FC-15 : retour avant dispatch → STOP', () => {
  const { root, run, frozen } = frozenScenario();
  const bytes = resultInstance(frozen);
  put(root, RESULT_PATH, bytes); /* un fichier présent n'est pas un retour */
  assert.throws(() => run.ingestReturn({ path: RESULT_PATH, bytes }), stops('UNKNOWN_PREDECESSOR'));
  assert.deepEqual(eventNames(run), ['HANDOFF_RESOLVED', 'MISSION_FROZEN']);
});

test('FC-08 : retour reçu hors de la destination exacte → STOP', async () => {
  const { run, frozen } = await dispatchedScenario();
  const bytes = resultInstance(frozen);
  for (const path of ['missions/900-p-hr-01-fixture/result-2.json', 'missions/901-autre/result.json', 'result.json', './' + RESULT_PATH, undefined]) {
    assert.throws(() => run.ingestReturn({ path, bytes }), stops('RETURN_DESTINATION_MISMATCH'), String(path));
  }
  assert.equal(eventNames(run).at(-1), 'EXECUTOR_DISPATCHED');
});

test('FC-16 : source du Result Instance ≠ mission V1 gelée → STOP', async () => {
  const { run, frozen } = await dispatchedScenario();
  const mutations = [
    (i) => (i.source.kind = 'PROTOCOL'),
    (i) => (i.source.authority.identity.value = '0'.repeat(40)),
    (i) => (i.source.authority.locator.value = 'missions/901-autre/mission.json'),
    (i) => (i.return_contract.authority.identity.value = '0'.repeat(40)),
    (i) => (i.return_contract.authority.locator.value = 'missions/901-autre/mission.json'),
    /* sans contrat de retour, l'entrée doit être portée par l'exécutant pour rester
       structurellement valide : c'est alors la liaison à la mission gelée qui manque */
    (i) => {
      delete i.return_contract;
      i.reported_entries[0].fact.defined_by = 'EXECUTOR';
    },
  ];
  for (const mutate of mutations) {
    assert.throws(() => run.ingestReturn({ path: RESULT_PATH, bytes: resultInstance(frozen, mutate) }), stops('RESULT_SOURCE_MISMATCH'));
  }
  assert.equal(eventNames(run).at(-1), 'EXECUTOR_DISPATCHED');
});

test('IP-07 : un Result Instance illisible, invalide ou hors contrat → STOP', async () => {
  const { run, frozen } = await dispatchedScenario();
  const invalid = [
    Buffer.from('{ "illisible": ', 'utf8'),
    Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), resultInstance(frozen)]),
    Buffer.from([0xff, 0xfe, 0x00]),
    resultInstance(frozen, (i) => delete i.reported_by),
    resultInstance(frozen, (i) => (i.reported_entries[0].value.value = 'MAYBE')),
    resultInstance(frozen, (i) => (i.reported_entries[0].fact.id = 'rf-inconnu')),
    resultInstance(frozen, (i) => delete i.return_contract),
    Buffer.alloc(0),
  ];
  for (const bytes of invalid) {
    assert.throws(() => run.ingestReturn({ path: RESULT_PATH, bytes }), stops('RESULT_INSTANCE_INVALID'));
  }
  assert.throws(() => run.ingestReturn({ path: RESULT_PATH, bytes: 'texte' }), stops('RESULT_INSTANCE_INVALID'));
  assert.equal(eventNames(run).at(-1), 'EXECUTOR_DISPATCHED');
});

test('IP-07 : aucune valeur de handoff n’est reconstruite depuis le résultat', async () => {
  const { run, frozen } = await returnedScenario((instance) => {
    instance.reported_entries.push({
      kind: 'REPORTED_VALUE',
      fact: { defined_by: 'EXECUTOR', id: 'handoff.next_control_stage' },
      value: { type: 'SYMBOL', value: 'RESULT_ADMISSION' },
    });
    instance.reported_entries.push({
      kind: 'REPORTED_VALUE',
      fact: { defined_by: 'EXECUTOR', id: 'handoff.return_destination' },
      value: { type: 'SCALAR', value: 'missions/901-autre/result.json' },
    });
  });
  assert.equal(frozen.contract.next_control_stage, 'EXECUTOR_DISPATCH');
  assert.equal(frozen.contract.return_destination, RESULT_PATH);
  assert.throws(() => run.verifyPersistence({ actor: 'EXECUTOR' }), stops('WRONG_PERSISTENCE_ACTOR'));
});

test('FC-17 / FC-18 : un résultat déjà persisté avant la validation du retour (persistance de l’exécutant) → STOP', async () => {
  const { root, run, frozen } = await dispatchedScenario();
  const bytes = resultInstance(frozen);
  put(root, RESULT_PATH, bytes);
  commitAll(root, 'executor persists its own result');
  assert.throws(() => run.ingestReturn({ path: RESULT_PATH, bytes }), stops('RESULT_PERSISTED_BEFORE_VALIDATED_RETURN'));
  assert.equal(eventNames(run).at(-1), 'EXECUTOR_DISPATCHED');
});

/* ================================================================== *
 * IP-08 — garde de persistance d'orchestration
 * ================================================================== */

test('IP-08 : RESULT_PERSISTED = identité commise des octets retournés exacts, par l’orchestration', async () => {
  const { root, run, returned, persisted } = await persistedScenario();
  assert.deepEqual({ ...persisted }, { path: RESULT_PATH, blob: returned.blob, commit: git(root, ['rev-parse', 'HEAD']) });
  assert.equal(git(root, ['rev-parse', 'HEAD:' + RESULT_PATH]), returned.blob);
  assert.equal(eventNames(run).at(-1), 'RESULT_PERSISTED');
  assert.equal(run.events()[4].source, EVENT_SOURCES.RESULT_PERSISTED);
  assert.throws(() => run.verifyPersistence({ actor: 'ORCHESTRATION' }), stops('EVENT_ALREADY_ESTABLISHED'));
});

test('FC-17 : acteur de persistance ≠ ORCHESTRATION → STOP', async () => {
  const { root, run } = await returnedScenario();
  commitAll(root, 'persist');
  for (const actor of ['EXECUTOR', 'orchestration', 'AGENT_CCR_LAB_FIXTURE', undefined]) {
    assert.throws(() => run.verifyPersistence({ actor }), stops('WRONG_PERSISTENCE_ACTOR'), String(actor));
  }
  assert.equal(eventNames(run).at(-1), 'EXECUTOR_RETURNED');
});

test('FC-18 : persistance avant retour validé → STOP', async () => {
  const { root, run, frozen } = await dispatchedScenario();
  put(root, RESULT_PATH, resultInstance(frozen));
  commitAll(root, 'persist before ingest');
  assert.throws(() => run.verifyPersistence({ actor: 'ORCHESTRATION' }), stops('UNKNOWN_PREDECESSOR'));
});

test('IP-08 : un résultat validé mais non commis n’est pas persisté ; des octets différents non plus', async () => {
  const pending = await returnedScenario();
  assert.throws(() => pending.run.verifyPersistence({ actor: 'ORCHESTRATION' }), stops('RESULT_NOT_PERSISTED'));

  const altered = await returnedScenario();
  put(altered.root, RESULT_PATH, altered.bytes.toString('utf8').replace(/\n/g, '\r\n'));
  commitAll(altered.root, 'persist altered bytes');
  assert.throws(() => altered.run.verifyPersistence({ actor: 'ORCHESTRATION' }), stops('PERSISTED_BYTES_MISMATCH'));
  assert.equal(eventNames(altered.run).at(-1), 'EXECUTOR_RETURNED');
});

test('FC-11 : mission modifiée entre le retour et la persistance → STOP', async () => {
  const { root, run, built } = await returnedScenario();
  const mutated = JSON.parse(built.bytes.toString('utf8'));
  mutated.handoff_contract.persistence_ownership = 'EXECUTOR';
  put(root, MISSION_PATH, JSON.stringify(mutated, null, 2) + '\n');
  commitAll(root, 'persist result and mutate mission');
  assert.throws(() => run.verifyPersistence({ actor: 'ORCHESTRATION' }), stops('CONTRACT_MUTATED_AFTER_FREEZE'));
});

/* ================================================================== *
 * IP-09 — P_HR_01_RESULT_ADMISSION
 * ================================================================== */

test('IP-09 : admission — handle immuable, RESULT_CONSUMED à la première admission, cycle complet', async () => {
  const { run, frozen, persisted, bytes } = await persistedScenario();
  const handle = run.admit({ mission: { path: frozen.path, blob: frozen.blob }, result: { path: persisted.path, blob: persisted.blob } });
  assert.equal(isAcceptedResult(handle), true);
  assert.equal(requireAcceptedResult(handle), handle);
  assert.equal(handle.kind, 'P_HR_01_ACCEPTED_RESULT');
  assert.deepEqual({ ...handle.mission }, { path: frozen.path, blob: frozen.blob });
  assert.deepEqual({ ...handle.result }, { path: persisted.path, blob: persisted.blob, commit: persisted.commit });
  assert.deepEqual(JSON.parse(JSON.stringify(handle.instance)), JSON.parse(bytes.toString('utf8')));
  assert.ok(Object.isFrozen(handle) && Object.isFrozen(handle.instance) && Object.isFrozen(handle.instance.reported_entries));
  assert.throws(() => {
    handle.result.blob = '0'.repeat(40);
  }, TypeError);

  assert.deepEqual(eventNames(run), [...LIFECYCLE]);
  assert.deepEqual(
    run.events().map((record) => record.source),
    LIFECYCLE.map((event) => EVENT_SOURCES[event]),
  );
  const again = run.admit({ mission: { path: frozen.path, blob: frozen.blob }, result: { path: persisted.path, blob: persisted.blob } });
  assert.equal(again, handle, 'une admission suivante rend le même handle');
  assert.equal(run.events().length, 6, 'RESULT_CONSUMED = la PREMIÈRE admission seulement');
});

test('FC-19 : admission avant persistance → REJET, aucun handle, aucun événement', async () => {
  const { root, run, frozen, returned } = await returnedScenario();
  const request = { mission: { path: frozen.path, blob: frozen.blob }, result: { path: returned.path, blob: returned.blob } };
  assert.throws(() => run.admit(request), stops('ADMISSION_BEFORE_PERSISTENCE'));
  commitAll(root, 'persisted, but not verified');
  /* l'historique porte le résultat ; RESULT_PERSISTED n'est pas reconstruit pour autant */
  assert.throws(() => run.admit(request), stops('ADMISSION_BEFORE_PERSISTENCE'));
  assert.equal(eventNames(run).at(-1), 'EXECUTOR_RETURNED');
  const fresh = new PHr01Run({ repositoryRoot: root });
  assert.throws(() => fresh.admit(request), stops('UNKNOWN_PREDECESSOR'));
});

test('IP-09 : l’admission exige les identités exactes', async () => {
  const { run, frozen, persisted } = await persistedScenario();
  const mission = { path: frozen.path, blob: frozen.blob };
  const result = { path: persisted.path, blob: persisted.blob };
  assert.throws(() => run.admit({ mission: { ...mission, blob: '0'.repeat(40) }, result }), stops('FROZEN_IDENTITY_MISMATCH'));
  assert.throws(() => run.admit({ mission: { ...mission, path: 'missions/901/mission.json' }, result }), stops('FROZEN_IDENTITY_MISMATCH'));
  assert.throws(() => run.admit({ mission, result: { ...result, path: 'missions/901/result.json' } }), stops('RETURN_DESTINATION_MISMATCH'));
  assert.throws(() => run.admit({ mission, result: { ...result, blob: '0'.repeat(40) } }), stops('PERSISTED_BLOB_MISMATCH'));
  assert.throws(() => run.admit({ mission }), stops('RETURN_DESTINATION_MISMATCH'));
  assert.equal(eventNames(run).at(-1), 'RESULT_PERSISTED');
});

test('FC-20 : consommation aval sans handle d’admission → CONTRACT_VIOLATION', async () => {
  const { root, run, frozen, persisted } = await persistedScenario();
  const handle = run.admit({ mission: { path: frozen.path, blob: frozen.blob }, result: { path: persisted.path, blob: persisted.blob } });
  const forgeries = [
    parseResult(readFileSync(join(root, RESULT_PATH), 'utf8')),
    JSON.parse(JSON.stringify(handle)),
    { ...handle },
    structuredClone(handle),
    RESULT_PATH,
    join(root, RESULT_PATH),
    persisted,
    undefined,
    null,
  ];
  for (const forged of forgeries) {
    assert.equal(isAcceptedResult(forged), false);
    assert.throws(() => requireAcceptedResult(forged), stops('CONTRACT_VIOLATION'));
  }
});

/* ================================================================== *
 * Cycle de vie P_HR_01_LINEAR_V1 — exact, source par source
 * ================================================================== */

test('CYCLE DE VIE : exactement six événements, cet ordre, une source chacun', () => {
  assert.deepEqual([...LIFECYCLE], [
    'HANDOFF_RESOLVED',
    'MISSION_FROZEN',
    'EXECUTOR_DISPATCHED',
    'EXECUTOR_RETURNED',
    'RESULT_PERSISTED',
    'RESULT_CONSUMED',
  ]);
  assert.ok(Object.isFrozen(LIFECYCLE) && Object.isFrozen(EVENT_SOURCES));
  assert.deepEqual(Object.keys(EVENT_SOURCES), [...LIFECYCLE]);
  assert.deepEqual(EVENT_SOURCES, {
    HANDOFF_RESOLVED: 'P_HR_01_RESOLVER_ENFORCED_BY_MISSION_OBJECT_V1_CONSTRUCTION',
    MISSION_FROZEN: 'CANONICAL_REPOSITORY_IDENTITY_OF_EXACT_VALIDATED_MISSION_OBJECT_V1',
    EXECUTOR_DISPATCHED: 'SUCCESSFUL_ACTUAL_EXECUTOR_DISPATCH_OPERATION',
    EXECUTOR_RETURNED: 'SUCCESSFUL_RESULT_INGEST_BOUNDARY',
    RESULT_PERSISTED: 'CANONICAL_DURABLE_REPOSITORY_IDENTITY_OF_EXACT_RETURNED_BYTES',
    RESULT_CONSUMED: 'FIRST_SUCCESSFUL_P_HR_01_RESULT_ADMISSION',
  });
});

test('CYCLE DE VIE : aucun enregistreur générique, aucune API de transition arbitraire', async () => {
  const exported = Object.keys(await import('../p-hr-01.mjs')).sort();
  assert.deepEqual(exported, [
    'EVENT_SOURCES',
    'LIFECYCLE',
    'PHr01Run',
    'PHr01Stop',
    'constructMissionObjectV1',
    'isAcceptedResult',
    'requireAcceptedResult',
    'resolveHandoffContract',
  ]);
  const methods = Object.getOwnPropertyNames(PHr01Run.prototype).filter((name) => name !== 'constructor').sort();
  assert.deepEqual(methods, [
    'admit',
    'assertPreDispatch',
    'dispatch',
    'events',
    'ingestReturn',
    'resolveAndConstruct',
    'verifyFreeze',
    'verifyPersistence',
  ]);
});

test('CYCLE DE VIE : prédécesseur inconnu → STOP à chaque étape', async () => {
  const { run, frozen } = frozenScenario();
  assert.throws(() => run.ingestReturn({ path: RESULT_PATH, bytes: resultInstance(frozen) }), stops('UNKNOWN_PREDECESSOR'));
  assert.throws(() => run.verifyPersistence({ actor: 'ORCHESTRATION' }), stops('UNKNOWN_PREDECESSOR'));
  assert.throws(
    () => run.admit({ mission: { path: frozen.path, blob: frozen.blob }, result: { path: RESULT_PATH, blob: '0'.repeat(40) } }),
    stops('ADMISSION_BEFORE_PERSISTENCE'),
  );
  const empty = new PHr01Run({ repositoryRoot: tempRepository() });
  assert.throws(() => empty.verifyFreeze(), stops('UNKNOWN_PREDECESSOR'));
  assert.throws(() => empty.assertPreDispatch(operation(frozen)), stops('UNKNOWN_PREDECESSOR'));
  assert.throws(() => empty.ingestReturn({ path: RESULT_PATH, bytes: Buffer.from('{}') }), stops('UNKNOWN_PREDECESSOR'));
  assert.throws(() => empty.verifyPersistence({ actor: 'ORCHESTRATION' }), stops('UNKNOWN_PREDECESSOR'));
  assert.throws(() => empty.admit({}), stops('UNKNOWN_PREDECESSOR'));
  assert.throws(() => new PHr01Run({}), stops('REPOSITORY_ROOT_REQUIRED'));
});

/* ================================================================== *
 * NON-CONTOURNEMENT — preuve dynamique
 * ================================================================== */

test('NO-BYPASS : un résultat P-HR-01 actif ne pilote aucune continuation aval avant admission', async () => {
  const { root, run, frozen, returned } = await returnedScenario();
  let continued = 0;
  /* logique produit aval : sa seule entrée est requireAcceptedResult */
  const downstream = (candidate) => {
    const accepted = requireAcceptedResult(candidate);
    continued += 1;
    return accepted.instance.reported_entries[0].value.value;
  };

  /* 1. le résultat retourné, lu directement, ne pilote rien */
  const direct = parseResult(readFileSync(join(root, RESULT_PATH), 'utf8'));
  assert.throws(() => downstream(direct), stops('CONTRACT_VIOLATION'));

  /* 2. l'admission avant persistance ne rend aucun handle */
  const request = { mission: { path: frozen.path, blob: frozen.blob }, result: { path: returned.path, blob: returned.blob } };
  assert.throws(() => run.admit(request), stops('ADMISSION_BEFORE_PERSISTENCE'));

  /* 3. le seul chemin produit qui lit un couple mission / résultat — le panneau C
        de la console — refuse la mission V1 AVANT de lire le résultat */
  const repository = Object.freeze({ realRoot: realpathSync(root), label: 'fixture', objectFormat: 'sha1', head: frozen.commit });
  assert.throws(
    () => projectResult(repository, { resultPath: RESULT_PATH, missionPath: MISSION_PATH, missionBlob: frozen.blob }),
    (error) => error.code === 'VALIDATION_FAILED' && error.details.subject === 'MISSION_OBJECT',
  );

  /* 4. persisté dans l'historique mais non vérifié : toujours rien */
  commitAll(root, 'persist result');
  assert.throws(() => run.admit(request), stops('ADMISSION_BEFORE_PERSISTENCE'));
  assert.equal(continued, 0, 'aucune continuation aval avant admission');

  /* 5. persistance vérifiée, admission : la continuation devient possible, et seulement alors */
  run.verifyPersistence({ actor: 'ORCHESTRATION' });
  const handle = run.admit(request);
  assert.equal(downstream(handle), 'PASS');
  assert.equal(continued, 1);
  assert.deepEqual(eventNames(run), [...LIFECYCLE]);
});

/* ================================================================== *
 * NON-CONTOURNEMENT — inventaire statique des consommateurs
 * ================================================================== */

/** Code exécutable seulement : commentaires retirés. */
function executableCode(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map((line) => line.replace(/(^|\s)\/\/.*$/, '$1'))
    .join('\n');
}

function productSources(directory, out = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'tests' || entry.name === 'node_modules') continue;
      productSources(path, out);
    } else if (entry.isFile() && /\.(mjs|js)$/.test(entry.name)) {
      out.push(relative(LAB_ROOT, path).split(sep).join('/'));
    }
  }
  return out;
}

/** Marqueurs de contact avec un Result Instance ; chacun est une autre façon de le trouver. */
const RESULT_MARKERS = [
  /result-instance/,
  /result\.json/,
  /reported_entries/,
  /reportedValues|reportedValueEntries|nonProductionEntries/,
  /projectResult|result-adapter/,
  /validateAgainstContract/,
  /\/api\/result/,
];

/**
 * Inventaire classé. A = consommateur sémantique aval ; B = inspection,
 * affichage, énumération ou validation seulement. AUCUN A n'existe : la seule
 * entrée de consommation sémantique d'un résultat P-HR-01 est
 * requireAcceptedResult, qui n'accepte qu'un handle d'admission.
 */
const INVENTORY = {
  'tooling/result-instance/result-instance.mjs': 'B', // chargement gelé et accesseurs
  'tooling/result-instance/validate.mjs': 'B', // validation structurelle et de contrat, CLI
  'tooling/console/result-adapter.mjs': 'B', // panneau C : affichage ; mission V1 refusée avant le résultat
  'tooling/console/server.mjs': 'B', // route /api/result vers le panneau C
  'tooling/console/public/console.mjs': 'B', // rendu navigateur de la projection
  'tooling/console/repo.mjs': 'B', // énumération de candidats result.json, sans lecture
  'tooling/mission-object/v1.mjs': 'B', // règle de chemin result.json, sans lecture
  'tooling/mission-object/p-hr-01.mjs': 'B', // ingestion (validation), persistance (identité), admission
};

test('NO-BYPASS : inventaire statique — tout contact produit avec un Result Instance est classé, aucun A', () => {
  const sources = [...productSources(join(LAB_ROOT, 'tooling')), ...productSources(join(LAB_ROOT, 'cases'))];
  assert.ok(sources.length > 40, 'parcours effectif des sources produit');
  const touching = sources.filter((path) => {
    const code = readFileSync(join(LAB_ROOT, path), 'utf8');
    return RESULT_MARKERS.some((marker) => marker.test(code));
  });
  assert.deepEqual(touching.sort(), Object.keys(INVENTORY).sort(), 'consommateur non classé ou classement périmé');
  assert.deepEqual(Object.values(INVENTORY).filter((kind) => kind === 'A'), []);

  /* Aucun module produit n'importe le Result Instance hors de la validation,
     de la console et de la frontière P-HR-01. */
  const importers = sources.filter((path) =>
    /from '[^']*result-instance\/(result-instance|validate)\.mjs'/.test(readFileSync(join(LAB_ROOT, path), 'utf8')),
  );
  assert.deepEqual(importers.sort(), ['tooling/console/result-adapter.mjs', 'tooling/mission-object/p-hr-01.mjs']);

  /* PROGRAM-STATE ne lit aucun résultat : il ne peut pas en tirer de continuation. */
  const programState = readFileSync(join(TOOLING, 'program-state', 'program-state.mjs'), 'utf8');
  for (const marker of RESULT_MARKERS) assert.equal(marker.test(programState), false, String(marker));
});

test('NO-BYPASS : dans la frontière P-HR-01, seule l’admission émet un handle', () => {
  const code = executableCode(readFileSync(join(HERE, '..', 'p-hr-01.mjs'), 'utf8'));
  assert.equal((code.match(/ACCEPTED_RESULTS\.add\(/g) ?? []).length, 1, 'un seul point d’émission');
  const admit = code.slice(code.indexOf('  admit('));
  assert.ok(admit.includes('ACCEPTED_RESULTS.add('), 'le point d’émission est dans admit()');
  assert.ok(
    admit.indexOf("'ADMISSION_BEFORE_PERSISTENCE'") < admit.indexOf('ACCEPTED_RESULTS.add('),
    'la garde de persistance précède l’émission',
  );
});

/* ================================================================== *
 * FRONTIÈRE PRODUIT — recherche et revue de code
 * ================================================================== */

test('FRONTIÈRE PRODUIT : aucun routeur, graphe, bus, moteur, DSL, conversion, reçu durable, PROGRAM-STATE, EXP-C2-C', () => {
  const files = ['v1.mjs', 'p-hr-01.mjs'];
  const banned = [
    [/\b(router|Router|routeTo|selectRoute|nextStage|chooseStage|dynamicRoute)\b/, 'routeur / route dynamique'],
    [/\b(graph|Graph|edges|adjacency|transitions)\b/, 'graphe de routage / de cycle de vie'],
    [/EventEmitter|node:events|subscribe|publish\(/, 'bus d’événements'],
    [/\b(workflow|Workflow|engine|Engine|scheduler|Scheduler|setTimeout|setInterval)\b/, 'moteur de workflow / ordonnanceur'],
    [/\b(dsl|DSL|lifecycleSpec|defineLifecycle|parseLifecycle)\b/, 'DSL de cycle de vie'],
    [/\b(convert|upgrade|downgrade|migrate)[A-Z_(]/, 'conversion de version'],
    [/writeFile|appendFile|createWriteStream|mkdirSync|renameSync|unlinkSync|rmSync|copyFile/, 'artefact durable écrit'],
    [/program-state|PROGRAM-STATE|PROGRAM_STATE/, 'sémantique PROGRAM-STATE'],
    [/derived-handoff|derived_handoff/, 'derived-handoff.json'],
    [/candidate-spec|observation-contract|baseline-manifest|EXP.C2|exp_c2|C2_C/, 'schéma EXP-C2-C'],
    [/ontology|Ontology/, 'ontologie de handoff'],
  ];
  for (const file of files) {
    const code = executableCode(readFileSync(join(HERE, '..', file), 'utf8'));
    for (const [pattern, label] of banned) {
      assert.equal(pattern.test(code), false, label + ' dans ' + file + ' : ' + String(code.match(pattern)));
    }
  }
});

test('FRONTIÈRE PRODUIT : domaines clos à un membre, acteurs et commandes Git bornés', async () => {
  const v1 = await import('../v1.mjs');
  assert.equal(v1.P_HR_01_VERSION, 'P_HR_01');
  assert.equal(v1.NEXT_CONTROL_STAGE, 'EXECUTOR_DISPATCH');
  assert.equal(v1.STAGE_ORDERING_DEPENDENCY, 'P_HR_01_LINEAR_V1');
  assert.equal(v1.PERSISTENCE_OWNERSHIP, 'ORCHESTRATION');
  assert.deepEqual([...v1.HANDOFF_CONTRACT_KEYS], [
    'version',
    'next_control_stage',
    'return_destination',
    'stage_ordering_dependency',
    'persistence_ownership',
  ]);
  const code = executableCode(readFileSync(join(HERE, '..', 'p-hr-01.mjs'), 'utf8'));
  const table = code.match(/AUTHORIZED_GIT_READS = Object\.freeze\(\[([^\]]*)\]\)/);
  assert.ok(table);
  assert.deepEqual(table[1].split(',').map((token) => token.trim().replace(/'/g, '')).filter(Boolean), [
    'rev-parse',
    'ls-tree',
    'cat-file',
    'merge-base',
  ]);
  for (const mutation of ["'add'", "'commit'", "'push'", "'update-ref'", "'hash-object'", "'checkout'", "'reset'", "'fetch'"]) {
    assert.ok(!code.includes(mutation), 'commande Git de mutation : ' + mutation);
  }
  const v1code = executableCode(readFileSync(join(HERE, '..', 'v1.mjs'), 'utf8'));
  assert.ok(!v1code.includes('child_process'), 'la représentation V1 n’accède pas à Git');
  assert.ok(!/writeFile|appendFile/.test(v1code), 'la représentation V1 n’écrit rien');
});

test('FRONTIÈRE PRODUIT : aucun fichier V0, console, résultat ou PROGRAM-STATE n’importe la frontière P-HR-01', () => {
  const sources = productSources(join(LAB_ROOT, 'tooling'));
  const importers = sources.filter((path) => /from '[^']*(p-hr-01|v1)\.mjs'/.test(readFileSync(join(LAB_ROOT, path), 'utf8')));
  assert.deepEqual(importers.sort(), ['tooling/mission-object/p-hr-01.mjs']);
});

/* Le validateur V0 reste strictement V0 : la construction V1 n'en change rien. */
test('FRONTIÈRE PRODUIT : un V1 construit reste refusé par le validateur V0', () => {
  const built = constructMissionObjectV1({ fields: fields(), missionPath: MISSION_PATH, pHr01: true });
  assert.equal(validate(built.object).ok, false);
  assert.equal(built.object.representation.authority.identity.value, V1_AUTHORITY.blob);
});
