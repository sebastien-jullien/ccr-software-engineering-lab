Preflight passes. Reading README and contract.
I've reviewed the contract, B0/A1 sources, and the Author's tests. Now I'll set up a single temp workspace, export HEAD and HEAD^ into it, and run the test suites with all tempfile writes redirected there.
Temp workspace created at `C:\Users\TribS\AppData\Local\Temp\c1-field001-ecs097mh`. Now exporting A1 (HEAD) and B0 (HEAD^) into it and checking the exported bytes.
Exported bytes match the committed hashes. Running the full suite (A1) and baseline suite, with all test temp files redirected into the temp workspace.
All test suites pass (A1: 42/42, baseline 10/10, idempotency 32/32; B0: 10/10). Now I'll write targeted reproductions in the temp workspace, using raw-socket requests to check exact wire bytes, edge inputs, and lock behavior.
Confirmed: a lone surrogate in `type` causes the keyed first submission to return 500 IDEMPOTENCY_PROCESSING_FAILED, while a trigger-induced insert failure on the same path returns 503. Next I'll test body consistency for edge inputs, header edge cases, and replay behavior while the DB is write-locked.
Round 2 confirms bodies match across edge-case payloads and header whitespace/validation behaves per RFC 9110, though I noticed a malformed key with a space before the colon slips through to the legacy path (creating duplicate jobs) and a lock-held replay returns 503. Next I'll run barrier-synchronized concurrency rounds and compare B0 vs A1 legacy behavior.
Concurrency: 40/40 barrier rounds conform (1×201 + 7×200 identical; 1×201 + 3×200 + 4×409 competing; always 1 job, 1 binding). Now the unkeyed/GET/CLI differential between B0 and A1.
B0 and A1 produce identical results across unkeyed POST, GET, unknown path, and `--help` checks. Next, I'll spot-check the Author's claim that all mutants were caught by running my own in-memory mutants against the 39 in-process tests.
The spot-check confirms the Author's claim—all four mutants were caught, failing 4, 6, 2, and 1 test methods respectively. Now I'll do one last check on R1: verifying that key `s1` stays free for a storable request after the 500.
My own label string broke the console encoding. Rerunning with an ASCII label.
Confirmed: after the 500, the key stays free. Removing the temporary directory and running the final state checks.
C1 RETURN
PREFLIGHT — PASS

* HEAD `914ba0b8345cb1eb7ba0d220e7b5eb072b35bcd3`, tree `26fb9fbb270d5a43cf575ce114b71f87306959de`, HEAD^ `785795af434299d2b6d25910eac2761208766b0d`.
* Branch `main`, remote empty, status empty, Python 3.14.3.
* All 5 committed-file SHA-256 match.
* `git diff --name-status HEAD^ HEAD` = `M jobservice/server.py`, `M jobservice/store.py`, `A tests/test_idempotency.py`.

A1 REVIEWED — commit `914ba0b8345cb1eb7ba0d220e7b5eb072b35bcd3` · tree `26fb9fbb270d5a43cf575ce114b71f87306959de`
INPUTS USED

* contract: YES (README.md was also read)
* A1 diff: YES
* Author tests: YES
* Author return: YES

COMMANDS / RESULTS
Common settings for every run below:

* `PYTHONDONTWRITEBYTECODE=1`.
* `TMPDIR`, `TEMP` and `TMP` all set to `<T>\tmp`, so every tempfile write, the tests' included, stayed inside `<T>`.
* `<T>` = `C:\Users\TribS\AppData\Local\Temp\c1-field001-ecs097mh`, created with `tempfile.mkdtemp(prefix='c1-field001-')`.

1. Export: `git -C <repo> archive HEAD | tar -x -C <T>/a1` and `git -C <repo> archive HEAD^ | tar -x -C <T>/b0`. The `sha256sum` of the 5 exported files matches the hashes in the brief.
2. Suites on A1 (from `<T>/a1`):
   * `python -m unittest discover -s tests -t .` → `Ran 42 tests … OK`
   * `python -m unittest tests.test_baseline` → `Ran 10 … OK`
   * `python -m unittest tests.test_idempotency` → `Ran 32 … OK`
3. Suite on B0 (from `<T>/b0`): `python -m unittest discover -s tests -t .` → `Ran 10 … OK`
4. `r1_surrogate.py`, run on A1 and on B0: see C1-M-01.
5. `r2_edges.py`, representation checks:
   * 7 edge inputs: NUL in `type` and in `payload`, `1e400`/`-1e400`/`NaN`, float precision, a duplicated member, a lone surrogate in `payload`, an escaped astral pair.
   * For all 7: first request 201, replay 200 with `Idempotency-Replayed: true`, and the 201, replay and GET bodies are byte-identical.
