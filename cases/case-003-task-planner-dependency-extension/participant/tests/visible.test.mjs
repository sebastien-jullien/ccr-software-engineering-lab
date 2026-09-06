/**
 * CASE-003 — Contrôles visibles.
 *
 * V1..V9 sont des contrôles d'exécution. V10 est la sonde de compatibilité
 * source `consumer-v1.ts`, qui se vérifie par compilation et non ici.
 *
 * V1..V4 portent sur le comportement legacy existant et doivent passer sur la
 * v1 de départ. V5..V9 portent sur la surface additive et échouent tant que
 * `src/dependency-planner.ts` n'existe pas : c'est attendu.
 *
 * Le module additif n'est jamais importé au niveau du fichier. Son absence doit
 * faire échouer les contrôles concernés un par un, jamais empêcher le
 * chargement de la suite.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import { TaskPlanner } from '../src/task-planner.ts';

async function loadDependencyTaskPlanner() {
  const module = await import('../src/dependency-planner.ts');
  const Ctor = module.DependencyTaskPlanner;
  if (typeof Ctor !== 'function') {
    throw new Error("export `DependencyTaskPlanner` absent de src/dependency-planner.ts");
  }
  return Ctor;
}

/** alpha(low) beta(high, après alpha) gamma(normal) delta(high) */
function declaredFixture(planner) {
  assert.deepEqual(planner.add({ id: 'alpha', priority: 'low' }), { ok: true });
  assert.deepEqual(planner.add({ id: 'beta', priority: 'high', after: ['alpha'] }), { ok: true });
  assert.deepEqual(planner.add({ id: 'gamma', priority: 'normal' }), { ok: true });
  assert.deepEqual(planner.add({ id: 'delta', priority: 'high' }), { ok: true });
  return planner;
}

test('V1 — legacy : ordre par rang de priorité puis rang d\'insertion', () => {
  const planner = new TaskPlanner();
  planner.add({ id: 'a', priority: 'low' });
  planner.add({ id: 'b', priority: 'high' });
  planner.add({ id: 'c', priority: 'normal' });
  planner.add({ id: 'd', priority: 'high' });
  assert.deepEqual(planner.plan(), { ok: true, order: ['b', 'd', 'c', 'a'] });
});

test('V2 — legacy : précédence des motifs de refus de add()', () => {
  const planner = new TaskPlanner();
  assert.deepEqual(planner.add({ id: '', priority: 'high' }), { ok: false, reason: 'INVALID_ID' });
  assert.deepEqual(planner.add({ id: 'a b', priority: 'high' }), { ok: false, reason: 'INVALID_ID' });
  assert.deepEqual(planner.add({ id: 'ok', priority: 'urgent' }), { ok: false, reason: 'INVALID_PRIORITY' });
  assert.deepEqual(planner.add({ id: '', priority: 'urgent' }), { ok: false, reason: 'INVALID_ID' });
  assert.deepEqual(planner.add({ id: 'x', priority: 'high' }), { ok: true });
  assert.deepEqual(planner.add({ id: 'x', priority: 'low' }), { ok: false, reason: 'DUPLICATE_ID' });
  assert.deepEqual(planner.add({ id: 'x', priority: 'urgent' }), { ok: false, reason: 'INVALID_PRIORITY' });
  assert.deepEqual(planner.plan(), { ok: true, order: ['x'] });
});

test('V3 — legacy : plan() est pur et son résultat est un instantané', () => {
  const planner = new TaskPlanner();
  planner.add({ id: 'one', priority: 'normal' });
  planner.add({ id: 'two', priority: 'high' });
  const first = planner.plan();
  try {
    first.order.push('injected');
  } catch {
    /* un résultat gelé est une implémentation acceptable */
  }
  const second = planner.plan();
  assert.deepEqual([...second.order], ['two', 'one']);
  assert.deepEqual([...planner.plan().order], ['two', 'one']);
});

test('V4 — legacy : forme du résultat directement utilisable à l\'exécution', () => {
  const planner = new TaskPlanner();
  planner.add({ id: 'solo', priority: 'high' });
  const result = planner.plan();
  assert.equal(result.ok, true);
  assert.equal(Object.hasOwn(result, 'reason'), false);
  assert.equal(Array.isArray(result.order), true);
  assert.deepEqual([...result.order], ['solo']);
});

test('V5 — legacy préservé : plan() hérité rend l\'ordre legacy sur la sous-classe', async () => {
  const DependencyTaskPlanner = await loadDependencyTaskPlanner();
  const planner = declaredFixture(new DependencyTaskPlanner());
  assert.deepEqual(planner.plan(), { ok: true, order: ['beta', 'delta', 'gamma', 'alpha'] });
});

test('V6 — sans dépendance déclarée, planWithDependencies() suit l\'ordre legacy', async () => {
  const DependencyTaskPlanner = await loadDependencyTaskPlanner();
  const planner = new DependencyTaskPlanner();
  planner.add({ id: 'a', priority: 'low' });
  planner.add({ id: 'b', priority: 'high' });
  planner.add({ id: 'c', priority: 'normal' });
  assert.deepEqual(planner.planWithDependencies(), { ok: true, order: ['b', 'c', 'a'] });
});

test('V7 — une dépendance déclarée précède la tâche qui la déclare', async () => {
  const DependencyTaskPlanner = await loadDependencyTaskPlanner();
  const planner = new DependencyTaskPlanner();
  planner.add({ id: 'build', priority: 'low' });
  planner.add({ id: 'test', priority: 'high', after: ['build'] });
  planner.add({ id: 'ship', priority: 'normal', after: ['test'] });
  planner.add({ id: 'lint', priority: 'high' });
  assert.deepEqual(planner.planWithDependencies(), {
    ok: true,
    order: ['lint', 'build', 'test', 'ship'],
  });
});

test('V8 — une dépendance absente donne UNKNOWN_DEPENDENCY', async () => {
  const DependencyTaskPlanner = await loadDependencyTaskPlanner();
  const planner = new DependencyTaskPlanner();
  planner.add({ id: 'a', priority: 'high' });
  planner.add({ id: 'b', priority: 'normal', after: ['missing'] });
  assert.deepEqual(planner.planWithDependencies(), {
    ok: false,
    reason: 'UNKNOWN_DEPENDENCY',
  });
});

test('V9 — un cycle donne CYCLIC_DEPENDENCY', async () => {
  const DependencyTaskPlanner = await loadDependencyTaskPlanner();
  const planner = new DependencyTaskPlanner();
  planner.add({ id: 'x', priority: 'high', after: ['y'] });
  planner.add({ id: 'y', priority: 'normal', after: ['x'] });
  assert.deepEqual(planner.planWithDependencies(), {
    ok: false,
    reason: 'CYCLIC_DEPENDENCY',
  });
});
