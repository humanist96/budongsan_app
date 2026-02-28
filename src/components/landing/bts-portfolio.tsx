'use client'

import { useEffect, useRef, useState } from 'react'
import { Music, ChevronDown, Banknote } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils/format'

// ─── Types ──────────────────────────────────────────────────

interface BTSProperty {
  readonly name: string
  readonly price: number // 만원
}

interface BTSMember {
  readonly name: string
  readonly stage: string
  readonly totalPrice: number // 만원
  readonly cashPurchase: boolean
  readonly properties: readonly BTSProperty[]
}

// ─── Data ───────────────────────────────────────────────────

const btsMembers: readonly BTSMember[] = [
  {
    name: '김석진',
    stage: '진',
    totalPrice: 2626000,
    cashPurchase: true,
    properties: [
      { name: '한남더힐 233㎡', price: 449000 },
      { name: '한남더힐 206㎡', price: 427000 },
      { name: '한남더힐 PH 243㎡', price: 1750000 },
    ],
  },
  {
    name: '김태형',
    stage: '뷔',
    totalPrice: 1420000,
    cashPurchase: true,
    properties: [{ name: 'PH129 청담 273㎡', price: 1420000 }],
  },
  {
    name: '정호석',
    stage: '제이홉',
    totalPrice: 1200000,
    cashPurchase: true,
    properties: [{ name: '아페르한강 PH 232㎡', price: 1200000 }],
  },
  {
    name: '전정국',
    stage: '정국',
    totalPrice: 958000,
    cashPurchase: false,
    properties: [
      { name: '이태원 대저택 633㎡', price: 763000 },
      { name: '트리마제', price: 195000 },
    ],
  },
  {
    name: '김남준',
    stage: 'RM',
    totalPrice: 636000,
    cashPurchase: true,
    properties: [{ name: '나인원한남 244㎡', price: 636000 }],
  },
  {
    name: '박지민',
    stage: '지민',
    totalPrice: 590000,
    cashPurchase: true,
    properties: [{ name: '나인원한남 244㎡', price: 590000 }],
  },
  {
    name: '민윤기',
    stage: '슈가',
    totalPrice: 340000,
    cashPurchase: false,
    properties: [{ name: '한남리버힐 244㎡', price: 340000 }],
  },
]

const TOTAL_PRICE = btsMembers.reduce((sum, m) => sum + m.totalPrice, 0)
const TOTAL_PROPERTIES = btsMembers.reduce((sum, m) => sum + m.properties.length, 0)
const CASH_COUNT = btsMembers.filter((m) => m.cashPurchase).length
const MAX_PRICE = btsMembers[0].totalPrice

// ─── AnimatedCounter ────────────────────────────────────────

function AnimatedCounter({
  end,
  isVisible,
}: {
  readonly end: number
  readonly isVisible: boolean
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

  return <>{count.toLocaleString()}</>
}

// ─── Member row ─────────────────────────────────────────────

function MemberRow({
  member,
  isVisible,
  index,
}: {
  readonly member: BTSMember
  readonly isVisible: boolean
  readonly index: number
}) {
  const [isOpen, setIsOpen] = useState(false)
  const percentage = (member.totalPrice / MAX_PRICE) * 100

  return (
    <div className="group">
      <button
        type="button"
        className="w-full text-left"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="flex items-center gap-3 py-3">
          <div className="w-16 md:w-20 shrink-0 text-right">
            <span className="text-white/90 font-bold text-sm md:text-base">
              {member.stage}
            </span>
          </div>

          <div className="flex-1 relative">
            <div className="h-8 md:h-10 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-end pr-3 transition-all duration-1000 ease-out"
                style={{
                  width: isVisible ? `${Math.max(percentage, 15)}%` : '0%',
                  transitionDelay: `${index * 150}ms`,
                }}
              >
                <span className="text-white text-xs md:text-sm font-bold whitespace-nowrap">
                  {formatPrice(member.totalPrice)}
                </span>
              </div>
            </div>
          </div>

          <div className="w-10 shrink-0 flex items-center justify-center gap-1">
            {member.cashPurchase && (
              <Badge className="bg-yellow-500/90 text-white border-0 text-[9px] px-1.5 py-0 animate-pulse">
                현금
              </Badge>
            )}
          </div>

          <ChevronDown
            className={`h-4 w-4 text-white/50 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="ml-[76px] md:ml-[92px] pb-3 animate-in fade-in slide-in-from-top-1 duration-200">
          {member.properties.map((prop) => (
            <div
              key={prop.name}
              className="flex items-center justify-between py-1.5 text-sm text-white/70"
            >
              <span className="truncate mr-2">{prop.name}</span>
              <span className="shrink-0 font-semibold text-white/90">
                {formatPrice(prop.price)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main section ───────────────────────────────────────────

export function BTSPortfolio() {
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
      className="py-16 md:py-24 bg-gradient-to-br from-purple-950 via-violet-900 to-indigo-950"
    >
      <div className="mx-auto max-w-3xl px-4">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Music className="h-7 w-7 text-purple-300" />
          <h2 className="text-3xl md:text-4xl font-black text-center text-white">
            BTS 부동산 우주
          </h2>
        </div>
        <p className="text-center text-purple-200/70 mb-10 md:mb-14">
          방탄소년단 7인의 부동산 포트폴리오 한눈에 비교
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-10">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-black text-white">
              <AnimatedCounter
                end={Math.round(TOTAL_PRICE / 10000)}
                isVisible={isVisible}
              />
              억+
            </div>
            <div className="text-purple-300/70 text-sm mt-1">총 부동산 자산</div>
          </div>

          <div className="h-10 w-px bg-white/20 hidden md:block" />

          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white">
              {TOTAL_PROPERTIES}채
            </div>
            <div className="text-purple-300/70 text-sm mt-1">총 보유 매물</div>
          </div>

          <div className="h-10 w-px bg-white/20 hidden md:block" />

          <div className="text-center flex flex-col items-center">
            <Badge className="bg-yellow-500/90 text-white border-0 text-sm px-3 py-1 animate-pulse">
              <Banknote className="h-4 w-4 mr-1" />
              {CASH_COUNT}/7 전액현금
            </Badge>
          </div>
        </div>

        <div className="divide-y divide-white/10">
          {btsMembers.map((member, idx) => (
            <MemberRow
              key={member.stage}
              member={member}
              isVisible={isVisible}
              index={idx}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
