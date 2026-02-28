'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { KakaoMapProvider } from '@/components/map/kakao-map-provider'
import type { MapCelebrityData } from '@/components/map/celebrity-map'
import { createClient } from '@/lib/supabase/client'
import { toMapCelebrityData } from '@/data/celebrity-seed-data'

const CelebrityMap = dynamic(
  () => import('@/components/map/celebrity-map').then((m) => m.CelebrityMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">지도를 불러오는 중...</p>
        </div>
      </div>
    ),
  }
)

export function HomeMap() {
  const [data, setData] = useState<MapCelebrityData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMapData() {
      try {
        const supabase = createClient()

        const { data: celebrityProperties, error } = await supabase
          .from('celebrity_properties')
          .select(`
            id,
            celebrity_id,
            property_id,
            acquisition_price,
            celebrities!inner(id, name, category, property_count),
            properties!inner(id, name, address, latitude, longitude, latest_transaction_price)
          `)
          .eq('ownership_type', 'owner')

        if (error) {
          throw error
        }

        if (celebrityProperties && celebrityProperties.length > 0) {
          const mapData: MapCelebrityData[] = celebrityProperties.map((cp: Record<string, unknown>) => {
            const celeb = cp.celebrities as Record<string, unknown>
            const prop = cp.properties as Record<string, unknown>
            return {
              id: cp.id as string,
              celebrityId: celeb.id as string,
              celebrityName: celeb.name as string,
              category: celeb.category as MapCelebrityData['category'],
              propertyId: prop.id as string,
              propertyName: prop.name as string,
              address: prop.address as string,
              lat: prop.latitude as number,
              lng: prop.longitude as number,
              price: (prop.latest_transaction_price as number | null) ?? (cp.acquisition_price as number | null),
              propertyCount: celeb.property_count as number,
            }
          })
          setData(mapData)
        } else {
          // DB에 데이터가 없으면 시드 데이터 사용
          setData(toMapCelebrityData())
        }
      } catch {
        // Supabase 미설정 시 시드 데이터 사용
        setData(toMapCelebrityData())
      } finally {
        setLoading(false)
      }
    }

    fetchMapData()
  }, [])

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <KakaoMapProvider>
      <CelebrityMap data={data} />
    </KakaoMapProvider>
  )
}
