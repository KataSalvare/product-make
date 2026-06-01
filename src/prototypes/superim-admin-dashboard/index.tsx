/**
 * @name 数据概览 Dashboard
 *
 * @description
 * SuperIM 后台管理系统数据概览页面，展示平台核心运营数据。
 * 包含用户统计、消息统计、实时动态等关键指标。
 *
 * @usage
 * 访问路径: /admin/dashboard
 * 数据刷新: 每30秒自动刷新
 *
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState, useEffect } from 'react';
import {
  Users, Activity, UserPlus, Globe, MessageSquare, Phone,
  RefreshCw, TrendingUp, TrendingDown, AlertCircle
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import './style.css';

// Mock 数据
const mockDashboardData = {
  metrics: {
    totalUsers: 125432,
    todayActive: 8234,
    todayNew: 456,
    onlineUsers: 1234,
    todayMessages: 45678,
    todayCallMinutes: 1234
  },
  userTrend: {
    dates: ['01-20', '01-21', '01-22', '01-23', '01-24', '01-25', '01-26'],
    newUsers: [320, 380, 420, 390, 456, 410, 380],
    activeUsers: [7200, 7500, 7800, 8100, 8234, 8000, 7900],
    lostUsers: [50, 45, 60, 55, 40, 50, 48]
  },
  messageStats: {
    singleChat: 32000,
    groupChat: 13678,
    textMessages: 28000,
    imageMessages: 12000,
    voiceMessages: 4000,
    fileMessages: 1678
  },
  userDistribution: {
    byCountry: [
      { name: '尼日利亚', value: 45000 },
      { name: '肯尼亚', value: 28000 },
      { name: '南非', value: 22000 },
      { name: '加纳', value: 15000 },
      { name: '其他', value: 15432 }
    ],
    byDevice: [
      { name: 'Android', value: 75000 },
      { name: 'iOS', value: 42000 },
      { name: 'Web', value: 8432 }
    ]
  },
  realtimeActivity: {
    newUsers: [
      { id: 1, username: 'john_doe', nickname: 'John', time: '2分钟前', avatar: 'JD' },
      { id: 2, username: 'mary_smith', nickname: 'Mary', time: '5分钟前', avatar: 'MS' },
      { id: 3, username: 'alex_wang', nickname: 'Alex', time: '8分钟前', avatar: 'AW' },
      { id: 4, username: 'lisa_chen', nickname: 'Lisa', time: '12分钟前', avatar: 'LC' },
      { id: 5, username: 'tom_brown', nickname: 'Tom', time: '15分钟前', avatar: 'TB' }
    ],
    reports: [
      { id: 1, type: '垃圾广告', content: '用户举报广告消息', time: '1分钟前' },
      { id: 2, type: '骚扰', content: '用户被骚扰', time: '3分钟前' },
      { id: 3, type: '色情暴力', content: '不当内容', time: '6分钟前' }
    ]
  }
};

// 格式化数字
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  return num.toLocaleString();
};

// 指标卡片组件
interface MetricCardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, color }) => {
  const isPositive = change >= 0;
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
    cyan: 'bg-cyan-50 text-cyan-600',
    pink: 'bg-pink-50 text-pink-600'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{formatNumber(value)}</p>
          <div className={`flex items-center mt-2 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
            <span>{Math.abs(change)}%</span>
            <span className="text-gray-400 ml-1">较昨日</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color] || colorClasses.blue}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// 简单的 SVG 折线图组件
const SimpleLineChart: React.FC<{ data: number[]; color: string; width?: number; height?: number }> = ({
  data, color, width = 200, height = 60
}) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
      />
      {data.map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        return (
          <circle
            key={index}
            cx={x}
            cy={y}
            r="3"
            fill={color}
          />
        );
      })}
    </svg>
  );
};

// 简单的 SVG 柱状图组件
const SimpleBarChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
  const max = Math.max(...data.map(d => d.value));

  return (
    <div className="flex items-end justify-between h-32 gap-4">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div
            className="w-full rounded-t-md transition-all duration-500"
            style={{
              height: `${(item.value / max) * 100}%`,
              backgroundColor: item.color,
              minHeight: '4px'
            }}
          />
          <span className="text-xs text-gray-500 mt-2">{item.label}</span>
          <span className="text-xs font-medium text-gray-700">{formatNumber(item.value)}</span>
        </div>
      ))}
    </div>
  );
};

// 简单的 SVG 饼图组件
const SimplePieChart: React.FC<{ data: { name: string; value: number; color: string }[] }> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <div className="flex items-center gap-6">
      <svg width="120" height="120" viewBox="0 0 120 120">
        {data.map((item, index) => {
          const angle = (item.value / total) * 360;
          const startAngle = currentAngle;
          currentAngle += angle;
          const endAngle = currentAngle;

          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;

          const x1 = 60 + 50 * Math.cos(startRad);
          const y1 = 60 + 50 * Math.sin(startRad);
          const x2 = 60 + 50 * Math.cos(endRad);
          const y2 = 60 + 50 * Math.sin(endRad);

          const largeArc = angle > 180 ? 1 : 0;

          return (
            <path
              key={index}
              d={`M 60 60 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={item.color}
              stroke="white"
              strokeWidth="2"
            />
          );
        })}
      </svg>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-gray-600">{item.name}</span>
            <span className="font-medium">{((item.value / total) * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Component() {
  const [data, setData] = useState(mockDashboardData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // 模拟数据刷新
  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // 随机微调数据
      setData(prev => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          todayActive: prev.metrics.todayActive + Math.floor(Math.random() * 100 - 50),
          onlineUsers: prev.metrics.onlineUsers + Math.floor(Math.random() * 50 - 25),
          todayMessages: prev.metrics.todayMessages + Math.floor(Math.random() * 1000 - 500),
        }
      }));
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  // 自动刷新
  useEffect(() => {
    const timer = setInterval(refreshData, 30000);
    return () => clearInterval(timer);
  }, []);

  const metricsData: MetricCardProps[] = [
    { title: '总注册用户', value: data.metrics.totalUsers, change: 12.5, icon: <Users size={24} />, color: 'blue' },
    { title: '今日活跃用户', value: data.metrics.todayActive, change: 8.3, icon: <Activity size={24} />, color: 'green' },
    { title: '今日新增用户', value: data.metrics.todayNew, change: -2.1, icon: <UserPlus size={24} />, color: 'orange' },
    { title: '当前在线用户', value: data.metrics.onlineUsers, change: 5.7, icon: <Globe size={24} />, color: 'purple' },
    { title: '今日消息数', value: data.metrics.todayMessages, change: 15.2, icon: <MessageSquare size={24} />, color: 'cyan' },
    { title: '今日通话时长', value: data.metrics.todayCallMinutes, change: 3.8, icon: <Phone size={24} />, color: 'pink' },
  ];

  const deviceColors = ['#3B82F6', '#10B981', '#F59E0B'];
  const countryColors = ['#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">SuperIM Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              上次更新: {lastUpdate.toLocaleTimeString()}
            </span>
            <button
              onClick={refreshData}
              disabled={isRefreshing}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-700">A</span>
              </div>
              <span className="text-sm text-gray-700">管理员</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">数据概览</h2>
            <p className="text-gray-500 mt-1">实时监控平台运营数据</p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {metricsData.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* User Trend Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">用户趋势</h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded">7天</button>
                  <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded">30天</button>
                  <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded">90天</button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">新增用户趋势</p>
                    <SimpleLineChart data={data.userTrend.newUsers} color="#3B82F6" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">活跃用户趋势</p>
                    <SimpleLineChart data={data.userTrend.activeUsers} color="#10B981" />
                  </div>
                </div>
              </div>
              <div className="flex gap-6 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-sm text-gray-600">新增用户</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm text-gray-600">活跃用户</span>
                </div>
              </div>
            </div>

            {/* Message Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">消息统计</h3>
              <SimpleBarChart
                data={[
                  { label: '单聊', value: data.messageStats.singleChat, color: '#3B82F6' },
                  { label: '群聊', value: data.messageStats.groupChat, color: '#10B981' },
                ]}
              />
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-3">消息类型分布</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">文字消息</span>
                    <span className="font-medium">{formatNumber(data.messageStats.textMessages)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">图片消息</span>
                    <span className="font-medium">{formatNumber(data.messageStats.imageMessages)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">语音消息</span>
                    <span className="font-medium">{formatNumber(data.messageStats.voiceMessages)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">文件消息</span>
                    <span className="font-medium">{formatNumber(data.messageStats.fileMessages)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Distribution */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">用户分布</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-500 mb-3">按国家/地区</p>
                  <SimplePieChart
                    data={data.userDistribution.byCountry.map((item, index) => ({
                      ...item,
                      color: countryColors[index]
                    }))}
                  />
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-3">按设备类型</p>
                  <SimplePieChart
                    data={data.userDistribution.byDevice.map((item, index) => ({
                      ...item,
                      color: deviceColors[index]
                    }))}
                  />
                </div>
              </div>
            </div>

            {/* Realtime Activity */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">实时动态</h3>

              {/* New Users */}
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-3">最新注册用户</p>
                <div className="space-y-3">
                  {data.realtimeActivity.newUsers.map(user => (
                    <div key={user.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-700">{user.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{user.nickname}</p>
                        <p className="text-sm text-gray-500">@{user.username}</p>
                      </div>
                      <span className="text-xs text-gray-400">{user.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reports */}
              <div>
                <p className="text-sm text-gray-500 mb-3">最新举报</p>
                <div className="space-y-3">
                  {data.realtimeActivity.reports.map(report => (
                    <div key={report.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                      <AlertCircle size={20} className="text-red-500" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{report.type}</p>
                        <p className="text-sm text-gray-500">{report.content}</p>
                      </div>
                      <span className="text-xs text-gray-400">{report.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
