'use client'

import { BOARD_SPACES } from '@/data/marble-data'
import type { PlayerState } from './use-marble-game'
import { MarbleBoardSpace } from './marble-board-space'

interface MarbleBoardProps {
  readonly player: PlayerState
  readonly computer: PlayerState
  readonly turn: number
  readonly currentPlayer: 'player' | 'computer'
}

/**
 * 8×8 CSS Grid 보드 레이아웃
 *
 *   row 0: [21] [20] [19] [18] [17] [16] [15] [14]
 *   row 1: [27]  -    -    -    -    -    -   [13]
 *   row 2: [26]  -    -    -    -    -    -   [12]
 *   row 3: [25]  -    -  CENTER  -    -    -   [11]
 *   row 4: [24]  -    -    -    -    -    -   [10]
 *   row 5: [23]  -    -    -    -    -    -   [ 9]
 *   row 6: [22]  -    -    -    -    -    -   [ 8]
 *   row 7: [ 0] [ 1] [ 2] [ 3] [ 4] [ 5] [ 6] [ 7]
 */

function getGridPosition(index: number): { row: number; col: number } {
  if (index <= 6) {
    return { row: 7, col: index }
  }
  if (index <= 13) {
    return { row: 7 - (index - 7), col: 7 }
  }
  if (index <= 20) {
    return { row: 0, col: 7 - (index - 14) }
  }
  return { row: index - 21, col: 0 }
}

export function MarbleBoard({ player, computer, turn, currentPlayer }: MarbleBoardProps) {
  const gridMap = new Map<string, number>()
  for (const space of BOARD_SPACES) {
    const { row, col } = getGridPosition(space.index)
    gridMap.set(`${row}-${col}`, space.index)
  }

  return (
    <div className="w-full max-w-[600px] mx-auto aspect-square relative">
      <div className="grid grid-cols-8 grid-rows-8 gap-0.5 w-full h-full">
        {Array.from({ length: 64 }, (_, i) => {
          const row = Math.floor(i / 8)
          const col = i % 8
          const key = `${row}-${col}`
          const spaceIndex = gridMap.get(key)

          if (spaceIndex !== undefined) {
            const space = BOARD_SPACES[spaceIndex]
            return (
              <MarbleBoardSpace
                key={space.index}
                space={space}
                player={player}
                computer={computer}
              />
            )
          }

          return <div key={key} />
        })}
      </div>

      {/* Center overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center justify-center text-center bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20 px-6 py-4">
          <div className="text-xl font-black text-primary">브루마블</div>
          <div className="text-[11px] text-muted-foreground mt-1">
            셀럽 부동산
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            {turn}턴 · {currentPlayer === 'player' ? '내 차례' : '컴퓨터 차례'}
          </div>
          <div className="flex gap-3 mt-2 text-[11px]">
            <span className="text-blue-500 font-bold">P: {player.money}억</span>
            <span className="text-red-500 font-bold">C: {computer.money}억</span>
          </div>
        </div>
      </div>
    </div>
  )
}
