# LOCAL MISSION CONSOLE v0 — correction de la conception bornée de U-01

## 1. Statut et portée

```text
TYPE
= correction de conception, ratifiée par l'humain

OBJET
= corriger le défaut matériel de la conception D1 gelée par l'autorité 40,
  et rendre la remédiation bornée de U-01 exécutable

CE DOCUMENT
= autorité de correction de conception
= GELÉ

CODE MODIFIÉ
= AUCUN ICI

TESTS EXÉCUTÉS
= 0
```

```text
AUTORITÉ DE RÉPONSE PRODUIT GOUVERNANTE
= 39-LOCAL-MISSION-CONSOLE-V0-U01-PRODUCT-RESPONSE-SELECTION.md
= blob 1f25eb85170d09853865ef0ee59c2eb7dee345de
= NON ROUVERTE

CONCEPTION DÉFECTUEUSE
= 40-LOCAL-MISSION-CONSOLE-V0-U01-BOUNDED-DISCOVERY-REMEDIATION-DESIGN.md
= blob 6f161cbb8d852f52afe15848c1b88664cfb207e5
= NON ÉDITÉE
= PRÉSERVÉE
= SUPERSÉDÉE DANS UNE PORTÉE EXACTE, ET LÀ SEULEMENT

CONCEPTION NORMATIVE DE LA CONSOLE
= 32-LOCAL-MISSION-CONSOLE-V0-IMPLEMENTATION-DESIGN.md
= blob 788766873f64a942fe9f1c1f597653b46e76a2c6
= NON ROUVERTE
```

```text
RÉPONSE PRODUIT HUMAINE
= REMEDIATE_BOUNDED_DISCOVERY
= INCHANGÉE

NOUVELLE DÉCISION HUMAINE
= AUCUNE
```

```text
AUTORITÉ 40, PARTIES VALIDES
+ AUTORITÉ 41
= CONCEPTION D'IMPLÉMENTATION COMPLÈTE
```

## 2. Le défaut matériel ratifié

```text
D1 DE L'AUTORITÉ 40
= NON EXÉCUTABLE TELLE QU'ÉCRITE
```

D1 ajoutait `missions` aux racines RESULT tout en conservant le filtre global
« tout `.json` sauf `mission.json` ». Sous `missions/**`, ce filtre expose donc
des fichiers JSON sans rapport comme candidats RESULT.

L'autorité 40 a nommé cette largeur au § 7.1 et l'a ACCEPTÉE comme propriété
héritée. C'est là qu'elle a fauté : l'exigence gouvernante qu'elle devait
tenir était explicite.

```text
UN ARTEFACT SANS RAPPORT
NE DOIT PAS DEVENIR CANDIDAT DU SEUL FAIT QU'IL EST SOUS missions/
```

```text
D1 SÉLECTIONNÉE PAR L'AUTORITÉ 40
= NON CONFORME À SA PROPRE EXIGENCE DE MINIMALITÉ ET DE NATURE DES CANDIDATS
```

Nommer honnêtement une largeur ne la rend pas conforme.

## 3. Démonstration directe du défaut

### 3.1 Largeur du filtre RESULT, avec le code publié NON MODIFIÉ

Dépôt temporaire hors du dépôt du Lab, `listCandidates` publiée appelée telle
quelle :

```text
RESULT roots = tooling/result-instance/live-dogfood
             · tooling/result-instance/representability

candidats rendus
  tooling/result-instance/live-dogfood/001/result.json
  tooling/result-instance/representability/a.json
  tooling/result-instance/representability/b.json
  tooling/result-instance/representability/metadata.json   ← JSON SANS RAPPORT
```

```text
LE FILTRE RESULT GLOBAL ACCEPTE DÉJÀ TOUT .json QUI N'EST PAS mission.json
= DÉMONTRÉ AVEC LE CODE PUBLIÉ
```

### 3.2 Exposition de D1 sous `missions/**`

Même dépôt temporaire, contenant :

```text
missions/x/mission.json
missions/x/result.json
missions/x/metadata.json
missions/x/unrelated.json
missions/x/envelope.md
missions/x/console-real-use-observations.md
```

Simulation fidèle de D1 — racines existantes + `missions`, filtre global
inchangé :

