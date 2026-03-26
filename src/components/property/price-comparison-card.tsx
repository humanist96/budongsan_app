'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'

interface PriceComparisonCardProps {
  acquisitionPrice: number | null
  acquisitionDate: string | null
  currentPrices: number[]
  propertyName: string
}

export function PriceComparisonCard({
  acquisitionPrice,
  acquisitionDate,
  currentPrices,
  propertyName,
}: PriceComparisonCardProps) {
  if (currentPrices.length === 0) return null

  const sorted = [...currentPrices].sort((a, b) => a - b)
  const min = sorted[0]
  const max = sorted[sorted.length - 1]

  const hasAcquisition = acquisitionPrice && acquisitionPrice > 0
  const returnMin = hasAcquisition
    ? ((min - acquisitionPrice) / acquisitionPrice) * 100
    : null
  const returnMax = hasAcquisition
    ? ((max - acquisitionPrice) / acquisitionPrice) * 100
    : null

  const isPositive = returnMin !== null && returnMin > 0
  const isNegative = returnMax !== null && returnMax < 0

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* 매입가 */}
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
              셀럽 매입가
            </p>
            <p className="text-lg font-bold">
              {hasAcquisition ? `${formatPrice(acquisitionPrice)}원` : '미공개'}
            </p>
            {acquisitionDate && (
              <p className="text-[10px] text-muted-foreground">{acquisitionDate}</p>
            )}
          </div>

          {/* 현재 호가 */}
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
              현재 호가
            </p>
            <p className="text-lg font-bold">
              {min === max
                ? `${formatPrice(min)}원`
                : `${formatPrice(min)}~${formatPrice(max)}원`}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {currentPrices.length}건 기준
            </p>
          </div>
        </div>

        {/* 수익률 */}
        {hasAcquisition && returnMin !== null && returnMax !== null && (
          <div className={`mt-3 p-2.5 rounded-lg flex items-center justify-between ${
            isPositive ? 'bg-green-50 dark:bg-green-950/30' :
            isNegative ? 'bg-red-50 dark:bg-red-950/30' :
            'bg-muted/50'
          }`}>
            <div className="flex items-center gap-1.5">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : isNegative ? (
                <TrendingDown className="h-4 w-4 text-red-600" />
              ) : (
                <Minus className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-xs font-medium">예상 수익률</span>
            </div>
            <span className={`text-sm font-bold ${
              isPositive ? 'text-green-600' :
              isNegative ? 'text-red-600' :
              'text-muted-foreground'
            }`}>
              {returnMin === returnMax
                ? `${returnMin > 0 ? '+' : ''}${returnMin.toFixed(1)}%`
                : `${returnMin > 0 ? '+' : ''}${returnMin.toFixed(1)}% ~ ${returnMax > 0 ? '+' : ''}${returnMax.toFixed(1)}%`}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
