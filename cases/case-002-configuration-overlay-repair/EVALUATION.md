# CASE-002 — Evaluation Framework

Rempli après RUN-001 (`CCR-20260905-001`, CCR v1.0.0).

## A. Résultat fonctionnel

```text
VISIBLE TESTS
= PASS
= 6/6

HOLDOUTS
= 14/14

TRUTH MATRIX
= 20/20 CONFORMING

REFERENCE BEHAVIOR DIVERGENCE
= NONE on the frozen control's domain

REGRESSIONS DEMONSTRATED BY FROZEN CONTROL
= NONE
```

Le candidat évalué est le snapshot figé avant révélation du control. `typecheck` propre.

## B. Défauts

Rappel du cadrage expérimental :

```text
KNOWN INTENTIONALLY SEEDED DEFECT SET
= D1 only
```

### B1 — D1

```text
D1
= intentionally seeded experimental defect
= explicit falsy scalar overlay values are not correctly applied

DETECTION
= YES

DIAGNOSED CAUSE
= guard `if (patch)` on the replacement branch

REMEDIATION
= YES

BLIND CONTROL CONFIRMATION
= YES

D1a false
= PASS

D1b 0
= PASS

D1c ""
= PASS
```

```text
D1a + D1b + D1c
= ONE ROOT DEFECT
```

Portée : l'affirmation initiale « à tout niveau d'imbrication » a été retirée pendant le run.
Le correctif ne touche que les valeurs falsy atteintes par une itération active de la boucle
overlay — racine, ou fusion récursive entre deux objets.

### B2 — A

```text
A
= accidental additional fixture defect
= own-key / __proto__ / prototype-chain dependency

DETECTION
= YES
= native CCR work

HUMAN ARBITRATION
= YES

REMEDIATION
= YES

NATIVE CHALLENGER REVIEW
= CONFIRMED

FROZEN CONTROL COVERAGE
= NO

BLIND CONTROL CONFIRMATION
= NOT AVAILABLE
```

`A` n'est pas confirmé par control aveugle et ne doit jamais être réécrit comme tel. Le control
gelé ne contient aucune clé `__proto__`, aucune pollution de prototype et aucune vérification
d'écriture par propre clé ; son oracle présente lui-même la forme d'accès et d'écriture non
gardée impliquée par `A`. Voir `../../04-OBSERVATION-RECORD.md` — O-007.

```text
NOT COVERED
≠ FALSE

CHALLENGER CONFIRMATION
≠ BLIND CONTROL CONFIRMATION
```

### B3 — B

```text
B
= nested-null behavioral discontinuity

INITIAL ADDITIONAL DEFECT ALLEGATION
= YES

BEHAVIORAL DISCONTINUITY
= DEMONSTRATED

FINAL NORMATIVE STATUS
= residual specification ambiguity

MANDATORY REMEDIATION
= NOT ESTABLISHED

REMEDIATION
= NONE

FROZEN CONTROL RESULT
= NOT ESTABLISHED
```

Couverture du control gelé sur `B` : partielle. La ligne H6 de la matrice restate le principe
« null n'est jamais une valeur stockée », mais son résultat attendu est borné à son entrée de
premier niveau. Aucun test gelé n'exerce la configuration de `B` — un objet d'overlay
remplaçant une base absente, scalaire ou tableau et portant un `null` imbriqué.

### B4 — Synthèse

```text
TRUE POSITIVE DETECTIONS
= D1 (blind-control confirmed)
= A (native only)

FALSE POSITIVES
= NONE ESTABLISHED

REQUALIFIED CLAIMS
= B (defect allegation → residual specification ambiguity)
= A (qualification « ambiguïté » → « non-conformité explicite »)
= D1 scope (« at every nesting level » withdrawn)

MISSED DEFECTS
= NONE on frozen-control domain
= UNKNOWN outside frozen-control domain

CORRECT REMEDIATIONS
= D1 · A

UNNECESSARY REMEDIATION
= NONE established

REGRESSIONS INTRODUCED
= NONE
```

```text
DETECTION ≠ REMEDIATION
FINDING ≠ REMEDIATION
UNKNOWN ≠ ZERO
```

### B5 — Hors contrat

```text
OUT-OF-CONTRACT OBSERVATIONS
= NONE recorded as defects

EXPECTED BEHAVIOR
= UNKNOWN

REAL DEFECT
= NOT ESTABLISHED
```

Le domaine hors contrat de `SPEC.md` §4 ne porte aucune ligne de vérité.

### B6 — Renversements

- la contre-expertise du round 1 conteste la conclusion du rapport initial et produit deux
  constats supplémentaires ;
- la réponse du round 2 concède le fait de `B`, la qualification de `A`, le décompte des sondes,
  l'inventaire des artefacts et la portée de `D1`, tout en réfutant une nécessité technique ;
- le round 3 voit le challenger réviser sa propre position sur `B` (« ambiguïté à signaler est
  donc raisonnable ») et maintenir, avec un argument nouveau (§8), sa position sur la lecture
  gardée ;
- l'arbitrage humain tranche la frontière de remédiation sans imposer de technique ;
- la revue bornée du challenger, indépendante, confirme le candidat réparé.

## C. Axes d'observation CCR

### 1. Long-chain comprehension

```text
YES
```

Les trois rounds natifs puis les interventions humaines bornées permettent de reconstruire :

```text
diagnosis
→ challenge
→ concession
→ additional finding
→ requalification
→ human arbitration
→ bounded repair
→ independent Challenger review
```

