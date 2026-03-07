import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const vworldApiKey = process.env.VWORLD_API_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const VWORLD_BASE = 'https://api.vworld.kr/req'

interface GeocodeResult {
  lat: number
  lng: number
  dongCode?: string
}

async function geocodeWithVWorld(address: string): Promise<GeocodeResult | null> {
  // 1차: 주소 지오코딩 (도로명)
  const roadParams = new URLSearchParams({
    service: 'address',
    request: 'getcoord',
    version: '2.0',
    crs: 'EPSG:4326',
    address,
    refine: 'true',
    simple: 'false',
    format: 'json',
    type: 'road',
    key: vworldApiKey,
  })

  const roadRes = await fetch(`${VWORLD_BASE}/address?${roadParams}`)
  if (roadRes.ok) {
    const json = await roadRes.json()
    if (json.response?.status === 'OK' && json.response.result?.point) {
      const { x, y } = json.response.result.point
      return { lat: parseFloat(y), lng: parseFloat(x) }
    }
  }

  // 1-b: 지번 주소로 재시도
  const parcelParams = new URLSearchParams({
    service: 'address',
    request: 'getcoord',
    version: '2.0',
    crs: 'EPSG:4326',
    address,
    refine: 'true',
    simple: 'false',
    format: 'json',
    type: 'parcel',
    key: vworldApiKey,
  })

  const parcelRes = await fetch(`${VWORLD_BASE}/address?${parcelParams}`)
  if (parcelRes.ok) {
    const json = await parcelRes.json()
    if (json.response?.status === 'OK' && json.response.result?.point) {
      const { x, y } = json.response.result.point
      return { lat: parseFloat(y), lng: parseFloat(x) }
    }
  }

  // 2차 fallback: 장소명 검색
  const searchParams = new URLSearchParams({
    service: 'search',
    request: 'search',
    version: '2.0',
    crs: 'EPSG:4326',
    size: '1',
    page: '1',
    query: address,
    type: 'place',
    format: 'json',
    key: vworldApiKey,
  })

  const searchRes = await fetch(`${VWORLD_BASE}/search?${searchParams}`)
  if (searchRes.ok) {
    const json = await searchRes.json()
    const items = json.response?.result?.items
    if (json.response?.status === 'OK' && items && items.length > 0) {
      const item = items[0]
      const point = item.point?.split(',')
      if (point && point.length === 2) {
        return { lat: parseFloat(point[1]), lng: parseFloat(point[0]) }
      }
    }
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
    key: vworldApiKey,
  })

  try {
    const res = await fetch(`${VWORLD_BASE}/address?${params}`)
    if (!res.ok) return ''

    const json = await res.json()
    const result = json.response?.result
    if (json.response?.status !== 'OK' || !result) return ''

    const items = Array.isArray(result) ? result : [result]
    const level4LC = items[0]?.structure?.level4LC ?? ''
    // 법정동코드 앞 5자리
    return level4LC ? level4LC.substring(0, 5) : ''
  } catch {
    return ''
  }
}

async function main() {
  const { data: properties, error } = await supabase
    .from('properties')
    .select('id, name, address, latitude, longitude, dong_code')

  if (error) {
    console.error('Failed to fetch properties:', error.message)
    return
  }

  let updated = 0
  let failed = 0

  for (const prop of properties ?? []) {
    // Skip if already has precise coordinates
    if (prop.latitude !== 0 && prop.longitude !== 0) {
      continue
    }

    const coords = await geocodeWithVWorld(prop.address)

    if (coords) {
      // 역지오코딩으로 dong_code 자동 추출
      const dongCode = await getDongCode(coords.lat, coords.lng)

      const updateData: Record<string, unknown> = {
        latitude: coords.lat,
        longitude: coords.lng,
      }
      if (dongCode && !prop.dong_code) {
        updateData.dong_code = dongCode
      }

      const { error: updateError } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', prop.id)

      if (updateError) {
        console.error(`Failed to update ${prop.name}:`, updateError.message)
        failed++
      } else {
        console.log(
          `Updated: ${prop.name} → (${coords.lat}, ${coords.lng})${dongCode ? ` [동코드: ${dongCode}]` : ''}`
        )
        updated++
      }
    } else {
      console.error(`No coordinates found for: ${prop.name} (${prop.address})`)
      failed++
    }

    // Rate limit: ~100ms between requests
    await new Promise((r) => setTimeout(r, 100))
  }

  console.log(`\nGeocoding complete: ${updated} updated, ${failed} failed`)
}

main().catch(console.error)
