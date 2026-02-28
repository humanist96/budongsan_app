'use client'

import { Filter, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useFilterStore } from '@/stores/map-store'
import { CATEGORY_LABELS, type CelebrityCategory } from '@/types'

const categories: CelebrityCategory[] = ['entertainer', 'politician', 'athlete', 'expert']

export function MapFilterPanel() {
  const {
    categories: selectedCategories,
    multiOwnerOnly,
    toggleCategory,
    setMultiOwnerOnly,
    resetFilters,
  } = useFilterStore()

  return (
    <div className="absolute top-4 left-4 z-10 bg-card/95 backdrop-blur rounded-lg shadow-lg border p-3 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">필터</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={resetFilters}>
          <RotateCcw className="h-3 w-3" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {categories.map((category) => {
          const isActive = selectedCategories.includes(category)
          return (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className="transition-opacity"
            >
              <Badge
                variant={isActive ? category : 'outline'}
                className={!isActive ? 'opacity-50' : ''}
              >
                {CATEGORY_LABELS[category]}
              </Badge>
            </button>
          )
        })}
      </div>

      <button
        onClick={() => setMultiOwnerOnly(!multiOwnerOnly)}
        className="flex items-center gap-2 w-full"
      >
        <div
          className={`w-8 h-5 rounded-full transition-colors relative ${
            multiOwnerOnly ? 'bg-red-500' : 'bg-muted'
          }`}
        >
          <div
            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
              multiOwnerOnly ? 'translate-x-3.5' : 'translate-x-0.5'
            }`}
          />
        </div>
        <span className="text-xs font-medium">다주택자만 보기</span>
      </button>
    </div>
  )
}
