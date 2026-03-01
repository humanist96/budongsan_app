'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Building2, TrendingUp, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { MultiOwnerBadge } from '@/components/celebrity/multi-owner-badge'
import { ShareButton } from '@/components/social/share-button'
import { CelebrityPropertyList } from '@/components/celebrity/celebrity-property-list'
import { PortfolioSummary } from '@/components/celebrity/portfolio-summary'
import { CelebrityTimeline } from '@/components/celebrity/celebrity-timeline'
import { PortfolioValueChart } from '@/components/celebrity/portfolio-value-chart'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import type { CelebrityCategory } from '@/types'
import { CATEGORY_LABELS } from '@/types'
import {
  celebrities as seedCelebrities,
  properties as seedProperties,
  celebrityProperties as seedCPs,
} from '@/data/celebrity-seed-data'
import {
  getTimelineEvents,
  getPortfolioDataPoints,
  getCelebrityROI,
} from '@/data/timeline-helpers'

interface CelebrityDetail {
  id: string
  name: string
  category: CelebrityCategory
  sub_category: string | null
  profile_image_url: string | null
  description: string | null
  property_count: number
  total_asset_value: number
  is_verified: boolean
  celebrity_properties: Array<{
    id: string
    ownership_type: string
    acquisition_date: string | null
    acquisition_price: number | null
    source_url: string | null
    verification_status: 'verified' | 'reported' | 'unverified'
    properties: {
      id: string
      name: string
      address: string
      latitude: number
      longitude: number
      property_type: 'apartment' | 'house' | 'villa' | 'officetel' | 'building' | 'land' | 'other'
      exclusive_area: number | null
      floor_info: string | null
      latest_transaction_price: number | null
      latest_transaction_date: string | null
    }
  }>
}

interface CelebrityDetailClientProps {
  id: string
}

export function CelebrityDetailClient({ id }: CelebrityDetailClientProps) {
  const [celebrity, setCelebrity] = useState<CelebrityDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient()

        const { data: celeb, error: celebError } = await supabase
          .from('celebrities')
          .select('*')
          .eq('id', id)
          .single()

        if (celebError) throw celebError

        const { data: props, error: propsError } = await supabase
          .from('celebrity_properties')
          .select(`
            id,
            ownership_type,
            acquisition_date,
            acquisition_price,
            source_url,
            verification_status,
            properties(*)
          `)
          .eq('celebrity_id', id)

        if (propsError) throw propsError

        setCelebrity({
          ...(celeb as Record<string, unknown>),
          celebrity_properties: (props || []) as CelebrityDetail['celebrity_properties'],
        } as CelebrityDetail)
      } catch {
        setCelebrity(getSeedCelebrity(id))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const timelineEvents = useMemo(() => getTimelineEvents(id), [id])
  const portfolioData = useMemo(() => getPortfolioDataPoints(id), [id])
  const roi = useMemo(() => getCelebrityROI(id), [id])
  const disposalCount = useMemo(
    () => seedCPs.filter((cp) => cp.celebrityId === id && cp.disposalDate).length,
    [id]
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="space-y-4">
          <div className="h-8 w-32 bg-muted rounded animate-pulse" />
          <div className="h-48 bg-muted rounded-xl animate-pulse" />
          <div className="h-24 bg-muted rounded-xl animate-pulse" />
          <div className="h-24 bg-muted rounded-xl animate-pulse" />
        </div>
      </div>
    )
  }

  if (!celebrity) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">셀럽 정보를 찾을 수 없습니다.</p>
        <Link href="/celebrity">
          <Button variant="outline" className="mt-4">목록으로 돌아가기</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <Link href="/celebrity">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            목록으로
          </Button>
        </Link>
        <ShareButton title={`${celebrity.name} 부동산 포트폴리오 - 셀럽하우스맵`} />
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl font-bold shrink-0">
              {celebrity.profile_image_url ? (
                <Image
                  src={celebrity.profile_image_url}
                  alt={celebrity.name}
                  width={64}
                  height={64}
                  className="w-full h-full rounded-full object-cover"
                  unoptimized
                />
              ) : (
                celebrity.name[0]
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold">{celebrity.name}</h1>
                <Badge variant={celebrity.category}>
                  {CATEGORY_LABELS[celebrity.category]}
                </Badge>
                {celebrity.sub_category && (
                  <Badge variant="outline">{celebrity.sub_category}</Badge>
                )}
                <MultiOwnerBadge count={celebrity.property_count} />
                {disposalCount > 0 && (
                  <Badge variant="outline" className="text-orange-600 border-orange-300 text-[10px]">
                    매각 {disposalCount}건
                  </Badge>
                )}
                {celebrity.is_verified && (
                  <ShieldCheck className="h-4 w-4 text-blue-500" />
                )}
              </div>

              {celebrity.description && (
                <p className="text-sm text-muted-foreground mt-2">
                  {celebrity.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">보유 부동산</p>
                    <p className="font-bold">{celebrity.property_count}건</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">총 자산가치</p>
                    <p className="font-bold">
                      {celebrity.total_asset_value > 0
                        ? `${formatPrice(celebrity.total_asset_value)}원`
                        : '정보 없음'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="portfolio">
        <TabsList>
          <TabsTrigger value="portfolio">포트폴리오</TabsTrigger>
          <TabsTrigger value="timeline">타임라인</TabsTrigger>
          <TabsTrigger value="properties">보유 부동산</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio">
          <div className="space-y-4">
            <PortfolioSummary roi={roi} category={celebrity.category} />
            <PortfolioValueChart
              dataPoints={portfolioData}
              category={celebrity.category}
            />
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <CelebrityTimeline
            events={timelineEvents}
            category={celebrity.category}
            currentPortfolioValue={roi.currentValue}
          />
        </TabsContent>

        <TabsContent value="properties">
          <CelebrityPropertyList
            items={celebrity.celebrity_properties as never[]}
            totalAssetValue={celebrity.total_asset_value}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function getSeedCelebrity(id: string): CelebrityDetail | null {
  const celeb = seedCelebrities.find((c) => c.id === id)
  if (!celeb) return null

  const propMap = new Map(seedProperties.map((p) => [p.id, p]))
  const links = seedCPs.filter((cp) => cp.celebrityId === id)
  const totalValue = links.reduce((sum, cp) => sum + (cp.price ?? 0), 0)

  return {
    id: celeb.id,
    name: celeb.name,
    category: celeb.category,
    sub_category: celeb.subCategory,
    profile_image_url: celeb.profileImageUrl ?? null,
    description: celeb.description,
    property_count: links.length,
    total_asset_value: totalValue,
    is_verified: celeb.isVerified,
    celebrity_properties: links.map((cp, i) => {
      const prop = propMap.get(cp.propertyId)!
      return {
        id: `seed-cp-${i}`,
        ownership_type: 'owner',
        acquisition_date: cp.acquisitionDate,
        acquisition_price: cp.price,
        source_url: cp.sourceUrl ?? null,
        verification_status: cp.sourceType,
        properties: {
          id: prop.id,
          name: prop.name,
          address: prop.address,
          latitude: prop.lat,
          longitude: prop.lng,
          property_type: prop.propertyType,
          exclusive_area: prop.exclusiveArea,
          floor_info: null,
          latest_transaction_price: cp.price,
          latest_transaction_date: cp.acquisitionDate,
        },
      }
    }),
  }
}
