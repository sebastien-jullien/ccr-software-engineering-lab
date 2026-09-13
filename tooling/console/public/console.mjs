/**
 * Rendu client de LOCAL MISSION CONSOLE V0.
 *
 * Deux moities dans ce fichier.
 *
 * La premiere est un COORDINATEUR de selection, sans DOM, exporte et testable
 * au node --test : generations monotones, `AbortController`, rejet des
 * reponses perimees, purge de l'etat derive du resultat. C'est la que vit la
 * protection contre les reponses tardives, et elle ne depend d'aucun
 * navigateur.
 *
 * La seconde est le cablage DOM, qui ne s'execute que dans un document.
 *
 * Le motif de la separation est simple : << changer de mission invalide l'etat
 * derive du resultat >> est une exigence gelee, donc une exigence a OBSERVER,
 * pas une intention a affirmer dans un commentaire.
 *
 * Rien n'est construit par `innerHTML` : tout passe par `createElement` et
 * `textContent`. Un artefact du depot est une donnee affichee, jamais du
 * balisage execute.
 */

/* ------------------------------------------------------------------ *
 * Coordinateur de selection
 * ------------------------------------------------------------------ */

/**
 * Coordonne les selections de mission et de resultat.
 *
 * Deux generations monotones, une par famille de requete. Toute reponse qui
 * revient sous une generation perimee est ECARTEE et n'est jamais rendue :
 * une reponse lente a une selection abandonnee ne doit pas repeindre l'ecran
 * par-dessus la selection courante.
 *
 * Changer de mission invalide TROIS choses d'un coup : la requete de mission
 * en vol, la requete de resultat en vol, et tout l'etat derive du resultat
 * deja affiche. Un resultat n'a de sens que CONTRE une version de mission.
 */
export function createCoordinator(options = {}) {
  const fetchImpl = options.fetchImpl;
  const AbortImpl =
    options.AbortImpl ?? (typeof AbortController === 'undefined' ? null : AbortController);
  const onResultPurge = options.onResultPurge ?? (() => {});

  let missionGeneration = 0;
  let resultGeneration = 0;
  let missionController = null;
  let resultController = null;
  const discarded = { mission: 0, result: 0 };

  const abort = (controller) => {
    if (controller && typeof controller.abort === 'function') controller.abort();
  };

  async function selectMission(url, apply, onFault) {
    abort(missionController);
    abort(resultController);
    missionController = null;
    resultController = null;

    missionGeneration += 1;
    resultGeneration += 1; /* purge de tout etat derive du resultat */
    onResultPurge();

    const generation = missionGeneration;
    const controller = new AbortImpl();
    missionController = controller;

    let payload;
    try {
      payload = await fetchImpl(url, { signal: controller.signal });
    } catch (fault) {
      if (generation !== missionGeneration) {
        discarded.mission += 1;
        return { applied: false, discarded: true };
      }
      if (onFault) onFault(fault);
      return { applied: false, discarded: false };
    }
    if (generation !== missionGeneration) {
      discarded.mission += 1;
      return { applied: false, discarded: true };
    }
    apply(payload);
    return { applied: true, discarded: false };
  }

  async function selectResult(url, apply, onFault) {
    abort(resultController);
    resultController = null;

    resultGeneration += 1;
    const generation = resultGeneration;
    const missionAtRequest = missionGeneration;
    const controller = new AbortImpl();
    resultController = controller;

    const stale = () => generation !== resultGeneration || missionAtRequest !== missionGeneration;

    let payload;
    try {
      payload = await fetchImpl(url, { signal: controller.signal });
    } catch (fault) {
      if (stale()) {
        discarded.result += 1;
        return { applied: false, discarded: true };
      }
      if (onFault) onFault(fault);
      return { applied: false, discarded: false };
    }
    if (stale()) {
      discarded.result += 1;
      return { applied: false, discarded: true };
    }
    apply(payload);
    return { applied: true, discarded: false };
  }

  /**
   * Abandon de la selection de mission, sans requete.
   *
   * Les generations avancent quand meme : une reponse deja en vol pour la
   * mission abandonnee doit etre ecartee, exactement comme si une autre
   * mission avait ete choisie.
   */
  function clearMission() {
    abort(missionController);
    abort(resultController);
    missionController = null;
    resultController = null;
    missionGeneration += 1;
    resultGeneration += 1;
    onResultPurge();
  }

  return {
    selectMission,
    selectResult,
    clearMission,
    generations: () => ({ mission: missionGeneration, result: resultGeneration }),
    discardedCounts: () => ({ mission: discarded.mission, result: discarded.result }),
  };
}

