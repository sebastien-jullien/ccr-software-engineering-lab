# Ordonnancement de durabilité — résultat et panneau C

## 1. Statut et portée

```text
TYPE
= réparation déterministe d'ordonnancement, côté orchestration

OBJET
= geler l'ordre de durabilité entre l'instance de résultat de l'exécutant et
  l'observation du panneau C

CE DOCUMENT
= autorité d'ordonnancement de durabilité
= GELÉ
```

```text
AUTORITÉ D'ÉTUDE PRIMAIRE
= 35-DECISION-CONSEQUENCE-BOUNDARY-BOUNDED-MISSION-FREEZE.md
= blob 9a067717b3fb5e3daca7a7be3a34b1362b843ea3
= INCHANGÉE

AUTORITÉ D'OBSERVATION DE CONSOLE
= 36-LOCAL-MISSION-CONSOLE-V0-REAL-USE-OBSERVATION-CAPTURE-PROTOCOL.md
= blob dc77a8a561b9ec92d05e6996f69c7929beb2c5b2
= NON MODIFIÉE
= SUPERSÉDÉE DANS UNE PORTÉE EXACTE, ET LÀ SEULEMENT
```

Le seul défaut traité :

```text
DURABILITÉ DU RÉSULTAT
vs
DURABILITÉ DE L'OBSERVATION DU PANNEAU C
```

## 2. Le défaut ratifié

```text
UNE OBSERVATION DU PANNEAU C NE DOIT PAS DEVENIR DURABLE
TANT QUE LE RÉSULTAT QU'ELLE A OBSERVÉ RESTE NON DURABLE
```

L'autorité 36 § 8 faisait committer l'observation du panneau C après la
production du résultat, sans exiger que ce résultat soit lui-même durable.

Conséquence si le défaut restait :

```text
un constat durable décrirait un objet que le dépôt ne porte pas
une interruption après le commit d'observation perdrait le résultat observé
et l'observation deviendrait invérifiable, sans qu'on puisse rejouer le
panneau C sans réexécuter la mission primaire
```

```text
FICHIER NON COMMITÉ
≠ PREUVE DURABLE DU LAB
```

## 3. Invariant cible

```text
QUAND L'OBSERVATION DU PANNEAU C EST DÉCLARÉE DURABLE :

le result.json EXACT observé par le panneau C
= DURABLEMENT RÉCUPÉRABLE

ET

l'observation du panneau C
= DURABLEMENT RÉCUPÉRABLE
```

```text
OCTETS DE RÉSULTAT OBSERVÉS PAR LE PANNEAU C
= OCTETS DE RÉSULTAT DURABLEMENT MATÉRIALISÉS
```

```text
REMPLACEMENT OU ÉDITION SILENCIEUSE ENTRE OBSERVATION ET CAPTURE DURABLE
= INTERDIT
```

## 4. Producteur sémantique et enregistreur Git

```text
PRODUCTEUR SÉMANTIQUE DE result.json
= L'EXÉCUTANT

ENREGISTREUR GIT / COMMITTER DE result.json
= PEUT ÊTRE L'ORCHESTRATION
```

```text
QUI COMMITE LES OCTETS
≠ QUI A PRODUIT LE RETOUR
```

```text
reported_by.executor
= AUTORITÉ D'ATTRIBUTION DU PRODUCTEUR
= L'ORCHESTRATION NE LE RÉÉCRIT PAS

ÉDITER UN OCTET RETOURNÉ PAR L'EXÉCUTANT
AU MOTIF QUE L'ON EXÉCUTE LA MATÉRIALISATION GIT
= INTERDIT
```

## 5. Précédent durable

### 5.1 TE003 — persistance de l'instance du premier dogfood en usage réel

Établi par les faits Git locaux et par l'autorité 28, sans aucune prose de
session.

```text
ARTEFACT
= tooling/result-instance/live-dogfood/001/result.json
  + tooling/result-instance/live-dogfood/001/evidence/remote-main-head.txt

PRODUCTEUR SÉMANTIQUE
= CCR_LAB_FIX_1
= reported_by.executor, lisible dans les octets persistés eux-mêmes

ENREGISTREUR GIT / COMMITTER
= orchestration
= commit b0a68a17d922170ef3f617523bd6f8f1ef83aa83
  « docs: persist first te003 live dogfood result »
  auteur Sébastien JULLIEN <sebastien.jullien.35@gmail.com>
  parent a1d731ede86befaadfa2d8da6a022e3fd44f9ec4

ORDONNANCEMENT
= 4257e4e dépêche
→ a1d731e effet de tâche de l'exécutant
→ b0a68a1 PERSISTANCE par l'orchestration
→ ef59751 qualification, autorité 30
→ 4d45730 réconciliation du README

OCTETS MODIFIÉS
= 0
= un seul commit touche result.json dans tout l'historique
= blob f0781cbea2a1bd773c95c7ebffc91915bb7c076d à la persistance ET à ce jour

ATTRIBUTION DE PRODUCTEUR PRÉSERVÉE PAR
= les octets eux-mêmes ; l'orchestration n'a rien réécrit

QUALIFICATION AVANT OU APRÈS LA PERSISTANCE
= APRÈS
= b0a68a1 est un ancêtre du commit ef59751 qui introduit l'autorité 30

APPLICABILITÉ SÉMANTIQUE AU RÉSULTAT COURANT
= DIRECTE
```

