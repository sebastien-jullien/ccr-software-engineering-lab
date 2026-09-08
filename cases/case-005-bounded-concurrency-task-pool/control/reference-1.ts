/**
 * RÉFÉRENCE 1 — stratégie « boucles ouvrières ».
 *
 * `min(limit, n)` boucles concurrentes se partagent un curseur d'index. Chaque
 * ouvrière prend l'index suivant, attend son règlement, recommence. Il n'existe
 * aucune logique de recharge explicite : la recharge EST la boucle.
 *
 * L'avortement est observé par un ÉCOUTEUR, posé avant toute invocation.
 */

export type PoolTask<T> = () => Promise<T>;

export interface PoolOptions {
  readonly limit: number;
  readonly signal?: AbortSignal;
}

export function runPool<T>(
  tasks: readonly PoolTask<T>[],
  options: PoolOptions,
): Promise<readonly T[]> {
  const { limit, signal } = options;

  if (!Number.isSafeInteger(limit) || limit < 1) {
    throw new RangeError(`limit doit être un entier sûr >= 1 (reçu : ${String(limit)})`);
  }
  if (signal !== undefined && signal.aborted) return Promise.reject(signal.reason);
  if (tasks.length === 0) return Promise.resolve([]);

  return new Promise<readonly T[]>((resolve, reject) => {
    const results: T[] = new Array(tasks.length) as T[];
    let cursor = 0;
    let stopped = false;
    let stopReason: unknown;

    const stop = (reason: unknown): void => {
      if (stopped) return;
      stopped = true;
      stopReason = reason;
    };

    const onAbort = (): void => { stop(signal?.reason); };
    signal?.addEventListener('abort', onAbort, { once: true });

    const worker = async (): Promise<void> => {
      for (;;) {
        if (stopped) return;
        if (cursor >= tasks.length) return;
        const index = cursor;
        cursor += 1;
        try {
          results[index] = await tasks[index]!();
        } catch (error) {
          stop(error);
        }
      }
    };

    const workers: Promise<void>[] = [];
    const width = Math.min(limit, tasks.length);
    for (let w = 0; w < width; w += 1) workers.push(worker());

    const finish = (): void => {
      signal?.removeEventListener('abort', onAbort);
      if (stopped) reject(stopReason);
      else resolve(results);
    };
    Promise.all(workers).then(finish, finish);
  });
}
