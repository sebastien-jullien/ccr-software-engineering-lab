# CASE-005 — Bras témoin (sans CCR)

```text
ÉTAT              COMPLET · CLOS
SESSION           AGENT CCR LAB #8 — BLIND BASELINE PRODUCER
DATE D'EXÉCUTION  2026-09-08
RÉSULTAT          30 / 30
```

Ce document a été créé vide par construction, avant toute production, pour que
le bras témoin ne puisse pas être renseigné après coup à partir du bras CCR. Il
est renseigné ici à partir des preuves de la production du 2026-09-08 et de la
campagne officielle d'évaluation.

## Ce que la phase exigeait — protocole d'origine

Les deux sections qui suivent conservent la règle telle qu'elle était posée
**avant** l'ouverture du bras. Elles documentent le protocole, non l'état
courant : le bras est clos, et ce qui a réellement eu lieu figure plus bas.

```text
ENTRÉE            participant/ — octet pour octet
                  identique à celle remise au bras CCR
SORTIE AUTORISÉE  une seule écriture : src/task-pool.ts
CONTRÔLE          aucun fichier de control/ n'est transmis
```

## Quarantaine — la règle

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

## Production — ce qui a eu lieu

```text
ANCRE GIT AU DÉMARRAGE    e69d9db11f337cbe314af0de252e656f472b676b
                          arbre a3d70979356324d3db3332a9c0180fe4fb6b15b9
                          vérifiés avant extraction · dépôt inchangé après
ENTRÉE                    8 fichiers participant, extraits par git archive
                          du seul sous-arbre participant/
MATÉRIEL DE CONTRÔLE      0 dans le workspace
CHEMIN ÉCRIT              src/task-pool.ts — et lui seul
FICHIERS GELÉS MODIFIÉS   0  (les 7 autres vérifiés octet pour octet)
CCR                       0 commande, 0 invocation
```

Candidat gelé à l'issue de la production :

```text
SHA-256    1a7d7b6ebdbb93fd1a54ee14b51b9f7af8902701d0b193eb304491c3f0d6b172
OCTETS     5265
LIGNES     183        fins de ligne LF uniquement
```

Vérifications du producteur, avant gel — aides personnelles dérivées du seul
`SPEC.md` participant, écrites hors de l'arbre participant :

```text
npx tsc --noEmit          exit 0
node --test (visibles)    10 / 10
sondes P01..P27           27 / 27
sondes de vivacité L1..L5 5 / 5, en processus Node isolés, sortie naturelle
```

```text
POST-FREEZE REMEDIATION   0
SCORE OFFICIEL            NON ÉTABLI PAR CE BRAS — établi en phase 6
```

## Résultat officiel du bras

Établi par la campagne du 2026-09-08, oracle gelé, watchdog 20 000 ms :

```text
T1 PASS · T2 PASS · T3 PASS

AXE A  9 / 9      AXE B  8 / 8      AXE C  6 / 6
AXE D  5 / 5      AXE E  2 / 2

VISIBLE 10 / 10 · CACHÉES 20 / 20 · TOTAL 30 / 30
INCONCLUSIVE 0 · ARTIFACT FAILURE 0 · watchdog déclenché 0
lignes concluantes 30 / 30 — évaluation COMPLÈTE
durées de ligne 100–115 ms · campagne 3 318 ms · exit 0
début 2026-09-08T16:27:15.485Z · fin 2026-09-08T16:27:18.800Z
```

## Quarantaine — tenue

```text
SORTIE SUBSTANTIVE VERS LE BRAS CCR   0
ACCÈS AU CONTRÔLE / AUX RÉFÉRENCES    0
ACCÈS AUX CONTRÔLES NÉGATIFS          0
LIGNES CACHÉES CONSULTÉES             0
```

Le bras CCR a été produit ensuite, sans accès à ce candidat ni à ce document.
