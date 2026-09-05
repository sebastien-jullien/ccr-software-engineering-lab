import test from 'node:test';
import assert from 'node:assert/strict';
import { ReservationEngine } from '../dist/reservation-engine.js';

test('reserve accepte un intervalle valide et normalise en UTC', () => {
  const engine = new ReservationEngine();
  const result = engine.reserve('r1', '2026-09-04T12:30:00+02:00', '2026-09-04T13:30:00+02:00');
  assert.deepEqual(result, {
    ok: true,
    reservation: {
      id: 'r1',
      start: '2026-09-04T10:30:00.000Z',
      end: '2026-09-04T11:30:00.000Z',
      status: 'active'
    }
  });
});

test('les intervalles adjacents sont autorisés', () => {
  const engine = new ReservationEngine();
  assert.equal(engine.reserve('a', '2026-09-04T10:00:00Z', '2026-09-04T11:00:00Z').ok, true);
  assert.equal(engine.reserve('b', '2026-09-04T11:00:00Z', '2026-09-04T12:00:00Z').ok, true);
});

test('un chevauchement actif est rejeté', () => {
  const engine = new ReservationEngine();
  assert.equal(engine.reserve('a', '2026-09-04T10:00:00Z', '2026-09-04T11:00:00Z').ok, true);
  assert.deepEqual(
    engine.reserve('b', '2026-09-04T10:30:00Z', '2026-09-04T11:30:00Z'),
    { ok: false, reason: 'OVERLAP' }
  );
});

test('une annulation libère l’intervalle mais conserve la réservation annulée', () => {
  const engine = new ReservationEngine();
  assert.equal(engine.reserve('a', '2026-09-04T10:00:00Z', '2026-09-04T11:00:00Z').ok, true);
  const cancelled = engine.cancel('a');
  assert.equal(cancelled.ok, true);
  if (cancelled.ok) assert.equal(cancelled.reservation.status, 'cancelled');
  assert.equal(engine.reserve('b', '2026-09-04T10:15:00Z', '2026-09-04T10:45:00Z').ok, true);
  assert.equal(engine.list().find((r) => r.id === 'a')?.status, 'cancelled');
});

test('list applique l’ordre start, end, id', () => {
  const engine = new ReservationEngine();
  engine.reserve('z', '2026-09-04T12:00:00Z', '2026-09-04T13:00:00Z');
  engine.reserve('b', '2026-09-04T08:00:00Z', '2026-09-04T09:00:00Z');
  engine.reserve('a', '2026-09-04T09:00:00Z', '2026-09-04T10:00:00Z');
  assert.deepEqual(engine.list().map((r) => r.id), ['b', 'a', 'z']);
});

test('start == end est un intervalle invalide', () => {
  const engine = new ReservationEngine();
  assert.deepEqual(
    engine.reserve('a', '2026-09-04T10:00:00Z', '2026-09-04T10:00:00Z'),
    { ok: false, reason: 'INVALID_INTERVAL' }
  );
});

test('un identifiant actif ne peut pas être réutilisé', () => {
  const engine = new ReservationEngine();
  assert.equal(engine.reserve('same', '2026-09-04T10:00:00Z', '2026-09-04T11:00:00Z').ok, true);
  assert.deepEqual(
    engine.reserve('same', '2026-09-04T12:00:00Z', '2026-09-04T13:00:00Z'),
    { ok: false, reason: 'DUPLICATE_ID' }
  );
});
