<script>
  import { onMount } from 'svelte';

  let visible = false;

  const services = [
    { name: 'Proton Drive', icon: '🔒', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)', desc: 'End-to-end encrypted' },
    { name: 'Dropbox', icon: '📦', gradient: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)', desc: 'Widely used' },
    { name: 'iCloud', icon: '☁️', gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)', desc: 'Apple ecosystem' },
    { name: 'Google Drive', icon: '🔷', gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', desc: 'Google integration' }
  ];

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

    const section = document.querySelector('.cloud-sync');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  });
</script>

<section class="cloud-sync" id="sync">
  <div class="bg-glow"></div>
  <div class="bg-glow-2"></div>

  <div class="container">
    <div class="content-wrapper" class:visible>
      <div class="text-content">
        <span class="overline">
          <span class="overline-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
            </svg>
          </span>
          Cloud Backup
        </span>
        <h2 class="section-title">
          Your notes,<br/>
          <span class="gradient-text">everywhere</span>
        </h2>
        <p class="section-desc">
          Wasibase auto-detects your cloud storage. One command syncs everything securely.
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
          <div class="service-card glass-card" style="--gradient: {service.gradient}; animation-delay: {i * 0.1}s">
            <div class="service-icon-wrap">
              <span class="service-icon">{service.icon}</span>
            </div>
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

    <div class="info-banner glass-card" class:visible>
      <div class="info-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
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
    padding: 140px 24px;
    position: relative;
    overflow: hidden;
  }

  .bg-glow {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: 500px;
    background: radial-gradient(ellipse, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }

  .bg-glow-2 {
    position: absolute;
    bottom: -200px;
    right: -200px;
    width: 600px;
    height: 600px;
    background: radial-gradient(ellipse, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
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
    opacity: 0;
    transform: translateY(40px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .content-wrapper.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .text-content {
    max-width: 460px;
  }

  .overline {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--purple);
    margin-bottom: 20px;
    padding: 8px 16px;
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.2);
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
    margin-bottom: 20px;
  }

  .gradient-text {
    background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .section-desc {
    font-size: 18px;
    color: var(--text-secondary);
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
    width: 32px;
    height: 32px;
    background: rgba(139, 92, 246, 0.15);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    color: var(--purple);
  }

  .sync-text {
    font-size: 15px;
    color: var(--text-secondary);
  }

  .sync-text code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: var(--accent-light);
    background: rgba(59, 130, 246, 0.15);
    padding: 3px 10px;
    border-radius: 6px;
    border: 1px solid rgba(59, 130, 246, 0.2);
  }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .service-card {
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
    transform: translateY(-4px);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 15px 40px -15px rgba(0, 0, 0, 0.5);
  }

  .service-icon-wrap {
    width: 44px;
    height: 44px;
    background: var(--gradient);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .service-icon {
    font-size: 22px;
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
    color: var(--text-muted);
  }

  .service-check {
    color: #10b981;
    opacity: 0.8;
  }

  .info-banner {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 24px 28px;
    background: rgba(16, 185, 129, 0.05);
    border-color: rgba(16, 185, 129, 0.15);
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s;
  }

  .info-banner.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .info-icon {
    color: #10b981;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .info-text {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .info-text strong {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
  }

  .info-text span {
    font-size: 14px;
    color: var(--text-secondary);
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
      padding: 100px 20px;
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
