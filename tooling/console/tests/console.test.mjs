/**
 * Suite d'acceptation de LOCAL MISSION CONSOLE V0.
 *
 *   node --test tooling/console/tests/console.test.mjs
 *
 * Un cas observable par exigence gelee. `node --test = PASS` est un AGREGAT,
 * et un agregat ne remplace pas les assertions individuelles : chaque exigence
 * de l'autorite 32 section 24 a ici son propre test, nomme, qui echoue seul.
 *
 * Les fixtures temporaires sont creees HORS du depot du Lab, dans un
 * repertoire temporaire du systeme, et supprimees a la fin. Elles ne sont pas
 * des mutations du depot. Les fixtures durables du Lab ne sont jamais
 * modifiees -- le dernier test le verifie en comparant l'etat Git avant et
 * apres toute la suite.
 */

import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  unlinkSync,
  symlinkSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { request as httpRequest } from 'node:http';

import { start, ROUTES, SECURITY_HEADERS, allowedHosts, parseArguments } from '../server.mjs';
import { gitInvocations, openRepository, listCandidates } from '../repo.mjs';
import { gitBlobId } from '../capture.mjs';
import { projectProgramState, EVIDENCE_VERIFICATION_STATUS } from '../program-state-adapter.mjs';
import { associateAuthority } from '../result-adapter.mjs';
import { createCoordinator, missionCopyPayload, copyMission } from '../public/console.mjs';

/* ------------------------------------------------------------------ *
 * Constantes gelees -- autorite 32 section 20
 * ------------------------------------------------------------------ */

const HISTORICAL = Object.freeze({
  missionPath: 'tooling/result-instance/live-dogfood/001/mission.json',
  resultPath: 'tooling/result-instance/live-dogfood/001/result.json',
  evidencePath: 'tooling/result-instance/live-dogfood/001/evidence/remote-main-head.txt',
  missionBytes: 51139,
  missionBlob: '7358a63719036810222fe3d0c657f7192bd4f8c2',
  resultBytes: 3577,
  resultBlob: 'f0781cbea2a1bd773c95c7ebffc91915bb7c076d',
  evidenceBytes: 57,
  evidenceBlob: '4b822a1f771898cd7883cf51c00fa63ff263104c',
  envelopeBytes: 19671,
  envelopeSha256: 'b84f654fd3f7420596dd3d26c59814e65a295aee0620bffb4d93bc38125d11bf',
  envelopeBlob: '04714e06f18e0991364f2f7c4abd60506b9461f4',
});

const OTHER_BLOB = 'a'.repeat(40);
const ABSENT_BLOB = '0'.repeat(40);

const CONSOLE_DIR = resolve(import.meta.dirname, '..');
const LAB_ROOT = resolve(CONSOLE_DIR, '..', '..');

/** Les neuf fichiers PRODUIT de la console. La suite de tests en est exclue. */
const PRODUCT_SOURCES = Object.freeze([
  'server.mjs',
  'capture.mjs',
  'repo.mjs',
  'program-state-adapter.mjs',
  'mission-adapter.mjs',
  'result-adapter.mjs',
  'public/index.html',
  'public/console.css',
  'public/console.mjs',
]);

/**
 * Code EXECUTABLE d'une source, commentaires retires.
 *
 * Les interdits de l'autorite 32 portent sur ce que la console FAIT, pas sur
 * ce qu'elle explique. `capture.mjs` doit pouvoir consigner pourquoi
 * `git hash-object --path` n'est pas employe, et `mission-adapter.mjs`
 * pourquoi `renderCoverage()` est hors perimetre : ces motifs sont la partie
 * durable du travail. On mesure donc l'absence dans le code, pas dans la prose.
 */
function executableCode(source) {
  const lines = [];
  let inBlock = false;
  for (const rawLine of source.split('\n')) {
    let line = rawLine;
    if (inBlock) {
      const end = line.indexOf('*/');
      if (end === -1) continue;
      line = line.slice(end + 2);
      inBlock = false;
    }
    for (;;) {
      const start = line.indexOf('/*');
      if (start === -1) break;
      const end = line.indexOf('*/', start + 2);
      if (end === -1) {
        line = line.slice(0, start);
        inBlock = true;
        break;
      }
      line = line.slice(0, start) + line.slice(end + 2);
    }
    if (line.trim().startsWith('//')) continue;
    lines.push(line);
  }
  return lines.join('\n');
}

const productCode = (name) => executableCode(readFileSync(join(CONSOLE_DIR, name), 'utf8'));

/* ------------------------------------------------------------------ *
 * Etat Git du Lab AVANT toute execution
 * ------------------------------------------------------------------ */

const labGit = (argv) =>
  execFileSync('git', argv, { cwd: LAB_ROOT, encoding: 'utf8', windowsHide: true }).trim();

const BASELINE = Object.freeze({
  status: labGit(['status', '--porcelain']),
  head: labGit(['rev-parse', 'HEAD']),
  programState: labGit(['rev-parse', 'HEAD:PROGRAM-STATE.json']),
  fixtures: labGit(['rev-parse', 'HEAD:' + HISTORICAL.resultPath]),
  /* Tete du distant COURANT : sert uniquement a prouver que la console ne la
     compare JAMAIS a la preuve temporelle historique. */
  remoteMain: labGit(['rev-parse', 'origin/main']),
});

/* ------------------------------------------------------------------ *
 * Client HTTP minimal
 * ------------------------------------------------------------------ */

function httpCall(port, path, options = {}) {
  return new Promise((resolveCall, rejectCall) => {
    const headers = { Host: '127.0.0.1:' + port, ...(options.headers ?? {}) };
    const request = httpRequest(
      { host: '127.0.0.1', port, path, method: options.method ?? 'GET', headers },
      (response) => {
        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => {
          const body = Buffer.concat(chunks);
          let json = null;
          try {
            json = JSON.parse(body.toString('utf8'));
          } catch {
            json = null;
          }
          resolveCall({ status: response.statusCode, headers: response.headers, body, json });
        });
      },
    );
    request.on('error', rejectCall);
    request.end();
  });
}

/* ------------------------------------------------------------------ *
 * Fixtures temporaires, HORS du depot du Lab
 * ------------------------------------------------------------------ */

const authority = (path, blob) => ({
  locator: { kind: 'REPO_PATH', value: path },
  identity: { kind: 'GIT_BLOB', value: blob },
});

const representation = () =>
  authority(
    '23-TOOLING-EXPERIMENT-003-RESULT-INSTANCE-V0.md',
    '1676b3de4546b40a801d0a400b4c47ddd9b82062',
  );

const contractValue = (id, value) => ({
  kind: 'REPORTED_VALUE',
  fact: { defined_by: 'RETURN_CONTRACT', id },
  value: { type: 'SCALAR', value },
});

