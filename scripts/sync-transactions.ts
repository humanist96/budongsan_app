/**
 * Sync real estate transactions from MOLIT API to Supabase
 *
 * Supports: apartments, buildings, houses, and land
 *
 * Usage: pnpm sync:transactions
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const molitApiKey = process.env.MOLIT_API_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// ── XML parser helpers ──

function extractTag(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}>\\s*([\\s\\S]*?)\\s*</${tag}>`)
  const match = regex.exec(xml)
  return match ? match[1].trim() : ''
}

function extractItems(xml: string): string[] {
  const items: string[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match
  while ((match = itemRegex.exec(xml)) !== null) {
    items.push(match[1])
  }
  return items
}

// ── API fetchers ──

async function fetchMolitApi(endpoint: string, lawdCd: string, dealYmd: string): Promise<string> {
  const url = new URL(`http://openapi.molit.go.kr/OpenAPI_ToolInstall498/service/rest/${endpoint}`)
  url.searchParams.set('serviceKey', molitApiKey)
  url.searchParams.set('LAWD_CD', lawdCd)
  url.searchParams.set('DEAL_YMD', dealYmd)
  url.searchParams.set('pageNo', '1')
  url.searchParams.set('numOfRows', '1000')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }
  return response.text()
}

interface ParsedTransaction {
  amount: number
  year: number
  month: number
  day: number
  name: string
  area: number
  floor: number
  dong: string
  rawData: Record<string, string>
}

function parseApartmentItems(xml: string): ParsedTransaction[] {
  return extractItems(xml).map((itemXml) => {
    const amount = parseInt((extractTag(itemXml, '거래금액') || '0').replace(/,/g, '').trim(), 10)
    const aptName = extractTag(itemXml, '아파트') || extractTag(itemXml, 'aptNm') || ''
    return {
      amount,
      year: parseInt(extractTag(itemXml, '년') || '0', 10),
      month: parseInt(extractTag(itemXml, '월') || '0', 10),
      day: parseInt(extractTag(itemXml, '일') || '0', 10),
      name: aptName,
      area: parseFloat(extractTag(itemXml, '전용면적') || '0'),
      floor: parseInt(extractTag(itemXml, '층') || '0', 10),
      dong: extractTag(itemXml, '법정동') || '',
      rawData: { type: 'apartment', name: aptName },
    }
  })
}

function parseBuildingItems(xml: string): ParsedTransaction[] {
  return extractItems(xml).map((itemXml) => {
    const amount = parseInt((extractTag(itemXml, '거래금액') || '0').replace(/,/g, '').trim(), 10)
    const buildingUse = extractTag(itemXml, '건물주용도') || ''
    const dong = extractTag(itemXml, '법정동') || ''
    return {
      amount,
      year: parseInt(extractTag(itemXml, '년') || '0', 10),
      month: parseInt(extractTag(itemXml, '월') || '0', 10),
      day: parseInt(extractTag(itemXml, '일') || '0', 10),
      name: `${dong} ${buildingUse}`,
      area: parseFloat(extractTag(itemXml, '건물면적') || '0'),
      floor: parseInt(extractTag(itemXml, '층') || '0', 10),
      dong,
      rawData: {
        type: 'building',
        buildingUse,
        landArea: extractTag(itemXml, '대지면적') || '',
      },
    }
  })
}

function parseHouseItems(xml: string): ParsedTransaction[] {
  return extractItems(xml).map((itemXml) => {
    const amount = parseInt((extractTag(itemXml, '거래금액') || '0').replace(/,/g, '').trim(), 10)
    const houseType = extractTag(itemXml, '주택유형') || ''
    const dong = extractTag(itemXml, '법정동') || ''
    return {
      amount,
      year: parseInt(extractTag(itemXml, '년') || '0', 10),
      month: parseInt(extractTag(itemXml, '월') || '0', 10),
      day: parseInt(extractTag(itemXml, '일') || '0', 10),
      name: `${dong} ${houseType}`,
      area: parseFloat(extractTag(itemXml, '연면적') || extractTag(itemXml, '대지면적') || '0'),
      floor: 0,
      dong,
      rawData: {
        type: 'house',
        houseType,
        buildYear: extractTag(itemXml, '건축년도') || '',
      },
    }
  })
}

function parseLandItems(xml: string): ParsedTransaction[] {
  return extractItems(xml).map((itemXml) => {
    const amount = parseInt((extractTag(itemXml, '거래금액') || '0').replace(/,/g, '').trim(), 10)
    const landCategory = extractTag(itemXml, '지목') || ''
    const dong = extractTag(itemXml, '법정동') || ''
    return {
      amount,
      year: parseInt(extractTag(itemXml, '년') || '0', 10),
      month: parseInt(extractTag(itemXml, '월') || '0', 10),
      day: parseInt(extractTag(itemXml, '일') || '0', 10),
      name: `${dong} ${landCategory}`,
      area: parseFloat(extractTag(itemXml, '거래면적') || '0'),
      floor: 0,
      dong,
      rawData: {
        type: 'land',
        landCategory,
        landUseArea: extractTag(itemXml, '용도지역') || '',
      },
    }
  })
}

// ── Property type → API endpoint mapping ──

const PROPERTY_API_MAP: Record<string, {
  endpoint: string
  parser: (xml: string) => ParsedTransaction[]
}> = {
  apartment: {
    endpoint: 'RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev',
    parser: parseApartmentItems,
  },
  building: {
    endpoint: 'RTMSDataSvcNrgTrade/getRTMSDataSvcNrgTrade',
    parser: parseBuildingItems,
  },
  house: {
    endpoint: 'RTMSDataSvcSHTrade/getRTMSDataSvcSHTrade',
    parser: parseHouseItems,
  },
  land: {
    endpoint: 'RTMSDataSvcLandTrade/getRTMSDataSvcLandTrade',
    parser: parseLandItems,
  },
}

async function main() {
  const { data: properties } = await supabase
    .from('properties')
    .select('id, name, dong_code, address, property_type')
    .not('dong_code', 'is', null)

  if (!properties || properties.length === 0) {
    console.log('No properties with dong_code found')
    return
  }

  // Group properties by dong_code and type
  const dongCodes = [...new Set(properties.map((p) => p.dong_code).filter(Boolean))]

  // Sync last 3 months
  const now = new Date()
  const months: string[] = []
  for (let i = 0; i < 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(`${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`)
  }

  // Determine which API types to query based on property types in DB
  const propertyTypes = [...new Set(properties.map((p) => p.property_type).filter(Boolean))]
  const apiTypesToQuery = propertyTypes
    .map((t) => {
      if (t === 'apartment' || t === 'officetel') return 'apartment'
      if (t === 'building') return 'building'
      if (t === 'house' || t === 'villa') return 'house'
      if (t === 'land') return 'land'
      return 'apartment' // default
    })
    .filter((v, i, a) => a.indexOf(v) === i)

  let synced = 0

  for (const dongCode of dongCodes) {
    for (const month of months) {
      for (const apiType of apiTypesToQuery) {
        const apiConfig = PROPERTY_API_MAP[apiType]
        if (!apiConfig) continue

        try {
          const xml = await fetchMolitApi(apiConfig.endpoint, dongCode!, month)
          const items = apiConfig.parser(xml)

          for (const item of items) {
            if (item.amount <= 0) continue

            // Match property by name similarity
            const matchedProp = properties.find(
              (p) => p.dong_code === dongCode && p.name.includes(item.name)
            ) ?? properties.find(
              (p) => p.dong_code === dongCode && item.name.includes(p.name)
            )

            if (!matchedProp) continue

            const { error } = await supabase.from('transactions').upsert(
              {
                property_id: matchedProp.id,
                transaction_amount: item.amount,
                transaction_year: item.year,
                transaction_month: item.month,
                transaction_day: item.day,
                exclusive_area: item.area || null,
                floor: item.floor || null,
                raw_data: item.rawData,
              },
              { onConflict: 'property_id' }
            )

            if (!error) {
              synced++
              await supabase
                .from('properties')
                .update({
                  latest_transaction_price: item.amount,
                  latest_transaction_date: `${item.year}-${String(item.month).padStart(2, '0')}-${String(item.day).padStart(2, '0')}`,
                })
                .eq('id', matchedProp.id)
            }
          }

          // Rate limit between API calls
          await new Promise((r) => setTimeout(r, 200))
        } catch (err) {
          console.error(`Error fetching ${apiType} ${dongCode} ${month}:`, err)
        }
      }
    }
  }

  console.log(`Synced ${synced} transactions (apartments, buildings, houses, land)`)
}

main().catch(console.error)
