export type Comparator<T> = (left: T, right: T) => number;
/**
 * NC6 : fonctionnellement correct, mais DERIVE DE SIGNATURE PUBLIQUE —
 * le parametre n'est plus `readonly T[]` et le retour n'est plus `readonly T[]`.
 */
function fuse<T>(left: readonly T[], right: readonly T[], compare: Comparator<T>): T[] {
  const out: T[] = []; let i = 0; let j = 0;
  while (i < left.length && j < right.length) {
    if (compare(right[j] as T, left[i] as T) < 0) { out.push(right[j] as T); j += 1; }
    else { out.push(left[i] as T); i += 1; }
  }
  while (i < left.length) { out.push(left[i] as T); i += 1; }
  while (j < right.length) { out.push(right[j] as T); j += 1; }
  return out;
}
function divide<T>(block: readonly T[], compare: Comparator<T>): T[] {
  if (block.length <= 1) return block.slice();
  const middle = block.length >> 1;
  return fuse(divide(block.slice(0, middle), compare), divide(block.slice(middle), compare), compare);
}
export function stableRank<T>(items: T[], compare: Comparator<T>): T[] {
  return divide(items, compare);
}