Règle durable correspondante, autorité 28 § 23 :

```text
« La persistance est mécanique, et séparée de la réalisation des effets de
  tâche. […] l'orchestration en aval peut persister mécaniquement les octets
  gelés exacts […] dans un commit DISTINCT sur main. »

RÉÉCRITURE SÉMANTIQUE      AUCUNE
RÉÉCRITURE DE L'INSTANCE   AUCUNE
```

Autorité 28 § 22 : le retour de session de l'exécutant se restreint à
localiser et vérifier l'artefact déjà gelé. L'exécutant ne persiste pas.

Autorité 28 § 24 : l'instance ne dit rien du commit de persistance ;

```text
DÉPENDANCE CIRCULAIRE = AUCUNE
```

### 5.2 Adaptation honnête à la mission courante

La garde de l'autorité 28 § 23 — « la persistance du résultat ne doit jamais
réaliser un effet Git README non réalisé » — protégeait une mission qui
portait des effets Git de tâche.

```text
EFFETS GIT DE TÂCHE DE LA MISSION COURANTE
= AUCUN

effets de l'exécutant = lecture, analyse, production / validation / gel
                        de result.json
COMMIT · PUSH · PERSIST_RESULT_INSTANCE = FORBIDDEN dans l'objet gelé
```

```text
DONC AUCUN EFFET GIT NON RÉALISÉ NE PEUT ÊTRE RÉTROACTIVEMENT RÉALISÉ
PAR UN COMMIT DE PERSISTANCE

LA GARDE EST SANS OBJET ICI
= CONSTAT, PAS SUPPRESSION
```

### 5.3 Crochet déjà prévu par l'autorité 35

```text
CONTRAINTE PERMANENTE sc-no-persistence-by-executor
= FORBIDDEN PERSIST_RESULT_INSTANCE sur repository_history
= release_condition : PRESENCE_OF downstream_persistence_authorization
```

```text
L'AUTORITÉ 35 A DONC PRÉVU UNE AUTORISATION DE PERSISTANCE EN AVAL
ET L'A LAISSÉE OUVERTE

L'AUTORITÉ 37 LA FOURNIT

CONTRADICTION AVEC L'AUTORITÉ 35
= AUCUNE
```

## 6. Qualification des deux cycles candidats

### Candidat A — résultat durable AVANT le panneau C

```text
résultat durable avant le panneau C                          OUI
panneau C rejouable après interruption sans réexécuter
  l'exécutant                                                OUI
le committer ne devient pas le producteur sémantique         OUI, précédent b0a68a1
les octets de l'exécutant restent inchangés                  OUI, invariant § 8
la qualification n'a pas encore eu lieu                      OUI, comme au précédent
le panneau C désigne une identité de résultat déjà durable   OUI
commit de persistance DISTINCT                               OUI, autorité 28 § 23
```

### Candidat B — commit atomique du résultat et de l'observation C

```text
résultat et observation deviennent durables atomiquement     OUI
le producteur sémantique reste l'exécutant                   OUI
interruption avant le commit atomique
  → ni l'observation ni la durabilité du résultat            OUI, mais le résultat
                                                             est alors perdu avec
                                                             la copie de travail
identité observée = identité committée                       ÉTABLIE SEULEMENT
                                                             AU MOMENT DU COMMIT :
                                                             le panneau C observe
                                                             des octets non encore
                                                             durables
séparation producteur / enregistreur par étape               AFFAIBLIE : un seul
                                                             commit porte l'artefact
                                                             de deux producteurs
commit de persistance distinct                               NON — contraire à la
                                                             pratique établie
```

### Sélection

```text
CYCLE SÉLECTIONNÉ
= CANDIDAT A

SÉLECTION
= DÉTERMINISTE
```

Base de sélection, sur les critères déjà gelés et dans cet ordre :

