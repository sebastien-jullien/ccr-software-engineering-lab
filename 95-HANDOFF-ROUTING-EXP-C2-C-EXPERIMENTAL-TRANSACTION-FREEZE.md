# Handoff / routage — gel de la transaction expérimentale EXP-C2-C

```text
CE DOCUMENT GÈLE
= LE CONTRAT D'EXPÉRIENCE STATIQUE DE LA TRANSACTION EXP-C2-C
  SOUS L'AUTORITÉ 94

IL AUTORISE
= L'EXÉCUTION DE L'EXPÉRIENCE EXP-C2-C
  SEULEMENT APRÈS QUE CE CONTRAT STATIQUE
  A ÉTÉ DURABLEMENT MATÉRIALISÉ ET VÉRIFIÉ

IL N'AFFIRME PAS
= QUE J-C OU D-C ONT EU LIEU

IL NE CRÉE PAS
= derived-handoff.json · observations.json · mission.json · envelope.md · result.json

ADOPTION PRODUIT           NON
IMPLÉMENTATION PRODUIT     NON
MOTEUR DE ROUTAGE GÉNÉRIQUE NON
```

## 1. Statut

```text
AUTORISATION GOUVERNANTE, CONSERVÉE
= 94-HANDOFF-ROUTING-BOUNDED-EXPERIMENTAL-C2-SPECIFICATION-AUTHORIZATION.md
  blob   51ee53e04d6fba1d13e8e0fc255c6580e5c09c3c
  sha256 126fe9e5869dca45360fafa6e9f575a0a3dee767532bfb58d80b393931f7a22b

PROTOCOLE D'ACQUISITION DE PREUVE, CONSERVÉ ET NON AMENDÉ
= 93-HANDOFF-ROUTING-POST-MISSION020-RETURN-TO-M005-EMPIRICAL-FRONTIER-DIRECTION-AND-EVIDENCE-ACQUISITION-PROTOCOL-FREEZE.md
  blob 56928bd87c0442bfc84539fa0d75ab8e223034b1

TÊTE CANONIQUE DE DÉPART
= 0b3ed88766be51cb63967da2f9a7a9c2c9486561
  arbre 11cd26f1d5e4ee2c5a425350abea880431dd4e24

DÉCISIONS AVANT MATÉRIALISATION
= 69 RATIFIÉES / 0 EN ATTENTE

MISSION 021          AUCUNE AU DÉPART
AGENT CCR LAB #63    NON ALLOUÉ AU DÉPART
```

## 2. Distinction gouvernante

```text
FIGER LA RÈGLE
≠ EXÉCUTER LA RÈGLE
```

```text
CONTRAT D'EXPÉRIENCE STATIQUE (gelé ici)
= sémantique de candidat · paramètres de run · règle D-C · règle J-C
  · schéma du paquet · portes pré-C2 · portes de dépêche · ligne de base
  · contrat d'observation · règles d'arrêt

SORTIE D'EXPÉRIENCE D'EXÉCUTION (produite plus tard, jamais ici)
= résultat J-C effectif · trace D-C effective · derived-handoff.json effectif
  · preuve RC2 / RC3 / RC4 effective
```

## 3. Lignée d'autorisation

État gouvernant ratifié par l'humain, consigné tel quel :

```text
AUTORITÉ 94                                     CLOSE / GOUVERNANTE
EXP-C2-C                                        POSITIVEMENT QUALIFIÉ
SÉMANTIQUE D'INSTANCE DE RUN EXP-C2-C           PASS
PROBE_JUSTIFICATION                             PASS
JUSTIFICATION DE MISSION D'EXÉCUTION            ÉTABLIE, SOUS RÉSERVE DU CYCLE
                                                DE VIE RATIFIÉ (section 29)
ADOPTION DE SÉMANTIQUE PRODUIT                  NON
IMPLÉMENTATION PRODUIT                          NON
```

EXP-C2-C est un candidat expérimental au sens de l'autorité 94 : sa sémantique
matérielle est explicitement spécifiée, parce que C2 ne pouvait être dérivée
de la sémantique durable existante seule. La présente autorité en fige la
forme exécutable.

## 4. Autorisation d'exécution

```text
L'EXÉCUTION DE L'EXPÉRIENCE EXP-C2-C EST AUTORISÉE
= SEULEMENT APRÈS QUE CE CONTRAT STATIQUE EST DURABLEMENT MATÉRIALISÉ
  (commit T1 poussé en avance rapide)
= ET VÉRIFIÉ (identités des artefacts statiques recalculées sur le commit)

= SOUS CE CONTRAT GELÉ, ET SOUS LUI SEUL
```

