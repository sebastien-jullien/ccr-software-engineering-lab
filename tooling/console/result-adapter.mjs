/**
 * Panneau C -- resultat.
 *
 * Le panneau C repond a une question que le validateur existant ne pose pas :
 * CETTE instance de resultat est-elle associee a CETTE mission ?
 *
 * Mesure durable de TOOLING-EXPERIMENT-003 : un objet imposteur ne portant que
 * le `return_contract` copie rend `ok = true`, `checked = 9`, `errors = 0`.
 *
 *   CONTRAT SATISFAIT   n'est pas   RESULTAT ASSOCIE A CETTE MISSION
 *
 * D'ou la porte : `validateAgainstContract()` ne s'execute QUE lorsque
 * l'association de contrat de retour est etablie. Valider d'abord et associer
 * ensuite reviendrait a afficher un contrat satisfait par un document qui n'a
 * rien a voir avec la mission a l'ecran.
 *
 * Deux autres interdits structurent ce fichier :
 *
 *   la reduction de l'association a un booleen  = INTERDITE
 *   deduire source.kind de la presence du contrat de retour = INTERDIT
 *
 * Source et contrat de retour sont evalues INDEPENDAMMENT, et rendus
 * separement, jamais fusionnes.
 */

import { capture, decodeStrict, CaptureFault } from './capture.mjs';
import { captureMission } from './mission-adapter.mjs';
import { confine, repositoryRelative } from './repo.mjs';
import {
  parse,
  reportedValueEntries,
  nonProductionEntries,
  factKey,
} from '../result-instance/result-instance.mjs';
import { validate, validateAgainstContract } from '../result-instance/validate.mjs';

/** Seule identite comparable supportee par la console v0. */
export const SUPPORTED_IDENTITY_KIND = 'GIT_BLOB';

const GIT_BLOB_PATTERN = /^[0-9a-f]{40}$/;

/* ------------------------------------------------------------------ *
 * Politique d'identite et de chemin
 * ------------------------------------------------------------------ */

function projectReference(reference) {
  if (!reference || typeof reference !== 'object') return null;
  return {
    locator:
      reference.locator && typeof reference.locator === 'object'
        ? { kind: reference.locator.kind ?? null, value: reference.locator.value ?? null }
        : null,
    identity:
      reference.identity && typeof reference.identity === 'object'
        ? { kind: reference.identity.kind ?? null, value: reference.identity.value ?? null }
        : null,
  };
}

/**
 * Comparaison d'UNE autorite applicable a la mission capturee.
 *
 * L'ordre des tests est normatif :
 *
 *   identite absente        -> CANNOT_ESTABLISH / NO_IDENTITY_PROVIDED
 *   genre non supporte      -> CANNOT_ESTABLISH / UNSUPPORTED_IDENTITY_KIND
 *   identite differente     -> MISMATCH
 *   identite egale          -> MATCH   (+ PATH_DIVERGENCE si le localisateur diverge)
 *
 * Une identite absente ou non supportee ne vaut JAMAIS MISMATCH : ne pas
 * pouvoir etablir une chose n'est pas demontrer son contraire.
 *
 * Et une correspondance de chemin n'etablit jamais une identite a elle seule :
 * le chemin n'entre en jeu qu'APRES une identite deja etablie, et seulement
 * pour signaler que le localisateur enregistre ne designe pas la copie
 * selectionnee.
 *
 * EXPORTEE pour que la politique d'identite soit observable telle quelle.
 * Le schema courant de Result Instance exige une identite `GIT_BLOB` sur les
 * autorites, si bien que les branches NO_IDENTITY_PROVIDED et
 * UNSUPPORTED_IDENTITY_KIND ne sont pas atteignables de bout en bout par cette
 * porte-la : elles restent neanmoins normatives, et une exigence gelee se
 * teste, elle ne se promet pas.
 */
