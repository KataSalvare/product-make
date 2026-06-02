/**
 * @name 实时数据大屏
 *
 * @description
 * SuperIM 实时数据监控大屏，全屏展示平台运营数据。
 * 适用于会议室展示、领导汇报等场景。
 *
 * @usage
 * 访问路径: /admin/bigscreen
 * 数据每5秒自动刷新
 *
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import React, { useState, useEffect } from 'react';
import {
  Users, Activity, UserPlus, MessageSquare, Phone, AlertCircle,
  Maximize2, X, Clock
} from 'lucide-react';
import './style.css';

// Mock 数据
const mockBigScreenData = {
  metrics: {
    totalUsers: 125432,
    onlineUsers: 1234,
    todayNew: 456,
    todayMessages: 45678,
    todayCallMinutes: 1234,
    pendingReports: 12
  },
  mapData: [
    { country: '尼日利亚', value: 45000, lat: 9.082, lng: 8.675 },
    { country: '肯尼亚', value: 28000, lat: -0.024, lng: 37.906 },
    { country: '南非', value: 22000, lat: -30.559, lng: 22.937 },
    { country: '加纳', value: 15000, lat: 7.947, lng: -1.023 },
    { country: '埃塞俄比亚', value: 8000, lat: 9.145, lng: 40.489 },
    { country: '坦桑尼亚', value: 7432, lat: -6.369, lng: 34.889 }
  ],
  onlineTrend: {
    hours: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
    users: [234, 156, 89, 234, 567, 890, 1234, 1456, 1567, 1789, 1654, 1234]
  },
  messageTypes: [
    { name: '文字消息', value: 28000, color: '#3B82F6' },
    { name: '图片消息', value: 12000, color: '#10B981' },
    { name: '语音消息', value: 4000, color: '#F59E0B' },
    { name: '文件消息', value: 1678, color: '#8B5CF6' }
  ],
  chatTypes: [
    { name: '单聊', value: 32000 },
    { name: '群聊', value: 13678 }
  ],
  userGrowth: {
    dates: ['01-01', '01-05', '01-10', '01-15', '01-20', '01-25'],
    newUsers: [280, 320, 380, 420, 390, 456],
    activeUsers: [6800, 7200, 7500, 7800, 8100, 8234],
    lostUsers: [45, 50, 48, 55, 52, 40]
  },
  realtimeUsers: [
    { id: 1, name: 'John Doe', time: '刚刚', avatar: 'JD' },
    { id: 2, name: 'Mary Smith', time: '1分钟前', avatar: 'MS' },
    { id: 3, name: 'Alex Wang', time: '2分钟前', avatar: 'AW' },
    { id: 4, name: 'Lisa Chen', time: '3分钟前', avatar: 'LC' },
    { id: 5, name: 'Tom Brown', time: '5分钟前', avatar: 'TB' }
  ]
};

// 格式化数字
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  return num.toLocaleString();
};

// 核心指标卡片
const MetricCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend?: number;
}> = ({ title, value, icon, color, trend }) => {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30',
    orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/30',
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
    red: 'from-red-500/20 to-red-600/10 border-red-500/30'
  };

  return (
    <div className={`p-6 rounded-xl bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-lg bg-white/10">
          {React.cloneElement(icon as React.ReactElement<any>, { className: 'text-white', size: 24 })}
        </div>
        {trend !== undefined && (
          <span className={`text-sm font-medium ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold text-white">{formatNumber(value)}</p>
    </div>
  );
};

// 简单的 SVG 折线图
const LineChart: React.FC<{ data: number[]; labels: string[]; color: string }> = ({ data, labels, color }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 50;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height + 10}`} className="w-full h-32" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={`0,${height} ${points} ${width},${height}`}
          fill={`url(#gradient-${color})`}
        />
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="0.5"
          points={points}
        />
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * width;
          const y = height - ((value - min) / range) * height;
          return (
            <circle key={index} cx={x} cy={y} r="1" fill={color} />
          );
        })}
      </svg>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        {labels.filter((_, i) => i % 2 === 0).map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>
    </div>
  );
};

// 简单的 SVG 饼图
const PieChart: React.FC<{ data: { name: string; value: number; color: string }[] }> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <div className="flex items-center gap-4">
      <svg width="100" height="100" viewBox="0 0 100 100">
        {data.map((item, index) => {
          const angle = (item.value / total) * 360;
          const startAngle = currentAngle;
          currentAngle += angle;
          const endAngle = currentAngle;

          const startRad = ((startAngle - 90) * Math.PI) / 180;
          const endRad = ((endAngle - 90) * Math.PI) / 180;

          const x1 = 50 + 40 * Math.cos(startRad);
          const y1 = 50 + 40 * Math.sin(startRad);
          const x2 = 50 + 40 * Math.cos(endRad);
          const y2 = 50 + 40 * Math.sin(endRad);

          const largeArc = angle > 180 ? 1 : 0;

          return (
            <path
              key={index}
              d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={item.color}
              stroke="#0F172A"
              strokeWidth="2"
            />
          );
        })}
      </svg>
      <div className="space-y-1">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-gray-400">{item.name}</span>
            <span className="text-white font-medium">{((item.value / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 非洲地图简图（使用点表示）
const AfricaMap: React.FC<{ data: { country: string; value: number; lat: number; lng: number }[] }> = ({ data }) => {
  const max = Math.max(...data.map(d => d.value));

  return (
    <div className="relative w-full h-64 bg-slate-800/50 rounded-xl overflow-hidden">
      {/* 简化的非洲轮廓背景 */}
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full opacity-30">
        <path
          d="M150,50 Q200,40 250,60 L280,100 Q300,150 290,200 L280,280 Q270,350 220,380 L180,370 Q130,340 120,280 L110,200 Q100,150 120,100 L140,60 Q145,55 150,50Z"
          fill="#1E293B"
          stroke="#334155"
          strokeWidth="2"
        />
      </svg>
      {/* 数据点 */}
      {data.map((item, index) => {
        // 简化的坐标映射
        const x = ((item.lng + 20) / 60) * 100;
        const y = ((20 - item.lat) / 60) * 100;
        const size = Math.max(8, (item.value / max) * 30);
        const opacity = Math.max(0.4, item.value / max);

        return (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div
              className="rounded-full bg-blue-500 animate-pulse"
              style={{
                width: size,
                height: size,
                opacity: opacity,
                boxShadow: `0 0 ${size}px rgba(59, 130, 246, 0.5)`
              }}
            />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-700 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {item.country}: {formatNumber(item.value)}
            </div>
          </div>
        );
      })}
      {/* 图例 */}
      <div className="absolute bottom-4 left-4 flex items-center gap-4 text-xs text-gray-400">
        <span>用户分布</span>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 opacity-40" />
          <span>少</span>
          <div className="w-4 h-4 rounded-full bg-blue-500" />
          <span>多</span>
        </div>
      </div>
    </div>
  );
};

