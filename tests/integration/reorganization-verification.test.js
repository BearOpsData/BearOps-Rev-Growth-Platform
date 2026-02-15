const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

describe('Reorganization Verification Tests', () => {
  const rootDir = path.join(__dirname, '../..');

  test('should have moved CSS to public/css', () => {
    const cssDir = path.join(rootDir, 'public/css');
    expect(fs.existsSync(cssDir)).toBe(true);
    
    const mainCss = path.join(cssDir, 'main.css');
    expect(fs.existsSync(mainCss)).toBe(true);
    
    // Check that CSS file has content
    const cssContent = fs.readFileSync(mainCss, 'utf-8');
    expect(cssContent.length).toBeGreaterThan(1000); // Should have substantial CSS
  });

  test('should have moved JS to public/js', () => {
    const jsDir = path.join(rootDir, 'public/js');
    expect(fs.existsSync(jsDir)).toBe(true);
    
    const mainJs = path.join(jsDir, 'main.js');
    expect(fs.existsSync(mainJs)).toBe(true);
  });

  test('should have moved images to public/images', () => {
    const imagesDir = path.join(rootDir, 'public/images');
    expect(fs.existsSync(imagesDir)).toBe(true);
    
    const images = fs.readdirSync(imagesDir);
    expect(images.length).toBeGreaterThan(0);
  });

  test('index.html should reference public/css/main.css', () => {
    const indexPath = path.join(rootDir, 'index.html');
    const html = fs.readFileSync(indexPath, 'utf-8');
    
    expect(html).toMatch(/public\/css\/main\.css/);
  });

  test('index.html should reference public/js/main.js', () => {
    const indexPath = path.join(rootDir, 'index.html');
    const html = fs.readFileSync(indexPath, 'utf-8');
    
    expect(html).toMatch(/public\/js\/main\.js/);
  });

  test('index.html should reference public/images for images', () => {
    const indexPath = path.join(rootDir, 'index.html');
    const html = fs.readFileSync(indexPath, 'utf-8');
    const $ = cheerio.load(html);
    
    $('img[src]').each((i, elem) => {
      const src = $(elem).attr('src');
      if (src && !src.startsWith('http') && !src.startsWith('data:')) {
        // Should reference public/images or be relative to public/images
        expect(src).toMatch(/public\/images/);
      }
    });
  });

  test('should not have large inline style blocks in index.html', () => {
    const indexPath = path.join(rootDir, 'index.html');
    const html = fs.readFileSync(indexPath, 'utf-8');
    
    // Count style tags (should be minimal)
    const styleTagMatches = html.match(/<style[^>]*>/gi) || [];
    expect(styleTagMatches.length).toBeLessThan(2);
    
    // Check for large inline styles (more than 500 chars in style attribute)
    const inlineStyleMatches = html.match(/style=["'][^"']{500,}["']/gi) || [];
    expect(inlineStyleMatches.length).toBe(0);
  });

  test('should have renamed problematic files', () => {
    // Check that files with spaces are renamed
    const badFiles = [
      'process/component 1- strategic clarity & leadership alignment _ bearops.html',
      'process/component 2-setting-clear-priorities.html'
    ];

    badFiles.forEach(badFile => {
      const badPath = path.join(rootDir, badFile);
      expect(fs.existsSync(badPath)).toBe(false);
    });

    // Check that renamed files exist
    const goodFiles = [
      'process/component-1-strategic-clarity-leadership-alignment.html',
      'process/component-2-setting-clear-priorities.html',
      'process/component-3-ownership-accountability.html'
    ];

    goodFiles.forEach(goodFile => {
      const goodPath = path.join(rootDir, goodFile);
      expect(fs.existsSync(goodPath)).toBe(true);
    });
  });

  test('should have proper file naming convention', () => {
    function checkFiles(dir) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
          checkFiles(filePath);
        } else if (file.endsWith('.html')) {
          // Should be lowercase (except for special cases like README)
          if (file !== file.toLowerCase() && !file.includes('index')) {
            throw new Error(`HTML file should be lowercase: ${filePath}`);
          }
          // Should use hyphens, not underscores
          if (file.includes('_') && !file.includes('index')) {
            throw new Error(`HTML file should use hyphens, not underscores: ${filePath}`);
          }
        }
      });
    }

    expect(() => checkFiles(rootDir)).not.toThrow();
  });
});

