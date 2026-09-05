import assert from 'node:assert/strict';

export function registerHoldoutSuite(test, applyOverlay) {
  // --- Généralisation du défaut ------------------------------------------------
  test('H1 — 0 remplace un nombre non nul', () => {
    assert.deepEqual(applyOverlay({ retries: 3 }, { retries: 0 }), { retries: 0 });
  });

  test('H2 — "" remplace une chaîne non vide', () => {
    assert.deepEqual(applyOverlay({ prefix: 'app' }, { prefix: '' }), { prefix: '' });
  });

  test('H3 — un remplacement par une valeur simple s’applique en profondeur', () => {
    const result = applyOverlay(
      { a: { b: { flag: true, count: 7, label: 'x' } } },
      { a: { b: { flag: false, count: 0, label: '' } } }
    );
    assert.deepEqual(result, { a: { b: { flag: false, count: 0, label: '' } } });
  });

  // --- Régression de la suppression par null -----------------------------------
  test('H4 — null supprime une clé de premier niveau', () => {
    const result = applyOverlay({ host: 'localhost', port: 8080 }, { host: null });
    assert.deepEqual(result, { port: 8080 });
    assert.equal(Object.prototype.hasOwnProperty.call(result, 'host'), false);
  });

  test('H5 — null supprime une clé imbriquée', () => {
    const result = applyOverlay(
      { server: { host: 'localhost', port: 8080 } },
      { server: { port: null } }
    );
    assert.deepEqual(result, { server: { host: 'localhost' } });
    assert.equal(Object.prototype.hasOwnProperty.call(result.server, 'port'), false);
  });

  test('H6 — null est une suppression, jamais une valeur stockée', () => {
    const result = applyOverlay({ keep: 1 }, { absent: null });
    assert.deepEqual(result, { keep: 1 });
    assert.equal(Object.prototype.hasOwnProperty.call(result, 'absent'), false);
  });

  // --- Comportements déjà corrects ---------------------------------------------
  test('H7 — un tableau remplace intégralement un tableau', () => {
    const result = applyOverlay(
      { tags: ['a', 'b', 'c'], nested: [{ k: 1 }, { k: 2 }] },
      { tags: ['x'], nested: [{ k: 9 }] }
    );
    assert.deepEqual(result, { tags: ['x'], nested: [{ k: 9 }] });
  });

  test('H8 — un objet de l’overlay fusionne récursivement l’objet de base', () => {
    const result = applyOverlay(
      { server: { host: 'localhost', tls: { enabled: true, port: 443 } } },
      { server: { tls: { port: 8443 } } }
    );
    assert.deepEqual(result, {
      server: { host: 'localhost', tls: { enabled: true, port: 8443 } }
    });
  });

  test('H9 — une valeur simple de l’overlay remplace un objet de base', () => {
    assert.deepEqual(applyOverlay({ auth: { mode: 'oidc' } }, { auth: 'disabled' }), {
      auth: 'disabled'
    });
  });

  test('H10 — un objet de l’overlay remplace une valeur simple de base', () => {
    assert.deepEqual(applyOverlay({ auth: 'disabled' }, { auth: { mode: 'oidc' } }), {
      auth: { mode: 'oidc' }
    });
  });

  test('H11 — une clé absente de l’overlay conserve la valeur de base', () => {
    const result = applyOverlay(
      { host: 'localhost', port: 8080, tags: ['a'] },
      { port: 9090 }
    );
    assert.deepEqual(result, { host: 'localhost', port: 9090, tags: ['a'] });
  });

  test('H14 — cas mixte déjà correct', () => {
    const base = {
      server: { host: 'localhost', port: 8080, tls: { enabled: true } },
      tags: ['a', 'b'],
      legacy: { mode: 'old' },
      retries: 3
    };
    const overlay = {
      server: { port: 9090, tls: { ca: 'root.pem' } },
      tags: ['x'],
      legacy: null,
      timeoutMs: 250
    };
    assert.deepEqual(applyOverlay(base, overlay), {
      server: { host: 'localhost', port: 9090, tls: { enabled: true, ca: 'root.pem' } },
      tags: ['x'],
      retries: 3,
      timeoutMs: 250
    });
  });

  // --- Immutabilité et aliasing -------------------------------------------------
  test('H12 — les structures d’entrée restent inchangées', () => {
    const base = { server: { host: 'localhost', tls: { enabled: true } }, tags: ['a', 'b'] };
    const overlay = { server: { tls: { ca: 'root.pem' } }, tags: ['x'], drop: null };
    const baseBefore = structuredClone(base);
    const overlayBefore = structuredClone(overlay);

    applyOverlay(base, overlay);

    assert.deepEqual(base, baseBefore);
    assert.deepEqual(overlay, overlayBefore);
  });

  test('H13 — les structures imbriquées retournées ne partagent rien avec les entrées', () => {
    const base = { server: { host: 'localhost' }, tags: ['a', 'b'] };
    const overlay = { server: { tls: { ca: 'root.pem' } }, extra: [1, 2] };

    const result = applyOverlay(base, overlay);

    assert.notEqual(result.server, base.server);
    assert.notEqual(result.tags, base.tags);
    assert.notEqual(result.server.tls, overlay.server.tls);
    assert.notEqual(result.extra, overlay.extra);

    result.server.host = 'mutated';
    result.tags.push('c');
    result.server.tls.ca = 'mutated.pem';
    result.extra.push(3);

    assert.deepEqual(base, { server: { host: 'localhost' }, tags: ['a', 'b'] });
    assert.deepEqual(overlay, { server: { tls: { ca: 'root.pem' } }, extra: [1, 2] });
  });
}
