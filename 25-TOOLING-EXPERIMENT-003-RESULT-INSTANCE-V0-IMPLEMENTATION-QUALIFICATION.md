# TOOLING-EXPERIMENT-003 — qualification de l'implémentation Result Instance v0

## 1. Statut et autorité

```text
TYPE
= record de qualification d'implémentation

EXPÉRIENCE
= TOOLING-EXPERIMENT-003

CE DOCUMENT
= autorité de qualification
= GELÉ

AUTORITÉ SÉMANTIQUE
= 23-TOOLING-EXPERIMENT-003-RESULT-INSTANCE-V0.md
= blob 1676b3de4546b40a801d0a400b4c47ddd9b82062
= INCHANGÉE

AUTORITÉ DE DESIGN D'IMPLÉMENTATION
= 24-TOOLING-EXPERIMENT-003-RESULT-INSTANCE-V0-IMPLEMENTATION-DESIGN.md
= blob 9efe619e2872ed275d73897ff6444d90ef1b03d7
= INCHANGÉE

TE003
= OUVERTE
= NON CONCLUE

PREMIÈRE TÂCHE DE DOGFOOD RÉELLE
= NON SÉLECTIONNÉE
```

Ce document consigne ce qu'une qualification mécanique a établi, et ce qu'elle
n'a pas pu établir. Les deux comptent également.

## 2. Surface d'implémentation gelée

```text
tooling/result-instance/result-instance.mjs
= blob   644ca8baa035392d22a5787c85f421123f231935
= sha256 c5c8d5a7a1598edadfc538438eb1a66ae274cfed2fcb2763534f706b8efa82f0
= 6780 octets · 186 lignes · CR 0 · LF 186 · NUL 0

tooling/result-instance/validate.mjs
= blob   485be3b5a8f3e5fefa4b9672035ecf8da4e89de6
= sha256 d9f284da40c016d473d7ab58d0128445690966a8070a298f267390c40c804dab
= 15254 octets · 440 lignes · CR 0 · LF 440 · NUL 0

tooling/result-instance/tests/result-instance.test.mjs
= blob   22c67debad20ab6096eabe3833f30bbedd35e65a
= sha256 46e3819969b3b8224cb444e8c6f6fe6af71b6f05f730da4290e6fb9422d82dc5
= 32094 octets · 759 lignes · CR 0 · LF 759 · NUL 0

tooling/result-instance/tests/provenance-manifest.json
= blob   8fee874197a7212c907070d2633870486dc0f341
= sha256 536600e1815abe0963dac5d746d5db921116dc2ca6db3d584d89150b8c720a4b
= 16991 octets · 303 lignes · CR 0 · LF 303 · NUL 0

tooling/result-instance/representability/a.json
= blob   687332896f469c43c1069e93dc9316bb23d067fe
= sha256 f5e7aaee7814036ea4df6dd9673a0e232ff80c2038fef7add3ad5845e6bb8a79
= 4034 octets · 187 lignes · CR 0 · LF 187 · NUL 0

tooling/result-instance/representability/b.json
= blob   94307c6d57f7a11465a2794e7cf4b1f8271cbb43
= sha256 a7164524cf86a21df6ee3ced4e906dc451ddccb20733cbd88afe297b4accdf9c
= 4319 octets · 192 lignes · CR 0 · LF 192 · NUL 0

tooling/result-instance/representability/c.json
= blob   41c4a221494fcda18c777f323b69df6cb8253b06
= sha256 d2fc3413f59827681b1dfd75912af21984f5124811afc325b1a83e2220f1c4c9
= 4209 octets · 196 lignes · CR 0 · LF 196 · NUL 0

tooling/result-instance/representability/d.json
= blob   a2ebe05d0c39f5b843fa31db28db01ce48836561
= sha256 57256749726ba91702f6e3fb754920fecf997090a06a3dece1dd179121e06342
= 3514 octets · 173 lignes · CR 0 · LF 173 · NUL 0

.gitattributes
= blob   a939da0c08a22f4612b4c046b78ed0deb98420a5
= sha256 1d6189853e0f6e71a38956866cf8aedb238fb3bb7fd9372ab40f1cd7bec9f6c9
= 361 octets · 8 lignes · CR 0 · LF 8 · NUL 0
= une seule ligne ajoutée : tooling/result-instance/** text eol=lf
```

