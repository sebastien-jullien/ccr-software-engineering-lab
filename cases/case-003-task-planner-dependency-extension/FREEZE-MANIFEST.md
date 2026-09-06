# CASE-003 — Manifeste de gel

Empreintes SHA-256 des artefacts gelés, relevées le 2026-09-06 après
préqualification.

## Politique

```text
SELF HASH
= not required

ALGORITHME
= SHA-256

INVARIANT DE FINS DE LIGNE
= LF
```

Tous les fichiers gelés sont en LF, vérifié par lecture directe des octets :
zéro octet 0x0D sur l'ensemble des artefacts du cas.

Le dépôt porte `core.autocrlf = true`, qui à lui seul convertirait les fichiers
texte en CRLF à la réextraction et invaliderait ce manifeste. La représentation
est donc fixée par une règle de dépôt bornée au cas, décrite en §6.

```text
FICHIER GELÉ EN CRLF AU MOMENT DE LA VÉRIFICATION
→ manifeste non vérifiable
→ CASE RUN = STOP
```

La politique est contrôlée par le dépôt, et bornée à CASE-003 : aucune règle
EOL globale n'a été instaurée, et `core.autocrlf` comme `core.eol` sont
inchangés.

## 1. Entrées gelées visibles du participant — 10 fichiers

```text
c477ddc7850f9785da7bfe3bd552665850745c3f828b399a791e29f2691bd1c2  participant/MISSION.md
9fcd7f451079c79afbeab60edccadc0155bdfa5cfa3bcb267b017431948334f9  participant/SPEC.md
b4306dcbac3c38e6f836b5823a187d580a303956e2029c37614e1d85c57a7daf  participant/consumer-v1.ts
7678b9163ce2391000ced099ac69a48105f80a045e44f4da2dc21ef55ca54c2f  participant/package-lock.json
c19b613488dac13cf3c8f716c4a4225bd11317b90cf03cab4060e1f829796a38  participant/package.json
ffe63b902c76aa64e57a67cd58cefe18da610181edfbb305fa4a80724a936580  participant/src/ordering.ts
6546f8f5b115c3815c7e112637b819b1ad37d5f6911b858c3962cf7fc06dac8e  participant/src/task-planner.ts
a5f81cfc5b722fbcbc8c92b4c3ce3e977599311a91d3362ee910e5336514b9a5  participant/src/validation.ts
2a5a389dc963c6e459721cc86dfb776cae84d4c44efd9c081ed47840c4c707a7  participant/tests/visible.test.mjs
2620de0118c3b78ec1f289d6e9362ec690fb985c24f296167f4bb75ab784b731  participant/tsconfig.json
```

`participant/src/**` est gelé **en tant qu'entrée**. C'est le point de départ du
travail, et la seule zone que le participant est autorisé à modifier dans son
workspace jetable. Le pack du Lab, lui, ne change pas.

```text
MODIFIABLE PAR LE PARTICIPANT, DANS SON WORKSPACE
= src/**

GELÉ ET NON MODIFIABLE
= les neuf autres fichiers ci-dessus
```

## 2. Matériel gelé privé du control — 7 fichiers

```text
dae64e1eea4cbde98fdc33c78a020135e84b8f5c12e656fe31797d9091364e72  control/README.md
7caa6b75a158d51292a91fb00e8fb8467f343b740dfa37f6abcc998f9a8a6977  control/TRUTH-MATRIX.md
e75e3790b432a453c0b08fe3eb0a008867d1856b758d56c5ade7914826f0fe1e  control/candidate-holdout.test.mjs
a52166b50479fbcf455b6712f46e2f6008639c715191b67c86d4e0993e1f3c47  control/holdout-suite.mjs
9e36050c58a290ab4b991e0ceacdc314d08745d18e165dbe1af2b31f9d02455f  control/reference-holdout.test.mjs
a7e9c4fd88c0e1ac70ed28614b1f9868b5fadd2ca36576a8b24393570abaaa0b  control/reference-planner.mjs
0d3c08d1b5295c54bf76fb4f3d08251b43f0fef2071da22cef201c986f0a32ed  control/reference-visible.test.mjs
```

