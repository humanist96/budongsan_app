/**
 * 자동 지오코딩 파이프라인
 *
 * 다중 소스에서 미지오코딩 주소를 수집하여 일괄 처리:
 * 1. data/extraction-candidates.json (뉴스 추출)
 * 2. data/politician-candidates-v2.json (정치인 API)
 * 3. data/bdmonth-results/*.json (월간빌딩)
 * 4. Supabase properties (좌표 0,0인 건)
 *
 * VWorld 지오코딩 API 사용 (road → parcel → place search fallback)
 *
 * Usage:
 *   pnpm geocode:auto              # JSON 파일로 저장만
 *   pnpm geocode:auto -- --apply   # Supabase에도 반영
 */

import * as fs from 'fs'
import * as path from 'path'

const VWORLD_API_KEY = process.env.VWORLD_API_KEY ?? ''
const VWORLD_BASE = 'https://api.vworld.kr/req'

interface AddressToGeocode {
  source: string
  address: string
  name: string
  relatedCelebrity?: string
}

interface GeocodedResult {
  source: string
  address: string
  name: string
  relatedCelebrity?: string
  lat: number
  lng: number
  dongCode: string
  method: string
}

interface PipelineResult {
  processedAt: string
  totalInput: number
  geocoded: number
  failed: number
  results: GeocodedResult[]
  failedAddresses: string[]
}

async function geocodeWithVWorld(address: string): Promise<{ lat: number; lng: number; method: string } | null> {
  // 1차: 도로명 주소
  const roadResult = await tryVWorldAddress(address, 'road')
  if (roadResult) return { ...roadResult, method: 'road' }

  // 2차: 지번 주소
  const parcelResult = await tryVWorldAddress(address, 'parcel')
  if (parcelResult) return { ...parcelResult, method: 'parcel' }

  // 3차: 장소명 검색 fallback
  const searchResult = await tryVWorldSearch(address)
  if (searchResult) return { ...searchResult, method: 'place_search' }

  return null
}

async function tryVWorldAddress(address: string, type: 'road' | 'parcel'): Promise<{ lat: number; lng: number } | null> {
  const params = new URLSearchParams({
    service: 'address',
    request: 'getcoord',
    version: '2.0',
    crs: 'EPSG:4326',
    address,
    refine: 'true',
    simple: 'false',
    format: 'json',
    type,
    key: VWORLD_API_KEY,
  })

  try {
    const res = await fetch(`${VWORLD_BASE}/address?${params}`)
    if (!res.ok) return null

    const json = await res.json()
    if (json.response?.status === 'OK' && json.response.result?.point) {
      const { x, y } = json.response.result.point
      return { lat: parseFloat(y), lng: parseFloat(x) }
    }
  } catch {
    // ignore
  }

  return null
}

async function tryVWorldSearch(query: string): Promise<{ lat: number; lng: number } | null> {
  const params = new URLSearchParams({
    service: 'search',
    request: 'search',
    version: '2.0',
    crs: 'EPSG:4326',
    size: '1',
    page: '1',
    query,
    type: 'place',
    format: 'json',
    key: VWORLD_API_KEY,
  })

  try {
    const res = await fetch(`${VWORLD_BASE}/search?${params}`)
    if (!res.ok) return null

    const json = await res.json()
    const items = json.response?.result?.items
    if (json.response?.status === 'OK' && items && items.length > 0) {
      const item = items[0]
      const point = item.point?.split(',')
      if (point && point.length === 2) {
        return { lat: parseFloat(point[1]), lng: parseFloat(point[0]) }
      }
    }
  } catch {
    // ignore
  }

  return null
}

async function getDongCode(lat: number, lng: number): Promise<string> {
  const params = new URLSearchParams({
    service: 'address',
    request: 'getAddress',
    version: '2.0',
    crs: 'EPSG:4326',
    point: `${lng},${lat}`,
    format: 'json',
    type: 'both',
    key: VWORLD_API_KEY,
  })

  try {
    const res = await fetch(`${VWORLD_BASE}/address?${params}`)
    if (!res.ok) return ''

    const json = await res.json()
    const result = json.response?.result
    if (json.response?.status !== 'OK' || !result) return ''

    const items = Array.isArray(result) ? result : [result]
    const level4LC = items[0]?.structure?.level4LC ?? ''
    return level4LC ? level4LC.substring(0, 5) : ''
  } catch {
    return ''
  }
}

// ── Source loaders ──

function loadExtractionCandidates(): AddressToGeocode[] {
  const filePath = path.resolve(process.cwd(), 'data/extraction-candidates.json')
  if (!fs.existsSync(filePath)) return []

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    const addresses: AddressToGeocode[] = []

    for (const candidate of data.candidates ?? []) {
      if (candidate.propertyName) {
        addresses.push({
          source: 'news_extraction',
          address: candidate.propertyName,
          name: candidate.propertyName,
          relatedCelebrity: candidate.celebrityName || undefined,
        })
      }
    }

    return addresses
  } catch {
    return []
  }
}

function loadPoliticianCandidates(): AddressToGeocode[] {
  const filePath = path.resolve(process.cwd(), 'data/politician-candidates-v2.json')
  if (!fs.existsSync(filePath)) return []

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    const addresses: AddressToGeocode[] = []

    for (const candidate of data.candidates ?? []) {
      for (const prop of candidate.properties ?? []) {
        if (prop.location) {
          addresses.push({
            source: 'politician_api',
            address: prop.location,
            name: `${candidate.name} - ${prop.type}`,
            relatedCelebrity: candidate.name,
          })
        }
      }
    }

    return addresses
  } catch {
    return []
  }
}

