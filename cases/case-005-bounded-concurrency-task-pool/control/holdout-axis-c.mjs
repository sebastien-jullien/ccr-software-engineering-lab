/** Axe C — sémantique d'échec de tâche. 6 lignes. */
import { barrier, createHarness, isStillPending, outcomeOf } from './deferred-harness.mjs';

const ok = (detail) => ({ pass: true, detail });
const ko = (detail) => ({ pass: false, detail });

export const ROWS_C = [
  {
    id: 'C01', axis: 'C', visibility: 'VISIBLE',
    async run(runPool) {
      const h = createHarness(1);
      const R = new Error('R');
      const p = outcomeOf(runPool(h.tasks, { limit: 1 }));
      await h.waitForStart(0);
      h.reject(0, R);
      const out = await p;
      if (out.state !== 'rejected') return ko(`attendu rejeté, obtenu ${out.state}`);
      return out.reason === R ? ok('raison rendue à l identité') : ko('raison différente');
    },
  },
  {
    id: 'C02', axis: 'C', visibility: 'VISIBLE',
    async run(runPool) {
      const h = createHarness(4);
      const R0 = new Error('R0');
      const outer = runPool(h.tasks, { limit: 2 });
      const p = outcomeOf(outer);
      await Promise.all([h.waitForStart(0), h.waitForStart(1)]);
      h.reject(0, R0);
      await barrier();
      if (h.isStarted(2) || h.isStarted(3)) return ko(`démarrées après échec : ${h.started.join(',')}`);
      const pending = await isStillPending(p);
      if (!pending) return ko('la promesse externe s est réglée avant la quiescence');
      h.fulfill(1, 'b');
      await p;
      return ok('aucun démarrage après échec · externe en attente tant que 1 est en vol');
    },
  },
  {
    id: 'C03', axis: 'C', visibility: 'HIDDEN',
    async run(runPool) {
      const h = createHarness(4);
      const R0 = new Error('R0');
      const p = outcomeOf(runPool(h.tasks, { limit: 2 }));
      await Promise.all([h.waitForStart(0), h.waitForStart(1)]);
      h.reject(0, R0);
      await barrier();
      h.fulfill(1, 'b');
      const out = await p;
      if (out.state !== 'rejected') return ko(`attendu rejeté, obtenu ${out.state}`);
      return out.reason === R0 ? ok('rejette après quiescence, avec la raison de 0') : ko('raison différente');
    },
  },
  {
    id: 'C04', axis: 'C', visibility: 'HIDDEN',
    async run(runPool) {
      const h = createHarness(4);
      const R1 = new Error('R1');
      const R0 = new Error('R0');
      const p = outcomeOf(runPool(h.tasks, { limit: 2 }));
      await Promise.all([h.waitForStart(0), h.waitForStart(1)]);
      h.reject(1, R1);
      await barrier();
      h.reject(0, R0);
      const out = await p;
      if (out.state !== 'rejected') return ko(out.state);
      return out.reason === R1 ? ok('premier rejet observé (R1) retenu') : ko('R0 a remplacé R1');
    },
  },
  {
    id: 'C05', axis: 'C', visibility: 'HIDDEN',
    async run(runPool) {
      const E = new Error('E');
      const h = createHarness(3, { 0: { kind: 'throwSync', error: E } });
      let escaped = null;
      let p;
      try {
        p = outcomeOf(runPool(h.tasks, { limit: 2 }));
      } catch (error) {
        escaped = error;
      }
      if (escaped !== null) return ko('le jet s est échappé synchroniquement de runPool');
      const out = await p;
      if (out.state !== 'rejected') return ko(`attendu rejeté, obtenu ${out.state}`);
      if (out.reason !== E) return ko('valeur jetée non rendue à l identité (enveloppée ?)');
      if (h.startCount() !== 1) return ko(`démarrées ${h.started.join(',')}`);
      return ok('jet synchrone = rejet · E non enveloppée · 1 et 2 non invoquées');
    },
  },
  {
    id: 'C06', axis: 'C', visibility: 'HIDDEN',
    async run(runPool) {
      const h = createHarness(4);
      const controller = new AbortController();
      const R0 = new Error('R0');
      const A = new Error('A');
      const p = outcomeOf(runPool(h.tasks, { limit: 2, signal: controller.signal }));
      await Promise.all([h.waitForStart(0), h.waitForStart(1)]);
      h.reject(0, R0);
      await barrier();
      controller.abort(A);
      h.fulfill(1, 'b');
      const out = await p;
      if (out.state !== 'rejected') return ko(out.state);
      return out.reason === R0 ? ok('ABORT postérieur ne remplace pas TASK_FAILURE') : ko('la cause a été remplacée');
    },
  },
];
