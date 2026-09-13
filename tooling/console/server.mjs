/**
 * LOCAL MISSION CONSOLE V0 -- serveur HTTP local.
 *
 *   node tooling/console/server.mjs --repo <racine-de-depot> [--port <port>]
 *
 * Serveur de boucle locale, sans dependance externe, sans persistance, sans
 * demon, sans reseau sortant, sans ecriture disque, sans mutation Git, sans
 * modele de langage et sans horloge comme autorite.
 *
 * LE NAVIGATEUR N'A AUCUN ACCES AU SYSTEME DE FICHIERS.
 * LE NAVIGATEUR N'A AUCUN ACCES A GIT.
 *
 * Toutes les routes sont en GET, il n'existe aucune methode de mutation, et
 * il n'existe AUCUNE route de lecture de fichier arbitraire : l'interface ne
 * peut demander que ce que le contrat de routes nomme, et chaque chemin
 * repasse par le confinement cote serveur.
 *
 * Sur les statuts : un artefact invalide n'est PAS encode en 200 OK au motif
 * que l'interface saurait afficher son erreur. << L'interface sait afficher
 * l'erreur >> n'est pas << la requete a reussi >>.
 */

import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import {
  openRepository,
  confine,
  repositoryRelative,
  listCandidates,
  CANDIDATE_CLASSES,
} from './repo.mjs';
import { projectProgramState, PROGRAM_STATE_PATH } from './program-state-adapter.mjs';
import { projectMission } from './mission-adapter.mjs';
import { projectResult } from './result-adapter.mjs';

/** Contrat de routes exhaustif. Rien en dehors de cette liste n'existe. */
export const ROUTES = Object.freeze([
  '/',
  '/console.css',
  '/console.mjs',
  '/api/context',
  '/api/program-state',
  '/api/candidates',
  '/api/mission',
  '/api/result',
]);

/**
 * Actifs statiques, par LISTE BLANCHE DE NOMS.
 *
 * Aucun chemin n'est compose a partir de la requete : le nom de fichier est
 * une constante de cette table, et une requete ne fait que la selectionner.
 */
const STATIC_ASSETS = Object.freeze({
  '/': { file: 'index.html', type: 'text/html; charset=utf-8' },
  '/console.css': { file: 'console.css', type: 'text/css; charset=utf-8' },
  '/console.mjs': { file: 'console.mjs', type: 'text/javascript; charset=utf-8' },
});

/**
 * En-tetes de securite emis sur CHAQUE reponse.
 *
 * `default-src 'none'` puis `'self'` par famille : aucun script, style,
 * police, image ou connexion externe n'est atteignable, et il n'existe aucun
 * script ni style en ligne dans l'interface.
 *
 * Aucun en-tete `Access-Control-Allow-*` n'est jamais emis : CORS est
 * desactive, et une page d'une autre origine n'a rien a lire ici.
 */
export const SECURITY_HEADERS = Object.freeze({
  'Content-Security-Policy':
    "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; " +
    "connect-src 'self'; form-action 'none'; frame-ancestors 'none'; base-uri 'none'",
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
});

const LOOPBACK_ADDRESS = '127.0.0.1';

/** Liste blanche Host, sur le port REELLEMENT lie. */
export function allowedHosts(port) {
  if (port === 80) return [LOOPBACK_ADDRESS, 'localhost', LOOPBACK_ADDRESS + ':80', 'localhost:80'];
  return [LOOPBACK_ADDRESS + ':' + port, 'localhost:' + port];
}

export function allowedOrigins(port) {
  return allowedHosts(port).map((host) => 'http://' + host);
}

/* ------------------------------------------------------------------ *
 * Emission
 * ------------------------------------------------------------------ */

function send(response, status, type, body, extraHeaders) {
  const headers = { ...SECURITY_HEADERS, 'Content-Type': type, 'Content-Length': body.length };
  if (extraHeaders) Object.assign(headers, extraHeaders);
  response.writeHead(status, headers);
  response.end(body);
}

