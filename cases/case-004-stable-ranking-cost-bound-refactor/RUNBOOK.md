# CASE-004 — Runbook

Protocole opérateur du cas. Gelé au même titre que les paquets : après le gel,
il ne change plus.

## 1. Portée

```text
FORME
= optimisation bornée, préservant le comportement

DÉFAUT SEMÉ
= AUCUN

CCR SYSTEM
= dépendance externe et sujet d'observation
= jamais modifié, jamais corrigé, jamais contourné
```

## 2. Workspaces jetables

Tout run se conduit dans un workspace frais, isolé, **hors du dépôt du Lab**,
créé à partir du seul pack `participant/`, extrait de l'ancre Git pré-run.

```text
control/ dans le workspace de run     = ABSENT, vérifié avant lancement
empreintes du gel                     = vérifiées contre FREEZE-MANIFEST.md
npm ci                                = depuis le lockfile gelé
package-lock.json après npm ci        = inchangé, vérifié
```

Ni les workspaces, ni les candidats gelés, ni les copies d'évaluation n'entrent
dans le dépôt. Seuls les records les décrivent.

### Compilateur de vérité TypeScript

Le compilateur employé est celui du lockfile gelé, jamais une résolution
susceptible de télécharger un paquet absent.

```text
node node_modules/typescript/bin/tsc --version   → Version 5.8.3
node node_modules/typescript/bin/tsc --noEmit
```

`npm run typecheck` est équivalent : npm résout `tsc` depuis `node_modules/.bin`.
`npx tsc` ne l'est pas et n'est employé nulle part dans ce runbook.

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
littéralement. Le chemin absolu réellement résolu est consigné dans
`RUN-001-RECORD.md` comme fait machine-local observé.

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

Le commit canonique attendu et le statut vide sont consignés au moment du run.

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

```text
RUNTIME LOAD CHAIN
= ESTABLISHED   si le graphe atteint depuis bin/ccr.mjs pour les commandes du
                cas ne charge que des fichiers suivis du dépôt canonique et des
                modules natifs node:
= UNCERTAIN     dans tout autre cas
```

Exclusion de portée : `ccr cockpit` n'est jamais lancé pendant CASE-004.

### D — provenance des artefacts CCR réellement chargés

Si et seulement si C conclut `ESTABLISHED`, l'association A + B couvre les
fichiers chargés. Vérifier qu'aucun élément pertinent ne provient d'un `dist/`
généré, d'une sortie non suivie, d'un autre checkout, d'un shim de PATH, d'un
paquet global ou d'un artefact mutable externe.

```text
git status clean
= preuve forte sur le contenu SUIVI du worktree
≠ preuve sur les fichiers ignorés ou générés qui pourraient être chargés
```

### Règle de sortie

```text
A + B + C ESTABLISHED
→ CCR SYSTEM IMPLEMENTATION RUNTIME PROVENANCE = ESTABLISHED
→ CCR RUN autorisé

A + B établis, C UNCERTAIN
→ SOURCE ↔ ENTRYPOINT ASSOCIATION = established
→ CCR SYSTEM IMPLEMENTATION RUNTIME PROVENANCE = UNCERTAIN
→ CCR RUN = STOP
```

Aucun patch, aucun contournement, aucune relaxation du protocole.

## 4. CCR System et fournisseurs sont deux questions distinctes

```text
CCR SYSTEM IMPLEMENTATION RUNTIME PROVENANCE
= question de provenance produit, couverte par §3

PROVIDER EXECUTABLE / VERSION PROVENANCE
= fait expérimental séparé, consigné selon les faits disponibles

PROVIDER   ≠ ROLE
PROVIDER   ≠ CCR SYSTEM RUNTIME
PROVIDER   ≠ SEMANTIC ORIGIN
```

Une provenance fournisseur imparfaitement disponible se consigne comme telle.
Elle ne vaut pas défaut de provenance produit. La constance de version exacte
entre les bras n'est pas un critère d'acceptation : elle est relevée
indépendamment à l'exécution, et son absence se consigne sans arrêter le cas.

## 5. Aiguillage des sessions — premier verrou du run

L'identité de l'agent est le tout premier gate, avant l'ancre Git et avant la
provenance CCR System.

```text
BASELINE
= session fraîche et indépendante

CCR PRODUCTION
= session fraîche et indépendante, DIFFÉRENTE de celle du baseline
= aucune information substantielle du baseline

LAYER C
= session fraîche ultérieure, consommateur public
= titre sémantique seul, aucun run_id privé
```

Une session ne devient pas fraîche parce qu'un en-tête le déclare. L'aiguillage
appartient à l'humain, et aucun numéro de session future n'est préattribué ici.

```text
ÉCRITURE DE RUN-001-RECORD.md DEPUIS UNE SESSION CONTAMINÉE
= INTERDITE
```

## 6. Run CCR

```text
MAX INVOCATIONS
= 32
```

Le run commence au premier `ccr start` du cas. Les interventions humaines de
contenu passent exclusivement par `ccr send`, jamais par une session fournisseur
manuelle ni par un appel direct à un CLI fournisseur.

## 7. Gel des candidats

Chaque candidat est gelé **avant** toute lecture de `control/`.

```text
GEL DES DEUX CANDIDATS
→ puis seulement : révélation du control
→ puis seulement : évaluation officielle
```

Identité d'un candidat : pour tout `src/**`, `<sha256><deux espaces><chemin
relatif>\n`, trié par chemin, UTF-8 LF, puis SHA-256 de l'ensemble. La même
méthode s'applique aux deux bras.

```text
CANDIDATE IDENTITY   ≠ CORRECTNESS
```

## 8. Évaluation officielle

Après gel des deux candidats seulement. Outillage gelé du cas, aucun test
modifié, aucune ligne de vérité fabriquée.

```text
EXPANSION RÉTROSPECTIVE DU CONTROL
= INTERDITE
```

Ce qui n'était pas couvert reste `NOT COVERED`, et `NOT COVERED ≠ FALSE`.

## 9. Conformité à la tâche

T1 s'applique à `src/**` du candidat gelé, jamais aux harnais.

```text
T1   = verrou séparé, hors des 26 lignes
T1 ANTI-OBFUSCATION COMPLETENESS = NOT CLAIMED
```

## 10. Consommation machine public-only

Surfaces publiques de CCR uniquement, sans aucune lecture d'interne. Consignée
dans `PUBLIC-CONSUMPTION.md`.

## 11. Conditions d'arrêt

```text
provenance CCR non close                       → STOP
empreintes de gel non conformes                → STOP
control/ présent dans un workspace de run      → STOP
package-lock.json modifié par le run           → STOP
compilateur local ≠ Version 5.8.3              → STOP
session mal aiguillée                          → STOP avant ccr start
fichier gelé modifié                           → consigné comme déviation,
                                                 non restauré silencieusement
```
