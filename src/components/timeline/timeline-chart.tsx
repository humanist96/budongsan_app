'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { YearSummary } from '@/data/timeline-data'

interface TimelineChartProps {
  readonly data: YearSummary[]
  readonly selectedYear: number
  readonly onYearSelect: (year: number) => void
}

export function TimelineChart({
  data,
  selectedYear,
  onYearSelect,
}: TimelineChartProps) {
  const chartData = data.map((d) => ({
    year: d.year,
    label: `${d.year}`,
    매입: d.buyCount,
    매도: d.sellCount,
  }))

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">연도별 거래 현황</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <div className="min-w-[600px]">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={chartData}
                onClick={(state) => {
                  if (state?.activeLabel) {
                    onYearSelect(parseInt(String(state.activeLabel), 10))
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                />
                <YAxis tick={{ fontSize: 10 }} width={30} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--card)',
                    fontSize: '12px',
                  }}
                  formatter={(value, name) => [
                    `${value ?? 0}건`,
                    String(name ?? ''),
                  ]}
                  labelFormatter={(label) => `${label}년`}
                />
                <Bar dataKey="매입" stackId="a" radius={[0, 0, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell
                      key={`buy-${entry.year}`}
                      fill={entry.year === selectedYear ? '#2563eb' : '#93c5fd'}
                      cursor="pointer"
                    />
                  ))}
                </Bar>
                <Bar dataKey="매도" stackId="a" radius={[2, 2, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell
                      key={`sell-${entry.year}`}
                      fill={entry.year === selectedYear ? '#dc2626' : '#fca5a5'}
                      cursor="pointer"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground justify-center">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-blue-400 inline-block" /> 매입
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-red-400 inline-block" /> 매도
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
