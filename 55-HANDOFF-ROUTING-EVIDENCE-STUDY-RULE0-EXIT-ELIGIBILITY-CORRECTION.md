# Handoff / routage — correction d'éligibilité de sortie de la règle 0

## 1. Statut

```text
AUTORITÉ CORRIGÉE
= 54-HANDOFF-ROUTING-NEW-DURABLE-EVIDENCE-DIRECTION-AND-REQUIREMENT-STUDY-FREEZE.md
= blob ac556b763e22ab5664aa790e714e0c1c190a61c9

MATÉRIALISATION PROCÉDURALE DE L'AUTORITÉ 54
= VALIDE

COUCHE A DE L'AUTORITÉ 54 — SÉLECTION HUMAINE DE DIRECTION R&D
= INTACTE
= GATHER_NEW_DURABLE_EVIDENCE DEMEURE RATIFIÉE

COUCHE B DE L'AUTORITÉ 54 — CONTRAT DE L'ÉTUDE
= PARTIELLEMENT SUPERSÉDÉE

DÉFAUT MATÉRIEL DE CONCEPTION DE L'AUTORITÉ 54
= UN PARTIAL_PROGRESS_SET POUVAIT SATISFAIRE LES BRANCHES D'ISSUE
  POSITIVE UNIQUE ET MULTIPLE

PORTÉE DE LA CORRECTION
= ÉLIGIBILITÉ D'UN ENSEMBLE À UNE ISSUE POSITIVE
= BASE DE CAPACITÉ DE SORTIE DE LA RÈGLE 0
= MINIMALITÉ DE PROGRÈS CONTRE MINIMALITÉ DE SORTIE
= ENSEMBLE RESTANT ET DÉPARTAGE
= PARTITION ORDONNÉE 0 À 4
= RELATIONS DE RETOUR NÉCESSAIRES POUR RECONSTRUIRE CES FAITS

NOUVELLE DÉCISION HUMAINE
= AUCUNE

NOUVELLE PORTE HUMAINE
= AUCUNE

NOUVELLE PRÉFÉRENCE DE CANDIDAT
= AUCUNE

MISSION 006
= CORRIGÉE / GELÉE / NON ENCORE EXÉCUTÉE

RÉSULTAT 006
= INEXISTANT
```

```text
L'AUTORITÉ 54 N'EST PAS ÉDITÉE
ELLE DEMEURE LA PREUVE DURABLE DE LA SÉLECTION HUMAINE DE DIRECTION
ET DU CONTRAT ORIGINELLEMENT GELÉ
```

## 2. Le défaut exact

L'autorité 54 définissait un ensemble d'exigences comme **suffisant**
lorsqu'il résolvait assez d'incertitude matérielle pour **faire progresser
la décision**. Les règles 1 et 2 déclenchaient ensuite sur les ensembles
suffisants minimaux.

```text
SUFFISANT SIGNIFIAIT PROGRÈS DE DÉCISION
LES RÈGLES POSITIVES DÉCLENCHAIENT SUR LES ENSEMBLES SUFFISANTS
DONC UN ENSEMBLE QUI FAISAIT SEULEMENT PROGRESSER LA DÉCISION
POUVAIT REMPORTER UNE ISSUE POSITIVE
```

La question canonique de l'étude ne demande pourtant pas ce qui fait
progresser la décision. Elle demande ce qui permet d'avancer au-delà de
l'état qualifié RULE_0 / INSUFFICIENT_DURABLE_EVIDENCE.

```text
LA DISTINCTION PARTIAL_PROGRESS_SET CONTRE RULE0_EXIT_CAPABLE_SET
EXISTAIT DANS LA PROSE DE L'AUTORITÉ 54
ELLE N'ÉTAIT PORTÉE NI PAR LA DÉFINITION DE SUFFISANCE
NI PAR LA MINIMALITÉ
NI PAR LA PARTITION ORDONNÉE
```

Conséquence mesurée : sous l'ancienne sémantique, des états où aucun
ensemble n'était capable de faire sortir de la règle 0 produisaient
néanmoins une issue positive. La contre-épreuve de la section 9 en compte
2 parmi les états concrets admissibles.

```text
UN ENSEMBLE QUI POURRAIT ÊTRE UTILE
N'EST PAS UN ENSEMBLE CAPABLE DE FAIRE SORTIR DE LA RÈGLE 0
```

## 3. Éléments de l'autorité 54 conservés inchangés

