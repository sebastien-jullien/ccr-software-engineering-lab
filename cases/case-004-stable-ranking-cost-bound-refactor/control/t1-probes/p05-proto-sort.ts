export const f = (a: number[]) => Array.prototype.sort.call([...a], (x: number, y: number) => x - y);
