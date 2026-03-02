'use client'

import { useEffect, useRef, useState } from 'react'
import type { DebateData } from '@/types/debate'
import { useDebateStore } from '@/stores/debate-store'
import { DebateHeader } from './debate-header'
import { DebatePhaseIndicator } from './debate-phase-indicator'
import { DebateMessage } from './debate-message'
import { DebateControls } from './debate-controls'
import { DebateVotePanel } from './debate-vote-panel'
import { DebateSummary } from './debate-summary'

function PhaseTransitionOverlay({ phaseName }: { phaseName: string }) {
  return (
    <div className="flex items-center justify-center py-6 my-2">
      <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-muted/80 backdrop-blur">
        <div className="h-px w-8 bg-border" />
        <span className="text-xs font-medium text-muted-foreground">
          {phaseName}
        </span>
        <div className="h-px w-8 bg-border" />
      </div>
    </div>
  )
}

interface DebatePageProps {
  data: DebateData
  slug: string
}

export function DebatePage({ data, slug }: DebatePageProps) {
  const {
    hasStarted,
    currentTurnIndex,
    isPlaying,
    isTypingComplete,
    revealedTurnIndices,
    showSummary,
    playbackSpeed,
    nextTurn,
    reset,
  } = useDebateStore()

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [showPhaseTransition, setShowPhaseTransition] = useState(false)
  const [transitionPhase, setTransitionPhase] = useState('')
  const prevPhaseRef = useRef<number | null>(null)
  const prevSlugRef = useRef(slug)

  // Reset store when slug changes
  useEffect(() => {
    if (prevSlugRef.current !== slug) {
      reset()
      prevSlugRef.current = slug
    }
  }, [slug, reset])

  // Auto-advance to next turn after typing completes
  useEffect(() => {
    if (!isPlaying || !isTypingComplete || showSummary) return

    // Check for phase transition
    const currentTurn = data.turns[currentTurnIndex]
    const nextIndex = currentTurnIndex + 1
    const nextTurnData =
      nextIndex < data.turns.length ? data.turns[nextIndex] : null

    if (nextTurnData && currentTurn.phaseId !== nextTurnData.phaseId) {
      const nextPhase = data.phases.find((p) => p.id === nextTurnData.phaseId)
      if (nextPhase) {
        setTransitionPhase(`Round ${nextPhase.id}: ${nextPhase.name}`)
        setShowPhaseTransition(true)
        const timer = setTimeout(() => {
          setShowPhaseTransition(false)
          nextTurnAction()
        }, 2000)
        return () => clearTimeout(timer)
      }
    }

    const delay = Math.max(400, 800 / playbackSpeed)
    const timer = setTimeout(nextTurnAction, delay)
    return () => clearTimeout(timer)
  }, [isPlaying, isTypingComplete, currentTurnIndex, showSummary, playbackSpeed])

  function nextTurnAction() {
    nextTurn()
  }

  // Track phase changes for transition overlay
  useEffect(() => {
    const currentTurn = data.turns[currentTurnIndex]
    if (currentTurn) {
      prevPhaseRef.current = currentTurn.phaseId
    }
  }, [currentTurnIndex, data.turns])

  if (!hasStarted) {
    return <DebateHeader data={data} />
  }

  if (showSummary) {
    return (
      <div className="pb-20">
        <DebatePhaseIndicator
          phases={data.phases}
          currentTurnNumber={50}
        />
        <DebateVotePanel checkpoint="final" data={data} slug={slug} />
        <DebateSummary data={data} />
        <DebateControls />
      </div>
    )
  }

  const currentTurn = data.turns[currentTurnIndex]
  const visibleTurns = data.turns.slice(0, currentTurnIndex + 1)

  // Determine which turns are in which phases for dividers
  let lastPhaseId = 0

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      <DebatePhaseIndicator
        phases={data.phases}
        currentTurnNumber={currentTurn.turnNumber}
      />

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 pb-32"
      >
        <div className="mx-auto max-w-2xl">
          {visibleTurns.map((turn, idx) => {
            const persona = data.personas.find(
              (p) => p.id === turn.speakerId
            )!
            const isActive = idx === currentTurnIndex
            const isRevealed = revealedTurnIndices.includes(idx)

            // Phase divider
            let phaseDivider = null
            if (turn.phaseId !== lastPhaseId) {
              const phase = data.phases.find(
                (p) => p.id === turn.phaseId
              )
              if (phase && turn.phaseId > 1) {
                phaseDivider = (
                  <PhaseTransitionOverlay
                    key={`phase-${phase.id}`}
                    phaseName={`Round ${phase.id}: ${phase.name}`}
                  />
                )
              }
              lastPhaseId = turn.phaseId
            }

            // Show vote at turn 25 midpoint
            const showMidVote = turn.turnNumber === 25 && isRevealed

            return (
              <div key={turn.turnNumber}>
                {phaseDivider}
                <DebateMessage
                  turnNumber={turn.turnNumber}
                  speakerId={turn.speakerId}
                  content={turn.content}
                  persona={persona}
                  isActive={isActive}
                  isRevealed={isRevealed}
                />
                {showMidVote && (
                  <DebateVotePanel
                    checkpoint="mid"
                    data={data}
                    slug={slug}
                  />
                )}
              </div>
            )
          })}

          {showPhaseTransition && (
            <div className="flex items-center justify-center py-8 animate-in fade-in duration-500">
              <div className="text-center">
                <div className="text-lg font-bold animate-pulse">
                  {transitionPhase}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <DebateControls />
    </div>
  )
}
