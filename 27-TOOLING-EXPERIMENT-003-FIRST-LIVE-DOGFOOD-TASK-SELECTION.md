# TOOLING-EXPERIMENT-003 — sélection de la première tâche de dogfood en usage réel

## 1. Statut et objet

```text
TYPE
= sélection de tâche, ratifiée par l'humain

EXPÉRIENCE
= TOOLING-EXPERIMENT-003

OBJET
= choisir la première tâche réelle du Lab qui servira de dogfood en usage réel
  à Result Instance v0, et en borner le périmètre

CE DOCUMENT
= autorité de sélection
= GELÉ

CONCEPTION DU DOGFOOD
= AUCUNE ICI

MISSION OBJECT
= AUCUN ICI

CONTRAT DE RETOUR
= AUCUN ICI

EXÉCUTANT
= AUCUN

MUTATION DU README
= 0
```

Ce document choisit une tâche et la borne. Il ne conçoit pas le dogfood, et il
n'exécute rien.

## 2. La décision humaine

```text
PREMIÈRE TÂCHE DE DOGFOOD EN USAGE RÉEL DE TE003
= MAINTENANCE BORNÉE DU README
```

Objectif de la tâche, énoncé indépendamment de TE003 :

```text
réconcilier README.md avec l'état durable courant du Lab CCR, pour :
  l'index des autorités et documents durables
  l'index de l'outillage du Lab
  le statut expérimental courant de TE001, TE002 et TE003
  la présence de l'outillage Result Instance
  les énoncés de statut expérimental devenus faux
```

```text
TRAVAIL DE COUVERTURE SYNTHÉTIQUE
= NON
```

Cette tâche existait avant TE003 et existerait sans elle.

## 3. Périmètre gelé

DANS LE PÉRIMÈTRE :

```text
documentation d'état du Lab dans le README

autorités durables du Lab 15 à 26

statut courant de TE001
= question empirique répondue positivement pour le périmètre éprouvé
= flux IMPLEMENTED
= phase D exécutée
= RESULT-001 présent

statut courant de TE002
= CLOSED
= PASS WITH LIMITATIONS

statut courant de TE003
= OPEN
= conception sémantique de Result Instance ratifiée
= conception d'implémentation ratifiée
= logiciel d'exécution implémenté / structurellement qualifié
= qualification historique corrective courante
= capture par un exécutant en usage réel PAS ENCORE ÉPROUVÉE

index de l'outillage
= inclure tooling/result-instance/

index des documents durables
= réconcilier les autorités courantes du Lab manquantes

énoncés devenus faux, portant sur :
= TE002 présentée comme OPEN
= évaluation de suffisance de DOGFOOD-001 « non prononcée »
= question expérimentale génériquement « UNANSWERED »
= absence complète de TE003 et de Result Instance
```

HORS PÉRIMÈTRE :

```text
matériel CASE / feedback tourné vers CCR
preuve CCR System protégée
réinterprétation de CASE-001 à CASE-005
réinterprétation des arcs de feedback
normalisation du cycle de vie de TE001
politique EOL des autorités racine
rafraîchissement de git_context
réparation d'ev-022
modification de l'implémentation TE003
réparation de l'autorité 25 au-delà de sa supersession par l'autorité 26
nettoyage sans rapport
```

```text
MAINTENANCE DU README
≠ AUTORISATION DE RÉÉCRIRE LE README
```

## 4. Résultat de l'étude de candidats

L'étude préalable, conduite en lecture seule, a établi :

```text
ENSEMBLE DES TRAVAUX RÉELS COURANTS ÉLIGIBLES
= EXACTEMENT UN

maintenance du README
= ÉLIGIBLE MAINTENANT

normalisation du cycle de vie de TE001
= BLOQUÉE PAR UNE DÉCISION DE GOUVERNANCE HUMAINE PRÉALABLE

rafraîchissement de git_context dans PROGRAM-STATE
= DIFFÉRÉ / NON DÛ ACTUELLEMENT

réparation de la provenance ev-022
= DIFFÉRÉE / NON DUE ACTUELLEMENT

couverture EOL des autorités racine
= DIFFÉRÉE / NON DUE ACTUELLEMENT
= et exigerait une décision de politique préalable si elle était introduite
  plus tard
```

