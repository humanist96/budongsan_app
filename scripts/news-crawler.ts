/**
 * Naver News API crawler for celebrity real estate news
 *
 * Searches for celebrity + real estate related news articles,
 * deduplicates results, matches against known celebrities,
 * and saves structured JSON output.
 *
 * Requires: NAVER_CLIENT_ID, NAVER_CLIENT_SECRET
 *
 * Usage: pnpm crawl:news
 */

import * as fs from 'fs'
import * as path from 'path'
import { loadCelebrityNames } from './lib/celebrity-names'

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID!
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET!

interface NaverNewsItem {
  title: string
  link: string
  description: string
  pubDate: string
}

interface NaverNewsResponse {
  items: NaverNewsItem[]
  total: number
}

interface CrawledArticle {
  keyword: string
  title: string
  link: string
  description: string
  pubDate: string
  matchedCelebrities: string[]
}

interface CrawlResult {
  crawledAt: string
  totalResults: number
  articles: CrawledArticle[]
}

const SEARCH_KEYWORDS = [
  // ── 연예인 기본 ──
  '연예인 부동산 매입',
  '연예인 아파트 매매',
  '스타 한남더힐',
  '셀럽 청담동 아파트',
  '아이돌 아파트 매입',
  '배우 집 공개',
  '가수 부동산 투자',
  '스타 빌딩 매입',
  '연예인 건물 투자',
  '셀럽 전액현금',
  '아이돌 한남더힐',
  'BTS 부동산',
  '배우 청담동 건물',
  'MC 빌딩 매입',
  '트로트 부동산',
  'K팝 아이돌 부동산',
  // ── 연예인 확장 ──
  '연예인 빌딩 매각',
  '연예인 펜트하우스',
  '방송인 건물',
  '한류스타 부동산',
  '유튜버 빌딩',
  '개그맨 부동산',
  // ── 운동선수 ──
  '프로선수 부동산',
  '운동선수 빌딩',
  '야구선수 부동산',
  '축구선수 아파트',
  '골프선수 부동산',
  'KBO 선수 건물',
  // ── 정치인 ──
  '정치인 부동산 재산',
  '국회의원 부동산',
  '국회의원 재산공개',
  '공직자 부동산',
  '장관 재산',
  '정치인 건물',
  // ── 특정 단지 ──
  '한남더힐 연예인',
  '나인원한남 입주자',
  'PH129 청담 셀럽',
  '래미안원베일리 연예인',
  '아크로리버파크 스타',
  '타워팰리스 셀럽',
  '트라움하우스 연예인',
  '시그니엘 입주자',
  '갤러리아포레 셀럽',
  '청담자이 연예인',
  '반포자이 스타',
]

// loadCelebrityNames imported from ./lib/celebrity-names

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim()
}

async function searchNews(query: string, display: number = 10): Promise<NaverNewsItem[]> {
  const url = new URL('https://openapi.naver.com/v1/search/news.json')
  url.searchParams.set('query', query)
  url.searchParams.set('display', String(display))
  url.searchParams.set('sort', 'date')

  const response = await fetch(url.toString(), {
    headers: {
      'X-Naver-Client-Id': NAVER_CLIENT_ID,
      'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
    },
  })

  if (!response.ok) {
    throw new Error(`Naver API error: ${response.status}`)
  }

  const data: NaverNewsResponse = await response.json()
  return data.items
}

/** Load previous crawl results to deduplicate against */
function loadPreviousLinks(outputDir: string): Set<string> {
  const links = new Set<string>()

  if (!fs.existsSync(outputDir)) return links

  const files = fs.readdirSync(outputDir).filter((f) => f.endsWith('.json'))
  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(outputDir, file), 'utf-8')
      const result: CrawlResult = JSON.parse(content)
      for (const article of result.articles) {
        links.add(article.link)
      }
    } catch {
      // Skip malformed files
    }
  }

  return links
}

/** Match celebrity names in article text */
function matchCelebrities(text: string, celebrityNames: string[]): string[] {
  return celebrityNames.filter((name) => text.includes(name))
}

async function main() {
  if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
    console.error('Set NAVER_CLIENT_ID and NAVER_CLIENT_SECRET env vars')
    return
  }

  const celebrityNames = loadCelebrityNames()
  console.log(`Loaded ${celebrityNames.length} celebrity names for matching`)

  const outputDir = path.resolve(process.cwd(), 'data/news-results')
  const previousLinks = loadPreviousLinks(outputDir)
  console.log(`Found ${previousLinks.size} previously crawled links`)

  const seenLinks = new Set<string>(previousLinks)
  const articles: CrawledArticle[] = []

  for (const keyword of SEARCH_KEYWORDS) {
    try {
      const items = await searchNews(keyword, 10)

      for (const item of items) {
        // Deduplicate by URL
        if (seenLinks.has(item.link)) continue
        seenLinks.add(item.link)

        const title = stripHtml(item.title)
        const description = stripHtml(item.description)
        const searchText = `${title} ${description}`
        const matched = matchCelebrities(searchText, celebrityNames)

        articles.push({
          keyword,
          title,
          link: item.link,
          description,
          pubDate: item.pubDate,
          matchedCelebrities: matched,
        })
      }

      // Rate limit
      await new Promise((r) => setTimeout(r, 100))
    } catch (err) {
      console.error(`Search failed for "${keyword}":`, err)
    }
  }

  // Sort: matched articles first, then by date
  const sorted = [...articles].sort((a, b) => {
    if (a.matchedCelebrities.length !== b.matchedCelebrities.length) {
      return b.matchedCelebrities.length - a.matchedCelebrities.length
    }
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  })

  // Save JSON output
  const today = new Date().toISOString().slice(0, 10)
  const result: CrawlResult = {
    crawledAt: new Date().toISOString(),
    totalResults: sorted.length,
    articles: sorted,
  }

  fs.mkdirSync(outputDir, { recursive: true })
  const outputPath = path.join(outputDir, `${today}.json`)
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8')
  console.log(`\nSaved ${sorted.length} articles to ${outputPath}`)

  // Console output (keep existing behavior)
  console.log(`\n=== Found ${sorted.length} news articles ===\n`)

  const matchedCount = sorted.filter((a) => a.matchedCelebrities.length > 0).length
  console.log(`Celebrity-matched articles: ${matchedCount}\n`)

  for (const article of sorted) {
    const celebTag = article.matchedCelebrities.length > 0
      ? ` [MATCH: ${article.matchedCelebrities.join(', ')}]`
      : ''
    console.log(`[${article.keyword}]${celebTag}`)
    console.log(`  Title: ${article.title}`)
    console.log(`  URL: ${article.link}`)
    console.log(`  Date: ${article.pubDate}`)
    console.log(`  Desc: ${article.description.slice(0, 100)}...`)
    console.log()
  }
}

main().catch(console.error)
