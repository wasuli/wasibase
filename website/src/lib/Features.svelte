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
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
      title: 'Blazingly Fast',
      desc: 'Opens instantly from anywhere in your terminal. No Electron, no bloat.',
      color: '#f59e0b'
    },
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
      title: 'Backlinks',
      desc: 'Connect your thoughts with [[wiki-style]] links. Build your knowledge graph.',
      color: '#10b981'
    },
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><line x1="14.5" y1="9.5" x2="17.5" y2="6.5"/><line x1="6.5" y1="17.5" x2="9.5" y2="14.5"/></svg>`,
      title: 'Graph View',
      desc: 'Visualize connections between notes with an interactive D3.js graph.',
      color: '#a855f7'
    },
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
      title: 'Instant Search',
      desc: 'Full-text search across all your notes. Find anything in milliseconds.',
      color: '#22d3ee'
    },
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`,
      title: 'Cloud Sync',
      desc: 'Auto-detect Proton Drive, Dropbox, iCloud. One command to backup.',
      color: '#3b82f6'
    },
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>`,
      title: 'Markdown Native',
      desc: 'Write in Markdown with live preview. Math, code blocks, everything.',
      color: '#ec4899'
    }
  ];
</script>

<section id="features" class="features">
  <!-- Background elements -->
  <div class="bg-gradient"></div>
  <div class="bg-orb bg-orb-1"></div>
  <div class="bg-orb bg-orb-2"></div>

  <div class="container">
    <!-- Section header -->
    <header class="section-header" class:visible>
      <div class="section-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        Features
      </div>
      <h2 class="section-title">
        Everything you need.<br/>
        <span class="gradient">Nothing you don't.</span>
      </h2>
      <p class="section-subtitle">
        Built for developers who value speed, simplicity, and powerful connections.
      </p>
    </header>

    <!-- Features grid -->
    <div class="grid" class:visible>
      {#each features as feature, i}
        <article
          class="feature"
          style="--delay: {i * 0.08}s; --accent: {feature.color}"
        >
          <div class="feature-glow"></div>
          <div class="feature-icon">
            {@html feature.icon}
          </div>
          <h3 class="feature-title">{feature.title}</h3>
          <p class="feature-desc">{feature.desc}</p>
          <div class="feature-border"></div>
        </article>
      {/each}
    </div>
  </div>
</section>

<style>
  .features {
    padding: 160px 24px;
    position: relative;
    overflow: hidden;
  }

  /* Background elements */
  .bg-gradient {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    background: radial-gradient(ellipse 60% 40% at 50% 50%, rgba(34, 211, 238, 0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  .bg-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.4;
    pointer-events: none;
  }

  .bg-orb-1 {
    width: 400px;
    height: 400px;
    background: rgba(168, 85, 247, 0.15);
    top: 10%;
    right: -10%;
  }

  .bg-orb-2 {
    width: 300px;
    height: 300px;
    background: rgba(34, 211, 238, 0.1);
    bottom: 10%;
    left: -5%;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  /* Section header */
  .section-header {
    text-align: center;
    margin-bottom: 80px;
    opacity: 0;
    transform: translateY(40px);
    transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .section-header.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .section-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    background: rgba(34, 211, 238, 0.08);
    border: 1px solid rgba(34, 211, 238, 0.15);
    border-radius: 100px;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--accent);
    margin-bottom: 24px;
  }

  .section-badge svg {
    color: var(--accent);
  }

  .section-title {
    font-size: clamp(36px, 6vw, 60px);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.03em;
    color: var(--text);
    margin-bottom: 20px;
  }

  .gradient {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .section-subtitle {
    font-size: 18px;
    color: var(--text-secondary);
    max-width: 480px;
    margin: 0 auto;
  }

  /* Features grid */
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    opacity: 0;
    transform: translateY(40px);
    transition: all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;
  }

  .grid.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .feature {
    position: relative;
    padding: 36px 32px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 20px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
    transform: translateY(20px);
    animation: featureIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    animation-delay: var(--delay);
    overflow: hidden;
  }

  @keyframes featureIn {
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
    height: 120px;
    background: radial-gradient(ellipse at top, var(--accent), transparent 70%);
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  .feature:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-6px);
    box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.4);
  }

  .feature:hover .feature-glow {
    opacity: 0.08;
  }

  .feature-icon {
    width: 52px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    margin-bottom: 24px;
    color: var(--accent);
    transition: all 0.3s ease;
  }

  .feature-icon :global(svg) {
    width: 24px;
    height: 24px;
  }

  .feature:hover .feature-icon {
    background: var(--accent);
    border-color: var(--accent);
    color: #000;
    transform: scale(1.05);
    box-shadow: 0 0 24px -4px var(--accent);
  }

  .feature-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 12px;
    letter-spacing: -0.01em;
  }

  .feature-desc {
    font-size: 15px;
    line-height: 1.7;
    color: var(--text-secondary);
  }

  .feature-border {
    position: absolute;
    bottom: 0;
    left: 24px;
    right: 24px;
    height: 2px;
    background: var(--accent);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 2px;
  }

  .feature:hover .feature-border {
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
    }

    .feature-icon :global(svg) {
      width: 22px;
      height: 22px;
    }
  }
</style>
