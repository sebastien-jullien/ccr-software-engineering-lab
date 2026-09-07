import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
/**
 * TypeScript est resolu par la resolution de modules ordinaire depuis ce
 * fichier : control/node_modules, puis les parents. Dans un workspace de run,
 * le node_modules du candidat est donc trouve sans chemin code en dur.
 */
const ts = createRequire(import.meta.url)('typescript');

const FORBIDDEN_MEMBERS = new Set(['sort', 'toSorted']);

/** Detecteur borne de delegation directe a un tri hote, sur portee syntaxique declaree. */
export function scan(file) {
  const text = readFileSync(file, 'utf8');
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS);
  const findings = [];
  const notes = [];
  const at = (n) => sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1;

  const typeOnlyImport = (node) => {
    if (node.importClause?.isTypeOnly) return true;
    const nb = node.importClause?.namedBindings;
    if (nb && ts.isNamedImports(nb) && nb.elements.length > 0) {
      return nb.elements.every((el) => el.isTypeOnly);
    }
    return false;
  };

  const walk = (node) => {
    if (ts.isPropertyAccessExpression(node) && FORBIDDEN_MEMBERS.has(node.name.text)) {
      findings.push({ rule: 'HOST_SORT_MEMBER', form: '.' + node.name.text, line: at(node) });
    }
    if (ts.isElementAccessExpression(node) && node.argumentExpression
        && ts.isStringLiteralLike(node.argumentExpression)
        && FORBIDDEN_MEMBERS.has(node.argumentExpression.text)) {
      findings.push({ rule: 'HOST_SORT_MEMBER', form: '["' + node.argumentExpression.text + '"]', line: at(node) });
    }
    // Politique ratifiee : un import runtime non relatif n est PAS un T1 FAIL.
    // Le paquet participant gele est sans dependance runtime, donc aucune
    // bibliotheque de tri generaliste n est atteignable par la surface supportee.
    // Les imports sont releves a titre informatif seulement.
    if (ts.isImportDeclaration(node) && ts.isStringLiteralLike(node.moduleSpecifier)) {
      const spec = node.moduleSpecifier.text;
      if (!spec.startsWith('.') && !typeOnlyImport(node)) {
        notes.push({ rule: 'NON_RELATIVE_RUNTIME_IMPORT', form: spec, line: at(node) });
      }
    }
    ts.forEachChild(node, walk);
  };
  walk(sf);
  return { file, verdict: findings.length === 0 ? 'PASS' : 'FAIL', findings, notes };
}

if (import.meta.filename === process.argv[1]) {
  for (const f of process.argv.slice(2)) {
    const r = scan(f);
    const name = f.split(/[\/]/).pop();
    console.log(name.padEnd(28) + 'T1 = ' + r.verdict +
      (r.findings.length ? '  ' + r.findings.map((x) => x.rule + ' ' + x.form + ' L' + x.line).join(' ; ') : '') +
      (r.notes.length ? '  [note ' + r.notes.map((x) => x.form).join(',') + ']' : ''));
  }
}
