import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import { rewriteHtmlLinks } from '@/lib/html-link-rewriter'

// Map of URL slugs to HTML file names
const processPageMap: Record<string, string> = {
  'clarifying-strategy-aligning-leadership': 'clarifying-strategy-aligning-leadership.html',
  'setting-clear-priorities-focused-execution': 'setting-clear-priorities-focused-execution.html',
  'ownership-accountability-high-performance-teams': 'ownership-accountability-high-performance-teams.html',
  'standardised-sales-playbooks-leadership-cadence': 'standardised-sales-playbooks-leadership-cadence.html',
  'revenue-planning-quota-capacity': 'revenue-planning-quota-capacity.html',
  'aligned-customer-journey': 'aligned-customer-journey-marketing-sales-cs.html',
  'aligned-customer-journey-marketing-sales-cs': 'aligned-customer-journey-marketing-sales-cs.html',
  'one-source-of-truth': 'one-source-of-truth-metrics-reporting.html',
  'one-source-of-truth-metrics-reporting': 'one-source-of-truth-metrics-reporting.html',
  'clean-connected-revenue-tech-stack': 'clean-connected-revenue-tech-stack.html',
  'customer-journey-visibility-reporting-foundation': 'customer-journey-visibility-reporting-foundation.html',
}

interface ProcessPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProcessPage({ params }: ProcessPageProps) {
  const { slug } = await params
  const htmlFileName = processPageMap[slug]
  
  if (!htmlFileName) {
    notFound()
  }

  const filePath = path.join(process.cwd(), 'process', htmlFileName)
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    
    // Extract link tags for external CSS (Google Fonts, etc.)
    const linkMatches = fileContent.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi)
    let linkTags = ''
    if (linkMatches) {
      linkTags = linkMatches.join('\n')
    }
    
    // Extract all styles from <style> tags
    const styleMatches = fileContent.match(/<style[^>]*>([\s\S]*?)<\/style>/gi)
    let allStyles = ''
    if (styleMatches) {
      allStyles = styleMatches.map(match => {
        // Extract content between <style> tags
        const content = match.replace(/<\/?style[^>]*>/gi, '')
        return content
      }).join('\n')
    }
    
    // Extract body content from HTML
    const bodyMatch = fileContent.match(/<body[^>]*>([\s\S]*)<\/body>/i)
    let bodyContent = bodyMatch ? bodyMatch[1] : fileContent
    
    // Remove script tags for security (they'll be handled by Next.js if needed)
    bodyContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    
    // Rewrite links to use Next.js routes
    bodyContent = rewriteHtmlLinks(bodyContent, `process/${slug}`)
    
    return (
      <>
        {linkTags && (
          <div dangerouslySetInnerHTML={{ __html: linkTags }} />
        )}
        {allStyles && (
          <style dangerouslySetInnerHTML={{ __html: allStyles }} />
        )}
        <div className="process-page" style={{ minHeight: '100vh' }}>
          <div dangerouslySetInnerHTML={{ __html: bodyContent }} />
        </div>
      </>
    )
  } catch (error) {
    console.error(`Error reading process page: ${htmlFileName}`, error)
    notFound()
  }
}

// Generate static params for all process pages
export async function generateStaticParams() {
  return Object.keys(processPageMap).map((slug) => ({
    slug,
  }))
}

// Generate metadata
export async function generateMetadata({ params }: ProcessPageProps) {
  const { slug } = await params
  const htmlFileName = processPageMap[slug]
  
  if (!htmlFileName) {
    return {
      title: 'Page Not Found | BearOps',
    }
  }

  const filePath = path.join(process.cwd(), 'process', htmlFileName)
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const titleMatch = fileContent.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
    const pageTitle = titleMatch ? titleMatch[1].trim() : 'BearOps Process'
    
    return {
      title: pageTitle,
    }
  } catch {
    return {
      title: 'BearOps Process',
    }
  }
}
