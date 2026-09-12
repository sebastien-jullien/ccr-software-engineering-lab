# TOOLING-EXPERIMENT-002 — Mission Object v0 : autorité sémantique

## 1. Statut et autorité

```text
TYPE
= autorité de conception, ratifiée par l'humain

EXPÉRIENCE
= TOOLING-EXPERIMENT-002

OBJET
= représentation durable de mission

CE DOCUMENT
= autorité sémantique et littérale de Mission Object v0
= GELÉ POUR IMPLÉMENTATION

IMPLÉMENTATION
= AUCUNE ICI
```

Autorités antérieures, toutes inchangées par ce document :

```text
09-TOOLING-EXPERIMENT-001-PROGRAM-STATE.md                       INCHANGÉE
10-…-AMENDMENT-001-DECISION-CREATION.md                          INCHANGÉE
11-…-AMENDMENT-002-EVIDENCE-SUPERSESSION-REFRESH.md              INCHANGÉE
12-…-AMENDMENT-003-STREAM-CREATION.md                            INCHANGÉE
13-…-AMENDMENT-004-STREAM-OPEN-SEMANTICS.md                      INCHANGÉE
```

Ce document est autoportant. Sa lecture seule suffit à connaître le schéma
normatif : il ne renvoie à aucune session, à aucun échange, à aucun artefact
non versionné.

## 2. Question expérimentale de TOOLING-EXPERIMENT-002

Question gelée :

```text
Une mission réelle du Lab CCR peut-elle être représentée durablement dans un
objet structuré qui, sans s'appuyer sur une prose normative parallèle, contient
toute l'information nécessaire pour engendrer une enveloppe de mission humaine
équivalente en :

  sûreté
  exécutabilité
  ordonnancement
  portes
  branches
  conditions d'arrêt
  comportement en succès partiel
  exigences de preuve
  sémantique de clôture
  contrat de retour
```

Cette question ne porte pas sur l'orchestration ni sur l'exécution. Elle porte
sur la **représentation**.

```text
QUESTION EXPÉRIMENTALE
= SANS RÉPONSE À CE JOUR
```

## 3. Corpus de référence

La conception est dérivée de trois paquets de mission réels du Lab, pris
verbatim, et d'eux seuls.

```text
RÉFÉRENCE A   matérialisation de l'amendement 004        63 clauses
RÉFÉRENCE B   implémentation de l'amendement 003         68 clauses
RÉFÉRENCE C   transition de sélection de TE002           48 clauses

TOTAL
= 179 clauses normatives acceptées

RÉFÉRENCE D
= NON EMPLOYÉE
```

```text
COUVERTURE ACCEPTÉE
= 179 / 179

CLAUSES NORMATIVES PERDUES
= 0

CLAUSES NORMATIVES INVENTÉES
= 0
```

Le corpus est **clos**. Aucun élément du schéma ci-dessous n'existe sans au
moins une clause de A, B ou C qui l'exige. Les identifiants de clause employés
dans ce document renvoient à cette numérotation acceptée.

## 4. Principes de conception

```text
P1  toute force normative est portée par une structure
P2  la prose est présentation, jamais norme
P3  une exigence = une affirmation indépendamment falsifiable
P4  les vocabulaires normatifs sont fermés ; pas d'échappatoire
P5  aucun primitif n'est introduit sans usage mesuré dans le corpus
P6  représenter n'est pas exécuter
P7  un identifiant d'action est opaque : v0 ne l'interprète jamais
P8  ce qui n'est pas énuméré n'est pas autorisé
```

## 5. Schéma canonique exact de Mission Object v0

Seize éléments de premier niveau. Aucun autre.

```text
mission_object := {
  identity               requis    voir §5.1
  context[]              optionnel faits déclarés non normatifs
  references[]           requis    tout objet externe adressable
  effects[]              requis    ce qui doit / peut / ne doit pas se produire
  content_requirements[] optionnel obligations sur les livrables et l'état atteint
  procedure              optionnel étapes ordonnées
  gates[]                optionnel conditions de continuation
  branches[]             optionnel continuation possédée par la branche
  stop_rules[]           optionnel comportement d'arrêt immédiat
  human_authority        optionnel décisions ratifiées, portes humaines
  evidence_requirements[] optionnel faits devant être établis
  terminal_outcomes[]    optionnel résultats terminaux locaux à la mission
  return_contract[]      requis    faits devant être retournés
  next_consequences[]    optionnel ce qui suit un résultat
  standing_constraints[] optionnel contraintes survivant à la mission
  terminal               requis    { halt_after_return: true }
}
```

Éléments explicitement **absents**, chacun parce qu'il dupliquait un domicile
sémantique déjà existant :

```text
preconditions[]     → gates[]
deliverables[]      → references[] de rôle DELIVERABLE
post_state[]        → content_requirements[] portées par le résultat terminal
assertion_rules[]   → content_requirement.kind = FORBID_CLAIM + depends_on[]
scope_limits[]      → effects[] de mode FORBIDDEN
qualifiers[]        → portés par SEQUENCE, SET_EQUALS, SEQ_EQUALS, la granularité
```

