/**
 * TOOLING-EXPERIMENT-003 — validateur de Result Instance v0.
 *
 * Il applique les autorites gelees 23 et 24, et rien d'autre.
 *
 * Deux regles gouvernent tout ce fichier :
 *
 *   1. Il valide la STRUCTURE et les TYPES de ce qui a ete rapporte.
 *   2. Il ne valide JAMAIS la verite de ce qui a ete rapporte.
 *
 * L'appartenance a un domaine clos n'est pas la justesse semantique :
 * DF002-01 reste le contre-exemple, ou une valeur parfaitement licite du
 * domaine etait semantiquement fausse.
 *
 * Aucune dependance externe. Aucun acces Git. Aucun reseau.
 */

import {
  ENTRY_KINDS,
  EXECUTOR_ID,
  FACT_ID,
  FACT_KEYS,
  FACT_SOURCES,
  GIT_BLOB,
  IDENTITY_KEYS,
  IDENTITY_KINDS,
  LOCATOR_KEYS,
  LOCATOR_KINDS,
  NON_PRODUCTION_KEYS,
  NON_PRODUCTION_REQUIRED,
  REFERENCE_KEYS,
  REPORTED_VALUE_KEYS,
  REPORTED_VALUE_REQUIRED,
  ROOT_KEYS,
  ROOT_REQUIRED,
  SET_MEMBER_TYPES,
  SOURCE_KINDS,
  VALUE_TYPES,
  contractRequirements,
  entries,
  factKey,
} from './result-instance.mjs';

class Report {
  constructor() {
    this.errors = [];
  }

  fail(path, note) {
    this.errors.push({ path, note });
    return false;
  }

  get ok() {
    return this.errors.length === 0;
  }
}

/**
 * Une reference d'AUTORITE est native au depot : autorite 24 section 9 gele
 * le localisateur comme chemin relatif au depot. Une reference de PREUVE, elle,
 * peut designer ce que l'executant a effectivement mesure.
 */
const AUTHORITY_LOCATORS = ['REPO_PATH'];

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Surface de cles close : ce qui n'est pas au schema est refuse. */
function keys(report, path, value, allowed, required) {
  if (!isObject(value)) return report.fail(path, 'objet attendu');
  let ok = true;
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) ok = report.fail(path + '.' + key, 'cle hors schema');
  }
  for (const key of required) {
    if (value[key] === undefined) ok = report.fail(path + '.' + key, 'membre requis absent');
  }
  return ok;
}

function symbolToken(report, path, value, pattern) {
  if (typeof value !== 'string') return report.fail(path, 'chaine attendue');
  if (!pattern.test(value)) return report.fail(path, 'jeton hors forme : ' + value);
  return true;
}

/**
 * Reference d'autorite : un LOCALISATEUR n'est pas une IDENTITE IMMUABLE.
 * Autorite 24 section 9.
 */
function reference(report, path, value, identityRequired, allowedLocators) {
  if (!keys(report, path, value, REFERENCE_KEYS, identityRequired ? REFERENCE_KEYS : ['locator'])) {
    return false;
  }
  let ok = true;
  if (keys(report, path + '.locator', value.locator, LOCATOR_KEYS, LOCATOR_KEYS)) {
    if (!allowedLocators.includes(value.locator.kind)) {
      ok = report.fail(path + '.locator.kind', 'genre hors vocabulaire : ' + String(value.locator.kind));
    }
    if (typeof value.locator.value !== 'string' || value.locator.value === '') {
      ok = report.fail(path + '.locator.value', 'chaine non vide attendue');
    }
  } else {
    ok = false;
  }
  if (value.identity !== undefined) {
    if (keys(report, path + '.identity', value.identity, IDENTITY_KEYS, IDENTITY_KEYS)) {
      if (!IDENTITY_KINDS.includes(value.identity.kind)) {
        ok = report.fail(path + '.identity.kind', 'genre hors vocabulaire : ' + String(value.identity.kind));
      } else if (!GIT_BLOB.test(String(value.identity.value))) {
        ok = report.fail(path + '.identity.value', 'identite de blob Git attendue');
      }
    } else {
      ok = false;
    }
  }
  return ok;
}

