# CASE-003 — Task Planner Dependency Extension

```text
FORME    extension de capacité rétrocompatible sur une base saine
ÉTAT     paquet matérialisé et préqualifié — non exécuté
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

## État

```text
CASE MATERIALIZATION       = COMPLETE
PREQUALIFICATION           = PASS
CASE EXECUTION             = NOT STARTED
CCR RUN                    = NOT STARTED
BLIND BASELINE             = NOT STARTED
PUBLIC MACHINE CONSUMPTION = NOT STARTED
```
