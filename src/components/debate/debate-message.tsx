'use client'

import { useRef, useEffect } from 'react'
import type { DebatePersona, DebateSide } from '@/types/debate'
import { DebateHighlight } from './debate-highlight'
import { useTypingAnimation } from './use-typing-animation'
import { useDebateStore } from '@/stores/debate-store'
import { cn } from '@/lib/utils'

interface DebateMessageProps {
  turnNumber: number
  speakerId: DebateSide
  content: string
  persona: DebatePersona
  isActive: boolean
  isRevealed: boolean
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1">
      <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
      <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
      <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
    </span>
  )
}

export function DebateMessage({
  turnNumber,
  speakerId,
  content,
  persona,
  isActive,
  isRevealed,
}: DebateMessageProps) {
  const { playbackSpeed, completeCurrentTurn } = useDebateStore()
  const messageRef = useRef<HTMLDivElement>(null)

  const { displayedText, isComplete } = useTypingAnimation({
    text: content,
    isActive,
    speed: playbackSpeed,
    onComplete: completeCurrentTurn,
  })

  useEffect(() => {
    if (isActive && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [isActive, displayedText])

  const isBull = speakerId === 'bull'
  const textToDisplay = isRevealed ? content : displayedText

  return (
    <div
      ref={messageRef}
      className={cn(
        'flex items-start gap-3 mb-4 max-w-[85%]',
        isBull ? 'mr-auto' : 'ml-auto flex-row-reverse'
      )}
    >
      <div
        className={cn(
          'flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full text-lg',
          isBull
            ? 'bg-rose-100 dark:bg-rose-900/30'
            : 'bg-indigo-100 dark:bg-indigo-900/30'
        )}
      >
        {persona.emoji}
      </div>

      <div className={cn('flex flex-col', isBull ? 'items-start' : 'items-end')}>
        <div
          className={cn(
            'flex items-center gap-2 mb-1',
            isBull ? '' : 'flex-row-reverse'
          )}
        >
          <span className="text-sm font-semibold">{persona.name}</span>
          <span className="text-xs text-muted-foreground">Turn {turnNumber}</span>
        </div>

        <div
          className={cn(
            'rounded-2xl px-4 py-3 text-sm leading-relaxed',
            isBull
              ? 'bg-rose-50 dark:bg-rose-950/40 rounded-tl-sm'
              : 'bg-indigo-50 dark:bg-indigo-950/40 rounded-tr-sm'
          )}
        >
          {isActive && !isRevealed && textToDisplay.length === 0 ? (
            <TypingDots />
          ) : (
            <DebateHighlight
              text={textToDisplay}
              side={speakerId}
            />
          )}
        </div>

        {isActive && !isComplete && !isRevealed && (
          <div className="mt-1">
            <div className="h-0.5 bg-muted rounded-full overflow-hidden w-24">
              <div
                className={cn(
                  'h-full transition-all duration-100 rounded-full',
                  isBull ? 'bg-rose-400' : 'bg-indigo-400'
                )}
                style={{
                  width: `${(textToDisplay.length / content.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