function buildFixtureRepository() {
  const root = mkdtempSync(join(tmpdir(), 'local-mission-console-v0-'));
  const repository = join(root, 'repository');
  const outside = join(root, 'outside');
  mkdirSync(repository);
  mkdirSync(outside);
  writeFileSync(join(outside, 'secret.txt'), 'HORS DU DEPOT\n');

  /* Depot Git jetable. Ces commandes sont executees par le HARNAIS, pas par la
     console : elles n'apparaissent donc jamais dans `gitInvocations()`. */
  execFileSync('git', ['init', '-q'], { cwd: repository, windowsHide: true });
  execFileSync(
    'git',
    [
      '-c',
      'user.email=fixture@local',
      '-c',
      'user.name=fixture',
      'commit',
      '-q',
      '--allow-empty',
      '-m',
      'fixture',
    ],
    { cwd: repository, windowsHide: true },
  );

  /* PROGRAM-STATE.json est ici un REPERTOIRE : la lecture echoue sur EISDIR,
     defaut inattendu, qui doit remonter en 500 et non se deguiser en 404. */
  mkdirSync(join(repository, 'PROGRAM-STATE.json'));

  /* Copie octet pour octet : meme contenu, donc meme identite Git-blob. */
  writeFileSync(
    join(repository, 'mission.json'),
    readFileSync(join(LAB_ROOT, HISTORICAL.missionPath)),
  );
  mkdirSync(join(repository, 'evidence'));
  writeFileSync(
    join(repository, 'evidence', 'kept.txt'),
    readFileSync(join(LAB_ROOT, HISTORICAL.evidencePath)),
  );

  writeFileSync(join(repository, 'malformed-mission.json'), 'ceci n est pas du JSON');
  writeFileSync(join(repository, 'invalid-mission.json'), JSON.stringify({ identity: {} }, null, 2));

  const results = join(repository, 'results');
  mkdirSync(results);
  const writeResult = (name, instance) =>
    writeFileSync(join(results, name), JSON.stringify(instance, null, 2) + '\n');

  writeResult('aligned.json', {
    representation: { authority: representation() },
    execution: { id: 'fixture-aligned' },
    source: { kind: 'MISSION', authority: authority('mission.json', HISTORICAL.missionBlob) },
    reported_by: { executor: 'AGENT_FIXTURE' },
    return_contract: { authority: authority('mission.json', HISTORICAL.missionBlob) },
    reported_entries: [contractValue('rf-starting-head', BASELINE.head)],
  });

  /* Identite EGALE, localisateur DIFFERENT : MATCH + PATH_DIVERGENCE. */
  writeResult('divergent.json', {
    representation: { authority: representation() },
    execution: { id: 'fixture-divergent' },
    source: {
      kind: 'MISSION',
      authority: authority('archive/copie/mission.json', HISTORICAL.missionBlob),
    },
    reported_by: { executor: 'AGENT_FIXTURE' },
    return_contract: { authority: authority('mission.json', HISTORICAL.missionBlob) },
    reported_entries: [contractValue('rf-starting-head', BASELINE.head)],
  });

  /* Contradiction d'identite DEMONTREE sur la source, contrat aligne. */
  writeResult('mismatch.json', {
    representation: { authority: representation() },
    execution: { id: 'fixture-mismatch' },
    source: { kind: 'MISSION', authority: authority('mission.json', OTHER_BLOB) },
    reported_by: { executor: 'AGENT_FIXTURE' },
    return_contract: { authority: authority('mission.json', HISTORICAL.missionBlob) },
    reported_entries: [contractValue('rf-starting-head', BASELINE.head)],
  });

  /* L'imposteur de TOOLING-EXPERIMENT-003 : le contrat serait satisfait, mais
     son autorite ne designe pas cette mission. La porte doit rester fermee. */
  writeResult('imposter.json', {
    representation: { authority: representation() },
    execution: { id: 'fixture-imposter' },
    source: { kind: 'PROTOCOL', authority: authority('02-REAL-USE-PROTOCOL.md', OTHER_BLOB) },
    reported_by: { executor: 'AGENT_FIXTURE' },
    return_contract: { authority: authority('mission.json', OTHER_BLOB) },
    reported_entries: [contractValue('rf-starting-head', BASELINE.head)],
  });

  /* Aucun composant applicable : rien ne relie ce resultat a la mission. */
  writeResult('protocol-no-contract.json', {
    representation: { authority: representation() },
    execution: { id: 'fixture-protocol' },
    source: { kind: 'PROTOCOL', authority: authority('02-REAL-USE-PROTOCOL.md', OTHER_BLOB) },
    reported_by: { executor: 'AGENT_FIXTURE' },
    reported_entries: [
      {
        kind: 'REPORTED_VALUE',
        fact: { defined_by: 'EXECUTOR', id: 'observation-libre' },
        value: { type: 'SCALAR', value: 'aucune exigence prospective' },
      },
    ],
  });

  /* Contrat associe, mais mecaniquement invalide : exigence inconnue. */
  writeResult('contract-unknown-requirement.json', {
    representation: { authority: representation() },
    execution: { id: 'fixture-unknown-requirement' },
    source: { kind: 'MISSION', authority: authority('mission.json', HISTORICAL.missionBlob) },
    reported_by: { executor: 'AGENT_FIXTURE' },
    return_contract: { authority: authority('mission.json', HISTORICAL.missionBlob) },
    reported_entries: [contractValue('rf-exigence-inexistante', 'x')],
  });

  const withEvidence = (id, value, evidence) => {
    const entry = contractValue(id, value);
    entry.evidence = evidence;
    return entry;
  };

  writeResult('evidence-variants.json', {
    representation: { authority: representation() },
    execution: { id: 'fixture-evidence' },
    source: { kind: 'MISSION', authority: authority('mission.json', HISTORICAL.missionBlob) },
    reported_by: { executor: 'AGENT_FIXTURE' },
    return_contract: { authority: authority('mission.json', HISTORICAL.missionBlob) },
    reported_entries: [
      withEvidence('rf-starting-head', 'a', {
        locator: { kind: 'REPO_PATH', value: 'evidence/kept.txt' },
        identity: { kind: 'GIT_BLOB', value: HISTORICAL.evidenceBlob },
      }),
      withEvidence('rf-readme-final-blob', 'b', {
        locator: { kind: 'REPO_PATH', value: 'evidence/kept.txt' },
        identity: { kind: 'GIT_BLOB', value: OTHER_BLOB },
      }),
      withEvidence('rf-commit-identifier', 'c', {
        locator: { kind: 'REPO_PATH', value: 'evidence/kept.txt' },
      }),
      withEvidence('rf-remote-main-head', 'd', {
        locator: { kind: 'REMOTE_REF', value: 'origin/main' },
        identity: { kind: 'GIT_BLOB', value: HISTORICAL.evidenceBlob },
      }),
      withEvidence('rf-push-status', 'e', {
        locator: { kind: 'REPO_PATH', value: 'escape/secret.txt' },
        identity: { kind: 'GIT_BLOB', value: HISTORICAL.evidenceBlob },
      }),
      withEvidence('rf-blocker-reason', 'f', {
        locator: { kind: 'REPO_PATH', value: '../outside/secret.txt' },
        identity: { kind: 'GIT_BLOB', value: HISTORICAL.evidenceBlob },
      }),
    ],
  });

  writeFileSync(join(results, 'malformed.json'), '{ ceci n est pas du JSON');
  writeFileSync(join(results, 'invalid-utf8.json'), Buffer.from([0x7b, 0xff, 0x7d]));
  writeResult('structurally-invalid.json', {
    representation: { authority: representation() },
    execution: { id: 'fixture-invalide' },
    source: { kind: 'MISSION', authority: authority('mission.json', HISTORICAL.missionBlob) },
    reported_entries: [],
  });

  /* Echappement par lien : jonction sous Windows, lien de repertoire ailleurs.
     Les deux sont resolus par `realpath`, et les deux doivent etre refuses. */
  symlinkSync(outside, join(repository, 'escape'), process.platform === 'win32' ? 'junction' : 'dir');

  return { root, repository, outside };
}

const fixture = buildFixtureRepository();
const lab = await start({ repoRoot: LAB_ROOT, port: 0 });
const sandbox = await start({ repoRoot: fixture.repository, port: 0 });

const labGet = (path, options) => httpCall(lab.port, path, options);
const sandboxGet = (path, options) => httpCall(sandbox.port, path, options);

const resultQuery = (path, missionPath, missionBlob) =>
  '/api/result?path=' +
  encodeURIComponent(path) +
  '&missionPath=' +
  encodeURIComponent(missionPath) +
  '&missionBlob=' +
  encodeURIComponent(missionBlob);

const sandboxResult = (name, missionBlob = HISTORICAL.missionBlob) =>
  sandboxGet(resultQuery('results/' + name, 'mission.json', missionBlob));

after(async () => {
  await lab.close();
  await sandbox.close();
  try {
    unlinkSync(join(fixture.repository, 'escape'));
  } catch {
    /* le lien peut deja avoir disparu */
  }
  rmSync(fixture.root, { recursive: true, force: true });
});

/* ================================================================== *
 * STRUCTURE PRODUIT
 * ================================================================== */

