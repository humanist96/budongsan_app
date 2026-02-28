'use client'

import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { Popup } from 'react-leaflet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import type { CelebrityCategory } from '@/types'
import { CATEGORY_LABELS } from '@/types'

interface MarkerPopupProps {
  celebrityId: string
  celebrityName: string
  category: CelebrityCategory
  propertyName: string
  address: string
  price: number | null
  propertyCount: number
  propertyId: string
}

export function MarkerPopup({
  celebrityId,
  celebrityName,
  category,
  propertyName,
  address,
  price,
  propertyCount,
  propertyId,
}: MarkerPopupProps) {
  return (
    <Popup>
      <div className="min-w-[240px] max-w-[300px] p-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-bold text-sm">{celebrityName}</h3>
          <Badge variant={category} className="text-[10px] px-1.5 py-0">
            {CATEGORY_LABELS[category]}
          </Badge>
          {propertyCount >= 2 && (
            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
              {propertyCount}채
            </Badge>
          )}
        </div>

        <div className="mt-2 space-y-1">
          <p className="font-medium text-xs">{propertyName}</p>
          <p className="text-[11px] text-gray-500">{address}</p>
          {price && (
            <p className="text-xs font-bold">{formatPrice(price)}원</p>
          )}
        </div>

        <div className="mt-2 flex gap-2">
          <Link href={`/celebrity/${celebrityId}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full gap-1 text-xs h-7">
              셀럽 정보
              <ExternalLink className="h-3 w-3" />
            </Button>
          </Link>
          <Link href={`/property/${propertyId}`} className="flex-1">
            <Button size="sm" className="w-full gap-1 text-xs h-7">
              매물 상세
              <ExternalLink className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    </Popup>
  )
}
