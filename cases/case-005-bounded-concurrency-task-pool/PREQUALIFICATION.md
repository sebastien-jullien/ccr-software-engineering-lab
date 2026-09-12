# CASE-005 — Préqualification de l'oracle

**CONTROL-PRIVATE.**

```text
DATE            2026-09-08
NODE            v22.18.0
PLATEFORME      win32 · Windows 10 Pro 19045
DÉPÔT           ccr-software-engineering-lab
DISCIPLINE      R2 — stdout/stderr complets, code de sortie capté séparément,
                commande exacte, horodatage, durée, identités de lignes
PRODUCTION EXPÉRIMENTALE   AUCUNE AU MOMENT DE CETTE PRÉQUALIFICATION
                           (les deux bras ont été produits ensuite, le même
                           jour ; résultat dans EVALUATION.md)
ÉTAT DES PREUVES           campagnes complètes du 2026-09-08, plus les
                           exécutions ciblées A05 et A07 postérieures à la
                           réparation de réalisation de A05 et à l'amendement
                           humain de A07 (voir §10 et §11)
```

## 1. Références

Deux solutions complètes, écrites indépendamment, sur deux stratégies
différentes.

```text
RÉFÉRENCE 1   boucle de travailleurs
              min(limit, n) travailleurs sur un curseur partagé
              avortement détecté par ÉCOUTEUR

RÉFÉRENCE 2   ordonnanceur / recharge
              compteur inFlight explicite + pump()
              avortement détecté par SONDAGE aux points de contrôle
```

| Référence | Visible | Caché | Total | Inconclusive | Artefact | T1 | T2 | T3 |
|-----------|---------|-------|-------|--------------|----------|----|----|----|
| reference-1 | 10 / 10 | 20 / 20 | **30 / 30** | 0 | 0 | PASS | PASS | PASS |
| reference-2 | 10 / 10 | 20 / 20 | **30 / 30** | 0 | 0 | PASS | PASS | PASS |

Composition de la preuve, par référence :

```text
28 lignes   preuve retenue de la campagne complète (inchangées depuis)
 2 lignes   preuve fraîche ciblée — A05 réparée, A07 amendée
──────────
30 / 30     conclusives · 0 inconclusive · 0 défaillance d'évaluateur
```

Durées observées : `reference-1` 105–134 ms par ligne (plus lente : A01),
`reference-2` 105–122 ms (plus lente : B01). Campagne complète ≈ 3,4 s ;
exécutions ciblées A05 et A07 : 114–123 ms.

### Indépendance des références

```text
reference-1.ts   70 lignes · 46 lignes significatives
reference-2.ts   94 lignes · 68 lignes significatives

lignes textuellement communes                       23
  dont surface publique gelée (imposée)              8
  dont gardes de précédence gelées (SPEC §2)         3
  dont syntaxe pure (accolades, try/catch)           6
  ──────────────────────────────────────────────────
  choix d'implémentation réellement partagés         6
```

Les six restants sont l'allocation du tableau de résultats, la déstructuration
des options, l'exécuteur de promesse et la variable de cause d'arrêt. Les
structures de contrôle — `cursor`/`worker` contre `pump`/`inFlight`, écouteur
contre sondage — n'ont aucune ligne commune.

```text
REFERENCE INDEPENDENCE = PASS
```

## 2. Portes de validité T1 / T2 / T3

T1 tient sur neuf constats : l'arbre type sans erreur, une sonde conforme type,
et **sept sondes négatives échouent chacune pour la raison visée**.

