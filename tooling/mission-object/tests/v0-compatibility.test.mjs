/**
 * Preuve de compatibilité V0 — séparée des tests V1 (autorité 100 § 14).
 *
 * L'ensemble prouvé est celui des Mission Objects COMMIS au HEAD de gel de la
 * transaction d'implémentation de P-HR-01, lus sur leurs octets commis, jamais
 * sur une copie de travail : une extraction CRLF ne change pas la preuve.
 *
 * Rien n'est revendiqué au-delà de ce qui est testé ici :
 *   - octet pour octet : enveloppes rendues, identités de blob historiques,
 *     outillage V0 et Result Instance inchangé ;
 *   - équivalence sémantique : le verdict de validation V0 rendu par le chemin
 *     V1-capable est l'objet de validation V0 lui-même.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

import { parse } from '../mission-object.mjs';
import { validate } from '../validate.mjs';
import { render } from '../render.mjs';
import { acceptMissionObject, inspect, recognizeRepresentation, renderAccepted } from '../v1.mjs';
import { parse as parseResult } from '../../result-instance/result-instance.mjs';
import { validate as validateResult, validateAgainstContract } from '../../result-instance/validate.mjs';

const LAB_ROOT = join(import.meta.dirname, '..', '..', '..');

/** HEAD de gel de la transaction P-HR-01 — autorité 100 § 7, mission 022. */
const FREEZE = '127b69dd5f09d9f6997ce864138a2a40e210c0db';

function git(argv, options = {}) {
  return execFileSync('git', argv, { cwd: LAB_ROOT, windowsHide: true, maxBuffer: 64 * 1024 * 1024, ...options });
}

const FILES = git(['ls-tree', '-r', '--name-only', FREEZE], { encoding: 'utf8' }).split('\n').filter(Boolean);

function committed(path, commit = FREEZE) {
  return git(['cat-file', 'blob', commit + ':' + path]);
}

function blob(path, commit) {
  return git(['rev-parse', commit + ':' + path], { encoding: 'utf8' }).trim();
}

/** Un Mission Object porte les éléments requis de l'autorité 14 à sa racine. */
function isMissionObjectShaped(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    ['identity', 'references', 'effects', 'return_contract', 'terminal'].every((key) => key in value)
  );
}

const MISSION_OBJECTS = FILES.filter((path) => path.endsWith('.json')).filter((path) => {
  try {
    return isMissionObjectShaped(JSON.parse(committed(path).toString('utf8')));
  } catch {
    return false;
  }
});

const PATH_RULE = /^(missions\/[^/]+\/mission\.json|tooling\/mission-object\/dogfood\/[^/]+\/mission\.json|tooling\/mission-object\/fixtures\/reference-[a-c]\.json|tooling\/result-instance\/live-dogfood\/[^/]+\/mission\.json)$/;

/* ------------------------------------------------------------------ */

test('V0 : l’inventaire des Mission Objects commis au HEAD de gel compte 29 objets, par deux méthodes', () => {
  assert.equal(MISSION_OBJECTS.length, 29);
  assert.deepEqual(MISSION_OBJECTS, FILES.filter((path) => PATH_RULE.test(path)), 'forme racine = règle de chemin');
  assert.equal(MISSION_OBJECTS.filter((path) => path.startsWith('missions/')).length, 22);
});

test('V0 : chaque Mission Object commis est reconnu LEGACY V0 (CAS A) et accepté par l’outillage V1-capable', () => {
  for (const path of MISSION_OBJECTS) {
    const text = committed(path).toString('utf8');
    const object = parse(text);
    assert.equal('representation' in object, false, path + ' : aucune representation embarquée');
    assert.equal('handoff_contract' in object, false, path);
    const recognition = recognizeRepresentation(object);
    assert.equal(recognition.case, 'A', path);
    assert.deepEqual(acceptMissionObject(object), {
      accepted: true,
      case: 'A',
      representation: 'LEGACY_V0',
      pHr01: 'NOT_APPLICABLE',
      errors: [],
    });
    /* sémantique V0 inchangée : le verdict est celui du validateur V0 lui-même */
    assert.deepEqual(recognition.legacyValidation, validate(parse(text)), path);
    assert.deepEqual(recognition.legacyValidation, { ok: true, errors: [] }, path);
    /* aucune conversion : l'objet reçu n'est pas modifié */
    assert.equal(JSON.stringify(object), JSON.stringify(parse(text)), path);
  }
});

