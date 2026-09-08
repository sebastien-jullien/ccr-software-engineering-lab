# CASE-005 — Bounded Concurrency Task Pool

```text
FORME     implémentation asynchrone bornée, à partir d'un squelette
CLASSE    bounded asynchronous feature implementation
CANDIDAT  task-pool
ÉTAT      matérialisé · préqualifié · AUCUNE production expérimentale
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
BASELINE-RECORD.md    bras témoin — NOT RUN
RUN-001-RECORD.md     bras CCR — NOT STARTED
EVALUATION.md         PENDING
PUBLIC-CONSUMPTION.md PENDING
```

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
MATÉRIALISATION GIT      EN ATTENTE — aucun add, commit ni push
PRODUCTION EXPÉRIMENTALE NOT STARTED
```
