# LOCAL MISSION CONSOLE v0 — conception de la remédiation bornée de U-01

## 1. Statut et portée

```text
TYPE
= conception technique bornée, déterministe

OBJET
= geler le plus petit changement conforme de découverte de candidats qui rende
  les artefacts authentiques de missions/ atteignables par la sélection
  normale des panneaux B et C

CE DOCUMENT
= autorité de conception de remédiation
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
= INCHANGÉE

CONCEPTION NORMATIVE DE LA CONSOLE
= 32-LOCAL-MISSION-CONSOLE-V0-IMPLEMENTATION-DESIGN.md
= blob 788766873f64a942fe9f1c1f597653b46e76a2c6
= NON ROUVERTE
```

```text
CLASSE DE REMÉDIATION
= INTÉGRATION PRODUIT ORDINAIRE

NOUVELLE REPRÉSENTATION
= NO

TOOLING-EXPERIMENT-004
= NO
```

## 2. Le problème U-01

```text
énumération normale du panneau B          mission authentique ABSENTE
énumération de résultat du panneau C      résultat authentique ABSENT
requête manuelle hors interface           REQUISE en usage authentique
```

Artefacts authentiques visés :

```text
missions/001-decision-consequence-boundary/mission.json
missions/001-decision-consequence-boundary/result.json
```

Compagnons du même répertoire, qui ne doivent devenir candidats d'aucune
classe :

```text
missions/001-decision-consequence-boundary/envelope.md
missions/001-decision-consequence-boundary/console-real-use-observations.md
```

```text
ARTEFACT CHARGEABLE PAR UNE ROUTE CONFINÉE
≠ ARTEFACT DÉCOUVRABLE PAR L'ÉNUMÉRATION

U-01 PORTE SUR LE SECOND
```

## 3. Chaîne de découverte courante, reconstruite depuis le code publié

### 3.1 Racines de candidats

```text
FICHIER      tooling/console/repo.mjs
CONSTANTE    CANDIDATE_ROOTS   (lignes 184 à 193)

MISSION
= tooling/mission-object/dogfood
= tooling/result-instance/live-dogfood

RESULT
= tooling/result-instance/live-dogfood
= tooling/result-instance/representability

PERTINENCE SÉCURITÉ    aucune — l'énumération n'autorise rien
PERTINENCE SÉMANTIQUE  détermine intégralement la couverture de découverte
```

### 3.2 Filtrage

```text
FICHIER   tooling/console/repo.mjs
FONCTION  selected(candidateClass, name)   (lignes 198 à 201)

COMPORTEMENT MESURÉ
= rejette tout nom ne se terminant pas par « .json »
= MISSION : accepte UNIQUEMENT le nom de base « mission.json »
= RESULT  : accepte tout « .json » dont le nom de base n'est PAS « mission.json »

FILTRAGE PAR SCHÉMA        AUCUN
FILTRAGE PAR CONTENU       AUCUN
INFÉRENCE DE TYPE          AUCUNE
CONVENTION DE NOMMAGE      nom de base + extension, et rien d'autre

PERTINENCE SÉCURITÉ    aucune
PERTINENCE SÉMANTIQUE  détermine intégralement la nature des candidats
```

### 3.3 Parcours

```text
FICHIER   tooling/console/repo.mjs
FONCTION  walk(repository, relativeDirectory, candidateClass, depth, out)

MAX_DEPTH        3
MAX_CANDIDATES   200
LIENS            jamais suivis — dirent.isSymbolicLink() → continue
RACINE ABSENTE   énumération vide, et non une erreur
CHEMINS          composés relativement à repository.realRoot

PERTINENCE SÉCURITÉ    bornes de profondeur et de nombre, refus des liens
PERTINENCE SÉMANTIQUE  portée de la récursion
```

### 3.4 Point d'entrée et route

