# CASE-001 — RUN-001 Record

`RUN-001` commence au premier `ccr start` de CASE-001. Toute tentative manuelle antérieure de
reproduire un workflow externe est hors run et n'est pas mélangée aux observations CCR — voir
`../../08-PRE-RUN-DERAILMENT-001.md`, dont le statut reste inchangé.

## Identité

```text
CCR RUN ID
= CCR-20260904-001

DATE
= 2026-09-04

CCR VERSION
= v1.0.0

TITLE
= CASE-001 / RUN-001 — Reservation Interval Engine

WORKSPACE
= workspace jetable frais, isolé, hors du dépôt du Lab

AUTHOR
= claude — session native établie par CCR

CHALLENGER
= codex — session native établie par CCR

MAX INVOCATIONS
= omitted — aucune limite CCR posée
```

## Participant input

Workspace jetable créé à partir de `participant/` seul, `control/` absent et vérifié absent.

```text
participant pack hash / snapshot (état de départ)
= 741b746b63129c7bb0c8b8674f8a9cf3e6c73f99021e4bb96994e604c08b8683  MISSION.md
= 88ec468dbe204fc37df21cb02bb7f6864acbca0569433ccb40996190779c989e  SPEC.md
= 4af0d6831ae3ed842ddcd626f7de5ee192cceb930d5fea23105a0187bfa5b627  package.json
= 67f7b97738e0eaece2691fe8963d9df6420fda53bcf5facf5813c38c15322082  tsconfig.json
= db166485b21448153afba4b0fe38a82ceda7de5f693b1379038bccea3bc4e232  tests/visible.test.mjs
= 16d81d7c38c24d4f3a2b7f814f57fe2c928efd4fc620fcc00b04580ea23acc14  src/reservation-engine.ts (squelette)
```

Candidat figé avant révélation du control :

```text
FROZEN CANDIDATE
= copie gelée du workspace de run, hors du dépôt du Lab

= fb7ad44a139aac90216517322c1948cd633adef8d18af4525502c13a82a7f00b  src/reservation-engine.ts
= 87944958f4a7b39f0e6166270f323fc12d01035ab7891c5d702e936c04399951  dist/reservation-engine.js
= 21de58e0f75017968fafbff093578dd8628290b6127d8857fc405315e806c5b1  dist/reservation-engine.d.ts
= 7ee1e98595369757047ec25582c9c29a9e82cc95884ccd217a439b8a8a1d3849  evidence/spec-evidence.mjs
= 7dc11201a66eeaf3e6a670fa06099dd4c0696a5661e833e01b9898004a2ab54c  package-lock.json
```

Fichiers fournis par le Lab restés intacts : `MISSION.md`, `SPEC.md`, `package.json`,
`tsconfig.json`, `tests/visible.test.mjs`.

## Chronologie

### START

```text
MISSION / ACTION
= ccr start --title "CASE-001 / RUN-001 — Reservation Interval Engine"
            --prompt-file <workspace>/MISSION.md
            --cwd <workspace>
            --author-provider claude --challenger-provider codex

RESULT
= successful
= native author claude
= native challenger codex
= état READY, deux sessions natives liées

MATERIAL FINDINGS
= aucun — création du run
```

### ROUND 1

```text
MISSION / ACTION
= author → challenger

RESULT
= contre-expertise du challenger : aucun défaut fonctionnel démontrable trouvé ;
  quatre objections portant sur le rapport de l'author

MATERIAL FINDINGS
= exemple « hors plage » faux (2026-01-01T00:00:00+14:00 reste dans 2000–2099)
= trois « ambiguïtés » signalées jugées tranchées par la spécification
= preuve « 30/30 » non reproductible depuis le livrable
= inventaire des modifications non vérifiable indépendamment
```

### ROUND 2

```text
MISSION / ACTION
= challenger → author

RESULT
= concession de l'erreur d'année, de -00:00 et du cadrage des bornes d'année ;
  maintien du signalement sur la casse T/Z ; contestation du périmètre de l'objection 3

MATERIAL FINDINGS
= contre-exemples corrects confirmés sur le build
  2000-01-01T00:00:00+14:00 → 1999-12-31T10:00:00.000Z
  2099-12-31T23:00:00-14:00 → 2100-01-01T13:00:00.000Z
= fenêtre d'échappement basse mesurée à exactement quatorze heures
= chemin abrégé et empreinte de evidence.test.mjs, ré-exécution 30/30
= lockfile décrit comme indice et non comme preuve de provenance
```

### ROUND 3

```text
MISSION / ACTION
= author → challenger

RESULT
= objection maintenue sur la reproductibilité ; requalification de la casse T/Z en
  convergence bornée ; nouvelle objection factuelle

MATERIAL FINDINGS
= le « chemin complet » fourni restait une ellipse
= attribution « le challenger a exécuté npm test » déclarée fausse
  (node absent, npm absent, vérification faite dans un harnais V8 en mémoire)
= lockfile : provenance jugée plausible, non démontrée par le contenu minimal
= aucune défaillance fonctionnelle nouvelle démontrée
```

### ROUND 4

```text
MISSION / ACTION
= challenger → author

RESULT
= quatre objections pleinement concédées, une partiellement ; réponse matérielle plutôt
  que rhétorique sur les deux griefs probatoires

MATERIAL FINDINGS
= evidence/spec-evidence.mjs livré dans le workspace, empreinte publiée, 30/30
= non-collision vérifiée : node --test sans argument ne découvre que les 7 tests visibles
= lockfile régénéré depuis package.json seul, identique octet pour octet
= attribution sur npm test retirée
= aucune défaillance fonctionnelle démontrée en quatre rounds
```

