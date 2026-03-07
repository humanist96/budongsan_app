/**
 * Politician asset data fetcher
 *
 * 1. Downloads latest data from 뉴스타파 공직자 재산공개
 * 2. Parses CSV with proper quoted-field handling
 * 3. Diffs against existing celebrities in Supabase
 * 4. Outputs new candidates to data/politician-candidates.json
 *
 * Usage: pnpm fetch:politicians
 */

import * as fs from 'fs'
import * as path from 'path'

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

interface PoliticianCandidate {
  name: string
  position: string
  totalAssetValue: number
  propertyCount: number
  properties: {
    type: string
    location: string
    area: string
    valueManWon: number
  }[]
}

interface CandidateResult {
  fetchedAt: string
  source: string
  totalPoliticians: number
  newCandidates: number
  candidates: PoliticianCandidate[]
}

/** CSV parser that handles quoted fields with commas */
function parseCSVLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"'
        i++ // skip escaped quote
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  fields.push(current.trim())

  return fields
}

function parseCSV(content: string): PoliticianRow[] {
  const lines = content.trim().split('\n')
  if (lines.length < 2) return []

  const rows: PoliticianRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    if (values.length < 8) continue

    rows.push({
      name: values[0] || '',
      position: values[1] || '',
      assetType: values[2] || '',
      relation: values[3] || '',
      propertyType: values[4] || '',
      location: values[5] || '',
      area: values[6] || '',
      valueInThousands: parseInt(values[7]?.replace(/[^0-9-]/g, '') || '0', 10),
    })
  }

  return rows
}

/** Try to download latest CSV from 뉴스타파 */
async function downloadNewstapaData(): Promise<string | null> {
  const dataUrl = 'https://jaesan.newstapa.org/data'

  try {
    console.log(`Fetching data index from ${dataUrl}...`)
    const response = await fetch(dataUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CelebHouseMap/1.0)',
      },
    })

    if (!response.ok) {
      console.log(`뉴스타파 data page returned ${response.status}`)
      return null
    }

    const html = await response.text()

    // Look for CSV or XLSX download links
    const csvLinkMatch = html.match(/href="([^"]*\.csv[^"]*)"/i)
      ?? html.match(/href="([^"]*다운로드[^"]*)"/i)
      ?? html.match(/href="([^"]*download[^"]*)"/i)

    if (!csvLinkMatch) {
      console.log('No CSV download link found on 뉴스타파 data page')
      return null
    }

    const csvUrl = csvLinkMatch[1].startsWith('http')
      ? csvLinkMatch[1]
      : `https://jaesan.newstapa.org${csvLinkMatch[1]}`

    console.log(`Downloading CSV from ${csvUrl}...`)
    const csvResponse = await fetch(csvUrl)

    if (!csvResponse.ok) {
      console.log(`CSV download failed: ${csvResponse.status}`)
      return null
    }

    const csvContent = await csvResponse.text()
    const outputPath = path.resolve(process.cwd(), 'data/politicians-latest.csv')
    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    fs.writeFileSync(outputPath, csvContent, 'utf-8')
    console.log(`Saved CSV to ${outputPath}`)

    return csvContent
  } catch (err) {
    console.error('Failed to download from 뉴스타파:', err)
    return null
  }
}

/** Load existing celebrity names from seed data */
function loadExistingCelebrityNames(): Set<string> {
  const names = new Set<string>()

  try {
    const seedPath = path.resolve(__dirname, 'seed-celebrities.ts')
    const content = fs.readFileSync(seedPath, 'utf-8')
    const nameRegex = /^\s{2,4}name:\s*'([^']+)'/gm
    let match
    while ((match = nameRegex.exec(content)) !== null) {
      names.add(match[1])
    }
  } catch {
    // Seed file not found
  }

  try {
    const politicianSeedPath = path.resolve(__dirname, 'seed-politicians.ts')
    const content = fs.readFileSync(politicianSeedPath, 'utf-8')
    // Extract names that get inserted
    const nameRegex = /name:\s*['"]([^'"]+)['"]/g
    let match
    while ((match = nameRegex.exec(content)) !== null) {
      names.add(match[1])
    }
  } catch {
    // Politician seed not found
  }

  return names
}

async function main() {
  // 1. Try downloading fresh data
  let csvContent = await downloadNewstapaData()

  // 2. Fall back to local CSV if download fails
  if (!csvContent) {
    const localPaths = [
      path.resolve(process.cwd(), 'data/politicians-latest.csv'),
      path.resolve(process.cwd(), 'data/politicians.csv'),
    ]

    for (const localPath of localPaths) {
      if (fs.existsSync(localPath)) {
        console.log(`Using local CSV: ${localPath}`)
        csvContent = fs.readFileSync(localPath, 'utf-8')
        break
      }
    }
  }

  if (!csvContent) {
    console.error('No CSV data available. Download manually from https://jaesan.newstapa.org/data')
    console.error('Place it at data/politicians.csv')
    return
  }

  // 3. Parse CSV
  const rows = parseCSV(csvContent)
  console.log(`Parsed ${rows.length} rows from CSV`)

  // 4. Filter real estate rows
  const realEstateRows = rows.filter(
    (r) => r.assetType === '건물' || r.assetType === '토지' || r.assetType === '아파트'
  )
  console.log(`Found ${realEstateRows.length} real estate rows`)

  // 5. Group by politician
  const grouped = new Map<string, { position: string; properties: PoliticianRow[] }>()
  for (const row of realEstateRows) {
    if (!grouped.has(row.name)) {
      grouped.set(row.name, { position: row.position, properties: [] })
    }
    grouped.get(row.name)!.properties.push(row)
  }

  // 6. Diff against existing celebrities
  const existingNames = loadExistingCelebrityNames()
  console.log(`Found ${existingNames.size} existing celebrity names`)

  const candidates: PoliticianCandidate[] = []

  // Sort by property count, take new politicians only
  const sorted = [...grouped.entries()]
    .filter(([name]) => !existingNames.has(name))
    .sort((a, b) => b[1].properties.length - a[1].properties.length)

  for (const [name, { position, properties }] of sorted) {
    const totalValue = properties.reduce((sum, p) => sum + Math.round(p.valueInThousands / 10), 0)

    candidates.push({
      name,
      position,
      totalAssetValue: totalValue,
      propertyCount: properties.length,
      properties: properties.map((p) => ({
        type: p.propertyType,
        location: p.location,
        area: p.area,
        valueManWon: Math.round(p.valueInThousands / 10),
      })),
    })
  }

  // 7. Save candidates
  const result: CandidateResult = {
    fetchedAt: new Date().toISOString(),
    source: 'newstapa.org',
    totalPoliticians: grouped.size,
    newCandidates: candidates.length,
    candidates,
  }

  const outputDir = path.resolve(process.cwd(), 'data')
  fs.mkdirSync(outputDir, { recursive: true })
  const outputPath = path.join(outputDir, 'politician-candidates.json')
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8')

  console.log(`\n=== Results ===`)
  console.log(`Total politicians in data: ${grouped.size}`)
  console.log(`Already registered: ${grouped.size - candidates.length}`)
  console.log(`New candidates: ${candidates.length}`)
  console.log(`Saved to ${outputPath}`)

  // Show top 20 candidates
  console.log(`\nTop 20 new candidates:`)
  for (const c of candidates.slice(0, 20)) {
    console.log(`  ${c.name} (${c.position}) - ${c.propertyCount} properties, total ${c.totalAssetValue}만원`)
  }
}

main().catch(console.error)
