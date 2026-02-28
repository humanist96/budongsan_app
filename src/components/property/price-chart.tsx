'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  Label,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import type { Transaction } from '@/types'

export interface AcquisitionMarker {
  readonly celebrityName: string
  readonly date: string // 'YYYY-MM'
  readonly price: number | null
}

interface PriceChartProps {
  transactions: Transaction[]
  propertyName: string
  acquisitionMarkers?: AcquisitionMarker[]
}

export function PriceChart({ transactions, propertyName, acquisitionMarkers = [] }: PriceChartProps) {
  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">실거래가 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            거래 이력이 없습니다.
          </p>
        </CardContent>
      </Card>
    )
  }

  const chartData = transactions.map((t) => ({
    date: `${t.transaction_year}.${String(t.transaction_month).padStart(2, '0')}`,
    price: t.transaction_amount,
    floor: t.floor,
  }))

  // Match acquisition markers to the closest chart data point
  const markerDots = acquisitionMarkers
    .filter((m) => m.price)
    .map((marker) => {
      const markerDate = marker.date.replace('-', '.')
      // Find closest date in chart data
      const exactMatch = chartData.find((d) => d.date === markerDate)
      if (exactMatch) {
        return { x: exactMatch.date, y: exactMatch.price, label: `${marker.celebrityName} 매입 ${formatPrice(marker.price!)}원` }
      }
      // If no exact match, place on the chart using marker price
      return { x: markerDate, y: marker.price!, label: `${marker.celebrityName} 매입 ${formatPrice(marker.price!)}원` }
    })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">실거래가 추이 - {propertyName}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => formatPrice(value)}
              width={70}
            />
            <Tooltip
              formatter={(value: number | undefined) => [`${formatPrice(value ?? 0)}원`, '거래가']}
              labelFormatter={(label) => `거래일: ${label}`}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--card)',
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={{ fill: 'var(--chart-1)', r: 4 }}
              activeDot={{ r: 6 }}
            />
            {markerDots.map((dot) => (
              <ReferenceDot
                key={dot.label}
                x={dot.x}
                y={dot.y}
                r={7}
                fill="#f59e0b"
                stroke="white"
                strokeWidth={2}
              >
                <Label
                  value={dot.label}
                  position="top"
                  offset={10}
                  style={{ fontSize: 10, fill: 'var(--foreground)' }}
                />
              </ReferenceDot>
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
