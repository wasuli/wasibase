<script>
  import { onMount } from 'svelte';

  let currentPlatform = 'mac';
  let copied = false;
  let typedText = '';
  let showCursor = true;

  const platforms = {
    mac: { name: 'macOS', icon: '', cmd: 'npm install -g wasibase' },
    windows: { name: 'Windows', icon: '', cmd: 'npm install -g wasibase' },
    linux: { name: 'Linux', icon: '', cmd: 'npm install -g wasibase' }
  };

  async function copyCommand() {
    await navigator.clipboard.writeText(platforms[currentPlatform].cmd);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

  onMount(() => {
    // Typing animation
    const text = 'wasibase';
    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        typedText = text.slice(0, i);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 120);

    // Cursor blink
    setInterval(() => showCursor = !showCursor, 530);

    return () => clearInterval(interval);
  });
</script>

<section class="hero">
  <div class="grid-bg"></div>
  <div class="glow glow-1"></div>
  <div class="glow glow-2"></div>

  <div class="container">
    <div class="badge">
      <span class="badge-dot"></span>
      Open Source
    </div>

    <h1 class="title">
      Your <span class="gradient">Second Brain</span><br/>
      in the Terminal
    </h1>

    <p class="subtitle">
      A blazingly fast note-taking system with backlinks, graph visualization,
      and cloud sync. Built for developers and power users.
    </p>

    <div class="install-section">
      <div class="platform-tabs">
        {#each Object.entries(platforms) as [key, platform]}
          <button
            class="platform-tab"
            class:active={currentPlatform === key}
            on:click={() => currentPlatform = key}
          >
            <span class="platform-icon">{platform.icon}</span>
            {platform.name}
          </button>
        {/each}
      </div>

      <div class="terminal-box">
        <div class="terminal-header">
          <div class="terminal-dots">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <span class="terminal-title">Terminal</span>
        </div>
        <div class="terminal-body">
          <span class="prompt">$</span>
          <code class="command">{platforms[currentPlatform].cmd}</code>
          <button class="copy-btn" on:click={copyCommand}>
            {#if copied}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            {:else}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            {/if}
          </button>
        </div>
      </div>

      <p class="prereq">
        Requires <a href="https://nodejs.org" target="_blank" rel="noopener">Node.js 18+</a>
      </p>
    </div>

    <div class="cta-buttons">
      <a href="https://github.com/wasuli/wasibase" class="btn btn-primary" target="_blank" rel="noopener">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        View on GitHub
      </a>
      <a href="https://www.npmjs.com/package/wasibase" class="btn btn-secondary" target="_blank" rel="noopener">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z"/>
        </svg>
        npm Package
      </a>
    </div>
  </div>

  <div class="scroll-indicator">
    <div class="mouse">
      <div class="wheel"></div>
    </div>
  </div>
</section>

<style>
  .hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    padding: 60px 24px;
  }

  .grid-bg {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }

  .glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    opacity: 0.4;
    pointer-events: none;
  }

  .glow-1 {
    width: 600px;
    height: 600px;
    background: #00ff88;
    top: -200px;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0.15;
  }

  .glow-2 {
    width: 400px;
    height: 400px;
    background: #8b5cf6;
    bottom: -100px;
    right: -100px;
    opacity: 0.1;
  }

  .container {
    max-width: 800px;
    width: 100%;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: rgba(0, 255, 136, 0.1);
    border: 1px solid rgba(0, 255, 136, 0.2);
    border-radius: 100px;
    font-size: 13px;
    font-weight: 500;
    color: #00ff88;
    margin-bottom: 32px;
    animation: fadeInDown 0.6s ease-out;
  }

  .badge-dot {
    width: 8px;
    height: 8px;
    background: #00ff88;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.2); }
  }

  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: clamp(40px, 8vw, 72px);
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 24px;
    letter-spacing: -0.03em;
    animation: fadeInUp 0.6s ease-out 0.1s both;
  }

  .gradient {
    background: linear-gradient(135deg, #00ff88 0%, #00d4ff 50%, #8b5cf6 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .subtitle {
    font-size: 18px;
    line-height: 1.7;
    color: #888;
    max-width: 560px;
    margin: 0 auto 48px;
    animation: fadeInUp 0.6s ease-out 0.2s both;
  }

  .install-section {
    animation: fadeInUp 0.6s ease-out 0.3s both;
  }

  .platform-tabs {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 16px;
  }

  .platform-tab {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: transparent;
    border: 1px solid #333;
    border-radius: 8px;
    color: #666;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .platform-tab:hover {
    border-color: #555;
    color: #999;
  }

  .platform-tab.active {
    background: rgba(0, 255, 136, 0.1);
    border-color: rgba(0, 255, 136, 0.3);
    color: #00ff88;
  }

  .platform-icon {
    font-size: 18px;
  }

  .terminal-box {
    background: #0d0d0d;
    border: 1px solid #222;
    border-radius: 12px;
    overflow: hidden;
    max-width: 520px;
    margin: 0 auto;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.05),
      0 20px 50px -20px rgba(0, 0, 0, 0.5),
      0 0 100px -50px rgba(0, 255, 136, 0.3);
  }

  .terminal-header {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    background: #161616;
    border-bottom: 1px solid #222;
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
    font-size: 13px;
    color: #555;
    margin-right: 44px;
  }

  .terminal-body {
    display: flex;
    align-items: center;
    padding: 20px 24px;
    gap: 12px;
  }

  .prompt {
    color: #00ff88;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600;
  }

  .command {
    flex: 1;
    font-family: 'JetBrains Mono', monospace;
    font-size: 15px;
    color: #fff;
    text-align: left;
  }

  .copy-btn {
    background: #222;
    border: none;
    border-radius: 6px;
    padding: 8px;
    color: #666;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .copy-btn:hover {
    background: #00ff88;
    color: #000;
  }

  .prereq {
    margin-top: 16px;
    font-size: 13px;
    color: #555;
  }

  .prereq a {
    color: #00ff88;
    text-decoration: none;
  }

  .prereq a:hover {
    text-decoration: underline;
  }

  .cta-buttons {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 48px;
    animation: fadeInUp 0.6s ease-out 0.4s both;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 28px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s;
  }

  .btn-primary {
    background: #fff;
    color: #000;
  }

  .btn-primary:hover {
    background: #00ff88;
    transform: translateY(-2px);
    box-shadow: 0 10px 30px -10px rgba(0, 255, 136, 0.5);
  }

  .btn-secondary {
    background: transparent;
    color: #fff;
    border: 1px solid #333;
  }

  .btn-secondary:hover {
    border-color: #00ff88;
    color: #00ff88;
    transform: translateY(-2px);
  }

  .scroll-indicator {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    animation: fadeInUp 0.6s ease-out 0.6s both;
  }

  .mouse {
    width: 26px;
    height: 40px;
    border: 2px solid #333;
    border-radius: 13px;
    display: flex;
    justify-content: center;
    padding-top: 8px;
  }

  .wheel {
    width: 4px;
    height: 8px;
    background: #00ff88;
    border-radius: 2px;
    animation: scroll 2s infinite;
  }

  @keyframes scroll {
    0%, 100% { opacity: 1; transform: translateY(0); }
    50% { opacity: 0.3; transform: translateY(6px); }
  }

  @media (max-width: 640px) {
    .platform-tabs {
      flex-wrap: wrap;
    }

    .platform-tab {
      padding: 8px 16px;
      font-size: 13px;
    }

    .terminal-body {
      padding: 16px;
    }

    .command {
      font-size: 13px;
    }

    .cta-buttons {
      flex-direction: column;
      align-items: center;
    }

    .btn {
      width: 100%;
      max-width: 280px;
      justify-content: center;
    }
  }
</style>
