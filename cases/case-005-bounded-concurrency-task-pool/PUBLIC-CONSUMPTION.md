# CASE-005 — Consommation publique (Layer C)

```text
ÉTAT      COMPLÈTE — PASS — 2026-09-08
SESSION   AGENT CCR LAB #10 — PUBLIC CCR CONSUMER
RUN LU    CCR-20260908-001
```

## Objet de la phase

Layer C n'évalue pas le logiciel. Elle constate ce qu'un consommateur **public**
du run CCR peut apprendre sans accéder au matériel de contrôle : ce que les
surfaces publiques du CCR System disent d'un run réel, et ce qu'elles ne disent
pas.

```text
ENTRÉE AUTORISÉE     surfaces publiques du CCR System
                     journal du run CASE-005 — CCR-20260908-001
ENTRÉE INTERDITE     control/ · TRUTH-MATRIX.md · PREQUALIFICATION.md
                     références · contrôles négatifs
```

## Non-identités à tenir dans la lecture publique

```text
COMPLETED            ≠  succès substantiel
ROLE                 ≠  PROVIDER
UNKNOWN              ≠  ZERO
NO_STEPS_INTENDED    ≠  run terminé · CLOSED · convergence · accord
ACTIVITÉ             ≠  fait de cycle de vie
PROPOSAL             ≠  DECISION
```

Une intention de production close ne dit rien du résultat logiciel : elle est un
fait procédural déclaré par un humain, rien d'autre.

## Ce qui a été consulté

Consommateur public frais, sans accès au contrôle ni aux candidats, sur le CCR
System tel qu'il était ce jour-là : commit source
`8993cbee8991f7b78358dbbc0bfb34f5a84f7b97`, paquet `ccr-system 1.2.0`, ligne de
publication `v1.2.0`. `ccr` n'était pas sur le PATH ; la CLI publique a été
invoquée par `node bin/ccr.mjs`.

```text
F1   run-descriptors --format json                                   exit 0
F2   run-activity CCR-20260908-001 --format json                     exit 0
F2   ... --machine-representation-version 1                          exit 0
F2   ... --machine-representation-version 2                          exit 0
```

Chaque commande a été relue une seconde fois, sans mutation entre les deux.

## Ce que les surfaces publiques établissent

```text
DÉCOUVERTE DU RUN      F1 rend 9 descripteurs à deux champs — run_id, title
                       le titre du run CASE-005 résout exactement 1 descripteur
                       → CCR-20260908-001, découvert sans aide
ACTIVITÉ DURABLE       F2 projection_status = AVAILABLE · 11 activités
                       1 RUN_START + 10 NATIVE_STEP · 0 HUMAN_SEND
                       alternance author → challenger, rounds 1..10 contigus
                       dispositions : COMPLETED 11, et rien d'autre
STABILITÉ              relectures byte-identiques sur les quatre commandes
VERSIONNEMENT          représentation 1 rendue par défaut, à l'identique
                       représentation 2 ajoute exactement une clé
                       aucune montée implicite
production_intent      présent en représentation 2 : STEPS_INTENDED
```

L'unicité du titre est une propriété de l'inventaire de ce jour, pas un contrat :
la spécification publique avertit qu'elle n'est pas garantie.

## Ce que les surfaces publiques n'établissent pas

```text
budget de production fixe          ABSENT
maximum du budget (16)             ABSENT
invocations consommées (12)        ABSENT
budget inutilisé (4)               ABSENT
transfert pendant                  ABSENT
état terminal natif                ABSENT
fin de production intentionnelle   ABSENT
```

Onze activités ne sont pas douze invocations : activité et issue d'invocation
sont deux autorités distinctes, sans jointure définie, et `RUN_START` est une
activité logique unique que la spécification interdit de lire comme un appel
fournisseur. `STEPS_INTENDED` est également la valeur rendue quand aucun fait
d'intention n'a jamais été écrit : de cette surface seule, un consommateur ne
peut pas distinguer « jamais terminé » de « terminé puis réactivé ».

```text
PRODUCT GAP   NON ÉTABLI
```

Constat sur ce que ces deux surfaces publient, à cette version. Aucune
revendication de défaut, aucune décision produit : celle-ci appartient à une
porte humaine ultérieure.

## Écart entre lecture publique et vérité de contrôle

```text
LECTURE PUBLIQUE    la procédure du run, entièrement — qui a parlé, dans quel
                    ordre, jusqu'où, et que chaque passage s'est achevé
VÉRITÉ DE CONTRÔLE  le résultat logiciel — 30/30 contre 30/30, vainqueur NONE
```

Les deux ne se recouvrent pas, et c'est conforme : `COMPLETED` est une frontière
procédurale, jamais un succès substantiel. Rien du score, des lignes de vérité
ni des candidats n'est visible depuis les surfaces publiques, et ce bras n'y a
accédé à aucun moment.
