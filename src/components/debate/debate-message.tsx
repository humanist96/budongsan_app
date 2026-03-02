'use client'

import { useRef, useEffect, useState } from 'react'
import type { DebatePersona, DebateSide, DebateEmotion, AudienceReaction as AudienceReactionType } from '@/types/debate'
import { DebateHighlight } from './debate-highlight'
import { EmotionIndicator } from './emotion-indicator'
import { AudienceReaction } from './audience-reaction'
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
  emotion: DebateEmotion
  intensity: number
  isHighlight?: boolean
  highlightQuote?: string
  audienceReaction?: AudienceReactionType
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

function HighlightQuoteBanner({ quote, side }: { quote: string; side: DebateSide }) {
  return (
    <div
      className={cn(
        'mt-2 flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium',
        'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300',
        'border border-amber-200 dark:border-amber-800/50'
      )}
    >
      <span className="text-amber-500">&#x2B50;</span>
      <span className="italic">&ldquo;{quote}&rdquo;</span>
    </div>
  )
}

export function DebateMessage({
  turnNumber,
  speakerId,
  content,
  persona,
  isActive,
  isRevealed,
  emotion,
  intensity,
  isHighlight,
  highlightQuote,
  audienceReaction,
}: DebateMessageProps) {
  const { playbackSpeed, completeCurrentTurn } = useDebateStore()
  const messageRef = useRef<HTMLDivElement>(null)
  const [showReaction, setShowReaction] = useState(false)

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

  // Trigger audience reaction when typing completes
  useEffect(() => {
    if ((isComplete || isRevealed) && audienceReaction) {
      setShowReaction(true)
      const timer = setTimeout(() => setShowReaction(false), 2500)
      return () => clearTimeout(timer)
    }
  }, [isComplete, isRevealed, audienceReaction])

  const isBull = speakerId === 'bull'
  const textToDisplay = isRevealed ? content : displayedText
  const showHighlight = isHighlight && (isRevealed || isComplete)

  return (
    <div
      ref={messageRef}
      className={cn(
        'relative flex items-start gap-3 mb-4 max-w-[85%]',
        isBull ? 'mr-auto' : 'ml-auto flex-row-reverse'
      )}
    >
      <div
        className={cn(
          'flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full text-lg transition-transform',
          isBull
            ? 'bg-rose-100 dark:bg-rose-900/30'
            : 'bg-indigo-100 dark:bg-indigo-900/30',
          intensity >= 8 && isActive && 'scale-110',
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
          <EmotionIndicator emotion={emotion} side={speakerId} intensity={intensity} />
          <span className="text-xs text-muted-foreground">#{turnNumber}</span>
        </div>

        <div
          className={cn(
            'relative rounded-2xl px-4 py-3 text-sm leading-relaxed transition-all',
            isBull
              ? 'bg-rose-50 dark:bg-rose-950/40 rounded-tl-sm'
              : 'bg-indigo-50 dark:bg-indigo-950/40 rounded-tr-sm',
            showHighlight && 'ring-2 ring-amber-400 dark:ring-amber-500 shadow-lg shadow-amber-100 dark:shadow-amber-900/20',
            intensity >= 8 && isActive && 'animate-subtle-shake',
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

          {/* Audience reaction floating emojis */}
          {audienceReaction && (
            <AudienceReaction
              emoji={audienceReaction}
              trigger={showReaction}
            />
          )}
        </div>

        {/* Highlight quote banner */}
        {showHighlight && highlightQuote && (
          <HighlightQuoteBanner quote={highlightQuote} side={speakerId} />
        )}

        {/* Audience reaction badge (static, after animation) */}
        {audienceReaction && (isRevealed || isComplete) && (
          <div className={cn(
            'mt-1 text-sm opacity-70',
            isBull ? 'self-start' : 'self-end'
          )}>
            {audienceReaction}
          </div>
        )}

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