function loadBdmonthResults(): AddressToGeocode[] {
  const dir = path.resolve(process.cwd(), 'data/bdmonth-results')
  if (!fs.existsSync(dir)) return []

  const addresses: AddressToGeocode[] = []

  try {
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'))
    for (const file of files) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'))
        for (const item of data.results ?? data.items ?? []) {
          if (item.address || item.location) {
            addresses.push({
              source: 'bdmonth',
              address: item.address || item.location,
              name: item.name || item.buildingName || 'unknown',
            })
          }
        }
      } catch {
        // skip malformed files
      }
    }
  } catch {
    // dir read error
  }

  return addresses
}

async function loadSupabaseUngeocoded(): Promise<AddressToGeocode[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) return []

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('properties')
      .select('id, name, address, latitude, longitude')
      .or('latitude.eq.0,longitude.eq.0')

    if (error || !data) return []

    return data.map((prop) => ({
      source: 'supabase_ungeocoded',
      address: prop.address,
      name: prop.name,
    }))
  } catch {
    return []
  }
}

async function applyToSupabase(results: GeocodedResult[]): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase credentials not set. Skipping DB update.')
    return
  }

  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const supabaseResults = results.filter((r) => r.source === 'supabase_ungeocoded')
  if (supabaseResults.length === 0) {
    console.log('No Supabase properties to update.')
    return
  }

  let updated = 0
  for (const result of supabaseResults) {
    const updateData: Record<string, unknown> = {
      latitude: result.lat,
      longitude: result.lng,
    }
    if (result.dongCode) {
      updateData.dong_code = result.dongCode
    }

    const { error } = await supabase
      .from('properties')
      .update(updateData)
      .eq('address', result.address)
      .eq('latitude', 0)

    if (!error) updated++
  }

  console.log(`Supabase: ${updated}/${supabaseResults.length} properties updated`)
}

async function main() {
  if (!VWORLD_API_KEY) {
    console.error('VWORLD_API_KEY not set. Cannot geocode.')
    return
  }

  const applyFlag = process.argv.includes('--apply')

  // Collect addresses from all sources
  console.log('Collecting addresses from all sources...')

  const newsAddresses = loadExtractionCandidates()
  console.log(`  News extraction: ${newsAddresses.length}`)

  const politicianAddresses = loadPoliticianCandidates()
  console.log(`  Politician API: ${politicianAddresses.length}`)

  const bdmonthAddresses = loadBdmonthResults()
  console.log(`  Monthly building: ${bdmonthAddresses.length}`)

  const supabaseAddresses = await loadSupabaseUngeocoded()
  console.log(`  Supabase (0,0): ${supabaseAddresses.length}`)

  const allAddresses = [
    ...newsAddresses,
    ...politicianAddresses,
    ...bdmonthAddresses,
    ...supabaseAddresses,
  ]

  // Deduplicate by address
  const seen = new Set<string>()
  const unique = allAddresses.filter((a) => {
    if (seen.has(a.address)) return false
    seen.add(a.address)
    return true
  })

  console.log(`\nTotal unique addresses: ${unique.length}`)

  const results: GeocodedResult[] = []
  const failedAddresses: string[] = []

  for (let i = 0; i < unique.length; i++) {
    const addr = unique[i]
    const progress = `[${i + 1}/${unique.length}]`

    try {
      const coords = await geocodeWithVWorld(addr.address)

      if (coords) {
        const dongCode = await getDongCode(coords.lat, coords.lng)

        results.push({
          source: addr.source,
          address: addr.address,
          name: addr.name,
          relatedCelebrity: addr.relatedCelebrity,
          lat: coords.lat,
          lng: coords.lng,
          dongCode,
          method: coords.method,
        })

        console.log(`${progress} OK [${coords.method}] ${addr.name} → (${coords.lat}, ${coords.lng})`)
      } else {
        failedAddresses.push(addr.address)
        console.log(`${progress} FAIL ${addr.name} (${addr.address})`)
      }
    } catch (err) {
      failedAddresses.push(addr.address)
      console.error(`${progress} ERROR ${addr.name}:`, err)
    }

    // Rate limit
    await new Promise((r) => setTimeout(r, 150))
  }

  // Save results
  const pipelineResult: PipelineResult = {
    processedAt: new Date().toISOString(),
    totalInput: unique.length,
    geocoded: results.length,
    failed: failedAddresses.length,
    results,
    failedAddresses,
  }

  const outputDir = path.resolve(process.cwd(), 'data')
  fs.mkdirSync(outputDir, { recursive: true })
  const outputPath = path.join(outputDir, 'geocoded-properties.json')
  fs.writeFileSync(outputPath, JSON.stringify(pipelineResult, null, 2), 'utf-8')

  console.log(`\n=== Geocoding Results ===`)
  console.log(`Input: ${unique.length}`)
  console.log(`Geocoded: ${results.length}`)
  console.log(`Failed: ${failedAddresses.length}`)

  const byMethod = results.reduce((acc, r) => {
    acc[r.method] = (acc[r.method] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  console.log(`\nBy method:`)
  for (const [method, count] of Object.entries(byMethod)) {
    console.log(`  ${method}: ${count}`)
  }

  console.log(`\nSaved to ${outputPath}`)

  // Apply to Supabase if --apply flag
  if (applyFlag) {
    console.log('\n--apply flag detected. Updating Supabase...')
    await applyToSupabase(results)
  }
}

main().catch(console.error)
