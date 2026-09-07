# CASE-003 — Évaluation

```text
LAYER A   = PASS
LAYER B   = consigné dans RUN-001-RECORD.md, non réinterprété
LAYER C   = PASS — détail dans PUBLIC-CONSUMPTION.md

CASE      = COMPLETE
CLASS     = bounded backward-compatible feature extension
```

## 1. Audit de validité du cas — avant ouverture du control

Deux énoncés du run devaient être tranchés avant que la vérité privée puisse
faire autorité. Ils ont été jugés sur les seuls artefacts gelés.

```text
C1/C2 EVIDENCE BASIS
= explicitly source-bounded
= participant/SPEC.md §1.2 §5 §6 §7
= participant/src/task-planner.ts, participant/src/validation.ts
= participant/tests/visible.test.mjs, participant/consumer-v1.ts
= PREQUALIFICATION.md

C1/C2 AUDIT
≠ blind
```

L'opérateur possède le contexte de conception du cas. Cet audit n'est donc pas
aveugle, et ne se présente pas comme tel : il est borné par ses sources, qui sont
citées.

### C1 — « le fixture de départ viole SPEC §1.2 »

Énoncé du run : `TaskPlanner.add` lit `task.id` quatre fois et désynchroniserait
ses deux registres sous accesseur instable.

```text
C1 CLAIM
= NOT DEMONSTRATED
```

**Ce qu'exige §1.2.** Un identifiant valide est une chaîne dont le premier
caractère est alphanumérique, suivie d'au plus 63 caractères alphanumériques,
`_` ou `-`. Précédence stricte `INVALID_ID → INVALID_PRIORITY → DUPLICATE_ID`.
Un `add()` refusé ne modifie pas l'état et n'occupe aucun rang d'insertion.

**Ce que fait le fixture.** Le constat factuel du run est exact : `task.id` est
lu quatre fois — `isTaskId`, `#ids.has`, `#ids.add`, puis la construction de
l'entrée poussée — et `task.priority` deux fois.

**La contradiction alléguée.**

```text
CONTRADICTION
= NONE
```

Pour toute tâche dont `id` et `priority` sont des propriétés de données —
c'est-à-dire tout le domaine exercé par les tests visibles, par `consumer-v1.ts`
et par la préqualification — les quatre lectures rendent la même valeur. La
précédence est respectée à la lettre, et l'état n'est muté qu'après les trois
contrôles : `#ids.add` et `#tasks.push` sont sur le seul chemin de succès, et
`insertion: this.#tasks.length` n'est évalué que là. Un refus ne consomme donc
aucun rang.

La désynchronisation décrite exige un objet dont l'accesseur `id` rend des
valeurs différentes d'une lecture à l'autre. Sur un tel objet, §1.2 ne définit
pas « l'identifiant » : sa formulation présuppose une valeur, pas une suite de
valeurs. Il n'y a donc pas de clause à violer.

```text
NON SPÉCIFIÉ
≠ VIOLÉ

VISIBLE TEST PASS
≠ preuve d'une clause normative non couverte

PARTICIPANT CLAIM
≠ DEFECT
```

**Couverture par la préqualification.**

```text
CE POINT EXACT PRÉCÉDEMMENT DÉMONTRÉ
= NON, dans un sens comme dans l'autre
```

La préqualification a établi V1–V4 sur le fixture et cinq contrôles négatifs sur
V10. Elle n'a jamais exercé d'accesseur instable et ne prétend pas l'avoir fait.

**Conséquence.**

```text
C1 CLAIM
= NOT DEMONSTRATED

STARTING FIXTURE VIOLATION
= NOT ESTABLISHED

LEGACY V1 CORRECTNESS PREMISE
= remains intact for CASE-003

SEEDED DEFECT
= NONE demonstrated

UNDERLYING EDGE SEMANTICS
= unresolved by frozen SPEC
```

La sémantique de bord reste non résolue par la SPEC gelée — c'est l'objet de
C2 — mais cela ne convertit pas le fixture en fixture fautif. Aucune réparation
n'a été faite, et aucune n'était requise.

### C2 — « SPEC §5, ambiguïtés connues = aucune, ne tient pas »

Énoncé du run : la stabilité, l'innocuité et la non-réentrance des accesseurs
sont des hypothèses non écrites, dont dépendent la v1 comme l'extension.

