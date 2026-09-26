All hashes match. Now reading the full repository content.

Preflight checks all pass—HEAD, tree, branch, remote, clean status, Python version, hashes, and baseline tests match. Now checking a few stdlib behaviors that affect the design before writing code.

Design settled. Writing the store changes (atomic key binding + job insert in one `BEGIN IMMEDIATE` transaction).

Now the HTTP layer: key header validation and the keyed path, leaving the legacy path untouched.

Now the test suite, organized by contract clause.

All 42 tests pass. Now I'll run the concurrency/failure/durability tests repeatedly in the background to check for flakiness, while also verifying they actually catch defects using in-memory monkeypatched mutants.

The harness crashed on printing a subtest id (console cp1252 encoding), not on a test. Rerunning the remaining mutants with UTF-8 output and subtests collapsed to their parent test.

25/25 repeated runs clean (including while the mutant harness was loading the CPU). Reviewing the final diff and line endings.

The modified files contain CRLF line endings. Checking whether the unmodified tracked files are LF in the worktree (they should be, given `eol=lf`).

`git ls-files --eol` says `w/lf` for every file including the ones I edited, contradicting the grep count. Verifying the actual bytes directly.

All files are LF (0 CR bytes); the earlier count was a shell-quoting artifact. Final read of the store module to review it as a whole.

Final full run and end-state check.

Before writing the return, verifying one edge case I intend to list as a limitation (a lone-surrogate string in `type`), so I report observed behavior rather than a guess.

## A1 RETURN

**PREFLIGHT** — PASS
HEAD `785795af…766b0d`, tree `7df985d2…c8f936`, branch `main`, remote empty, status empty, Python 3.14.3. All 10 committed-file SHA-256 match. Baseline: 10 tests, OK.

**EXACT CHANGED PATHS**
- modified: `jobservice/server.py`, `jobservice/store.py`
- new: `tests/test_idempotency.py`
- untouched: `FIELD-001-CONTRACT.md` (hash still `7d5132bd…`), `README.md`, `__init__.py`, `__main__.py`, `tests/test_baseline.py`

**IMPLEMENTATION**
- `store.py`
  - New table `idempotency_keys(key TEXT PRIMARY KEY, fingerprint TEXT, job_id TEXT)`. `initialize()` creates it with `IF NOT EXISTS`, so databases created before FIELD-001 are upgraded when the service starts.
  - `request_fingerprint(type, payload)`: SHA-256 of `json.dumps({"type","payload"}, sort_keys=True, separators=(",",":"), ensure_ascii=True)`.
  - `JobStore.create_job_idempotent(key, type, payload)` → `(job, created)`. It runs a single `BEGIN IMMEDIATE` transaction:
    - look up the key;
    - if the key is absent, insert the job and the binding;
    - if the fingerprint differs, raise `IdempotencyConflict`;
    - if the key is bound to a missing job, raise `IdempotencyStateError`;
    - otherwise read the bound job.
    - Then `COMMIT`. On any exception it runs `ROLLBACK`. SQLite's file lock serializes this across threads and processes; there is no in-memory state.
  - I split `create_job`/`get_job` into `new_job`, `insert_job` and `fetch_job`. Their behavior is identical, and the keyed path shares them.
- `server.py`
  - `parse_idempotency_key(values)` uses `fullmatch` on `[A-Za-z0-9._:-]{1,128}`.
  - `do_POST` reads the body, validates the key, then validates the body (existing code). With no key, the legacy code runs unchanged.
  - `post_keyed_job` returns:
    - 201 with `Idempotency-Replayed: false`, or 200 with `Idempotency-Replayed: true`;
    - 409 `IDEMPOTENCY_CONFLICT`;
    - 503 `JOB_CREATE_FAILED` on any `sqlite3.Error`;
    - 500 `IDEMPOTENCY_PROCESSING_FAILED` on any other exception.
  - A keyed request never falls back to the legacy path.

**TESTS** — `tests/test_idempotency.py`, 32 tests
- **KeyValidityTest (C-KEY)**
  - `test_invalid_keys_are_rejected_without_creating_a_job`: 16 values (empty, spaces only, 129 characters, space, tab, `; / , * + @ % " {}`, Latin-1 é, UTF-8 é bytes) → 400, 0 jobs, 0 bindings.
  - `test_valid_keys_are_accepted`: 10 values, including each allowed punctuation character alone and 128 characters.
  - `test_repeated_idempotency_key_header_is_invalid`
  - `test_header_name_is_case_insensitive`
  - `test_surrounding_whitespace_is_not_part_of_the_key`
  - `test_keys_are_case_sensitive`
