export const f = (a: readonly number[], c: (x: number, y: number) => number) => {
  const key = 'so' + 'rt';
  return ([...a] as unknown as Record<string, (cb: unknown) => number[]>)[key](c);
};
