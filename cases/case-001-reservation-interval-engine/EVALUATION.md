# CASE-001 — Evaluation Framework

Rempli après RUN-001 (`CCR-20260904-001`, CCR v1.0.0).

## A. Résultat fonctionnel

```text
VISIBLE TESTS
= PASS
= 7/7

HOLDOUTS
= 14/14

REFERENCE BEHAVIOR DIVERGENCE
= NONE on specified domain
```

Le candidat évalué est le snapshot figé avant révélation du control. Les 21 lignes de
`control/TRUTH-MATRIX.md` (V1–V7, H1–H14) sont conformes.

### Observation différentielle hors contrat

Un balayage différentiel candidat / oracle a produit une seule divergence, sur une entrée
qui viole la signature publique déclarée par `SPEC.md` §2 (`reserve(id: string, …)`) :

```text
OUT-OF-CONTRACT DIFFERENTIAL OBSERVATION
= non-string id

EXPECTED BEHAVIOR
= UNKNOWN

REAL DEFECT
= NOT ESTABLISHED
```

Aucune ligne de la matrice de vérité ni aucun holdout ne couvre ce cas. Le control pack ne
prescrit donc pas de comportement et ne départage pas les deux moteurs. Cette observation
n'est pas enregistrée comme omission.

### Synthèse fonctionnelle

```text
REAL FUNCTIONAL DEFECTS
= NONE

FUNCTIONAL FALSE POSITIVES
= NONE

FUNCTIONAL OMISSIONS ON SPECIFIED DOMAIN
= NONE
```

## B. Qualité de la chaîne de raisonnement

### B1 — Erreurs réelles

```text
DEFECT
= NONE

DETECTED DURING RUN
= NOT APPLICABLE

FIRST DETECTED BY
= NOT APPLICABLE

EVIDENCE AVAILABLE THEN
= NOT APPLICABLE
```

Aucun défaut fonctionnel n'a été révélé par la vérité externe. Symétriquement, aucun défaut
fonctionnel n'avait été affirmé pendant les quatre rounds natifs : les deux experts avaient
explicitement déclaré n'en avoir trouvé aucun en cherchant activement.

### B2 — Faux positifs

```text
CLAIMED DEFECT
= NONE

REFERENCE VERDICT
= NOT APPLICABLE

CORRECTED DURING RUN
= NOT APPLICABLE

CORRECTED BY
= NOT APPLICABLE
```

Aucune revendication de défaut fonctionnel n'a été émise pendant le run, donc aucune n'est
infirmée par le control.

Les trois « ambiguïtés » signalées au round 1 relevaient du bruit de rapport et non d'une
affirmation de défaut. Le control les éclaire ainsi :

- casse `T`/`Z` — l'oracle rejette les minuscules exactement comme le candidat ; le control
  ne contient toutefois aucun cas sur la casse et n'arbitre pas la question rédactionnelle ;
- bornes d'année après normalisation — l'oracle valide l'année de l'entrée et ne revalide pas
  l'instant normalisé ; le cadrage concédé au round 2 était le bon ;
- `-00:00` — accepté par les deux moteurs ; le retrait du signalement au round 4 était justifié.

### B3 — Omissions / renversements

Renversements matériels effectivement observés :

- la contre-expertise du round 1 corrige une erreur factuelle du rapport initial (exemple
  « hors plage » qui ne franchissait aucune borne) ;
- la réponse du round 2 corrige à son tour le périmètre d'une objection (« absent du
  livrable » présenté comme « invérifiable ») ;
- le round 3 requalifie la controverse `T`/`Z` en convergence bornée plutôt qu'en désaccord ;
- le round 4 retire une attribution sans fondement et remplace un argument par un artefact
  livré.

Aucun de ces motifs n'était exigé. Aucune décision humaine n'a eu à réintroduire un élément
oublié pendant le travail principal.

## C. Axes d'observation CCR

### 1. Long-chain comprehension

Le lecteur peut-il reconstruire ce qui a changé et pourquoi ?

```text
YES
```

Le déroulement des quatre rounds permet de reconstruire ce qui a changé et pourquoi :
objections, concessions, nouvelles preuves, corrections et controverses résiduelles ont été
explicitement matérialisées pendant le run.

