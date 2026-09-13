/**
 * TOOLING-EXPERIMENT-003 — qualification de l'implementation Result Instance v0.
 *
 * Elle qualifie le logiciel et les cas de representabilite, et rien d'autre.
 *
 * Ce qu'aucun test de ce fichier ne pretend etablir :
 *
 *   la capture par un executant en usage reel fonctionne
 *   les octets des cas ont ete historiquement retournes
 *   une valeur rapportee est vraie
 *
 * CONTRAINTES DE REVUE, non mecanisables, consignees ici pour qu'on ne les
 * confonde pas avec ce qui est teste :
 *
 *   un identifiant de fait EXECUTOR dont le jeton textuel encode lui-meme une
 *   semantique de qualification n'est PAS detectable mecaniquement ;
 *
 *   la fidelite d'un cas de representabilite a ce qui fut reellement retourne
 *   n'est pas verifiable : aucun retour brut historique n'est durable.
 *
 * Aucun etat CCR reel, aucun fournisseur, aucun run protege, aucun reseau,
 * aucun modele de langage, aucune transcription de session.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { ENTRY_KINDS, FACT_SOURCES, VALUE_TYPES, factKey, load, parse } from '../result-instance.mjs';
import { validate, validateAgainstContract } from '../validate.mjs';

const HERE = import.meta.dirname;
const REPO = join(HERE, '..', '..', '..');
const MANIFEST = JSON.parse(readFileSync(join(HERE, 'provenance-manifest.json'), 'utf8'));

const AUTH23 = {
  locator: { kind: 'REPO_PATH', value: '23-TOOLING-EXPERIMENT-003-RESULT-INSTANCE-V0.md' },
  identity: { kind: 'GIT_BLOB', value: '1676b3de4546b40a801d0a400b4c47ddd9b82062' },
};
const MISSION_REF = {
  locator: { kind: 'REPO_PATH', value: 'tooling/mission-object/dogfood/003/mission.json' },
  identity: { kind: 'GIT_BLOB', value: '37818dcfdc0b5e8c41bd847b8751fbda6e482116' },
};
const PROTOCOL_REF = {
  locator: { kind: 'REPO_PATH', value: '09-TOOLING-EXPERIMENT-001-PROGRAM-STATE.md' },
  identity: { kind: 'GIT_BLOB', value: 'c94e03829e107b51f63efcdb950bfeff123f50d1' },
};

/** La plus petite instance valide : adossee a un protocole, une seule entree. */
function base() {
  return {
    representation: { authority: structuredClone(AUTH23) },
    execution: { id: 'unit-minimal' },
    source: { kind: 'PROTOCOL', authority: structuredClone(PROTOCOL_REF) },
    reported_by: { executor: 'AGENT_CCR_LAB_99' },
    reported_entries: [
      {
        kind: 'REPORTED_VALUE',
        fact: { defined_by: 'EXECUTOR', id: 'worktree.state' },
        value: { type: 'SYMBOL', value: 'CLEAN' },
      },
    ],
  };
}

/** Instance adossee a un contrat, entree liee a une exigence de retour reelle. */
function contractBacked() {
  const instance = base();
  instance.execution.id = 'unit-contract';
  instance.source = { kind: 'MISSION', authority: structuredClone(MISSION_REF) };
  instance.return_contract = { authority: structuredClone(MISSION_REF) };
  instance.reported_entries = [
    {
      kind: 'REPORTED_VALUE',
      fact: { defined_by: 'RETURN_CONTRACT', id: 'rf-push-status' },
      value: { type: 'SYMBOL', value: 'NOT_ATTEMPTED' },
    },
  ];
  return instance;
}

function firstError(result) {
  return result.errors.length > 0 ? result.errors[0].path + ' ' + result.errors[0].note : '(aucune)';
}

/* ------------------------------------------------------------------ *
 * Instances valides
 * ------------------------------------------------------------------ */

test('une instance minimale est valide', () => {
  const result = validate(base());
  assert.equal(result.ok, true, firstError(result));
});

test('une instance adossee a un contrat est valide', () => {
  const result = validate(contractBacked());
  assert.equal(result.ok, true, firstError(result));
});

