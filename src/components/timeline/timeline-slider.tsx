'use client'

import { useEffect, useRef, useCallback } from 'react'
import { Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CATEGORY_LABELS } from '@/types/celebrity'
import type { CelebrityCategory } from '@/types'

const CATEGORY_FILTER_ITEMS: { key: CelebrityCategory; color: string }[] = [
  { key: 'entertainer', color: 'bg-pink-500' },
  { key: 'politician', color: 'bg-blue-500' },
  { key: 'athlete', color: 'bg-green-500' },
]

interface TimelineSliderProps {
  readonly min: number
  readonly max: number
  readonly value: number
  readonly onChange: (year: number) => void
  readonly isPlaying: boolean
  readonly onTogglePlay: () => void
  readonly eventCount: number
  readonly selectedCategories: Set<CelebrityCategory>
  readonly onToggleCategory: (category: CelebrityCategory) => void
}

export function TimelineSlider({
  min,
  max,
  value,
  onChange,
  isPlaying,
  onTogglePlay,
  eventCount,
  selectedCategories,
  onToggleCategory,
}: TimelineSliderProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    clearAutoPlay()

    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        onChange(value >= max ? min : value + 1)
      }, 2000)
    }

    return clearAutoPlay
  }, [isPlaying, value, min, max, onChange, clearAutoPlay])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={onTogglePlay}
          aria-label={isPlaying ? '일시정지' : '재생'}
          className="shrink-0"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>

        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold tabular-nums">{value}년</span>
            <Badge variant="secondary" className="text-xs">
              {eventCount}건
            </Badge>
          </div>
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className="w-full accent-pink-500 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{min}</span>
            <span>{max}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground mr-1">필터:</span>
        {CATEGORY_FILTER_ITEMS.map(({ key, color }) => {
          const isActive = selectedCategories.has(key)
          return (
            <button
              key={key}
              onClick={() => onToggleCategory(key)}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                border transition-all cursor-pointer
                ${
                  isActive
                    ? `${color} text-white border-transparent`
                    : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
                }
              `}
            >
              <span
                className={`w-2 h-2 rounded-full ${isActive ? 'bg-white/80' : color}`}
              />
              {CATEGORY_LABELS[key]}
            </button>
          )
        })}
      </div>
    </div>
  )
}
