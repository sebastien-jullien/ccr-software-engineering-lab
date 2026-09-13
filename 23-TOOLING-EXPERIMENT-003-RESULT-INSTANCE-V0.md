# TOOLING-EXPERIMENT-003 — Result Instance v0

## 1. Statut et autorité

```text
TYPE
= conception sémantique normative + prédéclaration expérimentale,
  ratifiée par l'humain

EXPÉRIENCE
= TOOLING-EXPERIMENT-003
= représentation durable de l'instance réelle de retour / résultat de mission

CE DOCUMENT
= autorité sémantique de Result Instance v0
= autorité de prédéclaration expérimentale
= GELÉ

AUTORITÉ DE SÉLECTION
= 22-TOOLING-EXPERIMENT-003-SELECTION.md
= INCHANGÉE PAR CE DOCUMENT

AUTORITÉ SÉMANTIQUE DE MISSION OBJECT v0
= 14-TOOLING-EXPERIMENT-002-MISSION-OBJECT-V0.md
= INCHANGÉE PAR CE DOCUMENT

IMPLÉMENTATION
= AUCUNE ICI

SÉRIALISATION
= AUCUNE ICI

PREMIÈRE TÂCHE DE DOGFOOD RÉELLE
= NON SÉLECTIONNÉE
```

Ce document gèle une sémantique et un protocole. Il n'écrit pas de code, ne
choisit pas de format, et ne sélectionne aucun travail d'application.

## 2. Le problème

La distinction ratifiée par l'autorité 22 § 3 est reprise ici sans
modification, parce qu'elle est la garde de tout ce qui suit :

```text
CONTRAT DE RETOUR
≠ INSTANCE RÉELLE DE RETOUR
≠ QUALIFICATION DU RETOUR
```

```text
TOOLING-EXPERIMENT-003
= LA COUCHE DU MILIEU
```

Le problème retenu est le pont **factuel** entre ce qu'un exécutant a
réellement retourné et ce que l'étape d'orchestration suivante peut lire
durablement, sans reconstruire la sémantique factuelle depuis la prose de
session, et sans que la représentation se mette à juger.

## 3. Base de preuve durable

Corpus réel, quatre exécutions, toutes déjà consignées ailleurs :

```text
DOGFOOD-001    contrat de retour = 13 exigences typées   autorité 15
DOGFOOD-002    contrat de retour = 14 exigences typées   autorité 17
DOGFOOD-003    contrat de retour = 14 exigences typées   autorité 19
TE001 PHASE D  AUCUN contrat de retour prospectif        RESULT-001
```

Mesures centrales, établies par l'étude de conception en lecture seule :

```text
DURABILITÉ DU RETOUR BRUT RÉEL
= 0 / 4

REPORT FACTUEL MANUEL
= 4 / 4

BESOIN D'UNE NOUVELLE REPRÉSENTATION DURABLE DE RÉSULTAT
= DÉMONTRÉ
```

La première mesure n'est pas une inférence. L'arbre committé sous
`tooling/mission-object/dogfood/` ne contient que des artefacts prospectifs —
objets de mission et enveloppes engendrées — plus un instantané d'entrée. Aucun
fichier n'y porte un retour d'exécutant, et aucune autorité ne prétend en
contenir un verbatim.

Motif observé quatre fois de suite :

```text
EXÉCUTION
→ RETOUR RÉEL
→ REPORT FACTUEL MANUEL PAR L'HUMAIN OU L'ORCHESTRATEUR
→ AUTORITÉ D'ÉVALUATION DURABLE
→ CONSÉQUENCES DE PROGRAMME
```

Le report manuel observé n'est pas une recopie : il renomme, traduit,
réordonne, et parfois ajoute des faits que le contrat ne demandait pas. C'est
exactement le pont que TE003 existe pour supprimer.

Séparément, et cela reste vrai :

```text
QUALIFICATION MANUELLE
= 4 / 4
= LÉGITIME
= HORS DU PÉRIMÈTRE DE TE003
```

## 4. Corrections matérielles apportées à l'étude de conception

L'étude de conception en lecture seule est classée :