### 2. Evidence traceability

```text
YES
```

Les claims ont été reliés à :

```text
source locations
visible tests
bounded probes
reproducible examples
Challenger review
```

`D1` possède en plus une confirmation par control aveugle. `A` n'en possède pas.

### 3. Decision boundary

```text
YES
```

Le cas a explicitement préservé :

```text
DETECTION ≠ REMEDIATION

DEMONSTRATED BEHAVIOR
≠ ESTABLISHED NORMATIVE DEFECT

EXPERT FINDING
≠ HUMAN ARBITRATION

NATIVE CHALLENGER CONFIRMATION
≠ BLIND CONTROL CONFIRMATION

UNKNOWN
≠ ZERO
```

Le control n'a été révélé qu'après clôture intellectuelle du travail principal.

### 4. External consumability

```text
PARTIAL
```

```text
RUN IDENTITY
= machine recoverable

SEMANTIC RUN IDENTITY
= not recoverable

NATIVE ROUND ACTIVITY
= not recoverable

NATIVE EXPERT ACTIVITY
= not recoverable

CCR SEND INTERVENTIONS
= not recoverable

SUBSTANTIVE REVIEW / REPAIR HISTORY
= not recoverable
```

Aucun score global PASS/FAIL n'est produit pour ce cas.

## D. Frictions

Observations démontrées, détaillées dans `../../04-OBSERVATION-RECORD.md` :

```text
O-005  native contradiction detected an accidental additional defect
O-006  requalification prevented automatic remediation
O-007  independent construction did not guarantee an independent defect profile
O-008  public machine inventory remains identity-only
O-009  native activity and human sends absent from tested machine projection
```

## E. Décision produit CCR

```text
PRODUCT CHANGE
= NONE

FEATURE SELECTED
= NONE

ROADMAP CHANGE
= NONE

PRODUCT ANALYSIS
= NOT OPENED
```

## F. INTER-CASE COMPARISON — CASE-001 vs CASE-002

Première comparaison, établie à partir des records déjà consignés des deux cas. Le record de
CASE-001 n'est pas modifié.

### CASE-001 ONLY

```text
- no functional defect demonstrated;

- native contradiction primarily corrected reporting,
  reasoning and evidence quality;

- Author materialized reproducible evidence after challenge;

- blind control corroborated the final functional result
  without revealing a real implementation defect.
```

Forme du cas : squelette à implémenter. Quatre rounds natifs, aucune intervention humaine de
contenu, sortie humaine `ACCEPT with documented residual uncertainties`.

### CASE-002 ONLY

```text
- intentionally seeded real defect D1 detected and repaired;

- accidental additional defect A discovered during native contradiction;

- bounded human remediation arbitration used;

- A repaired and independently reviewed by native Challenger;

- Claim B requalified from defect allegation to residual
  specification ambiguity without mandatory remediation;

- frozen blind control did not cover A and its reference engine
  shared the relevant structural weakness;

- two targeted human `ccr send` interventions occurred
  and were not recoverable in Phase 5.
```

Forme du cas : base de code existante imparfaite → diagnostic → réparation bornée. Trois rounds
natifs plus deux `ccr send`, sortie humaine `ACCEPT with documented residual specification
ambiguity B`.

### REPEATED ACROSS CASES

```text
NATIVE CONTRADICTION
= materially useful

REPORT / CLAIM CORRECTION
= observed

EXPERTS DID NOT NEED TO INVENT A FUNCTIONAL DEFECT
= observed

HUMAN DECISION BOUNDARY
= preserved

CONTROL REVEAL ONLY AFTER INTELLECTUAL CLOSURE
= preserved

PUBLIC RUN-ID DISCOVERY
= YES

SEMANTIC RUN IDENTIFICATION FROM TESTED MACHINE INVENTORY
= NO

ORDINARY RUN ACTIVITY FROM TESTED MACHINE SURFACES
= not reconstructible

SUBSTANTIVE REVIEW HISTORY FROM TESTED MACHINE SURFACES
= not reconstructible

PUBLIC CONSUMABILITY
= PARTIAL
```

CASE-002 renforce le dernier point : même

```text
HUMAN CCR SEND ACTIVITY
= not recoverable
```

dans les deux surfaces machine testées. La friction de représentation publique est donc
répliquée sur un run dont l'histoire est plus riche, et qui contient en plus deux interventions
humaines ciblées.

### CONTRADICTED ACROSS CASES

```text
CONTRADICTED ACROSS CASES
= NONE ESTABLISHED
```

Aucune contradiction entre les deux records n'est démontrée. Aucune n'est fabriquée.

### STILL UNKNOWN

```text
GENERAL CCR RELIABILITY
= UNKNOWN

GENERAL DEFECT-DETECTION RATE
= UNKNOWN

GENERAL FALSE-POSITIVE RATE
= UNKNOWN

GENERAL REMEDIATION QUALITY
= UNKNOWN

PREVALENCE OF ACCIDENTAL ADDITIONAL FINDINGS
= UNKNOWN

PREVALENCE OF CONTROL BLIND SPOTS
= UNKNOWN

WHETHER OTHER PUBLIC CCR SURFACES WOULD BE SUFFICIENT
= UNKNOWN

WHETHER THE REPEATED PUBLIC-MACHINE FRICTION JUSTIFIES A PRODUCT CHANGE
= NOT YET DECIDED
```

```text
REPEATED TWICE
≠ GENERAL SYSTEM PROPERTY PROVED
```

Deux cas ne constituent pas une généralisation statistique.
