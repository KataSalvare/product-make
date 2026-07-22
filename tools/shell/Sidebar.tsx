import { useMemo, useState } from 'react'
import { FileText, Monitor, Palette, Smartphone, XIcon, Search, ChevronRight } from 'lucide-react'
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
}

const PageList = ({ filteredPages, isDark, icon: Icon }: PageListProps) => {
  return (
    <div className="space-y-0.5">
      {filteredPages.map((page, index) => (
        <NavLink
          key={page.path}
          to={page.path}
          title={page.label}
          className={({ isActive }) =>
            `group flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
              isActive
                ? 'tool-menu-active-light dark:tool-menu-active-dark shadow-sm'
                : isDark
                  ? 'text-[#a0a0a0] hover:bg-[#333333] hover:text-[#f5f2ed]'
                  : 'text-[#6b6b6b] hover:bg-[#efe9e0] hover:text-[#1c1c1c]'
            }`
          }
          style={{ animationDelay: `${index * 30}ms` }}
        >
          <Icon size={15} className={isDark ? 'opacity-70' : 'opacity-80'} />
          <span className="truncate font-medium">{page.label}</span>
          <ChevronRight size={12} className="ml-auto opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
        </NavLink>
      ))}
    </div>
  )
}

interface ThemeNavProps {
  isDark: boolean
  searchQuery: string
}

