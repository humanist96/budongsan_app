/**
 * 글로벌 타임라인 데이터
 *
 * 전체 셀럽의 부동산 매입/매도 이벤트를 집계하여
 * 연도별 타임라인 탐색 기능을 제공하는 순수 함수들
 */

import { celebrities } from './celebrity-seed-data'
import { getTimelineEvents } from './timeline-helpers'
import type { CelebrityCategory } from '@/types'

// ─── Types ──────────────────────────────────────────────────

export interface GlobalTimelineEvent {
  readonly year: number
  readonly month: number
  readonly date: string
  readonly eventType: 'buy' | 'sell'
  readonly celebrityId: string
  readonly celebrityName: string
  readonly category: CelebrityCategory
  readonly propertyName: string
  readonly price: number | null
  readonly highlight: string | null
  readonly multiplier: number | null
}

export interface YearSummary {
  readonly year: number
  readonly totalEvents: number
  readonly buyCount: number
  readonly sellCount: number
  readonly totalVolume: number
}

// ─── Internal Cache ─────────────────────────────────────────

let _cachedEvents: GlobalTimelineEvent[] | null = null
let _cachedSummaries: YearSummary[] | null = null

// ─── Public API ─────────────────────────────────────────────

/**
 * 전체 셀럽의 타임라인 이벤트를 날짜순으로 반환
 */
export function getAllTimelineEvents(): GlobalTimelineEvent[] {
  if (_cachedEvents) return _cachedEvents

  const events: GlobalTimelineEvent[] = []

  for (const celeb of celebrities) {
    const celebEvents = getTimelineEvents(celeb.id)

    for (const event of celebEvents) {
      const parts = event.date.split('-')
      const year = parseInt(parts[0], 10)
      const month = parts.length > 1 ? parseInt(parts[1], 10) : 1

      events.push({
        year,
        month,
        date: event.date,
        eventType: event.eventType,
        celebrityId: celeb.id,
        celebrityName: celeb.name,
        category: celeb.category,
        propertyName: event.propertyName,
        price: event.price,
        highlight: event.highlight,
        multiplier: event.multiplier,
      })
    }
  }

  events.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year
    return a.month - b.month
  })

  _cachedEvents = events
  return events
}

/**
 * 연도별 집계 요약 (차트용)
 */
export function getYearSummaries(): YearSummary[] {
  if (_cachedSummaries) return _cachedSummaries

  const events = getAllTimelineEvents()
  const { min, max } = getYearRange()
  const summaryMap = new Map<number, YearSummary>()

  for (let year = min; year <= max; year++) {
    summaryMap.set(year, {
      year,
      totalEvents: 0,
      buyCount: 0,
      sellCount: 0,
      totalVolume: 0,
    })
  }

  for (const event of events) {
    const existing = summaryMap.get(event.year)
    if (!existing) continue

    summaryMap.set(event.year, {
      ...existing,
      totalEvents: existing.totalEvents + 1,
      buyCount: existing.buyCount + (event.eventType === 'buy' ? 1 : 0),
      sellCount: existing.sellCount + (event.eventType === 'sell' ? 1 : 0),
      totalVolume: existing.totalVolume + (event.price ?? 0),
    })
  }

  _cachedSummaries = Array.from(summaryMap.values())
  return _cachedSummaries
}

/**
 * 특정 연도의 이벤트 반환
 */
export function getEventsForYear(year: number): GlobalTimelineEvent[] {
  return getAllTimelineEvents().filter((e) => e.year === year)
}

/**
 * 데이터에 존재하는 연도 범위
 */
export function getYearRange(): { min: number; max: number } {
  const events = getAllTimelineEvents()
  if (events.length === 0) return { min: 2000, max: 2025 }

  let min = events[0].year
  let max = events[0].year

  for (const event of events) {
    if (event.year < min) min = event.year
    if (event.year > max) max = event.year
  }

  return { min, max }
}
