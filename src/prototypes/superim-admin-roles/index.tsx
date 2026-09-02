/**
 * @name 角色管理
 *
 * @description
 * SuperIM 角色管理页面。
 *
 * @usage
 * 访问路径: /admin/roles
 *
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import './style.css';

const mockRoles = [
  { id: 1, name: '超级管理员', description: '拥有所有权限', adminCount: 1 },
  { id: 2, name: '运营专员', description: '负责用户和内容管理', adminCount: 2 },
  { id: 3, name: '客服专员', description: '处理用户反馈和举报', adminCount: 1 },
];

const permissions = [
  { id: 'dashboard', name: '数据概览', children: [] },
  { id: 'users', name: '用户管理', children: ['查看用户', '编辑用户', '封禁用户'] },
  { id: 'messages', name: '消息管理', children: ['查看消息', '删除消息'] },
  { id: 'feed', name: '动态管理', children: ['查看动态', '审核动态', '删除动态'] },
  { id: 'notifications', name: '通知管理', children: ['发送通知', '管理模板'] },
  { id: 'settings', name: '系统设置', children: ['基础配置', '版本管理'] },
  { id: 'admins', name: '权限管理', children: ['管理管理员', '管理角色'] },
];

export default function Component() {
  const [roles, setRoles] = useState(mockRoles);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    if (confirm('确定要删除该角色吗？')) {
      setRoles(roles.filter(r => r.id !== id));
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
            <h2 className="text-2xl font-bold text-gray-900">角色管理</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800">
              <Plus size={18} />
              新建角色
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Roles List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">角色名称</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">描述</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">管理员</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {roles.map(role => (
                    <tr 
                      key={role.id} 
                      className={`hover:bg-gray-50 cursor-pointer ${selectedRole === role.id ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedRole(role.id)}
                    >
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">{role.name}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{role.description}</td>
                      <td className="px-4 py-4 text-sm text-gray-500">{role.adminCount}人</td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                          {role.id !== 1 && (
                            <button onClick={() => handleDelete(role.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Permissions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">权限配置</h3>
              <div className="space-y-4">
                {permissions.map(perm => (
                  <div key={perm.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <label className="flex items-center gap-2 mb-2">
                      <input type="checkbox" className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-gray-900">{perm.name}</span>
                    </label>
                    {perm.children.length > 0 && (
                      <div className="ml-6 space-y-2">
                        {perm.children.map(child => (
                          <label key={child} className="flex items-center gap-2">
                            <input type="checkbox" className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-600">{child}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button className="mt-6 w-full py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800">
                保存权限
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
