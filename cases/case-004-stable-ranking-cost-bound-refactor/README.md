# CASE-004 — Stable Ranking Cost-Bound Refactor

```text
FORME    optimisation bornée, préservant le comportement
CLASSE   bounded behavior-preserving optimization / internal refactor
ÉTAT     paquet matérialisé et préqualifié — exécution non commencée
```

## Forme du cas

Les trois premiers cas du Lab portaient sur un squelette à implémenter
(CASE-001), une base imparfaite à diagnostiquer et réparer (CASE-002), et une
extension rétrocompatible d'un contrat public (CASE-003).

CASE-004 change encore de forme. Le point de départ est **comportementalement
correct** et le reste : aucun défaut n'y a été semé, et l'intégralité de l'axe
comportemental passe dès le premier instant. Ce qui manque est ailleurs — une
borne de travail à tenir sans rien changer d'observable.

La question expérimentale devient : **une optimisation préserve-t-elle
exactement ce qu'elle devait préserver**, et sait-on le démontrer autrement que
par l'absence d'erreur visible.

## Trois dimensions, aucune redondante

```text
AXE A   contrat comportemental        17 lignes
AXE B   borne de travail comparateur   9 lignes
T1      conformité à la règle de mission — hors matrice
```

Les contrôles négatifs de préqualification démontrent qu'aucune des trois n'est
superflue : sans l'axe A une implémentation instable, mutante, clonante ou
paresseuse passe ; sans l'axe B le point de départ passe ; sans T1 une
délégation au tri de l'hôte passe.

```text
LIGNES DE VÉRITÉ OFFICIELLE   = 26
VISIBLES                      = 11   A-V1..A-V9 + V10 V11
HOLDOUTS                      = 15   A-H1..A-H8 + H9..H15
```

## Contrat de coût

```text
comparison_count <= n * ceil(log2 n)
ceil(log2 n) = 32 - Math.clz32(n - 1)
```

```text
AFFIRMATION OFFICIELLE              conformité déterministe à une borne, sur la
                                    famille de workloads officielle gelée
COMPLEXITÉ ASYMPTOTIQUE             NON REVENDIQUÉE
EFFICACITÉ GÉNÉRALE À L'EXÉCUTION   NON REVENDIQUÉE
DÉPLACEMENTS, MÉMOIRE, CHRONO       NON MESURÉS
```

## Structure

```text
participant/          seul matériel visible pendant le travail principal
control/              références, holdouts, contrôles négatifs, T1 — aveugles
TRUTH-MATRIX.md       les 26 lignes officielles — control-private
RUNBOOK.md            protocole opérateur
PREQUALIFICATION.md   résumé borné et non sensible de la préqualification
FREEZE-MANIFEST.md    empreintes des artefacts gelés
```

## Chaîne d'outils gelée

```text
node          v22.18.0
typescript    5.8.3 exact, sans plage
lockfile      membre du paquet gelé
installation  npm ci
```

## État

```text
CASE MATERIALIZATION       = COMPLETE
PREQUALIFICATION           = PASS
CASE EXECUTION             = NOT STARTED
CCR RUN                    = NOT STARTED
BLIND BASELINE             = NOT STARTED
PUBLIC MACHINE CONSUMPTION = NOT STARTED
```
