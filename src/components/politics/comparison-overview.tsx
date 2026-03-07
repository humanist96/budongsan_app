'use client'

import { Home, TrendingUp, Crown, UserCheck, Wallet, BarChart3 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils/format'
import type { PoliticalGroupStats } from '@/lib/politics/political-stats'

interface ComparisonOverviewProps {
  progressive: PoliticalGroupStats
  conservative: PoliticalGroupStats
}

interface MetricRow {
  label: string
  icon: React.ElementType
  progValue: string
  consValue: string
  progRaw: number
  consRaw: number
}

export function ComparisonOverview({ progressive, conservative }: ComparisonOverviewProps) {
  const metrics: MetricRow[] = [
    {
      label: '총 매물',
      icon: Home,
      progValue: `${progressive.totalProperties}건`,
      consValue: `${conservative.totalProperties}건`,
      progRaw: progressive.totalProperties,
      consRaw: conservative.totalProperties,
    },
    {
      label: '평균 가격',
      icon: TrendingUp,
      progValue: formatPrice(progressive.avgPrice),
      consValue: formatPrice(conservative.avgPrice),
      progRaw: progressive.avgPrice,
      consRaw: conservative.avgPrice,
    },
    {
      label: '최고가',
      icon: Crown,
      progValue: formatPrice(progressive.maxPrice),
      consValue: formatPrice(conservative.maxPrice),
      progRaw: progressive.maxPrice,
      consRaw: conservative.maxPrice,
    },
    {
      label: '인당 평균',
      icon: UserCheck,
      progValue: `${progressive.avgPropertiesPerPerson}건`,
      consValue: `${conservative.avgPropertiesPerPerson}건`,
      progRaw: progressive.avgPropertiesPerPerson,
      consRaw: conservative.avgPropertiesPerPerson,
    },
    {
      label: '총 자산',
      icon: Wallet,
      progValue: formatPrice(progressive.totalAssetValue),
      consValue: formatPrice(conservative.totalAssetValue),
      progRaw: progressive.totalAssetValue,
      consRaw: conservative.totalAssetValue,
    },
    {
      label: '중위 가격',
      icon: BarChart3,
      progValue: formatPrice(progressive.medianPrice),
      consValue: formatPrice(conservative.medianPrice),
      progRaw: progressive.medianPrice,
      consRaw: conservative.medianPrice,
    },
  ]

  return (
    <section>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Progressive side */}
        <Card className="border-blue-200 dark:border-blue-900">
          <CardContent className="p-5">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-blue-600">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs dark:bg-blue-900">🔵</span>
              진보
            </h3>
            <div className="space-y-3">
              {metrics.map((m) => {
                const isHigher = m.progRaw > m.consRaw
                return (
                  <div key={m.label} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <m.icon className="h-4 w-4" />
                      {m.label}
                    </span>
                    <span className={`font-semibold ${isHigher ? 'text-blue-600' : ''}`}>
                      {m.progValue}
                      {isHigher && <span className="ml-1 text-xs">▲</span>}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Conservative side */}
        <Card className="border-red-200 dark:border-red-900">
          <CardContent className="p-5">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-red-500">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs dark:bg-red-900">🔴</span>
              보수
            </h3>
            <div className="space-y-3">
              {metrics.map((m) => {
                const isHigher = m.consRaw > m.progRaw
                return (
                  <div key={m.label} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <m.icon className="h-4 w-4" />
                      {m.label}
                    </span>
                    <span className={`font-semibold ${isHigher ? 'text-red-500' : ''}`}>
                      {m.consValue}
                      {isHigher && <span className="ml-1 text-xs">▲</span>}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