Cet axe porte sur la lisibilité de la chaîne native. Il ne se confond pas avec la
reconstruction machine public-only évaluée en Phase 5, traitée à l'axe 4.

### 2. Evidence traceability

Une affirmation importante peut-elle être reliée aux preuves pertinentes ?

```text
YES
```

Les affirmations importantes ont pu être reliées à des preuves pertinentes. La faiblesse
initiale du `30/30` a elle-même été contestée puis corrigée par matérialisation de
`evidence/spec-evidence.mjs`, ensuite vérifiée indépendamment en Phase 4. Les hashes, les
tests, le code et le control ont permis une traçabilité concrète.

### 3. Decision boundary

La frontière entre fait, inférence, incertitude et décision humaine reste-t-elle claire ?

```text
YES
```

Le run a maintenu explicitement les distinctions entre :

```text
fact
inference
uncertainty
residual controversy
human ACCEPT
later control revelation
```

Le control n'a été révélé qu'après clôture intellectuelle du travail principal. Le fait que
la décision humaine ne soit pas récupérable via les JSON publics relève de l'axe 4, pas de la
clarté de cette frontière pendant l'expérience.

### 4. External consumability

Un consommateur public-only peut-il récupérer des faits durables utiles ?

```text
PARTIAL
```

```text
run identity
= publicly machine-recoverable

substantive durable run activity
= not recoverable from tested public machine surfaces
```

Résultat de Phase 5 retenu, établi sur les deux seules surfaces machine testées :

```text
RUN DISCOVERY                                        = YES
RUN ID                                               = YES
SEMANTIC RUN IDENTIFICATION                          = NO
TITLE                                                = NO
WORKSPACE                                            = NO
RUN STATE                                            = NO
ROLES                                                = NO
PROVIDERS                                            = NO
SESSIONS                                             = NO
INVOCATION COUNT                                     = NO
NORMAL INVOCATION ACTIVITY                           = NO
ROUND / HANDOFF CHAIN                                = NO
SUBSTANTIVE CONTROVERSY                              = NO
REPORT CORRECTIONS                                   = NO
EVIDENCE TRACEABILITY THROUGH PUBLIC MACHINE SURFACES = NO
```

Pour le run cible :

```text
invocation-outcomes
facts
= []
```

Cette cardinalité ne signifie pas :

```text
no invocation
success
failure
```

Elle signifie seulement :

```text
durable invocation outcome facts returned
= 0
```

Conclusion de l'axe :

```text
PUBLIC CONSUMABILITY
= PARTIAL

IDENTITY LAYER
= machine-consumable

SUBSTANTIVE RUN LAYER
= not recoverable from the tested public machine surfaces

PUBLIC CONTRACT VIOLATION
= NONE DEMONSTRATED
```

Note de portée : toute affirmation documentaire antérieure concernant une éventuelle
représentation machine de `status` est `OUTSIDE STRICT PHASE-5 JSON EVIDENCE` et n'est pas
retenue comme preuve expérimentale de cet axe.

Aucun score global PASS/FAIL n'est produit pour ce cas.

## D. Frictions

Observations démontrées, détaillées dans `../../04-OBSERVATION-RECORD.md` :

```text
O-001  native contradiction produced useful correction — FRICTION = NONE
O-002  machine inventory is identity-only
O-003  ordinary run activity is not reconstructible
O-004  native substantive chain absent from tested public machine projection
```

Les éléments `human ACCEPT`, `main-work intellectual closure` et `post-run control
evaluation` ne sont pas récupérables par les surfaces publiques, mais ont été décidés ou
produits hors du run CCR natif et n'ont pas été persistés dans CCR :

```text
PUBLIC RECOVERY
= NO

CCR-SIDE GAP
= NOT ESTABLISHED

CONTROL RESULT ABSENCE FROM CCR
= EXPECTED / external to CCR in this experiment
```

## E. Décision produit CCR

```text
PRODUCT CHANGE
= NONE

FEATURE SELECTED
= NONE

ROADMAP CHANGE
= NONE
```

Toute autre décision nécessite une analyse séparée : conséquence, autorité, contrat,
suffisance des surfaces existantes et décision humaine explicite.