L'exécution comprend, dans cet ordre : le C2 pré-dépêche d'exécution (portes
pré-C2, J-C, D-C, production et persistance du paquet), la matérialisation et
la vérification de la mission 021, l'allocation de l'AGENT CCR LAB #63, la
transmission manuelle de la mission 021 gelée, l'exécution par #63, la
persistance du résultat par l'orchestration, le panneau C et les observations.

Toute réalisation technique nécessaire à l'exécution — un harnais jetable, hors
du dépôt, qui n'applique que les règles gelées ici — reste minimale,
réversible, non engageante pour le produit et limitée à l'acquisition de preuve
(autorité 93 § 43).

## 5. Sémantique EXP-C2-C

Sémantique nouvelle, locale à l'expérience :

```text
S1   C2_HANDOFF_PACKET
     le paquet durable, local à l'expérience, qui porte H pour la sonde

S2   NEXT_CONTROL_STAGE
     l'acteur / l'étape suivant qui reçoit le contrôle après la qualification
     C2 pré-dépêche réussie

S3   RETURN_DESTINATION
     le localisateur durable exact où l'exécutant retourne sa Result Instance

S4   STAGE_ORDERING_DEPENDENCY
     la séquence explicite de contrôle / durabilité à l'échelle de la sonde

S5   PERSISTENCE_OWNERSHIP
     l'acteur responsable de l'enregistrement durable d'un artefact nommé

S6   EXPERIMENTAL_C2_JOIN_IDENTITY
     (candidate_id, probe_id)
```

```text
LOCALE À L'EXPÉRIENCE                          OUI
SÉMANTIQUE PRODUIT                             NON
SÉMANTIQUE CCR GÉNÉRIQUE                       NON
RÉUTILISABLE SANS AUTORITÉ NOUVELLE            NON
```

## 6. Identité de run statique

```text
CANDIDATE_ID         EXP-C2-C
PROBE_ID             A94-C2-PROBE-001
MISSION_LOGICAL_ID   021-handoff-routing-c2-probe

IDENTITÉ DE MISSION
= IDENTIFIANT LOGIQUE SEULEMENT
≠ blob Git de mission.json
≠ SHA-256 de mission.json
```

## 7. Paramètres de run gelés

Bloc lisible mécaniquement. Une ligne par paramètre, sous la forme
`PARAM <clé> = <valeur>`. La règle J-C lit ce bloc.

```text
PARAM candidate_id = EXP-C2-C
PARAM probe_id = A94-C2-PROBE-001
PARAM mission_logical_id = 021-handoff-routing-c2-probe
PARAM freeze_authority_path = 95-HANDOFF-ROUTING-EXP-C2-C-EXPERIMENTAL-TRANSACTION-FREEZE.md
PARAM verification_target_path = 94-HANDOFF-ROUTING-BOUNDED-EXPERIMENTAL-C2-SPECIFICATION-AUTHORIZATION.md
PARAM verification_target_blob = 51ee53e04d6fba1d13e8e0fc255c6580e5c09c3c
PARAM verification_target_sha256 = 126fe9e5869dca45360fafa6e9f575a0a3dee767532bfb58d80b393931f7a22b
PARAM return_destination = missions/021-handoff-routing-c2-probe/result.json
PARAM observation_destination = missions/021-handoff-routing-c2-probe/observations.json
PARAM baseline_manifest_path = missions/021-handoff-routing-c2-probe/baseline-manifest.json
PARAM observation_contract_path = missions/021-handoff-routing-c2-probe/observation-contract.json
PARAM derived_handoff_path = missions/021-handoff-routing-c2-probe/derived-handoff.json
PARAM next_control_stage = EXECUTOR_DISPATCH
PARAM expected_stage_chain = C2_INPUT_FREEZE < C2_JOIN < C2_DERIVATION < HANDOFF_PERSISTENCE < PANEL_A < PANEL_B < EXECUTOR_DISPATCH < EXECUTOR_RETURN < RESULT_PERSISTENCE < PANEL_C
PARAM persistence_ownership = ORCHESTRATION | EXECUTOR_RESULT_INSTANCE | PANEL_C
PARAM executor_addressee = AGENT_CCR_LAB_63
PARAM candidate_spec_path = missions/021-handoff-routing-c2-probe/candidate-spec.json
PARAM candidate_spec_blob = 9ae9eb5ec975d29a3c9e07028f1899bf9583f7e6
PARAM candidate_semantic_fingerprint = 6f40edcde8ba82b43784c66dc101bf6e9b819437620d90d1832be9e4ebb4fd61
PARAM baseline_manifest_blob = 477d76188a591d5d1bd2f492c5b9bea0e29d76cc
PARAM observation_contract_blob = 05f962d67c800a390df54d6438526ead03dc476f
```

