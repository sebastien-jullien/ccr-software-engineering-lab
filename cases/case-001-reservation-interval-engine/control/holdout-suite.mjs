import assert from 'node:assert/strict';

export function registerHoldoutSuite(test, ReservationEngine) {
  test('H1 — des instants équivalents avec offsets différents se chevauchent', () => {
    const engine = new ReservationEngine();
    assert.equal(engine.reserve('a', '2026-09-04T10:00:00+02:00', '2026-09-04T11:00:00+02:00').ok, true);
    assert.deepEqual(engine.reserve('b', '2026-09-04T08:30:00Z', '2026-09-04T09:30:00Z'), { ok: false, reason: 'OVERLAP' });
  });

  test('H2 — adjacency calculée sur les instants UTC est autorisée', () => {
    const engine = new ReservationEngine();
    assert.equal(engine.reserve('a', '2026-09-04T10:00:00+02:00', '2026-09-04T11:00:00+02:00').ok, true);
    assert.equal(engine.reserve('b', '2026-09-04T09:00:00Z', '2026-09-04T10:00:00Z').ok, true);
  });

  test('H3 — un identifiant annulé reste consommé', () => {
    const engine = new ReservationEngine();
    assert.equal(engine.reserve('reuse', '2026-09-04T10:00:00Z', '2026-09-04T11:00:00Z').ok, true);
    assert.equal(engine.cancel('reuse').ok, true);
    assert.deepEqual(engine.reserve('reuse', '2026-09-04T12:00:00Z', '2026-09-04T13:00:00Z'), { ok: false, reason: 'DUPLICATE_ID' });
  });

  test('H4 — annuler deux fois retourne ALREADY_CANCELLED', () => {
    const engine = new ReservationEngine();
    engine.reserve('a', '2026-09-04T10:00:00Z', '2026-09-04T11:00:00Z');
    assert.equal(engine.cancel('a').ok, true);
    assert.deepEqual(engine.cancel('a'), { ok: false, reason: 'ALREADY_CANCELLED' });
  });

  test('H5 — annuler un identifiant inconnu retourne NOT_FOUND', () => {
    const engine = new ReservationEngine();
    assert.deepEqual(engine.cancel('missing'), { ok: false, reason: 'NOT_FOUND' });
  });

  test('H6 — identifiants invalides et priorité INVALID_ID', () => {
    const engine = new ReservationEngine();
    assert.deepEqual(engine.reserve('', 'bad', 'bad'), { ok: false, reason: 'INVALID_ID' });
    assert.deepEqual(engine.cancel('bad id'), { ok: false, reason: 'INVALID_ID' });
  });

  test('H7 — date calendaire impossible rejetée', () => {
    const engine = new ReservationEngine();
    assert.deepEqual(engine.reserve('a', '2026-02-30T10:00:00Z', '2026-02-30T11:00:00Z'), { ok: false, reason: 'INVALID_TIMESTAMP' });
  });

  test('H8 — leap day valide dans la plage autorisée', () => {
    const engine = new ReservationEngine();
    const result = engine.reserve('leap', '2028-02-29T23:00:00Z', '2028-03-01T00:00:00Z');
    assert.equal(result.ok, true);
  });

  test('H9 — l’ordre tie-break utilise end puis id', () => {
    const engine = new ReservationEngine();
    engine.reserve('c', '2026-09-04T10:00:00Z', '2026-09-04T10:30:00Z');
    engine.reserve('b', '2026-09-04T10:30:00Z', '2026-09-04T11:00:00Z');
    engine.cancel('c');
    engine.reserve('a', '2026-09-04T10:00:00Z', '2026-09-04T10:15:00Z');
    assert.deepEqual(engine.list().map((r) => r.id), ['a', 'c', 'b']);
  });

  test('H10 — les snapshots retournés ne mutent pas l’état interne', () => {
    const engine = new ReservationEngine();
    const created = engine.reserve('a', '2026-09-04T10:00:00Z', '2026-09-04T11:00:00Z');
    assert.equal(created.ok, true);
    if (!created.ok) return;
    created.reservation.status = 'cancelled';
    created.reservation.start = '2000-01-01T00:00:00.000Z';
    const listed = engine.list();
    listed.push({ id: 'fake', start: '2000-01-01T00:00:00.000Z', end: '2000-01-01T01:00:00.000Z', status: 'active' });
    listed[0].status = 'cancelled';
    const fresh = engine.list();
    assert.equal(fresh.length, 1);
    assert.deepEqual(fresh[0], { id: 'a', start: '2026-09-04T10:00:00.000Z', end: '2026-09-04T11:00:00.000Z', status: 'active' });
  });

  test('H11 — fractions 1 à 3 chiffres normalisées en millisecondes', () => {
    const engine = new ReservationEngine();
    const result = engine.reserve('frac', '2026-09-04T10:00:00.1Z', '2026-09-04T10:00:00.125Z');
    assert.deepEqual(result, { ok: true, reservation: { id: 'frac', start: '2026-09-04T10:00:00.100Z', end: '2026-09-04T10:00:00.125Z', status: 'active' } });
  });

  test('H12 — l’ordre de validation timestamp précède duplicate id', () => {
    const engine = new ReservationEngine();
    assert.equal(engine.reserve('same', '2026-09-04T10:00:00Z', '2026-09-04T11:00:00Z').ok, true);
    assert.deepEqual(engine.reserve('same', 'not-a-time', 'also-bad'), { ok: false, reason: 'INVALID_TIMESTAMP' });
  });

  test('H13 — les offsets peuvent inverser l’ordre apparent local', () => {
    const engine = new ReservationEngine();
    assert.deepEqual(
      engine.reserve('offset-order', '2026-09-04T10:00:00+01:00', '2026-09-04T10:30:00+02:00'),
      { ok: false, reason: 'INVALID_INTERVAL' }
    );
  });

  test('H14 — offset supérieur à 14:00 rejeté', () => {
    const engine = new ReservationEngine();
    assert.deepEqual(engine.reserve('a', '2026-09-04T10:00:00+14:01', '2026-09-04T11:00:00+14:01'), { ok: false, reason: 'INVALID_TIMESTAMP' });
  });
}
