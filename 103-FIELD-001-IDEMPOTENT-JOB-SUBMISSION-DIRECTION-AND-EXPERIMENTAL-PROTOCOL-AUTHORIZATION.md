# FIELD-001 — soumission de jobs idempotente : direction et autorisation du protocole expérimental

```text
CE DOCUMENT MATÉRIALISE
= UNE DÉCISION HUMAINE RATIFIÉE DE PROGRAMME :
  FIELD-001 EST LA PROCHAINE ÉTUDE DE TERRAIN RÉALISTE ET BORNÉE
= LE PROTOCOLE EXPÉRIMENTAL, AVEC SES CORRECTIONS RATIFIÉES

IL NE CRÉE NI LE DÉPÔT CIBLE, NI L'ORACLE, NI LA MISSION 023
IL N'ALLOUE NI L'AUTEUR, NI LE CHALLENGER, NI LE QUALIFICATEUR
IL NE LANCE AUCUNE EXÉCUTION
```

## 1. Statut

```text
LIGNE HANDOFF_ROUTING / P-HR-01
= CLOSE — implémentation qualifiée PASS WITH LIMITATIONS (autorité 102)
= NON SUJET DE FIELD-001

DÉCISIONS DE PROGRAMME AVANT MATÉRIALISATION
= 73 RATIFIÉES / 0 EN ATTENTE

AUTEUR / CHALLENGER            NON LANCÉS À L'ENTRÉE
```

## 2. Décision humaine

```text
FIELD-001
= ACCEPTED AS NEXT REALISTIC BOUNDED FIELD STUDY

TASK DESIGN                    PASS
EXPERIMENTAL PROTOCOL          PASS WITH THE CORRECTIONS BELOW
                               CORRECTIONS HUMAN-RATIFIED
```

## 3. Question expérimentale

```text
ON A SMALL BUT NON-TRIVIAL ENGINEERING TASK,
DOES CCR CROSS-REVIEW MATERIALLY IMPROVE
THE RESULT AT AN ACCEPTABLE OBSERVED
COORDINATION COST?
```

## 4. Classe de tâche

```text
SUJET              IDEMPOTENT JOB SUBMISSION
TÂCHE              SMALL BUT NON-TRIVIAL
```

Ce n'est PAS :

```text
bug repair · mini-SaaS construction · artificial puzzle ·
deliberately seeded defect · P-HR-01 qualification ·
framework-selection exercise
```

```text
INTENTIONAL DEFECT                          NONE
```

Cible : un petit dépôt autonome, séparé du dépôt CCR canonique, sans remote.
Python 3.x, bibliothèque standard seule, HTTP par http.server /
ThreadingHTTPServer ou composition équivalente de la bibliothèque standard,
persistance sqlite3, tests unittest ; aucune interface, aucun framework, aucune
installation de paquet externe ; code produit d'environ 300 à 800 lignes
pertinentes, de préférence deux fichiers produit principaux et une zone de
tests.

## 5. Ligne de base saine B0

```text
POST /jobs   { "type": "...", "payload": {...} }
GET  /jobs/<id>
jobs durablement stockés dans SQLite
même requête ordinaire deux fois → deux jobs distincts
```

B0 ne contient NI support d'Idempotency-Key, NI table, NI cache
d'idempotence, NI logique d'empreinte de requête, NI implémentation partielle
cachée de FIELD-001. Tests publics minimaux : B-01 création valide · B-02 JSON
invalide · B-03 corps de job invalide · B-04 GET existant · B-05 GET absent ·
B-06 soumissions ordinaires multiples, jobs distincts · B-07 persistance au
redémarrage · B-08 soumissions concurrentes non idempotentes. Aucun défaut
délibéré, aucun test instable, aucune correction par attente. Stabilité établie
par exécution répétée. B0 = LIGNE DE BASE COMMUNE IMMUABLE.

## 6. Contrat public FIELD-001 ratifié

Le contrat ne gouverne que POST /jobs.

