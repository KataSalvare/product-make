// 标注数据类型与工具函数（独立模块，供 hooks 与组件共享）

import {
  DEFAULT_ANNOTATION_CATEGORIES,
  DEFAULT_ANNOTATIONS,
  DEFAULT_ANNOTATIONS_DATA,
} from '@/content/annotations/defaults'
import { DEFAULT_CATEGORY_KEYS } from '@/content/annotations/categories'

export {
  DEFAULT_ANNOTATION_CATEGORIES,
  DEFAULT_ANNOTATIONS,
  DEFAULT_ANNOTATIONS_DATA,
  DEFAULT_CATEGORY_KEYS,
}

export interface Annotation {
  id: string
  pagePath: string
  number: number
  title: string
  content: string
  category: string
  // 元素选择器定位（新方式）
  selector?: string
  // 元素所在弹窗的 data-overlay 标识，用于从列表点击时自动打开弹窗
  overlayId?: string
  // 兼容旧数据的百分比坐标
  x?: number
  y?: number
  // 标记位于元素的哪个角，默认左上
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  createdAt: number
}

export interface AnnotationCategory {
  key: string
  label: string
  color: string
}

export interface AnnotationsData {
  annotations: Annotation[]
  categories: AnnotationCategory[]
}

// 草稿数据：未保存到本地文件的临时改动
export interface AnnotationDraft {
  annotations: {
    created: Annotation[]
    updated: Annotation[]
    deleted: string[]
  }
  categories: {
    created: AnnotationCategory[]
    deleted: string[]
  }
}

export const DRAFT_STORAGE_KEY = 'prototype-annotations-draft'

export const EMPTY_DRAFT: AnnotationDraft = {
  annotations: { created: [], updated: [], deleted: [] },
  categories: { created: [], deleted: [] },
}

// 计算当前页面下一个编号（按页面递增，不同页面重新排列）
export function getNextNumber(annotations: Annotation[], pagePath: string): number {
  const pageAnnotations = annotations.filter((a) => a.pagePath === pagePath)
  return pageAnnotations.length > 0 ? Math.max(...pageAnnotations.map((a) => a.number)) + 1 : 1
}

// 同一页面内，同一元素（选择器或坐标）的多个分类批注共用同一个序号
export function renumberAnnotations(annotations: Annotation[]): Annotation[] {
  const byPage: Record<string, Annotation[]> = {}
  annotations.forEach((a) => {
    if (!byPage[a.pagePath]) byPage[a.pagePath] = []
    byPage[a.pagePath].push(a)
  })

  const getElementKey = (a: Annotation) => {
    if (a.selector) return `selector:${a.selector}`
    if (a.x != null && a.y != null) return `position:${a.x},${a.y}`
    return `id:${a.id}`
  }

  const result: Annotation[] = []
  Object.values(byPage).forEach((group) => {
    const numberByElement = new Map<string, number>()
    group
      .sort((a, b) => a.createdAt - b.createdAt)
      .forEach((a) => {
        const key = getElementKey(a)
        if (!numberByElement.has(key)) numberByElement.set(key, numberByElement.size + 1)
        result.push({ ...a, number: numberByElement.get(key)! })
      })
  })
  return result
}

// 将草稿改动合并到持久化数据
export function applyDraft(data: AnnotationsData, draft: AnnotationDraft): AnnotationsData {
  let annotations = [...data.annotations]

  // 删除
  annotations = annotations.filter((a) => !draft.annotations.deleted.includes(a.id))

  // 更新
  draft.annotations.updated.forEach((updated) => {
    annotations = annotations.map((a) => (a.id === updated.id ? updated : a))
  })

  // 新增
  annotations = [...annotations, ...draft.annotations.created]

  // 分类：删除
  let categories = data.categories.filter((c) => !draft.categories.deleted.includes(c.key))

  // 分类：新增
  categories = [...categories, ...draft.categories.created]

  return {
    annotations: renumberAnnotations(annotations),
    categories,
  }
}

// 将一组增删改直接应用到批注数组
export function applyAnnotationChanges(
  annotations: Annotation[],
  changes: { upserted: Annotation[]; deleted: string[] }
): Annotation[] {
  const next = annotations.filter((a) => !changes.deleted.includes(a.id))
  changes.upserted.forEach((annotation) => {
    const index = next.findIndex((a) => a.id === annotation.id)
    if (index >= 0) {
      next[index] = annotation
    } else {
      next.push(annotation)
    }
  })
  return renumberAnnotations(next)
}

