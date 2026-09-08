/**
 * Tests visibles — 10 des 30 lignes de vérité de CASE-005.
 *
 * Ces tests sont le sous-ensemble PUBLIC de la matrice d'évaluation. Les 20
 * lignes restantes ne sont pas distribuées : réussir ce fichier ne prouve donc
 * pas la conformité au contrat, et `SPEC.md` reste la seule autorité.
 *
 * Ce fichier n'est pas modifiable.
 *
 * Aucun test n'impose de délai. Un test qui ne se termine jamais est un
 * résultat, pas un incident : il signifie qu'une progression exigée par
 * `SPEC.md` §4 n'a pas eu lieu (voir §4.1, autorité d'exécution isolée).
 *
 *   node --test
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import { runPool } from '../src/task-pool.ts';

/* ------------------------------------------------------------------ *
 * Harnais local — les règlements sont déclenchés par le test lui-même.
 * ------------------------------------------------------------------ */

/** Barrière d'observation du test. Jamais une échéance de progression. */
const barrier = () => new Promise((resolve) => setImmediate(resolve));

function createTasks(n) {
  const started = [];
  const settled = new Set();
  const deferreds = [];
  const waiters = new Map();
  let inFlight = 0;
  let peak = 0;

  const noteStart = (i) => {
    started.push(i);
    inFlight += 1;
    if (inFlight > peak) peak = inFlight;
    const list = waiters.get(i);
    if (list !== undefined) {
      waiters.delete(i);
      for (const w of list) w();
    }
  };
  const noteSettle = (i) => {
    if (settled.has(i)) return;
    settled.add(i);
    inFlight -= 1;
  };

  const tasks = [];
  for (let i = 0; i < n; i += 1) {
    tasks.push(() => {
      noteStart(i);
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
    fulfill(i, value) { noteSettle(i); deferreds[i]?.resolve(value); },
    reject(i, error) { noteSettle(i); deferreds[i]?.reject(error); },
    /** Attend le DÉMARRAGE réel de la tâche `i`. Ne se règle jamais s'il n'a pas lieu. */
    waitForStart(i) {
      if (started.includes(i)) return Promise.resolve();
      return new Promise((resolve) => {
        const list = waiters.get(i) ?? [];
        list.push(resolve);
        waiters.set(i, list);
      });
    },
  };
}

/** Issue d'une promesse, sans jamais lever. */
async function outcomeOf(promise) {
  try {
    return { state: 'fulfilled', value: await promise };
  } catch (error) {
    return { state: 'rejected', reason: error };
  }
}

/** Vrai si la promesse n'est pas réglée après une barrière d'observation. */
async function isStillPending(promise) {
  const marker = Symbol('pending');
  const raced = await Promise.race([
    promise.then(() => 'settled', () => 'settled'),
    barrier().then(() => marker),
  ]);
  return raced === marker;
}

/* ------------------------------------------------------------------ *
 * Axe A — invocation, bornage, ordre des résultats
 * ------------------------------------------------------------------ */

test('A01 — tâches vides : résolution avec [] et zéro invocation', async () => {
  const h = createTasks(0);
  const out = await outcomeOf(runPool(h.tasks, { limit: 3 }));
  assert.equal(out.state, 'fulfilled');
  assert.deepEqual([...out.value], []);
  assert.equal(h.startCount(), 0);
});

test('A02 — tâche unique : la valeur remonte à sa position', async () => {
  const h = createTasks(1);
  const p = outcomeOf(runPool(h.tasks, { limit: 1 }));
  await h.waitForStart(0);
  h.fulfill(0, 'a');
  const out = await p;
  assert.equal(out.state, 'fulfilled');
  assert.deepEqual([...out.value], ['a']);
});

test('A05 — limit = 1 : journal d invocation et ordre des valeurs', async () => {
  const h = createTasks(4);
  const p = outcomeOf(runPool(h.tasks, { limit: 1 }));
  for (let i = 0; i < 4; i += 1) {
    await h.waitForStart(i);
    h.fulfill(i, String(i));
  }
  const out = await p;
  assert.equal(out.state, 'fulfilled');
  assert.deepEqual(h.started, [0, 1, 2, 3]);
  assert.deepEqual([...out.value], ['0', '1', '2', '3']);
  // La borne de concurrence est une propriété globale du contrat (SPEC §3),
  // couverte par les lignes de l axe B. A05 ne la note pas.
});

/* ------------------------------------------------------------------ *
 * Axe B — bornage de la concurrence et recharge des créneaux
 * ------------------------------------------------------------------ */

test('B01 — remplissage initial borné : exactement limit tâches démarrent', async () => {
  const h = createTasks(5);
  void outcomeOf(runPool(h.tasks, { limit: 2 }));
  await Promise.all([h.waitForStart(0), h.waitForStart(1)]);
  await barrier();
  assert.equal(h.isStarted(2), false);
  assert.equal(h.isStarted(3), false);
  assert.equal(h.isStarted(4), false);
  assert.equal(h.peak() <= 2, true);
});

test('B02 — un règlement libère exactement un créneau', async () => {
  const h = createTasks(5);
  void outcomeOf(runPool(h.tasks, { limit: 2 }));
  await Promise.all([h.waitForStart(0), h.waitForStart(1)]);
  h.fulfill(0, 'a');
  // Progression exigée : la tâche 2 doit démarrer alors que la tâche 1
  // reste délibérément en vol. Cette attente n'a aucune échéance.
  await h.waitForStart(2);
  await barrier();
  assert.equal(h.isStarted(3), false, 'deux recharges pour un seul règlement');
  assert.equal(h.peak() <= 2, true);
});

/* ------------------------------------------------------------------ *
 * Axe C — échec de tâche, cause d arrêt, quiescence
 * ------------------------------------------------------------------ */

test('C01 — rejet d une tâche : la raison remonte à l identité', async () => {
  const h = createTasks(1);
  const R = new Error('R');
  const p = outcomeOf(runPool(h.tasks, { limit: 1 }));
  await h.waitForStart(0);
  h.reject(0, R);
  const out = await p;
  assert.equal(out.state, 'rejected');
  assert.equal(out.reason, R);
});

test('C02 — après échec : aucun démarrage, et pas de rejet avant quiescence', async () => {
  const h = createTasks(4);
  const R0 = new Error('R0');
  const p = outcomeOf(runPool(h.tasks, { limit: 2 }));
  await Promise.all([h.waitForStart(0), h.waitForStart(1)]);
  h.reject(0, R0);
  await barrier();
  assert.equal(h.isStarted(2), false);
  assert.equal(h.isStarted(3), false);
  assert.equal(await isStillPending(p), true, 'réglée avant la quiescence');
  h.fulfill(1, 'b');
  const out = await p;
  assert.equal(out.state, 'rejected');
  assert.equal(out.reason, R0);
});

/* ------------------------------------------------------------------ *
 * Axe D — avortement
 * ------------------------------------------------------------------ */

test('D01 — abort préexistant : rejet immédiat, zéro invocation', async () => {
  // Composite : deux sous-cas, deux invocations et deux contrôleurs frais.
  const c1 = new AbortController();
  const A1 = new Error('A1');
  c1.abort(A1);
  const h1 = createTasks(3);
  const out1 = await outcomeOf(runPool(h1.tasks, { limit: 2, signal: c1.signal }));
  assert.equal(out1.state, 'rejected');
  assert.equal(out1.reason, A1);
  assert.equal(h1.startCount(), 0);

  const c2 = new AbortController();
  const A2 = new Error('A2');
  c2.abort(A2);
  const h2 = createTasks(0);
  const out2 = await outcomeOf(runPool(h2.tasks, { limit: 2, signal: c2.signal }));
  assert.equal(out2.state, 'rejected', 'l abort prime sur la résolution []');
  assert.equal(out2.reason, A2);
});

test('D02 — abort en cours de route : aucun démarrage, quiescence respectée', async () => {
  const h = createTasks(4);
  const controller = new AbortController();
  const A = new Error('A');
  const p = outcomeOf(runPool(h.tasks, { limit: 2, signal: controller.signal }));
  await Promise.all([h.waitForStart(0), h.waitForStart(1)]);
  controller.abort(A);
  await barrier();
  assert.equal(h.isStarted(2), false);
  assert.equal(h.isStarted(3), false);
  assert.equal(await isStillPending(p), true, 'réglée avant la quiescence');
  h.fulfill(0, 'a');
  h.fulfill(1, 'b');
  const out = await p;
  assert.equal(out.state, 'rejected');
  assert.equal(out.reason, A);
});

/* ------------------------------------------------------------------ *
 * Axe E — validation d entrée
 * ------------------------------------------------------------------ */

test('E01 — limit invalide : RangeError synchrone, zéro invocation', async () => {
  const INVALID = [0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY, 2 ** 53];
  for (const limit of INVALID) {
    const h = createTasks(3);
    let threw = null;
    let returned = null;
    try {
      returned = runPool(h.tasks, { limit });
    } catch (error) {
      threw = error;
    }
    if (returned !== null) {
      await outcomeOf(returned);
      assert.fail(`limit=${String(limit)} : promesse rendue au lieu d un jet synchrone`);
    }
    assert.ok(threw instanceof RangeError, `limit=${String(limit)} : ${String(threw)}`);
    assert.equal(h.startCount(), 0, `limit=${String(limit)}`);
  }
});
