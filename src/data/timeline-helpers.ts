/**
 * 셀럽 타임라인 & 포트폴리오 계산 헬퍼
 *
 * 시드 데이터에서 타임라인 이벤트를 추출하고
 * 포트폴리오 가치 시계열 데이터를 생성하는 순수 함수들
 */

import {
  celebrities,
  properties,
  celebrityProperties,
  type SeedCelebrityProperty,
} from './celebrity-seed-data'

// ─── Types ──────────────────────────────────────────────────

export interface TimelineEvent {
  readonly date: string
  readonly eventType: 'buy' | 'sell'
  readonly propertyName: string
  readonly propertyId: string
  readonly price: number | null
  readonly estimatedCurrentValue: number | null
  readonly multiplier: number | null
  readonly highlight: string | null
  readonly sourceType: 'verified' | 'reported' | 'unverified'
}

export interface PortfolioDataPoint {
  readonly date: string
  readonly value: number
  readonly eventLabel?: string
  readonly eventType?: 'buy' | 'sell'
}

export interface PortfolioROI {
  readonly totalInvestment: number    // 총 투자액 (만원)
  readonly currentValue: number       // 현재 추정가치 (만원)
  readonly roi: number                // 수익률 (%)
  readonly topMultiplier: number      // 최고 배수
  readonly holdingYears: number       // 평균 보유기간 (년)
  readonly propertyCount: number      // 보유 매물 수
  readonly disposedCount: number      // 매도 매물 수
}

// ─── Helpers ────────────────────────────────────────────────

function parseDate(dateStr: string): Date {
  const parts = dateStr.split('-')
  const year = parseInt(parts[0], 10)
  const month = parts.length > 1 ? parseInt(parts[1], 10) - 1 : 0
  return new Date(year, month, 1)
}

function formatYearMonth(dateStr: string): string {
  const parts = dateStr.split('-')
  const year = parts[0]
  const month = parts.length > 1 ? parts[1].padStart(2, '0') : '01'
  return `${year}.${month}`
}

function getPropertyName(propertyId: string): string {
  return properties.find((p) => p.id === propertyId)?.name ?? '알 수 없음'
}

function computeMultiplier(
  buyPrice: number | null,
  currentOrSellPrice: number | null,
): number | null {
  if (!buyPrice || !currentOrSellPrice || buyPrice === 0) return null
  return Math.round((currentOrSellPrice / buyPrice) * 10) / 10
}

// ─── Public API ─────────────────────────────────────────────

/**
 * 셀럽의 매입/매도 이벤트를 시계열로 반환
 */
export function getTimelineEvents(celebrityId: string): TimelineEvent[] {
  const links = celebrityProperties.filter(
    (cp) => cp.celebrityId === celebrityId,
  )

  const events: TimelineEvent[] = []

  for (const cp of links) {
    const propertyName = getPropertyName(cp.propertyId)

    // 매입 이벤트
    if (cp.acquisitionDate) {
      const effectiveCurrentValue = cp.disposalPrice ?? cp.estimatedCurrentValue ?? null
      events.push({
        date: cp.acquisitionDate,
        eventType: 'buy',
        propertyName,
        propertyId: cp.propertyId,
        price: cp.price,
        estimatedCurrentValue: cp.estimatedCurrentValue ?? null,
        multiplier: computeMultiplier(cp.price, effectiveCurrentValue),
        highlight: cp.highlight ?? null,
        sourceType: cp.sourceType,
      })
    }

    // 매도 이벤트
    if (cp.disposalDate) {
      const profit =
        cp.disposalPrice && cp.price ? cp.disposalPrice - cp.price : null
      events.push({
        date: cp.disposalDate,
        eventType: 'sell',
        propertyName,
        propertyId: cp.propertyId,
        price: cp.disposalPrice ?? null,
        estimatedCurrentValue: null,
        multiplier: computeMultiplier(cp.price, cp.disposalPrice ?? null),
        highlight:
          profit !== null
            ? `${profit > 0 ? '+' : ''}${Math.round(profit / 10000)}억 ${profit > 0 ? '수익' : '손실'}`
            : null,
        sourceType: cp.sourceType,
      })
    }
  }

  return events.sort((a, b) => {
    const dateA = parseDate(a.date)
    const dateB = parseDate(b.date)
    return dateA.getTime() - dateB.getTime()
  })
}

