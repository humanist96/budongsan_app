'use client'

import { useEffect, useCallback, useRef } from 'react'
import { BOARD_SPACES, DISTRICTS, GAME_CONSTANTS } from '@/data/marble-data'
import { useMarbleGame } from './use-marble-game'
import { MarbleBoard } from './marble-board'
import { MarbleDice } from './marble-dice'
import { MarblePlayerPanel } from './marble-player-panel'
import { MarblePropertyPopup } from './marble-property-popup'
import { MarbleGoldenKeyModal } from './marble-golden-key-modal'
import { MarbleGameLog } from './marble-game-log'
import { MarbleResultOverlay } from './marble-result-overlay'

// --- Intro ---

function MarbleIntro({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-lg space-y-6">
        <div className="text-6xl">🎲</div>
        <h1 className="text-3xl font-black">
          셀럽 부동산
          <br />
          <span className="text-primary">브루마블</span>
        </h1>
        <p className="text-muted-foreground leading-relaxed text-sm">
          서울 14개 구의 실제 셀럽 부동산을 사고 건설하는 보드게임!
          <br />
          아이유의 에테르노, GD의 워너청담, 전지현의 아크로서울포레스트...
          <br />
          과연 셀럽 부동산 왕이 될 수 있을까?
        </p>

        <div className="grid grid-cols-2 gap-3 text-xs text-left max-w-xs mx-auto">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="font-bold mb-1">시작 자금</div>
            <div className="text-muted-foreground">{GAME_CONSTANTS.STARTING_MONEY}억</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="font-bold mb-1">최대 턴</div>
            <div className="text-muted-foreground">{GAME_CONSTANTS.MAX_TURNS}턴</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="font-bold mb-1">보드</div>
            <div className="text-muted-foreground">28칸 (14구)</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="font-bold mb-1">대결</div>
            <div className="text-muted-foreground">1:1 vs AI</div>
          </div>
        </div>

        <button
          onClick={onStart}
          className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 active:scale-95 transition-all shadow-xl"
        >
          게임 시작!
        </button>
      </div>
    </div>
  )
}

// --- Island Prompt ---

function IslandPrompt({
  turnsLeft,
  money,
  onPay,
  onWait,
}: {
  turnsLeft: number
  money: number
  onPay: () => void
  onWait: () => void
}) {
  const canPay = money >= GAME_CONSTANTS.ISLAND_ESCAPE_COST

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border-2 border-cyan-500/40 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
        <div className="bg-cyan-500/10 p-4 text-center border-b border-cyan-500/30">
          <div className="text-4xl mb-2">🏝️</div>
          <h3 className="text-lg font-bold">무인도</h3>
          <p className="text-xs text-muted-foreground">{turnsLeft}턴 남음</p>
        </div>
        <div className="p-4 space-y-3 text-center text-sm">
          <p className="text-muted-foreground">
            {GAME_CONSTANTS.ISLAND_ESCAPE_COST}억을 내고 탈출하거나 대기할 수 있습니다.
          </p>
        </div>
        <div className="flex border-t">
          <button
            onClick={onWait}
            className="flex-1 py-3 text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
          >
            대기 ({turnsLeft - 1}턴 남음)
          </button>
          <button
            onClick={onPay}
            disabled={!canPay}
            className={`flex-1 py-3 text-sm font-bold border-l transition-colors ${
              canPay ? 'text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10' : 'text-muted-foreground cursor-not-allowed'
            }`}
          >
            탈출 (-{GAME_CONSTANTS.ISLAND_ESCAPE_COST}억)
          </button>
        </div>
      </div>
    </div>
  )
}

// --- Event Toast ---

function EventToast({
  message,
  onDismiss,
}: {
  message: string
  onDismiss: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-card border rounded-2xl shadow-xl max-w-xs w-full p-6 text-center space-y-4">
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onDismiss}
          className="px-6 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-colors"
        >
          확인
        </button>
      </div>
    </div>
  )
}

// --- Main Game ---

