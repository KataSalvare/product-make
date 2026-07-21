import React from 'react'
import { NavLink } from 'react-router-dom'
import { ChevronRight, Palette } from 'lucide-react'
import { getThemeInfo, themeModules } from '@tools/config/themes'

export const ThemesListPage: React.FC = () => {
  const themes = Object.keys(themeModules).map((path) => {
    const match = path.match(/\.\.\/\.\.\/src\/themes\/([^/]+)\//)
    if (match) {
      const dirName = match[1]
      const info = getThemeInfo(dirName)
      return { id: dirName, name: info.name, description: info.description }
    }
    return null
  }).filter(Boolean) as { id: string; name: string; description: string }[]

  return (
    <div className="h-full overflow-auto p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">主题设计系统</h1>
          <p className="text-gray-500 mt-2">管理和预览项目中的设计系统主题</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map(theme => (
            <NavLink
              key={theme.id}
              to={`/theme/${theme.id}`}
              className="block bg-white rounded-xl shadow-sm border hover:shadow-md hover:border-blue-300 transition-all p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Palette className="text-white" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900">{theme.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{theme.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">{theme.id}</span>
                  </div>
                </div>
                <ChevronRight className="text-gray-400 flex-shrink-0" size={20} />
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}
