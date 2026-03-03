'use client'

import { DISTRICTS, getGradeColor } from '@/data/marble-data'
import type { PlayerState } from './use-marble-game'

interface MarblePlayerPanelProps {
  readonly player: PlayerState
  readonly isActive: boolean
  readonly totalAssetsFn: (p: PlayerState) => number
}

export function MarblePlayerPanel({ player, isActive, totalAssetsFn }: MarblePlayerPanelProps) {
  const propertyEntries = Object.entries(player.properties)
  const assets = totalAssetsFn(player)
  const isPlayer = player.id === 'player'

  return (
    <div
      className={`
        rounded-xl border-2 p-3 transition-all duration-300
        ${isActive
          ? isPlayer
            ? 'border-blue-500 bg-blue-500/5 shadow-lg shadow-blue-500/10'
            : 'border-red-500 bg-red-500/5 shadow-lg shadow-red-500/10'
          : 'border-border bg-card'
        }
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
              isPlayer ? 'bg-blue-500' : 'bg-red-500'
            }`}
          >
            {isPlayer ? 'P' : 'C'}
          </div>
          <span className="font-bold text-sm">{player.name}</span>
          {isActive && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary animate-pulse">
              내 차례
            </span>
          )}
        </div>
        {player.islandTurnsLeft > 0 && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
            무인도 {player.islandTurnsLeft}턴
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs mb-2">
        <div className="bg-muted/50 rounded-lg p-2 text-center">
          <div className="text-muted-foreground">현금</div>
          <div className="font-bold text-base">{player.money}억</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-2 text-center">
          <div className="text-muted-foreground">총자산</div>
          <div className="font-bold text-base">{assets}억</div>
        </div>
      </div>

      {propertyEntries.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] text-muted-foreground font-medium">보유 부동산</div>
          <div className="flex flex-wrap gap-1">
            {propertyEntries.map(([key, builtIndices]) => {
              const d = DISTRICTS[key]
              if (!d) return null
              return (
                <div
                  key={key}
                  className="text-[10px] px-1.5 py-0.5 rounded border bg-card flex items-center gap-1"
                >
                  <span className={`font-bold ${getGradeColor(d.grade)}`}>{d.grade}</span>
                  <span>{d.name}</span>
                  {builtIndices.length > 0 && (
                    <span className="text-yellow-500">
                      {'🏠'.repeat(builtIndices.length)}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {player.nextBuyHalf && (
        <div className="mt-2 text-[10px] text-amber-500 font-medium">
          다음 매수 반값!
        </div>
      )}

      {player.bankrupt && (
        <div className="mt-2 text-sm text-red-500 font-bold text-center">
          파산!
        </div>
      )}
    </div>
  )
}
