# FIELD-001 · Q1 qualification record — frozen A1

- Role: AGENT CCR LAB #67 — fresh independent qualifier, new session, hidden Q1 of frozen A1
- Record generated (UTC): 2026-09-26T16:03:39Z
- Authority: none over the contract, the oracle or the protocol; this record states the evidence only.
- Method: this record is derived mechanically from the raw Q1 files listed in section 9, so that no Q1
  outcome transits through the qualifier session's chat. Generator sha256: `c7619bdd02f29b6fbcc4ade4415321cd8d44807cffb429d892bdf8e7d463111e`

## 1. Identities verified

Preflight was run before the oracle and passed on every item. The table below is the state re-read
when this record was generated (after the oracle run and the baseline run).

| Item | Expected | Observed | Match |
|---|---|---|---|
| target HEAD (A1 commit) | `914ba0b8345cb1eb7ba0d220e7b5eb072b35bcd3` | `914ba0b8345cb1eb7ba0d220e7b5eb072b35bcd3` | YES |
| target HEAD^{tree} (A1 tree) | `26fb9fbb270d5a43cf575ce114b71f87306959de` | `26fb9fbb270d5a43cf575ce114b71f87306959de` | YES |
| target HEAD^ (B0 commit) | `785795af434299d2b6d25910eac2761208766b0d` | `785795af434299d2b6d25910eac2761208766b0d` | YES |
| target git remote | `(empty)` | `(empty)` | YES |
| target status --porcelain --untracked-files=all | `(empty)` | `(empty)` | YES |
| contract A1:FIELD-001-CONTRACT.md sha256 | `7d5132bd119cbdd5f10b7690d6434fbeec872cf9526ab0c7ee751baa8c488f88` | `7d5132bd119cbdd5f10b7690d6434fbeec872cf9526ab0c7ee751baa8c488f88` | YES |
| oracle HEAD | `0dd01113e6d8a295ebcfc30637fef0c9a82a3e99` | `0dd01113e6d8a295ebcfc30637fef0c9a82a3e99` | YES |
| oracle HEAD^{tree} | `50ee0d3532eb7faaea7fe6e45909a3ae2533e138` | `50ee0d3532eb7faaea7fe6e45909a3ae2533e138` | YES |
| oracle git remote | `(empty)` | `(empty)` | YES |
| oracle status --porcelain --untracked-files=all | `(empty)` | `(empty)` | YES |
| committed MANIFEST.sha256 sha256 | `97a854f2feb4a48370f909225dac3d0b044f6101f8b8ca4f8f327a4ddaa51e46` | `97a854f2feb4a48370f909225dac3d0b044f6101f8b8ca4f8f327a4ddaa51e46` | YES |
| worktree MANIFEST.sha256 sha256 | `97a854f2feb4a48370f909225dac3d0b044f6101f8b8ca4f8f327a4ddaa51e46` | `97a854f2feb4a48370f909225dac3d0b044f6101f8b8ca4f8f327a4ddaa51e46` | YES |

Oracle files recomputed against MANIFEST.sha256:

| File | Listed sha256 | Recomputed | Match |
|---|---|---|---|
| `.gitattributes` | `d60f352d0db1404c70afb4bb8b2ca3fd1c610572aa40720e8a0b7baa7885418c` | `d60f352d0db1404c70afb4bb8b2ca3fd1c610572aa40720e8a0b7baa7885418c` | YES |
| `.gitignore` | `862263fa1f46c20f0d1e4dac5ffcc75abd55c08211b2c3864c5f8764b9d87793` | `862263fa1f46c20f0d1e4dac5ffcc75abd55c08211b2c3864c5f8764b9d87793` | YES |
| `README.md` | `3a3c81b34cd077b5c18f28affaf4bd4f8565222a89b96a317d3205cbd19961f5` | `3a3c81b34cd077b5c18f28affaf4bd4f8565222a89b96a317d3205cbd19961f5` | YES |
| `field001_oracle.py` | `d4860354eee9367440ba93a79c1b16ae93112727aac7a08e622575c5046c982d` | `d4860354eee9367440ba93a79c1b16ae93112727aac7a08e622575c5046c982d` | YES |
| `reference/jobservice/server.py` | `25cf681fa72a55fd84098821a5b2be2c1a5091f728615e55f175ac53ba097386` | `25cf681fa72a55fd84098821a5b2be2c1a5091f728615e55f175ac53ba097386` | YES |
| `reference/jobservice/store.py` | `598b10ce43415e138e0f517a4dae1226de4be7a111454fcce37632ca85db672f` | `598b10ce43415e138e0f517a4dae1226de4be7a111454fcce37632ca85db672f` | YES |
| `validate_oracle.py` | `89003712d537f40175b34c3e8328fc257325c8c78f7ae1f47bf91ac9378efd5f` | `89003712d537f40175b34c3e8328fc257325c8c78f7ae1f47bf91ac9378efd5f` | YES |
| `validation-report.json` | `8847632ce4fc42f7dbfb29614a547ee6e5f31abd1f3144b1c86121abdd7a867c` | `8847632ce4fc42f7dbfb29614a547ee6e5f31abd1f3144b1c86121abdd7a867c` | YES |

