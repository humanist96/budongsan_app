import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient()

  const type = request.nextUrl.searchParams.get('type') || 'multi-owner'
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20', 10)

  switch (type) {
    case 'multi-owner': {
      const { data, error } = await supabase
        .from('celebrities')
        .select('id, name, category, property_count, total_asset_value, profile_image_url')
        .gte('property_count', 2)
        .order('property_count', { ascending: false })
        .limit(limit)

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
      }
      return NextResponse.json({ success: true, data })
    }

    case 'top-price': {
      const { data, error } = await supabase
        .from('celebrities')
        .select('id, name, category, property_count, total_asset_value, profile_image_url')
        .order('total_asset_value', { ascending: false })
        .limit(limit)

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
      }
      return NextResponse.json({ success: true, data })
    }

    case 'dense-neighborhood': {
      const { data, error } = await supabase
        .from('v_neighborhood_density')
        .select('*')
        .limit(limit)

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
      }
      return NextResponse.json({ success: true, data })
    }

    default:
      return NextResponse.json(
        { success: false, error: 'Invalid ranking type' },
        { status: 400 }
      )
  }
}
