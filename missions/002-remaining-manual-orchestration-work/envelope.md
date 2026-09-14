MISSION remaining-manual-orchestration-work-comparative-study-002
=================================================================

DESTINATAIRE    = AGENT_CCR_LAB_25
PROJET CIBLE    = CCR_SOFTWARE_ENGINEERING_LAB
CLASSE          = REMAINING_MANUAL_ORCHESTRATION_WORK_BOUNDED_COMPARATIVE_STUDY

CONTEXTE — NON NORMATIF
-----------------------
  study.factual_baseline = 70ca6d43aca5f07aafdc9e1b112d5991f2bf974a
  study.factual_corpus_cut = 168e7d811d05ae663923c50c6704f7db6eaac5b1
  study.governance_not_occurrence = AUTHORITIES_43_AND_44_ARE_GOVERNANCE_ONLY
  study.admitted_episode_count = 15
  study.unknown_is_not_zero = NOT_ESTABLISHED_NEVER_COLLAPSES_TO_ZERO
  study.prompt_size_is_not_a_proxy = FORBIDDEN_PROXY

AUTORITÉS ET RÉFÉRENCES
-----------------------
  ref-auth43  [AUTHORITY]  REPO_PATH 43-REMAINING-MANUAL-ORCHESTRATION-WORK-NEXT-DIRECTION-SELECTION.md  GIT_BLOB feda3a558c086ea1cc9c28c8f574aca1ff110c04  identité EXIGÉE
  ref-auth44  [AUTHORITY]  REPO_PATH 44-REMAINING-MANUAL-ORCHESTRATION-WORK-BOUNDED-COMPARATIVE-STUDY-FREEZE.md  identité non exigée
  ref-auth09  [CONTEXT]  REPO_PATH 09-TOOLING-EXPERIMENT-001-PROGRAM-STATE.md  GIT_BLOB c94e03829e107b51f63efcdb950bfeff123f50d1  identité EXIGÉE
  ref-auth14  [CONTEXT]  REPO_PATH 14-TOOLING-EXPERIMENT-002-MISSION-OBJECT-V0.md  GIT_BLOB 7d634c855ab9de8c66a21c134b03de8f118c3de4  identité EXIGÉE
  ref-auth23  [CONTEXT]  REPO_PATH 23-TOOLING-EXPERIMENT-003-RESULT-INSTANCE-V0.md  GIT_BLOB 1676b3de4546b40a801d0a400b4c47ddd9b82062  identité EXIGÉE
  ref-auth33  [CONTEXT]  REPO_PATH 33-LOCAL-MISSION-CONSOLE-V0-INDEPENDENT-IMPLEMENTATION-QUALIFICATION.md  GIT_BLOB a0060090fa23a1db98c3ede8f60f0f02f75d99e1  identité EXIGÉE
  ref-program-state  [VERIFICATION_TARGET]  REPO_PATH PROGRAM-STATE.json  GIT_BLOB d184076b1d8327a8327f4c2c538ec9efd208324d  identité EXIGÉE
  ref-auth34  [VERIFICATION_TARGET]  REPO_PATH 34-DECISION-CONSEQUENCE-BOUNDARY-REAL-USE-MISSION-SELECTION.md  GIT_BLOB 4b6fe11c3499a9a4e17b59d0c9ff49c0fa6bffb5  identité EXIGÉE
  ref-auth35  [VERIFICATION_TARGET]  REPO_PATH 35-DECISION-CONSEQUENCE-BOUNDARY-BOUNDED-MISSION-FREEZE.md  GIT_BLOB 9a067717b3fb5e3daca7a7be3a34b1362b843ea3  identité EXIGÉE
  ref-auth36  [VERIFICATION_TARGET]  REPO_PATH 36-LOCAL-MISSION-CONSOLE-V0-REAL-USE-OBSERVATION-CAPTURE-PROTOCOL.md  GIT_BLOB dc77a8a561b9ec92d05e6996f69c7929beb2c5b2  identité EXIGÉE
  ref-auth37  [VERIFICATION_TARGET]  REPO_PATH 37-DECISION-CONSEQUENCE-BOUNDARY-RESULT-PANEL-C-DURABILITY-ORDERING.md  GIT_BLOB 0fff611a59dabef0ad1b067344287d48b740f74a  identité EXIGÉE
  ref-auth38  [VERIFICATION_TARGET]  REPO_PATH 38-DECISION-CONSEQUENCE-BOUNDARY-PRIMARY-STUDY-AND-CONSOLE-REAL-USE-QUALIFICATION.md  GIT_BLOB ba16dbc7c7aa0e133bc9f442ab1046ca82a1ce57  identité EXIGÉE
  ref-auth39  [VERIFICATION_TARGET]  REPO_PATH 39-LOCAL-MISSION-CONSOLE-V0-U01-PRODUCT-RESPONSE-SELECTION.md  GIT_BLOB 1f25eb85170d09853865ef0ee59c2eb7dee345de  identité EXIGÉE
  ref-auth40  [VERIFICATION_TARGET]  REPO_PATH 40-LOCAL-MISSION-CONSOLE-V0-U01-BOUNDED-DISCOVERY-REMEDIATION-DESIGN.md  GIT_BLOB 6f161cbb8d852f52afe15848c1b88664cfb207e5  identité EXIGÉE
  ref-auth41  [VERIFICATION_TARGET]  REPO_PATH 41-LOCAL-MISSION-CONSOLE-V0-U01-BOUNDED-DISCOVERY-DESIGN-CORRECTION.md  GIT_BLOB 86a6f1fc565ef0c5b3a4d8b6a772e6610c3590db  identité EXIGÉE
  ref-auth42  [VERIFICATION_TARGET]  REPO_PATH 42-LOCAL-MISSION-CONSOLE-V0-U01-REMEDIATION-INDEPENDENT-QUALIFICATION-AND-CLOSURE.md  GIT_BLOB b3a24ab4c0e40e847962e28103fd3a0ff18bdb24  identité EXIGÉE
  ref-mission001  [VERIFICATION_TARGET]  REPO_PATH missions/001-decision-consequence-boundary/mission.json  GIT_BLOB e80bc3d250920cee66b4d26bef497b6094395144  identité EXIGÉE
  ref-envelope001  [VERIFICATION_TARGET]  REPO_PATH missions/001-decision-consequence-boundary/envelope.md  GIT_BLOB a5320c00c20ec0b1f7f4c8f99515bd5a133b619e  identité EXIGÉE
  ref-result001  [VERIFICATION_TARGET]  REPO_PATH missions/001-decision-consequence-boundary/result.json  GIT_BLOB 69d2d1574eb3bf82148f23b36f4e2f4f1c1a4e07  identité EXIGÉE
  ref-observations001  [VERIFICATION_TARGET]  REPO_PATH missions/001-decision-consequence-boundary/console-real-use-observations.md  GIT_BLOB af7c57778ba8b34ea814555d91448ef9ae24f1a2  identité EXIGÉE
  ref-console-repo  [VERIFICATION_TARGET]  REPO_PATH tooling/console/repo.mjs  GIT_BLOB 0dbbd293263b41074dec564b60e9e05092604452  identité EXIGÉE
  ref-return  [DELIVERABLE]  REPO_PATH missions/002-remaining-manual-orchestration-work/result.json  identité non exigée