```text
CANDIDATS RESULT SOUS missions/
  missions/x/metadata.json      ← EXPOSÉ À TORT
  missions/x/result.json
  missions/x/unrelated.json     ← EXPOSÉ À TORT

missions/x/mission.json         NON candidat RESULT   (correct)
missions/x/envelope.md          NON candidat          (correct)
missions/x/console-real-use-observations.md  NON candidat  (correct)
```

```text
EXPOSITION DE JSON SANS RAPPORT PAR D1
= DÉMONSTRÉE
= non simplement inférée du rapport de contre-expertise
```

## 4. Rejet valide du resserrement global, conservé

```text
tooling/result-instance/representability/a.json
tooling/result-instance/representability/b.json
= CANDIDATS RESULT EXISTANTS LÉGITIMES, mesurés
```

Donc :

```text
FILTRE RESULT GLOBAL = basename result.json
= REJETÉ
= régresserait la couverture de candidats historique
```

```text
NETTOYAGE AUTORISÉ
= AUCUN
```

Ce rejet, déjà porté par l'autorité 40, reste valide et n'est pas rouvert.

## 5. Parties de l'autorité 40 conservées

Conservées telles quelles, après vérification d'identité directe :

```text
CHAÎNE DE DÉCOUVERTE COURANTE
= repo.mjs CANDIDATE_ROOTS → walk → selected → listCandidates
  → GET /api/candidates → peuplement client → routes de chargement confinées

CAUSE RACINE DE U-01
= couverture de racines uniquement

FILTRE MISSION
= basename mission.json

FILTRE RESULT COURANT
= tout .json sauf mission.json

CHANGEMENT DE CONTRAT DE ROUTE REQUIS        NON
CHANGEMENT DE SÉCURITÉ / CONFINEMENT REQUIS  NON
CHANGEMENT DU CONTRAT DE SÉLECTION CLIENT    NON
CHANGEMENT DU PIPELINE MISSION AVAL          NON
CHANGEMENT DU PIPELINE RÉSULTAT AVAL         NON

ENSEMBLES DE CANDIDATS HISTORIQUES           conservés
INVARIANTS AVAL                              conservés
CONCEPTION CÔTÉ MISSION                      conservée
ANALYSE ROUTE / SÉCURITÉ                     conservée
FIXTURES DE RÉGRESSION HISTORIQUES           conservées
EXCLUSION EOL                                conservée
EXCLUSION DES AUTRES OBSERVATIONS            conservée
```

```text
L'AUTORITÉ 40 N'EST PAS INVALIDE DANS SON ENSEMBLE
```

## 6. Partie exactement supersédée

```text
SUPERSÉDÉ
= « ajouter missions aux racines RESULT en conservant le filtre RESULT global
    inchangé »
= autorité 40, conception D1, et son § 7.1 qui accepte la propriété héritée

RIEN D'AUTRE
```

## 7. Sémantique de découverte corrigée

### 7.1 Découverte MISSION

```text
racines mission héritées
= INCHANGÉES

missions/
= AJOUTÉE comme racine bornée d'artefacts de mission

éligibilité sous TOUTES les racines mission
= basename exactement mission.json
```

Aucune correction n'est nécessaire côté MISSION : la règle globale existante
est déjà exactement `mission.json`.

### 7.2 Découverte RESULT

```text
racines result héritées
= INCHANGÉES

éligibilité sous les racines héritées
= INCHANGÉE
= y compris representability/a.json et representability/b.json

missions/
= AJOUTÉE comme racine bornée d'artefacts de mission

éligibilité sous missions/
= basename exactement result.json
```

### 7.3 Table normative

```text
missions/x/mission.json                        MISSION OUI   RESULT NON
missions/x/result.json                         MISSION NON   RESULT OUI
missions/x/envelope.md                         NON           NON
missions/x/console-real-use-observations.md    NON           NON
missions/x/metadata.json                       NON           NON
missions/x/anything-else.json                  NON           NON
```

```text
C'EST LA CORRECTION NORMATIVE
```

## 8. Conception au niveau du code

### 8.1 Formes inspectées

```text
C1  prédicat selected() sensible à la racine
    la racine courante est connue à la boucle de listCandidates ; elle est
    transmise à walk puis à selected
    surface : une constante ajoutée, un paramètre threadé, une branche

C2  descripteur de racine portant un mode
    exigerait soit de changer la forme de CANDIDATE_ROOTS, et donc la charge
    utile roots[] de la route, soit de maintenir en parallèle un tableau de
    chaînes pour la réponse
    → risque de changement de contrat de route, ou surface supérieure à C1

C3  conditionnelle locale dans la sélection de fichier de walk
    surface équivalente à C1 en paramètres, mais disperse l'éligibilité en
    deux endroits au lieu d'un
```

