import type { Metadata } from 'next'
import { PropertyDetailClient } from './property-detail-client'
import { properties as seedProperties, celebrityProperties as seedCPs, celebrities as seedCelebrities } from '@/data/celebrity-seed-data'
import { PROPERTY_TYPE_LABELS } from '@/types'
import { formatPrice } from '@/lib/utils'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params

  return <PropertyDetailClient id={id} />
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const prop = seedProperties.find((p) => p.id === id)

  if (!prop) {
    return {
      title: '매물을 찾을 수 없습니다 - 셀럽하우스맵',
      description: '요청한 매물 정보를 찾을 수 없습니다.',
    }
  }

  const links = seedCPs.filter((cp) => cp.propertyId === id)
  const celebNames = links
    .map((cp) => seedCelebrities.find((c) => c.id === cp.celebrityId)?.name)
    .filter(Boolean)
    .join(', ')

  const typeLabel = PROPERTY_TYPE_LABELS[prop.propertyType]
  const priceStr = links[0]?.price ? ` ${formatPrice(links[0].price)}원` : ''
  const title = `${prop.name} - ${celebNames || typeLabel} - 셀럽하우스맵`
  const description = `${prop.address} | ${typeLabel}${priceStr}. ${celebNames ? `${celebNames} 보유` : '셀럽 보유 부동산'}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}
