# TOOLING-EXPERIMENT-003 — correction du séquençage durable de reprise

## 1. Statut et autorité

```text
TYPE
= correction de séquençage, ratifiée par l'humain

EXPÉRIENCE
= TOOLING-EXPERIMENT-003

CE DOCUMENT
= autorité de correction de séquençage, COURANTE
= GELÉ

AUTORITÉ DE CONCEPTION DU DOGFOOD
= 28-…-FIRST-LIVE-DOGFOOD-DESIGN.md
= blob 0f7ef0512cfbcaf976b45cea3dea23ef4ea02181
= NON MODIFIÉE
= PRÉSERVÉE
= SUPERSÉDÉE DANS UNE PORTÉE OPÉRATIONNELLE EXACTE, ET LÀ SEULEMENT

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
MATÉRIALISATION DE L'AUTORITÉ 28
= PASS
```

## 2. Le défaut exact

L'autorité 28 a établi :

```text
BASE CIBLE DU README
= 36a05327657b2d96a342f3b7b5dcca52b97650db

TÊTE DE DÉPÊCHE FUTURE
= descendant direct ne contenant que mission.json et envelope.md

MUTATION DE PROGRAM-STATE DANS LE COMMIT DE DÉPÊCHE
= AUCUNE
```

PROGRAM-STATE enregistre aujourd'hui une action dont l'accomplissement est
exactement :

```text
matérialiser mission.json et envelope.md
```

Le commit de dépêche prévu produirait donc simultanément :

```text
FAIT DU DÉPÔT
= le paquet de dépêche est déjà matérialisé

ACTION SUIVANTE DE PROGRAM-STATE
= matérialiser le paquet de dépêche
```

```text
SÉQUENÇAGE DURABLE DE REPRISE
= DÉFECTUEUX POUR L'ARC D'EXÉCUTION EN USAGE RÉEL PRÉVU
```

Et ce qui ne l'est pas :

```text
CONCEPTION SÉMANTIQUE DU DOGFOOD
= NON DÉFECTUEUSE

CONCEPTION DE RESULT INSTANCE
= NON DÉFECTUEUSE

CONCEPTION DE MISSION OBJECT
= NON DÉFECTUEUSE
```

## 3. Pourquoi la contradiction dure

```text
ÉTAT DE PROGRAMME
≠ ÉTAT GIT
```

C'est la règle de l'autorité 09 § 4, et c'est précisément elle qui rend ce
défaut visible : l'avance de HEAD n'est pas une péremption du point de reprise,
donc rien ne corrigerait automatiquement l'action périmée.

La fenêtre pendant laquelle la contradiction vivrait :

```text
du commit de dépêche
jusqu'à l'achèvement de la récupération factuelle en aval
```

Elle ne peut pas être refermée pendant l'exécution :

```text
l'exécutant travaille depuis la TÊTE DE DÉPÊCHE
→ toute mutation de PROGRAM-STATE sur main ferait avancer main devant la base
  de l'exécutant
→ le paquet de dépêche cesserait d'être un descendant direct de la base cible
→ le préflight gelé de l'exécutant, qui exige parent(HEAD) = BASE CIBLE,
  échouerait
```

Autrement dit : corriger pendant l'exécution casse l'exécution ; ne pas
corriger laisse un point de reprise durable faux.

```text
UNE REPRISE FRAÎCHE PENDANT CETTE FENÊTRE
= lirait correctement un état durable faux
```

C'est mot pour mot la ligne de base d'échec que l'autorité 09 § 20 décrit, et
que TOOLING-EXPERIMENT-001 existe pour empêcher. Le point de reprise a fait ici
ce pour quoi il a été conçu : il a rendu la contradiction visible avant qu'elle
ne se matérialise.

## 4. Principe de correction

```text
next_action
= ACTION DURABLE DE NIVEAU PROGRAMME

≠ sous-étape mécanique minuscule qui périme avant le prochain point de reprise
  durable où l'on peut écrire sans risque
```

L'action corrigée doit rester vraie :

```text
avant la matérialisation du paquet de dépêche
après la matérialisation du paquet de dépêche
pendant la dépêche de l'exécutant
pendant l'exécution du README
pendant la production et le gel de l'instance de résultat
pendant la persistance sûre
pendant la récupération factuelle en aval par une session fraîche
```

