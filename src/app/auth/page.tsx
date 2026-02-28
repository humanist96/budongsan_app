'use client'

import { MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

export default function AuthPage() {
  const handleKakaoLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-sm">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <MapPin className="h-10 w-10 text-pink-500" />
          </div>
          <CardTitle>셀럽하우스맵</CardTitle>
          <CardDescription>
            로그인하고 댓글, 좋아요, 체크인 기능을 사용해보세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleKakaoLogin}
            className="w-full bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] font-medium"
          >
            카카오 로그인
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