### 5.1 `identity`, `context`, `procedure`, `terminal`

```text
identity := {
  id              requis    identifiant de mission
  class           requis    SYMBOL
  addressee       requis    SYMBOL
  target_project  requis    SYMBOL
  facets[]        optionnel SYMBOL[]
}                                                        A-001 · B-001 · C-001

context := {
  subject              requis    SYMBOL
  value                requis    value (§6)
  semantics_unresolved requis    bool
}                                                        A-010 · B-002 · B-005 · C-003

procedure := {
  strict_order  requis    bool                           C-008
  steps[]       requis    step[]
}

step := {
  order      requis    entier                            C-007
  id         requis    ID
  effect     requis    effect_ref
  atomic     requis    bool                              C-008
  gated_by   optionnel gate_ref                          B-048 · C-018
  produces   optionnel evidence_ref[]
}

terminal := { halt_after_return: true }                  A-063 · B-068 · C-048
```

`context.semantics_unresolved` existe pour une raison mesurée et une seule :
B-002 déclare un fait dont le corpus ne tire aucun effet opératoire. L'objet le
porte pour ce qu'il est — un contexte — sans lui inventer de force normative.

## 6. Algèbre de valeurs fermée

```text
value :=
    SCALAR                        chaîne · entier · booléen
  | SYMBOL                        référent opaque du domaine
  | REFERENCE                     identifiant de reference
  | SET<SYMBOL|SCALAR|REFERENCE>  ensemble exact, l'ensemble ÉTANT le fait
  | SEQUENCE<SYMBOL>              suite ordonnée exacte, la suite ÉTANT le fait
  | CLAIM_TRIPLE { subject, field, value }
```

Usages :

```text
SCALAR        A-011 · B-028
SYMBOL        A-022 · A-024
REFERENCE     B-017 · B-055
SET           B-024 · A-037 · B-060
SEQUENCE      A-035 · B-027
CLAIM_TRIPLE  A-036 · B-045 · C-013
```

```text
RECORD
= ABSENT
```

Aucun enregistrement générique n'est nécessaire : la règle de granularité (§11)
décompose tout groupe de faits scalaires en affirmations indépendantes. Aucune
charge utile arbitraire n'existe dans ce schéma.

## 7. Vocabulaire de relations fermé

Huit relations. Pas d'ellipse, pas d'extension.

```text
EQUALS          le sujet vaut exactement ceci        SYMBOL → SCALAR|SYMBOL
SET_EQUALS      les membres sont exactement cet ensemble   SYMBOL → SET
SEQ_EQUALS      le sujet est exactement cette suite ordonnée SYMBOL → SEQUENCE
HAS_MEMBER      le sujet doit contenir ce membre     SYMBOL → SYMBOL
IMPLIES         le sujet entraîne sémantiquement     SYMBOL → SYMBOL
DEFINED_BY      le sens du sujet est fixé par        SYMBOL → REFERENCE
ESTABLISHED_BY  le sujet est établi par              SYMBOL → SET<REFERENCE>
SUPPORTS        la relation de preuve soutient       SYMBOL → CLAIM_TRIPLE
```

```text
EQUALS          A-017 · A-019 · A-028 · A-030 · B-025 · B-026 · B-028
SET_EQUALS      B-024
SEQ_EQUALS      A-035 · B-027
HAS_MEMBER      A-018 · B-029 · B-031
IMPLIES         A-022 ; en polarité DENY : A-024 · A-029 · B-033 · B-056
DEFINED_BY      B-055
ESTABLISHED_BY  A-026 · A-037
SUPPORTS        A-036 · B-045 · C-013
```

Fusionnées, car redondantes :

```text
DOES_NOT_IMPLY  ≡ polarité DENY + IMPLIES
UNCHANGED_BY    ≡ kind = PRESERVE
VISIBLE_IN      ≡ le champ target
CONTAINS        ≡ HAS_MEMBER sous la règle de granularité
```

Vocabulaire de qualificatifs :

```text
QUALIFICATEURS
= VIDE
= champ absent du schéma
```

## 8. Modèle de prédicat

```text
predicate := { op, subject, value } | { all_of: predicate[] }

op       := EQ | NEQ | SET_EQ
subject  := { kind, modifier?, ref?, field? }
kind     := REPO_FACT | ARTIFACT_IDENTITY | OPERATION_RESULT
          | MEASUREMENT | PRESENCE_OF | OBJECT_FIELD
modifier := COUNT_OF
field    := SYMBOL
value    := value (§6)
```

```text
EQ           A-011 · B-038 · B-052 · B-061
NEQ          B-037
SET_EQ       B-060 · C-038
all_of       A-011 · B-052
PRESENCE_OF  B-015 · C-039
COUNT_OF     A-044 · B-061
```

