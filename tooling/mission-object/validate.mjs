/**
 * TOOLING-EXPERIMENT-002 — validateur de Mission Object v0.
 *
 * Il applique le schéma gelé par l'autorité 14, et rien d'autre.
 *
 * Deux règles gouvernent tout ce fichier :
 *
 *   - un champ inconnu est un refus, jamais un champ ignoré : il n'existe
 *     aucune extension normative, aucune charge utile libre, aucune trappe ;
 *   - un identifiant d'action reste opaque : le validateur vérifie sa forme,
 *     jamais son sens. Rien ici ne déduit quoi que ce soit de COMMIT, DESIGN,
 *     IMPLEMENT ou DECIDE.
 *
 * Aucune dépendance externe. Aucun réseau. Aucune horloge.
 */

import {
  ACQUISITIONS,
  CONSTRAINT_KEYS,
  CONSTRAINT_SCALAR_KEYS,
  CONTENT_KINDS,
  CONTENT_SCOPE_MISSION,
  EFFECT_MODES,
  EVIDENCE_KINDS,
  FIELD_BEARING_KINDS,
  FORBIDDEN_PROSE_FIELDS,
  GATE_SCOPE_SYMBOLS,
  IDENTITY_KINDS,
  LOCATOR_KINDS,
  NEXT_KINDS,
  POLARITIES,
  PREDICATE_OPS,
  PROSE_FIELDS,
  REFERENCE_ROLES,
  RELATIONS,
  RETURN_VALUE_TYPES,
  ROOT_ELEMENTS,
  ROOT_REQUIRED,
  STOP_REQUIRED,
  STOP_TERMINAL,
  SUBJECT_KINDS,
  SUBJECT_MODIFIERS,
  VALUE_TYPES,
} from './mission-object.mjs';

/** Valeur attendue par relation — §7 de l'autorité 14. */
const RELATION_VALUE_TYPE = {
  EQUALS: ['SCALAR', 'SYMBOL'],
  SET_EQUALS: ['SET'],
  SEQ_EQUALS: ['SEQUENCE'],
  HAS_MEMBER: ['SYMBOL'],
  IMPLIES: ['SYMBOL'],
  DEFINED_BY: ['REFERENCE'],
  ESTABLISHED_BY: ['SET'],
  SUPPORTS: ['CLAIM_TRIPLE'],
};

/** Ce que désigne `predicate.subject.ref`, par genre de sujet. */
const SUBJECT_REF_TARGET = {
  ARTIFACT_IDENTITY: 'reference',
  OPERATION_RESULT: 'effect',
};

