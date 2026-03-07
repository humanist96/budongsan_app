/**
 * 프로필 자동 수집 스크립트 (Wikipedia + Wikidata + 나무위키)
 *
 * 시드 데이터에서 셀럽 이름을 로드하고, 각 셀럽에 대해:
 * 1. Wikipedia 요약 + 썸네일 가져오기
 * 2. Wikidata에서 생년/직업/SNS 추출
 * 3. 나무위키 URL 존재 확인
 *
 * 결과를 data/enriched-profiles.json에 저장.
 * --apply 플래그: Supabase celebrities 테이블 직접 업데이트.
 *
 * Usage:
 *   pnpm enrich:profiles              # JSON 파일로 저장만
 *   pnpm enrich:profiles -- --apply   # Supabase에도 반영
 */

import * as fs from 'fs'
import * as path from 'path'
import { loadCelebrityNames } from './lib/celebrity-names'
import { enrichProfile, type ProfileEnrichment } from './lib/wiki-client'

interface EnrichedProfile {
  name: string
  enrichment: ProfileEnrichment
  enrichedAt: string
}

interface EnrichmentResult {
  processedAt: string
  totalProcessed: number
  successCount: number
  failCount: number
  profiles: EnrichedProfile[]
}

async function applyToSupabase(profiles: EnrichedProfile[]): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase credentials not set. Skipping DB update.')
    return
  }

  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  let updated = 0
  let failed = 0

  for (const profile of profiles) {
    const hasData = profile.enrichment.wikipediaUrl ||
      profile.enrichment.namuwikiUrl ||
      profile.enrichment.birthYear

    if (!hasData) continue

    const updateData: Record<string, unknown> = {
      enriched_at: profile.enrichedAt,
    }

    if (profile.enrichment.wikipediaUrl) {
      updateData.wikipedia_url = profile.enrichment.wikipediaUrl
    }
    if (profile.enrichment.namuwikiUrl) {
      updateData.namuwiki_url = profile.enrichment.namuwikiUrl
    }
    if (profile.enrichment.wikidataId) {
      updateData.wikidata_id = profile.enrichment.wikidataId
    }
    if (profile.enrichment.birthYear) {
      updateData.birth_year = profile.enrichment.birthYear
    }
    if (Object.keys(profile.enrichment.socialLinks).length > 0) {
      updateData.social_links = profile.enrichment.socialLinks
    }

    const { error } = await supabase
      .from('celebrities')
      .update(updateData)
      .eq('name', profile.name)

    if (error) {
      console.error(`  Failed to update ${profile.name}:`, error.message)
      failed++
    } else {
      updated++
    }
  }

  console.log(`\nSupabase update: ${updated} updated, ${failed} failed`)
}

async function main() {
  const applyFlag = process.argv.includes('--apply')
  const limitArg = process.argv.find((a) => a.startsWith('--limit='))
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : 0

  const names = loadCelebrityNames()
  console.log(`Loaded ${names.length} celebrity names`)

  const namesToProcess = limit > 0 ? names.slice(0, limit) : names
  console.log(`Processing ${namesToProcess.length} celebrities...`)

  const profiles: EnrichedProfile[] = []
  let successCount = 0
  let failCount = 0

  for (let i = 0; i < namesToProcess.length; i++) {
    const name = namesToProcess[i]
    const progress = `[${i + 1}/${namesToProcess.length}]`

    try {
      const enrichment = await enrichProfile(name)
      const enrichedAt = new Date().toISOString()

      profiles.push({ name, enrichment, enrichedAt })

      const hasWiki = enrichment.wikipediaUrl ? 'W' : '-'
      const hasNamu = enrichment.namuwikiUrl ? 'N' : '-'
      const hasBirth = enrichment.birthYear ? `b${enrichment.birthYear}` : '-'
      const hasSocial = Object.keys(enrichment.socialLinks).length > 0 ? 'S' : '-'

      console.log(`${progress} ${name}: ${hasWiki}${hasNamu} ${hasBirth} ${hasSocial}`)
      successCount++
    } catch (err) {
      console.error(`${progress} ${name}: ERROR -`, err)
      failCount++
    }
  }

  // Save to JSON
  const result: EnrichmentResult = {
    processedAt: new Date().toISOString(),
    totalProcessed: namesToProcess.length,
    successCount,
    failCount,
    profiles,
  }

  const outputDir = path.resolve(process.cwd(), 'data')
  fs.mkdirSync(outputDir, { recursive: true })
  const outputPath = path.join(outputDir, 'enriched-profiles.json')
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8')

  console.log(`\n=== Enrichment Results ===`)
  console.log(`Processed: ${namesToProcess.length}`)
  console.log(`Success: ${successCount}`)
  console.log(`Failed: ${failCount}`)

  const withWiki = profiles.filter((p) => p.enrichment.wikipediaUrl).length
  const withNamu = profiles.filter((p) => p.enrichment.namuwikiUrl).length
  const withBirth = profiles.filter((p) => p.enrichment.birthYear).length
  const withSocial = profiles.filter((p) => Object.keys(p.enrichment.socialLinks).length > 0).length

  console.log(`\nCoverage:`)
  console.log(`  Wikipedia: ${withWiki}/${namesToProcess.length}`)
  console.log(`  나무위키:   ${withNamu}/${namesToProcess.length}`)
  console.log(`  생년:      ${withBirth}/${namesToProcess.length}`)
  console.log(`  SNS:       ${withSocial}/${namesToProcess.length}`)
  console.log(`\nSaved to ${outputPath}`)

  // Apply to Supabase if --apply flag
  if (applyFlag) {
    console.log('\n--apply flag detected. Updating Supabase...')
    await applyToSupabase(profiles)
  }
}

main().catch(console.error)
