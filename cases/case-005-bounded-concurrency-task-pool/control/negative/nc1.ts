/** NC1 — DÉFAUT INTENTIONNEL : ignore `limit`, démarre tout d'un coup. */
export type PoolTask<T> = () => Promise<T>;
export interface PoolOptions { readonly limit: number; readonly signal?: AbortSignal }

export function runPool<T>(tasks: readonly PoolTask<T>[], options: PoolOptions): Promise<readonly T[]> {
  const { limit, signal } = options;
  if (!Number.isSafeInteger(limit) || limit < 1) throw new RangeError('limit invalide');
  if (signal !== undefined && signal.aborted) return Promise.reject(signal.reason);
  if (tasks.length === 0) return Promise.resolve([]);
  return new Promise<readonly T[]>((resolve, reject) => {
    const results: T[] = new Array(tasks.length) as T[];
    let hasStop = false; let stopReason: unknown; let remaining = tasks.length;
    const noteStop = (r: unknown): void => { if (!hasStop) { hasStop = true; stopReason = r; } };
    const done = (): void => { remaining -= 1; if (remaining === 0) { if (hasStop) reject(stopReason); else resolve(results); } };
    for (let i = 0; i < tasks.length; i += 1) {
      try {
        tasks[i]!().then((v) => { results[i] = v; done(); }, (e) => { if (signal?.aborted) noteStop(signal.reason); noteStop(e); done(); });
      } catch (e) { noteStop(e); done(); }
    }
  });
}
