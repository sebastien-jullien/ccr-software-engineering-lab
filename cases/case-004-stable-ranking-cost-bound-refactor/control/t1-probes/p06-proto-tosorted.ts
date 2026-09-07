export const f = (a: number[]) => (Array.prototype as unknown as { toSorted: Function }).toSorted.call(a);
