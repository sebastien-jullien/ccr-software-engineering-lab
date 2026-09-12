# TOOLING-EXPERIMENT-001 — Amendement 003 : création d'un flux

## 1. Statut

```text
TYPE
= amendement de conception, ratifié par l'humain

ORIGINE
= constat 004 du dogfood réel

PRÉDÉCLARATION D'ORIGINE
= 09-TOOLING-EXPERIMENT-001-PROGRAM-STATE.md      INCHANGÉE

AMENDEMENT 001
= 10-TOOLING-EXPERIMENT-001-AMENDMENT-001-DECISION-CREATION.md   INCHANGÉ

AMENDEMENT 002
= 11-TOOLING-EXPERIMENT-001-AMENDMENT-002-EVIDENCE-SUPERSESSION-REFRESH.md
= INCHANGÉ

CE DOCUMENT
= autorité de l'amendement 003
= GELÉ AVANT IMPLÉMENTATION

IMPLÉMENTATION DE L'AMENDEMENT 003
= NON COMMENCÉE
```

## 2. L'état déjà atteint par TOOLING-EXPERIMENT-002

Histoire établie, non rouverte par ce document.

```text
DÉCISION HUMAINE
= TOOLING-EXPERIMENT-002 SÉLECTIONNÉ

SUJET
= REPRÉSENTATION DURABLE DE MISSION

DÉCISION
= RATIFIÉE
= DURABLEMENT PERSISTÉE

CONSÉQUENCE DÉTERMINISTE
= REPRÉSENTER / OUVRIR TE002 COMME NOUVEAU FLUX DU LAB

next_action
= cette conséquence
= durablement persistée

EXÉCUTION
= tentée avec la v0 courante
= refusée proprement

MUTATION DU POINT DE REPRISE PENDANT LE REFUS
= 0
```

La décision de sélection n'est pas rouverte. Un blocage technique n'efface pas
une décision humaine ratifiée.

## 3. Constat 004

```text
CONSTAT 004
= ÉCART DE CRÉATION D'UN NOUVEAU FLUX

SOURCE
= TRANSITION DE PROGRAMME RÉELLE
```

```text
MODÈLE D'ÉTAT
= contient déjà streams[]

SURFACE DE MUTATION COURANTE
= sait muter l'état d'un flux existant
= ne sait pas créer explicitement une entrée de streams[]

RÉPONSE DE L'OUTIL
= refus explicite
= code de sortie non nul
= mutation 0
```

Classification :

```text
ÉCART DE CONCEPTION / SURFACE DE MUTATION   OUI
DÉFAUT DU MODÈLE D'ÉTAT                     NON
BOGUE D'IMPLÉMENTATION                      NON
```

Le constat n'est pas une lecture du code : une transition réelle a atteint la
frontière, avec une charge utile complète, et a été refusée. C'est ce qui en
fait une preuve expérimentale plutôt qu'une remarque.

## 4. Relation avec les constats antérieurs

```text
CONSTAT 001
= ÉCART DE CRÉATION D'ENTRÉE
= nouvelle décision
= transition réelle

CONSTAT 004
= ÉCART DE CRÉATION D'ENTRÉE
= nouveau flux
= transition réelle

CONSTATS 002 / 003
= ÉVOLUTION DU SOUTIEN ACTIF
= supersession · rafraîchissement de provenance
```

Les deux familles sont distinctes et ne doivent pas être confondues : l'une
porte sur la **création** d'une entrée, l'autre sur l'**évolution** du soutien
d'une entrée qui existe déjà.

## 5. Observation plus large, et sa borne

Une seule formulation est autorisée :

```text
la surface de mutation d'origine s'est révélée, à plusieurs reprises, plus
étroite que les transitions rencontrées en usage réel
```

Et une conclusion est explicitement **non** dérivée :

```text
MOTEUR GÉNÉRIQUE DE MUTATION DE COLLECTIONS REQUIS
= NON DÉMONTRÉ
```

Trois refus n'établissent pas qu'il faille un CRUD général. Ils établissent
trois besoins nommés, chacun mesuré. Élargir au-delà reviendrait à concevoir
d'après une intuition plutôt que d'après ce qui a été observé — précisément ce
que la charte du Lab écarte.