```text
OPTIONAL HEADER     Idempotency-Key: <value>
VALID KEY           ^[A-Za-z0-9._:-]{1,128}$
INVALID KEY         HTTP 400 { "error": "INVALID_IDEMPOTENCY_KEY" } · JOB CREATED = NO

NO KEY
  → legacy behavior unchanged
  same request twice without key → two distinct jobs
  existing validation behavior → unchanged

FIRST KEYED SUBMISSION
  KEY K + REQUEST R + no previous successful K
  → create exactly one logical job J
  HTTP 201 · Idempotency-Replayed = false

IDENTICAL RETRY
  KEY K + SAME LOGICAL REQUEST R
  → no new job · return established J
  HTTP 200 · Idempotency-Replayed = true · returned job id = same id

SAME KEY / DIFFERENT REQUEST
  KEY K + REQUEST R2, R2 != R
  → HTTP 409 { "error": "IDEMPOTENCY_CONFLICT" } · NEW JOB = NO
  the key remains bound to the first successfully established request / job
```

Identité logique de requête : le modèle JSON accepté { "type": ..., "payload":
... }, NON les octets bruts du corps HTTP.

```text
object keys          sorted
whitespace           irrelevant
JSON object key order  irrelevant
array order          significant
string values        exact
type value           exact
```

Des objets sémantiquement identiques, aux espaces ou à l'ordre des clés près,
sont la MÊME requête logique.

```text
CONCURRENT IDENTICAL SUBMISSIONS (eight, same K + same R)
  JOBS CREATED                         exactly 1
  DISTINCT JOB IDS RETURNED            exactly 1
  HTTP 201                             exactly 1
  successful replay HTTP 200           remaining successful requests
  409                                  0

CONCURRENT COMPETING REQUESTS (same K + distinct logical requests)
  the scheduler may determine the winner ; no deterministic winner required
  after one request becomes established :
    KEY K = bound to exactly one request identity · MAX JOBS CREATED FOR K = 1
    requests matching winner → established job / replay behavior
    requests not matching winner → HTTP 409
  no silent rebinding

FAILED CREATION (before a job is durably established)
  KEY K + REQUEST R → HTTP 503 { "error": "JOB_CREATE_FAILED" }
  KEY K NOT PERMANENTLY POISONED : a later retry K + R must be able to succeed normally

DURABILITY
  successful K + R → service stop → restart on the same SQLite database
  → retry K + R returns the same logical job
  IDEMPOTENCY STATE = DURABLE · in-memory-only solution = NON-CONFORMANT

NO SILENT FALLBACK
  for a request carrying Idempotency-Key, failure in idempotency processing
  MUST NOT become an ordinary legacy POST that may duplicate the job
  → explicit request failure (an appropriate explicit 5xx unless a more
    specific rule above applies) · no silent downgrade to non-idempotent behavior
```

Liberté technique de l'auteur, non matérielle : forme exacte du schéma SQL,
implémentation transactionnelle, algorithme de hachage, factorisation des
modules, noms des utilitaires, stratégie de verrouillage, mode de transaction
SQLite, noms d'index, organisation des tests, classes de données internes.

## 7. Oracle indépendant et séquestré

```text
O-01 legacy no-key behavior          O-07 persistence across restart
O-02 invalid key                     O-08 concurrent identical requests
O-03 first keyed creation            O-09 concurrent competing requests
O-04 identical replay                O-10 failed creation does not poison key
O-05 canonical JSON equivalence      O-11 conflict does not mutate original binding
O-06 same key / different request conflict   O-12 no silent legacy fallback
```

Seules les assertions de soutien ordinaires nécessaires à ces exigences sont
permises ; aucune exigence sémantique cachée ; tout échec d'oracle se rattache à
une clause explicite du contrat public.

```text
HARNAIS DE CONCURRENCE
  CONCURRENT START                 barrier synchronized
  IDENTICAL CASE THREAD COUNT      8
  DATABASE                         one shared SQLite database
  REQUEST COMPLETION               all worker threads joined before behavioral assertions
  SLEEP-BASED CORRECTNESS          FORBIDDEN
  RETRY-UNTIL-PASS                 FORBIDDEN
  TEST RESULT                      one deterministic verdict from one bounded execution
  COMPETING REQUESTS               no predetermined winner asserted ; only one
                                   established request, one job maximum, consistent
                                   replay / conflict behavior afterward
```

