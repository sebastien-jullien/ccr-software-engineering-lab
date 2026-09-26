# Handoff / routage — autorité normative de Mission Object V1 et du contrat P-HR-01

```text
CE DOCUMENT MATÉRIALISE
= L'AUTORITÉ NORMATIVE UNIQUE DE MISSION OBJECT V1
= LE CONTRAT OPTIONNEL P-HR-01 (handoff_contract) QU'ELLE PORTE

SON IDENTITÉ REPO_PATH + GIT_BLOB
= LA CLÉ DE RECONNAISSANCE V1 (CAS D)

IL N'AJOUTE AUCUNE SÉMANTIQUE À L'AUTORITÉ 98, CORRIGÉE PAR L'AUTORITÉ 99
IL EST LA MATÉRIALISATION DE REPRÉSENTATION EXIGÉE PAR L'AUTORITÉ 100 § 7
```

## 1. Statut et lignée

```text
AUTORITÉ 98 — SPÉCIFICATION NORMATIVE FINALE DE P-HR-01
= 98-HANDOFF-ROUTING-P-HR-01-FINAL-NORMATIVE-SPECIFICATION-READINESS-AND-BOUNDED-IMPLEMENTATION-AUTHORIZATION.md
  blob   fe4be140f6a90e84d25f14119889b7642989f1d7
  sha256 79c68ba8354376ca52d7ab818577ccd83c82542c81b184657652537c89479b3b
= GOUVERNANTE, SAUF SA RÈGLE DE DISCRIMINATION POUR LE V0 HISTORIQUE

AUTORITÉ 99 — CORRECTION DE COMPATIBILITÉ C-1 RAFFINÉE
= 99-HANDOFF-ROUTING-P-HR-01-LEGACY-V0-RECOGNITION-COMPATIBILITY-CORRECTION.md
  blob   bc94cafba19d38de88e340c5168c37a5f89258be
  sha256 2eb07fcdb933cffcd29c636f80eb192d2aaf1194e115d8802bb159b5cd1620b1
= GOUVERNANTE

AUTORITÉ 100 — GEL DE LA TRANSACTION D'IMPLÉMENTATION
= 100-HANDOFF-ROUTING-P-HR-01-IMPLEMENTATION-TRANSACTION-FREEZE.md
  blob   74c08d3e562eaa348f8a975e94b03a4dd1ac710d
  sha256 69ac936bde6bb325c259ae83bfa9887ceb8e728be196e39e6ccfc2bfd383d59d

AUTORITÉ V0 HISTORIQUE ÉPINGLÉE
= 14-TOOLING-EXPERIMENT-002-MISSION-OBJECT-V0.md
  blob   7d634c855ab9de8c66a21c134b03de8f118c3de4
  sha256 3db7c7298a4fc1109a99ac832770899d3fbb74a38acb14253f1fe7f578581912

AUTORITÉ RESULT INSTANCE V0
= 23-TOOLING-EXPERIMENT-003-RESULT-INSTANCE-V0.md
  blob   1676b3de4546b40a801d0a400b4c47ddd9b82062
= INCHANGÉE · LE RETOUR D'UNE MISSION V1 RESTE UN RESULT INSTANCE V0
```

Chemin : convention technique du dépôt. L'autorité V1 prend la forme d'une
autorité racine numérotée ; elle prend le premier numéro libre au HEAD de gel
127b69dd5f09d9f6997ce864138a2a40e210c0db, soit 101 (autorité 100 § 7). Aucune
autorité existante n'est modifiée.

## 2. Identité de reconnaissance V1

```text
REPO_PATH   101-HANDOFF-ROUTING-P-HR-01-MISSION-OBJECT-V1.md
GIT_BLOB    identité Git-blob des octets exacts de CE document
```

Un document ne peut pas porter sa propre empreinte : la valeur GIT_BLOB n'est
pas écrite ici. Elle est l'identité mécanique de ces octets, et l'outillage V1
la porte comme SEULE identité d'autorité V1 supportée.

```text
TOUTE MODIFICATION DE CE DOCUMENT CHANGE SON GIT_BLOB, DONC LA CLÉ
UN OBJET QUI DÉSIGNE UNE AUTRE IDENTITÉ N'EST PAS UN MISSION OBJECT V1 → CAS E
```

