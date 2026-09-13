# TOOLING-EXPERIMENT-003 — conception du premier dogfood en usage réel

## 1. Statut et autorité

```text
TYPE
= conception de dogfood, ratifiée par l'humain

EXPÉRIENCE
= TOOLING-EXPERIMENT-003

TÂCHE RÉELLE SÉLECTIONNÉE
= maintenance bornée du README
= 27-…-FIRST-LIVE-DOGFOOD-TASK-SELECTION.md, INCHANGÉE

CE DOCUMENT
= autorité de conception du dogfood
= GELÉ

AUTORITÉ SÉMANTIQUE DE RESULT INSTANCE
= 23-…-RESULT-INSTANCE-V0.md, INCHANGÉE

AUTORITÉ DE DESIGN D'IMPLÉMENTATION
= 24-…-IMPLEMENTATION-DESIGN.md, INCHANGÉE

AUTORITÉ SÉMANTIQUE DE MISSION OBJECT
= 14-…-MISSION-OBJECT-V0.md, INCHANGÉE

OBJET DE MISSION
= AUCUN ICI

ENVELOPPE
= AUCUNE ICI

EXÉCUTANT
= AUCUN

MUTATION DU README
= 0
```

```text
ÉTUDE DE CONCEPTION
= PASS AVEC CORRECTIONS MATÉRIELLES
```

## 2. Les deux choix humains, tranchés

```text
SÉQUENCEMENT DES EFFETS GIT
= A

l'édition du README, son commit, sa poussée et la mesure de publication
post-poussée appartiennent à l'EXÉCUTANT du dogfood
```

Motif gelé :

```text
l'instance de résultat doit pouvoir préserver la réalisation, la
non-réalisation et la non-tentative RÉELLES des effets de la tâche, avant
toute qualification
```

```text
CONSOMMATEUR FACTUEL EN AVAL
= SESSION LOGIQUE FRAÎCHE REQUISE
```

```text
FRAÎCHEUR SEULE
≠ SUFFISANTE

CONSOMMATEUR FRAIS
+ PAQUET D'ENTRÉE EXCLUANT LA PROSE DE SESSION DE L'EXÉCUTANT
= REQUIS
```

Aucun numéro de session n'est alloué ici.

## 3. Architecture à deux bases

L'étude proposait qu'un objet de mission porte le SHA du commit qui le
contient. C'est impossible, et la construction est rejetée.

```text
BASE CIBLE DU README
= le commit produit par CETTE mission de matérialisation
```

Elle contient :

```text
l'autorité 28
la décision de conception et la transition d'action suivante dans PROGRAM-STATE
tout l'état durable du Lab pertinent pour le README, déjà présent
```

```text
SON SHA N'APPARAÎT NI DANS L'AUTORITÉ 28 NI DANS PROGRAM-STATE
AVANT QUE LE COMMIT N'EXISTE
= il est observé et retourné après la matérialisation
```

```text
TÊTE DE DÉPÊCHE
= un commit descendant direct ultérieur
= il ne contient QUE le paquet opérationnel du dogfood :
    tooling/result-instance/live-dogfood/001/mission.json
    tooling/result-instance/live-dogfood/001/envelope.md
```

```text
AUCUNE NOUVELLE AUTORITÉ RACINE NUMÉROTÉE
AUCUNE ÉDITION DU README
AUCUNE MUTATION DE PROGRAM-STATE
AUCUNE NOUVELLE AIRE D'OUTILLAGE
```

D'où l'invariant qui rend la cible stable :

```text
ÉTAT DURABLE PERTINENT POUR LE README À LA BASE CIBLE
=
ÉTAT DURABLE PERTINENT POUR LE README À LA TÊTE DE DÉPÊCHE
```

L'objet de mission futur peut donc porter sans circularité :

```text
readme.target_base
= SHA réel de la BASE CIBLE DU README
```

parce que ce SHA existe déjà avant que `mission.json` ne soit écrit.

```text
IL NE DOIT PAS PORTER LE SHA DE SON PROPRE COMMIT DE DÉPÊCHE
```

## 4. Vérification de la tête de dépêche

La dépêche future peut fournir, comme contexte de transport, le SHA déjà
existant de la TÊTE DE DÉPÊCHE.

Le préflight de l'exécutant doit vérifier :

