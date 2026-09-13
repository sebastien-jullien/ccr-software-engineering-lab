/**
 * TOOLING-EXPERIMENT-003 — Result Instance v0.
 *
 * Conforme aux autorités gelées
 * `23-TOOLING-EXPERIMENT-003-RESULT-INSTANCE-V0.md` et
 * `24-TOOLING-EXPERIMENT-003-RESULT-INSTANCE-V0-IMPLEMENTATION-DESIGN.md`,
 * et à elles seules.
 *
 * Une instance de résultat consigne CE QU'UN EXÉCUTANT A RAPPORTÉ. Elle
 * n'établit aucune vérité, ne qualifie rien, ne promeut aucune observation,
 * ne décide d'aucune conséquence. Rapporté n'est pas vrai.
 *
 * Ce module charge une instance et expose les vocabulaires clos ainsi que les
 * accesseurs dont la validation a besoin. Il n'écrit rien, ne mute rien,
 * n'invoque ni Git, ni réseau, ni horloge, ni modèle de langage.
 *
 * Une instance chargée est gelée en profondeur : il n'existe aucune API de
 * modification, et la structure rendue refuse l'écriture.
 *
 * Aucune dépendance externe.
 */

import { readFileSync } from 'node:fs';

export class ResultInstanceError extends Error {}

/* ------------------------------------------------------------------ *
 * Vocabulaires clos — autorité 24
 * ------------------------------------------------------------------ */

export const ROOT_KEYS = [
  'representation',
  'execution',
  'source',
  'reported_by',
  'return_contract',
  'reported_entries',
];

export const ROOT_REQUIRED = [
  'representation',
  'execution',
  'source',
  'reported_by',
  'reported_entries',
];

export const ENTRY_KINDS = ['REPORTED_VALUE', 'STRUCTURAL_NON_PRODUCTION'];

export const REPORTED_VALUE_KEYS = ['kind', 'fact', 'value', 'requirement', 'evidence'];
export const REPORTED_VALUE_REQUIRED = ['kind', 'fact', 'value'];

export const NON_PRODUCTION_KEYS = ['kind', 'requirement'];
export const NON_PRODUCTION_REQUIRED = ['kind', 'requirement'];

export const FACT_KEYS = ['defined_by', 'id'];
export const FACT_SOURCES = ['RETURN_CONTRACT', 'SOURCE', 'EXECUTOR'];

export const VALUE_TYPES = ['SCALAR', 'SYMBOL', 'SET'];
export const SET_MEMBER_TYPES = ['SCALAR', 'SYMBOL'];

export const SOURCE_KINDS = ['MISSION', 'PROTOCOL'];

export const REFERENCE_KEYS = ['locator', 'identity'];
export const LOCATOR_KEYS = ['kind', 'value'];
export const IDENTITY_KEYS = ['kind', 'value'];
export const LOCATOR_KINDS = ['REPO_PATH', 'REMOTE_REF'];
export const IDENTITY_KINDS = ['GIT_BLOB'];

/**
 * Un identifiant de fait ne porte aucun espace : une phrase de prose ne peut
 * pas tenir lieu de sémantique déguisée. Autorité 24 § 6.
 */
export const FACT_ID = /^[A-Za-z0-9][A-Za-z0-9_.:-]*$/;
export const EXECUTOR_ID = /^[A-Z][A-Z0-9_]*$/;
export const GIT_BLOB = /^[0-9a-f]{40}$/;

/* ------------------------------------------------------------------ *
 * Chargement — écriture unique
 * ------------------------------------------------------------------ */

function deepFreeze(value) {
  if (value === null || typeof value !== 'object') return value;
  for (const key of Object.keys(value)) deepFreeze(value[key]);
  return Object.freeze(value);
}

export function parse(text) {
  let instance;
  try {
    instance = JSON.parse(text);
  } catch (error) {
    throw new ResultInstanceError('JSON illisible : ' + error.message);
  }
  if (instance === null || typeof instance !== 'object' || Array.isArray(instance)) {
    throw new ResultInstanceError('une instance de résultat est un objet JSON');
  }
  return deepFreeze(instance);
}

export function load(path) {
  return parse(readFileSync(path, 'utf8'));
}

/* ------------------------------------------------------------------ *
 * Accesseurs employes par la validation
 * ------------------------------------------------------------------ */

export function entries(instance) {
  return Array.isArray(instance.reported_entries) ? instance.reported_entries : [];
}

export function reportedValueEntries(instance) {
  return entries(instance).filter((entry) => entry && entry.kind === 'REPORTED_VALUE');
}

export function nonProductionEntries(instance) {
  return entries(instance).filter((entry) => entry && entry.kind === 'STRUCTURAL_NON_PRODUCTION');
}

function authorityIdentity(reference) {
  return reference && reference.identity ? reference.identity.value : undefined;
}

/**
 * Cle d'identite de fait, QUALIFIEE PAR SA PORTEE.
 *
 * C'est le coeur de l'autorite 24 section 3 : un identifiant porte par
 * l'executant ne vaut que dans la portee de CETTE execution et de CETTE
 * instance gelee. Deux executions differentes employant la meme chaine ne
 * designent donc jamais le meme fait, et aucune equivalence entre executions
 * n'est possible par construction.
 *
 * Une identite definie par un contrat ou par un protocole est en revanche
 * qualifiee par l'identite immuable de l'autorite qui la definit : deux
 * instances adossees au meme contrat partagent bien la meme cle.
 *
 * Rend `undefined` lorsque la portee requise est absente. La validation
 * structurelle traite ce cas comme une erreur.
 */
export function factKey(instance, entry) {
  if (!entry || !entry.fact || typeof entry.fact.id !== 'string') return undefined;
  const id = entry.fact.id;
  if (entry.fact.defined_by === 'RETURN_CONTRACT') {
    const scope = authorityIdentity(instance.return_contract && instance.return_contract.authority);
    return scope === undefined ? undefined : 'RETURN_CONTRACT/' + scope + '/' + id;
  }
  if (entry.fact.defined_by === 'SOURCE') {
    const scope = authorityIdentity(instance.source && instance.source.authority);
    return scope === undefined ? undefined : 'SOURCE/' + scope + '/' + id;
  }
  if (entry.fact.defined_by === 'EXECUTOR') {
    const execution = instance.execution && instance.execution.id;
    const executor = instance.reported_by && instance.reported_by.executor;
    if (typeof execution !== 'string' || typeof executor !== 'string') return undefined;
    return 'EXECUTOR/' + execution + '/' + executor + '/' + id;
  }
  return undefined;
}

/**
 * Identites d'exigences de retour exposees par un Mission Object, avec leur
 * domaine clos lorsqu'il en expose un.
 *
 * Rien d'autre n'est importe : ni genre de preuve, ni politique de recalcul,
 * ni sémantique d'execution de Mission Object.
 */
export function contractRequirements(missionObject) {
  const out = new Map();
  const contract = missionObject && missionObject.return_contract;
  if (!Array.isArray(contract)) return out;
  for (const field of contract) {
    if (!field || typeof field.id !== 'string') continue;
    let allowed;
    const values = field.allowed_values;
    if (values && values.type === 'SET' && Array.isArray(values.members)) {
      allowed = new Set(
        values.members
          .filter((member) => member && typeof member.value === 'string')
          .map((member) => member.value),
      );
    }
    out.set(field.id, { allowed });
  }
  return out;
}