test('une instance adossee a un protocole est valide sans contrat de retour', () => {
  const instance = base();
  assert.equal(instance.return_contract, undefined);
  assert.equal(instance.source.kind, 'PROTOCOL');
  assert.equal(validate(instance).ok, true);
});

/* ------------------------------------------------------------------ *
 * Rapporte n'est pas vrai
 * ------------------------------------------------------------------ */

test('une valeur rapportee est conservee telle quelle, sans champ de verite', () => {
  const instance = contractBacked();
  instance.reported_entries[0].value = { type: 'SYMBOL', value: 'NOT_REALIZED' };
  assert.equal(validate(instance).ok, true);
  const entry = instance.reported_entries[0];
  assert.deepEqual(Object.keys(entry).sort(), ['fact', 'kind', 'value']);
  for (const forbidden of ['established', 'true', 'verified', 'confirmed', 'truth']) {
    assert.equal(entry[forbidden], undefined);
  }
});

test('aucun champ de verite ou de qualification ne peut etre ajoute a une entree', () => {
  for (const key of ['established_true', 'verdict', 'finding', 'priority', 'sufficiency']) {
    const instance = contractBacked();
    instance.reported_entries[0][key] = 'X';
    const result = validate(instance);
    assert.equal(result.ok, false, 'cle acceptee a tort : ' + key);
    assert.match(result.errors[0].note, /cle hors schema/);
  }
});

test('aucun champ de qualification ne peut etre ajoute a la racine', () => {
  for (const key of ['finding', 'gap', 'remediation', 'next_action', 'workflow_state', 'human_decision', 'policy']) {
    const instance = base();
    instance[key] = 'X';
    const result = validate(instance);
    assert.equal(result.ok, false, 'cle racine acceptee a tort : ' + key);
    assert.match(result.errors[0].note, /cle hors schema/);
  }
});

/* ------------------------------------------------------------------ *
 * Modele de valeurs typees
 * ------------------------------------------------------------------ */

test('le vocabulaire de types est exactement SCALAR, SYMBOL, SET', () => {
  assert.deepEqual(VALUE_TYPES, ['SCALAR', 'SYMBOL', 'SET']);
});

test('une valeur SCALAR est admise', () => {
  const instance = base();
  instance.reported_entries[0].value = { type: 'SCALAR', value: '0' };
  assert.equal(validate(instance).ok, true);
});

test('une valeur SYMBOL est admise', () => {
  const instance = base();
  instance.reported_entries[0].value = { type: 'SYMBOL', value: 'CLEAN' };
  assert.equal(validate(instance).ok, true);
});

test('un SET vide et un SET non vide sont admis', () => {
  for (const members of [[], [{ type: 'SCALAR', value: 'README.md' }, { type: 'SYMBOL', value: 'NONE' }]]) {
    const instance = base();
    instance.reported_entries[0].value = { type: 'SET', members };
    const result = validate(instance);
    assert.equal(result.ok, true, firstError(result));
  }
});

test('les types nus BOOLEAN, INTEGER, OBJECT, MAP, ANY, JSON sont refuses', () => {
  for (const type of ['BOOLEAN', 'INTEGER', 'OBJECT', 'MAP', 'ANY', 'JSON']) {
    const instance = base();
    instance.reported_entries[0].value = { type, value: 'x' };
    const result = validate(instance);
    assert.equal(result.ok, false, 'type accepte a tort : ' + type);
  }
});

test('un booleen ou un nombre nu comme valeur est refuse', () => {
  for (const raw of [true, false, 0, null]) {
    const instance = base();
    instance.reported_entries[0].value = { type: 'SCALAR', value: raw };
    assert.equal(validate(instance).ok, false, 'valeur acceptee a tort : ' + String(raw));
  }
});

test('un SET imbrique dans un SET est refuse', () => {
  const instance = base();
  instance.reported_entries[0].value = { type: 'SET', members: [{ type: 'SET', members: [] }] };
  assert.equal(validate(instance).ok, false);
});

/* ------------------------------------------------------------------ *
 * Valeur de domaine contre non-production structurelle
 * ------------------------------------------------------------------ */

