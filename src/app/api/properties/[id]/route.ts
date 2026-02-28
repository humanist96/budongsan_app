import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const { data: property, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !property) {
    return NextResponse.json(
      { success: false, error: 'Property not found' },
      { status: 404 }
    )
  }

  const [{ data: celebrities }, { data: transactions }] = await Promise.all([
    supabase
      .from('celebrity_properties')
      .select(`
        ownership_type,
        acquisition_date,
        acquisition_price,
        source_url,
        verification_status,
        celebrities(*)
      `)
      .eq('property_id', id),
    supabase
      .from('transactions')
      .select('*')
      .eq('property_id', id)
      .order('transaction_year', { ascending: true })
      .order('transaction_month', { ascending: true }),
  ])

  return NextResponse.json({
    success: true,
    data: {
      ...(property as Record<string, unknown>),
      celebrity_properties: celebrities || [],
      transactions: transactions || [],
    },
  })
}
