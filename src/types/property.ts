export type PropertyType = 'apartment' | 'house' | 'villa' | 'officetel' | 'building' | 'land' | 'other'

export interface Property {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  property_type: PropertyType
  exclusive_area: number | null
  floor_info: string | null
  building_year: number | null
  dong_code: string | null
  latest_transaction_price: number | null
  latest_transaction_date: string | null
  comment_count: number
  like_count: number
  checkin_count: number
  created_at: string
  updated_at: string
}

export interface PropertyWithCelebrities extends Property {
  celebrity_properties: {
    celebrity: import('./celebrity').Celebrity
    ownership_type: import('./celebrity').OwnershipType
    acquisition_date: string | null
    acquisition_price: number | null
    source_url: string | null
    verification_status: import('./celebrity').VerificationStatus
  }[]
}

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartment: '아파트',
  house: '단독주택',
  villa: '빌라',
  officetel: '오피스텔',
  building: '건물',
  land: '토지',
  other: '기타',
}
