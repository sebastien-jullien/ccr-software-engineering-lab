/**
 * Panneau B -- mission.
 *
 *   capture UNIQUE -> SHA-256 -> blob Git -> UTF-8 strict
 *   -> parse -> validate -> render -> snapshot
 *
 * Le SNAPSHOT est ce qui rend le panneau C possible : le couple
 * (chemin relatif au depot, blob Git capture) identifie LA version de mission
 * qui est affichee a l'ecran. Le panneau C le renvoie, le serveur recapture,
 * et une mission qui aurait change entre-temps ne peut pas se substituer
 * silencieusement a celle que l'operateur regarde.
 *
 * `renderCoverage()` est HORS du panneau B v0. La fonction existe toujours
 * dans le runtime Mission Object, et le runtime n'est pas modifie : une
 * fonction qui existe n'est pas une fonction dont la console v0 a besoin.
 * Elle n'est donc ni importee ici, ni exposee dans la reponse publique.
 */

import { capture, decodeStrict, CaptureFault } from './capture.mjs';
import { parse } from '../mission-object/mission-object.mjs';
import { validate } from '../mission-object/validate.mjs';
import { render } from '../mission-object/render.mjs';

/**
 * Capture et lecture d'une mission, SANS decider du sort d'une validation
 * negative.
 *
 * Le panneau B refuse d'afficher une mission invalide ; le panneau C doit
 * pouvoir recapturer la meme mission pour confirmer une version. Les deux
 * partagent donc cette fonction, et chacun classe le resultat selon son
 * propre contrat.
 */
export function captureMission(absolutePath, repositoryRelativePath, objectFormat) {
  const captured = capture(absolutePath, objectFormat);
  const text = decodeStrict(captured.bytes);

  let object;
  try {
    object = parse(text);
  } catch (error) {
    throw new CaptureFault('PARSE_FAILED', 422, 'Mission Object illisible', {
      path: repositoryRelativePath,
      reason: error && error.message ? error.message : String(error),
    });
  }

  const validation = validate(object);

  return Object.freeze({
    capture: {
      path: repositoryRelativePath,
      bytes: captured.size,
      sha256: captured.sha256,
      blob: captured.blob,
    },
    snapshot: { path: repositoryRelativePath, blob: captured.blob },
    object,
    validation,
  });
}

/**
 * Projection publique du panneau B.
 *
 * Une mission qui ne valide pas n'est pas une reponse reussie dont l'interface
 * saurait afficher l'erreur : c'est un artefact invalide, et la requete echoue
 * en 422 en portant les erreurs structurees.
 */
export function projectMission(absolutePath, repositoryRelativePath, objectFormat) {
  const mission = captureMission(absolutePath, repositoryRelativePath, objectFormat);

  if (!mission.validation.ok) {
    throw new CaptureFault('VALIDATION_FAILED', 422, 'Mission Object invalide', {
      subject: 'MISSION_OBJECT',
      capture: mission.capture,
      validation: mission.validation,
    });
  }

  const rendered = render(mission.object);

  return {
    capture: mission.capture,
    snapshot: mission.snapshot,
    validation: mission.validation,
    render: { text: rendered.text, trace: rendered.trace },
  };
}
