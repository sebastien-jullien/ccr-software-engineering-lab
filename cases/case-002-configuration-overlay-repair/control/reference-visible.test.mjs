import test from 'node:test';
import assert from 'node:assert/strict';
import { referenceApplyOverlay as applyOverlay } from './reference-engine.mjs';

// Rejoue les cas visibles du participant contre l'oracle. Sert uniquement à qualifier
// l'oracle : il doit satisfaire le contrat public que le participant reçoit.

test('V1 — une valeur simple de l’overlay remplace celle de la base', () => {
  const result = applyOverlay({ host: 'localhost', port: 8080 }, { port: 9090 });
  assert.deepEqual(result, { host: 'localhost', port: 9090 });
});

test('V2 — deux objets ordinaires se fusionnent en profondeur', () => {
  const result = applyOverlay(
    { server: { host: 'localhost', port: 8080 }, debug: true },
    { server: { port: 9090 } }
  );
  assert.deepEqual(result, { server: { host: 'localhost', port: 9090 }, debug: true });
});

test('V3 — reproduction rapportée : une bascule mise à false est appliquée', () => {
  const result = applyOverlay({ enabled: true }, { enabled: false });
  assert.deepEqual(result, { enabled: false });
});

test('V4 — null supprime la clé du résultat', () => {
  const result = applyOverlay({ host: 'localhost', port: 8080 }, { port: null });
  assert.deepEqual(result, { host: 'localhost' });
  assert.equal(Object.prototype.hasOwnProperty.call(result, 'port'), false);
});

test('V5 — un tableau est remplacé comme valeur complète', () => {
  const result = applyOverlay({ tags: ['a', 'b', 'c'] }, { tags: ['x'] });
  assert.deepEqual(result, { tags: ['x'] });
});

test('V6 — les entrées ne sont pas modifiées', () => {
  const base = { server: { host: 'localhost' }, tags: ['a'] };
  const overlay = { server: { port: 9090 }, tags: ['x'] };

  applyOverlay(base, overlay);

  assert.deepEqual(base, { server: { host: 'localhost' }, tags: ['a'] });
  assert.deepEqual(overlay, { server: { port: 9090 }, tags: ['x'] });
});
