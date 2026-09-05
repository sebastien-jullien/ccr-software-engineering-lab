// Oracle indépendant de CASE-002.
//
// Écrit directement depuis la sémantique publiée, sans reprendre la structure de
// l'implémentation participante. La forme intentionnelle est :
//
//   result = deep copy of base
//   for each own overlay key:
//       if overlay value === null            -> delete key
//       else if both values are plain objects -> recurse
//       else                                  -> deep copy of overlay value
//
// Aucune valeur n'est jamais testée pour sa véracité : la seule valeur qui reçoit un
// traitement particulier est `null`, et elle est comparée par identité.

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function deepCopy(value) {
  if (Array.isArray(value)) {
    const out = [];
    for (const item of value) out.push(deepCopy(item));
    return out;
  }

  if (isPlainObject(value)) {
    const out = {};
    for (const key of Object.keys(value)) out[key] = deepCopy(value[key]);
    return out;
  }

  return value;
}

export function referenceApplyOverlay(base, overlay) {
  const result = deepCopy(base);

  for (const key of Object.keys(overlay)) {
    const next = overlay[key];

    if (next === null) {
      delete result[key];
      continue;
    }

    const previous = result[key];

    if (isPlainObject(previous) && isPlainObject(next)) {
      result[key] = referenceApplyOverlay(previous, next);
      continue;
    }

    result[key] = deepCopy(next);
  }

  return result;
}
