# Reservation Interval Engine — Public Specification

## 1. Mission

Implémenter une bibliothèque TypeScript en mémoire permettant de créer, annuler et lister des réservations temporelles.

L'implémentation doit respecter exactement l'API et les règles ci-dessous.

## 2. API publique

Le module `src/reservation-engine.ts` doit exporter :

```ts
export type ReservationStatus = 'active' | 'cancelled';

export interface Reservation {
  id: string;
  start: string;
  end: string;
  status: ReservationStatus;
}

export type ReserveFailureReason =
  | 'INVALID_ID'
  | 'INVALID_TIMESTAMP'
  | 'INVALID_INTERVAL'
  | 'DUPLICATE_ID'
  | 'OVERLAP';

export type ReserveResult =
  | { ok: true; reservation: Reservation }
  | { ok: false; reason: ReserveFailureReason };

export type CancelFailureReason =
  | 'INVALID_ID'
  | 'NOT_FOUND'
  | 'ALREADY_CANCELLED';

export type CancelResult =
  | { ok: true; reservation: Reservation }
  | { ok: false; reason: CancelFailureReason };

export class ReservationEngine {
  reserve(id: string, start: string, end: string): ReserveResult;
  cancel(id: string): CancelResult;
  list(): Reservation[];
}
```

Aucun autre export public n'est requis.

## 3. Identifiants

Un identifiant valide respecte :

```text
^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$
```

Donc :

- longueur 1 à 64 caractères ;
- premier caractère alphanumérique ASCII ;
- caractères suivants limités à lettres ASCII, chiffres, `_` et `-`.

Un identifiant déjà utilisé ne peut jamais être réutilisé, même après annulation.

## 4. Timestamps acceptés

Le moteur accepte uniquement ce sous-ensemble explicite de RFC3339 :

```text
YYYY-MM-DDTHH:mm:ss[.fraction](Z|±HH:MM)
```

avec :

- année comprise entre 2000 et 2099 ;
- mois et jour calendaires valides ;
- heure `00`–`23` ;
- minute et seconde `00`–`59` ;
- pas de leap second ;
- fraction optionnelle de 1 à 3 chiffres ;
- offset explicite obligatoire : `Z` ou `±HH:MM` ;
- offset maximal absolu : `14:00` ;
- pour `14`, les minutes d'offset doivent être `00`.

Toute valeur hors de ce sous-ensemble est invalide.

## 5. Normalisation

Tout timestamp valide est converti en UTC.

Les valeurs stockées et retournées utilisent exactement la forme produite par une représentation UTC milliseconde :

```text
YYYY-MM-DDTHH:mm:ss.sssZ
```

Exemple :

```text
2026-09-04T12:30:00+02:00
→ 2026-09-04T10:30:00.000Z
```

Les comparaisons temporelles portent sur les instants normalisés, jamais sur les chaînes d'entrée ou l'heure locale affichée.

## 6. Modèle d'intervalle

Chaque réservation utilise un intervalle demi-ouvert :

```text
[start, end)
```

Une réservation n'est valide que si :

```text
start < end
```

après normalisation des deux timestamps.

Deux intervalles actifs se chevauchent si et seulement si :

```text
existing.start < requested.end
AND
requested.start < existing.end
```

Les intervalles adjacents sont donc autorisés :

```text
[10:00, 11:00)
[11:00, 12:00)
```

## 7. Réservation

`reserve(id, start, end)` applique les validations dans cet ordre :

```text
1. INVALID_ID
2. INVALID_TIMESTAMP
3. INVALID_INTERVAL
4. DUPLICATE_ID
5. OVERLAP
```

Le premier échec applicable détermine le `reason` retourné.

En cas de succès :

- la réservation est créée avec `status: 'active'` ;
- `start` et `end` sont retournés normalisés en UTC ;
- le résultat contient un snapshot de la réservation créée.

## 8. Annulation

`cancel(id)` applique :

```text
1. INVALID_ID
2. NOT_FOUND
3. ALREADY_CANCELLED
```

En cas de succès :

- la réservation existante passe à `status: 'cancelled'` ;
- elle reste présente dans `list()` ;
- son intervalle ne bloque plus de nouvelles réservations ;
- l'identifiant reste consommé et ne peut pas être réutilisé.

## 9. Listing

`list()` retourne toutes les réservations, actives et annulées.

Ordre déterministe :

```text
1. start UTC ascending
2. end UTC ascending
3. id lexicographic ascending
```

Le statut n'intervient pas dans le tri.

## 10. Snapshots et mutation externe

Les objets `Reservation` retournés par `reserve`, `cancel` ou `list` sont des snapshots.

Modifier un objet retourné ou le tableau retourné par `list()` ne doit jamais modifier l'état interne du moteur.

## 11. État et persistance

Le moteur est uniquement en mémoire.

```text
FILESYSTEM PERSISTENCE
= none

DATABASE
= none

NETWORK
= none
```

## 12. Hors périmètre

Ne sont pas demandés :

- récurrence ;
- ressources multiples ;
- capacités ou quotas ;
- concurrence multi-process ;
- persistance ;
- API HTTP ;
- interface utilisateur ;
- fuseaux nommés IANA ;
- daylight-saving rules autres que ce qui est déjà exprimé par l'offset explicite fourni en entrée.
