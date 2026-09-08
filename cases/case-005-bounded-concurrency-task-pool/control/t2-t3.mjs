/**
 * Portes T2 et T3 — intégrité de l'arbre rendu.
 *
 *   T2   package.json et package-lock.json inchangés · dépendances ajoutées = 0
 *   T3   seul `src/task-pool.ts` diffère de l'arbre participant figé
 *
 * Ni l'une ni l'autre ne rapporte de point. Leur échec rend le rendu INVALIDE.
 *
 * L'inventaire de référence est `participant-baseline.sha256`, produit par
 * `freeze-manifest.mjs` à partir de l'arbre figé.
 *
 *   node t2-t3.mjs --tree <arbre>
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hashTree, MUTABLE_PATH, PARTICIPANT_DIR } from './baseline.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BASELINE_FILE = path.join(HERE, 'participant-baseline.sha256');

const FROZEN_PACKAGE_PATHS = ['package.json', 'package-lock.json'];

/** Lit l'inventaire figé `sha256␣␣chemin`. */
export function readBaseline() {
  const manifest = {};
  for (const line of readFileSync(BASELINE_FILE, 'utf8').split('\n')) {
    const m = /^([0-9a-f]{64})\s+(.+)$/.exec(line.trim());
    if (m) manifest[m[2]] = m[1];
  }
  return manifest;
}

function dependencyNames(json) {
  const pkg = JSON.parse(json);
  return [
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
    ...Object.keys(pkg.optionalDependencies ?? {}),
  ].sort();
}

export function runT2T3(tree) {
  const baseline = readBaseline();
  const actual = hashTree(tree);

  const missing = Object.keys(baseline).filter((p) => !(p in actual));
  const added = Object.keys(actual).filter((p) => !(p in baseline));
  const changed = Object.keys(actual)
    .filter((p) => p in baseline && actual[p] !== baseline[p])
    .sort();

  // T2
  const packageChanged = FROZEN_PACKAGE_PATHS.filter((p) => changed.includes(p) || missing.includes(p));
  const frozenDeps = dependencyNames(readFileSync(path.join(PARTICIPANT_DIR, 'package.json'), 'utf8'));
  const treeDeps = dependencyNames(readFileSync(path.join(tree, 'package.json'), 'utf8'));
  const depsAdded = treeDeps.filter((d) => !frozenDeps.includes(d));
  const depsRemoved = frozenDeps.filter((d) => !treeDeps.includes(d));
  const t2 = {
    pass: packageChanged.length === 0 && depsAdded.length === 0 && depsRemoved.length === 0,
    packageChanged, depsAdded, depsRemoved,
  };

  // T3
  const unexpected = changed.filter((p) => p !== MUTABLE_PATH);
  const t3 = {
    pass: missing.length === 0 && added.length === 0 && unexpected.length === 0,
    missing, added, unexpected, changed,
  };

  return { t2, t3 };
}

export function reportT2T3({ t2, t3 }) {
  console.log(`  ${t2.pass ? 'OK  ' : 'KO  '} T2  paquet figé          ` +
    `modifiés=[${t2.packageChanged.join(' ')}] ajoutées=${t2.depsAdded.length} retirées=${t2.depsRemoved.length}`);
  console.log(`  ${t3.pass ? 'OK  ' : 'KO  '} T3  arbre figé           ` +
    `diffèrent=[${t3.changed.join(' ')}] absents=${t3.missing.length} surnuméraires=${t3.added.length}`);
  console.log(`  ── T2 = ${t2.pass ? 'PASS' : 'FAIL'} · T3 = ${t3.pass ? 'PASS' : 'FAIL'}`);
}

if (import.meta.url === `file:///${process.argv[1].split(path.sep).join('/')}`) {
  const args = new Map();
  for (let i = 2; i < process.argv.length; i += 2) args.set(process.argv[i], process.argv[i + 1]);
  const tree = path.resolve(args.get('--tree') ?? PARTICIPANT_DIR);
  const result = runT2T3(tree);
  reportT2T3(result);
  process.exitCode = result.t2.pass && result.t3.pass ? 0 : 1;
}
