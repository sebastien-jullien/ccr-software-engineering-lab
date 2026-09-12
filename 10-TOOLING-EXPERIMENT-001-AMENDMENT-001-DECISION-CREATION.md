# TOOLING-EXPERIMENT-001 — Amendement 001 : création d'une décision

## 1. Statut

```text
TYPE
= amendement de conception, ratifié par l'humain

ORIGINE
= premier constat de dogfood réel

PRÉDÉCLARATION D'ORIGINE
= 09-TOOLING-EXPERIMENT-001-PROGRAM-STATE.md
= INCHANGÉE, OCTET POUR OCTET

CE DOCUMENT
= autorité de l'amendement 001
= GELÉ AVANT IMPLÉMENTATION

IMPLÉMENTATION DE L'AMENDEMENT
= NON COMMENCÉE
```

La prédéclaration d'origine n'est pas retouchée. Cet amendement existe **parce
que** le dogfood a découvert un besoin ; le réécrire dans le document gelé
reviendrait à prétendre que la création de décision y était prévue, et
supprimerait le seul résultat que l'expérience ait produit jusqu'ici.

## 2. Le premier constat de dogfood

L'événement, tel qu'il a eu lieu.

```text
PREMIÈRE TRANSITION RÉELLE
= acceptation humaine de l'exception procédurale divulguée sur la
  qualification unitaire one-shot de la v0

MISE À JOUR DU POINT DE REPRISE
= tentée immédiatement

OUTIL UTILISÉ
= OUI

ÉDITION À LA MAIN
= NON

RÉSULTAT DE LA MISE À JOUR
= REFUSÉE

CODE DE SORTIE
= 2

MUTATION DU DÉPÔT
= 0

MUTATION DU POINT DE REPRISE
= 0
```

La limitation démontrée, dans sa portée exacte :

```text
update d'une décision ou d'un sujet EXISTANT
= supporté

création explicite d'une NOUVELLE décision
= non supporté

identifiant de décision inconnu par le chemin de mutation ordinaire
= correctement rejeté
```

Le refus est net, le message exact, le code de sortie approprié et l'écriture
nulle. Le comportement observé est celui qu'un outil d'état doit avoir quand il
ne sait pas faire : il ne devine pas.

Cette limitation n'est **pas** étendue par analogie aux flux ni à une autre
collection. Elle porte sur ce qui a été mesuré, et rien de plus.

## 3. État exact du dogfood

Les deux formulations commodes sont fausses, et aucune ne doit être écrite.

```text
DOGFOOD = NOT STARTED       FAUX — un usage réel a eu lieu
DOGFOOD = IN MAINTENANCE    FAUX — l'ouverture a été bloquée
```

La distinction exacte :

```text
OUVERTURE DU DOGFOOD
= TENTÉE

PREMIER CONSTAT
= PRODUIT

PÉRIODE DE MAINTENANCE NORMALE
= PAS ENCORE OUVERTE

ESSAI DE REPRISE EN CONTEXTE FRAIS
= NON EXÉCUTÉ

RESULT-001
= PAS ENCORE
```

## 4. Classification du constat

```text
CONSTAT
= la surface de mutation de la v0 ne sait pas ajouter une décision
  nouvellement survenue

CLASSE
= ÉCART DE CONCEPTION / SURFACE DE MUTATION

DÉFAUT DU MODÈLE D'ÉTAT
= NON

DÉFAUT DU MODÈLE D'AUTORITÉ
= NON

DÉFAUT DU MODÈLE DE PREUVE
= NON

DÉFAUT DU MODÈLE DE PERSISTANCE
= NON

BOGUE D'IMPLÉMENTATION
= NON
```

La raison est précise :

```text
decisions[]
= existe déjà dans le modèle d'état gelé

la capacité manquante est uniquement
= la création explicite par la commande update existante
```

Le code fait exactement ce que la prédéclaration a spécifié. C'est la
prédéclaration qui n'avait pas prévu de chemin de création.

## 5. Amendement 001 — ce qui change, et ce qui ne change pas

