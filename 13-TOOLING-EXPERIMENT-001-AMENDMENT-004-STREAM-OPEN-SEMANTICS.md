# TOOLING-EXPERIMENT-001 — Amendement 004 : sémantique de l'état `OPEN`

## 1. Statut

```text
TYPE
= amendement de conception, ratifié par l'humain

ORIGINE
= porte sémantique de l'implémentation de l'amendement 003

OBJET
= définir la signification normative d'UN jeton d'état déjà existant

PRÉDÉCLARATION D'ORIGINE   09-…-PROGRAM-STATE.md                    INCHANGÉE
AMENDEMENT 001             10-…-DECISION-CREATION.md                INCHANGÉ
AMENDEMENT 002             11-…-EVIDENCE-SUPERSESSION-REFRESH.md    INCHANGÉ
AMENDEMENT 003             12-…-STREAM-CREATION.md                  INCHANGÉ

CE DOCUMENT
= autorité de l'amendement 004
= GELÉ

IMPLÉMENTATION
= AUCUNE ICI
```

## 2. Ce que la porte sémantique a établi

Constat de l'inspection en lecture seule, conservé tel quel.

```text
ÉTATS DE FLUX STRUCTURELLEMENT ACCEPTÉS
= OPEN · IMPLEMENTED · CLOSED · UNKNOWN · UNRESOLVED · NOT_APPLICABLE
```

Avant la présente décision humaine :

```text
CLOSED
= signification établie

IMPLEMENTED
= signification établie, étroite

UNKNOWN / UNRESOLVED / NOT_APPLICABLE
= sémantique d'incertitude établie

OPEN
= structurellement accepté
= sémantiquement indéfini par toute autorité durable
```

L'agent d'implémentation a donc refusé, à juste titre, d'attribuer lui-même un
sens à `OPEN`. Un validateur qui accepte un jeton n'établit pas ce que ce jeton
signifie : c'est exactement la distinction que la porte devait protéger.

## 3. Pas de constat 005

```text
CONSTAT 005
= NON
```

Motifs :

```text
le modèle contient déjà OPEN

la preuve n'a pas démontré une incapacité à représenter l'état de cycle de vie

la preuve a démontré l'absence de signification normative
pour un jeton existant
```

Classification :

```text
ÉCART SÉMANTIQUE BORNÉ                        OUI
DÉFAUT DE REPRÉSENTATION DU CYCLE DE VIE      NON DÉMONTRÉ
BOGUE D'IMPLÉMENTATION                        NON
```

Une phrase manquante n'est pas un défaut de modèle. Ce document écrit la
phrase ; il ne réécrit pas le modèle.

## 4. Amendement 004

```text
AMENDEMENT 004
= RATIFIÉ

ÉTAT DE FLUX CONCERNÉ
= OPEN

JETON
= PRÉEXISTANT

NOUVEAU JETON D'ÉTAT DE FLUX
= AUCUN
```

Signification normative :

```text
OPEN
= le flux est durablement admis dans le programme
= le flux est NON TERMINAL
= du travail substantiel reste à faire
```

Les trois propriétés appartiennent toutes à la signification. Aucune n'est
facultative, et aucune ne se déduit seule des deux autres.

## 5. Non-implications explicites

`OPEN` ne signifie **jamais** :

```text
le travail a déjà commencé
la conception a commencé
une implémentation existe
une exécution est en cours
un agent ou une session est actuellement affecté
le flux est le flux actif exclusif
le flux est le seul travail du programme
le flux détient une priorité de dispatch
un succès
une complétion
```

En particulier :

```text
OPEN  ≠  RUNNING
OPEN  ≠  IMPLEMENTED
OPEN  ≠  SÉLECTION COURANTE OU EXCLUSIVE
```

## 6. La sélection et le travail courant restent ailleurs

La séparation existante est préservée, et elle porte tout le poids :

```text
stream.state
= statut de cycle de vie et d'existence

décisions humaines
= sélections substantielles

next_action
= ce que le programme est sélectionné pour faire ensuite
```

Que TOOLING-EXPERIMENT-002 soit la direction de développement courante est
établi par :

```text
decision: tooling-experiment-002-selected   = RATIFIED
next_action                                 = représenter / ouvrir TE002
```

puis, après création réussie du flux :

```text
next_action
= concevoir et prédéclarer Mission Object v0
```

`OPEN` ne doit pas être surchargé de cette signification. Un flux peut être
ouvert sans être ce que le programme fait en ce moment ; c'est précisément
pourquoi les deux notions vivent dans des champs différents.

