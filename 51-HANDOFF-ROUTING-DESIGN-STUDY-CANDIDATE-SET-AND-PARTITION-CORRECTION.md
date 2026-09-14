# Handoff / routage — correction d'ensemble de candidats et de partition

## 1. Statut

```text
AUTORITÉ CORRIGÉE
= 50-HANDOFF-ROUTING-BOUNDED-INTEGRATION-DESIGN-STUDY-FREEZE.md
= sha256 a3f2f32e818f4b172325cac7e705a26979e84d54d19d0f1d883fe437c5ddc0a6
= blob   4b1beadc031a15e0764b132c552b292e2e4a1faf

MATÉRIALISATION PROCÉDURALE DE L'AUTORITÉ 50
= VALIDE

ÉLÉMENTS VALIDES DE L'AUTORITÉ 50
= CONSERVÉS, SAUF LÀ OÙ EXPRESSÉMENT SUPERSÉDÉS

DÉFAUT MATÉRIEL DE CONCEPTION DE L'AUTORITÉ 50
= L'ORDRE DES ISSUES PEUT MASQUER PLUSIEURS CONCEPTIONS MINIMALES
  MATÉRIELLEMENT DISTINCTES

PORTÉE DE LA CORRECTION
= MULTIPLICITÉ DES CANDIDATS
= DOMINANCE ET NON-DOMINANCE
= ORDRE DE SÉLECTION D'ISSUE
= RELATIONS DE RETOUR NÉCESSAIRES POUR RECONSTRUIRE CES FAITS

NOUVELLE DÉCISION HUMAINE
= AUCUNE

NOUVELLE PRÉFÉRENCE DE CLASSE
= AUCUNE

#29 AVANT CORRECTION
= SUSPENDU
```

```text
L'AUTORITÉ 50 N'EST PAS ÉDITÉE
ELLE DEMEURE LA PREUVE DURABLE DU CONTRAT ORIGINELLEMENT GELÉ
```

## 2. Le défaut exact

La règle 1 de l'autorité 50 déclenchait sur « au moins un candidat
EXISTING_SURFACE_COMPOSITION minimal conforme satisfait M1..M11 ».

```text
UN SEUL CANDIDAT DE COMPOSITION CONFORME SUFFISAIT
À PRODUIRE EXISTING_SURFACE_COMPOSITION_SUFFICIENT
MÊME LORSQUE PLUSIEURS CANDIDATS MINIMAUX CONFORMES
MATÉRIELLEMENT DISTINCTS DEMEURAIENT
```

Conséquence : un choix de conception humain authentique pouvait être
silencieusement préempté par une issue de classe.

```text
LE PARE-FEU DE CHOIX HUMAIN DE L'AUTORITÉ 50 EXISTAIT DANS SA PROSE
IL N'ÉTAIT PAS PORTÉ PAR LA RÈGLE ORDONNÉE
```

C'est un défaut de conception d'étude, pas une faute de matérialisation.

## 3. Éléments de l'autorité 50 conservés inchangés

```text
question canonique de l'étude de conception
noyau matériel EP-02 / EP-03 / EP-04
base qualifiée S / P / B / H
20 unités de récurrence
inventaire R1..R8
ligne de base de capacité technique
pare-feu de sémantique existante
frontière d'abstraction des candidats
M1..M11
test de minimalité par retrait de composant
corpus de preuve
six limitations héritées
cinq étiquettes d'issue analytique
pare-feu d'implémentation
pare-feu de moteur de routage
pare-feu de représentation nouvelle
pare-feu de sémantique nouvelle
index de mission 004, qui n'est pas TOOLING-EXPERIMENT-004
chemin de résultat futur
exécutant logique futur = AGENT CCR LAB #29
pare-feu de l'incident de cible erronée
```

```text
CES SUJETS NE SONT PAS ROUVERTS
```

## 4. Modèle ensembliste de candidats

Après construction des candidats, vérification de conformité et minimalité par
retrait de composant :

```text
MINIMAL_CONFORMANT_CANDIDATE_SET
= tous les candidats matériellement distincts qui
  · satisfont M1..M11
  · satisfont la minimalité par retrait de composant
  · demeurent dans la frontière de sémantique existante
```

La distinction matérielle reste exactement le concept de l'autorité 50 : deux
candidats ne diffèrent matériellement que si la différence change au moins un
de