export function associateAuthority(which, reference, missionBlob, missionPath, divergence) {
  const authority = projectReference(reference);

  if (authority === null || authority.identity === null || authority.identity.value === null) {
    return { status: 'CANNOT_ESTABLISH', reason: 'NO_IDENTITY_PROVIDED', authority };
  }
  if (authority.identity.kind !== SUPPORTED_IDENTITY_KIND) {
    return { status: 'CANNOT_ESTABLISH', reason: 'UNSUPPORTED_IDENTITY_KIND', authority };
  }
  if (authority.identity.value !== missionBlob) {
    return { status: 'MISMATCH', authority };
  }

  const locator = authority.locator;
  const designatesSelection =
    locator !== null && locator.kind === 'REPO_PATH' && locator.value === missionPath;
  if (!designatesSelection) {
    divergence.push({
      which,
      expected: missionPath,
      actual: locator === null ? null : locator.value,
    });
  }
  return { status: 'MATCH', authority };
}

/**
 * ASSOCIATION DE SOURCE.
 *
 * Evaluee a partir de `source.kind` SEUL. La presence ou l'absence d'un
 * contrat de retour n'entre pas dans ce calcul.
 */
function associateSource(instance, missionBlob, missionPath, divergence) {
  const source = instance.source;
  const kind = source && typeof source === 'object' ? source.kind : undefined;
  if (kind !== 'MISSION') {
    return {
      status: 'NOT_APPLICABLE_TO_SELECTED_MISSION',
      reason: 'SOURCE_KIND_NOT_MISSION',
      authority: projectReference(source && source.authority),
    };
  }
  return associateAuthority('source', source.authority, missionBlob, missionPath, divergence);
}

/**
 * ASSOCIATION DE CONTRAT DE RETOUR.
 *
 * Evaluee a partir de la presence du contrat SEULE. Le genre de source n'entre
 * pas dans ce calcul : deduire une source adossee a un protocole de l'absence
 * de contrat de retour est interdit, et l'inverse aussi.
 */
function associateReturnContract(instance, missionBlob, missionPath, divergence) {
  const contract = instance.return_contract;
  if (contract === undefined) {
    return { status: 'NOT_APPLICABLE', reason: 'NO_RETURN_CONTRACT', authority: null };
  }
  return associateAuthority(
    'return_contract',
    contract && contract.authority,
    missionBlob,
    missionPath,
    divergence,
  );
}

const APPLICABLE_STATUSES = ['MATCH', 'MISMATCH', 'CANNOT_ESTABLISH'];

/**
 * Agregation.
 *
 *   MISMATCH          une autorite applicable presente une contradiction
 *                     d'identite comparable DEMONTREE
 *   CANNOT_ESTABLISH  aucune contradiction, mais une association requise
 *                     n'est pas etablie
 *   MATCH             toutes les associations requises par l'operation sont
 *                     etablies
 *
 * Le cas ou AUCUN composant n'est applicable -- source adossee a un protocole
 * et aucun contrat de retour -- rend CANNOT_ESTABLISH, jamais MATCH. Rien ne
 * relie alors ce resultat a la mission affichee, et un MATCH vide se lirait
 * comme une association etablie.
 */
function aggregateAssociations(sourceAssociation, returnContractAssociation) {
  const statuses = [sourceAssociation.status, returnContractAssociation.status].filter((status) =>
    APPLICABLE_STATUSES.includes(status),
  );
  if (statuses.length === 0) return 'CANNOT_ESTABLISH';
  if (statuses.includes('MISMATCH')) return 'MISMATCH';
  if (statuses.includes('CANNOT_ESTABLISH')) return 'CANNOT_ESTABLISH';
  return 'MATCH';
}

/* ------------------------------------------------------------------ *
 * Presentation des entrees
 * ------------------------------------------------------------------ */

function projectTypedValue(typed) {
  if (!typed || typeof typed !== 'object') return null;
  if (typed.type === 'SET') {
    return Array.isArray(typed.members)
      ? typed.members.map((member) =>
          member && typeof member === 'object' && member.value !== undefined ? member.value : null,
        )
      : [];
  }
  return typed.value === undefined ? null : typed.value;
}

function projectReportedValues(instance) {
  return reportedValueEntries(instance).map((entry) => {
    const fact = entry.fact && typeof entry.fact === 'object' ? entry.fact : {};
    const projected = {
      factKey: factKey(instance, entry) ?? null,
      defined_by: fact.defined_by ?? null,
      id: fact.id ?? null,
      valueType: entry.value && typeof entry.value === 'object' ? (entry.value.type ?? null) : null,
      value: projectTypedValue(entry.value),
    };
    if (entry.requirement !== undefined) projected.requirement = entry.requirement;
    return projected;
  });
}

