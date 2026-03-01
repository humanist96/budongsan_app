/**
 * 제보 저장소 — localStorage 기반 (Supabase 없이 동작)
 * Supabase 연결 시 API 라우트로 전환 가능
 */

import type { CelebrityCategory } from '@/types/celebrity'

export type PropertyType = 'apartment' | 'building' | 'house' | 'land' | 'other'
export type TransactionType = 'buy' | 'sell' | 'rent'

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartment: '아파트/빌라',
  building: '빌딩/상가',
  house: '단독주택',
  land: '토지',
  other: '기타',
}

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  buy: '매입',
  sell: '매도',
  rent: '임대',
}

export interface SubmissionDetail {
  readonly category: CelebrityCategory
  readonly propertyName: string | null
  readonly propertyType: PropertyType
  readonly transactionType: TransactionType
  readonly transactionDate: string | null
  readonly transactionPrice: number | null
  readonly estimatedCurrentValue: number | null
  readonly additionalNotes: string | null
}

export interface Submission {
  readonly id: string
  readonly celebrityName: string
  readonly propertyAddress: string
  readonly description: string | null
  readonly sourceUrl: string | null
  readonly status: 'pending' | 'approved' | 'rejected'
  readonly createdAt: string
  readonly reviewedAt: string | null
  readonly detail: SubmissionDetail | null
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

export interface AddSubmissionInput {
  celebrityName: string
  propertyAddress: string
  description: string | null
  sourceUrl: string | null
  detail: SubmissionDetail | null
}

export function addSubmission(input: AddSubmissionInput): Submission {
  const submission: Submission = {
    id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    celebrityName: input.celebrityName,
    propertyAddress: input.propertyAddress,
    description: input.description,
    sourceUrl: input.sourceUrl,
    status: 'pending',
    createdAt: new Date().toISOString(),
    reviewedAt: null,
    detail: input.detail,
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
