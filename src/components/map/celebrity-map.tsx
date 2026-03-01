'use client'

import { useMemo } from 'react'
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { useMapStore, useFilterStore } from '@/stores/map-store'
import { CelebrityMarker, type CelebrityMarkerData } from './celebrity-marker'
import { MarkerPopup } from './marker-popup'
import { MapFilterPanel } from './map-filter-panel'
import 'leaflet/dist/leaflet.css'

interface MapCelebrityData {
  id: string
  celebrityId: string
  celebrityName: string
  category: 'entertainer' | 'politician' | 'athlete' | 'expert'
  profileImageUrl: string | null
  propertyId: string
  propertyName: string
  address: string
  lat: number
  lng: number
  price: number | null
  propertyCount: number
}

interface CelebrityMapProps {
  data: MapCelebrityData[]
}

function MapController() {
  const { setCenter, setLevel } = useMapStore()

  useMapEvents({
    moveend: (e) => {
      const c = e.target.getCenter()
      setCenter(c.lat, c.lng)
    },
    zoomend: (e) => {
      setLevel(e.target.getZoom())
    },
  })

  return null
}

export function CelebrityMap({ data }: CelebrityMapProps) {
  const { center, level } = useMapStore()
  const { categories, multiOwnerOnly } = useFilterStore()

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (!categories.includes(item.category)) return false
      if (multiOwnerOnly && item.propertyCount < 2) return false
      return true
    })
  }, [data, categories, multiOwnerOnly])

  return (
    <div className="relative w-full h-full">
      <MapFilterPanel />

      <MapContainer
        center={[center.lat, center.lng]}
        zoom={level}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController />

        {filteredData.map((item) => {
          const marker: CelebrityMarkerData = {
            id: item.id,
            position: { lat: item.lat, lng: item.lng },
            celebrityName: item.celebrityName,
            category: item.category,
            profileImageUrl: item.profileImageUrl,
            propertyName: item.propertyName,
            propertyCount: item.propertyCount,
            price: item.price,
          }

          return (
            <CelebrityMarker key={item.id} marker={marker}>
              <MarkerPopup
                celebrityId={item.celebrityId}
                celebrityName={item.celebrityName}
                category={item.category}
                propertyName={item.propertyName}
                address={item.address}
                price={item.price}
                propertyCount={item.propertyCount}
                propertyId={item.propertyId}
              />
            </CelebrityMarker>
          )
        })}
      </MapContainer>

      <div className="absolute bottom-4 right-4 z-[1000] bg-card/90 backdrop-blur rounded-lg shadow border px-3 py-2">
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-pink-500" />
            연예인
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            정치인
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            운동선수
          </span>
        </div>
      </div>
    </div>
  )
}

export type { MapCelebrityData }
