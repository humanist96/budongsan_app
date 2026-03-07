'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils/format'
import type { PoliticalGroupStats } from '@/lib/politics/political-stats'

interface ComparisonChartProps {
  progressive: PoliticalGroupStats
  conservative: PoliticalGroupStats
}

export function ComparisonChart({ progressive, conservative }: ComparisonChartProps) {
  const data = [
    {
      name: '평균 가격',
      진보: Math.round(progressive.avgPrice / 10000),
      보수: Math.round(conservative.avgPrice / 10000),
    },
    {
      name: '중위 가격',
      진보: Math.round(progressive.medianPrice / 10000),
      보수: Math.round(conservative.medianPrice / 10000),
    },
    {
      name: '최고가',
      진보: Math.round(progressive.maxPrice / 10000),
      보수: Math.round(conservative.maxPrice / 10000),
    },
    {
      name: '인당 총자산',
      진보: progressive.count > 0
        ? Math.round(progressive.totalAssetValue / progressive.count / 10000)
        : 0,
      보수: conservative.count > 0
        ? Math.round(conservative.totalAssetValue / conservative.count / 10000)
        : 0,
    },
  ]

  const countData = [
    {
      name: '총 매물',
      진보: progressive.totalProperties,
      보수: conservative.totalProperties,
    },
    {
      name: '인당 매물',
      진보: progressive.avgPropertiesPerPerson,
      보수: conservative.avgPropertiesPerPerson,
    },
  ]

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">가격 비교 (억원)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [`${value}억`, '']}
                contentStyle={{ borderRadius: '8px', fontSize: '13px' }}
              />
              <Legend />
              <Bar dataKey="진보" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="보수" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">매물 수 비교</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={countData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', fontSize: '13px' }}
              />
              <Legend />
              <Bar dataKey="진보" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="보수" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </section>
  )
}
