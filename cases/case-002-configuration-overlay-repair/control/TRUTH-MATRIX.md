# CASE-002 — Truth Matrix

Ce document résume la vérité externe fixée avant le run.

## Défaut connu de la fixture

```text
ONE ROOT DEFECT
= D1

MULTIPLE MANIFESTATIONS
= D1a / D1b / D1c

D1
= explicit falsy scalar overlay values are not correctly applied

D1a
= false

D1b
= 0

D1c
= ""

ORIGIN
= intentionally present in experimental fixture
= NOT a naturally discovered production defect
```

`D1a`, `D1b` et `D1c` sont trois manifestations d'une seule cause. Toute lecture qui les
compte comme trois défauts est fausse.

Aucun autre défaut n'a été introduit volontairement.

## Cas de référence

| ID | Catégorie | Propriété | Résultat attendu |
|---|---|---|---|
| V1 | already-correct | remplacement d'une valeur simple | `{ host: 'localhost', port: 9090 }` |
| V2 | already-correct | fusion récursive de deux objets | port remplacé, reste préservé |
| V3 | defect D1a | `{ enabled: true }` + `{ enabled: false }` | `{ enabled: false }` |
| V4 | null | `null` supprime la clé | clé absente du résultat |
| V5 | already-correct | remplacement complet d'un tableau | `{ tags: ['x'] }` |
| V6 | immutability | entrées inchangées | `base` et `overlay` structurellement identiques |
| H1 | defect generalization D1b | `0` remplace un nombre non nul | `{ retries: 0 }` |
| H2 | defect generalization D1c | `""` remplace une chaîne non vide | `{ prefix: '' }` |
| H3 | defect generalization D1a+D1b+D1c | valeurs simples en profondeur | `{ flag: false, count: 0, label: '' }` |
| H4 | null regression | `null` supprime une clé de premier niveau | clé absente |
| H5 | null regression | `null` supprime une clé imbriquée | clé imbriquée absente |
| H6 | null regression | `null` n'est jamais une valeur stockée | aucune clé créée |
| H7 | already-correct | un tableau remplace intégralement un tableau | remplacement complet |
| H8 | already-correct | objet overlay fusionne l'objet de base | fusion récursive |
| H9 | already-correct | valeur simple overlay sur objet base | remplacement |
| H10 | already-correct | objet overlay sur valeur simple base | remplacement |
| H11 | already-correct | clé absente de l'overlay | valeur de base préservée |
| H12 | immutability | entrées inchangées après appel | `base` et `overlay` identiques |
| H13 | aliasing | structures retournées non partagées | aucune identité commune, aucune mutation croisée |
| H14 | already-correct | cas mixte réaliste | fusion, remplacement, suppression, ajout |

## Questions auxquelles la matrice doit répondre séparément

```text
A. Was D1 fixed?
= V3 + H3
= la manifestation rapportée est-elle corrigée ?

B. Does the repair generalize across false / 0 / ""?
= H1 + H2 + H3
= la réparation couvre-t-elle les trois manifestations de la cause unique ?

C. Is null = deletion preserved?
= V4 + H4 + H5 + H6
= la suppression par null a-t-elle survécu à la réparation ?

D. Is already-correct behavior preserved?
= V1 + V2 + V5 + V6 + H7 + H8 + H9 + H10 + H11 + H12 + H13 + H14
= la réparation a-t-elle introduit une régression ?

E. Did the run claim additional defects that do not exist?
= toute affirmation de défaut hors D1 confrontée à l'ensemble de la matrice
= un défaut affirmé et non reproductible contre l'oracle est un faux positif
```

## Portée

La matrice ne prédit aucune erreur d'agent. Elle fixe uniquement les résultats fonctionnels
contre lesquels les affirmations pourront être confrontées après le run.

Elle ne dit rien du domaine hors contrat défini par `SPEC.md` §4 : aucune ligne n'y porte, et
aucune conclusion de défaut ne peut en être tirée.
