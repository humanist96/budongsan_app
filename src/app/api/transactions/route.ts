import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient()

  const propertyId = request.nextUrl.searchParams.get('propertyId')
  if (!propertyId) {
    return NextResponse.json(
      { success: false, error: 'propertyId is required' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('property_id', propertyId)
    .order('transaction_year', { ascending: true })
    .order('transaction_month', { ascending: true })
    .order('transaction_day', { ascending: true })

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}
