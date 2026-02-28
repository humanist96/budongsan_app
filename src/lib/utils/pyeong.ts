const M2_TO_PYEONG = 3.305785

export function m2ToPyeong(m2: number): number {
  return Math.round((m2 / M2_TO_PYEONG) * 10) / 10
}

export function pyeongToM2(pyeong: number): number {
  return Math.round(pyeong * M2_TO_PYEONG * 10) / 10
}

export function formatPyeong(m2: number): string {
  return `${m2ToPyeong(m2)}평`
}

export function pricePerPyeong(priceManWon: number, m2: number): number {
  if (m2 === 0) return 0
  return Math.round(priceManWon / m2ToPyeong(m2))
}
