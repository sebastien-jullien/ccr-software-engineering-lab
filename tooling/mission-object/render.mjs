/**
 * TOOLING-EXPERIMENT-002 — rendu déterministe d'une enveloppe de mission.
 *
 * L'objet est l'autorité ; l'enveloppe en est le rendu. Ce module n'invente
 * aucune règle normative et n'en omet aucune.
 *
 * Déterminisme : aucune horloge, aucun aléa, aucun réseau, aucun modèle de
 * langage, aucune lecture de Git ni de PROGRAM-STATE. Les mêmes octets
 * d'entrée donnent les mêmes octets de sortie. L'ordre de parcours est
 * l'ordre de déclaration, jamais l'ordre d'une table de hachage.
 *
 * Un identifiant d'action est rendu verbatim : rien ici ne l'interprète.
 *
 * La trace de rendu est produite par la traversée de rendu elle-même. Ce
 * n'est pas une seconde mission normative tenue à la main.
 */

import { normativeElements } from './mission-object.mjs';

class Envelope {
  constructor() {
    this.lines = [];
    this.trace = [];
  }
  line(text) {
    this.lines.push(text);
  }
  blank() {
    if (this.lines.length > 0 && this.lines[this.lines.length - 1] !== '') this.lines.push('');
  }
  title(text) {
    this.blank();
    this.line(text);
    this.line('='.repeat(text.length));
    this.blank();
  }
  section(text) {
    this.blank();
    this.line(text);
    this.line('-'.repeat(text.length));
  }
  /** Ouvre une portée tracée : tout ce qui est émis dedans appartient au chemin. */
  emit(path, kind, body) {
    const from = this.lines.length;
    body();
    this.trace.push({ path, kind, from, to: this.lines.length });
  }
  get text() {
    return this.lines.join('\n') + '\n';
  }
}

function renderValue(node) {
  if (node === null || typeof node !== 'object') return String(node);
  switch (node.type) {
    case 'SCALAR':
      return typeof node.value === 'string' ? node.value : JSON.stringify(node.value);
    case 'SYMBOL':
      return node.value;
    case 'REFERENCE':
      return '→ ' + node.value;
    case 'SET':
      return '{ ' + (node.members || []).map(renderValue).join(' · ') + ' }';
    case 'SEQUENCE':
      return '[ ' + (node.members || []).map(renderValue).join(' → ') + ' ]';
    case 'CLAIM_TRIPLE':
      return node.subject + ' · ' + node.field + ' = ' + node.value;
    default:
      return JSON.stringify(node);
  }
}

function renderSubject(subject) {
  const parts = [];
  if (subject.modifier) parts.push(subject.modifier + '(');
  parts.push(subject.kind);
  if (subject.ref !== undefined) parts.push('(' + subject.ref + ')');
  if (subject.field !== undefined) parts.push('.' + subject.field);
  if (subject.modifier) parts.push(')');
  return parts.join('');
}

function renderPredicate(node) {
  if (node === null || typeof node !== 'object') return String(node);
  if (Array.isArray(node.all_of)) {
    return node.all_of.map(renderPredicate).join('  ET  ');
  }
  if (node.branch !== undefined) return 'branche ' + node.branch;
  return renderSubject(node.subject) + ' ' + node.op + ' ' + renderValue(node.value);
}

function renderTarget(target) {
  if (target === undefined) return '';
  if (target !== null && typeof target === 'object') return ' → ' + target.ref;
  return ' → ' + target;
}

function renderEffectLine(entry) {
  const parts = [entry.mode.padEnd(21), entry.action];
  let text = parts.join(' ') + renderTarget(entry.target);
  if (entry.cardinality !== undefined) text += '  cardinalité ' + entry.cardinality;
  if (entry.gated_by !== undefined) text += '  après porte ' + entry.gated_by;
  return text;
}

function renderConstraints(envelope, entry, indent) {
  if (entry.constraints === undefined) return;
  for (const key of ['author', 'committer', 'parent', 'subject']) {
    if (entry.constraints[key] !== undefined) {
      envelope.line(indent + key + ' = ' + entry.constraints[key]);
    }
  }
  if (entry.constraints.staged_paths !== undefined) {
    envelope.line(indent + 'staged_paths = { ' + entry.constraints.staged_paths.join(' · ') + ' }');
  }
  if (entry.constraints.ff_only !== undefined) {
    envelope.line(indent + 'ff_only = ' + String(entry.constraints.ff_only));
  }
}

