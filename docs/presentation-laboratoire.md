# CCR Software Engineering Lab — à quoi il sert, ce qu'il fait

> **État au 14 octobre 2026.** Dépôt public : [CCR Software Engineering Lab](https://github.com/sebastien-jullien/ccr-software-engineering-lab). Branche `main`, commit publié `418521f57064fa4f1bf599aaaf40bb05cb956d5b`.
>
> Ce document est une présentation, pas une décision ou une autorité nouvelle. Font foi la charte (`00-CHARTER.md`), le `README.md`, `PROGRAM-STATE.json` et les Authorities numérotées du Lab.
>
> Le programme compte **75 décisions RATIFIED / 0 PENDING**, cinq cas logiciels traités, trois expériences d'outillage closes ou implémentées, une console locale, **23 missions** sous `missions/`, FIELD-001 clos et CCR_MS_V2 adopté prospectivement.

---

## En bref

- **CCR — contre-expertise croisée** — fait travailler un **Auteur** et un **Challenger** dans des sessions distinctes. Le premier propose ; le second cherche à réfuter. CCR ne choisit pas un gagnant et ne décide jamais à la place de l'humain. Sa règle de fond reste : **la preuve l'emporte sur l'accord**.
- **Le CCR Software Engineering Lab** est l'atelier R&D qui utilise CCR sur des tâches réelles ou réalistes, autonomes et vérifiables, pour produire du travail utile, observer CCR sous contradiction et distinguer les limites du produit des limites du cas, du protocole ou du consommateur.
- **Le Lab n'est pas CCR System.** Le Lab peut faire apparaître une friction ; il ne peut pas, à lui seul, transformer cette friction en exigence produit CCR.
- **L'ambition pratique** est de retirer progressivement le travail de transport et de coordination manuelle — préparer le bon paquet, remettre la main au bon acteur, conserver le bon résultat — **sans automatiser l'autorité humaine**.
- **La première phase** a porté sur cinq cas logiciels. Les cas 003 à 005 n'ont pas montré de supériorité du résultat logiciel final avec CCR : les bras comparés ont tous réussi. La valeur observée se situait surtout dans la contradiction, la traçabilité et la correction d'affirmations.
- **La deuxième phase** a construit des surfaces durables pour le Lab lui-même : état de programme, Mission Object, Result Instance, puis une console locale en lecture seule.
- **La grande ligne de recherche HANDOFF_ROUTING** a ensuite occupé les missions 003 à 020. Elle a fini par montrer sa propre limite : la mission 020 a qualifié une **méta-récursion** — la stratégie de fermeture réintroduisait, un étage plus haut, les mêmes primitives sémantiques encore non établies, sans gain opérationnel nouveau.
- Le Lab est alors **revenu vers une frontière empirique concrète**. La mission 021 / expérience EXP-C2-C a produit une preuve bornée positive : sur un cas gelé, certaines responsabilités de handoff pouvaient être dérivées, propagées et consommées sans reconstruction manuelle observée.
- Cette preuve a ensuite conduit à un **design produit borné, P-HR-01**, puis à son implémentation dans la mission 022. L'implémentation a été qualifiée **PASS WITH LIMITATIONS**, sans défaut matériel établi, mais sans prétendre avoir démontré toute l'utilité en usage réel.
- **FIELD-001 / mission 023** a ensuite fourni la première étude de terrain explicitement centrée sur la valeur de la contre-revue : le Challenger a identifié **un défaut matériel réel** que l'Auteur avait observé sans le classer correctement, alors que l'oracle gelé restait vert sur A1. Le défaut a été corrigé et vérifié. Le résultat est positif mais **borné** : il ne démontre pas une efficacité générale de CCR.
- FIELD-001 a aussi montré que les anciennes métriques pouvaient être trop pauvres pour décrire fidèlement ce qui s'était passé. **CCR_MS_V2** a donc été adopté comme sémantique normative de mesure **prospective uniquement**. FIELD-001 reste historique, V1, immuable et non recalculé.
- **La direction R&D actuelle** est de repartir de besoins réels et d'observer ce que CCR apporte effectivement à une tâche ou à un consommateur indépendant, plutôt que de créer une nouvelle couche de protocole par réflexe.

---

## 1. Le point de départ : CCR

### Le risque visé : l'erreur qui reste cohérente

Sur un projet vaste, un agent IA peut se construire une représentation fausse du système, puis rester parfaitement cohérent avec elle dans l'analyse, la spécification, le code, les tests et jusqu'à l'audit de son propre travail.

Le danger n'est donc pas seulement l'hallucination ponctuelle. C'est aussi **l'erreur auto-cohérente** : une erreur assez plausible, assez structurée et assez documentée pour traverser plusieurs étapes sans provoquer d'alarme.

### La réponse : la contradiction organisée

```text
un expert propose
        ↓
un second expert cherche à le réfuter
        ↓
désaccord sur les faits              → on revient à la preuve
désaccord sur l'interprétation       → on explicite le cadre
désaccord sur ce qu'il faut faire    → on revient à l'humain
```

CCR System est un projet séparé du Lab. Il fournit notamment :

- deux rôles natifs, **Auteur** et **Challenger** ;
- des sessions persistantes distinctes ;
- un état durable du run en dehors des conversations ;
- une chronologie des activités et des invocations ;
- des matériaux, controverses, réconciliations et reprises après interruption ;
- des points où l'humain peut reprendre la main.

CCR refuse délibérément plusieurs facilités : pas de « juge modèle », pas de gagnant désigné, pas de clôture automatique, pas de consensus tenu pour vrai.

**Deux modèles qui disent la même chose n'ont rien démontré.**

| Qui | Autorité |
|---|---|
| l'humain | **normative et finale** : il décide de ce qui doit être |
| les preuves, le code, les observations | **factuelle**, dans la limite de ce qu'elles établissent |
| les experts IA | **argumentative** |
| CCR | **procédurale** : orchestrer, conserver, structurer, exposer, gouverner un run |

### Le Lab n'est pas CCR

| CCR System | CCR Software Engineering Lab |
|---|---|
| produit et contrats publics | utilisateur R&D de CCR |
| évolue selon sa propre doctrine | observe et éprouve CCR |
| définit sa mécanique de run | étudie des cas logiciels et des problèmes d'orchestration |
| décide de ses évolutions | **ne peut rien lui imposer** |

Le chemin normal reste :

```text
usage réel
→ friction observée
→ conséquence démontrée
→ analyse du contrat / des surfaces existantes
→ vérification que l'existant ne suffit pas
→ décision humaine
→ implémentation seulement si elle est justifiée
```

Une expérience réussie peut parfaitement conclure : **aucune friction matérielle, aucun changement produit**.

---

## 2. Le problème concret : orchestrer sans confondre transport et autorité

### Ce que l'on fait encore à la main

Le workflow qui a motivé le Lab contient généralement :

- un orchestrateur qui prépare la suite ;
- un analyste ou implémenteur ;
- un expertiseur ;
- un contre-expertiseur ;
- des transferts de contexte, de résultat et d'autorité ;
- l'humain, qui tranche lorsqu'une véritable décision est requise.

L'humain tient en pratique deux rôles très différents :

```text
AUTORITÉ
arbitrer, cadrer, décider
→ doit rester humaine

TRANSPORT
préparer le bon paquet
l'associer au bon run et au bon rôle
remettre la main au bon moment
conserver le bon résultat
diriger le retour vers la bonne surface
→ peut être rendu plus déterministe
```

L'ambition reste simple à formuler : **supprimer du transport manuel sans supprimer l'autorité humaine**.

### Les responsabilités d'une passation

Une passation entre agents doit répondre, explicitement ou non, à des questions comme :

```text
QUI reçoit la main ?                 QUAND la transition a-t-elle lieu ?
QUEL acteur exécute ?                SOUS QUELLE autorité agit-il ?
SUR QUELLE base travaille-t-il ?     QUI persiste le résultat ?
OÙ va le retour ?                    QUI consomme le résultat ?
QUEL est l'ordre requis ?            OÙ faut-il s'arrêter ?
QUI reprend ensuite ?
```

La ligne HANDOFF_ROUTING est partie de là : peut-on rendre ces responsabilités durables et déterministes sans inventer un moteur de workflow générique, et sans déplacer vers la machine une sélection qui relève en réalité de l'humain ?

---

## 3. Ce que le Lab cherche à rendre possible

### La couche visée : Mission / Stream Orchestration

CCR raisonne à l'échelle d'un run. Le Lab s'intéresse à une couche plus large : la coordination durable d'une série de missions, de décisions et de retours.

Cette couche doit pouvoir représenter ou exécuter proprement des opérations comme :

```text
définir une mission
construire le contexte transmis
figer les préconditions et la base de travail
lancer un acteur dans le bon rôle
conserver exactement son résultat
organiser une contre-expertise indépendante
propager correctement les inconnues et désaccords
rendre explicite la prochaine décision humaine
reprendre après interruption
```

Mais la contrainte est forte : l'orchestration doit **utiliser** les règles de gouvernance de CCR, jamais les contourner.

### Du travail manuel au travail outillé

| Aujourd'hui | Cible raisonnable |
|---|---|
| rédiger et relire une mission à la main | produire un contrat borné et vérifiable |
| vérifier toutes les identités manuellement | vérifier automatiquement provenance et préconditions |
| lancer une session | lancer le bon rôle avec le bon contrat |
| copier un résultat | conserver ses octets exacts |
| lancer une contre-expertise | préserver une indépendance réelle d'exécution |
| interpréter « inconnu » à la main | propager `YES / NO / NOT_ESTABLISHED` sans les confondre |
| décider qu'un espace est « fermé » | refuser les conclusions d'unicité, multiplicité ou impossibilité quand l'exhaustivité manque |
| reconnaître qu'une règle manque | ouvrir un vrai gate humain, pas un micro-gate administratif |
| choisir la suite | proposer une suite sans la transformer automatiquement en autorité |

Le but n'est pas que « l'IA décide à la place de l'humain ». Le but est qu'une infrastructure rende les erreurs de procédure **difficiles à cacher, faciles à reconstruire et vérifiables**.

### Pourquoi ne pas tout coder d'emblée

Parce qu'une règle naïve devient très vite une décision normative cachée.

Par exemple :

```text
si A n'est pas identique à B
alors A et B sont matériellement différents
```

Cette règle paraît raisonnable mais peut être fausse. La recherche a rencontré beaucoup de versions de ce raccourci :

- « c'est obligatoire, donc c'est une responsabilité » ;
- « ce n'est pas exclu, donc c'est admissible » ;
- « je n'ai pas prouvé oui, donc non » ;
- « j'ai énuméré beaucoup de cas, donc l'espace est complet » ;
- « une seule solution connue veut dire une solution unique ».

Le Lab a longtemps servi à découvrir **quelles règles il est légitime de coder** — et surtout lesquelles il ne faut pas coder.

---

## 4. Ce que le Lab a réellement fait

### 4.1 Cinq cas logiciels réels ou réalistes

Cinq micro-projets ont été traités avec des rôles CCR natifs et une vérité de contrôle tenue séparément jusqu'à la fin du travail principal.

| Cas | Tâche | Résultat principal |
|---|---|---|
| 001 — Reservation Interval Engine | implémenter une petite bibliothèque | 7/7 tests visibles, 14/14 cachés, aucun défaut réel |
| 002 — Configuration Overlay Repair | diagnostiquer puis réparer un code imparfait | le Challenger a corrigé le rapport initial et fait émerger un vrai défaut manqué ainsi qu'une ambiguïté de spécification |
| 003 — Task Planner Dependency Extension | étendre sans casser | CCR 27/27 ; bras témoin 27/27 |
| 004 — Stable Ranking Cost-Bound Refactor | optimiser sans changer l'observable | 26/26 des deux côtés ; aucun vainqueur logiciel |
| 005 — Bounded Concurrency Task Pool | ordonnancement asynchrone borné | 30/30 des deux côtés |

Le constat important est négatif autant que positif : **les cas 003 à 005 ne démontrent pas une amélioration du résultat logiciel final par CCR**. Ils montrent plutôt l'intérêt possible de la contradiction, de la provenance et de la séparation entre affirmation, preuve et décision.

### 4.2 Trois expériences d'outillage sur le Lab lui-même

Ces outils appartiennent au Lab, pas à CCR System.

| Outil | Rôle |
|---|---|
| `tooling/program-state/` | point de reprise durable de l'état du programme |
| `tooling/mission-object/` | charge, valide et rend un contrat de mission |
| `tooling/result-instance/` | valide structurellement un résultat et le confronte à son contrat de retour |
| `tooling/console/` | console web locale en lecture seule pour suivre état, mission et résultat |

Les trois expériences d'outillage ont été closes ou implémentées. La console a ensuite été éprouvée en usage réel, a révélé une friction de découvrabilité U-01, puis a reçu une remédiation bornée et qualifiée.

### 4.3 Une longue ligne de recherche sur HANDOFF_ROUTING

Les missions 001 à 020 ont progressivement déplacé la question :

1. où se trouve le travail manuel ;
2. quelles responsabilités de handoff comptent ;
3. comment savoir qu'une conception les couvre ;
4. comment savoir que l'espace de conceptions est complet ;
5. quelles dimensions et responsabilités constituent cet espace ;
6. comment savoir que ces responsabilités elles-mêmes sont exhaustives.

Cette progression a été utile jusqu'à un point. Elle a aussi montré un échec de méthode : à force de vouloir fermer chaque espace de façon purement analytique, la recherche a commencé à redemander, à l'étage supérieur, les mêmes sémantiques encore non établies.

### 4.4 Mission 020 : le point de rupture de la méta-récursion

La mission 020 n'a pas produit de nouvelle primitive opérationnelle réutilisable. Sa qualification finale est **FAIL**, avec deux erreurs analytiques matérielles de l'exécutant et une conclusion R&D plus importante :

```text
CONCEPTUAL_REGRESSION = YES
BRANCH_STATUS = META_RECURSION
OPERATIONAL_PAYOFF = NONE
AUTOMATIC RECURSIVE SUCCESSOR = NOT JUSTIFIED
```

Cela ne signifie pas que la mission 020 « n'a rien appris ». Elle a appris que la stratégie de fermeture courante **réintroduisait le même problème un étage plus haut**, sans nouveau point d'ancrage empirique.

L'humain a donc sélectionné un retour non récursif vers la frontière empirique de la mission 005 : **acquérir de la preuve nouvelle plutôt que refaire une analyse plus abstraite du même corpus**.

### 4.5 Mission 021 / EXP-C2-C : retour à une preuve empirique bornée

EXP-C2-C a gelé un petit paquet de responsabilités de handoff, puis a vérifié leur réalisation sur un run borné.

La qualification indépendante a conclu **PASS WITH LIMITATIONS** :

- chaîne RC1..RC8 observée positivement pour le baseline exact ;
- suppression bornée de charges EP-02 / EP-03 / EP-04 ;
- aucune preuve de suffisance générique ;
- aucune architecture produit automatiquement sélectionnée ;
- aucune autorisation d'implémentation implicite.

C'était une preuve **locale et positive**, pas une généralisation.

### 4.6 P-HR-01 : d'une preuve expérimentale à un design produit borné

Après la mission 021, le Lab est revenu au problème produit : peut-on représenter et consommer quatre responsabilités de handoff déjà justifiées sans reconstruction manuelle ?

Le design P-HR-01 a été retenu et fermé normativement :

- `Mission Object V1 = V0 + optional handoff_contract` ;
- comportement fail-closed si le contrat V1 est présent mais invalide ;
- chaîne de cycle de vie bornée ;
- destination de retour et propriété de persistance explicites ;
- pas de routeur générique, pas d'event bus, pas de DSL de workflow ;
- compatibilité V0 traitée explicitement, sans conversion automatique.

### 4.7 Mission 022 : implémentation P-HR-01

La mission 022 a matérialisé P-HR-01. Sa qualification indépendante est **PASS WITH LIMITATIONS**, avec :

- **0 défaut matériel d'implémentation établi** ;
- 95/95 nouveaux tests P-HR-01 réussis ;
- no-bypass PASS ;
- compatibilité V0/V1 vérifiée ;
- pas de release ni de rollout automatiques ;
- usage réel V1 et utilité opérationnelle générale non établis.

Les limites portent notamment sur le transport réel, l'attribution réelle de certains acteurs et la continuité multi-session non supportée par le design gouvernant.

### 4.8 Mission 023 / FIELD-001 : première étude de terrain bornée sur la valeur de la contre-revue

FIELD-001 a quitté le terrain de la méta-conception pour poser une question plus directe :

> Sur une petite tâche d'ingénierie non triviale, la contre-revue CCR améliore-t-elle matériellement le résultat à un coût de coordination observé acceptable ?

La tâche était l'ajout d'un endpoint idempotent `POST /jobs` avec `Idempotency-Key`, sur un dépôt cible séparé et sans défaut intentionnel semé.

Le protocole :

```text
baseline B0 saine
→ Auteur A1
→ oracle caché Q1
→ Challenger C1
→ Auteur A2 si finding matériel
→ Challenger C2 borné
→ même oracle Q2
```

Résultat principal :

- A1 obtient **12/12 PASS** sur l'oracle caché ;
- le Challenger établit néanmoins **un défaut matériel C1-M-01**, hors de la couverture de cet oracle ;
- l'Auteur accepte le finding et corrige ;
- C2 vérifie la correction ;
- A2 obtient de nouveau **12/12 PASS** ;
- aucune nouvelle boucle n'est ouverte.

Le résultat est **PASS WITH RECORDED EXPERIMENTAL LIMITATIONS**.

Ce que FIELD-001 permet de dire :

- dans ce cas précis, le Challenger a apporté une valeur matérielle ;
- un oracle entièrement vert sur son propre univers de couverture peut ne pas constituer une vérité terrain exhaustive ;
- la distinction entre « comportement observé » et « matérialité correctement classée » est importante.

Ce que FIELD-001 **ne permet pas** de dire :

- que CCR améliore généralement toutes les tâches ;
- que son coût de coordination est généralement rentable ;
- qu'un oracle vert est inutile ;
- qu'un unique cas suffit à établir une efficacité universelle.

FIELD-001 est désormais **clos, historique, immuable et V1**.

### 4.9 CCR_MS_V2 : mieux mesurer les expériences futures, sans réécrire le passé

FIELD-001 a révélé plusieurs insuffisances de la sémantique de mesure historique : elle ne distinguait pas assez proprement observation, classification, couverture de l'oracle, provenance multi-canal, causalité de correction et origine temporelle d'un défaut final.

CCR_MS_V2 a donc été adopté comme **sémantique normative prospective**.

Principes centraux :

- un `DEFECT_ID` correspond à une violation matérielle sous-jacente ; plusieurs canaux peuvent l'établir sans le compter plusieurs fois ;
- les findings issus d'un rôle exigent un plancher de corroboration indépendant, notamment d'acteur et d'exécution ;
- l'indépendance informationnelle est séparée de la vérité du défaut ;
- `AUTHOR_MISS` est distinct d'une mauvaise classification matérielle ;
- `CHALLENGER_MISS` est mesuré sur les défauts A1 établis au cutoff ;
- `ORACLE_MISS` est distinct d'un `ORACLE_COVERAGE_GAP` ;
- la causalité d'une correction exige une preuve positive, avec `MIXED` séparé ;
- `NOT_ESTABLISHED` n'est ni `NO` ni `REFUTED` ;
- l'origine d'un défaut et son statut final sont deux dimensions différentes ;
- l'évidence postérieure au cutoff ne réécrit pas rétroactivement les métriques d'une expérience close.

Et surtout :

```text
FIELD-001
= HISTORICAL / IMMUTABLE / V1

CCR_MS_V2
= PROSPECTIVE ONLY

IMPLEMENTATION / MACHINE SCHEMA / FIELD-002
= NOT AUTOMATICALLY AUTHORIZED
```

---

## 5. Comment se déroule une mission

### Le cycle durable

```text
DÉCISION / AUTORITÉ HUMAINE
        ↓
CONTRAT DE MISSION
mission.json
        ↓
RENDU LISIBLE DÉTERMINISTE
envelope.md
        ↓
EXÉCUTION PAR UN ACTEUR DÉSIGNÉ
        ↓
RÉSULTAT EXACT
result.json ou retour borné
        ↓
PERSISTANCE / IDENTITÉ
        ↓
CONTRE-EXPERTISE INDÉPENDANTE
        ↓
RATIFICATION OU DÉCISION HUMAINE
        ↓
SUITE, ARRÊT OU NOUVEAU GATE
```

Toutes les missions ne suivent pas exactement le même format de fichier : FIELD-001 ajoute par exemple des retours Auteur/Challenger, des engagements d'oracle, un manifeste et un paquet terminal. Mais le principe reste identique : **produire, persister et qualifier sont des opérations différentes**.

### Trois objets qu'il ne faut jamais confondre

```text
PRODUIRE ≠ PERSISTER ≠ QUALIFIER
```

- Un exécutant produit une affirmation ou un artefact.
- Un acteur de persistance peut enregistrer exactement ses octets sans les approuver.
- Un qualificateur ou Challenger vérifie les relations qui comptent.
- L'humain transforme seulement ensuite ce qui survit en décision normative ou de programme.

### Pourquoi les octets exacts comptent

Une empreinte SHA-256 ou un blob Git ne prouve pas qu'un fichier est « vrai ». Elle répond à une question plus simple : **parle-t-on bien du même objet physique ?**

C'est indispensable lorsqu'un résultat doit être contre-expertisé plus tard ou repris dans une autre mission. La vérification d'identité et l'évaluation du contenu sont deux contrôles distincts : une preuve intègre peut être insuffisante, et un résultat plausible peut avoir une provenance invalide.

L'outillage du Lab vérifie ces identités sans transformer automatiquement une correspondance technique en approbation scientifique.

### Où l'humain intervient

L'humain intervient lorsque la suite demande une véritable autorité :

- choisir entre plusieurs directions de R&D ;
- ratifier ou rejeter une qualification ;
- adopter une règle normative ;
- autoriser une implémentation ;
- décider qu'une ligne doit être arrêtée, reprise ou déplacée.

Un agent peut recommander. Il ne peut pas transformer sa recommandation en décision simplement parce qu'elle est la seule sortie qu'il a produite.

---

## 6. Les raccourcis que le Lab s'interdit

| Raccourci tentant | Pourquoi il est faux |
|---|---|
| « Deux agents sont d'accord, donc c'est vrai. » | L'accord n'est pas une preuve. Plusieurs missions ont montré des erreurs partagées entre exécutant et qualificateur. |
| « Ce n'est pas prouvé, donc c'est faux. » | `NOT_ESTABLISHED` n'est pas `NO`. |
| « J'ai réfuté X, donc non-X est démontré. » | Réfuter une justification positive ne construit pas automatiquement la justification opposée. |
| « J'ai généré beaucoup de candidats, donc j'ai couvert l'espace. » | Une grande énumération n'est pas une preuve d'exhaustivité. |
| « Une seule solution connue veut dire une solution unique. » | Il faut prouver que l'espace est fermé ou qu'aucune solution matériellement distincte ne peut rester. |
| « Ce champ est obligatoire, donc c'est une responsabilité. » | La structure d'un schéma n'est pas automatiquement la structure sémantique du problème. |
| « Même résultat terminal = même raisonnement confirmé. » | Une qualification peut atteindre la même étiquette finale pour une base analytique différente et contredire matériellement l'exécutant. |
| « Un besoin qualifié prouve qu'une conception conforme existe. » | Besoin, conception, implémentation et utilité réelle sont quatre niveaux différents. |
| « Le test passe, donc le comportement est universel. » | Un test n'établit que ce qu'il couvre dans son environnement. |
| « L'oracle est vert, donc aucun défaut matériel ne subsiste. » | FIELD-001 a fourni un contre-exemple borné : 12/12 vert sur l'oracle et un défaut matériel hors couverture. |
| « Un résultat positif autorise la prochaine mission ou l'implémentation. » | Toute suite significative reste une décision séparée. |

Le principe général reste : **ne pas transformer un manque de preuve en fait positif**.

---

## 7. Ce que la ligne HANDOFF_ROUTING a appris

### 7.1 De l'orchestration manuelle à la méta-récursion

La ligne a commencé avec une question très concrète : quelles responsabilités faut-il rendre durables pour ne plus reconstruire manuellement une passation ?

Elle s'est ensuite déplacée vers des problèmes de fermeture :

```text
quelles conceptions sont conformes ?
        ↓
avons-nous toutes les conceptions ?
        ↓
avons-nous toutes les dimensions ?
        ↓
avons-nous toutes les responsabilités ?
        ↓
qu'est-ce qu'une responsabilité ?
        ↓
qu'est-ce qui rend sa variation matérielle ?
```

Jusqu'à la mission 019, cette descente a produit des distinctions utiles. La mission 020 a montré que la stratégie de « fermeture totale par nouvelle couche analytique » réintroduisait le même problème à l'étage supérieur.

### 7.2 Le virage empirique

La réponse n'a pas été d'ajouter Mission 021 automatiquement. L'humain a choisi de revenir à une frontière empirique où une nouvelle observation pouvait réellement changer la décision.

Cette décision a produit :

```text
EXP-C2-C / Mission 021
→ preuve empirique bornée positive
→ étude de traduction produit
→ P-HR-01
→ autorisation d'implémentation bornée
→ Mission 022
→ qualification PASS WITH LIMITATIONS
```

La leçon n'est pas « l'empirisme remplace la sémantique ». C'est : **quand le blocage est évidentiel, davantage d'analyse du même corpus n'est pas une preuve nouvelle**.

### 7.3 Puis FIELD-001 : tester la valeur, pas seulement la mécanique

Après avoir construit et qualifié une capacité produit bornée, le Lab a enfin posé une question plus directement empirique sur CCR lui-même.

FIELD-001 a produit un résultat intéressant précisément parce qu'il n'avait pas besoin d'être spectaculaire : un seul défaut matériel, une correction, un oracle imparfaitement couvrant, des limites procédurales documentées et aucune généralisation abusive.

### 7.4 Enfin CCR_MS_V2 : améliorer la prochaine mesure, pas réécrire la précédente

La réaction à FIELD-001 n'a pas été de recalculer le passé avec de meilleures métriques. Le Lab a adopté une version prospective de la sémantique de mesure et a maintenu FIELD-001 tel qu'il avait été réellement exécuté.

C'est une règle importante de maturité expérimentale : **une meilleure métrique future ne donne pas le droit de réécrire une expérience historique**.

---

## 8. Où on en est au 14 octobre 2026

### 8.1 État canonique publié

```text
BRANCH
= main

HEAD
= 418521f57064fa4f1bf599aaaf40bb05cb956d5b

PROGRAM-STATE
= 75 RATIFIED / 0 PENDING

LATEST AUTHORITY
= 105 — CCR_MS_V2 prospective normative adoption

FIELD-001
= CLOSED / HISTORICAL / IMMUTABLE / V1

CCR_MS_V2
= ADOPTED / DESIGN CLOSED / PROSPECTIVE

IMPLEMENTATION OF CCR_MS_V2 TOOLING
= NOT AUTHORIZED

FIELD-002
= NOT AUTHORIZED

```

Authority 105 est la source normative gouvernante de CCR_MS_V2. Sa matérialisation finale a été indépendamment qualifiée conforme.

### 8.2 Ce que l'on sait désormais mieux

**Établi dans un périmètre borné :**

- CCR peut préserver et organiser une contradiction réelle ;
- un Challenger peut apporter une correction matérielle qu'un Auteur n'avait pas correctement qualifiée ;
- une preuve empirique bornée peut justifier un design produit borné ;
- P-HR-01 peut être implémenté sans défaut matériel établi dans sa qualification actuelle ;
- un oracle gelé et vert n'est pas automatiquement exhaustif ;
- la provenance et l'identité physique des artefacts ont une conséquence opérationnelle réelle lorsque les contrats travaillent sur des octets exacts.

**Toujours non établi :**

- bénéfice général de CCR sur toutes les tâches ;
- rapport coût / valeur général ;
- conditions générales sous lesquelles CCR vaut le surcoût de coordination ;
- utilité réelle complète de P-HR-01 en transport multi-session ;
- consommabilité indépendante de l'ensemble des connaissances durables sans aide narrative ;
- besoin d'un FIELD-002 ;
- besoin d'un moteur ou schéma machine pour CCR_MS_V2.

### 8.3 Direction R&D actuelle : usage réel d'abord

La direction retenue après CCR_MS_V2 est de repartir d'un **besoin réel**, pas de construire un nouveau dispositif parce qu'une nouvelle norme existe.

La question de référence est :

> Dans une situation de travail réelle nécessitant la reprise d'un travail contradictoire antérieur, un consommateur indépendant peut-il exploiter les informations durablement conservées et exposées par CCR pour comprendre ce qui est établi, ce qui reste incertain et quelle décision humaine est requise, sans dépendre de la mémoire narrative de l'orchestrateur ?

Cette priorité n'est pas une feuille de route exclusive. Si le prochain besoin réel expose une autre incertitude plus importante, le travail ne doit pas être déformé pour « faire rentrer » l'expérience dans cette question.

---

## 9. Risques assumés et garde-fous actuels

### Risque 1 — La recherche qui se nourrit d'elle-même

La mission 020 a donné une réponse claire : quand une ligne analytique reproduit son propre bloqueur un étage plus haut sans nouvelle primitive opérationnelle, **un successeur automatique n'est pas justifié**.

Garde-fou : revenir à de nouvelles observations ou changer de question plutôt que créer une nouvelle couche abstraite par réflexe.

### Risque 2 — Confondre propreté des tests et qualité du produit

Une suite totalement verte peut donner un faux sentiment de sécurité si elle a simplement été adaptée à ses propres échecs.

Garde-fou : chaque correction de test doit préserver ou améliorer la capacité de détecter les régressions réelles.

### Risque 3 — Confondre contrat conforme et utilité réelle

P-HR-01 est qualifié sans défaut matériel établi dans son périmètre, mais cela ne prouve pas son utilité générale, ni la qualité d'un transport multi-session réel.

Garde-fou : l'utilité doit être observée dans un besoin réel, pas déduite de la conformité.

### Risque 4 — Confondre oracle et vérité exhaustive

FIELD-001 montre qu'un oracle vert peut ne couvrir qu'un univers borné.

Garde-fou : documenter explicitement l'univers de couverture, les items exercés et ce qui n'est pas établi.

### Risque 5 — Réécrire le passé avec de meilleures règles futures

CCR_MS_V2 est meilleur pour certaines distinctions. Il ne doit pas être utilisé pour recalculer FIELD-001.

Garde-fou : versionner la sémantique de mesure et figer le cutoff avant exécution.

### Risque 6 — Perdre l'identité physique des artefacts entre machines

Selon la configuration Git et la politique d'extraction, les fins de ligne d'un fichier de travail peuvent différer de celles de l'objet enregistré. Les tailles, empreintes et comparaisons d'octets peuvent alors varier entre environnements alors même que les fichiers sont issus du même dépôt.

Garde-fou : lorsque l'identité des octets fait partie du contrat, définir une politique de checkout déterministe et vérifier les octets des artefacts effectivement consommés.

---

## 10. Lire une mission en cinq questions

Lorsqu'un nouveau contrat, résultat ou diagnostic arrive, cinq questions suffisent souvent à éviter l'essentiel des confusions :

1. **Qu'essaie-t-on réellement d'établir ?**
2. **Quelles preuves sont admissibles et jusqu'à quel cutoff ?**
3. **Quels raccourcis sont explicitement interdits ?**
4. **Qu'est-ce que l'exécutant ou l'Auteur prétend avoir établi ?**
5. **Qu'est-ce qui survit réellement à la contradiction et à la qualification ?**

Une sixième question s'est ajoutée avec les travaux récents :

6. **Cette conclusion produit-elle une conséquence opérationnelle réelle, ou seulement une nouvelle façon de reformuler l'inconnu ?**

Les empreintes, blobs, commits, manifests, états de programme et comptes de relations servent à rendre ces questions **reproductibles et attribuables**, pas à remplacer leur contenu.

---

# Annexe A — Les 23 missions en une ligne

**Annoncé** : ce que l'exécutant affirme. **Retenu** : ce qui survit à la qualification gouvernante.

| # | Question / tâche | Issue retenue |
|---|---|---|
| 001 | Frontière décision humaine → conséquence déterministe → conséquence exécutée | Étude primaire PASS WITH LIMITATIONS ; surfaces existantes suffisantes dans le périmètre. La console révèle U-01, ensuite remédié. |
| 002 | Quel travail d'orchestration reste manuel, et lequel pèse le plus ? | HANDOFF_ROUTING 3 épisodes contre CONTEXT_PACKAGE 2 ; l'humain choisit HANDOFF_ROUTING. |
| 003 | Les responsabilités de handoff peuvent-elles être dérivées des surfaces durables existantes ? | BOUNDED_INTEGRATION_OPPORTUNITY dans le périmètre étudié ; besoin d'une étude de conception bornée. |
| 004 | Quelle est la plus petite intégration conforme ? | Résultat initial matériellement contredit : plusieurs candidats étaient surqualifiés ; aucune conception conforme positivement établie. |
| 005 | Reconstruire l'espace de conception avec la chaîne de réalisation complète | PASS WITH LIMITATIONS, mais base durable encore insuffisante ; retour vers acquisition de preuve nouvelle. |
| 006 | Quelle preuve nouvelle permettrait de sortir de RULE_0 ? | SET-Q établi comme un ensemble minimal capable de sortie, mais unicité non établie. |
| 007 | Fermer l'espace des exigences de preuve | FAIL ; la question de quantification au niveau de l'ensemble n'est pas réglée par le corpus. |
| 008 | Étudier les sémantiques normatives de quantification | Qualification corrigée : l'espace des options n'est pas clos ; RULE_0 reste décisive. |
| 009 | Fermer positivement l'espace des options normatives | FAIL corrigé : le générateur de clôture lui-même manque ou reste ouvert. |
| 010 | Étudier une sémantique de générateur de clôture | Qualification corrigée : aucun candidat encore établi conforme ; nouvelles responsabilités manquantes apparaissent. |
| 011 | Fermer l'espace des règles candidates | Qualification corrigée : l'univers des responsabilités est borné à un niveau, mais les domaines de valeurs restent ouverts. |
| 012 | Fermer les domaines de valeurs / architectures | Un candidat qualifié et minimal existe ; l'exhaustivité de l'espace reste non établie. |
| 013 | Fermer l'espace des responsabilités candidates | FAIL : un biconditionnel sur les effets ne prouve pas la complétude constitutive des responsabilités. |
| 014 | Épuiser les responsabilités constitutives | FAIL : changer de découpage ne prouve pas qu'on a trouvé les « morceaux » fondamentaux. |
| 015 | Fermer analytiquement l'univers des responsabilités | La recherche écarte plusieurs règles de clôture sans en établir une ; base insuffisante. |
| 016 | Construire une règle capable de classer une responsabilité encore inconnue | La règle de fermeture dépend encore de la définition même de ce qui compte comme responsabilité. |
| 017 | Étudier l'univers analytique des responsabilités | Découverte centrale : obligatoire, axe, champ ou question ne sont pas automatiquement des responsabilités. |
| 018 | Ontologie d'appartenance des responsabilités | Qualification corrigée ; un modèle reproductible ne suffit pas à établir la légitimité sémantique de ses axes. |
| 019 | Ontologie locale / matérialité | FAIL corrigé ; classification et matérialité restent non établies, plusieurs raccourcis sont écartés. |
| 020 | Définition indépendante de la représentation d'une responsabilité et de sa matérialité | FAIL ; `CONCEPTUAL_REGRESSION=YES`, `META_RECURSION`, `OPERATIONAL_PAYOFF=NONE`. Aucun successeur récursif automatique. |
| 021 | Probe empirique EXP-C2-C sur un handoff borné | PASS WITH LIMITATIONS ; RC1..RC8 observés sur le baseline exact et charge manuelle bornée supprimée ; aucune généralisation produit automatique. |
| 022 | Implémenter le design produit P-HR-01 | PASS WITH LIMITATIONS ; 0 défaut matériel d'implémentation établi, 95/95 nouveaux tests ; utilité opérationnelle générale non établie. |
| 023 | FIELD-001 — idempotent job submission | PASS WITH RECORDED EXPERIMENTAL LIMITATIONS ; 1 finding matériel Challenger hors couverture de l'oracle, corrigé et vérifié ; valeur CCR positive mais strictement bornée. |

---

# Annexe B — Chronologie condensée depuis le 21 septembre

| Date | Événement |
|---|---|
| 21–23 sept. | Mission 020 exécutée puis qualifiée FAIL ; méta-récursion et absence de payoff opérationnel qualifiées. |
| 23 sept. | Retour humain vers la frontière empirique de la mission 005. |
| 24 sept. | EXP-C2-C / mission 021 exécutée et qualifiée PASS WITH LIMITATIONS ; preuve empirique C2 bornée positive. |
| 24–26 sept. | Traduction vers un design produit borné, P-HR-01 ; fermeture normative et autorisation d'implémentation. |
| 26 sept. | Mission 022 : P-HR-01 implémenté puis qualifié PASS WITH LIMITATIONS. |
| 26–27 sept. | FIELD-001 sélectionné, exécuté, qualifié et clos ; mission 023. |
| fin sept. | Analyse terminale FIELD-001 corrigée et paquet de preuves finalisé ; pas de rerun. |
| 29 sept.–2 oct. | CCR_MS_V2 finalisé, adopté et matérialisé dans Authority 105 ; 75 décisions ratifiées, 0 pending. |
| Octobre 2026 — état au 14 octobre | Le CCR Software Engineering Lab est accessible publiquement sur GitHub. Les résultats historiques restent conservés ; aucune nouvelle conclusion expérimentale n'est revendiquée à cette occasion. |

---

# Annexe C — Petit glossaire

| Terme | Sens |
|---|---|
| **Auteur / Challenger** | les deux rôles CCR : l'un produit une position, l'autre cherche à la réfuter |
| **Authority** | document numéroté qui consigne une règle, une décision ou une qualification gouvernante du Lab |
| **Mission Object** | représentation durable d'un contrat de mission ; V0 puis V1 pour P-HR-01 |
| **Result Instance** | représentation structurée d'un retour de mission ; structure valide ne signifie pas contenu vrai |
| **Qualification** | vérification indépendante d'un résultat, de ses preuves et de sa conformité au contrat |
| **Gate humain** | point où une décision humaine est réellement requise |
| **NOT_ESTABLISHED** | ni oui ni non : la preuve positive manque dans les deux sens |
| **RULE_0 / INSUFFICIENT** | issue où la base durable ne suffit pas à choisir une branche plus affirmative |
| **HANDOFF_ROUTING** | famille de responsabilités liées à la passation : prochaine étape, destination de retour, ordre, propriété de persistance, etc. |
| **P-HR-01** | design produit borné qui transporte et consomme quatre responsabilités de handoff dans Mission Object V1 |
| **FIELD-001** | étude de terrain historique V1 sur l'idempotent job submission, mission 023 |
| **CCR_MS_V2** | sémantique normative prospective de mesure CCR, Authority 105 |
| **Oracle coverage** | univers gelé de comportements qu'un oracle est effectivement censé exercer ; vert n'implique pas exhaustif |
| **Cutoff de métrique** | point terminal gelé après lequel une nouvelle information devient connaissance ultérieure, pas une réécriture rétroactive de la métrique |
| **Empreinte / blob** | identité calculée sur les octets ; un seul octet différent produit une identité différente |
| **Checkout EOL policy** | règles selon lesquelles Git peut matérialiser les fins de ligne dans le worktree ; importante lorsque l’identité physique des artefacts est contractuelle |
| **PROGRAM-STATE.json** | curseur durable du programme : décisions ratifiées, preuves et prochain geste canonique |

---

# Annexe D — Où trouver quoi

| Pour… | Aller voir |
|---|---|
| la raison d'être du Lab | `00-CHARTER.md` · `01-RELATION-TO-CCR.md` |
| le protocole d'usage réel | `02-REAL-USE-PROTOCOL.md` |
| les observations historiques | `04-OBSERVATION-RECORD.md` |
| les pièges de contre-expertise | `05-CROSS-EXPERTISE-PATTERNS.md` |
| l'état exact du programme | `PROGRAM-STATE.json` |
| l'histoire détaillée et les qualifications | `README.md` |
| les cinq cas logiciels | `cases/` |
| les missions 001 à 023 | `missions/` |
| le tooling interne du Lab | `tooling/` |
| Mission Object V0 | `14-TOOLING-EXPERIMENT-002-MISSION-OBJECT-V0.md` |
| Result Instance v0 | `23-TOOLING-EXPERIMENT-003-RESULT-INSTANCE-V0.md` |
| console locale | Authorities 31–42 + `tooling/console/` |
| qualification de P-HR-01 | `102-HANDOFF-ROUTING-P-HR-01-IMPLEMENTATION-INDEPENDENT-QUALIFICATION.md` |
| protocole FIELD-001 | `103-FIELD-001-IDEMPOTENT-JOB-SUBMISSION-DIRECTION-AND-EXPERIMENTAL-PROTOCOL-AUTHORIZATION.md` |
| gel FIELD-001 | `104-FIELD-001-IDEMPOTENT-JOB-SUBMISSION-EXPERIMENTAL-TRANSACTION-FREEZE.md` |
| sémantique de mesure V2 | `105-CCR-MEASUREMENT-SEMANTICS-V2-PROSPECTIVE-NORMATIVE-ADOPTION.md` |
| preuves FIELD-001 | `missions/023-field-001-idempotent-job-submission/` |

---

## En une phrase

Le CCR Software Engineering Lab n'essaie plus de prouver son intérêt en accumulant des couches de protocole : il utilise désormais les surfaces qu'il a construites sur des besoins réels, conserve les désaccords et les inconnues, et n'autorise une nouvelle règle, un nouveau produit ou une nouvelle expérience que lorsqu'une conséquence concrète le justifie.
