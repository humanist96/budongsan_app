'use client'

import { useState } from 'react'
import { Network, Users, MapPin, Search, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CelebrityCategory } from '@/types'
import { CATEGORY_LABELS } from '@/types/celebrity'
import type { PoliticalLeaning } from '@/data/celebrity-seed-data'
import { getAllCelebrities } from '@/lib/graph/build-graph'

// ─── Types ──────────────────────────────────────────────────

export type ViewMode = 'bipartite' | 'celeb-network' | 'neighborhood'

interface GraphControlsProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  categoryFilter: CelebrityCategory[]
  onCategoryFilterChange: (categories: CelebrityCategory[]) => void
  politicalFilter: PoliticalLeaning[]
  onPoliticalFilterChange: (leanings: PoliticalLeaning[]) => void
  onSearchSelect: (celebId: string) => void
  forceStrength: number
  onForceStrengthChange: (value: number) => void
}

// ─── Constants ──────────────────────────────────────────────

const VIEW_MODES: { mode: ViewMode; label: string; icon: typeof Network; desc: string }[] = [
  { mode: 'bipartite', label: '전체 관계망', icon: Network, desc: '셀럽 + 매물' },
  { mode: 'celeb-network', label: '셀럽 네트워크', icon: Users, desc: '공유 매물 기반' },
  { mode: 'neighborhood', label: '동네 클러스터', icon: MapPin, desc: '동 단위 그룹' },
]

const CATEGORIES: CelebrityCategory[] = ['entertainer', 'politician', 'athlete', 'expert']

const CATEGORY_BUTTON_COLORS: Record<CelebrityCategory, string> = {
  entertainer: 'bg-pink-500/20 text-pink-400 border-pink-500/50',
  politician: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  athlete: 'bg-green-500/20 text-green-400 border-green-500/50',
  expert: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
}

const CATEGORY_ACTIVE_COLORS: Record<CelebrityCategory, string> = {
  entertainer: 'bg-pink-500 text-white border-pink-500',
  politician: 'bg-blue-500 text-white border-blue-500',
  athlete: 'bg-green-500 text-white border-green-500',
  expert: 'bg-purple-500 text-white border-purple-500',
}

const POLITICAL_LEANINGS: { value: PoliticalLeaning; label: string; color: string; activeColor: string }[] = [
  {
    value: 'progressive',
    label: '진보',
    color: 'bg-blue-600/20 text-blue-300 border-blue-600/50',
    activeColor: 'bg-blue-600 text-white border-blue-600',
  },
  {
    value: 'conservative',
    label: '보수',
    color: 'bg-red-500/20 text-red-300 border-red-500/50',
    activeColor: 'bg-red-500 text-white border-red-500',
  },
]

// ─── Component ──────────────────────────────────────────────

export function GraphControls({
  viewMode,
  onViewModeChange,
  categoryFilter,
  onCategoryFilterChange,
  politicalFilter,
  onPoliticalFilterChange,
  onSearchSelect,
  forceStrength,
  onForceStrengthChange,
}: GraphControlsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const allCelebs = getAllCelebrities()
  const filtered = searchQuery.length >= 1
    ? allCelebs.filter((c) => c.name.includes(searchQuery)).slice(0, 8)
    : []

  const toggleCategory = (cat: CelebrityCategory) => {
    if (categoryFilter.includes(cat)) {
      const next = categoryFilter.filter((c) => c !== cat)
      onCategoryFilterChange(next.length === 0 ? CATEGORIES : next)
    } else {
      onCategoryFilterChange([...categoryFilter, cat])
    }
  }

  const togglePolitical = (leaning: PoliticalLeaning) => {
    if (politicalFilter.includes(leaning)) {
      const next = politicalFilter.filter((l) => l !== leaning)
      onPoliticalFilterChange(next)
    } else {
      onPoliticalFilterChange([...politicalFilter, leaning])
    }
  }

  const allSelected = categoryFilter.length === CATEGORIES.length
  const showPoliticalFilter = categoryFilter.includes('politician')

  return (
    <div className="flex flex-col gap-3">
      {/* View Mode Toggle */}
      <div className="flex flex-wrap gap-1.5">
        {VIEW_MODES.map(({ mode, label, icon: Icon }) => (
          <Button
            key={mode}
            variant={viewMode === mode ? 'default' : 'outline'}
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => onViewModeChange(mode)}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </Button>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-1.5 items-center">
        <Button
          variant="outline"
          size="sm"
          className={`text-xs ${allSelected ? 'bg-foreground/10' : ''}`}
          onClick={() => onCategoryFilterChange(CATEGORIES)}
        >
          전체
        </Button>
        {CATEGORIES.map((cat) => {
          const active = categoryFilter.includes(cat)
          return (
            <button
              key={cat}
              className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                active ? CATEGORY_ACTIVE_COLORS[cat] : CATEGORY_BUTTON_COLORS[cat]
              }`}
              onClick={() => toggleCategory(cat)}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          )
        })}

        {/* Political Leaning Filter (정치인 선택 시 표시) */}
        {showPoliticalFilter && (
          <>
            <span className="text-muted-foreground text-xs mx-0.5">|</span>
            {POLITICAL_LEANINGS.map(({ value, label, color, activeColor }) => {
              const active = politicalFilter.includes(value)
              return (
                <button
                  key={value}
                  className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                    active ? activeColor : color
                  }`}
                  onClick={() => togglePolitical(value)}
                >
                  {label}
                </button>
              )
            })}
          </>
        )}
      </div>

      {/* Search + Settings Row */}
      <div className="flex gap-1.5">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs flex-1"
          onClick={() => setShowSearch(!showSearch)}
        >
          <Search className="h-3.5 w-3.5" />
          셀럽 검색
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={() => setShowSettings(!showSettings)}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Search Panel */}
      {showSearch && (
        <div className="relative">
          <input
            type="text"
            placeholder="셀럽 이름 입력..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-pink-500/50"
          />
          {filtered.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
              {filtered.map((c) => (
                <button
                  key={c.id}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-muted flex items-center gap-2"
                  onClick={() => {
                    onSearchSelect(c.id)
                    setSearchQuery('')
                    setShowSearch(false)
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getCategoryColor(c.category, c.politicalLeaning) }}
                  />
                  {c.name}
                  <span className="text-xs text-muted-foreground ml-auto">
                    {c.party ?? CATEGORY_LABELS[c.category]}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Force Strength Slider */}
      {showSettings && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground whitespace-nowrap">배치 세기</span>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={forceStrength}
            onChange={(e) => onForceStrengthChange(parseFloat(e.target.value))}
            className="flex-1 accent-pink-500"
          />
          <span className="text-muted-foreground w-8 text-right">{forceStrength.toFixed(1)}</span>
        </div>
      )}
    </div>
  )
}

function getCategoryColor(category: CelebrityCategory, politicalLeaning?: PoliticalLeaning): string {
  if (category === 'politician' && politicalLeaning) {
    return politicalLeaning === 'progressive' ? '#2563eb' : '#ef4444'
  }
  const colors: Record<CelebrityCategory, string> = {
    entertainer: '#ec4899',
    politician: '#3b82f6',
    athlete: '#22c55e',
    expert: '#a855f7',
  }
  return colors[category]
}
