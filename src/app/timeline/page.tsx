import type { Metadata } from 'next'
import { TimelinePage } from '@/components/timeline/timeline-page'

export const metadata: Metadata = {
  title: '셀럽 부동산 연대기 | 셀럽하우스맵',
  description:
    '2000~2025년 셀럽 부동산 매입/매도 이벤트를 연도별로 탐색하세요.',
}

export default function Page() {
  return <TimelinePage />
}
