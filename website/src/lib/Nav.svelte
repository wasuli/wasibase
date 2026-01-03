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
      <img src="/wasibase/images/logo.svg" alt="Wasibase" class="logo-icon" />
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      </a>
      <a href="#install" class="cta-btn">Get Started</a>
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
    padding: 20px 24px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  nav.scrolled {
    background: rgba(5, 5, 16, 0.8);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding: 14px 24px;
  }

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    font-weight: 700;
    font-size: 20px;
  }

  .logo-icon {
    width: 32px;
    height: 32px;
    filter: drop-shadow(0 0 12px rgba(59, 130, 246, 0.6));
    transition: filter 0.3s ease;
  }

  .logo:hover .logo-icon {
    filter: drop-shadow(0 0 16px rgba(59, 130, 246, 0.8));
  }

  .logo-text {
    background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.02em;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .nav-links a {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 0.2s;
  }

  .nav-links a:hover {
    color: #fff;
    background: rgba(59, 130, 246, 0.1);
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
    width: 40px;
    height: 40px;
    color: var(--text-secondary);
    text-decoration: none;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.2s;
  }

  .github-link:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  .cta-btn {
    background: var(--gradient-primary);
    color: #fff;
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    padding: 10px 22px;
    border-radius: 10px;
    transition: all 0.3s;
    box-shadow: 0 4px 16px -4px rgba(59, 130, 246, 0.4);
  }

  .cta-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px -4px rgba(59, 130, 246, 0.5);
  }

  .mobile-toggle {
    display: none;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    width: 40px;
    height: 40px;
    border-radius: 10px;
    cursor: pointer;
    position: relative;
  }

  .mobile-toggle span {
    display: block;
    width: 18px;
    height: 2px;
    background: #fff;
    position: absolute;
    left: 11px;
    top: 19px;
    transition: all 0.3s;
    border-radius: 1px;
  }

  .mobile-toggle span::before,
  .mobile-toggle span::after {
    content: '';
    display: block;
    width: 18px;
    height: 2px;
    background: #fff;
    position: absolute;
    transition: all 0.3s;
    border-radius: 1px;
  }

  .mobile-toggle span::before {
    top: -6px;
  }

  .mobile-toggle span::after {
    top: 6px;
  }

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
      background: rgba(5, 5, 16, 0.98);
      backdrop-filter: blur(20px);
      flex-direction: column;
      justify-content: center;
      gap: 8px;
      border: none;
      border-radius: 0;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s;
    }

    .nav-links.open {
      opacity: 1;
      visibility: visible;
    }

    .nav-links a {
      font-size: 20px;
      padding: 16px 32px;
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