Invariants du sélecteur `field` :

```text
field présent            → ref présent
field                    = EXACTEMENT UN NIVEAU
chemin / chaînage        = INTERDIT
filtre / joker           = INTERDIT
arithmétique             = INTERDITE

field autorisé pour      OPERATION_RESULT   B-037 · C-045 · C-046
                         OBJECT_FIELD       B-062
field interdit pour      REPO_FACT · ARTIFACT_IDENTITY · MEASUREMENT
                         PRESENCE_OF
```

Pour les quatre genres interdits, `ref` nomme directement le référent : un fait
de dépôt se **nomme**, il ne s'extrait pas d'une valeur structurée.

```text
LANGAGE D'EXPRESSION GÉNÉRAL
= AUCUN

OR · NOT · IN · NOT_IN · grammaire générale
= ABSENTS, faute d'usage dans le corpus
```

## 9. Modèle de référence

```text
reference := {
  id                requis    identifiant local à la mission
  role              requis    AUTHORITY | CONTEXT | VERIFICATION_TARGET | DELIVERABLE
  locator           requis    { kind, value }
  identity          optionnel { kind, value }
  identity_required requis    bool
}

locator.kind  := REPO_PATH | MISSION_PACKET | REMOTE_REF
identity.kind := GIT_BLOB | SHA256 | COMMIT
```

```text
role            A-009 · A-010 · A-011 exigent chacun une valeur différente
identity_required  A-010 n'en a pas ; B-009 en exige une
DELIVERABLE     B-020
```

Un chemin portant deux identités de genres différents se déclare comme deux
références partageant le même locator. Aucune liste d'identités n'existe.

## 10. Modèle d'exigence de preuve

```text
evidence_requirement := {
  id                requis    ID
  kind              requis    AUTHORITY | OBSERVATION | VERIFICATION | RETURNED
  fact              requis    SYMBOL
  method            optionnel { op, source: reference_ref, recompute: bool }
  forbidden_sources optionnel SYMBOL[] | reference_ref[]
  must_return       optionnel return_field_ref
}
```

```text
AUTHORITY     B-017 · B-045 · C-013
OBSERVATION   C-021
VERIFICATION  A-047 · A-058 · B-009 · C-042
RETURNED      B-038 · C-027 · C-033
method.recompute + forbidden_sources    B-009
must_return                             B-009
```

`must_return` est une **référence** vers un champ du contrat de retour : le fait
n'est jamais recopié. C'est ce lien qui empêche deux domiciles pour l'identité
d'un fait retourné.

## 11. Modèle d'exigence de contenu

Mécanisme unique des obligations, qu'elles portent sur un livrable ou sur l'état
atteint après une mutation.

```text
content_requirement := {
  id          requis     ID
  scope       requis     MISSION | branch_ref
  target      requis     reference_ref
  kind        requis     CLAIM | PRESERVE | FORBID_CLAIM
  polarity    requis ssi kind = CLAIM : ASSERT | DENY
  subject     requis     SYMBOL
  relation    optionnel  §7
  value       optionnel  §6
  depends_on  optionnel  evidence_ref[] | reference_ref[]
  label*      optionnel  prose, non normative
  rationale*  optionnel  prose, non normative
}
```

```text
CLAIM / ASSERT   A-014 · A-021 · A-026
CLAIM / DENY     A-024 · A-029 · B-033 · B-056
PRESERVE         A-033 · B-021 · B-030 · C-015
FORBID_CLAIM     A-020 · A-027 · A-031 · A-032 · B-018 · B-032 · C-014 · C-035 · C-041
depends_on       C-026 · C-034
scope = branch   C-023 · C-046
```

Règle de granularité, ratifiée :

```text
UNE EXIGENCE DE CONTENU
= UNE AFFIRMATION NORMATIVE INDÉPENDAMMENT FALSIFIABLE

EXCEPTION
= l'ensemble exact (SET_EQUALS) ou la suite ordonnée exacte (SEQ_EQUALS)
  lorsque cet ensemble ou cette suite EST le fait normatif
```

Ainsi A-024 devient treize affirmations DENY distinctes, B-029 treize, B-031
dix-sept ; tandis que B-024 reste une seule affirmation SET_EQUALS et A-035 une
seule affirmation SEQ_EQUALS.

Il n'existe **aucun** mécanisme d'assertion séparé. Les deux besoins qui
justifiaient jadis un tel mécanisme sont absorbés sans perte :

```text
affirmation interdite              → kind = FORBID_CLAIM
condition épistémique préalable    → depends_on[]
```

## 12. Modèle d'effet

```text
effect := {
  id          requis     ID
  mode        requis     REQUIRED | PERMITTED | PERMITTED_AFTER_GATE | FORBIDDEN
  action      requis     OPAQUE_ACTION_ID
  target      optionnel  reference_ref | SYMBOL
  cardinality optionnel  entier
  gated_by    requis ssi mode = PERMITTED_AFTER_GATE : gate_ref
  constraints optionnel  §12.2
}
```

