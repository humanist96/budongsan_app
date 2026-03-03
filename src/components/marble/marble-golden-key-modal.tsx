'use client'

import type { GoldenKeyCard } from '@/data/marble-data'

interface MarbleGoldenKeyModalProps {
  readonly card: GoldenKeyCard
  readonly onDismiss: () => void
}

function getEffectLabel(card: GoldenKeyCard): string {
  const e = card.effect
  switch (e.type) {
    case 'money':
      return e.amount > 0 ? `+${e.amount}억` : `${e.amount}억`
    case 'money-per-property':
      return `부동산 1개당 ${e.amountPerProperty}억`
    case 'money-per-building':
      return `건물 1개당 +${e.amountPerBuilding}억`
    case 'move-to':
      return e.collectSalary ? '출발로 이동 (+30억)' : '이동!'
    case 'both-lose':
      return `양쪽 -${e.amount}억`
    case 'next-buy-half':
      return '다음 매수 50% 할인'
    case 'conditional-bonus':
      return `최대 +${e.bonus}억`
  }
}

function getEffectColor(card: GoldenKeyCard): string {
  const e = card.effect
  switch (e.type) {
    case 'money':
      return e.amount > 0 ? 'text-green-500' : 'text-red-500'
    case 'money-per-property':
      return e.amountPerProperty > 0 ? 'text-green-500' : 'text-red-500'
    case 'money-per-building':
      return 'text-green-500'
    case 'move-to':
      return 'text-blue-500'
    case 'both-lose':
      return 'text-red-500'
    case 'next-buy-half':
      return 'text-amber-500'
    case 'conditional-bonus':
      return 'text-green-500'
  }
}

export function MarbleGoldenKeyModal({ card, onDismiss }: MarbleGoldenKeyModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border-2 border-amber-500/40 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 p-4 text-center border-b border-amber-500/30">
          <div className="text-4xl mb-2">🔑</div>
          <h3 className="text-sm font-medium text-amber-600 dark:text-amber-400">
            황금열쇠
          </h3>
        </div>

        {/* Card Content */}
        <div className="p-6 text-center space-y-3">
          <h4 className="text-xl font-bold">{card.title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {card.description}
          </p>
          <div className={`text-2xl font-black ${getEffectColor(card)}`}>
            {getEffectLabel(card)}
          </div>
        </div>

        {/* Action */}
        <div className="border-t p-3">
          <button
            onClick={onDismiss}
            className="w-full py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 font-bold text-sm transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  )
}
