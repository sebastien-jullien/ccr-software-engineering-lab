/** OP-W1 — SONDE OPÉRATIONNELLE, hors ensemble scoré : maintient délibérément la boucle en vie sans produire l'événement requis. Sert uniquement à prouver le chemin de récupération du watchdog. */
export type PoolTask<T> = () => Promise<T>;
export interface PoolOptions { readonly limit: number; readonly signal?: AbortSignal }

export function runPool<T>(tasks: readonly PoolTask<T>[], options: PoolOptions): Promise<readonly T[]> {
  const { limit, signal } = options;
  if (!Number.isSafeInteger(limit) || limit < 1) throw new RangeError('limit invalide');
  if (signal !== undefined && signal.aborted) return Promise.reject(signal.reason);
  if (tasks.length === 0) return Promise.resolve([]);
  return new Promise<readonly T[]>(() => {
    // Démarre le remplissage initial, puis ne progresse plus JAMAIS, tout en
    // gardant un handle vivant : la boucle ne peut pas se vider.
    const width = Math.min(limit, tasks.length);
    for (let i = 0; i < width; i += 1) { void tasks[i]!(); }
    setInterval(() => {}, 1000);
  });
}
