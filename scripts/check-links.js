#!/usr/bin/env node

const { LinkChecker } = require('linkinator');

async function checkLinks() {
  const checker = new LinkChecker();
  
  const results = await checker.check({
    path: './index.html',
    recurse: true,
    linksToSkip: [
      'https://github.com',
      'http://localhost'
    ]
  });

  const broken = results.links.filter(link => link.state === 'BROKEN');
  
  if (broken.length > 0) {
    console.error('\n❌ Broken links found:');
    broken.forEach(link => {
      console.error(`  ${link.url} (${link.statusCode})`);
    });
    process.exit(1);
  } else {
    console.log('\n✅ All links are valid!');
    process.exit(0);
  }
}

checkLinks();