/**
 * 포트폴리오 누적 가치 시계열 (차트용)
 * 매입 시점마다 포트폴리오 가치가 계단식 증가, 매도 시 감소
 * 마지막에 현재 추정 시세 반영
 */
export function getPortfolioDataPoints(
  celebrityId: string,
): PortfolioDataPoint[] {
  const events = getTimelineEvents(celebrityId)
  if (events.length === 0) return []

  const points: PortfolioDataPoint[] = []
  let cumulativeValue = 0

  // 보유 매물 추적 (propertyId → 매입가)
  const holdings = new Map<string, number>()

  for (const event of events) {
    const price = event.price ?? 0

    if (event.eventType === 'buy') {
      cumulativeValue += price
      holdings.set(event.propertyId, price)
      points.push({
        date: formatYearMonth(event.date),
        value: cumulativeValue,
        eventLabel: event.propertyName,
        eventType: 'buy',
      })
    } else {
      // sell
      const originalPrice = holdings.get(event.propertyId) ?? price
      cumulativeValue -= originalPrice
      holdings.delete(event.propertyId)
      points.push({
        date: formatYearMonth(event.date),
        value: cumulativeValue,
        eventLabel: event.propertyName,
        eventType: 'sell',
      })
    }
  }

  // 현재 시점: 보유 중인 매물의 추정 시세로 교체
  const links = celebrityProperties.filter(
    (cp) => cp.celebrityId === celebrityId && !cp.disposalDate,
  )
  const currentEstimated = links.reduce(
    (sum, cp) => sum + (cp.estimatedCurrentValue ?? cp.price ?? 0),
    0,
  )

  if (currentEstimated > 0) {
    points.push({
      date: '2026.03',
      value: currentEstimated,
      eventLabel: '현재 추정 시세',
    })
  }

  return points
}

/**
 * 셀럽의 포트폴리오 수익률 요약
 */
export function getCelebrityROI(celebrityId: string): PortfolioROI {
  const links = celebrityProperties.filter(
    (cp) => cp.celebrityId === celebrityId,
  )

  const activeLinks = links.filter((cp) => !cp.disposalDate)
  const disposedLinks = links.filter((cp) => cp.disposalDate)

  const totalInvestment = activeLinks.reduce(
    (sum, cp) => sum + (cp.price ?? 0),
    0,
  )

  const currentValue = activeLinks.reduce(
    (sum, cp) => sum + (cp.estimatedCurrentValue ?? cp.price ?? 0),
    0,
  )

  const roi =
    totalInvestment > 0
      ? Math.round(((currentValue - totalInvestment) / totalInvestment) * 1000) / 10
      : 0

  // 최고 배수 계산
  const multipliers = links
    .map((cp) => {
      const effectiveValue = cp.disposalPrice ?? cp.estimatedCurrentValue
      return computeMultiplier(cp.price, effectiveValue ?? null)
    })
    .filter((m): m is number => m !== null)

  const topMultiplier =
    multipliers.length > 0 ? Math.max(...multipliers) : 0

  // 평균 보유 기간
  const now = new Date()
  const holdingYearsList = activeLinks
    .filter((cp) => cp.acquisitionDate)
    .map((cp) => {
      const acq = parseDate(cp.acquisitionDate!)
      return (now.getTime() - acq.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    })

  const holdingYears =
    holdingYearsList.length > 0
      ? Math.round(
          (holdingYearsList.reduce((a, b) => a + b, 0) /
            holdingYearsList.length) *
            10,
        ) / 10
      : 0

  return {
    totalInvestment,
    currentValue,
    roi,
    topMultiplier,
    holdingYears,
    propertyCount: activeLinks.length,
    disposedCount: disposedLinks.length,
  }
}

/**
 * 특정 매물에 대한 셀럽 매입 이벤트 반환 (매물 상세 차트용)
 */
export function getPropertyAcquisitionEvents(
  propertyId: string,
): Array<{
  readonly celebrityName: string
  readonly date: string
  readonly price: number | null
}> {
  const links = celebrityProperties.filter(
    (cp) => cp.propertyId === propertyId && cp.acquisitionDate,
  )

  return links.map((cp) => {
    const celeb = celebrities.find((c) => c.id === cp.celebrityId)
    return {
      celebrityName: celeb?.name ?? '알 수 없음',
      date: cp.acquisitionDate!,
      price: cp.price,
    }
  })
}
