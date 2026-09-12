# TOOLING-EXPERIMENT-001 — État de programme durable et reprise

## 1. Statut

```text
TYPE
= expérience d'outillage du Lab

DESIGN
= RATIFIÉ PAR L'HUMAIN

CE DOCUMENT
= prédéclaration expérimentale normative
= autorité de conception du premier prototype
= GELÉ AVANT IMPLÉMENTATION

IMPLÉMENTATION
= NON COMMENCÉE
```

Ce document est écrit **avant** tout code, pour que ni le modèle d'état, ni les
critères de succès, ni la définition de l'échec ne puissent être ajustés après
avoir vu le comportement du prototype.

C'est une expérience du Lab sur sa propre conduite. Ce n'est pas un besoin CCR,
et rien ici ne devient un contrat, un état ou une commande de CCR System.
[`01-RELATION-TO-CCR.md`](01-RELATION-TO-CCR.md) § 3 range explicitement le
routage, les sessions persistantes et la **reprise d'une action** du côté du
consommateur.

## 2. Question expérimentale

```text
QUESTION PRINCIPALE
= un point de reprise d'état de programme durable et minimal rend-il la
  reprise du Lab fiable, sans reconstruction à partir de Git, des
  transcriptions et de la mémoire humaine ?

QUESTION ADDITIONNELLE, TESTÉE AUSSI
= la mise en évidence mécanique d'une dérive de source ou d'une contradiction
  change-t-elle ce qu'une session fraîche conclut ?
```

La seconde question porte le risque réel : un point de reprise capable de
vieillir en silence exactement comme le dépôt a vieilli n'aurait aucune valeur.

```text
ORCHESTRATION GÉNÉRALE DU DÉVELOPPEMENT   = NON
REMPLACER LA DÉCISION HUMAINE             = NON
EXÉCUTER OU LANCER DES AGENTS             = NON
```

## 3. Base empirique

Constats déjà établis et ratifiés. Ils ne sont pas rouverts ici.

```text
CASE-005
= l'état opérationnel a dépassé l'état durable du Lab

P3
= la résolution produit a dépassé l'état durable du Lab

#12 / #13
= évalués et clos opérationnellement
= la matérialisation durable a suivi avec retard

AUDIT DE REPRISE
= un état durable périmé a été traité comme l'état réel du programme

8c19c45
= matérialisation historique fausse, produite de bonne foi

RÉCUPÉRATION
= archéologie de transcriptions et d'artefacts
+ réparation contrôlée de l'historique

O-014
= l'état du programme peut avancer au-delà de l'état durable du dépôt
```

Le point à retenir pour la conception : l'échec n'a **pas** été l'absence
d'état écrit. Le dépôt portait un état, cet état était cohérent avec lui-même,
et la session qui l'a lu l'a lu correctement. Il était simplement faux, et rien
en lui ne pouvait le dire.

## 4. Règle d'autorité

```text
POINT DE REPRISE
= index durable de l'état de programme

POINT DE REPRISE
≠ autorité substantielle du seul fait d'être écrit

ÉTAT DE PROGRAMME
≠ ÉTAT GIT

UNE RÉFÉRENCE EXISTE
≠ L'AFFIRMATION EST ÉTABLIE
```

Le point de reprise dit **où** l'autorité se trouve et **ce qui a été vérifié
quand**. Il ne devient jamais l'autorité d'un fait substantiel.

En v0 il ne porte aucun récit dupliqué en texte libre : il porte des champs
structurés, et l'outil en produit le rendu lisible.

## 5. Contexte Git

```text
git_context
= contexte observé au moment où l'état a été établi

repository · branch · observed_base_head · observed_base_tree
```

Invariant critique :

```text
HEAD courant != observed_base_head
NE SIGNIFIE PAS
→ point de reprise périmé
```

Cette règle est corrective. Un point de reprise suivi par Git fait lui-même
avancer HEAD lorsqu'il est commité : une règle qui déduirait la péremption de
l'avancement de HEAD se déclarerait périmée à chaque enregistrement d'elle-même.

