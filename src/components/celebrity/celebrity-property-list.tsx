'use client'

import Link from 'next/link'
import { MapPin, Calendar, ExternalLink, ShieldCheck, Newspaper, HelpCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice, formatArea, formatDate } from '@/lib/utils'
import { PROPERTY_TYPE_LABELS } from '@/types'
import type { Property, VerificationStatus } from '@/types'

interface CelebrityPropertyItem {
  id: string
  ownership_type: string
  acquisition_date: string | null
  acquisition_price: number | null
  source_url: string | null
  verification_status: VerificationStatus
  properties: Property
}

interface CelebrityPropertyListProps {
  items: CelebrityPropertyItem[]
  totalAssetValue: number
}

const verificationIcons: Record<VerificationStatus, typeof ShieldCheck> = {
  verified: ShieldCheck,
  reported: Newspaper,
  unverified: HelpCircle,
}

const verificationLabels: Record<VerificationStatus, string> = {
  verified: '공식 데이터',
  reported: '언론 보도',
  unverified: '미확인',
}

export function CelebrityPropertyList({ items, totalAssetValue }: CelebrityPropertyListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg">보유 부동산 ({items.length}건)</h2>
        {totalAssetValue > 0 && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">총 자산가치</p>
            <p className="font-bold text-primary">{formatPrice(totalAssetValue)}원</p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const prop = item.properties
          const VerIcon = verificationIcons[item.verification_status]

          return (
            <Link key={item.id} href={`/property/${prop.id}`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm truncate">{prop.name}</h3>
                        <Badge variant="outline" className="text-[10px] shrink-0">
                          {PROPERTY_TYPE_LABELS[prop.property_type]}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{prop.address}</span>
                      </div>

                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        {prop.exclusive_area && (
                          <span>{formatArea(prop.exclusive_area)}</span>
                        )}
                        {item.acquisition_date && (
                          <span className="flex items-center gap-0.5">
                            <Calendar className="h-3 w-3" />
                            {formatDate(item.acquisition_date)}
                          </span>
                        )}
                        <span className="flex items-center gap-0.5">
                          <VerIcon className="h-3 w-3" />
                          {verificationLabels[item.verification_status]}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-3">
                      {(item.acquisition_price || prop.latest_transaction_price) && (
                        <p className="font-bold text-sm text-primary">
                          {formatPrice(item.acquisition_price || prop.latest_transaction_price!)}원
                        </p>
                      )}
                      {item.source_url && (
                        <a
                          href={item.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-blue-500 flex items-center gap-0.5 mt-1 justify-end"
                          onClick={(e) => e.stopPropagation()}
                        >
                          출처 <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