/** Valeur typee. SCALAR et SYMBOL portent `value` ; SET porte `members`. */
function typedValue(report, path, value, allowSet) {
  if (!isObject(value)) return report.fail(path, 'valeur typee attendue');
  if (!VALUE_TYPES.includes(value.type)) {
    return report.fail(path + '.type', 'type hors vocabulaire : ' + String(value.type));
  }
  if (value.type === 'SET') {
    if (!allowSet) return report.fail(path + '.type', 'SET imbrique non admis en v0');
    if (!keys(report, path, value, ['type', 'members'], ['type', 'members'])) return false;
    if (!Array.isArray(value.members)) return report.fail(path + '.members', 'liste attendue');
    let ok = true;
    for (const [index, member] of value.members.entries()) {
      const at = path + '.members[' + index + ']';
      if (isObject(member) && !SET_MEMBER_TYPES.includes(member.type)) {
        ok = report.fail(at + '.type', 'membre de SET hors vocabulaire : ' + String(member.type));
        continue;
      }
      if (!typedValue(report, at, member, false)) ok = false;
    }
    return ok;
  }
  if (!keys(report, path, value, ['type', 'value'], ['type', 'value'])) return false;
  if (typeof value.value !== 'string' || value.value === '') {
    return report.fail(path + '.value', 'chaine non vide attendue');
  }
  return true;
}

/**
 * Identite de fait. Une phrase de prose ne peut pas tenir lieu de semantique :
 * un identifiant ne porte aucun espace. Autorite 24 section 6.
 */
function fact(report, path, value) {
  if (!keys(report, path, value, FACT_KEYS, FACT_KEYS)) return false;
  let ok = true;
  if (!FACT_SOURCES.includes(value.defined_by)) {
    ok = report.fail(path + '.defined_by', 'source hors vocabulaire : ' + String(value.defined_by));
  }
  if (!symbolToken(report, path + '.id', value.id, FACT_ID)) ok = false;
  return ok;
}

function reportedValueEntry(report, path, value, instance) {
  if (!keys(report, path, value, REPORTED_VALUE_KEYS, REPORTED_VALUE_REQUIRED)) return false;
  let ok = fact(report, path + '.fact', value.fact);
  if (!typedValue(report, path + '.value', value.value, true)) ok = false;

  const definedBy = value.fact && value.fact.defined_by;
  if (definedBy === 'RETURN_CONTRACT' && !instance.return_contract) {
    ok = report.fail(
      path + '.fact.defined_by',
      'identite definie par un contrat de retour absent de la racine',
    );
  }
  if (value.requirement !== undefined) {
    if (!symbolToken(report, path + '.requirement', value.requirement, FACT_ID)) ok = false;
    if (definedBy === 'RETURN_CONTRACT') {
      ok = report.fail(path + '.requirement', 'redondant : l identite de fait EST l exigence');
    }
    if (definedBy === 'EXECUTOR') {
      ok = report.fail(
        path + '.requirement',
        'un fait porte par l executant ne repond a aucune exigence prospective',
      );
    }
    if (!instance.return_contract) {
      ok = report.fail(path + '.requirement', 'aucun contrat de retour prospectif a la racine');
    }
  }
  if (value.evidence !== undefined && !reference(report, path + '.evidence', value.evidence, false, LOCATOR_KINDS)) {
    ok = false;
  }
  return ok;
}

function nonProductionEntry(report, path, value, instance) {
  if (!keys(report, path, value, NON_PRODUCTION_KEYS, NON_PRODUCTION_REQUIRED)) return false;
  let ok = symbolToken(report, path + '.requirement', value.requirement, FACT_ID);
  if (!instance.return_contract) {
    ok = report.fail(
      path + '.requirement',
      'non-production structurelle sans contrat de retour prospectif',
    );
  }
  return ok;
}

/* ------------------------------------------------------------------ *
 * Couche 1 : structure et types
 * ------------------------------------------------------------------ */