## 6. Amendement 003

```text
AMENDEMENT 003
= ACCEPTÉ

COMMANDES COURANTES
= resume / check / update
= INCHANGÉES

EXTENSION UNIQUE
= update acquiert la création explicite et atomique d'une entrée de streams[]

CRÉATION D'UNE DÉCISION          PRÉSERVÉE
CRÉATION D'UN FLUX               AUTORISÉE
CRÉATION GÉNÉRIQUE DE COLLECTION NON
UPSERT                           NON
NOUVELLE COMMANDE                NON
NOUVEAU CHAMP SÉMANTIQUE         NON
```

## 7. Création explicite, jamais implicite

La création passe par un chemin explicite de la commande `update`.
Conceptuellement :

```text
update ... --create stream ...
```

ou toute forme mécaniquement équivalente et non ambiguë.

Le comportement ordinaire est conservé :

```text
update ordinaire
+ identifiant de flux inconnu
→ REJET
```

```text
MUTER UN IDENTIFIANT INCONNU
≠ CRÉER UN FLUX
```

Un identifiant de flux mal orthographié ne doit jamais créer un flux en
silence.

## 8. Ce que ce document NE ratifie PAS : l'état du flux

La tentative réelle portait `state = OPEN`. Elle a été refusée **avant** toute
validation de la charge utile, au point « type de création inconnu : stream ».
La conséquence logique est étroite :

```text
BESOIN DE CRÉATION D'UN FLUX
= DÉMONTRÉ

state = OPEN
= NON DÉMONTRÉ
= NON RATIFIÉ
```

Le refus n'a rien dit de la justesse de `OPEN` : il n'a jamais regardé la
charge utile. Exigence de l'amendement 003 :

```text
un flux nouvellement créé doit porter un état DÉJÀ VALIDE
sous la sémantique d'état de flux existante et gelée
```

Si l'implémentation découvre qu'aucun état déjà valide ne représente
véridiquement un TE002 nouvellement ouvert :

```text
NE PAS INVENTER OPEN
NE PAS INVENTER ACTIVE
NE PAS INVENTER READY
SIGNALER UN BLOCAGE SÉMANTIQUE D'ÉTAT, DISTINCT
S'ARRÊTER
```

Ce serait une question de conception séparée, et elle appartiendrait à
l'autorité humaine.

Pour mémoire factuelle, et sans qu'aucun choix ne soit fait ici, le modèle gelé
admet aujourd'hui les valeurs d'état de flux suivantes :

```text
OPEN · IMPLEMENTED · CLOSED · UNKNOWN · UNRESOLVED · NOT_APPLICABLE
```

Laquelle représente véridiquement TE002 au moment de sa création n'est pas
tranchée par ce document.

## 9. Candidat de flux complet

La création explicite construit une entrée de flux complète, au modèle
existant :

```text
id
title
type
state
updated_at
evidence[]
```

`updated_at` est mécanique : il appartient déjà au modèle de flux existant.

```text
NOUVEAU CHAMP DE FLUX
= AUCUN
```

## 10. Exigence de preuve

L'état d'un flux nouvellement créé est substantiel : il exige un soutien typé.

```text
la preuve doit soutenir :
  subject = stream:<nouvel-id>
  field   = state
  value   = l'état valide exactement choisi
```

```text
UNE RÉFÉRENCE EXISTE
≠ L'AFFIRMATION EST ÉTABLIE
```

La décision de sélection de TE002 peut justifier **pourquoi** le flux doit
exister ; elle ne dispense pas la relation de preuve de soutenir explicitement
l'affirmation d'état qui est créée. Ce sont deux choses différentes, et la
seconde reste exigée.

## 11. Création atomique

La discipline déjà établie est réemployée telle quelle :

```text
1.  analyser la demande explicite de création de flux
2.  vérifier que l'identifiant de flux est absent
3.  valider l'état demandé contre la sémantique d'état existante
4.  construire le flux complet en mémoire
5.  l'insérer dans un point de reprise candidat, en mémoire
6.  valider le point de reprise candidat ENTIER
7.  sérialiser canoniquement
8.  remplacer atomiquement PROGRAM-STATE.json
```

