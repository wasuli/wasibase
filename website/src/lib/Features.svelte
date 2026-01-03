<script>
  const features = [
    { icon: '📝', title: 'Markdown Notes', desc: 'Schreibe deine Notizen in Markdown mit Live-Vorschau im Browser.' },
    { icon: '🔗', title: 'Backlinks', desc: 'Verknuepfe Wissen mit [[Backlinks]] wie in Obsidian oder Roam.' },
    { icon: '📊', title: 'Graph View', desc: 'Visualisiere dein Wissen als interaktiven D3.js Graph.' },
    { icon: '🔍', title: 'Schnelle Suche', desc: 'Finde jede Note sofort mit der integrierten Suche.' },
    { icon: '☁️', title: 'Cloud Backup', desc: 'Automatisches Backup zu Proton Drive, Dropbox oder iCloud.' },
    { icon: '⌨️', title: 'Terminal First', desc: 'Schnell und effizient direkt aus dem Terminal.' }
  ];
</script>

<section class="features">
  <div class="container">
    <div class="grid">
      {#each features as feature}
        <div class="feature">
          <div class="feature-icon">{feature.icon}</div>
          <h3>{feature.title}</h3>
          <p>{feature.desc}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .features {
    padding: 80px 0;
  }

  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 24px;
  }

  .feature {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px;
    transition: all 0.2s;
  }

  .feature:hover {
    border-color: var(--accent);
    transform: translateY(-4px);
  }

  .feature-icon {
    font-size: 36px;
    margin-bottom: 16px;
  }

  .feature h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--text);
  }

  .feature p {
    font-size: 14px;
    color: var(--text-muted);
    line-height: 1.6;
  }
</style>
