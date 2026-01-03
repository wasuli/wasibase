<script>
  import { onMount } from 'svelte';

  let scrolled = false;
  let mobileMenuOpen = false;

  onMount(() => {
    const handleScroll = () => {
      scrolled = window.scrollY > 20;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  function toggleMobile() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function closeMobile() {
    mobileMenuOpen = false;
  }
</script>

<nav class:scrolled>
  <div class="nav-container">
    <a href="/" class="logo">
      <div class="logo-mark">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" stroke="url(#logo-grad)" stroke-width="2" fill="none"/>
          <circle cx="16" cy="16" r="4" fill="url(#logo-grad)"/>
          <circle cx="8" cy="10" r="2.5" fill="url(#logo-grad)" opacity="0.8"/>
          <circle cx="24" cy="10" r="2.5" fill="url(#logo-grad)" opacity="0.8"/>
          <circle cx="8" cy="22" r="2.5" fill="url(#logo-grad)" opacity="0.8"/>
          <circle cx="24" cy="22" r="2.5" fill="url(#logo-grad)" opacity="0.8"/>
          <line x1="12.5" y1="14" x2="9.5" y2="11.5" stroke="url(#logo-grad)" stroke-width="1.5" opacity="0.6"/>
          <line x1="19.5" y1="14" x2="22.5" y2="11.5" stroke="url(#logo-grad)" stroke-width="1.5" opacity="0.6"/>
          <line x1="12.5" y1="18" x2="9.5" y2="20.5" stroke="url(#logo-grad)" stroke-width="1.5" opacity="0.6"/>
          <line x1="19.5" y1="18" x2="22.5" y2="20.5" stroke="url(#logo-grad)" stroke-width="1.5" opacity="0.6"/>
          <defs>
            <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32">
              <stop offset="0%" stop-color="#22d3ee"/>
              <stop offset="100%" stop-color="#a855f7"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span class="logo-text">wasibase</span>
    </a>

    <div class="nav-links" class:open={mobileMenuOpen}>
      <a href="#features" on:click={closeMobile}>Features</a>
      <a href="#demo" on:click={closeMobile}>Demo</a>
      <a href="#install" on:click={closeMobile}>Install</a>
      <a href="#sync" on:click={closeMobile}>Cloud</a>
    </div>

    <div class="nav-actions">
      <a href="https://github.com/wasuli/wasibase" class="github-link" target="_blank" rel="noopener" aria-label="GitHub">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      </a>
      <a href="#install" class="cta-btn">
        <span>Get Started</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
    </div>

    <button class="mobile-toggle" on:click={toggleMobile} aria-label="Menu">
      <span class:open={mobileMenuOpen}></span>
    </button>
  </div>
</nav>

<style>
  nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    padding: 16px 24px;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  nav.scrolled {
    background: rgba(3, 3, 8, 0.85);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    padding: 12px 24px;
  }

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
  }

  .logo-mark {
    width: 36px;
    height: 36px;
    position: relative;
  }

  .logo-mark svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 20px rgba(34, 211, 238, 0.4));
    transition: filter 0.3s ease;
  }

  .logo:hover .logo-mark svg {
    filter: drop-shadow(0 0 28px rgba(34, 211, 238, 0.6));
  }

  .logo-text {
    font-size: 22px;
    font-weight: 700;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.03em;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.04);
  }

  .nav-links a {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    padding: 10px 18px;
    border-radius: 10px;
    transition: all 0.25s ease;
    position: relative;
  }

  .nav-links a::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 10px;
    background: var(--gradient-primary);
    opacity: 0;
    transition: opacity 0.25s ease;
  }

  .nav-links a:hover {
    color: #fff;
  }

  .nav-links a:hover::before {
    opacity: 0.1;
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .github-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    color: var(--text-muted);
    text-decoration: none;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.04);
    transition: all 0.3s ease;
  }

  .github-link:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  .cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--gradient-primary);
    color: #000;
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    padding: 12px 20px;
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow:
      0 0 20px -4px rgba(34, 211, 238, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  .cta-btn:hover {
    transform: translateY(-2px);
    box-shadow:
      0 0 32px -4px rgba(34, 211, 238, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  .cta-btn svg {
    transition: transform 0.3s ease;
  }

  .cta-btn:hover svg {
    transform: translateX(3px);
  }

  .mobile-toggle {
    display: none;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    width: 44px;
    height: 44px;
    border-radius: 12px;
    cursor: pointer;
    position: relative;
  }

  .mobile-toggle span {
    display: block;
    width: 20px;
    height: 2px;
    background: #fff;
    position: absolute;
    left: 12px;
    top: 21px;
    transition: all 0.3s;
    border-radius: 1px;
  }

  .mobile-toggle span::before,
  .mobile-toggle span::after {
    content: '';
    display: block;
    width: 20px;
    height: 2px;
    background: #fff;
    position: absolute;
    transition: all 0.3s;
    border-radius: 1px;
  }

  .mobile-toggle span::before { top: -7px; }
  .mobile-toggle span::after { top: 7px; }

  .mobile-toggle span.open {
    background: transparent;
  }

  .mobile-toggle span.open::before {
    top: 0;
    transform: rotate(45deg);
  }

  .mobile-toggle span.open::after {
    top: 0;
    transform: rotate(-45deg);
  }

  @media (max-width: 768px) {
    .nav-links {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(3, 3, 8, 0.98);
      backdrop-filter: blur(24px);
      flex-direction: column;
      justify-content: center;
      gap: 8px;
      border: none;
      border-radius: 0;
      opacity: 0;
      visibility: hidden;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .nav-links.open {
      opacity: 1;
      visibility: visible;
    }

    .nav-links a {
      font-size: 24px;
      font-weight: 600;
      padding: 20px 40px;
    }

    .mobile-toggle {
      display: block;
      z-index: 1001;
    }

    .cta-btn {
      display: none;
    }
  }
</style>
