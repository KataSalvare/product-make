import { BrowserRouter, Routes, Route, NavLink, useLocation, useParams } from 'react-router-dom'
import { useState, useCallback, useEffect, useRef } from 'react'
import { Smartphone, Monitor, ChevronRight, ChevronDown, FileText, XIcon, Keyboard, Sun, Moon, Palette } from 'lucide-react'

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
}

const adminPageConfig: Record<string, { path: string; label: string }> = {
  'demo-admin-users': { path: '/admin/users', label: '用户管理' },
}

// 提取默认组件
const getDefaultComponent = (mod: unknown): React.ComponentType => {
  const moduleWithDefault = mod as { default?: React.ComponentType }
  return moduleWithDefault?.default || (() => null)
}

// ==================== Spec 文件动态加载 ====================
const specGlob = import.meta.glob('./prototypes/*/spec.md', { query: '?raw', import: 'default' })

// ==================== 主题动态加载 ====================
const themeModules = import.meta.glob('./themes/*/index.tsx', { eager: true })
const themeDesignDocs = import.meta.glob('./themes/*/DESIGN.md', { query: '?raw', import: 'default' })

// 提取主题信息
const getThemeInfo = (dirName: string): { name: string; description: string } => {
  const nameMap: Record<string, { name: string; description: string }> = {
    'antd-new': { name: 'Ant Design', description: '企业级中后台设计系统' },
    'equatorial-minimalism': { name: 'Equatorial Minimalism', description: '非洲即时通讯设计系统' },
  }
  return nameMap[dirName] || { name: dirName, description: '主题设计系统' }
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
  copyToFigma: string  // 复制到 Figma
  openDoc: string      // 查看文档
}

const DEFAULT_SHORTCUTS: ShortcutConfig = {
  copyToFigma: 'ctrl+cmd+c',  // Mac: Ctrl+Cmd+C, Win: Ctrl+Alt+C
  openDoc: 'ctrl+cmd+e'       // Mac: Ctrl+Cmd+E, Win: Ctrl+Alt+E
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

function getSpecKey(dirName: string): string {
  return `./prototypes/${dirName}/spec.md`
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
}

const ThemeNav = ({ isDark }: ThemeNavProps) => {
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

  return (
    <div className="space-y-1">
      <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
        设计系统主题
      </div>
      {themes.map(theme => (
        <NavLink
          key={theme.id}
          to={`/theme/${theme.id}`}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive || location.pathname === `/theme/${theme.id}`
                ? 'bg-blue-600 text-white'
                : isDark
                  ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`
          }
        >
          <Palette size={16} />
          <div className="flex flex-col">
            <span>{theme.name}</span>
            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{theme.description}</span>
          </div>
        </NavLink>
      ))}
    </div>
  )
}

// ==================== 文档导航组件 ====================
interface DocNavProps {
  isDark: boolean
}

const DocNav = ({ isDark }: DocNavProps) => {
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

  return (
    <div className="space-y-1">
      <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
        项目文档
      </div>
      {docs.map(doc => (
        <NavLink
          key={doc.id}
          to={doc.path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive || location.pathname === doc.path
                ? 'bg-blue-600 text-white'
                : isDark
                  ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`
          }
        >
          <FileText size={16} />
          <span>{doc.name}</span>
        </NavLink>
      ))}
    </div>
  )
}

// ==================== 侧边栏导航组件 ====================
interface SidebarProps {
  theme: Theme
  projectName: string
  onProjectNameChange: (name: string) => void
}

