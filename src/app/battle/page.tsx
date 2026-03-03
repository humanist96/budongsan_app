import type { Metadata } from 'next'
import { BattlePage } from '@/components/battle/battle-page'

export const metadata: Metadata = {
  title: '셀럽 배틀카드 | 셀럽하우스맵',
  description: '포켓몬 카드 스타일로 셀럽의 부동산 스탯을 1:1 비교! 오늘의 대결에 도전하세요.',
  openGraph: {
    title: '셀럽 배틀카드',
    description: '포켓몬 카드 스타일로 셀럽의 부동산 스탯을 1:1 비교!',
  },
}

export default function BattleRoute() {
  return <BattlePage />
}
