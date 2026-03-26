/**
 * 네이버 부동산 가격 문자열을 만원 단위 숫자로 변환
 *
 * parseNaverPrice("36억 6,100") → 366100
 * parseNaverPrice("15억")       → 150000
 * parseNaverPrice("9,500")      → 9500
 * parseNaverPrice("")           → 0
 */
export function parseNaverPrice(text: string | null | undefined): number {
  if (!text) return 0

  const cleaned = text.trim()
  if (!cleaned) return 0

  // "억" 단위 처리
  const eokMatch = cleaned.match(/(\d+)억\s*([\d,]*)/)
  if (eokMatch) {
    const eok = parseInt(eokMatch[1], 10) * 10000
    const remainder = eokMatch[2]
      ? parseInt(eokMatch[2].replace(/,/g, ''), 10) || 0
      : 0
    return eok + remainder
  }

  // 콤마 포함 숫자
  const numMatch = cleaned.match(/[\d,]+/)
  if (numMatch) {
    return parseInt(numMatch[0].replace(/,/g, ''), 10) || 0
  }

  return 0
}

/**
 * 보증금/월세가 포함된 가격 문자열을 파싱
 *
 * parseNaverPriceWithRent("3억 5,000/150") → { deposit: 35000, monthly: 150 }
 * parseNaverPriceWithRent("15억", null)     → { deposit: 150000, monthly: null }
 */
export function parseNaverPriceWithRent(
  priceText: string | null | undefined,
  rentText: string | null | undefined,
): { deposit: number; monthly: number | null } {
  const price = parseNaverPrice(priceText)

  // "보증금/월세" 형태 처리 (예: "3억 5,000/150")
  if (priceText) {
    const slashMatch = priceText.match(/(.+)\/(\d[\d,]*)/)
    if (slashMatch) {
      return {
        deposit: parseNaverPrice(slashMatch[1]),
        monthly: parseInt(slashMatch[2].replace(/,/g, ''), 10) || 0,
      }
    }
  }

  // 별도 rent_prc 필드가 있는 경우
  if (rentText) {
    return {
      deposit: price,
      monthly: parseNaverPrice(rentText),
    }
  }

  return { deposit: price, monthly: null }
}
