import inquirer from 'inquirer';
import chalk from 'chalk';
import open from 'open';
import * as storage from '../storage.js';
import { startServer, startEditServer } from '../web/server.js';

function clear() {
  console.clear();
  console.log('');
  console.log(chalk.bgBlue.white.bold('  WASIBASE NOTE  '));
  console.log('');
}

function formatChoice(name, isNew = false) {
  if (isNew) {
    return chalk.green('  + ') + chalk.green(name);
  }
  return chalk.cyan('  → ') + chalk.bold(name);
}

function getAllNotes() {
  const allNotes = [];
  const oberkategorien = storage.getOberkategorien();

  for (const ober of oberkategorien) {
    const unterkategorien = storage.getUnterkategorien(ober);
    for (const unter of unterkategorien) {
      const notes = storage.getNotes(ober, unter);
      for (const note of notes) {
        allNotes.push({
          oberkategorie: ober,
          unterkategorie: unter,
          thema: note,
          fullPath: `${ober} / ${unter} / ${note}`
        });
      }
    }
  }

  return allNotes;
}

export async function noteMenu() {
  clear();

  const oberkategorien = storage.getOberkategorien();

  // Wenn keine Kategorien, direkt neue Note erstellen
  if (oberkategorien.length === 0) {
    console.log(chalk.gray('  Noch keine Kategorien vorhanden.\n'));
    return createNewNote();
  }

  // Oberkategorie waehlen
  const choices = [
    { name: chalk.green('  + ') + chalk.green.bold('Neue Note erstellen'), value: 'new' },
    new inquirer.Separator(chalk.gray('─'.repeat(40))),
    ...oberkategorien.map(o => {
      const unters = storage.getUnterkategorien(o);
      const noteCount = unters.reduce((sum, u) => sum + storage.getNotes(o, u).length, 0);
      return {
        name: chalk.cyan('  → ') + chalk.bold(o) + chalk.gray(` (${noteCount} Notes)`),
        value: { type: 'ober', name: o },
        short: o
      };
    }),
    new inquirer.Separator(chalk.gray('─'.repeat(40))),
    { name: chalk.red('  ✕ ') + chalk.gray('Abbrechen'), value: 'exit' }
  ];

  const { selection } = await inquirer.prompt([{
    type: 'list',
    name: 'selection',
    message: chalk.blue('Oberkategorie'),
    prefix: chalk.blue('◆'),
    choices,
    pageSize: 20,
    loop: false
  }]);

  if (selection === 'exit') return;
  if (selection === 'new') return createNewNote();

  return selectUnterkategorie(selection.name);
}

async function selectUnterkategorie(oberkategorie) {
  clear();
  console.log(chalk.gray('  Oberkategorie: ') + chalk.bold(oberkategorie) + '\n');

  const unterkategorien = storage.getUnterkategorien(oberkategorie);

  if (unterkategorien.length === 0) {
    console.log(chalk.gray('  Noch keine Unterkategorien.\n'));
    return createNewNote();
  }

  const choices = [
    { name: chalk.green('  + ') + chalk.green.bold('Neue Note hier erstellen'), value: 'new' },
    new inquirer.Separator(chalk.gray('─'.repeat(40))),
    ...unterkategorien.map(u => {
      const noteCount = storage.getNotes(oberkategorie, u).length;
      return {
        name: chalk.cyan('  → ') + chalk.bold(u) + chalk.gray(` (${noteCount} Notes)`),
        value: { type: 'unter', name: u },
        short: u
      };
    }),
    new inquirer.Separator(chalk.gray('─'.repeat(40))),
    { name: chalk.gray('  < Zurueck'), value: 'back' }
  ];

  const { selection } = await inquirer.prompt([{
    type: 'list',
    name: 'selection',
    message: chalk.blue('Unterkategorie'),
    prefix: chalk.blue('◆'),
    choices,
    pageSize: 20,
    loop: false
  }]);

  if (selection === 'back') return noteMenu();
  if (selection === 'new') return createNewNote();

  return selectNote(oberkategorie, selection.name);
}

async function selectNote(oberkategorie, unterkategorie) {
  clear();
  console.log(chalk.gray('  Pfad: ') + chalk.bold(oberkategorie + ' / ' + unterkategorie) + '\n');

  const notes = storage.getNotes(oberkategorie, unterkategorie);

  const choices = [
    { name: chalk.green('  + ') + chalk.green.bold('Neue Note erstellen'), value: 'new' },
    new inquirer.Separator(chalk.gray('─ Notes ' + '─'.repeat(32))),
    ...notes.map(thema => ({
      name: chalk.cyan('  → ') + chalk.bold(thema),
      value: { type: 'note', thema },
      short: thema
    })),
    new inquirer.Separator(chalk.gray('─'.repeat(40))),
    { name: chalk.gray('  < Zurueck'), value: 'back' }
  ];

  if (notes.length === 0) {
    choices.splice(2, 1); // Entferne leeren Separator
  }

  const { selection } = await inquirer.prompt([{
    type: 'list',
    name: 'selection',
    message: chalk.blue('Note auswaehlen'),
    prefix: chalk.blue('◆'),
    choices,
    pageSize: 20,
    loop: false
  }]);

  if (selection === 'back') return selectUnterkategorie(oberkategorie);
  if (selection === 'new') {
    // Direkt neue Note in dieser Kategorie erstellen
    return openNewNoteInCategory(oberkategorie, unterkategorie);
  }

  // Note zum Bearbeiten oeffnen
  return openNoteForEditing({
    oberkategorie,
    unterkategorie,
    thema: selection.thema
  });
}

