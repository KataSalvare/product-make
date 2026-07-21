import { useState, useMemo } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { Annotation, AnnotationCategory } from '../lib/annotations'

export type Theme = 'light' | 'dark'

interface AnnotationPanelProps {
  annotations: Annotation[]
  categories: AnnotationCategory[]
  selectedCategories: Set<string>
  onToggleCategory: (key: string) => void
  selectedId: string | null
  theme: Theme
  onSelect: (id: string, clientX: number, clientY: number) => void
}

export default function AnnotationPanel({
  annotations,
  categories,
  selectedCategories,
  onToggleCategory,
  selectedId,
  theme,
  onSelect,
}: AnnotationPanelProps) {
  const isDark = theme === 'dark'
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(categories.map((c) => c.key)))

  const grouped = useMemo(() => {
    const map: Record<string, Annotation[]> = {}
    categories.forEach((c) => {
      map[c.key] = annotations.filter((a) => a.category === c.key).sort((a, b) => a.number - b.number)
    })
    return map
  }, [annotations, categories])

  const toggleExpand = (key: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const visibleCategories = categories.filter((c) => selectedCategories.has(c.key))

  return (
    <div className="h-full flex flex-col">
      {/* 分类筛选 */}
      <div className={`px-4 py-3 border-b ${isDark ? 'border-slate-800' : 'border-gray-100'}`}>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategories.has(cat.key)
            const count = grouped[cat.key]?.length || 0
            return (
              <button
                key={cat.key}
                onClick={() => onToggleCategory(cat.key)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border transition-opacity hover:opacity-80"
                style={{
                  borderColor: cat.color,
                  backgroundColor: isSelected
                    ? cat.color
                    : isDark
                      ? `${cat.color}25`
                      : `${cat.color}15`,
                  color: isSelected ? '#ffffff' : cat.color,
                }}
              >
                <span className="font-medium">{cat.label}</span>
                <span
                  className="text-[10px] px-1 py-0 rounded-full"
                  style={{
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : isDark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.6)',
                    color: isSelected ? '#ffffff' : cat.color,
                  }}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Annotation list */}
      <div className={`flex-1 overflow-y-auto p-2 space-y-1 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
        {visibleCategories.length === 0 && (
          <div className={`px-3 py-8 text-center text-sm ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
            请选择分类以查看批注
          </div>
        )}
        {visibleCategories.map((cat) => {
          const items = grouped[cat.key] || []
          const isExpanded = expandedCategories.has(cat.key)

          return (
            <div key={cat.key} className="rounded-lg overflow-hidden">
              <button
                onClick={() => toggleExpand(cat.key)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium transition-colors ${
                  isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className={`${isDark ? 'text-slate-200' : 'text-gray-900'}`}>{cat.label}</span>
                  <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>({items.length})</span>
                </div>
                {isExpanded ? (
                  <ChevronDown size={14} className={isDark ? 'text-slate-500' : 'text-gray-400'} />
                ) : (
                  <ChevronRight size={14} className={isDark ? 'text-slate-500' : 'text-gray-400'} />
                )}
              </button>

              {isExpanded && (
                <div className="pb-1">
                  {items.length === 0 ? (
                    <div className={`px-3 py-2 text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>暂无标注</div>
                  ) : (
                    items.map((item) => (
                      <button
                        key={item.id}
                        onClick={(e) => onSelect(item.id, e.clientX, e.clientY)}
                        className={[
                          'w-full text-left px-3 py-2 rounded-md mx-1 mb-1 text-sm transition-colors',
                          selectedId === item.id
                            ? isDark
                              ? 'bg-blue-900/30 text-blue-300'
                              : 'bg-blue-50 text-blue-700'
                            : isDark
                              ? 'text-slate-300 hover:bg-slate-800'
                              : 'text-gray-700 hover:bg-gray-50',
                        ].join(' ')}
                      >
                        <div className="flex items-start gap-2">
                          <span
                            className="flex-shrink-0 w-5 h-5 rounded-full text-xs text-white flex items-center justify-center font-bold"
                            style={{ backgroundColor: cat.color }}
                          >
                            {item.number}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{item.title || '未命名标注'}</div>
                            <div className={`text-xs line-clamp-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                              {item.content}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
