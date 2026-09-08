/** DOIT ÉCHOUER. `runPool` rend une `Promise`, jamais un tableau synchrone. */
import { runPool } from '../src/task-pool.ts';
import type { PoolTask } from '../src/task-pool.ts';

const numbers: readonly PoolTask<number>[] = [async () => 1];

export function p08(): number {
  return runPool(numbers, { limit: 1 }).length;
}
