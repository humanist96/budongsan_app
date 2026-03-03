'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Share2, RotateCcw } from 'lucide-react'
import { MbtiCelebrityMatch } from './mbti-celebrity-match'
import type { MbtiResult } from '@/data/mbti-data'

interface MbtiResultCardProps {
  result: MbtiResult
  onRetry: () => void
}

const DIMENSION_LABELS = {
  location: { left: 'G 강남권', right: 'N 비강남' },
  property: { left: 'A 아파트', right: 'B 빌딩/토지' },
  strategy: { left: 'I 실거주', right: 'T 투자' },
  scale: { left: 'C 집중', right: 'D 분산' },
} as const

function DimensionBar({ dimension, value }: { dimension: keyof typeof DIMENSION_LABELS; value: number }) {
  const labels = DIMENSION_LABELS[dimension]

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span className={value < 50 ? 'font-bold text-foreground' : ''}>{labels.left}</span>
        <span className={value >= 50 ? 'font-bold text-foreground' : ''}>{labels.right}</span>
      </div>
      <div className="relative h-3 rounded-full bg-muted overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500 transition-all duration-700 ease-out"
          style={{ width: `${Math.max(value, 5)}%` }}
        />
      </div>
    </div>
  )
}

export function MbtiResultCard({ result, onRetry }: MbtiResultCardProps) {
  const handleShare = async () => {
    const text = `나의 부동산 MBTI는 [${result.code}] ${result.name}! 나와 같은 유형의 셀럽은 ${result.celebrityName} 🏠`
    const shareUrl = `${window.location.origin}/mbti`

    if (navigator.share) {
      try {
        await navigator.share({ title: '셀럽 부동산 MBTI', text, url: shareUrl })
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(`${text}\n${shareUrl}`)
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-4 animate-in fade-in zoom-in-95 duration-500">
      <Card>
        <CardHeader className="text-center pb-2">
          <Badge className="mx-auto mb-2 bg-gradient-to-r from-pink-500 to-violet-500 text-white text-lg px-4 py-1 border-0">
            {result.code}
          </Badge>
          <h2 className="text-2xl font-bold">{result.name}</h2>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground leading-relaxed">
            {result.description}
          </p>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">성향 분석</h3>
            <DimensionBar dimension="location" value={result.dimensions.location} />
            <DimensionBar dimension="property" value={result.dimensions.property} />
            <DimensionBar dimension="strategy" value={result.dimensions.strategy} />
            <DimensionBar dimension="scale" value={result.dimensions.scale} />
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">나와 같은 유형의 셀럽</h3>
        <MbtiCelebrityMatch result={result} />
      </div>

      <div className="flex gap-3">
        <Button onClick={handleShare} className="flex-1 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white">
          <Share2 className="h-4 w-4 mr-1.5" />
          결과 공유하기
        </Button>
        <Button onClick={onRetry} variant="outline" className="flex-1">
          <RotateCcw className="h-4 w-4 mr-1.5" />
          다시 테스트하기
        </Button>
      </div>
    </div>
  )
}
