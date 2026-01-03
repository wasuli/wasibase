import express from 'express';
import { marked } from 'marked';
import * as storage from '../storage.js';

/**
 * Extrahiert alle Backlinks aus einem Markdown-Inhalt
 */
function extractBacklinks(content) {
  if (!content) return [];
  const regex = /\[\[([^\]]+)\]\]/g;
  const matches = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    matches.push(match[1].trim());
  }
  return [...new Set(matches)];
}

/**
 * Baut hierarchische Graph-Daten auf
 */
function buildGraphData() {
  const nodes = [];
  const links = [];
  const noteNodeMap = new Map();

  const oberkategorien = storage.getOberkategorien();

  for (const ober of oberkategorien) {
    const oberId = 'ober:' + ober;
    nodes.push({
      id: oberId,
      label: ober,
      type: 'oberkategorie'
    });

    const unterkategorien = storage.getUnterkategorien(ober);

    for (const unter of unterkategorien) {
      const unterId = 'unter:' + ober + '/' + unter;
      nodes.push({
        id: unterId,
        label: unter,
        type: 'unterkategorie',
        parent: oberId
      });

      links.push({
        source: oberId,
        target: unterId,
        type: 'hierarchy'
      });

      const notes = storage.getNotes(ober, unter);

      for (const thema of notes) {
        const noteId = 'note:' + ober + '/' + unter + '/' + thema;
        const content = storage.readNote(ober, unter, thema);
        const backlinks = extractBacklinks(content);

        const noteNode = {
          id: noteId,
          label: thema,
          type: 'note',
          oberkategorie: ober,
          unterkategorie: unter,
          thema: thema,
          backlinks: backlinks
        };

        nodes.push(noteNode);
        noteNodeMap.set(thema.toLowerCase(), noteNode);

        links.push({
          source: unterId,
          target: noteId,
          type: 'hierarchy'
        });
      }
    }
  }

  // Backlink-Verbindungen
  for (const node of nodes) {
    if (node.type === 'note' && node.backlinks) {
      for (const backlinkName of node.backlinks) {
        const targetNode = noteNodeMap.get(backlinkName.toLowerCase());
        if (targetNode && targetNode.id !== node.id) {
          links.push({
            source: node.id,
            target: targetNode.id,
            type: 'backlink'
          });
        }
      }
    }
  }

  return { nodes, links };
}

export function startGraphServer(config, callback) {
  const app = express();
  app.use(express.json());

  let serverInstance = null;
  const { port = 3335 } = config;

  app.get('/api/graph', (req, res) => {
    res.json(buildGraphData());
  });

  app.get('/api/note/:ober/:unter/:thema', (req, res) => {
    const { ober, unter, thema } = req.params;
    const content = storage.readNote(
      decodeURIComponent(ober),
      decodeURIComponent(unter),
      decodeURIComponent(thema)
    );

    if (!content) {
      return res.status(404).json({ error: 'Note nicht gefunden' });
    }

    const contentWithoutFrontmatter = content.replace(/^---[\s\S]*?---\n?/, '').trim();
    const html = marked(contentWithoutFrontmatter);

    res.json({
      thema: decodeURIComponent(thema),
      oberkategorie: decodeURIComponent(ober),
      unterkategorie: decodeURIComponent(unter),
      html
    });
  });

  app.post('/close', (req, res) => {
    res.json({ success: true });
    setTimeout(() => {
      if (serverInstance) serverInstance.close();
      if (callback) callback();
    }, 200);
  });

  app.get('/', (req, res) => {
    res.send(getGraphHTML());
  });

  serverInstance = app.listen(port);
  return { port, close: () => serverInstance.close() };
}

