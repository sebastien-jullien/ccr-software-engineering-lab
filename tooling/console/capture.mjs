/**
 * Capture unique et identite des octets.
 *
 * Toute la console repose sur une seule primitive : on lit les octets d'un
 * artefact UNE fois, et TOUT ce qui est ensuite affirme sur cet artefact --
 * son empreinte, son identite Git, son texte, sa structure -- est derive de
 * CES octets-la, jamais d'une seconde lecture.
 *
 * Le motif est direct : entre deux lectures, un fichier peut changer. Une
 * identite calculee sur la premiere lecture et un parse effectue sur la
 * seconde decrivent alors deux versions differentes, et l'interface presente
 * une identite qui ne correspond a rien de ce qu'elle affiche.
 *
 * AUCUNE SECONDE LECTURE DANS LA MEME OPERATION NE PEUT REMPLACER LA VERSION.
 */

import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { TextDecoder } from 'node:util';

/**
 * Formats d'objet de depot supportes par la v0.
 *
 * Le depot du Lab est en `sha1`. Un format non supporte est refuse
 * explicitement plutot que calcule de travers : une identite Git fausse est
 * pire qu'une identite absente.
 */
export const SUPPORTED_OBJECT_FORMATS = Object.freeze(['sha1']);

/**
 * Defaut porte par une operation de console, avec sa classe HTTP.
 *
 * `consoleFault` est le marqueur employe par le serveur : il classe par cette
 * propriete et non par `instanceof`, afin que `repo.mjs` puisse porter sa
 * propre classe sans que le graphe d'import gele ait a etre modifie.
 */
export class CaptureFault extends Error {
  constructor(code, status, message, details) {
    super(message);
    this.name = 'CaptureFault';
    this.consoleFault = true;
    this.code = code;
    this.status = status;
    this.details = details === undefined ? null : details;
  }
}

/**
 * Identite Git-blob EXACTE des octets fournis, calculee en Node.
 *
 *   blob_id = <hash>("blob " + longueur_en_octets + NUL + octets)
 *
 * `git hash-object --path` n'est PAS employe : `--path=` applique les filtres
 * de contenu du depot, et des octets CRLF sous une regle `text eol=lf` y
 * rendent l'identite LF, donc l'identite d'octets AUTRES que ceux qu'on vient
 * de capturer. Le depot configure en outre `filter.lfs.required = true`.
 */
export function gitBlobId(bytes, objectFormat = 'sha1') {
  if (!SUPPORTED_OBJECT_FORMATS.includes(objectFormat)) {
    throw new CaptureFault(
      'UNSUPPORTED_OBJECT_FORMAT',
      500,
      'format d objet de depot non supporte par la console v0 : ' + String(objectFormat),
      { objectFormat, supported: SUPPORTED_OBJECT_FORMATS.slice() },
    );
  }
  const header = Buffer.concat([Buffer.from('blob ' + bytes.length, 'ascii'), Buffer.from([0])]);
  return createHash(objectFormat).update(header).update(bytes).digest('hex');
}

/** SHA-256 brut des octets captures. */
export function sha256Of(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

/**
 * Decodage UTF-8 STRICT.
 *
 * `fatal` refuse toute sequence invalide au lieu de produire des U+FFFD
 * silencieux. `ignoreBOM` vaut `true` au sens de la specification -- le BOM
 * n'est PAS retire : le texte rendu correspond aux octets captures, et un
 * artefact JSON precede d'un BOM echoue au parse plutot que d'etre
 * silencieusement reecrit.
 */
const STRICT_UTF8 = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true });

export function decodeStrict(bytes) {
  try {
    return STRICT_UTF8.decode(bytes);
  } catch (error) {
    throw new CaptureFault('DECODE_FAILED', 422, 'octets non decodables en UTF-8 strict', {
      reason: error.message,
    });
  }
}

/**
 * Lecture UNIQUE d'un chemin DEJA confine, et identites de ces octets.
 *
 * Le chemin recu est un chemin absolu deja valide par `repo.mjs`. Cette
 * fonction n'est pas une frontiere de securite et ne pretend pas l'etre.
 *
 * Le registre rendu est gele. Les octets ne sont jamais reecrits ni relus
 * pour la duree de l'operation.
 */
export function capture(absolutePath, objectFormat = 'sha1') {
  let bytes;
  try {
    bytes = readFileSync(absolutePath);
  } catch (error) {
    if (error && (error.code === 'ENOENT' || error.code === 'ENOTDIR')) {
      throw new CaptureFault('ARTIFACT_NOT_FOUND', 404, 'artefact introuvable', {
        reason: error.code,
      });
    }
    /* Tout autre defaut de lecture est inattendu : il remonte tel quel et le
       serveur le classe en 500. On ne deguise pas une panne en 404. */
    throw error;
  }
  return Object.freeze({
    bytes,
    size: bytes.length,
    sha256: sha256Of(bytes),
    blob: gitBlobId(bytes, objectFormat),
  });
}