// 从 localStorage 加载草稿
export function loadDraft(): AnnotationDraft {
  try {
    const saved = localStorage.getItem(DRAFT_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      return {
        annotations: {
          created: parsed.annotations?.created || [],
          updated: parsed.annotations?.updated || [],
          deleted: parsed.annotations?.deleted || [],
        },
        categories: {
          created: parsed.categories?.created || [],
          deleted: parsed.categories?.deleted || [],
        },
      }
    }
  } catch {
    // ignore
  }
  return EMPTY_DRAFT
}

// 清空草稿
export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY)
  } catch {
    // ignore
  }
}

// 转义 CSS 选择器中的特殊字符
const escapeSelector = (typeof CSS !== 'undefined' && CSS.escape)
  ? CSS.escape
  : (value: string): string => value.replace(/([.#()[\]:\\|*+?^$])/g, '\\$1')

// 生成元素的稳定选择器（基于元素在 DOM 中的路径）
export function getElementSelector(element: HTMLElement, root: HTMLElement): string {
  const path: string[] = []
  let current: HTMLElement | null = element

  while (current && current !== root) {
    let selector = current.tagName.toLowerCase()
    if (current.id) {
      selector += `#${escapeSelector(current.id)}`
      path.unshift(selector)
      break
    }
    if (current.className && typeof current.className === 'string') {
      const classes = current.className
        .split(' ')
        .map((c) => c.trim())
        .filter((c) => c && !c.startsWith('hover:') && !c.startsWith('focus:') && !c.startsWith('active:'))
        .map(escapeSelector)
        .filter((c) => c)
      if (classes.length > 0) {
        selector += `.${classes.join('.')}`
      }
    }
    const siblings = Array.from(current.parentElement?.children || [])
    const sameTagSiblings = siblings.filter((s) => s.tagName === current!.tagName)
    if (sameTagSiblings.length > 1) {
      const index = sameTagSiblings.indexOf(current) + 1
      selector += `:nth-of-type(${index})`
    }
    path.unshift(selector)
    current = current.parentElement
  }

  return path.join(' > ')
}

// 根据选择器在容器内查找元素
export function findElementBySelector(selector: string, root: HTMLElement): HTMLElement | null {
  try {
    return root.querySelector(selector) as HTMLElement | null
  } catch {
    return null
  }
}

// 判断元素在容器内是否可见（用于让弹窗/抽屉上的批注随容器一起展示/隐藏）
export function isElementVisible(element: HTMLElement, container: HTMLElement): boolean {
  if (!element.isConnected) return false
  let current: Element | null = element
  while (current && current !== container) {
    if (!container.contains(current)) return false
    const style = window.getComputedStyle(current)
    if (style.display === 'none') return false
    if (style.visibility === 'hidden') return false
    if (parseFloat(style.opacity) <= 0.01) return false
    if ((current as HTMLElement).hidden) return false
    if (current.getAttribute('aria-hidden') === 'true') return false
    current = current.parentElement
  }
  return true
}

// 判断元素是否位于预览容器当前可视区域内
export function isElementInViewport(element: HTMLElement, container: HTMLElement): boolean {
  const elementRect = element.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()
  return (
    elementRect.bottom > containerRect.top &&
    elementRect.top < containerRect.bottom &&
    elementRect.right > containerRect.left &&
    elementRect.left < containerRect.right
  )
}

// 获取元素的有效 z-index 数值（auto 视为 0）
function getZIndex(element: HTMLElement): number {
  const z = window.getComputedStyle(element).zIndex
  return z === 'auto' ? 0 : parseInt(z, 10) || 0
}

// 在容器内查找当前最顶层可见的 overlay/dialog/modal
// 支持 data-overlay / data-modal / <dialog> / role="dialog" 等标记
export function findActiveOverlay(container: HTMLElement): HTMLElement | null {
  const candidates = Array.from(
    container.querySelectorAll<HTMLElement>(
      '[data-overlay], [data-modal], dialog, [role="dialog"], [role="alertdialog"]'
    )
  ).filter((el) => isElementVisible(el, container))

  if (candidates.length === 0) return null

  // 按 z-index 排序，取最高的
  candidates.sort((a, b) => getZIndex(b) - getZIndex(a))
  return candidates[0] || null
}

// 获取元素所属弹窗的 data-overlay 标识
export function getOverlayId(element: HTMLElement): string | undefined {
  return element.closest('[data-overlay]')?.getAttribute('data-overlay') ?? undefined
}

// 根据选择器获取元素所属弹窗的 data-overlay 标识
export function getOverlayIdForSelector(selector: string, root: HTMLElement): string | undefined {
  const element = findElementBySelector(selector, root)
  return element ? getOverlayId(element) : undefined
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve())
  })
}

