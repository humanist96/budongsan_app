import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { celebrityName, propertyAddress, description, sourceUrl } = body

    if (!celebrityName || !propertyAddress) {
      return NextResponse.json(
        { success: false, error: '셀럽 이름과 매물 주소는 필수입니다.' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('user_submissions')
      .insert({
        celebrity_name: celebrityName,
        property_address: propertyAddress,
        description: description || null,
        source_url: sourceUrl || null,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')

    const supabase = await createServerSupabaseClient()
    let query = supabase
      .from('user_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status as 'pending' | 'approved' | 'rejected')
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
