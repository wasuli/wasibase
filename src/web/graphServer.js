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
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://d3js.org/d3.v7.min.js"><\/script>
  <script src="https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js"><\/script>
  <style>
    :root {
      --bg-dark: #0f0f0f;
      --bg-card: #1a1a1a;
      --border: #2a2a2a;
      --text: #e5e5e5;
      --text-muted: #888;
      --accent-blue: #3b82f6;
      --accent-green: #10b981;
      --accent-amber: #f59e0b;
      --accent-purple: #8b5cf6;
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg-dark);
      color: var(--text);
      height: 100vh;
      overflow: hidden;
    }
    
    /* Header */
    header {
      position: fixed;
      top: 0; left: 0; right: 0;
      height: 56px;
      background: rgba(15, 15, 15, 0.8);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      padding: 0 24px;
      z-index: 100;
    }
    
    .logo {
      font-size: 18px;
      font-weight: 700;
      background: linear-gradient(135deg, var(--accent-purple), var(--accent-blue));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .stats {
      margin-left: 24px;
      font-size: 13px;
      color: var(--text-muted);
    }
    
    .header-actions {
      margin-left: auto;
      display: flex;
      gap: 12px;
    }
    
    .btn {
      background: var(--bg-card);
      border: 1px solid var(--border);
      color: var(--text-muted);
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .btn:hover {
      background: var(--border);
      color: var(--text);
    }
    
    /* Graph */
    #graph {
      width: 100%;
      height: 100%;
      cursor: grab;
    }
    
    #graph:active { cursor: grabbing; }
    
    /* Nodes */
    .node { cursor: pointer; }
    
    .node-ober rect {
      fill: var(--accent-blue);
      filter: drop-shadow(0 4px 12px rgba(59, 130, 246, 0.3));
    }
    
    .node-unter rect {
      fill: var(--accent-green);
      filter: drop-shadow(0 4px 12px rgba(16, 185, 129, 0.3));
    }
    
    .node-note circle {
      fill: var(--accent-amber);
      filter: drop-shadow(0 4px 12px rgba(245, 158, 11, 0.3));
      transition: all 0.2s;
    }
    
    .node-note:hover circle {
      transform: scale(1.15);
      filter: drop-shadow(0 6px 20px rgba(245, 158, 11, 0.5));
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
      stroke: var(--border);
      stroke-width: 2;
      stroke-dasharray: 6, 4;
      opacity: 0.6;
    }
    
    .link-backlink {
      stroke: var(--accent-purple);
      stroke-width: 2.5;
      opacity: 0.8;
    }
    
    /* Legend */
    .legend {
      position: fixed;
      bottom: 24px;
      left: 24px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px 20px;
      min-width: 180px;
    }
    
    .legend-title {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-muted);
      margin-bottom: 12px;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 8px 0;
      font-size: 13px;
      color: var(--text);
    }
    
    .legend-shape {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .legend-rect {
      width: 18px;
      height: 12px;
      border-radius: 3px;
    }
    
    .legend-circle {
      width: 14px;
      height: 14px;
      border-radius: 50%;
    }
    
    .legend-line {
      width: 20px;
      height: 3px;
      border-radius: 2px;
    }
    
    .legend-line-dashed {
      background: repeating-linear-gradient(90deg, var(--border), var(--border) 4px, transparent 4px, transparent 8px);
    }
    
    /* Controls */
    .controls {
      position: fixed;
      bottom: 24px;
      right: 24px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .control-btn {
      width: 44px;
      height: 44px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      color: var(--text-muted);
      font-size: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    
    .control-btn:hover {
      background: var(--border);
      color: var(--text);
    }
    
    /* Modal */
    .modal-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(4px);
      z-index: 200;
      justify-content: center;
      align-items: center;
      padding: 40px;
    }
    
    .modal-overlay.show { display: flex; }
    
    .modal {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px;
      max-width: 720px;
      max-height: 80vh;
      width: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4);
    }
    
    .modal-header {
      padding: 20px 24px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }
    
    .modal-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--accent-amber), #ea580c);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }
    
    .modal-info { flex: 1; }
    
    .modal-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 4px;
    }
    
    .modal-path {
      font-size: 13px;
      color: var(--text-muted);
    }
    
    .modal-close {
      width: 32px;
      height: 32px;
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 24px;
      cursor: pointer;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .modal-close:hover {
      background: var(--border);
      color: var(--text);
    }
    
    .modal-content {
      padding: 24px;
      overflow-y: auto;
      line-height: 1.7;
    }
    
    .modal-content h1 { font-size: 1.6em; margin-bottom: 16px; color: var(--text); }
    .modal-content h2 { font-size: 1.3em; margin: 24px 0 12px; color: var(--text); border-bottom: 1px solid var(--border); padding-bottom: 8px; }
    .modal-content h3 { font-size: 1.1em; margin: 20px 0 8px; color: var(--text); }
    .modal-content p { margin-bottom: 14px; color: #b0b0b0; }
    .modal-content strong { color: var(--text); }
    .modal-content code { background: #252525; padding: 2px 8px; border-radius: 6px; color: #f472b6; font-size: 13px; }
    .modal-content pre { background: #252525; padding: 16px; border-radius: 10px; overflow-x: auto; margin: 14px 0; border: 1px solid var(--border); }
    .modal-content pre code { background: none; padding: 0; color: var(--text); }
    .modal-content ul, .modal-content ol { margin: 14px 0; padding-left: 24px; color: #b0b0b0; }
    .modal-content blockquote { border-left: 3px solid var(--accent-purple); padding-left: 16px; color: var(--text-muted); margin: 14px 0; }
  </style>
</head>
<body>
  <header>
    <div class="logo">Wasibase Graph</div>
    <div class="stats" id="stats">Lade...</div>
    <div class="header-actions">
      <button class="btn" onclick="closeGraph()">Schliessen</button>
    </div>
  </header>
  
  <svg id="graph"></svg>
  
  <div class="legend">
    <div class="legend-title">Legende</div>
    <div class="legend-item">
      <div class="legend-shape"><div class="legend-rect" style="background: var(--accent-blue);"></div></div>
      <span>Oberkategorie</span>
    </div>
    <div class="legend-item">
      <div class="legend-shape"><div class="legend-rect" style="background: var(--accent-green);"></div></div>
      <span>Unterkategorie</span>
    </div>
    <div class="legend-item">
      <div class="legend-shape"><div class="legend-circle" style="background: var(--accent-amber);"></div></div>
      <span>Note</span>
    </div>
    <div class="legend-item">
      <div class="legend-shape"><div class="legend-line legend-line-dashed"></div></div>
      <span>Struktur</span>
    </div>
    <div class="legend-item">
      <div class="legend-shape"><div class="legend-line" style="background: var(--accent-purple);"></div></div>
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
