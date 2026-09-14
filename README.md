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
- [`33-LOCAL-MISSION-CONSOLE-V0-INDEPENDENT-IMPLEMENTATION-QUALIFICATION.md`](33-LOCAL-MISSION-CONSOLE-V0-INDEPENDENT-IMPLEMENTATION-QUALIFICATION.md) — qualification indépendante de l'implémentation publiée de la console : PASS WITH LIMITATIONS, conformité fonctionnelle à l'autorité 32 établie, zéro défaut matériel, fidélité d'intégration historique byte-identique, frontières de sécurité et de lecture seule tenues, suite publiée remesurée 61/61 ; cinq limites non matérielles consignées, et l'utilité en usage réel reste non évaluée — conformité établie n'est pas utilité démontrée.
- [`34-DECISION-CONSEQUENCE-BOUNDARY-REAL-USE-MISSION-SELECTION.md`](34-DECISION-CONSEQUENCE-BOUNDARY-REAL-USE-MISSION-SELECTION.md) — sélection de la prochaine mission authentique du Lab : étudier la frontière durable entre décision humaine ratifiée, conséquence déterministe et conséquence effectivement exécutée, à partir de cas historiques réels ; objet premier R&D d'orchestration, console employée seulement comme surface d'observation secondaire en usage réel ; méthode preuve-d'abord, aucune implémentation pré-autorisée, aucune nouvelle expérience d'outillage, contrat de mission bornée non encore gelé.
- [`35-DECISION-CONSEQUENCE-BOUNDARY-BOUNDED-MISSION-FREEZE.md`](35-DECISION-CONSEQUENCE-BOUNDARY-BOUNDED-MISSION-FREEZE.md) — gel de la mission exécutable bornée : coupe du corpus historique, inventaire A–E exhaustif, cinq cas authentiques sélectionnés et leurs lignées factuelles, question de l'étude, vocabulaire de classification, porte d'écart concret en cinq parties, contrat de retour factuel, critères de succès, frontière de lecture / écriture de l'exécution, artefacts de mission gelés, et protocole d'observation de la console en usage réel ; l'étude est exécutable, sa conclusion n'est pas écrite.
- [`36-LOCAL-MISSION-CONSOLE-V0-REAL-USE-OBSERVATION-CAPTURE-PROTOCOL.md`](36-LOCAL-MISSION-CONSOLE-V0-REAL-USE-OBSERVATION-CAPTURE-PROTOCOL.md) — réparation déterministe du protocole secondaire : destination durable des observations d'usage réel de la console, produites par l'humain ou l'orchestrateur et tenues séparées du retour de l'exécutant ; inventaire des surfaces existantes, artefact local à la mission retenu, champs exacts, cycle de vie par étape et sémantique de durabilité. Un record d'observation n'est pas une qualification d'utilité.
- [`37-DECISION-CONSEQUENCE-BOUNDARY-RESULT-PANEL-C-DURABILITY-ORDERING.md`](37-DECISION-CONSEQUENCE-BOUNDARY-RESULT-PANEL-C-DURABILITY-ORDERING.md) — réparation déterministe d'ordonnancement : l'observation du panneau C ne devient durable qu'après la matérialisation durable du résultat qu'elle a observé ; producteur sémantique et enregistreur Git distingués sur le précédent de persistance de TE003, porte de persistance, invariant d'octets exacts, séquençage des commits futurs et reprise après interruption. Persister le retour réel n'est pas le qualifier.
- [`38-DECISION-CONSEQUENCE-BOUNDARY-PRIMARY-STUDY-AND-CONSOLE-REAL-USE-QUALIFICATION.md`](38-DECISION-CONSEQUENCE-BOUNDARY-PRIMARY-STUDY-AND-CONSOLE-REAL-USE-QUALIFICATION.md) — deux qualifications tenues séparées : l'étude historique primaire PASS WITH LIMITATIONS, avec 76 champs soutenus, 4 soutenus avec limitation évidentielle, aucun contredit, 15 jointures reproductibles sans invention sémantique et aucun écart concret de représentation démontré ; et l'usage réel de la console MIXED UTILITY, avec U-01 découvrabilité par énumération comme seul finding qualifié, classé limitation conforme. Observation n'est pas finding, et finding n'est pas remédiation.
- [`39-LOCAL-MISSION-CONSOLE-V0-U01-PRODUCT-RESPONSE-SELECTION.md`](39-LOCAL-MISSION-CONSOLE-V0-U01-PRODUCT-RESPONSE-SELECTION.md) — disposition humaine de U-01 : remédiation bornée de découvrabilité, classée intégration produit ordinaire, pour que les artefacts authentiques de mission et de résultat entrent dans le flux normal de sélection des panneaux B et C. Objectif borné et exclusions gelés ; aucune conception technique, aucune racine de candidats choisie, aucune implémentation autorisée, autorité 32 non rouverte, risque de fin de ligne tenu séparé.
- [`40-LOCAL-MISSION-CONSOLE-V0-U01-BOUNDED-DISCOVERY-REMEDIATION-DESIGN.md`](40-LOCAL-MISSION-CONSOLE-V0-U01-BOUNDED-DISCOVERY-REMEDIATION-DESIGN.md) — conception bornée et déterministe de la remédiation : chaîne de découverte reconstruite depuis le code publié, cause racine gelée — couverture de racines uniquement, le filtre existant classant déjà correctement les quatre fichiers de la mission — conception minimale retenue, sémantique de candidats après remédiation, invariants de l'autorité 32 préservés, surface d'implémentation exacte, critères d'acceptation positifs et négatifs, plan de test, pare-feu de fin de ligne et pare-feu des autres observations. Sa conception D1 porte un défaut matériel, corrigé par l'autorité 41.
- [`41-LOCAL-MISSION-CONSOLE-V0-U01-BOUNDED-DISCOVERY-DESIGN-CORRECTION.md`](41-LOCAL-MISSION-CONSOLE-V0-U01-BOUNDED-DISCOVERY-DESIGN-CORRECTION.md) — correction de conception : D1 aurait exposé, sous `missions/**`, tout JSON sans rapport comme candidat de résultat, ce que l'exigence gouvernante interdisait ; défaut démontré directement, resserrement global du filtre toujours rejeté pour non-régression, et éligibilité de résultat rendue sensible à la racine — `result.json` seul sous `missions/`, héritage inchangé ailleurs. Nommer honnêtement une largeur ne la rend pas conforme.
- [`42-LOCAL-MISSION-CONSOLE-V0-U01-REMEDIATION-INDEPENDENT-QUALIFICATION-AND-CLOSURE.md`](42-LOCAL-MISSION-CONSOLE-V0-U01-REMEDIATION-INDEPENDENT-QUALIFICATION-AND-CLOSURE.md) — deux couches tenues distinctes : la qualification indépendante de l'implémentation publiée, PASS WITH LIMITATIONS, avec zéro défaut matériel, suite publiée 74 / 74, racine d'énumération d'origine préservée à travers la récursion, confirmation dans le vrai DOM, et pour seule limitation la non-exécution du comportement de symlink sur hôte POSIX ; puis la clôture humaine de U-01 comme remédié. La topologie du panneau C y est énoncée, et le succès d'une remédiation ne requalifie pas rétroactivement un usage historique.
- [`43-REMAINING-MANUAL-ORCHESTRATION-WORK-NEXT-DIRECTION-SELECTION.md`](43-REMAINING-MANUAL-ORCHESTRATION-WORK-NEXT-DIRECTION-SELECTION.md) — sélection humaine de la prochaine direction authentique du Lab : mesurer le travail manuel d'orchestration restant. Question comparative première, famille A handoff / routage et famille B construction du paquet de contexte, pare-feu de fin de ligne et pare-feu des travaux clos, aucune conclusion d'outillage automatique, aucun vainqueur présumé. Ordre de feuille de route n'est pas preuve de besoin courant, et travail manuel observé n'est pas nouvel outillage requis. Le corpus, les cas, le modèle de comparaison et le contrat de retour appartiennent au gel d'étude bornée suivant.
- [`44-REMAINING-MANUAL-ORCHESTRATION-WORK-BOUNDED-COMPARATIVE-STUDY-FREEZE.md`](44-REMAINING-MANUAL-ORCHESTRATION-WORK-BOUNDED-COMPARATIVE-STUDY-FREEZE.md) — gel de l'étude comparative bornée, exécutable et en lecture seule : fenêtre factuelle semi-ouverte de la qualification de console à la clôture de U-01, corpus admissible et pare-feu de sources, inventaire exhaustif de 27 candidats dont 15 épisodes admis et 12 rejetés ou fusionnés avec leur motif, unité atomique de travail manuel, frontière stricte d'attribution A / B et interdiction de double comptage, pare-feu de taille d'invite, inconnu n'est pas zéro, vocabulaires de preuve, de conséquence et de suffisance, porte de cas d'outillage en six critères, comparaison lexicographique sans score synthétique, quatre issues admises, Mission Object et enveloppe gelés pour un AGENT CCR LAB #25 frais, contrat de retour de 255 champs. L'étude est exécutable ; sa conclusion n'est pas écrite.
- [`45-REMAINING-MANUAL-ORCHESTRATION-WORK-CURRENT-SURFACE-PERSISTENCE-CORRECTION.md`](45-REMAINING-MANUAL-ORCHESTRATION-WORK-CURRENT-SURFACE-PERSISTENCE-CORRECTION.md) — correction avant première dépêche : l'autorité 44 laissait des comptes historiques alimenter le départage sans vérifier que la responsabilité manuelle existe encore à la coupe, si bien qu'une friction close comme U-01 aurait pu peser sur la famille R&D choisie. Statut de surface courante obligatoire par unité, règle de preuve positive, éligibilité de besoin courant par épisode, synthèses historique et restante tenues séparées, comparaison de départage sur le travail encore manuel seulement. La vérification structurelle exigée avant toute édition a établi un second défaut, de mon fait : la grammaire Result Instance v0 n'admet pas de membre de SET structuré, ce que l'autorité 44 supposait. Encodage de registre corrigé et mesuré contre le validateur publié, sans étendre aucune grammaire. Nommer une structure ne la rend pas représentable.
- [`46-REMAINING-MANUAL-ORCHESTRATION-WORK-INDEPENDENT-QUALIFICATION-AND-HANDOFF-ROUTING-SELECTION.md`](46-REMAINING-MANUAL-ORCHESTRATION-WORK-INDEPENDENT-QUALIFICATION-AND-HANDOFF-ROUTING-SELECTION.md) — deux couches tenues distinctes : la qualification analytique indépendante du résultat persisté, PASS WITH LIMITATIONS, avec registre de 31 unités reconstruit, DIM_1 reconstruit indépendamment à HANDOFF_ROUTING 3 contre CONTEXT_PACKAGE 2, absorption U-01 confirmée à contribution nulle, 0 erreur analytique matérielle, 5 erreurs non matérielles issues d'un unique défaut racine d'attribution des corrections de conception entre les familles, 0 ambiguïté de contrat, 2 défauts non matériels d'artefact gouvernant et 3 limitations réelles ; puis la sélection humaine de HANDOFF_ROUTING comme prochaine direction. Les deux familles restent SUFFICIENT_WITH_ORDINARY_ORCHESTRATION : une direction recommandée n'est pas un moteur de routage, et une recommandation qualifiée n'est pas une autorisation de construire.
- [`47-HANDOFF-ROUTING-BOUNDED-RD-QUESTION-FREEZE.md`](47-HANDOFF-ROUTING-BOUNDED-RD-QUESTION-FREEZE.md) — gel de la question R&D bornée : les responsabilités de handoff / routage qui ont causé les conséquences matérielles d'EP-02, EP-03 et EP-04 peuvent-elles être dérivées et propagées déterministement depuis les surfaces durables existantes, par orchestration ordinaire, sans primitive sémantique nouvelle ? Noyau matériel de trois épisodes, contexte de récurrence des 20 unités A encore manuelles nommées une à une, inventaire fini de 8 types de responsabilité ancrés dans ces unités, pare-feu routage / paquet de contexte, modèle de chaîne causale en dix étapes, classification humain / déterministe en quatre termes, règle des surfaces existantes d'abord, porte d'écart G1..G6, test contrefactuel de suppression, autorité humaine résiduelle, quatre issues analytiques. Les défauts G1 et G2 relevés sur l'autorité 44 ne sont pas reproduits : couverture terminale complète et référence PROGRAM-STATE vivante. Un travail manuel n'est pas un écart, et une direction recommandée n'est pas une réponse technique.
- [`48-HANDOFF-ROUTING-FIVE-OUTCOME-DOMAIN-AND-PARTITION-CORRECTION.md`](48-HANDOFF-ROUTING-FIVE-OUTCOME-DOMAIN-AND-PARTITION-CORRECTION.md) — deux couches tenues distinctes : la décision humaine d'ajouter une cinquième issue analytique, et la correction déterministe du contrat qui la rend exécutable. L'énumération mécanique de l'espace d'états avait laissé 6 272 états admissibles sans issue, dont 98 entièrement concrets, tous porteurs d'un cas où la sémantique de routage requise est positivement absente sans qu'une sélection humaine substantielle soit causalement requise — un état que ni l'intégration bornée, ni la suffisance procédurale, ni la domination humaine, ni l'insuffisance de preuve ne pouvaient porter honnêtement. CONCRETE_ROUTING_SEMANTIC_GAP_CANDIDATE le représente séparément, variables S/P/B/H par cas, règles de cohérence C1..C4, partition ordonnée en règles 0 à 5, G4A/G4B, et réénumération complète : zéro état sans issue, zéro état à issues multiples. Sémantique manquante n'est pas intégration manquante, et le mot CANDIDATE est porteur.

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

