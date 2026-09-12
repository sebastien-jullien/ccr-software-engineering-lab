/**
 * TOOLING-EXPERIMENT-002 — représentation durable de mission, v0.
 *
 * Conforme à l'autorité gelée
 * `14-TOOLING-EXPERIMENT-002-MISSION-OBJECT-V0.md`, et à elle seule.
 *
 * Représenter n'est pas exécuter. Ce module charge un Mission Object et
 * expose les vocabulaires fermés ainsi que l'énumération des éléments
 * normatifs. Il n'exécute aucune opération de mission, ne dispatche aucun
 * agent, ne décide d'aucun routage, ne mute ni Git ni PROGRAM-STATE,
 * n'invoque aucun fournisseur, n'ordonnance rien et ne juge aucune mission.
 *
 * Un identifiant d'action reste opaque : rien ici ne l'interprète.
 *
 * Aucune dépendance externe. Aucun réseau. Aucune horloge.
 */

import { readFileSync } from 'node:fs';

/* ------------------------------------------------------------------ *
 * Vocabulaires fermés — autorité 14
 * ------------------------------------------------------------------ */

export const ROOT_ELEMENTS = [
  'identity',
  'context',
  'references',
  'effects',
  'content_requirements',
  'procedure',
  'gates',
  'branches',
  'stop_rules',
  'human_authority',
  'evidence_requirements',
  'terminal_outcomes',
  'return_contract',
  'next_consequences',
  'standing_constraints',
  'terminal',
];

export const ROOT_REQUIRED = ['identity', 'references', 'effects', 'return_contract', 'terminal'];

export const VALUE_TYPES = ['SCALAR', 'SYMBOL', 'REFERENCE', 'SET', 'SEQUENCE', 'CLAIM_TRIPLE'];

export const RELATIONS = [
  'EQUALS',
  'SET_EQUALS',
  'SEQ_EQUALS',
  'HAS_MEMBER',
  'IMPLIES',
  'DEFINED_BY',
  'ESTABLISHED_BY',
  'SUPPORTS',
];

export const CONTENT_KINDS = ['CLAIM', 'PRESERVE', 'FORBID_CLAIM'];
export const POLARITIES = ['ASSERT', 'DENY'];

export const PREDICATE_OPS = ['EQ', 'NEQ', 'SET_EQ'];
export const SUBJECT_KINDS = [
  'REPO_FACT',
  'ARTIFACT_IDENTITY',
  'OPERATION_RESULT',
  'MEASUREMENT',
  'PRESENCE_OF',
  'OBJECT_FIELD',
];
export const SUBJECT_MODIFIERS = ['COUNT_OF'];

/** §8 : `field` n'est autorisé que là où le corpus l'a démontré. */
export const FIELD_BEARING_KINDS = ['OPERATION_RESULT', 'OBJECT_FIELD'];

export const REFERENCE_ROLES = ['AUTHORITY', 'CONTEXT', 'VERIFICATION_TARGET', 'DELIVERABLE'];
export const LOCATOR_KINDS = ['REPO_PATH', 'MISSION_PACKET', 'REMOTE_REF'];
export const IDENTITY_KINDS = ['GIT_BLOB', 'SHA256', 'COMMIT'];

export const EVIDENCE_KINDS = ['AUTHORITY', 'OBSERVATION', 'VERIFICATION', 'RETURNED'];

export const EFFECT_MODES = ['REQUIRED', 'PERMITTED', 'PERMITTED_AFTER_GATE', 'FORBIDDEN'];

/** §12.2 : enregistrement fermé. Aucune clé métier n'y entre jamais. */
export const CONSTRAINT_KEYS = ['author', 'committer', 'parent', 'subject', 'staged_paths', 'ff_only'];
export const CONSTRAINT_SCALAR_KEYS = ['author', 'committer', 'parent', 'subject'];

export const ACQUISITIONS = ['PREDETERMINED', 'MEASURED'];
export const RETURN_VALUE_TYPES = ['SCALAR', 'SYMBOL', 'SET'];

export const NEXT_KINDS = ['DETERMINED', 'HUMAN_GATE'];

export const GATE_SCOPE_SYMBOLS = ['ALL_PRECEDING'];
export const STOP_REQUIRED = ['REPORT'];
export const STOP_TERMINAL = 'STOP';

export const CONTENT_SCOPE_MISSION = 'MISSION';

/**
 * Prose autorisée, sans aucune force normative. Supprimer ces champs d'un
 * objet valide doit laisser son contrat normatif intact.
 */
export const PROSE_FIELDS = ['label', 'rationale'];

/**
 * L'autorité 14 distingue la prose par l'astérisque, non par le nom : `label*`
 * est de la prose partout, mais `terminal_outcome.label` — sans astérisque,
 * §16 — est l'étiquette symbolique normative du résultat. Le dépouillement de
 * la prose se fait donc par position, jamais par nom seul.
 */
export const NORMATIVE_LABEL = /^terminal_outcomes\[\d+\]\.label$/;