function sendJson(response, status, payload, extraHeaders) {
  send(
    response,
    status,
    'application/json; charset=utf-8',
    Buffer.from(JSON.stringify(payload), 'utf8'),
    extraHeaders,
  );
}

function sendFault(response, status, code, message, details) {
  sendJson(response, status, {
    code,
    message,
    details: details === undefined ? null : details,
  });
}

/**
 * Classement d'un defaut.
 *
 * Un defaut porte par la console porte sa propre classe HTTP. Tout le reste
 * est une defaillance applicative inattendue, et vaut 500 : on ne deguise pas
 * une panne en reponse metier.
 */
function sendError(response, error) {
  if (error && error.consoleFault === true && typeof error.status === 'number') {
    sendFault(response, error.status, error.code, error.message, error.details);
    return;
  }
  sendFault(response, 500, 'INTERNAL_ERROR', 'defaillance applicative inattendue', null);
}

/* ------------------------------------------------------------------ *
 * Routage
 * ------------------------------------------------------------------ */

function serveStatic(response, pathname) {
  const asset = STATIC_ASSETS[pathname];
  let body;
  try {
    body = readFileSync(new URL('./public/' + asset.file, import.meta.url));
  } catch {
    sendFault(response, 404, 'ASSET_NOT_FOUND', 'actif statique introuvable', { asset: asset.file });
    return;
  }
  send(response, 200, asset.type, body);
}

function requireParameter(url, name) {
  const value = url.searchParams.get(name);
  if (value === null || value === '') {
    const error = new Error('parametre requis absent : ' + name);
    error.consoleFault = true;
    error.status = 400;
    error.code = 'BAD_REQUEST';
    error.details = { parameter: name };
    throw error;
  }
  return value;
}

function handleApi(state, url, response) {
  const { repository } = state;

  if (url.pathname === '/api/context') {
    sendJson(response, 200, {
      repositoryLabel: repository.label,
      rootLabel: basename(repository.realRoot),
      head: repository.head,
      objectFormat: repository.objectFormat,
    });
    return;
  }

  if (url.pathname === '/api/program-state') {
    const absolute = confine(repository, PROGRAM_STATE_PATH);
    sendJson(
      response,
      200,
      projectProgramState(
        absolute,
        repositoryRelative(repository, absolute),
        repository.objectFormat,
      ),
    );
    return;
  }

  if (url.pathname === '/api/candidates') {
    const candidateClass = requireParameter(url, 'class');
    if (!CANDIDATE_CLASSES.includes(candidateClass)) {
      sendFault(response, 400, 'BAD_REQUEST', 'classe de candidat inconnue', {
        supported: CANDIDATE_CLASSES.slice(),
      });
      return;
    }
    sendJson(response, 200, listCandidates(repository, candidateClass));
    return;
  }

  if (url.pathname === '/api/mission') {
    const requested = requireParameter(url, 'path');
    const absolute = confine(repository, requested);
    sendJson(
      response,
      200,
      projectMission(absolute, repositoryRelative(repository, absolute), repository.objectFormat),
    );
    return;
  }

  if (url.pathname === '/api/result') {
    sendJson(
      response,
      200,
      projectResult(repository, {
        resultPath: requireParameter(url, 'path'),
        missionPath: requireParameter(url, 'missionPath'),
        missionBlob: requireParameter(url, 'missionBlob'),
      }),
    );
    return;
  }

  sendFault(response, 404, 'NOT_FOUND', 'route inconnue', null);
}

/**
 * Traitement d'une requete, avec ses frontieres dans l'ordre.
 *
 * Methode, puis Host, puis Origin, puis Sec-Fetch-Site : chaque garde est
 * evaluee avant que la moindre lecture de depot soit envisagee.
 */
