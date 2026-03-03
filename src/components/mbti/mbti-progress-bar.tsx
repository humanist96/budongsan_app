'use client'

import { cn } from '@/lib/utils'

interface MbtiProgressBarProps {
  current: number
  total: number
}

export function MbtiProgressBar({ current, total }: MbtiProgressBarProps) {
  const percentage = Math.round((current / total) * 100)

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{current} / {total}</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500 transition-all duration-500 ease-out'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
