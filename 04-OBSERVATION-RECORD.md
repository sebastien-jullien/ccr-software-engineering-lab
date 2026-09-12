# Observation Record

Utiliser une section par friction ou observation significative.

---

## Observation O-XXX

### Contexte

```text
CASE
= ...

RUN
= ...

STEP / INTERACTION
= ...
```

### Observation

```text
FRICTION
= ...

CONSEQUENCE
= ...

BLOCKING
= YES / NO
```

### Attribution

```text
CCR-SIDE
= YES / NO / UNDETERMINED

CONSUMER-SIDE
= YES / NO / UNDETERMINED

CASE-SIDE
= YES / NO / UNDETERMINED
```

### Nature

```text
AUTHORITY GAP
= YES / NO

PUBLIC CONTRACT GAP
= YES / NO

PUBLIC REPRESENTATION GAP
= YES / NO

QUERY / DISCOVERY GAP
= YES / NO

OPERATOR FRICTION
= YES / NO
```

### Contournement

```text
WORKAROUND REQUIRED
= YES / NO

WORKAROUND
= ...

WORKAROUND COST
= ...
```

### Preuve

Lister uniquement ce qui démontre l'observation.

### Analyse

Ce que l'observation permet réellement de conclure.

### Non-conclusions

Ce qu'elle ne permet pas de conclure.

### Décision produit

```text
PRODUCT DECISION
= NONE / PROPOSED / HUMAN-SELECTED
```

Une observation ne doit pas elle-même produire automatiquement une décision produit.

---

## Observation O-001 — La contradiction native a produit une correction utile

### Contexte

```text
CASE
= CASE-001

RUN
= CCR-20260904-001

STEP / INTERACTION
= ccr start + rounds 1 à 4 (author ↔ challenger)
```

### Observation

```text
FRICTION
= NONE

OBSERVATION
= native author/challenger contradiction produced material
  report/evidence corrections without producing a false
  functional defect

CONSEQUENCE
= aucune ; observation positive

BLOCKING
= NO
```

### Attribution

```text
CCR-SIDE
= NO

CONSUMER-SIDE
= NO

CASE-SIDE
= NO
```

### Nature

```text
AUTHORITY GAP
= NO

PUBLIC CONTRACT GAP
= NO

PUBLIC REPRESENTATION GAP
= NO

QUERY / DISCOVERY GAP
= NO

OPERATOR FRICTION
= NO
```

### Contournement

```text
WORKAROUND REQUIRED
= NO

WORKAROUND
= sans objet

WORKAROUND COST
= sans objet
```

### Preuve

- incorrect year example detected by challenger and corrected by author;
- excessive ambiguity claims reduced or withdrawn;
- unsupported attribution that challenger ran `npm test` withdrawn;
- evidence reproducibility objection led to `evidence/spec-evidence.mjs`
  being materialized in the deliverable;
- four native rounds completed;
- neither expert demonstrated a functional defect;
- external control later produced 7/7 visible,
  14/14 holdouts and 21/21 truth-matrix conformity.

### Analyse

Sur ce run, la contradiction native entre `author` et `challenger` a corrigé des défauts
matériels de rapport et de preuve, et n'a produit aucune affirmation de défaut fonctionnel
que la vérité externe ait ensuite infirmée.

### Non-conclusions

```text
ONE SUCCESSFUL RUN
≠ CCR RELIABILITY PROVED
```

L'observation ne dit rien de la reproductibilité du comportement, ni d'un cas plus grand,
ni d'un cas contenant un défaut fonctionnel réel.

### Décision produit

```text
PRODUCT DECISION
= NONE
```

---

## Observation O-002 — L'inventaire machine est limité à l'identité

### Contexte

```text
CASE
= CASE-001

RUN
= CCR-20260904-001

STEP / INTERACTION
= Phase 5 — ccr list --format json
```

### Observation

```text
FRICTION
= public machine inventory exposes run_id only

CONSEQUENCE
= existing run IDs are enumerable, but runs cannot be
  semantically distinguished by title, state, workspace or date

BLOCKING
= NO for basic enumeration
= YES for semantic selection without external context
```

### Attribution

```text
CCR-SIDE
= YES

CONSUMER-SIDE
= NO

CASE-SIDE
= NO
```

### Nature

```text
AUTHORITY GAP
= NO

PUBLIC CONTRACT GAP
= NO

PUBLIC REPRESENTATION GAP
= YES

QUERY / DISCOVERY GAP
= YES

OPERATOR FRICTION
= NO
```

### Contournement

```text
WORKAROUND REQUIRED
= YES for semantic selection
= NO for basic ID discovery

WORKAROUND
= apporter l'identifiant depuis un contexte extérieur aux surfaces publiques

WORKAROUND COST
= le consommateur public-only ne peut pas être autonome pour choisir un run
```

### Preuve

```text
RUN ID DISCOVERY
= YES

SEMANTIC RUN SELECTION
= NO
```

`ccr list --format json` rend un document de deux clés :
`run_inventory_contract_version` et `runs`. Chaque entrée de `runs` porte exactement
un champ, `run_id`. L'entrée cible obtenue est `{ "run_id": "CCR-20260904-001" }`.

