"""FIELD-001 independent oracle — cases O-01 .. O-12.

Black-box: the implementation under test is started through its public
command-line entry point (C-SCOPE) and exercised over HTTP. The only other
contact is the shared SQLite database file the service is given on the
command line: job counts are read from the B0 ``jobs`` table, and storage
faults are induced with SQLite triggers that fail at execution time.

Every check names the public contract clause it enforces. No sleeps decide
correctness, nothing is retried until it passes, and every concurrent case
joins all of its workers before asserting.

Usage:
    python field001_oracle.py --repo <target repo> --commit <sha> [--out result.json]
    python field001_oracle.py --target-dir <exported tree> [--out result.json]
"""

import argparse
import http.client
import io
import json
import os
import shutil
import sqlite3
import subprocess
import sys
import tarfile
import tempfile
import threading
import time

ORACLE_VERSION = "field-001-oracle/1"
START_TIMEOUT = 30.0
REQUEST_TIMEOUT = 60.0
STOP_TIMEOUT = 30.0
WORKERS = 8
B0_JOB_COLUMNS = {"id", "type", "payload", "status", "created_at"}
FAULT = "SELECT json('field-001 oracle injected storage fault')"

CASES = [
    ("O-01", "legacy no-key behavior", ["C-LEGACY"]),
    ("O-02", "invalid key", ["C-KEY"]),
    ("O-03", "first keyed creation", ["C-FIRST"]),
    ("O-04", "identical replay", ["C-REPLAY"]),
    ("O-05", "canonical JSON equivalence", ["C-IDENTITY", "C-REPLAY", "C-CONFLICT"]),
    ("O-06", "same key / different request conflict", ["C-CONFLICT"]),
    ("O-07", "persistence across restart", ["C-DURABLE"]),
    ("O-08", "concurrent identical requests", ["C-CONC-IDENTICAL"]),
    ("O-09", "concurrent competing requests", ["C-CONC-COMPETING"]),
    ("O-10", "failed creation does not poison key", ["C-FAILED-CREATE"]),
    ("O-11", "conflict does not mutate original binding", ["C-CONFLICT"]),
    ("O-12", "no silent legacy fallback", ["C-NO-FALLBACK"]),
]


class Blocked(Exception):
    """The case could not be exercised against this implementation."""


# --------------------------------------------------------------------- #
# Service under test
# --------------------------------------------------------------------- #


class Service:
    def __init__(self, target_dir, db_path, workdir):
        self.target_dir = target_dir
        self.db_path = db_path
        self.workdir = workdir
        self.process = None
        self.port = None

    def start(self):
        env = dict(os.environ, PYTHONDONTWRITEBYTECODE="1", PYTHONUNBUFFERED="1")
        self.stderr = open(os.path.join(self.workdir, "service-%d.stderr" % time.monotonic_ns()), "wb")
        self.process = subprocess.Popen(
            [sys.executable, "-m", "jobservice", "--db", self.db_path, "--host", "127.0.0.1", "--port", "0"],
            cwd=self.target_dir,
            stdout=subprocess.PIPE,
            stderr=self.stderr,
            env=env,
        )
        first = {}

        def read_first_line():
            first["line"] = self.process.stdout.readline().decode("utf-8", "replace").strip()

        reader = threading.Thread(target=read_first_line, daemon=True)
        reader.start()
        reader.join(START_TIMEOUT)
        line = first.get("line", "")
        prefix = "listening on http://127.0.0.1:"
        if not line.startswith(prefix) or not line[len(prefix):].isdigit():
            self.stop()
            raise Blocked("service did not start through its entry point (first line: %r)" % line)
        self.port = int(line[len(prefix):])
        threading.Thread(target=self._drain, daemon=True).start()
        return self

    def _drain(self):
        try:
            for _ in self.process.stdout:
                pass
        except (OSError, ValueError):
            pass

    def stop(self):
        if self.process is not None and self.process.poll() is None:
            self.process.terminate()
            try:
                self.process.wait(STOP_TIMEOUT)
            except subprocess.TimeoutExpired:
                self.process.kill()
                self.process.wait(STOP_TIMEOUT)
        if self.process is not None and self.process.stdout:
            self.process.stdout.close()
        if getattr(self, "stderr", None):
            self.stderr.close()

    def post(self, body, key=None):
        if not isinstance(body, (bytes, str)):
            body = json.dumps(body)
        headers = {"Content-Type": "application/json"}
        if key is not None:
            headers["Idempotency-Key"] = key
        return self._request("POST", "/jobs", body, headers)

    def get(self, job_id):
        return self._request("GET", "/jobs/" + job_id, None, {})

    def _request(self, method, path, body, headers):
        conn = http.client.HTTPConnection("127.0.0.1", self.port, timeout=REQUEST_TIMEOUT)
        try:
            conn.request(method, path, body=body, headers=headers)
            response = conn.getresponse()
            raw = response.read()
            try:
                document = json.loads(raw) if raw else None
            except ValueError:
                document = None
            return {
                "status": response.status,
                "replayed": response.getheader("Idempotency-Replayed"),
                "json": document,
            }
        except (OSError, http.client.HTTPException) as error:
            return {"status": None, "replayed": None, "json": None, "error": "%s: %s" % (type(error).__name__, error)}
        finally:
            conn.close()


