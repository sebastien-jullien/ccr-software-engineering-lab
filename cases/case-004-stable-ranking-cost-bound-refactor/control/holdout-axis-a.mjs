/**
 * CASE-004 — Holdouts de l'axe A, A-H1..A-H8.
 *
 * MATÉRIEL DE CONTROL — AVEUGLE jusqu'à la clôture intellectuelle.
 * L'implémentation sous test est fournie par un chargeur paresseux : son
 * absence fait échouer les holdouts un par un, jamais le chargement de la suite.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

const ok = (condition, message) => { if (!condition) throw new Error(message); };
const byKey = (a, b) => a.k - b.k;
const obj = (k, id) => ({ k, id });

function oracle(items, keyOf) {
  return items
    .map((element, index) => ({ element, index, key: keyOf(element) }))
    .sort((x, y) => (x.key - y.key) || (x.index - y.index))
    .map((entry) => entry.element);
}

function unchangedContainer(input, snapshot) {
  ok(input.length === snapshot.length, 'BC2 longueur entrée');
  for (let i = 0; i < snapshot.length; i += 1) ok(input[i] === snapshot[i], 'BC2 élément entrée ' + i);
}

function sameMultiset(result, input) {
  ok(result.length === input.length, 'BC4 cardinalité');
  const seen = new Map();
  for (const e of input) seen.set(e, (seen.get(e) ?? 0) + 1);
  for (const e of result) {
    const n = seen.get(e);
    ok(n !== undefined && n > 0, 'BC4 référence absente de l’entrée');
    seen.set(e, n - 1);
  }
  for (const n of seen.values()) ok(n === 0, 'BC4 multiplicité');
}

function originatesFromInput(value, input) {
  for (let i = 0; i < input.length; i += 1) if (Object.is(value, input[i])) return true;
  return false;
}

function trackingComparator(compare, input, seen) {
  return (l, r) => {
    ok(originatesFromInput(l, input), 'BC11 argument gauche hors positions d’entrée');
    ok(originatesFromInput(r, input), 'BC11 argument droit hors positions d’entrée');
    seen.push(l, r);
    return compare(l, r);
  };
}

export function defineAxisAHoldouts({ label, load }) {
  const named = (id, title) => `${id} [${label}] — ${title}`;
  const rank = async () => (await load()).stableRank;

  test(named('A-H1', 'toutes les positions équivalentes'), async () => {
    const stableRank = await rank();
    const input = Array.from({ length: 12 }, (_, i) => obj(7, 'e' + i));
    const r = stableRank(input, byKey);
    ok(r.length === input.length, 'cardinalité');
    for (let i = 0; i < input.length; i += 1) ok(r[i] === input[i], 'BC6 ordre d’entrée position ' + i);
  });

  test(named('A-H2', 'classes d’équivalence alternées'), async () => {
    const stableRank = await rank();
    const input = Array.from({ length: 16 }, (_, i) => obj(i % 2, 'e' + i));
    const r = stableRank(input, byKey);
    const expected = oracle(input, (e) => e.k);
    for (let i = 0; i < expected.length; i += 1) ok(r[i] === expected[i], 'BC6 position ' + i);
  });

  test(named('A-H3', 'positions dupliquées de la même référence'), async () => {
    const stableRank = await rank();
    const shared = obj(1, 's');
    const input = [shared, obj(0, 'x'), shared, obj(2, 'y'), shared];
    const r = stableRank(input, byKey);
    sameMultiset(r, input);
    ok(r.filter((e) => e === shared).length === 3, 'BC9 trois occurrences distinctes');
    const expected = oracle(input, (e) => e.k);
    for (let i = 0; i < expected.length; i += 1) ok(r[i] === expected[i], 'position ' + i);
  });

  test(named('A-H4', 'magnitudes de signe non unitaires, dont -0'), async () => {
    const stableRank = await rank();
    const input = [obj(1, 'a'), obj(1, 'b'), obj(0, 'c'), obj(1, 'd'), obj(0, 'e')];
    const seen = [];
    const signOnly = (l, r2) => (l.k === r2.k ? -0 : (l.k < r2.k ? -7 : 3));
    const r = stableRank(input, trackingComparator(signOnly, input, seen));
    const expected = oracle(input, (e) => e.k);
    for (let i = 0; i < expected.length; i += 1) ok(r[i] === expected[i], 'BC7 position ' + i);
  });

  test(named('A-H5', 'appels répétés : déterminisme et conteneurs indépendants'), async () => {
    const stableRank = await rank();
    const input = [obj(3, 'a'), obj(1, 'b'), obj(2, 'c'), obj(1, 'd')];
    const snapshot = input.slice();
    const r1 = stableRank(input, byKey);
    const r2 = stableRank(input, byKey);
    ok(r1 !== r2, 'BC10 conteneurs indépendants');
    ok(r1.length === r2.length, 'BC10 cardinalité');
    for (let i = 0; i < r1.length; i += 1) ok(r1[i] === r2[i], 'BC10 déterminisme position ' + i);
    unchangedContainer(input, snapshot);
  });

  test(named('A-H6', 'observation bornée d’écriture à travers les références'), async () => {
    const stableRank = await rank();
    const input = [obj(2, 'a'), obj(1, 'b'), obj(2, 'c'), obj(0, 'd')];
    const before = input.map((e) => ({ keys: Object.keys(e).slice(), k: e.k, id: e.id }));
    const seen = [];
    stableRank(input, trackingComparator(byKey, input, seen));
    for (let i = 0; i < input.length; i += 1) {
      const now = input[i];
      ok(Object.keys(now).join(',') === before[i].keys.join(','), 'BC8 clés inchangées ' + i);
      ok(now.k === before[i].k && now.id === before[i].id, 'BC8 valeurs inchangées ' + i);
    }
    ok(seen.length > 0, 'BC11 le comparateur a bien été appelé');
  });

  test(named('A-H7', 'alias mêlés à des clés égales'), async () => {
    const stableRank = await rank();
    const alias = obj(1, 'A');
    const input = [obj(1, 'p'), alias, obj(0, 'q'), alias, obj(1, 'r'), obj(0, 's')];
    const r = stableRank(input, byKey);
    sameMultiset(r, input);
    const expected = oracle(input, (e) => e.k);
    for (let i = 0; i < expected.length; i += 1) ok(r[i] === expected[i], 'position ' + i);
  });

  test(named('A-H8', 'oracle comportemental dense de plus grande taille'), async () => {
    const stableRank = await rank();
    let s = 1234567;
    const next = () => (s = (s * 1103515245 + 12345) >>> 0);
    const input = Array.from({ length: 200 }, (_, i) => obj(next() % 17, 'e' + i));
    const snapshot = input.slice();
    const r = stableRank(input, byKey);
    const expected = oracle(input, (e) => e.k);
    ok(r.length === 200, 'cardinalité');
    for (let i = 0; i < expected.length; i += 1) ok(r[i] === expected[i], 'position ' + i);
    unchangedContainer(input, snapshot);
  });
}