async function waitForElement(root: HTMLElement, selector: string, timeoutMs = 360): Promise<HTMLElement | null> {
  const deadline = performance.now() + timeoutMs
  let element = findElementBySelector(selector, root)
  while (!element && performance.now() < deadline) {
    await nextFrame()
    element = findElementBySelector(selector, root)
  }
  return element
}

// 尝试展示批注元素：如果元素只在弹窗内出现，则点击对应的弹窗触发器
// 原型弹窗触发器使用 data-overlay-trigger="<overlayId>" 标记，遮罩使用 data-overlay="<overlayId>" 标记
export async function revealAnnotationTarget(root: HTMLElement, annotation: Annotation): Promise<HTMLElement | null> {
  const selector = annotation.selector
  if (!selector) return null
  const existing = findElementBySelector(selector, root)
  if (existing) return existing

  const triggers = Array.from(root.querySelectorAll<HTMLElement>('[data-overlay-trigger]'))
  const openOverlay = async (trigger: HTMLElement) => {
    trigger.click()
    const element = await waitForElement(root, selector)
    if (element) return element
    // 未命中时关闭刚打开的弹窗，避免残留
    const opened = findActiveOverlay(root)
    if (opened) {
      opened.click()
      await nextFrame()
    }
    return null
  }

  if (annotation.overlayId) {
    const matched = triggers.find((trigger) => trigger.dataset.overlayTrigger === annotation.overlayId)
    if (matched) {
      const element = await openOverlay(matched)
      if (element) return element
    }
  }

  for (const trigger of triggers) {
    if (annotation.overlayId && trigger.dataset.overlayTrigger === annotation.overlayId) continue
    const element = await openOverlay(trigger)
    if (element) return element
  }

  return null
}

const MARKER_SIZE = 20

export type AnnotationMarkerColor = 'black' | 'blue' | 'orange' | 'red' | 'green' | 'purple'

export const ANNOTATION_MARKER_COLOR_OPTIONS: Array<{
  value: AnnotationMarkerColor
  label: string
  color: string
}> = [
  { value: 'black', label: '黑色', color: '#111827' },
  { value: 'blue', label: '蓝色', color: '#3b82f6' },
  { value: 'orange', label: '橙色', color: '#f97316' },
  { value: 'red', label: '红色', color: '#ef4444' },
  { value: 'green', label: '绿色', color: '#22c55e' },
  { value: 'purple', label: '紫色', color: '#8b5cf6' },
]

export const DEFAULT_ANNOTATION_MARKER_COLOR: AnnotationMarkerColor = 'orange'

export function getAnnotationMarkerColor(color: AnnotationMarkerColor): string {
  return ANNOTATION_MARKER_COLOR_OPTIONS.find((option) => option.value === color)?.color ?? '#f97316'
}

// 计算元素相对于容器的位置，支持四角定位
export function getElementPosition(
  element: HTMLElement,
  container: HTMLElement,
  position: Annotation['position'] = 'top-left'
): { left: number; top: number } {
  const elementRect = element.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()
  let left: number
  let top: number
  switch (position) {
    case 'top-right':
      left = elementRect.right - containerRect.left
      top = elementRect.top - containerRect.top
      break
    case 'bottom-left':
      left = elementRect.left - containerRect.left
      top = elementRect.bottom - containerRect.top
      break
    case 'bottom-right':
      left = elementRect.right - containerRect.left
      top = elementRect.bottom - containerRect.top
      break
    case 'top-left':
    default:
      left = elementRect.left - containerRect.left
      top = elementRect.top - containerRect.top
      break
  }
  const leftPct = (left / containerRect.width) * 100
  const topPct = (top / containerRect.height) * 100
  // 标记本身有固定尺寸，定位在边缘时会有一半跑到可视区域外；
  // 用半个标记尺寸作为边距进行钳制，确保标记始终可见。
  const marginLeft = (MARKER_SIZE / 2 / containerRect.width) * 100
  const marginTop = (MARKER_SIZE / 2 / containerRect.height) * 100
  return {
    left: Math.max(marginLeft, Math.min(100 - marginLeft, leftPct)),
    top: Math.max(marginTop, Math.min(100 - marginTop, topPct)),
  }
}
