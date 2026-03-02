'use client'

import { Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { DebateData } from '@/types/debate'
import { useDebateStore } from '@/stores/debate-store'
import { cn } from '@/lib/utils'

interface DebateHeaderProps {
  data: DebateData
}

export function DebateHeader({ data }: DebateHeaderProps) {
  const start = useDebateStore((s) => s.start)
  const [bull, bear] = data.personas

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-4 py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
        {data.title}
      </h1>
      <p className="text-sm text-muted-foreground text-center max-w-lg mb-12">
        {data.topic}
      </p>

      <div className="flex items-center gap-6 md:gap-12 mb-12">
        {/* Bull persona */}
        <div className="flex flex-col items-center text-center">
          <div
            className={cn(
              'w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-4xl md:text-5xl',
              'bg-rose-100 dark:bg-rose-950/40 ring-2 ring-rose-300 dark:ring-rose-700'
            )}
          >
            {bull.emoji}
          </div>
          <span className="mt-3 text-lg font-bold">{bull.name}</span>
          <span className="text-xs text-muted-foreground">{bull.title}</span>
          <span className="mt-1 inline-flex items-center rounded-full bg-rose-100 dark:bg-rose-950/40 px-2.5 py-0.5 text-xs font-medium text-rose-700 dark:text-rose-300">
            {bull.emoji} {bull.position}
          </span>
        </div>

        {/* VS */}
        <div className="flex flex-col items-center">
          <span className="text-3xl md:text-5xl font-black text-muted-foreground/30">
            VS
          </span>
        </div>

        {/* Bear persona */}
        <div className="flex flex-col items-center text-center">
          <div
            className={cn(
              'w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-4xl md:text-5xl',
              'bg-indigo-100 dark:bg-indigo-950/40 ring-2 ring-indigo-300 dark:ring-indigo-700'
            )}
          >
            {bear.emoji}
          </div>
          <span className="mt-3 text-lg font-bold">{bear.name}</span>
          <span className="text-xs text-muted-foreground">{bear.title}</span>
          <span className="mt-1 inline-flex items-center rounded-full bg-indigo-100 dark:bg-indigo-950/40 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-300">
            {bear.emoji} {bear.position}
          </span>
        </div>
      </div>

      <Button
        size="lg"
        onClick={start}
        className="gap-2 animate-pulse text-base px-8"
      >
        <Play className="h-5 w-5" />
        토론 시작
      </Button>

      <p className="mt-4 text-xs text-muted-foreground text-center max-w-sm">
        AI가 생성한 50턴 토론을 실시간 채팅처럼 감상합니다.
        재생 속도 조절과 턴 이동이 가능합니다.
      </p>
    </div>
  )
}
