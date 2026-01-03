<script>
  import { onMount } from 'svelte';

  let copied = {};
  let visible = false;

  const commands = [
    { cmd: 'wasibase', desc: 'Open main menu & manage categories' },
    { cmd: 'wasibase note', desc: 'Create or edit notes' },
    { cmd: 'wasibase search', desc: 'Search through all notes' },
    { cmd: 'wasibase graph', desc: 'Visualize knowledge graph' },
    { cmd: 'wasibase backup', desc: 'Create and restore backups' },
    { cmd: 'wasibase sync', desc: 'Sync with cloud storage' }
  ];

  async function copyCommand(cmd, key) {
    await navigator.clipboard.writeText(cmd);
    copied[key] = true;
    setTimeout(() => copied[key] = false, 2000);
  }

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible = true;
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const section = document.querySelector('.installation');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  });
</script>

<section class="installation" id="install">
  <div class="bg-glow"></div>

  <div class="container">
    <div class="section-header" class:visible>
      <span class="overline">
        <span class="overline-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </span>
        Quick Start
      </span>
      <h2 class="section-title">
        Up and running in <span class="gradient-text">seconds</span>
      </h2>
    </div>

    <div class="install-steps" class:visible>
      <div class="step glass-card">
        <div class="step-badge">
          <span class="step-number">1</span>
        </div>
        <div class="step-content">
          <h3>Prerequisites</h3>
          <p>Make sure you have Node.js 18+ installed</p>
          <a href="https://nodejs.org" class="node-link" target="_blank" rel="noopener">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1.85c-.27 0-.55.07-.78.2l-7.44 4.3c-.48.28-.78.8-.78 1.36v8.58c0 .56.3 1.08.78 1.36l1.95 1.12c.95.46 1.27.46 1.71.46 1.4 0 2.21-.85 2.21-2.33V8.44c0-.12-.1-.22-.22-.22H8.5c-.13 0-.23.1-.23.22v8.47c0 .66-.68 1.31-1.77.76L4.45 16.5a.26.26 0 0 1-.12-.21V7.71c0-.09.04-.17.12-.21l7.44-4.29c.08-.04.18-.04.25 0l7.44 4.29c.08.04.12.12.12.21v8.58c0 .09-.04.17-.12.21l-7.44 4.29c-.07.04-.16.04-.24 0l-1.92-1.14c-.08-.04-.17-.05-.26-.02-.72.26-.86.29-1.54.44-.17.04-.42.11.1.3l2.5 1.48c.23.14.5.2.77.2.28 0 .54-.06.77-.2l7.44-4.29c.48-.28.78-.8.78-1.36V7.71c0-.56-.3-1.08-.78-1.36l-7.44-4.3c-.23-.13-.5-.2-.78-.2M14 8c-2.12 0-3.39.89-3.39 2.39 0 1.61 1.26 2.06 3.29 2.25 2.43.25 2.62.6 2.62 1.09 0 .83-.67 1.18-2.23 1.18-1.98 0-2.4-.49-2.55-1.47a.23.23 0 0 0-.22-.18h-.96c-.12 0-.21.09-.21.22 0 1.24.68 2.74 3.94 2.74 2.35 0 3.7-.93 3.7-2.55 0-1.61-1.08-2.03-3.37-2.34-2.31-.3-2.54-.46-2.54-1 0-.45.2-1.05 1.91-1.05 1.53 0 2.09.33 2.32 1.36.02.1.11.18.22.18h.97c.06 0 .11-.02.15-.07.04-.04.06-.09.05-.14-.14-1.67-1.25-2.44-3.72-2.44"/>
            </svg>
            Download Node.js
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </a>
        </div>
      </div>

      <div class="step-connector"></div>

      <div class="step glass-card">
        <div class="step-badge">
          <span class="step-number">2</span>
        </div>
        <div class="step-content">
          <h3>Install globally</h3>
          <p>Run this command in your terminal</p>
          <div class="code-box">
            <code>npm install -g wasibase</code>
            <button class="copy-btn" on:click={() => copyCommand('npm install -g wasibase', 'install')}>
              {#if copied.install}
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
      </div>

      <div class="step-connector"></div>

      <div class="step glass-card">
        <div class="step-badge done">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div class="step-content">
          <h3>Ready to go!</h3>
          <p>Launch wasibase from anywhere</p>
          <div class="code-box">
            <code>wasibase</code>
            <button class="copy-btn" on:click={() => copyCommand('wasibase', 'launch')}>
              {#if copied.launch}
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
      </div>
    </div>

    <div class="commands-section" class:visible>
      <h3 class="commands-title">All Commands</h3>
      <div class="commands-grid">
        {#each commands as { cmd, desc }, i}
          <div class="command-card glass-card" style="animation-delay: {i * 0.05}s">
            <div class="command-main">
              <code class="command-code">{cmd}</code>
              <button class="copy-mini" on:click={() => copyCommand(cmd, cmd)}>
                {#if copied[cmd]}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                {:else}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                {/if}
              </button>
            </div>
            <span class="command-desc">{desc}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .installation {
    padding: 140px 24px;
    position: relative;
    overflow: hidden;
  }

  .bg-glow {
    position: absolute;
    top: 20%;
    right: -200px;
    width: 600px;
    height: 600px;
    background: radial-gradient(ellipse at center, rgba(139, 92, 246, 0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  .container {
    max-width: 900px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  .section-header {
    text-align: center;
    margin-bottom: 70px;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .section-header.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .overline {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--accent-light);
    margin-bottom: 20px;
    padding: 8px 16px;
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: 100px;
  }

  .overline-icon {
    display: flex;
  }

  .section-title {
    font-size: clamp(36px, 5vw, 52px);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.03em;
    color: var(--text);
  }

  .gradient-text {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .install-steps {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    margin-bottom: 80px;
    opacity: 0;
    transform: translateY(40px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
  }

  .install-steps.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .step {
    display: flex;
    gap: 24px;
    max-width: 500px;
    width: 100%;
    padding: 24px;
  }

  .step-badge {
    width: 48px;
    height: 48px;
    background: var(--gradient-primary);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 8px 24px -8px rgba(59, 130, 246, 0.4);
  }

  .step-badge.done {
    background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
    color: #fff;
    box-shadow: 0 8px 24px -8px rgba(16, 185, 129, 0.4);
  }

  .step-number {
    font-size: 20px;
    font-weight: 700;
    color: #fff;
  }

  .step-connector {
    width: 2px;
    height: 40px;
    background: linear-gradient(180deg, var(--accent) 0%, rgba(59, 130, 246, 0.2) 100%);
    margin-left: calc(50% - 1px);
  }

  .step-content {
    padding-top: 4px;
  }

  .step-content h3 {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 6px;
  }

  .step-content p {
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 14px;
  }

  .node-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: 10px;
    color: var(--accent-light);
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s;
  }

  .node-link:hover {
    background: rgba(59, 130, 246, 0.2);
    border-color: rgba(59, 130, 246, 0.4);
    transform: translateY(-2px);
  }

  .code-box {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    background: rgba(10, 15, 30, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    backdrop-filter: blur(10px);
  }

  .code-box code {
    flex: 1;
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    color: var(--accent-light);
  }

  .copy-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    padding: 8px;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .copy-btn:hover {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
  }

  .commands-section {
    padding-top: 60px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    opacity: 0;
    transform: translateY(40px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
  }

  .commands-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .commands-title {
    font-size: 24px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 32px;
    color: #fff;
  }

  .commands-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .command-card {
    padding: 20px;
    transition: all 0.3s;
    animation: fadeInUp 0.4s ease both;
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .command-card:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 255, 255, 0.15);
  }

  .command-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .command-code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    color: #fbbf24;
    font-weight: 500;
  }

  .copy-mini {
    background: transparent;
    border: none;
    padding: 4px;
    color: var(--text-muted);
    cursor: pointer;
    transition: color 0.2s;
    display: flex;
  }

  .copy-mini:hover {
    color: var(--accent-light);
  }

  .command-desc {
    font-size: 13px;
    color: var(--text-secondary);
  }

  @media (max-width: 640px) {
    .installation {
      padding: 100px 20px;
    }

    .step {
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 16px;
    }

    .step-connector {
      margin-left: 0;
    }

    .commands-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