```text
ERREUR PROCÉDURALE
= AUCUNE

RÉSULTAT ANALYTIQUE
= PASS AVEC CORRECTIONS MATÉRIELLES
```

Corrections gelées, dans les termes ratifiés :

```text
ABSENCE STRUCTURELLE
= PAS un substitut universel et déterministe aux sentinelles
  ni aux états de domaine

TRANSCRIPTION POST HOC EN PROSE
= PAS un mécanisme de succès légitime pour TE003

NOM DE FAIT EN TEXTE LIBRE
= INSUFFISANT comme seule identité sémantique

IDENTITÉ DE REPRÉSENTATION DU RÉSULTAT
= REQUISE

RÉSULTAT TERMINAL
= PAS un champ racine universellement obligatoire
```

En particulier, et il faut l'écrire sans détour :

```text
DF002-01 A ÉTABLI
= la nécessité de préserver des états rapportés sémantiquement distincts

DF002-01 N'A PAS ÉTABLI
= que l'absence structurelle était requise pour le résoudre
```

## 5. Famille sémantique ratifiée

```text
RESULT INSTANCE
= représentation durable minimale et commune
  de ce qu'un exécutant a effectivement rapporté

STRUCTURE
= Result Instance commune
+ items factuels rapportés typés
+ relation optionnelle au contrat prospectif / au protocole
```

Ne sont **pas** modélisés :

```text
état d'orchestration générique
workflow
moteur de qualification
moteur de décision
routage
handoff
paquet de contexte
dispatch
dépendances multi-flux
```

## 6. Noyau sémantique minimal de Result Instance v0

Une Result Instance PORTE :

```text
identité de représentation
identité d'exécution
identité de l'autorité de mission / de protocole source
identité de l'exécutant qui rapporte
items factuels rapportés
```

Identité du contrat de retour prospectif :

```text
OPTIONNELLE

REQUISE lorsqu'un contrat de retour prospectif existe et que l'instance doit
lui être reliée
```

Résultat terminal :

```text
CHAMP RACINE OBLIGATOIRE
= NON

LORSQU'IL FAISAIT PARTIE DE LA SÉMANTIQUE DE RETOUR
= item factuel rapporté
```

Fondement : dans les trois exécutions adossées à un contrat, le résultat
terminal est une exigence de retour parmi les autres ; dans l'exécution
adossée à un protocole, il n'existe pas sous cette forme. Aucune sémantique
tirée du corpus ne justifie une autre place.

## 7. Identité de représentation

Une Result Instance doit identifier la définition sémantique sous laquelle ses
octets s'interprètent.

```text
IDENTITÉ DU MODÈLE / DE L'AUTORITÉ DE REPRÉSENTATION
= STABLE
= REQUISE
```

Distincte de :

```text
identité de l'autorité de mission
identité de l'autorité de protocole
identité de l'autorité de contrat de retour
identité d'exécution
```

Motif :

```text
l'orchestration ultérieure doit pouvoir interpréter des octets durables
sans consulter la prose de session
```

Aucune syntaxe n'est choisie ici.

## 8. Identité de fait

Chaque item factuel rapporté porte :

```text
identité sémantique de fait, STABLE

valeur rapportée typée
OU
relation de non-production structurelle, lorsqu'elle s'applique
```

Optionnels, lorsqu'ils sont disponibles :

```text
relation à une exigence de retour prospective nommée
référence de preuve fournie par l'exécutant
```

```text
NOM DE FAIT EN PROSE LIBRE COMME SEULE DÉFINITION SÉMANTIQUE
= INTERDIT
```

Sources admissibles d'identité sémantique, selon le contrat ou le protocole
effectivement en vigueur :

```text
identité d'exigence de retour
identité de fait définie par le protocole
autre identifiant stable explicitement faisant autorité
```

```text
ONTOLOGIE UNIVERSELLE DE FAITS
= NON INVENTÉE ICI
```

Le corpus montre que ces identités existent déjà là où un contrat existe : les
exigences de retour des trois dogfoods sont identifiées, et c'est cette
identité qui doit porter le sens — pas l'intitulé humain qui en a été tiré
après coup.

