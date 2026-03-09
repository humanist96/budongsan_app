'use client'

import { useState, useCallback } from 'react'
import type { WorldCupItem } from '@/data/worldcup-data'
import { WorldCupCard } from './worldcup-card'
import { WorldCupProgress } from './worldcup-progress'

interface WorldCupMatchProps {
  round: number
  matchIndex: number
  totalMatches: number
  itemA: WorldCupItem
  itemB: WorldCupItem
  onSelect: (winner: WorldCupItem) => void
}

export function WorldCupMatch({
  round,
  matchIndex,
  totalMatches,
  itemA,
  itemB,
  onSelect,
}: WorldCupMatchProps) {
  const [selected, setSelected] = useState<'left' | 'right' | null>(null)

  const handleSelect = useCallback(
    (side: 'left' | 'right') => {
      if (selected) return
      setSelected(side)
      const winner = side === 'left' ? itemA : itemB
      setTimeout(() => {
        onSelect(winner)
        setSelected(null)
      }, 600)
    },
    [selected, itemA, itemB, onSelect],
  )

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <WorldCupProgress
        round={round}
        current={matchIndex + 1}
        total={totalMatches}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <WorldCupCard
          item={itemA}
          side="left"
          selected={selected === 'left'}
          onSelect={() => handleSelect('left')}
        />

        <div className="flex items-center justify-center">
          <span className="rounded-full bg-gradient-to-br from-amber-400 to-orange-500 px-4 py-2 text-lg font-black text-white shadow-lg">
            VS
          </span>
        </div>

        <WorldCupCard
          item={itemB}
          side="right"
          selected={selected === 'right'}
          onSelect={() => handleSelect('right')}
        />
      </div>
    </div>
  )
}
