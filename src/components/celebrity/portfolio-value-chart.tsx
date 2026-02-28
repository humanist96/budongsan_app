'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils/format'
import type { CelebrityCategory } from '@/types'
import type { PortfolioDataPoint } from '@/data/timeline-helpers'

// ─── Config ─────────────────────────────────────────────────

const CATEGORY_CHART_COLORS: Record<CelebrityCategory, { stroke: string; fill: string }> = {
  entertainer: { stroke: '#ec4899', fill: 'url(#grad-entertainer)' },
  politician: { stroke: '#3b82f6', fill: 'url(#grad-politician)' },
  athlete: { stroke: '#10b981', fill: 'url(#grad-athlete)' },
  expert: { stroke: '#f59e0b', fill: 'url(#grad-expert)' },
}

// ─── Main Component ─────────────────────────────────────────

interface PortfolioValueChartProps {
  readonly dataPoints: PortfolioDataPoint[]
  readonly category: CelebrityCategory
}

export function PortfolioValueChart({
  dataPoints,
  category,
}: PortfolioValueChartProps) {
  if (dataPoints.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">포트폴리오 가치 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            차트를 표시하기에 데이터가 부족합니다.
          </p>
        </CardContent>
      </Card>
    )
  }

  const colors = CATEGORY_CHART_COLORS[category]

  // Convert value from 만원 to 억원 for display
  const chartData = dataPoints.map((dp) => ({
    ...dp,
    valueEok: Math.round(dp.value / 10000),
  }))

  // ReferenceDots for buy/sell events
  const eventDots = dataPoints
    .filter((dp) => dp.eventType)
    .map((dp, idx) => ({
      ...dp,
      valueEok: Math.round(dp.value / 10000),
      idx,
    }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">포트폴리오 가치 추이</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="grad-entertainer" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="grad-politician" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="grad-athlete" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="grad-expert" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10 }}
              tickFormatter={(v) => `${v}억`}
              width={55}
            />
            <Tooltip
              formatter={(value: number | undefined) => [`${value ?? 0}억원`, '포트폴리오']}
              labelFormatter={(label) => `시점: ${label}`}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--card)',
                fontSize: '12px',
              }}
            />
            <Area
              type="stepAfter"
              dataKey="valueEok"
              stroke={colors.stroke}
              fill={colors.fill}
              strokeWidth={2}
            />

            {eventDots.map((dot) => (
              <ReferenceDot
                key={`${dot.date}-${dot.idx}`}
                x={dot.date}
                y={dot.valueEok}
                r={5}
                fill={dot.eventType === 'buy' ? colors.stroke : '#ef4444'}
                stroke="white"
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
