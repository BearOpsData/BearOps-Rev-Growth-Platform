#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { validate } = require('html-validator');

const rootDir = path.join(__dirname, '..');
const htmlFiles = [];

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

async function validateHtml() {
  findHtmlFiles(rootDir);
  
  console.log(`Found ${htmlFiles.length} HTML files to validate...\n`);
  
  let errors = 0;
  let warnings = 0;

  for (const filePath of htmlFiles) {
    const html = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(rootDir, filePath);
    
    try {
      const result = await validate({ data: html, format: 'json' });
      
      if (result.messages && result.messages.length > 0) {
        const fileErrors = result.messages.filter(m => m.type === 'error');
        const fileWarnings = result.messages.filter(m => m.type === 'info' || m.type === 'warning');
        
        if (fileErrors.length > 0 || fileWarnings.length > 0) {
          console.log(`\n${relativePath}:`);
          if (fileErrors.length > 0) {
            console.log(`  Errors: ${fileErrors.length}`);
            fileErrors.forEach(err => {
              console.log(`    - ${err.message}`);
            });
            errors += fileErrors.length;
          }
          if (fileWarnings.length > 0) {
            warnings += fileWarnings.length;
          }
        }
      }
    } catch (error) {
      console.error(`Error validating ${relativePath}:`, error.message);
      errors++;
    }
  }

  console.log(`\n\nValidation complete:`);
  console.log(`  Files checked: ${htmlFiles.length}`);
  console.log(`  Errors: ${errors}`);
  console.log(`  Warnings: ${warnings}`);
  
  process.exit(errors > 0 ? 1 : 0);
}

validateHtml();