const Sidebar = ({ theme, projectName, onProjectNameChange }: SidebarProps) => {
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState(projectName)
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<PageCategory | 'themes' | 'docs'>('frontend')
  // 默认展开所有后台管理分组
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['数据概览', '用户管理'])

  // 根据当前选中的标签页过滤页面
  const filteredPages = pages.filter(p => p.category === activeTab as PageCategory)

  // 后台页面分组配置
  // 根据实际存在的路由调整：仪表盘、数据大屏、用户管理
  const adminGroups: Record<string, PageItem[]> = {
    '数据概览': filteredPages.filter(p => ['仪表盘', '数据大屏'].includes(p.label)),
    '用户管理': filteredPages.filter(p => ['用户管理'].includes(p.label)),
  }

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev =>
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    )
  }

  const isActive = (path: string) => location.pathname === path

  const isDark = theme === 'dark'

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

  return (
    <aside className={`w-64 flex flex-col h-screen ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-gray-900 border-r border-gray-200'}`}>
      <div className={`p-4 border-b ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
        {isEditingName ? (
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={handleNameKeyDown}
            autoFocus
            className={`w-full text-lg font-bold bg-transparent border-b-2 outline-none ${
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
            className="text-lg font-bold cursor-pointer hover:opacity-80 transition-opacity"
            style={{ color: isDark ? '#ffffff' : '#111827' }}
          >
            {projectName}
          </h1>
        )}
      </div>

      <div className={`flex border-b ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
        <button
          onClick={() => setActiveTab('frontend')}
          className={`flex-1 px-3 py-3 text-xs font-medium transition-colors ${
            activeTab === 'frontend'
              ? 'bg-blue-600 text-white'
              : isDark
                ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          前端
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`flex-1 px-3 py-3 text-xs font-medium transition-colors ${
            activeTab === 'admin'
              ? 'bg-blue-600 text-white'
              : isDark
                ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          后台
        </button>
        <button
          onClick={() => setActiveTab('themes')}
          className={`flex-1 px-3 py-3 text-xs font-medium transition-colors ${
            activeTab === 'themes'
              ? 'bg-blue-600 text-white'
              : isDark
                ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          主题
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={`flex-1 px-3 py-3 text-xs font-medium transition-colors ${
            activeTab === 'docs'
              ? 'bg-blue-600 text-white'
              : isDark
                ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          文档
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {activeTab === 'frontend' && (
          <div className="space-y-1">
            {filteredPages.map(page => (
              <NavLink
                key={page.path}
                to={page.path}
                className={({ isActive: navActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    navActive || isActive(page.path)
                      ? 'bg-blue-600 text-white'
                      : isDark
                        ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <Smartphone size={16} />
                <span>{page.label}</span>
              </NavLink>
            ))}
          </div>
        )}
        {activeTab === 'admin' && (
          <div className="space-y-1">
            {Object.entries(adminGroups).map(([groupName, groupPages]) => (
              groupPages.length > 0 && (
                <div key={groupName}>
                  <button
                    onClick={() => toggleGroup(groupName)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      isDark
                        ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span className="font-medium">{groupName}</span>
                    {expandedGroups.includes(groupName) ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                  </button>
                  {expandedGroups.includes(groupName) && (
                    <div className="ml-2 mt-1 space-y-1">
                      {groupPages.map(page => (
                        <NavLink
                          key={page.path}
                          to={page.path}
                          className={({ isActive: navActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                              navActive || isActive(page.path)
                                ? 'bg-blue-600 text-white'
                                : isDark
                                  ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }`
                          }
                        >
                          <Monitor size={14} />
                          <span>{page.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        )}
        {activeTab === 'themes' && (
          <ThemeNav isDark={isDark} />
        )}
        {activeTab === 'docs' && (
          <DocNav isDark={isDark} />
        )}
      </nav>
    </aside>
  )
}

// 全局标志：是否正在录制快捷键或弹窗打开
let isShortcutModalOpen = false

// ==================== 快捷键设置弹窗 ====================
const ShortcutSettingsModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  shortcuts: ShortcutConfig
  onSave: (shortcuts: ShortcutConfig) => void
  theme: Theme
}> = ({ isOpen, onClose, shortcuts, onSave, theme }) => {
  const isDark = theme === 'dark'
  const [editingShortcuts, setEditingShortcuts] = useState<ShortcutConfig>(shortcuts)
  const [recordingKey, setRecordingKey] = useState<keyof ShortcutConfig | null>(null)
  const os = getOS()

  useEffect(() => {
    if (isOpen) {
      setEditingShortcuts(shortcuts)
    }
    isShortcutModalOpen = isOpen
  }, [isOpen, shortcuts])

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
    openDoc: '查看文档'
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center">
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
}

