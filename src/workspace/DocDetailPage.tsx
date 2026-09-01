import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { docModules } from '@tools/config/docs'
import MarkdownDocument from '@tools/components/MarkdownDocument'

export const DocDetailPage: React.FC = () => {
  const { docId } = useParams<{ docId: string }>()
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDoc = async () => {
      setLoading(true)
      const docKey = `../../src/docs/${docId}.md`
      const loader = docModules[docKey]
      if (loader) {
        try {
          const docContent = await loader() as string
          setContent(docContent)
        } catch {
          setContent('无法加载文档内容。')
        }
      } else {
        setContent('文档不存在。')
      }
      setLoading(false)
    }
    loadDoc()
  }, [docId])

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <NavLink to="/docs" className="hover:text-gray-900">文档</NavLink>
          <ChevronRight size={14} />
          <span className="text-gray-900">{docId}</span>
        </div>
        <h1 className="text-xl font-semibold text-gray-900">{docId}</h1>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full" />
            </div>
          ) : content ? (
            <MarkdownDocument content={content} />
          ) : (
            <div className="text-gray-400 text-center py-20">文档加载失败</div>
          )}
        </div>
      </div>
    </div>
  )
}
