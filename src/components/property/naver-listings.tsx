'use client'

import { useEffect, useState, useCallback } from 'react'
import { ExternalLink, RefreshCw, Building2, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PriceComparisonCard } from './price-comparison-card'
import { formatPrice, formatArea } from '@/lib/utils'
import type { NaverLandListing, NaverSearchResult } from '@/lib/naver-land/types'

interface NaverListingsProps {
  propertyName: string
  district: string
  acquisitionPrice: number | null
  acquisitionDate: string | null
  exclusiveArea: number | null
}

type LoadState = 'idle' | 'loading' | 'loaded' | 'error' | 'empty'

export function NaverListings({
  propertyName,
  district,
  acquisitionPrice,
  acquisitionDate,
  exclusiveArea,
}: NaverListingsProps) {
  const [state, setState] = useState<LoadState>('idle')
  const [listings, setListings] = useState<NaverLandListing[]>([])
  const [meta, setMeta] = useState<NaverSearchResult['meta'] | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const fetchListings = useCallback(async () => {
    setState('loading')
    setErrorMsg('')

    try {
      const params = new URLSearchParams({
        district,
        name: propertyName,
        tradeType: '매매',
        limit: '20',
      })

      const res = await fetch(`/api/naver-land/search?${params}`)
      const data: NaverSearchResult & { error?: string } = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? '시세 조회 실패')
      }

      if (data.listings.length === 0) {
        setState('empty')
      } else {
        setListings(data.listings)
        setMeta(data.meta)
        setState('loaded')
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : '시세를 불러올 수 없습니다')
      setState('error')
    }
  }, [propertyName, district])

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  // 유사 면적 매물 필터 (±30%)
  const similarListings = exclusiveArea
    ? listings.filter((l) => {
        const ratio = l.exclusiveArea / exclusiveArea
        return ratio >= 0.7 && ratio <= 1.3
      })
    : listings

  const currentPrices = (similarListings.length > 0 ? similarListings : listings)
    .filter((l) => l.price > 0)
    .map((l) => l.price)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-500" />
          <h3 className="font-bold text-sm">네이버 부동산 실시간 시세</h3>
          {meta?.cached && (
            <Badge variant="outline" className="text-[9px]">캐시</Badge>
          )}
        </div>
        {state !== 'loading' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchListings}
            className="gap-1 text-xs"
          >
            <RefreshCw className="h-3 w-3" />
            새로고침
          </Button>
        )}
      </div>

      {/* Loading */}
      {state === 'loading' && (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />
          ))}
          <p className="text-xs text-center text-muted-foreground">
            네이버 부동산에서 시세를 조회 중입니다...
          </p>
        </div>
      )}

      {/* Error */}
      {state === 'error' && (
        <Card>
          <CardContent className="p-4 text-center">
            <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
            <p className="text-xs text-muted-foreground">{errorMsg}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchListings}
              className="mt-2 text-xs"
            >
              다시 시도
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty */}
      {state === 'empty' && (
        <Card>
          <CardContent className="p-4 text-center">
            <Building2 className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
            <p className="text-xs text-muted-foreground">
              현재 등록된 매물이 없습니다
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loaded */}
      {state === 'loaded' && (
        <>
          {/* Price Comparison */}
          <PriceComparisonCard
            acquisitionPrice={acquisitionPrice}
            acquisitionDate={acquisitionDate}
            currentPrices={currentPrices}
            propertyName={propertyName}
          />

          {/* Listing Count */}
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
            동일 단지 현재 매물 ({listings.length}건)
          </p>

          {/* Listing Cards */}
          <div className="space-y-2">
            {listings.map((listing) => (
              <Card key={listing.articleNo} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-medium">{listing.complexName}</span>
                        <Badge variant="outline" className="text-[9px]">
                          {listing.tradeType}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                        <span>{formatArea(listing.exclusiveArea)}</span>
                        <span>·</span>
                        <span>{listing.pyeong}평</span>
                        <span>·</span>
                        <span>{listing.floorInfo}층</span>
                        {listing.confirmDate && (
                          <>
                            <span>·</span>
                            <span>{listing.confirmDate}</span>
                          </>
                        )}
                      </div>
                      {listing.tags.length > 0 && (
                        <div className="flex gap-1 mt-1.5 flex-wrap">
                          {listing.tags.slice(0, 4).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-[9px] px-1.5 py-0"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {listing.priceText}
                      </p>
                      {listing.rentPrice && listing.rentPrice > 0 && (
                        <p className="text-[10px] text-muted-foreground">
                          월 {formatPrice(listing.rentPrice)}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Naver Link */}
          <a
            href={`https://m.land.naver.com/search/result/${encodeURIComponent(propertyName)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 text-xs text-blue-500 hover:text-blue-600 py-2"
          >
            <ExternalLink className="h-3 w-3" />
            네이버 부동산에서 보기
          </a>
        </>
      )}
    </div>
  )
}
