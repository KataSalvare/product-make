/**
 * @name 通话记录
 *
 * @description
 * SuperIM 通话记录管理页面。
 *
 * @usage
 * 访问路径: /admin/calls
 *
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState } from 'react';
import { Phone, Video, PhoneCall, Clock, CheckCircle, XCircle, PhoneOff } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import './style.css';

const mockCalls = [
  { id: 1, caller: 'john_doe', callee: 'mary_smith', type: 'voice', duration: '05:23', status: 'completed', time: '2025-01-26 10:30' },
  { id: 2, caller: 'alex_wang', callee: 'lisa_chen', type: 'video', duration: '12:45', status: 'completed', time: '2025-01-26 09:15' },
  { id: 3, caller: 'tom_brown', callee: 'sarah_jones', type: 'voice', duration: '00:00', status: 'missed', time: '2025-01-25 18:20' },
  { id: 4, caller: 'mike_davis', callee: 'emma_wilson', type: 'video', duration: '03:12', status: 'cancelled', time: '2025-01-25 15:30' },
];

const stats = [
  { title: '今日通话', value: 234, icon: PhoneCall, color: 'blue' },
  { title: '总通话', value: 45678, icon: Phone, color: 'green' },
  { title: '总时长', value: '1234h', icon: Clock, color: 'purple' },
];

export default function Component() {
  const [calls] = useState(mockCalls);

  const formatDuration = (duration: string) => {
    if (duration === '00:00') return '-';
    return duration;
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">通话记录</h2>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
                    <stat.icon size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">主叫</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">被叫</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">类型</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">时长</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">通话时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {calls.map(call => (
                  <tr key={call.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-900">@{call.caller}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">@{call.callee}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        call.type === 'voice' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {call.type === 'voice' ? <Phone size={12} /> : <Video size={12} />}
                        {call.type === 'voice' ? '语音' : '视频'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{formatDuration(call.duration)}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        call.status === 'completed' ? 'bg-green-100 text-green-700' :
                        call.status === 'missed' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {call.status === 'completed' ? <CheckCircle size={12} /> :
                         call.status === 'missed' ? <PhoneOff size={12} /> :
                         <XCircle size={12} />}
                        {call.status === 'completed' ? '已接通' : call.status === 'missed' ? '未接通' : '已取消'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">{call.time}</td>
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