## 7. Application à TOOLING-EXPERIMENT-002

Une fois `OPEN` normativement défini, les faits déjà établis suffisent à
représenter TE002 :

```text
ID      tooling-experiment-002
TITRE   Durable Mission Representation
TYPE    TOOLING EXPERIMENT
STATE   OPEN
```

Signification, et rien de plus :

```text
TE002
= durablement admis dans le programme
= non terminal
= du travail substantiel reste à faire
```

Cela n'affirme **pas** que la conception de Mission Object v0 a commencé.

## 8. Pourquoi `OPEN` plutôt qu'un nouveau jeton

```text
NOUVEAU JETON REQUIS
= NON
```

```text
OPEN existe déjà dans le vocabulaire accepté

sa signification nouvellement ratifiée représente exactement
la condition de cycle de vie atteinte

aucune preuve ne justifie d'introduire
PLANNED · SELECTED · READY · ACTIVE · RUNNING
ni aucun autre jeton de cycle de vie
```

Aucune de ces valeurs n'est ajoutée. Le besoin mesuré était une signification,
pas un vocabulaire plus riche.

## 9. Aucune expansion de machine à états

Cet amendement ne définit pas :

```text
OPEN → ACTIVE → RUNNING → PAUSED → …
```

ni aucun graphe de cycle de vie exhaustif. Il définit exactement un jeton
jusqu'ici indéfini.

```text
TABLE DE TRANSITIONS            AUCUNE
RÈGLE DE TRANSITION AUTOMATIQUE AUCUNE
SÉMANTIQUE DE CLÔTURE           INCHANGÉE
SÉMANTIQUE D'IMPLEMENTED        INCHANGÉE
SÉMANTIQUE D'INCERTITUDE        INCHANGÉE
```

## 10. Rapport à l'amendement 003

L'amendement 003 n'est pas modifié. Sa règle :

```text
une création de flux doit employer un état déjà valide
dont la sémantique représente véridiquement le nouveau flux
```

devient satisfaisable pour TE002, parce que :

```text
OPEN
= déjà structurellement valide
+ désormais normativement défini
```

Rien n'est réécrit rétroactivement. La chronologie reste visible :

```text
TE002 sélectionné
→ décision persistée
→ conséquence d'ouverture de flux sélectionnée
→ tentative réelle de création, refusée
→ CONSTAT 004
→ AMENDEMENT 003
→ porte sémantique
→ OPEN trouvé structurellement présent mais indéfini
→ décision humaine
→ AMENDEMENT 004
→ implémentation future de l'amendement 003
```

## 11. Sémantique de la preuve, pour la création future

La création réelle du flux TE002 devra établir exactement :

```text
subject = stream:tooling-experiment-002
field   = state
value   = OPEN
```

La preuve doit soutenir cette affirmation exacte. Deux autorités y
contribuent, et aucune ne suffit seule :

```text
sélection humaine de TE002
= établit la décision d'admission durable

AMENDEMENT 004
= établit la sémantique d'OPEN
```

```text
l'amendement 004 n'a pas sélectionné TE002
la sélection humaine n'a pas défini OPEN
```

L'affirmation d'état est soutenue par la **combinaison** d'un fait de programme
établi et d'une sémantique d'état établie. C'est la relation typée habituelle,
appliquée honnêtement : chacune des deux autorités dit ce qu'elle dit, et rien
de plus.

## 12. Ce que ce document ne fait pas

```text
POINT DE REPRISE MODIFIÉ        NON
FLUX TE002 CRÉÉ                 NON
CODE DE L'OUTIL MODIFIÉ         NON
TESTS MODIFIÉS                  NON
TESTS EXÉCUTÉS                  0
CHECK RÉEL EXÉCUTÉ              0
NOUVELLE TENTATIVE DE CRÉATION  0
CONCEPTION MISSION OBJECT v0    0
SCHÉMA MISSION OBJECT           0
RESULT-001                      NON CRÉÉ
```

Le point de reprise durable reste cohérent tel quel :

```text
décision de sélection de TE002   RATIFIÉE
next_action                      représenter / ouvrir TE002
flux TE002                       ABSENT
```

La conséquence n'a toujours pas été exécutée. Elle n'est plus bloquée que par
l'implémentation.

```text
QUESTION EXPÉRIMENTALE DE REPRISE
= TOUJOURS SANS RÉPONSE
```