6. `r2_edges.py`, header and lock checks:
   * Key header edge cases, sent as exact wire bytes, and the replay-under-lock case → see C1-N-01, C1-N-02 and C1-N-04.
   * Obs-fold (`Idempotency-Key:` CRLF SP `k9`) → 201 with key `k9`.
   * Two `Idempotency-Key` lines, an empty value, NBSP (0xA0) before the key, a fullwidth digit → 400 `INVALID_IDEMPOTENCY_KEY`.
7. `r3_conc.py`, concurrency. Every round starts on one `threading.Barrier`, joins all workers before any assertion, and uses no sleep and no retry.
   * 8 identical requests (4 compact + 4 key-reordered encodings): 20/20 rounds conform. Each round: 1×201, 7×200, 0×409, 1 job, 1 binding, 1 id.
   * 8 competing requests (4×R1, 4×R2): 20/20 rounds conform. Each round: 1×201, 3×200, 4×409, 1 job, 1 binding, bound to the winner.
8. `r4_legacy.py`, unkeyed behavior, run on A1 and on B0:
   * Covers 15 unkeyed POST bodies, 2 GETs and `POST /jobs/x`, with `id` and `created_at` masked.
   * `diff` of the two outputs → exit 0.
   * `python -m jobservice --help`, A1 vs B0 → diff exit 0.
9. `r5_mutants.py`: my own in-memory mutants, run against the Author's 39 in-process tests. Failing test methods:
   * no mutant: 0
   * fallback to plain create: 4
   * no transaction: 6
   * unsorted fingerprint: 2
   * key regex `{1,129}`: 1
10. Key-free follow-up: key `s1` with the lone-surrogate `type` → 500. Then `s1` with a storable request → 201. State after: 1 job, 1 binding.
One first attempt of this step crashed in my own `print`: I had put a surrogate in a label and the console is cp1252. I reran it with an ASCII label; the target was not affected.

