import { MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="px-4 py-12 bg-muted/50 border-t">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-center gap-2 mb-6">
          <MapPin className="h-5 w-5 text-pink-500" />
          <span className="font-bold text-lg">셀럽하우스맵</span>
        </div>

        <div className="text-center space-y-3 text-sm text-muted-foreground">
          <p>
            셀럽하우스맵은 공개된 정보를 바탕으로 한 부동산 정보 서비스입니다.
          </p>
          <p>
            본 서비스의 정보는 참고용이며, 투자 판단의 근거로 사용할 수 없습니다.
          </p>
          <p className="text-xs">
            데이터 출처: 국토교통부 실거래가 공개시스템, 공직자윤리법 재산공개,
            주요 언론사 보도
          </p>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-xs text-muted-foreground">
          &copy; 2026 셀럽하우스맵 · 정케빈. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
