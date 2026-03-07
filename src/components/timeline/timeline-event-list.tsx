'use client'

import { TimelineEventCard } from './timeline-event-card'
import type { GlobalTimelineEvent } from '@/data/timeline-data'
import type { CelebrityCategory } from '@/types'

interface TimelineEventListProps {
  readonly events: GlobalTimelineEvent[]
  readonly selectedCategories: Set<CelebrityCategory>
}

export function TimelineEventList({
  events,
  selectedCategories,
}: TimelineEventListProps) {
  const filtered =
    selectedCategories.size === 0
      ? events
      : events.filter((e) => selectedCategories.has(e.category))

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="text-4xl mb-3">📭</span>
        <p className="text-muted-foreground">
          이 연도에는 거래 이벤트가 없습니다
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {filtered.length}건의 거래
      </p>
      {filtered.map((event, idx) => (
        <TimelineEventCard
          key={`${event.celebrityId}-${event.date}-${event.propertyName}-${idx}`}
          event={event}
        />
      ))}
    </div>
  )
}
