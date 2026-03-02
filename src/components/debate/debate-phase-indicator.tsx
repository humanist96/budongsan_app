'use client'

import type { DebatePhase } from '@/types/debate'
import { cn } from '@/lib/utils'

interface DebatePhaseIndicatorProps {
  phases: readonly DebatePhase[]
  currentTurnNumber: number
}

const PHASE_COLORS = [
  'bg-blue-500',
  'bg-teal-500',
  'bg-yellow-500',
  'bg-orange-500',
  'bg-red-500',
] as const

export function DebatePhaseIndicator({
  phases,
  currentTurnNumber,
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
      </div>
    </div>
  )
}
