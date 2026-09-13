# LOCAL MISSION CONSOLE v0 — protocole de capture des observations d'usage réel

## 1. Statut et portée

```text
TYPE
= réparation déterministe de protocole, côté orchestration

OBJET
= geler la destination durable des observations d'usage réel de la console,
  produites par l'humain / l'orchestrateur

CE DOCUMENT
= autorité de capture d'observation
= GELÉ
```

Ce que ce document répare, et RIEN d'autre :

```text
PROTOCOLE SECONDAIRE D'OBSERVATION EN USAGE RÉEL
= destination durable MANQUANTE
= RÉPARÉE ICI
```

Ce qu'il ne rouvre pas :

```text
CONCEPTION DE L'ÉTUDE PRIMAIRE DE L'AUTORITÉ 35   NON ROUVERTE
LES CINQ CAS HISTORIQUES                           NON MODIFIÉS
LES LIGNÉES FACTUELLES                             NON MODIFIÉES
mission.json                                       NON MODIFIÉ
envelope.md                                        NON MODIFIÉ
CONTRAT DE RETOUR DE L'EXÉCUTANT                   NON MODIFIÉ
ATTRIBUTION DE result.json                         NON MODIFIÉE
UTILITÉ DE LA CONSOLE                              NON QUALIFIÉE
NOUVELLE REPRÉSENTATION GÉNÉRIQUE                  AUCUNE
TOOLING-EXPERIMENT-004                             AUCUNE
```

```text
AUTORITÉ D'ÉTUDE PRIMAIRE GOUVERNANTE
= 35-DECISION-CONSEQUENCE-BOUNDARY-BOUNDED-MISSION-FREEZE.md
= blob 9a067717b3fb5e3daca7a7be3a34b1362b843ea3
= INCHANGÉE PAR CE DOCUMENT
```

## 2. Le blocage exact

L'autorité 35 § 15 a gelé un protocole d'observation en trois étapes et lui a
donné des questions exactes. Elle n'a pas dit OÙ ces observations se déposent.

```text
OBSERVATIONS D'USAGE RÉEL EXIGÉES
= OUI

DESTINATION DURABLE
= NON GELÉE
```

Conséquence si le blocage restait :

```text
« garder les observations du panneau A en mémoire de session,
  puis les écrire plus tard »
= RECONSTRUCTION DEPUIS LA PROSE

et c'est exactement ce que le protocole interdit de faire
pour les faits de l'étude primaire
```

```text
UNE VARIABLE EN MÉMOIRE
≠ PREUVE DURABLE DE PROGRAMME

UN FICHIER NON COMMITÉ
≠ PREUVE DURABLE DE PROGRAMME
```

Dans ce Lab, la durabilité est adossée à Git : chaque autorité cite des
empreintes d'objets. Un fait n'est durable que lorsqu'il est committé.

## 3. Inventaire des surfaces durables existantes

Inspection des mécanismes durables réellement employés par le Lab pour des
faits produits par l'humain ou l'orchestration.

### 3.1 `04-OBSERVATION-RECORD.md` — registre d'observations

```text
OBJET SÉMANTIQUE COURANT
= une section par friction ou observation SIGNIFICATIVE

MODÈLE DE PRODUCTEUR / D'AUTORITÉ
= humain / orchestrateur ; précédent de conduite interne au Lab : O-014

STRUCTURE / CHAMPS NORMATIFS
= Contexte (CASE · RUN · STEP) · Observation (FRICTION · CONSEQUENCE ·
  BLOCKING) · Attribution (CCR-SIDE · CONSUMER-SIDE · CASE-SIDE) ·
  Nature (5 axes d'écart produit) · Contournement · Preuve · Analyse ·
  Non-conclusions · Décision produit

CONTRAT MACHINE
= program-state observationExists() cherche « ## Observation O-NNN »
= référencé depuis PROGRAM-STATE en preuve de genre « observation »

PEUT ENREGISTRER PANEL_A / PANEL_B / PANEL_C ?
= en prose seulement ; aucun champ d'étape

PEUT DISTINGUER L'OBSERVATEUR DE L'EXÉCUTANT ?
= NON — l'Attribution y désigne la CAUSE (CCR / consommateur / cas),
  jamais le PRODUCTEUR du fait

PEUT PERSISTER PAR ÉTAPES ?
= seulement en allouant trois identifiants O-NNN avant qu'aucune observation
  n'existe

SURVIT À L'INTERRUPTION SANS RECONSTRUCTION ?
= OUI, une fois committé

EXIGE UN CHANGEMENT D'OUTILLAGE ?
= NON

EXIGE UNE INVENTION DE SCHÉMA ?
= OUI — porter l'étape, le producteur et les quatre constats propres à la
  console demanderait d'ajouter des sous-sections normatives à une surface
  PARTAGÉE de dépôt, déjà employée par quatorze observations et référencée
  par PROGRAM-STATE

ADÉQUATION SÉMANTIQUE
= PARTIELLE
```

