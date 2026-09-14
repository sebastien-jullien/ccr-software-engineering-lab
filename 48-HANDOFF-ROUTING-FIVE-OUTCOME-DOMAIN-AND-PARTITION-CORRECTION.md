# Handoff / routage — domaine à cinq issues et correction de partition

## 0. Deux couches, tenues distinctes

```text
COUCHE A
= DÉCISION HUMAINE DE DOMAINE ANALYTIQUE

COUCHE B
= CORRECTION DÉTERMINISTE DU CONTRAT D'ÉTUDE
```

La première choisit ce que l'étude a le droit de conclure. La seconde rend ce
choix mécaniquement exécutable. Elles ne se confondent pas.

---

# COUCHE A — DÉCISION HUMAINE DE DOMAINE ANALYTIQUE

## A.1 Le blocage constaté

L'énumération mécanique exigée avant toute publication a établi, sur le contrat
de l'autorité 47 :

```text
ÉTATS ADMISSIBLES                    238 328
ÉTATS SANS ISSUE                       6 272
DONT ENTIÈREMENT CONCRETS                 98
```

```text
TOUS LES ÉTATS RÉSIDUELS ENTIÈREMENT CONCRETS
PORTENT AU MOINS UN CAS AVEC
REQUIRED_ROUTING_SEMANTICS_PRESENT = NO
ET
SUBSTANTIVE_HUMAN_SELECTION_CAUSALLY_REQUIRED = NO
```

Vérifié mécaniquement, sans exception.

```text
COUVERTURE D'ÉTIQUETTES TERMINALES   COMPLÈTE
PARTITION DÉTERMINISTE D'ISSUES      DÉFECTUEUSE
```

Ces deux propositions restent distinctes.

## A.2 La décision humaine

```text
DOMAINE D'ISSUES ANALYTIQUES
= CINQ ISSUES

CINQUIÈME ISSUE
= CONCRETE_ROUTING_SEMANTIC_GAP_CANDIDATE
```

Alternatives examinées et écartées :

```text
REDÉFINIR BOUNDED_INTEGRATION_OPPORTUNITY                        NON
EXCLURE LES ÉTATS REQUIRED_ROUTING_SEMANTICS_PRESENT = NO        NON
FORCER S = NO DANS INSUFFICIENT_DURABLE_EVIDENCE                 NON
```

Motif :

```text
« sémantique existante mais intégration déterministe manquante »
≠
« sémantique de routage requise elle-même absente »
```

```text
CETTE DÉCISION EST DE DOMAINE ANALYTIQUE, ET SEULEMENT CELA
ELLE NE CHOISIT NI COMMENT UN TEL ÉCART SERAIT REPRÉSENTÉ,
NI COMMENT IL SERAIT RÉSOLU
```

## A.3 Définition gelée de la cinquième issue

```text
CONCRETE_ROUTING_SEMANTIC_GAP_CANDIDATE
= au moins une responsabilité de routage matériellement conséquente exige une
  sémantique de routage ou de contrôle que la preuve durable établit
  POSITIVEMENT comme absente de la ligne de base technique courante,

  ET cette conséquence matérielle non résolue n'est pas gouvernée par une
  condition SUBSTANTIVE_HUMAN_SELECTION_CAUSALLY_REQUIRED = YES,

  ET l'absence sémantique concernée est pleinement établie, et non
  simplement NOT_ESTABLISHED
```

```text
CONCRETE_ROUTING_SEMANTIC_GAP_CANDIDATE
≠ NOUVELLE REPRÉSENTATION REQUISE
≠ NOUVELLE PRIMITIVE SÉLECTIONNÉE
≠ MOTEUR DE ROUTAGE REQUIS
≠ TOOLING-EXPERIMENT-004 JUSTIFIÉE
≠ IMPLÉMENTATION AUTORISÉE
```

```text
LE MOT « CANDIDATE » EST PORTEUR
```