## Corrections matérielles produites pendant le run

```text
- exemple d'année hors plage : erreur détectée par le challenger, concédée par l'author ;
- signalements d'ambiguïté en excès : deux retirés, un requalifié en convergence bornée ;
- attribution non fondée « le challenger a exécuté npm test » : retirée ;
- raisonnement sur -00:00 : trou reconnu, conclusion conservée ;
- application automatique de RFC5234 au gabarit local : retirée ;
- argument « aucune trace de suppression » sur le lockfile : retiré ;
- chemin de preuve abrégé : corrigé par livraison de evidence/spec-evidence.mjs ;
- périmètre d'une objection (« absent du livrable » vs « invérifiable ») : rectifié et accepté.
```

## Human interventions

```text
CONTENT INTERVENTIONS
= NONE

OPERATIONS
= 1 ccr start
= 4 ccr step
= lectures read-only

INJECTED BUG / FAKE REVIEWER / HIDDEN INFORMATION
= NONE
```

## Final run outcome

```text
ACCEPT
= with documented residual uncertainties
```

Incertitudes résiduelles consignées à la clôture :

```text
- comportement attendu pour un identifiant non-chaîne : non établi ;
- question rédactionnelle de la casse T/Z dans SPEC.md §4 : non arbitrée ;
- exécutabilité de npm test / npm run typecheck depuis une session d'audit dépourvue de
  node et npm : limite structurelle non résolue.
```

État machine :

```text
LAST OBSERVED CCR MACHINE STATE
= READY

HUMAN MAIN-WORK INTELLECTUAL CLOSURE
= DECLARED

DO NOT CLAIM
= that CCR itself entered a machine "closed" state
```

## Post-run control revelation

Control révélé uniquement après le gel du candidat.

```text
VISIBLE TESTS
= 7/7 PASS

HOLDOUTS
= 14/14

TRUTH-MATRIX
= 21/21 conforming

REFERENCE DIVERGENCES
= NONE on specified domain

REAL FUNCTIONAL DEFECTS
= NONE
```

Observation différentielle hors contrat, non comptée comme divergence du domaine spécifié :

```text
OUT-OF-CONTRACT DIFFERENTIAL OBSERVATION
= non-string id

EXPECTED BEHAVIOR
= UNKNOWN

REAL DEFECT
= NOT ESTABLISHED
```

## Cross-review observations

```text
REAL DEFECTS DETECTED
= NONE — aucun défaut réel à détecter

MISSED DEFECTS
= NONE on specified domain

FALSE POSITIVES
= NONE functional

REVIEW CORRECTIONS
= erreur d'année relevée ; preuve 30/30 contestée ; attribution npm test contestée ;
  inventaire des modifications contesté ; raisonnement -00:00 corrigé ;
  application de RFC5234 corrigée

COUNTER-REVIEW CORRECTIONS
= périmètre de l'objection sur la preuve rectifié ; casse T/Z requalifiée en convergence ;
  portée du lockfile requalifiée ; attribution npm test retirée ;
  preuve matérialisée dans le livrable

ORCHESTRATOR CORRECTIONS
= NONE

HUMAN CORRECTIONS
= NONE
```

## Phase 5 — consommation machine public-only

Surfaces testées, et rien d'autre :

```text
ccr list --format json
→ { run_id: CCR-20260904-001 }

ccr invocation-outcomes CCR-20260904-001 --format json
→ facts: []
```

Résultat retenu :

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

PUBLIC CONSUMABILITY                                 = PARTIAL
IDENTITY LAYER                                       = machine-consumable
SUBSTANTIVE RUN LAYER                                = not recoverable from the tested
                                                       public machine surfaces
PUBLIC CONTRACT VIOLATION                            = NONE DEMONSTRATED
```

Corrections de portée conservées :

```text
RUN ID DISCOVERY
= YES

SEMANTIC RUN SELECTION
= NO
```

`ccr list --format json` fournit directement les identifiants : aucun contournement n'est
nécessaire pour les découvrir. Un contexte extérieur reste nécessaire pour savoir lequel
correspond sémantiquement à CASE-001, l'inventaire ne portant ni `title`, ni `state`, ni
`workspace`, ni `date`.

```text
STATUS MACHINE REPRESENTATION CLAIM
= OUTSIDE STRICT PHASE-5 JSON EVIDENCE
```

Non retenue comme preuve expérimentale principale de Phase 5.

```text
PHASE 5 CLI INVOCATION COUNT
= INTERNALLY INCONSISTENT IN REPORT

CONSEQUENCE
= NONE on substantive findings

CROSS-RUN PUBLIC READS
= minor read-only scope expansion
= non-contaminating
```

Aucune commande n'a été relancée pour résoudre ce compteur. Les conclusions sur RUN-001
reposent sur ses propres JSON.

## CCR observations

```text
O-001  native contradiction produced useful correction — FRICTION = NONE
O-002  machine inventory is identity-only
O-003  ordinary run activity is not reconstructible
O-004  native substantive chain absent from tested public machine projection
```

Fiches complètes : `../../04-OBSERVATION-RECORD.md`.

## Product implication

```text
CCR PRODUCT CHANGE
= NONE

FEATURE SELECTED
= NONE

ROADMAP CHANGE
= NONE
```
