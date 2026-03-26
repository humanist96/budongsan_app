'use client'

import dynamic from 'next/dynamic'

const CatchmentPage = dynamic(
  () => import('@/components/catchment/catchment-page').then((m) => m.CatchmentPage),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[calc(100vh-3.5rem)] flex items-center justify-center bg-muted">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">생활권 분석을 준비 중...</p>
        </div>
      </div>
    ),
  },
)

export default function CatchmentRoute() {
  return <CatchmentPage />
}