test('exactement 3 panneaux produit, et le bandeau n en est pas un quatrieme', () => {
  const html = readFileSync(join(CONSOLE_DIR, 'public', 'index.html'), 'utf8');
  const panels = [...html.matchAll(/data-product-panel="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(panels, ['A', 'B', 'C']);
  assert.equal(panels.length, 3);
  assert.ok(html.includes('data-band="repository"'), 'le bandeau partage est un bandeau');
  assert.ok(!html.includes('data-product-panel="D"'), 'aucun panneau D');
});

test('aucune ressource externe dans l interface', () => {
  const html = readFileSync(join(CONSOLE_DIR, 'public', 'index.html'), 'utf8');
  const css = readFileSync(join(CONSOLE_DIR, 'public', 'console.css'), 'utf8');
  for (const source of [html, css]) {
    assert.ok(!/https?:\/\//i.test(source), 'aucune URL absolue');
    assert.ok(!/\/\/cdn/i.test(source), 'aucun CDN');
  }
  assert.ok(!/<script(?![^>]*\ssrc=)/i.test(html), 'aucun script en ligne');
  assert.ok(!/<style[\s>]/i.test(html), 'aucun bloc de style en ligne');
  assert.ok(!/\sstyle="/i.test(html), 'aucun attribut style en ligne');
});

test('le contrat de routes est exhaustif et ne contient aucun lecteur generique', () => {
  assert.deepEqual([...ROUTES], [
    '/',
    '/console.css',
    '/console.mjs',
    '/api/context',
    '/api/program-state',
    '/api/candidates',
    '/api/mission',
    '/api/result',
  ]);
  for (const route of ROUTES) {
    assert.ok(!route.includes('evidence'), 'aucune route de preuve arbitraire');
    assert.ok(!route.includes('exec'), 'aucune route d execution');
    assert.ok(!route.includes('file'), 'aucune route de fichier');
  }
});

test('le graphe d import gele est respecte, fichier par fichier', () => {
  const expected = {
    'server.mjs': [
      'node:http',
      'node:fs',
      'node:path',
      './repo.mjs',
      './program-state-adapter.mjs',
      './mission-adapter.mjs',
      './result-adapter.mjs',
    ],
    'capture.mjs': ['node:fs', 'node:crypto', 'node:util'],
    'repo.mjs': ['node:fs', 'node:path', 'node:child_process'],
    'program-state-adapter.mjs': ['./capture.mjs', '../program-state/program-state.mjs'],
    'mission-adapter.mjs': [
      './capture.mjs',
      '../mission-object/mission-object.mjs',
      '../mission-object/validate.mjs',
      '../mission-object/render.mjs',
    ],
    'result-adapter.mjs': [
      './capture.mjs',
      './mission-adapter.mjs',
      './repo.mjs',
      '../result-instance/result-instance.mjs',
      '../result-instance/validate.mjs',
    ],
    'public/console.mjs': [],
  };

  for (const [name, specifiers] of Object.entries(expected)) {
    const source = readFileSync(join(CONSOLE_DIR, name), 'utf8');
    const found = [...source.matchAll(/(?:^|\n)import [^;]*from '([^']+)'/g)].map(
      (match) => match[1],
    );
    assert.deepEqual(found, specifiers, 'imports de ' + name);
  }

  /* Le rendu client ne depend d'AUCUN module : rien a charger depuis le
     navigateur, donc rien d'externe a autoriser. */
  assert.deepEqual(
    [...readFileSync(join(CONSOLE_DIR, 'public', 'console.mjs'), 'utf8').matchAll(/from '/g)],
    [],
  );
});

test('aucun fichier de la console ne declenche une garde CLI existante', () => {
  /* Les gardes CLI des runtimes etablis sont des tests de suffixe sur
     `process.argv[1]`. Un fichier de console qui finirait par l'un de ces
     suffixes declencherait un `main()` etranger au simple import. */
  for (const name of [...PRODUCT_SOURCES, 'tests/console.test.mjs']) {
    assert.ok(!name.endsWith('program-state.mjs'), name);
    assert.ok(!name.endsWith('validate.mjs'), name);
  }
});

test('la reponse de resultat porte exactement le schema gele', async () => {
  const response = await labGet(
    resultQuery(HISTORICAL.resultPath, HISTORICAL.missionPath, HISTORICAL.missionBlob),
  );
  assert.deepEqual(Object.keys(response.json).sort(), [
    'aggregate',
    'capture',
    'contractValidation',
    'evidence',
    'missionRecapture',
    'nonProduction',
    'pathDivergence',
    'reportedValues',
    'returnContractAssociation',
    'sourceAssociation',
    'validation',
  ]);
  assert.deepEqual(Object.keys(response.json.capture).sort(), [
    'blob',
    'bytes',
    'path',
    'sha256',
  ]);

  const programState = await labGet('/api/program-state');
  assert.deepEqual(Object.keys(programState.json).sort(), [
    'capture',
    'evidenceSummary',
    'evidenceVerification',
    'state',
  ]);
  assert.deepEqual(Object.keys(programState.json.state).sort(), [
    'checkpoint',
    'decisions',
    'git_context',
    'next_action',
    'streams',
  ]);

  const candidates = await labGet('/api/candidates?class=MISSION');
  assert.deepEqual(Object.keys(candidates.json).sort(), ['candidates', 'roots']);
});

/* ================================================================== *
 * PANNEAU A -- ETAT DU LAB
 * ================================================================== */

test('panneau A : la projection est celle du checkpoint capture, verbatim', async () => {
  const response = await labGet('/api/program-state');
  assert.equal(response.status, 200);
  const projected = response.json;

  const recorded = JSON.parse(readFileSync(join(LAB_ROOT, 'PROGRAM-STATE.json'), 'utf8'));

  assert.deepEqual(projected.state.checkpoint, recorded.checkpoint);
  assert.deepEqual(projected.state.git_context, recorded.git_context);

  assert.deepEqual(
    projected.state.streams.map((stream) => stream.id),
    recorded.streams.map((stream) => stream.id),
  );
  assert.deepEqual(
    projected.state.decisions.map((decision) => decision.id),
    recorded.decisions.map((decision) => decision.id),
  );

  /* `type` est rendu VERBATIM : les deux orthographes reelles coexistent, et
     la console n'en normalise aucune. */
  assert.deepEqual(
    projected.state.streams.map((stream) => stream.type),
    recorded.streams.map((stream) => stream.type),
  );
  const spellings = new Set(projected.state.streams.map((stream) => stream.type));
  assert.ok(spellings.has('TOOLING_EXPERIMENT'));
  assert.ok(spellings.has('TOOLING EXPERIMENT'));

  assert.equal(projected.state.next_action.state, recorded.next_action.state);
  /* Texte enregistre COMPLET, non tronque. */
  assert.equal(projected.state.next_action.value, recorded.next_action.value);
  assert.ok(projected.state.next_action.value.length > 400);

  assert.equal(projected.capture.path, 'PROGRAM-STATE.json');
  assert.equal(
    projected.capture.bytes,
    readFileSync(join(LAB_ROOT, 'PROGRAM-STATE.json')).length,
  );
  assert.equal(projected.capture.blob, BASELINE.programState);
});

test('panneau A : les references de support reellement enregistrees sont affichees', async () => {
  const projected = (await labGet('/api/program-state')).json;
  const recorded = JSON.parse(readFileSync(join(LAB_ROOT, 'PROGRAM-STATE.json'), 'utf8'));

  const recordedEvidence = [
    ...recorded.streams.flatMap((stream) => stream.evidence ?? []),
    ...recorded.decisions.flatMap((decision) => decision.evidence ?? []),
    ...(recorded.next_action.evidence ?? []),
  ];
  const projectedEvidence = [
    ...projected.state.streams.flatMap((stream) => stream.evidence),
    ...projected.state.decisions.flatMap((decision) => decision.evidence),
    ...projected.state.next_action.evidence,
  ];

  assert.equal(projectedEvidence.length, recordedEvidence.length);
  assert.equal(projected.evidenceSummary.total, recordedEvidence.length);
  assert.deepEqual(
    projectedEvidence.map((entry) => entry.id),
    recordedEvidence.map((entry) => entry.id),
  );

  for (const [index, entry] of projectedEvidence.entries()) {
    const source = recordedEvidence[index];
    assert.equal(entry.kind, source.kind);
    assert.equal(entry.ref, source.ref);
    assert.equal(entry.policy, source.policy);
    assert.deepEqual(entry.supports, source.supports ?? null);
    /* `observed.blob` est la valeur ENREGISTREE, presente exactement la ou
       elle l'est dans le checkpoint -- jamais recalculee. */
    if (source.observed && source.observed.blob !== undefined) {
      assert.deepEqual(entry.observed, { blob: source.observed.blob });
    } else {
      assert.equal(entry.observed, undefined);
    }
  }
});

test('panneau A : l enonce de non-verification est present et non conditionnel', async () => {
  const projected = (await labGet('/api/program-state')).json;
  assert.equal(projected.evidenceVerification.status, 'NOT_EXECUTED_BY_CONSOLE_V0');
  assert.equal(EVIDENCE_VERIFICATION_STATUS, 'NOT_EXECUTED_BY_CONSOLE_V0');

  const html = readFileSync(join(CONSOLE_DIR, 'public', 'index.html'), 'utf8');
  assert.ok(
    html.includes('PROGRAM-STATE EVIDENCE VERIFICATION = NOT EXECUTED BY CONSOLE V0'),
    'enonce present dans le panneau A',
  );
  /* Non conditionnel : l'enonce est du balisage statique, pas une valeur
     remplie par une reponse, et il n'est pas replie derriere un `hidden`. */
  const statement = html.match(/<p class="statement"[^>]*>[\s\S]*?<\/p>/);
  assert.ok(statement, 'enonce dans un paragraphe statique');
  assert.ok(!statement[0].includes('hidden'), 'enonce non repliable');
});

test('panneau A : findings, material et exitCode sont ABSENTS du modele', async () => {
  const projected = (await labGet('/api/program-state')).json;

  const forbidden = ['findings', 'material', 'exitCode'];
  const walk = (value, path) => {
    if (value === null || typeof value !== 'object') return;
    if (Array.isArray(value)) {
      value.forEach((item, index) => walk(item, path + '[' + index + ']'));
      return;
    }
    for (const key of Object.keys(value)) {
      assert.ok(!forbidden.includes(key), 'champ interdit ' + key + ' en ' + path);
      walk(value[key], path + '.' + key);
    }
  };
  walk(projected, 'reponse');

  /* Et l'adaptateur n'importe aucune des surfaces de verification. */
  const adapter = readFileSync(join(CONSOLE_DIR, 'program-state-adapter.mjs'), 'utf8');
  const imports = adapter.match(/import \{[^}]*\} from '\.\.\/program-state\/program-state\.mjs'/);
  assert.ok(imports, 'import nomme depuis le runtime PROGRAM-STATE');
  for (const forbiddenSurface of [
    'check',
    'checkEvidence',
    'blobOf',
    'renderCheck',
    'claimsOf',
    'renderResume',
    'save',
    'writeAtomic',
  ]) {
    assert.ok(
      !imports[0].includes(forbiddenSurface),
      'surface interdite importee : ' + forbiddenSurface,
    );
  }
});

test('panneau A : la projection ne depend pas du serveur HTTP', () => {
  const repository = openRepository(LAB_ROOT);
  const projected = projectProgramState(
    join(LAB_ROOT, 'PROGRAM-STATE.json'),
    'PROGRAM-STATE.json',
    repository.objectFormat,
  );
  assert.equal(projected.capture.blob, BASELINE.programState);
  assert.equal(projected.evidenceVerification.status, 'NOT_EXECUTED_BY_CONSOLE_V0');
});

/* ================================================================== *
 * PANNEAU B -- MISSION
 * ================================================================== */

test('panneau B : identite de la mission historique', async () => {
  const response = await labGet('/api/mission?path=' + encodeURIComponent(HISTORICAL.missionPath));
  assert.equal(response.status, 200);
  assert.equal(response.json.capture.bytes, HISTORICAL.missionBytes);
  assert.equal(response.json.capture.blob, HISTORICAL.missionBlob);
  assert.deepEqual(response.json.snapshot, {
    path: HISTORICAL.missionPath,
    blob: HISTORICAL.missionBlob,
  });
  assert.equal(typeof response.json.capture.sha256, 'string');
  assert.equal(response.json.capture.sha256.length, 64);
});

test('panneau B : la mission historique valide', async () => {
  const response = await labGet('/api/mission?path=' + encodeURIComponent(HISTORICAL.missionPath));
  assert.equal(response.json.validation.ok, true);
  assert.deepEqual(response.json.validation.errors, []);
});

test('panneau B : enveloppe historique BYTE-IDENTICAL', async () => {
  const response = await labGet('/api/mission?path=' + encodeURIComponent(HISTORICAL.missionPath));
  const bytes = Buffer.from(response.json.render.text, 'utf8');
  assert.equal(bytes.length, HISTORICAL.envelopeBytes);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), HISTORICAL.envelopeSha256);
  assert.equal(gitBlobId(bytes), HISTORICAL.envelopeBlob);
});

test('panneau B : renderCoverage n est ni importe ni expose', async () => {
  const response = await labGet('/api/mission?path=' + encodeURIComponent(HISTORICAL.missionPath));
  assert.deepEqual(Object.keys(response.json).sort(), [
    'capture',
    'render',
    'snapshot',
    'validation',
  ]);
  assert.equal(response.json.coverage, undefined);

  /* Ni appelee, ni importee, nulle part dans le code produit. */
  for (const name of PRODUCT_SOURCES) {
    assert.ok(!productCode(name).includes('renderCoverage'), 'renderCoverage dans ' + name);
  }

  /* Et l'import depuis le runtime de rendu se limite a `render`. */
  const adapter = readFileSync(join(CONSOLE_DIR, 'mission-adapter.mjs'), 'utf8');
  const renderImport = adapter.match(/import \{([^}]*)\} from '\.\.\/mission-object\/render\.mjs'/);
  assert.ok(renderImport, 'import nomme depuis le runtime de rendu');
  assert.deepEqual(
    renderImport[1]
      .split(',')
      .map((binding) => binding.trim())
      .filter(Boolean),
    ['render'],
  );
});

test('panneau B : COPIER recoit EXACTEMENT render().text', async () => {
  const response = await labGet('/api/mission?path=' + encodeURIComponent(HISTORICAL.missionPath));
  const payload = missionCopyPayload(response.json);
  assert.equal(payload, response.json.render.text);

  const written = [];
  const clipboard = {
    writeText: async (text) => {
      written.push(text);
    },
  };
  const outcome = await copyMission(clipboard, response.json);
  assert.equal(outcome.copied, true);
  assert.equal(written.length, 1);
  assert.equal(written[0], response.json.render.text);
  const bytes = Buffer.from(written[0], 'utf8');
  assert.equal(bytes.length, HISTORICAL.envelopeBytes);
  assert.equal(gitBlobId(bytes), HISTORICAL.envelopeBlob);
});

test('panneau B : un refus du presse-papiers ne rend pas la mission invalide', async () => {
  const response = await labGet('/api/mission?path=' + encodeURIComponent(HISTORICAL.missionPath));
  const clipboard = {
    writeText: async () => {
      throw new Error('permission refusee');
    },
  };
  const outcome = await copyMission(clipboard, response.json);
  assert.equal(outcome.copied, false);
  assert.equal(outcome.reason, 'CLIPBOARD_REFUSED');
  assert.equal(response.json.validation.ok, true);
});

/* ================================================================== *
 * PANNEAU C -- RESULTAT
 * ================================================================== */

test('panneau C : identite de la Result Instance historique', async () => {
  const response = await labGet(
    resultQuery(HISTORICAL.resultPath, HISTORICAL.missionPath, HISTORICAL.missionBlob),
  );
  assert.equal(response.status, 200);
  assert.equal(response.json.capture.bytes, HISTORICAL.resultBytes);
  assert.equal(response.json.capture.blob, HISTORICAL.resultBlob);
  assert.equal(response.json.validation.ok, true);
  assert.deepEqual(response.json.missionRecapture, {
    path: HISTORICAL.missionPath,
    blob: HISTORICAL.missionBlob,
    confirmed: true,
  });
});

test('panneau C : association de source et de contrat, rendues separement', async () => {
  const response = await labGet(
    resultQuery(HISTORICAL.resultPath, HISTORICAL.missionPath, HISTORICAL.missionBlob),
  );
  const payload = response.json;
  assert.equal(payload.sourceAssociation.status, 'MATCH');
  assert.equal(payload.returnContractAssociation.status, 'MATCH');
  assert.deepEqual(payload.pathDivergence, []);
  assert.equal(payload.aggregate, 'MATCH');
  /* Jamais fusionnees en un booleen. */
  assert.notEqual(payload.sourceAssociation, payload.returnContractAssociation);
  assert.equal(typeof payload.aggregate, 'string');
});

test('panneau C : la porte de contrat s ouvre quand l association est etablie', async () => {
  const response = await labGet(
    resultQuery(HISTORICAL.resultPath, HISTORICAL.missionPath, HISTORICAL.missionBlob),
  );
  assert.equal(response.json.contractValidation.run, true);
  assert.equal(response.json.contractValidation.ok, true);
  assert.equal(response.json.contractValidation.checked, 9);
});

test('panneau C : valeurs rapportees et non-production structurelle', async () => {
  const payload = (
    await labGet(resultQuery(HISTORICAL.resultPath, HISTORICAL.missionPath, HISTORICAL.missionBlob))
  ).json;
  assert.equal(payload.reportedValues.length, 9);
  assert.deepEqual(payload.nonProduction, []);

  const outcome = payload.reportedValues.find((entry) => entry.id === 'rf-task-outcome');
  assert.equal(outcome.valueType, 'SYMBOL');
  assert.equal(outcome.value, 'PASS');
  assert.equal(outcome.defined_by, 'RETURN_CONTRACT');
  /* Cle de fait QUALIFIEE PAR SA PORTEE. */
  assert.equal(outcome.factKey, 'RETURN_CONTRACT/' + HISTORICAL.missionBlob + '/rf-task-outcome');

  const paths = payload.reportedValues.find((entry) => entry.id === 'rf-modified-paths');
  assert.equal(paths.valueType, 'SET');
  assert.deepEqual(paths.value, ['README.md']);
});

test('panneau C : identite de la preuve historique', async () => {
  const payload = (
    await labGet(resultQuery(HISTORICAL.resultPath, HISTORICAL.missionPath, HISTORICAL.missionBlob))
  ).json;
  assert.equal(payload.evidence.length, 1);
  const [evidence] = payload.evidence;
  assert.equal(evidence.locator.kind, 'REPO_PATH');
  assert.equal(evidence.locator.value, HISTORICAL.evidencePath);
  assert.equal(evidence.identity.value, HISTORICAL.evidenceBlob);
  assert.equal(evidence.resolution, 'MATCH');
  assert.equal(evidence.capturedBytes, HISTORICAL.evidenceBytes);
  assert.equal(evidence.capturedBlob, HISTORICAL.evidenceBlob);
});

test('panneau C : la preuve temporelle historique n est JAMAIS comparee au distant courant', async () => {
  const response = await labGet(
    resultQuery(HISTORICAL.resultPath, HISTORICAL.missionPath, HISTORICAL.missionBlob),
  );
  const serialized = JSON.stringify(response.json);

  /* La tete distante historique est une VALEUR RAPPORTEE, presentee telle
     quelle -- et la tete distante COURANTE n'apparait nulle part. */
  const reported = response.json.reportedValues.find(
    (entry) => entry.id === 'rf-remote-main-head',
  );
  assert.equal(reported.value, 'a1d731ede86befaadfa2d8da6a022e3fd44f9ec4');
  assert.notEqual(BASELINE.remoteMain, reported.value, 'le distant a bien avance depuis');
  assert.ok(
    !serialized.includes(BASELINE.remoteMain),
    'la tete distante courante n apparait pas dans la reponse',
  );
  assert.ok(!serialized.includes('origin/main'), 'aucune reference au distant courant');

  /* Et la console n'a interroge aucun distant : la preuve est comparee a son
     identite immuable historique, pas a l'etat du monde d'aujourd'hui. */
  for (const argv of gitInvocations()) {
    assert.ok(!argv.includes('ls-remote'), 'aucune interrogation du distant');
  }
});

test('panneau C : MATCH + PATH_DIVERGENCE, sans jamais degrader l identite', async () => {
  const payload = (await sandboxResult('divergent.json')).json;
  assert.equal(payload.sourceAssociation.status, 'MATCH');
  assert.equal(payload.returnContractAssociation.status, 'MATCH');
  assert.deepEqual(payload.pathDivergence, [
    { which: 'source', expected: 'mission.json', actual: 'archive/copie/mission.json' },
  ]);
  /* La divergence est rendue SEPAREMENT, et n'annule pas le MATCH. */
  assert.equal(payload.aggregate, 'MATCH');
});

test('panneau C : une contradiction d identite DEMONTREE vaut MISMATCH', async () => {
  const payload = (await sandboxResult('mismatch.json')).json;
  assert.equal(payload.sourceAssociation.status, 'MISMATCH');
  assert.equal(payload.returnContractAssociation.status, 'MATCH');
  assert.equal(payload.aggregate, 'MISMATCH');
  /* L'agregat MISMATCH ne ferme pas la porte du contrat : les deux
     associations sont independantes. */
  assert.equal(payload.contractValidation.run, true);
});

test('panneau C : la porte reste fermee quand le contrat ne designe pas cette mission', async () => {
  const payload = (await sandboxResult('imposter.json')).json;
  assert.equal(payload.sourceAssociation.status, 'NOT_APPLICABLE_TO_SELECTED_MISSION');
  assert.equal(payload.returnContractAssociation.status, 'MISMATCH');
  assert.equal(payload.aggregate, 'MISMATCH');
  assert.equal(payload.contractValidation.run, false);
  assert.equal(payload.contractValidation.reason, 'RETURN_CONTRACT_ASSOCIATION_NOT_MATCH');
  assert.equal(payload.contractValidation.ok, undefined);
});

test('panneau C : aucun composant applicable ne vaut jamais MATCH', async () => {
  const payload = (await sandboxResult('protocol-no-contract.json')).json;
  assert.equal(payload.sourceAssociation.status, 'NOT_APPLICABLE_TO_SELECTED_MISSION');
  assert.equal(payload.returnContractAssociation.status, 'NOT_APPLICABLE');
  assert.equal(payload.returnContractAssociation.reason, 'NO_RETURN_CONTRACT');
  assert.equal(payload.contractValidation.run, false);
  assert.equal(payload.contractValidation.reason, 'NOT_APPLICABLE');
  assert.equal(payload.aggregate, 'CANNOT_ESTABLISH');
});

test('panneau C : le genre de source ne se deduit pas de la presence du contrat', async () => {
  /* Source MISSION avec contrat, source PROTOCOL avec contrat, source PROTOCOL
     sans contrat : les trois combinaisons sont lues independamment. */
  const withContract = (await sandboxResult('aligned.json')).json;
  assert.equal(withContract.sourceAssociation.status, 'MATCH');
  assert.equal(withContract.returnContractAssociation.status, 'MATCH');

  const protocolWithContract = (await sandboxResult('imposter.json')).json;
  assert.equal(protocolWithContract.sourceAssociation.status, 'NOT_APPLICABLE_TO_SELECTED_MISSION');
  assert.notEqual(protocolWithContract.returnContractAssociation.status, 'NOT_APPLICABLE');

  const protocolWithout = (await sandboxResult('protocol-no-contract.json')).json;
  assert.equal(protocolWithout.returnContractAssociation.status, 'NOT_APPLICABLE');
});

test('politique d identite : identite absente vaut CANNOT_ESTABLISH, jamais MISMATCH', () => {
  const divergence = [];
  const association = associateAuthority(
    'source',
    { locator: { kind: 'REPO_PATH', value: 'mission.json' } },
    HISTORICAL.missionBlob,
    'mission.json',
    divergence,
  );
  assert.equal(association.status, 'CANNOT_ESTABLISH');
  assert.equal(association.reason, 'NO_IDENTITY_PROVIDED');
  assert.deepEqual(divergence, [], 'aucune divergence sans identite etablie');
});

test('politique d identite : genre non supporte vaut CANNOT_ESTABLISH, jamais MISMATCH', () => {
  const divergence = [];
  const association = associateAuthority(
    'return_contract',
    {
      locator: { kind: 'REPO_PATH', value: 'mission.json' },
      identity: { kind: 'SHA256', value: 'f'.repeat(64) },
    },
    HISTORICAL.missionBlob,
    'mission.json',
    divergence,
  );
  assert.equal(association.status, 'CANNOT_ESTABLISH');
  assert.equal(association.reason, 'UNSUPPORTED_IDENTITY_KIND');
  assert.deepEqual(divergence, []);
});

test('politique d identite : un chemin egal n etablit JAMAIS une identite', () => {
  const divergence = [];
  const association = associateAuthority(
    'source',
    {
      locator: { kind: 'REPO_PATH', value: 'mission.json' },
      identity: { kind: 'GIT_BLOB', value: OTHER_BLOB },
    },
    HISTORICAL.missionBlob,
    'mission.json',
    divergence,
  );
  assert.equal(association.status, 'MISMATCH');
  assert.deepEqual(divergence, []);
});

/* ================================================================== *
 * LIAISON DE VERSION DE MISSION
 * ================================================================== */

test('409 MISSION_VERSION_CHANGED : jamais de validation contre une version silencieuse', async () => {
  const response = await labGet(
    resultQuery(HISTORICAL.resultPath, HISTORICAL.missionPath, ABSENT_BLOB),
  );
  assert.equal(response.status, 409);
  assert.equal(response.json.code, 'MISSION_VERSION_CHANGED');
  assert.equal(response.json.details.missionRecapture.confirmed, false);
  assert.equal(response.json.details.missionRecapture.blob, HISTORICAL.missionBlob);
  assert.equal(response.json.details.requestedMissionBlob, ABSENT_BLOB);
  assert.equal(response.json.details.aggregate, 'CANNOT_ESTABLISH');
  assert.equal(response.json.details.sourceAssociation.status, 'CANNOT_ESTABLISH');
  assert.equal(response.json.details.returnContractAssociation.status, 'CANNOT_ESTABLISH');
  assert.equal(response.json.details.contractValidation.run, false);
});

test('la liaison de version est obligatoire', async () => {
  const response = await labGet(
    '/api/result?path=' +
      encodeURIComponent(HISTORICAL.resultPath) +
      '&missionPath=' +
      encodeURIComponent(HISTORICAL.missionPath),
  );
  assert.equal(response.status, 400);
  assert.equal(response.json.code, 'BAD_REQUEST');
});

/* ================================================================== *
 * COHERENCE NAVIGATEUR
 * ================================================================== */

function deferred() {
  let settle;
  const promise = new Promise((resolveDeferred) => {
    settle = resolveDeferred;
  });
  return { promise, resolve: settle };
}

class RecordingAbort {
  constructor() {
    this.signal = { aborted: false };
    RecordingAbort.created.push(this);
  }
  abort() {
    this.signal.aborted = true;
    RecordingAbort.aborted.push(this);
  }
}

test('une reponse de mission tardive est ECARTEE, pas rendue', async () => {
  RecordingAbort.created = [];
  RecordingAbort.aborted = [];
  const first = deferred();
  const second = deferred();
  let call = 0;
  const applied = [];

  const coordinator = createCoordinator({
    fetchImpl: () => {
      call += 1;
      return call === 1 ? first.promise : second.promise;
    },
    AbortImpl: RecordingAbort,
  });

  const pending = coordinator.selectMission('/api/mission?path=A', (payload) =>
    applied.push(payload),
  );
  const current = coordinator.selectMission('/api/mission?path=B', (payload) =>
    applied.push(payload),
  );

  second.resolve({ tag: 'B' });
  assert.deepEqual(await current, { applied: true, discarded: false });

  first.resolve({ tag: 'A' });
  assert.deepEqual(await pending, { applied: false, discarded: true });

  assert.deepEqual(applied, [{ tag: 'B' }]);
  assert.equal(coordinator.discardedCounts().mission, 1);
  assert.ok(RecordingAbort.aborted.length >= 1, 'la requete perimee a ete abandonnee');
  assert.equal(coordinator.generations().mission, 2);
});

test('une reponse de resultat tardive est ECARTEE, pas rendue', async () => {
  RecordingAbort.created = [];
  RecordingAbort.aborted = [];
  const first = deferred();
  const second = deferred();
  let call = 0;
  const applied = [];

  const coordinator = createCoordinator({
    fetchImpl: () => {
      call += 1;
      return call === 1 ? first.promise : second.promise;
    },
    AbortImpl: RecordingAbort,
  });

  const pending = coordinator.selectResult('/api/result?path=R1', (payload) =>
    applied.push(payload),
  );
  const current = coordinator.selectResult('/api/result?path=R2', (payload) =>
    applied.push(payload),
  );

  second.resolve({ tag: 'R2' });
  assert.deepEqual(await current, { applied: true, discarded: false });
  first.resolve({ tag: 'R1' });
  assert.deepEqual(await pending, { applied: false, discarded: true });

  assert.deepEqual(applied, [{ tag: 'R2' }]);
  assert.equal(coordinator.discardedCounts().result, 1);
});

test('changer de mission invalide TOUT l etat derive du resultat', async () => {
  RecordingAbort.created = [];
  RecordingAbort.aborted = [];
  const resultInFlight = deferred();
  const missionResponse = deferred();
  let purges = 0;
  const appliedResults = [];

  const coordinator = createCoordinator({
    fetchImpl: (url) => (url.startsWith('/api/result') ? resultInFlight.promise : missionResponse.promise),
    AbortImpl: RecordingAbort,
    onResultPurge: () => {
      purges += 1;
    },
  });

  const pendingResult = coordinator.selectResult('/api/result?path=R1', (payload) =>
    appliedResults.push(payload),
  );

  const missionChange = coordinator.selectMission('/api/mission?path=B', () => {});
  missionResponse.resolve({ tag: 'B' });
  await missionChange;

  resultInFlight.resolve({ tag: 'R1' });
  assert.deepEqual(await pendingResult, { applied: false, discarded: true });

  assert.deepEqual(appliedResults, [], 'aucun resultat perime rendu');
  assert.ok(purges >= 1, 'l etat derive du resultat a ete purge');
  assert.equal(coordinator.generations().result >= 2, true);
});

test('abandonner la mission ecarte aussi les reponses en vol', async () => {
  RecordingAbort.created = [];
  RecordingAbort.aborted = [];
  const inFlight = deferred();
  const applied = [];
  const coordinator = createCoordinator({
    fetchImpl: () => inFlight.promise,
    AbortImpl: RecordingAbort,
  });

  const pending = coordinator.selectMission('/api/mission?path=A', (payload) =>
    applied.push(payload),
  );
  coordinator.clearMission();
  inFlight.resolve({ tag: 'A' });

  assert.deepEqual(await pending, { applied: false, discarded: true });
  assert.deepEqual(applied, []);
});

/* ================================================================== *
 * CONFINEMENT ET AUTORITE DE LECTURE
 * ================================================================== */

test('echappement de chemin direct rejete', async () => {
  for (const escape of [
    '../secret.txt',
    '../../secret.txt',
    'tooling/../../secret.txt',
    '/etc/passwd',
  ]) {
    const response = await labGet('/api/mission?path=' + encodeURIComponent(escape));
    assert.equal(response.status, 403, escape);
    assert.equal(response.json.code, 'PATH_OUT_OF_ROOT', escape);
  }
});

test('echappement par lien rejete : la cible reelle est hors racine', async () => {
  const outsideBytes = readFileSync(join(fixture.outside, 'secret.txt'));
  const response = await sandboxGet('/api/mission?path=' + encodeURIComponent('escape/secret.txt'));
  assert.equal(response.status, 403);
  assert.equal(response.json.code, 'PATH_OUT_OF_ROOT');
  assert.ok(
    !response.body.includes(outsideBytes.toString('utf8')),
    'aucun octet hors racine n a ete servi',
  );
});

test('lecture de preuve : seuls les localisateurs portes par le resultat sont resolus', async () => {
  const payload = (await sandboxResult('evidence-variants.json')).json;
  const byPath = (value) =>
    payload.evidence.find((entry) => entry.locator && entry.locator.value === value);

  const matching = payload.evidence[0];
  assert.equal(matching.resolution, 'MATCH');
  assert.equal(matching.capturedBlob, HISTORICAL.evidenceBlob);

  const mismatching = payload.evidence[1];
  assert.equal(mismatching.resolution, 'MISMATCH');
  assert.equal(mismatching.capturedBlob, HISTORICAL.evidenceBlob);

  const noIdentity = payload.evidence[2];
  assert.equal(noIdentity.resolution, 'UNRESOLVED');
  assert.equal(noIdentity.reason, 'NO_IDENTITY_PROVIDED');
  assert.equal(noIdentity.capturedBlob, undefined, 'aucune lecture sans identite a comparer');

  const remote = byPath('origin/main');
  assert.equal(remote.resolution, 'UNRESOLVED');
  assert.equal(remote.reason, 'NO_NETWORK_IN_V0');

  /* Un localisateur porte par l'artefact n'est PAS une autorite sur le systeme
     de fichiers : il repasse par le confinement, et il est refuse. */
  for (const escaping of ['escape/secret.txt', '../outside/secret.txt']) {
    const entry = byPath(escaping);
    assert.equal(entry.resolution, 'UNRESOLVED', escaping);
    assert.equal(entry.reason, 'PATH_OUT_OF_ROOT', escaping);
    assert.equal(entry.capturedBytes, undefined, escaping);
    assert.equal(entry.capturedBlob, undefined, escaping);
  }

  const serialized = JSON.stringify(payload);
  assert.ok(!serialized.includes('HORS DU DEPOT'), 'aucun octet hors racine dans la reponse');
});

test('aucun lecteur de fichiers generique n existe', async () => {
  for (const path of [
    '/api/evidence?path=PROGRAM-STATE.json',
    '/api/file?path=PROGRAM-STATE.json',
    '/api/read?path=PROGRAM-STATE.json',
    '/api/raw?path=PROGRAM-STATE.json',
    '/exec',
    '/api/exec?cmd=ls',
    '/console.mjs/../server.mjs',
  ]) {
    const response = await labGet(path);
    assert.equal(response.status, 404, path);
  }
});

test('aucune methode de mutation n est servie', async () => {
  for (const method of ['POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']) {
    const response = await labGet('/api/context', { method });
    assert.equal(response.status, 405, method);
  }
});

/* ================================================================== *
 * FRONTIERE NAVIGATEUR
 * ================================================================== */

test('Host inattendu rejete en 421', async () => {
  for (const host of ['evil.example', 'evil.example:80', '127.0.0.1:1', 'localhost']) {
    const response = await labGet('/api/context', { headers: { Host: host } });
    assert.equal(response.status, 421, host);
    assert.equal(response.json.code, 'HOST_REJECTED', host);
  }
  /* La liste blanche est construite sur le port REELLEMENT lie. */
  assert.deepEqual(allowedHosts(lab.port), ['127.0.0.1:' + lab.port, 'localhost:' + lab.port]);
  const accepted = await labGet('/api/context', { headers: { Host: 'localhost:' + lab.port } });
  assert.equal(accepted.status, 200);
});

test('Origin etrangere rejetee en 403, CORS desactive', async () => {
  const refused = await labGet('/api/context', { headers: { Origin: 'http://evil.example' } });
  assert.equal(refused.status, 403);
  assert.equal(refused.json.code, 'ORIGIN_REJECTED');

  const accepted = await labGet('/api/context', {
    headers: { Origin: 'http://127.0.0.1:' + lab.port },
  });
  assert.equal(accepted.status, 200);

  for (const response of [refused, accepted]) {
    for (const name of Object.keys(response.headers)) {
      assert.ok(
        !name.toLowerCase().startsWith('access-control-'),
        'aucun en-tete CORS : ' + name,
      );
    }
  }
});

test('Sec-Fetch-Site inter-site rejete sur les requetes API', async () => {
  for (const site of ['cross-site', 'same-site', 'none']) {
    const response = await labGet('/api/context', { headers: { 'Sec-Fetch-Site': site } });
    assert.equal(response.status, 403, site);
    assert.equal(response.json.code, 'CROSS_SITE_REJECTED', site);
  }
  const sameOrigin = await labGet('/api/context', {
    headers: { 'Sec-Fetch-Site': 'same-origin' },
  });
  assert.equal(sameOrigin.status, 200);
  const absent = await labGet('/api/context');
  assert.equal(absent.status, 200);

  /* Une navigation de premier niveau vers l'interface porte `none` et reste
     servie : la regle porte sur les requetes API. */
  const navigation = await labGet('/', { headers: { 'Sec-Fetch-Site': 'none' } });
  assert.equal(navigation.status, 200);
});

test('en-tetes de securite emis sur chaque reponse', async () => {
  for (const path of ['/', '/console.css', '/console.mjs', '/api/context', '/inexistant']) {
    const response = await labGet(path);
    assert.equal(
      response.headers['content-security-policy'],
      SECURITY_HEADERS['Content-Security-Policy'],
      path,
    );
    assert.equal(response.headers['x-content-type-options'], 'nosniff', path);
    assert.equal(response.headers['referrer-policy'], 'no-referrer', path);
  }
  const policy = SECURITY_HEADERS['Content-Security-Policy'];
  for (const directive of [
    "default-src 'none'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self'",
    "connect-src 'self'",
    "form-action 'none'",
    "frame-ancestors 'none'",
    "base-uri 'none'",
  ]) {
    assert.ok(policy.includes(directive), directive);
  }
});

test('l ecoute est liee a la boucle locale uniquement', () => {
  assert.equal(lab.server.address().address, '127.0.0.1');
  assert.equal(sandbox.server.address().address, '127.0.0.1');
});

/* ================================================================== *
 * SEMANTIQUE HTTP
 * ================================================================== */

test('artefact invalide : echec de decodage UTF-8 en 422', async () => {
  const response = await sandboxResult('invalid-utf8.json');
  assert.equal(response.status, 422);
  assert.equal(response.json.code, 'DECODE_FAILED');
  assert.ok(response.json.details.reason, 'details structures affichables');
});

test('artefact invalide : echec de parse en 422', async () => {
  const result = await sandboxResult('malformed.json');
  assert.equal(result.status, 422);
  assert.equal(result.json.code, 'PARSE_FAILED');

  const mission = await sandboxGet('/api/mission?path=malformed-mission.json');
  assert.equal(mission.status, 422);
  assert.equal(mission.json.code, 'PARSE_FAILED');
});

test('artefact invalide : echec de validation en 422', async () => {
  const mission = await sandboxGet('/api/mission?path=invalid-mission.json');
  assert.equal(mission.status, 422);
  assert.equal(mission.json.code, 'VALIDATION_FAILED');
  assert.ok(Array.isArray(mission.json.details.validation.errors));
  assert.ok(mission.json.details.validation.errors.length > 0);

  const result = await sandboxResult('structurally-invalid.json');
  assert.equal(result.status, 422);
  assert.equal(result.json.code, 'VALIDATION_FAILED');
  assert.equal(result.json.details.subject, 'RESULT_INSTANCE');
  assert.ok(result.json.details.validation.errors.length > 0);
});

test('artefact invalide : contrat mecaniquement invalide, une fois evalue, en 422', async () => {
  const response = await sandboxResult('contract-unknown-requirement.json');
  assert.equal(response.status, 422);
  assert.equal(response.json.code, 'CONTRACT_STRUCTURALLY_INVALID');
  assert.equal(response.json.details.contractValidation.run, true);
  assert.equal(response.json.details.contractValidation.ok, false);
  assert.ok(response.json.details.contractValidation.errors.length > 0);
  /* Le corps reste affichable : la projection complete accompagne l'erreur. */
  assert.equal(response.json.details.sourceAssociation.status, 'MATCH');
  assert.ok(Array.isArray(response.json.details.reportedValues));
});

test('les etats d association ne sont PAS des erreurs d artefact', async () => {
  for (const name of ['mismatch.json', 'imposter.json', 'protocol-no-contract.json', 'divergent.json']) {
    const response = await sandboxResult(name);
    assert.equal(response.status, 200, name);
  }
});

test('defaillance applicative inattendue en 500', async () => {
  /* PROGRAM-STATE.json est un REPERTOIRE dans le depot jetable : la lecture
     echoue sur un defaut qui n est PAS un artefact manquant. On ne deguise pas
     une panne en 404. */
  const response = await sandboxGet('/api/program-state');
  assert.equal(response.status, 500);
  assert.equal(response.json.code, 'INTERNAL_ERROR');
});

test('artefact introuvable en 404, requete malformee en 400', async () => {
  const missing = await labGet('/api/mission?path=' + encodeURIComponent('inexistant.json'));
  assert.equal(missing.status, 404);
  assert.equal(missing.json.code, 'ARTIFACT_NOT_FOUND');

  const noParameter = await labGet('/api/mission');
  assert.equal(noParameter.status, 400);
  assert.equal(noParameter.json.code, 'BAD_REQUEST');

  const badClass = await labGet('/api/candidates?class=AUTRE');
  assert.equal(badClass.status, 400);
  assert.equal(badClass.json.code, 'BAD_REQUEST');
});

/* ================================================================== *
 * CONTEXTE, CANDIDATS, INTERFACE
 * ================================================================== */

test('le bandeau de contexte expose les metadonnees du depot', async () => {
  const response = await labGet('/api/context');
  assert.equal(response.status, 200);
  assert.deepEqual(Object.keys(response.json).sort(), [
    'head',
    'objectFormat',
    'repositoryLabel',
    'rootLabel',
  ]);
  assert.equal(response.json.head, BASELINE.head);
  assert.equal(response.json.objectFormat, 'sha1');
});

test('l enumeration de candidats est bornee, et n est pas une frontiere', async () => {
  const missions = await labGet('/api/candidates?class=MISSION');
  assert.equal(missions.status, 200);
  assert.ok(missions.json.roots.length > 0);
  assert.ok(
    missions.json.candidates.some((candidate) => candidate.path === HISTORICAL.missionPath),
  );
  for (const candidate of missions.json.candidates) {
    assert.ok(candidate.path.endsWith('mission.json'), candidate.path);
    assert.equal(typeof candidate.bytes, 'number');
  }

  const results = await labGet('/api/candidates?class=RESULT');
  assert.ok(results.json.candidates.some((candidate) => candidate.path === HISTORICAL.resultPath));

  /* Un chemin absent de l'enumeration reste refuse par le confinement, et un
     chemin present n'est pas accepte PARCE QU'il est enumere. */
  const escape = await labGet('/api/mission?path=' + encodeURIComponent('../x.json'));
  assert.equal(escape.status, 403);
  assert.equal(listCandidates(openRepository(LAB_ROOT), 'MISSION').candidates.length >= 4, true);
});

/* ================================================================== *
 * DECOUVERTE BORNEE DE missions/
 * autorite 40 parties valides + autorite 41
 * ================================================================== */

/** La fixture de regression authentique, publiee sous `missions/`. */
const GENUINE = Object.freeze({
  missionPath: 'missions/001-decision-consequence-boundary/mission.json',
  resultPath: 'missions/001-decision-consequence-boundary/result.json',
  missionBytes: 54357,
  missionBlob: 'e80bc3d250920cee66b4d26bef497b6094395144',
  resultBytes: 32013,
  resultBlob: '69d2d1574eb3bf82148f23b36f4e2f4f1c1a4e07',
  envelope: 'missions/001-decision-consequence-boundary/envelope.md',
  observations: 'missions/001-decision-consequence-boundary/console-real-use-observations.md',
});

/** Les candidats PREEXISTANTS, mesures avant la remediation. */
const PRE_EXISTING = Object.freeze({
  MISSION: Object.freeze([
    'tooling/mission-object/dogfood/001/mission.json',
    'tooling/mission-object/dogfood/002/mission.json',
    'tooling/mission-object/dogfood/003/mission.json',
    'tooling/result-instance/live-dogfood/001/mission.json',
  ]),
  RESULT: Object.freeze([
    'tooling/result-instance/live-dogfood/001/result.json',
    'tooling/result-instance/representability/a.json',
    'tooling/result-instance/representability/b.json',
  ]),
});

const labCandidates = (candidateClass) =>
  listCandidates(openRepository(LAB_ROOT), candidateClass).candidates.map(
    (candidate) => candidate.path,
  );

/**
 * Depot jetable de DECOUVERTE, hors du depot du Lab.
 *
 * Il porte le voisinage complet d'une mission -- l'artefact, son resultat, et
 * tout ce qui cohabite avec eux -- a DEUX profondeurs differentes. La seconde
 * n'est pas decorative : si l'eligibilite se deduisait du repertoire COURANT
 * plutot que de la racine D'ORIGINE de l'enumeration, `missions/y/z` ne serait
 * plus reconnu comme racine stricte et `missions/y/z/metadata.json`
 * ressortirait candidat RESULT.
 */
function buildDiscoveryRepository() {
  const root = mkdtempSync(join(tmpdir(), 'local-mission-console-v0-decouverte-'));
  const repository = join(root, 'repository');
  const outside = join(root, 'outside');
  mkdirSync(repository);
  mkdirSync(outside);
  writeFileSync(join(outside, 'result.json'), '{}\n');

  execFileSync('git', ['init', '-q'], { cwd: repository, windowsHide: true });
  execFileSync(
    'git',
    [
      '-c',
      'user.email=fixture@local',
      '-c',
      'user.name=fixture',
      'commit',
      '-q',
      '--allow-empty',
      '-m',
      'fixture',
    ],
    { cwd: repository, windowsHide: true },
  );

  const voisinage = (directory) => {
    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, 'mission.json'), '{}\n');
    writeFileSync(join(directory, 'result.json'), '{}\n');
    writeFileSync(join(directory, 'metadata.json'), '{}\n');
    writeFileSync(join(directory, 'unrelated.json'), '{}\n');
    writeFileSync(join(directory, 'envelope.md'), 'enveloppe\n');
    writeFileSync(join(directory, 'console-real-use-observations.md'), 'observations\n');
  };
  voisinage(join(repository, 'missions', 'x'));
  voisinage(join(repository, 'missions', 'y', 'z'));

  /* Racine RESULT HERITEE : son eligibilite large n'est pas touchee. */
  const legacy = join(repository, 'tooling', 'result-instance', 'representability');
  mkdirSync(legacy, { recursive: true });
  writeFileSync(join(legacy, 'a.json'), '{}\n');
  writeFileSync(join(legacy, 'metadata.json'), '{}\n');
  writeFileSync(join(legacy, 'mission.json'), '{}\n');

  /* Echappement par lien SOUS la nouvelle racine : l'enumeration ne suit rien. */
  symlinkSync(
    outside,
    join(repository, 'missions', 'escape'),
    process.platform === 'win32' ? 'junction' : 'dir',
  );

  return { root, repository };
}