`persistence_ownership` se lit `acteur | cible | doit_précéder`.
L'empreinte sémantique est le SHA-256 hexadécimal du JSON canonique (clés
triées récursivement, sans espace) de la valeur `semantics` de
candidate-spec.json.

## 8. Chemins exacts

```text
STATIQUES — créés par le commit T1
  missions/021-handoff-routing-c2-probe/candidate-spec.json
  missions/021-handoff-routing-c2-probe/baseline-manifest.json
  missions/021-handoff-routing-c2-probe/observation-contract.json

D'EXÉCUTION — jamais avant l'autorisation d'expérience
  missions/021-handoff-routing-c2-probe/derived-handoff.json
  missions/021-handoff-routing-c2-probe/observations.json

MISSION 021 — après le paquet
  missions/021-handoff-routing-c2-probe/mission.json
  missions/021-handoff-routing-c2-probe/envelope.md

EXÉCUTANT
  missions/021-handoff-routing-c2-probe/result.json
```

## 9. Tâche exacte de l'exécutant

L'exécutant lit les octets exacts de la cible de vérification commise et
rapporte ces six faits gelés :

```text
1  DÉCISION HUMAINE               = AUTHORIZE_BOUNDED_EXPERIMENTAL_C2_SPECIFICATION
2  ADOPTION DE SÉMANTIQUE PRODUIT  = NO
3  IMPLÉMENTATION                  = NO
4  EXÉCUTION D'EXPÉRIENCE          = NO
5  MISSION 021                     = NONE, À L'ÉTAT CIBLE DE L'AUTORITÉ 94
6  AGENT #63                       = UNALLOCATED, À L'ÉTAT CIBLE DE L'AUTORITÉ 94
```

Règles :

```text
tâche substantielle en lecture seule
octets exacts gelés de l'autorité 94
aucune inférence depuis un PROGRAM-STATE ultérieur
aucune réinterprétation de l'état courant comme état cible historique
seul result.json peut être écrit par l'exécutant
```

La valeur attendue de chaque fait ci-dessus décrit la cible ; elle n'est pas
présumée. L'exécutant rapporte ce qu'il lit, dans des domaines fermés qui
admettent NOT_ESTABLISHED.

## 10. Cible de vérification

```text
CIBLE    94-HANDOFF-ROUTING-BOUNDED-EXPERIMENTAL-C2-SPECIFICATION-AUTHORIZATION.md
BLOB     51ee53e04d6fba1d13e8e0fc255c6580e5c09c3c
SHA-256  126fe9e5869dca45360fafa6e9f575a0a3dee767532bfb58d80b393931f7a22b
```

## 11. Portes pré-C2

```text
G-C2-01  AUTHORITY_94_IDENTITY_MATCH           attendu PASS
         blob et SHA-256 de la cible de vérification commise
         = PARAM verification_target_blob / _sha256
         = candidate-spec.json run_parameters

G-C2-02  CANDIDATE_SPEC_IDENTITY_MATCH         attendu PASS
         blob commis de candidate-spec.json = PARAM candidate_spec_blob
         ET empreinte sémantique recalculée = PARAM candidate_semantic_fingerprint

G-C2-03  RUN_PARAMETER_COMPLETENESS            attendu PASS
         chaque clé de required_run_parameters présente, non vide et égale
         dans candidate-spec.json et dans le bloc PARAM

G-C2-04  BASELINE_MANIFEST_IDENTITY_MATCH      attendu PASS
         blob commis de baseline-manifest.json = PARAM baseline_manifest_blob

G-C2-05  OBSERVATION_DESTINATION_FIXED         attendu PASS
         destination identique dans candidate-spec.json, PARAM et
         observation-contract.json ; blob commis d'observation-contract.json
         = PARAM observation_contract_blob ; fichier de destination absent
         avant C2_JOIN
```

```text
UNE PORTE PRÉ-C2 QUI DÉPEND D'UNE SORTIE POST-C2
= INTERDITE

entrées interdites : blob du paquet · blob de mission.json · blob de
envelope.md · résultat de l'exécutant
```

## 12. Règle J-C

```text
CLÉ J-C
= (EXP-C2-C, A94-C2-PROBE-001)
```

J-C exige la correspondance exacte de :

