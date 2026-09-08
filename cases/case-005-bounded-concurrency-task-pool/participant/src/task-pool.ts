/**
 * Pool d'exécution à concurrence bornée.
 *
 * Le contrat public complet — précédence des entrées, validité de `limit`,
 * cause d'arrêt, quiescence, ordre des résultats, progression — est spécifié
 * dans `SPEC.md`. Ce fichier n'en répète rien : la spécification fait foi.
 *
 * Seul ce fichier est modifiable.
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
  void tasks;
  void options;
  throw new Error('TODO: implement runPool');
}
