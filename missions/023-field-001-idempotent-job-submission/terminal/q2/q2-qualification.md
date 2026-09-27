# FIELD-001 · Q2 qualification record — frozen A2 (final implementation)

- Role: AGENT CCR LAB #67 — independent qualifier, final Q2 of frozen A2
- Record generated (UTC): 2026-09-27T03:15:57Z
- Authority: none over the contract, the oracle or the protocol; this record states the evidence only.
- Method: this record is derived mechanically from the raw Q2 files listed in section 9, so that no Q2
  outcome transits through the chat of the qualifier session. Generator sha256 (source fed on stdin): `049cdf0c794dc661bfa67d7d82f20fa1f169ea44114aba29dd9edbc96d4bd09a`
- Session disclosure: the protocol asks for a new session. Q2 was executed in the same qualifier session
  that executed Q1 of A1, through the same sealed procedure: no Q1 outcome was displayed in that session,
  and no Q1 file was opened, listed or read for Q2.

## 1. Identities verified

Preflight was run before the oracle and passed on every item. The table below is the state re-read
when this record was generated (after the oracle run and the baseline run).

| Item | Expected | Observed | Match |
|---|---|---|---|
| target HEAD (A2 commit) | `c554667fba9a24123ba4964a1a00fe8ab6d2f6e1` | `c554667fba9a24123ba4964a1a00fe8ab6d2f6e1` | YES |
| target HEAD^{tree} (A2 tree) | `602d5e67b0a58feba09b9ebb185699e75b07fdc3` | `602d5e67b0a58feba09b9ebb185699e75b07fdc3` | YES |
| target HEAD^ (A1 commit) | `914ba0b8345cb1eb7ba0d220e7b5eb072b35bcd3` | `914ba0b8345cb1eb7ba0d220e7b5eb072b35bcd3` | YES |
| target HEAD^^ (B0 commit) | `785795af434299d2b6d25910eac2761208766b0d` | `785795af434299d2b6d25910eac2761208766b0d` | YES |
| target git remote | `(empty)` | `(empty)` | YES |
| target status --porcelain --ignored --untracked-files=all | `(empty)` | `(empty)` | YES |
| contract A2:FIELD-001-CONTRACT.md sha256 | `7d5132bd119cbdd5f10b7690d6434fbeec872cf9526ab0c7ee751baa8c488f88` | `7d5132bd119cbdd5f10b7690d6434fbeec872cf9526ab0c7ee751baa8c488f88` | YES |
| oracle HEAD | `0dd01113e6d8a295ebcfc30637fef0c9a82a3e99` | `0dd01113e6d8a295ebcfc30637fef0c9a82a3e99` | YES |
| oracle HEAD^{tree} | `50ee0d3532eb7faaea7fe6e45909a3ae2533e138` | `50ee0d3532eb7faaea7fe6e45909a3ae2533e138` | YES |
| oracle git remote | `(empty)` | `(empty)` | YES |
| oracle status --porcelain --ignored --untracked-files=all | `(empty)` | `(empty)` | YES |
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

- Target named inside the oracle result: commit `c554667fba9a24123ba4964a1a00fe8ab6d2f6e1`, tree `602d5e67b0a58feba09b9ebb185699e75b07fdc3` — matches A2
- Oracle version `field-001-oracle/1` · Python `3.14.3` · SQLite `3.50.4`

## 2. Q2 execution

- Execution status: **COMPLETE**
- Runs of the oracle: exactly one; no retry, no re-run, no modification of the oracle.
- cwd: `<SEQUESTERED_ORACLE_REPOSITORY>`
- env: `PYTHONDONTWRITEBYTECODE=1 PYTHONIOENCODING=utf-8`
- command: `python field001_oracle.py --repo E:\prog\ccr-field-001-idempotent-jobs --commit c554667fba9a24123ba4964a1a00fe8ab6d2f6e1 --out <results>\q2\q2-oracle-result.json > <results>\q2\q2-oracle-stdout.json 2> <results>\q2\q2-oracle-stderr.txt`
- oracle process exit code (as reported by the shell): `0`
- Oracle standard error (q2-oracle-stderr.txt): empty
- Oracle console output (q2-oracle-stdout.json), verbatim:

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
- Duration (s): 0.188