- Oracle ignored-file entries present now: none
- Target named inside the oracle result: commit `914ba0b8345cb1eb7ba0d220e7b5eb072b35bcd3`, tree `26fb9fbb270d5a43cf575ce114b71f87306959de` — matches A1
- Oracle version `field-001-oracle/1` · Python `3.14.3` · SQLite `3.50.4`

## 2. Q1 execution

- Execution status: **COMPLETE**
- Runs of the oracle: exactly one; no retry, no re-run, no modification of the oracle.
- cwd: `<SEQUESTERED_ORACLE_REPOSITORY>`
- env: `PYTHONDONTWRITEBYTECODE=1 PYTHONIOENCODING=utf-8`
- command: `python field001_oracle.py --repo E:\prog\ccr-field-001-idempotent-jobs --commit 914ba0b8345cb1eb7ba0d220e7b5eb072b35bcd3 --out <results>\q1\q1-oracle-result.json > <results>\q1\q1-oracle-stdout.json 2> <results>\q1\q1-oracle-stderr.txt`
- start_utc: `2026-09-26T15:58:20Z`
- end_utc: `2026-09-26T15:58:23Z`
- exit_code: `0`
- note: `cwd line corrected after the run (a shell printf escape had turned the backslash before 'f001' into a form-feed); other lines unchanged`
- Oracle standard error: empty
- Oracle console output (q1-oracle-stdout.json), verbatim:

```json
{"summary": {"PASS": 12, "FAIL": 0, "BLOCKED": 0}, "verdicts": {"O-01": "PASS", "O-02": "PASS", "O-03": "PASS", "O-04": "PASS", "O-05": "PASS", "O-06": "PASS", "O-07": "PASS", "O-08": "PASS", "O-09": "PASS", "O-10": "PASS", "O-11": "PASS", "O-12": "PASS"}}
```

- Console output consistent with the result file: YES

## 3. Case verdicts O-01 .. O-12

| Case | Title | Clauses | Verdict | Failed checks / total |
|---|---|---|---|---|
| O-01 | legacy no-key behavior | C-LEGACY | **PASS** | 0 / 7 |
| O-02 | invalid key | C-KEY | **PASS** | 0 / 8 |
| O-03 | first keyed creation | C-FIRST | **PASS** | 0 / 4 |
| O-04 | identical replay | C-REPLAY | **PASS** | 0 / 5 |
| O-05 | canonical JSON equivalence | C-IDENTITY, C-REPLAY, C-CONFLICT | **PASS** | 0 / 7 |
| O-06 | same key / different request conflict | C-CONFLICT | **PASS** | 0 / 4 |
| O-07 | persistence across restart | C-DURABLE | **PASS** | 0 / 5 |
| O-08 | concurrent identical requests | C-CONC-IDENTICAL | **PASS** | 0 / 5 |
| O-09 | concurrent competing requests | C-CONC-COMPETING | **PASS** | 0 / 9 |
| O-10 | failed creation does not poison key | C-FAILED-CREATE | **PASS** | 0 / 6 |
| O-11 | conflict does not mutate original binding | C-CONFLICT | **PASS** | 0 / 5 |
| O-12 | no silent legacy fallback | C-NO-FALLBACK | **PASS** | 0 / 2 |

