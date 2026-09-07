# CASE-003 — RUN-001 Record

Document mutable, destiné à recevoir les faits du run. Rien n'est prérempli.

```text
CASE EXECUTION
= RUN CONDUIT — candidat CCR produit et gelé

CCR RUN
= STOPPED sur une stop condition réelle

STOP CONDITION
= CCR_INVOCATION_QUOTA_EXCEEDED — 24/24

TERMINAISON NATURELLE
= NON ATTEINTE
```

Le run n'a pas convergé de lui-même : il a été coupé par le budget
d'invocations, alors qu'un transfert restait en attente et que les deux experts
produisaient encore des constats fondés. Ce fait est central pour lire ce
record, et il n'est pas une réussite déguisée.

## Identité

```text
CCR RUN ID          = CCR-20260907-001
DATE                = 2026-09-07 (start 2026-09-07T00:04Z environ)
CCR VERSION         = 1.1.0
CCR HEAD            = c9de52b223ee13e79863e9747f08e88938d59579
TITLE               = CASE-003 / RUN-001 — Task Planner Dependency Extension
WORKSPACE           = <TMP>/98d193fd-0743-471c-bfc4-540f26adf477/scratchpad/case003-e1/B
GÉNÉRATION          = NATIVE_V21_EXECUTION
AUTHOR              = rôle author      / fournisseur Claude
                      session native 2f0f8073-859a-4a6f-ae94-d7fa28d69e45
CHALLENGER          = rôle challenger  / fournisseur Codex
                      session native 01a07932-e5a5-7b53-9d56-4d4036d13742
MAX INVOCATIONS     = 24
AUTORITÉ            = décision humaine explicite de runtime (2026-09-07)
```

```text
RECORDED RUN_ID
= QUARANTINED FROM FUTURE F1 SELECTION
```

Le futur Layer C doit découvrir ce run par la surface F1, jamais en lisant ce
champ.

### Déviation délibérée au runbook gelé

```text
FROZEN RUNBOOK §5                = --max-invocations omitted
HUMAN RUNTIME DECISION           = use --max-invocations 24
MAX INVOCATIONS                  = 24

CLASSIFICATION
= explicit runtime override of frozen RUNBOOK omission

AUTHORITY
= explicit human runtime decision

RUNBOOK MODIFICATION             = FORBIDDEN — non effectuée
REFREEZE                         = NOT REQUIRED
```

Le runbook est gelé et n'a pas été touché. L'écart est porté par la décision de
runtime, pas par une réécriture du protocole.

**Conséquence observée, et non anticipée par la décision :** le plafond de 24 a
effectivement mordu. Le runbook prescrivait l'omission ; l'override l'a remplacé
par une limite qui s'est révélée inférieure à ce que le run demandait. La
terminaison est un effet du budget, pas de la contradiction entre experts.

## Historique du gate d'authentification

Le fait n'est pas effacé : la première tentative a été refusée.

```text
PREVIOUS CCR START ATTEMPT   = rejected before run allocation
PREVIOUS RUN ID              = NONE
PREVIOUS MODEL INVOCATIONS   = 0
CCR BRANCH GATE              = previously stopped on CLAUDE_AUTH_REQUIRED
EXECUTION ERROR              = NONE
```

Sonde CCR d'alors : `claude auth status` → `{"loggedIn": false,
"authMethod": "none"}`, exit 0 → `UNAUTHENTICATED` → `[CLAUDE_AUTH_REQUIRED]`
BLOCKER, `AUTH_REQUIRED` produit **avant allocation**. Une reprise ultérieure a
resondé sans présumer, et le gate était encore fermé : aucun second `start` n'a
été lancé à ce moment.

Le gate a ensuite été levé par l'humain. Contrôle non secret uniquement — aucun
jeton, aucune donnée d'identification, aucun matériel OAuth n'a été lu ni
affiché :

```text
claude auth status  → { "loggedIn": true, "authMethod": "claude.ai",
                        "apiProvider": "firstParty" }
