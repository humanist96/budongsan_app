'use client'

import { DISTRICTS, getSpaceIcon, getGradeBg, type BoardSpace } from '@/data/marble-data'
import type { PlayerState } from './use-marble-game'

interface MarbleBoardSpaceProps {
  readonly space: BoardSpace
  readonly player: PlayerState
  readonly computer: PlayerState
  readonly onClick?: () => void
}

function OwnerDot({ owner }: { owner: 'player' | 'computer' | null }) {
  if (!owner) return null
  return (
    <div
      className={`absolute top-0.5 right-0.5 w-2 h-2 rounded-full ${
        owner === 'player' ? 'bg-blue-500' : 'bg-red-500'
      }`}
    />
  )
}

function BuildingDots({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <div className="flex gap-0.5 justify-center mt-0.5">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="w-1.5 h-1.5 rounded-sm bg-yellow-400" />
      ))}
    </div>
  )
}

export function MarbleBoardSpace({ space, player, computer, onClick }: MarbleBoardSpaceProps) {
  const playerHere = player.position === space.index
  const computerHere = computer.position === space.index

  const district = space.districtKey ? DISTRICTS[space.districtKey] : null
  const ownerIsPlayer = space.districtKey && player.properties[space.districtKey] !== undefined
  const ownerIsComputer = space.districtKey && computer.properties[space.districtKey] !== undefined
  const owner = ownerIsPlayer ? 'player' : ownerIsComputer ? 'computer' : null
  const buildingCount = owner === 'player'
    ? (player.properties[space.districtKey!] ?? 0)
    : owner === 'computer'
      ? (computer.properties[space.districtKey!] ?? 0)
      : 0

  const gradeClass = district ? getGradeBg(district.grade) : ''

  return (
    <button
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center
        w-full h-full min-h-[52px] p-0.5
        border border-border/50 rounded-md
        text-[10px] leading-tight text-center
        transition-all duration-200
        hover:brightness-110 hover:scale-[1.02]
        ${space.type === 'property' ? gradeClass : 'bg-muted/40'}
        ${space.type === 'start' ? 'bg-emerald-500/20 border-emerald-500/40' : ''}
        ${space.type === 'desert-island' ? 'bg-cyan-500/20 border-cyan-500/40' : ''}
        ${space.type === 'space-travel' ? 'bg-indigo-500/20 border-indigo-500/40' : ''}
        ${space.type === 'olympic' ? 'bg-yellow-500/20 border-yellow-500/40' : ''}
        ${space.type === 'golden-key' ? 'bg-amber-500/20 border-amber-500/40' : ''}
        ${space.type === 'tax' || space.type === 'fund' ? 'bg-red-500/10 border-red-500/30' : ''}
        ${space.type === 'lottery' ? 'bg-pink-500/20 border-pink-500/40' : ''}
        ${space.type === 'go-to-island' ? 'bg-teal-500/20 border-teal-500/40' : ''}
        ${space.type === 'bonus' ? 'bg-emerald-500/20 border-emerald-500/40' : ''}
      `}
    >
      <OwnerDot owner={owner} />

      <span className="text-xs">{getSpaceIcon(space.type)}</span>
      <span className="font-medium truncate w-full px-0.5">
        {district ? district.name : space.name}
      </span>
      {district && (
        <span className="text-[9px] text-muted-foreground">{district.price}억</span>
      )}
      {space.amount && !district && (
        <span className="text-[9px] text-muted-foreground">
          {space.amount > 0 ? '+' : ''}{space.amount}억
        </span>
      )}

      <BuildingDots count={buildingCount} />

      {/* 플레이어 토큰 */}
      <div className="flex gap-0.5 mt-0.5">
        {playerHere && (
          <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white text-[8px] text-white flex items-center justify-center font-bold shadow-md">
            P
          </div>
        )}
        {computerHere && (
          <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white text-[8px] text-white flex items-center justify-center font-bold shadow-md">
            C
          </div>
        )}
      </div>
    </button>
  )
}
