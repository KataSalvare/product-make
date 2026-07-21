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

  return (
    <div
      className={[
        'flex flex-col border-l shadow-xl',
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200',
        // 移动端：从右侧滑出的固定抽屉，无遮罩，方便快速切换
        'fixed inset-y-0 right-0 z-[1000] w-[320px]',
        // PC：作为布局的一部分并排显示，原型完整可见
        'lg:static lg:w-[420px] lg:flex-shrink-0',
      ].join(' ')}
    >
      {/* 头部 */}
      <div className={`flex items-center justify-between px-4 py-3 border-b flex-shrink-0 ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
        <div>
          <h2 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{currentPage.label}</h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{currentPage.dirName}</p>
        </div>
        <button
          onClick={onClose}
          className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-600'}`}
        >
          <XIcon size={18} />
        </button>
      </div>

      {/* Tab 切换 */}
      <div className={`flex border-b flex-shrink-0 ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
        <button
          onClick={() => setDocTab('spec')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
            docTab === 'spec'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <FileText size={15} />
          PRD 文档
        </button>
        <button
          onClick={() => setDocTab('annotations')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
            docTab === 'annotations'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <MapPin size={15} />
          标注说明
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>
            {annotations.length}
          </span>
        </button>
      </div>

      {/* 内容 */}
      <div className={`flex-1 overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
        {docTab === 'spec' ? (
          <div className="h-full overflow-y-auto px-5 py-4">
            {docLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full" />
              </div>
            ) : docContent ? (
              <pre className={`whitespace-pre-wrap font-mono text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-800'}`}>
                {docContent}
              </pre>
            ) : (
              <div className={`text-center py-20 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>加载失败</div>
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
