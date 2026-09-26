/**
 * Mission Object V1 et P-HR-01 — représentation, reconnaissance C-1 RAFFINÉE,
 * validation, rendu et inspection. Autorité 101, sous les autorités 98, 99, 100.
 *
 * Chaque test nomme le point d'intégration (IP-xx), le cas de reconnaissance
 * (A..F) ou la règle d'échec fermé (FC-xx) qu'il démontre. Les tests du cycle
 * de vie inter-acteurs sont dans p-hr-01.test.mjs ; la preuve de compatibilité
 * V0 sur les objets commis est dans v0-compatibility.test.mjs.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { load, normativeElements } from '../mission-object.mjs';
import { validate } from '../validate.mjs';
import { render } from '../render.mjs';
import {
  HANDOFF_CONTRACT_KEYS,
  INHERITED_ELEMENTS,
  LIFECYCLE,
  PINNED_V0_AUTHORITY,
  V1_AUTHORITY,
  V1_ONLY_FIELDS,
  acceptMissionObject,
  canonicalReturnDestination,
  inheritedFields,
  inspect,
  isExactV1Representation,
  normativeElementsV1,
  recognizeRepresentation,
  renderAccepted,
  renderCoverageV1,
  renderMissionObjectV1,
  v1Representation,
  validateHandoffContract,
  validateMissionObjectV1,
} from '../v1.mjs';
import { projectMission } from '../../console/mission-adapter.mjs';
import { projectResult } from '../../console/result-adapter.mjs';

const HERE = import.meta.dirname;
const LAB_ROOT = join(HERE, '..', '..', '..');
const FIXTURES = join(HERE, '..', 'fixtures');
const V1_CLI = join(HERE, '..', 'v1.mjs');

const MISSION_PATH = 'missions/900-p-hr-01-fixture/mission.json';
const RESULT_PATH = 'missions/900-p-hr-01-fixture/result.json';

/* ------------------------------------------------------------------ *
 * Fabriques
 * ------------------------------------------------------------------ */

/** Objet V0 minimal valide : la plus petite mission représentable. */
function v0() {
  return {
    identity: {
      id: 'minimal',
      class: 'TEST',
      addressee: 'AGENT_CCR_LAB_1',
      target_project: 'CCR_SOFTWARE_ENGINEERING_LAB',
    },
    references: [{ id: 'r1', role: 'AUTHORITY', locator: { kind: 'REPO_PATH', value: 'x.md' }, identity_required: false }],
    effects: [{ id: 'e1', mode: 'REQUIRED', action: 'DO_THING', cardinality: 1 }],
    return_contract: [{ id: 'rf1', fact: 'mission.outcome', acquisition: 'MEASURED', value_type: 'SCALAR' }],
    terminal: { halt_after_return: true },
  };
}

function contract(overrides = {}) {
  return {
    version: 'P_HR_01',
    next_control_stage: 'EXECUTOR_DISPATCH',
    return_destination: RESULT_PATH,
    stage_ordering_dependency: 'P_HR_01_LINEAR_V1',
    persistence_ownership: 'ORCHESTRATION',
    ...overrides,
  };
}

function v1Inactive() {
  return { representation: v1Representation(), ...v0() };
}

function v1Active(contractOverrides = {}) {
  return { ...v1Inactive(), handoff_contract: contract(contractOverrides) };
}

function codes(report) {
  return report.errors.map((entry) => entry.code);
}

function gitBlobId(bytes) {
  const header = Buffer.concat([Buffer.from('blob ' + bytes.length, 'ascii'), Buffer.from([0])]);
  return createHash('sha1').update(header).update(bytes).digest('hex');
}

function labGit(argv) {
  return execFileSync('git', argv, { cwd: LAB_ROOT, encoding: 'utf8', windowsHide: true }).trim();
}

/* ================================================================== *
 * IP-01 — autorité et représentation Mission Object V1
 * ================================================================== */

