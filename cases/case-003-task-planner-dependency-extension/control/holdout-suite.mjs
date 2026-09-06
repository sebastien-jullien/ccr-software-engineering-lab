/**
 * CASE-003 — Holdouts H1..H17.
 *
 * MATÉRIEL DE CONTROL — AVEUGLE JUSQU'À CLÔTURE INTELLECTUELLE.
 * Aucun de ces contrôles n'est visible du participant.
 *
 * AXE A — correction de la capacité nouvelle : H1..H13
 * AXE B — préservation du contrat public antérieur : H14..H17
 *
 * L'implémentation sous test est fournie par deux chargeurs paresseux distincts,
 * un par module. Un module absent fait échouer les holdouts qui en dépendent, un
 * par un, sans empêcher le chargement de la suite ni les holdouts qui ne le
 * requièrent pas.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

/** alpha(low,0) beta(high,1,après alpha) gamma(normal,2) delta(high,3) */
function declaredFixture(planner) {
  planner.add({ id: 'alpha', priority: 'low' });
  planner.add({ id: 'beta', priority: 'high', after: ['alpha'] });
  planner.add({ id: 'gamma', priority: 'normal' });
  planner.add({ id: 'delta', priority: 'high' });
  return planner;
}

const DECLARED_DEPENDENCY_ORDER = ['delta', 'gamma', 'alpha', 'beta'];
const DECLARED_LEGACY_ORDER = ['beta', 'delta', 'gamma', 'alpha'];

