/**
 * TOOLING-EXPERIMENT-002 — qualification formelle de l'implémentation v0.
 *
 * Elle qualifie le logiciel et les fixtures, et rien d'autre. Le succès du
 * dogfood réel est une autre question : il n'est pas testable ici, et rien
 * dans ce fichier ne prétend y répondre.
 *
 * Aucun état CCR réel, aucun fournisseur, aucun run protégé, aucun réseau,
 * aucun dépôt Git, aucun modèle de langage, aucune comparaison sémantique
 * approximative.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { elementIndex, load, normativeElements, resolveReference, stripProse } from '../mission-object.mjs';
import { validate } from '../validate.mjs';
import { render, renderCoverage } from '../render.mjs';

const HERE = import.meta.dirname;
const FIXTURES = join(HERE, '..', 'fixtures');

const MANIFEST = JSON.parse(readFileSync(join(HERE, 'coverage-manifest.json'), 'utf8'));

const REFERENCES = [
  { key: 'A', file: 'reference-a.json', clauses: 63 },
  { key: 'B', file: 'reference-b.json', clauses: 68 },
  { key: 'C', file: 'reference-c.json', clauses: 48 },
];

const OBJECTS = new Map(REFERENCES.map((entry) => [entry.key, load(join(FIXTURES, entry.file))]));

const PROSE_LEAVES = ['label', 'rationale'];

/* ------------------------------------------------------------------ *
 * Validité des trois objets de référence
 * ------------------------------------------------------------------ */

for (const entry of REFERENCES) {
  test('fixture ' + entry.key + ' est un Mission Object valide', () => {
    const result = validate(OBJECTS.get(entry.key));
    assert.deepEqual(result.errors, [], 'erreurs de validation');
    assert.equal(result.ok, true);
  });
}

/* ------------------------------------------------------------------ *
 * Couverture d'objet — 179 clauses
 * ------------------------------------------------------------------ */

test('le manifeste couvre exactement les 179 clauses acceptées', () => {
  const clauses = Object.keys(MANIFEST.map);
  assert.equal(MANIFEST.expected_clauses, 179);
  assert.equal(clauses.length, 179, 'clauses mappées');
  for (const entry of REFERENCES) {
    const own = clauses.filter((clause) => clause.startsWith(entry.key + '-'));
    assert.equal(own.length, entry.clauses, 'clauses de la référence ' + entry.key);
    const expected = own.map((clause) => Number(clause.slice(2)));
    const complete = Array.from({ length: entry.clauses }, (unused, index) => index + 1);
    assert.deepEqual([...expected].sort((a, b) => a - b), complete, 'aucune clause manquante en ' + entry.key);
  }
});

test('chaque clause désigne au moins un élément qui existe réellement', () => {
  const missing = [];
  const empty = [];
  const prose = [];
  for (const [clause, references] of Object.entries(MANIFEST.map)) {
    const object = OBJECTS.get(clause[0]);
    const index = elementIndex(object);
    if (references.length === 0) empty.push(clause);
    for (const reference of references) {
      const resolved = resolveReference(object, reference, index);
      if (resolved === undefined) {
        missing.push(clause + ' → ' + reference);
        continue;
      }
      const leaf = resolved.path.split('.').pop();
      if (PROSE_LEAVES.includes(leaf)) prose.push(clause + ' → ' + reference);
    }
  }
  assert.deepEqual(missing, [], 'références de couverture pendantes');
  assert.deepEqual(empty, [], 'clauses sans élément');
  assert.deepEqual(prose, [], 'aucun crédit de couverture sur de la prose');
});

test('aucune clause ne reçoit de crédit sur un commentaire ou une étiquette seule', () => {
  /* Supprimer toute prose ne doit faire disparaître aucun élément mappé. */
  const lost = [];
  for (const [clause, references] of Object.entries(MANIFEST.map)) {
    const stripped = stripProse(OBJECTS.get(clause[0]));
    const index = elementIndex(stripped);
    for (const reference of references) {
      if (resolveReference(stripped, reference, index) === undefined) lost.push(clause + ' → ' + reference);
    }
  }
  assert.deepEqual(lost, [], 'éléments perdus à la suppression de la prose');
});

test('la duplication ne masque aucun élément normatif inexpliqué', () => {
  /* Un élément normatif non réclamé par une clause n'est admis que s'il est
   * une référence : une référence est une adresse, jamais une clause. */
  for (const entry of REFERENCES) {
    const object = OBJECTS.get(entry.key);
    const index = elementIndex(object);
    const claimed = new Set();
    for (const [clause, references] of Object.entries(MANIFEST.map)) {
      if (clause[0] !== entry.key) continue;
      for (const reference of references) {
        const resolved = resolveReference(object, reference, index);
        if (resolved !== undefined) claimed.add(resolved.element);
      }
    }
    const unclaimed = normativeElements(object).filter((element) => !claimed.has(element.path));
    const wrong = unclaimed.filter((element) => element.kind !== 'reference');
    assert.deepEqual(
      wrong.map((element) => element.path + ' [' + element.kind + ']'),
      [],
      'éléments normatifs non expliqués par une clause en ' + entry.key,
    );
  }
});

