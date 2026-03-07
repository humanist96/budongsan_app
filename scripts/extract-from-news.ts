/**
 * NLP-based price/name/transaction extraction from news crawl results
 *
 * Scans news articles in data/news-results/ and extracts:
 * - Prices (억원, 만원, 전액현금)
 * - Known property names (한남더힐, 나인원한남, etc.)
 * - Transaction types (매입/매도)
 * - Celebrity names
 *
 * Outputs candidates with confidence scores to data/extraction-candidates.json
 *
 * Usage: pnpm extract:news
 */

import * as fs from 'fs'
import * as path from 'path'
import { loadCelebrityNames } from './lib/celebrity-names'

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

interface ExtractionCandidate {
  articleTitle: string
  articleLink: string
  articleDate: string
  celebrityName: string
  price: string | null
  priceManWon: number | null
  propertyName: string | null
  transactionType: 'buy' | 'sell' | 'unknown'
  confidence: number
  matchDetails: string[]
}

interface ExtractionResult {
  extractedAt: string
  totalArticlesScanned: number
  totalCandidates: number
  candidates: ExtractionCandidate[]
}

// ── Known property names ──

const KNOWN_PROPERTIES = [
  // ── 기존 고급 아파트 ──
  '한남더힐',
  '나인원한남',
  'PH129',
  '트라움하우스',
  '이터널저니',
  '갤러리아포레',
  '아크로리버파크',
  '래미안퍼스티지',
  '래미안대치팰리스',
  '래미안리더스원',
  '잠실엘스',
  '헬리오시티',
  '타워팰리스',
  '도곡렉슬',
  '반포자이',
  '아크로서울포레스트',
  '청담자이',
  '더펜트하우스청담',
  '시그니엘레지던스',
  '파크리오',
  '롯데캐슬',
  '현대아이파크',
  '삼성래미안',
  '압구정현대',
  '대치SK뷰',
  // ── 추가 고급 아파트 ──
  '래미안원베일리',
  '올림픽파크포레온',
  '디에이치아너힐즈',
  '아크로비스타',
  '에테르노청담',
  '메세나폴리스',
  '한남리버힐',
  '더샵청담',
  '디에이치자이개포',
  '래미안블레스티지',
  '반포래미안아이파크',
  '잠실리센츠',
  '디에이치라클라스',
  '르엘신반포',
  '아크로리버뷰',
  // ── 빌딩 키워드 ──
  '신사동 빌딩',
  '청담동 빌딩',
  '논현동 빌딩',
  '한남동 빌딩',
  '압구정 빌딩',
  '이태원 빌딩',
  '성수동 빌딩',
  // ── 재건축 ──
  '은마아파트',
  '잠실주공',
  '압구정현대1차',
  '개포주공',
]

// ── Extraction patterns ──

const PRICE_PATTERNS = [
  { regex: /(\d+)\s*억\s*(\d+)?\s*만?\s*원?/g, type: 'eok' as const },
  { regex: /([\d,]+)\s*만\s*원/g, type: 'man' as const },
  { regex: /전액\s*현금/g, type: 'cash' as const },
]

const BUY_KEYWORDS = ['매입', '매수', '취득', '구입', '구매', '사들']
const SELL_KEYWORDS = ['매도', '매각', '처분', '팔', '매물']

/** Extract price in 만원 units */
function extractPrice(text: string): { display: string; manWon: number } | null {
  // 억원 pattern
  const eokMatch = text.match(/(\d+)\s*억\s*(\d+)?\s*만?\s*원?/)
  if (eokMatch) {
    const eok = parseInt(eokMatch[1], 10)
    const man = eokMatch[2] ? parseInt(eokMatch[2], 10) : 0
    return {
      display: eokMatch[0],
      manWon: eok * 10000 + man,
    }
  }

  // 만원 pattern
  const manMatch = text.match(/([\d,]+)\s*만\s*원/)
  if (manMatch) {
    const value = parseInt(manMatch[1].replace(/,/g, ''), 10)
    return {
      display: manMatch[0],
      manWon: value,
    }
  }

  return null
}

/** Determine transaction type */
function detectTransactionType(text: string): 'buy' | 'sell' | 'unknown' {
  const hasBuy = BUY_KEYWORDS.some((kw) => text.includes(kw))
  const hasSell = SELL_KEYWORDS.some((kw) => text.includes(kw))

  if (hasBuy && !hasSell) return 'buy'
  if (hasSell && !hasBuy) return 'sell'
  if (hasBuy && hasSell) return 'buy' // Default to buy if both present
  return 'unknown'
}

/** Find known property names in text */
function findPropertyNames(text: string): string[] {
  return KNOWN_PROPERTIES.filter((name) => text.includes(name))
}

// loadCelebrityNames imported from ./lib/celebrity-names

