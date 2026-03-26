/**
 * AI GIS 분석가 엔진
 *
 * 자연어 질문을 파싱하여 공간 분석 결과를 반환한다.
 * 실제 LLM 없이 패턴 매칭 + 공간 분석 함수 조합으로 동작.
 */

import type { CelebrityCategory } from '@/types'
import { CATEGORY_LABELS } from '@/types'
import {
  celebrities,
  celebrityProperties,
  properties,
} from '@/data/celebrity-seed-data'
import {
  getHeatmapPoints,
  getGuStats,
  getCelebritiesInCatchment,
  findNeighborCelebrities,
  type HeatmapPoint,
  type GuStats,
  type CatchmentCelebrity,
  type NeighborRelation,
} from './spatial-analysis'
import { formatPrice } from '@/lib/utils'

// ─── Types ──────────────────────────────────────────────────

export interface AnalysisResult {
  type: 'text' | 'ranking' | 'catchment' | 'neighbor' | 'heatmap' | 'stats'
  title: string
  content: string
  data?: {
    rankings?: { name: string; value: string; detail?: string }[]
    catchmentCelebs?: CatchmentCelebrity[]
    neighbors?: NeighborRelation[]
    guStats?: GuStats[]
    heatmapPoints?: HeatmapPoint[]
    mapCenter?: { lat: number; lng: number; zoom: number }
  }
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  analysis?: AnalysisResult
  timestamp: number
}

// ─── Pattern Matching ──────────────────────────────────────

const PATTERNS = {
  naverPrice: /(.*)(현재|실시간|지금|호가|시세|네이버|매물가격|네이버부동산)/,
  guAnalysis: /([가-힣]+구)\s*(셀럽|연예인|정치인|운동선수|분석|통계|현황|정보)/,
  neighborSearch: /(이웃|근처|근접|옆|주변).*(셀럽|연예인|스타)/,
  catchmentSearch: /([가-힣]+)\s*(반경|주변|근처|생활권|내)\s*(\d+)?\s*(km|m|미터|킬로)?/,
  topRanking: /(가장|제일|최고|탑|top|1위).*(비싼|비싸|고가|자산|부자|많은|다주택)/i,
  categoryQuery: /(연예인|정치인|운동선수|전문가).*(어디|어느|분석|매물|부동산)/,
  celebQuery: /([가-힣]{2,10})\s*(어디|매물|부동산|집|아파트|빌딩|자산)/,
  comparisonQuery: /([가-힣]+구)\s*(?:vs|대비|비교)\s*([가-힣]+구)/,
  densityQuery: /(밀집|밀도|모여|집중).*(지역|동네|구)/,
  priceQuery: /(평균|시세|가격|매물가).*(높|비|낮|저|구별|지역별)/,
  generalStats: /(전체|총|요약|현황|통계|개요|총괄)/,
}

// ─── Analysis Functions ────────────────────────────────────