| Sonde | Attendu | Erreur obtenue |
|-------|---------|----------------|
| `p01-conforming` | DOIT TYPER | — |
| `p02-missing-options` | DOIT ÉCHOUER | TS2554 · 2 arguments attendus, 1 fourni |
| `p03-wrong-element-type` | DOIT ÉCHOUER | TS2322 · `readonly number[]` non assignable |
| `p04-options-without-limit` | DOIT ÉCHOUER | TS2345 · `limit` manquant |
| `p05-readonly-result` | DOIT ÉCHOUER | TS2542 · index en lecture seule |
| `p06-readonly-limit` | DOIT ÉCHOUER | TS2540 · `limit` en lecture seule |
| `p07-task-arity` | DOIT ÉCHOUER | TS2322 · `(index: number) => …` non assignable |
| `p08-async-return` | DOIT ÉCHOUER | TS2339 · `length` absent d'une `Promise` |

Sans ces sondes, une signature élargie passerait T1 en silence.

T2/T3 ont été éprouvées sur un arbre rendu volontairement non conforme
— dépendance ajoutée, `SPEC.md` modifié, fichier surnuméraire :

```text
T2  KO  modifiés=[package.json]  ajoutées=1
T3  KO  diffèrent=[SPEC.md package.json]  surnuméraires=1
exit=1
```

Ordre imposé dans `gates.mjs` : T2/T3 **avant** T1, parce que T1 dépose ses
sondes dans l'arbre et deviendrait sinon lui-même une violation de T3.

## 3. Contrôles négatifs

```text
CODE DES CONTRÔLES NÉGATIFS  =  INCHANGÉ
```

Sept candidats volontairement défectueux. Aucun n'a été modifié : ce qui est
corrigé ici est le **compte rendu**, pas le code.

### 3.1 Deux façons d'échouer, aucune n'est « non concluante »

La hiérarchie de verdict gelée distingue deux chemins vers un ROW FAIL, et un
seul chemin vers INCONCLUSIVE :

```text
A  la ligne conclut, ses assertions sont violées        →  FAIL  (par assertion)
B  le processus enfant se termine NATURELLEMENT sans
   l'événement requis, watchdogFired=false,
   harnessFault=null                                    →  FAIL  (par témoin
                                                            de terminaison naturelle)
C  le watchdog termine l'enfant avant A ou B            →  INCONCLUSIVE
```

Les deux premiers sont **concluants**. Le troisième seul ne l'est pas.

```text
INCONCLUSIVE observés sur les sept campagnes  =  0
défaillances d'évaluateur                     =  0
```

Le rapport précédent additionnait les deux chemins sous un seul nombre. Les
colonnes ci-dessous les séparent. Aucune ligne échouée n'est décrite comme non
concluante, et aucune ligne non concluante n'existe : ce serait confondre
« la vérité est établie et négative » avec « la vérité n'est pas établie ».

### 3.2 Signatures constatées

Colonne « attendues » = signature d'isolement prévue à la conception ;
colonnes suivantes = mesure.

| NC | Défaut intentionnel | Attendues | Échec par assertion | Échec par témoin naturel | Inconcl. |
|----|--------------------|-----------|---------------------|--------------------------|----------|
| NC1 | dépasse la borne de concurrence | B01 B02 B03 B04 B05 B07 B08 | **B01 B02 B03 B04 B05 B07 B08** C02 D02 D03 — 10 | C03 C04 C05 C06 D04 — 5 | 0 |
| NC2 | rend l'ordre de règlement au lieu de l'ordre d'index | A04 A06 A07 A09 | **A04 A06 A07** — 3 | — | 0 |
| NC3 | continue à démarrer après un échec | C02 | **C02** D03 — 2 | C03 C04 C05 C06 D02 D04 — 6 | 0 |
| NC4 | rejette avant la quiescence | C02 C03 D02 D03 | **C02 D03** — 2 | — | 0 |
| NC5 | démarre après un abort synchrone pendant une invocation | D03 | **D03** — 1 | — | 0 |
| NC6 | une cause d'arrêt ultérieure écrase la première | C04 C06 D04 | **C04 C06** — 2 | — | 0 |
| NC7 | attend TOUT l'en-vol avant de recharger un créneau | B02 B03 B08 | — | **B02 B03 B08** B04 — 4 | 0 |

