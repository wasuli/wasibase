<script>
  import { onMount } from 'svelte';

  let copied = false;
  let typedText = '';
  let showCursor = true;
  let mounted = false;

  const installCmd = 'npm install -g wasibase';

  async function copyCommand() {
    await navigator.clipboard.writeText(installCmd);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

  onMount(() => {
    mounted = true;

    // Typing animation
    let i = 0;
    const interval = setInterval(() => {
      if (i <= installCmd.length) {
        typedText = installCmd.slice(0, i);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 60);

    return () => clearInterval(interval);
  });
</script>

<section class="hero">
  <!-- Aurora background -->
  <div class="aurora">
    <div class="aurora-1"></div>
    <div class="aurora-2"></div>
    <div class="aurora-3"></div>
  </div>

  <!-- Grid overlay -->
  <div class="grid-overlay"></div>

  <!-- Radial glow -->
  <div class="radial-glow"></div>

  <div class="container" class:mounted>
    <!-- Eyebrow -->
    <div class="eyebrow">
      <div class="eyebrow-dot"></div>
      <span>Open Source</span>
      <span class="eyebrow-divider">/</span>
      <span>MIT License</span>
    </div>

    <!-- Headline -->
    <h1 class="headline">
      <span class="line">Your</span>
      <span class="line gradient">Second Brain</span>
      <span class="line">in the Terminal</span>
    </h1>

    <!-- Subheadline -->
    <p class="subheadline">
      A blazingly fast note-taking system with backlinks,<br class="mobile-hide" />
      graph visualization, and cloud sync.
    </p>

    <!-- Terminal -->
    <div class="terminal-container">
      <div class="terminal">
        <div class="terminal-chrome">
          <div class="terminal-buttons">
            <span class="btn-close"></span>
            <span class="btn-minimize"></span>
            <span class="btn-maximize"></span>
          </div>
          <div class="terminal-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="4 17 10 11 4 5"/>
              <line x1="12" y1="19" x2="20" y2="19"/>
            </svg>
            Terminal
          </div>
          <div class="terminal-spacer"></div>
        </div>
        <div class="terminal-content">
          <div class="terminal-line">
            <span class="prompt">
              <span class="prompt-user">~</span>
              <span class="prompt-symbol">❯</span>
            </span>
            <code class="command">{typedText}{#if showCursor}<span class="cursor"></span>{/if}</code>
            <button class="copy-btn" on:click={copyCommand} class:copied aria-label="Copy command">
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
      </div>
      <p class="terminal-hint">Requires <a href="https://nodejs.org" target="_blank" rel="noopener">Node.js 18+</a></p>
    </div>

    <!-- CTA -->
    <div class="cta-row">
      <a href="https://github.com/wasuli/wasibase" class="btn btn-primary" target="_blank" rel="noopener">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        Star on GitHub
      </a>
      <a href="#demo" class="btn btn-ghost">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/>
        </svg>
        Watch Demo
      </a>
    </div>

    <!-- Stats -->
    <div class="stats">
      <div class="stat">
        <span class="stat-value">100%</span>
        <span class="stat-label">Open Source</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat">
        <span class="stat-value">&lt;1ms</span>
        <span class="stat-label">Startup Time</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat">
        <span class="stat-value">∞</span>
        <span class="stat-label">Backlinks</span>
      </div>
    </div>
  </div>

  <!-- Scroll indicator -->
  <div class="scroll-hint">
    <div class="scroll-line"></div>
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
    padding: 140px 24px 100px;
  }

  /* Aurora background */
  .aurora {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .aurora-1, .aurora-2, .aurora-3 {
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    opacity: 0.5;
    animation: aurora 15s ease-in-out infinite;
  }

  .aurora-1 {
    width: 60vw;
    height: 60vw;
    max-width: 800px;
    max-height: 800px;
    background: radial-gradient(circle, rgba(34, 211, 238, 0.25) 0%, transparent 70%);
    top: -20%;
    left: 50%;
    transform: translateX(-50%);
  }

  .aurora-2 {
    width: 40vw;
    height: 40vw;
    max-width: 500px;
    max-height: 500px;
    background: radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%);
    bottom: 10%;
    right: -10%;
    animation-delay: -5s;
  }

  .aurora-3 {
    width: 35vw;
    height: 35vw;
    max-width: 400px;
    max-height: 400px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
    bottom: 20%;
    left: -5%;
    animation-delay: -10s;
  }

  @keyframes aurora {
    0%, 100% { transform: translateX(-50%) translateY(0) scale(1); }
    33% { transform: translateX(-50%) translateY(-20px) scale(1.05); }
    66% { transform: translateX(-50%) translateY(10px) scale(0.95); }
  }

  /* Grid overlay */
  .grid-overlay {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 80px 80px;
    mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 100%);
  }

  /* Radial glow */
  .radial-glow {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 70%;
    background: radial-gradient(ellipse 50% 80% at 50% 0%, rgba(34, 211, 238, 0.08) 0%, transparent 100%);
    pointer-events: none;
  }

  .container {
    max-width: 900px;
    width: 100%;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  /* Staggered entrance animations */
  .container > * {
    opacity: 0;
    transform: translateY(24px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .container.mounted > * {
    opacity: 1;
    transform: translateY(0);
  }

  .container.mounted > *:nth-child(1) { transition-delay: 0s; }
  .container.mounted > *:nth-child(2) { transition-delay: 0.1s; }
  .container.mounted > *:nth-child(3) { transition-delay: 0.2s; }
  .container.mounted > *:nth-child(4) { transition-delay: 0.3s; }
  .container.mounted > *:nth-child(5) { transition-delay: 0.4s; }
  .container.mounted > *:nth-child(6) { transition-delay: 0.5s; }

  /* Eyebrow */
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 18px;
    background: rgba(34, 211, 238, 0.08);
    border: 1px solid rgba(34, 211, 238, 0.15);
    border-radius: 100px;
    font-size: 13px;
    font-weight: 500;
    color: var(--accent);
    margin-bottom: 32px;
    letter-spacing: 0.02em;
  }

  .eyebrow-dot {
    width: 8px;
    height: 8px;
    background: var(--accent);
    border-radius: 50%;
    animation: pulse 2.5s ease-in-out infinite;
    box-shadow: 0 0 12px rgba(34, 211, 238, 0.6);
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.15); }
  }

  .eyebrow-divider {
    color: rgba(34, 211, 238, 0.3);
  }

  /* Headline */
  .headline {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: clamp(48px, 10vw, 84px);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.04em;
    margin-bottom: 24px;
  }

  .headline .line {
    display: block;
  }

  .headline .gradient {
    background: var(--gradient-text);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 40px rgba(34, 211, 238, 0.3));
  }

  /* Subheadline */
  .subheadline {
    font-size: 19px;
    line-height: 1.7;
    color: var(--text-secondary);
    margin-bottom: 48px;
  }

  .mobile-hide {
    display: none;
  }

  @media (min-width: 640px) {
    .mobile-hide {
      display: inline;
    }
  }

  /* Terminal */
  .terminal-container {
    margin-bottom: 40px;
  }

  .terminal {
    max-width: 560px;
    margin: 0 auto;
    background: rgba(8, 8, 16, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    overflow: hidden;
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.03),
      0 32px 64px -16px rgba(0, 0, 0, 0.6),
      0 0 80px -20px rgba(34, 211, 238, 0.2);
    backdrop-filter: blur(20px);
  }

  .terminal-chrome {
    display: flex;
    align-items: center;
    padding: 14px 18px;
    background: rgba(255, 255, 255, 0.02);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
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

  .btn-close { background: #ff5f57; }
  .btn-minimize { background: #febc2e; }
  .btn-maximize { background: #28c840; }

  .terminal-title {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 12px;
    color: var(--text-muted);
    font-weight: 500;
  }

  .terminal-spacer {
    width: 52px;
  }

  .terminal-content {
    padding: 20px 24px;
  }

  .terminal-line {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .prompt {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
  }

  .prompt-user {
    color: var(--accent);
  }

  .prompt-symbol {
    color: var(--accent-secondary);
  }

  .command {
    flex: 1;
    font-family: 'JetBrains Mono', monospace;
    font-size: 15px;
    color: var(--text);
    text-align: left;
  }

  .cursor {
    display: inline-block;
    width: 9px;
    height: 20px;
    background: var(--accent);
    margin-left: 2px;
    animation: blink 1s step-end infinite;
    vertical-align: text-bottom;
    border-radius: 1px;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  .copy-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.25s ease;
  }

  .copy-btn:hover {
    background: var(--accent);
    border-color: var(--accent);
    color: #000;
    transform: scale(1.05);
  }

  .copy-btn.copied {
    background: #10b981;
    border-color: #10b981;
    color: #fff;
  }

  .terminal-hint {
    margin-top: 16px;
    font-size: 13px;
    color: var(--text-muted);
  }

  .terminal-hint a {
    color: var(--accent);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s;
  }

  .terminal-hint a:hover {
    border-color: var(--accent);
  }

  /* CTA */
  .cta-row {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-bottom: 64px;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 16px 28px;
    border-radius: 14px;
    font-size: 15px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .btn-primary {
    background: var(--gradient-primary);
    color: #000;
    box-shadow:
      0 0 24px -4px rgba(34, 211, 238, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  .btn-primary:hover {
    transform: translateY(-3px);
    box-shadow:
      0 0 40px -4px rgba(34, 211, 238, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  .btn-ghost {
    background: rgba(255, 255, 255, 0.03);
    color: var(--text);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .btn-ghost:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-3px);
  }

  /* Stats */
  .stats {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 40px;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .stat-value {
    font-size: 28px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.02em;
  }

  .stat-label {
    font-size: 13px;
    color: var(--text-muted);
    font-weight: 500;
  }

  .stat-divider {
    width: 1px;
    height: 44px;
    background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.1), transparent);
  }

  /* Scroll indicator */
  .scroll-hint {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
  }

  .scroll-line {
    width: 1px;
    height: 48px;
    background: linear-gradient(to bottom, var(--accent), transparent);
    animation: scrollPulse 2s ease-in-out infinite;
  }

  @keyframes scrollPulse {
    0%, 100% { opacity: 0.6; height: 48px; }
    50% { opacity: 1; height: 64px; }
  }

  @media (max-width: 640px) {
    .hero {
      padding: 120px 20px 80px;
    }

    .headline {
      font-size: clamp(36px, 12vw, 48px);
    }

    .subheadline {
      font-size: 16px;
    }

    .cta-row {
      flex-direction: column;
      align-items: center;
    }

    .btn {
      width: 100%;
      max-width: 280px;
      justify-content: center;
    }

    .stats {
      gap: 24px;
    }

    .stat-value {
      font-size: 22px;
    }

    .terminal-content {
      padding: 16px;
    }

    .command {
      font-size: 13px;
    }
  }
</style>
