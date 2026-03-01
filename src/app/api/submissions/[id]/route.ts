import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const EDITABLE_FIELDS = ['status', 'celebrity_name', 'property_address', 'description', 'source_url'] as const

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Build update payload from allowed fields only
    const updates: Record<string, unknown> = {}
    for (const field of EDITABLE_FIELDS) {
      if (field in body) {
        updates[field] = body[field]
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: '수정할 필드가 없습니다.' },
        { status: 400 }
      )
    }

    // Validate status if provided
    if (updates.status && !['approved', 'rejected', 'pending'].includes(updates.status as string)) {
      return NextResponse.json(
        { success: false, error: '유효한 상태값이 필요합니다. (approved | rejected | pending)' },
        { status: 400 }
      )
    }

    if (updates.status) {
      updates.reviewed_at = new Date().toISOString()
    }

    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('user_submissions')
      .update(updates)
      .eq('id', id)
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

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const supabase = await createServerSupabaseClient()
    const { error } = await supabase
      .from('user_submissions')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