L'écart produit au plus un signal d'information :

```text
REPOSITORY_ADVANCED_SINCE_RECORDED_CONTEXT
```

La dérive de l'état de programme se juge sur l'identité des sources
pertinentes, jamais sur l'avancement arbitraire du dépôt.

## 6. Identité de contenu des sources

Les horodatages ne sont pas un mécanisme de détection de dérive.

```text
MÉCANISME RETENU
= identité de contenu

pour une preuve de chemin de dépôt :
  kind · path · observed_blob
```

```text
BLOB COURANT == BLOB ENREGISTRÉ
→ contenu de la source inchangé depuis la vérification

BLOB COURANT != BLOB ENREGISTRÉ
→ la source a changé depuis la vérification de l'affirmation
```

Explicitement rejetés comme autorités de dérive :

```text
un champ de date de vérification
l'ordre des dates de commit
la date de modification du système de fichiers
```

Ces valeurs peuvent rester présentes comme métadonnées d'information. Elles ne
décident rien.

## 7. Relation typée entre preuve et affirmation

Toute preuve invoquée pour justifier un état doit dire **quelle affirmation**
elle soutient.

```text
RÉFÉRENCE + AFFIRMATION SOUTENUE EXPLICITE
→ peut soutenir l'état

RÉFÉRENCE SEULE
→ ne prouve rien de cet état
```

Forme conceptuelle d'une entrée de preuve :

```text
kind        classe de référence
ref         la référence elle-même
access      classe d'accessibilité (§ 8)
supports    subject · field · value
observed    identité de contenu, là où elle s'applique
```

Une affirmation structurée n'est soutenue que s'il existe au moins une entrée
de preuve dont `supports` désigne exactement ce sujet, ce champ et cette
valeur.

Conséquence recherchée, par construction :

```text
EVALUATION.md existe
→ l'expérience a été exécutée

= IMPOSSIBLE
```

C'est une inférence de ce type qui a produit `8c19c45`. Un fichier présent ne
soutient rien tant qu'un humain n'a pas écrit ce qu'il soutient.

## 8. Classes d'accessibilité des preuves

La vérité d'une preuve et son accessibilité courante sont deux choses
distinctes.

```text
VERIFIABLE
= l'outil peut inspecter mécaniquement la référence déclarée

OPAQUE_BUT_ESTABLISHED
= l'établissement antérieur existe, mais l'outil ne peut pas vérifier
  la source directement

SEALED
= la source ne doit pas être déréférencée
= seul l'enregistrement qui l'a établie peut être inspecté

UNREACHABLE
= source attendue, actuellement inaccessible
```

Invariant critique :

```text
NON DÉRÉFÉRENÇABLE AUJOURD'HUI
≠ HISTORIQUEMENT FAUX
```

Une preuve de session, une décision humaine ou une source scellée ne devient
pas non soutenue au motif que l'outil v0 ne sait pas ouvrir la source
d'origine. Un artefact externe disparu se rapporte `UNREACHABLE`, et
l'affirmation qu'il soutenait n'est pas dégradée pour autant.

## 9. Modèle d'état minimal v0

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
  type
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
  value            lorsque SELECTED
  evidence[]