## 9. Sémantique des valeurs

```text
TYPAGE DÉTERMINISTE SUFFISANT POUR LA RÉCUPÉRATION EN AVAL
= REQUIS

SÉRIALISATION CONCRÈTE PRÉSÉLECTIONNÉE
= AUCUNE

BLOB DE PROSE OPAQUE COMME ÉCHAPPATOIRE FACTUELLE NORMATIVE
= INTERDIT
```

```text
PRÉSENTATION
≠ AUTORITÉ FACTUELLE MACHINE
```

Une présentation humaine pourra exister plus tard. Elle ne deviendra pas pour
autant la source du fait.

## 10. Absence structurelle et valeur de domaine

Distinction ratifiée :

```text
NON-PRODUCTION STRUCTURELLE
= relation entre une exigence de retour attendue
  et l'absence d'item effectivement retourné
```

Motifs envisageables — et leur vocabulaire exact n'est PAS gelé ici, faute
d'être démontré par le corpus :

```text
non atteint
non applicable
non-production dépendante de la branche
```

```text
VOCABULAIRE CLOS DES MOTIFS
= NON GELÉ EN v0
= dérivation de conception, seulement si elle est soutenue
```

À l'opposé, et c'est le point sur lequel l'étude a été corrigée :

```text
NOT_ATTEMPTED
NOT_REALIZED
NOT_MEASURED
NONE
```

lorsque ces symboles sont des valeurs réelles du domaine établi d'un fait :

```text
= VALEURS DE DOMAINE RAPPORTÉES
```

```text
EFFONDREMENT DE CES VALEURS EN ABSENCE STRUCTURELLE, PAR SOUCI D'UNIFORMITÉ
= INTERDIT
```

Preuve durable que ces domaines existent réellement : les contrats de
DOGFOOD-002 et DOGFOOD-003 énumèrent explicitement ces symboles comme valeurs
admissibles de faits nommés. Un exécutant qui retourne `NOT_ATTEMPTED` a
répondu à l'exigence ; il ne l'a pas laissée sans réponse.

## 11. Rapporté, établi vrai, qualifié

Invariant normatif :

```text
L'EXÉCUTANT A RAPPORTÉ X
≠
X EST ÉTABLI VRAI
≠
QUALIFICATION ULTÉRIEURE DE X
```

Une Result Instance consigne des affirmations factuelles retournées **en tant
que rapportées**. Elle ne les élève pas automatiquement au rang de vérité
ratifiée.

```text
CONTRE-EXEMPLE CANONIQUE
= DF002-01
```

DF002-01 est le cas réel où une valeur retournée était sémantiquement fausse.
Si la représentation faisait du rapporté une vérité établie, ce cas serait
inexprimable — et c'est précisément le cas que le Lab a rencontré.

## 12. Relation au contrat

Lorsqu'un contrat de retour prospectif existe, la Result Instance doit pouvoir
relier la production réelle au contrat, sans qualifier la justesse sémantique.

Représentabilité requise :

```text
exigence produite, avec valeur rapportée
exigence structurellement non produite
item rapporté en surplus, non exigé prospectivement
identité immuable de l'autorité de contrat prospectif
```

Invariant requis :

```text
VALEUR RAPPORTÉE POUR L'EXIGENCE R
```

ne signifie PAS :

```text
LA VALEUR SATISFAIT R SÉMANTIQUEMENT
```

Le second énoncé appartient à la qualification, sauf s'il est mécaniquement
identique et explicitement établi par un contrat futur.

## 13. Exécutions adossées à un protocole

```text
MISSION OBJECT REQUIS PAR TE003 v0
= NON
```

La question expérimentale ratifiée couvre explicitement la relation au contrat
ou au protocole « lorsqu'il existe ». La conception doit donc représenter une
exécution du type de la phase D de TE001, où aucun contrat de retour Mission
Object n'existe.

```text
EMPLOYER
= identité de l'autorité de protocole source
+ items factuels stables définis par le protocole
```

```text
CHARGE UTILE DE PROSE OPAQUE SPÉCIFIQUE AU PROTOCOLE
= INTERDITE
```