export default function Component() {
  const [data, setData] = useState(mockBigScreenData);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 模拟数据刷新
  useEffect(() => {
    const timer = setInterval(() => {
      setData(prev => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          onlineUsers: prev.metrics.onlineUsers + Math.floor(Math.random() * 20 - 10),
          todayMessages: prev.metrics.todayMessages + Math.floor(Math.random() * 100 - 50),
        }
      }));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // ESC 退出
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.close();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#ffffff' }}>SuperIM 实时数据监控大屏</h1>
            <p className="text-sm" style={{ color: '#9ca3af' }}>Real-time Data Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock size={18} />
            <span className="text-lg font-mono">{currentTime.toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="全屏"
            >
              <Maximize2 size={20} />
            </button>
            <button
              onClick={() => window.close()}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="关闭"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <MetricCard
            title="总注册用户"
            value={data.metrics.totalUsers}
            icon={<Users />}
            color="blue"
            trend={12.5}
          />
          <MetricCard
            title="当前在线"
            value={data.metrics.onlineUsers}
            icon={<Activity />}
            color="green"
            trend={5.2}
          />
          <MetricCard
            title="今日新增"
            value={data.metrics.todayNew}
            icon={<UserPlus />}
            color="orange"
            trend={-2.1}
          />
          <MetricCard
            title="今日消息"
            value={data.metrics.todayMessages}
            icon={<MessageSquare />}
            color="cyan"
            trend={15.8}
          />
          <MetricCard
            title="今日通话"
            value={data.metrics.todayCallMinutes}
            icon={<Phone />}
            color="purple"
            trend={3.4}
          />
          <MetricCard
            title="待处理举报"
            value={data.metrics.pendingReports}
            icon={<AlertCircle />}
            color="red"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Map */}
          <div className="p-6 rounded-xl bg-slate-800/50 border border-white/10">
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#ffffff' }}>用户地理分布</h3>
            <AfricaMap data={data.mapData} />
          </div>

          {/* Realtime Activity */}
          <div className="p-6 rounded-xl bg-slate-800/50 border border-white/10">
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#ffffff' }}>实时动态</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* New Users */}
              <div>
                <p className="text-sm text-gray-400 mb-3">最新注册</p>
                <div className="space-y-2">
                  {data.realtimeUsers.map(user => (
                    <div key={user.id} className="flex items-center gap-3 p-2 bg-slate-700/50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                        {user.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                      </div>
                      <span className="text-xs text-gray-500">{user.time}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Online Trend */}
              <div>
                <p className="text-sm text-gray-400 mb-3">24小时在线趋势</p>
                <LineChart
                  data={data.onlineTrend.users}
                  labels={data.onlineTrend.hours}
                  color="#10B981"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Message Types */}
          <div className="p-6 rounded-xl bg-slate-800/50 border border-white/10">
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#ffffff' }}>消息类型分布</h3>
            <div className="flex items-center justify-between">
              <PieChart data={data.messageTypes} />
              <div className="flex-1 ml-8">
                <div className="grid grid-cols-2 gap-4">
                  {data.chatTypes.map((item, index) => (
                    <div key={index} className="p-4 bg-slate-700/50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-white">{formatNumber(item.value)}</p>
                      <p className="text-sm text-gray-400">{item.name}消息</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* User Growth */}
          <div className="p-6 rounded-xl bg-slate-800/50 border border-white/10">
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#ffffff' }}>用户增长趋势</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-2">新增用户</p>
                <LineChart data={data.userGrowth.newUsers} labels={data.userGrowth.dates} color="#3B82F6" />
              </div>
              <div className="flex gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm text-gray-400">新增</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-400">活跃</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm text-gray-400">流失</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
