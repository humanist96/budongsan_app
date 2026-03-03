'use client'

import { Zap, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { DailyBattle } from '@/data/battle-data'

interface BattleDailyBannerProps {
  dailyBattle: DailyBattle
  onClick: () => void
}

export function BattleDailyBanner({ dailyBattle, onClick }: BattleDailyBannerProps) {
  return (
    <Card
      className="cursor-pointer bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-amber-200 dark:border-amber-800 hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center flex-shrink-0">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-amber-600 dark:text-amber-400">오늘의 대결</p>
          <p className="font-bold text-sm truncate">
            {dailyBattle.cardA.name} vs {dailyBattle.cardB.name}
          </p>
        </div>
        <ChevronRight className="h-5 w-5 text-amber-500 flex-shrink-0" />
      </CardContent>
    </Card>
  )
}