```text
localisation de la responsabilité d'intégration
frontière d'autorité
frontière de contrat de surface
frontière de propagation
frontière de persistance
frontière de vérification ou d'arrêt
ensemble minimal de composants
mécanisme de suppression de charge pour EP-02 / EP-03 / EP-04
```

```text
DIFFÉRENCE COSMÉTIQUE OU DE SYNTAXE D'IMPLÉMENTATION
= PAS UNE DISTINCTION MATÉRIELLE
```

## 5. Sémantique de dominance

```text
DETERMINISTICALLY_DOMINATED
= uniquement là où les exigences gelées et la preuve admise établissent qu'un
  candidat ne peut demeurer une alternative authentique parce qu'un autre
  satisfait toutes les propriétés requises tandis que le premier porte un
  composant matériel strictement inutile ou échoue à une exigence gelée
```

```text
LA DOMINANCE DOIT ÊTRE
ADOSSÉE À LA PREUVE · REPRODUCTIBLE · NON PRÉFÉRENTIELLE
```

Ne jamais inférer la dominance de :

```text
préférence de simplicité · goût architectural · moins de fichiers nouveaux
familiarité · commodité d'implémentation · classe de surface seule
```

```text
EXISTING_SURFACE_COMPOSITION
NE DOMINE PAS AUTOMATIQUEMENT
BOUNDED_SURFACE_EXTENSION

BOUNDED_SURFACE_EXTENSION
NE DOMINE PAS AUTOMATIQUEMENT
EXISTING_SURFACE_COMPOSITION

AUCUNE PRÉFÉRENCE DE CLASSE N'EST AUTORISÉE
```

Puis :

```text
REMAINING_MINIMAL_CANDIDATES
= MINIMAL_CONFORMANT_CANDIDATE_SET
  moins les candidats prouvés DETERMINISTICALLY_DOMINATED
```

```text
CHAQUE CANDIDAT RETIRÉ EXIGE UNE PREUVE DE DOMINANCE EXACTE
DOMINANCE NON ÉTABLIE → LE CANDIDAT DEMEURE
```

## 6. Pare-feu de choix humain, corrigé

```text
SI  |REMAINING_MINIMAL_CANDIDATES| ≥ 2
ET  aucun départage déterministe déjà gelé n'en sélectionne exactement un
ALORS
= MULTIPLE_MINIMAL_CONFORMANT_DESIGNS_REQUIRE_HUMAN_SELECTION
```

```text
CETTE RÈGLE EST PORTANTE

AUCUNE ISSUE DE CLASSE À CANDIDAT UNIQUE NE PEUT LA PRÉEMPTER

CHOIX DE CONCEPTION MATÉRIEL AUTHENTIQUE
→ SÉLECTION HUMAINE

FABRIQUER UN DÉPARTAGE
= INTERDIT
```

## 7. Partition ordonnée corrigée

Mêmes cinq étiquettes d'issue analytique. Règles remplacées.

```text
RÈGLE 0
si une inconnue matérielle peut changer
· la conformité d'un candidat
· sa minimalité
· la distinction matérielle
· un statut de dominance
· la cardinalité de l'ensemble restant
· la classe d'un candidat
· ou la branche finale
→ INSUFFICIENT_DURABLE_EVIDENCE
ne pas dévier si toute complétion admissible produit la même issue finale

RÈGLE 1
|REMAINING_MINIMAL_CANDIDATES| ≥ 2
et aucun départage déterministe gelé n'en sélectionne exactement un
→ MULTIPLE_MINIMAL_CONFORMANT_DESIGNS_REQUIRE_HUMAN_SELECTION

RÈGLE 2
|REMAINING_MINIMAL_CANDIDATES| = 1
et la classe de l'unique candidat restant est EXISTING_SURFACE_COMPOSITION
→ EXISTING_SURFACE_COMPOSITION_SUFFICIENT

RÈGLE 3
|REMAINING_MINIMAL_CANDIDATES| = 1
et la classe de l'unique candidat restant est BOUNDED_SURFACE_EXTENSION
→ BOUNDED_SURFACE_EXTENSION_JUSTIFIED

RÈGLE 4
|REMAINING_MINIMAL_CANDIDATES| = 0
et une preuve positive suffisamment exhaustive établit qu'aucun candidat dans
la frontière gelée ne peut satisfaire les exigences
→ NO_CONFORMANT_BOUNDED_DESIGN_ESTABLISHED

RÈGLE 5
tout reste évidentiaire authentique
→ INSUFFICIENT_DURABLE_EVIDENCE
```