function analyzeNaverPrice(query: string): AnalysisResult {
  const propMap = new Map(properties.map((p) => [p.id, p]))

  // 셀럽명으로 매물 찾기
  const celeb = celebrities.find((c) => query.includes(c.name))
  if (celeb) {
    const celebProps = celebrityProperties
      .filter((cp) => cp.celebrityId === celeb.id)
      .map((cp) => ({ ...cp, property: propMap.get(cp.propertyId) }))
      .filter((cp) => cp.property)

    if (celebProps.length > 0) {
      const totalAcquisition = celebProps.reduce((s, cp) => s + (cp.price ?? 0), 0)
      const totalEstimated = celebProps.reduce((s, cp) => s + (cp.estimatedCurrentValue ?? cp.price ?? 0), 0)
      const returnRate = totalAcquisition > 0
        ? (((totalEstimated - totalAcquisition) / totalAcquisition) * 100).toFixed(1)
        : null

      const propDetails = celebProps.map((cp) => {
        const p = cp.property!
        const gu = p.address.match(/([가-힣]+구)/)?.[1] ?? ''
        const est = cp.estimatedCurrentValue
        const gain = cp.price && est ? `(추정 ${formatPrice(est)}원, ${((est - cp.price) / cp.price * 100).toFixed(0)}%)` : ''
        return {
          name: p.name,
          value: cp.price ? `${formatPrice(cp.price)}원` : '미공개',
          detail: `${gu} ${gain}`,
        }
      })

      return {
        type: 'ranking',
        title: `${celeb.name} 부동산 시세 분석`,
        content: `${celeb.name}의 보유 매물 ${celebProps.length}건\n` +
          `총 매입가: ${formatPrice(totalAcquisition)}원\n` +
          `추정 현재가: ${formatPrice(totalEstimated)}원` +
          (returnRate ? ` (수익률 ${returnRate}%)` : '') +
          `\n\n` +
          celebProps.map((cp) => {
            const p = cp.property!
            const gu = p.address.match(/([가-힣]+구)/)?.[1] ?? ''
            return `- ${p.name} (${gu}) — 매입 ${cp.price ? formatPrice(cp.price) + '원' : '미공개'}` +
              (cp.estimatedCurrentValue ? ` → 추정 ${formatPrice(cp.estimatedCurrentValue)}원` : '')
          }).join('\n') +
          `\n\n네이버 부동산 실시간 호가는 각 매물 상세 페이지에서 자동 조회됩니다.`,
        data: { rankings: propDetails },
      }
    }
  }

  // 단지명으로 직접 검색
  const prop = properties.find((p) => query.includes(p.name))
  if (prop) {
    const gu = prop.address.match(/([가-힣]+구)/)?.[1] ?? ''
    const relatedCPs = celebrityProperties.filter((cp) => cp.propertyId === prop.id)
    const celebDetails = relatedCPs.map((cp) => {
      const c = celebrities.find((c) => c.id === cp.celebrityId)
      if (!c) return null
      const est = cp.estimatedCurrentValue
      return {
        name: c.name,
        price: cp.price,
        estimated: est,
        returnRate: cp.price && est ? ((est - cp.price) / cp.price * 100).toFixed(1) : null,
      }
    }).filter(Boolean)

    const priceRange = relatedCPs
      .map((cp) => cp.estimatedCurrentValue ?? cp.price ?? 0)
      .filter((p) => p > 0)

    return {
      type: 'ranking',
      title: `${prop.name} 시세 분석`,
      content: `${prop.name} (${gu})\n${prop.address}\n\n` +
        (priceRange.length > 0
          ? `추정 시세 범위: ${formatPrice(Math.min(...priceRange))}원 ~ ${formatPrice(Math.max(...priceRange))}원\n\n`
          : '') +
        (celebDetails.length > 0
          ? '보유 셀럽:\n' + celebDetails.map((d) =>
              `- ${d!.name}: 매입 ${d!.price ? formatPrice(d!.price) + '원' : '미공개'}` +
              (d!.returnRate ? ` (수익률 ${d!.returnRate}%)` : ''),
            ).join('\n') + '\n\n'
          : '') +
        `네이버 부동산 실시간 호가 → /property/${prop.id}`,
      data: {
        rankings: celebDetails.map((d) => ({
          name: d!.name,
          value: d!.price ? `${formatPrice(d!.price)}원` : '미공개',
          detail: d!.returnRate ? `수익률 ${d!.returnRate}%` : '',
        })),
      },
    }
  }

  return {
    type: 'text',
    title: '시세 조회 안내',
    content: `실시간 네이버 부동산 시세를 조회하려면:\n\n` +
      `- "한남더힐 시세" — 특정 단지의 추정 시세 + 셀럽 매입가\n` +
      `- "전지현 현재 시세" — 셀럽 보유 매물 종합 분석\n` +
      `- 매물 상세 페이지 방문 시 네이버 실시간 호가 자동 조회`,
  }
}