## 4. Evidence per case

### O-01 — legacy no-key behavior

- Clauses: C-LEGACY
- Verdict: **PASS**
- Duration (s): 0.222

**O-01.c1 · C-LEGACY · PASS** — first keyless submission creates a job (201)

```json
{"status": 201, "json": {"id": "e77ce554-364e-4221-a0f3-bfa51af75293", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-26T15:58:21.244439+00:00"}}
```

**O-01.c2 · C-LEGACY · PASS** — second keyless submission creates a job (201)

```json
{"status": 201, "json": {"id": "29a378b6-0d68-4435-a211-c7674da4d427", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-26T15:58:21.251458+00:00"}}
```

**O-01.c3 · C-LEGACY · PASS** — the two keyless submissions return distinct jobs

```json
["e77ce554-364e-4221-a0f3-bfa51af75293", "29a378b6-0d68-4435-a211-c7674da4d427"]
```

**O-01.c4 · C-LEGACY · PASS** — two jobs are stored

```json
2
```

**O-01.c5 · C-LEGACY · PASS** — keyless invalid JSON keeps the existing 400 INVALID_JSON

```json
{"status": 400, "json": {"error": "INVALID_JSON"}}
```

**O-01.c6 · C-LEGACY · PASS** — keyless invalid job body keeps the existing 400 INVALID_JOB

```json
{"status": 400, "json": {"error": "INVALID_JOB"}}
```

**O-01.c7 · C-LEGACY · PASS** — invalid keyless requests create no job

```json
2
```

### O-02 — invalid key

- Clauses: C-KEY
- Verdict: **PASS**
- Duration (s): 0.177

**O-02.c1 · C-KEY · PASS** — invalid key 'has space' → 400 INVALID_IDEMPOTENCY_KEY

```json
{"status": 400, "json": {"error": "INVALID_IDEMPOTENCY_KEY"}}
```

**O-02.c2 · C-KEY · PASS** — invalid key 'slash/key' → 400 INVALID_IDEMPOTENCY_KEY

```json
{"status": 400, "json": {"error": "INVALID_IDEMPOTENCY_KEY"}}
```

**O-02.c3 · C-KEY · PASS** — invalid key 'xxxxxxxx…(129)' → 400 INVALID_IDEMPOTENCY_KEY

```json
{"status": 400, "json": {"error": "INVALID_IDEMPOTENCY_KEY"}}
```

**O-02.c4 · C-KEY · PASS** — invalid key 'semi;colon' → 400 INVALID_IDEMPOTENCY_KEY

```json
{"status": 400, "json": {"error": "INVALID_IDEMPOTENCY_KEY"}}
```

**O-02.c5 · C-KEY · PASS** — invalid key 'brace{' → 400 INVALID_IDEMPOTENCY_KEY

```json
{"status": 400, "json": {"error": "INVALID_IDEMPOTENCY_KEY"}}
```

**O-02.c6 · C-KEY · PASS** — invalid keys create no job

```json
0
```

**O-02.c7 · C-KEY · PASS** — valid key 'AAAA…(128)' is accepted (201)

```json
{"status": 201, "replayed": "false", "json": {"id": "5f51efba-1157-45bb-9740-3791fede7298", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-26T15:58:21.428513+00:00"}}
```

**O-02.c8 · C-KEY · PASS** — valid key 'az.AZ_09:-' is accepted (201)

```json
{"status": 201, "replayed": "false", "json": {"id": "ded7c5ad-1374-412a-86dd-52e40cf2c279", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-26T15:58:21.435697+00:00"}}
```

### O-03 — first keyed creation

- Clauses: C-FIRST
- Verdict: **PASS**
- Duration (s): 0.172

**O-03.c1 · C-FIRST · PASS** — first keyed submission → 201

```json
{"status": 201, "replayed": "false", "json": {"id": "b606ab4c-7f74-4d06-b78a-0e822bb55ff0", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-26T15:58:21.590163+00:00"}}
```

**O-03.c2 · C-FIRST · PASS** — first keyed submission → Idempotency-Replayed: false

```json
"false"
```

