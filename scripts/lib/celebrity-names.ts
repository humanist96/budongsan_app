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
  const names: string[] = []

  // 소스 파일들 (여러 경로에서 탐색)
  const seedPaths = [
    path.resolve(__dirname, '..', '..', 'src', 'data', 'celebrity-seed-data.ts'),
    path.resolve(__dirname, '..', 'seed-celebrities.ts'),
  ]

  for (const seedPath of seedPaths) {
    try {
      const content = fs.readFileSync(seedPath, 'utf-8')

      // name: '...' 패턴 (인라인 객체와 멀티라인 모두 매칭)
      const nameRegex = /name:\s*'([^']+)'/g
      let match
      while ((match = nameRegex.exec(content)) !== null) {
        const name = match[1]
        // Skip property names
        if (
          !name.includes('아파트') &&
          !name.includes('빌라') &&
          !name.includes('별장') &&
          !name.includes('리조트') &&
          !name.includes('주택') &&
          !name.includes('빌딩') &&
          !name.includes('단독') &&
          !name.includes('펜트하우스') &&
          !name.includes('오피스텔') &&
          !name.includes('타워') &&
          !name.includes('힐') &&
          !name.includes('파크') &&
          name.length <= 15
        ) {
          names.push(name)
        }
      }
    } catch {
      // File not found, skip
    }
  }

  return [...new Set(names)]
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
