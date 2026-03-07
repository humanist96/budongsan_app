/**
 * 그래프 데이터 빌더
 *
 * 시드 데이터에서 3종 그래프(Bipartite, CelebNetwork, NeighborhoodCluster)를 생성한다.
 * 노드 ~367개, 엣지 ~187개 수준이므로 클라이언트 실시간 계산이 충분하다.
 */

import type { CelebrityCategory } from '@/types'
import {
  celebrities,
  celebrityProperties,
  properties,
  type PoliticalLeaning,
} from '@/data/celebrity-seed-data'

// ─── Types ──────────────────────────────────────────────────

export interface GraphNode {
  id: string
  name: string
  type: 'celebrity' | 'property'
  category?: CelebrityCategory
  subCategory?: string
  politicalLeaning?: PoliticalLeaning
  party?: string
  propertyType?: string
  group: number
  val: number
}

export interface GraphLink {
  source: string
  target: string
  label?: string
}

export interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}

export interface CelebConnection {
  source: string
  target: string
  sharedProperties: string[]
  weight: number
}

export interface PathResult {
  found: boolean
  path: GraphNode[]
  steps: number
}

// ─── Helpers ────────────────────────────────────────────────

const CATEGORY_GROUP: Record<CelebrityCategory, number> = {
  entertainer: 1,
  politician: 2,
  athlete: 3,
  expert: 4,
}

/** 주소에서 동 단위 추출 (서울 용산구 한남동 → 한남동) */
function extractDong(address: string): string {
  const match = address.match(/([가-힣]+[동면읍리])/)
  return match?.[1] ?? address
}

/** 주소에서 구 단위 추출 */
function extractGu(address: string): string {
  const match = address.match(/([가-힣]+[구])/)
  return match?.[1] ?? ''
}

// ─── 1) Bipartite Graph ─────────────────────────────────────

const celebPropertyCount = new Map<string, number>()
const propResidentCount = new Map<string, number>()

for (const cp of celebrityProperties) {
  celebPropertyCount.set(cp.celebrityId, (celebPropertyCount.get(cp.celebrityId) ?? 0) + 1)
  propResidentCount.set(cp.propertyId, (propResidentCount.get(cp.propertyId) ?? 0) + 1)
}

/** 카테고리 + 정치 성향 필터를 적용하여 셀럽 목록 반환 */
function filterCelebrities(
  categoryFilter?: CelebrityCategory[],
  politicalFilter?: PoliticalLeaning[],
) {
  let filtered = categoryFilter
    ? celebrities.filter((c) => categoryFilter.includes(c.category))
    : celebrities

  if (politicalFilter && politicalFilter.length > 0) {
    filtered = filtered.filter((c) => {
      if (c.category !== 'politician') return true
      return c.politicalLeaning ? politicalFilter.includes(c.politicalLeaning) : true
    })
  }

  return filtered
}

export function buildBipartiteGraph(
  categoryFilter?: CelebrityCategory[],
  politicalFilter?: PoliticalLeaning[],
): GraphData {
  const filteredCelebs = filterCelebrities(categoryFilter, politicalFilter)
  const filteredCelebIds = new Set(filteredCelebs.map((c) => c.id))

  const activeLinks = celebrityProperties.filter((cp) => filteredCelebIds.has(cp.celebrityId))
  const activePropIds = new Set(activeLinks.map((cp) => cp.propertyId))

  const celebNodes: GraphNode[] = filteredCelebs.map((c) => ({
    id: c.id,
    name: c.name,
    type: 'celebrity' as const,
    category: c.category,
    subCategory: c.subCategory,
    politicalLeaning: c.politicalLeaning,
    party: c.party,
    group: CATEGORY_GROUP[c.category],
    val: (celebPropertyCount.get(c.id) ?? 1) * 2,
  }))

  const propNodes: GraphNode[] = properties
    .filter((p) => activePropIds.has(p.id))
    .map((p) => ({
      id: p.id,
      name: p.name,
      type: 'property' as const,
      propertyType: p.propertyType,
      group: 10 + (dongGroupMap.get(extractDong(p.address)) ?? 0),
      val: (propResidentCount.get(p.id) ?? 1),
    }))

  const links: GraphLink[] = activeLinks.map((cp) => ({
    source: cp.celebrityId,
    target: cp.propertyId,
    label: cp.disposalDate ? '처분' : '소유',
  }))

  return { nodes: [...celebNodes, ...propNodes], links }
}

