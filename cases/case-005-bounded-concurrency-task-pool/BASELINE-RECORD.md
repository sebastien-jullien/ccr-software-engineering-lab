# CASE-005 — Bras témoin (sans CCR)

```text
ÉTAT              NOT RUN
SESSION           AGENT CCR LAB #8 — NON OUVERTE
DATE D'EXÉCUTION  —
```

Aucun résultat n'est consigné ici. Ce document est créé vide par construction,
pour que le bras témoin ne puisse pas être renseigné après coup à partir du bras
CCR.

## Ce que la phase exigera

```text
ENTRÉE            participant/ — octet pour octet
                  identique à celle remise au bras CCR
SORTIE AUTORISÉE  une seule écriture : src/task-pool.ts
CONTRÔLE          aucun fichier de control/ n'est transmis
```

## Quarantaine

Le protocole du Lab exige que la sortie substantive du bras témoin n'atteigne
jamais l'opérateur qui conduira ensuite le bras CCR : ni la source, ni
l'algorithme, ni les résultats de tests, ni les chemins modifiés.

```text
AIGUILLAGE DES DEUX BRAS  =  décision humaine
                          =  jamais une initiative de l'agent
```

Une session ne devient pas fraîche parce qu'un en-tête le déclare. L'identité de
l'agent est le **premier** gate du bras CCR — avant l'ancre Git, avant la
provenance du CCR System.

Ce document ne doit jamais être écrit depuis une session contaminée : il serait
lu par la session fraîche et deviendrait lui-même un vecteur de contamination.

## À renseigner après exécution

```text
ancre Git du dépôt au démarrage
identité de session
horodatage de début et de fin
chemins écrits (attendu : exactement un)
T1 · T2 · T3
lignes visibles · lignes cachées · total · inconclusive
preuves R2 conservées
```
