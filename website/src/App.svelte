<script>
  import Hero from './lib/Hero.svelte';
  import Features from './lib/Features.svelte';
  import Demo from './lib/Demo.svelte';
  import Installation from './lib/Installation.svelte';
  import CloudSync from './lib/CloudSync.svelte';
  import Footer from './lib/Footer.svelte';
</script>

<main>
  <Hero />
  <Features />
  <Demo />
  <Installation />
  <CloudSync />
  <Footer />
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(html) {
    scroll-behavior: smooth;
  }

  :global(body) {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #0a0a0a;
    color: #e5e5e5;
    line-height: 1.6;
    overflow-x: hidden;
  }

  :global(:root) {
    --bg: #0a0a0a;
    --bg-card: #0f0f0f;
    --bg-elevated: #141414;
    --border: #1a1a1a;
    --border-hover: #333;
    --text: #e5e5e5;
    --text-muted: #666;
    --accent: #00ff88;
    --accent-dim: rgba(0, 255, 136, 0.1);
    --accent-blue: #00d4ff;
    --accent-purple: #8b5cf6;
    --accent-amber: #fbbf24;
    --accent-pink: #f472b6;
    --accent-orange: #fb923c;
  }

  :global(::selection) {
    background: rgba(0, 255, 136, 0.3);
    color: #fff;
  }

  main {
    min-height: 100vh;
  }
</style>
