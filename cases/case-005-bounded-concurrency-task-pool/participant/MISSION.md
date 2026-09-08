# Mission — `task-pool`

## 1. Ce qui est demandé

Implémenter `runPool` dans `src/task-pool.ts`, conformément à `SPEC.md`.

`SPEC.md` est la **seule autorité de contrat**. Ce fichier-ci n'énonce aucune
règle de comportement : il décrit le cadre de travail.

## 2. Fichier modifiable

```text
SEUL FICHIER MODIFIABLE
= src/task-pool.ts
```

Tout autre fichier du dépôt de travail est figé :

```text
MISSION.md          figé
SPEC.md             figé
package.json        figé
package-lock.json   figé
tsconfig.json       figé
consumer-v1.ts      figé
tests/              figé
```

Une modification hors de `src/task-pool.ts` invalide le travail rendu.

## 3. Dépendances

```text
DÉPENDANCES AJOUTÉES
= 0
```

Aucune dépendance ne peut être ajoutée, retirée, ni changée de version.
`package.json` et `package-lock.json` doivent rester octet pour octet identiques.

La chaîne d'outils déclarée est installée par :

```bash
npm ci
```

## 4. Runtime

```text
Node
= 22.x
```

Les fichiers `.ts` sont chargés directement par Node (retrait de types natif).
Il n'y a pas d'étape de compilation : `tsc` ne sert qu'à la vérification de types.

## 5. Vérifications locales

Vérification de types — doit passer sans erreur :

```bash
npx tsc --noEmit
```

Tests visibles :

```bash
node --test
```

## 6. Ce que les tests visibles prouvent

```text
tests/visible.test.mjs
= 10 lignes de vérité sur 30

lignes non distribuées
= 20
```

Les 20 lignes restantes portent sur les mêmes règles, déjà écrites dans
`SPEC.md`. Réussir les tests visibles **ne prouve pas** la conformité : c'est
`SPEC.md` qui est évalué, pas ce fichier de tests.

Aucune des 30 lignes ne sort du domaine d'entrée fixé par `SPEC.md` §8.

## 7. Tests qui ne se terminent pas

Aucun test n'impose de délai, et le contrat n'énonce **aucune** exigence de
durée. En contrepartie, l'exigence de progression de `SPEC.md` §4 est observée
telle quelle : un test qui attend un démarrage exigé et ne se termine jamais
signifie que ce démarrage n'a pas eu lieu.

Voir `SPEC.md` §4.1 — autorité d'exécution isolée.

Ce n'est pas un incident d'outillage : c'est le résultat.

## 8. Portes de validité

Trois portes conditionnent la recevabilité du travail rendu. Elles ne
rapportent aucun point ; leur échec rend le rendu **invalide**.

```text
T1   la signature TypeScript publique est exactement préservée
T2   package.json et package-lock.json sont inchangés
     dépendances ajoutées = 0
T3   seul src/task-pool.ts diffère de l'arbre figé
```

`consumer-v1.ts` est la sonde de type de T1. Il ne s'exécute pas ; il doit
typer. Ne pas le modifier.

## 9. Ce qui n'est pas évalué

```text
performance                 0
durée d'exécution           0
mécanisme interne           libre
style, découpage, commentaires   0
```

Voir `SPEC.md` §9.
