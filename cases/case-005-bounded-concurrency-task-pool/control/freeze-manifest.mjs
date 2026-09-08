/**
 * Empreintes de gel — inventaire signé de tout le matériel de CASE-005.
 *
 *   node freeze-manifest.mjs            affiche
 *   node freeze-manifest.mjs --write    écrit participant-baseline.sha256
 */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hashTree, PARTICIPANT_DIR, sha256 } from './baseline.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));

export const ORACLE_FILES = [
  'baseline.mjs', 'deferred-harness.mjs', 'evaluate.mjs', 'runner.mjs', 'row-child.mjs', 'rows.mjs',
  'holdout-axis-a.mjs', 'holdout-axis-b.mjs', 'holdout-axis-c.mjs', 'holdout-axis-d.mjs',
  'holdout-axis-e.mjs', 'candidate-visible.test.mjs', 'candidate-holdout.test.mjs',
  't1.mjs', 't2-t3.mjs', 'gates.mjs', 'freeze-manifest.mjs',
  'leakage-check.mjs', 'seal-participant.mjs', 'README.md',
];
export const REFERENCE_FILES = ['reference-1.ts', 'reference-2.ts'];
export const NEGATIVE_FILES = [
  'negative/nc1.ts', 'negative/nc2.ts', 'negative/nc3.ts', 'negative/nc4.ts',
  'negative/nc5.ts', 'negative/nc6.ts', 'negative/nc7.ts', 'negative/op-w1.ts',
];
export const PROBE_FILES = [
  't1-probes/package.json',
  't1-probes/p01-conforming.ts', 't1-probes/p02-missing-options.ts',
  't1-probes/p03-wrong-element-type.ts', 't1-probes/p04-options-without-limit.ts',
  't1-probes/p05-readonly-result.ts', 't1-probes/p06-readonly-limit.ts',
  't1-probes/p07-task-arity.ts', 't1-probes/p08-async-return.ts',
];

export function participantBaseline() {
  const manifest = hashTree(PARTICIPANT_DIR);
  return Object.entries(manifest).map(([rel, hash]) => `${hash}  ${rel}`).join('\n') + '\n';
}

export function controlHashes(files) {
  return files.map((rel) => ({ rel, hash: sha256(path.join(HERE, rel)) }));
}

if (import.meta.url === `file:///${process.argv[1].split(path.sep).join('/')}`) {
  const body = participantBaseline();
  if (process.argv.includes('--write')) {
    writeFileSync(path.join(HERE, 'participant-baseline.sha256'), body);
    console.log(`participant-baseline.sha256 écrit · ${body.trim().split('\n').length} fichiers`);
  } else {
    process.stdout.write(body);
  }
  for (const [titre, files] of [
    ['RÉFÉRENCES', REFERENCE_FILES], ['ORACLE', ORACLE_FILES],
    ['CONTRÔLES NÉGATIFS', NEGATIVE_FILES], ['SONDES T1', PROBE_FILES],
  ]) {
    console.log(`\n--- ${titre}`);
    for (const { rel, hash } of controlHashes(files)) console.log(`${hash}  control/${rel}`);
  }
}
