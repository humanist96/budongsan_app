interface MolitTransaction {
  dealAmount: string
  dealYear: string
  dealMonth: string
  dealDay: string
  aptName: string
  excluUseAr: string
  floor: string
  jibun: string
  dong: string
  buildYear: string
}

interface FetchTransactionsParams {
  lawdCd: string
  dealYmd: string
}

export async function fetchApartmentTransactions({
  lawdCd,
  dealYmd,
}: FetchTransactionsParams): Promise<MolitTransaction[]> {
  const apiKey = process.env.MOLIT_API_KEY
  if (!apiKey) {
    throw new Error('MOLIT_API_KEY is not configured')
  }

  const url = new URL('http://openapi.molit.go.kr/OpenAPI_ToolInstall498/service/rest/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev')
  url.searchParams.set('serviceKey', apiKey)
  url.searchParams.set('LAWD_CD', lawdCd)
  url.searchParams.set('DEAL_YMD', dealYmd)
  url.searchParams.set('pageNo', '1')
  url.searchParams.set('numOfRows', '1000')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`MOLIT API error: ${response.status}`)
  }

  const text = await response.text()
  return parseXmlResponse(text)
}

function parseXmlResponse(xml: string): MolitTransaction[] {
  const items: MolitTransaction[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1]
    items.push({
      dealAmount: extractTag(itemXml, '거래금액') || extractTag(itemXml, 'dealAmount') || '',
      dealYear: extractTag(itemXml, '년') || extractTag(itemXml, 'dealYear') || '',
      dealMonth: extractTag(itemXml, '월') || extractTag(itemXml, 'dealMonth') || '',
      dealDay: extractTag(itemXml, '일') || extractTag(itemXml, 'dealDay') || '',
      aptName: extractTag(itemXml, '아파트') || extractTag(itemXml, 'aptNm') || '',
      excluUseAr: extractTag(itemXml, '전용면적') || extractTag(itemXml, 'excluUseAr') || '',
      floor: extractTag(itemXml, '층') || extractTag(itemXml, 'floor') || '',
      jibun: extractTag(itemXml, '지번') || extractTag(itemXml, 'jibun') || '',
      dong: extractTag(itemXml, '법정동') || extractTag(itemXml, 'dong') || '',
      buildYear: extractTag(itemXml, '건축년도') || extractTag(itemXml, 'buildYear') || '',
    })
  }

  return items
}

function extractTag(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}>\\s*([\\s\\S]*?)\\s*</${tag}>`)
  const match = regex.exec(xml)
  return match ? match[1].trim() : ''
}

export function parseDealAmount(amount: string): number {
  return parseInt(amount.replace(/,/g, '').trim(), 10)
}
