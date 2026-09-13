# LOCAL MISSION CONSOLE v0 — sélection de direction de programme

## 1. Statut et objet

```text
TYPE
= sélection de direction de programme, ratifiée par l'humain

OBJET
= choisir la prochaine direction authentique du Lab CCR, et en geler le
  périmètre produit

CE DOCUMENT
= autorité de sélection de direction
= GELÉ

CONCEPTION TECHNIQUE
= AUCUNE ICI

IMPLÉMENTATION
= AUCUNE ICI

NOUVELLE EXPÉRIENCE D'OUTILLAGE
= AUCUNE SÉLECTIONNÉE

REVENDICATION DE NOUVELLE CAPACITÉ D'OUTILLAGE
= AUCUNE
```

Ce document choisit une direction et la borne. Il ne conçoit rien et
n'implémente rien.

## 2. Ce que l'étude de sélection avait établi

```text
CANDIDATS SUFFISAMMENT JUSTIFIÉS DANS LE CORPUS DURABLE INSPECTÉ
= 0
```

État mesuré à ce moment-là : cinq cas clos, trois flux de session clos, TE002
et TE003 clos, TE001 IMPLEMENTED avec sa question répondue, 21 décisions
ratifiées et zéro en attente, README courant, aucun TODO dans l'outillage,
deux arcs de feedback CCR publiés et clos.

La conclusion de l'étude reste exacte, et elle n'est pas réécrite.

```text
AUCUN CANDIDAT JUSTIFIÉ DANS LE CORPUS DURABLE ANTÉRIEUR
≠ L'HUMAIN N'A PAS LE DROIT DE SÉLECTIONNER UN NOUVEL OBJECTIF
```

L'étude avait d'ailleurs nommé l'issue exacte : ce qui manquait n'était pas de
l'analyse, c'était un objectif. Le voici.

## 3. L'objectif sélectionné

```text
LOCAL MISSION CONSOLE V0
= petite console web locale, utilisable depuis un navigateur,
  pour suivre UNE mission du Lab CCR dans UN dépôt local
```

Finalité :

```text
réunir dans un seul flux de travail local utilisable les surfaces déjà
établies : l'état de programme durable, la mission prospective, et le résultat
structuré réellement retourné
```

Classification honnête de cette direction :

```text
DIRECTION PRODUIT / R&D SÉLECTIONNÉE PAR L'HUMAIN
```

Ce qu'elle n'est PAS :

```text
un besoin démontré par l'étude de sélection précédente
une preuve que les trois outils existants suffisent
une preuve qu'une quatrième capacité d'outillage est requise
TOOLING-EXPERIMENT-004
un successeur de feuille de route sélectionné automatiquement
```

## 4. Périmètre produit gelé de la v0

```text
UN dépôt à la fois
UNE mission à la fois
```

Trois panneaux, et seulement trois.

### Panneau A — état du Lab

```text
SOURCE
= PROGRAM-STATE.json

EXPOSER AU MINIMUM
= flux et expériences
= décisions
= action suivante courante
= références durables soutenant cet état

RÔLE EN v0
= OBSERVATIONNEL
```

```text
AUTORITÉ D'INVENTER OU DE RATIFIER UNE DÉCISION
= AUCUNE
```

### Panneau B — mission

```text
OUVRIR un mission.json existant et préparé

EMPLOYER LES CAPACITÉS MISSION OBJECT EXISTANTES
= charger
= valider
= rendre l'enveloppe déterministe

ACTION UTILISATEUR
= COPIER LA MISSION, pour transmission MANUELLE à un exécutant
```

```text
DÉPÊCHE AUTOMATIQUE D'AGENT
= AUCUNE
```

### Panneau C — résultat

```text
OUVRIR un result.json produit, et la mission applicable

EMPLOYER LES CAPACITÉS RESULT INSTANCE EXISTANTES
= charger
= valider structurellement
= contrôler la relation au contrat de retour prospectif telle que l'outil
  existant l'expose
= afficher les faits rapportés
= afficher leurs types et leurs identités
= afficher les références de preuve explicites
= afficher les constats de validation structurelle et mécanique
```

```text
RAPPORTÉ
≠ VRAI

PRÉSENTATION DU RÉSULTAT
≠ QUALIFICATION
```

