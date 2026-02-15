const fs = require('fs');
const path = require('path');
const { validate } = require('html-validator');
const cheerio = require('cheerio');

describe('HTML Validation Tests', () => {
  const htmlFiles = [];
  const rootDir = path.join(__dirname, '../..');

  // Find all HTML files
  function findHtmlFiles(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        findHtmlFiles(filePath);
      } else if (file.endsWith('.html')) {
        htmlFiles.push(filePath);
      }
    });
  }

  beforeAll(() => {
    findHtmlFiles(rootDir);
  });

  test('should find HTML files', () => {
    expect(htmlFiles.length).toBeGreaterThan(0);
  });

  test.each(htmlFiles)('should have valid HTML structure: %s', async (filePath) => {
    const html = fs.readFileSync(filePath, 'utf-8');
    const $ = cheerio.load(html);

    // Basic structure checks
    expect($('html').length).toBe(1);
    expect($('head').length).toBe(1);
    expect($('body').length).toBe(1);
    expect($('title').length).toBeGreaterThan(0);
  });

  test.each(htmlFiles)('should have proper meta tags: %s', async (filePath) => {
    const html = fs.readFileSync(filePath, 'utf-8');
    const $ = cheerio.load(html);

    // Check for charset
    expect($('meta[charset]').length).toBeGreaterThan(0);
    
    // Check for viewport (mobile-friendly)
    const viewport = $('meta[name="viewport"]');
    if (viewport.length > 0) {
      expect(viewport.attr('content')).toContain('width');
    }
  });

  test.each(htmlFiles)('should have lang attribute on html tag: %s', async (filePath) => {
    const html = fs.readFileSync(filePath, 'utf-8');
    const $ = cheerio.load(html);

    const lang = $('html').attr('lang');
    expect(lang).toBeTruthy();
    expect(lang.length).toBeGreaterThan(0);
  });

  test.each(htmlFiles)('should not have inline styles (use external CSS): %s', async (filePath) => {
    // Skip index.html as it may have some inline styles for specific cases
    if (filePath.includes('index.html')) {
      return;
    }

    const html = fs.readFileSync(filePath, 'utf-8');
    
    // Check for style tags (should be minimal)
    const styleTagCount = (html.match(/<style[^>]*>/gi) || []).length;
    expect(styleTagCount).toBeLessThan(2); // Allow one style tag max
  });

  test.each(htmlFiles)('should have accessible alt text for images: %s', async (filePath) => {
    const html = fs.readFileSync(filePath, 'utf-8');
    const $ = cheerio.load(html);

    const images = $('img');
    images.each((i, img) => {
      const alt = $(img).attr('alt');
      // Alt should exist (can be empty for decorative images, but should be present)
      expect($(img).attr('alt')).toBeDefined();
    });
  });

  test('index.html should exist and be accessible', () => {
    const indexPath = path.join(rootDir, 'index.html');
    expect(fs.existsSync(indexPath)).toBe(true);
  });

  test('index.html should reference external CSS', () => {
    const indexPath = path.join(rootDir, 'index.html');
    const html = fs.readFileSync(indexPath, 'utf-8');
    
    // Should have link to CSS file
    expect(html).toMatch(/<link[^>]*rel=["']stylesheet["']/i);
    expect(html).toMatch(/public\/css\/main\.css/);
  });
});