```text
C2 CLAIM
= DEMONSTRATED

DISCOVERED SPECIFICATION AMBIGUITY
= YES

AMBIGUITY
= repeated-read semantics for Task.id / Task.priority are not explicitly
  fixed by the frozen SPEC

PLAUSIBLE INTERPRETATIONS
= at least two

OBSERVABLE CONTRACT DIFFERENCE
= YES
```

Le run avait raison sur ce point. La SPEC gelée ne fixe pas la sémantique de
lecture répétée de `Task.id` et `Task.priority`, et son §5 affirmait qu'aucune
ambiguïté n'était connue.

**Texte allégué ambigu.** §5 « KNOWN SPECIFICATION AMBIGUITIES = NONE », lu avec
§6, qui écarte les « valeurs d'exécution malformées hors du contrat TypeScript
déclaré ».

**Interprétation A.** `Task` désigne une valeur dont `id` et `priority` sont
fixés au moment de l'appel ; `add()` peut les lire autant de fois qu'il veut.

**Interprétation B.** `Task` désigne tout objet satisfaisant le type déclaré, y
compris muni d'accesseurs instables ; `add()` doit donc lire chaque propriété une
seule fois et travailler sur les valeurs capturées.

```text
OBSERVABLE CONTRACT DIFFERENCE
= OUI
```

Les deux lectures divergent sur une implémentation qui lit `task.id` quatre fois :
conforme sous A, non conforme sous B. La différence est réelle, et le texte gelé
ne la tranche pas : un accesseur instable satisfait le type déclaré, donc §6 ne
l'écarte pas. §7 couvre l'architecture interne, pas la discipline de lecture des
arguments. L'asymétrie est d'ailleurs visible dans la SPEC elle-même : N9 légifère
explicitement sur la capture de `after`, et rien n'est dit de `id` ni de
`priority`.

**Impact sur la vérité officielle.**

Deux notions distinctes, à ne pas confondre :

```text
SPECIFICATION AMBIGUITY
= YES — découverte, réelle, non résolue par la SPEC gelée

OFFICIAL TRUTH-MATRIX AMBIGUITY
= NONE

IMPACT ON OFFICIAL 27-ROW TRUTH
= NONE

OFFICIAL TRUTH-MATRIX AMBIGUITY ROWS
= 0

AMBIGUITY BLOCKING OFFICIAL EVALUATION
= NO
```

Vérifié après ouverture légitime du control : aucune des 27 lignes officielles
ne construit de tâche par accesseur, par `Object.defineProperty` ni par `Proxy`.
Les deux interprétations rendent le même verdict sur chacune des 27 lignes, pour
chacun des deux candidats. L'ambiguïté existe dans la spécification ; elle ne
traverse aucune ligne de la matrice.

```text
AMBIGUÏTÉ DE SPÉCIFICATION DÉCOUVERTE
≠ AMBIGUÏTÉ DE LA MATRICE OFFICIELLE

IMPLEMENTATION FREEDOM
≠ SPEC AMBIGUITY
```

La découverte est acquise et doit être portée par la conception des cas futurs.
Elle n'invalide pas le présent cas, et ne modifie ni la SPEC ni la matrice, qui
restent gelées telles qu'elles étaient au moment du run.

### Gate de validité

```text
C1 CLAIM                               = NOT DEMONSTRATED
C2 CLAIM                               = DEMONSTRATED
DISCOVERED SPECIFICATION AMBIGUITY     = YES
OFFICIAL TRUTH-MATRIX AMBIGUITY ROWS   = 0
AMBIGUITY BLOCKING OFFICIAL EVALUATION = NO
CASE VALIDITY FOR OFFICIAL EVALUATION  = PASS
```

C2 est démontré, et pleinement, comme **ambiguïté de spécification**. Il ne
l'est pas comme blocker : aucune ligne de la matrice officielle ne dépend de la
question qu'il soulève. C1, lui, n'établit aucune violation du fixture de
départ.

Ni la SPEC, ni le fixture, ni la matrice n'ont été modifiés.

## 2. Vérité officielle appliquée

```text
OUTILLAGE          = harnesses gelés du cas, aucun test modifié
COMPILATEUR V10    = node node_modules/typescript/bin/tsc, Version 5.8.3
                     jamais npx
LIGNES             = V1..V10 + H1..H17 = 27 par candidat
AXE A              = V6 V7 V8 V9 + H1..H13   = 17
AXE B              = V1..V5 + V10 + H14..H17 = 10
AXE C              = NONE
AMBIGUITY ROWS     = 0
```