FRONTIÈRES D’EFFET
------------------
  REQUIRED              READ_DURABLE_CORPUS → ref-program-state  cardinalité 1
  REQUIRED              VERIFY_EPISODE_INVENTORY  cardinalité 1
  REQUIRED              BUILD_ATOMIC_WORK_UNIT_LEDGER  cardinalité 1
  REQUIRED              ATTRIBUTE_UNITS_TO_FAMILIES  cardinalité 1
  REQUIRED              CLASSIFY_DEMONSTRATED_CONSEQUENCES  cardinalité 1
  REQUIRED              CLASSIFY_EXISTING_SURFACE_SUFFICIENCY  cardinalité 1
  REQUIRED              EVALUATE_TOOLING_CASE_GATE  cardinalité 1
  REQUIRED              COMPARE_FAMILIES_LEXICOGRAPHICALLY  cardinalité 1
  REQUIRED              PRODUCE_RESULT_INSTANCE → ref-return  cardinalité 1
  REQUIRED              VALIDATE_RESULT_INSTANCE  cardinalité 1
  REQUIRED              FREEZE_RESULT_INSTANCE  cardinalité 1
  FORBIDDEN             RECONSTRUCT_FROM_CONVERSATION  cardinalité 0
  FORBIDDEN             USE_SESSION_PROSE  cardinalité 0
  FORBIDDEN             READ_CCR_SYSTEM_REPOSITORY  cardinalité 0
  FORBIDDEN             READ_PROTECTED_SOURCE  cardinalité 0
  FORBIDDEN             READ_EXTERNAL_WEB  cardinalité 0
  FORBIDDEN             SAMPLE_EPISODE_INVENTORY  cardinalité 0
  FORBIDDEN             ALTER_RETURN_CONTRACT  cardinalité 0
  FORBIDDEN             INVENT_SYNTHETIC_SCORE  cardinalité 0
  FORBIDDEN             USE_PROMPT_SIZE_AS_PROXY  cardinalité 0
  FORBIDDEN             DOUBLE_COUNT_ATOMIC_UNIT  cardinalité 0
  FORBIDDEN             REPORT_UNKNOWN_AS_ZERO  cardinalité 0
  FORBIDDEN             DESIGN_TOOLING  cardinalité 0
  FORBIDDEN             CREATE_TOOLING_EXPERIMENT  cardinalité 0
  FORBIDDEN             DESIGN_REPRESENTATION  cardinalité 0
  FORBIDDEN             IMPLEMENT  cardinalité 0
  FORBIDDEN             QUALIFY_OWN_RETURN  cardinalité 0
  FORBIDDEN             COMMIT  cardinalité 0
  FORBIDDEN             PUSH  cardinalité 0
  FORBIDDEN             MUTATE_REPOSITORY  cardinalité 0

EXIGENCES DE CONTENU
--------------------
  PRESERVE  study.factual_baseline  EQUALS  70ca6d43aca5f07aafdc9e1b112d5991f2bf974a   [cible ref-return · portée MISSION]
  PRESERVE  study.factual_corpus_cut  EQUALS  168e7d811d05ae663923c50c6704f7db6eaac5b1   [cible ref-return · portée MISSION]
  CLAIM / ASSERT  study.factual_window_commit_count  EQUALS  14   [cible ref-return · portée MISSION]
  CLAIM / ASSERT  study.admitted_episode_count  EQUALS  15   [cible ref-return · portée MISSION]
  CLAIM / ASSERT  study.evaluated_episode_count  EQUALS  15   [cible ref-return · portée MISSION]
  CLAIM / ASSERT  discipline.conversation_factual_reconstruction_count  EQUALS  0   [cible ref-return · portée MISSION]
  CLAIM / ASSERT  discipline.session_prose_fallback_count  EQUALS  0   [cible ref-return · portée MISSION]
  CLAIM / ASSERT  discipline.ccr_system_source_usage_count  EQUALS  0   [cible ref-return · portée MISSION]
  CLAIM / ASSERT  discipline.protected_source_usage_count  EQUALS  0   [cible ref-return · portée MISSION]
  CLAIM / ASSERT  discipline.repository_mutations_other_than_result  EQUALS  0   [cible ref-return · portée MISSION]
  CLAIM / ASSERT  discipline.executor_commit_count  EQUALS  0   [cible ref-return · portée MISSION]
  CLAIM / ASSERT  discipline.executor_push_count  EQUALS  0   [cible ref-return · portée MISSION]
  FORBID_CLAIM  comparison.winner_selected_without_eligibility  EQUALS  YES   [cible ref-return · portée MISSION]
  FORBID_CLAIM  comparison.synthetic_score  EQUALS  PRESENT   [cible ref-return · portée MISSION]
  FORBID_CLAIM  study.new_tooling_experiment  EQUALS  SELECTED   [cible ref-return · portée MISSION]
  FORBID_CLAIM  study.representation_design  EQUALS  PRESENT   [cible ref-return · portée MISSION]
  FORBID_CLAIM  study.self_qualification_verdict  EQUALS  PRESENT   [cible ref-return · portée MISSION]