```text
récupérabilité après interruption   A strictement supérieur : après le commit
                                    de persistance, le panneau C se rejoue sans
                                    réexécuter la mission primaire ; en B, une
                                    interruption avant le commit atomique perd
                                    aussi le résultat

frontières d'étape claires          A strictement supérieur : une étape, un
                                    commit, un producteur

séparation producteur / enregistreur A strictement supérieur : la persistance
                                    est son propre commit, comme au précédent

fidélité d'octets exacte            A strictement supérieur : l'identité est
                                    établie AVANT l'observation, et le panneau C
                                    observe un objet déjà durable

pratique de persistance établie     A EST le précédent b0a68a1

réinterprétation des autorités 35/36 A minimale : aucun contrat de l'autorité 35
                                    n'est réinterprété, et seules trois clauses
                                    de l'autorité 36 sont supersédées
```

```text
MINIMISATION DU NOMBRE DE COMMITS
= CRITÈRE SECONDAIRE
= N'A PAS DÉCIDÉ CETTE SÉLECTION

PORTE HUMAINE
= AUCUNE
```

## 7. Porte de persistance du résultat

Avant le commit de persistance par l'orchestration, exiger :

```text
missions/001-decision-consequence-boundary/result.json
= EXISTE

autres chemins créés / modifiés / supprimés par l'exécutant
= 0

missions/001-decision-consequence-boundary/mission.json
= INCHANGÉ, blob e80bc3d250920cee66b4d26bef497b6094395144

missions/001-decision-consequence-boundary/envelope.md
= INCHANGÉ, blob a5320c00c20ec0b1f7f4c8f99515bd5a133b619e

missions/001-decision-consequence-boundary/console-real-use-observations.md
= INCHANGÉ depuis le commit durable de l'étape B

PROGRAM-STATE.json   INCHANGÉ
README.md            INCHANGÉ
tooling/**           INCHANGÉ
```

Mesurer, et consigner :

```text
taille · SHA-256 · blob Git · CR · LF · NUL
```

```text
EXIGER UN PASS SÉMANTIQUE AVANT LA PERSISTANCE
= NON

PERSISTER LE RETOUR RÉEL DE L'EXÉCUTANT
≠ QUALIFIER LE RETOUR RÉEL DE L'EXÉCUTANT
```

Une instance structurellement invalide, ou une étude substantiellement
infructueuse, reste le retour réel et doit être durablement consignée comme
tel.

```text
ALTÉRER LE RÉSULTAT POUR FAIRE PASSER LA VALIDATION DU PANNEAU C
= INTERDIT
```

## 8. Invariant d'octets à travers la persistance

```text
SHA-256 du result.json RETOURNÉ PAR L'EXÉCUTANT
= SHA-256 du result.json COMMITÉ

blob Git du result.json RETOURNÉ
= blob Git du result.json COMMITÉ

ÉDITIONS DE result.json APRÈS PERSISTANCE
= 0
```

```text
SI LES OCTETS DIFFÈRENT
→ NE PAS EMPLOYER LE PANNEAU C
→ RAPPORTER
→ STOP
```

## 9. Cycle de vie réparé

```text
ÉTAPE D'ORCHESTRATION A
= employer le panneau A
= écrire l'observation PANEL_A
= commit + push en avance rapide
= ce commit ne porte QUE console-real-use-observations.md

ÉTAPE D'ORCHESTRATION B
= employer le panneau B
= écrire l'observation PANEL_B
= commit + push en avance rapide
= ce commit ne porte QUE console-real-use-observations.md
= transmettre ensuite l'enveloppe rendue par la console à un exécutant frais

ÉTAPE DE L'EXÉCUTANT
= créer UNIQUEMENT le result.json réservé
= commit 0
= push 0
= STOP

ÉTAPE D'ORCHESTRATION DE PERSISTANCE DU RÉSULTAT
= vérifier la porte du § 7
= calculer les identités exactes du § 7
= NE RIEN ÉDITER
= commit du seul result.json
= push en avance rapide

ÉTAPE D'ORCHESTRATION C
= ouvrir le résultat COMMITÉ par le panneau C
= écrire l'observation PANEL_C
= commit + push en avance rapide
= ce commit ne porte QUE console-real-use-observations.md
```

```text
COMMITS D'ORCHESTRATION FUTURS
= 4
  1  observation PANEL_A
  1  observation PANEL_B
  1  persistance du résultat de l'exécutant
  1  observation PANEL_C

COMMITS DE L'EXÉCUTANT
= 0
```

```text
PRÉREQUIS DU PANNEAU C
= le résultat est DURABLEMENT MATÉRIALISÉ
= la copie de travail est PROPRE après le commit de persistance
= le panneau C lit donc exactement les octets durables
```

## 10. Liaison d'identité du panneau C

À consigner dans l'observation PANEL_C :

