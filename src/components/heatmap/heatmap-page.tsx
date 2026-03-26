'use client'

import { useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import { HeatmapLayer } from './heatmap-layer'
import { HeatmapControls, type HeatmapMode } from './heatmap-controls'
import { HeatmapInsights } from './heatmap-insights'
import { getHeatmapPoints, getGuStats } from '@/lib/geo/spatial-analysis'
import type { CelebrityCategory } from '@/types'
import 'leaflet/dist/leaflet.css'

const GRADIENTS: Record<HeatmapMode, Record<number, string>> = {
  density: {
    0.0: '#313695',
    0.2: '#4575b4',
    0.4: '#74add1',
    0.6: '#fee090',
    0.8: '#f46d43',
    1.0: '#a50026',
  },
  price: {
    0.0: '#1a9850',
    0.2: '#66bd63',
    0.4: '#a6d96a',
    0.6: '#fee08b',
    0.8: '#fdae61',
    1.0: '#d73027',
  },
  growth: {
    0.0: '#2166ac',
    0.3: '#67a9cf',
    0.5: '#f7f7f7',
    0.7: '#ef8a62',
    1.0: '#b2182b',
  },
}

function MapEventHandler({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
  useMapEvents({
    zoomend: (e) => onZoomChange(e.target.getZoom()),
  })
  return null
}

export function HeatmapPage() {
  const [mode, setMode] = useState<HeatmapMode>('density')
  const [categories, setCategories] = useState<CelebrityCategory[]>([
    'entertainer', 'politician', 'athlete', 'expert',
  ])
  const [insightsVisible, setInsightsVisible] = useState(false)
  const [zoom, setZoom] = useState(12)

  const heatmapPoints = useMemo(
    () => getHeatmapPoints(mode, categories.length === 4 ? undefined : categories),
    [mode, categories],
  )

  const guStats = useMemo(() => getGuStats(), [])

  const handleCategoryToggle = (category: CelebrityCategory) => {
    setCategories((prev) => {
      const exists = prev.includes(category)
      if (exists && prev.length === 1) return prev
      return exists ? prev.filter((c) => c !== category) : [...prev, category]
    })
  }

  const dynamicRadius = Math.max(15, Math.min(35, 25 + (zoom - 12) * 3))

  return (
    <div className="relative w-full h-full">
      <HeatmapControls
        mode={mode}
        onModeChange={setMode}
        categories={categories}
        onCategoryToggle={handleCategoryToggle}
      />

      <HeatmapInsights
        guStats={guStats}
        visible={insightsVisible}
        onToggle={() => setInsightsVisible((v) => !v)}
      />

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
        <MapEventHandler onZoomChange={setZoom} />
        <HeatmapLayer
          points={heatmapPoints}
          radius={dynamicRadius}
          blur={20}
          gradient={GRADIENTS[mode]}
        />
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-card/95 backdrop-blur rounded-lg shadow-lg border px-4 py-2">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground font-medium">
            {mode === 'density' ? '낮음' : mode === 'price' ? '저가' : '하락'}
          </span>
          <div
            className="w-32 h-2 rounded-full"
            style={{
              background: mode === 'density'
                ? 'linear-gradient(to right, #313695, #4575b4, #74add1, #fee090, #f46d43, #a50026)'
                : mode === 'price'
                  ? 'linear-gradient(to right, #1a9850, #66bd63, #a6d96a, #fee08b, #fdae61, #d73027)'
                  : 'linear-gradient(to right, #2166ac, #67a9cf, #f7f7f7, #ef8a62, #b2182b)',
            }}
          />
          <span className="text-[10px] text-muted-foreground font-medium">
            {mode === 'density' ? '높음' : mode === 'price' ? '고가' : '상승'}
          </span>
        </div>
        <p className="text-[10px] text-center text-muted-foreground mt-1">
          {heatmapPoints.length}개 지점 분석 중
        </p>
      </div>
    </div>
  )
}