const TopBar = ({ deviceMode, setDeviceMode, showToast, shortcuts, setShortcuts, theme, toggleTheme }: TopBarProps) => {
  const location = useLocation()
  const currentPage = pages.find(p => p.path === location.pathname)
  const [docOpen, setDocOpen] = useState(false)
  const [docContent, setDocContent] = useState<string | null>(null)
  const [docLoading, setDocLoading] = useState(false)
  const [copying, setCopying] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const hasSpec = currentPage != null

  const openDoc = useCallback(async () => {
    if (!currentPage) return
    setDocOpen(true)
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



  // 添加快捷键支持 - 使用配置的快捷键
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
        if (docOpen) {
          setDocOpen(false)
        } else {
          openDoc()
        }
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts, openDoc, docOpen, copyToFigma])

  const isDark = theme === 'dark'

  return (
    <>
      <header
        className={`h-14 flex items-center px-4 flex-shrink-0 ${isDark ? 'bg-slate-900 border-b border-slate-800' : 'bg-white border-b border-gray-200'}`}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 左侧 - 页面信息 */}
        <div className="flex items-center gap-2 w-[200px]">
          <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>当前页面:</span>
          <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{currentPage?.label || '未知页面'}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
            {currentPage?.category === 'frontend' ? '前端' : '后台'}
          </span>
        </div>

        {/* 左侧 - 设备切换 */}
        <div className={`flex items-center gap-2 rounded-lg p-1 ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setDeviceMode('mobile')
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
              deviceMode === 'mobile'
                ? isDark
                  ? 'bg-slate-700 text-blue-400 shadow-sm'
                  : 'bg-white text-blue-600 shadow-sm'
                : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Smartphone size={16} />
            <span>移动端</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setDeviceMode('pc')
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
              deviceMode === 'pc'
                ? isDark
                  ? 'bg-slate-700 text-blue-400 shadow-sm'
                  : 'bg-white text-blue-600 shadow-sm'
                : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Monitor size={16} />
            <span>PC端</span>
          </button>
        </div>

        {/* 中间 - 占位 */}
        <div className="flex-1"></div>

        {/* 右侧 - 操作按钮 */}
        <div className="flex items-center gap-3">
          {/* 主题切换按钮 */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleTheme()
            }}
            title={isDark ? '切换到白天模式' : '切换到黑夜模式'}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
              isDark
                ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            <span>{isDark ? '白天' : '黑夜'}</span>
          </button>
          {/* 复制到 Figma (HTML to Design) 按钮 */}
          <button
            onClick={async (e) => {
              e.stopPropagation()
              await copyToFigma()
            }}
            disabled={copying}
            title={`快捷键: ${formatShortcut(shortcuts.copyToFigma)}`}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors bg-pink-50 text-pink-700 hover:bg-pink-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {copying ? (
              <div className="animate-spin w-4 h-4 border-2 border-pink-700 border-t-transparent rounded-full" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 28.5C19 25.9804 20.0009 23.5641 21.7825 21.7825C23.5641 20.0009 25.9804 19 28.5 19C31.0196 19 33.4359 20.0009 35.2175 21.7825C36.9991 23.5641 38 25.9804 38 28.5C38 31.0196 36.9991 33.4359 35.2175 35.2175C33.4359 36.9991 31.0196 38 28.5 38C25.9804 38 23.5641 36.9991 21.7825 35.2175C20.0009 33.4359 19 31.0196 19 28.5Z" fill="#1ABCFE"/>
                <path d="M0 47.5C0 44.9804 1.00089 42.5641 2.78249 40.7825C4.56408 39.0009 6.98044 38 9.5 38H19V47.5C19 50.0196 17.9991 52.4359 16.2175 54.2175C14.4359 55.9991 12.0196 57 9.5 57C6.98044 57 4.56408 55.9991 2.78249 54.2175C1.00089 52.4359 0 50.0196 0 47.5Z" fill="#0ACF83"/>
                <path d="M19 0V19H28.5C31.0196 19 33.4359 17.9991 35.2175 16.2175C36.9991 14.4359 38 12.0196 38 9.5C38 6.98044 36.9991 4.56408 35.2175 2.78249C33.4359 1.00089 31.0196 0 28.5 0H19Z" fill="#FF7262"/>
                <path d="M0 9.5C0 12.0196 1.00089 14.4359 2.78249 16.2175C4.56408 17.9991 6.98044 19 9.5 19H19V0H9.5C6.98044 0 4.56408 1.00089 2.78249 2.78249C1.00089 4.56408 0 6.98044 0 9.5Z" fill="#F24E1E"/>
                <path d="M0 28.5C0 31.0196 1.00089 33.4359 2.78249 35.2175C4.56408 36.9991 6.98044 38 9.5 38H19V19H9.5C6.98044 19 4.56408 20.0009 2.78249 21.7825C1.00089 23.5641 0 25.9804 0 28.5Z" fill="#A259FF"/>
              </svg>
            )}
            <span>{copying ? '复制中...' : '复制到 Figma'}</span>
          </button>

          {/* 查看文档按钮 */}
          {hasSpec && (
            <button
              onClick={openDoc}
              title={`快捷键: ${formatShortcut(shortcuts.openDoc)}`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            >
              <FileText size={16} />
              <span>查看文档</span>
            </button>
          )}

          {/* 快捷键设置按钮 */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSettingsOpen(true)
            }}
            title="快捷键设置"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <Keyboard size={16} />
            <span>快捷键</span>
          </button>
        </div>
      </header>

      {/* Spec 文档抽屉 */}
      {docOpen && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDocOpen(false)} />
          <div className={`absolute right-0 top-0 bottom-0 w-[700px] max-w-[90vw] shadow-2xl flex flex-col ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            {/* 抽屉头部 */}
            <div className={`flex items-center justify-between px-6 py-4 border-b flex-shrink-0 ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
              <div>
                <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{currentPage?.label} - PRD 文档</h2>
                <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{currentPage?.dirName}/spec.md</p>
              </div>
              <button
                onClick={() => setDocOpen(false)}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                <XIcon size={20} />
              </button>
            </div>

            {/* 抽屉内容 */}
            <div className={`flex-1 overflow-y-auto px-6 py-4 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
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
          </div>
        </div>
      )}

      {/* 快捷键设置弹窗 */}
      <ShortcutSettingsModal
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

  // 获取主题组件
  const themeEntry = Object.entries(themeModules).find(([path]) => {
    const match = path.match(/\.\/themes\/([^/]+)\//)
    return match && match[1] === themeId
  })
  const ThemeComponent = themeEntry ? getDefaultComponent(themeEntry[1]) : null

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
            {ThemeComponent ? <ThemeComponent /> : <div className="text-gray-500">主题组件加载失败</div>}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
  const previewRef = useRef<HTMLDivElement>(null)
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'pc'>(() => {
    const page = pages.find(p => p.path === location.pathname)
    return page?.category === 'admin' ? 'pc' : 'mobile'
  })
  // toast 状态提升到 AppContent
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  // 快捷键配置
  const [shortcuts, setShortcuts] = useState<ShortcutConfig>(loadShortcuts)
  // 主题状态
  const [theme, setTheme] = useState<Theme>(loadTheme)
  // 项目名称状态
  const [projectName, setProjectName] = useState<string>(loadProjectName)

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

  useEffect(() => {
    const page = pages.find(p => p.path === location.pathname)
    // 主题和文档页面使用 PC 模式
    const isThemeOrDoc = location.pathname.startsWith('/theme') || location.pathname.startsWith('/doc') || location.pathname === '/themes' || location.pathname === '/docs'
    setDeviceMode(page?.category === 'admin' || isThemeOrDoc ? 'pc' : 'mobile')
  }, [location.pathname])

  // 显示 toast 的回调函数
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-100'}`}>
      <Sidebar theme={theme} projectName={projectName} onProjectNameChange={handleProjectNameChange} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          deviceMode={deviceMode}
          setDeviceMode={setDeviceMode}
          showToast={showToast}
          shortcuts={shortcuts}
          setShortcuts={setShortcuts}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <main className="flex-1 overflow-auto p-4 relative">
          {/* 提示条区域 - 固定在容器上方 */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[400px] z-50 space-y-2 pointer-events-none">

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

          <div
            ref={previewRef}
            id="preview-container"
            className={`mx-auto transition-all duration-300 ${
              deviceMode === 'mobile'
                ? 'w-[400px] h-[852px] mt-20 bg-white shadow-2xl overflow-hidden relative'
                : 'w-full h-full bg-white shadow-lg rounded-lg'
            }`}
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
