export type ConfigValue =
  | null
  | boolean
  | number
  | string
  | ConfigValue[]
  | ConfigObject;

export interface ConfigObject {
  [key: string]: ConfigValue;
}

/**
 * Vrai pour un objet JSON ordinaire.
 *
 * `null` et les tableaux sont des valeurs complètes : ils ne sont jamais fusionnés
 * récursivement.
 */
function isPlainObject(value: unknown): value is ConfigObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Copie profonde d'une valeur du domaine.
 *
 * Les scalaires sont immuables et peuvent être partagés ; les objets et les tableaux sont
 * recopiés pour que le résultat ne partage aucune structure avec les entrées.
 */
function clone(value: ConfigValue): ConfigValue {
  if (Array.isArray(value)) {
    return value.map((item) => clone(item));
  }

  if (isPlainObject(value)) {
    const copy: ConfigObject = {};
    for (const [key, nested] of Object.entries(value)) {
      copy[key] = clone(nested);
    }
    return copy;
  }

  return value;
}

/**
 * Applique `overlay` sur `base` et retourne le résultat fusionné.
 *
 * Les deux entrées sont laissées intactes.
 */
export function applyOverlay(base: ConfigObject, overlay: ConfigObject): ConfigObject {
  const result: ConfigObject = {};

  // Point de départ : la base entière, recopiée. Les clés absentes de l'overlay
  // restent donc telles quelles.
  for (const [key, value] of Object.entries(base)) {
    result[key] = clone(value);
  }

  for (const [key, patch] of Object.entries(overlay)) {
    // `null` n'est pas une valeur stockée : il demande la suppression de la clé.
    if (patch === null) {
      delete result[key];
      continue;
    }

    // Deux objets ordinaires se fusionnent en profondeur.
    const current = result[key];
    if (isPlainObject(current) && isPlainObject(patch)) {
      result[key] = applyOverlay(current, patch);
      continue;
    }

    // Sinon, la valeur de l'overlay remplace celle de la base.
    if (patch) {
      result[key] = clone(patch);
    }
  }

  return result;
}
