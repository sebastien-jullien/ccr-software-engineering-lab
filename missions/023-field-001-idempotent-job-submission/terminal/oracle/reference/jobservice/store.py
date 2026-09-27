"""ORACLE VALIDATION ONLY — reference FIELD-001 store, never shown to the Author or the Challenger.

B0 store plus a durable idempotency table. ``F001_REF_MUTANT`` selects a
deliberately wrong variant used to prove the oracle detects that defect.
"""

import json
import os
import sqlite3
import threading
import uuid
from datetime import datetime, timezone

MUTANT = os.environ.get("F001_REF_MUTANT", "")

SCHEMA = """
CREATE TABLE IF NOT EXISTS jobs (
    id         TEXT PRIMARY KEY,
    type       TEXT NOT NULL,
    payload    TEXT NOT NULL,
    status     TEXT NOT NULL,
    created_at TEXT NOT NULL
)
"""

IDEMPOTENCY_SCHEMA = (
    "CREATE TABLE IF NOT EXISTS idempotency_keys (key TEXT NOT NULL, fingerprint TEXT NOT NULL, job_id TEXT NOT NULL)"
    if MUTANT == "race"
    else "CREATE TABLE IF NOT EXISTS idempotency_keys (key TEXT PRIMARY KEY, fingerprint TEXT NOT NULL, job_id TEXT NOT NULL)"
)

INITIAL_STATUS = "QUEUED"


class IdempotencyConflict(Exception):
    pass


_MEMORY = {}
_MEMORY_LOCK = threading.Lock()


class JobStore:
    def __init__(self, path, timeout=30.0):
        self.path = str(path)
        self.timeout = timeout

    def connect(self):
        return sqlite3.connect(self.path, timeout=self.timeout, isolation_level=None)

    def initialize(self):
        conn = self.connect()
        try:
            conn.execute(SCHEMA)
            if MUTANT != "in-memory":
                conn.execute(IDEMPOTENCY_SCHEMA)
        finally:
            conn.close()

    @staticmethod
    def new_job(job_type, payload):
        return {
            "id": str(uuid.uuid4()),
            "type": job_type,
            "payload": payload,
            "status": INITIAL_STATUS,
            "created_at": datetime.now(timezone.utc).isoformat(timespec="microseconds"),
        }

    @staticmethod
    def insert_job(conn, job):
        conn.execute(
            "INSERT INTO jobs (id, type, payload, status, created_at) VALUES (?, ?, ?, ?, ?)",
            (job["id"], job["type"], json.dumps(job["payload"]), job["status"], job["created_at"]),
        )

    def create_job(self, job_type, payload):
        job = self.new_job(job_type, payload)
        conn = self.connect()
        try:
            self.insert_job(conn, job)
        finally:
            conn.close()
        return job

    def create_job_idempotent(self, key, fingerprint, job_type, payload):
        """Return (job, replayed) or raise IdempotencyConflict."""
        if MUTANT == "in-memory":
            with _MEMORY_LOCK:
                if key in _MEMORY:
                    bound_fingerprint, job = _MEMORY[key]
                    if bound_fingerprint != fingerprint:
                        raise IdempotencyConflict(key)
                    return job, True
                job = self.create_job(job_type, payload)
                _MEMORY[key] = (fingerprint, job)
                return job, False

        if MUTANT == "race":
            conn = self.connect()
            try:
                row = conn.execute("SELECT fingerprint, job_id FROM idempotency_keys WHERE key = ?", (key,)).fetchone()
                if row is not None:
                    if row[0] != fingerprint:
                        raise IdempotencyConflict(key)
                    return self._read(conn, row[1]), True
                job = self.new_job(job_type, payload)
                self.insert_job(conn, job)
                conn.execute("INSERT INTO idempotency_keys (key, fingerprint, job_id) VALUES (?, ?, ?)", (key, fingerprint, job["id"]))
                return job, False
            finally:
                conn.close()

        conn = self.connect()
        try:
            owns_pending = False
            if MUTANT == "poison":
                cursor = conn.execute(
                    "INSERT OR IGNORE INTO idempotency_keys (key, fingerprint, job_id) VALUES (?, ?, '')", (key, fingerprint)
                )
                owns_pending = cursor.rowcount == 1
            conn.execute("BEGIN IMMEDIATE")
            row = conn.execute("SELECT fingerprint, job_id FROM idempotency_keys WHERE key = ?", (key,)).fetchone()
            if row is not None and row[1] != "":
                if row[0] != fingerprint:
                    if MUTANT == "rebind":
                        job = self.new_job(job_type, payload)
                        self.insert_job(conn, job)
                        conn.execute("UPDATE idempotency_keys SET fingerprint = ?, job_id = ? WHERE key = ?", (fingerprint, job["id"], key))
                        conn.execute("COMMIT")
                        return job, False
                    conn.execute("ROLLBACK")
                    raise IdempotencyConflict(key)
                job = self._read(conn, row[1])
                conn.execute("COMMIT")
                return job, True
            if MUTANT == "poison" and not owns_pending:
                conn.execute("ROLLBACK")
                raise sqlite3.OperationalError("pending key left by an earlier failed attempt")
            job = self.new_job(job_type, payload)
            self.insert_job(conn, job)
            if MUTANT == "poison":
                conn.execute("UPDATE idempotency_keys SET job_id = ? WHERE key = ?", (job["id"], key))
            else:
                conn.execute("INSERT INTO idempotency_keys (key, fingerprint, job_id) VALUES (?, ?, ?)", (key, fingerprint, job["id"]))
            conn.execute("COMMIT")
            return job, False
        except BaseException:
            if conn.in_transaction:
                conn.execute("ROLLBACK")
            raise
        finally:
            conn.close()

    @staticmethod
    def _read(conn, job_id):
        row = conn.execute("SELECT id, type, payload, status, created_at FROM jobs WHERE id = ?", (job_id,)).fetchone()
        return {"id": row[0], "type": row[1], "payload": json.loads(row[2]), "status": row[3], "created_at": row[4]}

    def get_job(self, job_id):
        conn = self.connect()
        try:
            row = conn.execute("SELECT id, type, payload, status, created_at FROM jobs WHERE id = ?", (job_id,)).fetchone()
        finally:
            conn.close()
        if row is None:
            return None
        return {"id": row[0], "type": row[1], "payload": json.loads(row[2]), "status": row[3], "created_at": row[4]}

    def count_jobs(self):
        conn = self.connect()
        try:
            return conn.execute("SELECT COUNT(*) FROM jobs").fetchone()[0]
        finally:
            conn.close()
