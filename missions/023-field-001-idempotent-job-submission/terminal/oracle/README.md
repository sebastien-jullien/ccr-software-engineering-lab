# FIELD-001 independent oracle — SEQUESTERED

This repository is sequestered until the FIELD-001 study reaches its terminal.
It must not be shown to the Author (AGENT CCR LAB #65) or to the Challenger
(AGENT CCR LAB #66). Only the independent qualifier (AGENT CCR LAB #67) uses it,
for Q1 and Q2, without authority to change the contract or this oracle.

No remote. Frozen by its first commit; the public commitment is that commit,
its tree and `MANIFEST.sha256`.

## What it checks

Cases O-01 .. O-12, each mapped to a clause of the public contract
`FIELD-001-CONTRACT.md` of the target repository:

| Case | Title | Clauses |
|---|---|---|
| O-01 | legacy no-key behavior | C-LEGACY |
| O-02 | invalid key | C-KEY |
| O-03 | first keyed creation | C-FIRST |
| O-04 | identical replay | C-REPLAY |
| O-05 | canonical JSON equivalence | C-IDENTITY, C-REPLAY, C-CONFLICT |
| O-06 | same key / different request conflict | C-CONFLICT |
| O-07 | persistence across restart | C-DURABLE |
| O-08 | concurrent identical requests | C-CONC-IDENTICAL |
| O-09 | concurrent competing requests | C-CONC-COMPETING |
| O-10 | failed creation does not poison key | C-FAILED-CREATE |
| O-11 | conflict does not mutate original binding | C-CONFLICT |
| O-12 | no silent legacy fallback | C-NO-FALLBACK |

Every check carries the clause it enforces. Verdict per case: PASS, FAIL
(a clause check failed) or BLOCKED (the case could not be exercised).

## How it works

- The exact commit under test is exported with `git archive` into a temporary
  directory; the target worktree is never touched.
- The service is started through its public entry point
  `python -m jobservice --db <db> --host 127.0.0.1 --port 0` (C-SCOPE), with
  `PYTHONDONTWRITEBYTECODE=1`, one fresh database per case; O-07 restarts the
  service on the same database.
- Job counts are read from the B0 `jobs` table of the shared database.
- Storage faults (O-10, O-12) are SQLite triggers whose body fails at execution
  time (`json()` on malformed text → `sqlite3.OperationalError`); they are
  removed right after the faulted request. O-10 faults inserts into `jobs`.
  O-12 first performs one keyed request, then faults writes to every table other
  than `jobs` and keyed writes to any column added to `jobs` since B0; if no such
  durable idempotency state exists, O-12 is BLOCKED.
- Concurrency (O-08: 8 identical requests; O-09: 4 + 4 competing requests):
  one `threading.Barrier`, one shared database, every worker joined before any
  assertion; no sleep decides correctness, nothing is retried.
- O-08 / O-09 do not assert on failed (non-2xx, non-409) responses beyond what
  the contract states; they are recorded as observations. O-09 asserts no
  predetermined winner: one established request, at most one job, consistent
  replay / conflict behavior afterward.

## Use (qualifier)

```
python field001_oracle.py --repo <target repository> --commit <frozen A1 or A2 commit> --out q1-result.json
```

The same frozen oracle is used for Q1 and Q2; it is never modified after the
FIELD-001 transaction freeze.

## Validation performed before the freeze

`validate_oracle.py` (report: `validation-report.json`):

- B0: only O-01 passes; O-12 is BLOCKED;
- reference implementation (`reference/`, validation only): every case passes on every repeated run;
- mutants of the reference: each targeted case fails;
- race mutant (non-atomic check-then-insert): detection rate reported.