Lorsqu'un départage déterministe gelé désigne exactement un candidat parmi
plusieurs, l'ensemble effectif se réduit à ce singleton et les règles 2 ou 3
statuent sur sa classe. Aucune étiquette intermédiaire n'existe.

## 8. Preuve mécanique de partition

Reconstruite sur une abstraction qui représente explicitement la multiplicité
des candidats. La preuve 108 → 67 de l'autorité 50 n'est pas réemployée.

```text
VARIABLES
card    cardinalité de l'ensemble minimal restant après dominance
        0 / 1 / 2+ / NOT_ESTABLISHED
tie     départage déterministe gelé désignant exactement un
        YES / NO / NOT_ESTABLISHED
ecls    classe du candidat effectif unique
        COMPOSITION / BOUNDED_EXTENSION / NOT_APPLICABLE / NOT_ESTABLISHED
imp     preuve positive suffisamment exhaustive d'impossibilité
        YES / NO / NOT_ESTABLISHED
xu      inconnue matérielle hors abstraction changeant la branche
        YES / NO
```

```text
ÉTATS BRUTS                              288
ÉTATS ADMISSIBLES                        124

ÉTATS FINAUX SANS ISSUE                    0
ASSIGNATIONS FINALES MULTIPLES             0
TOUTES LES ÉTIQUETTES DANS LES CINQ     OUI
MULTIPLICITÉ MASQUÉE PAR UNE ISSUE DE CLASSE   0
```

Un état portant des inconnues n'est admissible que s'il possède au moins une
complétion concrète admissible ; les états contradictoires sont exclus, ce qui
laisse la fonction totale sur les cinq étiquettes.

Répartition :

```text
INSUFFICIENT_DURABLE_EVIDENCE                                88
EXISTING_SURFACE_COMPOSITION_SUFFICIENT                      14
BOUNDED_SURFACE_EXTENSION_JUSTIFIED                          14
MULTIPLE_MINIMAL_CONFORMANT_DESIGNS_REQUIRE_HUMAN_SELECTION   6
NO_CONFORMANT_BOUNDED_DESIGN_ESTABLISHED                      2
                                                            ---
                                                            124
```

États de cohérence, chacun à résolution unique :

```text
S1  un candidat de composition restant
    → EXISTING_SURFACE_COMPOSITION_SUFFICIENT

S2  un candidat d'extension bornée restant
    → BOUNDED_SURFACE_EXTENSION_JUSTIFIED

S3  deux candidats de composition matériellement distincts, sans départage
    → MULTIPLE_MINIMAL_CONFORMANT_DESIGNS_REQUIRE_HUMAN_SELECTION

S4  un candidat de composition et un d'extension bornée, aucun dominé,
    sans départage
    → MULTIPLE_MINIMAL_CONFORMANT_DESIGNS_REQUIRE_HUMAN_SELECTION

S5  deux candidats d'extension bornée matériellement distincts,
    même large classe, sans départage
    → MULTIPLE_MINIMAL_CONFORMANT_DESIGNS_REQUIRE_HUMAN_SELECTION

S6  zéro candidat restant et preuve positive suffisamment exhaustive
    d'impossibilité
    → NO_CONFORMANT_BOUNDED_DESIGN_ESTABLISHED

S7  inconnue matérielle changeant la branche
    → INSUFFICIENT_DURABLE_EVIDENCE
```

Départage gelé réduisant à un singleton, vérifié séparément :

```text
TB1  départage désignant un candidat de composition
     → EXISTING_SURFACE_COMPOSITION_SUFFICIENT
TB2  départage désignant un candidat d'extension bornée
     → BOUNDED_SURFACE_EXTENSION_JUSTIFIED
```

Contre-épreuve du défaut : S3, S4 et S5 portent tous une cardinalité ≥ 2.
Sous l'ancienne règle 1, un candidat de composition conforme suffisait à
produire une issue de classe et masquait le choix humain.

