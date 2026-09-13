# LOCAL MISSION CONSOLE v0 — conception d'implémentation

## 1. Statut et autorité

```text
TYPE
= conception d'implémentation, ratifiée par l'humain

OBJET
= geler la conception prête à implémenter de LOCAL MISSION CONSOLE V0

CE DOCUMENT
= autorité de conception technique
= GELÉ

AUTORITÉ PRODUIT GOUVERNANTE
= 31-LOCAL-MISSION-CONSOLE-V0-PROGRAM-DIRECTION-SELECTION.md
= INCHANGÉE PAR CE DOCUMENT

PROSE D'ÉTUDE DE CONCEPTION NON MATÉRIALISÉE
= SUPERSÉDÉE PAR CE DOCUMENT

IMPLÉMENTATION
= AUCUNE ICI

NOUVELLE EXPÉRIENCE D'OUTILLAGE
= AUCUNE SÉLECTIONNÉE
```

Ce document est ce que l'implémentation devra suivre. Les études de conception
qui l'ont précédé n'étaient pas durables : elles ne sont pas des autorités, et
ce qu'elles contenaient de correct est réécrit ici, corrigé.

```text
CLASSE D'IMPLÉMENTATION
= INTÉGRATION ORDINAIRE

ÉCART SÉMANTIQUE CONCRET
= NON DÉMONTRÉ

NOUVELLE EXPÉRIENCE D'OUTILLAGE
= NON REQUISE POUR LA v0
```

## 2. La décision humaine

```text
DÉCISION
= local-mission-console-v0-implementation-design-ratified

RÉPONSE
= RATIFIER LA CONCEPTION D'IMPLÉMENTATION CORRIGÉE

QUATRE CORRECTIONS MATÉRIELLES
= INCORPORÉES
```

L'étude de restauration contrôlée est classée :

```text
RESTAURATION FINALE CONTRÔLÉE DE LA CONCEPTION
= PASS AVEC CORRECTIONS MATÉRIELLES

ARCHITECTURE GÉNÉRALE
= RETENUE
```

## 3. Les quatre corrections matérielles

Elles sont écrites ici parce qu'elles sont normatives, et parce qu'une
correction non consignée se reperd.

### 3.1 Correction 1 — sémantique HTTP

L'étude encodait les artefacts invalides en `200 OK` au motif que l'interface
savait afficher l'erreur. C'est faux.

```text
ARTEFACT INVALIDE
→ HTTP 422
→ CORPS = détails d'erreur structurés, affichables par l'utilisateur

DÉFAILLANCE APPLICATIVE / SERVEUR INATTENDUE
→ HTTP 500
```

```text
« L'INTERFACE SAIT AFFICHER L'ERREUR »
≠ LA REQUÊTE A RÉUSSI
```

### 3.2 Correction 2 — `renderCoverage()` hors de la v0

```text
renderCoverage()
= RETIRÉ des opérations produit du panneau B
= RETIRÉ de la réponse publique /api/mission

renderCoverage()
= DEMEURE une fonction existante de Mission Object
= RUNTIME Mission Object INCHANGÉ
```

```text
UNE FONCTION EXISTE
≠ LA CONSOLE V0 EN A BESOIN
```

### 3.3 Correction 3 — `Sec-Fetch-Site`

La règle avait été retenue puis silencieusement omise. Elle est rétablie.

```text
REQUÊTE API
Sec-Fetch-Site PRÉSENT
→ DOIT VALOIR same-origin
→ SINON REQUÊTE REJETÉE
```

### 3.4 Correction 4 — raisonnement de l'écart concret

L'étude avait écrit « critère 3 satisfait → pas un écart ». C'est logiquement
inversé.

```text
CRITÈRE D'ÉCART CONCRET
= un code d'application / d'adaptateur ordinaire NE PEUT PAS
  préserver la sémantique requise
```

```text
ASSOCIATION MISSION / RÉSULTAT
= un code d'application ordinaire PEUT préserver la sémantique requise

DONC
CRITÈRE D'ÉCART CONCRET
= NON SATISFAIT

DONC
ASSOCIATION MISSION / RÉSULTAT
= ORDINARY_INTEGRATION
```

## 4. Architecture générale

```text
CLASSE                  = serveur HTTP local Node 22 ESM + UI statique
DÉPENDANCES EXTERNES    = 0
RUNTIME                 = node:http, node:fs, node:crypto, node:path,
                          node:child_process, node:util
PERSISTANCE             = AUCUNE
DÉMON                   = AUCUN
RÉSEAU SORTANT          = AUCUN
ÉCRITURE DISQUE         = AUCUNE
MUTATION GIT            = AUCUNE
MODÈLE DE LANGAGE       = AUCUN
HORLOGE COMME AUTORITÉ  = AUCUNE
```

```text
NAVIGATEUR (public/)  ──fetch même origine──▶  server.mjs
                                                  │
                                    ┌─────────────┼─────────────┐
                                    ▼             ▼             ▼
                        program-state-     mission-      result-
                        adapter.mjs        adapter.mjs   adapter.mjs
                                    └──────┬──────┴──────┬──────┘
                                           ▼             ▼
                                      capture.mjs     repo.mjs
```

