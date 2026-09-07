export type Comparator<T> = (left: T, right: T) => number;

/**
 * REF-2 : fusion ascendante itérative, double tampon permuté, aucun découpage
 * récursif et aucune concaténation. Aucun noyau de tri partagé avec REF-1.
 */
export function stableRank<T>(items: readonly T[], compare: Comparator<T>): readonly T[] {
  const size = items.length;
  let source: T[] = items.slice();
  if (size <= 1) return source;
  let target: T[] = new Array<T>(size);

  for (let width = 1; width < size; width *= 2) {
    for (let low = 0; low < size; low += width * 2) {
      const middle = Math.min(low + width, size);
      const high = Math.min(low + width * 2, size);
      let a = low;
      let b = middle;
      let k = low;
      while (a < middle && b < high) {
        if (compare(source[b] as T, source[a] as T) < 0) {
          target[k] = source[b] as T;
          b += 1;
        } else {
          target[k] = source[a] as T;
          a += 1;
        }
        k += 1;
      }
      while (a < middle) { target[k] = source[a] as T; a += 1; k += 1; }
      while (b < high) { target[k] = source[b] as T; b += 1; k += 1; }
    }
    const swap = source;
    source = target;
    target = swap;
  }
  return source;
}
