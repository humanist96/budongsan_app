/**
 * 셀럽 부동산 MBTI 데이터
 *
 * 4차원 분석: 위치(G/N) × 물건(A/B) × 전략(I/T) × 규모(C/D)
 * 8문제 → 16가지 유형 → 실제 셀럽 매칭
 */

// ─── Types ──────────────────────────────────────────────────

export type MbtiDimension = 'location' | 'property' | 'strategy' | 'scale'

export interface MbtiChoice {
  label: string
  value: 'A' | 'B'
}

export interface MbtiQuestion {
  id: number
  question: string
  dimension: MbtiDimension
  choices: readonly [MbtiChoice, MbtiChoice]
}

export interface MbtiResult {
  code: string
  name: string
  description: string
  celebrityId: string
  celebrityName: string
  celebrityDetail: string
  dimensions: {
    location: number   // 0 = G(강남), 100 = N(비강남)
    property: number   // 0 = A(아파트), 100 = B(빌딩/토지)
    strategy: number   // 0 = I(실거주), 100 = T(투자)
    scale: number      // 0 = C(집중), 100 = D(분산)
  }
}

// ─── Questions (8개) ────────────────────────────────────────

export const MBTI_QUESTIONS: readonly MbtiQuestion[] = [
  {
    id: 1,
    question: '로또 당첨! 첫 집 어디에 사시겠어요?',
    dimension: 'location',
    choices: [
      { label: '반포자이 · 아크로리버파크 (강남 한강뷰)', value: 'A' },
      { label: '마포 한강변 · 성수 카페거리 (힙한 동네)', value: 'B' },
    ],
  },
  {
    id: 2,
    question: '갑자기 10억이 생기면?',
    dimension: 'strategy',
    choices: [
      { label: '좋은 동네 전세 살면서 기회 대기', value: 'A' },
      { label: '바로 내 이름 앞으로 매매!', value: 'B' },
    ],
  },
  {
    id: 3,
    question: '어떤 부동산 물건이 더 끌리나요?',
    dimension: 'property',
    choices: [
      { label: '한강뷰 펜트하우스 🏙️', value: 'A' },
      { label: '임대수익 나오는 빌딩 🏢', value: 'B' },
    ],
  },
  {
    id: 4,
    question: '부동산 자산이 100억이라면?',
    dimension: 'scale',
    choices: [
      { label: '나인원한남 한 채에 올인!', value: 'A' },
      { label: '10억짜리 10채로 분산 투자', value: 'B' },
    ],
  },
  {
    id: 5,
    question: '이상적인 동네 분위기는?',
    dimension: 'location',
    choices: [
      { label: '조용하고 고급스러운 강남 분위기', value: 'A' },
      { label: '활기차고 상권이 발달한 핫플', value: 'B' },
    ],
  },
  {
    id: 6,
    question: '부동산 결정을 어떻게 하시나요?',
    dimension: 'strategy',
    choices: [
      { label: '"여기서 살고 싶다!" 직감으로', value: 'A' },
      { label: '수익률 엑셀 분석 후 냉철하게', value: 'B' },
    ],
  },
  {
    id: 7,
    question: '내 자산의 최종 형태는?',
    dimension: 'scale',
    choices: [
      { label: '완벽한 한 채의 드림하우스', value: 'A' },
      { label: '여러 채의 든든한 포트폴리오', value: 'B' },
    ],
  },
  {
    id: 8,
    question: '다음 중 더 흥미로운 뉴스는?',
    dimension: 'property',
    choices: [
      { label: '"청담 신축 아파트 분양가 역대 최고"', value: 'A' },
      { label: '"가로수길 빌딩, 3년 만에 가격 2배"', value: 'B' },
    ],
  },
] as const

// ─── Results (16가지) ───────────────────────────────────────