**O-03.c3 · C-FIRST · PASS** — exactly one job created

```json
1
```

**O-03.c4 · C-FIRST · PASS** — the returned job is the stored job

```json
{"status": 200, "json": {"id": "b606ab4c-7f74-4d06-b78a-0e822bb55ff0", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-26T15:58:21.590163+00:00"}}
```

### O-04 — identical replay

- Clauses: C-REPLAY
- Verdict: **PASS**
- Duration (s): 0.167

**O-04.c1 · C-FIRST · PASS** — setup: first keyed submission → 201

```json
{"status": 201, "replayed": "false", "json": {"id": "85a551ea-64c8-41e6-87e4-6d0e01931306", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-26T15:58:21.768733+00:00"}}
```

**O-04.c2 · C-REPLAY · PASS** — identical retry → 200

```json
{"status": 200, "replayed": "true", "json": {"id": "85a551ea-64c8-41e6-87e4-6d0e01931306", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-26T15:58:21.768733+00:00"}}
```

**O-04.c3 · C-REPLAY · PASS** — identical retry → Idempotency-Replayed: true

```json
"true"
```

**O-04.c4 · C-REPLAY · PASS** — identical retry returns the same job id

```json
["85a551ea-64c8-41e6-87e4-6d0e01931306", "85a551ea-64c8-41e6-87e4-6d0e01931306"]
```

**O-04.c5 · C-REPLAY · PASS** — no new job on identical retry

```json
1
```

### O-05 — canonical JSON equivalence

- Clauses: C-IDENTITY, C-REPLAY, C-CONFLICT
- Verdict: **PASS**
- Duration (s): 0.175

**O-05.c1 · C-FIRST · PASS** — setup: first keyed submission → 201

```json
{"status": 201, "replayed": "false", "json": {"id": "573c8af3-8284-42f4-9998-f4636002e3ce", "type": "report", "payload": {"b": [1, 2, {"q": "x", "p": null}], "a": {"z": "Z", "y": true}}, "status": "QUEUED", "created_at": "2026-09-26T15:58:21.943032+00:00"}}
```

**O-05.c2 · C-IDENTITY · PASS** — whitespace and key order differ only → same logical request → 200 replay

```json
{"status": 200, "replayed": "true", "json": {"id": "573c8af3-8284-42f4-9998-f4636002e3ce", "type": "report", "payload": {"b": [1, 2, {"q": "x", "p": null}], "a": {"z": "Z", "y": true}}, "status": "QUEUED", "created_at": "2026-09-26T15:58:21.943032+00:00"}}
```

**O-05.c3 · C-IDENTITY · PASS** — the equivalent request returns the same job id

```json
["573c8af3-8284-42f4-9998-f4636002e3ce", "573c8af3-8284-42f4-9998-f4636002e3ce"]
```

**O-05.c4 · C-IDENTITY · PASS** — array order is significant → different logical request → 409 IDEMPOTENCY_CONFLICT

```json
{"status": 409, "json": {"error": "IDEMPOTENCY_CONFLICT"}}
```

**O-05.c5 · C-IDENTITY · PASS** — string values are exact → different logical request → 409 IDEMPOTENCY_CONFLICT

```json
{"status": 409, "json": {"error": "IDEMPOTENCY_CONFLICT"}}
```

**O-05.c6 · C-IDENTITY · PASS** — the type value is exact → different logical request → 409 IDEMPOTENCY_CONFLICT

```json
{"status": 409, "json": {"error": "IDEMPOTENCY_CONFLICT"}}
```

**O-05.c7 · C-CONFLICT · PASS** — only the first request created a job

```json
1
```

### O-06 — same key / different request conflict

- Clauses: C-CONFLICT
- Verdict: **PASS**
- Duration (s): 0.16

**O-06.c1 · C-FIRST · PASS** — setup: first keyed submission → 201

```json
{"status": 201, "replayed": "false", "json": {"id": "abe6dfe8-8de7-45f7-8b7d-8a7ad1aecb8b", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-26T15:58:22.106741+00:00"}}
```

**O-06.c2 · C-CONFLICT · PASS** — same key, different request → 409

```json
{"status": 409, "json": {"error": "IDEMPOTENCY_CONFLICT"}}
```