- **LegacyTest (C-LEGACY)**
  - `test_same_request_without_key_creates_two_jobs`: also checks there is no Replayed header and no binding.
  - `test_keyed_submissions_do_not_affect_requests_without_key`
- **KeyedSubmissionTest (C-FIRST / C-REPLAY / C-CONFLICT / C-SCOPE)**
  - `test_first_submission_creates_exactly_one_job`: 5-field representation, GET returns the same body, one binding.
  - `test_identical_retry_replays_the_established_job`: the full body is identical, including `created_at`.
  - `test_different_request_with_the_same_key_conflicts`: the binding is unchanged after repeated 409s.
  - `test_distinct_keys_are_independent`
  - `test_rejected_body_does_not_bind_the_key`
  - `test_get_is_unchanged_by_idempotency_headers`
- **LogicalIdentityTest (C-IDENTITY)**
  - `test_same_logical_request_is_replayed`: 5 encodings (compact, indented, `\u` escapes, reordered keys at top and nested level, tabs/CRLF).
  - `test_different_logical_requests_conflict`: 16 variants (array order and length, `"3"` vs `3`, string value, case, trailing space, NFC vs NFD, nested value, `true` vs `1`, `true` vs `"true"`, extra null member, missing member, empty payload, `type` case and surrounding spaces).
  - `test_fingerprint_is_decided_on_the_json_model`
- **ConcurrencyTest (C-CONC-IDENTICAL / C-CONC-COMPETING)**
  - `test_eight_concurrent_identical_submissions`: barrier, 8 threads.
  - `test_eight_identical_submissions_racing_one_open_transaction`: `GatedStore` keeps the first transaction open until all 8 requests have entered the store, which makes the race deterministic.
  - `test_eight_identical_submissions_across_two_service_processes`
  - `test_concurrent_competing_submissions`
  - `test_competing_submissions_racing_one_open_transaction`
  - Each checks: one 201, the rest 200 (identical case) or 409 (non-matching case), one id, one job, one binding equal to the winner, and no rebinding afterwards.
- **FailureTest (C-FAILED-CREATE / C-NO-FALLBACK)**
  - `test_failed_job_insert_answers_503_and_leaves_the_key_free` (SQLite trigger `RAISE`)
  - `test_failed_binding_rolls_the_job_back`: the job is inserted, the binding fails, and 0 jobs remain.
  - `test_locked_database_answers_503_and_leaves_the_key_free`
  - `test_established_key_still_replays_while_creation_fails`
  - `test_idempotency_storage_failure_never_falls_back_to_plain_creation`: the idempotency table is dropped; the keyed request gets 503 and creates 0 jobs, while an unkeyed request still gets 201.
  - `test_unexpected_idempotency_error_is_an_explicit_500`
  - `test_key_bound_to_a_missing_job_is_never_rebound`
- **DurabilityTest (C-DURABLE)**
  - `test_key_survives_a_service_restart`
  - `test_key_survives_a_process_restart`: real `python -m jobservice`, terminated and restarted.
  - `test_database_created_before_field_001_is_upgraded`

**ASSUMPTIONS**
- Keys are case-sensitive and global: there is one endpoint and no authentication, so no per-client scope.
- Keys never expire.
- The replay body is the stored job, read in the same transaction; it is byte-for-byte the same as the 201 body and the GET body.
- The default rollback journal is kept (no WAL); I left it alone as an unrelated change.
- The `Idempotency-Replayed` header is sent only on 201 and 200 answers to keyed requests. Legacy and error responses are unchanged and do not carry it.

**MATERIAL INTERPRETATIONS**
1. **C-KEY, whitespace:** surrounding SP/HTAB is not part of the field value (RFC 9110 §5.5). The stdlib already strips leading whitespace; I also strip trailing whitespace, so `" k1\t"` is the same key as `k1`.
2. **C-KEY, repeated header:** several `Idempotency-Key` lines → 400 `INVALID_IDEMPOTENCY_KEY`, because the combined value contains a comma.
3. **C-KEY, non-ASCII:** the stdlib decodes non-ASCII header bytes as ISO-8859-1; they fail the regex → 400.
4. **C-IDENTITY:** requests are compared on the decoded model. `"é"` is the same as `"é"`. There is no Unicode normalization. `true` ≠ `1`. An explicit `null` member ≠ an absent member. `1` vs `1.0` are treated as different (the contract leaves this unspecified).
5. **C-FAILED-CREATE + C-NO-FALLBACK:**
   - Any storage error in the keyed transaction (lookup, insert, binding, commit, replay read, lock timeout) → 503 `JOB_CREATE_FAILED`, with a full rollback so the key stays free.
   - Any unexpected non-storage failure, or a key bound to a missing job → 500 `IDEMPOTENCY_PROCESSING_FAILED`. The contract gives no error code here, so I chose this one.