LOCAL MISSION CONSOLE V0
= IMPLEMENTED / QUALIFIED
= tooling/console
= product scope : FROZEN
  31-LOCAL-MISSION-CONSOLE-V0-PROGRAM-DIRECTION-SELECTION.md
= technical design : FROZEN / RATIFIED
  32-LOCAL-MISSION-CONSOLE-V0-IMPLEMENTATION-DESIGN.md
= implementation class : ORDINARY INTEGRATION
= concrete semantic gap : 0
= new tooling experiment : NOT REQUIRED FOR V0
= independent implementation qualification : PASS WITH LIMITATIONS
  33-LOCAL-MISSION-CONSOLE-V0-INDEPENDENT-IMPLEMENTATION-QUALIFICATION.md
= authority-32 functional conformance : PASS
= historical integration fidelity : PASS
= security / read-only boundary : PASS
= material conformance defects : 0
= non-material limitations : 5
= real-use utility : NOT YET EVALUATED

CURRENT PROGRAM DIRECTION
= NEXT GENUINE LAB MISSION
= HUMAN-SELECTED / BOUNDED / FROZEN
  34-DECISION-CONSEQUENCE-BOUNDARY-REAL-USE-MISSION-SELECTION.md
  35-DECISION-CONSEQUENCE-BOUNDARY-BOUNDED-MISSION-FREEZE.md
