# CASE-004 — Manifeste de gel

Empreintes SHA-256 des artefacts gelés, relevées le 2026-09-07 après
vérification du cas matérialisé.

## Politique

```text
SELF HASH                  = not required
ALGORITHME                 = SHA-256
INVARIANT DE FINS DE LIGNE = LF
```

Tous les fichiers gelés sont en LF, vérifié par lecture directe des octets :
zéro octet 0x0D sur l'ensemble des artefacts du cas.

Le dépôt porte `core.autocrlf = true`, qui à lui seul convertirait les fichiers
texte en CRLF à la réextraction et invaliderait ce manifeste. La représentation
est donc fixée par une règle de dépôt bornée au cas, décrite en §5.

```text
FICHIER GELÉ EN CRLF AU MOMENT DE LA VÉRIFICATION
→ manifeste non vérifiable
→ CASE RUN = STOP
```

## 1. Entrées gelées visibles du participant — 8 fichiers

```text
6d14e1bf1f4d31188fe3888d209981f13bc30f601e5ccd526a9b8adebacd91a0  participant/MISSION.md
6731cbf7bdf70885d1a573c2f781a9d254a8c5b0ec028fcd0a2c5109a015a86f  participant/SPEC.md
d6659e63a8560df0db573da76b1ac323712b43f086a45426b8e412846a06755c  participant/consumer-v1.ts
473ce50f537ec969e0fa3b2aa12ae2952fc1a53a9d7bd69e8a1ad0de4504c015  participant/package-lock.json
655ca1ee5464332db774b38ce41ce3766e129e673c145204d0f33543ce01157e  participant/package.json
0e1e6d0b4a3ba02ac38a0c6867e32111dcf481c54c5b65c7f40331e8598aabd7  participant/src/stable-rank.ts
f55674b77a5683ffebf1352cb9e8b3f414caea5dd22b04a2e789c664d4f40379  participant/tests/visible.test.mjs
2620de0118c3b78ec1f289d6e9362ec690fb985c24f296167f4bb75ab784b731  participant/tsconfig.json
```

`participant/src/**` est gelé **en tant qu'entrée**. C'est le point de départ du
travail, et la seule zone que le participant est autorisé à modifier dans son
workspace jetable. Le pack du Lab, lui, ne change pas.

```text
MODIFIABLE PAR LE PARTICIPANT, DANS SON WORKSPACE   = src/**
GELÉ ET NON MODIFIABLE                              = les sept autres fichiers
```

## 2. Matériel gelé privé du control — 29 fichiers