function getGraphHTML() {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wasibase Graph</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <script src="https://d3js.org/d3.v7.min.js"><\/script>
  <script src="https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js"><\/script>
  <style>
    :root {
      --bg: #030308;
      --bg-card: rgba(12, 12, 20, 0.9);
      --border: rgba(255, 255, 255, 0.08);
      --border-hover: rgba(255, 255, 255, 0.15);
      --text: #fafafa;
      --text-secondary: #a1a1aa;
      --text-muted: #71717a;
      --accent: #22d3ee;
      --accent-secondary: #a855f7;
      --accent-tertiary: #3b82f6;
      --emerald: #10b981;
      --amber: #f59e0b;
      --gradient-primary: linear-gradient(135deg, #22d3ee 0%, #a855f7 100%);
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg);
      color: var(--text);
      height: 100vh;
      overflow: hidden;
      -webkit-font-smoothing: antialiased;
    }

    /* Header */
    header {
      position: fixed;
      top: 0; left: 0; right: 0;
      height: 64px;
      background: rgba(3, 3, 8, 0.85);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      padding: 0 28px;
      z-index: 100;
    }

    .logo-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      width: 32px;
      height: 32px;
    }

    .logo-icon svg {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 0 16px rgba(34, 211, 238, 0.4));
    }

    .logo {
      font-size: 20px;
      font-weight: 700;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.02em;
    }

    .stats {
      margin-left: 24px;
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border);
      border-radius: 10px;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .header-actions {
      margin-left: auto;
      display: flex;
      gap: 12px;
    }

    .btn {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border);
      color: var(--text-secondary);
      padding: 10px 20px;
      border-radius: 12px;
      font-family: inherit;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.25s ease;
    }

    .btn:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: var(--border-hover);
      color: var(--text);
    }

    .btn-primary {
      background: var(--gradient-primary);
      border: none;
      color: #000;
      box-shadow: 0 0 20px -4px rgba(34, 211, 238, 0.4);
    }

    .btn-primary:hover {
      box-shadow: 0 0 28px -4px rgba(34, 211, 238, 0.6);
      transform: translateY(-1px);
    }

    /* Graph */
    #graph {
      width: 100%;
      height: 100%;
      cursor: grab;
    }

    #graph:active { cursor: grabbing; }

    /* Nodes */
    .node { cursor: pointer; transition: transform 0.2s ease; }

    .node-ober rect {
      fill: url(#grad-cyan);
      filter: drop-shadow(0 4px 20px rgba(34, 211, 238, 0.35));
    }

    .node-unter rect {
      fill: url(#grad-emerald);
      filter: drop-shadow(0 4px 20px rgba(16, 185, 129, 0.35));
    }

    .node-note circle {
      fill: url(#grad-amber);
      filter: drop-shadow(0 4px 16px rgba(245, 158, 11, 0.35));
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .node-note:hover circle {
      filter: drop-shadow(0 8px 28px rgba(245, 158, 11, 0.5));
    }

    .node text {
      pointer-events: none;
      user-select: none;
      font-weight: 500;
    }

    .node-label {
      fill: var(--text);
      font-size: 12px;
    }

    /* Links */
    .link-hierarchy {
      stroke: rgba(255, 255, 255, 0.12);
      stroke-width: 2;
      stroke-dasharray: 8, 6;
      opacity: 0.7;
    }

    .link-backlink {
      stroke: url(#grad-link);
      stroke-width: 3;
      opacity: 0.85;
    }

    /* Legend */
    .legend {
      position: fixed;
      bottom: 24px;
      left: 24px;
      background: var(--bg-card);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 20px 24px;
      min-width: 200px;
    }

    .legend-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--accent);
      margin-bottom: 16px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 14px;
      margin: 10px 0;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .legend-shape {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .legend-rect {
      width: 20px;
      height: 14px;
      border-radius: 4px;
    }

    .legend-circle {
      width: 16px;
      height: 16px;
      border-radius: 50%;
    }

    .legend-line {
      width: 24px;
      height: 3px;
      border-radius: 2px;
    }

    .legend-line-dashed {
      background: repeating-linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.2) 5px, transparent 5px, transparent 9px);
    }

    /* Controls */
    .controls {
      position: fixed;
      bottom: 24px;
      right: 24px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .control-btn {
      width: 48px;
      height: 48px;
      background: var(--bg-card);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--border);
      border-radius: 14px;
      color: var(--text-secondary);
      font-size: 20px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.25s ease;
    }

    .control-btn:hover {
      background: rgba(34, 211, 238, 0.1);
      border-color: rgba(34, 211, 238, 0.3);
      color: var(--accent);
      transform: scale(1.05);
    }

    /* Modal */
    .modal-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(3, 3, 8, 0.9);
      backdrop-filter: blur(8px);
      z-index: 200;
      justify-content: center;
      align-items: center;
      padding: 40px;
    }

    .modal-overlay.show { display: flex; }

    .modal {
      background: var(--bg-card);
      backdrop-filter: blur(20px);
      border: 1px solid var(--border);
      border-radius: 20px;
      max-width: 760px;
      max-height: 85vh;
      width: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 32px 64px rgba(0, 0, 0, 0.5), 0 0 80px -20px rgba(34, 211, 238, 0.15);
    }

    .modal-header {
      padding: 24px 28px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: flex-start;
      gap: 18px;
    }

    .modal-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, var(--amber), #ea580c);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      flex-shrink: 0;
      box-shadow: 0 8px 24px -8px rgba(245, 158, 11, 0.4);
    }

    .modal-info { flex: 1; }

    .modal-title {
      font-size: 20px;
      font-weight: 700;
      color: var(--text);
      margin-bottom: 6px;
      letter-spacing: -0.01em;
    }

    .modal-path {
      font-size: 13px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .modal-close {
      width: 36px;
      height: 36px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border);
      color: var(--text-muted);
      font-size: 22px;
      cursor: pointer;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .modal-close:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: var(--border-hover);
      color: var(--text);
    }

    .modal-content {
      padding: 28px;
      overflow-y: auto;
      line-height: 1.75;
    }

    .modal-content h1 { font-size: 1.7em; margin-bottom: 18px; color: var(--text); font-weight: 700; letter-spacing: -0.02em; }
    .modal-content h2 { font-size: 1.35em; margin: 28px 0 14px; color: var(--text); border-bottom: 1px solid var(--border); padding-bottom: 10px; font-weight: 600; }
    .modal-content h3 { font-size: 1.15em; margin: 22px 0 10px; color: var(--text); font-weight: 600; }
    .modal-content p { margin-bottom: 16px; color: var(--text-secondary); }
    .modal-content strong { color: var(--text); font-weight: 600; }
    .modal-content code { background: rgba(34, 211, 238, 0.1); padding: 3px 10px; border-radius: 8px; color: var(--accent); font-size: 13px; font-family: 'JetBrains Mono', monospace; }
    .modal-content pre { background: rgba(0, 0, 0, 0.3); padding: 18px 20px; border-radius: 14px; overflow-x: auto; margin: 16px 0; border: 1px solid var(--border); }
    .modal-content pre code { background: none; padding: 0; color: var(--text); }
    .modal-content ul, .modal-content ol { margin: 16px 0; padding-left: 26px; color: var(--text-secondary); }
    .modal-content li { margin: 8px 0; }
    .modal-content blockquote { border-left: 3px solid var(--accent-secondary); padding-left: 18px; color: var(--text-muted); margin: 16px 0; font-style: italic; }
    .modal-content a { color: var(--accent); text-decoration: none; border-bottom: 1px solid transparent; transition: border-color 0.2s; }
    .modal-content a:hover { border-bottom-color: var(--accent); }
  </style>
</head>
<body>
  <header>
    <div class="logo-wrap">
      <div class="logo-icon">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" stroke="url(#header-grad)" stroke-width="2" fill="none"/>
          <circle cx="16" cy="16" r="4" fill="url(#header-grad)"/>
          <circle cx="8" cy="10" r="2.5" fill="url(#header-grad)" opacity="0.8"/>
          <circle cx="24" cy="10" r="2.5" fill="url(#header-grad)" opacity="0.8"/>
          <circle cx="8" cy="22" r="2.5" fill="url(#header-grad)" opacity="0.8"/>
          <circle cx="24" cy="22" r="2.5" fill="url(#header-grad)" opacity="0.8"/>
          <line x1="12.5" y1="14" x2="9.5" y2="11.5" stroke="url(#header-grad)" stroke-width="1.5" opacity="0.6"/>
          <line x1="19.5" y1="14" x2="22.5" y2="11.5" stroke="url(#header-grad)" stroke-width="1.5" opacity="0.6"/>
          <line x1="12.5" y1="18" x2="9.5" y2="20.5" stroke="url(#header-grad)" stroke-width="1.5" opacity="0.6"/>
          <line x1="19.5" y1="18" x2="22.5" y2="20.5" stroke="url(#header-grad)" stroke-width="1.5" opacity="0.6"/>
          <defs>
            <linearGradient id="header-grad" x1="0" y1="0" x2="32" y2="32">
              <stop offset="0%" stop-color="#22d3ee"/>
              <stop offset="100%" stop-color="#a855f7"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span class="logo">Wasibase</span>
    </div>
    <div class="stats" id="stats">Lade...</div>
    <div class="header-actions">
      <button class="btn" onclick="closeGraph()">Schliessen</button>
    </div>
  </header>

  <svg id="graph">
    <defs>
      <linearGradient id="grad-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#22d3ee"/>
        <stop offset="100%" stop-color="#0891b2"/>
      </linearGradient>
      <linearGradient id="grad-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#10b981"/>
        <stop offset="100%" stop-color="#059669"/>
      </linearGradient>
      <linearGradient id="grad-amber" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#d97706"/>
      </linearGradient>
      <linearGradient id="grad-link" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#22d3ee"/>
        <stop offset="100%" stop-color="#a855f7"/>
      </linearGradient>
    </defs>
  </svg>
  
  <div class="legend">
    <div class="legend-title">Legende</div>
    <div class="legend-item">
      <div class="legend-shape"><div class="legend-rect" style="background: var(--accent);"></div></div>
      <span>Oberkategorie</span>
    </div>
    <div class="legend-item">
      <div class="legend-shape"><div class="legend-rect" style="background: var(--emerald);"></div></div>
      <span>Unterkategorie</span>
    </div>
    <div class="legend-item">
      <div class="legend-shape"><div class="legend-circle" style="background: var(--amber);"></div></div>
      <span>Note</span>
    </div>
    <div class="legend-item">
      <div class="legend-shape"><div class="legend-line legend-line-dashed"></div></div>
      <span>Struktur</span>
    </div>
    <div class="legend-item">
      <div class="legend-shape"><div class="legend-line" style="background: var(--gradient-primary);"></div></div>
      <span>Backlink</span>
    </div>
  </div>
  
  <div class="controls">
    <button class="control-btn" onclick="zoomIn()" title="Zoom +">+</button>
    <button class="control-btn" onclick="zoomOut()" title="Zoom -">−</button>
    <button class="control-btn" onclick="resetView()" title="Reset">↺</button>
  </div>
  
  <div class="modal-overlay" id="modal" onclick="closeModal(event)">
    <div class="modal" onclick="event.stopPropagation()">
      <div class="modal-header">
        <div class="modal-icon">📄</div>
        <div class="modal-info">
          <div class="modal-title" id="modalTitle"></div>
          <div class="modal-path" id="modalPath"></div>
        </div>
        <button class="modal-close" onclick="closeModal()">×</button>
      </div>
      <div class="modal-content" id="modalContent"></div>
    </div>
  </div>

  <script>
    let simulation, svg, g, zoom;
    let nodes = [], links = [];

    const CONFIG = {
      nodeSize: {
        ober: { width: 140, height: 44, radius: 10 },
        unter: { width: 120, height: 36, radius: 8 },
        note: { radius: 22 }
      },
      force: {
        linkDistance: { hierarchy: 140, backlink: 200 },
        linkStrength: { hierarchy: 0.7, backlink: 0.2 },
        charge: { ober: -800, unter: -500, note: -400 },
        collision: { ober: 90, unter: 75, note: 50 }
      }
    };

    async function init() {
      const response = await fetch('/api/graph');
      const data = await response.json();
      nodes = data.nodes;
      links = data.links;

      updateStats();
      createGraph();
    }

    function updateStats() {
      const oberCount = nodes.filter(n => n.type === 'oberkategorie').length;
      const unterCount = nodes.filter(n => n.type === 'unterkategorie').length;
      const noteCount = nodes.filter(n => n.type === 'note').length;
      const backlinkCount = links.filter(l => l.type === 'backlink').length;

      document.getElementById('stats').textContent = 
        noteCount + ' Notes in ' + unterCount + ' Kategorien' + 
        (backlinkCount > 0 ? ' • ' + backlinkCount + ' Verknüpfungen' : '');
    }

    function createGraph() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      svg = d3.select('#graph').attr('width', width).attr('height', height);
      
      // Zoom setup
      zoom = d3.zoom()
        .scaleExtent([0.2, 3])
        .on('zoom', (event) => g.attr('transform', event.transform));
      svg.call(zoom);
      
      g = svg.append('g');

      // Force simulation
      simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links)
          .id(d => d.id)
          .distance(d => CONFIG.force.linkDistance[d.type])
          .strength(d => CONFIG.force.linkStrength[d.type])
        )
        .force('charge', d3.forceManyBody()
          .strength(d => CONFIG.force.charge[d.type.replace('kategorie', '')] || -400)
        )
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide()
          .radius(d => CONFIG.force.collision[d.type.replace('kategorie', '')] || 50)
        )
        .force('x', d3.forceX(width / 2).strength(0.03))
        .force('y', d3.forceY(height / 2).strength(0.03));

      // Draw links
      const link = g.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('class', d => 'link-' + d.type);

      // Draw nodes
      const node = g.append('g')
        .attr('class', 'nodes')
        .selectAll('g')
        .data(nodes)
        .enter()
        .append('g')
        .attr('class', d => 'node node-' + d.type.replace('kategorie', ''))
        .call(d3.drag()
          .on('start', dragStarted)
          .on('drag', dragged)
          .on('end', dragEnded)
        )
        .on('click', (event, d) => handleClick(d));

      // Render node shapes
      node.each(function(d) {
        const el = d3.select(this);
        const cfg = CONFIG.nodeSize;
        
        if (d.type === 'oberkategorie') {
          el.append('rect')
            .attr('width', cfg.ober.width)
            .attr('height', cfg.ober.height)
            .attr('x', -cfg.ober.width / 2)
            .attr('y', -cfg.ober.height / 2)
            .attr('rx', cfg.ober.radius);
          el.append('text')
            .attr('class', 'node-label')
            .attr('text-anchor', 'middle')
            .attr('dy', 5)
            .attr('fill', 'white')
            .attr('font-size', '13px')
            .attr('font-weight', '600')
            .text(truncate(d.label, 16));
        } 
        else if (d.type === 'unterkategorie') {
          el.append('rect')
            .attr('width', cfg.unter.width)
            .attr('height', cfg.unter.height)
            .attr('x', -cfg.unter.width / 2)
            .attr('y', -cfg.unter.height / 2)
            .attr('rx', cfg.unter.radius);
          el.append('text')
            .attr('class', 'node-label')
            .attr('text-anchor', 'middle')
            .attr('dy', 4)
            .attr('fill', 'white')
            .attr('font-size', '12px')
            .attr('font-weight', '500')
            .text(truncate(d.label, 14));
        } 
        else {
          el.append('circle')
            .attr('r', cfg.note.radius);
          el.append('text')
            .attr('class', 'node-label')
            .attr('x', cfg.note.radius + 8)
            .attr('dy', 4)
            .attr('fill', '#ccc')
            .attr('font-size', '12px')
            .text(truncate(d.label, 22));
        }
      });

      // Simulation tick
      simulation.on('tick', () => {
        link
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);
        node.attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');
      });

      // Initial zoom to fit
      setTimeout(fitToScreen, 1200);
    }

    function truncate(str, len) {
      return str.length > len ? str.substring(0, len - 1) + '…' : str;
    }

    function fitToScreen() {
      const bounds = g.node().getBBox();
      const width = window.innerWidth;
      const height = window.innerHeight;
      const scale = 0.85 / Math.max(bounds.width / width, bounds.height / height);
      const tx = width / 2 - scale * (bounds.x + bounds.width / 2);
      const ty = height / 2 - scale * (bounds.y + bounds.height / 2);
      svg.transition().duration(750).call(
        zoom.transform, 
        d3.zoomIdentity.translate(tx, ty).scale(Math.min(scale, 1.2))
      );
    }

    function dragStarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    function handleClick(node) {
      if (node.type === 'note') openNote(node);
    }

    async function openNote(node) {
      const url = '/api/note/' + 
        encodeURIComponent(node.oberkategorie) + '/' + 
        encodeURIComponent(node.unterkategorie) + '/' + 
        encodeURIComponent(node.thema);
      
      try {
        const response = await fetch(url);
        const data = await response.json();
        
        document.getElementById('modalTitle').textContent = data.thema;
        document.getElementById('modalPath').textContent = data.oberkategorie + ' / ' + data.unterkategorie;
        document.getElementById('modalContent').innerHTML = DOMPurify.sanitize(data.html);
        document.getElementById('modal').classList.add('show');
      } catch (e) {
        console.error('Error loading note:', e);
      }
    }

    function closeModal(event) {
      if (!event || event.target.id === 'modal') {
        document.getElementById('modal').classList.remove('show');
      }
    }

    function zoomIn() { svg.transition().duration(300).call(zoom.scaleBy, 1.4); }
    function zoomOut() { svg.transition().duration(300).call(zoom.scaleBy, 0.7); }
    function resetView() { fitToScreen(); }

    async function closeGraph() {
      await fetch('/close', { method: 'POST' });
      window.close();
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (document.getElementById('modal').classList.contains('show')) {
          closeModal();
        } else {
          closeGraph();
        }
      }
      if (e.key === '+' || e.key === '=') zoomIn();
      if (e.key === '-') zoomOut();
      if (e.key === '0') resetView();
    });

    // Resize handler
    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      svg.attr('width', width).attr('height', height);
      simulation.force('center', d3.forceCenter(width / 2, height / 2));
      simulation.force('x', d3.forceX(width / 2).strength(0.03));
      simulation.force('y', d3.forceY(height / 2).strength(0.03));
      simulation.alpha(0.3).restart();
    });

    init();
  <\/script>
</body>
</html>`;
}