```text
HEAD
= le SHA dépêché

parent(HEAD)
= BASE CIBLE DU README

chemins modifiés entre BASE CIBLE et HEAD
= exactement mission.json + envelope.md du paquet
```

```text
L'OBJET DE MISSION SE LIE À LA BASE CIBLE
≠ À SON PROPRE COMMIT CONTENANT
```

Un item factuel retourné pourra rapporter la HEAD réellement observée au
démarrage. Aucune auto-référence n'est introduite.

## 5. Cible du README, temporellement stable

```text
ÉTAT CIBLE DU README
= réconcilier le README contre l'état durable du Lab pertinent pour lui,
  présent À LA BASE CIBLE DU README
```

```text
PLAGE STATIQUE D'AUTORITÉS
= AUCUNE
```

Le paquet de dogfood committé ensuite est de la machinerie opérationnelle : il
n'ajoute ni autorité racine indexée, ni aire d'outillage. Les autorités
d'évaluation créées après l'exécution sont hors cible par construction.

Ce n'est pas une précaution théorique. Le README courant était EXACT à sa
propre base de rédaction ; il a été périmé par le déplacement de la base, et
republié tel quel deux fois.

## 6. Règle d'index des documents

```text
SECTION « Documents » DU README
= indexer chaque autorité racine numérotée NN-*.md présente à la BASE CIBLE,
  dans l'ordre numérique,
  au niveau d'abstraction existant du README
```

Règle dérivée du dépôt, non inventée : à la base de rédaction du README,
l'ensemble des fichiers racine numérotés et l'ensemble indexé coïncidaient
exactement.

```text
L'AUTORITÉ 28 APPARTIENT DONC À L'INDEX CIBLE
LE PAQUET DE DÉPÊCHE ULTÉRIEUR N'Y APPARTIENT PAS
```

```text
REFONTE DE LA NAVIGATION DU README
= INTERDITE
```

## 7. Règle d'index de l'outillage

```text
SECTION « Outillage » DU README
= représenter chaque aire tooling/<aire>/ présente à la BASE CIBLE,
  au niveau d'abstraction existant
```

À la base cible :

```text
tooling/result-instance/
= DOIT ÊTRE REPRÉSENTÉE
```

L'ajout ultérieur de fichiers sous une aire déjà existante ne modifie pas la
cible d'aires.

## 8. Préséance d'autorité pour les statuts courants

```text
ÉTAT DE FLUX / DE DÉCISION / ACTION SUIVANTE
→ PROGRAM-STATE.json

CONCLUSION EXPÉRIMENTALE DE TE001
→ RESULT-001 / l'autorité de conclusion TE001 applicable

CONCLUSION EXPÉRIMENTALE DE TE002
→ autorité 20

POSITION SUBSTANTIELLE COURANTE DE TE003
→ la dernière autorité TE003 gelée applicable
```

```text
AUTORITÉ 26
SUPERSÈDE L'AUTORITÉ 25
SEULEMENT dans la portée exacte de qualification historique que l'autorité 26
consigne
```

```text
PROGRAM STATE
≠ AUTORITÉ SUBSTANTIELLE DE RÉSULTAT EXPÉRIMENTAL
```

Un état de flux se lit dans le point de reprise ; une conclusion se lit dans
son autorité de conclusion. Les énoncés historiques ne sont pas réécrits.

## 9. Frontière de préservation du README

Trois contrôles.

```text
FRONTIÈRE DE CHEMIN
= le chemin d'effet de tâche suivi est README.md, et lui seul
```

Les artefacts d'infrastructure du dogfood sont des artefacts expérimentaux
distincts. Ils ne sont jamais confondus avec les chemins de la tâche README.

```text
PRÉSERVATION DE SECTION
= les sections exclues — tournées vers CCR, cas, arcs de feedback — sont
  préservées à l'octet, ou par un contrôle de section déterministe équivalent
  supporté par Mission Object v0
```

```text
AFFIRMATIONS INTERDITES
= TE003 est terminée
= la capture en usage réel est déjà validée
= ce dogfood a réussi, avant qualification
= une nouvelle exigence pèse sur CCR System
= TE001 est CLOSED
= un travail différé est désormais dû
```

sauf si une autorité ratifiée indépendamment et créée AVANT l'exécution le dit.