/**
 * §9 : aucun second canal normatif. Ces noms sont refusés partout, y compris
 * là où un champ inconnu serait de toute façon refusé — le refus doit être
 * explicite et nommé.
 */
export const FORBIDDEN_PROSE_FIELDS = [
  'prompt',
  'instructions',
  'normative_notes',
  'raw_mission',
  'escape_hatch',
  'mission_text',
  'directives',
];

/* ------------------------------------------------------------------ *
 * Chargement
 * ------------------------------------------------------------------ */

export class MissionObjectError extends Error {}

export function parse(text) {
  let object;
  try {
    object = JSON.parse(text);
  } catch (error) {
    throw new MissionObjectError('JSON illisible : ' + error.message);
  }
  if (object === null || typeof object !== 'object' || Array.isArray(object)) {
    throw new MissionObjectError('un Mission Object est un objet JSON');
  }
  return object;
}

export function load(path) {
  return parse(readFileSync(path, 'utf8'));
}

/* ------------------------------------------------------------------ *
 * Énumération des éléments normatifs
 * ------------------------------------------------------------------ *
 *
 * Cette énumération est dérivée du schéma, jamais d'une liste tenue à la
 * main. Elle sert de source unique pour la couverture de rendu : le rendu
 * produit sa propre trace pendant sa traversée, et la qualification compare
 * les deux ensembles. Deux parcours indépendants, un seul schéma.
 */

function push(list, path, kind) {
  list.push({ path, kind });
}

/**
 * Chemins normatifs d'un objet, dans l'ordre du schéma.
 * `context[]` est déclaré non normatif par l'autorité 14 et n'y figure pas.
 */
export function normativeElements(object) {
  const out = [];
  if (object.identity) push(out, 'identity', 'identity');

  for (const [index, entry] of (object.references || []).entries()) {
    push(out, 'references[' + index + ']', 'reference');
    void entry;
  }
  for (const [index] of (object.effects || []).entries()) {
    push(out, 'effects[' + index + ']', 'effect');
  }
  for (const [index] of (object.content_requirements || []).entries()) {
    push(out, 'content_requirements[' + index + ']', 'content_requirement');
  }
  if (object.procedure) {
    push(out, 'procedure', 'procedure');
    for (const [index] of (object.procedure.steps || []).entries()) {
      push(out, 'procedure.steps[' + index + ']', 'step');
    }
  }
  for (const [index] of (object.gates || []).entries()) {
    push(out, 'gates[' + index + ']', 'gate');
  }
  for (const [index] of (object.stop_rules || []).entries()) {
    push(out, 'stop_rules[' + index + ']', 'stop_rule');
  }
  for (const [index, branch] of (object.branches || []).entries()) {
    push(out, 'branches[' + index + ']', 'branch');
    for (const [inner] of (branch.steps || []).entries()) {
      push(out, 'branches[' + index + '].steps[' + inner + ']', 'step');
    }
    for (const [inner] of (branch.effects || []).entries()) {
      push(out, 'branches[' + index + '].effects[' + inner + ']', 'effect');
    }
    for (const [inner] of (branch.requirements || []).entries()) {
      push(out, 'branches[' + index + '].requirements[' + inner + ']', 'content_requirement');
    }
  }
  if (object.human_authority) {
    const authority = object.human_authority;
    for (const [index] of (authority.ratified_decisions || []).entries()) {
      push(out, 'human_authority.ratified_decisions[' + index + ']', 'ratified_decision');
    }
    for (const [index] of (authority.open_human_gates || []).entries()) {
      push(out, 'human_authority.open_human_gates[' + index + ']', 'open_human_gate');
    }
    if (Array.isArray(authority.deterministic_consequences) && authority.deterministic_consequences.length > 0) {
      push(out, 'human_authority.deterministic_consequences', 'deterministic_consequences');
    }
  }
  for (const [index] of (object.evidence_requirements || []).entries()) {
    push(out, 'evidence_requirements[' + index + ']', 'evidence_requirement');
  }
  for (const [index, outcome] of (object.terminal_outcomes || []).entries()) {
    push(out, 'terminal_outcomes[' + index + ']', 'terminal_outcome');
    for (const [inner] of (outcome.post_state || []).entries()) {
      push(out, 'terminal_outcomes[' + index + '].post_state[' + inner + ']', 'content_requirement');
    }
  }
  for (const [index] of (object.return_contract || []).entries()) {
    push(out, 'return_contract[' + index + ']', 'return_field');
  }
  for (const [index] of (object.next_consequences || []).entries()) {
    push(out, 'next_consequences[' + index + ']', 'next_consequence');
  }
  for (const [index] of (object.standing_constraints || []).entries()) {
    push(out, 'standing_constraints[' + index + ']', 'standing_constraint');
  }
  if (object.terminal) push(out, 'terminal', 'terminal');
  return out;
}

/**
 * Résolution d'un chemin d'élément normatif, employée par la qualification
 * de couverture. Aucune indulgence : un chemin qui ne désigne rien est une
 * erreur, pas un avertissement.
 */
