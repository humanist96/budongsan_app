import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient()

  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get('search')
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '20', 10)
  const offset = (page - 1) * limit

  let query = supabase
    .from('properties')
    .select('*', { count: 'exact' })

  if (search) {
    query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%`)
  }

  const { data, error, count } = await query
    .order('like_count', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    data,
    meta: {
      total: count || 0,
      page,
      limit,
    },
  })
}
