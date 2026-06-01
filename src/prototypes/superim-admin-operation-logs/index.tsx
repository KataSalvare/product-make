/**
 * @name 操作日志
 *
 * @description
 * SuperIM 操作日志页面。
 *
 * @usage
 * 访问路径: /admin/logs/operation
 *
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState } from 'react';
import { Search, Calendar, Shield, LogOut, Plus, Edit2, Trash2 } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import './style.css';

const mockLogs = [
  { id: 1, time: '2025-01-26 10:30:00', admin: 'admin', action: '登录', target: '系统', content: '管理员登录后台', ip: '192.168.1.100' },
  { id: 2, time: '2025-01-26 10:35:00', admin: 'operator1', action: '更新', target: '用户', content: '修改用户 john_doe 状态为正常', ip: '192.168.1.101' },
  { id: 3, time: '2025-01-26 10:40:00', admin: 'operator1', action: '删除', target: '动态', content: '删除违规动态 #12345', ip: '192.168.1.101' },
  { id: 4, time: '2025-01-26 09:15:00', admin: 'service1', action: '创建', target: '通知', content: '发送系统维护通知', ip: '192.168.1.102' },
  { id: 5, time: '2025-01-26 09:00:00', admin: 'admin', action: '登出', target: '系统', content: '管理员登出后台', ip: '192.168.1.100' },
];

const actionIcons: Record<string, React.ReactNode> = {
  '登录': <Shield size={14} />,
  '登出': <LogOut size={14} />,
  '创建': <Plus size={14} />,
  '更新': <Edit2 size={14} />,
  '删除': <Trash2 size={14} />,
};

const actionColors: Record<string, string> = {
  '登录': 'bg-green-100 text-green-700',
  '登出': 'bg-gray-100 text-gray-600',
  '创建': 'bg-blue-100 text-blue-700',
  '更新': 'bg-yellow-100 text-yellow-700',
  '删除': 'bg-red-100 text-red-700',
};

export default function Component() {
  const [logs] = useState(mockLogs);

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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">操作日志</h2>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Search size={18} className="text-gray-400" />
                <input type="text" placeholder="搜索管理员" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>全部操作</option>
                <option>登录</option>
                <option>登出</option>
                <option>创建</option>
                <option>更新</option>
                <option>删除</option>
              </select>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-gray-400" />
                <input type="date" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                <span className="text-gray-400">至</span>
                <input type="date" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">管理员</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作类型</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作对象</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作内容</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">IP地址</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-500">{log.time}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">@{log.admin}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${actionColors[log.action]}`}>
                        {actionIcons[log.action]}
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{log.target}</td>
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
