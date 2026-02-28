'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import type { Transaction } from '@/types'

interface PriceChartProps {
  transactions: Transaction[]
  propertyName: string
}

export function PriceChart({ transactions, propertyName }: PriceChartProps) {
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
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
