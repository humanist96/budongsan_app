'use client'

import { useState, useMemo } from 'react'
import { Route, ChevronRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CelebrityCategory } from '@/types'
import { CATEGORY_LABELS } from '@/types/celebrity'
import { findPath, getAllCelebrities } from '@/lib/graph/build-graph'
import type { PathResult } from '@/lib/graph/build-graph'

interface PathFinderProps {
  onPathFound: (result: PathResult | null) => void
}

const CATEGORY_DOT: Record<CelebrityCategory, string> = {
  entertainer: 'bg-pink-500',
  politician: 'bg-blue-500',
  athlete: 'bg-green-500',
  expert: 'bg-purple-500',
}

export function PathFinder({ onPathFound }: PathFinderProps) {
  const [fromId, setFromId] = useState('')
  const [toId, setToId] = useState('')
  const [result, setResult] = useState<PathResult | null>(null)
  const [searching, setSearching] = useState(false)
  const [fromQuery, setFromQuery] = useState('')
  const [toQuery, setToQuery] = useState('')
  const [activeInput, setActiveInput] = useState<'from' | 'to' | null>(null)

  const celebs = useMemo(() => getAllCelebrities(), [])

  const fromCeleb = celebs.find((c) => c.id === fromId)
  const toCeleb = celebs.find((c) => c.id === toId)

  const filteredCelebs = useMemo(() => {
    const query = activeInput === 'from' ? fromQuery : toQuery
    if (query.length < 1) return []
    return celebs.filter((c) => c.name.includes(query)).slice(0, 6)
  }, [activeInput, fromQuery, toQuery, celebs])

  const handleSearch = () => {
    if (!fromId || !toId || fromId === toId) return
    setSearching(true)
    // Use setTimeout to avoid blocking UI
    setTimeout(() => {
      const pathResult = findPath(fromId, toId)
      setResult(pathResult)
      onPathFound(pathResult)
      setSearching(false)
    }, 50)
  }

  const handleClear = () => {
    setFromId('')
    setToId('')
    setFromQuery('')
    setToQuery('')
    setResult(null)
    onPathFound(null)
  }

  const handleSelect = (celebId: string, type: 'from' | 'to') => {
    const celeb = celebs.find((c) => c.id === celebId)
    if (type === 'from') {
      setFromId(celebId)
      setFromQuery(celeb?.name ?? '')
    } else {
      setToId(celebId)
      setToQuery(celeb?.name ?? '')
    }
    setActiveInput(null)
  }

  return (
    <div className="bg-background border rounded-lg shadow-lg overflow-hidden">
      <div className="flex items-center gap-2 p-3 border-b bg-muted/30">
        <Route className="h-4 w-4 text-pink-500" />
        <span className="font-semibold text-sm">6단계 분리 게임</span>
      </div>

      <div className="p-3 space-y-3">
        <p className="text-xs text-muted-foreground">
          두 셀럽이 몇 다리 건너 이웃인지 찾아보세요!
        </p>

        {/* Celebrity Selection */}
        <div className="space-y-2">
          {/* From */}
          <div className="relative">
            <input
              type="text"
              placeholder="셀럽 A 선택..."
              value={fromId ? (fromCeleb?.name ?? '') : fromQuery}
              onChange={(e) => {
                setFromQuery(e.target.value)
                setFromId('')
                setActiveInput('from')
              }}
              onFocus={() => setActiveInput('from')}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-pink-500/50"
            />
            {activeInput === 'from' && filteredCelebs.length > 0 && (
              <CelebDropdown celebs={filteredCelebs} onSelect={(id) => handleSelect(id, 'from')} />
            )}
          </div>

          <div className="flex justify-center">
            <ChevronRight className="h-4 w-4 text-muted-foreground rotate-90" />
          </div>

          {/* To */}
          <div className="relative">
            <input
              type="text"
              placeholder="셀럽 B 선택..."
              value={toId ? (toCeleb?.name ?? '') : toQuery}
              onChange={(e) => {
                setToQuery(e.target.value)
                setToId('')
                setActiveInput('to')
              }}
              onFocus={() => setActiveInput('to')}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-pink-500/50"
            />
            {activeInput === 'to' && filteredCelebs.length > 0 && (
              <CelebDropdown celebs={filteredCelebs} onSelect={(id) => handleSelect(id, 'to')} />
            )}
          </div>
        </div>

        {/* Search Button */}
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 gap-1.5 text-xs bg-pink-500 hover:bg-pink-600"
            disabled={!fromId || !toId || fromId === toId || searching}
            onClick={handleSearch}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {searching ? '탐색 중...' : '경로 찾기'}
          </Button>
          {result && (
            <Button variant="outline" size="sm" className="text-xs" onClick={handleClear}>
              초기화
            </Button>
          )}
        </div>

        {/* Result */}
        {result && (
          <div className={`p-3 rounded-lg ${result.found ? 'bg-pink-500/10 border border-pink-500/30' : 'bg-muted/50'}`}>
            {result.found ? (
              <div className="space-y-2">
                <div className="text-sm font-bold text-pink-400 text-center">
                  {result.steps}다리 건너 이웃!
                </div>
                <div className="flex flex-wrap items-center justify-center gap-1 text-xs">
                  {result.path.map((node, i) => (
                    <span key={node.id} className="flex items-center gap-1">
                      {i > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                      <span
                        className={`px-1.5 py-0.5 rounded ${
                          node.type === 'celebrity'
                            ? 'bg-pink-500/20 text-pink-300 font-medium'
                            : 'bg-slate-500/20 text-slate-300'
                        }`}
                      >
                        {node.name}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-xs text-center text-muted-foreground">
                연결 경로를 찾을 수 없습니다
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function CelebDropdown({
  celebs,
  onSelect,
}: {
  celebs: { id: string; name: string; category: CelebrityCategory }[]
  onSelect: (id: string) => void
}) {
  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-20 max-h-40 overflow-y-auto">
      {celebs.map((c) => (
        <button
          key={c.id}
          className="w-full px-3 py-2 text-sm text-left hover:bg-muted flex items-center gap-2"
          onMouseDown={(e) => {
            e.preventDefault()
            onSelect(c.id)
          }}
        >
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${CATEGORY_DOT[c.category]}`} />
          {c.name}
          <span className="text-xs text-muted-foreground ml-auto">{CATEGORY_LABELS[c.category]}</span>
        </button>
      ))}
    </div>
  )
}
