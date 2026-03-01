'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { MapPin, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CounterProps {
  readonly end: number
  readonly suffix: string
  readonly label: string
}

function AnimatedCounter({ end, suffix, label }: CounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
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
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [end])

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-black text-white drop-shadow-lg">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-white/80 text-sm md:text-base mt-1">{label}</div>
    </div>
  )
}

const stats = [
  { end: 98, suffix: '명', label: '셀럽' },
  { end: 149, suffix: '건', label: '매물 정보' },
  { end: 15600, suffix: '억', label: '총 자산가치' },
] as const

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 px-4 py-20 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent_50%)]" />

      <div className="relative mx-auto max-w-4xl text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white drop-shadow-lg leading-tight">
          스타들은 어디에 살까?
        </h1>

        <p className="mt-4 md:mt-6 text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
          연예인 · 정치인 · 운동선수 <strong>98명</strong>의 부동산{' '}
          <strong>149건</strong>을 지도에서 탐험하세요
        </p>

        <div className="mt-10 md:mt-14 grid grid-cols-3 gap-6 md:gap-12 max-w-lg mx-auto">
          {stats.map((stat) => (
            <AnimatedCounter
              key={stat.label}
              end={stat.end}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </div>

        <div className="mt-10 md:mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/map">
            <Button
              size="lg"
              className="h-12 px-8 text-base font-bold bg-white text-purple-600 hover:bg-white/90 shadow-xl"
            >
              <MapPin className="h-5 w-5" />
              지도에서 탐험하기
            </Button>
          </Link>
          <Link href="/rankings">
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base font-bold border-2 border-white text-white hover:bg-white/10 bg-transparent"
            >
              <Trophy className="h-5 w-5" />
              셀럽 랭킹 보기
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