## 3. Relation de V1 à V0

```text
MISSION OBJECT V1
= SÉMANTIQUE V0 DES CHAMPS HÉRITÉS
  + IDENTITÉ DE REPRÉSENTATION V1
  + handoff_contract OPTIONNEL
  + RESPONSABILITÉS INTER-ACTEURS DE P-HR-01
```

Les champs hérités sont les seize éléments de premier niveau de l'autorité 14 :

```text
identity · context · references · effects · content_requirements ·
procedure · gates · branches · stop_rules · human_authority ·
evidence_requirements · terminal_outcomes · return_contract ·
next_consequences · standing_constraints · terminal
```

```text
POUR LES CHAMPS HÉRITÉS
SÉMANTIQUE V0 = INCORPORÉE PAR RÉFÉRENCE À L'AUTORITÉ 14 ÉPINGLÉE
             = NORMATIVE / INCHANGÉE
LEUR VALIDATION = EXACTEMENT LA VALIDATION DE L'AUTORITÉ 14
```

V1 n'ajoute d'autorité que pour (autorité 98 § 10) :

```text
V1 representation identity
optional handoff_contract
P-HR-01 validation
P-HR-01 cross-actor consumption
P-HR-01 lifecycle enforcement
```

P-HR-01 ne réinterprète PAS :

```text
references · VERIFICATION_TARGET · DELIVERABLE · procedure · gates ·
effects · standing_constraints · next_consequences · addressee ·
existing executor obligations
```

## 4. Schéma de premier niveau V1

```text
ÉLÉMENTS DE PREMIER NIVEAU V1
= LES SEIZE ÉLÉMENTS HÉRITÉS, INCHANGÉS
+ representation      REQUIS EN V1
+ handoff_contract    OPTIONNEL

CHAMPS PROPRES À V1
= { representation · handoff_contract }
= AUCUN AUTRE

SCHÉMA CLOS : TOUT AUTRE ÉLÉMENT DE PREMIER NIVEAU → REJET
```

## 5. Encodage de representation

```json
"representation": {
  "authority": {
    "locator": { "kind": "REPO_PATH", "value": "101-HANDOFF-ROUTING-P-HR-01-MISSION-OBJECT-V1.md" },
    "identity": { "kind": "GIT_BLOB", "value": "<GIT_BLOB de ce document>" }
  }
}
```

```text
ENCODAGE = CONVENTION DÉJÀ EMPLOYÉE PAR LE DÉPÔT
           Result Instance v0 (autorité 23) : representation.authority
           Mission Object V0 (autorité 14)  : references[].locator / identity
AUCUN AUTRE MEMBRE
ÉGALITÉ EXACTE DU LOCALISATEUR ET DE L'IDENTITÉ
```

## 6. Reconnaissance de représentation — C-1 RAFFINÉE

Table de l'autorité 99 § 7, reprise sans changement :

```text
CASE A   representation ABSENT
         + validation exacte sous l'autorité 14 épinglée PASS
         + aucun champ propre à V1 (handoff_contract compris)
         → LEGACY V0 → ACCEPT UNDER V0 SEMANTICS

CASE B   representation ABSENT + validation V0 historique FAIL      → REJECT
CASE C   representation ABSENT + champ propre à V1 présent          → REJECT
CASE D   representation PRESENT
         + representation.authority = EXACTEMENT l'identité V1 du § 2
         → V1 → APPLY V1 SEMANTICS
CASE E   representation PRESENT
         + autorité inconnue / discordante / non supportée           → REJECT
CASE F   representation PRESENT + tentative d'identifier V0          → REJECT
```

```text
TENTATIVE D'IDENTIFIER V0
= representation.authority DÉSIGNANT L'AUTORITÉ 14 ÉPINGLÉE,
  PAR SON REPO_PATH OU PAR SON GIT_BLOB

LEGACY V0   IDENTIFIÉ DE L'EXTÉRIEUR PAR L'AUTORITÉ 14 ÉPINGLÉE
V1          AUTO-IDENTIFIÉ PAR SON representation.authority EMBARQUÉ
V1 RECOGNITION DOES NOT FALL BACK TO LEGACY VALIDATION
NO SCHEMA GUESSING · NO CALLER / CONTEXT DISCRIMINATION
V0 → V1 / V1 → V0 AUTOMATIC CONVERSION          FORBIDDEN
ADDING representation.authority TO HISTORICAL V0 OBJECTS   FORBIDDEN
```

