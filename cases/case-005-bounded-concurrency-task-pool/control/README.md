# `control/` — oracle, références, contrôles négatifs

**Aucun fichier de ce répertoire n'est distribué à un producteur.** Il contient
les 20 lignes cachées, deux solutions complètes et sept solutions
volontairement défectueuses.

## Inventaire

```text
baseline.mjs              arbre participant figé : inventaire, empreintes,
                          matérialisation d'un arbre d'épreuve
deferred-harness.mjs      tâches différées ; chaque règlement est déclenché
                          par le harnais, jamais par une durée
rows.mjs                  agrégation des 30 lignes
holdout-axis-a..e.mjs     les 30 lignes, par axe
row-child.mjs             exécution isolée d'UNE ligne
runner.mjs                lancement du processus enfant + hiérarchie de verdict
evaluate.mjs              campagne complète sur une implémentation
candidate-visible.test.mjs  vue node:test des 10 lignes visibles
candidate-holdout.test.mjs  vue node:test des 20 lignes cachées
t1.mjs · t1-probes/       porte T1 (signature publique préservée)
t2-t3.mjs                 portes T2 et T3 (intégrité de l'arbre rendu)
gates.mjs                 T1 + T2 + T3 sur une implémentation
freeze-manifest.mjs       empreintes de gel
participant-baseline.sha256  inventaire figé de l'arbre participant
reference-1.ts            référence 1 — boucle de travailleurs
reference-2.ts            référence 2 — ordonnanceur / recharge
negative/nc1..nc7.ts      contrôles négatifs, défauts intentionnels
negative/op-w1.ts         sonde opérationnelle du watchdog — NON notée
```

## Un seul oracle

`evaluate.mjs` et les deux `candidate-*.test.mjs` passent tous par `runner.mjs`.
Une ligne n'a donc jamais deux verdicts concurrents.

## Hiérarchie de verdict

```text
A  événement requis observé (la ligne a conclu)   → PASS / FAIL sémantique
B  fin réelle du processus sans conclusion,
   sans watchdog et sans panne de harnais         → ROW FAIL
C  watchdog termine avant A ou B                  → ROW INCONCLUSIVE
D  panne d'évaluateur / de harnais                → EVALUATION ARTIFACT FAILURE
                                                    (jamais un échec du candidat)
```

`beforeExit` est journalisé pour le diagnostic seul. Il n'a **aucune** autorité
de verdict : un candidat qui y ordonnance une progression et produit
l'événement requis avant la fin réelle du processus doit pouvoir réussir.

## Isolement

Une ligne = un processus enfant = une invocation fraîche de `runPool`, des
tâches fraîches, des différés frais, un `AbortController` frais. Aucun état
runtime ne traverse deux lignes. Les lignes sont exécutables individuellement,
dans un ordre arbitraire, ou en suite complète, avec un résultat identique.

## Watchdog

Le watchdog est **opérationnel**, jamais une vérité logicielle :

```text
VALEUR             20 000 ms par ligne isolée · HUMAN FROZEN
                   control/runner.mjs · DEFAULT_WATCHDOG_MS

watchdog déclenché → INCONCLUSIVE
INCONCLUSIVE       → ni PASS ni FAIL, JAMAIS FAIL
```

Aucune ligne n'a de seuil de durée. Une exigence de progression non satisfaite
se manifeste par la **fin naturelle** du processus enfant sans conclusion
(cas B), pas par l'expiration du watchdog.

## Usage

Campagne complète :

```bash
node evaluate.mjs --impl reference-1.ts --label reference-1 --out <evidence>
```

Portes de validité :

```bash
node gates.mjs --impl reference-1.ts --label reference-1 --out <evidence>
```

Sous-ensemble de lignes, ordre imposé :

```bash
node evaluate.mjs --impl reference-2.ts --label solo --rows D03
```
