import test from 'node:test';
import assert from 'node:assert/strict';
import { ReferenceReservationEngine as ReservationEngine } from './reference-engine.mjs';

test('reserve accepte un intervalle valide et normalise en UTC', () => {
  const engine = new ReservationEngine();
  const result = engine.reserve('r1', '2026-09-04T12:30:00+02:00', '2026-09-04T13:30:00+02:00');
  assert.deepEqual(result, { ok: true, reservation: { id: 'r1', start: '2026-09-04T10:30:00.000Z', end: '2026-09-04T11:30:00.000Z', status: 'active' } });
});

test('adjacency, overlap, cancellation, ordering, invalid interval, duplicate id', () => {
  const adjacency = new ReservationEngine();
  assert.equal(adjacency.reserve('a', '2026-09-04T10:00:00Z', '2026-09-04T11:00:00Z').ok, true);
  assert.equal(adjacency.reserve('b', '2026-09-04T11:00:00Z', '2026-09-04T12:00:00Z').ok, true);

  const overlap = new ReservationEngine();
  overlap.reserve('a', '2026-09-04T10:00:00Z', '2026-09-04T11:00:00Z');
  assert.deepEqual(overlap.reserve('b', '2026-09-04T10:30:00Z', '2026-09-04T11:30:00Z'), { ok: false, reason: 'OVERLAP' });

  const cancelled = new ReservationEngine();
  cancelled.reserve('a', '2026-09-04T10:00:00Z', '2026-09-04T11:00:00Z');
  assert.equal(cancelled.cancel('a').ok, true);
  assert.equal(cancelled.reserve('b', '2026-09-04T10:15:00Z', '2026-09-04T10:45:00Z').ok, true);

  const ordered = new ReservationEngine();
  ordered.reserve('z', '2026-09-04T12:00:00Z', '2026-09-04T13:00:00Z');
  ordered.reserve('b', '2026-09-04T08:00:00Z', '2026-09-04T09:00:00Z');
  ordered.reserve('a', '2026-09-04T09:00:00Z', '2026-09-04T10:00:00Z');
  assert.deepEqual(ordered.list().map((r) => r.id), ['b', 'a', 'z']);

  assert.deepEqual(new ReservationEngine().reserve('a', '2026-09-04T10:00:00Z', '2026-09-04T10:00:00Z'), { ok: false, reason: 'INVALID_INTERVAL' });
  const duplicate = new ReservationEngine();
  duplicate.reserve('same', '2026-09-04T10:00:00Z', '2026-09-04T11:00:00Z');
  assert.deepEqual(duplicate.reserve('same', '2026-09-04T12:00:00Z', '2026-09-04T13:00:00Z'), { ok: false, reason: 'DUPLICATE_ID' });
});
