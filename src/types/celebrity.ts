export type CelebrityCategory = 'entertainer' | 'politician' | 'athlete'

export type OwnershipType = 'owner' | 'tenant' | 'former_owner'

export type VerificationStatus = 'verified' | 'reported' | 'unverified'

export interface Celebrity {
  id: string
  name: string
  category: CelebrityCategory
  sub_category: string | null
  profile_image_url: string | null
  description: string | null
  property_count: number
  total_asset_value: number
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface CelebrityProperty {
  id: string
  celebrity_id: string
  property_id: string
  ownership_type: OwnershipType
  acquisition_date: string | null
  acquisition_price: number | null
  source_url: string | null
  verification_status: VerificationStatus
  created_at: string
}

export interface CelebrityWithProperties extends Celebrity {
  celebrity_properties: (CelebrityProperty & {
    property: import('./property').Property
  })[]
}

export const CATEGORY_LABELS: Record<CelebrityCategory, string> = {
  entertainer: '연예인',
  politician: '정치인',
  athlete: '운동선수',
}

export const CATEGORY_COLORS: Record<CelebrityCategory, string> = {
  entertainer: 'bg-pink-500',
  politician: 'bg-blue-500',
  athlete: 'bg-green-500',
}
