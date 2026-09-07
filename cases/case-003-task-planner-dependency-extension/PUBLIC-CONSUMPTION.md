# CASE-003 — Consommation machine public-only

Surfaces publiques de CCR uniquement. Aucune lecture d'interne.

```text
PUBLIC MACHINE CONSUMPTION
= COMPLETE

LAYER
= C

QUESTION
= un consommateur machine public peut-il
  1. decouvrir le run vise semantiquement via F1
  2. lire son activite durable via F2
```

## Cadre

```text
CCR SYSTEM VERSION            = 1.1.0
CCR SYSTEM COMMIT             = c9de52b223ee13e79863e9747f08e88938d59579
CCR SYSTEM WORKTREE           = clean
BINAIRE                       = node E:/prog/ccr-system/bin/ccr.mjs
                                (chemin explicite, jamais resolu via PATH)

LAB BRANCH                    = main
LAB HEAD                      = a58e9cd1b43c26e9a3a8dc16330f0bf3e41eda71

SOURCE D'IDENTIFICATION       = titre semantique public uniquement
PRIVATE / RECORDED RUN_ID     = NON UTILISE
PRIVATE RUN_ID RESCUE         = NON EFFECTUE
DECOUVERTE PAR FILESYSTEM     = NON EFFECTUEE
```

## Surfaces consommees

```text
F1  ccr run-descriptors --format json          = APPELEE
F2  ccr run-activity <run_id> --format json    = APPELEE (2 lectures)

ccr list --format json                         = NON APPELEE
ccr invocation-outcomes <run_id> --format json = NON APPELEE (hors perimetre Layer C)
```

## F1 — decouverte semantique

```text
F1 COMMAND
= node E:/prog/ccr-system/bin/ccr.mjs run-descriptors --format json

F1 EXIT                                                = 0
F1 STDERR                                              = vide
F1 STDOUT                                              = une representation JSON valide et unique

semantic_run_discovery_contract_version                = 1  (present)
semantic_run_discovery_machine_representation_version  = 1  (present)

TOP-LEVEL KEYS                = runs,
                                semantic_run_discovery_contract_version,
                                semantic_run_discovery_machine_representation_version

DESCRIPTOR COUNT              = 7
DESCRIPTOR SHAPES             = closed  (exactement run_id + title, sur les 7)
DESCRIPTOR TYPES              = string / string
RUN_ID                        = identifiant opaque
TITLE                         = titre canonique enregistre
PARTIAL DESCRIPTOR SUCCESS    = aucun

F1 CONTRACT SHAPE             = PASS
```

```text
DESCRIPTOR ORDER              = traite comme NONSEMANTIC
TITLE UNIQUENESS              = NON PRESUPPOSEE (comptage exact effectue)
```

## F1 — selection

```text
TARGET SEMANTIC TITLE
= CASE-003 / RUN-001 — Task Planner Dependency Extension

COMPARAISON                   = egalite exacte de chaine, verifiee sur points de code
F1 SEMANTIC MATCH COUNT       = 1
CORRESPONDANCES NON EXACTES   = 0
F1 SELECTION                  = UNIQUE

F1 DISCOVERED RUN_ID          = CCR-20260907-001
ORIGINE SEMANTIQUE            = correspondance de titre public F1

DESAMBIGUISATION EXTERNE      = aucune
                                (aucun timestamp prive, record Lab, filesystem,
                                 transcript, run_id connu ni contenu candidat consulte)
```

## F2 — evaluabilite

```text
F2 EVALUABLE                  = OUI  (conditionne a F1 SELECTION = UNIQUE)

F2 COMMAND
= node E:/prog/ccr-system/bin/ccr.mjs run-activity CCR-20260907-001 --format json

MUTATION ENTRE LES DEUX LECTURES
ccr start                     = 0
ccr step                      = 0
ccr send                      = 0
pause / resume                = 0
RUN MUTATION                  = 0
```

## F2 — lecture 1

```text
EXIT                                                 = 0
STDERR                                               = vide
durable_run_activity_contract_version                = 1  (present)
durable_run_activity_machine_representation_version  = 1  (present)
run_id                                               = CCR-20260907-001
projection_status                                    = AVAILABLE
ACTIVITY COUNT                                       = 23
```

## F2 — lecture 2

```text
EXIT                                                 = 0
STDERR                                               = vide
durable_run_activity_contract_version                = 1  (present)
durable_run_activity_machine_representation_version  = 1  (present)
run_id                                               = CCR-20260907-001
projection_status                                    = AVAILABLE
ACTIVITY COUNT                                       = 23
```

