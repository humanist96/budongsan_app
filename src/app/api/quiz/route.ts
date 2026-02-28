import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: properties } = await supabase
      .from('celebrity_properties')
      .select(`
        celebrities(name, category),
        properties(name, address, latest_transaction_price)
      `)
      .not('properties.latest_transaction_price', 'is', null)
      .limit(20)

    if (!properties || properties.length < 4) {
      return NextResponse.json({ success: true, data: getDefaultQuestions() })
    }

    const questions = properties
      .filter((p: Record<string, unknown>) => {
        const prop = p.properties as Record<string, unknown> | null
        return prop?.latest_transaction_price
      })
      .slice(0, 5)
      .map((p: Record<string, unknown>, i: number) => {
        const celeb = p.celebrities as Record<string, unknown>
        const prop = p.properties as Record<string, unknown>
        const correctPrice = prop.latest_transaction_price as number

        const offsets = [0.7, 0.85, 1.0, 1.15, 1.3]
        const shuffled = offsets.sort(() => Math.random() - 0.5).slice(0, 4)
        if (!shuffled.includes(1.0)) shuffled[0] = 1.0

        const options = shuffled
          .map((m) => Math.round((correctPrice * m) / 10000) * 10000)
          .sort((a, b) => a - b)

        return {
          id: i + 1,
          celebrityName: celeb.name,
          propertyName: prop.name,
          address: prop.address,
          correctPrice,
          options,
        }
      })

    return NextResponse.json({ success: true, data: questions })
  } catch {
    return NextResponse.json({ success: true, data: getDefaultQuestions() })
  }
}

function getDefaultQuestions() {
  return [
    {
      id: 1,
      celebrityName: '셀럽A',
      propertyName: '한남더힐',
      address: '서울 용산구 한남동',
      correctPrice: 300000,
      options: [200000, 300000, 400000, 500000],
    },
  ]
}