La console ne transforme aucun fait rapporté en qualification humaine.

## 5. Hors périmètre de la v0

```text
dépêche automatique d'agent
approvisionnement d'agent ou de session
exécution distante
orchestration multi-dépôts
missions simultanées multiples
ratification automatique de décision humaine
écriture automatique de conséquence dans PROGRAM-STATE
qualification automatique d'instance de résultat
génération de verdict humain ou produit à la manière de TE003
accès à une preuve CCR System protégée
automatisation d'exécution de protocole
automatisation de commit ou de push Git
moteur de workflow
démon d'arrière-plan
service en nuage
authentification, multi-utilisateur, produitisation
```

```text
TENTATIVE DE RÉSOUDRE LA FEUILLE DE ROUTE D'ORCHESTRATION ENTIÈRE
= AUCUNE
```

## 6. Frontières sémantiques préservées

```text
ÉTAT DE PROGRAMME
≠ MISSION

MISSION
≠ INSTANCE DE RÉSULTAT

INSTANCE DE RÉSULTAT
≠ QUALIFICATION

QUALIFICATION
≠ DÉCISION HUMAINE

FAIT RAPPORTÉ
≠ FAIT VÉRIFIÉ

PRÉSENTATION
≠ AUTORITÉ MÉTIER OU MACHINE
```

L'interface peut présenter ces objets côte à côte. Elle ne doit pas les
confondre. C'est la seule contrainte qui ne se négocie pas : trois expériences
ont été menées pour établir ces distinctions, et une interface qui les
aplatirait détruirait ce qu'elles ont produit.

## 7. Rapport à la pile existante

```text
PROGRAM-STATE
= surface candidate pour le panneau d'état du Lab

MISSION OBJECT
= surface candidate pour le panneau de mission

RESULT INSTANCE
= surface candidate pour le panneau de résultat
```

```text
SUFFISANCE DE CES SURFACES POUR LA CONSOLE V0
= NON ENCORE ÉTABLIE
```

Le travail de conception suivant devra déterminer :

```text
quelles opérations requises se composent directement depuis les surfaces
  existantes

lesquelles n'exigent qu'un code d'application ou d'adaptation ordinaire

si l'une d'elles expose une capacité réellement manquante
```

```text
NOUVELLE EXPÉRIENCE D'OUTILLAGE
= JUSTIFIÉE UNIQUEMENT si cette analyse démontre une insuffisance concrète
  ayant une conséquence pratique
```

## 8. Contrôle de fidélité historique

Contrôle d'acceptation initial, non productif, sur des artefacts durables déjà
existants du Lab.

```text
PAIRE PRÉFÉRÉE, sous réserve de vérification d'identité pendant la conception
= tooling/result-instance/live-dogfood/001/mission.json
= tooling/result-instance/live-dogfood/001/result.json
+ leurs preuves durables explicitement référencées
```

```text
OBJET
= vérifier que la console présente fidèlement une mission et un résultat
  durables déjà connus, sans réécriture sémantique
```

```text
CE CONTRÔLE DÉMONTRE
= une intégration fidèle

CE CONTRÔLE NE DÉMONTRE PAS
= une utilité dans un travail réel nouveau
```

## 9. Acceptation en usage réel

L'objectif produit n'est pas atteint du seul fait que la paire historique
s'affiche correctement.

```text
APRÈS IMPLÉMENTATION
= employer la console sur UNE mission réelle du Lab nouvellement définie
→ puis évaluer si elle améliore matériellement le suivi et la reprise de la
  mission, sans compromettre les frontières sémantiques établies
```

```text
CETTE MISSION RÉELLE FUTURE
= NON SÉLECTIONNÉE ICI
= NON FABRIQUÉE POUR LA COUVERTURE
= elle devra venir d'un travail authentique
```

## 10. Critère de succès de la direction sélectionnée

Le premier jalon utilisable doit permettre à un humain de :

