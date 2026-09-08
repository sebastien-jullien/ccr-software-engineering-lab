# CASE-005 — RUN-001 (bras CCR)

```text
ÉTAT              NOT STARTED
SESSION           AGENT CCR LAB #9 — NON OUVERTE
RUN CCR           aucun run n'existe
DATE D'EXÉCUTION  —
```

Aucune invocation de `ccr start`, `ccr step`, `ccr send`, `ccr end-production`
ou `ccr reactivate-production` n'a eu lieu pour ce cas.

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

## Gates d'ouverture

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

## À renseigner après exécution

```text
identité de session
ancre Git du dépôt au démarrage
version et commit du CCR System
identifiant du run CCR
invocations natives de production consommées / 16
état de terminaison native
horodatage de début et de fin
chemins écrits (attendu : exactement un)
T1 · T2 · T3
lignes visibles · lignes cachées · total · inconclusive
preuves R2 conservées
```

## Non-identités à tenir

```text
COMPLETED            ≠  succès substantiel
ROLE                 ≠  PROVIDER
UNKNOWN              ≠  ZERO
NO_STEPS_INTENDED    ≠  run terminé · CLOSED · convergence · accord
ACTIVITÉ             ≠  fait de cycle de vie
succès               ≠  vainqueur
```
