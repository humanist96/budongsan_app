'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import type { CelebrityCategory } from '@/types'
import type { GraphData, GraphNode, GraphLink, PathResult } from '@/lib/graph/build-graph'

// SSR 불가 → dynamic import
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false })

// ─── Constants ──────────────────────────────────────────────

const CATEGORY_CANVAS_COLORS: Record<CelebrityCategory, string> = {
  entertainer: '#ec4899',
  politician: '#3b82f6',
  athlete: '#22c55e',
  expert: '#a855f7',
}

const PROPERTY_COLOR = '#94a3b8'
const HIGHLIGHT_COLOR = '#ef4444'
const DIM_OPACITY = 0.15

// ─── Props ──────────────────────────────────────────────────

export interface ForceGraphViewProps {
  graphData: GraphData
  highlightPath?: PathResult | null
  selectedNodeId?: string | null
  searchNodeId?: string | null
  forceStrength?: number
  onNodeClick?: (node: GraphNode) => void
  onNodeDoubleClick?: (node: GraphNode) => void
}

export function ForceGraphView({
  graphData,
  highlightPath,
  selectedNodeId,
  searchNodeId,
  forceStrength = 0.3,
  onNodeClick,
  onNodeDoubleClick,
}: ForceGraphViewProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const graphRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const lastClickTime = useRef(0)
  const lastClickNode = useRef<string | null>(null)

  // Resize observer
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        })
      }
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  // 검색 노드로 카메라 이동
  useEffect(() => {
    if (!searchNodeId || !graphRef.current) return
    const fg = graphRef.current
    const node = graphData.nodes.find((n) => n.id === searchNodeId)
    if (node && (node as unknown as { x: number; y: number }).x !== undefined) {
      const n = node as unknown as { x: number; y: number }
      fg.centerAt?.(n.x, n.y, 500)
      fg.zoom?.(3, 500)
    }
  }, [searchNodeId, graphData.nodes])

  // 하이라이트 경로 노드/링크 집합
  const { highlightNodes, highlightLinks } = useMemo(() => {
    const nodes = new Set<string>()
    const links = new Set<string>()
    if (highlightPath?.found) {
      for (const n of highlightPath.path) nodes.add(n.id)
      for (let i = 0; i < highlightPath.path.length - 1; i++) {
        links.add(`${highlightPath.path[i].id}__${highlightPath.path[i + 1].id}`)
        links.add(`${highlightPath.path[i + 1].id}__${highlightPath.path[i].id}`)
      }
    }
    return { highlightNodes: nodes, highlightLinks: links }
  }, [highlightPath])

  // 호버 시 연결된 노드 집합
  const connectedNodes = useMemo(() => {
    const set = new Set<string>()
    if (!hoveredNode) return set
    set.add(hoveredNode)
    for (const link of graphData.links) {
      const s = typeof link.source === 'string' ? link.source : (link.source as unknown as GraphNode).id
      const t = typeof link.target === 'string' ? link.target : (link.target as unknown as GraphNode).id
      if (s === hoveredNode) set.add(t)
      if (t === hoveredNode) set.add(s)
    }
    return set
  }, [hoveredNode, graphData.links])

  // Node rendering
  const nodeCanvasObject = useCallback(
    (node: unknown, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const n = node as GraphNode & { x: number; y: number }
      if (n.x === undefined || n.y === undefined) return

      const isHighlighted = highlightNodes.has(n.id)
      const isHoverConnected = hoveredNode ? connectedNodes.has(n.id) : true
      const isSelected = selectedNodeId === n.id
      const isSearched = searchNodeId === n.id
      const dimmed = hoveredNode !== null && !isHoverConnected && !isHighlighted

      ctx.save()
      if (dimmed) ctx.globalAlpha = DIM_OPACITY

      if (n.type === 'celebrity') {
        const radius = Math.max(4, Math.sqrt(n.val) * 2.5)
        const color = CATEGORY_CANVAS_COLORS[n.category!] ?? '#94a3b8'

        // Outer ring for selected/searched
        if (isSelected || isSearched) {
          ctx.beginPath()
          ctx.arc(n.x, n.y, radius + 3, 0, 2 * Math.PI)
          ctx.strokeStyle = isSearched ? '#f59e0b' : HIGHLIGHT_COLOR
          ctx.lineWidth = 2
          ctx.stroke()
        }

        // Highlight ring for path
        if (isHighlighted) {
          ctx.beginPath()
          ctx.arc(n.x, n.y, radius + 4, 0, 2 * Math.PI)
          ctx.strokeStyle = HIGHLIGHT_COLOR
          ctx.lineWidth = 2.5
          ctx.stroke()
        }

        // Main circle
        ctx.beginPath()
        ctx.arc(n.x, n.y, radius, 0, 2 * Math.PI)
        ctx.fillStyle = color
        ctx.fill()

        // Name label
        const fontSize = Math.max(10 / globalScale, 2.5)
        ctx.font = `${fontSize}px -apple-system, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        ctx.fillStyle = dimmed ? 'rgba(100,100,100,0.4)' : '#e2e8f0'
        ctx.fillText(n.name, n.x, n.y + radius + 2)
      } else {
        // Property node: small square
        const size = Math.max(3, Math.sqrt(n.val) * 2)

        if (isHighlighted) {
          ctx.strokeStyle = HIGHLIGHT_COLOR
          ctx.lineWidth = 2
          ctx.strokeRect(n.x - size - 1.5, n.y - size - 1.5, size * 2 + 3, size * 2 + 3)
        }

        ctx.fillStyle = PROPERTY_COLOR
        ctx.fillRect(n.x - size, n.y - size, size * 2, size * 2)

        // Show name on hover/highlight
        if (hoveredNode === n.id || isHighlighted || isSelected) {
          const fontSize = Math.max(9 / globalScale, 2)
          ctx.font = `${fontSize}px -apple-system, sans-serif`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'top'
          ctx.fillStyle = '#cbd5e1'
          ctx.fillText(n.name, n.x, n.y + size + 2)
        }
      }

      ctx.restore()
    },
    [hoveredNode, connectedNodes, highlightNodes, selectedNodeId, searchNodeId],
  )

  // Link rendering
  const linkCanvasObject = useCallback(
    (link: unknown, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const l = link as GraphLink & {
        source: { x: number; y: number; id: string }
        target: { x: number; y: number; id: string }
      }
      if (!l.source?.x || !l.target?.x) return

      const linkKey = `${l.source.id}__${l.target.id}`
      const isPathLink = highlightLinks.has(linkKey)
      const dimmed =
        hoveredNode !== null &&
        !connectedNodes.has(l.source.id) &&
        !connectedNodes.has(l.target.id) &&
        !isPathLink

      ctx.save()
      if (dimmed) ctx.globalAlpha = DIM_OPACITY * 0.5

      ctx.beginPath()
      ctx.moveTo(l.source.x, l.source.y)
      ctx.lineTo(l.target.x, l.target.y)

      if (isPathLink) {
        ctx.strokeStyle = HIGHLIGHT_COLOR
        ctx.lineWidth = 3 / globalScale
      } else if (l.label === '처분') {
        ctx.setLineDash([4 / globalScale, 3 / globalScale])
        ctx.strokeStyle = 'rgba(148,163,184,0.3)'
        ctx.lineWidth = 1 / globalScale
      } else {
        ctx.strokeStyle = 'rgba(148,163,184,0.25)'
        ctx.lineWidth = (typeof (l as unknown as { weight?: number }).weight === 'number'
          ? Math.min(3, (l as unknown as { weight: number }).weight)
          : 0.8) / globalScale
      }

      ctx.stroke()
      ctx.setLineDash([])
      ctx.restore()
    },
    [hoveredNode, connectedNodes, highlightLinks],
  )

  // Node pointer area (for hit detection)
  const nodePointerAreaPaint = useCallback(
    (node: unknown, color: string, ctx: CanvasRenderingContext2D) => {
      const n = node as GraphNode & { x: number; y: number }
      if (n.x === undefined) return
      const size = n.type === 'celebrity' ? Math.max(6, Math.sqrt(n.val) * 3) : Math.max(5, Math.sqrt(n.val) * 2.5)
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(n.x, n.y, size, 0, 2 * Math.PI)
      ctx.fill()
    },
    [],
  )

  const handleNodeClick = useCallback(
    (node: unknown) => {
      const n = node as GraphNode
      const now = Date.now()

      if (lastClickNode.current === n.id && now - lastClickTime.current < 400) {
        onNodeDoubleClick?.(n)
        lastClickNode.current = null
        return
      }

      lastClickNode.current = n.id
      lastClickTime.current = now
      onNodeClick?.(n)
    },
    [onNodeClick, onNodeDoubleClick],
  )

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px] relative">
      <ForceGraph2D
        ref={graphRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        nodeId="id"
        nodeCanvasObject={nodeCanvasObject}
        nodePointerAreaPaint={nodePointerAreaPaint}
        linkCanvasObject={linkCanvasObject}
        onNodeClick={handleNodeClick}
        onNodeHover={(node: unknown) => {
          const n = node as GraphNode | null
          setHoveredNode(n?.id ?? null)
        }}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        cooldownTicks={200}
        warmupTicks={50}
        enableNodeDrag={true}
        enableZoomInteraction={true}
        enablePanInteraction={true}
        backgroundColor="transparent"
      />
    </div>
  )
}
