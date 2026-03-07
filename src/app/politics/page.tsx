import type { Metadata } from 'next'
import { PoliticsContent } from './politics-content'

export const metadata: Metadata = {
  title: '진보 vs 보수 비교 | 셀럽하우스맵',
  description: '진보 vs 보수 정치인 부동산 보유 현황을 한눈에 비교합니다.',
}

export default function PoliticsPage() {
  return <PoliticsContent />
}
