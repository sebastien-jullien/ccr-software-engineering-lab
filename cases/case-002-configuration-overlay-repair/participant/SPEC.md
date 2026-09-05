# Configuration Overlay Engine — Public Specification

## 1. Mission

Fournir une fonction TypeScript pure, en mémoire, qui applique une couche de configuration
(`overlay`) sur une configuration de base (`base`) et retourne le résultat fusionné.

L'implémentation doit respecter exactement l'API et les règles ci-dessous.

## 2. API publique

Le module `src/config-overlay.ts` doit exporter :

```ts
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

export function applyOverlay(base: ConfigObject, overlay: ConfigObject): ConfigObject;
```

Aucun autre export public n'est requis.

## 3. Domaine de valeurs

```text
ConfigValue
= null
| boolean
| number
| string
| ConfigValue[]
| ConfigObject

ConfigObject
= plain JSON-like object
= { [key: string]: ConfigValue }
```

Un `number` du domaine est un nombre JSON fini. `NaN`, `Infinity` et `-Infinity` ne font pas
partie du domaine.

Un *plain object* est un objet dont la valeur n'est ni `null` ni un tableau, et dont la
structure est celle d'un objet JSON ordinaire.

## 4. Hors contrat

Les valeurs suivantes sont hors du domaine spécifié :

```text
undefined
functions
symbols
Date
Map
Set
class instances
non-plain objects
```

Aucun comportement n'est spécifié pour elles. Une implémentation n'a pas à les détecter, à les
rejeter ni à les traiter d'une manière particulière, et aucune conclusion ne peut être tirée de
ce qu'elle en fait.

## 5. Sémantique de l'overlay

Pour chaque **propre clé** de l'overlay :

```text
overlay key absent
→ preserve base value

overlay key present with null
→ delete that key from the result

base value and overlay value both plain objects
→ recursively merge

otherwise
→ overlay value replaces base value
```

Les clés de `base` qui n'apparaissent pas dans `overlay` sont conservées telles quelles.

Seules les propres clés énumérables sont considérées, de part et d'autre. La chaîne de
prototypes n'est jamais consultée.

## 6. Conséquences explicites

```text
false
0
""
= ordinary explicit values
= MUST replace the base value

arrays
= replaced as complete values
= never recursively merged

overlay object over scalar
= overlay object replaces scalar

overlay scalar over object
= scalar replaces object
```

`null` n'est jamais une valeur stockée : sa présence dans l'overlay signifie toujours la
suppression de la clé dans le résultat. Supprimer une clé absente de `base` est sans effet et
n'est pas une erreur.

## 7. Immutabilité et non-aliasing

```text
no mutation of base
no mutation of overlay

result nested structures
= must not alias mutable structures from either input
```

Après un appel, `base` et `overlay` doivent être structurellement inchangés. Aucun objet ni
tableau atteignable depuis le résultat ne doit être le même objet qu'une structure atteignable
depuis l'une des deux entrées : modifier le résultat ne doit jamais modifier une entrée, et
réciproquement.

## 8. Déterminisme

```text
deterministic result
```

Pour un couple `(base, overlay)` donné, le résultat est toujours structurellement identique.
La fonction ne lit aucun état global, aucune horloge et aucune source aléatoire.

## 9. État et persistance

```text
FILESYSTEM PERSISTENCE
= none

DATABASE
= none

NETWORK
= none
```

## 10. Hors périmètre

Ne sont pas demandés :

- fusion de plusieurs overlays en une seule passe ;
- stratégies de fusion configurables ;
- fusion de tableaux élément par élément ;
- résolution de références ou d'interpolation de variables ;
- schéma, validation ou typage dynamique de la configuration ;
- persistance, API HTTP, interface utilisateur.