function analyzeGu(guName: string): AnalysisResult {
  const guStats = getGuStats()
  const gu = guStats.find((g) => g.gu === guName)

  if (!gu) {
    return {
      type: 'text',
      title: '검색 결과 없음',
      content: `"${guName}"에 대한 데이터를 찾을 수 없습니다. 서울 시내 구(강남구, 서초구 등)를 입력해보세요.`,
    }
  }

  const rank = guStats.findIndex((g) => g.gu === guName) + 1

  return {
    type: 'stats',
    title: `${guName} 셀럽 부동산 분석`,
    content: `${guName}은 서울에서 셀럽 밀집도 ${rank}위 지역입니다.\n\n` +
      `- 셀럽 수: ${gu.celebrityCount}명\n` +
      `- 매물 수: ${gu.propertyCount}건\n` +
      `- 총 자산: ${formatPrice(gu.totalAssetValue)}원\n` +
      `- 평균 매물가: ${formatPrice(gu.avgAssetValue)}원\n` +
      `- 대표 셀럽: ${gu.topCeleb}`,
    data: { guStats: [gu] },
  }
}

function analyzeTopRanking(query: string): AnalysisResult {
  const isMultiOwner = /다주택|많은|여러/.test(query)

  const countMap = new Map<string, number>()
  const totalMap = new Map<string, number>()
  for (const cp of celebrityProperties) {
    countMap.set(cp.celebrityId, (countMap.get(cp.celebrityId) ?? 0) + 1)
    totalMap.set(cp.celebrityId, (totalMap.get(cp.celebrityId) ?? 0) + (cp.price ?? 0))
  }

  const celebMap = new Map(celebrities.map((c) => [c.id, c]))
  const sorted = Array.from(totalMap.entries())
    .map(([id, value]) => ({
      id,
      name: celebMap.get(id)?.name ?? id,
      category: celebMap.get(id)?.category ?? 'entertainer',
      value,
      count: countMap.get(id) ?? 0,
    }))
    .sort((a, b) => isMultiOwner ? b.count - a.count : b.value - a.value)
    .slice(0, 10)

  return {
    type: 'ranking',
    title: isMultiOwner ? '다주택 셀럽 TOP 10' : '자산 규모 셀럽 TOP 10',
    content: sorted
      .map((c, i) =>
        `${i + 1}. ${c.name} (${CATEGORY_LABELS[c.category as CelebrityCategory]}) - ` +
        (isMultiOwner ? `${c.count}건 보유` : `${formatPrice(c.value)}원`),
      )
      .join('\n'),
    data: {
      rankings: sorted.map((c, i) => ({
        name: `${i + 1}. ${c.name}`,
        value: isMultiOwner ? `${c.count}건` : `${formatPrice(c.value)}원`,
        detail: CATEGORY_LABELS[c.category as CelebrityCategory],
      })),
    },
  }
}

function analyzeNeighbors(): AnalysisResult {
  const neighbors = findNeighborCelebrities(500)
  const top10 = neighbors.slice(0, 10)

  return {
    type: 'neighbor',
    title: '이웃 셀럽 분석 (반경 500m)',
    content: `총 ${neighbors.length}쌍의 이웃 셀럽을 발견했습니다.\n\n` +
      top10
        .map((n, i) =>
          `${i + 1}. ${n.sourceName} ↔ ${n.targetName} (${n.distanceMeters}m)\n` +
          `   ${n.sourcePropertyName} — ${n.targetPropertyName}`,
        )
        .join('\n'),
    data: { neighbors: top10 },
  }
}

