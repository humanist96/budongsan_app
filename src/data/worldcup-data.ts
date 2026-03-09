import type { CelebrityCategory } from '@/types'
import type { PropertyType } from '@/types/property'
import { celebrities, properties, celebrityProperties } from './celebrity-seed-data'

// ─── Types ──────────────────────────────────────────────────

export interface WorldCupItem {
  propertyId: string
  propertyName: string
  address: string
  district: string
  propertyType: PropertyType
  price: number | null
  currentValue: number | null
  exclusiveArea: number | null
  buildingYear: number | null
  highlight: string | null
  celebrityId: string
  celebrityName: string
  celebrityCategory: CelebrityCategory
  profileImageUrl: string | null
}

export interface TasteProfile {
  preferredDistrict: string
  preferredType: string
  priceRange: 'budget' | 'mid' | 'premium' | 'ultra'
  style: { name: string; description: string; emoji: string }
  matchedCelebs: string[]
}

// ─── Style Types ────────────────────────────────────────────

const TASTE_STYLES = [
  {
    name: '강남 럭셔리 감성형',
    emoji: '🏙️',
    description: '강남의 프리미엄 아파트가 제 취향! 트렌디한 도심 속 고급 주거를 원하는 당신.',
    match: (items: WorldCupItem[]) => {
      const gangnam = items.filter((i) => ['강남구', '서초구'].includes(i.district))
      const apts = items.filter((i) => i.propertyType === 'apartment')
      return gangnam.length >= 2 && apts.length >= 3
    },
  },
  {
    name: '빌딩왕 사업가형',
    emoji: '🏢',
    description: '빌딩 수집이 취미! 임대수익과 시세차익 두 마리 토끼를 잡는 전략가.',
    match: (items: WorldCupItem[]) => {
      const buildings = items.filter((i) => i.propertyType === 'building')
      return buildings.length >= 4
    },
  },
  {
    name: '한남동 힙스터형',
    emoji: '🎨',
    description: '용산·마포의 감성 넘치는 동네를 사랑하는 당신. 트렌디하면서 여유로운 라이프.',
    match: (items: WorldCupItem[]) => {
      const hip = items.filter((i) => ['용산구', '마포구', '성동구'].includes(i.district))
      return hip.length >= 3
    },
  },
  {
    name: '실속파 가성비형',
    emoji: '💡',
    description: '합리적인 가격에 좋은 매물을 고르는 안목! 실속 있는 투자의 달인.',
    match: (items: WorldCupItem[]) => {
      const prices = items
        .map((i) => i.currentValue ?? i.price)
        .filter((p): p is number => p !== null)
      if (prices.length === 0) return false
      const avg = prices.reduce((a, b) => a + b, 0) / prices.length
      return avg < 1000000
    },
  },
  {
    name: '대지주 투자형',
    emoji: '📈',
    description: '토지와 대규모 자산을 선호하는 스케일 큰 투자자. 장기 보유의 왕!',
    match: (items: WorldCupItem[]) => {
      const land = items.filter((i) => i.propertyType === 'land')
      const prices = items
        .map((i) => i.currentValue ?? i.price)
        .filter((p): p is number => p !== null)
      const avg = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0
      return land.length >= 1 || avg >= 5000000
    },
  },
  {
    name: '트렌드세터형',
    emoji: '✨',
    description: '신축 프리미엄 매물만 고르는 당신! 최신 트렌드와 새 건물의 매력에 빠진 감각파.',
    match: (items: WorldCupItem[]) => {
      const newBuilds = items.filter((i) => i.buildingYear !== null && i.buildingYear >= 2018)
      const trendy = items.filter((i) =>
        i.address.includes('청담') || i.address.includes('성수'),
      )
      return newBuilds.length >= 3 || trendy.length >= 2
    },
  },
] as const

// ─── Helpers ────────────────────────────────────────────────

function extractDistrict(address: string): string {
  const match = address.match(/([가-힣]+[구군시])/)
  return match ? match[1] : '기타'
}

function shuffleArray<T>(arr: readonly T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]
    shuffled[i] = shuffled[j]
    shuffled[j] = temp
  }
  return shuffled
}

// ─── Core Functions ─────────────────────────────────────────

