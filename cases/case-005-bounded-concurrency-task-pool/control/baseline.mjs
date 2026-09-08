/**
 * Arbre participant figé — inventaire et empreintes.
 *
 * Sert trois usages :
 *   · T2/T3, qui comparent un arbre rendu à cet inventaire ;
 *   · la construction d'un arbre d'épreuve pour qualifier une implémentation
 *     qui ne vient pas de `participant/src/task-pool.ts` (références, contrôles
 *     négatifs) ;
 *   · FREEZE-MANIFEST.md.
 */
import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, symlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const CASE_DIR = path.dirname(HERE);
export const PARTICIPANT_DIR = path.join(CASE_DIR, 'participant');

/** Le seul chemin qu'un producteur peut modifier. */
export const MUTABLE_PATH = 'src/task-pool.ts';

/**
 * Ce qui n'appartient pas à l'arbre figé.
 *
 * `t1-probes/` n'y figure PAS : les sondes de T1 sont déposées dans l'arbre
 * d'épreuve, et T3 doit pouvoir signaler un répertoire surnuméraire dans un
 * arbre rendu. `gates.mjs` évalue donc T2/T3 AVANT de déposer les sondes.
 */
const EXCLUDED = new Set(['node_modules', '.git']);

export function sha256(file) {
  return createHash('sha256').update(readFileSync(file)).digest('hex');
}

/** Chemins relatifs POSIX de l'arbre, triés, hors exclusions. */
export function listTree(root) {
  const out = [];
  const walk = (dir, prefix) => {
    for (const entry of readdirSync(dir).sort()) {
      if (EXCLUDED.has(entry)) continue;
      const abs = path.join(dir, entry);
      const rel = prefix ? `${prefix}/${entry}` : entry;
      if (statSync(abs).isDirectory()) walk(abs, rel);
      else out.push(rel);
    }
  };
  walk(root, '');
  return out.sort();
}

/** `{ relatif: sha256 }` pour tout l'arbre. */
export function hashTree(root) {
  const manifest = {};
  for (const rel of listTree(root)) manifest[rel] = sha256(path.join(root, rel));
  return manifest;
}

/**
 * Matérialise un arbre d'épreuve : copie figée + implémentation substituée +
 * jonction vers `node_modules` (jamais copié).
 */
export function materializeTree(destination, implPath) {
  rmSync(destination, { recursive: true, force: true });
  for (const rel of listTree(PARTICIPANT_DIR)) {
    const dest = path.join(destination, rel);
    mkdirSync(path.dirname(dest), { recursive: true });
    copyFileSync(path.join(PARTICIPANT_DIR, rel), dest);
  }
  if (implPath) copyFileSync(implPath, path.join(destination, MUTABLE_PATH));
  symlinkSync(path.join(PARTICIPANT_DIR, 'node_modules'), path.join(destination, 'node_modules'), 'junction');
  return destination;
}