Motif exact de la non-sélection, et il n'est pas de commodité :

```text
LE REGISTRE RÉPOND À
= « quelle friction avons-nous rencontrée, et à qui s'attribue-t-elle ? »

LE PROTOCOLE A BESOIN DE
= « qu'a vu l'orchestrateur à l'étape X, et la console a-t-elle suffi ? »
```

Ce ne sont pas la même question. Une capture d'étape où rien de notable ne
s'est produit remplirait chaque champ normatif du registre par un vide —
FRICTION aucune, cinq axes de Nature à NO, décision produit NONE — et
consommerait un identifiant durable du registre de frictions du Lab pour une
case de procédure.

```text
STOCKAGE DE TEXTE ARBITRAIRE
≠ SURFACE SÉMANTIQUEMENT ADÉQUATE
```

Relation conservée, et elle compte :

```text
SI LA CAPTURE FAIT APPARAÎTRE UNE FRICTION RÉELLEMENT SIGNIFICATIVE
→ UNE OBSERVATION O-NNN PEUT EN ÊTRE TIRÉE PLUS TARD
→ PAR AUTORITÉ HUMAINE, ET PAR ELLE SEULE
```

### 3.2 Preuve PROGRAM-STATE de genre `observation`

```text
OBJET SÉMANTIQUE
= RÉFÉRENCE vers un O-NNN du registre

STRUCTURE
= id · kind · ref · policy · supports{subject,field,value} · observed?

PEUT ENREGISTRER PANEL_A / B / C ?
= NON — c'est un pointeur, pas un contenant

ADÉQUATION SÉMANTIQUE
= INADÉQUATE comme destination
= c'est le mécanisme de référencement de la surface 3.1, rien de plus
```

### 3.3 Autorités racine numérotées

```text
OBJET SÉMANTIQUE
= document gelé et ratifié

PEUT ENREGISTRER PANEL_A / B / C ?
= OUI, mais chaque étape deviendrait une autorité ratifiée

PEUT PERSISTER PAR ÉTAPES ?
= seulement au prix de trois autorités pendant une exécution

ADÉQUATION SÉMANTIQUE
= INADÉQUATE — une observation brute d'étape n'est pas une ratification,
  et l'élever en autorité surclasserait ce qu'elle est
```

### 3.4 Result Instance de l'exécutant

```text
MODÈLE DE PRODUCTEUR
= reported_by.executor

ADÉQUATION SÉMANTIQUE
= INADÉQUATE PAR INVARIANT

RETOUR RÉEL DE L'EXÉCUTANT
≠ OBSERVATION D'USAGE RÉEL DE L'HUMAIN / DE L'ORCHESTRATEUR
```

L'y loger demanderait à l'exécutant de rapporter des faits qu'il n'a pas
observés. Interdit.

### 3.5 Références durables de Mission Object

```text
OBJET SÉMANTIQUE
= contrat PROSPECTIF

ADÉQUATION SÉMANTIQUE
= INADÉQUATE — un contrat prospectif ne porte pas un constat postérieur,
  et mission.json est de toute façon gelé
```

### 3.6 Artefact compagnon local à une mission

```text
PRATIQUE ÉTABLIE
= tooling/mission-object/dogfood/001/readme-reached.md
  artefact local produit côté orchestration, ni mission.json, ni envelope.md,
  ni result.json ; référencé par l'autorité 15 et par les Mission Objects
  ultérieurs en rôle CONTEXT

= tooling/result-instance/live-dogfood/001/evidence/remote-main-head.txt
  preuve locale à une mission

PEUT ENREGISTRER PANEL_A / PANEL_B / PANEL_C ?
= OUI, avec des champs exacts

PEUT DISTINGUER L'OBSERVATEUR DE L'EXÉCUTANT ?
= OUI, par un champ de producteur explicite

PEUT PERSISTER PAR ÉTAPES ?
= OUI, une étape écrite puis committée à la fois

SURVIT À L'INTERRUPTION SANS RECONSTRUCTION ?
= OUI

EXIGE UN CHANGEMENT D'OUTILLAGE ?
= NON

EXIGE UNE INVENTION DE SCHÉMA ?
= NON — structure locale à CETTE mission, aucun contrat sémantique réutilisable

ADÉQUATION SÉMANTIQUE
= ADÉQUATE
```

