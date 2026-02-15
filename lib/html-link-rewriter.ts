/**
 * Rewrites HTML links to use Next.js routes
 * Converts relative paths like ../playbook/file.html to /playbook/file
 */
export function rewriteHtmlLinks(html: string, currentPath: string): string {
  let rewritten = html

  // Rewrite href attributes
  rewritten = rewritten.replace(
    /href=["']([^"']+)["']/gi,
    (match, link) => {
      // Skip external links, mailto, javascript, anchors
      if (
        link.startsWith('http') ||
        link.startsWith('mailto:') ||
        link.startsWith('javascript:') ||
        link.startsWith('#') ||
        link.startsWith('//')
      ) {
        return match
      }

      // Handle relative paths
      let normalized = link
        .replace(/^\.\.\//, '')
        .replace(/^\.\//, '')
        .replace(/\.html$/, '')

      // Handle ../playbook/ paths
      if (link.includes('../playbook/')) {
        const slug = link.replace(/.*playbook\//, '').replace(/\.html$/, '')
        return `href="/playbook/${slug}"`
      }

      // Handle ../process/ paths
      if (link.includes('../process/')) {
        const slug = link.replace(/.*process\//, '').replace(/\.html$/, '')
        return `href="/process/${slug}"`
      }

      // Handle playbook/ paths (relative from process)
      if (link.startsWith('playbook/')) {
        const slug = link.replace(/^playbook\//, '').replace(/\.html$/, '')
        return `href="/playbook/${slug}"`
      }

      // Handle process/ paths
      if (link.startsWith('process/')) {
        const slug = link.replace(/^process\//, '').replace(/\.html$/, '')
        // Check if it's sales-playbook-hub
        if (slug.includes('sales-playbook-hub/')) {
          const hubSlug = slug.replace(/.*sales-playbook-hub\//, '').replace(/\.html$/, '')
          return `href="/process/sales-playbook-hub/${hubSlug}"`
        }
        return `href="/process/${slug}"`
      }

      // Handle sales-playbook-hub/ paths
      if (link.includes('sales-playbook-hub/')) {
        const slug = link.replace(/.*sales-playbook-hub\//, '').replace(/\.html$/, '')
        return `href="/process/sales-playbook-hub/${slug}"`
      }

      // Handle index.html or home page links
      if (link === 'index.html' || link === '../index.html' || link === '../../index.html') {
        return `href="/"`
      }

      // Handle direct file references in same directory
      if (link.endsWith('.html') && !link.includes('/')) {
        const slug = link.replace(/\.html$/, '')
        // If we're in sales-playbook-hub, keep it there
        if (currentPath.includes('sales-playbook-hub')) {
          return `href="/process/sales-playbook-hub/${slug}"`
        }
        // If we're in process, keep it there
        if (currentPath.includes('process')) {
          return `href="/process/${slug}"`
        }
        // If we're in playbook, keep it there
        if (currentPath.includes('playbook')) {
          return `href="/playbook/${slug}"`
        }
      }

      // Handle javascript:history.back() - convert to router.back() or leave as is
      if (link === 'javascript:history.back()') {
        return `href="#" onclick="window.history.back(); return false;"`
      }

      // Default: try to preserve the link structure
      return match
    }
  )

  // Rewrite onclick handlers that navigate
  rewritten = rewritten.replace(
    /onclick=["']window\.location\.href=['"]([^'"]+)['"]/gi,
    (match, link) => {
      if (link.startsWith('http') || link.startsWith('mailto:')) {
        return match
      }

      let normalized = link.replace(/\.html$/, '')

      if (link.includes('../playbook/')) {
        const slug = link.replace(/.*playbook\//, '').replace(/\.html$/, '')
        return `onclick="window.location.href='/playbook/${slug}'"`
      }

      if (link.includes('sales-playbook-hub/')) {
        const slug = link.replace(/.*sales-playbook-hub\//, '').replace(/\.html$/, '')
        return `onclick="window.location.href='/process/sales-playbook-hub/${slug}'"`
      }

      return match
    }
  )

  return rewritten
}