```

Vocabulaire d'incertitude, admis partout où il a un sens :

```text
UNKNOWN
UNRESOLVED
NOT_APPLICABLE
NOT_YET_SELECTED
```

```text
UNKNOWN            ≠ ZERO
UNKNOWN            ≠ CLOSED
NOT_YET_SELECTED   ≠ AUCUN BESOIN
```

La validation doit **accepter** ces valeurs. Un schéma qui forcerait une valeur
fabriquée pour être satisfait produirait exactement la panne qu'il est censé
détecter.

```text
decisions[].state    au minimum   PENDING · RATIFIED
next_action.state                 NOT_YET_SELECTED · SELECTED
```

Absents de la v0, délibérément :

```text
owner · target_agent · routing · état de handoff · dépendances
machine à états générale des conséquences · état de workflow automatique
```

Aucune panne observée ne les justifie. Le routage des sessions, en particulier,
a été mesuré comme fonctionnant : treize sessions, aucune collision, aucune
renumérotation.

Des champs mécaniques mineurs — un identifiant d'entrée de preuve, par
exemple — sont acceptables. Un champ **sémantique** nouveau ne l'est pas : s'il
devient nécessaire, l'implémentation s'arrête et le signale.

## 10. Persistance

```text
FORMAT PRIMAIRE
= JSON

SÉRIALISATION
= déterministe · ordre de clés fixe · indentation 2 · LF · saut de ligne final

CHEMIN PRIMAIRE
= PROGRAM-STATE.json   à la racine du dépôt
```

Raisons : lisible par machine, aucun analyseur à ajouter, validation
déterministe, et découvrable au premier geste d'une session fraîche — la
découvrabilité est une variable de l'expérience, pas une préférence.

Le Markdown n'est pas l'autorité persistée. Le rendu lisible est **produit par
l'outil**, jamais édité à la main.

## 11. Stockage

```text
POINT DE REPRISE
= suivi dans le dépôt du Lab

PREUVES
= référencées, jamais copiées
= dans le dépôt ou hors du dépôt
```

Modèle hybride, et une mise en garde qui lui est attachée :

```text
SUIVI PAR GIT
≠ GARANTIE DE FRAÎCHEUR
```

Mettre l'état dans Git ne le rend pas frais : c'est précisément ce qui a
échoué. La fraîcheur ne vient que du contrôle de provenance et de la discipline
de mise à jour.

## 12. Modèle de mise à jour

```text
MODÈLE
= remplacement de l'instantané courant

HISTORIQUE
= historique Git de PROGRAM-STATE.json

ÉVÉNEMENTIEL
= NON
```

Le fichier étant suivi, `git log -p -- PROGRAM-STATE.json` **est** déjà le
journal d'événements, avec auteur, date et message expliquant le pourquoi.
Construire un journal parallèle dupliquerait ce que Git fait bien en ajoutant
la plus grosse part de complexité du dessin.

Ni journal parallèle, ni base de données, ni service résident.

## 13. Surface de commandes v0

Exactement trois opérations. Pas de commande `show` en v0.

### `resume`

```text
DOIT
= exécuter la validation
= présenter d'abord ce qui est en attente ou non résolu
= rendre l'état de programme courant
= rendre l'action suivante, ou NOT_YET_SELECTED
= montrer les références de preuve
= montrer ce qui n'a pas pu être vérifié
= énoncer son propre angle mort

NE DOIT PAS
= exécuter du travail
= choisir du travail
= ratifier une décision
= invoquer un agent
= invoquer CCR
= modifier Git
```

L'angle mort à énoncer est structurel :

```text
un événement opérationnel que personne n'a consigné
= indétectable par cet outil
```

### `check`

Validation mécanique détaillée. Elle calcule et rapporte ; elle ne répare
jamais.

### `update`

```text
PEUT MODIFIER
= PROGRAM-STATE.json, et rien d'autre

EXIGE
= une provenance pour tout changement d'état substantiel

MET À JOUR MÉCANIQUEMENT
= les métadonnées de point de reprise concernées

EFFET GIT
= AUCUN — ni commit, ni push
```

## 14. Sémantique de dérive et de contradiction

Signaux mécaniquement disponibles :

```text
SOURCE_CHANGED
= le blob enregistré d'une preuve de chemin de dépôt diffère du blob courant

REFERENCE_MISSING
= une référence attendue comme vérifiable ne résout plus

UNSUPPORTED
= une affirmation structurée n'a aucune relation de preuve qui la soutienne

INCOMPLETE
= un état requis ne peut pas être établi de façon véridique

