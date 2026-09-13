/**
 * Panneau A -- etat du Lab.
 *
 * CAPTURE, PARSE, PROJECTION. Rien d'autre.
 *
 * Cet adaptateur lit le point de reprise durable et le PROJETTE tel qu'il est
 * enregistre. Il ne verifie aucune preuve, ne dereference aucune reference et
 * ne recalcule aucun blob : il AFFICHE ce que le checkpoint dit de lui-meme,
 * au moment ou le checkpoint l'a dit.
 *
 * La distinction est le coeur du panneau :
 *
 *   REFERENCE AFFICHEE   n'est pas   REFERENCE VERIFIEE
 *   ABSENCE DE VERIFICATION  n'est pas  VERIFICATION REUSSIE
 *
 * D'ou l'interdit sur `check`, `checkEvidence`, `blobOf`, `renderCheck` et
 * `claimsOf` : aucun n'est importe ici. Et d'ou l'absence -- non pas la mise a
 * zero -- de `findings`, `material` et `exitCode` dans le modele rendu. Un
 * compteur a 0 se lirait comme << verifie, rien trouve >>. Un champ absent ne
 * se lit pas du tout.
 */

import { capture, decodeStrict, CaptureFault } from './capture.mjs';
import { parse } from '../program-state/program-state.mjs';

export const PROGRAM_STATE_PATH = 'PROGRAM-STATE.json';

/** Enonce obligatoire, non conditionnel, du panneau A. */
export const EVIDENCE_VERIFICATION_STATUS = 'NOT_EXECUTED_BY_CONSOLE_V0';

/**
 * Projection d'une reference de preuve ENREGISTREE.
 *
 * `observed.blob` est la valeur qu'avait la reference AU MOMENT du checkpoint.
 * Le blob courant n'est pas calcule, et la comparaison enregistre / courant
 * n'est pas executee. Le champ n'apparait que lorsqu'il est reellement porte.
 */
function projectEvidence(list) {
  if (!Array.isArray(list)) return [];
  return list.map((entry) => {
    const source = entry && typeof entry === 'object' ? entry : {};
    const projected = {
      id: source.id ?? null,
      kind: source.kind ?? null,
      ref: source.ref ?? null,
      policy: source.policy ?? null,
      supports:
        source.supports && typeof source.supports === 'object'
          ? {
              subject: source.supports.subject ?? null,
              field: source.supports.field ?? null,
              value: source.supports.value ?? null,
            }
          : null,
    };
    if (source.observed && source.observed.blob !== undefined) {
      projected.observed = { blob: source.observed.blob };
    }
    return projected;
  });
}

/**
 * Projection d'un flux.
 *
 * `type` est rendu VERBATIM. Deux orthographes reelles coexistent dans le
 * checkpoint -- `TOOLING_EXPERIMENT` et `TOOLING EXPERIMENT` -- et les
 * normaliser serait reecrire la donnee durable pour flatter l'affichage.
 * NORMALISATION DE VALEUR ENREGISTREE = 0.
 */
function projectStream(stream) {
  const source = stream && typeof stream === 'object' ? stream : {};
  return {
    id: source.id ?? null,
    title: source.title ?? null,
    type: source.type ?? null,
    state: source.state ?? null,
    updated_at: source.updated_at ?? null,
    evidence: projectEvidence(source.evidence),
  };
}

function projectDecision(decision) {
  const source = decision && typeof decision === 'object' ? decision : {};
  return {
    id: source.id ?? null,
    question: source.question ?? null,
    state: source.state ?? null,
    evidence: projectEvidence(source.evidence),
  };
}

/** `value` est rendue COMPLETE. Aucune troncature d'affichage cote serveur. */
function projectNextAction(nextAction) {
  const source = nextAction && typeof nextAction === 'object' ? nextAction : {};
  return {
    state: source.state ?? null,
    value: source.value ?? null,
    evidence: projectEvidence(source.evidence),
  };
}

function summarize(streams, decisions, nextAction) {
  const byKind = {};
  const byPolicy = {};
  let total = 0;
  const count = (list) => {
    for (const entry of list) {
      total += 1;
      const kind = entry.kind === null ? 'UNKNOWN' : String(entry.kind);
      const policy = entry.policy === null ? 'UNKNOWN' : String(entry.policy);
      byKind[kind] = (byKind[kind] ?? 0) + 1;
      byPolicy[policy] = (byPolicy[policy] ?? 0) + 1;
    }
  };
  for (const stream of streams) count(stream.evidence);
  for (const decision of decisions) count(decision.evidence);
  count(nextAction.evidence);
  return { byKind, byPolicy, total };
}

/**
 * Capture UNIQUE de PROGRAM-STATE.json, puis projection.
 *
 * Le chemin recu est deja confine par `repo.mjs`. Les identites rendues sont
 * celles des octets qui ont servi au parse -- pas d'une seconde lecture.
 */
export function projectProgramState(absolutePath, repositoryRelativePath, objectFormat) {
  const captured = capture(absolutePath, objectFormat);
  const text = decodeStrict(captured.bytes);

  let state;
  try {
    state = parse(text);
  } catch (error) {
    throw new CaptureFault('PARSE_FAILED', 422, 'point de reprise durable illisible', {
      reason: error && error.message ? error.message : String(error),
    });
  }

  const checkpoint =
    state.checkpoint && typeof state.checkpoint === 'object'
      ? {
          format_version: state.checkpoint.format_version ?? null,
          updated_at: state.checkpoint.updated_at ?? null,
        }
      : null;

  const gitContext =
    state.git_context && typeof state.git_context === 'object'
      ? {
          repository: state.git_context.repository ?? null,
          branch: state.git_context.branch ?? null,
          observed_base_head: state.git_context.observed_base_head ?? null,
          observed_base_tree: state.git_context.observed_base_tree ?? null,
        }
      : null;

  const streams = (Array.isArray(state.streams) ? state.streams : []).map(projectStream);
  const decisions = (Array.isArray(state.decisions) ? state.decisions : []).map(projectDecision);
  const nextAction = projectNextAction(state.next_action);

  return {
    capture: {
      path: repositoryRelativePath,
      bytes: captured.size,
      sha256: captured.sha256,
      blob: captured.blob,
    },
    state: {
      checkpoint,
      git_context: gitContext,
      streams,
      decisions,
      next_action: nextAction,
    },
    evidenceSummary: summarize(streams, decisions, nextAction),
    evidenceVerification: { status: EVIDENCE_VERIFICATION_STATUS },
  };
}
