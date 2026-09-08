/**
 * Exécution ISOLÉE d'une seule ligne de vérité.
 *
 * Ce processus n'ouvre aucun handle durable pour la seule observation : la seule
 * chose qui peut maintenir sa boucle en vie est le candidat lui-même. Sa fin
 * naturelle est donc un fait exploitable — et c'est le témoin que l'évaluateur
 * utilise lorsqu'un événement requis n'a jamais été observé.
 *
 * `beforeExit` n'est journalisé qu'à titre de DIAGNOSTIC. Il n'a aucune autorité
 * de verdict : un candidat peut y ordonnancer une progression, et réussir.
 */
import { writeSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { rowById } from './rows.mjs';

const args = new Map();
for (let i = 2; i < process.argv.length; i += 2) args.set(process.argv[i], process.argv[i + 1]);
const implPath = args.get('--impl');
const rowId = args.get('--row');

let concluded = false;
let pass = null;
let detail = null;
let harnessFault = null;
let beforeExitCount = 0;

process.on('beforeExit', () => { beforeExitCount += 1; });

process.on('exit', () => {
  const payload = {
    rowId,
    concluded,
    pass,
    detail,
    harnessFault,
    beforeExitCount,
  };
  writeSync(1, `##ROW##${JSON.stringify(payload)}\n`);
});

const main = async () => {
  let runPool;
  try {
    // Chemin absolu Windows → URL file://, sans quoi le chargeur ESM refuse
    // le « protocole e: ».
    const mod = await import(pathToFileURL(implPath).href);
    runPool = mod.runPool;
    if (typeof runPool !== 'function') throw new Error('runPool absent ou non appelable');
  } catch (error) {
    harnessFault = `CHARGEMENT: ${String(error?.stack ?? error)}`;
    return;
  }
  const row = rowById(rowId);
  try {
    const outcome = await row.run(runPool);
    concluded = true;
    pass = outcome.pass === true;
    detail = String(outcome.detail ?? '');
  } catch (error) {
    // Une exception qui s'échappe de la ligne est un comportement du candidat
    // hors contrat, jamais une panne d'évaluateur : la ligne échoue.
    concluded = true;
    pass = false;
    detail = `EXCEPTION: ${String(error?.stack ?? error)}`;
  }
};

main().catch((error) => {
  harnessFault = `INATTENDU: ${String(error?.stack ?? error)}`;
});
