# Travail manuel d'orchestration restant — sélection de direction

## 1. Statut et objet

```text
TYPE
= sélection de direction de programme, ratifiée par l'humain

OBJET
= choisir la prochaine direction authentique du Lab CCR, et en borner
  la question

CE DOCUMENT
= autorité de sélection de direction
= GELÉ

CORPUS HISTORIQUE
= NON GELÉ ICI

CAS
= NON SÉLECTIONNÉS ICI

MODÈLE DE COMPARAISON
= AUCUN ICI

CONTRAT DE RETOUR
= AUCUN ICI

CONCEPTION TECHNIQUE
= AUCUNE ICI

IMPLÉMENTATION
= AUCUNE ICI
```

Ce document choisit un travail et le borne. Il ne le conçoit pas, ne le gèle
pas en mission exécutable, et ne préjuge d'aucun résultat.

## 2. État de programme clos à ce point

```text
ÉTUDE DÉCISION → CONSÉQUENCE DÉTERMINISTE → CONSÉQUENCE EXÉCUTÉE
= CLOSE
= PASS WITH LIMITATIONS
= classification globale indépendante
  EXISTING_SURFACES_SUFFICIENT_WITH_ORDINARY_ORCHESTRATION_LOGIC
= écart de représentation concret NON DÉMONTRÉ

LOCAL MISSION CONSOLE V0
= IMPLÉMENTÉE / QUALIFIÉE / ÉVALUÉE EN USAGE RÉEL
= utilité historique MIXED UTILITY

U-01
= CLOS / REMÉDIÉ

FINDINGS DE CONSOLE QUALIFIÉS OUVERTS
= 0

DÉFAUTS DE CONFORMITÉ OUVERTS
= 0

TOOLING-EXPERIMENT-004
= NON JUSTIFIÉE

DÉCISIONS RATIFIÉES
= 30 avant ce document

DÉCISIONS EN ATTENTE
= 0
```

Rien de ce qui précède n'est rouvert par ce document.

## 3. La décision humaine

```text
DÉCISION
= remaining-manual-orchestration-work-study-direction-selected

PROCHAINE DIRECTION AUTHENTIQUE DU LAB
= MESURER LE TRAVAIL MANUEL D'ORCHESTRATION RESTANT
```

## 4. Question comparative première

```text
Quelle activité d'orchestration humaine encore répétée présente aujourd'hui le
cas empirique le plus fort pour la prochaine étape de R&D ?
```

```text
L'ÉTUDE EST COMPARATIVE ET GUIDÉE PAR LA PREUVE
ELLE NE PRÉSUME PAS DU VAINQUEUR
```

## 5. Famille candidate A — handoff / routage

Travail humain répété nécessaire pour déterminer et communiquer :

```text
qui reçoit la mission suivante
quelle session logique / fraîche convient
quelle charge utile exacte de mission est transférée
quelle base d'exécution s'applique
quel acteur est autorisé à produire quel artefact
où le résultat doit revenir
quelle frontière d'arrêt / de passation suit
```

```text
L'ÉTUDE FUTURE DEVRA INSPECTER DES OCCURRENCES HISTORIQUES AUTHENTIQUES
DE CE TRAVAIL MANUEL

SUPPOSER QUE CETTE FAMILLE EXIGE UN NOUVEL OUTILLAGE
= INTERDIT
```

## 6. Famille candidate B — construction du paquet de contexte

Travail humain répété nécessaire pour identifier, sélectionner et emballer le
contexte durable dont un exécutant ou un qualifieur a besoin, notamment, selon
les cas :

```text
autorités gouvernantes
têtes / blobs / arbres Git exacts
Mission Objects
Result Instances
identités de preuve
corpus historique admissible
pare-feu de sources
invariants clos
contrat de retour
frontière de mutation
exclusions connues
information de reprise
```

```text
L'ÉTUDE FUTURE DEVRA INSPECTER DES OCCURRENCES HISTORIQUES AUTHENTIQUES

SUPPOSER QUE CETTE FAMILLE EXIGE UNE NOUVELLE REPRÉSENTATION
= INTERDIT
```

## 7. La comparaison n'est pas une progression de feuille de route

```text
ORDRE DE FEUILLE DE ROUTE
≠ PREUVE DE BESOIN COURANT
```

```text
SÉLECTIONNER LE HANDOFF / ROUTAGE
AU MOTIF QU'IL RESSEMBLE À L'ÉTAPE NOMINALE SUIVANTE
= INTERDIT

SÉLECTIONNER LE PAQUET DE CONTEXTE
AU MOTIF QUE DE GRANDES INVITES ONT RÉCEMMENT PORTÉ BEAUCOUP DE CONTEXTE
= INTERDIT
```

L'étude doit mesurer une preuve durable de travail manuel répété et une
conséquence matérielle, pas une impression.

## 8. Pare-feu de fin de ligne

```text
RISQUE DE DURABILITÉ / REJEU EOL SOUS missions/**
= ÉTABLI
```

Mais :

```text
EOL
= PAS UNE FAMILLE CANDIDATE DE CETTE ÉTUDE COMPARATIVE

REMÉDIATION EOL
= NON SÉLECTIONNÉE

MAINTENANCE EOL
= PEUT ÊTRE SÉLECTIONNÉE PLUS TARD PAR L'HUMAIN
```

```text
FUSIONNER L'EOL AVEC LE HANDOFF, LE ROUTAGE OU LE PAQUET DE CONTEXTE
= INTERDIT
```

