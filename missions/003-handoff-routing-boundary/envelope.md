MISSION handoff-routing-boundary-bounded-rd-study-003
=====================================================

DESTINATAIRE    = AGENT_CCR_LAB_27
PROJET CIBLE    = CCR_SOFTWARE_ENGINEERING_LAB
CLASSE          = HANDOFF_ROUTING_BOUNDED_RD_STUDY

CONTEXTE — NON NORMATIF
-----------------------
  study.program_direction = HANDOFF_ROUTING
  study.material_core = { EP-02 · EP-03 · EP-04 }
  study.recurrence_context = 20
  study.current_surface_sufficiency = SUFFICIENT_WITH_ORDINARY_ORCHESTRATION
  study.human_authority_invariant = HUMAN_DECISION_IS_NOT_A_DETERMINISTIC_CONSEQUENCE
  study.analytical_outcome_domain = 5
  study.outcome_partition = ORDERED_RULES_0_TO_5_DETERMINISTIC
  study.semantic_gap_is_not_a_response = CANDIDATE_ONLY
  study.payload_is_not_friction = FORBIDDEN_PROXY

AUTORITÉS ET RÉFÉRENCES
-----------------------
  ref-auth46  [AUTHORITY]  REPO_PATH 46-REMAINING-MANUAL-ORCHESTRATION-WORK-INDEPENDENT-QUALIFICATION-AND-HANDOFF-ROUTING-SELECTION.md  GIT_BLOB 42a3a99d7aa53755971f5736904da2546d90b0e7  identité EXIGÉE
  ref-auth47  [AUTHORITY]  REPO_PATH 47-HANDOFF-ROUTING-BOUNDED-RD-QUESTION-FREEZE.md  identité non exigée
  ref-auth43  [AUTHORITY]  REPO_PATH 43-REMAINING-MANUAL-ORCHESTRATION-WORK-NEXT-DIRECTION-SELECTION.md  GIT_BLOB feda3a558c086ea1cc9c28c8f574aca1ff110c04  identité EXIGÉE
  ref-auth45  [AUTHORITY]  REPO_PATH 45-REMAINING-MANUAL-ORCHESTRATION-WORK-CURRENT-SURFACE-PERSISTENCE-CORRECTION.md  GIT_BLOB ce744f972223ba273abae5226d4b63eb6778360d  identité EXIGÉE
  ref-auth44  [CONTEXT]  REPO_PATH 44-REMAINING-MANUAL-ORCHESTRATION-WORK-BOUNDED-COMPARATIVE-STUDY-FREEZE.md  GIT_BLOB 950a42805afcd4011e3a042152057f07ff1d82dc  identité EXIGÉE
  ref-auth09  [CONTEXT]  REPO_PATH 09-TOOLING-EXPERIMENT-001-PROGRAM-STATE.md  GIT_BLOB c94e03829e107b51f63efcdb950bfeff123f50d1  identité EXIGÉE
  ref-auth14  [CONTEXT]  REPO_PATH 14-TOOLING-EXPERIMENT-002-MISSION-OBJECT-V0.md  GIT_BLOB 7d634c855ab9de8c66a21c134b03de8f118c3de4  identité EXIGÉE
  ref-auth23  [CONTEXT]  REPO_PATH 23-TOOLING-EXPERIMENT-003-RESULT-INSTANCE-V0.md  GIT_BLOB 1676b3de4546b40a801d0a400b4c47ddd9b82062  identité EXIGÉE
  ref-program-state-live  [VERIFICATION_TARGET]  REPO_PATH PROGRAM-STATE.json  identité non exigée
  ref-program-state-at-freeze-parent  [CONTEXT]  REPO_PATH PROGRAM-STATE.json  GIT_BLOB 0e42d8a9fe1451101fb2a16ffc2784d6d6d08df8  identité EXIGÉE
  ref-result002  [VERIFICATION_TARGET]  REPO_PATH missions/002-remaining-manual-orchestration-work/result.json  GIT_BLOB 1b191ad7e0b3c15195aaafd17b36a52aabf5989f  identité EXIGÉE
  ref-mission002  [CONTEXT]  REPO_PATH missions/002-remaining-manual-orchestration-work/mission.json  GIT_BLOB 98817247d6bf140406f720385a95acd2b498432a  identité EXIGÉE
  ref-auth34  [VERIFICATION_TARGET]  REPO_PATH 34-DECISION-CONSEQUENCE-BOUNDARY-REAL-USE-MISSION-SELECTION.md  GIT_BLOB 4b6fe11c3499a9a4e17b59d0c9ff49c0fa6bffb5  identité EXIGÉE
  ref-auth35  [VERIFICATION_TARGET]  REPO_PATH 35-DECISION-CONSEQUENCE-BOUNDARY-BOUNDED-MISSION-FREEZE.md  GIT_BLOB 9a067717b3fb5e3daca7a7be3a34b1362b843ea3  identité EXIGÉE
  ref-auth36  [VERIFICATION_TARGET]  REPO_PATH 36-LOCAL-MISSION-CONSOLE-V0-REAL-USE-OBSERVATION-CAPTURE-PROTOCOL.md  GIT_BLOB dc77a8a561b9ec92d05e6996f69c7929beb2c5b2  identité EXIGÉE
  ref-auth37  [VERIFICATION_TARGET]  REPO_PATH 37-DECISION-CONSEQUENCE-BOUNDARY-RESULT-PANEL-C-DURABILITY-ORDERING.md  GIT_BLOB 0fff611a59dabef0ad1b067344287d48b740f74a  identité EXIGÉE
  ref-mission001  [VERIFICATION_TARGET]  REPO_PATH missions/001-decision-consequence-boundary/mission.json  GIT_BLOB e80bc3d250920cee66b4d26bef497b6094395144  identité EXIGÉE
  ref-observations001  [VERIFICATION_TARGET]  REPO_PATH missions/001-decision-consequence-boundary/console-real-use-observations.md  GIT_BLOB af7c57778ba8b34ea814555d91448ef9ae24f1a2  identité EXIGÉE
  ref-return  [DELIVERABLE]  REPO_PATH missions/003-handoff-routing-boundary/result.json  identité non exigée

FRONTIÈRES D’EFFET
------------------
  REQUIRED              READ_QUALIFIED_RESULT → ref-result002  cardinalité 1
  REQUIRED              READ_UNDERLYING_DURABLE_EVIDENCE  cardinalité 1
  REQUIRED              BUILD_CAUSAL_CHAINS  cardinalité 1
  REQUIRED              SEPARATE_ROUTING_FROM_CONTEXT_PACKAGE  cardinalité 1
  REQUIRED              CLASSIFY_RESPONSIBILITIES  cardinalité 1
  REQUIRED              TEST_EXISTING_SURFACES_FIRST  cardinalité 1
  REQUIRED              TEST_ORDINARY_ORCHESTRATION  cardinalité 1
  REQUIRED              APPLY_CONCRETE_GAP_GATE  cardinalité 1
  REQUIRED              RUN_COUNTERFACTUAL_REMOVAL_TEST  cardinalité 1
  REQUIRED              DETERMINE_RESIDUAL_HUMAN_AUTHORITY  cardinalité 1
  REQUIRED              APPLY_ORDERED_OUTCOME_PARTITION  cardinalité 1
  REQUIRED              DERIVE_FINAL_ANALYTICAL_OUTCOME  cardinalité 1
  REQUIRED              PRODUCE_RESULT_INSTANCE → ref-return  cardinalité 1
  REQUIRED              VALIDATE_RESULT_INSTANCE  cardinalité 1
  REQUIRED              FREEZE_RESULT_INSTANCE  cardinalité 1
  FORBIDDEN             RECONSTRUCT_FROM_CONVERSATION  cardinalité 0
  FORBIDDEN             USE_SESSION_PROSE  cardinalité 0
  FORBIDDEN             READ_CCR_SYSTEM_REPOSITORY  cardinalité 0
  FORBIDDEN             READ_PROTECTED_SOURCE  cardinalité 0
  FORBIDDEN             READ_EXTERNAL_WEB  cardinalité 0
  FORBIDDEN             ADD_MATERIAL_CORE_CASE  cardinalité 0
  FORBIDDEN             INVENT_WORK_UNIT  cardinalité 0
  FORBIDDEN             EXTEND_RESPONSIBILITY_INVENTORY  cardinalité 0
  FORBIDDEN             INFER_GAP_FROM_MANUAL_WORK  cardinalité 0
  FORBIDDEN             TREAT_REPETITION_AS_HUMAN_DECISION  cardinalité 0
  FORBIDDEN             TREAT_DETERMINISTIC_AS_AUTOMATED  cardinalité 0
  FORBIDDEN             COUNT_HUMAN_AUTHORITY_AS_REMOVABLE  cardinalité 0
  FORBIDDEN             USE_PAYLOAD_SIZE_AS_PROXY  cardinalité 0
  FORBIDDEN             INVENT_SYNTHETIC_SCORE  cardinalité 0
  FORBIDDEN             INVENT_SIXTH_OUTCOME  cardinalité 0
  FORBIDDEN             RELABEL_SEMANTIC_GAP_AS_INTEGRATION  cardinalité 0
  FORBIDDEN             RELABEL_SEMANTIC_GAP_AS_INSUFFICIENT_EVIDENCE  cardinalité 0
  FORBIDDEN             SELECT_NEW_SEMANTIC_PRIMITIVE  cardinalité 0
  FORBIDDEN             INFER_HUMAN_SELECTION_FROM_SEMANTIC_ABSENCE  cardinalité 0
  FORBIDDEN             SELECT_ROUTING_ENGINE  cardinalité 0
  FORBIDDEN             SELECT_NEW_API  cardinalité 0
  FORBIDDEN             DESIGN_REPRESENTATION  cardinalité 0
  FORBIDDEN             CREATE_TOOLING_EXPERIMENT  cardinalité 0
  FORBIDDEN             DESIGN_TECHNICAL_RESPONSE  cardinalité 0
  FORBIDDEN             IMPLEMENT  cardinalité 0
  FORBIDDEN             COMMIT  cardinalité 0
  FORBIDDEN             PUSH  cardinalité 0
  FORBIDDEN             MUTATE_REPOSITORY  cardinalité 0

