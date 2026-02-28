import { notFound } from 'next/navigation'
import { CelebrityDetailClient } from './celebrity-detail-client'

interface Props {
  params: Promise<{ id: string }>
}

export default async function CelebrityDetailPage({ params }: Props) {
  const { id } = await params

  return <CelebrityDetailClient id={id} />
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  return {
    title: `셀럽 상세 - 셀럽하우스맵`,
    description: `셀럽의 부동산 정보를 확인하세요`,
  }
}