= primary study : HUMAN DECISION
  → DETERMINISTIC CONSEQUENCE
  → EXECUTED CONSEQUENCE
= primary purpose : orchestration R&D
= console purpose : secondary real-use observation
= method : real historical cases first, existing-surface sufficiency check,
  gap only if demonstrated
= historical corpus cut : 70ca6d43aca5f07aafdc9e1b112d5991f2bf974a
= historical case set : FROZEN, 5 cases, categories A C D E represented,
  category B without authentic example
= mission object : CREATED / VALIDATED / RENDERED
  missions/001-decision-consequence-boundary
= mission execution : EXECUTED / INDEPENDENTLY QUALIFIED
= result instance : PRODUCED / PERSISTED EXACT-BYTE
= console observation surface : FROZEN
  36-LOCAL-MISSION-CONSOLE-V0-REAL-USE-OBSERVATION-CAPTURE-PROTOCOL.md
= result / panel-C durability ordering : FROZEN
  37-DECISION-CONSEQUENCE-BOUNDARY-RESULT-PANEL-C-DURABILITY-ORDERING.md
= panel A / B / C observations : OBSERVED / DURABLE

PRIMARY STUDY QUALIFICATION
= PASS WITH LIMITATIONS
  38-DECISION-CONSEQUENCE-BOUNDARY-PRIMARY-STUDY-AND-CONSOLE-REAL-USE-QUALIFICATION.md
