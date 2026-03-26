'use client'

import { BarChart3, Users, Building2, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { GuStats } from '@/lib/geo/spatial-analysis'
import { formatPrice } from '@/lib/utils'

interface HeatmapInsightsProps {
  guStats: GuStats[]
  visible: boolean
  onToggle: () => void
}

export function HeatmapInsights({ guStats, visible, onToggle }: HeatmapInsightsProps) {
  const topByCount = guStats.slice(0, 5)
  const topByValue = [...guStats].sort((a, b) => b.avgAssetValue - a.avgAssetValue).slice(0, 5)

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute top-4 right-4 z-[1000] bg-card/95 backdrop-blur rounded-lg shadow-lg border p-2.5 hover:bg-accent transition-colors"
        title="인사이트 패널"
      >
        <BarChart3 className="h-4 w-4" />
      </button>

      {/* Insights Panel */}
      {visible && (
        <div className="absolute top-14 right-4 z-[1000] w-72 max-h-[calc(100vh-200px)] overflow-y-auto bg-card/95 backdrop-blur rounded-xl shadow-lg border">
          <div className="p-3 border-b">
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4 text-pink-500" />
              구별 분석 인사이트
            </h3>
          </div>

          {/* Top by Celebrity Count */}
          <div className="p-3 border-b">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2 flex items-center gap-1">
              <Users className="h-3 w-3" />
              셀럽 밀집 TOP 5
            </p>
            <div className="space-y-1.5">
              {topByCount.map((gu, i) => (
                <div key={gu.gu} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-pink-500/10 flex items-center justify-center text-[10px] font-bold text-pink-600">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium truncate">{gu.gu}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {gu.celebrityCount}명
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1 mt-0.5">
                      <div
                        className="bg-pink-500 rounded-full h-1 transition-all"
                        style={{ width: `${(gu.celebrityCount / topByCount[0].celebrityCount) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top by Average Price */}
          <div className="p-3 border-b">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              평균 매물가 TOP 5
            </p>
            <div className="space-y-1.5">
              {topByValue.map((gu, i) => (
                <div key={gu.gu} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center text-[10px] font-bold text-amber-600">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium truncate">{gu.gu}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatPrice(gu.avgAssetValue)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="p-3">
            <div className="grid grid-cols-2 gap-2">
              <Card>
                <CardContent className="p-2 text-center">
                  <Building2 className="h-3.5 w-3.5 mx-auto text-blue-500 mb-1" />
                  <p className="text-lg font-bold">{guStats.length}</p>
                  <p className="text-[10px] text-muted-foreground">분석 지역</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-2 text-center">
                  <Users className="h-3.5 w-3.5 mx-auto text-pink-500 mb-1" />
                  <p className="text-lg font-bold">
                    {guStats.reduce((sum, g) => sum + g.celebrityCount, 0)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">총 셀럽 수</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