NC1 et NC3 : les échecs par témoin naturel sont la conséquence directe du même
défaut unique — le contrôle démarre des tâches que le scénario ne règle jamais,
la promesse externe ne peut donc plus se régler, et le processus se termine de
lui-même. Ce n'est pas un second défaut.

```text
NC1 DÉFAUTS INDÉPENDANTS SUPPLÉMENTAIRES = 0
NC3 DÉFAUTS INDÉPENDANTS SUPPLÉMENTAIRES = 0
```

### 3.3 A05 et A07 ne figurent plus dans la signature de NC1

Avant la réparation de réalisation de A05 (§11) et l'amendement humain de A07
(§12), NC1 échouait aussi sur ces deux lignes — dans les deux cas **uniquement**
sur une assertion de pic qui n'appartenait pas à la vérité notée de l'axe A.
Ces deux assertions ont été retirées ; NC1 passe désormais A05 et A07.

La borne de concurrence reste notée, et NC1 reste détecté, par sept lignes de
l'axe B — **B01 B02 B03 B04 B05 B07 B08** — dont c'est l'objet exclusif. Aucune
perte de couverture ; suppression d'un double comptage.

### 3.4 Corrections d'attente de préqualification

Ces écarts corrigent des **attentes de préqualification**, jamais la matrice de
vérité, qui reste inchangée.

- **NC2 / A09 — attente surévaluée.** A09 n'emploie que des promesses déjà
  résolues : le règlement y est synchrone à l'invocation, donc l'ordre de
  règlement coïncide avec l'ordre d'index et le défaut ne peut pas apparaître.
  Il est détecté par A04, A06 et A07.
- **NC4 / C03 — l'oracle ne teste pas la clause à cet endroit.** C03 ne contient
  aucune assertion de temporalité : ses seules assertions sont l'état final
  (`rejected`) et la raison (`R0`), toutes deux correctes sous NC4. La clause de
  quiescence est testée par C02 et D03.
- **NC4 / D02 — fenêtre d'observation antérieure à la manifestation.** NC4
  n'installe aucun écouteur ; il ne sonde l'abort que dans `pump()`, à l'arrêt au
  moment de `controller.abort(A)`. Le contrôle `isStillPending` de D02 passe
  donc. NC4 rejette bien prématurément, mais plus tard, au règlement de la
  tâche 0, alors que la tâche 1 est encore en vol — et D02 n'a plus de point
  d'observation. D02 reste vivante contre une implémentation **par écouteur**,
  qui manifesterait le défaut immédiatement.
- **NC6 / D04 — le sondage réaffirme la cause.** L'écrasement a lieu
  (`checkAbort()` → A, puis `noteStop(R0)` → R0), mais `pump()` rappelle
  `checkAbort()` et réécrit A avant tout règlement. La dernière écriture observée
  est donc correcte. NC6 implémente bien les deux directions d'écrasement ;
  c'est D04 qui ne peut pas les observer sur une implémentation par sondage.
  D04 reste vivante contre une implémentation par écouteur.

Aucune de ces observations n'a conduit à modifier une ligne de vérité.
**Aucun contrat n'a été remanié pour faire coïncider une signature négative.**

## 4. NC7 — témoin de terminaison naturelle

C'est la preuve décisive du cas : une exigence de progression non satisfaite est
constatée par la **fin réelle du processus enfant**, jamais par un délai.

```text
B02  FAIL  concluded=false  naturalExit=true  watchdogFired=false  harnessFault=null  exit=0  signal=null  beforeExit=1  107 ms
B03  FAIL  concluded=false  naturalExit=true  watchdogFired=false  harnessFault=null  exit=0  signal=null  beforeExit=1  109 ms
B04  FAIL  concluded=false  naturalExit=true  watchdogFired=false  harnessFault=null  exit=0  signal=null  beforeExit=1  114 ms
B08  FAIL  concluded=false  naturalExit=true  watchdogFired=false  harnessFault=null  exit=0  signal=null  beforeExit=1  107 ms

NC7 NATURAL-TERMINATION WITNESS = PASS
```