= independent overall classification :
  EXISTING_SURFACES_SUFFICIENT_WITH_ORDINARY_ORCHESTRATION_LOGIC
= concrete representation gap : NOT DEMONSTRATED
= bounded to the frozen historical study

LOCAL MISSION CONSOLE V0
= IMPLEMENTED / QUALIFIED / REAL-USE EVALUATED
= real-use utility : MIXED UTILITY
= qualified real-use findings : 1
= U-01 enumeration / discoverability : CONFORMANT LIMITATION
= conformance defects discovered by real use : 0
= context-banner staleness : OBSERVATION ONLY
= evidence-mismatch presentation : OBSERVATION ONLY
= new representation : NOT SELECTED
= TE004 : NOT SELECTED

U-01 HUMAN PRODUCT RESPONSE
= BOUNDED DISCOVERY REMEDIATION SELECTED
  39-LOCAL-MISSION-CONSOLE-V0-U01-PRODUCT-RESPONSE-SELECTION.md
= response class : ORDINARY PRODUCT INTEGRATION
= objective : genuine mission / result artifacts reachable through the normal
  panel-B / panel-C candidate-selection workflow
= authority 40 : DESIGN FREEZE WITH MATERIAL D1 DEFECT
  40-LOCAL-MISSION-CONSOLE-V0-U01-BOUNDED-DISCOVERY-REMEDIATION-DESIGN.md
