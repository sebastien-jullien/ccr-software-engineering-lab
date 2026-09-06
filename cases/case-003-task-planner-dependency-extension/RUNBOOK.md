# CASE-003 — Runbook

Protocole opérateur du cas. Gelé au même titre que les paquets : après le gel,
il ne change plus.

## 1. Portée

```text
FORME
= extension de capacité rétrocompatible, sur une base saine

DÉFAUT SEMÉ
= AUCUN

CCR SYSTEM
= dépendance externe et sujet d'observation
= jamais modifié, jamais corrigé, jamais contourné
```

## 2. Workspaces jetables

Tout run se conduit dans un workspace frais, isolé, **hors du dépôt du Lab**,
créé à partir du seul pack `participant/`.

```text
control/ dans le workspace de run
= ABSENT — vérifié avant lancement

empreintes du gel
= vérifiées avant lancement, contre FREEZE-MANIFEST.md

npm ci
= depuis le lockfile gelé

package-lock.json après npm ci
= inchangé — vérifié
```

Ni les workspaces, ni les candidats gelés, ni les copies d'évaluation n'entrent
dans le dépôt. Seuls les records les décrivent.

### Compilateur de vérité TypeScript

TypeScript est ici une source de vérité expérimentale, pas un simple outil. La
mesure emploie explicitement le compilateur installé par le lockfile gelé, jamais
une résolution susceptible de télécharger un paquet absent.

```text
COMPILER USED FOR EXPERIMENTAL TRUTH
= local participant-lockfile TypeScript

VERSION
= 5.8.3

OPPORTUNISTIC PACKAGE DOWNLOAD
= NO
```

```bash
node node_modules/typescript/bin/tsc --version
node node_modules/typescript/bin/tsc --noEmit
```

`npm run typecheck` est équivalent : npm résout `tsc` depuis `node_modules/.bin`,
donc le même compilateur local et gelé. `npx tsc` ne l'est pas, et n'est employé
nulle part dans ce runbook.

## 3. Préflight — provenance d'exécution de l'implémentation CCR System

Quatre niveaux distincts, établis séparément. Aucun ne se déduit d'un autre.

### Symbole de chemin

Ce runbook est un protocole portable : il ne contient aucun chemin machine-local.

```text
CCR_SYSTEM_REPO
= runtime-resolved absolute path to the canonical CCR System checkout
= value established by provenance gate A before any CCR invocation
```

`<CCR_SYSTEM_REPO>` est une notation de protocole, jamais une commande à exécuter
littéralement. Le chemin absolu réellement résolu au moment du run est consigné
dans `RUN-001-RECORD.md` comme fait machine-local observé.

```text
FROZEN PORTABLE PROTOCOL
≠ MACHINE-LOCAL EXECUTION RECORD
```

### A — dépôt canonique

```bash
git -C <CCR_SYSTEM_REPO> rev-parse --show-toplevel
git -C <CCR_SYSTEM_REPO> rev-parse HEAD
git -C <CCR_SYSTEM_REPO> status --porcelain
```

```text
attendu : racine = <CCR_SYSTEM_REPO>
attendu : HEAD   = c9de52b223ee13e79863e9747f08e88938d59579
attendu : status = vide
```

### B — point d'entrée exécuté

Invocation unique et absolue, jamais un shim résolu par le `PATH` :

```bash
node <CCR_SYSTEM_REPO>/bin/ccr.mjs <commande>
```

```bash
git -C <CCR_SYSTEM_REPO> rev-parse HEAD:bin/ccr.mjs
git -C <CCR_SYSTEM_REPO> hash-object <CCR_SYSTEM_REPO>/bin/ccr.mjs
```

Les deux identifiants de blob doivent être identiques.

### C — chaîne de chargement de l'implémentation CCR

Classification **autoritative** : inspection lecture seule du point d'entrée
canonique, du graphe d'imports qu'il atteint réellement, et des artefacts
d'exécution que ce graphe met en jeu.

```text
STATIC GREP / REGEX
= appui de diagnostic uniquement
≠ preuve normative exhaustive
```

Les balayages ci-dessous orientent l'inspection et signalent une dérive ; ils ne
la remplacent pas, et aucun d'eux n'est présenté comme une démonstration
complète.

```bash
git -C <CCR_SYSTEM_REPO> grep -nE "from '[^.'][^']*'" HEAD -- src bin | grep -v "from 'node:"
git -C <CCR_SYSTEM_REPO> grep -n "import(" HEAD -- src bin
ls <CCR_SYSTEM_REPO>/dist <CCR_SYSTEM_REPO>/build <CCR_SYSTEM_REPO>/out <CCR_SYSTEM_REPO>/lib
```

