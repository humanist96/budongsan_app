/**
 * 셀럽 배틀카드 데이터
 *
 * 포켓몬/탑트럼프 스타일 카드 대결
 * 6가지 스탯으로 셀럽 1:1 비교
 */

import {
  celebrities as seedCelebrities,
  celebrityProperties as seedCelebrityProperties,
  properties as seedProperties,
} from './celebrity-seed-data'
import type { SeedCelebrityProperty } from './celebrity-seed-data'
import type { CelebrityCategory } from '@/types'

// ─── Types ──────────────────────────────────────────────────

export type BattleTier = 'S' | 'A' | 'B' | 'C'

export interface BattleStat {
  key: string
  label: string
  emoji: string
  description: string
  format: (value: number) => string
}

export interface BattleCard {
  id: string
  name: string
  category: CelebrityCategory
  subCategory: string
  profileImageUrl: string | null
  tier: BattleTier
  stats: {
    totalAssetValue: number
    propertyCount: number
    maxPropertyValue: number
    avgReturnRate: number
    multiPropertyCount: number
    investmentDiversity: number
  }
}

export interface BattleResult {
  statKey: string
  cardAValue: number
  cardBValue: number
  winner: 'A' | 'B' | 'draw'
}

export interface DailyBattle {
  cardA: BattleCard
  cardB: BattleCard
  date: string
}

// ─── Stat Definitions ───────────────────────────────────────

function formatManWon(value: number): string {
  if (value >= 10000) {
    const eok = Math.floor(value / 10000)
    const remainder = value % 10000
    if (remainder === 0) return `${eok}억`
    return `${eok}억 ${remainder.toLocaleString()}만`
  }
  if (value === 0) return '0'
  return `${value.toLocaleString()}만`
}

export const BATTLE_STATS: readonly BattleStat[] = [
  {
    key: 'totalAssetValue',
    label: '총 자산가치',
    emoji: '💰',
    description: '보유 부동산 총 시세',
    format: (v) => formatManWon(v),
  },
  {
    key: 'propertyCount',
    label: '보유 건수',
    emoji: '🏠',
    description: '부동산 개수',
    format: (v) => `${v}건`,
  },
  {
    key: 'maxPropertyValue',
    label: '최고가 매물',
    emoji: '👑',
    description: '가장 비싼 단일 매물',
    format: (v) => formatManWon(v),
  },
  {
    key: 'avgReturnRate',
    label: '수익률',
    emoji: '📈',
    description: '평균 시세 상승률',
    format: (v) => `${v > 0 ? '+' : ''}${v.toFixed(0)}%`,
  },
  {
    key: 'multiPropertyCount',
    label: '다주택 수',
    emoji: '🔑',
    description: '2채 이상 보유 시',
    format: (v) => `${v}채`,
  },
  {
    key: 'investmentDiversity',
    label: '투자 다양성',
    emoji: '🎯',
    description: '보유 부동산 종류 수',
    format: (v) => `${v}종류`,
  },
] as const

// ─── Tier System ────────────────────────────────────────────

export const TIER_CONFIG: Record<BattleTier, { label: string; color: string; minAsset: number }> = {
  S: { label: 'S', color: 'from-yellow-400 to-amber-500', minAsset: 500000 },
  A: { label: 'A', color: 'from-purple-500 to-violet-600', minAsset: 100000 },
  B: { label: 'B', color: 'from-blue-500 to-cyan-600', minAsset: 20000 },
  C: { label: 'C', color: 'from-gray-400 to-gray-500', minAsset: 0 },
}

function computeTier(totalAssetManWon: number): BattleTier {
  if (totalAssetManWon >= 500000) return 'S'
  if (totalAssetManWon >= 100000) return 'A'
  if (totalAssetManWon >= 20000) return 'B'
  return 'C'
}

// ─── Card Builder ───────────────────────────────────────────