```text
CANDIDAT ÉCARTÉ OU DIFFÉRÉ
≠ CONSTAT EXIGEANT UNE REMÉDIATION
```

Aucun de ces éléments n'est promu en défaut à réparer.

## 5. Pourquoi c'est un travail réel

Établi sur la preuve durable du dépôt, à HEAD :

```text
EXISTE INDÉPENDAMMENT DE TE003
= OUI
= l'autorité 22 § 11 le classe MAINTENANCE, et la péremption précède TE003

MATÉRIELLEMENT PÉRIMÉ AUJOURD'HUI
= OUI
= 26 autorités dans le dépôt, index arrêté à 14 : 11 documents non indexés
= 3 aires d'outillage, 2 citées : tooling/result-instance/ absente
= « CURRENT LAB STREAM = TOOLING EXPERIMENT 002 = OPEN », contredit par
  PROGRAM-STATE (te002 CLOSED, te003 OPEN) et par l'autorité 20 § 8
= « DOGFOOD-001 … sufficiency evaluation not pronounced », contredit par
  l'autorité 15, qui la prononce, et par les autorités 17 et 19
= « EXPERIMENTAL QUESTION = UNANSWERED », contredit par l'autorité 20 § 3 et
  par RESULT-001 § 5
= zéro mention de TE003 et de Result Instance

VAUDRAIT SANS TE003
= OUI
= c'est l'index public du dépôt

BORNÉE À UN ARTEFACT EXISTANT
= OUI
= README.md, empreinte de départ ea62342d4ef45314b7331d9f212e057e88999d54

EFFETS OBJECTIVEMENT OBSERVABLES
= OUI
= empreinte d'arrivée, chemins modifiés, effets Git

ROUVRE UNE EXPÉRIENCE CLOSE
= NON
= le README DÉCRIT les cas clos ; la tâche est une maintenance ordinaire que
  TOOLING-EXPERIMENT-002 avait empruntée, pas un artefact de TE002

EXIGE UNE PREUVE CCR SYSTEM PROTÉGÉE
= NON, sous le périmètre du § 3
= les sections tournées vers CCR sont explicitement exclues

EXIGE UNE DÉCISION HUMAINE PRÉALABLE NON RÉSOLUE
= NON
= l'état cible est entièrement déterminé par les autorités 15 à 26,
  PROGRAM-STATE et RESULT-001

EXÉCUTABLE SOUS LA SÉMANTIQUE GELÉE DE RESULT INSTANCE v0
= OUI
= aucune extension requise
```

```text
SÉLECTIONNÉE PARCE QU'ELLE EXERCE MISSION OBJECT
= NON
```

Ce n'est pas le motif, et ce document ne l'invoque pas comme tel.

## 6. Adéquation de Mission Object

```text
MISSION OBJECT POUR LE DOGFOOD FUTUR
= APPROPRIÉ
```

Motif tiré de la tâche elle-même :

```text
transformation bornée d'un artefact
contraintes explicites de périmètre et de préservation
exigences de retour factuel prospectives
effets Git possibles
possibilités d'état partiel
état de départ et état d'arrivée identifiables par empreinte
```

```text
MISSION OBJECT
= NON CRÉÉ ICI

CONTRAT DE RETOUR
= NON CRÉÉ ICI
```

```text
ADÉQUATION DE MISSION OBJECT
≠ MOTIF DE SÉLECTION DE LA TÂCHE
```

## 7. Objet expérimental du dogfood à venir

Écart empirique que la tâche sélectionnée servira à éprouver :

```text
exécutant réel

→ accomplit une maintenance réelle du README

→ produit LUI-MÊME l'instance Result Instance v0

→ la valide

→ gèle les octets exacts avant la passation

→ annonce l'instance gelée

→ l'orchestration en aval consomme le résultat factuel depuis :
    l'instance gelée
    + les autorités de mission et de contrat de retour gelées
    + les preuves durables explicitement référencées

→ aucune reconstruction factuelle depuis la prose de session

→ la qualification de la justesse du README a lieu ensuite
```

À conserver sans confusion possible :

