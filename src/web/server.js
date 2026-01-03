import express from 'express';
import { marked } from 'marked';
import * as storage from '../storage.js';

export function startServer(config, callback) {
  const app = express();
  app.use(express.json());

  let serverInstance = null;
  const { oberkategorie, unterkategorie, port = 3333 } = config;

  app.get('/', (req, res) => {
    res.send(getEditorHTML(oberkategorie, unterkategorie));
  });

  app.post('/preview', (req, res) => {
    const { markdown } = req.body;
    const html = marked(markdown || '');
    res.json({ html });
  });

  app.post('/save', (req, res) => {
    const { oberkategorie, unterkategorie, thema, content } = req.body;

    if (!thema || !thema.trim()) {
      return res.status(400).json({ error: 'Thema fehlt' });
    }

    const datum = new Date().toLocaleDateString('de-DE');
    const fullContent = `---
Oberkategorie: ${oberkategorie}
Unterkategorie: ${unterkategorie}
Thema: ${thema.trim()}
Erstellt: ${datum}
---

${content}`;

    storage.createOberkategorie(oberkategorie);
    storage.createUnterkategorie(oberkategorie, unterkategorie);
    storage.saveNote(oberkategorie, unterkategorie, thema.trim(), fullContent);

    res.json({ success: true, path: `${oberkategorie}/${unterkategorie}/${thema}` });

    setTimeout(() => {
      if (serverInstance) serverInstance.close();
      if (callback) callback({ saved: true, thema: thema.trim() });
    }, 500);
  });

  app.post('/cancel', (req, res) => {
    res.json({ success: true });
    setTimeout(() => {
      if (serverInstance) serverInstance.close();
      if (callback) callback({ saved: false });
    }, 200);
  });

  // Auto-Save Endpunkt
  app.post('/autosave', (req, res) => {
    const { oberkategorie, unterkategorie, thema, content } = req.body;

    if (!thema || !thema.trim()) {
      return res.json({ success: false, reason: 'no_thema' });
    }

    const datum = new Date().toLocaleDateString('de-DE');
    const fullContent = `---
Oberkategorie: ${oberkategorie}
Unterkategorie: ${unterkategorie}
Thema: ${thema.trim()}
Erstellt: ${datum}
---

${content}`;

    storage.createOberkategorie(oberkategorie);
    storage.createUnterkategorie(oberkategorie, unterkategorie);
    storage.saveNote(oberkategorie, unterkategorie, thema.trim(), fullContent);

    res.json({ success: true, savedAt: new Date().toLocaleTimeString('de-DE') });
  });

  serverInstance = app.listen(port);
  return { port, close: () => serverInstance.close() };
}

export function startEditServer(config, callback) {
  const app = express();
  app.use(express.json());

  let serverInstance = null;
  const { oberkategorie, unterkategorie, thema, content, port = 3333 } = config;

  // Extrahiere nur den Inhalt ohne YAML Frontmatter
  const contentWithoutFrontmatter = content ? content.replace(/^---[\s\S]*?---\n?/, '').trim() : '';

  app.get('/', (req, res) => {
    res.send(getEditHTML(oberkategorie, unterkategorie, thema, contentWithoutFrontmatter));
  });

  app.post('/preview', (req, res) => {
    const { markdown } = req.body;
    const html = marked(markdown || '');
    res.json({ html });
  });

  app.post('/save', (req, res) => {
    const { oberkategorie, unterkategorie, thema, content } = req.body;

    if (!thema || !thema.trim()) {
      return res.status(400).json({ error: 'Thema fehlt' });
    }

    const datum = new Date().toLocaleDateString('de-DE');
    const fullContent = `---
Oberkategorie: ${oberkategorie}
Unterkategorie: ${unterkategorie}
Thema: ${thema.trim()}
Erstellt: ${datum}
---

${content}`;

    storage.saveNote(oberkategorie, unterkategorie, thema.trim(), fullContent);

    res.json({ success: true, path: `${oberkategorie}/${unterkategorie}/${thema}` });

    setTimeout(() => {
      if (serverInstance) serverInstance.close();
      if (callback) callback({ saved: true, thema: thema.trim() });
    }, 500);
  });

  app.post('/cancel', (req, res) => {
    res.json({ success: true });
    setTimeout(() => {
      if (serverInstance) serverInstance.close();
      if (callback) callback({ saved: false });
    }, 200);
  });

  app.post('/autosave', (req, res) => {
    const { oberkategorie, unterkategorie, thema, content } = req.body;

    if (!thema || !thema.trim()) {
      return res.json({ success: false, reason: 'no_thema' });
    }

    const datum = new Date().toLocaleDateString('de-DE');
    const fullContent = `---
Oberkategorie: ${oberkategorie}
Unterkategorie: ${unterkategorie}
Thema: ${thema.trim()}
Erstellt: ${datum}
---

${content}`;

    storage.saveNote(oberkategorie, unterkategorie, thema.trim(), fullContent);

    res.json({ success: true, savedAt: new Date().toLocaleTimeString('de-DE') });
  });

  serverInstance = app.listen(port);
  return { port, close: () => serverInstance.close() };
}

export function startSearchServer(config, callback) {
  const app = express();
  app.use(express.json());

  let serverInstance = null;
  const { port = 3334 } = config;

  app.get('/', (req, res) => {
    res.send(getSearchHTML());
  });

  app.post('/search', (req, res) => {
    const { query } = req.body;
    if (!query || !query.trim()) {
      return res.json({ results: [] });
    }

    const results = storage.searchNotes(query.trim());
    res.json({ results });
  });

  app.post('/close', (req, res) => {
    res.json({ success: true });
    setTimeout(() => {
      if (serverInstance) serverInstance.close();
      if (callback) callback();
    }, 200);
  });

  serverInstance = app.listen(port);
  return { port, close: () => serverInstance.close() };
}