et ne s'achever qu'au premier point où un point de reprise post-dogfood peut
être matérialisé sans risque.

## 5. Ce qui est préservé de l'autorité 28

Toute la conception substantielle du dogfood reste en vigueur, mot pour mot :

```text
séquencement Git A
consommateur aval frais + pare-feu d'entrée
suffisance de Mission Object v0
contrat de retour à neuf champs
résultat de tâche ≠ résultat de capture
continuation de capture sur branche bloquée
preuve temporelle de l'état du distant
chemin et cycle de vie de l'instance de résultat
règle de persistance sûre
interdiction d'interférence en cas de poussée échouée
registre de sources factuelles
frontière d'évaluation du README
les six critères de TE003
```

```text
L'AUTORITÉ 29 SUPERSÈDE L'AUTORITÉ 28
SEULEMENT SUR DEUX POINTS :

quel commit est la BASE CIBLE DU README courante

quelle action durable couvre la fenêtre d'exécution sans mutation de
PROGRAM-STATE
```

```text
RIEN D'AUTRE
```

## 6. Modèle corrigé de base cible

```text
36a05327657b2d96a342f3b7b5dcca52b97650db
= demeure historiquement LE COMMIT DE MATÉRIALISATION DE L'AUTORITÉ 28
= SUPERSÉDÉ comme base cible d'exécution
```

```text
BASE CIBLE DU README COURANTE
= le commit créé par CETTE mission de correction
= établi APRÈS son existence
```

```text
SON SHA N'EST EMBARQUÉ NI DANS L'AUTORITÉ 29 NI DANS PROGRAM-STATE
```

Ce commit contiendra :

```text
l'autorité 29
la correction de séquençage dans PROGRAM-STATE
tout l'état durable pertinent pour le README, déjà présent
```

```text
L'AUTORITÉ 29 APPARTIENT DONC ELLE-MÊME À L'INDEX CIBLE DU README
```

La règle d'index de l'autorité 28 § 6 s'applique sans changement : chaque
autorité racine numérotée présente à la base cible, dans l'ordre numérique.

## 7. Invariant de la tête de dépêche future

Après cette correction, le commit de dépêche reste exactement :

```text
descendant DIRECT de la BASE CIBLE DU README COURANTE
```

et ne contient que :

```text
tooling/result-instance/live-dogfood/001/mission.json
tooling/result-instance/live-dogfood/001/envelope.md
```

Aucun de :

```text
autorité racine numérotée
mutation de PROGRAM-STATE
édition du README
nouvelle aire d'outillage
instance de résultat
preuve produite par l'exécutant
```

D'où :

```text
ÉTAT DURABLE PERTINENT POUR LE README À LA BASE CIBLE COURANTE
=
ÉTAT DURABLE PERTINENT POUR LE README À LA TÊTE DE DÉPÊCHE FUTURE
```

L'objet de mission futur liera :

```text
readme.target_base
= SHA réel du commit de correction produit par cette mission
```

qui existera avant que `mission.json` ne soit écrit.

```text
AUTO-RÉFÉRENCE
= AUCUNE
```

## 8. Action durable corrigée

L'action micro-mécanique est supersédée. La nouvelle action couvre l'arc
exécutable entier, en huit étapes :

```text
1  matérialiser le paquet de dépêche gelé contre la BASE CIBLE DU README
   courante

2  dépêcher un exécutant frais qualifié

3  exécuter la tâche bornée du README et ses effets Git portés par l'exécutant

4  obtenir l'instance de résultat produite, validée et gelée par l'exécutant,
   ainsi que la preuve temporelle de l'état du distant

5  appliquer la règle de persistance sûre de l'instance, sans réaliser aucun
   effet de tâche README non réalisé

6  si la persistance durable réussit, remettre le paquet durable autorisé à un
   consommateur aval frais, sous le pare-feu d'entrée factuel

7  conduire la récupération factuelle et produire le registre exhaustif des
   sources factuelles

8  s'arrêter avant la qualification humaine du dogfood TE003, avant toute
   conclusion d'expérience et avant toute décision de direction suivante
```

```text
CE QUE CETTE ACTION NE SÉLECTIONNE PAS
= identité d'exécutant
= numéro de session
= verdict final de dogfood
= expérience suivante
```

