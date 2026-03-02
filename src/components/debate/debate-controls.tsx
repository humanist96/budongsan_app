'use client'

import {
  SkipBack,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useDebateStore } from '@/stores/debate-store'
import type { PlaybackSpeed } from '@/types/debate'
import { cn } from '@/lib/utils'

const SPEEDS: PlaybackSpeed[] = [0.5, 1, 1.5, 2]

export function DebateControls() {
  const {
    currentTurnIndex,
    isPlaying,
    playbackSpeed,
    showSummary,
    togglePlay,
    setSpeed,
    nextTurn,
    prevTurn,
    skipToTurn,
    reset,
  } = useDebateStore()

  return (
    <div className="sticky bottom-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-2xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Badge variant="outline" className="text-xs tabular-nums shrink-0">
            Turn {currentTurnIndex + 1}/50
          </Badge>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={prevTurn}
              disabled={currentTurnIndex <= 0}
              aria-label="이전 턴"
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            {showSummary ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={reset}
                aria-label="다시 보기"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={togglePlay}
                aria-label={isPlaying ? '일시정지' : '재생'}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={nextTurn}
              disabled={currentTurnIndex >= 49 || showSummary}
              aria-label="다음 턴"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1">
            {SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={cn(
                  'px-2 py-0.5 rounded text-xs font-medium transition-colors',
                  playbackSpeed === s
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={49}
          value={currentTurnIndex}
          onChange={(e) => skipToTurn(Number(e.target.value))}
          className="mt-2 w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
          aria-label="턴 이동"
        />
      </div>
    </div>
  )
}
