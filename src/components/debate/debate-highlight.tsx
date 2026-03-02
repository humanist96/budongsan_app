'use client'

import type { DebateSide } from '@/types/debate'

interface DebateHighlightProps {
  text: string
  side: DebateSide
}

export function DebateHighlight({ text, side }: DebateHighlightProps) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const inner = part.slice(2, -2)
          return (
            <strong
              key={i}
              className={
                side === 'bull'
                  ? 'text-rose-600 dark:text-rose-400 font-bold'
                  : 'text-indigo-600 dark:text-indigo-400 font-bold'
              }
            >
              {inner}
            </strong>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}