Champs absents de l'inventaire :

```text
title
state
workspace
date
```

### Analyse

Les identifiants de run sont directement découvrables : aucun contournement n'est requis
pour l'énumération. En revanche, rien dans l'inventaire ne permet de savoir lequel des
identifiants correspond sémantiquement à CASE-001 ; ce rattachement exige un contexte
extérieur aux surfaces publiques.

### Non-conclusions

```text
DOES NOT ESTABLISH
= incorrect implementation of `ccr list`
```

Le contrat annonce un inventaire d'identités sans état, sans titre et sans diagnostic.
Le comportement observé est celui annoncé.

### Décision produit

```text
PRODUCT DECISION
= NONE
```

---

## Observation O-003 — L'activité ordinaire du run n'est pas reconstructible

### Contexte

```text
CASE
= CASE-001

RUN
= CCR-20260904-001

STEP / INTERACTION
= Phase 5 — ccr invocation-outcomes CCR-20260904-001 --format json
```

### Observation

```text
FRICTION
= invocation-outcomes for CCR-20260904-001 returns facts: []

KNOWN FROM THE EXPERIMENT
= the run actually contained initialization and four native rounds

PUBLIC-ONLY CONSUMER CAN ESTABLISH THAT ACTIVITY
= NO

CONSEQUENCE
= the tested public machine surfaces do not expose:
  - invocation count;
  - ordinary invocation success;
  - invocation order;
  - author/challenger handoffs;
  - round structure;
  - native session activity.

BLOCKING
= YES for machine reconstruction/audit of run activity
```

### Attribution

```text
CCR-SIDE
= YES

CONSUMER-SIDE
= NO

CASE-SIDE
= NO
```

### Nature

```text
AUTHORITY GAP
= NO

PUBLIC CONTRACT GAP
= NO

PUBLIC REPRESENTATION GAP
= YES

QUERY / DISCOVERY GAP
= NO

OPERATOR FRICTION
= NO
```

### Contournement

```text
WORKAROUND REQUIRED
= YES if this information is required

WORKAROUND
= aucune surface publique testée ne la porte ; le contournement sort du mandat
  public-only

WORKAROUND COST
= le consommateur public-only ne peut produire aucun énoncé sur l'activité du run
```

### Preuve

Document public obtenu pour le run cible :

```text
{
  "machine_representation_version": 1,
  "semantic_contract_version": 1,
  "run_id": "CCR-20260904-001",
  "facts": []
}
```

La requête aboutit — exit 0, stderr vide. Le tableau `facts` est vide, donc aucun champ
de fait, aucun slot, aucun rôle, aucun provider, aucun état durable et aucune information
temporelle ou de provenance n'est disponible pour ce run.

### Analyse

Pour ce run, la cardinalité de faits d'issue d'invocation publiquement rendus est nulle.
Un consommateur public-only ne peut donc rien établir de l'activité du run au-delà de son
existence.

Cette cardinalité signifie seulement :

```text
durable invocation outcome facts returned
= 0
```

### Non-conclusions

```text
facts: []
≠ no invocation

facts: []
≠ success

facts: []
≠ failure

DOES NOT ESTABLISH
= that CCR internally lost the activity
```

Le contrat public énonce lui-même que zéro fait est une cardinalité et jamais un verdict.

### Décision produit

```text
PRODUCT DECISION
= NONE
```

---

## Observation O-004 — La chaîne substantielle native est absente de la projection machine testée

### Contexte

```text
CASE
= CASE-001

RUN
= CCR-20260904-001

STEP / INTERACTION
= Phase 5 — ccr list --format json + ccr invocation-outcomes --format json
```

### Observation

La chaîne native réelle contenait notamment :

```text
challenge
concession
correction
new evidence
residual disagreement
```

Les deux surfaces machine testées en Phase 5 ne permettent pas de récupérer :

```text
SUBSTANTIVE CONTROVERSY
REPORT CORRECTIONS
CLAIM / EVIDENCE LINKS
ROUND CONTENT
RECONCILIATION HISTORY
```

```text
FRICTION
= native substantive chain absent from the tested public machine projection

CONSEQUENCE
= un consommateur public-only ne peut reconstruire ni les positions, ni les
  objections, ni les corrections, ni les preuves versées, ni les controverses
  résiduelles

BLOCKING
= YES for a consumer whose purpose is reconstructing
  substantive review history
```

### Attribution

```text
CCR-SIDE
= YES

CONSUMER-SIDE
= NO

CASE-SIDE
= NO
```

### Nature

```text
AUTHORITY GAP
= NO

PUBLIC CONTRACT GAP
= NO

PUBLIC REPRESENTATION GAP
= YES

QUERY / DISCOVERY GAP
= NO

OPERATOR FRICTION
= NO
```

### Contournement

```text
WORKAROUND REQUIRED
= YES if substantive reconstruction is required

WORKAROUND
= hors des deux surfaces publiques testées

WORKAROUND COST
= la reconstruction substantielle sort du mandat public-only
```

### Preuve

Clés de premier niveau effectivement rendues, exhaustives :

