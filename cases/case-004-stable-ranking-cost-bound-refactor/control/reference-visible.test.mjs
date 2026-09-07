/**
 * Qualification des deux références indépendantes contre les 11 contrôles
 * visibles : A-V1..A-V8 d'exécution, plus V10 et V11 de coût.
 *
 * Transcription indépendante : ce fichier n'importe pas la suite visible du
 * paquet participant. A-V9 n'y figure pas — c'est une sonde de compilation
 * TypeScript, vérifiée séparément.
 *
 * MATÉRIEL DE CONTROL — AVEUGLE.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

const cell = (k, id) => ({ k, id });
const byKey = (a, b) => a.k - b.k;
const num = (a, b) => a - b;
const ceilLog2 = (n) => 32 - Math.clz32(n - 1);

function expectedOrder(items) {
  const decorated = items.map((element, position) => ({ element, position }));
  decorated.sort((x, y) => (x.element.k - y.element.k) || (x.position - y.position));
  return decorated.map((d) => d.element);
}

for (const ref of ['reference-1', 'reference-2']) {
  const rank = async () => (await import('./' + ref + '.ts')).stableRank;
  const t = (id, title, body) => test(`${id} [${ref}] — ${title}`, body);

  t('A-V1', 'entrée vide', async () => {
    const stableRank = await rank();
    const input = [];
    const r = stableRank(input, num);
    assert.equal(Array.isArray(r), true);
    assert.equal(Object.getPrototypeOf(r), Array.prototype);
    assert.notEqual(r, input);
    assert.equal(r.length, 0);
  });

  t('A-V2', 'singleton', async () => {
    const stableRank = await rank();
    const only = cell(1, 'a');
    const r = stableRank([only], byKey);
    assert.equal(r.length, 1);
    assert.equal(r[0], only);
  });

  t('A-V3', 'ordre numérique ordinaire', async () => {
    const stableRank = await rank();
    assert.deepEqual([...stableRank([5, 3, 9, 1, 7], num)], [1, 3, 5, 7, 9]);
  });

  t('A-V4', 'ordre inverse', async () => {
    const stableRank = await rank();
    assert.deepEqual([...stableRank([9, 7, 5, 3, 1], num)], [1, 3, 5, 7, 9]);
  });

  t('A-V5', 'stabilité des positions équivalentes', async () => {
    const stableRank = await rank();
    const input = [cell(1, 'a'), cell(1, 'b'), cell(0, 'c'), cell(1, 'd')];
    assert.equal(stableRank(input, byKey).map((e) => e.id).join(''), 'cabd');
  });

  t('A-V6', 'conteneur d’entrée non muté', async () => {
    const stableRank = await rank();
    const input = [cell(3, 'a'), cell(1, 'b'), cell(2, 'c')];
    const copy = input.slice();
    stableRank(input, byKey);
    assert.deepEqual(input, copy);
    for (let i = 0; i < copy.length; i += 1) assert.equal(input[i], copy[i]);
  });

  t('A-V7', 'propriétés, densité et indépendance du résultat', async () => {
    const stableRank = await rank();
    const input = [cell(2, 'a'), cell(1, 'b'), cell(3, 'c'), cell(1, 'd')];
    const r = stableRank(input, byKey);
    assert.equal(Array.isArray(r), true);
    assert.equal(Object.getPrototypeOf(r), Array.prototype);
    assert.equal(Object.isExtensible(r), true);
    assert.equal(Object.isFrozen(r), false);
    assert.equal(Object.isSealed(r), false);
    assert.notEqual(r, input);
    assert.equal(r.length, input.length);
    for (let i = 0; i < r.length; i += 1) {
      assert.equal(Object.prototype.hasOwnProperty.call(r, i), true, 'trou à l’index ' + i);
    }
    const copy = input.slice();
    r.push(cell(9, 'z'));
    for (let i = 0; i < copy.length; i += 1) assert.equal(input[i], copy[i]);
  });

  t('A-V8', 'références, multiplicité et provenance des arguments', async () => {
    const stableRank = await rank();
    const input = [cell(2, 'a'), cell(1, 'b'), cell(3, 'c'), cell(1, 'd')];
    const provenance = (v) => input.some((e) => Object.is(v, e));
    const r = stableRank(input, (l, x) => {
      assert.equal(provenance(l), true, 'argument gauche hors entrée');
      assert.equal(provenance(x), true, 'argument droit hors entrée');
      return byKey(l, x);
    });
    assert.equal(r.length, input.length);
    const expected = expectedOrder(input);
    for (let i = 0; i < expected.length; i += 1) assert.equal(r[i], expected[i]);
  });

  t('V10', 'borne de coût, entrée inverse n = 256', async () => {
    const stableRank = await rank();
    const items = Array.from({ length: 256 }, (_, i) => 255 - i);
    let count = 0;
    stableRank(items, (l, r) => { count += 1; return num(l, r); });
    assert.ok(count <= 256 * ceilLog2(256), 'comparaisons ' + count);
  });

  t('V11', 'borne de coût, mélange déterministe n = 257', async () => {
    const stableRank = await rank();
    let state = 20260907;
    const next = () => (state = (state * 1103515245 + 12345) >>> 0);
    const items = Array.from({ length: 257 }, (_, i) => i);
    for (let i = 256; i > 0; i -= 1) {
      const j = next() % (i + 1);
      const t2 = items[i]; items[i] = items[j]; items[j] = t2;
    }
    let count = 0;
    stableRank(items, (l, r) => { count += 1; return num(l, r); });
    assert.ok(count <= 257 * ceilLog2(257), 'comparaisons ' + count);
  });
}
