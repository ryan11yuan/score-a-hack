import { type NextRequest, NextResponse } from "next/server"

type GitHubAnalysis = {
  repositoryUrl?: string
  languages?: Record<string, number>
  fileExtensions?: Record<string, number>
  totalFiles?: number
  analyzedAt?: string
}

type ScrapeResult = {
  url: string
  title?: string
  description?: string
  image?: string
  technologies?: string[]
  githubAnalysis?: GitHubAnalysis
  rawHtmlLength?: number
  fetchedAt: string
}

function isValidDevpostUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return /(^|\.)devpost\.com$/.test(parsed.hostname)
  } catch {
    return false
  }
}

function getMetaContent(html: string, nameOrProperty: string): string | undefined {
  const metaRegex = new RegExp(
    `<meta[^>]+(?:name|property)=["']${nameOrProperty}["'][^>]*content=["']([^"']+)["'][^>]*>`,
    "i"
  )
  const match = html.match(metaRegex)
  return match?.[1]?.trim()
}

function extractTitle(html: string): string | undefined {
  const ogTitle = getMetaContent(html, "og:title")
  if (ogTitle) return ogTitle
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i)
  if (titleMatch) return titleMatch[1].trim()
  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i)
  if (h1Match) return stripHtml(h1Match[1]).trim()
  return undefined
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
}

function dedupeAndLimit(list: string[], max: number = 24): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const item of list) {
    const key = item.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      result.push(item)
      if (result.length >= max) break
    }
  }
  return result
}

