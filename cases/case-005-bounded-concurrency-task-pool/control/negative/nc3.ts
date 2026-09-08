/** NC3 — DÉFAUT INTENTIONNEL : continue de démarrer des tâches après un échec. */
export type PoolTask<T> = () => Promise<T>;
export interface PoolOptions { readonly limit: number; readonly signal?: AbortSignal }

export function runPool<T>(tasks: readonly PoolTask<T>[], options: PoolOptions): Promise<readonly T[]> {
  const { limit, signal } = options;
  if (!Number.isSafeInteger(limit) || limit < 1) throw new RangeError('limit invalide');
  if (signal !== undefined && signal.aborted) return Promise.reject(signal.reason);
  if (tasks.length === 0) return Promise.resolve([]);
  return new Promise<readonly T[]>((resolve, reject) => {
    const results: T[] = new Array(tasks.length) as T[];
    let next = 0; let inFlight = 0; let settled = false; let hasStop = false; let stopReason: unknown;
    const noteStop = (r: unknown): void => { if (!hasStop) { hasStop = true; stopReason = r; } };
    const checkAbort = (): void => { if (signal?.aborted) noteStop(signal.reason); };
    const quiet = (): void => {
      if (settled || inFlight > 0 || next < tasks.length) return;
      settled = true; if (hasStop) reject(stopReason); else resolve(results);
    };
    const pump = (): void => {
      checkAbort();
      // DÉFAUT : la condition d'arrêt n'est pas consultée ici.
      while (inFlight < limit && next < tasks.length) {
        const i = next; next += 1; inFlight += 1;
        let p: Promise<T>;
        try { p = tasks[i]!(); } catch (e) { inFlight -= 1; noteStop(e); continue; }
        p.then((v) => { results[i] = v; inFlight -= 1; checkAbort(); pump(); },
               (e) => { inFlight -= 1; checkAbort(); noteStop(e); pump(); });
        checkAbort();
      }
      quiet();
    };
    pump();
  });
}
