/**
 * 제보 저장소 — localStorage 기반 (Supabase 없이 동작)
 * Supabase 연결 시 API 라우트로 전환 가능
 */

export interface Submission {
  readonly id: string
  readonly celebrityName: string
  readonly propertyAddress: string
  readonly description: string | null
  readonly sourceUrl: string | null
  readonly status: 'pending' | 'approved' | 'rejected'
  readonly createdAt: string
  readonly reviewedAt: string | null
}

const STORAGE_KEY = 'celeb-house-submissions'

function readAll(): Submission[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeAll(submissions: Submission[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions))
}

export function addSubmission(input: {
  celebrityName: string
  propertyAddress: string
  description: string | null
  sourceUrl: string | null
}): Submission {
  const submission: Submission = {
    id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    celebrityName: input.celebrityName,
    propertyAddress: input.propertyAddress,
    description: input.description,
    sourceUrl: input.sourceUrl,
    status: 'pending',
    createdAt: new Date().toISOString(),
    reviewedAt: null,
  }
  const all = readAll()
  writeAll([submission, ...all])
  return submission
}

export function getSubmissions(filter?: 'pending' | 'approved' | 'rejected'): Submission[] {
  const all = readAll()
  if (!filter) return all
  return all.filter((s) => s.status === filter)
}

export function updateSubmissionStatus(
  id: string,
  status: 'approved' | 'rejected'
): Submission | null {
  const all = readAll()
  const index = all.findIndex((s) => s.id === id)
  if (index === -1) return null
  const updated: Submission = {
    ...all[index],
    status,
    reviewedAt: new Date().toISOString(),
  }
  writeAll([...all.slice(0, index), updated, ...all.slice(index + 1)])
  return updated
}

export function deleteSubmission(id: string): boolean {
  const all = readAll()
  const filtered = all.filter((s) => s.id !== id)
  if (filtered.length === all.length) return false
  writeAll(filtered)
  return true
}