test('V0 : P-HR-01 n’est jamais synthétisé pour un objet historique', () => {
  for (const path of MISSION_OBJECTS) {
    const report = inspect(parse(committed(path).toString('utf8')));
    assert.equal(report.pHr01, 'NOT_APPLICABLE', path);
    assert.equal(report.contract, null, path);
    assert.equal(report.representation, 'LEGACY_V0', path);
  }
});

test('V0 : le rendu déterministe est inchangé — 26 enveloppes commises reproduites octet pour octet', () => {
  let compared = 0;
  for (const path of MISSION_OBJECTS) {
    const envelope = path.replace(/mission\.json$/, 'envelope.md');
    if (envelope === path || !FILES.includes(envelope)) continue;
    const object = parse(committed(path).toString('utf8'));
    const expected = committed(envelope).toString('utf8');
    assert.equal(render(object).text, expected, path + ' : rendu V0');
    assert.equal(renderAccepted(object).text, expected, path + ' : rendu V1-capable');
    compared += 1;
  }
  assert.equal(compared, 26);
});

test('V0 : le comportement de source des Result Instances est inchangé — 24 résultats historiques', () => {
  const results = FILES.filter((path) => /(^|\/)result\.json$|representability\/[ab]\.json$/.test(path));
  assert.equal(results.length, 24);
  for (const path of results) {
    const instance = parseResult(committed(path).toString('utf8'));
    assert.deepEqual(validateResult(instance), { ok: true, errors: [] }, path);
    const source = instance.source.authority;
    const mission = JSON.parse(committed(source.locator.value).toString('utf8'));
    const contract = validateAgainstContract(instance, mission);
    assert.equal(contract.ok, true, path);
    assert.ok(contract.checked > 0, path);
    /* liaison de source historique inchangée : elle désigne toujours le blob commis de sa mission */
    assert.equal(source.identity.value, blob(source.locator.value, FREEZE), path);
    assert.equal(source.identity.value, blob(source.locator.value, 'HEAD'), path);
  }
});

test('V0 : octets et blobs historiques inchangés au HEAD courant', () => {
  const historical = FILES.filter(
    (path) =>
      MISSION_OBJECTS.includes(path) ||
      /^missions\/[^/]+\/(envelope\.md|result\.json)$/.test(path) ||
      /^tooling\/(mission-object|result-instance)\/(dogfood|live-dogfood|representability)\//.test(path),
  );
  assert.ok(historical.length >= 29 + 26 + 22);
  const frozenOutputs = [
    'tooling/mission-object/mission-object.mjs',
    'tooling/mission-object/validate.mjs',
    'tooling/mission-object/render.mjs',
    'tooling/mission-object/fixtures/reference-a.json',
    'tooling/mission-object/fixtures/reference-b.json',
    'tooling/mission-object/fixtures/reference-c.json',
    'tooling/mission-object/tests/mission-object.test.mjs',
    'tooling/mission-object/tests/qualification.test.mjs',
    'tooling/mission-object/tests/coverage-manifest.json',
    'tooling/result-instance/result-instance.mjs',
    'tooling/result-instance/validate.mjs',
    'tooling/console/mission-adapter.mjs',
    'tooling/console/result-adapter.mjs',
    '14-TOOLING-EXPERIMENT-002-MISSION-OBJECT-V0.md',
    '23-TOOLING-EXPERIMENT-003-RESULT-INSTANCE-V0.md',
  ];
  for (const path of [...historical, ...frozenOutputs]) {
    assert.equal(blob(path, 'HEAD'), blob(path, FREEZE), path);
  }
  assert.equal(blob('14-TOOLING-EXPERIMENT-002-MISSION-OBJECT-V0.md', FREEZE), '7d634c855ab9de8c66a21c134b03de8f118c3de4');
  assert.equal(blob('tooling/mission-object/validate.mjs', FREEZE), '8dd06a2a1a2b7869f11456cf6a809dfad69f1a79');
});
