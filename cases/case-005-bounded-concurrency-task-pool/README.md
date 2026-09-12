# CASE-005 — Bounded Concurrency Task Pool

```text
FORME     implémentation asynchrone bornée, à partir d'un squelette
CLASSE    bounded asynchronous feature implementation
CANDIDAT  task-pool
ÉTAT      exécuté · évalué · CLOS — 30/30 contre 30/30, aucun vainqueur
```

## Forme du cas

Les quatre premiers cas du Lab portaient sur un squelette synchrone à
implémenter (CASE-001), une base imparfaite à diagnostiquer (CASE-002), une
extension rétrocompatible d'un contrat public (CASE-003) et une optimisation
bornée préservant le comportement (CASE-004).

CASE-005 change d'axe : la difficulté n'est plus dans la logique métier, mais
dans **l'ordonnancement**. Le contrat ne dit presque rien de ce qu'il faut
calculer — il dit ce qui doit démarrer, quand, dans quel ordre, et surtout ce
qui ne doit **jamais** démarrer.

La question expérimentale est : **une exigence de progression se démontre-t-elle
autrement qu'en attendant assez longtemps ?**

## La réponse tenue par ce cas

Non par un délai. Par la **fin naturelle d'un processus isolé**.

Chaque ligne de vérité sensible à la vivacité s'exécute dans un processus Node
dédié qui n'ouvre aucun handle d'observation durable. Si ce processus se termine
de lui-même sans que la transition exigée ait eu lieu, la transition n'aura
jamais lieu : rien ne pouvait plus la produire. C'est un **fait**, pas un délai
écoulé.

```text
watchdog déclenché  →  INCONCLUSIVE   (ni PASS ni FAIL)
fin naturelle       →  FAIL           (fait de non-progression)
```

Le watchdog reste purement opérationnel : il empêche une campagne de rester
bloquée, il ne prononce jamais une vérité logicielle.

## Trois dimensions, aucune redondante

```text
AXE A   invocation, bornage, ordre des résultats     9 lignes
AXE B   borne de concurrence et recharge             8 lignes
AXE C   échec de tâche, cause d'arrêt, quiescence    6 lignes
AXE D   sémantique d'AbortSignal                     5 lignes
AXE E   validation d'entrée                          2 lignes
TOTAL                                               30 lignes

VISIBLE      10        HIDDEN      20        SUBJECTIF     0
```

```text
T1   signature TypeScript publique exactement préservée
T2   package.json / package-lock.json inchangés · dépendances ajoutées = 0
T3   seul participant/src/task-pool.ts diffère de l'arbre figé
```

T1/T2/T3 sont **hors matrice** : elles ne rapportent aucun point, et leur échec
rend le rendu invalide.

## Ce qui n'est pas mesuré

```text
performance             0
durée d'exécution       0
mécanisme interne       libre
phase de boucle d'événements imposée   aucune
gel runtime du tableau de résultats    aucune ligne
```

Aucune ligne de vérité ne dépend du comportement attendu de CCR.

## Arborescence

```text
participant/     paquet remis à un producteur — sans aucun matériel de contrôle
control/         oracle, 30 lignes, 2 références, 7 contrôles négatifs
README.md        ce document
RUNBOOK.md       procédure d'exécution du cas
TRUTH-MATRIX.md  les 30 lignes — CONTROL-PRIVATE
PREQUALIFICATION.md   preuves de préqualification de l'oracle
FREEZE-MANIFEST.md    empreintes de gel
BASELINE-RECORD.md    bras témoin #8 — 30/30
RUN-001-RECORD.md     bras CCR #9 — 30/30, run CCR-20260908-001
EVALUATION.md         résultat officiel — égalité, vainqueur NONE
PUBLIC-CONSUMPTION.md Layer C #10 — PASS
```

## Résultat

Les deux bras atteignent le **succès logiciel complet**. À égalité stricte, la
règle gelée interdit tout départage.

```text
BRAS TÉMOIN #8   30 / 30    T1 PASS · T2 PASS · T3 PASS
BRAS CCR #9      30 / 30    T1 PASS · T2 PASS · T3 PASS
                            run CCR-20260908-001 · 12 invocations sur 16

VERDICTS LIGNE À LIGNE      identiques sur les 30 lignes
ÉCART D'ISSUE FINALE        0 / 30
SOFTWARE WINNER             NONE
```

La question expérimentale posée en tête de ce document reçoit une réponse
mécanique. Aucune ligne n'a été tranchée par un délai : les 30 lignes des deux
bras ont conclu par la fin naturelle de leur processus isolé, et le watchdog
opérationnel ne s'est déclenché nulle part.

```text
lignes concluantes          30 / 30   dans les deux bras
fin naturelle du processus  30 / 30   dans les deux bras
watchdog déclenché          0 ligne
INCONCLUSIVE                0 ligne
ARTIFACT FAILURE            0 ligne
```

Ce que ce résultat ne dit pas :

```text
égalité de sortie logicielle   ≠  équivalence du coût de processus
succès logiciel complet        ≠  vainqueur
30/30 des deux côtés           ≠  jugement sur la contradiction CCR
```

Résultat officiel dans [`EVALUATION.md`](EVALUATION.md), production des bras dans
[`BASELINE-RECORD.md`](BASELINE-RECORD.md) et
[`RUN-001-RECORD.md`](RUN-001-RECORD.md), lecture publique dans
[`PUBLIC-CONSUMPTION.md`](PUBLIC-CONSUMPTION.md).

## État

```text
CONTRAT LOGICIEL         FROZEN
MATRICE DE VÉRITÉ        FROZEN
BUDGET DE PRODUCTION CCR 16 · FROZEN
ORACLE                   PRÉQUALIFIÉ
RÉFÉRENCES               PRÉQUALIFIÉES
CONTRÔLES NÉGATIFS       PRÉQUALIFIÉS
WATCHDOG OPÉRATIONNEL    20 000 ms par ligne · HUMAN FROZEN
PRODUCER-READY FREEZE    YES
MATÉRIALISATION GIT      COMPLÈTE — commit e69d9db
PRODUCTION EXPÉRIMENTALE FAITE — 2026-09-08
BRAS TÉMOIN #8           COMPLET · 30 / 30
BRAS CCR #9              COMPLET · 30 / 30 · run CCR-20260908-001
ÉVALUATION               COMPLÈTE · SOFTWARE WINNER NONE · écart 0 / 30
LAYER C #10              PASS
INSTRUMENT CCR OBSERVÉ   source 8993cbe · paquet 1.2.0 · ligne v1.2.0
CAS                      CLOS
```
