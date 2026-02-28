/**
 * 셀럽 부동산 시드 데이터
 *
 * 모든 정보는 언론에 공개 보도된 내용 기반입니다.
 * - 정치인: 공직자윤리법에 따른 재산공개 자료 (공적 데이터)
 * - 연예인/운동선수: 주요 언론사 보도 기반 (비공식 정보)
 * - 가격: 보도 시점 기준 (만원 단위)
 * - 좌표: 해당 단지/지역 대표 좌표 (개인정보 보호를 위해 정확한 동·호수 미반영)
 *
 * 출처: 한국경제, 머니투데이, 뉴스1, 헤럴드경제, 비즈한국, 아시아경제, 서울경제, 이투데이, 이데일리
 */

import type { CelebrityCategory } from '@/types'
import type { PropertyType } from '@/types/property'

// ─── Types ──────────────────────────────────────────────────

export interface SeedCelebrity {
  id: string
  name: string
  category: CelebrityCategory
  subCategory: string
  description: string
  isVerified: boolean
}

export interface SeedProperty {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  propertyType: PropertyType
  exclusiveArea: number | null
  buildingYear: number | null
}

export interface SeedCelebrityProperty {
  celebrityId: string
  propertyId: string
  price: number | null // 만원 단위
  acquisitionDate: string | null
  sourceType: 'verified' | 'reported' | 'unverified'
  sourceNote: string
  sourceUrl: string | null
}

// ─── Celebrities (50명) ─────────────────────────────────────

export const celebrities: SeedCelebrity[] = [
  // ========== 연예인 (30명) ==========
  { id: 'ent-01', name: '전지현', category: 'entertainer', subCategory: '배우', description: '한류 톱스타, 별에서 온 그대·킹덤 주연. 부동산 자산 약 1,500억원', isVerified: false },
  { id: 'ent-02', name: '장동건', category: 'entertainer', subCategory: '배우', description: '한류 1세대 톱스타, 고소영과 부부. 부동산 자산 약 618억원', isVerified: false },
  { id: 'ent-03', name: '유재석', category: 'entertainer', subCategory: 'MC', description: '국민 MC, 무한도전·런닝맨. 강남 부동산 다수 보유', isVerified: false },
  { id: 'ent-04', name: '강호동', category: 'entertainer', subCategory: 'MC', description: '전 씨름선수 출신 MC, 아는형님', isVerified: false },
  { id: 'ent-05', name: 'GD(권지용)', category: 'entertainer', subCategory: '가수', description: '빅뱅 리더, 나인원한남 PH 164억 보유. 부동산 약 560억원', isVerified: false },
  { id: 'ent-06', name: '아이유(이지은)', category: 'entertainer', subCategory: '가수/배우', description: '국민 여동생, 에테르노 청담 공시가 전국 1위(200.6억)', isVerified: false },
  { id: 'ent-07', name: '현빈', category: 'entertainer', subCategory: '배우', description: '사랑의 불시착 주연, 한류 톱배우', isVerified: false },
  { id: 'ent-08', name: '손예진', category: 'entertainer', subCategory: '배우', description: '사랑의 불시착 주연, 현빈 배우자. 신사동 빌딩 보유', isVerified: false },
  { id: 'ent-09', name: '송혜교', category: 'entertainer', subCategory: '배우', description: '태양의 후예·더 글로리 주연', isVerified: false },
  { id: 'ent-10', name: '이병헌', category: 'entertainer', subCategory: '배우', description: '한류 톱스타, 할리우드 진출', isVerified: false },
  { id: 'ent-11', name: '비(정지훈)', category: 'entertainer', subCategory: '가수/배우', description: '월드스타, 김태희와 부부. 서초 빌딩 920억 등 총 1,600억원 이상', isVerified: false },
  { id: 'ent-12', name: '김수현', category: 'entertainer', subCategory: '배우', description: '별에서 온 그대·눈물의 여왕 주연', isVerified: false },
  { id: 'ent-13', name: '서장훈', category: 'entertainer', subCategory: 'MC/전 농구선수', description: '부동산 재테크 레전드. 빌딩 3채 총 약 700억원', isVerified: false },
  { id: 'ent-14', name: 'BTS 진(김석진)', category: 'entertainer', subCategory: '가수', description: 'BTS 맏형, 한남더힐 3채 보유 (175억 PH 포함)', isVerified: false },
  { id: 'ent-15', name: 'BTS RM(김남준)', category: 'entertainer', subCategory: '가수', description: 'BTS 리더, 나인원한남 63.6억 전액 현금 매입', isVerified: false },
  { id: 'ent-16', name: 'BTS 정국(전정국)', category: 'entertainer', subCategory: '가수', description: 'BTS 메인보컬, 이태원 76억 대저택 신축 중', isVerified: false },
  { id: 'ent-17', name: 'BTS 뷔(김태형)', category: 'entertainer', subCategory: '가수', description: 'BTS 멤버, PH129 청담 142억 전액 현금', isVerified: false },
  { id: 'ent-18', name: 'BTS 지민(박지민)', category: 'entertainer', subCategory: '가수', description: 'BTS 멤버, 나인원한남 59억 전액 현금', isVerified: false },
  { id: 'ent-19', name: '블랙핑크 제니', category: 'entertainer', subCategory: '가수', description: '블랙핑크 멤버, 글로벌 패션 아이콘', isVerified: false },
  { id: 'ent-20', name: '수지(배수지)', category: 'entertainer', subCategory: '가수/배우', description: '국민 첫사랑, 미스에이 출신', isVerified: false },
  { id: 'ent-21', name: '싸이(박재상)', category: 'entertainer', subCategory: '가수', description: '강남스타일, P NATION 대표. 빌딩 3채 총 약 800억원', isVerified: false },
  { id: 'ent-22', name: '신동엽', category: 'entertainer', subCategory: 'MC', description: '국민 MC, 부동산 투자 유명', isVerified: false },
  { id: 'ent-23', name: '하정우', category: 'entertainer', subCategory: '배우', description: '천만 배우, 암살·신과함께', isVerified: false },
  { id: 'ent-24', name: '송중기', category: 'entertainer', subCategory: '배우', description: '태양의 후예·빈센조 주연', isVerified: false },
  { id: 'ent-25', name: '이영애', category: 'entertainer', subCategory: '배우', description: '대장금 주연, 한류 퀸', isVerified: false },
  { id: 'ent-26', name: 'BTS 슈가(민윤기)', category: 'entertainer', subCategory: '가수', description: 'BTS 멤버, 프로듀서. 한남리버힐 34억 보유', isVerified: false },
  { id: 'ent-27', name: 'BTS 제이홉(정호석)', category: 'entertainer', subCategory: '가수', description: 'BTS 멤버, 아페르한강 PH 120억+100억 (4주택 약 270억)', isVerified: false },
  { id: 'ent-28', name: '임영웅', category: 'entertainer', subCategory: '가수', description: '미스터트롯 우승자, 메세나폴리스 PH 51억', isVerified: false },
  { id: 'ent-29', name: '이승기', category: 'entertainer', subCategory: '가수/배우', description: '국민 남동생, 성북동 56.35억 (현 시세 111억)', isVerified: false },
  { id: 'ent-30', name: '김태희', category: 'entertainer', subCategory: '배우', description: '톱배우, 비(정지훈)와 부부. 공동 부동산 1,600억+', isVerified: false },

  // ========== 정치인 (10명) ==========
  { id: 'pol-01', name: '정진석', category: 'politician', subCategory: '국회의원', description: '제22대 국회의원, 국민의힘', isVerified: true },
  { id: 'pol-02', name: '이낙연', category: 'politician', subCategory: '전 국무총리', description: '전 국무총리, 더불어민주당', isVerified: true },
  { id: 'pol-03', name: '나경원', category: 'politician', subCategory: '국회의원', description: '전 국회 부의장, 국민의힘', isVerified: true },
  { id: 'pol-04', name: '박영선', category: 'politician', subCategory: '전 장관', description: '전 중소벤처기업부 장관', isVerified: true },
  { id: 'pol-05', name: '윤희숙', category: 'politician', subCategory: '전 국회의원', description: '전 국회의원, 경제학자 출신', isVerified: true },
  { id: 'pol-06', name: '추미애', category: 'politician', subCategory: '전 장관', description: '전 법무부 장관, 더불어민주당', isVerified: true },
  { id: 'pol-07', name: '한덕수', category: 'politician', subCategory: '전 국무총리', description: '전 국무총리, 경제관료 출신', isVerified: true },
  { id: 'pol-08', name: '김기현', category: 'politician', subCategory: '국회의원', description: '전 국민의힘 대표', isVerified: true },
  { id: 'pol-09', name: '이재명', category: 'politician', subCategory: '국회의원', description: '더불어민주당 대표, 전 경기도지사', isVerified: true },
  { id: 'pol-10', name: '오세훈', category: 'politician', subCategory: '서울시장', description: '서울특별시장', isVerified: true },

  // ========== 운동선수 (11명) ==========
  { id: 'ath-01', name: '손흥민', category: 'athlete', subCategory: '축구', description: 'EPL 토트넘, 에테르노 압구정 PH 400억 분양', isVerified: false },
  { id: 'ath-02', name: '류현진', category: 'athlete', subCategory: '야구', description: 'MLB 출신, 한화이글스 투수', isVerified: false },
  { id: 'ath-03', name: '추신수', category: 'athlete', subCategory: '야구', description: 'MLB 레전드, 전 SSG 랜더스', isVerified: false },
  { id: 'ath-04', name: '김연아', category: 'athlete', subCategory: '피겨스케이팅', description: '피겨 여왕, 올림픽 금메달리스트', isVerified: false },
  { id: 'ath-05', name: '박지성', category: 'athlete', subCategory: '축구', description: '전 맨유 미드필더, 한국 축구 레전드', isVerified: false },
  { id: 'ath-06', name: '박찬호', category: 'athlete', subCategory: '야구', description: 'MLB 레전드, 신사동 빌딩 현 시세 약 800억', isVerified: false },
  { id: 'ath-07', name: '기성용', category: 'athlete', subCategory: '축구', description: 'EPL 출신, 전 국가대표 미드필더', isVerified: false },
  { id: 'ath-08', name: '이강인', category: 'athlete', subCategory: '축구', description: 'PSG 미드필더, 차세대 한국 축구 에이스', isVerified: false },
  { id: 'ath-09', name: '김광현', category: 'athlete', subCategory: '야구', description: 'MLB 출신, SSG 랜더스 투수', isVerified: false },
  { id: 'ath-10', name: '황희찬', category: 'athlete', subCategory: '축구', description: 'EPL 울버햄튼 공격수', isVerified: false },
  { id: 'ath-11', name: '이승엽', category: 'athlete', subCategory: '야구', description: '한일 홈런왕, 성수동 빌딩 293억 (현 1,167억)', isVerified: false },
]

