/** DOIT ÉCHOUER. `limit` est requis dans `PoolOptions`. */
import { runPool } from '../src/task-pool.ts';
import type { PoolTask } from '../src/task-pool.ts';

const numbers: readonly PoolTask<number>[] = [async () => 1];

export function p04(): unknown {
  return runPool(numbers, { signal: new AbortController().signal });
}
