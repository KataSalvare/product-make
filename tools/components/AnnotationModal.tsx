import { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react'
import { X, Plus, Trash2, Check } from 'lucide-react'
import { DEFAULT_CATEGORY_KEYS, type Annotation, type AnnotationCategory } from '../lib/annotations'

export type Theme = 'light' | 'dark'

interface AnnotationModalProps {
  isOpen: boolean
  onClose: () => void
  annotation: Annotation | null
  annotations: Annotation[]
  categories: AnnotationCategory[]
  theme: Theme
  anchor: { x: number; y: number }
  readOnly?: boolean
  onSave: (annotation: Annotation) => void
  onDelete: (id: string) => void
  onAddCategory: (category: AnnotationCategory) => void
  onDeleteCategory: (key: string) => void
  onSwitchAnnotation?: (id: string) => void
  onAddRelatedAnnotation?: (selector: string, category: string) => void
}

const PRESET_COLORS = [
  '#3b82f6', '#f97316', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f59e0b', '#6366f1'
]

const CORNERS: { key: NonNullable<Annotation['position']>; label: string }[] = [
  { key: 'top-left', label: '左上' },
  { key: 'top-right', label: '右上' },
  { key: 'bottom-left', label: '左下' },
  { key: 'bottom-right', label: '右下' },
]

const pickColor = (categories: AnnotationCategory[]): string => {
  const used = new Set(categories.map((c) => c.color))
  return PRESET_COLORS.find((c) => !used.has(c)) ?? '#6b7280'
}

export default function AnnotationModal({
  isOpen,
  onClose,
  annotation,
  annotations,
  categories,
  theme,
  anchor,
  readOnly = false,
  onSave,
  onDelete,
  onAddCategory,
  onDeleteCategory,
  onSwitchAnnotation,
  onAddRelatedAnnotation,
}: AnnotationModalProps) {
  const isDark = theme === 'dark'
  const isNew = annotation?.title === '' && annotation?.content === ''
  const canEdit = !readOnly
  const modalRef = useRef<HTMLDivElement>(null)

  const [form, setForm] = useState({
    title: annotation?.title || '',
    content: annotation?.content || '',
    category: annotation?.category || categories[0]?.key || 'other',
    position: annotation?.position || 'top-left',
  })

  const [showCategoryInput, setShowCategoryInput] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  // 当传入的 annotation 变化时同步表单
  useEffect(() => {
    queueMicrotask(() =>
      setForm({
        title: annotation?.title || '',
        content: annotation?.content || '',
        category: annotation?.category || categories[0]?.key || 'other',
        position: annotation?.position || 'top-left',
      })
    )
  }, [annotation, categories])

  // ESC 关闭弹窗
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleSave = () => {
    if (!annotation) return
    onSave({
      ...annotation,
      title: form.title.trim(),
      content: form.content.trim(),
      category: form.category,
      position: form.position as NonNullable<Annotation['position']>,
    })
    onClose()
  }

  const handleAddCategory = () => {
    const name = newCategoryName.trim()
    if (!name) return
    const key = `cat-${Date.now()}`
    onAddCategory({ key, label: name, color: pickColor(categories) })
    setNewCategoryName('')
    setShowCategoryInput(false)
  }

  const categoryOrder = useMemo(() => new Map(categories.map((c, i) => [c.key, i])), [categories])

  const elementAnnotations = useMemo(() => {
    if (!annotation?.selector) return []
    return annotations
      .filter((a) => a.selector === annotation.selector)
      .sort((a, b) => (categoryOrder.get(a.category) ?? Infinity) - (categoryOrder.get(b.category) ?? Infinity))
  }, [annotations, annotation, categoryOrder])

  const tabAnnotations = useMemo(() => {
    if (!annotation) return elementAnnotations
    if (elementAnnotations.some((a) => a.id === annotation.id)) return elementAnnotations
    return [...elementAnnotations, annotation]
  }, [elementAnnotations, annotation])

  const unusedCategories = useMemo(
    () => categories.filter((c) => !tabAnnotations.some((a) => a.category === c.key)),
    [categories, tabAnnotations]
  )

  // 弹窗定位：基于可用空间选择最优象限，确保完整可见
  const MODAL_WIDTH = 360
  const estimatedStyle = useMemo(() => {
    const padding = 16
    const gap = 8
    const markerHalf = 10 // w-5/h-5 = 20px，中心到边缘为 10px
    const vw = window.innerWidth
    const vh = window.innerHeight
    // 编辑模式内容较多，预留更高；查看模式更紧凑
    const isEdit = !readOnly
    const width = Math.min(MODAL_WIDTH, vw - 32)
    const height = Math.min(isEdit ? 520 : 260, vh * 0.85)

    // 水平方向：优先右侧，右侧放不下则翻到左侧
    let left = anchor.x + markerHalf + gap
    if (left + width > vw - padding) {
      left = anchor.x - markerHalf - gap - width
    }
    left = Math.max(padding, Math.min(left, vw - width - padding))

    // 垂直方向：优先空间更大的半边（上/下）
    const spaceBelow = vh - padding - (anchor.y + markerHalf + gap)
    const spaceAbove = anchor.y - markerHalf - gap - padding
    let top: number
    if (spaceBelow >= height) {
      top = anchor.y + markerHalf + gap
    } else if (spaceAbove >= height) {
      top = anchor.y - markerHalf - gap - height
    } else {
      // 上下都不够，贴向空间较大的一侧
      top = spaceBelow >= spaceAbove ? vh - height - padding : padding
    }

    return { left, top }
  }, [anchor, readOnly])

  // 根据实际渲染尺寸直接修正 DOM 位置，避免估算偏差导致遮挡
  useLayoutEffect(() => {
    if (!isOpen || !modalRef.current) return
    const el = modalRef.current
    const rect = el.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    const padding = 16
    let left = rect.left
    let top = rect.top
    if (left + rect.width > vw - padding) {
      left = vw - rect.width - padding
    }
    if (left < padding) left = padding
    if (top + rect.height > vh - padding) {
      top = vh - rect.height - padding
    }
    if (top < padding) top = padding
    el.style.left = `${left}px`
    el.style.top = `${top}px`
  }, [isOpen, estimatedStyle])

  if (!isOpen || !annotation) return null

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none">
      <div
        ref={modalRef}
        style={estimatedStyle}
        className={[
          'absolute pointer-events-auto w-[360px] max-w-[calc(100vw-32px)] max-h-[80vh] flex flex-col rounded-xl shadow-2xl overflow-hidden',
          'origin-top-left transition-transform duration-150 ease-out',
          isDark ? 'bg-slate-900' : 'bg-white',
        ].join(' ')}
      >
        {/* 头部：编辑模式保留标题栏，查看模式只保留右上角关闭按钮 */}
        {canEdit ? (
          <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
            <div>
              <h2 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {isNew ? '新增批注' : '编辑批注'}
              </h2>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                {isNew ? '为选中的元素添加说明' : `标记 #${annotation.number}`}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={onClose}
            className={`absolute top-2 right-2 z-10 p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-600'}`}
          >
            <X size={16} />
          </button>
        )}

        {/* 同一元素分类切换 */}
        <div className={`px-4 py-2 border-b ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
          <div className="flex flex-wrap gap-1.5">
            {tabAnnotations.map((a) => {
                const cat = categories.find((c) => c.key === a.category)
                if (!cat) return null
                const isActive = a.id === annotation.id
                return (
                  <button
                    key={a.id}
                    onClick={() => onSwitchAnnotation?.(a.id)}
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium border transition-opacity hover:opacity-80"
                    style={{
                      borderColor: cat.color,
                      backgroundColor: isActive ? cat.color : isDark ? `${cat.color}25` : `${cat.color}15`,
                      color: isActive ? '#ffffff' : cat.color,
                    }}
                  >
                    {cat.label}
                  </button>
                )
              })}
              {canEdit && !isNew && unusedCategories.length > 0 && (
                <button
                  onClick={() => {
                    const cat = unusedCategories[0]
                    if (cat) onAddRelatedAnnotation?.(annotation.selector || '', cat.key)
                  }}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium border border-dashed transition-colors ${
                    isDark ? 'border-slate-600 text-slate-400 hover:bg-slate-800' : 'border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Plus size={10} />
                  新增分类
                </button>
              )}
          </div>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* 标题 */}
          <div>
            {canEdit ? (
              <>
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>标题</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="例如：登录按钮交互"
                  className={`w-full px-3 py-1.5 text-sm rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </>
            ) : (
              <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{annotation.title}</h3>
            )}
          </div>

          {/* 内容 */}
          <div>
            {canEdit ? (
              <>
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>详细说明</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  placeholder="描述该元素的交互、业务逻辑或注意事项"
                  rows={3}
                  className={`w-full px-3 py-1.5 text-sm rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </>
            ) : (
              <p className={`text-sm whitespace-pre-wrap ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{annotation.content}</p>
            )}
          </div>

          {/* 位置（仅编辑模式） */}
          {canEdit && (
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>标记位置</label>
              <div className="grid grid-cols-4 gap-2">
                {CORNERS.map((corner) => (
                  <button
                    key={corner.key}
                    onClick={() => setForm((f) => ({ ...f, position: corner.key }))}
                    className={[
                      'px-2 py-1.5 text-xs rounded-lg border transition-colors',
                      form.position === corner.key
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : isDark
                          ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50',
                    ].join(' ')}
                  >
                    {corner.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 分类（仅编辑模式） */}
          {canEdit && (
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>分类</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setForm((f) => ({ ...f, category: cat.key }))}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors group"
                    style={{
                      borderColor: cat.color,
                      backgroundColor: form.category === cat.key ? cat.color : `${cat.color}15`,
                      color: form.category === cat.key ? '#ffffff' : cat.color,
                    }}
                  >
                    {form.category === cat.key && <Check size={10} />}
                    <span>{cat.label}</span>
                    {!DEFAULT_CATEGORY_KEYS.includes(cat.key) && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteCategory(cat.key)
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-black/10 rounded"
                        title="删除分类"
                      >
                        <X size={10} />
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {showCategoryInput ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddCategory()
                      if (e.key === 'Escape') {
                        setShowCategoryInput(false)
                        setNewCategoryName('')
                      }
                    }}
                    placeholder="新分类名称"
                    autoFocus
                    className={`flex-1 px-3 py-1.5 text-xs rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                    }`}
                  />
                  <button
                    onClick={handleAddCategory}
                    className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    onClick={() => {
                      setShowCategoryInput(false)
                      setNewCategoryName('')
                    }}
                    className={`p-1 rounded-lg ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowCategoryInput(true)}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Plus size={12} />
                  新增分类
                </button>
              )}
            </div>
          )}


        </div>

        {/* 底部（仅编辑模式） */}
        {canEdit && (
          <div className={`flex items-center justify-between px-4 py-3 border-t ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
            {!isNew ? (
              <button
                onClick={() => {
                  onDelete(annotation.id)
                  onClose()
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 size={12} />
                <span>删除</span>
              </button>
            ) : (
              <div />
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1.5 text-xs bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
              >
                保存到草稿
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
