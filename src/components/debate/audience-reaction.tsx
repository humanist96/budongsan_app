'use client'

import { useState, useEffect } from 'react'

interface AudienceReactionProps {
  emoji: string
  trigger: boolean
}

interface FloatingEmoji {
  id: number
  x: number
  delay: number
  duration: number
  size: number
}

export function AudienceReaction({ emoji, trigger }: AudienceReactionProps) {
  const [emojis, setEmojis] = useState<FloatingEmoji[]>([])

  useEffect(() => {
    if (!trigger) return

    const newEmojis: FloatingEmoji[] = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: 10 + Math.random() * 80,
      delay: Math.random() * 400,
      duration: 1200 + Math.random() * 800,
      size: 16 + Math.random() * 12,
    }))

    setEmojis(newEmojis)

    const timer = setTimeout(() => setEmojis([]), 2500)
    return () => clearTimeout(timer)
  }, [trigger])

  if (emojis.length === 0) return null

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {emojis.map((e) => (
        <span
          key={e.id}
          className="absolute animate-float-up"
          style={{
            left: `${e.x}%`,
            bottom: 0,
            fontSize: `${e.size}px`,
            animationDelay: `${e.delay}ms`,
            animationDuration: `${e.duration}ms`,
          }}
        >
          {emoji}
        </span>
      ))}
    </div>
  )
}
