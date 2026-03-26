/**
 * 공간 분석 유틸리티
 *
 * QGIS KDE/Buffer 알고리즘 개념을 클라이언트 사이드로 구현.
 * 시드 데이터 기반 히트맵 포인트, 구별 통계, 이웃 셀럽 분석 등.
 */

import type { CelebrityCategory } from '@/types'
import {
  celebrities,
  celebrityProperties,
  properties,
} from '@/data/celebrity-seed-data'
import { haversineDistance } from './haversine'

// ─── Types ──────────────────────────────────────────────────

export interface HeatmapPoint {
  lat: number
  lng: number
  intensity: number
}

export interface GuStats {
  gu: string
  celebrityCount: number
  propertyCount: number
  totalAssetValue: number
  avgAssetValue: number
  topCeleb: string
}

export interface NeighborRelation {
  sourceId: string
  sourceName: string
  sourceCategory: CelebrityCategory
  targetId: string
  targetName: string
  targetCategory: CelebrityCategory
  distanceMeters: number
  sourcePropertyName: string
  targetPropertyName: string
}

// ─── 1) Heatmap Points ─────────────────────────────────────

export function getHeatmapPoints(
  mode: 'density' | 'price' | 'growth',
  categoryFilter?: CelebrityCategory[],
): HeatmapPoint[] {
  const propMap = new Map(properties.map((p) => [p.id, p]))
  const celebMap = new Map(celebrities.map((c) => [c.id, c]))

  const filteredCPs = categoryFilter
    ? celebrityProperties.filter((cp) => {
        const celeb = celebMap.get(cp.celebrityId)
        return celeb && categoryFilter.includes(celeb.category)
      })
    : celebrityProperties

  if (mode === 'density') {
    const locationCount = new Map<string, { lat: number; lng: number; count: number }>()
    for (const cp of filteredCPs) {
      const prop = propMap.get(cp.propertyId)
      if (!prop) continue
      const key = `${prop.lat.toFixed(4)},${prop.lng.toFixed(4)}`
      const existing = locationCount.get(key)
      if (existing) {
        existing.count += 1
      } else {
        locationCount.set(key, { lat: prop.lat, lng: prop.lng, count: 1 })
      }
    }
    return Array.from(locationCount.values()).map((loc) => ({
      lat: loc.lat,
      lng: loc.lng,
      intensity: loc.count,
    }))
  }

  if (mode === 'price') {
    const locationPrice = new Map<string, { lat: number; lng: number; totalPrice: number; count: number }>()
    for (const cp of filteredCPs) {
      const prop = propMap.get(cp.propertyId)
      if (!prop || !cp.price) continue
      const key = `${prop.lat.toFixed(4)},${prop.lng.toFixed(4)}`
      const existing = locationPrice.get(key)
      if (existing) {
        existing.totalPrice += cp.price
        existing.count += 1
      } else {
        locationPrice.set(key, { lat: prop.lat, lng: prop.lng, totalPrice: cp.price, count: 1 })
      }
    }
    const maxPrice = Math.max(...Array.from(locationPrice.values()).map((v) => v.totalPrice / v.count), 1)
    return Array.from(locationPrice.values()).map((loc) => ({
      lat: loc.lat,
      lng: loc.lng,
      intensity: (loc.totalPrice / loc.count) / maxPrice,
    }))
  }

  // growth mode: 매입가 대비 현재 추정가 상승률
  const locationGrowth = new Map<string, { lat: number; lng: number; growthSum: number; count: number }>()
  for (const cp of filteredCPs) {
    const prop = propMap.get(cp.propertyId)
    if (!prop || !cp.price || !cp.estimatedCurrentValue) continue
    const growth = (cp.estimatedCurrentValue - cp.price) / cp.price
    const key = `${prop.lat.toFixed(4)},${prop.lng.toFixed(4)}`
    const existing = locationGrowth.get(key)
    if (existing) {
      existing.growthSum += growth
      existing.count += 1
    } else {
      locationGrowth.set(key, { lat: prop.lat, lng: prop.lng, growthSum: growth, count: 1 })
    }
  }
  const maxGrowth = Math.max(...Array.from(locationGrowth.values()).map((v) => v.growthSum / v.count), 0.01)
  return Array.from(locationGrowth.values()).map((loc) => ({
    lat: loc.lat,
    lng: loc.lng,
    intensity: Math.max(0, (loc.growthSum / loc.count) / maxGrowth),
  }))
}

// ─── 2) District (구) Statistics ────────────────────────────

function extractGu(address: string): string {
  const match = address.match(/([가-힣]+구)/)
  return match?.[1] ?? '기타'
}

export function getGuStats(): GuStats[] {
  const propMap = new Map(properties.map((p) => [p.id, p]))
  const celebMap = new Map(celebrities.map((c) => [c.id, c]))

  const guData = new Map<string, {
    celebIds: Set<string>
    propertyIds: Set<string>
    totalValue: number
    topCelebValue: Map<string, number>
  }>()

  for (const cp of celebrityProperties) {
    const prop = propMap.get(cp.propertyId)
    if (!prop) continue
    const gu = extractGu(prop.address)
    const existing = guData.get(gu) ?? {
      celebIds: new Set(),
      propertyIds: new Set(),
      totalValue: 0,
      topCelebValue: new Map(),
    }
    existing.celebIds.add(cp.celebrityId)
    existing.propertyIds.add(cp.propertyId)
    const price = cp.price ?? 0
    existing.totalValue += price
    existing.topCelebValue.set(
      cp.celebrityId,
      (existing.topCelebValue.get(cp.celebrityId) ?? 0) + price,
    )
    guData.set(gu, existing)
  }

  return Array.from(guData.entries())
    .map(([gu, data]) => {
      let topCelebId = ''
      let topValue = 0
      for (const [celebId, value] of data.topCelebValue) {
        if (value > topValue) {
          topValue = value
          topCelebId = celebId
        }
      }
      return {
        gu,
        celebrityCount: data.celebIds.size,
        propertyCount: data.propertyIds.size,
        totalAssetValue: data.totalValue,
        avgAssetValue: data.propertyIds.size > 0 ? Math.round(data.totalValue / data.propertyIds.size) : 0,
        topCeleb: celebMap.get(topCelebId)?.name ?? '',
      }
    })
    .sort((a, b) => b.celebrityCount - a.celebrityCount)
}

