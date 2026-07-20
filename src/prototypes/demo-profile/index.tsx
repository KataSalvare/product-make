import { useState } from 'react'
import { ChevronRight, Settings, CreditCard, MapPin, HelpCircle, Shield, Edit3, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function DemoProfile() {
  const [nickname, setNickname] = useState('Demo User')
  const [bio, setBio] = useState('热爱探索新产品，喜欢记录生活。')
  const [showEdit, setShowEdit] = useState(false)

  const stats = [
    { id: 'stat-followers', label: '关注', value: 128 },
    { id: 'stat-following', label: '粉丝', value: 86 },
    { id: 'stat-likes', label: '获赞', value: 3420 },
  ]

  const menus = [
    { id: 'menu-orders', icon: CreditCard, label: '我的订单', badge: '2' },
    { id: 'menu-address', icon: MapPin, label: '收货地址' },
    { id: 'menu-security', icon: Shield, label: '账号安全' },
    { id: 'menu-help', icon: HelpCircle, label: '帮助中心' },
    { id: 'menu-settings', icon: Settings, label: '设置' },
  ]

  return (
    <div id="demo-profile" className="relative w-full min-h-full bg-gray-50 flex flex-col font-sans">
      {/* 顶部 */}
      <header id="demo-profile-header" className="bg-white px-4 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-lg font-bold text-gray-900">个人中心</h1>
        <button
          id="demo-profile-edit"
          onClick={() => setShowEdit(true)}
          className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <Edit3 size={18} />
        </button>
      </header>

      {/* 用户信息卡片 */}
      <main id="demo-profile-content" className="flex-1 px-4 py-5 space-y-5 pb-8">
        <section id="demo-profile-card" className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div
            id="demo-profile-avatar"
            className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xl font-bold"
          >
            D
          </div>
          <div className="flex-1 min-w-0">
            <h2 id="demo-profile-nickname" className="text-lg font-bold text-gray-900 truncate">
              {nickname}
            </h2>
            <p id="demo-profile-bio" className="text-sm text-gray-500 truncate">
              {bio}
            </p>
            <p id="demo-profile-id" className="text-xs text-gray-400 mt-1">
              ID: 10086001
            </p>
          </div>
        </section>

        {/* 数据统计 */}
        <section id="demo-profile-stats" className="grid grid-cols-3 gap-3">
          {stats.map((item) => (
            <button
              key={item.id}
              id={item.id}
              className="bg-white rounded-xl p-4 shadow-sm text-center hover:shadow-md transition-shadow"
            >
              <div className="text-xl font-bold text-gray-900">{item.value}</div>
              <div className="text-xs text-gray-500 mt-1">{item.label}</div>
            </button>
          ))}
        </section>

        {/* 功能菜单 */}
        <section id="demo-profile-menu" className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
          {menus.map((item) => (
            <button
              key={item.id}
              id={item.id}
              className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <item.icon size={16} />
                </div>
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] rounded-full bg-red-100 text-red-600">{item.badge}</span>
                )}
                <ChevronRight size={16} className="text-gray-300" />
              </div>
            </button>
          ))}
        </section>

        {/* 退出登录 */}
        <Button id="demo-profile-logout" variant="outline" className="w-full">
          退出登录
        </Button>
      </main>

      {/* 编辑资料弹窗 */}
      {showEdit && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
          data-overlay="profile-edit"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowEdit(false)
          }}
        >
          <div className="w-full max-w-[320px] bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">编辑资料</h2>
              <button
                onClick={() => setShowEdit(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">修改你的昵称和简介，保存后实时生效。</p>
            <div className="space-y-4 mb-6">
              <div className="space-y-1.5">
                <Label htmlFor="profile-nickname">昵称</Label>
                <Input
                  id="profile-nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="请输入昵称"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-bio">简介</Label>
                <Input
                  id="profile-bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="请输入简介"
                />
              </div>
            </div>
            <Button className="w-full" onClick={() => setShowEdit(false)}>
              保存
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
