import type { Priority, TaskId } from './task-planner.ts';

/** Contrat v1 : identifiant non vide, borné, sans espace ni caractère de contrôle. */
const ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;

const PRIORITIES = ['high', 'normal', 'low'] as const;

export function isTaskId(value: unknown): value is TaskId {
  return typeof value === 'string' && ID_PATTERN.test(value);
}

export function isPriority(value: unknown): value is Priority {
  return typeof value === 'string' && (PRIORITIES as readonly string[]).includes(value);
}
