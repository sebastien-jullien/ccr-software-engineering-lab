/**
 * Qualification du moteur de référence contre les 9 contrôles visibles
 * d'exécution V1..V9.
 *
 * Transcription indépendante : ce fichier n'importe pas la suite visible du
 * paquet participant. Les attentes sont réécrites depuis SPEC.md.
 *
 * V10 n'apparaît pas ici : c'est une sonde de compilation TypeScript, et le
 * moteur de référence est en JavaScript. Elle qualifie la surface de types du
 * fixture et du candidat, jamais celle de la référence.
 *
 * MATÉRIEL DE CONTROL — AVEUGLE JUSQU'À CLÔTURE INTELLECTUELLE.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import { DependencyTaskPlanner, TaskPlanner } from './reference-planner.mjs';

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

test('V5 — legacy préservé : plan() hérité rend l\'ordre legacy sur la sous-classe', () => {
  const planner = new DependencyTaskPlanner();
  planner.add({ id: 'alpha', priority: 'low' });
  planner.add({ id: 'beta', priority: 'high', after: ['alpha'] });
  planner.add({ id: 'gamma', priority: 'normal' });
  planner.add({ id: 'delta', priority: 'high' });
  assert.deepEqual(planner.plan(), { ok: true, order: ['beta', 'delta', 'gamma', 'alpha'] });
});

test('V6 — sans dépendance déclarée, planWithDependencies() suit l\'ordre legacy', () => {
  const planner = new DependencyTaskPlanner();
  planner.add({ id: 'a', priority: 'low' });
  planner.add({ id: 'b', priority: 'high' });
  planner.add({ id: 'c', priority: 'normal' });
  assert.deepEqual(planner.planWithDependencies(), { ok: true, order: ['b', 'c', 'a'] });
});

test('V7 — une dépendance déclarée précède la tâche qui la déclare', () => {
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

test('V8 — une dépendance absente donne UNKNOWN_DEPENDENCY', () => {
  const planner = new DependencyTaskPlanner();
  planner.add({ id: 'a', priority: 'high' });
  planner.add({ id: 'b', priority: 'normal', after: ['missing'] });
  assert.deepEqual(planner.planWithDependencies(), { ok: false, reason: 'UNKNOWN_DEPENDENCY' });
});

test('V9 — un cycle donne CYCLIC_DEPENDENCY', () => {
  const planner = new DependencyTaskPlanner();
  planner.add({ id: 'x', priority: 'high', after: ['y'] });
  planner.add({ id: 'y', priority: 'normal', after: ['x'] });
  assert.deepEqual(planner.planWithDependencies(), { ok: false, reason: 'CYCLIC_DEPENDENCY' });
});
