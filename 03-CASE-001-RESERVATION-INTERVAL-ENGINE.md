# CASE-001 — Reservation Interval Engine

## 1. Intention

Créer un micro-projet logiciel autonome et jetable servant de premier terrain réel pour CCR Software Engineering Lab.

Le projet lui-même est volontairement simple. L'intérêt se situe dans le traitement réel du cas par CCR, la contradiction entre ses experts natifs, la provenance des affirmations, la capacité à corriger des conclusions erronées et la comparaison finale avec une vérité fonctionnelle indépendante.

## 2. Fonctionnalité

Construire une petite bibliothèque de réservation d'intervalles.

API conceptuelle minimale :

```text
reserve(start, end)
cancel(id)
list()
```

## 3. Règles fonctionnelles fondatrices

```text
INTERVAL MODEL
= [start, end)

VALID INTERVAL
= start < end

ADJACENT INTERVALS
= allowed

OVERLAPPING ACTIVE INTERVALS
= rejected

CANCELLED INTERVAL
= no longer blocks reservation

TIMESTAMPS
= normalized according to the case specification

LISTING
= deterministic
```

La spécification d'exécution détaillée devra être fixée avant le run et ne devra pas changer silencieusement pendant l'expérience.

## 4. Pourquoi ce cas

Ce domaine produit naturellement des erreurs plausibles : confusion entre chevauchement et adjacency, erreurs sur les bornes ouvertes/fermées, normalisation temporelle incorrecte, gestion incorrecte des annulations, intervalles invalides, ordre de sortie instable.

Ces erreurs ne doivent pas être injectées artificiellement.

## 5. Vérité externe

Avant le run, préparer :

```text
PUBLIC SPECIFICATION
= explicit rules

VISIBLE TESTS
= ordinary examples

REFERENCE / HOLDOUT CASES
= independent verification material
```

Les holdout cases ne servent pas à piéger les agents. Ils servent à rendre possible une évaluation a posteriori telle que :

```text
REAL DEFECT
FALSE POSITIVE
MISSED DEFECT
CORRECT REJECTION
INSUFFICIENT EVIDENCE
```

## 6. Phénomènes que le cas peut révéler

Exemples possibles, non préprogrammés :

```text
ONE CCR EXPERT MISSES AN ISSUE
→ the other catches it

ONE CCR EXPERT PRODUCES A FALSE POSITIVE
→ contradiction rejects it

BOTH EXPERTS CONVERGE
→ later control evidence may still disprove the conclusion

AVAILABLE CCR EVIDENCE IS INSUFFICIENT
→ human intervention / more evidence / defer
```

Ces motifs ne sont pas des objectifs à provoquer.

## 7. Résultat attendu du Lab

À la fin du cas, comparer :

```text
claims made
challenges / corrections made
CCR expert interactions
evidence available at each step
human decisions
reference outcome
```

Puis répondre notamment :

1. Les erreurs réelles ont-elles été distinguées des faux positifs ?
2. Les corrections ont-elles été justifiées par des preuves ?
3. Les inconnues ont-elles été conservées comme telles ?
4. La frontière entre constat et remédiation est-elle restée claire ?
5. Le run est-il compréhensible après plusieurs désaccords ?
6. Les surfaces publiques permettent-elles une consommation externe utile ?


## 8. Dossier exécutable

Le cas est matérialisé dans :

```text
cases/case-001-reservation-interval-engine/
```

Le dossier sépare explicitement le paquet visible par les participants du control pack conservé hors du run jusqu’à l’évaluation finale.