// ─── Properties (91개) ──────────────────────────────────────

export const properties: SeedProperty[] = [
  // === 한남동 일대 ===
  { id: 'prop-001', name: '한남더힐 (233㎡)', address: '서울 용산구 한남동 810', lat: 37.5340, lng: 127.0026, propertyType: 'apartment', exclusiveArea: 233.0, buildingYear: 2011 },
  { id: 'prop-002', name: '한남더힐 (206㎡)', address: '서울 용산구 한남동 810', lat: 37.5343, lng: 127.0030, propertyType: 'apartment', exclusiveArea: 206.0, buildingYear: 2011 },
  { id: 'prop-003', name: '한남더힐 펜트하우스', address: '서울 용산구 한남동 810', lat: 37.5337, lng: 127.0022, propertyType: 'apartment', exclusiveArea: 243.2, buildingYear: 2011 },
  { id: 'prop-004', name: '한남더힐 (B동)', address: '서울 용산구 한남동 810', lat: 37.5341, lng: 127.0028, propertyType: 'apartment', exclusiveArea: 244.72, buildingYear: 2011 },
  { id: 'prop-005', name: '한남더힐 (C동)', address: '서울 용산구 한남동 810', lat: 37.5339, lng: 127.0024, propertyType: 'apartment', exclusiveArea: 244.72, buildingYear: 2011 },
  { id: 'prop-006', name: '한남더힐 (D동)', address: '서울 용산구 한남동 810', lat: 37.5345, lng: 127.0032, propertyType: 'apartment', exclusiveArea: 240.15, buildingYear: 2011 },
  { id: 'prop-007', name: '나인원한남', address: '서울 용산구 한남동 747-1', lat: 37.5368, lng: 127.0008, propertyType: 'apartment', exclusiveArea: 244.0, buildingYear: 2020 },
  { id: 'prop-008', name: '한남동 단독주택 A', address: '서울 용산구 한남동', lat: 37.5355, lng: 126.9998, propertyType: 'house', exclusiveArea: 330.0, buildingYear: 2005 },
  { id: 'prop-009', name: '한남동 단독주택 B', address: '서울 용산구 한남동', lat: 37.5358, lng: 127.0005, propertyType: 'house', exclusiveArea: 450.0, buildingYear: 2010 },
  { id: 'prop-010', name: '한남동 단독주택 C', address: '서울 용산구 한남동', lat: 37.5348, lng: 126.9990, propertyType: 'house', exclusiveArea: 290.0, buildingYear: 2008 },
  { id: 'prop-011', name: 'UN빌리지 단독주택', address: '서울 용산구 한남동 UN빌리지', lat: 37.5350, lng: 127.0035, propertyType: 'house', exclusiveArea: 380.0, buildingYear: 2003 },

  // === 이태원 일대 ===
  { id: 'prop-012', name: '이태원 단독주택 A', address: '서울 용산구 이태원동', lat: 37.5342, lng: 126.9940, propertyType: 'house', exclusiveArea: 520.0, buildingYear: 2015 },
  { id: 'prop-013', name: '이태원 대저택', address: '서울 용산구 이태원동', lat: 37.5338, lng: 126.9935, propertyType: 'house', exclusiveArea: 633.0, buildingYear: 2024 },
  { id: 'prop-014', name: '이태원 고급빌라', address: '서울 용산구 이태원동', lat: 37.5335, lng: 126.9945, propertyType: 'villa', exclusiveArea: 280.0, buildingYear: 2017 },
  { id: 'prop-015', name: '이태원 빌딩', address: '서울 용산구 이태원동', lat: 37.5330, lng: 126.9950, propertyType: 'building', exclusiveArea: null, buildingYear: 2012 },

  // === 청담동 일대 ===
  { id: 'prop-016', name: 'PH129 (더펜트하우스 청담)', address: '서울 강남구 청담동 129', lat: 37.5247, lng: 127.0470, propertyType: 'apartment', exclusiveArea: 273.96, buildingYear: 2016 },
  { id: 'prop-017', name: '더펜트하우스 청담', address: '서울 강남구 청담동', lat: 37.5230, lng: 127.0448, propertyType: 'apartment', exclusiveArea: 234.41, buildingYear: 2015 },
  { id: 'prop-018', name: '청담자이', address: '서울 강남구 청담동', lat: 37.5215, lng: 127.0425, propertyType: 'apartment', exclusiveArea: 198.35, buildingYear: 2012 },
  { id: 'prop-019', name: '청담동 빌딩 A', address: '서울 강남구 청담동', lat: 37.5225, lng: 127.0460, propertyType: 'building', exclusiveArea: null, buildingYear: 2010 },
  { id: 'prop-020', name: '청담동 빌딩 B', address: '서울 강남구 청담동', lat: 37.5240, lng: 127.0455, propertyType: 'building', exclusiveArea: null, buildingYear: 2014 },

  // === 삼성동 일대 ===
  { id: 'prop-021', name: '아이파크삼성', address: '서울 강남구 삼성동 168', lat: 37.5146, lng: 127.0540, propertyType: 'apartment', exclusiveArea: 199.36, buildingYear: 2004 },
  { id: 'prop-022', name: '현대아이파크 (B동)', address: '서울 강남구 삼성동 168', lat: 37.5150, lng: 127.0545, propertyType: 'apartment', exclusiveArea: 182.50, buildingYear: 2004 },
  { id: 'prop-023', name: '래미안라클래시', address: '서울 강남구 삼성동', lat: 37.5120, lng: 127.0560, propertyType: 'apartment', exclusiveArea: 163.47, buildingYear: 2014 },
  { id: 'prop-024', name: '삼성동 빌딩', address: '서울 강남구 삼성동', lat: 37.5135, lng: 127.0550, propertyType: 'building', exclusiveArea: null, buildingYear: 2008 },

  // === 반포/서초 일대 ===
  { id: 'prop-025', name: '아크로리버파크', address: '서울 서초구 반포동 1-1', lat: 37.5085, lng: 126.9959, propertyType: 'apartment', exclusiveArea: 194.73, buildingYear: 2016 },
  { id: 'prop-026', name: '반포자이', address: '서울 서초구 반포동 18-1', lat: 37.5055, lng: 126.9870, propertyType: 'apartment', exclusiveArea: 198.74, buildingYear: 2009 },
  { id: 'prop-027', name: '래미안퍼스티지', address: '서울 서초구 반포동', lat: 37.5050, lng: 126.9910, propertyType: 'apartment', exclusiveArea: 163.90, buildingYear: 2009 },
  { id: 'prop-028', name: '래미안원베일리', address: '서울 서초구 반포동', lat: 37.5065, lng: 126.9935, propertyType: 'apartment', exclusiveArea: 191.16, buildingYear: 2023 },
  { id: 'prop-029', name: '래미안리더스원', address: '서울 서초구 서초동', lat: 37.4970, lng: 127.0230, propertyType: 'apartment', exclusiveArea: 153.46, buildingYear: 2021 },
  { id: 'prop-030', name: '아크로비스타', address: '서울 서초구 반포동', lat: 37.4950, lng: 127.0180, propertyType: 'apartment', exclusiveArea: 179.80, buildingYear: 2004 },
  { id: 'prop-031', name: '서초 트리마제', address: '서울 서초구 서초동', lat: 37.4930, lng: 127.0200, propertyType: 'apartment', exclusiveArea: 148.69, buildingYear: 2018 },

  // === 논현동 일대 ===
  { id: 'prop-032', name: '트라움하우스5차', address: '서울 강남구 논현동', lat: 37.5172, lng: 127.0286, propertyType: 'villa', exclusiveArea: 220.47, buildingYear: 2006 },
  { id: 'prop-033', name: '논현동 빌딩 A', address: '서울 강남구 논현동', lat: 37.5178, lng: 127.0300, propertyType: 'building', exclusiveArea: null, buildingYear: 2005 },
  { id: 'prop-034', name: '논현동 빌딩 B', address: '서울 강남구 논현동', lat: 37.5168, lng: 127.0295, propertyType: 'building', exclusiveArea: null, buildingYear: 2010 },

  // === 도곡동 일대 ===
  { id: 'prop-035', name: '타워팰리스', address: '서울 강남구 도곡동 467', lat: 37.4920, lng: 127.0555, propertyType: 'apartment', exclusiveArea: 215.38, buildingYear: 2002 },
  { id: 'prop-036', name: '도곡렉슬', address: '서울 강남구 도곡동', lat: 37.4890, lng: 127.0480, propertyType: 'apartment', exclusiveArea: 164.98, buildingYear: 2003 },

  // === 성수동 일대 ===
  { id: 'prop-037', name: '갤러리아포레', address: '서울 성동구 성수동1가', lat: 37.5445, lng: 127.0567, propertyType: 'apartment', exclusiveArea: 212.03, buildingYear: 2011 },
  { id: 'prop-038', name: '트리마제', address: '서울 성동구 성수동1가', lat: 37.5420, lng: 127.0560, propertyType: 'apartment', exclusiveArea: 140.3, buildingYear: 2017 },
  { id: 'prop-039', name: '서울숲 푸르지오', address: '서울 성동구 성수동1가', lat: 37.5440, lng: 127.0480, propertyType: 'apartment', exclusiveArea: 159.72, buildingYear: 2008 },

  // === 대치동 일대 ===
  { id: 'prop-040', name: '래미안대치팰리스', address: '서울 강남구 대치동', lat: 37.4940, lng: 127.0630, propertyType: 'apartment', exclusiveArea: 160.24, buildingYear: 2015 },
  { id: 'prop-041', name: '대치 래미안', address: '서울 강남구 대치동', lat: 37.4950, lng: 127.0600, propertyType: 'apartment', exclusiveArea: 132.85, buildingYear: 2002 },

  // === 잠실/송파 일대 ===
  { id: 'prop-042', name: '잠실엘스', address: '서울 송파구 잠실동', lat: 37.5130, lng: 127.0850, propertyType: 'apartment', exclusiveArea: 119.93, buildingYear: 2008 },
  { id: 'prop-043', name: '잠실리센츠', address: '서울 송파구 잠실동', lat: 37.5115, lng: 127.0830, propertyType: 'apartment', exclusiveArea: 125.58, buildingYear: 2008 },
  { id: 'prop-044', name: '헬리오시티', address: '서울 송파구 가락동', lat: 37.4960, lng: 127.1070, propertyType: 'apartment', exclusiveArea: 128.72, buildingYear: 2018 },
  { id: 'prop-045', name: '올림픽파크포레온', address: '서울 송파구 둔촌동', lat: 37.5195, lng: 127.1260, propertyType: 'apartment', exclusiveArea: 159.07, buildingYear: 2024 },

  // === 구기동/평창동 일대 ===
  { id: 'prop-046', name: '구기동 단독주택', address: '서울 종로구 구기동', lat: 37.5980, lng: 126.9650, propertyType: 'house', exclusiveArea: 560.0, buildingYear: 2018 },
  { id: 'prop-047', name: '평창동 단독주택', address: '서울 종로구 평창동', lat: 37.6120, lng: 126.9680, propertyType: 'house', exclusiveArea: 490.0, buildingYear: 2010 },

  // === 성북동 일대 ===
  { id: 'prop-048', name: '성북동 단독주택', address: '서울 성북구 성북동', lat: 37.5930, lng: 127.0040, propertyType: 'house', exclusiveArea: 420.0, buildingYear: 2006 },

  // === 용산 일대 ===
  { id: 'prop-049', name: '래미안 첼리투스', address: '서울 용산구 이촌동', lat: 37.5265, lng: 126.9620, propertyType: 'apartment', exclusiveArea: 183.12, buildingYear: 2014 },
  { id: 'prop-050', name: '시티파크', address: '서울 용산구 이촌동', lat: 37.5270, lng: 126.9640, propertyType: 'apartment', exclusiveArea: 168.93, buildingYear: 2012 },

  // === 마포 일대 ===
  { id: 'prop-051', name: '마포래미안푸르지오', address: '서울 마포구 아현동', lat: 37.5510, lng: 126.9560, propertyType: 'apartment', exclusiveArea: 149.47, buildingYear: 2014 },
  { id: 'prop-052', name: '마포프레스티지자이', address: '서울 마포구 염리동', lat: 37.5450, lng: 126.9480, propertyType: 'apartment', exclusiveArea: 134.66, buildingYear: 2018 },

  // === 강남 기타 ===
  { id: 'prop-053', name: '압구정 현대아파트', address: '서울 강남구 압구정동', lat: 37.5275, lng: 127.0280, propertyType: 'apartment', exclusiveArea: 196.20, buildingYear: 1982 },
  { id: 'prop-054', name: '신현대 9,11,12차', address: '서울 강남구 압구정동', lat: 37.5280, lng: 127.0295, propertyType: 'apartment', exclusiveArea: 155.0, buildingYear: 1987 },
  { id: 'prop-055', name: '신사동 빌딩', address: '서울 강남구 신사동', lat: 37.5165, lng: 127.0210, propertyType: 'building', exclusiveArea: null, buildingYear: 2008 },

  // === 종로 일대 ===
  { id: 'prop-056', name: '경희궁자이', address: '서울 종로구 교남동', lat: 37.5680, lng: 126.9660, propertyType: 'apartment', exclusiveArea: 163.55, buildingYear: 2017 },

  // === 강북 일대 ===
  { id: 'prop-057', name: '래미안 위브', address: '서울 서대문구 북아현동', lat: 37.5600, lng: 126.9540, propertyType: 'apartment', exclusiveArea: 130.22, buildingYear: 2016 },

  // === 세곡동 일대 ===
  { id: 'prop-058', name: '세곡동 빌딩', address: '서울 강남구 세곡동', lat: 37.4650, lng: 127.0910, propertyType: 'building', exclusiveArea: null, buildingYear: 2016 },

  // === 기존 추가 매물 ===
  { id: 'prop-059', name: '이태원 빌딩 B', address: '서울 용산구 이태원동', lat: 37.5345, lng: 126.9960, propertyType: 'building', exclusiveArea: null, buildingYear: 2018 },
  { id: 'prop-060', name: '한남동 빌딩 (싸이)', address: '서울 용산구 한남동', lat: 37.5360, lng: 127.0015, propertyType: 'building', exclusiveArea: null, buildingYear: 2012 },
  { id: 'prop-061', name: '래미안퍼스티지 (B동)', address: '서울 서초구 반포동', lat: 37.5048, lng: 126.9915, propertyType: 'apartment', exclusiveArea: 163.90, buildingYear: 2009 },
  { id: 'prop-062', name: '서초 그랑자이', address: '서울 서초구 서초동', lat: 37.4920, lng: 127.0150, propertyType: 'apartment', exclusiveArea: 155.82, buildingYear: 2020 },
  { id: 'prop-063', name: '르엘신반포', address: '서울 서초구 반포동', lat: 37.5070, lng: 126.9945, propertyType: 'apartment', exclusiveArea: 180.20, buildingYear: 2023 },
  { id: 'prop-064', name: '도곡 타워팰리스 (G동)', address: '서울 강남구 도곡동', lat: 37.4925, lng: 127.0560, propertyType: 'apartment', exclusiveArea: 198.36, buildingYear: 2004 },
  { id: 'prop-065', name: '한남 리버힐', address: '서울 용산구 한남동', lat: 37.5332, lng: 127.0040, propertyType: 'apartment', exclusiveArea: 244.19, buildingYear: 2001 },
  { id: 'prop-066', name: '강남구 역삼동 빌딩', address: '서울 강남구 역삼동', lat: 37.4990, lng: 127.0370, propertyType: 'building', exclusiveArea: null, buildingYear: 2007 },
  { id: 'prop-067', name: '송파 시그니처롯데', address: '서울 송파구 신천동', lat: 37.5145, lng: 127.0920, propertyType: 'apartment', exclusiveArea: 142.36, buildingYear: 2019 },
  { id: 'prop-068', name: '잠실 래미안아이파크', address: '서울 송파구 잠실동', lat: 37.5105, lng: 127.0800, propertyType: 'apartment', exclusiveArea: 157.60, buildingYear: 2024 },

  // === 신규 검증 매물 (69~91) ===

  // 전지현 관련
  { id: 'prop-069', name: '아크로서울포레스트 PH', address: '서울 성동구 성수동1가', lat: 37.5440, lng: 127.0530, propertyType: 'apartment', exclusiveArea: 264.0, buildingYear: 2020 },
  { id: 'prop-070', name: '성수동 아뜰리에길 건물', address: '서울 성동구 성수동1가', lat: 37.5435, lng: 127.0520, propertyType: 'building', exclusiveArea: null, buildingYear: 2015 },
  { id: 'prop-071', name: '등촌동 상가 (공항대로)', address: '서울 강서구 등촌동', lat: 37.5510, lng: 126.8635, propertyType: 'building', exclusiveArea: null, buildingYear: 2010 },

  // 비&김태희 관련
  { id: 'prop-072', name: '서초동 강남대로변 빌딩', address: '서울 서초구 서초동', lat: 37.4970, lng: 127.0280, propertyType: 'building', exclusiveArea: null, buildingYear: 2015 },
  { id: 'prop-073', name: '압구정 로데오거리 건물', address: '서울 강남구 압구정동', lat: 37.5270, lng: 127.0400, propertyType: 'building', exclusiveArea: null, buildingYear: 2010 },

  // 아이유 관련
  { id: 'prop-074', name: '에테르노 청담', address: '서울 강남구 청담동', lat: 37.5220, lng: 127.0445, propertyType: 'apartment', exclusiveArea: 464.0, buildingYear: 2023 },

  // 유재석 관련
  { id: 'prop-075', name: '브라이튼N40', address: '서울 강남구 논현동', lat: 37.5175, lng: 127.0305, propertyType: 'apartment', exclusiveArea: 199.0, buildingYear: 2022 },
  { id: 'prop-076', name: '논현동 토지+빌라', address: '서울 강남구 논현동', lat: 37.5180, lng: 127.0310, propertyType: 'building', exclusiveArea: null, buildingYear: null },

  // 싸이 관련
  { id: 'prop-077', name: '창천동 빌딩 (신촌역)', address: '서울 마포구 창천동', lat: 37.5562, lng: 126.9370, propertyType: 'building', exclusiveArea: null, buildingYear: 2010 },
  { id: 'prop-078', name: '신사동 빌딩 (싸이)', address: '서울 강남구 신사동', lat: 37.5190, lng: 127.0230, propertyType: 'building', exclusiveArea: null, buildingYear: 2018 },

  // BTS 제이홉 관련
  { id: 'prop-079', name: '아페르한강 PH', address: '서울 용산구', lat: 37.5275, lng: 126.9680, propertyType: 'apartment', exclusiveArea: 232.86, buildingYear: 2023 },

  // GD 관련
  { id: 'prop-080', name: '워너청담', address: '서울 강남구 청담동', lat: 37.5232, lng: 127.0468, propertyType: 'apartment', exclusiveArea: null, buildingYear: 2024 },

  // 임영웅 관련
  { id: 'prop-081', name: '메세나폴리스 PH', address: '서울 마포구 합정동', lat: 37.5506, lng: 126.9130, propertyType: 'apartment', exclusiveArea: null, buildingYear: 2011 },

  // 서장훈 관련
  { id: 'prop-082', name: '서초동 양재역 빌딩', address: '서울 서초구 서초동', lat: 37.4842, lng: 127.0343, propertyType: 'building', exclusiveArea: null, buildingYear: 1998 },
  { id: 'prop-083', name: '흑석동 빌딩', address: '서울 동작구 흑석동', lat: 37.5060, lng: 126.9630, propertyType: 'building', exclusiveArea: null, buildingYear: 2000 },
  { id: 'prop-084', name: '서교동 빌딩 (홍대)', address: '서울 마포구 서교동', lat: 37.5524, lng: 126.9230, propertyType: 'building', exclusiveArea: null, buildingYear: 2010 },

  // 이승엽 관련
  { id: 'prop-085', name: '성수동 빌딩 (뚝섬역)', address: '서울 성동구 성수동1가', lat: 37.5460, lng: 127.0490, propertyType: 'building', exclusiveArea: null, buildingYear: 2005 },

  // 손흥민 관련
  { id: 'prop-086', name: '에테르노 압구정 PH', address: '서울 강남구 압구정동', lat: 37.5275, lng: 127.0310, propertyType: 'apartment', exclusiveArea: null, buildingYear: 2028 },

  // 현빈 관련
  { id: 'prop-087', name: '구리 아치울마을 PH', address: '경기도 구리시', lat: 37.5990, lng: 127.1290, propertyType: 'villa', exclusiveArea: 330.0, buildingYear: 2015 },

  // 박찬호 관련
  { id: 'prop-088', name: '신사동 도산대로 빌딩', address: '서울 강남구 신사동', lat: 37.5220, lng: 127.0230, propertyType: 'building', exclusiveArea: null, buildingYear: 2005 },

  // 장동건 관련
  { id: 'prop-089', name: '한남동 빌딩 (장동건)', address: '서울 용산구 한남동', lat: 37.5355, lng: 127.0010, propertyType: 'building', exclusiveArea: null, buildingYear: 2010 },
  { id: 'prop-090', name: '송정동 건물', address: '서울 성동구 송정동', lat: 37.5500, lng: 127.0600, propertyType: 'building', exclusiveArea: null, buildingYear: 2015 },

  // 손예진 관련
  { id: 'prop-091', name: '신사동 빌딩 (손예진)', address: '서울 강남구 신사동', lat: 37.5210, lng: 127.0225, propertyType: 'building', exclusiveArea: null, buildingYear: 2012 },

  // 김연아 관련
  { id: 'prop-092', name: '마크힐스 (흑석동)', address: '서울 동작구 흑석동', lat: 37.5085, lng: 126.9640, propertyType: 'villa', exclusiveArea: null, buildingYear: 2005 },

  // 기성용 관련
  { id: 'prop-093', name: '종각역 빌딩 (관철동)', address: '서울 종로구 관철동', lat: 37.5710, lng: 126.9835, propertyType: 'building', exclusiveArea: null, buildingYear: 2015 },
]