function analyzeDensity(): AnalysisResult {
  const guStats = getGuStats()
  const top5 = guStats.slice(0, 5)

  return {
    type: 'stats',
    title: '셀럽 밀집 지역 분석',
    content: `서울에서 셀럽이 가장 많이 밀집된 지역을 분석했습니다.\n\n` +
      top5
        .map((g, i) =>
          `${i + 1}. ${g.gu}: 셀럽 ${g.celebrityCount}명, 매물 ${g.propertyCount}건, 대표 ${g.topCeleb}`,
        )
        .join('\n') +
      `\n\n강남구-서초구-용산구가 서울 셀럽 부동산의 핵심 축을 형성하고 있습니다.`,
    data: {
      guStats: top5,
      heatmapPoints: getHeatmapPoints('density'),
    },
  }
}

function analyzeCeleb(celebName: string): AnalysisResult {
  const celeb = celebrities.find((c) => c.name.includes(celebName))
  if (!celeb) {
    return {
      type: 'text',
      title: '검색 결과 없음',
      content: `"${celebName}" 셀럽을 찾을 수 없습니다. 정확한 이름을 입력해주세요.`,
    }
  }

  const propMap = new Map(properties.map((p) => [p.id, p]))
  const celebProps = celebrityProperties
    .filter((cp) => cp.celebrityId === celeb.id)
    .map((cp) => ({
      ...cp,
      property: propMap.get(cp.propertyId),
    }))
    .filter((cp) => cp.property)

  const totalValue = celebProps.reduce((sum, cp) => sum + (cp.price ?? 0), 0)

  return {
    type: 'ranking',
    title: `${celeb.name} 부동산 분석`,
    content: `${celeb.name} (${CATEGORY_LABELS[celeb.category]}) - ${celeb.description}\n\n` +
      `총 ${celebProps.length}건 보유, 총 자산 ${formatPrice(totalValue)}원\n\n` +
      celebProps
        .map((cp, i) =>
          `${i + 1}. ${cp.property!.name} (${cp.property!.address})\n` +
          `   ${cp.price ? formatPrice(cp.price) + '원' : '가격 미공개'}` +
          (cp.acquisitionDate ? ` · ${cp.acquisitionDate}` : ''),
        )
        .join('\n'),
    data: {
      rankings: celebProps.map((cp) => ({
        name: cp.property!.name,
        value: cp.price ? `${formatPrice(cp.price)}원` : '미공개',
        detail: cp.property!.address,
      })),
      mapCenter: celebProps[0]?.property
        ? { lat: celebProps[0].property.lat, lng: celebProps[0].property.lng, zoom: 14 }
        : undefined,
    },
  }
}

function analyzeGeneralStats(): AnalysisResult {
  const guStats = getGuStats()
  const totalCelebs = celebrities.length
  const totalProps = properties.length
  const totalRelations = celebrityProperties.length
  const neighbors = findNeighborCelebrities(500)

  const categoryCount: Record<string, number> = {}
  for (const c of celebrities) {
    categoryCount[c.category] = (categoryCount[c.category] ?? 0) + 1
  }

  return {
    type: 'stats',
    title: '셀럽하우스맵 전체 현황',
    content: `셀럽하우스맵의 전체 데이터를 요약합니다.\n\n` +
      `- 등록 셀럽: ${totalCelebs}명\n` +
      `  · 연예인 ${categoryCount.entertainer ?? 0}명, 정치인 ${categoryCount.politician ?? 0}명\n` +
      `  · 운동선수 ${categoryCount.athlete ?? 0}명, 전문가 ${categoryCount.expert ?? 0}명\n` +
      `- 등록 매물: ${totalProps}건\n` +
      `- 셀럽-매물 관계: ${totalRelations}건\n` +
      `- 이웃 셀럽 쌍 (500m): ${neighbors.length}쌍\n` +
      `- 분석 지역: ${guStats.length}개 구\n` +
      `- 셀럽 최다 지역: ${guStats[0]?.gu} (${guStats[0]?.celebrityCount}명)`,
    data: { guStats },
  }
}

