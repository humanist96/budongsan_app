'use client'

import { useRef, useEffect, useState } from 'react'
import type {
  DebatePersona,
  DebateSide,
  DebateEmotion,
  AudienceReaction as AudienceReactionType,
} from '@/types/debate'
import { EMOTION_EMOJI } from '@/types/debate'
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

const EMOTION_LABEL: Record<DebateEmotion, string> = {
  calm: '차분',
  confident: '자신만만',
  excited: '흥분',
  angry: '분노',
  sarcastic: '비꼼',
  defensive: '방어',
  amused: '웃음',
  passionate: '열정',
  shocked: '충격',
  dismissive: '무시',
  pleading: '호소',
}

/** Intensity level determines bubble border color */
function getIntensityStyle(intensity: number, isBull: boolean) {
  if (intensity <= 3) return ''
  if (intensity <= 5) {
    return isBull
      ? 'border-l-4 border-l-rose-300 dark:border-l-rose-700'
      : 'border-r-4 border-r-indigo-300 dark:border-r-indigo-700'
  }
  if (intensity <= 7) {
    return isBull
      ? 'border-l-4 border-l-orange-400 dark:border-l-orange-600'
      : 'border-r-4 border-r-orange-400 dark:border-r-orange-600'
  }
  return isBull
    ? 'border-l-4 border-l-red-500 dark:border-l-red-500'
    : 'border-r-4 border-r-red-500 dark:border-r-red-500'
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
      const timer = setTimeout(() => setShowReaction(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isComplete, isRevealed, audienceReaction])

  const isBull = speakerId === 'bull'
  const textToDisplay = isRevealed ? content : displayedText
  const showHighlight = isHighlight && (isRevealed || isComplete)
  const emotionEmoji = EMOTION_EMOJI[emotion][speakerId]

  return (
    <div
      ref={messageRef}
      className={cn(
        'relative flex items-start gap-3 mb-5 max-w-[88%]',
        isBull ? 'mr-auto' : 'ml-auto flex-row-reverse',
      )}
    >
      {/* Avatar with emotion overlay */}
      <div className="relative flex-shrink-0">
        <div
          className={cn(
            'flex items-center justify-center w-11 h-11 rounded-full text-lg transition-all duration-300',
            isBull
              ? 'bg-rose-100 dark:bg-rose-900/30'
              : 'bg-indigo-100 dark:bg-indigo-900/30',
            intensity >= 7 && 'scale-110',
            intensity >= 9 && 'scale-125',
          )}
        >
          {persona.emoji}
        </div>
        {/* Emotion emoji floating on avatar */}
        <span
          className={cn(
            'absolute -bottom-1 -right-1 text-sm leading-none',
            'bg-background rounded-full shadow-sm',
            intensity >= 7 && 'animate-bounce',
          )}
        >
          {emotionEmoji}
        </span>
      </div>

      <div className={cn('flex flex-col', isBull ? 'items-start' : 'items-end')}>
        {/* Speaker info + emotion tag */}
        <div
          className={cn(
            'flex items-center gap-2 mb-1',
            isBull ? '' : 'flex-row-reverse',
          )}
        >
          <span className="text-sm font-semibold">{persona.name}</span>
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
              emotion === 'angry' && 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
              emotion === 'excited' && 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
              emotion === 'confident' && 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
              emotion === 'sarcastic' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
              emotion === 'passionate' && 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
              emotion === 'shocked' && 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300',
              emotion === 'dismissive' && 'bg-slate-100 text-slate-600 dark:bg-slate-800/40 dark:text-slate-300',
              emotion === 'defensive' && 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
              emotion === 'amused' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
              emotion === 'pleading' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
              emotion === 'calm' && 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
            )}
          >
            {emotionEmoji} {EMOTION_LABEL[emotion]}
          </span>
        </div>

        {/* Message bubble */}
        <div
          className={cn(
            'relative rounded-2xl px-4 py-3 text-sm leading-relaxed transition-all duration-300',
            isBull
              ? 'bg-rose-50 dark:bg-rose-950/40 rounded-tl-sm'
              : 'bg-indigo-50 dark:bg-indigo-950/40 rounded-tr-sm',
            getIntensityStyle(intensity, isBull),
            showHighlight &&
              'ring-2 ring-amber-400 dark:ring-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.3)] dark:shadow-[0_0_15px_rgba(251,191,36,0.2)]',
            intensity >= 8 && isActive && 'animate-subtle-shake',
          )}
        >
          {isActive && !isRevealed && textToDisplay.length === 0 ? (
            <TypingDots />
          ) : (
            <DebateHighlight text={textToDisplay} side={speakerId} />
          )}
        </div>

        {/* Highlight quote banner - prominent golden callout */}
        {showHighlight && highlightQuote && (
          <div className="mt-2 animate-in slide-in-from-bottom-2 duration-300">
            <div
              className={cn(
                'flex items-start gap-2 rounded-xl px-4 py-3',
                'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/40 dark:to-yellow-950/40',
                'border border-amber-300 dark:border-amber-700',
                'shadow-md shadow-amber-100/50 dark:shadow-amber-900/20',
              )}
            >
              <span className="text-xl leading-none mt-0.5">&#x2B50;</span>
              <div>
                <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-0.5">
                  명장면
                </div>
                <div className="text-sm font-semibold text-amber-800 dark:text-amber-200 italic">
                  &ldquo;{highlightQuote}&rdquo;
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audience reaction - large emoji burst */}
        {audienceReaction && (isRevealed || isComplete) && (
          <div
            className={cn(
              'mt-1.5 flex items-center gap-1 rounded-full px-2.5 py-1',
              'bg-muted/60',
              showReaction && 'animate-in zoom-in-50 duration-300',
            )}
          >
            <span className="text-lg">{audienceReaction}</span>
            <span className="text-lg">{audienceReaction}</span>
            <span className="text-lg">{audienceReaction}</span>
          </div>
        )}

        {isActive && !isComplete && !isRevealed && (
          <div className="mt-1">
            <div className="h-0.5 bg-muted rounded-full overflow-hidden w-24">
              <div
                className={cn(
                  'h-full transition-all duration-100 rounded-full',
                  isBull ? 'bg-rose-400' : 'bg-indigo-400',
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
