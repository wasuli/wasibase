import chalk from 'chalk';
import open from 'open';
import { startSearchServer } from '../web/server.js';

export async function searchMenu() {
  console.clear();
  console.log(chalk.cyan.bold('\n  WASIBASE SEARCH\n'));
  console.log(chalk.gray('  Browser oeffnet sich...\n'));

  const port = 3334 + Math.floor(Math.random() * 100);

  return new Promise((resolve) => {
    startSearchServer({ port }, () => {
      console.log(chalk.gray('\n  Suche beendet.\n'));
      resolve();
    });

    open(`http://localhost:${port}`);
  });
}
