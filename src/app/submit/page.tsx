'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Send, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export default function SubmitPage() {
  const [celebrityName, setCelebrityName] = useState('')
  const [propertyAddress, setPropertyAddress] = useState('')
  const [description, setDescription] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [state, setState] = useState<SubmitState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!celebrityName.trim() || !propertyAddress.trim()) {
      setErrorMessage('셀럽 이름과 매물 주소는 필수입니다.')
      setState('error')
      return
    }

    setState('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          celebrityName: celebrityName.trim(),
          propertyAddress: propertyAddress.trim(),
          description: description.trim() || null,
          sourceUrl: sourceUrl.trim() || null,
        }),
      })

      const result = await res.json()

      if (result.success) {
        setState('success')
        setCelebrityName('')
        setPropertyAddress('')
        setDescription('')
        setSourceUrl('')
      } else {
        setErrorMessage(result.error || '제출에 실패했습니다.')
        setState('error')
      }
    } catch {
      setErrorMessage('네트워크 오류가 발생했습니다.')
      setState('error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-6 gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            홈으로
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Send className="h-6 w-6 text-pink-500" />
              셀럽 부동산 제보
            </CardTitle>
            <CardDescription>
              알고 계신 셀럽의 부동산 정보를 제보해 주세요.
              관리자 확인 후 데이터에 반영됩니다.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {state === 'success' ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
                <h3 className="text-xl font-bold">제보 완료!</h3>
                <p className="text-muted-foreground text-center">
                  소중한 제보 감사합니다.<br />
                  관리자 확인 후 데이터에 반영됩니다.
                </p>
                <Button onClick={() => setState('idle')} variant="outline" className="mt-4">
                  추가 제보하기
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="celebrityName">
                    셀럽 이름 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="celebrityName"
                    placeholder="예: 홍길동"
                    value={celebrityName}
                    onChange={(e) => setCelebrityName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="propertyAddress">
                    매물 주소 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="propertyAddress"
                    placeholder="예: 서울 강남구 청담동 OO빌딩"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="description">
                    상세 내용
                  </label>
                  <Textarea
                    id="description"
                    placeholder="매입 시기, 가격, 기타 정보 등"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="sourceUrl">
                    출처 URL
                  </label>
                  <Input
                    id="sourceUrl"
                    type="url"
                    placeholder="https://news.example.com/..."
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                  />
                </div>

                {state === 'error' && errorMessage && (
                  <div className="flex items-center gap-2 rounded-md bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {errorMessage}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={state === 'submitting'}
                >
                  {state === 'submitting' ? (
                    <>처리 중...</>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      제보하기
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
