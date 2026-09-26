# FIELD-001 — soumission de jobs idempotente : gel de la transaction expérimentale

```text
CE DOCUMENT GÈLE
= LA TRANSACTION EXPÉRIMENTALE FIELD-001 AUTORISÉE PAR L'AUTORITÉ 103,
  APRÈS CRÉATION ET VÉRIFICATION EFFECTIVES DE B0, DU CONTRAT ET DE L'ORACLE

IL N'EST PAS UNE DÉCISION HUMAINE NOUVELLE
IL NE LANCE NI L'AUTEUR, NI LE CHALLENGER, NI LE QUALIFICATEUR
IL NE MODIFIE NI B0, NI LE CONTRAT, NI L'ORACLE
```

## 1. Lignée

```text
AUTORITÉ 103 — direction FIELD-001 et protocole expérimental
= 103-FIELD-001-IDEMPOTENT-JOB-SUBMISSION-DIRECTION-AND-EXPERIMENTAL-PROTOCOL-AUTHORIZATION.md
  blob   fb885bca7a5ac876347b40c976021980939dfb0f
  sha256 a1523b8e908f6114e77e7be7f9d59c5adf854408d02df76fd6eb1c9d5411282f
  commit 5cb5dfb561e510a9ae462ef95cdcdf58034364b9
= GOUVERNANTE

MANIFESTE PUBLIC DE L'ÉTUDE
= missions/023-field-001-idempotent-job-submission/field-study-manifest.json
  blob   0d61471ead3be646a8030af494a7c6236996f376
  sha256 8a37f1729654517ac910576f4c4052b2489c645ad4f3e41949a7d44c01e8256e

MISSION 023
= missions/023-field-001-idempotent-job-submission/mission.json + envelope.md
  gelées par le même commit ; la mission référence la présente autorité par son blob

DÉCISIONS DE PROGRAMME
= 74 RATIFIÉES / 0 EN ATTENTE · aucune décision nouvelle
```

## 2. Dépôt cible et ligne de base B0

```text
DÉPÔT CIBLE           E:\prog\ccr-field-001-idempotent-jobs
REMOTE                NONE
BRANCHE               main
B0 COMMIT             785795af434299d2b6d25910eac2761208766b0d
B0 TREE               7df985d26d241aa46f615e6821ea9b1621ecf936
B0 SUJET              b0: healthy job service baseline and field-001 contract
B0 DATE               2026-09-26T12:02:09+02:00
B0 AUTEUR GIT         identité globale de la machine (TribS Tox <tribstox@gmail.com>)
```

```text
FICHIERS PUBLICS DE B0                    sha256
  .gitattributes                          d60f352d0db1404c70afb4bb8b2ca3fd1c610572aa40720e8a0b7baa7885418c
  .gitignore                              39e3fce667cd0ccadba9fe30317f4bf5d9d0ede3e9dc49ef239122039d55cc46
  FIELD-001-CONTRACT.md                   7d5132bd119cbdd5f10b7690d6434fbeec872cf9526ab0c7ee751baa8c488f88
  README.md                               1566b1b40d5e50de882e638a355d18fe8ac26964b10e738d6f116a950a2e69c6
  jobservice/__init__.py                  81820d98aaaae13afbedab2bfa77e7046009f3e4f1bff9c1914e40c0545d54ff
  jobservice/__main__.py                  58086bf9347e49483353c95169c4d3ef49fdd6c0598313f2eb27dff99c9ebb71
  jobservice/server.py                    289b4e8ec3195b494f6554ad273efdfc2ff4a2a1277282478c38d578c9c15ed4
  jobservice/store.py                     c5eb56f8eb9e46b8c9eb5756c0dabc2392fa7f03d5b367774ee341d2900ac59d
  tests/__init__.py                       e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
  tests/test_baseline.py                  956a35b16f8582b15b056972bb586f6b9a1664fa99328b26b244eb53898aa25a
(blobs Git : manifeste public)
```

```text
SERVICE B0            POST /jobs { "type", "payload" } · GET /jobs/<id> · SQLite, table jobs ·
                      python -m jobservice --db <path> [--host] [--port] ;
                      « listening on http://<host>:<port> » au démarrage
IDEMPOTENCE DANS B0   ABSENTE — ni Idempotency-Key, ni table, ni cache, ni empreinte
DÉFAUT DÉLIBÉRÉ       AUCUN
CODE PRODUIT          environ 190 lignes pertinentes, 2 fichiers principaux
                      (store.py, server.py) + __init__.py / __main__.py
```