```text
identité de candidat                  candidate-spec = PARAM = clé
empreinte sémantique de candidat      recalculée = PARAM
identité de sonde                     candidate-spec = PARAM = clé
identité de l'autorité de gel         blob commis de la présente autorité
                                      = blob observé de la preuve de la décision
                                      handoff-routing-exp-c2-c-experimental-
                                      transaction-freeze-ratified (PROGRAM-STATE)
identité de la cible de vérification  blob et SHA-256 commis = PARAM = candidate-spec
identité du manifeste de ligne de base blob commis = PARAM
destination d'observation             candidate-spec = PARAM = observation-contract
destination de retour                 candidate-spec = PARAM = observation-contract
chaîne d'étapes attendue              candidate-spec = PARAM
propriété de la persistance           candidate-spec = PARAM
issues des portes pré-C2 requises     G-C2-01 … G-C2-05 = PASS
```

```text
MANQUANT / NON CONCORDANT / NON PASS
→ JOIN = NO
→ H = NONE
→ STOP
```

Chaque comparaison est consignée : champ, source attendue, source observée,
valeurs, égalité. La trace J-C est identifiée par le SHA-256 de son JSON
canonique.

## 13. Règle D-C

```text
D-C NE S'EXÉCUTE QU'APRÈS J-C = SUCCESS
```

D-C produit :

```text
H = {
  NEXT_CONTROL_STAGE        : EXECUTOR_DISPATCH
  RETURN_DESTINATION        : missions/021-handoff-routing-c2-probe/result.json
  STAGE_ORDERING_DEPENDENCY : C2_INPUT_FREEZE < C2_JOIN < C2_DERIVATION
                              < HANDOFF_PERSISTENCE < PANEL_A < PANEL_B
                              < EXECUTOR_DISPATCH < EXECUTOR_RETURN
                              < RESULT_PERSISTENCE < PANEL_C
  PERSISTENCE_OWNERSHIP     : { actor: ORCHESTRATION,
                                target: executor Result Instance,
                                must_complete_before: PANEL_C }
}
```

Chaque champ de H est pris dans run_parameters de candidate-spec.json, déjà
égal au bloc PARAM par J-C. La trace D-C consigne, pour chaque champ, sa
source et sa valeur ; elle est identifiée par le SHA-256 de son JSON canonique.

```text
AUCUN OPÉRATEUR NE CHOISIT UNE VALEUR DE H PENDANT L'EXÉCUTION
```

## 14. Schéma du paquet

```text
CHEMIN   missions/021-handoff-routing-c2-probe/derived-handoff.json
GENRE    C2_HANDOFF_PACKET

CHAMPS, DANS CET ORDRE
  packet_kind · candidate_id · probe_id · mission_logical_id
  governing_authority { path, blob, sha256 }            — présente autorité
  verification_target { path, blob, sha256 }            — autorité 94
  candidate_spec · baseline_manifest · observation_contract { path, blob }
  join { key, outcome, trace_sha256 }
  derivation { outcome, trace_sha256 }
  h_next_control_stage
  h_return_destination
  h_stage_ordering_dependency        chaîne jointe par « < »
  h_persistence_owner_actor
  h_persistence_owner_target
  h_persistence_must_complete_before

SÉRIALISATION   JSON, indentation 2, LF, LF final

DÉPENDANCES INTERDITES
  blob / SHA-256 de mission.json · blob / SHA-256 de envelope.md · result.json
```

H est porté à plat par les six champs `h_*`, afin qu'un prédicat de porte
OBJECT_FIELD à un seul niveau (autorité 14 § 8) puisse lire chacun d'eux.

## 15. Portes post-C2 / pré-dépêche

```text
G-DISPATCH-01  DERIVED_HANDOFF_PERSISTED
               le paquet est suivi au HEAD, son blob commis = blob consigné

G-DISPATCH-02  PACKET_IDENTITY_MATCHES_MISSION_REFERENCE
               la référence du paquet dans mission.json porte le blob commis

G-DISPATCH-03  ENVELOPE_PRESERVES_PACKET_REFERENCE
               l'enveloppe rendue contient le chemin et le blob du paquet ;
               couverture de rendu complète

G-DISPATCH-04  RESULT_ABSENT_BEFORE_EXECUTOR_START
               result.json absent du HEAD et de la copie de travail

G-DISPATCH-05  EXECUTOR_COMMIT_PUSH_PERSISTENCE_FORBIDDEN
               mission.json interdit COMMIT, PUSH, PERSIST_RESULT_INSTANCE et
               porte sc-no-persistence-by-executor
```

```text
UNE PORTE ÉCHOUE → ARRÊT DUR → AUCUNE ALLOCATION DE #63
TOUTES PASS      → MISSION 021 GELÉE ET VÉRIFIÉE → #63 ALLOUÉ
```

## 16. Ordonnancement des étapes

Chaîne H, gelée :

