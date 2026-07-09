/**
 * @name 会话消息详情
 *
 * @description
 * SuperIM 会话消息详情页面，展示单个会话的完整消息记录。
 *
 * @usage
 * 访问路径: /admin/messages/conversations/:id
 *
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState } from 'react';
import { ArrowLeft, Users, MessageSquare, Clock, Search, Download, Image, FileText, Mic } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import './style.css';

// 消息类型
interface Message {
  id: number;
  sender: string;
  senderAvatar?: string;
  type: 'text' | 'image' | 'file' | 'voice';
  content: string;
  time: string;
  isSelf: boolean;
}

// Mock 消息数据
const mockMessages: Message[] = [
  { id: 1, sender: 'john_doe', type: 'text', content: '你好，最近怎么样？', time: '2025-01-26 10:00:00', isSelf: false },
  { id: 2, sender: 'mary_smith', type: 'text', content: '挺好的，你呢？', time: '2025-01-26 10:01:30', isSelf: false },
  { id: 3, sender: 'john_doe', type: 'text', content: '我也不错，周末有空一起喝咖啡吗？', time: '2025-01-26 10:02:15', isSelf: false },
  { id: 4, sender: 'mary_smith', type: 'image', content: '图片消息', time: '2025-01-26 10:03:00', isSelf: false },
  { id: 5, sender: 'john_doe', type: 'text', content: '这是哪里？看起来很不错', time: '2025-01-26 10:04:20', isSelf: false },
  { id: 6, sender: 'mary_smith', type: 'text', content: '公司附近新开的一家咖啡馆，环境特别好', time: '2025-01-26 10:05:10', isSelf: false },
  { id: 7, sender: 'john_doe', type: 'voice', content: '语音消息 (15秒)', time: '2025-01-26 10:06:00', isSelf: false },
  { id: 8, sender: 'mary_smith', type: 'text', content: '好的，明天下午3点可以吗？', time: '2025-01-26 10:07:30', isSelf: false },
  { id: 9, sender: 'john_doe', type: 'text', content: '没问题，明天见！', time: '2025-01-26 10:08:00', isSelf: false },
  { id: 10, sender: 'mary_smith', type: 'file', content: '会议安排.pdf', time: '2025-01-26 10:30:00', isSelf: false },
];

// 会话信息
const mockConversationInfo = {
  id: 1,
  type: 'single',
  users: [
    { id: 10001, username: 'john_doe', nickname: 'John Doe', phone: '+23480****1234' },
    { id: 10002, username: 'mary_smith', nickname: 'Mary Smith', phone: '+23480****5678' },
  ],
  messageCount: 234,
  createdAt: '2025-01-20 14:30:00',
  lastMessageAt: '2025-01-26 10:30:00',
};

// 消息类型图标
const MessageTypeIcon: React.FC<{ type: string }> = ({ type }) => {
  const icons: Record<string, React.ReactNode> = {
    text: <MessageSquare size={14} />,
    image: <Image size={14} />,
    file: <FileText size={14} />,
    voice: <Mic size={14} />,
  };
  return <span className="text-gray-400">{icons[type] || <MessageSquare size={14} />}</span>;
};

// 消息类型标签
const MessageTypeBadge: React.FC<{ type: string }> = ({ type }) => {
  const labels: Record<string, { label: string; className: string }> = {
    text: { label: '文本', className: 'bg-blue-100 text-blue-700' },
    image: { label: '图片', className: 'bg-green-100 text-green-700' },
    file: { label: '文件', className: 'bg-purple-100 text-purple-700' },
    voice: { label: '语音', className: 'bg-orange-100 text-orange-700' },
  };
  const config = labels[type] || labels.text;
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};

export default function Component() {
  const [messages] = useState<Message[]>(mockMessages);
  const [conversationInfo] = useState(mockConversationInfo);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // 筛选消息
  const filteredMessages = messages.filter(msg => {
    const matchSearch = !searchQuery || msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.sender.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = typeFilter === 'all' || msg.type === typeFilter;
    return matchSearch && matchType;
  });

  // 获取URL参数中的会话ID
  const urlParams = new URLSearchParams(window.location.search);
  const conversationId = urlParams.get('id') || conversationInfo.id;

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
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
          {/* 返回按钮和标题 */}
          <div className="flex items-center gap-4 mb-6">
            <a
              href="/prototypes/superim-admin-conversations"
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={18} />
              <span>返回会话列表</span>
            </a>
            <h2 className="text-2xl font-bold text-gray-900">会话详情 #{conversationId}</h2>
          </div>

          {/* 会话信息卡片 */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users size={28} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {conversationInfo.type === 'single' ? '单聊会话' : '群聊会话'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    创建于 {conversationInfo.createdAt}
                  </p>
                </div>
              </div>
              <div className="flex gap-6 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{conversationInfo.messageCount}</p>
                  <p className="text-sm text-gray-500">消息总数</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{conversationInfo.users.length}</p>
                  <p className="text-sm text-gray-500">参与人数</p>
                </div>
              </div>
            </div>

            {/* 参与用户 */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">参与用户</h4>
              <div className="flex flex-wrap gap-3">
                {conversationInfo.users.map(user => (
                  <a
                    key={user.id}
                    href={`/prototypes/superim-admin-user-detail?id=${user.id}`}
                    className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-700">
                        {user.nickname.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.nickname}</p>
                      <p className="text-xs text-gray-500">@{user.username}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* 消息记录 */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">消息记录</h3>
              <div className="flex items-center gap-3">
                {/* 搜索 */}
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索消息内容或发送者..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-64"
                  />
                </div>
                {/* 类型筛选 */}
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="all">全部类型</option>
                  <option value="text">文本</option>
                  <option value="image">图片</option>
                  <option value="file">文件</option>
                  <option value="voice">语音</option>
                </select>
                {/* 导出 */}
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Download size={16} />
                  <span className="text-sm">导出记录</span>
                </button>
              </div>
            </div>

            {/* 消息列表 */}
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {filteredMessages.map((msg) => (
                <div key={msg.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* 头像 */}
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-blue-700">
                        {msg.sender.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {/* 内容 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">@{msg.sender}</span>
                        <MessageTypeBadge type={msg.type} />
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={12} />
                          {msg.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageTypeIcon type={msg.type} />
                        <p className="text-sm text-gray-700 break-all">
                          {msg.type === 'image' && (
                            <span className="text-blue-600 hover:underline cursor-pointer">[图片]</span>
                          )}
                          {msg.type === 'file' && (
                            <span className="text-blue-600 hover:underline cursor-pointer">📎 {msg.content}</span>
                          )}
                          {msg.type === 'voice' && (
                            <span className="text-blue-600 hover:underline cursor-pointer">▶️ {msg.content}</span>
                          )}
                          {msg.type === 'text' && msg.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredMessages.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>没有找到匹配的消息</p>
                </div>
              )}
            </div>

            {/* 分页 */}
            <div className="px-4 py-4 border-t border-gray-200 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                共 {filteredMessages.length} 条消息
              </span>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                  上一页
                </button>
                <span className="text-sm text-gray-700">1 / 1</span>
                <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                  下一页
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
