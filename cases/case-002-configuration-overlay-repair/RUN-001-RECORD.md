# CASE-002 — RUN-001 Record

`RUN-001` de CASE-002 a commencé au premier `ccr start` du cas.

## Identité

```text
CCR RUN ID
= CCR-20260905-001

DATE
= 2026-09-05

CCR VERSION
= v1.0.0

TITLE
= CASE-002 / RUN-001 — Configuration Overlay Repair

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

Workspace jetable créé à partir de `participant/` seul, `control/` vérifié absent. Les six
empreintes du gel ont été vérifiées avant lancement (`PARTICIPANT FREEZE MATCH = YES`).

```text
participant pack hash / snapshot
= voir FREEZE-MANIFEST.md
```

Candidat figé avant révélation du control :

```text
FROZEN CANDIDATE
= copie gelée du workspace de run, hors du dépôt du Lab

= 84bfebbd16ef49bad242c5dbfdfdc80bbd965bb0626c3b3efaaad56e4e37c88e  src/config-overlay.ts
= 7b0c76e9a18faa4a8605cbcb7c59887b9bf576b465a9ac7874ab3fafe60b7cef  dist/config-overlay.js
= bbf3052d4737c08bb3bc3e9d29585458481a3a26caab14f46d50ecf4ee416ef0  dist/config-overlay.d.ts
= 1f711486e9ead4a0ce55298077762257e2517812fbfde0a4fc219eb405bb74f3  package-lock.json
```

Fichiers fournis par le Lab restés intacts : `MISSION.md`, `SPEC.md`, `package.json`,
`tsconfig.json`, `tests/visible.test.mjs`. Seul `src/config-overlay.ts` a été modifié.

## Défaut connu de la fixture

```text
KNOWN INTENTIONALLY SEEDED DEFECT SET
= D1 only

D1
= explicit falsy scalar overlay values are not correctly applied

MULTIPLE MANIFESTATIONS
= D1a (false) / D1b (0) / D1c ("")

ORIGIN
= intentionally present in experimental fixture
= NOT a naturally discovered production defect

REVEALED TO PARTICIPANT
= D1a only, through one failing visible test
```

Fait de conception de l'expérience, jamais communiqué aux sessions natives.

## Chronologie

```text
START
= successful
= native author claude
= native challenger codex

ROUND 1
= author → challenger

ROUND 2
= challenger → author

ROUND 3
= author → challenger

HUMAN SEND → AUTHOR
= bounded remediation arbitration

HUMAN SEND → CHALLENGER
= bounded independent review
```

### START

Le premier tour de l'author, produit à la création du run, diagnostique `D1`, applique le
correctif minimal, produit une sonde locale et signale `A` comme « ambiguïté » laissée non
corrigée par choix de minimalité.

### ROUND 1 — author → challenger

Le challenger accepte la cause de `D1` et la minimalité du correctif, puis produit quatre
objections : `A` requalifié en non-conformité explicite ; `B` présentée comme violation
démontrable ; décompte de sonde contesté ; inventaire des fichiers jugé incohérent. Il conteste
également la portée annoncée du correctif.

### ROUND 2 — challenger → author

L'author concède le fait comportemental de `B` sans réserve, la qualification normative de `A`,
le décompte (38 contrôles, code de sortie 1), l'omission de `package-lock.json`, la fragilité de
l'import absolu et la portée surdéclarée de `D1`. Il réfute la nécessité d'`Object.hasOwn`,
conteste la lecture « sans réserve » de `B` en opposant une tension §5 / §6, et relève une
inexactitude de citation.

### ROUND 3 — author → challenger

Le challenger valide la concession normative sur `A` et l'inexactitude de citation, révise sa
propre position sur `B` (« ambiguïté à signaler est donc raisonnable »), et maintient la
nécessité de la lecture gardée avec un argument nouveau — §8, « ne lit aucun état global ». Il
signale que les corrections proposées, prises ensemble, ne satisfont pas entièrement les règles
qu'elles prétendent restaurer.

### HUMAN SEND → AUTHOR

Arbitrage humain transmis par `ccr send author --file`. `D1` confirmé et son correctif à
préserver ; `A` confirmé comme défaut additionnel démontré, avec une frontière contractuelle
énoncée en termes comportementaux et sans prescrire de technique ; `B` qualifiée d'ambiguïté
résiduelle, remédiation obligatoire non établie, modification interdite.

Réponse de l'author : réparation bornée effectuée. `defineOwn` par `Object.defineProperty` sur
les quatre sites d'écriture, lecture gardée par `Object.hasOwn`, `Object.create(null)` écarté et
motivé, `delete` inchangé et motivé, aucune modification visant `B`.

### HUMAN SEND → CHALLENGER

Revue bornée indépendante demandée par `ccr send challenger --file`, sans lui transmettre le
rapport de preuve de l'author ni aucun élément de control.

Réponse du challenger : « La candidate satisfait l'arbitrage humain. Aucun travail substantiel
supplémentaire n'est requis dans le périmètre autorisé ; elle est prête pour clôture humaine. »
`D1` conforme, `A` réparé, écritures de propres clés conformes, lectures héritées exclues,
indépendance au prototype global confirmée, aucune régression démontrée, `B` confiné.

## Corrections matérielles produites pendant le run

```text
- portée de D1 : « à tout niveau d'imbrication » retirée ;
- décompte de la sonde initiale : 38 contrôles, pas 36 ;
- code de sortie de cette sonde : échec, pas succès ;
- package-lock.json rétabli dans l'inventaire des artefacts ;
- import absolu de la sonde reconnu fragile, puis corrigé et portabilité vérifiée ;
- qualification de A : « ambiguïté » → « non-conformité explicite » ;
- qualification de B : violation démontrable → ambiguïté de spécification résiduelle ;
- attribution de citation inexacte reconnue par le challenger.
```

## Human interventions

```text
CONTENT INTERVENTIONS
= 2 — via ccr send, surface native