```text
LE NAVIGATEUR N'A AUCUN ACCÈS AU SYSTÈME DE FICHIERS
LE NAVIGATEUR N'A AUCUN ACCÈS À GIT
```

## 5. Topologie produit

Autorité 31 § 4 gèle trois panneaux, et seulement trois.

```text
PANNEAUX PRODUIT = 3

PANNEAU A = ÉTAT DU LAB
PANNEAU B = MISSION
PANNEAU C = RÉSULTAT
```

Bandeau de contexte partagé — métadonnées de dépôt :

```text
libellé du dépôt
HEAD
format d'objet
```

```text
WORKFLOW PROPRE      = AUCUN
COMPTÉ COMME PANNEAU = NON

PANNEAU D            = AUCUN
```

## 6. Panneau A — état du Lab

```text
1  capturer PROGRAM-STATE.json UNE fois
2  identités exactes des octets capturés
3  décodage UTF-8 STRICT
4  program-state parse(text)
5  projeter le checkpoint durable
6  afficher les références de support enregistrées SANS les traverser
```

```text
OCTETS CAPTURÉS = LES MÊMES pour l'identité et pour le parse
LECTURES = 1
```

### 6.1 Interdits

```text
check()                      NON APPELÉ
checkEvidence()              NON APPELÉ
blobOf()                     NON APPELÉ
renderCheck()                NON APPELÉ
claimsOf() pour vérifier     NON APPELÉ
findings                     ABSENT
material                     ABSENT
exitCode                     ABSENT
```

Ces champs ne sont pas « à zéro » : ils n'existent pas dans le modèle. Un
compteur à 0 se lirait comme « vérifié, rien trouvé ».

### 6.2 Champs durables réels affichés

```text
ALIAS DE PRÉSENTATION = 0
```

```text
checkpoint
  format_version
  updated_at

git_context
  repository
  branch
  observed_base_head
  observed_base_tree

streams[]
  id
  title
  type            valeur enregistrée VERBATIM
  state
  updated_at
  evidence[]

decisions[]
  id
  question
  state
  evidence[]

next_action
  state
  value           texte enregistré COMPLET, non tronqué
  evidence[]

evidence[]
  id
  kind
  ref
  policy
  supports.subject
  supports.field
  supports.value
  observed.blob   affiché QUAND PRÉSENT
```

Deux orthographes réelles coexistent dans `streams[].type`. La console affiche
la valeur enregistrée.

```text
NORMALISATION DE VALEUR ENREGISTRÉE = 0
```

### 6.3 Références affichées, non traversées

```text
observed.blob AFFICHÉ
= valeur ENREGISTRÉE au moment du checkpoint

BLOB COURANT DE LA RÉFÉRENCE
= NON CALCULÉ PAR LA CONSOLE V0

COMPARAISON enregistré ↔ courant
= NON EXÉCUTÉE
```

### 6.4 Énoncé obligatoire

```text
PROGRAM-STATE EVIDENCE VERIFICATION
= NOT EXECUTED BY CONSOLE V0
```

Visible en tête du panneau, non repliable, non conditionnel.

```text
RÉFÉRENCE AFFICHÉE
≠ RÉFÉRENCE VÉRIFIÉE

ABSENCE DE VÉRIFICATION
≠ VÉRIFICATION RÉUSSIE
```

## 7. Panneau B — mission

```text
1  capture UNIQUE des octets de mission
2  SHA-256 brut
3  identité Git-blob EXACTE des octets capturés
4  décodage UTF-8 STRICT
5  mission-object parse
6  mission-object validate
7  mission-object render
8  MISSION SNAPSHOT
9  COPIER
```

```text
MISSION SNAPSHOT
= (chemin relatif au dépôt, blob Git capturé)

LA RÉPONSE PORTE AUSSI
= SHA-256 capturé
```

```text
renderCoverage()
= HORS du panneau B v0
```

Sémantique du presse-papiers :

```text
chaîne passée à writeText()
= EXACTEMENT render(mission).text

octets ultérieurement collés
= HORS de la garantie de la console
```

```text
DÉPÊCHE AUTOMATIQUE D'AGENT = AUCUNE
```

## 8. Panneau C — résultat

```text
capture UNIQUE de l'instance de résultat
liaison au snapshot / à la version de mission
recapture de la mission
parse du résultat
validation structurelle du résultat
ASSOCIATION DE SOURCE
ASSOCIATION DE CONTRAT DE RETOUR
agrégation d'association
validateAgainstContract UNIQUEMENT si l'association de contrat = MATCH
présentation des entrées rapportées
présentation des entrées structurelles non productives
résolution de preuve BORNÉE AU CONTEXTE
présentation de l'identité des preuves
```

Vocabulaire d'association, conservé entier :

```text
MATCH
MATCH + PATH_DIVERGENCE
MISMATCH
CANNOT_ESTABLISH
```

```text
RÉDUCTION À UN BOOLÉEN = INTERDITE
```

## 9. Association de source et de contrat de retour

Les deux sont gelées **indépendamment**.

```text
SI result.source.kind = MISSION
→ comparer son autorité applicable à la mission sélectionnée

SINON
→ SOURCE_ASSOCIATION = NOT_APPLICABLE_TO_SELECTED_MISSION
```

```text
DÉDUIRE source.kind DE LA PRÉSENCE DU CONTRAT DE RETOUR
= INTERDIT
```