```text
1  ouvrir l'état durable courant du Lab
2  inspecter un Mission Object préparé et son résultat de validation
3  obtenir son enveloppe déterministe pour un transfert manuel
4  ouvrir l'instance de résultat réellement retournée pour cette mission
5  la valider contre la mission gelée, avec la sémantique Result Instance
   existante
6  inspecter les faits rapportés et les références de preuve explicites
7  voir clairement que la qualification et la décision humaine restent hors du
   retour structuré
```

sans invoquer à la main trois surfaces d'outillage distinctes pour une
inspection ordinaire.

```text
GAIN DE PRODUCTIVITÉ REVENDIQUÉ
= AUCUN, tant que l'usage réel ne l'a pas évalué
```

## 11. Question de conception suivante

```text
ACTION DE PROGRAMME SUIVANTE
= CONCEVOIR LOCAL MISSION CONSOLE V0
```

Question exacte :

```text
Pour le flux de console locale à trois panneaux sélectionné par l'humain,
quelles opérations requises s'assemblent directement depuis PROGRAM-STATE,
Mission Object et Result Instance tels qu'ils existent aujourd'hui,
lesquelles exigent un code d'intégration ou d'application ordinaire,
et lesquelles — s'il y en a — exposent une capacité manquante concrète
appelant une nouvelle question expérimentale ?
```

La conception devra aussi geler, AVANT toute implémentation :

```text
architecture applicative locale
frontière d'accès entre le navigateur et le dépôt local
réemploi de l'outillage Node existant
politique de dépendances
frontière d'autorité en lecture et en écriture
modèle de sélection de fichier et de localisateur
modèle d'invocation de la validation
comportement de la copie d'enveloppe
modèle de présentation du résultat et des preuves
présentation des erreurs et des artefacts invalides
acceptation de fidélité historique
acceptation ultérieure en usage réel
```

## 12. La classification reste ouverte

```text
SI LES SURFACES EXISTANTES + UN CODE D'APPLICATION ORDINAIRE SUFFISENT
→ CLASSE = INTÉGRATION / DÉVELOPPEMENT ORDINAIRE
```

```text
SI UNE OPÉRATION REQUISE CONCRÈTE NE PEUT ÊTRE RÉALISÉE AVEC LES SURFACES
EXISTANTES, ET QUE LA CONSÉQUENCE EST MATÉRIELLE
→ CANDIDAT À UNE NOUVELLE EXPÉRIENCE D'OUTILLAGE
→ DÉCISION PRODUIT HUMAINE REQUISE AVANT TOUTE NOUVELLE CONCEPTION
```

```text
EXPÉRIENCE SÉLECTIONNÉE PAR CETTE AUTORITÉ
= AUCUNE
```

La règle du Lab tient telle quelle : usage réel → friction → conséquence →
analyse de la surface existante → décision produit humaine → conception. Jamais
feuille de route → fonctionnalité.

## 13. Ce que ce document ne fait pas

```text
CONCEPTION TECHNIQUE                        AUCUNE
ARCHITECTURE SÉLECTIONNÉE                   AUCUNE
DÉPENDANCE CHOISIE                          AUCUNE
CODE ÉCRIT                                  AUCUN
NOUVELLE AIRE D'OUTILLAGE CRÉÉE             AUCUNE
NOUVELLE EXPÉRIENCE D'OUTILLAGE             AUCUNE
CAPACITÉ MANQUANTE REVENDIQUÉE              AUCUNE
SUFFISANCE DE LA PILE REVENDIQUÉE           AUCUNE
MISSION RÉELLE FUTURE SÉLECTIONNÉE          AUCUNE
EXÉCUTANT ALLOUÉ                            AUCUN
TE001 · TE002 · TE003 ROUVERTES              NON
AUTORITÉS 00 À 30 MODIFIÉES                 NON
OUTILLAGE EXISTANT MODIFIÉ                  NON
TESTS EXÉCUTÉS                              0
```

```text
LOCAL MISSION CONSOLE V0
= DIRECTION DE PROGRAMME SÉLECTIONNÉE PAR L'HUMAIN

PÉRIMÈTRE PRODUIT
= GELÉ

CONCEPTION TECHNIQUE
= NON GELÉE

IMPLÉMENTATION
= NON COMMENCÉE

CLASSIFICATION INTÉGRATION ORDINAIRE / ÉCART EXPÉRIMENTAL
= NON DÉTERMINÉE
```
