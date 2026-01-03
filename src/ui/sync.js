import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import * as storage from '../storage.js';

function clear() {
  console.clear();
  console.log('');
  console.log(chalk.bgMagenta.white.bold('  WASIBASE SYNC  '));
  console.log('');
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function detectCloudServices() {
  const services = [];
  const cloudStorageDir = path.join(process.env.HOME, 'Library', 'CloudStorage');

  if (fs.existsSync(cloudStorageDir)) {
    const dirs = fs.readdirSync(cloudStorageDir, { withFileTypes: true });

    for (const dir of dirs) {
      if (!dir.isDirectory()) continue;

      const fullPath = path.join(cloudStorageDir, dir.name);

      if (dir.name.startsWith('ProtonDrive-')) {
        services.push({
          name: 'Proton Drive',
          path: fullPath,
          icon: '🔒',
          detected: dir.name
        });
      } else if (dir.name.startsWith('Dropbox')) {
        services.push({
          name: 'Dropbox',
          path: fullPath,
          icon: '📦',
          detected: dir.name
        });
      } else if (dir.name.startsWith('GoogleDrive')) {
        services.push({
          name: 'Google Drive',
          path: fullPath,
          icon: '🔷',
          detected: dir.name
        });
      } else if (dir.name.startsWith('OneDrive')) {
        services.push({
          name: 'OneDrive',
          path: fullPath,
          icon: '☁️',
          detected: dir.name
        });
      }
    }
  }

  // Check iCloud
  const iCloudPath = path.join(process.env.HOME, 'Library', 'Mobile Documents', 'com~apple~CloudDocs');
  if (fs.existsSync(iCloudPath)) {
    services.push({
      name: 'iCloud Drive',
      path: iCloudPath,
      icon: '☁️',
      detected: 'iCloud'
    });
  }

  return services;
}

export async function syncMenu() {
  clear();

  const currentPath = storage.getSyncPath();

  if (currentPath) {
    console.log(chalk.gray('  Sync-Ordner konfiguriert:'));
    console.log(chalk.cyan(`  ${currentPath}`));

    if (fs.existsSync(currentPath)) {
      console.log(chalk.green('  ✓ Ordner existiert'));
      const backupFile = path.join(currentPath, 'wasibase-backup.json');
      if (fs.existsSync(backupFile)) {
        const stats = fs.statSync(backupFile);
        const modified = new Date(stats.mtime).toLocaleString('de-DE');
        console.log(chalk.gray(`  Letztes Backup: ${modified} (${formatSize(stats.size)})`));
      }
    } else {
      console.log(chalk.yellow('  ! Ordner nicht gefunden'));
    }
    console.log('');
  } else {
    console.log(chalk.yellow('  Noch kein Sync-Ordner konfiguriert.\n'));
    console.log(chalk.gray('  Tipp: Verwende deinen Proton Drive / Dropbox / iCloud Ordner\n'));
  }

  const choices = [];

  if (currentPath && fs.existsSync(currentPath)) {
    choices.push({ name: chalk.green('  ↑ ') + chalk.bold('Jetzt synchronisieren'), value: 'sync' });
  }

  choices.push(
    { name: chalk.cyan('  ⚙ ') + chalk.bold('Sync-Ordner ' + (currentPath ? 'aendern' : 'einrichten')), value: 'configure' }
  );

  if (currentPath) {
    choices.push({ name: chalk.red('  ✕ ') + chalk.gray('Sync deaktivieren'), value: 'disable' });
  }

  choices.push({ name: chalk.gray('  < Zurueck'), value: 'exit' });

  const { action } = await inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: chalk.blue('Aktion'),
    prefix: chalk.blue('◆'),
    choices
  }]);

  if (action === 'exit') return;

  if (action === 'sync') {
    return doSync(currentPath);
  }

  if (action === 'configure') {
    return configureSyncPath();
  }

  if (action === 'disable') {
    return disableSync();
  }
}

