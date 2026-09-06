# CCR Software Engineering Lab

> Laboratoire de R&D pour concevoir, exécuter et évaluer des expériences de génie logiciel avec CCR.

## Objet

**CCR Software Engineering Lab** est un projet expérimental séparé de **CCR System**.

Son but est d'utiliser CCR sur des cas de génie logiciel réels ou réalistes, autonomes et vérifiables, afin de :

1. produire un travail utile ;
2. observer le comportement réel de CCR sous contradiction ;
3. recueillir des données de terrain sur ses limites ;
4. distinguer les frictions propres à CCR des limites du cas ou du consommateur ;
5. laisser les besoins futurs de CCR émerger de l'usage plutôt que d'une roadmap spéculative.

Ce projet n'est pas une nouvelle doctrine CCR, ni le futur système industriel d'orchestration de développement.

## Principe directeur

> **CCR System doit rester autonome. Le Lab peut utiliser CCR, mais ne doit pas dicter sa conception.**

Une friction rencontrée ici ne devient pas automatiquement une évolution de CCR.

```text
REAL USE
→ OBSERVED FRICTION
→ DEMONSTRATED CONSEQUENCE
→ AUTHORITY / CONTRACT ANALYSIS
→ EXISTING-SURFACE SUFFICIENCY CHECK
→ HUMAN PRODUCT DECISION
→ IMPLEMENTATION IF JUSTIFIED
```

## Ce que le Lab cherche à observer

1. **Compréhension des chaînes longues** — après plusieurs désaccords, peut-on reconstruire ce qui a été affirmé, réfuté, maintenu ou modifié, et pourquoi ?
2. **Traçabilité des preuves** — une affirmation importante peut-elle être reliée aux éléments qui la soutiennent, l'affaiblissent ou ne suffisent pas à l'établir ?
3. **Frontière de décision** — CCR distingue-t-il correctement faits, inférences, incertitudes, jugements de valeur et décision humaine ?
4. **Consommabilité externe** — un consommateur indépendant peut-il récupérer les faits durables utiles via les surfaces publiques de CCR, sans connaissance des internes ?

## Cas

Chaque cas est un micro-projet autonome et vérifiable, exécuté comme un **vrai run CCR**, avec les rôles natifs `author` / `challenger` et leurs sessions gérées par CCR. Le Lab ne reproduit pas manuellement le workflow industriel externe.

Un cas est organisé selon le même protocole :

```text
participant/     seul matériel visible pendant le travail principal
control/         oracle indépendant, holdouts et matrice de vérité, aveugles
                 jusqu'à la clôture intellectuelle
RUNBOOK.md       protocole opérateur du cas
RUN-001-RECORD   chronologie du run et faits établis
EVALUATION.md    comparaison finale et classification des observations
```

### CASE-001 — Reservation Interval Engine

```text
FORME    squelette à implémenter
ÉTAT     cas expérimental terminé
```

[`cases/case-001-reservation-interval-engine/`](cases/case-001-reservation-interval-engine/)

### CASE-002 — Configuration Overlay Repair

```text
FORME    base de code existante imparfaite → diagnostic → réparation bornée
ÉTAT     cas expérimental terminé
```

[`cases/case-002-configuration-overlay-repair/`](cases/case-002-configuration-overlay-repair/)

Ce cas ajoute deux documents au protocole : [`PREQUALIFICATION.md`](cases/case-002-configuration-overlay-repair/PREQUALIFICATION.md), qui qualifie l'oracle et la sensibilité du control avant tout run, et [`FREEZE-MANIFEST.md`](cases/case-002-configuration-overlay-repair/FREEZE-MANIFEST.md), qui fige les deux paquets par empreinte.

### CASE-003 — Task Planner Dependency Extension

```text
FORME    extension de capacité rétrocompatible sur une base saine
ÉTAT     paquet matérialisé et préqualifié — exécution non commencée
```

[`cases/case-003-task-planner-dependency-extension/`](cases/case-003-task-planner-dependency-extension/)

Ce cas ajoute au protocole une sonde de compatibilité source gelée et visible du
participant, et fige sa chaîne d'outils TypeScript par un `package-lock.json`
versionné. Aucune exécution expérimentale n'a commencé.

Les résultats, les incertitudes résiduelles et les non-conclusions de chaque cas appartiennent à ses propres documents. Ce README ne les résume pas.

## Documents

- [`00-CHARTER.md`](00-CHARTER.md) — charte du projet.
- [`01-RELATION-TO-CCR.md`](01-RELATION-TO-CCR.md) — séparation stricte entre le Lab et CCR System.
- [`02-REAL-USE-PROTOCOL.md`](02-REAL-USE-PROTOCOL.md) — protocole de conduite d'un usage réel.
- [`03-CASE-001-RESERVATION-INTERVAL-ENGINE.md`](03-CASE-001-RESERVATION-INTERVAL-ENGINE.md) — cadrage de CASE-001.
- [`04-OBSERVATION-RECORD.md`](04-OBSERVATION-RECORD.md) — grille de collecte des frictions, et observations enregistrées.
- [`05-CROSS-EXPERTISE-PATTERNS.md`](05-CROSS-EXPERTISE-PATTERNS.md) — phénomènes à observer sans les préprogrammer.
- [`06-EXTERNAL-INDUSTRIAL-WORKFLOW-CONTEXT.md`](06-EXTERNAL-INDUSTRIAL-WORKFLOW-CONTEXT.md) — contexte du workflow industriel externe ; **pas** un protocole d'exécution du Lab.
- [`07-CASE-001-EXECUTION-PLAN.md`](07-CASE-001-EXECUTION-PLAN.md) — décision d'exécution et bornes du premier usage réel.
- [`08-PRE-RUN-DERAILMENT-001.md`](08-PRE-RUN-DERAILMENT-001.md) — erreur d'orchestration antérieure au premier run, consignée comme telle : ce n'est ni une observation CCR, ni un résultat de CASE-001.

## État courant

```text
CCR SYSTEM
= external dependency / subject of observation
= not modified by default

CASE-001
= completed experimental case

CASE-002
= completed experimental case

CASE-003
= materialized and prequalified
= execution not started

LAB ROADMAP
= open
= usage-led
```

Les runs sont conduits dans des workspaces jetables, frais et isolés, créés hors de ce dépôt à partir du seul pack `participant/`. Ni ces workspaces, ni les candidats gelés, ni les copies d'évaluation n'entrent dans le dépôt : seuls les records les décrivent.

## Correction de trajectoire v3

La v3 corrige une ambiguïté de la fondation initiale : le workflow industriel externe est désormais explicitement **contextuel uniquement**. `RUN-001` commence au premier vrai `ccr start` et doit utiliser les rôles natifs `author` / `challenger`. Voir [`08-PRE-RUN-DERAILMENT-001.md`](08-PRE-RUN-DERAILMENT-001.md).
