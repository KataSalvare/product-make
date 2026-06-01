/**
 * @name 基础配置
 *
 * @description
 * SuperIM 基础配置页面。
 *
 * @usage
 * 访问路径: /admin/settings/general
 *
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState } from 'react';
import { Save } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import './style.css';

export default function Component() {
  const [config, setConfig] = useState({
    appName: 'SuperIM',
    version: '1.0.0',
    allowRegister: true,
    needCaptcha: true,
    messageRetention: 30,
    maxGroupMembers: 500,
  });

  const handleSave = () => {
    alert('配置已保存！');
  };

  return (
    <div className="h-full bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">SuperIM Admin</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-700">A</span>
            </div>
            <span className="text-sm text-gray-700">管理员</span>
          </div>
        </div>
      </header>

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">基础配置</h2>

          <div className="max-w-2xl bg-white rounded-xl shadow-sm p-6 space-y-6">
            {/* App Info */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">应用信息</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">应用名称</label>
                  <input
                    type="text"
                    value={config.appName}
                    onChange={(e) => setConfig({ ...config, appName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">版本号</label>
                  <input
                    type="text"
                    value={config.version}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Register Settings */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">注册设置</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={config.allowRegister}
                    onChange={(e) => setConfig({ ...config, allowRegister: e.target.checked })}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>开放用户注册</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={config.needCaptcha}
                    onChange={(e) => setConfig({ ...config, needCaptcha: e.target.checked })}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>注册需要验证码</span>
                </label>
              </div>
            </div>

            {/* Message Settings */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">消息设置</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">消息保留时长（天）</label>
                  <input
                    type="number"
                    value={config.messageRetention}
                    onChange={(e) => setConfig({ ...config, messageRetention: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">群聊最大人数</label>
                  <input
                    type="number"
                    value={config.maxGroupMembers}
                    onChange={(e) => setConfig({ ...config, maxGroupMembers: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Save */}
            <div className="pt-6 border-t border-gray-200">
              <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800">
                <Save size={18} />
                保存配置
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
