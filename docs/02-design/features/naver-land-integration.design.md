# Design: Naver Land Integration

> Plan Reference: `docs/01-plan/features/naver-land-integration.plan.md`

---

## 1. File Structure

```
src/
├── lib/naver-land/
│   ├── types.ts              # NaverLandListing, SearchParams 타입
│   ├── price-parser.ts       # 가격 문자열 → 만원 숫자 변환
│   └── cli-client.ts         # CLI 실행 래퍼 + 메모리 캐시
├── app/api/naver-land/
│   └── search/route.ts       # GET API Route
├── components/property/
│   ├── naver-listings.tsx     # 네이버 실시간 매물 리스트
│   └── price-comparison-card.tsx  # 매입가 vs 호가 비교
└── lib/geo/
    └── ai-analyst-engine.ts  # (수정) 시세 조회 패턴 추가
```

---

## 2. Type Definitions — `types.ts`

```typescript
export interface NaverLandListing {
  articleNo: string
  complexName: string
  tradeType: '매매' | '전세' | '월세' | '단기임대'
  propertyType: string
  exclusiveArea: number   // ㎡
  supplyArea: number      // ㎡
  pyeong: number
  sizeType: string
  price: number           // 만원 (파싱 후)
  priceText: string       // 원본 텍스트
  rentPrice: number | null
  floorInfo: string
  confirmDate: string
  tags: string[]
}

export interface NaverSearchParams {
  district: string
  tradeType?: string
  nameContains?: string
  minArea?: number
  maxArea?: number
  limit?: number
}

export interface NaverSearchResult {
  listings: NaverLandListing[]
  meta: {
    total: number
    fetchedAt: string
    cached: boolean
    district: string
  }
}

export interface PriceComparison {
  acquisitionPrice: number | null  // 만원
  currentMinPrice: number | null
  currentMaxPrice: number | null
  currentMedianPrice: number | null
  listingCount: number
  returnRateMin: number | null     // % (소수)
  returnRateMax: number | null
}
```

---

## 3. Price Parser — `price-parser.ts`

```typescript
// parseNaverPrice("36억 6,100") → 366100
// parseNaverPrice("15억")       → 150000
// parseNaverPrice("9,500")      → 9500
// parseNaverPrice("3억 5,000/150") → { deposit: 35000, monthly: 150 }

export function parseNaverPrice(text: string): number
export function parseNaverPriceWithRent(text: string, rentText: string | null):
  { price: number; rent: number | null }
```

**파싱 규칙:**
1. `"억"` 단위: `억` 앞 숫자 × 10000 + `억` 뒤 숫자 (콤마 제거)
2. 콤마 포함 숫자: 콤마 제거 후 정수 변환
3. 월세: `rent_prc` 필드에서 보증금/월세 분리

---

## 4. CLI Client — `cli-client.ts`

```typescript
// 서버 사이드 전용 (Node.js child_process)
export async function searchNaverLand(params: NaverSearchParams): Promise<NaverSearchResult>
```

**내부 구현:**
1. 캐시 확인 (Map<string, {data, expiry}>), TTL 5분
2. CLI 명령어 조립: `cli-anything-naver-land --json search region -d {district} ...`
3. `execFile` 실행 (타임아웃 20초)
4. JSON 파싱 + `parseNaverPrice` 적용
5. 캐시 저장 + 결과 반환

**동시 실행 제어:** Semaphore 패턴 (최대 3개)

---

## 5. API Route — `GET /api/naver-land/search`

```
Query Parameters:
  district   (필수) 구 이름 (예: 용산구)
  name       (선택) 단지명 포함 (예: 한남더힐)
  tradeType  (선택) 매매|전세|월세 (기본: 매매)
  limit      (선택) 최대 결과 수 (기본: 20)

Response 200:
  { listings: NaverLandListing[], meta: {...} }

Response 500:
  { error: string, fallback: true }
```

**입력 검증:** district 필수, 한글만 허용, limit 1~100 범위

---

## 6. UI Components

### 6-1. NaverListings — `naver-listings.tsx`

매물 상세 페이지에 들어가는 실시간 시세 섹션.

**Props:**
```typescript
interface NaverListingsProps {
  propertyName: string
  district: string
  acquisitionPrice: number | null  // 셀럽 매입가 (만원)
  exclusiveArea: number | null     // 전용면적 (㎡)
}
```

**상태:** `idle` → `loading` → `loaded` | `error` | `empty`

**렌더링:**
- 로딩: 스켈레톤 3줄
- 에러: "시세를 불러올 수 없습니다" + 재시도 버튼
- 빈결과: "현재 등록된 매물이 없습니다"
- 성공: PriceComparisonCard + 매물 리스트

### 6-2. PriceComparisonCard — `price-comparison-card.tsx`

**Props:**
```typescript
interface PriceComparisonCardProps {
  acquisitionPrice: number | null
  acquisitionDate: string | null
  currentPrices: number[]          // 현재 매물가 배열 (만원)
  propertyName: string
}
```

**렌더링:**
```
┌──────────────┬──────────────┐
│   매입가      │   현재 호가   │
│   63.6억     │  85~110억    │
│   (2020-04)  │  (5건 기준)   │
├──────────────┴──────────────┤
│  예상 수익률: +33.6%~+72.9% │
│  ████████████████░░░░  72%  │
└─────────────────────────────┘
```

- 수익률 > 0: 초록 + 상승 아이콘
- 수익률 < 0: 빨강 + 하락 아이콘
- 매입가 없을 시: "매입가 미공개" 표시

---

## 7. AI Analyst Integration

`ai-analyst-engine.ts`에 추가할 패턴:

```typescript
PATTERNS.naverPrice = /(.*)(현재|실시간|지금|호가|시세|네이버|매물)/
```

**`analyzeNaverPrice(query)` 함수:**
1. 쿼리에서 단지명/셀럽명 추출
2. 셀럽명이면 → 해당 셀럽의 매물 목록에서 단지명 추출
3. `/api/naver-land/search` 호출 (서버 사이드이므로 직접 `searchNaverLand()` 호출)
4. 결과 요약: 가격 범위, 매물 수, 셀럽 매입가 대비 수익률

---

## 8. Implementation Order

1. `src/lib/naver-land/types.ts`
2. `src/lib/naver-land/price-parser.ts`
3. `src/lib/naver-land/cli-client.ts`
4. `src/app/api/naver-land/search/route.ts`
5. `src/components/property/price-comparison-card.tsx`
6. `src/components/property/naver-listings.tsx`
7. `src/app/property/[id]/property-detail-client.tsx` (수정)
8. `src/lib/geo/ai-analyst-engine.ts` (수정)

---

*Created: 2026-03-26*
*Phase: Design → Next: Do (Implementation)*