const ThemeNav = ({ isDark, searchQuery }: ThemeNavProps) => {
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
    <div className="space-y-0.5">
      <div className={`px-3 py-2 text-[10px] font-semibold uppercase tracking-widest ${isDark ? 'text-[#606060]' : 'text-[#a0a0a0]'}`}>
        设计系统主题
      </div>
      {filteredThemes.map((theme, index) => (
        <NavLink
          key={theme.id}
          to={`/theme/${theme.id}`}
          title={theme.name}
          className={({ isActive }) =>
            `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
              isActive
                ? 'tool-menu-active-light dark:tool-menu-active-dark shadow-sm'
                : isDark
                  ? 'text-[#a0a0a0] hover:bg-[#333333] hover:text-[#f5f2ed]'
                  : 'text-[#6b6b6b] hover:bg-[#efe9e0] hover:text-[#1c1c1c]'
            }`
          }
          style={{ animationDelay: `${index * 30}ms` }}
        >
          {({ isActive }) => (
            <>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? (isDark ? 'bg-[#ffffff]/8' : 'bg-[#1c1c1c]/6') : (isDark ? 'bg-[#333333]' : 'bg-[#efe9e0]')}`}>
                <Palette size={13} className={isActive ? 'tool-accent' : ''} />
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <span className="truncate font-medium">{theme.name}</span>
                <span className={`text-xs ${isDark ? 'text-[#606060]' : 'text-[#a0a0a0]'}`}>{theme.description}</span>
              </div>
            </>
          )}
        </NavLink>
      ))}
    </div>
  )
}

interface DocNavProps {
  isDark: boolean
  searchQuery: string
}

const DocNav = ({ isDark, searchQuery }: DocNavProps) => {
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
    <div className="space-y-0.5">
      <div className={`px-3 py-2 text-[10px] font-semibold uppercase tracking-widest ${isDark ? 'text-[#606060]' : 'text-[#a0a0a0]'}`}>
        项目文档
      </div>
      {filteredDocs.map((doc, index) => (
        <NavLink
          key={doc.id}
          to={doc.path}
          title={doc.name}
          className={({ isActive }) =>
            `group flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
              isActive
                ? 'tool-menu-active-light dark:tool-menu-active-dark shadow-sm'
                : isDark
                  ? 'text-[#a0a0a0] hover:bg-[#333333] hover:text-[#f5f2ed]'
                  : 'text-[#6b6b6b] hover:bg-[#efe9e0] hover:text-[#1c1c1c]'
            }`
          }
          style={{ animationDelay: `${index * 30}ms` }}
        >
          {({ isActive }) => (
            <>
              <FileText size={15} className={isActive ? 'tool-accent' : ''} />
              <span className="truncate font-medium">{doc.name}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  )
}

export const Sidebar = ({ theme, projectName, onProjectNameChange, collapsed }: SidebarProps) => {
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
    <aside
      className={`flex flex-col h-screen z-[1000] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] border-r ${
        collapsed ? 'w-0 opacity-0 overflow-hidden border-r-0' : 'w-[260px] opacity-100'
      } ${isDark ? 'bg-[#161616]/95 border-[#ffffff]/8 tool-surface-dark' : 'bg-[#ffffff]/80 border-[#1c1c1c]/8 tool-surface-light'}`}
    >
      {!collapsed && (
        <>
          <div className={`flex items-center px-4 py-3.5 border-b ${isDark ? 'border-[#ffffff]/8' : 'border-[#1c1c1c]/8'}`}>
            <div className="flex-1 min-w-0">
              {isEditingName ? (
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onBlur={handleNameSubmit}
                  onKeyDown={handleNameKeyDown}
                  autoFocus
                  className={`w-full text-sm font-bold bg-transparent border-b-2 outline-none transition-colors ${
                    isDark
                      ? 'text-[#f5f2ed] border-[#f4a261] placeholder-[#606060]'
                      : 'text-[#1c1c1c] border-[#d65a31] placeholder-[#a0a0a0]'
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
                  className={`text-sm font-bold cursor-pointer transition-all truncate ${isDark ? 'text-[#f5f2ed]' : 'text-[#1c1c1c]'} hover:opacity-70`}
                >
                  {projectName}
                </h1>
              )}
              <p className={`text-[10px] mt-0.5 uppercase tracking-wider ${isDark ? 'text-[#606060]' : 'text-[#a0a0a0]'}`}>
                Prototype Workspace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 p-2">
            {tabs.map(tab => {
              const TabIcon = tab.icon
              const isActive = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 flex flex-col items-center justify-center gap-0.5 px-1 py-2 text-[10px] font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'tool-menu-active-light dark:tool-menu-active-dark shadow-sm'
                      : isDark
                        ? 'text-[#808080] hover:bg-[#252525] hover:text-[#f5f2ed]'
                        : 'text-[#808080] hover:bg-white hover:text-[#1c1c1c]'
                  }`}
                >
                  <TabIcon size={14} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          <div className="px-3 pb-2">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 focus-within:ring-2 ${
              isDark
                ? 'bg-[#333333] border-[#ffffff]/10 focus-within:border-[#c49378]/50 focus-within:ring-[#c49378]/15'
                : 'bg-white border-[#1c1c1c]/8 focus-within:border-[#c4785a]/40 focus-within:ring-[#c4785a]/12'
            }`}>
              <Search size={14} className={isDark ? 'text-[#606060]' : 'text-[#a0a0a0]'} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索..."
                className={`flex-1 bg-transparent text-xs outline-none min-w-0 ${isDark ? 'text-[#f5f2ed] placeholder-[#606060]' : 'text-[#1c1c1c] placeholder-[#a0a0a0]'}`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`p-0.5 rounded-md transition-colors ${isDark ? 'text-[#606060] hover:bg-[#404040]' : 'text-[#a0a0a0] hover:bg-[#efe9e0]'}`}
                >
                  <XIcon size={12} />
                </button>
              )}
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-2 pb-4">
            {activeTab === 'frontend' && (
              <PageList filteredPages={filteredPages} isDark={isDark} icon={Smartphone} />
            )}
            {activeTab === 'admin' && (
              <PageList filteredPages={filteredPages} isDark={isDark} icon={Monitor} />
            )}
            {activeTab === 'themes' && (
              <ThemeNav isDark={isDark} searchQuery={searchQuery} />
            )}
            {activeTab === 'docs' && (
              <DocNav isDark={isDark} searchQuery={searchQuery} />
            )}
          </nav>
        </>
      )}
    </aside>
  )
}
