/**
 * @name 用户详情
 *
 * @description
 * SuperIM 用户详情页面。
 *
 * @usage
 * 访问路径: /admin/users/:id
 *
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState } from 'react';
import { ArrowLeft, MessageCircle, Users, Globe, Phone, Edit2, Ban } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import './style.css';

const mockUser = {
  id: 1,
  username: 'john_doe',
  nickname: 'John Doe',
  phone: '+86 138****8888',
  email: 'john@example.com',
  avatar: '',
  status: 'normal',
  registerTime: '2024-01-15',
  lastLogin: '2025-01-26 10:30',
  stats: {
    messages: 12345,
    friends: 128,
    posts: 56,
    callDuration: 3600,
  }
};

const mockLogs = [
  { id: 1, time: '2025-01-26 10:30:00', action: '登录', content: '用户登录APP', ip: '192.168.1.100' },
  { id: 2, time: '2025-01-26 09:15:00', action: '发送消息', content: '发送消息给 mary_smith', ip: '192.168.1.100' },
  { id: 3, time: '2025-01-25 18:00:00', action: '发布动态', content: '发布新动态', ip: '192.168.1.100' },
];

export default function Component() {
  const [user] = useState(mockUser);

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
          {/* Back */}
          <a href="/prototypes/superim-admin-users" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft size={18} />
            返回用户列表
          </a>

          {/* User Info Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-700">{user.nickname.charAt(0)}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user.nickname}</h2>
                  <p className="text-gray-500">@{user.username}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span>{user.phone}</span>
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
                  <Edit2 size={16} />
                  编辑
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50">
                  <Ban size={16} />
                  封禁
                </button>
              </div>
            </div>
            <div className="flex gap-8 mt-6 pt-6 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-500">注册时间</p>
                <p className="font-medium">{user.registerTime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">最后登录</p>
                <p className="font-medium">{user.lastLogin}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">账号状态</p>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">正常</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">消息数</p>
                  <p className="text-xl font-bold">{user.stats.messages.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">好友数</p>
                  <p className="text-xl font-bold">{user.stats.friends}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">动态数</p>
                  <p className="text-xl font-bold">{user.stats.posts}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">通话时长</p>
                  <p className="text-xl font-bold">{Math.floor(user.stats.callDuration / 60)}h</p>
                </div>
              </div>
            </div>
          </div>

          {/* Logs */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">操作记录</h3>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">内容</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">IP地址</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-500">{log.time}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{log.action}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{log.content}</td>
                    <td className="px-4 py-4 text-sm text-gray-500 font-mono">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