```text
AMENDEMENT 001
= ACCEPTÉ

COMMANDES EXPOSÉES
= resume / check / update
= INCHANGÉES

NOUVELLE COMMANDE
= NON

MODÈLE D'ÉTAT
= INCHANGÉ

CHAMPS SÉMANTIQUES
= INCHANGÉS

MODÈLE DE PERSISTANCE
= INCHANGÉ

MODÈLE D'AUTORITÉ
= INCHANGÉ

MODÈLE DE PREUVE
= INCHANGÉ
```

L'unique extension de surface sémantique :

```text
update
= muter une entrée supportée existante
OU
= créer explicitement une nouvelle entrée de décision
```

## 6. Création de décision uniquement

```text
CRÉATION D'UNE DÉCISION
= BESOIN DÉMONTRÉ
= INCLUSE DANS L'AMENDEMENT 001

CRÉATION D'UN FLUX
= NON DÉMONTRÉE PAR CE CONSTAT
= DIFFÉRÉE
```

Aucune autre collection n'est autorisée à la création par analogie. Si un
dogfood ultérieur démontre qu'une création de flux est nécessaire, ce sera un
constat distinct, et il devra être mesuré comme celui-ci l'a été.

## 7. Création explicite, jamais upsert implicite

Le comportement de mutation ordinaire est conservé tel quel :

```text
update ordinaire
+ sujet ou identifiant inconnu
→ REJET
```

La création doit passer par un mode explicite de la commande `update`. La forme
exacte des arguments est un détail d'implémentation ; conceptuellement :

```text
update
  --create decision
  ...
```

ou toute forme mécaniquement équivalente et non ambiguë.

```text
MUTER UN IDENTIFIANT INCONNU
≠ CRÉER UN NOUVEL IDENTIFIANT
```

Aucun upsert implicite. Un identifiant mal orthographié doit rester une erreur
bruyante, jamais une entrée fantôme créée en silence.

## 8. Création atomique

L'entrée de création doit porter de quoi construire une décision **complète**
en une seule opération :

```text
id
question
state
relation(s) de preuve
```

État admis à la création :

```text
PENDING
RATIFIED
```

L'état d'une décision nouvellement créée est substantiel : il exige donc une
provenance, exactement comme une mutation substantielle.

Sémantique algorithmique gelée :

```text
1.  analyser la décision nouvelle demandée
2.  vérifier que l'identifiant n'existe pas déjà
3.  construire en mémoire la décision candidate complète
4.  l'insérer dans un point de reprise candidat, en mémoire
5.  valider le point de reprise candidat entier
6.  sérialiser canoniquement le candidat
7.  remplacer atomiquement PROGRAM-STATE.json

si une étape échoue
→ octets écrits dans le point de reprise du dépôt = 0
```

Pas de création en plusieurs écritures. La validation porte sur le point de
reprise **entier** après insertion, pas sur la seule entrée ajoutée : une
création qui rendrait l'ensemble incohérent doit échouer.

## 9. Remplacement atomique du fichier

L'implémentation ne doit jamais laisser un point de reprise partiellement
écrit. Un motif local ordinaire de remplacement atomique convient :

```text
écrire un fichier temporaire voisin, complet
→ le fermer avec succès
→ renommer / remplacer la destination
```

ou tout équivalent mécanique adapté à la plateforme. Le nom du fichier
temporaire est un détail d'implémentation.

```text
MUTATION GIT PAR update
= AUCUNE
```

## 10. Cas de rejet à la création

Comportement prédéclaré, sans réparation ni valeur inférée :

```text
identifiant de décision déjà existant        → rejet · mutation 0
collection ou type de création inconnu       → rejet · mutation 0
id absent                                    → rejet · mutation 0
question absente                             → rejet · mutation 0
état illégal                                 → rejet · mutation 0
état substantiel sans preuve valide          → rejet · mutation 0
preuve ne soutenant pas l'affirmation        → rejet · mutation 0
point de reprise candidat invalide           → rejet · mutation 0
```

## 11. Ce que l'amendement ne touche pas

La règle d'incertitude déjà acquise reste en vigueur :