test('IP-01 : l’identité V1 supportée est l’identité Git-blob exacte de l’autorité 101', () => {
  const bytes = readFileSync(join(LAB_ROOT, V1_AUTHORITY.path));
  let committed = null;
  try {
    committed = labGit(['rev-parse', 'HEAD:' + V1_AUTHORITY.path]);
  } catch {
    committed = null; /* autorité non encore commise : les octets de travail sont l'identité */
  }
  if (committed !== null) assert.equal(V1_AUTHORITY.blob, committed, 'blob commis de l’autorité 101');
  if (committed === null || !bytes.includes(0x0d)) {
    assert.equal(V1_AUTHORITY.blob, gitBlobId(bytes), 'blob des octets de l’autorité 101');
  }
  assert.equal(V1_AUTHORITY.path, '101-HANDOFF-ROUTING-P-HR-01-MISSION-OBJECT-V1.md');
});

test('IP-01 : l’autorité 101 porte le contrat P-HR-01 et ne porte pas sa propre empreinte', () => {
  const text = readFileSync(join(LAB_ROOT, V1_AUTHORITY.path), 'utf8');
  assert.ok(!text.includes(V1_AUTHORITY.blob), 'un document ne peut pas porter son propre blob');
  for (const value of ['P_HR_01', 'EXECUTOR_DISPATCH', 'P_HR_01_LINEAR_V1', 'ORCHESTRATION', ...LIFECYCLE]) {
    assert.ok(text.includes(value), 'valeur absente de l’autorité : ' + value);
  }
  for (const blob of [
    'fe4be140f6a90e84d25f14119889b7642989f1d7',
    'bc94cafba19d38de88e340c5168c37a5f89258be',
    '74c08d3e562eaa348f8a975e94b03a4dd1ac710d',
    PINNED_V0_AUTHORITY.blob,
  ]) {
    assert.ok(text.includes(blob), 'lignée absente : ' + blob);
  }
});

test('IP-01 : l’encodage de representation est exactement REPO_PATH + GIT_BLOB de l’autorité 101', () => {
  assert.deepEqual(v1Representation(), {
    authority: {
      locator: { kind: 'REPO_PATH', value: V1_AUTHORITY.path },
      identity: { kind: 'GIT_BLOB', value: V1_AUTHORITY.blob },
    },
  });
  assert.equal(isExactV1Representation(v1Representation()), true);
  assert.deepEqual([...V1_ONLY_FIELDS], ['representation', 'handoff_contract']);
  assert.equal(INHERITED_ELEMENTS.length, 16);
  for (const field of V1_ONLY_FIELDS) assert.ok(!INHERITED_ELEMENTS.includes(field));
});

test('IP-01 : toute variation de l’encodage n’est plus l’identité V1', () => {
  const variants = [
    (r) => (r.authority.identity.value = '0'.repeat(40)),
    (r) => (r.authority.locator.value = '101-AUTRE.md'),
    (r) => (r.authority.locator.kind = 'REMOTE_REF'),
    (r) => (r.authority.identity.kind = 'SHA256'),
    (r) => (r.authority.label = 'prose'),
    (r) => (r.version = 'V1'),
    (r) => (r.authority.identity.extra = true),
    (r) => delete r.authority.identity,
  ];
  for (const mutate of variants) {
    const representation = v1Representation();
    mutate(representation);
    assert.equal(isExactV1Representation(representation), false, JSON.stringify(representation));
  }
  for (const value of [null, 'V1', [], {}, { authority: null }]) {
    assert.equal(isExactV1Representation(value), false);
  }
});

/* ================================================================== *
 * IP-02 — reconnaissance C-1 RAFFINÉE, CAS A..F
 * ================================================================== */