B04 s'ajoute aux trois lignes prévues et relève du **même défaut unique** : B04
exige deux recharges alors que la tâche 2 reste volontairement en vol ; le lot
`{0,1,2}` que NC7 attend ne se règle jamais entièrement, donc aucune recharge
n'a lieu. Ce n'est pas un second défaut.

Aucun verdict sémantique dérivé d'un dépassement de délai.
`beforeExit` est journalisé, et n'a aucune autorité de verdict.

## 5. OP-W1 — chemin opérationnel du watchdog

Sonde **non notée**, hors de l'ensemble négatif : elle maintient l'enfant en vie
sans produire l'événement requis. Watchdog abaissé à 2 000 ms pour l'exercer.

```text
A01  VISIBLE  PASS            92 ms   watchdogFired=false
B02  VISIBLE  INCONCLUSIVE  2028 ms   watchdogFired=true   signal=SIGKILL
B08  HIDDEN   INCONCLUSIVE  2029 ms   watchdogFired=true   signal=SIGKILL

processus récupéré                        OUI
lignes restantes encore évaluables        OUI
verdict sémantique tiré du watchdog       AUCUN
OP-W1 = PASS
```

### 5.1 Vérification à la valeur gelée

La même sonde, rejouée **sans surcharge `--watchdog`**, donc à la valeur
exécutable réelle :

```text
commande     node evaluate.mjs --impl negative/op-w1.ts --label op-w1-default
             --rows A01,B02,B08          (aucun --watchdog)
watchdogMs enregistré  20000

A01  VISIBLE  PASS             121 ms   watchdogFired=false  concluded=true
B02  VISIBLE  INCONCLUSIVE  20 023 ms   watchdogFired=true   SIGKILL
B08  HIDDEN   INCONCLUSIVE  20 023 ms   watchdogFired=true   SIGKILL

campagne 40 361 ms · exit 0
processus récupérés                    OUI
machinerie d'évaluation restante       utilisable
verdict sémantique tiré du watchdog    AUCUN
```

Le tir à 2 028 ms de la campagne précédente venait d'une surcharge explicite
`--watchdog 2000` en ligne de commande, jamais de la valeur matérialisée.

## 6. Isolement et ordre

```text
ROW ISOLATION            PASS
  les 30 lignes exécutées SEULES rendent le verdict de la suite complète
  divergences : 0 / 30

ROW-ORDER INDEPENDENCE   PASS
  suite en ordre inversé, sur les deux références
  divergences : 0 / 30 et 0 / 30
```

## 7. Confidentialité du holdout

Contrôle mécanique (`control/leakage-check.mjs`), cinq constats : inventaire
exact, absence des 20 identifiants cachés, absence de tout chemin `control/`,
absence de seize jetons propres au matériel de contrôle, et aucune copie par
empreinte d'un fichier de contrôle dans l'arbre participant.

```text
HIDDEN-TRUTH LEAKAGE = 0
```

## 8. Calibration du watchdog opérationnel

Le watchdog n'est **ni** une vérité logicielle, **ni** un score de performance,
**ni** un critère de vainqueur.

Base : 360 exécutions de ligne concluantes — 11 campagnes complètes (2
références, 2 en ordre inversé, 7 contrôles négatifs) plus les 30 exécutions
solo.

```text
min        101 ms      (nc6 B01)
médiane    107 ms
p90        113 ms
p99        122 ms
max        134 ms      (reference-1 A01)
```

Contribution du démarrage de processus, mesurée séparément :

```text
node -e 0                                 min 34 ms · médiane 36 ms · max  39 ms
+ chargement du module TypeScript         min 94 ms · médiane 96 ms · max 101 ms
```