const discovery = buildDiscoveryRepository();
const discovered = (candidateClass) =>
  listCandidates(openRepository(discovery.repository), candidateClass).candidates.map(
    (candidate) => candidate.path,
  );

after(() => {
  try {
    unlinkSync(join(discovery.repository, 'missions', 'escape'));
  } catch {
    /* le lien peut deja avoir disparu */
  }
  rmSync(discovery.root, { recursive: true, force: true });
});

test('T-E1 : la mission authentique de missions/ est enumeree', () => {
  const paths = labCandidates('MISSION');
  assert.ok(paths.includes(GENUINE.missionPath), paths.join(' '));
  assert.equal(paths.length, 5);
});

test('T-E2 : le resultat authentique de missions/ est enumere', () => {
  const paths = labCandidates('RESULT');
  assert.ok(paths.includes(GENUINE.resultPath), paths.join(' '));
  assert.equal(paths.length, 4);
});

test('T-E3 : les quatre candidats MISSION preexistants demeurent', () => {
  const paths = labCandidates('MISSION');
  for (const path of PRE_EXISTING.MISSION) assert.ok(paths.includes(path), path);
});

test('T-E4 : les trois candidats RESULT preexistants demeurent', () => {
  const paths = labCandidates('RESULT');
  for (const path of PRE_EXISTING.RESULT) assert.ok(paths.includes(path), path);
  /* Un resserrement GLOBAL du filtre RESULT aurait efface ces deux-la. */
  assert.ok(paths.includes('tooling/result-instance/representability/a.json'));
  assert.ok(paths.includes('tooling/result-instance/representability/b.json'));
});