```text
SI result.return_contract EST PRÉSENT
→ comparer result.return_contract.authority à la mission sélectionnée

SI ABSENT
→ RETURN_CONTRACT_ASSOCIATION = NOT_APPLICABLE
→ CONTRACT VALIDATION        = NOT_APPLICABLE
```

```text
DÉDUIRE UNE SOURCE ADOSSÉE À UN PROTOCOLE
DE L'ABSENCE DE CONTRAT DE RETOUR
= INTERDIT
```

Agrégation :

```text
MISMATCH
= une autorité applicable requise présente une contradiction d'identité
  comparable DÉMONTRÉE

CANNOT_ESTABLISH
= aucune contradiction, mais une association requise non établie

MATCH
= toutes les associations requises par l'opération sont établies
```

Retour séparé, jamais fusionné :

```text
sourceAssociation
returnContractAssociation
pathDivergence[]
aggregate
```

Porte de validation de contrat :

```text
validateAgainstContract() S'EXÉCUTE
SI ET SEULEMENT SI
  return_contract EXISTE
  ET returnContractAssociation = MATCH
```

Motif durable de cette porte :

```text
validateAgainstContract(instance, missionObject)
N'ÉTABLIT AUCUNE IDENTITÉ DE MISSION

mesuré : un objet imposteur ne portant que le return_contract copié
rend ok = true, checked = 9, errors = 0

CONTRAT SATISFAIT
≠ RÉSULTAT ASSOCIÉ À CETTE MISSION
```

## 10. Politique d'identité et de chemin

```text
identité comparable supportée ÉGALE + localisateur ÉGAL
→ MATCH

identité comparable supportée ÉGALE + localisateur DIFFÉRENT
→ MATCH + PATH_DIVERGENCE

identité comparable supportée DIFFÉRENTE
→ MISMATCH
```

```text
identité ABSENTE
→ CANNOT_ESTABLISH
  reason = NO_IDENTITY_PROVIDED

genre d'identité NON SUPPORTÉ
→ CANNOT_ESTABLISH
  reason = UNSUPPORTED_IDENTITY_KIND
```

```text
UNE CORRESPONDANCE DE LOCALISATEUR / DE CHEMIN
N'ÉTABLIT JAMAIS UNE IDENTITÉ À ELLE SEULE

IDENTITÉ ABSENTE OU NON SUPPORTÉE → MISMATCH
= INTERDIT
```

Identité comparable supportée par la console v0 :

```text
GIT_BLOB
= comparé au blob calculé en Node sur les octets de mission capturés
```

## 11. Liaison à la version de mission

La requête de résultat porte :

```text
chemin de résultat
chemin de mission
blob Git de mission capturé et COURAMMENT AFFICHÉ
```

Le serveur recapture la mission.

```text
SI blob recapturé ≠ blob affiché / demandé

HTTP                = 409
CODE                = MISSION_VERSION_CHANGED
association         = CANNOT_ESTABLISH
validation de contrat = NON EXÉCUTÉE
```

## 12. Protection navigateur contre les réponses périmées

Exigence d'implémentation gelée :

```text
missionGeneration
resultGeneration
AbortController ou équivalent
```

```text
LES RÉPONSES TARDIVES DE SÉLECTIONS OBSOLÈTES
DOIVENT ÊTRE ÉCARTÉES

CHANGER DE MISSION INVALIDE L'ÉTAT UI DÉRIVÉ DU RÉSULTAT
```

## 13. Confinement du dépôt

Gelé côté serveur, indépendamment de la sélection dans l'interface :

```text
realRoot   = realpath(racine de dépôt configurée)
realTarget = realpath(cible demandée / référencée)

ACCEPTER UNIQUEMENT SI realTarget EST DANS realRoot
```

```text
ÉCHAPPEMENTS PAR SYMLINK = COUVERTS
```

Appliqué à **toute** lecture de fichier du dépôt, y compris les localisateurs
de preuve `REPO_PATH`.

```text
API DE FICHIER ARBITRAIRE = AUCUNE

L'ÉNUMÉRATION DE CANDIDATS PAR L'INTERFACE
N'EST PAS UNE FRONTIÈRE DE SÉCURITÉ
```

## 14. Autorité de lecture de preuve

```text
LA RÉSOLUTION DE PREUVE N'EST PERMISE QUE DEPUIS LES LOCALISATEURS
EXPLICITEMENT PORTÉS PAR L'INSTANCE DE RÉSULTAT CAPTURÉE
```

```text
/api/evidence?path=<chemin arbitraire>
= N'EXISTE PAS
```

Identité de preuve :

```text
GIT_BLOB
→ comparer aux octets de preuve capturés

identité non supportée
→ UNRESOLVED / UNSUPPORTED_IDENTITY_KIND

identité absente
→ UNRESOLVED / NO_IDENTITY_PROVIDED

REMOTE_REF
→ UNRESOLVED / NO_NETWORK_IN_V0
```

```text
EVIDENCE IDENTITY MATCH
≠ FAIT VRAI
```

## 15. Preuve temporelle historique

```text
PREUVE HISTORIQUE
= comparée à son identité immuable HISTORIQUE
```

