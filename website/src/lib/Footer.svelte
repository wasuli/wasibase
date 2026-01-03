<script>
  const year = new Date().getFullYear();
</script>

<footer>
  <div class="container">
    <p class="made-by">Made with ♥ by <a href="https://github.com/wasuli">Wasili</a></p>
    <p class="license">MIT License · {year}</p>
  </div>
</footer>

<style>
  footer {
    padding: 48px 0;
    text-align: center;
    border-top: 1px solid var(--border);
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .made-by {
    color: var(--text-muted);
    font-size: 14px;
    margin-bottom: 8px;
  }

  .made-by a {
    color: var(--accent);
    text-decoration: none;
  }

  .made-by a:hover {
    text-decoration: underline;
  }

  .license {
    color: var(--text-muted);
    font-size: 13px;
    opacity: 0.7;
  }
</style>
