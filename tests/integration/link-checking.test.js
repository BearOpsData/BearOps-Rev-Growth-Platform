const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

describe('Link Checking Tests', () => {
  const rootDir = path.join(__dirname, '../..');
  const htmlFiles = [];
  const brokenLinks = [];
  const allLinks = [];

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

  test.each(htmlFiles)('should have valid internal links: %s', (filePath) => {
    const html = fs.readFileSync(filePath, 'utf-8');
    const $ = cheerio.load(html);
    const relativePath = path.relative(rootDir, path.dirname(filePath));

    $('a[href]').each((i, elem) => {
      const href = $(elem).attr('href');
      
      // Skip external links and anchors
      if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#')) {
        return;
      }

      // Remove query strings and fragments
      const cleanHref = href.split('?')[0].split('#')[0];
      
      // Resolve relative paths
      let targetPath;
      if (cleanHref.startsWith('/')) {
        targetPath = path.join(rootDir, cleanHref.substring(1));
      } else {
        targetPath = path.join(path.dirname(filePath), cleanHref);
      }

      // Normalize path
      targetPath = path.normalize(targetPath);

      // Check if file exists
      if (!fs.existsSync(targetPath)) {
        brokenLinks.push({
          file: path.relative(rootDir, filePath),
          link: href,
          target: path.relative(rootDir, targetPath)
        });
      }

      allLinks.push({
        file: path.relative(rootDir, filePath),
        link: href
      });
    });
  });

  test('should not have broken internal links', () => {
    if (brokenLinks.length > 0) {
      console.error('\nBroken links found:');
      brokenLinks.forEach(({ file, link, target }) => {
        console.error(`  ${file} -> ${link} (target: ${target})`);
      });
    }
    expect(brokenLinks.length).toBe(0);
  });

  test('should have links to CSS files', () => {
    const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
    const $ = cheerio.load(indexHtml);
    
    const cssLinks = $('link[rel="stylesheet"]');
    expect(cssLinks.length).toBeGreaterThan(0);
    
    cssLinks.each((i, elem) => {
      const href = $(elem).attr('href');
      if (href && !href.startsWith('http')) {
        const cssPath = path.join(rootDir, href);
        expect(fs.existsSync(cssPath)).toBe(true);
      }
    });
  });

  test('should have links to JS files that exist', () => {
    const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
    const $ = cheerio.load(indexHtml);
    
    const jsScripts = $('script[src]');
    jsScripts.each((i, elem) => {
      const src = $(elem).attr('src');
      if (src && !src.startsWith('http')) {
        const jsPath = path.join(rootDir, src);
        expect(fs.existsSync(jsPath)).toBe(true);
      }
    });
  });

  test('should have valid image references', () => {
    htmlFiles.forEach(filePath => {
      const html = fs.readFileSync(filePath, 'utf-8');
      const $ = cheerio.load(html);
      
      $('img[src]').each((i, elem) => {
        const src = $(elem).attr('src');
        if (src && !src.startsWith('http') && !src.startsWith('data:')) {
          let imgPath;
          if (src.startsWith('/')) {
            imgPath = path.join(rootDir, src.substring(1));
          } else {
            imgPath = path.join(path.dirname(filePath), src);
          }
          imgPath = path.normalize(imgPath);
          
          if (!fs.existsSync(imgPath)) {
            brokenLinks.push({
              file: path.relative(rootDir, filePath),
              link: src,
              target: path.relative(rootDir, imgPath),
              type: 'image'
            });
          }
        }
      });
    });

    if (brokenLinks.some(link => link.type === 'image')) {
      console.error('\nBroken image references:');
      brokenLinks
        .filter(link => link.type === 'image')
        .forEach(({ file, link, target }) => {
          console.error(`  ${file} -> ${link} (target: ${target})`);
        });
    }

    const brokenImages = brokenLinks.filter(link => link.type === 'image');
    expect(brokenImages.length).toBe(0);
  });
});