function extractDescription(html: string): string | undefined {
  const ogDesc = getMetaContent(html, "og:description")
  if (ogDesc) return ogDesc
  const metaDesc = getMetaContent(html, "description")
  if (metaDesc) return metaDesc
  // Fallback: first paragraph near a known description container
  const descMatch = html.match(/<div[^>]+class=["'][^"']*(description|gallery|cp-description)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)
  if (descMatch) {
    const p = descMatch[2].match(/<p[^>]*>([\s\S]*?)<\/p>/i)
    if (p) return stripHtml(p[1]).slice(0, 500)
    return stripHtml(descMatch[2]).slice(0, 500)
  }
  return undefined
}

function extractTechnologies(html: string): string[] | undefined {
  // Try Devpost common patterns
  // 1) JSON-LD keywords
  const jsonLdMatches = html.match(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi) || []
  for (const block of jsonLdMatches) {
    try {
      const jsonText = block.replace(/^[\s\S]*?>/, "").replace(/<\/[\s\S]*$/, "")
      const data = JSON.parse(jsonText)
      const keywords: string[] | undefined = Array.isArray(data)
        ? data.find((d: any) => d && (d.keywords || d.technology))?.keywords
        : (data?.keywords as string[] | undefined)
      if (Array.isArray(keywords) && keywords.length) {
        return keywords.map((k) => String(k).trim()).filter(Boolean)
      }
    } catch {
      // ignore JSON errors
    }
  }
  // 2) Technologies section lists
  const techSectionMatch = html.match(/(?:Technologies|Built with|Tools)[:\s]*<[^>]*>([\s\S]*?)<\/[^>]*>/i)
  const listHtml = techSectionMatch?.[1]
  if (listHtml) {
    const items = Array.from(listHtml.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)).map((m) => stripHtml(m[1]))
    const chips = Array.from(listHtml.matchAll(/<span[^>]*>([\s\S]*?)<\/span>/gi)).map((m) => stripHtml(m[1]))
    const all = [...items, ...chips]
      .map((s) => s.trim())
      .filter(Boolean)
    if (all.length) return dedupeAndLimit(all)
  }
  // 3) Chip-like anchors
  const tagMatches = Array.from(html.matchAll(/<a[^>]+class=["'][^"']*(tag|chip|tech|technology)[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi))
  if (tagMatches.length) {
    return dedupeAndLimit(tagMatches.map((m) => stripHtml(m[2])))
  }
  return undefined
}

function extractGitHubUrl(html: string): string | undefined {
  // Look for GitHub links in various patterns
  const patterns = [
    /href=["'](https?:\/\/github\.com\/[^"']+)["']/gi,
    /github\.com\/([a-zA-Z0-9\-_]+\/[a-zA-Z0-9\-_\.]+)/gi,
    /<a[^>]*href=["'](https?:\/\/github\.com\/[^"']+)["'][^>]*>/gi
  ]
  
  for (const pattern of patterns) {
    const matches = Array.from(html.matchAll(pattern))
    for (const match of matches) {
      let url = match[1] || match[0]
      if (!url.startsWith('http')) {
        url = `https://github.com/${url}`
      }
      // Clean up the URL
      url = url.replace(/\/$/, '') // Remove trailing slash
      if (url.includes('github.com/') && !url.includes('github.com/')) {
        continue
      }
      return url
    }
  }
  return undefined
}

async function analyzeGitHubRepository(repoUrl: string): Promise<GitHubAnalysis | undefined> {
  try {
    // Extract owner/repo from URL
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (!match) return undefined
    
    const [, owner, repo] = match
    const cleanRepo = repo.replace(/\.git$/, '')
    
    // GitHub API doesn't require auth for public repos, but we'll add a basic token for rate limits
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Score-a-Hack/1.0'
    }
    
    // Add GitHub token if available (optional)
    const githubToken = process.env.GITHUB_TOKEN
    if (githubToken) {
      headers['Authorization'] = `token ${githubToken}`
    }
    
    // Get repository languages
    const languagesRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/languages`, {
      headers,
      cache: 'no-store'
    })
    
    if (!languagesRes.ok) {
      console.warn(`GitHub API error for languages: ${languagesRes.status}`)
      return undefined
    }
    
    const languages = await languagesRes.json()
    
    // Get repository contents to analyze file extensions
    const contentsRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/contents`, {
      headers,
      cache: 'no-store'
    })
    
    let fileExtensions: Record<string, number> = {}
    let totalFiles = 0
    
    if (contentsRes.ok) {
      const contents = await contentsRes.json()
      fileExtensions = await analyzeFileExtensions(contents, owner, cleanRepo, headers)
      totalFiles = Object.values(fileExtensions).reduce((sum, count) => sum + count, 0)
    }
    
    return {
      repositoryUrl: repoUrl,
      languages,
      fileExtensions,
      totalFiles,
      analyzedAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('GitHub analysis error:', error)
    return undefined
  }
}

async function analyzeFileExtensions(contents: any[], owner: string, repo: string, headers: HeadersInit): Promise<Record<string, number>> {
  const extensions: Record<string, number> = {}
  
  for (const item of contents) {
    if (item.type === 'file') {
      const ext = item.name.split('.').pop()?.toLowerCase()
      if (ext) {
        extensions[ext] = (extensions[ext] || 0) + 1
      }
    } else if (item.type === 'dir' && !item.name.startsWith('.')) {
      // Recursively analyze subdirectories (limit depth to avoid too many API calls)
      try {
        const subContentsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${item.path}`, {
          headers,
          cache: 'no-store'
        })
        if (subContentsRes.ok) {
          const subContents = await subContentsRes.json()
          const subExtensions = await analyzeFileExtensions(subContents, owner, repo, headers)
          for (const [ext, count] of Object.entries(subExtensions)) {
            extensions[ext] = (extensions[ext] || 0) + count
          }
        }
      } catch (error) {
        console.warn(`Error analyzing subdirectory ${item.path}:`, error)
      }
    }
  }
  
  return extensions
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Body must include { url: string }" }, { status: 400 })
    }
    if (!isValidDevpostUrl(url)) {
      return NextResponse.json({ error: "URL must be a valid devpost.com link" }, { status: 400 })
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 12000)
    let html: string
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
          accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        cache: "no-store",
        signal: controller.signal,
      })
      if (!res.ok) {
        return NextResponse.json({ error: `Failed to fetch page (${res.status})` }, { status: 502 })
      }
      html = await res.text()
    } finally {
      clearTimeout(timeout)
    }

    const title = extractTitle(html)
    const description = extractDescription(html)
    const image = getMetaContent(html, "og:image") || getMetaContent(html, "twitter:image")
    const technologies = extractTechnologies(html)
    
    // Extract and analyze GitHub repository if found
    const githubUrl = extractGitHubUrl(html)
    let githubAnalysis: GitHubAnalysis | undefined
    if (githubUrl) {
      githubAnalysis = await analyzeGitHubRepository(githubUrl)
    }

    const result: ScrapeResult = {
      url,
      title,
      description,
      image,
      technologies,
      githubAnalysis,
      rawHtmlLength: html.length,
      fetchedAt: new Date().toISOString(),
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    const isAbort = error && typeof error === "object" && (error.name === "AbortError" || error.code === 20)
    if (isAbort) {
      return NextResponse.json({ error: "Request timed out while fetching Devpost" }, { status: 504 })
    }
    console.error("Scrape error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


