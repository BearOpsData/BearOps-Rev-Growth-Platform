#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// Collect all internal links
const links = new Set()
const brokenLinks = []

function extractLinks(content, filePath) {
  // Match href attributes
  const hrefMatches = content.matchAll(/href=["']([^"']+)["']/gi)
  for (const match of hrefMatches) {
    const link = match[1]
    // Skip external links, mailto, javascript, anchors
    if (link.startsWith('http') || 
        link.startsWith('mailto:') || 
        link.startsWith('javascript:') || 
        link.startsWith('#') ||
        link.startsWith('//')) {
      continue
    }
    links.add({ link, file: filePath })
  }
  
  // Match Next.js Link components
  const linkMatches = content.matchAll(/Link\s+href=["']([^"']+)["']/gi)
  for (const match of linkMatches) {
    const link = match[1]
    if (!link.startsWith('http') && !link.startsWith('mailto:')) {
      links.add({ link, file: filePath })
    }
  }
}

function checkFile(filePath, baseDir) {
  const fullPath = path.join(baseDir, filePath)
  
  // Normalize path
  let normalized = filePath
    .replace(/^\.\.\//, '')
    .replace(/^\.\//, '')
    .replace(/\.html$/, '')
  
  // Handle relative paths
  if (filePath.includes('../')) {
    const parts = filePath.split('../')
    normalized = parts[parts.length - 1].replace(/\.html$/, '')
  }
  
  // Check if file exists
  const possiblePaths = [
    path.join(baseDir, filePath),
    path.join(baseDir, normalized + '.html'),
    path.join(baseDir, 'process', normalized + '.html'),
    path.join(baseDir, 'playbook', normalized + '.html'),
    path.join(baseDir, 'process', 'sales-playbook-hub', normalized + '.html'),
  ]
  
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      return { exists: true, path: possiblePath }
    }
  }
  
  return { exists: false, path: filePath }
}

// Scan all files
const baseDir = path.join(__dirname, '..')

// Scan React components
const componentFiles = [
  'components/tabs/FrameworkTab.tsx',
  'components/tabs/AssessmentTab.tsx',
  'components/tabs/CostTab.tsx',
  'components/tabs/PricingTab.tsx',
  'components/tabs/ProblemTab.tsx',
  'components/tabs/SolutionTab.tsx',
]

componentFiles.forEach(file => {
  const content = fs.readFileSync(path.join(baseDir, file), 'utf-8')
  extractLinks(content, file)
})

// Scan HTML files
function scanDirectory(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true })
  for (const file of files) {
    const fullPath = path.join(dir, file.name)
    if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
      scanDirectory(fullPath)
    } else if (file.name.endsWith('.html')) {
      const content = fs.readFileSync(fullPath, 'utf-8')
      extractLinks(content, path.relative(baseDir, fullPath))
    }
  }
}

scanDirectory(path.join(baseDir, 'process'))
scanDirectory(path.join(baseDir, 'playbook'))

// Check all links
console.log('\n🔍 Checking all links...\n')

const internalLinks = Array.from(links).filter(({ link }) => 
  !link.startsWith('http') && 
  !link.startsWith('mailto:') && 
  !link.startsWith('javascript:') &&
  !link.startsWith('#')
)

const linkMap = new Map()

internalLinks.forEach(({ link, file }) => {
  if (!linkMap.has(link)) {
    linkMap.set(link, [])
  }
  linkMap.get(link).push(file)
})

// Check each unique link
for (const [link, files] of linkMap.entries()) {
  const result = checkFile(link, baseDir)
  if (!result.exists) {
    brokenLinks.push({ link, files, expectedPath: result.path })
  }
}

// Report results
console.log(`Total unique internal links: ${linkMap.size}`)
console.log(`Broken links: ${brokenLinks.length}\n`)

if (brokenLinks.length > 0) {
  console.log('❌ Broken Links:\n')
  brokenLinks.forEach(({ link, files, expectedPath }) => {
    console.log(`  ${link}`)
    console.log(`    Referenced in: ${files.join(', ')}`)
    console.log(`    Expected: ${expectedPath}\n`)
  })
} else {
  console.log('✅ All links are valid!')
}

// Generate route requirements
const processLinks = []
const playbookLinks = []
const salesPlaybookHubLinks = []

internalLinks.forEach(({ link }) => {
  if (link.includes('sales-playbook-hub/')) {
    const slug = link.replace(/.*sales-playbook-hub\//, '').replace(/\.html$/, '')
    salesPlaybookHubLinks.push(slug)
  } else if (link.includes('playbook/') || link.startsWith('../playbook/')) {
    const slug = link.replace(/.*playbook\//, '').replace(/\.html$/, '')
    playbookLinks.push(slug)
  } else if (link.includes('process/') || link.startsWith('process/')) {
    const slug = link.replace(/.*process\//, '').replace(/\.html$/, '')
    if (!slug.includes('/')) {
      processLinks.push(slug)
    }
  }
})

console.log('\n📋 Route Requirements:\n')
console.log(`Process pages: ${[...new Set(processLinks)].length} unique`)
console.log(`Playbook pages: ${[...new Set(playbookLinks)].length} unique`)
console.log(`Sales Playbook Hub pages: ${[...new Set(salesPlaybookHubLinks)].length} unique`)

process.exit(brokenLinks.length > 0 ? 1 : 0)

