const VWORLD_BASE = 'https://api.vworld.kr/req'

function getApiKey(): string {
  const key =
    typeof window !== 'undefined'
      ? process.env.NEXT_PUBLIC_VWORLD_API_KEY
      : process.env.VWORLD_API_KEY ?? process.env.NEXT_PUBLIC_VWORLD_API_KEY

  if (!key) {
    throw new Error('VWorld API key not configured')
  }
  return key
}

// ── Types ──────────────────────────────────────────────

export interface VWorldSearchResult {
  title: string
  address: string
  lat: number
  lng: number
  category?: string
}

export interface VWorldGeocodeResult {
  lat: number
  lng: number
  address?: string
}

export interface VWorldReverseResult {
  address: string
  dongCode: string
  lat: number
  lng: number
}

interface VWorldResponse {
  response: {
    status: string
    result?: {
      items?: Array<Record<string, string>>
      crs: string
      type: string
      point?: { x: string; y: string }
      text?: string
    }
    record?: {
      total: string
      current: string
    }
  }
}

// ── Search ─────────────────────────────────────────────

export async function searchPlace(
  query: string,
  options?: { page?: number; size?: number }
): Promise<VWorldSearchResult[]> {
  const key = getApiKey()
  const params = new URLSearchParams({
    service: 'search',
    request: 'search',
    version: '2.0',
    crs: 'EPSG:4326',
    size: String(options?.size ?? 10),
    page: String(options?.page ?? 1),
    query,
    type: 'place',
    format: 'json',
    key,
  })

  const res = await fetch(`${VWORLD_BASE}/search?${params}`)
  if (!res.ok) {
    throw new Error(`VWorld search failed: ${res.status}`)
  }

  const json: VWorldResponse = await res.json()
  if (json.response.status !== 'OK' || !json.response.result?.items) {
    return []
  }

  return json.response.result.items.map((item) => ({
    title: item.title?.replace(/<[^>]*>/g, '') ?? '',
    address: item.address ?? '',
    lat: parseFloat(item.point?.split(',')[1] ?? item.y ?? '0'),
    lng: parseFloat(item.point?.split(',')[0] ?? item.x ?? '0'),
    category: item.category ?? undefined,
  }))
}

// ── Geocode (address → coordinates) ────────────────────

export async function geocodeAddress(
  address: string
): Promise<VWorldGeocodeResult | null> {
  const key = getApiKey()
  const params = new URLSearchParams({
    service: 'address',
    request: 'getcoord',
    version: '2.0',
    crs: 'EPSG:4326',
    address,
    refine: 'true',
    simple: 'false',
    format: 'json',
    type: 'road',
    key,
  })

  const res = await fetch(`${VWORLD_BASE}/address?${params}`)
  if (!res.ok) {
    return null
  }

  const json: VWorldResponse = await res.json()
  if (json.response.status !== 'OK' || !json.response.result?.point) {
    // Fallback: try parcel address type
    params.set('type', 'parcel')
    const retryRes = await fetch(`${VWORLD_BASE}/address?${params}`)
    if (!retryRes.ok) return null

    const retryJson: VWorldResponse = await retryRes.json()
    if (retryJson.response.status !== 'OK' || !retryJson.response.result?.point) {
      return null
    }

    return {
      lat: parseFloat(retryJson.response.result.point.y),
      lng: parseFloat(retryJson.response.result.point.x),
      address: retryJson.response.result.text ?? address,
    }
  }

  return {
    lat: parseFloat(json.response.result.point.y),
    lng: parseFloat(json.response.result.point.x),
    address: json.response.result.text ?? address,
  }
}

// ── Reverse Geocode (coordinates → address) ────────────

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<VWorldReverseResult | null> {
  const key = getApiKey()
  const params = new URLSearchParams({
    service: 'address',
    request: 'getAddress',
    version: '2.0',
    crs: 'EPSG:4326',
    point: `${lng},${lat}`,
    format: 'json',
    type: 'both',
    key,
  })

  const res = await fetch(`${VWORLD_BASE}/address?${params}`)
  if (!res.ok) {
    return null
  }

  const json = await res.json()
  const result = json.response?.result
  if (json.response?.status !== 'OK' || !result) {
    return null
  }

  const items = result as Array<Record<string, string>>
  const item = Array.isArray(items) ? items[0] : result

  return {
    address: item.text ?? '',
    dongCode: item.structure?.level4LC ?? '',
    lat,
    lng,
  }
}