export const MBTI_RESULTS: Record<string, MbtiResult> = {
  GAIC: {
    code: 'GAIC',
    name: '강남 드림하우스 귀족',
    description: '최고급 강남 아파트 한 채에 모든 것을 거는 타입. 실거주와 자산가치를 동시에 잡는 완벽주의자입니다. "집은 곧 나의 정체성"이라고 믿으며, 퀄리티에 절대 타협하지 않습니다.',
    celebrityId: 'ent-06',
    celebrityName: '아이유',
    celebrityDetail: '에테르노 청담 200억, 완벽한 한 채에 올인',
    dimensions: { location: 10, property: 15, strategy: 20, scale: 10 },
  },
  GAID: {
    code: 'GAID',
    name: '강남 아파트 컬렉터',
    description: '강남권 아파트를 하나씩 모으는 수집형. 실거주하면서도 자연스럽게 포트폴리오를 키워갑니다. "좋은 아파트는 여러 채가 정답"이 인생 모토입니다.',
    celebrityId: 'ent-14',
    celebrityName: 'BTS 진',
    celebrityDetail: '한남더힐 3채, 강남권 아파트만 모은다',
    dimensions: { location: 15, property: 20, strategy: 25, scale: 85 },
  },
  GATIC: {
    code: 'GATIC',
    name: '강남 올인 투자자',
    description: '투자 감각으로 강남 최고급 아파트를 노리는 전략가. 한 방에 큰 수익을 노리며, 가장 비싼 곳에서 가장 큰 수익을 만들어냅니다.',
    celebrityId: 'ent-05',
    celebrityName: 'GD',
    celebrityDetail: '나인원한남 PH 164억, 최고급 한 방',
    dimensions: { location: 10, property: 20, strategy: 85, scale: 15 },
  },
  GATID: {
    code: 'GATID',
    name: '강남 분산 재테크',
    description: '조용하지만 확실하게 강남 아파트를 모으는 투자자. 눈에 띄지 않게 하나씩 늘려가며, 리스크를 분산하는 안정적인 전략을 선호합니다.',
    celebrityId: 'ent-03',
    celebrityName: '유재석',
    celebrityDetail: '강남 아파트 여러 채 조용히 모음',
    dimensions: { location: 20, property: 25, strategy: 80, scale: 80 },
  },
  GBIC: {
    code: 'GBIC',
    name: '강남 빌딩왕',
    description: '강남에 빌딩 한 채, 그것으로 충분한 스타일. 임대수익보다 "내 빌딩"이라는 만족감이 중요합니다. 크고 멋진 한 채에 인생을 겁니다.',
    celebrityId: 'ent-11',
    celebrityName: '비(정지훈)',
    celebrityDetail: '서초 빌딩 920억 올인',
    dimensions: { location: 15, property: 85, strategy: 25, scale: 10 },
  },
  GBID: {
    code: 'GBID',
    name: '강남 빌딩 포트폴리오',
    description: '강남 빌딩을 여러 채 보유한 진정한 건물주. 분산 투자로 안정적인 임대수익을 만들며, "달걀을 한 바구니에 담지 않는" 현명한 전략가입니다.',
    celebrityId: 'ent-13',
    celebrityName: '서장훈',
    celebrityDetail: '빌딩 3채 총 700억 분산 투자',
    dimensions: { location: 20, property: 90, strategy: 30, scale: 85 },
  },
  GBTIC: {
    code: 'GBTIC',
    name: '강남 빌딩 한방',
    description: '투자 감각으로 강남 빌딩 한 채를 골라 대박을 노리는 타입. 주차장을 빌딩으로, 나대지를 명소로 바꾸는 비전을 가졌습니다.',
    celebrityId: 'ent-34',
    celebrityName: '김희애',
    celebrityDetail: '청담 주차장→빌딩 500억 신축',
    dimensions: { location: 10, property: 90, strategy: 90, scale: 15 },
  },
  GBTID: {
    code: 'GBTID',
    name: '강남 빌딩 재벌',
    description: '강남에 빌딩 여러 채를 투자 목적으로 보유한 부동산 재벌형. 수익률과 입지를 동시에 분석하며, 포트폴리오를 체계적으로 관리합니다.',
    celebrityId: 'ent-21',
    celebrityName: '싸이',
    celebrityDetail: '빌딩 3채 총 800억',
    dimensions: { location: 15, property: 85, strategy: 85, scale: 90 },
  },
  NAIC: {
    code: 'NAIC',
    name: '비강남 드림하우스',
    description: '트렌디한 동네에서 나만의 드림하우스를 찾는 감성파. 강남 대신 성북동, 이태원 같은 개성 있는 동네에서 특별한 한 채를 원합니다.',
    celebrityId: 'ent-29',
    celebrityName: '이승기',
    celebrityDetail: '성북동 단독주택 111억',
    dimensions: { location: 85, property: 20, strategy: 20, scale: 15 },
  },
  NAID: {
    code: 'NAID',
    name: '비강남 아파트 분산',
    description: '강남 밖에서 좋은 아파트를 여러 채 모으는 실속파. 용산, 마포, 성동 등 뜨는 지역을 빠르게 캐치하며 포트폴리오를 구축합니다.',
    celebrityId: 'ent-27',
    celebrityName: 'BTS 제이홉',
    celebrityDetail: '아페르한강 PH 등 4주택 270억',
    dimensions: { location: 80, property: 15, strategy: 25, scale: 90 },
  },
  NATIC: {
    code: 'NATIC',
    name: '비강남 투자 집중',
    description: '핫한 지역에서 투자 기회를 포착해 한 방에 승부하는 타입. 남들이 주목하지 않을 때 들어가서, 지역이 뜨면 대박을 터뜨립니다.',
    celebrityId: 'ent-33',
    celebrityName: '권상우',
    celebrityDetail: '성수동 토지 80억→430억',
    dimensions: { location: 85, property: 25, strategy: 85, scale: 10 },
  },
  NATID: {
    code: 'NATID',
    name: '비강남 투자 분산',
    description: '강남 밖 유망 지역에 투자를 분산하는 전략가. 한 곳에 올인하지 않고, 여러 지역의 성장성을 동시에 잡습니다.',
    celebrityId: 'ent-51',
    celebrityName: '혜리',
    celebrityDetail: '역삼+삼성 건물 2채 122억',
    dimensions: { location: 80, property: 30, strategy: 80, scale: 85 },
  },
  NBIC: {
    code: 'NBIC',
    name: '비강남 빌딩 한 채',
    description: '힙한 동네에서 감각적인 빌딩 한 채를 소유하는 꿈을 가진 타입. 건물에 자신의 개성을 담아 브랜딩하며, 동네의 랜드마크가 됩니다.',
    celebrityId: 'ent-46',
    celebrityName: '공효진',
    celebrityDetail: '서교동 빌딩 63억→160억',
    dimensions: { location: 90, property: 85, strategy: 20, scale: 10 },
  },
  NBID: {
    code: 'NBID',
    name: '비강남 빌딩 컬렉터',
    description: '강남 밖 핫플에 빌딩을 여러 채 보유한 건물주. 신사동, 논현동, 이태원 등 상권이 발달한 곳에서 안정적인 임대수익을 만듭니다.',
    celebrityId: 'ent-45',
    celebrityName: '황정민',
    celebrityDetail: '신사+논현 빌딩 2채 235억',
    dimensions: { location: 85, property: 90, strategy: 25, scale: 85 },
  },
  NBTIC: {
    code: 'NBTIC',
    name: '비강남 빌딩 투자',
    description: '뜨는 동네의 빌딩 한 채에 투자해 시세차익을 노리는 타입. 이태원, 경리단길 같은 곳에서 가치를 먼저 알아보는 안목이 있습니다.',
    celebrityId: 'ent-40',
    celebrityName: '조인성',
    celebrityDetail: '이태원 빌딩 30.5→73억',
    dimensions: { location: 90, property: 85, strategy: 90, scale: 15 },
  },
  NBTID: {
    code: 'NBTID',
    name: '비강남 빌딩 포트폴리오',
    description: '다양한 지역에 빌딩과 주택을 섞어 포트폴리오를 구성하는 올라운더. 수익성과 거주 만족 모두를 추구하며 밸런스를 중시합니다.',
    celebrityId: 'ent-36',
    celebrityName: '이효리',
    celebrityDetail: '신당동 빌딩+평창동 자택',
    dimensions: { location: 85, property: 80, strategy: 85, scale: 90 },
  },
}