test('T-E5 : les compagnons du repertoire de mission ne sont candidats d aucune classe', () => {
  for (const candidateClass of ['MISSION', 'RESULT']) {
    const paths = labCandidates(candidateClass);
    assert.ok(!paths.includes(GENUINE.envelope), candidateClass);
    assert.ok(!paths.includes(GENUINE.observations), candidateClass);
    for (const path of paths) assert.ok(!path.endsWith('.md'), path);
  }
});

test('T-E6 : sous missions/, RESULT est STRICTEMENT result.json', () => {
  const results = discovered('RESULT');
  const missions = discovered('MISSION');
  const sousMissions = (paths) => paths.filter((path) => path.startsWith('missions/'));

  /* La table normative tenue SIMULTANEMENT, aux deux profondeurs, et rien
     d'autre ne ressort. */
  assert.deepEqual(sousMissions(results), [
    'missions/x/result.json',
    'missions/y/z/result.json',
  ]);
  assert.deepEqual(sousMissions(missions), [
    'missions/x/mission.json',
    'missions/y/z/mission.json',
  ]);

  for (const prefix of ['missions/x/', 'missions/y/z/']) {
    assert.ok(!results.includes(prefix + 'mission.json'), prefix);
    assert.ok(!results.includes(prefix + 'metadata.json'), prefix);
    assert.ok(!results.includes(prefix + 'unrelated.json'), prefix);
    assert.ok(!results.includes(prefix + 'envelope.md'), prefix);
    assert.ok(!results.includes(prefix + 'console-real-use-observations.md'), prefix);
    assert.ok(!missions.includes(prefix + 'result.json'), prefix);
    assert.ok(!missions.includes(prefix + 'metadata.json'), prefix);
    assert.ok(!missions.includes(prefix + 'unrelated.json'), prefix);
  }
});