ccr doctor          → Claude Code 2.1.263 authentifié
                      Codex 0.146.0 authentifié
                      Statut : READY

CLAUDE AUTH
= ESTABLISHED
```

## Ancre git du Lab

```text
BRANCH        = main
HEAD          = a58e9cd1b43c26e9a3a8dc16330f0bf3e41eda71
PARENT        = 8426177d4f1d9b4f3dffd5309fad4f28d4065a36
COMMIT COUNT  = 2
WORKTREE      = RUN-001-RECORD.md seul
```

## Provenance de CCR System

Établie intégralement par la session opératrice, niveau par niveau, selon
`RUNBOOK.md` §3, avant le premier `ccr start` du cas. Les cinq invariants de
provenance ont été revérifiés avant le run effectif et sont restés inchangés :
l'établissement est **conservé**, non rejoué.

```text
CCR_SYSTEM_REPO
= E:\prog\ccr-system
```

### A — dépôt canonique

```text
rev-parse --show-toplevel   = E:/prog/ccr-system
rev-parse HEAD              = c9de52b223ee13e79863e9747f08e88938d59579
status --porcelain          = vide
package.json name / version = ccr-system / 1.1.0

A = ÉTABLI
```

Un second `bin/ccr.mjs` existe sur la machine (`E:\prog\l-atelier-photo-ccr`) :
paquet `ccr` 0.1.0, hors versionnement git. Ce n'est pas le dépôt canonique, et
il n'a pas été employé. Aucun `ccr` n'est résolvable par le `PATH`.

### B — point d'entrée exécuté

```text
invocation                 = node E:\prog\ccr-system\bin\ccr.mjs <commande>
                             chemin absolu, jamais un shim de PATH
rev-parse HEAD:bin/ccr.mjs = 224f99839ccf578ef866132c7b59e2f5c9e47143
hash-object worktree       = 224f99839ccf578ef866132c7b59e2f5c9e47143
                             (revérifié avant le run effectif — identique)

B = ÉTABLI
```

### C — chaîne de chargement

Classification autoritative par inspection du graphe **réellement atteint** : le
résolveur de modules ESM de Node a été instrumenté en lecture seule — hook
`resolve` / `load` passif, sans transformation.

```text
ÉVÉNEMENTS DE RÉSOLUTION RELEVÉS   = 848
MODULES DISTINCTS CHARGÉS          = 156

  146   E:\prog\ccr-system\src\**   fichiers suivis du dépôt canonique
    1   E:\prog\ccr-system\bin\ccr.mjs
    9   modules natifs node:
        child_process · crypto · fs · fs/promises · http · os · path
        readline/promises · url

ARTEFACT CHARGÉ DEPUIS node_modules/  = 0
ARTEFACT CHARGÉ HORS DÉPÔT CANONIQUE  = 0

C = ESTABLISHED
```

Appuis de diagnostic, non normatifs et concordants :

```text
import dynamique import() dans src+bin @HEAD   = aucun
import non relatif et non node: dans src+bin   = 1 seul
    src/cockpit/web/app.js → '/assets/vendor/marked.esm.js'
dist/ · build/ · out/ · lib/                    = absents
```

L'unique import non relatif est un asset **navigateur**, servi statiquement par
le cockpit. Il n'appartient pas au graphe Node, et le relevé le confirme :
`src/cockpit/web/app.js` n'a jamais été chargé.

```text
ccr cockpit
= JAMAIS LANCÉ — exclusion tenue de fait, et pas seulement d'intention
```

### D — provenance des artefacts chargés

Intégrité de **chacun** des 147 fichiers canoniques chargés, comparée à son blob
sous `c9de52b` :

```text
identiques octet pour octet          = 134
identiques après normalisation EOL   =  13
différences de contenu               =   0
fichiers non suivis à HEAD           =   0
```

Les 13 écarts d'octets sont imputables à la copie de travail : `core.autocrlf =
true` au niveau système a produit un CRLF local là où le blob porte LF.
`git diff c9de52b -- src` est vide. Aucun écart de code.

```text
dist/ généré et ignoré               = absent
sortie générée non suivie chargée    = aucune
autre checkout ou worktree           = aucun
shim de PATH                         = aucun
paquet installé globalement          = aucun
artefact d'exécution mutable externe = aucun

