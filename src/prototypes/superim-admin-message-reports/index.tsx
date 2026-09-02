/**
 * @name 举报消息
 *
 * @description
 * SuperIM 举报消息管理页面。
 *
 * @usage
 * 访问路径: /admin/messages/reports
 *
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle, Eye, Clock } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import './style.css';

const mockReports = [
  { id: 1, reporter: 'john_doe', reported: 'spam_user', type: '垃圾广告', content: '快来买便宜商品！', time: '2025-01-26 10:30', status: 'pending' },
  { id: 2, reporter: 'mary_smith', reported: 'abuser_1', type: '色情暴力', content: '不当内容', time: '2025-01-26 09:15', status: 'pending' },
  { id: 3, reporter: 'alex_wang', reported: 'harasser_1', type: '骚扰', content: '恶意评论', time: '2025-01-25 18:20', status: 'resolved' },
];

const stats = [
  { title: '待处理', value: 8, icon: Clock, color: 'yellow' },
  { title: '已处理', value: 123, icon: CheckCircle, color: 'green' },
  { title: '今日举报', value: 3, icon: AlertCircle, color: 'red' },
];

export default function Component() {
  const [reports, setReports] = useState(mockReports);

  const handleResolve = (id: number, action: 'resolve' | 'reject') => {
    setReports(reports.map(r => r.id === id ? { ...r, status: action === 'resolve' ? 'resolved' : 'rejected' } : r));
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">举报消息</h2>

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
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">举报人</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">被举报人</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">举报类型</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">消息内容</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">举报时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reports.map(report => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-900">@{report.reporter}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">@{report.reported}</td>
                    <td className="px-4 py-4"><span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">{report.type}</span></td>
                    <td className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate">{report.content}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{report.time}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        report.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        report.status === 'resolved' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {report.status === 'pending' ? '待处理' : report.status === 'resolved' ? '已通过' : '已驳回'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Eye size={16} /></button>
                        {report.status === 'pending' && (
                          <>
                            <button onClick={() => handleResolve(report.id, 'resolve')} className="p-2 text-green-600 hover:bg-green-50 rounded"><CheckCircle size={16} /></button>
                            <button onClick={() => handleResolve(report.id, 'reject')} className="p-2 text-red-600 hover:bg-red-50 rounded"><XCircle size={16} /></button>
                          </>
                        )}
                      </div>
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