# --------------------------------------------------------------------- #
# Shared database access
# --------------------------------------------------------------------- #


def db_connect(db_path):
    return sqlite3.connect(db_path, timeout=REQUEST_TIMEOUT, isolation_level=None)


def count_jobs(db_path):
    conn = db_connect(db_path)
    try:
        return conn.execute("SELECT COUNT(*) FROM jobs").fetchone()[0]
    except sqlite3.OperationalError as error:
        raise Blocked("B0 jobs table not readable in the shared database: %s" % error)
    finally:
        conn.close()


def quote(name):
    return '"' + name.replace('"', '""') + '"'


def install_faults(db_path, statements):
    conn = db_connect(db_path)
    names = []
    try:
        for index, (table, event, condition) in enumerate(statements):
            name = "field001_oracle_fault_%d" % index
            when = " WHEN " + condition if condition else ""
            conn.execute("CREATE TRIGGER %s BEFORE %s ON %s%s BEGIN %s; END" % (name, event, quote(table), when, FAULT))
            names.append(name)
    finally:
        conn.close()
    return names


def remove_faults(db_path, names):
    conn = db_connect(db_path)
    try:
        for name in names:
            conn.execute("DROP TRIGGER IF EXISTS %s" % name)
    finally:
        conn.close()


# --------------------------------------------------------------------- #
# Case bookkeeping
# --------------------------------------------------------------------- #


class Case:
    def __init__(self, case_id, title, clauses):
        self.id = case_id
        self.title = title
        self.clauses = clauses
        self.checks = []
        self.observations = {}

    def check(self, clause, description, condition, observed=None):
        self.checks.append({"clause": clause, "check": description, "result": "PASS" if condition else "FAIL", "observed": observed})
        return condition


def job_id(response):
    document = response.get("json")
    return document.get("id") if isinstance(document, dict) else None


def error_code(response):
    document = response.get("json")
    return document.get("error") if isinstance(document, dict) else None


def summary(response):
    return {key: response.get(key) for key in ("status", "replayed", "json", "error") if response.get(key) is not None}


R_EMAIL = {"type": "email", "payload": {"to": "ops@example.com", "tags": ["a", "b"]}}
R_EMAIL_OTHER = {"type": "email", "payload": {"to": "billing@example.com", "tags": ["a", "b"]}}


def concurrent(service, submissions):
    barrier = threading.Barrier(len(submissions))
    results = [None] * len(submissions)

    def work(index, body, key):
        barrier.wait()
        results[index] = service.post(body, key)

    threads = [threading.Thread(target=work, args=(i, body, key)) for i, (body, key) in enumerate(submissions)]
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join()
    return results


