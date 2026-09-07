# CASE-003 — Task Planner Dependency Extension

```text
FORME    extension de capacité rétrocompatible sur une base saine
CLASSE   bounded backward-compatible feature extension
ÉTAT     cas expérimental terminé
```

## Forme du cas

Les deux premiers cas du Lab portaient sur un squelette à implémenter
(CASE-001) et sur une base existante imparfaite à diagnostiquer et réparer
(CASE-002). CASE-003 change de forme : la base est **saine**, aucun défaut n'y a
été semé, et le travail consiste à **étendre** un contrat public sans le casser.

La question expérimentale n'est donc plus « le défaut est-il trouvé », mais
« l'extension préserve-t-elle ce qu'elle devait préserver, y compris au niveau
des types ».

## Structure

```text
participant/     seul matériel visible pendant le travail principal
control/         oracle indépendant, holdouts et matrice de vérité, aveugles
                 jusqu'à la clôture intellectuelle
RUNBOOK.md       protocole opérateur, dont la provenance de CCR System
PREQUALIFICATION.md   qualification de l'oracle, du fixture et des sondes
FREEZE-MANIFEST.md    empreintes des artefacts gelés
```

## Deux natures de preuve

Le cas sépare explicitement deux choses que les deux premiers cas n'avaient pas
eu à distinguer :

```text
RUNTIME EVIDENCE
≠ TYPE-LEVEL EVIDENCE
```

Un test d'exécution n'établit pas qu'un type public n'a pas été élargi. C'est le
rôle de `participant/consumer-v1.ts`, un consommateur TypeScript gelé qui doit
compiler sans une seule modification contre le fixture de départ comme contre le
candidat. Cette sonde est **visible** du participant : c'est une contrainte
énoncée, pas un piège.

## Comptes

```text
CONTRÔLES VISIBLES     10   V1..V9 d'exécution, V10 de compilation
HOLDOUTS               17   H1..H17
MATRICE DE VÉRITÉ      27 lignes
AXE A                  17   capacité nouvelle
AXE B                  10   contrat public antérieur
AMBIGUÏTÉS CONNUES     0
```

## Chaîne d'outils gelée

TypeScript est ici une source de vérité expérimentale, pas un simple outil. Il
est donc gelé comme le reste :

```text
typescript              5.8.3 exact, sans plage
package-lock.json       membre du paquet gelé
installation            npm ci
```

C'est un écart assumé avec CASE-001 et CASE-002, dont les paquets participant ne
portaient pas de lockfile.

## Résultat

Le détail appartient aux records ; ce bloc ne le duplique pas.

```text
CASE STATUS   = COMPLETE
CLASS         = bounded backward-compatible feature extension

LAYER A       = PASS
                baseline 27/27  ·  CCR 27/27
                visible 10/10, holdouts 17/17 des deux côtés
                SOFTWARE WINNER = NONE
                POST-FREEZE REMEDIATION = 0

LAYER B       = quota épuisé à 24/24
                TERMINATION = CCR_INVOCATION_QUOTA_EXCEEDED
                NATURAL CONVERGENCE = NO · PENDING TRANSFER = YES
                HUMAN_SEND = 0
                CCR PROCEDURAL SUCCESS = NOT CLAIMED

LAYER C       = PASS
                F1 découverte sémantique publique UNIQUE
                F2 AVAILABLE, 23 activités durables, stabilité PASS
                PUBLIC CONTRACT CONFORMANCE = PASS

AMBIGUÏTÉ DE SPÉCIFICATION = découverte, non bloquante
                sémantique de lecture répétée de Task.id / Task.priority
                lignes ambiguës de la matrice officielle = 0

SUIVI PRODUIT CCR SYSTEM   = AUCUN JUSTIFIÉ
```

```text
PROCEDURAL NON-CONVERGENCE   ≠ SOFTWARE FAILURE
SOFTWARE SUCCESS             ≠ PROCEDURAL CONVERGENCE
LAYER A ÉGALITÉ 27/27        ≠ déclaration de vainqueur
```

Records détaillés :
[`RUN-001-RECORD.md`](RUN-001-RECORD.md) pour la chronologie du run et la
provenance, [`BASELINE-RECORD.md`](BASELINE-RECORD.md) pour le bras aveugle,
[`EVALUATION.md`](EVALUATION.md) pour l'audit de validité et le résultat
officiel, [`PUBLIC-CONSUMPTION.md`](PUBLIC-CONSUMPTION.md) pour la
consommation machine publique.
