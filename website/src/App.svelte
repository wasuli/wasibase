<script>
  import Nav from './lib/Nav.svelte';
  import Hero from './lib/Hero.svelte';
  import Features from './lib/Features.svelte';
  import Demo from './lib/Demo.svelte';
  import Installation from './lib/Installation.svelte';
  import CloudSync from './lib/CloudSync.svelte';
  import Footer from './lib/Footer.svelte';
</script>

<div class="noise"></div>
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
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');

  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(html) {
    scroll-behavior: smooth;
  }

  :global(body) {
    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #030308;
    color: #e4e4e7;
    line-height: 1.6;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  :global(:root) {
    /* Deep space base */
    --bg: #030308;
    --bg-elevated: rgba(12, 12, 20, 0.8);
    --bg-card: rgba(16, 16, 28, 0.6);

    /* Glass effects */
    --glass: rgba(255, 255, 255, 0.02);
    --glass-border: rgba(255, 255, 255, 0.06);
    --glass-hover: rgba(255, 255, 255, 0.04);

    /* Borders */
    --border: rgba(255, 255, 255, 0.08);
    --border-hover: rgba(255, 255, 255, 0.15);

    /* Text hierarchy */
    --text: #fafafa;
    --text-secondary: #a1a1aa;
    --text-muted: #71717a;

    /* Signature colors - Electric cyan + violet */
    --accent: #22d3ee;
    --accent-secondary: #a855f7;
    --accent-tertiary: #3b82f6;

    /* Gradients */
    --gradient-primary: linear-gradient(135deg, #22d3ee 0%, #a855f7 100%);
    --gradient-secondary: linear-gradient(135deg, #3b82f6 0%, #22d3ee 100%);
    --gradient-text: linear-gradient(135deg, #22d3ee 0%, #a855f7 50%, #ec4899 100%);
    --gradient-glow: radial-gradient(ellipse at center, rgba(34, 211, 238, 0.12) 0%, transparent 70%);

    /* Shadows */
    --shadow-glow: 0 0 60px -12px rgba(34, 211, 238, 0.4);
  }

  :global(::selection) {
    background: rgba(34, 211, 238, 0.25);
    color: #fff;
  }

  :global(::-webkit-scrollbar) {
    width: 6px;
  }

  :global(::-webkit-scrollbar-track) {
    background: transparent;
  }

  :global(::-webkit-scrollbar-thumb) {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  :global(::-webkit-scrollbar-thumb:hover) {
    background: rgba(255, 255, 255, 0.2);
  }

  /* Noise overlay for texture */
  .noise {
    position: fixed;
    inset: 0;
    z-index: 9999;
    pointer-events: none;
    opacity: 0.015;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  }

  main {
    min-height: 100vh;
    position: relative;
  }

  /* Global card styles */
  :global(.glass-card) {
    background: var(--glass);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  :global(.glass-card:hover) {
    background: var(--glass-hover);
    border-color: var(--border-hover);
  }

  /* Section utility */
  :global(.section) {
    position: relative;
    padding: 160px 24px;
  }

  :global(.section-container) {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }
</style>
