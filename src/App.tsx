import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { useState, useCallback, useEffect } from 'react'
import { Smartphone, Monitor, ChevronRight, ChevronDown, FileText, XIcon } from 'lucide-react'

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

// ==================== Markdown 渲染 ====================
function renderMarkdown(md: string): string {
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // 代码块 ```...```
  html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 rounded-lg p-4 overflow-x-auto text-sm my-3"><code>$1</code></pre>')

  // 内联代码
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm text-pink-600">$1</code>')

  // 标题
  html = html.replace(/^#### (.+)$/gm, '<h4 class="text-base font-semibold mt-5 mb-2">$1</h4>')
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-6 mb-3">$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-8 mb-4 border-b pb-2">$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')

  // 粗体
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')

  // 水平线
  html = html.replace(/^---$/gm, '<hr class="my-6 border-gray-200" />')

  // 无序列表
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc my-1">$1</li>')

  // 表格 - 先处理表格行
  const lines = html.split('\n')
  const result: string[] = []
  let inTable = false
  let inCodeBlock = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.startsWith('<pre')) { inCodeBlock = true; result.push(line); continue }
    if (line.startsWith('</pre>')) { inCodeBlock = false; result.push(line); continue }
    if (inCodeBlock) { result.push(line); continue }

    const isTableLine = /^\|.+/.test(line)
    const isSeparatorLine = /^\|[\s\-:|]+\|/.test(line)

    if (isTableLine && !inTable) {
      inTable = true
      result.push('<table class="w-full text-sm border-collapse my-4"><thead>')
    }

    if (isTableLine && inTable) {
      const cells = line.split('|').filter(c => c.trim() !== '')
      const cellHtml = cells.map(c => `<${inTable && i > 0 && !isSeparatorLine ? 'td' : 'th'} class="border border-gray-200 px-3 py-2 text-left">${c.trim()}</${inTable && i > 0 && !isSeparatorLine ? 'td' : 'th'}>`).join('')
      if (isSeparatorLine) {
        result.push('</thead><tbody>')
      } else if (i === 0 || (i > 0 && lines[i - 1] && /^\|[\s\-:|]+\|/.test(lines[i - 1]))) {
        // first data row after separator
        result.push(`<tr>${cellHtml}</tr>`)
      } else if (!isSeparatorLine) {
        result.push(`<tr>${cellHtml}</tr>`)
      }
      continue
    }

    if (!isTableLine && inTable) {
      inTable = false
      result.push('</tbody></table>')
    }

    result.push(line)
  }
  if (inTable) result.push('</tbody></table>')

  html = result.join('\n')

  // 段落
  html = html.replace(/\n\n+/g, '</p><p class="my-3 leading-relaxed">')
  html = '<p class="my-3 leading-relaxed">' + html + '</p>'

  // 清理空段落
  html = html.replace(/<p class="my-3 leading-relaxed"><\/p>/g, '')
  html = html.replace(/<p class="my-3 leading-relaxed">(\s*<h[1-4])/g, '$1')
  html = html.replace(/(<\/h[1-4]>)\s*<\/p>/g, '$1')
  html = html.replace(/<p class="my-3 leading-relaxed">(\s*<hr)/g, '$1')
  html = html.replace(/(\/>)\s*<\/p>/g, '$1')
  html = html.replace(/<p class="my-3 leading-relaxed">(\s*<table)/g, '$1')
  html = html.replace(/(<\/table>)\s*<\/p>/g, '$1')
  html = html.replace(/<p class="my-3 leading-relaxed">(\s*<pre)/g, '$1')
  html = html.replace(/(<\/pre>)\s*<\/p>/g, '$1')
  html = html.replace(/<p class="my-3 leading-relaxed">(\s*<li)/g, '$1')
  html = html.replace(/(<\/li>)\s*<\/p>/g, '$1')
  html = html.replace(/(<li[^>]*>.*?<\/li>)/gs, (match) => `<ul class="my-2">${match}</ul>`)
  html = html.replace(/<\/ul>\s*<ul class="my-2">/g, '')

  return html
}

// ==================== 侧边栏导航组件 ====================
const Sidebar = () => {
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

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen">
      <div className="p-4 border-b border-slate-800">
        <h1 className="text-lg font-bold">SuperIM 原型预览</h1>
      </div>

      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('frontend')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'frontend'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          前端 ({pages.filter(p => p.category === 'frontend').length})
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'admin'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
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
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
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
                    className="w-full flex items-center justify-between px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-sm transition-colors"
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
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
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

// ==================== 顶部工具栏 ====================
const TopBar = ({ deviceMode, setDeviceMode }: { deviceMode: 'mobile' | 'pc', setDeviceMode: (mode: 'mobile' | 'pc') => void }) => {
  const location = useLocation()
  const currentPage = pages.find(p => p.path === location.pathname)
  const [docOpen, setDocOpen] = useState(false)
  const [docContent, setDocContent] = useState<string | null>(null)
  const [docLoading, setDocLoading] = useState(false)

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

  return (
    <>
      <header className="h-14 bg-white border-b flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">当前页面:</span>
          <span className="text-sm font-medium">{currentPage?.label || '未知页面'}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {currentPage?.category === 'frontend' ? '前端' : '后台'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* 文档按钮 */}
          {hasSpec && (
            <button
              onClick={openDoc}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            >
              <FileText size={16} />
              <span>文档</span>
            </button>
          )}

          {/* 设备切换 */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                deviceMode === 'mobile'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Smartphone size={16} />
              <span>移动端</span>
            </button>
            <button
              onClick={() => setDeviceMode('pc')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                deviceMode === 'pc'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Monitor size={16} />
              <span>PC端</span>
            </button>
          </div>
        </div>
      </header>

      {/* Spec 文档抽屉 */}
      {docOpen && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDocOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[700px] max-w-[90vw] bg-white shadow-2xl flex flex-col">
            {/* 抽屉头部 */}
            <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
              <div>
                <h2 className="text-lg font-semibold">{currentPage?.label} - PRD 文档</h2>
                <p className="text-sm text-gray-500 mt-0.5">{currentPage?.dirName}/spec.md</p>
              </div>
              <button
                onClick={() => setDocOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XIcon size={20} />
              </button>
            </div>

            {/* 抽屉内容 */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {docLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full" />
                </div>
              ) : docContent ? (
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(docContent) }}
                />
              ) : (
                <div className="text-center py-20 text-gray-400">加载失败</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ==================== 主应用组件 ====================
function AppContent() {
  const location = useLocation()
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'pc'>(() => {
    const page = pages.find(p => p.path === location.pathname)
    return page?.category === 'admin' ? 'pc' : 'mobile'
  })

  useEffect(() => {
    const page = pages.find(p => p.path === location.pathname)
    setDeviceMode(page?.category === 'admin' ? 'pc' : 'mobile')
  }, [location.pathname])

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar deviceMode={deviceMode} setDeviceMode={setDeviceMode} />

        <main className="flex-1 overflow-auto p-4">
          <div className={`mx-auto transition-all duration-300 ${
            deviceMode === 'mobile'
              ? 'w-[400px] h-[852px] bg-white shadow-2xl overflow-hidden relative'
              : 'w-full h-full bg-white shadow-lg rounded-lg'
          }`}>
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
