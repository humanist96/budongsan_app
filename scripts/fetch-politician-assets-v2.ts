/**
 * Politician asset data fetcher v2 — data.go.kr 공식 API 연동
 *
 * 기존 뉴스타파 CSV 의존을 data.go.kr 공직자재산공개 API로 대체.
 * API 실패 시 기존 뉴스타파 CSV 방식으로 fallback.
 *
 * API: http://apis.data.go.kr/1741000/AssetDscls/getAssetDsclsList
 * 인증: MOIS_API_KEY 환경변수
 *
 * Usage: pnpm fetch:politicians:v2
 */

import * as fs from 'fs'
import * as path from 'path'
import { loadCelebrityNames } from './lib/celebrity-names'

const MOIS_API_KEY = process.env.MOIS_API_KEY ?? ''

const API_BASE = 'http://apis.data.go.kr/1741000/AssetDscls/getAssetDsclsList'
const REAL_ESTATE_TYPES = ['건물', '토지', '아파트']
const NUM_OF_ROWS = 100

interface ApiItem {
  rprsntvNm: string      // 대표자명
  ofcpsNm: string        // 직위명
  assetSe: string         // 자산구분 (건물, 토지, 아파트 등)
  relatNm: string         // 관계
  prprtyPrpos: string     // 재산용도/종류
  stnrdAddr: string       // 소재지
  ar: string              // 면적
  prvuseAr: string        // 전용면적
  acqsDt: string          // 취득일
  acqsPrice: string       // 취득가격
  crntPrice: string       // 현재가격 (천원)
}

interface ApiResponse {
  response: {
    header: {
      resultCode: string
      resultMsg: string
    }
    body: {
      items: {
        item: ApiItem[] | ApiItem
      }
      totalCount: number
      pageNo: number
      numOfRows: number
    }
  }
}

interface PoliticianCandidate {
  name: string
  position: string
  totalAssetValue: number
  propertyCount: number
  properties: {
    type: string
    location: string
    area: string
    valueManWon: number
    acquisitionDate: string
  }[]
}

interface CandidateResult {
  fetchedAt: string
  source: string
  totalPoliticians: number
  newCandidates: number
  candidates: PoliticianCandidate[]
}

async function fetchPage(pageNo: number): Promise<{ items: ApiItem[]; totalCount: number }> {
  const params = new URLSearchParams({
    serviceKey: MOIS_API_KEY,
    pageNo: String(pageNo),
    numOfRows: String(NUM_OF_ROWS),
    type: 'json',
  })

  const url = `${API_BASE}?${params}`
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }

  const data: ApiResponse = await response.json()

  if (data.response.header.resultCode !== '00') {
    throw new Error(`API result error: ${data.response.header.resultMsg}`)
  }

  const body = data.response.body
  const rawItems = body.items?.item

  if (!rawItems) {
    return { items: [], totalCount: body.totalCount }
  }

  const items = Array.isArray(rawItems) ? rawItems : [rawItems]

  return { items, totalCount: body.totalCount }
}

async function fetchAllFromApi(): Promise<ApiItem[] | null> {
  try {
    console.log('Fetching from data.go.kr API...')

    const firstPage = await fetchPage(1)
    const allItems = [...firstPage.items]
    const totalCount = firstPage.totalCount
    const totalPages = Math.ceil(totalCount / NUM_OF_ROWS)

    console.log(`Total records: ${totalCount}, Pages: ${totalPages}`)

    for (let page = 2; page <= totalPages; page++) {
      try {
        const result = await fetchPage(page)
        allItems.push(...result.items)
        if (page % 10 === 0) {
          console.log(`  Fetched page ${page}/${totalPages} (${allItems.length} items)`)
        }
        await new Promise((r) => setTimeout(r, 200))
      } catch (err) {
        console.error(`  Failed page ${page}:`, err)
      }
    }

    console.log(`Fetched ${allItems.length} total items from API`)
    return allItems
  } catch (err) {
    console.error('API fetch failed:', err)
    return null
  }
}

function filterRealEstateItems(items: ApiItem[]): ApiItem[] {
  return items.filter((item) => REAL_ESTATE_TYPES.includes(item.assetSe))
}

function parsePrice(priceStr: string): number {
  const cleaned = priceStr.replace(/[^0-9]/g, '')
  const thousands = parseInt(cleaned, 10)
  if (isNaN(thousands)) return 0
  // API returns 천원 units → convert to 만원
  return Math.round(thousands / 10)
}

function groupByPolitician(items: ApiItem[]): Map<string, { position: string; items: ApiItem[] }> {
  const grouped = new Map<string, { position: string; items: ApiItem[] }>()

  for (const item of items) {
    const name = item.rprsntvNm?.trim()
    if (!name) continue

    if (!grouped.has(name)) {
      grouped.set(name, { position: item.ofcpsNm ?? '', items: [] })
    }
    grouped.get(name)!.items.push(item)
  }

  return grouped
}

