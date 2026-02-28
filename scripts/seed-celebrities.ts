import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface SeedCelebrity {
  name: string
  category: 'entertainer' | 'politician' | 'athlete'
  sub_category: string
  description: string
  is_verified: boolean
  properties: {
    name: string
    address: string
    latitude: number
    longitude: number
    property_type: string
    exclusive_area?: number
    floor_info?: string
    building_year?: number
    acquisition_price?: number
    acquisition_date?: string
    source_url?: string
    verification_status: 'verified' | 'reported' | 'unverified'
  }[]
}

const seedData: SeedCelebrity[] = [
  // === 정치인 ===
  {
    name: '이재명',
    category: 'politician',
    sub_category: '대통령 후보',
    description: '더불어민주당 대표, 전 경기도지사',
    is_verified: true,
    properties: [
      {
        name: '양평 단독주택',
        address: '경기도 양평군 양평읍',
        latitude: 37.4914,
        longitude: 127.4875,
        property_type: 'house',
        verification_status: 'verified',
      },
    ],
  },
  {
    name: '정치인A',
    category: 'politician',
    sub_category: '국회의원',
    description: '제22대 국회의원 (서울)',
    is_verified: true,
    properties: [
      {
        name: '반포자이',
        address: '서울 서초구 반포동 18-1',
        latitude: 37.5055,
        longitude: 126.987,
        property_type: 'apartment',
        exclusive_area: 196.5,
        floor_info: '20층',
        building_year: 2009,
        acquisition_price: 350000,
        acquisition_date: '2018-06-15',
        verification_status: 'verified',
      },
      {
        name: '아크로리버파크',
        address: '서울 서초구 반포동 1-1',
        latitude: 37.5085,
        longitude: 126.9959,
        property_type: 'apartment',
        exclusive_area: 180.0,
        floor_info: '35층',
        building_year: 2016,
        acquisition_price: 420000,
        acquisition_date: '2020-03-20',
        verification_status: 'verified',
      },
      {
        name: '한남더힐',
        address: '서울 용산구 한남동 810',
        latitude: 37.534,
        longitude: 127.0026,
        property_type: 'apartment',
        exclusive_area: 244.8,
        floor_info: '15층',
        building_year: 2011,
        acquisition_price: 500000,
        acquisition_date: '2021-11-01',
        verification_status: 'verified',
      },
    ],
  },
  {
    name: '정치인B',
    category: 'politician',
    sub_category: '국회의원',
    description: '제22대 국회의원 (경기)',
    is_verified: true,
    properties: [
      {
        name: '래미안퍼스티지',
        address: '서울 서초구 반포동',
        latitude: 37.505,
        longitude: 126.991,
        property_type: 'apartment',
        exclusive_area: 135.5,
        floor_info: '18층',
        building_year: 2009,
        acquisition_price: 280000,
        verification_status: 'verified',
      },
      {
        name: '잠실엘스',
        address: '서울 송파구 잠실동 40',
        latitude: 37.513,
        longitude: 127.085,
        property_type: 'apartment',
        exclusive_area: 119.9,
        floor_info: '12층',
        building_year: 2008,
        acquisition_price: 260000,
        verification_status: 'verified',
      },
    ],
  },
  {
    name: '정치인C',
    category: 'politician',
    sub_category: '국회의원',
    description: '제22대 국회의원 재선',
    is_verified: true,
    properties: [
      {
        name: '래미안대치팰리스',
        address: '서울 강남구 대치동 316',
        latitude: 37.494,
        longitude: 127.063,
        property_type: 'apartment',
        exclusive_area: 164.5,
        floor_info: '25층',
        building_year: 2015,
        acquisition_price: 420000,
        verification_status: 'verified',
      },
      {
        name: '갤러리아포레',
        address: '서울 성동구 성수동 656',
        latitude: 37.5445,
        longitude: 127.0567,
        property_type: 'apartment',
        exclusive_area: 212.0,
        floor_info: '30층',
        building_year: 2015,
        acquisition_price: 380000,
        verification_status: 'verified',
      },
      {
        name: '헬리오시티',
        address: '서울 송파구 가락동 160',
        latitude: 37.496,
        longitude: 127.107,
        property_type: 'apartment',
        exclusive_area: 100.8,
        building_year: 2018,
        acquisition_price: 190000,
        verification_status: 'verified',
      },
      {
        name: '제주 리조트 빌라',
        address: '제주 서귀포시 중문동',
        latitude: 33.2479,
        longitude: 126.4119,
        property_type: 'villa',
        acquisition_price: 120000,
        verification_status: 'verified',
      },
    ],
  },

  // === 연예인 ===
  {
    name: '연예인A',
    category: 'entertainer',
    sub_category: '배우',
    description: '한류 톱스타, 글로벌 인기 배우',
    is_verified: false,
    properties: [
      {
        name: 'PH129',
        address: '서울 강남구 청담동',
        latitude: 37.5247,
        longitude: 127.047,
        property_type: 'apartment',
        exclusive_area: 297.0,
        building_year: 2019,
        acquisition_price: 600000,
        verification_status: 'reported',
        source_url: 'https://example.com/news/1',
      },
    ],
  },
  {
    name: '연예인B',
    category: 'entertainer',
    sub_category: '가수',
    description: 'K-POP 그룹 멤버',
    is_verified: false,
    properties: [
      {
        name: '나인원한남',
        address: '서울 용산구 한남동 747',
        latitude: 37.5365,
        longitude: 127.001,
        property_type: 'apartment',
        exclusive_area: 273.0,
        building_year: 2021,
        acquisition_price: 650000,
        verification_status: 'reported',
        source_url: 'https://example.com/news/2',
      },
      {
        name: '트라움하우스5차',
        address: '서울 강남구 논현동',
        latitude: 37.5172,
        longitude: 127.0286,
        property_type: 'apartment',
        exclusive_area: 188.0,
        building_year: 2010,
        acquisition_price: 200000,
        verification_status: 'reported',
      },
    ],
  },
  {
    name: '연예인C',
    category: 'entertainer',
    sub_category: '배우',
    description: '드라마, 영화 주연 배우',
    is_verified: false,
    properties: [
      {
        name: '한남더힐',
        address: '서울 용산구 한남동 810',
        latitude: 37.534,
        longitude: 127.0026,
        property_type: 'apartment',
        exclusive_area: 244.8,
        building_year: 2011,
        acquisition_price: 350000,
        verification_status: 'reported',
      },
    ],
  },
  {
    name: '연예인D',
    category: 'entertainer',
    sub_category: 'MC',
    description: '인기 예능 MC',
    is_verified: false,
    properties: [
      {
        name: '이터널저니',
        address: '서울 강남구 청담동',
        latitude: 37.5235,
        longitude: 127.0482,
        property_type: 'apartment',
        exclusive_area: 203.0,
        building_year: 2021,
        acquisition_price: 450000,
        verification_status: 'reported',
      },
      {
        name: '연예인D 제주 별장',
        address: '제주 제주시 애월읍',
        latitude: 33.4628,
        longitude: 126.3299,
        property_type: 'house',
        acquisition_price: 150000,
        verification_status: 'reported',
      },
    ],
  },
  {
    name: '연예인E',
    category: 'entertainer',
    sub_category: '가수',
    description: '솔로 아티스트, 글로벌 인기',
    is_verified: false,
    properties: [
      {
        name: '한남더힐',
        address: '서울 용산구 한남동 810',
        latitude: 37.535,
        longitude: 127.003,
        property_type: 'apartment',
        exclusive_area: 244.8,
        building_year: 2011,
        acquisition_price: 400000,
        verification_status: 'reported',
      },
    ],
  },

  // === 운동선수 ===
  {
    name: '운동선수A',
    category: 'athlete',
    sub_category: '축구선수',
    description: 'K리그 출신 유럽파 선수',
    is_verified: false,
    properties: [
      {
        name: '타워팰리스',
        address: '서울 강남구 도곡동 467',
        latitude: 37.492,
        longitude: 127.0555,
        property_type: 'apartment',
        exclusive_area: 223.4,
        building_year: 2002,
        acquisition_price: 250000,
        verification_status: 'reported',
      },
    ],
  },
  {
    name: '운동선수B',
    category: 'athlete',
    sub_category: '야구선수',
    description: 'KBO 레전드 타자',
    is_verified: false,
    properties: [
      {
        name: '래미안리더스원',
        address: '서울 서초구 서초동',
        latitude: 37.497,
        longitude: 127.023,
        property_type: 'apartment',
        exclusive_area: 165.0,
        building_year: 2021,
        acquisition_price: 350000,
        verification_status: 'reported',
      },
      {
        name: '압구정 현대아파트',
        address: '서울 강남구 압구정동 408',
        latitude: 37.529,
        longitude: 127.029,
        property_type: 'apartment',
        exclusive_area: 146.0,
        building_year: 1982,
        acquisition_price: 280000,
        verification_status: 'reported',
      },
    ],
  },
  {
    name: '운동선수C',
    category: 'athlete',
    sub_category: '골프선수',
    description: 'LPGA 투어 우승 선수',
    is_verified: false,
    properties: [
      {
        name: '도곡렉슬',
        address: '서울 강남구 도곡동',
        latitude: 37.49,
        longitude: 127.056,
        property_type: 'apartment',
        exclusive_area: 176.5,
        building_year: 2003,
        acquisition_price: 280000,
        verification_status: 'reported',
      },
    ],
  },
]