### Candidat baseline — workspace A

```text
IDENTITY   = 10eebd1b80d53e2d0fa42ef62b74dfabbf2552f566492e2b7c38e94849ecc0b3
FICHIERS   = 5   (2 ajoutés, 3 legacy inchangés)

VISIBLE    = 10/10
HOLDOUTS   = 17/17
AXE A      = 17/17
AXE B      = 10/10
TOTAL      = 27/27

FULL SOFTWARE SUCCESS = YES
LIGNES EN ÉCHEC       = AUCUNE
```

### Candidat CCR — workspace B

```text
IDENTITY   = 9615f52c679bd5837bca75ad83e135abed329fd8c26b7f65d1a8965341d149ec
FICHIERS   = 4   (1 ajouté, 3 legacy inchangés)

VISIBLE    = 10/10
HOLDOUTS   = 17/17
AXE A      = 17/17
AXE B      = 10/10
TOTAL      = 27/27

FULL SOFTWARE SUCCESS = YES
LIGNES EN ÉCHEC       = AUCUNE
```

Les deux candidats ont été évalués séparément, le baseline d'abord, et aucun n'a
été modifié par son évaluation : l'empreinte de `src/**` est identique avant et
après dans les deux workspaces.

```text
POST-FREEZE REMEDIATION
= 0
```

### Clôture Layer A

```text
BASELINE VISIBLE   = 10/10        CCR VISIBLE   = 10/10
BASELINE HOLDOUT   = 17/17        CCR HOLDOUT   = 17/17
BASELINE TOTAL     = 27/27        CCR TOTAL     = 27/27

BASELINE FULL SOFTWARE SUCCESS = YES
CCR FULL SOFTWARE SUCCESS      = YES

OFFICIAL FAILED ROWS = NONE
SOFTWARE WINNER      = NONE
```

Les sondes auto-écrites des participants restent hors score.

## 3. Ce que ce résultat n'établit pas

```text
LAYER A ÉGALITÉ 27/27
≠ déclaration de vainqueur
≠ équivalence des candidats
≠ équivalence des deux protocoles de production
```

Les deux bras atteignent la même couverture sur la même vérité gelée. Layer A ne
distingue donc pas les candidats, et rien dans ce document ne les classe.

```text
CCR RUN                  = allocated and executed
INVOCATIONS              = 24/24
TERMINATION              = CCR_INVOCATION_QUOTA_EXCEEDED
PENDING TRANSFER         = YES
NATURAL CONVERGENCE      = NO
HUMAN SEND               = 0
CCR PROCEDURAL SUCCESS   = NOT CLAIMED
CCR SOFTWARE RESULT      = 27/27 independently demonstrated
```

```text
PROCEDURAL NON-CONVERGENCE
≠ SOFTWARE FAILURE

SOFTWARE SUCCESS
≠ PROCEDURAL CONVERGENCE
```

Les deux faits sont consignés côte à côte, sans causalité inférée de l'un vers
l'autre.

La structure interne des deux candidats diffère, et cela reste une observation :

```text
BASELINE SOURCE FILE COUNT        = 5
CCR SOURCE FILE COUNT             = 4
IMPLEMENTATION STRUCTURE DIFFERENCE = OBSERVED
OFFICIAL SOFTWARE SCORE CONSEQUENCE = NONE
QUALITY CONSEQUENCE                 = NONE DEMONSTRATED
LAYER-C CONSEQUENCE                 = NONE
```

Aucun gagnant n'est choisi à partir de cette différence.

```text
VISIBLE 9/9              ≠ FULL SOFTWARE SUCCESS
V10 PASS                 ≠ compatibilité universelle
NOT COVERED              ≠ FALSE
CHALLENGER CONFIRMATION  ≠ BLIND CONTROL CONFIRMATION
CONSENSUS                ≠ TRUTH
RUNTIME EVIDENCE         ≠ TYPE-LEVEL EVIDENCE
CANDIDATE IDENTITY       ≠ CORRECTNESS
```

## 4. Sondes auto-écrites — hors score

```text
BASELINE SELF-AUTHORED EXTRA PROBES = participant activity / NOT OFFICIAL TRUTH
CCR SELF-AUTHORED EXTRA PROBES      = participant activity / NOT OFFICIAL TRUTH
```