// ─── Score Computation ──────────────────────────────────────

type Answers = Record<number, 'A' | 'B'>

interface DimensionScores {
  location: number
  property: number
  strategy: number
  scale: number
}

function computeScores(answers: Answers): DimensionScores {
  const dimensionAnswers: Record<MbtiDimension, ('A' | 'B')[]> = {
    location: [],
    property: [],
    strategy: [],
    scale: [],
  }

  for (const q of MBTI_QUESTIONS) {
    const answer = answers[q.id]
    if (answer) {
      dimensionAnswers[q.dimension] = [...dimensionAnswers[q.dimension], answer]
    }
  }

  const score = (dim: MbtiDimension): number => {
    const arr = dimensionAnswers[dim]
    if (arr.length === 0) return 0
    const bCount = arr.filter((a) => a === 'B').length
    return Math.round((bCount / arr.length) * 100)
  }

  return {
    location: score('location'),
    property: score('property'),
    strategy: score('strategy'),
    scale: score('scale'),
  }
}

export function computeMbtiCode(answers: Answers): string {
  const scores = computeScores(answers)

  const L = scores.location < 50 ? 'G' : 'N'
  const P = scores.property < 50 ? 'A' : 'B'
  const S = scores.strategy < 50 ? 'I' : 'T'
  const SC = scores.scale < 50 ? 'C' : 'D'

  return `${L}${P}${S}${SC}`
}

export function getMbtiResult(code: string): MbtiResult {
  return MBTI_RESULTS[code] ?? MBTI_RESULTS['GAIC']
}
