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
ÉTAT     cas expérimental terminé
```

[`cases/case-003-task-planner-dependency-extension/`](cases/case-003-task-planner-dependency-extension/)

Ce cas ajoute au protocole une sonde de compatibilité source gelée et visible du
participant, un bras de comparaison aveugle conduit sans CCR, et une chaîne
d'outils TypeScript figée par un `package-lock.json` versionné.

### CASE-004 — Stable Ranking Cost-Bound Refactor

```text
FORME    optimisation bornée, préservant le comportement
ÉTAT     exécution expérimentale terminée
```

[`cases/case-004-stable-ranking-cost-bound-refactor/`](cases/case-004-stable-ranking-cost-bound-refactor/)

Premier cas dont le point de départ est **comportementalement correct** : rien
n'y a été semé, et l'axe comportemental passe dès le premier instant. Ce qui
manque est une borne de travail à tenir sans rien changer d'observable. Le cas
ajoute un troisième axe distinct de la matrice de vérité — un verrou de
conformité à la tâche — et une revue d'efficacité procédurale conduite après
l'évaluation.

### CASE-005 — Bounded Concurrency Task Pool

```text
FORME    implémentation asynchrone bornée, à partir d'un squelette
ÉTAT     cas expérimental terminé
```

[`cases/case-005-bounded-concurrency-task-pool/`](cases/case-005-bounded-concurrency-task-pool/)

Premier cas dont la difficulté porte sur l'**ordonnancement** plutôt que sur la
logique métier : le contrat dit ce qui doit démarrer, quand, dans quel ordre, et
surtout ce qui ne doit jamais démarrer. Il ajoute au protocole une preuve de
non-progression qui ne repose sur aucun délai — chaque ligne de vérité sensible
à la vivacité s'exécute dans un processus isolé dont la fin naturelle est un
fait, là où le watchdog opérationnel ne prononce jamais qu'un `INCONCLUSIVE`.

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
- [`09-TOOLING-EXPERIMENT-001-PROGRAM-STATE.md`](09-TOOLING-EXPERIMENT-001-PROGRAM-STATE.md) — prédéclaration gelée de la première expérience d'outillage du Lab : point de reprise d'état de programme durable.
- [`10-TOOLING-EXPERIMENT-001-AMENDMENT-001-DECISION-CREATION.md`](10-TOOLING-EXPERIMENT-001-AMENDMENT-001-DECISION-CREATION.md) — amendement 001 : création d'une décision, né du premier constat du dogfood réel.
- [`11-TOOLING-EXPERIMENT-001-AMENDMENT-002-EVIDENCE-SUPERSESSION-REFRESH.md`](11-TOOLING-EXPERIMENT-001-AMENDMENT-002-EVIDENCE-SUPERSESSION-REFRESH.md) — amendement 002 : supersession et rafraîchissement du soutien de preuve.
- [`12-TOOLING-EXPERIMENT-001-AMENDMENT-003-STREAM-CREATION.md`](12-TOOLING-EXPERIMENT-001-AMENDMENT-003-STREAM-CREATION.md) — amendement 003 : création d'un flux.
- [`13-TOOLING-EXPERIMENT-001-AMENDMENT-004-STREAM-OPEN-SEMANTICS.md`](13-TOOLING-EXPERIMENT-001-AMENDMENT-004-STREAM-OPEN-SEMANTICS.md) — amendement 004 : sens normatif de l'état de flux `OPEN`, sur un jeton déjà existant.
- [`14-TOOLING-EXPERIMENT-002-MISSION-OBJECT-V0.md`](14-TOOLING-EXPERIMENT-002-MISSION-OBJECT-V0.md) — autorité sémantique et littérale de Mission Object v0, pour la seconde expérience d'outillage : la représentation durable de mission.
- [`15-TOOLING-EXPERIMENT-002-DOGFOOD-001-EVALUATION.md`](15-TOOLING-EXPERIMENT-002-DOGFOOD-001-EVALUATION.md) — évaluation durable de DOGFOOD-001, premier usage réel de Mission Object v0.
- [`16-TOOLING-EXPERIMENT-001-SELECTION-PROVENANCE.md`](16-TOOLING-EXPERIMENT-001-SELECTION-PROVENANCE.md) — provenance du fait humain qui soutient une décision de sélection déjà existante.
- [`17-TOOLING-EXPERIMENT-002-DOGFOOD-002-EVALUATION.md`](17-TOOLING-EXPERIMENT-002-DOGFOOD-002-EVALUATION.md) — évaluation durable de DOGFOOD-002.
- [`19-TOOLING-EXPERIMENT-002-DOGFOOD-003-EVALUATION.md`](19-TOOLING-EXPERIMENT-002-DOGFOOD-003-EVALUATION.md) — évaluation durable de DOGFOOD-003, et synthèse des preuves d'usage réel.
- [`20-TOOLING-EXPERIMENT-002-CONCLUSION.md`](20-TOOLING-EXPERIMENT-002-CONCLUSION.md) — conclusion de la seconde expérience d'outillage, et réponse à sa question expérimentale.
- [`21-TOOLING-EXPERIMENT-001-PHASE-D-SELECTION.md`](21-TOOLING-EXPERIMENT-001-PHASE-D-SELECTION.md) — sélection de la phase D de TOOLING-EXPERIMENT-001 comme direction suivante du Lab.
- [`22-TOOLING-EXPERIMENT-003-SELECTION.md`](22-TOOLING-EXPERIMENT-003-SELECTION.md) — sélection de la troisième expérience d'outillage, sa question et ses limites.
- [`23-TOOLING-EXPERIMENT-003-RESULT-INSTANCE-V0.md`](23-TOOLING-EXPERIMENT-003-RESULT-INSTANCE-V0.md) — autorité sémantique de Result Instance v0, et prédéclaration expérimentale.
- [`24-TOOLING-EXPERIMENT-003-RESULT-INSTANCE-V0-IMPLEMENTATION-DESIGN.md`](24-TOOLING-EXPERIMENT-003-RESULT-INSTANCE-V0-IMPLEMENTATION-DESIGN.md) — design d'implémentation normatif de Result Instance v0.
- [`25-TOOLING-EXPERIMENT-003-RESULT-INSTANCE-V0-IMPLEMENTATION-QUALIFICATION.md`](25-TOOLING-EXPERIMENT-003-RESULT-INSTANCE-V0-IMPLEMENTATION-QUALIFICATION.md) — record de qualification de l'implémentation d'origine, préservé et supersédé en portée exacte par l'autorité 26.
- [`26-TOOLING-EXPERIMENT-003-CORRECTIVE-HISTORICAL-QUALIFICATION.md`](26-TOOLING-EXPERIMENT-003-CORRECTIVE-HISTORICAL-QUALIFICATION.md) — qualification historique corrective : autorité de qualification courante de Result Instance v0.
- [`27-TOOLING-EXPERIMENT-003-FIRST-LIVE-DOGFOOD-TASK-SELECTION.md`](27-TOOLING-EXPERIMENT-003-FIRST-LIVE-DOGFOOD-TASK-SELECTION.md) — sélection et périmètre gelé de la première tâche de dogfood en usage réel.
- [`28-TOOLING-EXPERIMENT-003-FIRST-LIVE-DOGFOOD-DESIGN.md`](28-TOOLING-EXPERIMENT-003-FIRST-LIVE-DOGFOOD-DESIGN.md) — conception du premier dogfood en usage réel.
- [`29-TOOLING-EXPERIMENT-003-LIVE-DOGFOOD-RESUMPTION-SEQUENCING-CORRECTION.md`](29-TOOLING-EXPERIMENT-003-LIVE-DOGFOOD-RESUMPTION-SEQUENCING-CORRECTION.md) — correction du séquençage durable de reprise, supersédant l'autorité 28 sur la base cible et sur l'action durable, et là seulement.
- [`30-TOOLING-EXPERIMENT-003-FIRST-LIVE-DOGFOOD-QUALIFICATION-AND-CONCLUSION.md`](30-TOOLING-EXPERIMENT-003-FIRST-LIVE-DOGFOOD-QUALIFICATION-AND-CONCLUSION.md) — qualification finale du premier dogfood en usage réel et conclusion de TOOLING-EXPERIMENT-003 : tâche README PASS, dogfood PASS WITH LIMITATIONS, question sélectionnée répondue positivement pour le périmètre éprouvé, et clôture par décision de gouvernance humaine — un PASS ne ferme jamais un flux de lui-même.
- [`31-LOCAL-MISSION-CONSOLE-V0-PROGRAM-DIRECTION-SELECTION.md`](31-LOCAL-MISSION-CONSOLE-V0-PROGRAM-DIRECTION-SELECTION.md) — sélection de la direction de programme suivante : une petite console web locale v0 pour suivre une mission dans un dépôt, avec son périmètre produit gelé ; conception technique et implantation non commencées, et aucune nouvelle expérience d'outillage sélectionnée.
- [`32-LOCAL-MISSION-CONSOLE-V0-IMPLEMENTATION-DESIGN.md`](32-LOCAL-MISSION-CONSOLE-V0-IMPLEMENTATION-DESIGN.md) — conception d'implémentation gelée et ratifiée de la console : trois panneaux, autorité de dépôt en lecture seule, modèle de capture unique et d'identité, liaison à la version de mission, sémantique d'association, résolution de preuve bornée au contexte et frontières de sécurité du navigateur ; classée intégration ordinaire, sans nouvelle expérience d'outillage requise pour la v0.

## Outillage

Outils que le Lab s'applique à lui-même, sur sa propre conduite. Aucun n'est un composant de CCR System, ni une exigence pesant sur lui.

- [`tooling/program-state/`](tooling/program-state/) — TOOLING-EXPERIMENT-001 : point de reprise d'état de programme durable. Trois commandes — `resume` · `check` · `update`. Aucune dépendance externe, aucune mutation Git, aucun réseau.
- [`tooling/mission-object/`](tooling/mission-object/) — TOOLING-EXPERIMENT-002 : représentation durable de mission. L'outil charge un Mission Object, le valide et en rend l'enveloppe. Représenter n'est pas exécuter : il n'ordonnance rien et n'exécute aucune mission.
- [`tooling/result-instance/`](tooling/result-instance/) — TOOLING-EXPERIMENT-003 : représentation durable de l'instance réelle de retour / résultat de mission. L'outil charge une instance de résultat, en valide la structure et les types, et la confronte mécaniquement au contrat de retour prospectif de son objet de mission. Consigner n'est pas qualifier : rapporté n'est pas vrai.
- [`tooling/console/`](tooling/console/) — LOCAL MISSION CONSOLE V0 : console web locale, en lecture seule, pour suivre une mission dans un dépôt. Trois panneaux — état du Lab · mission · résultat. Elle capture chaque artefact une fois, en calcule l'identité en Node sur ces octets-là, lie tout résultat à la version de mission affichée, et borne la résolution de preuve aux localisateurs portés par le résultat. Afficher n'est pas vérifier : la vérification des preuves de PROGRAM-STATE n'est pas exécutée, et une identité de preuve n'est pas un fait vrai. Aucune dépendance externe, aucune mutation du dépôt, aucune mutation Git, aucun réseau sortant.

## État courant

```text
CCR SYSTEM
= external dependency / subject of observation
= not modified by default

