/**
 * CASE-004 — Contrôles visibles.
 *
 * A-V1..A-V8 : axe A, comportement. A-V9 est la sonde de compilation
 * `consumer-v1.ts`, qui se vérifie par typecheck et non ici.
 * V10..V11    : axe B, borne de travail comparateur. Ces deux contrôles
 *               n'affirment que le coût, jamais l'ordre ni la stabilité.
 *
 * Les contrôles de l'axe A passent sur le point de départ. Ceux de l'axe B
 * échouent : c'est l'exigence d'optimisation, pas un défaut.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import { stableRank } from '../src/stable-rank.ts';

const ok = (condition, message) => { if (!condition) throw new Error(message); };
const byKey = (a, b) => a.k - b.k;
const num = (a, b) => a - b;
const obj = (k, id) => ({ k, id });

/** ceil(log2 n) en arithmétique entière exacte, n >= 2. */
const ceilLog2 = (n) => 32 - Math.clz32(n - 1);
const bound = (n) => n * ceilLog2(n);

/** Oracle stable indépendant du candidat : décoration (clé, position). */
function oracle(items, keyOf) {
  return items
    .map((element, index) => ({ element, index, key: keyOf(element) }))
    .sort((x, y) => (x.key - y.key) || (x.index - y.index))
    .map((entry) => entry.element);
}

function freshOrdinaryArray(result, input) {
  ok(Array.isArray(result), 'BC3 Array.isArray');
  ok(Object.getPrototypeOf(result) === Array.prototype, 'BC3 prototype');
  ok(Object.isExtensible(result), 'BC3 extensible');
  ok(!Object.isFrozen(result), 'BC3 non gelé');
  ok(!Object.isSealed(result), 'BC3 non scellé');
  ok(result !== input, 'BC3 conteneur indépendant');
}

/** BC12 : indices [0,length) tous présents en propre, aucun trou. */
function denseResult(result, input) {
  ok(result.length === input.length, 'BC12 longueur');
  for (let i = 0; i < result.length; i += 1) {
    ok(Object.prototype.hasOwnProperty.call(result, i), 'BC12 trou à l’index ' + i);
  }
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

/** BC11 : tout argument est Object.is-égal à au moins un élément d’entrée. */
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

// ------------------------------------------------------------------ AXE A

test('A-V1 — entrée vide : conteneur résultat frais et ordinaire', () => {
  const input = [];
  const r = stableRank(input, num);
  freshOrdinaryArray(r, input);
  assert.equal(r.length, 0);
});

test('A-V2 — singleton : référence exacte préservée', () => {
  const a = obj(1, 'a'); const input = [a];
  const r = stableRank(input, byKey);
  freshOrdinaryArray(r, input);
  assert.equal(r.length, 1);
  assert.equal(r[0], a);
});

test('A-V3 — ordre numérique ordinaire', () => {
  assert.equal(stableRank([5, 3, 9, 1, 7], num).join(','), '1,3,5,7,9');
});

test('A-V4 — ordre inverse', () => {
  assert.equal(stableRank([9, 7, 5, 3, 1], num).join(','), '1,3,5,7,9');
});

test('A-V5 — stabilité des positions équivalentes', () => {
  const input = [obj(1, 'a'), obj(1, 'b'), obj(0, 'c'), obj(1, 'd')];
  assert.equal(stableRank(input, byKey).map((e) => e.id).join(''), 'cabd');
});

test('A-V6 — le conteneur d’entrée n’est pas muté', () => {
  const input = [obj(3, 'a'), obj(1, 'b'), obj(2, 'c')];
  const snapshot = input.slice();
  stableRank(input, byKey);
  unchangedContainer(input, snapshot);
});

test('A-V7 — propriétés, densité et indépendance du conteneur résultat', () => {
  const input = [obj(2, 'a'), obj(1, 'b'), obj(3, 'c'), obj(1, 'd')];
  const r = stableRank(input, byKey);
  freshOrdinaryArray(r, input);
  denseResult(r, input);
  const snapshot = input.slice();
  r.push(obj(9, 'z'));
  unchangedContainer(input, snapshot);
});

test('A-V8 — références objets, multiplicité, provenance des arguments', () => {
  const input = [obj(2, 'a'), obj(1, 'b'), obj(3, 'c'), obj(1, 'd')];
  const seen = [];
  const r = stableRank(input, trackingComparator(byKey, input, seen));
  sameMultiset(r, input);
  for (const e of r) ok(input.includes(e), 'BC4 référence exacte préservée');
  const expected = oracle(input, (e) => e.k);
  for (let i = 0; i < expected.length; i += 1) assert.equal(r[i], expected[i]);
});

// ------------------------------------------------------------------ AXE B
// Ces deux contrôles n’affirment que le coût. Aucune assertion d’ordre,
// de stabilité, d’identité ni de mutation n’y figure.

test('V10 — borne de travail comparateur : entrée inverse, n = 256', () => {
  const items = Array.from({ length: 256 }, (_, i) => 255 - i);
  let count = 0;
  stableRank(items, (l, r) => { count += 1; return num(l, r); });
  assert.ok(count <= bound(256), 'comparaisons ' + count + ' > borne ' + bound(256));
});

test('V11 — borne de travail comparateur : mélange déterministe distinct, n = 257', () => {
  let state = 20260907;
  const next = () => (state = (state * 1103515245 + 12345) >>> 0);
  const items = Array.from({ length: 257 }, (_, i) => i);
  for (let i = 256; i > 0; i -= 1) {
    const j = next() % (i + 1);
    const t = items[i]; items[i] = items[j]; items[j] = t;
  }
  let count = 0;
  stableRank(items, (l, r) => { count += 1; return num(l, r); });
  assert.ok(count <= bound(257), 'comparaisons ' + count + ' > borne ' + bound(257));
});
