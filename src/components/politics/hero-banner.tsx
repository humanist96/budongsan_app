'use client'

import { Scale, Users } from 'lucide-react'
import type { PoliticalGroupStats } from '@/lib/politics/political-stats'

interface HeroBannerProps {
  progressive: PoliticalGroupStats
  conservative: PoliticalGroupStats
}

export function HeroBanner({ progressive, conservative }: HeroBannerProps) {
  const totalProperties = progressive.totalProperties + conservative.totalProperties

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-red-500 p-8 text-white shadow-xl md:p-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_60%)]" />
      <div className="relative z-10 text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <Scale className="h-8 w-8 md:h-10 md:w-10" />
        </div>
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight md:text-4xl">
          진보 vs 보수 — 정치인 부동산 비교
        </h1>
        <p className="mx-auto max-w-xl text-lg text-white/80">
          공직자 재산공개 자료 기반, 정치 성향별 부동산 보유 현황을 한눈에
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm font-medium md:text-base">
          <span className="flex items-center gap-2 rounded-full bg-blue-500/30 px-4 py-1.5 backdrop-blur">
            <Users className="h-4 w-4" />
            진보 {progressive.count}명
          </span>
          <span className="flex items-center gap-2 rounded-full bg-red-500/30 px-4 py-1.5 backdrop-blur">
            <Users className="h-4 w-4" />
            보수 {conservative.count}명
          </span>
          <span className="rounded-full bg-white/20 px-4 py-1.5 backdrop-blur">
            총 매물 {totalProperties}건
          </span>
        </div>
      </div>
    </section>
  )
}
