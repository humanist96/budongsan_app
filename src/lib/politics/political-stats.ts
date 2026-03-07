import {
  celebrities,
  celebrityProperties,
  properties as seedProperties,
  type PoliticalLeaning,
  type SeedCelebrity,
} from '@/data/celebrity-seed-data'
import type { PropertyType } from '@/types/property'

export interface PoliticianRanking {
  id: string
  name: string
  party?: string
  totalAsset: number
  propertyCount: number
}

export interface PoliticalGroupStats {
  leaning: PoliticalLeaning
  count: number
  totalProperties: number
  totalAssetValue: number
  avgPrice: number
  medianPrice: number
  maxPrice: number
  avgPropertiesPerPerson: number
  propertyTypeDistribution: Record<string, number>
  topByAsset: PoliticianRanking[]
}

interface PoliticianWithProperties {
  celebrity: SeedCelebrity
  properties: { propertyId: string; price: number }[]
  totalAsset: number
}

function getPoliticianProperties(): PoliticianWithProperties[] {
  const politicians = celebrities.filter(
    (c) => c.category === 'politician' && c.politicalLeaning
  )

  return politicians.map((pol) => {
    const props = celebrityProperties
      .filter((cp) => cp.celebrityId === pol.id && cp.price !== null)
      .map((cp) => ({ propertyId: cp.propertyId, price: cp.price! }))

    return {
      celebrity: pol,
      properties: props,
      totalAsset: props.reduce((sum, p) => sum + p.price, 0),
    }
  })
}

function computeMedian(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : Math.round((sorted[mid - 1] + sorted[mid]) / 2)
}

const propTypeMap = new Map<string, PropertyType>(
  seedProperties.map((sp) => [sp.id, sp.propertyType])
)

function computeGroupStats(
  politicians: PoliticianWithProperties[],
  leaning: PoliticalLeaning
): PoliticalGroupStats {
  const group = politicians.filter((p) => p.celebrity.politicalLeaning === leaning)
  const allPrices = group.flatMap((p) => p.properties.map((pr) => pr.price))
  const totalProps = group.reduce((sum, p) => sum + p.properties.length, 0)

  const typeDistribution: Record<string, number> = {}
  for (const pol of group) {
    for (const prop of pol.properties) {
      const pType = propTypeMap.get(prop.propertyId) ?? 'other'
      typeDistribution[pType] = (typeDistribution[pType] ?? 0) + 1
    }
  }

  return {
    leaning,
    count: group.length,
    totalProperties: totalProps,
    totalAssetValue: allPrices.reduce((sum, p) => sum + p, 0),
    avgPrice: allPrices.length > 0
      ? Math.round(allPrices.reduce((s, p) => s + p, 0) / allPrices.length)
      : 0,
    medianPrice: computeMedian(allPrices),
    maxPrice: allPrices.length > 0 ? Math.max(...allPrices) : 0,
    avgPropertiesPerPerson: group.length > 0
      ? Math.round((totalProps / group.length) * 10) / 10
      : 0,
    propertyTypeDistribution: typeDistribution,
    topByAsset: [...group]
      .sort((a, b) => b.totalAsset - a.totalAsset)
      .slice(0, 5)
      .map((p) => ({
        id: p.celebrity.id,
        name: p.celebrity.name,
        party: p.celebrity.party,
        totalAsset: p.totalAsset,
        propertyCount: p.properties.length,
      })),
  }
}

export function computePoliticalStats(): {
  progressive: PoliticalGroupStats
  conservative: PoliticalGroupStats
} {
  const politicians = getPoliticianProperties()
  return {
    progressive: computeGroupStats(politicians, 'progressive'),
    conservative: computeGroupStats(politicians, 'conservative'),
  }
}

export type SortKey = 'name' | 'totalAsset' | 'propertyCount' | 'party'

export interface PoliticianListItem {
  id: string
  name: string
  party?: string
  leaning: PoliticalLeaning
  totalAsset: number
  propertyCount: number
  subCategory: string
}

export function getAllPoliticiansSorted(sortBy: SortKey = 'totalAsset'): PoliticianListItem[] {
  const politicians = getPoliticianProperties()

  const items: PoliticianListItem[] = politicians.map((p) => ({
    id: p.celebrity.id,
    name: p.celebrity.name,
    party: p.celebrity.party,
    leaning: p.celebrity.politicalLeaning!,
    totalAsset: p.totalAsset,
    propertyCount: p.properties.length,
    subCategory: p.celebrity.subCategory,
  }))

  const comparators: Record<SortKey, (a: PoliticianListItem, b: PoliticianListItem) => number> = {
    name: (a, b) => a.name.localeCompare(b.name, 'ko'),
    totalAsset: (a, b) => b.totalAsset - a.totalAsset,
    propertyCount: (a, b) => b.propertyCount - a.propertyCount,
    party: (a, b) => (a.party ?? '').localeCompare(b.party ?? '', 'ko'),
  }

  return [...items].sort(comparators[sortBy])
}