export function validate(instance) {
  const report = new Report();
  if (!keys(report, 'result_instance', instance, ROOT_KEYS, ROOT_REQUIRED)) {
    return { ok: report.ok, errors: report.errors };
  }

  if (keys(report, 'representation', instance.representation, ['authority'], ['authority'])) {
    reference(report, 'representation.authority', instance.representation.authority, true, AUTHORITY_LOCATORS);
  }

  if (keys(report, 'execution', instance.execution, ['id'], ['id'])) {
    symbolToken(report, 'execution.id', instance.execution.id, FACT_ID);
  }

  if (keys(report, 'source', instance.source, ['kind', 'authority'], ['kind', 'authority'])) {
    if (!SOURCE_KINDS.includes(instance.source.kind)) {
      report.fail('source.kind', 'genre hors vocabulaire : ' + String(instance.source.kind));
    }
    reference(report, 'source.authority', instance.source.authority, true, AUTHORITY_LOCATORS);
  }

  if (keys(report, 'reported_by', instance.reported_by, ['executor'], ['executor'])) {
    symbolToken(report, 'reported_by.executor', instance.reported_by.executor, EXECUTOR_ID);
  }

  if (instance.return_contract !== undefined) {
    if (keys(report, 'return_contract', instance.return_contract, ['authority'], ['authority'])) {
      reference(report, 'return_contract.authority', instance.return_contract.authority, true, AUTHORITY_LOCATORS);
    }
  }

  const list = instance.reported_entries;
  if (!Array.isArray(list) || list.length === 0) {
    report.fail('reported_entries', 'liste non vide attendue');
    return { ok: report.ok, errors: report.errors };
  }

  const seenFacts = new Set();
  const produced = new Set();
  const notProduced = new Set();

  for (const [index, value] of list.entries()) {
    const path = 'reported_entries[' + index + ']';
    if (!isObject(value)) {
      report.fail(path, 'objet attendu');
      continue;
    }
    if (!ENTRY_KINDS.includes(value.kind)) {
      report.fail(path + '.kind', 'classe hors vocabulaire : ' + String(value.kind));
      continue;
    }
    if (value.kind === 'REPORTED_VALUE') {
      if (!reportedValueEntry(report, path, value, instance)) continue;
      const key = factKey(instance, value);
      if (key === undefined) {
        report.fail(path + '.fact', 'portee d identite indeterminable');
        continue;
      }
      if (seenFacts.has(key)) report.fail(path + '.fact', 'identite de fait dupliquee');
      seenFacts.add(key);
      if (value.fact.defined_by === 'RETURN_CONTRACT') produced.add(value.fact.id);
      if (value.requirement !== undefined) produced.add(value.requirement);
    } else {
      if (!nonProductionEntry(report, path, value, instance)) continue;
      if (notProduced.has(value.requirement)) {
        report.fail(path + '.requirement', 'non-production structurelle dupliquee');
      }
      notProduced.add(value.requirement);
    }
  }

  for (const requirement of notProduced) {
    if (produced.has(requirement)) {
      report.fail(
        'reported_entries',
        'exigence a la fois produite et declaree non produite : ' + requirement,
      );
    }
  }

  return { ok: report.ok, errors: report.errors };
}

/* ------------------------------------------------------------------ *
 * Couche 2 : relation de retour prospective, mecaniquement exprimable
 * ------------------------------------------------------------------ *
 *
 * On ne verifie QUE ce que le contrat expose mecaniquement.
 *
 * Aucune completude n'est affirmee : l'applicabilite d'une exigence au
 * chemin d'execution atteint n'est pas exprimee par le contrat, et elle n'est
 * donc ni devinee, ni exigee, ni reprochee. Autorite 24 section 14.
 */

