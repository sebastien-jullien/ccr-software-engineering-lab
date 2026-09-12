/**
 * TOOLING-EXPERIMENT-002 — tests unitaires du chargeur, du validateur et du
 * rendu.
 *
 * Ils qualifient le comportement du logiciel, et rien d'autre.
 *
 * Les cas négatifs portent tous sur une violation du schéma gelé par
 * l'autorité 14. Aucune validation spéculative n'est ajoutée au-delà.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { MissionObjectError, PROSE_FIELDS, elementIndex, parse, resolveReference, stripProse } from '../mission-object.mjs';
import { validate } from '../validate.mjs';
import { render } from '../render.mjs';

/** Objet minimal valide : la plus petite mission représentable. */
function base() {
  return {
    identity: {
      id: 'minimal',
      class: 'TEST',
      addressee: 'AGENT_CCR_LAB_1',
      target_project: 'CCR_SOFTWARE_ENGINEERING_LAB',
    },
    references: [
      {
        id: 'r1',
        role: 'AUTHORITY',
        locator: { kind: 'REPO_PATH', value: 'x.md' },
        identity_required: false,
      },
    ],
    effects: [{ id: 'e1', mode: 'REQUIRED', action: 'DO_THING', cardinality: 1 }],
    return_contract: [{ id: 'rf1', fact: 'mission.outcome', acquisition: 'MEASURED', value_type: 'SCALAR' }],
    terminal: { halt_after_return: true },
  };
}

function messages(object) {
  return validate(object).errors.map((entry) => entry.path + ' :: ' + entry.message);
}

function rejects(object, fragment) {
  const result = validate(object);
  assert.equal(result.ok, false, 'accepté alors qu’il devait être refusé');
  const joined = messages(object).join(' | ');
  assert.ok(joined.includes(fragment), 'message attendu contenant « ' + fragment + ' », obtenu : ' + joined);
}

/* ------------------------------------------------------------------ *
 * Chargement
 * ------------------------------------------------------------------ */

test('un JSON illisible est refusé sans exception opaque', () => {
  assert.throws(() => parse('{'), MissionObjectError);
});

test('un tableau JSON n’est pas un Mission Object', () => {
  assert.throws(() => parse('[]'), MissionObjectError);
});

test('l’objet minimal est valide', () => {
  const result = validate(base());
  assert.deepEqual(result.errors, []);
  assert.equal(result.ok, true);
});

/* ------------------------------------------------------------------ *
 * Cas négatifs — schéma clos
 * ------------------------------------------------------------------ */

test('champ de premier niveau inconnu', () => {
  const object = base();
  object.orchestration = { agents: 3 };
  rejects(object, 'élément de premier niveau inconnu');
});

test('champ inconnu dans un élément', () => {
  const object = base();
  object.effects[0].priority = 1;
  rejects(object, 'champ inconnu');
});

test('valeur hors vocabulaire fermé', () => {
  const object = base();
  object.effects[0].mode = 'ENCOURAGED';
  rejects(object, 'valeur hors vocabulaire fermé');
});

test('kind et polarity incompatibles : PRESERVE porteur d’une polarité', () => {
  const object = base();
  object.content_requirements = [
    { id: 'cr1', scope: 'MISSION', target: 'r1', kind: 'PRESERVE', polarity: 'ASSERT', subject: 's' },
  ];
  rejects(object, 'la polarité n’appartient qu’à CLAIM');
});

test('kind CLAIM sans polarité', () => {
  const object = base();
  object.content_requirements = [
    {
      id: 'cr1',
      scope: 'MISSION',
      target: 'r1',
      kind: 'CLAIM',
      subject: 's',
      relation: 'EQUALS',
      value: { type: 'SYMBOL', value: 'X' },
    },
  ];
  rejects(object, 'CLAIM exige une polarité');
});

test('relation et valeur incompatibles', () => {
  const object = base();
  object.content_requirements = [
    {
      id: 'cr1',
      scope: 'MISSION',
      target: 'r1',
      kind: 'CLAIM',
      polarity: 'ASSERT',
      subject: 's',
      relation: 'SET_EQUALS',
      value: { type: 'SYMBOL', value: 'X' },
    },
  ];
  rejects(object, 'la relation SET_EQUALS exige SET');
});