6. **Unspecified ordering:** the key is validated before the body. A keyed request with an invalid body gets the existing 400 `INVALID_JSON` / `INVALID_JOB` and does not bind the key.
7. **C-CONC-\*:** "concurrent" also covers several service processes sharing one database file.

**COMMANDS / RESULTS** (`PYTHONDONTWRITEBYTECODE=1`, run from the repo root)
- `python -m unittest discover -s tests -t .` → `Ran 42 tests … OK`
- `python -m unittest tests.test_baseline` → `Ran 10 tests … OK`
- `python -m unittest tests.test_idempotency` → `Ran 32 tests … OK`
- Flakiness loop: 25 runs of ConcurrencyTest + FailureTest + B-08 → `runs=25 failures=0`.
- Mutation check: faulty variants were monkeypatched in memory (piped through stdin, no file written) and run against the 39 in-process tests.
  - Unmodified code: 0 failing tests.
  - Every mutant was caught:

    | Mutant | Failing tests |
    |---|---|
    | check-then-act without a transaction | 6 |
    | non-atomic job + binding | 6 |
    | server falls back to plain create | 6 |
    | in-memory state | 11 |
    | rebind on conflict | 7 |
    | fingerprint without key sorting | 4 |
    | fingerprint ignoring `type` | 4 |
    | fingerprint ignoring array order | 4 |
    | fingerprint normalizing `type` | 4 |
    | permissive key regex | 1 |
    | regex allowing 129 characters | 1 |

  - I also ran a mutant meant to equate `true` and `1`, but it failed for an unrelated reason, so it proves nothing. The `true` vs `1` case is covered directly by the HTTP variant and the unit test.
- **Writes:**
  - The tests wrote only to SQLite files created and cleaned up by Python's `tempfile`.
  - The background loop's console output was captured by the tool into its own task-output file, outside the repository; no code of mine wrote there.

**CORRECTNESS CLAIMS**
- **C-KEY:** 400 on an invalid key, with no job and no binding.
- **C-LEGACY:** the code without a key is byte-identical in behavior, and the baseline passes.
- **C-FIRST:** 201 with `Idempotency-Replayed: false` and exactly one job.
- **C-REPLAY:** 200 with `Idempotency-Replayed: true`, the same job, and no insert.
- **C-CONFLICT:** 409 with no job; the binding is never updated.
- **C-IDENTITY:** as in interpretation 4.
- **C-CONC-IDENTICAL / C-CONC-COMPETING:** serialized by SQLite `BEGIN IMMEDIATE`; the first transaction to commit wins permanently.
- **C-FAILED-CREATE:** the job and the binding are atomic; on failure → 503 and the key stays free.
- **C-DURABLE:** the binding is committed to SQLite before the response is sent, and survives a process kill and restart.
- **C-NO-FALLBACK:** every keyed failure gets an explicit 409, 503 or 500; the legacy path is never called.
- **C-SCOPE:** GET, the command line, the start-up line and the job representation are unchanged.

**KNOWN LIMITATIONS**
- Bindings never expire, so the table grows without limit.
- All keyed requests on one database, including replays and conflicts, go through the write lock one at a time. Under contention a request waits up to the store timeout (30 s by default), then gets 503.
- If a job is deleted outside the service, its key answers 500 forever. By design it is not rebound; someone has to fix it manually.
- A `type` containing a lone surrogate escape (`"\ud800"`): keyed → 500 `IDEMPOTENCY_PROCESSING_FAILED` with 0 jobs (observed). The legacy path drops the connection for the same input (existing behavior, unchanged).
- The stdlib listen backlog is still 5. The 8-way tests passed every repetition here, but bursts larger than the backlog could see refused connections, a limit the baseline already has.

**FINAL `git status --porcelain --untracked-files=all`**
```
 M jobservice/server.py
 M jobservice/store.py
?? tests/test_idempotency.py
```
Ignored files: none. HEAD is still `785795af434299d2b6d25910eac2761208766b0d`.

**COMMITS / PUSHES** — 0 / 0. No agents or workflows were launched.
