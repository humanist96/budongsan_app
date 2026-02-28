'use client'

import Link from 'next/link'
import { Building2, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import type { Celebrity, CelebrityCategory } from '@/types'
import { CATEGORY_LABELS } from '@/types'

interface CelebrityCardProps {
  celebrity: Celebrity
}

export function CelebrityCard({ celebrity }: CelebrityCardProps) {
  return (
    <Link href={`/celebrity/${celebrity.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg font-bold shrink-0">
              {celebrity.profile_image_url ? (
                <img
                  src={celebrity.profile_image_url}
                  alt={celebrity.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                celebrity.name[0]
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm truncate">{celebrity.name}</h3>
                <Badge variant={celebrity.category as CelebrityCategory} className="text-[10px] px-1.5 py-0">
                  {CATEGORY_LABELS[celebrity.category]}
                </Badge>
                {celebrity.property_count >= 2 && (
                  <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                    {celebrity.property_count}채
                  </Badge>
                )}
              </div>

              {celebrity.description && (
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {celebrity.description}
                </p>
              )}

              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {celebrity.property_count}건
                </span>
                {celebrity.total_asset_value > 0 && (
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {formatPrice(celebrity.total_asset_value)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
