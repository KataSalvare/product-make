import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { useState, useCallback, useEffect, useRef } from 'react'
import { Smartphone, Monitor, ChevronRight, ChevronDown, FileText, XIcon, Keyboard, Sun, Moon } from 'lucide-react'

// ==================== 主题类型 ====================
type Theme = 'light' | 'dark'

// 从 localStorage 加载主题
const loadTheme = (): Theme => {
  try {
    const saved = localStorage.getItem('superim-theme')
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
    localStorage.setItem('superim-theme', theme)
  } catch {
    // ignore
  }
}

// ==================== 项目名称配置 ====================
const DEFAULT_PROJECT_NAME = 'SuperIM 原型预览'

// 从 localStorage 加载项目名称
const loadProjectName = (): string => {
  try {
    const saved = localStorage.getItem('superim-project-name')
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
    localStorage.setItem('superim-project-name', name)
  } catch {
    // ignore
  }
}

// ==================== 前端页面 ====================
import SuperimLogin from './prototypes/superim-login'
import SuperimRegister from './prototypes/superim-register'
import SuperimForgotPassword from './prototypes/superim-forgotpassword'
import SuperimChats from './prototypes/superim-chats'
import SuperimChatroom from './prototypes/superim-chatroom'
import SuperimContacts from './prototypes/superim-contacts'
import SuperimFeed from './prototypes/superim-feed'
import SuperimMe from './prototypes/superim-me'
import SuperimCalls from './prototypes/superim-calls'
import SuperimSplash from './prototypes/superim-splash'
import SuperimAddContact from './prototypes/superim-addcontact'
import SuperimCallscreen from './prototypes/superim-callscreen'
import SuperimContactSelection from './prototypes/superim-contact-selection'
import SuperimEditprofile from './prototypes/superim-editprofile'
import SuperimForwardmessage from './prototypes/superim-forwardmessage'
import SuperimGroupchat from './prototypes/superim-groupchat'
import SuperimGroupchatSettings from './prototypes/superim-groupchat-settings'
import SuperimMyposts from './prototypes/superim-myposts'
import SuperimNewpost from './prototypes/superim-newpost'
import SuperimPostdetail from './prototypes/superim-postdetail'
import SuperimPrivacySettings from './prototypes/superim-privacy-settings'
import SuperimSecurity from './prototypes/superim-security'
import SuperimUserprofile from './prototypes/superim-userprofile'

// ==================== 后台页面 ====================
import SuperimAdminLogin from './prototypes/superim-admin-login'
import SuperimAdminDashboard from './prototypes/superim-admin-dashboard'
import SuperimAdminUsers from './prototypes/superim-admin-users'
import SuperimAdminUserDetail from './prototypes/superim-admin-user-detail'
import SuperimAdminAdmins from './prototypes/superim-admin-admins'
import SuperimAdminRoles from './prototypes/superim-admin-roles'
import SuperimAdminConversations from './prototypes/superim-admin-conversations'
import SuperimAdminConversationDetail from './prototypes/superim-admin-conversation-detail'
import SuperimAdminComments from './prototypes/superim-admin-comments'
import SuperimAdminFeed from './prototypes/superim-admin-feed'
import SuperimAdminFeedDetail from './prototypes/superim-admin-feed-detail'
import SuperimAdminFeedReports from './prototypes/superim-admin-feed-reports'
import SuperimAdminMessageReports from './prototypes/superim-admin-message-reports'
import SuperimAdminCalls from './prototypes/superim-admin-calls'
import SuperimAdminBans from './prototypes/superim-admin-bans'
import SuperimAdminSensitiveWords from './prototypes/superim-admin-sensitive-words'
import SuperimAdminOnlineUsers from './prototypes/superim-admin-online-users'
import SuperimAdminLoginLogs from './prototypes/superim-admin-login-logs'
import SuperimAdminOperationLogs from './prototypes/superim-admin-operation-logs'
import SuperimAdminSystemLogs from './prototypes/superim-admin-system-logs'
import SuperimAdminSettings from './prototypes/superim-admin-settings'
import SuperimAdminVersions from './prototypes/superim-admin-versions'
import SuperimAdminBigscreen from './prototypes/superim-admin-bigscreen'

