import { execFile } from 'child_process'
import { parseNaverPrice } from './price-parser'
import type { NaverLandListing, NaverSearchParams, NaverSearchResult } from './types'

// ─── Cache ──────────────────────────────────────────────────

interface CacheEntry {
  data: NaverSearchResult
  expiry: number
}

const cache = new Map<string, CacheEntry>()
const CACHE_TTL_MS = 5 * 60 * 1000 // 5분

function getCacheKey(params: NaverSearchParams): string {
  return `${params.district}|${params.tradeType ?? '매매'}|${params.nameContains ?? ''}`
}

// ─── Semaphore (동시 실행 제한) ──────────────────────────────

let activeCount = 0
const MAX_CONCURRENT = 3
const waitQueue: Array<() => void> = []

function acquireSemaphore(): Promise<void> {
  if (activeCount < MAX_CONCURRENT) {
    activeCount++
    return Promise.resolve()
  }
  return new Promise((resolve) => {
    waitQueue.push(() => {
      activeCount++
      resolve()
    })
  })
}

function releaseSemaphore(): void {
  activeCount--
  const next = waitQueue.shift()
  if (next) next()
}

// ─── CLI Execution ──────────────────────────────────────────

interface RawListing {
  atcl_no?: string
  atcl_nm?: string
  trad_tp_nm?: string
  rlet_tp_nm?: string
  spc1?: number
  spc2?: number
  pyeong?: number
  size_type?: string
  prc?: string
  rent_prc?: string | null
  flr_info?: string
  cfm_ymd?: string
  tag_list?: string[]
}

function buildCliArgs(params: NaverSearchParams): string[] {
  const args = ['--json', 'search', 'region', '-d', params.district]

  if (params.tradeType) {
    args.push('-t', params.tradeType)
  } else {
    args.push('-t', '매매')
  }

  if (params.nameContains) {
    args.push('--name-contains', params.nameContains)
  }

  if (params.minArea) {
    args.push('--min-area', String(params.minArea))
  }

  if (params.maxArea) {
    args.push('--max-area', String(params.maxArea))
  }

  if (params.limit) {
    args.push('-n', String(params.limit))
  } else {
    args.push('-n', '20')
  }

  return args
}

function parseListing(raw: RawListing): NaverLandListing {
  return {
    articleNo: raw.atcl_no ?? '',
    complexName: raw.atcl_nm ?? '',
    tradeType: raw.trad_tp_nm ?? '',
    propertyType: raw.rlet_tp_nm ?? '',
    exclusiveArea: raw.spc1 ?? 0,
    supplyArea: raw.spc2 ?? 0,
    pyeong: raw.pyeong ?? 0,
    sizeType: raw.size_type ?? '',
    price: parseNaverPrice(raw.prc),
    priceText: raw.prc ?? '',
    rentPrice: raw.rent_prc ? parseNaverPrice(raw.rent_prc) : null,
    floorInfo: raw.flr_info ?? '',
    confirmDate: raw.cfm_ymd ?? '',
    tags: raw.tag_list ?? [],
  }
}

export async function searchNaverLand(params: NaverSearchParams): Promise<NaverSearchResult> {
  // 1. 캐시 확인
  const key = getCacheKey(params)
  const cached = cache.get(key)
  if (cached && cached.expiry > Date.now()) {
    return { ...cached.data, meta: { ...cached.data.meta, cached: true } }
  }

  // 2. Semaphore 획득
  await acquireSemaphore()

  try {
    const args = buildCliArgs(params)

    const result = await new Promise<NaverSearchResult>((resolve, reject) => {
      execFile('cli-anything-naver-land', args, {
        timeout: 20000,
        maxBuffer: 1024 * 1024 * 5,
        env: { ...process.env },
      }, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`CLI 실행 실패: ${error.message}`))
          return
        }

        try {
          // stdout에서 JSON 부분만 추출 (warning 메시지 제거)
          const jsonStart = stdout.indexOf('[')
          const jsonStr = jsonStart >= 0 ? stdout.slice(jsonStart) : stdout

          const raw: RawListing[] = JSON.parse(jsonStr)
          const listings = raw.map(parseListing)

          resolve({
            listings,
            meta: {
              total: listings.length,
              fetchedAt: new Date().toISOString(),
              cached: false,
              district: params.district,
            },
          })
        } catch (parseError) {
          reject(new Error(`결과 파싱 실패: ${parseError}`))
        }
      })
    })

    // 3. 캐시 저장
    cache.set(key, { data: result, expiry: Date.now() + CACHE_TTL_MS })

    return result
  } finally {
    releaseSemaphore()
  }
}

