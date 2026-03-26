'use client'

import { Flame, DollarSign, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { CelebrityCategory } from '@/types'
import { CATEGORY_LABELS } from '@/types'

export type HeatmapMode = 'density' | 'price' | 'growth'

const modes: { value: HeatmapMode; label: string; icon: typeof Flame; description: string }[] = [
  { value: 'density', label: '셀럽 밀집도', icon: Flame, description: '셀럽이 많이 거주하는 지역' },
  { value: 'price', label: '평균 매물가', icon: DollarSign, description: '매물 평균 가격이 높은 지역' },
  { value: 'growth', label: '가격 상승률', icon: TrendingUp, description: '매입 대비 시세 상승이 큰 지역' },
]

const allCategories: CelebrityCategory[] = ['entertainer', 'politician', 'athlete', 'expert']

const categoryColors: Record<CelebrityCategory, string> = {
  entertainer: 'bg-pink-500/20 text-pink-700 border-pink-300',
  politician: 'bg-blue-500/20 text-blue-700 border-blue-300',
  athlete: 'bg-green-500/20 text-green-700 border-green-300',
  expert: 'bg-amber-500/20 text-amber-700 border-amber-300',
}

const categoryActiveColors: Record<CelebrityCategory, string> = {
  entertainer: 'bg-pink-500 text-white border-pink-500',
  politician: 'bg-blue-500 text-white border-blue-500',
  athlete: 'bg-green-500 text-white border-green-500',
  expert: 'bg-amber-500 text-white border-amber-500',
}

interface HeatmapControlsProps {
  mode: HeatmapMode
  onModeChange: (mode: HeatmapMode) => void
  categories: CelebrityCategory[]
  onCategoryToggle: (category: CelebrityCategory) => void
}

export function HeatmapControls({
  mode,
  onModeChange,
  categories,
  onCategoryToggle,
}: HeatmapControlsProps) {
  return (
    <div className="absolute top-4 left-4 z-[1000] space-y-3">
      {/* Mode Selector */}
      <div className="bg-card/95 backdrop-blur rounded-xl shadow-lg border p-3">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">
          분석 모드
        </p>
        <div className="flex flex-col gap-1.5">
          {modes.map((m) => (
            <Button
              key={m.value}
              variant={mode === m.value ? 'default' : 'ghost'}
              size="sm"
              className="justify-start gap-2 h-8 text-xs"
              onClick={() => onModeChange(m.value)}
            >
              <m.icon className="h-3.5 w-3.5" />
              {m.label}
            </Button>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">
          {modes.find((m) => m.value === mode)?.description}
        </p>
      </div>

      {/* Category Filter */}
      <div className="bg-card/95 backdrop-blur rounded-xl shadow-lg border p-3">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">
          카테고리 필터
        </p>
        <div className="flex flex-wrap gap-1.5">
          {allCategories.map((cat) => {
            const isActive = categories.includes(cat)
            return (
              <Badge
                key={cat}
                className={`cursor-pointer text-[10px] border transition-colors ${
                  isActive ? categoryActiveColors[cat] : categoryColors[cat]
                }`}
                onClick={() => onCategoryToggle(cat)}
              >
                {CATEGORY_LABELS[cat]}
              </Badge>
            )
          })}
        </div>
      </div>
    </div>
  )
}
