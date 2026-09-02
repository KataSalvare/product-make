/**
 * @name 管理员列表
 *
 * @description
 * SuperIM 管理员列表页面。
 *
 * @usage
 * 访问路径: /admin/admins
 *
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState } from 'react';
import { Plus, Edit2, Key, Trash2, X } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import './style.css';

interface Admin {
  id: number;
  username: string;
  name: string;
  role: 'super' | 'operator' | 'service';
  status: 'active' | 'inactive';
  lastLogin: string;
}

const mockAdmins: Admin[] = [
  { id: 1, username: 'admin', name: '超级管理员', role: 'super', status: 'active', lastLogin: '2025-01-26 10:00' },
  { id: 2, username: 'operator1', name: '运营专员1', role: 'operator', status: 'active', lastLogin: '2025-01-26 09:30' },
  { id: 3, username: 'service1', name: '客服专员1', role: 'service', status: 'active', lastLogin: '2025-01-25 18:00' },
  { id: 4, username: 'operator2', name: '运营专员2', role: 'operator', status: 'inactive', lastLogin: '2025-01-20 15:00' },
];

const emptyAdmin = {
  username: '',
  name: '',
  role: 'operator' as const,
  password: '',
  confirmPassword: '',
};

export default function Component() {
  const [admins, setAdmins] = useState<Admin[]>(mockAdmins);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyAdmin);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleDelete = (id: number) => {
    if (confirm('确定要删除该管理员吗？')) {
      setAdmins(admins.filter(a => a.id !== id));
    }
  };

  const handleOpenModal = () => {
    setFormData(emptyAdmin);
    setErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData(emptyAdmin);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = '请输入用户名';
    } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
      newErrors.username = '用户名只能包含字母、数字和下划线，长度3-20位';
    } else if (admins.some(a => a.username === formData.username)) {
      newErrors.username = '该用户名已存在';
    }

    if (!formData.name.trim()) {
      newErrors.name = '请输入姓名';
    }

    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码长度至少6位';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const newAdmin: Admin = {
      id: Date.now(),
      username: formData.username,
      name: formData.name,
      role: formData.role,
      status: 'active',
      lastLogin: '-',
    };

    setAdmins([...admins, newAdmin]);
    handleCloseModal();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
            <h2 className="text-2xl font-bold text-gray-900">管理员列表</h2>
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
            >
              <Plus size={18} />
              添加管理员
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">管理员</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">角色</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">最后登录</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {admins.map(admin => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-700">{admin.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{admin.name}</p>
                          <p className="text-sm text-gray-500">@{admin.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        admin.role === 'super' ? 'bg-red-100 text-red-700' :
                        admin.role === 'operator' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {admin.role === 'super' ? '超级管理员' : admin.role === 'operator' ? '运营专员' : '客服专员'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        admin.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {admin.status === 'active' ? '正常' : '停用'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">{admin.lastLogin}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                        <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded"><Key size={16} /></button>
                        {admin.role !== 'super' && (
                          <button onClick={() => handleDelete(admin.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
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

      {/* 新增管理员弹窗 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={handleCloseModal} />
          <div className="relative bg-white rounded-xl w-full max-w-lg mx-4 shadow-xl">
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">添加管理员</h3>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* 表单内容 */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* 用户名 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  用户名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  placeholder="请输入用户名，3-20位字母数字下划线"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.username
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                />
                {errors.username && (
                  <p className="mt-1 text-xs text-red-500">{errors.username}</p>
                )}
              </div>

              {/* 姓名 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="请输入管理员姓名"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.name
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              {/* 角色 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  角色 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                >
                  <option value="operator">运营专员</option>
                  <option value="service">客服专员</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  运营专员：负责用户管理、内容审核等运营工作<br />
                  客服专员：负责处理用户反馈、投诉等客服工作
                </p>
              </div>

              {/* 密码 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  密码 <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="请输入密码，至少6位"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              {/* 确认密码 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  确认密码 <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="请再次输入密码"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.confirmPassword
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              {/* 按钮组 */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 text-white hover:bg-blue-800 rounded-lg transition-colors"
                >
                  创建管理员
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
