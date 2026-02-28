/**
 * 네이버 부동산 단지번호(complexNo) 매핑
 *
 * 매물명 키워드 → 네이버 부동산 단지 페이지 직접 연결용
 * URL: https://new.land.naver.com/complexes/{complexNo}
 */

const NAVER_COMPLEX_MAP: Record<string, string> = {
  '한남더힐': '102737',
  '나인원한남': '130505',
  'PH129': '135644',
  '더펜트하우스 청담': '135644',
  '아크로리버파크': '107613',
  '타워팰리스': '3038',
  '트리마제': '108405',
  '한남리버힐': '130609',
  '한남 리버힐': '130609',
  '갤러리아포레': '27620',
  '잠실엘스': '22627',
  '래미안대치팰리스': '180280',
  '반포자이': '22853',
  '래미안퍼스티지': '23759',
  '래미안원베일리': '142155',
  '아크로비스타': '3104',
  '압구정 현대아파트': '724',
  '에테르노 청담': '128591',
  '잠실리센츠': '22746',
  '헬리오시티': '111515',
  '아이파크삼성': '12826',
  '현대아이파크': '12826',
  '도곡렉슬': '11698',
  '청담자이': '1081',
  '경희궁자이': '109379',
  '아페르한강': '149741',
  '메세나폴리스': '103831',
  '올림픽파크포레온': '155817',
  '래미안리더스원': '124311',
  '래미안라클래시': '127477',
  '마포래미안푸르지오': '104917',
  '브라이튼N40': '151286',
  '아크로서울포레스트': '113012',
  '서울숲 푸르지오': '22067',
  '잠실 아시아선수촌': '22644',
  '압구정 한양아파트': '12974',
  '래미안 위브': '104618',
  '마포프레스티지자이': '115025',
  '시그니처롯데': '126488',
  '래미안 첼리투스': '107764',
}

export function findNaverComplexNo(propertyName: string): string | null {
  const cleaned = propertyName.replace(/\s*\(.*?\)\s*/g, '').trim()
  for (const [key, value] of Object.entries(NAVER_COMPLEX_MAP)) {
    if (cleaned.includes(key) || propertyName.includes(key)) return value
  }
  return null
}

export function getNaverComplexUrl(propertyName: string): string | null {
  const complexNo = findNaverComplexNo(propertyName)
  return complexNo ? `https://new.land.naver.com/complexes/${complexNo}` : null
}

export function getNaverSearchUrl(query: string): string {
  const cleaned = query.replace(/\s*\(.*?\)\s*/g, '').trim()
  return `https://new.land.naver.com/search?query=${encodeURIComponent(cleaned)}`
}
