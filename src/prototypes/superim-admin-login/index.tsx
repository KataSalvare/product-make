/**
 * @name 管理员登录
 *
 * @description
 * SuperIM 后台管理系统登录页面，提供管理员身份认证功能。
 * 包含账号密码验证、图形验证码、记住我等安全登录机制。
 *
 * @usage
 * 访问路径: /admin/login
 * 使用测试账号登录:
 * - admin / admin123 (超级管理员)
 * - operator / operator123 (运营专员)
 * - service / service123 (客服专员)
 *
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState, useEffect } from 'react';
import { User, Lock, Eye, EyeOff, Shield, Loader2 } from 'lucide-react';
import './style.css';

// 测试账号数据
const MOCK_ACCOUNTS = [
  { username: 'admin', password: 'admin123', role: '超级管理员' },
  { username: 'operator', password: 'operator123', role: '运营专员' },
  { username: 'service', password: 'service123', role: '客服专员' },
];

// 生成随机验证码
const generateCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export default function Component() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    captcha: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // 初始化验证码
  useEffect(() => {
    refreshCaptcha();
  }, []);

  // 刷新验证码
  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
    setFormData(prev => ({ ...prev, captcha: '' }));
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (loginError) {
      setLoginError('');
    }
  };

  // 验证表单
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = '请输入账号';
    } else if (formData.username.length < 3) {
      newErrors.username = '账号至少需要3个字符';
    }

    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少需要6个字符';
    }

    if (!formData.captcha) {
      newErrors.captcha = '请输入验证码';
    } else if (formData.captcha.toUpperCase() !== captchaCode) {
      newErrors.captcha = '验证码错误';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理登录
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setLoginError('');

    // 模拟登录请求
    setTimeout(() => {
      const account = MOCK_ACCOUNTS.find(
        acc => acc.username === formData.username && acc.password === formData.password
      );

      if (account) {
        // 登录成功
        console.log('登录成功:', account);
        // 存储登录信息
        if (formData.rememberMe) {
          localStorage.setItem('admin_user', JSON.stringify({
            username: account.username,
            role: account.role,
            loginTime: new Date().toISOString(),
          }));
        }
        // 跳转到 Dashboard
        window.location.href = '/prototypes/superim-admin-dashboard';
      } else {
        // 登录失败
        setLoginError('账号或密码错误');
        refreshCaptcha();
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="h-full flex items-center justify-center login-gradient">
      <div className="w-full max-w-md px-4">
        {/* 登录卡片 */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          {/* Logo 区域 */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">S</span>
            </div>
            <h1 className="text-2xl font-bold text-blue-900 mb-1">SuperIM Admin</h1>
            <p className="text-gray-500 text-sm">后台管理系统</p>
          </div>

          {/* 登录表单 */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* 账号输入框 */}
            <div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="请输入账号（邮箱/用户名）"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.username
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:border-blue-600 focus:ring-blue-200'
                  }`}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username}</p>
              )}
            </div>

            {/* 密码输入框 */}
            <div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="请输入密码"
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:border-blue-600 focus:ring-blue-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* 图形验证码 */}
            <div>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Shield size={20} />
                  </div>
                  <input
                    type="text"
                    name="captcha"
                    value={formData.captcha}
                    onChange={handleInputChange}
                    placeholder="请输入验证码"
                    maxLength={4}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all uppercase ${
                      errors.captcha
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:border-blue-600 focus:ring-blue-200'
                    }`}
                  />
                </div>
                {/* 验证码图片 */}
                <div
                  onClick={refreshCaptcha}
                  className="w-28 h-12 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer select-none overflow-hidden border border-gray-300 hover:border-blue-400 transition-colors"
                  title="点击刷新验证码"
                >
                  <span className="text-xl font-bold tracking-widest text-blue-900"
                    style={{
                      textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                      letterSpacing: '0.2em',
                    }}
                  >
                    {captchaCode.split('').map((char, i) => (
                      <span
                        key={i}
                        style={{
                          display: 'inline-block',
                          transform: `rotate(${Math.random() * 20 - 10}deg)`,
                          color: ['#1E40AF', '#3B82F6', '#F59E0B', '#10B981'][i % 4],
                        }}
                      >
                        {char}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
              {errors.captcha && (
                <p className="mt-1 text-sm text-red-500">{errors.captcha}</p>
              )}
            </div>

            {/* 记住我 */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-900 border-gray-300 rounded focus:ring-blue-600"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600 cursor-pointer">
                记住我（7天内自动登录）
              </label>
            </div>

            {/* 登录错误提示 */}
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 text-center">{loginError}</p>
              </div>
            )}

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  登录中...
                </>
              ) : (
                '登 录'
              )}
            </button>

            {/* 忘记密码 */}
            <div className="text-center">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert('请联系超级管理员重置密码');
                }}
                className="text-sm text-blue-900 hover:text-blue-700 hover:underline transition-colors"
              >
                忘记密码？
              </a>
            </div>
          </form>

          {/* 测试账号提示 */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-2">测试账号</p>
            <div className="text-xs text-gray-400 space-y-1 text-center">
              <p>admin / admin123（超级管理员）</p>
              <p>operator / operator123（运营专员）</p>
              <p>service / service123（客服专员）</p>
            </div>
          </div>
        </div>

        {/* 版权信息 */}
        <p className="text-center text-white/70 text-sm mt-6">
          © 2025 SuperIM. All rights reserved.
        </p>
      </div>
    </div>
  );
}
