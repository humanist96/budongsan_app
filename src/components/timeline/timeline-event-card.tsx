'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils/format'
import { CATEGORY_LABELS } from '@/types/celebrity'
import type { GlobalTimelineEvent } from '@/data/timeline-data'

const CATEGORY_BADGE_STYLES: Record<string, string> = {
  entertainer: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
  politician: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  athlete: 'bg-green-500/10 text-green-500 border-green-500/20',
  expert: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
}

interface TimelineEventCardProps {
  readonly event: GlobalTimelineEvent
}

export function TimelineEventCard({ event }: TimelineEventCardProps) {
  const badgeStyle = CATEGORY_BADGE_STYLES[event.category] ?? ''

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-lg">
                {event.eventType === 'buy' ? '🏠' : '💰'}
              </span>
              <span className="font-semibold truncate">
                {event.celebrityName}
              </span>
              <Badge variant="outline" className={`text-xs shrink-0 ${badgeStyle}`}>
                {CATEGORY_LABELS[event.category]}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-1">
              {event.propertyName}
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              {event.price !== null && (
                <span className="text-sm font-medium">
                  {event.eventType === 'buy' ? '매입' : '매도'}{' '}
                  {formatPrice(event.price)}원
                </span>
              )}

              {event.multiplier !== null && event.multiplier > 1 && (
                <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs">
                  ×{event.multiplier}
                </Badge>
              )}

              <span className="text-xs text-muted-foreground">
                {event.date}
              </span>
            </div>

            {event.highlight && (
              <p className="text-xs text-pink-500 mt-1.5 font-medium">
                {event.highlight}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
