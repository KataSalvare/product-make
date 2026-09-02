/**
 * @name 系统日志
 *
 * @description
 * SuperIM 系统日志页面。
 *
 * @usage
 * 访问路径: /admin/logs/system
 *
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState } from 'react';
import { Trash2, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import './style.css';

const mockLogs = [
  { id: 1, time: '2025-01-26 10:30:00', level: 'ERROR', module: 'Auth', content: '用户登录失败次数过多，账号已锁定' },
  { id: 2, time: '2025-01-26 10:25:00', level: 'WARN', module: 'Database', content: '数据库连接池使用率超过80%' },
  { id: 3, time: '2025-01-26 10:20:00', level: 'INFO', module: 'System', content: '系统启动完成' },
  { id: 4, time: '2025-01-26 10:15:00', level: 'INFO', module: 'Cache', content: '缓存清理完成' },
  { id: 5, time: '2025-01-26 10:10:00', level: 'WARN', module: 'API', content: '接口响应时间超过阈值' },
];

const levelIcons: Record<string, React.ReactNode> = {
  'ERROR': <AlertCircle size={14} />,
  'WARN': <AlertTriangle size={14} />,
  'INFO': <Info size={14} />,
};

const levelColors: Record<string, string> = {
  'ERROR': 'bg-red-100 text-red-700',
  'WARN': 'bg-yellow-100 text-yellow-700',
  'INFO': 'bg-blue-100 text-blue-700',
};

export default function Component() {
  const [logs, setLogs] = useState(mockLogs);
  const [filter, setFilter] = useState('all');

  const filteredLogs = filter === 'all' ? logs : logs.filter(log => log.level === filter);

  const handleClear = () => {
    if (confirm('确定要清空所有日志吗？')) {
      setLogs([]);
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">系统日志</h2>
            <button onClick={handleClear} className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50">
              <Trash2 size={18} />
              清空日志
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex gap-2">
              {['all', 'ERROR', 'WARN', 'INFO'].map((level) => (
                <button
                  key={level}
                  onClick={() => setFilter(level)}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    filter === level ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {level === 'all' ? '全部' : level}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">级别</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">模块</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">内容</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-500 font-mono">{log.time}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${levelColors[log.level]}`}>
                        {levelIcons[log.level]}
                        {log.level}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{log.module}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{log.content}</td>
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
