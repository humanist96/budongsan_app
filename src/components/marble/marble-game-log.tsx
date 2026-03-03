'use client'

import { useRef, useEffect } from 'react'
import type { LogEntry } from './use-marble-game'

interface MarbleGameLogProps {
  readonly logs: readonly LogEntry[]
}

export function MarbleGameLog({ logs }: MarbleGameLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs.length])

  const visibleLogs = logs.slice(-30)

  return (
    <div className="rounded-xl border bg-card">
      <div className="px-3 py-2 border-b">
        <h3 className="text-xs font-bold text-muted-foreground">게임 로그</h3>
      </div>
      <div
        ref={scrollRef}
        className="h-40 overflow-y-auto p-2 space-y-0.5 text-[11px]"
      >
        {visibleLogs.map((log, i) => (
          <div
            key={`${log.turn}-${i}`}
            className={`
              py-0.5 px-1.5 rounded
              ${log.playerId === 'player'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-red-600 dark:text-red-400'
              }
            `}
          >
            <span className="text-muted-foreground mr-1">[{log.turn}]</span>
            <span className="font-medium mr-1">
              {log.playerId === 'player' ? 'P' : 'C'}
            </span>
            {log.message}
          </div>
        ))}
        {visibleLogs.length === 0 && (
          <div className="text-muted-foreground text-center py-4">
            게임을 시작하세요!
          </div>
        )}
      </div>
    </div>
  )
}
