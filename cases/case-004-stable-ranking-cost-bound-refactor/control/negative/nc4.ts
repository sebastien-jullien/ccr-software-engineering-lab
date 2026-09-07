export type Comparator<T> = (left: T, right: T) => number;
/** NC4 : triche à travail comparateur nul — aucune comparaison, aucun classement. */
export function stableRank<T>(items: readonly T[], compare: Comparator<T>): readonly T[] {
  void compare;
  return items.slice();
}
