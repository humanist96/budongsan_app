'use client'

import { ROUND_LABELS } from '@/data/worldcup-data'

interface WorldCupProgressProps {
  round: number
  current: number
  total: number
}

export function WorldCupProgress({ round, current, total }: WorldCupProgressProps) {
  const percentage = Math.round((current / total) * 100)
  const label = ROUND_LABELS[round] ?? `${round}강`

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-sm font-medium">
        <span>{label}  {current} / {total}</span>
        <span className="text-muted-foreground">{percentage}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
