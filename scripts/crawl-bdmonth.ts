/**
 * 월간빌딩 (bdmonth.com) celebrity real estate crawler
 *
 * Uses Playwright to scrape JS-rendered pages for celebrity
 * building investment articles and extracts structured data.
 *
 * Requires: @playwright/test (already in devDependencies)
 *
 * Usage: pnpm crawl:bdmonth
 */

import { chromium, type Page } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'

interface BdmonthArticle {
  title: string
  url: string
  celebrityName: string
  acquisitionDate: string
  acquisitionPrice: string
  saleDate: string
  salePrice: string
  location: string
  area: string
  rawContent: string
}

interface BdmonthResult {
  crawledAt: string
  source: string
  totalArticles: number
  articles: BdmonthArticle[]
  matchedExisting: string[]
  newCandidates: string[]
}

/** Load known celebrity names from seed data for matching */
function loadCelebrityNames(): string[] {
  try {
    const seedPath = path.resolve(__dirname, 'seed-celebrities.ts')
    const content = fs.readFileSync(seedPath, 'utf-8')
    const names: string[] = []
    const nameRegex = /^\s{2,4}name:\s*'([^']+)'/gm
    let match
    while ((match = nameRegex.exec(content)) !== null) {
      const name = match[1]
      if (!name.includes('아파트') && !name.includes('빌라') && !name.includes('별장')
        && !name.includes('리조트') && !name.includes('주택') && name.length <= 10) {
        names.push(name)
      }
    }
    return [...new Set(names)]
  } catch {
    return []
  }
}

/** Extract structured data from article text */
function extractArticleData(text: string): Partial<BdmonthArticle> {
  const data: Partial<BdmonthArticle> = {}

  // Extract acquisition date (매입일/취득일)
  const datePattern = /(?:매입일?|취득일?|매수일?)[:\s]*(\d{4})[년.\-/]\s*(\d{1,2})[월.\-/]?\s*(\d{1,2})?/
  const dateMatch = text.match(datePattern)
  if (dateMatch) {
    data.acquisitionDate = `${dateMatch[1]}-${dateMatch[2].padStart(2, '0')}${dateMatch[3] ? `-${dateMatch[3].padStart(2, '0')}` : ''}`
  }

  // Extract acquisition price (매입가/취득가)
  const pricePattern = /(?:매입가?|취득가?|매수가?)[:\s]*([\d,]+)\s*(?:억\s*)?(?:([\d,]+)\s*만)?/
  const priceMatch = text.match(pricePattern)
  if (priceMatch) {
    data.acquisitionPrice = priceMatch[0]
  }

  // Extract sale date (매도일/처분일)
  const saleDatePattern = /(?:매도일?|처분일?|매각일?)[:\s]*(\d{4})[년.\-/]\s*(\d{1,2})[월.\-/]?\s*(\d{1,2})?/
  const saleDateMatch = text.match(saleDatePattern)
  if (saleDateMatch) {
    data.saleDate = `${saleDateMatch[1]}-${saleDateMatch[2].padStart(2, '0')}${saleDateMatch[3] ? `-${saleDateMatch[3].padStart(2, '0')}` : ''}`
  }

  // Extract sale price (매도가/처분가)
  const salePricePattern = /(?:매도가?|처분가?|매각가?)[:\s]*([\d,]+)\s*(?:억\s*)?(?:([\d,]+)\s*만)?/
  const salePriceMatch = text.match(salePricePattern)
  if (salePriceMatch) {
    data.salePrice = salePriceMatch[0]
  }

  // Extract location
  const locationPattern = /(?:소재지|위치|주소)[:\s]*([^\n,]+)/
  const locationMatch = text.match(locationPattern)
  if (locationMatch) {
    data.location = locationMatch[1].trim()
  }

  // Extract area (면적)
  const areaPattern = /(?:면적|대지|건물면적|연면적)[:\s]*([\d,.]+)\s*(?:㎡|평|m²)/
  const areaMatch = text.match(areaPattern)
  if (areaMatch) {
    data.area = areaMatch[0]
  }

  return data
}