```text
UNE TELLE AUTORITÉ EXISTE AUJOURD'HUI
= NON
```

## 10. Tâche README et capture expérimentale

```text
RÉSULTAT DE LA TÂCHE README
RÉSULTAT DE PRODUCTION DE L'INSTANCE
RÉSULTAT DE RÉCUPÉRATION FACTUELLE EN AVAL
ÉVALUATION DU DOGFOOD EN USAGE RÉEL DE TE003
```

```text
JAMAIS FONDUS
```

Combinaisons légitimes, et attendues comme telles :

```text
TÂCHE README BLOQUÉE + PRODUCTION D'INSTANCE PASS
TÂCHE README PASS    + PRODUCTION D'INSTANCE FAIL
```

```text
UN README CORRECT NE PROUVE PAS LE SUCCÈS DE TE003
UNE TÂCHE README BLOQUÉE NE PROUVE PAS SON ÉCHEC
```

## 11. Mission Object v0

```text
MISSION OBJECT v0
= SUFFISANT

EXTENSION REQUISE
= AUCUNE

MODIFICATION DE CODE
= AUCUNE
```

Le paquet futur doit exprimer, sous la seule autorité 14 :

```text
transformation bornée du README
contexte de base cible
référence et identité de départ du README
effets permis et interdits
exigences de contenu
exigences de préservation
contraintes d'effet Git
contrat de retour
résultats terminaux de tâche
continuations de branche bloquée
exigences de preuve
autorité humaine
contraintes permanentes
arrêt après retour
```

```text
IDENTIFIANTS D'ACTION OPAQUES
= admis pour nommer la production, la validation et le gel de l'instance
= l'autorité 14 n'interprète jamais un nom d'action
```

## 12. Séquencement des effets Git — ratifié

```text
EXÉCUTANT
→ édite le README
→ relit le diff borné
→ gèle l'identité du README obtenu
→ crée le commit de tâche du README
→ tente une poussée ordinaire en avance rapide
→ mesure l'état du distant
→ produit l'instance de résultat
→ valide l'instance
→ gèle l'instance
→ annonce l'instance gelée
```

```text
ÉCHEC PROVOQUÉ INTENTIONNELLEMENT
= INTERDIT
```

## 13. Continuations de capture sur branche bloquée

Correction de l'ordre strict « succès seulement » proposé par l'étude.

Toute branche bloquée au niveau de la tâche doit, tant que la production de
l'instance reste possible, continuer par :

```text
recueillir l'état factuel restant, mesurable sans risque
→ produire l'instance de résultat
→ valider
→ geler
→ annoncer
→ retourner le résultat terminal de tâche
```

Exemples visés :

```text
édition non achevée
commit non réalisé
poussée non réalisée
publication non vérifiée
```

```text
BLOCAGE DE TÂCHE
≠ BLOCAGE DE CAPTURE
```

Aucun de ces cas ne doit terminer avant d'avoir tenté la capture.

Si la production ou la validation de l'instance échoue elle-même :

```text
AUCUNE INSTANCE VALIDE N'EXISTE
les octets produits invalides peuvent être conservés localement comme preuve
  d'échec expérimental
le résultat de capture est évalué DE L'EXTÉRIEUR
```

```text
L'INSTANCE NE RAPPORTE JAMAIS SA PROPRE INVALIDITÉ
```

## 14. Résultat de tâche et résultat de capture

```text
rf-task-outcome
= décrit UNIQUEMENT la tâche README / Git
```

Domaine clos prospectif :

```text
PASS
BLOCKED_EDIT_NOT_COMPLETED
BLOCKED_COMMIT_NOT_REALIZED
BLOCKED_PUSH_NOT_REALIZED
BLOCKED_PUBLICATION_UNVERIFIED
```

```text
BLOCKED_RESULT_INVALID
= EXCLU DU DOMAINE
= il appartient au résultat de production / validation de l'instance, évalué
  hors de toute instance valide
```

## 15. Contrat de retour minimal corrigé

Neuf exigences factuelles prospectives.