```text
SOUS LA RÈGLE CORRIGÉE
ÉTATS DE CARDINALITÉ ≥ 2 SANS DÉPARTAGE RECEVANT UNE ÉTIQUETTE DE CLASSE
= 0
```

```text
LA PREUVE ÉTABLIT UNE COUVERTURE SÉMANTIQUE DE LA MULTIPLICITÉ,
NON SEULEMENT LA TOTALITÉ D'UNE ABSTRACTION QUI L'OMETTAIT

OUTILLAGE DU LAB MODIFIÉ POUR OBTENIR LA PREUVE
= AUCUN
```

## 9. Mission Object corrigé

```text
VERSION DE L'AUTORITÉ 50
= HISTORIQUE / SUPERSÉDÉE AVANT DÉPÊCHE
= mission.json  blob 96acd8ff1c99b9b58d9afd24ae1609f3f13b0328
= envelope.md   blob caf0dbdc9c0757e577945c4a53611e69018a38e1
= preuve historique immuable au commit 98c3949d6a593866256a0430934b045131e7009e

VERSION DE L'AUTORITÉ 51
= SEUL CONTRAT EXÉCUTABLE

MISSION OBJECT
= missions/004-handoff-routing-bounded-integration-design-study/mission.json
= 90258 octets
= sha256 5e0470869a8a4cc5f6adcd2fc53fc9f6022340d4370080041de4f3e69c6de3f5
= blob   832dd4cf0dc618b3a73a7536fb758f5b8b7fc912
= CR 0 / LF 3567 / NUL 0

ENVELOPPE
= missions/004-handoff-routing-bounded-integration-design-study/envelope.md
= 30874 octets
= sha256 3ab0f1d20f6f02a62e13f5c16841aff214c135af6db8378af499b9b9581a7b9e
= blob   8969242863b4d3ef20e09c47cd593f648f246cd2
= CR 0 / LF 426 / NUL 0

RÉSULTAT
= missions/004-handoff-routing-bounded-integration-design-study/result.json
= ABSENT
```

Validation avec l'outillage existant, non modifié :

```text
validate(mission.json)        ok = true, erreurs = 0
render(mission.json)          deux rendus byte-identiques
renderCoverage(mission.json)  complete = true
                              attendu 264 · rendu 264
                              omis 0 · inventés 0 · vides requis 0
SCHÉMA ÉTENDU                 NON
VOCABULAIRE NOUVEAU           AUCUN
OUTILLAGE MODIFIÉ             NON
```

L'enveloppe est régénérée depuis le Mission Object corrigé par le rendeur
existant ; elle n'est jamais éditée à la main.

## 10. Contrat de retour corrigé

```text
ANCIEN NOMBRE DE RELATIONS   = 67
RELATIONS AJOUTÉES           = 11
RELATIONS RETIRÉES           =  3
RELATIONS RENOMMÉES          =  0
NOUVEAU NOMBRE DE RELATIONS  = 75

RELATIONS CONSERVÉES         = 64
FAIT MODIFIÉ SUR UNE CONSERVÉE     = 0
TYPE MODIFIÉ SUR UNE CONSERVÉE     = 0
DOMAINE MODIFIÉ SUR UNE CONSERVÉE  = 0
```

Ajouts :

```text
candidate_set.minimal_conformant_candidate_ids                 SET
candidate_set.material_distinctness_relations                  SET
candidate_set.deterministic_dominance_relations                SET
candidate_set.deterministically_dominated_candidate_count      SCALAR
candidate_set.dominance_basis                                  SET
candidate_set.remaining_minimal_candidate_ids                  SET
candidate_set.remaining_minimal_candidate_count                SCALAR
candidate_set.effective_singleton_candidate_class              SYMBOL
candidate_set.frozen_deterministic_tiebreak_exists             SYMBOL
candidate_set.frozen_deterministic_tiebreak_basis              SET
partition.outcome_changing_material_unknown                    SYMBOL
```

Retraits, et leur nécessité logique :

```text
rf-partition-comp        minimal_conformant_composition_candidate_exists
rf-partition-ext         minimal_conformant_bounded_extension_class_count
rf-partition-distinct    multiple_distinct_minimal_designs_without_tiebreak
```