/* ------------------------------------------------------------------ *
 * Contrat de copie
 * ------------------------------------------------------------------ */

/**
 * La chaine remise au presse-papiers est EXACTEMENT `render(mission).text`.
 *
 * Aucune reindentation, aucun ajout d'en-tete, aucune troncature. Ce que la
 * console ne promet pas, en revanche, ce sont les octets ULTERIEUREMENT
 * colles : ce qui se passe apres `writeText` appartient au systeme.
 */
export function missionCopyPayload(missionResponse) {
  if (!missionResponse || !missionResponse.render) return null;
  const text = missionResponse.render.text;
  return typeof text === 'string' ? text : null;
}

/**
 * Le succes ou l'echec du presse-papiers est INDEPENDANT de la validite de la
 * mission : un refus de `writeText` ne rend pas la mission invalide, et une
 * copie reussie ne dit rien de ce que l'operateur collera.
 */
export async function copyMission(clipboard, missionResponse) {
  const text = missionCopyPayload(missionResponse);
  if (text === null) return { copied: false, reason: 'NO_RENDERED_ENVELOPE' };
  try {
    await clipboard.writeText(text);
    return { copied: true, bytes: text.length };
  } catch (error) {
    return { copied: false, reason: 'CLIPBOARD_REFUSED', detail: String(error && error.message) };
  }
}

/* ------------------------------------------------------------------ *
 * Acces reseau
 * ------------------------------------------------------------------ */

/**
 * Un statut non-2xx est un ECHEC, et porte le corps structure du serveur.
 *
 * L'interface sait afficher l'erreur -- et c'est precisement pour cela qu'il
 * ne faut pas confondre << affichable >> et << reussi >>.
 */
export async function requestJson(url, init) {
  const response = await fetch(url, init);
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }
  if (!response.ok) {
    const fault = new Error(
      (payload && payload.message) || 'requete refusee : HTTP ' + response.status,
    );
    fault.status = response.status;
    fault.code = payload && payload.code ? payload.code : 'HTTP_' + response.status;
    fault.details = payload && payload.details !== undefined ? payload.details : null;
    throw fault;
  }
  return payload;
}

/* ------------------------------------------------------------------ *
 * Cablage DOM
 * ------------------------------------------------------------------ */

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = String(text);
  return node;
}

function statusBadge(status) {
  const node = element('span', 'status', status === null ? '—' : status);
  node.dataset.status = status === null ? 'UNRESOLVED' : String(status);
  return node;
}

function definitions(target, pairs) {
  target.replaceChildren();
  for (const [term, value] of pairs) {
    const wrapper = element('div', 'field');
    wrapper.append(element('dt', null, term), element('dd', null, value === null ? '—' : value));
    target.append(wrapper);
  }
}

function referenceList(entries) {
  const list = element('ul', 'references');
  for (const entry of entries) {
    const parts = [entry.id, entry.kind, entry.policy, entry.ref].filter(
      (part) => part !== null && part !== undefined,
    );
    const item = element('li', null, parts.join('  ·  '));
    if (entry.supports) {
      item.append(
        element(
          'div',
          'sub',
          'supports ' +
            String(entry.supports.subject) +
            '.' +
            String(entry.supports.field),
        ),
      );
    }
    if (entry.observed && entry.observed.blob) {
      item.append(element('div', 'sub', 'blob enregistré ' + entry.observed.blob));
    }
    list.append(item);
  }
  return list;
}

function showFault(node, fault) {
  node.hidden = false;
  const code = fault && fault.code ? fault.code : 'ERREUR';
  const status = fault && fault.status ? ' (HTTP ' + fault.status + ')' : '';
  let text = code + status + ' — ' + String(fault && fault.message ? fault.message : fault);
  const details = fault && fault.details;
  if (details && details.validation && Array.isArray(details.validation.errors)) {
    for (const error of details.validation.errors) {
      text += '\n  ' + String(error.path ?? '') + ' : ' + String(error.message ?? error);
    }
  }
  node.textContent = text;
}