```text
list
= { run_inventory_contract_version, runs }

invocation-outcomes
= { machine_representation_version, semantic_contract_version, run_id, facts }
```

Aucun champ de contenu, de position, d'objection, de preuve ou de réconciliation n'existe
dans ces deux schémas. Pour le run cible, `facts` est vide.

### Analyse

```text
ESTABLISHES ONLY
= the tested public machine surfaces do not expose it
```

### Non-conclusions

```text
DOES NOT ESTABLISH
= that CCR internally lost the native dialogue
```

Les deux surfaces publiques ne permettent pas non plus de récupérer :

```text
human ACCEPT
main-work intellectual closure
post-run control evaluation
```

Dans RUN-001, ces trois éléments ont été décidés ou produits hors du run CCR natif et
n'ont pas été persistés dans CCR. Leur absence des surfaces publiques ne constitue donc
pas une lacune CCR :

```text
PUBLIC RECOVERY
= NO

CCR-SIDE GAP
= NOT ESTABLISHED

CONTROL RESULT ABSENCE FROM CCR
= EXPECTED / external to CCR in this experiment
```

### Décision produit

```text
PRODUCT DECISION
= NONE
```

---

## Observation O-005 — La contradiction native a détecté un défaut additionnel accidentel

### Contexte

```text
CASE
= CASE-002

RUN
= CCR-20260905-001

STEP / INTERACTION
= round 1 (author → challenger), puis rounds 2 et 3
```

### Observation

```text
OBSERVATION
= native CCR contradiction detected accidental defect A
  outside the intentionally seeded D1 set

CONSEQUENCE
= the native review produced a demonstrated additional
  functional finding not anticipated by the case designers

FRICTION
= NONE

BLOCKING
= NO
```

```text
D1
= independently detected and repaired as intended

A
= discovered additionally during contradiction
```

### Attribution

```text
CCR-SIDE
= YES

CONSUMER-SIDE
= NO

CASE-SIDE
= YES insofar as the accidental defect existed in the fixture
```

### Nature

```text
AUTHORITY GAP
= NO

PUBLIC CONTRACT GAP
= NO

PUBLIC REPRESENTATION GAP
= NO

QUERY / DISCOVERY GAP
= NO

OPERATOR FRICTION
= NO
```

### Contournement

```text
WORKAROUND REQUIRED
= NO

WORKAROUND
= sans objet

WORKAROUND COST
= sans objet
```

### Preuve

- le jeu de défauts semés volontairement était `D1 only` ;
- `A` — traitement d'une propre clé `__proto__` et dépendance à la chaîne de prototypes — n'a
  été ni semé ni anticipé par la construction du cas ;
- `A` a été soulevé par le challenger au round 1, contesté puis concédé sur sa qualification
  normative par l'author au round 2, et retenu au round 3 ;
- `D1` a par ailleurs été diagnostiqué et réparé comme prévu, avec confirmation ultérieure par
  le control aveugle (6/6 visibles, 14/14 holdouts, 20/20 matrice de vérité).

### Analyse

Sur ce run, la contradiction native n'a pas seulement corrigé le rapport : elle a produit un
constat fonctionnel supplémentaire, réel et démontré à l'intérieur du run, que la conception du
cas n'avait pas prévu.

### Non-conclusions

```text
ONE ADDITIONAL DISCOVERY
≠ GENERAL CCR DEFECT-DETECTION RELIABILITY PROVED
```

L'observation ne dit rien d'un taux de détection, ni de la reproductibilité du phénomène.

### Décision produit

```text
PRODUCT DECISION
= NONE
```

---

## Observation O-006 — La requalification a empêché une remédiation automatique

### Contexte

```text
CASE
= CASE-002

RUN
= CCR-20260905-001

STEP / INTERACTION
= rounds 1 à 3, puis arbitrage humain
```

### Observation

```text
OBSERVATION
= Claim B moved from an asserted functional violation
  to a residual specification ambiguity through contradiction

CONSEQUENCE
= no code change was performed solely to resolve a claim
  whose normative defect status was not established

DECISION-BOUNDARY VALUE
= demonstrated

FALSE POSITIVE
= NOT DEMONSTRATED

FRICTION
= NONE

BLOCKING
= NO
```

```text
BEHAVIORAL DISCONTINUITY
= YES

MANDATORY REMEDIATION
= NOT ESTABLISHED
```

### Attribution

```text
CCR-SIDE
= YES

CONSUMER-SIDE
= NO

CASE-SIDE
= NO
```

### Nature

```text
AUTHORITY GAP
= NO

PUBLIC CONTRACT GAP
= NO

PUBLIC REPRESENTATION GAP
= NO

QUERY / DISCOVERY GAP
= NO

OPERATOR FRICTION
= NO
```

### Contournement

```text
WORKAROUND REQUIRED
= NO

WORKAROUND
= sans objet

WORKAROUND COST
= sans objet
```

### Preuve

- `B` a d'abord été présentée par le challenger comme une violation démontrable de la
  spécification ;
- l'author a concédé le fait comportemental sans réserve, tout en contestant la qualification
  « sans réserve » et en opposant une tension interne entre §5 et §6 ;