function analyzeComparison(gu1: string, gu2: string): AnalysisResult {
  const guStats = getGuStats()
  const g1 = guStats.find((g) => g.gu === gu1)
  const g2 = guStats.find((g) => g.gu === gu2)

  if (!g1 || !g2) {
    return {
      type: 'text',
      title: '비교 불가',
      content: `${!g1 ? gu1 : gu2}의 데이터를 찾을 수 없습니다.`,
    }
  }

  return {
    type: 'stats',
    title: `${gu1} vs ${gu2} 비교 분석`,
    content:
      `| 항목 | ${gu1} | ${gu2} |\n` +
      `|------|--------|--------|\n` +
      `| 셀럽 수 | ${g1.celebrityCount}명 | ${g2.celebrityCount}명 |\n` +
      `| 매물 수 | ${g1.propertyCount}건 | ${g2.propertyCount}건 |\n` +
      `| 총 자산 | ${formatPrice(g1.totalAssetValue)}원 | ${formatPrice(g2.totalAssetValue)}원 |\n` +
      `| 평균가 | ${formatPrice(g1.avgAssetValue)}원 | ${formatPrice(g2.avgAssetValue)}원 |\n` +
      `| 대표 | ${g1.topCeleb} | ${g2.topCeleb} |`,
    data: { guStats: [g1, g2] },
  }
}

function analyzeCatchment(query: string): AnalysisResult {
  // 지역명에서 셀럽 이름이나 매물명을 찾아 중심점 결정
  const propMap = new Map(properties.map((p) => [p.id, p]))
  const celebMap = new Map(celebrities.map((c) => [c.id, c]))

  // 셀럽 이름으로 중심점 결정
  const celeb = celebrities.find((c) => query.includes(c.name))
  let centerLat = 37.5172 // 강남 기본값
  let centerLng = 127.0473
  let centerName = '강남역 일대'

  if (celeb) {
    const cp = celebrityProperties.find((cp) => cp.celebrityId === celeb.id)
    if (cp) {
      const prop = propMap.get(cp.propertyId)
      if (prop) {
        centerLat = prop.lat
        centerLng = prop.lng
        centerName = `${celeb.name}의 ${prop.name}`
      }
    }
  }

  // 반경 파싱 (기본 1km)
  const radiusMatch = query.match(/(\d+)\s*(km|m|킬로|미터)/)
  const radiusMeters = radiusMatch
    ? radiusMatch[2] === 'km' || radiusMatch[2] === '킬로'
      ? parseInt(radiusMatch[1]) * 1000
      : parseInt(radiusMatch[1])
    : 1000

  const nearbyCelebs = getCelebritiesInCatchment(centerLat, centerLng, radiusMeters)

  return {
    type: 'catchment',
    title: `${centerName} 생활권 분석 (반경 ${radiusMeters >= 1000 ? `${radiusMeters / 1000}km` : `${radiusMeters}m`})`,
    content: `${centerName} 반경 ${radiusMeters >= 1000 ? `${radiusMeters / 1000}km` : `${radiusMeters}m`} 내에 ` +
      `셀럽 ${nearbyCelebs.length}명이 거주하고 있습니다.\n\n` +
      nearbyCelebs.slice(0, 10)
        .map((c, i) => `${i + 1}. ${c.name} (${CATEGORY_LABELS[c.category]}) — ${c.propertyName}, ${c.distanceMeters}m`)
        .join('\n') +
      (nearbyCelebs.length > 10 ? `\n\n... 외 ${nearbyCelebs.length - 10}명` : ''),
    data: {
      catchmentCelebs: nearbyCelebs.slice(0, 15),
      mapCenter: { lat: centerLat, lng: centerLng, zoom: 14 },
    },
  }
}

