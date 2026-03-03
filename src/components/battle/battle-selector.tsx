'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CATEGORY_LABELS } from '@/types'
import { TIER_CONFIG } from '@/data/battle-data'
import type { BattleCard } from '@/data/battle-data'
import { cn } from '@/lib/utils'

interface BattleSelectorProps {
  cards: BattleCard[]
  selectedId: string | null
  onSelect: (card: BattleCard) => void
  label: string
}

export function BattleSelector({ cards, selectedId, onSelect, label }: BattleSelectorProps) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return cards
    const q = search.trim().toLowerCase()
    return cards.filter((c) => c.name.toLowerCase().includes(q))
  }, [cards, search])

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">{label}</h3>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="셀럽 검색..."
          className="pl-9 h-9"
        />
      </div>

      <div className="max-h-[280px] overflow-y-auto space-y-1 pr-1">
        {filtered.map((card) => {
          const tier = TIER_CONFIG[card.tier]
          return (
            <button
              key={card.id}
              onClick={() => onSelect(card)}
              className={cn(
                'w-full flex items-center gap-2.5 p-2 rounded-lg text-left transition-colors',
                selectedId === card.id
                  ? 'bg-pink-50 dark:bg-pink-950/30 border border-pink-300 dark:border-pink-800'
                  : 'hover:bg-muted/50'
              )}
            >
              <div className="relative w-9 h-9 rounded-full overflow-hidden bg-muted flex-shrink-0">
                {card.profileImageUrl ? (
                  <Image
                    src={card.profileImageUrl}
                    alt={card.name}
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm font-bold text-muted-foreground">
                    {card.name[0]}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium truncate">{card.name}</span>
                  <span className={cn(
                    'text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white bg-gradient-to-r',
                    tier.color
                  )}>
                    {tier.label}
                  </span>
                </div>
                <Badge variant={card.category as 'entertainer' | 'politician' | 'athlete' | 'expert'} className="text-[9px] mt-0.5">
                  {CATEGORY_LABELS[card.category]}
                </Badge>
              </div>
            </button>
          )
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">검색 결과가 없습니다</p>
        )}
      </div>
    </div>
  )
}
