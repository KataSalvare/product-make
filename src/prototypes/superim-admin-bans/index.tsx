/**
 * @name 封禁管理
 *
 * @description
 * SuperIM 封禁管理页面。
 *
 * @usage
 * 访问路径: /admin/users/bans
 *
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */


import { useState } from 'react';
import { Ban, LockOpen, Users } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import './style.css';

const mockBans = [
  { id: 1, username: 'spam_user1', reason: '垃圾广告', banTime: '2025-01-26 10:00', unbanTime: '2025-02-26 10:00', operator: 'admin', status: 'active' },
  { id: 2, username: 'abuser_1', reason: '恶意骚扰', banTime: '2025-01-25 15:00', unbanTime: '2025-01-26 15:00', operator: 'operator1', status: 'active' },
  { id: 3, username: 'violator_1', reason: '违规发言', banTime: '2025-01-20 09:00', unbanTime: '2025-01-21 09:00', operator: 'admin', status: 'expired' },
];

const stats = [
  { title: '今日封禁', value: 5, icon: Ban, color: 'red' },
  { title: '今日解封', value: 2, icon: LockOpen, color: 'green' },
  { title: '总封禁中', value: 23, icon: Users, color: 'orange' },
];

export default function Component() {
  const [bans, setBans] = useState(mockBans);

  const handleUnban = (id: number) => {
    if (confirm('确定要解封该用户吗？')) {
      setBans(bans.map(b => b.id === id ? { ...b, status: 'unbanned' } : b));
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">封禁管理</h2>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
                    <stat.icon size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">用户</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">封禁原因</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">封禁时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">解封时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作人</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bans.map(ban => (
                  <tr key={ban.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-900">@{ban.username}</td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">{ban.reason}</span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">{ban.banTime}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{ban.unbanTime}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">@{ban.operator}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        ban.status === 'active' ? 'bg-red-100 text-red-700' :
                        ban.status === 'expired' ? 'bg-gray-100 text-gray-600' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {ban.status === 'active' ? '封禁中' : ban.status === 'expired' ? '已过期' : '已解封'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {ban.status === 'active' && (
                        <button 
                          onClick={() => handleUnban(ban.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded"
                          title="解封"
                        >
                          <LockOpen size={16} />
                        </button>
                      )}
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
