/**
 * Qualification des deux références indépendantes contre les 15 holdouts.
 * MATÉRIEL DE CONTROL — AVEUGLE.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { defineAxisAHoldouts } from './holdout-axis-a.mjs';
import { defineAxisBHoldouts } from './holdout-axis-b.mjs';

for (const ref of ['reference-1', 'reference-2']) {
  const load = async () => await import('./' + ref + '.ts');
  defineAxisAHoldouts({ label: ref, load });
  await defineAxisBHoldouts({ label: ref, load }, test, assert);
}
