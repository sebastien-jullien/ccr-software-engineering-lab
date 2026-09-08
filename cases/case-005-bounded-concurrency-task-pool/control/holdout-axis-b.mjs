/**
 * Axe B — borne de concurrence et progression. 8 lignes.
 *
 * Discipline d'observation, tenue partout dans cet axe :
 *
 *   assertion POSITIVE de progression  →  attendue DIRECTEMENT (waitForStart)
 *                                         aucune échéance, aucun délai
 *   assertion NÉGATIVE de borne        →  constatée à une barrière du harnais
 *
 * Une implémentation qui ne progresse pas ne fait jamais échouer une attente :
 * elle laisse le processus isolé se terminer, et c'est cette fin naturelle qui
 * vaut ROW FAIL.
 */
import { barrier, createHarness, outcomeOf } from './deferred-harness.mjs';

const ok = (detail) => ({ pass: true, detail });
const ko = (detail) => ({ pass: false, detail });

export const ROWS_B = [
  {
    id: 'B01', axis: 'B', visibility: 'VISIBLE',
    async run(runPool) {
      const h = createHarness(5);
      outcomeOf(runPool(h.tasks, { limit: 2 }));
      await Promise.all([h.waitForStart(0), h.waitForStart(1)]);
      await barrier();
      if (h.isStarted(2) || h.isStarted(3) || h.isStarted(4)) return ko(`démarrées ${h.started.join(',')}`);
      if (h.peak() > 2) return ko(`pic ${h.peak()}`);
      return ok('remplissage initial {0,1}, pic 2');
    },
  },
  {
    id: 'B02', axis: 'B', visibility: 'VISIBLE',
    async run(runPool) {
      const h = createHarness(5);
      outcomeOf(runPool(h.tasks, { limit: 2 }));
      await Promise.all([h.waitForStart(0), h.waitForStart(1)]);
      h.fulfill(0, 'a');
      await h.waitForStart(2);                 // progression, attendue directement
      await barrier();
      if (h.isStarted(3)) return ko('la tâche 3 a démarré : deux recharges pour un règlement');
      if (h.peak() > 2) return ko(`pic ${h.peak()}`);
      return ok('un règlement → exactement une recharge (2), 1 encore en vol');
    },
  },
  {
    id: 'B03', axis: 'B', visibility: 'HIDDEN',
    async run(runPool) {
      const h = createHarness(5);
      outcomeOf(runPool(h.tasks, { limit: 2 }));
      await Promise.all([h.waitForStart(0), h.waitForStart(1)]);
      h.fulfill(1, 'b');                       // c'est la tâche 1 qui libère
      await h.waitForStart(2);
      await barrier();
      if (h.isStarted(3)) return ko('la tâche 3 a démarré');
      if (h.peak() > 2) return ko(`pic ${h.peak()}`);
      return ok('recharge = plus petit index en file, quel que soit le créneau libéré');
    },
  },
  {
    id: 'B04', axis: 'B', visibility: 'HIDDEN',
    async run(runPool) {
      const h = createHarness(6);
      outcomeOf(runPool(h.tasks, { limit: 3 }));
      await Promise.all([h.waitForStart(0), h.waitForStart(1), h.waitForStart(2)]);
      h.fulfill(0, 'a');
      h.fulfill(1, 'b');
      await Promise.all([h.waitForStart(3), h.waitForStart(4)]);
      await barrier();
      if (h.isStarted(5)) return ko('la tâche 5 a démarré : trois recharges pour deux règlements');
      if (h.peak() > 3) return ko(`pic ${h.peak()}`);
      return ok('deux règlements → exactement deux recharges (3,4)');
    },
  },
  {
    id: 'B05', axis: 'B', visibility: 'HIDDEN',
    async run(runPool) {
      const h = createHarness(3);
      outcomeOf(runPool(h.tasks, { limit: 1 }));
      await h.waitForStart(0);
      await barrier();
      if (h.isStarted(1)) return ko('la tâche 1 a démarré alors que 0 est en vol');
      if (h.peak() > 1) return ko(`pic ${h.peak()}`);
      return ok('limit 1 → sérialisation stricte');
    },
  },
  {
    id: 'B06', axis: 'B', visibility: 'HIDDEN',
    async run(runPool) {
      const h = createHarness(3);
      outcomeOf(runPool(h.tasks, { limit: 5 }));
      await Promise.all([h.waitForStart(0), h.waitForStart(1), h.waitForStart(2)]);
      await barrier();
      if (h.startCount() !== 3) return ko(`démarrées ${h.startCount()}`);
      if (h.started.join(',') !== '0,1,2') return ko(`ordre ${h.started.join(',')}`);
      return ok('limit >= n → aucune file, aucune recharge');
    },
  },
  {
    id: 'B07', axis: 'B', visibility: 'HIDDEN',
    async run(runPool) {
      const n = 12;
      const limit = 4;
      const h = createHarness(n);
      const p = outcomeOf(runPool(h.tasks, { limit }));
      const settled = new Set();
      for (let done = 0; done < n; done += 1) {
        await h.waitForStart(done);
        const candidates = h.started.filter((i) => !settled.has(i));
        const pick = candidates[0];
        settled.add(pick);
        h.fulfill(pick, String(pick));
      }
      const out = await p;
      if (out.state !== 'fulfilled') return ko(out.state);
      if (h.peak() !== limit) return ko(`pic ${h.peak()}, ${limit} attendu`);
      return ok(`pic exactement ${limit}, jamais ${limit + 1}`);
    },
  },
  {
    id: 'B08', axis: 'B', visibility: 'HIDDEN',
    async run(runPool) {
      const h = createHarness(4);
      outcomeOf(runPool(h.tasks, { limit: 2 }));
      await Promise.all([h.waitForStart(0), h.waitForStart(1)]);
      h.fulfill(0, 'a');
      await h.waitForStart(2);                 // la tâche 1 ne sera JAMAIS réglée
      await barrier();
      const verdict = h.isStarted(3)
        ? ko('la tâche 3 a démarré')
        : h.peak() > 2
          ? ko(`pic ${h.peak()}`)
          : ok('2 démarrée pendant que 1 reste en vol · 3 en file · pic 2');
      // Stimulus de NETTOYAGE, postérieur au verdict : jamais une preuve.
      h.fulfill(1, 'b');
      h.fulfill(2, 'c');
      return { ...verdict, detail: `${verdict.detail} · nettoyage postérieur au verdict` };
    },
  },
];
