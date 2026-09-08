/**
 * Harnais différé — l'évaluateur contrôle chaque règlement.
 *
 * Aucun timer, aucune durée, aucun seuil. Le harnais n'observe que ce qu'il a
 * lui-même déclenché, et attend l'événement qui l'intéresse plutôt qu'un délai.
 *
 * `barrier()` n'est PAS un délai imposé au participant : c'est un ordonnancement
 * d'actions du harnais, employé seulement pour séparer deux actions contrôlées
 * ou constater qu'une promesse externe n'est pas encore réglée.
 */

/** Barrière d'observation du harnais. Jamais une échéance de progression. */
export function barrier() {
  return new Promise((resolve) => setImmediate(resolve));
}

/**
 * Crée `n` tâches différées.
 *
 * `behavior[i]` peut valoir :
 *   { kind: 'deferred' }                        défaut — réglée par le harnais
 *   { kind: 'throwSync', error }                jette synchroniquement
 *   { kind: 'abortThenPending', controller, reason }
 *                                               avorte le signal, puis reste en vol
 *   { kind: 'resolved', value }                 rend une promesse déjà résolue
 */
export function createHarness(n, behavior = {}) {
  const started = [];
  const settled = new Set();
  const deferreds = [];
  const startWaiters = new Map();
  let inFlight = 0;
  let peak = 0;

  const noteStart = (i) => {
    started.push(i);
    inFlight += 1;
    if (inFlight > peak) peak = inFlight;
    const waiters = startWaiters.get(i);
    if (waiters !== undefined) {
      startWaiters.delete(i);
      for (const w of waiters) w();
    }
  };
  const noteSettle = (i) => {
    if (settled.has(i)) return;
    settled.add(i);
    inFlight -= 1;
  };

  const tasks = [];
  for (let i = 0; i < n; i += 1) {
    const spec = behavior[i] ?? { kind: 'deferred' };
    tasks.push(() => {
      noteStart(i);
      if (spec.kind === 'throwSync') {
        noteSettle(i);
        throw spec.error;
      }
      if (spec.kind === 'abortThenPending') {
        spec.controller.abort(spec.reason);
        return new Promise((resolve, reject) => {
          deferreds[i] = { resolve, reject };
        });
      }
      if (spec.kind === 'resolved') {
        noteSettle(i);
        return Promise.resolve(spec.value);
      }
      return new Promise((resolve, reject) => {
        deferreds[i] = { resolve, reject };
      });
    });
  }

  return {
    tasks,
    started,
    isStarted: (i) => started.includes(i),
    startCount: () => started.length,
    peak: () => peak,
    inFlight: () => inFlight,
    fulfill(i, value) {
      noteSettle(i);
      deferreds[i]?.resolve(value);
    },
    reject(i, error) {
      noteSettle(i);
      deferreds[i]?.reject(error);
    },
    /** Attend le DÉMARRAGE réel de la tâche `i`. Ne se règle jamais s'il n'a pas lieu. */
    waitForStart(i) {
      if (started.includes(i)) return Promise.resolve();
      return new Promise((resolve) => {
        const list = startWaiters.get(i) ?? [];
        list.push(resolve);
        startWaiters.set(i, list);
      });
    },
  };
}

/** Issue d'une promesse, sans jamais lever. */
export async function outcomeOf(promise) {
  try {
    return { state: 'fulfilled', value: await promise };
  } catch (error) {
    return { state: 'rejected', reason: error };
  }
}

/** Vrai si la promesse n'est pas réglée après une barrière d'observation. */
export async function isStillPending(promise) {
  const marker = Symbol('pending');
  const raced = await Promise.race([
    promise.then(() => 'settled', () => 'settled'),
    barrier().then(() => marker),
  ]);
  return raced === marker;
}