D = ÉTABLI
```

`git status` propre prouve l'état du contenu **suivi**, et rien de plus. Les
répertoires ignorés du dépôt canonique — `.ccr/` et
`examples/cache-showcase/observations/generated/` — ont été vérifiés comme non
chargés par le graphe.

```text
CCR SYSTEM IMPLEMENTATION RUNTIME PROVENANCE       = ESTABLISHED
```

## Provenance des fournisseurs

Fait expérimental séparé, consigné selon ce qui est réellement disponible.

```text
PROVIDER ≠ CCR SYSTEM RUNTIME
```

Les fournisseurs ne sont pas des artefacts de CCR System : `claude-adapter.ts`
et `codex-adapter.ts` résolvent un exécutable externe et le lancent comme
**processus système distinct** (`node:child_process`). Aucune implémentation de
fournisseur n'entre dans le graphe de modules de CCR.

```text
author     exécutable = C:\Users\TribS\.local\bin\claude.exe
           version    = 2.1.263 (Claude Code)   au moment du run
           relevé le  = 2026-09-07T00:03:50Z

challenger exécutable = C:\nvm4w\nodejs\codex
           version    = codex-cli 0.146.0
           relevé le  = 2026-09-07T00:03:50Z

runtime    node       = v22.18.0 — C:\nvm4w\nodejs\node.exe
```

Fait consigné, non lissé : la CLI du fournisseur author était en **2.1.224** au
premier relevé et en **2.1.263** au moment du run — l'authentification a
entraîné une mise à jour. Cela ne touche pas la provenance produit de CCR
System, qui est une question distincte (`RUNBOOK.md` §4).

```text
PROVIDER ≠ ROLE
PROVIDER ≠ SEMANTIC ORIGIN

PROVIDER SEMANTIC ORIGIN
= UNKNOWN
```

Le modèle réellement servi derrière chaque CLI n'est pas observable depuis les
surfaces employées. CCR rapporte 24 usages fournisseur observés, sans catalogue
tarifaire : 24 coûts inconnus, 0 estimé. Rien n'est supposé.

## Vérification du gel avant lancement

Empreintes SHA-256 comparées octet pour octet entre le commit d'ancrage
`a58e9cd` et le Workspace B, avant le run.

```text
PARTICIPANT FREEZE MATCH   = PASS — 10 / 10 fichiers identiques

  MISSION.md               c477ddc7850f9785da7bfe3bd552665850745c3f828b399a791e29f2691bd1c2
  SPEC.md                  9fcd7f451079c79afbeab60edccadc0155bdfa5cfa3bcb267b017431948334f9
  package.json             c19b613488dac13cf3c8f716c4a4225bd11317b90cf03cab4060e1f829796a38
  package-lock.json        7678b9163ce2391000ced099ac69a48105f80a045e44f4da2dc21ef55ca54c2f
  tsconfig.json            2620de0118c3b78ec1f289d6e9362ec690fb985c24f296167f4bb75ab784b731
  consumer-v1.ts           b4306dcbac3c38e6f836b5823a187d580a303956e2029c37614e1d85c57a7daf
  tests/visible.test.mjs   2a5a389dc963c6e459721cc86dfb776cae84d4c44efd9c081ed47840c4c707a7
  src/task-planner.ts      6546f8f5b115c3815c7e112637b819b1ad37d5f6911b858c3962cf7fc06dac8e
  src/ordering.ts          ffe63b902c76aa64e57a67cd58cefe18da610181edfbb305fa4a80724a936580
  src/validation.ts        a5f81cfc5b722fbcbc8c92b4c3ce3e977599311a91d3362ee910e5336514b9a5