## 4. Issue de suffisance

```text
ISSUE
= ORDINARY_MISSION_LOCAL_OBSERVATION_ARTIFACT_SUFFICIENT
```

Porte d'écart de l'étude, rejouée :

```text
1  capture durable A / B / C exigée par le protocole ratifié      ÉTABLI
2  l'attribution de producteur doit rester distincte du retour
   de l'exécutant                                                 ÉTABLI
3  aucune surface durable existante ne l'exprime et ne la persiste
   de façon adéquate                                              ÉTABLI
4  un artefact ordinaire local à la mission NE PEUT PAS le faire
   sans inventer un contrat sémantique réutilisable               NON ÉTABLI
5  l'absence empêche matériellement la qualification ultérieure    ÉTABLI
```

```text
CONDITION 4 NON SATISFAITE
→ AUCUN ÉCART CONCRET DE SURFACE DE CAPTURE

AUCUN FICHIER TOUT PRÊT        ≠ ÉCART
UN FICHIER DE MISSION EN PLUS  ≠ NOUVELLE PRIMITIVE D'OUTILLAGE
```

```text
CHOIX MATÉRIEL EXIGEANT UNE DÉCISION HUMAINE
= AUCUN

une seule solution adéquate demeure ; les autres sont INADÉQUATES ou
PARTIELLES pour des motifs sémantiques exacts, non par préférence
```

## 5. Surface sélectionnée

```text
DESTINATION D'OBSERVATION
= missions/001-decision-consequence-boundary/console-real-use-observations.md
```

Classe, gelée et non négociable :

```text
LOCALE À CETTE MISSION
OBSERVATION SEULEMENT
PRODUITE PAR L'HUMAIN / L'ORCHESTRATEUR

PAS UN RETOUR D'EXÉCUTANT
PAS UNE PRIMITIVE D'OUTILLAGE GÉNÉRIQUE
PAS UN SUBSTITUT DE PROGRAM-STATE
PAS UN VERDICT D'UTILITÉ
PAS UNE QUATRIÈME BRIQUE DE REPRÉSENTATION
```

```text
NOUVELLE AIRE D'OUTILLAGE   AUCUNE
RÉPERTOIRE D'OUTILLAGE      AUCUN
SCHÉMA DE DÉPÔT            AUCUN
```

## 6. Attribution du producteur

```text
PRODUCTEUR DES OBSERVATIONS
= HUMAIN / ORCHESTRATEUR

PRODUCTEUR DE result.json
= EXÉCUTANT
```

```text
RETOUR RÉEL DE L'EXÉCUTANT
≠ OBSERVATION D'USAGE RÉEL DE L'HUMAIN / DE L'ORCHESTRATEUR

ATTRIBUTION DE PRODUCTEUR
= DURABLE
```

```text
AUCUN ACTEUR N'ÉCRIT POUR L'AUTRE
```

## 7. Champs d'observation exacts

Vocabulaire établi réemployé tel quel là où le registre d'observations le
définit déjà ; rien n'est renommé pour la commodité.

Par étape :

```text
PRODUCTEUR                              rôle, humain / orchestrateur
ÉTAPE D'OBSERVATION                     PANEL_A | PANEL_B | PANEL_C
OBSERVATION                             [vocabulaire établi]
CONSEQUENCE                             [vocabulaire établi]
BLOCKING                                YES / NO            [vocabulaire établi]
WORKAROUND REQUIRED                     YES / NO / NOT_APPLICABLE  [vocabulaire établi]
WORKAROUND                              exact / NONE        [vocabulaire établi]
WORKAROUND COST                         exact / NONE        [vocabulaire établi]
DÉFAILLANCE NAVIGATEUR / PLATEFORME     exact / NONE
RECONSTRUCTION DEPUIS LA CONVERSATION   YES / NO
INSPECTION BRUTE DU DÉPÔT               YES / NO
INFORMATION MATÉRIELLEMENT MANQUANTE    exact / NONE
CONFUSION INTRODUITE PAR L'INTERFACE    exact / NONE
PREUVE                                  [vocabulaire établi]
NON-CONCLUSIONS                         [vocabulaire établi]
```

Correspondance explicite avec le protocole de l'autorité 35 :