Soit ≈ 96 ms des 107 ms médians. La part sémantique d'une ligne est de l'ordre
de **10 à 15 ms** ; le reste est du démarrage, donc sensible à l'environnement
— cache froid, machine chargée, antivirus, intégration continue.

```text
OPERATIONAL WATCHDOG VALUE = 20 000 ms par ligne

CALIBRATION BASIS
  max concluant observé                    134 ms
  démarrage de processus + chargement TS    ~96 ms de ce maximum
  échantillon                              360 exécutions de ligne

SAFETY MARGIN
  20 000 / 134  ≈ 149×  le maximum observé
  20 000 /  96  ≈ 208×  le coût de démarrage seul
  pire cas d'une campagne entièrement bloquée : 30 × 20 s = 600 s = 10 min

RATIONALE
  Un INCONCLUSIVE rend l'évaluation INCOMPLETE et interdit toute comparaison :
  son coût est bien supérieur à celui d'une attente. La marge est donc prise
  très large du côté qui protège le candidat, et bornée du côté opérationnel
  par une campagne qui ne dépasse pas dix minutes même entièrement bloquée.

WATCHDOG STATUS = HUMAN-FROZEN
```

La valeur exécutable était déjà 20 000 ms (`control/runner.mjs`,
`DEFAULT_WATCHDOG_MS`). Le gel humain n'a donc entraîné **aucune modification de
code** : seules les surfaces de statut ont changé. La preuve à la valeur exacte
est en §5.1.

Le watchdog n'a été réglé pour faire échouer aucune ligne : les quatre échecs de
NC7 sont naturels, à 107–114 ms, très loin de toute valeur candidate.

## 9. Comptabilité des remédiations

Le rapport précédent annonçait `HARNESS REMEDIATION COUNT = 2`. C'était faux :
deux corrections de réalisation n'avaient pas été comptées, et une troisième
avait été classée dans la mauvaise catégorie. Le compte corrigé :

```text
REMÉDIATIONS DE HARNAIS (implémentation)                        4
AMENDEMENTS DE CONTRAT GELÉ SANS AUTORISATION (historiques)     1
NORMALISATIONS D'INFRASTRUCTURE DE DÉPÔT                        1
AUTRES CORRECTIONS DE MATÉRIALISATION                           2
────────────────────────────────────────────────────────────────
RÉPARATION DE RÉALISATION D'UNE VÉRITÉ GELÉE (mission courante)  1
MATÉRIALISATION D'UN AMENDEMENT HUMAIN (mission courante)        1
```

### 9.1 Remédiations de harnais — 4

1. **`row-child.mjs`** — `import(implPath)` échouait avec
   `ERR_UNSUPPORTED_ESM_URL_SCHEME` (« protocole e: ») sur les 30 lignes.
   Corrigé par `pathToFileURL(implPath).href`.
2. **`holdout-axis-d.mjs`, D05** — l'assertion réinterrogeait une issue déjà
   résolue, donc ne prouvait rien. Réécrite pour réinterroger la **même**
   promesse externe avant puis après l'avortement. Scénario et vérité attendue
   inchangés.
3. **`t1-probes/`** — sans `package.json` `{"type":"module"}` ni `--typeRoots`,
   les sept sondes négatives « échouaient » sur `TS1286` (module CommonJS), pas
   sur l'erreur de type visée, et la sonde conforme échouait aussi. T1 était
   sans dents.
4. **`runner.mjs`** — la hiérarchie de verdict vivait dans `evaluate.mjs`, ce qui
   aurait donné un second oracle aux vues `node:test`. Extraite ; les onze
   campagnes ont été rejouées, résultats identiques.

### 9.2 Amendement de contrat gelé sans autorisation — 1, historique

