/**
 * @name 会话列表
 *
 * @description
 * SuperIM 会话列表管理页面。
 *
 * @usage
 * 访问路径: /admin/messages/conversations
 *
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState } from 'react';
import { MessageCircle, Eye, Users, MessageSquare } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import './style.css';

const mockConversations = [
  { id: 1, users: ['john_doe', 'mary_smith'], messageCount: 234, lastMessage: '好的，明天见！', time: '2025-01-26 10:30' },
  { id: 2, users: ['alex_wang', 'lisa_chen', 'tom_brown'], messageCount: 567, lastMessage: '大家晚上好', time: '2025-01-26 09:15' },
  { id: 3, users: ['sarah_jones', 'mike_davis'], messageCount: 89, lastMessage: '谢谢！', time: '2025-01-25 18:20' },
];

const stats = [
  { title: '今日会话', value: 1234, icon: MessageCircle, color: 'blue' },
  { title: '活跃会话', value: 567, icon: MessageSquare, color: 'green' },
  { title: '总会话', value: 45678, icon: Users, color: 'purple' },
];

export default function Component() {
  const [conversations] = useState(mockConversations);

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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">会话列表</h2>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
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
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">会话ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">参与用户</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">消息数</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">最后消息</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">最后时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {conversations.map(conv => (
                  <tr key={conv.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-500">#{conv.id}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      <div className="flex flex-wrap gap-1">
                        {conv.users.map((user, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-xs">@{user}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{conv.messageCount}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate">{conv.lastMessage}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{conv.time}</td>
                    <td className="px-4 py-4">
                      <a
                        href={`/prototypes/superim-admin-conversation-detail?id=${conv.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded inline-flex"
                        title="查看详情"
                      >
                        <Eye size={16} />
                      </a>
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
