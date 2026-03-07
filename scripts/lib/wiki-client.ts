/**
 * Wikipedia / Wikidata / 나무위키 API 클라이언트
 *
 * - 한국어 위키백과 REST API (인증 불필요)
 * - Wikidata API (인증 불필요)
 * - 나무위키 URL 존재 여부 확인 (HEAD request)
 */

const USER_AGENT = 'CelebHouseMap/1.0 (https://github.com/celeb-house-map; contact@example.com)'

export interface WikiSummary {
  title: string
  extract: string
  thumbnailUrl: string | null
  wikidataId: string | null
  pageUrl: string
}

export interface WikidataProfile {
  birthYear: number | null
  occupation: string | null
  instagram: string | null
  twitter: string | null
  officialWebsite: string | null
}

export interface ProfileEnrichment {
  wikipediaUrl: string | null
  namuwikiUrl: string | null
  wikidataId: string | null
  birthYear: number | null
  thumbnailUrl: string | null
  socialLinks: Record<string, string>
}

const RATE_LIMITS = {
  wikipedia: 500,
  wikidata: 300,
  namuwiki: 200,
} as const

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

/**
 * 한국어 위키백과 REST API에서 요약 정보 가져오기
 */
export async function fetchWikiSummary(name: string): Promise<WikiSummary | null> {
  const encodedName = encodeURIComponent(name)
  const url = `https://ko.wikipedia.org/api/rest_v1/page/summary/${encodedName}`

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    return {
      title: data.title ?? name,
      extract: data.extract ?? '',
      thumbnailUrl: data.thumbnail?.source ?? null,
      wikidataId: data.wikibase_item ?? null,
      pageUrl: data.content_urls?.desktop?.page ?? `https://ko.wikipedia.org/wiki/${encodedName}`,
    }
  } catch {
    return null
  }
}

/**
 * Wikidata에서 프로필 정보 추출
 * P569: 생년월일, P106: 직업, P2003: 인스타그램, P2002: 트위터, P856: 공식 웹사이트
 */
export async function fetchWikidataProfile(wikidataId: string): Promise<WikidataProfile | null> {
  const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${wikidataId}&format=json&props=claims`

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    const entity = data.entities?.[wikidataId]
    if (!entity) return null

    const claims = entity.claims ?? {}

    // P569: 생년월일
    const birthClaim = claims.P569?.[0]?.mainsnak?.datavalue?.value
    const birthYear = birthClaim?.time
      ? parseInt(birthClaim.time.substring(1, 5), 10) || null
      : null

    // P106: 직업 (첫 번째 값의 label은 별도 요청 필요 → ID만 추출)
    const occupationId = claims.P106?.[0]?.mainsnak?.datavalue?.value?.id ?? null

    // P2003: 인스타그램 사용자명
    const instagram = claims.P2003?.[0]?.mainsnak?.datavalue?.value ?? null

    // P2002: 트위터 사용자명
    const twitter = claims.P2002?.[0]?.mainsnak?.datavalue?.value ?? null

    // P856: 공식 웹사이트
    const officialWebsite = claims.P856?.[0]?.mainsnak?.datavalue?.value ?? null

    return {
      birthYear,
      occupation: occupationId,
      instagram,
      twitter,
      officialWebsite,
    }
  } catch {
    return null
  }
}

/**
 * 나무위키 URL 존재 여부 확인 (HEAD request)
 * 내용 스크래핑 안 함 (API 비공개)
 */
export async function checkNamuwikiExists(name: string): Promise<boolean> {
  const encodedName = encodeURIComponent(name)
  const url = `https://namu.wiki/w/${encodedName}`

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: { 'User-Agent': USER_AGENT },
      redirect: 'follow',
    })

    // 200 = 문서 존재, 404 = 없음
    return response.ok
  } catch {
    return false
  }
}

/**
 * 셀럽 이름의 다양한 변형을 생성
 * - GD → 권지용, GD (가수)
 * - BTS 진(김석진) → 김석진, 진 (가수)
 */
export function generateNameVariants(name: string): string[] {
  const variants = [name]

  // 괄호 안 이름 추출: "BTS 진(김석진)" → "김석진"
  const parenMatch = name.match(/\(([^)]+)\)/)
  if (parenMatch) {
    variants.push(parenMatch[1])
    const withoutParen = name.replace(/\([^)]*\)/, '').trim()
    if (withoutParen && withoutParen !== name) {
      variants.push(withoutParen)
    }
  }

  // 접미사 변형: "GD" → "GD (가수)"
  const DISAMBIGUATION_SUFFIXES = ['(가수)', '(배우)', '(MC)', '(방송인)', '(운동선수)', '(정치인)', '(래퍼)']
  if (name.length <= 4 && !name.includes('(')) {
    for (const suffix of DISAMBIGUATION_SUFFIXES) {
      variants.push(`${name} ${suffix}`)
    }
  }

  // 알려진 예명 매핑
  const KNOWN_ALIASES: Record<string, string[]> = {
    'GD': ['권지용', 'G-Dragon'],
    '지드래곤': ['권지용', 'G-Dragon'],
    '비': ['정지훈'],
    '보아': ['권보아'],
    'RM': ['김남준'],
    '뷔': ['김태형'],
    '진': ['김석진'],
    '슈가': ['민윤기'],
    '제이홉': ['정호석'],
    '지민': ['박지민'],
    '정국': ['전정국'],
  }

  const aliases = KNOWN_ALIASES[name]
  if (aliases) {
    variants.push(...aliases)
  }

  return [...new Set(variants)]
}

/**
 * 전체 프로필 enrichment (Wikipedia + Wikidata + 나무위키)
 */
export async function enrichProfile(name: string): Promise<ProfileEnrichment> {
  const result: ProfileEnrichment = {
    wikipediaUrl: null,
    namuwikiUrl: null,
    wikidataId: null,
    birthYear: null,
    thumbnailUrl: null,
    socialLinks: {},
  }

  const variants = generateNameVariants(name)

  // 1. Wikipedia 검색 (변형 이름 순회)
  let wikiSummary: WikiSummary | null = null
  for (const variant of variants) {
    wikiSummary = await fetchWikiSummary(variant)
    await delay(RATE_LIMITS.wikipedia)
    if (wikiSummary) break
  }

  if (wikiSummary) {
    result.wikipediaUrl = wikiSummary.pageUrl
    result.wikidataId = wikiSummary.wikidataId
    result.thumbnailUrl = wikiSummary.thumbnailUrl
  }

  // 2. Wikidata 프로필
  if (result.wikidataId) {
    const profile = await fetchWikidataProfile(result.wikidataId)
    await delay(RATE_LIMITS.wikidata)

    if (profile) {
      result.birthYear = profile.birthYear
      if (profile.instagram) result.socialLinks.instagram = profile.instagram
      if (profile.twitter) result.socialLinks.twitter = profile.twitter
      if (profile.officialWebsite) result.socialLinks.website = profile.officialWebsite
    }
  }

  // 3. 나무위키 확인
  const namuwikiExists = await checkNamuwikiExists(name)
  await delay(RATE_LIMITS.namuwiki)
  if (namuwikiExists) {
    result.namuwikiUrl = `https://namu.wiki/w/${encodeURIComponent(name)}`
  }

  return result
}