## A.4 Ce que cette issue n'établit jamais

Si l'étude conclut à cette issue, elle peut établir uniquement :

```text
un candidat concret de capacité sémantique de routage ou de contrôle manquante
```

Elle ne peut inférer :

```text
champ exact · objet exact · API exacte · modèle de routage · moteur de routage
nouvelle représentation · TOOLING-EXPERIMENT-004 · implémentation
```

Ce sont des questions humaines, produit et de conception, ultérieures.

```text
LA CINQUIÈME ISSUE EST UNE CONCLUSION ANALYTIQUE ADMISE
ELLE N'EST PAS UN RÉSULTAT D'ÉTUDE
```

Rien ici n'établit qu'elle sera observée dans les cas historiques.

---

# COUCHE B — CORRECTION DÉTERMINISTE DU CONTRAT

## B.1 Parties de l'autorité 47 conservées

```text
direction HANDOFF_ROUTING
question R&D bornée
noyau matériel EP-02 / EP-03 / EP-04
20 unités A qualifiées
inventaire de responsabilités R1..R8
pare-feu HANDOFF_ROUTING / CONTEXT_PACKAGE
modèle de chaîne causale en 10 étapes
vocabulaire de classification des responsabilités
règle des surfaces existantes d'abord
discipline contrefactuelle
vocabulaire d'autorité humaine résiduelle
pare-feu de sources factuelles
ligne de base des surfaces techniques
étiquettes terminales de préflight et de blocage
```

```text
AUCUN ÉPISODE, UNITÉ NI TYPE DE RESPONSABILITÉ AJOUTÉ OU RETIRÉ
```

## B.2 Ligne de base des surfaces techniques

```text
LIGNE DE BASE TECHNIQUE COURANTE
= a5d72edc806ac76f8f2f84ebb213215cf15dd22d
```

```text
AUTORITÉ 48, SON MISSION OBJECT ET SON ENVELOPPE
= GOUVERNANCE D'ÉTUDE        OUI
= NOUVELLE CAPACITÉ TECHNIQUE NON
```

#27 pourra exécuter depuis le commit de publication de l'autorité 48, mais
toute affirmation sur les surfaces techniques ou produit existantes s'évalue
contre la ligne de base gelée.

```text
SOURCE DE PRODUCTION OU D'OUTILLAGE MODIFIÉE PAR CETTE CORRECTION
= AUCUNE
```

## B.3 Variables par cas matériel

Pour EP-02, EP-03 et EP-04 :

```text
S  REQUIRED_ROUTING_SEMANTICS_PRESENT
   = YES / NO / NOT_ESTABLISHED

P  REMOVAL_BY_EXISTING_PROCEDURAL_ORCHESTRATION
   = YES / NO / PARTIAL / NOT_ESTABLISHED

B  BOUNDED_INTEGRATION_REQUIRED
   = YES / NO / NOT_ESTABLISHED

H  SUBSTANTIVE_HUMAN_SELECTION_CAUSALLY_REQUIRED
   = YES / NO / NOT_ESTABLISHED
```

```text
INFÉRER L'UNE DEPUIS L'AUTRE
AUTREMENT QUE PAR LES RÈGLES DE COHÉRENCE GELÉES
= INTERDIT
```

## B.4 Orchestration procédurale

```text
PROCEDURAL_ORDINARY_ORCHESTRATION
= la sortie de routage ou de contrôle requise peut déjà être obtenue et
  propagée en employant l'état, les règles et les surfaces disponibles à la
  ligne de base technique, sans ajouter de capacité d'intégration
  déterministe actuellement manquante
```

La charge est supprimable en exécutant correctement une sémantique existante
par des surfaces déjà disponibles.

```text
CELA NE SIGNIFIE PAS
« UNE INTÉGRATION DÉTERMINISTE POURRAIT THÉORIQUEMENT ÊTRE ÉCRITE »
```