```text
ÉDITIONS APRÈS GEL
= 0
= empreintes recalculées après la qualification formelle, identiques
```

```text
EXÉCUTION      Node 22 · ESM
DÉPENDANCES    node:fs · node:path · node:test · node:assert/strict
               ZÉRO DÉPENDANCE EXTERNE
SURFACE        2 modules · 1 CLI · 1 commande
               aucun rendu · aucun constructeur · aucun CRUD · aucune mutation
```

## 3. Runs de développement et qualification formelle

```text
RUNS DE DÉVELOPPEMENT
= 5
```

```text
1  node tooling/result-instance/validate.mjs representability/{a,b,c,d}.json
   structure seule, avant la couche contrat
2  node tooling/result-instance/validate.mjs representability/{a,b,c}.json
     + tooling/mission-object/dogfood/00{1,2,3}/mission.json
3  contrôle croisé des clés du manifeste contre les entrées des quatre cas
4  node --test tooling/result-instance/tests/result-instance.test.mjs
5  node --test tooling/result-instance/tests/result-instance.test.mjs
   après la correction de conformité du § 6
```

```text
RUN DE DÉVELOPPEMENT
≠ QUALIFICATION FORMELLE
```

Qualification formelle, sur les octets gelés :

```text
COMMANDE
= node --test tooling/result-instance/tests/result-instance.test.mjs

RUNS FORMELS SUR CES OCTETS
= 1

exit      = 0
tests     = 67
pass      = 67
fail      = 0
skip      = 0
todo      = 0
duration  = 179.8828 ms
```

```text
RUN FORMEL REJOUÉ
= AUCUN

CORRECTIF APRÈS LE RUN FORMEL
= AUCUN
```

## 4. Écart de conformité corrigé avant le gel

Un écart réel a été trouvé pendant la revue de développement, et il est
consigné parce qu'il est instructif :

```text
ÉCART
= le validateur admettait n'importe quel genre de localisateur pour une
  référence d'AUTORITÉ

AUTORITÉ VIOLÉE
= 24 § 9 — « locator = localisateur de chemin relatif au dépôt »

CORRECTION
= les références d'autorité n'admettent que REPO_PATH ;
  les références de PREUVE conservent le vocabulaire complet, parce qu'une
  preuve désigne ce que l'exécutant a réellement mesuré — le cas C mesure
  origin/main

CLASSE
= DÉFAUT D'IMPLÉMENTATION ORDINAIRE
≠ INSUFFISANCE DE CONCEPTION

AUTORITÉ 23 OU 24 MODIFIÉE POUR FACILITER L'IMPLÉMENTATION
= NON
```

## 5. Résultat de représentabilité historique

```text
A  DOGFOOD-001     adossé à un contrat   PASS
B  DOGFOOD-002     adossé à un contrat   PASS
C  DOGFOOD-003     adossé à un contrat   PASS
D  TE001 PHASE D   adossé à un protocole PASS
```

Ce que chaque cas éprouve :