- le challenger a explicitement révisé sa position au round 3 : « la qualifier d'ambiguïté à
  signaler est donc raisonnable » ;
- l'arbitrage humain a retenu `residual specification ambiguity` et interdit toute modification
  visant spécifiquement `B` ;
- le candidat final ne contient aucune modification visant `B`, et le control gelé n'établit
  aucune vérité normative sur la configuration concernée.

### Analyse

La contradiction a converti une allégation de défaut en ambiguïté de spécification documentée,
sans produire ni faux positif établi, ni changement de code non justifié.

### Non-conclusions

```text
DEMONSTRATED BEHAVIOR
≠ ESTABLISHED NORMATIVE DEFECT

REQUALIFICATION
≠ PROOF THAT THE BEHAVIOR IS CORRECT
```

La discontinuité comportementale reste démontrée ; seule son qualification normative est restée
indécidée.

### Décision produit

```text
PRODUCT DECISION
= NONE
```

---

## Observation O-007 — La construction indépendante n'a pas garanti un profil de défauts indépendant

### Contexte

```text
CASE
= CASE-002

RUN
= CCR-20260905-001

STEP / INTERACTION
= Phase 4 — révélation du control gelé
```

### Observation

```text
OBSERVATION
= the frozen control was independently constructed before the run
  but did not cover accidental defect A

REFERENCE ENGINE
= contains the same relevant unguarded property-access/write shape
  implicated by A

LAB / CONTROL METHODOLOGY OBSERVATION
= YES

CCR PRODUCT FINDING
= NO

CONSEQUENCE
= aucune vérification par vérité externe aveugle n'est disponible pour A

BLOCKING
= NO pour l'évaluation de D1
= YES pour toute confirmation aveugle de A
```

### Attribution

```text
CCR-SIDE
= NO

CONSUMER-SIDE
= NO

CASE-SIDE
= YES
```

### Nature

```text
AUTHORITY GAP
= NO

PUBLIC CONTRACT GAP
= NO

PUBLIC REPRESENTATION GAP
= NO

QUERY / DISCOVERY GAP
= NO

OPERATOR FRICTION
= NO
```

### Contournement

```text
WORKAROUND REQUIRED
= NO

WORKAROUND
= aucun : l'expansion rétrospective du control est interdite

WORKAROUND COST
= A reste sans confirmation par control aveugle
```

### Preuve

- recherche exhaustive de `__proto__`, `prototype`, `getPrototypeOf`, `defineProperty`,
  `hasOwn` et `Object.create` dans les sept fichiers du control gelé : les seules occurrences
  sont quatre `Object.prototype.hasOwnProperty.call(...)` employés comme helper d'assertion,
  jamais comme sujet de test ;
- aucune clé `__proto__`, aucune pollution de prototype, aucune vérification d'écriture par
  propre clé ni d'indépendance à l'état global dans les holdouts ou les cas visibles ;
- lecture du code de l'oracle, sans exécution : `out[key] = deepCopy(...)`,
  `result[key] = …` et `const previous = result[key]` sans garde de propre clé — la forme même
  que le run a diagnostiquée comme défaut `A`.

### Analyse

L'indépendance structurelle de l'oracle — écrit depuis la sémantique, sans reprendre la
structure du participant — a bien été obtenue, et elle a suffi pour `D1`. Elle n'a pas produit
pour autant un profil de défauts indépendant : les deux implémentations partagent la même
faiblesse structurelle sur `A`, que ni la préqualification ni la matrice de vérité n'ont
exercée.

### Non-conclusions

```text
STRUCTURAL ORACLE INDEPENDENCE
≠ GUARANTEED INDEPENDENT DEFECT PROFILE

CONTROL PREQUALIFICATION
≠ EXHAUSTIVE FULL-SPEC ORACLE PROOF

A NOT COVERED
≠ A FALSE
```

Sur le domaine réellement couvert, rien n'est remis en cause :

```text
D1 CONTROL RESULT
= VALID

FROZEN TRUTH-MATRIX RESULT
= 20/20
```

### Décision produit

```text
PRODUCT DECISION
= NONE
```

---

## Observation O-008 — L'inventaire machine public reste limité à l'identité

### Contexte

```text
CASE
= CASE-002

RUN
= CCR-20260905-001

STEP / INTERACTION
= Phase 5 — ccr list --format json
```

### Observation

```text
OBSERVATION
= `ccr list --format json` exposes run identity only

RUN ID DISCOVERY
= YES

SEMANTIC RUN IDENTIFICATION
= NO

CONSEQUENCE
= a machine consumer can enumerate run IDs but cannot
  identify CASE-002 semantically from title, state,
  workspace or date

BLOCKING
= NO for basic ID enumeration
= YES for semantic selection without external context
```

### Attribution

```text
CCR-SIDE
= YES

CONSUMER-SIDE
= NO

CASE-SIDE
= NO
```

### Nature

```text
AUTHORITY GAP
= NO

PUBLIC CONTRACT GAP
= NOT ESTABLISHED

PUBLIC REPRESENTATION GAP
= YES

QUERY / DISCOVERY GAP
= YES for semantic selection

OPERATOR FRICTION
= NO
```