PROCÉDURE
---------
  ORDRE STRICT — aucune étape ne se fond dans une autre
  1. s-read  effet e-read-corpus  [atomique]  [après porte g-preflight]
  2. s-inventory  effet e-verify-inventory  [atomique]  [produit ev-inventory]
  3. s-units  effet e-build-units  [atomique]  [après porte g-inventory-executable]  [produit ev-units]
  4. s-attribute  effet e-attribute  [atomique]  [produit ev-attribution]
  5. s-consequences  effet e-consequences  [atomique]  [après porte g-attribution-disjoint]  [produit ev-consequences]
  6. s-sufficiency  effet e-sufficiency  [atomique]
  7. s-tooling-gate  effet e-tooling-gate  [atomique]
  8. s-compare  effet e-compare  [atomique]  [après porte g-no-forbidden-source]
  9. s-produce  effet e-produce-result  [atomique]
  10. s-validate  effet e-validate-result  [atomique]  [produit ev-result-validation]
  11. s-freeze  effet e-freeze-result  [atomique]

PORTES
------
  g-preflight  [portée ALL_PRECEDING]
      exige   REPO_FACT(BRANCH) EQ main  ET  REPO_FACT(WORKTREE_CLEAN) EQ true  ET  ARTIFACT_IDENTITY(ref-auth43) EQ feda3a558c086ea1cc9c28c8f574aca1ff110c04  ET  ARTIFACT_IDENTITY(ref-result001) EQ 69d2d1574eb3bf82148f23b36f4e2f4f1c1a4e07  ET  COUNT_OF(MEASUREMENT(reserved_result_path_existing)) EQ 0
      échec → sr-preflight
  g-inventory-executable  [portée ALL_PRECEDING]
      exige   OPERATION_RESULT(e-verify-inventory).inventory_matches_authority EQ true  ET  OPERATION_RESULT(e-verify-inventory).exhaustive_evaluation_executable EQ true
      échec → sr-inventory
  g-no-forbidden-source  [portée ALL_PRECEDING]
      exige   COUNT_OF(MEASUREMENT(conversation_factual_reconstruction)) EQ 0  ET  COUNT_OF(MEASUREMENT(session_prose_fallback)) EQ 0  ET  COUNT_OF(MEASUREMENT(ccr_system_source_usage)) EQ 0  ET  COUNT_OF(MEASUREMENT(protected_source_usage)) EQ 0
      échec → sr-forbidden-source
  g-attribution-disjoint  [portée ALL_PRECEDING]
      exige   OPERATION_RESULT(e-attribute).double_counted_unit_count EQ 0  ET  OPERATION_RESULT(e-attribute).ambiguous_units_excluded_from_counts EQ true
      échec → sr-attribution

CONDITIONS D’ARRÊT
------------------
  sr-preflight  si  REPO_FACT(preflight_match) NEQ true
      FORBIDDEN             CLEAN
      FORBIDDEN             RESET
      FORBIDDEN             RESTORE
      FORBIDDEN             FETCH
      exigé   REPORT
      STOP
  sr-inventory  si  OPERATION_RESULT(e-verify-inventory).inventory_matches_authority NEQ true
      FORBIDDEN             EXTEND_EPISODE_INVENTORY
      FORBIDDEN             SAMPLE_EPISODE_INVENTORY
      exigé   REPORT
      STOP
  sr-forbidden-source  si  COUNT_OF(MEASUREMENT(forbidden_source_usage)) NEQ 0
      FORBIDDEN             RECONSTRUCT_FROM_CONVERSATION
      FORBIDDEN             USE_SESSION_PROSE
      exigé   REPORT
      STOP
  sr-attribution  si  OPERATION_RESULT(e-attribute).double_counted_unit_count NEQ 0
      FORBIDDEN             CREDIT_UNIT_TO_BOTH_FAMILIES
      FORBIDDEN             INVENT_SEMANTIC_SPLIT
      exigé   REPORT
      STOP
  sr-mutation  si  COUNT_OF(MEASUREMENT(repository_mutations_other_than_result)) NEQ 0
      FORBIDDEN             COMMIT
      FORBIDDEN             PUSH
      exigé   REPORT
      STOP

BRANCHES
--------

  BRANCHE br-inventory-not-executable  si  OPERATION_RESULT(e-verify-inventory).exhaustive_evaluation_executable EQ false
      résultat terminal   BLOCKED
      conséquence         nc-return
      étape 1. s-b1-report  effet e-freeze-result
      FORBIDDEN             SAMPLE_EPISODE_INVENTORY  cardinalité 0
      FORBIDDEN             INVENT_SAMPLE  cardinalité 0
      CLAIM / ASSERT  study.final_comparative_recommendation  EQUALS  INCONCLUSIVE_ON_DURABLE_EVIDENCE   [cible ref-return · portée br-inventory-not-executable]

  BRANCHE br-neither-eligible  si  OPERATION_RESULT(e-compare).eligible_family_count EQ 0
      résultat terminal   NO_FAMILY_CURRENTLY_JUSTIFIED
      conséquence         nc-return
      étape 1. s-b2-produce  effet e-produce-result
      étape 2. s-b2-validate  effet e-validate-result
      étape 3. s-b2-freeze  effet e-freeze-result
      FORBIDDEN             SELECT_WINNING_FAMILY  cardinalité 0
      CLAIM / ASSERT  study.procedural_success  EQUALS  PROCEDURALLY_SUCCESSFUL   [cible ref-return · portée br-neither-eligible]

  BRANCHE br-tie-or-undermined  si  OPERATION_RESULT(e-compare).decided_at_dimension EQ NONE
      résultat terminal   INCONCLUSIVE_ON_DURABLE_EVIDENCE
      conséquence         nc-return
      étape 1. s-b3-produce  effet e-produce-result
      étape 2. s-b3-validate  effet e-validate-result
      étape 3. s-b3-freeze  effet e-freeze-result
      FORBIDDEN             INVENT_SEVERITY_WEIGHT  cardinalité 0
      CLAIM / ASSERT  study.final_comparative_recommendation  EQUALS  INCONCLUSIVE_ON_DURABLE_EVIDENCE   [cible ref-return · portée br-tie-or-undermined]

  BRANCHE br-representation-gap-appears  si  OPERATION_RESULT(e-tooling-gate).representation_gap_candidate_present EQ true
      résultat terminal   PASS
      conséquence         nc-return
      étape 1. s-b4-record  effet e-produce-result
      FORBIDDEN             DESIGN_REPRESENTATION  cardinalité 0
      FORBIDDEN             CREATE_TOOLING_EXPERIMENT  cardinalité 0
      CLAIM / ASSERT  study.concrete_representation_gap_candidate  EQUALS  PRESENT   [cible ref-return · portée br-representation-gap-appears]