```text
« repli manuel exigé »
= WORKAROUND REQUIRED
= champ ÉTABLI du registre d'observations, réemployé, non dupliqué
```

Champs ajoutés parce que la surface établie ne les porte pas :

```text
PRODUCTEUR                             le registre attribue la CAUSE, pas le producteur
ÉTAPE D'OBSERVATION                    le registre n'a pas de notion d'étape
DÉFAILLANCE NAVIGATEUR / PLATEFORME    propre à une surface d'interface
RECONSTRUCTION DEPUIS LA CONVERSATION  propre à la discipline de source du Lab
INSPECTION BRUTE DU DÉPÔT              propre à l'objet de la console
CONFUSION INTRODUITE PAR L'INTERFACE   propre à une surface d'interface
```

Le contenu de `OBSERVATION` répond, pour son étape, aux questions gelées par
l'autorité 35 § 15. Ces questions ne sont pas redéfinies ici.

## 8. Cycle de vie des étapes

```text
AVANT DÉPÊCHE

1   employer le PANNEAU A
2   écrire l'étape PANEL_A, puis la COMMITER
3   employer le PANNEAU B
4   écrire l'étape PANEL_B, puis la COMMITER
5   vérifier que les deux étapes sont durablement récupérables
6   transmettre à un exécutant frais l'enveloppe rendue par la console
```

```text
EXÉCUTANT

7   exécuter l'étude historique primaire
8   créer UNIQUEMENT le result.json réservé
9   STOP
```

```text
APRÈS RETOUR DE L'EXÉCUTANT

10  employer le PANNEAU C
11  écrire l'étape PANEL_C, puis la COMMITER
12  vérifier que l'attribution d'observation et l'attribution de résultat
    restent distinctes
13  STOP AVANT LA QUALIFICATION DE L'ÉTUDE PRIMAIRE
14  STOP AVANT LA QUALIFICATION D'UTILITÉ DE LA CONSOLE
```

```text
RÉTRO-ATTRIBUER UNE OBSERVATION DU PANNEAU C À L'EXÉCUTANT
= INTERDIT
```

## 9. Sémantique de durabilité

```text
PANEL_A DURABLE
= au commit de l'étape A, avant l'emploi du panneau B

PANEL_B DURABLE
= au commit de l'étape B, avant la dépêche

PANEL_C DURABLE
= au commit de l'étape C, après la production du résultat

COMMIT GIT EXIGÉ ENTRE LES ÉTAPES
= OUI
```

Motif, et il découle de la durabilité déjà établie par le Lab :

```text
une étape doit être récupérable AVANT que la suivante ne commence
un fichier non committé disparaît avec la copie de travail
la durabilité de ce Lab est adossée à Git, empreinte par empreinte
```

Autorisation explicite, sans laquelle l'exécution improviserait :

```text
COMMITS D'OBSERVATION AUTORISÉS PENDANT LA MISSION D'EXÉCUTION
= EXACTEMENT 3
= un par étape
= chacun ne portant QUE
  missions/001-decision-consequence-boundary/console-real-use-observations.md

PUSH
= ordinaire, en avance rapide, selon la pratique établie du dépôt

COMMIT PAR L'EXÉCUTANT
= 0
```

Pourquoi cela ne change pas la sémantique d'exécution gelée :

```text
le préflight gelé de la mission exige branche main, copie propre, identité de
l'autorité 34, et chemin de résultat réservé absent

IL NE FIXE AUCUN PARENT DE HEAD

donc des commits d'orchestration antérieurs à la dépêche ne peuvent pas faire
échouer le préflight de l'exécutant
```

```text
FRONTIÈRE D'ÉCRITURE DE L'AUTORITÉ 35 § 12
= FRONTIÈRE DE L'EXÉCUTANT
= INCHANGÉE : exactement un nouveau result.json
```

## 10. Frontières d'écriture des acteurs

```text
EXÉCUTANT PEUT CRÉER
= missions/001-decision-consequence-boundary/result.json
= ET RIEN D'AUTRE

EXÉCUTANT PEUT COMMITER
= NON

EXÉCUTANT PEUT ÉCRIRE DANS LE FICHIER D'OBSERVATION
= NON
```

```text
HUMAIN / ORCHESTRATEUR PEUT ÉCRIRE
= missions/001-decision-consequence-boundary/console-real-use-observations.md
= ET RIEN D'AUTRE AU TITRE DE CE PROTOCOLE

HUMAIN / ORCHESTRATEUR PEUT ÉCRIRE DANS result.json
= NON
```

