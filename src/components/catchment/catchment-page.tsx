'use client'

import { useCallback, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Circle, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import Image from 'next/image'
import Link from 'next/link'
import { Compass, Users, MapPin, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  getCelebritiesInCatchment,
  getAllPropertyLocations,
  type CatchmentCelebrity,
  type PropertyLocation,
} from '@/lib/geo/spatial-analysis'
import { CATEGORY_LABELS, type CelebrityCategory } from '@/types'
import 'leaflet/dist/leaflet.css'

const RADIUS_OPTIONS = [
  { label: '500m', value: 500 },
  { label: '1km', value: 1000 },
  { label: '2km', value: 2000 },
  { label: '3km', value: 3000 },
]

const CATEGORY_DOT_COLORS: Record<CelebrityCategory, string> = {
  entertainer: '#ec4899',
  politician: '#3b82f6',
  athlete: '#22c55e',
  expert: '#f59e0b',
}

function createPropertyIcon() {
  return L.divIcon({
    html: `<div style="width:8px;height:8px;background:#6366f1;border-radius:50%;border:1.5px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)"></div>`,
    className: '',
    iconSize: [8, 8],
    iconAnchor: [4, 4],
  })
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export function CatchmentPage() {
  const [selectedPoint, setSelectedPoint] = useState<{ lat: number; lng: number } | null>(null)
  const [radius, setRadius] = useState(1000)
  const [nearbyCelebs, setNearbyCelebs] = useState<CatchmentCelebrity[]>([])
  const [selectedProperty, setSelectedProperty] = useState<PropertyLocation | null>(null)

  const propertyLocations = useMemo(() => getAllPropertyLocations(), [])

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      setSelectedPoint({ lat, lng })
      setSelectedProperty(null)
      const celebs = getCelebritiesInCatchment(lat, lng, radius)
      setNearbyCelebs(celebs)
    },
    [radius],
  )

  const handlePropertyClick = useCallback(
    (prop: PropertyLocation) => {
      setSelectedPoint({ lat: prop.lat, lng: prop.lng })
      setSelectedProperty(prop)
      const celebs = getCelebritiesInCatchment(prop.lat, prop.lng, radius)
      setNearbyCelebs(celebs)
    },
    [radius],
  )

  const handleRadiusChange = useCallback(
    (newRadius: number) => {
      setRadius(newRadius)
      if (selectedPoint) {
        const celebs = getCelebritiesInCatchment(selectedPoint.lat, selectedPoint.lng, newRadius)
        setNearbyCelebs(celebs)
      }
    },
    [selectedPoint],
  )

  const categoryBreakdown = useMemo(() => {
    const counts: Record<CelebrityCategory, number> = {
      entertainer: 0,
      politician: 0,
      athlete: 0,
      expert: 0,
    }
    for (const c of nearbyCelebs) {
      counts[c.category] += 1
    }
    return counts
  }, [nearbyCelebs])

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-3.5rem)]">
      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={[37.5665, 126.978]}
          zoom={12}
          style={{ width: '100%', height: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.vworld.kr">VWorld</a>'
            url={`https://api.vworld.kr/req/wmts/1.0.0/${process.env.NEXT_PUBLIC_VWORLD_API_KEY ?? 'BASE'}/Base/{z}/{y}/{x}.png`}
          />
          <MapClickHandler onMapClick={handleMapClick} />

          {/* Property Markers */}
          {propertyLocations.map((prop) => (
            <Marker
              key={prop.id}
              position={[prop.lat, prop.lng]}
              icon={createPropertyIcon()}
              eventHandlers={{
                click: () => handlePropertyClick(prop),
              }}
            >
              <Popup>
                <div className="min-w-[160px]">
                  <p className="font-bold text-xs">{prop.name}</p>
                  <p className="text-[10px] text-gray-500">{prop.address}</p>
                  {prop.celebrityNames.length > 0 && (
                    <p className="text-[10px] mt-1">
                      {prop.celebrityNames.join(', ')}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Catchment Circle */}
          {selectedPoint && (
            <Circle
              center={[selectedPoint.lat, selectedPoint.lng]}
              radius={radius}
              pathOptions={{
                color: '#8b5cf6',
                fillColor: '#8b5cf6',
                fillOpacity: 0.1,
                weight: 2,
                dashArray: '8 4',
              }}
            />
          )}
        </MapContainer>

        {/* Radius Selector */}
        <div className="absolute top-4 left-4 z-[1000] bg-card/95 backdrop-blur rounded-xl shadow-lg border p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">
            생활권 반경
          </p>
          <div className="flex gap-1.5">
            {RADIUS_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                variant={radius === opt.value ? 'default' : 'outline'}
                size="sm"
                className="text-xs h-7 px-2.5"
                onClick={() => handleRadiusChange(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            {selectedPoint
              ? '지도에서 다른 위치를 클릭하여 변경'
              : '지도를 클릭하여 중심점을 선택하세요'}
          </p>
        </div>
      </div>

      {/* Side Panel */}
      <div className="lg:w-[360px] border-t lg:border-t-0 lg:border-l bg-background overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-sm font-bold flex items-center gap-1.5">
            <Compass className="h-4 w-4 text-violet-500" />
            셀럽 생활권 분석
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            특정 지점 반경 내 셀럽 매물을 탐색합니다
          </p>
        </div>

        {!selectedPoint ? (
          <div className="p-8 text-center text-muted-foreground">
            <MapPin className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">지도를 클릭하여</p>
            <p className="text-sm">분석을 시작하세요</p>
          </div>
        ) : (
          <>
            {/* Selected Location Info */}
            {selectedProperty && (
              <div className="p-3 border-b bg-violet-50 dark:bg-violet-950/30">
                <p className="text-xs font-medium text-violet-700 dark:text-violet-300">
                  {selectedProperty.name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {selectedProperty.address}
                </p>
              </div>
            )}

            {/* Summary Stats */}
            <div className="p-3 border-b">
              <div className="grid grid-cols-2 gap-2">
                <Card>
                  <CardContent className="p-2 text-center">
                    <Users className="h-3.5 w-3.5 mx-auto text-violet-500 mb-1" />
                    <p className="text-xl font-bold">{nearbyCelebs.length}</p>
                    <p className="text-[10px] text-muted-foreground">셀럽</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-2 text-center">
                    <Compass className="h-3.5 w-3.5 mx-auto text-violet-500 mb-1" />
                    <p className="text-xl font-bold">
                      {radius >= 1000 ? `${radius / 1000}km` : `${radius}m`}
                    </p>
                    <p className="text-[10px] text-muted-foreground">반경</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="p-3 border-b">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">
                카테고리별 분포
              </p>
              <div className="flex gap-3">
                {(Object.entries(categoryBreakdown) as [CelebrityCategory, number][])
                  .filter(([, count]) => count > 0)
                  .map(([cat, count]) => (
                    <div key={cat} className="flex items-center gap-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: CATEGORY_DOT_COLORS[cat] }}
                      />
                      <span className="text-xs">
                        {CATEGORY_LABELS[cat]} {count}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Celebrity List */}
            <div className="p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">
                생활권 내 셀럽 ({nearbyCelebs.length}명)
              </p>
              <div className="space-y-2">
                {nearbyCelebs.map((celeb) => (
                  <Link key={celeb.id} href={`/celebrity/${celeb.id}`}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-2.5 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                          {celeb.profileImageUrl ? (
                            <Image
                              src={celeb.profileImageUrl}
                              alt={celeb.name}
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          ) : (
                            celeb.name[0]
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium truncate">{celeb.name}</span>
                            <Badge variant={celeb.category} className="text-[9px] px-1 py-0">
                              {CATEGORY_LABELS[celeb.category]}
                            </Badge>
                          </div>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {celeb.propertyName} · {celeb.distanceMeters}m
                          </p>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
                {nearbyCelebs.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    이 범위에 셀럽 매물이 없습니다.
                    <br />
                    반경을 넓혀보세요.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
