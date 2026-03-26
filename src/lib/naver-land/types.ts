export type NaverTradeType = '매매' | '전세' | '월세' | '단기임대'

export interface NaverLandListing {
  articleNo: string
  complexName: string
  tradeType: NaverTradeType | string
  propertyType: string
  exclusiveArea: number
  supplyArea: number
  pyeong: number
  sizeType: string
  price: number          // 만원 (파싱 후)
  priceText: string      // 원본 텍스트
  rentPrice: number | null
  floorInfo: string
  confirmDate: string
  tags: string[]
}

export interface NaverSearchParams {
  district: string
  tradeType?: string
  nameContains?: string
  minArea?: number
  maxArea?: number
  limit?: number
}

export interface NaverSearchResult {
  listings: NaverLandListing[]
  meta: {
    total: number
    fetchedAt: string
    cached: boolean
    district: string
  }
}

export interface PriceComparison {
  acquisitionPrice: number | null
  currentMinPrice: number | null
  currentMaxPrice: number | null
  currentMedianPrice: number | null
  listingCount: number
  returnRateMin: number | null
  returnRateMax: number | null
}