```text
ORACLE                  créé AVANT le lancement de l'auteur
LIEU                    dépôt local séparé ou espace séquestré, jamais dans le dépôt cible
REMOTE                  NONE
GEL                     commit local ou manifeste immuable
PUBLIC                  seulement l'engagement : hachage / commit / arbre / manifeste
NON EXPOSÉS AVANT LE TERMINAL
                        source, chemin, détails de fixtures au-delà du protocole
                        public, messages d'échec, noms d'utilitaires internes
AUTEUR / CHALLENGER     AUCUN ACCÈS À L'ORACLE
APRÈS LE TERMINAL       l'oracle peut être révélé et matérialisé pour audit
                        contre l'engagement préalable
```

## 8. Entrée commune gelée

```text
COMMON FROZEN INPUT
= exact B0 repository commit / tree / bytes
+ exact FIELD-001-CONTRACT.md bytes

AUTHOR RECEIVES        COMMON FROZEN INPUT ONLY
CHALLENGER RECEIVES    COMMON FROZEN INPUT + exact frozen A1 bytes
                       + Author A1 return / claims + Author-written tests
NEITHER RECEIVES       oracle implementation · Q1 result · qualifier notes
```

## 9. Rôles et séquence

```text
AGENT CCR LAB #65      AUTHOR
AGENT CCR LAB #66      CHALLENGER
AGENT CCR LAB #67      INDEPENDENT QUALIFIER
                       (reçoit dépôt cible + oracle + identités gelées,
                        sans autorité pour reconcevoir le contrat)

B0  healthy baseline
A1  Author first-pass implementation
Q1  hidden independent qualification of A1
C1  Challenger review of A1
A2  Author correction pass if material C1 findings exist
C2  Challenger final bounded qualification when correction / rebuttal needs verification
Q2  final independent oracle + qualification

MAXIMUM AUTHOR IMPLEMENTATION PASSES      2
MAXIMUM CHALLENGER REVIEW PASSES          2
THIRD LOOP                                FORBIDDEN
Q2 STILL FAILS                            → RECORD FAILURE, NOT A PASS 3
```

```text
Q1
= #67 exécute l'oracle gelé contre A1 exact, APRÈS le gel d'A1 et AVANT que
  le challenger voie A1 · O-01..O-12 PASS / FAIL / BLOCKED avec preuve exacte
= RÉSULTAT SÉQUESTRÉ : ni l'auteur, ni le challenger ne le voient
= ENGAGEMENT PUBLIC Q1_COMMITMENT : identité d'A1, engagement de l'oracle,
  hachage du fichier de résultat Q1, SANS issue ni cas en échec
= révélé seulement au terminal de l'expérience
```

Constat admissible du challenger : clause du contrat · code / comportement
exact · reproduction ou test · conséquence matérielle. Non matériels par
défaut : préférence de style, préférence d'architecture, extensibilité
spéculative, suggestion de refactoring, nommage, spéculation de course non
étayée, « pourrait être plus propre ». Le challenger rapporte séparément les
constats matériels candidats, les observations non matérielles et les
affirmations non étayées ; aucune réécriture.

```text
C1 SANS CONSTAT MATÉRIEL     A2 = A1 · C2 NON REQUIS · C1 TERMINAL DU CHALLENGER
C1 AVEC CONSTATS MATÉRIELS   #65 reçoit C1 + entrée commune + A1, PAS Q1 ;
                             ACCEPT (correctif justifié seulement) ou REBUT (preuve) ;
                             aucune amélioration opportuniste ; A2 gelé
C2                           classe chaque constat C1 : FIXED · REBUTTAL ACCEPTED ·
                             STILL MATERIAL · CHALLENGER FINDING WITHDRAWN ;
                             défaut nouvellement introduit par A2 seulement ;
                             aucun nouveau cycle de revue large
Q2                           MÊME ORACLE GELÉ contre l'implémentation finale ;
                             aucune modification de l'oracle après le gel de B0 ;
                             aucune boucle d'implémentation après Q2
```

## 10. Méthode d'attribution

La preuve finale établit séparément :