### Contournement

```text
WORKAROUND REQUIRED
= YES for semantic selection
= NO for basic ID enumeration

WORKAROUND
= apporter l'identifiant depuis un contexte extérieur aux surfaces publiques

WORKAROUND COST
= le consommateur public-only ne peut pas choisir un run de façon autonome
```

### Preuve

- document rendu : `{ run_inventory_contract_version: 1, runs: [ … ] }`, six entrées, chacune
  portant exactement un champ `run_id` ;
- entrée cible : `{ "run_id": "CCR-20260905-001" }` ;
- recherche des champs `title`, `state`, `workspace`, `date`, `created_at`, `cwd` dans l'entrée
  cible : aucun présent.

### Analyse

Les identifiants sont directement énumérables ; aucun contournement n'est requis pour les
découvrir. Rien en revanche ne rattache un identifiant à CASE-002 : ce rattachement exige un
contexte extérieur aux surfaces publiques.

### Non-conclusions

```text
DOES NOT ESTABLISH
= incorrect implementation of `ccr list`
```

### Décision produit

```text
PRODUCT DECISION
= NONE
```

---

## Observation O-009 — Activité native et envois humains absents de la projection machine testée

### Contexte

```text
CASE
= CASE-002

RUN
= CCR-20260905-001

STEP / INTERACTION
= Phase 5 — ccr list --format json + ccr invocation-outcomes --format json
```

### Observation

```text
OBSERVATION
= ordinary native run activity and substantive review history
  are not reconstructible from the tested public machine surfaces

CASE-002 EXTENSION
= the two human `ccr send` interventions are also not recoverable

BLOCKING
= YES for public-only run-activity reconstruction / audit
```

```text
PUBLIC CONSUMER CANNOT RECOVER
= invocation count
= ordinary invocation activity
= round count / handoff chain
= author/challenger activity
= human send activity or target
= D1 history
= A history
= B requalification
= human arbitration
= bounded repair
= bounded Challenger review
= evidence links
```

### Attribution

```text
CCR-SIDE
= YES

CONSUMER-SIDE
= NO

CASE-SIDE
= NO
```

### Nature

```text
AUTHORITY GAP
= NO

PUBLIC CONTRACT GAP
= NOT ESTABLISHED

PUBLIC REPRESENTATION GAP
= YES

QUERY / DISCOVERY GAP
= NO for invocation-outcomes query itself

OPERATOR FRICTION
= NO
```

### Contournement

```text
WORKAROUND REQUIRED
= YES if substantive reconstruction is required

WORKAROUND
= hors des deux surfaces publiques testées

WORKAROUND COST
= la reconstruction substantielle sort du mandat public-only
```

### Preuve

```text
list target
= { "run_id": "CCR-20260905-001" }

invocation-outcomes
= {
    "machine_representation_version": 1,
    "semantic_contract_version": 1,
    "run_id": "CCR-20260905-001",
    "facts": []
  }
```

Recherche littérale, dans ces deux documents, des marqueurs `author`, `challenger`, `claude`,
`codex`, `session`, `round`, `handoff`, `step`, `send`, `state`, `title`, `workspace`, `cwd`,
`date`, `invocation`, `repair`, `arbitration`, `evidence`, `control` : tous absents. Le seul
marqueur positif de la mesure, `at`, ressort par simple sous-chaîne de
`machine_representation_version` et ne porte aucune information.

### Analyse

Sur ce run, les deux surfaces machine testées rendent l'identité et rien d'autre. Les trois
rounds natifs, l'activité des deux experts et les deux interventions humaines par `ccr send`
n'y laissent aucune trace exploitable.

Conséquence de cette observation, à conserver telle quelle :

```text
facts: []
≠ no invocation
≠ no round
≠ no send
≠ success
≠ failure
```

Une cardinalité nulle reste une cardinalité, jamais un verdict.

### Non-conclusions

```text
DOES NOT ESTABLISH
= that CCR internally lost the activity

ESTABLISHES ONLY
= the tested public machine surfaces do not expose it
```

### Décision produit

```text
PRODUCT DECISION
= NONE
```

---

## Observation O-010 — Les surfaces machine publiques ne portent pas la comptabilité opérationnelle d'un run

### Contexte

```text
CASE
= CASE-005

RUN
= CCR-20260908-001

STEP / INTERACTION
= Layer C — consommation publique par AGENT CCR LAB #10,
  puis contrôle de suffisance sur l'ensemble des surfaces publiques
```

### Observation

```text
OBSERVATION
= sur les surfaces machine publiques supportées, huit questions
  opérationnelles d'un run réel restent sans réponse contractuelle

QUESTIONS
= budget d'invocations configuré · maximum configuré
  invocations consommées · invocations restantes
  transfert pendant · fin de production volontaire
  état terminal ou non terminal du run
  coût d'invocation de `ccr start` lui-même

DÉCOUVERTE DU CONTRÔLE DE SUFFISANCE
= `ccr status <run>` AFFICHE six de ces huit réponses,
  mais n'a ni `--format`, ni spécification dans `docs/specs/`,
  ni entrée dans l'énumération des contrats supportés

CONSEQUENCE
= un consommateur public ne peut pas répondre à ces questions
  par une autorité supportée ; l'information est observable,
  elle n'est pas contractuelle

BLOCKING
= NO pour la lecture procédurale du run
= YES pour toute décision opérationnelle sous plafond
```