# --------------------------------------------------------------------- #
# Cases
# --------------------------------------------------------------------- #


def o01(case, svc, db):
    first, second = svc.post(R_EMAIL), svc.post(R_EMAIL)
    case.check("C-LEGACY", "first keyless submission creates a job (201)", first["status"] == 201, summary(first))
    case.check("C-LEGACY", "second keyless submission creates a job (201)", second["status"] == 201, summary(second))
    case.check("C-LEGACY", "the two keyless submissions return distinct jobs",
               job_id(first) is not None and job_id(second) is not None and job_id(first) != job_id(second),
               [job_id(first), job_id(second)])
    case.check("C-LEGACY", "two jobs are stored", count_jobs(db) == 2, count_jobs(db))
    bad_json = svc.post(b"{not json")
    case.check("C-LEGACY", "keyless invalid JSON keeps the existing 400 INVALID_JSON",
               bad_json["status"] == 400 and error_code(bad_json) == "INVALID_JSON", summary(bad_json))
    bad_job = svc.post({"type": "email"})
    case.check("C-LEGACY", "keyless invalid job body keeps the existing 400 INVALID_JOB",
               bad_job["status"] == 400 and error_code(bad_job) == "INVALID_JOB", summary(bad_job))
    case.check("C-LEGACY", "invalid keyless requests create no job", count_jobs(db) == 2, count_jobs(db))


def o02(case, svc, db):
    for key in ["has space", "slash/key", "x" * 129, "semi;colon", "brace{"]:
        response = svc.post(R_EMAIL, key)
        case.check("C-KEY", "invalid key %r → 400 INVALID_IDEMPOTENCY_KEY" % (key if len(key) < 20 else key[:8] + "…(%d)" % len(key)),
                   response["status"] == 400 and error_code(response) == "INVALID_IDEMPOTENCY_KEY", summary(response))
    case.check("C-KEY", "invalid keys create no job", count_jobs(db) == 0, count_jobs(db))
    for key in ["A" * 128, "az.AZ_09:-"]:
        response = svc.post(R_EMAIL, key)
        case.check("C-KEY", "valid key %r is accepted (201)" % (key if len(key) < 20 else key[:4] + "…(%d)" % len(key)),
                   response["status"] == 201, summary(response))


def o03(case, svc, db):
    response = svc.post(R_EMAIL, "o03-key")
    case.check("C-FIRST", "first keyed submission → 201", response["status"] == 201, summary(response))
    case.check("C-FIRST", "first keyed submission → Idempotency-Replayed: false", response["replayed"] == "false", response["replayed"])
    case.check("C-FIRST", "exactly one job created", count_jobs(db) == 1, count_jobs(db))
    identifier = job_id(response)
    fetched = svc.get(identifier) if identifier else {"status": None}
    case.check("C-FIRST", "the returned job is the stored job",
               fetched["status"] == 200 and isinstance(fetched.get("json"), dict)
               and fetched["json"].get("type") == R_EMAIL["type"] and fetched["json"].get("payload") == R_EMAIL["payload"],
               summary(fetched))


def o04(case, svc, db):
    first = svc.post(R_EMAIL, "o04-key")
    replay = svc.post(R_EMAIL, "o04-key")
    case.check("C-FIRST", "setup: first keyed submission → 201", first["status"] == 201, summary(first))
    case.check("C-REPLAY", "identical retry → 200", replay["status"] == 200, summary(replay))
    case.check("C-REPLAY", "identical retry → Idempotency-Replayed: true", replay["replayed"] == "true", replay["replayed"])
    case.check("C-REPLAY", "identical retry returns the same job id",
               job_id(first) is not None and job_id(replay) == job_id(first), [job_id(first), job_id(replay)])
    case.check("C-REPLAY", "no new job on identical retry", count_jobs(db) == 1, count_jobs(db))