## B.5 Intégration bornée

```text
BOUNDED_INTEGRATION
= la sémantique de routage requise est déjà présente et déterministiquement
  suffisante, mais aucune surface disponible à la ligne de base n'effectue ni
  n'expose la jointure ou la propagation bornée nécessaire pour supprimer la
  charge démontrée
```

```text
BOUNDED_INTEGRATION
≠ ORCHESTRATION PROCÉDURALE DÉJÀ SUFFISANTE
≠ SÉMANTIQUE DE ROUTAGE MANQUANTE
≠ MOTEUR DE ROUTAGE GÉNÉRIQUE
≠ NOUVELLE REPRÉSENTATION
```

## B.6 Règles de cohérence

```text
C1  P = YES  →  B = NO, H = NO, S = YES
C2  B = YES  →  S = YES
C3  P = YES  →  S = YES
C4  S = YES et P ∈ {NO, PARTIAL} et H = NO  →  B = YES
```

```text
AJOUTER UNE RÈGLE ÉLIMINANT S = NO POUR SIMPLIFIER LA PARTITION
= INTERDIT

AFFIRMER S = NO → H = YES
= INTERDIT, sauf si la preuve durable l'établit à l'exécution
```

## B.7 Fonction de décision ordonnée à cinq issues

```text
RÈGLE 0 — INCERTITUDE MATÉRIELLE
résoudre chaque NOT_ESTABLISHED pertinent sur toutes ses complétions concrètes
admissibles ; si la proposition non résolue peut changer la règle qui
s'applique ensuite → INSUFFICIENT_DURABLE_EVIDENCE ; si toutes les complétions
mènent à la même issue, l'inconnue est prouvée non pertinente et cette issue
s'applique

RÈGLE 1 — SUFFISANCE PROCÉDURALE
les trois cas matériels P = YES
→ ORDINARY_ORCHESTRATION_SUFFICIENT

RÈGLE 2 — SÉLECTION HUMAINE CAUSALE
sinon, au moins une conséquence matérielle restante H = YES
→ HUMAN_DECISION_DOMINATES

RÈGLE 3 — ÉCART SÉMANTIQUE DE ROUTAGE
sinon, au moins un cas matériel restant S = NO, absence positivement établie
→ CONCRETE_ROUTING_SEMANTIC_GAP_CANDIDATE

RÈGLE 4 — INTÉGRATION DÉTERMINISTE BORNÉE
sinon, au moins un cas restant B = YES, et tout cas restant supprimable par
orchestration procédurale courante ou par cette intégration bornée sur une
sémantique déjà présente, sans bloqueur de sélection humaine causale
→ BOUNDED_INTEGRATION_OPPORTUNITY

RÈGLE 5 — RESTE ÉVIDENTIAIRE
si aucune règle antérieure ne s'applique pour la seule raison que la preuve
durable demeure insuffisante
→ INSUFFICIENT_DURABLE_EVIDENCE
```

```text
PRIORITÉ EN ÉTAT MIXTE
HUMAIN → ÉCART SÉMANTIQUE → INTÉGRATION BORNÉE
après la règle de suffisance procédurale
```

Motifs gelés :

```text
la règle 2 prime parce qu'une amélioration mécanique du routage ne peut
supprimer toute conséquence matérielle démontrée tant que la sélection
substantielle causalement nécessaire reste humaine

la règle 3 prime sur la règle 4 parce que l'intégration bornée présuppose que
la sémantique requise existe
```

```text
EMPLOYER LA RÈGLE 5 POUR UN ÉTAT SÉMANTIQUE POSITIVEMENT ÉTABLI
RELEVANT DES RÈGLES 1 À 4
= INTERDIT
```

## B.8 Domaine d'issues

```text
ORDINARY_ORCHESTRATION_SUFFICIENT
BOUNDED_INTEGRATION_OPPORTUNITY
HUMAN_DECISION_DOMINATES
CONCRETE_ROUTING_SEMANTIC_GAP_CANDIDATE
INSUFFICIENT_DURABLE_EVIDENCE
```