CASE-001
= closed, experimental execution complete

CASE-002
= closed, experimental execution complete

CASE-003
= closed, experimental execution complete
= Layer A : baseline 27/27, CCR 27/27, no software winner
= Layer B : CCR quota-exhausted at 24/24, no natural convergence
= Layer C : public F1/F2 consumption PASS
= no CCR System product follow-up justified

CASE-004
= closed
= Layer A : baseline 26/26, CCR 26/26, T1 PASS both, no software winner
= Layer B : declared 32-invocation budget consumed, pending transfer
= Layer C : public F1/F2 consumption PASS, 31 durable activities
= procedural efficiency review : no native canonical termination reachable
  on the audited v1.1.0 native path
= CCR System product follow-up : P3 settled outside CASE-004, answered by
  CCR v1.2.0 ; the v1.1.0 finding itself is preserved, not revised

CASE-005
= closed, experimental execution complete   (2026-09-08)
= Layer A : baseline 30/30, CCR 30/30, T1/T2/T3 PASS both, no software winner
= per-row verdicts identical, final-outcome difference 0/30
= Layer B : declared 16-invocation budget, 12 consumed, voluntary stop,
  pending transfer, no native termination required
= Layer C : public F1/F2 consumption PASS, 11 durable activities
= observed CCR instrument : source 8993cbe, package 1.2.0, release line v1.2.0
= no rerun, no remediation, no extra probes