async function seed() {
  for (const celeb of seedData) {
    // Insert celebrity
    const { data: celebrity, error: celebError } = await supabase
      .from('celebrities')
      .insert({
        name: celeb.name,
        category: celeb.category,
        sub_category: celeb.sub_category,
        description: celeb.description,
        is_verified: celeb.is_verified,
      })
      .select()
      .single()

    if (celebError) {
      console.error(`Failed to insert ${celeb.name}:`, celebError.message)
      continue
    }

    for (const prop of celeb.properties) {
      // Insert or find property
      const { data: existingProp } = await supabase
        .from('properties')
        .select('id')
        .eq('name', prop.name)
        .eq('address', prop.address)
        .single()

      let propertyId: string

      if (existingProp) {
        propertyId = existingProp.id
      } else {
        const { data: newProp, error: propError } = await supabase
          .from('properties')
          .insert({
            name: prop.name,
            address: prop.address,
            latitude: prop.latitude,
            longitude: prop.longitude,
            property_type: prop.property_type,
            exclusive_area: prop.exclusive_area,
            floor_info: prop.floor_info,
            building_year: prop.building_year,
            latest_transaction_price: prop.acquisition_price,
          })
          .select()
          .single()

        if (propError) {
          console.error(`Failed to insert property ${prop.name}:`, propError.message)
          continue
        }
        propertyId = newProp.id
      }

      // Link celebrity to property
      const { error: linkError } = await supabase
        .from('celebrity_properties')
        .insert({
          celebrity_id: celebrity.id,
          property_id: propertyId,
          ownership_type: 'owner',
          acquisition_date: prop.acquisition_date,
          acquisition_price: prop.acquisition_price,
          source_url: prop.source_url,
          verification_status: prop.verification_status,
        })

      if (linkError) {
        console.error(`Failed to link ${celeb.name} -> ${prop.name}:`, linkError.message)
      }
    }

    console.log(`Seeded: ${celeb.name} (${celeb.properties.length} properties)`)
  }

  console.log('Seed complete!')
}

seed().catch(console.error)
