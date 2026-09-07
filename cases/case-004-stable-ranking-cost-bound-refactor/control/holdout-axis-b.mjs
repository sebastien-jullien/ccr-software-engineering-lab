/**
 * CASE-004 — Workloads privés de l'axe B, H9..H15.
 *
 * MATÉRIEL DE CONTROL — AVEUGLE. Tailles, graines, générateurs et compteurs
 * ratifiés ne doivent apparaître dans aucune surface participant, ni dans
 * l'entrée d'une session baseline ou de production CCR.
 *
 * Chaque row n'affirme que le coût : comparison_count <= n * ceil(log2 n).
 */
export const ceilLog2 = (n) => 32 - Math.clz32(n - 1);
export const bound = (c, n) => c * n * ceilLog2(n);

const lcg = (seed) => () => (seed = (seed * 1103515245 + 12345) >>> 0);

function shuffled(n, seed) {
  const next = lcg(seed);
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i -= 1) {
    const j = next() % (i + 1);
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

/** xorshift32, état uint32, graine 0xC0040010. */
function xorshift32(seed) {
  let state = seed >>> 0;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state;
  };
}

function fisherYatesXorshift(n, seed) {
  const values = Array.from({ length: n }, (_, i) => i);
  const next = xorshift32(seed);
  for (let i = n - 1; i >= 1; i -= 1) {
    const j = next() % (i + 1);
    const t = values[i]; values[i] = values[j]; values[j] = t;
  }
  return values;
}

const num = (a, b) => a - b;

export const HOLDOUTS = [
  { id: 'H9', shape: 'reverse distinct numeric', n: 383,
    items: () => Array.from({ length: 383 }, (_, i) => 382 - i), compare: num },
  { id: 'H10', shape: 'deterministic shuffled distinct numeric', n: 389,
    items: () => fisherYatesXorshift(389, 0xC0040010), compare: num },
  { id: 'H11', shape: 'organ-pipe', n: 192,
    items: () => Array.from({ length: 192 }, (_, i) => (i < 96 ? i : 191 - i)), compare: num },
  { id: 'H12', shape: 'alternating rank blocks', n: 256,
    items: () => Array.from({ length: 256 }, (_, i) => (i % 2 === 0 ? 1000 + i : i)), compare: num },
  { id: 'H13', shape: 'tie-heavy deterministic shuffle', n: 300,
    items: () => shuffled(300, 777001).map((v) => v % 12), compare: num },
  { id: 'H14', shape: 'compound-key object comparator', n: 257,
    items: () => shuffled(257, 4242).map((v, i) => ({ major: v % 7, minor: v, seat: i })),
    compare: (l, r) => (l.major - r.major) || (l.minor - r.minor) },
  { id: 'H15', shape: 'larger deterministic pseudo-random ordering', n: 512,
    items: () => shuffled(512, 99887766), compare: num },
];

/** Pureté stricte : on compte, on borne, et rien d'autre. */
export async function countHoldouts(modulePath) {
  const { stableRank } = await import(modulePath);
  const counts = {};
  for (const w of HOLDOUTS) {
    let counter = 0;
    stableRank(w.items(), (l, r) => { counter += 1; return w.compare(l, r); });
    counts[w.id] = counter;
  }
  return counts;
}

/**
 * Rows B privées, pureté stricte : chaque row n'affirme que
 * comparison_count <= n * ceil(log2 n). Aucune assertion d'ordre, de
 * stabilité, d'identité ni de mutation.
 */
export async function defineAxisBHoldouts({ label, load }, test, assert) {
  for (const w of HOLDOUTS) {
    test(`${w.id} [${label}] — ${w.shape}, n = ${w.n}`, async () => {
      const { stableRank } = await load();
      let count = 0;
      stableRank(w.items(), (l, r) => { count += 1; return w.compare(l, r); });
      const limit = bound(1, w.n);
      assert.ok(count <= limit, `comparaisons ${count} > borne ${limit}`);
    });
  }
}
