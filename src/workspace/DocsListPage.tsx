import React from 'react'
import { NavLink } from 'react-router-dom'
import { ChevronRight, FileText } from 'lucide-react'
import { docModules } from '@tools/config/docs'

export const DocsListPage: React.FC = () => {
  const docs = Object.entries(docModules).map(([path]) => {
    const match = path.match(/\.\.\/\.\.\/src\/docs\/(.+)\.md$/)
    if (match) {
      const fileName = match[1]
      return { id: fileName, name: fileName, path: `/doc/${fileName}` }
    }
    return null
  }).filter(Boolean) as { id: string; name: string; path: string }[]

  return (
    <div className="h-full overflow-auto p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">项目文档</h1>
          <p className="text-gray-500 mt-2">浏览和查看项目相关文档</p>
        </div>

        <div className="space-y-3">
          {docs.map(doc => (
            <NavLink
              key={doc.id}
              to={doc.path}
              className="flex items-center gap-4 p-4 bg-white rounded-lg border hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="text-blue-600" size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900">{doc.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{doc.id}.md</p>
              </div>
              <ChevronRight className="text-gray-400 flex-shrink-0" size={18} />
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}
