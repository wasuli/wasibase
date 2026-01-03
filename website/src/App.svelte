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
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #0a0a0a;
    color: #e5e5e5;
    line-height: 1.6;
  }

  :global(:root) {
    --bg: #0a0a0a;
    --bg-card: #141414;
    --bg-elevated: #1a1a1a;
    --border: #262626;
    --text: #e5e5e5;
    --text-muted: #888;
    --accent: #3b82f6;
    --accent-hover: #2563eb;
    --accent-green: #10b981;
    --accent-amber: #f59e0b;
    --accent-purple: #8b5cf6;
    --accent-red: #ef4444;
  }

  main {
    min-height: 100vh;
  }
</style>