**O-06.c3 · C-CONFLICT · PASS** — 409 body is {"error": "IDEMPOTENCY_CONFLICT"}

```json
{"error": "IDEMPOTENCY_CONFLICT"}
```

**O-06.c4 · C-CONFLICT · PASS** — no new job on conflict

```json
1
```

### O-07 — persistence across restart

- Clauses: C-DURABLE
- Verdict: **PASS**
- Duration (s): 0.304

**O-07.c1 · C-FIRST · PASS** — setup: first keyed submission → 201

```json
{"status": 201, "replayed": "false", "json": {"id": "807f059d-9fab-4211-a1ce-09c7f6a99f4f", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-26T15:58:22.272445+00:00"}}
```

**O-07.c2 · C-DURABLE · PASS** — after stop / restart on the same database, identical retry → 200 replay

```json
{"status": 200, "replayed": "true", "json": {"id": "807f059d-9fab-4211-a1ce-09c7f6a99f4f", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-26T15:58:22.272445+00:00"}}
```

**O-07.c3 · C-DURABLE · PASS** — the replay returns the same logical job

```json
["807f059d-9fab-4211-a1ce-09c7f6a99f4f", "807f059d-9fab-4211-a1ce-09c7f6a99f4f"]
```

**O-07.c4 · C-DURABLE · PASS** — no new job after restart

```json
1
```

**O-07.c5 · C-DURABLE · PASS** — the job is still readable after restart

```json
{"status": 200, "json": {"id": "807f059d-9fab-4211-a1ce-09c7f6a99f4f", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-26T15:58:22.272445+00:00"}}
```

### O-08 — concurrent identical requests

- Clauses: C-CONC-IDENTICAL
- Verdict: **PASS**
- Duration (s): 0.305

**O-08.c1 · C-CONC-IDENTICAL · PASS** — exactly one HTTP 201

```json
1
```

**O-08.c2 · C-CONC-IDENTICAL · PASS** — zero HTTP 409

```json
0
```

**O-08.c3 · C-CONC-IDENTICAL · PASS** — every other successful request is a 200 replay (Idempotency-Replayed: true)

```json
[{"status": 200, "replayed": "true", "json": {"id": "7ffce5be-681b-4fe1-ab3b-7e80ef04e81b", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-26T15:58:22.572229+00:00"}}, {"status": 200, "replayed": "true", "json": {"id": "7ffce5be-681b-4fe1-ab3b-7e80ef04e81b", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-26T15:58:22.572229+00:00"}}, {"status": 200, "replayed": "true", "json": {"id": "7ffce5be-681b-4fe1-ab3b-7e80ef04e81b", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-26T15:58:22.572229+00:00"}}, {"status": 200, "replayed": "true", "json": {"id": "7ffce5be-681b-4fe1-ab3b-7e80ef04e81b", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-26T15:58:22.572229+00:00"}}, {"status": 200, "replayed": "true", "json": {"id": "7ffce5be-681b-4fe1-ab3b-7e80ef04e81b", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-26T15:58:22.572229+00:00"}}, {"status": 200, "replayed": "true", "json": {"id": "7ffce5be-681b-4fe1-ab3b-7e80ef04e81b", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-26T15:58:22.572229+00:00"}}, {"status": 200, "replayed": "true", "json": {"id": "7ffce5be-681b-4fe1-ab3b-7e80ef04e81b", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-26T15:58:22.572229+00:00"}}]
```

**O-08.c4 · C-CONC-IDENTICAL · PASS** — exactly one distinct job id returned

```json
["7ffce5be-681b-4fe1-ab3b-7e80ef04e81b"]
```

**O-08.c5 · C-CONC-IDENTICAL · PASS** — exactly one job created

```json
1
```

Observations recorded by the oracle (not asserted):

```json
{"statuses": [200, 200, 200, 200, 200, 201, 200, 200], "non_2xx_other_than_409": 0}
```

### O-09 — concurrent competing requests

- Clauses: C-CONC-COMPETING
- Verdict: **PASS**
- Duration (s): 0.341

**O-09.c1 · C-CONC-COMPETING · PASS** — exactly one request is established (one HTTP 201)

```json
1
```

