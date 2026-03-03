'use client'

import { useState, useEffect } from 'react'
import { BattleCard } from './battle-card'
import { BattleStatRow } from './battle-stat-row'
import { BattleResultOverlay } from './battle-result-overlay'
import { BATTLE_STATS, compareBattle, getOverallWinner } from '@/data/battle-data'
import type { BattleCard as BattleCardType, BattleResult } from '@/data/battle-data'

interface BattleArenaProps {
  cardA: BattleCardType
  cardB: BattleCardType
  onReset: () => void
}

export function BattleArena({ cardA, cardB, onReset }: BattleArenaProps) {
  const [cardsFlipped, setCardsFlipped] = useState(false)
  const [revealedStats, setRevealedStats] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const results = compareBattle(cardA, cardB)
  const overallWinner = getOverallWinner(results)

  useEffect(() => {
    const flipTimer = setTimeout(() => setCardsFlipped(true), 500)

    const statTimers = BATTLE_STATS.map((_, i) =>
      setTimeout(() => setRevealedStats(i + 1), 1200 + i * 300)
    )

    const resultTimer = setTimeout(
      () => setShowResult(true),
      1200 + BATTLE_STATS.length * 300 + 400
    )

    return () => {
      clearTimeout(flipTimer)
      statTimers.forEach(clearTimeout)
      clearTimeout(resultTimer)
    }
  }, [])

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Cards */}
      <div className="grid grid-cols-2 gap-4 items-start">
        <BattleCard
          card={cardA}
          flipped={cardsFlipped}
          isWinner={showResult && overallWinner === 'A'}
        />
        <BattleCard
          card={cardB}
          flipped={cardsFlipped}
          isWinner={showResult && overallWinner === 'B'}
        />
      </div>

      {/* VS badge */}
      <div className="flex justify-center">
        <span className="text-2xl font-black bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
          VS
        </span>
      </div>

      {/* Stats comparison */}
      <div className="space-y-1 bg-muted/30 rounded-xl p-3">
        {BATTLE_STATS.map((stat, i) => (
          <BattleStatRow
            key={stat.key}
            stat={stat}
            result={results[i]}
            revealed={i < revealedStats}
          />
        ))}
      </div>

      {/* Result overlay */}
      {showResult && (
        <BattleResultOverlay
          winner={overallWinner}
          cardA={cardA}
          cardB={cardB}
          results={results}
          onReset={onReset}
        />
      )}
    </div>
  )
}