test('CAS A : representation absente + validation V0 épinglée PASS + aucun champ V1 → LEGACY V0 accepté', () => {
  const object = v0();
  const before = JSON.stringify(object);
  const recognition = recognizeRepresentation(object);
  assert.equal(recognition.case, 'A');
  assert.equal(recognition.representation, 'LEGACY_V0');
  assert.deepEqual(recognition.legacyValidation, validate(object), 'validation V0 exacte, inchangée');
  const verdict = acceptMissionObject(object);
  assert.deepEqual(verdict, { accepted: true, case: 'A', representation: 'LEGACY_V0', pHr01: 'NOT_APPLICABLE', errors: [] });
  assert.equal(JSON.stringify(object), before, 'aucune conversion : l’objet reçu est inchangé');
  assert.equal('representation' in object, false, 'aucune representation ajoutée');
  assert.equal('handoff_contract' in object, false, 'P-HR-01 non synthétisé');
});

test('CAS A : les trois objets de référence historiques sont LEGACY V0', () => {
  for (const file of ['reference-a.json', 'reference-b.json', 'reference-c.json']) {
    const verdict = acceptMissionObject(load(join(FIXTURES, file)));
    assert.equal(verdict.case, 'A', file);
    assert.equal(verdict.accepted, true, file);
  }
});

test('CAS B / FC-21 : representation absente + validation V0 FAIL → REJET, jamais V1', () => {
  const invalid = [
    (o) => (o.effects[0].mode = 'ENCOURAGED'),
    (o) => delete o.terminal,
    (o) => (o.orchestration = { agents: 3 }),
    (o) => (o.prompt = 'fais ce que tu juges bon'),
  ];
  for (const mutate of invalid) {
    const object = v0();
    mutate(object);
    const verdict = acceptMissionObject(object);
    assert.equal(verdict.case, 'B');
    assert.equal(verdict.accepted, false);
    assert.equal(verdict.representation, null);
    assert.ok(codes(verdict).every((code) => code === 'LEGACY_V0_VALIDATION_FAILED'));
  }
  for (const value of [null, [], 'mission', 42]) {
    assert.equal(recognizeRepresentation(value).case, 'B', JSON.stringify(value));
  }
});

test('CAS C / FC-22 : representation absente + champ propre à V1 → REJET, même si le reste est V0 valide', () => {
  const object = { ...v0(), handoff_contract: contract() };
  const verdict = acceptMissionObject(object, { missionPath: MISSION_PATH });
  assert.equal(verdict.case, 'C');
  assert.equal(verdict.accepted, false);
  assert.deepEqual(codes(verdict), ['V1_ONLY_FIELD_WITHOUT_REPRESENTATION']);
  /* le contrat est rejeté sans être lu : ni activé, ni ignoré */
  const malformed = { ...v0(), handoff_contract: 'n’importe quoi' };
  assert.equal(recognizeRepresentation(malformed).case, 'C');
});

test('CAS D : representation V1 exacte → V1, sémantique V1 appliquée', () => {
  const inactive = acceptMissionObject(v1Inactive());
  assert.deepEqual(inactive, { accepted: true, case: 'D', representation: 'V1', pHr01: 'INACTIVE', errors: [] });
  const active = acceptMissionObject(v1Active(), { missionPath: MISSION_PATH });
  assert.deepEqual(active, { accepted: true, case: 'D', representation: 'V1', pHr01: 'ACTIVE', errors: [] });
});

test('CAS E / FC-23 / FC-01 : representation présente, autorité inconnue, discordante ou malformée → REJET', () => {
  const representations = [
    { authority: { locator: { kind: 'REPO_PATH', value: V1_AUTHORITY.path }, identity: { kind: 'GIT_BLOB', value: '1'.repeat(40) } } },
    { authority: { locator: { kind: 'REPO_PATH', value: '102-MISSION-OBJECT-V2.md' }, identity: { kind: 'GIT_BLOB', value: V1_AUTHORITY.blob } } },
    { authority: { locator: { kind: 'REPO_PATH', value: V1_AUTHORITY.path } } },
    { authority: null },
    {},
    null,
    'V1',
    ['V1'],
    { ...v1Representation(), version: 'V1' },
  ];
  for (const representation of representations) {
    const object = { ...v0(), representation };
    const verdict = acceptMissionObject(object);
    assert.equal(verdict.case, 'E', JSON.stringify(representation));
    assert.equal(verdict.accepted, false);
    assert.deepEqual(codes(verdict), ['UNKNOWN_REPRESENTATION']);
  }
});

