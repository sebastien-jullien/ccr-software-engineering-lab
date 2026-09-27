Preflight passes and the contract confirms the C1-M-01 finding: A1 bases status codes on exception type rather than failure phase, so a job insert failing with UnicodeEncodeError wrongly gets 500. Before editing, I'll check for other non-storage failures in the keyed path to define the fix's exact boundary, logging anything extra under OTHER ISSUES.
I noticed that at depth 15502, `json.loads` succeeds but `json.dumps` triggers a `RecursionError`, and in the keyed path this would surface earlier since the fingerprint is computed before the transaction. I'm now checking whether this is reachable over HTTP given handler threads' different stack size, though this is just a note for other issues and won't expand the current fix.
Status: I accepted C1-M-01. I found a second path to 500 (payloads nested very deep), which I will only report, not fix. Now making the one-clause correction.
Now the reproducing tests, placed in `FailureTest` next to the existing C-FAILED-CREATE tests.
A2 passes: full suite 44 tests, baseline 10, idempotency 34. Now running the A2 test file against an exact `git archive` export of A1 (HEAD) in a `tempfile` directory.
The two new tests fail on A1 (500≠503) but pass on A2, while the other 32 pass on both; I've cleaned up the temp export. Now re-checking the deep-nesting case on A2 to see if any creation-related 500 remains, which will be logged under OTHER ISSUES rather than fixed.
The job body output contained a huge nested payload, which was saved externally by the tool rather than my own code. I'll rerun with compact output and investigate which step is causing the remaining 500 errors.
The remaining 500s are caused by a RecursionError in fingerprint computation, occurring before the transaction and outside the scope of C1-M-01, so I'll leave it unchanged and report it. Now finalizing the diff and checking state.
A2 RETURN
PREFLIGHT — PASS

* HEAD `914ba0b8345cb1eb7ba0d220e7b5eb072b35bcd3`, tree `26fb9fbb270d5a43cf575ce114b71f87306959de`, HEAD^ `785795af434299d2b6d25910eac2761208766b0d`.
* Branch `main`, remote empty, status empty with ignored and untracked files included, Python 3.14.3.
* All 5 committed-file SHA-256 match.
* Suite: `Ran 42 tests … OK`.

C1-M-01 — ACCEPT

* Contract: C-FAILED-CREATE says: "If creating the job fails before a job is durably established for key `K` and request `R`: HTTP 503 {"error": "JOB_CREATE_FAILED"}". It does not restrict the cause. C-NO-FALLBACK's 5xx applies "unless a more specific clause above applies".
* A1's mistake: it chose the status from the exception type (`sqlite3.Error` → 503, anything else → 500), not from the step that failed.
* Correction:
   * `jobservice/store.py:46-47`: new exception class `JobCreateFailed`.
   * `jobservice/store.py:118-126`, in `JobStore.create_job_idempotent`, branch `row is None` only: building the job, inserting the job row and inserting the binding now sit in `try … except Exception as error: raise JobCreateFailed(key) from error`.
   * `jobservice/store.py:99-101`: the docstring names the new exception.
   * `jobservice/server.py:16`: import `JobCreateFailed`.
   * `jobservice/server.py:95`, in `post_keyed_job`: `except sqlite3.Error:` becomes `except (sqlite3.Error, JobCreateFailed):` → 503 `JOB_CREATE_FAILED`.
* Why this is the whole of what the finding requires:
   * Only the creation step changes status, and only for non-storage causes. Storage errors already got 503 and still do, through the same response.
   * Rollback, the free key, the lookup, replay, conflict, the fingerprint, validation and the legacy path are untouched.
   * The 500 cases outside the creation step are unchanged: a key bound to a missing job, and an unexpected failure outside the store's creation step. No existing test changed.
* Reproducing tests, added to `tests/test_idempotency.py:529-554`, class `FailureTest`:
   * `test_job_that_cannot_be_stored_answers_503_and_leaves_the_key_free`: C1's exact input `{"type": "\ud800", "payload": {}}` with key `k1`. It asserts 503 `{"error": "JOB_CREATE_FAILED"}` with no `Idempotency-Replayed` header, then 0 jobs and 0 bindings, then `k1` with a storable request → 201 and 1 job.
   * `test_creation_failure_of_any_cause_answers_503_and_leaves_the_key_free`: `insert_job` raises `ValueError` once. It asserts 503 `JOB_CREATE_FAILED`, 0 jobs and 0 bindings, then a retry with the same K and R → 201, then a replay → 200, and 1 job.
   * On A1: HEAD was exported with `git archive` into a `tempfile.mkdtemp` directory; the exported hashes equal HEAD's. I copied the A2 test file into the export and, from there, ran `python -m unittest tests.test_idempotency.FailureTest.<test>` for both tests:
      * both fail with `AssertionError: 500 != 503 : Reply(500, replayed=None, {'error': 'IDEMPOTENCY_PROCESSING_FAILED'})`, giving `FAILED (failures=2)`;
      * the whole A2 test file on A1: `Ran 34 … FAILED (failures=2)`, only these two.
      * The directory was removed afterwards (`removed: True`).
   * On A2 (worktree): the same two tests → `Ran 2 tests … OK`.

