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

const CATEGORY_ICONS: Record<CelebrityCategory, string> = {
  entertainer: '🎬',
  politician: '🏛️',
  athlete: '⚽',
  expert: '📚',
}

const POLITICAL_COLORS = {
  progressive: '#2563eb',  // 진보: 파랑
  conservative: '#ef4444', // 보수: 빨강
} as const

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
        const radius = Math.max(8, Math.sqrt(n.val) * 4)
        const color = (n.category === 'politician' && n.politicalLeaning)
          ? POLITICAL_COLORS[n.politicalLeaning]
          : (CATEGORY_CANVAS_COLORS[n.category!] ?? '#94a3b8')

        // Outer ring for selected/searched
        if (isSelected || isSearched) {
          ctx.beginPath()
          ctx.arc(n.x, n.y, radius + 4, 0, 2 * Math.PI)
          ctx.strokeStyle = isSearched ? '#f59e0b' : HIGHLIGHT_COLOR
          ctx.lineWidth = 2.5
          ctx.stroke()
        }

        // Highlight ring for path
        if (isHighlighted) {
          ctx.beginPath()
          ctx.arc(n.x, n.y, radius + 5, 0, 2 * Math.PI)
          ctx.strokeStyle = HIGHLIGHT_COLOR
          ctx.lineWidth = 3
          ctx.stroke()
        }

        // Main circle with subtle shadow
        ctx.beginPath()
        ctx.arc(n.x, n.y, radius, 0, 2 * Math.PI)
        ctx.fillStyle = color
        ctx.fill()
        ctx.strokeStyle = 'rgba(0,0,0,0.2)'
        ctx.lineWidth = 0.5
        ctx.stroke()

        // Category icon inside circle
        const icon = CATEGORY_ICONS[n.category!] ?? '👤'
        const iconSize = Math.max(radius * 0.9, 4)
        ctx.font = `${iconSize}px serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(icon, n.x, n.y)

        // Name label with background for readability
        const fontSize = Math.max(11 / globalScale, 3)
        ctx.font = `600 ${fontSize}px -apple-system, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        const textY = n.y + radius + 3
        const textWidth = ctx.measureText(n.name).width
        const pad = 2 / globalScale

        // Text background
        ctx.fillStyle = dimmed ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.55)'
        ctx.beginPath()
        ctx.roundRect(n.x - textWidth / 2 - pad, textY - pad * 0.5, textWidth + pad * 2, fontSize + pad * 1.5, 2 / globalScale)
        ctx.fill()

        // Text
        ctx.fillStyle = dimmed ? 'rgba(100,100,100,0.4)' : '#ffffff'
        ctx.fillText(n.name, n.x, textY)
      } else {
        // Property node: rounded square
        const size = Math.max(5, Math.sqrt(n.val) * 3)

        if (isHighlighted) {
          ctx.strokeStyle = HIGHLIGHT_COLOR
          ctx.lineWidth = 2.5
          ctx.strokeRect(n.x - size - 2, n.y - size - 2, size * 2 + 4, size * 2 + 4)
        }

        ctx.fillStyle = PROPERTY_COLOR
        ctx.beginPath()
        ctx.roundRect(n.x - size, n.y - size, size * 2, size * 2, 2)
        ctx.fill()

        // House icon
        const houseSize = Math.max(size * 0.8, 3)
        ctx.font = `${houseSize}px serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('🏠', n.x, n.y)

        // Show name on hover/highlight
        if (hoveredNode === n.id || isHighlighted || isSelected) {
          const fontSize = Math.max(10 / globalScale, 2.5)
          ctx.font = `500 ${fontSize}px -apple-system, sans-serif`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'top'
          const textY = n.y + size + 2
          const textWidth = ctx.measureText(n.name).width
          const pad = 2 / globalScale

          ctx.fillStyle = 'rgba(0,0,0,0.55)'
          ctx.beginPath()
          ctx.roundRect(n.x - textWidth / 2 - pad, textY - pad * 0.5, textWidth + pad * 2, fontSize + pad * 1.5, 2 / globalScale)
          ctx.fill()

          ctx.fillStyle = '#ffffff'
          ctx.fillText(n.name, n.x, textY)
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
      const size = n.type === 'celebrity' ? Math.max(10, Math.sqrt(n.val) * 5) : Math.max(7, Math.sqrt(n.val) * 3.5)
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
