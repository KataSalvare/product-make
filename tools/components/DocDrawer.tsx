import { useState, useEffect, useCallback } from 'react'
import { FileText, MapPin, XIcon } from 'lucide-react'
import AnnotationPanel from './AnnotationPanel'
import type { Annotation, AnnotationCategory } from '../lib/annotations'

export type Theme = 'light' | 'dark'

export interface PageItem {
  path: string
  label: string
  dirName: string
}

interface DocDrawerProps {
  isOpen: boolean
  onClose: () => void
  currentPage: PageItem | undefined
  docTab: 'spec' | 'annotations'
  setDocTab: (tab: 'spec' | 'annotations') => void
  theme: Theme
  annotations: Annotation[]
  categories: AnnotationCategory[]
  selectedCategories: Set<string>
  onToggleCategory: (key: string) => void
  selectedId: string | null
  onSelectAnnotation: (id: string, clientX: number, clientY: number) => void
}

const specGlob = import.meta.glob('../../src/prototypes/*/spec.md', { query: '?raw', import: 'default' })

function getSpecKey(dirName: string): string {
  return `../../src/prototypes/${dirName}/spec.md`
}

export default function DocDrawer({
  isOpen,
  onClose,
  currentPage,
  docTab,
  setDocTab,
  theme,
  annotations,
  categories,
  selectedCategories,
  onToggleCategory,
  selectedId,
  onSelectAnnotation,
}: DocDrawerProps) {
  const isDark = theme === 'dark'
  const [docContent, setDocContent] = useState<string | null>(null)
  const [docLoading, setDocLoading] = useState(false)

  const loadSpec = useCallback(async () => {
    if (!currentPage) {
      setDocContent(null)
      return
    }
    setDocLoading(true)
    setDocContent(null)
    const key = getSpecKey(currentPage.dirName)
    const loader = specGlob[key]
    if (loader) {
      try {
        const content = await loader() as string
        setDocContent(content)
      } catch {
        setDocContent('无法加载文档。')
      }
    } else {
      setDocContent('暂无 PRD 文档。')
    }
    setDocLoading(false)
  }, [currentPage])

  // 切换到 PRD 文档时自动加载
  useEffect(() => {
    if (isOpen && docTab === 'spec') {
      queueMicrotask(() => loadSpec())
    }
  }, [isOpen, docTab, loadSpec])

  if (!isOpen || !currentPage) return null

  const panelClass = isDark ? 'tool-panel-dark' : 'tool-panel-light'
  const borderClass = isDark ? 'border-[#ffffff]/8' : 'border-[#1c1c1c]/8'
  const textPrimary = isDark ? 'text-[#f5f2ed]' : 'text-[#1c1c1c]'
  const textSecondary = isDark ? 'text-[#a0a0a0]' : 'text-[#6b6b6b]'
  const textMuted = isDark ? 'text-[#808080]' : 'text-[#a0a0a0]'
  const hoverSurface = isDark ? 'hover:bg-[#333333]' : 'hover:bg-[#efe9e0]'

  return (
    <div
      className={[
        'flex flex-col border-l z-[1000] animate-tool-slide-right',
        // 移动端：从右侧滑出的固定抽屉，无遮罩，方便快速切换
        'fixed inset-y-0 right-0 w-[320px]',
        // PC：作为布局的一部分并排显示，原型完整可见
        'lg:static lg:w-[420px] lg:flex-shrink-0',
        panelClass,
        borderClass,
      ].join(' ')}
    >
      {/* 头部 */}
      <div className={`flex items-center justify-between px-5 py-4 border-b ${borderClass}`}>
        <div className="min-w-0">
          <h2 className={`text-sm font-bold truncate ${textPrimary}`}>{currentPage.label}</h2>
          <p className={`text-xs mt-0.5 truncate ${textMuted}`}>{currentPage.dirName}</p>
        </div>
        <button
          onClick={onClose}
          className={`p-2 rounded-xl transition-all duration-200 ${textSecondary} ${hoverSurface}`}
        >
          <XIcon size={18} />
        </button>
      </div>

      {/* Tab 切换 */}
      <div className={`flex border-b ${borderClass}`}>
        <button
          onClick={() => setDocTab('spec')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all duration-200 ${
            docTab === 'spec'
              ? 'tool-accent border-b-2 border-current'
              : `${textSecondary} ${hoverSurface}`
          }`}
        >
          <FileText size={15} />
          PRD 文档
        </button>
        <button
          onClick={() => setDocTab('annotations')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all duration-200 ${
            docTab === 'annotations'
              ? 'tool-accent border-b-2 border-current'
              : `${textSecondary} ${hoverSurface}`
          }`}
        >
          <MapPin size={15} />
          标注说明
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isDark ? 'bg-[#ffffff]/10 text-[#a0a0a0]' : 'bg-[#1c1c1c]/6 text-[#6b6b6b]'}`}>
            {annotations.length}
          </span>
        </button>
      </div>

      {/* 内容 */}
      <div className="flex-1 overflow-hidden">
        {docTab === 'spec' ? (
          <div className="h-full overflow-y-auto px-5 py-5">
            {docLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-6 h-6 border-2 border-current border-t-transparent rounded-full tool-accent" />
              </div>
            ) : docContent ? (
              <pre className={`whitespace-pre-wrap font-mono text-sm leading-relaxed ${textSecondary}`}>
                {docContent}
              </pre>
            ) : (
              <div className={`text-center py-20 ${textMuted}`}>加载失败</div>
            )}
          </div>
        ) : (
          <AnnotationPanel
            annotations={annotations}
            categories={categories}
            selectedCategories={selectedCategories}
            onToggleCategory={onToggleCategory}
            selectedId={selectedId}
            theme={theme}
            onSelect={onSelectAnnotation}
          />
        )}
      </div>
    </div>
  )
}
