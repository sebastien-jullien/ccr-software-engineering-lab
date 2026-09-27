Preflight passes. Reading the contract (re-read required by the brief) and the whole A2 diff.

A2's changes are minimal: a new `JobCreateFailed` exception, a try/except in `create_job_idempotent`, a 503 response for it, and two new tests. Next, I'll set up a single temp workspace and export A2, A1, and B0 into it.

Exports match. Running the suites: A2, A1, and A1 code with A2's test file (to confirm the new tests discriminate).

All suite runs pass as expected, and running A1's code against A2's tests fails exactly the 2 new tests due to a 500 vs 503 mismatch. Now I'll recreate the C1 harness and r1_surrogate.py exactly as before and re-run them against A2, A1, and B0.

The C1 script enables its keyed steps only when `C1_TREE=a1`. To keep it byte-identical, I'll run it from a sibling folder whose `a1` directory holds the A2 export.

A2 now returns 503 `JOB_CREATE_FAILED` (0 jobs, 0 bindings) while A1 still returns 500. I'll verify each sub-claim of the corrected C1-U-01 and check the diff's direct effects by running a differential comparison between A2 and A1.

A2 handles all six creation-phase failures cleanly with a 503 followed by a successful retry, matching A1's behavior on other paths but losing the underlying cause in `--verbose` logs. Next I'll test concurrency on A2 by re-running `r3_conc.py` with a barrier-synchronized race where the first creation fails.

A2 passes all 40 concurrency rounds; in the failure race, A2 correctly returns 503 while A1 returns 500 instead, though both end up with the same final state. I'll pinpoint the exact A2 line numbers next, then clean up.

C2 RETURN

**PREFLIGHT** — PASS
- HEAD `c554667fba9a24123ba4964a1a00fe8ab6d2f6e1`, tree `602d5e67b0a58feba09b9ebb185699e75b07fdc3`, HEAD^ `914ba0b8…`, HEAD^^ `785795af…`.
- Branch `main`, remote empty, status empty (ignored and untracked included), Python 3.14.3.
- All 5 committed-file SHA-256 match.
- `git diff --name-status HEAD^ HEAD` = `M jobservice/server.py`, `M jobservice/store.py`, `M tests/test_idempotency.py`.

**A2 VERIFIED** — commit `c554667fba9a24123ba4964a1a00fe8ab6d2f6e1` · tree `602d5e67b0a58feba09b9ebb185699e75b07fdc3` · parent `914ba0b8345cb1eb7ba0d220e7b5eb072b35bcd3`

**INPUTS USED** — contract YES · A2 diff YES · C1 review YES · A2 return YES

**COMMANDS / RESULTS**
Common settings for every run:
- `PYTHONDONTWRITEBYTECODE=1`.
- `TMPDIR`, `TEMP` and `TMP` all set to `<T>\tmp`.
- `<T>` = `C:\Users\TribS\AppData\Local\Temp\c2-field001-xnej12q9`, created with `tempfile.mkdtemp(prefix='c2-field001-')`.

