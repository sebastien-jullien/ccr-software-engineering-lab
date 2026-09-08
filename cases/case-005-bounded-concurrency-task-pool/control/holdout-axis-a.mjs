/** Axe A — ordre d'invocation et ordre des résultats. 9 lignes. */
import { createHarness, outcomeOf } from './deferred-harness.mjs';

const ok = (detail) => ({ pass: true, detail });
const ko = (detail) => ({ pass: false, detail });

export const ROWS_A = [
  {
    id: 'A01', axis: 'A', visibility: 'VISIBLE',
    async run(runPool) {
      const h = createHarness(0);
      const out = await outcomeOf(runPool(h.tasks, { limit: 3 }));
      if (out.state !== 'fulfilled') return ko(`attendu résolu, obtenu ${out.state}`);
      if (!Array.isArray(out.value) || out.value.length !== 0) return ko('tableau vide attendu');
      if (h.startCount() !== 0) return ko('aucune invocation attendue');
      return ok('[] · 0 invocation');
    },
  },
  {
    id: 'A02', axis: 'A', visibility: 'VISIBLE',
    async run(runPool) {
      const h = createHarness(1);
      const p = outcomeOf(runPool(h.tasks, { limit: 1 }));
      await h.waitForStart(0);
      h.fulfill(0, 'a');
      const out = await p;
      if (out.state !== 'fulfilled') return ko(`attendu résolu, obtenu ${out.state}`);
      return out.value.length === 1 && out.value[0] === 'a' ? ok("['a']") : ko(JSON.stringify(out.value));
    },
  },
  {
    id: 'A03', axis: 'A', visibility: 'HIDDEN',
    async run(runPool) {
      const h = createHarness(3);
      const p = outcomeOf(runPool(h.tasks, { limit: 5 }));
      await Promise.all([h.waitForStart(0), h.waitForStart(1), h.waitForStart(2)]);
      h.fulfill(0, 'a'); h.fulfill(1, 'b'); h.fulfill(2, 'c');
      const out = await p;
      if (out.state !== 'fulfilled') return ko(out.state);
      if (h.peak() !== 3) return ko(`pic ${h.peak()}, 3 attendu`);
      return out.value.join('') === 'abc' ? ok('abc · pic 3') : ko(out.value.join(''));
    },
  },
  {
    id: 'A04', axis: 'A', visibility: 'HIDDEN',
    async run(runPool) {
      const h = createHarness(3);
      const p = outcomeOf(runPool(h.tasks, { limit: 5 }));
      await Promise.all([h.waitForStart(0), h.waitForStart(1), h.waitForStart(2)]);
      h.fulfill(2, 'c'); h.fulfill(0, 'a'); h.fulfill(1, 'b');
      const out = await p;
      if (out.state !== 'fulfilled') return ko(out.state);
      return out.value.join('') === 'abc' ? ok('règlement 2,0,1 → abc') : ko(out.value.join(''));
    },
  },
  {
    id: 'A05', axis: 'A', visibility: 'VISIBLE',
    async run(runPool) {
      const h = createHarness(4);
      const p = outcomeOf(runPool(h.tasks, { limit: 1 }));
      for (let i = 0; i < 4; i += 1) { await h.waitForStart(i); h.fulfill(i, String(i)); }
      const out = await p;
      if (out.state !== 'fulfilled') return ko(out.state);
      if (h.started.join(',') !== '0,1,2,3') return ko(`ordre ${h.started.join(',')}`);
      // Le texte gelé de A05 note DEUX choses : le journal d'invocation et
      // l'ordre des valeurs. Le pic est une propriété globale du contrat,
      // notée par l'axe B ; il n'est ici qu'un DIAGNOSTIC.
      return out.value.join('') === '0123'
        ? ok(`journal 0,1,2,3 · valeurs en ordre d index · pic observé ${h.peak()} (diagnostic)`)
        : ko(out.value.join(''));
    },
  },
  {
    id: 'A06', axis: 'A', visibility: 'HIDDEN',
    async run(runPool) {
      const h = createHarness(5);
      const p = outcomeOf(runPool(h.tasks, { limit: 2 }));
      const order = [1, 0, 3, 2, 4];
      for (const i of order) { await h.waitForStart(i); h.fulfill(i, String(i)); }
      const out = await p;
      if (out.state !== 'fulfilled') return ko(out.state);
      return out.value.join('') === '01234' ? ok('règlement mélangé → ordre d index') : ko(out.value.join(''));
    },
  },
  {
    id: 'A07', axis: 'A', visibility: 'HIDDEN',
    async run(runPool) {
      const n = 200;
      const limit = 7;
      const h = createHarness(n);
      const p = outcomeOf(runPool(h.tasks, { limit }));
      // Fenêtres consécutives FIXES : W0 = 0..6, W1 = 7..13, …, W28 = 196..199.
      // Chaque fenêtre est attendue entièrement démarrée, puis réglée en index
      // STRICTEMENT DÉCROISSANT ; aucune tâche de la fenêtre suivante n'est
      // réglée avant l'achèvement de la courante.
      //   6,5,4,3,2,1,0 · 13,12,…,7 · 20,19,…,14 · … · 199,198,197,196
      for (let base = 0; base < n; base += limit) {
        const end = Math.min(base + limit, n);
        for (let i = base; i < end; i += 1) await h.waitForStart(i);
        for (let i = end - 1; i >= base; i -= 1) h.fulfill(i, String(i));
      }
      const out = await p;
      if (out.state !== 'fulfilled') return ko(out.state);
      // Seule vérité notée : les 200 résultats sont en ordre d'index d'origine.
      // Le pic est une propriété globale du contrat, notée par l'axe B ; il n'est
      // ici qu'un DIAGNOSTIC.
      const expected = Array.from({ length: n }, (_, i) => String(i)).join('|');
      return out.value.join('|') === expected
        ? ok(`${n} résultats en ordre d index · pic observé ${h.peak()} (diagnostic)`)
        : ko('ordre incorrect');
    },
  },
  {
    id: 'A08', axis: 'A', visibility: 'HIDDEN',
    async run(runPool) {
      const h = createHarness(3);
      const p = outcomeOf(runPool(h.tasks, { limit: 3 }));
      await Promise.all([h.waitForStart(0), h.waitForStart(1), h.waitForStart(2)]);
      h.fulfill(0, undefined); h.fulfill(1, null); h.fulfill(2, 0);
      const out = await p;
      if (out.state !== 'fulfilled') return ko(out.state);
      const v = out.value;
      return v.length === 3 && v[0] === undefined && v[1] === null && v[2] === 0
        ? ok('undefined · null · 0 préservés') : ko(JSON.stringify(v));
    },
  },
  {
    id: 'A09', axis: 'A', visibility: 'HIDDEN',
    async run(runPool) {
      const h = createHarness(3, {
        0: { kind: 'resolved', value: 'a' },
        1: { kind: 'resolved', value: 'b' },
        2: { kind: 'resolved', value: 'c' },
      });
      const out = await outcomeOf(runPool(h.tasks, { limit: 2 }));
      if (out.state !== 'fulfilled') return ko(out.state);
      if (h.peak() > 2) return ko(`pic ${h.peak()}`);
      return out.value.join('') === 'abc' ? ok('promesses déjà résolues → abc') : ko(out.value.join(''));
    },
  },
];