// ─── 3) Neighbor Analysis (Buffer 500m) ─────────────────────

export function findNeighborCelebrities(radiusMeters: number = 500): NeighborRelation[] {
  const propMap = new Map(properties.map((p) => [p.id, p]))
  const celebMap = new Map(celebrities.map((c) => [c.id, c]))

  // 각 셀럽의 매물 좌표 리스트 생성
  const celebProperties = new Map<string, { propertyId: string; lat: number; lng: number; propertyName: string }[]>()

  for (const cp of celebrityProperties) {
    const prop = propMap.get(cp.propertyId)
    if (!prop) continue
    const list = celebProperties.get(cp.celebrityId) ?? []
    // 중복 매물 방지
    if (!list.some((p) => p.propertyId === cp.propertyId)) {
      list.push({ propertyId: cp.propertyId, lat: prop.lat, lng: prop.lng, propertyName: prop.name })
    }
    celebProperties.set(cp.celebrityId, list)
  }

  const relations: NeighborRelation[] = []
  const pairSet = new Set<string>()
  const celebIds = Array.from(celebProperties.keys())

  for (let i = 0; i < celebIds.length; i++) {
    const celebA = celebIds[i]
    const propsA = celebProperties.get(celebA)!

    for (let j = i + 1; j < celebIds.length; j++) {
      const celebB = celebIds[j]
      const propsB = celebProperties.get(celebB)!

      let minDist = Infinity
      let bestPropA = propsA[0]
      let bestPropB = propsB[0]

      for (const pA of propsA) {
        for (const pB of propsB) {
          // 같은 매물이면 스킵 (이미 기존 관계망에서 처리)
          if (pA.propertyId === pB.propertyId) continue
          const dist = haversineDistance(pA.lat, pA.lng, pB.lat, pB.lng)
          if (dist < minDist) {
            minDist = dist
            bestPropA = pA
            bestPropB = pB
          }
        }
      }

      if (minDist <= radiusMeters && minDist > 0) {
        const key = [celebA, celebB].sort().join('|')
        if (pairSet.has(key)) continue
        pairSet.add(key)

        const cA = celebMap.get(celebA)
        const cB = celebMap.get(celebB)
        if (!cA || !cB) continue

        relations.push({
          sourceId: celebA,
          sourceName: cA.name,
          sourceCategory: cA.category,
          targetId: celebB,
          targetName: cB.name,
          targetCategory: cB.category,
          distanceMeters: Math.round(minDist),
          sourcePropertyName: bestPropA.propertyName,
          targetPropertyName: bestPropB.propertyName,
        })
      }
    }
  }

  return relations.sort((a, b) => a.distanceMeters - b.distanceMeters)
}

// ─── 4) Catchment Area (Isochrone approximation) ────────────

export interface CatchmentPoint {
  lat: number
  lng: number
  radiusMeters: number
}

export interface CatchmentCelebrity {
  id: string
  name: string
  category: CelebrityCategory
  propertyName: string
  distanceMeters: number
  profileImageUrl: string | null
}

export function getCelebritiesInCatchment(
  centerLat: number,
  centerLng: number,
  radiusMeters: number,
): CatchmentCelebrity[] {
  const propMap = new Map(properties.map((p) => [p.id, p]))
  const celebMap = new Map(celebrities.map((c) => [c.id, c]))

  const results: CatchmentCelebrity[] = []
  const seen = new Set<string>()

  for (const cp of celebrityProperties) {
    if (seen.has(cp.celebrityId)) continue
    const prop = propMap.get(cp.propertyId)
    if (!prop) continue

    const dist = haversineDistance(centerLat, centerLng, prop.lat, prop.lng)
    if (dist <= radiusMeters) {
      const celeb = celebMap.get(cp.celebrityId)
      if (!celeb) continue
      seen.add(cp.celebrityId)
      results.push({
        id: celeb.id,
        name: celeb.name,
        category: celeb.category,
        propertyName: prop.name,
        distanceMeters: Math.round(dist),
        profileImageUrl: celeb.profileImageUrl ?? null,
      })
    }
  }

  return results.sort((a, b) => a.distanceMeters - b.distanceMeters)
}

// ─── 5) Property Coordinates for Catchment ──────────────────

export interface PropertyLocation {
  id: string
  name: string
  lat: number
  lng: number
  address: string
  celebrityNames: string[]
}

export function getAllPropertyLocations(): PropertyLocation[] {
  const celebMap = new Map(celebrities.map((c) => [c.id, c]))
  const propCelebs = new Map<string, string[]>()

  for (const cp of celebrityProperties) {
    const celeb = celebMap.get(cp.celebrityId)
    if (!celeb) continue
    const list = propCelebs.get(cp.propertyId) ?? []
    if (!list.includes(celeb.name)) list.push(celeb.name)
    propCelebs.set(cp.propertyId, list)
  }

  return properties.map((p) => ({
    id: p.id,
    name: p.name,
    lat: p.lat,
    lng: p.lng,
    address: p.address,
    celebrityNames: propCelebs.get(p.id) ?? [],
  }))
}