Aveugle jusqu'à la clôture intellectuelle et au gel du candidat.

## 3. Protocole gelé du Lab — 2 fichiers

```text
9363d31b930a40af5e32b104d3a6f37ba18e757cfcc111fca5cc53512a48498a  RUNBOOK.md
faab6c971fa97719c8745084f267121265765a8085cb8502dd1fe1c1769e802a  PREQUALIFICATION.md
```

Le runbook et la préqualification définitive ne changent plus après le gel. Une
correction de l'un d'eux après gel est une modification du protocole, à consigner
comme telle.

## 4. Records mutables du Lab — 4 fichiers

Non gelés. Destinés à recevoir des faits ultérieurs. Leur contenu initial n'est
pas un invariant, et aucune empreinte n'est relevée pour eux.

```text
RUN-001-RECORD.md        chronologie et faits du run CCR
BASELINE-RECORD.md       bras de comparaison aveugle sans CCR
EVALUATION.md            résultat logiciel et classification des observations
PUBLIC-CONSUMPTION.md    consommation des surfaces machine publiques
```

```text
ÉCRITURE EXPÉRIMENTALE ULTÉRIEURE DANS CES QUATRE FICHIERS
= ATTENDUE
≠ déviation de protocole
```

## 5. Index du cas — 1 fichier

```text
README.md
```

Ni gelé, ni record d'expérience : c'est l'index du cas, dont le bloc d'état
avance avec le cas. Aucune empreinte relevée.

## 6. Dépendance de gel au niveau du dépôt

Cet artefact n'appartient pas au cas : il appartient au dépôt. Il n'entre donc
pas dans les 19 artefacts gelés du cas, mais le gel byte-exact en dépend.

```text
REPOSITORY-LEVEL FREEZE DEPENDENCY

PATH
= ../../.gitattributes
= racine du dépôt du Lab

ROLE
= checkout line-ending policy required for byte-stable frozen CASE artifacts

EXPECTED RULE
= .gitattributes text eol=lf
= cases/case-003-task-planner-dependency-extension/** text eol=lf

SHA-256
= c598b0d2f517dad95c55356aee225dc9694ea047cac7ea04887a79732b171223
```

Portée délibérément bornée :

```text
DEMONSTRATED NEED
= checkout-stable byte representation for CASE-003 frozen artifacts

REPOSITORY-WIDE HISTORICAL EOL POLICY CHANGE
= NOT DEMONSTRATED AS NECESSARY
= NOT APPLIED
```

Si cette règle disparaît ou change, les empreintes du cas cessent d'être
vérifiables après réextraction, même si aucun fichier n'a été modifié.

## Récapitulatif

```text
FROZEN PARTICIPANT-VISIBLE FILES   = 10
FROZEN CONTROL-PRIVATE FILES       = 7
FROZEN LAB PROTOCOL FILES          = 2
MUTABLE LAB RECORDS                = 4
CASE INDEX                         = 1
MANIFESTE LUI-MÊME                 = 1   (self hash not required)

TOTAL FICHIERS DU CAS              = 25

CASE FROZEN ARTIFACT HASHES        = 19
REPOSITORY-LEVEL FREEZE DEPENDENCIES
                                   = 1
TOTAL HASHED FREEZE INPUTS         = 20
```

## Vérification avant tout run

```text
sha256sum -c   contre les sections 1 à 3
.gitattributes du dépôt conforme à §6, empreinte comprise
git check-attr text eol   sur les artefacts du cas → text: set / eol: lf
zéro octet 0x0D dans les artefacts gelés
control/ absent du workspace de run
package-lock.json inchangé après npm ci
node node_modules/typescript/bin/tsc --version = Version 5.8.3
```

Une empreinte non conforme arrête le cas. Elle ne se corrige pas en régénérant
le manifeste.
