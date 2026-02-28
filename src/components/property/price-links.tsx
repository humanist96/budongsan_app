import { ExternalLink, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { findNaverComplexNo } from '@/lib/utils'

interface PriceLinksProps {
  readonly propertyName: string
  readonly address: string
}

function stripParentheses(name: string): string {
  return name.replace(/\s*\(.*?\)\s*/g, '').trim()
}

interface ServiceLink {
  name: string
  url: string
  description: string
  isDirect: boolean
}

function buildServiceLinks(propertyName: string, address: string): ServiceLink[] {
  const searchQuery = stripParentheses(propertyName) || address
  const complexNo = findNaverComplexNo(propertyName)
  const encodedQuery = encodeURIComponent(searchQuery)

  return [
    {
      name: '네이버 부동산',
      url: complexNo
        ? `https://new.land.naver.com/complexes/${complexNo}`
        : `https://new.land.naver.com/search?query=${encodedQuery}`,
      description: complexNo ? '단지 시세·매물 직접 링크' : '매물 검색',
      isDirect: !!complexNo,
    },
    {
      name: 'KB부동산',
      url: `https://kbland.kr/map?searchQuery=${encodedQuery}`,
      description: 'KB시세·호가',
      isDirect: false,
    },
    {
      name: '국토부 실거래가',
      url: 'https://rt.molit.go.kr/',
      description: '공식 실거래 신고가',
      isDirect: false,
    },
    {
      name: '호갱노노',
      url: complexNo
        ? `https://hogangnono.com/apt/${complexNo}`
        : 'https://hogangnono.com/',
      description: complexNo ? '시세 추이·학군 직접 링크' : '가격 추이·학군',
      isDirect: !!complexNo,
    },
    {
      name: '네이버 지도',
      url: `https://map.naver.com/p/search/${encodedQuery}`,
      description: '위치·주변 정보',
      isDirect: false,
    },
    {
      name: '카카오맵',
      url: `https://map.kakao.com/?q=${encodedQuery}`,
      description: '로드뷰·주변 시설',
      isDirect: false,
    },
  ]
}

export function PriceLinks({ propertyName, address }: PriceLinksProps) {
  const links = buildServiceLinks(propertyName, address)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">실시간 시세 조회</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors hover:bg-muted ${
                link.isDirect ? 'border-primary/30 bg-primary/5' : ''
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate flex items-center gap-1">
                  {link.name}
                  {link.isDirect && (
                    <CheckCircle className="h-3 w-3 text-primary shrink-0" />
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{link.description}</p>
              </div>
              <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
