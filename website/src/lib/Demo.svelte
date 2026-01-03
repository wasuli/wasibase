<script>
  import { onMount } from 'svelte';

  let currentView = 'main';
  let selectedOber = '';
  let selectedUnter = '';
  let typedCommand = '';
  let isTyping = false;
  let showCursor = true;

  const data = {
    'Mathematik': {
      'Lineare Algebra': ['Orthogonale Matrix', 'Kovarianz', 'Eigenwerte'],
      'Analysis': ['Integrale', 'Ableitungen', 'Grenzwerte']
    },
    'Informatik': {
      'Algorithmen': ['Sortieren', 'Suchen', 'Graphen'],
      'Datenstrukturen': ['Arrays', 'Linked Lists', 'Trees']
    },
    'Physik': {
      'Mechanik': ['Newtonsche Gesetze', 'Energie', 'Impuls']
    }
  };

  function selectOber(name) {
    selectedOber = name;
    currentView = 'unter';
  }

  function selectUnter(name) {
    selectedUnter = name;
    currentView = 'notes';
  }

  function goBack() {
    if (currentView === 'notes') {
      currentView = 'unter';
      selectedUnter = '';
    } else if (currentView === 'unter') {
      currentView = 'main';
      selectedOber = '';
    }
  }

  function reset() {
    currentView = 'main';
    selectedOber = '';
    selectedUnter = '';
  }

  async function typeCommand(cmd) {
    isTyping = true;
    typedCommand = '';
    for (let i = 0; i < cmd.length; i++) {
      typedCommand += cmd[i];
      await new Promise(r => setTimeout(r, 60 + Math.random() * 40));
    }
    await new Promise(r => setTimeout(r, 500));
    isTyping = false;
  }

  onMount(() => {
    typeCommand('wasibase');
    const cursorInterval = setInterval(() => showCursor = !showCursor, 530);
    return () => clearInterval(cursorInterval);
  });
</script>

