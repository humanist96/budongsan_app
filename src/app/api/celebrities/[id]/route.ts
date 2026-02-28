import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const { data: celebrity, error } = await supabase
    .from('celebrities')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !celebrity) {
    return NextResponse.json(
      { success: false, error: 'Celebrity not found' },
      { status: 404 }
    )
  }

  const { data: properties } = await supabase
    .from('celebrity_properties')
    .select(`
      id,
      ownership_type,
      acquisition_date,
      acquisition_price,
      source_url,
      verification_status,
      properties(*)
    `)
    .eq('celebrity_id', id)
    .order('created_at', { ascending: false })

  return NextResponse.json({
    success: true,
    data: {
      ...(celebrity as Record<string, unknown>),
      celebrity_properties: properties || [],
    },
  })
}
