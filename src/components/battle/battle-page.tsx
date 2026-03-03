'use client'

import { useState, useMemo, useCallback } from 'react'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BattleDailyBanner } from './battle-daily-banner'
import { BattleSelector } from './battle-selector'
import { BattleArena } from './battle-arena'
import { getAllBattleCards, getDailyBattle } from '@/data/battle-data'
import type { BattleCard } from '@/data/battle-data'

type Phase = 'select' | 'battle'

export function BattlePage() {
  const [phase, setPhase] = useState<Phase>('select')
  const [selectedA, setSelectedA] = useState<BattleCard | null>(null)
  const [selectedB, setSelectedB] = useState<BattleCard | null>(null)
  const [battleKey, setBattleKey] = useState(0)

  const allCards = useMemo(() => getAllBattleCards(), [])
  const dailyBattle = useMemo(() => getDailyBattle(), [])

  const handleDailyBattle = useCallback(() => {
    setSelectedA(dailyBattle.cardA)
    setSelectedB(dailyBattle.cardB)
    setBattleKey((k) => k + 1)
    setPhase('battle')
  }, [dailyBattle])

  const handleStartBattle = useCallback(() => {
    if (selectedA && selectedB) {
      setBattleKey((k) => k + 1)
      setPhase('battle')
    }
  }, [selectedA, selectedB])

  const handleReset = useCallback(() => {
    setPhase('select')
    setSelectedA(null)
    setSelectedB(null)
  }, [])

  const handleSelectA = useCallback((card: BattleCard) => {
    setSelectedA(card)
  }, [])

  const handleSelectB = useCallback((card: BattleCard) => {
    setSelectedB(card)
  }, [])

  const cardsForA = useMemo(
    () => allCards.filter((c) => c.id !== selectedB?.id),
    [allCards, selectedB]
  )

  const cardsForB = useMemo(
    () => allCards.filter((c) => c.id !== selectedA?.id),
    [allCards, selectedA]
  )

  if (phase === 'battle' && selectedA && selectedB) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <BattleArena
          key={battleKey}
          cardA={selectedA}
          cardB={selectedB}
          onReset={handleReset}
        />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-3">
          <Zap className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold">셀럽 배틀카드</h1>
        <p className="text-sm text-muted-foreground mt-1">부동산 스탯으로 셀럽 1:1 대결!</p>
      </div>

      {/* Daily battle banner */}
      <BattleDailyBanner dailyBattle={dailyBattle} onClick={handleDailyBattle} />

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BattleSelector
          cards={cardsForA}
          selectedId={selectedA?.id ?? null}
          onSelect={handleSelectA}
          label="셀럽 A 선택"
        />
        <BattleSelector
          cards={cardsForB}
          selectedId={selectedB?.id ?? null}
          onSelect={handleSelectB}
          label="셀럽 B 선택"
        />
      </div>

      {/* Start button */}
      <Button
        onClick={handleStartBattle}
        disabled={!selectedA || !selectedB}
        size="lg"
        className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white disabled:opacity-50"
      >
        <Zap className="h-5 w-5 mr-2" />
        대결 시작!
      </Button>
    </div>
  )
}
