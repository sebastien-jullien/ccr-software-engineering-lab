# Protocole — Usage réel post-1.0

## A — Cadrage

Chaque cas commence par une question ou une tâche réelle et vérifiable.

Le dossier initial doit préciser :

```text
QUESTION / TASK
OPTIONS OR EXPECTED BEHAVIOR
CONSEQUENCES
CONSTRAINTS
KNOWN UNKNOWNS
AVAILABLE EVIDENCE
```

Le cas ne doit pas être choisi uniquement pour tester une fonctionnalité CCR.

## B — Preuves

Utiliser des matériaux réellement pertinents : spécification, code du micro-projet, tests, mesures, résultats d'exécution, documents de décision, contraintes explicites.

Ne pas fabriquer de preuve afin de provoquer une controverse.

## C — Travail CCR

Le travail principal d'un cas CCR doit être exécuté **dans CCR System**, avec ses rôles et mécanismes natifs.

```text
LAB CASE EXECUTION
= CCR native run

EXTERNAL INDUSTRIAL WORKFLOW
= context / possible future consumer
= not a substitute execution engine
```

Ne pas ouvrir manuellement des sessions correspondant aux rôles d'un workflow externe pour simuler ce que CCR doit faire lui-même.

Le déroulement doit permettre :

```text
independent position
→ contradiction
→ factual challenge
→ evidence examination
→ controversy where needed
→ reconciliation where justified
→ residual disagreement / uncertainty
→ human judgment when needed
```

Une conclusion n'est pas obligatoire.

## D — Temporalité

Ne pas révéler à l'avance les informations qui, dans une situation réelle, n'auraient été connues qu'après une étape ultérieure.

Cela permet de distinguer :

```text
what was knowable then
vs
what became known later
```

## E — Consommation machine secondaire

Après le travail principal, un consommateur jetable peut utiliser uniquement les surfaces publiques supportées.

Point de départ actuel :

```text
ccr list --format json
→ discover run identity

ccr invocation-outcomes <run> --format json
→ consume durable invocation outcome facts
```

Le consommateur ne doit pas lire les internes de CCR pour compenser une surface publique manquante.

## F — Observation

```text
FRICTION
= precise observation

CONSEQUENCE
= what became impossible, risky or unnecessarily hard

BLOCKING
= YES / NO

CCR-SIDE
= YES / NO / UNDETERMINED

AUTHORITY GAP
= YES / NO

PUBLIC CONTRACT GAP
= YES / NO

PUBLIC REPRESENTATION GAP
= YES / NO

QUERY / DISCOVERY GAP
= YES / NO

CONSUMER-SIDE
= YES / NO / UNDETERMINED

WORKAROUND REQUIRED
= YES / NO
```

## G — Règle de décision produit

```text
OBSERVATION
≠ CAPABILITY DECISION
```

La suite normale est :

```text
REAL USE
→ OBSERVED FRICTION
→ DEMONSTRATED CONSEQUENCE
→ AUTHORITY / CONTRACT ANALYSIS
→ EXISTING-SURFACE SUFFICIENCY CHECK
→ HUMAN PRODUCT DECISION
```
