<script>
  const services = [
    { name: 'Proton Drive', icon: '🔒', color: '#8b5cf6', desc: 'End-to-end encrypted' },
    { name: 'Dropbox', icon: '📦', color: '#00d4ff', desc: 'Widely used' },
    { name: 'iCloud', icon: '☁️', color: '#f472b6', desc: 'Apple ecosystem' },
    { name: 'Google Drive', icon: '🔷', color: '#fbbf24', desc: 'Google integration' }
  ];
</script>

<section class="cloud-sync" id="sync">
  <div class="container">
    <div class="content-wrapper">
      <div class="text-content">
        <span class="overline">Cloud Backup</span>
        <h2 class="section-title">
          Your notes,<br/>everywhere
        </h2>
        <p class="section-desc">
          Wasibase auto-detects your cloud storage. One command syncs everything.
        </p>

        <div class="sync-steps">
          <div class="sync-step">
            <span class="sync-num">1</span>
            <span class="sync-text">Install your preferred cloud client</span>
          </div>
          <div class="sync-step">
            <span class="sync-num">2</span>
            <span class="sync-text">Run <code>wasibase sync</code></span>
          </div>
          <div class="sync-step">
            <span class="sync-num">3</span>
            <span class="sync-text">Done! Notes sync automatically</span>
          </div>
        </div>
      </div>

      <div class="services-grid">
        {#each services as service, i}
          <div class="service-card" style="--accent: {service.color}; animation-delay: {i * 0.1}s">
            <div class="service-icon">{service.icon}</div>
            <div class="service-info">
              <span class="service-name">{service.name}</span>
              <span class="service-desc">{service.desc}</span>
            </div>
            <div class="service-check">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="info-banner">
      <div class="info-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
      </div>
      <div class="info-text">
        <strong>Auto-sync on every action</strong>
        <span>Once configured, wasibase syncs your notes automatically when you create or edit them.</span>
      </div>
    </div>
  </div>
</section>

<style>
  .cloud-sync {
    padding: 120px 24px;
    background: linear-gradient(180deg, #0f0f0f 0%, #0a0a0a 100%);
    position: relative;
    overflow: hidden;
  }

  .cloud-sync::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: 400px;
    background: radial-gradient(ellipse, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }

  .container {
    max-width: 1100px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  .content-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
    margin-bottom: 60px;
  }

  .text-content {
    max-width: 460px;
  }

  .overline {
    display: inline-block;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #8b5cf6;
    margin-bottom: 16px;
  }

  .section-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: clamp(32px, 5vw, 44px);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
  }

  .section-desc {
    font-size: 17px;
    color: #666;
    line-height: 1.7;
    margin-bottom: 36px;
  }

  .sync-steps {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .sync-step {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .sync-num {
    width: 28px;
    height: 28px;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 600;
    color: #666;
  }

  .sync-text {
    font-size: 15px;
    color: #888;
  }

  .sync-text code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: #00ff88;
    background: rgba(0, 255, 136, 0.1);
    padding: 2px 8px;
    border-radius: 4px;
  }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .service-card {
    background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
    border: 1px solid #1a1a1a;
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 14px;
    transition: all 0.3s;
    animation: fadeInUp 0.5s ease both;
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .service-card:hover {
    border-color: var(--accent);
    transform: translateY(-4px);
    box-shadow: 0 15px 40px -15px rgba(0, 0, 0, 0.5);
  }

  .service-icon {
    font-size: 28px;
  }

  .service-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .service-name {
    font-size: 15px;
    font-weight: 600;
    color: #fff;
  }

  .service-desc {
    font-size: 12px;
    color: #555;
  }

  .service-check {
    color: var(--accent);
    opacity: 0.7;
  }

  .info-banner {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 24px;
    background: rgba(0, 255, 136, 0.05);
    border: 1px solid rgba(0, 255, 136, 0.15);
    border-radius: 16px;
  }

  .info-icon {
    color: #00ff88;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .info-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .info-text strong {
    font-size: 15px;
    font-weight: 600;
    color: #fff;
  }

  .info-text span {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
  }

  @media (max-width: 900px) {
    .content-wrapper {
      grid-template-columns: 1fr;
      gap: 50px;
    }

    .text-content {
      max-width: none;
      text-align: center;
    }

    .sync-steps {
      align-items: center;
    }

    .services-grid {
      max-width: 500px;
      margin: 0 auto;
    }
  }

  @media (max-width: 500px) {
    .cloud-sync {
      padding: 80px 24px;
    }

    .services-grid {
      grid-template-columns: 1fr;
    }

    .info-banner {
      flex-direction: column;
      text-align: center;
      align-items: center;
    }
  }
</style>