### Attribution

```text
CCR-SIDE
= YES

CONSUMER-SIDE
= NO

CASE-SIDE
= NO
```

### Nature

```text
AUTHORITY GAP
= YES

PUBLIC CONTRACT GAP
= YES

PUBLIC REPRESENTATION GAP
= YES

QUERY / DISCOVERY GAP
= NO — le run est découvert et lu sans aide

OPERATOR FRICTION
= YES
```

### Contournement

```text
WORKAROUND REQUIRED
= YES

WORKAROUND
= lire `ccr status`, surface humaine non contractuelle

WORKAROUND COST
= le consommateur dépend d'une sortie que rien n'oblige à rester stable ;
  `compatibility.md` § 2.1 énonce qu'un comportement non documenté
  n'est pas un contrat public supporté
```

### Preuve

- retour de Layer C (`AGENT CCR LAB #10`, 2026-09-08) : F1 rend l'identité et le titre,
  F2 rend onze activités durables sous `projection_status = AVAILABLE`, et aucune des deux
  surfaces ne porte budget, invocations, transfert ni état de run ;
- `run-activity-machine.md` § 12 : « ACTIVITÉ ≠ ISSUE D'INVOCATION … les deux contrats ne se
  joignent pas, ne se recoupent pas, et aucun ne se déduit de l'autre » — l'omission est une
  séparation d'autorité déclarée, pas un oubli ;
- inventaire des surfaces publiques supportées au commit `8993cbe` (paquet 1.2.0) : aucune ne
  répond aux huit questions ;
- sortie de `ccr status CCR-20260908-001` montrant quota, transfert et état — sans `--format`.

### Analyse

Le manque est **contractuel**, non informationnel : CCR détient les faits et les affiche déjà à
un humain. Ce qui manque est une autorité machine supportée qui les porte. C'est exactement la
distinction que le produit pose lui-même, et l'observation ne fait que la constater sur un run
réel.

### Non-conclusions

```text
DOES NOT ESTABLISH
= un défaut de CCR
= que F1 ou F2 auraient dû porter ces faits
= qu'une commande nouvelle est nécessaire
```

### Décision produit

```text
PRODUCT DECISION
= HUMAN-SELECTED
```

Cycle de vie, conservé dans son ordre réel :

```text
OBSERVATION                   CASE-005 Layer C · 2026-09-08
CONSÉQUENCE DÉMONTRÉE         contrôle de suffisance · 2026-09-08
DÉCISION HUMAINE              A1..A6 relèvent de l'autorité machine publique
                              + connaissabilité prospective · 2026-09-08
                              Q6 explicitement exclue — P3 reste l'autorité
IMPLÉMENTATION CCR SYSTEM     R1 · R2 · P · 2026-09-08
PUBLICATION                   v1.3.0 · frontière du § 2.2
VALIDATION CONSOMMATEUR       AGENT CCR LAB #11 · v1.4.0 · voir O-011
```

---

## Observation O-011 — L'effet d'invocation prospectif n'était pas connaissable pour les opérations assistées par modèle

### Contexte

```text
CASE
= aucun — usage consommateur réel hors cas numéroté

SESSION
= AGENT CCR LAB #11

RUN
= run réel préexistant, lu en surfaces publiques uniquement

STEP / INTERACTION
= consommation de R1 / R2 / P sur la ligne de base v1.4.0
```

### Observation

```text
OBSERVATION
= la représentation 1 de l'effet d'invocation prospectif ne rend pas
  les trois opérations assistées par modèle — DETECT, PROPOSE, ADDUCE_MODEL

CONSEQUENCE
= un opérateur sous plafond ne peut pas établir, avant d'agir, l'effet
  d'invocation des opérations qui peuvent appeler un fournisseur

BLOCKING
= NO pour les opérations rendues
= YES pour planifier les trois opérations absentes

BLINDNESS
= PARTIAL — l'environnement de la session nommait CCR avant tout geste ;
  aucune de ces mentions n'a servi de preuve
```

### Attribution

```text
CCR-SIDE
= YES

CONSUMER-SIDE
= NO

CASE-SIDE
= NO
```

### Nature

```text
AUTHORITY GAP
= NO — le contrat existe et est supporté

PUBLIC CONTRACT GAP
= NO

PUBLIC REPRESENTATION GAP
= YES — c'est la représentation qui est incomplète, pas le contrat

QUERY / DISCOVERY GAP
= NO

OPERATOR FRICTION
= YES
```

### Contournement

```text
WORKAROUND REQUIRED
= YES

WORKAROUND
= aucun par surface publique ; l'opérateur agit sans connaître l'effet

WORKAROUND COST
= une décision opérationnelle sous plafond se prend sans le fait qui la fonde
```

### Preuve

