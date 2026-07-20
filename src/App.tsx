import { BrowserRouter, Routes, Route, NavLink, useLocation, useParams } from 'react-router-dom'
import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Smartphone, Monitor, ChevronRight, FileText, XIcon, Keyboard, Sun, Moon, Palette, MousePointer, Trash2, Save, Eye, EyeOff, Pencil, Search } from 'lucide-react'
import AnnotationLayer from './components/AnnotationLayer'
import AnnotationModal from './components/AnnotationModal'
import DocDrawer from './components/DocDrawer'
import { useAnnotations } from './hooks/useAnnotations'
import type { Annotation } from './lib/annotations'
import { findElementBySelector, getElementPosition } from './lib/annotations'

// ==================== 主题类型 ====================
type Theme = 'light' | 'dark'

// 从 localStorage 加载主题
const loadTheme = (): Theme => {
  try {
    const saved = localStorage.getItem('prototype-theme')
    if (saved === 'dark' || saved === 'light') {
      return saved
    }
  } catch {
    // ignore
  }
  return 'dark' // 默认黑夜模式
}

// 保存主题到 localStorage
const saveTheme = (theme: Theme) => {
  try {
    localStorage.setItem('prototype-theme', theme)
  } catch {
    // ignore
  }
}

// ==================== 项目名称配置 ====================
const DEFAULT_PROJECT_NAME = '项目原型预览'

// 从 localStorage 加载项目名称
const loadProjectName = (): string => {
  try {
    const saved = localStorage.getItem('prototype-project-name')
    if (saved) {
      return saved
    }
  } catch {
    // ignore
  }
  return DEFAULT_PROJECT_NAME
}

// 保存项目名称到 localStorage
const saveProjectName = (name: string) => {
  try {
    localStorage.setItem('prototype-project-name', name)
  } catch {
    // ignore
  }
}

// ==================== 动态导入页面组件 ====================
// 使用 import.meta.glob 动态导入所有页面组件
// 导入所有 prototypes 下的目录，不限制前缀
const allModules = import.meta.glob('./prototypes/*/index.tsx', { eager: true })

// 过滤出前端页面和后台页面（根据路径是否包含 admin 判断）
const frontendModules: Record<string, unknown> = {}
const adminModules: Record<string, unknown> = {}

