# CASE-003 — Baseline aveugle non-CCR

Bras de comparaison distinct, conduit sans CCR sur le même pack participant
gelé, dans son propre workspace jetable.

```text
BLIND BASELINE
= COMPLETE

CANDIDAT
= FROZEN
```

```text
BASELINE
≠ run CCR
≠ préqualification de l'oracle ou du fixture
```

CASE-003 est la **première opérationnalisation** d'un bras aveugle non-CCR dans
ce Lab : ni CASE-001 ni CASE-002 n'en comportaient. Le mécanisme n'a donc pas été
réemployé, il a été établi ici.

## Identité

```text
DATE                = 2026-09-07

WORKSPACE           = workspace jetable A, hors du dépôt du Lab
                      …\scratchpad\case003-e1\A

SOURCE DU PACK      = git archive depuis
                      33a32aaff1a24325975555726630daa71edcd6f8
                      (identité d'origine a58e9cd1b43c26e9a3a8dc16330f0bf3e41eda71,
                      réécrite le 2026-09-08 par git filter-repo)
                      cases/case-003-task-planner-dependency-extension/participant

ENTRÉES DE DÉPART   = 10/10 empreintes conformes au paquet ancré
                      0 octet CR
MATÉRIEL DE CONTROL = ABSENT du workspace

EXÉCUTANT           = session Claude Code distincte, dédiée au bras aveugle
                      (AGENT CCR LAB #2)
```

## Provenance du fournisseur

```text
PROVIDER FAMILY
= Claude

CLIENT VERSION AT EXECUTION
= UNKNOWN
= 2.1.224 relevé lors de la préparation du handoff, antérieurement à
  l'exécution ; aucun artefact de la session baseline ne démontre la version
  au moment précis du travail

SEMANTIC MODEL / BACKEND IDENTITY
= UNKNOWN
= jamais inféré
```

```text
PROVIDER          ≠ ROLE
PROVIDER          ≠ CCR SYSTEM RUNTIME
PROVIDER          ≠ SEMANTIC ORIGIN
PROVIDER PROVENANCE = PARTIAL
```

## Quarantaine

```text
BASELINE PRODUITE AVANT LE GEL DU CANDIDAT CCR
= OUI

CONTENU BASELINE CONSULTÉ AVANT LE GEL CCR
= NON

OUVERTURE DE LA QUARANTAINE
= après gel du candidat CCR, sur autorisation explicite
```

Le premier mécanisme de quarantaine envisagé — une session `claude` imbriquée à
sortie redirigée — a été refusé par le classificateur de permissions, puis jugé
insuffisant sur l'entrée : `bypassPermissions` ne cloisonne rien au niveau du
système, et l'outil Bash, indispensable au témoin pour lancer ses tests, rend le
dépôt Lab atteignable. Le bras a donc été confié à une session humaine distincte.

```text
INPUT QUARANTINE PAR CONFINEMENT SYSTÈME
= NON ÉTABLIE

SÉPARATION DE SESSION
= ÉTABLIE par l'humain
```

C'est une limitation d'environnement consignée, pas un assouplissement du
protocole.

## Candidat gelé

```text
POST-FREEZE MODIFICATION
= 0

ENTRÉES GELÉES NON-SOURCE
= 7/7 inchangées
= MISSION.md, SPEC.md, consumer-v1.ts, package.json, package-lock.json,
  tsconfig.json, tests/visible.test.mjs

CHANGEMENTS HORS src/**
= 0

ARTEFACTS DE SONDE RÉSIDUELS
= AUCUN
```

### Chemins modifiés

```text
AJOUTÉS
= src/dependency-graph.ts
= src/dependency-planner.ts

INCHANGÉS
= src/ordering.ts
= src/task-planner.ts
= src/validation.ts
```

Le fixture legacy v1 n'a pas été touché.

### Identité

Méthode identique à celle appliquée au candidat CCR : pour tout `src/**`,
`<sha256><deux espaces><chemin relatif>\n`, trié par chemin, UTF-8 LF, puis
SHA-256 de l'ensemble.

```text
SOURCE FILE COUNT
= 5

SOURCE HASHES
7d5570c5c4fc28288f55c115f7628df0949ca023f2dfb1a07b56f7a26f3e2e39  src/dependency-graph.ts
96be6f6bfab0ac478863f9b8c89856c3e7b9707845832d5b1d6ad12f8986aaee  src/dependency-planner.ts
ffe63b902c76aa64e57a67cd58cefe18da610181edfbb305fa4a80724a936580  src/ordering.ts
6546f8f5b115c3815c7e112637b819b1ad37d5f6911b858c3962cf7fc06dac8e  src/task-planner.ts
a5f81cfc5b722fbcbc8c92b4c3ce3e977599311a91d3362ee910e5336514b9a5  src/validation.ts

CANDIDATE IDENTITY
= 10eebd1b80d53e2d0fa42ef62b74dfabbf2552f566492e2b7c38e94849ecc0b3
```

```text
CANDIDATE IDENTITY
≠ CORRECTNESS
```

## Résultat Layer A

Vérité officielle gelée, 27 lignes, compilateur local verrouillé 5.8.3.

```text
VISIBLE        = 10/10   V1..V9 d'exécution + V10 de compilation
HOLDOUTS       = 17/17   H1..H17
AXE A          = 17/17
AXE B          = 10/10
TOTAL          = 27/27

FULL SOFTWARE SUCCESS
= YES
```

```text
LIGNES EN ÉCHEC
= AUCUNE
```

Le candidat n'a pas été modifié par l'évaluation : l'empreinte de `src/**` est
identique avant et après.

## Sondes auto-écrites

```text
BASELINE SELF-AUTHORED EXTRA PROBES
= participant activity
= NOT OFFICIAL TRUTH
= aucun artefact de sonde ne subsiste dans le workspace
```

Aucune valeur rapportée par le participant n'entre dans les 27 lignes, ni comme
bonus, ni comme substitut d'un holdout.

## Comparaison

```text
A VS B SOFTWARE QUALITY
= voir EVALUATION.md
= aucun classement produit à partir de ce seul record
```
