'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Lock,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  getSubmissions,
  updateSubmissionStatus,
  deleteSubmission,
  type Submission,
} from '@/lib/submissions-store'

const ADMIN_PIN = '1234'

const STATUS_CONFIG = {
  pending: { label: '대기', icon: Clock, variant: 'secondary' as const, color: 'text-yellow-600' },
  approved: { label: '승인', icon: CheckCircle2, variant: 'default' as const, color: 'text-green-600' },
  rejected: { label: '반려', icon: XCircle, variant: 'destructive' as const, color: 'text-red-600' },
}

export default function AdminPage() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

  const loadSubmissions = useCallback(() => {
    const data = filter === 'all' ? getSubmissions() : getSubmissions(filter)
    setSubmissions(data)
  }, [filter])

  useEffect(() => {
    if (isAuthed) loadSubmissions()
  }, [isAuthed, filter, loadSubmissions])

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pin === ADMIN_PIN) {
      setIsAuthed(true)
      setPinError(false)
    } else {
      setPinError(true)
    }
  }

  const handleAction = (id: string, status: 'approved' | 'rejected') => {
    updateSubmissionStatus(id, status)
    loadSubmissions()
  }

  const handleDelete = (id: string) => {
    deleteSubmission(id)
    loadSubmissions()
  }

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
        <Card className="w-full max-w-sm mx-4">
          <CardHeader className="text-center">
            <Lock className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <CardTitle>관리자 인증</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="관리자 PIN"
                value={pin}
                onChange={(e) => { setPin(e.target.value); setPinError(false) }}
                autoFocus
              />
              {pinError && (
                <p className="text-sm text-red-500">PIN이 올바르지 않습니다.</p>
              )}
              <Button type="submit" className="w-full">
                로그인
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              홈으로
            </Button>
          </Link>
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <ShieldCheck className="h-5 w-5 text-blue-500" />
            제보 관리
          </h1>
        </div>

        <div className="flex gap-2 mb-6">
          {(['pending', 'approved', 'rejected', 'all'] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? '전체' : STATUS_CONFIG[f].label}
              {f !== 'all' && (
                <span className="ml-1 text-xs opacity-70">
                  ({(f === filter ? submissions : getSubmissions(f)).length})
                </span>
              )}
            </Button>
          ))}
        </div>

        {submissions.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            {filter === 'pending' ? '대기 중인 제보가 없습니다.' : '제보가 없습니다.'}
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => {
              const config = STATUS_CONFIG[sub.status]
              const StatusIcon = config.icon
              return (
                <Card key={sub.id}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-lg">{sub.celebrityName}</span>
                          <Badge variant={config.variant} className="gap-1">
                            <StatusIcon className={`h-3 w-3 ${config.color}`} />
                            {config.label}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground">{sub.propertyAddress}</p>

                        {sub.description && (
                          <p className="text-sm bg-muted/50 rounded-md p-3">{sub.description}</p>
                        )}

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{new Date(sub.createdAt).toLocaleDateString('ko-KR')}</span>
                          {sub.sourceUrl && (
                            <a
                              href={sub.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-500 hover:underline"
                            >
                              <ExternalLink className="h-3 w-3" />
                              출처
                            </a>
                          )}
                          {sub.reviewedAt && (
                            <span>
                              처리: {new Date(sub.reviewedAt).toLocaleDateString('ko-KR')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        {sub.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30"
                              onClick={() => handleAction(sub.id, 'approved')}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              승인
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                              onClick={() => handleAction(sub.id, 'rejected')}
                            >
                              <XCircle className="h-4 w-4" />
                              반려
                            </Button>
                          </>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-muted-foreground hover:text-red-500"
                          onClick={() => handleDelete(sub.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
