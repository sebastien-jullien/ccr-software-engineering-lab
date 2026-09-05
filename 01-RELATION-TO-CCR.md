# Relation entre CCR Software Engineering Lab et CCR System

## 1. Séparation structurelle

```text
CCR SYSTEM
= R&D product
= public contracts
= authority model
= durable run mechanics
= machine surfaces

CCR SOFTWARE ENGINEERING LAB
= experimental consumer
= software-engineering use cases
= empirical observation
= disposable consumers
```

Le Lab est **en aval** de CCR. Il ne devient pas une source normative de CCR.

## 2. Asymétrie recherchée

> Un futur système industriel peut utiliser CCR parce que CCR est suffisamment général ; CCR ne doit pas devenir la description interne de ce système industriel.

Donc :

```text
industrial workflow requirement
≠ CCR requirement
```

Un besoin provenant d'un workflow externe doit être redémontré comme friction CCR avant toute décision produit.

## 3. Ce qui ne doit pas être importé automatiquement dans CCR

Le Lab peut manipuler des notions opérationnelles telles que : orchestrateur, analyste, implémentateur, expertiseur, contre-expertiseur, routage, sessions persistantes, parallélisme ou reprise d'une action.

Ces notions appartiennent au scénario ou au consommateur. Elles ne deviennent pas automatiquement des rôles, autorités, contrats, états ou commandes CCR.

## 4. Compatibilité avec l'usage industriel futur

Le Lab peut servir de terrain de preuve pour vérifier qu'un système externe pourrait exploiter CCR.

La question est :

> Les primitives et surfaces publiques de CCR permettent-elles de conserver, confronter et récupérer les faits nécessaires sans faire dépendre CCR du workflow externe ?

Si oui :

```text
CCR CHANGE
= NONE
```

Si non, la friction doit être qualifiée avant toute décision.