function projectNonProduction(instance) {
  return nonProductionEntries(instance).map((entry) => ({ requirement: entry.requirement ?? null }));
}

/* ------------------------------------------------------------------ *
 * Autorite de lecture de preuve
 * ------------------------------------------------------------------ *
 *
 * IL N'EXISTE PAS DE LECTEUR DE FICHIERS GENERIQUE.
 *
 * Les seuls chemins que cette fonction peut ouvrir sont les localisateurs
 * PORTES PAR L'INSTANCE DE RESULTAT CAPTUREE. Aucun chemin ne vient de la
 * requete, et chaque localisateur repasse malgre tout par `confine()` : un
 * artefact du depot n'est pas une autorite sur le systeme de fichiers.
 *
 * PREUVE TEMPORELLE HISTORIQUE : une preuve est comparee a son identite
 * immuable HISTORIQUE, celle que l'instance a enregistree. Le distant courant
 * n'est jamais interroge -- la console ne fait aucun appel reseau -- et
 * l'avance du distant n'est donc pas, et ne peut pas devenir, une
 * contradiction historique.
 *
 * Enfin : EVIDENCE IDENTITY MATCH n'est pas FAIT VRAI. Ce qui est etabli ici
 * est qu'un fichier porte bien les octets annonces, rien de plus.
 */
function resolveEvidence(repository, instance, objectFormat) {
  const resolved = [];

  for (const entry of reportedValueEntries(instance)) {
    const reference = entry.evidence;
    if (reference === undefined) continue;

    const projected = projectReference(reference);
    const locator = projected === null ? null : projected.locator;
    const identity = projected === null ? null : projected.identity;
    const record = { locator, identity, resolution: 'UNRESOLVED' };

    if (locator === null || locator.value === null) {
      record.reason = 'NO_LOCATOR_PROVIDED';
      resolved.push(record);
      continue;
    }
    if (locator.kind === 'REMOTE_REF') {
      record.reason = 'NO_NETWORK_IN_V0';
      resolved.push(record);
      continue;
    }
    if (identity === null || identity.value === null) {
      record.reason = 'NO_IDENTITY_PROVIDED';
      resolved.push(record);
      continue;
    }
    if (identity.kind !== SUPPORTED_IDENTITY_KIND) {
      record.reason = 'UNSUPPORTED_IDENTITY_KIND';
      resolved.push(record);
      continue;
    }
    if (locator.kind !== 'REPO_PATH') {
      record.reason = 'UNSUPPORTED_LOCATOR_KIND';
      resolved.push(record);
      continue;
    }

    let absolute;
    try {
      absolute = confine(repository, locator.value);
    } catch (error) {
      /* Un localisateur qui sort de la racine n'est pas lu. La resolution
         echoue, et la requete reste une reponse valide sur un artefact valide. */
      record.reason = error && error.code ? error.code : 'UNRESOLVED';
      resolved.push(record);
      continue;
    }

    let captured;
    try {
      captured = capture(absolute, objectFormat);
    } catch (error) {
      record.reason = error && error.code ? error.code : 'UNRESOLVED';
      resolved.push(record);
      continue;
    }

    record.resolution = captured.blob === identity.value ? 'MATCH' : 'MISMATCH';
    record.capturedBytes = captured.size;
    record.capturedBlob = captured.blob;
    resolved.push(record);
  }

  return resolved;
}

/* ------------------------------------------------------------------ *
 * Operation complete du panneau C
 * ------------------------------------------------------------------ */