```text
CONSERVÉS SANS MODIFICATION
= direction R&D humaine GATHER_NEW_DURABLE_EVIDENCE, ratifiée
= question canonique de l'étude
= pare-feu exigence contre méthode d'acquisition
= pare-feu de nouveauté et CURRENT_CORPUS_CORRECTION
= test de pouvoir discriminant
= cibles U1 à U5 et familles F1 à F3, sans présomption
= RC7 et RC8 en cibles prioritaires, sans paquet prédéterminé
= forme d'item d'exigence en quatorze champs
= encodage de registre : roster d'identifiants plus faits EXECUTOR
= aucune présélection de candidat de conception
= preuve d'exhaustivité d'espace de candidats
= preuve de suppression de charge
= domaine d'issues analytiques fermé à quatre, sans cinquième
= interdits d'acquisition, d'expérience, de prototype, d'implémentation
= exécutant futur AGENT CCR LAB #33, frais, lecture seule sauf result.json
= commits 0, pushs 0
= study.acquisition_method_selected = NO
= study.implementation_authorization = NO
```

## 4. Trois classes d'ensembles, tenues distinctes

```text
PROGRESS_CAPABLE_SET
= résout au moins une incertitude matérielle
  OU crée un progrès de décision établi
= rapportable
= JAMAIS gagnant par ce seul fait

PARTIAL_PROGRESS_SET
= PROGRESS_CAPABLE_SET
= dont la capacité de rendre la sortie de la règle 0 analytiquement
  possible n'est PAS établie
= rapportable
= JAMAIS éligible à une issue positive

RULE0_EXIT_CAPABLE_SET
= ensemble pour lequel une base explicite établit qu'il rend la sortie
  de la règle 0 analytiquement possible
  sur AU MOINS UNE branche d'observation admissible
= la seule classe qui peut remporter une issue positive
```

```text
PROGRÈS DE DÉCISION N'EST PAS CAPACITÉ DE SORTIE DE LA RÈGLE 0
UN SEUL MODÈLE DE SUFFISANCE GOUVERNE LES ISSUES POSITIVES
CELUI DE LA CAPACITÉ DE SORTIE
```

Les deux modèles ne coexistent pas. Le champ de suffisance de progrès
demeure, renommé, comme fait rapporté. Il ne gouverne plus rien.

## 5. Base de capacité de sortie de la règle 0

Toute revendication RULE0_EXIT_CAPABLE porte sa base. Sans base, la
revendication n'est pas admise et l'ensemble reste PARTIAL_PROGRESS.

```text
LA BASE ÉNONCE, POUR CHAQUE ENSEMBLE REVENDIQUÉ EXIT-CAPABLE
= quelles inconnues de règle 0 sont visées
= quels membres de l'ensemble les visent
= quelles valeurs d'observation durables sont admissibles
= pour AU MOINS UNE branche admissible :
  quelles inconnues sont résolues
  quels faits changent
  quels bloqueurs cessent de gouverner
  quelle branche non-règle-0 devient atteignable
  pourquoi aucune autre inconnue ne maintient nécessairement la règle 0
```

```text
UNE GARANTIE SOUS TOUTE OBSERVATION N'EST PAS EXIGÉE
UNE BRANCHE ADMISSIBLE SUFFIT
MAIS ELLE DOIT ÊTRE MONTRÉE, PAS AFFIRMÉE
```

```text
NE COMPTENT PAS COMME BASE
= POURRAIT ÊTRE UTILE
= AIDERAIT
= RÉDUIRAIT L'INCERTITUDE
= EST MANIFESTEMENT PERTINENT
= NOT_ESTABLISHED
```

## 6. Deux questions de minimalité

L'autorité 54 posait une seule minimalité par retrait d'item. Elle en pose
désormais deux, séparées, car elles n'ont pas le même objet.

```text
PROGRESS_MINIMALITY
= minimalité par retrait d'item sur les PROGRESS_CAPABLE_SET
= fait rapporté
= ne décide aucune issue

RULE0_EXIT_MINIMALITY
= minimalité par retrait d'item sur les RULE0_EXIT_CAPABLE_SET
= le retrait de tout membre détruit la base de capacité de sortie
= la seule minimalité qui alimente les règles 1 et 2
```

```text
UN ENSEMBLE PEUT ÊTRE PARTIAL_PROGRESS ET PROGRESS-MINIMAL
ET N'ÊTRE ÉLIGIBLE À AUCUNE ISSUE POSITIVE
PLUS DE DONNÉES N'EST PAS UN MEILLEUR ENSEMBLE
UNE OBSERVATION COMMODE EN PLUS N'EST PAS UNE EXIGENCE MINIMALE
```

