'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import type { HeatmapPoint } from '@/lib/geo/spatial-analysis'

// leaflet.heat 타입 확장
declare module 'leaflet' {
  function heatLayer(
    latlngs: [number, number, number][],
    options?: {
      radius?: number
      blur?: number
      maxZoom?: number
      max?: number
      minOpacity?: number
      gradient?: Record<number, string>
    },
  ): L.Layer
}

interface HeatmapLayerProps {
  points: HeatmapPoint[]
  radius?: number
  blur?: number
  maxZoom?: number
  gradient?: Record<number, string>
}

export function HeatmapLayer({
  points,
  radius = 25,
  blur = 15,
  maxZoom = 17,
  gradient,
}: HeatmapLayerProps) {
  const map = useMap()

  useEffect(() => {
    let heatLayer: L.Layer | null = null

    async function addHeat() {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('leaflet.heat')

      const heatData: [number, number, number][] = points.map((p) => [
        p.lat,
        p.lng,
        p.intensity,
      ])

      heatLayer = L.heatLayer(heatData, {
        radius,
        blur,
        maxZoom,
        max: Math.max(...points.map((p) => p.intensity), 1),
        minOpacity: 0.3,
        gradient: gradient ?? {
          0.0: '#313695',
          0.2: '#4575b4',
          0.4: '#74add1',
          0.6: '#fee090',
          0.8: '#f46d43',
          1.0: '#a50026',
        },
      })

      heatLayer.addTo(map)
    }

    if (points.length > 0) {
      addHeat()
    }

    return () => {
      if (heatLayer) {
        map.removeLayer(heatLayer)
      }
    }
  }, [map, points, radius, blur, maxZoom, gradient])

  return null
}
