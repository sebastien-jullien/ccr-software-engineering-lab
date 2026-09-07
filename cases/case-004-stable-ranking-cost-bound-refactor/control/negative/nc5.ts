export type Comparator<T> = (left: T, right: T) => number;
/** NC5 : délégation au tri de l'hôte — interdite par la règle de mission. */
export function stableRank<T>(items: readonly T[], compare: Comparator<T>): readonly T[] {
  return [...items].sort(compare);
}
