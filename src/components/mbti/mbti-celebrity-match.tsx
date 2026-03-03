'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ExternalLink } from 'lucide-react'
import { celebrities as seedCelebrities } from '@/data/celebrity-seed-data'
import { CATEGORY_LABELS } from '@/types'
import type { MbtiResult } from '@/data/mbti-data'

interface MbtiCelebrityMatchProps {
  result: MbtiResult
}

export function MbtiCelebrityMatch({ result }: MbtiCelebrityMatchProps) {
  const celeb = seedCelebrities.find((c) => c.id === result.celebrityId)

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
            {celeb?.profileImageUrl ? (
              <Image
                src={celeb.profileImageUrl}
                alt={result.celebrityName}
                width={64}
                height={64}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-muted-foreground">
                {result.celebrityName[0]}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-lg">{result.celebrityName}</span>
              {celeb && (
                <Badge variant={celeb.category as 'entertainer' | 'politician' | 'athlete' | 'expert'}>
                  {CATEGORY_LABELS[celeb.category]}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{result.celebrityDetail}</p>
          </div>
        </div>

        <Link
          href={`/celebrity/${result.celebrityId}`}
          className="mt-3 flex items-center justify-center gap-1.5 text-sm text-pink-500 hover:text-pink-600 font-medium"
        >
          이 셀럽 자세히 보기
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </CardContent>
    </Card>
  )
}