AUTORITÉ HUMAINE
----------------
  RATIFIÉ       remaining_manual_orchestration_work_study_direction_selected   [autorité ref-auth43]
  DÉTERMINÉ     nc-return

EXIGENCES DE PREUVE
-------------------
  ev-inventory  [OBSERVATION]  study.episode_inventory   méthode EQ depuis ref-auth44 · recalcul exigé
      source interdite  session_prose · conversation_transcript
  ev-units  [OBSERVATION]  study.atomic_work_units   méthode EQ depuis ref-program-state · recalcul exigé
      source interdite  session_prose · conversation_transcript
  ev-attribution  [VERIFICATION]  study.family_attribution   méthode EQ depuis ref-auth44 · recalcul exigé
      source interdite  session_prose · conversation_transcript
  ev-consequences  [OBSERVATION]  study.demonstrated_consequences   méthode EQ depuis ref-observations001 · recalcul exigé
      source interdite  session_prose · conversation_transcript
  ev-result-validation  [VERIFICATION]  result_instance.structural_validation   méthode EQ depuis ref-return · recalcul exigé
      source interdite  session_prose · conversation_transcript

RÉSULTATS TERMINAUX ET SUCCÈS PARTIEL
-------------------------------------

  PASS  valide si  OPERATION_RESULT(e-verify-inventory).exhaustive_evaluation_executable EQ true  ET  OPERATION_RESULT(e-compare).eligible_family_count EQ 1  ET  OPERATION_RESULT(e-validate-result).status EQ PASS
      état partiel admis            NON
      état atteint à préserver      OUI
      conséquence                   nc-return
      état résultant  CLAIM / ASSERT  result_instance.frozen  EQUALS  YES   [cible ref-return · portée MISSION]

  NO_FAMILY_CURRENTLY_JUSTIFIED  valide si  OPERATION_RESULT(e-compare).eligible_family_count EQ 0  ET  OPERATION_RESULT(e-validate-result).status EQ PASS
      état partiel admis            NON
      état atteint à préserver      OUI
      conséquence                   nc-return
      état résultant  CLAIM / ASSERT  result_instance.frozen  EQUALS  YES   [cible ref-return · portée MISSION]

  INCONCLUSIVE_ON_DURABLE_EVIDENCE  valide si  OPERATION_RESULT(e-compare).decided_at_dimension EQ NONE
      état partiel admis            NON
      état atteint à préserver      OUI
      conséquence                   nc-return
      état résultant  CLAIM / ASSERT  result_instance.frozen  EQUALS  YES   [cible ref-return · portée MISSION]

  BLOCKED  valide si  OPERATION_RESULT(e-verify-inventory).exhaustive_evaluation_executable EQ false
      état partiel admis            NON
      état atteint à préserver      OUI
      conséquence                   nc-return
      état résultant  CLAIM / ASSERT  study.sampled_inventory  EQUALS  NO   [cible ref-return · portée MISSION]

  STOPPED_ON_PREFLIGHT  valide si  REPO_FACT(preflight_match) NEQ true
      état partiel admis            NON
      état atteint à préserver      OUI
      conséquence                   nc-return
      état résultant  CLAIM / ASSERT  result_instance.frozen  EQUALS  NO   [cible ref-return · portée MISSION]