```text
REQUIRED              A-042 · B-036 · B-041 · B-044 · C-012 · C-016 · C-019 · C-028
PERMITTED             B-034
PERMITTED_AFTER_GATE  A-052 · A-056 · B-064 · B-065 · C-043 · C-044
FORBIDDEN             A-003…A-007 · A-034 · A-038 · A-039 · A-041 · A-043 · A-051
                      A-055 · A-057 · B-013 · B-014 · B-035 · B-046 · B-047 · B-050
                      B-058 · B-059 · C-002 · C-011 · C-020 · C-024 · C-032
                      C-036 · C-037
cardinality           A-039 · A-042 · A-052 · B-036 · B-059 · C-012 · C-043
```

### 12.1 Discipline de l'identifiant d'action

```text
OPAQUE_ACTION_ID
= UN RÉFÉRENT D'ACTION ATOMIQUE

v0 NE L'INTERPRÈTE JAMAIS
```

Il ne doit encoder **aucune** de ces sémantiques :

```text
branchement · prédicat de porte · comportement d'arrêt · ordonnancement
cardinalité · exigence de preuve · succès partiel · statut terminal
```

Chacune possède sa structure dédiée :

```text
branchement       → branch.condition
porte             → gate.predicate
arrêt             → stop_rule
ordonnancement    → procedure.steps[].order + strict_order
cardinalité       → effect.cardinality
preuve            → evidence_requirements[]
succès partiel    → terminal_outcome.partial_state_allowed
statut terminal   → terminal_outcome
```

Un identifiant d'action composite qui dissimulerait un mini-flux de travail est
interdit. Aucune clause de A, B ou C n'en exige un.

### 12.2 `effect.constraints` — enregistrement fermé, définitif

```text
effect.constraints := {
  author?       : SCALAR
  committer?    : SCALAR
  parent?       : SCALAR
  subject?      : SCALAR
  staged_paths? : SET<SCALAR>
  ff_only?      : bool
}
```

| clé | type | sens | clauses |
|---|---|---|---|
| `author` | `SCALAR` | identité d'auteur Git exacte | A-050 · B-063 |
| `committer` | `SCALAR` | identité de committer Git exacte | A-050 · B-063 |
| `parent` | `SCALAR` | commit parent exact | A-053 |
| `subject` | `SCALAR` | ligne de sujet de commit exacte | A-054 |
| `staged_paths` | `SET<SCALAR>` | ensemble exact des chemins mis en index | B-064 |
| `ff_only` | `bool` | la poussée doit être une avance rapide ordinaire | A-056 · B-065 · C-044 |

Le type `SCALAR` des quatre littéraux Git est **imposé** : l'algèbre de valeurs
ne contient pas de `RECORD`, donc `Nom <adresse>` ne peut pas être une structure
à deux champs.

```text
INTERDIT DANS constraints
= map<string, any>
= charge utile arbitraire
= expression générique
= clé non déclarée
= retire · install · supersede · keep_selected · detector_state
```

Aucune contrainte d'état résultant n'appartient à cet enregistrement. Toutes
appartiennent à `content_requirements` (§20).

### 12.3 `ff_only` n'est pas l'interdiction de forcer

```text
A-056   une poussée FF ordinaire                    ff_only = true
A-057   pas de force          effect{FORBIDDEN, FORCE_PUSH}
B-065   une poussée FF ; pas de force ; vérifier    ff_only = true + interdiction
C-044   une poussée FF ; vérifier le distant        ff_only = true, sans interdiction
```

La mission A sépare les deux en deux clauses ; la mission C exige l'avance
rapide sans énoncer d'interdiction de forcer. Les deux règles sont donc
indépendantes, elles coexistent, et aucune n'implique l'autre.

```text
ff_only = false
= INFÉRÉ NULLE PART
```

### 12.4 `blobs = gelés` n'est pas une contrainte d'effet

B-064 exige aussi que les empreintes commises soient égales aux empreintes
gelées. Cette exigence n'ajoute **aucune** clé :

```text
l'effet contraint      l'ensemble des chemins mis en index      staged_paths
la vérification prouve l'égalité des identités de contenu       evidence + gate
```

```text
evidence_requirement { kind: VERIFICATION, fact: identity(<chemin>),
                       method: { op: EQ, source: <ref>, recompute: true } }
gate { predicate: { all_of: [ { EQ, ARTIFACT_IDENTITY(<ref>), <gelé> } … ] } }
```

Exigences de gel et de comparaison d'identité déjà présentes au corpus :
A-012, A-047, A-049, B-007, B-008, B-061, C-042.

## 13. Procédure, portes et règles d'arrêt

```text
gate := {
  id        requis     ID
  scope     requis     step_ref[] | ALL_PRECEDING
  predicate requis     §8
  on_fail   requis     stop_rule_ref | branch_ref
  tolerated optionnel  SYMBOL[]
}
```

