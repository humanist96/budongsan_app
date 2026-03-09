'use client'

import { useState, useCallback, useMemo } from 'react'
import { Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { WorldCupItem, TasteProfile } from '@/data/worldcup-data'
import { buildWorldCupItems, pickWorldCupSet, analyzeChoices, ROUND_LABELS } from '@/data/worldcup-data'
import { WorldCupMatch } from './worldcup-match'
import { WorldCupResult } from './worldcup-result'

type Phase = 'intro' | 'playing' | 'loading' | 'result'

export function WorldCupPage() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [items, setItems] = useState<WorldCupItem[]>([])
  const [currentRound, setCurrentRound] = useState<WorldCupItem[]>([])
  const [matchIndex, setMatchIndex] = useState(0)
  const [round, setRound] = useState(16)
  const [allChoices, setAllChoices] = useState<WorldCupItem[]>([])
  const [winner, setWinner] = useState<WorldCupItem | null>(null)
  const [profile, setProfile] = useState<TasteProfile | null>(null)

  const allItems = useMemo(() => buildWorldCupItems(), [])

  const handleStart = useCallback(() => {
    const selected = pickWorldCupSet(allItems, 16)
    setItems(selected)
    setCurrentRound(selected)
    setMatchIndex(0)
    setRound(selected.length)
    setAllChoices([])
    setWinner(null)
    setProfile(null)
    setPhase('playing')
  }, [allItems])

  const handleSelect = useCallback(
    (chosen: WorldCupItem) => {
      const newChoices = [...allChoices, chosen]
      setAllChoices(newChoices)

      const nextMatchIndex = matchIndex + 1
      const totalMatchesInRound = currentRound.length / 2

      if (nextMatchIndex < totalMatchesInRound) {
        setMatchIndex(nextMatchIndex)
        return
      }

      const winners = []
      for (let i = 0; i < currentRound.length; i += 2) {
        const a = currentRound[i]
        const b = currentRound[i + 1]
        const winner = newChoices.find((c) => c.propertyId === a.propertyId || c.propertyId === b.propertyId)
        if (winner) winners.push(winner)
      }

      if (winners.length === 1) {
        setWinner(winners[0])
        setPhase('loading')
        setTimeout(() => {
          const result = analyzeChoices(newChoices)
          setProfile(result)
          setPhase('result')
        }, 1500)
        return
      }

      setCurrentRound(winners)
      setMatchIndex(0)
      setRound(winners.length)
    },
    [allChoices, matchIndex, currentRound],
  )

  const handleRetry = useCallback(() => {
    setPhase('intro')
  }, [])

  if (phase === 'intro') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-12">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
          <Crown className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-center text-3xl font-black">
          부동산 이상형 월드컵
        </h1>
        <p className="max-w-md text-center text-muted-foreground">
          셀럽들의 매물 16개 중 당신의 드림하우스를 골라보세요!
          <br />
          토너먼트를 통해 취향을 분석해 드립니다.
        </p>
        <p className="text-sm text-muted-foreground">
          총 {allItems.length}개 매물 중 16개 랜덤 선별
        </p>
        <Button
          size="lg"
          className="gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 text-lg px-8 py-6"
          onClick={handleStart}
        >
          <Crown className="h-5 w-5" />
          16강 시작하기
        </Button>
      </div>
    )
  }

  if (phase === 'playing') {
    const totalMatches = currentRound.length / 2
    const a = currentRound[matchIndex * 2]
    const b = currentRound[matchIndex * 2 + 1]

    if (!a || !b) return null

    return (
      <div className="px-4 py-8">
        <WorldCupMatch
          round={round}
          matchIndex={matchIndex}
          totalMatches={totalMatches}
          itemA={a}
          itemB={b}
          onSelect={handleSelect}
        />
      </div>
    )
  }

  if (phase === 'loading') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
        <p className="animate-pulse text-lg font-semibold text-muted-foreground">
          취향 분석 중...
        </p>
      </div>
    )
  }

  if (phase === 'result' && winner && profile) {
    return (
      <div className="px-4 py-8">
        <WorldCupResult
          winner={winner}
          profile={profile}
          onRetry={handleRetry}
        />
      </div>
    )
  }

  return null
}
