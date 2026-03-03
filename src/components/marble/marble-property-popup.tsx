'use client'

import { DISTRICTS, BOARD_SPACES, getRent, getMaxBuildings, getGradeColor, getGradeBg } from '@/data/marble-data'
import type { PlayerState } from './use-marble-game'

interface MarblePropertyPopupProps {
  readonly mode: 'buy' | 'build'
  readonly player: PlayerState
  readonly onConfirm: () => void
  readonly onCancel: () => void
}

export function MarblePropertyPopup({ mode, player, onConfirm, onCancel }: MarblePropertyPopupProps) {
  const space = BOARD_SPACES[player.position]
  const dKey = space.districtKey
  if (!dKey) return null

  const district = DISTRICTS[dKey]
  if (!district) return null

  const currentBuildings = player.properties[dKey] ?? 0
  const maxBuildings = getMaxBuildings(dKey)
  const isBuy = mode === 'buy'

  const cost = isBuy
    ? player.nextBuyHalf ? Math.round(district.price / 2) : district.price
    : district.buildCost

  const canAfford = player.money >= cost
  const nextBuildingName = !isBuy && district.buildings[currentBuildings]
    ? district.buildings[currentBuildings]
    : null

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
            </>
          ) : (
            <>
              <div className="text-sm text-muted-foreground">
                건물을 건설하시겠습니까?
              </div>
              {nextBuildingName && (
                <div className="bg-muted/50 rounded-lg p-3 text-sm">
                  <div className="font-bold">{nextBuildingName.name}</div>
                  {nextBuildingName.celeb && (
                    <div className="text-xs text-muted-foreground">
                      소유 셀럽: {nextBuildingName.celeb}
                    </div>
                  )}
                </div>
              )}
              <div className="text-[11px] text-muted-foreground">
                건물 {currentBuildings}/{maxBuildings}
              </div>
            </>
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
                    {b.name}{b.celeb ? `(${b.celeb})` : ''}:
                  </span>
                  <span className="text-right font-medium">{getRent(dKey, i + 1)}억</span>
                </div>
              ))}
            </div>
          </div>

          {/* 비용 */}
          <div className="flex items-center justify-between text-sm border-t pt-3">
            <span className="text-muted-foreground">{isBuy ? '매수 비용' : '건설 비용'}</span>
            <span className="font-bold text-lg">
              {cost}억
              {isBuy && player.nextBuyHalf && (
                <span className="text-xs text-muted-foreground line-through ml-1">
                  {district.price}억
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>보유 현금</span>
            <span className={canAfford ? 'text-green-500' : 'text-red-500'}>
              {player.money}억
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex border-t">
          <button
            onClick={onCancel}
            className="flex-1 py-3 text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
          >
            포기
          </button>
          <button
            onClick={onConfirm}
            disabled={!canAfford}
            className={`
              flex-1 py-3 text-sm font-bold border-l transition-colors
              ${canAfford
                ? 'text-primary hover:bg-primary/10'
                : 'text-muted-foreground cursor-not-allowed'
              }
            `}
          >
            {isBuy ? '매수!' : '건설!'}
          </button>
        </div>
      </div>
    </div>
  )
}