```text
FICHIER   tooling/console/repo.mjs
FONCTION  listCandidates(repository, candidateClass)
= valide la classe contre CANDIDATE_CLASSES
= parcourt chaque racine de la classe
= trie par chemin
= rend { roots, candidates }

FICHIER   tooling/console/server.mjs   (lignes 191 à 201)
ROUTE     GET /api/candidates?class=MISSION|RESULT
= valide la classe
= rend listCandidates(repository, candidateClass) en 200

IMPORTS DE server.mjs DEPUIS repo.mjs
= listCandidates · CANDIDATE_CLASSES
= PAS CANDIDATE_ROOTS
```

### 3.5 Peuplement client

```text
FICHIER   tooling/console/public/console.mjs   (lignes 399 à 404)
= requestJson('/api/candidates?class=MISSION') → fill(missionSelect, …)
= requestJson('/api/candidates?class=RESULT')  → fill(resultSelect, …)

AUCUNE RESTRICTION CLIENT SUPPLÉMENTAIRE
= le client affiche ce que la route rend
```

### 3.6 Chemin sélectionné et aval

```text
le chemin sélectionné part vers /api/mission?path= ou /api/result?path=…
→ confine() côté serveur
→ capture · décodage strict · parse · validate
→ snapshot · rendu       (mission)
→ associations · contrat · faits · preuves   (résultat)

CE SEGMENT EST INDÉPENDANT DE L'ÉNUMÉRATION
```

### 3.7 Ensembles de candidats mesurés au HEAD courant

```text
MISSION   roots = tooling/mission-object/dogfood · tooling/result-instance/live-dogfood
  tooling/mission-object/dogfood/001/mission.json            24278
  tooling/mission-object/dogfood/002/mission.json            25629
  tooling/mission-object/dogfood/003/mission.json            26473
  tooling/result-instance/live-dogfood/001/mission.json      51131
  count = 4

RESULT    roots = tooling/result-instance/live-dogfood · tooling/result-instance/representability
  tooling/result-instance/live-dogfood/001/result.json        3580
  tooling/result-instance/representability/a.json             1251
  tooling/result-instance/representability/b.json             1482
  count = 3
```

Mesurés en appelant la fonction publiée, non recopiés du rapport d'usage réel.

## 4. Cause racine exacte

```text
CAUSE RACINE DE U-01
= COUVERTURE DE RACINES UNIQUEMENT
```

Démonstration, en appliquant le filtre EXISTANT aux fichiers de `missions/` :

```text
mission.json                       MISSION true   RESULT false
result.json                        MISSION false  RESULT true
envelope.md                        MISSION false  RESULT false
console-real-use-observations.md   MISSION false  RESULT false
```

```text
LE FILTRE EXISTANT DONNE DÉJÀ EXACTEMENT LA BONNE RÉPONSE
POUR missions/**
```

Ce qui n'est PAS en cause :

```text
FILTRAGE           non — il classe déjà correctement les quatre fichiers
POLITIQUE DE CHEMIN non — confine() accepte déjà ces chemins
CONTRAT DE ROUTE    non — /api/mission et /api/result les chargent déjà
RESTRICTION CLIENT  non — le client affiche ce que la route rend
```

```text
missions/ N'EST DANS AUCUNE DES DEUX LISTES DE RACINES
= SEULE ET ENTIÈRE CAUSE
```

## 5. Candidats de conception évalués

### D1 — ajouter `missions` aux deux listes de racines

```text
FICHIERS QUI CHANGERAIENT   tooling/console/repo.mjs   (CANDIDATE_ROOTS)
CHANGEMENT DE DÉCOUVERTE    une entrée de racine ajoutée à chaque classe
EFFET CANDIDAT MISSION      + missions/001-…/mission.json
EFFET CANDIDAT RESULT       + missions/001-…/result.json
EFFET NON-CANDIDAT          envelope.md et console-real-use-observations.md
                            restent exclus par le filtre d'extension EXISTANT
EFFET SÉCURITÉ              aucun — même autorité de lecture, mêmes bornes,
                            liens toujours refusés, confinement de chargement
                            inchangé
EFFET CONTRAT DE ROUTE      aucun — la forme { roots[], candidates[] } est
                            inchangée ; roots porte une entrée de plus
EFFET AUTORITÉ 32           aucun — l'autorité 32 ne gèle aucune racine
GÉNÉRICITÉ / PORTÉE         bornée à une aire de dépôt nommée
IMPACT TEST                 aucune assertion existante modifiée ; cas ajoutés
AVANTAGES                   plus petit changement sémantique et plus petite
                            surface d'implémentation possibles
RISQUES                     hérite de la largeur du filtre RESULT (§ 7)
BORNÉ                       OUI
```

