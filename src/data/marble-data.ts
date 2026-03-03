// ============================================================
// 셀럽 부동산 브루마블 - 보드 & 게임 데이터
// ============================================================

// --- Types ---

export type SpaceType =
  | 'start'
  | 'property'
  | 'golden-key'
  | 'desert-island'
  | 'space-travel'
  | 'tax'
  | 'olympic'
  | 'lottery'
  | 'fund'
  | 'go-to-island'
  | 'bonus'

export type DistrictGrade = 'S' | 'A' | 'B' | 'C'

export interface CelebBuilding {
  readonly name: string
  readonly celeb: string
}

export interface DistrictInfo {
  readonly name: string
  readonly grade: DistrictGrade
  readonly price: number        // 억 단위
  readonly buildCost: number    // 억 단위
  readonly buildings: readonly CelebBuilding[]
}

export interface BoardSpace {
  readonly index: number
  readonly type: SpaceType
  readonly name: string
  readonly districtKey?: string  // property 칸만
  readonly amount?: number       // 세금/보너스 금액 (억)
}

export interface GoldenKeyCard {
  readonly id: number
  readonly title: string
  readonly description: string
  readonly effect: GoldenKeyEffect
}

export type GoldenKeyEffect =
  | { type: 'money'; amount: number }
  | { type: 'money-per-property'; amountPerProperty: number }
  | { type: 'money-per-building'; amountPerBuilding: number }
  | { type: 'move-to'; spaceIndex: number; collectSalary?: boolean }
  | { type: 'both-lose'; amount: number }
  | { type: 'next-buy-half' }
  | { type: 'conditional-bonus'; districtKey: string; bonus: number; fallback: number }

// --- District Data (14 서울 구) ---

export const DISTRICTS: Record<string, DistrictInfo> = {
  nowon: {
    name: '노원구',
    grade: 'C',
    price: 8,
    buildCost: 4,
    buildings: [
      { name: '상계동아파트', celeb: '이준석' },
    ],
  },
  junggu: {
    name: '중구',
    grade: 'C',
    price: 10,
    buildCost: 5,
    buildings: [
      { name: '신당동빌딩', celeb: '이효리' },
    ],
  },
  gangseo: {
    name: '강서구',
    grade: 'C',
    price: 12,
    buildCost: 6,
    buildings: [
      { name: '메디컬빌딩', celeb: '페이커' },
      { name: '등촌동상가', celeb: '전지현' },
    ],
  },
  seongbuk: {
    name: '성북구',
    grade: 'C',
    price: 13,
    buildCost: 7,
    buildings: [
      { name: '성북동단독주택', celeb: '이승기' },
    ],
  },
  yeongdeungpo: {
    name: '영등포구',
    grade: 'C',
    price: 14,
    buildCost: 7,
    buildings: [
      { name: '여의도종합상가', celeb: '' },
    ],
  },
  seodaemun: {
    name: '서대문구',
    grade: 'C',
    price: 15,
    buildCost: 8,
    buildings: [
      { name: '연희동단독', celeb: '박영선' },
      { name: '래미안위브', celeb: '' },
    ],
  },
  dongjak: {
    name: '동작구',
    grade: 'C',
    price: 18,
    buildCost: 9,
    buildings: [
      { name: '흑석동빌딩', celeb: '서장훈' },
      { name: '마크힐스', celeb: '김연아' },
    ],
  },
  jongno: {
    name: '종로구',
    grade: 'B',
    price: 22,
    buildCost: 11,
    buildings: [
      { name: '경희궁자이', celeb: '' },
      { name: '평창동자택', celeb: '이효리' },
      { name: '종각역빌딩', celeb: '' },
    ],
  },
  songpa: {
    name: '송파구',
    grade: 'B',
    price: 25,
    buildCost: 13,
    buildings: [
      { name: '잠실엘스', celeb: '' },
      { name: '올림픽파크포레온', celeb: '' },
      { name: '헬리오시티', celeb: '' },
    ],
  },
  seongdong: {
    name: '성동구',
    grade: 'B',
    price: 30,
    buildCost: 15,
    buildings: [
      { name: '갤러리아포레', celeb: 'GD' },
      { name: '아크로서울포레스트', celeb: '전지현' },
      { name: '성수동토지', celeb: '권상우' },
    ],
  },
  mapo: {
    name: '마포구',
    grade: 'B',
    price: 35,
    buildCost: 18,
    buildings: [
      { name: '메세나폴리스PH', celeb: '임영웅' },
      { name: '서교동ROI714', celeb: '공효진' },
      { name: '홍대빌딩', celeb: '양세형' },
    ],
  },
  seocho: {
    name: '서초구',
    grade: 'A',
    price: 55,
    buildCost: 28,
    buildings: [
      { name: '아크로리버파크', celeb: '' },
      { name: '래미안원베일리', celeb: '' },
      { name: '서초동빌딩920억', celeb: '비' },
    ],
  },
  yongsan: {
    name: '용산구',
    grade: 'A',
    price: 60,
    buildCost: 30,
    buildings: [
      { name: '한남더힐PH', celeb: 'BTS 진' },
      { name: '나인원한남', celeb: 'GD' },
      { name: '아페르한강', celeb: '제이홉' },
    ],
  },
  gangnam: {
    name: '강남구',
    grade: 'S',
    price: 80,
    buildCost: 40,
    buildings: [
      { name: '에테르노청담', celeb: '아이유' },
      { name: 'PH129', celeb: '장동건/뷔' },
      { name: '워너청담', celeb: 'GD' },
    ],
  },
}

