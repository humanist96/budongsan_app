'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  User,
  Building2,
  Receipt,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  addSubmission,
  PROPERTY_TYPE_LABELS,
  TRANSACTION_TYPE_LABELS,
} from '@/lib/submissions-store'
import type { PropertyType, TransactionType, SubmissionDetail } from '@/lib/submissions-store'
import { CATEGORY_LABELS } from '@/types/celebrity'
import type { CelebrityCategory } from '@/types/celebrity'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

const CATEGORY_ICONS: Record<CelebrityCategory, { emoji: string; color: string }> = {
  entertainer: { emoji: '🎬', color: 'border-pink-500 bg-pink-50 text-pink-700 dark:bg-pink-950/30 dark:text-pink-300' },
  politician: { emoji: '🏛️', color: 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300' },
  athlete: { emoji: '⚽', color: 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300' },
  expert: { emoji: '📊', color: 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300' },
}

const TRANSACTION_STYLES: Record<TransactionType, string> = {
  buy: 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300',
  sell: 'border-red-500 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300',
  rent: 'border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300',
}

export default function SubmitPage() {
  // 셀럽 정보
  const [celebrityName, setCelebrityName] = useState('')
  const [category, setCategory] = useState<CelebrityCategory>('entertainer')

  // 매물 정보
  const [propertyName, setPropertyName] = useState('')
  const [propertyAddress, setPropertyAddress] = useState('')
  const [propertyType, setPropertyType] = useState<PropertyType>('apartment')

  // 거래 정보
  const [transactionType, setTransactionType] = useState<TransactionType>('buy')
  const [transactionDate, setTransactionDate] = useState('')
  const [transactionPrice, setTransactionPrice] = useState('')
  const [estimatedCurrentValue, setEstimatedCurrentValue] = useState('')

  // 부가 정보
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')

  const [state, setState] = useState<SubmitState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const resetForm = () => {
    setCelebrityName('')
    setCategory('entertainer')
    setPropertyName('')
    setPropertyAddress('')
    setPropertyType('apartment')
    setTransactionType('buy')
    setTransactionDate('')
    setTransactionPrice('')
    setEstimatedCurrentValue('')
    setAdditionalNotes('')
    setSourceUrl('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!celebrityName.trim() || !propertyAddress.trim()) {
      setErrorMessage('셀럽 이름과 매물 주소는 필수입니다.')
      setState('error')
      return
    }

    setState('submitting')
    setErrorMessage('')

    const detail: SubmissionDetail = {
      category,
      propertyName: propertyName.trim() || null,
      propertyType,
      transactionType,
      transactionDate: transactionDate || null,
      transactionPrice: transactionPrice ? Number(transactionPrice) : null,
      estimatedCurrentValue: estimatedCurrentValue ? Number(estimatedCurrentValue) : null,
      additionalNotes: additionalNotes.trim() || null,
    }

    // description을 구조화된 텍스트로 생성 (DB 호환)
    const descriptionParts = [
      `[${CATEGORY_LABELS[category]}]`,
      propertyName.trim() ? `매물명: ${propertyName.trim()}` : null,
      `매물유형: ${PROPERTY_TYPE_LABELS[propertyType]}`,
      `거래유형: ${TRANSACTION_TYPE_LABELS[transactionType]}`,
      transactionDate ? `거래시기: ${transactionDate}` : null,
      transactionPrice ? `거래가격: ${transactionPrice}억원` : null,
      estimatedCurrentValue ? `현재추정시세: ${estimatedCurrentValue}억원` : null,
      additionalNotes.trim() ? `비고: ${additionalNotes.trim()}` : null,
    ].filter(Boolean)

    const payload = {
      celebrityName: celebrityName.trim(),
      propertyAddress: propertyAddress.trim(),
      description: descriptionParts.join(' | '),
      sourceUrl: sourceUrl.trim() || null,
      detail,
    }

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await res.json()

      if (result.success) {
        setState('success')
        resetForm()
        return
      }
    } catch {
      // API failed — fall through to localStorage
    }

    // Fallback: localStorage
    try {
      addSubmission(payload)
      setState('success')
      resetForm()
    } catch {
      setErrorMessage('저장에 실패했습니다.')
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
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* ─── 셀럽 정보 ─── */}
                <section className="space-y-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    <User className="h-4 w-4" />
                    셀럽 정보
                  </h3>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="celebrityName">
                      셀럽 이름 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="celebrityName"
                      placeholder="예: 방탄소년단 RM, 손흥민"
                      value={celebrityName}
                      onChange={(e) => setCelebrityName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      셀럽 그룹 <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.entries(CATEGORY_LABELS) as [CelebrityCategory, string][]).map(
                        ([key, label]) => {
                          const { emoji, color } = CATEGORY_ICONS[key]
                          const isSelected = category === key
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => setCategory(key)}
                              className={`flex items-center gap-2 rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition-all ${
                                isSelected
                                  ? color
                                  : 'border-border bg-background text-muted-foreground hover:border-muted-foreground/30'
                              }`}
                            >
                              <span className="text-base">{emoji}</span>
                              {label}
                            </button>
                          )
                        }
                      )}
                    </div>
                  </div>
                </section>

                <div className="border-t" />

                {/* ─── 매물 정보 ─── */}
                <section className="space-y-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    <Building2 className="h-4 w-4" />
                    매물 정보
                  </h3>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="propertyName">
                      매물명
                    </label>
                    <Input
                      id="propertyName"
                      placeholder="예: 한남더힐, 트라움하우스5, XX빌딩"
                      value={propertyName}
                      onChange={(e) => setPropertyName(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">건물/단지 이름을 알고 계시면 입력해주세요.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="propertyAddress">
                      매물 주소 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="propertyAddress"
                      placeholder="예: 서울 용산구 한남동 810"
                      value={propertyAddress}
                      onChange={(e) => setPropertyAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">매물 유형</label>
                    <div className="flex flex-wrap gap-2">
                      {(Object.entries(PROPERTY_TYPE_LABELS) as [PropertyType, string][]).map(
                        ([key, label]) => (
                          <Badge
                            key={key}
                            variant={propertyType === key ? 'default' : 'outline'}
                            className="cursor-pointer px-3 py-1.5 text-sm"
                            onClick={() => setPropertyType(key)}
                          >
                            {label}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                </section>

                <div className="border-t" />

                {/* ─── 거래 정보 ─── */}
                <section className="space-y-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    <Receipt className="h-4 w-4" />
                    거래 정보
                  </h3>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">거래 유형</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(Object.entries(TRANSACTION_TYPE_LABELS) as [TransactionType, string][]).map(
                        ([key, label]) => {
                          const isSelected = transactionType === key
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => setTransactionType(key)}
                              className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all ${
                                isSelected
                                  ? TRANSACTION_STYLES[key]
                                  : 'border-border bg-background text-muted-foreground hover:border-muted-foreground/30'
                              }`}
                            >
                              {label}
                            </button>
                          )
                        }
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="transactionDate">
                        거래 시기
                      </label>
                      <Input
                        id="transactionDate"
                        type="month"
                        value={transactionDate}
                        onChange={(e) => setTransactionDate(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">대략적인 시기라도 괜찮습니다.</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="transactionPrice">
                        거래 가격 (억원)
                      </label>
                      <div className="relative">
                        <Input
                          id="transactionPrice"
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="예: 45.5"
                          value={transactionPrice}
                          onChange={(e) => setTransactionPrice(e.target.value)}
                          className="pr-12"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          억원
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="estimatedCurrentValue">
                      현재 추정 시세 (억원)
                    </label>
                    <div className="relative">
                      <Input
                        id="estimatedCurrentValue"
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="예: 90"
                        value={estimatedCurrentValue}
                        onChange={(e) => setEstimatedCurrentValue(e.target.value)}
                        className="pr-12"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        억원
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">알고 계시는 범위에서 입력해주세요. 정확하지 않아도 됩니다.</p>
                  </div>
                </section>

                <div className="border-t" />

                {/* ─── 부가 정보 ─── */}
                <section className="space-y-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    <FileText className="h-4 w-4" />
                    부가 정보
                  </h3>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="additionalNotes">
                      추가 참고사항
                    </label>
                    <Textarea
                      id="additionalNotes"
                      placeholder="예: 전액 현금 매입, 법인 명의, 임대 수익 연 13억 등"
                      rows={3}
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
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
                    <p className="text-xs text-muted-foreground">뉴스 기사, 유튜브 영상 등 출처 링크를 남겨주시면 검증에 도움이 됩니다.</p>
                  </div>
                </section>

                {state === 'error' && errorMessage && (
                  <div className="flex items-center gap-2 rounded-md bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {errorMessage}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full gap-2"
                  size="lg"
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
