"""Validate the FIELD-001 oracle before it is frozen.

1. B0 (exact commit export): only O-01 passes; O-12 is BLOCKED (no idempotency state).
2. Reference implementation (B0 + reference/): every case PASSES, on every repeated run.
3. Mutants of the reference: each targeted case FAILS.

Usage: python validate_oracle.py --repo <target repo> --b0 <sha> [--runs 10] [--out validation-report.json]
"""

import argparse
import io
import json
import os
import shutil
import subprocess
import sys
import tarfile
import tempfile
import time

import field001_oracle as oracle

HERE = os.path.dirname(os.path.abspath(__file__))

B0_EXPECTED = {case_id: "FAIL" for case_id, _, _ in oracle.CASES}
B0_EXPECTED.update({"O-01": "PASS", "O-12": "BLOCKED"})

MUTANTS = {
    "raw-bytes": ["O-05"],
    "in-memory": ["O-07"],
    "poison": ["O-10"],
    "fallback": ["O-12"],
    "rebind": ["O-06", "O-11"],
    "no-header": ["O-03", "O-04"],
}

RACE_MUTANT_RUNS = 5  # a race is caught probabilistically: reported, not a validity gate


def export(repo, commit, destination):
    data = subprocess.run(["git", "-C", repo, "archive", "--format=tar", commit], check=True, capture_output=True).stdout
    with tarfile.open(fileobj=io.BytesIO(data)) as tar:
        tar.extractall(destination, filter="data")


def run_all(target, root, mutant=""):
    previous = os.environ.get("F001_REF_MUTANT")
    os.environ["F001_REF_MUTANT"] = mutant
    try:
        return {case_id: oracle.run_case(case_id, title, clauses, target, root)["verdict"] for case_id, title, clauses in oracle.CASES}
    finally:
        if previous is None:
            os.environ.pop("F001_REF_MUTANT", None)
        else:
            os.environ["F001_REF_MUTANT"] = previous


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo", required=True)
    parser.add_argument("--b0", required=True)
    parser.add_argument("--runs", type=int, default=10)
    parser.add_argument("--out", default=os.path.join(HERE, "validation-report.json"))
    args = parser.parse_args()

    root = tempfile.mkdtemp(prefix="field001-validate-")
    try:
        b0 = os.path.join(root, "b0")
        export(args.repo, args.b0, b0)
        reference = os.path.join(root, "reference")
        export(args.repo, args.b0, reference)
        for name in ("store.py", "server.py"):
            shutil.copyfile(os.path.join(HERE, "reference", "jobservice", name), os.path.join(reference, "jobservice", name))

        report = {"oracle": oracle.ORACLE_VERSION, "python": sys.version.split()[0], "b0_commit": args.b0}
        started = time.monotonic()
        b0_verdicts = run_all(b0, root)
        report["b0"] = {"verdicts": b0_verdicts, "expected": B0_EXPECTED, "matches": b0_verdicts == B0_EXPECTED}

        reference_runs = [run_all(reference, root) for _ in range(args.runs)]
        report["reference"] = {
            "runs": args.runs,
            "all_pass_every_run": all(set(run.values()) == {"PASS"} for run in reference_runs),
            "verdicts_per_run": reference_runs,
        }

        mutants = {}
        for mutant, targeted in MUTANTS.items():
            verdicts = run_all(reference, root, mutant)
            mutants[mutant] = {"targeted": targeted, "verdicts": verdicts, "targeted_fail": all(verdicts[c] == "FAIL" for c in targeted)}
        report["mutants"] = mutants
        race_runs = [run_all(reference, root, "race") for _ in range(RACE_MUTANT_RUNS)]
        report["race_mutant_sensitivity"] = {
            "note": "check-then-insert without atomicity; detection depends on the implementation's own nondeterminism, not on the harness",
            "runs": RACE_MUTANT_RUNS,
            "o08_fail_runs": sum(1 for run in race_runs if run["O-08"] == "FAIL"),
            "o09_fail_runs": sum(1 for run in race_runs if run["O-09"] == "FAIL"),
            "verdicts_per_run": race_runs,
        }
        report["seconds"] = round(time.monotonic() - started, 1)
        report["oracle_valid"] = (
            report["b0"]["matches"] and report["reference"]["all_pass_every_run"] and all(m["targeted_fail"] for m in mutants.values())
        )
        with open(args.out, "w", encoding="utf-8", newline="\n") as handle:
            handle.write(json.dumps(report, indent=2) + "\n")
        print(json.dumps({"oracle_valid": report["oracle_valid"], "b0_matches": report["b0"]["matches"],
                          "reference_all_pass": report["reference"]["all_pass_every_run"],
                          "mutants": {m: v["targeted_fail"] for m, v in mutants.items()},
                          "race_o08_fail_runs": report["race_mutant_sensitivity"]["o08_fail_runs"],
                          "race_o09_fail_runs": report["race_mutant_sensitivity"]["o09_fail_runs"], "seconds": report["seconds"]}))
        return 0 if report["oracle_valid"] else 1
    finally:
        shutil.rmtree(root, ignore_errors=True)


if __name__ == "__main__":
    sys.exit(main())