async function openNewNoteInCategory(oberkategorie, unterkategorie) {
  clear();
  console.log(chalk.gray('  Pfad: ') + chalk.bold(oberkategorie + ' / ' + unterkategorie));
  console.log('');
  console.log(chalk.gray('  Browser wird geoeffnet...'));
  console.log('');

  const port = 3333 + Math.floor(Math.random() * 100);

  return new Promise((resolve) => {
    startServer({ oberkategorie, unterkategorie, port }, (result) => {
      if (result.saved) {
        console.log(chalk.green.bold('\n  ✓ Gespeichert!'));
        console.log(chalk.gray(`    ${oberkategorie} / ${unterkategorie} / ${result.thema}\n`));
      } else {
        console.log(chalk.yellow('\n  ○ Abgebrochen.\n'));
      }
      resolve();
    });

    open(`http://localhost:${port}`);
  });
}

async function editNoteMenu(allNotes, searchQuery = '') {
  clear();

  let filteredNotes = allNotes;

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredNotes = allNotes.filter(n =>
      n.thema.toLowerCase().includes(query) ||
      n.oberkategorie.toLowerCase().includes(query) ||
      n.unterkategorie.toLowerCase().includes(query)
    );
  }

  if (searchQuery) {
    console.log(chalk.gray(`  Suche: "${searchQuery}" - ${filteredNotes.length} Treffer\n`));
  } else {
    console.log(chalk.gray(`  ${filteredNotes.length} Note(s) verfuegbar\n`));
  }

  if (filteredNotes.length === 0) {
    console.log(chalk.yellow('  Keine Notes gefunden.\n'));
    const { action } = await inquirer.prompt([{
      type: 'list',
      name: 'action',
      message: chalk.blue('Was tun?'),
      prefix: chalk.blue('◆'),
      choices: [
        { name: chalk.yellow('  ↻ ') + chalk.yellow('Alle Notes anzeigen'), value: 'all' },
        { name: chalk.cyan('  ? ') + chalk.cyan('Neue Suche'), value: 'search' },
        { name: chalk.gray('  < Zurueck'), value: 'back' }
      ]
    }]);
    if (action === 'all') return editNoteMenu(allNotes, '');
    if (action === 'search') {
      const { query } = await inquirer.prompt([{
        type: 'input',
        name: 'query',
        message: chalk.blue('Suchbegriff:'),
        prefix: chalk.blue('?')
      }]);
      return editNoteMenu(allNotes, query);
    }
    return noteMenu();
  }

  const choices = [
    ...filteredNotes.map(n => ({
      name: chalk.cyan('  → ') + chalk.bold(n.thema) + chalk.gray(`  (${n.oberkategorie} / ${n.unterkategorie})`),
      value: n,
      short: n.thema
    })),
    new inquirer.Separator(chalk.gray('─'.repeat(40))),
    { name: chalk.cyan('  ? ') + chalk.cyan('Suchen / Filtern'), value: 'search' },
    { name: chalk.gray('  < Zurueck'), value: 'back' }
  ];

  const { selection } = await inquirer.prompt([{
    type: 'list',
    name: 'selection',
    message: chalk.blue('Note auswaehlen'),
    prefix: chalk.blue('◆'),
    choices,
    pageSize: 15,
    loop: false
  }]);

  if (selection === 'back') return noteMenu();
  if (selection === 'search') {
    const { query } = await inquirer.prompt([{
      type: 'input',
      name: 'query',
      message: chalk.blue('Suchbegriff:'),
      prefix: chalk.blue('?')
    }]);
    return editNoteMenu(allNotes, query);
  }

  // Note zum Bearbeiten oeffnen
  return openNoteForEditing(selection);
}

async function openNoteForEditing(note) {
  clear();
  console.log(chalk.gray('  Bearbeite: ') + chalk.bold(note.thema));
  console.log(chalk.gray('  Pfad: ') + chalk.gray(`${note.oberkategorie} / ${note.unterkategorie}`));
  console.log('');
  console.log(chalk.gray('  Browser wird geoeffnet...'));
  console.log('');

  const port = 3333 + Math.floor(Math.random() * 100);
  const existingContent = storage.readNote(note.oberkategorie, note.unterkategorie, note.thema);

  return new Promise((resolve) => {
    startEditServer({
      oberkategorie: note.oberkategorie,
      unterkategorie: note.unterkategorie,
      thema: note.thema,
      content: existingContent,
      port
    }, (result) => {
      if (result.saved) {
        console.log(chalk.green.bold('\n  ✓ Gespeichert!'));
        console.log(chalk.gray(`    ${note.oberkategorie} / ${note.unterkategorie} / ${result.thema}\n`));
      } else {
        console.log(chalk.yellow('\n  ○ Beendet.\n'));
      }
      resolve();
    });

    open(`http://localhost:${port}`);
  });
}