```text
1  rf-starting-head          SCALAR
   HEAD Git réellement observée au préflight de l'exécutant
   lie l'exécution réelle au paquet dépêché, sans contenu auto-référentiel

2  rf-readme-final-blob      SCALAR
   identité de blob Git de README.md après la tentative d'édition bornée

3  rf-modified-paths         SET
   chemins de tâche suivis modifiés, relativement à l'état de dépêche
   n'inclut PAS les chemins de persistance de l'instance ni de la preuve
   valeur attendue en succès : { README.md }

4  rf-commit-realized        SYMBOL     YES | NO

5  rf-commit-identifier      SCALAR
   en l'absence de commit README : NON-PRODUCTION STRUCTURELLE
   ne JAMAIS encoder NOT_REALIZED comme faux identifiant SCALAR

6  rf-push-status            SYMBOL     REALIZED | NOT_REALIZED | NOT_ATTEMPTED

7  rf-remote-main-head       SCALAR
   à mesurer même sur les chemins Git bloqués, dès que la mesure est possible
   si elle est réellement impossible : NON-PRODUCTION STRUCTURELLE
   ne JAMAIS encoder un SHA arbitraire en SYMBOL
   ne JAMAIS employer NOT_MEASURED comme faux identifiant, par symétrie
     historique

8  rf-task-outcome           SYMBOL     domaine du § 14

9  rf-blocker-reason         SYMBOL
   NONE | PERMISSION_DENIED | ENVIRONMENT_REFUSAL | REPOSITORY_FACT | OTHER
   décrit le blocage de TÂCHE, jamais la validité de l'instance
```

Le typage SCALAR des identités de commit et de distant est une correction
matérielle : une empreinte n'est pas un membre de vocabulaire clos.

## 16. Sacs génériques retirés

```text
rf-deviations
rf-errors
= ABSENTS DU CONTRAT
```

Motif :

```text
prose générique de déviation ou d'erreur
= échappatoire factuelle
= incompatible avec la discipline d'un contrat prospectif clos
```

Pour un fait réellement inattendu, Result Instance v0 permet déjà :

```text
defined_by = EXECUTOR
```

dans sa sémantique strictement bornée à l'exécution. Un tel item est
FACULTATIF et doit naître d'un fait réellement inattendu.

```text
FABRIQUER PROSPECTIVEMENT DES ITEMS EXECUTOR
= INTERDIT
```

## 17. Identités de fait

```text
les neuf exigences prospectives
= defined_by RETURN_CONTRACT, lorsqu'elles sont représentées en valeur

IDENTITÉS SOURCE PROSPECTIVES
= AUCUNE

IDENTITÉS EXECUTOR PROSPECTIVEMENT REQUISES
= AUCUNE

LIBELLÉ SÉMANTIQUE LIBRE
= AUCUN

CHARGE UTILE GÉNÉRIQUE
= AUCUNE
```

## 18. Preuve temporelle de l'état du distant

Correction du problème de vérification temporelle : une mesure du distant
cesse d'être vraie dès qu'un commit ultérieur avance `origin/main`.

```text
ARTEFACT DE PREUVE PROSPECTIF
= tooling/result-instance/live-dogfood/001/evidence/remote-main-head.txt
```

```text
CONTENU
= sortie déterministe brute de la mesure bornée de la tête distante
= AUCUNE prose explicative
```

```text
CLASSE
= preuve factuelle produite par l'exécutant
≠ qualification
```

L'exécutant gèle ce fichier et en mesure l'identité de blob Git AVANT d'écrire
et de geler l'instance de résultat.

Lorsque `rf-remote-main-head` est produit, son entrée dans l'instance référence
cet artefact par :

```text
localisateur relatif au dépôt
identité GIT_BLOB
```

selon le modèle de référence de preuve gelé par l'autorité 23.

Cela lie l'état distant rapporté à des octets durables, et non à ce que
`origin/main` deviendra ensuite.

```text
SI AUCUNE MESURE DU DISTANT N'EST POSSIBLE
= ne fabriquer ni le fichier de preuve, ni la valeur
```

## 19. Chemins des artefacts

```text
tooling/result-instance/live-dogfood/001/result.json
tooling/result-instance/live-dogfood/001/mission.json
tooling/result-instance/live-dogfood/001/envelope.md
tooling/result-instance/live-dogfood/001/evidence/remote-main-head.txt
```

```text
RÈGLE .gitattributes EXISTANTE
= COUVRE DÉJÀ CETTE AIRE

MUTATION DE .gitattributes
= AUCUNE
```