## 7. Éligibilité à la partition

```text
PARTITION_ELIGIBLE_SET = RULE0_EXIT_CAPABLE_SET
```

L'égalité est totale et sans exception. Elle gouverne, dans cet ordre :

```text
= la minimalité positive           : RULE0_EXIT_MINIMALITY seule
= la distinction matérielle        : entre ensembles partition-éligibles
= la dominance déterministe        : entre ensembles partition-éligibles
= l'ensemble restant               : partition-éligibles minimaux survivants
= le départage déterministe gelé   : entre ensembles partition-éligibles
= les règles 1 et 2                : sur le seul ensemble restant
= la porte de sélection humaine    : sur le seul ensemble restant
```

```text
UN PARTIAL_PROGRESS_SET N'ENTRE DANS AUCUNE DE CES SEPT OPÉRATIONS
IL EST RAPPORTÉ, AVEC SES CONSTATS, ET RIEN DE PLUS
```

## 8. Partition ordonnée corrigée

La première règle dont la condition est satisfaite décide. Aucune règle
ultérieure n'est évaluée.

```text
RÈGLE 0 — INCONNUE MATÉRIELLE CHANGEANT L'ISSUE
condition : une inconnue matérielle hors abstraction subsiste et pourrait
            changer l'issue, OU les inconnues internes admettent plusieurs
            issues concrètes distinctes
issue     : INSUFFICIENT_DURABLE_BASIS_TO_SPECIFY_EVIDENCE_REQUIREMENT

RÈGLE 1 — PLUSIEURS ENSEMBLES PARTITION-ÉLIGIBLES RESTANTS
condition : au moins deux ensembles partition-éligibles minimaux
            matériellement distincts survivent à la dominance
            ET aucun départage déterministe gelé n'en désigne un seul
issue     : MULTIPLE_MINIMAL_DURABLE_EVIDENCE_REQUIREMENT_SETS_REQUIRE_HUMAN_SELECTION

RÈGLE 2 — UN SEUL ENSEMBLE PARTITION-ÉLIGIBLE RESTANT
condition : exactement un ensemble partition-éligible minimal survit,
            OU un départage déterministe gelé en désigne exactement un
issue     : UNIQUE_MINIMAL_DURABLE_EVIDENCE_REQUIREMENT_SET_ESTABLISHED

RÈGLE 3 — IMPOSSIBILITÉ POSITIVEMENT ÉTABLIE
condition : aucun ensemble partition-éligible n'existe
            ET une preuve positive suffisamment exhaustive établit
            qu'aucune exigence de preuve durable bornée ne peut devenir
            RULE0_EXIT_CAPABLE
issue     : NO_BOUNDED_NEW_EVIDENCE_REQUIREMENT_CAN_RESOLVE_CURRENT_UNCERTAINTY

RÈGLE 4 — DÉFAUT
issue     : INSUFFICIENT_DURABLE_BASIS_TO_SPECIFY_EVIDENCE_REQUIREMENT
```

```text
AUCUN ENSEMBLE PARTITION-ÉLIGIBLE, SANS PREUVE D'IMPOSSIBILITÉ
= RÈGLE 4
= PAS UNE ISSUE POSITIVE
MÊME SI DES PARTIAL_PROGRESS_SET EXISTENT EN NOMBRE
```

## 9. Preuve mécanique de partition

L'espace de décision fini est énuméré hors du dépôt. L'abstraction sépare
explicitement la cardinalité des ensembles PARTIAL_PROGRESS minimaux et
celle des ensembles RULE0_EXIT_CAPABLE minimaux après dominance : prouver
la totalité d'une abstraction qui les confondrait ne prouverait rien.

```text
DIMENSIONS
= cardinalité PARTIAL_PROGRESS minimale   : 0 · 1 · 2+ · NOT_ESTABLISHED
= cardinalité RULE0_EXIT_CAPABLE minimale : 0 · 1 · 2+ · NOT_ESTABLISHED
= départage déterministe gelé             : YES · NO · NOT_ESTABLISHED
= impossibilité positivement établie      : YES · NO · NOT_ESTABLISHED
= inconnue matérielle hors abstraction    : YES · NO

ADMISSIBILITÉ
= un départage n'existe que s'il reste au moins deux exit-capables
= une impossibilité établie exclut tout exit-capable et tout progrès borné
= un état porteur d'inconnues n'est admissible que si une complétion
  concrète admissible existe
```

