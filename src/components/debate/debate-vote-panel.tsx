'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useDebateStore } from '@/stores/debate-store'
import type { DebateData, DebateSide } from '@/types/debate'
import { cn } from '@/lib/utils'

interface DebateVotePanelProps {
  checkpoint: 'mid' | 'final'
  data: DebateData
  slug: string
}

function getStorageKey(slug: string, checkpoint: string) {
  return `debate-vote-${slug}-${checkpoint}`
}

function loadVote(slug: string, checkpoint: string): DebateSide | null {
  try {
    const saved = localStorage.getItem(getStorageKey(slug, checkpoint))
    if (saved === 'bull' || saved === 'bear') return saved
  } catch {
    // SSR safe
  }
  return null
}

function saveVote(slug: string, checkpoint: string, side: DebateSide) {
  try {
    localStorage.setItem(getStorageKey(slug, checkpoint), side)
  } catch {
    // SSR safe
  }
}

export function DebateVotePanel({ checkpoint, data, slug }: DebateVotePanelProps) {
  const vote = useDebateStore((s) => s.vote)
  const [selected, setSelected] = useState<DebateSide | null>(null)
  const [bull, bear] = data.personas

  useEffect(() => {
    setSelected(loadVote(slug, checkpoint))
  }, [slug, checkpoint])

  const handleVote = (side: DebateSide) => {
    setSelected(side)
    saveVote(slug, checkpoint, side)
    vote(side)
  }

  return (
    <div className="mx-auto max-w-md my-6 p-4 rounded-xl border bg-card text-center">
      <p className="text-sm font-medium mb-4">
        {checkpoint === 'mid'
          ? '중간 점검: 누가 이기고 있을까요?'
          : '최종 투표: 누구의 주장이 더 설득력 있었나요?'}
      </p>

      {selected === null ? (
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            className="flex-1 gap-2 border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            onClick={() => handleVote('bull')}
          >
            {bull.emoji} {bull.name}
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-2 border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
            onClick={() => handleVote('bear')}
          >
            {bear.emoji} {bear.name}
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex h-6 rounded-full overflow-hidden">
            <div
              className={cn(
                'bg-rose-400 transition-all duration-700 flex items-center justify-center text-xs text-white font-medium',
                selected === 'bull' ? 'flex-[6]' : 'flex-[4]'
              )}
            >
              {bull.emoji}
            </div>
            <div
              className={cn(
                'bg-indigo-400 transition-all duration-700 flex items-center justify-center text-xs text-white font-medium',
                selected === 'bear' ? 'flex-[6]' : 'flex-[4]'
              )}
            >
              {bear.emoji}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {selected === 'bull' ? bull.name : bear.name} 에 투표하셨습니다
          </p>
        </div>
      )}
    </div>
  )
}