MATERIAL FINDINGS
C1-M-01 · C-FAILED-CREATE (together with C-NO-FALLBACK's "unless a more specific clause above applies")

* Code / behavior:
   * `{"type": "\ud800", "payload": {}}` passes the existing validation (`server.py:40`).
   * With a valid key, `store.py:114` → `insert_job` (`store.py:148-151`). Binding `type` raises `UnicodeEncodeError`, which is not a `sqlite3.Error`.
   * `store.py:128-131` rolls back and re-raises.
   * `server.py:95` (`except sqlite3.Error`) does not match, so `server.py:98-100` answers HTTP 500 `{"error": "IDEMPOTENCY_PROCESSING_FAILED"}`.
   * The clause prescribes 503 `{"error": "JOB_CREATE_FAILED"}` when "creating the job fails before a job is durably established". Its wording does not restrict the cause.
* Reproduction:
   * Command: `cd <T> && C1_TREE=a1 python r1_surrogate.py` (then `C1_TREE=b0`), with the settings above.
   * I piped stdout and stderr through a `grep -v` that removes traceback frame lines only.
   * `harness.py` (used part): 

```python
TREE = os.environ.get("C1_TREE", "a1"); sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), TREE))  from jobservice.server import create_server  class Svc:      def __init__(self, db_path, store=None):          self.server = create_server(db_path, store=store); self.port = self.server.server_address[1]          self.thread = threading.Thread(target=self.server.serve_forever, daemon=True); self.thread.start()      def stop(self): self.server.shutdown(); self.server.server_close(); self.thread.join()  def raw(port, request_bytes, timeout=60):   # sends exact bytes, reads until close; no bytes -> "<connection closed, no response>"  def post(port, body, header_lines=()):      # POST /jobs HTTP/1.1, Host, Content-Type, Content-Length, header_lines, CRLF, body  def state(db_path):                         # (SELECT COUNT(*) FROM jobs, SELECT key, job_id FROM idempotency_keys ORDER BY key)  def fresh_db(): return os.path.join(tempfile.mkdtemp(prefix="db-"), "jobs.db")  

```

   * `r1_surrogate.py`: 

```python
BODY = b'{"type": "\\ud800", "payload": {}}'  db = fresh_db(); svc = Svc(db)  show("keyed   #1 K=s1", post(svc.port, BODY, ["Idempotency-Key: s1"])); print("  state (jobs, bindings):", state(db))  show("keyed   #2 K=s1 (retry, same R)", post(svc.port, BODY, ["Idempotency-Key: s1"])); print(...state...)  show("unkeyed", post(svc.port, BODY)); print(...state...)  # control: CREATE TRIGGER f BEFORE INSERT ON jobs BEGIN SELECT RAISE(ABORT, 'x'); END  show("control: keyed K=s2, INSERT jobs fails via trigger", post(svc.port, b'{"type": "t", "payload": {}}', ["Idempotency-Key: s2"]))  

```

   * Observed on A1: 

```
keyed   #1 K=s1: HTTP/1.0 500 Internal Server Error | Idempotency-Replayed=None | body=b'{"error": "IDEMPOTENCY_PROCESSING_FAILED"}'    state (jobs, bindings): (0, [])  keyed   #2 K=s1 (retry, same R): HTTP/1.0 500 Internal Server Error | ... body=b'{"error": "IDEMPOTENCY_PROCESSING_FAILED"}'    state (jobs, bindings): (0, [])  unkeyed: <connection closed, no response>  control: keyed K=s2, INSERT jobs fails via trigger: HTTP/1.0 503 Service Unavailable | ... body=b'{"error": "JOB_CREATE_FAILED"}'  

```

   * Observed on B0: `unkeyed: <connection closed, no response>`. So the legacy path behaves the same as the baseline.
* Consequence:
   * A client gets a status and error code outside the one the contract prescribes for a failed creation. A client built to the contract (503 `JOB_CREATE_FAILED` means creation failed and the key is free) cannot recognize this case, and every retry with this K and R gets 500 again.
   * Stored state is correct: 0 jobs, no binding, and the key stays usable (step 10).
* Scope: narrow. Only the first submission of a key whose `type` contains a lone surrogate is affected. The Author listed this behavior under Known Limitations but did not classify it as a deviation.

NON-MATERIAL OBSERVATIONS

* C1-N-01 · malformed header line is ignored. `Idempotency-Key : m1` (space before the colon) is dropped by the stdlib header parser, and so are all header lines after it. The request goes down the legacy path: sending it twice gave 201, 201, 2 jobs, no binding.
   * RFC 9112 §5.1 requires a 400 for such a message.
   * The parser is the same as in B0, and the input is not a valid header, so C-KEY does not govern it. I do not attribute it to A1.
* C1-N-02 · replay needs the write lock. An established key is replayed through `BEGIN IMMEDIATE` (`store.py:106`).
   * With another connection holding the write lock and a store timeout of 0.5 s: the replay got 503 `JOB_CREATE_FAILED` after 0.61 s, while a GET of the same job answered 200 at the same moment.
   * An explicit 5xx satisfies C-NO-FALLBACK, but the error code says the creation failed for a job that is already established. With the default 30 s timeout this needs a lock held longer than 30 s.
* C1-N-03 · distinct numbers can collapse. `{"x": 1e400}` and then `{"x": 2e400}` under the same key → 201, then a 200 replay of the first job; both parse to `Infinity`. This is consistent with "decided on the accepted JSON model", and number equivalence is not specified by the contract.
* C1-N-04 · key whitespace is stripped. Leading SP/HTAB is removed by the stdlib and trailing SP/HTAB by `server.py:57`, so `\t k1`, `k1 \t` and `k1` are one key. This matches RFC 9110 §5.5 (Author's interpretation 1).
* C1-N-05 · a test docstring overstates. `tests/test_idempotency.py:151-155` says every other request "is guaranteed to attempt its own lookup while the first one is still undecided". Under A1's `BEGIN IMMEDIATE`, the other requests block before their lookup; the gate only guarantees they have entered `create_job_idempotent`. The test's outcome assertions remain valid.
* C1-N-06 · mutation counts cannot be reproduced. The Author's per-mutant counts rely on mutant code that is not in the return. My comparable mutants were all caught (4 / 6 / 2 / 1 failing test methods, against the Author's 6 / 6 / 4 / 1). The substance of the claim holds; the counts depend on the mutant code.

UNSUPPORTED AUTHOR CLAIMS

* C1-U-01: "C-FAILED-CREATE: the job and the binding are atomic; on failure → 503 and the key stays free."
   * Atomicity and the free key are supported.
   * "on failure → 503" is contradicted by C1-M-01: a creation failure answered 500 `IDEMPOTENCY_PROCESSING_FAILED`. The Author's own Known Limitations list that 500.

CONTRACT AMBIGUITY — NONE blocking. C1-M-01 relies on the literal first sentence of C-FAILED-CREATE only. I make no claim about its "retry must be able to succeed" sentence for failures that depend deterministically on the input.
WRITES

* Temporary directory used: `C:\Users\TribS\AppData\Local\Temp\c1-field001-ecs097mh` · removed YES (`shutil.rmtree`, then `exists: False`).
* The tool harness saved the long output of my `git show HEAD:tests/test_idempotency.py` to its own session tool-results file, outside the repository. I read it back once; it contains only that file's content.

FINAL `git status --porcelain --ignored --untracked-files=all` — (empty). HEAD, tree, branch and remote are unchanged.
COMMITS / PUSHES — 0 / 0. No agents or workflows were launched.