### 8.2 Sélection

```text
CONCEPTION SÉLECTIONNÉE
= C1

SÉLECTION
= DÉTERMINISTE

BRANCHE DE CONCEPTION EXIGEANT UNE DÉCISION HUMAINE
= AUCUNE
```

Critères gelés, dans l'ordre :

```text
1  sémantique corrigée exacte            C1 OUI, § 7.3 vérifiée par mesure
2  aucun changement de route              C1 OUI, roots[] reste un tableau de
                                          chaînes ; C2 en risque
3  aucun changement de sécurité           C1 OUI
4  aucune régression                      C1 OUI, § 9
5  surface sémantique minimale            C1 : une seule notion ajoutée,
                                          « racine à RESULT strict »
6  surface de code minimale               C1 : une constante, un paramètre,
                                          une branche, dans un seul fichier
7  test direct le plus simple             C1 : l'éligibilité reste dans UN
                                          prédicat unique ; C3 la disperse
```

### 8.3 Forme gelée

Sémantique à implémenter, exprimée sans imposer l'orthographe exacte :

```text
CANDIDATE_ROOTS
  MISSION  = racines héritées + 'missions'
  RESULT   = racines héritées + 'missions'
  → demeure un tableau de CHAÎNES par classe, pour que roots[] soit inchangée

UNE LISTE BORNÉE DE RACINES À RESULT STRICT
  = [ 'missions' ]

selected(candidateClass, name, root)
  non .json                                   → false
  MISSION                                     → name === 'mission.json'
  RESULT et root est à RESULT strict          → name === 'result.json'
  RESULT sinon                                → name !== 'mission.json'

walk(...) transmet la racine courante, fournie par listCandidates
```

```text
ARCHITECTURE POUR DES RACINES FUTURES HYPOTHÉTIQUES
= AUCUNE
```

## 9. Ensembles de candidats attendus

Mesurés contre l'état courant du dépôt, par simulation en lecture seule de la
règle corrigée.

```text
CANDIDATS MISSION = 5
  missions/001-decision-consequence-boundary/mission.json    59440
  tooling/mission-object/dogfood/001/mission.json            24278
  tooling/mission-object/dogfood/002/mission.json            25629
  tooling/mission-object/dogfood/003/mission.json            26473
  tooling/result-instance/live-dogfood/001/mission.json      51131

CANDIDATS RESULT = 4
  missions/001-decision-consequence-boundary/result.json     54690
  tooling/result-instance/live-dogfood/001/result.json        3580
  tooling/result-instance/representability/a.json             1251
  tooling/result-instance/representability/b.json             1482
```

```text
envelope.md candidat                    NON
tout .md candidat                       NON
representability/a.json conservé        OUI
representability/b.json conservé        OUI
```

```text
CES DÉCOMPTES EXACTS
= ATTENTES D'ACCEPTATION POUR L'ÉTAT COURANT DU DÉPÔT DE RÉGRESSION
≠ INVARIANT UNIVERSEL FUTUR

L'INVARIANT SÉMANTIQUE EST L'ÉLIGIBILITÉ, PAS UN DÉCOMPTE PERMANENT
```

## 10. Surface d'implémentation exacte

```text
FICHIER SOURCE À CHANGER
= tooling/console/repo.mjs
= CANDIDATE_ROOTS · la liste bornée de racines à RESULT strict ·
  la signature et la branche de selected() · le passage de la racine dans walk

FICHIER DE TEST À CHANGER
= tooling/console/tests/console.test.mjs
= UNIQUEMENT par AJOUT de cas
```

```text
INCHANGÉS, ET GELÉS COMME TELS
tooling/console/server.mjs
tooling/console/capture.mjs
tooling/console/program-state-adapter.mjs
tooling/console/mission-adapter.mjs
tooling/console/result-adapter.mjs
tooling/console/public/**
tooling/program-state/**
tooling/mission-object/**
tooling/result-instance/**
missions/**
.gitattributes
```

```text
AUTRE FICHIER DE PRODUCTION À CHANGER
= AUCUN IDENTIFIÉ PAR L'INSPECTION
```

