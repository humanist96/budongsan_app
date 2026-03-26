import { NextRequest, NextResponse } from 'next/server'
import { searchNaverLand } from '@/lib/naver-land/cli-client'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const district = searchParams.get('district')
  const name = searchParams.get('name')
  const tradeType = searchParams.get('tradeType') ?? '매매'
  const limitStr = searchParams.get('limit')
  const limit = limitStr ? Math.min(Math.max(parseInt(limitStr, 10) || 20, 1), 100) : 20

  if (!district) {
    return NextResponse.json(
      { error: 'district 파라미터가 필요합니다 (예: 용산구)' },
      { status: 400 },
    )
  }

  // 한글만 허용
  if (!/^[가-힣\s]+$/.test(district)) {
    return NextResponse.json(
      { error: 'district는 한글만 입력 가능합니다' },
      { status: 400 },
    )
  }

  try {
    const result = await searchNaverLand({
      district,
      tradeType,
      nameContains: name ?? undefined,
      limit,
    })

    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : '시세 조회에 실패했습니다'
    return NextResponse.json(
      { error: message, listings: [], meta: { total: 0, fetchedAt: new Date().toISOString(), cached: false, district } },
      { status: 500 },
    )
  }
}
