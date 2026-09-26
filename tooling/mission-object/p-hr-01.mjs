/**
 * P-HR-01 — résolveur, construction V1, cycle de vie inter-acteurs et
 * P_HR_01_RESULT_ADMISSION.
 *
 * Conforme à l'autorité 101, sous les autorités 98, 99 et 100, et à elles seules.
 *
 * Ce module ne choisit rien. Il ne sélectionne aucune opération, ne lit ni
 * PROGRAM-STATE ni les conséquences suivantes ni la procédure d'une mission,
 * n'ordonnance rien et n'initie aucun dispatch : `next_control_stage` n'est
 * qu'une ASSERTION contre l'opération que l'orchestration demande réellement.
 *
 * Le cycle de vie est la séquence fixe P_HR_01_LINEAR_V1. Chaque événement n'est
 * établi que par SA source (autorité 98 § 14), dans l'ordre, une seule fois ; un
 * prédécesseur inconnu arrête tout, et aucun événement ultérieur ne reconstruit
 * un prédécesseur non observé.
 *
 * L'état d'exécution faisant autorité est l'état TRANSITOIRE de l'orchestration,
 * porté par une instance de `PHr01Run`. Rien n'est écrit : aucun reçu de
 * dispatch durable, aucun fichier, aucune mutation Git. Les seules commandes
 * Git sont quatre lectures d'historique, sur liste blanche.
 */

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { TextDecoder } from 'node:util';

import { parse as parseMission } from './mission-object.mjs';
import {
  LIFECYCLE,
  NEXT_CONTROL_STAGE,
  PERSISTENCE_OWNERSHIP,
  P_HR_01_VERSION,
  STAGE_ORDERING_DEPENDENCY,
  V1_ONLY_FIELDS,
  acceptMissionObject,
  canonicalReturnDestination,
  v1Representation,
} from './v1.mjs';
import { parse as parseResult } from '../result-instance/result-instance.mjs';
import { validate as validateResult, validateAgainstContract } from '../result-instance/validate.mjs';

/* ------------------------------------------------------------------ *
 * Événements et sources — autorité 98 § 14
 * ------------------------------------------------------------------ */

export { LIFECYCLE };

export const EVENT_SOURCES = Object.freeze({
  HANDOFF_RESOLVED: 'P_HR_01_RESOLVER_ENFORCED_BY_MISSION_OBJECT_V1_CONSTRUCTION',
  MISSION_FROZEN: 'CANONICAL_REPOSITORY_IDENTITY_OF_EXACT_VALIDATED_MISSION_OBJECT_V1',
  EXECUTOR_DISPATCHED: 'SUCCESSFUL_ACTUAL_EXECUTOR_DISPATCH_OPERATION',
  EXECUTOR_RETURNED: 'SUCCESSFUL_RESULT_INGEST_BOUNDARY',
  RESULT_PERSISTED: 'CANONICAL_DURABLE_REPOSITORY_IDENTITY_OF_EXACT_RETURNED_BYTES',
  RESULT_CONSUMED: 'FIRST_SUCCESSFUL_P_HR_01_RESULT_ADMISSION',
});

/** Arrêt P-HR-01 : code stable, aucune réparation, aucune continuation. */
export class PHr01Stop extends Error {
  constructor(code, message, details) {
    super(message);
    this.name = 'PHr01Stop';
    this.code = code;
    this.details = details === undefined ? null : details;
  }
}

/* ------------------------------------------------------------------ *
 * Outils
 * ------------------------------------------------------------------ */

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function deepFreeze(value) {
  if (value === null || typeof value !== 'object' || ArrayBuffer.isView(value)) return value;
  for (const key of Object.keys(value)) deepFreeze(value[key]);
  return Object.freeze(value);
}

function sameJson(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function gitBlobId(bytes) {
  const header = Buffer.concat([Buffer.from('blob ' + bytes.length, 'ascii'), Buffer.from([0])]);
  return createHash('sha1').update(header).update(bytes).digest('hex');
}

function sha256Of(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

/** UTF-8 strict ; un BOM n'est pas retiré, il fait échouer le parse. */
const STRICT_UTF8 = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true });

