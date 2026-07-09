/**
 * @name 评论管理
 *
 * @description
 * SuperIM 评论管理页面。
 *
 * @usage
 * 访问路径: /admin/feed/comments
 *
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState } from 'react';
import { MessageCircle, Eye, Trash2, CheckCircle, Globe, Clock } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import './style.css';

const mockComments = [
  { id: 1, username: 'john_doe', content: '说得好！', postId: 101, status: 'normal', time: '2025-01-26 10:30' },
  { id: 2, username: 'mary_smith', content: '我也觉得', postId: 102, status: 'pending', time: '2025-01-26 09:15' },
  { id: 3, username: 'alex_wang', content: '感谢分享', postId: 103, status: 'normal', time: '2025-01-25 18:20' },
  { id: 4, username: 'spam_user', content: '垃圾广告', postId: 104, status: 'deleted', time: '2025-01-25 15:30' },
];

const stats = [
  { title: '今日评论', value: 456, icon: MessageCircle, color: 'blue' },
  { title: '待审核', value: 8, icon: Clock, color: 'yellow' },
  { title: '总评论', value: 45678, icon: Globe, color: 'green' },
];

export default function Component() {
  const [comments, setComments] = useState(mockComments);

  const handleDelete = (id: number) => {
    if (confirm('确定要删除该评论吗？')) {
      setComments(comments.map(c => c.id === id ? { ...c, status: 'deleted' } : c));
    }
  };

  const handleApprove = (id: number) => {
    setComments(comments.map(c => c.id === id ? { ...c, status: 'normal' } : c));
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">评论管理</h2>

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
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">评论内容</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">所属动态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">发布时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {comments.map(comment => (
                  <tr key={comment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-900">@{comment.username}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate">{comment.content}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">动态 #{comment.postId}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        comment.status === 'normal' ? 'bg-green-100 text-green-700' :
                        comment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {comment.status === 'normal' ? '正常' : comment.status === 'pending' ? '审核中' : '已删除'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">{comment.time}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Eye size={16} /></button>
                        {comment.status === 'pending' && (
                          <button onClick={() => handleApprove(comment.id)} className="p-2 text-green-600 hover:bg-green-50 rounded"><CheckCircle size={16} /></button>
                        )}
                        {comment.status !== 'deleted' && (
                          <button onClick={() => handleDelete(comment.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
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
