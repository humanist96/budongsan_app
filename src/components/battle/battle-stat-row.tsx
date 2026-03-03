'use client'

import { cn } from '@/lib/utils'
import type { BattleStat, BattleResult } from '@/data/battle-data'

interface BattleStatRowProps {
  stat: BattleStat
  result: BattleResult
  revealed: boolean
}

export function BattleStatRow({ stat, result, revealed }: BattleStatRowProps) {
  const isAWinner = result.winner === 'A'
  const isBWinner = result.winner === 'B'

  return (
    <div className={cn(
      'grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-2 px-3 rounded-lg transition-all duration-300',
      revealed ? 'opacity-100' : 'opacity-0 translate-y-2'
    )}>
      <div className={cn(
        'text-right font-mono text-sm transition-colors',
        revealed && isAWinner && 'text-green-500 font-bold',
        revealed && isBWinner && 'text-muted-foreground',
        revealed && result.winner === 'draw' && 'text-foreground',
      )}>
        {revealed ? stat.format(result.cardAValue) : '???'}
      </div>

      <div className="flex flex-col items-center min-w-[80px]">
        <span className="text-base">{stat.emoji}</span>
        <span className="text-[10px] text-muted-foreground leading-tight">{stat.label}</span>
      </div>

      <div className={cn(
        'text-left font-mono text-sm transition-colors',
        revealed && isBWinner && 'text-green-500 font-bold',
        revealed && isAWinner && 'text-muted-foreground',
        revealed && result.winner === 'draw' && 'text-foreground',
      )}>
        {revealed ? stat.format(result.cardBValue) : '???'}
      </div>
    </div>
  )
}
