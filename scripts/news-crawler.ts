/**
 * Naver News API crawler for celebrity real estate news
 *
 * Searches for celebrity + real estate related news articles
 * and extracts potential data candidates for manual review.
 *
 * Requires: NAVER_CLIENT_ID, NAVER_CLIENT_SECRET
 */

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

const SEARCH_KEYWORDS = [
  '연예인 부동산 매입',
  '연예인 아파트 매매',
  '스타 한남더힐',
  '셀럽 청담동 아파트',
  '프로선수 부동산',
  '아이돌 아파트 매입',
  '배우 집 공개',
  '가수 부동산 투자',
]

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

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim()
}

async function main() {
  if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
    console.error('Set NAVER_CLIENT_ID and NAVER_CLIENT_SECRET env vars')
    return
  }

  const allResults: { keyword: string; title: string; link: string; description: string; date: string }[] = []

  for (const keyword of SEARCH_KEYWORDS) {
    try {
      const items = await searchNews(keyword, 5)

      for (const item of items) {
        allResults.push({
          keyword,
          title: stripHtml(item.title),
          link: item.link,
          description: stripHtml(item.description),
          date: item.pubDate,
        })
      }

      // Rate limit
      await new Promise((r) => setTimeout(r, 100))
    } catch (err) {
      console.error(`Search failed for "${keyword}":`, err)
    }
  }

  console.log(`\n=== Found ${allResults.length} news articles ===\n`)

  for (const result of allResults) {
    console.log(`[${result.keyword}]`)
    console.log(`  Title: ${result.title}`)
    console.log(`  URL: ${result.link}`)
    console.log(`  Date: ${result.date}`)
    console.log(`  Desc: ${result.description.slice(0, 100)}...`)
    console.log()
  }
}

main().catch(console.error)
