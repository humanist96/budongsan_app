import type { Metadata } from 'next'
import { MarblePage } from '@/components/marble/marble-page'

export const metadata: Metadata = {
  title: '셀럽 부동산 브루마블 | 셀럽하우스맵',
  description: '서울 14개구 실제 셀럽 부동산으로 즐기는 브루마블! 아이유의 에테르노, GD의 워너청담을 매수하고 부동산 왕이 되어보세요.',
  openGraph: {
    title: '셀럽 부동산 브루마블',
    description: '서울 14개구 실제 셀럽 부동산으로 즐기는 브루마블!',
  },
}

export default function MarbleRoute() {
  return <MarblePage />
}
