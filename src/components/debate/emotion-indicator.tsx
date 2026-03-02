'use client'

import type { DebateEmotion, DebateSide } from '@/types/debate'
import { EMOTION_EMOJI } from '@/types/debate'
import { cn } from '@/lib/utils'

const EMOTION_LABELS: Record<DebateEmotion, string> = {
  calm: '차분',
  confident: '자신감',
  excited: '흥분',
  angry: '분노',
  sarcastic: '비꼼',
  defensive: '방어',
  amused: '재미',
  passionate: '열정',
  shocked: '충격',
  dismissive: '무시',
  pleading: '호소',
}

const EMOTION_COLORS: Record<DebateEmotion, string> = {
  calm: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  confident: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  excited: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  angry: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  sarcastic: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  defensive: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  amused: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  passionate: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  shocked: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300',
  dismissive: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300',
  pleading: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
}

interface EmotionIndicatorProps {
  emotion: DebateEmotion
  side: DebateSide
  intensity: number
}

export function EmotionIndicator({ emotion, side, intensity }: EmotionIndicatorProps) {
  const emoji = EMOTION_EMOJI[emotion][side]
  const label = EMOTION_LABELS[emotion]
  const colorClass = EMOTION_COLORS[emotion]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium transition-all',
        colorClass,
        intensity >= 7 && 'animate-pulse'
      )}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </span>
  )
}