Le record du run consigne les sondes des deux experts CCR — sondes SPEC de
l'auteur 47/47, sonde de types 4/4. Aucune de ces valeurs n'entre dans les 27
lignes, ni comme bonus, ni comme substitut d'un holdout. Aucun artefact de sonde
ne subsiste dans l'un ou l'autre workspace.

## 5. Limitation de provenance fournisseur

```text
PROVIDER FAMILY                        = Claude pour les deux bras

BASELINE CLIENT VERSION AT EXECUTION   = UNKNOWN
                                         2.1.224 relevé en préparation seulement

CCR CLIENT VERSION AT EXECUTION        = 2.1.263 (Claude Code)
                                         challenger Codex 0.146.0

EXACT CLIENT VERSION HELD CONSTANT     = UNKNOWN
CLIENT VERSION CONSTANCY               = NOT DEMONSTRATED
SEMANTIC MODEL / BACKEND IDENTITY      = UNKNOWN
```

La constance de la version exacte du client entre les deux bras n'est pas
démontrée — ni établie, ni infirmée. Le relevé `2.1.224` est un fait de
préparation antérieur à l'exécution du témoin ; il ne vaut pas version du
processus baseline au moment de son travail. C'est une limitation consignée,
pas corrigée : aucun rerun n'a été fait pour elle, et elle doit être tenue à
l'esprit dans toute lecture comparative ultérieure.

## 6. Déviations de protocole

```text
FICHIERS GELÉS MODIFIÉS = AUCUN, dans les deux workspaces
```

Deux limitations d'environnement ont été rencontrées et consignées plutôt que
contournées :

```text
1  la quarantaine d'entrée du témoin par confinement système n'a pas pu être
   établie ; le bras a été confié à une session humaine distincte

2  une session ayant produit le candidat baseline ne pouvait pas conduire
   ensuite le bras CCR ; l'aiguillage des sessions appartient à l'humain
```

## 7. Layer C — consommation machine publique

Mesure et détail complets dans `PUBLIC-CONSUMPTION.md`. Résumé de clôture :

```text
LAYER C                       = PASS

F1                            = découverte sémantique publique UNIQUE
PRIVATE RUN_ID RESCUE         = NO

F2                            = AVAILABLE
ACTIVITÉS DURABLES            = 23
STABILITÉ DEUX LECTURES       = PASS

RUN_START                     = observé
NATIVE_STEP                   = observé
HUMAN_SEND                    = non observé — cohérent avec HUMAN_SEND = 0
                                au run, et non un échec
```

### Autorité contractuelle F1/F2

Adjudication finale conduite en lecture seule contre CCR System v1.1.0 au
commit canonique `c9de52b223ee13e79863e9747f08e88938d59579`.

```text
CCR SYSTEM RELEASED CONTRACT AUTHORITY   = resolved
F1 CONTRACT CONFORMANCE                  = PASS
F2 CONTRACT CONFORMANCE                  = PASS
PUBLIC CONTRACT VIOLATION                = NO
```

Clés released littérales :

```text
F1   semantic_run_discovery_contract_version
     semantic_run_discovery_machine_representation_version
     runs

F2   durable_run_activity_contract_version
     durable_run_activity_machine_representation_version
     run_id
     projection_status
     activities   — sous AVAILABLE uniquement
```

```text
later orchestration shorthand    = non-authoritative
machine_representation_version   = n'était pas un nom de champ released
status                           = n'était pas un nom de champ released
```

Correction d'orchestration, sans conséquence produit.

```text
PRE-RUN F1 SURFACE READ                       = occurred
LEGACY / NON-F1-F2 INVOCATION-OUTCOMES READ   = occurred
AGENT CCR LAB #3 FUTURE LAYER-C ELIGIBILITY   = EXCLUDED
```

## 8. Implication produit

```text
CCR SYSTEM PRODUCT CHANGE      = NONE JUSTIFIED
NEW CONTRACT VIOLATION         = NONE
NEW PUBLIC REPRESENTATION GAP  = NONE DEMONSTRATED
CCR SYSTEM v1.1.0              = KEEP FROZEN
PRODUCT ANALYSIS               = NOT OPENED
```

L'ambiguïté de spécification découverte par C2 est un enseignement pour la
conception des cas futurs du Lab. Elle ne crée aucune demande de modification
de CCR System.