// ─── Celebrity ↔ Property 연결 (검증된 데이터) ──────────────

export const celebrityProperties: SeedCelebrityProperty[] = [
  // ========== 연예인 (검증된 언론보도 기반) ==========

  // 전지현 (3채) — 성수동 건물, 등촌동 상가, 아크로서울포레스트 PH / 총 ~1,500억
  { celebrityId: 'ent-01', propertyId: 'prop-070', price: 4680000, acquisitionDate: '2025-01', sourceType: 'reported', sourceNote: '성수동 아뜰리에길 건물 2채 468억 (뉴스1, 이데일리 2025)', sourceUrl: 'https://www.news1.kr/realestate/general/6085698' },
  { celebrityId: 'ent-01', propertyId: 'prop-071', price: 5050000, acquisitionDate: '2022-02', sourceType: 'reported', sourceNote: '등촌동 공항대로변 상가 505억 (뉴스1, 헤럴드경제 2022)', sourceUrl: 'https://www.news1.kr/realestate/general/5705394' },
  { celebrityId: 'ent-01', propertyId: 'prop-069', price: 1300000, acquisitionDate: '2022-09', sourceType: 'reported', sourceNote: '아크로서울포레스트 47층 PH 130억 전액 현금 (한국경제, 머니투데이 2023)', sourceUrl: 'https://news.mt.co.kr/mtview.php?no=2023051016455440406' },

  // 장동건&고소영 (4채) — PH129, 한남동 빌딩, 청담 빌딩, 송정동 / 총 ~618억
  { celebrityId: 'ent-02', propertyId: 'prop-016', price: 1640000, acquisitionDate: null, sourceType: 'reported', sourceNote: 'PH129 청담 공시가 164억, 4년 연속 전국 1위 (아시아경제, 머니투데이 2024)', sourceUrl: 'https://news.mt.co.kr/mtview.php?no=2024051017063596498' },
  { celebrityId: 'ent-02', propertyId: 'prop-089', price: 1260000, acquisitionDate: null, sourceType: 'reported', sourceNote: '한남동 빌딩 약 126억 매입, 현 시세 ~220억 (오토트리뷴)', sourceUrl: null },
  { celebrityId: 'ent-02', propertyId: 'prop-019', price: 600000, acquisitionDate: null, sourceType: 'reported', sourceNote: '고소영 청담동 빌딩 약 60억, 현 ~190억 (오토트리뷴)', sourceUrl: null },
  { celebrityId: 'ent-02', propertyId: 'prop-090', price: 390000, acquisitionDate: '2022-01', sourceType: 'reported', sourceNote: '송정동 건물 39억 (금강일보 2022)', sourceUrl: null },

  // 유재석 (3채) — 브라이튼N40, 압구정현대, 논현동 토지+빌라 / 총 ~330억+
  { celebrityId: 'ent-03', propertyId: 'prop-075', price: 866000, acquisitionDate: '2024-05', sourceType: 'reported', sourceNote: '브라이튼N40 PH 86.6억 전액 현금 (한국경제, 뉴스1 2024)', sourceUrl: 'https://www.hankyung.com/article/2024052098746' },
  { celebrityId: 'ent-03', propertyId: 'prop-053', price: 45000, acquisitionDate: '2000-08', sourceType: 'reported', sourceNote: '압구정현대 64평 약 4.5억 매입 (매일신문 2024)', sourceUrl: null },
  { celebrityId: 'ent-03', propertyId: 'prop-076', price: 1980000, acquisitionDate: '2023-01', sourceType: 'reported', sourceNote: '논현동 토지+빌라 198억 (116억+82억, 톱스타뉴스)', sourceUrl: null },

  // 강호동 (1채, 매각) — 신사동 가로수길 빌딩 141억 매입 → 166억 매각 (2024.12)
  { celebrityId: 'ent-04', propertyId: 'prop-078', price: 1410000, acquisitionDate: '2018-01', sourceType: 'reported', sourceNote: '신사동 가로수길 빌딩 141억 매입, 166억에 MC몽 매각 (헤럴드경제, 한국경제 2025)', sourceUrl: 'https://www.hankyung.com/article/2025010258886' },

  // GD 권지용 (3채) — 나인원한남 PH, 갤러리아포레, 워너청담 / 총 ~560억
  { celebrityId: 'ent-05', propertyId: 'prop-007', price: 1640000, acquisitionDate: '2019-06', sourceType: 'reported', sourceNote: '나인원한남 PH 164억 (분양전환, 비즈한국/뉴시스 2022 실거래가 확인)', sourceUrl: 'https://www.bizhankook.com/bk/article/25784' },
  { celebrityId: 'ent-05', propertyId: 'prop-037', price: 303000, acquisitionDate: '2013-03', sourceType: 'reported', sourceNote: '갤러리아포레 30.3억 (비즈한국)', sourceUrl: 'https://www.bizhankook.com/bk/article/25784' },
  { celebrityId: 'ent-05', propertyId: 'prop-080', price: 1650000, acquisitionDate: '2024-01', sourceType: 'reported', sourceNote: '워너청담 74평형 약 150~180억 분양 (서울경제, 헤럴드경제 2024)', sourceUrl: 'https://www.sedaily.com/NewsView/2DAXXGQM8X' },

  // 아이유 (1채) — 에테르노 청담 130억 (공시가 200.6억 전국 1위 2025)
  { celebrityId: 'ent-06', propertyId: 'prop-074', price: 1300000, acquisitionDate: '2023-12', sourceType: 'reported', sourceNote: '에테르노 청담 464㎡ 130억, 2025 공시가 200.6억 전국 1위 (한국경제, 이데일리)', sourceUrl: 'https://www.edaily.co.kr/news/read?newsId=01108806638956464' },

  // 현빈 (1채) — 구리 아치울마을 PH 48억 (매물가 70억)
  { celebrityId: 'ent-07', propertyId: 'prop-087', price: 480000, acquisitionDate: '2020-06', sourceType: 'reported', sourceNote: '구리 아치울마을 100평 PH 48억 전액 현금 (MBC, 세계일보)', sourceUrl: 'https://www.segye.com/newsView/20200728506420' },

  // 손예진 (1채) — 신사동 빌딩 160억
  { celebrityId: 'ent-08', propertyId: 'prop-091', price: 1600000, acquisitionDate: '2020-07', sourceType: 'reported', sourceNote: '신사동 빌딩 160억 (현금 40억+대출 120억, 이투데이 2020)', sourceUrl: 'https://www.etoday.co.kr/news/view/1922133' },

  // 송혜교 (2채) — 삼성동, 이태원
  { celebrityId: 'ent-09', propertyId: 'prop-023', price: 200000, acquisitionDate: '2016-02', sourceType: 'reported', sourceNote: '삼성동 래미안라클래시 보유 보도', sourceUrl: null },
  { celebrityId: 'ent-09', propertyId: 'prop-014', price: 200000, acquisitionDate: '2019-10', sourceType: 'reported', sourceNote: '이태원 고급빌라 보유 보도', sourceUrl: null },

  // 이병헌 (1채) — 이태원 단독주택
  { celebrityId: 'ent-10', propertyId: 'prop-012', price: 650000, acquisitionDate: '2014-07', sourceType: 'reported', sourceNote: '이태원 단독주택 약 65억원 매입 보도', sourceUrl: null },

  // 비(정지훈)&김태희 (2채) — 서초동 빌딩 920억, 압구정 건물 159억 / 총 ~1,600억+
  { celebrityId: 'ent-11', propertyId: 'prop-072', price: 9200000, acquisitionDate: '2021-01', sourceType: 'reported', sourceNote: '서초동 강남대로변 빌딩 920억, 현 시세 1,400~1,500억 (뉴스1, 한국경제 2024)', sourceUrl: 'https://www.news1.kr/realestate/general/5587873' },
  { celebrityId: 'ent-11', propertyId: 'prop-073', price: 1590000, acquisitionDate: '2024-01', sourceType: 'reported', sourceNote: '압구정 로데오거리 빌딩 158.99억 (아시아경제, 한국경제 2024)', sourceUrl: 'https://www.asiae.co.kr/article/2024010409074476135' },

  // 김태희 (비와 공동 소유로 표시)
  { celebrityId: 'ent-30', propertyId: 'prop-072', price: 9200000, acquisitionDate: '2021-01', sourceType: 'reported', sourceNote: '비(정지훈)와 공동 소유, 서초동 빌딩 920억 (뉴스1)', sourceUrl: 'https://www.news1.kr/realestate/general/5587873' },

  // 김수현 (1채) — 삼성동
  { celebrityId: 'ent-12', propertyId: 'prop-021', price: 240000, acquisitionDate: '2015-05', sourceType: 'reported', sourceNote: '삼성동 아이파크 매입 보도 (약 24억원)', sourceUrl: null },

  // 서장훈 (3채 빌딩) — 서초동/양재역, 흑석동, 서교동/홍대 / 총 ~700억+
  { celebrityId: 'ent-13', propertyId: 'prop-082', price: 281700, acquisitionDate: '2000-01', sourceType: 'reported', sourceNote: '서초동 양재역 빌딩 28.17억 경매 낙찰, 현 ~450억 (한국경제, 머니투데이 2022)', sourceUrl: 'https://www.hankyung.com/article/2022081207437' },
  { celebrityId: 'ent-13', propertyId: 'prop-083', price: 580000, acquisitionDate: '2005-01', sourceType: 'reported', sourceNote: '흑석동 빌딩 58억, 현 ~150억 (한국경제 2022)', sourceUrl: 'https://www.hankyung.com/article/2022081207437' },
  { celebrityId: 'ent-13', propertyId: 'prop-084', price: 1400000, acquisitionDate: '2019-01', sourceType: 'reported', sourceNote: '서교동 홍대 빌딩 140억 (머니투데이 2022)', sourceUrl: 'https://news.mt.co.kr/mtview.php?no=2022081215153419498' },

  // BTS 진 (3채) — 한남더힐 3채 (44.9억, 42.7억, 175억 PH)
  { celebrityId: 'ent-14', propertyId: 'prop-001', price: 449000, acquisitionDate: '2019-07', sourceType: 'reported', sourceNote: '한남더힐 233㎡ 44.9억 (비즈한국, 매거진한경 2024)', sourceUrl: 'https://magazine.hankyung.com/business/article/202406147460b' },
  { celebrityId: 'ent-14', propertyId: 'prop-002', price: 427000, acquisitionDate: '2019-11', sourceType: 'reported', sourceNote: '한남더힐 206㎡ 42.7억 (비즈한국, 매거진한경 2024)', sourceUrl: 'https://magazine.hankyung.com/business/article/202406147460b' },
  { celebrityId: 'ent-14', propertyId: 'prop-003', price: 1750000, acquisitionDate: '2025-05', sourceType: 'reported', sourceNote: '한남더힐 PH 243㎡ 175억 전액 현금 (머니투데이, 매일신문 2025)', sourceUrl: 'https://news.mt.co.kr/mtview.php?no=2025060519032738447' },

  // BTS RM (1채) — 나인원한남 63.6억 (한남더힐 매각 후 이동)
  { celebrityId: 'ent-15', propertyId: 'prop-007', price: 636000, acquisitionDate: '2021-01', sourceType: 'reported', sourceNote: '나인원한남 244㎡ 63.6억 전액 현금 (이데일리, 네이트 2021)', sourceUrl: 'https://www.edaily.co.kr/news/read?newsId=01099526629012408' },

  // BTS 정국 (2채) — 이태원 대저택 76.3억, 트리마제 19.5억
  { celebrityId: 'ent-16', propertyId: 'prop-013', price: 763000, acquisitionDate: '2020-11', sourceType: 'reported', sourceNote: '이태원 대저택 76.3억, 대지 633㎡ 구옥 철거 후 신축 중 (이투데이, 헤럴드경제)', sourceUrl: 'https://www.etoday.co.kr/news/view/1968254' },
  { celebrityId: 'ent-16', propertyId: 'prop-038', price: 195000, acquisitionDate: '2018-01', sourceType: 'reported', sourceNote: '트리마제 19.5억 (이투데이 2018)', sourceUrl: 'https://www.etoday.co.kr/news/view/1968254' },

  // BTS 뷔 (1채) — PH129 청담 142억
  { celebrityId: 'ent-17', propertyId: 'prop-016', price: 1420000, acquisitionDate: '2025-09', sourceType: 'reported', sourceNote: 'PH129 청담 273.96㎡ 복층 142억 전액 현금 (한국경제, 서울경제 2025)', sourceUrl: 'https://www.hankyung.com/article/2025090154896' },

  // BTS 지민 (1채) — 나인원한남 59억
  { celebrityId: 'ent-18', propertyId: 'prop-007', price: 590000, acquisitionDate: '2021-01', sourceType: 'reported', sourceNote: '나인원한남 244㎡ 59억 분양전환 전액 현금 (위키트리, 이데일리)', sourceUrl: 'https://www.edaily.co.kr/news/read?newsId=01099526629012408' },

  // 블랙핑크 제니 (1채) — 한남동 단독주택
  { celebrityId: 'ent-19', propertyId: 'prop-010', price: 400000, acquisitionDate: '2022-09', sourceType: 'unverified', sourceNote: '한남동 단독주택 매입 보도 (약 40억원, 미확인)', sourceUrl: null },

  // 수지 (1채) — PH129
  { celebrityId: 'ent-20', propertyId: 'prop-017', price: 500000, acquisitionDate: '2020-06', sourceType: 'reported', sourceNote: '더펜트하우스 청담 매입 보도 (약 50억원)', sourceUrl: null },

  // 싸이 (3채) — 한남동 78.5억, 신사동 80억, 창천동 148.5억 / 총 ~800억+
  { celebrityId: 'ent-21', propertyId: 'prop-060', price: 785000, acquisitionDate: '2012-02', sourceType: 'reported', sourceNote: '한남동 빌딩 78.5억 공동명의, 현 ~150억 (스카이데일리)', sourceUrl: null },
  { celebrityId: 'ent-21', propertyId: 'prop-078', price: 800000, acquisitionDate: '2017-03', sourceType: 'reported', sourceNote: '신사동 빌딩 2필지 합 ~80억, 현 ~208억 (머니투데이, 한국경제)', sourceUrl: 'https://news.mt.co.kr/mtview.php?no=2024011015280178347' },
  { celebrityId: 'ent-21', propertyId: 'prop-077', price: 1485000, acquisitionDate: '2018-01', sourceType: 'reported', sourceNote: '창천동 신촌역 빌딩 148.5억, 현 ~186억 (이데일리)', sourceUrl: 'https://www.edaily.co.kr/news/read?newsId=01096166625839144' },

  // 신동엽 (2채) — 논현동, 반포
  { celebrityId: 'ent-22', propertyId: 'prop-033', price: 600000, acquisitionDate: '2010-06', sourceType: 'reported', sourceNote: '논현동 빌딩 매입 보도 (약 60억원)', sourceUrl: null },
  { celebrityId: 'ent-22', propertyId: 'prop-027', price: 350000, acquisitionDate: '2009-08', sourceType: 'reported', sourceNote: '반포 래미안퍼스티지 보유 보도', sourceUrl: null },

  // 하정우 (1채) — 한남동
  { celebrityId: 'ent-23', propertyId: 'prop-065', price: 300000, acquisitionDate: '2013-09', sourceType: 'reported', sourceNote: '한남동 아파트 보유 보도 (약 30억원)', sourceUrl: null },

  // 송중기 (1채) — 이태원
  { celebrityId: 'ent-24', propertyId: 'prop-012', price: 1000000, acquisitionDate: '2020-02', sourceType: 'reported', sourceNote: '이태원 단독주택 약 100억원 매입 보도', sourceUrl: null },

  // 이영애 (1채) — UN빌리지
  { celebrityId: 'ent-25', propertyId: 'prop-011', price: 300000, acquisitionDate: '2010-04', sourceType: 'reported', sourceNote: 'UN빌리지 단독주택 보유 보도', sourceUrl: null },

  // BTS 슈가 (1채) — 한남리버힐 34억
  { celebrityId: 'ent-26', propertyId: 'prop-065', price: 340000, acquisitionDate: '2018-08', sourceType: 'reported', sourceNote: '한남리버힐 244.19㎡ 34억 (위키트리)', sourceUrl: null },

  // BTS 제이홉 (1채) — 아페르한강 PH 120억
  { celebrityId: 'ent-27', propertyId: 'prop-079', price: 1200000, acquisitionDate: '2024-01', sourceType: 'reported', sourceNote: '아페르한강 PH 232.86㎡ 약 120억 전액 현금 (헤럴드경제 2024)', sourceUrl: 'https://biz.heraldcorp.com/view/20240903050063' },

  // 임영웅 (1채) — 메세나폴리스 PH 51억
  { celebrityId: 'ent-28', propertyId: 'prop-081', price: 510000, acquisitionDate: '2022-09', sourceType: 'reported', sourceNote: '메세나폴리스 PH 51억 전액 현금 (한국경제, 우먼센스 2022)', sourceUrl: 'https://www.hankyung.com/article/2022092779571' },

  // 이승기 (1채) — 성북동 56.35억
  { celebrityId: 'ent-29', propertyId: 'prop-048', price: 563500, acquisitionDate: '2020-12', sourceType: 'reported', sourceNote: '성북동 단독주택 56.35억, 현 시세 약 111억 (이투데이, 아시아경제)', sourceUrl: 'https://www.asiae.co.kr/article/2024062009290588648' },

  // ========== 정치인 ==========

  // 정진석 (3채)
  { celebrityId: 'pol-01', propertyId: 'prop-025', price: 350000, acquisitionDate: '2012-03', sourceType: 'verified', sourceNote: '2024년 재산공개 기준', sourceUrl: null },
  { celebrityId: 'pol-01', propertyId: 'prop-029', price: 280000, acquisitionDate: '2016-07', sourceType: 'verified', sourceNote: '2024년 재산공개 기준', sourceUrl: null },
  { celebrityId: 'pol-01', propertyId: 'prop-042', price: 260000, acquisitionDate: '2008-05', sourceType: 'verified', sourceNote: '2024년 재산공개 기준', sourceUrl: null },

  // 이낙연 (3채)
  { celebrityId: 'pol-02', propertyId: 'prop-056', price: 280000, acquisitionDate: '2017-04', sourceType: 'verified', sourceNote: '재산공개 기준, 종로구 아파트', sourceUrl: null },
  { celebrityId: 'pol-02', propertyId: 'prop-040', price: 300000, acquisitionDate: '2010-06', sourceType: 'verified', sourceNote: '재산공개 기준', sourceUrl: null },
  { celebrityId: 'pol-02', propertyId: 'prop-030', price: 250000, acquisitionDate: '2005-09', sourceType: 'verified', sourceNote: '재산공개 기준', sourceUrl: null },

  // 나경원 (2채)
  { celebrityId: 'pol-03', propertyId: 'prop-025', price: 380000, acquisitionDate: '2016-11', sourceType: 'verified', sourceNote: '재산공개 기준, 반포 아크로리버파크', sourceUrl: null },
  { celebrityId: 'pol-03', propertyId: 'prop-041', price: 200000, acquisitionDate: '2003-08', sourceType: 'verified', sourceNote: '재산공개 기준, 대치동 래미안', sourceUrl: null },

  // 박영선 (3채)
  { celebrityId: 'pol-04', propertyId: 'prop-051', price: 180000, acquisitionDate: '2014-03', sourceType: 'verified', sourceNote: '재산공개 기준, 마포 아파트', sourceUrl: null },
  { celebrityId: 'pol-04', propertyId: 'prop-029', price: 260000, acquisitionDate: '2018-05', sourceType: 'verified', sourceNote: '재산공개 기준, 서초 아파트', sourceUrl: null },
  { celebrityId: 'pol-04', propertyId: 'prop-055', price: 450000, acquisitionDate: '2011-09', sourceType: 'verified', sourceNote: '재산공개 기준, 신사동 빌딩', sourceUrl: null },

  // 윤희숙 (3채)
  { celebrityId: 'pol-05', propertyId: 'prop-026', price: 350000, acquisitionDate: '2009-06', sourceType: 'verified', sourceNote: '재산공개 기준, 반포자이', sourceUrl: null },
  { celebrityId: 'pol-05', propertyId: 'prop-040', price: 320000, acquisitionDate: '2011-03', sourceType: 'verified', sourceNote: '재산공개 기준, 대치 아파트', sourceUrl: null },
  { celebrityId: 'pol-05', propertyId: 'prop-022', price: 280000, acquisitionDate: '2015-11', sourceType: 'verified', sourceNote: '재산공개 기준, 삼성동 아파트', sourceUrl: null },

  // 추미애 (2채)
  { celebrityId: 'pol-06', propertyId: 'prop-031', price: 220000, acquisitionDate: '2018-06', sourceType: 'verified', sourceNote: '재산공개 기준', sourceUrl: null },
  { celebrityId: 'pol-06', propertyId: 'prop-057', price: 150000, acquisitionDate: '2010-02', sourceType: 'verified', sourceNote: '재산공개 기준, 서대문구 아파트', sourceUrl: null },

  // 한덕수 (3채)
  { celebrityId: 'pol-07', propertyId: 'prop-007', price: 800000, acquisitionDate: '2020-09', sourceType: 'verified', sourceNote: '재산공개 기준, 나인원한남', sourceUrl: null },
  { celebrityId: 'pol-07', propertyId: 'prop-048', price: 600000, acquisitionDate: '2006-05', sourceType: 'verified', sourceNote: '재산공개 기준, 성북동 주택', sourceUrl: null },
  { celebrityId: 'pol-07', propertyId: 'prop-025', price: 350000, acquisitionDate: '2016-11', sourceType: 'verified', sourceNote: '재산공개 기준, 아크로리버파크', sourceUrl: null },

  // 김기현 (2채)
  { celebrityId: 'pol-08', propertyId: 'prop-062', price: 200000, acquisitionDate: '2020-07', sourceType: 'verified', sourceNote: '재산공개 기준, 서초 아파트', sourceUrl: null },
  { celebrityId: 'pol-08', propertyId: 'prop-053', price: 350000, acquisitionDate: '2005-03', sourceType: 'verified', sourceNote: '재산공개 기준, 압구정 아파트', sourceUrl: null },

  // 이재명 (1채)
  { celebrityId: 'pol-09', propertyId: 'prop-044', price: 180000, acquisitionDate: '2019-04', sourceType: 'verified', sourceNote: '재산공개 기준', sourceUrl: null },

  // 오세훈 (2채)
  { celebrityId: 'pol-10', propertyId: 'prop-054', price: 300000, acquisitionDate: '2000-06', sourceType: 'verified', sourceNote: '재산공개 기준, 압구정 아파트', sourceUrl: null },
  { celebrityId: 'pol-10', propertyId: 'prop-066', price: 500000, acquisitionDate: '2008-11', sourceType: 'verified', sourceNote: '재산공개 기준, 역삼동 빌딩', sourceUrl: null },

  // ========== 운동선수 (검증된 보도 기반) ==========

  // 손흥민 (2채) — 에테르노 압구정 PH 400억 분양, 신현대 22억
  { celebrityId: 'ath-01', propertyId: 'prop-086', price: 4000000, acquisitionDate: '2024-07', sourceType: 'reported', sourceNote: '에테르노 압구정 그랜드 디럭스 PH 약 400억 분양 (한국경제, 파이낸셜뉴스 2024)', sourceUrl: 'https://www.hankyung.com/article/2024070550677' },
  { celebrityId: 'ath-01', propertyId: 'prop-054', price: 220000, acquisitionDate: '2016-03', sourceType: 'reported', sourceNote: '신현대 9,11,12차 155㎡ 22억 (한국경제 2025)', sourceUrl: 'https://www.hankyung.com/article/2025010887496' },

  // 류현진 (2채)
  { celebrityId: 'ath-02', propertyId: 'prop-035', price: 350000, acquisitionDate: '2014-05', sourceType: 'reported', sourceNote: '도곡동 타워팰리스 매입 보도', sourceUrl: null },
  { celebrityId: 'ath-02', propertyId: 'prop-028', price: 380000, acquisitionDate: '2023-06', sourceType: 'reported', sourceNote: '반포 래미안원베일리 매입 보도', sourceUrl: null },

  // 추신수 (2채)
  { celebrityId: 'ath-03', propertyId: 'prop-035', price: 300000, acquisitionDate: '2011-09', sourceType: 'reported', sourceNote: '타워팰리스 보유 보도', sourceUrl: null },
  { celebrityId: 'ath-03', propertyId: 'prop-026', price: 380000, acquisitionDate: '2016-04', sourceType: 'reported', sourceNote: '반포자이 매입 보도', sourceUrl: null },

  // 김연아 (1채) — 마크힐스 흑석동 22억, 현 시세 65~105억
  { celebrityId: 'ath-04', propertyId: 'prop-092', price: 220000, acquisitionDate: '2011-12', sourceType: 'reported', sourceNote: '마크힐스 흑석동 고급빌라 22억 매입 (2011), 현 시세 65~105억 (한국경제, 헤럴드경제 2025)', sourceUrl: 'https://biz.heraldcorp.com/view/20250116050064' },

  // 박지성 (1채)
  { celebrityId: 'ath-05', propertyId: 'prop-065', price: 250000, acquisitionDate: '2012-11', sourceType: 'reported', sourceNote: '한남동 아파트 보유 보도', sourceUrl: null },

  // 박찬호 (1채) — 신사동 도산대로 빌딩 65~73억 매입, 현 ~800억
  { celebrityId: 'ath-06', propertyId: 'prop-088', price: 700000, acquisitionDate: '2003-01', sourceType: 'reported', sourceNote: '신사동 도산대로 빌딩 65~73억(매입+신축), 대지 688㎡ 연면적 5544㎡, 현 ~800억, 연 임대수익 13억 (헤럴드경제, 뉴스1)', sourceUrl: 'https://biz.heraldcorp.com/view/20241210050082' },

  // 기성용 (1채) — 종각역 빌딩 209억, 현 ~275억
  { celebrityId: 'ath-07', propertyId: 'prop-093', price: 2090000, acquisitionDate: '2020-11', sourceType: 'reported', sourceNote: '종로구 관철동 종각역 9층 빌딩 209억 매입, 현 ~275억 (한국경제, 머니투데이 2021)', sourceUrl: 'https://news.mt.co.kr/mtview.php?no=2021011409135096498' },

  // 이강인 (1채)
  { celebrityId: 'ath-08', propertyId: 'prop-018', price: 350000, acquisitionDate: '2023-10', sourceType: 'reported', sourceNote: '청담자이 매입 보도', sourceUrl: null },

  // 김광현 (1채)
  { celebrityId: 'ath-09', propertyId: 'prop-043', price: 200000, acquisitionDate: '2021-04', sourceType: 'reported', sourceNote: '잠실리센츠 보유 보도', sourceUrl: null },

  // 황희찬 (1채)
  { celebrityId: 'ath-10', propertyId: 'prop-038', price: 250000, acquisitionDate: '2022-08', sourceType: 'reported', sourceNote: '성수동 트리마제 매입 보도', sourceUrl: null },

  // 이승엽 (1채) — 성수동 빌딩 293억, 현 ~1,167억
  { celebrityId: 'ath-11', propertyId: 'prop-085', price: 2930000, acquisitionDate: '2009-07', sourceType: 'reported', sourceNote: '성수동 빌딩 뚝섬역 도보 2분, 293억(현금193억+대출116억), 현 ~1,167억 (뉴스1, 헤럴드경제)', sourceUrl: 'https://www.news1.kr/realestate/general/5364798' },
]

