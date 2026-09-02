import type { ReactNode } from 'react'
import { ConfigProvider } from 'antd'
import { adminTheme } from '../themes/antd-new/theme'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'

export interface AdminShellProps {
  title: string
  description?: string
  selectedKey?: string
  actions?: ReactNode
  children: ReactNode
}

/**
 * 后台内容页壳层。
 * 顶部导航和侧边菜单直接复用用户列表后台的实现，页面只负责提供内容区。
 */
export default function AdminShell({ title, description, actions, children }: AdminShellProps) {
  return (
    <ConfigProvider theme={adminTheme}>
      <div className="h-full bg-gray-50">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                {description && <p className="text-gray-500 mt-1">{description}</p>}
              </div>
              {actions && <div>{actions}</div>}
            </div>
            {children}
          </main>
        </div>
      </div>
    </ConfigProvider>
  )
}