C'est un risque de durabilité et de maintenance, d'une autre nature que le
travail manuel d'orchestration que cette direction mesure.

## 9. Pare-feu des travaux clos

Non rouverts :

```text
TOOLING-EXPERIMENT-001
TOOLING-EXPERIMENT-002
TOOLING-EXPERIMENT-003
étude décision → conséquence déterministe → conséquence exécutée
qualification d'implémentation de LOCAL MISSION CONSOLE V0
qualification d'utilité historique en usage réel
cycle de vie de U-01
```

```text
LEURS PREUVES PEUVENT ÊTRE INSPECTÉES PLUS TARD
COMME PREUVE HISTORIQUE DE TRAVAIL MANUEL D'ORCHESTRATION

LEURS CONCLUSIONS RESTENT CLOSES
```

Inspecter une trace n'est pas rouvrir un verdict.

## 10. Aucune conclusion d'outillage automatique

```text
TRAVAIL MANUEL OBSERVÉ        ≠ NOUVEL OUTILLAGE REQUIS
TRAVAIL RÉPÉTÉ                ≠ NOUVELLE REPRÉSENTATION REQUISE
GRAND PAQUET DE CONTEXTE      ≠ PRIMITIVE DE PAQUET DE CONTEXTE REQUISE
ROUTAGE MANUEL                ≠ MOTEUR DE ROUTAGE REQUIS
```

L'étude ultérieure devra d'abord poser, dans cet ordre :

```text
le travail est-il matériellement répété ?
est-il assez coûteux, fragile ou bloquant pour compter ?
la conséquence est-elle démontrée ?
les surfaces existantes plus une orchestration ordinaire y suffisent-elles déjà ?
un écart d'outillage concret est-il réellement établi ?
```

## 11. Aucune expérience nouvelle sélectionnée

```text
NOUVELLE EXPÉRIENCE
= NON SÉLECTIONNÉE
```

Issues admises pour l'étude comparative future :

```text
HANDOFF_ROUTING
CONTEXT_PACKAGE
NEITHER_CURRENTLY_JUSTIFIED
INCONCLUSIVE_ON_DURABLE_EVIDENCE
```

Elle pourra aussi conclure que le besoin observé se traite par une intégration
ordinaire ou par une discipline procédurale, sans nouvelle expérience
d'outillage.

```text
TOOLING-EXPERIMENT-004 CRÉÉE PAR CETTE MATÉRIALISATION
= AUCUNE
```

## 12. Aucun vainqueur présumé

```text
FAMILLE GAGNANTE
= NON SÉLECTIONNÉE

PRÉFÉRENCE DURABLE ENTRE A ET B
= AUCUNE ÉTABLIE ICI
```

Les deux familles sont nommées pour être comparées, pas pour être départagées
par ce document.

## 13. Étape suivante

```text
ACTION DE PROGRAMME SUIVANTE
= GELER UNE ÉTUDE COMPARATIVE BORNÉE, EXÉCUTABLE ET EN LECTURE SEULE
```

Le gel devra définir, AVANT toute exécution comparative :

```text
corpus historique admissible
cas exacts
règles de preuve
dimensions mesurables
contrat de retour
critères de succès
frontière de lecture / écriture
```

```text
IMPLÉMENTER                                NON
CRÉER UNE EXPÉRIENCE D'OUTILLAGE           NON
CONCEVOIR UNE REPRÉSENTATION               NON
SÉLECTIONNER UNE CONSÉQUENCE CCR SYSTEM    NON
```

## 14. Ce que ce document ne fait pas

```text
CORPUS HISTORIQUE GELÉ                      NON
CAS SÉLECTIONNÉS                            NON
DIMENSIONS DE MESURE GELÉES                 NON
MODÈLE DE COMPARAISON GELÉ                  NON
CONTRAT DE RETOUR GELÉ                      NON
CRITÈRES DE SUCCÈS GELÉS                    NON
MISSION OBJECT CRÉÉ                         NON
EXÉCUTANT ALLOUÉ                            AUCUN
FAMILLE GAGNANTE SÉLECTIONNÉE               NON
NOUVELLE EXPÉRIENCE D'OUTILLAGE             AUCUNE
TOOLING-EXPERIMENT-004                      AUCUNE
NOUVELLE REPRÉSENTATION                     AUCUNE
NOUVELLE AIRE D'OUTILLAGE                   AUCUNE
IMPLÉMENTATION AUTORISÉE                    NON
REMÉDIATION EOL                             AUCUNE
.gitattributes MODIFIÉ                      NON
CONSÉQUENCE CCR SYSTEM                      AUCUNE
AUTORITÉS 00 À 42 MODIFIÉES                 NON
OUTILLAGE EXISTANT MODIFIÉ                  NON
missions/** MODIFIÉ                         NON
TESTS EXÉCUTÉS                              0
```

```text
PROCHAINE DIRECTION AUTHENTIQUE DU LAB
= MESURER LE TRAVAIL MANUEL D'ORCHESTRATION RESTANT
= SÉLECTIONNÉE PAR L'HUMAIN

FAMILLES COMPARÉES
= HANDOFF / ROUTAGE
= CONSTRUCTION DU PAQUET DE CONTEXTE

VAINQUEUR
= NON SÉLECTIONNÉ

ÉTUDE COMPARATIVE
= NON ENCORE GELÉE

EXÉCUTION
= NON COMMENCÉE
```