= authority 41 : BOUNDED DESIGN CORRECTION / SUPERSESSION
  41-LOCAL-MISSION-CONSOLE-V0-U01-BOUNDED-DISCOVERY-DESIGN-CORRECTION.md
= root cause : RETAINED — candidate-root coverage only
= product response : RETAINED
= corrected technical design : FROZEN
= mission discovery : missions/ added, mission.json only
= legacy result discovery : UNCHANGED, representability retained
= result discovery under missions/ : result.json ONLY
= unrelated missions/**/*.json : EXCLUDED
= implementation surface : tooling/console/repo.mjs
  + added cases in tooling/console/tests/console.test.mjs
= route contract changes : 0
= security-boundary changes : 0
= new candidate-type semantics : 0
= generic repository discovery : NO
= implementation : PUBLISHED
= mission candidates : 4 -> 5, genuine missions/ mission.json discoverable
= result candidates : 3 -> 4, genuine missions/ result.json discoverable
= independent implementation qualification : PASS WITH LIMITATIONS
  42-LOCAL-MISSION-CONSOLE-V0-U01-REMEDIATION-INDEPENDENT-QUALIFICATION-AND-CLOSURE.md
= material implementation defects : 0
= published test suite : 74 / 74 PASS
= qualification limitation : POSIX-host symlink behavior NOT EXERCISED
= real-DOM normal selection : PASS
= panel topology : panel B owns the mission selector, panel C
  owns the result selector, and panel C inherits the panel-B mission snapshot
= U-01 : CLOSED / REMEDIATED
= second full genuine-use rerun for U-01 : NOT REQUIRED
= historical real-use utility : MIXED UTILITY / UNCHANGED
= authority 32 : NOT REOPENED
= new representation : NO
= TE004 : NO
= EOL risk : SEPARATE / UNRESOLVED / NOT CURRENTLY SELECTED
= next : SELECTED — see NEXT GENUINE LAB DIRECTION

NEXT GENUINE LAB DIRECTION
= MEASURE REMAINING MANUAL ORCHESTRATION WORK
  43-REMAINING-MANUAL-ORCHESTRATION-WORK-NEXT-DIRECTION-SELECTION.md
= selected by : HUMAN
= primary comparative question : which still-repeated human orchestration
  activity carries the strongest empirical case for the next R&D step
= candidate family A : HANDOFF / ROUTING
= candidate family B : CONTEXT-PACKAGE CONSTRUCTION
= winning family : NOT SELECTED
= admissible outcomes : HANDOFF_ROUTING · CONTEXT_PACKAGE ·
  NEITHER_CURRENTLY_JUSTIFIED · INCONCLUSIVE_ON_DURABLE_EVIDENCE
