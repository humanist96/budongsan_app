'use client'

import { useEffect, useRef, useState } from 'react'
import { Building2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils/format'
import { celebrities, properties, celebrityProperties } from '@/data/celebrity-seed-data'
import type { CelebrityCategory } from '@/types/celebrity'

// ─── Types ──────────────────────────────────────────────────

interface NeighborResident {
  readonly name: string
  readonly category: CelebrityCategory
  readonly initial: string
}

interface NeighborBuilding {
  readonly propertyId: string
  readonly buildingName: string
  readonly residents: readonly NeighborResident[]
  readonly chemistryTag: string
  readonly totalPrice: number
}

// ─── Data computation (module-level) ────────────────────────

const CATEGORY_RING_COLORS: Record<CelebrityCategory, string> = {
  entertainer: 'ring-pink-400',
  politician: 'ring-blue-400',
  athlete: 'ring-green-400',
}

const CATEGORY_BG_COLORS: Record<CelebrityCategory, string> = {
  entertainer: 'bg-pink-500',
  politician: 'bg-blue-500',
  athlete: 'bg-green-500',
}

const CHEMISTRY_GRADIENTS: readonly string[] = [
  'from-pink-500 to-blue-500',
  'from-pink-500 to-purple-500',
  'from-pink-500 to-green-500',
  'from-green-500 to-green-600',
  'from-pink-500 to-green-500',
  'from-blue-500 to-blue-600',
  'from-blue-500 to-green-500',
]

function computeNeighborBuildings(): readonly NeighborBuilding[] {
  const celebMap = new Map(celebrities.map((c) => [c.id, c]))
  const propMap = new Map(properties.map((p) => [p.id, p]))

  const byProperty = new Map<string, typeof celebrityProperties>()
  for (const cp of celebrityProperties) {
    const existing = byProperty.get(cp.propertyId) ?? []
    byProperty.set(cp.propertyId, [...existing, cp])
  }

  const targetBuildings: {
    propertyId: string
    chemistryTag: string
  }[] = [
    { propertyId: 'prop-007', chemistryTag: 'K-pop × 정치' },
    { propertyId: 'prop-016', chemistryTag: '1세대 × 3세대 한류' },
    { propertyId: 'prop-065', chemistryTag: '배우 × K-pop × 축구' },
    { propertyId: 'prop-035', chemistryTag: 'MLB 동기' },
    { propertyId: 'prop-038', chemistryTag: 'K-pop × EPL' },
    { propertyId: 'prop-025', chemistryTag: '보수 정치 올스타' },
    { propertyId: 'prop-054', chemistryTag: '시장 × EPL' },
  ]

  const results: NeighborBuilding[] = []

  for (const { propertyId, chemistryTag } of targetBuildings) {
    const prop = propMap.get(propertyId)
    const cps = byProperty.get(propertyId) ?? []
    if (!prop || cps.length < 2) continue

    const seen = new Set<string>()
    const residents: NeighborResident[] = []
    let totalPrice = 0

    for (const cp of cps) {
      if (seen.has(cp.celebrityId)) continue
      seen.add(cp.celebrityId)
      const celeb = celebMap.get(cp.celebrityId)
      if (!celeb) continue
      residents.push({
        name: celeb.name,
        category: celeb.category,
        initial: celeb.name.replace(/^BTS\s/, '').charAt(0),
      })
      totalPrice += cp.price ?? 0
    }

    if (residents.length >= 2) {
      results.push({
        propertyId,
        buildingName: prop.name,
        residents,
        chemistryTag,
        totalPrice,
      })
    }
  }

  return results
}

const neighborBuildings = computeNeighborBuildings()

// ─── Card component ─────────────────────────────────────────

function NeighborCard({
  building,
  gradientIndex,
  isVisible,
}: {
  readonly building: NeighborBuilding
  readonly gradientIndex: number
  readonly isVisible: boolean
}) {
  const gradient = CHEMISTRY_GRADIENTS[gradientIndex % CHEMISTRY_GRADIENTS.length]

  return (
    <div className="snap-center shrink-0 w-[320px] md:w-[360px]">
      <div className="relative rounded-2xl border bg-card p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-bold text-lg truncate">{building.buildingName}</h3>
        </div>

        <div className="relative flex flex-wrap justify-center gap-4 my-6 min-h-[120px]">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
          >
            {building.residents.map((_, i) => {
              if (i === 0) return null
              const total = building.residents.length
              const getPos = (idx: number) => {
                const angle = (idx / total) * Math.PI * 2 - Math.PI / 2
                return {
                  x: 50 + Math.cos(angle) * 30,
                  y: 50 + Math.sin(angle) * 30,
                }
              }
              const from = getPos(0)
              const to = getPos(i)
              return (
                <line
                  key={`line-${i}`}
                  x1={`${from.x}%`}
                  y1={`${from.y}%`}
                  x2={`${to.x}%`}
                  y2={`${to.y}%`}
                  stroke="currentColor"
                  className="text-muted-foreground/30"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transition: `opacity 0.5s ease ${0.3 + i * 0.15}s`,
                  }}
                />
              )
            })}
          </svg>

          {building.residents.map((resident, i) => {
            const total = building.residents.length
            const angle = (i / total) * Math.PI * 2 - Math.PI / 2
            const x = 50 + Math.cos(angle) * 30
            const y = 50 + Math.sin(angle) * 30

            return (
              <div
                key={resident.name}
                className="absolute flex flex-col items-center gap-1"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  opacity: isVisible ? 1 : 0,
                  transition: `opacity 0.4s ease ${i * 0.15}s, transform 0.4s ease ${i * 0.15}s`,
                }}
              >
                <div
                  className={`w-12 h-12 rounded-full ${CATEGORY_BG_COLORS[resident.category]} ring-2 ${CATEGORY_RING_COLORS[resident.category]} ring-offset-2 ring-offset-background flex items-center justify-center text-white font-bold text-sm shadow-md`}
                >
                  {resident.initial}
                </div>
                <span className="text-[11px] font-medium text-center leading-tight max-w-[80px] truncate">
                  {resident.name}
                </span>
              </div>
            )
          })}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Badge
            className={`bg-gradient-to-r ${gradient} text-white border-0 text-[11px] px-2 py-0.5`}
          >
            {building.chemistryTag}
          </Badge>
          <span className="text-sm font-bold text-muted-foreground">
            합산 {formatPrice(building.totalPrice)}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Main section ───────────────────────────────────────────

export function NeighborGraph() {
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
      className="py-16 md:py-24 bg-gradient-to-r from-violet-50 to-pink-50 dark:from-violet-950/30 dark:to-pink-950/30"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Building2 className="h-7 w-7 text-violet-500" />
          <h2 className="text-3xl md:text-4xl font-black text-center">
            이 건물에 누가 살까?
          </h2>
        </div>
        <p className="text-center text-muted-foreground mb-10 md:mb-14">
          같은 건물, 의외의 조합. 셀럽 이웃 관계도
        </p>

        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent -mx-4 px-4">
          {neighborBuildings.map((building, idx) => (
            <NeighborCard
              key={building.propertyId}
              building={building}
              gradientIndex={idx}
              isVisible={isVisible}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/map">
            <Button variant="outline" className="gap-2">
              지도에서 확인하기 <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