export function MarblePage() {
  const { state, activePlayer, totalAssets, actions } = useMarbleGame()
  const computerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 컴퓨터 턴 자동 진행
  useEffect(() => {
    if (state.phase !== 'playing') return
    if (state.currentPlayer !== 'computer') return

    const delay = 800

    if (state.turnPhase === 'roll') {
      computerTimerRef.current = setTimeout(() => {
        actions.rollDice()
      }, delay)
    }

    return () => {
      if (computerTimerRef.current) clearTimeout(computerTimerRef.current)
    }
  }, [state.phase, state.currentPlayer, state.turnPhase, actions])

  // 이동 완료 자동 처리
  useEffect(() => {
    if (state.turnPhase === 'moving') {
      const timer = setTimeout(() => {
        actions.finishMove()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [state.turnPhase, actions])

  // 컴퓨터 결정 자동 처리
  useEffect(() => {
    if (state.phase !== 'playing') return
    if (state.currentPlayer !== 'computer') return
    if (state.turnPhase === 'buy-prompt' || state.turnPhase === 'build-prompt' ||
        state.turnPhase === 'golden-key' || state.turnPhase === 'event' ||
        state.turnPhase === 'island') {
      const timer = setTimeout(() => {
        actions.computerAct()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [state.phase, state.currentPlayer, state.turnPhase, actions])

  // 턴 종료 자동 진행
  useEffect(() => {
    if (state.turnPhase === 'turn-end' && state.phase === 'playing') {
      const timer = setTimeout(() => {
        actions.endTurn()
      }, state.currentPlayer === 'computer' ? 600 : 300)
      return () => clearTimeout(timer)
    }
  }, [state.turnPhase, state.phase, state.currentPlayer, actions])

  const handleIslandPay = useCallback(() => {
    actions.escapeIsland(true)
  }, [actions])

  const handleIslandWait = useCallback(() => {
    actions.escapeIsland(false)
  }, [actions])

  // --- Phase: Intro ---
  if (state.phase === 'intro') {
    return <MarbleIntro onStart={actions.startGame} />
  }

  // --- Phase: Result ---
  if (state.phase === 'result' && state.winner) {
    return (
      <>
        <MarbleGameUI state={state} activePlayer={activePlayer} totalAssets={totalAssets} actions={actions} />
        <MarbleResultOverlay
          winner={state.winner}
          player={state.player}
          computer={state.computer}
          totalAssetsFn={totalAssets}
          turn={state.turn}
          onRestart={actions.startGame}
        />
      </>
    )
  }

  // --- Phase: Playing ---
  return (
    <>
      <MarbleGameUI state={state} activePlayer={activePlayer} totalAssets={totalAssets} actions={actions} />

      {/* Modals */}
      {state.turnPhase === 'buy-prompt' && state.currentPlayer === 'player' && (
        <MarblePropertyPopup
          mode="buy"
          player={state.player}
          onConfirm={() => actions.buyProperty(true)}
          onCancel={() => actions.buyProperty(false)}
        />
      )}

      {state.turnPhase === 'build-prompt' && state.currentPlayer === 'player' && (
        <MarblePropertyPopup
          mode="build"
          player={state.player}
          onConfirm={() => actions.build(true)}
          onCancel={() => actions.build(false)}
        />
      )}

      {state.turnPhase === 'golden-key' && state.currentGoldenKey && state.currentPlayer === 'player' && (
        <MarbleGoldenKeyModal
          card={state.currentGoldenKey}
          onDismiss={actions.dismissGoldenKey}
        />
      )}

      {state.turnPhase === 'island' && state.currentPlayer === 'player' && (
        <IslandPrompt
          turnsLeft={state.player.islandTurnsLeft}
          money={state.player.money}
          onPay={handleIslandPay}
          onWait={handleIslandWait}
        />
      )}

      {state.turnPhase === 'event' && state.currentPlayer === 'player' && (
        <EventToast
          message={getEventMessage(state)}
          onDismiss={actions.dismissEvent}
        />
      )}
    </>
  )
}

// --- Game UI Layout ---

interface GameUIProps {
  readonly state: ReturnType<typeof useMarbleGame>['state']
  readonly activePlayer: ReturnType<typeof useMarbleGame>['activePlayer']
  readonly totalAssets: ReturnType<typeof useMarbleGame>['totalAssets']
  readonly actions: ReturnType<typeof useMarbleGame>['actions']
}

function MarbleGameUI({ state, activePlayer, totalAssets, actions }: GameUIProps) {
  const isMyTurn = state.currentPlayer === 'player'
  const canRoll = state.turnPhase === 'roll' && isMyTurn && activePlayer.islandTurnsLeft === 0

  return (
    <div className="container mx-auto px-4 py-4 max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        {/* Left: Board + Dice */}
        <div className="space-y-4">
          <MarbleBoard
            player={state.player}
            computer={state.computer}
            turn={state.turn}
            currentPlayer={state.currentPlayer}
          />
          <div className="flex justify-center">
            <MarbleDice
              dice={state.dice}
              onRoll={actions.rollDice}
              disabled={!canRoll}
              isComputerTurn={!isMyTurn}
            />
          </div>
        </div>

        {/* Right: Panels + Log */}
        <div className="space-y-3">
          <MarblePlayerPanel
            player={state.player}
            isActive={state.currentPlayer === 'player'}
            totalAssetsFn={totalAssets}
          />
          <MarblePlayerPanel
            player={state.computer}
            isActive={state.currentPlayer === 'computer'}
            totalAssetsFn={totalAssets}
          />
          <MarbleGameLog logs={state.logs} />
        </div>
      </div>
    </div>
  )
}

function getEventMessage(state: ReturnType<typeof useMarbleGame>['state']): string {
  const space = BOARD_SPACES[state.player.position]
  switch (space.type) {
    case 'tax':
    case 'fund':
      return `${space.name}: ${space.amount}억`
    case 'olympic':
      return `올림픽 보너스! +${space.amount}억`
    case 'lottery':
      return state.lotteryResult
        ? `복권 ${state.lotteryResult > 0 ? '당첨' : '꽝'}! ${state.lotteryResult > 0 ? '+' : ''}${state.lotteryResult}억`
        : '복권!'
    case 'bonus':
      return `셀럽 만남! +${space.amount}억`
    default:
      return space.name
  }
}