**O-01.c1 · C-LEGACY · PASS** — first keyless submission creates a job (201)

```json
{"status": 201, "json": {"id": "242edb26-150a-442b-85da-467ce8cb20a6", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-27T03:03:57.182487+00:00"}}
```

**O-01.c2 · C-LEGACY · PASS** — second keyless submission creates a job (201)

```json
{"status": 201, "json": {"id": "548ce15c-877c-4ace-b91a-1c0d44956a29", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-27T03:03:57.188533+00:00"}}
```

**O-01.c3 · C-LEGACY · PASS** — the two keyless submissions return distinct jobs

```json
["242edb26-150a-442b-85da-467ce8cb20a6", "548ce15c-877c-4ace-b91a-1c0d44956a29"]
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
- Duration (s): 0.16

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
{"status": 201, "replayed": "false", "json": {"id": "ba7ebddc-5646-46cc-8c2d-283056336a6a", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-27T03:03:57.349584+00:00"}}
```

**O-02.c8 · C-KEY · PASS** — valid key 'az.AZ_09:-' is accepted (201)

```json
{"status": 201, "replayed": "false", "json": {"id": "932cf1c7-1771-47bd-98a3-116e8b4fba6b", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-27T03:03:57.354792+00:00"}}
```

### O-03 — first keyed creation

- Clauses: C-FIRST
- Verdict: **PASS**
- Duration (s): 0.151

**O-03.c1 · C-FIRST · PASS** — first keyed submission → 201

```json
{"status": 201, "replayed": "false", "json": {"id": "2b891ee5-8fcd-4172-b297-ea0bd27656e4", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-27T03:03:57.502031+00:00"}}
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
{"status": 200, "json": {"id": "2b891ee5-8fcd-4172-b297-ea0bd27656e4", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-27T03:03:57.502031+00:00"}}
```

### O-04 — identical replay

- Clauses: C-REPLAY
- Verdict: **PASS**
- Duration (s): 0.152

**O-04.c1 · C-FIRST · PASS** — setup: first keyed submission → 201

```json
{"status": 201, "replayed": "false", "json": {"id": "c1006043-2523-40c4-9671-5928b82936a4", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-27T03:03:57.654739+00:00"}}
```

**O-04.c2 · C-REPLAY · PASS** — identical retry → 200

```json
{"status": 200, "replayed": "true", "json": {"id": "c1006043-2523-40c4-9671-5928b82936a4", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-27T03:03:57.654739+00:00"}}
```

**O-04.c3 · C-REPLAY · PASS** — identical retry → Idempotency-Replayed: true

```json
"true"
```

**O-04.c4 · C-REPLAY · PASS** — identical retry returns the same job id

```json
["c1006043-2523-40c4-9671-5928b82936a4", "c1006043-2523-40c4-9671-5928b82936a4"]
```

**O-04.c5 · C-REPLAY · PASS** — no new job on identical retry

```json
1
```

### O-05 — canonical JSON equivalence

- Clauses: C-IDENTITY, C-REPLAY, C-CONFLICT
- Verdict: **PASS**
- Duration (s): 0.157

**O-05.c1 · C-FIRST · PASS** — setup: first keyed submission → 201

```json
{"status": 201, "replayed": "false", "json": {"id": "27dd52c0-0c55-4afc-a681-ff311a03487b", "type": "report", "payload": {"b": [1, 2, {"q": "x", "p": null}], "a": {"z": "Z", "y": true}}, "status": "QUEUED", "created_at": "2026-09-27T03:03:57.808551+00:00"}}
```

**O-05.c2 · C-IDENTITY · PASS** — whitespace and key order differ only → same logical request → 200 replay

```json
{"status": 200, "replayed": "true", "json": {"id": "27dd52c0-0c55-4afc-a681-ff311a03487b", "type": "report", "payload": {"b": [1, 2, {"q": "x", "p": null}], "a": {"z": "Z", "y": true}}, "status": "QUEUED", "created_at": "2026-09-27T03:03:57.808551+00:00"}}
```

**O-05.c3 · C-IDENTITY · PASS** — the equivalent request returns the same job id

