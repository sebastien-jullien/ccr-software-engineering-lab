# CASE-003 — Matrice de vérité

**MATÉRIEL AVEUGLE.** Révélée uniquement après le gel du candidat.

```text
TRUTH MATRIX ROWS      = 27
VISIBLE                = V1..V10   (10)
HOLDOUT                = H1..H17   (17)

AXIS A                 = 17        capacité nouvelle
AXIS B                 = 10        contrat public antérieur
AXIS C                 = NONE

KNOWN AMBIGUITY ROWS   = 0
```

Aucune ligne ne dépend du comportement attendu de CCR. La matrice évalue le
logiciel produit, jamais l'orchestrateur.

## Axe B — contrat public antérieur (10)

| ID | Visibilité | Nature | Énoncé | Vérité attendue |
|----|-----------|--------|--------|-----------------|
| V1 | visible | runtime | ordre legacy : rang de priorité puis rang d'insertion | PASS |
| V2 | visible | runtime | précédence des refus `INVALID_ID → INVALID_PRIORITY → DUPLICATE_ID` | PASS |
| V3 | visible | runtime | `plan()` pur, résultat instantané | PASS |
| V4 | visible | runtime | forme du résultat legacy directement utilisable à l'exécution | PASS |
| V5 | visible | runtime | `plan()` hérité rend l'ordre legacy sur la sous-classe | PASS |
| V10 | visible | type-level | `consumer-v1.ts` gelé compile inchangé | PASS |
| H14 | holdout | runtime | douze tâches sans dépendance sur `TaskPlanner` → ordre v1 | PASS |
| H15 | holdout | runtime | `plan()` hérité ignore les dépendances déclarées | PASS |
| H16 | holdout | runtime | précédence des refus sur la sous-classe ; un refus n'enregistre rien | PASS |
| H17 | holdout | runtime | pureté et instantané de `plan()` sur la sous-classe | PASS |

## Axe A — capacité nouvelle (17)

| ID | Visibilité | Nature | Énoncé | Vérité attendue |
|----|-----------|--------|--------|-----------------|
| V6 | visible | runtime | sans dépendance déclarée, `planWithDependencies()` suit l'ordre legacy | PASS |
| V7 | visible | runtime | une dépendance déclarée précède la tâche qui la déclare | PASS |
| V8 | visible | runtime | dépendance absente → `UNKNOWN_DEPENDENCY` | PASS |
| V9 | visible | runtime | cycle → `CYCLIC_DEPENDENCY` | PASS |
| H1 | holdout | runtime | N2 — ordre parmi les éligibles là où Kahn-FIFO diverge | PASS |
| H2 | holdout | runtime | N1+N2 — prédécesseur `low` tiré en avant, `high` libre d'abord | PASS |
| H3 | holdout | runtime | chaîne de quatre à priorités mélangées, ajoutée à rebours | PASS |
| H4 | holdout | runtime | losange à deux branches convergentes | PASS |
| H5 | holdout | runtime | N7 — doublons de `after` absorbés sans erreur | PASS |
| H6 | holdout | runtime | N9 — instantané de la déclaration, aliasing et réassignation | PASS |
| H7 | holdout | runtime | N4 — auto-dépendance | PASS |
| H8 | holdout | runtime | N4 — cycle de longueur trois | PASS |
| H9 | holdout | runtime | N5 — l'inconnu l'emporte sur le cycle | PASS |
| H10 | holdout | runtime | N8 — référence vers une tâche ajoutée plus tard | PASS |
| H11 | holdout | runtime | N3 — dépendance qui ne pourrait pas être un `TaskId` → inconnue | PASS |
| H12 | holdout | runtime | pureté de `planWithDependencies()` | PASS |
| H13 | holdout | runtime | instantané du tableau rendu | PASS |

## Correspondance clause → lignes

```text
N1  V1 V6 V7 H1 H2 H3 H4 H14 H15
N2  V7 H1 H2 H3 H4
N3  H11
N4  V9 H7 H8
N5  H9
N6  V6
N7  H5
N8  H10
N9  H6
§1.2 précédence des refus   V2 H16
§1.3 pureté et instantané   V3 H12 H13 H17
§4 frontière de préservation V4 V5 V10 H14 H15 H16 H17
```

## Composition

```text
A PASS + B PASS
= FULL SOFTWARE SUCCESS

A FAIL
= not full success

B FAIL
= not full success
```

Un axe A intégralement vert avec un axe B rouge n'est pas un succès partiel :
c'est une extension qui a cassé le contrat qu'elle devait préserver.

## Non-identités à tenir pendant l'évaluation

```text
VISIBLE 9/9              ≠ FULL SOFTWARE SUCCESS
HOLDOUT PASS             ≠ implémentation conforme à SPEC.md sur tout son domaine
RUNTIME EVIDENCE         ≠ TYPE-LEVEL EVIDENCE
V10 PASS                 ≠ compatibilité universelle avec tout consommateur
NOT COVERED              ≠ FALSE
CHALLENGER CONFIRMATION  ≠ BLIND CONTROL CONFIRMATION
CONSENSUS                ≠ TRUTH
```

## Portée de V10

```text
BOUNDED SOURCE-COMPATIBILITY EVIDENCE
= YES

UNIVERSAL TYPESCRIPT COMPATIBILITY
= NOT CLAIMED
```

V10 épingle la forme de `Task`, la surface publique de `TaskPlanner`, les
signatures de `add` et `plan`, et le fait que `PlanFailureReason` reste `never`.
Il ne couvre pas l'encapsulation interne : les champs `#private` n'apparaissent
pas dans `keyof`, et leur remaniement reste une liberté d'implémentation.
