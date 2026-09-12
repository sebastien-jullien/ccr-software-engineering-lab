# CASE-005 — Évaluation

```text
ÉTAT     COMPLÈTE — 2026-09-08
BASELINE 30 / 30      CCR 30 / 30
WINNER   NONE — égalité stricte
ÉCART D'ISSUE FINALE  0 / 30
```

Ce document a été créé avec sa règle de lecture **avant** toute production, pour
que la règle ne puisse pas être ajustée après avoir vu les résultats. La règle
ci-dessous est celle qui était gelée ; le résultat est consigné à la fin, sans
qu'aucune clause n'ait été touchée entre-temps.

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

## Résultat officiel

Campagne du 2026-09-08, ordre prédéclaré bras témoin puis bras CCR, oracle gelé,
watchdog 20 000 ms non surchargé.

```text
CANDIDAT TÉMOIN #8   1a7d7b6ebdbb93fd1a54ee14b51b9f7af8902701d0b193eb304491c3f0d6b172
                     5265 octets · 183 lignes
CANDIDAT CCR #9      e08598e0c06482ba107d05b95b3799b47a806d4920610439145a689e09c2e761
                     9357 octets · 244 lignes
                     run CCR-20260908-001
```

### Portes de validité

```text
                    T1        T2        T3
BRAS TÉMOIN         PASS      PASS      PASS
BRAS CCR            PASS      PASS      PASS
```

T1 : 9 constats sur 9 de chaque côté — projet type, une sonde conforme, sept
sondes négatives échouant chacune pour la raison visée. T2 : `package.json` et
`package-lock.json` inchangés, 0 dépendance ajoutée. T3 : seul
`src/task-pool.ts` diffère de l'arbre participant figé.

Les deux bras sont donc **valides**, et le score de ligne est calculable pour
les deux.

### Lignes de vérité

```text
                AXE A  AXE B  AXE C  AXE D  AXE E  VISIBLE  CACHÉES  TOTAL
BRAS TÉMOIN      9/9    8/8    6/6    5/5    2/2    10/10    20/20    30/30
BRAS CCR         9/9    8/8    6/6    5/5    2/2    10/10    20/20    30/30
```

```text
lignes concluantes          30 / 30      dans les deux bras
fin naturelle du processus  30 / 30      dans les deux bras
INCONCLUSIVE                0            aucun identifiant
ARTIFACT FAILURE            0            aucun identifiant
watchdogFired               0 ligne      harnessFault 0
durées de ligne             témoin 100–115 ms · CCR 109–123 ms
campagne                    témoin 3 318 ms · CCR 3 571 ms · exit 0 des deux côtés
```

Les 30 lignes — `A01`..`A09`, `B01`..`B08`, `C01`..`C06`, `D01`..`D05`,
`E01`..`E02` — sont `PASS` des deux côtés.

### Lignes divergentes

```text
LIGNES DIVERGENTES ENTRE LES DEUX BRAS   0 / 30
```

Les verdicts sont identiques ligne à ligne. L'écart d'issue finale est nul.

### Verdict

```text
BRAS TÉMOIN   VALIDE · 30 / 30 · SUCCÈS LOGICIEL COMPLET
BRAS CCR      VALIDE · 30 / 30 · SUCCÈS LOGICIEL COMPLET

SOFTWARE WINNER = NONE
```

La règle gelée l'exige : à nombre de lignes égal, il n'y a pas de vainqueur.
Aucun départage n'a été tenté — ni qualité de code, ni bonus de processus, ni
jugement subjectif, ni inspection comparée des deux sources.

### Intégrité de la campagne

```text
RELANCE                            0
REMÉDIATION DE CANDIDAT            0
SONDE OU LIGNE SPÉCIALE AJOUTÉE    0
CHANGEMENT DE HARNAIS ENTRE BRAS   0
CHANGEMENT D'ORACLE ENTRE BRAS     0
CHANGEMENT DE CONTRAT ENTRE BRAS   0
```

Entre les deux campagnes, les 47 empreintes de `FREEZE-MANIFEST.md` ont été
recontrôlées et trouvées identiques, et les deux SHA de candidat sont inchangés
avant et après toute activité d'évaluation.

### Ce que ce résultat n'établit pas

```text
égalité de sortie logicielle   ≠  équivalence du coût de processus
succès logiciel complet        ≠  vainqueur
30/30 des deux côtés           ≠  supériorité ou infériorité de CCR
désaccord résiduel du bras CCR ≠  ambiguïté démontrée du contrat gelé
```

Le coût de processus des deux bras n'est pas comparé ici, et le budget CCR
consommé — 12 invocations sur 16 — reste hors du score logiciel, comme la règle
gelée le prévoit.
