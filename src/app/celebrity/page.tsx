'use client'

import { useEffect, useState, useCallback } from 'react'
import { Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CelebrityCard } from '@/components/celebrity/celebrity-card'
import { createClient } from '@/lib/supabase/client'
import type { Celebrity, CelebrityCategory } from '@/types'
import { CATEGORY_LABELS } from '@/types'
import { celebrities as seedCelebrities, celebrityProperties as seedCPs } from '@/data/celebrity-seed-data'

const categories: CelebrityCategory[] = ['entertainer', 'politician', 'athlete']

export default function CelebrityListPage() {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CelebrityCategory | null>(null)
  const [multiOwnerOnly, setMultiOwnerOnly] = useState(false)

  const fetchCelebrities = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      let query = supabase.from('celebrities').select('*')

      if (selectedCategory) {
        query = query.eq('category', selectedCategory)
      }
      if (multiOwnerOnly) {
        query = query.gte('property_count', 2)
      }
      if (search) {
        query = query.ilike('name', `%${search}%`)
      }

      const { data, error } = await query
        .order('property_count', { ascending: false })
        .limit(50)

      if (error) throw error
      setCelebrities((data || []) as Celebrity[])
    } catch {
      setCelebrities(getDemoCelebrities(selectedCategory, multiOwnerOnly, search))
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, multiOwnerOnly, search])

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
            <CelebrityCard key={celeb.id} celebrity={celeb} />
          ))}
        </div>
      )}
    </div>
  )
}

function getDemoCelebrities(
  category: CelebrityCategory | null,
  multiOwnerOnly: boolean,
  search: string
): Celebrity[] {
  const countMap = new Map<string, number>()
  const totalMap = new Map<string, number>()

  for (const cp of seedCPs) {
    countMap.set(cp.celebrityId, (countMap.get(cp.celebrityId) ?? 0) + 1)
    totalMap.set(cp.celebrityId, (totalMap.get(cp.celebrityId) ?? 0) + (cp.price ?? 0))
  }

  const searchLower = search.toLowerCase()

  return seedCelebrities
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
    .sort((a, b) => b.property_count - a.property_count)
}
