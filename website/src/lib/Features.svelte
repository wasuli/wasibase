<script>
  import { onMount } from 'svelte';

  let visible = false;

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

    const section = document.querySelector('.features');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  });

  const features = [
    {
      icon: '⚡',
      title: 'Blazingly Fast',
      desc: 'Opens instantly from anywhere in your terminal. No Electron, no bloat.',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
    },
    {
      icon: '🔗',
      title: 'Backlinks',
      desc: 'Connect your thoughts with [[wiki-style]] links. Build your knowledge graph.',
      gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
    },
    {
      icon: '📊',
      title: 'Graph View',
      desc: 'Visualize connections between notes with an interactive D3.js graph.',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
    },
    {
      icon: '🔍',
      title: 'Instant Search',
      desc: 'Full-text search across all your notes. Find anything in milliseconds.',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)'
    },
    {
      icon: '☁️',
      title: 'Cloud Sync',
      desc: 'Auto-detect Proton Drive, Dropbox, iCloud. One command to backup.',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'
    },
    {
      icon: '📝',
      title: 'Markdown Native',
      desc: 'Write in Markdown with live preview. Math symbols, code blocks, everything.',
      gradient: 'linear-gradient(135deg, #f472b6 0%, #fb7185 100%)'
    }
  ];
</script>

<section id="features" class="features">
  <div class="bg-glow"></div>

  <div class="container">
    <div class="section-header" class:visible>
      <span class="overline">
        <span class="overline-icon">✨</span>
        Features
      </span>
      <h2 class="section-title">
        Everything you need.<br/>
        <span class="gradient-text">Nothing you don't.</span>
      </h2>
      <p class="section-desc">
        Built for developers who value speed, simplicity, and powerful connections.
      </p>
    </div>

    <div class="grid" class:visible>
      {#each features as feature, i}
        <div
          class="feature glass-card"
          style="--delay: {i * 0.1}s; --gradient: {feature.gradient}"
        >
          <div class="feature-glow"></div>
          <div class="feature-icon">
            <span>{feature.icon}</span>
          </div>
          <h3>{feature.title}</h3>
          <p>{feature.desc}</p>
          <div class="feature-line"></div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .features {
    padding: 140px 24px;
    position: relative;
    overflow: hidden;
  }

  .bg-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 800px;
    height: 800px;
    background: radial-gradient(ellipse at center, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  .section-header {
    text-align: center;
    margin-bottom: 80px;
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
    font-size: 14px;
  }

  .section-title {
    font-size: clamp(36px, 5vw, 56px);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.03em;
    color: var(--text);
    margin-bottom: 20px;
  }

  .gradient-text {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .section-desc {
    font-size: 18px;
    color: var(--text-secondary);
    max-width: 500px;
    margin: 0 auto;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    opacity: 0;
    transform: translateY(40px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
  }

  .grid.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .feature {
    position: relative;
    padding: 36px 32px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    animation: fadeInUp 0.6s ease forwards;
    animation-delay: var(--delay);
    opacity: 0;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .feature-glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--gradient);
    opacity: 0;
    border-radius: 16px;
    transition: opacity 0.4s;
    filter: blur(40px);
    z-index: -1;
  }

  .feature:hover {
    transform: translateY(-8px);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }

  .feature:hover .feature-glow {
    opacity: 0.15;
  }

  .feature-icon {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--gradient);
    border-radius: 14px;
    margin-bottom: 24px;
    font-size: 28px;
    box-shadow: 0 8px 24px -8px rgba(0, 0, 0, 0.4);
    position: relative;
  }

  .feature-icon::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 15px;
    padding: 1px;
    background: var(--gradient);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.5;
  }

  .feature h3 {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 12px;
    color: #fff;
    letter-spacing: -0.01em;
  }

  .feature p {
    font-size: 15px;
    line-height: 1.7;
    color: var(--text-secondary);
  }

  .feature-line {
    position: absolute;
    bottom: 0;
    left: 32px;
    right: 32px;
    height: 2px;
    background: var(--gradient);
    opacity: 0;
    transform: scaleX(0);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 2px;
  }

  .feature:hover .feature-line {
    opacity: 1;
    transform: scaleX(1);
  }

  @media (max-width: 900px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 600px) {
    .features {
      padding: 100px 20px;
    }

    .section-header {
      margin-bottom: 60px;
    }

    .grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .feature {
      padding: 28px 24px;
    }

    .feature-icon {
      width: 48px;
      height: 48px;
      font-size: 24px;
    }
  }
</style>
