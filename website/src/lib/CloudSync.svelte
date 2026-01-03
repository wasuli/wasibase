<script>
  const services = [
    { name: 'Proton Drive', icon: '🔒', desc: 'Ende-zu-Ende verschluesselt' },
    { name: 'Dropbox', icon: '📦', desc: 'Weit verbreitet' },
    { name: 'iCloud', icon: '☁️', desc: 'Apple Ecosystem' },
    { name: 'Google Drive', icon: '🔷', desc: 'Google Integration' }
  ];
</script>

<section class="cloud-sync">
  <div class="container">
    <h2 class="section-title">Cloud-Sync einrichten</h2>
    <p class="section-subtitle">Wasibase erkennt automatisch deine Cloud-Dienste</p>

    <div class="services">
      {#each services as service}
        <div class="service">
          <span class="service-icon">{service.icon}</span>
          <div class="service-info">
            <strong>{service.name}</strong>
            <span>{service.desc}</span>
          </div>
          <span class="check">✓</span>
        </div>
      {/each}
    </div>

    <div class="steps">
      <div class="step">
        <div class="step-icon">1</div>
        <div class="step-content">
          <h4>Cloud-Dienst installieren</h4>
          <p>Installiere z.B. Proton Drive und melde dich an. Der Sync-Ordner wird automatisch erstellt.</p>
        </div>
      </div>

      <div class="step">
        <div class="step-icon">2</div>
        <div class="step-content">
          <h4>Sync starten</h4>
          <div class="code">wasibase sync</div>
          <p>Wasibase erkennt automatisch Proton Drive, Dropbox, iCloud und Google Drive.</p>
        </div>
      </div>

      <div class="step">
        <div class="step-icon">3</div>
        <div class="step-content">
          <h4>Ordner erstellen lassen</h4>
          <p>Wasibase fragt, ob ein "Wasibase" Ordner erstellt werden soll - bestaetigen und fertig!</p>
        </div>
      </div>
    </div>

    <div class="info-box">
      <div class="info-icon">💡</div>
      <div class="info-content">
        <strong>Tipp:</strong> Deine Notes werden als kompakte JSON-Datei gespeichert.
        Fuehre <code>wasibase sync</code> regelmaessig aus, um deine Daten zu sichern.
      </div>
    </div>
  </div>
</section>

<style>
  .cloud-sync {
    padding: 80px 0;
    background: var(--bg-card);
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
    margin-bottom: 8px;
  }

  .section-subtitle {
    text-align: center;
    color: var(--text-muted);
    margin-bottom: 40px;
  }

  .services {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    margin-bottom: 48px;
  }

  .service {
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .service-icon {
    font-size: 24px;
  }

  .service-info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .service-info strong {
    font-size: 14px;
  }

  .service-info span {
    font-size: 12px;
    color: var(--text-muted);
  }

  .check {
    color: var(--accent-green);
    font-size: 18px;
  }

  .steps {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-bottom: 40px;
  }

  .step {
    display: flex;
    gap: 20px;
    align-items: flex-start;
  }

  .step-icon {
    width: 36px;
    height: 36px;
    background: var(--accent-purple);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    flex-shrink: 0;
  }

  .step-content h4 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .step-content p {
    font-size: 14px;
    color: var(--text-muted);
    line-height: 1.6;
  }

  .code {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 8px 12px;
    font-family: 'SF Mono', Monaco, monospace;
    font-size: 13px;
    color: var(--accent-green);
    display: inline-block;
    margin: 8px 0;
  }

  .info-box {
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 12px;
    padding: 20px;
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }

  .info-icon {
    font-size: 24px;
  }

  .info-content {
    font-size: 14px;
    color: var(--text-muted);
    line-height: 1.6;
  }

  .info-content strong {
    color: var(--text);
  }

  .info-content code {
    background: var(--bg);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'SF Mono', Monaco, monospace;
    font-size: 13px;
    color: var(--accent-amber);
  }
</style>
