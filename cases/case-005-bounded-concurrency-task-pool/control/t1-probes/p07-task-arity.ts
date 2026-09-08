/** DOIT ÉCHOUER. Une tâche ne reçoit aucun argument : `() => Promise<T>`. */
import { runPool } from '../src/task-pool.ts';
import type { PoolTask } from '../src/task-pool.ts';

const needsArgument = (index: number): Promise<number> => Promise.resolve(index);
const tasks: readonly PoolTask<number>[] = [needsArgument];

export function p07(): unknown {
  return runPool(tasks, { limit: 1 });
}