function decodeStrict(bytes, code) {
  try {
    return STRICT_UTF8.decode(bytes);
  } catch (caught) {
    throw new PHr01Stop(code, 'octets non décodables en UTF-8 strict', { reason: caught.message });
  }
}

const GIT_BLOB = /^[0-9a-f]{40}$/;

/* ------------------------------------------------------------------ *
 * Lecture de l'historique canonique — quatre commandes, lecture seule
 * ------------------------------------------------------------------ */

const AUTHORIZED_GIT_READS = Object.freeze(['rev-parse', 'ls-tree', 'cat-file', 'merge-base']);

function git(root, argv, options = {}) {
  if (!AUTHORIZED_GIT_READS.includes(argv[0])) {
    throw new PHr01Stop('GIT_COMMAND_NOT_AUTHORIZED', 'commande Git hors autorité de P-HR-01', { argv });
  }
  return execFileSync('git', argv, {
    cwd: root,
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 64 * 1024 * 1024,
    ...options,
  });
}

/** `HEAD` ou un identifiant de commit complet : aucune autre forme, aucune option. */
function resolveCommit(root, commit) {
  if (commit !== 'HEAD' && !GIT_BLOB.test(String(commit))) {
    throw new PHr01Stop('COMMIT_NOT_IN_CANONICAL_HISTORY', 'commit attendu : HEAD ou identifiant complet', { commit });
  }
  try {
    return git(root, ['rev-parse', '--verify', '--quiet', commit + '^{commit}'], { encoding: 'utf8' }).trim();
  } catch {
    throw new PHr01Stop('COMMIT_NOT_IN_CANONICAL_HISTORY', 'commit introuvable dans l’historique', { commit });
  }
}

/** Blob d'un chemin dans un commit, ou `null` si le chemin n'y est pas. */
function blobAt(root, commitId, path) {
  const out = git(root, ['ls-tree', '-z', '--full-tree', commitId, '--', path], { encoding: 'utf8' });
  if (out === '') return null;
  const entry = out.split('\0')[0];
  const match = /^[0-7]+ blob ([0-9a-f]{40})\t(.*)$/s.exec(entry);
  if (!match || match[2] !== path) return null;
  return match[1];
}

/** Octets exacts d'un blob, vérifiés contre son identité. */
function readBlob(root, blob) {
  const bytes = git(root, ['cat-file', 'blob', blob]);
  if (gitBlobId(bytes) !== blob) {
    throw new PHr01Stop('CANONICAL_BYTES_MISMATCH', 'les octets lus ne portent pas l’identité demandée', { blob });
  }
  return bytes;
}

function isAncestor(root, ancestor, descendant) {
  try {
    git(root, ['merge-base', '--is-ancestor', ancestor, descendant]);
    return true;
  } catch (caught) {
    if (caught && caught.status === 1) return false;
    throw caught;
  }
}

/* ------------------------------------------------------------------ *
 * Résolveur — IP-03
 * ------------------------------------------------------------------ */

/**
 * Résout les valeurs P-HR-01 EXACTES d'une mission. La seule entrée est le
 * chemin relatif au dépôt de son `mission.json` ; aucune valeur n'est choisie
 * par l'appelant, aucune n'est inférée d'une prose.
 */
export function resolveHandoffContract(missionPath) {
  let returnDestination;
  try {
    returnDestination = canonicalReturnDestination(missionPath);
  } catch (caught) {
    throw new PHr01Stop(caught.code, caught.message, caught.details);
  }
  return Object.freeze({
    version: P_HR_01_VERSION,
    next_control_stage: NEXT_CONTROL_STAGE,
    return_destination: returnDestination,
    stage_ordering_dependency: STAGE_ORDERING_DEPENDENCY,
    persistence_ownership: PERSISTENCE_OWNERSHIP,
  });
}