```text
AUTHOR_FIRST_PASS_DEFECTS                defects demonstrated by Q1
CHALLENGER_TRUE_FINDINGS                 C1 findings independently supported on A1
CHALLENGER_FALSE_OR_NONMATERIAL_FINDINGS unsupported / non-material C1 claims
CHALLENGER_MISSES                        Q1 material defects absent from C1
MATERIAL_DEFECTS_MISSED_BY_BOTH          Q1 / Q2-supported defects never identified
CROSS_REVIEW_CORRECTIONS                 Q1-established A1 defects corrected in A2
                                         because of true C1 findings
AUTHOR_SELF_CORRECTIONS                  A1 → A2 material changes not attributable to C1
FINAL_REMAINING_DEFECTS                  Q2-established failures
UNSUPPORTED_AUTHOR_CLAIMS · UNSUPPORTED_CHALLENGER_CLAIMS · ROLE_CONTAMINATION ·
CONTRACT_DRIFT · HUMAN_INTERVENTIONS · REVIEW_LOOPS · AUTHOR_CORRECTION_QUALITY ·
FINAL_ORACLE_RESULT · FINAL_REGRESSION_RESULT
```

## 11. Valeur et charge

```text
AUCUN SCORE CCR SYNTHÉTIQUE

CCR_SPECIFIC_VALUE_ADDED      materially useful corrections attributable to cross-review
CCR_SPECIFIC_BURDEN_ADDED     review activity + rebuttal / correction activity +
                              orchestration operations + false / non-material findings +
                              human interventions

PROJECTION PLUS LARGE         HYPOTHÈSE BORNÉE SEULEMENT
ROI GÉNÉRAL DE CCR            NON INFÉRÉ
```

## 12. Aucune exigence de succès synthétique

L'étude n'est pas tenue de réussir. Un échec établi par Q2 est consigné comme
échec ; aucune troisième boucle, aucune modification d'oracle, aucun
affaiblissement de méthode pour obtenir un succès.

## 13. Portes humaines

Intervention humaine permise seulement pour une ambiguïté authentique du
contrat ou un choix d'autorité authentique non résolu par le contrat gelé ;
aucune porte pour la stratégie d'implémentation, l'organisation des tests, le
schéma SQL, le mode de transaction, un défaut de code ordinaire, ni un
désaccord du challenger que la preuve résout.

## 14. Discipline de terminal

```text
L'EXPÉRIENCE ATTEINT SON TERMINAL APRÈS Q2
AU TERMINAL SEULEMENT : révélation de Q1 complet et de la source de l'oracle
                        pour audit contre l'engagement
TERMINAL              évidence factuelle d'attribution, valeur et charge
                      séparées, sans score agrégé ni ROI général
```

## 15. Ce que ce document ne fait pas

```text
IL NE CRÉE NI B0, NI LE CONTRAT, NI L'ORACLE, NI LA MISSION 023
IL NE GÈLE PAS LA TRANSACTION (AUTORITÉ 104)
IL N'ALLOUE AUCUN AGENT ET NE LANCE AUCUNE EXÉCUTION
IL NE ROUVRE NI HANDOFF_ROUTING, NI P-HR-01
IL NE MODIFIE AUCUNE AUTORITÉ ANTÉRIEURE NI AUCUNE AIRE D'OUTILLAGE
```

## 16. État matérialisé

```text
FIELD-001                                  SÉLECTIONNÉE · RATIFIÉE
QUESTION                                   VALEUR DE LA REVUE CROISÉE CCR
                                           À COÛT DE COORDINATION OBSERVÉ
TÂCHE                                      SOUMISSION DE JOBS IDEMPOTENTE
DÉFAUT INTENTIONNEL                        AUCUN
BOUCLES MAXIMALES                          2 AUTEUR · 2 CHALLENGER · AUCUNE TROISIÈME
ORACLE                                     INDÉPENDANT · SÉQUESTRÉ · GELÉ AVANT L'AUTEUR
Q1                                         CACHÉ · ENGAGEMENT PUBLIC SANS ISSUE
SCORE CCR AGRÉGÉ                           AUCUN
P-HR-01                                    NON SUJET DE L'ÉTUDE

NOUVELLE DÉCISION HUMAINE                  1
DÉCISIONS RATIFIÉES / EN ATTENTE           74 / 0

AUTORITÉS RACINE NUMÉROTÉES                103 · 00..103 SANS 18
AIRES D'OUTILLAGE                          4

SUIVANT
= CONSTRUIRE ET GELER B0, LE CONTRAT PUBLIC ET L'ORACLE SÉQUESTRÉ,
  PUIS GELER LA TRANSACTION (AUTORITÉ 104, MISSION 023)
```