Un objet reconnu V1 dont la validation V1 échoue est REJETÉ ; il n'est jamais
réexaminé comme V0.

## 7. handoff_contract — encodage et domaines clos

Forme logique canonique de l'autorité 98 § 11, encodée en JSON au premier niveau
de l'objet V1 :

```json
"handoff_contract": {
  "version": "P_HR_01",
  "next_control_stage": "EXECUTOR_DISPATCH",
  "return_destination": "<répertoire-de-mission>/result.json",
  "stage_ordering_dependency": "P_HR_01_LINEAR_V1",
  "persistence_ownership": "ORCHESTRATION"
}
```

```text
EXACTEMENT CES CINQ MEMBRES · CHACUN UNE CHAÎNE JSON
NO SOURCE / RESOLVED DUPLICATION
NO CALLER-SELECTED C2 VALUES
AUCUN MEMBRE DE PROSE, AUCUN MEMBRE ADDITIONNEL

version                    DOMAIN = { P_HR_01 }
next_control_stage         DOMAIN = { EXECUTOR_DISPATCH }
                           SEMANTICS = ASSERTION AGAINST ACTUAL REQUESTED
                                       PRE-DISPATCH OPERATION
                           NOT = route selection · scheduler ·
                                 control-transfer command
return_destination         TYPE = MISSION_LOCAL_RESULT_REPO_PATH
stage_ordering_dependency  DOMAIN = { P_HR_01_LINEAR_V1 }
persistence_ownership      DOMAIN = { ORCHESTRATION }
```

return_destination (autorité 98 § 12) :

```text
repository-relative
canonical "/" separators          aucun "\", aucun segment vide, aucun "."
no absolute path
no ".."
basename exactly result.json
same mission directory            = répertoire du fichier mission.json
                                    qui porte l'objet V1

VALEUR CANONIQUE
= <répertoire de mission.json>/result.json, octet pour octet
```

L'appartenance au répertoire de mission n'est vérifiable qu'avec le chemin
relatif au dépôt du fichier mission.json. Là où ce chemin n'est pas fourni, un
objet porteur de handoff_contract n'est pas validé complètement, donc REJETÉ.

## 8. Activation et validation de P-HR-01

```text
P-HR-01 APPLICABILITY = handoff_contract FIELD PRESENCE, À L'INTÉRIEUR DE V1

V1 WITHOUT handoff_contract   = VALID · P-HR-01 INACTIVE
V1 WITH handoff_contract      = P-HR-01 ACTIVE · COMPLETE VALIDATION MANDATORY
PRESENT + INVALID             → FAIL CLOSED

LEGACY V0                     P-HR-01 NON APPLICABLE · JAMAIS SYNTHÉTISÉ
```

## 9. Cycle de vie P_HR_01_LINEAR_V1 et sources d'événements

```text
HANDOFF_RESOLVED < MISSION_FROZEN < EXECUTOR_DISPATCHED
< EXECUTOR_RETURNED < RESULT_PERSISTED < RESULT_CONSUMED

NO ADDITIONAL NODE · NO PERMUTATION · NO BRANCH · NO GRAPH · NO LIFECYCLE DSL
UNKNOWN PREDECESSOR → STOP
NO LATER EVENT MAY RECONSTRUCT AN UNOBSERVED PREDECESSOR
```

Sources faisant autorité, sans changement (autorité 98 § 14) :

```text
HANDOFF_RESOLVED      successful P-HR-01 resolver
                      ENFORCEMENT = Mission Object V1 construction
MISSION_FROZEN        exact validated Mission Object V1
                      canonical repository identity
EXECUTOR_DISPATCHED   successful actual executor-dispatch integration operation
EXECUTOR_RETURNED     successful result-ingest boundary
RESULT_PERSISTED      canonical durable repository identity
                      for exact returned Result Instance bytes
RESULT_CONSUMED       first successful P_HR_01_RESULT_ADMISSION
                      for the exact persisted result identity
```