test('NOT_ATTEMPTED reste une valeur de domaine rapportee, pas une absence', () => {
  const instance = contractBacked();
  instance.reported_entries[0].value = { type: 'SYMBOL', value: 'NOT_ATTEMPTED' };
  assert.equal(validate(instance).ok, true);
  assert.equal(instance.reported_entries[0].kind, 'REPORTED_VALUE');
  assert.equal(instance.reported_entries[0].value.value, 'NOT_ATTEMPTED');
});

test('les quatre negatifs de domaine restent des valeurs distinctes', () => {
  for (const value of ['NO', 'NOT_REALIZED', 'NOT_MEASURED', 'NONE']) {
    const instance = base();
    instance.reported_entries[0].value = { type: 'SYMBOL', value };
    assert.equal(validate(instance).ok, true, 'valeur refusee a tort : ' + value);
    assert.equal(instance.reported_entries[0].value.value, value);
  }
});

test('la non-production structurelle est une classe d entree distincte', () => {
  assert.deepEqual(ENTRY_KINDS, ['REPORTED_VALUE', 'STRUCTURAL_NON_PRODUCTION']);
  const instance = contractBacked();
  instance.reported_entries.push({ kind: 'STRUCTURAL_NON_PRODUCTION', requirement: 'rf-commit-identifier' });
  const result = validate(instance);
  assert.equal(result.ok, true, firstError(result));
});

test('une entree de non-production ne peut porter aucune valeur', () => {
  const instance = contractBacked();
  instance.reported_entries.push({
    kind: 'STRUCTURAL_NON_PRODUCTION',
    requirement: 'rf-commit-identifier',
    value: { type: 'SYMBOL', value: 'NOT_REALIZED' },
  });
  const result = validate(instance);
  assert.equal(result.ok, false);
  assert.match(result.errors[0].note, /cle hors schema/);
});

test('une entree de non-production ne peut porter aucune identite de fait', () => {
  const instance = contractBacked();
  instance.reported_entries.push({
    kind: 'STRUCTURAL_NON_PRODUCTION',
    requirement: 'rf-commit-identifier',
    fact: { defined_by: 'RETURN_CONTRACT', id: 'rf-commit-identifier' },
  });
  assert.equal(validate(instance).ok, false);
});

test('une exigence a la fois produite et declaree non produite est refusee', () => {
  const instance = contractBacked();
  instance.reported_entries.push({ kind: 'STRUCTURAL_NON_PRODUCTION', requirement: 'rf-push-status' });
  const result = validate(instance);
  assert.equal(result.ok, false);
  assert.match(result.errors[0].note, /a la fois produite et declaree non produite/);
});

test('la non-production structurelle exige un contrat de retour prospectif', () => {
  const instance = base();
  instance.reported_entries.push({ kind: 'STRUCTURAL_NON_PRODUCTION', requirement: 'rf-x' });
  assert.equal(validate(instance).ok, false);
});

test('aucun vocabulaire de motifs de non-production n existe en v0', () => {
  const instance = contractBacked();
  instance.reported_entries.push({
    kind: 'STRUCTURAL_NON_PRODUCTION',
    requirement: 'rf-commit-identifier',
    reason: 'NOT_REACHED',
  });
  const result = validate(instance);
  assert.equal(result.ok, false);
  assert.match(result.errors[0].note, /cle hors schema/);
});

/* ------------------------------------------------------------------ *
 * Identite de fait
 * ------------------------------------------------------------------ */

test('les sources de definition sont exactement RETURN_CONTRACT, SOURCE, EXECUTOR', () => {
  assert.deepEqual(FACT_SOURCES, ['RETURN_CONTRACT', 'SOURCE', 'EXECUTOR']);
});

test('un fait inattendu porte par l executant est admis', () => {
  const instance = contractBacked();
  instance.reported_entries.push({
    kind: 'REPORTED_VALUE',
    fact: { defined_by: 'EXECUTOR', id: 'post_push.verification' },
    value: { type: 'SYMBOL', value: 'PASS' },
  });
  const result = validate(instance);
  assert.equal(result.ok, true, firstError(result));
});

test('une identite definie par le protocole source est admise', () => {
  const instance = base();
  instance.reported_entries[0].fact = { defined_by: 'SOURCE', id: 'protocol.fact.1' };
  assert.equal(validate(instance).ok, true);
});