/* ------------------------------------------------------------------ *
 * Couverture de rendu
 * ------------------------------------------------------------------ */

for (const entry of REFERENCES) {
  test('couverture de rendu complète pour ' + entry.key, () => {
    const coverage = renderCoverage(OBJECTS.get(entry.key));
    assert.deepEqual(coverage.omitted, [], 'élément normatif silencieusement omis');
    assert.deepEqual(coverage.invented, [], 'élément normatif inventé par le rendu');
    assert.deepEqual(coverage.empty, [], 'élément tracé sans aucune ligne émise');
    assert.equal(coverage.rendered, coverage.expected);
    assert.equal(coverage.complete, true);
  });
}

test('chaque portée tracée émet des lignes réellement présentes dans l’enveloppe', () => {
  for (const entry of REFERENCES) {
    const object = OBJECTS.get(entry.key);
    const { text, trace } = render(object);
    const lines = text.split('\n');
    for (const span of trace) {
      assert.ok(span.to > span.from, 'portée vide : ' + span.path);
      assert.ok(span.to <= lines.length, 'portée hors de l’enveloppe : ' + span.path);
    }
  }
});

/* ------------------------------------------------------------------ *
 * Préservation des sémantiques nommées par l'autorité 14
 * ------------------------------------------------------------------ */

test('ordre, portes, arrêts, branches, succès partiel et retour survivent au rendu', () => {
  const b = OBJECTS.get('B');
  const c = OBJECTS.get('C');
  const renderedB = render(b).text;
  const renderedC = render(c).text;

  for (const step of b.procedure.steps) {
    assert.ok(renderedB.includes(String(step.order) + '. ' + step.id), 'ordre perdu : ' + step.id);
  }
  assert.ok(renderedB.indexOf('s-b036') < renderedB.indexOf('s-b051'), 'ordre relatif perdu');

  for (const gate of b.gates) assert.ok(renderedB.includes(gate.id), 'porte perdue : ' + gate.id);
  for (const rule of b.stop_rules) assert.ok(renderedB.includes(rule.id), 'arrêt perdu : ' + rule.id);
  assert.ok(renderedB.includes('STOP'), 'terminal d’arrêt perdu');

  for (const branch of c.branches) assert.ok(renderedC.includes('BRANCHE ' + branch.id), 'branche perdue');
  for (const outcome of c.terminal_outcomes) assert.ok(renderedC.includes(outcome.label), 'résultat perdu');
  assert.ok(renderedC.includes('état partiel admis            OUI'), 'succès partiel perdu');
  assert.ok(renderedC.includes('état atteint à préserver      OUI'), 'préservation perdue');
  for (const field of c.return_contract) assert.ok(renderedC.includes(field.fact), 'retour perdu : ' + field.fact);
  for (const consequence of c.next_consequences) {
    assert.ok(renderedC.includes(consequence.id), 'conséquence perdue : ' + consequence.id);
  }
});

test('B-037 reste un résultat d’opération et jamais un résultat terminal de mission', () => {
  const b = OBJECTS.get('B');
  const rule = b.stop_rules.find((entry) => entry.id === 'sr-b037');
  assert.equal(rule.trigger.op, 'NEQ');
  assert.equal(rule.trigger.subject.kind, 'OPERATION_RESULT');
  assert.equal(rule.trigger.subject.field, 'exit');
  assert.deepEqual(
    rule.prohibitions.map((entry) => entry.action).sort(),
    ['COMMIT', 'REPAIR', 'RERUN_QUALIFICATION'],
  );
  assert.deepEqual(rule.required, ['REPORT']);
  assert.equal(rule.terminal, 'STOP');
  for (const key of Object.keys(rule)) {
    assert.ok(
      ['id', 'trigger', 'prohibitions', 'required', 'terminal', 'label', 'rationale'].includes(key),
      'une règle d’arrêt ne porte aucun champ de résultat terminal : ' + key,
    );
  }
});

