<script>
  const year = new Date().getFullYear();
</script>

<footer>
  <div class="footer-glow"></div>
  <div class="container">
    <div class="footer-content">
      <div class="brand">
        <div class="logo-wrap">
          <span class="logo-icon">🧠</span>
          <span class="logo">wasibase</span>
        </div>
        <p class="tagline">Your Second Brain in the Terminal</p>
      </div>

      <div class="links">
        <a href="https://github.com/wasuli/wasibase" target="_blank" rel="noopener" class="link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </a>
        <a href="https://www.npmjs.com/package/wasibase" target="_blank" rel="noopener" class="link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z"/>
          </svg>
          npm
        </a>
      </div>
    </div>

    <div class="footer-bottom">
      <p class="copyright">
        Made with <span class="heart">♥</span> by <a href="https://github.com/wasuli">Wasili</a>
      </p>
      <p class="license">MIT License · {year}</p>
    </div>
  </div>
</footer>

<style>
  footer {
    padding: 80px 24px 48px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    position: relative;
    overflow: hidden;
  }

  .footer-glow {
    position: absolute;
    bottom: -200px;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 400px;
    background: radial-gradient(ellipse at center, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  .container {
    max-width: 1100px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 48px;
  }

  .brand {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .logo-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .logo-icon {
    font-size: 24px;
    filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.5));
  }

  .logo {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.02em;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .tagline {
    font-size: 14px;
    color: var(--text-muted);
  }

  .links {
    display: flex;
    gap: 16px;
  }

  .link {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-secondary);
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    padding: 10px 16px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    transition: all 0.2s;
  }

  .link:hover {
    color: #fff;
    background: rgba(59, 130, 246, 0.1);
    border-color: rgba(59, 130, 246, 0.2);
    transform: translateY(-2px);
  }

  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }

  .copyright {
    font-size: 14px;
    color: var(--text-muted);
  }

  .copyright a {
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 0.2s;
  }

  .copyright a:hover {
    color: var(--accent-light);
  }

  .heart {
    color: #f472b6;
    animation: heartbeat 1.5s ease-in-out infinite;
  }

  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  .license {
    font-size: 13px;
    color: var(--text-muted);
  }

  @media (max-width: 600px) {
    footer {
      padding: 60px 20px 40px;
    }

    .footer-content {
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 32px;
    }

    .brand {
      align-items: center;
    }

    .footer-bottom {
      flex-direction: column;
      gap: 12px;
      text-align: center;
    }
  }
</style>