/** Extract celebrity name from article title or content */
function extractCelebrityName(title: string, content: string): string {
  // Common patterns: "OOO, 건물 매입" or "OOO의 부동산"
  const titlePatterns = [
    /^['"]?(\S{2,5})[,\s]+(?:건물|빌딩|부동산|아파트)/,
    /(?:가수|배우|방송인|개그맨|MC|아이돌)\s+(\S{2,5})/,
    /(\S{2,5})(?:의|가|이)\s+(?:건물|빌딩|부동산)/,
  ]

  for (const pattern of titlePatterns) {
    const match = title.match(pattern)
    if (match) return match[1]
  }

  for (const pattern of titlePatterns) {
    const match = content.slice(0, 200).match(pattern)
    if (match) return match[1]
  }

  return ''
}

async function crawlArticleList(page: Page): Promise<{ title: string; url: string }[]> {
  const articles: { title: string; url: string }[] = []

  try {
    await page.goto('https://www.bdmonth.com/celebrity_investment', {
      waitUntil: 'networkidle',
      timeout: 30000,
    })

    // Wait for content to render
    await page.waitForTimeout(2000)

    // Try multiple selectors for article links
    const selectors = [
      'a[href*="celebrity"]',
      '.article-list a',
      '.post-list a',
      'article a',
      '.content a',
      'a[href*="investment"]',
    ]

    for (const selector of selectors) {
      const links = await page.$$eval(selector, (els) =>
        els.map((el) => ({
          title: el.textContent?.trim() || '',
          url: (el as HTMLAnchorElement).href || '',
        })).filter((l) => l.title.length > 5 && l.url.length > 0)
      ).catch(() => [])

      if (links.length > 0) {
        articles.push(...links)
        break
      }
    }

    // Fallback: get all links on the page and filter
    if (articles.length === 0) {
      const allLinks = await page.$$eval('a', (els) =>
        els.map((el) => ({
          title: el.textContent?.trim() || '',
          url: (el as HTMLAnchorElement).href || '',
        })).filter((l) =>
          l.title.length > 5
          && l.url.includes('bdmonth.com')
          && !l.url.includes('login')
          && !l.url.includes('signup')
        )
      ).catch(() => [])

      articles.push(...allLinks)
    }
  } catch (err) {
    console.error('Failed to crawl article list:', err)
  }

  // Deduplicate by URL
  const seen = new Set<string>()
  return articles.filter((a) => {
    if (seen.has(a.url)) return false
    seen.add(a.url)
    return true
  })
}

async function crawlArticle(page: Page, url: string): Promise<string> {
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 })
    await page.waitForTimeout(1000)

    // Try to extract main content
    const contentSelectors = ['.article-content', '.post-content', '.content', 'article', 'main']

    for (const selector of contentSelectors) {
      const text = await page.$eval(selector, (el) => el.textContent?.trim() || '').catch(() => '')
      if (text.length > 50) return text
    }

    // Fallback: get body text
    return await page.$eval('body', (el) => el.textContent?.trim() || '').catch(() => '')
  } catch (err) {
    console.error(`Failed to crawl ${url}:`, err)
    return ''
  }
}

async function main() {
  console.log('Starting 월간빌딩 crawler...')

  const celebrityNames = loadCelebrityNames()
  console.log(`Loaded ${celebrityNames.length} celebrity names for matching`)

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  })
  const page = await context.newPage()

  try {
    // 1. Get article list
    console.log('Crawling article list...')
    const articleLinks = await crawlArticleList(page)
    console.log(`Found ${articleLinks.length} article links`)

    if (articleLinks.length === 0) {
      console.log('No articles found. The site structure may have changed.')
      return
    }

    // 2. Crawl each article (limit to 30 most recent)
    const articles: BdmonthArticle[] = []
    const limit = Math.min(articleLinks.length, 30)

    for (let i = 0; i < limit; i++) {
      const { title, url } = articleLinks[i]
      console.log(`  [${i + 1}/${limit}] ${title.slice(0, 50)}...`)

      const content = await crawlArticle(page, url)
      if (!content) continue

      const extracted = extractArticleData(content)
      const celebName = extractCelebrityName(title, content)

      articles.push({
        title,
        url,
        celebrityName: celebName,
        acquisitionDate: extracted.acquisitionDate || '',
        acquisitionPrice: extracted.acquisitionPrice || '',
        saleDate: extracted.saleDate || '',
        salePrice: extracted.salePrice || '',
        location: extracted.location || '',
        area: extracted.area || '',
        rawContent: content.slice(0, 500),
      })

      // Rate limit
      await new Promise((r) => setTimeout(r, 1000))
    }

    // 3. Match against known celebrities
    const matched: string[] = []
    const newCandidates: string[] = []

    for (const article of articles) {
      if (!article.celebrityName) continue

      if (celebrityNames.includes(article.celebrityName)) {
        matched.push(article.celebrityName)
      } else {
        newCandidates.push(article.celebrityName)
      }
    }

    // 4. Save results
    const today = new Date().toISOString().slice(0, 10)
    const result: BdmonthResult = {
      crawledAt: new Date().toISOString(),
      source: 'bdmonth.com',
      totalArticles: articles.length,
      articles,
      matchedExisting: [...new Set(matched)],
      newCandidates: [...new Set(newCandidates)],
    }

    const outputDir = path.resolve(process.cwd(), 'data/bdmonth-results')
    fs.mkdirSync(outputDir, { recursive: true })
    const outputPath = path.join(outputDir, `${today}.json`)
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8')

    console.log(`\n=== Results ===`)
    console.log(`Crawled: ${articles.length} articles`)
    console.log(`Matched existing celebrities: ${[...new Set(matched)].join(', ') || 'none'}`)
    console.log(`New candidates: ${[...new Set(newCandidates)].join(', ') || 'none'}`)
    console.log(`Saved to ${outputPath}`)
  } finally {
    await browser.close()
  }
}

main().catch(console.error)
