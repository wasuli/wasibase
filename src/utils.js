/**
 * Utility functions for Wasibase
 */

import net from 'net';

/**
 * Find an available port starting from the given port
 */
export async function findAvailablePort(startPort = 3333) {
  const checkPort = (port) => {
    return new Promise((resolve) => {
      const server = net.createServer();
      server.listen(port, () => {
        server.close(() => resolve(port));
      });
      server.on('error', () => resolve(null));
    });
  };

  for (let port = startPort; port < startPort + 100; port++) {
    const available = await checkPort(port);
    if (available) return available;
  }

  return startPort + Math.floor(Math.random() * 100);
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/**
 * Format date to German locale string
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Extract backlinks from markdown content
 */
export function extractBacklinks(content) {
  const regex = /\[\[([^\]]+)\]\]/g;
  const links = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    links.push(match[1].trim());
  }

  return [...new Set(links)];
}

/**
 * Strip YAML frontmatter from markdown
 */
export function stripFrontmatter(content) {
  return content.replace(/^---[\s\S]*?---\n?/, '').trim();
}

/**
 * Get text preview from markdown content
 */
export function getPreview(content, maxLength = 80) {
  if (!content) return '';

  const cleaned = stripFrontmatter(content)
    .replace(/^#+\s*/gm, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/\n/g, ' ')
    .trim();

  if (cleaned.length > maxLength) {
    return cleaned.substring(0, maxLength) + '...';
  }
  return cleaned;
}