`selected` et `walk` sont internes à `repo.mjs` ; aucun autre module ne les
importe. `server.mjs` importe `listCandidates` et `CANDIDATE_CLASSES`,
jamais les racines ni le prédicat.

## 11. Critères d'acceptation positifs

```text
P1  énumération MISSION du panneau B contient
    missions/001-decision-consequence-boundary/mission.json
P2  le contexte de mission du panneau C, hérité du panneau B, porte le
    même chemin
P3  énumération RESULT du panneau C contient
    missions/001-decision-consequence-boundary/result.json
P4  les quatre candidats MISSION préexistants demeurent
P5  les trois candidats RESULT préexistants demeurent,
    y compris representability/a.json et b.json
P6  la sélection normale de la mission nouvellement énumérée entre dans le
    pipeline inchangé chargement / validation / snapshot / rendu
P7  la sélection normale mission + résultat entre dans le pipeline inchangé
    association / contrat / faits / preuves
P8  aucune requête manuelle hors interface n'est nécessaire pour la
    fixture de régression authentique
```

## 12. Critères d'acceptation négatifs, obligatoires

```text
N1   missions/x/mission.json            NON candidat RESULT
N2   missions/x/envelope.md             candidat d'AUCUNE classe
N3   missions/x/console-real-use-observations.md  candidat d'AUCUNE classe
N4   missions/x/unrelated.json          NON candidat RESULT
N5   missions/x/metadata.json           NON candidat RESULT
N6   representability/a.json            TOUJOURS candidat RESULT
N7   representability/b.json            TOUJOURS candidat RESULT
N8   chemins hors racine                JAMAIS candidats
N9   échappements par lien              JAMAIS parcourus ni exposés
N10  JSON arbitraire ailleurs dans le dépôt  NON nouvellement exposé
N11  forme de charge utile de la route  INCHANGÉE, roots[] reste un tableau
                                        de chaînes
N12  le chargement d'un chemin candidat passe toujours par le confinement
     existant
```

```text
L'IMPLÉMENTATION N'EST PAS CONFORME SI N4 ET N5 NE PASSENT PAS
```

## 13. Plan de test

À AJOUTER à `tooling/console/tests/console.test.mjs`, dans le style publié.

```text
ÉNUMÉRATION, UNITAIRE / INTÉGRATION
T-E1  listCandidates(MISSION) contient le mission.json authentique
T-E2  listCandidates(RESULT)  contient le result.json authentique
T-E3  les quatre chemins MISSION historiques demeurent
T-E4  les trois chemins RESULT historiques demeurent
T-E5  aucun candidat, toutes classes, ne finit par .md
T-E6  envelope.md et console-real-use-observations.md absents des deux classes
T-E7  sur un dépôt temporaire portant missions/x/metadata.json et
      missions/x/unrelated.json, aucun des deux n'est candidat RESULT
T-E8  sur ce même dépôt, missions/x/result.json EST candidat RESULT
T-E9  sur ce même dépôt, un .json sans rapport sous une racine RESULT
      HÉRITÉE reste candidat, la sémantique héritée étant inchangée

HTTP / API
T-H1  GET /api/candidates?class=MISSION contient le chemin authentique
T-H2  GET /api/candidates?class=RESULT  contient le chemin authentique
T-H3  GET /api/mission?path=<mission authentique> vaut 200, validation ok,
      snapshot blob e80bc3d250920cee66b4d26bef497b6094395144
T-H4  GET /api/result?path=<résultat authentique>&missionPath=…&missionBlob=…
      vaut 200, associations rendues séparément, version de mission confirmée
T-H5  échappement de chemin toujours refusé en 403 sur les deux routes
T-H6  clés de la réponse de /api/candidates inchangées : candidates, roots,
      roots étant un tableau de chaînes

CÂBLAGE CLIENT
= SEULEMENT si l'architecture de la suite publiée le permet ; sinon consigner
  « NON EXERCÉ » plutôt qu'inventer un harnais
```

```text
NETTOYAGE DE TESTS SANS RAPPORT
= NON PRÉ-AUTORISÉ
```

## 14. Fixtures historiques, immuables

```text
missions/001-decision-consequence-boundary/mission.json
= blob e80bc3d250920cee66b4d26bef497b6094395144

missions/001-decision-consequence-boundary/result.json
= blob 69d2d1574eb3bf82148f23b36f4e2f4f1c1a4e07
```

