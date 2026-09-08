# CASE-005 — Évaluation

```text
ÉTAT     PENDING
MOTIF    aucune production expérimentale n'a eu lieu
         BASELINE PRODUCTION = NOT STARTED
         CCR PRODUCTION      = NOT STARTED
```

Aucun score n'est établi. Aucun vainqueur n'est désigné. Ce document est créé
avec sa règle de lecture **avant** toute production, pour que la règle ne puisse
pas être ajustée après avoir vu les résultats.

## Ordre d'évaluation, gelé

```text
1.  T1 · T2 · T3          portes de validité
2.  30 lignes de vérité   en processus isolés
```

Si l'une des portes échoue :

```text
RUN INVALID
aucun score de ligne de vérité n'est calculé
```

## Lecture des lignes

```text
PASS            événement requis observé, assertions sémantiques satisfaites
FAIL            assertions non satisfaites
                OU fin naturelle du processus sans l'événement requis
INCONCLUSIVE    le watchdog a terminé l'enfant avant tout constat A ou B
ARTIFACT        panne d'évaluateur ou de harnais — JAMAIS un échec du candidat
```

## Score

```text
SCORE  =  lignes réussies / 30

calculé UNIQUEMENT si les 30 lignes sont concluantes
```

Une seule ligne non concluante :

```text
CANDIDATE EVALUATION       = INCOMPLETE
FINAL SCORE                = NOT ESTABLISHED
SOFTWARE WINNER COMPARISON = FORBIDDEN
```

Rapport descriptif alors autorisé :

```text
lignes observées · réussites observées · échecs observés · lignes non concluantes
```

Interdit dans ce cas :

```text
réussites / lignes observées      comme score final
```

L'autorité de vérité reste **30 lignes**, jamais le nombre de lignes qui ont pu
être observées.

## Vainqueur

Uniquement pour un run valide dont les 30 lignes sont concluantes :

```text
nombre de lignes strictement supérieur   →  SOFTWARE WINNER
nombre égal                              →  SOFTWARE WINNER NONE

SUCCÈS LOGICIEL COMPLET = 30/30 + T1 PASS + T2 PASS + T3 PASS
SUCCÈS ≠ VAINQUEUR
```

## Ce qui n'entre dans aucun score

```text
performance                             0
durée d'exécution                       0
mécanisme interne, style, découpage     0
watchdog                                opérationnel — jamais une vérité
beforeExit                              diagnostic — aucune autorité de verdict
consommation du budget CCR              consignée, hors score logiciel
```

## À renseigner après exécution

```text
bras témoin   T1/T2/T3 · visible · caché · total · inconclusive
bras CCR      T1/T2/T3 · visible · caché · total · inconclusive
verdict de validité de chaque bras
score de chaque bras, si et seulement s'il est établi
SOFTWARE WINNER · ou NONE · ou comparaison INTERDITE
lignes divergentes entre les deux bras, une à une
```