= roadmap order : NOT EVIDENCE OF CURRENT NEED
= manual work observed : NOT new tooling required
= EOL : NOT A CANDIDATE FAMILY / NOT MERGED / SEPARATE
= closed work : NOT REOPENED, inspectable only as historical evidence
= historical corpus : NOT FROZEN
= cases : NOT SELECTED
= comparison model : NONE
= return contract : NONE
= new tooling experiment : NONE
= TE004 : NO
= implementation : NOT AUTHORIZED
= next : FRESH INDEPENDENT QUALIFICATION BY AGENT CCR LAB #28

BOUNDED COMPARATIVE STUDY
= authority 44 : BOUNDED STUDY FREEZE WITH MATERIAL CURRENT-NEED OMISSION
  44-REMAINING-MANUAL-ORCHESTRATION-WORK-BOUNDED-COMPARATIVE-STUDY-FREEZE.md
= authority 45 : CURRENT-SURFACE PERSISTENCE CORRECTION
  45-REMAINING-MANUAL-ORCHESTRATION-WORK-CURRENT-SURFACE-PERSISTENCE-CORRECTION.md
= corrected study : EXECUTED
= factual window : post-Authority-33 capability baseline
  through Authority-42 closure, half-open (baseline, cut]
= factual baseline : 70ca6d43aca5f07aafdc9e1b112d5991f2bf974a
= factual corpus cut : 168e7d811d05ae663923c50c6704f7db6eaac5b1
= window commits : 14
= authorities 43 / 44 as occurrence evidence : NO, governance only
= episode inventory : 27 candidates
= admitted episodes : 15, EP-01 .. EP-15, ALL EVALUATED
= rejected / merged candidates : 12, RC-01 .. RC-12, reasons recorded
= sampling : FORBIDDEN
= candidate A : HANDOFF / ROUTING
= candidate B : CONTEXT-PACKAGE CONSTRUCTION
= atomic manual orchestration work unit : FROZEN
= double counting : FORBIDDEN
= ambiguous attribution : retained in ledger, excluded from A-vs-B counts
= prompt size : NOT A PROXY
= durable evidence only : YES
= unknown : NOT ZERO
= evidence statuses : DIRECT_DURABLE · DETERMINISTIC_DERIVATION ·
  NOT_ESTABLISHED · CONTRADICTED
= existing-surface sufficiency : SUFFICIENT ·
  SUFFICIENT_WITH_ORDINARY_ORCHESTRATION ·
  CONCRETE_TOOLING_GAP_CANDIDATE · INCONCLUSIVE
= tooling-case gate : T1..T6, all required for DEMONSTRATED
= synthetic score : NONE
= mission object : missions/002-remaining-manual-orchestration-work/mission.json
= envelope : missions/002-remaining-manual-orchestration-work/envelope.md
= mission object validation : ok, 0 errors
= render coverage : complete, 391 / 391
= episode inventory : RETAINED
= historical occurrences : RETAINED
= historical counts : RETAINED, never overwritten
= current-need filter : FROZEN
= CURRENT_SURFACE_STATUS : required per atomic unit
  STILL_MANUAL / ABSORBED_BY_CURRENT_SURFACE / NOT_ESTABLISHED
= absorbed : NOT the same as never occurred
= still-manual : requires positive cut-time evidence, never silence
= unknown current status : neither absorbed nor still manual
= current-need eligibility : required per episode
= winner comparison : STILL-MANUAL WORK ONLY
= historical counts in winner ordering : FORBIDDEN
= cut-relative surface sufficiency : FROZEN
= current tooling-case gate : CT1..CT6
= U-01 out-of-interface manual request : historical WORKAROUND,
  ABSORBED_BY_CURRENT_SURFACE at the cut, 0 remaining winner contribution
= atomic-unit ledger encoding : per-episode id roster +
  one executor-defined reported entry per unit property
= structural capacity : verified against the published validator, PASS
= mission-object / result-instance grammar : NOT EXTENDED
= old mission bytes : SUPERSEDED BEFORE DISPATCH
  mission.json 4b72a9d8… · envelope.md 17539114…
= return contract : 255 -> 396 fields
  255 retained · 141 added · 0 removed · 0 renamed