## 11. Défaillance et reprise après interruption

```text
DÉFAILLANCE NAVIGATEUR OU PLATEFORME PENDANT UNE ÉTAPE
→ la consigner dans le champ DÉFAILLANCE de cette étape
→ consigner le repli employé dans WORKAROUND
→ POURSUIVRE

UNE DÉFAILLANCE DE LA CONSOLE N'INVALIDE PAS L'ÉTUDE PRIMAIRE
```

```text
INTERRUPTION APRÈS UNE ÉTAPE COMMITÉE
→ l'étape est récupérable depuis le dépôt
→ reprendre à l'étape suivante
→ AUCUNE RECONSTRUCTION DEPUIS LA CONVERSATION

INTERRUPTION AVANT LE COMMIT D'UNE ÉTAPE
→ cette étape est PERDUE
→ elle est REJOUÉE contre la console, jamais reconstruite de mémoire
→ et le rejeu est consigné dans son champ OBSERVATION
```

```text
ÉTAPE PERDUE
≠ ÉTAPE À RECONSTRUIRE DE MÉMOIRE
```

## 12. Frontière de qualification

```text
CE FICHIER ENREGISTRE DES OBSERVATIONS
= UNIQUEMENT
```

Interdits pendant la capture :

```text
POSITIVE UTILITY                 INTERDIT
MIXED UTILITY                    INTERDIT
NO MATERIAL BENEFIT OBSERVED     INTERDIT
INSUFFICIENT OBSERVATION         INTERDIT
```

Ces valeurs demeurent des issues de qualification humaine / produit
ULTÉRIEURES.

```text
RECORD D'OBSERVATION
≠ QUALIFICATION D'UTILITÉ

RÉSULTAT DE L'ÉTUDE PRIMAIRE
≠ OBSERVATION DE CONSOLE
≠ VERDICT D'UTILITÉ DE LA CONSOLE
```

## 13. Consommation ultérieure

```text
CONSOMMATEUR
= qualification humaine / produit ultérieure

ENTRÉES
= les trois étapes committées de ce fichier
+ le result.json produit par l'exécutant
+ l'autorité 35

SORTIE
= une issue d'utilité, décidée par l'autorité humaine, HORS de ce fichier
```

```text
PROMOTION D'UNE FRICTION SIGNIFICATIVE EN OBSERVATION O-NNN
= POSSIBLE PLUS TARD
= PAR AUTORITÉ HUMAINE
= JAMAIS AUTOMATIQUE
```

## 14. Identités gelées

```text
AUTORITÉ 35
= 9a067717b3fb5e3daca7a7be3a34b1362b843ea3
= INCHANGÉE

missions/001-decision-consequence-boundary/mission.json
= e80bc3d250920cee66b4d26bef497b6094395144
= INCHANGÉ

missions/001-decision-consequence-boundary/envelope.md
= a5320c00c20ec0b1f7f4c8f99515bd5a133b619e
= INCHANGÉ

missions/001-decision-consequence-boundary/result.json
= CHEMIN RÉSERVÉ
= ABSENT
```

## 15. Ce que ce document ne fait pas

```text
ÉTUDE PRIMAIRE ROUVERTE                 NON
CAS HISTORIQUES MODIFIÉS                NON
mission.json MODIFIÉ                    NON
envelope.md MODIFIÉ                     NON
CONTRAT DE RETOUR MODIFIÉ               NON
result.json ÉTENDU POUR PORTER
  DES OBSERVATIONS                      NON
UTILITÉ DE LA CONSOLE QUALIFIÉE         NON
OBSERVATION FABRIQUÉE                   AUCUNE
NOUVELLE REPRÉSENTATION GÉNÉRIQUE       AUCUNE
NOUVELLE PRIMITIVE D'OUTILLAGE          AUCUNE
NOUVELLE AIRE D'OUTILLAGE               AUCUNE
TOOLING-EXPERIMENT-004                  AUCUNE
NOUVELLE DÉCISION PROGRAM-STATE         AUCUNE
04-OBSERVATION-RECORD.md MODIFIÉ        NON
OUTILLAGE EXISTANT MODIFIÉ              NON
MISSION EXÉCUTÉE                        NON
INSTANCE DE RÉSULTAT CRÉÉE              NON
TESTS EXÉCUTÉS                          0
```

```text
DESTINATION DURABLE DE CAPTURE
= GELÉE

MISSION
= PRÊTE À L'EXÉCUTION

EXÉCUTION
= NON COMMENCÉE
```
