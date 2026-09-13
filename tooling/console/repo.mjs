/**
 * Frontiere de depot : racine explicite, confinement, enumeration bornee,
 * et les DEUX seules commandes Git que la console a le droit d'executer.
 *
 * La racine du depot est donnee au demarrage. Elle n'est jamais deduite d'une
 * requete. Chaque chemin accepte ensuite est revalide ici, cote serveur :
 * l'enumeration de candidats offerte a l'interface est une COMMODITE DE
 * SELECTION, pas une frontiere de securite, et l'interface n'est pas en
 * position de garantir quoi que ce soit.
 */

import { realpathSync, readdirSync, statSync } from 'node:fs';
import { resolve, relative, isAbsolute, join, basename, sep } from 'node:path';
import { execFileSync } from 'node:child_process';

/** Defaut porte par la frontiere de depot. Meme marqueur que `CaptureFault`. */
export class RepoFault extends Error {
  constructor(code, status, message, details) {
    super(message);
    this.name = 'RepoFault';
    this.consoleFault = true;
    this.code = code;
    this.status = status;
    this.details = details === undefined ? null : details;
  }
}

/* ------------------------------------------------------------------ *
 * Autorite Git finale
 * ------------------------------------------------------------------ *
 *
 * Deux commandes de metadonnees, sans operande de chemin, sans hachage de
 * copie de travail, sans filtre de contenu, sans mutation. La liste blanche
 * est verifiee a l'execution : ce n'est pas une convention de revue, c'est
 * une garde. Le journal est expose pour que l'acceptation puisse OBSERVER
 * l'ensemble reellement execute plutot que de le croire sur parole.
 */

const AUTHORIZED_GIT_COMMANDS = Object.freeze([
  Object.freeze(['rev-parse', '--show-object-format']),
  Object.freeze(['rev-parse', 'HEAD']),
]);

const GIT_INVOCATIONS = [];

/** Journal append-only de tout ce que la console a execute via Git. */
export function gitInvocations() {
  return GIT_INVOCATIONS.map((argv) => argv.slice());
}

function authorized(argv) {
  return AUTHORIZED_GIT_COMMANDS.some(
    (allowed) =>
      allowed.length === argv.length && allowed.every((token, index) => token === argv[index]),
  );
}