def o05(case, svc, db):
    compact = b'{"type":"report","payload":{"b":[1,2,{"q":"x","p":null}],"a":{"z":"Z","y":true}}}'
    spaced = (b'{\n  "payload" : { "a" : { "y" : true , "z" : "Z" } ,\n'
              b'  "b" : [ 1 , 2 , { "p" : null , "q" : "x" } ] } ,\n  "type" : "report"\n}\n')
    first = svc.post(compact, "o05-key")
    case.check("C-FIRST", "setup: first keyed submission → 201", first["status"] == 201, summary(first))
    same = svc.post(spaced, "o05-key")
    case.check("C-IDENTITY", "whitespace and key order differ only → same logical request → 200 replay",
               same["status"] == 200 and same["replayed"] == "true", summary(same))
    case.check("C-IDENTITY", "the equivalent request returns the same job id",
               job_id(first) is not None and job_id(same) == job_id(first), [job_id(first), job_id(same)])
    variants = [
        ("array order is significant", b'{"type":"report","payload":{"b":[2,1,{"q":"x","p":null}],"a":{"z":"Z","y":true}}}'),
        ("string values are exact", b'{"type":"report","payload":{"b":[1,2,{"q":"x","p":null}],"a":{"z":"z","y":true}}}'),
        ("the type value is exact", b'{"type":"Report","payload":{"b":[1,2,{"q":"x","p":null}],"a":{"z":"Z","y":true}}}'),
    ]
    for rule, body in variants:
        response = svc.post(body, "o05-key")
        case.check("C-IDENTITY", rule + " → different logical request → 409 IDEMPOTENCY_CONFLICT",
                   response["status"] == 409 and error_code(response) == "IDEMPOTENCY_CONFLICT", summary(response))
    case.check("C-CONFLICT", "only the first request created a job", count_jobs(db) == 1, count_jobs(db))


def o06(case, svc, db):
    first = svc.post(R_EMAIL, "o06-key")
    case.check("C-FIRST", "setup: first keyed submission → 201", first["status"] == 201, summary(first))
    other = svc.post(R_EMAIL_OTHER, "o06-key")
    case.check("C-CONFLICT", "same key, different request → 409", other["status"] == 409, summary(other))
    case.check("C-CONFLICT", "409 body is {\"error\": \"IDEMPOTENCY_CONFLICT\"}", error_code(other) == "IDEMPOTENCY_CONFLICT", other.get("json"))
    case.check("C-CONFLICT", "no new job on conflict", count_jobs(db) == 1, count_jobs(db))


def o07(case, target, db, workdir):
    first_service = Service(target, db, workdir).start()
    try:
        first = first_service.post(R_EMAIL, "o07-key")
    finally:
        first_service.stop()
    case.check("C-FIRST", "setup: first keyed submission → 201", first["status"] == 201, summary(first))
    second_service = Service(target, db, workdir).start()
    try:
        replay = second_service.post(R_EMAIL, "o07-key")
        fetched = second_service.get(job_id(first)) if job_id(first) else {"status": None}
    finally:
        second_service.stop()
    case.check("C-DURABLE", "after stop / restart on the same database, identical retry → 200 replay",
               replay["status"] == 200 and replay["replayed"] == "true", summary(replay))
    case.check("C-DURABLE", "the replay returns the same logical job",
               job_id(first) is not None and job_id(replay) == job_id(first), [job_id(first), job_id(replay)])
    case.check("C-DURABLE", "no new job after restart", count_jobs(db) == 1, count_jobs(db))
    case.check("C-DURABLE", "the job is still readable after restart", fetched["status"] == 200, summary(fetched))