```text
TESTS DE BASE         python -m unittest discover -s tests -t .
                      10 tests · 10 PASS · 0 FAIL
                      B-01 création valide · B-02 JSON invalide · B-03 corps invalide ·
                      B-04 GET existant · B-05 GET absent · B-06 soumissions répétées,
                      jobs distincts · B-07 persistance au redémarrage · B-08 soumissions
                      concurrentes non idempotentes (barrière, 8 fils, jointure) ·
                      B-09 échec de stockage → 503 JOB_CREATE_FAILED · B-10 point
                      d'entrée en ligne de commande
STABILITÉ             25 / 25 exécutions dans l'arbre de travail
                      + 5 / 5 exécutions depuis un export propre du commit B0
PYTHON                3.14.3 (commande python) · SQLite 3.50.4 · bibliothèque standard seule
```

## 3. Contrat public

```text
FIELD-001-CONTRACT.md
  sha256 7d5132bd119cbdd5f10b7690d6434fbeec872cf9526ab0c7ee751baa8c488f88
  blob   3383a1335c1f0602889e277e8fbfb7cbae9128b6
  CLAUSES   C-SCOPE · C-KEY · C-LEGACY · C-FIRST · C-REPLAY · C-CONFLICT ·
            C-IDENTITY · C-CONC-IDENTICAL · C-CONC-COMPETING · C-FAILED-CREATE ·
            C-DURABLE · C-NO-FALLBACK · C-FREEDOM
```

Le contrat transcrit les clauses ratifiées par l'autorité 103 § 6. Il déclare
non spécifiés, sans y choisir de comportement : la réponse à une requête avec clé
dont le corps échoue la validation existante et l'ordre des validations de clé et
de corps ; l'équivalence de nombres JSON écrits différemment ; les objets JSON
répétant un nom de membre. L'oracle ne vérifie aucun de ces points.

## 4. Entrée commune gelée

```text
COMMON FROZEN INPUT
= exact B0 commit 785795af434299d2b6d25910eac2761208766b0d
  tree 7df985d26d241aa46f615e6821ea9b1621ecf936, dont les octets exacts de
  FIELD-001-CONTRACT.md (sha256 7d5132bd…)

AUCUN oracle · AUCUNE note de qualificateur · AUCUN résultat Q1 · AUCUN constat du challenger

AUTEUR       entrée commune SEULEMENT
CHALLENGER   entrée commune + octets exacts gelés d'A1 + retour / affirmations d'A1
             + tests écrits par l'auteur
NI L'UN NI L'AUTRE : implémentation de l'oracle · résultat Q1 · notes du qualificateur
```

## 5. Engagement de l'oracle

```text
ORACLE COMMIT         0dd01113e6d8a295ebcfc30637fef0c9a82a3e99
ORACLE TREE           50ee0d3532eb7faaea7fe6e45909a3ae2533e138
MANIFESTE SHA-256     97a854f2feb4a48370f909225dac3d0b044f6101f8b8ca4f8f327a4ddaa51e46
GELÉ LE               2026-09-26T12:09:08+02:00
REMOTE                NONE
LIEU                  dépôt local séparé, hors du dépôt cible ; chemin non publié

ORDRE TEMPOREL        B0 (12:02:09) < gel de l'oracle (12:09:08)
                      < gel de la présente transaction < lancement de l'auteur

VALIDATION PRÉALABLE  effectuée avant le gel, rapport scellé dans le commit de l'oracle
```

Ne sont pas exposés avant le terminal : source de l'oracle, chemin, détails de
fixtures au-delà du protocole public, messages d'échec, noms d'utilitaires internes.
Aucune modification de l'oracle après le présent gel ; Q1 et Q2 emploient le même
oracle gelé.

## 6. Cas publics de l'oracle

