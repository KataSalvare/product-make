import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { getDefaultComponent } from '@tools/config/pages'
import { getThemeInfo, themeDesignDocs, themeModules } from '@tools/config/themes'

export const ThemeDetailPage: React.FC = () => {
  const { themeId } = useParams<{ themeId: string }>()
  const [ThemeComponent, setThemeComponent] = useState<React.ComponentType | null>(null)
  const [designDoc, setDesignDoc] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTheme = async () => {
      setLoading(true)
      const themePath = Object.keys(themeModules).find(path => {
        const match = path.match(/\.\.\/\.\.\/src\/themes\/([^/]+)\//)
        return match && match[1] === themeId
      })

      const tasks: Promise<void>[] = []

      if (themePath) {
        tasks.push(
          themeModules[themePath]().then(mod => {
            setThemeComponent(() => getDefaultComponent(mod))
          })
        )
      } else {
        setThemeComponent(null)
      }

      const docKey = `../../src/themes/${themeId}/DESIGN.md`
      const loader = themeDesignDocs[docKey]
      if (loader) {
        tasks.push(
          loader().then((content) => {
            setDesignDoc(content as string)
          }).catch(() => {
            setDesignDoc('无法加载设计文档。')
          })
        )
      } else {
        setDesignDoc('暂无设计文档。')
      }

      await Promise.all(tasks)
      setLoading(false)
    }
    loadTheme()
  }, [themeId])

  const info = themeId ? getThemeInfo(themeId) : { name: '未知主题', description: '' }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <NavLink to="/themes" className="hover:text-gray-900">主题列表</NavLink>
          <ChevronRight size={14} />
          <span className="text-gray-900">{info.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{info.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{info.description}</p>
          </div>
          <NavLink
            to="/themes"
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            返回主题列表
          </NavLink>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-lg shadow-sm border p-6 min-h-[600px]">
            <h2 className="text-lg font-medium text-gray-900 mb-4">主题预览</h2>
            {ThemeComponent ? React.createElement(ThemeComponent) : <div className="text-gray-500">主题组件加载失败</div>}
          </div>
        </div>

        <div className="w-[400px] border-l bg-white overflow-auto">
          <div className="p-4 border-b">
            <h3 className="font-medium text-gray-900">设计规范</h3>
            <p className="text-xs text-gray-500 mt-1">{themeId}/DESIGN.md</p>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full" />
              </div>
            ) : designDoc ? (
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 leading-relaxed">
                {designDoc}
              </pre>
            ) : (
              <div className="text-gray-400 text-center py-10">暂无设计文档</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