// ─── Helper: 셀럽별 보유 매물 수 계산 ──────────────────────

export function getPropertyCount(celebrityId: string): number {
  return celebrityProperties.filter((cp) => cp.celebrityId === celebrityId).length
}

// ─── Helper: MapCelebrityData 변환 ─────────────────────────

export interface MapCelebrityData {
  id: string
  celebrityId: string
  celebrityName: string
  category: 'entertainer' | 'politician' | 'athlete'
  propertyId: string
  propertyName: string
  address: string
  lat: number
  lng: number
  price: number | null
  propertyCount: number
}

export function toMapCelebrityData(): MapCelebrityData[] {
  const propertyMap = new Map(properties.map((p) => [p.id, p]))
  const celebrityMap = new Map(celebrities.map((c) => [c.id, c]))
  const countMap = new Map<string, number>()

  for (const cp of celebrityProperties) {
    countMap.set(cp.celebrityId, (countMap.get(cp.celebrityId) ?? 0) + 1)
  }

  return celebrityProperties
    .filter((cp) => propertyMap.has(cp.propertyId) && celebrityMap.has(cp.celebrityId))
    .map((cp, index) => {
      const celeb = celebrityMap.get(cp.celebrityId)!
      const prop = propertyMap.get(cp.propertyId)!

      return {
        id: `seed-${index + 1}`,
        celebrityId: cp.celebrityId,
        celebrityName: celeb.name,
        category: celeb.category,
        propertyId: cp.propertyId,
        propertyName: prop.name,
        address: prop.address,
        lat: prop.lat,
        lng: prop.lng,
        price: cp.price,
        propertyCount: countMap.get(cp.celebrityId) ?? 1,
      }
    })
}

// ─── Stats ─────────────────────────────────────────────────

export const SEED_STATS = {
  totalCelebrities: celebrities.length,
  entertainers: celebrities.filter((c) => c.category === 'entertainer').length,
  politicians: celebrities.filter((c) => c.category === 'politician').length,
  athletes: celebrities.filter((c) => c.category === 'athlete').length,
  totalProperties: properties.length,
  totalLinks: celebrityProperties.length,
} as const