```text
gates            A-011 · A-012 · A-044 · A-048 · A-049 · B-006 · B-007 · B-008
                 B-015 · B-038 · B-052 · B-060 · B-061 · B-062 · C-009 · C-030 · C-038
tolerated        B-053
```

```text
stop_rule := {
  id           requis    ID
  trigger      requis    predicate
  prohibitions requis    effect[]
  required     requis    [ REPORT ]
  terminal     requis    STOP
}
```

```text
stop_rules   A-013 · B-010 · B-019 · B-037 · B-054 · C-010 · C-031
```

Invariant, sans exception :

```text
UNE RÈGLE D'ARRÊT NE DÉCLARE AUCUN RÉSULTAT TERMINAL DE MISSION
```

Le schéma ne lui donne aucun champ pour le faire. B-037 en est la démonstration
directe : un code de sortie non nul de la qualification est un **résultat
d'opération**, déclencheur d'un arrêt assorti de trois interdictions et d'un
rapport ; ce n'est pas un résultat terminal de la mission.

```text
B-037   trigger      { NEQ, OPERATION_RESULT(qualification).exit, 0 }
        prohibitions { FORBIDDEN, REPAIR }
                     { FORBIDDEN, RERUN, target: qualification }
                     { FORBIDDEN, COMMIT }
        required     [ REPORT ]
        terminal     STOP
        résultat terminal de mission assigné : AUCUN
```

## 14. Continuation possédée par la branche

```text
branch := {
  id               requis    ID
  condition        requis    predicate
  steps            optionnel step[]
  effects          optionnel effect[]
  requirements     optionnel content_requirement[]
  terminal_outcome requis    outcome_ref
  next             requis    next_consequence_ref
}
```

```text
branches   C-022 · C-023 · C-024 · C-043 · C-045 · C-046
```

Une interdiction propre à une branche est un effet ordinaire de portée branche,
jamais un champ ad hoc. Ainsi « ne pas créer automatiquement l'amendement 003 »
(C-046) est `{ FORBIDDEN, CREATE_DOCUMENT, target: amendment_003 }` dans les
effets de la branche B.

## 15. Modèle d'autorité humaine

```text
human_authority := {
  ratified_decisions[]        optionnel ratified_decision[]
  open_human_gates[]          optionnel open_human_gate[]
  deterministic_consequences  optionnel next_consequence_ref[]
}

ratified_decision := { id: ID, subject: SYMBOL, authority: reference_ref }
open_human_gate   := { id: ID, subject: SYMBOL }
```

```text
ratified_decisions          B-012 · C-004
open_human_gates            C-046
deterministic_consequences  A-060
```

`ratified_decisions[]` est une énumération : ce qui n'y figure pas n'est pas
ratifié. C'est la lecture ordinaire d'une liste, non un primitif supplémentaire.

```text
scope_limits
= ABSENT
```

Une limite de périmètre n'est pas une propriété de l'autorité humaine : c'est
une interdiction. Les trois clauses de périmètre du corpus vivent donc dans
`effects[]` :

```text
A-040   { FORBIDDEN, RESUME, amendment_003_implementation }
A-041   { FORBIDDEN, DESIGN, mission_object_v0 }
C-006   { FORBIDDEN, DESIGN, mission_object_v0 }
```

```text
A-040   ne pas reprendre l'implémentation de l'amendement 003 dans cette mission
A-041   aucune conception, aucun schéma, aucune implémentation de Mission Object
C-006   la sélection ratifiée de TE002 n'autorise pas la conception de
        Mission Object v0
```

A-040 et A-041 ont une action et une cible distinctes ; ils ne sont jamais
fusionnés. C-006 et A-041 partagent leur forme mais appartiennent à deux objets
de mission différents, ce qui n'est pas un domicile dupliqué.

```text
LA SÉLECTION DE TE002  ≠  L'AUTORISATION DE CONCEVOIR MISSION OBJECT
```

C-003 énonce la même frontière que C-036 pour la reprise fraîche. Les deux
clauses tracent vers **la même instance d'effet** ; aucune interdiction n'est
dupliquée au motif que deux clauses sources énoncent une même frontière.

```text
C-003 · C-036   → effects[]{ FORBIDDEN, RESUME, fresh_session }  — instance unique
```

## 16. Modèle de résultat terminal

```text
terminal_outcome := {
  label                           requis    SYMBOL
  valid_when                      requis    predicate | branch_ref
  partial_state_allowed           requis    bool
  reached_state_must_be_preserved requis    bool
  post_state                      optionnel content_requirement[]
  next                            requis    next_consequence_ref
}
```

```text
labels locaux à la mission   C-039 · C-040 · C-045 · C-046
partial_state_allowed        C-025 · C-039
reached_state_must_be_preserved  C-025
post_state                   A-059 · B-066 · C-045 · C-046
```

