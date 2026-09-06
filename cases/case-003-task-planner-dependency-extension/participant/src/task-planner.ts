import { isPriority, isTaskId } from './validation.ts';
import { compareTasks } from './ordering.ts';
import type { PlannedTask } from './ordering.ts';

export type TaskId = string;

export type Priority = 'high' | 'normal' | 'low';

export interface Task {
  id: TaskId;
  priority: Priority;
}

export type AddFailureReason = 'INVALID_ID' | 'INVALID_PRIORITY' | 'DUPLICATE_ID';

/** `plan()` ne peut pas échouer. Le type le dit, et rien ne doit l'élargir. */
export type PlanFailureReason = never;

export type AddResult = { ok: true } | { ok: false; reason: AddFailureReason };

export type PlanResult = { ok: true; order: readonly TaskId[] };

export class TaskPlanner {
  readonly #tasks: PlannedTask[] = [];
  readonly #ids = new Set<TaskId>();

  add(task: Task): AddResult {
    if (!isTaskId(task.id)) return { ok: false, reason: 'INVALID_ID' };
    if (!isPriority(task.priority)) return { ok: false, reason: 'INVALID_PRIORITY' };
    if (this.#ids.has(task.id)) return { ok: false, reason: 'DUPLICATE_ID' };
    this.#ids.add(task.id);
    this.#tasks.push({ id: task.id, priority: task.priority, insertion: this.#tasks.length });
    return { ok: true };
  }

  plan(): PlanResult {
    return { ok: true, order: [...this.#tasks].sort(compareTasks).map((t) => t.id) };
  }
}
