/**
 * Sonde de type — consommateur figé de la surface publique.
 *
 * Ce fichier n'est pas modifiable. Il ne s'exécute pas : il doit **typer**.
 * Sa seule fonction est de constater que la signature publique déclarée par
 * `SPEC.md` est exactement celle qu'exporte `src/task-pool.ts`.
 */

import { runPool } from './src/task-pool.ts';
import type { PoolOptions, PoolTask } from './src/task-pool.ts';

const tasks: readonly PoolTask<number>[] = [
  () => Promise.resolve(1),
  async () => 2,
];

const withLimit: PoolOptions = { limit: 2 };
const withSignal: PoolOptions = { limit: 1, signal: new AbortController().signal };

export async function probe(): Promise<number> {
  const a: readonly number[] = await runPool(tasks, withLimit);
  const b: readonly number[] = await runPool(tasks, withSignal);
  const strings: readonly PoolTask<string>[] = [async () => 'x'];
  const c: readonly string[] = await runPool(strings, { limit: 1 });
  return a.length + b.length + c.length;
}
