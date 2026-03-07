/**
 * 공유 유틸리티: 시드 데이터에서 셀럽 이름 로드
 *
 * news-crawler, extract-from-news, fetch-politician-assets, enrich-profiles 등
 * 다수 스크립트에서 중복된 loadCelebrityNames() 함수를 통합.
 */

import * as fs from 'fs'
import * as path from 'path'

/**
 * seed-celebrities.ts 파일에서 셀럽 이름 목록을 추출합니다.
 * 아파트/빌라 등 매물명은 제외하고 인물 이름만 반환.
 */
export function loadCelebrityNames(): string[] {
  try {
    const seedPath = path.resolve(__dirname, '..', 'seed-celebrities.ts')
    const content = fs.readFileSync(seedPath, 'utf-8')
    const names: string[] = []

    // Match top-level name fields (celebrity names, not property names)
    // Pattern: lines starting with `    name: '...'` (2-4 space indent = celebrity level)
    const nameRegex = /^\s{2,4}name:\s*'([^']+)'/gm
    let match
    while ((match = nameRegex.exec(content)) !== null) {
      const name = match[1]
      // Skip property names (they tend to be longer or contain specific suffixes)
      if (
        !name.includes('아파트') &&
        !name.includes('빌라') &&
        !name.includes('별장') &&
        !name.includes('리조트') &&
        !name.includes('주택') &&
        name.length <= 10
      ) {
        names.push(name)
      }
    }

    return [...new Set(names)]
  } catch {
    return []
  }
}

/**
 * seed-celebrities.ts + seed-politicians.ts 모두에서 이름 로드
 */
export function loadAllCelebrityNames(): Set<string> {
  const names = new Set(loadCelebrityNames())

  try {
    const politicianSeedPath = path.resolve(__dirname, '..', 'seed-politicians.ts')
    const content = fs.readFileSync(politicianSeedPath, 'utf-8')
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