<section class="demo" id="demo">
  <div class="container">
    <div class="section-header">
      <span class="overline">Interactive Demo</span>
      <h2 class="section-title">See it in action</h2>
      <p class="section-desc">Click through the demo to explore how wasibase works</p>
    </div>

    <div class="terminal-wrapper">
      <div class="terminal-glow"></div>
      <div class="terminal">
        <div class="terminal-header">
          <div class="terminal-dots">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <span class="terminal-title">wasibase ~ demo</span>
          <div class="terminal-actions">
            {#if currentView !== 'main'}
              <button class="reset-btn" on:click={reset}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
                Reset
              </button>
            {/if}
          </div>
        </div>

        <div class="terminal-body">
          <div class="command-line">
            <span class="prompt">$</span>
            <span class="command">{typedCommand}</span>
            {#if isTyping && showCursor}
              <span class="cursor"></span>
            {/if}
          </div>

          {#if !isTyping}
            <div class="output">
              <div class="header-bar">
                <span class="logo">WASIBASE</span>
                <span class="version">v1.0.0</span>
              </div>

              {#if currentView === 'main'}
                <div class="menu" style="animation-delay: 0.1s">
                  <div class="menu-label">Categories</div>
                  {#each Object.keys(data) as ober, i}
                    <button class="menu-item" on:click={() => selectOber(ober)} style="animation-delay: {0.1 + i * 0.05}s">
                      <span class="item-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                        </svg>
                      </span>
                      <span class="item-name">{ober}</span>
                      <span class="item-count">{Object.keys(data[ober]).length}</span>
                      <span class="item-arrow">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </span>
                    </button>
                  {/each}
                  <div class="separator"></div>
                  <div class="menu-item new">
                    <span class="item-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </span>
                    <span class="item-name">New Category</span>
                  </div>
                </div>

              {:else if currentView === 'unter'}
                <div class="breadcrumb">
                  <button class="crumb" on:click={reset}>Home</button>
                  <span class="crumb-sep">/</span>
                  <span class="crumb active">{selectedOber}</span>
                </div>
                <div class="menu">
                  <div class="menu-label">Subcategories</div>
                  {#each Object.keys(data[selectedOber]) as unter, i}
                    <button class="menu-item" on:click={() => selectUnter(unter)} style="animation-delay: {i * 0.05}s">
                      <span class="item-icon sub">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                        </svg>
                      </span>
                      <span class="item-name">{unter}</span>
                      <span class="item-count">{data[selectedOber][unter].length}</span>
                      <span class="item-arrow">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </span>
                    </button>
                  {/each}
                  <div class="separator"></div>
                  <button class="menu-item back" on:click={goBack}>
                    <span class="item-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="15 18 9 12 15 6"/>
                      </svg>
                    </span>
                    <span class="item-name">Back</span>
                  </button>
                </div>

              {:else if currentView === 'notes'}
                <div class="breadcrumb">
                  <button class="crumb" on:click={reset}>Home</button>
                  <span class="crumb-sep">/</span>
                  <button class="crumb" on:click={() => { currentView = 'unter'; selectedUnter = ''; }}>{selectedOber}</button>
                  <span class="crumb-sep">/</span>
                  <span class="crumb active">{selectedUnter}</span>
                </div>
                <div class="menu">
                  <div class="menu-label">Notes</div>
                  {#each data[selectedOber][selectedUnter] as note, i}
                    <div class="menu-item note" style="animation-delay: {i * 0.05}s">
                      <span class="item-icon note-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                          <line x1="16" y1="13" x2="8" y2="13"/>
                          <line x1="16" y1="17" x2="8" y2="17"/>
                        </svg>
                      </span>
                      <span class="item-name">{note}</span>
                      <span class="item-ext">.md</span>
                    </div>
                  {/each}
                  <div class="separator"></div>
                  <div class="menu-item new">
                    <span class="item-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </span>
                    <span class="item-name">New Note</span>
                  </div>
                  <button class="menu-item back" on:click={goBack}>
                    <span class="item-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="15 18 9 12 15 6"/>
                      </svg>
                    </span>
                    <span class="item-name">Back</span>
                  </button>
                </div>
              {/if}
            </div>
          {/if}
        </div>

        <div class="terminal-footer">
          <span class="footer-hint">
            <kbd>↑</kbd><kbd>↓</kbd> Navigate
            <kbd>Enter</kbd> Select
            <kbd>Esc</kbd> Back
          </span>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .demo {
    padding: 120px 24px;
    position: relative;
    background: linear-gradient(180deg, #0a0a0a 0%, #0f0f0f 100%);
  }

  .container {
    max-width: 900px;
    margin: 0 auto;
  }

  .section-header {
    text-align: center;
    margin-bottom: 60px;
  }

  .overline {
    display: inline-block;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #00ff88;
    margin-bottom: 16px;
  }

  .section-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: clamp(32px, 5vw, 44px);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
    margin-bottom: 16px;
  }

  .section-desc {
    font-size: 17px;
    color: #666;
    max-width: 400px;
    margin: 0 auto;
  }

  .terminal-wrapper {
    position: relative;
  }

  .terminal-glow {
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, #00ff88 0%, #00d4ff 50%, #8b5cf6 100%);
    border-radius: 18px;
    opacity: 0.15;
    filter: blur(20px);
    z-index: 0;
  }

  .terminal {
    position: relative;
    background: #0d0d0d;
    border: 1px solid #1a1a1a;
    border-radius: 16px;
    overflow: hidden;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.03),
      0 25px 80px -20px rgba(0, 0, 0, 0.8);
    z-index: 1;
  }

  .terminal-header {
    display: flex;
    align-items: center;
    padding: 14px 18px;
    background: #161616;
    border-bottom: 1px solid #1a1a1a;
  }

  .terminal-dots {
    display: flex;
    gap: 8px;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  .dot.red { background: #ff5f56; }
  .dot.yellow { background: #ffbd2e; }
  .dot.green { background: #27c93f; }

  .terminal-title {
    flex: 1;
    text-align: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: #444;
  }

  .terminal-actions {
    min-width: 80px;
    display: flex;
    justify-content: flex-end;
  }

  .reset-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #222;
    border: none;
    border-radius: 6px;
    padding: 6px 12px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 12px;
    color: #666;
    cursor: pointer;
    transition: all 0.2s;
  }

  .reset-btn:hover {
    background: #00ff88;
    color: #000;
  }

  .terminal-body {
    padding: 24px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    min-height: 380px;
  }

  .command-line {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }

  .prompt {
    color: #00ff88;
    font-weight: 600;
  }

  .command {
    color: #fff;
  }

  .cursor {
    display: inline-block;
    width: 10px;
    height: 20px;
    background: #00ff88;
    margin-left: 2px;
    animation: blink 1s step-end infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  .output {
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .header-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #1a1a1a;
  }

  .logo {
    background: linear-gradient(135deg, #00ff88, #00d4ff);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 700;
    font-size: 16px;
    letter-spacing: 0.05em;
  }

  .version {
    font-size: 11px;
    color: #444;
    padding: 2px 8px;
    background: #1a1a1a;
    border-radius: 4px;
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    font-size: 13px;
  }

  .crumb {
    background: none;
    border: none;
    color: #555;
    font-family: inherit;
    font-size: inherit;
    cursor: pointer;
    padding: 0;
    transition: color 0.2s;
  }

  .crumb:hover {
    color: #00ff88;
  }

  .crumb.active {
    color: #fff;
    cursor: default;
  }

  .crumb-sep {
    color: #333;
  }

  .menu {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .menu-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #444;
    margin-bottom: 8px;
    padding-left: 4px;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 10px;
    color: #ccc;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px;
    cursor: pointer;
    text-align: left;
    transition: all 0.15s;
    animation: slideIn 0.3s ease both;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .menu-item:hover {
    background: rgba(0, 255, 136, 0.05);
    border-color: rgba(0, 255, 136, 0.15);
  }

  .item-icon {
    color: #00ff88;
    display: flex;
    opacity: 0.8;
  }

  .item-icon.sub {
    color: #00d4ff;
  }

  .item-icon.note-icon {
    color: #fbbf24;
  }

  .item-name {
    flex: 1;
    font-weight: 500;
  }

  .item-count {
    font-size: 12px;
    color: #444;
    background: #1a1a1a;
    padding: 2px 8px;
    border-radius: 4px;
  }

  .item-ext {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: #444;
  }

  .item-arrow {
    color: #333;
    display: flex;
    transition: transform 0.2s, color 0.2s;
  }

  .menu-item:hover .item-arrow {
    transform: translateX(4px);
    color: #00ff88;
  }

  .menu-item.new {
    color: #00ff88;
    border-style: dashed;
    border-color: rgba(0, 255, 136, 0.2);
  }

  .menu-item.new:hover {
    background: rgba(0, 255, 136, 0.1);
    border-color: rgba(0, 255, 136, 0.3);
  }

  .menu-item.back {
    color: #666;
  }

  .menu-item.back:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .menu-item.note {
    cursor: default;
  }

  .separator {
    height: 1px;
    background: #1a1a1a;
    margin: 12px 0;
  }

  .terminal-footer {
    padding: 12px 18px;
    background: #111;
    border-top: 1px solid #1a1a1a;
  }

  .footer-hint {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    font-size: 12px;
    color: #444;
  }

  kbd {
    background: #1a1a1a;
    border: 1px solid #222;
    border-radius: 4px;
    padding: 2px 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #555;
    margin-right: 4px;
  }

  @media (max-width: 640px) {
    .demo {
      padding: 80px 24px;
    }

    .terminal-body {
      padding: 16px;
      min-height: 320px;
    }

    .menu-item {
      padding: 10px 12px;
    }

    .footer-hint {
      display: none;
    }
  }
</style>