```text
A07 TEXTE HUMAIN GELÉ D'ORIGINE
= 200 tâches, limit 7, règlement en ordre d'index globalement DÉCROISSANT
= 200 résultats en ordre d'index

CE TEXTE
= MÉCANIQUEMENT IMPOSSIBLE sous les autres règles gelées

AMENDEMENT AU MOMENT DE LA MATÉRIALISATION
= A EU LIEU
= SANS AUTORISATION HUMAINE

EXIGENCE PROCÉDURALE ALORS APPLICABLE
= STOP + REPORT

CONFORMITÉ PROCÉDURALE
= ÉCHOUÉE

AMENDEMENT HUMAIN ULTÉRIEUR
= autorité corrective explicite
= N'EFFACE PAS la déviation antérieure
```

Cet événement **n'est pas** une remédiation de harnais, bien qu'il ait aussi
réparé une impossibilité réelle de harnais ; il est compté une seule fois, ici,
au titre de sa classe la plus grave. Détail mécanique de l'impossibilité et de
l'amendement en §11.

### 9.3 Normalisation d'infrastructure de dépôt — 1

`.gitattributes` nommait explicitement CASE-003 et CASE-004 en `text eol=lf`,
mais pas CASE-005 : `git check-attr` rendait `eol: unspecified`. Avec
`core.autocrlf = true`, une extraction sous Windows aurait produit des fins de
ligne CRLF, et les empreintes SHA-256 — calculées sur des octets LF — n'auraient
plus correspondu ; T2 et T3 auraient échoué pour tout producteur. Une ligne a été
ajoutée, sur le motif exact des deux cas précédents :

```text
cases/case-005-bounded-concurrency-task-pool/** text eol=lf
```

```text
CLASSE                        normalisation d'infrastructure d'expérience
SÉMANTIQUE PRODUIT            0
SÉMANTIQUE DE VÉRITÉ          0
DÉCISION HUMAINE              ACCEPTÉE
```

Ce n'est **pas** le seul mécanisme théoriquement possible pour préserver la
stabilité d'octets : un scellement hors Git depuis une source unique,
`core.autocrlf=false` par clone, ou des empreintes calculées sur un contenu
canonicalisé y parviendraient également. C'est le mécanisme **natif au dépôt**,
choisi pour que la stabilité à l'extraction soit une propriété du dépôt et non
de la configuration Git de chaque opérateur. C'est le seul chemin modifié hors
du répertoire du cas.

### 9.4 Autres corrections de matérialisation — 2

1. **`participant/MISSION.md` et `tests/visible.test.mjs`** — la commande
   documentée `node --test tests/` ne fonctionne pas sous Node 22.18 : un
   répertoire positionnel y est chargé comme module (`MODULE_NOT_FOUND`,
   1 test / 1 échec). Remplacée par `node --test`.
2. **`freeze-manifest.mjs`** — `runner.mjs`, `leakage-check.mjs`,
   `seal-participant.mjs` et `README.md` manquaient à la liste d'empreintes lors
   de la première génération.

## 10. A05 — réparation de réalisation d'une vérité gelée

### 10.1 Écart constaté

```text
A05 CONDITION DE RÉUSSITE GELÉE
= 4 tâches · limit 1 · règlement 0,1,2,3
→ journal d'invocation = [0,1,2,3]
→ les valeurs rendues conservent l'ordre d'index d'origine

A05 CONDITION DE RÉUSSITE MATÉRIALISÉE, AVANT RÉPARATION
= les deux ci-dessus
+ h.peak() === 1            ← assertion NOTÉE absente du texte gelé

A05 SEMANTIC DELTA
= NONZERO
= TRUTH-REALIZATION DRIFT
```

### 10.2 Preuve que l'assertion était additive, non entraînée

Le scénario de A05 rejoué en séparant les assertions gelées de l'assertion
ajoutée :

```text
candidat NC1          journal 0,1,2,3 · valeurs 0123 · pic observé 4
                      ASSERTIONS GELÉES  SATISFAITES
                      assertion ajoutée pic===1  VIOLÉE

candidat reference-1  journal 0,1,2,3 · valeurs 0123 · pic observé 1
                      ASSERTIONS GELÉES  SATISFAITES
                      assertion ajoutée pic===1  satisfaite
```