## 14. Provenance

Provenance minimale de v0 :

```text
Result Instance
→ identité d'exécution

Result Instance
→ identité de l'autorité de mission / de protocole source

Result Instance
→ identité de l'autorité de représentation

Result Instance
→ identité de l'autorité de contrat de retour prospectif, le cas échéant

item rapporté
→ référence de preuve fournie par l'exécutant, lorsqu'elle est fournie

instance durable
→ identité de contenu immuable, une fois gelée
```

```text
RÉEMPLOI AUTOMATIQUE DE LA SÉMANTIQUE DE PREUVE DE PROGRAM-STATE
= NON

RÉEMPLOI AUTOMATIQUE DE LA SÉMANTIQUE DE PREUVE DE MISSION OBJECT
= NON

RÉEMPLOI SÉMANTIQUE
= exige une équivalence démontrée
```

## 15. Mécanisme de capture — RATIFIÉ

```text
INSTANCE DE RÉSULTAT STRUCTURÉE, PRODUITE PAR L'EXÉCUTANT
= CHEMIN v0 REQUIS
```

Ordre imposé :

```text
EXÉCUTION
→ l'exécutant produit l'instance de résultat exacte
→ l'instance de résultat est gelée
→ la qualification a lieu ensuite
```

```text
L'INSTANCE EXISTE AVANT TOUTE QUALIFICATION SUBSTANTIELLE DU RETOUR
= REQUIS
```

L'orchestrateur peut ensuite :

```text
vérifier l'identité
persister / committer les octets exacts
qualifier le résultat séparément
dériver ensuite les conséquences autorisées
```

```text
RÉÉCRITURE DE LA SÉMANTIQUE FACTUELLE PENDANT LA CONVERSION DE LA PROSE DE
SESSION EN INSTANCE
= INTERDITE
```

## 16. Transport mécanique et transcription sémantique

```text
octets de retour déjà structurés
→ persistés mécaniquement, inchangés
= ADMISSIBLE EN PRINCIPE
```

```text
prose de retour libre
→ l'orchestrateur interprète / renomme / traduit / normalise les faits
→ instance de résultat
= PAS UN SUCCÈS DE TE003
```

Le second est le pont manuel démontré par le corpus, et c'est celui que
l'expérience existe pour supprimer. Un transport qui déplace des octets ne
devient pas une transcription du seul fait qu'il passe par un intermédiaire ;
une transcription ne devient pas un transport du seul fait qu'elle est
soigneuse.

## 17. Fidélité d'exécution partielle

La représentation doit préserver des états factuels matériellement distincts.
Doivent être représentables, **lorsqu'ils sont effectivement retournés** :

```text
effet réalisé
effet tenté mais non réalisé
effet non tenté
étape non atteinte
publication non vérifiée
état partiel préservé
résultat terminal de mission
```

```text
EFFONDREMENT D'ÉTATS DISTINCTS EN UN FAUX BOOLÉEN
= INTERDIT

MACHINE À ÉTATS UNIVERSELLE D'EFFET, AU-DELÀ DES BESOINS DÉMONTRÉS
= NON INVENTÉE ICI
```

## 18. Pare-feu de qualification

Result Instance v0 ne détermine AUCUN de :

```text
constat canonique
écart produit
suffisance de schéma
remédiation
PASS / FAIL d'expérience
autorisation humaine
priorité
politique
expérience suivante
direction suivante du Lab
```

Elle PEUT consigner qu'un exécutant a rapporté un tel élément, et seulement si
la mission ou le protocole exigeait légitimement ce fait retourné.

```text
FAIT RETOURNÉ
≠ QUALIFICATION FAISANT AUTORITÉ
```

Être retourné ne rend rien autoritatif.

## 19. Règle de minimalité

Tout élément sémantique admis dans Result Instance v0 doit satisfaire :

```text
LE RETIRER
→ au moins une exécution réelle démontrée perd la récupérabilité factuelle
OU
→ la relation requise au contrat / au protocole devient irreprésentable
OU
→ l'orchestration en aval doit reconstruire la sémantique factuelle depuis la
  prose
OU
→ la qualification fuit dans la représentation
```

