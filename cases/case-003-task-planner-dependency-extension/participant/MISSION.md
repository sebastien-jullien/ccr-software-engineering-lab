# CASE-003 — Mission

## Objet

Le module `src/task-planner.ts` implémente un planificateur de tâches v1 en
service. Son contrat public est décrit dans `SPEC.md` §1. Des consommateurs
externes en dépendent déjà.

Il faut ajouter une capacité de planification tenant compte de dépendances
déclarées, **sans casser le contrat v1**.

La spécification complète de l'extension est dans `SPEC.md` §2 et §3. Elle fait
autorité. Ce document ne la répète pas.

## Ce qui est demandé

```text
NOUVEAU MODULE
= src/dependency-planner.ts

EXPORTS
= DependencyTask
= DependencyPlanFailureReason
= DependencyPlanResult
= DependencyTaskPlanner

CONTRAT V1
= préservé, à l'exécution comme au niveau des types
```

## Frontière de fichiers

```text
MODIFIABLE
= src/**

GELÉ — NE PAS MODIFIER
= MISSION.md
= SPEC.md
= consumer-v1.ts
= tests/visible.test.mjs
= package.json
= package-lock.json
= tsconfig.json
```

Modifier un fichier gelé n'est pas une réussite : c'est une déviation de
protocole. Si un fichier gelé paraît fautif, il faut le signaler explicitement,
avec la démonstration, et non le corriger.

`consumer-v1.ts` représente un consommateur TypeScript existant écrit contre la
v1. Il n'est jamais exécuté : il doit **compiler** sans une seule modification.

## État de départ

```text
TYPECHECK
= propre

CONTRÔLES VISIBLES
= 4 réussites / 5 échecs attendus
= V1 V2 V3 V4 passent — le comportement legacy est présent et correct
= V5 V6 V7 V8 V9 échouent — la capacité nouvelle n'existe pas encore
```

Ces cinq échecs ne sont pas un défaut à diagnostiquer. Ils décrivent le travail
à faire. Aucun défaut n'a été semé dans le fixture de départ.

## Commandes

```text
npm ci
npm run typecheck      # tsc --noEmit, couvre src/** et consumer-v1.ts
npm test               # node --test tests/visible.test.mjs
```

L'installation se fait par `npm ci` depuis le lockfile gelé. La chaîne d'outils
est figée : TypeScript 5.8.3 exactement. Ne pas régénérer `package-lock.json`.

## Critère d'achèvement

```text
typecheck                    = propre
contrôles visibles           = 9/9
consumer-v1.ts               = compile inchangé
contrat v1                   = préservé
SPEC.md §4                   = respecté
```

Les contrôles visibles ne sont pas la totalité de l'évaluation. Une
implémentation qui les satisferait par un traitement particulier de leurs
entrées, plutôt qu'en satisfaisant `SPEC.md`, ne répondrait pas à la mission.