C1-U-01 — corrected claim: C-FAILED-CREATE holds on A2, not on A1.

* The job and its binding are written in one transaction.
* Any failure while creating the job, whatever its cause, gets 503 `JOB_CREATE_FAILED`. That covers building the job, inserting the job row, inserting the binding, committing, and a storage error during the lookup.
* The transaction is rolled back, leaving 0 jobs and 0 bindings, and the key stays free.
* A1's "on failure → 503" was false for non-storage causes, as C1 showed.

C1-N-01 .. C1-N-06 — NO ACTION. No code or test was changed for them.
EXACT CHANGED PATHS (relative to HEAD)

* modified: `jobservice/server.py`, `jobservice/store.py`, `tests/test_idempotency.py`
* new: none

COMMANDS / RESULTS (`PYTHONDONTWRITEBYTECODE=1`, from the repo root)

* `python -m unittest discover -s tests -t .` → `Ran 44 tests … OK`
* `python -m unittest tests.test_baseline` → `Ran 10 tests … OK`
* `python -m unittest tests.test_idempotency` → `Ran 34 tests … OK`

CORRECTNESS CLAIMS

* C-FAILED-CREATE: as in C1-U-01. Six tests support it: trigger on the job insert, trigger on the binding insert, locked database, lone surrogate, injected `ValueError`, and dropped idempotency table.
* C-NO-FALLBACK: still never falls back; every failure test ends with 0 jobs. Failures in the creation step now get C-FAILED-CREATE's specific 503. Failures outside that step still get 500.

OTHER ISSUES NOTICED (not fixed)

1. Very deep nesting → 500. If a keyed payload is nested deep enough that `json.loads` accepts it but `json.dumps` raises `RecursionError`, the request gets 500 `IDEMPOTENCY_PROCESSING_FAILED`.
   * The failure happens in `request_fingerprint`, before the transaction opens, so it is outside the step I corrected. The key stays free.
   * Over 80 depths (15,440–15,519; the limit depends on the thread stack, so it is not deterministic):
      * keyed requests: 37 × 201 and 43 × 500;
      * unkeyed requests: 38 × 201 and 42 × connection dropped (the baseline behavior);
      * direct store calls in threads: 51 created and 29 `RecursionError` outside the creation step.
   * Because such a job cannot be stored either, C-FAILED-CREATE might be the applicable clause.
2. Retry with a request that can never be stored. C-FAILED-CREATE's second sentence says "a later retry with `K` and `R` must be able to succeed normally". That cannot hold when R itself can never be stored, such as a lone surrogate in `type`: every retry gets 503 again. K is not poisoned, since K with a storable request succeeds (the new test asserts this). The legacy path cannot store such an R either.

KNOWN LIMITATIONS (updated)

* Lone surrogate in `type`, keyed: now 503 `JOB_CREATE_FAILED` (was 500), with 0 jobs. A retry with the same R gets 503 again; the key stays usable with a storable request. The legacy path is unchanged and drops the connection.
* Very deep nesting, keyed: 500 (Other issue 1).
* Unchanged from A1:
   * bindings never expire;
   * all keyed requests go through the write lock one at a time. Under contention, or when replaying while the lock is held longer than the store timeout (30 s by default), a request gets 503;
   * a job deleted outside the service → its key answers 500 forever, and it is never rebound;
   * the listen backlog is still 5.

Writes outside the repository: only the removed `tempfile` export and the tests' own `TemporaryDirectory` databases. One oversized output from a diagnostic probe was saved by the tool into its own tool-results file, outside the repo; none of my code wrote there.
FINAL `git status --porcelain --ignored --untracked-files=all`

```
 M jobservice/server.py
 M jobservice/store.py
 M tests/test_idempotency.py

```

HEAD is still `914ba0b8…`, the contract is unchanged (`7d5132bd…`), and no temporary directory is left.
COMMITS / PUSHES — 0 / 0. No agents or workflows were launched.