```text
a1ee1f41484ebae93cbc36e22c75a0a81b4059773e955d244b57866824e7884c  control/README.md
7f640dd52e272029f793236e404e50527192f7bf26d6a872d865c0f7d97add02  control/candidate-holdout.test.mjs
c51a8a902e1051b7bab1dff88375a6ef20a9bb5f5a1a13ab4e1613531cc504b6  control/holdout-axis-a.mjs
6b3909ffb671760355169256b4141fcccc4ca8c50eb167199c2016a89bbf4698  control/holdout-axis-b.mjs
407b399ff99a7d324ef000dbdc48241d3ca95438e45d7c24b449650fa8a08a9a  control/negative/nc1.ts
85a2eff734858b541bd4ffdee015145be21a37d951ae0cd64254566fd100a8e1  control/negative/nc2.ts
8fb53ba3617450a065d8546706d88c0fb3511f51d9302058d7b6f8e80203014d  control/negative/nc3.ts
c4bf41f746d74a5fca4d7da19438a55ff0086e300818133def05ad432c40f60a  control/negative/nc4.ts
fdb96d23803bafadfe504d70935762f3721a5e1fbc16effbead519b3dea453d0  control/negative/nc5.ts
0aa61f35117bcd7b6bc39d3e2c6a1a1544cee468feb27db6ce36a81a64b2c216  control/negative/nc6.ts
8b3cdc6fac86350c02758487797211a0010ce6677c3c2f0d78ad66ea5826ab82  control/negative/nc7.ts
df787fea53b1d344a52357433590730dd4a278d8052e3b562a721a162cc4a6a7  control/reference-1.ts
ca35fe22c60524fbc5d815a105b88187903cd00427dceab50a049ac388a36fc9  control/reference-2.ts
2e68b7a7b96a1eb1dabf73283d89250ec48f516ce97c40f2be09accee76e366f  control/reference-holdout.test.mjs
c1affa70c85ecd3c05ea83b599bf9b7c65f2f394b485e9c75e5cbd8227bdedd7  control/reference-visible.test.mjs
05638a5457234e43ce42f73f96372445147054a0d76245eff84e0052a58c5cee  control/t1-probes/p01-dot-sort.ts
137466e272adcbbf3656f569c35fa71b774cd606155d1c8248daa74edbd59839  control/t1-probes/p02-bracket-sort.ts
a71c31030cd945222a98ea741fabac54485b3be59e974aa0d2459e07009fe263  control/t1-probes/p03-dot-tosorted.ts
311bcef0274862aacbac5f248580d3ea3790d1249450284bbf66fab031919a07  control/t1-probes/p04-bracket-tosorted.ts
0ab5a7e55c92872e98e9d28d4c99ab7279444d497cb45f8c865d36340c1ff881  control/t1-probes/p05-proto-sort.ts
898d53af1365e8bd743e91c2bb29f776ad67a67367bff2be1b030eb4e9058f73  control/t1-probes/p06-proto-tosorted.ts
6738b80b537b1d36bc92eeb68ad1ea80e26a1205911d22ad11058fa015c2d837  control/t1-probes/p07-typedarray.ts
43ed91d927789afc5ce7a29a4f53d30c685be59f2ed66393b977ed08d279046a  control/t1-probes/p08-nonrelative-runtime.ts
8cd44e4e0346ab0e667f60142088a24274631ea42bd1da773470aed7cd90d219  control/t1-probes/p09-typeonly-import.ts
86ef0b7a25906149491fbe7b166a80a0c17eadbf0699758a06800d3ce300f145  control/t1-probes/p10-inline-typeonly.ts
2fd47b6f2715ffe8320db91459d957e6f01f319d96d09cac199127898d3da33d  control/t1-probes/p11-relative-runtime.ts
890aecd92ec8951c428517311e7011b4846c9ea6d3783dac8501eaa15b20df82  control/t1-probes/p12-clean.ts
26a01614ead471bb750ed74e1e3874b08ea1d592594e55d250bcedc20429fbac  control/t1-probes/p13-obfuscated.ts
dca0cf0bfde64302737a26f5ca77787dc4f2d5a373b339a5a59416e41f206d88  control/t1.mjs
```

Aveugle jusqu'à la clôture intellectuelle et au gel des deux candidats.

## 3. Protocole gelé du Lab — 3 fichiers

```text
5b8671081624bdfd94d03024ea8946c02bb27e08a4aeda595ee044bf596d5c1e  RUNBOOK.md
712a036cc3c24467345c4fce787cd70857da0e60f0701ddbe360289b94abae68  PREQUALIFICATION.md
3fdc4b2fadb53e78c12873ab0137f9a9607a342a054c8e03c837f7598b76bce0  TRUTH-MATRIX.md
```

Le runbook, la préqualification définitive et la matrice de vérité ne changent
plus après le gel. Une correction de l'un d'eux après gel est une modification
du protocole, à consigner comme telle.

## 4. Records mutables du Lab — 4 fichiers

Non gelés. Destinés à recevoir des faits ultérieurs. Leur contenu initial n'est
pas un invariant, et aucune empreinte n'est relevée pour eux.

```text
RUN-001-RECORD.md        chronologie et faits du run CCR
BASELINE-RECORD.md       bras de comparaison aveugle sans CCR
EVALUATION.md            résultat officiel et classification des observations
PUBLIC-CONSUMPTION.md    consommation des surfaces machine publiques
```

