export function formatPrice(priceInManWon: number): string {
  if (priceInManWon >= 10000) {
    const eok = Math.floor(priceInManWon / 10000)
    const remainder = priceInManWon % 10000
    if (remainder === 0) {
      return `${eok}억`
    }
    return `${eok}억 ${remainder.toLocaleString()}만`
  }
  return `${priceInManWon.toLocaleString()}만`
}

export function formatPriceWon(priceInWon: number): string {
  return formatPrice(Math.round(priceInWon / 10000))
}

export function formatArea(exclusiveAreaM2: number): string {
  return `${exclusiveAreaM2.toFixed(1)}㎡`
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatNumber(num: number): string {
  return num.toLocaleString('ko-KR')
}