test('T-E7 : sous une racine RESULT HERITEE, l eligibilite large est intacte', () => {
  const results = discovered('RESULT');
  assert.ok(results.includes('tooling/result-instance/representability/a.json'));
  /* Un JSON sans rapport reste candidat SOUS UNE RACINE HERITEE : la
     strictesse est portee par la racine d'origine, elle n'est pas globale. */
  assert.ok(results.includes('tooling/result-instance/representability/metadata.json'));
  assert.ok(!results.includes('tooling/result-instance/representability/mission.json'));
});

test('T-E8 : la nouvelle racine ne suit aucun echappement par lien', () => {
  for (const candidateClass of ['MISSION', 'RESULT']) {
    for (const path of discovered(candidateClass)) {
      assert.ok(!path.startsWith('missions/escape'), path);
    }
  }
});

test('T-H1 : /api/candidates?class=MISSION expose la mission authentique', async () => {
  const response = await labGet('/api/candidates?class=MISSION');
  assert.equal(response.status, 200);
  const candidate = response.json.candidates.find((entry) => entry.path === GENUINE.missionPath);
  assert.ok(candidate, 'mission authentique enumeree');
  assert.equal(candidate.bytes, GENUINE.missionBytes);
});

test('T-H2 : /api/candidates?class=RESULT expose le resultat authentique', async () => {
  const response = await labGet('/api/candidates?class=RESULT');
  assert.equal(response.status, 200);
  const candidate = response.json.candidates.find((entry) => entry.path === GENUINE.resultPath);
  assert.ok(candidate, 'resultat authentique enumere');
  assert.equal(candidate.bytes, GENUINE.resultBytes);
});

