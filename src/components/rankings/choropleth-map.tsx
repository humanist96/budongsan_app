'use client'

import { useMemo, useState } from 'react'
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet'
import { getGuStats, type GuStats } from '@/lib/geo/spatial-analysis'
import { formatPrice } from '@/lib/utils'
import 'leaflet/dist/leaflet.css'

// 서울 주요 구 중심 좌표
const GU_CENTERS: Record<string, { lat: number; lng: number }> = {
  '강남구': { lat: 37.5172, lng: 127.0473 },
  '서초구': { lat: 37.4837, lng: 127.0324 },
  '송파구': { lat: 37.5145, lng: 127.1059 },
  '용산구': { lat: 37.5326, lng: 126.9905 },
  '마포구': { lat: 37.5638, lng: 126.9084 },
  '성동구': { lat: 37.5634, lng: 127.0369 },
  '강동구': { lat: 37.5301, lng: 127.1238 },
  '영등포구': { lat: 37.5263, lng: 126.8962 },
  '종로구': { lat: 37.5735, lng: 126.9790 },
  '중구': { lat: 37.5636, lng: 126.9975 },
  '동작구': { lat: 37.5124, lng: 126.9392 },
  '관악구': { lat: 37.4784, lng: 126.9516 },
  '서대문구': { lat: 37.5791, lng: 126.9368 },
  '광진구': { lat: 37.5385, lng: 127.0823 },
  '강서구': { lat: 37.5510, lng: 126.8496 },
  '성북구': { lat: 37.5894, lng: 127.0167 },
  '노원구': { lat: 37.6542, lng: 127.0568 },
  '도봉구': { lat: 37.6688, lng: 127.0471 },
  '강북구': { lat: 37.6397, lng: 127.0255 },
  '중랑구': { lat: 37.6063, lng: 127.0928 },
  '양천구': { lat: 37.5170, lng: 126.8665 },
  '구로구': { lat: 37.4954, lng: 126.8873 },
  '금천구': { lat: 37.4568, lng: 126.8955 },
  '은평구': { lat: 37.6027, lng: 126.9291 },
  '동대문구': { lat: 37.5744, lng: 127.0396 },
}

type MetricType = 'celebrity' | 'price' | 'avg'

const metricLabels: Record<MetricType, string> = {
  celebrity: '셀럽 수',
  price: '총 자산',
  avg: '평균 매물가',
}

function getColor(value: number, max: number): string {
  const ratio = max > 0 ? value / max : 0
  if (ratio > 0.8) return '#b2182b'
  if (ratio > 0.6) return '#d6604d'
  if (ratio > 0.4) return '#f4a582'
  if (ratio > 0.2) return '#fddbc7'
  return '#d1e5f0'
}

function getRadius(value: number, max: number): number {
  const ratio = max > 0 ? value / max : 0
  return 300 + ratio * 2200
}

export function ChoroplethMap() {
  const [metric, setMetric] = useState<MetricType>('celebrity')
  const guStats = useMemo(() => getGuStats(), [])

  const maxValue = useMemo(() => {
    switch (metric) {
      case 'celebrity': return Math.max(...guStats.map((g) => g.celebrityCount), 1)
      case 'price': return Math.max(...guStats.map((g) => g.totalAssetValue), 1)
      case 'avg': return Math.max(...guStats.map((g) => g.avgAssetValue), 1)
    }
  }, [guStats, metric])

  const getValue = (gu: GuStats): number => {
    switch (metric) {
      case 'celebrity': return gu.celebrityCount
      case 'price': return gu.totalAssetValue
      case 'avg': return gu.avgAssetValue
    }
  }

  const formatValue = (gu: GuStats): string => {
    switch (metric) {
      case 'celebrity': return `${gu.celebrityCount}명`
      case 'price': return `${formatPrice(gu.totalAssetValue)}원`
      case 'avg': return `${formatPrice(gu.avgAssetValue)}원`
    }
  }

  return (
    <div className="space-y-4">
      {/* Metric Selector */}
      <div className="flex gap-2">
        {(Object.keys(metricLabels) as MetricType[]).map((m) => (
          <button
            key={m}
            onClick={() => setMetric(m)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              metric === m
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80 text-muted-foreground'
            }`}
          >
            {metricLabels[m]}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="h-[500px] rounded-xl overflow-hidden border">
        <MapContainer
          center={[37.5665, 126.978]}
          zoom={11}
          style={{ width: '100%', height: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.vworld.kr">VWorld</a>'
            url={`https://api.vworld.kr/req/wmts/1.0.0/${process.env.NEXT_PUBLIC_VWORLD_API_KEY ?? 'BASE'}/Base/{z}/{y}/{x}.png`}
          />
          {guStats.map((gu) => {
            const center = GU_CENTERS[gu.gu]
            if (!center) return null
            const value = getValue(gu)
            return (
              <Circle
                key={gu.gu}
                center={[center.lat, center.lng]}
                radius={getRadius(value, maxValue)}
                pathOptions={{
                  color: getColor(value, maxValue),
                  fillColor: getColor(value, maxValue),
                  fillOpacity: 0.6,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="text-center min-w-[140px]">
                    <p className="font-bold text-sm">{gu.gu}</p>
                    <div className="mt-1 space-y-0.5 text-xs">
                      <p>셀럽 <strong>{gu.celebrityCount}명</strong></p>
                      <p>매물 <strong>{gu.propertyCount}건</strong></p>
                      <p>총 자산 <strong>{formatPrice(gu.totalAssetValue)}원</strong></p>
                      <p>평균 <strong>{formatPrice(gu.avgAssetValue)}원</strong></p>
                      {gu.topCeleb && (
                        <p className="text-muted-foreground mt-1">
                          대표 셀럽: {gu.topCeleb}
                        </p>
                      )}
                    </div>
                  </div>
                </Popup>
              </Circle>
            )
          })}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 text-[10px]">
        <span className="text-muted-foreground">낮음</span>
        {['#d1e5f0', '#fddbc7', '#f4a582', '#d6604d', '#b2182b'].map((color) => (
          <span
            key={color}
            className="w-6 h-3 rounded-sm"
            style={{ backgroundColor: color }}
          />
        ))}
        <span className="text-muted-foreground">높음</span>
      </div>
    </div>
  )
}