- retour brut d'`AGENT CCR LAB #11`, journal d'observation horodaté, ligne de base v1.4.0 ;
- `ccr operation-effects --format json` en représentation 1 : six entrées, aucune des trois
  opérations assistées par modèle ;
- R1 et R2 répondent, eux, aux questions testées : l'écart est isolé à cette représentation.

### Analyse

Ajouter une représentation à un contrat déjà supporté n'est pas ajouter un contrat : c'est la
distinction que `compatibility.md` § 3.4.4 pose. L'observation porte donc sur l'axe de
représentation de P, et sur lui seul. Elle vient d'un usage réel des surfaces que l'observation
O-010 avait fait naître — le consommateur n'a pas cherché ce trou, il l'a rencontré.

### Non-conclusions

```text
DOES NOT ESTABLISH
= que la représentation 1 était incorrecte
= que le contrat sémantique de P devait changer
= que cette représentation était prévisible depuis CASE-005
```

### Décision produit

```text
PRODUCT DECISION
= HUMAN-SELECTED
```

Cycle de vie, conservé dans son ordre réel :

```text
OBSERVATION                   AGENT CCR LAB #11 · 2026-09-09
CONSÉQUENCE DÉMONTRÉE         analyse d'écart Q7 · 2026-09-09
DÉCISION HUMAINE              représentation 2 retenue comme cible produit
IMPLÉMENTATION CCR SYSTEM     2026-09-09 · conformité établie
PUBLICATION                   v1.5.0 · frontière du § 2.2, § 3.4.4
VALIDATION CONSOMMATEUR       AGENT CCR LAB #12 · v1.5.0 · voir O-012
```

---

## Observation O-012 — La fermeture de l'écart prospectif est consommable en v1.5.0

### Contexte

```text
CASE
= aucun — validation consommateur fraîche hors cas numéroté

SESSION
= AGENT CCR LAB #12

LIGNE DE BASE
= v1.5.0, canoniquement publiée

STEP / INTERACTION
= validation post-publication, surfaces publiques uniquement
```

### Observation

```text
OBSERVATION
= la frontière de publication de la représentation 2 est vérifiable
  depuis des preuves publiques, et la représentation est consommable

VERDICT
= PASS WITH LIMITATIONS

ÉTABLI
= fermeture, côté consommateur, de l'écart démontré en O-011
= R1 et P utilisables pour la tâche de planification testée
= R2 inchangé pour cette question

NEW PRODUCT GAP
= NONE DEMONSTRATED

BLOCKING
= NO

BLINDNESS
= PARTIAL — même cause qu'en O-011, non employée comme preuve
```

### Attribution

```text
CCR-SIDE
= NO — aucun écart nouveau

CONSUMER-SIDE
= NO

CASE-SIDE
= NO
```

### Nature

```text
AUTHORITY GAP
= NO

PUBLIC CONTRACT GAP
= NO

PUBLIC REPRESENTATION GAP
= NO

QUERY / DISCOVERY GAP
= NO

OPERATOR FRICTION
= NO pour la question testée
```

### Contournement

```text
WORKAROUND REQUIRED
= NO
```

### Preuve

- retour d'`AGENT CCR LAB #12`, sorties publiques reproduites intégralement ;
- vérification mécanique de la frontière : tag annoté, cible directe de type commit, cible
  directe égale à la cible épluchée, présence sur le remote canonique ;
- `src/**`, `tests/**`, journaux de run et rapports antérieurs : non ouverts.

### Analyse

Une publication n'est pas une validation : ce sont deux événements distincts, et c'est cette
session qui établit le second. Les limitations relevées bornent la portée de la validation à la
question testée ; elles ne décrivent aucun écart nouveau.

### Non-conclusions

```text
DOES NOT ESTABLISH
= que toutes les questions opérationnelles sont désormais couvertes
= que R2 a été revalidé pour d'autres questions
= un écart produit nouveau
```

### Décision produit

```text
PRODUCT DECISION
= NONE
```

```text
RERUN
= NO
```

---

## Observation O-013 — Un opérateur réel a mené une tâche à son terme sur les surfaces publiques

### Contexte

```text
CASE
= aucun — usage opérateur réel, ouvert, hors cas numéroté

SESSION
= AGENT CCR LAB #13

LIGNE DE BASE
= v1.5.0

STEP / INTERACTION
= tâche opérationnelle concrète, choisie par l'opérateur,
  sous autorisation humaine explicite et plafond d'invocations natives
```

### Observation

```text
OBSERVATION
= l'opérateur établit la situation du run par les surfaces publiques,
  en déduit le geste justifié, et l'exécute

OPÉRATION NATIVE RÉELLE
= un passage de témoin

STATUT FINAL DE LA TÂCHE
= ACHEVÉE — objectif A

NEW MATERIAL PRODUCT FRICTION
= NONE DEMONSTRATED

BLOCKING
= NO

BLINDNESS
= PARTIAL — injections d'environnement nommant le laboratoire,
  non employées comme preuve
```

### Attribution

```text
CCR-SIDE
= NO — aucune friction matérielle nouvelle

CONSUMER-SIDE
= NO

CASE-SIDE
= NO
```

