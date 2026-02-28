import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const kakaoApiKey = process.env.KAKAO_REST_API_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface KakaoGeoResponse {
  documents: Array<{
    x: string // longitude
    y: string // latitude
    address_name: string
  }>
}

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  const url = new URL('https://dapi.kakao.com/v2/local/search/address.json')
  url.searchParams.set('query', address)

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `KakaoAK ${kakaoApiKey}`,
    },
  })

  if (!response.ok) {
    console.error(`Geocoding failed for "${address}": ${response.status}`)
    return null
  }

  const data: KakaoGeoResponse = await response.json()
  if (data.documents.length === 0) {
    // Try keyword search as fallback
    const keywordUrl = new URL('https://dapi.kakao.com/v2/local/search/keyword.json')
    keywordUrl.searchParams.set('query', address)

    const keywordResponse = await fetch(keywordUrl.toString(), {
      headers: {
        Authorization: `KakaoAK ${kakaoApiKey}`,
      },
    })

    if (!keywordResponse.ok) return null

    const keywordData = await keywordResponse.json()
    if (keywordData.documents.length === 0) return null

    return {
      lat: parseFloat(keywordData.documents[0].y),
      lng: parseFloat(keywordData.documents[0].x),
    }
  }

  return {
    lat: parseFloat(data.documents[0].y),
    lng: parseFloat(data.documents[0].x),
  }
}

async function main() {
  // Get properties with default coordinates (0,0 or approximate)
  const { data: properties, error } = await supabase
    .from('properties')
    .select('id, name, address, latitude, longitude')

  if (error) {
    console.error('Failed to fetch properties:', error.message)
    return
  }

  let updated = 0
  let failed = 0

  for (const prop of properties || []) {
    // Skip if already has precise coordinates
    if (prop.latitude !== 0 && prop.longitude !== 0) {
      continue
    }

    const coords = await geocodeAddress(prop.address)

    if (coords) {
      const { error: updateError } = await supabase
        .from('properties')
        .update({ latitude: coords.lat, longitude: coords.lng })
        .eq('id', prop.id)

      if (updateError) {
        console.error(`Failed to update ${prop.name}:`, updateError.message)
        failed++
      } else {
        console.log(`Updated: ${prop.name} → (${coords.lat}, ${coords.lng})`)
        updated++
      }
    } else {
      console.error(`No coordinates found for: ${prop.name} (${prop.address})`)
      failed++
    }

    // Rate limit: ~50ms between requests
    await new Promise((r) => setTimeout(r, 50))
  }

  console.log(`\nGeocoding complete: ${updated} updated, ${failed} failed`)
}

main().catch(console.error)