UNVERIFIED
= la classe ou l'accessibilité empêche la confirmation mécanique

REPOSITORY_ADVANCED_SINCE_RECORDED_CONTEXT
= information seulement
```

Explicitement exclus :

```text
HEAD a changé              → point de reprise périmé
un fichier existe          → contradiction avec NOT_RUN
un horodatage est récent   → le fait est invalide
```

Une contradiction exige des **affirmations soutenues réellement
incompatibles** — deux preuves soutenant deux valeurs inconciliables pour le
même sujet et le même champ — jamais la simple présence d'un fichier.

Limite énoncée par l'outil lui-même : il ne promet pas la fraîcheur ; il promet
seulement de ne jamais affirmer une fraîcheur qu'il n'a pas vérifiée.

## 15. Décisions humaines

```text
PENDING HUMAN DECISION
RATIFIED HUMAN DECISION
```

Et rien d'autre en v0.

```text
RECOMMANDATION
≠ RATIFIÉE
```

Une recommandation ne peut pas soutenir un état `RATIFIED` : cette confusion
s'est produite dans ce projet, et elle doit rester représentable. Les états
dédiés `DETERMINISTIC CONSEQUENCE` et `EXECUTED CONSEQUENCE` ne sont pas
introduits tant qu'un besoin n'a pas été démontré.

## 16. Preuve protégée

```text
LA PREUVE A ÉTÉ ÉTABLIE
≠ LA PREUVE DOIT ÊTRE REQUESTIONNÉE À LA REPRISE
```

Une référence `SEALED` ne doit jamais provoquer le déréférencement de sa
source. Seul l'enregistrement durable qui l'a établie peut être inspecté.

## 17. Choix d'implémentation gelés

```text
LANGAGE            Node.js 22
FORMAT DE MODULE   ESM · .mjs
DÉPENDANCES        bibliothèque standard seule · 0 dépendance externe
RACINE SOURCE      tooling/program-state/
TESTS              node --test
```

Aucune dépendance de paquet à la racine n'est introduite pour le point de
reprise. Ce choix suit la convention déjà en place dans `cases/*/control/`.

## 18. Chemins d'artefacts

```text
09-TOOLING-EXPERIMENT-001-PROGRAM-STATE.md   ce document
PROGRAM-STATE.json                           le point de reprise
tooling/program-state/program-state.mjs      l'outil
tooling/program-state/tests/*.test.mjs       les tests
tooling/program-state/RESULT-001.md          le record de résultat
```

L'implémentation pourra aussi modifier `.gitattributes`, uniquement pour
épingler un traitement LF déterministe là où c'est nécessaire — la
sérialisation déterministe en dépend.

## 19. Protocole de dogfood

```text
PHASE A — initialisation
= après implémentation, initialiser le point de reprise à partir de l'état
  réconcilié du Lab

PHASE B — maintien normal
= l'utiliser sur un petit nombre de transitions réelles du Lab
= AUCUNE omission délibérée de mise à jour
= consigner ce qui survient naturellement :
    mises à jour manquées · mises à jour tardives
    corrections manuelles · charge de maintenance

PHASE C — interruption réelle
= terminer normalement le contexte de travail

PHASE D — reprise fraîche
= exactement une session expérimentale réellement fraîche
```

```text
SESSION FRAÎCHE
= aucun historique conversationnel de l'expérience d'outillage
= dépôt + point de reprise + outil disponibles
= aucune archéologie de transcription fournie par défaut
```

La session répond au jeu de questions de reprise en citant explicitement ses
preuves. Aucune séquence témoin-puis-expérimental dans la même session.

## 20. Ligne de base

```text
LIGNE DE BASE
= l'échec de reprise historiquement observé
```

```text
état Git et documentaire périmé
+ reconstruction par transcriptions et mémoire humaine
→ reconstruction fausse de l'état de programme
→ commit faux
→ archéologie
→ réécriture d'historique
```

Cet échec n'est ni rejoué ni recréé artificiellement. Aucune session témoin
n'est requise pour la v0.

## 21. Critères de succès gelés

La reprise fraîche est un succès **seulement si les six tiennent** :

```text
1  ÉTAT / FLUX COURANT                          correct
2  DÉCISIONS HUMAINES EN ATTENTE                complètes et correctes
3  ACTION SUIVANTE                              correcte,
                                                NOT_YET_SELECTED compris
4  INFÉRENCES D'ÉTAT DÉRIVÉES DE GIT, FAUSSES   0
5  ARCHÉOLOGIE DE TRANSCRIPTION                 0 par défaut
                                                permise seulement si le point
                                                de reprise signale lui-même une
                                                preuve non résolue qui l'exige
6  CORRECTIONS FACTUELLES MANUELLES APRÈS REPRISE   0
```

```text
NOMBRE DE FICHIERS OU DE SOURCES OUVERTS
= MESURE
= PAS UN SEUIL DE RÉUSSITE
```

## 22. Preuves d'échec et de friction prédéclarées

```text
point de reprise périmé
incapacité à exprimer l'ambiguïté
point de reprise en contradiction avec une preuve établie
mise à jour naturellement manquée par l'humain
charge de mise à jour excessive
état requis absent
référence de preuve inutilisable
la reprise exige encore de l'archéologie
croissance incontrôlée du schéma
correction manuelle nécessaire
```

```text
UN ÉCHEC
≠ AUTOMATIQUEMENT UN DÉFAUT DU LOGICIEL
= PREUVE EXPÉRIMENTALE
```

La charte prévoit qu'une expérience puisse conclure `FRICTION = NONE`. Elle
prévoit tout autant qu'elle conclue que l'outil n'aide pas.

## 23. Frontière du premier prototype

```text
DANS LA v0
= un point de reprise JSON suivi
= un outil local sans dépendance
= resume / check / update
= un rendu lisible généré
= des tests unitaires
= un record de résultat de dogfood réel
```

```text
EXPLICITEMENT DIFFÉRÉ
= exécution d'agents · lancement d'agents
= invocation CCR · invocation fournisseur
= ordonnancement · orchestration parallèle
= décisions automatiques · mutation Git automatique
= automatisation de commit ou de push
= exécution de handoff · synthèse de contexte ou de prompt
= résolution de dépendances · automatisation du routage
= champs d'affectation d'agent · état multi-dépôts
= démon · service · base de données · réseau
= journal événementiel · gestion de projet générale
```

## 24. Frontière des tests unitaires

Tests prédéclarés :

```text
analyse JSON et sérialisation déterministe
valeurs d'incertitude acceptées
clôture fabriquée rejetée
relation typée de soutien de preuve
détection de dérive de blob sur chemin de dépôt
mouvement de HEAD non traité comme péremption
preuve opaque traitée sans déréférencement
preuve scellée jamais déréférencée
référence vérifiable manquante signalée
une recommandation ne peut pas prouver RATIFIED
update exige une preuve
resume rend d'abord ce qui est en attente ou non résolu
```

```text
SUCCÈS DES TESTS UNITAIRES
≠ SUCCÈS DU DOGFOOD
```

Les tests montrent que l'outil se comporte comme spécifié. Seule la phase D
montre si une session fraîche reprend correctement. Confondre les deux
reviendrait à prouver que l'outil sait lire son propre fichier.

## 25. Ce que ce document ne fait pas

```text
IMPLÉMENTATION       NON COMMENCÉE
PROGRAM-STATE.json   NON CRÉÉ
SESSION FRAÎCHE      NON ALLOUÉE
DOCTRINE DU LAB      NON RÉÉCRITE
EXIGENCE CCR         AUCUNE
```

Aucune nouvelle décision produit substantielle n'est attendue avant
l'implémentation, sauf si la matérialisation révèle une contradiction — auquel
cas l'implémentation s'arrête et le signale.