```text
DOCTRINE GLOBALE D'ÉCHEC
= AUCUNE
```

Les étiquettes de résultat sont des symboles locaux à la mission. Le schéma ne
définit la signification d'aucune d'entre elles, et n'en ferme pas le
vocabulaire.

```text
publication
= CHAMP ABSENT
```

C-040 exige que l'état partiel atteint ne soit publiable qu'après la porte de
gel et de frontière de diff. Cette exigence est portée sans perte par les effets
de la branche qui atteint le résultat :

```text
{ PERMITTED_AFTER_GATE, COMMIT, cardinality: 1, gated_by: gate.freeze_diff }
{ PERMITTED_AFTER_GATE, PUSH,                  gated_by: gate.freeze_diff }
+ terminal_outcome.reached_state_must_be_preserved = true
```

Ajouter un champ de publication au résultat créerait un second domicile pour
C-040. Il n'en existe qu'un.

## 17. Contrat de retour

```text
return_field := {
  id                  requis     ID
  fact                requis     SYMBOL
  acquisition         requis     PREDETERMINED | MEASURED
  value_type          requis     SCALAR | SYMBOL | SET
  predetermined_value requis ssi acquisition = PREDETERMINED
  allowed_values      optionnel  SET<SYMBOL|SCALAR>
  label*              optionnel  prose, non normative
}
```

```text
return_contract   A-062 · B-038 · B-067 · C-015 · C-027 · C-033 · C-047
```

```text
PREDETERMINED   le contrat de mission fixe la valeur retournée
MEASURED        l'exécution doit déterminer puis rapporter la valeur réelle
```

Trois faits restent connaissables après suppression de toute étiquette :

```text
fact         QUEL fait est retourné
acquisition  COMMENT sa valeur est fixée
value_type   QUELLE FORME a la valeur
```

```text
value_type retenus     SCALAR · SYMBOL · SET
value_type écartés     REFERENCE · SEQUENCE, faute d'usage en champ de retour
absence_allowed        ABSENT : tout champ de retour du corpus est obligatoire,
                       et « exact / AUCUN » est l'ensemble vide, non une absence
ENUM comme mode d'acquisition   ABSENT : une restriction énumérée est portée
                       par allowed_values
```

Exemple, C-047, résultat terminal de mission :

```text
return_field {
  fact           = mission.terminal_outcome
  acquisition    = MEASURED
  value_type     = SYMBOL
  allowed_values = { PASS, BLOCKED, FAILED }
}
```

`allowed_values` est un contenu d'instance lu dans le contrat de retour de la
mission ; ce n'est pas un vocabulaire du schéma. Aucun sens global n'est attaché
ici à `FAILED`. Le schéma n'exige pas non plus qu'un membre d'`allowed_values`
possède un `terminal_outcome` correspondant.

## 18. Modèle de conséquence suivante

```text
next_consequence := {
  id          requis    ID
  kind        requis    DETERMINED | HUMAN_GATE
  action      requis    OPAQUE_ACTION_ID
  target      optionnel reference_ref | SYMBOL
  no_new_gate optionnel bool
  label*      optionnel prose, non normative
}
```

```text
DETERMINED   A-060 · C-045
HUMAN_GATE   C-046
no_new_gate  A-061
```

La conséquence normative survit à la suppression de toute prose :

```text
A-060   { DETERMINED, IMPLEMENT, amendment_003, no_new_gate: true }
C-045   { DETERMINED, DESIGN,    mission_object_v0 }
C-046   { HUMAN_GATE, DECIDE,    stream_creation_capability }
```

```text
CHAMP DE PHRASE NORMATIVE
= AUCUN
```

## 19. Modèle de contrainte permanente

```text
standing_constraint := {
  id                 requis  ID
  constraint         requis  effect
  release_condition  requis  predicate
}
```

```text
standing_constraints   B-057
```

```text
PORTÉE DE L'APPLICATION DANS v0
= DÉCLARATION SEULE
```

Invariant primitif du schéma, non un champ d'instance : Mission Object v0 ne
possède aucun mécanisme inter-missions, et n'est couplé à aucun état de
programme. La contrainte est enregistrée là où elle a été créée ; elle n'y est
pas appliquée.

## 20. Normalisation des mutations d'état de programme

Règle canonique, gelée :

```text
MUTATION D'ÉTAT DE PROGRAMME

l'opération réalisée
→ effect

l'état requis résultant de l'opération
→ content_requirements

la sémantique devant rester inchangée
→ content_requirement de kind PRESERVE
```

C'est une normalisation de primitifs déjà ratifiés. Ce n'est ni un moteur de
flux de travail, ni un modèle d'états supplémentaire.

Trois clauses du corpus en sont la provenance et la démonstration.

### 20.1 B-041 / B-042

