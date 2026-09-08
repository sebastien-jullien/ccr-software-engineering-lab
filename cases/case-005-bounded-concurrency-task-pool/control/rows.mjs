/** Les 30 lignes de vérité gelées, agrégées. Aucune ne partage d'état avec une autre. */
import { ROWS_A } from './holdout-axis-a.mjs';
import { ROWS_B } from './holdout-axis-b.mjs';
import { ROWS_C } from './holdout-axis-c.mjs';
import { ROWS_D } from './holdout-axis-d.mjs';
import { ROWS_E } from './holdout-axis-e.mjs';

export const ROWS = [...ROWS_A, ...ROWS_B, ...ROWS_C, ...ROWS_D, ...ROWS_E];

export const VISIBLE_IDS = ROWS.filter((r) => r.visibility === 'VISIBLE').map((r) => r.id);
export const HIDDEN_IDS = ROWS.filter((r) => r.visibility === 'HIDDEN').map((r) => r.id);

export function rowById(id) {
  const row = ROWS.find((r) => r.id === id);
  if (row === undefined) throw new Error(`ligne inconnue : ${id}`);
  return row;
}