```text
UNKNOWN · UNRESOLVED · NOT_YET_SELECTED
= décliner d'affirmer un fait
= n'exigent aucune provenance fabriquée pour rester incertains
```

Cet amendement porte sur la création explicite d'une décision **substantielle**.
Il ne change pas la sémantique de l'incertitude ailleurs.

Les politiques d'accessibilité des preuves sont inchangées :

```text
VERIFIABLE
OPAQUE_BUT_ESTABLISHED
SEALED
```

```text
UNREACHABLE
= issue de vérification courante
≠ politique permanente d'une preuve
≠ fausseté historique
```

Aucun déréférencement de source protégée n'est autorisé.

## 12. Premier usage prévu après implémentation

La transition réelle déjà ratifiée, que l'outil amendé devra savoir persister :

```text
NOUVELLE DÉCISION

question
= accepter l'exception procédurale divulguée sur la qualification unitaire
  one-shot de TOOLING-EXPERIMENT-001 v0 ?

state
= RATIFIED

autorité
= humaine

preuve
= référence durable à la ratification humaine explicite
= OPAQUE_BUT_ESTABLISHED
```

Elle n'est pas créée par ce document. L'outil actuel ne sait pas le faire, et
l'édition à la main est interdite comme contournement.

```text
RÉSULTAT TECHNIQUE 30 / 30
≠ ACCEPTATION HUMAINE DE L'EXCEPTION PROCÉDURALE
```

Les deux faits coexistent, et ils sont distincts.

## 13. Divergence assumée du point de reprise

```text
PROGRAM-STATE.json
= représente encore le dernier état persisté avec succès
= NON ÉDITÉ À LA MAIN
```

Une décision réelle plus récente existe désormais hors de lui. Cette divergence
est **elle-même une partie vivante du constat** : elle durera tant que l'outil
amendé ne saura pas la persister, et la contourner à la main effacerait la
mesure.

## 14. Chronologie à préserver

```text
PRÉDÉCLARATION
→ IMPLÉMENTATION v0
→ PREMIÈRE TRANSITION RÉELLE DE DOGFOOD
→ REFUS DE LA MISE À JOUR
→ CONSTAT 001
→ AMENDEMENT DE CONCEPTION 001, RATIFIÉ PAR L'HUMAIN
→ implémentation amendée, à venir
→ persistance réussie de la transition bloquée, à venir
```

Aucune étape ultérieure ne doit être décrite comme si le premier constat
n'avait pas eu lieu. Il n'est pas non plus nécessaire de reproduire le refus
pour le prouver de nouveau : il est établi.

## 15. Exigence de qualification de la v0 amendée

L'implémentation de l'amendement 001 devra ajouter une couverture unitaire
ciblée sur au moins :

```text
création réussie d'une décision RATIFIED
création réussie d'une décision PENDING
identifiant dupliqué rejeté
collection ou type inconnu rejeté
champ requis absent rejeté
état illégal rejeté
preuve absente ou invalide rejetée
une création échouée écrit 0 octet dans le point de reprise
la preuve créée soutient exactement l'état de la décision
la mutation ordinaire d'un identifiant inconnu reste rejetée
la création d'une décision est atomique
aucun chemin de création de flux n'existe
```

Les tests existants pertinents de la v0 doivent continuer à passer.

```text
SUCCÈS DES TESTS UNITAIRES
≠ SUCCÈS DU DOGFOOD
```

## 16. Ce que ce document ne fait pas

```text
PRÉDÉCLARATION D'ORIGINE   INCHANGÉE
CODE DE L'OUTIL            INCHANGÉ
TESTS                      INCHANGÉS
PROGRAM-STATE.json         INCHANGÉ
README                     INCHANGÉ
RESULT-001                 NON CRÉÉ
DOGFOOD REJOUÉ             NON
TESTS EXÉCUTÉS             0
```

```text
QUESTION EXPÉRIMENTALE DE REPRISE
= TOUJOURS SANS RÉPONSE
```

Le dogfood a produit son premier résultat, et ce résultat ne porte pas sur la
question posée : il porte sur la capacité de l'outil à suivre le programme. La
question de la reprise reste entière.