class Report {
  constructor() {
    this.errors = [];
  }
  fail(path, message) {
    this.errors.push({ path, message });
  }
  get ok() {
    return this.errors.length === 0;
  }
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isSymbol(value) {
  return typeof value === 'string' && value.length > 0;
}

/** Un identifiant d'action est atomique : un seul référent, jamais un chemin. */
function isActionId(value) {
  return typeof value === 'string' && /^[A-Z][A-Z0-9_]*$/.test(value);
}

function keys(report, path, value, required, optional) {
  if (!isObject(value)) {
    report.fail(path, 'objet attendu');
    return false;
  }
  const allowed = new Set([...required, ...optional]);
  for (const key of Object.keys(value)) {
    if (FORBIDDEN_PROSE_FIELDS.includes(key)) {
      report.fail(path + '.' + key, 'champ de prose normative interdit : aucun second canal normatif');
      continue;
    }
    if (!allowed.has(key)) {
      report.fail(path + '.' + key, 'champ inconnu : aucune extension normative n’existe');
    }
  }
  for (const key of required) {
    if (value[key] === undefined) report.fail(path + '.' + key, 'champ requis absent');
  }
  for (const key of PROSE_FIELDS) {
    if (value[key] !== undefined && typeof value[key] !== 'string') {
      report.fail(path + '.' + key, 'la prose non normative est une chaîne');
    }
  }
  return true;
}

function enumeration(report, path, value, vocabulary) {
  if (!vocabulary.includes(value)) {
    report.fail(path, 'valeur hors vocabulaire fermé : ' + JSON.stringify(value));
    return false;
  }
  return true;
}

function idList(entries, label, report, path) {
  const seen = new Set();
  for (const [index, entry] of entries.entries()) {
    const id = isObject(entry) ? entry.id : undefined;
    if (!isSymbol(id)) continue;
    if (seen.has(id)) report.fail(path + '[' + index + '].id', 'identifiant ' + label + ' dupliqué : ' + id);
    seen.add(id);
  }
  return seen;
}

/* ------------------------------------------------------------------ *
 * Algèbre de valeurs
 * ------------------------------------------------------------------ */

function value(report, path, node, registry) {
  if (!keys(report, path, node, ['type'], ['value', 'members', 'subject', 'field'])) return;
  if (!enumeration(report, path + '.type', node.type, VALUE_TYPES)) return;

  switch (node.type) {
    case 'SCALAR': {
      const kind = typeof node.value;
      if (kind !== 'string' && kind !== 'number' && kind !== 'boolean') {
        report.fail(path + '.value', 'SCALAR : chaîne, entier ou booléen attendu');
      }
      if (kind === 'number' && !Number.isInteger(node.value)) {
        report.fail(path + '.value', 'SCALAR numérique : entier attendu');
      }
      break;
    }
    case 'SYMBOL':
      if (!isSymbol(node.value)) report.fail(path + '.value', 'SYMBOL : symbole non vide attendu');
      break;
    case 'REFERENCE':
      if (!isSymbol(node.value)) {
        report.fail(path + '.value', 'REFERENCE : identifiant attendu');
      } else if (!registry.references.has(node.value)) {
        report.fail(path + '.value', 'référence pendante : ' + node.value);
      }
      break;
    case 'SET':
    case 'SEQUENCE': {
      if (!Array.isArray(node.members)) {
        report.fail(path + '.members', node.type + ' : liste de valeurs attendue');
        break;
      }
      if (node.members.length === 0) {
        report.fail(path + '.members', node.type + ' : un ensemble normatif vide ne dit rien');
      }
      for (const [index, member] of node.members.entries()) {
        value(report, path + '.members[' + index + ']', member, registry);
      }
      if (node.type === 'SET') {
        const seen = new Set();
        for (const [index, member] of node.members.entries()) {
          const key = JSON.stringify(member);
          if (seen.has(key)) report.fail(path + '.members[' + index + ']', 'membre dupliqué dans un SET');
          seen.add(key);
        }
      }
      break;
    }
    case 'CLAIM_TRIPLE':
      if (!isSymbol(node.subject)) report.fail(path + '.subject', 'CLAIM_TRIPLE : sujet attendu');
      if (!isSymbol(node.field)) report.fail(path + '.field', 'CLAIM_TRIPLE : champ attendu');
      if (!isSymbol(node.value)) report.fail(path + '.value', 'CLAIM_TRIPLE : valeur attendue');
      break;
    default:
      break;
  }

  if ((node.type === 'SET' || node.type === 'SEQUENCE') && node.value !== undefined) {
    report.fail(path + '.value', node.type + ' porte ses membres dans members');
  }
}

/* ------------------------------------------------------------------ *
 * Prédicat
 * ------------------------------------------------------------------ */

function predicate(report, path, node, registry) {
  if (!isObject(node)) {
    report.fail(path, 'prédicat attendu');
    return;
  }
  if (node.all_of !== undefined) {
    if (!keys(report, path, node, ['all_of'], [])) return;
    if (!Array.isArray(node.all_of) || node.all_of.length === 0) {
      report.fail(path + '.all_of', 'all_of : liste non vide attendue');
      return;
    }
    for (const [index, inner] of node.all_of.entries()) {
      predicate(report, path + '.all_of[' + index + ']', inner, registry);
    }
    return;
  }
  if (!keys(report, path, node, ['op', 'subject', 'value'], [])) return;
  enumeration(report, path + '.op', node.op, PREDICATE_OPS);

  const subject = node.subject;
  if (keys(report, path + '.subject', subject, ['kind'], ['modifier', 'ref', 'field'])) {
    enumeration(report, path + '.subject.kind', subject.kind, SUBJECT_KINDS);
    if (subject.modifier !== undefined) {
      enumeration(report, path + '.subject.modifier', subject.modifier, SUBJECT_MODIFIERS);
    }
    if (subject.field !== undefined) {
      if (!FIELD_BEARING_KINDS.includes(subject.kind)) {
        report.fail(
          path + '.subject.field',
          'sélecteur field interdit pour le genre ' + String(subject.kind),
        );
      }
      if (!isSymbol(subject.field) || /[.[\]/*]/.test(subject.field)) {
        report.fail(path + '.subject.field', 'field : un seul niveau, aucun chemin, aucun filtre');
      }
      if (subject.ref === undefined) {
        report.fail(path + '.subject.ref', 'field présent exige ref présent');
      }
    }
    if (subject.ref !== undefined) {
      if (!isSymbol(subject.ref)) {
        report.fail(path + '.subject.ref', 'ref : identifiant ou symbole attendu');
      } else {
        const target = SUBJECT_REF_TARGET[subject.kind];
        if (target === 'reference' && !registry.references.has(subject.ref)) {
          report.fail(path + '.subject.ref', 'référence pendante : ' + subject.ref);
        }
        if (target === 'effect' && !registry.effects.has(subject.ref)) {
          report.fail(path + '.subject.ref', 'effet pendant : ' + subject.ref);
        }
      }
    }
  }

  value(report, path + '.value', node.value, registry);
  if (node.op === 'SET_EQ' && isObject(node.value) && node.value.type !== 'SET') {
    report.fail(path + '.value', 'SET_EQ exige une valeur de type SET');
  }
}

/* ------------------------------------------------------------------ *
 * Effet et son enregistrement de contraintes
 * ------------------------------------------------------------------ */

function constraints(report, path, node) {
  if (!keys(report, path, node, [], CONSTRAINT_KEYS)) return;
  if (Object.keys(node).length === 0) {
    report.fail(path, 'enregistrement de contraintes vide : l’omettre');
  }
  for (const key of CONSTRAINT_SCALAR_KEYS) {
    if (node[key] !== undefined && typeof node[key] !== 'string') {
      report.fail(path + '.' + key, 'type attendu : SCALAR chaîne');
    }
  }
  if (node.staged_paths !== undefined) {
    if (!Array.isArray(node.staged_paths) || node.staged_paths.length === 0) {
      report.fail(path + '.staged_paths', 'type attendu : SET<SCALAR> non vide');
    } else {
      const seen = new Set();
      for (const [index, entry] of node.staged_paths.entries()) {
        if (typeof entry !== 'string') {
          report.fail(path + '.staged_paths[' + index + ']', 'type attendu : SCALAR chaîne');
        } else if (seen.has(entry)) {
          report.fail(path + '.staged_paths[' + index + ']', 'chemin dupliqué dans un SET');
        }
        seen.add(entry);
      }
    }
  }
  if (node.ff_only !== undefined && typeof node.ff_only !== 'boolean') {
    report.fail(path + '.ff_only', 'type attendu : bool');
  }
}

function targetRef(report, path, node, registry) {
  if (isObject(node)) {
    if (!keys(report, path, node, ['ref'], [])) return;
    if (!isSymbol(node.ref) || !registry.references.has(node.ref)) {
      report.fail(path + '.ref', 'référence pendante : ' + String(node.ref));
    }
    return;
  }
  if (!isSymbol(node)) report.fail(path, 'cible : référence {ref} ou SYMBOL attendu');
}

function effect(report, path, node, registry) {
  if (!keys(report, path, node, ['id', 'mode', 'action'], ['target', 'cardinality', 'gated_by', 'constraints', ...PROSE_FIELDS])) {
    return;
  }
  if (!isSymbol(node.id)) report.fail(path + '.id', 'identifiant attendu');
  enumeration(report, path + '.mode', node.mode, EFFECT_MODES);
  if (!isActionId(node.action)) {
    report.fail(path + '.action', 'identifiant d’action atomique attendu (A-Z, chiffres, _)');
  }
  if (node.target !== undefined) targetRef(report, path + '.target', node.target, registry);
  if (node.cardinality !== undefined && (!Number.isInteger(node.cardinality) || node.cardinality < 0)) {
    report.fail(path + '.cardinality', 'entier positif ou nul attendu');
  }
  if (node.mode === 'PERMITTED_AFTER_GATE') {
    if (node.gated_by === undefined) {
      report.fail(path + '.gated_by', 'PERMITTED_AFTER_GATE exige gated_by');
    }
  } else if (node.gated_by !== undefined) {
    report.fail(path + '.gated_by', 'gated_by n’a de sens que pour PERMITTED_AFTER_GATE');
  }
  if (node.gated_by !== undefined && !registry.gates.has(node.gated_by)) {
    report.fail(path + '.gated_by', 'porte pendante : ' + String(node.gated_by));
  }
  if (node.constraints !== undefined) constraints(report, path + '.constraints', node.constraints);
}

/* ------------------------------------------------------------------ *
 * Exigence de contenu
 * ------------------------------------------------------------------ */

function contentRequirement(report, path, node, registry) {
  if (
    !keys(
      report,
      path,
      node,
      ['id', 'scope', 'target', 'kind', 'subject'],
      ['polarity', 'relation', 'value', 'depends_on', ...PROSE_FIELDS],
    )
  ) {
    return;
  }
  if (!isSymbol(node.id)) report.fail(path + '.id', 'identifiant attendu');
  if (node.scope !== CONTENT_SCOPE_MISSION && !registry.branches.has(node.scope)) {
    report.fail(path + '.scope', 'portée inconnue : MISSION ou identifiant de branche attendu');
  }
  if (!registry.references.has(node.target)) {
    report.fail(path + '.target', 'référence pendante : ' + String(node.target));
  }
  enumeration(report, path + '.kind', node.kind, CONTENT_KINDS);
  if (!isSymbol(node.subject)) report.fail(path + '.subject', 'sujet symbolique attendu');

  if (node.kind === 'CLAIM') {
    if (node.polarity === undefined) {
      report.fail(path + '.polarity', 'CLAIM exige une polarité');
    } else {
      enumeration(report, path + '.polarity', node.polarity, POLARITIES);
    }
  } else if (node.polarity !== undefined) {
    report.fail(path + '.polarity', 'la polarité n’appartient qu’à CLAIM');
  }

  const hasRelation = node.relation !== undefined;
  const hasValue = node.value !== undefined;
  if (hasRelation !== hasValue) {
    report.fail(path, 'relation et value vont ensemble, ou aucune des deux');
  }
  if (hasRelation) {
    if (enumeration(report, path + '.relation', node.relation, RELATIONS)) {
      value(report, path + '.value', node.value, registry);
      const expected = RELATION_VALUE_TYPE[node.relation];
      if (isObject(node.value) && node.value.type !== undefined && !expected.includes(node.value.type)) {
        report.fail(
          path + '.value.type',
          'la relation ' + node.relation + ' exige ' + expected.join(' ou ') + ', pas ' + node.value.type,
        );
      }
      if (node.relation === 'ESTABLISHED_BY' && isObject(node.value) && Array.isArray(node.value.members)) {
        for (const [index, member] of node.value.members.entries()) {
          if (isObject(member) && member.type !== 'REFERENCE') {
            report.fail(
              path + '.value.members[' + index + '].type',
              'ESTABLISHED_BY : ensemble de REFERENCE attendu',
            );
          }
        }
      }
    }
  } else if (node.kind !== 'PRESERVE') {
    report.fail(path, 'seul PRESERVE peut se passer de relation et de valeur');
  }

  if (node.depends_on !== undefined) {
    if (!Array.isArray(node.depends_on) || node.depends_on.length === 0) {
      report.fail(path + '.depends_on', 'liste non vide attendue');
    } else {
      for (const [index, entry] of node.depends_on.entries()) {
        if (!registry.evidence.has(entry) && !registry.references.has(entry)) {
          report.fail(path + '.depends_on[' + index + ']', 'dépendance pendante : ' + String(entry));
        }
      }
    }
  }
}

/* ------------------------------------------------------------------ *
 * Éléments restants
 * ------------------------------------------------------------------ */

function reference(report, path, node) {
  if (!keys(report, path, node, ['id', 'role', 'locator', 'identity_required'], ['identity', ...PROSE_FIELDS])) return;
  if (!isSymbol(node.id)) report.fail(path + '.id', 'identifiant attendu');
  enumeration(report, path + '.role', node.role, REFERENCE_ROLES);
  if (keys(report, path + '.locator', node.locator, ['kind', 'value'], [])) {
    enumeration(report, path + '.locator.kind', node.locator.kind, LOCATOR_KINDS);
    if (!isSymbol(node.locator.value)) report.fail(path + '.locator.value', 'valeur de locator attendue');
  }
  if (typeof node.identity_required !== 'boolean') {
    report.fail(path + '.identity_required', 'bool attendu');
  }
  if (node.identity !== undefined) {
    if (keys(report, path + '.identity', node.identity, ['kind', 'value'], [])) {
      enumeration(report, path + '.identity.kind', node.identity.kind, IDENTITY_KINDS);
      if (!isSymbol(node.identity.value)) report.fail(path + '.identity.value', 'valeur d’identité attendue');
    }
  } else if (node.identity_required === true) {
    report.fail(path + '.identity', 'identity_required exige une identité');
  }
}

function evidenceRequirement(report, path, node, registry) {
  if (
    !keys(report, path, node, ['id', 'kind', 'fact'], ['method', 'forbidden_sources', 'must_return', ...PROSE_FIELDS])
  ) {
    return;
  }
  if (!isSymbol(node.id)) report.fail(path + '.id', 'identifiant attendu');
  enumeration(report, path + '.kind', node.kind, EVIDENCE_KINDS);
  if (!isSymbol(node.fact)) report.fail(path + '.fact', 'fait symbolique attendu');
  if (node.method !== undefined) {
    if (keys(report, path + '.method', node.method, ['op', 'source', 'recompute'], [])) {
      enumeration(report, path + '.method.op', node.method.op, PREDICATE_OPS);
      if (!registry.references.has(node.method.source)) {
        report.fail(path + '.method.source', 'référence pendante : ' + String(node.method.source));
      }
      if (typeof node.method.recompute !== 'boolean') {
        report.fail(path + '.method.recompute', 'bool attendu');
      }
    }
  }
  if (node.forbidden_sources !== undefined) {
    if (!Array.isArray(node.forbidden_sources) || node.forbidden_sources.length === 0) {
      report.fail(path + '.forbidden_sources', 'liste non vide attendue');
    } else {
      for (const [index, entry] of node.forbidden_sources.entries()) {
        if (!isSymbol(entry)) report.fail(path + '.forbidden_sources[' + index + ']', 'symbole attendu');
      }
    }
  }
  if (node.must_return !== undefined && !registry.returnFields.has(node.must_return)) {
    report.fail(path + '.must_return', 'champ de retour pendant : ' + String(node.must_return));
  }
}

function gate(report, path, node, registry) {
  if (!keys(report, path, node, ['id', 'scope', 'predicate', 'on_fail'], ['tolerated', ...PROSE_FIELDS])) return;
  if (!isSymbol(node.id)) report.fail(path + '.id', 'identifiant attendu');
  if (Array.isArray(node.scope)) {
    if (node.scope.length === 0) report.fail(path + '.scope', 'portée vide');
    for (const [index, entry] of node.scope.entries()) {
      if (!registry.steps.has(entry)) report.fail(path + '.scope[' + index + ']', 'étape pendante : ' + String(entry));
    }
  } else {
    enumeration(report, path + '.scope', node.scope, GATE_SCOPE_SYMBOLS);
  }
  predicate(report, path + '.predicate', node.predicate, registry);
  if (!registry.stopRules.has(node.on_fail) && !registry.branches.has(node.on_fail)) {
    report.fail(path + '.on_fail', 'on_fail pendant : règle d’arrêt ou branche attendue');
  }
  if (node.tolerated !== undefined) {
    if (!Array.isArray(node.tolerated) || node.tolerated.length === 0) {
      report.fail(path + '.tolerated', 'liste non vide attendue');
    } else {
      for (const [index, entry] of node.tolerated.entries()) {
        if (!isSymbol(entry)) report.fail(path + '.tolerated[' + index + ']', 'symbole attendu');
      }
    }
  }
}

function stopRule(report, path, node, registry) {
  if (!keys(report, path, node, ['id', 'trigger', 'prohibitions', 'required', 'terminal'], PROSE_FIELDS)) return;
  if (!isSymbol(node.id)) report.fail(path + '.id', 'identifiant attendu');
  predicate(report, path + '.trigger', node.trigger, registry);
  if (!Array.isArray(node.prohibitions) || node.prohibitions.length === 0) {
    report.fail(path + '.prohibitions', 'liste non vide attendue');
  } else {
    for (const [index, entry] of node.prohibitions.entries()) {
      const inner = path + '.prohibitions[' + index + ']';
      effect(report, inner, entry, registry);
      if (isObject(entry) && entry.mode !== undefined && entry.mode !== 'FORBIDDEN') {
        report.fail(inner + '.mode', 'une interdiction d’arrêt est FORBIDDEN');
      }
    }
  }
  if (!Array.isArray(node.required) || node.required.length !== STOP_REQUIRED.length) {
    report.fail(path + '.required', 'required attendu : ' + JSON.stringify(STOP_REQUIRED));
  } else {
    for (const [index, entry] of node.required.entries()) {
      enumeration(report, path + '.required[' + index + ']', entry, STOP_REQUIRED);
    }
  }
  if (node.terminal !== STOP_TERMINAL) {
    report.fail(path + '.terminal', 'terminal attendu : ' + STOP_TERMINAL);
  }
}

function step(report, path, node, registry) {
  if (!keys(report, path, node, ['order', 'id', 'effect', 'atomic'], ['gated_by', 'produces', ...PROSE_FIELDS])) return;
  if (!Number.isInteger(node.order) || node.order < 1) report.fail(path + '.order', 'entier positif attendu');
  if (!isSymbol(node.id)) report.fail(path + '.id', 'identifiant attendu');
  if (!registry.effects.has(node.effect)) report.fail(path + '.effect', 'effet pendant : ' + String(node.effect));
  if (typeof node.atomic !== 'boolean') report.fail(path + '.atomic', 'bool attendu');
  if (node.gated_by !== undefined && !registry.gates.has(node.gated_by)) {
    report.fail(path + '.gated_by', 'porte pendante : ' + String(node.gated_by));
  }
  if (node.produces !== undefined) {
    if (!Array.isArray(node.produces) || node.produces.length === 0) {
      report.fail(path + '.produces', 'liste non vide attendue');
    } else {
      for (const [index, entry] of node.produces.entries()) {
        if (!registry.evidence.has(entry)) {
          report.fail(path + '.produces[' + index + ']', 'preuve pendante : ' + String(entry));
        }
      }
    }
  }
}

function branch(report, path, node, registry) {
  if (
    !keys(
      report,
      path,
      node,
      ['id', 'condition', 'terminal_outcome', 'next'],
      ['steps', 'effects', 'requirements', ...PROSE_FIELDS],
    )
  ) {
    return;
  }
  if (!isSymbol(node.id)) report.fail(path + '.id', 'identifiant attendu');
  predicate(report, path + '.condition', node.condition, registry);
  if (!registry.outcomes.has(node.terminal_outcome)) {
    report.fail(path + '.terminal_outcome', 'résultat terminal pendant : ' + String(node.terminal_outcome));
  }
  if (!registry.nextConsequences.has(node.next)) {
    report.fail(path + '.next', 'conséquence suivante pendante : ' + String(node.next));
  }
  for (const [index, entry] of (node.steps || []).entries()) {
    step(report, path + '.steps[' + index + ']', entry, registry);
  }
  for (const [index, entry] of (node.effects || []).entries()) {
    effect(report, path + '.effects[' + index + ']', entry, registry);
  }
  for (const [index, entry] of (node.requirements || []).entries()) {
    contentRequirement(report, path + '.requirements[' + index + ']', entry, registry);
  }
}

function humanAuthority(report, path, node, registry) {
  if (!keys(report, path, node, [], ['ratified_decisions', 'open_human_gates', 'deterministic_consequences'])) return;
  for (const [index, entry] of (node.ratified_decisions || []).entries()) {
    const inner = path + '.ratified_decisions[' + index + ']';
    if (!keys(report, inner, entry, ['id', 'subject', 'authority'], PROSE_FIELDS)) continue;
    if (!isSymbol(entry.id)) report.fail(inner + '.id', 'identifiant attendu');
    if (!isSymbol(entry.subject)) report.fail(inner + '.subject', 'sujet symbolique attendu');
    if (!registry.references.has(entry.authority)) {
      report.fail(inner + '.authority', 'référence pendante : ' + String(entry.authority));
    }
  }
  for (const [index, entry] of (node.open_human_gates || []).entries()) {
    const inner = path + '.open_human_gates[' + index + ']';
    if (!keys(report, inner, entry, ['id', 'subject'], PROSE_FIELDS)) continue;
    if (!isSymbol(entry.id)) report.fail(inner + '.id', 'identifiant attendu');
    if (!isSymbol(entry.subject)) report.fail(inner + '.subject', 'sujet symbolique attendu');
  }
  if (node.deterministic_consequences !== undefined) {
    if (!Array.isArray(node.deterministic_consequences)) {
      report.fail(path + '.deterministic_consequences', 'liste attendue');
    } else {
      for (const [index, entry] of node.deterministic_consequences.entries()) {
        if (!registry.nextConsequences.has(entry)) {
          report.fail(
            path + '.deterministic_consequences[' + index + ']',
            'conséquence suivante pendante : ' + String(entry),
          );
        }
      }
    }
  }
}

function terminalOutcome(report, path, node, registry) {
  if (
    !keys(
      report,
      path,
      node,
      ['label', 'valid_when', 'partial_state_allowed', 'reached_state_must_be_preserved', 'next'],
      ['post_state', ...PROSE_FIELDS],
    )
  ) {
    return;
  }
  if (!isSymbol(node.label)) report.fail(path + '.label', 'étiquette symbolique attendue');
  if (isObject(node.valid_when) && node.valid_when.branch !== undefined) {
    if (!keys(report, path + '.valid_when', node.valid_when, ['branch'], [])) {
      // keys a déjà signalé
    } else if (!registry.branches.has(node.valid_when.branch)) {
      report.fail(path + '.valid_when.branch', 'branche pendante : ' + String(node.valid_when.branch));
    }
  } else {
    predicate(report, path + '.valid_when', node.valid_when, registry);
  }
  if (typeof node.partial_state_allowed !== 'boolean') {
    report.fail(path + '.partial_state_allowed', 'bool attendu');
  }
  if (typeof node.reached_state_must_be_preserved !== 'boolean') {
    report.fail(path + '.reached_state_must_be_preserved', 'bool attendu');
  }
  if (!registry.nextConsequences.has(node.next)) {
    report.fail(path + '.next', 'conséquence suivante pendante : ' + String(node.next));
  }
  for (const [index, entry] of (node.post_state || []).entries()) {
    contentRequirement(report, path + '.post_state[' + index + ']', entry, registry);
  }
}

function returnField(report, path, node, registry) {
  if (
    !keys(
      report,
      path,
      node,
      ['id', 'fact', 'acquisition', 'value_type'],
      ['predetermined_value', 'allowed_values', ...PROSE_FIELDS],
    )
  ) {
    return;
  }
  if (!isSymbol(node.id)) report.fail(path + '.id', 'identifiant attendu');
  if (!isSymbol(node.fact)) report.fail(path + '.fact', 'fait symbolique attendu');
  enumeration(report, path + '.acquisition', node.acquisition, ACQUISITIONS);
  enumeration(report, path + '.value_type', node.value_type, RETURN_VALUE_TYPES);

  if (node.acquisition === 'PREDETERMINED') {
    if (node.predetermined_value === undefined) {
      report.fail(path + '.predetermined_value', 'PREDETERMINED exige une valeur fixée');
    } else {
      value(report, path + '.predetermined_value', node.predetermined_value, registry);
    }
  } else if (node.predetermined_value !== undefined) {
    report.fail(path + '.predetermined_value', 'une valeur MEASURED n’est pas fixée par le contrat');
  }

  if (node.allowed_values !== undefined) {
    value(report, path + '.allowed_values', node.allowed_values, registry);
    if (isObject(node.allowed_values) && node.allowed_values.type !== 'SET') {
      report.fail(path + '.allowed_values.type', 'allowed_values : SET attendu');
    }
  }
}

function nextConsequence(report, path, node, registry) {
  if (!keys(report, path, node, ['id', 'kind', 'action'], ['target', 'no_new_gate', ...PROSE_FIELDS])) return;
  if (!isSymbol(node.id)) report.fail(path + '.id', 'identifiant attendu');
  enumeration(report, path + '.kind', node.kind, NEXT_KINDS);
  if (!isActionId(node.action)) {
    report.fail(path + '.action', 'identifiant d’action atomique attendu (A-Z, chiffres, _)');
  }
  if (node.target !== undefined) targetRef(report, path + '.target', node.target, registry);
  if (node.no_new_gate !== undefined && typeof node.no_new_gate !== 'boolean') {
    report.fail(path + '.no_new_gate', 'bool attendu');
  }
}

function standingConstraint(report, path, node, registry) {
  if (!keys(report, path, node, ['id', 'constraint', 'release_condition'], PROSE_FIELDS)) return;
  if (!isSymbol(node.id)) report.fail(path + '.id', 'identifiant attendu');
  effect(report, path + '.constraint', node.constraint, registry);
  predicate(report, path + '.release_condition', node.release_condition, registry);
}

/* ------------------------------------------------------------------ *
 * Validation complète
 * ------------------------------------------------------------------ */

function buildRegistry(object) {
  const collect = (list) => {
    const set = new Set();
    for (const entry of list || []) {
      if (entry !== null && typeof entry === 'object' && typeof entry.id === 'string') set.add(entry.id);
    }
    return set;
  };
  const steps = collect(object.procedure ? object.procedure.steps : []);
  for (const item of object.branches || []) {
    if (item !== null && typeof item === 'object') {
      for (const id of collect(item.steps)) steps.add(id);
    }
  }
  const effects = collect(object.effects);
  for (const item of object.branches || []) {
    if (item !== null && typeof item === 'object') {
      for (const id of collect(item.effects)) effects.add(id);
    }
  }
  const outcomes = new Set();
  for (const entry of object.terminal_outcomes || []) {
    if (entry !== null && typeof entry === 'object' && typeof entry.label === 'string') outcomes.add(entry.label);
  }
  return {
    references: collect(object.references),
    effects,
    gates: collect(object.gates),
    stopRules: collect(object.stop_rules),
    branches: collect(object.branches),
    steps,
    evidence: collect(object.evidence_requirements),
    returnFields: collect(object.return_contract),
    nextConsequences: collect(object.next_consequences),
    outcomes,
  };
}

export function validate(object) {
  const report = new Report();
  if (object === null || typeof object !== 'object' || Array.isArray(object)) {
    report.fail('', 'un Mission Object est un objet JSON');
    return { ok: false, errors: report.errors };
  }

  for (const key of Object.keys(object)) {
    if (FORBIDDEN_PROSE_FIELDS.includes(key)) {
      report.fail(key, 'champ de prose normative interdit : aucun second canal normatif');
    } else if (!ROOT_ELEMENTS.includes(key)) {
      report.fail(key, 'élément de premier niveau inconnu : le schéma est clos');
    }
  }
  for (const key of ROOT_REQUIRED) {
    if (object[key] === undefined) report.fail(key, 'élément requis absent');
  }

  const registry = buildRegistry(object);

  if (object.identity !== undefined) {
    if (keys(report, 'identity', object.identity, ['id', 'class', 'addressee', 'target_project'], ['facets'])) {
      for (const key of ['id', 'class', 'addressee', 'target_project']) {
        if (!isSymbol(object.identity[key])) report.fail('identity.' + key, 'symbole attendu');
      }
      if (object.identity.facets !== undefined) {
        if (!Array.isArray(object.identity.facets) || object.identity.facets.length === 0) {
          report.fail('identity.facets', 'liste non vide attendue');
        } else {
          for (const [index, entry] of object.identity.facets.entries()) {
            if (!isSymbol(entry)) report.fail('identity.facets[' + index + ']', 'symbole attendu');
          }
        }
      }
    }
  }

  for (const [index, entry] of (object.context || []).entries()) {
    const path = 'context[' + index + ']';
    if (!keys(report, path, entry, ['subject', 'value', 'semantics_unresolved'], PROSE_FIELDS)) continue;
    if (!isSymbol(entry.subject)) report.fail(path + '.subject', 'sujet symbolique attendu');
    value(report, path + '.value', entry.value, registry);
    if (typeof entry.semantics_unresolved !== 'boolean') {
      report.fail(path + '.semantics_unresolved', 'bool attendu');
    }
  }

  for (const [index, entry] of (object.references || []).entries()) {
    reference(report, 'references[' + index + ']', entry);
  }
  idList(object.references || [], 'de référence', report, 'references');

  for (const [index, entry] of (object.effects || []).entries()) {
    effect(report, 'effects[' + index + ']', entry, registry);
  }
  idList(object.effects || [], 'd’effet', report, 'effects');

  for (const [index, entry] of (object.content_requirements || []).entries()) {
    contentRequirement(report, 'content_requirements[' + index + ']', entry, registry);
  }
  idList(object.content_requirements || [], 'd’exigence', report, 'content_requirements');

  if (object.procedure !== undefined) {
    if (keys(report, 'procedure', object.procedure, ['strict_order', 'steps'], [])) {
      if (typeof object.procedure.strict_order !== 'boolean') {
        report.fail('procedure.strict_order', 'bool attendu');
      }
      if (!Array.isArray(object.procedure.steps) || object.procedure.steps.length === 0) {
        report.fail('procedure.steps', 'liste non vide attendue');
      } else {
        const orders = [];
        for (const [index, entry] of object.procedure.steps.entries()) {
          step(report, 'procedure.steps[' + index + ']', entry, registry);
          if (isObject(entry) && Number.isInteger(entry.order)) orders.push(entry.order);
        }
        const sorted = [...orders].sort((a, b) => a - b);
        if (JSON.stringify(orders) !== JSON.stringify(sorted)) {
          report.fail('procedure.steps', 'les étapes sont déclarées dans l’ordre de order');
        }
        if (new Set(orders).size !== orders.length) {
          report.fail('procedure.steps', 'deux étapes ne peuvent pas porter le même order');
        }
      }
    }
  }

  for (const [index, entry] of (object.gates || []).entries()) {
    gate(report, 'gates[' + index + ']', entry, registry);
  }
  idList(object.gates || [], 'de porte', report, 'gates');

  for (const [index, entry] of (object.stop_rules || []).entries()) {
    stopRule(report, 'stop_rules[' + index + ']', entry, registry);
  }
  idList(object.stop_rules || [], 'd’arrêt', report, 'stop_rules');

  for (const [index, entry] of (object.branches || []).entries()) {
    branch(report, 'branches[' + index + ']', entry, registry);
  }
  idList(object.branches || [], 'de branche', report, 'branches');

  if (object.human_authority !== undefined) {
    humanAuthority(report, 'human_authority', object.human_authority, registry);
  }

  for (const [index, entry] of (object.evidence_requirements || []).entries()) {
    evidenceRequirement(report, 'evidence_requirements[' + index + ']', entry, registry);
  }
  idList(object.evidence_requirements || [], 'de preuve', report, 'evidence_requirements');

  for (const [index, entry] of (object.terminal_outcomes || []).entries()) {
    terminalOutcome(report, 'terminal_outcomes[' + index + ']', entry, registry);
  }

  if (object.return_contract !== undefined) {
    if (!Array.isArray(object.return_contract) || object.return_contract.length === 0) {
      report.fail('return_contract', 'liste non vide attendue');
    } else {
      for (const [index, entry] of object.return_contract.entries()) {
        returnField(report, 'return_contract[' + index + ']', entry, registry);
      }
      idList(object.return_contract, 'de champ de retour', report, 'return_contract');
    }
  }

  for (const [index, entry] of (object.next_consequences || []).entries()) {
    nextConsequence(report, 'next_consequences[' + index + ']', entry, registry);
  }
  idList(object.next_consequences || [], 'de conséquence', report, 'next_consequences');

  for (const [index, entry] of (object.standing_constraints || []).entries()) {
    standingConstraint(report, 'standing_constraints[' + index + ']', entry, registry);
  }
  idList(object.standing_constraints || [], 'de contrainte permanente', report, 'standing_constraints');

  if (object.terminal !== undefined) {
    if (keys(report, 'terminal', object.terminal, ['halt_after_return'], [])) {
      if (object.terminal.halt_after_return !== true) {
        report.fail('terminal.halt_after_return', 'true attendu : la mission s’arrête au retour');
      }
    }
  }

  return { ok: report.ok, errors: report.errors };
}
