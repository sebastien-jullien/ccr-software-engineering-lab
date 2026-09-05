# Contexte externe — Workflow industriel de contre-expertise croisée

## 1. Statut — CONTEXT ONLY

Ce document décrit le **workflow manuel/industriel externe** qui a motivé une partie de la recherche.

Il sert uniquement à expliquer un contexte d'application possible de CCR.

```text
THIS DOCUMENT
= CONTEXT ONLY

NOT
= CASE EXECUTION PROTOCOL
= CCR RUN MODEL
= CCR ROLE MODEL
= LAB ORCHESTRATION INSTRUCTION
= CCR REQUIREMENT
```

En particulier, **CASE-001 ne doit pas être exécuté en reproduisant manuellement ce workflow**.

Le Lab doit faire traiter CASE-001 par **CCR System tel qu'il existe**, avec ses rôles et mécanismes natifs.

## 2. Rôles du workflow externe

Le système externe de référence utilise notamment :

```text
ORCHESTRATEUR
ANALYSTE
IMPLÉMENTATEUR
EXPERTISEUR
CONTRE-EXPERTISEUR
HUMAIN
```

Ces noms appartiennent au workflow externe. Ils ne sont pas des rôles CCR.

## 3. Action mandatée dans le workflow externe

Quand l'Orchestrateur lance une action d'analyse ou d'implémentation :

```text
ORCHESTRATEUR
→ message de réflexion / cadrage / lancement

SESSION D'ACTION
→ résultat de l'Analyste ou de l'Implémentateur

PAQUET À EXPERTISER
= message de l'Orchestrateur
+ résultat de l'action

EXPERTISEUR
→ expertise du paquet

CONTRE-EXPERTISEUR
→ reçoit le même paquet
+ l'expertise du paquet
→ contre-expertise

ORCHESTRATEUR
→ reçoit résultat
+ expertise
+ contre-expertise
→ décide de la suite
```

Le Contre-Expertiseur reçoit donc le paquet d'origine **et** l'expertise produite sur ce paquet.

## 4. Retour simple de l'Orchestrateur

```text
PAQUET À EXPERTISER
= retour de l'Orchestrateur seul

EXPERTISEUR
→ expertise du paquet

CONTRE-EXPERTISEUR
→ reçoit le même paquet
+ l'expertise précédente

ORCHESTRATEUR
→ reçoit résultat
+ expertise
+ contre-expertise
→ décide de la suite
```

## 5. Grain de transmission

Le workflow externe ne recopie pas cumulativement tout l'historique à chaque cycle.

```text
ACTION CYCLE
= message de lancement courant
+ réponse de la session courante

ORCHESTRATOR-ONLY CYCLE
= dernier retour de l'Orchestrateur
```

Les sessions conservent leur propre historique.

## 6. Persistance des sessions dans le workflow externe

Pour un chantier donné :

```text
ORCHESTRATEUR
= session persistante

EXPERTISEUR
= session persistante

CONTRE-EXPERTISEUR
= session persistante
```

Les sessions d'Analyse ou d'Implémentation peuvent être conservées pour le suivi de la même action ou multipliées pour des actions indépendantes/parallèles.

Encore une fois : **ce modèle ne décrit pas l'exécution de CASE-001 dans le Lab.**

## 7. Autorité et fiabilité recherchée

L'Orchestrateur conserve un réel pouvoir de décision opérationnelle. Les expertises servent à réduire les dérives, pas à créer un juge automatique.

Des motifs tels que les suivants sont possibles dans le workflow externe :

```text
ORCHESTRATOR ERROR
→ expertiser catches it

EXPERTISER ERROR
→ counter-expertiser catches it

EXPERTISER + COUNTER-EXPERTISER AGREE
→ orchestrator finds omitted fact

ALL MACHINE ROLES INSUFFICIENT
→ human intervention
```

La fiabilité recherchée est distribuée ; le consensus n'est pas assimilé à la vérité.

## 8. Problème manuel principal à éliminer dans une industrialisation

Aujourd'hui, l'humain peut assurer à la fois :

```text
HUMAN AUTHORITY
= arbitrage / cadrage / décision

HUMAN TRANSPORT
= copier le bon message
= associer la bonne réponse
= construire le bon paquet
= router vers la bonne session
```

L'industrialisation cherchera potentiellement à réduire le rôle de transport sans supprimer l'autorité et la supervision humaines.

## 9. Rapport à CCR System

La relation souhaitée est asymétrique :

```text
CCR SYSTEM
= general R&D system

EXTERNAL INDUSTRIAL WORKFLOW
= possible consumer / application pattern

EXTERNAL WORKFLOW NEED
≠ automatic CCR requirement
```

Le Lab doit observer si CCR peut être utile à ce type d'application **sans transformer CASE-001 en simulation manuelle de ce workflow**.
