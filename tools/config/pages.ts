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
  'DEMO-ecommerce-detail': { path: '/demo/ecommerce-detail', label: 'DEMO 电商详情页' },
  'DEMO-sports-health-home': { path: '/demo/sports-health', label: 'DEMO 运动健康首页' },
  'DEMO-blockchain-wallet': { path: '/demo/blockchain-wallet', label: 'DEMO 区块链钱包' },
}

const adminPageConfig: Record<string, { path: string; label: string }> = {
  'DEMO-admin-saas-home': { path: '/demo/admin/saas-home', label: 'DEMO SaaS 平台首页' },
  'DEMO-admin-user-management': { path: '/demo/admin/user-management', label: 'DEMO 用户管理' },
  'DEMO-admin-analytics': { path: '/demo/admin/analytics', label: 'DEMO 运营数据看板' },
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
