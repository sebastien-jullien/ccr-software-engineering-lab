# Bounded Concurrency Task Pool — Spécification publique

```text
STATUT   contrat gelé
PORTÉE   src/task-pool.ts, et lui seul
```

Ce document fait foi. Le squelette n'en répète rien, et ne le contredit jamais.

---

## 1. API publique

```ts
export type PoolTask<T> = () => Promise<T>;

export interface PoolOptions {
  readonly limit: number;
  readonly signal?: AbortSignal;
}

export function runPool<T>(
  tasks: readonly PoolTask<T>[],
  options: PoolOptions,
): Promise<readonly T[]>;
```

Aucun autre export n'est requis, et la signature ci-dessus ne varie pas.

### 1.1 `readonly T[]`

```text
readonly T[]   =  restriction de consommateur, au niveau des TYPES
```

N'exige **ni** `Object.freeze`, **ni** immutabilité d'exécution, **ni** `Proxy`.
Aucune vérité ne porte sur le gel du tableau rendu.

---

## 2. Précédence des entrées

Trois étapes, dans cet ordre exact, avant toute invocation de tâche.

```text
1  valider options.limit
     invalide  →  JET SYNCHRONE  ·  0 invocation

2  si options.signal existe et signal.aborted === true
     →  promesse rejetée  ·  raison = signal.reason (identité)  ·  0 invocation

3  si tasks.length === 0
     →  résolution []
```

Conséquences fermées :

```text
limit invalide  +  signal déjà avorté    →  le JET SYNCHRONE l'emporte
signal déjà avorté  +  tasks vides       →  l'ABORT l'emporte, jamais []
```

### 2.1 Validité de `limit`

```text
valide  ⟺  Number.isSafeInteger(limit)  &&  limit >= 1
```

Invalides, au moins : `0`, négatif, `NaN`, `Infinity`, `-Infinity`, fraction,
entier non sûr.

```text
CLASSE D'ERREUR      RangeError
MOMENT               synchrone, avant tout retour de promesse
INVOCATIONS AVANT    0
FORMULATION          non contractuelle
```

---

## 3. Invocation

```text
ORDRE            index croissant
CARDINALITÉ      chaque fonction de tâche est invoquée AU PLUS UNE FOIS
REPRISE          aucune, en aucune circonstance
BORNE            0 <= inFlight <= limit, à tout instant
```

`inFlight` = tâche invoquée, pas encore réglée — accomplie, rejetée, ou réglée
par jet synchrone.

---

## 4. Progression

Aucune exigence de durée. Aucun score de performance. La propriété est métier.

```text
DÉMARRAGE INITIAL
  entrée valide + aucun abort préexistant + tasks non vide
  →  les tâches initiales éligibles FINISSENT PAR démarrer
  →  par index croissant, jusqu'à limit
  →  sans stimulus supplémentaire côté producteur
  →  sauf cause d'arrêt empêchant les démarrages suivants

RECHARGE D'UN CRÉNEAU
  une tâche en vol s'accomplit + aucune cause d'arrêt + file non vide
  →  la tâche éligible de PLUS PETIT INDEX finit par démarrer
  →  sans exiger le règlement d'une autre tâche en vol SANS RAPPORT
  →  sans stimulus supplémentaire côté producteur
  →  un règlement libère EXACTEMENT un créneau

RÈGLEMENT EXTERNE
  condition de quiescence contractuelle remplie
  →  la promesse externe finit par se régler, selon les règles du §6
```

### 4.1 Autorité d'exécution isolée

```text
Chaque ligne de vérité sensible à la vivacité est évaluée dans un processus
Node ISOLÉ, sans maintien artificiel de la boucle par l'évaluateur.

Une transition requise de runPool ne doit pas dépendre d'une activité externe
sans rapport, dont le seul rôle serait de maintenir le processus en vie assez
longtemps pour que la transition survienne.

Si cette exécution isolée se termine sans la transition requise, sans
intervention du watchdog et sans défaillance du harnais, l'exigence de
progression éventuelle correspondante n'est PAS satisfaite.
```

Cela ne signifie pas :

```text
timers interdits  ·  unref interdit  ·  ordonnanceur imposé  ·  phase imposée
```

Le mécanisme interne reste entièrement libre.

---

## 5. Cause d'arrêt

```text
AU PLUS UNE, choisie une fois, IMMUABLE

TASK_FAILURE   raison = valeur rejetée ou jetée
ABORT          raison = signal.reason
```

La cause retenue est la **première observée** par `runPool`. Tout événement
ultérieur — échec, jet, avortement — ne la remplace jamais.

### 5.1 Jet synchrone d'une tâche

```text
une invocation qui jette synchroniquement  =  TASK_FAILURE
raison  =  valeur jetée, à l'identité (===)
JAMAIS ENVELOPPÉE
```

L'échec est porté par le **rejet de la promesse rendue** par `runPool`. Il ne
s'échappe jamais synchroniquement de `runPool`.

### 5.2 Avortement synchrone pendant une invocation

```text
si la tâche i rend synchroniquement le signal fourni avorté
avant que la tâche i+1 soit invoquée

→  ABORT devient la cause d'arrêt si aucune n'existe encore
→  AUCUNE tâche en file ne démarre
```

Le moyen de détection est libre : écouteur, lecture de `signal.aborted`, ou
tout autre mécanisme valide. Aucune structure interne n'est imposée.

---

## 6. Quiescence

```text
QUELLE QUE SOIT LA CAUSE

travail en file        ne démarre JAMAIS après la cause d'arrêt
travail déjà démarré   va jusqu'à son règlement naturel
promesse externe       NE REJETTE PAS immédiatement
                       rejette après règlement de TOUT le travail déjà démarré
raison                 celle de la première cause retenue
```

L'avortement **n'annule pas** les promesses des tâches : ce contrat n'offre
aucune annulation de tâche, et n'en invente aucune. Une tâche qui observe le
même signal le fait de son propre chef.

### 6.1 Avortement après succès

```text
le succès est engagé dès que la dernière tâche requise s'est accomplie
et que le tableau de résultats est déterminé

→  un avortement postérieur est INERTE
→  aucun rejet rétroactif
```

---

## 7. Résultats

```text
result[i]           =  résultat de tasks[i]
ordre d'invocation  =  index croissant
ordre de résultat   =  index d'origine
ordre de règlement  =  SANS EFFET sur l'ordre du résultat
```

Les valeurs sont rendues telles quelles : `undefined`, `null` et `0` occupent
leur position, sans coalescence.

---

## 8. Domaine d'entrée

DANS le contrat :

```text
tasks       tableau readonly dense et stable ; indices 0..length-1 présents
            pendant toute la durée de runPool
élément     PoolTask<T> appelable
retour      Promise<T>
jet synchrone d'une tâche : explicitement supporté
options     objet PoolOptions stable pendant l'appel
signal      AbortSignal standard ; son état ne change que par son AbortController
signal.reason  valeur JavaScript quelconque ; identité préservée là où le
               contrat l'exige
```

HORS du contrat — aucune vérité ne les explore :

```text
mutation de tasks pendant runPool
tableaux à trous
comportement d'accès exotique via Proxy
éléments non appelables
mutation de options.limit en cours d'appel
remplacement ou mutation de options.signal en cours d'appel
```

---

## 9. Ce qui n'est pas noté

```text
usage interne de timers        non noté
structure interne              non notée
style, nommage, découpage      non notés
durée d'exécution              non notée
gel du tableau rendu           non noté
```

Seul le comportement public décrit ci-dessus est évalué.
