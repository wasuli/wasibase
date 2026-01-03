<script>
  import { onMount } from 'svelte';

  let currentView = 'main';
  let selectedOber = '';
  let selectedUnter = '';
  let typedCommand = '';
  let isTyping = false;

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
      await new Promise(r => setTimeout(r, 50 + Math.random() * 30));
    }
    await new Promise(r => setTimeout(r, 400));
    isTyping = false;
  }

  onMount(() => {
    typeCommand('wasibase');
  });
</script>

<section class="demo">
  <div class="container">
    <h2 class="section-title">Probier es aus</h2>
    <p class="section-subtitle">Interaktive Demo - klick dich durch</p>

    <div class="terminal">
      <div class="terminal-header">
        <div class="terminal-buttons">
          <span class="btn-close"></span>
          <span class="btn-min"></span>
          <span class="btn-max"></span>
        </div>
        <span class="terminal-title">wasibase</span>
      </div>

      <div class="terminal-body">
        <div class="command-line">
          <span class="prompt">$</span>
          <span class="command">{typedCommand}</span>
          {#if isTyping}
            <span class="cursor">|</span>
          {/if}
        </div>

        {#if !isTyping}
          <div class="output">
            <div class="header">WASIBASE</div>

            {#if currentView === 'main'}
              <div class="menu">
                {#each Object.keys(data) as ober}
                  <button class="menu-item" on:click={() => selectOber(ober)}>
                    <span class="arrow">→</span>
                    <span class="name">{ober}</span>
                    <span class="count">({Object.keys(data[ober]).length} Unter)</span>
                  </button>
                {/each}
                <div class="separator"></div>
                <div class="menu-item new">
                  <span class="plus">+</span>
                  <span>Neue Oberkategorie</span>
                </div>
              </div>

            {:else if currentView === 'unter'}
              <div class="breadcrumb">Oberkategorie: <strong>{selectedOber}</strong></div>
              <div class="menu">
                {#each Object.keys(data[selectedOber]) as unter}
                  <button class="menu-item" on:click={() => selectUnter(unter)}>
                    <span class="arrow">→</span>
                    <span class="name">{unter}</span>
                    <span class="count">({data[selectedOber][unter].length} Notes)</span>
                  </button>
                {/each}
                <div class="separator"></div>
                <button class="menu-item back" on:click={goBack}>
                  <span class="arrow">&lt;</span>
                  <span>Zurueck</span>
                </button>
              </div>

            {:else if currentView === 'notes'}
              <div class="breadcrumb">Pfad: <strong>{selectedOber} / {selectedUnter}</strong></div>
              <div class="menu">
                {#each data[selectedOber][selectedUnter] as note}
                  <div class="menu-item note">
                    <span class="arrow">→</span>
                    <span class="name">{note}</span>
                  </div>
                {/each}
                <div class="separator"></div>
                <div class="menu-item new">
                  <span class="plus">+</span>
                  <span>Neue Note erstellen</span>
                </div>
                <button class="menu-item back" on:click={goBack}>
                  <span class="arrow">&lt;</span>
                  <span>Zurueck</span>
                </button>
              </div>
            {/if}

            <div class="hint">
              {#if currentView !== 'main'}
                <button class="reset-btn" on:click={reset}>Reset Demo</button>
              {/if}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>

<style>
  .demo {
    padding: 80px 0;
    background: var(--bg-card);
  }

  .container {
    max-width: 700px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .section-title {
    font-size: 32px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 8px;
  }

  .section-subtitle {
    text-align: center;
    color: var(--text-muted);
    margin-bottom: 40px;
  }

  .terminal {
    background: #1e1e1e;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    border: 1px solid var(--border);
  }

  .terminal-header {
    background: #323232;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .terminal-buttons {
    display: flex;
    gap: 8px;
  }

  .terminal-buttons span {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  .btn-close { background: #ff5f56; }
  .btn-min { background: #ffbd2e; }
  .btn-max { background: #27ca40; }

  .terminal-title {
    color: #888;
    font-size: 13px;
    flex: 1;
    text-align: center;
    margin-right: 60px;
  }

  .terminal-body {
    padding: 20px;
    font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
    font-size: 14px;
    min-height: 350px;
  }

  .command-line {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }

  .prompt {
    color: var(--accent-green);
  }

  .command {
    color: var(--text);
  }

  .cursor {
    color: var(--accent);
    animation: blink 1s infinite;
  }

  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }

  .output {
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .header {
    background: var(--accent);
    color: white;
    padding: 4px 12px;
    display: inline-block;
    font-weight: bold;
    margin-bottom: 16px;
  }

  .breadcrumb {
    color: var(--text-muted);
    margin-bottom: 12px;
  }

  .breadcrumb strong {
    color: var(--text);
  }

  .menu {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: transparent;
    border: none;
    color: var(--text);
    font-family: inherit;
    font-size: inherit;
    cursor: pointer;
    text-align: left;
    border-radius: 6px;
    transition: background 0.15s;
  }

  .menu-item:hover {
    background: rgba(59, 130, 246, 0.15);
  }

  .menu-item .arrow {
    color: var(--accent);
    width: 16px;
  }

  .menu-item .name {
    font-weight: 600;
  }

  .menu-item .count {
    color: var(--text-muted);
    font-size: 12px;
  }

  .menu-item.new {
    color: var(--accent-green);
  }

  .menu-item.new .plus {
    color: var(--accent-green);
    width: 16px;
  }

  .menu-item.back {
    color: var(--text-muted);
  }

  .menu-item.note {
    cursor: default;
  }

  .separator {
    height: 1px;
    background: var(--border);
    margin: 8px 0;
  }

  .hint {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }

  .reset-btn {
    background: var(--border);
    border: none;
    color: var(--text-muted);
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .reset-btn:hover {
    background: var(--accent);
    color: white;
  }
</style>
