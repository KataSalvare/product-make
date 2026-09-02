/**
 * @name 登录日志
 *
 * @description
 * SuperIM 登录日志页面。
 *
 * @usage
 * 访问路径: /admin/logs/login
 *
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState } from 'react';
import { Search, Calendar, XCircle, CheckCircle } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import './style.css';

const mockLogs = [
  { id: 1, time: '2025-01-26 10:30:00', admin: 'admin', method: '账号密码', status: 'success', ip: '192.168.1.100', device: 'Chrome / Windows' },
  { id: 2, time: '2025-01-26 09:15:00', admin: 'operator1', method: '账号密码', status: 'success', ip: '192.168.1.101', device: 'Chrome / MacOS' },
  { id: 3, time: '2025-01-26 08:30:00', admin: 'service1', method: '账号密码', status: 'failed', ip: '192.168.1.102', device: 'Firefox / Windows' },
  { id: 4, time: '2025-01-25 18:00:00', admin: 'admin', method: '账号密码', status: 'success', ip: '192.168.1.100', device: 'Chrome / Windows' },
  { id: 5, time: '2025-01-25 15:30:00', admin: 'operator2', method: '账号密码', status: 'success', ip: '192.168.1.103', device: 'Safari / MacOS' },
];

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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">登录日志</h2>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Search size={18} className="text-gray-400" />
                <input type="text" placeholder="搜索管理员" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>全部状态</option>
                <option>成功</option>
                <option>失败</option>
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
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">登录方式</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">IP地址</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">设备信息</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-500">{log.time}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">@{log.admin}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{log.method}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        log.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {log.status === 'success' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {log.status === 'success' ? '成功' : '失败'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 font-mono">{log.ip}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{log.device}</td>
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