test('CAS F / FC-24 : representation qui tente d’identifier V0 → REJET', () => {
  const byPath = {
    authority: { locator: { kind: 'REPO_PATH', value: PINNED_V0_AUTHORITY.path }, identity: { kind: 'GIT_BLOB', value: PINNED_V0_AUTHORITY.blob } },
  };
  const byBlobOnly = {
    authority: { locator: { kind: 'REPO_PATH', value: 'mission-object-v0.md' }, identity: { kind: 'GIT_BLOB', value: PINNED_V0_AUTHORITY.blob } },
  };
  const byPathOnly = { authority: { locator: { kind: 'REPO_PATH', value: PINNED_V0_AUTHORITY.path } } };
  for (const representation of [byPath, byBlobOnly, byPathOnly]) {
    const verdict = acceptMissionObject({ ...v0(), representation });
    assert.equal(verdict.case, 'F');
    assert.equal(verdict.accepted, false);
    assert.deepEqual(codes(verdict), ['REPRESENTATION_IDENTIFIES_V0']);
  }
});

test('IP-02 : la reconnaissance V1 ne retombe jamais sur la validation V0', () => {
  /* E : un objet V0 parfaitement valide, porteur d'une autorité inconnue, n'est pas A */
  const unknown = { ...v0(), representation: { authority: { locator: { kind: 'REPO_PATH', value: 'x.md' }, identity: { kind: 'GIT_BLOB', value: '2'.repeat(40) } } } };
  assert.equal(validate(inheritedFields(unknown)).ok, true);
  assert.equal(acceptMissionObject(unknown).case, 'E');
  /* D invalide : rejeté comme V1, jamais réexaminé comme V0 */
  const broken = v1Inactive();
  broken.effects[0].mode = 'ENCOURAGED';
  const verdict = acceptMissionObject(broken);
  assert.equal(verdict.case, 'D');
  assert.equal(verdict.representation, 'V1');
  assert.equal(verdict.accepted, false);
  assert.ok(codes(verdict).includes('INHERITED_FIELD_INVALID'));
});

test('IP-02 : aucune discrimination par l’appelant ou le contexte', () => {
  assert.equal(recognizeRepresentation.length, 1, 'la reconnaissance ne reçoit que l’objet');
  for (const object of [v0(), v1Inactive(), v1Active(), { ...v0(), handoff_contract: contract() }]) {
    const seen = new Set();
    for (const missionPath of [undefined, MISSION_PATH, 'autre/mission.json', 'tooling/x/mission.json']) {
      const verdict = acceptMissionObject(object, { missionPath });
      seen.add(verdict.case + '/' + String(verdict.representation));
    }
    assert.equal(seen.size, 1, 'la représentation ne dépend pas du chemin fourni : ' + [...seen].join(' '));
  }
});

test('IP-02 : aucune fonction de conversion n’existe dans le module V1', async () => {
  const exported = Object.keys(await import('../v1.mjs'));
  for (const name of exported) {
    assert.ok(!/convert|upgrade|downgrade|migrat|toV0|toV1|fromV0|fromV1/i.test(name), 'export suspect : ' + name);
  }
});

/* ================================================================== *
 * Comportement V1 et validation du contrat — FC-04 à FC-10
 * ================================================================== */

test('V1 sans handoff_contract → ACCEPTÉ, P-HR-01 INACTIF, sémantique V0 des champs hérités retenue', () => {
  const object = v1Inactive();
  const report = validateMissionObjectV1(object);
  assert.deepEqual(report, { ok: true, errors: [], pHr01: 'INACTIVE' });
  assert.deepEqual(validate(inheritedFields(object)), validate(v0()), 'mêmes règles V0 sur les champs hérités');
});