control/ dans le workspace = ABSENT — balayage sans résultat
                             control/ · TRUTH-MATRIX.md · holdouts
                             reference-planner · matériel d'évaluation privé
package-lock.json inchangé = OUI
node_modules               = typescript, et rien d'autre
```

```text
COMPILER USED FOR EXPERIMENTAL TRUTH = TypeScript local du lockfile gelé
node node_modules/typescript/bin/tsc --version = Version 5.8.3
OPPORTUNISTIC PACKAGE DOWNLOAD = NO
```

Le gabarit de ce record mentionnait `npx tsc --version` ; `RUNBOOK.md` §2
proscrit `npx`. Le relevé emploie le compilateur local.

## Chronologie

```text
 1  Gate d'identité de session                        PASS
 2  Préflight git du Lab                              PASS
 3  Vérification du gel, Workspace B                  PASS
 4  Toolchain — TypeScript 5.8.3                      PASS
 5  Provenance CCR System A / B / C / D               ESTABLISHED
 6  Provenance fournisseurs                           consignée
 7  Découverte des runs (surface publique)            aucun CASE-003
 8  ccr start                                         REFUSÉ — AUTH_REQUIRED
                                                      aucun run créé
 9  ccr doctor                                        BLOCKED
10  Gate humain déclaré                               STOP
--- décision humaine sur le budget d'invocations : 24 ---
11  Préflight minimal de reprise                      invariants inchangés
12  Contrôle d'authentification                       NOT ESTABLISHED
13  ccr start retry                                   NON LANCÉ — FORBIDDEN
14  Gate humain maintenu                              STOP
--- authentification effectuée par l'humain ---
15  Préflight minimal                                 PASS sur les 5 invariants
16  A/B/C/D conservés, pas de nouvel audit            NOT REQUIRED
17  ccr start --max-invocations 24                    RUN CRÉÉ CCR-20260907-001
                                                      2 invocations, état READY
18  ccr step × 22                                     tous exit 0, rounds 1..22
19  ccr step (23e)                                    REFUSÉ
                                                      CCR_INVOCATION_QUOTA_EXCEEDED
20  Gel du candidat CCR                               FROZEN
21  Identité déterministe du candidat                 calculée
```

## Déroulement du run

```text
ROUNDS NATIFS           = 22
NATIVE INVOCATIONS USED = 24 / 24   (2 à la création + 22 passages de témoin)
ccr step                = 22 réussis, le 23e refusé par la politique de quota
ccr send                = 0
HUMAN SEND              = 0
handoff interactif      = 0 (HANDOFF_NOT_ALLOWED tout du long)
pause / resume          = 0
reprises                = initialisation NONE · transfert NONE
                          envoi NONE · handoff NONE
invocation-outcomes     = facts: []  — aucune issue négative terminale
usage fournisseur       = 24 observées / 0 non observées
```

Aucune intervention humaine de contenu n'a eu lieu, et aucune n'a été simulée.

### État terminal procédural

```text
ÉTAT CCR       = READY / AUTOMATION, round 22, curseur author
TRANSFERT      = author → challenger EN ATTENTE
                 source evt_000094, round 23, 6438 octets
QUOTA          = 24/24 ÉPUISÉ, restant 0

CCR PROCEDURAL TERMINAL STATE
= arrêt sur stop condition réelle CCR_INVOCATION_QUOTA_EXCEEDED
≠ terminaison naturelle
≠ convergence des experts
```

Le run était encore productif au moment de la coupure. Au round 22, l'auteur
concédait trois objections nouvelles, en réécrivait le code et le commentaire,
et laissait deux questions explicitement ouvertes relevant de l'humain. Le
challenger n'a jamais reçu ce dernier passage.

## Candidat gelé

```text
CCR CANDIDATE
= FROZEN

