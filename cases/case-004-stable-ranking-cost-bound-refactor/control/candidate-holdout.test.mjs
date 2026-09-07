/**
 * Exécution des holdouts officiels contre le candidat gelé.
 *
 * Ce fichier suppose d'être placé dans un répertoire directement enfant du
 * workspace candidat, de sorte que `../src/` désigne ses sources.
 *
 * MATÉRIEL DE CONTROL — AVEUGLE jusqu'à la clôture intellectuelle.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { defineAxisAHoldouts } from './holdout-axis-a.mjs';
import { defineAxisBHoldouts } from './holdout-axis-b.mjs';

const load = async () => await import('../src/stable-rank.ts');

defineAxisAHoldouts({ label: 'candidate', load });
await defineAxisBHoldouts({ label: 'candidate', load }, test, assert);