Sinon : exclure.

```text
CHAMP « À L'ÉPREUVE DU FUTUR »        AUCUN
SAC DE MÉTADONNÉES GÉNÉRIQUE          AUCUN
POINT D'EXTENSION LIBRE NORMATIF      AUCUN
```

## 20. Sérialisation

```text
SÉRIALISATION
= DIFFÉRÉE JUSQU'À LA CONCEPTION DE L'IMPLÉMENTATION
```

Le modèle sémantique d'abord.

```text
CHOISIR JSON PARCE QUE L'OUTILLAGE EXISTANT EMPLOIE JSON
= MOTIF INSUFFISANT
```

Toute sérialisation ultérieure devra préserver exactement les distinctions
sémantiques gelées ici.

## 21. Protocole expérimental

```text
CORPUS HISTORIQUE
= qualification de représentabilité rétrospective / de non-régression

QUALIFICATION D'IMPLÉMENTATION
= REQUISE si une implémentation est construite

DOGFOOD RÉEL
= au moins UNE mission réelle du Lab

MISSION AUTHENTIQUE
= un travail qui existerait indépendamment de TE003

MOMENT DE CAPTURE
= au retour d'exécution, avant qualification

PRODUCTEUR DU RÉSULTAT
= l'exécutant

ENTRÉE DE L'ORCHESTRATION SUIVANTE
= l'instance de résultat
+ ses autorités de contrat / de protocole sources
+ les preuves durables explicitement référencées

PROSE DE RETOUR DE SESSION COMME REPLI FACTUEL
= INTERDITE

QUALIFICATION
= activité ultérieure séparée
```

```text
PREMIÈRE TÂCHE DE DOGFOOD
= NON SÉLECTIONNÉE ICI

README.md
= MAINTENANCE
= NON SÉLECTIONNÉ COMME DOGFOOD DE TE003
```

## 22. Six critères de succès gelés

```text
1  RÉCUPÉRABILITÉ FACTUELLE
   l'orchestration en aval récupère toute sémantique factuelle de retour dont
   elle a réellement besoin, depuis l'instance de résultat et les références
   durables autorisées, sans reconstruction depuis la prose de retour de
   session

2  REPORT FACTUEL MANUEL
   = 0

3  ARCHÉOLOGIE / REPLI SUR LA PROSE DE SESSION
   = 0

4  FIDÉLITÉ D'EXÉCUTION PARTIELLE
   les états retournés matériellement distincts restent distincts

5  FUITE DE QUALIFICATION
   = 0

6  INTÉGRITÉ FACTUELLE
   faits retournés inventés = 0
   faits retournés requis omis = 0
```

Pour le critère 6, le mot « requis » se détermine prospectivement :

```text
par le contrat de retour lorsqu'il existe
OU
par les obligations factuelles du protocole lorsqu'aucun contrat n'existe
```

```text
DÉFINITION RÉTROACTIVE PAR CE QU'UN HUMAIN AURAIT SOUHAITÉ RECEVOIR
= INTERDITE
```

```text
RELATION AU CONTRAT
PROVENANCE
= dimensions nécessaires des critères 1 / 4 / 6
≠ critères séparés
```

## 23. Preuves d'échec expérimental

```text
une sémantique factuelle requise en aval est inexprimable
la sémantique de retour doit être reconstruite depuis la prose de session
la construction de l'instance exige une transcription sémantique humaine
  post hoc
représenter un état factuel exige d'y encastrer une qualification
des états d'exécution partielle matériellement distincts s'effondrent
une production exigée par le contrat ne peut être reliée à la production
  réelle
une provenance requise est perdue
la représentation invente un fait retourné par l'exécutant
un retour factuel requis est omis
l'orchestration en aval exige encore une correction factuelle manuelle
```

```text
DÉFAUT D'IMPLÉMENTATION ORDINAIRE
≠ ÉCHEC EXPÉRIMENTAL AUTOMATIQUE
```

Un défaut doit être classé : révèle-t-il une insuffisance de conception, ou
seulement un bogue ?

