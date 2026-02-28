'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Trophy, Building2, MapPin, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MultiOwnerBadge } from '@/components/celebrity/multi-owner-badge'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import { CATEGORY_LABELS, type CelebrityCategory } from '@/types'
import {
  celebrities as seedCelebrities,
  celebrityProperties as seedCPs,
  properties as seedProperties,
} from '@/data/celebrity-seed-data'

type RankingTab = 'multi-owner' | 'top-price' | 'dense-neighborhood'

interface RankingCelebrity {
  id: string
  name: string
  category: CelebrityCategory
  property_count: number
  total_asset_value: number
  profile_image_url: string | null
}

interface NeighborhoodDensity {
  dong_code: string
  address_prefix: string
  celebrity_count: number
  property_count: number
}

const tabs: { value: RankingTab; label: string; icon: typeof Trophy }[] = [
  { value: 'multi-owner', label: '다주택자', icon: Building2 },
  { value: 'top-price', label: '최고 자산', icon: TrendingUp },
  { value: 'dense-neighborhood', label: '셀럽 밀집', icon: MapPin },
]

export default function RankingsPage() {
  const [activeTab, setActiveTab] = useState<RankingTab>('multi-owner')
  const [celebrities, setCelebrities] = useState<RankingCelebrity[]>([])
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodDensity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRankings() {
      setLoading(true)
      try {
        const supabase = createClient()

        if (activeTab === 'dense-neighborhood') {
          const { data } = await supabase
            .from('v_neighborhood_density')
            .select('*')
            .limit(20)
          setNeighborhoods((data || []) as NeighborhoodDensity[])
        } else {
          let query = supabase
            .from('celebrities')
            .select('id, name, category, property_count, total_asset_value, profile_image_url')

          if (activeTab === 'multi-owner') {
            query = query.gte('property_count', 2).order('property_count', { ascending: false })
          } else {
            query = query.order('total_asset_value', { ascending: false })
          }

          const { data } = await query.limit(20)
          setCelebrities((data || []) as RankingCelebrity[])
        }
      } catch {
        setCelebrities(getDemoRankings())
        setNeighborhoods(getDemoNeighborhoods())
      } finally {
        setLoading(false)
      }
    }

    fetchRankings()
  }, [activeTab])

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="h-6 w-6 text-yellow-500" />
        <h1 className="text-2xl font-bold">랭킹</h1>
      </div>

      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <Button
            key={tab.value}
            variant={activeTab === tab.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab(tab.value)}
            className="gap-1.5"
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : activeTab === 'dense-neighborhood' ? (
        <div className="space-y-3">
          {neighborhoods.map((n, i) => (
            <Card key={n.dong_code || i}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm text-primary">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{n.address_prefix}</h3>
                  <p className="text-xs text-muted-foreground">
                    셀럽 {n.celebrity_count}명 · 부동산 {n.property_count}건
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {celebrities.map((celeb, i) => (
            <Link key={celeb.id} href={`/celebrity/${celeb.id}`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm text-primary">
                    {i + 1}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold shrink-0">
                    {celeb.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">{celeb.name}</span>
                      <Badge variant={celeb.category} className="text-[10px]">
                        {CATEGORY_LABELS[celeb.category]}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {celeb.property_count}건 보유 · 총 {formatPrice(celeb.total_asset_value)}원
                    </p>
                  </div>
                  <MultiOwnerBadge count={celeb.property_count} size="sm" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function getDemoRankings(): RankingCelebrity[] {
  const countMap = new Map<string, number>()
  const totalMap = new Map<string, number>()

  for (const cp of seedCPs) {
    countMap.set(cp.celebrityId, (countMap.get(cp.celebrityId) ?? 0) + 1)
    totalMap.set(cp.celebrityId, (totalMap.get(cp.celebrityId) ?? 0) + (cp.price ?? 0))
  }

  return seedCelebrities
    .map((c) => ({
      id: c.id,
      name: c.name,
      category: c.category,
      property_count: countMap.get(c.id) ?? 0,
      total_asset_value: totalMap.get(c.id) ?? 0,
      profile_image_url: null,
    }))
    .sort((a, b) => b.property_count - a.property_count)
    .slice(0, 20)
}

function getDemoNeighborhoods(): NeighborhoodDensity[] {
  const propMap = new Map(seedProperties.map((p) => [p.id, p]))
  const dongMap = new Map<string, { celeb: Set<string>; count: number }>()

  for (const cp of seedCPs) {
    const prop = propMap.get(cp.propertyId)
    if (!prop) continue
    // 주소에서 "서울 XX구 XX동" 추출
    const match = prop.address.match(/^(서울\s+\S+\s+\S+)/)
    const key = match ? match[1] : prop.address
    const existing = dongMap.get(key) ?? { celeb: new Set<string>(), count: 0 }
    existing.celeb.add(cp.celebrityId)
    existing.count += 1
    dongMap.set(key, existing)
  }

  return Array.from(dongMap.entries())
    .map(([address, data]) => ({
      dong_code: address,
      address_prefix: address,
      celebrity_count: data.celeb.size,
      property_count: data.count,
    }))
    .sort((a, b) => b.celebrity_count - a.celebrity_count || b.property_count - a.property_count)
    .slice(0, 15)
}
