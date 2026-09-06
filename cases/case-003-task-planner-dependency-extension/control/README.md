# CASE-003 — Pack control

**MATÉRIEL AVEUGLE.** Rien de ce répertoire n'est visible du participant, ni
transmis aux sessions natives, ni cité dans un `ccr send`, jusqu'à la clôture
intellectuelle du travail principal et le gel du candidat.

## Contenu

```text
TRUTH-MATRIX.md             27 lignes évaluables — V1..V10 et H1..H17
reference-planner.mjs       oracle indépendant, écrit depuis SPEC.md seule
holdout-suite.mjs           les 17 holdouts, paramétrés par l'implémentation
reference-holdout.test.mjs  qualification de l'oracle contre les holdouts
reference-visible.test.mjs  qualification de l'oracle contre V1..V9
candidate-holdout.test.mjs  exécution des holdouts contre le candidat gelé
```

## Indépendance

L'oracle est construit directement depuis la sémantique publiée. Il n'est pas
dérivé d'une implémentation participante et ne partage avec elle ni structure,
ni découpage en fonctions, ni nommage, ni mécanisme de détection.

```text
DERIVED FROM PARTICIPANT IMPLEMENTATION
= NO
```

## Exécution

L'oracle se qualifie sur place :

```text
node --test reference-visible.test.mjs
node --test reference-holdout.test.mjs
```

`candidate-holdout.test.mjs` suppose d'être placé dans un répertoire directement
enfant du workspace candidat, de sorte que `../src/` désigne les sources du
candidat.

## V10

`V10` n'est pas ici. C'est la sonde de compilation `participant/consumer-v1.ts`,
délibérément **visible** du participant et gelée. Elle qualifie la surface de
types du fixture et du candidat.

```text
V10
= VISIBLE
≠ HOLDOUT

VISIBLE COMPATIBILITY EVIDENCE
≠ TRUTH LEAKAGE
```

Le moteur de référence est en JavaScript : il ne peut pas porter V10, et n'est
jamais présenté comme le portant.

## Séparation des natures de preuve

```text
RUNTIME EVIDENCE
≠ TYPE-LEVEL EVIDENCE
```

Aucun test `.mjs` de ce répertoire n'établit qu'un type public n'a pas été
élargi. Seule la compilation de `consumer-v1.ts` l'établit.