// ─── 2) Celeb-only Network ──────────────────────────────────

export function buildCelebNetwork(
  categoryFilter?: CelebrityCategory[],
  politicalFilter?: PoliticalLeaning[],
): GraphData {
  const connections = computeCelebConnections(categoryFilter, politicalFilter)
  const connectedCelebIds = new Set<string>()

  for (const conn of connections) {
    connectedCelebIds.add(conn.source)
    connectedCelebIds.add(conn.target)
  }

  const filteredCelebs = filterCelebrities(categoryFilter, politicalFilter)

  const nodes: GraphNode[] = filteredCelebs.map((c) => ({
    id: c.id,
    name: c.name,
    type: 'celebrity' as const,
    category: c.category,
    subCategory: c.subCategory,
    politicalLeaning: c.politicalLeaning,
    party: c.party,
    group: CATEGORY_GROUP[c.category],
    val: connectedCelebIds.has(c.id) ? (celebPropertyCount.get(c.id) ?? 1) * 3 : 2,
  }))

  const links: GraphLink[] = connections.map((conn) => ({
    source: conn.source,
    target: conn.target,
    label: `${conn.weight}개 공유`,
  }))

  return { nodes, links }
}

function computeCelebConnections(
  categoryFilter?: CelebrityCategory[],
  politicalFilter?: PoliticalLeaning[],
): CelebConnection[] {
  // property → [셀럽 IDs]
  const propToCelebs = new Map<string, string[]>()
  const filtered = filterCelebrities(categoryFilter, politicalFilter)
  const filteredCelebIds = new Set(filtered.map((c) => c.id))

  for (const cp of celebrityProperties) {
    if (!filteredCelebIds.has(cp.celebrityId)) continue
    const arr = propToCelebs.get(cp.propertyId) ?? []
    if (!arr.includes(cp.celebrityId)) {
      arr.push(cp.celebrityId)
    }
    propToCelebs.set(cp.propertyId, arr)
  }

  // 같은 매물을 공유하는 셀럽 쌍 찾기
  const pairMap = new Map<string, CelebConnection>()

  for (const [propId, celebIds] of propToCelebs) {
    if (celebIds.length < 2) continue

    for (let i = 0; i < celebIds.length; i++) {
      for (let j = i + 1; j < celebIds.length; j++) {
        const key = [celebIds[i], celebIds[j]].sort().join('|')
        const existing = pairMap.get(key)
        if (existing) {
          existing.sharedProperties.push(propId)
          existing.weight = existing.sharedProperties.length
        } else {
          pairMap.set(key, {
            source: celebIds[i],
            target: celebIds[j],
            sharedProperties: [propId],
            weight: 1,
          })
        }
      }
    }
  }

  return Array.from(pairMap.values())
}

// ─── 3) Neighborhood Clusters ───────────────────────────────

// 동 → 그룹 ID 매핑
const dongGroupMap = new Map<string, number>()
let nextGroupId = 0

for (const prop of properties) {
  const dong = extractDong(prop.address)
  if (!dongGroupMap.has(dong)) {
    dongGroupMap.set(dong, nextGroupId++)
  }
}

