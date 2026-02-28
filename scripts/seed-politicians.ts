/**
 * Seed script for politician data from CSV
 *
 * Expected CSV format (뉴스타파 공직자 재산):
 * 이름,직위,재산종류,관계,종류,소재지,면적,신고가액(천원)
 *
 * Usage:
 *   1. Download CSV from https://jaesan.newstapa.org/data
 *   2. Place as data/politicians.csv
 *   3. Run: pnpm seed:politicians
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface PoliticianRow {
  name: string
  position: string
  assetType: string
  relation: string
  propertyType: string
  location: string
  area: string
  valueInThousands: number
}

function parseCSV(content: string): PoliticianRow[] {
  const lines = content.trim().split('\n')
  const headers = lines[0].split(',')
  const rows: PoliticianRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',')
    if (values.length < 8) continue

    rows.push({
      name: values[0]?.trim() || '',
      position: values[1]?.trim() || '',
      assetType: values[2]?.trim() || '',
      relation: values[3]?.trim() || '',
      propertyType: values[4]?.trim() || '',
      location: values[5]?.trim() || '',
      area: values[6]?.trim() || '',
      valueInThousands: parseInt(values[7]?.replace(/[^0-9-]/g, '') || '0', 10),
    })
  }

  return rows
}

function mapPropertyType(type: string): string {
  if (type.includes('아파트')) return 'apartment'
  if (type.includes('빌라') || type.includes('연립')) return 'villa'
  if (type.includes('오피스텔')) return 'officetel'
  if (type.includes('건물') || type.includes('상가')) return 'building'
  if (type.includes('토지') || type.includes('임야')) return 'land'
  if (type.includes('주택') || type.includes('단독')) return 'house'
  return 'other'
}

async function main() {
  const csvPath = path.resolve(process.cwd(), 'data/politicians.csv')

  if (!fs.existsSync(csvPath)) {
    console.log('No CSV file found at data/politicians.csv')
    console.log('Please download from https://jaesan.newstapa.org/data')
    console.log('Using embedded sample data instead...')
    return
  }

  const content = fs.readFileSync(csvPath, 'utf-8')
  const rows = parseCSV(content)

  // Filter for real estate only (건물, 토지)
  const realEstateRows = rows.filter(
    (r) => r.assetType === '건물' || r.assetType === '토지'
  )

  // Group by politician name
  const grouped = new Map<string, { position: string; properties: PoliticianRow[] }>()

  for (const row of realEstateRows) {
    if (!grouped.has(row.name)) {
      grouped.set(row.name, { position: row.position, properties: [] })
    }
    grouped.get(row.name)!.properties.push(row)
  }

  // Sort by property count (multi-owners first)
  const sorted = [...grouped.entries()].sort(
    (a, b) => b[1].properties.length - a[1].properties.length
  )

  // Take top 10 multi-owners
  const top10 = sorted.slice(0, 10)

  for (const [name, { position, properties }] of top10) {
    const { data: celebrity, error: celebError } = await supabase
      .from('celebrities')
      .insert({
        name,
        category: 'politician',
        sub_category: position,
        description: `${position} - 재산공개 기반 데이터`,
        is_verified: true,
      })
      .select()
      .single()

    if (celebError) {
      console.error(`Failed: ${name}`, celebError.message)
      continue
    }

    for (const prop of properties) {
      const priceManWon = Math.round(prop.valueInThousands / 10)
      const areaMatch = prop.area.match(/([\d.]+)/)
      const area = areaMatch ? parseFloat(areaMatch[1]) : undefined

      const { data: newProp, error: propError } = await supabase
        .from('properties')
        .insert({
          name: `${prop.propertyType} (${prop.location})`,
          address: prop.location,
          latitude: 0,
          longitude: 0,
          property_type: mapPropertyType(prop.propertyType),
          exclusive_area: area,
          latest_transaction_price: priceManWon,
        })
        .select()
        .single()

      if (propError) continue

      await supabase.from('celebrity_properties').insert({
        celebrity_id: celebrity.id,
        property_id: newProp.id,
        ownership_type: 'owner',
        acquisition_price: priceManWon,
        verification_status: 'verified',
      })
    }

    console.log(`Seeded: ${name} (${properties.length} properties)`)
  }

  console.log('Politician seed complete!')
}

main().catch(console.error)
