/** NC7 — DÉFAUT INTENTIONNEL : attend le règlement de TOUTES les tâches en vol avant de recharger un créneau libéré. N'ouvre AUCUN handle vivant : sa non-progression se manifeste par la fin naturelle du processus. */
export type PoolTask<T> = () => Promise<T>;
export interface PoolOptions { readonly limit: number; readonly signal?: AbortSignal }

export function runPool<T>(tasks: readonly PoolTask<T>[], options: PoolOptions): Promise<readonly T[]> {
  const { limit, signal } = options;
  if (!Number.isSafeInteger(limit) || limit < 1) throw new RangeError('limit invalide');
  if (signal !== undefined && signal.aborted) return Promise.reject(signal.reason);
  if (tasks.length === 0) return Promise.resolve([]);
  const results: T[] = new Array(tasks.length) as T[];
  let hasStop = false; let stopReason: unknown;
  const noteStop = (r: unknown): void => { if (!hasStop) { hasStop = true; stopReason = r; } };
  const checkAbort = (): void => { if (signal?.aborted) noteStop(signal.reason); };
  const run = async (): Promise<readonly T[]> => {
    let next = 0;
    while (next < tasks.length) {
      checkAbort();
      if (hasStop) break;
      // DÉFAUT : on constitue un LOT complet, puis on attend qu'il se règle
      // ENTIÈREMENT avant de recharger le moindre créneau libéré.
      const batch: Promise<void>[] = [];
      while (batch.length < limit && next < tasks.length && !hasStop) {
        const i = next; next += 1;
        try {
          batch.push(tasks[i]!().then((v) => { results[i] = v; }, (e) => { checkAbort(); noteStop(e); }));
        } catch (e) { noteStop(e); }
        checkAbort();
      }
      await Promise.all(batch);
      checkAbort();
    }
    if (hasStop) throw stopReason;
    return results;
  };
  return run();
}