```text
L'ÉTAT D'EXÉCUTION FAISANT AUTORITÉ EST L'ÉTAT TRANSITOIRE
DE L'ORCHESTRATION POUR CETTE TRANSACTION

AUCUN REÇU DE DISPATCH DURABLE N'EXISTE (autorité 98 § 20)
ÉTAT DE DISPATCH PERDU AVANT LE RETOUR → STOP
```

## 10. next_control_stage — assertion seulement

```text
requested_operation.kind
= L'OPÉRATION DE CONTRÔLE D'ORCHESTRATION RÉELLEMENT DEMANDÉE, AVANT DISPATCH
MUST EQUAL EXECUTOR_DISPATCH

handoff_contract.next_control_stage EST COMPARÉ À CETTE OPÉRATION
IL NE LA SÉLECTIONNE PAS

IL NE LIT PAS : PROGRAM-STATE · next_consequences · procedure ·
                une primitive de routage nouvelle
IL NE MUTE AUCUN ÉTAT DE ROUTAGE · N'ORDONNANCE RIEN · N'INITIE AUCUN DISPATCH

MISMATCH → FAIL / NO DISPATCH THROUGH P-HR-01
EN FAIRE UNE AUTORITÉ DE ROUTAGE → NON-CONFORMITÉ SÉMANTIQUE → HARD STOP
```

## 11. P_HR_01_RESULT_ADMISSION

```text
FRONTIÈRE LOGIQUE D'INTÉGRATION BORNÉE
≠ REPRÉSENTATION DURABLE NOUVELLE

REÇOIT     exact frozen Mission Object V1 identity
           exact committed Result Instance identity
ÉTABLIT    P-HR-01 ACTIVE          = YES
           RESULT SOURCE MATCH     = YES
           RETURN PATH MATCH       = YES
           RESULT_PERSISTED        = YES
           PERSISTED BLOB          = exact returned blob
ALORS SEULEMENT
           handle immuable de résultat accepté pour la logique produit aval

RESULT_CONSUMED = FIRST SUCCESSFUL ADMISSION
```

```text
LA CONSOMMATION N'EST PAS : file read · console display · validation alone ·
                            result creation · persistence ·
                            arbitrary direct path access

FOR AN ACTIVE P-HR-01 MISSION
ALL SEMANTIC DOWNSTREAM RESULT USE MUST PASS THROUGH P_HR_01_RESULT_ADMISSION

ADMISSION BEFORE PERSISTENCE → REJECT · NO HANDLE · NO RESULT-DRIVEN CONTINUATION
BYPASS                        → CONTRACT VIOLATION / STOP
```

## 12. Obligations des acteurs

Sans changement, autorité 98 § 17 :

```text
ORCHESTRATION / MISSION CONSTRUCTION
  MUST       resolve exact P-HR-01 values · validate contract ·
             derive canonical result path · freeze contract with Mission Object V1
  MUST NOT   infer routing from prose · choose another next stage ·
             choose another persistence owner

ORCHESTRATION / PRE-DISPATCH
  MUST       validate exact frozen mission ·
             verify requested operation kind == EXECUTOR_DISPATCH ·
             observe successful actual dispatch

EXECUTOR
  MUST       consume exact return destination ·
             return Result Instance exactly there
  MUST NOT   use NEXT_CONTROL_STAGE as routing authority ·
             mutate lifecycle / order · change persistence ownership ·
             repair P-HR-01

ORCHESTRATION / POST-RETURN
  MUST       validate exact return · persist exact bytes ·
             establish committed result identity · admit result only after persistence
```

Le retour d'une mission V1 porteuse de P-HR-01 est un Result Instance v0
(autorité 23) dont source.authority et return_contract.authority désignent
exactement l'identité gelée (REPO_PATH + GIT_BLOB) du Mission Object V1.

## 13. Règles d'échec fermé

Autorité 98 § 18, autorité 100 § 13 :

