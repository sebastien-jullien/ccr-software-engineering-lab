/**
 * Qualification du moteur de référence contre les 17 holdouts.
 * MATÉRIEL DE CONTROL — AVEUGLE JUSQU'À CLÔTURE INTELLECTUELLE.
 */
import { defineHoldouts } from './holdout-suite.mjs';

defineHoldouts({
  label: 'reference',
  loadLegacy: async () => await import('./reference-planner.mjs'),
  loadDependency: async () => await import('./reference-planner.mjs'),
});