## F2 — conformite de forme publique

```text
F2 PUBLIC CONTRACT SHAPE      = PASS

TOP-LEVEL KEYS                = activities,
                                durable_run_activity_contract_version,
                                durable_run_activity_machine_representation_version,
                                projection_status,
                                run_id

activity_id                   = chaine opaque, non vide, unique sur les 23
sequence                      = entier strictement positif, strictement croissant
activity_kind                 = uniquement RUN_START / NATIVE_STEP / HUMAN_SEND
procedural_disposition        = uniquement IN_PROGRESS / COMPLETED /
                                NOT_COMPLETED / UNCERTAIN

FORME PAR KIND                = closed
  RUN_START                   = activity_id, sequence, activity_kind,
                                procedural_disposition
  NATIVE_STEP                 = idem + source_role, target_role, round

ORDRE DE SERIALISATION        = conforme a l'ordre sequentiel croissant attendu
```

## F2 — stabilite des deux lectures

```text
BYTE IDENTITY                 = identique
SHA256 (les deux lectures)
= edc8c1e5f925dbc407666559634eb19ffc873761684ed0b886e182857208e8a5

STATUS STABILITY              = PASS
CONTRACT VERSION STABILITY    = PASS
RUN_ID STABILITY              = PASS
ACTIVITY COUNT STABILITY      = PASS
ACTIVITY_ID STABILITY         = PASS
SEQUENCE STABILITY            = PASS
SERIALIZATION ORDER STABILITY = PASS
KIND STABILITY                = PASS
KIND METADATA STABILITY       = PASS
DISPOSITION STABILITY         = PASS

COMPARAISON A UNE TRACE PRIVEE = aucune
```

## Kinds observes

```text
RUN_START                     = OBSERVED      (1)
NATIVE_STEP                   = OBSERVED      (22)
HUMAN_SEND                    = NOT OBSERVED  (0)

CONTRACT FAILURE              = NO
```

Aucune intervention humaine n'a ete fabriquee pour obtenir la couverture
`HUMAN_SEND`. Son absence est un fait observe, pas un defaut de contrat.

## Dispositions observees

```text
COMPLETED                     = 23
IN_PROGRESS                   = 0
NOT_COMPLETED                 = 0
UNCERTAIN                     = 0
```

## Activite durable lue (surface publique F2)

```text
seq   kind         disposition   source_role  target_role  round  activity_id
10    RUN_START    COMPLETED     -            -            -      act_36330cfea944dfc21fe018e8
20    NATIVE_STEP  COMPLETED     author       challenger   1      act_0426eaccd7efa8eaacff23fa
30    NATIVE_STEP  COMPLETED     challenger   author       2      act_089ed6127209e998d99d93eb
40    NATIVE_STEP  COMPLETED     author       challenger   3      act_e8b421b86fee9692b9452443
50    NATIVE_STEP  COMPLETED     challenger   author       4      act_cd806988d19f17c08fdfe083
60    NATIVE_STEP  COMPLETED     author       challenger   5      act_f3a8f37bf2bff57df9b61a3e
70    NATIVE_STEP  COMPLETED     challenger   author       6      act_710c7792d0c9804225157dba
80    NATIVE_STEP  COMPLETED     author       challenger   7      act_41dce298ce5435ea3c2cd644
90    NATIVE_STEP  COMPLETED     challenger   author       8      act_eda3a0c05e433ea1921487b9
100   NATIVE_STEP  COMPLETED     author       challenger   9      act_5a4d13d6c306a617a1441565
110   NATIVE_STEP  COMPLETED     challenger   author       10     act_eeefb74d0b8f50c982454394
120   NATIVE_STEP  COMPLETED     author       challenger   11     act_507b971c2337184f611bec82
130   NATIVE_STEP  COMPLETED     challenger   author       12     act_3659ad45e9b6c9caf93aa59e
140   NATIVE_STEP  COMPLETED     author       challenger   13     act_9fc0ef4cf8482588b74d73cc
150   NATIVE_STEP  COMPLETED     challenger   author       14     act_4fb7dfd0fe91e58b1710b8ac
160   NATIVE_STEP  COMPLETED     author       challenger   15     act_ccdccf0be3e18f73033866c0
170   NATIVE_STEP  COMPLETED     challenger   author       16     act_ab30e98c9bbf07b22d1d9f04
180   NATIVE_STEP  COMPLETED     author       challenger   17     act_ff086804d4a24634261f37c6
190   NATIVE_STEP  COMPLETED     challenger   author       18     act_a554704e8ef5e0c28ec0a001
200   NATIVE_STEP  COMPLETED     author       challenger   19     act_a0f84ef02d0b873bee7bd9a4
210   NATIVE_STEP  COMPLETED     challenger   author       20     act_1d13fb373a78c11d6ee1f11a
220   NATIVE_STEP  COMPLETED     author       challenger   21     act_dc27a5834818567f9ea9c50e
230   NATIVE_STEP  COMPLETED     challenger   author       22     act_6a995485319a7bc2376acb66
```

