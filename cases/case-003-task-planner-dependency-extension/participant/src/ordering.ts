import type { Priority, TaskId } from './task-planner.ts';

export interface PlannedTask {
  readonly id: TaskId;
  readonly priority: Priority;
  readonly insertion: number;
}

const RANK: Readonly<Record<Priority, number>> = { high: 0, normal: 1, low: 2 };

/** Rang de priorité, puis rang d'insertion. Seule règle d'ordre de la v1. */
export function compareTasks(a: PlannedTask, b: PlannedTask): number {
  const byPriority = RANK[a.priority] - RANK[b.priority];
  return byPriority !== 0 ? byPriority : a.insertion - b.insertion;
}