async function createNewNote() {
  clear();

  // 1. Oberkategorie
  const oberkategorien = storage.getOberkategorien();
  let oberkategorie;

  if (oberkategorien.length > 0) {
    console.log(chalk.gray('  Waehle eine Oberkategorie:\n'));

    const { selection } = await inquirer.prompt([{
      type: 'list',
      name: 'selection',
      message: chalk.blue('Oberkategorie'),
      prefix: chalk.blue('◆'),
      choices: [
        ...oberkategorien.map(o => ({
          name: formatChoice(o),
          value: o,
          short: o
        })),
        new inquirer.Separator(chalk.gray('─'.repeat(30))),
        {
          name: formatChoice('Neue Oberkategorie erstellen', true),
          value: '__new__',
          short: 'Neu'
        },
        {
          name: chalk.red('  ✕ ') + chalk.gray('Abbrechen'),
          value: '__exit__',
          short: 'Abbrechen'
        }
      ],
      pageSize: 12,
      loop: false
    }]);

    if (selection === '__exit__') return;

    if (selection === '__new__') {
      console.log('');
      const { name } = await inquirer.prompt([{
        type: 'input',
        name: 'name',
        message: chalk.green('Name:'),
        prefix: chalk.green('+')
      }]);
      if (!name.trim()) return;
      oberkategorie = name.trim();
      storage.createOberkategorie(oberkategorie);
      console.log(chalk.green(`\n  ✓ "${oberkategorie}" erstellt\n`));
    } else {
      oberkategorie = selection;
    }
  } else {
    console.log(chalk.gray('  Noch keine Kategorien vorhanden.\n'));
    const { name } = await inquirer.prompt([{
      type: 'input',
      name: 'name',
      message: chalk.green('Erste Oberkategorie:'),
      prefix: chalk.green('+')
    }]);
    if (!name.trim()) return;
    oberkategorie = name.trim();
    storage.createOberkategorie(oberkategorie);
  }

  // 2. Unterkategorie
  clear();
  console.log(chalk.gray('  Oberkategorie: ') + chalk.bold(oberkategorie));
  console.log('');

  const unterkategorien = storage.getUnterkategorien(oberkategorie);
  let unterkategorie;

  if (unterkategorien.length > 0) {
    console.log(chalk.gray('  Waehle eine Unterkategorie:\n'));

    const { selection } = await inquirer.prompt([{
      type: 'list',
      name: 'selection',
      message: chalk.blue('Unterkategorie'),
      prefix: chalk.blue('◆'),
      choices: [
        ...unterkategorien.map(u => ({
          name: formatChoice(u),
          value: u,
          short: u
        })),
        new inquirer.Separator(chalk.gray('─'.repeat(30))),
        {
          name: formatChoice('Neue Unterkategorie erstellen', true),
          value: '__new__',
          short: 'Neu'
        },
        {
          name: chalk.red('  ✕ ') + chalk.gray('Abbrechen'),
          value: '__exit__',
          short: 'Abbrechen'
        }
      ],
      pageSize: 12,
      loop: false
    }]);

    if (selection === '__exit__') return;

    if (selection === '__new__') {
      console.log('');
      const { name } = await inquirer.prompt([{
        type: 'input',
        name: 'name',
        message: chalk.green('Name:'),
        prefix: chalk.green('+')
      }]);
      if (!name.trim()) return;
      unterkategorie = name.trim();
      storage.createUnterkategorie(oberkategorie, unterkategorie);
      console.log(chalk.green(`\n  ✓ "${unterkategorie}" erstellt\n`));
    } else {
      unterkategorie = selection;
    }
  } else {
    console.log(chalk.gray('  Noch keine Unterkategorien vorhanden.\n'));
    const { name } = await inquirer.prompt([{
      type: 'input',
      name: 'name',
      message: chalk.green('Erste Unterkategorie:'),
      prefix: chalk.green('+')
    }]);
    if (!name.trim()) return;
    unterkategorie = name.trim();
    storage.createUnterkategorie(oberkategorie, unterkategorie);
  }

  // 3. Web-Editor oeffnen
  clear();
  console.log(chalk.gray('  Pfad: ') + chalk.bold(`${oberkategorie} / ${unterkategorie}`));
  console.log('');
  console.log(chalk.gray('  Browser wird geoeffnet...'));
  console.log('');

  const port = 3333 + Math.floor(Math.random() * 100);

  return new Promise((resolve) => {
    startServer({ oberkategorie, unterkategorie, port }, (result) => {
      if (result.saved) {
        console.log(chalk.green.bold('\n  ✓ Gespeichert!'));
        console.log(chalk.gray(`    ${oberkategorie} / ${unterkategorie} / ${result.thema}\n`));
      } else {
        console.log(chalk.yellow('\n  ○ Abgebrochen.\n'));
      }
      resolve();
    });

    open(`http://localhost:${port}`);
  });
}