### D2 — D1 plus resserrement du filtre RESULT à `result.json`

```text
EFFET CANDIDAT RESULT   retirerait representability/a.json et b.json
NON-RÉGRESSION          VIOLÉE
BORNÉ                   NON — REJETÉ
```

### D3 — filtres par racine

```text
CHANGEMENT SÉMANTIQUE   introduit une notion nouvelle, le filtre par racine
SURFACE                 plus large que D1 sans bénéfice démontré
BORNÉ                   NON POUR CE BESOIN — REJETÉ
```

### D4 — saisie de chemin arbitraire comme flux produit normal

```text
INTERDIT PAR L'AUTORITÉ 39 § 6
REJETÉ
```

### D5 — découverte récursive générique du dépôt

```text
INTERDIT PAR L'AUTORITÉ 39 § 6 et par la règle d'expansion
et NON NÉCESSAIRE, la réponse bornée étant atteignable
REJETÉ
```

## 6. Conception sélectionnée

```text
CONCEPTION SÉLECTIONNÉE
= D1

SÉLECTION
= DÉTERMINISTE

BRANCHE DE CONCEPTION EXIGEANT UNE DÉCISION HUMAINE
= AUCUNE
```

Application des critères gelés, dans l'ordre :

```text
1  satisfait les deux points de découverte de U-01         D1 OUI
2  préserve la nature des objets candidats                 D1 OUI, filtre inchangé
3  préserve les invariants de l'autorité 32                D1 OUI, § 8
4  conserve la couverture de candidats existante           D1 OUI, § 7
5  plus petit changement sémantique                        D1 : aucune sémantique
                                                           nouvelle, seulement une
                                                           couverture élargie
6  plus petite surface d'implémentation                    D1 : une constante,
                                                           un fichier
7  comportement testable indépendamment le plus simple     D1 : listCandidates
                                                           observable directement
```

```text
LA PRÉFÉRENCE DE STYLE DE CODE N'EST PAS UNE BRANCHE MATÉRIELLE
```

## 7. Sémantique de candidats après remédiation

Mesurée par simulation en lecture seule de la logique de parcours publiée.

```text
CANDIDATS MISSION, APRÈS
  missions/001-decision-consequence-boundary/mission.json    59440
  tooling/mission-object/dogfood/001/mission.json            24278
  tooling/mission-object/dogfood/002/mission.json            25629
  tooling/mission-object/dogfood/003/mission.json            26473
  tooling/result-instance/live-dogfood/001/mission.json      51131
  count = 5

CANDIDATS RESULT, APRÈS
  missions/001-decision-consequence-boundary/result.json     54690
  tooling/result-instance/live-dogfood/001/result.json        3580
  tooling/result-instance/representability/a.json             1251
  tooling/result-instance/representability/b.json             1482
  count = 4
```

```text
envelope.md
= EXCLU des candidats MISSION
= EXCLU des candidats RESULT

console-real-use-observations.md
= EXCLU des candidats MISSION
= EXCLU des candidats RESULT

par le filtre d'extension DÉJÀ EN PLACE, sans filtre nouveau
```

Répertoires de mission, comportement gelé :

```text
répertoire ne contenant que mission.json
→ UN candidat MISSION
→ AUCUN candidat RESULT
= correct : une mission non exécutée n'a pas de résultat

répertoire contenant mission.json et result.json
→ UN candidat MISSION
→ UN candidat RESULT
= cas courant
```

Profondeur mesurée sous `missions` :

```text
missions (0) → répertoire de mission (1) → fichiers à la profondeur 1
MAX_DEPTH 3 = LARGEMENT SUFFISANT, et inchangé
```

