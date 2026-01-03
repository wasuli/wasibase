import chalk from 'chalk';
import open from 'open';
import { startGraphServer } from '../web/graphServer.js';

export async function graphMenu() {
  console.clear();
  console.log(chalk.cyan.bold('\n  WASIBASE GRAPH\n'));
  console.log(chalk.gray('  Visualisierung wird geladen...\n'));

  const port = 3335 + Math.floor(Math.random() * 100);

  return new Promise((resolve) => {
    startGraphServer({ port }, () => {
      console.log(chalk.gray('\n  Graph geschlossen.\n'));
      resolve();
    });

    open(`http://localhost:${port}`);
  });
}