EXIGENCES DE CONTENU
--------------------
  CLAIM / ASSERT  study.material_core_cases_evaluated  EQUALS  3   [cible ref-return · portée MISSION]
  CLAIM / ASSERT  study.recurrence_context_units_evaluated  EQUALS  20   [cible ref-return · portée MISSION]
  CLAIM / ASSERT  discipline.conversation_factual_reconstruction_count  EQUALS  0   [cible ref-return · portée MISSION]
  CLAIM / ASSERT  discipline.session_prose_fallback_count  EQUALS  0   [cible ref-return · portée MISSION]
  CLAIM / ASSERT  discipline.ccr_system_source_usage_count  EQUALS  0   [cible ref-return · portée MISSION]
  CLAIM / ASSERT  discipline.protected_source_usage_count  EQUALS  0   [cible ref-return · portée MISSION]
  CLAIM / ASSERT  discipline.external_web_usage_count  EQUALS  0   [cible ref-return · portée MISSION]
  CLAIM / ASSERT  discipline.repository_mutations_other_than_result  EQUALS  0   [cible ref-return · portée MISSION]
  CLAIM / ASSERT  discipline.executor_commit_count  EQUALS  0   [cible ref-return · portée MISSION]
  CLAIM / ASSERT  discipline.executor_push_count  EQUALS  0   [cible ref-return · portée MISSION]
  FORBID_CLAIM  study.routing_engine_selected  EQUALS  YES   [cible ref-return · portée MISSION]
  FORBID_CLAIM  study.new_api_selected  EQUALS  YES   [cible ref-return · portée MISSION]
  FORBID_CLAIM  study.representation_design  EQUALS  PRESENT   [cible ref-return · portée MISSION]
  FORBID_CLAIM  study.new_tooling_experiment  EQUALS  SELECTED   [cible ref-return · portée MISSION]
  FORBID_CLAIM  study.technical_response_selected  EQUALS  YES   [cible ref-return · portée MISSION]
  FORBID_CLAIM  study.implementation  EQUALS  PERFORMED   [cible ref-return · portée MISSION]
  FORBID_CLAIM  study.gap_inferred_from_manual_work_alone  EQUALS  YES   [cible ref-return · portée MISSION]
  FORBID_CLAIM  study.human_substantive_decision_counted_removable  EQUALS  YES   [cible ref-return · portée MISSION]
  FORBID_CLAIM  study.payload_size_used_as_proxy  EQUALS  YES   [cible ref-return · portée MISSION]
  FORBID_CLAIM  study.synthetic_score  EQUALS  PRESENT   [cible ref-return · portée MISSION]
  FORBID_CLAIM  study.material_core_extended  EQUALS  YES   [cible ref-return · portée MISSION]
  FORBID_CLAIM  study.responsibility_inventory_extended  EQUALS  YES   [cible ref-return · portée MISSION]
  FORBID_CLAIM  study.sixth_analytical_outcome  EQUALS  PRESENT   [cible ref-return · portée MISSION]
  FORBID_CLAIM  study.semantic_gap_relabelled  EQUALS  YES   [cible ref-return · portée MISSION]
  FORBID_CLAIM  study.new_semantic_primitive_selected  EQUALS  YES   [cible ref-return · portée MISSION]
  CLAIM / ASSERT  study.matched_outcome_count  EQUALS  1   [cible ref-return · portée MISSION]

PROCÉDURE
---------
  ORDRE STRICT — aucune étape ne se fond dans une autre
  1. s-read-qualified  effet e-read-qualified  [atomique]  [après porte g-preflight]
  2. s-read-underlying  effet e-read-underlying  [atomique]  [produit ev-underlying]
  3. s-chains  effet e-build-chains  [atomique]  [produit ev-chains]
  4. s-separate  effet e-separate-families  [atomique]  [après porte g-scope-preserved]
  5. s-classify  effet e-classify  [atomique]  [produit ev-classification]
  6. s-surfaces  effet e-existing-surface-test  [atomique]  [produit ev-surfaces]
  7. s-join  effet e-ordinary-join-test  [atomique]
  8. s-gap  effet e-gap-gate  [atomique]  [après porte g-existing-surface-first]
  9. s-counterfactual  effet e-counterfactual  [atomique]
  10. s-residual  effet e-residual  [atomique]
  11. s-partition  effet e-partition  [atomique]  [après porte g-partition-consistent]
  12. s-outcome  effet e-outcome  [atomique]  [après porte g-no-forbidden-source]
  13. s-produce  effet e-produce-result  [atomique]
  14. s-validate  effet e-validate-result  [atomique]  [produit ev-result-validation]
  15. s-freeze  effet e-freeze-result  [atomique]

PORTES
------
  g-preflight  [portée ALL_PRECEDING]
      exige   REPO_FACT(BRANCH) EQ main  ET  REPO_FACT(WORKTREE_CLEAN) EQ true  ET  ARTIFACT_IDENTITY(ref-auth46) EQ 42a3a99d7aa53755971f5736904da2546d90b0e7  ET  ARTIFACT_IDENTITY(ref-result002) EQ 1b191ad7e0b3c15195aaafd17b36a52aabf5989f  ET  COUNT_OF(MEASUREMENT(reserved_result_path_existing)) EQ 0
      échec → sr-preflight
  g-scope-preserved  [portée ALL_PRECEDING]
      exige   OPERATION_RESULT(e-build-chains).material_core_case_count EQ 3  ET  OPERATION_RESULT(e-build-chains).recurrence_unit_count EQ 20  ET  OPERATION_RESULT(e-build-chains).responsibility_type_count EQ 8
      échec → sr-scope
  g-existing-surface-first  [portée ALL_PRECEDING]
      exige   OPERATION_RESULT(e-existing-surface-test).surfaces_tested_before_gap_claim EQ true  ET  OPERATION_RESULT(e-ordinary-join-test).ordinary_join_tested_before_new_semantics EQ true
      échec → sr-surface-first
  g-partition-consistent  [portée ALL_PRECEDING]
      exige   OPERATION_RESULT(e-partition).consistency_rule_violations EQ 0  ET  OPERATION_RESULT(e-partition).matched_outcome_count EQ 1
      échec → sr-partition
  g-no-forbidden-source  [portée ALL_PRECEDING]
      exige   COUNT_OF(MEASUREMENT(conversation_factual_reconstruction)) EQ 0  ET  COUNT_OF(MEASUREMENT(session_prose_fallback)) EQ 0  ET  COUNT_OF(MEASUREMENT(ccr_system_source_usage)) EQ 0  ET  COUNT_OF(MEASUREMENT(protected_source_usage)) EQ 0
      échec → sr-forbidden-source

