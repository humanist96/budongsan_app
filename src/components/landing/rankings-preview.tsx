'use client'

import Link from 'next/link'
import { ArrowRight, Trophy, Home, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils/format'
import { celebrities, properties, celebrityProperties } from '@/data/celebrity-seed-data'
import { CATEGORY_LABELS } from '@/types/celebrity'
import type { CelebrityCategory } from '@/types/celebrity'

const rankBadgeColors = [
  'bg-yellow-500 text-white',
  'bg-gray-400 text-white',
  'bg-amber-700 text-white',
] as const

function computeMultiPropertyTop3() {
  const countMap = new Map<string, number>()
  for (const cp of celebrityProperties) {
    countMap.set(cp.celebrityId, (countMap.get(cp.celebrityId) ?? 0) + 1)
  }

  return [...countMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([celebrityId, count]) => {
      const celeb = celebrities.find((c) => c.id === celebrityId)
      return {
        id: celebrityId,
        name: celeb?.name ?? '',
        category: celeb?.category as CelebrityCategory,
        count,
      }
    })
}

function computeHighestPriceTop3() {
  const propertyMap = new Map(properties.map((p) => [p.id, p]))

  return [...celebrityProperties]
    .filter((cp) => cp.price !== null)
    .sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
    .slice(0, 3)
    .map((cp) => {
      const celeb = celebrities.find((c) => c.id === cp.celebrityId)
      const prop = propertyMap.get(cp.propertyId)
      return {
        id: `${cp.celebrityId}-${cp.propertyId}`,
        propertyName: prop?.name ?? '',
        price: cp.price ?? 0,
        celebrityName: celeb?.name ?? '',
        category: celeb?.category as CelebrityCategory,
      }
    })
}

const multiPropertyTop3 = computeMultiPropertyTop3()
const highestPriceTop3 = computeHighestPriceTop3()

export function RankingsPreview() {
  return (
    <section className="px-4 py-16 md:py-24 bg-muted/50">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Trophy className="h-7 w-7 text-yellow-500" />
          <h2 className="text-3xl md:text-4xl font-black text-center">
            셀럽 부동산 랭킹
          </h2>
        </div>
        <p className="text-center text-muted-foreground mb-10 md:mb-14">
          누가 가장 많이, 가장 비싸게 소유하고 있을까?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:-translate-y-1 transition-transform duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Home className="h-5 w-5 text-purple-500" />
                다주택 TOP 3
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {multiPropertyTop3.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${rankBadgeColors[idx]}`}
                  >
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{item.name}</div>
                    <Badge variant={item.category} className="text-[10px]">
                      {CATEGORY_LABELS[item.category]}
                    </Badge>
                  </div>
                  <span className="text-lg font-bold text-purple-600">
                    {item.count}채
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="hover:-translate-y-1 transition-transform duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-pink-500" />
                최고가 매물 TOP 3
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {highestPriceTop3.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${rankBadgeColors[idx]}`}
                  >
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{item.propertyName}</div>
                    <div className="text-xs text-muted-foreground">{item.celebrityName}</div>
                  </div>
                  <span className="text-lg font-bold text-pink-600">
                    {formatPrice(item.price)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Link href="/rankings">
            <Button variant="outline" className="gap-2">
              전체 랭킹 보기 <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
