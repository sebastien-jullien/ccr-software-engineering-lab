/**
 * Scellement du paquet participant.
 *
 * Les deux bras de l'expérience — témoin (#8) et CCR (#9) — doivent recevoir
 * une entrée **octet pour octet identique**. Ce script matérialise deux copies
 * scellées et le démontre mécaniquement :
 *
 *   1. chaque copie correspond exactement à `participant-baseline.sha256` ;
 *   2. les deux copies sont identiques entre elles, fichier par fichier ;
 *   3. `src/task-pool.ts` est bien le squelette figé — aucune solution ;
 *   4. aucun fichier de `control/` n'a été copié.
 *
 *   node seal-participant.mjs --out <répertoire>
 */
import { copyFileSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hashTree, listTree, PARTICIPANT_DIR, MUTABLE_PATH } from './baseline.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = new Map();
for (let i = 2; i < process.argv.length; i += 2) args.set(process.argv[i], process.argv[i + 1]);
const outDir = path.resolve(args.get('--out') ?? path.join(HERE, '..', '.sealed'));

const ARMS = ['baseline-8', 'ccr-9'];

function seal(destination) {
  rmSync(destination, { recursive: true, force: true });
  for (const rel of listTree(PARTICIPANT_DIR)) {
    const dest = path.join(destination, rel);
    mkdirSync(path.dirname(dest), { recursive: true });
    copyFileSync(path.join(PARTICIPANT_DIR, rel), dest);
  }
  return hashTree(destination);
}

const baseline = {};
for (const line of readFileSync(path.join(HERE, 'participant-baseline.sha256'), 'utf8').split('\n')) {
  const m = /^([0-9a-f]{64})\s+(.+)$/.exec(line.trim());
  if (m) baseline[m[2]] = m[1];
}

const findings = [];
const sealed = ARMS.map((arm) => ({ arm, hashes: seal(path.join(outDir, arm)) }));

// 1. Conformité à l'inventaire figé.
for (const { arm, hashes } of sealed) {
  for (const rel of Object.keys(baseline)) {
    if (hashes[rel] !== baseline[rel]) findings.push(`${arm} : ${rel} ne correspond pas à l'inventaire figé`);
  }
  for (const rel of Object.keys(hashes)) {
    if (!(rel in baseline)) findings.push(`${arm} : fichier surnuméraire ${rel}`);
  }
}

// 2. Identité entre les deux copies.
const [a, b] = sealed;
const keys = new Set([...Object.keys(a.hashes), ...Object.keys(b.hashes)]);
for (const rel of keys) {
  if (a.hashes[rel] !== b.hashes[rel]) findings.push(`divergence entre les deux copies : ${rel}`);
}

// 3. Le squelette est bien le squelette.
const skeleton = readFileSync(path.join(outDir, ARMS[0], MUTABLE_PATH), 'utf8');
if (!skeleton.includes("throw new Error('TODO: implement runPool')")) {
  findings.push(`${MUTABLE_PATH} ne contient plus le squelette figé`);
}

// 4. Aucun matériel de contrôle.
for (const rel of Object.keys(a.hashes)) {
  if (rel.includes('control') || rel.includes('reference') || rel.includes('holdout')) {
    findings.push(`matériel de contrôle dans le paquet scellé : ${rel}`);
  }
}

console.log(`  destination        : ${outDir}`);
console.log(`  copies scellées    : ${ARMS.join(' · ')}`);
console.log(`  fichiers par copie : ${Object.keys(a.hashes).length}`);
for (const f of findings) console.log(`  ÉCART  ${f}`);
console.log(`  ── FUTURE BASELINE / CCR PARTICIPANT INPUT = ${findings.length === 0 ? 'BYTE-IDENTICAL' : `${findings.length} ÉCART(S)`}`);
process.exitCode = findings.length === 0 ? 0 : 1;
