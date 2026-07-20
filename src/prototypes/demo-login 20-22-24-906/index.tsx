/**
 * @name 登录页
 */
import { useState } from 'react'
import { MessageCircle } from 'lucide-react'

export default function DemoLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div className="relative min-h-full bg-gradient-to-br from-[#7c5cff] via-[#6b4df7] to-[#a855f7] flex items-center justify-center p-6">
      <div className="demo-login-card w-full max-w-[360px] bg-white rounded-3xl shadow-2xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7c5cff] to-[#a855f7] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            L
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">欢迎回来</h1>
        <p className="text-sm text-center text-gray-500 mb-8">请登录你的账号继续</p>

        {/* Form */}
        <div className="demo-login-form space-y-5">
          <div className="demo-login-field">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">邮箱 / 用户名</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入邮箱或用户名"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7c5cff] focus:border-transparent transition-all"
            />
          </div>

          <div className="demo-login-field">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7c5cff] focus:border-transparent transition-all"
            />
          </div>

          <div className="demo-login-options flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#7c5cff] focus:ring-[#7c5cff]"
              />
              <span className="text-gray-600">记住我</span>
            </label>
            <button type="button" className="text-[#7c5cff] hover:underline font-medium">
              忘记密码？
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="demo-login-submit w-full py-3.5 rounded-xl bg-gradient-to-r from-[#7c5cff] to-[#a855f7] text-white font-semibold text-base shadow-lg shadow-purple-200 hover:shadow-xl hover:opacity-95 transition-all active:scale-[0.98]"
          >
            登录
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-4 text-gray-400">其他登录方式</span>
          </div>
        </div>

        {/* Social Login */}
        <div className="demo-login-social grid grid-cols-3 gap-3">
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-sm text-gray-700"
          >
            <MessageCircle size={16} className="text-green-500" />
            <span>微信</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-sm text-gray-700"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-900">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-sm text-gray-700"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-amber-600">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm-1-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5 7h-2v-3c0-.55-.45-1-1-1s-1 .45-1 1v3h-2v-6h2v.5c.5-.5 1.17-.83 1.92-.83 1.66 0 3.08 1.34 3.08 3v3.33z" />
            </svg>
            <span>企业微信</span>
          </button>
        </div>

        {/* Register */}
        <p className="demo-login-register text-center text-sm text-gray-500 mt-6">
          还没有账号？
          <button type="button" className="text-[#7c5cff] font-medium hover:underline ml-1">
            立即注册
          </button>
        </p>
      </div>

      {/* 确认登录弹窗：用于测试弹窗上的标注功能 */}
      {showConfirm && (
        <div
          className="demo-login-confirm-overlay absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
          data-overlay="confirm-login"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowConfirm(false)
          }}
        >
          <div className="demo-login-confirm-modal w-full max-w-[360px] bg-white rounded-2xl shadow-2xl p-6">
            <h2 className="demo-login-confirm-title text-lg font-bold text-gray-900 mb-2">确认登录</h2>
            <p className="demo-login-confirm-desc text-sm text-gray-500 mb-6">
              检测到在新设备上登录，请确认是否继续。
            </p>

            <div className="demo-login-confirm-info space-y-3 mb-6">
              <div className="demo-login-confirm-device flex items-center justify-between text-sm">
                <span className="text-gray-500">登录设备</span>
                <span className="font-medium text-gray-900">MacBook Pro · Chrome</span>
              </div>
              <div className="demo-login-confirm-location flex items-center justify-between text-sm">
                <span className="text-gray-500">登录地点</span>
                <span className="font-medium text-gray-900">上海市</span>
              </div>
              <div className="demo-login-confirm-time flex items-center justify-between text-sm">
                <span className="text-gray-500">登录时间</span>
                <span className="font-medium text-gray-900">2026-07-16 14:32</span>
              </div>
            </div>

            <div className="demo-login-confirm-actions flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="demo-login-confirm-cancel flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="demo-login-confirm-ok flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#7c5cff] to-[#a855f7] text-sm font-medium text-white hover:opacity-95 transition-colors"
              >
                确认登录
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