function git(realRoot, argv) {
  if (!authorized(argv)) {
    throw new RepoFault(
      'GIT_COMMAND_NOT_AUTHORIZED',
      500,
      'commande Git hors autorite de la console',
      { argv: argv.slice() },
    );
  }
  GIT_INVOCATIONS.push(argv.slice());
  let out;
  try {
    out = execFileSync('git', argv, {
      cwd: realRoot,
      encoding: 'utf8',
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (error) {
    throw new RepoFault(
      'GIT_METADATA_UNAVAILABLE',
      500,
      'metadonnee Git illisible : git ' + argv.join(' '),
      { reason: error && error.message ? error.message : String(error) },
    );
  }
  return out.trim();
}

/* ------------------------------------------------------------------ *
 * Ouverture de la racine
 * ------------------------------------------------------------------ */

export function openRepository(rootArgument) {
  if (typeof rootArgument !== 'string' || rootArgument === '') {
    throw new RepoFault('REPOSITORY_ROOT_REQUIRED', 500, 'racine de depot requise au demarrage');
  }
  let realRoot;
  try {
    realRoot = realpathSync(resolve(rootArgument));
  } catch (error) {
    throw new RepoFault(
      'REPOSITORY_ROOT_UNREADABLE',
      500,
      'racine de depot illisible : ' + rootArgument,
      { reason: error && error.code ? error.code : String(error) },
    );
  }
  const objectFormat = git(realRoot, ['rev-parse', '--show-object-format']);
  const head = git(realRoot, ['rev-parse', 'HEAD']);
  return Object.freeze({ realRoot, label: basename(realRoot), objectFormat, head });
}

/* ------------------------------------------------------------------ *
 * Confinement
 * ------------------------------------------------------------------ *
 *
 * Deux passes, et les deux comptent.
 *
 * La passe lexicale arrete `..` et les chemins absolus avant de toucher au
 * disque. La passe `realpath` arrete ce que la premiere ne peut pas voir : un
 * lien symbolique ou une jonction dont la cible reelle est HORS de la racine.
 * Comparer des chemins non resolus laisserait passer exactement ce cas.
 */

const CONTROL_CHARACTER = new RegExp('[\\u0000-\\u001F]');

function escapes(realRoot, target) {
  const rel = relative(realRoot, target);
  return rel === '' || rel === '..' || rel.startsWith('..' + sep) || isAbsolute(rel);
}

export function confine(repository, repositoryRelativePath) {
  const raw = repositoryRelativePath;
  if (typeof raw !== 'string' || raw === '') {
    throw new RepoFault('BAD_REQUEST', 400, 'chemin relatif au depot requis');
  }
  if (CONTROL_CHARACTER.test(raw)) {
    throw new RepoFault('BAD_REQUEST', 400, 'chemin invalide : caractere de controle');
  }
  if (isAbsolute(raw) || /^[A-Za-z]:/.test(raw) || raw.startsWith('\\\\')) {
    throw new RepoFault('PATH_OUT_OF_ROOT', 403, 'chemin absolu refuse : la racine est explicite', {
      requested: raw,
    });
  }
  const candidate = resolve(repository.realRoot, raw);
  if (escapes(repository.realRoot, candidate)) {
    throw new RepoFault('PATH_OUT_OF_ROOT', 403, 'chemin hors de la racine du depot', {
      requested: raw,
    });
  }
  let real;
  try {
    real = realpathSync(candidate);
  } catch (error) {
    if (error && (error.code === 'ENOENT' || error.code === 'ENOTDIR')) {
      throw new RepoFault('ARTIFACT_NOT_FOUND', 404, 'artefact introuvable', { requested: raw });
    }
    throw error;
  }
  if (escapes(repository.realRoot, real)) {
    throw new RepoFault('PATH_OUT_OF_ROOT', 403, 'cible reelle hors de la racine du depot', {
      requested: raw,
    });
  }
  return real;
}

/** Chemin relatif au depot, en separateurs POSIX, pour l'affichage et la comparaison. */
export function repositoryRelative(repository, absolutePath) {
  return relative(repository.realRoot, absolutePath).split(sep).join('/');
}

/* ------------------------------------------------------------------ *
 * Enumeration bornee de candidats
 * ------------------------------------------------------------------ *
 *
 * COMMODITE DE SELECTION, PAS UNE FRONTIERE DE SECURITE.
 *
 * Ce que cette fonction rend n'autorise rien : chaque requete ulterieure
 * repasse par `confine()`. Les liens ne sont pas suivis pendant l'enumeration,
 * la profondeur et le nombre sont bornes.
 */

export const CANDIDATE_CLASSES = Object.freeze(['MISSION', 'RESULT']);

const CANDIDATE_ROOTS = Object.freeze({
  MISSION: Object.freeze([
    'tooling/mission-object/dogfood',
    'tooling/result-instance/live-dogfood',
  ]),
  RESULT: Object.freeze([
    'tooling/result-instance/live-dogfood',
    'tooling/result-instance/representability',
  ]),
});

const MAX_DEPTH = 3;
const MAX_CANDIDATES = 200;

function selected(candidateClass, name) {
  if (!name.endsWith('.json')) return false;
  return candidateClass === 'MISSION' ? name === 'mission.json' : name !== 'mission.json';
}

function walk(repository, relativeDirectory, candidateClass, depth, out) {
  if (depth > MAX_DEPTH || out.length >= MAX_CANDIDATES) return;
  const absolute = join(repository.realRoot, relativeDirectory);
  let dirents;
  try {
    dirents = readdirSync(absolute, { withFileTypes: true });
  } catch {
    return; /* racine de commodite absente : enumeration vide, et pas une erreur */
  }
  for (const dirent of dirents) {
    if (out.length >= MAX_CANDIDATES) return;
    if (dirent.isSymbolicLink()) continue; /* l'enumeration ne suit aucun lien */
    const childRelative = relativeDirectory + '/' + dirent.name;
    if (dirent.isDirectory()) {
      walk(repository, childRelative, candidateClass, depth + 1, out);
    } else if (dirent.isFile() && selected(candidateClass, dirent.name)) {
      try {
        out.push({ path: childRelative, bytes: statSync(join(absolute, dirent.name)).size });
      } catch {
        continue;
      }
    }
  }
}

export function listCandidates(repository, candidateClass) {
  if (!CANDIDATE_CLASSES.includes(candidateClass)) {
    throw new RepoFault(
      'BAD_REQUEST',
      400,
      'classe de candidat inconnue : ' + String(candidateClass),
      { supported: CANDIDATE_CLASSES.slice() },
    );
  }
  const roots = CANDIDATE_ROOTS[candidateClass];
  const out = [];
  for (const root of roots) walk(repository, root, candidateClass, 0, out);
  out.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  return { roots: roots.slice(), candidates: out };
}
