import type React from 'react'

export type PageCategory = 'frontend' | 'admin'

export interface PageItem {
  path: string
  label: string
  component: React.ComponentType
  category: PageCategory
  dirName: string
}

const allModules = import.meta.glob('../../src/prototypes/*/index.tsx', { eager: true })

const frontendModules: Record<string, unknown> = {}
const adminModules: Record<string, unknown> = {}

Object.entries(allModules).forEach(([path, mod]) => {
  const match = path.match(/\.\.\/\.\.\/src\/prototypes\/([^/]+)\//)
  if (match) {
    const dirName = match[1]
    if (dirName.includes('admin')) {
      adminModules[path] = mod
    } else {
      frontendModules[path] = mod
    }
  }
})

const frontendPageConfig: Record<string, { path: string; label: string }> = {
  'superim-splash': { path: '/splash', label: '启动页' },
  'superim-login': { path: '/login', label: '登录' },
  'superim-register': { path: '/register', label: '注册' },
  'superim-forgotpassword': { path: '/forgot-password', label: '忘记密码' },
  'superim-chats': { path: '/chats', label: '聊天列表' },
  'superim-chatroom': { path: '/chatroom', label: '聊天室' },
  'superim-groupchat': { path: '/group-chat', label: '群聊' },
  'superim-groupchat-settings': { path: '/group-chat-settings', label: '群聊设置' },
  'superim-contacts': { path: '/contacts', label: '通讯录' },
  'superim-contact-selection': { path: '/contact-selection', label: '选择联系人' },
  'superim-addcontact': { path: '/add-contact', label: '添加联系人' },
  'superim-feed': { path: '/feed', label: '动态' },
  'superim-newpost': { path: '/new-post', label: '发布动态' },
  'superim-postdetail': { path: '/post/:id', label: '动态详情' },
  'superim-myposts': { path: '/my-posts', label: '我的动态' },
  'superim-me': { path: '/me', label: '个人中心' },
  'superim-userprofile': { path: '/user-profile', label: '查看用户资料' },
  'superim-editprofile': { path: '/edit-profile', label: '编辑资料' },
  'superim-calls': { path: '/calls', label: '通话记录' },
  'superim-callscreen': { path: '/call-screen', label: '通话界面' },
  'superim-security': { path: '/security', label: '安全设置' },
  'superim-privacy-settings': { path: '/privacy-settings', label: '隐私设置' },
  'superim-forwardmessage': { path: '/forward-message', label: '转发消息' },
  'superim-temp-chat': { path: '/temp-chat/:userId', label: '临时会话' },
  'superim-chat-folders': { path: '/chat-folders', label: '对话文件夹' },
  'superim-favorites': { path: '/favorites', label: '收藏夹' },
  'superim-favorite-detail': { path: '/favorite/:id', label: '收藏详情' },
  'superim-account-switcher': { path: '/account-switcher', label: '账号切换' },
  'superim-settings': { path: '/settings', label: '设置' },
  'superim-cloud-drive': { path: '/cloud-drive', label: '云盘首页' },
  'superim-cloud-drive-folder': { path: '/cloud-drive/folder/:folderId', label: '云盘文件夹' },
  'superim-cloud-drive-file': { path: '/cloud-drive/file/:fileId', label: '云盘文件详情' },
  'superim-wallet': { path: '/wallet/*', label: '钱包原型' },
}

const adminPageConfig: Record<string, { path: string; label: string }> = {
  'superim-admin-login': { path: '/admin/login', label: '管理员登录' },
  'superim-admin-dashboard': { path: '/admin/dashboard', label: '仪表盘' },
  'superim-admin-bigscreen': { path: '/admin/bigscreen', label: '数据大屏' },
  'superim-admin-cloud-drive': { path: '/admin/cloud-drive', label: '云盘总览' },
  'superim-admin-cloud-drive-files': { path: '/admin/cloud-drive/files', label: '文件管理' },
  'superim-admin-cloud-drive-quotas': { path: '/admin/cloud-drive/quotas', label: '用户配额' },
  'superim-admin-cloud-drive-audit': { path: '/admin/cloud-drive/audit', label: '操作审计' },
  'superim-admin-users': { path: '/admin/users', label: '用户列表' },
  'superim-admin-user-detail': { path: '/admin/users/:userId', label: '用户详情' },
  'superim-admin-online-users': { path: '/admin/online-users', label: '在线用户' },
  'superim-admin-bans': { path: '/admin/bans', label: '封禁管理' },
  'superim-admin-conversations': { path: '/admin/conversations', label: '会话列表' },
  'superim-admin-conversation-detail': { path: '/admin/conversations/:convId', label: '会话详情' },
  'superim-admin-message-reports': { path: '/admin/message-reports', label: '举报消息' },
  'superim-admin-sensitive-words': { path: '/admin/sensitive-words', label: '敏感词库' },
  'superim-admin-feed': { path: '/admin/feed', label: '动态列表' },
  'superim-admin-feed-detail': { path: '/admin/feed/:feedId', label: '动态详情' },
  'superim-admin-feed-reports': { path: '/admin/feed-reports', label: '动态举报' },
  'superim-admin-comments': { path: '/admin/comments', label: '评论管理' },
  'superim-admin-calls': { path: '/admin/calls', label: '通话记录' },
  'superim-admin-settings': { path: '/admin/settings', label: '基础配置' },
  'superim-admin-versions': { path: '/admin/versions', label: '版本管理' },
  'superim-admin-admins': { path: '/admin/admins', label: '管理员列表' },
  'superim-admin-roles': { path: '/admin/roles', label: '角色管理' },
  'superim-admin-operation-logs': { path: '/admin/operation-logs', label: '操作日志' },
  'superim-admin-login-logs': { path: '/admin/login-logs', label: '登录日志' },
  'superim-admin-system-logs': { path: '/admin/system-logs', label: '系统日志' },
  'superim-admin-wallet': { path: '/admin/wallet/*', label: '钱包管理' },
  'demo-admin-dashboard': { path: '/admin/dashboard-demo', label: '仪表盘 Demo' },
  'demo-admin-orders': { path: '/admin/orders', label: '订单管理' },
}

export const getDefaultComponent = (mod: unknown): React.ComponentType => {
  const moduleWithDefault = mod as { default?: React.ComponentType }
  return moduleWithDefault?.default || (() => null)
}

export const generatePages = (): PageItem[] => {
  const pages: PageItem[] = []

  Object.entries(frontendModules).forEach(([filePath, mod]) => {
    const match = filePath.match(/\.\.\/\.\.\/src\/prototypes\/([^/]+)\//)
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

  Object.entries(adminModules).forEach(([filePath, mod]) => {
    const match = filePath.match(/\.\.\/\.\.\/src\/prototypes\/([^/]+)\//)
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

export const pages = generatePages()
