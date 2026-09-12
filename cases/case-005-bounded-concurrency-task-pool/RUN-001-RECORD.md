# CASE-005 — RUN-001 (bras CCR)

```text
ÉTAT              COMPLET · CLOS
SESSION           AGENT CCR LAB #9 — BLIND CCR PRODUCER
RUN CCR           CCR-20260908-001
DATE D'EXÉCUTION  2026-09-08
RÉSULTAT          30 / 30
```

Titre du run : `CASE-005 · bounded concurrency task-pool · production CCR #9`.
Génération `NATIVE_V21_EXECUTION`, rôles natifs `author` (claude) et
`challenger` (codex).

## Provenance du CCR System, telle qu'observée

Aucune version n'avait été déclarée à l'avance pour ce cas. Ce qui suit est la
provenance **constatée** pendant l'exécution, et rien d'autre.

```text
COMMIT SOURCE        8993cbee8991f7b78358dbbc0bfb34f5a84f7b97
VERSION DE PAQUET    ccr-system 1.2.0
LIGNE DE PUBLICATION v1.2.0 — version publiée courante à cette date
WORKTREE             propre, non modifié par le cas
CLI                  `ccr` absent du PATH ; invoqué `node bin/ccr.mjs`
                     depuis E:\prog\ccr-system
```

Le commit source est l'identité primaire. Il n'est pas la cible épluchée du tag
`v1.2.0` : il la suit d'un seul commit, qui ne touche qu'un test d'intégration.

## Invocations natives

```text
BUDGET      16 · FROZEN        CONSOMMÉ  12        17e INVOCATION  0
```

```text
01  inv_000001  start  START     author      claude   implémentation initiale
02  inv_000002  start  START     challenger  codex    amorce challenger
03  inv_000003  step   r1        challenger  codex    1 défaut certain + 1 objection
04  inv_000004  step   r2        author      claude   défaut confirmé et corrigé
05  inv_000005  step   r3        challenger  codex    correctif accepté · dilemme §5/§6
06  inv_000006  step   r4        author      claude   dilemme réfuté · livrable inchangé
07  inv_000007  step   r5        challenger  codex    2e défaut certain (asymétrie de latence)
08  inv_000008  step   r6        author      claude   2e défaut corrigé
09  inv_000009  step   r7        challenger  codex    aucun défaut nouveau
10  inv_000010  step   r8        author      claude   argument d'unicité · livrable inchangé
11  inv_000011  step   r9        challenger  codex    aucun défaut nouveau · unicité réfutée
12  inv_000012  step   r10       author      claude   décision assumée · livrable inchangé
13..16                                                NON CONSOMMÉES — arrêt volontaire
```

`ccr start` engage deux invocations : l'amorce `author` et l'amorce
`challenger`.

```text
TERMINAISON NATIVE      non requise, non atteinte
TRANSFERT PENDANT       OUI — author → challenger, evt_000046, round 11
ccr send                0
ccr end-production      0
ccr reactivate-production 0
AJUSTEMENT DU BUDGET    0
```

La contradiction native a produit **deux défauts certains** que le producteur
n'avait pas construits lui-même — un écouteur d'avortement neutralisable par
`stopImmediatePropagation()`, puis une asymétrie de latence entre causes d'arrêt.
Les deux ont été corrigés dans le bras. Les deux derniers tours du challenger
n'ont produit aucun défaut mécanique nouveau : le désaccord résiduel est resté
interprétatif, et il est consigné comme tel, sans être dissous.

## Candidat gelé

```text
SHA-256    e08598e0c06482ba107d05b95b3799b47a806d4920610439145a689e09c2e761
OCTETS     9357
LIGNES     244
CHEMIN ÉCRIT              src/task-pool.ts — et lui seul
FICHIERS GELÉS MODIFIÉS   0
POST-FREEZE REMEDIATION   0
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
durées de ligne 109–123 ms · campagne 3 571 ms · exit 0
début 2026-09-08T16:27:40.387Z · fin 2026-09-08T16:27:43.955Z
```

## Étanchéité du bras

```text
ACCÈS AU CANDIDAT TÉMOIN          0
ACCÈS AU RETOUR DU BRAS #8        0
ACCÈS AU CONTRÔLE / À L'ORACLE    0
LIGNES CACHÉES CONSULTÉES         0
ÉCRITURES GIT                     0 — dépôt Lab inchangé, HEAD e69d9db
```

## Budget de production, gelé

```text
BUDGET                                              16
STATUT                                              FROZEN

invocations natives de production, maximum          16
17e invocation provoquant du quota, dans le seul
  but d'obtenir une terminaison                     INTERDITE
terminaison native                                  NON REQUISE
transfert pendant après épuisement du budget        permis
ajustement du budget après production               INTERDIT
```

## Gates d'ouverture — protocole d'origine

Ce bloc conserve le protocole tel qu'il était posé **avant** l'ouverture du bras.
Il est gardé au temps futur parce qu'il documente la règle, non l'état courant :
le bras est clos, et ce qui a réellement été observé figure plus haut.

Dans cet ordre, avant tout `ccr start` :

```text
1.  identité de la session          fraîche, non contaminée par le bras témoin
2.  authentification fournisseur    `ccr doctor` d'abord — une CLI fournisseur
                                    non authentifiée bloque le run avant toute
                                    allocation
3.  ancre Git du dépôt              consignée
4.  provenance du CCR System        version et commit consignés
5.  watchdog opérationnel           20 000 ms par ligne · HUMAN FROZEN
```

Aucun secret n'est lu ni manipulé pour obtenir un résultat.

## Non-identités à tenir

```text
COMPLETED            ≠  succès substantiel
ROLE                 ≠  PROVIDER
UNKNOWN              ≠  ZERO
NO_STEPS_INTENDED    ≠  run terminé · CLOSED · convergence · accord
ACTIVITÉ             ≠  fait de cycle de vie
succès               ≠  vainqueur
```