## 24. Discipline de revendication en usage réel

```text
UN SEUL DOGFOOD AUTHENTIQUE
= PEUT SUFFIRE à répondre à TE003, avec une portée bornée,
  s'il exerce la question principale sélectionnée
```

Mais :

```text
un dogfood adossé à un contrat
≠ validation en usage réel de la capture adossée à un protocole

un dogfood adossé à un protocole
≠ validation en usage réel de la capture adossée à un contrat
```

```text
REPRÉSENTABILITÉ HISTORIQUE
≠ VALIDATION DE CAPTURE EN USAGE RÉEL
```

```text
RUN FABRIQUÉ POUR COMPLÉTER UNE MATRICE
= NON JUSTIFIÉ
```

Les branches et familles non exercées sont consignées comme limites, à moins
qu'un besoin réel ne justifie un dogfood supplémentaire.

## 25. Rôle du corpus historique

```text
DOGFOOD-001
DOGFOOD-002
DOGFOOD-003
TE001 PHASE D
```

```text
RÔLE
= corpus de représentabilité rétrospective / de non-régression
```

```text
PREUVE DE CAPTURE EN USAGE RÉEL       NON
PREUVE DE SUCCÈS FUTUR                NON
EXÉCUTION HISTORIQUE REJOUÉE          AUCUNE
TRANSCRIPT CONSULTÉ                   AUCUN
```

Là où un retour brut exact n'est pas durable :

```text
RECONSTRUIRE UN RETOUR VERBATIM
= INTERDIT
```

Seules les preuves durables servent à établir la couverture sémantique
requise. Le corpus dit ce qu'il contient, et rien de plus.

## 26. Périmètre hétérogène

```text
HYBRIDE
= noyau factuel commun
+ relation optionnelle au contrat
+ sémantique factuelle définie par le protocole
```

Le corpus historique doit démontrer la représentabilité sur les deux familles :

```text
cas adossés à Mission Object
cas adossé à un protocole — phase D
```

Cette démonstration est rétrospective, et elle ne promet aucune validation en
usage réel des deux familles.

## 27. Exclusions explicites

```text
promotion automatique en constat produit          HORS PÉRIMÈTRE
jugement automatique de suffisance                HORS PÉRIMÈTRE
décisions d'autorité humaine automatiques         HORS PÉRIMÈTRE
sélection automatique d'expérience                HORS PÉRIMÈTRE
automatisation de la qualification du retour      HORS PÉRIMÈTRE
moteur de décision / de conséquence               HORS PÉRIMÈTRE
handoff / routage                                 HORS PÉRIMÈTRE
conception de paquet de contexte                  HORS PÉRIMÈTRE
dispatch                                          HORS PÉRIMÈTRE
orchestration multi-flux et dépendances           HORS PÉRIMÈTRE
auto-hébergement                                  HORS PÉRIMÈTRE
schéma universel de retour                        HORS PÉRIMÈTRE
ontologie universelle de faits                    HORS PÉRIMÈTRE
modification de Mission Object v0                 HORS PÉRIMÈTRE
sélection de sérialisation                        HORS PÉRIMÈTRE
implémentation de TE003                           HORS PÉRIMÈTRE
```

## 28. Ce que ce document ne fait pas

```text
IMPLÉMENTATION                            AUCUNE
SÉRIALISATION CHOISIE                     NON
SCHÉMA CONCRET                            AUCUN
VOCABULAIRE DE MOTIFS D'ABSENCE GELÉ      NON
PREMIÈRE TÂCHE DE DOGFOOD SÉLECTIONNÉE    NON
EXÉCUTANT ALLOUÉ                          AUCUN
MISSION OBJECT v0 MODIFIÉ                 NON
AUTORITÉ 22 MODIFIÉE                      NON
RESULT-001 MODIFIÉ                        NON
README CORRIGÉ                            NON
OUTIL MODIFIÉ                             NON
TESTS EXÉCUTÉS                            0
```

```text
TOOLING-EXPERIMENT-003
= OPEN

RESULT INSTANCE v0
= CONÇUE
= GELÉE
= NON IMPLÉMENTÉE
```