function getEditorHTML(oberkategorie, unterkategorie) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wasibase</title>
  <script src="https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js"></script>
  <style>
    :root {
      --bg-primary: #0a0a0a;
      --bg-secondary: #141414;
      --bg-tertiary: #1a1a1a;
      --border: #262626;
      --text-primary: #e5e5e5;
      --text-secondary: #a3a3a3;
      --text-muted: #737373;
      --text-faint: #525252;
      --code-bg: #1a1a1a;
      --code-color: #f472b6;
    }

    [data-theme="light"] {
      --bg-primary: #ffffff;
      --bg-secondary: #f5f5f5;
      --bg-tertiary: #e5e5e5;
      --border: #d4d4d4;
      --text-primary: #171717;
      --text-secondary: #404040;
      --text-muted: #737373;
      --text-faint: #a3a3a3;
      --code-bg: #f5f5f5;
      --code-color: #db2777;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      height: 100vh;
      display: flex;
      flex-direction: column;
      transition: background 0.2s, color 0.2s;
    }

    header {
      background: var(--bg-secondary);
      padding: 12px 20px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .logo {
      font-size: 18px;
      font-weight: 700;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .breadcrumb {
      color: var(--text-muted);
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .breadcrumb span { color: var(--text-secondary); }
    .breadcrumb .sep { color: var(--text-faint); }

    .header-right {
      margin-left: auto;
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .theme-toggle {
      background: var(--bg-tertiary);
      border: 1px solid var(--border);
      color: var(--text-secondary);
      padding: 6px 10px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.15s;
    }

    .theme-toggle:hover {
      background: var(--border);
    }

    button {
      padding: 8px 14px;
      border-radius: 8px;
      border: none;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .btn-secondary {
      background: var(--bg-tertiary);
      color: var(--text-secondary);
      border: 1px solid var(--border);
    }

    .btn-secondary:hover { background: var(--border); color: var(--text-primary); }

    .btn-primary {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      color: white;
    }

    .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
    .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

    .btn-done {
      background: linear-gradient(135deg, #22c55e, #16a34a);
      color: white;
    }

    .btn-done:hover { opacity: 0.9; transform: translateY(-1px); }

    .meta-bar {
      background: var(--bg-secondary);
      padding: 10px 20px;
      border-bottom: 1px solid var(--border);
      display: flex;
      gap: 20px;
      align-items: center;
    }

    .meta-field {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .meta-field label {
      color: var(--text-muted);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .meta-field input {
      background: var(--bg-primary);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 8px 12px;
      color: var(--text-primary);
      font-size: 14px;
      transition: all 0.15s;
    }

    .meta-field input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .meta-field input[readonly] {
      color: var(--text-muted);
      background: var(--bg-secondary);
      border-color: transparent;
    }

    #thema { width: 280px; }

    .toolbar {
      background: var(--bg-secondary);
      padding: 8px 20px;
      border-bottom: 1px solid var(--border);
      display: flex;
      gap: 4px;
    }

    .toolbar button {
      padding: 6px 10px;
      background: transparent;
      color: var(--text-muted);
      border-radius: 6px;
    }

    .toolbar button:hover {
      background: var(--border);
      color: var(--text-primary);
    }

    .toolbar .sep {
      width: 1px;
      background: var(--border);
      margin: 0 8px;
    }

    main {
      flex: 1;
      display: flex;
      overflow: hidden;
    }

    .editor-pane, .preview-pane {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .pane-header {
      padding: 10px 16px;
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border);
      font-size: 11px;
      color: var(--text-faint);
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }

    .editor-pane { border-right: 1px solid var(--border); }

    #editor {
      flex: 1;
      width: 100%;
      background: var(--bg-primary);
      color: var(--text-primary);
      border: none;
      padding: 20px;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 14px;
      line-height: 1.7;
      resize: none;
      tab-size: 2;
    }

    #editor:focus { outline: none; }
    #editor::placeholder { color: var(--text-faint); }

    #preview {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      line-height: 1.7;
      background: var(--bg-primary);
    }

    #preview h1 { font-size: 2em; margin-bottom: 16px; color: var(--text-primary); font-weight: 700; }
    #preview h2 { font-size: 1.5em; margin: 32px 0 12px; color: var(--text-primary); font-weight: 600; border-bottom: 1px solid var(--border); padding-bottom: 8px; }
    #preview h3 { font-size: 1.25em; margin: 24px 0 8px; color: var(--text-primary); font-weight: 600; }
    #preview p { margin-bottom: 16px; color: var(--text-secondary); }
    #preview strong { color: var(--text-primary); font-weight: 600; }
    #preview em { color: var(--text-secondary); }
    #preview ul, #preview ol { margin: 16px 0; padding-left: 24px; color: var(--text-secondary); }
    #preview li { margin: 8px 0; }
    #preview code { background: var(--code-bg); padding: 3px 8px; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--code-color); }
    #preview pre { background: var(--bg-secondary); padding: 16px; border-radius: 8px; overflow-x: auto; margin: 16px 0; border: 1px solid var(--border); }
    #preview pre code { background: none; padding: 0; color: var(--text-primary); }
    #preview blockquote { border-left: 3px solid #3b82f6; padding-left: 16px; color: var(--text-muted); margin: 16px 0; font-style: italic; }
    #preview a { color: #3b82f6; text-decoration: none; }
    #preview a:hover { text-decoration: underline; }
    #preview hr { border: none; border-top: 1px solid var(--border); margin: 32px 0; }
    #preview img { max-width: 100%; border-radius: 8px; }

    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      color: var(--text-primary);
      padding: 14px 20px;
      border-radius: 10px;
      font-size: 14px;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .toast.show { opacity: 1; transform: translateY(0); }
    .toast.success { border-color: #22c55e; }
    .toast.success::before { content: ''; display: block; width: 8px; height: 8px; background: #22c55e; border-radius: 50%; }
    .toast.error { border-color: #ef4444; }
    .toast.error::before { content: ''; display: block; width: 8px; height: 8px; background: #ef4444; border-radius: 50%; }

    .shortcut {
      font-size: 11px;
      color: var(--text-faint);
      background: var(--bg-tertiary);
      padding: 2px 6px;
      border-radius: 4px;
      margin-left: 4px;
    }

    .symbol-dropdown {
      position: relative;
    }

    .symbol-panel {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
      z-index: 100;
      width: 320px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      max-height: 400px;
      overflow-y: auto;
    }

    .symbol-panel.show { display: block; }

    .symbol-category {
      font-size: 11px;
      color: var(--text-faint);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 12px 0 8px;
      font-weight: 600;
    }

    .symbol-category:first-child { margin-top: 0; }

    .symbol-grid {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 4px;
    }

    .symbol-grid button {
      padding: 8px;
      font-size: 16px;
      background: var(--bg-primary);
      border: 1px solid var(--border);
      border-radius: 6px;
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.1s;
    }

    .symbol-grid button:hover {
      background: #3b82f6;
      border-color: #3b82f6;
      color: white;
      transform: scale(1.1);
    }

    .save-status {
      font-size: 12px;
      padding: 4px 10px;
      border-radius: 6px;
      margin-left: auto;
      margin-right: 8px;
    }

    .save-status.saved {
      color: #22c55e;
      background: rgba(34, 197, 94, 0.1);
    }

    .save-status.unsaved {
      color: #f59e0b;
      background: rgba(245, 158, 11, 0.1);
    }

    .save-status.saving {
      color: #3b82f6;
      background: rgba(59, 130, 246, 0.1);
    }
  </style>
</head>
<body>
  <header>
    <div class="logo">Wasibase</div>
    <div class="breadcrumb">
      <span>${oberkategorie}</span>
      <span class="sep">/</span>
      <span>${unterkategorie}</span>
    </div>
    <div class="header-right">
      <button class="theme-toggle" onclick="toggleTheme()" title="Theme wechseln" id="themeBtn">🌙</button>
      <span class="save-status" id="saveStatus"></span>
      <button class="btn-secondary" onclick="cancel()">Abbrechen</button>
      <button class="btn-primary" id="saveBtn" onclick="save()" disabled>Speichern <span class="shortcut">⌘S</span></button>
      <button class="btn-done" id="doneBtn" onclick="done()">Beenden <span class="shortcut">Esc</span></button>
    </div>
  </header>

  <div class="meta-bar">
    <div class="meta-field">
      <label>Thema</label>
      <input type="text" id="thema" placeholder="Name der Note eingeben..." autofocus>
    </div>
    <input type="hidden" id="oberkategorie" value="${oberkategorie}">
    <input type="hidden" id="unterkategorie" value="${unterkategorie}">
  </div>

  <div class="toolbar">
    <button onclick="insertFormat('**', '**')" title="Fett (Cmd+B)"><b>B</b></button>
    <button onclick="insertFormat('*', '*')" title="Kursiv (Cmd+I)"><i>I</i></button>
    <button onclick="insertFormat('~~', '~~')" title="Durchgestrichen"><s>S</s></button>
    <div class="sep"></div>
    <button onclick="insertLine('# ')" title="Ueberschrift 1">H1</button>
    <button onclick="insertLine('## ')" title="Ueberschrift 2">H2</button>
    <button onclick="insertLine('### ')" title="Ueberschrift 3">H3</button>
    <div class="sep"></div>
    <button onclick="insertLine('- ')" title="Liste">• Liste</button>
    <button onclick="insertLine('1. ')" title="Nummerierte Liste">1. Liste</button>
    <button onclick="insertLine('> ')" title="Zitat">" Zitat</button>
    <div class="sep"></div>
    <button onclick="insertFormat('\`', '\`')" title="Code">&lt;/&gt;</button>
    <button onclick="insertCodeBlock()" title="Code-Block">Code</button>
    <button onclick="insertFormat('[', '](url)')" title="Link">Link</button>
    <div class="sep"></div>
    <button onclick="insertFormat('[[', ']]')" title="Backlink">[[Link]]</button>
    <div class="sep"></div>
    <div class="symbol-dropdown">
      <button onclick="toggleSymbols()" title="Mathematische Symbole">∑ Math</button>
      <div class="symbol-panel" id="symbolPanel">
        <div class="symbol-category">Griechisch</div>
        <div class="symbol-grid">
          <button onclick="insertSymbol('α')">α</button>
          <button onclick="insertSymbol('β')">β</button>
          <button onclick="insertSymbol('γ')">γ</button>
          <button onclick="insertSymbol('δ')">δ</button>
          <button onclick="insertSymbol('ε')">ε</button>
          <button onclick="insertSymbol('θ')">θ</button>
          <button onclick="insertSymbol('λ')">λ</button>
          <button onclick="insertSymbol('μ')">μ</button>
          <button onclick="insertSymbol('π')">π</button>
          <button onclick="insertSymbol('σ')">σ</button>
          <button onclick="insertSymbol('φ')">φ</button>
          <button onclick="insertSymbol('ω')">ω</button>
          <button onclick="insertSymbol('Γ')">Γ</button>
          <button onclick="insertSymbol('Δ')">Δ</button>
          <button onclick="insertSymbol('Θ')">Θ</button>
          <button onclick="insertSymbol('Λ')">Λ</button>
          <button onclick="insertSymbol('Σ')">Σ</button>
          <button onclick="insertSymbol('Φ')">Φ</button>
          <button onclick="insertSymbol('Ω')">Ω</button>
        </div>
        <div class="symbol-category">Operatoren</div>
        <div class="symbol-grid">
          <button onclick="insertSymbol('±')">±</button>
          <button onclick="insertSymbol('×')">×</button>
          <button onclick="insertSymbol('÷')">÷</button>
          <button onclick="insertSymbol('·')">·</button>
          <button onclick="insertSymbol('∞')">∞</button>
          <button onclick="insertSymbol('√')">√</button>
          <button onclick="insertSymbol('∫')">∫</button>
          <button onclick="insertSymbol('∂')">∂</button>
          <button onclick="insertSymbol('∇')">∇</button>
          <button onclick="insertSymbol('∑')">∑</button>
          <button onclick="insertSymbol('∏')">∏</button>
        </div>
        <div class="symbol-category">Relationen</div>
        <div class="symbol-grid">
          <button onclick="insertSymbol('≠')">≠</button>
          <button onclick="insertSymbol('≈')">≈</button>
          <button onclick="insertSymbol('≤')">≤</button>
          <button onclick="insertSymbol('≥')">≥</button>
          <button onclick="insertSymbol('≡')">≡</button>
          <button onclick="insertSymbol('∝')">∝</button>
          <button onclick="insertSymbol('⊂')">⊂</button>
          <button onclick="insertSymbol('⊃')">⊃</button>
          <button onclick="insertSymbol('∈')">∈</button>
          <button onclick="insertSymbol('∉')">∉</button>
          <button onclick="insertSymbol('∪')">∪</button>
          <button onclick="insertSymbol('∩')">∩</button>
        </div>
        <div class="symbol-category">Matrix / Vektor</div>
        <div class="symbol-grid">
          <button onclick="insertSymbol('ᵀ')" title="Transponiert">ᵀ</button>
          <button onclick="insertSymbol('⁻¹')" title="Inverse">⁻¹</button>
          <button onclick="insertSymbol('→')">→</button>
          <button onclick="insertSymbol('⟨')">⟨</button>
          <button onclick="insertSymbol('⟩')">⟩</button>
          <button onclick="insertSymbol('‖')">‖</button>
          <button onclick="insertSymbol('⊗')">⊗</button>
          <button onclick="insertSymbol('⊕')">⊕</button>
        </div>
        <div class="symbol-category">Lineare Algebra</div>
        <div class="symbol-grid">
          <button onclick="insertSymbol('ᵀ')" title="Transponiert">ᵀ</button>
          <button onclick="insertSymbol('⁻¹')" title="Inverse">⁻¹</button>
          <button onclick="insertSymbol('det')" title="Determinante">det</button>
          <button onclick="insertSymbol('tr')" title="Spur">tr</button>
          <button onclick="insertSymbol('rk')" title="Rang">rk</button>
          <button onclick="insertSymbol('ker')" title="Kern">ker</button>
          <button onclick="insertSymbol('im')" title="Bild">im</button>
          <button onclick="insertSymbol('dim')" title="Dimension">dim</button>
          <button onclick="insertSymbol('span')" title="Aufspann">span</button>
          <button onclick="insertSymbol('⊥')" title="Orthogonal">⊥</button>
          <button onclick="insertSymbol('‖')" title="Norm">‖</button>
          <button onclick="insertSymbol('⟨')" title="Skalarprodukt">&lt;</button>
          <button onclick="insertSymbol('⟩')" title="Skalarprodukt">&gt;</button>
          <button onclick="insertSymbol('⊗')" title="Tensorprodukt">⊗</button>
          <button onclick="insertSymbol('⊕')" title="Direkte Summe">⊕</button>
          <button onclick="insertSymbol('→')" title="Abbildung">→</button>
        </div>
        <div class="symbol-category">Hoch-/Tiefgestellt</div>
        <div class="symbol-grid">
          <button onclick="insertSymbol('⁰')">⁰</button>
          <button onclick="insertSymbol('¹')">¹</button>
          <button onclick="insertSymbol('²')">²</button>
          <button onclick="insertSymbol('³')">³</button>
          <button onclick="insertSymbol('ⁿ')">ⁿ</button>
          <button onclick="insertSymbol('₀')">₀</button>
          <button onclick="insertSymbol('₁')">₁</button>
          <button onclick="insertSymbol('₂')">₂</button>
          <button onclick="insertSymbol('ᵢ')">ᵢ</button>
          <button onclick="insertSymbol('ⱼ')">ⱼ</button>
          <button onclick="insertSymbol('ₙ')">ₙ</button>
          <button onclick="insertSymbol('ₘ')">ₘ</button>
        </div>
      </div>
    </div>
  </div>

  <main>
    <div class="editor-pane">
      <div class="pane-header">Editor</div>
      <textarea id="editor" placeholder="Beginne zu schreiben...

Markdown-Syntax:
# Ueberschrift
**fett** und *kursiv*
- Aufzaehlung
> Zitat
\`code\`

Backlinks zu anderen Notes:
[[Anderes Thema]]"></textarea>
    </div>
    <div class="preview-pane">
      <div class="pane-header">Vorschau</div>
      <div id="preview"></div>
    </div>
  </main>

  <div class="toast" id="toast"></div>

  <script>
    const editor = document.getElementById('editor');
    const preview = document.getElementById('preview');
    const themaInput = document.getElementById('thema');
    const saveBtn = document.getElementById('saveBtn');
    const toast = document.getElementById('toast');

    let debounceTimer;

    editor.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(updatePreview, 100);
    });

    themaInput.addEventListener('input', () => {
      saveBtn.disabled = !themaInput.value.trim();
    });

    async function updatePreview() {
      const res = await fetch('/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown: editor.value })
      });
      const { html } = await res.json();
      preview.innerHTML = DOMPurify.sanitize(html);
    }

    function insertFormat(before, after) {
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      const text = editor.value;
      const selected = text.substring(start, end) || 'text';
      editor.value = text.substring(0, start) + before + selected + after + text.substring(end);
      editor.focus();
      editor.selectionStart = start + before.length;
      editor.selectionEnd = start + before.length + selected.length;
      updatePreview();
    }

    function insertLine(prefix) {
      const start = editor.selectionStart;
      const text = editor.value;
      const lineStart = text.lastIndexOf('\\n', start - 1) + 1;
      editor.value = text.substring(0, lineStart) + prefix + text.substring(lineStart);
      editor.focus();
      editor.selectionStart = editor.selectionEnd = lineStart + prefix.length;
      updatePreview();
    }

    function insertCodeBlock() {
      insertFormat('\\n\`\`\`\\n', '\\n\`\`\`\\n');
    }

    function toggleSymbols() {
      document.getElementById('symbolPanel').classList.toggle('show');
    }

    function insertSymbol(symbol) {
      const start = editor.selectionStart;
      editor.value = editor.value.substring(0, start) + symbol + editor.value.substring(editor.selectionEnd);
      editor.focus();
      editor.selectionStart = editor.selectionEnd = start + symbol.length;
      updatePreview();
    }

    // Schliesse Symbol-Panel bei Klick ausserhalb
    document.addEventListener('click', (e) => {
      const panel = document.getElementById('symbolPanel');
      const dropdown = e.target.closest('.symbol-dropdown');
      if (!dropdown && panel.classList.contains('show')) {
        panel.classList.remove('show');
      }
    });

    async function save() {
      const thema = themaInput.value.trim();
      if (!thema) {
        showToast('Bitte Thema eingeben', 'error');
        return false;
      }

      const res = await fetch('/autosave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oberkategorie: document.getElementById('oberkategorie').value,
          unterkategorie: document.getElementById('unterkategorie').value,
          thema,
          content: editor.value
        })
      });

      const data = await res.json();
      if (data.success) {
        lastSavedContent = editor.value;
        lastSavedThema = thema;
        hasUnsavedChanges = false;
        showToast('Gespeichert!', 'success');
        updateSaveStatus();
        return true;
      } else {
        showToast(data.error || 'Fehler', 'error');
        return false;
      }
    }

    async function done() {
      if (themaInput.value.trim() && editor.value) {
        await save();
      }
      await fetch('/cancel', { method: 'POST' });
      window.close();
    }

    async function cancel() {
      await fetch('/cancel', { method: 'POST' });
      window.close();
    }

    function showToast(message, type = '') {
      toast.textContent = message;
      toast.className = 'toast show ' + type;
      setTimeout(() => toast.className = 'toast', 3000);
    }

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (!saveBtn.disabled) save();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        insertFormat('**', '**');
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        e.preventDefault();
        insertFormat('*', '*');
      }
      if (e.key === 'Escape') done();
      if (e.key === 'Tab' && document.activeElement === editor) {
        e.preventDefault();
        const start = editor.selectionStart;
        editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(editor.selectionEnd);
        editor.selectionStart = editor.selectionEnd = start + 2;
      }
    });

    // Auto-Save
    let lastSavedContent = '';
    let lastSavedThema = '';
    let autoSaveTimer;
    let hasUnsavedChanges = false;

    function checkForChanges() {
      const currentContent = editor.value;
      const currentThema = themaInput.value.trim();
      hasUnsavedChanges = (currentContent !== lastSavedContent || currentThema !== lastSavedThema);
      updateSaveStatus();
    }

    function updateSaveStatus() {
      const status = document.getElementById('saveStatus');
      if (!status) return;

      if (hasUnsavedChanges && themaInput.value.trim()) {
        status.textContent = 'Ungespeichert';
        status.className = 'save-status unsaved';
      } else if (lastSavedContent) {
        status.textContent = 'Gespeichert';
        status.className = 'save-status saved';
      } else {
        status.textContent = '';
        status.className = 'save-status';
      }
    }

    async function autoSave() {
      const thema = themaInput.value.trim();
      const content = editor.value;

      if (!thema || !content) return;
      if (content === lastSavedContent && thema === lastSavedThema) return;

      const status = document.getElementById('saveStatus');
      if (status) {
        status.textContent = 'Speichert...';
        status.className = 'save-status saving';
      }

      try {
        const res = await fetch('/autosave', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            oberkategorie: document.getElementById('oberkategorie').value,
            unterkategorie: document.getElementById('unterkategorie').value,
            thema,
            content
          })
        });

        const data = await res.json();
        if (data.success) {
          lastSavedContent = content;
          lastSavedThema = thema;
          hasUnsavedChanges = false;
          if (status) {
            status.textContent = 'Gespeichert ' + data.savedAt;
            status.className = 'save-status saved';
          }
        }
      } catch (e) {
        console.error('Auto-save failed:', e);
      }
    }

    // Trigger auto-save on changes
    editor.addEventListener('input', () => {
      checkForChanges();
      clearTimeout(autoSaveTimer);
      autoSaveTimer = setTimeout(autoSave, 3000);
    });

    themaInput.addEventListener('input', () => {
      saveBtn.disabled = !themaInput.value.trim();
      checkForChanges();
      clearTimeout(autoSaveTimer);
      autoSaveTimer = setTimeout(autoSave, 3000);
    });

    // Warnung beim Schliessen
    window.addEventListener('beforeunload', (e) => {
      if (hasUnsavedChanges && themaInput.value.trim()) {
        e.preventDefault();
        e.returnValue = '';
      }
    });

    // Theme Toggle
    function toggleTheme() {
      const html = document.documentElement;
      const btn = document.getElementById('themeBtn');
      const currentTheme = html.getAttribute('data-theme');

      if (currentTheme === 'light') {
        html.removeAttribute('data-theme');
        btn.textContent = '🌙';
        localStorage.setItem('wasibase-theme', 'dark');
      } else {
        html.setAttribute('data-theme', 'light');
        btn.textContent = '☀️';
        localStorage.setItem('wasibase-theme', 'light');
      }
    }

    // Theme beim Laden wiederherstellen
    (function() {
      const savedTheme = localStorage.getItem('wasibase-theme');
      const btn = document.getElementById('themeBtn');
      if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        btn.textContent = '☀️';
      }
    })();

    themaInput.focus();
  </script>
</body>
</html>`;
}

function getEditHTML(oberkategorie, unterkategorie, thema, content) {
  const escapedContent = content.replace(/`/g, '\\`').replace(/\$/g, '\\$');
  const escapedThema = thema.replace(/'/g, "\\'").replace(/"/g, '&quot;');

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bearbeiten: ${thema} - Wasibase</title>
  <script src="https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js"></script>
  <style>
    :root {
      --bg-primary: #0a0a0a;
      --bg-secondary: #141414;
      --bg-tertiary: #1a1a1a;
      --border: #262626;
      --text-primary: #e5e5e5;
      --text-secondary: #a3a3a3;
      --text-muted: #737373;
      --text-faint: #525252;
      --code-bg: #1a1a1a;
      --code-color: #f472b6;
    }

    [data-theme="light"] {
      --bg-primary: #ffffff;
      --bg-secondary: #f5f5f5;
      --bg-tertiary: #e5e5e5;
      --border: #d4d4d4;
      --text-primary: #171717;
      --text-secondary: #404040;
      --text-muted: #737373;
      --text-faint: #a3a3a3;
      --code-bg: #f5f5f5;
      --code-color: #db2777;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      height: 100vh;
      display: flex;
      flex-direction: column;
      transition: background 0.2s, color 0.2s;
    }

    header {
      background: var(--bg-secondary);
      padding: 12px 20px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .logo {
      font-size: 18px;
      font-weight: 700;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .breadcrumb {
      color: var(--text-muted);
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .breadcrumb span { color: var(--text-secondary); }
    .breadcrumb .sep { color: var(--text-faint); }

    .header-right {
      margin-left: auto;
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .theme-toggle {
      background: var(--bg-tertiary);
      border: 1px solid var(--border);
      color: var(--text-secondary);
      padding: 6px 10px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.15s;
    }

    .theme-toggle:hover {
      background: var(--border);
    }

    button {
      padding: 8px 14px;
      border-radius: 8px;
      border: none;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .btn-secondary {
      background: var(--bg-tertiary);
      color: var(--text-secondary);
      border: 1px solid var(--border);
    }

    .btn-secondary:hover { background: var(--border); color: var(--text-primary); }

    .btn-primary {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
    }

    .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }

    .btn-done {
      background: linear-gradient(135deg, #22c55e, #16a34a);
      color: white;
    }

    .btn-done:hover { opacity: 0.9; transform: translateY(-1px); }

    .meta-bar {
      background: var(--bg-secondary);
      padding: 10px 20px;
      border-bottom: 1px solid var(--border);
      display: flex;
      gap: 20px;
      align-items: center;
    }

    .meta-field {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .meta-field label {
      color: var(--text-muted);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .meta-field input {
      background: var(--bg-primary);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 8px 12px;
      color: var(--text-primary);
      font-size: 14px;
      transition: all 0.15s;
    }

    .meta-field input:focus {
      outline: none;
      border-color: #f59e0b;
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
    }

    #thema { width: 280px; }

    .edit-badge {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
      font-size: 10px;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .toolbar {
      background: var(--bg-secondary);
      padding: 8px 20px;
      border-bottom: 1px solid var(--border);
      display: flex;
      gap: 4px;
    }

    .toolbar button {
      padding: 6px 10px;
      background: transparent;
      color: var(--text-muted);
      border-radius: 6px;
    }

    .toolbar button:hover {
      background: var(--border);
      color: var(--text-primary);
    }

    .toolbar .sep {
      width: 1px;
      background: var(--border);
      margin: 0 8px;
    }

    main {
      flex: 1;
      display: flex;
      overflow: hidden;
    }

    .editor-pane, .preview-pane {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .pane-header {
      padding: 10px 16px;
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border);
      font-size: 11px;
      color: var(--text-faint);
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }

    .editor-pane { border-right: 1px solid var(--border); }

    #editor {
      flex: 1;
      width: 100%;
      background: var(--bg-primary);
      color: var(--text-primary);
      border: none;
      padding: 20px;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 14px;
      line-height: 1.7;
      resize: none;
      tab-size: 2;
    }

    #editor:focus { outline: none; }

    #preview {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      line-height: 1.7;
      background: var(--bg-primary);
    }

    #preview h1 { font-size: 2em; margin-bottom: 16px; color: var(--text-primary); font-weight: 700; }
    #preview h2 { font-size: 1.5em; margin: 32px 0 12px; color: var(--text-primary); font-weight: 600; border-bottom: 1px solid var(--border); padding-bottom: 8px; }
    #preview h3 { font-size: 1.25em; margin: 24px 0 8px; color: var(--text-primary); font-weight: 600; }
    #preview p { margin-bottom: 16px; color: var(--text-secondary); }
    #preview strong { color: var(--text-primary); font-weight: 600; }
    #preview em { color: var(--text-secondary); }
    #preview ul, #preview ol { margin: 16px 0; padding-left: 24px; color: var(--text-secondary); }
    #preview li { margin: 8px 0; }
    #preview code { background: var(--code-bg); padding: 3px 8px; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--code-color); }
    #preview pre { background: var(--bg-secondary); padding: 16px; border-radius: 8px; overflow-x: auto; margin: 16px 0; border: 1px solid var(--border); }
    #preview pre code { background: none; padding: 0; color: var(--text-primary); }
    #preview blockquote { border-left: 3px solid #f59e0b; padding-left: 16px; color: var(--text-muted); margin: 16px 0; font-style: italic; }
    #preview a { color: #f59e0b; text-decoration: none; }
    #preview a:hover { text-decoration: underline; }

    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      color: var(--text-primary);
      padding: 14px 20px;
      border-radius: 10px;
      font-size: 14px;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .toast.show { opacity: 1; transform: translateY(0); }
    .toast.success { border-color: #22c55e; }
    .toast.success::before { content: ''; display: block; width: 8px; height: 8px; background: #22c55e; border-radius: 50%; }

    .shortcut {
      font-size: 11px;
      color: var(--text-faint);
      background: var(--bg-tertiary);
      padding: 2px 6px;
      border-radius: 4px;
      margin-left: 4px;
    }

    .symbol-dropdown { position: relative; }

    .symbol-panel {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
      z-index: 100;
      width: 320px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      max-height: 400px;
      overflow-y: auto;
    }

    .symbol-panel.show { display: block; }
    .symbol-category { font-size: 11px; color: var(--text-faint); text-transform: uppercase; letter-spacing: 1px; margin: 12px 0 8px; font-weight: 600; }
    .symbol-category:first-child { margin-top: 0; }
    .symbol-grid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 4px; }
    .symbol-grid button { padding: 8px; font-size: 16px; background: var(--bg-primary); border: 1px solid var(--border); border-radius: 6px; color: var(--text-primary); cursor: pointer; }
    .symbol-grid button:hover { background: #f59e0b; border-color: #f59e0b; color: white; transform: scale(1.1); }

    .save-status {
      font-size: 12px;
      padding: 4px 10px;
      border-radius: 6px;
      margin-left: auto;
      margin-right: 8px;
    }

    .save-status.saved { color: #22c55e; background: rgba(34, 197, 94, 0.1); }
    .save-status.unsaved { color: #f59e0b; background: rgba(245, 158, 11, 0.1); }
    .save-status.saving { color: #3b82f6; background: rgba(59, 130, 246, 0.1); }
  </style>
</head>
<body>
  <header>
    <div class="logo">Wasibase</div>
    <span class="edit-badge">Bearbeiten</span>
    <div class="breadcrumb">
      <span>${oberkategorie}</span>
      <span class="sep">/</span>
      <span>${unterkategorie}</span>
    </div>
    <div class="header-right">
      <button class="theme-toggle" onclick="toggleTheme()" title="Theme wechseln" id="themeBtn">🌙</button>
      <span class="save-status" id="saveStatus"></span>
      <button class="btn-secondary" onclick="cancel()">Schliessen</button>
      <button class="btn-primary" id="saveBtn" onclick="save()">Speichern <span class="shortcut">⌘S</span></button>
      <button class="btn-done" id="doneBtn" onclick="done()">Beenden <span class="shortcut">Esc</span></button>
    </div>
  </header>

  <div class="meta-bar">
    <div class="meta-field">
      <label>Thema</label>
      <input type="text" id="thema" value="${escapedThema}">
    </div>
    <input type="hidden" id="oberkategorie" value="${oberkategorie}">
    <input type="hidden" id="unterkategorie" value="${unterkategorie}">
  </div>

  <div class="toolbar">
    <button onclick="insertFormat('**', '**')" title="Fett"><b>B</b></button>
    <button onclick="insertFormat('*', '*')" title="Kursiv"><i>I</i></button>
    <button onclick="insertFormat('~~', '~~')" title="Durchgestrichen"><s>S</s></button>
    <div class="sep"></div>
    <button onclick="insertLine('# ')">H1</button>
    <button onclick="insertLine('## ')">H2</button>
    <button onclick="insertLine('### ')">H3</button>
    <div class="sep"></div>
    <button onclick="insertLine('- ')">• Liste</button>
    <button onclick="insertLine('1. ')">1. Liste</button>
    <button onclick="insertLine('> ')">" Zitat</button>
    <div class="sep"></div>
    <button onclick="insertFormat('\`', '\`')">&lt;/&gt;</button>
    <button onclick="insertCodeBlock()">Code</button>
    <button onclick="insertFormat('[', '](url)')">Link</button>
    <div class="sep"></div>
    <button onclick="insertFormat('[[', ']]')">[[Link]]</button>
    <div class="sep"></div>
    <div class="symbol-dropdown">
      <button onclick="toggleSymbols()">∑ Math</button>
      <div class="symbol-panel" id="symbolPanel">
        <div class="symbol-category">Griechisch</div>
        <div class="symbol-grid">
          <button onclick="insertSymbol('α')">α</button>
          <button onclick="insertSymbol('β')">β</button>
          <button onclick="insertSymbol('γ')">γ</button>
          <button onclick="insertSymbol('δ')">δ</button>
          <button onclick="insertSymbol('ε')">ε</button>
          <button onclick="insertSymbol('θ')">θ</button>
          <button onclick="insertSymbol('λ')">λ</button>
          <button onclick="insertSymbol('μ')">μ</button>
          <button onclick="insertSymbol('π')">π</button>
          <button onclick="insertSymbol('σ')">σ</button>
          <button onclick="insertSymbol('φ')">φ</button>
          <button onclick="insertSymbol('ω')">ω</button>
          <button onclick="insertSymbol('Σ')">Σ</button>
          <button onclick="insertSymbol('Δ')">Δ</button>
          <button onclick="insertSymbol('Ω')">Ω</button>
        </div>
        <div class="symbol-category">Operatoren</div>
        <div class="symbol-grid">
          <button onclick="insertSymbol('±')">±</button>
          <button onclick="insertSymbol('×')">×</button>
          <button onclick="insertSymbol('÷')">÷</button>
          <button onclick="insertSymbol('∞')">∞</button>
          <button onclick="insertSymbol('√')">√</button>
          <button onclick="insertSymbol('∫')">∫</button>
          <button onclick="insertSymbol('∑')">∑</button>
          <button onclick="insertSymbol('≠')">≠</button>
          <button onclick="insertSymbol('≈')">≈</button>
          <button onclick="insertSymbol('≤')">≤</button>
          <button onclick="insertSymbol('≥')">≥</button>
        </div>
        <div class="symbol-category">Lineare Algebra</div>
        <div class="symbol-grid">
          <button onclick="insertSymbol('ᵀ')" title="Transponiert">ᵀ</button>
          <button onclick="insertSymbol('⁻¹')" title="Inverse">⁻¹</button>
          <button onclick="insertSymbol('det')" title="Determinante">det</button>
          <button onclick="insertSymbol('tr')" title="Spur">tr</button>
          <button onclick="insertSymbol('rk')" title="Rang">rk</button>
          <button onclick="insertSymbol('ker')" title="Kern">ker</button>
          <button onclick="insertSymbol('im')" title="Bild">im</button>
          <button onclick="insertSymbol('dim')" title="Dimension">dim</button>
          <button onclick="insertSymbol('span')" title="Aufspann">span</button>
          <button onclick="insertSymbol('⊥')" title="Orthogonal">⊥</button>
          <button onclick="insertSymbol('‖')" title="Norm">‖</button>
          <button onclick="insertSymbol('⟨')" title="Skalarprodukt">&lt;</button>
          <button onclick="insertSymbol('⟩')" title="Skalarprodukt">&gt;</button>
          <button onclick="insertSymbol('⊗')" title="Tensorprodukt">⊗</button>
          <button onclick="insertSymbol('⊕')" title="Direkte Summe">⊕</button>
          <button onclick="insertSymbol('→')" title="Abbildung">→</button>
        </div>
        <div class="symbol-category">Hoch-/Tiefgestellt</div>
        <div class="symbol-grid">
          <button onclick="insertSymbol('⁰')">⁰</button>
          <button onclick="insertSymbol('¹')">¹</button>
          <button onclick="insertSymbol('²')">²</button>
          <button onclick="insertSymbol('³')">³</button>
          <button onclick="insertSymbol('ⁿ')">ⁿ</button>
          <button onclick="insertSymbol('₀')">₀</button>
          <button onclick="insertSymbol('₁')">₁</button>
          <button onclick="insertSymbol('₂')">₂</button>
          <button onclick="insertSymbol('ᵢ')">ᵢ</button>
          <button onclick="insertSymbol('ⱼ')">ⱼ</button>
          <button onclick="insertSymbol('ₙ')">ₙ</button>
          <button onclick="insertSymbol('ₘ')">ₘ</button>
        </div>
      </div>
    </div>
  </div>

  <main>
    <div class="editor-pane">
      <div class="pane-header">Editor</div>
      <textarea id="editor">${escapedContent}</textarea>
    </div>
    <div class="preview-pane">
      <div class="pane-header">Vorschau</div>
      <div id="preview"></div>
    </div>
  </main>

  <div class="toast" id="toast"></div>

  <script>
    const editor = document.getElementById('editor');
    const preview = document.getElementById('preview');
    const themaInput = document.getElementById('thema');
    const saveBtn = document.getElementById('saveBtn');
    const toast = document.getElementById('toast');

    let lastSavedContent = editor.value;
    let lastSavedThema = themaInput.value;
    let autoSaveTimer;
    let hasUnsavedChanges = false;

    // Initial preview
    updatePreview();

    editor.addEventListener('input', () => {
      checkForChanges();
      clearTimeout(autoSaveTimer);
      autoSaveTimer = setTimeout(autoSave, 3000);
      setTimeout(updatePreview, 100);
    });

    themaInput.addEventListener('input', () => {
      checkForChanges();
      clearTimeout(autoSaveTimer);
      autoSaveTimer = setTimeout(autoSave, 3000);
    });

    async function updatePreview() {
      const res = await fetch('/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown: editor.value })
      });
      const { html } = await res.json();
      preview.innerHTML = DOMPurify.sanitize(html);
    }

    function insertFormat(before, after) {
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      const text = editor.value;
      const selected = text.substring(start, end) || 'text';
      editor.value = text.substring(0, start) + before + selected + after + text.substring(end);
      editor.focus();
      editor.selectionStart = start + before.length;
      editor.selectionEnd = start + before.length + selected.length;
      updatePreview();
    }

    function insertLine(prefix) {
      const start = editor.selectionStart;
      const text = editor.value;
      const lineStart = text.lastIndexOf('\\n', start - 1) + 1;
      editor.value = text.substring(0, lineStart) + prefix + text.substring(lineStart);
      editor.focus();
      editor.selectionStart = editor.selectionEnd = lineStart + prefix.length;
      updatePreview();
    }

    function insertCodeBlock() { insertFormat('\\n\`\`\`\\n', '\\n\`\`\`\\n'); }
    function toggleSymbols() { document.getElementById('symbolPanel').classList.toggle('show'); }
    function insertSymbol(symbol) {
      const start = editor.selectionStart;
      editor.value = editor.value.substring(0, start) + symbol + editor.value.substring(editor.selectionEnd);
      editor.focus();
      editor.selectionStart = editor.selectionEnd = start + symbol.length;
      updatePreview();
    }

    document.addEventListener('click', (e) => {
      const panel = document.getElementById('symbolPanel');
      if (!e.target.closest('.symbol-dropdown') && panel.classList.contains('show')) {
        panel.classList.remove('show');
      }
    });

    function checkForChanges() {
      hasUnsavedChanges = (editor.value !== lastSavedContent || themaInput.value !== lastSavedThema);
      updateSaveStatus();
    }

    function updateSaveStatus() {
      const status = document.getElementById('saveStatus');
      if (hasUnsavedChanges) {
        status.textContent = 'Ungespeichert';
        status.className = 'save-status unsaved';
      } else {
        status.textContent = 'Gespeichert';
        status.className = 'save-status saved';
      }
    }

    async function autoSave() {
      const thema = themaInput.value.trim();
      if (!thema || !editor.value) return;
      if (editor.value === lastSavedContent && thema === lastSavedThema) return;

      const status = document.getElementById('saveStatus');
      status.textContent = 'Speichert...';
      status.className = 'save-status saving';

      try {
        const res = await fetch('/autosave', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            oberkategorie: document.getElementById('oberkategorie').value,
            unterkategorie: document.getElementById('unterkategorie').value,
            thema,
            content: editor.value
          })
        });

        const data = await res.json();
        if (data.success) {
          lastSavedContent = editor.value;
          lastSavedThema = thema;
          hasUnsavedChanges = false;
          status.textContent = 'Gespeichert ' + data.savedAt;
          status.className = 'save-status saved';
        }
      } catch (e) { console.error('Auto-save failed:', e); }
    }

    async function save() {
      const thema = themaInput.value.trim();
      if (!thema) { showToast('Bitte Thema eingeben', 'error'); return false; }

      const res = await fetch('/autosave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oberkategorie: document.getElementById('oberkategorie').value,
          unterkategorie: document.getElementById('unterkategorie').value,
          thema,
          content: editor.value
        })
      });

      const data = await res.json();
      if (data.success) {
        lastSavedContent = editor.value;
        lastSavedThema = thema;
        hasUnsavedChanges = false;
        showToast('Gespeichert!', 'success');
        updateSaveStatus();
        return true;
      }
      return false;
    }

    async function done() {
      if (themaInput.value.trim() && editor.value) await save();
      await fetch('/cancel', { method: 'POST' });
      window.close();
    }

    async function cancel() {
      await fetch('/cancel', { method: 'POST' });
      window.close();
    }

    function showToast(message, type = '') {
      toast.textContent = message;
      toast.className = 'toast show ' + type;
      setTimeout(() => toast.className = 'toast', 3000);
    }

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); save(); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') { e.preventDefault(); insertFormat('**', '**'); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') { e.preventDefault(); insertFormat('*', '*'); }
      if (e.key === 'Escape') done();
      if (e.key === 'Tab' && document.activeElement === editor) {
        e.preventDefault();
        const start = editor.selectionStart;
        editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(editor.selectionEnd);
        editor.selectionStart = editor.selectionEnd = start + 2;
      }
    });

    window.addEventListener('beforeunload', (e) => {
      if (hasUnsavedChanges) { e.preventDefault(); e.returnValue = ''; }
    });

    function toggleTheme() {
      const html = document.documentElement;
      const btn = document.getElementById('themeBtn');
      if (html.getAttribute('data-theme') === 'light') {
        html.removeAttribute('data-theme');
        btn.textContent = '🌙';
        localStorage.setItem('wasibase-theme', 'dark');
      } else {
        html.setAttribute('data-theme', 'light');
        btn.textContent = '☀️';
        localStorage.setItem('wasibase-theme', 'light');
      }
    }

    (function() {
      const savedTheme = localStorage.getItem('wasibase-theme');
      if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        document.getElementById('themeBtn').textContent = '☀️';
      }
      updateSaveStatus();
    })();
  </script>
</body>
</html>`;
}

function getSearchHTML() {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wasibase - Suche</title>
  <script src="https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #0a0a0a;
      color: #e5e5e5;
      min-height: 100vh;
      padding: 40px;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
    }

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 32px;
    }

    .logo {
      font-size: 24px;
      font-weight: 700;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .close-btn {
      background: #262626;
      color: #a3a3a3;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
    }

    .close-btn:hover { background: #333; color: #e5e5e5; }

    .search-box {
      position: relative;
      margin-bottom: 32px;
    }

    #searchInput {
      width: 100%;
      background: #141414;
      border: 1px solid #262626;
      border-radius: 12px;
      padding: 16px 20px 16px 48px;
      color: #e5e5e5;
      font-size: 16px;
      transition: all 0.15s;
    }

    #searchInput:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }

    #searchInput::placeholder { color: #525252; }

    .search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #525252;
      font-size: 18px;
    }

    .results {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .result-item {
      background: #141414;
      border: 1px solid #262626;
      border-radius: 12px;
      padding: 16px 20px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .result-item:hover {
      border-color: #3b82f6;
      transform: translateX(4px);
    }

    .result-path {
      font-size: 12px;
      color: #525252;
      margin-bottom: 6px;
      display: flex;
      gap: 6px;
    }

    .result-path span { color: #737373; }

    .result-title {
      font-size: 16px;
      font-weight: 600;
      color: #e5e5e5;
      margin-bottom: 8px;
    }

    .result-preview {
      font-size: 14px;
      color: #737373;
      line-height: 1.5;
    }

    .result-preview mark {
      background: rgba(59, 130, 246, 0.3);
      color: #93c5fd;
      padding: 1px 4px;
      border-radius: 3px;
    }

    .no-results {
      text-align: center;
      color: #525252;
      padding: 60px 20px;
    }

    .no-results .icon { font-size: 48px; margin-bottom: 16px; }

    .stats {
      font-size: 13px;
      color: #525252;
      margin-bottom: 16px;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="logo">Wasibase Suche</div>
      <button class="close-btn" onclick="closeSearch()">Schliessen (Esc)</button>
    </header>

    <div class="search-box">
      <span class="search-icon">&#128269;</span>
      <input type="text" id="searchInput" placeholder="Notes durchsuchen..." autofocus>
    </div>

    <div class="stats" id="stats"></div>
    <div class="results" id="results"></div>
  </div>

  <script>
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');
    const statsDiv = document.getElementById('stats');

    let debounceTimer;

    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(search, 200);
    });

    async function search() {
      const query = searchInput.value.trim();
      if (!query) {
        resultsDiv.innerHTML = '';
        statsDiv.textContent = '';
        return;
      }

      const res = await fetch('/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      const { results } = await res.json();

      if (results.length === 0) {
        statsDiv.textContent = '';
        resultsDiv.innerHTML = '<div class="no-results"><div class="icon">&#128270;</div>Keine Ergebnisse gefunden</div>';
        return;
      }

      statsDiv.textContent = results.length + ' Ergebnis' + (results.length !== 1 ? 'se' : '') + ' gefunden';

      resultsDiv.innerHTML = results.map(r => {
        const previewText = DOMPurify.sanitize(r.preview);
        return '<div class="result-item" onclick="openNote(\\'' + encodeURIComponent(JSON.stringify(r)) + '\\')">' +
          '<div class="result-path"><span>' + escapeHtml(r.oberkategorie) + '</span> / <span>' + escapeHtml(r.unterkategorie) + '</span></div>' +
          '<div class="result-title">' + escapeHtml(r.thema) + '</div>' +
          '<div class="result-preview">' + previewText + '</div>' +
        '</div>';
      }).join('');
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    function openNote(encoded) {
      const note = JSON.parse(decodeURIComponent(encoded));
      alert('Oeffne: ' + note.oberkategorie + ' / ' + note.unterkategorie + ' / ' + note.thema);
    }

    async function closeSearch() {
      await fetch('/close', { method: 'POST' });
      window.close();
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeSearch();
    });

    searchInput.focus();
  </script>
</body>
</html>`;
}