```text
A
= relation de contrat · exécution bloquée · résultat terminal BLOCKED rapporté
  comme item factuel · portes en échec 0 rapporté hors contrat · commit non
  produit représenté comme NON-PRODUCTION STRUCTURELLE · push non tenté
  rapporté sous identité portée par l'exécutant · SET non vide des chemins
  modifiés · référence de preuve avec identité immuable

B
= le cas canonique. push.realized = NO est conservé TEL QUE RAPPORTÉ, aux
  côtés de commit.identifier = NOT_REALIZED, remote.main_head = NOT_MEASURED,
  blocker_reason = PERMISSION_DENIED et commit.realized = NO. Quatre négatifs,
  quatre sens distincts, aucun effondré en booléen ni en absence. La
  qualification ultérieure a jugé la valeur sémantiquement fausse ; cette
  qualification n'entre pas dans l'instance, et la valeur n'est pas corrigée.

C
= chemin de réalisation réussi · commit réalisé et identifié · push REALIZED ·
  tête distante mesurée APRÈS la poussée, avec preuve REMOTE_REF · résultat
  terminal PASS · trois faits post-push portés par l'exécutant

D
= adossé à un protocole · AUCUNE autorité de contrat de retour à la racine ·
  douze faits, TOUS sous identité portée par l'exécutant · aucun énoncé
  évaluatif de RESULT-001 n'est entré
```

```text
COMPLÉTUDE DE CONTRAT AFFIRMÉE
= AUCUNE
= l'applicabilité d'une exigence au chemin d'exécution atteint n'est pas
  exprimée mécaniquement par les contrats, et elle n'est donc ni devinée, ni
  exigée, ni reprochée
```

## 6. Le manifeste de provenance, et sa portée

```text
tooling/result-instance/tests/provenance-manifest.json
= MÉTADONNÉE DE QUALIFICATION UNIQUEMENT
```

Il se déclare lui-même :

```text
SÉMANTIQUE D'EXÉCUTION                    NON
PREUVE DE RETOUR BRUT HISTORIQUE          NON
PREUVE D'OCTETS HISTORIQUES               NON
USAGE DE TRANSCRIPTION                    AUCUN
EXÉCUTION REJOUÉE                         AUCUNE
```

Couverture, vérifiée mécaniquement dans les deux sens :

```text
A  12 éléments   B  12 éléments   C  13 éléments   D  12 éléments
élément de cas non tracé          = 0
trace orpheline                   = 0
autorité citée hors liste         = 0
```

Chaque élément nomme une autorité durable committée, une section, et l'énoncé
durable exact qui l'établit.

```text
RECONSTRUCTION DEPUIS UN TRANSCRIPT
= 0

DURABILITÉ DU RETOUR BRUT HISTORIQUE
= 0 / 4
= INCHANGÉE, et c'est précisément pourquoi les cas sont synthétiques
```

## 7. Limite d'identité du cas D

```text
L'AUTORITÉ 09 DÉFINIT UN ESPACE DE NOMS FACTUEL MACHINE
= NON
```

Sa section 19 énonce un jeu de questions de reprise ; sa section 21 numérote
six critères de **qualification**. Aucun identifiant de fait n'y est défini
prospectivement.

```text
IDENTITÉS SOURCE EMPLOYÉES PAR LE CAS D
= 0
= fabriquer rétroactivement une identité SOURCE est interdit par
  l'autorité 24 § 6

IDENTIFIANTS DU CAS D
= IDENTIFIANTS SYNTHÉTIQUES DE QUALIFICATION
= déclarés par le manifeste de provenance
```

Ce qu'ils n'établissent pas :

```text
l'autorité 09 les aurait définis                    NON
la session de phase D les aurait retournés       NON
le cas D est une instance de résultat historique    NON
```

```text
CAS DE REPRÉSENTABILITÉ
≠ INSTANCE DE RÉSULTAT HISTORIQUE
```

Les octets eux-mêmes portent cette distinction : `execution.id` vaut
`representability-a` … `representability-d`, jamais un identifiant
d'exécution historique.

Conséquence à retenir pour la suite :

```text
CAPTURE ADOSSÉE À UN PROTOCOLE, EN USAGE RÉEL
= exigera qu'une autorité de protocole déclare ses identités de fait
  PROSPECTIVEMENT
```

## 8. Pare-feu de qualification — résultat

```text
SÉMANTIQUE DE QUALIFICATION INTRODUITE
= 0
```