test('la normalisation des mutations d’état de programme n’emploie aucune clé de contraintes métier', () => {
  const business = ['retire', 'install', 'supersede', 'keep_selected', 'detector_state'];
  for (const entry of REFERENCES) {
    const object = OBJECTS.get(entry.key);
    const effects = [...(object.effects || [])];
    for (const branch of object.branches || []) effects.push(...(branch.effects || []));
    for (const rule of object.stop_rules || []) effects.push(...rule.prohibitions);
    for (const constraint of object.standing_constraints || []) effects.push(constraint.constraint);
    for (const effect of effects) {
      for (const key of Object.keys(effect.constraints || {})) {
        assert.ok(!business.includes(key), 'clé métier interdite dans effect.constraints : ' + key);
      }
    }
  }
  /* B-042, B-049 et C-017 vivent bien dans des exigences de contenu. */
  const b = OBJECTS.get('B');
  const c = OBJECTS.get('C');
  const ids = (object) => (object.content_requirements || []).map((entry) => entry.id);
  for (const id of ['cr-b042-retired', 'cr-b042-tool-active', 'cr-b042-tests-active', 'cr-b042-detector']) {
    assert.ok(ids(b).includes(id), 'B-042 : ' + id);
  }
  for (const id of ['cr-b049-old-inactive', 'cr-b049-new-active', 'cr-b049-state-selected']) {
    assert.ok(ids(b).includes(id), 'B-049 : ' + id);
  }
  for (const id of ['cr-c017-superseded', 'cr-c017-replacement']) {
    assert.ok(ids(c).includes(id), 'C-017 : ' + id);
  }
});

/* ------------------------------------------------------------------ *
 * Déterminisme
 * ------------------------------------------------------------------ */

test('rendre deux fois le même objet donne des octets identiques', () => {
  for (const entry of REFERENCES) {
    const object = OBJECTS.get(entry.key);
    assert.equal(render(object).text, render(object).text, 'rendu non déterministe pour ' + entry.key);
  }
});

test('recharger l’objet depuis ses octets donne le même rendu', () => {
  for (const entry of REFERENCES) {
    const first = render(load(join(FIXTURES, entry.file))).text;
    const second = render(load(join(FIXTURES, entry.file))).text;
    assert.equal(first, second);
  }
});

test('le rendu ne dépend d’aucun état d’environnement étranger', () => {
  const object = OBJECTS.get('C');
  const before = render(object).text;
  const saved = { TZ: process.env.TZ, LANG: process.env.LANG, IRRELEVANT: process.env.CCR_LAB_IRRELEVANT };
  process.env.TZ = 'Pacific/Kiritimati';
  process.env.LANG = 'tlh_KL.UTF-8';
  process.env.CCR_LAB_IRRELEVANT = 'bruit';
  const previousCwd = process.cwd();
  try {
    const after = render(object).text;
    assert.equal(after, before);
    assert.equal(process.cwd(), previousCwd);
  } finally {
    if (saved.TZ === undefined) delete process.env.TZ;
    else process.env.TZ = saved.TZ;
    if (saved.LANG === undefined) delete process.env.LANG;
    else process.env.LANG = saved.LANG;
    delete process.env.CCR_LAB_IRRELEVANT;
  }
});

test('aucune date, aucune heure et aucun aléa n’est inséré dans l’enveloppe', () => {
  for (const entry of REFERENCES) {
    const text = render(OBJECTS.get(entry.key)).text;
    assert.equal(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(text), false, 'horodatage inséré en ' + entry.key);
    assert.equal(/GMT|UTC[+-]/.test(text), false, 'fuseau inséré en ' + entry.key);
  }
});

/* ------------------------------------------------------------------ *
 * Politique de texte libre
 * ------------------------------------------------------------------ */

test('supprimer toute prose laisse un objet valide et le même contrat normatif', () => {
  for (const entry of REFERENCES) {
    const object = OBJECTS.get(entry.key);
    const stripped = stripProse(object);
    const result = validate(stripped);
    assert.deepEqual(result.errors, [], 'objet dépouillé invalide en ' + entry.key);

    const before = normativeElements(object).map((element) => element.path + ' ' + element.kind);
    const after = normativeElements(stripped).map((element) => element.path + ' ' + element.kind);
    assert.deepEqual(after, before, 'contrat normatif modifié par la suppression de prose en ' + entry.key);

    const tracedBefore = render(object).trace.map((span) => span.path);
    const tracedAfter = render(stripped).trace.map((span) => span.path);
    assert.deepEqual(tracedAfter, tracedBefore, 'couverture de rendu modifiée par la prose en ' + entry.key);
  }
});

test('aucune fixture ne contient de champ de prose normative', () => {
  const forbidden = ['prompt', 'instructions', 'normative_notes', 'raw_mission', 'escape_hatch', 'mission_text', 'directives'];
  const walk = (value, path) => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => walk(item, path + '[' + index + ']'));
      return;
    }
    if (value === null || typeof value !== 'object') return;
    for (const key of Object.keys(value)) {
      assert.equal(forbidden.includes(key), false, 'champ de prose normative : ' + path + '.' + key);
      walk(value[key], path + '.' + key);
    }
  };
  for (const entry of REFERENCES) walk(OBJECTS.get(entry.key), entry.key);
});
