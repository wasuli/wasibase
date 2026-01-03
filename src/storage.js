import fs from 'fs';
import path from 'path';
import { CONFIG } from './config.js';

export function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

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

export function getNotes(oberkategorie, unterkategorie) {
  const dir = path.join(CONFIG.notesDir, oberkategorie, unterkategorie);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''))
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

export function saveNote(oberkategorie, unterkategorie, thema, content) {
  const dir = path.join(CONFIG.notesDir, oberkategorie, unterkategorie);
  ensureDir(dir);
  const filePath = path.join(dir, `${thema}.md`);
  fs.writeFileSync(filePath, content);
  return filePath;
}

export function getNotePath(oberkategorie, unterkategorie, thema) {
  return path.join(CONFIG.notesDir, oberkategorie, unterkategorie, `${thema}.md`);
}

export function noteExists(oberkategorie, unterkategorie, thema) {
  return fs.existsSync(getNotePath(oberkategorie, unterkategorie, thema));
}

export function readNote(oberkategorie, unterkategorie, thema) {
  const filePath = getNotePath(oberkategorie, unterkategorie, thema);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8');
  }
  return null;
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

export function deleteNote(oberkategorie, unterkategorie, thema) {
  const filePath = getNotePath(oberkategorie, unterkategorie, thema);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

export function searchNotes(query) {
  const results = [];
  const queryLower = query.toLowerCase();

  const oberkategorien = getOberkategorien();

  for (const ober of oberkategorien) {
    const unterkategorien = getUnterkategorien(ober);

    for (const unter of unterkategorien) {
      const notes = getNotes(ober, unter);

      for (const note of notes) {
        const content = readNote(ober, unter, note);
        if (!content) continue;

        const contentLower = content.toLowerCase();
        const noteLower = note.toLowerCase();

        if (noteLower.includes(queryLower) || contentLower.includes(queryLower)) {
          // Finde Kontext um den Treffer
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
            oberkategorie: ober,
            unterkategorie: unter,
            thema: note,
            preview: preview.replace(/\n/g, ' ')
          });
        }
      }
    }
  }

  return results;
}
