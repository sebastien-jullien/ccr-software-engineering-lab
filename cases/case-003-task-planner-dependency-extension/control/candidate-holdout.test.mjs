/**
 * Exécution des 17 holdouts contre le candidat gelé.
 *
 * Ce fichier suppose d'être placé dans un répertoire directement enfant du
 * workspace candidat, de sorte que `../src/` désigne les sources du candidat.
 *
 * Les deux modules sont chargés séparément et paresseusement. L'absence du
 * module additif fait échouer les holdouts qui en dépendent, un par un, sans
 * empêcher les holdouts purement legacy de s'exécuter et de rendre un verdict.
 *
 * MATÉRIEL DE CONTROL — AVEUGLE JUSQU'À CLÔTURE INTELLECTUELLE.
 */
import { defineHoldouts } from './holdout-suite.mjs';

defineHoldouts({
  label: 'candidate',
  loadLegacy: async () => await import('../src/task-planner.ts'),
  loadDependency: async () => await import('../src/dependency-planner.ts'),
});
