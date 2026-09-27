"""ORACLE VALIDATION ONLY — reference FIELD-001 server, never shown to the Author or the Challenger.

B0 server plus the FIELD-001 contract. ``F001_REF_MUTANT`` selects a
deliberately wrong variant used to prove the oracle detects that defect.
"""

import argparse
import hashlib
import json
import os
import re
import sqlite3
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

from .store import IdempotencyConflict, JobStore

MUTANT = os.environ.get("F001_REF_MUTANT", "")
JOB_PATH = re.compile(r"/jobs/([^/?#]+)")
KEY = re.compile(r"[A-Za-z0-9._:-]{1,128}")


class RequestError(Exception):
    def __init__(self, status, code):
        super().__init__(code)
        self.status = status
        self.code = code


def parse_job_request(body):
    try:
        data = json.loads(body.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError):
        raise RequestError(400, "INVALID_JSON") from None
    if not isinstance(data, dict) or set(data) != {"type", "payload"}:
        raise RequestError(400, "INVALID_JOB")
    job_type, payload = data["type"], data["payload"]
    if not isinstance(job_type, str) or not job_type.strip():
        raise RequestError(400, "INVALID_JOB")
    if not isinstance(payload, dict):
        raise RequestError(400, "INVALID_JOB")
    return job_type, payload


def fingerprint(job_type, payload, raw_body):
    if MUTANT == "raw-bytes":
        return hashlib.sha256(raw_body).hexdigest()
    canonical = json.dumps({"type": job_type, "payload": payload}, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


class JobRequestHandler(BaseHTTPRequestHandler):
    server_version = "jobservice/1"

    def do_POST(self):
        if self.path != "/jobs":
            self.send_json(404, {"error": "NOT_FOUND"})
            return
        key = self.headers.get("Idempotency-Key")
        if key is not None and KEY.fullmatch(key) is None:
            self.send_json(400, {"error": "INVALID_IDEMPOTENCY_KEY"})
            return
        body = self.read_body()
        try:
            job_type, payload = parse_job_request(body)
        except RequestError as error:
            self.send_json(error.status, {"error": error.code})
            return
        store = self.server.store
        if key is None:
            try:
                job = store.create_job(job_type, payload)
            except sqlite3.Error:
                self.send_json(503, {"error": "JOB_CREATE_FAILED"})
                return
            self.send_json(201, job)
            return
        try:
            job, replayed = store.create_job_idempotent(key, fingerprint(job_type, payload, body), job_type, payload)
        except IdempotencyConflict:
            self.send_json(409, {"error": "IDEMPOTENCY_CONFLICT"})
            return
        except sqlite3.Error:
            if MUTANT == "fallback":
                try:
                    job = store.create_job(job_type, payload)
                except sqlite3.Error:
                    self.send_json(503, {"error": "JOB_CREATE_FAILED"})
                    return
                self.send_json(201, job)
                return
            self.send_json(503, {"error": "JOB_CREATE_FAILED"})
            return
        headers = {} if MUTANT == "no-header" else {"Idempotency-Replayed": "true" if replayed else "false"}
        self.send_json(200 if replayed else 201, job, headers)

    def do_GET(self):
        match = JOB_PATH.fullmatch(self.path)
        if match is None:
            self.send_json(404, {"error": "NOT_FOUND"})
            return
        try:
            job = self.server.store.get_job(match.group(1))
        except sqlite3.Error:
            self.send_json(503, {"error": "STORAGE_UNAVAILABLE"})
            return
        if job is None:
            self.send_json(404, {"error": "JOB_NOT_FOUND"})
            return
        self.send_json(200, job)

    def read_body(self):
        try:
            length = int(self.headers.get("Content-Length") or 0)
        except ValueError:
            length = 0
        return self.rfile.read(length) if length > 0 else b""

    def send_json(self, status, document, headers=None):
        body = json.dumps(document).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        for name, value in (headers or {}).items():
            self.send_header(name, value)
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        if self.server.verbose:
            super().log_message(format, *args)


class JobServer(ThreadingHTTPServer):
    daemon_threads = True

    def __init__(self, address, store, verbose=False):
        self.store = store
        self.verbose = verbose
        super().__init__(address, JobRequestHandler)


def create_server(db_path, host="127.0.0.1", port=0, store=None, verbose=False):
    store = store if store is not None else JobStore(db_path)
    store.initialize()
    return JobServer((host, port), store, verbose=verbose)


def main(argv=None):
    parser = argparse.ArgumentParser(prog="python -m jobservice", description="Job submission service.")
    parser.add_argument("--db", required=True)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8080)
    parser.add_argument("--verbose", action="store_true")
    args = parser.parse_args(argv)
    server = create_server(args.db, args.host, args.port, verbose=args.verbose)
    host, port = server.server_address[:2]
    print(f"listening on http://{host}:{port}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
    return 0
