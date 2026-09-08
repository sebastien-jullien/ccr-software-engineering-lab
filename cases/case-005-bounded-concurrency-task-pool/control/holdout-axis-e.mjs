/** Axe E — validation d'entrée. 2 lignes. */
import { createHarness, outcomeOf } from './deferred-harness.mjs';

const ok = (detail) => ({ pass: true, detail });
const ko = (detail) => ({ pass: false, detail });

const INVALID = [0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY, 2 ** 53];

export const ROWS_E = [
  {
    id: 'E01', axis: 'E', visibility: 'VISIBLE',
    async run(runPool) {
      for (const limit of INVALID) {
        const h = createHarness(3);
        let threw = null;
        let returned = null;
        try {
          returned = runPool(h.tasks, { limit });
        } catch (error) {
          threw = error;
        }
        if (returned !== null) {
          await outcomeOf(returned);
          return ko(`limit=${String(limit)} : promesse rendue au lieu d un jet synchrone`);
        }
        if (!(threw instanceof RangeError)) return ko(`limit=${String(limit)} : ${String(threw)} au lieu d un RangeError`);
        if (h.startCount() !== 0) return ko(`limit=${String(limit)} : ${h.startCount()} invocation(s)`);
      }
      return ok(`${INVALID.length} valeurs invalides · RangeError synchrone · 0 invocation`);
    },
  },
  {
    id: 'E02', axis: 'E', visibility: 'HIDDEN',
    async run(runPool) {
      const controller = new AbortController();
      controller.abort(new Error('A'));
      const h = createHarness(3);
      let threw = null;
      let returned = null;
      try {
        returned = runPool(h.tasks, { limit: 0, signal: controller.signal });
      } catch (error) {
        threw = error;
      }
      if (returned !== null) {
        await outcomeOf(returned);
        return ko('abort a primé : promesse rendue au lieu du jet de validation');
      }
      if (!(threw instanceof RangeError)) return ko(`${String(threw)} au lieu d un RangeError`);
      if (h.startCount() !== 0) return ko('des tâches ont été invoquées');
      return ok('limit invalide prime sur un abort préexistant');
    },
  },
];
