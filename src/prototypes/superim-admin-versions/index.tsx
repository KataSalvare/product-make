/**
 * @name 版本管理
 *
 * @description
 * SuperIM 版本管理页面。
 *
 * @usage
 * 访问路径: /admin/settings/versions
 *
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState } from 'react';
import { Plus, Clock, CheckCircle, Edit2, Trash2 } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import './style.css';

const mockVersions = [
  { id: 1, version: '1.2.0', content: '- 新增视频通话功能\n- 优化消息发送速度\n- 修复已知问题', publishTime: '2025-01-26', status: 'published' },
  { id: 2, version: '1.1.0', content: '- 新增群聊功能\n- 支持发送图片和文件', publishTime: '2025-01-15', status: 'published' },
  { id: 3, version: '1.0.1', content: '- 修复登录问题\n- 优化UI界面', publishTime: '2025-01-10', status: 'published' },
  { id: 4, version: '1.3.0', content: '- 新增语音消息\n- 支持消息撤回', publishTime: '-', status: 'draft' },
];

export default function Component() {
  const [versions, setVersions] = useState(mockVersions);

  const handleDelete = (id: number) => {
    if (confirm('确定要删除该版本吗？')) {
      setVersions(versions.filter(v => v.id !== id));
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
            <h2 className="text-2xl font-bold text-gray-900">版本管理</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800">
              <Plus size={18} />
              发布新版本
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">版本号</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">更新内容</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">发布时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {versions.map(version => (
                  <tr key={version.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{version.version}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 whitespace-pre-line">{version.content}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{version.publishTime}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        version.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {version.status === 'published' ? <CheckCircle size={12} /> : <Clock size={12} />}
                        {version.status === 'published' ? '已发布' : '草稿'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(version.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
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