```text
COMMIT DE RÉSULTAT
BLOB GIT DU RÉSULTAT
SHA-256 DU RÉSULTAT
BLOB DU SNAPSHOT DE MISSION
STATUT D'ASSOCIATION DU PANNEAU C
STATUT DE VALIDATION STRUCTURELLE / DE CONTRAT DU PANNEAU C
```

```text
L'ARTEFACT D'OBSERVATION PEUT RÉFÉRENCER CES IDENTITÉS
IL N'EN DEVIENT PAS LE PRODUCTEUR
```

Ces identités sont produites par l'exécutant et par Git ; l'observation les
cite.

## 11. Reprise après interruption

```text
APRÈS LE COMMIT DE L'ÉTAPE A
→ reprendre à l'étape B

APRÈS LE COMMIT DE L'ÉTAPE B, AVANT LE RÉSULTAT
→ reprendre à la dépêche / à l'exécution

APRÈS PRODUCTION DU RÉSULTAT, AVANT LE COMMIT DE PERSISTANCE
→ LE RÉSULTAT N'EST PAS ENCORE DURABLE
→ si la copie de travail a survécu : vérifier les octets exacts, puis persister
→ si la copie de travail est perdue :
     NE PAS reconstruire le résultat depuis la conversation ni de mémoire
     le retour d'exécution doit être réacquis ou rejoué selon le traitement
     d'orchestration futur

APRÈS LE COMMIT DE PERSISTANCE, AVANT LE PANNEAU C
→ reprendre DIRECTEMENT au panneau C
→ SANS réexécuter l'exécutant

APRÈS LE COMMIT DE L'OBSERVATION PANEL_C
→ séquence de capture en usage réel DURABLEMENT COMPLÈTE
```

```text
RECONSTRUCTION DEPUIS LA CONVERSATION
= 0
```

## 12. Portée de supersession de l'autorité 36

L'autorité 36 n'est pas éditée. Trois clauses, et trois seulement, sont
supersédées :

```text
SUPERSÉDÉ
1  « COMMITS D'OBSERVATION AUTORISÉS PENDANT LA MISSION D'EXÉCUTION
     = EXACTEMENT 3 »
   → 3 commits d'observation + 1 commit de persistance du résultat
   → 4 commits d'orchestration au total

2  « chacun ne portant QUE console-real-use-observations.md »
   → vrai des trois commits d'observation
   → le commit de persistance du résultat ne porte QUE result.json

3  § 8, étapes 10 et 11 : employer le panneau C puis committer son observation
   sans exiger la durabilité préalable du résultat
   → le panneau C exige désormais un résultat DÉJÀ DURABLE
```

```text
PRÉSERVÉ, MOT POUR MOT
artefact d'observation sélectionné
champs d'observation
attribution du producteur
sémantique du panneau A
sémantique du panneau B
sémantique du panneau C
interdiction de verdict d'utilité
nature locale à la mission et non générique
traitement des défaillances
règles de reprise des étapes A et B
frontières d'écriture des acteurs
```

## 13. Ce que ce document ne fait pas

```text
AUTORITÉ 35 ROUVERTE                       NON
CORPUS HISTORIQUE MODIFIÉ                  NON
CINQ CAS MODIFIÉS                          NON
LIGNÉES MODIFIÉES                          NON
CONTRAT DE RETOUR À 80 CHAMPS MODIFIÉ      NON
CRITÈRES DE SUCCÈS MODIFIÉS                NON
mission.json MODIFIÉ                       NON
envelope.md MODIFIÉ                        NON
console-real-use-observations.md MODIFIÉ   NON
AUTORITÉ 36 ÉDITÉE                         NON
SÉLECTION DE SURFACE DE L'AUTORITÉ 36 ROUVERTE  NON
NOUVEAU SCHÉMA D'OBSERVATION               AUCUN
NOUVEAU SCHÉMA DE RÉSULTAT                 AUCUN
NOUVELLE REPRÉSENTATION                    AUCUNE
TOOLING-EXPERIMENT-004                     AUCUNE
NOUVELLE DÉCISION PROGRAM-STATE            AUCUNE
MISSION EXÉCUTÉE                           NON
INSTANCE DE RÉSULTAT CRÉÉE                 NON
OBSERVATION CAPTURÉE                       AUCUNE
RÉSULTAT QUALIFIÉ                          NON
UTILITÉ DE LA CONSOLE QUALIFIÉE            NON
TESTS EXÉCUTÉS                             0
```

```text
result.json
= TOUJOURS ABSENT À L'HEURE DE CETTE RÉPARATION

PRÊT À L'EXÉCUTION
= OUI, sous les autorités 35, 36 et 37

EXÉCUTION
= NON COMMENCÉE
```
