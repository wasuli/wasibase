import inquirer from 'inquirer';
import chalk from 'chalk';
import * as storage from '../storage.js';

function clear() {
  console.clear();
  console.log('');
  console.log(chalk.bgBlue.white.bold('  WASIBASE  '));
  console.log('');
}

function formatChoice(name, isNew = false, isAction = false) {
  if (isNew) return chalk.green('  + ') + chalk.green(name);
  if (isAction) return chalk.yellow('  ~ ') + chalk.yellow(name);
  return chalk.cyan('  → ') + chalk.bold(name);
}

function getPreview(content, maxLength = 80) {
  if (!content) return '';
  // Entferne YAML Frontmatter
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---\n?/, '').trim();
  // Entferne Markdown-Syntax
  const cleaned = withoutFrontmatter
    .replace(/^#+\s*/gm, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/\n/g, ' ')
    .trim();
  if (cleaned.length > maxLength) {
    return cleaned.substring(0, maxLength) + '...';
  }
  return cleaned;
}

export async function mainMenu() {
  clear();

  const oberkategorien = storage.getOberkategorien();

  if (oberkategorien.length === 0) {
    console.log(chalk.gray('  Noch keine Kategorien.\n'));
    console.log(chalk.gray('  Tipp: wasibase note\n'));

    const { action } = await inquirer.prompt([{
      type: 'list',
      name: 'action',
      message: chalk.blue('Aktion'),
      prefix: chalk.blue('◆'),
      choices: [
        { name: formatChoice('Neue Oberkategorie erstellen', true), value: 'new' },
        { name: chalk.red('  ✕ ') + chalk.gray('Beenden'), value: 'exit' }
      ]
    }]);

    if (action === 'exit') return;

    if (action === 'new') {
      const { name } = await inquirer.prompt([{
        type: 'input',
        name: 'name',
        message: chalk.green('Name:'),
        prefix: chalk.green('+')
      }]);
      if (name.trim()) {
        storage.createOberkategorie(name.trim());
        console.log(chalk.green(`\n  ✓ "${name.trim()}" erstellt\n`));
      }
    }
    return mainMenu();
  }

  // Zaehle Notes pro Oberkategorie
  function countNotesInOberkategorie(ober) {
    const unters = storage.getUnterkategorien(ober);
    return unters.reduce((sum, u) => sum + storage.getNotes(ober, u).length, 0);
  }

  const choices = [
    ...oberkategorien.map(o => {
      const unterCount = storage.getUnterkategorien(o).length;
      const noteCount = countNotesInOberkategorie(o);
      return {
        name: chalk.cyan('  → ') + chalk.bold(o) + chalk.gray(` (${unterCount} Unter, ${noteCount} Notes)`),
        value: { type: 'open', name: o },
        short: o
      };
    }),
    new inquirer.Separator(chalk.gray('─'.repeat(30))),
    { name: formatChoice('Neue Oberkategorie', true), value: 'new', short: 'Neu' },
    { name: chalk.red('  ✕ ') + chalk.gray('Beenden'), value: 'exit', short: 'Beenden' }
  ];

  const { action } = await inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: chalk.blue('Oberkategorie'),
    prefix: chalk.blue('◆'),
    choices,
    pageSize: 15,
    loop: false
  }]);

  if (action === 'exit') {
    console.log(chalk.gray('\n  Bis bald!\n'));
    return;
  }

  if (action === 'new') {
    const { name } = await inquirer.prompt([{
      type: 'input',
      name: 'name',
      message: chalk.green('Name:'),
      prefix: chalk.green('+')
    }]);
    if (name.trim()) {
      storage.createOberkategorie(name.trim());
      console.log(chalk.green(`\n  ✓ "${name.trim()}" erstellt\n`));
    }
    return mainMenu();
  }

  if (action.type === 'open') {
    return oberkategorieMenu(action.name);
  }
}

async function oberkategorieMenu(oberkategorie) {
  clear();
  console.log(chalk.gray('  Oberkategorie: ') + chalk.bold(oberkategorie));
  console.log('');

  const unterkategorien = storage.getUnterkategorien(oberkategorie);

  if (unterkategorien.length === 0) {
    console.log(chalk.gray('  Noch keine Unterkategorien.\n'));
  } else {
    const totalNotes = unterkategorien.reduce((sum, u) => sum + storage.getNotes(oberkategorie, u).length, 0);
    console.log(chalk.gray(`  ${unterkategorien.length} Unterkategorie${unterkategorien.length === 1 ? '' : 'n'}, ${totalNotes} Note${totalNotes === 1 ? '' : 's'} gesamt\n`));
  }

  const choices = [
    ...unterkategorien.map(u => {
      const noteCount = storage.getNotes(oberkategorie, u).length;
      return {
        name: chalk.cyan('  → ') + chalk.bold(u) + chalk.gray(` (${noteCount} Note${noteCount === 1 ? '' : 's'})`),
        value: { type: 'open', name: u },
        short: u
      };
    }),
    new inquirer.Separator(chalk.gray('─'.repeat(30))),
    { name: formatChoice('Neue Unterkategorie', true), value: 'new' },
    { name: chalk.red('  - ') + chalk.red('Oberkategorie loeschen'), value: 'delete' },
    { name: chalk.gray('  < Zurueck'), value: 'back' }
  ];

  const { action } = await inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: chalk.blue('Unterkategorie'),
    prefix: chalk.blue('◆'),
    choices,
    pageSize: 15,
    loop: false
  }]);

  if (action === 'back') return mainMenu();

  if (action === 'new') {
    const { name } = await inquirer.prompt([{
      type: 'input',
      name: 'name',
      message: chalk.green('Name:'),
      prefix: chalk.green('+')
    }]);
    if (name.trim()) {
      storage.createUnterkategorie(oberkategorie, name.trim());
      console.log(chalk.green(`\n  ✓ "${name.trim()}" erstellt\n`));
    }
    return oberkategorieMenu(oberkategorie);
  }

  if (action === 'delete') {
    const { confirm } = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirm',
      message: chalk.red(`"${oberkategorie}" und alle Inhalte loeschen?`),
      default: false
    }]);
    if (confirm) {
      storage.deleteOberkategorie(oberkategorie);
      console.log(chalk.red(`\n  ✓ "${oberkategorie}" geloescht\n`));
      return mainMenu();
    }
    return oberkategorieMenu(oberkategorie);
  }

  if (action.type === 'open') {
    return unterkategorieMenu(oberkategorie, action.name);
  }

  return oberkategorieMenu(oberkategorie);
}

