'use client'

import { Trophy, Medal } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils/format'
import type { PoliticalGroupStats } from '@/lib/politics/political-stats'

interface TopRankingsProps {
  progressive: PoliticalGroupStats
  conservative: PoliticalGroupStats
}

const MEDAL_COLORS = ['text-yellow-500', 'text-gray-400', 'text-amber-700', 'text-muted-foreground', 'text-muted-foreground']

function RankingList({ stats, color }: { stats: PoliticalGroupStats; color: 'blue' | 'red' }) {
  const borderColor = color === 'blue' ? 'border-blue-200 dark:border-blue-900' : 'border-red-200 dark:border-red-900'
  const titleColor = color === 'blue' ? 'text-blue-600' : 'text-red-500'
  const label = color === 'blue' ? '진보' : '보수'
  const bgHover = color === 'blue' ? 'hover:bg-blue-50 dark:hover:bg-blue-950/30' : 'hover:bg-red-50 dark:hover:bg-red-950/30'

  return (
    <Card className={borderColor}>
      <CardHeader className="pb-2">
        <CardTitle className={`flex items-center gap-2 text-base ${titleColor}`}>
          <Trophy className="h-5 w-5" />
          {label} TOP 5
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 px-4 pb-4">
        {stats.topByAsset.map((pol, i) => (
          <div
            key={pol.id}
            className={`flex items-center justify-between rounded-lg px-3 py-2 transition-colors ${bgHover}`}
          >
            <div className="flex items-center gap-3">
              <span className={`flex h-7 w-7 items-center justify-center ${i < 3 ? '' : 'text-sm text-muted-foreground'}`}>
                {i < 3 ? (
                  <Medal className={`h-5 w-5 ${MEDAL_COLORS[i]}`} />
                ) : (
                  <span className="font-mono">{i + 1}</span>
                )}
              </span>
              <div>
                <span className="font-medium">{pol.name}</span>
                {pol.party && (
                  <span className="ml-2 text-xs text-muted-foreground">{pol.party}</span>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="font-semibold">{formatPrice(pol.totalAsset)}</span>
              <span className="ml-2 text-xs text-muted-foreground">{pol.propertyCount}건</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function TopRankings({ progressive, conservative }: TopRankingsProps) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <RankingList stats={progressive} color="blue" />
      <RankingList stats={conservative} color="red" />
    </section>
  )
}
