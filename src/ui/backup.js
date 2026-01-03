import inquirer from 'inquirer';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import * as storage from '../storage.js';
import { CONFIG } from '../config.js';

function clear() {
  console.clear();
  console.log('');
  console.log(chalk.bgGreen.white.bold('  WASIBASE BACKUP  '));
  console.log('');
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export async function backupMenu() {
  clear();

  const oberkategorien = storage.getOberkategorien();
  let totalNotes = 0;

  for (const ober of oberkategorien) {
    const unters = storage.getUnterkategorien(ober);
    for (const unter of unters) {
      totalNotes += storage.getNotes(ober, unter).length;
    }
  }

  console.log(chalk.gray(`  ${totalNotes} Notes in ${oberkategorien.length} Kategorien\n`));

  const { action } = await inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: chalk.blue('Aktion'),
    prefix: chalk.blue('◆'),
    choices: [
      { name: chalk.green('  ↓ ') + chalk.bold('Backup erstellen'), value: 'create' },
      { name: chalk.yellow('  ↑ ') + chalk.bold('Backup wiederherstellen'), value: 'restore' },
      { name: chalk.gray('  < Zurueck'), value: 'exit' }
    ]
  }]);

  if (action === 'exit') return;

  if (action === 'create') {
    return createBackup();
  }

  if (action === 'restore') {
    return restoreBackup();
  }
}

async function createBackup() {
  clear();

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const defaultName = `wasibase-backup-${timestamp}.json`;
  const defaultPath = path.join(CONFIG.backupDir, defaultName);

  console.log(chalk.gray('  Standard Speicherort:'));
  console.log(chalk.cyan(`  ${CONFIG.backupDir}\n`));

  const { location } = await inquirer.prompt([{
    type: 'list',
    name: 'location',
    message: chalk.blue('Wo speichern?'),
    prefix: chalk.blue('◆'),
    choices: [
      { name: chalk.cyan('  → ') + chalk.bold('Standard (~/.wasibase/backups/)'), value: 'default' },
      { name: chalk.cyan('  → ') + chalk.bold('Eigener Pfad angeben'), value: 'custom' },
      { name: chalk.gray('  < Zurueck'), value: 'back' }
    ]
  }]);

  if (location === 'back') return backupMenu();

  let filePath = defaultPath;

  if (location === 'custom') {
    const { customPath } = await inquirer.prompt([{
      type: 'input',
      name: 'customPath',
      message: chalk.green('Pfad (mit Dateiname):'),
      prefix: chalk.green('+'),
      default: path.join(process.env.HOME, 'Downloads', defaultName)
    }]);

    if (!customPath.trim()) return backupMenu();
    filePath = customPath.trim();

    if (!filePath.endsWith('.json')) {
      filePath = path.join(filePath, defaultName);
    }
  }

  console.log('');
  console.log(chalk.gray('  Erstelle Backup...'));

  try {
    const noteCount = storage.saveBackupToFile(filePath);
    const stats = fs.statSync(filePath);

    console.log('');
    console.log(chalk.green.bold('  ✓ Backup erstellt!'));
    console.log('');
    console.log(chalk.gray('  Datei: ') + chalk.bold(filePath));
    console.log(chalk.gray('  Notes: ') + chalk.bold(noteCount));
    console.log(chalk.gray('  Groesse: ') + chalk.bold(formatSize(stats.size)));
    console.log('');
  } catch (err) {
    console.log(chalk.red(`\n  ✕ Fehler: ${err.message}\n`));
  }

  await inquirer.prompt([{
    type: 'input',
    name: 'continue',
    message: chalk.gray('Enter zum Fortfahren...'),
    prefix: ''
  }]);

  return backupMenu();
}

async function restoreBackup() {
  clear();

  storage.ensureDir(CONFIG.backupDir);
  const backupFiles = fs.existsSync(CONFIG.backupDir)
    ? fs.readdirSync(CONFIG.backupDir).filter(f => f.endsWith('.json')).sort().reverse()
    : [];

  if (backupFiles.length === 0) {
    console.log(chalk.yellow('  Keine Backups gefunden.\n'));
    console.log(chalk.gray('  Du kannst einen eigenen Pfad angeben.\n'));
  } else {
    console.log(chalk.gray(`  ${backupFiles.length} Backup(s) gefunden\n`));
  }

  const choices = [
    ...backupFiles.slice(0, 10).map(f => {
      const filePath = path.join(CONFIG.backupDir, f);
      const stats = fs.statSync(filePath);
      return {
        name: chalk.cyan('  → ') + chalk.bold(f) + chalk.gray(` (${formatSize(stats.size)})`),
        value: filePath,
        short: f
      };
    }),
    { name: chalk.yellow('  ? ') + chalk.yellow('Eigenen Pfad angeben'), value: 'custom' },
    { name: chalk.gray('  < Zurueck'), value: 'back' }
  ];

  if (backupFiles.length > 0) {
    choices.splice(backupFiles.slice(0, 10).length, 0, new inquirer.Separator(chalk.gray('─'.repeat(40))));
  }

  const { selection } = await inquirer.prompt([{
    type: 'list',
    name: 'selection',
    message: chalk.blue('Backup auswaehlen'),
    prefix: chalk.blue('◆'),
    choices,
    pageSize: 15
  }]);

  if (selection === 'back') return backupMenu();

  let filePath = selection;

  if (selection === 'custom') {
    const { customPath } = await inquirer.prompt([{
      type: 'input',
      name: 'customPath',
      message: chalk.green('Pfad zur Backup-Datei:'),
      prefix: chalk.green('?')
    }]);

    if (!customPath.trim()) return restoreBackup();
    filePath = customPath.trim();
  }

  if (!fs.existsSync(filePath)) {
    console.log(chalk.red(`\n  ✕ Datei nicht gefunden: ${filePath}\n`));
    await inquirer.prompt([{
      type: 'input',
      name: 'continue',
      message: chalk.gray('Enter zum Fortfahren...'),
      prefix: ''
    }]);
    return restoreBackup();
  }

  try {
    const backup = storage.loadBackupFromFile(filePath);

    if (!backup || !backup.notes) {
      console.log(chalk.red('\n  ✕ Ungueltige Backup-Datei\n'));
      await inquirer.prompt([{
        type: 'input',
        name: 'continue',
        message: chalk.gray('Enter zum Fortfahren...'),
        prefix: ''
      }]);
      return restoreBackup();
    }

    console.log('');
    console.log(chalk.yellow('  Backup-Info:'));
    console.log(chalk.gray('  Erstellt: ') + chalk.bold(backup.created || 'Unbekannt'));
    console.log(chalk.gray('  Notes: ') + chalk.bold(backup.notes.length));
    console.log('');

    const { confirm } = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirm',
      message: chalk.yellow('Wiederherstellen? (Ueberschreibt bestehende Notes)'),
      default: false
    }]);

    if (!confirm) return backupMenu();

    console.log('');
    console.log(chalk.gray('  Stelle wieder her...'));

    const restored = storage.restoreFromBackup(backup);

    console.log('');
    console.log(chalk.green.bold('  ✓ Wiederhergestellt!'));
    console.log(chalk.gray(`  ${restored} Notes wurden importiert.\n`));
  } catch (err) {
    console.log(chalk.red(`\n  ✕ Fehler: ${err.message}\n`));
  }

  await inquirer.prompt([{
    type: 'input',
    name: 'continue',
    message: chalk.gray('Enter zum Fortfahren...'),
    prefix: ''
  }]);

  return backupMenu();
}
