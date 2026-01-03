import { mainMenu } from './ui/manage.js';
import { noteMenu } from './ui/note.js';
import { searchMenu } from './ui/search.js';
import { graphMenu } from './ui/graph.js';
import { backupMenu } from './ui/backup.js';
import { syncMenu } from './ui/sync.js';
import chalk from 'chalk';

export async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'note':
    case 'n':
      await noteMenu();
      break;
    case 'search':
    case 's':
      await searchMenu();
      break;
    case 'graph':
    case 'g':
      await graphMenu();
      break;
    case 'backup':
    case 'b':
      await backupMenu();
      break;
    case 'sync':
      await syncMenu();
      break;
    case 'help':
    case 'h':
      showHelp();
      break;
    default:
      await mainMenu();
      break;
  }
}

function showHelp() {
  console.clear();
  console.log(chalk.cyan.bold('\n  WASIBASE\n'));
  console.log(chalk.bold('  Befehle:\n'));
  console.log(chalk.gray('  wasibase          ') + chalk.bold('Verwaltung (Kategorien)'));
  console.log(chalk.gray('  wasibase note     ') + chalk.bold('Note erstellen/bearbeiten'));
  console.log(chalk.gray('  wasibase search   ') + chalk.bold('Notes durchsuchen'));
  console.log(chalk.gray('  wasibase graph    ') + chalk.bold('Verknuepfungen visualisieren'));
  console.log(chalk.gray('  wasibase backup   ') + chalk.bold('Backup erstellen/wiederherstellen'));
  console.log(chalk.gray('  wasibase sync     ') + chalk.bold('Mit Cloud synchronisieren'));
  console.log(chalk.gray('  wasibase help     ') + chalk.bold('Diese Hilfe\n'));
}