### Nature

```text
AUTHORITY GAP
= NO

PUBLIC CONTRACT GAP
= NO

PUBLIC REPRESENTATION GAP
= NO

QUERY / DISCOVERY GAP
= NO

OPERATOR FRICTION
= NO pour la tâche conduite
```

### Contournement

```text
WORKAROUND REQUIRED
= NO
```

### Preuve

- retour d'`AGENT CCR LAB #13`, journal chronologique geste par geste, sorties publiques
  reproduites intégralement ;
- l'état du run, le plan de transfert, l'intention de production, la comptabilité d'invocations
  et l'effet prospectif du pas ont tous été lus par surface publique **avant** le geste ;
- une seule invocation native engagée, dans le plafond autorisé.

### Analyse

C'est la première fois qu'un opérateur du laboratoire fonde un geste réel sur les surfaces nées
de O-010 et O-011, et les mène jusqu'à l'exécution sans recourir à un contournement. Le résultat
est une non-friction, et une non-friction est un résultat : la charte prévoit explicitement
qu'une expérience puisse conclure `FRICTION = NONE`.

### Non-conclusions

```text
DOES NOT ESTABLISH
= que toute tâche opérationnelle réussirait de même
= que les surfaces publiques sont complètes
= une conclusion sur le travail substantiel produit dans le run
```

### Décision produit

```text
PRODUCT DECISION
= NONE
```

```text
RERUN
= NO
```

Le run employé conserve un reliquat non consommé. Il n'est pas rejoué, et il n'est pas consulté
pour compléter ce document.

---

## Observation O-014 — L'état du programme a dépassé l'état durable du dépôt

### Contexte

```text
CASE
= aucun — phénomène de conduite de programme

SESSION
= plusieurs, sur quatre jours

STEP / INTERACTION
= reprise du laboratoire après la séquence de maintenance CCR System
```

### Observation

```text
OBSERVATION
= l'état réellement atteint par le programme a avancé pendant que l'état
  durable du dépôt restait à son point de départ

FAIT MESURÉ
= CASE-005 a été produit, évalué et clos le 2026-09-08 ;
  les documents du dépôt le décrivaient encore comme non exécuté
  jusqu'au 2026-09-12

CONSEQUENCE DÉMONTRÉE
= une reprise conduite de bonne foi sur le seul état durable a produit
  un commit affirmant un état faux, et lui a attaché un instrument
  postérieur de trois jours à l'expérience

SECOND FAIT
= le statut produit de P3 est resté « décision humaine en attente » dans
  les documents de CASE-004 alors que la réponse produit existait déjà
  dans une version publiée

TROISIÈME FAIT
= le registre d'observations s'était arrêté à CASE-002, alors que les
  frictions de CASE-005 avaient produit trois contrats publics supportés
  et une représentation machine

BLOCKING
= NO pour la production
= YES pour toute reprise fondée sur le seul état durable
```

### Attribution

```text
CCR-SIDE
= NO

CONSUMER-SIDE
= YES — conduite du laboratoire

CASE-SIDE
= NO
```

Le phénomène porte sur la persistance de l'état de programme côté consommateur. CCR était
l'objet du travail, il n'en est pas la cause : rien ici ne s'attribue à CCR au motif qu'il était
utilisé.

### Nature

```text
AUTHORITY GAP
= NO

PUBLIC CONTRACT GAP
= NO

PUBLIC REPRESENTATION GAP
= NO

QUERY / DISCOVERY GAP
= NO

OPERATOR FRICTION
= YES — côté conduite, pas côté produit
```

### Contournement

```text
WORKAROUND REQUIRED
= YES

WORKAROUND
= reconstruction de l'état réel à partir des traces opérationnelles
  et des artefacts d'exécution conservés

WORKAROUND COST
= une reprise erronée, puis une réécriture de l'historique courant
  autorisée par l'humain pour la corriger
```

### Preuve

- artefacts d'exécution du 2026-09-08 conservés et revérifiés : les deux candidats se
  recalculent aux empreintes enregistrées, les résultats par ligne sont intacts ;
- le dépôt ne portait aucune trace de cette exécution avant le 2026-09-12 ;
- le commit de reprise erroné, puis son remplacement, sont tous deux des faits Git.

### Analyse

L'énoncé démontré est étroit et se suffit :

```text
l'état du programme peut avancer au-delà de l'état durable du dépôt
```

Là où une trace opérationnelle a été reprise immédiatement, la conséquence s'est propagée sans
perte. Là où elle ne l'a pas été, l'état durable a divergé. C'est une observation sur la
conduite du programme, mesurée sur son propre historique.

### Non-conclusions

```text
DOES NOT ESTABLISH
= un défaut de CCR System
= une exigence logicielle
= le choix d'un composant à construire
= que le routage des sessions ou des projets soit en cause
```

### Décision produit

```text
PRODUCT DECISION
= NONE
```

```text
COMPOSANT LOGICIEL SÉLECTIONNÉ
= AUCUN
```

Conformément à la règle de décision du protocole, une observation ne produit pas d'elle-même
une décision. Le choix d'une suite appartient à l'autorité humaine.
