'use client'

import dynamic from 'next/dynamic'

const HeatmapPage = dynamic(
  () => import('@/components/heatmap/heatmap-page').then((m) => m.HeatmapPage),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">히트맵을 불러오는 중...</p>
        </div>
      </div>
    ),
  },
)

export default function HeatmapRoute() {
  return (
    <div className="h-[calc(100vh-3.5rem)]">
      <HeatmapPage />
    </div>
  )
}