export function validateAgainstContract(instance, missionObject) {
  const report = new Report();
  const requirements = contractRequirements(missionObject);
  if (requirements.size === 0) {
    report.fail('mission_object.return_contract', 'aucune exigence de retour exposee');
    return { ok: report.ok, errors: report.errors, checked: 0, uncheckedDomains: 0 };
  }
  if (!instance.return_contract) {
    report.fail('return_contract', 'instance sans autorite de contrat de retour');
    return { ok: report.ok, errors: report.errors, checked: 0, uncheckedDomains: 0 };
  }

  let checked = 0;
  let uncheckedDomains = 0;

  for (const [index, value] of entries(instance).entries()) {
    const path = 'reported_entries[' + index + ']';
    if (!isObject(value)) continue;

    if (value.kind === 'STRUCTURAL_NON_PRODUCTION') {
      if (!requirements.has(value.requirement)) {
        report.fail(path + '.requirement', 'exigence inconnue du contrat : ' + String(value.requirement));
      } else {
        checked += 1;
      }
      continue;
    }
    if (value.kind !== 'REPORTED_VALUE' || !isObject(value.fact)) continue;

    let requirementId;
    if (value.fact.defined_by === 'RETURN_CONTRACT') requirementId = value.fact.id;
    else if (value.requirement !== undefined) requirementId = value.requirement;

    if (requirementId === undefined) continue;

    const requirement = requirements.get(requirementId);
    if (requirement === undefined) {
      report.fail(path, 'exigence inconnue du contrat : ' + requirementId);
      continue;
    }
    checked += 1;

    if (requirement.allowed === undefined) {
      uncheckedDomains += 1;
      continue;
    }
    if (isObject(value.value) && value.value.type === 'SYMBOL') {
      if (!requirement.allowed.has(value.value.value)) {
        report.fail(
          path + '.value.value',
          'hors du domaine clos de ' + requirementId + ' : ' + String(value.value.value),
        );
      }
    } else {
      uncheckedDomains += 1;
    }
  }

  return { ok: report.ok, errors: report.errors, checked, uncheckedDomains };
}

/* ------------------------------------------------------------------ *
 * CLI
 * ------------------------------------------------------------------ */

const USAGE =
  'usage :\n' +
  '  validate.mjs <instance.json> [<mission-object.json>]\n' +
  '\n' +
  'Le second argument est optionnel. Il n active que les controles de\n' +
  'relation de contrat mecaniquement exprimables. Aucune justesse semantique\n' +
  'n est verifiee, et aucune completude de contrat n est affirmee.\n';

function print(prefix, result) {
  let text = '';
  for (const error of result.errors) text += prefix + '  ' + error.path + '  ' + error.note + '\n';
  return text;
}

export async function main(argv) {
  const [instancePath, missionPath, ...rest] = argv;
  if (!instancePath || rest.length > 0) {
    process.stderr.write(USAGE);
    return 2;
  }

  const { load } = await import('./result-instance.mjs');
  const { readFileSync } = await import('node:fs');

  let instance;
  try {
    instance = load(instancePath);
  } catch (error) {
    process.stderr.write('MALFORMED  ' + error.message + '\n');
    return 2;
  }

  const structural = validate(instance);
  process.stdout.write(
    'STRUCTURE  ' + (structural.ok ? 'PASS' : 'FAIL') + '\n' + print('STRUCTURE', structural),
  );
  if (!structural.ok) return 1;

  if (missionPath === undefined) {
    process.stdout.write('CONTRAT  NON FOURNI\n');
    return 0;
  }

  let missionObject;
  try {
    missionObject = JSON.parse(readFileSync(missionPath, 'utf8'));
  } catch (error) {
    process.stderr.write('MALFORMED  ' + error.message + '\n');
    return 2;
  }

  const contract = validateAgainstContract(instance, missionObject);
  process.stdout.write(
    'CONTRAT  ' +
      (contract.ok ? 'PASS' : 'FAIL') +
      '  relations verifiees ' +
      contract.checked +
      '  domaines non exposes ' +
      contract.uncheckedDomains +
      '\n' +
      print('CONTRAT', contract),
  );
  process.stdout.write('COMPLETUDE DU CONTRAT  NON AFFIRMEE\n');
  return contract.ok ? 0 : 1;
}

if (process.argv[1] && process.argv[1].endsWith('validate.mjs')) {
  process.exitCode = await main(process.argv.slice(2));
}