function clearFault(node) {
  node.hidden = true;
  node.textContent = '';
}

function initialize() {
  const byId = (id) => document.getElementById(id);

  const missionError = byId('mission-error');
  const resultError = byId('result-error');
  const missionEnvelope = byId('mission-envelope');
  const copyButton = byId('mission-copy');
  const copyStatus = byId('mission-copy-status');

  let displayedMission = null;

  const purgeResult = () => {
    clearFault(resultError);
    byId('result-binding').textContent = '';
    definitions(byId('result-capture'), []);
    definitions(byId('result-mission-recapture'), []);
    for (const id of [
      'result-associations',
      'result-contract',
      'result-reported-values',
      'result-non-production',
      'result-evidence',
    ]) {
      byId(id).replaceChildren();
    }
  };

  const coordinator = createCoordinator({
    fetchImpl: (url, init) => requestJson(url, init),
    onResultPurge: purgeResult,
  });

  /* --- bandeau de contexte ------------------------------------------ */
  requestJson('/api/context')
    .then((context) => {
      byId('context-repository').textContent = context.repositoryLabel;
      byId('context-head').textContent = context.head;
      byId('context-object-format').textContent = context.objectFormat;
    })
    .catch((fault) => showFault(byId('context-error'), fault));

  /* --- panneau A ----------------------------------------------------- */
  requestJson('/api/program-state')
    .then((payload) => {
      definitions(byId('program-state-capture'), [
        ['chemin', payload.capture.path],
        ['octets', payload.capture.bytes],
        ['sha256', payload.capture.sha256],
        ['blob', payload.capture.blob],
      ]);
      const checkpoint = payload.state.checkpoint ?? {};
      definitions(byId('program-state-checkpoint'), [
        ['format_version', checkpoint.format_version],
        ['updated_at', checkpoint.updated_at],
      ]);
      const context = payload.state.git_context ?? {};
      definitions(byId('program-state-git-context'), [
        ['repository', context.repository],
        ['branch', context.branch],
        ['observed_base_head', context.observed_base_head],
        ['observed_base_tree', context.observed_base_tree],
      ]);

      const nextAction = byId('program-state-next-action');
      nextAction.replaceChildren();
      const nextRecord = element('div', 'record');
      nextRecord.append(element('div', 'head', payload.state.next_action.state));
      nextRecord.append(element('div', 'value', payload.state.next_action.value));
      nextRecord.append(referenceList(payload.state.next_action.evidence));
      nextAction.append(nextRecord);

      const streams = byId('program-state-streams');
      streams.replaceChildren();
      for (const stream of payload.state.streams) {
        const record = element('div', 'record');
        record.append(element('div', 'head', stream.id + '  ' + stream.state));
        record.append(element('div', 'sub', stream.title));
        /* `type` est rendu VERBATIM : deux orthographes reelles coexistent. */
        record.append(element('div', 'sub', 'type ' + stream.type + '  ·  ' + stream.updated_at));
        record.append(referenceList(stream.evidence));
        streams.append(record);
      }

      const decisions = byId('program-state-decisions');
      decisions.replaceChildren();
      for (const decision of payload.state.decisions) {
        const record = element('div', 'record');
        record.append(element('div', 'head', decision.id + '  ' + decision.state));
        record.append(element('div', 'sub', decision.question));
        record.append(referenceList(decision.evidence));
        decisions.append(record);
      }

      const summary = payload.evidenceSummary;
      definitions(byId('program-state-evidence-summary'), [
        ['total', summary.total],
        ['par genre', Object.entries(summary.byKind).map(([k, v]) => k + ' ' + v).join('  ·  ')],
        ['par politique', Object.entries(summary.byPolicy).map(([k, v]) => k + ' ' + v).join('  ·  ')],
        ['vérification', payload.evidenceVerification.status],
      ]);
    })
    .catch((fault) => showFault(byId('program-state-error'), fault));

  /* --- panneaux B et C : candidats ----------------------------------- */
  const fill = (select, payload, label) => {
    select.replaceChildren();
    const empty = element('option', null, '— ' + label + ' —');
    empty.value = '';
    select.append(empty);
    for (const candidate of payload.candidates) {
      const option = element('option', null, candidate.path + '  (' + candidate.bytes + ' o)');
      option.value = candidate.path;
      select.append(option);
    }
  };

  const missionSelect = byId('mission-select');
  const resultSelect = byId('result-select');

  requestJson('/api/candidates?class=MISSION')
    .then((payload) => fill(missionSelect, payload, 'choisir une mission'))
    .catch((fault) => showFault(missionError, fault));
  requestJson('/api/candidates?class=RESULT')
    .then((payload) => fill(resultSelect, payload, 'choisir un résultat'))
    .catch((fault) => showFault(resultError, fault));

  /* --- panneau B : selection ----------------------------------------- */
  const applyMission = (payload) => {
    displayedMission = payload;
    clearFault(missionError);
    copyStatus.textContent = '';
    copyButton.disabled = false;
    definitions(byId('mission-capture'), [
      ['chemin', payload.capture.path],
      ['octets', payload.capture.bytes],
      ['sha256', payload.capture.sha256],
      ['blob', payload.capture.blob],
    ]);
    definitions(byId('mission-snapshot'), [
      ['chemin', payload.snapshot.path],
      ['blob', payload.snapshot.blob],
    ]);
    const validation = byId('mission-validation');
    validation.replaceChildren();
    const badge = element('div', 'record');
    badge.append(statusBadge(payload.validation.ok ? 'MATCH' : 'MISMATCH'));
    badge.append(
      element('span', 'note', payload.validation.ok ? '  valide' : '  invalide'),
    );
    validation.append(badge);
    missionEnvelope.textContent = payload.render.text;
  };

  const resetMission = () => {
    displayedMission = null;
    copyButton.disabled = true;
    copyStatus.textContent = '';
    missionEnvelope.textContent = '';
    definitions(byId('mission-capture'), []);
    definitions(byId('mission-snapshot'), []);
    byId('mission-validation').replaceChildren();
  };

  missionSelect.addEventListener('change', () => {
    const path = missionSelect.value;
    clearFault(missionError);
    resetMission();
    if (path === '') {
      coordinator.clearMission();
      return;
    }
    coordinator.selectMission(
      '/api/mission?path=' + encodeURIComponent(path),
      applyMission,
      (fault) => {
        resetMission();
        showFault(missionError, fault);
      },
    );
  });

  copyButton.addEventListener('click', () => {
    if (displayedMission === null) return;
    copyMission(navigator.clipboard, displayedMission).then((outcome) => {
      copyStatus.textContent = outcome.copied
        ? 'enveloppe copiée (' + outcome.bytes + ' caractères)'
        : 'presse-papiers refusé : ' + outcome.reason;
    });
  });

  /* --- panneau C : selection ----------------------------------------- */
  const applyResult = (payload) => {
    clearFault(resultError);
    definitions(byId('result-capture'), [
      ['chemin', payload.capture.path],
      ['octets', payload.capture.bytes],
      ['sha256', payload.capture.sha256],
      ['blob', payload.capture.blob],
    ]);
    definitions(byId('result-mission-recapture'), [
      ['mission', payload.missionRecapture.path],
      ['blob recapturé', payload.missionRecapture.blob],
      ['version confirmée', payload.missionRecapture.confirmed ? 'OUI' : 'NON'],
    ]);

    const associations = byId('result-associations');
    associations.replaceChildren();
    for (const [label, association] of [
      ['ASSOCIATION DE SOURCE', payload.sourceAssociation],
      ['ASSOCIATION DE CONTRAT DE RETOUR', payload.returnContractAssociation],
    ]) {
      const record = element('div', 'record');
      const head = element('div', 'head', label + '  ');
      head.append(statusBadge(association.status));
      record.append(head);
      if (association.reason) record.append(element('div', 'sub', association.reason));
      if (association.authority && association.authority.identity) {
        record.append(
          element(
            'div',
            'value',
            String(association.authority.identity.kind) +
              ' ' +
              String(association.authority.identity.value),
          ),
        );
      }
      associations.append(record);
    }
    for (const divergence of payload.pathDivergence) {
      const record = element('div', 'record');
      const head = element('div', 'head', 'PATH_DIVERGENCE  ' + divergence.which + '  ');
      head.append(statusBadge('CANNOT_ESTABLISH'));
      record.append(head);
      record.append(element('div', 'value', 'attendu  ' + String(divergence.expected)));
      record.append(element('div', 'value', 'trouvé   ' + String(divergence.actual)));
      record.append(
        element('div', 'sub', "un chemin n'établit jamais une identité à lui seul"),
      );
      associations.append(record);
    }
    const aggregate = element('div', 'record');
    const aggregateHead = element('div', 'head', 'AGRÉGAT  ');
    aggregateHead.append(statusBadge(payload.aggregate));
    aggregate.append(aggregateHead);
    associations.append(aggregate);

    const contract = byId('result-contract');
    contract.replaceChildren();
    const contractRecord = element('div', 'record');
    if (payload.contractValidation.run) {
      const head = element('div', 'head', 'EXÉCUTÉE  ');
      head.append(statusBadge(payload.contractValidation.ok ? 'MATCH' : 'MISMATCH'));
      contractRecord.append(head);
      contractRecord.append(
        element(
          'div',
          'sub',
          'vérifiées ' +
            payload.contractValidation.checked +
            '  ·  domaines non vérifiables ' +
            payload.contractValidation.uncheckedDomains,
        ),
      );
    } else {
      contractRecord.append(element('div', 'head', 'NON EXÉCUTÉE'));
      contractRecord.append(element('div', 'sub', payload.contractValidation.reason));
      contractRecord.append(
        element('div', 'sub', 'CONTRAT SATISFAIT ≠ RÉSULTAT ASSOCIÉ À CETTE MISSION'),
      );
    }
    contract.append(contractRecord);

    const reported = byId('result-reported-values');
    reported.replaceChildren();
    for (const entry of payload.reportedValues) {
      const record = element('div', 'record');
      record.append(element('div', 'head', entry.id + '  [' + entry.valueType + ']'));
      record.append(element('div', 'sub', entry.defined_by + '  ·  ' + entry.factKey));
      record.append(
        element('div', 'value', Array.isArray(entry.value) ? entry.value.join('\n') : entry.value),
      );
      if (entry.requirement) record.append(element('div', 'sub', 'exigence ' + entry.requirement));
      reported.append(record);
    }

    const nonProduction = byId('result-non-production');
    nonProduction.replaceChildren();
    if (payload.nonProduction.length === 0) {
      nonProduction.append(element('p', 'note', 'aucune'));
    }
    for (const entry of payload.nonProduction) {
      nonProduction.append(element('div', 'record', entry.requirement));
    }

    const evidence = byId('result-evidence');
    evidence.replaceChildren();
    if (payload.evidence.length === 0) {
      evidence.append(element('p', 'note', 'aucune preuve portée par cette instance'));
    }
    for (const entry of payload.evidence) {
      const record = element('div', 'record');
      const head = element('div', 'head', '');
      head.append(statusBadge(entry.resolution));
      record.append(head);
      record.append(
        element(
          'div',
          'value',
          String(entry.locator && entry.locator.kind) +
            '  ' +
            String(entry.locator && entry.locator.value),
        ),
      );
      if (entry.identity) {
        record.append(
          element('div', 'sub', 'identité enregistrée ' + String(entry.identity.value)),
        );
      }
      if (entry.capturedBlob) {
        record.append(
          element('div', 'sub', 'blob capturé ' + entry.capturedBlob + '  (' + entry.capturedBytes + ' o)'),
        );
      }
      if (entry.reason) record.append(element('div', 'sub', entry.reason));
      evidence.append(record);
    }
  };

  resultSelect.addEventListener('change', () => {
    const path = resultSelect.value;
    clearFault(resultError);
    if (path === '') return;
    if (displayedMission === null) {
      showFault(resultError, {
        code: 'MISSION_REQUIRED',
        message: "un résultat se lit CONTRE une version de mission affichée : choisir d'abord une mission",
      });
      return;
    }
    const snapshot = displayedMission.snapshot;
    byId('result-binding').textContent = 'lié au snapshot ' + snapshot.blob;
    coordinator.selectResult(
      '/api/result?path=' +
        encodeURIComponent(path) +
        '&missionPath=' +
        encodeURIComponent(snapshot.path) +
        '&missionBlob=' +
        encodeURIComponent(snapshot.blob),
      applyResult,
      (fault) => {
        purgeResult();
        showFault(resultError, fault);
      },
    );
  });
}

if (typeof document !== 'undefined') initialize();