function renderRequirementLine(entry) {
  let text = entry.kind;
  if (entry.polarity !== undefined) text += ' / ' + entry.polarity;
  text += '  ' + entry.subject;
  if (entry.relation !== undefined) text += '  ' + entry.relation + '  ' + renderValue(entry.value);
  text += '   [cible ' + entry.target + ' · portée ' + entry.scope + ']';
  if (entry.depends_on !== undefined) text += '   [exige ' + entry.depends_on.join(' · ') + ']';
  return text;
}

/**
 * Rend une enveloppe humaine exécutable et sa trace.
 * @returns {{ text: string, trace: Array<{path:string,kind:string,from:number,to:number}> }}
 */
export function render(object) {
  const envelope = new Envelope();

  /* --- identité ------------------------------------------------- */
  envelope.emit('identity', 'identity', () => {
    const identity = object.identity;
    envelope.title('MISSION ' + identity.id);
    envelope.line('DESTINATAIRE    = ' + identity.addressee);
    envelope.line('PROJET CIBLE    = ' + identity.target_project);
    envelope.line('CLASSE          = ' + identity.class);
    if (identity.facets !== undefined) {
      for (const facet of identity.facets) envelope.line('FACETTE         = ' + facet);
    }
  });

  /* --- contexte, non normatif ----------------------------------- */
  if ((object.context || []).length > 0) {
    envelope.section('CONTEXTE — NON NORMATIF');
    for (const entry of object.context) {
      const suffix = entry.semantics_unresolved ? '   [sémantique non résolue]' : '';
      envelope.line('  ' + entry.subject + ' = ' + renderValue(entry.value) + suffix);
    }
  }

  /* --- références ----------------------------------------------- */
  if ((object.references || []).length > 0) {
    envelope.section('AUTORITÉS ET RÉFÉRENCES');
    for (const [index, entry] of object.references.entries()) {
      envelope.emit('references[' + index + ']', 'reference', () => {
        let text = '  ' + entry.id + '  [' + entry.role + ']  ' + entry.locator.kind + ' ' + entry.locator.value;
        if (entry.identity !== undefined) text += '  ' + entry.identity.kind + ' ' + entry.identity.value;
        text += entry.identity_required ? '  identité EXIGÉE' : '  identité non exigée';
        envelope.line(text);
      });
    }
  }

  /* --- effets ---------------------------------------------------- */
  if ((object.effects || []).length > 0) {
    envelope.section('FRONTIÈRES D’EFFET');
    for (const [index, entry] of object.effects.entries()) {
      envelope.emit('effects[' + index + ']', 'effect', () => {
        envelope.line('  ' + renderEffectLine(entry));
        renderConstraints(envelope, entry, '      ');
      });
    }
  }

  /* --- exigences de contenu -------------------------------------- */
  if ((object.content_requirements || []).length > 0) {
    envelope.section('EXIGENCES DE CONTENU');
    for (const [index, entry] of object.content_requirements.entries()) {
      envelope.emit('content_requirements[' + index + ']', 'content_requirement', () => {
        envelope.line('  ' + renderRequirementLine(entry));
      });
    }
  }

  /* --- procédure -------------------------------------------------- */
  if (object.procedure !== undefined) {
    envelope.emit('procedure', 'procedure', () => {
      envelope.section('PROCÉDURE');
      envelope.line(
        object.procedure.strict_order
          ? '  ORDRE STRICT — aucune étape ne se fond dans une autre'
          : '  ordre non strict',
      );
    });
    for (const [index, entry] of object.procedure.steps.entries()) {
      envelope.emit('procedure.steps[' + index + ']', 'step', () => {
        let text = '  ' + String(entry.order) + '. ' + entry.id + '  effet ' + entry.effect;
        text += entry.atomic ? '  [atomique]' : '';
        if (entry.gated_by !== undefined) text += '  [après porte ' + entry.gated_by + ']';
        if (entry.produces !== undefined) text += '  [produit ' + entry.produces.join(' · ') + ']';
        envelope.line(text);
      });
    }
  }

  /* --- portes ------------------------------------------------------ */
  if ((object.gates || []).length > 0) {
    envelope.section('PORTES');
    for (const [index, entry] of object.gates.entries()) {
      envelope.emit('gates[' + index + ']', 'gate', () => {
        const scope = Array.isArray(entry.scope) ? entry.scope.join(' · ') : entry.scope;
        envelope.line('  ' + entry.id + '  [portée ' + scope + ']');
        envelope.line('      exige   ' + renderPredicate(entry.predicate));
        if (entry.tolerated !== undefined) envelope.line('      toléré  ' + entry.tolerated.join(' · '));
        envelope.line('      échec → ' + entry.on_fail);
      });
    }
  }

  /* --- règles d'arrêt ----------------------------------------------- */
  if ((object.stop_rules || []).length > 0) {
    envelope.section('CONDITIONS D’ARRÊT');
    for (const [index, entry] of object.stop_rules.entries()) {
      envelope.emit('stop_rules[' + index + ']', 'stop_rule', () => {
        envelope.line('  ' + entry.id + '  si  ' + renderPredicate(entry.trigger));
        for (const prohibition of entry.prohibitions) {
          envelope.line('      ' + renderEffectLine(prohibition));
        }
        envelope.line('      exigé   ' + entry.required.join(' · '));
        envelope.line('      ' + entry.terminal);
      });
    }
  }

  /* --- branches ------------------------------------------------------ */
  if ((object.branches || []).length > 0) {
    envelope.section('BRANCHES');
    for (const [index, entry] of object.branches.entries()) {
      const base = 'branches[' + index + ']';
      envelope.emit(base, 'branch', () => {
        envelope.blank();
        envelope.line('  BRANCHE ' + entry.id + '  si  ' + renderPredicate(entry.condition));
        envelope.line('      résultat terminal   ' + entry.terminal_outcome);
        envelope.line('      conséquence         ' + entry.next);
      });
      for (const [inner, item] of (entry.steps || []).entries()) {
        envelope.emit(base + '.steps[' + inner + ']', 'step', () => {
          envelope.line('      étape ' + String(item.order) + '. ' + item.id + '  effet ' + item.effect);
        });
      }
      for (const [inner, item] of (entry.effects || []).entries()) {
        envelope.emit(base + '.effects[' + inner + ']', 'effect', () => {
          envelope.line('      ' + renderEffectLine(item));
          renderConstraints(envelope, item, '          ');
        });
      }
      for (const [inner, item] of (entry.requirements || []).entries()) {
        envelope.emit(base + '.requirements[' + inner + ']', 'content_requirement', () => {
          envelope.line('      ' + renderRequirementLine(item));
        });
      }
    }
  }

  /* --- autorité humaine ------------------------------------------------ */
  if (object.human_authority !== undefined) {
    const authority = object.human_authority;
    envelope.section('AUTORITÉ HUMAINE');
    for (const [index, entry] of (authority.ratified_decisions || []).entries()) {
      envelope.emit('human_authority.ratified_decisions[' + index + ']', 'ratified_decision', () => {
        envelope.line('  RATIFIÉ       ' + entry.subject + '   [autorité ' + entry.authority + ']');
      });
    }
    for (const [index, entry] of (authority.open_human_gates || []).entries()) {
      envelope.emit('human_authority.open_human_gates[' + index + ']', 'open_human_gate', () => {
        envelope.line('  PORTE HUMAINE ' + entry.subject);
      });
    }
    if (Array.isArray(authority.deterministic_consequences) && authority.deterministic_consequences.length > 0) {
      envelope.emit('human_authority.deterministic_consequences', 'deterministic_consequences', () => {
        envelope.line('  DÉTERMINÉ     ' + authority.deterministic_consequences.join(' · '));
      });
    }
  }

  /* --- exigences de preuve ---------------------------------------------- */
  if ((object.evidence_requirements || []).length > 0) {
    envelope.section('EXIGENCES DE PREUVE');
    for (const [index, entry] of object.evidence_requirements.entries()) {
      envelope.emit('evidence_requirements[' + index + ']', 'evidence_requirement', () => {
        let text = '  ' + entry.id + '  [' + entry.kind + ']  ' + entry.fact;
        if (entry.method !== undefined) {
          text +=
            '   méthode ' +
            entry.method.op +
            ' depuis ' +
            entry.method.source +
            (entry.method.recompute ? ' · recalcul exigé' : '');
        }
        envelope.line(text);
        if (entry.forbidden_sources !== undefined) {
          envelope.line('      source interdite  ' + entry.forbidden_sources.join(' · '));
        }
        if (entry.must_return !== undefined) {
          envelope.line('      à retourner en    ' + entry.must_return);
        }
      });
    }
  }

  /* --- résultats terminaux ------------------------------------------------ */
  if ((object.terminal_outcomes || []).length > 0) {
    envelope.section('RÉSULTATS TERMINAUX ET SUCCÈS PARTIEL');
    for (const [index, entry] of object.terminal_outcomes.entries()) {
      const base = 'terminal_outcomes[' + index + ']';
      envelope.emit(base, 'terminal_outcome', () => {
        envelope.blank();
        envelope.line('  ' + entry.label + '  valide si  ' + renderPredicate(entry.valid_when));
        envelope.line(
          '      état partiel admis            ' + (entry.partial_state_allowed ? 'OUI' : 'NON'),
        );
        envelope.line(
          '      état atteint à préserver      ' + (entry.reached_state_must_be_preserved ? 'OUI' : 'NON'),
        );
        envelope.line('      conséquence                   ' + entry.next);
      });
      for (const [inner, item] of (entry.post_state || []).entries()) {
        envelope.emit(base + '.post_state[' + inner + ']', 'content_requirement', () => {
          envelope.line('      état résultant  ' + renderRequirementLine(item));
        });
      }
    }
  }

  /* --- contrat de retour ---------------------------------------------------- */
  envelope.section('RETOUR OBLIGATOIRE');
  for (const [index, entry] of (object.return_contract || []).entries()) {
    envelope.emit('return_contract[' + index + ']', 'return_field', () => {
      let text = '  ' + entry.fact + '  [' + entry.acquisition + ' · ' + entry.value_type + ']';
      if (entry.predetermined_value !== undefined) text += ' = ' + renderValue(entry.predetermined_value);
      if (entry.allowed_values !== undefined) text += '  parmi ' + renderValue(entry.allowed_values);
      envelope.line(text);
    });
  }

  /* --- conséquences suivantes --------------------------------------------- */
  if ((object.next_consequences || []).length > 0) {
    envelope.section('CONSÉQUENCES SUIVANTES');
    for (const [index, entry] of object.next_consequences.entries()) {
      envelope.emit('next_consequences[' + index + ']', 'next_consequence', () => {
        let text = '  ' + entry.id + '  [' + entry.kind + ']  ' + entry.action + renderTarget(entry.target);
        if (entry.no_new_gate === true) text += '   [aucune nouvelle porte humaine]';
        envelope.line(text);
      });
    }
  }

  /* --- contraintes permanentes --------------------------------------------- */
  if ((object.standing_constraints || []).length > 0) {
    envelope.section('CONTRAINTES PERMANENTES — DÉCLARATION SEULE');
    for (const [index, entry] of object.standing_constraints.entries()) {
      envelope.emit('standing_constraints[' + index + ']', 'standing_constraint', () => {
        envelope.line('  ' + entry.id + '  ' + renderEffectLine(entry.constraint));
        envelope.line('      levée si  ' + renderPredicate(entry.release_condition));
      });
    }
  }

  /* --- terminal ------------------------------------------------------------- */
  envelope.emit('terminal', 'terminal', () => {
    envelope.blank();
    envelope.line('Puis STOP.');
  });

  return { text: envelope.text, trace: envelope.trace };
}

/**
 * Couverture de rendu : compare l'énumération normative issue du schéma et la
 * trace issue de la traversée de rendu. Deux parcours, un seul schéma.
 */
export function renderCoverage(object) {
  const expected = normativeElements(object);
  const { trace } = render(object);
  const expectedPaths = new Set(expected.map((entry) => entry.path));
  const tracedPaths = new Set(trace.map((entry) => entry.path));
  const omitted = [...expectedPaths].filter((path) => !tracedPaths.has(path));
  const invented = [...tracedPaths].filter((path) => !expectedPaths.has(path));
  const empty = trace.filter((entry) => entry.to <= entry.from).map((entry) => entry.path);
  return {
    expected: expectedPaths.size,
    rendered: tracedPaths.size,
    omitted,
    invented,
    empty,
    complete: omitted.length === 0 && invented.length === 0 && empty.length === 0,
  };
}
