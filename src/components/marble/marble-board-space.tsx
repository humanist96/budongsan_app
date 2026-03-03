'use client'

import { DISTRICTS, getSpaceIcon, getGradeBg, type BoardSpace } from '@/data/marble-data'
import type { PlayerState } from './use-marble-game'

interface MarbleBoardSpaceProps {
  readonly space: BoardSpace
  readonly player: PlayerState
  readonly computer: PlayerState
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

function BuildingIndicators({
  builtIndices,
  districtKey,
}: {
  builtIndices: readonly number[]
  districtKey: string
}) {
  if (builtIndices.length === 0) return null
  const district = DISTRICTS[districtKey]
  if (!district) return null

  return (
    <div className="flex flex-col items-center gap-0 w-full px-0.5">
      {builtIndices.map((idx) => {
        const b = district.buildings[idx]
        if (!b) return null
        const label = b.celeb || b.name
        return (
          <div
            key={idx}
            className="text-[7px] leading-[9px] text-yellow-600 dark:text-yellow-400 truncate w-full text-center font-medium"
            title={`${b.name}${b.celeb ? ` (${b.celeb})` : ''}`}
          >
            {label.length > 4 ? label.slice(0, 4) : label}
          </div>
        )
      })}
    </div>
  )
}

export function MarbleBoardSpace({ space, player, computer }: MarbleBoardSpaceProps) {
  const playerHere = player.position === space.index
  const computerHere = computer.position === space.index

  const district = space.districtKey ? DISTRICTS[space.districtKey] : null
  const ownerIsPlayer = space.districtKey && player.properties[space.districtKey] !== undefined
  const ownerIsComputer = space.districtKey && computer.properties[space.districtKey] !== undefined
  const owner = ownerIsPlayer ? 'player' : ownerIsComputer ? 'computer' : null
  const builtIndices = owner === 'player'
    ? (player.properties[space.districtKey!] ?? [])
    : owner === 'computer'
      ? (computer.properties[space.districtKey!] ?? [])
      : []

  // 셀럽 이름 (소유자 없을 때 대표 셀럽 표시)
  const celebNames = district
    ? district.buildings.filter(b => b.celeb).map(b => b.celeb).slice(0, 2)
    : []

  const gradeClass = district ? getGradeBg(district.grade) : ''

  return (
    <div
      className={`
        relative flex flex-col items-center justify-center
        w-full h-full min-h-[52px] p-0.5
        border border-border/50 rounded-md
        text-[10px] leading-tight text-center
        transition-all duration-200
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

      {/* 셀럽 이름 or 건설된 건물 */}
      {district && builtIndices.length > 0 ? (
        <BuildingIndicators builtIndices={builtIndices} districtKey={space.districtKey!} />
      ) : district && !owner && celebNames.length > 0 ? (
        <div className="text-[7px] leading-[9px] text-muted-foreground truncate w-full px-0.5">
          {celebNames.join('/')}
        </div>
      ) : null}

      {district && (
        <span className="text-[9px] text-muted-foreground">{district.price}억</span>
      )}
      {space.amount && !district && (
        <span className="text-[9px] text-muted-foreground">
          {space.amount > 0 ? '+' : ''}{space.amount}억
        </span>
      )}

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
    </div>
  )
}
