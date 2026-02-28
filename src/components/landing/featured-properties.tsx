'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, Flame, Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils/format'
import { CATEGORY_LABELS } from '@/types/celebrity'
import type { CelebrityCategory } from '@/types/celebrity'

interface FeaturedProperty {
  readonly propertyName: string
  readonly address: string
  readonly price: number
  readonly celebrityName: string
  readonly category: CelebrityCategory
  readonly celebrityId: string
  readonly propertyId: string
}

const featuredData: readonly FeaturedProperty[] = [
  {
    propertyName: '한남더힐 (233㎡)',
    address: '서울 용산구 한남동',
    price: 449000,
    celebrityName: 'BTS 진',
    category: 'entertainer',
    celebrityId: 'ent-14',
    propertyId: 'prop-001',
  },
  {
    propertyName: '에테르노 압구정 PH',
    address: '서울 강남구 압구정동',
    price: 4000000,
    celebrityName: '손흥민',
    category: 'athlete',
    celebrityId: 'ath-01',
    propertyId: 'prop-086',
  },
  {
    propertyName: '나인원한남',
    address: '서울 용산구 한남동',
    price: 1640000,
    celebrityName: 'GD(권지용)',
    category: 'entertainer',
    celebrityId: 'ent-05',
    propertyId: 'prop-007',
  },
]

function PropertyCard({ data }: { readonly data: FeaturedProperty }) {
  const [revealed, setRevealed] = useState(false)

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 ${
        revealed ? 'ring-2 ring-pink-400 scale-[1.02]' : 'hover:shadow-lg'
      }`}
    >
      <CardContent className="p-6">
        <div className="space-y-3">
          <h3 className="text-lg font-bold">{data.propertyName}</h3>
          <p className="text-sm text-muted-foreground">{data.address}</p>

          {!revealed ? (
            <div className="space-y-4 pt-2">
              <div className="relative h-10 flex items-center">
                <div className="text-2xl font-black text-muted-foreground blur-md select-none" aria-hidden>
                  {formatPrice(data.price)}
                </div>
              </div>
              <div className="relative h-6">
                <div className="text-base font-semibold text-muted-foreground blur-md select-none" aria-hidden>
                  소유자: {data.celebrityName}
                </div>
              </div>
              <Button
                onClick={() => setRevealed(true)}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold"
              >
                <Eye className="h-4 w-4" />
                가격 공개하기
              </Button>
            </div>
          ) : (
            <div className="space-y-3 pt-2 animate-in fade-in duration-500">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-pink-600">
                  {formatPrice(data.price)}
                </span>
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold">
                  소유자: {data.celebrityName}
                </span>
                <Sparkles className="h-4 w-4 text-yellow-500" />
              </div>
              <Badge variant={data.category}>
                {CATEGORY_LABELS[data.category]}
              </Badge>
              <Link
                href={`/celebrity/${data.celebrityId}`}
                className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 font-medium pt-1"
              >
                상세보기 <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function FeaturedProperties() {
  return (
    <section className="px-4 py-16 md:py-24 bg-background">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-4">
          이 집의 주인은 누구?
        </h2>
        <p className="text-center text-muted-foreground mb-10 md:mb-14">
          카드를 클릭해서 가격과 소유자를 확인해보세요
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredData.map((item) => (
            <PropertyCard key={item.propertyId} data={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