```text
O-01  legacy no-key behavior                      C-LEGACY
O-02  invalid key                                 C-KEY
O-03  first keyed creation                        C-FIRST
O-04  identical replay                            C-REPLAY
O-05  canonical JSON equivalence                  C-IDENTITY · C-REPLAY · C-CONFLICT
O-06  same key / different request conflict       C-CONFLICT
O-07  persistence across restart                  C-DURABLE
O-08  concurrent identical requests               C-CONC-IDENTICAL
O-09  concurrent competing requests               C-CONC-COMPETING
O-10  failed creation does not poison key         C-FAILED-CREATE
O-11  conflict does not mutate original binding   C-CONFLICT
O-12  no silent legacy fallback                   C-NO-FALLBACK
```

Tout échec d'oracle se rattache à une clause explicite ; aucune exigence cachée.
Verdict par cas : PASS · FAIL · BLOCKED.

## 7. Harnais de concurrence

```text
CONCURRENT START                 barrier synchronized
IDENTICAL CASE THREAD COUNT      8
COMPETING CASE                   même clé, requêtes logiques distinctes ;
                                 aucun gagnant prédéterminé
DATABASE                         one shared SQLite database
REQUEST COMPLETION               all worker threads joined before behavioral assertions
SLEEP-BASED CORRECTNESS          FORBIDDEN
RETRY-UNTIL-PASS                 FORBIDDEN
TEST RESULT                      one deterministic verdict from one bounded execution
```

## 8. Rôles

```text
AGENT CCR LAB #65     AUTHOR                   frais · aucun accès à l'oracle
AGENT CCR LAB #66     CHALLENGER               frais · aucun accès à l'oracle
AGENT CCR LAB #67     INDEPENDENT QUALIFIER    frais · dépôt cible + oracle +
                                               identités gelées · aucune autorité
                                               de reconception du contrat
AGENT CCR LAB #1      CONTRÔLEUR DE TRANSACTION · matérialisation canonique
```

## 9. Séquence gelée

```text
B0 → A1 → Q1 → C1 → A2 → C2 → Q2

A1   #65 implémente FIELD-001 sur B0, écrit ses propres tests, rend chemins,
     implémentation, tests, hypothèses, interprétations matérielles, commandes /
     résultats, affirmations de correction et limites connues ; aucun commit,
     aucun push, aucun remote ; #1 vérifie puis GÈLE A1 par un commit local du
     dépôt cible
Q1   #67 exécute l'oracle gelé contre A1 exact, APRÈS le gel d'A1 et AVANT que
     #66 voie A1 · O-01..O-12 PASS / FAIL / BLOCKED avec preuve
     RÉSULTAT Q1 SÉQUESTRÉ · ENGAGEMENT PUBLIC Q1_COMMITMENT (identité d'A1,
     engagement de l'oracle, hachage du fichier de résultat Q1) SANS ISSUE
C1   #66 revoit A1 sans connaissance de l'oracle ; constat admissible = clause ·
     code / comportement exact · reproduction ou test · conséquence matérielle ;
     constats matériels, observations non matérielles et affirmations non
     étayées rapportés séparément ; aucune réécriture
A2   seulement si C1 porte des constats matériels : #65 reçoit C1 + entrée
     commune + A1, PAS Q1 ; ACCEPT (correctif justifié seulement) ou REBUT
     (preuve) ; aucune amélioration opportuniste ; A2 gelé
     sinon A2 = A1, aucune seconde mutation
C2   seulement si A2 a traité des constats matériels : chaque constat C1 classé
     FIXED · REBUTTAL ACCEPTED · STILL MATERIAL · CHALLENGER FINDING WITHDRAWN ;
     défaut nouvellement introduit par A2 seulement ; aucun nouveau cycle large
     sinon C2 NON REQUIS, C1 terminal du challenger
Q2   #67 exécute le MÊME oracle gelé contre l'implémentation finale (A2 si
     différente d'A1, sinon A1) ; aucune boucle d'implémentation ensuite ;
     après Q2 seulement : révélation de la source de l'oracle et de Q1 complet
```

```text
MAXIMUM AUTHOR IMPLEMENTATION PASSES     2
MAXIMUM CHALLENGER REVIEW PASSES         2
THIRD LOOP                               FORBIDDEN
Q2 STILL FAILS                           → RECORD FAILURE
```

## 10. Métriques