```text
COMPARER historical remote-main-head À origin/main COURANT
= INTERDIT

AVANCE DU DISTANT COURANT
≠ CONTRADICTION HISTORIQUE
```

## 16. Modèle de capture unique et d'identité

```text
LIRE UNE FOIS
→ Buffer immuable
→ SHA-256 brut
→ identité Git-blob EXACTE de ces octets capturés
→ décodage UTF-8 STRICT
→ parse
→ validate
→ associer
→ présenter
```

```text
AUCUNE SECONDE LECTURE DANS LA MÊME OPÉRATION
NE PEUT REMPLACER LA VERSION
```

```text
FORMAT D'OBJET DU DÉPÔT COURANT
= sha1

blob_id = sha1("blob " + longueur_en_octets + NUL + octets)
= CALCULÉ DIRECTEMENT EN NODE
```

```text
git hash-object --path
= NON UTILISÉ POUR LA LIAISON D'IDENTITÉ DE MÊME CAPTURE
```

Motif durable : `--path=` applique les filtres de contenu du dépôt. Des octets
CRLF sous une règle `text eol=lf` y rendent l'identité LF et non l'identité
brute. Le dépôt configure en outre `filter.lfs.required = true`.

## 17. Opérations Git finales

```text
git rev-parse --show-object-format
git rev-parse HEAD
```

et rien d'autre.

```text
OPÉRANDE DE CHEMIN            = AUCUN
HACHAGE DE COPIE DE TRAVAIL   = AUCUN
FILTRE DE CONTENU             = AUCUN
MUTATION                      = AUCUNE
```

```text
CONTENT FILTER EXECUTION = 0
= EXIGENCE D'IMPLÉMENTATION À TESTER
≠ AFFIRMATION SUR UNE IMPLÉMENTATION INEXISTANTE
```

## 18. Contrat HTTP / API

Toutes les routes sont `GET`. Toute autre méthode : `405`.

```text
R1  GET  /
    ENTRÉE    —
    VERSION   —
    SORTIE    public/index.html
    STATUTS   200 · 403 · 421 · 405 · 500
    MUTATION  0

R2  GET  /console.css , /console.mjs
    ENTRÉE    —
    VERSION   —
    SORTIE    actif statique, liste blanche de noms, aucun chemin composé
    STATUTS   200 · 404 · 403 · 421 · 405 · 500
    MUTATION  0

R3  GET  /api/context
    ENTRÉE    —
    VERSION   —
    SORTIE    { repositoryLabel, rootLabel, head, objectFormat }
    STATUTS   200 · 403 · 421 · 405 · 500
    MUTATION  0

R4  GET  /api/program-state
    ENTRÉE    —
    VERSION   —
    SORTIE    { capture: { path, bytes, sha256, blob },
                state: { checkpoint, git_context, streams[],
                         decisions[], next_action },
                evidenceSummary: { byKind, byPolicy, total },
                evidenceVerification: {
                  status: "NOT_EXECUTED_BY_CONSOLE_V0" } }
    STATUTS   200
              · 403 PATH_OUT_OF_ROOT · 404 ARTIFACT_NOT_FOUND
              · 422 DECODE_FAILED | PARSE_FAILED
              · 403 ORIGIN_REJECTED · 421 HOST_REJECTED · 405 · 500
    MUTATION  0
    NOTE      findings / material / exitCode ABSENTS du schéma

R5  GET  /api/candidates?class=MISSION|RESULT
    ENTRÉE    class
    VERSION   —
    SORTIE    { roots[], candidates: [ { path, bytes } ] }
    STATUTS   200 · 400 BAD_REQUEST · 403 · 421 · 405 · 500
    MUTATION  0
    NOTE      COMMODITÉ DE SÉLECTION, PAS UNE FRONTIÈRE DE SÉCURITÉ

R6  GET  /api/mission?path=<relatif au dépôt>
    ENTRÉE    path
    VERSION   —
    SORTIE    { capture: { path, bytes, sha256, blob },
                snapshot: { path, blob },
                validation: { ok, errors[] },
                render: { text, trace } }
    STATUTS   200
              · 400 · 403 PATH_OUT_OF_ROOT · 404 ARTIFACT_NOT_FOUND
              · 422 DECODE_FAILED | PARSE_FAILED | VALIDATION_FAILED
              · 403 ORIGIN_REJECTED · 421 · 405 · 500
    MUTATION  0
    NOTE      coverage ABSENT de la réponse publique

R7  GET  /api/result?path=<p>&missionPath=<m>&missionBlob=<blob>
    ENTRÉE    path, missionPath
    VERSION   missionBlob — IDENTITÉ DE SNAPSHOT AFFICHÉE, OBLIGATOIRE
    SORTIE    { capture: { path, bytes, sha256, blob },
                missionRecapture: { path, blob, confirmed },
                validation: { ok, errors[] },
                sourceAssociation: { status, reason?, authority },
                returnContractAssociation: { status, reason?, authority },
                pathDivergence: [ { which, expected, actual } ],
                aggregate,
                contractValidation: { run, reason?, ok?, checked?,
                                      errors?, uncheckedDomains? },
                reportedValues: [ { factKey, defined_by, id,
                                    valueType, value, requirement? } ],
                nonProduction: [ { requirement } ],
                evidence: [ { locator, identity, resolution,
                              reason?, capturedBytes?, capturedBlob? } ] }
    STATUTS   200
              · 400 BAD_REQUEST
              · 403 PATH_OUT_OF_ROOT · 404 ARTIFACT_NOT_FOUND
              · 409 MISSION_VERSION_CHANGED
              · 422 DECODE_FAILED | PARSE_FAILED | VALIDATION_FAILED
                    | CONTRACT_STRUCTURALLY_INVALID
              · 403 ORIGIN_REJECTED · 421 · 405 · 500
    MUTATION  0
```

