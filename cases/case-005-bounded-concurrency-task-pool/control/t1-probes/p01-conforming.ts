/** DOIT TYPER. Usage conforme de la surface publique gelée. */
import { runPool } from '../src/task-pool.ts';
import type { PoolOptions, PoolTask } from '../src/task-pool.ts';

const numbers: readonly PoolTask<number>[] = [() => Promise.resolve(1), async () => 2];
const strings: readonly PoolTask<string>[] = [async () => 'x'];
const withLimit: PoolOptions = { limit: 2 };
const withSignal: PoolOptions = { limit: 1, signal: new AbortController().signal };

export async function p01(): Promise<number> {
  const a: readonly number[] = await runPool(numbers, withLimit);
  const b: readonly number[] = await runPool(numbers, withSignal);
  const c: readonly string[] = await runPool(strings, { limit: 1 });
  return a.length + b.length + c.length;
}