test('valeur typée invalide', () => {
  const object = base();
  object.content_requirements = [
    {
      id: 'cr1',
      scope: 'MISSION',
      target: 'r1',
      kind: 'CLAIM',
      polarity: 'ASSERT',
      subject: 's',
      relation: 'EQUALS',
      value: { type: 'TEXTE_LIBRE', value: 'X' },
    },
  ];
  rejects(object, 'valeur hors vocabulaire fermé');
});

test('seul PRESERVE peut se passer de relation et de valeur', () => {
  const object = base();
  object.content_requirements = [
    { id: 'cr1', scope: 'MISSION', target: 'r1', kind: 'CLAIM', polarity: 'ASSERT', subject: 's' },
  ];
  rejects(object, 'seul PRESERVE peut se passer');
});

test('opérateur de prédicat invalide', () => {
  const object = base();
  object.gates = [
    {
      id: 'g1',
      scope: 'ALL_PRECEDING',
      predicate: { op: 'MATCHES', subject: { kind: 'REPO_FACT', ref: 'HEAD' }, value: { type: 'SCALAR', value: 'x' } },
      on_fail: 'sr1',
    },
  ];
  object.stop_rules = [
    {
      id: 'sr1',
      trigger: { op: 'EQ', subject: { kind: 'REPO_FACT', ref: 'HEAD' }, value: { type: 'SCALAR', value: 'x' } },
      prohibitions: [{ id: 'p1', mode: 'FORBIDDEN', action: 'EDIT' }],
      required: ['REPORT'],
      terminal: 'STOP',
    },
  ];
  rejects(object, 'valeur hors vocabulaire fermé');
});

test('composition de prédicat autre que all_of', () => {
  const object = base();
  object.gates = [
    {
      id: 'g1',
      scope: 'ALL_PRECEDING',
      predicate: { any_of: [] },
      on_fail: 'sr1',
    },
  ];
  object.stop_rules = [
    {
      id: 'sr1',
      trigger: { op: 'EQ', subject: { kind: 'REPO_FACT', ref: 'HEAD' }, value: { type: 'SCALAR', value: 'x' } },
      prohibitions: [{ id: 'p1', mode: 'FORBIDDEN', action: 'EDIT' }],
      required: ['REPORT'],
      terminal: 'STOP',
    },
  ];
  rejects(object, 'champ inconnu');
});

test('sélecteur field sur un genre de sujet qui ne l’admet pas', () => {
  const object = base();
  object.gates = [
    {
      id: 'g1',
      scope: 'ALL_PRECEDING',
      predicate: {
        op: 'EQ',
        subject: { kind: 'REPO_FACT', ref: 'HEAD', field: 'sha' },
        value: { type: 'SCALAR', value: 'x' },
      },
      on_fail: 'sr1',
    },
  ];
  object.stop_rules = [
    {
      id: 'sr1',
      trigger: { op: 'EQ', subject: { kind: 'REPO_FACT', ref: 'HEAD' }, value: { type: 'SCALAR', value: 'x' } },
      prohibitions: [{ id: 'p1', mode: 'FORBIDDEN', action: 'EDIT' }],
      required: ['REPORT'],
      terminal: 'STOP',
    },
  ];
  rejects(object, 'sélecteur field interdit pour le genre REPO_FACT');
});

test('field composé : aucun langage de chemin', () => {
  const object = base();
  object.gates = [
    {
      id: 'g1',
      scope: 'ALL_PRECEDING',
      predicate: {
        op: 'EQ',
        subject: { kind: 'OPERATION_RESULT', ref: 'e1', field: 'result.exit' },
        value: { type: 'SCALAR', value: 0 },
      },
      on_fail: 'sr1',
    },
  ];
  object.stop_rules = [
    {
      id: 'sr1',
      trigger: { op: 'EQ', subject: { kind: 'REPO_FACT', ref: 'HEAD' }, value: { type: 'SCALAR', value: 'x' } },
      prohibitions: [{ id: 'p1', mode: 'FORBIDDEN', action: 'EDIT' }],
      required: ['REPORT'],
      terminal: 'STOP',
    },
  ];
  rejects(object, 'un seul niveau');
});

test('forme de référence invalide', () => {
  const object = base();
  object.references[0].locator = { kind: 'HTTP_URL', value: 'https://example.invalid' };
  rejects(object, 'valeur hors vocabulaire fermé');
});

