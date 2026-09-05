# CASE-002 Control Pack

**Ne pas fournir ce dossier aux participants pendant le run.**

Il contient la vérité de référence utilisée après le travail principal :

- un oracle indépendant ;
- les cas visibles rejoués contre l'oracle ;
- des holdouts ;
- une matrice de vérité.

Le control pack ne doit pas être modifié en réaction à ce que les agents produisent, sauf
défaut démontré du control pack lui-même.

## Contenu

```text
reference-engine.mjs
= oracle indépendant, écrit depuis la sémantique publiée

reference-visible.test.mjs
= qualification de l'oracle sur les cas visibles

reference-holdout.test.mjs
= qualification de l'oracle sur les holdouts

holdout-suite.mjs
= suite de holdouts, paramétrée par l'implémentation testée

candidate-holdout.test.mjs
= holdouts appliqués au candidat construit dans ../participant/dist/

TRUTH-MATRIX.md
= vérité externe fixée avant le run
```

## Défaut connu de la fixture

```text
KNOWN DEFECT
= D1
= intentionally present in experimental fixture

NOT
= naturally discovered production defect
```

`D1` est un **défaut racine unique**. Ses manifestations `D1a` / `D1b` / `D1c` ne sont pas
trois défauts distincts et ne doivent jamais être comptées comme tels.

## Indépendance de l'oracle

`reference-engine.mjs` n'a pas été obtenu en copiant l'implémentation participante puis en
corrigeant sa condition. Il est écrit directement depuis la sémantique de `SPEC.md`, avec une
structure différente : copie profonde intégrale de la base, puis parcours des propres clés de
l'overlay, `null` comparé par identité, et aucun test de véracité nulle part.
