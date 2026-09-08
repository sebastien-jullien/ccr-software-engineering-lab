/**
 * Exécution d'une ligne de vérité en processus isolé, et hiérarchie de verdict.
 *
 * Source unique : `evaluate.mjs` (campagne complète) et les deux fichiers
 * `candidate-*.test.mjs` (vue `node:test`) passent tous par ici. Il n'existe
 * donc qu'un seul oracle, jamais deux verdicts concurrents pour une ligne.
 *
 * Hiérarchie gelée :
 *
 *   A  événement requis observé (la ligne a conclu)   → PASS / FAIL sémantique
 *   B  fin réelle du processus sans conclusion,
 *      sans watchdog et sans panne de harnais         → ROW FAIL
 *   C  watchdog termine avant A ou B                  → ROW INCONCLUSIVE
 *   D  panne d'évaluateur / de harnais                → EVALUATION ARTIFACT FAILURE
 *
 * `beforeExit` est journalisé à titre de diagnostic. Il n'a aucune autorité de
 * verdict : un candidat peut y ordonnancer une progression, et réussir.
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CHILD = path.join(HERE, 'row-child.mjs');

/** Valeur par défaut du watchdog opérationnel, en millisecondes. */
export const DEFAULT_WATCHDOG_MS = 20000;

export function runRow(row, { implPath, watchdogMs = DEFAULT_WATCHDOG_MS, label = 'candidat' }) {
  return new Promise((resolve) => {
    const startedAt = Date.now();
    const child = spawn(process.execPath, [CHILD, '--impl', implPath, '--row', row.id], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    let watchdogFired = false;
    child.stdout.on('data', (c) => (stdout += c));
    child.stderr.on('data', (c) => (stderr += c));
    const timer = setTimeout(() => { watchdogFired = true; child.kill('SIGKILL'); }, watchdogMs);
    child.on('close', (code, signal) => {
      clearTimeout(timer);
      const durationMs = Date.now() - startedAt;
      const marker = stdout.split('\n').find((l) => l.startsWith('##ROW##'));
      let payload = null;
      try { payload = marker ? JSON.parse(marker.slice(7)) : null; } catch { payload = null; }

      let outcome;
      if (payload?.harnessFault) outcome = 'ARTIFACT_FAILURE';           // D
      else if (watchdogFired) outcome = 'INCONCLUSIVE';                  // C
      else if (payload?.concluded === true) outcome = payload.pass ? 'PASS' : 'FAIL';  // A
      else if (payload === null) outcome = 'ARTIFACT_FAILURE';           // D
      else outcome = 'FAIL';                                             // B

      resolve({
        rowId: row.id, axis: row.axis, visibility: row.visibility, label,
        outcome, detail: payload?.detail ?? null, harnessFault: payload?.harnessFault ?? null,
        concluded: payload?.concluded ?? false, beforeExitCount: payload?.beforeExitCount ?? null,
        exitCode: code, signal, watchdogFired, naturalExit: !watchdogFired && signal === null,
        durationMs, stdout, stderr,
      });
    });
  });
}

export function summarize(results, { label, implPath, watchdogMs, denominator }) {
  const tally = (o) => results.filter((r) => r.outcome === o).length;
  return {
    label, implPath, watchdogMs,
    rows: results.length, denominator,
    pass: tally('PASS'), fail: tally('FAIL'),
    inconclusive: tally('INCONCLUSIVE'), artifactFailure: tally('ARTIFACT_FAILURE'),
    passedRows: results.filter((r) => r.outcome === 'PASS').map((r) => r.rowId),
    failedRows: results.filter((r) => r.outcome === 'FAIL').map((r) => r.rowId),
    inconclusiveRows: results.filter((r) => r.outcome === 'INCONCLUSIVE').map((r) => r.rowId),
    artifactRows: results.filter((r) => r.outcome === 'ARTIFACT_FAILURE').map((r) => r.rowId),
    maxDurationMs: results.length ? Math.max(...results.map((r) => r.durationMs)) : null,
    minDurationMs: results.length ? Math.min(...results.map((r) => r.durationMs)) : null,
    slowestRow: results.slice().sort((a, b) => b.durationMs - a.durationMs)[0]?.rowId ?? null,
  };
}