export function projectResult(repository, request) {
  const { resultPath, missionPath, missionBlob } = request;

  if (typeof missionBlob !== 'string' || !GIT_BLOB_PATTERN.test(missionBlob)) {
    throw new CaptureFault(
      'BAD_REQUEST',
      400,
      'identite de snapshot de mission requise : le resultat se lit CONTRE une version affichee',
      { missionBlob: missionBlob ?? null },
    );
  }

  /* 1. capture UNIQUE de l'instance de resultat */
  const resultAbsolute = confine(repository, resultPath);
  const resultRelative = repositoryRelative(repository, resultAbsolute);
  const captured = capture(resultAbsolute, repository.objectFormat);
  const resultCapture = {
    path: resultRelative,
    bytes: captured.size,
    sha256: captured.sha256,
    blob: captured.blob,
  };

  /* 2. recapture de la mission et LIAISON DE VERSION, avant tout le reste */
  const missionAbsolute = confine(repository, missionPath);
  const missionRelative = repositoryRelative(repository, missionAbsolute);
  const mission = captureMission(missionAbsolute, missionRelative, repository.objectFormat);
  const missionRecapture = {
    path: missionRelative,
    blob: mission.capture.blob,
    confirmed: mission.capture.blob === missionBlob,
  };

  if (!missionRecapture.confirmed) {
    /* La mission a change sous l'operateur. On ne valide JAMAIS un resultat
       contre une version plus recente et silencieuse. */
    throw new CaptureFault(
      'MISSION_VERSION_CHANGED',
      409,
      'la mission a change depuis son affichage : selection a reprendre',
      {
        capture: resultCapture,
        missionRecapture,
        requestedMissionBlob: missionBlob,
        sourceAssociation: {
          status: 'CANNOT_ESTABLISH',
          reason: 'MISSION_VERSION_CHANGED',
          authority: null,
        },
        returnContractAssociation: {
          status: 'CANNOT_ESTABLISH',
          reason: 'MISSION_VERSION_CHANGED',
          authority: null,
        },
        pathDivergence: [],
        aggregate: 'CANNOT_ESTABLISH',
        contractValidation: { run: false, reason: 'MISSION_VERSION_CHANGED' },
      },
    );
  }

  if (!mission.validation.ok) {
    throw new CaptureFault('VALIDATION_FAILED', 422, 'Mission Object invalide', {
      subject: 'MISSION_OBJECT',
      capture: mission.capture,
      validation: mission.validation,
    });
  }

  /* 3. decodage strict et parse du resultat, sur les octets deja captures */
  const text = decodeStrict(captured.bytes);
  let instance;
  try {
    instance = parse(text);
  } catch (error) {
    throw new CaptureFault('PARSE_FAILED', 422, 'instance de resultat illisible', {
      capture: resultCapture,
      reason: error && error.message ? error.message : String(error),
    });
  }

  /* 4. validation structurelle */
  const validation = validate(instance);
  if (!validation.ok) {
    throw new CaptureFault('VALIDATION_FAILED', 422, 'instance de resultat structurellement invalide', {
      subject: 'RESULT_INSTANCE',
      capture: resultCapture,
      missionRecapture,
      validation,
    });
  }

  /* 5. associations, independantes l'une de l'autre */
  const pathDivergence = [];
  const sourceAssociation = associateSource(
    instance,
    mission.capture.blob,
    missionRelative,
    pathDivergence,
  );
  const returnContractAssociation = associateReturnContract(
    instance,
    mission.capture.blob,
    missionRelative,
    pathDivergence,
  );
  const aggregate = aggregateAssociations(sourceAssociation, returnContractAssociation);

  /* 6. PORTE de validation de contrat */
  let contractValidation;
  if (instance.return_contract === undefined) {
    contractValidation = { run: false, reason: 'NOT_APPLICABLE' };
  } else if (returnContractAssociation.status !== 'MATCH') {
    contractValidation = { run: false, reason: 'RETURN_CONTRACT_ASSOCIATION_NOT_MATCH' };
  } else {
    const report = validateAgainstContract(instance, mission.object);
    contractValidation = {
      run: true,
      ok: report.ok,
      checked: report.checked,
      errors: report.errors,
      uncheckedDomains: report.uncheckedDomains,
    };
  }

  const projection = {
    capture: resultCapture,
    missionRecapture,
    validation,
    sourceAssociation,
    returnContractAssociation,
    pathDivergence,
    aggregate,
    contractValidation,
    reportedValues: projectReportedValues(instance),
    nonProduction: projectNonProduction(instance),
    evidence: resolveEvidence(repository, instance, repository.objectFormat),
  };

  /* Un contrat evalue et mecaniquement invalide est un artefact invalide, et
     pas une reponse reussie que l'interface saurait afficher. Le corps porte
     la projection complete : l'erreur reste affichable. */
  if (contractValidation.run && !contractValidation.ok) {
    throw new CaptureFault(
      'CONTRACT_STRUCTURALLY_INVALID',
      422,
      'contrat de retour mecaniquement invalide',
      projection,
    );
  }

  return projection;
}