```text
B-041   effect { REQUIRED, REFRESH, target: evidence.te001 }

B-042   content_requirement { CLAIM, ASSERT, subject: support.te001_implementation,
                              relation: EQUALS, value: INACTIVE }
        content_requirement { CLAIM, ASSERT, subject: support.tool_final,
                              relation: EQUALS, value: ACTIVE }
        content_requirement { CLAIM, ASSERT, subject: support.tests_final,
                              relation: EQUALS, value: ACTIVE }
        content_requirement { PRESERVE, subject: detector.source_changed }
```

### 20.2 B-049

```text
effect  { REQUIRED, UPDATE, target: next_action }

content_requirement { CLAIM, ASSERT, subject: support.next_action_old,
                      relation: EQUALS, value: INACTIVE }
content_requirement { CLAIM, ASSERT, subject: support.next_action_new,
                      relation: EQUALS, value: ACTIVE }
content_requirement { CLAIM, ASSERT, subject: next_action.state,
                      relation: EQUALS, value: SELECTED }
```

### 20.3 C-016 / C-017

```text
C-016   effect { REQUIRED, UPDATE, target: next_action }

C-017   content_requirement { CLAIM, ASSERT, subject: support.superseded,
                              relation: EQUALS, value: INACTIVE }
        content_requirement { CLAIM, ASSERT, subject: support.replacement,
                              relation: EQUALS, value: ACTIVE }
```

Chacun de ces faits est indépendamment falsifiable. Aucun n'est un paramètre
d'opération. Cette section existe précisément pour empêcher la dérive écartée :

```text
CHARGE UTILE MÉTIER GÉNÉRIQUE DANS effect.constraints
= REJETÉE
```

La sémantique de supersession n'est pas davantage encodée dans l'identifiant
d'action : une action reste atomique et opaque (§12.1).

## 21. Politique de texte libre

```text
CHAMPS DE PROSE AUTORISÉS
= label* · rationale*

FORCE NORMATIVE DE CES CHAMPS
= NULLE
```

Test obligatoire, à passer par toute instance : supprimer conceptuellement tous
les champs de prose ne doit retirer aucun de ces éléments :

```text
porte · interdiction · branche · règle d'arrêt · ordonnancement
exigence de preuve · règle de succès partiel · obligation de retour
résultat terminal · conséquence suivante
```

```text
ÉCHAPPATOIRES NORMATIVES EN TEXTE LIBRE
= 0
```

## 22. Autorité de la mission et prose parallèle

```text
MISSION OBJECT
= AUTORITÉ NORMATIVE DURABLE PRIMAIRE DE LA MISSION

ENVELOPPE HUMAINE ENGENDRÉE
= RENDU DÉTERMINISTE DE CETTE AUTORITÉ

INVITE NORMATIVE PARALLÈLE
= INTERDITE
```

Un texte humain libre peut aider la présentation. Il ne peut porter aucune
norme.

## 23. Contrat de rendu déterministe

```text
tout élément structuré normatif        → RENDU
aucune règle normative nouvelle        → INVENTÉE PAR LE RENDU
aucune règle normative                 → OMISE PAR LE RENDU
ordonnancement                         → PRÉSERVÉ
portes                                 → PRÉSERVÉES
branches                               → PRÉSERVÉES
règles d'arrêt                         → PRÉSERVÉES
sémantique de succès partiel           → PRÉSERVÉE
appartenance au retour obligatoire     → PRÉSERVÉE
conséquences suivantes par résultat    → PRÉSERVÉES
```

La formulation de présentation peut varier, à la seule condition de ne pas
changer le sens normatif.

## 24. Obligations du validateur

Le validateur à venir devra rejeter, sans réparation ni valeur inférée :

```text
élément de premier niveau inconnu
clé inconnue dans effect.constraints
valeur hors d'un vocabulaire fermé
relation hors des huit
opérateur hors de EQ · NEQ · SET_EQ
predicate.subject.field sur un genre non autorisé
predicate.subject.field sans ref
chaînage ou chemin dans field
mode PERMITTED_AFTER_GATE sans gated_by
kind = CLAIM sans polarity
polarity sur un kind différent de CLAIM
acquisition = PREDETERMINED sans predetermined_value
predetermined_value sur un champ MEASURED
règle d'arrêt déclarant un résultat terminal de mission
identifiant d'action composite
champ de prose portant une obligation
référence pendante : effect_ref · gate_ref · branch_ref · outcome_ref
                     next_consequence_ref · return_field_ref · reference_ref
                     evidence_ref · step_ref
```

## 25. Plan de qualification

Prédéclaré. **Non exécuté par ce document.**

L'implémentation future devra :

```text
encoder A · encoder B · encoder C
valider les objets
rendre les enveloppes de façon déterministe
auditer la couverture normative
```

Cibles de succès :

