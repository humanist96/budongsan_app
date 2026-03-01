import type { MetadataRoute } from 'next'
import { celebrities } from '@/data/celebrity-seed-data'
import { properties } from '@/data/celebrity-seed-data'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://celebhousemap.kr'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/map`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/celebrity`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/rankings`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/submit`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  const celebrityPages: MetadataRoute.Sitemap = celebrities.map((celeb) => ({
    url: `${BASE_URL}/celebrity/${celeb.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const propertyPages: MetadataRoute.Sitemap = properties.map((prop) => ({
    url: `${BASE_URL}/property/${prop.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...celebrityPages, ...propertyPages]
}
