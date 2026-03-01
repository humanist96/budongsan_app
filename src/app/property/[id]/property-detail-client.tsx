'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  MapPin,
  Heart,
  MessageCircle,
  MapPinCheck,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { PriceChart } from '@/components/property/price-chart'
import type { AcquisitionMarker } from '@/components/property/price-chart'
import { TransactionHistory } from '@/components/property/transaction-history'
import { ShareButton } from '@/components/social/share-button'
import { createClient } from '@/lib/supabase/client'
import { formatPrice, formatArea, formatPyeong, formatNumber } from '@/lib/utils'
import { PROPERTY_TYPE_LABELS, CATEGORY_LABELS } from '@/types'
import type { Property, Transaction, CelebrityCategory } from '@/types'
import {
  celebrities as seedCelebrities,
  properties as seedProperties,
  celebrityProperties as seedCPs,
} from '@/data/celebrity-seed-data'
import { transactions as seedTransactions } from '@/data/transaction-seed-data'
import { PriceLinks } from '@/components/property/price-links'
import { getPropertyAcquisitionEvents } from '@/data/timeline-helpers'

interface PropertyDetail extends Property {
  celebrity_properties: Array<{
    ownership_type: string
    acquisition_price: number | null
    verification_status: string
    source_url: string | null
    celebrities: {
      id: string
      name: string
      category: CelebrityCategory
      property_count: number
    }
  }>
  transactions: Transaction[]
}

interface PropertyDetailClientProps {
  id: string
}

export function PropertyDetailClient({ id }: PropertyDetailClientProps) {
  const [property, setProperty] = useState<PropertyDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient()

        const { data: prop, error: propError } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single()

        if (propError) throw propError

        const [{ data: celebrities }, { data: transactions }] = await Promise.all([
          supabase
            .from('celebrity_properties')
            .select('ownership_type, acquisition_price, verification_status, source_url, celebrities(*)')
            .eq('property_id', id),
          supabase
            .from('transactions')
            .select('*')
            .eq('property_id', id)
            .order('transaction_year', { ascending: true })
            .order('transaction_month', { ascending: true }),
        ])

        setProperty({
          ...(prop as Record<string, unknown>),
          celebrity_properties: (celebrities || []) as PropertyDetail['celebrity_properties'],
          transactions: (transactions || []) as Transaction[],
        } as PropertyDetail)
      } catch {
        setProperty(getDemoProperty(id))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="space-y-4">
          <div className="h-8 w-32 bg-muted rounded animate-pulse" />
          <div className="h-48 bg-muted rounded-xl animate-pulse" />
          <div className="h-80 bg-muted rounded-xl animate-pulse" />
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">매물 정보를 찾을 수 없습니다.</p>
        <Link href="/">
          <Button variant="outline" className="mt-4">지도로 돌아가기</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            지도로
          </Button>
        </Link>
        <ShareButton title={`${property.name} - 셀럽하우스맵`} />
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{property.name}</h1>
                <Badge variant="outline">
                  {PROPERTY_TYPE_LABELS[property.property_type]}
                </Badge>
              </div>
              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {property.address}
              </div>
            </div>
            {property.latest_transaction_price && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">최근 거래가</p>
                <p className="text-lg font-bold text-primary">
                  {formatPrice(property.latest_transaction_price)}원
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {property.exclusive_area && (
              <div>
                <p className="text-xs text-muted-foreground">전용면적</p>
                <p className="font-medium text-sm">
                  {formatArea(property.exclusive_area)} ({formatPyeong(property.exclusive_area)})
                </p>
              </div>
            )}
            {property.floor_info && (
              <div>
                <p className="text-xs text-muted-foreground">층</p>
                <p className="font-medium text-sm">{property.floor_info}</p>
              </div>
            )}
            {property.building_year && (
              <div>
                <p className="text-xs text-muted-foreground">건축년도</p>
                <p className="font-medium text-sm">{property.building_year}년</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 mt-4 pt-4 border-t text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {formatNumber(property.like_count)}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {formatNumber(property.comment_count)}
            </span>
            <span className="flex items-center gap-1">
              <MapPinCheck className="h-4 w-4" />
              {formatNumber(property.checkin_count)}
            </span>
          </div>
        </CardContent>
      </Card>

      {property.celebrity_properties.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="font-bold text-base mb-3">관련 셀럽</h2>
            <div className="space-y-2">
              {property.celebrity_properties.map((cp, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors">
                  <Link href={`/celebrity/${cp.celebrities.id}`} className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="font-medium text-sm">{cp.celebrities.name}</span>
                    <Badge variant={cp.celebrities.category} className="text-[10px]">
                      {CATEGORY_LABELS[cp.celebrities.category]}
                    </Badge>
                    {cp.celebrities.property_count >= 2 && (
                      <Badge variant="destructive" className="text-[10px]">
                        {cp.celebrities.property_count}채
                      </Badge>
                    )}
                  </Link>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {cp.acquisition_price && (
                      <span className="text-sm font-medium">
                        {formatPrice(cp.acquisition_price)}원
                      </span>
                    )}
                    {cp.source_url && (
                      <a
                        href={cp.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-blue-500 flex items-center gap-0.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        출처 <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        <PriceLinks propertyName={property.name} address={property.address} />
        <PriceChart
          transactions={property.transactions}
          propertyName={property.name}
          acquisitionMarkers={getPropertyAcquisitionEvents(id) as AcquisitionMarker[]}
        />
        <TransactionHistory transactions={property.transactions} />
      </div>
    </div>
  )
}

function getDemoProperty(id: string): PropertyDetail {
  const prop = seedProperties.find((p) => p.id === id)
  const celebMap = new Map(seedCelebrities.map((c) => [c.id, c]))
  const links = seedCPs.filter((cp) => cp.propertyId === id)
  const countMap = new Map<string, number>()

  for (const cp of seedCPs) {
    countMap.set(cp.celebrityId, (countMap.get(cp.celebrityId) ?? 0) + 1)
  }

  if (prop) {
    return {
      id: prop.id,
      name: prop.name,
      address: prop.address,
      latitude: prop.lat,
      longitude: prop.lng,
      property_type: prop.propertyType,
      exclusive_area: prop.exclusiveArea,
      floor_info: null,
      building_year: prop.buildingYear,
      dong_code: null,
      latest_transaction_price: links[0]?.price ?? null,
      latest_transaction_date: links[0]?.acquisitionDate ?? null,
      comment_count: 0,
      like_count: 0,
      checkin_count: 0,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      celebrity_properties: links.map((cp) => {
        const celeb = celebMap.get(cp.celebrityId)!
        return {
          ownership_type: 'owner',
          acquisition_price: cp.price,
          verification_status: cp.sourceType,
          source_url: cp.sourceUrl ?? null,
          celebrities: {
            id: celeb.id,
            name: celeb.name,
            category: celeb.category,
            property_count: countMap.get(celeb.id) ?? 1,
          },
        }
      }),
      transactions: seedTransactions
        .filter((t) => t.property_id === id)
        .map((t) => ({ ...t, raw_data: null, created_at: `${t.transaction_year}-01-01` })),
    }
  }

  return {
    id,
    name: '매물 정보 없음',
    address: '',
    latitude: 0,
    longitude: 0,
    property_type: 'apartment',
    exclusive_area: null,
    floor_info: null,
    building_year: null,
    dong_code: null,
    latest_transaction_price: null,
    latest_transaction_date: null,
    comment_count: 0,
    like_count: 0,
    checkin_count: 0,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    celebrity_properties: [],
    transactions: [],
  }
}
