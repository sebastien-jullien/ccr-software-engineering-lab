/** DOIT ÉCHOUER. `options` n'est pas optionnel. */
import { runPool } from '../src/task-pool.ts';
import type { PoolTask } from '../src/task-pool.ts';

const numbers: readonly PoolTask<number>[] = [async () => 1];

export function p02(): unknown {
  // La ligne suivante DOIT produire une erreur de type.
  return runPool(numbers);
}
