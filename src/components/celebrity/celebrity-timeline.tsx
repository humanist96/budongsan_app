'use client'

import { useEffect, useRef, useState } from 'react'
import { Flame } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils/format'
import type { CelebrityCategory } from '@/types'
import type { TimelineEvent } from '@/data/timeline-helpers'

// ─── Types ──────────────────────────────────────────────────

interface CelebrityTimelineProps {
  readonly events: TimelineEvent[]
  readonly category: CelebrityCategory
  readonly currentPortfolioValue?: number // 만원
}

// ─── Helpers ────────────────────────────────────────────────

const CATEGORY_BUY_COLOR: Record<CelebrityCategory, string> = {
  entertainer: 'bg-pink-500',
  politician: 'bg-blue-500',
  athlete: 'bg-emerald-500',
}

const CATEGORY_LINE_COLOR: Record<CelebrityCategory, string> = {
  entertainer: 'bg-pink-200 dark:bg-pink-800',
  politician: 'bg-blue-200 dark:bg-blue-800',
  athlete: 'bg-emerald-200 dark:bg-emerald-800',
}

// ─── Timeline Node ──────────────────────────────────────────

function TimelineNode({
  event,
  category,
  index,
  isVisible,
}: {
  readonly event: TimelineEvent
  readonly category: CelebrityCategory
  readonly index: number
  readonly isVisible: boolean
}) {
  const isBuy = event.eventType === 'buy'
  const delay = index * 150

  return (
    <div
      className="relative pl-8 pb-8 last:pb-0"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      {/* Vertical line */}
      <div
        className={`absolute left-[11px] top-6 bottom-0 w-0.5 ${CATEGORY_LINE_COLOR[category]} last:hidden`}
      />

      {/* Node dot */}
      <div
        className={`absolute left-0 top-1.5 w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
          isBuy ? CATEGORY_BUY_COLOR[category] : 'bg-red-500'
        }`}
      >
        {isBuy ? '+' : '-'}
      </div>

      {/* Content */}
      <div className="bg-muted/50 rounded-lg p-3">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">
              {event.date.replace('-', '.')}
            </span>
            <Badge
              variant={isBuy ? 'default' : 'destructive'}
              className="text-[10px] px-1.5 py-0"
            >
              {isBuy ? '매입' : '매도'}
            </Badge>
          </div>
          {event.multiplier && event.multiplier > 1 && isBuy && (
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 font-bold"
            >
              x{event.multiplier}
            </Badge>
          )}
        </div>

        <p className="font-medium text-sm">{event.propertyName}</p>

        <div className="flex items-center gap-3 mt-1 text-xs">
          {event.price && (
            <span className={isBuy ? '' : 'text-red-500'}>
              {isBuy ? '매입' : '매도'} {formatPrice(event.price)}원
            </span>
          )}
          {isBuy && event.estimatedCurrentValue && (
            <span className="text-muted-foreground">
              → 현재 ~{formatPrice(event.estimatedCurrentValue)}원
            </span>
          )}
          {!isBuy && event.highlight && (
            <span className={event.highlight.includes('+') ? 'text-emerald-500 font-medium' : 'text-red-500'}>
              {event.highlight}
            </span>
          )}
        </div>

        {isBuy && event.highlight && (
          <div className="flex items-center gap-1 mt-2 text-xs text-orange-500 dark:text-orange-400">
            <Flame className="h-3 w-3" />
            <span>{event.highlight}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────

export function CelebrityTimeline({
  events,
  category,
  currentPortfolioValue,
}: CelebrityTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-sm text-muted-foreground text-center">
            타임라인 정보가 없습니다.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">투자 타임라인</CardTitle>
      </CardHeader>
      <CardContent ref={containerRef}>
        <div className="relative">
          {events.map((event, idx) => (
            <TimelineNode
              key={`${event.date}-${event.propertyId}-${event.eventType}`}
              event={event}
              category={category}
              index={idx}
              isVisible={isVisible}
            />
          ))}

          {/* Portfolio total */}
          {currentPortfolioValue && currentPortfolioValue > 0 && (
            <div
              className="relative pl-8 pt-2"
              style={{
                opacity: isVisible ? 1 : 0,
                transition: `opacity 0.5s ease ${events.length * 150}ms`,
              }}
            >
              <div
                className={`absolute left-0 top-3.5 w-6 h-6 rounded-full flex items-center justify-center ${CATEGORY_BUY_COLOR[category]}`}
              >
                <span className="text-white text-[10px] font-bold">$</span>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground">현재 총 포트폴리오</p>
                <p className="text-lg font-black">
                  ~{formatPrice(currentPortfolioValue)}원
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
