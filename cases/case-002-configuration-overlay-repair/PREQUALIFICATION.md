# CASE-002 — Préqualification

Exécutée avant tout run CCR, sur une copie de qualification jetable dérivée de `participant/`
et de `control/`, jamais sur les paquets eux-mêmes.

```text
CCR START
= NOT RUN

QUALIFICATION WORKSPACE
= workspace de qualification jetable et frais, hors du dépôt du Lab

RUNTIME
= Node.js v22.18.0
= typescript 5.8.3
```

## 1. Qualification de l'oracle

L'oracle doit satisfaire l'intégralité du contrat public et l'intégralité des holdouts.

```text
REFERENCE VISIBLE QUALIFICATION
= 6/6
= V1 V2 V3 V4 V5 V6 — 0 échec

REFERENCE HOLDOUT QUALIFICATION
= 14/14
= H1 H2 H3 H4 H5 H6 H7 H8 H9 H10 H11 H12 H13 H14 — 0 échec
```

## 2. Baseline du candidat

Le candidat initial est construit et exécuté sans aucune modification.

```text
TYPECHECK
= clean (tsc --noEmit, exit 0)

BUILD
= clean (tsc, exit 0)

VISIBLE TESTS
= 5/6
= échec attendu : V3 « reproduction rapportée : une bascule mise à false est appliquée »

CANDIDATE HOLDOUTS
= 11/14
= échecs : H1, H2, H3
= succès : H4 H5 H6 H7 H8 H9 H10 H11 H12 H13 H14
```

Le baseline n'a pas été réparé pour rendre les tests verts. L'échec visible est le symptôme
rapporté que le participant devra diagnostiquer.

## 3. Sensibilité du control

Le control doit distinguer réellement le défaut connu du comportement déjà correct.

```text
CONTROL SENSITIVITY
= demonstrated
```

Répartition des échecs baseline par catégorie de la matrice de vérité :

```text
DEFECT GENERALIZATION      H1 H2 H3      → 0/3 pass   (le défaut est détecté)
NULL REGRESSION            H4 H5 H6      → 3/3 pass   (garde de régression intacte)
ALREADY-CORRECT BEHAVIOR   H7 H8 H9 H10 H11 H14 → 6/6 pass
IMMUTABILITY / ALIASING    H12 H13       → 2/2 pass
```

Le control échoue exactement là où le défaut racine se manifeste, et nulle part ailleurs.
Aucune garde de régression n'est déclenchée par la fixture initiale.

## 4. Unicité du défaut racine

Une sonde jetable, construite hors du cas et détruite après mesure, a neutralisé la seule
condition fautive de la fixture sans autre modification.

```text
PROBE RESULT
= visible 6/6
= holdouts 14/14
```

Conséquence pour l'expérience :

```text
ONE ROOT DEFECT
= D1
= confirmed — a single condition accounts for every baseline failure

SECOND INTENTIONAL DEFECT
= NONE

CONTROL OVER-CONSTRAINT
= NONE demonstrated
```

La sonde ne constitue pas une réparation proposée et n'a été conservée nulle part. Le
`participant/` figé contient la fixture défectueuse d'origine.

## 5. Étanchéité du paquet participant

```text
CAUSE DISCLOSURE IN MISSION.md
= NONE

CAUSE DISCLOSURE IN SPEC.md
= NONE

CAUSE DISCLOSURE IN CODE COMMENTS
= NONE

HIDDEN MANIFESTATIONS (0, "") NAMED IN MISSION.md
= NONE

CONTROL CONTENT IN PARTICIPANT PACK
= NONE
```

`SPEC.md` §6 énonce que `false`, `0` et `""` sont des valeurs explicites ordinaires qui doivent
remplacer la valeur de base : c'est la définition du contrat, requise pour éviter une
controverse parasite sur le domaine. Elle ne dit pas quelle partie de l'implémentation est
fautive, ni quelles manifestations existent réellement dans la fixture.

## 6. Indépendance oracle / candidat

```text
CONSTRUCTION
= reference engine written directly from the published semantics
= NOT derived from the participant implementation

CANDIDATE SHAPE
= fresh result object, base entries cloned in, then overlay keys applied,
  with a guard on the replacement branch

REFERENCE SHAPE
= full deep copy of base, then own overlay keys applied,
  null compared by identity, no value ever tested for truthiness
```

Les deux implémentations partagent la sémantique publiée et rien d'autre : ni structure, ni
ordre de parcours, ni découpage en fonctions, ni nommage.
