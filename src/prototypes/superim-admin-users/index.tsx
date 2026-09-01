/**
 * @name 用户列表
 *
 * @description
 * SuperIM 后台管理系统用户列表页面，展示平台所有注册用户。
 * 支持搜索、筛选、分页、批量操作等功能。
 *
 * @usage
 * 访问路径: /admin/users
 * 可查看用户详情、封禁/解封用户
 *
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState } from 'react';
import {
  Search, Download, Eye, Ban, Trash2,
  ChevronLeft, ChevronRight,
  Check, AlertCircle
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';
import './style.css';

// Mock 用户数据
const mockUsers = [
  {
    id: 10001,
    username: 'john_doe',
    nickname: 'John Doe',
    avatar: null,
    phone: '+23480****1234',
    email: 'john@example.com',
    loginMethods: ['phone', 'google'],
    status: 'normal',
    registerTime: '2025-01-20 14:30:25',
    lastLoginTime: '2025-01-26 09:15:30',
    friendCount: 128,
    messageCount: 5234,
    postCount: 45,
    banReason: '',
    banEndTime: ''
  },
  {
    id: 10002,
    username: 'mary_smith',
    nickname: 'Mary Smith',
    avatar: null,
    phone: '+23480****5678',
    email: 'mary@example.com',
    loginMethods: ['phone', 'facebook'],
    status: 'banned',
    banReason: '发布违规内容',
    banEndTime: '2025-02-26 00:00:00',
    registerTime: '2025-01-18 10:20:15',
    lastLoginTime: '2025-01-25 16:45:20',
    friendCount: 56,
    messageCount: 1234,
    postCount: 12
  },
  {
    id: 10003,
    username: 'alex_wang',
    nickname: 'Alex Wang',
    avatar: null,
    phone: '+23480****9012',
    email: 'alex@example.com',
    loginMethods: ['phone', 'google', 'apple'],
    status: 'normal',
    registerTime: '2025-01-15 08:45:30',
    lastLoginTime: '2025-01-26 11:20:45',
    friendCount: 234,
    messageCount: 8921,
    postCount: 78,
    banReason: '',
    banEndTime: ''
  },
  {
    id: 10004,
    username: 'lisa_chen',
    nickname: 'Lisa Chen',
    avatar: null,
    phone: '+23480****3456',
    email: 'lisa@example.com',
    loginMethods: ['phone'],
    status: 'inactive',
    registerTime: '2025-01-10 16:30:00',
    lastLoginTime: '2025-01-12 09:00:00',
    friendCount: 12,
    messageCount: 156,
    postCount: 3,
    banReason: '',
    banEndTime: ''
  },
  {
    id: 10005,
    username: 'tom_brown',
    nickname: 'Tom Brown',
    avatar: null,
    phone: '+23480****7890',
    email: 'tom@example.com',
    loginMethods: ['phone', 'facebook'],
    status: 'normal',
    registerTime: '2025-01-22 20:15:45',
    lastLoginTime: '2025-01-26 08:30:15',
    friendCount: 89,
    messageCount: 3456,
    postCount: 23,
    banReason: '',
    banEndTime: ''
  },
  {
    id: 10006,
    username: 'sarah_jones',
    nickname: 'Sarah Jones',
    avatar: null,
    phone: '+23480****2468',
    email: 'sarah@example.com',
    loginMethods: ['phone', 'apple'],
    status: 'normal',
    registerTime: '2025-01-19 12:00:00',
    lastLoginTime: '2025-01-26 10:45:30',
    friendCount: 167,
    messageCount: 6789,
    postCount: 56,
    banReason: '',
    banEndTime: ''
  },
  {
    id: 10007,
    username: 'mike_davis',
    nickname: 'Mike Davis',
    avatar: null,
    phone: '+23480****1357',
    email: 'mike@example.com',
    loginMethods: ['phone', 'google', 'facebook'],
    status: 'banned',
    banReason: '骚扰其他用户',
    banEndTime: '2025-03-01 00:00:00',
    registerTime: '2025-01-05 09:30:20',
    lastLoginTime: '2025-01-20 14:20:00',
    friendCount: 34,
    messageCount: 890,
    postCount: 8
  },
  {
    id: 10008,
    username: 'emma_wilson',
    nickname: 'Emma Wilson',
    avatar: null,
    phone: '+23480****9753',
    email: 'emma@example.com',
    loginMethods: ['phone'],
    status: 'normal',
    registerTime: '2025-01-23 15:45:10',
    lastLoginTime: '2025-01-26 07:15:20',
    friendCount: 45,
    messageCount: 2123,
    postCount: 15,
    banReason: '',
    banEndTime: ''
  },
  {
    id: 10009,
    username: 'david_lee',
    nickname: 'David Lee',
    avatar: null,
    phone: '+23480****8642',
    email: 'david@example.com',
    loginMethods: ['phone', 'google'],
    status: 'normal',
    registerTime: '2025-01-17 11:20:30',
    lastLoginTime: '2025-01-25 22:10:45',
    friendCount: 198,
    messageCount: 7654,
    postCount: 67,
    banReason: '',
    banEndTime: ''
  },
  {
    id: 10010,
    username: 'amy_taylor',
    nickname: 'Amy Taylor',
    avatar: null,
    phone: '+23480****3579',
    email: 'amy@example.com',
    loginMethods: ['phone', 'facebook'],
    status: 'inactive',
    registerTime: '2025-01-08 18:00:00',
    lastLoginTime: '2025-01-09 10:30:00',
    friendCount: 5,
    messageCount: 45,
    postCount: 1,
    banReason: '',
    banEndTime: ''
  }
];

// 登录方式图标组件
const LoginMethodsBadge: React.FC<{ methods: string[] }> = ({ methods }) => {
  const methodIcons: Record<string, { icon: string; color: string; label: string }> = {
    phone: { icon: '📱', color: 'bg-blue-100 text-blue-700', label: '手机' },
    google: { icon: 'G', color: 'bg-red-100 text-red-700', label: 'Google' },
    facebook: { icon: 'f', color: 'bg-blue-600 text-white', label: 'Facebook' },
    apple: { icon: '🍎', color: 'bg-gray-800 text-white', label: 'Apple' },
  };

  return (
    <div className="flex items-center gap-1">
      {methods.map((method) => {
        const config = methodIcons[method];
        if (!config) return null;
        return (
          <span
            key={method}
            className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-medium ${config.color}`}
            title={config.label}
          >
            {config.icon}
          </span>
        );
      })}
    </div>
  );
};

// 状态标签组件
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    normal: { label: '正常', className: 'bg-green-100 text-green-700' },
    banned: { label: '封禁', className: 'bg-red-100 text-red-700' },
    inactive: { label: '未激活', className: 'bg-gray-100 text-gray-600' }
  };
  const config = statusMap[status] || statusMap.normal;
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};



export default function Component() {
  const [users, setUsers] = useState(mockUsers);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banUserId, setBanUserId] = useState<number | null>(null);

  // 筛选用户
  const filteredUsers = users.filter(user => {
    const matchSearch = !searchQuery ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    const matchStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // 分页
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // 全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(paginatedUsers.map(u => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  // 单选
  const handleSelectUser = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  // 封禁用户
  const handleBanUser = (userId: number) => {
    setBanUserId(userId);
    setShowBanModal(true);
  };

  // 确认封禁
  const confirmBan = () => {
    if (banUserId) {
      setUsers(users.map(u => u.id === banUserId ? { ...u, status: 'banned', banReason: '违规操作' } : u));
      setShowBanModal(false);
      setBanUserId(null);
    }
  };

  // 解封用户
  const handleUnbanUser = (userId: number) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: 'normal', banReason: '', banEndTime: '' } : u));
  };

  // 删除用户
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const handleDeleteUser = (userId: number) => {
    setDeleteUserId(userId);
    setDeleteConfirmText('');
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteUserId && deleteConfirmText === 'DELETE') {
      setUsers(users.filter(u => u.id !== deleteUserId));
      setShowDeleteModal(false);
      setDeleteUserId(null);
      setDeleteConfirmText('');
    }
  };

  return (
    <div className="h-full bg-gray-50">
      <AdminHeader />

      <div className="flex">
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">用户列表</h2>
              <p className="text-gray-500 mt-1">共 {filteredUsers.length} 位用户</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800">
              <Download size={18} />
              导出CSV
            </button>
          </div>

          {/* Search & Filter */}
          <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索用户名、昵称、手机号..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              >
                <option value="all">全部状态</option>
                <option value="normal">正常</option>
                <option value="banned">封禁</option>
                <option value="inactive">未激活</option>
              </select>
              <button
                onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                重置
              </button>
            </div>
          </div>

          {/* Batch Actions */}
          {selectedUsers.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between">
              <span className="text-blue-900 font-medium">已选择 {selectedUsers.length} 位用户</span>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
                  批量封禁
                </button>
                <button className="px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
                  批量解封
                </button>
              </div>
            </div>
          )}

          {/* User Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 w-12">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">头像</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">用户名</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">昵称</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">手机号</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">邮箱</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">登录方式</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">注册时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-700">
                          {user.nickname?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">{user.username}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{user.nickname}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{user.phone}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{user.email}</td>
                    <td className="px-4 py-4">
                      <LoginMethodsBadge methods={user.loginMethods || []} />
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">{user.registerTime}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <a
                          href={`/prototypes/superim-admin-user-detail?id=${user.id}`}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded inline-flex"
                          title="查看详情"
                        >
                          <Eye size={16} />
                        </a>
                        {user.status !== 'banned' ? (
                          <button
                            onClick={() => handleBanUser(user.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            title="封禁"
                          >
                            <Ban size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnbanUser(user.id)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                            title="解封"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                          title="删除"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-4 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">每页显示</span>
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-500">条，共 {filteredUsers.length} 条</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm text-gray-700">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Ban Modal */}
      {showBanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowBanModal(false)} />
          <div className="relative bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">封禁用户</h3>
            <p className="text-gray-600 mb-4">确定要封禁该用户吗？封禁后用户将无法登录和使用系统。</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">封禁原因</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>发布违规内容</option>
                <option>骚扰其他用户</option>
                <option>垃圾广告</option>
                <option>其他原因</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowBanModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                取消
              </button>
              <button
                onClick={confirmBan}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                确认封禁
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle size={20} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">危险操作确认</h3>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 text-sm font-medium mb-2">⚠️ 您正在执行不可逆的删除操作</p>
              <p className="text-red-600 text-sm">删除后，该用户的所有数据（包括聊天记录、好友关系、动态等）将被永久清除，无法恢复。</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                请输入 <span className="font-bold text-red-600">DELETE</span> 以确认删除
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="请输入 DELETE"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                取消
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteConfirmText !== 'DELETE'}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
