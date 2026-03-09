'use client'

import Image from 'next/image'
import { Crown, Share2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PROPERTY_TYPE_LABELS } from '@/types/property'
import { formatPrice, formatArea } from '@/lib/utils/format'
import type { WorldCupItem } from '@/data/worldcup-data'
import type { TasteProfile } from '@/data/worldcup-data'
import { PRICE_RANGE_LABELS } from '@/data/worldcup-data'

interface WorldCupResultProps {
  winner: WorldCupItem
  profile: TasteProfile
  onRetry: () => void
}

export function WorldCupResult({ winner, profile, onRetry }: WorldCupResultProps) {
  const handleShare = async () => {
    const text = `부동산 이상형 월드컵 결과!\n내 드림하우스: ${winner.propertyName} (${winner.celebrityName})\n내 취향: ${profile.style.emoji} ${profile.style.name}\n\n셀럽하우스맵에서 도전하세요!`
    const url = typeof window !== 'undefined' ? window.location.href : ''

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: '부동산 이상형 월드컵', text, url })
      } catch {
        // user cancelled
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(`${text}\n${url}`)
      alert('결과가 클립보드에 복사되었습니다!')
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg animate-in fade-in zoom-in-95 duration-500 space-y-6">
      <div className="relative rounded-2xl border-4 border-amber-400 bg-card p-6 shadow-xl">
        <div className="absolute -top-5 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1 rounded-full bg-amber-400 px-4 py-1.5 text-sm font-bold text-white shadow">
            <Crown className="h-4 w-4" />
            우승
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center gap-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-amber-300 shadow-lg">
            {winner.profileImageUrl ? (
              <Image
                src={winner.profileImageUrl}
                alt={winner.celebrityName}
                fill
                className="object-cover"
                sizes="96px"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted text-2xl font-bold">
                {winner.celebrityName[0]}
              </div>
            )}
          </div>

          <div className="text-center">
            <p className="text-lg font-bold">{winner.celebrityName}</p>
            <p className="mt-1 text-base font-semibold">{winner.propertyName}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-muted px-2.5 py-1">
              🏷️ {PROPERTY_TYPE_LABELS[winner.propertyType]}
            </span>
            <span className="rounded-full bg-muted px-2.5 py-1">
              📍 {winner.district}
            </span>
            {(winner.currentValue ?? winner.price) !== null && (
              <span className="rounded-full bg-muted px-2.5 py-1">
                💰 {formatPrice((winner.currentValue ?? winner.price)!)}
              </span>
            )}
            {winner.exclusiveArea !== null && (
              <span className="rounded-full bg-muted px-2.5 py-1">
                📐 {formatArea(winner.exclusiveArea)}
              </span>
            )}
          </div>

          {winner.highlight && (
            <p className="rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              ✨ {winner.highlight}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5 space-y-4">
        <h3 className="text-center text-lg font-bold">
          {profile.style.emoji} {profile.style.name}
        </h3>
        <p className="text-center text-sm text-muted-foreground">
          {profile.style.description}
        </p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-xs text-muted-foreground">선호 지역</p>
            <p className="mt-1 font-semibold">{profile.preferredDistrict}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-xs text-muted-foreground">선호 유형</p>
            <p className="mt-1 font-semibold">
              {PROPERTY_TYPE_LABELS[profile.preferredType as keyof typeof PROPERTY_TYPE_LABELS] ?? profile.preferredType}
            </p>
          </div>
          <div className="col-span-2 rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-xs text-muted-foreground">가격대</p>
            <p className="mt-1 font-semibold">{PRICE_RANGE_LABELS[profile.priceRange]}</p>
          </div>
        </div>

        {profile.matchedCelebs.length > 0 && (
          <div className="rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 p-3 text-center dark:from-amber-950/50 dark:to-orange-950/50">
            <p className="text-xs text-muted-foreground">같은 취향 셀럽</p>
            <p className="mt-1 text-sm font-semibold">
              {profile.matchedCelebs.join(', ')}
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={onRetry}
        >
          <RotateCcw className="h-4 w-4" />
          다시 하기
        </Button>
        <Button
          className="flex-1 gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
          공유하기
        </Button>
      </div>
    </div>
  )
}
