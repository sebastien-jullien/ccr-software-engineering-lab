export type Comparator<T> = (left: T, right: T) => number;
/** NC7 : classement correct, mais le conteneur resultat porte un TROU. */
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
export function stableRank<T>(items: readonly T[], compare: Comparator<T>): readonly T[] {
  const ranked = divide(items, compare);
  const holey = new Array<T>(ranked.length);
  for (let i = 0; i < ranked.length; i += 1) {
    if (i === 1) continue;
    holey[i] = ranked[i] as T;
  }
  return holey;
}