test('identity_required sans identité', () => {
  const object = base();
  object.references[0].identity_required = true;
  rejects(object, 'identity_required exige une identité');
});

test('référence croisée pendante', () => {
  const object = base();
  object.content_requirements = [
    { id: 'cr1', scope: 'MISSION', target: 'r-inconnue', kind: 'PRESERVE', subject: 's' },
  ];
  rejects(object, 'référence pendante');
});

test('clé inconnue dans effect.constraints', () => {
  const object = base();
  object.effects[0].constraints = { retire: 'ancienne-preuve' };
  rejects(object, 'champ inconnu');
});

test('staged_paths du mauvais type', () => {
  const object = base();
  object.effects[0].constraints = { staged_paths: 'PROGRAM-STATE.json' };
  rejects(object, 'SET<SCALAR>');
});

test('ff_only du mauvais type', () => {
  const object = base();
  object.effects[0].constraints = { ff_only: 'true' };
  rejects(object, 'type attendu : bool');
});

test('PERMITTED_AFTER_GATE sans porte', () => {
  const object = base();
  object.effects[0].mode = 'PERMITTED_AFTER_GATE';
  rejects(object, 'PERMITTED_AFTER_GATE exige gated_by');
});

test('porte pendante', () => {
  const object = base();
  object.effects[0].mode = 'PERMITTED_AFTER_GATE';
  object.effects[0].gated_by = 'g-inexistante';
  rejects(object, 'porte pendante');
});

test('branche pendante dans un résultat terminal', () => {
  const object = base();
  object.next_consequences = [{ id: 'nc1', kind: 'DETERMINED', action: 'GO' }];
  object.terminal_outcomes = [
    {
      label: 'PASS',
      valid_when: { branch: 'Z' },
      partial_state_allowed: false,
      reached_state_must_be_preserved: true,
      next: 'nc1',
    },
  ];
  rejects(object, 'branche pendante');
});

test('résultat terminal pendant dans une branche', () => {
  const object = base();
  object.next_consequences = [{ id: 'nc1', kind: 'DETERMINED', action: 'GO' }];
  object.branches = [
    {
      id: 'A',
      condition: { op: 'EQ', subject: { kind: 'OPERATION_RESULT', ref: 'e1', field: 'ok' }, value: { type: 'SCALAR', value: true } },
      terminal_outcome: 'INEXISTANT',
      next: 'nc1',
    },
  ];
  rejects(object, 'résultat terminal pendant');
});

test('une règle d’arrêt ne peut pas déclarer un résultat terminal de mission', () => {
  const object = base();
  object.stop_rules = [
    {
      id: 'sr1',
      trigger: { op: 'NEQ', subject: { kind: 'OPERATION_RESULT', ref: 'e1', field: 'exit' }, value: { type: 'SCALAR', value: 0 } },
      prohibitions: [{ id: 'p1', mode: 'FORBIDDEN', action: 'REPAIR' }],
      required: ['REPORT'],
      terminal: 'STOP',
      sets: { terminal_outcome: 'NOT_PASS' },
    },
  ];
  rejects(object, 'champ inconnu');
});

test('une interdiction d’arrêt doit être FORBIDDEN', () => {
  const object = base();
  object.stop_rules = [
    {
      id: 'sr1',
      trigger: { op: 'NEQ', subject: { kind: 'OPERATION_RESULT', ref: 'e1', field: 'exit' }, value: { type: 'SCALAR', value: 0 } },
      prohibitions: [{ id: 'p1', mode: 'PERMITTED', action: 'REPAIR' }],
      required: ['REPORT'],
      terminal: 'STOP',
    },
  ];
  rejects(object, 'une interdiction d’arrêt est FORBIDDEN');
});

test('acquisition PREDETERMINED sans valeur fixée', () => {
  const object = base();
  object.return_contract[0].acquisition = 'PREDETERMINED';
  rejects(object, 'PREDETERMINED exige une valeur fixée');
});

test('valeur fixée sur un champ MEASURED', () => {
  const object = base();
  object.return_contract[0].predetermined_value = { type: 'SCALAR', value: 'x' };
  rejects(object, 'n’est pas fixée par le contrat');
});

test('ENUM n’est pas un mode d’acquisition', () => {
  const object = base();
  object.return_contract[0].acquisition = 'ENUM';
  rejects(object, 'valeur hors vocabulaire fermé');
});