```text
ÉTATS BRUTS                                 288
ÉTATS ADMISSIBLES                           148

  INSUFFICIENT_DURABLE_BASIS_...            114
  UNIQUE_MINIMAL_..._ESTABLISHED             24
  MULTIPLE_MINIMAL_..._HUMAN_SELECTION        8
  NO_BOUNDED_NEW_EVIDENCE_REQUIREMENT_...     2

ÉTATS FINAUX SANS ISSUE                       0
AFFECTATIONS FINALES MULTIPLES                0
FUITE D'ISSUE POSITIVE PAR PROGRÈS SEUL       0
TOUTES LES ÉTIQUETTES DANS LES QUATRE      VRAI
```

```text
CONTRE-ÉPREUVE
SOUS L'ANCIENNE SÉMANTIQUE DE SUFFISANCE
ÉTATS CONCRETS SANS AUCUN ENSEMBLE EXIT-CAPABLE
QUI PRODUISAIENT POURTANT UNE ISSUE POSITIVE : 2
```

Sept états témoins et le cas de départage sont vérifiés nominativement :
progrès partiel seul, avec ou sans pluralité, tombe en règle 4 ; un unique
exit-capable tombe en règle 2 ; deux exit-capables sans départage tombent
en règle 1 ; un départage gelé sur deux exit-capables ramène à la règle 2 ;
l'impossibilité établie tombe en règle 3.

## 10. Mission Object corrigé

```text
CHEMIN
= missions/006-handoff-routing-evidence-requirement-study/mission.json
= blob   623a2e79b728a2db390a2d34007993be35b7ce82
= sha256 4732ac77199b2e058a193f3e0058b7aae1ada2407a206ec2e66729d2a3422164
= 97976 octets

ENVELOPPE
= missions/006-handoff-routing-evidence-requirement-study/envelope.md
= blob   11ec9a96c7ef151880d60669ee4a1bfb0b265cce
= sha256 6c3c3b1da836d65f4f5d66e2eeb0c5fc5b67ee32fe2a8ca08926c2aa2a606f6d
= 33694 octets
= rendue par le renderer publié, non éditée à la main

VALIDATION
= ok, 0 erreur
RENDU
= déterministe, deux passes identiques
COUVERTURE DE RENDU
= complète, 295 / 295, 0 omis, 0 inventé, 0 vide

SCHÉMA DU MISSION OBJECT
= NON ÉTENDU
INDEX DE MISSION 006
= PAS TE006
```

```text
DELTA STRUCTUREL
= références            17 vers 18   (+ ref-auth55)
= effets                41 vers 47   (+ 6)
= exigences de contenu  30 vers 34   (+ 4)
= portes                 5 vers  6   (+ g-no-partial-leakage)
= règles d'arrêt         7 vers  8   (+ sr-leakage)
= exigences de preuve    4 vers  5   (+ ev-rule0-exit)
= relations de contexte  8 vers 12   (+ 4)
= étapes de procédure   17 vers 19   (+ s-rule0-exit, s-eligibility)
= issues terminales      7 vers  7   (inchangé)
= branches               4 vers  4   (inchangé)
```

Les six effets ajoutés sont ESTABLISH_RULE0_EXIT_CAPABILITY,
DETERMINE_PARTITION_ELIGIBILITY, puis quatre interdits :
COUNT_PARTIAL_PROGRESS_AS_PARTITION_ELIGIBLE,
TREAT_DECISION_PROGRESS_AS_RULE0_EXIT_CAPABILITY,
ASSERT_RULE0_EXIT_WITHOUT_BASIS,
REQUIRE_RULE0_EXIT_UNDER_EVERY_OBSERVATION.

La porte g-no-partial-leakage précède la minimalité et exige deux zéros :
aucun ensemble à progrès seul compté éligible, aucune capacité de sortie
affirmée sans base. La porte de minimalité exige en outre que la
minimalité visée soit celle de sortie de la règle 0.

## 11. Contrat de retour corrigé

```text
ANCIEN NOMBRE DE RELATIONS         96
AJOUTÉES                           10
RETIRÉES                            0
RENOMMÉES                           9
SÉMANTIQUEMENT SUPERSÉDÉES         11
NOUVEAU TOTAL                     106
```

