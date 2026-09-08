/**
 * RÉFÉRENCE 2 — stratégie « ordonnanceur / recharge ».
 *
 * Un contrôleur unique, un compteur `inFlight` explicite, et une fonction
 * `pump()` qui démarre tant qu'un créneau est libre, qu'il reste des tâches et
 * qu'aucune cause d'arrêt n'existe. Appelée une fois au départ, puis à chaque
 * règlement.
 *
 * L'avortement n'est PAS observé par un écouteur : il est CONSTATÉ aux points
 * de contrôle — après chaque invocation, et à chaque règlement.
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
    throw new RangeError(`limit invalide : ${String(limit)}`);
  }
  if (signal !== undefined && signal.aborted) return Promise.reject(signal.reason);
  if (tasks.length === 0) return Promise.resolve([]);

  return new Promise<readonly T[]>((resolve, reject) => {
    const results: T[] = new Array(tasks.length) as T[];
    let next = 0;
    let inFlight = 0;
    let settled = false;
    let hasStop = false;
    let stopReason: unknown;

    const noteStop = (reason: unknown): void => {
      if (hasStop) return;
      hasStop = true;
      stopReason = reason;
    };
    const checkAbort = (): void => {
      if (signal !== undefined && signal.aborted) noteStop(signal.reason);
    };
    const settleIfQuiet = (): void => {
      if (settled) return;
      if (inFlight > 0) return;
      if (!hasStop && next < tasks.length) return;
      settled = true;
      if (hasStop) reject(stopReason);
      else resolve(results);
    };

    const pump = (): void => {
      checkAbort();
      while (!hasStop && inFlight < limit && next < tasks.length) {
        const index = next;
        next += 1;
        inFlight += 1;
        let running: Promise<T>;
        try {
          running = tasks[index]!();
        } catch (error) {
          inFlight -= 1;
          noteStop(error);
          break;
        }
        running.then(
          (value) => {
            results[index] = value;
            inFlight -= 1;
            checkAbort();
            pump();
          },
          (error) => {
            inFlight -= 1;
            checkAbort();
            noteStop(error);
            pump();
          },
        );
        // Une tâche peut avoir rendu le signal avorté pendant sa propre
        // invocation : le constater avant d'en démarrer une autre.
        checkAbort();
      }
      settleIfQuiet();
    };

    pump();
  });
}
