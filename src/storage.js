/**
 * Storage Module - File system operations for Wasibase
 */

import fs from 'fs';
import path from 'path';
import { CONFIG } from './config.js';

// =============================================================================
// Directory Operations
// =============================================================================

export function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// =============================================================================
// Category Operations
// =============================================================================

export function getOberkategorien() {
  ensureDir(CONFIG.notesDir);
  return fs.readdirSync(CONFIG.notesDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();
}

export function getUnterkategorien(oberkategorie) {
  const dir = path.join(CONFIG.notesDir, oberkategorie);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();
}

export function createOberkategorie(name) {
  const dir = path.join(CONFIG.notesDir, name);
  ensureDir(dir);
  return dir;
}

export function createUnterkategorie(oberkategorie, name) {
  const dir = path.join(CONFIG.notesDir, oberkategorie, name);
  ensureDir(dir);
  return dir;
}

export function deleteOberkategorie(name) {
  const dir = path.join(CONFIG.notesDir, name);
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true });
  }
}

export function deleteUnterkategorie(oberkategorie, name) {
  const dir = path.join(CONFIG.notesDir, oberkategorie, name);
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true });
  }
}

// =============================================================================
// Note Operations
// =============================================================================

export function getNotes(oberkategorie, unterkategorie) {
  const dir = path.join(CONFIG.notesDir, oberkategorie, unterkategorie);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''))
    .sort();
}

export function getNotePath(oberkategorie, unterkategorie, thema) {
  return path.join(CONFIG.notesDir, oberkategorie, unterkategorie, `${thema}.md`);
}

export function noteExists(oberkategorie, unterkategorie, thema) {
  return fs.existsSync(getNotePath(oberkategorie, unterkategorie, thema));
}

export function readNote(oberkategorie, unterkategorie, thema) {
  const filePath = getNotePath(oberkategorie, unterkategorie, thema);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf-8');
}

export function saveNote(oberkategorie, unterkategorie, thema, content) {
  const dir = path.join(CONFIG.notesDir, oberkategorie, unterkategorie);
  ensureDir(dir);
  const filePath = path.join(dir, `${thema}.md`);
  fs.writeFileSync(filePath, content);
  return filePath;
}

export function deleteNote(oberkategorie, unterkategorie, thema) {
  const filePath = getNotePath(oberkategorie, unterkategorie, thema);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

/**
 * Get all notes across all categories
 */
export function getAllNotes() {
  const allNotes = [];

  for (const ober of getOberkategorien()) {
    for (const unter of getUnterkategorien(ober)) {
      for (const thema of getNotes(ober, unter)) {
        allNotes.push({ oberkategorie: ober, unterkategorie: unter, thema });
      }
    }
  }

  return allNotes;
}

/**
 * Get statistics about the notes collection
 */
export function getStats() {
  const oberkategorien = getOberkategorien();
  let unterCount = 0;
  let noteCount = 0;

  for (const ober of oberkategorien) {
    const unters = getUnterkategorien(ober);
    unterCount += unters.length;
    for (const unter of unters) {
      noteCount += getNotes(ober, unter).length;
    }
  }

  return {
    oberkategorien: oberkategorien.length,
    unterkategorien: unterCount,
    notes: noteCount
  };
}

// =============================================================================
// Search
// =============================================================================

export function searchNotes(query) {
  const results = [];
  const queryLower = query.toLowerCase();

  for (const { oberkategorie, unterkategorie, thema } of getAllNotes()) {
    const content = readNote(oberkategorie, unterkategorie, thema);
    if (!content) continue;

    const contentLower = content.toLowerCase();
    const themaLower = thema.toLowerCase();

    if (themaLower.includes(queryLower) || contentLower.includes(queryLower)) {
      let preview = '';
      const idx = contentLower.indexOf(queryLower);

      if (idx !== -1) {
        const start = Math.max(0, idx - 50);
        const end = Math.min(content.length, idx + query.length + 50);
        preview = (start > 0 ? '...' : '') +
          content.substring(start, idx) +
          '<mark>' + content.substring(idx, idx + query.length) + '</mark>' +
          content.substring(idx + query.length, end) +
          (end < content.length ? '...' : '');
      } else {
        preview = content.substring(0, 100) + (content.length > 100 ? '...' : '');
      }

      results.push({
        oberkategorie,
        unterkategorie,
        thema,
        preview: preview.replace(/\n/g, ' ')
      });
    }
  }

  return results;
}

// =============================================================================
// Backup & Restore
// =============================================================================

export function createBackup() {
  return {
    version: 1,
    created: new Date().toISOString(),
    notes: getAllNotes().map(note => ({
      ...note,
      content: readNote(note.oberkategorie, note.unterkategorie, note.thema) || ''
    }))
  };
}

export function saveBackupToFile(filePath) {
  const backup = createBackup();
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(backup, null, 2));
  return backup.notes.length;
}

export function loadBackupFromFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

export function restoreFromBackup(backupData) {
  let restored = 0;
  for (const note of backupData.notes) {
    saveNote(note.oberkategorie, note.unterkategorie, note.thema, note.content);
    restored++;
  }
  return restored;
}

// =============================================================================
// Configuration
// =============================================================================

export function loadConfig() {
  if (!fs.existsSync(CONFIG.configFile)) return {};
  try {
    return JSON.parse(fs.readFileSync(CONFIG.configFile, 'utf-8'));
  } catch {
    return {};
  }
}

export function saveConfig(config) {
  ensureDir(CONFIG.baseDir);
  fs.writeFileSync(CONFIG.configFile, JSON.stringify(config, null, 2));
}

export function getSyncPath() {
  return loadConfig().syncPath || null;
}

export function setSyncPath(syncPath) {
  const config = loadConfig();
  config.syncPath = syncPath;
  saveConfig(config);
}

export function syncToPath(syncPath) {
  const backupFile = path.join(syncPath, 'wasibase-backup.json');
  return saveBackupToFile(backupFile);
}
