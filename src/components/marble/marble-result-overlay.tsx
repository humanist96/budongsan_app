'use client'

import type { PlayerState } from './use-marble-game'

interface MarbleResultOverlayProps {
  readonly winner: 'player' | 'computer'
  readonly player: PlayerState
  readonly computer: PlayerState
  readonly totalAssetsFn: (p: PlayerState) => number
  readonly turn: number
  readonly onRestart: () => void
}

export function MarbleResultOverlay({
  winner,
  player,
  computer,
  totalAssetsFn,
  turn,
  onRestart,
}: MarbleResultOverlayProps) {
  const playerAssets = totalAssetsFn(player)
  const computerAssets = totalAssetsFn(computer)
  const isPlayerWin = winner === 'player'
  const isBankrupt = player.bankrupt || computer.bankrupt

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-card border-2 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border-primary/30">
        {/* Header */}
        <div
          className={`p-6 text-center ${
            isPlayerWin
              ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20'
              : 'bg-gradient-to-br from-red-500/20 to-orange-500/20'
          }`}
        >
          <div className="text-5xl mb-3">
            {isPlayerWin ? '🏆' : '😢'}
          </div>
          <h2 className="text-2xl font-black">
            {isPlayerWin ? '승리!' : '패배...'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isBankrupt
              ? `${winner === 'player' ? '컴퓨터' : '플레이어'} 파산!`
              : `${turn}턴 종료 - 총자산 비교`
            }
          </p>
        </div>

        {/* Stats */}
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Player */}
            <div className={`rounded-xl p-3 text-center ${isPlayerWin ? 'bg-blue-500/10 ring-2 ring-blue-500/30' : 'bg-muted/50'}`}>
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                P
              </div>
              <div className="text-xs text-muted-foreground">플레이어</div>
              <div className="text-xl font-black mt-1">{playerAssets}억</div>
              <div className="text-[10px] text-muted-foreground mt-1">
                현금 {player.money}억 · 부동산 {Object.keys(player.properties).length}개
              </div>
            </div>

            {/* Computer */}
            <div className={`rounded-xl p-3 text-center ${!isPlayerWin ? 'bg-red-500/10 ring-2 ring-red-500/30' : 'bg-muted/50'}`}>
              <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                C
              </div>
              <div className="text-xs text-muted-foreground">컴퓨터</div>
              <div className="text-xl font-black mt-1">{computerAssets}억</div>
              <div className="text-[10px] text-muted-foreground mt-1">
                현금 {computer.money}억 · 부동산 {Object.keys(computer.properties).length}개
              </div>
            </div>
          </div>

          {/* Property details */}
          {isPlayerWin && Object.keys(player.properties).length > 0 && (
            <div className="text-center text-xs text-muted-foreground">
              수집한 셀럽 부동산으로 서울을 제패했습니다!
            </div>
          )}
        </div>

        {/* Action */}
        <div className="p-4 border-t">
          <button
            onClick={onRestart}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg"
          >
            다시 플레이
          </button>
        </div>
      </div>
    </div>
  )
}
