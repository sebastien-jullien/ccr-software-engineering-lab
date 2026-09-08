/**
 * Évaluateur parent — une ligne, un processus isolé, un watchdog.
 *
 * La hiérarchie de verdict et l'exécution d'une ligne vivent dans `runner.mjs`.
 * Ce fichier n'est que la campagne : sélection des lignes, restitution, dépôt
 * des preuves.
 *
 *   node evaluate.mjs --impl <fichier.ts> [--label X] [--watchdog ms]
 *                     [--rows A01,B02] [--out <répertoire>]
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { ROWS } from './rows.mjs';
import { DEFAULT_WATCHDOG_MS, runRow, summarize } from './runner.mjs';

const args = new Map();
for (let i = 2; i < process.argv.length; i += 2) args.set(process.argv[i], process.argv[i + 1]);
const implPath = path.resolve(args.get('--impl'));
const label = args.get('--label') ?? path.basename(implPath);
const watchdogMs = Number(args.get('--watchdog') ?? DEFAULT_WATCHDOG_MS);
const only = args.get('--rows');
const outDir = args.get('--out');

const wanted = only ? only.split(',') : null;
const selected = wanted ? wanted.map((id) => {
  const row = ROWS.find((r) => r.id === id);
  if (row === undefined) throw new Error(`ligne inconnue : ${id}`);
  return row;
}) : ROWS;

const results = [];
for (const row of selected) results.push(await runRow(row, { implPath, watchdogMs, label }));

const summary = summarize(results, { label, implPath, watchdogMs, denominator: ROWS.length });

for (const r of results) {
  const note = String(r.detail ?? r.harnessFault ?? '').split('\n')[0].slice(0, 100);
  console.log(`  ${r.rowId} ${r.visibility.padEnd(7)} ${r.outcome.padEnd(17)} ${String(r.durationMs).padStart(5)}ms  ${note}`);
}
console.log(`  ── ${label} : ${summary.pass} PASS · ${summary.fail} FAIL · ${summary.inconclusive} INCONCLUSIVE · ${summary.artifactFailure} ARTIFACT · sur ${summary.rows} exécutées / ${summary.denominator}`);
if (summary.failedRows.length) console.log(`  ── lignes en échec : ${summary.failedRows.join(' ')}`);
if (summary.inconclusiveRows.length) console.log(`  ── lignes non concluantes : ${summary.inconclusiveRows.join(' ')}`);

if (outDir) {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(path.join(outDir, `${label}.json`), JSON.stringify({ summary, results }, null, 2));
}
