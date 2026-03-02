'use client'

import type { DebateData } from '@/types/debate'
import { DebatePage } from '@/components/debate/debate-page'

interface DebatePageClientProps {
  data: DebateData
  slug: string
}

export function DebatePageClient({ data, slug }: DebatePageClientProps) {
  return <DebatePage data={data} slug={slug} />
}