/** Fallback: Try loading from existing newstapa CSV pipeline */
async function fallbackToNewstapaCSV(): Promise<PoliticianCandidate[]> {
  console.log('\nFalling back to 뉴스타파 CSV method...')

  const localPaths = [
    path.resolve(process.cwd(), 'data/politicians-latest.csv'),
    path.resolve(process.cwd(), 'data/politicians.csv'),
  ]

  for (const csvPath of localPaths) {
    if (fs.existsSync(csvPath)) {
      console.log(`Found local CSV: ${csvPath}`)
      const content = fs.readFileSync(csvPath, 'utf-8')
      return parseNewstapaCSV(content)
    }
  }

  console.log('No local CSV found. Download from https://jaesan.newstapa.org/data')
  return []
}

function parseNewstapaCSV(content: string): PoliticianCandidate[] {
  const lines = content.trim().split('\n')
  if (lines.length < 2) return []

  const grouped = new Map<string, { position: string; properties: { type: string; location: string; area: string; valueManWon: number; acquisitionDate: string }[] }>()

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    if (values.length < 8) continue

    const name = values[0] || ''
    const assetType = values[2] || ''

    if (!REAL_ESTATE_TYPES.includes(assetType)) continue

    if (!grouped.has(name)) {
      grouped.set(name, { position: values[1] || '', properties: [] })
    }

    const valueThousands = parseInt(values[7]?.replace(/[^0-9-]/g, '') || '0', 10)
    grouped.get(name)!.properties.push({
      type: values[4] || '',
      location: values[5] || '',
      area: values[6] || '',
      valueManWon: Math.round(valueThousands / 10),
      acquisitionDate: '',
    })
  }

  return [...grouped.entries()].map(([name, { position, properties }]) => ({
    name,
    position,
    totalAssetValue: properties.reduce((sum, p) => sum + p.valueManWon, 0),
    propertyCount: properties.length,
    properties,
  }))
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  fields.push(current.trim())
  return fields
}

async function main() {
  if (!MOIS_API_KEY) {
    console.warn('MOIS_API_KEY not set. Will try fallback CSV method.')
  }

  const existingNames = new Set(loadCelebrityNames())
  console.log(`Loaded ${existingNames.size} existing celebrity names`)

  let candidates: PoliticianCandidate[] = []

  // Try API first
  if (MOIS_API_KEY) {
    const apiItems = await fetchAllFromApi()

    if (apiItems && apiItems.length > 0) {
      const realEstateItems = filterRealEstateItems(apiItems)
      console.log(`Filtered ${realEstateItems.length} real estate items from ${apiItems.length} total`)

      const grouped = groupByPolitician(realEstateItems)

      for (const [name, { position, items }] of grouped) {
        if (existingNames.has(name)) continue

        const properties = items.map((item) => ({
          type: item.prprtyPrpos || item.assetSe,
          location: item.stnrdAddr || '',
          area: item.ar || item.prvuseAr || '',
          valueManWon: parsePrice(item.crntPrice || item.acqsPrice || '0'),
          acquisitionDate: item.acqsDt || '',
        }))

        candidates.push({
          name,
          position,
          totalAssetValue: properties.reduce((sum, p) => sum + p.valueManWon, 0),
          propertyCount: properties.length,
          properties,
        })
      }
    } else {
      // API failed, try fallback
      const fallbackCandidates = await fallbackToNewstapaCSV()
      candidates = fallbackCandidates.filter((c) => !existingNames.has(c.name))
    }
  } else {
    // No API key, use fallback
    const fallbackCandidates = await fallbackToNewstapaCSV()
    candidates = fallbackCandidates.filter((c) => !existingNames.has(c.name))
  }

  // Sort by property count descending
  candidates.sort((a, b) => b.propertyCount - a.propertyCount)

  // Save results
  const result: CandidateResult = {
    fetchedAt: new Date().toISOString(),
    source: MOIS_API_KEY ? 'data.go.kr' : 'newstapa.org (fallback)',
    totalPoliticians: candidates.length + existingNames.size,
    newCandidates: candidates.length,
    candidates,
  }

  const outputDir = path.resolve(process.cwd(), 'data')
  fs.mkdirSync(outputDir, { recursive: true })
  const outputPath = path.join(outputDir, 'politician-candidates-v2.json')
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8')

  console.log(`\n=== Results ===`)
  console.log(`Source: ${result.source}`)
  console.log(`New candidates: ${candidates.length}`)
  console.log(`Saved to ${outputPath}`)

  // Show top candidates
  if (candidates.length > 0) {
    console.log(`\nTop 20 new candidates:`)
    for (const c of candidates.slice(0, 20)) {
      console.log(`  ${c.name} (${c.position}) - ${c.propertyCount} properties, ${c.totalAssetValue}만원`)
    }
  }
}

main().catch(console.error)