```text
CLAUSES NORMATIVES PERDUES           = 0
CLAUSES NORMATIVES INVENTÉES         = 0
ÉCHAPPATOIRES NORMATIVES LIBRES      = 0
ORDONNANCEMENT PRÉSERVÉ              = OUI
PORTES PRÉSERVÉES                    = OUI
CONDITIONS D'ARRÊT PRÉSERVÉES        = OUI
SÉMANTIQUE DE BRANCHE PRÉSERVÉE      = OUI
SÉMANTIQUE DE SUCCÈS PARTIEL         = OUI
SÉMANTIQUE DE RETOUR OBLIGATOIRE     = OUI
```

## 26. Protocole du premier dogfood réel de TE002

Prédéclaré. **Non exécuté par ce document.**

```text
LA PROCHAINE MISSION RÉELLE DU LAB
→ rédigée DEPUIS un Mission Object
→ validée
→ rendue en enveloppe humaine
→ envoyée sans augmentation normative manuelle
```

Dogfood interdit :

```text
rédiger d'abord une mission normative manuelle
puis encoder l'objet après coup
```

```text
si un humain doit ajouter une contrainte normative manquante pour rendre la
mission engendrée sûre ou exécutable
= CONSTAT RÉEL DE DOGFOOD TE002
```

## 27. Hors périmètre

Mission Object v0 **représente** des missions. Il ne fait rien de ce qui suit :

```text
exécuter des commandes
dispatcher des agents
décider d'un routage
construire du contexte automatiquement
prendre des décisions produit
muter Git par lui-même
invoquer CCR
planifier du travail
gérer une orchestration parallèle
juger la qualité d'une mission par un modèle
ingérer des retours automatiquement
muter PROGRAM-STATE automatiquement
```

```text
REPRÉSENTATION
≠ MOTEUR D'EXÉCUTION
```

## 28. Choix d'implémentation différés

```text
SÉRIALISATION
= DIFFÉRÉE

LANGAGE D'IMPLÉMENTATION
= DIFFÉRÉ

CHEMINS D'IMPLÉMENTATION
= DIFFÉRÉS
```

Ils ne font pas partie du gel sémantique. L'implémentation future pourra les
dériver mécaniquement des contraintes du dépôt. S'il subsiste plusieurs choix
substantiels d'implémentation :

```text
S'ARRÊTER POUR UNE DÉCISION D'IMPLÉMENTATION BORNÉE
```

Cela ne rouvre jamais la conception sémantique de Mission Object.

## 29. Critères de succès et d'échec

```text
SUCCÈS
= A, B et C encodés
+ objets validés
+ enveloppes rendues de façon déterministe
+ 179 / 179 clauses normatives préservées
+ 0 clause inventée
+ 0 échappatoire normative en texte libre
+ premier dogfood réel mené sans augmentation normative manuelle

ÉCHEC
= une clause normative du corpus n'est pas représentable
= ou l'enveloppe engendrée exige une prose normative parallèle pour être
  sûre ou exécutable
```

Un échec est un résultat d'expérience, pas un défaut d'outil : il répondrait à
la question expérimentale par la négative, ce qui est une réponse.

## 30. Statut de conception

```text
CONCEPTION SÉMANTIQUE DE MISSION OBJECT v0
= RATIFIÉE PAR L'HUMAIN

SCHÉMA LITTÉRAL
= CLOS APRÈS NORMALISATION MÉCANIQUE

PREUVE DE COUVERTURE À 179 CLAUSES
= ACCEPTÉE

MISSION OBJECT v0
= PRÉDÉCLARÉ
= GELÉ POUR IMPLÉMENTATION
```

Rien de ce qui suit n'est établi, et ce document ne le prétend pas :

```text
SUCCÈS D'IMPLÉMENTATION       NON ÉTABLI
SUCCÈS DU RENDU               NON ÉTABLI
SUCCÈS DU VALIDATEUR          NON ÉTABLI
SUCCÈS DU DOGFOOD             NON ÉTABLI
QUESTION EXPÉRIMENTALE        SANS RÉPONSE
```

## 31. Ce que ce document ne fait pas

```text
IMPLÉMENTATION MISSION OBJECT   0
VALIDATEUR                      0
RENDU DÉTERMINISTE              0
FIXTURES A / B / C              0
DOGFOOD TE002                   0
TESTS EXÉCUTÉS                  0
CODE DE L'OUTIL MODIFIÉ         NON
TESTS MODIFIÉS                  NON
ÉTAT DU FLUX TE002 MODIFIÉ      NON
RESULT-001                      NON CRÉÉ
```

## 32. Conséquence de développement suivante

```text
CONSÉQUENCE DÉTERMINISTE
= IMPLÉMENTER MISSION OBJECT v0 DEPUIS CETTE AUTORITÉ

PÉRIMÈTRE
= validateur
+ rendu déterministe
+ fixtures de qualification A / B / C

NOUVELLE PORTE HUMAINE
= AUCUNE
```

TOOLING-EXPERIMENT-002 reste `OPEN`. La maintenance du dogfood de
TOOLING-EXPERIMENT-001 se poursuit de façon asynchrone, et la question de
reprise qu'elle s'était posée reste, elle aussi, sans réponse.
