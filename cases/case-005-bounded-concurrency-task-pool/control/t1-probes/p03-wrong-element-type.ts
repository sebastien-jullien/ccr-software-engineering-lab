/** DOIT ÉCHOUER. `T` doit se propager de la tâche au résultat. */
import { runPool } from '../src/task-pool.ts';
import type { PoolTask } from '../src/task-pool.ts';

const numbers: readonly PoolTask<number>[] = [async () => 1];

export async function p03(): Promise<readonly string[]> {
  const wrong: readonly string[] = await runPool(numbers, { limit: 1 });
  return wrong;
}