```text
CES TROIS RELATIONS ENCODENT L'ABSTRACTION SUPERSÉDÉE, OÙ L'EXISTENCE D'UN
CANDIDAT D'UNE CLASSE SUFFISAIT À TRANCHER LA BRANCHE.

LES CONSERVER LAISSERAIT DEUX ENCODAGES PARALLÈLES ET POTENTIELLEMENT
CONTRADICTOIRES DE LA MÊME DÉCISION DE BRANCHE, ET PERMETTRAIT DE
RECONSTITUER EXACTEMENT LE MASQUAGE CORRIGÉ.

C'EST LA NÉCESSITÉ LOGIQUE EXIGÉE POUR UN RETRAIT.
```

```text
rf-partition-none EST CONSERVÉE À L'IDENTIQUE
= elle porte encore exactement la preuve positive d'impossibilité
= aucun champ d'impossibilité nouveau n'est créé
```

```text
study.implementation_authorization
= PREDETERMINED = NO
= INCHANGÉ

RÉPONSE D'ÉTUDE PRÉDÉTERMINÉE   AUCUNE
SUBSTITUTION PAR PROSE OPAQUE   0
```

## 11. Discipline inchangée

```text
COUVERTURE TERMINALE
= 8 étiquettes, 5 analytiques et 3 procédurales
= chemin analytique réussi sans étiquette      0
= chemin analytique réussi à plusieurs étiquettes  0

RÉFÉRENCE PROGRAM-STATE PÉRIMÉE NON EXPLIQUÉE  0
RÉSULTAT FUTUR                                 ABSENT
EXÉCUTANT FUTUR                                AGENT CCR LAB #29
COMMITS / PUSHS DE L'EXÉCUTANT                 0 / 0
.gitattributes                                 NON MODIFIÉ
INCIDENT DE CIBLE ERRONÉE                      DIFFÉRÉ, HORS ÉTUDE
```

## 12. Ce que ce document ne fait pas

```text
AUTORITÉ 50 ÉDITÉE                           NON
NOYAU MATÉRIEL MODIFIÉ                       NON
UNITÉS DE RÉCURRENCE OU R1..R8 MODIFIÉS      NON
M1..M11 MODIFIÉES                            NON
ÉTIQUETTES D'ISSUE MODIFIÉES                 NON
SIXIÈME ISSUE                                AUCUNE
NOUVELLE DÉCISION HUMAINE                    AUCUNE
PRÉFÉRENCE DE CLASSE INTRODUITE              AUCUNE
DÉPARTAGE FABRIQUÉ                           AUCUN
CANDIDAT SÉLECTIONNÉ                         NON
RÉPONSE D'ÉTUDE                              NON ÉTABLIE
CONCEPTION TECHNIQUE EXACTE                  NON SÉLECTIONNÉE
IMPLÉMENTATION AUTORISÉE                     NON
MOTEUR DE ROUTAGE                            NON SÉLECTIONNÉ
NOUVELLE REPRÉSENTATION                      AUCUNE
NOUVELLE PRIMITIVE SÉMANTIQUE                AUCUNE
TOOLING-EXPERIMENT-004                       AUCUNE
NOUVELLE AIRE D'OUTILLAGE                    AUCUNE
result.json CRÉÉ                             NON
EXÉCUTANT #29 DÉPÊCHÉ                        NON
REVUE D'INCIDENT OUVERTE                     NON
AUTORITÉS 00 À 50 MODIFIÉES                  NON
missions/001-**, 002-**, 003-** MODIFIÉS     NON
OUTILLAGE MODIFIÉ                            NON
GRAMMAIRES ÉTENDUES                          NON
TESTS PRODUIT EXÉCUTÉS                       0
EXÉCUTION D'ÉTUDE DE CONCEPTION              0
```

```text
AUTORITÉ 50
= CONSERVÉE, SÉMANTIQUE DE SÉLECTION D'ISSUE SUPERSÉDÉE EN PARTIE

AUTORITÉ 51
= CONTRAT CORRIGÉ D'ENSEMBLE DE CANDIDATS ET DE PARTITION

MULTIPLICITÉ
= PRIME SUR LA CLASSE

PARTITION
= DÉTERMINISTE ET MÉCANIQUEMENT CLOSE

PRÉPARATION À L'EXÉCUTION DE #29
= PASS

EXÉCUTION
= NON COMMENCÉE
```
