import type { Metadata } from 'next'
import { WorldCupPage } from '@/components/worldcup/worldcup-page'

export const metadata: Metadata = {
  title: '부동산 이상형 월드컵 | 셀럽하우스맵',
  description: '셀럽 매물 16강 토너먼트! 당신의 드림하우스는?',
}

export default function WorldCupRoute() {
  return <WorldCupPage />
}