test('V1 avec handoff_contract valide → ACCEPTÉ, P-HR-01 ACTIF, validation complète', () => {
  const report = validateMissionObjectV1(v1Active(), { missionPath: MISSION_PATH });
  assert.deepEqual(report, { ok: true, errors: [], pHr01: 'ACTIVE' });
  assert.deepEqual(validateHandoffContract(contract(), { missionPath: MISSION_PATH }), { ok: true, errors: [] });
});

test('V1 actif sans chemin de mission → validation incomplète → REJET', () => {
  const verdict = acceptMissionObject(v1Active());
  assert.equal(verdict.accepted, false);
  assert.deepEqual(codes(verdict), ['HANDOFF_CONTEXT_REQUIRED']);
});

test('FC-05 : handoff_contract incomplet, membre par membre → REJET', () => {
  for (const key of HANDOFF_CONTRACT_KEYS) {
    const object = v1Active();
    delete object.handoff_contract[key];
    const verdict = acceptMissionObject(object, { missionPath: MISSION_PATH });
    assert.equal(verdict.accepted, false, key);
    assert.ok(codes(verdict).includes('HANDOFF_CONTRACT_INCOMPLETE'), key);
  }
  assert.deepEqual(codes(validateHandoffContract({}, { missionPath: MISSION_PATH })), Array(5).fill('HANDOFF_CONTRACT_INCOMPLETE'));
});

test('FC-06 : handoff_contract malformé → REJET', () => {
  for (const value of [null, [], 'P_HR_01', 1, true]) {
    const object = { ...v1Inactive(), handoff_contract: value };
    const verdict = acceptMissionObject(object, { missionPath: MISSION_PATH });
    assert.equal(verdict.accepted, false, JSON.stringify(value));
    assert.deepEqual(codes(verdict), ['HANDOFF_CONTRACT_MALFORMED']);
  }
  for (const key of HANDOFF_CONTRACT_KEYS) {
    for (const bad of [null, 1, ['P_HR_01'], { value: 'x' }]) {
      const object = v1Active({ [key]: bad });
      const verdict = acceptMissionObject(object, { missionPath: MISSION_PATH });
      assert.equal(verdict.accepted, false, key);
      assert.ok(codes(verdict).includes('HANDOFF_CONTRACT_MALFORMED'), key + ' ' + JSON.stringify(bad));
    }
  }
  for (const extra of ['label', 'instructions', 'next_stage_after_return', 'source', 'resolved']) {
    const object = v1Active({ [extra]: 'x' });
    const verdict = acceptMissionObject(object, { missionPath: MISSION_PATH });
    assert.deepEqual(codes(verdict), ['HANDOFF_CONTRACT_MALFORMED'], extra);
  }
});

test('FC-04 : version P-HR inconnue → REJET', () => {
  for (const version of ['P_HR_02', 'p_hr_01', 'P-HR-01', 'P_HR_01 ', '']) {
    const verdict = acceptMissionObject(v1Active({ version }), { missionPath: MISSION_PATH });
    assert.deepEqual(codes(verdict), ['UNKNOWN_P_HR_VERSION'], version);
  }
});

test('FC-07 : next_control_stage hors domaine → REJET', () => {
  for (const stage of ['RESULT_ADMISSION', 'executor_dispatch', 'EXECUTOR_RETURN', 'ANY', '']) {
    const verdict = acceptMissionObject(v1Active({ next_control_stage: stage }), { missionPath: MISSION_PATH });
    assert.deepEqual(codes(verdict), ['NEXT_CONTROL_STAGE_MISMATCH'], stage);
  }
});