```text
ROUTE DE FICHIER ARBITRAIRE   = 0
/exec                         = 0
MÉTHODE DE MUTATION           = 0
```

Classement normatif des statuts :

```text
422   artefact invalide :
      échec de décodage UTF-8
      échec de parse JSON / de représentation
      échec de validation Mission Object
      échec de validation structurelle de Result Instance
      invalidité structurelle / mécanique du contrat de retour, une fois évalué
      CORPS = détails structurés, affichables

409   MISSION_VERSION_CHANGED

400   requête malformée
403   chemin hors dépôt · Origin étrangère
404   artefact introuvable
405   méthode non autorisée
421   Host inattendu

500   défaillance applicative / serveur inattendue
```

```text
UN ARTEFACT INVALIDE N'EST PAS ENCODÉ EN 200 OK
AU MOTIF QUE L'INTERFACE SAIT AFFICHER SON ERREUR
```

Les états d'association :

```text
MATCH · MISMATCH · CANNOT_ESTABLISH · PATH_DIVERGENCE
= NE SONT PAS DES ERREURS D'ARTEFACT MALFORMÉ
= ils conservent leur sémantique, en réponse 200
```

## 19. Politique de sécurité navigateur

```text
bind
= 127.0.0.1 UNIQUEMENT
```

```text
LISTE BLANCHE Host
= noms loopback supportés, sur le port RÉELLEMENT lié
= 127.0.0.1:<port>
= localhost:<port>
Host inattendu → 421
```

```text
CORS                      = DÉSACTIVÉ
aucun en-tête Access-Control-Allow-* n'est jamais émis

Origin ABSENT             = ACCEPTÉ
Origin PRÉSENT            = origine locale supportée EXACTE
Origin ÉTRANGÈRE          → 403
```

```text
Sec-Fetch-Site PRÉSENT
= DOIT VALOIR same-origin
SINON REQUÊTE REJETÉE
```

```text
Content-Security-Policy:
  default-src 'none'; script-src 'self'; style-src 'self';
  img-src 'self'; connect-src 'self'; form-action 'none';
  frame-ancestors 'none'; base-uri 'none'

X-Content-Type-Options: nosniff
Referrer-Policy:        no-referrer
```

```text
SCRIPT EXTERNE   = 0
STYLE EXTERNE    = 0
POLICE EXTERNE   = 0
CDN              = 0
SCRIPT INLINE    = 0
```

```text
AUCUNE RÈGLE DE SÉCURITÉ DÉJÀ CLOSE
NE PEUT ÊTRE SILENCIEUSEMENT OMISE
```

## 20. Faits de fidélité historique

Repris sans rouvrir TOOLING-EXPERIMENT-003.

```text
ENVELOPPE HISTORIQUE RENDUE
= BYTE-IDENTICAL

octets UTF-8
= 19671

SHA256
= b84f654fd3f7420596dd3d26c59814e65a295aee0620bffb4d93bc38125d11bf

blob Git
= 04714e06f18e0991364f2f7c4abd60506b9461f4
```

Identités gelées de la paire historique :

```text
mission.json
= 51139 octets
= blob 7358a63719036810222fe3d0c657f7192bd4f8c2

result.json
= 3577 octets
= blob f0781cbea2a1bd773c95c7ebffc91915bb7c076d

evidence/remote-main-head.txt
= 57 octets
= blob 4b822a1f771898cd7883cf51c00fa63ff263104c
```

```text
TE003 ROUVERTE = NON
```

## 21. Plan de fichiers