= executor : CCR_LAB_FIX_1, read-only except result.json
= executor commits / pushes : 0 / 0
= result instance : PERSISTED
  missions/002-remaining-manual-orchestration-work/result.json
= persisted bytes : exactly as returned, no semantic edit
= return contract : 396 fields / EXECUTOR-REPORTED PASS
= executor recommendation : HANDOFF_ROUTING
= independent analytical qualification : PASS WITH LIMITATIONS
  46-REMAINING-MANUAL-ORCHESTRATION-WORK-INDEPENDENT-QUALIFICATION-AND-HANDOFF-ROUTING-SELECTION.md
= qualifier : CCR LAB FIX #1
= atomic units reconstructed : 31 · A 20 · B 11 · AMBIGUOUS 0
= absorbed : A 0 / B 2 · still manual : A 20 / B 9 · unknown : A 0 / B 0
= current-need eligible episodes : A 15 / B 7
= U-01 out-of-interface manual request : 2 units, historical WORKAROUND,
  ABSORBED_BY_CURRENT_SURFACE at the cut, remaining contribution 0
= DIM_1 : HANDOFF_ROUTING 3 (EP-02 EP-03 EP-04) /
  CONTEXT_PACKAGE 2 (EP-12 EP-13) · A_HIGHER · first decisive dimension
= DIM_2 executor value : NOT_APPLICABLE, comparison stopped at DIM_1
  independent value : A 3 / B 2, A_HIGHER, never verdict-bearing
= root analytical defect : inconsistent attribution of design
  corrections between families
= material analytical errors : 0
= non-material analytical errors : 5
= contract ambiguities : 0
= non-material governing-artifact defects : 2
  G1 terminal-outcome coverage incomplete · G2 stale ref-program-state
= qualification limitations : 3, REAL, no final-recommendation uncertainty
= realized drift : A 3 / B 1, NOT the same as material consequence
= current-surface sufficiency : SUFFICIENT_WITH_ORDINARY_ORCHESTRATION
  for both measured families
= current tooling case : DEMONSTRATED for both, CT1..CT6 satisfied
= qualified analytical recommendation : HANDOFF_ROUTING
= persisted result.json : UNCHANGED, no semantic edit
= human next Lab direction : HANDOFF_ROUTING
= context-package construction : measured non-winning family,
  neither invalidated nor closed
= exact product problem : NOT YET FROZEN
= routing engine : NOT SELECTED
= new API : NOT SELECTED
= new representation : NO
= TE004 : NO
= implementation : NOT AUTHORIZED
= winner : HANDOFF_ROUTING (direction only, no technical response selected)

HANDOFF / ROUTING BOUNDED R&D QUESTION
= authority 47 : QUESTION / CORPUS FREEZE WITH INCOMPLETE
  FOUR-OUTCOME ANALYTICAL DOMAIN
  47-HANDOFF-ROUTING-BOUNDED-RD-QUESTION-FREEZE.md
= authority 48 : FIVE-OUTCOME DOMAIN + DETERMINISTIC PARTITION CORRECTION
  48-HANDOFF-ROUTING-FIVE-OUTCOME-DOMAIN-AND-PARTITION-CORRECTION.md
= corrected study : EXECUTED BY CCR_LAB_FIX_1
= question : can the handoff/routing responsibilities that caused the material
  consequences in EP-02 / EP-03 / EP-04 be deterministically derived and
  propagated from existing durable surfaces, by ordinary orchestration, so the
  demonstrated blocking / rework is removed, without a new semantic primitive,
  a new representation, a routing engine, TE004 or an implementation decision
= material core : EP-02 / EP-03 / EP-04
= recurrence context : 20 still-manual A units, named exactly
  EP01-A-1 EP02-A-1 EP02-A-2 EP02-A-3 EP03-A-1
  EP03-A-2 EP03-A-3 EP04-A-1 EP04-A-2 EP05-A-1
  EP06-A-1 EP07-A-1 EP08-A-1 EP09-A-1 EP10-A-1
  EP11-A-1 EP12-A-1 EP13-A-1 EP14-A-1 EP15-A-1
= 20 units : NOT 20 material defects, NOT 20 product problems
= recurring responsibility inventory : 8 types, each anchored in a frozen unit
  R1 next control stage · R2 actor/session selection ·
  R3 execution baseline assignment · R4 action-authority propagation ·
  R5 persistence ownership · R6 return destination · R7 stop boundary ·
  R8 stage-ordering dependency
