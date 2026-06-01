/**
 * @name 在线用户
 *
 * @description
 * SuperIM 在线用户管理页面。
 *
 * @usage
 * 访问路径: /admin/users/online
 *
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState } from 'react';
import { Wifi, LogOut, Smartphone, Monitor } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import './style.css';

const mockOnlineUsers = [
  { id: 1, username: 'john_doe', loginTime: '2025-01-26 10:00', duration: '30分钟', ip: '192.168.1.100', device: 'iPhone 14' },
  { id: 2, username: 'mary_smith', loginTime: '2025-01-26 09:30', duration: '1小时', ip: '192.168.1.101', device: 'Android' },
  { id: 3, username: 'alex_wang', loginTime: '2025-01-26 09:00', duration: '1.5小时', ip: '192.168.1.102', device: 'Web' },
  { id: 4, username: 'lisa_chen', loginTime: '2025-01-26 08:30', duration: '2小时', ip: '192.168.1.103', device: 'iPad' },
];

export default function Component() {
  const [users, setUsers] = useState(mockOnlineUsers);

  const handleKick = (id: number) => {
    if (confirm('确定要强制下线该用户吗？')) {
      setUsers(users.filter(u => u.id !== id));
    }
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">在线用户</h2>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">当前在线</p>
                  <p className="text-2xl font-bold text-gray-900">1,234</p>
                </div>
                <div className="p-3 rounded-lg bg-green-50 text-green-600">
                  <Wifi size={24} />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">移动端在线</p>
                  <p className="text-2xl font-bold text-gray-900">987</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                  <Smartphone size={24} />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Web端在线</p>
                  <p className="text-2xl font-bold text-gray-900">247</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                  <Monitor size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">用户</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">登录时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">在线时长</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">IP地址</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">设备</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-900">@{user.username}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{user.loginTime}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{user.duration}</td>
                    <td className="px-4 py-4 text-sm text-gray-500 font-mono">{user.ip}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{user.device}</td>
                    <td className="px-4 py-4">
                      <button 
                        onClick={() => handleKick(user.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="强制下线"
                      >
                        <LogOut size={16} />
                      </button>
                    </td>
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