/** Calculate confidence score (0-100) */
function calculateConfidence(details: {
  hasCeleb: boolean
  hasPrice: boolean
  hasProperty: boolean
  hasTransactionType: boolean
  isCelebMatched: boolean
}): number {
  let score = 0

  if (details.hasCeleb) score += 30
  if (details.isCelebMatched) score += 10 // bonus for matching existing celeb
  if (details.hasPrice) score += 25
  if (details.hasProperty) score += 25
  if (details.hasTransactionType) score += 10

  return score
}

async function main() {
  const newsDir = path.resolve(process.cwd(), 'data/news-results')

  if (!fs.existsSync(newsDir)) {
    console.error('No news results found. Run `pnpm crawl:news` first.')
    return
  }

  const celebrityNames = loadCelebrityNames()
  console.log(`Loaded ${celebrityNames.length} celebrity names`)

  // Load all crawl results
  const files = fs.readdirSync(newsDir).filter((f) => f.endsWith('.json'))
  if (files.length === 0) {
    console.error('No JSON files found in data/news-results/')
    return
  }

  console.log(`Processing ${files.length} crawl result files...`)

  const candidates: ExtractionCandidate[] = []
  let totalScanned = 0

  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(newsDir, file), 'utf-8')
      const result: CrawlResult = JSON.parse(content)

      for (const article of result.articles) {
        totalScanned++
        const searchText = `${article.title} ${article.description}`
        const matchDetails: string[] = []

        // Extract celebrity name
        const matchedCelebs = article.matchedCelebrities ?? []
        let celebName = matchedCelebs[0] || ''

        // Try to find celeb names in text if not already matched
        if (!celebName) {
          for (const name of celebrityNames) {
            if (searchText.includes(name)) {
              celebName = name
              break
            }
          }
        }

        if (celebName) matchDetails.push(`celebrity: ${celebName}`)

        // Extract price
        const price = extractPrice(searchText)
        if (price) matchDetails.push(`price: ${price.display} (${price.manWon}만원)`)

        // Check for 전액현금
        if (searchText.includes('전액현금') || searchText.includes('전액 현금')) {
          matchDetails.push('payment: 전액현금')
        }

        // Find property names
        const properties = findPropertyNames(searchText)
        if (properties.length > 0) matchDetails.push(`properties: ${properties.join(', ')}`)

        // Detect transaction type
        const txType = detectTransactionType(searchText)
        if (txType !== 'unknown') matchDetails.push(`transaction: ${txType}`)

        // Calculate confidence
        const confidence = calculateConfidence({
          hasCeleb: !!celebName,
          hasPrice: !!price,
          hasProperty: properties.length > 0,
          hasTransactionType: txType !== 'unknown',
          isCelebMatched: matchedCelebs.length > 0,
        })

        // Only keep candidates with some useful data
        if (confidence >= 25) {
          candidates.push({
            articleTitle: article.title,
            articleLink: article.link,
            articleDate: article.pubDate,
            celebrityName: celebName,
            price: price?.display ?? null,
            priceManWon: price?.manWon ?? null,
            propertyName: properties[0] ?? null,
            transactionType: txType,
            confidence,
            matchDetails,
          })
        }
      }
    } catch {
      console.error(`Failed to parse ${file}`)
    }
  }

  // Sort by confidence descending
  const sorted = candidates.sort((a, b) => b.confidence - a.confidence)

  // Save results
  const result: ExtractionResult = {
    extractedAt: new Date().toISOString(),
    totalArticlesScanned: totalScanned,
    totalCandidates: sorted.length,
    candidates: sorted,
  }

  const outputPath = path.resolve(process.cwd(), 'data/extraction-candidates.json')
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8')

  console.log(`\n=== Extraction Results ===`)
  console.log(`Articles scanned: ${totalScanned}`)
  console.log(`Candidates found: ${sorted.length}`)
  console.log(`Saved to ${outputPath}`)

  // Show top candidates by confidence tier
  const high = sorted.filter((c) => c.confidence >= 75)
  const medium = sorted.filter((c) => c.confidence >= 50 && c.confidence < 75)
  const low = sorted.filter((c) => c.confidence >= 25 && c.confidence < 50)

  console.log(`\nConfidence breakdown:`)
  console.log(`  HIGH (>=75):   ${high.length}`)
  console.log(`  MEDIUM (50-74): ${medium.length}`)
  console.log(`  LOW (25-49):   ${low.length}`)

  if (high.length > 0) {
    console.log(`\nTop high-confidence candidates:`)
    for (const c of high.slice(0, 10)) {
      console.log(`  [${c.confidence}] ${c.celebrityName || '?'} - ${c.propertyName || '?'} - ${c.price || '?'} (${c.transactionType})`)
      console.log(`       ${c.articleTitle.slice(0, 60)}`)
    }
  }
}

main().catch(console.error)