FURTHER src/** MODIFICATION
= FORBIDDEN
```

### Vérification du gel après run

```text
FROZEN NON-SOURCE PARTICIPANT INPUTS = unchanged — 7 / 7 byte-identiques
  MISSION.md · SPEC.md · package.json · package-lock.json
  tsconfig.json · consumer-v1.ts · tests/visible.test.mjs

CHANGES OUTSIDE src/**               = 0
FICHIERS GELÉS MODIFIÉS              = AUCUN
DÉVIATION DE PROTOCOLE               = AUCUNE
```

Le contenu complet de Workspace B hors `node_modules/` est exactement : les
7 inputs gelés inchangés, plus 4 fichiers `src/**`. Aucun artefact de sonde, de
build ou de journal n'y subsiste.

### Chemins modifiés

```text
src/dependency-planner.ts   AJOUTÉ    5022 octets
src/task-planner.ts         inchangé  identique au pack gelé
src/ordering.ts             inchangé  identique au pack gelé
src/validation.ts           inchangé  identique au pack gelé
```

Le candidat est purement additif : l'extension a été livrée sans toucher une
ligne des trois modules de départ.

### Identité déterministe

Empreintes SHA-256 des octets exacts, tri déterministe par chemin relatif.

```text
CCR CANDIDATE SOURCE FILE COUNT = 4

6bacf1796f24786577a8581145727ee13a6afad9854baba8c5437189ff21706b  src/dependency-planner.ts
ffe63b902c76aa64e57a67cd58cefe18da610181edfbb305fa4a80724a936580  src/ordering.ts
6546f8f5b115c3815c7e112637b819b1ad37d5f6911b858c3962cf7fc06dac8e  src/task-planner.ts
a5f81cfc5b722fbcbc8c92b4c3ce3e977599311a91d3362ee910e5336514b9a5  src/validation.ts
```

Identité agrégée, construite depuis `<sha256><deux espaces><chemin>\n`, UTF-8,
LF :

```text
CCR CANDIDATE IDENTITY
= 9615f52c679bd5837bca75ad83e135abed329fd8c26b7f65d1a8965341d149ec

CANDIDATE IDENTITY
≠ CORRECTNESS
```

## Sondes autonomes du run

```text
SELF-AUTHORED CCR PROBE
≠ LAB HOLDOUT
≠ OFFICIAL TRUTH
```

Les deux experts ont écrit leurs propres sondes dérivées de `SPEC.md`. Ce que le
run **rapporte de lui-même**, au round 22 — énoncé du participant, non vérifié
par l'opérateur et sans valeur de score :

```text
typecheck                exit 0
contrôles visibles       9 / 9
sondes SPEC de l'auteur  47 / 47   (42 + 5 de réentrance)
sonde de types           4 / 4
```

Le challenger déclarait de son côté, au round 1, 9/9 contrôles visibles et 9/9
sondes propres avec TypeScript 5.8.3.

```text
STATUT DE CES CHIFFRES
= comportement rapporté à l'intérieur du run
≠ mesure de l'opérateur
≠ vérité officielle
```

L'opérateur n'a exécuté ni les contrôles visibles, ni le typecheck, ni aucune
sonde : ce n'est pas son mandat, et une mesure faite ici anticiperait
l'évaluation.

### Objection de protocole soulevée dans le run

Au round 1, le challenger a signalé que l'auteur disait avoir écrit des sondes
« hors du workspace », ce qui serait une déviation possible. Vérification de
l'opérateur, après gel :

```text
fichiers gelés modifiés          = AUCUN
changements hors src/**          = 0
artefacts résiduels dans B       = AUCUN
```

Aucune déviation n'est constatable dans l'état final de Workspace B. Ce que
l'auteur a pu écrire hors du workspace n'est pas observable depuis ici, et n'est
donc pas affirmé dans un sens ni dans l'autre.

## Questions laissées ouvertes par le run

L'auteur les a explicitement renvoyées à l'humain plutôt que de les trancher.
Elles sont consignées telles quelles, sans arbitrage de l'opérateur :

```text
1  TaskPlanner.add lirait task.id quatre fois et désynchroniserait ses deux
   registres sous accesseur instable — violation supposée de SPEC.md §1.2 par
   le fichier du fixture lui-même. MISSION.md affirme qu'aucun défaut n'a été
   semé. L'auteur n'a rien remanié sans accord.

2  SPEC.md §5 « ambiguïtés connues = aucune » ne tiendrait pas : la stabilité,
   l'innocuité et la non-réentrance des accesseurs seraient des hypothèses non
   écrites, dont dépendent la v1 comme l'extension. Seul point sur lequel les
   deux experts convergeaient depuis quatre rounds.
```

```text
STATUT
= énoncés du run, non arbitrés
≠ constat du Lab
≠ défaut établi
```

Aucun `ccr send` n'a été employé pour y répondre.

## Révélation du control

```text
VISIBLE        = NON RÉVÉLÉ par l'opérateur
HOLDOUTS       = NON OUVERTS — 0 exécution
TRUTH MATRIX   = NON OUVERTE  — 0 usage
AXE A          = —
AXE B          = —
V10            = —

REFERENCE ORACLE CANDIDATE JUDGMENT = 0
POST-RUN F1         = NOT STARTED
F2                  = NOT STARTED
SOFTWARE EVALUATION = NOT STARTED
```

Le gel du candidat a précédé toute lecture de `control/`, et `control/` n'a pas
été lu. Aucun holdout n'a servi à décider si le run devait continuer.

## Observations CCR

```text
CCR PROCEDURAL COMPLETION   ≠ SOFTWARE SUCCESS
CONSENSUS                   ≠ TRUTH
RECORDED / WRITTEN          ≠ SUCCESS
```

Trois observations de produit, toutes procédurales.

**Le quota a fait exactement ce qu'il annonce, et rien de plus.** Le 23e passage
a été refusé avant toute sollicitation d'agent — « Aucun agent n'est sollicité »
—, avec limite, consommé et restant explicites. Le run n'est pas laissé dans un
état ambigu : il reste `READY`, son transfert en attente est nommé, et son quota
est marqué `ÉPUISÉ`. Un arrêt budgétaire n'est pas déguisé en fin de travail.

**Aucune issue négative n'a été enregistrée sur 24 invocations.**
`invocation-outcomes` rend `facts: []`, et les 24 usages fournisseur sont
observés. La chaîne a tenu 22 passages de témoin entre deux fournisseurs
distincts sans reprise d'initialisation, de transfert, d'envoi ni de handoff.

**La contradiction a produit du mouvement jusqu'au dernier round.** L'auteur
rapporte 37 constats du challenger, tous jugés fondés, dont trois ont atteint le
livrable — chacun découvert en corrigeant le précédent. Le dernier round n'était
pas une redite : il refermait une objection en en démontrant une autre
irréductible. Rien dans le déroulé ne suggère que le run s'épuisait.

Ce que ce record **ne dit pas** : si le candidat est correct. Aucune mesure
d'évaluation n'a été faite ici, et les chiffres cités plus haut sont ceux que le
run énonce sur lui-même.

```text
BASELINE SUBSTANTIVE INFORMATION USED
= NO
```

Aucune information du bras baseline — source, diff, résultats de tests ou de
typecheck, sondes, raisonnement, empreintes, chemins modifiés — n'a été
demandée, reçue ni employée, ni par la session opératrice, ni par le run.
Workspace A n'a jamais été ouvert. `BASELINE-RECORD.md` n'a pas été ouvert.
