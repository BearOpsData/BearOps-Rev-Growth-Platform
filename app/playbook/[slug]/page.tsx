import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import { rewriteHtmlLinks } from '@/lib/html-link-rewriter'

interface PlaybookPageProps {
  params: Promise<{ slug: string }>
}

export default async function PlaybookPage({ params }: PlaybookPageProps) {
  const { slug } = await params
  
  // Remove .html extension if present
  const cleanSlug = slug.replace(/\.html$/, '')
  const htmlFileName = `${cleanSlug}.html`
  
  const filePath = path.join(process.cwd(), 'playbook', htmlFileName)
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    notFound()
  }
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    
    // Extract all styles from <style> tags
    const styleMatches = fileContent.match(/<style[^>]*>([\s\S]*?)<\/style>/gi)
    let allStyles = ''
    if (styleMatches) {
      allStyles = styleMatches.map(match => {
        const content = match.replace(/<\/?style[^>]*>/gi, '')
        return content
      }).join('\n')
    }
    
    // Extract body content from HTML
    const bodyMatch = fileContent.match(/<body[^>]*>([\s\S]*)<\/body>/i)
    let bodyContent = bodyMatch ? bodyMatch[1] : fileContent
    
    // Remove script tags for security
    bodyContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    
    // Rewrite links to use Next.js routes
    bodyContent = rewriteHtmlLinks(bodyContent, `playbook/${slug}`)
    
    return (
      <>
        {linkTags && (
          <div dangerouslySetInnerHTML={{ __html: linkTags }} />
        )}
        {allStyles && (
          <style dangerouslySetInnerHTML={{ __html: allStyles }} />
        )}
        <div className="playbook-page" style={{ minHeight: '100vh' }}>
          <div dangerouslySetInnerHTML={{ __html: bodyContent }} />
        </div>
      </>
    )
  } catch (error) {
    console.error(`Error reading playbook page: ${htmlFileName}`, error)
    notFound()
  }
}

// Generate metadata
export async function generateMetadata({ params }: PlaybookPageProps) {
  const { slug } = await params
  const cleanSlug = slug.replace(/\.html$/, '')
  const htmlFileName = `${cleanSlug}.html`
  const filePath = path.join(process.cwd(), 'playbook', htmlFileName)
  
  if (!fs.existsSync(filePath)) {
    return {
      title: 'Page Not Found | BearOps',
    }
  }
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const titleMatch = fileContent.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
    const pageTitle = titleMatch ? titleMatch[1].trim() : 'BearOps Playbook'
    
    return {
      title: pageTitle,
    }
  } catch {
    return {
      title: 'BearOps Playbook',
    }
  }
}

