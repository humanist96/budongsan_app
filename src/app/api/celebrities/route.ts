import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient()

  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get('category')
  const multiOwnerOnly = searchParams.get('multiOwnerOnly') === 'true'
  const search = searchParams.get('search')
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '20', 10)
  const offset = (page - 1) * limit

  let query = supabase
    .from('celebrities')
    .select('*', { count: 'exact' })

  if (category) {
    query = query.eq('category', category as 'entertainer' | 'politician' | 'athlete')
  }

  if (multiOwnerOnly) {
    query = query.gte('property_count', 2)
  }

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  const { data, error, count } = await query
    .order('property_count', { ascending: false })
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
