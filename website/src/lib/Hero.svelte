<script>
  const githubUrl = 'https://github.com/wasuli/wasibase';
  const npmUrl = 'https://www.npmjs.com/package/wasibase';

  let copied = false;

  async function copyCommand() {
    await navigator.clipboard.writeText('npm install -g wasibase');
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
</script>

<section class="hero">
  <div class="container">
    <h1 class="logo">Wasibase</h1>
    <p class="tagline">Dein Second Brain. Terminal-basiert. Mit Backlinks.</p>

    <div class="install-box">
      <code class="install-command">npm install -g wasibase</code>
      <button class="copy-btn" on:click={copyCommand}>
        {#if copied}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        {:else}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        {/if}
      </button>
    </div>

    <div class="hero-buttons">
      <a href={npmUrl} class="btn btn-primary" target="_blank" rel="noopener">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z"/>
        </svg>
        npm Package
      </a>
      <a href={githubUrl} class="btn btn-secondary" target="_blank" rel="noopener">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        GitHub
      </a>
    </div>
  </div>
</section>

<style>
  .hero {
    padding: 100px 0 80px;
    text-align: center;
    background: radial-gradient(ellipse at top, #1a1a2e 0%, var(--bg) 70%);
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .logo {
    font-size: 64px;
    font-weight: 700;
    background: linear-gradient(135deg, var(--accent), var(--accent-purple));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 16px;
  }

  .tagline {
    font-size: 22px;
    color: var(--text-muted);
    margin-bottom: 32px;
  }

  .install-box {
    display: inline-flex;
    align-items: center;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px 20px;
    margin-bottom: 32px;
    gap: 16px;
  }

  .install-command {
    font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
    font-size: 18px;
    color: var(--accent-green);
    user-select: all;
  }

  .copy-btn {
    background: var(--border);
    border: none;
    border-radius: 8px;
    padding: 8px;
    cursor: pointer;
    color: var(--text-muted);
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .copy-btn:hover {
    background: var(--accent);
    color: white;
  }

  .hero-buttons {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 16px 32px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s;
    border: none;
    cursor: pointer;
  }

  .btn-primary {
    background: #cb3837;
    color: white;
  }

  .btn-primary:hover {
    background: #b52e2d;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(203, 56, 55, 0.3);
  }

  .btn-secondary {
    background: var(--bg-card);
    color: var(--text);
    border: 1px solid var(--border);
  }

  .btn-secondary:hover {
    background: var(--border);
    transform: translateY(-2px);
  }

  @media (max-width: 600px) {
    .hero {
      padding: 60px 0 40px;
    }

    .logo {
      font-size: 48px;
    }

    .tagline {
      font-size: 18px;
    }

    .install-box {
      flex-direction: column;
      gap: 12px;
      width: 100%;
    }

    .install-command {
      font-size: 15px;
    }

    .btn {
      padding: 14px 24px;
      font-size: 15px;
    }
  }
</style>
