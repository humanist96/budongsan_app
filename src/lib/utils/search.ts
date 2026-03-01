import {
  celebrities as seedCelebrities,
  properties as seedProperties,
} from '@/data/celebrity-seed-data'
import { CATEGORY_LABELS } from '@/types'

export interface SearchResult {
  id: string
  type: 'celebrity' | 'property'
  title: string
  subtitle: string
  href: string
}

export function globalSearch(query: string, maxResults = 10): SearchResult[] {
  if (!query || query.length < 1) return []

  const q = query.toLowerCase()
  const celebrityLimit = Math.ceil(maxResults / 2)
  const propertyLimit = Math.floor(maxResults / 2)

  const celebrityResults: SearchResult[] = seedCelebrities
    .filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.subCategory.toLowerCase().includes(q)
    )
    .slice(0, celebrityLimit)
    .map((c) => ({
      id: c.id,
      type: 'celebrity' as const,
      title: c.name,
      subtitle: `${CATEGORY_LABELS[c.category]} · ${c.subCategory}`,
      href: `/celebrity/${c.id}`,
    }))

  const propertyResults: SearchResult[] = seedProperties
    .filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q)
    )
    .slice(0, propertyLimit)
    .map((p) => ({
      id: p.id,
      type: 'property' as const,
      title: p.name,
      subtitle: p.address,
      href: `/property/${p.id}`,
    }))

  return [...celebrityResults, ...propertyResults].slice(0, maxResults)
}
