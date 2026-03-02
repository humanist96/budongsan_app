import type { DebateData } from '@/types/debate'

export interface DebateEntry {
  readonly slug: string
  readonly title: string
  readonly shortTitle: string
  readonly description: string
  readonly emoji: string
  readonly tags: readonly string[]
}

export const debateEntries: readonly DebateEntry[] = [
  {
    slug: 'regulation',
    title: '김인만 vs 이광수 - AI 부동산 설전',
    shortTitle: '정부 규제와 집값',
    description:
      '이재명 대통령의 다주택자·비거주자·고가주택 규제 + 보유세 강화 이후, 아파트 가격은 어떻게 될 것인가?',
    emoji: '⚖️',
    tags: ['규제', '보유세', '집값'],
  },
  {
    slug: 'jeonse',
    title: '김인만 vs 이광수 - 전세제도의 미래',
    shortTitle: '전세제도의 미래',
    description:
      '전세사기 여파로 전세 기피가 확산되고 월세 전환이 가속화되고 있다. 한국 특유의 전세제도가 사라지면 부동산 시장은 어떻게 바뀔까?',
    emoji: '🏠',
    tags: ['전세', '월세', '임대'],
  },
  {
    slug: 'reconstruction',
    title: '김인만 vs 이광수 - 재건축 규제 완화',
    shortTitle: '재건축, 로또 vs 투기',
    description:
      '정비사업 활성화 방침으로 재건축 기대감이 다시 살아나고 있다. 30년 넘은 노후 아파트 밀집 지역, 강남 로또가 될까 투기판이 될까?',
    emoji: '🏗️',
    tags: ['재건축', '강남', '분담금'],
  },
  {
    slug: 'younggul',
    title: '김인만 vs 이광수 - 영끌 세대의 미래',
    shortTitle: '영끌, 벼락부자 vs 벼락거지',
    description:
      '2020~2021년 영끌로 집을 산 2030세대. 고금리에 허덕이다 이제 금리 인하 기대감이 커지고 있다. 영끌족의 선택은 결국 옳았을까?',
    emoji: '💸',
    tags: ['영끌', '금리', '가계부채'],
  },
] as const

export async function getDebateData(slug: string): Promise<DebateData | null> {
  switch (slug) {
    case 'regulation': {
      const { debateData } = await import('./debate-data')
      return debateData
    }
    case 'jeonse': {
      const { debateJeonse } = await import('./debate-jeonse')
      return debateJeonse
    }
    case 'reconstruction': {
      const { debateReconstruction } = await import('./debate-reconstruction')
      return debateReconstruction
    }
    case 'younggul': {
      const { debateYounggul } = await import('./debate-younggul')
      return debateYounggul
    }
    default:
      return null
  }
}