async function unterkategorieMenu(oberkategorie, unterkategorie) {
  clear();
  console.log(chalk.gray('  Pfad: ') + chalk.bold(`${oberkategorie} / ${unterkategorie}`));
  console.log('');

  const notes = storage.getNotes(oberkategorie, unterkategorie);

  if (notes.length === 0) {
    console.log(chalk.gray('  Noch keine Notes.\n'));
  } else {
    console.log(chalk.gray(`  ${notes.length} Note${notes.length === 1 ? '' : 's'}:\n`));
  }

  const choices = [
    ...notes.map(n => {
      const content = storage.readNote(oberkategorie, unterkategorie, n);
      const preview = getPreview(content, 40);
      return {
        name: chalk.cyan('  → ') + chalk.bold(n) + (preview ? chalk.gray(`  "${preview}"`) : ''),
        value: { type: 'note', name: n },
        short: n
      };
    }),
    new inquirer.Separator(chalk.gray('─'.repeat(30))),
    { name: chalk.red('  - ') + chalk.red('Unterkategorie loeschen'), value: 'delete' },
    { name: chalk.gray('  < Zurueck'), value: 'back' }
  ];

  const { action } = await inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: chalk.blue('Notes'),
    prefix: chalk.blue('◆'),
    choices,
    pageSize: 15,
    loop: false
  }]);

  if (action === 'back') return oberkategorieMenu(oberkategorie);

  if (action === 'delete') {
    const { confirm } = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirm',
      message: chalk.red(`"${unterkategorie}" und alle Notes loeschen?`),
      default: false
    }]);
    if (confirm) {
      storage.deleteUnterkategorie(oberkategorie, unterkategorie);
      console.log(chalk.red(`\n  ✓ "${unterkategorie}" geloescht\n`));
      return oberkategorieMenu(oberkategorie);
    }
    return unterkategorieMenu(oberkategorie, unterkategorie);
  }

  if (action.type === 'note') {
    return noteDetailMenu(oberkategorie, unterkategorie, action.name);
  }

  return unterkategorieMenu(oberkategorie, unterkategorie);
}

async function noteDetailMenu(oberkategorie, unterkategorie, thema) {
  clear();
  console.log(chalk.gray('  Note: ') + chalk.bold(thema));
  console.log(chalk.gray('  Pfad: ') + chalk.gray(`${oberkategorie} / ${unterkategorie}`));
  console.log('');

  const content = storage.readNote(oberkategorie, unterkategorie, thema);

  if (content) {
    // Zeige Preview
    const lines = content.split('\n');
    const previewLines = lines.slice(0, 20);
    console.log(chalk.gray('  ┌' + '─'.repeat(60)));
    previewLines.forEach(line => {
      const displayLine = line.length > 58 ? line.substring(0, 55) + '...' : line;
      console.log(chalk.gray('  │ ') + chalk.bold(displayLine));
    });
    if (lines.length > 20) {
      console.log(chalk.gray('  │ ') + chalk.gray(`... (${lines.length - 20} weitere Zeilen)`));
    }
    console.log(chalk.gray('  └' + '─'.repeat(60)));
    console.log('');
  }

  const { action } = await inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: chalk.blue('Aktion'),
    prefix: chalk.blue('◆'),
    choices: [
      { name: chalk.red('  - ') + chalk.red('Note loeschen'), value: 'delete' },
      { name: chalk.gray('  < Zurueck'), value: 'back' }
    ]
  }]);

  if (action === 'back') {
    return unterkategorieMenu(oberkategorie, unterkategorie);
  }

  if (action === 'delete') {
    const { confirm } = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirm',
      message: chalk.red(`Note "${thema}" wirklich loeschen?`),
      default: false
    }]);
    if (confirm) {
      storage.deleteNote(oberkategorie, unterkategorie, thema);
      console.log(chalk.red(`\n  ✓ "${thema}" geloescht\n`));
      return unterkategorieMenu(oberkategorie, unterkategorie);
    }
  }

  return noteDetailMenu(oberkategorie, unterkategorie, thema);
}