```json
["27dd52c0-0c55-4afc-a681-ff311a03487b", "27dd52c0-0c55-4afc-a681-ff311a03487b"]
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
- Duration (s): 0.152

**O-06.c1 · C-FIRST · PASS** — setup: first keyed submission → 201

```json
{"status": 201, "replayed": "false", "json": {"id": "85f8dd9c-e80e-4f79-b5b0-e80100f6732a", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-27T03:03:57.964385+00:00"}}
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
- Duration (s): 0.288

**O-07.c1 · C-FIRST · PASS** — setup: first keyed submission → 201

```json
{"status": 201, "replayed": "false", "json": {"id": "59b0f680-9cb9-441f-9d56-383d381ecb48", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-27T03:03:58.119654+00:00"}}
```

**O-07.c2 · C-DURABLE · PASS** — after stop / restart on the same database, identical retry → 200 replay

```json
{"status": 200, "replayed": "true", "json": {"id": "59b0f680-9cb9-441f-9d56-383d381ecb48", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-27T03:03:58.119654+00:00"}}
```

**O-07.c3 · C-DURABLE · PASS** — the replay returns the same logical job

```json
["59b0f680-9cb9-441f-9d56-383d381ecb48", "59b0f680-9cb9-441f-9d56-383d381ecb48"]
```

**O-07.c4 · C-DURABLE · PASS** — no new job after restart

```json
1
```

**O-07.c5 · C-DURABLE · PASS** — the job is still readable after restart

```json
{"status": 200, "json": {"id": "59b0f680-9cb9-441f-9d56-383d381ecb48", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-27T03:03:58.119654+00:00"}}
```

### O-08 — concurrent identical requests

- Clauses: C-CONC-IDENTICAL
- Verdict: **PASS**
- Duration (s): 0.248

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
[{"status": 200, "replayed": "true", "json": {"id": "0713c5c4-4e6a-42ea-9342-199a167e0e52", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-27T03:03:58.404887+00:00"}}, {"status": 200, "replayed": "true", "json": {"id": "0713c5c4-4e6a-42ea-9342-199a167e0e52", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-27T03:03:58.404887+00:00"}}, {"status": 200, "replayed": "true", "json": {"id": "0713c5c4-4e6a-42ea-9342-199a167e0e52", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-27T03:03:58.404887+00:00"}}, {"status": 200, "replayed": "true", "json": {"id": "0713c5c4-4e6a-42ea-9342-199a167e0e52", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-27T03:03:58.404887+00:00"}}, {"status": 200, "replayed": "true", "json": {"id": "0713c5c4-4e6a-42ea-9342-199a167e0e52", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-27T03:03:58.404887+00:00"}}, {"status": 200, "replayed": "true", "json": {"id": "0713c5c4-4e6a-42ea-9342-199a167e0e52", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-27T03:03:58.404887+00:00"}}, {"status": 200, "replayed": "true", "json": {"id": "0713c5c4-4e6a-42ea-9342-199a167e0e52", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-27T03:03:58.404887+00:00"}}]
```

**O-08.c4 · C-CONC-IDENTICAL · PASS** — exactly one distinct job id returned

```json
["0713c5c4-4e6a-42ea-9342-199a167e0e52"]
```

**O-08.c5 · C-CONC-IDENTICAL · PASS** — exactly one job created

```json
1
```

Observations recorded by the oracle (not asserted):

```json
{"statuses": [200, 200, 200, 201, 200, 200, 200, 200], "non_2xx_other_than_409": 0}
```

### O-09 — concurrent competing requests

- Clauses: C-CONC-COMPETING
- Verdict: **PASS**
- Duration (s): 0.22

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
[{"status": 200, "replayed": "true", "json": {"id": "4e3e3e4f-b694-4c09-92d6-6e409a036ca2", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-27T03:03:58.653677+00:00"}}, {"status": 200, "replayed": "true", "json": {"id": "4e3e3e4f-b694-4c09-92d6-6e409a036ca2", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-27T03:03:58.653677+00:00"}}, {"status": 201, "replayed": "false", "json": {"id": "4e3e3e4f-b694-4c09-92d6-6e409a036ca2", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-27T03:03:58.653677+00:00"}}, {"status": 200, "replayed": "true", "json": {"id": "4e3e3e4f-b694-4c09-92d6-6e409a036ca2", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-27T03:03:58.653677+00:00"}}]
```

**O-09.c6 · C-CONC-COMPETING · PASS** — exactly one job exists for the key

```json
1
```

**O-09.c7 · C-CONC-COMPETING · PASS** — afterwards the winning request replays the established job (200, same id)

```json
{"status": 200, "replayed": "true", "json": {"id": "4e3e3e4f-b694-4c09-92d6-6e409a036ca2", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-27T03:03:58.653677+00:00"}}
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
{"statuses": [200, 200, 201, 200, 409, 409, 409, 409], "winner": "R_EMAIL"}
```

### O-10 — failed creation does not poison key

- Clauses: C-FAILED-CREATE
- Verdict: **PASS**
- Duration (s): 0.183

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
{"status": 201, "replayed": "false", "json": {"id": "5244094b-f201-4c56-884a-638ab4e663eb", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-27T03:03:58.904783+00:00"}}
```

**O-10.c5 · C-FAILED-CREATE · PASS** — the retry created exactly one job

```json
1
```

**O-10.c6 · C-FAILED-CREATE · PASS** — the key then behaves normally (200 replay of the same job)

```json
{"status": 200, "replayed": "true", "json": {"id": "5244094b-f201-4c56-884a-638ab4e663eb", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-27T03:03:58.904783+00:00"}}
```

### O-11 — conflict does not mutate original binding

- Clauses: C-CONFLICT
- Verdict: **PASS**
- Duration (s): 0.153

**O-11.c1 · C-FIRST · PASS** — setup: first keyed submission → 201

```json
{"status": 201, "replayed": "false", "json": {"id": "896e3924-194a-45ce-800e-277894c42f29", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-27T03:03:59.055398+00:00"}}
```

**O-11.c2 · C-CONFLICT · PASS** — different request → 409

```json
{"status": 409, "json": {"error": "IDEMPOTENCY_CONFLICT"}}
```

**O-11.c3 · C-CONFLICT · PASS** — after the conflict the key is still bound to the original request (200 replay, same id)

```json
{"status": 200, "replayed": "true", "json": {"id": "896e3924-194a-45ce-800e-277894c42f29", "type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}, "status": "QUEUED", "created_at": "2026-09-27T03:03:59.055398+00:00"}}
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
- Duration (s): 0.177

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

### Baseline suite on the exact A2 bytes (q2-baseline.txt)

- a2_commit: `c554667fba9a24123ba4964a1a00fe8ab6d2f6e1`
- a2_tree: `602d5e67b0a58feba09b9ebb185699e75b07fdc3`
- export: `git archive --format=tar c554667fba9a24123ba4964a1a00fe8ab6d2f6e1 -> one temporary directory (removed after the run)`
- exported_bytes_identical_to_git_blobs: `YES`
- python: `3.14.3`
- command: `python -m unittest tests.test_baseline`
- exit_code: `0`
- unittest summary lines (verbatim): `Ran 10 tests in 5.887s`; `OK`
- Baseline regression: **NO REGRESSION OBSERVED**

### Legacy behavior — case O-01 (C-LEGACY)

- O-01 verdict: **PASS**
- Failed O-01 checks: none

## 8. Oracle infrastructure failures

None observed: the oracle process exited 0 with empty standard error, wrote a parseable result
naming the A2 commit and tree, and the result contains exactly the cases O-01 .. O-12.

Integrity cross-checks of the raw output (recorded, never repaired):

- none failed: recorded summary equals the per-case verdicts; every recorded verdict equals the rule of
  the oracle applied to its checks; console output equals the result file.

## 9. Raw files this record is derived from

| File | sha256 |
|---|---|
| `q2-oracle-result.json` | `0430ebd1be0b0e1b756bfd77d7a0af004cbdb2b81f4d273e3f8282c6d2a09208` |
| `q2-oracle-stdout.json` | `5241e55dd46e89eb5e1eeaf1481918a51bc892cc77f81a39a90823c7c1a25ee0` |
| `q2-oracle-stderr.txt` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `q2-baseline.txt` | `49f6a492351ce28ee23c6225cf96ee03cd55442d4f06b8d2afa940dd01ebf205` |

No speculation beyond the recorded evidence. The target repository, the oracle repository and the
canonical repository were not modified; git was used read-only (0 commit, 0 push).
