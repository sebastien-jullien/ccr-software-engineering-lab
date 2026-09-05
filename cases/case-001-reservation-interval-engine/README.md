# CASE-001 — Reservation Interval Engine

Ce dossier contient la première expérience exécutable de **CCR Software Engineering Lab**.

## Séparation du dossier

```text
participant/
= seul paquet à donner aux agents pendant le run

control/
= vérité externe / holdouts / oracle
= ne pas exposer aux participants avant la fin

RUNBOOK.md
= protocole opérateur du cas

EVALUATION.md
= comparaison finale et classification des observations
```

Le cas ne cherche pas à faire échouer CCR. Il fournit une tâche logicielle petite mais réelle, dont le résultat peut être vérifié indépendamment.

## Runtime

```text
LANGUAGE
= TypeScript

RUNTIME
= Node.js >= 22

RUNTIME DEPENDENCIES
= 0

TEST RUNNER
= node:test
```

## Règle de non-contamination

Ce cas est un consommateur expérimental de CCR. Les rôles, séquences ou besoins rencontrés ici ne deviennent pas automatiquement des concepts ou des exigences de CCR System.