## Non-identites tenues

```text
F2 ACTIVITY        ≠ INVOCATION OUTCOME
F2                 ≠ TRANSCRIPT
ROLE               ≠ PROVIDER
COMPLETED          ≠ substantive software success
NOT_COMPLETED      ≠ automatic software failure
UNAVAILABLE        ≠ historique d'activite vide
PROJECTION_FAILURE ≠ succes partiel
facts: []          ≠ absence d'activite
MISSING HISTORY    ≠ EMPTY HISTORY
```

```text
ROLE / PROVIDER CONFLATION    = NONE
```

Les etiquettes `author` et `challenger` lues en F2 sont des roles proceduraux
CCR. Aucun champ fournisseur, modele ou vendeur n'apparait dans la surface
publique F2, et aucune identite de fournisseur n'a ete inferee depuis un role.

## Ce que Layer C ne mesure pas

```text
software correctness              = NON EVALUE
software winner                   = NON EVALUE
baseline vs CCR quality           = NON EVALUE
candidate architecture            = NON EVALUE
provider quality                  = NON EVALUE
CCR product defect                = NON EVALUE

SOFTWARE SUCCESS INFERRED FROM F2 = NO
```

```text
PUBLIC MACHINE CONSUMABILITY  ≠ SOFTWARE TRUTH
OBSERVED PUBLIC FRICTION      ≠ AUTOMATIC PRODUCT DEFECT
```

Toute consequence produit eventuelle releve d'un gate humain ulterieur.

## Etancheite

```text
PRIVATE / RECORDED RUN_ID USED AS INPUT       = NO
PRIVATE CASE MATERIAL USED AS INPUT TO F1/F2  = NO
LAYER-A TRUTH USED AS INPUT TO F1/F2          = NO
F1/F2 SELECTION CONTAMINATION                 = NONE

RUN-001-RECORD.md             = NON OUVERT
BASELINE-RECORD.md            = NON OUVERT
EVALUATION.md                 = NON OUVERT
TRUTH-MATRIX / holdouts       = NON OUVERTS
participant/** , control/**   = NON OUVERTS
reference planner             = NON OUVERT
candidate workspaces          = NON OUVERTS
transcript prive              = NON OUVERT
private run files             = NON OUVERTS

tests visibles / holdouts     = NON EXECUTES
invocation-outcomes           = NON APPELEE
```

### Chronologie de l'ecriture du record

La mesure et son enregistrement sont deux gestes distincts. L'etancheite
ci-dessus qualifie les **entrees** de F1 et F2, pas l'ecriture posterieure.

```text
PUBLIC-CONSUMPTION.md OPENED BEFORE F1/F2 COMPLETION = NO
PUBLIC-CONSUMPTION.md OPENED AFTER F1/F2 COMPLETION  = YES
PURPOSE                                              = record writing only

F1/F2 SELECTION CONTAMINATION                        = NONE
```

Le squelette preexistant de ce fichier a ete ouvert une seule fois, apres la
cloture de F1 et de F2, dans le seul but d'ecrire le present record. Il ne
contenait ni run_id, ni materiau prive. La selection F1 etait deja etablie et
les deux lectures F2 deja capturees : cette ouverture posterieure ne peut donc
pas avoir alimente la mesure.

## Consommabilite

```text
PUBLIC CONSUMABILITY = OUI

Un consommateur machine public, sans aucun acces prive, a pu
  1. decouvrir le run vise par son seul titre semantique via F1
     (correspondance exacte unique sur 7 descripteurs)
  2. lire son activite durable via F2
     (projection_status AVAILABLE, 23 activites, forme publique fermee)
  3. relire cette activite de maniere stable
     (deux lectures independantes identiques au bit pres)

FRICTION PUBLIQUE OBSERVEE = aucune

CASE-003 LAYER C = COMPLETE
```
