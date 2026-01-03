<script>
  import Nav from './lib/Nav.svelte';
  import Hero from './lib/Hero.svelte';
  import Features from './lib/Features.svelte';
  import Demo from './lib/Demo.svelte';
  import Installation from './lib/Installation.svelte';
  import CloudSync from './lib/CloudSync.svelte';
  import Footer from './lib/Footer.svelte';
</script>

<Nav />
<main>
  <Hero />
  <Features />
  <Demo />
  <Installation />
  <CloudSync />
  <Footer />
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(html) {
    scroll-behavior: smooth;
  }

  :global(body) {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #050510;
    color: #e2e8f0;
    line-height: 1.6;
    overflow-x: hidden;
  }

  :global(:root) {
    /* Dark blue base */
    --bg: #050510;
    --bg-card: rgba(15, 23, 42, 0.6);
    --bg-elevated: rgba(30, 41, 59, 0.5);

    /* Glassmorphism */
    --glass: rgba(255, 255, 255, 0.03);
    --glass-border: rgba(255, 255, 255, 0.08);
    --glass-hover: rgba(255, 255, 255, 0.06);

    /* Borders */
    --border: rgba(148, 163, 184, 0.1);
    --border-hover: rgba(148, 163, 184, 0.2);

    /* Text */
    --text: #f1f5f9;
    --text-secondary: #94a3b8;
    --text-muted: #64748b;

    /* Blue accent palette */
    --accent: #3b82f6;
    --accent-light: #60a5fa;
    --accent-dark: #2563eb;
    --accent-glow: rgba(59, 130, 246, 0.4);

    /* Secondary accents */
    --cyan: #06b6d4;
    --purple: #8b5cf6;
    --emerald: #10b981;

    /* Gradients */
    --gradient-primary: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    --gradient-secondary: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
    --gradient-glow: radial-gradient(ellipse at center, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
  }

  :global(::selection) {
    background: rgba(59, 130, 246, 0.3);
    color: #fff;
  }

  :global(::-webkit-scrollbar) {
    width: 8px;
  }

  :global(::-webkit-scrollbar-track) {
    background: var(--bg);
  }

  :global(::-webkit-scrollbar-thumb) {
    background: var(--border);
    border-radius: 4px;
  }

  :global(::-webkit-scrollbar-thumb:hover) {
    background: var(--border-hover);
  }

  main {
    min-height: 100vh;
    position: relative;
  }

  /* Global glass card utility */
  :global(.glass-card) {
    background: var(--glass);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
  }

  :global(.glass-card:hover) {
    background: var(--glass-hover);
    border-color: var(--border-hover);
  }
</style>
