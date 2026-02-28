import { NextRequest, NextResponse } from 'next/server'
import { fetchApartmentTransactions, parseDealAmount } from '@/lib/api/molit-client'
import { createServiceRoleClient } from '@/lib/supabase/server'
import type { Json } from '@/lib/supabase/database.types'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createServiceRoleClient()

    const { data: properties } = await supabase
      .from('properties')
      .select('id, name, dong_code')
      .not('dong_code', 'is', null)

    if (!properties || properties.length === 0) {
      return NextResponse.json({ success: true, message: 'No properties to sync' })
    }

    const now = new Date()
    const dealYmd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`

    const dongCodes = [...new Set(properties.map((p) => p.dong_code).filter(Boolean))]
    let synced = 0

    for (const dongCode of dongCodes) {
      try {
        const transactions = await fetchApartmentTransactions({
          lawdCd: dongCode!,
          dealYmd,
        })

        for (const tx of transactions) {
          const matchedProp = properties.find(
            (p) => p.dong_code === dongCode && p.name.includes(tx.aptName)
          )

          if (matchedProp) {
            const amount = parseDealAmount(tx.dealAmount)
            if (amount > 0) {
              await supabase.from('transactions').insert({
                property_id: matchedProp.id,
                transaction_amount: amount,
                transaction_year: parseInt(tx.dealYear),
                transaction_month: parseInt(tx.dealMonth),
                transaction_day: parseInt(tx.dealDay),
                exclusive_area: parseFloat(tx.excluUseAr) || null,
                floor: parseInt(tx.floor) || null,
                raw_data: tx as unknown as Json,
              })
              synced++
            }
          }
        }
      } catch (err) {
        // continue to next dong code
      }
    }

    return NextResponse.json({ success: true, synced })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Sync failed' },
      { status: 500 }
    )
  }
}