```text
RUNTIME LOAD CHAIN
= ESTABLISHED   si l'inspection conclut que le graphe atteint depuis
                bin/ccr.mjs pour les commandes du cas ne charge que des
                fichiers suivis du dépôt canonique et des modules natifs node:
= UNCERTAIN     dans tout autre cas
```

Exclusion de portée à tenir pendant tout le cas :

```text
ccr cockpit
= JAMAIS LANCÉ
```

Le cockpit est le seul chemin connu qui met en jeu un artefact de
`node_modules/`, servi comme fichier statique. Les commandes du cas ne
l'empruntent pas, et cette exclusion doit rester vraie de fait, pas seulement
d'intention.

### D — provenance des artefacts CCR réellement chargés

Si et seulement si C conclut `ESTABLISHED`, les fichiers chargés sont des
fichiers suivis du dépôt canonique, et l'association A + B les couvre.

Vérification explicite qu'aucun élément pertinent ne provient de :

```text
un dist/ généré et ignoré
une sortie générée non suivie
un autre checkout ou worktree
un shim de PATH
un paquet installé globalement
un artefact d'exécution mutable externe
```

Discipline à tenir, sans raccourci :

```text
git status clean
= preuve forte sur le contenu SUIVI du worktree
≠ preuve sur les fichiers ignorés ou générés qui pourraient être chargés
```

### Règle de sortie

```text
A établi + B établi + C ESTABLISHED
→ CCR SYSTEM IMPLEMENTATION RUNTIME PROVENANCE = ESTABLISHED
→ CCR RUN autorisé

A établi + B établi + C UNCERTAIN
→ SOURCE ↔ ENTRYPOINT ASSOCIATION      = established
→ CCR SYSTEM IMPLEMENTATION RUNTIME PROVENANCE = UNCERTAIN
→ CCR RUN = STOP

artefact chargé hors du dépôt canonique et non couvert par A + B
→ provenance à établir séparément et à consigner
→ à défaut : CCR RUN = STOP
```

Aucun patch produit, aucun contournement, aucune relaxation du protocole.
Toutes les commandes CCR du run consignent leur chemin absolu exact dans
`RUN-001-RECORD.md`.

## 4. CCR System et fournisseurs sont deux questions distinctes

```text
CCR SYSTEM IMPLEMENTATION RUNTIME PROVENANCE
= question de provenance produit
= couverte par §3

PROVIDER EXECUTABLE / VERSION PROVENANCE
= fait expérimental séparé
= consigné selon les faits réellement disponibles

PROVIDER
≠ CCR SYSTEM RUNTIME
```

Les fournisseurs externes ne sont pas des artefacts de CCR System. Une provenance
fournisseur imparfaitement disponible se consigne comme telle. Elle ne vaut pas
défaut de provenance produit, et ne doit pas être assimilée silencieusement à
`C = UNCERTAIN`.

Ce qui est relevé pour chaque fournisseur, au mieux de ce qui est disponible :

```text
chemin absolu de l'exécutable
version rapportée
horodatage du relevé
```

## 5. Run CCR

```text
AUTHOR      = claude
CHALLENGER  = codex
--max-invocations = omis
```

Le run commence au premier `ccr start` du cas. Les interventions humaines de
contenu passent exclusivement par `ccr send`, jamais par une session fournisseur
manuelle ni par un appel direct à un CLI fournisseur.

## 6. Gel du candidat

Le candidat est gelé **avant** toute lecture de `control/`.

```text
GEL DU CANDIDAT
→ puis seulement : révélation du control
```

Les empreintes du candidat gelé sont consignées dans `RUN-001-RECORD.md`.

## 7. Révélation du control

Après gel seulement.

```text
EXPANSION RÉTROSPECTIVE DU CONTROL
= INTERDITE
```

Un holdout ne s'ajoute pas après avoir vu le candidat. Ce qui n'était pas couvert
reste `NOT COVERED`, et `NOT COVERED ≠ FALSE`.

## 8. Baseline aveugle non-CCR

Bras de comparaison distinct, conduit sans CCR, sur le même pack participant
gelé, dans son propre workspace jetable. Consigné dans `BASELINE-RECORD.md`.

```text
BASELINE
≠ run CCR
≠ préqualification
```

La préqualification de l'oracle et du fixture n'est pas le témoin aveugle.

## 9. Consommation machine public-only

Surfaces publiques de CCR uniquement, sans aucune lecture d'interne. Consigné
dans `PUBLIC-CONSUMPTION.md`.

## 10. Conditions d'arrêt

```text
provenance CCR non close                       → STOP
empreintes de gel non conformes                → STOP
control/ présent dans un workspace de run      → STOP
package-lock.json modifié par le run           → STOP
compilateur local ≠ Version 5.8.3              → STOP
fichier gelé modifié                           → consigné comme déviation,
                                                 non restauré silencieusement
```
