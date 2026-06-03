/**
 * @name AdminSidebar
 * @description 后台管理统一侧边栏组件
 */

import React from 'react';
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
    path: '/prototypes/demo-admin-dashboard',
  },
  {
    key: 'bigscreen',
    icon: <Monitor size={18} />,
    label: '数据大屏',
    path: '/prototypes/demo-admin-bigscreen',
  },
  {
    key: 'users',
    icon: <Users size={18} />,
    label: '用户管理',
    children: [
      { key: 'user-list', icon: <Users size={16} />, label: '用户列表', path: '/prototypes/demo-admin-users' },
      { key: 'online-users', icon: <Users size={16} />, label: '在线用户', path: '/prototypes/demo-admin-online-users' },
      { key: 'bans', icon: <Users size={16} />, label: '封禁管理', path: '/prototypes/demo-admin-bans' },
    ],
  },
  {
    key: 'messages',
    icon: <MessageCircle size={18} />,
    label: '消息管理',
    children: [
      { key: 'conversations', icon: <MessageCircle size={16} />, label: '会话列表', path: '/prototypes/demo-admin-conversations' },
      { key: 'message-reports', icon: <MessageCircle size={16} />, label: '举报消息', path: '/prototypes/demo-admin-message-reports' },
      { key: 'sensitive-words', icon: <MessageCircle size={16} />, label: '敏感词库', path: '/prototypes/demo-admin-sensitive-words' },
    ],
  },
  {
    key: 'feed',
    icon: <Globe size={18} />,
    label: '动态管理',
    children: [
      { key: 'feed-list', icon: <Globe size={16} />, label: '动态列表', path: '/prototypes/demo-admin-feed' },
      { key: 'comments', icon: <Globe size={16} />, label: '评论管理', path: '/prototypes/demo-admin-comments' },
      { key: 'feed-reports', icon: <Globe size={16} />, label: '动态举报', path: '/prototypes/demo-admin-feed-reports' },
    ],
  },
  {
    key: 'calls',
    icon: <Phone size={18} />,
    label: '通话记录',
    path: '/prototypes/demo-admin-calls',
  },
  {
    key: 'settings',
    icon: <Settings size={18} />,
    label: '系统设置',
    children: [
      { key: 'general-settings', icon: <Settings size={16} />, label: '基础配置', path: '/prototypes/demo-admin-settings' },
      { key: 'versions', icon: <Settings size={16} />, label: '版本管理', path: '/prototypes/demo-admin-versions' },
    ],
  },
  {
    key: 'permissions',
    icon: <Shield size={18} />,
    label: '权限管理',
    children: [
      { key: 'admins', icon: <Shield size={16} />, label: '管理员列表', path: '/prototypes/demo-admin-admins' },
      { key: 'roles', icon: <Shield size={16} />, label: '角色管理', path: '/prototypes/demo-admin-roles' },
    ],
  },
  {
    key: 'logs',
    icon: <FileText size={18} />,
    label: '日志管理',
    children: [
      { key: 'operation-logs', icon: <FileText size={16} />, label: '操作日志', path: '/prototypes/demo-admin-operation-logs' },
      { key: 'login-logs', icon: <FileText size={16} />, label: '登录日志', path: '/prototypes/demo-admin-login-logs' },
      { key: 'system-logs', icon: <FileText size={16} />, label: '系统日志', path: '/prototypes/demo-admin-system-logs' },
    ],
  },
];

interface AdminSidebarProps {
  activeKey?: string;
  activeSubKey?: string;
}

export default function AdminSidebar({ activeKey, activeSubKey }: AdminSidebarProps) {
  const [expandedKeys, setExpandedKeys] = React.useState<string[]>(() => {
    // 默认展开当前激活的菜单
    if (activeKey) {
      return [activeKey];
    }
    return [];
  });

  const toggleExpand = (key: string) => {
    setExpandedKeys(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const isActive = (item: MenuItem) => {
    if (item.path) {
      return activeKey === item.key || activeSubKey === item.key;
    }
    return activeKey === item.key;
  };

  const isSubActive = (child: MenuItem) => {
    return activeSubKey === child.key;
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
                      <a
                        key={child.key}
                        href={child.path}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                          isSubActive(child)
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {child.icon}
                        <span>{child.label}</span>
                      </a>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <a
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                  isActive(item)
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </a>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
