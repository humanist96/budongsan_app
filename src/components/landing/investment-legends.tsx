'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { TrendingUp, ArrowRight, Flame } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils/format'

// ─── Types ──────────────────────────────────────────────────

interface InvestmentLegend {
  readonly name: string
  readonly category: string
  readonly purchasePrice: number // 만원
  readonly currentPrice: number // 만원
  readonly multiplier: number
  readonly story: string
  readonly profileImageUrl: string | null
}

// ─── Data ───────────────────────────────────────────────────

const legends: readonly InvestmentLegend[] = [
  {
    name: '서장훈',
    category: 'MC',
    purchasePrice: 281700,
    currentPrice: 4500000,
    multiplier: 16,
    story: '경매 낙찰로 시작한 부동산 전설',
    profileImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Seo_Jang-Hoon.jpg',
  },
  {
    name: '박찬호',
    category: '야구',
    purchasePrice: 700000,
    currentPrice: 8000000,
    multiplier: 11,
    story: '연 임대수익만 13억',
    profileImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Chan_Ho_Park_Yankees.jpg/200px-Chan_Ho_Park_Yankees.jpg',
  },
  {
    name: '유재석',
    category: 'MC',
    purchasePrice: 45000,
    currentPrice: 300000,
    multiplier: 7,
    story: '2000년 압구정 4.5억에 매입',
    profileImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Yoo_Jae_Suk_going_to_work_at_Happy_Together_on_August_19%2C_2017_%281%29.jpg/200px-Yoo_Jae_Suk_going_to_work_at_Happy_Together_on_August_19%2C_2017_%281%29.jpg',
  },
  {
    name: '김연아',
    category: '피겨',
    purchasePrice: 220000,
    currentPrice: 850000,
    multiplier: 4,
    story: '흑석동 마크힐스 2011년 매입',
    profileImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/YuNaKimInVancouver.jpg/200px-YuNaKimInVancouver.jpg',
  },
  {
    name: '이승엽',
    category: '야구',
    purchasePrice: 2930000,
    currentPrice: 11670000,
    multiplier: 4,
    story: '+874억, 절대수익 최대',
    profileImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Lee_Seung-Yeop_%EC%9D%B4%EC%8A%B9%EC%97%BD_%EC%9D%BC%EA%B5%AC%EC%83%81_2016.png/200px-Lee_Seung-Yeop_%EC%9D%B4%EC%8A%B9%EC%97%BD_%EC%9D%BC%EA%B5%AC%EC%83%81_2016.png',
  },
]

// ─── AnimatedPrice ──────────────────────────────────────────

function AnimatedPrice({
  end,
  isVisible,
  delay,
}: {
  readonly end: number
  readonly isVisible: boolean
  readonly delay: number
}) {
  const [count, setCount] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return
    hasAnimated.current = true

    const duration = 1500
    const startTime = performance.now()

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime - delay
      if (elapsed < 0) {
        requestAnimationFrame(animate)
        return
      }
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [end, isVisible, delay])

  return <>{formatPrice(count)}</>
}

// ─── Legend card ─────────────────────────────────────────────

function LegendCard({
  legend,
  index,
  isVisible,
}: {
  readonly legend: InvestmentLegend
  readonly index: number
  readonly isVisible: boolean
}) {
  const delay = index * 200

  return (
    <div
      className="rounded-2xl border border-emerald-200/50 bg-white/80 dark:bg-emerald-950/40 dark:border-emerald-800/50 p-5 shadow-md hover:shadow-lg transition-all duration-300"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {legend.profileImageUrl && (
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-emerald-200 dark:ring-emerald-700 shrink-0">
              <Image src={legend.profileImageUrl} alt={legend.name} width={40} height={40} className="w-full h-full object-cover" unoptimized />
            </div>
          )}
          <div>
            <h3 className="font-bold text-lg">{legend.name}</h3>
            <span className="text-xs text-muted-foreground">{legend.category}</span>
          </div>
        </div>
        <Badge
          className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 text-base font-black px-3 py-1 animate-pulse"
        >
          ×{legend.multiplier}
        </Badge>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 text-center">
          <div className="text-xs text-muted-foreground mb-1">매입가</div>
          <div className="text-sm md:text-base font-bold">
            <AnimatedPrice
              end={legend.purchasePrice}
              isVisible={isVisible}
              delay={delay}
            />
          </div>
        </div>

        <ArrowRight className="h-5 w-5 text-emerald-500 shrink-0" />

        <div className="flex-1 text-center">
          <div className="text-xs text-muted-foreground mb-1">현재 시세</div>
          <div className="text-sm md:text-base font-black text-emerald-600 dark:text-emerald-400">
            <AnimatedPrice
              end={legend.currentPrice}
              isVisible={isVisible}
              delay={delay + 300}
            />
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground flex items-center gap-1">
        <Flame className="h-3 w-3 text-orange-400" />
        {legend.story}
      </div>
    </div>
  )
}

// ─── Main section ───────────────────────────────────────────

export function InvestmentLegends() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = sectionRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30"
    >
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex items-center justify-center gap-2 mb-3">
          <TrendingUp className="h-7 w-7 text-emerald-500" />
          <h2 className="text-3xl md:text-4xl font-black text-center">
            부동산 투자의 전설
          </h2>
        </div>
        <p className="text-center text-muted-foreground mb-10 md:mb-14">
          &ldquo;그때 샀으면...&rdquo; FOMO를 자극하는 수익률 레전드
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {legends.map((legend, idx) => (
            <LegendCard
              key={legend.name}
              legend={legend}
              index={idx}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
