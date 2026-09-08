/**
 * Vue `node:test` des 10 lignes VISIBLES, côté contrôle.
 *
 * Chaque ligne délègue à `runner.mjs` : même processus isolé, même hiérarchie
 * de verdict que `evaluate.mjs`. Il n'y a pas de second oracle.
 *
 *   CASE005_IMPL=<fichier.ts> node --test candidate-visible.test.mjs
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { ROWS } from './rows.mjs';
import { DEFAULT_WATCHDOG_MS, runRow } from './runner.mjs';

const implPath = path.resolve(
  process.env.CASE005_IMPL ?? path.join(import.meta.dirname, '..', 'participant', 'src', 'task-pool.ts'),
);
const watchdogMs = Number(process.env.CASE005_WATCHDOG ?? DEFAULT_WATCHDOG_MS);

for (const row of ROWS.filter((r) => r.visibility === 'VISIBLE')) {
  test(`${row.id} (visible)`, async () => {
    const r = await runRow(row, { implPath, watchdogMs, label: 'candidate-visible' });
    assert.equal(r.harnessFault, null, `panne de harnais : ${r.harnessFault}`);
    assert.notEqual(r.outcome, 'INCONCLUSIVE', `watchdog déclenché après ${r.durationMs} ms`);
    assert.equal(r.outcome, 'PASS', `${r.outcome} — ${r.detail ?? 'aucune conclusion observée'}`);
  });
}
