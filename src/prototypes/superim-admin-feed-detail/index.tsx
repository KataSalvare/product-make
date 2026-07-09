/**
 * @name 动态详情
 *
 * @description
 * SuperIM 动态详情页面，展示单条动态的详细信息和评论列表。
 *
 * @usage
 * 访问路径: /admin/feed/:id
 *
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState } from 'react';
import { ArrowLeft, Globe, Heart, MessageCircle, Share2, Clock, User, CheckCircle, Trash2 } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import './style.css';

// 评论数据
interface Comment {
  id: number;
  username: string;
  nickname: string;
  content: string;
  time: string;
  likes: number;
}

// Mock 动态数据
const mockPost = {
  id: 1,
  username: 'john_doe',
  nickname: 'John Doe',
  avatar: null,
  content: '今天天气真好！和朋友们一起去公园野餐，度过了愉快的一天。🌞🧺 #周末 #野餐 #美好生活',
  images: [
    'https://picsum.photos/400/300?random=1',
    'https://picsum.photos/400/300?random=2',
  ],
  status: 'normal',
  likes: 128,
  comments: 23,
  shares: 5,
  createdAt: '2025-01-26 10:30:00',
  location: 'Lagos, Nigeria',
};

// Mock 评论数据
const mockComments: Comment[] = [
  { id: 1, username: 'mary_smith', nickname: 'Mary Smith', content: '看起来真棒！下次带上我 😊', time: '2025-01-26 11:00:00', likes: 12 },
  { id: 2, username: 'alex_wang', nickname: 'Alex Wang', content: '天气确实很好，我也出去玩了', time: '2025-01-26 11:30:00', likes: 8 },
  { id: 3, username: 'lisa_chen', nickname: 'Lisa Chen', content: '照片拍得真好看！', time: '2025-01-26 12:00:00', likes: 5 },
  { id: 4, username: 'tom_brown', nickname: 'Tom Brown', content: '羡慕你们的好天气', time: '2025-01-26 13:15:00', likes: 3 },
  { id: 5, username: 'sarah_jones', nickname: 'Sarah Jones', content: '下次聚会记得叫我！', time: '2025-01-26 14:20:00', likes: 7 },
];

// 状态标签
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    normal: { label: '正常', className: 'bg-green-100 text-green-700' },
    pending: { label: '审核中', className: 'bg-yellow-100 text-yellow-700' },
    deleted: { label: '已删除', className: 'bg-gray-100 text-gray-600' },
  };
  const config = statusMap[status] || statusMap.normal;
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};

export default function Component() {
  const [post, setPost] = useState(mockPost);
  const [comments] = useState<Comment[]>(mockComments);

  // 获取URL参数
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id') || post.id;

  const handleDelete = () => {
    if (confirm('确定要删除该动态吗？')) {
      setPost({ ...post, status: 'deleted' });
    }
  };

  const handleApprove = () => {
    setPost({ ...post, status: 'normal' });
  };

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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <a
                href="/prototypes/superim-admin-feed"
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={18} />
                <span>返回动态列表</span>
              </a>
              <h2 className="text-2xl font-bold text-gray-900">动态详情 #{postId}</h2>
            </div>
            <div className="flex items-center gap-2">
              {post.status === 'pending' && (
                <button
                  onClick={handleApprove}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle size={18} />
                  <span>审核通过</span>
                </button>
              )}
              {post.status !== 'deleted' && (
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={18} />
                  <span>删除动态</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：动态内容 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 动态卡片 */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* 用户信息 */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xl font-bold text-blue-700">
                          {post.nickname.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{post.nickname}</h3>
                        <p className="text-sm text-gray-500">@{post.username}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                          <Clock size={12} />
                          <span>{post.createdAt}</span>
                          {post.location && (
                            <>
                              <span>·</span>
                              <Globe size={12} />
                              <span>{post.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={post.status} />
                  </div>
                </div>

                {/* 动态内容 */}
                <div className="p-6">
                  <p className="text-gray-800 text-lg leading-relaxed mb-4">{post.content}</p>
                  
                  {/* 图片 */}
                  {post.images.length > 0 && (
                    <div className={`grid gap-2 mb-4 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                      {post.images.map((img, idx) => (
                        <div key={idx} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <img src={img} alt={`图片 ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 互动数据 */}
                  <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Heart size={18} />
                      <span className="text-sm">{post.likes} 赞</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <MessageCircle size={18} />
                      <span className="text-sm">{post.comments} 评论</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Share2 size={18} />
                      <span className="text-sm">{post.shares} 分享</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 评论列表 */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">评论列表 ({comments.length})</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-gray-600">
                            {comment.nickname.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{comment.nickname}</span>
                            <span className="text-sm text-gray-500">@{comment.username}</span>
                            <span className="text-xs text-gray-400">· {comment.time}</span>
                          </div>
                          <p className="text-gray-700 text-sm mb-2">{comment.content}</p>
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors">
                              <Heart size={14} />
                              <span className="text-xs">{comment.likes}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 右侧：用户信息 */}
            <div className="space-y-6">
              {/* 发布者信息 */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">发布者信息</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-700">
                      {post.nickname.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{post.nickname}</h4>
                    <p className="text-sm text-gray-500">@{post.username}</p>
                  </div>
                </div>
                <a
                  href={`/prototypes/superim-admin-user-detail?username=${post.username}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User size={18} />
                  <span>查看用户详情</span>
                </a>
              </div>

              {/* 动态统计 */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">互动统计</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Heart size={20} className="text-red-500" />
                      <span className="text-gray-700">点赞数</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">{post.likes}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MessageCircle size={20} className="text-blue-500" />
                      <span className="text-gray-700">评论数</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">{post.comments}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Share2 size={20} className="text-green-500" />
                      <span className="text-gray-700">分享数</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">{post.shares}</span>
                  </div>
                </div>
              </div>

              {/* 操作记录 */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">操作记录</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Clock size={14} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-700">动态发布</p>
                      <p className="text-gray-400">{post.createdAt}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
