/** DOIT ÉCHOUER. `PoolOptions.limit` est `readonly`. */
import type { PoolOptions } from '../src/task-pool.ts';

const options: PoolOptions = { limit: 1 };

export function p06(): number {
  options.limit = 3;
  return options.limit;
}