CONDITIONS D’ARRÊT
------------------
  sr-preflight  si  REPO_FACT(preflight_match) NEQ true
      FORBIDDEN             CLEAN
      FORBIDDEN             RESET
      FORBIDDEN             RESTORE
      FORBIDDEN             FETCH
      exigé   REPORT
      STOP
  sr-scope  si  OPERATION_RESULT(e-build-chains).material_core_case_count NEQ 3
      FORBIDDEN             ADD_MATERIAL_CORE_CASE
      FORBIDDEN             EXTEND_RESPONSIBILITY_INVENTORY
      exigé   REPORT
      STOP
  sr-surface-first  si  OPERATION_RESULT(e-existing-surface-test).surfaces_tested_before_gap_claim NEQ true
      FORBIDDEN             INFER_GAP_FROM_MANUAL_WORK
      FORBIDDEN             POSIT_NEW_SEMANTIC_PRIMITIVE
      exigé   REPORT
      STOP
  sr-forbidden-source  si  COUNT_OF(MEASUREMENT(forbidden_source_usage)) NEQ 0
      FORBIDDEN             RECONSTRUCT_FROM_CONVERSATION
      FORBIDDEN             USE_SESSION_PROSE
      exigé   REPORT
      STOP
  sr-partition  si  OPERATION_RESULT(e-partition).matched_outcome_count NEQ 1
      FORBIDDEN             INVENT_SIXTH_OUTCOME
      FORBIDDEN             RELABEL_SEMANTIC_GAP_AS_INTEGRATION
      exigé   REPORT
      STOP
  sr-mutation  si  COUNT_OF(MEASUREMENT(repository_mutations_other_than_result)) NEQ 0
      FORBIDDEN             COMMIT
      FORBIDDEN             PUSH
      exigé   REPORT
      STOP

BRANCHES
--------

  BRANCHE br-ordinary-sufficient  si  OPERATION_RESULT(e-outcome).outcome EQ ORDINARY_ORCHESTRATION_SUFFICIENT
      résultat terminal   ORDINARY_ORCHESTRATION_SUFFICIENT
      conséquence         nc-return
      étape 1. s-br-ordinary-sufficient-produce  effet e-produce-result
      étape 2. s-br-ordinary-sufficient-validate  effet e-validate-result
      étape 3. s-br-ordinary-sufficient-freeze  effet e-freeze-result
      FORBIDDEN             IMPLEMENT  cardinalité 0
      CLAIM / ASSERT  study.final_analytical_outcome  EQUALS  ORDINARY_ORCHESTRATION_SUFFICIENT   [cible ref-return · portée br-ordinary-sufficient]

  BRANCHE br-bounded-opportunity  si  OPERATION_RESULT(e-outcome).outcome EQ BOUNDED_INTEGRATION_OPPORTUNITY
      résultat terminal   BOUNDED_INTEGRATION_OPPORTUNITY
      conséquence         nc-return
      étape 1. s-br-bounded-opportunity-produce  effet e-produce-result
      étape 2. s-br-bounded-opportunity-validate  effet e-validate-result
      étape 3. s-br-bounded-opportunity-freeze  effet e-freeze-result
      FORBIDDEN             SELECT_ROUTING_ENGINE  cardinalité 0
      CLAIM / ASSERT  study.final_analytical_outcome  EQUALS  BOUNDED_INTEGRATION_OPPORTUNITY   [cible ref-return · portée br-bounded-opportunity]

  BRANCHE br-human-dominates  si  OPERATION_RESULT(e-outcome).outcome EQ HUMAN_DECISION_DOMINATES
      résultat terminal   HUMAN_DECISION_DOMINATES
      conséquence         nc-return
      étape 1. s-br-human-dominates-produce  effet e-produce-result
      étape 2. s-br-human-dominates-validate  effet e-validate-result
      étape 3. s-br-human-dominates-freeze  effet e-freeze-result
      FORBIDDEN             INVALIDATE_PROGRAM_DIRECTION  cardinalité 0
      CLAIM / ASSERT  study.final_analytical_outcome  EQUALS  HUMAN_DECISION_DOMINATES   [cible ref-return · portée br-human-dominates]

  BRANCHE br-semantic-gap  si  OPERATION_RESULT(e-outcome).outcome EQ CONCRETE_ROUTING_SEMANTIC_GAP_CANDIDATE
      résultat terminal   CONCRETE_ROUTING_SEMANTIC_GAP_CANDIDATE
      conséquence         nc-return
      étape 1. s-br-semantic-gap-produce  effet e-produce-result
      étape 2. s-br-semantic-gap-validate  effet e-validate-result
      étape 3. s-br-semantic-gap-freeze  effet e-freeze-result
      FORBIDDEN             DESIGN_REPRESENTATION  cardinalité 0
      FORBIDDEN             SELECT_NEW_SEMANTIC_PRIMITIVE  cardinalité 0
      FORBIDDEN             CREATE_TOOLING_EXPERIMENT  cardinalité 0
      CLAIM / ASSERT  study.final_analytical_outcome  EQUALS  CONCRETE_ROUTING_SEMANTIC_GAP_CANDIDATE   [cible ref-return · portée br-semantic-gap]

  BRANCHE br-insufficient-evidence  si  OPERATION_RESULT(e-outcome).outcome EQ INSUFFICIENT_DURABLE_EVIDENCE
      résultat terminal   INSUFFICIENT_DURABLE_EVIDENCE
      conséquence         nc-return
      étape 1. s-br-insufficient-evidence-produce  effet e-produce-result
      étape 2. s-br-insufficient-evidence-validate  effet e-validate-result
      étape 3. s-br-insufficient-evidence-freeze  effet e-freeze-result
      FORBIDDEN             INVENT_FACT  cardinalité 0
      CLAIM / ASSERT  study.final_analytical_outcome  EQUALS  INSUFFICIENT_DURABLE_EVIDENCE   [cible ref-return · portée br-insufficient-evidence]

AUTORITÉ HUMAINE
----------------
  RATIFIÉ       handoff_routing_next_lab_direction_selected   [autorité ref-auth46]
  DÉTERMINÉ     nc-return

EXIGENCES DE PREUVE
-------------------
  ev-underlying  [OBSERVATION]  study.underlying_durable_evidence   méthode EQ depuis ref-auth35 · recalcul exigé
      source interdite  session_prose · conversation_transcript
  ev-chains  [OBSERVATION]  study.causal_chains   méthode EQ depuis ref-result002 · recalcul exigé
      source interdite  session_prose · conversation_transcript
  ev-classification  [VERIFICATION]  study.responsibility_classification   méthode EQ depuis ref-auth47 · recalcul exigé
      source interdite  session_prose · conversation_transcript
  ev-surfaces  [VERIFICATION]  study.existing_surface_capability   méthode EQ depuis ref-program-state-live · recalcul exigé
      source interdite  session_prose · conversation_transcript
  ev-result-validation  [VERIFICATION]  result_instance.structural_validation   méthode EQ depuis ref-return · recalcul exigé
      source interdite  session_prose · conversation_transcript

RÉSULTATS TERMINAUX ET SUCCÈS PARTIEL
-------------------------------------

  ORDINARY_ORCHESTRATION_SUFFICIENT  valide si  OPERATION_RESULT(e-outcome).outcome EQ ORDINARY_ORCHESTRATION_SUFFICIENT  ET  OPERATION_RESULT(e-validate-result).status EQ PASS
      état partiel admis            NON
      état atteint à préserver      OUI
      conséquence                   nc-return
      état résultant  CLAIM / ASSERT  result_instance.frozen  EQUALS  YES   [cible ref-return · portée MISSION]

  BOUNDED_INTEGRATION_OPPORTUNITY  valide si  OPERATION_RESULT(e-outcome).outcome EQ BOUNDED_INTEGRATION_OPPORTUNITY  ET  OPERATION_RESULT(e-validate-result).status EQ PASS
      état partiel admis            NON
      état atteint à préserver      OUI
      conséquence                   nc-return
      état résultant  CLAIM / ASSERT  result_instance.frozen  EQUALS  YES   [cible ref-return · portée MISSION]

  HUMAN_DECISION_DOMINATES  valide si  OPERATION_RESULT(e-outcome).outcome EQ HUMAN_DECISION_DOMINATES  ET  OPERATION_RESULT(e-validate-result).status EQ PASS
      état partiel admis            NON
      état atteint à préserver      OUI
      conséquence                   nc-return
      état résultant  CLAIM / ASSERT  result_instance.frozen  EQUALS  YES   [cible ref-return · portée MISSION]

  CONCRETE_ROUTING_SEMANTIC_GAP_CANDIDATE  valide si  OPERATION_RESULT(e-outcome).outcome EQ CONCRETE_ROUTING_SEMANTIC_GAP_CANDIDATE  ET  OPERATION_RESULT(e-validate-result).status EQ PASS
      état partiel admis            NON
      état atteint à préserver      OUI
      conséquence                   nc-return
      état résultant  CLAIM / ASSERT  result_instance.frozen  EQUALS  YES   [cible ref-return · portée MISSION]

  INSUFFICIENT_DURABLE_EVIDENCE  valide si  OPERATION_RESULT(e-outcome).outcome EQ INSUFFICIENT_DURABLE_EVIDENCE  ET  OPERATION_RESULT(e-validate-result).status EQ PASS
      état partiel admis            NON
      état atteint à préserver      OUI
      conséquence                   nc-return
      état résultant  CLAIM / ASSERT  result_instance.frozen  EQUALS  YES   [cible ref-return · portée MISSION]

  BLOCKED_NON_CONFORMANT_EXECUTION  valide si  OPERATION_RESULT(e-validate-result).status NEQ PASS
      état partiel admis            NON
      état atteint à préserver      OUI
      conséquence                   nc-return
      état résultant  CLAIM / ASSERT  study.final_analytical_outcome_forced  EQUALS  NO   [cible ref-return · portée MISSION]

  STOPPED_ON_PREFLIGHT  valide si  REPO_FACT(preflight_match) NEQ true
      état partiel admis            NON
      état atteint à préserver      OUI
      conséquence                   nc-return
      état résultant  CLAIM / ASSERT  result_instance.frozen  EQUALS  NO   [cible ref-return · portée MISSION]