**O-09.c2 · C-CONC-COMPETING · PASS** — at most one job is created for the key

```json
1
```

**O-09.c3 · C-CONC-COMPETING · PASS** — no request with the losing identity succeeds (no silent rebinding)

```json
[{"status": 409, "json": {"error": "IDEMPOTENCY_CONFLICT"}}, {"status": 409, "json": {"error": "IDEMPOTENCY_CONFLICT"}}, {"status": 409, "json": {"error": "IDEMPOTENCY_CONFLICT"}}, {"status": 409, "json": {"error": "IDEMPOTENCY_CONFLICT"}}]
```

**O-09.c4 · C-CONC-COMPETING · PASS** — requests matching the winner are never answered 409

```json
[200, 200, 201, 200]
```

**O-09.c5 · C-CONC-COMPETING · PASS** — successful requests matching the winner replay the established job

```json
[{"status": 200, "replayed": "true", "json": {"id": "01c85f16-6131-4e1b-bc75-f5acb231bb83", "type": "email", "payload": {"to": "billing@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-26T15:58:22.893584+00:00"}}, {"status": 200, "replayed": "true", "json": {"id": "01c85f16-6131-4e1b-bc75-f5acb231bb83", "type": "email", "payload": {"to": "billing@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-26T15:58:22.893584+00:00"}}, {"status": 201, "replayed": "false", "json": {"id": "01c85f16-6131-4e1b-bc75-f5acb231bb83", "type": "email", "payload": {"to": "billing@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-26T15:58:22.893584+00:00"}}, {"status": 200, "replayed": "true", "json": {"id": "01c85f16-6131-4e1b-bc75-f5acb231bb83", "type": "email", "payload": {"to": "billing@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-26T15:58:22.893584+00:00"}}]
```

**O-09.c6 · C-CONC-COMPETING · PASS** — exactly one job exists for the key

```json
1
```

**O-09.c7 · C-CONC-COMPETING · PASS** — afterwards the winning request replays the established job (200, same id)

```json
{"status": 200, "replayed": "true", "json": {"id": "01c85f16-6131-4e1b-bc75-f5acb231bb83", "type": "email", "payload": {"to": "billing@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-26T15:58:22.893584+00:00"}}
```

**O-09.c8 · C-CONC-COMPETING · PASS** — afterwards the losing request → 409 IDEMPOTENCY_CONFLICT

```json
{"status": 409, "json": {"error": "IDEMPOTENCY_CONFLICT"}}
```

**O-09.c9 · C-CONC-COMPETING · PASS** — still exactly one job

```json
1
```

Observations recorded by the oracle (not asserted):

```json
{"statuses": [409, 409, 409, 409, 200, 200, 201, 200], "winner": "R_EMAIL_OTHER"}
```

### O-10 — failed creation does not poison key

- Clauses: C-FAILED-CREATE
- Verdict: **PASS**
- Duration (s): 0.169

**O-10.c1 · C-FAILED-CREATE · PASS** — creation failure → 503

```json
{"status": 503, "json": {"error": "JOB_CREATE_FAILED"}}
```

**O-10.c2 · C-FAILED-CREATE · PASS** — 503 body is {"error": "JOB_CREATE_FAILED"}

```json
{"error": "JOB_CREATE_FAILED"}
```

**O-10.c3 · C-FAILED-CREATE · PASS** — no job is established by the failed attempt

```json
0
```

**O-10.c4 · C-FAILED-CREATE · PASS** — a later retry with the same key and request succeeds (201, not replayed)

```json
{"status": 201, "replayed": "false", "json": {"id": "ae0a8f89-c78e-4c8c-9702-8e400cea8f82", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-26T15:58:23.227338+00:00"}}
```

**O-10.c5 · C-FAILED-CREATE · PASS** — the retry created exactly one job

```json
1
```

**O-10.c6 · C-FAILED-CREATE · PASS** — the key then behaves normally (200 replay of the same job)

```json
{"status": 200, "replayed": "true", "json": {"id": "ae0a8f89-c78e-4c8c-9702-8e400cea8f82", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-26T15:58:23.227338+00:00"}}
```

### O-11 — conflict does not mutate original binding

