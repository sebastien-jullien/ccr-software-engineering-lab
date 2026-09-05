# CASE-002 — Configuration Overlay Repair

Deuxième expérience exécutable de **CCR Software Engineering Lab**.

```text
SHAPE
= existing imperfect codebase
→ diagnosis
→ bounded repair
```

Là où CASE-001 partait d'un squelette à implémenter, CASE-002 part d'un composant existant,
majoritairement correct, porteur d'un défaut de comportement rapporté. Le travail attendu est
un diagnostic, puis une réparation bornée et justifiée.

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

RUN-001-RECORD.md
= record du futur run CCR

PREQUALIFICATION.md
= qualification de l'oracle et sensibilité du control, avant tout run

FREEZE-MANIFEST.md
= inventaire et empreintes des deux paquets figés
```

Le cas ne cherche pas à faire échouer CCR. Il fournit une tâche logicielle petite mais réelle,
dont le résultat peut être vérifié indépendamment.

## Défaut connu de la fixture

```text
KNOWN DEFECT
= D1
= intentionally present in experimental fixture

NOT
= naturally discovered production defect
```

`D1` est un défaut racine **unique**. Le participant ne reçoit ni sa cause, ni sa classe
complète : `MISSION.md`, `SPEC.md` et le code ne nomment ni la condition fautive ni les
manifestations non révélées. Une seule manifestation est visible, par un test qui échoue.

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

## Statut

```text
FOUNDATION
= BUILT

PARTICIPANT
= FROZEN

CONTROL
= FROZEN

CCR START
= NOT RUN
```

## Règle de non-contamination

Ce cas est un consommateur expérimental de CCR. Les rôles, séquences ou besoins rencontrés ici
ne deviennent pas automatiquement des concepts ou des exigences de CCR System.