test('FC-08 : return_destination hors de la forme ou du répertoire canonique → REJET', () => {
  const destinations = [
    '/missions/900-p-hr-01-fixture/result.json',
    'C:/missions/900-p-hr-01-fixture/result.json',
    'missions\\900-p-hr-01-fixture\\result.json',
    'missions/900-p-hr-01-fixture/../900-p-hr-01-fixture/result.json',
    './missions/900-p-hr-01-fixture/result.json',
    'missions//900-p-hr-01-fixture/result.json',
    'missions/900-p-hr-01-fixture/results.json',
    'missions/900-p-hr-01-fixture/result.json/',
    'missions/901-autre/result.json',
    'result.json',
    'missions/900-p-hr-01-fixture/sub/result.json',
  ];
  for (const destination of destinations) {
    const verdict = acceptMissionObject(v1Active({ return_destination: destination }), { missionPath: MISSION_PATH });
    assert.equal(verdict.accepted, false, destination);
    assert.ok(codes(verdict).every((code) => code === 'RETURN_DESTINATION_MISMATCH'), destination + ' ' + codes(verdict));
  }
  assert.equal(canonicalReturnDestination(MISSION_PATH), RESULT_PATH);
  assert.equal(canonicalReturnDestination('mission.json'), 'result.json');
  for (const bad of ['missions/x/other.json', '/abs/mission.json', 'a\\mission.json', '../mission.json', '']) {
    assert.throws(() => canonicalReturnDestination(bad), (error) => error.code === 'MISSION_PATH_INVALID', bad);
  }
});

test('FC-09 : stage_ordering_dependency hors domaine → REJET', () => {
  for (const ordering of ['P_HR_01_LINEAR_V2', 'P_HR_01_GRAPH', 'LINEAR', '']) {
    const verdict = acceptMissionObject(v1Active({ stage_ordering_dependency: ordering }), { missionPath: MISSION_PATH });
    assert.deepEqual(codes(verdict), ['ORDERING_MISMATCH'], ordering);
  }
});

test('FC-10 : persistence_ownership hors domaine → REJET', () => {
  for (const owner of ['EXECUTOR', 'orchestration', 'ANY', 'HUMAN', '']) {
    const verdict = acceptMissionObject(v1Active({ persistence_ownership: owner }), { missionPath: MISSION_PATH });
    assert.deepEqual(codes(verdict), ['PERSISTENCE_OWNER_MISMATCH'], owner);
  }
});

test('V1 : un élément de premier niveau inconnu reste refusé (schéma clos)', () => {
  const object = { ...v1Active(), routing: { next: 'X' } };
  const verdict = acceptMissionObject(object, { missionPath: MISSION_PATH });
  assert.equal(verdict.accepted, false);
  assert.ok(codes(verdict).includes('INHERITED_FIELD_INVALID'));
});

/* ================================================================== *
 * FC-02 / FC-03 — un chemin V0 seulement reçoit un V1
 * ================================================================== */

test('FC-02 / FC-03 : le validateur V0 refuse un V1 et ne l’accepte jamais comme V0', () => {
  for (const object of [v1Inactive(), v1Active()]) {
    const before = JSON.stringify(object);
    const report = validate(object);
    assert.equal(report.ok, false);
    const paths = report.errors.map((entry) => entry.path);
    assert.ok(paths.includes('representation'), 'representation non ignorée');
    if ('handoff_contract' in object) assert.ok(paths.includes('handoff_contract'), 'handoff_contract non ignoré');
    assert.equal(JSON.stringify(object), before, 'aucune rétrogradation implicite');
  }
});