test('absence_allowed n’existe pas', () => {
  const object = base();
  object.return_contract[0].absence_allowed = true;
  rejects(object, 'champ inconnu');
});

test('type de valeur de retour hors du vocabulaire retenu', () => {
  const object = base();
  object.return_contract[0].value_type = 'SEQUENCE';
  rejects(object, 'valeur hors vocabulaire fermé');
});

test('champ de prose normative refusé nommément', () => {
  const object = base();
  object.prompt = 'fais ce que tu juges bon';
  rejects(object, 'champ de prose normative interdit');
});

test('champ de prose normative refusé au sein d’un élément', () => {
  const object = base();
  object.effects[0].instructions = 'et aussi, pousse';
  rejects(object, 'champ de prose normative interdit');
});

test('forme de conséquence suivante invalide', () => {
  const object = base();
  object.next_consequences = [{ id: 'nc1', kind: 'PEUT_ÊTRE', action: 'GO' }];
  rejects(object, 'valeur hors vocabulaire fermé');
});

test('identifiant d’action non atomique', () => {
  const object = base();
  object.next_consequences = [{ id: 'nc1', kind: 'DETERMINED', action: 'implement then design' }];
  rejects(object, 'identifiant d’action atomique attendu');
});

test('contrainte permanente malformée', () => {
  const object = base();
  object.standing_constraints = [{ id: 'sc1', constraint: { id: 'x', mode: 'FORBIDDEN' } }];
  rejects(object, 'champ requis absent');
});

test('terminal doit arrêter la mission', () => {
  const object = base();
  object.terminal.halt_after_return = false;
  rejects(object, 'la mission s’arrête au retour');
});

test('étapes déclarées hors de leur ordre', () => {
  const object = base();
  object.procedure = {
    strict_order: true,
    steps: [
      { order: 2, id: 's2', effect: 'e1', atomic: true },
      { order: 1, id: 's1', effect: 'e1', atomic: true },
    ],
  };
  rejects(object, 'dans l’ordre de order');
});

test('identifiant dupliqué', () => {
  const object = base();
  object.effects.push({ id: 'e1', mode: 'FORBIDDEN', action: 'OTHER' });
  rejects(object, 'dupliqué');
});

/* ------------------------------------------------------------------ *
 * Discipline de l'identifiant opaque
 * ------------------------------------------------------------------ */

test('le validateur n’interprète jamais le sens d’un identifiant d’action', () => {
  for (const action of ['COMMIT', 'DESIGN', 'IMPLEMENT', 'DECIDE', 'XYZZY', 'FAIRE_QUELQUE_CHOSE']) {
    const object = base();
    object.effects[0].action = action;
    assert.deepEqual(validate(object).errors, [], 'action refusée sur son seul nom : ' + action);
  }
});

test('COMMIT n’acquiert aucune exigence implicite', () => {
  const object = base();
  object.effects[0].action = 'COMMIT';
  assert.equal(validate(object).ok, true, 'une contrainte implicite a été déduite du nom COMMIT');
});

test('le rendu émet l’identifiant d’action verbatim', () => {
  const object = base();
  object.effects[0].action = 'XYZZY';
  assert.ok(render(object).text.includes('XYZZY'));
});

/* ------------------------------------------------------------------ *
 * Prose et résolution
 * ------------------------------------------------------------------ */

test('la prose est admise et ne porte aucune norme', () => {
  const object = base();
  for (const field of PROSE_FIELDS) object.effects[0][field] = 'commentaire humain';
  assert.equal(validate(object).ok, true);
  const stripped = stripProse(object);
  for (const field of PROSE_FIELDS) assert.equal(stripped.effects[0][field], undefined);
  assert.equal(validate(stripped).ok, true);
});

test('la prose n’est jamais autre chose qu’une chaîne', () => {
  const object = base();
  object.effects[0].label = { texte: 'non' };
  rejects(object, 'la prose non normative est une chaîne');
});

test('une référence de qualification absente ne résout rien', () => {
  const object = base();
  const index = elementIndex(object);
  assert.equal(resolveReference(object, 'e1', index).element, 'effects[0]');
  assert.equal(resolveReference(object, 'e1#cardinality', index).value, 1);
  assert.equal(resolveReference(object, 'e1#inexistant', index), undefined);
  assert.equal(resolveReference(object, 'inexistant', index), undefined);
});
