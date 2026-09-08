/** Axe D — sémantique d'AbortSignal. 5 lignes. */
import { barrier, createHarness, isStillPending, outcomeOf } from './deferred-harness.mjs';

const ok = (detail) => ({ pass: true, detail });
const ko = (detail) => ({ pass: false, detail });

export const ROWS_D = [
  {
    id: 'D01', axis: 'D', visibility: 'VISIBLE',
    async run(runPool) {
      // Composite : deux sous-cas, deux invocations et deux contrôleurs frais.
      const c1 = new AbortController();
      const A1 = new Error('A1');
      c1.abort(A1);
      const h1 = createHarness(3);
      const out1 = await outcomeOf(runPool(h1.tasks, { limit: 2, signal: c1.signal }));
      if (out1.state !== 'rejected') return ko(`tâches non vides : attendu rejeté, obtenu ${out1.state}`);
      if (out1.reason !== A1) return ko('raison non rendue à l identité (non vide)');
      if (h1.startCount() !== 0) return ko('des tâches ont été invoquées malgré un abort préexistant');

      const c2 = new AbortController();
      const A2 = new Error('A2');
      c2.abort(A2);
      const h2 = createHarness(0);
      const out2 = await outcomeOf(runPool(h2.tasks, { limit: 2, signal: c2.signal }));
      if (out2.state !== 'rejected') return ko('tâches vides : l abort doit primer sur la résolution []');
      if (out2.reason !== A2) return ko('raison non rendue à l identité (vide)');
      return ok('abort préexistant prime · sur tâches non vides ET sur tâches vides');
    },
  },
  {
    id: 'D02', axis: 'D', visibility: 'VISIBLE',
    async run(runPool) {
      const h = createHarness(4);
      const controller = new AbortController();
      const A = new Error('A');
      const p = outcomeOf(runPool(h.tasks, { limit: 2, signal: controller.signal }));
      await Promise.all([h.waitForStart(0), h.waitForStart(1)]);
      controller.abort(A);
      await barrier();
      if (h.isStarted(2) || h.isStarted(3)) return ko(`démarrées après abort : ${h.started.join(',')}`);
      const pending = await isStillPending(p);
      if (!pending) return ko('la promesse externe s est réglée avant la quiescence');
      h.fulfill(0, 'a');
      h.fulfill(1, 'b');
      const out = await p;
      if (out.state !== 'rejected' || out.reason !== A) return ko('raison finale incorrecte');
      return ok('aucun démarrage après abort · externe en attente · raison = signal.reason');
    },
  },
  {
    id: 'D03', axis: 'D', visibility: 'HIDDEN',
    async run(runPool) {
      const controller = new AbortController();
      const A = new Error('A');
      const h = createHarness(3, {
        0: { kind: 'abortThenPending', controller, reason: A },
      });
      const p = outcomeOf(runPool(h.tasks, { limit: 3, signal: controller.signal }));
      await h.waitForStart(0);
      await barrier();
      if (h.isStarted(1) || h.isStarted(2)) return ko(`démarrées malgré l abort synchrone : ${h.started.join(',')}`);
      if (h.startCount() !== 1) return ko(`invocations ${h.startCount()}`);
      const pending = await isStillPending(p);
      if (!pending) return ko('externe réglée alors que la tâche 0 est encore en vol');
      h.fulfill(0, 'a');
      const out = await p;
      if (out.state !== 'rejected' || out.reason !== A) return ko('raison finale incorrecte');
      return ok('abort synchrone pendant l invocation 0 → 1 et 2 jamais invoquées');
    },
  },
  {
    id: 'D04', axis: 'D', visibility: 'HIDDEN',
    async run(runPool) {
      const h = createHarness(4);
      const controller = new AbortController();
      const A = new Error('A');
      const R0 = new Error('R0');
      const p = outcomeOf(runPool(h.tasks, { limit: 2, signal: controller.signal }));
      await Promise.all([h.waitForStart(0), h.waitForStart(1)]);
      controller.abort(A);
      await barrier();
      h.reject(0, R0);
      h.fulfill(1, 'b');
      const out = await p;
      if (out.state !== 'rejected') return ko(out.state);
      return out.reason === A ? ok('TASK_FAILURE postérieur ne remplace pas ABORT') : ko('la cause a été remplacée');
    },
  },
  {
    id: 'D05', axis: 'D', visibility: 'HIDDEN',
    async run(runPool) {
      const h = createHarness(2);
      const controller = new AbortController();
      const A = new Error('A');
      const outer = runPool(h.tasks, { limit: 2, signal: controller.signal });
      const first = outcomeOf(outer);
      await Promise.all([h.waitForStart(0), h.waitForStart(1)]);
      h.fulfill(0, 'a');
      h.fulfill(1, 'b');
      const out = await first;
      if (out.state !== 'fulfilled') return ko(`attendu accompli, obtenu ${out.state}`);
      if (out.value.join('') !== 'ab') return ko(out.value.join(''));
      // Le succès est engagé. L'abort qui suit doit être sans effet — la MÊME
      // promesse est réinterrogée après coup.
      controller.abort(A);
      await barrier();
      const again = await outcomeOf(outer);
      if (again.state !== 'fulfilled') return ko('l abort a rétroagi sur un succès engagé');
      return again.value.join('') === 'ab' ? ok('abort postérieur au succès : inerte') : ko(again.value.join(''));
    },
  },
];