function getActiveProperties(celebrityId: string): SeedCelebrityProperty[] {
  return seedCelebrityProperties.filter(
    (cp) => cp.celebrityId === celebrityId && !cp.disposalDate
  )
}

function getPropertyType(propertyId: string): string {
  const prop = seedProperties.find((p) => p.id === propertyId)
  return prop?.propertyType ?? 'other'
}

export function buildBattleCard(celebrityId: string): BattleCard | null {
  const celeb = seedCelebrities.find((c) => c.id === celebrityId)
  if (!celeb) return null

  const activeProps = getActiveProperties(celebrityId)

  const totalAssetValue = activeProps.reduce((sum, cp) => {
    const value = cp.estimatedCurrentValue ?? cp.price ?? 0
    return sum + value
  }, 0)

  const propertyCount = activeProps.length

  const maxPropertyValue = activeProps.reduce((max, cp) => {
    const value = cp.estimatedCurrentValue ?? cp.price ?? 0
    return Math.max(max, value)
  }, 0)

  const returnsWithData = activeProps
    .filter((cp) => cp.price && cp.price > 0 && cp.estimatedCurrentValue && cp.estimatedCurrentValue > 0)
    .map((cp) => ((cp.estimatedCurrentValue! - cp.price!) / cp.price!) * 100)

  const avgReturnRate =
    returnsWithData.length > 0
      ? Math.round(returnsWithData.reduce((s, r) => s + r, 0) / returnsWithData.length)
      : 0

  const multiPropertyCount = Math.max(0, propertyCount - 1)

  const propertyTypes = new Set(activeProps.map((cp) => getPropertyType(cp.propertyId)))
  const investmentDiversity = propertyTypes.size

  return {
    id: celeb.id,
    name: celeb.name,
    category: celeb.category,
    subCategory: celeb.subCategory,
    profileImageUrl: celeb.profileImageUrl ?? null,
    tier: computeTier(totalAssetValue),
    stats: {
      totalAssetValue,
      propertyCount,
      maxPropertyValue,
      avgReturnRate,
      multiPropertyCount,
      investmentDiversity,
    },
  }
}

// ─── Battle Comparison ──────────────────────────────────────

export function compareBattle(cardA: BattleCard, cardB: BattleCard): BattleResult[] {
  return BATTLE_STATS.map((stat) => {
    const aVal = cardA.stats[stat.key as keyof BattleCard['stats']]
    const bVal = cardB.stats[stat.key as keyof BattleCard['stats']]

    let winner: 'A' | 'B' | 'draw' = 'draw'
    if (aVal > bVal) winner = 'A'
    else if (bVal > aVal) winner = 'B'

    return {
      statKey: stat.key,
      cardAValue: aVal,
      cardBValue: bVal,
      winner,
    }
  })
}

export function getOverallWinner(results: BattleResult[]): 'A' | 'B' | 'draw' {
  const aWins = results.filter((r) => r.winner === 'A').length
  const bWins = results.filter((r) => r.winner === 'B').length
  if (aWins > bWins) return 'A'
  if (bWins > aWins) return 'B'
  return 'draw'
}

// ─── Daily Battle ───────────────────────────────────────────

function dateToSeed(dateStr: string): number {
  const d = new Date(dateStr)
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
}

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return s / 2147483647
  }
}

export function getAllBattleCards(): BattleCard[] {
  return seedCelebrities
    .map((c) => buildBattleCard(c.id))
    .filter((card): card is BattleCard => card !== null && card.stats.propertyCount > 0)
}

export function getDailyBattle(dateStr?: string): DailyBattle {
  const today = dateStr ?? new Date().toISOString().slice(0, 10)
  const seed = dateToSeed(today)
  const random = seededRandom(seed)

  const cards = getAllBattleCards()
  const indexA = Math.floor(random() * cards.length)
  let indexB = Math.floor(random() * (cards.length - 1))
  if (indexB >= indexA) indexB += 1

  return {
    cardA: cards[indexA],
    cardB: cards[indexB],
    date: today,
  }
}