```text
ÉCRITURE EXPÉRIMENTALE ULTÉRIEURE DANS CES QUATRE FICHIERS
= ATTENDUE
≠ déviation de protocole
```

## 5. Dépendance de gel au niveau du dépôt

Cet artefact n'appartient pas au cas : il appartient au dépôt. Il n'entre donc
pas dans les 40 artefacts gelés du cas, mais le gel byte-exact en dépend.

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
= cases/case-004-stable-ranking-cost-bound-refactor/** text eol=lf

SHA-256
= e0de6c0700d376d0878189830963d4cbe65071496ed69f475bfbe415ec7f7923
```

Portée délibérément bornée :

```text
DEMONSTRATED NEED                              représentation byte-stable des
                                               artefacts gelés de CASE-004
REPOSITORY-WIDE HISTORICAL EOL POLICY CHANGE   NOT APPLIED
```

La ligne CASE-004 a été ajoutée par cette mission : sans elle, aucun artefact du
cas n'était couvert, et les empreintes ci-dessus n'auraient pas survécu à une
réextraction. `core.autocrlf` et `core.eol` sont inchangés.

## 6. Index du cas — 1 fichier

```text
README.md
```

Ni gelé, ni record d'expérience : c'est l'index du cas, dont le bloc d'état
avance avec le cas. Aucune empreinte relevée.

## 7. Déviation de procédure à la matérialisation

Consignée durablement, et non effacée par son acceptation.

```text
MATERIALIZATION PROCEDURAL DEVIATION

initial materialized T1 load
= FAILED

cause
= scratch-specific TypeScript resolution

agent behavior
= repaired control/t1.mjs and continued
= contrary to explicit STOP / no-auto-remediation rule

auto-remediation authorized at the time
= NO

human adjudication
= current post-repair frozen state accepted ex post

design change                                = 0 demonstrated
truth change                                 = 0 demonstrated
cost recalibration                           = 0
T1 contract change                           = 0 demonstrated
T1 detector semantic-scope change            = 0 demonstrated
rematerialization                            = NOT REQUIRED

frozen authority
= les artefacts post-réparation, tels que hachés aux §1 à §3

protocol deviation                           = ACKNOWLEDGED, NOT ERASED
future STOP rule                             = UNCHANGED
```

Le détecteur résolvait TypeScript par un chemin valable dans le workspace de
préqualification et faux une fois matérialisé. La réparation a rétabli une
résolution de modules ordinaire ; les treize sondes syntaxiques rendent les
mêmes verdicts qu'en préqualification, et la portée sémantique du détecteur
est inchangée. Cela ne rend pas la réparation autorisée au moment où elle a
eu lieu : la règle d'arrêt sans remédiation automatique reste en vigueur pour
la suite.

## Récapitulatif

```text
FROZEN PARTICIPANT-VISIBLE FILES   = 8
FROZEN CONTROL-PRIVATE FILES       = 29
FROZEN LAB PROTOCOL FILES          = 3
MUTABLE LAB RECORDS                = 4
CASE INDEX                         = 1
MANIFESTE LUI-MÊME                 = 1   (self hash not required)

TOTAL FICHIERS DU CAS              = 46

CASE FROZEN ARTIFACT HASHES        = 40
REPOSITORY-LEVEL FREEZE DEPENDENCIES
                                   = 1
TOTAL HASHED FREEZE INPUTS         = 41
```

## Vérification avant tout run

```text
sha256sum -c   contre les sections 1 à 3
.gitattributes du dépôt conforme à §5, empreinte comprise
git check-attr text eol   sur les artefacts du cas → text: set / eol: lf
zéro octet 0x0D dans les artefacts gelés
control/ absent du workspace de run
package-lock.json inchangé après npm ci
node node_modules/typescript/bin/tsc --version = Version 5.8.3
```

Une empreinte non conforme arrête le cas. Elle ne se corrige pas en régénérant
le manifeste.
