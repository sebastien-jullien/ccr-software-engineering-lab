/**
 * Contrôle de fuite — l'arbre participant ne doit rien révéler du holdout.
 *
 * Cinq constats mécaniques :
 *   1. l'arbre participant est exactement l'inventaire figé (aucun fichier de
 *      plus, aucun de moins) ;
 *   2. aucun identifiant de ligne CACHÉE n'y apparaît ;
 *   3. aucun chemin vers `control/` n'y est référencé ;
 *   4. aucun identifiant distinctif des références ou des contrôles négatifs
 *      n'y apparaît ;
 *   5. aucun fichier de `control/` n'a de copie dans l'arbre participant
 *      (comparaison par empreinte).
 *
 *   node leakage-check.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hashTree, listTree, PARTICIPANT_DIR, sha256 } from './baseline.mjs';
import { HIDDEN_IDS } from './rows.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));

/** Identifiants internes propres aux références et aux contrôles négatifs. */
const CONTROL_TOKENS = [
  'reference-1', 'reference-2', 'holdout', 'nc1', 'nc2', 'nc3', 'nc4', 'nc5', 'nc6', 'nc7',
  'op-w1', 'deferred-harness', 'row-child', 'evaluate.mjs', 'rows.mjs', 'runner.mjs',
];

const findings = [];
const files = listTree(PARTICIPANT_DIR);
const bodies = new Map(files.map((rel) => [rel, readFileSync(path.join(PARTICIPANT_DIR, rel), 'utf8')]));

// 1. Inventaire exact.
const expected = readFileSync(path.join(HERE, 'participant-baseline.sha256'), 'utf8')
  .split('\n').map((l) => l.trim().split(/\s+/)[1]).filter(Boolean).sort();
for (const rel of files) if (!expected.includes(rel)) findings.push(`fichier surnuméraire : ${rel}`);
for (const rel of expected) if (!files.includes(rel)) findings.push(`fichier absent : ${rel}`);

// 2. Identifiants de lignes cachées.
for (const [rel, body] of bodies) {
  for (const id of HIDDEN_IDS) {
    if (new RegExp(`\b${id}\b`).test(body)) findings.push(`ligne cachée ${id} citée dans ${rel}`);
  }
}

// 3. Références au répertoire de contrôle.
for (const [rel, body] of bodies) {
  if (/(^|[^a-z-])control\//.test(body)) findings.push(`chemin control/ référencé dans ${rel}`);
}

// 4. Identifiants distinctifs du matériel de contrôle.
for (const [rel, body] of bodies) {
  for (const token of CONTROL_TOKENS) {
    if (body.includes(token)) findings.push(`jeton de contrôle « ${token} » dans ${rel}`);
  }
}

// 5. Aucune copie d'un fichier de contrôle dans l'arbre participant.
const participantHashes = new Set(Object.values(hashTree(PARTICIPANT_DIR)));
const walkControl = (dir) => {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules') continue;
    const abs = path.join(dir, entry);
    if (statSync(abs).isDirectory()) walkControl(abs);
    else if (participantHashes.has(sha256(abs))) {
      findings.push(`copie d'un fichier de contrôle dans l'arbre participant : ${path.relative(HERE, abs)}`);
    }
  }
};
walkControl(HERE);

console.log(`  fichiers participants inspectés : ${files.length}`);
console.log(`  lignes cachées recherchées      : ${HIDDEN_IDS.length}  (${HIDDEN_IDS.join(' ')})`);
console.log(`  jetons de contrôle recherchés   : ${CONTROL_TOKENS.length}`);
for (const f of findings) console.log(`  FUITE  ${f}`);
console.log(`  ── HIDDEN-TRUTH LEAKAGE = ${findings.length}`);
process.exitCode = findings.length === 0 ? 0 : 1;
