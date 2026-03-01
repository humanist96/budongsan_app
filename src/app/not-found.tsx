import Link from 'next/link'
import { MapPin, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
      <h1 className="text-3xl font-bold mb-2">페이지를 찾을 수 없습니다</h1>
      <p className="text-muted-foreground mb-6">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <div className="flex gap-3">
        <Link href="/">
          <Button className="gap-2">
            <Home className="h-4 w-4" />
            홈으로
          </Button>
        </Link>
        <Link href="/map">
          <Button variant="outline" className="gap-2">
            <MapPin className="h-4 w-4" />
            지도 보기
          </Button>
        </Link>
      </div>
    </div>
  )
}