Le nom `live-dogfood` évite toute collision avec `DOGFOOD-001` de TE002, qui
désigne déjà autre chose dans ce dépôt, et fait pendant au répertoire
`representability/` : capture en usage réel d'un côté, représentabilité
rétrospective de l'autre.

## 20. Structure de l'instance de résultat

```text
autorité de représentation   autorité 23
identité d'exécution         te003-live-dogfood-001
source                       MISSION → mission.json future, par blob
reported_by                  l'exécutant logique réel
contrat de retour            mission.json future, par blob
entrées rapportées           selon le chemin de tâche réellement emprunté
```

Chemin de succès normal :

```text
rf-starting-head        REPORTED_VALUE / SCALAR
rf-readme-final-blob    REPORTED_VALUE / SCALAR
rf-modified-paths       REPORTED_VALUE / SET { README.md }
rf-commit-realized      REPORTED_VALUE / SYMBOL YES
rf-commit-identifier    REPORTED_VALUE / SCALAR <SHA de commit>
rf-push-status          REPORTED_VALUE / SYMBOL REALIZED
rf-remote-main-head     REPORTED_VALUE / SCALAR <SHA mesuré> + preuve
rf-task-outcome         REPORTED_VALUE / SYMBOL PASS
rf-blocker-reason       REPORTED_VALUE / SYMBOL NONE
```

```text
LORSQU'UNE VALEUR PROSPECTIVE N'EXISTE RÉELLEMENT PAS
= NON-PRODUCTION STRUCTURELLE
= et seulement là où la sémantique correspond vraiment à une non-production

FABRIQUER UNE SENTINELLE POUR ÉVITER UNE NON-PRODUCTION
= INTERDIT
```

C'est la correction de fond : là où l'historique TE002 encodait `NOT_REALIZED`
ou `NOT_MEASURED` dans un champ d'identité, la conception gelée emploie la
relation structurelle prévue pour cela.

## 21. Production, validation et gel de l'instance

Séquence de l'exécutant, après les effets de tâche :

```text
écrire et geler la preuve temporelle, lorsqu'elle est disponible

écrire result.json

exécuter :
node tooling/result-instance/validate.mjs \
  tooling/result-instance/live-dogfood/001/result.json \
  tooling/result-instance/live-dogfood/001/mission.json

exiger une validation structurelle et mécanique PASS

puis geler les octets exacts
```

```text
RÉÉCRITURE DE result.json APRÈS LE GEL
= INTERDITE
```

Mesure externe, sur les octets gelés :

```text
blob Git
SHA-256
```

```text
L'INSTANCE NE CONTIENT NI SON PROPRE BLOB NI SON PROPRE SHA-256
```

## 22. Passation et retour de l'exécutant

Le retour de session de l'exécutant est restreint à la localisation et à la
vérification de l'artefact déjà gelé :

```text
RESULT INSTANCE PATH
RESULT INSTANCE GIT BLOB
RESULT INSTANCE SHA-256
VALIDATION = PASS / FAIL
```

```text
AUCUN FAIT DE TÂCHE
AUCUN RÉCAPITULATIF FACTUEL DU README
AUCUN RÉCAPITULATIF DE COMMIT OU DE POUSSÉE
AUCUNE RECONSTRUCTION NARRATIVE
```

```text
TOUTE PROPOSITION FACTUELLE D'EXÉCUTION NÉCESSAIRE EN AVAL ET FOURNIE
UNIQUEMENT PAR LA PROSE DE L'EXÉCUTANT
= REPORT FACTUEL MANUEL > 0
```

## 23. Persistance du résultat — règle sûre

La persistance est mécanique, et séparée de la réalisation des effets de tâche.

Sur le chemin pleinement publié, exiger AVANT toute persistance :

```text
le commit du README existe
l'exécutant rapporte push REALIZED dans l'instance gelée
la mesure du distant pré-persistance a été vérifiée indépendamment
origin/main à ce point pré-persistance = le commit README de l'exécutant
```

Alors seulement l'orchestration en aval peut persister mécaniquement les
octets gelés exacts :

```text
result.json
evidence/remote-main-head.txt
```

dans un commit DISTINCT sur `main`.