// ==================== Spec 文件动态加载 ====================
const specGlob = import.meta.glob('./prototypes/*/spec.md', { query: '?raw', import: 'default' })

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
    const saved = localStorage.getItem('superim-shortcuts')
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
    localStorage.setItem('superim-shortcuts', JSON.stringify(shortcuts))
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

const pages: PageItem[] = [
  { path: '/splash', label: '启动页', component: SuperimSplash, category: 'frontend', dirName: 'superim-splash' },
  { path: '/', label: '登录', component: SuperimLogin, category: 'frontend', dirName: 'superim-login' },
  { path: '/register', label: '注册', component: SuperimRegister, category: 'frontend', dirName: 'superim-register' },
  { path: '/forgot-password', label: '忘记密码', component: SuperimForgotPassword, category: 'frontend', dirName: 'superim-forgotpassword' },
  { path: '/chats', label: '聊天列表', component: SuperimChats, category: 'frontend', dirName: 'superim-chats' },
  { path: '/chatroom', label: '聊天室', component: SuperimChatroom, category: 'frontend', dirName: 'superim-chatroom' },
  { path: '/group-chat', label: '群聊', component: SuperimGroupchat, category: 'frontend', dirName: 'superim-groupchat' },
  { path: '/group-chat-settings', label: '群聊设置', component: SuperimGroupchatSettings, category: 'frontend', dirName: 'superim-groupchat-settings' },
  { path: '/contacts', label: '通讯录', component: SuperimContacts, category: 'frontend', dirName: 'superim-contacts' },
  { path: '/add-contact', label: '添加联系人', component: SuperimAddContact, category: 'frontend', dirName: 'superim-addcontact' },
  { path: '/contact-selection', label: '选择联系人', component: SuperimContactSelection, category: 'frontend', dirName: 'superim-contact-selection' },
  { path: '/feed', label: '动态', component: SuperimFeed, category: 'frontend', dirName: 'superim-feed' },
  { path: '/new-post', label: '发布动态', component: SuperimNewpost, category: 'frontend', dirName: 'superim-newpost' },
  { path: '/post-detail', label: '动态详情', component: SuperimPostdetail, category: 'frontend', dirName: 'superim-postdetail' },
  { path: '/my-posts', label: '我的动态', component: SuperimMyposts, category: 'frontend', dirName: 'superim-myposts' },
  { path: '/me', label: '我的', component: SuperimMe, category: 'frontend', dirName: 'superim-me' },
  { path: '/user-profile', label: '用户资料', component: SuperimUserprofile, category: 'frontend', dirName: 'superim-userprofile' },
  { path: '/edit-profile', label: '编辑资料', component: SuperimEditprofile, category: 'frontend', dirName: 'superim-editprofile' },
  { path: '/privacy-settings', label: '隐私设置', component: SuperimPrivacySettings, category: 'frontend', dirName: 'superim-privacy-settings' },
  { path: '/security', label: '安全设置', component: SuperimSecurity, category: 'frontend', dirName: 'superim-security' },
  { path: '/calls', label: '通话', component: SuperimCalls, category: 'frontend', dirName: 'superim-calls' },
  { path: '/call-screen', label: '通话中', component: SuperimCallscreen, category: 'frontend', dirName: 'superim-callscreen' },
  { path: '/forward-message', label: '转发消息', component: SuperimForwardmessage, category: 'frontend', dirName: 'superim-forwardmessage' },
  { path: '/admin/login', label: '后台登录', component: SuperimAdminLogin, category: 'admin', dirName: 'superim-admin-login' },
  { path: '/admin/dashboard', label: '仪表盘', component: SuperimAdminDashboard, category: 'admin', dirName: 'superim-admin-dashboard' },
  { path: '/admin/bigscreen', label: '数据大屏', component: SuperimAdminBigscreen, category: 'admin', dirName: 'superim-admin-bigscreen' },
  { path: '/admin/users', label: '用户管理', component: SuperimAdminUsers, category: 'admin', dirName: 'superim-admin-users' },
  { path: '/admin/user-detail', label: '用户详情', component: SuperimAdminUserDetail, category: 'admin', dirName: 'superim-admin-user-detail' },
  { path: '/admin/admins', label: '管理员', component: SuperimAdminAdmins, category: 'admin', dirName: 'superim-admin-admins' },
  { path: '/admin/roles', label: '角色权限', component: SuperimAdminRoles, category: 'admin', dirName: 'superim-admin-roles' },
  { path: '/admin/conversations', label: '会话管理', component: SuperimAdminConversations, category: 'admin', dirName: 'superim-admin-conversations' },
  { path: '/admin/conversation-detail', label: '会话详情', component: SuperimAdminConversationDetail, category: 'admin', dirName: 'superim-admin-conversation-detail' },
  { path: '/admin/comments', label: '评论管理', component: SuperimAdminComments, category: 'admin', dirName: 'superim-admin-comments' },
  { path: '/admin/feed', label: '动态管理', component: SuperimAdminFeed, category: 'admin', dirName: 'superim-admin-feed' },
  { path: '/admin/feed-detail', label: '动态详情', component: SuperimAdminFeedDetail, category: 'admin', dirName: 'superim-admin-feed-detail' },
  { path: '/admin/feed-reports', label: '动态举报', component: SuperimAdminFeedReports, category: 'admin', dirName: 'superim-admin-feed-reports' },
  { path: '/admin/message-reports', label: '消息举报', component: SuperimAdminMessageReports, category: 'admin', dirName: 'superim-admin-message-reports' },
  { path: '/admin/calls', label: '通话记录', component: SuperimAdminCalls, category: 'admin', dirName: 'superim-admin-calls' },
  { path: '/admin/bans', label: '封禁管理', component: SuperimAdminBans, category: 'admin', dirName: 'superim-admin-bans' },
  { path: '/admin/sensitive-words', label: '敏感词', component: SuperimAdminSensitiveWords, category: 'admin', dirName: 'superim-admin-sensitive-words' },
  { path: '/admin/online-users', label: '在线用户', component: SuperimAdminOnlineUsers, category: 'admin', dirName: 'superim-admin-online-users' },
  { path: '/admin/login-logs', label: '登录日志', component: SuperimAdminLoginLogs, category: 'admin', dirName: 'superim-admin-login-logs' },
  { path: '/admin/operation-logs', label: '操作日志', component: SuperimAdminOperationLogs, category: 'admin', dirName: 'superim-admin-operation-logs' },
  { path: '/admin/system-logs', label: '系统日志', component: SuperimAdminSystemLogs, category: 'admin', dirName: 'superim-admin-system-logs' },
  { path: '/admin/settings', label: '系统设置', component: SuperimAdminSettings, category: 'admin', dirName: 'superim-admin-settings' },
  { path: '/admin/versions', label: '版本管理', component: SuperimAdminVersions, category: 'admin', dirName: 'superim-admin-versions' },
]



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
  const [activeTab, setActiveTab] = useState<PageCategory>('frontend')
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['用户管理', '消息管理', '动态管理', '系统设置', '权限管理', '日志管理'])

  const filteredPages = pages.filter(p => p.category === activeTab)

  const adminGroups: Record<string, PageItem[]> = {
    '数据概览': filteredPages.filter(p => ['仪表盘', '数据大屏'].includes(p.label)),
    '用户管理': filteredPages.filter(p => ['用户管理', '用户详情', '在线用户', '封禁管理'].includes(p.label)),
    '消息管理': filteredPages.filter(p => ['会话管理', '会话详情', '消息举报', '敏感词'].includes(p.label)),
    '动态管理': filteredPages.filter(p => ['动态管理', '动态详情', '评论管理', '动态举报'].includes(p.label)),
    '通话记录': filteredPages.filter(p => p.label === '通话记录'),
    '系统设置': filteredPages.filter(p => ['系统设置', '版本管理'].includes(p.label)),
    '权限管理': filteredPages.filter(p => ['后台登录', '管理员', '角色权限'].includes(p.label)),
    '日志管理': filteredPages.filter(p => ['登录日志', '操作日志', '系统日志'].includes(p.label)),
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
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'frontend'
              ? 'bg-blue-600 text-white'
              : isDark
                ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          前端 ({pages.filter(p => p.category === 'frontend').length})
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'admin'
              ? 'bg-blue-600 text-white'
              : isDark
                ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          后台 ({pages.filter(p => p.category === 'admin').length})
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {activeTab === 'frontend' ? (
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
        ) : (
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
      const response = await fetch('/src/web%20to%20figma/runner.js')
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
    setDeviceMode(page?.category === 'admin' ? 'pc' : 'mobile')
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