async function configureSyncPath() {
  clear();

  const cloudServices = detectCloudServices();

  if (cloudServices.length > 0) {
    console.log(chalk.green.bold('  Cloud-Dienste erkannt:\n'));

    const choices = cloudServices.map(service => {
      const wasibasePath = path.join(service.path, 'Wasibase');
      const exists = fs.existsSync(wasibasePath);
      return {
        name: chalk.cyan(`  ${service.icon} `) + chalk.bold(service.name) +
              chalk.gray(exists ? ' (Wasibase Ordner existiert)' : ' (Ordner wird erstellt)'),
        value: { service, wasibasePath },
        short: service.name
      };
    });

    choices.push(
      new inquirer.Separator(chalk.gray('─'.repeat(40))),
      { name: chalk.yellow('  ? ') + chalk.yellow('Eigenen Pfad angeben'), value: 'custom' },
      { name: chalk.gray('  < Zurueck'), value: 'back' }
    );

    const { selection } = await inquirer.prompt([{
      type: 'list',
      name: 'selection',
      message: chalk.blue('Wo sollen deine Notes gesichert werden?'),
      prefix: chalk.blue('◆'),
      choices,
      pageSize: 12
    }]);

    if (selection === 'back') return syncMenu();

    if (selection !== 'custom') {
      const { service, wasibasePath } = selection;

      if (!fs.existsSync(wasibasePath)) {
        console.log('');
        const { create } = await inquirer.prompt([{
          type: 'confirm',
          name: 'create',
          message: chalk.green(`Ordner "Wasibase" in ${service.name} erstellen?`),
          default: true
        }]);

        if (!create) return configureSyncPath();

        try {
          fs.mkdirSync(wasibasePath, { recursive: true });
          console.log(chalk.green(`\n  ✓ Ordner erstellt!\n`));
        } catch (err) {
          console.log(chalk.red(`\n  ✕ Fehler: ${err.message}\n`));
          await inquirer.prompt([{
            type: 'input',
            name: 'continue',
            message: chalk.gray('Enter zum Fortfahren...'),
            prefix: ''
          }]);
          return configureSyncPath();
        }
      }

      storage.setSyncPath(wasibasePath);
      console.log(chalk.green(`\n  ✓ ${service.name} konfiguriert!\n`));
      console.log(chalk.gray(`  Pfad: ${wasibasePath}\n`));

      const { syncNow } = await inquirer.prompt([{
        type: 'confirm',
        name: 'syncNow',
        message: chalk.blue('Jetzt synchronisieren?'),
        default: true
      }]);

      if (syncNow) {
        return doSync(wasibasePath);
      }

      return syncMenu();
    }
  } else {
    console.log(chalk.yellow('  Keine Cloud-Dienste erkannt.\n'));
  }

  console.log(chalk.gray('  Gib den Pfad zu deinem Cloud-Ordner an.\n'));

  const currentPath = storage.getSyncPath();

  const { syncPath } = await inquirer.prompt([{
    type: 'input',
    name: 'syncPath',
    message: chalk.green('Sync-Ordner:'),
    prefix: chalk.green('◆'),
    default: currentPath || ''
  }]);

  if (!syncPath.trim()) return syncMenu();

  let resolvedPath = syncPath.trim();
  if (resolvedPath.startsWith('~')) {
    resolvedPath = path.join(process.env.HOME, resolvedPath.slice(1));
  }

  if (!fs.existsSync(resolvedPath)) {
    console.log('');
    const { create } = await inquirer.prompt([{
      type: 'confirm',
      name: 'create',
      message: chalk.yellow('Ordner existiert nicht. Erstellen?'),
      default: true
    }]);

    if (create) {
      try {
        fs.mkdirSync(resolvedPath, { recursive: true });
        console.log(chalk.green(`\n  ✓ Ordner erstellt: ${resolvedPath}\n`));
      } catch (err) {
        console.log(chalk.red(`\n  ✕ Konnte Ordner nicht erstellen: ${err.message}\n`));
        await inquirer.prompt([{
          type: 'input',
          name: 'continue',
          message: chalk.gray('Enter zum Fortfahren...'),
          prefix: ''
        }]);
        return configureSyncPath();
      }
    } else {
      return configureSyncPath();
    }
  }

  storage.setSyncPath(resolvedPath);
  console.log(chalk.green('\n  ✓ Sync-Ordner gespeichert!\n'));

  const { syncNow } = await inquirer.prompt([{
    type: 'confirm',
    name: 'syncNow',
    message: chalk.blue('Jetzt synchronisieren?'),
    default: true
  }]);

  if (syncNow) {
    return doSync(resolvedPath);
  }

  return syncMenu();
}

async function doSync(syncPath) {
  clear();

  console.log(chalk.gray('  Synchronisiere...\n'));
  console.log(chalk.gray('  Ziel: ') + chalk.cyan(syncPath));
  console.log('');

  try {
    const noteCount = storage.syncToPath(syncPath);
    const backupFile = path.join(syncPath, 'wasibase-backup.json');
    const stats = fs.statSync(backupFile);

    console.log(chalk.green.bold('  ✓ Sync abgeschlossen!'));
    console.log('');
    console.log(chalk.gray('  Notes: ') + chalk.bold(noteCount));
    console.log(chalk.gray('  Groesse: ') + chalk.bold(formatSize(stats.size)));
    console.log(chalk.gray('  Datei: ') + chalk.bold('wasibase-backup.json'));
    console.log('');
  } catch (err) {
    console.log(chalk.red(`  ✕ Fehler: ${err.message}\n`));
  }

  await inquirer.prompt([{
    type: 'input',
    name: 'continue',
    message: chalk.gray('Enter zum Fortfahren...'),
    prefix: ''
  }]);

  return syncMenu();
}

async function disableSync() {
  clear();

  const { confirm } = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirm',
    message: chalk.red('Sync wirklich deaktivieren?'),
    default: false
  }]);

  if (confirm) {
    storage.setSyncPath(null);
    console.log(chalk.yellow('\n  ○ Sync deaktiviert.\n'));

    await inquirer.prompt([{
      type: 'input',
      name: 'continue',
      message: chalk.gray('Enter zum Fortfahren...'),
      prefix: ''
    }]);
  }

  return syncMenu();
}
