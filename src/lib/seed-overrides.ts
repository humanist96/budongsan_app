/**
 * localStorage 기반 시드 셀럽 오버라이드
 * - 시드 데이터는 정적 TS 파일이라 런타임 수정 불가
 * - localStorage에 수정/삭제 정보를 저장하여 클라이언트에서 오버라이드
 */

import type { CelebrityCategory } from '@/types/celebrity'

export interface CelebrityOverride {
  readonly name?: string
  readonly description?: string
  readonly category?: CelebrityCategory
  readonly deleted?: boolean
}

export interface SeedOverrides {
  readonly [celebrityId: string]: CelebrityOverride
}

const STORAGE_KEY = 'celeb-house-seed-overrides'

function read(): SeedOverrides {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function write(overrides: SeedOverrides): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
}

export function getOverrides(): SeedOverrides {
  return read()
}

export function editCelebrity(id: string, changes: Omit<CelebrityOverride, 'deleted'>): void {
  const overrides = read()
  const existing = overrides[id] ?? {}
  write({
    ...overrides,
    [id]: { ...existing, ...changes, deleted: existing.deleted },
  })
}

export function deleteCelebrity(id: string): void {
  const overrides = read()
  write({
    ...overrides,
    [id]: { ...overrides[id], deleted: true },
  })
}

export function restoreCelebrity(id: string): void {
  const overrides = read()
  const { [id]: _removed, ...rest } = overrides
  write(rest)
}

/**
 * 시드 셀럽 배열에 오버라이드 적용
 * - deleted 표시된 셀럽은 필터링
 * - name/description/category 변경사항 반영
 */
export function applySeedOverrides<
  T extends { id: string; name: string; description: string | null; category: string },
>(celebrities: readonly T[]): T[] {
  const overrides = read()
  if (Object.keys(overrides).length === 0) return [...celebrities]

  return celebrities
    .filter((c) => !overrides[c.id]?.deleted)
    .map((c) => {
      const override = overrides[c.id]
      if (!override) return c
      return {
        ...c,
        ...(override.name !== undefined && { name: override.name }),
        ...(override.description !== undefined && { description: override.description }),
        ...(override.category !== undefined && { category: override.category }),
      }
    })
}
