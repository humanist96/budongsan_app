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
  profileImageUrl: string | null
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

function createMarkerIcon(
  category: CelebrityCategory,
  propertyCount: number,
  profileImageUrl: string | null,
  celebrityName: string,
): L.DivIcon {
  const color = MARKER_COLORS[category]
  const showBadge = propertyCount >= 2
  const initial = celebrityName.charAt(0)
  const size = 44

  const imageContent = profileImageUrl
    ? `<img src="${profileImageUrl}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><span style="display:none;width:100%;height:100%;align-items:center;justify-content:center;background:${color};border-radius:50%;color:#fff;font-size:16px;font-weight:700">${initial}</span>`
    : `<span style="display:flex;width:100%;height:100%;align-items:center;justify-content:center;background:${color};border-radius:50%;color:#fff;font-size:16px;font-weight:700">${initial}</span>`

  const badge = showBadge
    ? `<span style="position:absolute;top:-2px;right:-2px;width:18px;height:18px;background:#ef4444;border:2px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:10px;font-weight:700;line-height:1">${propertyCount}</span>`
    : ''

  const html = `<div style="position:relative;width:${size}px;height:${size}px">
    <div style="width:${size}px;height:${size}px;border-radius:50%;border:3px solid ${color};overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,0.3);background:#fff">
      ${imageContent}
    </div>
    ${badge}
  </div>`

  return L.divIcon({
    html,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)],
  })
}

interface CelebrityMarkerProps {
  marker: CelebrityMarkerData
  children?: ReactNode
}

export function CelebrityMarker({ marker, children }: CelebrityMarkerProps) {
  const icon = createMarkerIcon(marker.category, marker.propertyCount, marker.profileImageUrl, marker.celebrityName)

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