test('T-H3 : la mission authentique entre dans le pipeline MISSION inchange', async () => {
  const response = await labGet('/api/mission?path=' + encodeURIComponent(GENUINE.missionPath));
  assert.equal(response.status, 200);
  assert.deepEqual(Object.keys(response.json).sort(), [
    'capture',
    'render',
    'snapshot',
    'validation',
  ]);
  assert.equal(response.json.capture.bytes, GENUINE.missionBytes);
  assert.equal(response.json.capture.blob, GENUINE.missionBlob);
  assert.deepEqual(response.json.snapshot, {
    path: GENUINE.missionPath,
    blob: GENUINE.missionBlob,
  });
  assert.equal(response.json.validation.ok, true);
  assert.deepEqual(response.json.validation.errors, []);
  assert.equal(typeof response.json.render.text, 'string');
  assert.ok(response.json.render.text.length > 0);
});

test('T-H4 : le couple authentique entre dans le pipeline RESULT inchange', async () => {
  const response = await labGet(
    resultQuery(GENUINE.resultPath, GENUINE.missionPath, GENUINE.missionBlob),
  );
  assert.equal(response.status, 200);
  assert.equal(response.json.capture.bytes, GENUINE.resultBytes);
  assert.equal(response.json.capture.blob, GENUINE.resultBlob);
  assert.equal(response.json.validation.ok, true);
  /* Associations rendues SEPAREMENT, jamais fusionnees en un booleen. */
  assert.equal(response.json.sourceAssociation.status, 'MATCH');
  assert.equal(response.json.returnContractAssociation.status, 'MATCH');
  assert.deepEqual(response.json.pathDivergence, []);
  assert.equal(response.json.aggregate, 'MATCH');
  assert.deepEqual(response.json.missionRecapture, {
    path: GENUINE.missionPath,
    blob: GENUINE.missionBlob,
    confirmed: true,
  });
  assert.equal(response.json.contractValidation.run, true);
  assert.equal(response.json.contractValidation.ok, true);
  assert.equal(response.json.reportedValues.length, 80);
  assert.deepEqual(response.json.nonProduction, []);

  /* La liaison de version reste obligatoire sur cette mission comme sur les
     autres : une version silencieuse vaut 409, jamais une validation. */
  const stale = await labGet(resultQuery(GENUINE.resultPath, GENUINE.missionPath, OTHER_BLOB));
  assert.equal(stale.status, 409);
});