```text
SIXIÈME ISSUE ANALYTIQUE
= AUCUNE
```

Les états terminaux de blocage et de préflight restent des issues
procédurales distinctes.

## B.9 G4A / G4B

G1, G2, G3, G5 et G6 de l'autorité 47 sont conservés substantiellement.
L'ancien G4 ambigu est remplacé.

```text
G4A
l'orchestration procédurale courante ne supprime pas entièrement la charge
matériellement conséquente démontrée

G4B
classer exactement la cause restante comme l'une de :
· intégration déterministe bornée absente, sémantique présente
· sémantique de routage requise absente
· sélection humaine substantielle causalement requise
· non établie
```

```text
CELA EMPÊCHE « ORCHESTRATION ORDINAIRE INSUFFISANTE »
D'ÊTRE TRAITÉ COMME PREUVE D'UN GENRE TECHNIQUE D'ÉCART PARTICULIER
```

## B.10 Preuve mécanique sur l'espace d'états

Énumération complète conduite hors du dépôt cible, sur les domaines gelés
S, P, B, H pour les trois cas, sous C1..C4, puis fonction ordonnée 0..5.

```text
ÉTATS BRUTS PAR CAS                       108
ÉTATS ADMISSIBLES PAR CAS                  62
COMBINAISONS BRUTES                 1 259 712
COMBINAISONS ADMISSIBLES              238 328

ÉTATS SANS ISSUE                            0
ÉTATS À ISSUES MULTIPLES                    0
```

Répartition par étiquette :

```text
HUMAN_DECISION_DOMINATES                179 009
INSUFFICIENT_DURABLE_EVIDENCE            52 554
CONCRETE_ROUTING_SEMANTIC_GAP_CANDIDATE   6 272
BOUNDED_INTEGRATION_OPPORTUNITY             485
ORDINARY_ORCHESTRATION_SUFFICIENT             8
                                        -------
                                        238 328
```

Les 6 272 états que le contrat de l'autorité 47 laissait sans issue sont
exactement ceux que la cinquième issue absorbe. Le compte concorde.

```text
ÉTATS CONCRETS                              1 331
SATISFAISANT PLUSIEURS PRÉDICATS DE RÈGLE     988
```

Ces 988 états ne sont pas ambigus : l'ordre des règles les tranche
déterministiquement, et la fonction reste totale avec exactement une étiquette
par état.

## B.11 Tests de cohérence

```text
S1  trois cas P = YES
    → ORDINARY_ORCHESTRATION_SUFFICIENT              résolution unique

S2  sémantique présente, une intégration bornée absente, aucun besoin humain
    → BOUNDED_INTEGRATION_OPPORTUNITY                résolution unique

S3  intégration bornée mixte + une sélection humaine causalement requise
    → HUMAN_DECISION_DOMINATES                       résolution unique

S4  inconnue matérielle capable de changer la branche
    → INSUFFICIENT_DURABLE_EVIDENCE                  résolution unique

S5  un cas S = NO, H = NO, pleinement établi
    → CONCRETE_ROUTING_SEMANTIC_GAP_CANDIDATE        résolution unique
```

Priorités vérifiées séparément :

```text
P1  S = NO et H = YES sur le même cas  → HUMAN_DECISION_DOMINATES
P2  un cas S = NO, un autre B = YES    → CONCRETE_ROUTING_SEMANTIC_GAP_CANDIDATE
```

```text
DOMAINE À CINQ ISSUES
= CLOS
```

## B.12 Mission Object canonique

