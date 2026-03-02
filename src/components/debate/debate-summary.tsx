'use client'

import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { DebateData } from '@/types/debate'
import { useDebateStore } from '@/stores/debate-store'

interface DebateSummaryProps {
  data: DebateData
}

export function DebateSummary({ data }: DebateSummaryProps) {
  const reset = useDebateStore((s) => s.reset)
  const [bull, bear] = data.personas

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-8">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">토론 종료</h2>
        <p className="text-sm text-muted-foreground">
          50턴에 걸친 치열한 부동산 토론이 끝났습니다
        </p>
      </div>

      {/* Summary table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3 font-medium">쟁점</th>
              <th className="text-left py-2 px-3 font-medium text-rose-600 dark:text-rose-400">
                {bull.emoji} {bull.name}
              </th>
              <th className="text-left py-2 px-3 font-medium text-indigo-600 dark:text-indigo-400">
                {bear.emoji} {bear.name}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.summary.map((issue) => (
              <tr key={issue.topic} className="border-b last:border-b-0">
                <td className="py-2 px-3 font-medium">{issue.topic}</td>
                <td className="py-2 px-3 text-muted-foreground">
                  {issue.bullPosition}
                </td>
                <td className="py-2 px-3 text-muted-foreground">
                  {issue.bearPosition}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quotes */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-rose-50/50 dark:bg-rose-950/20 p-4">
          <h3 className="font-semibold text-sm mb-3">
            {bull.emoji} {bull.name} 대표 명언
          </h3>
          <ul className="space-y-2">
            {data.quotes.bull.map((quote, i) => (
              <li
                key={i}
                className="text-xs text-muted-foreground leading-relaxed italic"
              >
                {quote}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border bg-indigo-50/50 dark:bg-indigo-950/20 p-4">
          <h3 className="font-semibold text-sm mb-3">
            {bear.emoji} {bear.name} 대표 명언
          </h3>
          <ul className="space-y-2">
            {data.quotes.bear.map((quote, i) => (
              <li
                key={i}
                className="text-xs text-muted-foreground leading-relaxed italic"
              >
                {quote}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="text-center">
        <Button variant="outline" onClick={reset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          다시 보기
        </Button>
      </div>
    </div>
  )
}