```text
MODIFIÉES   JAMAIS

envelope.md                        INCHANGÉ
console-real-use-observations.md   INCHANGÉ
```

## 15. Invariants de l'autorité 32

La conception corrigée ne change que :

```text
COUVERTURE ET ÉLIGIBILITÉ DE DÉCOUVERTE DE CANDIDATS SOUS missions/
```

Tous inchangés :

```text
autorité de chargement
autorité de lecture du dépôt
confinement à la racine du dépôt
confinement symlink / transitif
absence de lecteur de fichiers générique
frontière d'exécution en lecture seule
politique Host
politique Origin
politique Sec-Fetch-Site
validation Mission Object
validation Result Instance
liaison snapshot / version de mission
association de source
association de contrat de retour
sémantique et autorité de preuve
trois panneaux produit
interdiction de vérification de preuve PROGRAM-STATE au panneau A
```

```text
AUTORITÉ 32
= NON ROUVERTE

DÉFAUT DE CONFORMITÉ À L'AUTORITÉ 32 CRÉÉ PAR CETTE CONCEPTION
= AUCUN

CHANGEMENTS DE CONTRAT DE ROUTE          = 0
CHANGEMENTS DE FRONTIÈRE DE SÉCURITÉ     = 0
SÉMANTIQUE NOUVELLE DE TYPE DE CANDIDAT  = 0
DÉCOUVERTE GÉNÉRIQUE DU DÉPÔT            = NON
```

Un prédicat sensible à la racine à l'intérieur du mécanisme d'énumération
existant reste une intégration ordinaire. Aucun registre de types d'artefacts,
aucune découverte par schéma, aucune analyse de contenu pendant l'énumération,
aucune abstraction de découverte réutilisable n'est introduite.

## 16. Pare-feu de fin de ligne

```text
.gitattributes
= NON INCLUS DANS LA CONCEPTION NI DANS SON IMPLÉMENTATION

RÉPONSE DE DÉCOUVRABILITÉ U-01
≠ RÉPONSE DE DURABILITÉ EOL missions/**
```

```text
SI LES FINS DE LIGNE AFFECTENT L'EXÉCUTION DES TESTS
→ RAPPORTER SÉPARÉMENT
→ NE PAS RÉPARER SILENCIEUSEMENT
```

## 17. Pare-feu des autres observations

Non remédiés, et aucun critère ne les touche :

```text
fraîcheur du bandeau de contexte
regroupement / étiquetage temporel des divergences de preuve
```

```text
NETTOYAGE INCIDENT
= AUCUN
```

## 18. Conséquence d'autorisation

```text
CONCEPTION TECHNIQUE CORRIGÉE
= GELÉE

IMPLÉMENTATION
= AUTORISÉE contre
  AUTORITÉ 40, PARTIES VALIDES + AUTORITÉ 41
≠ autorisée contre D1 de l'autorité 40 prise à la lettre

IMPLÉMENTATION
= NON COMMENCÉE
```

## 19. Ce que ce document ne fait pas

```text
CODE DE CONSOLE MODIFIÉ                     NON
CODE DE TEST MODIFIÉ                        NON
TESTS EXÉCUTÉS                              0
AUTORITÉ 40 ÉDITÉE                          NON
AUTORITÉ 39 ROUVERTE                        NON
AUTORITÉ 32 ROUVERTE                        NON
AUTORITÉS 00 À 40 MODIFIÉES                 NON
missions/** MODIFIÉ                         NON
.gitattributes MODIFIÉ                      NON
04-OBSERVATION-RECORD.md MODIFIÉ            NON
OUTILLAGE EXISTANT MODIFIÉ                  NON
NOUVELLE DÉCISION PROGRAM-STATE             AUCUNE
NOUVELLE REPRÉSENTATION                     AUCUNE
NOUVELLE AIRE D'OUTILLAGE                   AUCUNE
TOOLING-EXPERIMENT-004                      AUCUNE
AUTRE OBSERVATION REMÉDIÉE                  AUCUNE
U-01 DÉCLARÉ CORRIGÉ                        NON
```

```text
DÉFAUT MATÉRIEL DE D1
= DÉMONTRÉ

SÉMANTIQUE CORRIGÉE
= GELÉE, root-sensible côté RESULT seulement

IMPLÉMENTATION
= AUTORISÉE, NON COMMENCÉE
```
