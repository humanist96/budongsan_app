# PDCA Completion Report: Naver Land Integration

> cli-anything-naver-land CLI 도구를 셀럽하우스맵에 연동하여 실시간 네이버 부동산 시세 제공

---

## 1. Overview

| 항목 | 내용 |
|------|------|
| Feature | naver-land-integration |
| PDCA Phase | Completed |
| Match Rate | 85% → **~92%** (개선 후) |
| Iteration Count | 1 |
| Period | 2026-03-26 ~ 2026-03-27 |

### PDCA Flow

```
[Plan] ✅ → [Design] ✅ → [Do] ✅ → [Check] ✅ → [Act] ✅ → [Report] ✅
```

---

## 2. Plan Summary

### 목적
셀럽 보유 매물의 실시간 네이버 부동산 시세를 연동하여:
1. 셀럽 매입가 vs 현재 호가 비교 → 투자 수익률 시각화
2. 동일 단지 현재 매물 탐색 → "셀럽 옆집에 살 수 있나요?" 컨텐츠
3. AI 분석가에서 시세 분석 자연어 질의 지원

### 외부 도구
- **cli-anything-naver-land** (Python CLI)
- 네이버 부동산 공개 API를 조회, UA 로테이션/안티블로킹 내장
- `--json` 플래그로 구조화된 JSON 출력

---

## 3. Design Decisions

| 결정 | 선택 | 이유 |
|------|------|------|
| 네이버 연동 방식 | CLI 래퍼 (`child_process.execFile`) | 안티블로킹 검증됨, shell injection 방지 |
| 캐싱 전략 | 서버 메모리 Map, 5분 TTL | 네이버 시세 변동 주기 고려, 과도 요청 방지 |
| 동시 실행 제한 | Semaphore 패턴 (최대 3개) | 네이버 rate limit 대응 |
| 가격 파싱 | 정규식 기반 (`억` 단위 + 콤마) | `"36억 6,100"` → `366100` 만원 변환 |
| AI 분석가 연동 | 시드 데이터 기반 추정가 + 상세페이지 안내 | CLI 호출 15~20초 지연으로 채팅 UX 부적합 |

---

## 4. Implementation Summary

### 신규 파일 (6개)

| 파일 | 역할 | 라인 수 |
|------|------|:-------:|
| `src/lib/naver-land/types.ts` | `NaverLandListing`, `NaverSearchParams`, `PriceComparison` 타입 | ~47 |
| `src/lib/naver-land/price-parser.ts` | `parseNaverPrice()`, `parseNaverPriceWithRent()` | ~65 |
| `src/lib/naver-land/cli-client.ts` | CLI 실행 래퍼 + 캐시 + 세마포어 | ~167 |
| `src/app/api/naver-land/search/route.ts` | GET API Route (입력 검증 + 에러 핸들링) | ~40 |
| `src/components/property/price-comparison-card.tsx` | 매입가 vs 현재 호가 비교 카드 | ~95 |
| `src/components/property/naver-listings.tsx` | 네이버 실시간 매물 리스트 + 상태 관리 | ~175 |

### 수정 파일 (2개)

| 파일 | 변경 |
|------|------|
| `src/app/property/[id]/property-detail-client.tsx` | NaverListings 섹션 추가, `extractDistrict()` 헬퍼 |
| `src/lib/geo/ai-analyst-engine.ts` | `naverPrice` 패턴 + `analyzeNaverPrice()` 함수 (추정가/수익률 분석) |

### PDCA 문서 (3개)

| 문서 | 경로 |
|------|------|
| Plan | `docs/01-plan/features/naver-land-integration.plan.md` |
| Design | `docs/02-design/features/naver-land-integration.design.md` |
| Report | `docs/04-report/features/naver-land-integration.report.md` |

---

## 5. Feature Details

### F1: API Route — `GET /api/naver-land/search`

```
Query: ?district=용산구&name=한남더힐&tradeType=매매&limit=20
Response: { listings: NaverLandListing[], meta: { total, fetchedAt, cached, district } }
```

- `execFile` 사용 (shell injection 방지)
- 한글 전용 입력 검증
- limit 1~100 범위 제한
- 에러 시 빈 listings + 에러 메시지 반환

### F2: 매물 상세 페이지 — 실시간 시세 섹션

`/property/[id]` 진입 시 해당 단지의 네이버 매물을 자동 조회:

- **PriceComparisonCard**: 매입가 vs 현재 호가 범위, 수익률 (상승 초록/하락 빨강)
- **NaverListings**: 매물 카드 리스트 (단지명, 면적, 층, 가격, 태그 배지)
- 유사 면적 필터 (±30%)
- 상태 관리: idle → loading(스켈레톤) → loaded/error/empty
- 네이버 부동산 외부 링크

### F3: 가격 파서

| 함수 | 입력 | 출력 |
|------|------|------|
| `parseNaverPrice("36억 6,100")` | 가격 텍스트 | `366100` (만원) |
| `parseNaverPrice("15억")` | 억 단위 | `150000` (만원) |
| `parseNaverPriceWithRent("3억 5,000/150", null)` | 보증금/월세 | `{deposit: 35000, monthly: 150}` |

### F4: AI 분석가 시세 조회

자연어 패턴 매칭으로 시세 분석:

```
"전지현 현재 시세" → 보유 매물 목록 + 총 매입가/추정가/수익률
"한남더힐 시세"    → 단지 정보 + 보유 셀럽 + 시세 범위
```

---

## 6. Gap Analysis Summary

### Initial Check: 85%

| 항목 | 점수 |
|------|:----:|
| Type Definitions | 95% |
| CLI Client | 95% |
| UI Components | 92% |
| API Route | 85% |
| Price Parser | 75% |
| AI Integration | 70% |

### Identified Gaps & Actions

| Gap | 조치 | 결과 |
|-----|------|------|
| `parseNaverPriceWithRent` 미구현 | 보증금/월세 분리 파싱 함수 구현 | Fixed |
| Dead code 3개 함수 | `calculateReturnRate`, `computePriceComparison`, `searchComplexListings` 삭제 | Fixed |
| `tradeType` 타입 약함 | `NaverTradeType` union literal 타입 추가 | Fixed |
| AI 분석가 시세 정보 빈약 | 추정 현재가, 셀럽별 수익률, 단지 시세 범위 추가 | Fixed |

### Post-Iteration: ~92%

| 항목 | 개선 전 → 후 |
|------|:----------:|
| Price Parser | 75% → 92% |
| AI Integration | 70% → 88% |
| **전체** | **85% → ~92%** |

---

## 7. Architecture

```
[브라우저]
  ↓ fetch('/api/naver-land/search?...')
[Next.js API Route]
  ↓ searchNaverLand(params)
[cli-client.ts]
  ├─ 캐시 히트? → 즉시 반환 (<100ms)
  └─ 캐시 미스 → Semaphore 획득
       ↓ execFile('cli-anything-naver-land', args)
     [Python CLI Process]
       ↓ 네이버 부동산 API 조회 (~15s)
     [JSON 결과]
       ↓ parseNaverPrice() 적용
     [캐시 저장 + 반환]
```

---

## 8. Metrics

| 지표 | 값 |
|------|-----|
| 신규 파일 | 6개 |
| 수정 파일 | 2개 |
| 신규 코드 (추정) | ~590줄 |
| PDCA 문서 | 3개 (Plan, Design, Report) |
| 신규 API Route | 1개 (`/api/naver-land/search`) |
| 빌드 상태 | PASS (0 errors) |
| Final Match Rate | ~92% |
| 외부 의존성 | `cli-anything-naver-land` (Python, pip 설치) |

---

## 9. Remaining Items (Future)

| 항목 | 우선순위 | 설명 |
|------|:--------:|------|
| API Rate Limiting | Medium | IP 기반 요청 빈도 제한 |
| PriceComparisonCard 프로그레스 바 | Low | Design 목업의 진행률 바 시각화 |
| Celebrity 프로필 시세 요약 | Low | `/celebrity/[id]` 페이지에 주요 매물 시세 |
| CLI 미설치 ENOENT 처리 | Low | 사용자 친화적 에러 메시지 |
| AI 분석가 직접 API 호출 | Low | 채팅 내 실시간 매물 인라인 표시 (지연 UX 개선 필요) |

---

## 10. Lessons Learned

1. **`Map` import 이름 충돌**: `lucide-react`의 `Map` 아이콘이 JS 내장 `Map`을 shadowing — `MapIcon`으로 rename 필요
2. **CLI 호출 지연 (~15s)**: 채팅 UX에 직접 CLI 호출은 부적합. 캐시 + 상세 페이지 비동기 로드가 적절
3. **Design 문서의 가치**: Design-Implementation 매칭으로 dead code와 누락 기능을 즉시 식별 가능

---

*Generated: 2026-03-27*
*PDCA Cycle: Completed*