// --- Board 28칸 ---

export const BOARD_SPACES: readonly BoardSpace[] = [
  // 하단 (좌→우) 0~6
  { index: 0, type: 'start', name: '출발' },
  { index: 1, type: 'property', name: '노원구', districtKey: 'nowon' },
  { index: 2, type: 'property', name: '중구', districtKey: 'junggu' },
  { index: 3, type: 'golden-key', name: '황금열쇠' },
  { index: 4, type: 'property', name: '강서구', districtKey: 'gangseo' },
  { index: 5, type: 'property', name: '성북구', districtKey: 'seongbuk' },
  { index: 6, type: 'property', name: '영등포구', districtKey: 'yeongdeungpo' },
  // 우측 (하→상) 7~13
  { index: 7, type: 'desert-island', name: '무인도' },
  { index: 8, type: 'property', name: '서대문구', districtKey: 'seodaemun' },
  { index: 9, type: 'property', name: '동작구', districtKey: 'dongjak' },
  { index: 10, type: 'golden-key', name: '황금열쇠' },
  { index: 11, type: 'property', name: '종로구', districtKey: 'jongno' },
  { index: 12, type: 'property', name: '송파구', districtKey: 'songpa' },
  { index: 13, type: 'property', name: '성동구', districtKey: 'seongdong' },
  // 상단 (우→좌) 14~20
  { index: 14, type: 'space-travel', name: '우주여행' },
  { index: 15, type: 'property', name: '마포구', districtKey: 'mapo' },
  { index: 16, type: 'tax', name: '종합부동산세', amount: -20 },
  { index: 17, type: 'golden-key', name: '황금열쇠' },
  { index: 18, type: 'property', name: '서초구', districtKey: 'seocho' },
  { index: 19, type: 'property', name: '용산구', districtKey: 'yongsan' },
  { index: 20, type: 'property', name: '강남구', districtKey: 'gangnam' },
  // 좌측 (상→하) 21~27
  { index: 21, type: 'olympic', name: '올림픽', amount: 20 },
  { index: 22, type: 'tax', name: '양도소득세', amount: -30 },
  { index: 23, type: 'golden-key', name: '황금열쇠' },
  { index: 24, type: 'lottery', name: '복권', amount: 20 },
  { index: 25, type: 'fund', name: '사회복지기금', amount: -15 },
  { index: 26, type: 'go-to-island', name: '한강나들이' },
  { index: 27, type: 'bonus', name: '셀럽 만남', amount: 10 },
]

export const TOTAL_SPACES = 28

// --- 황금열쇠 15장 ---

