'use client'

import { useMemo } from 'react'
import { X, Building2, User, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CelebrityCategory } from '@/types'
import { CATEGORY_LABELS } from '@/types/celebrity'
import { PROPERTY_TYPE_LABELS } from '@/types/property'
import type { GraphNode } from '@/lib/graph/build-graph'
import {
  getCelebrityById,
  getPropertyById,
  getCelebPropertiesForCeleb,
  getCelebsForProperty,
} from '@/lib/graph/build-graph'

interface NodeDetailPanelProps {
  node: GraphNode | null
  onClose: () => void
  onNavigate?: (celebId: string) => void
}

const CATEGORY_DOT_COLORS: Record<CelebrityCategory, string> = {
  entertainer: 'bg-pink-500',
  politician: 'bg-blue-500',
  athlete: 'bg-green-500',
  expert: 'bg-purple-500',
}

export function NodeDetailPanel({ node, onClose, onNavigate }: NodeDetailPanelProps) {
  const details = useMemo(() => {
    if (!node) return null
    if (node.type === 'celebrity') {
      const celeb = getCelebrityById(node.id)
      const props = getCelebPropertiesForCeleb(node.id)
      return { celeb, props }
    }
    const prop = getPropertyById(node.id)
    const celebs = getCelebsForProperty(node.id)
    return { prop, celebs }
  }, [node])

  if (!node || !details) return null

  return (
    <div className="bg-background border rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          {node.type === 'celebrity' ? (
            <User className="h-4 w-4 text-pink-500" />
          ) : (
            <Building2 className="h-4 w-4 text-slate-400" />
          )}
          <span className="font-semibold text-sm">{node.name}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="p-3 space-y-3 max-h-[400px] overflow-y-auto">
        {node.type === 'celebrity' && 'celeb' in details && details.celeb ? (
          <>
            {/* Celebrity Info */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${CATEGORY_DOT_COLORS[details.celeb.category]}`} />
                <span className="text-xs text-muted-foreground">
                  {CATEGORY_LABELS[details.celeb.category]} · {details.celeb.subCategory}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{details.celeb.description}</p>
            </div>

            {/* Properties */}
            {'props' in details && details.props.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-1.5">
                  보유 매물 ({details.props.length}건)
                </h4>
                <div className="space-y-1.5">
                  {details.props.map((cp) => (
                    <div
                      key={`${cp.celebrityId}-${cp.propertyId}`}
                      className="text-xs p-2 rounded bg-muted/50 space-y-0.5"
                    >
                      <div className="font-medium">{cp.property?.name}</div>
                      <div className="text-muted-foreground">{cp.property?.address}</div>
                      {cp.price && (
                        <div className="text-pink-500">
                          {formatPrice(cp.price)}
                          {cp.disposalDate && (
                            <span className="text-muted-foreground ml-1">(처분)</span>
                          )}
                        </div>
                      )}
                      {cp.highlight && (
                        <div className="text-amber-400 font-medium">{cp.highlight}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigate */}
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1.5 text-xs"
              onClick={() => onNavigate?.(node.id)}
            >
              <ExternalLink className="h-3 w-3" />
              셀럽 상세 보기
            </Button>
          </>
        ) : node.type === 'property' && 'prop' in details && details.prop ? (
          <>
            {/* Property Info */}
            <div className="space-y-1.5">
              <div className="text-xs text-muted-foreground">
                {PROPERTY_TYPE_LABELS[details.prop.propertyType]} · {details.prop.address}
              </div>
              {details.prop.exclusiveArea && (
                <div className="text-xs text-muted-foreground">
                  전용 {details.prop.exclusiveArea}㎡ · {details.prop.buildingYear}년 준공
                </div>
              )}
            </div>

            {/* Residents */}
            {'celebs' in details && details.celebs.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-1.5">
                  관련 셀럽 ({details.celebs.length}명)
                </h4>
                <div className="space-y-1">
                  {details.celebs.map((cp) => (
                    <div
                      key={`${cp.celebrityId}-${cp.propertyId}`}
                      className="text-xs p-2 rounded bg-muted/50 flex items-center gap-2"
                    >
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          CATEGORY_DOT_COLORS[cp.celebrity?.category ?? 'entertainer']
                        }`}
                      />
                      <span className="font-medium">{cp.celebrity?.name}</span>
                      {cp.price && (
                        <span className="text-muted-foreground ml-auto">
                          {formatPrice(cp.price)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  )
}

function formatPrice(priceInManwon: number): string {
  if (priceInManwon >= 10000) {
    const eok = Math.floor(priceInManwon / 10000)
    const remainder = priceInManwon % 10000
    return remainder > 0 ? `${eok}억 ${remainder}만원` : `${eok}억원`
  }
  return `${priceInManwon.toLocaleString()}만원`
}