```text
en cas d'échec à n'importe quelle étape
→ octets écrits dans PROGRAM-STATE.json = 0
```

Aucun flux partiel.

## 12. Cas de rejet exigés

Sans réparation ni valeur inférée, et sans mutation :

```text
identifiant de flux déjà existant             → rejet · mutation 0
collection ou type de création inconnu        → rejet · mutation 0
id absent                                     → rejet · mutation 0
title absent                                  → rejet · mutation 0
type absent                                   → rejet · mutation 0
state absent                                  → rejet · mutation 0
state non valide sous le modèle existant      → rejet · mutation 0
preuve de soutien absente                     → rejet · mutation 0
preuve ne soutenant pas l'état exact          → rejet · mutation 0
candidat entier invalide                      → rejet · mutation 0
```

Conservés inchangés :

```text
mutation ordinaire d'un identifiant inconnu   → rejet
création d'une décision                       → inchangée
création générique de collection              → rejet
```

## 13. L'amendement 002 s'applique au flux créé

Un flux créé participe immédiatement à toute la sémantique existante :

```text
supersession du soutien actif
rafraîchissement de provenance à valeur égale
détection SOURCE_CHANGED
preuve typée
remplacement atomique
```

```text
MODÈLE DE PREUVE ALTERNATIF POUR LES FLUX
= AUCUN
```

## 14. Premier usage réel prévu

Le premier usage autorisé de l'amendement 003 sera la conséquence déjà
bloquée :

```text
REPRÉSENTER / OUVRIR
= TOOLING-EXPERIMENT-002

ID
= tooling-experiment-002

TITRE
= Durable Mission Representation

TYPE
= TOOLING EXPERIMENT
```

Son `state` exact n'est pas gelé ici. L'implémentation devra d'abord établir
quel état existant valide le représente véridiquement :

```text
un seul état valide mécaniquement impliqué par le modèle et l'état courant
→ l'employer

plusieurs choix substantiels, ou aucun véridique
→ S'ARRÊTER · SIGNALER
```

Aucune invention sémantique.

## 15. Après une création réussie

Ce n'est qu'une fois TE002 durablement existant comme flux que `next_action`
pourra passer de :

```text
représenter / ouvrir le flux TE002
```

à :

```text
concevoir et prédéclarer Mission Object v0
```

La conception elle-même reste hors de l'implémentation de l'amendement 003.

## 16. Mission Object v0 reste bloqué

```text
CONCEPTION MISSION OBJECT v0   NON COMMENCÉE
SCHÉMA MISSION OBJECT          AUCUN
SOURCE MISSION OBJECT          AUCUNE
```

Aucun artefact de conception de l'expérience 002 n'est créé par ce document.

## 17. Backlog directionnel

```text
BACKLOG DE CONSTRUCTION DIRECTIONNEL
= NON NORMATIF
```

Progression validée à ce jour :

```text
état de programme / reprise
→ représentation de mission
```

Tout ce qui suit reste hypothèse, jamais engagement.

## 18. Chronologie à préserver

```text
TE002 sélectionné
→ décision persistée
→ conséquence d'ouverture de flux sélectionnée
→ tentative réelle de création de flux
→ refus
→ CONSTAT 004
→ décision humaine : AMENDEMENT 003
→ matérialisation de l'amendement 003
→ implémentation future
```

## 19. Ce que ce document ne fait pas

```text
IMPLÉMENTATION                 AUCUNE
POINT DE REPRISE MODIFIÉ       NON
CODE DE L'OUTIL MODIFIÉ        NON
TESTS MODIFIÉS                 NON
TESTS EXÉCUTÉS                 0
CHECK RÉEL EXÉCUTÉ             0
NOUVELLE TENTATIVE DE CRÉATION 0
REPRISE FRAÎCHE                0
RESULT-001                     NON CRÉÉ
```

```text
QUESTION EXPÉRIMENTALE DE REPRISE
= TOUJOURS SANS RÉPONSE
```

La maintenance du dogfood continue. Ce que l'expérience a produit jusqu'ici
porte sur la capacité de l'outil à suivre le programme, et non sur la question
de reprise qu'elle s'était posée.