La surface de clés est close, à la racine comme dans chaque classe d'entrée.
Les tests refusent mécaniquement `finding`, `gap`, `remediation`,
`next_action`, `workflow_state`, `human_decision`, `policy` à la racine, et
`established_true`, `verdict`, `finding`, `priority`, `sufficiency` dans une
entrée.

```text
RÉSULTAT TERMINAL OBLIGATOIRE À LA RACINE
= AUCUN
= un résultat terminal rapporté est une entrée factuelle, et l'ajouter à la
  racine est refusé
```

## 9. Rapporté n'est pas vrai — préservé

```text
CHAMP DE VÉRITÉ, DE VÉRIFICATION OU DE CONFIRMATION
= AUCUN
```

Le validateur vérifie l'appartenance à un domaine clos là où le contrat
l'expose, et il ne vérifie jamais la justesse. Un test le montre sur le cas
réel : `push.realized = NO` est un membre licite du domaine de DOGFOOD-002 et
passe la couche 2, alors même que DF002-01 a établi plus tard qu'il était
sémantiquement faux.

```text
APPARTENANCE AU DOMAINE
≠ JUSTESSE SÉMANTIQUE
```

## 10. Non-production structurelle et valeur de domaine

```text
CLASSES D'ENTRÉE
= REPORTED_VALUE · STRUCTURAL_NON_PRODUCTION
= structurellement disjointes
```

Mécaniquement refusés : une non-production portant une valeur, une
non-production portant une identité de fait, une exigence à la fois produite
et déclarée non produite, une non-production sans contrat prospectif, et tout
motif d'absence.

```text
VOCABULAIRE DE MOTIFS
= ABSENT EN v0
= le corpus démontre zéro occurrence, et rien n'est inventé
```

```text
NOT_ATTEMPTED · NOT_REALIZED · NOT_MEASURED · NONE · NO
= VALEURS DE DOMAINE RAPPORTÉES
= jamais effondrées en booléen, en nul, ni en absence structurelle
```

## 11. Identité de fait et portée

```text
SOURCES DE DÉFINITION
= RETURN_CONTRACT · SOURCE · EXECUTOR
```

Une identité de fait est qualifiée par sa portée :

```text
RETURN_CONTRACT   portée = identité immuable de l'autorité de contrat
SOURCE            portée = identité immuable de l'autorité de protocole
EXECUTOR          portée = identité d'exécution + identité de l'exécutant
```

Il en découle, par construction et non par consigne :

```text
UN IDENTIFIANT PORTÉ PAR L'EXÉCUTANT N'IMPLIQUE AUCUNE ÉQUIVALENCE
ENTRE DEUX EXÉCUTIONS
```

Deux instances portant la même chaîne mais deux exécutions différentes
produisent deux clés différentes ; deux instances adossées au même contrat
partagent bien la même clé. Trois tests l'établissent.

```text
PHRASE DE PROSE COMME IDENTITÉ DE FAIT
= REFUSÉE
= un identifiant ne porte aucun espace

ONTOLOGIE UNIVERSELLE DE FAITS
= AUCUNE
```

## 12. Observation bornée sur les valeurs textuelles

Consignée parce qu'elle mérite de l'être, et non promue en constat :

```text
UNE VALEUR SCALAR PEUT CONTENIR DU TEXTE HUMAIN
```

Le cas B en porte trois : les déviations procédurales que l'autorité 17 § 9
consigne « telles quelles » sont irréductiblement textuelles. L'interdiction
de l'autorité 23 § 9 vise le **blob de prose comme échappatoire factuelle
normative** — une prose qui porterait le SENS. Ici, le sens est porté par
l'identité de fait, qui est machine et close ; le texte est la valeur
rapportée elle-même.

```text
IDENTITÉ DE FAIT EN PROSE      IMPOSSIBLE
VALEUR RAPPORTÉE TEXTUELLE     POSSIBLE, quand le fait retourné est textuel

ÉCART DE CONCEPTION
= NON DÉMONTRÉ
```

