'use client'

import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { CelebrityCategory } from '@/types'
import type { PoliticalLeaning } from '@/data/celebrity-seed-data'
import type { GraphNode, PathResult } from '@/lib/graph/build-graph'
import {
  buildBipartiteGraph,
  buildCelebNetwork,
  buildNeighborhoodClusters,
  buildNeighborProximityGraph,
} from '@/lib/graph/build-graph'
import { ForceGraphView } from '@/components/graph/force-graph-view'
import { GraphControls, type ViewMode } from '@/components/graph/graph-controls'
import { NodeDetailPanel } from '@/components/graph/node-detail-panel'
import { PathFinder } from '@/components/graph/path-finder'
import { GraphStats } from '@/components/graph/graph-stats'

const ALL_CATEGORIES: CelebrityCategory[] = ['entertainer', 'politician', 'athlete', 'expert']

export default function GraphPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<ViewMode>('celeb-network')
  const [categoryFilter, setCategoryFilter] = useState<CelebrityCategory[]>(ALL_CATEGORIES)
  const [politicalFilter, setPoliticalFilter] = useState<PoliticalLeaning[]>([])
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [searchNodeId, setSearchNodeId] = useState<string | null>(null)
  const [highlightPath, setHighlightPath] = useState<PathResult | null>(null)
  const [forceStrength, setForceStrength] = useState(0.3)
  const [sidePanel, setSidePanel] = useState<'stats' | 'path' | 'detail'>('stats')

  const graphData = useMemo(() => {
    const catFilter = categoryFilter.length === ALL_CATEGORIES.length ? undefined : categoryFilter
    const polFilter = politicalFilter.length > 0 ? politicalFilter : undefined
    switch (viewMode) {
      case 'bipartite':
        return buildBipartiteGraph(catFilter, polFilter)
      case 'celeb-network':
        return buildCelebNetwork(catFilter, polFilter)
      case 'neighborhood':
        return buildNeighborhoodClusters(catFilter, polFilter)
      case 'neighbor-proximity':
        return buildNeighborProximityGraph(catFilter, polFilter)
    }
  }, [viewMode, categoryFilter, politicalFilter])

  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node)
    setSidePanel('detail')
  }, [])

  const handleNodeDoubleClick = useCallback(
    (node: GraphNode) => {
      if (node.type === 'celebrity') {
        router.push(`/celebrity/${node.id}`)
      }
    },
    [router],
  )

  const handlePathFound = useCallback((result: PathResult | null) => {
    setHighlightPath(result)
    if (result) setSidePanel('path')
  }, [])

  const handleSearchSelect = useCallback((celebId: string) => {
    setSearchNodeId(celebId)
    setTimeout(() => setSearchNodeId(null), 2000)
  }, [])

  const handleNavigate = useCallback(
    (celebId: string) => {
      router.push(`/celebrity/${celebId}`)
    },
    [router],
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-muted/30 px-4 py-3">
        <div className="max-w-screen-2xl mx-auto">
          <h1 className="text-lg font-bold mb-2">셀럽 관계망 탐색</h1>
          <GraphControls
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            politicalFilter={politicalFilter}
            onPoliticalFilterChange={setPoliticalFilter}
            onSearchSelect={handleSearchSelect}
            forceStrength={forceStrength}
            onForceStrengthChange={setForceStrength}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row max-w-screen-2xl mx-auto">
        {/* Graph Area */}
        <div className="flex-1 h-[calc(100vh-200px)] min-h-[500px]">
          <ForceGraphView
            graphData={graphData}
            highlightPath={highlightPath}
            selectedNodeId={selectedNode?.id}
            searchNodeId={searchNodeId}
            forceStrength={forceStrength}
            onNodeClick={handleNodeClick}
            onNodeDoubleClick={handleNodeDoubleClick}
          />
        </div>

        {/* Side Panel */}
        <div className="lg:w-[340px] border-t lg:border-t-0 lg:border-l bg-background">
          {/* Panel Tabs */}
          <div className="flex border-b">
            <PanelTab
              active={sidePanel === 'stats'}
              onClick={() => setSidePanel('stats')}
              label="통계"
            />
            <PanelTab
              active={sidePanel === 'path'}
              onClick={() => setSidePanel('path')}
              label="경로 탐색"
            />
            <PanelTab
              active={sidePanel === 'detail'}
              onClick={() => setSidePanel('detail')}
              label="상세"
              disabled={!selectedNode}
            />
          </div>

          {/* Panel Content */}
          <div className="p-3 max-h-[calc(100vh-280px)] overflow-y-auto space-y-3">
            {sidePanel === 'stats' && <GraphStats />}
            {sidePanel === 'path' && <PathFinder onPathFound={handlePathFound} />}
            {sidePanel === 'detail' && (
              <NodeDetailPanel
                node={selectedNode}
                onClose={() => {
                  setSelectedNode(null)
                  setSidePanel('stats')
                }}
                onNavigate={handleNavigate}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function PanelTab({
  active,
  onClick,
  label,
  disabled,
}: {
  active: boolean
  onClick: () => void
  label: string
  disabled?: boolean
}) {
  return (
    <button
      className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
        active
          ? 'text-pink-500 border-b-2 border-pink-500'
          : disabled
            ? 'text-muted-foreground/50 cursor-not-allowed'
            : 'text-muted-foreground hover:text-foreground'
      }`}
      onClick={disabled ? undefined : onClick}
    >
      {label}
    </button>
  )
}
