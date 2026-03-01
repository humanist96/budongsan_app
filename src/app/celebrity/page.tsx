'use client'

import { useEffect, useState, useCallback } from 'react'
import { Search, Filter, ArrowUpDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CelebrityCard } from '@/components/celebrity/celebrity-card'
import { createClient } from '@/lib/supabase/client'
import type { Celebrity, CelebrityCategory } from '@/types'
import { CATEGORY_LABELS } from '@/types'
import { celebrities as seedCelebrities, celebrityProperties as seedCPs } from '@/data/celebrity-seed-data'
import { applySeedOverrides } from '@/lib/seed-overrides'

const categories: CelebrityCategory[] = ['entertainer', 'politician', 'athlete', 'expert']

type SortOption = 'property_count' | 'total_asset_value' | 'name'

const SORT_LABELS: Record<SortOption, string> = {
  property_count: '보유 건수순',
  total_asset_value: '자산가치순',
  name: '이름순',
}

// Compute disposal counts from seed data
const disposalCountMap = new Map<string, number>()
for (const cp of seedCPs) {
  if (cp.disposalDate) {
    disposalCountMap.set(cp.celebrityId, (disposalCountMap.get(cp.celebrityId) ?? 0) + 1)
  }
}

interface ApprovedSubmission {
  id: string
  celebrity_name: string
  property_address: string
  description: string | null
  status: string
}

interface SubmissionDetail {
  category?: CelebrityCategory
  propertyName?: string
  transactionPrice?: number
  estimatedCurrentValue?: number
  additionalNotes?: string
}

function parseSubmissionDetail(description: string | null): SubmissionDetail | null {
  if (!description) return null
  try {
    const parsed = JSON.parse(description)
    if (parsed && typeof parsed === 'object' && parsed.detail) {
      return parsed.detail as SubmissionDetail
    }
  } catch {
    // plain text
  }
  return null
}

function approvedToCelebrity(sub: ApprovedSubmission): Celebrity {
  const detail = parseSubmissionDetail(sub.description)
  const price = detail?.transactionPrice ?? detail?.estimatedCurrentValue ?? 0
  return {
    id: `sub-${sub.id}`,
    name: sub.celebrity_name,
    category: detail?.category ?? 'entertainer',
    sub_category: '',
    profile_image_url: null,
    description: detail?.additionalNotes
      ? `${sub.property_address} · ${detail.additionalNotes}`
      : sub.property_address,
    property_count: 1,
    total_asset_value: price * 10000, // 억원 → 만원 단위
    is_verified: false,
    created_at: '',
    updated_at: '',
  }
}

async function fetchApprovedSubmissions(): Promise<Celebrity[]> {
  try {
    const res = await fetch('/api/submissions?status=approved')
    const result = await res.json()
    if (result.success && result.data) {
      return (result.data as ApprovedSubmission[]).map(approvedToCelebrity)
    }
  } catch {
    // API unavailable
  }
  return []
}

export default function CelebrityListPage() {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CelebrityCategory | null>(null)
  const [multiOwnerOnly, setMultiOwnerOnly] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('property_count')

  const fetchCelebrities = useCallback(async () => {
    setLoading(true)
    try {
      // 1. 시드 데이터 (항상 사용)
      const seedData = getDemoCelebrities(selectedCategory, multiOwnerOnly, search, sortBy)

      // 2. Supabase celebrities 테이블 시도
      let dbData: Celebrity[] = []
      try {
        const supabase = createClient()
        let query = supabase.from('celebrities').select('*')
        if (selectedCategory) query = query.eq('category', selectedCategory)
        if (multiOwnerOnly) query = query.gte('property_count', 2)
        if (search) query = query.ilike('name', `%${search}%`)
        const orderCol = sortBy === 'name' ? 'name' : sortBy
        const ascending = sortBy === 'name'
        const { data, error } = await query.order(orderCol, { ascending }).limit(50)
        if (!error && data && data.length > 0) {
          dbData = data as Celebrity[]
        }
      } catch {
        // Supabase unavailable
      }

      // 3. 승인된 제보 가져오기
      const approvedCelebs = await fetchApprovedSubmissions()

      // 4. 병합: DB > 시드 + 승인된 제보 (이름 중복 제거)
      const base = dbData.length > 0 ? dbData : seedData
      const existingNames = new Set(base.map((c) => c.name))

      const filtered = approvedCelebs.filter((c) => {
        if (existingNames.has(c.name)) return false
        if (selectedCategory && c.category !== selectedCategory) return false
        if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
        if (multiOwnerOnly && c.property_count < 2) return false
        return true
      })

      const merged = [...base, ...filtered]

      // 정렬
      merged.sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name, 'ko')
        if (sortBy === 'total_asset_value') return b.total_asset_value - a.total_asset_value
        return b.property_count - a.property_count
      })

      setCelebrities(merged)
    } catch {
      setCelebrities(getDemoCelebrities(selectedCategory, multiOwnerOnly, search, sortBy))
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, multiOwnerOnly, search, sortBy])

  useEffect(() => {
    fetchCelebrities()
  }, [fetchCelebrities])

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">셀럽 목록</h1>

      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="셀럽 이름 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}>
              <Badge
                variant={selectedCategory === cat ? cat : 'outline'}
                className="cursor-pointer"
              >
                {CATEGORY_LABELS[cat]}
              </Badge>
            </button>
          ))}
          <Button
            variant={multiOwnerOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMultiOwnerOnly(!multiOwnerOnly)}
            className="text-xs h-6"
          >
            다주택자만
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          {(['property_count', 'total_asset_value', 'name'] as const).map((opt) => (
            <Button
              key={opt}
              variant={sortBy === opt ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy(opt)}
              className="text-xs h-6"
            >
              {SORT_LABELS[opt]}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : celebrities.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>검색 결과가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {celebrities.map((celeb) => (
            <CelebrityCard
              key={celeb.id}
              celebrity={celeb}
              disposalCount={disposalCountMap.get(celeb.id) ?? 0}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function getDemoCelebrities(
  category: CelebrityCategory | null,
  multiOwnerOnly: boolean,
  search: string,
  sortBy: SortOption = 'property_count'
): Celebrity[] {
  const countMap = new Map<string, number>()
  const totalMap = new Map<string, number>()

  for (const cp of seedCPs) {
    countMap.set(cp.celebrityId, (countMap.get(cp.celebrityId) ?? 0) + 1)
    totalMap.set(cp.celebrityId, (totalMap.get(cp.celebrityId) ?? 0) + (cp.price ?? 0))
  }

  const searchLower = search.toLowerCase()

  const mapped = seedCelebrities
    .filter((c) => {
      if (category && c.category !== category) return false
      if (search && !c.name.toLowerCase().includes(searchLower)) return false
      if (multiOwnerOnly && (countMap.get(c.id) ?? 0) < 2) return false
      return true
    })
    .map((c) => ({
      id: c.id,
      name: c.name,
      category: c.category,
      sub_category: c.subCategory,
      profile_image_url: c.profileImageUrl ?? null,
      description: c.description,
      property_count: countMap.get(c.id) ?? 0,
      total_asset_value: totalMap.get(c.id) ?? 0,
      is_verified: c.isVerified,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    }))

  return applySeedOverrides(mapped)
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name, 'ko')
      if (sortBy === 'total_asset_value') return b.total_asset_value - a.total_asset_value
      return b.property_count - a.property_count
    })
}