POST-CASE-005 REAL-CONSUMER WORK
= reconciled, closed
= AGENT CCR LAB #11 : R1/R2/P real consumer use on v1.4.0, closed
  → prospective-effect gap observed, see O-011
= AGENT CCR LAB #12 : fresh canonical v1.5.0 validation, closed
  → PASS WITH LIMITATIONS, no new product gap, see O-012
= AGENT CCR LAB #13 : open-ended real operator use on v1.5.0, closed
  → objective achieved, one real native handoff, no new material
    product friction, see O-013

LAB → CCR SYSTEM PRODUCT FEEDBACK
= 2 arcs
= arc 1 : CASE-005 Layer C authority gap → R1 · R2 · P → published v1.3.0
= arc 2 : #11 prospective-effect gap → P machine representation 2
  → published v1.5.0

CCR MAINTENANCE DETOUR
= closed
= CCR-System-native integration, QA, product repair, release and
  governance work
= not Lab experimental achievement, and not Lab→CCR product feedback

TOOLING EXPERIMENT 001
= durable program-state / resumption checkpoint
= IMPLEMENTED
= 4 ratified amendments : 10 · 11 · 12 · 13
= tooling/program-state
= phase D EXECUTED, 6/6 frozen criteria PASS
= result record : tooling/program-state/RESULT-001.md
= experimental question ANSWERED FOR THE TESTED SCOPE
= 1 resumption trial, universal resumption reliability not asserted