```text
AJOUTÉES — 10
+ requirement_set.progress_capable_count
+ requirement_set.partial_progress_ids
+ requirement_set.partial_progress_findings
+ requirement_set.rule0_exit_capability_basis
+ requirement_set.partition_eligible_ids
+ requirement_set.partition_eligible_count
+ requirement_set.progress_minimality_applied
+ requirement_set.positively_progress_minimal_count
+ requirement_set.rule0_exit_component_removal_tests_run
+ partition.partial_only_set_fed_a_positive_outcome
```

```text
RENOMMÉES — 9   identifiant de relation stable, identité de fait changée
~ sufficient_count
    vers progress_sufficient_count
~ component_removal_minimality_applied
    vers rule0_exit_minimality_applied
~ positively_minimal_count
    vers positively_rule0_exit_minimal_count
~ material_distinctness_relations
    vers material_distinctness_relations_among_partition_eligible
~ deterministic_dominance_relations
    vers deterministic_dominance_relations_among_partition_eligible
~ deterministically_dominated_count
    vers deterministically_dominated_partition_eligible_count
~ remaining_minimal_ids
    vers remaining_partition_eligible_minimal_ids
~ remaining_minimal_cardinality
    vers remaining_partition_eligible_minimal_cardinality
~ remaining_minimal_count
    vers remaining_partition_eligible_minimal_count
```

```text
SÉMANTIQUEMENT SUPERSÉDÉES — 11   identité de fait inchangée, sens changé
= requirement_set.rule0_exit_capable_count
    exige désormais une base explicite, et gouverne les règles 1, 2 et 3
= requirement_set.partial_progress_count
    désigne désormais la classe progress-capable non exit-capable
= requirement_set.component_removal_tests_run
    compte désormais les seuls retraits de minimalité de progrès
= requirement_set.frozen_deterministic_tiebreak_exists
= requirement_set.frozen_deterministic_tiebreak_basis
    départagent désormais entre partition-éligibles seulement
= partition.no_bounded_requirement_can_resolve_positively_established
    signifie désormais qu'aucune exigence bornée ne peut devenir
    RULE0_EXIT_CAPABLE
= study.decisive_partition_rule
= study.final_analytical_outcome
= study.final_analytical_outcome_basis
    suivent la partition corrigée, et la base doit porter la capacité
    de sortie
= study.human_evidence_requirement_selection_gate
= study.human_evidence_requirement_selection_gate_basis
    ne s'ouvrent que sur pluralité de partition-éligibles
```

```text
CHAMPS PRÉDÉTERMINÉS PRÉSERVÉS
= study.acquisition_method_selected      = NO
= study.implementation_authorization     = NO
```

```text
ENCODAGE INCHANGÉ
= roster d'identifiants en SET
= une entrée EXECUTOR par couple unité / propriété
= aucun membre de SET structuré, aucun SET imbriqué
```

## 12. Discipline inchangée

```text
L'EXÉCUTANT DE LA MISSION 006
= AGENT CCR LAB #33, frais
= lit le dépôt, écrit le seul result.json réservé
= commits 0, pushs 0
= ne qualifie pas son propre retour
= n'acquiert aucune preuve, ne sélectionne aucune méthode
= ne sélectionne aucun candidat, ne conçoit aucune représentation
= ne crée pas TOOLING-EXPERIMENT-004
= n'autorise aucune implémentation

LE DOMAINE D'ISSUES ANALYTIQUES DEMEURE FERMÉ À QUATRE
AUCUNE CINQUIÈME ISSUE N'EST INVENTÉE PAR CETTE CORRECTION
```

## 13. Ce que ce document ne fait pas

```text
NE RÉPOND PAS À LA QUESTION DE L'ÉTUDE
NE NOMME AUCUN ENSEMBLE D'EXIGENCES
NE DÉCLARE AUCUN ENSEMBLE EXIT-CAPABLE
NE PRÉSUME AUCUNE CARDINALITÉ D'ENSEMBLE RESTANT
NE PRÉSUME AUCUNE ISSUE
N'OUVRE AUCUNE PORTE HUMAINE
NE SÉLECTIONNE AUCUNE MÉTHODE D'ACQUISITION
NE MODIFIE AUCUN OUTILLAGE
NE MODIFIE AUCUNE MISSION HISTORIQUE
NE CRÉE AUCUNE DÉCISION NOUVELLE
```

```text
IL CORRIGE UNE SEULE CHOSE
CE QUI REND UN ENSEMBLE ÉLIGIBLE À UNE ISSUE POSITIVE
```
