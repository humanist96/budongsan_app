'use client'

import type { DebatePhase } from '@/types/debate'
import { cn } from '@/lib/utils'

interface DebatePhaseIndicatorProps {
  phases: readonly DebatePhase[]
  currentTurnNumber: number
  intensity?: number
}

const PHASE_COLORS = [
  'bg-blue-500',
  'bg-teal-500',
  'bg-yellow-500',
  'bg-orange-500',
  'bg-red-500',
] as const

function IntensityHeatBar({ intensity }: { intensity: number }) {
  const percentage = (intensity / 10) * 100

  const getColor = (level: number) => {
    if (level <= 3) return 'from-blue-400 to-teal-400'
    if (level <= 5) return 'from-teal-400 to-yellow-400'
    if (level <= 7) return 'from-yellow-400 to-orange-400'
    return 'from-orange-400 to-red-500'
  }

  const getLabel = (level: number) => {
    if (level <= 2) return '잔잔'
    if (level <= 4) return '논쟁 중'
    if (level <= 6) return '과열'
    if (level <= 8) return '격돌'
    return '폭발'
  }

  return (
    <div className="flex items-center gap-2 mt-1.5">
      <span className="text-[10px] text-muted-foreground w-10 shrink-0">열기</span>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full bg-gradient-to-r transition-all duration-500',
            getColor(intensity),
            intensity >= 8 && 'animate-pulse'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className={cn(
        'text-[10px] font-medium w-12 text-right shrink-0',
        intensity <= 3 && 'text-blue-500',
        intensity > 3 && intensity <= 5 && 'text-yellow-500',
        intensity > 5 && intensity <= 7 && 'text-orange-500',
        intensity > 7 && 'text-red-500',
      )}>
        {getLabel(intensity)}
      </span>
    </div>
  )
}

export function DebatePhaseIndicator({
  phases,
  currentTurnNumber,
  intensity = 1,
}: DebatePhaseIndicatorProps) {
  const currentPhase = phases.find(
    (p) =>
      currentTurnNumber >= p.turnRange[0] &&
      currentTurnNumber <= p.turnRange[1]
  )

  return (
    <div className="px-4 py-3 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-2xl">
        <div className="flex gap-1 mb-2">
          {phases.map((phase, i) => {
            const isActive = currentPhase?.id === phase.id
            const isPast = currentTurnNumber > phase.turnRange[1]

            return (
              <div
                key={phase.id}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-all duration-300',
                  isPast || isActive ? PHASE_COLORS[i] : 'bg-muted',
                  isActive && 'animate-pulse'
                )}
              />
            )
          })}
        </div>

        {currentPhase && (
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium">
              Round {currentPhase.id}: {currentPhase.name}
            </span>
            <span className="text-muted-foreground">
              {currentPhase.description}
            </span>
          </div>
        )}

        <IntensityHeatBar intensity={intensity} />
      </div>
    </div>
  )
}
