import { useState } from 'react'
import { LayoutDashboard, ShoppingCart, Users, BarChart3, Settings, Search, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export default function DemoAdminOrders() {
  const [activeMenu, setActiveMenu] = useState('orders')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<(typeof orders)[0] | null>(null)

  const menuItems = [
    { id: 'menu-dashboard', icon: LayoutDashboard, label: '仪表盘', value: 'dashboard' },
    { id: 'menu-orders', icon: ShoppingCart, label: '订单管理', value: 'orders' },
    { id: 'menu-users', icon: Users, label: '用户管理', value: 'users' },
    { id: 'menu-analytics', icon: BarChart3, label: '数据分析', value: 'analytics' },
    { id: 'menu-settings', icon: Settings, label: '系统设置', value: 'settings' },
  ]

  const filters = [
    { id: 'filter-all', label: '全部', value: 'all' },
    { id: 'filter-paid', label: '已支付', value: 'paid' },
    { id: 'filter-pending', label: '待支付', value: 'pending' },
    { id: 'filter-refund', label: '退款中', value: 'refund' },
  ]

  const orders = [
    { id: 'ORD-20240716001', customer: '张三', product: '年度会员', amount: 299, status: 'paid', time: '2026-07-16 09:23' },
    { id: 'ORD-20240716002', customer: '李四', product: '高级插件包', amount: 128, status: 'pending', time: '2026-07-16 08:56' },
    { id: 'ORD-20240716003', customer: '王五', product: '企业授权', amount: 1999, status: 'paid', time: '2026-07-15 18:12' },
    { id: 'ORD-20240716004', customer: '赵六', product: '月度会员', amount: 39, status: 'refund', time: '2026-07-15 14:30' },
    { id: 'ORD-20240716005', customer: '孙七', product: '高级插件包', amount: 128, status: 'paid', time: '2026-07-15 11:05' },
  ]

  const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    paid: { label: '已支付', variant: 'default' },
    pending: { label: '待支付', variant: 'secondary' },
    refund: { label: '退款中', variant: 'destructive' },
  }

  const filteredOrders = statusFilter === 'all' ? orders : orders.filter((o) => o.status === statusFilter)

  return (
    <div id="demo-admin-orders" className="relative w-full h-full bg-gray-50 flex font-sans">
      {/* 侧边栏 */}
      <aside id="demo-admin-orders-sidebar" className="w-56 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div id="demo-admin-orders-logo" className="h-16 flex items-center px-6 border-b border-gray-100">
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
        <header id="demo-admin-orders-header" className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between flex-shrink-0">
          <h1 className="text-lg font-bold text-gray-900">订单管理</h1>
          <div className="flex items-center gap-3 w-80">
            <Search size={18} className="text-gray-400" />
            <Input placeholder="搜索订单号、客户或商品..." className="h-9 border-0 bg-gray-100 focus-visible:ring-1" />
          </div>
        </header>

        {/* 订单内容 */}
        <main id="demo-admin-orders-content" className="flex-1 overflow-auto p-6">
          {/* 筛选 */}
          <section id="demo-admin-orders-filters" className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {filters.map((item) => (
                <button
                  key={item.value}
                  id={item.id}
                  onClick={() => setStatusFilter(item.value)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    statusFilter === item.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <Button id="demo-admin-orders-filter-btn" variant="outline" size="sm">
              <Filter size={14} className="mr-1" />
              高级筛选
            </Button>
          </section>

          {/* 订单表格 */}
          <section id="demo-admin-orders-table" className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">订单号</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">客户</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">商品</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">金额</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">状态</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">下单时间</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} id={`order-row-${order.id}`} className="hover:bg-gray-50">
                    <td className="px-5 py-3.5 font-medium text-gray-900">{order.id}</td>
                    <td className="px-5 py-3.5 text-gray-700">{order.customer}</td>
                    <td className="px-5 py-3.5 text-gray-700">{order.product}</td>
                    <td className="px-5 py-3.5 text-gray-900 font-medium">¥{order.amount}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={statusMap[order.status].variant}>{statusMap[order.status].label}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{order.time}</td>
                    <td className="px-5 py-3.5">
                      <button
                        id={`order-detail-${order.id}`}
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* 分页 */}
          <section id="demo-admin-orders-pagination" className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">共 {filteredOrders.length} 条记录</span>
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
                <ChevronLeft size={16} />
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm">1</button>
              <button className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm hover:bg-gray-50">2</button>
              <button className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm hover:bg-gray-50">3</button>
              <button className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
                <ChevronRight size={16} />
              </button>
            </div>
          </section>
        </main>
      </div>

      {/* 订单详情弹窗 */}
      {selectedOrder && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
          data-overlay="order-detail"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedOrder(null)
          }}
        >
          <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">订单详情</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">订单号：{selectedOrder.id}</p>
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">客户</span>
                <span className="font-medium text-gray-900">{selectedOrder.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">商品</span>
                <span className="font-medium text-gray-900">{selectedOrder.product}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">金额</span>
                <span className="font-medium text-gray-900">¥{selectedOrder.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">状态</span>
                <Badge variant={statusMap[selectedOrder.status].variant}>{statusMap[selectedOrder.status].label}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">下单时间</span>
                <span className="text-gray-700">{selectedOrder.time}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedOrder(null)}>
                关闭
              </Button>
              <Button className="flex-1">处理订单</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