```text
VERSION DE L'AUTORITÉ 47
= HISTORIQUE / SUPERSÉDÉE AVANT DÉPÊCHE
= mission.json  blob 5f29a63e11918eec672fb1e25a4e214bc7d5b10a
= envelope.md   blob 6d3e91a4ab23f1f534de31092f22e2b4f2f84878
= preuve historique immuable au commit a5d72edc806ac76f8f2f84ebb213215cf15dd22d

VERSION DE L'AUTORITÉ 48
= SEUL CONTRAT EXÉCUTABLE

MISSION OBJECT
= missions/003-handoff-routing-boundary/mission.json
= 205834 octets
= sha256 992922a3edaf04a60224f0fe8f59ff1f8860fa871a02560f1430b2a259a4fe24
= blob   f0c5bc3f84840d657011dc31b3ed2ce54f62c175
= CR 0 / LF 8376 / NUL 0

ENVELOPPE
= missions/003-handoff-routing-boundary/envelope.md
= 61184 octets
= sha256 29d46b777640eeaf22c1ca199b0e5a662f3d8f11fbd51b6e9a2a62d8e6b5e2c3
= blob   87612540014de9d9b8fcba95efa13a2b57fc8fc3
= CR 0 / LF 650 / NUL 0
= SEULE CHARGE UTILE DE DÉPÊCHE DE #27

RÉSULTAT
= missions/003-handoff-routing-boundary/result.json
= N'EXISTE PAS
```

```text
AUCUNE MISSION 004 N'EST CRÉÉE POUR CETTE RÉPARATION ANTÉRIEURE À LA DÉPÊCHE
```

Validation avec l'outillage existant, en lecture seule :

```text
validate(mission.json)       ok = true, erreurs = 0
render(mission.json)         deux rendus byte-identiques
renderCoverage(mission.json) complete = true
                             attendu 504 · rendu 504
                             omis 0 · inventés 0 · vides 0
OUTILLAGE MODIFIÉ            NON
GRAMMAIRE ÉTENDUE            NON
```

## B.13 Contrat de retour

```text
ANCIEN NOMBRE DE CHAMPS   = 307
NOUVEAU NOMBRE DE CHAMPS  = 328

IDENTIFIANTS CONSERVÉS    = 307
IDENTIFIANTS AJOUTÉS      =  21
IDENTIFIANTS RETIRÉS      =   0
IDENTIFIANTS RENOMMÉS     =   0

FAIT MODIFIÉ SUR UN CHAMP CONSERVÉ        = 0
TYPE MODIFIÉ SUR UN CHAMP CONSERVÉ        = 0
DOMAINE MODIFIÉ SUR UN CHAMP CONSERVÉ     = 1
```

Ajouts par cas matériel, 6 × 3 = 18 :

```text
required_routing_semantics_present                     SYMBOL
removal_by_existing_procedural_orchestration           SYMBOL
bounded_integration_required                           SYMBOL
substantive_human_selection_causally_required          SYMBOL
gap_gate_g4a_procedural_does_not_fully_remove_burden   SYMBOL
gap_gate_g4b_remaining_cause_classification            SYMBOL
```

Ajouts globaux, 3 :

```text
study.decisive_partition_rule                          SYMBOL
study.partition_variable_trace                         SET
study.concrete_missing_routing_capability_candidate    SET
```

Preuve de compatibilité du seul champ conservé dont le domaine change :

```text
rf-outcome
membres perdus    0
membres ajoutés   1, CONCRETE_ROUTING_SEMANTIC_GAP_CANDIDATE
= ÉLARGISSEMENT PUR
= toute valeur antérieurement admissible reste admissible, de sens identique
= aucun réemploi sémantique, aucun datum remplacé
```

```text
SUBSTITUTION PAR PROSE OPAQUE   0
AJOUTER, RETIRER OU RENOMMER UN CHAMP   = INTERDIT À L'EXÉCUTANT
```

## B.14 Couverture terminale et partition