### 7.1 Propriété héritée, énoncée honnêtement

```text
UN .json SANS RAPPORT PLACÉ SOUS missions/** DEVIENDRAIT UN CANDIDAT RESULT
```

Ce n'est pas introduit par cette remédiation :

```text
la classe RESULT accepte déjà TOUT .json dont le nom n'est pas mission.json,
et elle le fait déjà sous tooling/result-instance/representability
```

```text
RESSERRER CE FILTRE
= retirerait des candidats existants valides
= VIOLERAIT LA NON-RÉGRESSION
= REJETÉ
```

La garantie retenue est donc celle que l'usage réel a démontrée et que la
conception doit tenir : les compagnons non-`.json` d'un répertoire de mission
ne deviennent jamais candidats. Pour le reste, `missions/**` est l'aire
d'artefacts de mission du Lab, et la même convention que les racines
existantes s'y applique.

## 8. Invariants de l'autorité 32, préservés

```text
COUVERTURE DE DÉCOUVERTE                     CHANGÉE
AUTORITÉ DE CHARGEMENT                       INCHANGÉE
AUTORITÉ DE LECTURE DU DÉPÔT                 INCHANGÉE
CONFINEMENT À LA RACINE DU DÉPÔT             INCHANGÉ
CONFINEMENT SYMLINK / TRANSITIF              INCHANGÉ
LECTEUR DE FICHIERS GÉNÉRIQUE                TOUJOURS ABSENT
MUTATION DE DÉPÔT À L'EXÉCUTION              TOUJOURS ABSENTE
POLITIQUE HOST                               INCHANGÉE
POLITIQUE ORIGIN                             INCHANGÉE
POLITIQUE SEC-FETCH-SITE                     INCHANGÉE
VALIDATION MISSION OBJECT                    INCHANGÉE
VALIDATION RESULT INSTANCE                   INCHANGÉE
LIAISON SNAPSHOT / VERSION DE MISSION        INCHANGÉE
ASSOCIATION DE SOURCE                        INCHANGÉE
ASSOCIATION DE CONTRAT DE RETOUR             INCHANGÉE
AUTORITÉ DE LECTURE DE PREUVE                INCHANGÉE
NOMBRE DE PANNEAUX                           EXACTEMENT 3
VÉRIFICATION DE PREUVE PROGRAM-STATE         TOUJOURS NON EXÉCUTÉE
```

Faits établis par inspection qui rendent cela vrai :

```text
CANDIDATE_ROOTS n'est référencée QUE dans repo.mjs, à sa déclaration et à son
unique usage dans listCandidates

server.mjs importe listCandidates et CANDIDATE_CLASSES, jamais CANDIDATE_ROOTS

les chaînes de racines n'apparaissent nulle part ailleurs dans la console

l'autorité 32 ne gèle AUCUNE racine de candidat : sa route R5 gèle la forme
{ roots[], candidates: [ { path, bytes } ] } et la note
« COMMODITÉ DE SÉLECTION, PAS UNE FRONTIÈRE DE SÉCURITÉ »
```

```text
CHANGEMENTS DE CONTRAT DE ROUTE
= 0

SÉMANTIQUE NOUVELLE DE TYPE DE CANDIDAT
= 0

DÉCOUVERTE GÉNÉRIQUE DU DÉPÔT
= NON

AUTORITÉ 32
= NON ROUVERTE
```

## 9. Non-régression de la couverture existante

```text
CANDIDATS MISSION HISTORIQUES VALIDES     TOUS CONSERVÉS   4 → 4 conservés
CANDIDATS RESULT HISTORIQUES VALIDES      TOUS CONSERVÉS   3 → 3 conservés

COUVERTURE COURANTE + COUVERTURE BORNÉE DE LA MISSION AUTHENTIQUE
= INTENTION

REMPLACEMENT DES SURFACES dogfood / live-dogfood / representability
= AUCUN

NETTOYAGE OPPORTUNISTE
= AUCUN
```