test('T-H5 : ni le contrat de route ni la frontiere de securite ne bougent', async () => {
  const candidates = await labGet('/api/candidates?class=RESULT');
  assert.deepEqual(Object.keys(candidates.json).sort(), ['candidates', 'roots']);
  for (const root of candidates.json.roots) assert.equal(typeof root, 'string');
  for (const candidate of candidates.json.candidates) {
    assert.deepEqual(Object.keys(candidate).sort(), ['bytes', 'path']);
  }
  assert.equal(
    candidates.headers['content-security-policy'],
    SECURITY_HEADERS['Content-Security-Policy'],
  );

  /* Enumerer `missions/` n'ouvre aucun chemin de lecture : le confinement
     reste la seule autorite, sur les DEUX routes de chargement. */
  const missionEscape = await labGet(
    '/api/mission?path=' + encodeURIComponent('missions/../../secret.txt'),
  );
  assert.equal(missionEscape.status, 403);
  assert.equal(missionEscape.json.code, 'PATH_OUT_OF_ROOT');

  const resultEscape = await labGet(
    resultQuery('missions/../../secret.txt', GENUINE.missionPath, GENUINE.missionBlob),
  );
  assert.equal(resultEscape.status, 403);
  assert.equal(resultEscape.json.code, 'PATH_OUT_OF_ROOT');

  assert.deepEqual([...ROUTES], [
    '/',
    '/console.css',
    '/console.mjs',
    '/api/context',
    '/api/program-state',
    '/api/candidates',
    '/api/mission',
    '/api/result',
  ]);
});

test('les actifs statiques sont servis par liste blanche de noms', async () => {
  const page = await labGet('/');
  assert.equal(page.status, 200);
  assert.ok(page.headers['content-type'].startsWith('text/html'));
  assert.ok(page.body.toString('utf8').includes('data-product-panel="A"'));

  const css = await labGet('/console.css');
  assert.equal(css.status, 200);
  assert.ok(css.headers['content-type'].startsWith('text/css'));

  const script = await labGet('/console.mjs');
  assert.equal(script.status, 200);
  assert.ok(script.headers['content-type'].startsWith('text/javascript'));
});

test('le contrat de ligne de commande est explicite', () => {
  assert.deepEqual(parseArguments(['--repo', 'E:/depot']), { repo: 'E:/depot', port: 0 });
  assert.deepEqual(parseArguments(['--repo', 'E:/depot', '--port', '8123']), {
    repo: 'E:/depot',
    port: 8123,
  });
  assert.throws(() => parseArguments([]), /--repo/);
  assert.throws(() => parseArguments(['--repo', 'x', '--port', 'abc']), /--port/);
  assert.throws(() => parseArguments(['--inconnu']), /option inconnue/);
});

/* ================================================================== *
 * AUTORITE GIT ET ABSENCE DE MUTATION
 * ================================================================== */

test('la console n a execute que les DEUX commandes Git gelees', () => {
  const invocations = gitInvocations();
  assert.ok(invocations.length > 0, 'la console a bien lu les metadonnees du depot');
  for (const argv of invocations) {
    const joined = argv.join(' ');
    assert.ok(
      joined === 'rev-parse --show-object-format' || joined === 'rev-parse HEAD',
      'commande hors autorite : git ' + joined,
    );
  }
});

test('invocation de filtre de contenu = 0', () => {
  const forbidden = [
    'hash-object',
    '--path',
    'cat-file',
    'checkout',
    'restore',
    'clean',
    'add',
    'commit',
    'push',
    'status',
    'ls-remote',
    'ls-files',
  ];
  for (const argv of gitInvocations()) {
    for (const token of argv) {
      for (const banned of forbidden) {
        assert.ok(!token.includes(banned), 'jeton interdit ' + token);
      }
    }
  }
  /* Aucune de ces commandes n'apparait dans le CODE produit : le blob est
     calcule en Node sur les octets captures, jamais delegue a un filtre. */
  for (const name of PRODUCT_SOURCES) {
    const code = productCode(name);
    for (const banned of ['hash-object', 'cat-file', 'ls-remote']) {
      assert.ok(!code.includes(banned), banned + ' present dans ' + name);
    }
  }

  /* `repo.mjs` est la SEULE source capable de lancer un processus. Aucun autre
     fichier ne touche a `node:child_process` : il n'existe donc pas d'autre
     porte par ou un filtre de contenu pourrait s'executer. */
  for (const name of PRODUCT_SOURCES) {
    if (name === 'repo.mjs') continue;
    const code = productCode(name);
    assert.ok(!code.includes('child_process'), 'child_process dans ' + name);
    assert.ok(!/\b(execFile|execFileSync|execSync|spawn|spawnSync)\b/.test(code), name);
  }

  /* Et la liste blanche de cette unique porte contient EXACTEMENT deux
     commandes, verifiees a l'execution avant tout lancement. */
  const repoSource = readFileSync(join(CONSOLE_DIR, 'repo.mjs'), 'utf8');
  const table = repoSource.match(/AUTHORIZED_GIT_COMMANDS = Object\.freeze\(\[([\s\S]*?)\n\]\);/);
  assert.ok(table, 'table de commandes autorisees presente');
  assert.equal((table[1].match(/Object\.freeze\(\[/g) ?? []).length, 2);
  assert.ok(table[1].includes("'rev-parse', '--show-object-format'"));
  assert.ok(table[1].includes("'rev-parse', 'HEAD'"));
  assert.ok(executableCode(repoSource).includes('if (!authorized(argv))'), 'garde a l execution');
});

test('mutation du depot = 0 et mutation Git = 0', () => {
  assert.equal(labGit(['status', '--porcelain']), BASELINE.status, 'copie de travail inchangee');
  assert.equal(labGit(['rev-parse', 'HEAD']), BASELINE.head, 'HEAD inchange');
  assert.equal(
    labGit(['rev-parse', 'HEAD:PROGRAM-STATE.json']),
    BASELINE.programState,
    'PROGRAM-STATE inchange',
  );
  assert.equal(
    labGit(['rev-parse', 'HEAD:' + HISTORICAL.resultPath]),
    BASELINE.fixtures,
    'fixture historique inchangee',
  );
  /* Les identites gelees sont toujours celles de l autorite 32 section 20. */
  assert.equal(
    gitBlobId(readFileSync(join(LAB_ROOT, HISTORICAL.missionPath))),
    HISTORICAL.missionBlob,
  );
  assert.equal(
    gitBlobId(readFileSync(join(LAB_ROOT, HISTORICAL.resultPath))),
    HISTORICAL.resultBlob,
  );
  assert.equal(
    gitBlobId(readFileSync(join(LAB_ROOT, HISTORICAL.evidencePath))),
    HISTORICAL.evidenceBlob,
  );
});