/**
 * Construction d'un Mission Object V1 à partir de ses champs hérités.
 *
 * `representation` et `handoff_contract` ne viennent JAMAIS de l'appelant : la
 * première est l'identité V1 supportée, le second la sortie du résolveur. Avec
 * `pHr01: false`, l'objet V1 est construit sans contrat, P-HR-01 INACTIF.
 *
 * Construire n'est pas convertir : aucun objet reçu n'est reconnu, réécrit ni
 * promu. L'objet rendu doit être accepté comme V1, sinon rien n'est rendu.
 */
export function constructMissionObjectV1({ fields, missionPath, pHr01 }) {
  if (!isPlainObject(fields)) {
    throw new PHr01Stop('MISSION_OBJECT_V1_INVALID', 'champs hérités attendus');
  }
  for (const key of V1_ONLY_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(fields, key)) {
      throw new PHr01Stop('CALLER_SELECTED_V1_FIELD', key + ' ne vient jamais de l’appelant', { field: key });
    }
  }
  const object = { representation: v1Representation(), ...structuredClone(fields) };
  if (pHr01 === true) object.handoff_contract = { ...resolveHandoffContract(missionPath) };
  else if (pHr01 !== false) throw new PHr01Stop('MISSION_OBJECT_V1_INVALID', 'pHr01 : booléen explicite attendu');

  const verdict = acceptMissionObject(object, { missionPath });
  if (!verdict.accepted || verdict.representation !== 'V1') {
    throw new PHr01Stop('MISSION_OBJECT_V1_INVALID', 'Mission Object V1 construit invalide', { errors: verdict.errors });
  }
  const bytes = Buffer.from(JSON.stringify(object, null, 2) + '\n', 'utf8');
  return { object: deepFreeze(object), bytes, blob: gitBlobId(bytes), sha256: sha256Of(bytes) };
}

/* ------------------------------------------------------------------ *
 * Handle de résultat accepté
 * ------------------------------------------------------------------ */

/** Handles émis par P_HR_01_RESULT_ADMISSION, et par elle seule. */
const ACCEPTED_RESULTS = new WeakSet();

export function isAcceptedResult(candidate) {
  return ACCEPTED_RESULTS.has(candidate);
}

/**
 * SEULE entrée de consommation sémantique aval d'un résultat de mission
 * P-HR-01 active : ce qui n'est pas un handle émis par l'admission est une
 * violation de contrat — un Result Instance chargé, un chemin, un objet de même
 * forme ne le deviennent jamais.
 */
export function requireAcceptedResult(candidate) {
  if (!ACCEPTED_RESULTS.has(candidate)) {
    throw new PHr01Stop(
      'CONTRACT_VIOLATION',
      'consommation aval d’un résultat P-HR-01 sans P_HR_01_RESULT_ADMISSION',
    );
  }
  return candidate;
}

/* ------------------------------------------------------------------ *
 * Transaction P-HR-01 — IP-04 à IP-09
 * ------------------------------------------------------------------ */

function identityOf(record) {
  return { path: record.path, blob: record.blob };
}

function pointsTo(reference, identity) {
  return (
    isPlainObject(reference) &&
    isPlainObject(reference.locator) &&
    isPlainObject(reference.identity) &&
    reference.locator.kind === 'REPO_PATH' &&
    reference.locator.value === identity.path &&
    reference.identity.kind === 'GIT_BLOB' &&
    reference.identity.value === identity.blob
  );
}

/** Source ET autorité de retour désignent exactement la mission V1 gelée. */
function sourceMatches(instance, frozen) {
  return (
    isPlainObject(instance.source) &&
    instance.source.kind === 'MISSION' &&
    pointsTo(instance.source.authority, frozen) &&
    isPlainObject(instance.return_contract) &&
    pointsTo(instance.return_contract.authority, frozen)
  );
}

function parseResultInstance(bytes, code) {
  const text = decodeStrict(bytes, code);
  let instance;
  try {
    instance = parseResult(text);
  } catch (caught) {
    throw new PHr01Stop(code, 'Result Instance illisible', { reason: caught.message });
  }
  const structure = validateResult(instance);
  if (!structure.ok) {
    throw new PHr01Stop(code, 'Result Instance structurellement invalide', { errors: structure.errors });
  }
  return instance;
}

