/**
 * Portes de validité T1 / T2 / T3 pour une implémentation donnée.
 *
 * Aucune ne rapporte de point ; l'échec de l'une rend le rendu INVALIDE et
 * annule tout score de ligne de vérité.
 *
 * L'implémentation est évaluée dans un arbre d'épreuve : copie de l'arbre
 * participant figé, `src/task-pool.ts` substitué, `node_modules` monté par
 * jonction. L'arbre figé du dépôt n'est jamais modifié.
 *
 * T2 et T3 portent sur un arbre RENDU. Sans `--delivered`, elles sont évaluées
 * sur l'arbre d'épreuve, où elles sont vraies par construction : c'est le cas
 * des références et des contrôles négatifs, qui ne sont que des fichiers isolés
 * et n'ont pas d'arbre rendu. Le rapport le dit explicitement.
 *
 * Ordre imposé : T2/T3 d'abord, puis T1 — les sondes de T1 sont déposées dans
 * l'arbre et deviendraient sinon des fichiers surnuméraires pour T3.
 *
 *   node gates.mjs --impl <fichier.ts> [--label X] [--tree <répertoire>]
 *                  [--delivered <arbre rendu>]
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { materializeTree } from './baseline.mjs';
import { reportT1, runT1 } from './t1.mjs';
import { reportT2T3, runT2T3 } from './t2-t3.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));

const args = new Map();
for (let i = 2; i < process.argv.length; i += 2) args.set(process.argv[i], process.argv[i + 1]);
const impl = args.get('--impl') ? path.resolve(args.get('--impl')) : null;
const label = args.get('--label') ?? (impl ? path.basename(impl) : 'baseline-figé');
const treePath = path.resolve(args.get('--tree') ?? path.join(HERE, '..', '.gates-tree'));
const delivered = args.get('--delivered') ? path.resolve(args.get('--delivered')) : null;
const outDir = args.get('--out');

const tree = materializeTree(treePath, impl);
console.log(`  arbre d'épreuve : ${tree}`);
console.log(`  implémentation  : ${impl ?? 'squelette participant figé'}`);

// T2/T3 d'abord : l'arbre ne contient pas encore les sondes de T1.
const t23Tree = delivered ?? tree;
const t23 = runT2T3(t23Tree);
console.log(`  T2/T3 portent sur   : ${t23Tree}${delivered ? '' : '  (arbre construit — vrai par construction)'}`);
reportT2T3(t23);
const t1 = runT1(tree);
reportT1(t1);

const verdict = {
  label,
  impl,
  t23Tree,
  t23TreeIsDelivered: delivered !== null,
  T1: t1.pass ? 'PASS' : 'FAIL',
  T2: t23.t2.pass ? 'PASS' : 'FAIL',
  T3: t23.t3.pass ? 'PASS' : 'FAIL',
  t1Records: t1.records.map(({ name, expectation, status, ok, output }) => ({ name, expectation, status, ok, output })),
  t2: t23.t2,
  t3: t23.t3,
};
console.log(`  ── ${label} : T1=${verdict.T1} · T2=${verdict.T2} · T3=${verdict.T3}`);

if (outDir) {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(path.join(outDir, `gates-${label}.json`), JSON.stringify(verdict, null, 2));
}
process.exitCode = t1.pass && t23.t2.pass && t23.t3.pass ? 0 : 1;