```text
FC-01  unknown Mission Object representation                  → REJECT / STOP
FC-02  V0-only path receives V1                               → REJECT / STOP
FC-03  active P-HR-01 through V0 path                         → STOP
FC-04  unknown P-HR version                                   → STOP
FC-05  handoff_contract incomplete                            → STOP
FC-06  handoff_contract malformed                             → STOP
FC-07  next_control_stage mismatch                            → STOP
FC-08  return destination mismatch                            → STOP
FC-09  ordering mismatch                                      → STOP
FC-10  persistence owner mismatch                             → STOP
FC-11  contract mutation after freeze                         → STOP
FC-12  requested operation mismatch                           → STOP
FC-13  dispatch before freeze                                 → STOP
FC-14  lost authoritative dispatch state before return        → STOP
FC-15  return before dispatch                                 → STOP
FC-16  Result Instance source mismatch                        → STOP
FC-17  executor persistence attempt / wrong persistence actor → STOP
FC-18  persistence before validated return                    → STOP
FC-19  result admission before persistence                    → STOP
FC-20  downstream result-consumption bypass                   → STOP
FC-21  CASE B                                                 → REJECT
FC-22  CASE C                                                 → REJECT
FC-23  CASE E                                                 → REJECT
FC-24  CASE F                                                 → REJECT
```

```text
NO prose fallback · NO inferred predecessor · NO silent compatibility fallback ·
NO automatic repair · NO implicit version downgrade · NO routing reconstruction
```

## 14. Compatibilité directionnelle

```text
V1-capable tooling receives V0 (CASE A)
→ ACCEPT AS V0 · APPLY V0 SEMANTICS · DO NOT SYNTHESIZE P-HR-01

V1-capable tooling receives V1 without handoff_contract
→ ACCEPT AS V1 · LEGACY V0 FIELD SEMANTICS RETAINED · P-HR-01 INACTIVE

V1-capable tooling receives V1 with valid handoff_contract
→ ACCEPT · P-HR-01 ACTIVE

V1-capable tooling receives V1 with invalid handoff_contract
→ REJECT

V0-only tooling receives V1
→ REJECT AS UNSUPPORTED REPRESENTATION · MUST NOT PROCESS AS V0 ·
  MUST NOT IGNORE handoff_contract · MUST NOT DISPATCH ·
  MUST NOT IMPLICITLY DOWN-CONVERT
```

```text
HISTORICAL V0 BYTES · MISSION BLOBS · RESULT INSTANCE SOURCE BINDINGS   UNCHANGED
```

## 15. Élargissements interdits

```text
generic router · routing graph · generic event bus · workflow engine ·
lifecycle DSL · dynamic route choice · arbitrary next-stage domain ·
arbitrary persistence actor domain · generic version-conversion framework ·
durable dispatch-receipt artifact · new PROGRAM-STATE semantics ·
derived-handoff.json product usage · EXP-C2-C schema product adoption ·
program-wide handoff ontology
```

## 16. Implémentation de référence — fait consigné, non normatif

```text
tooling/mission-object/v1.mjs        représentation V1, reconnaissance C-1 RAFFINÉE,
                                     validation V1 et P-HR-01, rendu et inspection
tooling/mission-object/p-hr-01.mjs   résolveur P-HR-01, cycle de vie inter-acteurs,
                                     P_HR_01_RESULT_ADMISSION
```

L'implémentation de validation V0 existante, tooling/mission-object/validate.mjs,
est employée telle quelle pour les champs hérités ; elle n'est pas modifiée.

## 17. Ce que ce document ne fait pas

```text
IL NE CHANGE AUCUNE SÉMANTIQUE DES AUTORITÉS 98 ET 99
IL N'ÉDITE NI L'AUTORITÉ 98, NI 99, NI 100, NI 14, NI AUCUNE AUTORITÉ ANTÉRIEURE
IL NE MODIFIE AUCUN MISSION OBJECT, AUCUNE ENVELOPPE, AUCUN RESULT INSTANCE HISTORIQUE
IL N'AJOUTE representation À AUCUN OBJET V0
IL N'AUTORISE AUCUNE CONVERSION AUTOMATIQUE V0 → V1 NI V1 → V0
IL N'ADOPTE NI derived-handoff.json, NI LE SCHÉMA EXP-C2-C COMME PRODUIT
IL NE CRÉE AUCUNE SÉMANTIQUE PROGRAM-STATE NOUVELLE
IL NE CRÉE AUCUNE ONTOLOGIE DE HANDOFF À L'ÉCHELLE DU PROGRAMME
IL NE SÉLECTIONNE AUCUNE ROUTE ET N'ORDONNANCE AUCUNE ÉTAPE
```