```text
ÉTIQUETTES TERMINALES
ORDINARY_ORCHESTRATION_SUFFICIENT
BOUNDED_INTEGRATION_OPPORTUNITY
HUMAN_DECISION_DOMINATES
CONCRETE_ROUTING_SEMANTIC_GAP_CANDIDATE
INSUFFICIENT_DURABLE_EVIDENCE
BLOCKED_NON_CONFORMANT_EXECUTION
STOPPED_ON_PREFLIGHT
```

```text
COUVERTURE D'ÉTIQUETTES TERMINALES   PASS
PARTITION DÉTERMINISTE D'ISSUES      PASS

ÉTAT ANALYTIQUE RÉUSSI SANS ÉTIQUETTE            0
ÉTAT ANALYTIQUE RÉUSSI À PLUSIEURS ÉTIQUETTES    0
```

## B.15 Discipline de référence PROGRAM-STATE

```text
ref-program-state-live               non épinglée, cible d'exécution
ref-program-state-at-freeze-parent   épinglée, étiquetée historique, motif énoncé

RÉFÉRENCE PÉRIMÉE NON EXPLIQUÉE      0
```

Inchangée depuis l'autorité 47.

## B.16 Exécutant futur

```text
EXÉCUTANT                 AGENT CCR LAB #27
AUTORITÉ DE MUTATION      CRÉER UNIQUEMENT
                          missions/003-handoff-routing-boundary/result.json
COMMITS                   0
PUSHS                     0
DELTA FINAL               exactement un result.json non suivi
RECONSTRUCTION CONVERSATION  INTERDITE
RÉPONSE TECHNIQUE            INTERDITE
```

## B.17 Pare-feu de fin de ligne

```text
.gitattributes    NON MODIFIÉ
missions/**       TOUJOURS SANS ATTRIBUT eol=lf
RISQUE EOL        ÉTABLI, SÉPARÉ, NON SÉLECTIONNÉ
REMÉDIATION EOL   AUCUNE
```

## B.18 Ce que ce document ne fait pas

```text
AUTORITÉ 47 RÉÉCRITE                        NON
ÉPISODE, UNITÉ OU TYPE MODIFIÉ              NON
SIXIÈME ISSUE                               AUCUNE
ÉCART SÉMANTIQUE OBSERVÉ DANS LES CAS       NON ÉTABLI
RÉPONSE TECHNIQUE SÉLECTIONNÉE              NON
MOTEUR DE ROUTAGE                           NON SÉLECTIONNÉ
NOUVELLE API                                NON SÉLECTIONNÉE
NOUVELLE REPRÉSENTATION                     AUCUNE
NOUVELLE PRIMITIVE SÉMANTIQUE               AUCUNE
NOUVELLE EXPÉRIENCE                         AUCUNE
TOOLING-EXPERIMENT-004                      AUCUNE
NOUVELLE AIRE D'OUTILLAGE                   AUCUNE
IMPLÉMENTATION AUTORISÉE                    NON
result.json CRÉÉ                            NON
EXÉCUTANT #27 DÉPÊCHÉ                       NON
AUTORITÉS 00 À 47 MODIFIÉES                 NON
missions/001-** ET missions/002-** MODIFIÉS NON
OUTILLAGE MODIFIÉ                           NON
GRAMMAIRES ÉTENDUES                         NON
REMÉDIATION EOL                             AUCUNE
CONSÉQUENCE CCR SYSTEM                      AUCUNE
TESTS PRODUIT EXÉCUTÉS                      0
```

```text
AUTORITÉ 47
= CONSERVÉE, SAUF SÉMANTIQUE DE DOMAINE ET DE PARTITION D'ISSUES SUPERSÉDÉE

AUTORITÉ 48
= CORRECTION GOUVERNANTE ET EXÉCUTABLE

DOMAINE À CINQ ISSUES
= CLOS

PARTITION
= DÉTERMINISTE

PRÉPARATION À L'EXÉCUTION DE #27
= PASS

RÉPONSE TECHNIQUE
= NON SÉLECTIONNÉE
```
