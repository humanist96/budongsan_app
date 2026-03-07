// ── Shared types ──

interface FetchTransactionsParams {
  lawdCd: string
  dealYmd: string
}

// ── Apartment (아파트) ──

export interface MolitTransaction {
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

// ── Building (상업/업무용) ──

export interface MolitBuildingTransaction {
  dealAmount: string
  dealYear: string
  dealMonth: string
  dealDay: string
  buildingUse: string    // 건물주용도
  buildingArea: string   // 건물면적
  landArea: string       // 대지면적
  floor: string
  dong: string
  jibun: string
}

// ── House (단독/다가구) ──

export interface MolitHouseTransaction {
  dealAmount: string
  dealYear: string
  dealMonth: string
  dealDay: string
  houseType: string      // 주택유형
  landArea: string       // 대지면적
  totalFloorArea: string // 연면적
  buildYear: string      // 건축년도
  dong: string
  jibun: string
}

// ── Land (토지) ──

export interface MolitLandTransaction {
  dealAmount: string
  dealYear: string
  dealMonth: string
  dealDay: string
  landUseArea: string    // 용도지역
  landCategory: string   // 지목
  dealArea: string       // 거래면적
  dong: string
  jibun: string
}

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

async function fetchMolitApi(endpoint: string, params: FetchTransactionsParams): Promise<string> {
  const apiKey = process.env.MOLIT_API_KEY
  if (!apiKey) {
    throw new Error('MOLIT_API_KEY is not configured')
  }

  const url = new URL(`http://openapi.molit.go.kr/OpenAPI_ToolInstall498/service/rest/${endpoint}`)
  url.searchParams.set('serviceKey', apiKey)
  url.searchParams.set('LAWD_CD', params.lawdCd)
  url.searchParams.set('DEAL_YMD', params.dealYmd)
  url.searchParams.set('pageNo', '1')
  url.searchParams.set('numOfRows', '1000')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`MOLIT API error: ${response.status}`)
  }

  return response.text()
}

// ── Apartment transactions ──

export async function fetchApartmentTransactions(params: FetchTransactionsParams): Promise<MolitTransaction[]> {
  const xml = await fetchMolitApi('RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev', params)

  return extractItems(xml).map((itemXml) => ({
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
  }))
}

// ── Building transactions (상업/업무용 매매) ──

export async function fetchBuildingTransactions(params: FetchTransactionsParams): Promise<MolitBuildingTransaction[]> {
  const xml = await fetchMolitApi('RTMSDataSvcNrgTrade/getRTMSDataSvcNrgTrade', params)

  return extractItems(xml).map((itemXml) => ({
    dealAmount: extractTag(itemXml, '거래금액') || '',
    dealYear: extractTag(itemXml, '년') || '',
    dealMonth: extractTag(itemXml, '월') || '',
    dealDay: extractTag(itemXml, '일') || '',
    buildingUse: extractTag(itemXml, '건물주용도') || '',
    buildingArea: extractTag(itemXml, '건물면적') || '',
    landArea: extractTag(itemXml, '대지면적') || '',
    floor: extractTag(itemXml, '층') || '',
    dong: extractTag(itemXml, '법정동') || '',
    jibun: extractTag(itemXml, '지번') || '',
  }))
}

// ── House transactions (단독/다가구 매매) ──

export async function fetchHouseTransactions(params: FetchTransactionsParams): Promise<MolitHouseTransaction[]> {
  const xml = await fetchMolitApi('RTMSDataSvcSHTrade/getRTMSDataSvcSHTrade', params)

  return extractItems(xml).map((itemXml) => ({
    dealAmount: extractTag(itemXml, '거래금액') || '',
    dealYear: extractTag(itemXml, '년') || '',
    dealMonth: extractTag(itemXml, '월') || '',
    dealDay: extractTag(itemXml, '일') || '',
    houseType: extractTag(itemXml, '주택유형') || '',
    landArea: extractTag(itemXml, '대지면적') || '',
    totalFloorArea: extractTag(itemXml, '연면적') || '',
    buildYear: extractTag(itemXml, '건축년도') || '',
    dong: extractTag(itemXml, '법정동') || '',
    jibun: extractTag(itemXml, '지번') || '',
  }))
}

// ── Land transactions (토지 매매) ──

export async function fetchLandTransactions(params: FetchTransactionsParams): Promise<MolitLandTransaction[]> {
  const xml = await fetchMolitApi('RTMSDataSvcLandTrade/getRTMSDataSvcLandTrade', params)

  return extractItems(xml).map((itemXml) => ({
    dealAmount: extractTag(itemXml, '거래금액') || '',
    dealYear: extractTag(itemXml, '년') || '',
    dealMonth: extractTag(itemXml, '월') || '',
    dealDay: extractTag(itemXml, '일') || '',
    landUseArea: extractTag(itemXml, '용도지역') || '',
    landCategory: extractTag(itemXml, '지목') || '',
    dealArea: extractTag(itemXml, '거래면적') || '',
    dong: extractTag(itemXml, '법정동') || '',
    jibun: extractTag(itemXml, '지번') || '',
  }))
}

// ── Utilities ──

export function parseDealAmount(amount: string): number {
  return parseInt(amount.replace(/,/g, '').trim(), 10)
}
