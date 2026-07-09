/**
 * @name AdminSidebar
 * @description 后台管理统一侧边栏组件
 */

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Monitor,
  Users,
  MessageCircle,
  Globe,
  Phone,
  Settings,
  Shield,
  FileText,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    key: 'dashboard',
    icon: <LayoutDashboard size={18} />,
    label: '数据概览',
    path: '/admin/dashboard',
  },
  {
    key: 'bigscreen',
    icon: <Monitor size={18} />,
    label: '数据大屏',
    path: '/admin/bigscreen',
  },
  {
    key: 'users',
    icon: <Users size={18} />,
    label: '用户管理',
    children: [
      { key: 'user-list', icon: <Users size={16} />, label: '用户列表', path: '/admin/users' },
      { key: 'online-users', icon: <Users size={16} />, label: '在线用户', path: '/admin/online-users' },
      { key: 'bans', icon: <Users size={16} />, label: '封禁管理', path: '/admin/bans' },
    ],
  },
  {
    key: 'messages',
    icon: <MessageCircle size={18} />,
    label: '消息管理',
    children: [
      { key: 'conversations', icon: <MessageCircle size={16} />, label: '会话列表', path: '/admin/conversations' },
      { key: 'message-reports', icon: <MessageCircle size={16} />, label: '举报消息', path: '/admin/message-reports' },
      { key: 'sensitive-words', icon: <MessageCircle size={16} />, label: '敏感词库', path: '/admin/sensitive-words' },
    ],
  },
  {
    key: 'feed',
    icon: <Globe size={18} />,
    label: '动态管理',
    children: [
      { key: 'feed-list', icon: <Globe size={16} />, label: '动态列表', path: '/admin/feed' },
      { key: 'comments', icon: <Globe size={16} />, label: '评论管理', path: '/admin/comments' },
      { key: 'feed-reports', icon: <Globe size={16} />, label: '动态举报', path: '/admin/feed-reports' },
    ],
  },
  {
    key: 'calls',
    icon: <Phone size={18} />,
    label: '通话记录',
    path: '/admin/calls',
  },
  {
    key: 'settings',
    icon: <Settings size={18} />,
    label: '系统设置',
    children: [
      { key: 'general-settings', icon: <Settings size={16} />, label: '基础配置', path: '/admin/settings' },
      { key: 'versions', icon: <Settings size={16} />, label: '版本管理', path: '/admin/versions' },
    ],
  },
  {
    key: 'permissions',
    icon: <Shield size={18} />,
    label: '权限管理',
    children: [
      { key: 'admins', icon: <Shield size={16} />, label: '管理员列表', path: '/admin/admins' },
      { key: 'roles', icon: <Shield size={16} />, label: '角色管理', path: '/admin/roles' },
    ],
  },
  {
    key: 'logs',
    icon: <FileText size={18} />,
    label: '日志管理',
    children: [
      { key: 'operation-logs', icon: <FileText size={16} />, label: '操作日志', path: '/admin/operation-logs' },
      { key: 'login-logs', icon: <FileText size={16} />, label: '登录日志', path: '/admin/login-logs' },
      { key: 'system-logs', icon: <FileText size={16} />, label: '系统日志', path: '/admin/system-logs' },
    ],
  },
];

export default function AdminSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  // 根据当前路径计算展开的菜单
  const getExpandedKeys = () => {
    const expanded: string[] = [];
    menuItems.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(child => child.path === currentPath);
        if (hasActiveChild) {
          expanded.push(item.key);
        }
      }
    });
    return expanded;
  };

  const [expandedKeys, setExpandedKeys] = React.useState<string[]>(getExpandedKeys);

  // 当路径变化时更新展开的菜单
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExpandedKeys(prev => {
      const newExpanded = getExpandedKeys();
      // 合并已有的展开状态和新的展开状态
      return Array.from(new Set([...prev, ...newExpanded]));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath]);

  const toggleExpand = (key: string) => {
    setExpandedKeys(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const isActive = (item: MenuItem) => {
    if (item.path) {
      return currentPath === item.path;
    }
    // 检查是否有子项匹配当前路径
    if (item.children) {
      return item.children.some(child => child.path === currentPath);
    }
    return false;
  };

  const isSubActive = (child: MenuItem) => {
    return currentPath === child.path;
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] flex flex-col">
      <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
        {menuItems.map(item => (
          <div key={item.key}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleExpand(item.key)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors ${
                    isActive(item)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {expandedKeys.includes(item.key) ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
                {expandedKeys.includes(item.key) && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map(child => (
                      <NavLink
                        key={child.key}
                        to={child.path || '#'}
                        className={({ isActive: navIsActive }) =>
                          `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                            navIsActive || isSubActive(child)
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`
                        }
                      >
                        {child.icon}
                        <span>{child.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <NavLink
                to={item.path || '#'}
                className={({ isActive: navIsActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                    navIsActive || isActive(item)
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