Object.entries(allModules).forEach(([path, mod]) => {
  // 提取目录名
  const match = path.match(/\.\/prototypes\/([^/]+)\//)
  if (match) {
    const dirName = match[1]
    // 根据目录名是否包含 admin 来判断是后台还是前端页面
    if (dirName.includes('admin')) {
      adminModules[path] = mod
    } else {
      frontendModules[path] = mod
    }
  }
})

// 页面路径映射配置
const frontendPageConfig: Record<string, { path: string; label: string }> = {
  'demo-register': { path: '/register', label: '注册' },
  'demo-login': { path: '/login', label: '登录' },
  'demo-login 20-22-24-906': { path: '/login2', label: '登录' },
  'demo-home': { path: '/home', label: '首页' },
  'demo-profile': { path: '/profile', label: '个人中心' },
}

const adminPageConfig: Record<string, { path: string; label: string }> = {
  'demo-admin-users': { path: '/admin/users', label: '用户管理' },
  'demo-admin-dashboard': { path: '/admin/dashboard', label: '仪表盘' },
  'demo-admin-orders': { path: '/admin/orders', label: '订单管理' },
}

// 提取默认组件
const getDefaultComponent = (mod: unknown): React.ComponentType => {
  const moduleWithDefault = mod as { default?: React.ComponentType }
  return moduleWithDefault?.default || (() => null)
}

// ==================== 主题动态加载 ====================
const themeModules = import.meta.glob('./themes/*/index.tsx', { eager: true })
const themeDesignDocs = import.meta.glob('./themes/*/DESIGN.md', { query: '?raw', import: 'default' })

// 提取主题信息
const getThemeInfo = (dirName: string): { name: string; description: string } => {
  const nameMap: Record<string, { name: string; description: string }> = {
    'equatorial-minimalism': { name: 'Equatorial Minimalism', description: '非洲即时通讯设计系统' },
  }
  return nameMap[dirName] || { name: dirName, description: '品牌主题设计' }
}

// ==================== 文档动态加载 ====================
const docModules = import.meta.glob('./docs/*.md', { query: '?raw', import: 'default' })

// ==================== 操作系统检测 ====================
const getOS = (): 'mac' | 'windows' | 'linux' | 'unknown' => {
  const userAgent = navigator.userAgent.toLowerCase()
  if (userAgent.includes('mac')) return 'mac'
  if (userAgent.includes('win')) return 'windows'
  if (userAgent.includes('linux')) return 'linux'
  return 'unknown'
}



// ==================== 快捷键配置类型 ====================
interface ShortcutConfig {
  copyToFigma: string    // 复制到 Figma
  openDoc: string        // 查看文档
  selectElement: string  // 批注选择元素
}

const DEFAULT_SHORTCUTS: ShortcutConfig = {
  copyToFigma: 'ctrl+cmd+c',    // Mac: Ctrl+Cmd+C, Win: Ctrl+Alt+C
  openDoc: 'ctrl+cmd+e',        // Mac: Ctrl+Cmd+E, Win: Ctrl+Alt+E
  selectElement: 'ctrl+cmd+s',  // Mac: Ctrl+Cmd+S, Win: Ctrl+Alt+S
}

// 从 localStorage 加载快捷键配置
const loadShortcuts = (): ShortcutConfig => {
  try {
    const saved = localStorage.getItem('prototype-shortcuts')
    if (saved) {
      return { ...DEFAULT_SHORTCUTS, ...JSON.parse(saved) }
    }
  } catch {
    // ignore
  }
  return DEFAULT_SHORTCUTS
}

// 保存快捷键配置到 localStorage
const saveShortcuts = (shortcuts: ShortcutConfig) => {
  try {
    localStorage.setItem('prototype-shortcuts', JSON.stringify(shortcuts))
  } catch {
    // ignore
  }
}

// 格式化快捷键显示
const formatShortcut = (shortcut: string): string => {
  const os = getOS()
  if (os === 'mac') {
    return shortcut
      .replace('ctrl', '⌃')
      .replace('cmd', '⌘')
      .replace('alt', '⌥')
      .replace('shift', '⇧')
      .toUpperCase()
  }
  return shortcut
    .replace('ctrl', 'Ctrl')
    .replace('alt', 'Alt')
    .replace('shift', 'Shift')
    .replace('cmd', 'Win')
}

// 解析快捷键字符串为按键检测函数
const parseShortcut = (shortcut: string): { ctrl: boolean; meta: boolean; alt: boolean; shift: boolean; key: string } => {
  const parts = shortcut.toLowerCase().split('+')
  return {
    ctrl: parts.includes('ctrl'),
    meta: parts.includes('cmd') || parts.includes('meta'),
    alt: parts.includes('alt'),
    shift: parts.includes('shift'),
    key: parts.find(p => !['ctrl', 'cmd', 'meta', 'alt', 'shift'].includes(p)) || ''
  }
}

// 检测快捷键是否匹配
const matchShortcut = (e: KeyboardEvent, shortcut: string): boolean => {
  const parsed = parseShortcut(shortcut)
  const key = e.key.toLowerCase()
  
  // 检查修饰键
  const ctrlMatch = parsed.ctrl === e.ctrlKey
  const metaMatch = parsed.meta === e.metaKey
  const altMatch = parsed.alt === e.altKey
  const shiftMatch = parsed.shift === e.shiftKey
  const keyMatch = parsed.key === key
  
  return ctrlMatch && metaMatch && altMatch && shiftMatch && keyMatch
}

// ==================== 页面配置 ====================
type PageCategory = 'frontend' | 'admin'

interface PageItem {
  path: string
  label: string
  component: React.ComponentType
  category: PageCategory
  dirName: string
}

// 动态生成页面配置
const generatePages = (): PageItem[] => {
  const pages: PageItem[] = []

  // 处理前端页面
  Object.entries(frontendModules).forEach(([filePath, mod]) => {
    // 从路径中提取目录名，例如 './prototypes/demo-login/index.tsx' -> 'demo-login'
    const match = filePath.match(/\.\/prototypes\/([^/]+)\//)
    if (match) {
      const dirName = match[1]
      const config = frontendPageConfig[dirName]
      if (config) {
        pages.push({
          path: config.path,
          label: config.label,
          component: getDefaultComponent(mod),
          category: 'frontend',
          dirName,
        })
      }
    }
  })

  // 处理后台页面
  Object.entries(adminModules).forEach(([filePath, mod]) => {
    const match = filePath.match(/\.\/prototypes\/([^/]+)\//)
    if (match) {
      const dirName = match[1]
      const config = adminPageConfig[dirName]
      if (config) {
        pages.push({
          path: config.path,
          label: config.label,
          component: getDefaultComponent(mod),
          category: 'admin',
          dirName,
        })
      }
    }
  })

  return pages
}

const pages = generatePages()

// ==================== 主题导航组件 ====================
interface ThemeNavProps {
  isDark: boolean
  searchQuery?: string
  collapsed?: boolean
}

const ThemeNav = ({ isDark, searchQuery = '', collapsed = false }: ThemeNavProps) => {
  const location = useLocation()

  // 动态生成主题列表
  const themes = Object.entries(themeModules).map(([path, mod]) => {
    const match = path.match(/\.\/themes\/([^/]+)\//)
    if (match) {
      const dirName = match[1]
      const info = getThemeInfo(dirName)
      return {
        id: dirName,
        name: info.name,
        description: info.description,
        component: getDefaultComponent(mod),
      }
    }
    return null
  }).filter(Boolean) as { id: string; name: string; description: string; component: React.ComponentType }[]

  const query = searchQuery.trim().toLowerCase()
  const filteredThemes = query
    ? themes.filter(theme => theme.name.toLowerCase().includes(query) || theme.description.toLowerCase().includes(query))
    : themes

  return (
    <div className="space-y-1">
      {!collapsed && (
        <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
          设计系统主题
        </div>
      )}
      {filteredThemes.map(theme => (
        <NavLink
          key={theme.id}
          to={`/theme/${theme.id}`}
          title={theme.name}
          className={({ isActive }) =>
            `flex items-center rounded-lg text-xs transition-colors ${
              collapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-2'
            } ${
              isActive || location.pathname === `/theme/${theme.id}`
                ? 'bg-blue-600 text-white'
                : isDark
                  ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`
          }
        >
          <Palette size={16} />
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="truncate">{theme.name}</span>
              <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{theme.description}</span>
            </div>
          )}
        </NavLink>
      ))}
    </div>
  )
}

// ==================== 文档导航组件 ====================
interface DocNavProps {
  isDark: boolean
  searchQuery?: string
  collapsed?: boolean
}

const DocNav = ({ isDark, searchQuery = '', collapsed = false }: DocNavProps) => {
  const location = useLocation()

  // 动态生成文档列表
  const docs = Object.entries(docModules).map(([path]) => {
    const match = path.match(/\.\/docs\/(.+)\.md$/)
    if (match) {
      const fileName = match[1]
      return {
        id: fileName,
        name: fileName,
        path: `/doc/${fileName}`,
      }
    }
    return null
  }).filter(Boolean) as { id: string; name: string; path: string }[]

  const query = searchQuery.trim().toLowerCase()
  const filteredDocs = query
    ? docs.filter(doc => doc.name.toLowerCase().includes(query))
    : docs

  return (
    <div className="space-y-1">
      {!collapsed && (
        <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
          项目文档
        </div>
      )}
      {filteredDocs.map(doc => (
        <NavLink
          key={doc.id}
          to={doc.path}
          title={doc.name}
          className={({ isActive }) =>
            `flex items-center rounded-lg text-xs transition-colors ${
              collapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-2'
            } ${
              isActive || location.pathname === doc.path
                ? 'bg-blue-600 text-white'
                : isDark
                  ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`
          }
        >
          <FileText size={16} />
          {!collapsed && <span className="truncate">{doc.name}</span>}
        </NavLink>
      ))}
    </div>
  )
}

// ==================== 侧边栏导航组件 ====================
interface PageListProps {
  pages: PageItem[]
  isDark: boolean
  icon: React.ComponentType<{ size?: number }>
  collapsed: boolean
  isActive: (path: string) => boolean
}

const PageList = ({ pages, isDark, icon: Icon, collapsed, isActive }: PageListProps) => {
  return (
    <div className="space-y-1">
      {pages.map(page => (
        <NavLink
          key={page.path}
          to={page.path}
          title={page.label}
          className={({ isActive: navActive }) =>
            `flex items-center rounded-lg text-xs transition-colors ${
              collapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-2'
            } ${
              navActive || isActive(page.path)
                ? 'bg-blue-600 text-white'
                : isDark
                  ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`
          }
        >
          <Icon size={16} />
          {!collapsed && <span className="truncate">{page.label}</span>}
        </NavLink>
      ))}
    </div>
  )
}

interface SidebarProps {
  theme: Theme
  projectName: string
  onProjectNameChange: (name: string) => void
  collapsed: boolean
}

const Sidebar = ({ theme, projectName, onProjectNameChange, collapsed }: SidebarProps) => {
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState(projectName)
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<PageCategory | 'themes' | 'docs'>('frontend')
  const [searchQuery, setSearchQuery] = useState('')

  const isDark = theme === 'dark'

  const isActive = (path: string) => location.pathname === path

  // 根据当前选中的标签页和搜索关键词过滤页面
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
          {/* 顶部标题栏 */}
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

          {/* Tab 切换 - 按钮样式 */}
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

          {/* 搜索框 */}
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

          {/* 导航列表 */}
          <nav className="flex-1 overflow-y-auto p-2">
            {activeTab === 'frontend' && (
              <PageList pages={filteredPages} isDark={isDark} icon={Smartphone} collapsed={collapsed} isActive={isActive} />
            )}
            {activeTab === 'admin' && (
              <PageList pages={filteredPages} isDark={isDark} icon={Monitor} collapsed={collapsed} isActive={isActive} />
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

// 全局标志：是否正在录制快捷键或弹窗打开
let isShortcutModalOpen = false

// 固定位置的气泡提示按钮（tooltip 显示在按钮下方居中，不跟随鼠标）
const TooltipButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { tooltip: React.ReactNode }
> = ({ tooltip, children, ...props }) => {
  return (
    <div className="relative group inline-flex">
      <button {...props}>{children}</button>
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-[1100] pointer-events-none">
        {tooltip}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
      </div>
    </div>
  )
}

// ==================== 快捷键设置弹窗 ====================
const ShortcutSettingsModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  shortcuts: ShortcutConfig
  onSave: (shortcuts: ShortcutConfig) => void
  theme: Theme
}> = ({ isOpen, onClose, shortcuts, onSave, theme }) => {
  const isDark = theme === 'dark'
  const [editingShortcuts, setEditingShortcuts] = useState<ShortcutConfig>(() => shortcuts)
  const [recordingKey, setRecordingKey] = useState<keyof ShortcutConfig | null>(null)
  const os = getOS()

  useEffect(() => {
    isShortcutModalOpen = isOpen
  }, [isOpen])

  useEffect(() => {
    if (!recordingKey) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // 阻止事件冒泡和默认行为，防止触发其他快捷键
      e.stopPropagation()
      e.preventDefault()
      
      // 必须包含 Ctrl 或 Cmd
      if (!e.ctrlKey && !e.metaKey) return
      
      const parts: string[] = []
      if (e.ctrlKey) parts.push('ctrl')
      if (e.metaKey) parts.push('cmd')
      if (e.altKey) parts.push('alt')
      if (e.shiftKey) parts.push('shift')
      
      // 添加主键（排除修饰键）
      const key = e.key.toLowerCase()
      if (key.length === 1 && /[a-z0-9]/.test(key)) {
        parts.push(key)
        setEditingShortcuts(prev => ({ ...prev, [recordingKey]: parts.join('+') }))
        setRecordingKey(null)
      }
    }

    // 使用 capture 阶段监听，确保最先捕获事件
    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [recordingKey])

  if (!isOpen) return null

  const shortcutLabels: Record<keyof ShortcutConfig, string> = {
    copyToFigma: '复制到 Figma',
    openDoc: '查看文档',
    selectElement: '批注选择元素'
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative rounded-xl shadow-2xl w-[480px] max-w-[90vw] overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
        {/* 头部 */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <Keyboard className="text-blue-600" size={24} />
            <div>
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>快捷键设置</h2>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                检测到系统: {os === 'mac' ? 'macOS' : os === 'windows' ? 'Windows' : os === 'linux' ? 'Linux' : '未知'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-600'}`}>
            <XIcon size={20} />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6 space-y-4">
          {(Object.keys(shortcutLabels) as Array<keyof ShortcutConfig>).map((key) => (
            <div key={key} className={`flex items-center justify-between p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-gray-50'}`}>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{shortcutLabels[key]}</span>
              <button
                onClick={() => setRecordingKey(recordingKey === key ? null : key)}
                className={`px-4 py-2 rounded-lg font-mono text-sm transition-colors ${
                  recordingKey === key
                    ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500 animate-pulse'
                    : isDark
                      ? 'bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600'
                      : 'bg-white border hover:bg-gray-50'
                }`}
              >
                {recordingKey === key ? '按下快捷键...' : formatShortcut(editingShortcuts[key])}
              </button>
            </div>
          ))}

          <div className={`text-sm p-3 rounded-lg ${isDark ? 'bg-blue-900/30 text-slate-300' : 'bg-blue-50 text-gray-500'}`}>
            <p className={`font-medium mb-1 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>提示</p>
            <p>• 快捷键必须包含 Ctrl (Windows) 或 ⌘ (Mac)</p>
            <p>• 可组合 Shift、Alt 等修饰键</p>
            <p>• 点击按钮后按下新的快捷键即可设置</p>
          </div>
        </div>

        {/* 底部 */}
        <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${isDark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-gray-50'}`}>
          <button
            onClick={() => {
              setEditingShortcuts(DEFAULT_SHORTCUTS)
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-600 hover:bg-gray-200'}`}
          >
            恢复默认
          </button>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg transition-colors ${isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-600 hover:bg-gray-200'}`}
          >
            取消
          </button>
          <button
            onClick={() => {
              onSave(editingShortcuts)
              onClose()
            }}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================== 顶部工具栏 ====================
interface TopBarProps {
  deviceMode: 'mobile' | 'pc'
  setDeviceMode: (mode: 'mobile' | 'pc') => void
  showToast: (message: string, type?: 'success' | 'error') => void
  shortcuts: ShortcutConfig
  setShortcuts: (shortcuts: ShortcutConfig) => void
  theme: Theme
  toggleTheme: () => void
  showAnnotations: boolean
  setShowAnnotations: (show: boolean) => void
  annotationEditMode: boolean
  setAnnotationEditMode: (edit: boolean) => void
  annotationSelecting: boolean
  setAnnotationSelecting: (selecting: boolean | ((prev: boolean) => boolean)) => void
  hasDraft: boolean
  onSaveAnnotations: () => void
  onClearAnnotations: () => void
  docOpen: boolean
  onOpenDoc: () => void
  onToggleDoc: () => void
  sidebarCollapsed: boolean
  onToggleSidebarCollapsed: () => void
}

// 自定义侧边栏折叠/展开图标
const SidebarToggleIcon: React.FC<{ collapsed: boolean }> = ({ collapsed }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* 外框：代表整体布局 */}
    <rect x="3" y="5" width="18" height="14" rx="2" />
    {/* 左侧边栏分隔线 */}
    <line x1="9" y1="5" x2="9" y2="19" />
    {/* 箭头方向：展开时向左（表示可收起），折叠时向右（表示可展开） */}
    {collapsed ? (
      <path d="M13 9l3 3-3 3" />
    ) : (
      <path d="M17 9l-3 3 3 3" />
    )}
  </svg>
)

const TopBar = ({
  deviceMode,
  setDeviceMode,
  showToast,
  shortcuts,
  setShortcuts,
  theme,
  toggleTheme,
  showAnnotations,
  setShowAnnotations,
  annotationEditMode,
  setAnnotationEditMode,
  annotationSelecting,
  setAnnotationSelecting,
  hasDraft,
  onSaveAnnotations,
  onClearAnnotations,
  docOpen,
  onOpenDoc,
  onToggleDoc,
  sidebarCollapsed,
  onToggleSidebarCollapsed,
}: TopBarProps) => {
  const location = useLocation()
  const currentPage = pages.find(p => p.path === location.pathname)
  const [copying, setCopying] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  // 记录进入批注编辑模式前的显示状态，退出时恢复
  const [showAnnotationsBeforeEdit, setShowAnnotationsBeforeEdit] = useState(showAnnotations)

  const hasSpec = currentPage != null

  // 复制到 Figma 的函数
  const copyToFigma = useCallback(async () => {
    setCopying(true)
    try {
      const response = await fetch('/scripts/figma/runner.js')
      const scriptText = await response.text()
      const runnerFn = new Function('return ' + scriptText)()
      await runnerFn('#preview-container')
    } catch (error) {
      console.error('复制到 Figma 失败:', error)
      showToast('复制到 Figma 失败', 'error')
    } finally {
      setCopying(false)
    }
  }, [showToast])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 如果快捷键设置弹窗打开，不执行任何功能
      if (isShortcutModalOpen) return

      // 复制到 Figma
      if (matchShortcut(e, shortcuts.copyToFigma)) {
        e.preventDefault()
        copyToFigma()
        return
      }

      // 查看文档（切换开启/关闭）
      if (matchShortcut(e, shortcuts.openDoc)) {
        e.preventDefault()
        onToggleDoc()
        return
      }

      // 批注选择元素：未开启编辑时自动进入编辑模式并显示批注
      if (matchShortcut(e, shortcuts.selectElement)) {
        e.preventDefault()
        if (!annotationEditMode) {
          setShowAnnotationsBeforeEdit(showAnnotations)
          setShowAnnotations(true)
          setAnnotationEditMode(true)
        }
        setAnnotationSelecting((prev: boolean) => !prev)
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts, onToggleDoc, copyToFigma, annotationEditMode, annotationSelecting, showAnnotations, setShowAnnotations, setAnnotationEditMode, setAnnotationSelecting, setShowAnnotationsBeforeEdit])

  const isDark = theme === 'dark'

  return (
    <>
      <header
        className={`h-12 flex items-center px-3 flex-shrink-0 z-[1000] ${isDark ? 'bg-slate-900 border-b border-slate-800' : 'bg-white border-b border-gray-200'}`}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 左侧 - 折叠菜单按钮 */}
        <TooltipButton
          tooltip={sidebarCollapsed ? '展开侧边栏' : '折叠侧边栏'}
          onClick={(e) => {
            e.stopPropagation()
            onToggleSidebarCollapsed()
          }}
          className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
            isDark
              ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <SidebarToggleIcon collapsed={sidebarCollapsed} />
        </TooltipButton>

        {/* 左侧 - 页面信息 */}
        <div className="flex items-center gap-2 ml-3 w-[180px]">
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>当前页面:</span>
          <span className={`text-xs font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{currentPage?.label || '未知页面'}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
            {currentPage?.category === 'frontend' ? '前端' : '后台'}
          </span>
        </div>

        {/* 左侧 - 设备切换 */}
        <div className="flex items-center gap-1 rounded-lg p-1">
          <TooltipButton
            tooltip="切换为移动端预览"
            onClick={(e) => {
              e.stopPropagation()
              setDeviceMode('mobile')
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
              deviceMode === 'mobile'
                ? isDark
                  ? 'bg-slate-700 text-blue-400 shadow-sm'
                  : 'bg-white text-blue-600 shadow-sm'
                : isDark
                  ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Smartphone size={14} />
            <span>移动端</span>
          </TooltipButton>
          <TooltipButton
            tooltip="切换为PC端预览"
            onClick={(e) => {
              e.stopPropagation()
              setDeviceMode('pc')
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
              deviceMode === 'pc'
                ? isDark
                  ? 'bg-slate-700 text-blue-400 shadow-sm'
                  : 'bg-white text-blue-600 shadow-sm'
                : isDark
                  ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Monitor size={14} />
            <span>PC端</span>
          </TooltipButton>
        </div>

        {/* 中间 - 批注相关操作 */}
        <div className={`flex-1 flex items-center justify-center gap-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
          {annotationEditMode ? (
            <>
              <TooltipButton
                tooltip={`选择页面元素 (${formatShortcut(shortcuts.selectElement)})`}
                onClick={(e) => {
                  e.stopPropagation()
                  setAnnotationSelecting((prev: boolean) => !prev)
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                  annotationSelecting
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : isDark
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <MousePointer size={14} />
                <span>{annotationSelecting ? '选择中' : '选择元素'}</span>
              </TooltipButton>
              <TooltipButton
                tooltip="清空当前未保存的批注改动"
                onClick={(e) => {
                  e.stopPropagation()
                  onClearAnnotations()
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                  hasDraft
                    ? isDark
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    : 'opacity-50 cursor-not-allowed'
                }`}
                disabled={!hasDraft}
              >
                <Trash2 size={14} />
                <span>清空</span>
              </TooltipButton>
              <TooltipButton
                tooltip="保存到本地文件"
                onClick={(e) => {
                  e.stopPropagation()
                  onSaveAnnotations()
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                  hasDraft
                    ? isDark
                      ? 'text-green-400 hover:bg-green-900/20 hover:text-green-300'
                      : 'text-green-600 hover:bg-green-50 hover:text-green-700'
                    : 'opacity-50 cursor-not-allowed'
                }`}
                disabled={!hasDraft}
              >
                <Save size={14} />
                <span>保存</span>
              </TooltipButton>
              <TooltipButton
                tooltip="退出编辑模式"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowAnnotations(showAnnotationsBeforeEdit)
                  setAnnotationEditMode(false)
                  setAnnotationSelecting(false)
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                  isDark
                    ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <XIcon size={14} />
                <span>退出</span>
              </TooltipButton>
            </>
          ) : (
            <>
              <TooltipButton
                tooltip="进入批注编辑模式"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowAnnotationsBeforeEdit(showAnnotations)
                  setShowAnnotations(true)
                  setAnnotationEditMode(true)
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                  isDark
                    ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Pencil size={14} />
                <span>批注</span>
              </TooltipButton>
              <TooltipButton
                tooltip={showAnnotations ? '隐藏批注图标' : '显示批注图标'}
                onClick={(e) => {
                  e.stopPropagation()
                  const next = !showAnnotations
                  setShowAnnotations(next)
                  if (!next) {
                    setAnnotationEditMode(false)
                    setAnnotationSelecting(false)
                  }
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                  showAnnotations
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : isDark
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {showAnnotations ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{showAnnotations ? '隐藏批注' : '显示批注'}</span>
              </TooltipButton>
            </>
          )}
        </div>

        {/* 右侧 - 操作按钮 */}
        <div className="flex items-center gap-1">
          {/* 主题切换按钮 */}
          <TooltipButton
            tooltip={isDark ? '切换到白天模式' : '切换到黑夜模式'}
            onClick={(e) => {
              e.stopPropagation()
              toggleTheme()
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
              isDark
                ? 'text-yellow-400 hover:bg-slate-800'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
            <span>{isDark ? '白天' : '黑夜'}</span>
          </TooltipButton>

          {/* 复制到 Figma (HTML to Design) 按钮 */}
          <TooltipButton
            tooltip={`复制到 Figma (${formatShortcut(shortcuts.copyToFigma)})`}
            onClick={async (e) => {
              e.stopPropagation()
              await copyToFigma()
            }}
            disabled={copying}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark
                ? 'text-pink-400 hover:bg-pink-900/20'
                : 'text-pink-700 hover:bg-pink-50'
            }`}
          >
            {copying ? (
              <div className="animate-spin w-3.5 h-3.5 border-2 border-pink-700 border-t-transparent rounded-full" />
            ) : (
              <svg width="14" height="14" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 28.5C19 25.9804 20.0009 23.5641 21.7825 21.7825C23.5641 20.0009 25.9804 19 28.5 19C31.0196 19 33.4359 20.0009 35.2175 21.7825C36.9991 23.5641 38 25.9804 38 28.5C38 31.0196 36.9991 33.4359 35.2175 35.2175C33.4359 36.9991 31.0196 38 28.5 38C25.9804 38 23.5641 36.9991 21.7825 35.2175C20.0009 33.4359 19 31.0196 19 28.5Z" fill="#1ABCFE"/>
                <path d="M0 47.5C0 44.9804 1.00089 42.5641 2.78249 40.7825C4.56408 39.0009 6.98044 38 9.5 38H19V47.5C19 50.0196 17.9991 52.4359 16.2175 54.2175C14.4359 55.9991 12.0196 57 9.5 57C6.98044 57 4.56408 55.9991 2.78249 54.2175C1.00089 52.4359 0 50.0196 0 47.5Z" fill="#0ACF83"/>
                <path d="M19 0V19H28.5C31.0196 19 33.4359 17.9991 35.2175 16.2175C36.9991 14.4359 38 12.0196 38 9.5C38 6.98044 36.9991 4.56408 35.2175 2.78249C33.4359 1.00089 31.0196 0 28.5 0H19Z" fill="#FF7262"/>
                <path d="M0 9.5C0 12.0196 1.00089 14.4359 2.78249 16.2175C4.56408 17.9991 6.98044 19 9.5 19H19V0H9.5C6.98044 0 4.56408 1.00089 2.78249 2.78249C1.00089 4.56408 0 6.98044 0 9.5Z" fill="#F24E1E"/>
                <path d="M0 28.5C0 31.0196 1.00089 33.4359 2.78249 35.2175C4.56408 36.9991 6.98044 38 9.5 38H19V19H9.5C6.98044 19 4.56408 20.0009 2.78249 21.7825C1.00089 23.5641 0 25.9804 0 28.5Z" fill="#A259FF"/>
              </svg>
            )}
            <span>{copying ? '复制中...' : '复制到 Figma'}</span>
          </TooltipButton>

          {/* 查看文档按钮 */}
          {hasSpec && (
            <TooltipButton
              tooltip={`查看文档 (${formatShortcut(shortcuts.openDoc)})`}
              onClick={onOpenDoc}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                docOpen
                  ? 'bg-indigo-100 text-indigo-800'
                  : isDark
                    ? 'text-indigo-400 hover:bg-indigo-900/20'
                    : 'text-indigo-700 hover:bg-indigo-50'
              }`}
            >
              <FileText size={14} />
              <span>查看文档</span>
            </TooltipButton>
          )}

          {/* 快捷键设置按钮 */}
          <TooltipButton
            tooltip="快捷键设置"
            onClick={(e) => {
              e.stopPropagation()
              setSettingsOpen(true)
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
              isDark
                ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Keyboard size={14} />
            <span>快捷键</span>
          </TooltipButton>
        </div>
      </header>

      {/* 快捷键设置弹窗 */}
      <ShortcutSettingsModal
        key={settingsOpen ? 'shortcut-open' : 'shortcut-closed'}
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        shortcuts={shortcuts}
        onSave={(newShortcuts) => {
          setShortcuts(newShortcuts)
          saveShortcuts(newShortcuts)
        }}
        theme={theme}
      />
    </>
  )
}


// ==================== 主题详情页面 ====================
const ThemeDetailPage = () => {
  const { themeId } = useParams<{ themeId: string }>()
  const [designDoc, setDesignDoc] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // 获取主题组件（使用 useMemo 避免每次 render 重新创建组件类型）
  const ThemeComponent = useMemo(() => {
    const themeEntry = Object.entries(themeModules).find(([path]) => {
      const match = path.match(/\.\/themes\/([^/]+)\//)
      return match && match[1] === themeId
    })
    return themeEntry ? getDefaultComponent(themeEntry[1]) : null
  }, [themeId])

  // 加载设计文档
  useEffect(() => {
    const loadDesignDoc = async () => {
      setLoading(true)
      const docKey = `./themes/${themeId}/DESIGN.md`
      const loader = themeDesignDocs[docKey]
      if (loader) {
        try {
          const content = await loader() as string
          setDesignDoc(content)
        } catch {
          setDesignDoc('无法加载设计文档。')
        }
      } else {
        setDesignDoc('暂无设计文档。')
      }
      setLoading(false)
    }
    loadDesignDoc()
  }, [themeId])

  const info = themeId ? getThemeInfo(themeId) : { name: '未知主题', description: '' }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 主题头部 */}
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
          <div className="flex gap-2">
            <NavLink
              to="/themes"
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              返回主题列表
            </NavLink>
          </div>
        </div>
      </div>

      {/* 主题内容 */}
      <div className="flex-1 overflow-hidden flex">
        {/* 左侧：主题预览 */}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-lg shadow-sm border p-6 min-h-[600px]">
            <h2 className="text-lg font-medium text-gray-900 mb-4">主题预览</h2>
            {ThemeComponent ? React.createElement(ThemeComponent) : <div className="text-gray-500">主题组件加载失败</div>}
          </div>
        </div>

        {/* 右侧：设计规范 */}
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

// ==================== 主题列表页面 ====================
const ThemesListPage = () => {
  const themes = Object.entries(themeModules).map(([path, mod]) => {
    const match = path.match(/\.\/themes\/([^/]+)\//)
    if (match) {
      const dirName = match[1]
      const info = getThemeInfo(dirName)
      return {
        id: dirName,
        name: info.name,
        description: info.description,
        component: getDefaultComponent(mod),
      }
    }
    return null
  }).filter(Boolean) as { id: string; name: string; description: string; component: React.ComponentType }[]

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

// ==================== 文档详情页面 ====================
const DocDetailPage = () => {
  const { docId } = useParams<{ docId: string }>()
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDoc = async () => {
      setLoading(true)
      const docKey = `./docs/${docId}.md`
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
      {/* 文档头部 */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <NavLink to="/docs" className="hover:text-gray-900">文档</NavLink>
          <ChevronRight size={14} />
          <span className="text-gray-900">{docId}</span>
        </div>
        <h1 className="text-xl font-semibold text-gray-900">{docId}</h1>
      </div>

      {/* 文档内容 */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full" />
            </div>
          ) : content ? (
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 leading-relaxed">
              {content}
            </pre>
          ) : (
            <div className="text-gray-400 text-center py-20">文档加载失败</div>
          )}
        </div>
      </div>
    </div>
  )
}

// ==================== 文档列表页面 ====================
const DocsListPage = () => {
  const docs = Object.entries(docModules).map(([path]) => {
    const match = path.match(/\.\/docs\/(.+)\.md$/)
    if (match) {
      const fileName = match[1]
      return {
        id: fileName,
        name: fileName,
        path: `/doc/${fileName}`,
      }
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

// ==================== 主应用组件 ====================
function AppContent() {
  const location = useLocation()
  const [previewContainer, setPreviewContainer] = useState<HTMLElement | null>(null)
  const previewRef = useCallback((node: HTMLDivElement | null) => {
    setPreviewContainer(node)
  }, [])
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'pc'>(() => {
    const page = pages.find(p => p.path === location.pathname)
    return page?.category === 'admin' ? 'pc' : 'mobile'
  })
  // 左侧菜单折叠状态（持久化到 localStorage）
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('prototype-sidebar-collapsed') === 'true'
    } catch {
      return false
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem('prototype-sidebar-collapsed', String(sidebarCollapsed))
    } catch {
      // ignore
    }
  }, [sidebarCollapsed])
  // toast 状态提升到 AppContent
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  // 快捷键配置
  const [shortcuts, setShortcuts] = useState<ShortcutConfig>(loadShortcuts)
  // 主题状态
  const [theme, setTheme] = useState<Theme>(loadTheme)
  // 项目名称状态
  const [projectName, setProjectName] = useState<string>(loadProjectName)
  // 标注模式开关（默认关闭）
  // 批注展示与编辑模式：默认都不开启
  const [showAnnotations, setShowAnnotations] = useState(false)
  const [annotationEditMode, setAnnotationEditMode] = useState(false)
  // 右侧抽屉 Tab
  const [docOpen, setDocOpen] = useState(false)
  const [docTab, setDocTab] = useState<'spec' | 'annotations'>('spec')

  // 批注模式：元素选择 / 弹窗
  const [annotationSelecting, setAnnotationSelecting] = useState(false)
  const [annotationModalOpen, setAnnotationModalOpen] = useState(false)
  const [modalAnnotation, setModalAnnotation] = useState<Annotation | null>(null)
  const [modalAnchor, setModalAnchor] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [modalReadOnly, setModalReadOnly] = useState(false)

  // 使用独立 hook 管理标注数据（持久化到本地文件）
  const {
    annotations: allAnnotations,
    categories: annotationCategories,
    selectedId: selectedAnnotationId,
    setSelectedId: setSelectedAnnotationId,
    currentAnnotations,
    hasDraft: hasAnnotationDraft,
    prepareAnnotation: handlePrepareAnnotation,
    addAnnotation: handleAddAnnotation,
    updateAnnotation: handleUpdateAnnotation,
    deleteAnnotation: handleDeleteAnnotation,
    addCategory: handleAddCategory,
    deleteCategory: handleDeleteCategory,
    saveDraftToFile: handleSaveAnnotations,
    clearLocalDraft: handleClearAnnotations,
  } = useAnnotations(location.pathname)

  // 批注分类多选筛选：记录被隐藏的分类，默认不隐藏任何分类，新增分类自动可见
  const [hiddenCategoryKeys, setHiddenCategoryKeys] = useState<Set<string>>(new Set())

  const selectedCategoryKeys = useMemo(
    () => new Set(annotationCategories.map((c) => c.key).filter((k) => !hiddenCategoryKeys.has(k))),
    [annotationCategories, hiddenCategoryKeys]
  )

  // 切换分类筛选
  const handleToggleCategory = useCallback((key: string) => {
    setHiddenCategoryKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }, [])

  // 按选中分类过滤的批注（用于页面标记层）
  const visibleAnnotations = useMemo(
    () => currentAnnotations.filter((a) => selectedCategoryKeys.has(a.category)),
    [currentAnnotations, selectedCategoryKeys]
  )

  const currentPage = useMemo(() => pages.find(p => p.path === location.pathname), [location.pathname])

  // 切换主题
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    saveTheme(newTheme)
  }, [theme])

  // 更新项目名称
  const handleProjectNameChange = useCallback((name: string) => {
    setProjectName(name)
    saveProjectName(name)
  }, [])

  // 显示 toast 的回调函数
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  // 根据当前路径推断设备模式
  const inferredDeviceMode = useMemo<'mobile' | 'pc'>(() => {
    const page = pages.find((p) => p.path === location.pathname)
    const isThemeOrDoc =
      location.pathname.startsWith('/theme') ||
      location.pathname.startsWith('/doc') ||
      location.pathname === '/themes' ||
      location.pathname === '/docs'
    return page?.category === 'admin' || isThemeOrDoc ? 'pc' : 'mobile'
  }, [location.pathname])

  // 页面切换时同步设备模式到推断值，但允许用户在当前页手动切换
  useEffect(() => {
    queueMicrotask(() => setDeviceMode(inferredDeviceMode))
  }, [inferredDeviceMode])

  // 打开 PRD 文档
  const handleOpenDoc = useCallback(() => {
    setDocTab('spec')
    setDocOpen(true)
  }, [])

  // 切换文档抽屉（快捷键用）
  const handleToggleDoc = useCallback(() => {
    if (docOpen) {
      setDocOpen(false)
    } else {
      setDocTab('spec')
      setDocOpen(true)
    }
  }, [docOpen])

  // 计算批注标记在视口中的锚点位置
  const getAnnotationAnchor = useCallback(
    (annotation: Annotation): { x: number; y: number } => {
      if (!previewContainer) return { x: 0, y: 0 }
      const containerRect = previewContainer.getBoundingClientRect()
      if (annotation.selector) {
        const el = findElementBySelector(annotation.selector, previewContainer)
        if (el) {
          const pos = getElementPosition(el, previewContainer, annotation.position)
          return {
            x: containerRect.left + (pos.left / 100) * containerRect.width,
            y: containerRect.top + (pos.top / 100) * containerRect.height,
          }
        }
      }
      if (annotation.x != null && annotation.y != null) {
        return {
          x: containerRect.left + (annotation.x / 100) * containerRect.width,
          y: containerRect.top + (annotation.y / 100) * containerRect.height,
        }
      }
      return { x: containerRect.left, y: containerRect.top }
    },
    [previewContainer]
  )

  // 打开批注弹窗
  const openAnnotationModal = useCallback(
    (annotation: Annotation, anchor: { x: number; y: number }, readOnly: boolean) => {
      setModalAnnotation(annotation)
      setModalAnchor(anchor)
      setModalReadOnly(readOnly)
      setAnnotationModalOpen(true)
    },
    []
  )

  // 选中批注标记或文档中的批注：打开弹窗并切换到右侧批注标签
  const handleSelectAnnotation = useCallback(
    (id: string) => {
      const annotation = allAnnotations.find((a) => a.id === id)
      if (annotation && previewContainer) {
        setSelectedAnnotationId(id)
        openAnnotationModal(annotation, getAnnotationAnchor(annotation), !annotationEditMode)
        setDocTab('annotations')
        setDocOpen(true)
      }
    },
    [allAnnotations, annotationEditMode, getAnnotationAnchor, openAnnotationModal, previewContainer, setSelectedAnnotationId]
  )

  // 选择页面元素：生成临时批注并打开弹窗，仅在保存后才写入草稿。
  // 如果该元素已有批注，优先为未使用的分类新建；否则打开已有的第一条批注。
  const handleSelectElement = useCallback(
    (selector: string, clientX: number, clientY: number) => {
      const existing = allAnnotations.filter((a) => a.selector === selector)
      let annotation: Annotation
      if (existing.length === 0) {
        annotation = handlePrepareAnnotation(selector)
      } else {
        const usedCategories = new Set(existing.map((a) => a.category))
        const unusedCategory = annotationCategories.find((c) => !usedCategories.has(c.key))
        if (unusedCategory) {
          annotation = handlePrepareAnnotation(selector)
          annotation.category = unusedCategory.key
        } else {
          annotation = existing[0]
        }
      }
      openAnnotationModal(annotation, { x: clientX, y: clientY }, false)
    },
    [allAnnotations, annotationCategories, handlePrepareAnnotation, openAnnotationModal]
  )

  // 弹窗内保存批注：新批注写入草稿，已有批注更新，
  // 同一元素同一分类已存在时给出提示，避免重复。
  const handleSaveAnnotationModal = useCallback(
    (updated: Annotation) => {
      const duplicate = allAnnotations.find(
        (a) => a.id !== updated.id && a.selector === updated.selector && a.category === updated.category
      )
      if (duplicate) {
        showToast('该元素已存在此分类的批注，请切换标签编辑', 'error')
        return
      }
      const exists = allAnnotations.some((a) => a.id === updated.id)
      if (exists) {
        handleUpdateAnnotation(updated)
      } else {
        handleAddAnnotation(updated)
      }
      setAnnotationModalOpen(false)
      setModalAnnotation(null)
    },
    [allAnnotations, handleAddAnnotation, handleUpdateAnnotation, showToast]
  )

  // 弹窗内删除批注
  const handleDeleteAnnotationModal = useCallback(
    (id: string) => {
      handleDeleteAnnotation(id)
      setAnnotationModalOpen(false)
      setModalAnnotation(null)
    },
    [handleDeleteAnnotation]
  )

  // 弹窗内切换到同元素的其他分类批注
  const handleSwitchAnnotationModal = useCallback(
    (id: string) => {
      const annotation = allAnnotations.find((a) => a.id === id)
      if (annotation) setModalAnnotation(annotation)
    },
    [allAnnotations]
  )

  // 为同一元素新增一个分类批注
  const handleAddRelatedAnnotation = useCallback(
    (selector: string, category: string) => {
      const pending = handlePrepareAnnotation(selector)
      pending.category = category
      setModalAnnotation(pending)
    },
    [handlePrepareAnnotation]
  )

  // 保存批注草稿到本地文件
  const handlePersistAnnotations = useCallback(async () => {
    try {
      await handleSaveAnnotations()
      showToast('批注已保存到本地文件', 'success')
    } catch {
      showToast('保存失败，请重试', 'error')
    }
  }, [handleSaveAnnotations, showToast])

  // 清空当前批注草稿
  const handleClearAnnotationDraft = useCallback(() => {
    handleClearAnnotations()
    setAnnotationModalOpen(false)
    setModalAnnotation(null)
    showToast('已清空未保存的批注改动', 'success')
  }, [handleClearAnnotations, showToast])

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-100'}`}>
      <Sidebar theme={theme} projectName={projectName} onProjectNameChange={handleProjectNameChange} collapsed={sidebarCollapsed} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          deviceMode={deviceMode}
          setDeviceMode={setDeviceMode}
          showToast={showToast}
          shortcuts={shortcuts}
          setShortcuts={setShortcuts}
          theme={theme}
          toggleTheme={toggleTheme}
          showAnnotations={showAnnotations}
          setShowAnnotations={setShowAnnotations}
          annotationEditMode={annotationEditMode}
          setAnnotationEditMode={setAnnotationEditMode}
          annotationSelecting={annotationSelecting}
          setAnnotationSelecting={setAnnotationSelecting}
          hasDraft={hasAnnotationDraft}
          onSaveAnnotations={handlePersistAnnotations}
          onClearAnnotations={handleClearAnnotationDraft}
          docOpen={docOpen}
          onOpenDoc={handleOpenDoc}
          onToggleDoc={handleToggleDoc}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebarCollapsed={() => setSidebarCollapsed(prev => !prev)}
        />

        <main className="flex-1 overflow-hidden flex flex-col relative">
          {/* 提示条区域 - 固定在容器上方 */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[400px] z-[1100] space-y-2 pointer-events-none">

            {/* Toast 提示 - 无动画直接显示 */}
            {toast && (
              <div className={`px-4 py-2 rounded-lg shadow-lg text-sm font-medium text-center pointer-events-auto ${
                toast.type === 'success'
                  ? 'bg-gray-900 text-white'
                  : 'bg-red-500 text-white'
              }`}>
                {toast.message}
              </div>
            )}
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* 原型预览区：始终完整展示，不被抽屉覆盖 */}
            <div className="flex-1 overflow-auto p-4">
              <div
                className={`relative z-[100] mx-auto transition-all duration-300 ${
                  deviceMode === 'mobile'
                    ? 'w-[400px] h-[852px] mt-20'
                    : 'w-full h-full'
                }`}
              >
                <div
                  ref={previewRef}
                  id="preview-container"
                  className={`w-full h-full bg-white shadow-lg ${
                    deviceMode === 'mobile' ? 'shadow-2xl overflow-hidden' : 'rounded-lg'
                  }`}
                  style={{ transform: 'translateZ(0)' }}
                >
                  <div className={`${deviceMode === 'mobile' ? 'h-full overflow-y-auto overscroll-contain' : 'w-full h-full overflow-auto'}`}>
                    <Routes>
                      {pages.map(page => (
                        <Route key={page.path} path={page.path} element={<page.component />} />
                      ))}
                      {/* 主题路由 */}
                      <Route path="/themes" element={<ThemesListPage />} />
                      <Route path="/theme/:themeId" element={<ThemeDetailPage />} />
                      {/* 文档路由 */}
                      <Route path="/docs" element={<DocsListPage />} />
                      <Route path="/doc/:docId" element={<DocDetailPage />} />
                    </Routes>
                  </div>
                </div>

                {/* 标注层：放在 preview-container 外部，避免复制到 Figma */}
                {showAnnotations && (
                  <AnnotationLayer
                    annotations={visibleAnnotations}
                    categories={annotationCategories}
                    selectedId={selectedAnnotationId}
                    highlightedId={modalAnnotation?.id ?? null}
                    selecting={annotationEditMode && annotationSelecting}
                    previewContainer={previewContainer}
                    theme={theme}
                    onSelect={handleSelectAnnotation}
                    onSelectElement={handleSelectElement}
                  />
                )}

                {/* 批注弹窗 */}
                <AnnotationModal
                  isOpen={annotationModalOpen}
                  onClose={() => {
                    setAnnotationModalOpen(false)
                    setModalAnnotation(null)
                  }}
                  annotation={modalAnnotation}
                  annotations={currentAnnotations}
                  categories={annotationCategories}
                  theme={theme}
                  anchor={modalAnchor}
                  readOnly={modalReadOnly}
                  onSave={handleSaveAnnotationModal}
                  onDelete={handleDeleteAnnotationModal}
                  onAddCategory={handleAddCategory}
                  onDeleteCategory={handleDeleteCategory}
                  onSwitchAnnotation={handleSwitchAnnotationModal}
                  onAddRelatedAnnotation={handleAddRelatedAnnotation}
                />
              </div>
            </div>

            {/* 右侧文档/标注面板：PC 并排无遮罩，移动端从右侧滑出无遮罩 */}
            {docOpen && (
              <DocDrawer
                isOpen={docOpen}
                onClose={() => setDocOpen(false)}
                currentPage={currentPage}
                docTab={docTab}
                setDocTab={setDocTab}
                theme={theme}
                annotations={currentAnnotations}
                categories={annotationCategories}
                selectedCategories={selectedCategoryKeys}
                onToggleCategory={handleToggleCategory}
                selectedId={selectedAnnotationId}
                onSelectAnnotation={handleSelectAnnotation}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