```text
AUTHOR_FIRST_PASS_DEFECTS · CHALLENGER_TRUE_FINDINGS ·
CHALLENGER_FALSE_OR_NONMATERIAL_FINDINGS · CHALLENGER_MISSES ·
MATERIAL_DEFECTS_MISSED_BY_BOTH · CROSS_REVIEW_CORRECTIONS ·
AUTHOR_SELF_CORRECTIONS · FINAL_REMAINING_DEFECTS · UNSUPPORTED_AUTHOR_CLAIMS ·
UNSUPPORTED_CHALLENGER_CLAIMS · ROLE_CONTAMINATION · CONTRACT_DRIFT ·
HUMAN_INTERVENTIONS · REVIEW_LOOPS · AUTHOR_CORRECTION_QUALITY ·
FINAL_ORACLE_RESULT · FINAL_REGRESSION_RESULT

CCR_SPECIFIC_VALUE_ADDED et CCR_SPECIFIC_BURDEN_ADDED consignés séparément
AUCUN SCORE CCR AGRÉGÉ · AUCUN ROI GÉNÉRAL · PROJECTION = HYPOTHÈSE BORNÉE
```

## 11. Portes humaines

Seulement pour une ambiguïté authentique du contrat ou un choix d'autorité
authentique non résolu par le contrat gelé. Aucune porte pour la stratégie
d'implémentation, l'organisation des tests, le schéma SQL, le mode de
transaction, un défaut de code ordinaire, ni un désaccord que la preuve résout.

## 12. Arrêts

```text
préconditions ou identités gelées discordantes            → STOP · aucune réparation
contamination de rôle (oracle ou Q1 vu par #65 / #66)     → STOP · consigné
oracle modifié après le présent gel                       → STOP
écriture hors du dépôt cible, commit / push / remote
  par #65 ou #66                                          → STOP
mutation canonique inattendue                             → STOP
ambiguïté authentique du contrat                          → PORTE HUMAINE
troisième boucle demandée                                 → INTERDITE · échec consigné
affaiblissement de méthode pour avancer                   → INTERDIT
```

## 13. Terminal

```text
FIELD-001 TERMINAL
= COMPLETE (Q2 exécuté, résultat final consigné, qu'il soit succès ou échec)
= HARD_BLOCKED (arrêt consigné)
= NEW_MATERIAL_CHOICE_REQUIRED (ambiguïté authentique du contrat)

AU TERMINAL : preuve factuelle d'attribution et métriques § 10 ;
révélation de l'oracle et de Q1 complet pour audit contre les engagements.
```

Les gestes Git après chaque frontière de transport manuel exigent le go Git local
de la continuation correspondante.

## 13 bis. Ce que ce document ne fait pas

```text
IL NE MODIFIE NI B0, NI LE CONTRAT, NI L'ORACLE
IL NE PUBLIE NI LA SOURCE, NI LE CHEMIN DE L'ORACLE
IL NE LANCE AUCUN RÔLE ET NE CRÉE AUCUNE DÉCISION HUMAINE
IL N'IMPLÉMENTE RIEN DANS LE DÉPÔT CCR CANONIQUE
IL NE ROUVRE NI HANDOFF_ROUTING, NI P-HR-01
```

## 14. État matérialisé

```text
AUTORITÉ 104                    GEL DE LA TRANSACTION FIELD-001
B0                              GELÉE · SAINE · 10 / 10 · STABLE
CONTRAT                         GELÉ
ORACLE                          GELÉ · SÉQUESTRÉ · ENGAGÉ (0dd01113…)
MISSION 023                     GELÉE PAR LE MÊME COMMIT
AUTEUR #65                      ALLOUÉ À LA POUSSÉE DE CE GEL · SUIVANT
CHALLENGER #66                  NON LANCÉ
QUALIFICATEUR #67               NON LANCÉ
Q1_COMMITMENT                   EN ATTENTE

DÉCISIONS RATIFIÉES / EN ATTENTE   74 / 0
AUTORITÉS RACINE NUMÉROTÉES        104 · 00..104 SANS 18
AIRES D'OUTILLAGE                  4

SUIVANT
= EXÉCUTER FIELD-001 EN COMMENÇANT PAR L'AUTEUR A1
  SOUS LE PROTOCOLE GELÉ A104 / M023 · AUCUNE PORTE CONCEPTUELLE NOUVELLE
```
