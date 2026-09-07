# CASE-004 — Stable Ranking Cost-Bound Refactor

```text
FORME    optimisation bornée, préservant le comportement
CLASSE   bounded behavior-preserving optimization / internal refactor
ÉTAT     exécution expérimentale terminée — matérialisée documentairement
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

## Résultat

Le détail appartient aux records ; ce bloc ne le duplique pas.

```text
CASE EXPERIMENTAL EXECUTION = COMPLETE

LAYER A       = PASS
                baseline 26/26  ·  CCR 26/26
                axe A 17/17 et axe B 9/9 des deux côtés
                T1 PASS des deux côtés — hors des 26 lignes
                SOFTWARE WINNER = NONE
                POST-FREEZE REMEDIATION = 0

LAYER B       = budget déclaré de 32 invocations consommé
                TERMINATION OBSERVED = CCR_INVOCATION_QUOTA_EXCEEDED
                PENDING TRANSFER = YES · HUMAN_SEND = 0
                CCR PROCEDURAL SUCCESS = NOT CLAIMED

LAYER C       = PASS
                F1 découverte sémantique publique UNIQUE
                F2 AVAILABLE, 31 activités durables, stabilité PASS

REVUE D'EFFICACITÉ PROCÉDURALE = COMPLETE
                aucune terminaison canonique native n'est atteignable
                sur le chemin natif v1.1.0 audité

SUIVI PRODUIT CCR SYSTEM = candidat P3, décision humaine en attente
```

```text
T1                       ≠ 27e ligne de vérité
31 ACTIVITÉS DURABLES F2 ≠ 32 INVOCATIONS CCR
LAYER A ÉGALITÉ 26/26    ≠ déclaration de vainqueur
```

Records détaillés :
[`RUN-001-RECORD.md`](RUN-001-RECORD.md) pour la chronologie du run et la
provenance, [`BASELINE-RECORD.md`](BASELINE-RECORD.md) pour le bras aveugle,
[`EVALUATION.md`](EVALUATION.md) pour le résultat officiel, la revue
d'efficacité procédurale et le statut de P3,
[`PUBLIC-CONSUMPTION.md`](PUBLIC-CONSUMPTION.md) pour la consommation
machine publique.

```text
CASE-004
= DOCUMENTARILY MATERIALIZED
= READY FOR CLOSURE AUDIT
```