```text
RÉÉCRITURE SÉMANTIQUE      AUCUNE
MUTATION DU README         AUCUNE
RÉÉCRITURE DE L'INSTANCE   AUCUNE
```

### Règle critique de poussée échouée

Si :

```text
le commit du README existe localement
MAIS la poussée du README par l'exécutant est NOT_REALIZED
```

alors l'aval NE DOIT PAS créer ni pousser un commit de persistance par-dessus
ce commit README local.

Le faire publierait le commit README et réaliserait rétroactivement l'effet de
tâche que la couche de persistance est censée seulement CONSIGNER.

```text
LA PERSISTANCE DU RÉSULTAT NE DOIT JAMAIS RÉALISER
UN EFFET GIT README NON RÉALISÉ
```

La même règle conservatrice s'applique lorsque la publication ne peut pas être
vérifiée.

Pour ce dogfood v0 :

```text
publication de tâche non pleinement vérifiée
→ préserver localement les octets gelés de l'instance et de la preuve
→ la production par l'exécutant peut être observée
→ la persistance durable au dépôt reste INCOMPLÈTE
→ la phase de consommation durable fraîche n'est PAS déclarée réussie
→ AUCUNE poussée de persistance sur main
```

```text
BRANCHE AUXILIAIRE OU MAGASIN DURABLE ALTERNATIF POUR SAUVER CE CHEMIN
= NON INVENTÉ
```

## 24. Circularité du commit de persistance

Sur une publication README réussie :

```text
COMMIT README            = C1
l'exécutant pousse C1
l'exécutant mesure le distant = C1
l'exécutant produit et gèle l'instance
l'orchestrateur persiste instance et preuve = C2
```

L'instance peut rapporter :

```text
rf-commit-identifier = C1
rf-remote-main-head  = C1
```

Elle ne dit RIEN de C2.

```text
DÉPENDANCE CIRCULAIRE
= AUCUNE
```

L'artefact de preuve temporelle conserve la mesure de l'ère C1 même une fois
que `origin/main` vaut C2.

## 25. Consommateur aval frais — ratifié

Un consommateur aval logique frais et distinct est requis pour la récupération
factuelle.

La fraîcheur protège contre :

```text
la mémoire des dogfoods README antérieurs
la connaissance du retour narratif de l'exécutant
une interprétation préexistante de ce qui a changé
la connaissance du contenu de l'instance avant de l'avoir lue
```

Paquet d'entrée autorisé :

```text
identité de la BASE CIBLE DU README
identité de la TÊTE DE DÉPÊCHE
chemin de l'instance persistée + identités vérifiées indépendamment
mission.json / envelope.md
autorité 23
autorité 24
autorité 28
preuves durables explicitement référencées
README.md et l'état du dépôt, là où la qualification de contenu l'exige
```

Paquet interdit :

```text
retour narratif de l'exécutant
résumés des dogfoods README antérieurs
reconstruction factuelle par l'orchestrateur
transcription de conversation
souvenirs non énoncés
```

L'annonce de chemin et d'empreinte sert à LOCALISER l'artefact, jamais comme
source factuelle d'exécution.

```text
SESSION DE CONSOMMATEUR ALLOUÉE ICI
= AUCUNE
```

## 26. Mesure de l'absence de repli sur la prose

Le consommateur frais doit produire un REGISTRE DE SOURCES FACTUELLES
exhaustif :

```text
PROPOSITION FACTUELLE D'EXÉCUTION
→ CLASSE DE SOURCE
  = INSTANCE DE RÉSULTAT
  | AUTORITÉ DE MISSION / DE CONTRAT
  | PREUVE DURABLE EXPLICITEMENT RÉFÉRENCÉE
```

```text
QUATRIÈME CLASSE
= AUCUNE
```

Exigences :

```text
PROPOSITIONS FACTUELLES ISSUES DE LA PROSE DE L'EXÉCUTANT   = 0
REPORT FACTUEL MANUEL                                        = 0
ARCHÉOLOGIE DE PROSE DE SESSION                              = 0
```

```text
SI UN FAIT D'EXÉCUTION NÉCESSAIRE N'A AUCUNE DES TROIS CLASSES AUTORISÉES
→ RÉCUPÉRABILITÉ FACTUELLE = FAIL
```

## 27. Évaluation de la tâche README

