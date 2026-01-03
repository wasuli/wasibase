<script>
  const features = [
    {
      icon: '⚡',
      title: 'Blazingly Fast',
      desc: 'Opens instantly from anywhere in your terminal. No Electron, no bloat.',
      color: '#fbbf24'
    },
    {
      icon: '🔗',
      title: 'Backlinks',
      desc: 'Connect your thoughts with [[wiki-style]] links. Build your knowledge graph.',
      color: '#00ff88'
    },
    {
      icon: '📊',
      title: 'Graph View',
      desc: 'Visualize connections between notes with an interactive D3.js graph.',
      color: '#8b5cf6'
    },
    {
      icon: '🔍',
      title: 'Instant Search',
      desc: 'Full-text search across all your notes. Find anything in milliseconds.',
      color: '#00d4ff'
    },
    {
      icon: '☁️',
      title: 'Cloud Sync',
      desc: 'Auto-detect Proton Drive, Dropbox, iCloud. One command to backup.',
      color: '#f472b6'
    },
    {
      icon: '📝',
      title: 'Markdown Native',
      desc: 'Write in Markdown with live preview. Math symbols, code blocks, everything.',
      color: '#fb923c'
    }
  ];
</script>

<section class="features">
  <div class="container">
    <div class="section-header">
      <span class="overline">Features</span>
      <h2 class="section-title">Everything you need.<br/>Nothing you don't.</h2>
    </div>

    <div class="grid">
      {#each features as feature, i}
        <div class="feature" style="--delay: {i * 0.1}s; --accent: {feature.color}">
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
    padding: 120px 24px;
    position: relative;
  }

  .container {
    max-width: 1100px;
    margin: 0 auto;
  }

  .section-header {
    text-align: center;
    margin-bottom: 80px;
  }

  .overline {
    display: inline-block;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #00ff88;
    margin-bottom: 16px;
  }

  .section-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .feature {
    background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
    border: 1px solid #1a1a1a;
    border-radius: 16px;
    padding: 32px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .feature::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }

  .feature:hover {
    border-color: #333;
    transform: translateY(-4px);
    box-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.5);
  }

  .feature:hover::before {
    opacity: 1;
  }

  .feature-icon {
    font-size: 40px;
    margin-bottom: 20px;
    display: inline-block;
  }

  .feature h3 {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #fff;
  }

  .feature p {
    font-size: 15px;
    line-height: 1.6;
    color: #666;
  }

  @media (max-width: 900px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 600px) {
    .features {
      padding: 80px 24px;
    }

    .grid {
      grid-template-columns: 1fr;
    }

    .feature {
      padding: 24px;
    }
  }
</style>
