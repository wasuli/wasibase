# Wasibase

> Dein Second Brain. Terminal-basiert. Mit Backlinks.

Ein terminal-basiertes Notizen-System mit Markdown-Unterstuetzung, Backlinks und Graph-Visualisierung.

## Installation

```bash
npm install -g wasibase
```

## Verwendung

```bash
# Hauptmenu oeffnen
wasibase

# Neue Note erstellen oder bearbeiten
wasibase note

# Notes durchsuchen
wasibase search

# Wissens-Graph anzeigen
wasibase graph

# Backup erstellen/wiederherstellen
wasibase backup

# Mit Cloud synchronisieren (Proton Drive, Dropbox, iCloud)
wasibase sync
```

## Features

- **Markdown Notes** - Schreibe deine Notizen in Markdown mit Live-Vorschau
- **Backlinks** - Verknuepfe Wissen mit `[[Backlinks]]` wie in Obsidian
- **Graph View** - Visualisiere dein Wissen als interaktiven Graph
- **Schnelle Suche** - Finde jede Note sofort
- **Cloud Backup** - Automatisches Backup zu Proton Drive, Dropbox oder iCloud
- **Terminal First** - Schnell und effizient direkt aus dem Terminal

## Struktur

Notes werden in `~/.wasibase/notes/` gespeichert:

```
~/.wasibase/
├── notes/
│   ├── Oberkategorie/
│   │   └── Unterkategorie/
│   │       └── Note.md
├── backups/
└── config.json
```

## Systemanforderungen

- Node.js 18+
- macOS, Linux oder Windows

## Lizenz

MIT

## Autor

[Wasili](https://github.com/wasuli)