OPERATIONS
= 1 ccr start
= 3 ccr step
= 2 ccr send (author, puis challenger)
= lectures read-only

INJECTED BUG / FAKE REVIEWER / HIDDEN INFORMATION
= NONE
```

Les deux `ccr send` sont des interventions humaines conduites par la surface native de CCR :
aucune session fournisseur manuelle, aucun appel direct à un CLI fournisseur.

## Statut des trois éléments

```text
D1
= detected / repaired / blind-control confirmed

A
= discovered / arbitrated / repaired / Challenger-confirmed
= not blind-control-confirmed

B
= allegation requalified to residual specification ambiguity
= no mandatory remediation established
= no repair
```

## Final run outcome

```text
HUMAN OUTCOME
= ACCEPT
  with documented residual specification ambiguity B

MAIN-WORK INTELLECTUAL CLOSURE
= DECLARED

LAST OBSERVED CCR MACHINE STATE
= READY
= round 3
= cursor challenger
```

Le record n'affirme pas que CCR lui-même est entré dans un état machine « closed » : la dernière
sortie CCR observée rapporte `READY`, contrôle `AUTOMATION`, round 3, curseur inchangé.

## Post-run control revelation

Control révélé uniquement après le gel du candidat. Aucune expansion rétrospective.

```text
VISIBLE
= 6/6

HOLDOUTS
= 14/14

TRUTH MATRIX
= 20/20

REGRESSIONS
= NONE demonstrated by frozen control

TYPECHECK
= clean
```

```text
FROZEN CONTROL COVERAGE OF A
= NO

A BLIND CONTROL RESULT
= NOT AVAILABLE

FROZEN CONTROL COVERAGE OF B
= PARTIAL

B CONTROL RESULT
= NOT ESTABLISHED
```

## Cross-review observations

```text
REAL DEFECTS DETECTED
= D1 (semé, confirmé par control aveugle)
= A (accidentel, natif seulement)

MISSED DEFECTS
= NONE on frozen-control domain
= UNKNOWN outside frozen-control domain

FALSE POSITIVES
= NONE ESTABLISHED

UNNECESSARY REMEDIATION
= NONE established

REVIEW CORRECTIONS
= erreur de portée de D1 relevée ; A requalifié ; B soulevée ; décompte de sonde contesté ;
  inventaire des artefacts contesté

COUNTER-REVIEW CORRECTIONS
= nécessité d'Object.hasOwn réfutée puis réintégrée par arbitrage ; lecture « sans réserve »
  de B contestée puis révisée par le challenger lui-même ; inexactitude de citation reconnue

ORCHESTRATOR CORRECTIONS
= NONE

HUMAN CORRECTIONS
= arbitrage borné sur la frontière de remédiation de A, et interdiction de traiter B
```

## Phase 5 — consommation machine public-only

Surfaces testées, et rien d'autre :

```text
ccr list --format json
→ { run_id: CCR-20260905-001 }

ccr invocation-outcomes CCR-20260905-001 --format json
→ facts: []
```

```text
PUBLIC CONSUMABILITY
= PARTIAL

RUN IDENTITY
= recoverable

SEMANTIC RUN IDENTITY
= not recoverable

SUBSTANTIVE CCR ACTIVITY
= not recoverable from tested public machine surfaces

CCR SEND ACTIVITY
= not recoverable
```

```text
facts: []
≠ no invocation
≠ no round
≠ no send
≠ success
≠ failure
```

## CCR observations

```text
O-005  native contradiction detected an accidental additional defect
O-006  requalification prevented automatic remediation
O-007  independent construction did not guarantee an independent defect profile
O-008  public machine inventory remains identity-only
O-009  native activity and human sends absent from tested machine projection
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

PRODUCT ANALYSIS
= NOT OPENED
```
