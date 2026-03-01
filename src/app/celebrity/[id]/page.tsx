import type { Metadata } from 'next'
import { CelebrityDetailClient } from './celebrity-detail-client'
import { celebrities as seedCelebrities, celebrityProperties as seedCPs } from '@/data/celebrity-seed-data'
import { CATEGORY_LABELS } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function CelebrityDetailPage({ params }: Props) {
  const { id } = await params

  return <CelebrityDetailClient id={id} />
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const celeb = seedCelebrities.find((c) => c.id === id)

  if (!celeb) {
    return {
      title: '셀럽을 찾을 수 없습니다 - 셀럽하우스맵',
      description: '요청한 셀럽 정보를 찾을 수 없습니다.',
    }
  }

  const propertyCount = seedCPs.filter((cp) => cp.celebrityId === id).length
  const categoryLabel = CATEGORY_LABELS[celeb.category]
  const title = `${celeb.name} 부동산 포트폴리오 - 셀럽하우스맵`
  const description = `${celeb.name}(${categoryLabel}) - ${celeb.description}. 보유 부동산 ${propertyCount}건`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      ...(celeb.profileImageUrl ? { images: [{ url: celeb.profileImageUrl }] } : {}),
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}