test('une phrase de prose ne peut pas tenir lieu d identite de fait', () => {
  for (const id of ['le push n a pas ete tente', 'commit realized = NO', '', ' ']) {
    const instance = base();
    instance.reported_entries[0].fact = { defined_by: 'EXECUTOR', id };
    const result = validate(instance);
    assert.equal(result.ok, false, 'identite acceptee a tort : ' + JSON.stringify(id));
  }
});

test('une identite de fait reduite a une chaine nue est refusee', () => {
  const instance = base();
  instance.reported_entries[0].fact = 'worktree.state';
  assert.equal(validate(instance).ok, false);
});

test('une source de definition hors vocabulaire est refusee', () => {
  for (const defined_by of ['HUMAN', 'ORCHESTRATOR', 'PROSE', undefined, 42]) {
    const instance = base();
    instance.reported_entries[0].fact = { defined_by, id: 'x.y' };
    assert.equal(validate(instance).ok, false, 'source acceptee a tort : ' + String(defined_by));
  }
});

test('une identite definie par un contrat exige une autorite de contrat a la racine', () => {
  const instance = base();
  instance.reported_entries[0].fact = { defined_by: 'RETURN_CONTRACT', id: 'rf-x' };
  const result = validate(instance);
  assert.equal(result.ok, false);
  assert.match(result.errors[0].note, /contrat de retour absent/);
});

test('une identite de fait dupliquee dans une instance est refusee', () => {
  const instance = contractBacked();
  instance.reported_entries.push(structuredClone(instance.reported_entries[0]));
  const result = validate(instance);
  assert.equal(result.ok, false);
  assert.match(result.errors[0].note, /identite de fait dupliquee/);
});

/* ------------------------------------------------------------------ *
 * Portee des identifiants portes par l'executant
 * ------------------------------------------------------------------ */

