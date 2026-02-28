'use client'

import { useEffect, useRef, useState } from 'react'
import { TrendingUp, Clock, Star, Building2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { CelebrityCategory } from '@/types'
import type { PortfolioROI } from '@/data/timeline-helpers'
import { formatPrice } from '@/lib/utils/format'

// ─── AnimatedCounter ────────────────────────────────────────

function AnimatedCounter({
  end,
  isVisible,
  suffix = '',
}: {
  readonly end: number
  readonly isVisible: boolean
  readonly suffix?: string
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000
    const startTime = performance.now()

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [end, isVisible])

  return (
    <>
      {count.toLocaleString()}
      {suffix}
    </>
  )
}

// ─── Main Component ─────────────────────────────────────────

const CATEGORY_GRADIENTS: Record<CelebrityCategory, string> = {
  entertainer: 'from-pink-500/10 to-rose-500/10 dark:from-pink-500/20 dark:to-rose-500/20',
  politician: 'from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20',
  athlete: 'from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20',
  expert: 'from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20',
}

const CATEGORY_ACCENT: Record<CelebrityCategory, string> = {
  entertainer: 'text-pink-600 dark:text-pink-400',
  politician: 'text-blue-600 dark:text-blue-400',
  athlete: 'text-emerald-600 dark:text-emerald-400',
  expert: 'text-amber-600 dark:text-amber-400',
}

interface PortfolioSummaryProps {
  readonly roi: PortfolioROI
  readonly category: CelebrityCategory
}

export function PortfolioSummary({ roi, category }: PortfolioSummaryProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = cardRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const hasEstimates = roi.currentValue > 0 && roi.currentValue !== roi.totalInvestment
  const investmentEok = Math.round(roi.totalInvestment / 10000)
  const currentEok = Math.round(roi.currentValue / 10000)

  return (
    <Card ref={cardRef} className="overflow-hidden">
      <CardContent className={`p-6 bg-gradient-to-br ${CATEGORY_GRADIENTS[category]}`}>
        {/* 투자액 → 현재가치 */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-center flex-1">
            <p className="text-xs text-muted-foreground mb-1">총 투자액</p>
            <p className="text-2xl md:text-3xl font-black">
              <AnimatedCounter end={investmentEok} isVisible={isVisible} />
              <span className="text-base font-medium ml-0.5">억</span>
            </p>
          </div>

          {hasEstimates && (
            <>
              <div className="mx-4 text-muted-foreground">
                <TrendingUp className="h-5 w-5" />
              </div>

              <div className="text-center flex-1">
                <p className="text-xs text-muted-foreground mb-1">현재 추정가치</p>
                <p className={`text-2xl md:text-3xl font-black ${CATEGORY_ACCENT[category]}`}>
                  <AnimatedCounter end={currentEok} isVisible={isVisible} />
                  <span className="text-base font-medium ml-0.5">억</span>
                </p>
              </div>
            </>
          )}
        </div>

        {/* 하단 통계 */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
          {hasEstimates && (
            <div className="flex items-center gap-2">
              <TrendingUp className={`h-4 w-4 shrink-0 ${CATEGORY_ACCENT[category]}`} />
              <div>
                <p className="text-[10px] text-muted-foreground">수익률</p>
                <p className={`text-sm font-bold ${roi.roi > 0 ? CATEGORY_ACCENT[category] : 'text-red-500'}`}>
                  {roi.roi > 0 ? '+' : ''}{roi.roi}%
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-[10px] text-muted-foreground">평균 보유</p>
              <p className="text-sm font-bold">{roi.holdingYears}년</p>
            </div>
          </div>

          {roi.topMultiplier > 1 && (
            <div className="flex items-center gap-2">
              <Star className={`h-4 w-4 shrink-0 ${CATEGORY_ACCENT[category]}`} />
              <div>
                <p className="text-[10px] text-muted-foreground">최고수익</p>
                <p className={`text-sm font-bold ${CATEGORY_ACCENT[category]}`}>
                  x{roi.topMultiplier}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-[10px] text-muted-foreground">보유 매물</p>
              <p className="text-sm font-bold">
                {roi.propertyCount}건
                {roi.disposedCount > 0 && (
                  <span className="text-muted-foreground font-normal text-xs ml-1">
                    (+{roi.disposedCount} 매도)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
