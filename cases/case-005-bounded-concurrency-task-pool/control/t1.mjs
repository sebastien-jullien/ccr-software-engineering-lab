/**
 * Porte T1 — la signature TypeScript publique est exactement préservée.
 *
 * T1 ne rapporte aucun point. Son échec rend le rendu INVALIDE.
 *
 * Deux constats :
 *   1. l'arbre participant type sans erreur, `consumer-v1.ts` compris ;
 *   2. chaque sonde négative de `t1-probes/` produit bien une erreur de type.
 *
 * Le second donne des dents au premier : une signature élargie — `options`
 * rendu optionnel, `T` perdu, `readonly` retiré — ferait taire une sonde
 * négative, et T1 échouerait.
 *
 * Les sondes sont compilées à l'intérieur de l'arbre évalué, sous
 * `t1-probes/` ; leur spécificateur d'import y est donc `../src/task-pool.ts`.
 *
 *   node t1.mjs                       arbre participant figé
 *   node t1.mjs --impl <fichier.ts>   implémentation substituée
 */
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { materializeTree } from './baseline.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PROBE_SOURCE = path.join(HERE, 't1-probes');

/** Options du projet participant, reproduites pour compiler une sonde isolée. */
const PROBE_FLAGS = [
  '--noEmit',
  '--strict',
  '--target', 'es2022',
  '--lib', 'es2022',
  '--types', 'node',
  '--typeRoots', 'node_modules/@types',
  '--module', 'nodenext',
  '--moduleResolution', 'nodenext',
  '--allowImportingTsExtensions',
  '--erasableSyntaxOnly',
  '--verbatimModuleSyntax',
  '--forceConsistentCasingInFileNames',
  '--skipLibCheck',
];

function tsc(tree, args) {
  const bin = path.join(tree, 'node_modules', 'typescript', 'bin', 'tsc');
  const r = spawnSync(process.execPath, [bin, ...args], { cwd: tree, encoding: 'utf8' });
  return { status: r.status, output: `${r.stdout ?? ''}${r.stderr ?? ''}`.trim() };
}

/** Exécute T1 sur un arbre déjà matérialisé. Rend `{ pass, records }`. */
export function runT1(tree) {
  const probeDir = path.join(tree, 't1-probes');
  mkdirSync(probeDir, { recursive: true });
  const probes = readdirSync(PROBE_SOURCE).sort();
  for (const f of probes) copyFileSync(path.join(PROBE_SOURCE, f), path.join(probeDir, f));

  const records = [];
  const project = tsc(tree, ['--noEmit', '-p', 'tsconfig.json']);
  records.push({
    name: 'arbre participant (tsconfig.json)',
    expectation: 'DOIT TYPER',
    status: project.status,
    ok: project.status === 0,
    output: project.output,
  });

  for (const probe of probes.filter((f) => f.endsWith('.ts'))) {
    const mustCompile = probe.startsWith('p01');
    const r = tsc(tree, [...PROBE_FLAGS, `t1-probes/${probe}`]);
    records.push({
      name: probe,
      expectation: mustCompile ? 'DOIT TYPER' : 'DOIT ÉCHOUER',
      status: r.status,
      ok: mustCompile ? r.status === 0 : r.status !== 0,
      output: r.output,
    });
  }
  return { pass: records.every((r) => r.ok), records };
}

export function reportT1({ pass, records }) {
  for (const rec of records) {
    const first = rec.output.split('\n').filter(Boolean)[0] ?? '';
    console.log(
      `  ${rec.ok ? 'OK  ' : 'KO  '} ${rec.name.padEnd(34)} ${rec.expectation.padEnd(13)} exit=${String(rec.status).padStart(2)}  ${first.slice(0, 90)}`,
    );
  }
  const bad = records.filter((r) => !r.ok);
  console.log(`  ── T1 = ${pass ? 'PASS' : 'FAIL'} · ${records.length - bad.length}/${records.length} constats conformes`);
  for (const f of bad) console.log(`  ── ÉCHEC ${f.name} :\n${f.output}`);
}

if (import.meta.url === `file:///${process.argv[1].split(path.sep).join('/')}`) {
  const args = new Map();
  for (let i = 2; i < process.argv.length; i += 2) args.set(process.argv[i], process.argv[i + 1]);
  const impl = args.get('--impl') ? path.resolve(args.get('--impl')) : null;
  const tree = materializeTree(path.resolve(args.get('--tree') ?? path.join(HERE, '..', '.t1-tree')), impl);
  const result = runT1(tree);
  reportT1(result);
  process.exitCode = result.pass ? 0 : 1;
}
