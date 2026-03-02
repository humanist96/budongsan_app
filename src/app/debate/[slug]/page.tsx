import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { debateEntries, getDebateData } from '@/data/debate-index'
import { DebatePageClient } from './client'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return debateEntries.map((entry) => ({ slug: entry.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const entry = debateEntries.find((e) => e.slug === slug)
  if (!entry) return {}

  return {
    title: `${entry.shortTitle} | 부동산 토론`,
    description: entry.description,
  }
}

export default async function DebateSlugRoute({ params }: PageProps) {
  const { slug } = await params
  const data = await getDebateData(slug)

  if (!data) {
    notFound()
  }

  return <DebatePageClient data={data} slug={slug} />
}