RETOUR OBLIGATOIRE
------------------
  study.governing_direction_authority_identity  [MEASURED · SCALAR]
  study.qualified_result_identity  [MEASURED · SCALAR]
  study.material_core_cases_evaluated  [MEASURED · SCALAR]
  study.recurrence_context_units_evaluated  [MEASURED · SCALAR]
  discipline.conversation_factual_reconstruction_count  [MEASURED · SCALAR]
  discipline.session_prose_fallback_count  [MEASURED · SCALAR]
  discipline.ccr_system_source_usage_count  [MEASURED · SCALAR]
  discipline.protected_source_usage_count  [MEASURED · SCALAR]
  discipline.external_web_usage_count  [MEASURED · SCALAR]
  ep_02.trigger  [MEASURED · SCALAR]
  ep_02.required_handoff_routing_responsibility  [MEASURED · SET]  parmi { NEXT_CONTROL_STAGE · ACTOR_OR_SESSION_SELECTION · EXECUTION_BASELINE_ASSIGNMENT · ACTION_AUTHORITY_PROPAGATION · PERSISTENCE_OWNERSHIP · RETURN_DESTINATION · STOP_BOUNDARY · STAGE_ORDERING_DEPENDENCY }
  ep_02.inputs_needed_to_resolve_responsibility  [MEASURED · SET]
  ep_02.existing_durable_sources_of_input  [MEASURED · SET]
  ep_02.current_surfaces_able_to_expose_or_carry_input  [MEASURED · SET]
  ep_02.human_deterministic_classification  [MEASURED · SYMBOL]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  ep_02.ordinary_join_or_propagation_requirement  [MEASURED · SYMBOL]  parmi { REQUIRED · NOT_REQUIRED · NOT_ESTABLISHED }
  ep_02.ordinary_join_or_propagation_description  [MEASURED · SET]
  ep_02.demonstrated_material_consequence  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_02.counterfactual_consequence_removal  [MEASURED · SYMBOL]  parmi { YES · NO · PARTIAL · NOT_ESTABLISHED }
  ep_02.counterfactual_causal_basis  [MEASURED · SET]
  ep_02.residual_human_authority  [MEASURED · SYMBOL]  parmi { NONE · SUBSTANTIVE_SELECTION_REMAINS · VERIFICATION_ONLY · NOT_ESTABLISHED }
  ep_02.durable_evidence_identities  [MEASURED · SET]
  ep_02.required_routing_semantics_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_02.removal_by_existing_procedural_orchestration  [MEASURED · SYMBOL]  parmi { YES · NO · PARTIAL · NOT_ESTABLISHED }
  ep_02.bounded_integration_required  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_02.substantive_human_selection_causally_required  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_02.gap_gate_g4a_procedural_orchestration_does_not_fully_remove_burden  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  ep_02.gap_gate_g4b_remaining_cause_classification  [MEASURED · SYMBOL]  parmi { BOUNDED_INTEGRATION_ABSENT_SEMANTICS_PRESENT · REQUIRED_ROUTING_SEMANTICS_ABSENT · SUBSTANTIVE_HUMAN_SELECTION_REQUIRED · NOT_ESTABLISHED }
  ep_03.trigger  [MEASURED · SCALAR]
  ep_03.required_handoff_routing_responsibility  [MEASURED · SET]  parmi { NEXT_CONTROL_STAGE · ACTOR_OR_SESSION_SELECTION · EXECUTION_BASELINE_ASSIGNMENT · ACTION_AUTHORITY_PROPAGATION · PERSISTENCE_OWNERSHIP · RETURN_DESTINATION · STOP_BOUNDARY · STAGE_ORDERING_DEPENDENCY }
  ep_03.inputs_needed_to_resolve_responsibility  [MEASURED · SET]
  ep_03.existing_durable_sources_of_input  [MEASURED · SET]
  ep_03.current_surfaces_able_to_expose_or_carry_input  [MEASURED · SET]
  ep_03.human_deterministic_classification  [MEASURED · SYMBOL]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  ep_03.ordinary_join_or_propagation_requirement  [MEASURED · SYMBOL]  parmi { REQUIRED · NOT_REQUIRED · NOT_ESTABLISHED }
  ep_03.ordinary_join_or_propagation_description  [MEASURED · SET]
  ep_03.demonstrated_material_consequence  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_03.counterfactual_consequence_removal  [MEASURED · SYMBOL]  parmi { YES · NO · PARTIAL · NOT_ESTABLISHED }
  ep_03.counterfactual_causal_basis  [MEASURED · SET]
  ep_03.residual_human_authority  [MEASURED · SYMBOL]  parmi { NONE · SUBSTANTIVE_SELECTION_REMAINS · VERIFICATION_ONLY · NOT_ESTABLISHED }
  ep_03.durable_evidence_identities  [MEASURED · SET]
  ep_03.required_routing_semantics_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_03.removal_by_existing_procedural_orchestration  [MEASURED · SYMBOL]  parmi { YES · NO · PARTIAL · NOT_ESTABLISHED }
  ep_03.bounded_integration_required  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_03.substantive_human_selection_causally_required  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_03.gap_gate_g4a_procedural_orchestration_does_not_fully_remove_burden  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  ep_03.gap_gate_g4b_remaining_cause_classification  [MEASURED · SYMBOL]  parmi { BOUNDED_INTEGRATION_ABSENT_SEMANTICS_PRESENT · REQUIRED_ROUTING_SEMANTICS_ABSENT · SUBSTANTIVE_HUMAN_SELECTION_REQUIRED · NOT_ESTABLISHED }
  ep_04.trigger  [MEASURED · SCALAR]
  ep_04.required_handoff_routing_responsibility  [MEASURED · SET]  parmi { NEXT_CONTROL_STAGE · ACTOR_OR_SESSION_SELECTION · EXECUTION_BASELINE_ASSIGNMENT · ACTION_AUTHORITY_PROPAGATION · PERSISTENCE_OWNERSHIP · RETURN_DESTINATION · STOP_BOUNDARY · STAGE_ORDERING_DEPENDENCY }
  ep_04.inputs_needed_to_resolve_responsibility  [MEASURED · SET]
  ep_04.existing_durable_sources_of_input  [MEASURED · SET]
  ep_04.current_surfaces_able_to_expose_or_carry_input  [MEASURED · SET]
  ep_04.human_deterministic_classification  [MEASURED · SYMBOL]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  ep_04.ordinary_join_or_propagation_requirement  [MEASURED · SYMBOL]  parmi { REQUIRED · NOT_REQUIRED · NOT_ESTABLISHED }
  ep_04.ordinary_join_or_propagation_description  [MEASURED · SET]
  ep_04.demonstrated_material_consequence  [MEASURED · SET]  parmi { BLOCKING · REWORK_OR_CORRECTION · WORKAROUND · RECOVERY_OR_RESUMPTION_COST · EXTRA_MANUAL_VERIFICATION · SEQUENCING_DEPENDENCY · NONE_DEMONSTRATED · NOT_ESTABLISHED }
  ep_04.counterfactual_consequence_removal  [MEASURED · SYMBOL]  parmi { YES · NO · PARTIAL · NOT_ESTABLISHED }
  ep_04.counterfactual_causal_basis  [MEASURED · SET]
  ep_04.residual_human_authority  [MEASURED · SYMBOL]  parmi { NONE · SUBSTANTIVE_SELECTION_REMAINS · VERIFICATION_ONLY · NOT_ESTABLISHED }
  ep_04.durable_evidence_identities  [MEASURED · SET]
  ep_04.required_routing_semantics_present  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_04.removal_by_existing_procedural_orchestration  [MEASURED · SYMBOL]  parmi { YES · NO · PARTIAL · NOT_ESTABLISHED }
  ep_04.bounded_integration_required  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_04.substantive_human_selection_causally_required  [MEASURED · SYMBOL]  parmi { YES · NO · NOT_ESTABLISHED }
  ep_04.gap_gate_g4a_procedural_orchestration_does_not_fully_remove_burden  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  ep_04.gap_gate_g4b_remaining_cause_classification  [MEASURED · SYMBOL]  parmi { BOUNDED_INTEGRATION_ABSENT_SEMANTICS_PRESENT · REQUIRED_ROUTING_SEMANTICS_ABSENT · SUBSTANTIVE_HUMAN_SELECTION_REQUIRED · NOT_ESTABLISHED }
  unit_u01.responsibility_types  [MEASURED · SET]  parmi { NEXT_CONTROL_STAGE · ACTOR_OR_SESSION_SELECTION · EXECUTION_BASELINE_ASSIGNMENT · ACTION_AUTHORITY_PROPAGATION · PERSISTENCE_OWNERSHIP · RETURN_DESTINATION · STOP_BOUNDARY · STAGE_ORDERING_DEPENDENCY }
  unit_u01.human_deterministic_classification  [MEASURED · SYMBOL]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  unit_u01.required_inputs  [MEASURED · SET]
  unit_u01.existing_durable_sources  [MEASURED · SET]
  unit_u01.ordinary_join_requirement  [MEASURED · SYMBOL]  parmi { REQUIRED · NOT_REQUIRED · NOT_ESTABLISHED }
  unit_u01.residual_human_authority  [MEASURED · SYMBOL]  parmi { NONE · SUBSTANTIVE_SELECTION_REMAINS · VERIFICATION_ONLY · NOT_ESTABLISHED }
  unit_u01.durable_evidence_identities  [MEASURED · SET]
  unit_u02.responsibility_types  [MEASURED · SET]  parmi { NEXT_CONTROL_STAGE · ACTOR_OR_SESSION_SELECTION · EXECUTION_BASELINE_ASSIGNMENT · ACTION_AUTHORITY_PROPAGATION · PERSISTENCE_OWNERSHIP · RETURN_DESTINATION · STOP_BOUNDARY · STAGE_ORDERING_DEPENDENCY }
  unit_u02.human_deterministic_classification  [MEASURED · SYMBOL]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  unit_u02.required_inputs  [MEASURED · SET]
  unit_u02.existing_durable_sources  [MEASURED · SET]
  unit_u02.ordinary_join_requirement  [MEASURED · SYMBOL]  parmi { REQUIRED · NOT_REQUIRED · NOT_ESTABLISHED }
  unit_u02.residual_human_authority  [MEASURED · SYMBOL]  parmi { NONE · SUBSTANTIVE_SELECTION_REMAINS · VERIFICATION_ONLY · NOT_ESTABLISHED }
  unit_u02.durable_evidence_identities  [MEASURED · SET]
  unit_u03.responsibility_types  [MEASURED · SET]  parmi { NEXT_CONTROL_STAGE · ACTOR_OR_SESSION_SELECTION · EXECUTION_BASELINE_ASSIGNMENT · ACTION_AUTHORITY_PROPAGATION · PERSISTENCE_OWNERSHIP · RETURN_DESTINATION · STOP_BOUNDARY · STAGE_ORDERING_DEPENDENCY }
  unit_u03.human_deterministic_classification  [MEASURED · SYMBOL]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  unit_u03.required_inputs  [MEASURED · SET]
  unit_u03.existing_durable_sources  [MEASURED · SET]
  unit_u03.ordinary_join_requirement  [MEASURED · SYMBOL]  parmi { REQUIRED · NOT_REQUIRED · NOT_ESTABLISHED }
  unit_u03.residual_human_authority  [MEASURED · SYMBOL]  parmi { NONE · SUBSTANTIVE_SELECTION_REMAINS · VERIFICATION_ONLY · NOT_ESTABLISHED }
  unit_u03.durable_evidence_identities  [MEASURED · SET]
  unit_u04.responsibility_types  [MEASURED · SET]  parmi { NEXT_CONTROL_STAGE · ACTOR_OR_SESSION_SELECTION · EXECUTION_BASELINE_ASSIGNMENT · ACTION_AUTHORITY_PROPAGATION · PERSISTENCE_OWNERSHIP · RETURN_DESTINATION · STOP_BOUNDARY · STAGE_ORDERING_DEPENDENCY }
  unit_u04.human_deterministic_classification  [MEASURED · SYMBOL]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  unit_u04.required_inputs  [MEASURED · SET]
  unit_u04.existing_durable_sources  [MEASURED · SET]
  unit_u04.ordinary_join_requirement  [MEASURED · SYMBOL]  parmi { REQUIRED · NOT_REQUIRED · NOT_ESTABLISHED }
  unit_u04.residual_human_authority  [MEASURED · SYMBOL]  parmi { NONE · SUBSTANTIVE_SELECTION_REMAINS · VERIFICATION_ONLY · NOT_ESTABLISHED }
  unit_u04.durable_evidence_identities  [MEASURED · SET]
  unit_u05.responsibility_types  [MEASURED · SET]  parmi { NEXT_CONTROL_STAGE · ACTOR_OR_SESSION_SELECTION · EXECUTION_BASELINE_ASSIGNMENT · ACTION_AUTHORITY_PROPAGATION · PERSISTENCE_OWNERSHIP · RETURN_DESTINATION · STOP_BOUNDARY · STAGE_ORDERING_DEPENDENCY }
  unit_u05.human_deterministic_classification  [MEASURED · SYMBOL]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  unit_u05.required_inputs  [MEASURED · SET]
  unit_u05.existing_durable_sources  [MEASURED · SET]
  unit_u05.ordinary_join_requirement  [MEASURED · SYMBOL]  parmi { REQUIRED · NOT_REQUIRED · NOT_ESTABLISHED }
  unit_u05.residual_human_authority  [MEASURED · SYMBOL]  parmi { NONE · SUBSTANTIVE_SELECTION_REMAINS · VERIFICATION_ONLY · NOT_ESTABLISHED }
  unit_u05.durable_evidence_identities  [MEASURED · SET]
  unit_u06.responsibility_types  [MEASURED · SET]  parmi { NEXT_CONTROL_STAGE · ACTOR_OR_SESSION_SELECTION · EXECUTION_BASELINE_ASSIGNMENT · ACTION_AUTHORITY_PROPAGATION · PERSISTENCE_OWNERSHIP · RETURN_DESTINATION · STOP_BOUNDARY · STAGE_ORDERING_DEPENDENCY }
  unit_u06.human_deterministic_classification  [MEASURED · SYMBOL]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  unit_u06.required_inputs  [MEASURED · SET]
  unit_u06.existing_durable_sources  [MEASURED · SET]
  unit_u06.ordinary_join_requirement  [MEASURED · SYMBOL]  parmi { REQUIRED · NOT_REQUIRED · NOT_ESTABLISHED }
  unit_u06.residual_human_authority  [MEASURED · SYMBOL]  parmi { NONE · SUBSTANTIVE_SELECTION_REMAINS · VERIFICATION_ONLY · NOT_ESTABLISHED }
  unit_u06.durable_evidence_identities  [MEASURED · SET]
  unit_u07.responsibility_types  [MEASURED · SET]  parmi { NEXT_CONTROL_STAGE · ACTOR_OR_SESSION_SELECTION · EXECUTION_BASELINE_ASSIGNMENT · ACTION_AUTHORITY_PROPAGATION · PERSISTENCE_OWNERSHIP · RETURN_DESTINATION · STOP_BOUNDARY · STAGE_ORDERING_DEPENDENCY }
  unit_u07.human_deterministic_classification  [MEASURED · SYMBOL]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  unit_u07.required_inputs  [MEASURED · SET]
  unit_u07.existing_durable_sources  [MEASURED · SET]
  unit_u07.ordinary_join_requirement  [MEASURED · SYMBOL]  parmi { REQUIRED · NOT_REQUIRED · NOT_ESTABLISHED }
  unit_u07.residual_human_authority  [MEASURED · SYMBOL]  parmi { NONE · SUBSTANTIVE_SELECTION_REMAINS · VERIFICATION_ONLY · NOT_ESTABLISHED }
  unit_u07.durable_evidence_identities  [MEASURED · SET]
  unit_u08.responsibility_types  [MEASURED · SET]  parmi { NEXT_CONTROL_STAGE · ACTOR_OR_SESSION_SELECTION · EXECUTION_BASELINE_ASSIGNMENT · ACTION_AUTHORITY_PROPAGATION · PERSISTENCE_OWNERSHIP · RETURN_DESTINATION · STOP_BOUNDARY · STAGE_ORDERING_DEPENDENCY }
  unit_u08.human_deterministic_classification  [MEASURED · SYMBOL]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  unit_u08.required_inputs  [MEASURED · SET]
  unit_u08.existing_durable_sources  [MEASURED · SET]
  unit_u08.ordinary_join_requirement  [MEASURED · SYMBOL]  parmi { REQUIRED · NOT_REQUIRED · NOT_ESTABLISHED }
  unit_u08.residual_human_authority  [MEASURED · SYMBOL]  parmi { NONE · SUBSTANTIVE_SELECTION_REMAINS · VERIFICATION_ONLY · NOT_ESTABLISHED }
  unit_u08.durable_evidence_identities  [MEASURED · SET]
  unit_u09.responsibility_types  [MEASURED · SET]  parmi { NEXT_CONTROL_STAGE · ACTOR_OR_SESSION_SELECTION · EXECUTION_BASELINE_ASSIGNMENT · ACTION_AUTHORITY_PROPAGATION · PERSISTENCE_OWNERSHIP · RETURN_DESTINATION · STOP_BOUNDARY · STAGE_ORDERING_DEPENDENCY }
  unit_u09.human_deterministic_classification  [MEASURED · SYMBOL]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  unit_u09.required_inputs  [MEASURED · SET]
  unit_u09.existing_durable_sources  [MEASURED · SET]
  unit_u09.ordinary_join_requirement  [MEASURED · SYMBOL]  parmi { REQUIRED · NOT_REQUIRED · NOT_ESTABLISHED }
  unit_u09.residual_human_authority  [MEASURED · SYMBOL]  parmi { NONE · SUBSTANTIVE_SELECTION_REMAINS · VERIFICATION_ONLY · NOT_ESTABLISHED }
  unit_u09.durable_evidence_identities  [MEASURED · SET]
  unit_u10.responsibility_types  [MEASURED · SET]  parmi { NEXT_CONTROL_STAGE · ACTOR_OR_SESSION_SELECTION · EXECUTION_BASELINE_ASSIGNMENT · ACTION_AUTHORITY_PROPAGATION · PERSISTENCE_OWNERSHIP · RETURN_DESTINATION · STOP_BOUNDARY · STAGE_ORDERING_DEPENDENCY }
  unit_u10.human_deterministic_classification  [MEASURED · SYMBOL]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  unit_u10.required_inputs  [MEASURED · SET]
  unit_u10.existing_durable_sources  [MEASURED · SET]
  unit_u10.ordinary_join_requirement  [MEASURED · SYMBOL]  parmi { REQUIRED · NOT_REQUIRED · NOT_ESTABLISHED }
  unit_u10.residual_human_authority  [MEASURED · SYMBOL]  parmi { NONE · SUBSTANTIVE_SELECTION_REMAINS · VERIFICATION_ONLY · NOT_ESTABLISHED }
  unit_u10.durable_evidence_identities  [MEASURED · SET]
  unit_u11.responsibility_types  [MEASURED · SET]  parmi { NEXT_CONTROL_STAGE · ACTOR_OR_SESSION_SELECTION · EXECUTION_BASELINE_ASSIGNMENT · ACTION_AUTHORITY_PROPAGATION · PERSISTENCE_OWNERSHIP · RETURN_DESTINATION · STOP_BOUNDARY · STAGE_ORDERING_DEPENDENCY }
  unit_u11.human_deterministic_classification  [MEASURED · SYMBOL]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  unit_u11.required_inputs  [MEASURED · SET]
  unit_u11.existing_durable_sources  [MEASURED · SET]
  unit_u11.ordinary_join_requirement  [MEASURED · SYMBOL]  parmi { REQUIRED · NOT_REQUIRED · NOT_ESTABLISHED }
  unit_u11.residual_human_authority  [MEASURED · SYMBOL]  parmi { NONE · SUBSTANTIVE_SELECTION_REMAINS · VERIFICATION_ONLY · NOT_ESTABLISHED }
  unit_u11.durable_evidence_identities  [MEASURED · SET]
  unit_u12.responsibility_types  [MEASURED · SET]  parmi { NEXT_CONTROL_STAGE · ACTOR_OR_SESSION_SELECTION · EXECUTION_BASELINE_ASSIGNMENT · ACTION_AUTHORITY_PROPAGATION · PERSISTENCE_OWNERSHIP · RETURN_DESTINATION · STOP_BOUNDARY · STAGE_ORDERING_DEPENDENCY }
  unit_u12.human_deterministic_classification  [MEASURED · SYMBOL]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  unit_u12.required_inputs  [MEASURED · SET]
  unit_u12.existing_durable_sources  [MEASURED · SET]
  unit_u12.ordinary_join_requirement  [MEASURED · SYMBOL]  parmi { REQUIRED · NOT_REQUIRED · NOT_ESTABLISHED }
  unit_u12.residual_human_authority  [MEASURED · SYMBOL]  parmi { NONE · SUBSTANTIVE_SELECTION_REMAINS · VERIFICATION_ONLY · NOT_ESTABLISHED }
  unit_u12.durable_evidence_identities  [MEASURED · SET]
  unit_u13.responsibility_types  [MEASURED · SET]  parmi { NEXT_CONTROL_STAGE · ACTOR_OR_SESSION_SELECTION · EXECUTION_BASELINE_ASSIGNMENT · ACTION_AUTHORITY_PROPAGATION · PERSISTENCE_OWNERSHIP · RETURN_DESTINATION · STOP_BOUNDARY · STAGE_ORDERING_DEPENDENCY }
  unit_u13.human_deterministic_classification  [MEASURED · SYMBOL]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  unit_u13.required_inputs  [MEASURED · SET]
  unit_u13.existing_durable_sources  [MEASURED · SET]
  unit_u13.ordinary_join_requirement  [MEASURED · SYMBOL]  parmi { REQUIRED · NOT_REQUIRED · NOT_ESTABLISHED }
  unit_u13.residual_human_authority  [MEASURED · SYMBOL]  parmi { NONE · SUBSTANTIVE_SELECTION_REMAINS · VERIFICATION_ONLY · NOT_ESTABLISHED }
  unit_u13.durable_evidence_identities  [MEASURED · SET]
  unit_u14.responsibility_types  [MEASURED · SET]  parmi { NEXT_CONTROL_STAGE · ACTOR_OR_SESSION_SELECTION · EXECUTION_BASELINE_ASSIGNMENT · ACTION_AUTHORITY_PROPAGATION · PERSISTENCE_OWNERSHIP · RETURN_DESTINATION · STOP_BOUNDARY · STAGE_ORDERING_DEPENDENCY }
  unit_u14.human_deterministic_classification  [MEASURED · SYMBOL]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  unit_u14.required_inputs  [MEASURED · SET]
  unit_u14.existing_durable_sources  [MEASURED · SET]
  unit_u14.ordinary_join_requirement  [MEASURED · SYMBOL]  parmi { REQUIRED · NOT_REQUIRED · NOT_ESTABLISHED }
  unit_u14.residual_human_authority  [MEASURED · SYMBOL]  parmi { NONE · SUBSTANTIVE_SELECTION_REMAINS · VERIFICATION_ONLY · NOT_ESTABLISHED }
  unit_u14.durable_evidence_identities  [MEASURED · SET]
  unit_u15.responsibility_types  [MEASURED · SET]  parmi { NEXT_CONTROL_STAGE · ACTOR_OR_SESSION_SELECTION · EXECUTION_BASELINE_ASSIGNMENT · ACTION_AUTHORITY_PROPAGATION · PERSISTENCE_OWNERSHIP · RETURN_DESTINATION · STOP_BOUNDARY · STAGE_ORDERING_DEPENDENCY }
  unit_u15.human_deterministic_classification  [MEASURED · SYMBOL]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  unit_u15.required_inputs  [MEASURED · SET]
  unit_u15.existing_durable_sources  [MEASURED · SET]
  unit_u15.ordinary_join_requirement  [MEASURED · SYMBOL]  parmi { REQUIRED · NOT_REQUIRED · NOT_ESTABLISHED }
  unit_u15.residual_human_authority  [MEASURED · SYMBOL]  parmi { NONE · SUBSTANTIVE_SELECTION_REMAINS · VERIFICATION_ONLY · NOT_ESTABLISHED }
  unit_u15.durable_evidence_identities  [MEASURED · SET]
  unit_u16.responsibility_types  [MEASURED · SET]  parmi { NEXT_CONTROL_STAGE · ACTOR_OR_SESSION_SELECTION · EXECUTION_BASELINE_ASSIGNMENT · ACTION_AUTHORITY_PROPAGATION · PERSISTENCE_OWNERSHIP · RETURN_DESTINATION · STOP_BOUNDARY · STAGE_ORDERING_DEPENDENCY }
  unit_u16.human_deterministic_classification  [MEASURED · SYMBOL]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  unit_u16.required_inputs  [MEASURED · SET]
  unit_u16.existing_durable_sources  [MEASURED · SET]
  unit_u16.ordinary_join_requirement  [MEASURED · SYMBOL]  parmi { REQUIRED · NOT_REQUIRED · NOT_ESTABLISHED }
  unit_u16.residual_human_authority  [MEASURED · SYMBOL]  parmi { NONE · SUBSTANTIVE_SELECTION_REMAINS · VERIFICATION_ONLY · NOT_ESTABLISHED }
  unit_u16.durable_evidence_identities  [MEASURED · SET]
  unit_u17.responsibility_types  [MEASURED · SET]  parmi { NEXT_CONTROL_STAGE · ACTOR_OR_SESSION_SELECTION · EXECUTION_BASELINE_ASSIGNMENT · ACTION_AUTHORITY_PROPAGATION · PERSISTENCE_OWNERSHIP · RETURN_DESTINATION · STOP_BOUNDARY · STAGE_ORDERING_DEPENDENCY }
  unit_u17.human_deterministic_classification  [MEASURED · SYMBOL]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  unit_u17.required_inputs  [MEASURED · SET]
  unit_u17.existing_durable_sources  [MEASURED · SET]
  unit_u17.ordinary_join_requirement  [MEASURED · SYMBOL]  parmi { REQUIRED · NOT_REQUIRED · NOT_ESTABLISHED }
  unit_u17.residual_human_authority  [MEASURED · SYMBOL]  parmi { NONE · SUBSTANTIVE_SELECTION_REMAINS · VERIFICATION_ONLY · NOT_ESTABLISHED }
  unit_u17.durable_evidence_identities  [MEASURED · SET]
  unit_u18.responsibility_types  [MEASURED · SET]  parmi { NEXT_CONTROL_STAGE · ACTOR_OR_SESSION_SELECTION · EXECUTION_BASELINE_ASSIGNMENT · ACTION_AUTHORITY_PROPAGATION · PERSISTENCE_OWNERSHIP · RETURN_DESTINATION · STOP_BOUNDARY · STAGE_ORDERING_DEPENDENCY }
  unit_u18.human_deterministic_classification  [MEASURED · SYMBOL]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  unit_u18.required_inputs  [MEASURED · SET]
  unit_u18.existing_durable_sources  [MEASURED · SET]
  unit_u18.ordinary_join_requirement  [MEASURED · SYMBOL]  parmi { REQUIRED · NOT_REQUIRED · NOT_ESTABLISHED }
  unit_u18.residual_human_authority  [MEASURED · SYMBOL]  parmi { NONE · SUBSTANTIVE_SELECTION_REMAINS · VERIFICATION_ONLY · NOT_ESTABLISHED }
  unit_u18.durable_evidence_identities  [MEASURED · SET]
  unit_u19.responsibility_types  [MEASURED · SET]  parmi { NEXT_CONTROL_STAGE · ACTOR_OR_SESSION_SELECTION · EXECUTION_BASELINE_ASSIGNMENT · ACTION_AUTHORITY_PROPAGATION · PERSISTENCE_OWNERSHIP · RETURN_DESTINATION · STOP_BOUNDARY · STAGE_ORDERING_DEPENDENCY }
  unit_u19.human_deterministic_classification  [MEASURED · SYMBOL]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  unit_u19.required_inputs  [MEASURED · SET]
  unit_u19.existing_durable_sources  [MEASURED · SET]
  unit_u19.ordinary_join_requirement  [MEASURED · SYMBOL]  parmi { REQUIRED · NOT_REQUIRED · NOT_ESTABLISHED }
  unit_u19.residual_human_authority  [MEASURED · SYMBOL]  parmi { NONE · SUBSTANTIVE_SELECTION_REMAINS · VERIFICATION_ONLY · NOT_ESTABLISHED }
  unit_u19.durable_evidence_identities  [MEASURED · SET]
  unit_u20.responsibility_types  [MEASURED · SET]  parmi { NEXT_CONTROL_STAGE · ACTOR_OR_SESSION_SELECTION · EXECUTION_BASELINE_ASSIGNMENT · ACTION_AUTHORITY_PROPAGATION · PERSISTENCE_OWNERSHIP · RETURN_DESTINATION · STOP_BOUNDARY · STAGE_ORDERING_DEPENDENCY }
  unit_u20.human_deterministic_classification  [MEASURED · SYMBOL]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  unit_u20.required_inputs  [MEASURED · SET]
  unit_u20.existing_durable_sources  [MEASURED · SET]
  unit_u20.ordinary_join_requirement  [MEASURED · SYMBOL]  parmi { REQUIRED · NOT_REQUIRED · NOT_ESTABLISHED }
  unit_u20.residual_human_authority  [MEASURED · SYMBOL]  parmi { NONE · SUBSTANTIVE_SELECTION_REMAINS · VERIFICATION_ONLY · NOT_ESTABLISHED }
  unit_u20.durable_evidence_identities  [MEASURED · SET]
  resp_r1.distinct_episodes_present  [MEASURED · SCALAR]
  resp_r1.material_core_episodes_present  [MEASURED · SCALAR]
  resp_r1.qualified_still_manual_units  [MEASURED · SCALAR]
  resp_r1.classification_distribution  [MEASURED · SET]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  resp_r1.common_durable_inputs  [MEASURED · SET]
  resp_r1.common_output_shape  [MEASURED · SCALAR]
  resp_r1.human_deterministic_classification  [MEASURED · SYMBOL]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  resp_r1.gap_gate_g1_materially_consequential_responsibility_remains_manual  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r1.gap_gate_g2_stable_bounded_semantics_across_occurrences  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r1.gap_gate_g3_required_inputs_identified  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r1.gap_gate_g4_ordinary_orchestration_cannot_derive_output  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r1.gap_gate_g5_insufficiency_demonstrated_not_inferred  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r1.gap_gate_g6_missing_capability_statable_without_implementation  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r1.concrete_handoff_routing_gap  [MEASURED · SYMBOL]  parmi { ESTABLISHED · NOT_ESTABLISHED · NOT_APPLICABLE }
  resp_r2.distinct_episodes_present  [MEASURED · SCALAR]
  resp_r2.material_core_episodes_present  [MEASURED · SCALAR]
  resp_r2.qualified_still_manual_units  [MEASURED · SCALAR]
  resp_r2.classification_distribution  [MEASURED · SET]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  resp_r2.common_durable_inputs  [MEASURED · SET]
  resp_r2.common_output_shape  [MEASURED · SCALAR]
  resp_r2.human_deterministic_classification  [MEASURED · SYMBOL]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  resp_r2.gap_gate_g1_materially_consequential_responsibility_remains_manual  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r2.gap_gate_g2_stable_bounded_semantics_across_occurrences  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r2.gap_gate_g3_required_inputs_identified  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r2.gap_gate_g4_ordinary_orchestration_cannot_derive_output  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r2.gap_gate_g5_insufficiency_demonstrated_not_inferred  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r2.gap_gate_g6_missing_capability_statable_without_implementation  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r2.concrete_handoff_routing_gap  [MEASURED · SYMBOL]  parmi { ESTABLISHED · NOT_ESTABLISHED · NOT_APPLICABLE }
  resp_r3.distinct_episodes_present  [MEASURED · SCALAR]
  resp_r3.material_core_episodes_present  [MEASURED · SCALAR]
  resp_r3.qualified_still_manual_units  [MEASURED · SCALAR]
  resp_r3.classification_distribution  [MEASURED · SET]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  resp_r3.common_durable_inputs  [MEASURED · SET]
  resp_r3.common_output_shape  [MEASURED · SCALAR]
  resp_r3.human_deterministic_classification  [MEASURED · SYMBOL]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  resp_r3.gap_gate_g1_materially_consequential_responsibility_remains_manual  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r3.gap_gate_g2_stable_bounded_semantics_across_occurrences  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r3.gap_gate_g3_required_inputs_identified  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r3.gap_gate_g4_ordinary_orchestration_cannot_derive_output  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r3.gap_gate_g5_insufficiency_demonstrated_not_inferred  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r3.gap_gate_g6_missing_capability_statable_without_implementation  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r3.concrete_handoff_routing_gap  [MEASURED · SYMBOL]  parmi { ESTABLISHED · NOT_ESTABLISHED · NOT_APPLICABLE }
  resp_r4.distinct_episodes_present  [MEASURED · SCALAR]
  resp_r4.material_core_episodes_present  [MEASURED · SCALAR]
  resp_r4.qualified_still_manual_units  [MEASURED · SCALAR]
  resp_r4.classification_distribution  [MEASURED · SET]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  resp_r4.common_durable_inputs  [MEASURED · SET]
  resp_r4.common_output_shape  [MEASURED · SCALAR]
  resp_r4.human_deterministic_classification  [MEASURED · SYMBOL]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  resp_r4.gap_gate_g1_materially_consequential_responsibility_remains_manual  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r4.gap_gate_g2_stable_bounded_semantics_across_occurrences  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r4.gap_gate_g3_required_inputs_identified  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r4.gap_gate_g4_ordinary_orchestration_cannot_derive_output  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r4.gap_gate_g5_insufficiency_demonstrated_not_inferred  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r4.gap_gate_g6_missing_capability_statable_without_implementation  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r4.concrete_handoff_routing_gap  [MEASURED · SYMBOL]  parmi { ESTABLISHED · NOT_ESTABLISHED · NOT_APPLICABLE }
  resp_r5.distinct_episodes_present  [MEASURED · SCALAR]
  resp_r5.material_core_episodes_present  [MEASURED · SCALAR]
  resp_r5.qualified_still_manual_units  [MEASURED · SCALAR]
  resp_r5.classification_distribution  [MEASURED · SET]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  resp_r5.common_durable_inputs  [MEASURED · SET]
  resp_r5.common_output_shape  [MEASURED · SCALAR]
  resp_r5.human_deterministic_classification  [MEASURED · SYMBOL]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  resp_r5.gap_gate_g1_materially_consequential_responsibility_remains_manual  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r5.gap_gate_g2_stable_bounded_semantics_across_occurrences  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r5.gap_gate_g3_required_inputs_identified  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r5.gap_gate_g4_ordinary_orchestration_cannot_derive_output  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r5.gap_gate_g5_insufficiency_demonstrated_not_inferred  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r5.gap_gate_g6_missing_capability_statable_without_implementation  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r5.concrete_handoff_routing_gap  [MEASURED · SYMBOL]  parmi { ESTABLISHED · NOT_ESTABLISHED · NOT_APPLICABLE }
  resp_r6.distinct_episodes_present  [MEASURED · SCALAR]
  resp_r6.material_core_episodes_present  [MEASURED · SCALAR]
  resp_r6.qualified_still_manual_units  [MEASURED · SCALAR]
  resp_r6.classification_distribution  [MEASURED · SET]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  resp_r6.common_durable_inputs  [MEASURED · SET]
  resp_r6.common_output_shape  [MEASURED · SCALAR]
  resp_r6.human_deterministic_classification  [MEASURED · SYMBOL]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  resp_r6.gap_gate_g1_materially_consequential_responsibility_remains_manual  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r6.gap_gate_g2_stable_bounded_semantics_across_occurrences  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r6.gap_gate_g3_required_inputs_identified  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r6.gap_gate_g4_ordinary_orchestration_cannot_derive_output  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r6.gap_gate_g5_insufficiency_demonstrated_not_inferred  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r6.gap_gate_g6_missing_capability_statable_without_implementation  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r6.concrete_handoff_routing_gap  [MEASURED · SYMBOL]  parmi { ESTABLISHED · NOT_ESTABLISHED · NOT_APPLICABLE }
  resp_r7.distinct_episodes_present  [MEASURED · SCALAR]
  resp_r7.material_core_episodes_present  [MEASURED · SCALAR]
  resp_r7.qualified_still_manual_units  [MEASURED · SCALAR]
  resp_r7.classification_distribution  [MEASURED · SET]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  resp_r7.common_durable_inputs  [MEASURED · SET]
  resp_r7.common_output_shape  [MEASURED · SCALAR]
  resp_r7.human_deterministic_classification  [MEASURED · SYMBOL]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  resp_r7.gap_gate_g1_materially_consequential_responsibility_remains_manual  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r7.gap_gate_g2_stable_bounded_semantics_across_occurrences  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r7.gap_gate_g3_required_inputs_identified  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r7.gap_gate_g4_ordinary_orchestration_cannot_derive_output  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r7.gap_gate_g5_insufficiency_demonstrated_not_inferred  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r7.gap_gate_g6_missing_capability_statable_without_implementation  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r7.concrete_handoff_routing_gap  [MEASURED · SYMBOL]  parmi { ESTABLISHED · NOT_ESTABLISHED · NOT_APPLICABLE }
  resp_r8.distinct_episodes_present  [MEASURED · SCALAR]
  resp_r8.material_core_episodes_present  [MEASURED · SCALAR]
  resp_r8.qualified_still_manual_units  [MEASURED · SCALAR]
  resp_r8.classification_distribution  [MEASURED · SET]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  resp_r8.common_durable_inputs  [MEASURED · SET]
  resp_r8.common_output_shape  [MEASURED · SCALAR]
  resp_r8.human_deterministic_classification  [MEASURED · SYMBOL]  parmi { HUMAN_SUBSTANTIVE_DECISION · DETERMINISTIC_FROM_EXISTING_STATE · ORDINARY_JOIN_REQUIRED · NOT_ESTABLISHED }
  resp_r8.gap_gate_g1_materially_consequential_responsibility_remains_manual  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r8.gap_gate_g2_stable_bounded_semantics_across_occurrences  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r8.gap_gate_g3_required_inputs_identified  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r8.gap_gate_g4_ordinary_orchestration_cannot_derive_output  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r8.gap_gate_g5_insufficiency_demonstrated_not_inferred  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r8.gap_gate_g6_missing_capability_statable_without_implementation  [MEASURED · SYMBOL]  parmi { SATISFIED · NOT_SATISFIED · NOT_ESTABLISHED }
  resp_r8.concrete_handoff_routing_gap  [MEASURED · SYMBOL]  parmi { ESTABLISHED · NOT_ESTABLISHED · NOT_APPLICABLE }
  study.final_analytical_outcome  [MEASURED · SYMBOL]  parmi { ORDINARY_ORCHESTRATION_SUFFICIENT · BOUNDED_INTEGRATION_OPPORTUNITY · HUMAN_DECISION_DOMINATES · CONCRETE_ROUTING_SEMANTIC_GAP_CANDIDATE · INSUFFICIENT_DURABLE_EVIDENCE }
  study.final_analytical_outcome_basis  [MEASURED · SET]
  study.new_semantic_primitive  [MEASURED · SYMBOL]  parmi { JUSTIFIED · NOT_JUSTIFIED · NOT_ESTABLISHED }
  study.concrete_gap_count  [MEASURED · SCALAR]
  study.limitations  [MEASURED · SET]
  study.blockers  [MEASURED · SET]
  study.procedural_success  [MEASURED · SYMBOL]  parmi { PROCEDURALLY_SUCCESSFUL · NOT_SUCCESSFUL }
  study.decisive_partition_rule  [MEASURED · SYMBOL]  parmi { RULE_0 · RULE_1 · RULE_2 · RULE_3 · RULE_4 · RULE_5 }
  study.partition_variable_trace  [MEASURED · SET]
  study.concrete_missing_routing_capability_candidate  [MEASURED · SET]

CONSÉQUENCES SUIVANTES
----------------------
  nc-return  [HUMAN_GATE]  RETURN_FROZEN_RESULT_INSTANCE → handoff_routing_bounded_rd_study_qualification

CONTRAINTES PERMANENTES — DÉCLARATION SEULE
-------------------------------------------
  sc-no-routing-engine  FORBIDDEN             SELECT_ROUTING_ENGINE → ref-return
      levée si  PRESENCE_OF(new_ratified_human_technical_response_decision) EQ true
  sc-no-representation  FORBIDDEN             DESIGN_REPRESENTATION → ref-return
      levée si  PRESENCE_OF(new_ratified_human_design_decision) EQ true
  sc-no-experiment  FORBIDDEN             CREATE_TOOLING_EXPERIMENT → ref-return
      levée si  PRESENCE_OF(new_ratified_human_experiment_decision) EQ true
  sc-no-persistence-by-executor  FORBIDDEN             COMMIT → ref-return
      levée si  PRESENCE_OF(new_ratified_authority) EQ true
  sc-no-eol-remediation  FORBIDDEN             MODIFY_GITATTRIBUTES → ref-return
      levée si  PRESENCE_OF(new_ratified_human_eol_decision) EQ true

Puis STOP.
