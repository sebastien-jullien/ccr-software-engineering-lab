import { stableRank } from './src/stable-rank.ts';
import type { Comparator } from './src/stable-rank.ts';

type Exact<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;

const compare: Comparator<number> = (left, right) => left - right;
const ranked: readonly number[] = stableRank<number>([3, 1, 2], compare);
void ranked;

type ComparatorShape = Exact<Comparator<number>, (left: number, right: number) => number>;
const comparatorShape: ComparatorShape = true;
void comparatorShape;

type ParametersShape = Exact<
  Parameters<typeof stableRank<number>>,
  [items: readonly number[], compare: Comparator<number>]
>;
const parametersShape: ParametersShape = true;
void parametersShape;

type ReturnShape = Exact<ReturnType<typeof stableRank<number>>, readonly number[]>;
const returnShape: ReturnShape = true;
void returnShape;

// @ts-expect-error le resultat public n'est pas un tableau mutable
const mutableResult: number[] = stableRank<number>([1], compare);
void mutableResult;
