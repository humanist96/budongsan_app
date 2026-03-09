'use client'

import Image from 'next/image'
import { PROPERTY_TYPE_LABELS } from '@/types/property'
import { formatPrice, formatArea } from '@/lib/utils/format'
import type { WorldCupItem } from '@/data/worldcup-data'
import { cn } from '@/lib/utils'

interface WorldCupCardProps {
  item: WorldCupItem
  side: 'left' | 'right'
  selected: boolean
  onSelect: () => void
}

export function WorldCupCard({ item, side, selected, onSelect }: WorldCupCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'group relative flex flex-col items-center gap-3 rounded-2xl border-2 bg-card p-5 text-card-foreground transition-all duration-300',
        'hover:scale-[1.02] hover:ring-2 hover:ring-amber-400 hover:border-amber-400',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400',
        selected && 'scale-105 ring-4 ring-amber-500 border-amber-500 animate-pulse',
        !selected && 'border-border',
        side === 'left' ? 'origin-right' : 'origin-left',
      )}
    >
      <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-muted">
        {item.profileImageUrl ? (
          <Image
            src={item.profileImageUrl}
            alt={item.celebrityName}
            fill
            className="object-cover"
            sizes="80px"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-xl font-bold">
            {item.celebrityName[0]}
          </div>
        )}
      </div>

      <p className="text-base font-bold">{item.celebrityName}</p>

      <div className="w-full space-y-1.5 text-sm">
        <p className="font-semibold text-center truncate">{item.propertyName}</p>

        <div className="flex flex-col gap-1 text-muted-foreground text-xs">
          <span>🏷️ {PROPERTY_TYPE_LABELS[item.propertyType]}</span>
          <span>📍 {item.district}</span>
          {(item.currentValue ?? item.price) !== null && (
            <span>💰 {formatPrice((item.currentValue ?? item.price)!)}</span>
          )}
          {item.exclusiveArea !== null && (
            <span>📐 {formatArea(item.exclusiveArea)}</span>
          )}
        </div>

        {item.highlight && (
          <p className="mt-2 rounded-lg bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300 text-center">
            ✨ {item.highlight}
          </p>
        )}
      </div>

      <div className="mt-auto pt-2 text-sm font-semibold text-amber-600 dark:text-amber-400 group-hover:underline">
        선택 👆
      </div>
    </button>
  )
}