export const GOLDEN_KEY_CARDS: readonly GoldenKeyCard[] = [
  {
    id: 1,
    title: '전지현 전액현금 매입',
    description: '전지현처럼 현금 부자! 통장에 30억이 꽂힌다.',
    effect: { type: 'money', amount: 30 },
  },
  {
    id: 2,
    title: 'GD 나인원한남 입주',
    description: 'GD가 나인원한남에 입주하며 축하금 20억 전달!',
    effect: { type: 'money', amount: 20 },
  },
  {
    id: 3,
    title: '종합부동산세 강화',
    description: '보유 부동산마다 5억씩 세금 폭탄!',
    effect: { type: 'money-per-property', amountPerProperty: -5 },
  },
  {
    id: 4,
    title: '서장훈식 경매 낙찰',
    description: '서장훈의 투자 노하우 전수! 다음 매수 반값!',
    effect: { type: 'next-buy-half' },
  },
  {
    id: 5,
    title: '부동산 경기 침체',
    description: '경기 침체로 양쪽 모두 20억 손실!',
    effect: { type: 'both-lose', amount: 20 },
  },
  {
    id: 6,
    title: '임영웅 콘서트 효과',
    description: '임영웅 콘서트 대박! 주변 상권 활성화로 30억 수익!',
    effect: { type: 'money', amount: 30 },
  },
  {
    id: 7,
    title: '아이유 에테르노 분양',
    description: '아이유의 축복! 출발로 이동하며 30억 수령!',
    effect: { type: 'move-to', spaceIndex: 0, collectSalary: true },
  },
  {
    id: 8,
    title: '싸이 강남스타일',
    description: '강남구 보유 시 50억 보너스! 없으면 10억만.',
    effect: { type: 'conditional-bonus', districtKey: 'gangnam', bonus: 50, fallback: 10 },
  },
  {
    id: 9,
    title: '세무조사 발동',
    description: '세무조사에 걸렸다! 무인도로 직행!',
    effect: { type: 'move-to', spaceIndex: 7 },
  },
  {
    id: 10,
    title: '김연아 마크힐스 전설',
    description: '김연아의 전설적 투자 수익! 40억 획득!',
    effect: { type: 'money', amount: 40 },
  },
  {
    id: 11,
    title: '비&김태희 과열',
    description: '비&김태희 부부의 부동산 과열 논란... 15억 손실.',
    effect: { type: 'money', amount: -15 },
  },
  {
    id: 12,
    title: '박찬호 빌딩 임대수익',
    description: '박찬호처럼 건물마다 10억 임대수익!',
    effect: { type: 'money-per-building', amountPerBuilding: 10 },
  },
  {
    id: 13,
    title: '이승엽 성수동 전설',
    description: '이승엽의 성수동 투자 전설! 25억 획득!',
    effect: { type: 'money', amount: 25 },
  },
  {
    id: 14,
    title: '재건축 초과이익 환수',
    description: '재건축 초과이익 환수! 부동산마다 8억씩!',
    effect: { type: 'money-per-property', amountPerProperty: -8 },
  },
  {
    id: 15,
    title: '손흥민 에테르노 분양',
    description: '손흥민의 에테르노 분양 성공! 35억 수익!',
    effect: { type: 'money', amount: 35 },
  },
]

// --- 게임 상수 ---

export const GAME_CONSTANTS = {
  STARTING_MONEY: 300,    // 억
  SALARY: 30,             // 출발 통과 시
  MAX_TURNS: 40,
  ISLAND_ESCAPE_COST: 20, // 억
  ISLAND_TURNS: 3,        // 무인도 대기 턴
  RENT_BASE_MULTIPLIER: 0.2,   // 기본 임대료 = 땅값 × 20%
  RENT_BUILD1_MULTIPLIER: 1.5, // 건물1 = 기본 × 1.5
  RENT_BUILD2_MULTIPLIER: 2.5, // 건물2 = 기본 × 2.5
  RENT_BUILD3_MULTIPLIER: 4,   // 건물3 = 기본 × 4
} as const

// --- Helper Functions ---

export function getRent(districtKey: string, buildingCount: number): number {
  const district = DISTRICTS[districtKey]
  if (!district) return 0
  const base = Math.round(district.price * GAME_CONSTANTS.RENT_BASE_MULTIPLIER)
  const multipliers = [
    1,
    GAME_CONSTANTS.RENT_BUILD1_MULTIPLIER,
    GAME_CONSTANTS.RENT_BUILD2_MULTIPLIER,
    GAME_CONSTANTS.RENT_BUILD3_MULTIPLIER,
  ]
  const m = multipliers[Math.min(buildingCount, 3)]
  return Math.round(base * m)
}

export function getMaxBuildings(districtKey: string): number {
  const district = DISTRICTS[districtKey]
  if (!district) return 0
  return district.buildings.length
}

export function getGradeColor(grade: DistrictGrade): string {
  switch (grade) {
    case 'S': return 'text-amber-400'
    case 'A': return 'text-purple-400'
    case 'B': return 'text-blue-400'
    case 'C': return 'text-gray-400'
  }
}

export function getGradeBg(grade: DistrictGrade): string {
  switch (grade) {
    case 'S': return 'bg-amber-500/20 border-amber-500/40'
    case 'A': return 'bg-purple-500/20 border-purple-500/40'
    case 'B': return 'bg-blue-500/20 border-blue-500/40'
    case 'C': return 'bg-gray-500/20 border-gray-500/40'
  }
}

export function getSpaceIcon(type: SpaceType): string {
  switch (type) {
    case 'start': return '🚀'
    case 'property': return '🏢'
    case 'golden-key': return '🔑'
    case 'desert-island': return '🏝️'
    case 'space-travel': return '🚀'
    case 'tax': return '💸'
    case 'olympic': return '🏅'
    case 'lottery': return '🎰'
    case 'fund': return '🏦'
    case 'go-to-island': return '🌊'
    case 'bonus': return '🌟'
  }
}
