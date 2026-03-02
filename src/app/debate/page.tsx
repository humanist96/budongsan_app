import type { Metadata } from 'next'
import { debateEntries } from '@/data/debate-index'
import { DebateTopicList } from '@/components/debate/debate-topic-list'

export const metadata: Metadata = {
  title: '부동산 토론 | 셀럽하우스맵',
  description:
    '김인만 vs 이광수 - AI가 재현한 부동산 토론. 다양한 주제의 50턴 설전을 감상하세요.',
}

export default function DebateRoute() {
  return <DebateTopicList entries={debateEntries} />
}
