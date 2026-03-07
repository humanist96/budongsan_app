'use client'

import { useMemo } from 'react'
import { HeroBanner } from '@/components/politics/hero-banner'
import { ComparisonOverview } from '@/components/politics/comparison-overview'
import { ComparisonChart } from '@/components/politics/comparison-chart'
import { TopRankings } from '@/components/politics/top-rankings'
import { PropertyDistribution } from '@/components/politics/property-distribution'
import { PoliticianGrid } from '@/components/politics/politician-grid'
import { computePoliticalStats } from '@/lib/politics/political-stats'

export function PoliticsContent() {
  const { progressive, conservative } = useMemo(() => computePoliticalStats(), [])

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <HeroBanner progressive={progressive} conservative={conservative} />
      <ComparisonOverview progressive={progressive} conservative={conservative} />
      <ComparisonChart progressive={progressive} conservative={conservative} />
      <TopRankings progressive={progressive} conservative={conservative} />
      <PropertyDistribution progressive={progressive} conservative={conservative} />

      <div>
        <h2 className="mb-4 text-xl font-bold">전체 정치인 목록</h2>
        <PoliticianGrid />
      </div>
    </div>
  )
}
