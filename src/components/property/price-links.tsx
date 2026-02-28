import { ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PriceLinksProps {
  propertyName: string
  address: string
}

const SERVICES = [
  {
    name: '네이버 부동산',
    getUrl: (query: string) =>
      `https://new.land.naver.com/search?query=${encodeURIComponent(query)}`,
    description: '실시간 매물·시세',
  },
  {
    name: 'KB부동산',
    getUrl: () => 'https://kbland.kr/',
    description: '시세·호가',
  },
  {
    name: '국토교통부 실거래가',
    getUrl: () => 'https://rt.molit.go.kr/',
    description: '공식 실거래 신고',
  },
  {
    name: '호갱노노',
    getUrl: () => 'https://hogangnono.com/',
    description: '가격 추이·학군',
  },
] as const

function stripParentheses(name: string): string {
  return name.replace(/\s*\(.*?\)\s*/g, '').trim()
}

export function PriceLinks({ propertyName, address }: PriceLinksProps) {
  const searchQuery = stripParentheses(propertyName) || address

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">실시간 시세 조회</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {SERVICES.map((service) => (
            <a
              key={service.name}
              href={service.getUrl(searchQuery)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors hover:bg-muted"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{service.name}</p>
                <p className="text-xs text-muted-foreground">{service.description}</p>
              </div>
              <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