= per-type recurrence measurements : NOT FROZEN, they belong to execution
= working hypothesis : existing surfaces + ordinary orchestration may suffice
= classification : HUMAN_SUBSTANTIVE_DECISION ·
  DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED
= repeated manual action : NOT a human substantive decision
= deterministic : NOT already automated
= human substantive decision counted as removable : FORBIDDEN
= concrete-gap gate : G1..G6, G4 failure means no new primitive justified
= counterfactual removal test : YES / NO / PARTIAL / NOT_ESTABLISHED
= residual human authority : returned per case and per unit
= mechanical blocker detection : 6272 unmapped admissible states,
  98 of them fully concrete, all carrying a case where the required routing
  semantics are positively absent with no causal human selection
= human decision : ADD FIFTH ANALYTICAL OUTCOME
= fifth outcome : CONCRETE_ROUTING_SEMANTIC_GAP_CANDIDATE
  missing semantics is NOT missing integration; CANDIDATE is load-bearing
= final outcomes : ORDINARY_ORCHESTRATION_SUFFICIENT ·
  BOUNDED_INTEGRATION_OPPORTUNITY · HUMAN_DECISION_DOMINATES ·
  CONCRETE_ROUTING_SEMANTIC_GAP_CANDIDATE · INSUFFICIENT_DURABLE_EVIDENCE
= sixth analytical outcome : NONE
= per-case variables : S required semantics present · P procedural removal ·
  B bounded integration required · H substantive human selection required
= consistency rules : C1..C4
= outcome partition : ordered rules 0..5, FIVE-WAY / DETERMINISTIC
= mixed-case priority : HUMAN -> SEMANTIC GAP -> BOUNDED INTEGRATION
= state space : 1 259 712 raw · 238 328 admissible
= zero-outcome states : 0 · multi-outcome states : 0
= S1..S5 and both priority tests : each resolves uniquely
= technical current-surface baseline : a5d72edc806ac76f8f2f84ebb213215cf15dd22d
= fifth outcome observed in the historical cases : NOT ESTABLISHED,
  it is an allowed analytical conclusion, not a study result
= demonstrating a tooling opportunity : NOT required for success
= terminal-outcome coverage : COMPLETE, authority-44 G1 defect not repeated
= PROGRAM-STATE reference : live unpinned target plus one explicitly labelled
  historical pin, authority-44 G2 defect not repeated
= mission object : missions/003-handoff-routing-boundary/mission.json
= envelope : missions/003-handoff-routing-boundary/envelope.md
= old mission bytes : SUPERSEDED BEFORE DISPATCH
  mission.json 5f29a63e… · envelope.md 6d3e91a4…
= mission validation : ok, 0 errors · render coverage complete 441 / 441
= return contract : 307 -> 328 fields
  307 retained · 21 added · 0 removed · 0 renamed
  rf-outcome domain widened by one member, no member lost
= executor : CCR_LAB_FIX_1, read-only except result.json
= executor commits / pushes : 0 / 0
= executor actual result : DURABLY PERSISTED
  missions/003-handoff-routing-boundary/result.json
= persisted bytes : exactly as returned, no semantic edit
= executor-reported outcome : BOUNDED_INTEGRATION_OPPORTUNITY
= independent analytical qualification : PENDING
= load-bearing questions left to the qualifier :
  P versus G4 / G4A · B versus G5 / G6 · counterfactual removal ·
  exact evidence mapping for S = YES and H = NO · R1..R8 recurrence counts
= routing engine : NOT SELECTED
= new API : NOT SELECTED
= new representation : NO
= TE004 : NO
= implementation : NOT AUTHORIZED
= next : FRESH INDEPENDENT QUALIFICATION BY AGENT CCR LAB #28
= new tooling experiment : NONE
= TE004 : NO
= new representation : NO
= implementation : NOT AUTHORIZED
= EOL : SEPARATE / UNSELECTED / .gitattributes UNCHANGED
= next : FRESH INDEPENDENT QUALIFICATION BY AGENT CCR LAB #28

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
