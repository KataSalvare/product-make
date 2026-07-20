import { useState } from 'react'
import { LayoutDashboard, ShoppingCart, Users, BarChart3, Settings, Bell, Search, TrendingUp, TrendingDown, ArrowRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function DemoAdminDashboard() {
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [selectedNotice, setSelectedNotice] = useState<typeof notices[0] | null>(null)

  const stats = [
    { id: 'stat-revenue', label: '今日营收', value: '¥12,580', change: '+12.5%', up: true },
    { id: 'stat-orders', label: '今日订单', value: '326', change: '+8.2%', up: true },
    { id: 'stat-users', label: '新增用户', value: '58', change: '-3.1%', up: false },
    { id: 'stat-visit', label: '访问量', value: '4,210', change: '+21.0%', up: true },
  ]

  const notices = [
    { id: 'notice-1', title: '系统维护通知', time: '2026-07-16 02:00', content: '计划进行系统升级，预计耗时2小时。' },
    { id: 'notice-2', title: '新订单规则上线', time: '2026-07-15 10:30', content: '退款审核流程已优化，请及时查看。' },
    { id: 'notice-3', title: '数据备份完成', time: '2026-07-14 23:00', content: '上周数据已自动备份至云端。' },
  ]

  const activities = [
    { id: 'act-1', user: '张三', action: '完成了订单 #1024', time: '10 分钟前' },
    { id: 'act-2', user: '李四', action: '提交了退款申请', time: '32 分钟前' },
    { id: 'act-3', user: '王五', action: '注册了新账号', time: '1 小时前' },
  ]

  const menuItems = [
    { id: 'menu-dashboard', icon: LayoutDashboard, label: '仪表盘', value: 'dashboard' },
    { id: 'menu-orders', icon: ShoppingCart, label: '订单管理', value: 'orders' },
    { id: 'menu-users', icon: Users, label: '用户管理', value: 'users' },
    { id: 'menu-analytics', icon: BarChart3, label: '数据分析', value: 'analytics' },
    { id: 'menu-settings', icon: Settings, label: '系统设置', value: 'settings' },
  ]

  return (
    <div id="demo-admin-dashboard" className="relative w-full h-full bg-gray-50 flex font-sans">
      {/* 侧边栏 */}
      <aside id="demo-admin-sidebar" className="w-56 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div id="demo-admin-logo" className="h-16 flex items-center px-6 border-b border-gray-100">
          <span className="text-lg font-bold text-blue-600">AdminDemo</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.value}
              id={item.id}
              onClick={() => setActiveMenu(item.value)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeMenu === item.value
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* 主内容 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶部栏 */}
        <header id="demo-admin-header" className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3 w-80">
            <Search size={18} className="text-gray-400" />
            <Input placeholder="搜索功能、数据或用户..." className="h-9 border-0 bg-gray-100 focus-visible:ring-1" />
          </div>
          <div className="flex items-center gap-4">
            <button id="demo-admin-notice" className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div id="demo-admin-user" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                A
              </div>
              <span className="text-sm font-medium text-gray-700">管理员</span>
            </div>
          </div>
        </header>

        {/* 仪表盘内容 */}
        <main id="demo-admin-content" className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900">仪表盘</h1>
            <p className="text-sm text-gray-500 mt-1">欢迎回来，今日数据概览如下。</p>
          </div>

          {/* 统计卡片 */}
          <section id="demo-admin-stats" className="grid grid-cols-4 gap-4 mb-6">
            {stats.map((item) => (
              <div key={item.id} id={item.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{item.value}</p>
                <div className={`flex items-center gap-1 mt-2 text-xs ${item.up ? 'text-green-600' : 'text-red-600'}`}>
                  {item.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  <span>{item.change}</span>
                  <span className="text-gray-400 ml-1">较昨日</span>
                </div>
              </div>
            ))}
          </section>

          <div className="grid grid-cols-3 gap-6">
            {/* 图表占位 */}
            <section id="demo-admin-chart" className="col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">营收趋势</h2>
                <Button id="demo-admin-chart-action" variant="outline" size="sm">
                  查看报告
                </Button>
              </div>
              <div className="h-64 bg-gray-50 rounded-lg flex items-end justify-between px-6 pb-6 pt-10 gap-3">
                {[35, 55, 42, 68, 48, 72, 60].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-blue-500 rounded-t-md opacity-80 hover:opacity-100 transition-opacity"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </section>

            {/* 公告 */}
            <section id="demo-admin-notices" className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-4">系统公告</h2>
              <div className="space-y-3">
                {notices.map((item) => (
                  <button
                    key={item.id}
                    id={item.id}
                    onClick={() => setSelectedNotice(item)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{item.title}</span>
                      <ArrowRight size={14} className="text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* 最近动态 */}
          <section id="demo-admin-activities" className="mt-6 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">最近动态</h2>
            <div className="divide-y divide-gray-100">
              {activities.map((item) => (
                <div key={item.id} id={item.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-medium">
                      {item.user[0]}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">{item.user}</span>
                      <span className="text-sm text-gray-500 ml-1">{item.action}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* 公告详情弹窗 */}
      {selectedNotice && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
          data-overlay="notice-detail"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedNotice(null)
          }}
        >
          <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">{selectedNotice.title}</h2>
              <button
                onClick={() => setSelectedNotice(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-4">{selectedNotice.time}</p>
            <p className="text-sm text-gray-700 mb-6">{selectedNotice.content}</p>
            <Button className="w-full" onClick={() => setSelectedNotice(null)}>
              我知道了
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
