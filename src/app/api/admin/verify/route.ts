import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json()
    const adminPin = process.env.ADMIN_PIN

    if (!adminPin) {
      return NextResponse.json(
        { success: false, error: 'ADMIN_PIN이 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    if (typeof pin !== 'string' || pin !== adminPin) {
      return NextResponse.json(
        { success: false, error: 'PIN이 올바르지 않습니다.' },
        { status: 401 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, error: '요청 처리에 실패했습니다.' },
      { status: 400 }
    )
  }
}
