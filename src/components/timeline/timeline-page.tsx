'use client'

import { useState, useCallback, useMemo } from 'react'
import { Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TimelineSlider } from './timeline-slider'
import { TimelineChart } from './timeline-chart'
import { TimelineEventList } from './timeline-event-list'
import {
  getYearSummaries,
  getEventsForYear,
  getYearRange,
} from '@/data/timeline-data'
import type { CelebrityCategory } from '@/types'

type Phase = 'intro' | 'main'

export function TimelinePage() {
  const [phase, setPhase] = useState<Phase>('intro')
  const yearRange = useMemo(() => getYearRange(), [])
  const [selectedYear, setSelectedYear] = useState(yearRange.min)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<
    Set<CelebrityCategory>
  >(new Set())

  const yearSummaries = useMemo(() => getYearSummaries(), [])
  const yearEvents = useMemo(
    () => getEventsForYear(selectedYear),
    [selectedYear],
  )

  const filteredEventCount = useMemo(() => {
    if (selectedCategories.size === 0) return yearEvents.length
    return yearEvents.filter((e) => selectedCategories.has(e.category)).length
  }, [yearEvents, selectedCategories])

  const handleStart = useCallback(() => {
    setPhase('main')
  }, [])

  const handleYearChange = useCallback((year: number) => {
    setSelectedYear(year)
  }, [])

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  const handleToggleCategory = useCallback((category: CelebrityCategory) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }, [])

  if (phase === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6">
          <Clock className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-3">셀럽 부동산 연대기</h1>
        <p className="text-muted-foreground mb-2 max-w-md">
          2000년부터 2025년까지, 셀럽들의 부동산 매입과 매도 이벤트를 연도별로 탐색하세요.
        </p>
        <p className="text-sm text-muted-foreground mb-8 max-w-md">
          자동 재생으로 한국 셀럽 부동산 역사를 한눈에!
        </p>
        <Button
          onClick={handleStart}
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8"
        >
          연대기 시작하기
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="h-5 w-5 text-blue-500" />
        <h1 className="text-xl font-bold">셀럽 부동산 연대기</h1>
      </div>

      <TimelineChart
        data={yearSummaries}
        selectedYear={selectedYear}
        onYearSelect={handleYearChange}
      />

      <TimelineSlider
        min={yearRange.min}
        max={yearRange.max}
        value={selectedYear}
        onChange={handleYearChange}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        eventCount={filteredEventCount}
        selectedCategories={selectedCategories}
        onToggleCategory={handleToggleCategory}
      />

      <TimelineEventList
        events={yearEvents}
        selectedCategories={selectedCategories}
      />
    </div>
  )
}