function analyzePriceByArea(): AnalysisResult {
  const guStats = getGuStats()
  const sorted = [...guStats].sort((a, b) => b.avgAssetValue - a.avgAssetValue).slice(0, 10)

  return {
    type: 'ranking',
    title: '구별 평균 매물가 순위',
    content: sorted
      .map((g, i) =>
        `${i + 1}. ${g.gu}: 평균 ${formatPrice(g.avgAssetValue)}원 (${g.propertyCount}건)`,
      )
      .join('\n'),
    data: {
      rankings: sorted.map((g, i) => ({
        name: `${i + 1}. ${g.gu}`,
        value: formatPrice(g.avgAssetValue) + '원',
        detail: `${g.propertyCount}건`,
      })),
    },
  }
}

// ─── Main Analyzer ─────────────────────────────────────────

export function analyzeQuery(query: string): AnalysisResult {
  // 네이버 시세 조회 (최우선)
  if (PATTERNS.naverPrice.test(query)) return analyzeNaverPrice(query)

  // 구별 비교
  const compMatch = query.match(PATTERNS.comparisonQuery)
  if (compMatch) return analyzeComparison(compMatch[1], compMatch[2])

  // 구 분석
  const guMatch = query.match(PATTERNS.guAnalysis)
  if (guMatch) return analyzeGu(guMatch[1])

  // 이웃 분석
  if (PATTERNS.neighborSearch.test(query)) return analyzeNeighbors()

  // 생활권 분석
  if (PATTERNS.catchmentSearch.test(query)) return analyzeCatchment(query)

  // 랭킹
  if (PATTERNS.topRanking.test(query)) return analyzeTopRanking(query)

  // 밀집도
  if (PATTERNS.densityQuery.test(query)) return analyzeDensity()

  // 평균가
  if (PATTERNS.priceQuery.test(query)) return analyzePriceByArea()

  // 통계
  if (PATTERNS.generalStats.test(query)) return analyzeGeneralStats()

  // 셀럽 개인 검색
  const celebMatch = query.match(PATTERNS.celebQuery)
  if (celebMatch) return analyzeCeleb(celebMatch[1])

  // 카테고리 분석
  if (PATTERNS.categoryQuery.test(query)) {
    const cat = /연예인/.test(query) ? 'entertainer'
      : /정치인/.test(query) ? 'politician'
        : /운동선수/.test(query) ? 'athlete'
          : 'expert'
    const guStats = getGuStats()
    return {
      type: 'stats',
      title: `${CATEGORY_LABELS[cat]} 부동산 분석`,
      content: `${CATEGORY_LABELS[cat]} 관련 분석 결과를 표시합니다.`,
      data: {
        heatmapPoints: getHeatmapPoints('density', [cat]),
        guStats,
      },
    }
  }

  // 일반 셀럽 이름 검색 (패턴 매칭 실패 시)
  const celebDirect = celebrities.find((c) => query.includes(c.name))
  if (celebDirect) return analyzeCeleb(celebDirect.name)

  // Fallback
  return {
    type: 'text',
    title: '분석 도움말',
    content: `다음과 같은 질문을 해보세요:\n\n` +
      `- "강남구 셀럽 분석" — 특정 구 분석\n` +
      `- "가장 비싼 셀럽" — 자산 순위\n` +
      `- "이웃 셀럽 분석" — 500m 이내 이웃\n` +
      `- "강남구 vs 서초구" — 지역 비교\n` +
      `- "전지현 매물" — 개인 분석\n` +
      `- "한남더힐 현재 시세" — 실시간 네이버 시세\n` +
      `- "전지현 주변 생활권" — 생활권 분석\n` +
      `- "셀럽 밀집 지역" — 밀집도 분석\n` +
      `- "전체 현황" — 종합 통계`,
  }
}

// ─── Suggested Questions ──────────────────────────────────

export const SUGGESTED_QUESTIONS = [
  '강남구 셀럽 현황 분석',
  '가장 비싼 셀럽 부동산 TOP 10',
  '한남더힐 현재 시세',
  '강남구 vs 용산구 비교',
  '전지현 매물 분석',
  '전지현 주변 생활권 1km',
  '이웃 셀럽 분석',
  '전체 통계 요약',
]
