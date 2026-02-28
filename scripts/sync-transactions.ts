import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const molitApiKey = process.env.MOLIT_API_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface MolitItem {
  거래금액?: string
  dealAmount?: string
  년?: string
  dealYear?: string
  월?: string
  dealMonth?: string
  일?: string
  dealDay?: string
  아파트?: string
  aptNm?: string
  전용면적?: string
  excluUseAr?: string
  층?: string
  floor?: string
  지번?: string
  jibun?: string
  법정동?: string
  dong?: string
}

function extractTag(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}>\\s*([\\s\\S]*?)\\s*</${tag}>`)
  const match = regex.exec(xml)
  return match ? match[1].trim() : ''
}

async function fetchTransactions(lawdCd: string, dealYmd: string): Promise<MolitItem[]> {
  const url = new URL('http://openapi.molit.go.kr/OpenAPI_ToolInstall498/service/rest/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev')
  url.searchParams.set('serviceKey', molitApiKey)
  url.searchParams.set('LAWD_CD', lawdCd)
  url.searchParams.set('DEAL_YMD', dealYmd)
  url.searchParams.set('pageNo', '1')
  url.searchParams.set('numOfRows', '1000')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const xml = await response.text()
  const items: MolitItem[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1]
    items.push({
      거래금액: extractTag(itemXml, '거래금액') || extractTag(itemXml, 'dealAmount'),
      년: extractTag(itemXml, '년') || extractTag(itemXml, 'dealYear'),
      월: extractTag(itemXml, '월') || extractTag(itemXml, 'dealMonth'),
      일: extractTag(itemXml, '일') || extractTag(itemXml, 'dealDay'),
      아파트: extractTag(itemXml, '아파트') || extractTag(itemXml, 'aptNm'),
      전용면적: extractTag(itemXml, '전용면적') || extractTag(itemXml, 'excluUseAr'),
      층: extractTag(itemXml, '층') || extractTag(itemXml, 'floor'),
      법정동: extractTag(itemXml, '법정동') || extractTag(itemXml, 'dong'),
    })
  }

  return items
}

async function main() {
  // Get unique dong_codes from properties
  const { data: properties } = await supabase
    .from('properties')
    .select('id, name, dong_code, address')
    .not('dong_code', 'is', null)

  if (!properties || properties.length === 0) {
    console.log('No properties with dong_code found')
    return
  }

  const dongCodes = [...new Set(properties.map((p) => p.dong_code).filter(Boolean))]

  // Sync last 3 months
  const now = new Date()
  const months: string[] = []
  for (let i = 0; i < 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(`${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`)
  }

  let synced = 0

  for (const dongCode of dongCodes) {
    for (const month of months) {
      try {
        const items = await fetchTransactions(dongCode!, month)

        for (const item of items) {
          const amount = parseInt((item.거래금액 || '0').replace(/,/g, '').trim(), 10)
          const year = parseInt(item.년 || '0', 10)
          const monthNum = parseInt(item.월 || '0', 10)
          const day = parseInt(item.일 || '0', 10)
          const aptName = item.아파트 || ''
          const area = parseFloat(item.전용면적 || '0')
          const floor = parseInt(item.층 || '0', 10)

          // Match property by name similarity
          const matchedProp = properties.find(
            (p) => p.dong_code === dongCode && p.name.includes(aptName)
          )

          if (matchedProp && amount > 0) {
            const { error } = await supabase.from('transactions').upsert(
              {
                property_id: matchedProp.id,
                transaction_amount: amount,
                transaction_year: year,
                transaction_month: monthNum,
                transaction_day: day,
                exclusive_area: area || null,
                floor: floor || null,
                raw_data: item,
              },
              { onConflict: 'property_id' }
            )

            if (!error) {
              synced++
              // Update latest transaction on property
              await supabase
                .from('properties')
                .update({
                  latest_transaction_price: amount,
                  latest_transaction_date: `${year}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                })
                .eq('id', matchedProp.id)
            }
          }
        }

        // Rate limit
        await new Promise((r) => setTimeout(r, 200))
      } catch (err) {
        console.error(`Error fetching ${dongCode} ${month}:`, err)
      }
    }
  }

  console.log(`Synced ${synced} transactions`)
}

main().catch(console.error)