NC1 satisfait donc **exactement** la vérité gelée de A05 et n'échouait que sur
l'assertion ajoutée. Celle-ci n'était pas entraînée par les autres : elle
ajoutait une exigence de score.

Les autres contrôles de pic de la matrice ont été inspectés et ne présentent pas
ce défaut :

```text
A03  peak === 3    ENTRAÎNÉ    « 3 invoquées au 1ᵉʳ checkpoint » avec 3 tâches
A09  peak <= 2     INERTE      les tâches `resolved` se règlent dans l'invocation ;
                               le pic ne dépasse jamais 1
B01  peak <= 2     ENTRAÎNÉ    si 2,3,4 n'ont pas démarré, au plus {0,1} l'ont fait
B02  peak <= 2     ENTRAÎNÉ    même raisonnement
axe B autres       NOTÉS       la borne EST la vérité de l'axe B
```

### 10.3 Réparation appliquée

```text
AUTORITÉ           retirer l'assertion notée absente du texte gelé
                   restaurer A05 à la sémantique déjà gelée
AMENDEMENT DE CONTRAT A05   = 0
```

Deux fichiers, la ligne de contrôle et son miroir visible :

```text
control/holdout-axis-a.mjs          A05 : `if (h.peak() !== 1) return ko(...)` retiré
participant/tests/visible.test.mjs  A05 : `assert.equal(h.peak(), 1)` retiré
```

Le pic reste **observé et journalisé en diagnostic** dans le détail de la ligne.
Il ne conditionne plus aucun verdict.

### 10.4 Réexécution ciblée

```text
A05 · reference-1   PASS   120 ms   journal 0,1,2,3 · valeurs en ordre · pic observé 1
A05 · reference-2   PASS   118 ms   journal 0,1,2,3 · valeurs en ordre · pic observé 1
A05 · nc1           PASS   114 ms   journal 0,1,2,3 · valeurs en ordre · pic observé 4
```

NC1 passe désormais A05. La borne qu'il viole reste notée par sept lignes de
l'axe B (§3.3). Aucune perte de couverture.

## 11. A07 — amendement humain du contrat gelé

### 11.1 Le texte gelé d'origine était mécaniquement impossible

```text
A07 TEXTE GELÉ D'ORIGINE
= 200 tâches · limit 7 · règlement en ordre d'index globalement DÉCROISSANT
= 200 résultats en ordre d'index
```

À tout instant, les tâches démarrées sont exactement `{0..s-1}` avec
`s = réglées + en vol` et `en vol ≤ limit`. Le j-ième règlement porte donc sur un
index `≤ j + limit − 2` :

```text
règlement #  1   index max possible =   6   exigé par l'ordre décroissant = 199   IMPOSSIBLE
règlement # 50   index max possible =  55   exigé = 150                           IMPOSSIBLE
règlement # 97   index max possible = 102   exigé = 103                           IMPOSSIBLE
règlement # 98   index max possible = 103   exigé = 102                           possible

→ 97 des 200 règlements sont impossibles sous le contrat gelé
```

Le premier règlement à lui seul suffit : il faudrait régler l'index 199 alors que
seuls les index `≤ 6` peuvent être en vol.

```text
FROZEN CONTRACT CONTRADICTION = DEMONSTRATED
```

L'amendement silencieux qui a suivi cette découverte, au moment de la
matérialisation, est enregistré en §9.2. Il reste enregistré.

### 11.2 Sémantique finale, amendée par autorité humaine

