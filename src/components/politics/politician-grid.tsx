'use client'

import { useState, useMemo } from 'react'
import { Filter, ArrowUpDown, Building2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils/format'
import { getAllPoliticiansSorted, type SortKey, type PoliticianListItem } from '@/lib/politics/political-stats'
import type { PoliticalLeaning } from '@/data/celebrity-seed-data'

type LeaningFilter = 'all' | PoliticalLeaning

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'totalAsset', label: '자산순' },
  { key: 'propertyCount', label: '매물수' },
  { key: 'name', label: '이름순' },
  { key: 'party', label: '정당순' },
]

const FILTER_OPTIONS: { key: LeaningFilter; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'progressive', label: '진보' },
  { key: 'conservative', label: '보수' },
]

export function PoliticianGrid() {
  const [sortBy, setSortBy] = useState<SortKey>('totalAsset')
  const [filter, setFilter] = useState<LeaningFilter>('all')

  const politicians = useMemo(() => {
    const all = getAllPoliticiansSorted(sortBy)
    if (filter === 'all') return all
    return all.filter((p) => p.leaning === filter)
  }, [sortBy, filter])

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {FILTER_OPTIONS.map((opt) => (
            <Button
              key={opt.key}
              variant={filter === opt.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(opt.key)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          {SORT_OPTIONS.map((opt) => (
            <Button
              key={opt.key}
              variant={sortBy === opt.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy(opt.key)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {politicians.map((pol) => (
          <PoliticianCard key={pol.id} politician={pol} />
        ))}
      </div>

      {politicians.length === 0 && (
        <p className="py-10 text-center text-muted-foreground">해당 조건에 맞는 정치인이 없습니다.</p>
      )}
    </section>
  )
}

function PoliticianCard({ politician }: { politician: PoliticianListItem }) {
  const isProgressive = politician.leaning === 'progressive'
  const badgeBg = isProgressive
    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
    : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
  const borderColor = isProgressive
    ? 'border-l-blue-500'
    : 'border-l-red-500'

  return (
    <Card className={`border-l-4 ${borderColor} transition-shadow hover:shadow-md`}>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
          <Building2 className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold truncate">{politician.name}</span>
            <span className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${badgeBg}`}>
              {isProgressive ? '진보' : '보수'}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
            {politician.party && <span>{politician.party}</span>}
            <span className="text-muted-foreground/50">|</span>
            <span>{politician.subCategory}</span>
          </div>
          <div className="mt-1 flex items-center gap-3 text-sm">
            <span className="font-medium">{formatPrice(politician.totalAsset)}</span>
            <span className="text-muted-foreground">{politician.propertyCount}건</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