```text
tooling/console/server.mjs
  serveur HTTP loopback, routage, politiques Host / Origin /
  Sec-Fetch-Site / CSP / méthode, classes de statut, service statique
  en liste blanche
  importe : node:http, node:path, node:fs, ./repo.mjs,
            ./program-state-adapter.mjs, ./mission-adapter.mjs,
            ./result-adapter.mjs
  surface existante : AUCUNE
  autorité FS : lecture seule, public/ en liste blanche
  autorité Git : AUCUNE

tooling/console/capture.mjs
  lecture d'octets UNIQUE, SHA-256, identité de blob calculée en Node,
  décodage UTF-8 strict
  importe : node:fs, node:crypto, node:util
  surface existante : AUCUNE
  autorité FS : lecture d'un chemin DÉJÀ confiné
  autorité Git : AUCUNE

tooling/console/repo.mjs
  realpath de racine, confinement de chemin et de symlink, énumération
  bornée de candidats, rev-parse --show-object-format, rev-parse HEAD
  importe : node:fs, node:path, node:child_process
  surface existante : AUCUNE
  autorité FS : realpath, readdir borné, aucune écriture
  autorité Git : EXACTEMENT les deux commandes gelées

tooling/console/program-state-adapter.mjs
  capture → parse → PROJECTION SEULE
  importe : ./capture.mjs, ../program-state/program-state.mjs { parse }
  surface existante : program-state parse(text)
  autorité FS : PROGRAM-STATE.json, un seul chemin confiné
  autorité Git : AUCUNE
  INTERDIT : check, checkEvidence, blobOf, renderCheck, claimsOf,
             renderResume

tooling/console/mission-adapter.mjs
  capture → parse → validate → render → snapshot
  importe : ./capture.mjs, ../mission-object/mission-object.mjs { parse },
            ../mission-object/validate.mjs { validate },
            ../mission-object/render.mjs { render }
  surface existante : mission-object parse / validate / render
  autorité FS : un chemin de mission confiné
  autorité Git : AUCUNE
  HORS PÉRIMÈTRE : renderCoverage

tooling/console/result-adapter.mjs
  capture du résultat, recapture et confirmation de version de mission,
  parse, validation structurelle, associations, agrégation, validation
  de contrat sous porte, projection des entrées, résolution de preuve
  bornée au contexte, identité de preuve
  importe : ./capture.mjs, ./mission-adapter.mjs, ./repo.mjs,
            ../result-instance/result-instance.mjs
              { parse, reportedValueEntries, nonProductionEntries, factKey },
            ../result-instance/validate.mjs
              { validate, validateAgainstContract }
  surface existante : les six exports ci-dessus
  autorité FS : résultat + mission + localisateurs de preuve EXTRAITS
                DU RÉSULTAT, tous reconfinés
  autorité Git : AUCUNE

tooling/console/public/index.html
  squelette à 3 panneaux + bandeau partagé, aucune ressource externe

tooling/console/public/console.css
  mise en forme, aucune police ni image distante

tooling/console/public/console.mjs
  rendu client, générations monotones, abandon et rejet des réponses
  périmées, purge de l'état dérivé, COPY = render().text, présentation
  des erreurs

tooling/console/tests/console.test.mjs
  node --test, suite d'acceptation, fixture de fidélité historique
```

Changement d'implémentation futur, hors de la présente autorité :

```text
.gitattributes
+ tooling/console/** text eol=lf

MOTIF
= tooling/console/* est aujourd'hui « text: unspecified » ; sans cette
  ligne les inventaires d'octets gelés cassent à l'extraction
```

```text
FICHIERS RUNTIME EXISTANTS À MODIFIER
= AUCUN

tooling/program-state/*     INCHANGÉ
tooling/mission-object/*    INCHANGÉ
tooling/result-instance/*   INCHANGÉ
```

Contrainte de nommage, dérivée des gardes CLI existantes :

```text
LES GARDES CLI SONT DES TESTS DE SUFFIXE SUR process.argv[1]
  program-state.mjs  → endsWith('program-state.mjs')
  validate.mjs       → endsWith('validate.mjs')

AUCUN FICHIER DE LA CONSOLE NE SE TERMINE PAR CES SUFFIXES
→ AUCUNE GARDE CLI DÉCLENCHÉE À L'IMPORT
```

## 22. Matrice d'opérations finale

Une ligne par opération requise. Colonnes : opération · surface existante ·
adaptateur · classe · fichier.

