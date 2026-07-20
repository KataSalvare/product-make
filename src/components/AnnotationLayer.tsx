import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import type { Annotation, AnnotationCategory } from '../lib/annotations'
import { findElementBySelector, getElementPosition, getElementSelector, isElementVisible, findActiveOverlay } from '../lib/annotations'

export type Theme = 'light' | 'dark'

interface AnnotationLayerProps {
  annotations: Annotation[]
  categories: AnnotationCategory[]
  selectedId: string | null
  highlightedId: string | null
  selecting: boolean
  previewContainer: HTMLElement | null
  theme: Theme
  onSelect: (id: string, clientX: number, clientY: number) => void
  onSelectElement: (selector: string, clientX: number, clientY: number) => void
}

const getCategoryColor = (categories: AnnotationCategory[], categoryKey: string): string => {
  return categories.find((c) => c.key === categoryKey)?.color ?? '#6b7280'
}

export default function AnnotationLayer({
  annotations,
  categories,
  selectedId,
  highlightedId,
  selecting,
  previewContainer,
  theme,
  onSelect,
  onSelectElement,
}: AnnotationLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null)
  const [hoveredSelector, setHoveredSelector] = useState<string | null>(null)
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null)
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null)
  const [positions, setPositions] = useState<Record<string, { left: number; top: number }>>({})
  const [visibleMap, setVisibleMap] = useState<Record<string, boolean>>({})

  const isDark = theme === 'dark'

  // 根据 selector 计算所有标记位置与可见性（支持弹窗/抽屉显示隐藏时同步更新）
  const recomputePositions = useCallback(() => {
    if (!previewContainer) return
    const nextPositions: Record<string, { left: number; top: number }> = {}
    const nextVisible: Record<string, boolean> = {}
    const activeOverlay = findActiveOverlay(previewContainer)
    annotations.forEach((annotation) => {
      if (annotation.selector) {
        const el = findElementBySelector(annotation.selector, previewContainer)
        if (el) {
          nextPositions[annotation.id] = getElementPosition(el, previewContainer, annotation.position)
          const visible = isElementVisible(el, previewContainer)
          // 若存在顶层 overlay，只展示位于该 overlay 内部的批注；否则隐藏位于任何 overlay 内部的批注
          if (activeOverlay) {
            nextVisible[annotation.id] = visible && activeOverlay.contains(el)
          } else {
            nextVisible[annotation.id] = visible && !el.closest('[data-overlay], [data-modal], dialog, [role="dialog"], [role="alertdialog"]')
          }
        }
      } else if (annotation.x != null && annotation.y != null) {
        nextPositions[annotation.id] = { left: annotation.x, top: annotation.y }
        nextVisible[annotation.id] = true
      }
    })
    setPositions(nextPositions)
    setVisibleMap(nextVisible)
  }, [annotations, previewContainer])

  useEffect(() => {
    queueMicrotask(() => recomputePositions())
  }, [recomputePositions])

  // 监听 DOM 变化，在弹窗/抽屉展开或收起时重新计算可见性
  useEffect(() => {
    if (!previewContainer) return
    const observer = new MutationObserver(() => {
      queueMicrotask(recomputePositions)
    })
    observer.observe(previewContainer, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['class', 'style', 'hidden', 'aria-hidden', 'data-open', 'data-state'],
    })
    return () => observer.disconnect()
  }, [previewContainer, recomputePositions])

  // 弹窗打开时高亮对应元素（仅当元素可见时才高亮）
  useEffect(() => {
    queueMicrotask(() => {
      if (!previewContainer || !highlightedId) {
        setHighlightedElement(null)
        return
      }
      const annotation = annotations.find((a) => a.id === highlightedId)
      if (!annotation?.selector) {
        setHighlightedElement(null)
        return
      }
      const el = findElementBySelector(annotation.selector, previewContainer)
      setHighlightedElement(el && isElementVisible(el, previewContainer) ? el : null)
    })
  }, [highlightedId, annotations, previewContainer])

  // 选择模式下，层覆盖在预览内容上方，e.target 可能是层本身。
  // 用 elementsFromPoint 取鼠标位置下、previewContainer 内的真实元素。
  const getElementAtPoint = useCallback(
    (clientX: number, clientY: number): HTMLElement | null => {
      if (!previewContainer || !layerRef.current) return null
      const elements = document.elementsFromPoint(clientX, clientY)
      for (const el of elements) {
        if (!(el instanceof HTMLElement)) continue
        if (el === layerRef.current || layerRef.current.contains(el)) continue
        if (el === previewContainer) continue
        if (previewContainer.contains(el)) return el
      }
      return null
    },
    [previewContainer]
  )

  // 元素选择模式：高亮并点击元素
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!selecting || !previewContainer) return
      const target = getElementAtPoint(e.clientX, e.clientY)
      if (!target) {
        setHoveredElement(null)
        setHoveredSelector(null)
        return
      }
      setHoveredElement(target)
      setHoveredSelector(getElementSelector(target, previewContainer))
    },
    [selecting, previewContainer, getElementAtPoint]
  )

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!selecting || !previewContainer) return
      e.preventDefault()
      e.stopPropagation()
      const target = getElementAtPoint(e.clientX, e.clientY)
      if (!target) return
      const selector = getElementSelector(target, previewContainer)
      onSelectElement(selector, e.clientX, e.clientY)
    },
    [selecting, previewContainer, getElementAtPoint, onSelectElement]
  )

  // 按 selector 聚合标记，同元素多个标记时扇形偏移
  const annotationsBySelector = useMemo(() => {
    const map: Record<string, Annotation[]> = {}
    annotations.forEach((a) => {
      const key = a.selector || `${a.x},${a.y}`
      if (!map[key]) map[key] = []
      map[key].push(a)
    })
    return map
  }, [annotations])

  if (!previewContainer) return null

  return (
    <div
      ref={layerRef}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      className={[
        'absolute inset-0 z-[200]',
        selecting ? 'cursor-pointer' : 'pointer-events-none',
      ].join(' ')}
    >
      {/* 元素悬停高亮（选择模式） */}
      {selecting && hoveredElement && (
        <div
          className="absolute pointer-events-none rounded-md ring-2 ring-blue-500 ring-offset-2 bg-blue-500/10 transition-all"
          style={(() => {
            const rect = hoveredElement.getBoundingClientRect()
            const containerRect = previewContainer.getBoundingClientRect()
            return {
              left: rect.left - containerRect.left,
              top: rect.top - containerRect.top,
              width: rect.width,
              height: rect.height,
            }
          })()}
        />
      )}

      {/* 弹窗打开时高亮对应元素 */}
      {highlightedElement && (
        <div
          className="absolute pointer-events-none rounded-md ring-2 ring-blue-500 ring-offset-2 bg-blue-500/10 animate-pulse"
          style={(() => {
            const rect = highlightedElement.getBoundingClientRect()
            const containerRect = previewContainer.getBoundingClientRect()
            return {
              left: rect.left - containerRect.left,
              top: rect.top - containerRect.top,
              width: rect.width,
              height: rect.height,
            }
          })()}
        />
      )}

      {/* 标记点：同一元素聚合为一个标记，仅显示当前可见的标记 */}
      {Object.entries(annotationsBySelector).map(([, group]) => {
        // 按分类顺序取第一个作为代表
        const order = new Map(categories.map((c, i) => [c.key, i]))
        const sorted = [...group].sort(
          (a, b) => (order.get(a.category) ?? Infinity) - (order.get(b.category) ?? Infinity)
        )
        const annotation = sorted[0]
        const pos = positions[annotation.id]
        if (!pos || !visibleMap[annotation.id]) return null
        const color = getCategoryColor(categories, annotation.category)
        const isSelected = sorted.some((a) => a.id === selectedId)
        const isHighlighted = sorted.some((a) => a.id === highlightedId)

        return (
          <button
            key={annotation.id}
            onClick={(e) => {
              e.stopPropagation()
              if (!selecting) {
                onSelect(annotation.id, e.clientX, e.clientY)
              }
            }}
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              backgroundColor: color,
              transform: 'translate(-50%, -50%)',
            }}
            className={[
              'absolute flex items-center justify-center w-5 h-5 rounded-full text-white text-[10px] font-bold shadow-md',
              'select-none transition-transform duration-150',
              selecting ? 'pointer-events-none opacity-60' : 'pointer-events-auto cursor-pointer',
              isSelected || isHighlighted ? 'ring-[3px] ring-white/60 scale-110' : 'hover:scale-110',
            ].join(' ')}
            title={group.length > 1 ? `${group.length} 条批注` : annotation.title}
          >
            {annotation.number}
          </button>
        )
      })}

      {/* 选择模式提示 */}
      {selecting && (
        <div className={`absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm font-medium shadow-lg pointer-events-none ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}`}>
          点击页面元素添加批注
        </div>
      )}
      {selecting && hoveredSelector && (
        <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 max-w-[80%] px-3 py-1.5 rounded-lg text-xs font-mono truncate shadow-lg pointer-events-none ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-white text-gray-600'}`}>
          {hoveredSelector}
        </div>
      )}
    </div>
  )
}
