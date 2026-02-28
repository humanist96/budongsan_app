'use client'

import { type ReactNode } from 'react'
import L from 'leaflet'
import { Marker } from 'react-leaflet'
import type { CelebrityCategory } from '@/types'

interface CelebrityMarkerData {
  id: string
  position: { lat: number; lng: number }
  celebrityName: string
  category: CelebrityCategory
  propertyName: string
  propertyCount: number
  price: number | null
}

const MARKER_COLORS: Record<CelebrityCategory, string> = {
  entertainer: '#ec4899',
  politician: '#3b82f6',
  athlete: '#22c55e',
  expert: '#f59e0b',
}

function createMarkerIcon(category: CelebrityCategory, propertyCount: number): L.DivIcon {
  const color = MARKER_COLORS[category]
  const showBadge = propertyCount >= 2

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46">
      <path d="M18 46 C18 46 36 28 36 18 C36 8 28 0 18 0 C8 0 0 8 0 18 C0 28 18 46 18 46Z" fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="18" cy="18" r="8" fill="white"/>
      ${showBadge ? `<circle cx="28" cy="8" r="8" fill="#ef4444" stroke="white" stroke-width="1.5"/>
      <text x="28" y="12" text-anchor="middle" fill="white" font-size="10" font-weight="bold">${propertyCount}</text>` : ''}
    </svg>
  `

  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [36, 46],
    iconAnchor: [18, 46],
    popupAnchor: [0, -46],
  })
}

interface CelebrityMarkerProps {
  marker: CelebrityMarkerData
  children?: ReactNode
}

export function CelebrityMarker({ marker, children }: CelebrityMarkerProps) {
  const icon = createMarkerIcon(marker.category, marker.propertyCount)

  return (
    <Marker
      position={[marker.position.lat, marker.position.lng]}
      icon={icon}
    >
      {children}
    </Marker>
  )
}

export type { CelebrityMarkerData }