```text
--- INFRASTRUCTURE PARTAGÉE -------------------------------------------------
01  servir les actifs UI statiques          —                        NO   ORDINARY_INTEGRATION  server.mjs
02  lier l'écoute à 127.0.0.1 uniquement    —                        NO   ORDINARY_INTEGRATION  server.mjs
03  liste blanche Host → 421                —                        NO   ORDINARY_INTEGRATION  server.mjs
04  Origin même origine, CORS off → 403     —                        NO   ORDINARY_INTEGRATION  server.mjs
05  Sec-Fetch-Site same-origin si présent   —                        NO   ORDINARY_INTEGRATION  server.mjs
06  CSP + nosniff + no-referrer, 0 externe  —                        NO   ORDINARY_INTEGRATION  server.mjs + index.html
07  classes de statut 400/403/404/405/409/  —                        NO   ORDINARY_INTEGRATION  server.mjs
    421/422/500
08  realpath de la racine configurée        —                        NO   ORDINARY_INTEGRATION  repo.mjs
09  confinement de chemin + symlinks        —                        NO   ORDINARY_INTEGRATION  repo.mjs
10  capture d'octets unique → Buffer        —                        NO   ORDINARY_INTEGRATION  capture.mjs
11  SHA-256 des octets capturés             node:crypto              NO   ORDINARY_INTEGRATION  capture.mjs
12  blob Git calculé en Node                node:crypto              NO   ORDINARY_INTEGRATION  capture.mjs
13  décodage UTF-8 strict                   node:util                NO   ORDINARY_INTEGRATION  capture.mjs
14  lire le format d'objet                  —                        NO   ORDINARY_INTEGRATION  repo.mjs
15  lire HEAD                               —                        NO   ORDINARY_INTEGRATION  repo.mjs
16  énumération bornée de candidats         —                        NO   ORDINARY_INTEGRATION  repo.mjs
--- PANNEAU A ---------------------------------------------------------------
17  capture de PROGRAM-STATE.json           —                        YES  ORDINARY_INTEGRATION  program-state-adapter.mjs
18  parser le checkpoint capturé            program-state parse()    YES  EXISTING_CAPABILITY   program-state-adapter.mjs
19  projeter streams                        —                        YES  ORDINARY_INTEGRATION  program-state-adapter.mjs
20  projeter decisions                      —                        YES  ORDINARY_INTEGRATION  program-state-adapter.mjs
21  projeter next_action                    —                        YES  ORDINARY_INTEGRATION  program-state-adapter.mjs
22  projeter les références enregistrées    —                        YES  ORDINARY_INTEGRATION  program-state-adapter.mjs
    VERBATIM, sans traversée
23  projeter checkpoint + git_context       —                        YES  ORDINARY_INTEGRATION  program-state-adapter.mjs
24  résumé additionnel par kind / policy    —                        YES  ORDINARY_INTEGRATION  program-state-adapter.mjs
25  émettre NOT_EXECUTED_BY_CONSOLE_V0      —                        YES  ORDINARY_INTEGRATION  program-state-adapter.mjs
--- PANNEAU B ---------------------------------------------------------------
26  capture du mission.json                 —                        YES  ORDINARY_INTEGRATION  mission-adapter.mjs
27  parser le Mission Object                mission-object parse()   YES  EXISTING_CAPABILITY   mission-adapter.mjs
28  valider le Mission Object               mission-object validate()YES  EXISTING_CAPABILITY   mission-adapter.mjs
29  rendre l'enveloppe déterministe         render()                 YES  EXISTING_CAPABILITY   mission-adapter.mjs
30  exposer le snapshot + SHA-256           —                        YES  ORDINARY_INTEGRATION  mission-adapter.mjs
31  copier render(mission).text VERBATIM    —                        NO   ORDINARY_INTEGRATION  public/console.mjs
--- PANNEAU C ---------------------------------------------------------------
32  capture du result.json                  —                        YES  ORDINARY_INTEGRATION  result-adapter.mjs
33  parser la Result Instance               result-instance parse()  YES  EXISTING_CAPABILITY   result-adapter.mjs
34  valider structurellement                result-instance validate()YES EXISTING_CAPABILITY   result-adapter.mjs
35  recapture de mission + confirmation     —                        YES  ORDINARY_INTEGRATION  result-adapter.mjs
    de version, sinon 409
36  évaluer l'ASSOCIATION DE SOURCE         —                        YES  ORDINARY_INTEGRATION  result-adapter.mjs
37  évaluer l'ASSOCIATION DE CONTRAT        —                        YES  ORDINARY_INTEGRATION  result-adapter.mjs
38  politique d'identité et de chemin       —                        YES  ORDINARY_INTEGRATION  result-adapter.mjs
39  agréger les associations                —                        YES  ORDINARY_INTEGRATION  result-adapter.mjs
40  valider contre le contrat, sous porte   validateAgainstContract()YES  EXISTING_CAPABILITY   result-adapter.mjs
41  partitionner les entrées rapportées     reportedValueEntries() / YES  EXISTING_CAPABILITY   result-adapter.mjs
                                            nonProductionEntries()
42  clé de fait qualifiée par portée        factKey()                YES  EXISTING_CAPABILITY   result-adapter.mjs
43  présenter les valeurs rapportées        —                        YES  ORDINARY_INTEGRATION  result-adapter.mjs
44  présenter les entrées non productives   —                        YES  ORDINARY_INTEGRATION  result-adapter.mjs
45  extraire l'ensemble de localisateurs    —                        YES  ORDINARY_INTEGRATION  result-adapter.mjs
    de preuve porté par le résultat
46  résoudre CES localisateurs seulement,   —                        YES  ORDINARY_INTEGRATION  result-adapter.mjs
    chacun reconfiné
47  comparer l'identité GIT_BLOB de preuve  —                        YES  ORDINARY_INTEGRATION  result-adapter.mjs
48  politique UNRESOLVED de preuve          —                        YES  ORDINARY_INTEGRATION  result-adapter.mjs
49  règle temporelle historique             —                        YES  ORDINARY_INTEGRATION  result-adapter.mjs
--- COHÉRENCE NAVIGATEUR ----------------------------------------------------
50  générations monotones + AbortController —                        NO   ORDINARY_INTEGRATION  public/console.mjs
51  écarter les réponses périmées, purger   —                        NO   ORDINARY_INTEGRATION  public/console.mjs
    l'état dérivé du résultat
52  présenter erreurs et artefacts invalides—                        NO   ORDINARY_INTEGRATION  public/console.mjs
--- STRUCTURE ET ACCEPTATION ------------------------------------------------
53  disposer EXACTEMENT 3 panneaux produit  —                        NO   ORDINARY_INTEGRATION  public/index.html
    + bandeau partagé
```

Décomptes finaux :

```text
EXISTING_CAPABILITY COUNT   = 9
ORDINARY_INTEGRATION COUNT  = 44
CONCRETE_GAP COUNT          = 0
MATRIX ROW COUNT            = 53

9 + 44 + 0 = 53
```

Les neuf opérations `EXISTING_CAPABILITY` sont les surfaces sémantiques
exportées réemployées telles quelles :

