'use client'

import { PieChart as PieChartIcon } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PROPERTY_TYPE_LABELS } from '@/types/property'
import type { PoliticalGroupStats } from '@/lib/politics/political-stats'

interface PropertyDistributionProps {
  progressive: PoliticalGroupStats
  conservative: PoliticalGroupStats
}

const PIE_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6b7280']

function toChartData(distribution: Record<string, number>) {
  return Object.entries(distribution)
    .map(([key, value]) => ({
      name: PROPERTY_TYPE_LABELS[key as keyof typeof PROPERTY_TYPE_LABELS] ?? key,
      value,
    }))
    .sort((a, b) => b.value - a.value)
}

function DistributionPie({
  stats,
  label,
  color,
}: {
  stats: PoliticalGroupStats
  label: string
  color: 'blue' | 'red'
}) {
  const data = toChartData(stats.propertyTypeDistribution)
  const borderColor = color === 'blue' ? 'border-blue-200 dark:border-blue-900' : 'border-red-200 dark:border-red-900'
  const titleColor = color === 'blue' ? 'text-blue-600' : 'text-red-500'

  return (
    <Card className={borderColor}>
      <CardHeader className="pb-2">
        <CardTitle className={`flex items-center gap-2 text-base ${titleColor}`}>
          <PieChartIcon className="h-5 w-5" />
          {label} 매물 유형
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={40}
                paddingAngle={2}
                label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="py-10 text-center text-sm text-muted-foreground">데이터 없음</p>
        )}
      </CardContent>
    </Card>
  )
}

export function PropertyDistribution({ progressive, conservative }: PropertyDistributionProps) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <DistributionPie stats={progressive} label="진보" color="blue" />
      <DistributionPie stats={conservative} label="보수" color="red" />
    </section>
  )
}