C'est une continuation exécutable de niveau programme, pas l'exécution
elle-même.

## 9. Pourquoi cette action reste durable

```text
APRÈS LE COMMIT DE DÉPÊCHE FUTUR
= action toujours en cours

APRÈS LE DÉMARRAGE DE L'EXÉCUTANT
= action toujours en cours

APRÈS LE RETOUR DE LA TÂCHE README
= action toujours en cours

APRÈS LA PERSISTANCE DU RÉSULTAT
= action toujours en cours, jusqu'à la récupération en aval

APRÈS LA RÉCUPÉRATION FACTUELLE EN AVAL PAR UNE SESSION FRAÎCHE
= l'action atteint sa frontière d'arrêt définie
```

À ce point, et à ce point seulement :

```text
main n'est plus contrainte par un exécutant travaillant depuis la TÊTE DE
DÉPÊCHE

un commit d'évaluation ou de point de reprise peut faire avancer PROGRAM-STATE
sans risque
```

```text
DIVERGENCE DURABLE ENTRE ÉTAT GIT ET ÉTAT DE PROGRAMME
= SUPPRIMÉE, SANS AUCUNE MUTATION DE PROGRAM-STATE PENDANT L'EXÉCUTION
```

Une reprise fraîche survenant à n'importe quel instant de la fenêtre lira une
action vraie, et saura où l'arc en est par les seuls faits du dépôt.

## 10. Aucune sélection prématurée d'exécutant

```text
AGENT CCR LAB #18
= NON ALLOUÉ

TOUT AUTRE NUMÉRO D'EXÉCUTANT
= NON ALLOUÉ
```

L'autorité 28 a gelé des EXIGENCES d'exécutant, jamais une identité. L'étape
de dépêche future pourra instancier le prochain exécutant logique frais
qualifié comme conséquence déterministe, s'il ne reste alors aucun choix
substantiel. Ce document ne le fait pas.

## 11. La politique de persistance du chemin échoué ne bouge pas

La règle conservatrice de l'autorité 28 § 23 n'est pas rouverte :

```text
publication de tâche non pleinement vérifiée
→ AUCUNE poussée de persistance du résultat sur main
```

même si une route de persistance plus permissive était théoriquement
concevable.

Pour ce premier dogfood :

```text
PRODUCTION DU RÉSULTAT PAR L'EXÉCUTANT
= peut être démontrée

PERSISTANCE DURABLE DU RÉSULTAT
= peut rester incomplète

RÉCUPÉRATION FRAÎCHE EN AVAL
= ne peut pas PASSER sans persistance durable
```

```text
LIMITE ACCEPTÉE
≠ NOUVEAU BLOCAGE
```

## 12. Ce que ce document ne fait pas

```text
AUTORITÉ 28 MODIFIÉE                      NON
CONTRAT DE RETOUR REDESSINÉ               NON
OBJET DE MISSION CRÉÉ                     NON
ENVELOPPE CRÉÉE                           NON
PAQUET DE DÉPÊCHE MATÉRIALISÉ             NON
INSTANCE DE RÉSULTAT CRÉÉE                NON
EXÉCUTANT SÉLECTIONNÉ OU ALLOUÉ           AUCUN
CONSOMMATEUR AVAL ALLOUÉ                  AUCUN
README MODIFIÉ                            NON
AUTORITÉS 14 · 23 À 28 MODIFIÉES          NON
LOGICIEL RESULT INSTANCE MODIFIÉ          NON
MISSION OBJECT MODIFIÉ                    NON
.gitattributes MODIFIÉ                    NON
FLUX DE DOGFOOD CRÉÉ                      NON
MARQUEUR DE DÉBUT D'EXÉCUTION             AUCUN
TESTS EXÉCUTÉS                            0
```

```text
TOOLING-EXPERIMENT-003
= OPEN

CONCEPTION DU PREMIER DOGFOOD
= GELÉE / RATIFIÉE / PRÉSERVÉE

SÉQUENÇAGE DURABLE DE REPRISE
= CORRIGÉ

BASE CIBLE DU README COURANTE
= le commit qui matérialise ce document

TÊTE DE DÉPÊCHE
= PAS ENCORE CRÉÉE

EXÉCUTION EN USAGE RÉEL
= NON COMMENCÉE
```