```text
18  program-state  parse
27  mission-object parse
28  mission-object validate
29  mission-object render
33  result-instance parse
34  result-instance validate
40  result-instance validateAgainstContract
41  result-instance reportedValueEntries / nonProductionEntries
42  result-instance factKey
```

```text
renderCoverage()
= RETIRÉ DE LA MATRICE PRODUIT v0
```

Opérations supprimées avec `check()` :

```text
prévalider les preuves de PROGRAM-STATE contre la racine    SUPPRIMÉE
exécuter program-state check(state, repoRoot)               SUPPRIMÉE
déréférencer chaque preuve via checkEvidence()              SUPPRIMÉE
calculer le blob courant d'une référence via blobOf()       SUPPRIMÉE
rendre le rapport de check via renderCheck()                SUPPRIMÉE
présenter findings / material / exitCode                    SUPPRIMÉE
```

## 23. Conclusion d'écart concret

```text
ASSOCIATION MISSION / RÉSULTAT
= REQUISE
```

```text
LE VALIDATEUR EXISTANT ÉTABLIT L'IDENTITÉ DE MISSION
= NON
```

```text
UN CODE D'APPLICATION ORDINAIRE PEUT PRÉSERVER
LA SÉMANTIQUE D'IDENTITÉ REQUISE
= OUI
```

Motifs :

```text
les identités d'autorité immuables existent déjà
les octets de mission ont une identité Git-blob immuable calculable
source.authority et return_contract.authority portent déjà des identités
comparaison, agrégation et liaison de snapshot sont des responsabilités
  d'application
```

Donc :

```text
CRITÈRE D'ÉCART CONCRET
« un code d'application ordinaire ne peut pas préserver la sémantique »
= NON SATISFAIT
```

```text
CLASSE D'IMPLÉMENTATION
= INTÉGRATION ORDINAIRE

ÉCART CONCRET
= 0

NOUVELLE EXPÉRIENCE D'OUTILLAGE
= NON REQUISE POUR LA v0
```

```text
GÉNÉRALISATION AU-DELÀ DE LA v0
= AUCUNE
```

## 24. Acceptation d'implémentation future

Cas observables minimaux :

```text
exactement 3 panneaux produit
le panneau A affiche fidèlement l'état durable capturé et ses références réelles
le panneau A dit explicitement que la vérification de preuve n'est pas exécutée
le panneau A n'émet jamais findings / material / exitCode
identité de mission historique correcte
la mission historique valide
enveloppe historique BYTE-IDENTICAL
COPY reçoit render().text
identité de Result Instance historique correcte
association de source correcte
association de contrat de retour correcte
validation de contrat correctement gardée
divergence de chemin représentée séparément
identités absentes / non supportées classées correctement
identité de preuve historique : correspondance
preuve temporelle historique jamais comparée au distant courant
MISSION_VERSION_CHANGED → 409
réponse de mission tardive écartée
réponse de résultat tardive écartée
échappement de chemin rejeté
échappement par symlink rejeté
lecture de preuve non autorisée impossible / rejetée
Host étranger rejeté
Origin étrangère rejetée
requête étrangère / cross-site rejetée quand Sec-Fetch-Site est présent
aucun lecteur de fichiers générique
invalidité d'artefact → 422 avec détails structurés
défaillance applicative → 500
mutations du dépôt = 0
mutations Git = 0
invocation de filtre de contenu = 0
```

```text
node --test = PASS
= AGRÉGAT
≠ SUBSTITUT AUX ASSERTIONS INDIVIDUELLES
```

Acceptation générale du panneau A, indépendante de tout décompte :

```text
ensemble de flux affiché      = ensemble de flux du checkpoint capturé parsé
ensemble de décisions affiché = ensemble de décisions du checkpoint capturé
next_action affichée          = next_action du checkpoint capturé
références affichées          = références du checkpoint capturé requises
                                par la projection du panneau A
étiquette de vérification     = NOT_EXECUTED_BY_CONSOLE_V0
```

```text
DÉCOMPTES MESURÉS AU HEAD DE CONCEPTION
= ATTENTES DU FIXTURE HISTORIQUE
≠ CORRECTION PRODUIT FUTURE CODÉE EN DUR
```

## 25. Ce que ce document ne fait pas

```text
IMPLÉMENTATION                          AUCUNE
SOURCE tooling/console/ CRÉÉE           AUCUNE
.gitattributes MODIFIÉ                  NON
RUNTIME D'OUTILLAGE EXISTANT MODIFIÉ    NON
AUTORITÉ 31 MODIFIÉE                    NON
AUTORITÉS 00 À 30 MODIFIÉES             NON
TE001 · TE002 · TE003 ROUVERTES         NON
NOUVELLE EXPÉRIENCE D'OUTILLAGE         AUCUNE
NOUVELLE CAPACITÉ SÉMANTIQUE            AUCUNE
MISSION RÉELLE FUTURE SÉLECTIONNÉE      AUCUNE
EXÉCUTANT ALLOUÉ                        AUCUN
TESTS EXÉCUTÉS                          0
```

```text
LOCAL MISSION CONSOLE V0
= PÉRIMÈTRE PRODUIT GELÉ
= CONCEPTION D'IMPLÉMENTATION GELÉE ET RATIFIÉE
= CLASSE INTÉGRATION ORDINAIRE
= IMPLÉMENTATION NON COMMENCÉE
```
