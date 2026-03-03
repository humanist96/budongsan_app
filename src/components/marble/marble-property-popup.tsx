'use client'

import { DISTRICTS, BOARD_SPACES, getRent, getMaxBuildings, getGradeColor, getGradeBg } from '@/data/marble-data'
import type { PlayerState } from './use-marble-game'

interface MarblePropertyPopupProps {
  readonly mode: 'buy' | 'build'
  readonly player: PlayerState
  readonly onBuy: () => void
  readonly onBuild: (buildingIndex: number) => void
  readonly onCancel: () => void
}

export function MarblePropertyPopup({ mode, player, onBuy, onBuild, onCancel }: MarblePropertyPopupProps) {
  const space = BOARD_SPACES[player.position]
  const dKey = space.districtKey
  if (!dKey) return null

  const district = DISTRICTS[dKey]
  if (!district) return null

  const builtIndices = player.properties[dKey] ?? []
  const maxBuildings = getMaxBuildings(dKey)
  const isBuy = mode === 'buy'

  const buyCost = isBuy
    ? player.nextBuyHalf ? Math.round(district.price / 2) : district.price
    : 0

  const canAffordBuy = player.money >= buyCost
  const canAffordBuild = player.money >= district.buildCost

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border-2 border-primary/30 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
        {/* Header */}
        <div className={`p-4 ${getGradeBg(district.grade)} border-b`}>
          <div className="flex items-center justify-between">
            <div>
              <span className={`text-xs font-bold ${getGradeColor(district.grade)}`}>
                {district.grade}등급
              </span>
              <h3 className="text-xl font-bold">{district.name}</h3>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">땅값</div>
              <div className="text-lg font-bold">{district.price}억</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {isBuy ? (
            <>
              <div className="text-sm text-muted-foreground">
                이 구를 매수하시겠습니까?
              </div>
              {player.nextBuyHalf && (
                <div className="text-sm text-amber-500 font-medium">
                  서장훈식 경매 효과! 반값 매수!
                </div>
              )}

              {/* 임대료 정보 */}
              <div className="bg-muted/30 rounded-lg p-3 space-y-1">
                <div className="text-[11px] font-medium text-muted-foreground">임대료 정보</div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <span>기본:</span>
                  <span className="text-right font-medium">{getRent(dKey, 0)}억</span>
                  {district.buildings.map((b, i) => (
                    <div key={b.name} className="contents">
                      <span className="truncate">
                        +{b.name}:
                      </span>
                      <span className="text-right font-medium">{getRent(dKey, i + 1)}억</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 비용 */}
              <div className="flex items-center justify-between text-sm border-t pt-3">
                <span className="text-muted-foreground">매수 비용</span>
                <span className="font-bold text-lg">
                  {buyCost}억
                  {player.nextBuyHalf && (
                    <span className="text-xs text-muted-foreground line-through ml-1">
                      {district.price}억
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>보유 현금</span>
                <span className={canAffordBuy ? 'text-green-500' : 'text-red-500'}>
                  {player.money}억
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={onCancel}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-muted-foreground bg-muted/50 hover:bg-muted transition-colors"
                >
                  포기
                </button>
                <button
                  onClick={onBuy}
                  disabled={!canAffordBuy}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    canAffordBuy
                      ? 'bg-primary text-primary-foreground hover:opacity-90'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  매수!
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-sm text-muted-foreground">
                건설할 셀럽 부동산을 선택하세요
              </div>
              <div className="text-[11px] text-muted-foreground">
                건물 {builtIndices.length}/{maxBuildings} · 건설비 {district.buildCost}억
              </div>

              {/* 건물 선택 리스트 */}
              <div className="space-y-2">
                {district.buildings.map((b, i) => {
                  const isBuilt = builtIndices.includes(i)
                  const canBuild = !isBuilt && canAffordBuild
                  return (
                    <button
                      key={i}
                      onClick={() => canBuild && onBuild(i)}
                      disabled={!canBuild}
                      className={`w-full text-left rounded-xl p-3 border-2 transition-all ${
                        isBuilt
                          ? 'border-green-500/40 bg-green-500/10 cursor-default'
                          : canBuild
                            ? 'border-primary/30 bg-card hover:border-primary/60 hover:bg-primary/5 active:scale-[0.98]'
                            : 'border-border bg-muted/30 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {isBuilt ? '✅' : '🏗️'}
                          </span>
                          <div>
                            <div className="text-sm font-bold">{b.name}</div>
                            {b.celeb && (
                              <div className="text-[11px] text-muted-foreground">
                                {b.celeb}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right text-xs">
                          {isBuilt ? (
                            <span className="text-green-500 font-medium">건설 완료</span>
                          ) : (
                            <span className="text-muted-foreground">임대료 {getRent(dKey, builtIndices.length + 1)}억</span>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span>보유 현금</span>
                <span className={canAffordBuild ? 'text-green-500' : 'text-red-500'}>
                  {player.money}억
                </span>
              </div>

              <button
                onClick={onCancel}
                className="w-full py-2.5 rounded-xl text-sm font-medium text-muted-foreground bg-muted/50 hover:bg-muted transition-colors"
              >
                건설 안 함
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
