# TOOLING-EXPERIMENT-001 — provenance de la décision de sélection

## 1. Statut et objet

```text
TYPE
= autorité de provenance, ratifiée par l'humain

PORTÉE
= UNE décision historique déjà existante

OBJET
= établir durablement le fait humain qui soutient cette décision

CE DOCUMENT
= autorité de preuve
= GELÉ

NOUVELLE DÉCISION
= AUCUNE
```

Ce document est étroit et autoportant. Il n'a qu'un seul travail, et il ne fait
que celui-là.

## 2. Fait établi

```text
IDENTIFIANT DE LA DÉCISION HISTORIQUE
= tooling-experiment-001-selected

ÉTAT DE LA DÉCISION
= RATIFIED

FAIT ÉTABLI
= l'autorité humaine a ratifié la sélection de TOOLING-EXPERIMENT-001 comme
  flux de travail du Lab, au point de sélection historique.
```

C'est le fait, et il est entier. La décision elle-même n'est ni rouverte, ni
modifiée, ni reprise : elle existait déjà, elle vaut déjà `RATIFIED`, et ce
document ne fait qu'écrire durablement ce qui la soutient.

## 3. Ce que ce document n'établit pas

Aucune des affirmations suivantes n'est portée par ce document :

```text
TOOLING-EXPERIMENT-001 est le flux de travail COURANT du Lab
TOOLING-EXPERIMENT-001 est la direction de développement courante
TOOLING-EXPERIMENT-001 est exclusif
TOOLING-EXPERIMENT-001 est prioritaire
la phase D de TOOLING-EXPERIMENT-001 doit commencer
TOOLING-EXPERIMENT-001 est terminé
la question expérimentale de TOOLING-EXPERIMENT-001 est répondue
TOOLING-EXPERIMENT-002 est déplacé
TOOLING-EXPERIMENT-002 est clos
la prochaine action du programme change
```

Explicitement :

```text
EXCLUSIVITÉ COURANTE DE TE001
= NON AFFIRMÉE

DIRECTION DE DÉVELOPPEMENT COURANTE
= NON AFFIRMÉE

STATUT DE TE002
= INCHANGÉ

TRANSITION DE VALEUR DANS L'ÉTAT DE PROGRAMME
= AUCUNE
```

Une décision historique et une direction courante sont deux choses
différentes. Ce document ne parle que de la première.

## 4. Nature de l'autorité

```text
OBJET
= provenance durable d'une décision humaine historique déjà existante

NOUVELLE SÉLECTION HUMAINE
= NON

TRANSITION DE DÉCISION
= AUCUNE

RATIFIED → RATIFIED
= maintenance de provenance seulement
```

```text
CE DOCUMENT
≠ une seconde décision
≠ un objet de décision du point de reprise
```

Aucune décision n'est créée dans l'état de programme pour cette attestation :
une autorité de preuve n'a pas besoin d'être elle-même prouvée par une
décision, sans quoi la provenance se construirait à l'infini.

## 5. Pourquoi cette autorité existe

Section non normative. Elle explique, elle n'élargit rien.

Le soutien antérieur de l'affirmation était l'entrée de preuve `ev-020`, qui
référençait `README.md`. Deux défauts s'y trouvaient, et un seul est devenu
visible au moment où il a compté :

```text
SOURCE LÉGITIMEMENT MUTABLE
= le README est un index d'état, il change quand l'état change

SOURCE SÉMANTIQUEMENT PLUS FAIBLE QUE L'AFFIRMATION
= son énoncé « CURRENT LAB STREAM = TOOLING EXPERIMENT 001 » dit quel flux
  était courant, non qu'une autorité humaine avait ratifié sa sélection
```

Quand le README a légitimement changé, le détecteur de dérive de source a
signalé l'écart. Il a eu raison de le faire.

```text
DÉTECTEUR SOURCE_CHANGED
= CORRECT

AFFIRMATION DEVENUE FAUSSE
= NON ÉTABLI

DÉFAILLANCE DE L'OUTIL D'ÉTAT DE PROGRAMME
= NON
```

Une recherche en lecture seule des enregistrements durables déjà committés n'a
trouvé aucune source établissant exactement la sélection historique : la
prédéclaration `09-…-PROGRAM-STATE.md` ratifie la **conception**, ce qui
soutient une autre affirmation, et les autres documents ne font que mentionner
TE001 ou constater qu'il est le flux courant.

```text
UNE RÉFÉRENCE EXISTE
≠ L'AFFIRMATION EST ÉTABLIE
```

C'est la règle gelée de `09-…-PROGRAM-STATE.md` § 4. Elle interdit de promouvoir
un document simplement plausible au rang de preuve. D'où ce document-ci, écrit
pour dire exactement le fait manquant, et rien de plus.

## 6. Ce que ce document n'est pas

```text
RÉSULTAT GÉNÉRAL DE TOOLING-EXPERIMENT-001      NON
AUTORITÉ DE PHASE D                             NON
AMENDEMENT DE LA POLITIQUE DE PREUVE            NON
DOCUMENT D'ÉVALUATION DE TOOLING-EXPERIMENT-002 NON
RÉSULTAT EXPÉRIMENTAL                           NON
RESULT-001                                      NON CRÉÉ
```

```text
PHASE D DE TOOLING-EXPERIMENT-001
= NON COMMENCÉE

TOOLING-EXPERIMENT-002
= OPEN

QUESTION EXPÉRIMENTALE DE TOOLING-EXPERIMENT-002
= TOUJOURS SANS RÉPONSE
```
