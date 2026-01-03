import { mainMenu } from './ui/manage.js';
import { noteMenu } from './ui/note.js';
import { searchMenu } from './ui/search.js';
import { graphMenu } from './ui/graph.js';
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
  console.log(chalk.white('  Befehle:\n'));
  console.log(chalk.gray('  wasibase          ') + chalk.white('Verwaltung (Kategorien)'));
  console.log(chalk.gray('  wasibase note     ') + chalk.white('Note erstellen/bearbeiten'));
  console.log(chalk.gray('  wasibase search   ') + chalk.white('Notes durchsuchen'));
  console.log(chalk.gray('  wasibase graph    ') + chalk.white('Verknuepfungen visualisieren'));
  console.log(chalk.gray('  wasibase help     ') + chalk.white('Diese Hilfe\n'));
}