export function buildNeighborhoodClusters(
  categoryFilter?: CelebrityCategory[],
  politicalFilter?: PoliticalLeaning[],
): GraphData {
  const propMap = new Map(properties.map((p) => [p.id, p]))

  const filtered = filterCelebrities(categoryFilter, politicalFilter)
  const filteredCelebIds = new Set(filtered.map((c) => c.id))

  // 셀럽 → 동 목록
  const celebDongs = new Map<string, Set<string>>()
  for (const cp of celebrityProperties) {
    if (!filteredCelebIds.has(cp.celebrityId)) continue
    const prop = propMap.get(cp.propertyId)
    if (!prop) continue
    const dong = extractDong(prop.address)
    const set = celebDongs.get(cp.celebrityId) ?? new Set()
    set.add(dong)
    celebDongs.set(cp.celebrityId, set)
  }

  // 같은 동에 매물을 보유한 셀럽끼리 연결
  const dongToCelebs = new Map<string, Set<string>>()
  for (const [celebId, dongs] of celebDongs) {
    for (const dong of dongs) {
      const set = dongToCelebs.get(dong) ?? new Set()
      set.add(celebId)
      dongToCelebs.set(dong, set)
    }
  }

  const pairSet = new Set<string>()
  const links: GraphLink[] = []

  for (const [dong, celebIds] of dongToCelebs) {
    const arr = Array.from(celebIds)
    if (arr.length < 2) continue
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        const key = [arr[i], arr[j]].sort().join('|')
        if (pairSet.has(key)) continue
        pairSet.add(key)
        links.push({
          source: arr[i],
          target: arr[j],
          label: dong,
        })
      }
    }
  }

  const activeCelebIds = new Set<string>()
  for (const celebIds of dongToCelebs.values()) {
    for (const id of celebIds) activeCelebIds.add(id)
  }

  const allCelebs = filterCelebrities(categoryFilter, politicalFilter)

  const nodes: GraphNode[] = allCelebs.map((c) => {
    const dongs = celebDongs.get(c.id)
    const primaryDong = dongs ? Array.from(dongs)[0] : ''
    return {
      id: c.id,
      name: c.name,
      type: 'celebrity' as const,
      category: c.category,
      subCategory: c.subCategory,
      politicalLeaning: c.politicalLeaning,
      party: c.party,
      group: dongGroupMap.get(primaryDong) ?? 99,
      val: activeCelebIds.has(c.id) ? (celebPropertyCount.get(c.id) ?? 1) * 3 : 2,
    }
  })

  return { nodes, links }
}

// ─── 4) Path Finding (BFS) ──────────────────────────────────

export function findPath(fromCelebId: string, toCelebId: string): PathResult {
  const graph = buildBipartiteGraph()
  const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]))

  // adjacency list
  const adj = new Map<string, string[]>()
  for (const link of graph.links) {
    const s = typeof link.source === 'string' ? link.source : (link.source as unknown as GraphNode).id
    const t = typeof link.target === 'string' ? link.target : (link.target as unknown as GraphNode).id
    adj.set(s, [...(adj.get(s) ?? []), t])
    adj.set(t, [...(adj.get(t) ?? []), s])
  }

  // BFS
  const visited = new Set<string>([fromCelebId])
  const parent = new Map<string, string>()
  const queue: string[] = [fromCelebId]

  while (queue.length > 0) {
    const current = queue.shift()!
    if (current === toCelebId) {
      // reconstruct path
      const path: GraphNode[] = []
      let node: string | undefined = toCelebId
      while (node !== undefined) {
        const graphNode = nodeMap.get(node)
        if (graphNode) path.unshift(graphNode)
        node = parent.get(node)
      }
      // steps = celeb-to-celeb hops (매물 경유 제외)
      const celebSteps = path.filter((n) => n.type === 'celebrity').length - 1
      return { found: true, path, steps: celebSteps }
    }

    for (const neighbor of adj.get(current) ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        parent.set(neighbor, current)
        queue.push(neighbor)
      }
    }
  }

  return { found: false, path: [], steps: -1 }
}

