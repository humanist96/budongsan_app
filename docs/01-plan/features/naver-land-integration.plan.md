# Plan: Naver Land Integration

> cli-anything-naver-land CLI 도구를 셀럽하우스맵에 연동하여 실시간 네이버 부동산 시세 데이터를 제공한다.

---

## 1. Background

### 현재 상황
- 셀럽하우스맵의 매물 가격 데이터는 **시드 데이터**(뉴스 보도 기준)에 의존
- `price` 필드는 매입 당시 가격이며, `estimatedCurrentValue`는 수동 추정치
- 실시간 시세와의 괴리가 발생 (특히 가격 변동이 큰 시기)

### cli-anything-naver-land 도구
- 네이버 부동산 공개 API를 조회하는 Python CLI 도구
- `--json` 플래그로 구조화된 JSON 출력 가능
- 구/군 단위 검색, 단지명 검색, 자연어 검색 지원
- 매물 데이터: 단지명, 거래유형, 전용면적, 매물가, 층정보, 태그 등

### 연동 가치
셀럽 보유 매물의 **실시간 네이버 부동산 시세**를 보여줌으로써:
1. 셀럽 매입가 vs 현재 호가 비교 → **투자 수익률 시각화**
2. 동일 단지 현재 매물 탐색 → **"셀럽 옆집에 살 수 있나요?" 컨텐츠**
3. 실거래가 대비 호가 괴리율 분석 → **시장 분석 인사이트**

---

## 2. Goals

### Primary Goals
1. 셀럽 매물 상세 페이지(`/property/[id]`)에 **실시간 네이버 시세** 섹션 추가
2. 셀럽 매입가 vs 현재 호가 **비교 카드** 제공
3. 동일 단지 현재 **매물 리스트** 표시

### Secondary Goals
4. AI 분석가(`/ai-analyst`)에 실시간 시세 조회 패턴 추가
5. 랭킹 페이지에 **실시간 기준 자산 추정** 옵션

### Non-Goals
- 네이버 부동산 전체 검색 엔진 구현 (CLI 도구 범위)
- 실시간 가격 알림/푸시 기능
- 매물 중개 연결 기능

---

## 3. Data Flow Architecture

```
[사용자 요청]
     ↓
[Next.js API Route: /api/naver-land/search]
     ↓
[Node.js child_process.exec()]
     ↓
[cli-anything-naver-land --json search ...]
     ↓
[JSON 결과 파싱]
     ↓
[프론트엔드 컴포넌트에 전달]
```

### CLI 출력 → 프론트엔드 데이터 매핑

| CLI 필드 | 의미 | 셀럽맵 활용 |
|----------|------|------------|
| `atcl_nm` | 단지명 | 시드 `property.name`과 매칭 키 |
| `prc` | 매물가 (텍스트: "36억 6,100") | 파싱 → 만원 단위 숫자 |
| `spc1` | 전용면적(㎡) | 면적별 필터링 |
| `pyeong` | 평수 | UI 표시용 |
| `flr_info` | 층/총층 | UI 표시용 |
| `cfm_ymd` | 확인일 | 최신 매물 여부 판별 |
| `tag_list` | 태그 배열 | 필터 + 배지 표시 |
| `trad_tp_nm` | 거래유형 | 매매/전세/월세 탭 |
| `rent_prc` | 월세/보증금 | 전세/월세 시 표시 |

---

## 4. Feature Breakdown

### F1: API Route — `/api/naver-land/search`

Next.js API Route에서 CLI를 실행하고 JSON 결과를 반환.

```typescript
// 요청: GET /api/naver-land/search?name=한남더힐&district=용산구&tradeType=매매
// 응답: { listings: NaverLandListing[], meta: { total, fetchedAt } }
```

**구현 포인트:**
- `child_process.execFile`로 CLI 실행 (보안: shell injection 방지)
- 결과 캐싱 (동일 단지 5분간 캐시)
- 가격 문자열 파싱 (`"36억 6,100"` → `366100` 만원)
- 에러 핸들링 (CLI 미설치, 네이버 차단, 타임아웃)
- Rate limiting (네이버 과도 요청 방지)

### F2: 매물 상세 페이지 — 실시간 시세 섹션

`/property/[id]` 페이지에 새로운 섹션 추가:

```
┌─────────────────────────────────────┐
│ 📊 네이버 부동산 실시간 시세          │
│                                     │
│ ┌─────────┐  ┌─────────┐           │
│ │ 매입가   │  │ 현재 호가│           │
│ │ 63.6억  │  │ 85~110억│           │
│ │ (2020)  │  │ (금일)   │           │
│ └─────────┘  └─────────┘           │
│                                     │
│ 수익률: +33.6% ~ +72.9%            │
│                                     │
│ ─── 동일 단지 현재 매물 ───          │
│ 한남더힐 206㎡ 14층 110억 매매       │
│ 한남더힐 143㎡ 9층  85억  매매       │
│ 한남더힐 206㎡ 1층  110억 매매 급매  │
│                                     │
│ [네이버 부동산에서 보기 ↗]           │
└─────────────────────────────────────┘
```