def o08(case, svc, db):
    results = concurrent(svc, [(R_EMAIL, "o08-key")] * WORKERS)
    statuses = [r["status"] for r in results]
    case.observations["statuses"] = statuses
    case.observations["non_2xx_other_than_409"] = sum(1 for s in statuses if s is None or (s >= 300 and s != 409))
    created = [r for r in results if r["status"] == 201]
    succeeded = [r for r in results if r["status"] is not None and 200 <= r["status"] < 300]
    case.check("C-CONC-IDENTICAL", "exactly one HTTP 201", len(created) == 1, len(created))
    case.check("C-CONC-IDENTICAL", "zero HTTP 409", statuses.count(409) == 0, statuses.count(409))
    case.check("C-CONC-IDENTICAL", "every other successful request is a 200 replay (Idempotency-Replayed: true)",
               all(r["status"] == 200 and r["replayed"] == "true" for r in succeeded if r["status"] != 201),
               [summary(r) for r in succeeded if r["status"] != 201])
    case.check("C-CONC-IDENTICAL", "exactly one distinct job id returned",
               len({job_id(r) for r in succeeded}) == 1 and None not in {job_id(r) for r in succeeded},
               sorted({str(job_id(r)) for r in succeeded}))
    case.check("C-CONC-IDENTICAL", "exactly one job created", count_jobs(db) == 1, count_jobs(db))


