export type Comparator<T> = (left: T, right: T) => number;

/** Point de départ : tri par insertion stable sur copie superficielle. */
export function stableRank<T>(items: readonly T[], compare: Comparator<T>): readonly T[] {
  const out: T[] = items.slice();
  for (let i = 1; i < out.length; i += 1) {
    const current = out[i] as T;
    let j = i - 1;
    while (j >= 0 && compare(out[j] as T, current) > 0) {
      out[j + 1] = out[j] as T;
      j -= 1;
    }
    out[j + 1] = current;
  }
  return out;
}