```text
SUCCÈS DE LA TÂCHE README
≠ SUCCÈS DE TE003
```

```text
SUCCÈS DU DOGFOOD EN USAGE RÉEL DE TE003
= le résultat factuel d'exécution est capturé durablement et consommable
  sans repli factuel sur la prose de session, sous les critères
  expérimentaux gelés
```

```text
CRITÈRES DE SUCCÈS EXACTS DU DOGFOOD
= NON GELÉS ICI
= ils appartiennent à la mission de conception suivante, et aux autorités
  23 et 24
```

## 8. Contrôle de familiarité

Le README a déjà servi de tâche à DOGFOOD-001, DOGFOOD-002 et DOGFOOD-003. Il
faut donc écrire ceci sans détour :

```text
MÉMOIRE DES DOGFOODS ANTÉRIEURS
= PAS UNE PREUVE FACTUELLE POUR LE DOGFOOD TE003 À VENIR

PROSE DE SESSION
= PAS UN REPLI FACTUEL
```

Entrées factuelles admissibles en aval, et elles seules :

```text
l'instance de résultat gelée
les autorités de mission et de contrat gelées
les preuves durables du dépôt explicitement référencées
```

```text
LECTURE DU README LUI-MÊME POUR QUALIFIER SON CONTENU
= AUTORISÉE
= c'est une preuve durable, et non le repli interdit sur la prose de session
```

La distinction tient à ceci : l'instance porte ce qui a été RAPPORTÉ ; le
README porte ce qui a été ÉCRIT. Juger le second est une qualification, et
elle a lieu après.

## 9. Limite connue et bornée

```text
PREMIER DOGFOOD
= attendu adossé à Mission Object / à un contrat
```

Par conséquent :

```text
RÉUSSIR CE DOGFOOD
≠ validation en usage réel de la capture adossée à un protocole
```

```text
SECONDE EXÉCUTION FABRIQUÉE POUR COMPLÉTER UNE MATRICE
= NON JUSTIFIÉE
```

La capture adossée à un protocole demeure une limite possible, tant qu'un
travail réel ne l'exerce pas naturellement.

```text
NON-PRODUCTION STRUCTURELLE
= PEUT RESTER NATURELLEMENT NON EXERCÉE
```

```text
ÉCHEC INDUIT POUR EXERCER UNE BRANCHE D'ÉTAT PARTIEL
= INTERDIT
```

Un succès ordinaire est une preuve expérimentale tout aussi valable qu'un
blocage.

## 10. Ce que ce document ne fait pas

```text
CONCEPTION DU DOGFOOD                     AUCUNE
MISSION OBJECT CRÉÉ                       NON
CONTRAT DE RETOUR CRÉÉ                    NON
CHAMPS DE RETOUR DÉFINIS                  AUCUN
IDENTIFIANTS DE FAIT DÉFINIS              AUCUN
INSTANCE DE RÉSULTAT CRÉÉE                AUCUNE
EXÉCUTANT SÉLECTIONNÉ OU ALLOUÉ           AUCUN
ENVELOPPE ENGENDRÉE                       AUCUNE
DOGFOOD EXÉCUTÉ                           NON
README MODIFIÉ                            NON
AUTORITÉS 23 À 26 MODIFIÉES               NON
LOGICIEL RESULT INSTANCE MODIFIÉ          NON
ARTEFACTS DE QUALIFICATION MODIFIÉS       NON
RESULT-001 MODIFIÉ                        NON
MISSION OBJECT RUNTIME MODIFIÉ            NON
FLUX DE DOGFOOD SÉPARÉ CRÉÉ               NON
NOUVEL ÉTAT DE CYCLE DE VIE INVENTÉ       NON
TESTS EXÉCUTÉS                            0
```

```text
TOOLING-EXPERIMENT-003
= OPEN

PREMIÈRE TÂCHE DE DOGFOOD EN USAGE RÉEL
= SÉLECTIONNÉE
= MAINTENANCE BORNÉE DU README

CONCEPTION DU DOGFOOD
= NON COMMENCÉE

CAPTURE PAR UN EXÉCUTANT EN USAGE RÉEL
= PAS ENCORE ÉPROUVÉE
```
