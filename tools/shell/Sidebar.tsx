import React, { useMemo, useState } from 'react'
import { FileText, Monitor, Palette, Smartphone, XIcon, Search } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { pages, type PageCategory } from '../config/pages'
import { docModules } from '../config/docs'
import { getThemeInfo, themeModules } from '../config/themes'
import type { Theme } from '../lib/shortcuts'

interface SidebarProps {
  theme: Theme
  projectName: string
  onProjectNameChange: (name: string) => void
  collapsed: boolean
}

interface PageListProps {
  filteredPages: typeof pages
  isDark: boolean
  icon: typeof Smartphone
  collapsed: boolean
}

const PageList: React.FC<PageListProps> = ({ filteredPages, isDark, icon: Icon, collapsed }) => {
  if (collapsed) return null
  return (
    <div className="space-y-1">
      {filteredPages.map(page => (
        <NavLink
          key={page.path}
          to={page.path}
          title={page.label}
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive
                ? 'bg-blue-600 text-white'
                : isDark
                  ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`
          }
        >
          <Icon size={16} />
          <span className="truncate">{page.label}</span>
        </NavLink>
      ))}
    </div>
  )
}

interface ThemeNavProps {
  isDark: boolean
  searchQuery: string
  collapsed: boolean
}

const ThemeNav: React.FC<ThemeNavProps> = ({ isDark, searchQuery, collapsed }) => {
  if (collapsed) return null
  const themes = Object.keys(themeModules).map((path) => {
    const match = path.match(/\.\.\/\.\.\/src\/themes\/([^/]+)\//)
    if (match) {
      const dirName = match[1]
      const info = getThemeInfo(dirName)
      return { id: dirName, name: info.name, description: info.description }
    }
    return null
  }).filter(Boolean) as { id: string; name: string; description: string }[]

  const query = searchQuery.trim().toLowerCase()
  const filteredThemes = query
    ? themes.filter(theme => theme.name.toLowerCase().includes(query) || theme.description.toLowerCase().includes(query))
    : themes

  return (
    <div className="space-y-1">
      <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
        设计系统主题
      </div>
      {filteredThemes.map(theme => (
        <NavLink
          key={theme.id}
          to={`/theme/${theme.id}`}
          title={theme.name}
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive
                ? 'bg-blue-600 text-white'
                : isDark
                  ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`
          }
        >
          <Palette size={16} />
          <div className="flex-1 min-w-0 flex flex-col">
            <span className="truncate">{theme.name}</span>
            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{theme.description}</span>
          </div>
        </NavLink>
      ))}
    </div>
  )
}

interface DocNavProps {
  isDark: boolean
  searchQuery: string
  collapsed: boolean
}