Tenue séparée de la capture factuelle.

```text
ÉVALUATION MÉCANIQUE
= ensemble des autorités racine numérotées à la base cible
= ensemble des aires d'outillage à la base cible
= diff du README
= chemins modifiés
= sections préservées
= affirmations interdites
= README identifié par l'empreinte que l'instance rapporte
```

```text
REVUE DOCUMENTAIRE HUMAINE
= formulation du statut de TE001
= formulation du statut de TE002
= formulation du statut de TE003
= qualité et justesse des gloses d'autorités
= disparition effective des énoncés périmés
```

```text
CES JUGEMENTS
≠ FAITS DE L'INSTANCE DE RÉSULTAT
```

## 28. Les six critères de TE003

Mesure du dogfood contre l'autorité 23.

```text
1  RÉCUPÉRABILITÉ FACTUELLE
   tout fait d'exécution réellement nécessaire en aval est récupérable par les
   sources autorisées

2  REPORT FACTUEL MANUEL
   = 0

3  ARCHÉOLOGIE / REPLI SUR LA PROSE DE SESSION
   = 0
   garanti STRUCTURELLEMENT par le consommateur frais et le pare-feu d'entrée,
   puis attesté par le registre de sources factuelles

4  FIDÉLITÉ D'EXÉCUTION PARTIELLE
   si un état partiel ou bloqué survient naturellement : évaluer sa
   préservation exacte
   s'il n'en survient aucun : NON EXERCÉE DANS CE RUN

5  FUITE DE QUALIFICATION
   = 0
   l'instance ne porte que du rapport factuel

6  INTÉGRITÉ FACTUELLE
   faits retournés inventés = 0
   faits retournés requis omis = 0
   vérifiés contre le contrat et contre les faits durables indépendants
   disponibles
```

```text
CONVERSION SILENCIEUSE DE « NON EXERCÉE » EN « PASS »
= INTERDITE
```

## 29. Revendication bornée attendue

Un dogfood réussi n'établira que ceci, et rien de plus large :

```text
Sur UNE mission réelle du Lab CCR, adossée à Mission Object, portant sur la
maintenance du README, un exécutant réel a produit et gelé une instance
Result Instance v0 valide avant toute qualification ; cette instance a été
persistée durablement sans réécriture sémantique ; et un consommateur aval
frais a récupéré les faits d'exécution dont il avait besoin depuis l'instance,
les autorités prospectives et les preuves durables explicitement référencées,
sans reconstruction factuelle depuis la prose de session de l'exécutant.
```

Ce qui ne sera PAS revendiqué :

```text
capture adossée à un protocole validée en usage réel
fiabilité universelle de Result Instance
non-production structurelle exercée, sauf si elle survient réellement
fidélité d'exécution partielle exercée, sauf si elle survient réellement
TE003 conclue automatiquement
```

## 30. Ce que ce document ne fait pas

```text
OBJET DE MISSION CRÉÉ                     NON
ENVELOPPE CRÉÉE                           NON
INSTANCE DE RÉSULTAT CRÉÉE                NON
ARTEFACT DE PREUVE CRÉÉ                   NON
EXÉCUTANT SÉLECTIONNÉ OU ALLOUÉ           AUCUN
CONSOMMATEUR AVAL ALLOUÉ                  AUCUN
README MODIFIÉ                            NON
AUTORITÉS 14 · 23 · 24 · 25 · 26 · 27 MODIFIÉES   NON
LOGICIEL RESULT INSTANCE MODIFIÉ          NON
MISSION OBJECT MODIFIÉ                    NON
.gitattributes MODIFIÉ                    NON
FLUX DE DOGFOOD CRÉÉ                      NON
TESTS EXÉCUTÉS                            0
```

```text
CHOIX DE CONCEPTION DE DOGFOOD HUMAINS RESTANTS
= 0
```

```text
TOOLING-EXPERIMENT-003
= OPEN

CONCEPTION DU PREMIER DOGFOOD EN USAGE RÉEL
= GELÉE / RATIFIÉE

BASE CIBLE DU README
= le commit qui matérialise ce document

TÊTE DE DÉPÊCHE
= PAS ENCORE CRÉÉE

EXÉCUTION EN USAGE RÉEL
= NON COMMENCÉE
```