1. Exports: `git -C <repo> archive HEAD|HEAD^|HEAD^^ | tar -x -C <T>/a2|a1|b0`.
   - `<T>/a1x` = the A1 export, with `tests/test_idempotency.py` replaced by `git show HEAD:tests/test_idempotency.py` (A2's test file on A1 code).
   - All hashes checked: A2 files match the brief; A1 files match C1's (`be24dd20…`, `99efbe96…`, `46698da4…`).
2. Suites:
   - A2 `discover` → `Ran 44 … OK`; `tests.test_baseline` → `Ran 10 … OK`; `tests.test_idempotency` → `Ran 34 … OK`.
   - A1 `discover` → `Ran 42 … OK`.
3. A2's tests on A1 code (`a1x`): `python -m unittest tests.test_idempotency` → `Ran 34 … FAILED (failures=2)`. The only two failures are the new tests, both with `AssertionError: 500 != 503 : Reply(500, replayed=None, {'error': 'IDEMPOTENCY_PROCESSING_FAILED'})`.
4. `r1_surrogate.py` from C1, re-run on A2, A1 and B0 → see C1-M-01.
5. `r6_c2.py`: failure in each phase of the keyed path, run on A2 and on A1 → see C1-U-01.
6. `r3_conc.py` from C1, on A2: identical 20/20 rounds conform (1×201, 7×200, 1 job, 1 binding, 1 id); competing 20/20 conform (1×201, 3×200, 4×409, 1 job, 1 binding).
7. `r7_conc_fail.py`: 8 barrier-synchronized identical requests, where the first `insert_job` raises `ValueError`. Inserts are serialized by `BEGIN IMMEDIATE`, so exactly one request meets the failure. All workers are joined before any check.
   - A2: 20/20 rounds `{503:1, 201:1, 200:6}`, 1 job, 1 binding, 1 id.
   - A1: 20/20 rounds `{500:1, 201:1, 200:6}`, 1 job, 1 binding, 1 id.
   - `r7` imports `r3_conc`, which re-runs its own rounds; I filtered that output with `grep -v`.

**C1-M-01 — FIXED**
- **A2 code:**
  - `store.py:118-126`: when the key is not yet bound, `new_job`, `insert_job` and the binding INSERT sit in `try … except Exception as error: raise JobCreateFailed(key) from error`.
  - That raise happens inside the transaction's `try`, so `store.py:136-139` still rolls back.
  - `server.py:95`: `except (sqlite3.Error, JobCreateFailed):` → 503 `{"error": "JOB_CREATE_FAILED"}`.
- **Re-run:** the same C1 `harness.py` and `r1_surrogate.py`, recreated with identical content (same SHA-256 prefix `9f655a5daeb6c26f` for both copies of the script).
  - The script enables its keyed steps only when `C1_TREE=a1`, so for A2 it ran from `<T>/rerun_a2`, whose `a1` directory holds the HEAD export (server `aa0cf4fd…`, store `4a713968…`).
  - Command: `cd <T>/rerun_a2 && C1_TREE=a1 python r1_surrogate.py`, with the same `grep -v` filter on traceback frames as in C1.
  - Observed on A2:
    ```
    keyed   #1 K=s1: HTTP/1.0 503 Service Unavailable | Idempotency-Replayed=None | body=b'{"error": "JOB_CREATE_FAILED"}'
      state (jobs, bindings): (0, [])
    keyed   #2 K=s1 (retry, same R): HTTP/1.0 503 Service Unavailable | Idempotency-Replayed=None | body=b'{"error": "JOB_CREATE_FAILED"}'
      state (jobs, bindings): (0, [])
    unkeyed: <connection closed, no response> | Idempotency-Replayed=None | body=b''
    control: keyed K=s2, INSERT jobs fails via trigger: HTTP/1.0 503 Service Unavailable | ... body=b'{"error": "JOB_CREATE_FAILED"}'
    ```
  - Same run on A1 (`<T>`, `C1_TREE=a1`): keyed #1 and #2 → `500 … IDEMPOTENCY_PROCESSING_FAILED`, as in C1.
  - Same run on B0: unkeyed → `<connection closed, no response>`, so the legacy path is unchanged.
- The response prescribed by C-FAILED-CREATE is now returned, with no job, no binding, and the key free.

**C1-U-01 — SUPPORTED ON A2**
The Author's corrected claim: any failure while creating the job (building the job, inserting the job row, inserting the binding, committing, a storage error during the lookup) gets 503 `JOB_CREATE_FAILED`, with rollback, 0 jobs, 0 bindings, and the key free.

`r6_c2.py` results. Each case: the failing request, the state after it, then a retry with the same K and R, then a replay.

| Case | A2 failing request | A1 failing request | A2 state after failure | A2 retry, then replay |
|---|---|---|---|---|
| 1 build job (`new_job` RuntimeError, once) | 503 | 500 | 0 jobs, 0 bindings | 201, then 200 |
| 2 job insert, trigger `RAISE` | 503 | 503 | 0 jobs, 0 bindings | 201, then 200 |
| 3 job insert, `ValueError` once | 503 | 500 | 0 jobs, 0 bindings | 201, then 200 |
| 4 binding insert, trigger | 503 | 503 | 0 jobs, 0 bindings | 201, then 200 |
| 5 COMMIT blocked (reader holds SHARED, store timeout 0.3 s) | 503 | 503 | 0 jobs, 0 bindings | 201, then 200 |
| 6 lookup, idempotency table dropped | 503 | 503 | 0 jobs, no table | after the table is restored: 201, then 200 |

- The 500 paths outside the creation step are identical on A2 and A1:
  - a key bound to a missing job → 500 for the same R, 409 for another R;
  - a failure injected in `request_fingerprint` → 500, with `(0, [])`.
- The claim holds as the Author scopes it, to the creation step. A failure before the transaction still gets 500 on both trees; the Author discloses it (Other Issue 1) and it is out of C2 scope.

**NEW DEFECTS INTRODUCED BY A2** — NONE
- **What changes:** the diff's only behavioral effect is that non-storage exceptions raised during building the job, inserting the job row or inserting the binding now answer 503 instead of 500.
- **What does not change:** rollback, the free key, 409, replay, the missing-job 500, the fingerprint 500 and the legacy path behave the same on A2 as on A1 (`r1`, `r6` cases 7–8).
- **Concurrency:** C-CONC-IDENTICAL and C-CONC-COMPETING still conform on A2 (`r3`, `r7`).

**NON-MATERIAL (A2 CHANGE)**
- **C2-N-01 · the cause is no longer logged.** Non-storage creation failures now skip the `log_error` at `server.py:99`. With `verbose=True`, the lone-surrogate request logs only `"POST /jobs HTTP/1.1" 503 -` on A2. A1 also logged `idempotent POST /jobs failed: UnicodeEncodeError(...)`. The cause is still chained in the exception (`from error`), but it is never output.

**CONTRACT AMBIGUITY** — NONE blocking
- C-FAILED-CREATE's second sentence ("a later retry with `K` and `R` must be able to succeed normally") cannot hold for an R that can never be stored. The C1 finding made no claim on that sentence, and the retry behavior is the same on A1 and A2 (every retry fails again, now with 503), so it does not affect this classification.

**WRITES**
- Temporary directory `C:\Users\TribS\AppData\Local\Temp\c2-field001-xnej12q9` · removed YES (`shutil.rmtree`, then `exists: False`).
- Nothing was written inside the repository.

**FINAL `git status --porcelain --ignored --untracked-files=all`** — (empty). HEAD, tree, parent, branch and remote are unchanged.

**COMMITS / PUSHES** — 0 / 0. No agents or workflows were launched.