export function handleRequest(state, request, response) {
  try {
    if (request.method !== 'GET') {
      sendFault(response, 405, 'METHOD_NOT_ALLOWED', 'seule la methode GET est servie', {
        method: request.method,
      });
      return;
    }

    const host = request.headers.host;
    if (host === undefined || !state.hosts.includes(String(host))) {
      sendFault(response, 421, 'HOST_REJECTED', 'Host inattendu pour cette console locale', null);
      return;
    }

    const origin = request.headers.origin;
    if (origin !== undefined && !state.origins.includes(String(origin))) {
      sendFault(response, 403, 'ORIGIN_REJECTED', 'Origin etrangere refusee', null);
      return;
    }

    const url = new URL(request.url, 'http://' + host);

    if (url.pathname.startsWith('/api/')) {
      /* REQUETE API : Sec-Fetch-Site, lorsqu'il est present, DOIT valoir
         same-origin. Une navigation de premier niveau vers l'interface porte
         `none` et reste donc servie ; une requete inter-site vers l'API, non. */
      const site = request.headers['sec-fetch-site'];
      if (site !== undefined && String(site) !== 'same-origin') {
        sendFault(response, 403, 'CROSS_SITE_REJECTED', 'requete inter-site refusee', {
          secFetchSite: String(site),
        });
        return;
      }
      handleApi(state, url, response);
      return;
    }

    if (Object.prototype.hasOwnProperty.call(STATIC_ASSETS, url.pathname)) {
      serveStatic(response, url.pathname);
      return;
    }

    sendFault(response, 404, 'NOT_FOUND', 'route inconnue', null);
  } catch (error) {
    sendError(response, error);
  }
}

/* ------------------------------------------------------------------ *
 * Demarrage
 * ------------------------------------------------------------------ */

export function parseArguments(argv) {
  const options = { repo: null, port: 0 };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--repo') {
      options.repo = argv[index + 1] ?? null;
      index += 1;
    } else if (token === '--port') {
      const raw = argv[index + 1];
      const port = Number.parseInt(raw ?? '', 10);
      if (!Number.isInteger(port) || port < 0 || port > 65535) {
        throw new Error('--port attend un entier entre 0 et 65535');
      }
      options.port = port;
      index += 1;
    } else {
      throw new Error('option inconnue : ' + token);
    }
  }
  if (options.repo === null) throw new Error('--repo <racine-de-depot> est requis');
  return options;
}

/**
 * Ouvre la racine, lie la boucle locale, et rend de quoi arreter proprement.
 *
 * L'ecoute est liee a 127.0.0.1 UNIQUEMENT. La liste blanche Host est ensuite
 * construite sur le port REELLEMENT lie, et non sur le port demande : un port
 * ephemere reste une frontiere exacte.
 */
export function start({ repoRoot, port = 0 }) {
  const repository = openRepository(repoRoot);
  const state = { repository, hosts: [], origins: [] };
  const server = createServer((request, response) => handleRequest(state, request, response));

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, LOOPBACK_ADDRESS, () => {
      const bound = server.address().port;
      state.hosts = allowedHosts(bound);
      state.origins = allowedOrigins(bound);
      resolve({
        server,
        repository,
        port: bound,
        origin: 'http://' + LOOPBACK_ADDRESS + ':' + bound,
        close: () =>
          new Promise((done) => {
            server.close(() => done());
            server.closeAllConnections();
          }),
      });
    });
  });
}

async function main(argv) {
  let options;
  try {
    options = parseArguments(argv);
  } catch (error) {
    process.stderr.write(
      String(error.message) +
        '\n\nusage :\n  node tooling/console/server.mjs --repo <racine-de-depot> [--port <port>]\n',
    );
    return 2;
  }
  const started = await start({ repoRoot: options.repo, port: options.port });
  process.stdout.write(
    'LOCAL MISSION CONSOLE V0\n' +
      'depot  ' +
      started.repository.realRoot +
      '\n' +
      'HEAD   ' +
      started.repository.head +
      '\n' +
      'format ' +
      started.repository.objectFormat +
      '\n' +
      started.origin +
      '\n',
  );
  return 0;
}

if (process.argv[1] && process.argv[1].endsWith('server.mjs')) {
  process.exitCode = await main(process.argv.slice(2));
}
