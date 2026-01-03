<script>
  const steps = [
    {
      title: 'Node.js installieren',
      desc: 'Du brauchst Node.js (Version 18+). Download von der offiziellen Seite:',
      code: null,
      link: { url: 'https://nodejs.org', text: 'nodejs.org' }
    },
    {
      title: 'Wasibase installieren',
      desc: 'Oeffne das Terminal und installiere wasibase global:',
      code: 'npm install -g wasibase',
      link: null
    },
    {
      title: 'Fertig!',
      desc: 'Jetzt kannst du wasibase von ueberall starten:',
      code: 'wasibase',
      link: null
    }
  ];

  const commands = [
    { cmd: 'wasibase', desc: 'Kategorien und Notes verwalten' },
    { cmd: 'wasibase note', desc: 'Neue Note erstellen oder bearbeiten' },
    { cmd: 'wasibase search', desc: 'Notes durchsuchen' },
    { cmd: 'wasibase graph', desc: 'Wissens-Graph anzeigen' },
    { cmd: 'wasibase backup', desc: 'Backup erstellen und wiederherstellen' },
    { cmd: 'wasibase sync', desc: 'Mit Cloud synchronisieren' }
  ];
</script>

<section class="installation">
  <div class="container">
    <h2 class="section-title">Installation</h2>

    <div class="steps">
      {#each steps as step, i}
        <div class="step">
          <div class="step-number">{i + 1}</div>
          <div class="step-content">
            <h4>{step.title}</h4>
            <p>{step.desc}</p>
            {#if step.code}
              <div class="code-block">{step.code}</div>
            {/if}
            {#if step.link}
              <a href={step.link.url} class="link-btn" target="_blank" rel="noopener">
                {step.link.text}
              </a>
            {/if}
          </div>
        </div>
      {/each}
    </div>

    <h3 class="commands-title">Befehle</h3>
    <div class="commands">
      {#each commands as cmd}
        <div class="command">
          <span class="command-name">{cmd.cmd}</span>
          <span class="command-desc">{cmd.desc}</span>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .installation {
    padding: 80px 0;
    border-top: 1px solid var(--border);
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .section-title {
    font-size: 32px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 48px;
  }

  .steps {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-bottom: 60px;
  }

  .step {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px;
    display: flex;
    gap: 20px;
    align-items: flex-start;
  }

  .step-number {
    width: 40px;
    height: 40px;
    background: var(--accent);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 18px;
    flex-shrink: 0;
  }

  .step-content h4 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .step-content p {
    font-size: 14px;
    color: var(--text-muted);
    margin-bottom: 12px;
  }

  .code-block {
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px 16px;
    font-family: 'SF Mono', Monaco, monospace;
    font-size: 14px;
    color: var(--accent-green);
  }

  .link-btn {
    display: inline-block;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    color: var(--accent);
    padding: 10px 20px;
    border-radius: 8px;
    text-decoration: none;
    font-size: 14px;
    transition: all 0.15s;
  }

  .link-btn:hover {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
  }

  .commands-title {
    font-size: 24px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 24px;
  }

  .commands {
    display: grid;
    gap: 12px;
  }

  .command {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .command-name {
    font-family: 'SF Mono', Monaco, monospace;
    font-size: 14px;
    color: var(--accent-amber);
    min-width: 180px;
    font-weight: 500;
  }

  .command-desc {
    font-size: 14px;
    color: var(--text-muted);
  }

  @media (max-width: 600px) {
    .step {
      flex-direction: column;
    }

    .command {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .command-name {
      min-width: auto;
    }
  }
</style>
