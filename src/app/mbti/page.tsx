import type { Metadata } from 'next'
import { MbtiPage } from '@/components/mbti/mbti-page'

export const metadata: Metadata = {
  title: '셀럽 부동산 MBTI | 셀럽하우스맵',
  description: '8개 질문으로 알아보는 나의 부동산 성향! 나와 같은 유형의 셀럽은 누구?',
  openGraph: {
    title: '셀럽 부동산 MBTI',
    description: '8개 질문으로 알아보는 나의 부동산 성향! 나와 같은 유형의 셀럽은 누구?',
  },
}

export default function MbtiRoute() {
  return <MbtiPage />
}