def o09(case, svc, db):
    submissions = [(R_EMAIL, "o09-key")] * (WORKERS // 2) + [(R_EMAIL_OTHER, "o09-key")] * (WORKERS // 2)
    results = concurrent(svc, submissions)
    case.observations["statuses"] = [r["status"] for r in results]
    created = [i for i, r in enumerate(results) if r["status"] == 201]
    case.check("C-CONC-COMPETING", "exactly one request is established (one HTTP 201)", len(created) == 1, len(created))
    case.check("C-CONC-COMPETING", "at most one job is created for the key", count_jobs(db) <= 1, count_jobs(db))
    if len(created) != 1:
        return
    winner_body = submissions[created[0]][0]
    loser_body = R_EMAIL_OTHER if winner_body is R_EMAIL else R_EMAIL
    winner_id = job_id(results[created[0]])
    case.observations["winner"] = "R_EMAIL" if winner_body is R_EMAIL else "R_EMAIL_OTHER"
    winners = [r for (body, _), r in zip(submissions, results) if body is winner_body]
    losers = [r for (body, _), r in zip(submissions, results) if body is not winner_body]
    case.check("C-CONC-COMPETING", "no request with the losing identity succeeds (no silent rebinding)",
               all(r["status"] is None or not 200 <= r["status"] < 300 for r in losers), [summary(r) for r in losers])
    case.check("C-CONC-COMPETING", "requests matching the winner are never answered 409",
               all(r["status"] != 409 for r in winners), [r["status"] for r in winners])
    case.check("C-CONC-COMPETING", "successful requests matching the winner replay the established job",
               all(job_id(r) == winner_id and (r["status"] == 201 or (r["status"] == 200 and r["replayed"] == "true"))
                   for r in winners if r["status"] is not None and 200 <= r["status"] < 300),
               [summary(r) for r in winners])
    case.check("C-CONC-COMPETING", "exactly one job exists for the key", count_jobs(db) == 1, count_jobs(db))
    after_winner = svc.post(winner_body, "o09-key")
    after_loser = svc.post(loser_body, "o09-key")
    case.check("C-CONC-COMPETING", "afterwards the winning request replays the established job (200, same id)",
               after_winner["status"] == 200 and after_winner["replayed"] == "true" and job_id(after_winner) == winner_id,
               summary(after_winner))
    case.check("C-CONC-COMPETING", "afterwards the losing request → 409 IDEMPOTENCY_CONFLICT",
               after_loser["status"] == 409 and error_code(after_loser) == "IDEMPOTENCY_CONFLICT", summary(after_loser))
    case.check("C-CONC-COMPETING", "still exactly one job", count_jobs(db) == 1, count_jobs(db))


def o10(case, svc, db):
    count_jobs(db)
    names = install_faults(db, [("jobs", "INSERT", None)])
    try:
        failed = svc.post(R_EMAIL, "o10-key")
    finally:
        remove_faults(db, names)
    case.check("C-FAILED-CREATE", "creation failure → 503", failed["status"] == 503, summary(failed))
    case.check("C-FAILED-CREATE", "503 body is {\"error\": \"JOB_CREATE_FAILED\"}", error_code(failed) == "JOB_CREATE_FAILED", failed.get("json"))
    case.check("C-FAILED-CREATE", "no job is established by the failed attempt", count_jobs(db) == 0, count_jobs(db))
    retry = svc.post(R_EMAIL, "o10-key")
    case.check("C-FAILED-CREATE", "a later retry with the same key and request succeeds (201, not replayed)",
               retry["status"] == 201 and retry["replayed"] == "false", summary(retry))
    case.check("C-FAILED-CREATE", "the retry created exactly one job", count_jobs(db) == 1, count_jobs(db))
    replay = svc.post(R_EMAIL, "o10-key")
    case.check("C-FAILED-CREATE", "the key then behaves normally (200 replay of the same job)",
               replay["status"] == 200 and replay["replayed"] == "true" and job_id(replay) == job_id(retry) and job_id(retry) is not None,
               summary(replay))


def o11(case, svc, db):
    first = svc.post(R_EMAIL, "o11-key")
    case.check("C-FIRST", "setup: first keyed submission → 201", first["status"] == 201, summary(first))
    conflict = svc.post(R_EMAIL_OTHER, "o11-key")
    case.check("C-CONFLICT", "different request → 409", conflict["status"] == 409, summary(conflict))
    replay = svc.post(R_EMAIL, "o11-key")
    case.check("C-CONFLICT", "after the conflict the key is still bound to the original request (200 replay, same id)",
               replay["status"] == 200 and replay["replayed"] == "true" and job_id(replay) == job_id(first) and job_id(first) is not None,
               summary(replay))
    again = svc.post(R_EMAIL_OTHER, "o11-key")
    case.check("C-CONFLICT", "the different request is still refused (409)", again["status"] == 409, summary(again))
    case.check("C-CONFLICT", "no job was created by conflicting requests", count_jobs(db) == 1, count_jobs(db))


def o12(case, svc, db):
    setup = svc.post(R_EMAIL, "o12-setup-key")
    if setup["status"] != 201:
        raise Blocked("a first keyed submission did not succeed, so no idempotency state could be observed: %r" % summary(setup))
    conn = db_connect(db)
    try:
        tables = [row[0] for row in conn.execute("SELECT name FROM sqlite_master WHERE type = 'table'")
                  if row[0] != "jobs" and not row[0].startswith("sqlite_")]
        columns = [row[1] for row in conn.execute("PRAGMA table_info(jobs)") if row[1] not in B0_JOB_COLUMNS]
    finally:
        conn.close()
    case.observations["faulted_tables"] = tables
    case.observations["faulted_job_columns"] = columns
    if not tables and not columns:
        raise Blocked("no durable idempotency state was found in the shared database to fault")
    faults = []
    for table in tables:
        faults += [(table, "INSERT", None), (table, "UPDATE", None)]
    for column in columns:
        faults += [("jobs", "INSERT", "NEW.%s IS NOT NULL" % quote(column)),
                   ("jobs", "UPDATE OF %s" % quote(column), "NEW.%s IS NOT NULL" % quote(column))]
    before = count_jobs(db)
    names = install_faults(db, faults)
    try:
        response = svc.post(R_EMAIL_OTHER, "o12-key")
    finally:
        remove_faults(db, names)
    after = count_jobs(db)
    case.check("C-NO-FALLBACK", "a keyed request whose idempotency processing fails is answered with an explicit 5xx",
               response["status"] is not None and 500 <= response["status"] < 600, summary(response))
    case.check("C-NO-FALLBACK", "the request is not processed as an ordinary legacy POST (no job created)",
               after == before, {"before": before, "after": after})


def run_case(case_id, title, clauses, target, root):
    case = Case(case_id, title, clauses)
    workdir = tempfile.mkdtemp(prefix=case_id.lower() + "-", dir=root)
    db = os.path.join(workdir, "jobs.db")
    service = None
    started = time.monotonic()
    try:
        if case_id == "O-07":
            o07(case, target, db, workdir)
        else:
            service = Service(target, db, workdir).start()
            {"O-01": o01, "O-02": o02, "O-03": o03, "O-04": o04, "O-05": o05, "O-06": o06, "O-08": o08,
             "O-09": o09, "O-10": o10, "O-11": o11, "O-12": o12}[case_id](case, service, db)
        verdict = "FAIL" if any(c["result"] == "FAIL" for c in case.checks) else "PASS"
        reason = None
        if not case.checks:
            verdict, reason = "BLOCKED", "no check could be executed"
    except Blocked as blocked:
        verdict, reason = "BLOCKED", str(blocked)
    finally:
        if service is not None:
            service.stop()
    return {
        "id": case.id,
        "title": case.title,
        "clauses": case.clauses,
        "verdict": verdict,
        "blocked_reason": reason,
        "checks": case.checks,
        "observations": case.observations,
        "seconds": round(time.monotonic() - started, 3),
    }


def export_commit(repo, commit, destination):
    archive = subprocess.run(["git", "-C", repo, "archive", "--format=tar", commit], check=True, capture_output=True).stdout
    with tarfile.open(fileobj=io.BytesIO(archive)) as tar:
        tar.extractall(destination, filter="data")
    return destination


def main(argv=None):
    parser = argparse.ArgumentParser(description="FIELD-001 independent oracle")
    parser.add_argument("--repo", help="target repository (read-only; the commit is exported)")
    parser.add_argument("--commit", help="exact commit to evaluate")
    parser.add_argument("--target-dir", help="an already exported tree to evaluate")
    parser.add_argument("--out", help="write the JSON result here")
    parser.add_argument("--cases", help="comma-separated subset of case ids")
    args = parser.parse_args(argv)

    root = tempfile.mkdtemp(prefix="field001-oracle-")
    try:
        if args.target_dir:
            target, source = os.path.abspath(args.target_dir), {"target_dir": os.path.abspath(args.target_dir)}
        elif args.repo and args.commit:
            commit = subprocess.run(["git", "-C", args.repo, "rev-parse", "--verify", args.commit + "^{commit}"],
                                    check=True, capture_output=True, text=True).stdout.strip()
            tree = subprocess.run(["git", "-C", args.repo, "rev-parse", commit + "^{tree}"],
                                  check=True, capture_output=True, text=True).stdout.strip()
            target = export_commit(args.repo, commit, os.path.join(root, "target"))
            source = {"commit": commit, "tree": tree}
        else:
            parser.error("give --repo and --commit, or --target-dir")
        wanted = set(args.cases.split(",")) if args.cases else None
        results = [run_case(case_id, title, clauses, target, root)
                   for case_id, title, clauses in CASES if wanted is None or case_id in wanted]
        document = {
            "oracle": ORACLE_VERSION,
            "python": sys.version.split()[0],
            "sqlite": sqlite3.sqlite_version,
            "target": source,
            "cases": results,
            "summary": {verdict: sum(1 for r in results if r["verdict"] == verdict) for verdict in ("PASS", "FAIL", "BLOCKED")},
        }
        text = json.dumps(document, indent=2, ensure_ascii=False) + "\n"
        if args.out:
            with open(args.out, "w", encoding="utf-8", newline="\n") as handle:
                handle.write(text)
        print(json.dumps({"summary": document["summary"], "verdicts": {r["id"]: r["verdict"] for r in results}}))
        return 0
    finally:
        shutil.rmtree(root, ignore_errors=True)


if __name__ == "__main__":
    sys.exit(main())