TOOLING EXPERIMENT 002
= durable mission representation
= CLOSED
= result : PASS WITH LIMITATIONS
= conclusion authority : 20-TOOLING-EXPERIMENT-002-CONCLUSION.md
= 3 real dogfood executions, each with its own durable evaluation : 15 · 17 · 19
= Mission Object v0 schema gap : not demonstrated

MISSION OBJECT v0
= IMPLEMENTED AND QUALIFIED
= semantic and literal authority :
  14-TOOLING-EXPERIMENT-002-MISSION-OBJECT-V0.md
= tooling/mission-object

TOOLING EXPERIMENT 003
= durable mission result / return instance representation
= CLOSED
= selected experimental question ANSWERED POSITIVELY FOR THE TESTED SCOPE
= final qualification / conclusion authority :
  30-TOOLING-EXPERIMENT-003-FIRST-LIVE-DOGFOOD-QUALIFICATION-AND-CONCLUSION.md
= closed by human governance decision ; a PASS does not close a stream by itself
= a Lab experiment on its own conduct, not a CCR System requirement

RESULT INSTANCE v0
= IMPLEMENTED AND STRUCTURALLY QUALIFIED
= semantic authority :
  23-TOOLING-EXPERIMENT-003-RESULT-INSTANCE-V0.md
= implementation design authority :
  24-TOOLING-EXPERIMENT-003-RESULT-INSTANCE-V0-IMPLEMENTATION-DESIGN.md
= historical qualification authority :
  26-TOOLING-EXPERIMENT-003-CORRECTIVE-HISTORICAL-QUALIFICATION.md
= historical return-provenance qualification : positive but narrow
= tooling/result-instance

LIVE-USE CAPTURE BY AN EXECUTOR
= TESTED
= first real live dogfood : PASS WITH LIMITATIONS
= one genuine Mission-Object-backed README-maintenance mission
= executor-produced Result Instance, validated and frozen before qualification
= exact-byte durable persistence : demonstrated for that mission
= downstream factual recovery from a sealed input packet : demonstrated for that mission
= not exercised in live use : partial-execution fidelity,
  protocol-backed capture, structural non-production
= real missions exercised 1 · real task classes exercised 1
= universal Result Instance reliability : not asserted

CURRENT PROGRAM DIRECTION
= LOCAL MISSION CONSOLE V0
= HUMAN-SELECTED
= small local web console to follow one Lab mission in one repository
= product scope : FROZEN
  31-LOCAL-MISSION-CONSOLE-V0-PROGRAM-DIRECTION-SELECTION.md
= technical design : FROZEN / RATIFIED
  32-LOCAL-MISSION-CONSOLE-V0-IMPLEMENTATION-DESIGN.md
= implementation class : ORDINARY INTEGRATION
= concrete semantic gap : 0
= new tooling experiment : NOT REQUIRED FOR V0
= implementation : PRESENT
= tooling/console
= implementation qualification : PENDING INDEPENDENT ORCHESTRATION /
  COUNTER-EXPERT REVIEW
= real-use utility : NOT DEMONSTRATED
= no future genuine mission selected
= next : qualify the implementation against authority 32

CURRENT LAB STREAM
= NONE
= no next tooling experiment human-selected

LAB ROADMAP
= open
= usage-led
```

Les runs sont conduits dans des workspaces jetables, frais et isolés, créés hors de ce dépôt à partir du seul pack `participant/`. Ni ces workspaces, ni les candidats gelés, ni les copies d'évaluation n'entrent dans le dépôt : seuls les records les décrivent.

## Correction de trajectoire v3

La v3 corrige une ambiguïté de la fondation initiale : le workflow industriel externe est désormais explicitement **contextuel uniquement**. `RUN-001` commence au premier vrai `ccr start` et doit utiliser les rôles natifs `author` / `challenger`. Voir [`08-PRE-RUN-DERAILMENT-001.md`](08-PRE-RUN-DERAILMENT-001.md).
