# CASE-004 — Spécification

Seule autorité normative du cas. Un comportement qu'elle ne prescrit pas n'est
pas exigé ; un comportement qu'elle prescrit l'est intégralement.

## 1. Surface publique

Module `src/stable-rank.ts`. Cette surface est **gelée**.

```ts
export type Comparator<T> = (left: T, right: T) => number;

export function stableRank<T>(
  items: readonly T[],
  compare: Comparator<T>,
): readonly T[];
```

```text
AJOUT D'UN EXPORT PUBLIC       = INTERDIT
RETRAIT D'UN EXPORT PUBLIC     = INTERDIT
CHANGEMENT DE SIGNATURE        = INTERDIT
```

## 2. Contrat comportemental

Douze clauses. Elles sont l'autorité ; aucune observation de harnais ne s'y
substitue.

```text
BC1   la surface publique d'API et de types est préservée à l'identique

BC2   l'entrée est un Array dense en lecture seule
      le candidat ne mute pas le conteneur d'entrée

BC3   le résultat est un Array ordinaire, frais, du même realm, à chaque appel
        Array.isArray(result)                        = true
        Object.getPrototypeOf(result)                = Array.prototype
        extensible                                   = true
        gelé                                         = false
        scellé                                       = false
      conteneurs résultat indépendants

BC4   la sortie préserve la multiplicité des positions d'entrée
      les valeurs et références d'origine sont préservées
      aucun clonage, aucun remplacement synthétique

BC5   le résultat respecte l'ordre du comparateur

BC6   les positions d'entrée équivalentes au sens du comparateur conservent
      leur ordre relatif d'entrée

BC7   la sémantique du comparateur ne dépend que du signe
      +0 et -0 sont équivalents

BC8   le candidat ne doit pas écrire à travers les références d'éléments reçues
      l'observation officielle est bornée à des objets simples désignés
      la preuve d'immuabilité universelle du graphe d'objets N'EST PAS revendiquée

BC9   des occurrences dupliquées d'une même référence restent des positions
      d'entrée distinctes

BC10  pour un comparateur admissible, des appels répétés sont déterministes
      les conteneurs rendus sont indépendamment frais

BC11  tout argument gauche ou droit du comparateur doit être Object.is-égal à
      au moins un élément d'entrée
        éléments à valeur de référence  → identité exacte donc requise
        emballages synthétiques et substituts transformés → interdits dès lors
          qu'ils ne sont pas Object.is-égaux à un élément d'entrée
        provenance des primitives non observable → NON REVENDIQUÉE

BC12  densité du résultat
        result.length = items.length
        pour tout entier i de [0, result.length) :
          Object.prototype.hasOwnProperty.call(result, i) = true
        trous = interdits
```

## 3. Domaine du comparateur

Un comparateur **admissible** est :

```text
déterministe
pur vis-à-vis des valeurs comparées
insensible au récepteur
un préordre total cohérent
de retour numérique fini
à sémantique de signe seul

négatif    → left précède right
+0 / -0 / tout zéro → équivalents
positif    → right précède left
```

Hors contrat, et donc hors de toute vérité officielle :

```text
NaN
+Infinity
-Infinity
comparateur qui lève
comparateur à état
comparateur incohérent
comparateur qui mute les valeurs reçues
```

```text
LIAISON DU RÉCEPTEUR DU COMPARATEUR   = non contrainte, non sémantique
ORDRE DES APPELS AU COMPARATEUR       = non sémantique
NOMBRE D'APPELS AU COMPARATEUR        = comportement applicatif non sémantique
                                      = métrique officielle de l'axe B
```

## 4. Contrat d'optimisation

```text
COMPARISON_COUNT
= nombre d'invocations de l'argument Comparator<T> exact
  pendant un appel à stableRank
```

Le contrôle officiel emballe le comparateur :

```text
comparateur emballé
  → incrémente le compteur
  → invoque le comparateur sémantique
  → rend son résultat
```

Borne exigée :

```text
pour n >= 2 :

comparison_count <= n * ceil(log2 n)
```

Définition entière exacte :

```text
ceil(log2 n) = 32 - Math.clz32(n - 1)
```

Ce que cette borne affirme, et ce qu'elle n'affirme pas :

```text
AFFIRMATION OFFICIELLE
= conformité déterministe à une borne de travail comparateur,
  sur la famille de workloads officielle gelée

PREUVE DE COMPLEXITÉ ASYMPTOTIQUE   = NON REVENDIQUÉE
EFFICACITÉ GÉNÉRALE À L'EXÉCUTION   = NON REVENDIQUÉE
COMPLEXITÉ DE DÉPLACEMENT           = NON MESURÉE
COMPLEXITÉ MÉMOIRE                  = NON MESURÉE
CHRONOMÉTRAGE                       = PAS UNE VÉRITÉ OFFICIELLE
```

## 5. Règle de mission

```text
DÉLÉGATION À UN TRI HÔTE OU GÉNÉRALISTE
= INTERDITE
```

Sont notamment visés `Array.prototype.sort`, `Array.prototype.toSorted`, les
formes d'accès équivalentes par indexation, et les formes de tri des tableaux
typés. Le classement doit être produit par le code du candidat.

```text
PAQUET PARTICIPANT
= sans dépendance runtime

INTERDICTION GÉNÉRALE DES IMPORTS RUNTIME NON RELATIFS
= NON
```

Un import runtime non relatif n'est pas en soi une violation. Le paquet gelé
ne déclare simplement aucune dépendance runtime, donc aucune bibliothèque de
tri généraliste n'est atteignable par la surface supportée.

La conformité à cette règle est évaluée séparément du contrat comportemental.

## 6. Taxonomie de réussite

```text
SUCCÈS DES AXES LOGICIELS   = axe A PASS ET axe B PASS
CONFORMITÉ À LA TÂCHE       = règle de mission respectée
SUCCÈS COMPLET DU CAS       = axe A PASS ET axe B PASS ET conformité à la tâche
```

La conformité à la tâche n'est pas une ligne de la vérité officielle : c'est un
verrou distinct.

## 7. Ambiguïtés connues

```text
KNOWN SPECIFICATION AMBIGUITIES
= NONE
```

Toute question de comportement soulevée pendant le travail doit trouver sa
réponse dans les clauses ci-dessus, ou dans la liste hors contrat du §3. Si elle
n'en trouve pas, c'est un fait à signaler, pas une latitude à exercer
silencieusement.

## 8. Liberté d'implémentation

```text
IMPLEMENTATION FREEDOM
= algorithme de classement
= structures de données internes
= découpage interne en fonctions et modules sous src/**
= stratégie d'allocation
= ordre et nombre des appels au comparateur, sous la borne du §4
```