**구현 포인트:**
- 시드 데이터의 `property.name`으로 CLI `--name-contains` 검색
- 시드 데이터의 주소에서 구 추출하여 `-d` 파라미터 전달
- 매입가 대비 현재 호가 범위 계산 + 수익률 표시
- 매물 리스트: 면적, 층, 가격, 거래유형, 태그 배지
- 네이버 부동산 외부 링크 제공
- 로딩/에러/빈결과 상태 처리

### F3: 시세 비교 카드 컴포넌트

재사용 가능한 매입가 vs 현재가 비교 카드:

- 셀럽 프로필 페이지 (`/celebrity/[id]`)에서도 사용
- 수익률 색상 코딩 (상승: 초록, 하락: 빨강)
- 유사 면적 매물만 비교 (±20% 전용면적)

### F4: AI 분석가 시세 조회 패턴

`/ai-analyst`에 새로운 분석 패턴 추가:

```
사용자: "한남더힐 현재 시세"
AI: 한남더힐 네이버 부동산 실시간 시세
    - 매매 5건: 85억 ~ 110억 (143~206㎡)
    - BTS 진 매입가 대비: +42% 상승
```

**패턴:**
- `/(.*)\s*(현재|실시간|지금|호가|시세|네이버)/` → 실시간 시세 조회
- CLI 실행 → 결과 요약 → 채팅 응답

### F5: 가격 파서 유틸리티

네이버 부동산 가격 문자열을 만원 단위 숫자로 변환:

```typescript
parseNaverPrice("36억 6,100") → 366100    // 만원
parseNaverPrice("15억")       → 150000    // 만원
parseNaverPrice("9,500")      → 9500      // 만원
parseNaverPrice("3억 5,000/150") → { deposit: 35000, monthly: 150 }
```

---

## 5. Technical Decisions

### Q1: 왜 직접 네이버 API가 아닌 CLI 래퍼인가?

| 방식 | 장점 | 단점 |
|------|------|------|
| CLI 래퍼 | UA 로테이션/세션관리 내장, 검증된 안티블로킹 | 프로세스 오버헤드, Python 의존 |
| 직접 HTTP | 빠름, 의존성 없음 | 네이버 차단 위험, UA/쿠키 관리 필요 |

**결정: CLI 래퍼** — 안티블로킹 로직이 이미 검증되어 있고, `--json` 출력이 깔끔하다.

### Q2: 캐싱 전략

- **서버 메모리 캐시** (Map): 동일 단지+거래유형 5분 TTL
- 이유: 네이버 시세는 분 단위로 변하지 않음, 과도 요청 방지
- 향후: Redis 등 외부 캐시로 전환 가능

### Q3: CLI 프로세스 관리

- `execFile` 사용 (shell 미경유 → injection 방지)
- 타임아웃: 15초 (CLI 기본 소요 ~15초)
- 동시 실행 제한: 최대 3개 (네이버 rate limit 고려)

---

## 6. Implementation Phases

### Phase 1: 인프라 (가격 파서 + API Route)
- [ ] `src/lib/naver-land/price-parser.ts` — 가격 문자열 파서
- [ ] `src/lib/naver-land/cli-client.ts` — CLI 실행 래퍼 + 캐시
- [ ] `src/lib/naver-land/types.ts` — 네이버 매물 타입 정의
- [ ] `src/app/api/naver-land/search/route.ts` — API Route

### Phase 2: 매물 상세 페이지 연동
- [ ] `src/components/property/naver-listings.tsx` — 실시간 매물 리스트
- [ ] `src/components/property/price-comparison-card.tsx` — 매입가 vs 호가 비교
- [ ] `property-detail-client.tsx` 수정 — 새 섹션 추가

### Phase 3: AI 분석가 연동
- [ ] `ai-analyst-engine.ts` 수정 — 시세 조회 패턴 추가
- [ ] `ai-analyst-page.tsx` 수정 — 매물 리스트 렌더링 추가

### Phase 4: 셀럽 프로필 연동
- [ ] `/celebrity/[id]` 페이지에 주요 매물 현재 시세 요약

---

## 7. Risk Assessment

| 리스크 | 확률 | 영향 | 대응 |
|--------|:----:|:----:|------|
| 네이버 API 차단/변경 | 중 | 높 | CLI 도구 업데이트 의존, graceful fallback |
| CLI 미설치 환경 | 낮 | 중 | API Route에서 에러 → "시세 조회 불가" UI |
| 느린 응답 (~15초) | 높 | 중 | 로딩 스켈레톤, 캐시 적극 활용, 비동기 로드 |
| 단지명 매칭 실패 | 중 | 중 | fuzzy matching, 주소 기반 fallback 검색 |

---

## 8. Success Criteria

- [ ] 시드 데이터 202개 매물 중 80% 이상 네이버 시세 매칭 가능
- [ ] API 응답 시간: 캐시 히트 시 <100ms, 미스 시 <20초
- [ ] 매물 상세 페이지에서 실시간 시세 + 수익률 표시
- [ ] AI 분석가에서 "한남더힐 시세" 등 자연어 질문 처리
- [ ] 빌드 에러 없음, 기존 기능 회귀 없음

---

*Created: 2026-03-26*
*Phase: Plan → Next: `/pdca design naver-land-integration`*
