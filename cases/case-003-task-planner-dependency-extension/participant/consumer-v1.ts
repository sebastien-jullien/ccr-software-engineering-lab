/**
 * V10 — SONDE DE COMPATIBILITÉ SOURCE, GELÉE.
 *
 * Ce fichier représente un consommateur TypeScript écrit contre la v1 publique.
 * Il n'est PAS un test d'exécution : il n'est jamais exécuté, seulement compilé.
 * Il doit compiler sans une seule modification, à l'octet près, contre la v1
 * de départ ET contre toute implémentation candidate.
 *
 * NE PAS MODIFIER. Toute modification de ce fichier est une déviation de
 * protocole, pas une réussite.
 *
 * PORTÉE : preuve bornée de compatibilité source sur la surface publique v1
 * documentée dans SPEC.md. La compatibilité universelle avec tout métaprogramme
 * TypeScript possible n'est PAS revendiquée.
 */
import { TaskPlanner } from './src/task-planner.ts';
import type {
  AddResult,
  PlanFailureReason,
  PlanResult,
  Task,
  TaskId,
} from './src/task-planner.ts';

/** Égalité de types stricte, insensible à la simple assignabilité. */
type Exact<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;

const planner = new TaskPlanner();

const first: Task = { id: 'alpha', priority: 'high' };
const added: AddResult = planner.add(first);
if (!added.ok) {
  const reason: 'INVALID_ID' | 'INVALID_PRIORITY' | 'DUPLICATE_ID' = added.reason;
  void reason;
}

/** `plan()` rend un succès, directement, sans discrimination préalable. */
const result: PlanResult = planner.plan();
const order: readonly TaskId[] = result.order;
void order;

/** L'échec de planification n'existe pas en v1, et ne doit pas apparaître. */
type PlanNeverFails = [PlanFailureReason] extends [never] ? true : false;
const planNeverFails: PlanNeverFails = true;
void planNeverFails;

/** `after` n'appartient pas au `Task` v1 : l'erreur attendue doit rester attendue. */
// @ts-expect-error `after` n'appartient pas au Task v1
const legacyTask: Task = { id: 'beta', priority: 'low', after: [] };
void legacyTask;

/** La forme publique de `Task` ne doit ni s'élargir ni se rétrécir. */
const taskShapeUnchanged: Exact<keyof Task, 'id' | 'priority'> = true;
void taskShapeUnchanged;

/** La surface publique de `TaskPlanner` est exactement `add` et `plan`. */
type PlannerKeysUnchanged = Exact<keyof TaskPlanner, 'add' | 'plan'>;
const plannerKeysUnchanged: PlannerKeysUnchanged = true;
void plannerKeysUnchanged;

/** Signature de `add` inchangée, paramètres et retour. */
type AddParametersUnchanged = Exact<Parameters<TaskPlanner['add']>, [task: Task]>;
const addParametersUnchanged: AddParametersUnchanged = true;
void addParametersUnchanged;

type AddReturnUnchanged = Exact<ReturnType<TaskPlanner['add']>, AddResult>;
const addReturnUnchanged: AddReturnUnchanged = true;
void addReturnUnchanged;

/** Signature de `plan` inchangée, paramètres et retour. */
type PlanParametersUnchanged = Exact<Parameters<TaskPlanner['plan']>, []>;
const planParametersUnchanged: PlanParametersUnchanged = true;
void planParametersUnchanged;

type PlanReturnUnchanged = Exact<ReturnType<TaskPlanner['plan']>, PlanResult>;
const planReturnUnchanged: PlanReturnUnchanged = true;
void planReturnUnchanged;
