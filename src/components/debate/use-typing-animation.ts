'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { PlaybackSpeed } from '@/types/debate'

interface TypingConfig {
  charsPerTick: number
  intervalMs: number
}

const SPEED_CONFIG: Record<PlaybackSpeed, TypingConfig> = {
  0.5: { charsPerTick: 1, intervalMs: 40 },
  1: { charsPerTick: 2, intervalMs: 25 },
  1.5: { charsPerTick: 3, intervalMs: 20 },
  2: { charsPerTick: 5, intervalMs: 15 },
}

interface UseTypingAnimationOptions {
  text: string
  isActive: boolean
  speed: PlaybackSpeed
  onComplete: () => void
}

interface UseTypingAnimationReturn {
  displayedText: string
  isComplete: boolean
  progress: number
  skipToEnd: () => void
}

export function useTypingAnimation({
  text,
  isActive,
  speed,
  onComplete,
}: UseTypingAnimationOptions): UseTypingAnimationReturn {
  const [charIndex, setCharIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const onCompleteRef = useRef(onComplete)
  const textRef = useRef(text)

  onCompleteRef.current = onComplete
  textRef.current = text

  useEffect(() => {
    setCharIndex(0)
    setIsComplete(false)
  }, [text])

  useEffect(() => {
    if (!isActive || isComplete) return

    const config = SPEED_CONFIG[speed]
    const interval = setInterval(() => {
      setCharIndex((prev) => {
        const next = prev + config.charsPerTick
        if (next >= textRef.current.length) {
          clearInterval(interval)
          setIsComplete(true)
          onCompleteRef.current()
          return textRef.current.length
        }
        return next
      })
    }, config.intervalMs)

    return () => clearInterval(interval)
  }, [isActive, isComplete, speed])

  const skipToEnd = useCallback(() => {
    setCharIndex(text.length)
    setIsComplete(true)
    onCompleteRef.current()
  }, [text.length])

  return {
    displayedText: text.slice(0, charIndex),
    isComplete,
    progress: text.length > 0 ? charIndex / text.length : 0,
    skipToEnd,
  }
}
