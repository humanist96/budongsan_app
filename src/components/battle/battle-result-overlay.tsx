'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Share2, RotateCcw } from 'lucide-react'
import type { BattleCard, BattleResult } from '@/data/battle-data'

interface BattleResultOverlayProps {
  winner: 'A' | 'B' | 'draw'
  cardA: BattleCard
  cardB: BattleCard
  results: BattleResult[]
  onReset: () => void
}

export function BattleResultOverlay({ winner, cardA, cardB, results, onReset }: BattleResultOverlayProps) {
  const aWins = results.filter((r) => r.winner === 'A').length
  const bWins = results.filter((r) => r.winner === 'B').length

  const winnerCard = winner === 'A' ? cardA : winner === 'B' ? cardB : null
  const isDraw = winner === 'draw'

  const handleShare = async () => {
    const resultText = isDraw
      ? `${cardA.name} vs ${cardB.name} 부동산 배틀 결과: 무승부! (${aWins}:${bWins})`
      : `${cardA.name} vs ${cardB.name} 부동산 배틀 결과: ${winnerCard!.name} 승리! (${aWins}:${bWins})`

    const shareUrl = `${window.location.origin}/battle`

    if (navigator.share) {
      try {
        await navigator.share({ title: '셀럽 배틀카드', text: resultText, url: shareUrl })
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(`${resultText}\n${shareUrl}`)
    }
  }

  return (
    <Card className="animate-in fade-in zoom-in-95 duration-500">
      <CardContent className="p-6 text-center space-y-4">
        {isDraw ? (
          <>
            <span className="text-4xl">🤝</span>
            <h3 className="text-xl font-bold">무승부!</h3>
            <p className="text-muted-foreground text-sm">
              {cardA.name}과 {cardB.name}, 막상막하의 대결!
            </p>
          </>
        ) : (
          <>
            <span className="text-4xl animate-bounce">👑</span>
            <h3 className="text-xl font-bold">{winnerCard!.name} 승리!</h3>
            <p className="text-muted-foreground text-sm">
              6개 스탯 중 {Math.max(aWins, bWins)}개 항목에서 우세
            </p>
          </>
        )}

        <div className="flex items-center justify-center gap-4 text-2xl font-bold">
          <span className={winner === 'A' ? 'text-green-500' : 'text-muted-foreground'}>{aWins}</span>
          <span className="text-muted-foreground">:</span>
          <span className={winner === 'B' ? 'text-green-500' : 'text-muted-foreground'}>{bWins}</span>
        </div>

        <div className="flex gap-3 pt-2">
          <Button onClick={handleShare} className="flex-1 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white">
            <Share2 className="h-4 w-4 mr-1.5" />
            공유
          </Button>
          <Button onClick={onReset} variant="outline" className="flex-1">
            <RotateCcw className="h-4 w-4 mr-1.5" />
            다시 대결
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
