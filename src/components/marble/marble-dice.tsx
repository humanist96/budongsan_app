'use client'

import { useState, useCallback } from 'react'

interface MarbleDiceProps {
  readonly dice: readonly [number, number]
  readonly onRoll: () => void
  readonly disabled: boolean
  readonly isComputerTurn: boolean
}

const diceFaces: Record<number, string> = {
  1: '⚀',
  2: '⚁',
  3: '⚂',
  4: '⚃',
  5: '⚄',
  6: '⚅',
}

export function MarbleDice({ dice, onRoll, disabled, isComputerTurn }: MarbleDiceProps) {
  const [rolling, setRolling] = useState(false)

  const handleRoll = useCallback(() => {
    if (disabled || rolling) return
    setRolling(true)
    setTimeout(() => {
      onRoll()
      setRolling(false)
    }, 600)
  }, [disabled, rolling, onRoll])

  const isDouble = dice[0] === dice[1]

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-4">
        <div
          className={`
            text-5xl select-none transition-transform duration-300
            ${rolling ? 'animate-bounce' : ''}
          `}
        >
          {diceFaces[dice[0]]}
        </div>
        <div
          className={`
            text-5xl select-none transition-transform duration-300
            ${rolling ? 'animate-bounce [animation-delay:100ms]' : ''}
          `}
        >
          {diceFaces[dice[1]]}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-lg font-bold">
          {dice[0]} + {dice[1]} = {dice[0] + dice[1]}
        </span>
        {isDouble && !rolling && (
          <span className="text-xs bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded-full font-medium">
            더블!
          </span>
        )}
      </div>

      {!isComputerTurn && (
        <button
          onClick={handleRoll}
          disabled={disabled || rolling}
          className={`
            px-6 py-3 rounded-xl text-sm font-bold
            transition-all duration-200
            ${disabled || rolling
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:opacity-90 active:scale-95 shadow-lg'
            }
          `}
        >
          {rolling ? '굴리는 중...' : '주사위 굴리기 🎲'}
        </button>
      )}
    </div>
  )
}