RETOUR OBLIGATOIRE
------------------
  study.factual_baseline  [MEASURED · SCALAR]
  study.factual_corpus_cut  [MEASURED · SCALAR]
  study.factual_window_commit_count  [MEASURED · SCALAR]
  study.admitted_episode_count  [MEASURED · SCALAR]
  study.evaluated_episode_count  [MEASURED · SCALAR]
  discipline.conversation_factual_reconstruction_count  [MEASURED · SCALAR]
  discipline.session_prose_fallback_count  [MEASURED · SCALAR]
  discipline.ccr_system_source_usage_count  [MEASURED · SCALAR]
  discipline.protected_source_usage_count  [MEASURED · SCALAR]
  ep_01.family_a_work_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_01.family_b_work_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_01.family_a_atomic_unit_count  [MEASURED · SCALAR]
  ep_01.family_b_atomic_unit_count  [MEASURED · SCALAR]
  ep_01.attribution_ambiguous_unit_count  [MEASURED · SCALAR]
  ep_01.family_a_evidence_status  [MEASURED · SYMBOL]  parmi { DIRECT_DURABLE · DETERMINISTIC_DERIVATION · NOT_ESTABLISHED · CONTRADICTED }
  ep_01.family_b_evidence_status  [MEASURED · SYMBOL]  parmi { DIRECT_DURABLE · DETERMINISTIC_DERIVATION · NOT_ESTABLISHED · CONTRADICTED }
  ep_01.family_a_consequences  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_01.family_b_consequences  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_01.family_a_realized_drift_or_error  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_01.family_b_realized_drift_or_error  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_01.reconstruction_recovery_demonstrated  [MEASURED · SET]  parmi { FRESH_SESSION_RECONSTRUCTION · RESUMPTION_AFTER_STOP_OR_BLOCK · MANUAL_CONTEXT_REASSEMBLY · MANUAL_ROUTE_OR_RESPONSIBILITY_REESTABLISHMENT · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_01.atomic_work_unit_ledger  [MEASURED · SET]
  ep_02.family_a_work_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_02.family_b_work_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_02.family_a_atomic_unit_count  [MEASURED · SCALAR]
  ep_02.family_b_atomic_unit_count  [MEASURED · SCALAR]
  ep_02.attribution_ambiguous_unit_count  [MEASURED · SCALAR]
  ep_02.family_a_evidence_status  [MEASURED · SYMBOL]  parmi { DIRECT_DURABLE · DETERMINISTIC_DERIVATION · NOT_ESTABLISHED · CONTRADICTED }
  ep_02.family_b_evidence_status  [MEASURED · SYMBOL]  parmi { DIRECT_DURABLE · DETERMINISTIC_DERIVATION · NOT_ESTABLISHED · CONTRADICTED }
  ep_02.family_a_consequences  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_02.family_b_consequences  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_02.family_a_realized_drift_or_error  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_02.family_b_realized_drift_or_error  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_02.reconstruction_recovery_demonstrated  [MEASURED · SET]  parmi { FRESH_SESSION_RECONSTRUCTION · RESUMPTION_AFTER_STOP_OR_BLOCK · MANUAL_CONTEXT_REASSEMBLY · MANUAL_ROUTE_OR_RESPONSIBILITY_REESTABLISHMENT · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_02.atomic_work_unit_ledger  [MEASURED · SET]
  ep_03.family_a_work_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_03.family_b_work_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_03.family_a_atomic_unit_count  [MEASURED · SCALAR]
  ep_03.family_b_atomic_unit_count  [MEASURED · SCALAR]
  ep_03.attribution_ambiguous_unit_count  [MEASURED · SCALAR]
  ep_03.family_a_evidence_status  [MEASURED · SYMBOL]  parmi { DIRECT_DURABLE · DETERMINISTIC_DERIVATION · NOT_ESTABLISHED · CONTRADICTED }
  ep_03.family_b_evidence_status  [MEASURED · SYMBOL]  parmi { DIRECT_DURABLE · DETERMINISTIC_DERIVATION · NOT_ESTABLISHED · CONTRADICTED }
  ep_03.family_a_consequences  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_03.family_b_consequences  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_03.family_a_realized_drift_or_error  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_03.family_b_realized_drift_or_error  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_03.reconstruction_recovery_demonstrated  [MEASURED · SET]  parmi { FRESH_SESSION_RECONSTRUCTION · RESUMPTION_AFTER_STOP_OR_BLOCK · MANUAL_CONTEXT_REASSEMBLY · MANUAL_ROUTE_OR_RESPONSIBILITY_REESTABLISHMENT · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_03.atomic_work_unit_ledger  [MEASURED · SET]
  ep_04.family_a_work_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_04.family_b_work_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_04.family_a_atomic_unit_count  [MEASURED · SCALAR]
  ep_04.family_b_atomic_unit_count  [MEASURED · SCALAR]
  ep_04.attribution_ambiguous_unit_count  [MEASURED · SCALAR]
  ep_04.family_a_evidence_status  [MEASURED · SYMBOL]  parmi { DIRECT_DURABLE · DETERMINISTIC_DERIVATION · NOT_ESTABLISHED · CONTRADICTED }
  ep_04.family_b_evidence_status  [MEASURED · SYMBOL]  parmi { DIRECT_DURABLE · DETERMINISTIC_DERIVATION · NOT_ESTABLISHED · CONTRADICTED }
  ep_04.family_a_consequences  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_04.family_b_consequences  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_04.family_a_realized_drift_or_error  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_04.family_b_realized_drift_or_error  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_04.reconstruction_recovery_demonstrated  [MEASURED · SET]  parmi { FRESH_SESSION_RECONSTRUCTION · RESUMPTION_AFTER_STOP_OR_BLOCK · MANUAL_CONTEXT_REASSEMBLY · MANUAL_ROUTE_OR_RESPONSIBILITY_REESTABLISHMENT · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_04.atomic_work_unit_ledger  [MEASURED · SET]
  ep_05.family_a_work_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_05.family_b_work_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_05.family_a_atomic_unit_count  [MEASURED · SCALAR]
  ep_05.family_b_atomic_unit_count  [MEASURED · SCALAR]
  ep_05.attribution_ambiguous_unit_count  [MEASURED · SCALAR]
  ep_05.family_a_evidence_status  [MEASURED · SYMBOL]  parmi { DIRECT_DURABLE · DETERMINISTIC_DERIVATION · NOT_ESTABLISHED · CONTRADICTED }
  ep_05.family_b_evidence_status  [MEASURED · SYMBOL]  parmi { DIRECT_DURABLE · DETERMINISTIC_DERIVATION · NOT_ESTABLISHED · CONTRADICTED }
  ep_05.family_a_consequences  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_05.family_b_consequences  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_05.family_a_realized_drift_or_error  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_05.family_b_realized_drift_or_error  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_05.reconstruction_recovery_demonstrated  [MEASURED · SET]  parmi { FRESH_SESSION_RECONSTRUCTION · RESUMPTION_AFTER_STOP_OR_BLOCK · MANUAL_CONTEXT_REASSEMBLY · MANUAL_ROUTE_OR_RESPONSIBILITY_REESTABLISHMENT · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_05.atomic_work_unit_ledger  [MEASURED · SET]
  ep_06.family_a_work_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_06.family_b_work_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_06.family_a_atomic_unit_count  [MEASURED · SCALAR]
  ep_06.family_b_atomic_unit_count  [MEASURED · SCALAR]
  ep_06.attribution_ambiguous_unit_count  [MEASURED · SCALAR]
  ep_06.family_a_evidence_status  [MEASURED · SYMBOL]  parmi { DIRECT_DURABLE · DETERMINISTIC_DERIVATION · NOT_ESTABLISHED · CONTRADICTED }
  ep_06.family_b_evidence_status  [MEASURED · SYMBOL]  parmi { DIRECT_DURABLE · DETERMINISTIC_DERIVATION · NOT_ESTABLISHED · CONTRADICTED }
  ep_06.family_a_consequences  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_06.family_b_consequences  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_06.family_a_realized_drift_or_error  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_06.family_b_realized_drift_or_error  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_06.reconstruction_recovery_demonstrated  [MEASURED · SET]  parmi { FRESH_SESSION_RECONSTRUCTION · RESUMPTION_AFTER_STOP_OR_BLOCK · MANUAL_CONTEXT_REASSEMBLY · MANUAL_ROUTE_OR_RESPONSIBILITY_REESTABLISHMENT · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_06.atomic_work_unit_ledger  [MEASURED · SET]
  ep_07.family_a_work_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_07.family_b_work_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_07.family_a_atomic_unit_count  [MEASURED · SCALAR]
  ep_07.family_b_atomic_unit_count  [MEASURED · SCALAR]
  ep_07.attribution_ambiguous_unit_count  [MEASURED · SCALAR]
  ep_07.family_a_evidence_status  [MEASURED · SYMBOL]  parmi { DIRECT_DURABLE · DETERMINISTIC_DERIVATION · NOT_ESTABLISHED · CONTRADICTED }
  ep_07.family_b_evidence_status  [MEASURED · SYMBOL]  parmi { DIRECT_DURABLE · DETERMINISTIC_DERIVATION · NOT_ESTABLISHED · CONTRADICTED }
  ep_07.family_a_consequences  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_07.family_b_consequences  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_07.family_a_realized_drift_or_error  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_07.family_b_realized_drift_or_error  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_07.reconstruction_recovery_demonstrated  [MEASURED · SET]  parmi { FRESH_SESSION_RECONSTRUCTION · RESUMPTION_AFTER_STOP_OR_BLOCK · MANUAL_CONTEXT_REASSEMBLY · MANUAL_ROUTE_OR_RESPONSIBILITY_REESTABLISHMENT · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_07.atomic_work_unit_ledger  [MEASURED · SET]
  ep_08.family_a_work_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_08.family_b_work_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_08.family_a_atomic_unit_count  [MEASURED · SCALAR]
  ep_08.family_b_atomic_unit_count  [MEASURED · SCALAR]
  ep_08.attribution_ambiguous_unit_count  [MEASURED · SCALAR]
  ep_08.family_a_evidence_status  [MEASURED · SYMBOL]  parmi { DIRECT_DURABLE · DETERMINISTIC_DERIVATION · NOT_ESTABLISHED · CONTRADICTED }
  ep_08.family_b_evidence_status  [MEASURED · SYMBOL]  parmi { DIRECT_DURABLE · DETERMINISTIC_DERIVATION · NOT_ESTABLISHED · CONTRADICTED }
  ep_08.family_a_consequences  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_08.family_b_consequences  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_08.family_a_realized_drift_or_error  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_08.family_b_realized_drift_or_error  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_08.reconstruction_recovery_demonstrated  [MEASURED · SET]  parmi { FRESH_SESSION_RECONSTRUCTION · RESUMPTION_AFTER_STOP_OR_BLOCK · MANUAL_CONTEXT_REASSEMBLY · MANUAL_ROUTE_OR_RESPONSIBILITY_REESTABLISHMENT · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_08.atomic_work_unit_ledger  [MEASURED · SET]
  ep_09.family_a_work_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_09.family_b_work_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_09.family_a_atomic_unit_count  [MEASURED · SCALAR]
  ep_09.family_b_atomic_unit_count  [MEASURED · SCALAR]
  ep_09.attribution_ambiguous_unit_count  [MEASURED · SCALAR]
  ep_09.family_a_evidence_status  [MEASURED · SYMBOL]  parmi { DIRECT_DURABLE · DETERMINISTIC_DERIVATION · NOT_ESTABLISHED · CONTRADICTED }
  ep_09.family_b_evidence_status  [MEASURED · SYMBOL]  parmi { DIRECT_DURABLE · DETERMINISTIC_DERIVATION · NOT_ESTABLISHED · CONTRADICTED }
  ep_09.family_a_consequences  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_09.family_b_consequences  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_09.family_a_realized_drift_or_error  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_09.family_b_realized_drift_or_error  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_09.reconstruction_recovery_demonstrated  [MEASURED · SET]  parmi { FRESH_SESSION_RECONSTRUCTION · RESUMPTION_AFTER_STOP_OR_BLOCK · MANUAL_CONTEXT_REASSEMBLY · MANUAL_ROUTE_OR_RESPONSIBILITY_REESTABLISHMENT · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_09.atomic_work_unit_ledger  [MEASURED · SET]
  ep_10.family_a_work_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_10.family_b_work_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_10.family_a_atomic_unit_count  [MEASURED · SCALAR]
  ep_10.family_b_atomic_unit_count  [MEASURED · SCALAR]
  ep_10.attribution_ambiguous_unit_count  [MEASURED · SCALAR]
  ep_10.family_a_evidence_status  [MEASURED · SYMBOL]  parmi { DIRECT_DURABLE · DETERMINISTIC_DERIVATION · NOT_ESTABLISHED · CONTRADICTED }
  ep_10.family_b_evidence_status  [MEASURED · SYMBOL]  parmi { DIRECT_DURABLE · DETERMINISTIC_DERIVATION · NOT_ESTABLISHED · CONTRADICTED }
  ep_10.family_a_consequences  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_10.family_b_consequences  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_10.family_a_realized_drift_or_error  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_10.family_b_realized_drift_or_error  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_10.reconstruction_recovery_demonstrated  [MEASURED · SET]  parmi { FRESH_SESSION_RECONSTRUCTION · RESUMPTION_AFTER_STOP_OR_BLOCK · MANUAL_CONTEXT_REASSEMBLY · MANUAL_ROUTE_OR_RESPONSIBILITY_REESTABLISHMENT · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_10.atomic_work_unit_ledger  [MEASURED · SET]
  ep_11.family_a_work_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_11.family_b_work_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_11.family_a_atomic_unit_count  [MEASURED · SCALAR]
  ep_11.family_b_atomic_unit_count  [MEASURED · SCALAR]
  ep_11.attribution_ambiguous_unit_count  [MEASURED · SCALAR]
  ep_11.family_a_evidence_status  [MEASURED · SYMBOL]  parmi { DIRECT_DURABLE · DETERMINISTIC_DERIVATION · NOT_ESTABLISHED · CONTRADICTED }
  ep_11.family_b_evidence_status  [MEASURED · SYMBOL]  parmi { DIRECT_DURABLE · DETERMINISTIC_DERIVATION · NOT_ESTABLISHED · CONTRADICTED }
  ep_11.family_a_consequences  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_11.family_b_consequences  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_11.family_a_realized_drift_or_error  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_11.family_b_realized_drift_or_error  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_11.reconstruction_recovery_demonstrated  [MEASURED · SET]  parmi { FRESH_SESSION_RECONSTRUCTION · RESUMPTION_AFTER_STOP_OR_BLOCK · MANUAL_CONTEXT_REASSEMBLY · MANUAL_ROUTE_OR_RESPONSIBILITY_REESTABLISHMENT · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_11.atomic_work_unit_ledger  [MEASURED · SET]
  ep_12.family_a_work_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_12.family_b_work_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_12.family_a_atomic_unit_count  [MEASURED · SCALAR]
  ep_12.family_b_atomic_unit_count  [MEASURED · SCALAR]
  ep_12.attribution_ambiguous_unit_count  [MEASURED · SCALAR]
  ep_12.family_a_evidence_status  [MEASURED · SYMBOL]  parmi { DIRECT_DURABLE · DETERMINISTIC_DERIVATION · NOT_ESTABLISHED · CONTRADICTED }
  ep_12.family_b_evidence_status  [MEASURED · SYMBOL]  parmi { DIRECT_DURABLE · DETERMINISTIC_DERIVATION · NOT_ESTABLISHED · CONTRADICTED }
  ep_12.family_a_consequences  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_12.family_b_consequences  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_12.family_a_realized_drift_or_error  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_12.family_b_realized_drift_or_error  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_12.reconstruction_recovery_demonstrated  [MEASURED · SET]  parmi { FRESH_SESSION_RECONSTRUCTION · RESUMPTION_AFTER_STOP_OR_BLOCK · MANUAL_CONTEXT_REASSEMBLY · MANUAL_ROUTE_OR_RESPONSIBILITY_REESTABLISHMENT · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_12.atomic_work_unit_ledger  [MEASURED · SET]
  ep_13.family_a_work_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_13.family_b_work_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_13.family_a_atomic_unit_count  [MEASURED · SCALAR]
  ep_13.family_b_atomic_unit_count  [MEASURED · SCALAR]
  ep_13.attribution_ambiguous_unit_count  [MEASURED · SCALAR]
  ep_13.family_a_evidence_status  [MEASURED · SYMBOL]  parmi { DIRECT_DURABLE · DETERMINISTIC_DERIVATION · NOT_ESTABLISHED · CONTRADICTED }
  ep_13.family_b_evidence_status  [MEASURED · SYMBOL]  parmi { DIRECT_DURABLE · DETERMINISTIC_DERIVATION · NOT_ESTABLISHED · CONTRADICTED }
  ep_13.family_a_consequences  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_13.family_b_consequences  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_13.family_a_realized_drift_or_error  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_13.family_b_realized_drift_or_error  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_13.reconstruction_recovery_demonstrated  [MEASURED · SET]  parmi { FRESH_SESSION_RECONSTRUCTION · RESUMPTION_AFTER_STOP_OR_BLOCK · MANUAL_CONTEXT_REASSEMBLY · MANUAL_ROUTE_OR_RESPONSIBILITY_REESTABLISHMENT · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_13.atomic_work_unit_ledger  [MEASURED · SET]
  ep_14.family_a_work_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_14.family_b_work_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_14.family_a_atomic_unit_count  [MEASURED · SCALAR]
  ep_14.family_b_atomic_unit_count  [MEASURED · SCALAR]
  ep_14.attribution_ambiguous_unit_count  [MEASURED · SCALAR]
  ep_14.family_a_evidence_status  [MEASURED · SYMBOL]  parmi { DIRECT_DURABLE · DETERMINISTIC_DERIVATION · NOT_ESTABLISHED · CONTRADICTED }
  ep_14.family_b_evidence_status  [MEASURED · SYMBOL]  parmi { DIRECT_DURABLE · DETERMINISTIC_DERIVATION · NOT_ESTABLISHED · CONTRADICTED }
  ep_14.family_a_consequences  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_14.family_b_consequences  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_14.family_a_realized_drift_or_error  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_14.family_b_realized_drift_or_error  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_14.reconstruction_recovery_demonstrated  [MEASURED · SET]  parmi { FRESH_SESSION_RECONSTRUCTION · RESUMPTION_AFTER_STOP_OR_BLOCK · MANUAL_CONTEXT_REASSEMBLY · MANUAL_ROUTE_OR_RESPONSIBILITY_REESTABLISHMENT · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_14.atomic_work_unit_ledger  [MEASURED · SET]
  ep_15.family_a_work_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_15.family_b_work_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_15.family_a_atomic_unit_count  [MEASURED · SCALAR]
  ep_15.family_b_atomic_unit_count  [MEASURED · SCALAR]
  ep_15.attribution_ambiguous_unit_count  [MEASURED · SCALAR]
  ep_15.family_a_evidence_status  [MEASURED · SYMBOL]  parmi { DIRECT_DURABLE · DETERMINISTIC_DERIVATION · NOT_ESTABLISHED · CONTRADICTED }
  ep_15.family_b_evidence_status  [MEASURED · SYMBOL]  parmi { DIRECT_DURABLE · DETERMINISTIC_DERIVATION · NOT_ESTABLISHED · CONTRADICTED }
  ep_15.family_a_consequences  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_15.family_b_consequences  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_15.family_a_realized_drift_or_error  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_15.family_b_realized_drift_or_error  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_15.reconstruction_recovery_demonstrated  [MEASURED · SET]  parmi { FRESH_SESSION_RECONSTRUCTION · RESUMPTION_AFTER_STOP_OR_BLOCK · MANUAL_CONTEXT_REASSEMBLY · MANUAL_ROUTE_OR_RESPONSIBILITY_REESTABLISHMENT · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_15.atomic_work_unit_ledger  [MEASURED · SET]
  family_a_handoff_routing.admissible_episodes_with_family_work  [MEASURED · SCALAR]
  family_a_handoff_routing.atomic_manual_unit_count  [MEASURED · SCALAR]
  family_a_handoff_routing.episodes_with_material_consequence  [MEASURED · SCALAR]
  family_a_handoff_routing.episodes_with_blocking  [MEASURED · SCALAR]
  family_a_handoff_routing.episodes_with_rework_or_correction  [MEASURED · SCALAR]
  family_a_handoff_routing.episodes_with_workaround  [MEASURED · SCALAR]
  family_a_handoff_routing.episodes_with_recovery_or_resumption_cost  [MEASURED · SCALAR]
  family_a_handoff_routing.episodes_with_realized_drift_or_error  [MEASURED · SCALAR]
  family_a_handoff_routing.episodes_with_not_established_consequence  [MEASURED · SCALAR]
  family_a_handoff_routing.attribution_ambiguous_units_excluded  [MEASURED · SCALAR]
  family_a_handoff_routing.existing_surface_sufficiency  [MEASURED · SYMBOL]  parmi { SUFFICIENT · SUFFICIENT_WITH_ORDINARY_ORCHESTRATION · CONCRETE_TOOLING_GAP_CANDIDATE · INCONCLUSIVE }
  family_a_handoff_routing.automation_tooling_case  [MEASURED · SYMBOL]  parmi { DEMONSTRATED · NOT_DEMONSTRATED · INCONCLUSIVE }
  family_a_handoff_routing.tooling_case_gate_t1_repeated_in_two_episodes  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  family_a_handoff_routing.tooling_case_gate_t2_material_consequence  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  family_a_handoff_routing.tooling_case_gate_t3_stable_bounded_responsibility  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  family_a_handoff_routing.tooling_case_gate_t4_not_prompt_size_or_missing_evidence  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  family_a_handoff_routing.tooling_case_gate_t5_existing_surfaces_insufficient  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  family_a_handoff_routing.tooling_case_gate_t6_bounded_opportunity_without_new_semantics  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  family_b_context_package.admissible_episodes_with_family_work  [MEASURED · SCALAR]
  family_b_context_package.atomic_manual_unit_count  [MEASURED · SCALAR]
  family_b_context_package.episodes_with_material_consequence  [MEASURED · SCALAR]
  family_b_context_package.episodes_with_blocking  [MEASURED · SCALAR]
  family_b_context_package.episodes_with_rework_or_correction  [MEASURED · SCALAR]
  family_b_context_package.episodes_with_workaround  [MEASURED · SCALAR]
  family_b_context_package.episodes_with_recovery_or_resumption_cost  [MEASURED · SCALAR]
  family_b_context_package.episodes_with_realized_drift_or_error  [MEASURED · SCALAR]
  family_b_context_package.episodes_with_not_established_consequence  [MEASURED · SCALAR]
  family_b_context_package.attribution_ambiguous_units_excluded  [MEASURED · SCALAR]
  family_b_context_package.existing_surface_sufficiency  [MEASURED · SYMBOL]  parmi { SUFFICIENT · SUFFICIENT_WITH_ORDINARY_ORCHESTRATION · CONCRETE_TOOLING_GAP_CANDIDATE · INCONCLUSIVE }
  family_b_context_package.automation_tooling_case  [MEASURED · SYMBOL]  parmi { DEMONSTRATED · NOT_DEMONSTRATED · INCONCLUSIVE }
  family_b_context_package.tooling_case_gate_t1_repeated_in_two_episodes  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  family_b_context_package.tooling_case_gate_t2_material_consequence  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  family_b_context_package.tooling_case_gate_t3_stable_bounded_responsibility  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  family_b_context_package.tooling_case_gate_t4_not_prompt_size_or_missing_evidence  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  family_b_context_package.tooling_case_gate_t5_existing_surfaces_insufficient  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  family_b_context_package.tooling_case_gate_t6_bounded_opportunity_without_new_semantics  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  comparison.winner_eligibility_family_a  [MEASURED · SYMBOL]  parmi { YES · NO }
  comparison.winner_eligibility_family_b  [MEASURED · SYMBOL]  parmi { YES · NO }
  comparison.dimension_1_episodes_with_material_consequence  [MEASURED · SYMBOL]  parmi { A_HIGHER · B_HIGHER · TIE · NOT_APPLICABLE }
  comparison.dimension_2_episodes_with_severe_consequence_classes  [MEASURED · SYMBOL]  parmi { A_HIGHER · B_HIGHER · TIE · NOT_APPLICABLE }
  comparison.dimension_3_episodes_with_realized_drift_or_error  [MEASURED · SYMBOL]  parmi { A_HIGHER · B_HIGHER · TIE · NOT_APPLICABLE }
  comparison.dimension_4_distinct_episodes_with_family_work  [MEASURED · SYMBOL]  parmi { A_HIGHER · B_HIGHER · TIE · NOT_APPLICABLE }
  comparison.dimension_5_atomic_manual_units  [MEASURED · SYMBOL]  parmi { A_HIGHER · B_HIGHER · TIE · NOT_APPLICABLE }
  comparison.decided_at_dimension  [MEASURED · SYMBOL]  parmi { DIM_1 · DIM_2 · DIM_3 · DIM_4 · DIM_5 · NONE }
  study.final_comparative_recommendation  [MEASURED · SYMBOL]  parmi { HANDOFF_ROUTING · CONTEXT_PACKAGE · NEITHER_CURRENTLY_JUSTIFIED · INCONCLUSIVE_ON_DURABLE_EVIDENCE }
  study.recommendation_basis  [MEASURED · SET]
  study.concrete_representation_gap_candidate  [MEASURED · SYMBOL]  parmi { PRESENT · ABSENT · NOT_ESTABLISHED }
  study.concrete_representation_gap_record  [MEASURED · SET]
  study.limitations  [MEASURED · SET]
  study.blockers  [MEASURED · SET]
  study.procedural_success  [MEASURED · SYMBOL]  parmi { PROCEDURALLY_SUCCESSFUL · NOT_SUCCESSFUL }

CONSÉQUENCES SUIVANTES
----------------------
  nc-return  [HUMAN_GATE]  RETURN_FROZEN_RESULT_INSTANCE → remaining_manual_orchestration_work_study_qualification

CONTRAINTES PERMANENTES — DÉCLARATION SEULE
-------------------------------------------
  sc-no-representation-design  FORBIDDEN             DESIGN_REPRESENTATION → ref-return
      levée si  PRESENCE_OF(new_ratified_human_design_decision) EQ true
  sc-no-tooling-experiment  FORBIDDEN             CREATE_TOOLING_EXPERIMENT → ref-return
      levée si  PRESENCE_OF(new_ratified_human_experiment_decision) EQ true
  sc-no-persistence-by-executor  FORBIDDEN             COMMIT → ref-return
      levée si  PRESENCE_OF(new_ratified_authority) EQ true
  sc-no-eol-remediation  FORBIDDEN             MODIFY_GITATTRIBUTES → ref-return
      levée si  PRESENCE_OF(new_ratified_human_eol_decision) EQ true

Puis STOP.