## 13. Mécaniquement testé, et contraintes de revue

Mécaniquement testé, 67 tests :

```text
instances valides minimale · adossée à un contrat · adossée à un protocole
rapporté sans promotion en vérité
surfaces de clés closes, racine et entrées
types SCALAR · SYMBOL · SET, vides et non vides
refus de BOOLEAN · INTEGER · OBJECT · MAP · ANY · JSON
refus des booléens et nombres nus, et des SET imbriqués
valeurs de domaine distinctes de la non-production structurelle
fait inattendu porté par l'exécutant
absence d'équivalence entre exécutions
relation d'exigence redondante ou contradictoire, refusée
références d'autorité et de preuve, identités et localisateurs
écriture unique : instance gelée en profondeur, aucun export de mutation
relations de contrat mécaniquement décidables
domaine clos vérifié là où il est exposé
absence de revendication de complétude
représentabilité A · B · C · D
couverture du manifeste dans les deux sens
```

Contraintes de revue, NON mécanisables, et le dire est le seul traitement
honnête :

```text
un identifiant de fait EXECUTOR dont le JETON TEXTUEL encode lui-même une
sémantique de qualification n'est pas détectable mécaniquement

la fidélité d'un cas de représentabilité à ce qui fut réellement retourné
n'est pas vérifiable : aucun retour brut historique n'est durable
```

## 14. Conformité structurelle

```text
CONFORMITÉ STRUCTURELLE DE L'IMPLÉMENTATION
= PASS
= revue clause à clause des autorités 23 et 24, après le run formel
```

```text
SÉMANTIQUE NOUVELLE AJOUTÉE PAR COMMODITÉ
= AUCUNE
AUTORITÉ 23 MODIFIÉE                     NON
AUTORITÉ 24 MODIFIÉE                     NON
```

## 15. Frontière de revendication

Ce que cette qualification établit :

```text
RESULT INSTANCE v0, IMPLÉMENTATION
= QUALIFIÉE POUR LA REPRÉSENTABILITÉ HISTORIQUE

le modèle représente toutes les sémantiques factuelles durablement
démontrées par A/B/C/D
le validateur applique les sémantiques structurelles gelées de v0
```

Ce qu'elle n'établit pas, et qu'aucune quantité de qualification
rétrospective ne pourra relever :

```text
CAPTURE PAR UN EXÉCUTANT EN USAGE RÉEL
= PAS ENCORE ÉPROUVÉE

ces octets ont été historiquement retournés          NON AFFIRMÉ
les deux familles d'exécution sont validées          NON AFFIRMÉ
la représentabilité rétrospective est un dogfood     NON
```

```text
TOOLING-EXPERIMENT-003
= OUVERTE
= NON RÉUSSIE
= NON ÉCHOUÉE
```

## 16. Ce que ce document ne fait pas

```text
TE003 CONCLUE                             NON
SUCCÈS EXPÉRIMENTAL REVENDIQUÉ            NON
DOGFOOD RÉEL SÉLECTIONNÉ                  NON
README SÉLECTIONNÉ COMME DOGFOOD          NON
NOUVEL EXÉCUTANT ALLOUÉ                   AUCUN
OBJET OU ENVELOPPE DE DOGFOOD CRÉÉ        AUCUN
NOUVELLE DÉCISION HUMAINE CRÉÉE           AUCUNE
AUTORITÉ 23 OU 24 MODIFIÉE                NON
RESULT-001 MODIFIÉ                        NON
README CORRIGÉ                            NON
MISSION OBJECT MODIFIÉ                    NON
OUTIL D'ÉTAT DE PROGRAMME MODIFIÉ         NON
```

```text
PORTE D'USAGE RÉEL
= FRANCHIE pour ce qu'elle couvre

PROCHAINE ÉTAPE
= SÉLECTION HUMAINE de la première tâche réelle authentique du Lab
```