## 10. Surface d'implémentation exacte

```text
FICHIER SOURCE À CHANGER
= tooling/console/repo.mjs
= UNIQUEMENT la constante CANDIDATE_ROOTS

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
tooling/console/public/index.html
tooling/console/public/console.css
tooling/console/public/console.mjs
tooling/program-state/**
tooling/mission-object/**
tooling/result-instance/**
.gitattributes
missions/**
```

Assertions existantes du suite publiée, vérifiées additives :

```text
ligne 1418  .some(path === HISTORICAL.missionPath)        reste vraie
ligne 1421  chaque candidat MISSION finit par mission.json reste vraie
ligne 1426  .some(path === HISTORICAL.resultPath)          reste vraie
ligne 1432  listCandidates(MISSION).length >= 4            reste vraie, 5
ligne 526   clés de réponse = candidates, roots            inchangées
```

```text
MODIFICATION D'UNE ASSERTION EXISTANTE
= AUCUNE ATTENDUE
```

## 11. Critères d'acceptation positifs

```text
P1  candidat MISSION du panneau B contient
    missions/001-decision-consequence-boundary/mission.json
P2  le contexte de mission du panneau C, hérité du panneau B, porte le
    même chemin
P3  candidat RESULT du panneau C contient
    missions/001-decision-consequence-boundary/result.json
P4  les 4 candidats MISSION historiques sont conservés
P5  les 3 candidats RESULT historiques sont conservés
P6  la sélection normale de la nouvelle mission conduit à
    chargement confiné → capture → validation Mission Object → identité de
    snapshot → rendu déterministe
P7  la sélection normale du nouveau résultat conduit à
    chargement confiné → capture → validation structurelle → association de
    source → association de contrat de retour → agrégat → confirmation de
    version de mission → validation de contrat → présentation des faits →
    présentation des preuves
P8  aucune requête manuelle hors interface n'est nécessaire
```

## 12. Critères d'acceptation négatifs et de sécurité

```text
N1  aucun candidat hors racine du dépôt
N2  aucun échappement par lien symbolique dans l'énumération
N3  aucun .json de répertoire sans rapport hors des racines gelées
N4  aucun Markdown candidat, d'aucune classe
N5  envelope.md jamais candidat MISSION ni RESULT
N6  console-real-use-observations.md jamais candidat MISSION ni RESULT
N7  aucun parcours générique de fichiers de preuve
N8  aucun nouveau point d'entrée en écriture
N9  refus de chemin hors racine inchangé sur /api/mission et /api/result
N10 politiques Host / Origin / Sec-Fetch-Site inchangées
```

```text
SÉMANTIQUE DE SÉCURITÉ NOUVELLE
= AUCUNE CONÇUE ICI
```

## 13. Plan de test gelé

À AJOUTER à `tooling/console/tests/console.test.mjs`, dans le style existant.

```text
TESTS D'ÉNUMÉRATION, UNITAIRES / INTÉGRATION
T-E1  listCandidates(MISSION) contient le mission.json authentique
T-E2  listCandidates(RESULT)  contient le result.json authentique
T-E3  listCandidates(MISSION) conserve les 4 chemins historiques
T-E4  listCandidates(RESULT)  conserve les 3 chemins historiques
T-E5  aucun candidat, toutes classes, ne se termine par .md
T-E6  envelope.md et console-real-use-observations.md absents des deux classes

TESTS HTTP / API COMPORTEMENTAUX
T-H1  GET /api/candidates?class=MISSION contient le chemin authentique
T-H2  GET /api/candidates?class=RESULT  contient le chemin authentique
T-H3  GET /api/mission?path=<mission authentique> vaut 200, validation ok,
      snapshot blob e80bc3d250920cee66b4d26bef497b6094395144
T-H4  GET /api/result?path=<résultat authentique>&missionPath=…&missionBlob=…
      vaut 200, associations de source et de contrat rendues séparément,
      confirmation de version de mission vraie
T-H5  échappement de chemin toujours refusé en 403 sur les deux routes

TESTS DE CÂBLAGE CLIENT
= SEULEMENT si l'architecture de la suite publiée le permet
= la suite courante n'exerce pas le DOM ; dans ce cas, consigner
  « NON EXERCÉ » plutôt que d'inventer un harnais
```