- Clauses: C-CONFLICT
- Verdict: **PASS**
- Duration (s): 0.178

**O-11.c1 · C-FIRST · PASS** — setup: first keyed submission → 201

```json
{"status": 201, "replayed": "false", "json": {"id": "b5e49408-add5-4b9c-8d09-8cdf682159aa", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-26T15:58:23.402245+00:00"}}
```

**O-11.c2 · C-CONFLICT · PASS** — different request → 409

```json
{"status": 409, "json": {"error": "IDEMPOTENCY_CONFLICT"}}
```

**O-11.c3 · C-CONFLICT · PASS** — after the conflict the key is still bound to the original request (200 replay, same id)

```json
{"status": 200, "replayed": "true", "json": {"id": "b5e49408-add5-4b9c-8d09-8cdf682159aa", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-26T15:58:23.402245+00:00"}}
```

**O-11.c4 · C-CONFLICT · PASS** — the different request is still refused (409)

```json
{"status": 409, "json": {"error": "IDEMPOTENCY_CONFLICT"}}
```

**O-11.c5 · C-CONFLICT · PASS** — no job was created by conflicting requests

```json
1
```

### O-12 — no silent legacy fallback

- Clauses: C-NO-FALLBACK
- Verdict: **PASS**
- Duration (s): 0.212

**O-12.c1 · C-NO-FALLBACK · PASS** — a keyed request whose idempotency processing fails is answered with an explicit 5xx

```json
{"status": 503, "json": {"error": "JOB_CREATE_FAILED"}}
```

**O-12.c2 · C-NO-FALLBACK · PASS** — the request is not processed as an ordinary legacy POST (no job created)

```json
{"before": 1, "after": 1}
```

Observations recorded by the oracle (not asserted):

```json
{"faulted_tables": ["idempotency_keys"], "faulted_job_columns": []}
```

## 5. Material defects established

A material defect is recorded for each oracle check that FAILED, under the contract clause that the
check itself names. Nothing else is counted as a defect.

None established by the oracle evidence: no check failed.

## 6. BLOCKED cases

None.

## 7. Regressions

### Baseline suite on the exact A1 bytes (q1-baseline.txt)

- a1_commit: `914ba0b8345cb1eb7ba0d220e7b5eb072b35bcd3`
- a1_tree: `26fb9fbb270d5a43cf575ce114b71f87306959de`
- export: `git archive --format=tar 914ba0b8345cb1eb7ba0d220e7b5eb072b35bcd3 -> temporary directory (removed after the run)`
- exported_bytes_identical_to_git_blobs: `YES`
- python: `3.14.3`
- command: `python -m unittest tests.test_baseline`
- exit_code: `0`
- unittest summary lines (verbatim): `Ran 10 tests in 5.856s`; `OK`
- Baseline regression: **NO REGRESSION OBSERVED**

### Legacy behavior — case O-01 (C-LEGACY)

- O-01 verdict: **PASS**
- Failed O-01 checks: none

## 8. Oracle infrastructure failures

None observed: the oracle process exited 0 with empty standard error, wrote a parseable result
naming the A1 commit and tree, and the result contains exactly the cases O-01 .. O-12.

Integrity cross-checks of the raw output (recorded, never repaired):

- none failed: recorded summary equals the per-case verdicts; every recorded verdict equals the oracle's
  own rule applied to its checks; console output equals the result file.

## 9. Raw files this record is derived from

| File | sha256 |
|---|---|
| `q1-oracle-result.json` | `03e724e1e9831b744c6313b3a990b3914e0ba5118544499d593866f0040e1768` |
| `q1-oracle-stdout.json` | `5241e55dd46e89eb5e1eeaf1481918a51bc892cc77f81a39a90823c7c1a25ee0` |
| `q1-oracle-stderr.txt` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `q1-oracle-run.txt` | `b4fcf43110fb441e230eb0b3f042e5952bf5649746bb006a6671f7c92027645c` |
| `q1-baseline.txt` | `63c89008f059822c07acb6af489df98736f7483d2945ce8f28e8c5846c478474` |

No speculation beyond the recorded evidence. The target repository, the oracle repository and the
canonical repository were not modified; git was used read-only (0 commit, 0 push).