export function buildWorldCupItems(): WorldCupItem[] {
  const celebMap = new Map(celebrities.map((c) => [c.id, c]))
  const propMap = new Map(properties.map((p) => [p.id, p]))

  return celebrityProperties
    .filter((cp) => {
      const prop = propMap.get(cp.propertyId)
      const celeb = celebMap.get(cp.celebrityId)
      if (!prop || !celeb) return false
      const price = cp.estimatedCurrentValue ?? cp.price
      return price !== null && price > 0
    })
    .map((cp) => {
      const prop = propMap.get(cp.propertyId)!
      const celeb = celebMap.get(cp.celebrityId)!
      return {
        propertyId: cp.propertyId,
        propertyName: prop.name,
        address: prop.address,
        district: extractDistrict(prop.address),
        propertyType: prop.propertyType,
        price: cp.price,
        currentValue: cp.estimatedCurrentValue ?? null,
        exclusiveArea: prop.exclusiveArea,
        buildingYear: prop.buildingYear,
        highlight: cp.highlight ?? null,
        celebrityId: celeb.id,
        celebrityName: celeb.name,
        celebrityCategory: celeb.category,
        profileImageUrl: celeb.profileImageUrl ?? null,
      }
    })
}

export function pickWorldCupSet(items: WorldCupItem[], count = 16): WorldCupItem[] {
  if (items.length <= count) return shuffleArray(items)

  const selected: WorldCupItem[] = []
  const usedCelebs = new Set<string>()
  const usedDistricts = new Map<string, number>()

  const shuffled = shuffleArray(items)

  for (const item of shuffled) {
    if (selected.length >= count) break
    if (usedCelebs.has(item.celebrityId)) continue

    const distCount = usedDistricts.get(item.district) ?? 0
    if (distCount >= 3 && selected.length < count - 2) continue

    selected.push(item)
    usedCelebs.add(item.celebrityId)
    usedDistricts.set(item.district, distCount + 1)
  }

  if (selected.length < count) {
    for (const item of shuffled) {
      if (selected.length >= count) break
      if (selected.includes(item)) continue
      if (usedCelebs.has(item.celebrityId)) continue
      selected.push(item)
      usedCelebs.add(item.celebrityId)
    }
  }

  return shuffleArray(selected)
}

export function analyzeChoices(allChoices: WorldCupItem[]): TasteProfile {
  const districtCounts = new Map<string, number>()
  const typeCounts = new Map<string, number>()
  const prices: number[] = []

  for (const item of allChoices) {
    districtCounts.set(item.district, (districtCounts.get(item.district) ?? 0) + 1)
    typeCounts.set(item.propertyType, (typeCounts.get(item.propertyType) ?? 0) + 1)
    const p = item.currentValue ?? item.price
    if (p !== null) prices.push(p)
  }

  const preferredDistrict = [...districtCounts.entries()]
    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? '강남구'

  const preferredType = [...typeCounts.entries()]
    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'apartment'

  const avgPrice = prices.length > 0
    ? prices.reduce((a, b) => a + b, 0) / prices.length
    : 0

  const priceRange: TasteProfile['priceRange'] =
    avgPrice < 500000 ? 'budget' :
    avgPrice < 1500000 ? 'mid' :
    avgPrice < 5000000 ? 'premium' : 'ultra'

  const matchedStyle = TASTE_STYLES.find((s) => s.match(allChoices))
    ?? TASTE_STYLES[0]

  const allItems = buildWorldCupItems()
  const matchedCelebs = findMatchingCelebs(allChoices, allItems)

  return {
    preferredDistrict,
    preferredType,
    priceRange,
    style: {
      name: matchedStyle.name,
      description: matchedStyle.description,
      emoji: matchedStyle.emoji,
    },
    matchedCelebs,
  }
}

function findMatchingCelebs(choices: WorldCupItem[], allItems: WorldCupItem[]): string[] {
  const chosenDistricts = new Set(choices.map((c) => c.district))
  const chosenTypes = new Set(choices.map((c) => c.propertyType))
  const chosenCelebIds = new Set(choices.map((c) => c.celebrityId))

  const celebScores = new Map<string, { name: string; score: number }>()

  for (const item of allItems) {
    if (chosenCelebIds.has(item.celebrityId)) continue
    const existing = celebScores.get(item.celebrityId) ?? { name: item.celebrityName, score: 0 }
    if (chosenDistricts.has(item.district)) existing.score += 2
    if (chosenTypes.has(item.propertyType)) existing.score += 1
    celebScores.set(item.celebrityId, existing)
  }

  return [...celebScores.entries()]
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, 3)
    .filter(([, v]) => v.score > 0)
    .map(([, v]) => v.name)
}

// ─── Constants ──────────────────────────────────────────────

export const ROUND_LABELS: Record<number, string> = {
  16: '16강',
  8: '8강',
  4: '4강',
  2: '결승',
}

export const PRICE_RANGE_LABELS: Record<TasteProfile['priceRange'], string> = {
  budget: '가성비 중시',
  mid: '중상위 투자',
  premium: '프리미엄',
  ultra: '울트라 럭셔리',
}
