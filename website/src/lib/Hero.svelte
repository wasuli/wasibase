<script>
  import { onMount } from 'svelte';

  let copied = false;
  let typedText = '';

  const installCmd = 'npm install -g wasibase';

  async function copyCommand() {
    await navigator.clipboard.writeText(installCmd);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

  onMount(() => {
    // Typing animation
    let i = 0;
    const interval = setInterval(() => {
      if (i <= installCmd.length) {
        typedText = installCmd.slice(0, i);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  });
</script>

<section class="hero">
  <!-- Animated background -->
  <div class="bg-gradient"></div>
  <div class="bg-grid"></div>
  <div class="bg-glow glow-1"></div>
  <div class="bg-glow glow-2"></div>
  <div class="bg-glow glow-3"></div>

  <!-- Floating orbs -->
  <div class="orb orb-1"></div>
  <div class="orb orb-2"></div>
  <div class="orb orb-3"></div>

  <div class="container">
    <!-- Badge -->
    <div class="badge">
      <span class="badge-dot"></span>
      <span>Open Source</span>
      <span class="badge-sep">·</span>
      <span>MIT License</span>
    </div>

    <!-- Main heading -->
    <h1 class="title">
      Your <span class="gradient-text">Second Brain</span><br/>
      in the Terminal
    </h1>

    <p class="subtitle">
      A blazingly fast note-taking system with backlinks, graph visualization,
      and cloud sync. Built for developers who think in markdown.
    </p>

    <!-- Install terminal -->
    <div class="terminal-wrapper">
      <div class="terminal glass-card">
        <div class="terminal-header">
          <div class="terminal-dots">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <span class="terminal-title">Terminal</span>
        </div>
        <div class="terminal-body">
          <span class="prompt">$</span>
          <code class="command">{typedText}<span class="cursor">|</span></code>
          <button class="copy-btn" on:click={copyCommand} class:copied>
            {#if copied}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            {:else}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            {/if}
          </button>
        </div>
      </div>
      <p class="terminal-note">Requires <a href="https://nodejs.org" target="_blank" rel="noopener">Node.js 18+</a></p>
    </div>

    <!-- CTA Buttons -->
    <div class="cta-group">
      <a href="https://github.com/wasuli/wasibase" class="btn btn-primary" target="_blank" rel="noopener">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        Star on GitHub
      </a>
      <a href="#demo" class="btn btn-secondary">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5 3 19 12 5 21 5 3"/>
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
      <div class="stat-sep"></div>
      <div class="stat">
        <span class="stat-value">&lt;1ms</span>
        <span class="stat-label">Startup Time</span>
      </div>
      <div class="stat-sep"></div>
      <div class="stat">
        <span class="stat-value">∞</span>
        <span class="stat-label">Backlinks</span>
      </div>
    </div>
  </div>

  <!-- Scroll indicator -->
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
    padding: 120px 24px 80px;
  }

  /* Animated background */
  .bg-gradient {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%);
  }

  .bg-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px);
    background-size: 64px 64px;
    mask-image: radial-gradient(ellipse at center, black 0%, transparent 75%);
  }

  .bg-glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.5;
    pointer-events: none;
    animation: float 20s ease-in-out infinite;
  }

  .glow-1 {
    width: 600px;
    height: 600px;
    background: rgba(59, 130, 246, 0.2);
    top: -200px;
    left: 50%;
    transform: translateX(-50%);
  }

  .glow-2 {
    width: 400px;
    height: 400px;
    background: rgba(139, 92, 246, 0.15);
    bottom: 10%;
    right: -100px;
    animation-delay: -5s;
  }

  .glow-3 {
    width: 300px;
    height: 300px;
    background: rgba(6, 182, 212, 0.1);
    bottom: 20%;
    left: -50px;
    animation-delay: -10s;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0) translateX(-50%); }
    50% { transform: translateY(-30px) translateX(-50%); }
  }

  /* Floating orbs */
  .orb {
    position: absolute;
    border-radius: 50%;
    background: var(--gradient-primary);
    opacity: 0.1;
    animation: orbit 30s linear infinite;
  }

  .orb-1 {
    width: 8px;
    height: 8px;
    top: 20%;
    left: 15%;
    animation-duration: 25s;
  }

  .orb-2 {
    width: 6px;
    height: 6px;
    top: 60%;
    right: 20%;
    animation-duration: 35s;
    animation-direction: reverse;
  }

  .orb-3 {
    width: 10px;
    height: 10px;
    bottom: 30%;
    left: 25%;
    animation-duration: 40s;
  }

  @keyframes orbit {
    from { transform: rotate(0deg) translateX(100px) rotate(0deg); }
    to { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
  }

  .container {
    max-width: 800px;
    width: 100%;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  /* Badge */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: 100px;
    font-size: 13px;
    font-weight: 500;
    color: var(--accent-light);
    margin-bottom: 32px;
    animation: fadeInDown 0.6s ease-out;
  }

  .badge-dot {
    width: 8px;
    height: 8px;
    background: var(--accent);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  .badge-sep {
    color: rgba(59, 130, 246, 0.4);
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.2); }
  }

  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Title */
  .title {
    font-size: clamp(40px, 8vw, 72px);
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 24px;
    letter-spacing: -0.03em;
    animation: fadeInUp 0.6s ease-out 0.1s both;
  }

  .gradient-text {
    background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%);
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
    color: var(--text-secondary);
    max-width: 560px;
    margin: 0 auto 48px;
    animation: fadeInUp 0.6s ease-out 0.2s both;
  }

  /* Terminal */
  .terminal-wrapper {
    margin-bottom: 40px;
    animation: fadeInUp 0.6s ease-out 0.3s both;
  }

  .terminal {
    max-width: 520px;
    margin: 0 auto;
    overflow: hidden;
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.05),
      0 25px 80px -20px rgba(0, 0, 0, 0.5),
      0 0 100px -30px rgba(59, 130, 246, 0.3);
  }

  .terminal-header {
    display: flex;
    align-items: center;
    padding: 14px 18px;
    background: rgba(30, 41, 59, 0.5);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .terminal-dots {
    display: flex;
    gap: 8px;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
  }

  .dot:nth-child(1) { background: #ff5f56; }
  .dot:nth-child(2) { background: #ffbd2e; }
  .dot:nth-child(3) { background: #27c93f; }

  .terminal-title {
    flex: 1;
    text-align: center;
    font-size: 13px;
    color: var(--text-muted);
    margin-right: 52px;
  }

  .terminal-body {
    display: flex;
    align-items: center;
    padding: 20px 24px;
    gap: 12px;
    background: rgba(15, 23, 42, 0.6);
  }

  .prompt {
    color: var(--accent);
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600;
  }

  .command {
    flex: 1;
    font-family: 'JetBrains Mono', monospace;
    font-size: 15px;
    color: var(--text);
    text-align: left;
  }

  .cursor {
    color: var(--accent);
    animation: blink 1s step-end infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  .copy-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 10px;
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

  .copy-btn.copied {
    background: #10b981;
    border-color: #10b981;
    color: #fff;
  }

  .terminal-note {
    margin-top: 16px;
    font-size: 13px;
    color: var(--text-muted);
  }

  .terminal-note a {
    color: var(--accent-light);
    text-decoration: none;
  }

  .terminal-note a:hover {
    text-decoration: underline;
  }

  /* CTA Buttons */
  .cta-group {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-bottom: 64px;
    animation: fadeInUp 0.6s ease-out 0.4s both;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 28px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s;
  }

  .btn-primary {
    background: var(--gradient-primary);
    color: #fff;
    box-shadow: 0 4px 20px -4px rgba(59, 130, 246, 0.4);
  }

  .btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px -4px rgba(59, 130, 246, 0.5);
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.05);
    color: var(--text);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }

  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-3px);
  }

  /* Stats */
  .stats {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 32px;
    animation: fadeInUp 0.6s ease-out 0.5s both;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .stat-value {
    font-size: 24px;
    font-weight: 700;
    color: var(--text);
  }

  .stat-label {
    font-size: 13px;
    color: var(--text-muted);
  }

  .stat-sep {
    width: 1px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
  }

  /* Scroll indicator */
  .scroll-indicator {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    animation: fadeInUp 0.6s ease-out 0.7s both;
  }

  .mouse {
    width: 26px;
    height: 42px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 13px;
    display: flex;
    justify-content: center;
    padding-top: 8px;
  }

  .wheel {
    width: 4px;
    height: 8px;
    background: var(--accent);
    border-radius: 2px;
    animation: scroll 2s infinite;
  }

  @keyframes scroll {
    0%, 100% { opacity: 1; transform: translateY(0); }
    50% { opacity: 0.3; transform: translateY(8px); }
  }

  @media (max-width: 640px) {
    .hero {
      padding: 100px 20px 60px;
    }

    .subtitle {
      font-size: 16px;
    }

    .cta-group {
      flex-direction: column;
      align-items: center;
    }

    .btn {
      width: 100%;
      max-width: 280px;
      justify-content: center;
    }

    .stats {
      gap: 20px;
    }

    .stat-value {
      font-size: 20px;
    }

    .terminal-body {
      padding: 16px;
    }

    .command {
      font-size: 13px;
    }
  }
</style>
