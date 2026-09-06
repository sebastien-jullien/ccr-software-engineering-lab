/**
 * CASE-003 — Moteur de référence indépendant.
 *
 * Écrit directement depuis SPEC.md, jamais dérivé d'une implémentation
 * participante. Aucune structure, aucun découpage, aucun nommage n'est repris
 * d'un candidat.
 *
 * Choix structurels délibérément distincts de la voie naturelle d'un candidat :
 *   - les déclarations de dépendance vivent dans une table séparée, indexée par
 *     identifiant, jamais dans l'enregistrement de tâche lui-même ;
 *   - l'inconnu est établi par balayage de toutes les déclarations contre
 *     l'ensemble des identifiants présents ;
 *   - le cycle est établi par parcours en profondeur tricolore AVANT tout
 *     ordonnancement, et non par constat d'un ensemble éligible vide ;
 *   - l'ordre est produit par sélection linéaire répétée du minimum, sans tri.
 *
 * MATÉRIEL DE CONTROL — AVEUGLE JUSQU'À CLÔTURE INTELLECTUELLE.
 */

const ID_SHAPE = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
const PRIORITY_ORDER = ['high', 'normal', 'low'];

function validIdentifier(value) {
  return typeof value === 'string' && ID_SHAPE.test(value);
}

function validPriority(value) {
  return PRIORITY_ORDER.includes(value);
}

/** Rang de priorité, puis rang d'insertion. Règle d'ordre unique de la v1. */
function precedes(left, right) {
  const leftRank = PRIORITY_ORDER.indexOf(left.priority);
  const rightRank = PRIORITY_ORDER.indexOf(right.priority);
  if (leftRank !== rightRank) return leftRank < rightRank;
  return left.rank < right.rank;
}

export class TaskPlanner {
  constructor() {
    this._entries = [];
    this._claimed = new Set();
  }

  add(task) {
    if (!validIdentifier(task.id)) return { ok: false, reason: 'INVALID_ID' };
    if (!validPriority(task.priority)) return { ok: false, reason: 'INVALID_PRIORITY' };
    if (this._claimed.has(task.id)) return { ok: false, reason: 'DUPLICATE_ID' };
    this._claimed.add(task.id);
    this._entries.push({ id: task.id, priority: task.priority, rank: this._entries.length });
    return { ok: true };
  }

  plan() {
    const pool = this._entries.slice();
    const order = [];
    while (pool.length > 0) {
      let bestIndex = 0;
      for (let i = 1; i < pool.length; i += 1) {
        if (precedes(pool[i], pool[bestIndex])) bestIndex = i;
      }
      order.push(pool[bestIndex].id);
      pool.splice(bestIndex, 1);
    }
    return { ok: true, order };
  }
}

export class DependencyTaskPlanner extends TaskPlanner {
  constructor() {
    super();
    this._declarations = new Map();
  }

  add(task) {
    const verdict = super.add(task);
    // N9 : la déclaration n'est capturée qu'en cas de succès, et par instantané.
    if (verdict.ok) {
      const declared = Array.isArray(task.after) ? task.after : [];
      const snapshot = [];
      for (const candidate of declared) {
        // N7 : les doublons sont absorbés, sans erreur.
        if (!snapshot.includes(candidate)) snapshot.push(candidate);
      }
      this._declarations.set(task.id, Object.freeze(snapshot));
    }
    return verdict;
  }

  _dependenciesOf(id) {
    return this._declarations.get(id) ?? [];
  }

  planWithDependencies() {
    const present = new Set(this._entries.map((entry) => entry.id));

    // N3 et N5 : l'inconnu est décidé en premier, sur l'ensemble des déclarations.
    for (const entry of this._entries) {
      for (const dependency of this._dependenciesOf(entry.id)) {
        if (!present.has(dependency)) return { ok: false, reason: 'UNKNOWN_DEPENDENCY' };
      }
    }

    // N4 : cycle, y compris l'auto-dépendance, par parcours en profondeur.
    const colour = new Map(this._entries.map((entry) => [entry.id, 'white']));
    const cyclic = (id) => {
      colour.set(id, 'grey');
      for (const dependency of this._dependenciesOf(id)) {
        const state = colour.get(dependency);
        if (state === 'grey') return true;
        if (state === 'white' && cyclic(dependency)) return true;
      }
      colour.set(id, 'black');
      return false;
    };
    for (const entry of this._entries) {
      if (colour.get(entry.id) === 'white' && cyclic(entry.id)) {
        return { ok: false, reason: 'CYCLIC_DEPENDENCY' };
      }
    }

    // N2 : à chaque pas, le premier au sens legacy parmi les tâches libérées.
    const pending = this._entries.slice();
    const settled = new Set();
    const order = [];
    while (pending.length > 0) {
      let bestIndex = -1;
      for (let i = 0; i < pending.length; i += 1) {
        const released = this._dependenciesOf(pending[i].id).every((d) => settled.has(d));
        if (!released) continue;
        if (bestIndex === -1 || precedes(pending[i], pending[bestIndex])) bestIndex = i;
      }
      order.push(pending[bestIndex].id);
      settled.add(pending[bestIndex].id);
      pending.splice(bestIndex, 1);
    }
    return { ok: true, order };
  }
}
