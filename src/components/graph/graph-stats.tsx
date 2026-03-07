'use client'

import { useMemo } from 'react'
import { Users, Building2, Link2, Crown, TrendingUp } from 'lucide-react'
import { computeGraphStats } from '@/lib/graph/build-graph'

export function GraphStats() {
  const stats = useMemo(() => computeGraphStats(), [])

  return (
    <div className="bg-background border rounded-lg shadow-lg overflow-hidden">
      <div className="flex items-center gap-2 p-3 border-b bg-muted/30">
        <TrendingUp className="h-4 w-4 text-pink-500" />
        <span className="font-semibold text-sm">관계망 통계</span>
      </div>

      <div className="p-3 space-y-3">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-2">
          <StatCard icon={Users} label="셀럽" value={stats.totalCelebs} />
          <StatCard icon={Building2} label="매물" value={stats.totalProperties} />
          <StatCard icon={Link2} label="관계" value={stats.totalLinks} />
        </div>

        {/* Average Separation */}
        <div className="flex items-center justify-between p-2 rounded bg-muted/50">
          <span className="text-xs text-muted-foreground">평균 분리도</span>
          <span className="text-sm font-bold text-pink-400">
            {stats.avgSeparation > 0 ? `${stats.avgSeparation}다리` : '—'}
          </span>
        </div>

        {/* Largest Component */}
        <div className="flex items-center justify-between p-2 rounded bg-muted/50">
          <span className="text-xs text-muted-foreground">최대 연결 그룹</span>
          <span className="text-sm font-bold text-blue-400">{stats.largestComponent}명</span>
        </div>

        {/* Top Connected Celebs */}
        {stats.topConnectedCelebs.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
              <Crown className="h-3 w-3" />
              이웃 많은 셀럽 TOP 5
            </h4>
            <div className="space-y-1">
              {stats.topConnectedCelebs.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2 text-xs p-1.5 rounded bg-muted/30">
                  <span className="font-bold text-muted-foreground w-4">{i + 1}</span>
                  <span className="font-medium flex-1">{item.name}</span>
                  <span className="text-pink-400">{item.connections}명</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Popular Properties */}
        {stats.topPopularProperties.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              셀럽 밀집 매물 TOP 5
            </h4>
            <div className="space-y-1">
              {stats.topPopularProperties.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2 text-xs p-1.5 rounded bg-muted/30">
                  <span className="font-bold text-muted-foreground w-4">{i + 1}</span>
                  <span className="font-medium flex-1 truncate">{item.name}</span>
                  <span className="text-blue-400">{item.residents}명</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users
  label: string
  value: number
}) {
  return (
    <div className="text-center p-2 rounded bg-muted/50">
      <Icon className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  )
}