// ─── 5) Statistics ──────────────────────────────────────────

export interface GraphStats {
  totalCelebs: number
  totalProperties: number
  totalLinks: number
  topConnectedCelebs: { name: string; connections: number }[]
  topPopularProperties: { name: string; residents: number }[]
  avgSeparation: number
  largestComponent: number
}

export function computeGraphStats(): GraphStats {
  const connections = computeCelebConnections()
  const connectionCount = new Map<string, number>()
  for (const conn of connections) {
    connectionCount.set(conn.source, (connectionCount.get(conn.source) ?? 0) + 1)
    connectionCount.set(conn.target, (connectionCount.get(conn.target) ?? 0) + 1)
  }

  const celebMap = new Map(celebrities.map((c) => [c.id, c]))
  const propMap = new Map(properties.map((p) => [p.id, p]))

  const topConnected = Array.from(connectionCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => ({
      name: celebMap.get(id)?.name ?? id,
      connections: count,
    }))

  const topProperties = Array.from(propResidentCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => ({
      name: propMap.get(id)?.name ?? id,
      residents: count,
    }))

  // 평균 분리도: 연결된 셀럽 쌍 중 샘플링
  const celebIds = celebrities.map((c) => c.id)
  let totalSteps = 0
  let pairCount = 0
  const sampleSize = Math.min(celebIds.length, 30)
  for (let i = 0; i < sampleSize; i++) {
    for (let j = i + 1; j < sampleSize; j++) {
      const result = findPath(celebIds[i], celebIds[j])
      if (result.found) {
        totalSteps += result.steps
        pairCount++
      }
    }
  }

  // 최대 연결 컴포넌트 크기 (BFS on celeb network)
  const visited = new Set<string>()
  const adj = new Map<string, Set<string>>()
  for (const conn of connections) {
    const s = adj.get(conn.source) ?? new Set()
    s.add(conn.target)
    adj.set(conn.source, s)
    const t = adj.get(conn.target) ?? new Set()
    t.add(conn.source)
    adj.set(conn.target, t)
  }

  let largestComponent = 0
  for (const celebId of celebIds) {
    if (visited.has(celebId)) continue
    let size = 0
    const queue = [celebId]
    visited.add(celebId)
    while (queue.length > 0) {
      const current = queue.shift()!
      size++
      for (const neighbor of adj.get(current) ?? []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          queue.push(neighbor)
        }
      }
    }
    if (size > largestComponent) largestComponent = size
  }

  return {
    totalCelebs: celebrities.length,
    totalProperties: properties.length,
    totalLinks: celebrityProperties.length,
    topConnectedCelebs: topConnected,
    topPopularProperties: topProperties,
    avgSeparation: pairCount > 0 ? Math.round((totalSteps / pairCount) * 10) / 10 : 0,
    largestComponent,
  }
}

// ─── 6) Export Helpers ──────────────────────────────────────

export function getCelebrityById(id: string) {
  return celebrities.find((c) => c.id === id)
}

export function getPropertyById(id: string) {
  return properties.find((p) => p.id === id)
}

export function getCelebPropertiesForCeleb(celebId: string) {
  const propMap = new Map(properties.map((p) => [p.id, p]))
  return celebrityProperties
    .filter((cp) => cp.celebrityId === celebId)
    .map((cp) => ({
      ...cp,
      property: propMap.get(cp.propertyId),
    }))
    .filter((cp) => cp.property !== undefined)
}

export function getCelebsForProperty(propertyId: string) {
  const celebMap = new Map(celebrities.map((c) => [c.id, c]))
  return celebrityProperties
    .filter((cp) => cp.propertyId === propertyId)
    .map((cp) => ({
      ...cp,
      celebrity: celebMap.get(cp.celebrityId),
    }))
    .filter((cp) => cp.celebrity !== undefined)
}

export function getAllCelebrities() {
  return celebrities
}
