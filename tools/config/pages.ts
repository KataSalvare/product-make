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
  'demo-login 20-22-24-906': { path: '/login2', label: '登录' },
  'demo-home': { path: '/home', label: '首页' },
  'demo-profile': { path: '/profile', label: '个人中心' },
}

const adminPageConfig: Record<string, { path: string; label: string }> = {
  'demo-admin-dashboard': { path: '/admin/dashboard', label: '仪表盘' },
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
