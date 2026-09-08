/** DOIT ÉCHOUER. Le résultat est `readonly T[]` au niveau des types. */
import { runPool } from '../src/task-pool.ts';
import type { PoolTask } from '../src/task-pool.ts';

const numbers: readonly PoolTask<number>[] = [async () => 1];

export async function p05(): Promise<void> {
  const result = await runPool(numbers, { limit: 1 });
  result[0] = 42;
}