export function defineHoldouts({ label, loadLegacy, loadDependency }) {
  const named = (id, title) => `${id} [${label}] — ${title}`;
  const dependency = async () => (await loadDependency()).DependencyTaskPlanner;
  const legacy = async () => (await loadLegacy()).TaskPlanner;

  // ---------------------------------------------------------------- AXE A

  test(named('H1', "ordre parmi les éligibles là où Kahn-FIFO diverge"), async () => {
    const Ctor = await dependency();
    const planner = declaredFixture(new Ctor());
    assert.deepEqual(planner.planWithDependencies(), {
      ok: true,
      order: DECLARED_DEPENDENCY_ORDER,
    });
  });

  test(named('H2', "un prédécesseur low est tiré en avant, un high libre passe d'abord"), async () => {
    const Ctor = await dependency();
    const planner = new Ctor();
    planner.add({ id: 'zeta', priority: 'high' });
    planner.add({ id: 'kappa', priority: 'low' });
    planner.add({ id: 'lambda', priority: 'high', after: ['kappa'] });
    assert.deepEqual(planner.planWithDependencies(), {
      ok: true,
      order: ['zeta', 'kappa', 'lambda'],
    });
  });

  test(named('H3', "chaîne de quatre à priorités mélangées, ajoutée à rebours"), async () => {
    const Ctor = await dependency();
    const planner = new Ctor();
    planner.add({ id: 'four', priority: 'high', after: ['three'] });
    planner.add({ id: 'three', priority: 'normal', after: ['two'] });
    planner.add({ id: 'two', priority: 'high', after: ['one'] });
    planner.add({ id: 'one', priority: 'low' });
    assert.deepEqual(planner.planWithDependencies(), {
      ok: true,
      order: ['one', 'two', 'three', 'four'],
    });
  });

  test(named('H4', 'losange : deux branches convergentes'), async () => {
    const Ctor = await dependency();
    const planner = new Ctor();
    planner.add({ id: 'root', priority: 'normal' });
    planner.add({ id: 'left', priority: 'low', after: ['root'] });
    planner.add({ id: 'right', priority: 'high', after: ['root'] });
    planner.add({ id: 'join', priority: 'normal', after: ['left', 'right'] });
    assert.deepEqual(planner.planWithDependencies(), {
      ok: true,
      order: ['root', 'right', 'left', 'join'],
    });
  });

  test(named('H5', 'N7 — les doublons de after sont absorbés sans erreur'), async () => {
    const Ctor = await dependency();
    const planner = new Ctor();
    assert.deepEqual(planner.add({ id: 'a', priority: 'low' }), { ok: true });
    assert.deepEqual(planner.add({ id: 'b', priority: 'high', after: ['a', 'a', 'a'] }), {
      ok: true,
    });
    assert.deepEqual(planner.planWithDependencies(), { ok: true, order: ['a', 'b'] });
  });

  test(named('H6', "N9 — la déclaration est un instantané pris à l'ajout"), async () => {
    const Ctor = await dependency();
    const planner = new Ctor();
    const declared = ['a'];
    const task = { id: 'b', priority: 'high', after: declared };
    planner.add({ id: 'a', priority: 'low' });
    assert.deepEqual(planner.add(task), { ok: true });
    declared.push('ghost');
    task.after = ['ghost'];
    assert.deepEqual(planner.planWithDependencies(), { ok: true, order: ['a', 'b'] });
  });

  test(named('H7', 'N4 — auto-dépendance'), async () => {
    const Ctor = await dependency();
    const planner = new Ctor();
    assert.deepEqual(planner.add({ id: 'solo', priority: 'high', after: ['solo'] }), { ok: true });
    assert.deepEqual(planner.planWithDependencies(), {
      ok: false,
      reason: 'CYCLIC_DEPENDENCY',
    });
  });

  test(named('H8', 'N4 — cycle de longueur trois'), async () => {
    const Ctor = await dependency();
    const planner = new Ctor();
    planner.add({ id: 'p', priority: 'high', after: ['r'] });
    planner.add({ id: 'q', priority: 'normal', after: ['p'] });
    planner.add({ id: 'r', priority: 'low', after: ['q'] });
    assert.deepEqual(planner.planWithDependencies(), {
      ok: false,
      reason: 'CYCLIC_DEPENDENCY',
    });
  });

  test(named('H9', "N5 — l'inconnu l'emporte sur le cycle"), async () => {
    const Ctor = await dependency();
    const planner = new Ctor();
    planner.add({ id: 'm', priority: 'high', after: ['ghost'] });
    planner.add({ id: 'n', priority: 'normal', after: ['o'] });
    planner.add({ id: 'o', priority: 'low', after: ['n'] });
    assert.deepEqual(planner.planWithDependencies(), {
      ok: false,
      reason: 'UNKNOWN_DEPENDENCY',
    });
  });

  test(named('H10', 'N8 — référence vers une tâche ajoutée plus tard'), async () => {
    const Ctor = await dependency();
    const planner = new Ctor();
    assert.deepEqual(planner.add({ id: 'b', priority: 'high', after: ['a'] }), { ok: true });
    assert.deepEqual(planner.add({ id: 'a', priority: 'low' }), { ok: true });
    assert.deepEqual(planner.planWithDependencies(), { ok: true, order: ['a', 'b'] });
  });

  test(named('H11', 'N3 — une dépendance qui ne pourrait pas être un TaskId est inconnue'), async () => {
    const Ctor = await dependency();
    const planner = new Ctor();
    assert.deepEqual(planner.add({ id: 'u', priority: 'low' }), { ok: true });
    assert.deepEqual(planner.add({ id: 't', priority: 'high', after: ['not a valid id'] }), {
      ok: true,
    });
    assert.deepEqual(planner.planWithDependencies(), {
      ok: false,
      reason: 'UNKNOWN_DEPENDENCY',
    });
  });

  test(named('H12', 'pureté : planWithDependencies() ne mute pas le planificateur'), async () => {
    const Ctor = await dependency();
    const planner = declaredFixture(new Ctor());
    const first = planner.planWithDependencies();
    const second = planner.planWithDependencies();
    assert.deepEqual(first, { ok: true, order: DECLARED_DEPENDENCY_ORDER });
    assert.deepEqual(second, { ok: true, order: DECLARED_DEPENDENCY_ORDER });
    assert.deepEqual(planner.plan(), { ok: true, order: DECLARED_LEGACY_ORDER });
  });

  test(named('H13', 'instantané : muter le tableau rendu ne change rien'), async () => {
    const Ctor = await dependency();
    const planner = declaredFixture(new Ctor());
    const first = planner.planWithDependencies();
    assert.equal(first.ok, true);
    try {
      first.order.push('injected');
    } catch {
      /* un résultat gelé est une implémentation acceptable */
    }
    const second = planner.planWithDependencies();
    assert.deepEqual([...second.order], DECLARED_DEPENDENCY_ORDER);
  });

  // ---------------------------------------------------------------- AXE B

  test(named('H14', 'legacy : douze tâches sans dépendance sur TaskPlanner'), async () => {
    const Ctor = await legacy();
    const planner = new Ctor();
    const priorities = [
      'low', 'high', 'normal', 'low', 'high', 'normal',
      'low', 'high', 'normal', 'low', 'high', 'normal',
    ];
    priorities.forEach((priority, index) => {
      const id = `t${String(index + 1).padStart(2, '0')}`;
      assert.deepEqual(planner.add({ id, priority }), { ok: true });
    });
    assert.deepEqual(planner.plan(), {
      ok: true,
      order: [
        't02', 't05', 't08', 't11',
        't03', 't06', 't09', 't12',
        't01', 't04', 't07', 't10',
      ],
    });
  });

  test(named('H15', 'legacy : plan() hérité ignore les dépendances déclarées'), async () => {
    const Ctor = await dependency();
    const planner = declaredFixture(new Ctor());
    assert.deepEqual(planner.plan(), { ok: true, order: DECLARED_LEGACY_ORDER });
  });

  test(named('H16', "legacy : précédence des refus sur la sous-classe, et un refus n'enregistre rien"), async () => {
    const Ctor = await dependency();
    const planner = new Ctor();
    assert.deepEqual(planner.add({ id: 'a', priority: 'high' }), { ok: true });
    assert.deepEqual(planner.add({ id: '', priority: 'nope', after: ['ghost'] }), {
      ok: false,
      reason: 'INVALID_ID',
    });
    assert.deepEqual(planner.add({ id: 'ok2', priority: 'nope', after: ['ghost'] }), {
      ok: false,
      reason: 'INVALID_PRIORITY',
    });
    assert.deepEqual(planner.add({ id: 'a', priority: 'low', after: ['ghost'] }), {
      ok: false,
      reason: 'DUPLICATE_ID',
    });
    assert.deepEqual(planner.plan(), { ok: true, order: ['a'] });
    assert.deepEqual(planner.planWithDependencies(), { ok: true, order: ['a'] });
  });

  test(named('H17', 'legacy : pureté et instantané de plan() sur la sous-classe'), async () => {
    const Ctor = await dependency();
    const planner = declaredFixture(new Ctor());
    const first = planner.plan();
    try {
      first.order.push('injected');
    } catch {
      /* un résultat gelé est une implémentation acceptable */
    }
    assert.deepEqual([...planner.plan().order], DECLARED_LEGACY_ORDER);
    assert.deepEqual([...planner.plan().order], DECLARED_LEGACY_ORDER);
  });
}