```text
C2_INPUT_FREEZE       commit T1 poussé — le présent contrat statique
C2_JOIN               portes pré-C2 puis J-C, en exécution
C2_DERIVATION         D-C, en exécution
HANDOFF_PERSISTENCE   commit T2 poussé : paquet + observations d'exécution
PANEL_A               console, route /api/program-state, sur l'état durable T2
PANEL_B               console, route /api/mission, sur les octets exacts de la
                      mission 021 que le commit T3 fige
EXECUTOR_DISPATCH     transmission manuelle de l'enveloppe gelée à un #63 frais
EXECUTOR_RETURN       retour de #63 : result.json seul
RESULT_PERSISTENCE    commit de persistance du seul result.json, par
                      l'orchestration
PANEL_C               console, route /api/result, sur le résultat COMMIS
```

Étapes auxiliaires hors de H, à leur position :

```text
HANDOFF_PERSISTENCE < PANEL_A
  < matérialisation de la mission 021 (mission.json, envelope.md), validation,
    couverture de rendu, portes G-DISPATCH-01..05
  < PANEL_B
  < commit T3 : mission 021 + observations PANEL_A / PANEL_B + état courant ;
    égalité des blobs observés au PANEL_B et des blobs commis vérifiée
  < EXECUTOR_DISPATCH
```

Les panneaux sont observés par les routes HTTP en lecture seule de la console
locale (tooling/console/server.mjs, boucle locale). La chronologie des commits
Git n'est pas convertie en sémantique de routage (autorité 93 § 22) ; l'ordre
se prouve par les identités consignées.

## 17. Propriété de la persistance

```text
ACTEUR       ORCHESTRATION (AGENT CCR LAB #1)
CIBLE        missions/021-handoff-routing-c2-probe/result.json,
             Result Instance de l'exécutant
AVANT        PANEL_C
```

Porte de persistance, avant le commit de persistance :

```text
result.json EXISTE au chemin de retour
aucun autre chemin créé / modifié / supprimé par l'exécutant
mission.json · envelope.md · derived-handoff.json · observations.json
  INCHANGÉS depuis le commit T3
PROGRAM-STATE.json · README.md · autorités · tooling/** INCHANGÉS
octets de result.json : UTF-8, LF seulement, CR 0, NUL 0, LF final
mesurer : taille · SHA-256 · blob Git · CR · LF · NUL
aucun PASS sémantique exigé avant persistance
```

```text
PERSISTER LE RETOUR RÉEL DE L'EXÉCUTANT
≠ QUALIFIER CE RETOUR

AUCUN OCTET RETOURNÉ N'EST ÉDITÉ
```