test('FC-02 / FC-03 : les panneaux V0 de la console refusent un V1 actif — aucun rendu, aucune lecture de résultat', () => {
  const root = mkdtempSync(join(tmpdir(), 'p-hr-01-console-'));
  try {
    const missionFile = join(root, 'mission.json');
    const resultFile = join(root, 'result.json');
    writeFileSync(missionFile, JSON.stringify(v1Active(), null, 2) + '\n');
    writeFileSync(resultFile, '{ "illisible": ');
    assert.throws(
      () => projectMission(missionFile, 'mission.json', 'sha1'),
      (error) => error.code === 'VALIDATION_FAILED' && error.status === 422 && error.details.subject === 'MISSION_OBJECT',
    );
    const blob = gitBlobId(readFileSync(missionFile));
    const repository = Object.freeze({ realRoot: root, label: 'fixture', objectFormat: 'sha1', head: '0'.repeat(40) });
    assert.throws(
      () => projectResult(repository, { resultPath: 'result.json', missionPath: 'mission.json', missionBlob: blob }),
      /* refus sur la mission, AVANT tout parse du résultat : un résultat illisible
         aurait sinon rendu PARSE_FAILED */
      (error) => error.code === 'VALIDATION_FAILED' && error.details.subject === 'MISSION_OBJECT',
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

/* ================================================================== *
 * IP-10 — rendu, inspection et validation déterministes
 * ================================================================== */

const V1_FIXTURES = [
  { name: 'active', pHr01: 'ACTIVE' },
  { name: 'inactive', pHr01: 'INACTIVE' },
].map((entry) => ({
  ...entry,
  missionPath: 'tooling/mission-object/fixtures/p-hr-01/' + entry.name + '/mission.json',
  file: join(FIXTURES, 'p-hr-01', entry.name, 'mission.json'),
  envelope: join(FIXTURES, 'p-hr-01', entry.name, 'envelope.md'),
}));

test('IP-10 : les fixtures V1 sont acceptées avec l’état P-HR-01 attendu', () => {
  for (const fixture of V1_FIXTURES) {
    const verdict = acceptMissionObject(load(fixture.file), { missionPath: fixture.missionPath });
    assert.equal(verdict.accepted, true, fixture.name);
    assert.equal(verdict.case, 'D');
    assert.equal(verdict.pHr01, fixture.pHr01);
  }
});

test('IP-10 : rendu V1 déterministe, identique à l’enveloppe de référence', () => {
  for (const fixture of V1_FIXTURES) {
    const object = load(fixture.file);
    const first = renderMissionObjectV1(object, { missionPath: fixture.missionPath }).text;
    const second = renderMissionObjectV1(load(fixture.file), { missionPath: fixture.missionPath }).text;
    assert.equal(first, second, 'rendu non déterministe');
    assert.equal(first, readFileSync(fixture.envelope, 'utf8'), 'enveloppe de référence ' + fixture.name);
    assert.equal(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(first), false, 'aucun horodatage');
  }
});

test('IP-10 : le rendu V1 ne dépend d’aucun état d’environnement étranger', () => {
  const fixture = V1_FIXTURES[0];
  const before = renderMissionObjectV1(load(fixture.file), { missionPath: fixture.missionPath }).text;
  const saved = { TZ: process.env.TZ, LANG: process.env.LANG };
  process.env.TZ = 'Pacific/Kiritimati';
  process.env.LANG = 'tlh_KL.UTF-8';
  try {
    assert.equal(renderMissionObjectV1(load(fixture.file), { missionPath: fixture.missionPath }).text, before);
  } finally {
    if (saved.TZ === undefined) delete process.env.TZ;
    else process.env.TZ = saved.TZ;
    if (saved.LANG === undefined) delete process.env.LANG;
    else process.env.LANG = saved.LANG;
  }
});

test('IP-10 : les champs hérités sont rendus par le rendu V0 inchangé, les sections V1 seulement insérées', () => {
  for (const fixture of V1_FIXTURES) {
    const object = load(fixture.file);
    const v1 = renderMissionObjectV1(object, { missionPath: fixture.missionPath });
    const v0text = render(inheritedFields(object)).text;
    const inserted = v1.trace.filter((span) => span.path === 'representation' || span.path === 'handoff_contract');
    const from = Math.min(...inserted.map((span) => span.from));
    const to = Math.max(...inserted.map((span) => span.to));
    const lines = v1.text.split('\n');
    assert.equal([...lines.slice(0, from), ...lines.slice(to)].join('\n'), v0text);
  }
});

test('IP-10 : couverture de rendu V1 complète — aucun élément omis, inventé ou vide', () => {
  for (const fixture of V1_FIXTURES) {
    const object = load(fixture.file);
    const coverage = renderCoverageV1(object, { missionPath: fixture.missionPath });
    assert.deepEqual(coverage.omitted, []);
    assert.deepEqual(coverage.invented, []);
    assert.deepEqual(coverage.empty, []);
    assert.equal(coverage.complete, true);
    const expected = normativeElementsV1(object).map((entry) => entry.path);
    assert.ok(expected.includes('representation'));
    assert.equal(expected.includes('handoff_contract'), fixture.pHr01 === 'ACTIVE');
    assert.equal(expected.length, normativeElements(inheritedFields(object)).length + (fixture.pHr01 === 'ACTIVE' ? 2 : 1));
  }
});

test('IP-10 : le rendu V1-capable rend un LEGACY V0 par le rendu V0, octet pour octet', () => {
  for (const file of ['reference-a.json', 'reference-b.json', 'reference-c.json']) {
    const object = load(join(FIXTURES, file));
    assert.equal(renderAccepted(object).text, render(object).text, file);
  }
});

test('IP-10 : le rendu refuse tout objet non accepté — rien n’est rendu', () => {
  const rejected = [
    { ...v0(), handoff_contract: contract() },
    { ...v0(), representation: { authority: null } },
    v1Active({ persistence_ownership: 'EXECUTOR' }),
    v1Active(),
  ];
  for (const object of rejected) {
    assert.throws(() => renderAccepted(object), (error) => error.code === 'MISSION_OBJECT_REJECTED');
    assert.throws(() => renderMissionObjectV1(object), (error) => error.code === 'NOT_AN_ACCEPTED_V1');
  }
  assert.throws(() => renderMissionObjectV1(v0()), (error) => error.code === 'NOT_AN_ACCEPTED_V1');
});

test('IP-10 : inspection déterministe', () => {
  assert.deepEqual(inspect(v0()), {
    case: 'A',
    representation: 'LEGACY_V0',
    accepted: true,
    pHr01: 'NOT_APPLICABLE',
    contract: null,
    errors: [],
  });
  assert.deepEqual(inspect(v1Active(), { missionPath: MISSION_PATH }), {
    case: 'D',
    representation: 'V1',
    accepted: true,
    pHr01: 'ACTIVE',
    contract: contract(),
    errors: [],
  });
  const rejected = inspect({ ...v0(), representation: v1Representation(), handoff_contract: contract({ version: 'P_HR_02' }) }, { missionPath: MISSION_PATH });
  assert.equal(rejected.accepted, false);
  assert.equal(rejected.pHr01, null);
  assert.equal(rejected.contract, null);
});

function runCli(args) {
  return spawnSync(process.execPath, [V1_CLI, ...args], { cwd: LAB_ROOT, encoding: 'utf8', windowsHide: true });
}

test('IP-10 : CLI inspect et render', () => {
  const active = V1_FIXTURES[0];
  const inspected = runCli(['inspect', active.missionPath]);
  assert.equal(inspected.status, 0, inspected.stderr);
  assert.ok(inspected.stdout.startsWith('CAS              D\nREPRESENTATION   V1\nVERDICT          ACCEPTE\nP-HR-01          ACTIVE\n'));
  assert.ok(inspected.stdout.includes('return_destination         = ' + 'tooling/mission-object/fixtures/p-hr-01/active/result.json'));

  const rendered = runCli(['render', active.missionPath]);
  assert.equal(rendered.status, 0, rendered.stderr);
  assert.equal(rendered.stdout, readFileSync(active.envelope, 'utf8'));

  const legacy = runCli(['render', 'missions/022-p-hr-01-bounded-implementation/mission.json']);
  assert.equal(legacy.status, 0, legacy.stderr);
  assert.equal(
    legacy.stdout,
    render(load(join(LAB_ROOT, 'missions', '022-p-hr-01-bounded-implementation', 'mission.json'))).text,
  );

  const wrongPath = runCli(['inspect', active.missionPath, '--mission-path', 'missions/autre/mission.json']);
  assert.equal(wrongPath.status, 1);
  assert.ok(wrongPath.stdout.includes('ERREUR  RETURN_DESTINATION_MISMATCH'));

  assert.equal(runCli([]).status, 2);
  assert.equal(runCli(['route', active.missionPath]).status, 2);
});