```text
ROW A07 · AXE A · HIDDEN · 200 tâches · limit 7

fenêtres consécutives FIXES
  W0 = 0..6 · W1 = 7..13 · W2 = 14..20 · … · W28 = 196..199

traitement
  fenêtres en ordre croissant d'intervalle
  pour chaque fenêtre :
    attendre que TOUTE tâche de la fenêtre ait démarré
    régler les tâches en index STRICTEMENT DÉCROISSANT
    ne régler aucune tâche de la fenêtre suivante avant l'achèvement de la courante

forme effective du règlement
  6,5,4,3,2,1,0 · 13,12,11,10,9,8,7 · 20,19,18,17,16,15,14 · … · 199,198,197,196
```

Faisabilité : après les 7 règlements de `W0`, les tâches démarrées sont
`{0..13}` et les tâches en vol sont exactement `W1`. L'invariant se reproduit à
chaque fenêtre ; la dernière compte 4 tâches (`200 = 28 × 7 + 4`).

### 11.3 Condition de score, volontairement étroite

```text
A07 VÉRITÉ NOTÉE
= les 200 résultats rendus conservent l'ordre d'index d'origine

A07 pic ≤ 7
= NON NOTÉ
= propriété globale du contrat, notée par l'axe B
= observée et journalisée en DIAGNOSTIC
```

Aucune pondération n'est modifiée par duplication d'assertion.

### 11.4 Invariants préservés

```text
ROW ID A07 · AXE A · VISIBILITY HIDDEN
TOTAL 30 · AXE A 9 · VISIBLE 10 · HIDDEN 20 · SUBJECTIF 0
aucune autre ligne de vérité amendée
```

### 11.5 Réexécution ciblée — 9 exécutions

```text
A07 · reference-1   PASS   123 ms   200 résultats en ordre d'index · pic observé 7
A07 · reference-2   PASS   118 ms   200 résultats en ordre d'index · pic observé 7
A07 · nc1           PASS   114 ms   200 résultats en ordre d'index · pic observé 200
A07 · nc2           FAIL   117 ms   ordre incorrect
A07 · nc3           PASS   117 ms   pic observé 7
A07 · nc4           PASS   114 ms   pic observé 7
A07 · nc5           PASS   117 ms   pic observé 7
A07 · nc6           PASS   115 ms   pic observé 7
A07 · nc7           PASS   117 ms   pic observé 7
```

NC2 — le défaut visé par A07 — échoue toujours : la forme de règlement amendée
diffère de l'ordre d'index, donc un candidat qui rend l'ordre de règlement
produit `6,5,4,…` au lieu de `0,1,2,…`. NC1 passe désormais, le pic n'étant plus
noté ici ; sa violation de borne reste détectée par sept lignes de l'axe B.

A07 n'a été ajusté pour reproduire aucune signature négative antérieure.

## 12. Verdict

```text
CONTRAT MATÉRIALISÉ            exact, A07 dans sa sémantique amendée par l'humain
MATRICE                        30 · 10 visibles · 20 cachées · 0 subjective
A05 RÉALISATION                réparée · aucun amendement de contrat
A07                            amendement humain matérialisé exactement
B07 LECTURE                    ratifiée par l'humain, consignée
RÉFÉRENCE 1                    30/30 · T1/T2/T3 PASS · 0 inconclusive
RÉFÉRENCE 2                    30/30 · T1/T2/T3 PASS · 0 inconclusive
REFERENCE INDEPENDENCE         PASS
NC1..NC7                       code inchangé · défauts intentionnels détectés
NC7 TÉMOIN NATUREL             PASS
OP-W1                          PASS à la valeur gelée · INCONCLUSIVE
ROW ISOLATION                  PASS
ROW-ORDER INDEPENDENCE         PASS
HIDDEN-TRUTH LEAKAGE           0
EVALUATION ARTIFACT FAILURE    0
INCONCLUSIVE, toutes campagnes 0
R2                             PASS
WATCHDOG                       20 000 ms · HUMAN FROZEN · code inchangé
GIT                            0

CASE-005 MATERIALIZATION / PREQUALIFICATION = PASS
```
