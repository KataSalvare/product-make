import { useState } from 'react'
import { Bell, Search, Home, Compass, Heart, User, ShoppingBag, Gift, Ticket, Star, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DemoHome() {
  const [activeTab, setActiveTab] = useState('home')
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)

  const features = [
    { id: 'feature-shop', icon: ShoppingBag, label: '商城', color: 'bg-blue-100 text-blue-600' },
    { id: 'feature-coupon', icon: Ticket, label: '优惠券', color: 'bg-orange-100 text-orange-600' },
    { id: 'feature-gift', icon: Gift, label: '积分兑换', color: 'bg-pink-100 text-pink-600' },
    { id: 'feature-star', icon: Star, label: '收藏', color: 'bg-yellow-100 text-yellow-600' },
  ]

  const recommendations = [
    { id: 'rec-1', title: '新品首发', desc: '限时特惠，先到先得', tag: '热销' },
    { id: 'rec-2', title: '会员专享', desc: '积分双倍返还', tag: '会员' },
    { id: 'rec-3', title: '每日签到', desc: '连续签到领大奖', tag: '活动' },
  ]

  const currentFeature = features.find((f) => f.id === selectedFeature)

  return (
    <div id="demo-home" className="relative w-full min-h-full bg-gray-50 flex flex-col font-sans">
      {/* 顶部导航 */}
      <header id="demo-home-header" className="sticky top-0 z-10 bg-white px-4 py-3 flex items-center justify-between shadow-sm">
        <div id="demo-home-logo" className="text-lg font-bold text-blue-600">
          DemoApp
        </div>
        <div className="flex items-center gap-3">
          <button id="demo-home-search" className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
            <Search size={18} />
          </button>
          <button id="demo-home-notice" className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 relative">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>
      </header>

      {/* 内容区 */}
      <main id="demo-home-content" className="flex-1 px-4 py-4 space-y-5 pb-24">
        {/* Banner */}
        <section id="demo-home-banner" className="rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white shadow-md">
          <h1 className="text-2xl font-bold mb-2">欢迎回来</h1>
          <p className="text-blue-100 text-sm mb-4">发现更多精彩内容和专属优惠</p>
          <Button id="demo-home-banner-cta" size="sm" className="bg-white text-blue-600 hover:bg-blue-50">
            立即探索
          </Button>
        </section>

        {/* 功能入口 */}
        <section id="demo-home-features" className="grid grid-cols-4 gap-3">
          {features.map((item) => (
            <button
              key={item.id}
              id={item.id}
              onClick={() => setSelectedFeature(item.id)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.color}`}>
                <item.icon size={20} />
              </div>
              <span className="text-xs text-gray-700">{item.label}</span>
            </button>
          ))}
        </section>

        {/* 推荐列表 */}
        <section id="demo-home-recommend" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">为你推荐</h2>
            <button id="demo-home-recommend-more" className="text-sm text-blue-600 hover:underline">
              查看更多
            </button>
          </div>
          <div className="space-y-3">
            {recommendations.map((item) => (
              <div
                key={item.id}
                id={item.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-sm"
              >
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <span className="px-2 py-0.5 text-[10px] rounded-full bg-red-100 text-red-600">{item.tag}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{item.desc}</p>
                </div>
                <button className="px-3 py-1.5 text-xs rounded-full bg-blue-600 text-white hover:bg-blue-700">
                  参与
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 底部导航 */}
      <nav id="demo-home-tabbar" className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 flex justify-between z-20">
        {[
          { id: 'tab-home', icon: Home, label: '首页', value: 'home' },
          { id: 'tab-explore', icon: Compass, label: '发现', value: 'explore' },
          { id: 'tab-favorite', icon: Heart, label: '关注', value: 'favorite' },
          { id: 'tab-profile', icon: User, label: '我的', value: 'profile' },
        ].map((tab) => (
          <button
            key={tab.value}
            id={tab.id}
            onClick={() => setActiveTab(tab.value)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
              activeTab === tab.value ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <tab.icon size={20} />
            <span className="text-[10px]">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* 功能入口弹窗 */}
      {selectedFeature && currentFeature && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
          data-overlay="feature-detail"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedFeature(null)
          }}
        >
          <div className="w-full max-w-[320px] bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">{currentFeature.label}</h2>
              <button
                onClick={() => setSelectedFeature(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              这是 {currentFeature.label} 模块的示例弹窗，用于测试批注功能对弹窗内元素的标注能力。
            </p>
            <div className="h-24 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-sm mb-4">
              {currentFeature.label} 内容占位
            </div>
            <Button className="w-full">进入{currentFeature.label}</Button>
          </div>
        </div>
      )}
    </div>
  )
}