```text
NETTOYAGE DE TESTS SANS RAPPORT
= NON PRÉ-AUTORISÉ
```

## 14. Fixture de régression historique de U-01

```text
missions/001-decision-consequence-boundary/mission.json
= blob e80bc3d250920cee66b4d26bef497b6094395144

missions/001-decision-consequence-boundary/result.json
= blob 69d2d1574eb3bf82148f23b36f4e2f4f1c1a4e07
```

```text
EMPLOYÉES COMME FIXTURES DE DÉCOUVERTE ET D'INTÉGRATION
MODIFIÉES
= JAMAIS

CE SONT DES ARTEFACTS HISTORIQUES DURABLES
```

## 15. Pare-feu de fin de ligne

```text
.gitattributes
= NON MODIFIÉ PAR CETTE CONCEPTION NI PAR SON IMPLÉMENTATION

RISQUE EOL missions/**
= NON RÉSOLU ICI, ET NON REVENDIQUÉ COMME RÉSOLU
```

```text
SI L'IMPLÉMENTATION RENCONTRE UN PROBLÈME LIÉ AUX FINS DE LIGNE
→ LE RAPPORTER SÉPARÉMENT
→ NE PAS LE RÉPARER SILENCIEUSEMENT
```

```text
RÉPONSE DE DÉCOUVRABILITÉ U-01
≠ RÉPONSE DE DURABILITÉ EOL
```

## 16. Pare-feu des autres observations

Aucun critère de cette conception ne remédie :

```text
fraîcheur du bandeau de contexte
regroupement / étiquetage temporel des divergences de preuve
```

```text
EFFET INCIDENT MESURÉ DE CETTE REMÉDIATION SUR CES POINTS
= AUCUN ATTENDU
= si l'implémentation en révèle un, le CONSIGNER sans élargir l'objectif
```

## 17. Conséquence d'autorisation

```text
CONCEPTION TECHNIQUE
= GELÉE

IMPLÉMENTATION
= AUTORISÉE COMME CONSÉQUENCE DÉTERMINISTE DE L'AUTORITÉ 39

IMPLÉMENTATION
= NON COMMENCÉE
```

L'implémentation ne touchera que les deux chemins gelés au § 10, et devra
satisfaire les critères des § 11, § 12 et § 13.

## 18. Ce que ce document ne fait pas

```text
CODE DE CONSOLE MODIFIÉ                     NON
CODE DE TEST MODIFIÉ                        NON
TESTS EXÉCUTÉS                              0
AUTORITÉ 32 ROUVERTE                        NON
AUTORITÉS 00 À 39 MODIFIÉES                 NON
missions/** MODIFIÉ                         NON
.gitattributes MODIFIÉ                      NON
04-OBSERVATION-RECORD.md MODIFIÉ            NON
OUTILLAGE EXISTANT MODIFIÉ                  NON
CONTRAT DE ROUTE CHANGÉ                     NON
SÉMANTIQUE DE SÉCURITÉ NOUVELLE             AUCUNE
DÉCOUVERTE GÉNÉRIQUE DU DÉPÔT               AUCUNE
NOUVELLE PRIMITIVE D'OUTILLAGE              AUCUNE
NOUVELLE REPRÉSENTATION                     AUCUNE
NOUVELLE AIRE D'OUTILLAGE                   AUCUNE
TOOLING-EXPERIMENT-004                      AUCUNE
AUTRE OBSERVATION REMÉDIÉE                  AUCUNE
NOUVELLE DÉCISION PROGRAM-STATE             AUCUNE
```

```text
U-01
= CAUSE RACINE GELÉE : COUVERTURE DE RACINES UNIQUEMENT

CONCEPTION BORNÉE
= GELÉE, DÉTERMINISTE

IMPLÉMENTATION
= AUTORISÉE, NON COMMENCÉE
```