Motif du LF exigé : le dépôt applique core.autocrlf sur cette machine et
missions/** ne porte pas d'attribut eol ; un résultat CRLF ne serait pas
persistable octet pour octet. Un CR présent est un arrêt dur, non une
réparation.

## 18. Frontière d'écriture de l'exécutant

```text
ACTEUR LOGIQUE              AGENT CCR LAB #63, instance fraîche
OPÉRATION SUBSTANTIELLE     exécuter la mission 021 gelée, et elle seule
ÉCRITURE PERMISE            missions/021-handoff-routing-c2-probe/result.json
AUTRES ÉCRITURES            INTERDITES
COMMIT / PUSH               INTERDITS
MUTATION DE PROGRAM-STATE   INTERDITE
MUTATION D'AUTORITÉ         INTERDITE
MUTATION DE mission.json, envelope.md, derived-handoff.json   INTERDITE
RÉPARATION                  INTERDITE
MAUVAIS CONTEXTE            ARRÊT — pas de cd, re-root, réparation, checkout
```

L'exécutant consigne explicitement :

```text
paquet consommé                           YES / NO / NOT_ESTABLISHED
reconstruction C2 manuelle requise        YES / NO
chemin de retour effectif
identité de la cible de vérification employée
les six faits
toute preuve du contrat de retour
```

## 19. Frontière d'écriture et de persistance de l'orchestration

```text
T1            présente autorité · candidate-spec.json · baseline-manifest.json
              · observation-contract.json · PROGRAM-STATE.json · README.md
T2            derived-handoff.json · observations.json
T3            mission.json · envelope.md · observations.json · PROGRAM-STATE.json
              · README.md
PERSISTANCE   result.json SEUL, octets retournés inchangés
FINAL         observations.json · PROGRAM-STATE.json · README.md
```

```text
L'ORCHESTRATION N'ÉCRIT JAMAIS DANS result.json
L'EXÉCUTANT N'ÉCRIT JAMAIS DANS observations.json
```

## 20. Portée de la ligne de base

```text
MANIFESTE   missions/021-handoff-routing-c2-probe/baseline-manifest.json
            blob 477d76188a591d5d1bd2f492c5b9bea0e29d76cc
LIGNE DE BASE   MISSION 001, déjà qualifiée (autorités 34 à 37, 47, 49 ;
                missions/001 ; result003), sources épinglées par blob
```

Dimensions de comparaison admises, et elles seules :

```text
D1  exécutant frais
D2  tâche d'exécutant en lecture seule
D3  une seule Result Instance
D4  l'exécutant ne persiste aucun état Git
D5  destination de retour fixée avant la dépêche
D6  contrôle pré-dépêche fixé
D7  propriétaire de la persistance fixé
D8  résultat durable avant le panneau C
D9  aucune reconstruction post-gel des valeurs C2
```

Exclues explicitement :

```text
équivalence de tâche substantielle · équivalence de comportement produit
équivalence de routage générique · équivalence générique d'effort opérateur
équivalence de contenu de décision historique
```

```text
RC8 ET L-2 EXIGENT UNE PREUVE DE RUN POSITIVE
≠ LA SIMPLE ABSENCE D'ERREUR
```

## 21. Contrat d'observation

```text
CONTRAT     missions/021-handoff-routing-c2-probe/observation-contract.json
            blob 05f962d67c800a390df54d6438526ead03dc476f
DESTINATION missions/021-handoff-routing-c2-probe/observations.json
PRODUCTEUR  ORCHESTRATION (AGENT CCR LAB #1) ; l'exécutant n'y écrit jamais
```

Sections requises : identity · pre_c2 · handoff · pre_dispatch ·
executor_return · persistence · panel_c · rc · u · l · ep · discipline.

```text
OBSERVATION REQUISE MANQUANTE
→ AFFIRMATION DÉPENDANTE = NOT_ESTABLISHED
→ JAMAIS UN PASS SILENCIEUX
→ JAMAIS CONVERTIE EN NO
```

## 22. Contrat de mesure RC1..RC8

La chaîne gouvernante est celle de l'autorité 52 § B.2 ; les exigences
d'observation sont celles de l'autorité 93 § 11 à § 19. Domaine : YES / NO /
NOT_ESTABLISHED.

```text
RC1  YES si la trace J-C montre chaque source employée — autorité 94, présente
         autorité, candidate-spec, ligne de base, contrat d'observation —
         égale à son identité commise, ET si #63 rapporte l'identité de la cible
         de vérification égale au blob de l'autorité 94
     NO  si une substitution ou une non-concordance est observée

RC2  YES si D-C s'est exécutée après J-C = SUCCESS, avec une trace persistée
         qui source chaque champ de H dans les paramètres gelés, sans choix
         d'opérateur
     NO  si une valeur de H diffère de la règle ou a été choisie

RC3  YES si J-C s'est exécutée sur les onze champs, issue SUCCESS, trace
         persistée
     NO  si J-C n'a pas été effectuée, ou a accepté un champ manquant ou non
         concordant

RC4  YES si derived-handoff.json a été produit par D-C, persisté (commit T2),
         et porte exactement H
     NO  si le paquet est absent ou ne provient pas de D-C

RC5  YES si mission.json référence le paquet avec son blob commis
         (G-DISPATCH-02), si l'enveloppe rend cette référence (G-DISPATCH-03),
         et si l'enveloppe transmise est l'enveloppe commise
     NO  en cas de non-concordance

RC6  YES si #63 rapporte paquet consommé = YES, avec le blob observé du paquet
         égal au blob commis, les valeurs H rapportées égales au paquet, et le
         chemin de retour effectif égal à h_return_destination
     NO  si #63 rapporte le paquet non consommé ou écrit ailleurs

RC7  YES si aucune reconstruction manuelle de valeurs C2 n'est observée :
         #63 rapporte NO, et l'orchestration n'observe ni reconstruction
         post-gel, ni choix de H, ni rétablissement de next_action, ni autorité
         de réparation
     NO  si l'un d'eux survient

RC8  YES si, pour EP-02, EP-03 et EP-04, chaque dimension associée du manifeste
         porte une preuve de run positive de suppression dans la sonde bornée
     NO  si un événement de charge de la ligne de base se reproduit

SINON  NOT_ESTABLISHED
```

```text
PRODUIT ≠ PROPAGÉ ≠ CONSOMMÉ ≠ CHARGE SUPPRIMÉE
TRACE DE DURABILITÉ TECHNIQUE ≠ PREUVE SÉMANTIQUE          (autorité 93 § 25)
```

## 23. Cibles U1 / U2 / U3

```text
U1   LOCALE : LOCAL_SUPPORT si la destination et l'ordre fixés avant la
     dépêche sont effectivement portés et observés dans ce run ;
     GENERIC_U1_STATUS : NOT_ESTABLISHED par construction — un seul run
     (autorité 93 § 32)

U2   ALREADY_RATIFIED_INTENT_RECORDED si chaque valeur du paquet est
     identique à une valeur gelée ici avant l'exécution, sans interprétation
     consignée ; RESIDUAL_MANUAL_RECONSTRUCTION si une valeur a dû être
     reconstruite ou choisie ; sinon NOT_ESTABLISHED

U3   FAITHFULLY_CARRIED_IN_CONCRETE_PROBE si chaque étape pré-dépêche est
     portée par des constructions v0 (références, portes, effets, contraintes),
     validée, rendue sans omission et consommée par #63 par portes typées ;
     NOT_FAITHFULLY_CARRIED_IN_CONCRETE_PROBE si une étape a exigé une prose
     hors bande ; sinon NOT_ESTABLISHED
```

## 24. Cibles L-2 / L-3

```text
L-2   ADDRESSED seulement par l'observation concrète de ce run et la
      comparaison bornée à la ligne de base, avec preuve positive par dimension

L-3   le protocole est gelé ; son adéquation à l'exécution est ADDRESSED si
      toutes les clés requises du contrat d'observation sont remplies par des
      preuves, sinon NOT_ESTABLISHED avec la liste exacte des manques
```

## 25. Observations EP-02 / EP-03 / EP-04

```text
EP-02  unités EP02-A-1..3 · dimensions D5, D6, D9
       suppression observée : contrôle pré-dépêche et destination de retour
       fixés au gel, portés par le paquet, aucune supersession, aucun
       rétablissement de next_action

EP-03  unités EP03-A-1..3 · dimensions D5, D6, D9
       suppression observée : destination d'observation fixée avant la
       dépêche, aucun blocage avant exécution, aucune autorité de réparation

EP-04  unités EP04-A-1..2 · dimensions D7, D8, D9
       suppression observée : propriétaire et ordre de persistance fixés avant
       la dépêche, résultat commis avant le panneau C, aucune réparation
```

Domaine : REMOVED_IN_BOUNDED_RUN / NOT_REMOVED / NOT_ESTABLISHED. Aucune
suppression générique n'est revendiquée hors de la sonde bornée.

## 26. Arrêts

```text
porte pré-C2 ≠ PASS                         → ARRÊT DUR, ni J-C, ni D-C, ni H
J-C ≠ SUCCESS                               → ARRÊT DUR, H = NONE
D-C ne produit pas exactement H             → ARRÊT DUR
validation / rendu / couverture de M021 KO  → ARRÊT DUR, aucune allocation
porte G-DISPATCH ≠ PASS                     → ARRÊT DUR, aucune allocation de #63
retour de #63 non conforme à la frontière   → ARRÊT DUR, aucune persistance
porte de persistance KO                     → ARRÊT DUR, aucun panneau C
origin/main ≠ parent attendu avant un push  → ARRÊT DUR, aucun nouvel essai
décision sémantique nouvelle requise        → ARRÊT, consigné
reconstruction d'une règle depuis la prose  → ARRÊT, consigné
mutation sémantique requise                 → ARRÊT, consigné
destination à changer matériellement        → ARRÊT, consigné
autorité à élargir                          → ARRÊT, consigné
observation requise impossible              → NOT_ESTABLISHED, consigné
```

Chaque arrêt préserve la preuve déjà acquise et est consigné dans
observations.json lorsque ce fichier existe.

## 27. Règle de non-réparation

```text
AUCUNE RÉPARATION EN COURS DE RUN
AUCUN NOUVEL ESSAI APRÈS UNE PRÉCONDITION CHANGÉE
AUCUNE ÉDITION D'UN OCTET RETOURNÉ PAR L'EXÉCUTANT
AUCUNE MUTATION DE Q-CAND-A, D'EXP-C2-A OU D'EXP-C2-B
UN ÉCHEC EST UNE PREUVE, PAS UN DÉFAUT À CORRIGER
```

## 28. Règle de continuation déterministe

```text
CHAQUE PHASE DONT TOUTES LES PORTES PASSENT
→ LA PHASE SUIVANTE COMMENCE SANS PORTE HUMAINE INTERMÉDIAIRE

RETOUR À L'ORCHESTRATEUR SEULEMENT SUR
  A  PAQUET DE RETOUR EXPÉRIMENTAL COMPLET
  B  BLOCAGE DUR DE CONTRAT / D'ARRÊT / DE SÛRETÉ
  C  CHOIX MATÉRIEL NOUVEAU NON DÉJÀ GOUVERNÉ
```

```text
TRANSMISSION MANUELLE DE LA MISSION 021 À #63
= TRANSPORT SEULEMENT
≠ DÉCISION HUMAINE · ≠ CONTRE-EXPERTISE · ≠ PORTE DE GOUVERNANCE
```

## 29. Règle de cycle de vie

```text
J-C, D-C ET LA PRODUCTION DE H
= ÉVÉNEMENTS D'EXÉCUTION, APRÈS LE GEL
≠ CONTENU DU PRÉSENT GEL
```

Ordre obligatoire :

```text
1   matérialiser la présente autorité et le contrat statique
2   vérifier le contrat statique
3   l'expérience devient autorisée sous ce contrat
4   exécuter le C2 pré-dépêche : J-C, D-C, H ; persister la preuve
5   matérialiser la mission 021 avec l'identité effective du paquet
6   vérifier la mission 021
7   seulement alors allouer l'AGENT CCR LAB #63
8   transmettre manuellement la mission 021 gelée exacte à un #63 frais
9   #63 exécute la mission 021 seule
10  l'orchestration persiste result.json avant le panneau C
11  panneau C et observations
12  un paquet de retour expérimental factuel complet
```

```text
CONTRE-EXPERTISE INDÉPENDANTE
= APRÈS L'ÉTAPE 12
= NON EFFECTUÉE PAR LA TRANSACTION
```

## 30. Discipline Git

```text
T1           docs: freeze exp-c2-c experimental transaction
T2           experiment: produce exp-c2-c handoff packet
T3           experiment: freeze mission 021 executor leg
PERSISTANCE  persistance du seul result.json
FINAL        experiment: complete exp-c2-c observations
```

```text
un commit borné par phase, poussée ordinaire en avance rapide
avant chaque poussée : origin/main = parent attendu
AUCUN force · merge · rebase · pull de réparation · amend · tag · release
AUCUNE réécriture d'historique · AUCUN nouvel essai après précondition changée
```

## 31. Frontière produit

```text
ADOPTION PRODUIT                      NON
IMPLÉMENTATION PRODUIT                NON
MOTEUR DE ROUTAGE GÉNÉRIQUE           NON
SÉMANTIQUE DE PROGRAMME               NON
SUCCÈS DE L'EXPÉRIENCE                ≠ SÉLECTION DE CONCEPTION PRODUIT
COMPOSANT SÉMANTIQUE NOUVEAU          → CANDIDAT NOUVEAU / RÉVISÉ
HÉRITAGE AUTOMATIQUE DE CONFORMITÉ    AUCUN
HÉRITAGE AUTOMATIQUE DE STATUT RC     AUCUN
```

## 32. Ce que ce document ne fait pas

```text
IL N'EXÉCUTE NI J-C, NI D-C
IL NE PRODUIT PAS H
IL NE CRÉE NI derived-handoff.json, NI observations.json
IL NE CRÉE NI mission.json, NI envelope.md, NI result.json
IL N'ALLOUE PAS L'AGENT CCR LAB #63
IL N'ADOPTE AUCUNE SÉMANTIQUE PRODUIT
IL N'IMPLÉMENTE AUCUN PRODUIT
IL N'AMENDE NI L'AUTORITÉ 93, NI L'AUTORITÉ 94
IL NE ROUVRE AUCUNE DES MISSIONS 006 À 020
IL NE MODIFIE AUCUNE AIRE D'OUTILLAGE, NI .gitattributes
```

## 33. État matérialisé

```text
AUTORITÉ 95                                  GEL DU CONTRAT STATIQUE EXP-C2-C
CONTRAT STATIQUE                             candidate-spec.json · baseline-manifest.json
                                             · observation-contract.json
EXÉCUTION DE L'EXPÉRIENCE                    AUTORISÉE APRÈS GEL DURABLE ET
                                             VÉRIFICATION, SOUS CE CONTRAT
J-C / D-C / H                                NON ENCORE EXÉCUTÉS
MISSION 021                                  NON ENCORE MATÉRIALISÉE
AGENT CCR LAB #63                            NON ENCORE ALLOUÉ
ADOPTION / IMPLÉMENTATION PRODUIT            NON / NON

NOUVELLE DÉCISION HUMAINE                    1
DÉCISIONS RATIFIÉES / EN ATTENTE             70 / 0

AUTORITÉS RACINE NUMÉROTÉES                  95 · 00..95 SANS 18
AIRES D'OUTILLAGE                            4

SUIVANT
= EXÉCUTER LA TRANSACTION EXP-C2-C COMPLÈTE SOUS L'AUTORITÉ 95,
  SANS PORTE HUMAINE INTERMÉDIAIRE, SAUF ARRÊT DUR OU CHOIX MATÉRIEL NOUVEAU
```
