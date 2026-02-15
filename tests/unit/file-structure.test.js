const fs = require('fs');
const path = require('path');

describe('File Structure Tests', () => {
  const rootDir = path.join(__dirname, '../..');

  test('should have proper directory structure', () => {
    const requiredDirs = [
      'public',
      'public/css',
      'public/js',
      'public/images',
      'tests',
      'tests/unit',
      'tests/integration',
      'docs'
    ];

    requiredDirs.forEach(dir => {
      const dirPath = path.join(rootDir, dir);
      expect(fs.existsSync(dirPath)).toBe(true);
      expect(fs.statSync(dirPath).isDirectory()).toBe(true);
    });
  });

  test('should have main.css in public/css', () => {
    const cssPath = path.join(rootDir, 'public/css/main.css');
    expect(fs.existsSync(cssPath)).toBe(true);
  });

  test('should have main.js in public/js', () => {
    const jsPath = path.join(rootDir, 'public/js/main.js');
    expect(fs.existsSync(jsPath)).toBe(true);
  });

  test('should have images in public/images', () => {
    const imagesPath = path.join(rootDir, 'public/images');
    expect(fs.existsSync(imagesPath)).toBe(true);
    
    const images = fs.readdirSync(imagesPath);
    expect(images.length).toBeGreaterThan(0);
  });

  test('should not have files with spaces in names', () => {
    function checkFiles(dir) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
          checkFiles(filePath);
        } else if (file.includes(' ') && !file.startsWith('.')) {
          // Allow spaces in markdown/docs, but not in HTML/CSS/JS
          if (file.match(/\.(html|css|js|png|jpg|jpeg|svg)$/i)) {
            throw new Error(`File with space in name: ${filePath}`);
          }
        }
      });
    }

    expect(() => checkFiles(rootDir)).not.toThrow();
  });

  test('should use kebab-case for HTML files', () => {
    function checkHtmlFiles(dir) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
          checkHtmlFiles(filePath);
        } else if (file.endsWith('.html')) {
          // Check for uppercase letters (should be lowercase)
          if (file !== file.toLowerCase() && !file.includes('index.html')) {
            // Allow index.html but warn about others
            console.warn(`HTML file with uppercase: ${filePath}`);
          }
          // Check for underscores (should use hyphens)
          if (file.includes('_') && !file.includes('index.html')) {
            throw new Error(`HTML file with underscore: ${filePath} (use hyphens instead)`);
          }
        }
      });
    }

    expect(() => checkHtmlFiles(rootDir)).not.toThrow();
  });

  test('should have index.html in root', () => {
    const indexPath = path.join(rootDir, 'index.html');
    expect(fs.existsSync(indexPath)).toBe(true);
  });

  test('should not have index2.html (should be renamed)', () => {
    const index2Path = path.join(rootDir, 'index2.html');
    expect(fs.existsSync(index2Path)).toBe(false);
  });
});