export function resolvePath(object, path) {
  let current = object;
  const tokens = path.split('.');
  for (const token of tokens) {
    const match = /^([A-Za-z_]+)(\[(\d+)\])?$/.exec(token);
    if (!match) return undefined;
    if (current === null || typeof current !== 'object') return undefined;
    current = current[match[1]];
    if (match[3] !== undefined) {
      if (!Array.isArray(current)) return undefined;
      current = current[Number(match[3])];
    }
    if (current === undefined) return undefined;
  }
  return current;
}

/**
 * Index des éléments adressables par identifiant, dérivé du schéma.
 * Les éléments qui n'ont pas d'identifiant propre — contexte, branche,
 * résultat terminal — sont adressés par un préfixe explicite.
 */
export function elementIndex(object) {
  const index = new Map();
  const add = (id, path) => {
    if (typeof id === 'string' && id.length > 0 && !index.has(id)) index.set(id, path);
  };
  for (const [i, entry] of (object.context || []).entries()) add('ctx:' + entry.subject, 'context[' + i + ']');
  for (const [i, entry] of (object.references || []).entries()) add(entry.id, 'references[' + i + ']');
  for (const [i, entry] of (object.effects || []).entries()) add(entry.id, 'effects[' + i + ']');
  for (const [i, entry] of (object.content_requirements || []).entries()) {
    add(entry.id, 'content_requirements[' + i + ']');
  }
  for (const [i, entry] of ((object.procedure || {}).steps || []).entries()) {
    add(entry.id, 'procedure.steps[' + i + ']');
  }
  for (const [i, entry] of (object.gates || []).entries()) add(entry.id, 'gates[' + i + ']');
  for (const [i, entry] of (object.stop_rules || []).entries()) add(entry.id, 'stop_rules[' + i + ']');
  for (const [i, item] of (object.branches || []).entries()) {
    add('branch:' + item.id, 'branches[' + i + ']');
    for (const [j, entry] of (item.steps || []).entries()) add(entry.id, 'branches[' + i + '].steps[' + j + ']');
    for (const [j, entry] of (item.effects || []).entries()) add(entry.id, 'branches[' + i + '].effects[' + j + ']');
    for (const [j, entry] of (item.requirements || []).entries()) {
      add(entry.id, 'branches[' + i + '].requirements[' + j + ']');
    }
  }
  const authority = object.human_authority || {};
  for (const [i, entry] of (authority.ratified_decisions || []).entries()) {
    add(entry.id, 'human_authority.ratified_decisions[' + i + ']');
  }
  for (const [i, entry] of (authority.open_human_gates || []).entries()) {
    add(entry.id, 'human_authority.open_human_gates[' + i + ']');
  }
  for (const [i, entry] of (object.evidence_requirements || []).entries()) {
    add(entry.id, 'evidence_requirements[' + i + ']');
  }
  for (const [i, item] of (object.terminal_outcomes || []).entries()) {
    add('outcome:' + item.label, 'terminal_outcomes[' + i + ']');
    for (const [j, entry] of (item.post_state || []).entries()) {
      add(entry.id, 'terminal_outcomes[' + i + '].post_state[' + j + ']');
    }
  }
  for (const [i, entry] of (object.return_contract || []).entries()) add(entry.id, 'return_contract[' + i + ']');
  for (const [i, entry] of (object.next_consequences || []).entries()) {
    add(entry.id, 'next_consequences[' + i + ']');
  }
  for (const [i, entry] of (object.standing_constraints || []).entries()) {
    add(entry.id, 'standing_constraints[' + i + ']');
  }
  return index;
}

/**
 * Résout une référence de qualification `<id-ou-chemin>[#champ.sous-champ]`.
 * Retourne `undefined` si la référence ne désigne rien : une couverture ne
 * s'accorde jamais sur un chemin absent.
 */
export function resolveReference(object, reference, index) {
  const map = index || elementIndex(object);
  const [head, tail] = String(reference).split('#');
  const path = map.has(head) ? map.get(head) : head;
  let current = resolvePath(object, path);
  if (current === undefined) return undefined;
  let full = path;
  if (tail !== undefined) {
    for (const token of tail.split('.')) {
      if (current === null || typeof current !== 'object') return undefined;
      current = current[token];
      if (current === undefined) return undefined;
      full += '.' + token;
    }
  }
  return { path: full, value: current, element: path };
}

/**
 * Retire toute prose non normative. Un objet ainsi dépouillé doit rester
 * valide et rendre le même contrat normatif : c'est le test de §21 de
 * l'autorité 14.
 */
export function stripProse(object) {
  const strip = (value, path) => {
    if (Array.isArray(value)) return value.map((item, index) => strip(item, path + '[' + index + ']'));
    if (value === null || typeof value !== 'object') return value;
    const out = {};
    for (const key of Object.keys(value)) {
      const child = path === '' ? key : path + '.' + key;
      if (PROSE_FIELDS.includes(key) && !NORMATIVE_LABEL.test(child)) continue;
      out[key] = strip(value[key], child);
    }
    return out;
  };
  return strip(object, '');
}