const DocNav: React.FC<DocNavProps> = ({ isDark, searchQuery, collapsed }) => {
  if (collapsed) return null
  const docs = Object.entries(docModules).map(([path]) => {
    const match = path.match(/\.\.\/\.\.\/src\/docs\/(.+)\.md$/)
    if (match) {
      const fileName = match[1]
      return { id: fileName, name: fileName, path: `/doc/${fileName}` }
    }
    return null
  }).filter(Boolean) as { id: string; name: string; path: string }[]

  const query = searchQuery.trim().toLowerCase()
  const filteredDocs = query
    ? docs.filter(doc => doc.name.toLowerCase().includes(query))
    : docs

  return (
    <div className="space-y-1">
      <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
        项目文档
      </div>
      {filteredDocs.map(doc => (
        <NavLink
          key={doc.id}
          to={doc.path}
          title={doc.name}
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive
                ? 'bg-blue-600 text-white'
                : isDark
                  ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`
          }
        >
          <FileText size={16} />
          <span className="truncate">{doc.name}</span>
        </NavLink>
      ))}
    </div>
  )
}

export const Sidebar: React.FC<SidebarProps> = ({ theme, projectName, onProjectNameChange, collapsed }) => {
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState(projectName)
  const [activeTab, setActiveTab] = useState<PageCategory | 'themes' | 'docs'>('frontend')
  const [searchQuery, setSearchQuery] = useState('')

  const isDark = theme === 'dark'

  const filteredPages = useMemo(() => {
    const categoryPages = pages.filter(p => p.category === activeTab as PageCategory)
    const query = searchQuery.trim().toLowerCase()
    if (!query) return categoryPages
    return categoryPages.filter(p => p.label.toLowerCase().includes(query))
  }, [activeTab, searchQuery])

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      onProjectNameChange(tempName.trim())
    } else {
      setTempName(projectName)
    }
    setIsEditingName(false)
  }

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit()
    } else if (e.key === 'Escape') {
      setTempName(projectName)
      setIsEditingName(false)
    }
  }

  const tabs = [
    { key: 'frontend' as const, label: '前端', icon: Smartphone },
    { key: 'admin' as const, label: '后台', icon: Monitor },
    { key: 'themes' as const, label: '主题', icon: Palette },
    { key: 'docs' as const, label: '文档', icon: FileText },
  ]

  return (
    <aside className={`flex flex-col h-screen z-[1000] transition-all duration-300 ${collapsed ? 'w-0 opacity-0 overflow-hidden border-r-0' : 'w-64'} ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'} ${collapsed || isDark ? '' : 'border-r border-gray-200'}`}>
      {!collapsed && (
        <>
          <div className={`flex items-center border-b ${isDark ? 'border-slate-800' : 'border-gray-200'} p-3`}>
            <div className="flex-1 min-w-0">
              {isEditingName ? (
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onBlur={handleNameSubmit}
                  onKeyDown={handleNameKeyDown}
                  autoFocus
                  className={`w-full text-sm font-bold bg-transparent border-b-2 outline-none ${
                    isDark
                      ? 'text-white border-blue-500 placeholder-slate-500'
                      : 'text-gray-900 border-blue-500 placeholder-gray-400'
                  }`}
                  placeholder="输入项目名称"
                />
              ) : (
                <h1
                  onClick={() => {
                    setTempName(projectName)
                    setIsEditingName(true)
                  }}
                  title="点击编辑项目名称"
                  className="text-sm font-bold cursor-pointer hover:opacity-80 transition-opacity truncate"
                  style={{ color: isDark ? '#ffffff' : '#111827' }}
                >
                  {projectName}
                </h1>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 p-2">
            {tabs.map(tab => {
              const TabIcon = tab.icon
              const isActive = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-1 px-1 py-1.5 text-[10px] font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : isDark
                        ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <TabIcon size={12} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          <div className="p-2">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
              <Search size={14} className={isDark ? 'text-slate-400' : 'text-gray-400'} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索页面..."
                className={`flex-1 bg-transparent text-xs outline-none min-w-0 ${isDark ? 'text-white placeholder-slate-500' : 'text-gray-900 placeholder-gray-500'}`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`p-0.5 rounded transition-colors ${isDark ? 'text-slate-400 hover:bg-slate-700' : 'text-gray-400 hover:bg-gray-200'}`}
                >
                  <XIcon size={12} />
                </button>
              )}
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-2">
            {activeTab === 'frontend' && (
              <PageList filteredPages={filteredPages} isDark={isDark} icon={Smartphone} collapsed={collapsed} />
            )}
            {activeTab === 'admin' && (
              <PageList filteredPages={filteredPages} isDark={isDark} icon={Monitor} collapsed={collapsed} />
            )}
            {activeTab === 'themes' && (
              <ThemeNav isDark={isDark} searchQuery={searchQuery} collapsed={collapsed} />
            )}
            {activeTab === 'docs' && (
              <DocNav isDark={isDark} searchQuery={searchQuery} collapsed={collapsed} />
            )}
          </nav>
        </>
      )}
    </aside>
  )
}
