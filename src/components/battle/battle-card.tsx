'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { CATEGORY_LABELS } from '@/types'
import { TIER_CONFIG } from '@/data/battle-data'
import type { BattleCard as BattleCardType } from '@/data/battle-data'

interface BattleCardProps {
  card: BattleCardType
  flipped: boolean
  isWinner?: boolean
}

export function BattleCard({ card, flipped, isWinner }: BattleCardProps) {
  const tierConfig = TIER_CONFIG[card.tier]

  return (
    <div
      className={cn(
        'relative w-full max-w-[200px] aspect-[3/4] mx-auto cursor-pointer',
        '[perspective:800px]'
      )}
    >
      <div
        className={cn(
          'relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]',
          flipped && '[transform:rotateY(180deg)]'
        )}
      >
        {/* Back face */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-pink-500 to-violet-600 [backface-visibility:hidden] flex flex-col items-center justify-center p-4 shadow-lg border-2 border-pink-400/30">
          <span className="text-4xl mb-2">?</span>
          <span className="text-white/80 text-sm font-medium">셀럽맵</span>
        </div>

        {/* Front face */}
        <div
          className={cn(
            'absolute inset-0 rounded-xl bg-card border-2 [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden shadow-lg',
            isWinner && 'border-yellow-400 ring-2 ring-yellow-400/50'
          )}
        >
          {/* Tier badge */}
          <div className={cn(
            'absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-gradient-to-br text-white flex items-center justify-center text-xs font-bold shadow-md',
            tierConfig.color
          )}>
            {tierConfig.label}
          </div>

          {/* Winner crown */}
          {isWinner && (
            <div className="absolute top-2 left-2 z-10 text-xl animate-bounce">
              👑
            </div>
          )}

          {/* Profile image */}
          <div className="relative w-full h-[55%] bg-muted">
            {card.profileImageUrl ? (
              <Image
                src={card.profileImageUrl}
                alt={card.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-muted-foreground">
                {card.name[0]}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-3 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm truncate">{card.name}</span>
            </div>
            <Badge variant={card.category as 'entertainer' | 'politician' | 'athlete' | 'expert'} className="text-[10px]">
              {CATEGORY_LABELS[card.category]}
            </Badge>
            <p className="text-[10px] text-muted-foreground truncate">{card.subCategory}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