test('un identifiant porte par l executant n implique aucune equivalence entre executions', () => {
  const first = base();
  const second = base();
  second.execution.id = 'unit-minimal-autre-execution';
  const keyFirst = factKey(first, first.reported_entries[0]);
  const keySecond = factKey(second, second.reported_entries[0]);
  assert.equal(first.reported_entries[0].fact.id, second.reported_entries[0].fact.id);
  assert.notEqual(keyFirst, keySecond);
  assert.match(keyFirst, /^EXECUTOR\/unit-minimal\//);
});

test('un meme identifiant porte par deux executants differents reste distinct', () => {
  const first = base();
  const second = base();
  second.reported_by.executor = 'AGENT_CCR_LAB_98';
  assert.notEqual(factKey(first, first.reported_entries[0]), factKey(second, second.reported_entries[0]));
});

test('une identite definie par le meme contrat est bien la meme entre instances', () => {
  const first = contractBacked();
  const second = contractBacked();
  second.execution.id = 'unit-contract-autre-execution';
  second.reported_by.executor = 'AGENT_CCR_LAB_98';
  assert.equal(factKey(first, first.reported_entries[0]), factKey(second, second.reported_entries[0]));
});

/* ------------------------------------------------------------------ *
 * Relation a une exigence prospective
 * ------------------------------------------------------------------ */

test('une relation d exigence redondante avec l identite de contrat est refusee', () => {
  const instance = contractBacked();
  instance.reported_entries[0].requirement = 'rf-push-status';
  const result = validate(instance);
  assert.equal(result.ok, false);
  assert.match(result.errors[0].note, /redondant/);
});

test('un fait porte par l executant ne peut repondre a une exigence prospective', () => {
  const instance = contractBacked();
  instance.reported_entries.push({
    kind: 'REPORTED_VALUE',
    fact: { defined_by: 'EXECUTOR', id: 'post_push.verification' },
    value: { type: 'SYMBOL', value: 'PASS' },
    requirement: 'rf-outcome',
  });
  const result = validate(instance);
  assert.equal(result.ok, false);
  assert.match(result.errors[0].note, /aucune exigence prospective/);
});

test('une identite de protocole peut porter une relation d exigence', () => {
  const instance = contractBacked();
  instance.reported_entries.push({
    kind: 'REPORTED_VALUE',
    fact: { defined_by: 'SOURCE', id: 'protocol.outcome' },
    value: { type: 'SYMBOL', value: 'PASS' },
    requirement: 'rf-outcome',
  });
  const result = validate(instance);
  assert.equal(result.ok, true, firstError(result));
});

/* ------------------------------------------------------------------ *
 * References d'autorite et de preuve
 * ------------------------------------------------------------------ */

test('un localisateur n est pas une identite immuable', () => {
  const instance = base();
  delete instance.representation.authority.identity;
  const result = validate(instance);
  assert.equal(result.ok, false);
  assert.match(result.errors[0].note, /membre requis absent/);
});

test('une identite d autorite absente est refusee pour les trois references', () => {
  const paths = [
    (i) => delete i.representation.authority.identity,
    (i) => delete i.source.authority.identity,
    (i) => delete i.return_contract.authority.identity,
  ];
  for (const [index, strip] of paths.entries()) {
    const instance = contractBacked();
    strip(instance);
    assert.equal(validate(instance).ok, false, 'reference ' + index + ' acceptee sans identite');
  }
});

test('une identite d autorite mal formee est refusee', () => {
  for (const value of ['zzz', '1676b3de', '1676B3DE4546B40A801D0A400B4C47DDD9B82062', 123]) {
    const instance = base();
    instance.representation.authority.identity = { kind: 'GIT_BLOB', value };
    assert.equal(validate(instance).ok, false, 'identite acceptee a tort : ' + String(value));
  }
});

test('un genre de localisateur ou d identite hors vocabulaire est refuse', () => {
  const bad = base();
  bad.source.authority.locator = { kind: 'HTTP_URL', value: 'https://example.invalid' };
  assert.equal(validate(bad).ok, false);
  const other = base();
  other.source.authority.identity = { kind: 'SHA256', value: 'a'.repeat(40) };
  assert.equal(validate(other).ok, false);
});

test('une reference de preuve optionnelle est admise, avec ou sans identite', () => {
  const withIdentity = base();
  withIdentity.reported_entries[0].evidence = {
    locator: { kind: 'REPO_PATH', value: 'tooling/program-state/RESULT-001.md' },
    identity: { kind: 'GIT_BLOB', value: 'bc8da25c7611e0e12df7b04b733428dc8a898e63' },
  };
  assert.equal(validate(withIdentity).ok, true, firstError(validate(withIdentity)));
  const withoutIdentity = base();
  withoutIdentity.reported_entries[0].evidence = { locator: { kind: 'REMOTE_REF', value: 'origin/main' } };
  assert.equal(validate(withoutIdentity).ok, true);
});

test('une reference de preuve n importe aucune semantique de preuve existante', () => {
  for (const key of ['policy', 'supports', 'kind', 'method', 'recompute', 'outcome']) {
    const instance = base();
    instance.reported_entries[0].evidence = {
      locator: { kind: 'REPO_PATH', value: 'README.md' },
      [key]: 'VERIFIABLE',
    };
    assert.equal(validate(instance).ok, false, 'cle de preuve acceptee a tort : ' + key);
  }
});

/* ------------------------------------------------------------------ *
 * Racine, executant, ecriture unique
 * ------------------------------------------------------------------ */

test('les membres racine requis sont exiges', () => {
  for (const key of ['representation', 'execution', 'source', 'reported_by', 'reported_entries']) {
    const instance = base();
    delete instance[key];
    assert.equal(validate(instance).ok, false, 'racine acceptee sans ' + key);
  }
});

test('une liste d entrees vide est refusee', () => {
  const instance = base();
  instance.reported_entries = [];
  assert.equal(validate(instance).ok, false);
});

test('aucun resultat terminal obligatoire n existe a la racine', () => {
  const instance = base();
  assert.equal(instance.terminal_outcome, undefined);
  assert.equal(validate(instance).ok, true);
  instance.terminal_outcome = 'PASS';
  assert.equal(validate(instance).ok, false);
});

test('un genre de source hors vocabulaire est refuse', () => {
  const instance = base();
  instance.source.kind = 'WORKFLOW';
  assert.equal(validate(instance).ok, false);
});

test('une identite d executant hors forme est refusee', () => {
  for (const executor of ['agent ccr lab 17', 'Agent_17', '', 17]) {
    const instance = base();
    instance.reported_by.executor = executor;
    assert.equal(validate(instance).ok, false, 'executant accepte a tort : ' + String(executor));
  }
});

test('une instance chargee est gelee en profondeur', () => {
  const instance = parse(JSON.stringify(base()));
  assert.throws(() => {
    instance.execution.id = 'mute';
  }, TypeError);
  assert.throws(() => {
    instance.reported_entries.push({});
  }, TypeError);
  assert.throws(() => {
    instance.reported_entries[0].value.value = 'mute';
  }, TypeError);
});

test('aucune API de mutation n est exposee', async () => {
  const core = await import('../result-instance.mjs');
  const validator = await import('../validate.mjs');
  const forbidden = /^(update|set|write|save|patch|merge|create|build|freeze|render|delete|remove)/;
  for (const name of [...Object.keys(core), ...Object.keys(validator)]) {
    assert.equal(forbidden.test(name), false, 'export de mutation : ' + name);
  }
});

test('un JSON illisible ou non objet est refuse au chargement', () => {
  assert.throws(() => parse('{'), /JSON illisible/);
  assert.throws(() => parse('[]'), /objet JSON/);
  assert.throws(() => parse('null'), /objet JSON/);
});

/* ------------------------------------------------------------------ *
 * Couche 2 : relation de contrat mecaniquement exprimable
 * ------------------------------------------------------------------ */

function missionObject(number) {
  return JSON.parse(
    readFileSync(join(REPO, 'tooling', 'mission-object', 'dogfood', number, 'mission.json'), 'utf8'),
  );
}

test('une exigence inconnue du contrat est refusee', () => {
  const instance = contractBacked();
  instance.reported_entries[0].fact.id = 'rf-inexistant';
  const result = validateAgainstContract(instance, missionObject('003'));
  assert.equal(result.ok, false);
  assert.match(result.errors[0].note, /exigence inconnue du contrat/);
});

test('une non-production visant une exigence inconnue est refusee', () => {
  const instance = contractBacked();
  instance.reported_entries.push({ kind: 'STRUCTURAL_NON_PRODUCTION', requirement: 'rf-inexistant' });
  const result = validateAgainstContract(instance, missionObject('003'));
  assert.equal(result.ok, false);
});

test('le domaine clos est verifie la ou le contrat l expose', () => {
  const instance = contractBacked();
  instance.reported_entries[0].value = { type: 'SYMBOL', value: 'PROBABLEMENT' };
  const result = validateAgainstContract(instance, missionObject('003'));
  assert.equal(result.ok, false);
  assert.match(result.errors[0].note, /hors du domaine clos/);
});

test('une valeur licite du domaine passe, meme lorsque la qualification l a jugee fausse', () => {
  const instance = contractBacked();
  instance.return_contract.authority.identity.value = '4d1c6027d717bfc7b189a2889fb6b22b42b3d568';
  instance.source.authority.identity.value = '4d1c6027d717bfc7b189a2889fb6b22b42b3d568';
  instance.reported_entries[0] = {
    kind: 'REPORTED_VALUE',
    fact: { defined_by: 'RETURN_CONTRACT', id: 'rf-push-realized' },
    value: { type: 'SYMBOL', value: 'NO' },
  };
  const result = validateAgainstContract(instance, missionObject('002'));
  assert.equal(result.ok, true, firstError(result));
});

test('aucune completude de contrat n est affirmee', () => {
  const instance = contractBacked();
  const contract = missionObject('003');
  const result = validateAgainstContract(instance, contract);
  assert.equal(result.ok, true, firstError(result));
  assert.equal(result.checked, 1);
  assert.ok(contract.return_contract.length > result.checked);
});

test('un domaine non expose par le contrat n est pas verifie', () => {
  const instance = contractBacked();
  instance.reported_entries[0] = {
    kind: 'REPORTED_VALUE',
    fact: { defined_by: 'RETURN_CONTRACT', id: 'rf-commit-identifier' },
    value: { type: 'SYMBOL', value: 'NIMPORTE_QUOI' },
  };
  const result = validateAgainstContract(instance, missionObject('003'));
  assert.equal(result.ok, true, firstError(result));
  assert.equal(result.uncheckedDomains, 1);
});

test('une instance sans autorite de contrat ne peut etre confrontee a un contrat', () => {
  const result = validateAgainstContract(base(), missionObject('003'));
  assert.equal(result.ok, false);
});

/* ------------------------------------------------------------------ *
 * Representabilite historique A / B / C / D
 * ------------------------------------------------------------------ *
 *
 * Ces cas sont des artefacts de qualification derives du corpus. Ils ne sont
 * PAS des instances de resultat historiques, et rien ici n'affirme que leurs
 * octets ont ete retournes par un executant.
 */

const CASES = ['a', 'b', 'c', 'd'];

function representabilityCase(name) {
  return load(join(REPO, MANIFEST.cases[name].case_path));
}

test('les quatre cas de representabilite sont structurellement valides', () => {
  for (const name of CASES) {
    const result = validate(representabilityCase(name));
    assert.equal(result.ok, true, name + ' : ' + firstError(result));
  }
});

test('cas A : contrat, execution bloquee, resultat terminal rapporte, non-production', () => {
  const instance = representabilityCase('a');
  const result = validateAgainstContract(instance, missionObject('001'));
  assert.equal(result.ok, true, firstError(result));
  const byId = new Map(
    instance.reported_entries
      .filter((entry) => entry.kind === 'REPORTED_VALUE')
      .map((entry) => [entry.fact.id, entry]),
  );
  assert.equal(byId.get('rf-outcome').value.value, 'BLOCKED');
  assert.equal(byId.get('gates.failed').value.value, '0');
  assert.equal(byId.get('gates.failed').fact.defined_by, 'EXECUTOR');
  assert.equal(byId.get('push.attempted').fact.defined_by, 'EXECUTOR');
  assert.equal(byId.get('rf-modified-paths').value.type, 'SET');
  const absent = instance.reported_entries.filter((entry) => entry.kind === 'STRUCTURAL_NON_PRODUCTION');
  assert.deepEqual(absent.map((entry) => entry.requirement), ['rf-commit']);
});

test('cas B : rapporte n est pas vrai, et les negatifs restent distincts', () => {
  const instance = representabilityCase('b');
  const result = validateAgainstContract(instance, missionObject('002'));
  assert.equal(result.ok, true, firstError(result));
  const byId = new Map(instance.reported_entries.map((entry) => [entry.fact.id, entry.value]));
  assert.equal(byId.get('rf-push-realized').value, 'NO');
  assert.equal(byId.get('rf-commit-identifier').value, 'NOT_REALIZED');
  assert.equal(byId.get('rf-remote-main-head').value, 'NOT_MEASURED');
  assert.equal(byId.get('rf-blocker-reason').value, 'PERMISSION_DENIED');
  assert.equal(byId.get('rf-commit-realized').value, 'NO');
  assert.equal(instance.reported_entries.some((entry) => entry.kind === 'STRUCTURAL_NON_PRODUCTION'), false);
  assert.equal(byId.get('rf-deviations').type, 'SET');
  assert.equal(byId.get('rf-deviations').members.length, 3);
});

test('cas C : realisation reussie adossee au contrat et faits post-push', () => {
  const instance = representabilityCase('c');
  const result = validateAgainstContract(instance, missionObject('003'));
  assert.equal(result.ok, true, firstError(result));
  const byId = new Map(instance.reported_entries.map((entry) => [entry.fact.id, entry]));
  assert.equal(byId.get('rf-commit-realized').value.value, 'YES');
  assert.equal(byId.get('rf-push-status').value.value, 'REALIZED');
  assert.equal(byId.get('rf-outcome').value.value, 'PASS');
  assert.equal(
    byId.get('rf-commit-identifier').value.value,
    byId.get('rf-remote-main-head').value.value,
  );
  assert.equal(byId.get('rf-remote-main-head').evidence.locator.kind, 'REMOTE_REF');
  assert.equal(byId.get('post_push.verification').fact.defined_by, 'EXECUTOR');
});

test('cas D : adosse a un protocole, sans contrat, identifiants synthetiques seulement', () => {
  const instance = representabilityCase('d');
  assert.equal(instance.source.kind, 'PROTOCOL');
  assert.equal(instance.return_contract, undefined);
  assert.equal(instance.source.authority.locator.value, '09-TOOLING-EXPERIMENT-001-PROGRAM-STATE.md');
  for (const entry of instance.reported_entries) {
    assert.equal(entry.kind, 'REPORTED_VALUE');
    assert.equal(entry.fact.defined_by, 'EXECUTOR', 'identite SOURCE fabriquee : ' + entry.fact.id);
    assert.equal(entry.requirement, undefined);
  }
  const ids = instance.reported_entries.map((entry) => entry.fact.id);
  for (const evaluative of ['next_action.recovered_correctly', 'manual_factual_corrections', 'criterion.6']) {
    assert.equal(ids.includes(evaluative), false, 'fait de qualification present : ' + evaluative);
  }
});

test('aucun cas ne se presente comme une instance de resultat historique', () => {
  for (const name of CASES) {
    assert.equal(representabilityCase(name).execution.id, 'representability-' + name);
  }
});

/* ------------------------------------------------------------------ *
 * Manifeste de provenance
 * ------------------------------------------------------------------ */

test('le manifeste se declare metadonnee de qualification uniquement', () => {
  assert.match(MANIFEST.purpose, /Metadonnee de qualification uniquement/);
  assert.match(MANIFEST.declarations.execution_semantics, /^NON/);
  assert.match(MANIFEST.declarations.historical_raw_return_evidence, /^NON/);
  assert.match(MANIFEST.declarations.proof_of_historical_bytes, /^NON/);
  assert.match(MANIFEST.declarations.transcript_use, /^AUCUN/);
  assert.match(MANIFEST.declarations.replay, /^AUCUN/);
  assert.match(MANIFEST.declarations.synthetic_qualification_identifiers, /SYNTHETIQUES DE QUALIFICATION/);
  assert.match(MANIFEST.declarations.case_d_limit, /aucune identite SOURCE/);
});

test('le manifeste couvre exactement chaque element de chaque cas', () => {
  for (const name of CASES) {
    const instance = representabilityCase(name);
    const declared = new Set(Object.keys(MANIFEST.cases[name].elements));
    const present = instance.reported_entries.map((entry) =>
      entry.kind === 'REPORTED_VALUE'
        ? entry.fact.defined_by + ':' + entry.fact.id
        : 'NON_PRODUCTION:' + entry.requirement,
    );
    assert.equal(new Set(present).size, present.length, name + ' : cle dupliquee');
    for (const key of present) assert.ok(declared.has(key), name + ' : element non trace ' + key);
    for (const key of declared) assert.ok(present.includes(key), name + ' : trace orpheline ' + key);
  }
});

test('chaque element trace nomme une autorite durable committee', () => {
  const known = new Set(Object.keys(MANIFEST.authorities));
  for (const name of CASES) {
    for (const [key, grounding] of Object.entries(MANIFEST.cases[name].elements)) {
      assert.ok(known.has(grounding.authority), name + ' / ' + key + ' : autorite inconnue');
      assert.ok(grounding.section.length > 0, name + ' / ' + key + ' : section absente');
      assert.ok(grounding.durable_statement.length > 0, name + ' / ' + key + ' : enonce absent');
    }
  }
});

test('les autorites citees par le manifeste existent reellement dans le depot', () => {
  for (const [path, blob] of Object.entries(MANIFEST.authorities)) {
    assert.match(blob, /^[0-9a-f]{40}$/, path);
    assert.ok(readFileSync(join(REPO, path), 'utf8').length > 0, path);
  }
});

test('une reference d autorite est native au depot, une reference de preuve non', () => {
  const authorityElsewhere = base();
  authorityElsewhere.source.authority.locator = { kind: 'REMOTE_REF', value: 'origin/main' };
  const refused = validate(authorityElsewhere);
  assert.equal(refused.ok, false);
  assert.match(refused.errors[0].note, /genre hors vocabulaire/);

  const evidenceElsewhere = base();
  evidenceElsewhere.reported_entries[0].evidence = { locator: { kind: 'REMOTE_REF', value: 'origin/main' } };
  assert.equal(validate(evidenceElsewhere).ok, true);
});