/**
 * Une transaction P-HR-01, du résolveur à l'admission : l'état d'exécution
 * faisant autorité. Une instance neuve n'a rien observé ; perdre l'instance,
 * c'est perdre l'état, et rien ne le reconstruit.
 */
export class PHr01Run {
  #root;
  #records = [];
  #resolved = null;
  #frozen = null;
  #frozenObject = null;
  #frozenBytes = null;
  #returned = null;
  #persisted = null;
  #handle = null;
  #dispatching = false;

  constructor({ repositoryRoot } = {}) {
    if (typeof repositoryRoot !== 'string' || repositoryRoot === '') {
      throw new PHr01Stop('REPOSITORY_ROOT_REQUIRED', 'racine de dépôt explicite requise');
    }
    this.#root = repositoryRoot;
  }

  /** Journal de la transaction, en lecture seule. */
  events() {
    return Object.freeze(this.#records.slice());
  }

  #has(event) {
    return this.#records.some((record) => record.event === event);
  }

  #require(event) {
    if (!this.#has(event)) {
      throw new PHr01Stop('UNKNOWN_PREDECESSOR', 'prédécesseur non observé : ' + event + ' — STOP', {
        missing: event,
        observed: this.#records.map((record) => record.event),
      });
    }
  }

  #once(event) {
    if (this.#has(event)) {
      throw new PHr01Stop('EVENT_ALREADY_ESTABLISHED', event + ' est déjà établi : aucun nœud additionnel', { event });
    }
  }

  /** Seul enregistreur, privé : l'événement n de la séquence exige les n - 1 précédents. */
  #record(event, fields) {
    const index = LIFECYCLE.indexOf(event);
    if (index !== this.#records.length) {
      throw new PHr01Stop('UNKNOWN_PREDECESSOR', 'ordre P_HR_01_LINEAR_V1 violé : ' + event, {
        event,
        observed: this.#records.map((record) => record.event),
      });
    }
    const record = deepFreeze({ event, source: EVENT_SOURCES[event], ...structuredClone(fields) });
    this.#records.push(record);
    return record;
  }

  /* --- IP-03 : HANDOFF_RESOLVED, appliqué par la construction V1 ----- */

  resolveAndConstruct({ missionPath, fields }) {
    this.#once('HANDOFF_RESOLVED');
    const contract = resolveHandoffContract(missionPath);
    const constructed = constructMissionObjectV1({ fields, missionPath, pHr01: true });
    if (!sameJson(constructed.object.handoff_contract, contract)) {
      throw new PHr01Stop('CONTRACT_MUTATED', 'la construction ne porte pas le contrat résolu');
    }
    this.#resolved = { missionPath, contract };
    this.#record('HANDOFF_RESOLVED', { missionPath, contract });
    return constructed;
  }

  /* --- IP-04 : MISSION_FROZEN ---------------------------------------- */

  /**
   * Gel vérifié sur les octets COMMIS : une copie de travail n'est pas un gel,
   * une enveloppe rendue non plus. Les octets du chemin résolu, dans l'historique
   * canonique, doivent valider comme V1 avec P-HR-01 ACTIF et porter exactement
   * le contrat résolu.
   */
  verifyFreeze({ commit = 'HEAD' } = {}) {
    this.#require('HANDOFF_RESOLVED');
    this.#once('MISSION_FROZEN');
    const { missionPath, contract } = this.#resolved;
    const commitId = resolveCommit(this.#root, commit);
    const blob = blobAt(this.#root, commitId, missionPath);
    if (blob === null) {
      throw new PHr01Stop('MISSION_NOT_IN_CANONICAL_HISTORY', 'aucune identité commise pour la mission : pas de gel', {
        missionPath,
        commit: commitId,
      });
    }
    const bytes = readBlob(this.#root, blob);
    let object;
    try {
      object = parseMission(decodeStrict(bytes, 'MISSION_OBJECT_REJECTED'));
    } catch (caught) {
      if (caught instanceof PHr01Stop) throw caught;
      throw new PHr01Stop('MISSION_OBJECT_REJECTED', 'Mission Object commis illisible', { reason: caught.message });
    }
    const verdict = acceptMissionObject(object, { missionPath });
    if (!verdict.accepted) {
      const code = verdict.errors.length > 0 ? verdict.errors[0].code : 'MISSION_OBJECT_REJECTED';
      throw new PHr01Stop(code, 'Mission Object commis rejeté : cas ' + verdict.case, {
        case: verdict.case,
        errors: verdict.errors,
      });
    }
    if (verdict.representation !== 'V1' || verdict.pHr01 !== 'ACTIVE') {
      throw new PHr01Stop('P_HR_01_NOT_ACTIVE', 'P-HR-01 exige un Mission Object V1 porteur de handoff_contract', {
        case: verdict.case,
        pHr01: verdict.pHr01,
      });
    }
    if (!sameJson(object.handoff_contract, contract)) {
      throw new PHr01Stop('CONTRACT_MUTATED', 'le contrat commis n’est pas le contrat résolu', {
        resolved: contract,
        committed: object.handoff_contract,
      });
    }
    this.#frozenObject = deepFreeze(object);
    this.#frozenBytes = Buffer.from(bytes);
    this.#frozen = deepFreeze({ path: missionPath, blob, commit: commitId, contract: object.handoff_contract });
    this.#record('MISSION_FROZEN', { path: missionPath, blob, commit: commitId, sha256: sha256Of(bytes) });
    return this.#frozen;
  }

  /* --- IP-05 : garde d'assertion de l'opération demandée ------------- */

  /**
   * Assertion SEULEMENT. L'opération est celle que l'orchestration demande ; la
   * garde la compare au contrat gelé, ne la choisit pas, ne la déclenche pas et
   * ne rend rien qui puisse en tenir lieu.
   */
  assertPreDispatch(requestedOperation) {
    this.#require('MISSION_FROZEN');
    if (!isPlainObject(requestedOperation) || !isPlainObject(requestedOperation.mission)) {
      throw new PHr01Stop('REQUESTED_OPERATION_MALFORMED', 'opération demandée : { kind, mission: { path, blob } }');
    }
    const { kind, mission } = requestedOperation;
    if (kind !== NEXT_CONTROL_STAGE || kind !== this.#frozen.contract.next_control_stage) {
      throw new PHr01Stop('REQUESTED_OPERATION_MISMATCH', 'opération demandée ≠ next_control_stage : aucun dispatch', {
        requested: kind ?? null,
        asserted: this.#frozen.contract.next_control_stage,
      });
    }
    if (mission.path !== this.#frozen.path || mission.blob !== this.#frozen.blob) {
      throw new PHr01Stop('FROZEN_IDENTITY_MISMATCH', 'la mission demandée n’est pas la mission gelée', {
        requested: { path: mission.path ?? null, blob: mission.blob ?? null },
        frozen: identityOf(this.#frozen),
      });
    }
    this.#assertFrozenUnchanged('HEAD');
    return Object.freeze({ asserted: true });
  }

  /** Mutation après gel : l'historique canonique doit porter encore la mission gelée. */
  #assertFrozenUnchanged(commit) {
    const commitId = resolveCommit(this.#root, commit);
    if (!isAncestor(this.#root, this.#frozen.commit, commitId)) {
      throw new PHr01Stop('FROZEN_MISSION_NOT_IN_CANONICAL_HISTORY', 'le commit de gel n’est plus dans l’historique', {
        frozen: this.#frozen.commit,
        commit: commitId,
      });
    }
    const current = blobAt(this.#root, commitId, this.#frozen.path);
    if (current !== this.#frozen.blob) {
      throw new PHr01Stop('CONTRACT_MUTATED_AFTER_FREEZE', 'la mission gelée a été modifiée après le gel', {
        frozen: identityOf(this.#frozen),
        current,
        commit: commitId,
      });
    }
    return commitId;
  }

  /* --- IP-06 : EXECUTOR_DISPATCHED ----------------------------------- */

  /**
   * Observation du dispatch RÉEL. `performDispatch` est l'opération
   * d'intégration effective ; l'événement n'est établi que si elle réussit.
   * « Dispatchable » n'est pas dispatché, une enveloppe créée non plus.
   */
  async dispatch(requestedOperation, performDispatch) {
    this.#require('MISSION_FROZEN');
    this.#once('EXECUTOR_DISPATCHED');
    if (this.#dispatching) {
      throw new PHr01Stop('DISPATCH_IN_PROGRESS', 'un dispatch est déjà en cours');
    }
    this.assertPreDispatch(requestedOperation);
    if (typeof performDispatch !== 'function') {
      throw new PHr01Stop('DISPATCH_OPERATION_REQUIRED', 'opération de dispatch effective requise');
    }
    const payload = Object.freeze({
      mission: Object.freeze({ path: this.#frozen.path, blob: this.#frozen.blob, commit: this.#frozen.commit }),
      contract: this.#frozen.contract,
      missionBytes: Buffer.from(this.#frozenBytes),
    });
    this.#dispatching = true;
    try {
      await performDispatch(payload);
    } catch (caught) {
      throw new PHr01Stop('DISPATCH_FAILED', 'le dispatch effectif a échoué : EXECUTOR_DISPATCHED non établi', {
        reason: caught && caught.message ? caught.message : String(caught),
      });
    } finally {
      this.#dispatching = false;
    }
    this.#record('EXECUTOR_DISPATCHED', { mission: identityOf(this.#frozen) });
  }

  /* --- IP-07 : EXECUTOR_RETURNED ------------------------------------- */

  /**
   * Frontière d'ingestion du retour. Un fichier présent n'est pas un retour :
   * le retour est reçu ICI, au chemin exact, validé, et adossé à la mission
   * gelée. Aucune valeur de handoff n'est lue du résultat.
   */
  ingestReturn({ path, bytes, commit = 'HEAD' } = {}) {
    this.#require('EXECUTOR_DISPATCHED');
    this.#once('EXECUTOR_RETURNED');
    const destination = this.#frozen.contract.return_destination;
    if (path !== destination) {
      throw new PHr01Stop('RETURN_DESTINATION_MISMATCH', 'retour reçu hors de la destination exacte', {
        received: path ?? null,
        expected: destination,
      });
    }
    if (!(bytes instanceof Uint8Array) || bytes.length === 0) {
      throw new PHr01Stop('RESULT_INSTANCE_INVALID', 'octets de retour attendus');
    }
    const copy = Buffer.from(bytes);
    const instance = parseResultInstance(copy, 'RESULT_INSTANCE_INVALID');
    if (!sourceMatches(instance, this.#frozen)) {
      throw new PHr01Stop('RESULT_SOURCE_MISMATCH', 'source ou autorité de retour ≠ mission V1 gelée', {
        frozen: identityOf(this.#frozen),
      });
    }
    const contract = validateAgainstContract(instance, this.#frozenObject);
    if (!contract.ok) {
      throw new PHr01Stop('RESULT_INSTANCE_INVALID', 'relation de contrat de retour invalide', { errors: contract.errors });
    }
    const commitId = resolveCommit(this.#root, commit);
    const already = blobAt(this.#root, commitId, destination);
    if (already !== null) {
      throw new PHr01Stop(
        'RESULT_PERSISTED_BEFORE_VALIDATED_RETURN',
        'un résultat est déjà persisté avant la validation du retour : persistance hors orchestration',
        { path: destination, blob: already, commit: commitId },
      );
    }
    const blob = gitBlobId(copy);
    this.#returned = { path: destination, blob, bytes: copy };
    this.#record('EXECUTOR_RETURNED', { path: destination, blob, sha256: sha256Of(copy) });
    return Object.freeze({ path: destination, blob });
  }

  /* --- IP-08 : RESULT_PERSISTED -------------------------------------- */

  /**
   * Garde de persistance : l'acteur est l'orchestration, les octets persistés
   * sont EXACTEMENT les octets retournés, au chemin inchangé, dans l'historique
   * canonique qui porte encore la mission gelée. Valider n'est pas persister.
   */
  verifyPersistence({ actor, commit = 'HEAD' } = {}) {
    this.#require('EXECUTOR_RETURNED');
    this.#once('RESULT_PERSISTED');
    if (actor !== PERSISTENCE_OWNERSHIP || actor !== this.#frozen.contract.persistence_ownership) {
      throw new PHr01Stop('WRONG_PERSISTENCE_ACTOR', 'seule l’orchestration persiste un résultat P-HR-01', {
        actor: actor ?? null,
        owner: this.#frozen.contract.persistence_ownership,
      });
    }
    const commitId = this.#assertFrozenUnchanged(commit);
    const persisted = blobAt(this.#root, commitId, this.#returned.path);
    if (persisted === null) {
      throw new PHr01Stop('RESULT_NOT_PERSISTED', 'aucune identité commise au chemin de retour', {
        path: this.#returned.path,
        commit: commitId,
      });
    }
    if (persisted !== this.#returned.blob) {
      throw new PHr01Stop('PERSISTED_BYTES_MISMATCH', 'octets persistés ≠ octets retournés', {
        persisted,
        returned: this.#returned.blob,
      });
    }
    this.#persisted = { path: this.#returned.path, blob: persisted, commit: commitId };
    this.#record('RESULT_PERSISTED', this.#persisted);
    return Object.freeze({ ...this.#persisted });
  }

  /* --- IP-09 : P_HR_01_RESULT_ADMISSION ------------------------------ */

  /**
   * Frontière d'admission : identités exactes en entrée, handle immuable en
   * sortie, et rien avant la persistance. La première admission réussie EST
   * RESULT_CONSUMED ; une admission suivante rend le même handle.
   */
  admit({ mission, result } = {}) {
    this.#require('MISSION_FROZEN');
    if (this.#frozen.contract === undefined) {
      throw new PHr01Stop('P_HR_01_NOT_ACTIVE', 'P-HR-01 inactif : aucune admission P-HR-01');
    }
    if (!isPlainObject(mission) || mission.path !== this.#frozen.path || mission.blob !== this.#frozen.blob) {
      throw new PHr01Stop('FROZEN_IDENTITY_MISMATCH', 'identité de mission ≠ mission V1 gelée', {
        frozen: identityOf(this.#frozen),
      });
    }
    if (!this.#has('RESULT_PERSISTED')) {
      throw new PHr01Stop('ADMISSION_BEFORE_PERSISTENCE', 'admission avant persistance : aucun handle, aucune continuation', {
        observed: this.#records.map((record) => record.event),
      });
    }
    if (!isPlainObject(result) || result.path !== this.#frozen.contract.return_destination) {
      throw new PHr01Stop('RETURN_DESTINATION_MISMATCH', 'chemin de résultat ≠ destination de retour', {
        expected: this.#frozen.contract.return_destination,
      });
    }
    if (result.blob !== this.#persisted.blob || this.#persisted.blob !== this.#returned.blob) {
      throw new PHr01Stop('PERSISTED_BLOB_MISMATCH', 'identité de résultat ≠ blob persisté ≠ blob retourné', {
        presented: result.blob ?? null,
        persisted: this.#persisted.blob,
        returned: this.#returned.blob,
      });
    }
    if (blobAt(this.#root, this.#persisted.commit, result.path) !== result.blob) {
      throw new PHr01Stop('RESULT_NOT_PERSISTED', 'identité de résultat absente de l’historique canonique');
    }
    const instance = parseResultInstance(readBlob(this.#root, result.blob), 'RESULT_INSTANCE_INVALID');
    if (!sourceMatches(instance, this.#frozen)) {
      throw new PHr01Stop('RESULT_SOURCE_MISMATCH', 'source du résultat persisté ≠ mission V1 gelée');
    }
    if (this.#handle !== null) return this.#handle;

    const handle = deepFreeze({
      kind: 'P_HR_01_ACCEPTED_RESULT',
      mission: identityOf(this.#frozen),
      result: { path: this.#persisted.path, blob: this.#persisted.blob, commit: this.#persisted.commit },
      instance,
    });
    ACCEPTED_RESULTS.add(handle);
    this.#handle = handle;
    this.#record('RESULT_CONSUMED', { mission: identityOf(this.#frozen), result: identityOf(this.#persisted) });
    return handle;
  }
}
