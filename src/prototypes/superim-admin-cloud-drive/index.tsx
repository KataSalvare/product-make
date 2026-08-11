/**
 * @name 云盘运营总览
 * @description Cloud Drive operations overview for administrators
 */

import { useMemo } from 'react'
import { Activity, ArrowRight, Files, HardDrive, ShieldAlert, Trash2, Upload, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import '../../themes/equatorial-minimalism/globals.css'
import {
  actionLabels,
  AdminCloudDriveShell,
  formatBytes,
  formatDateTime,
  MetricCard,
  StatusBadge,
  UsageBar,
  useAdminCloudDrive,
  WarningBanner,
  categoryLabels,
} from '../superim-admin-cloud-drive/shared'
import './style.css'

const chartData = [
  { label: '周一', upload: 18, delete: 2, freeze: 1 },
  { label: '周二', upload: 24, delete: 1, freeze: 0 },
  { label: '周三', upload: 16, delete: 3, freeze: 2 },
  { label: '周四', upload: 32, delete: 4, freeze: 1 },
  { label: '周五', upload: 26, delete: 2, freeze: 3 },
  { label: '周六', upload: 20, delete: 1, freeze: 0 },
  { label: '周日', upload: 28, delete: 2, freeze: 1 },
]

const CloudDriveOverviewPage: React.FC = () => {
  const { summary, fileRecords, userQuotas, auditRecords } = useAdminCloudDrive()
  const usagePercent = summary.totalStorageBytes > 0 ? (summary.usedStorageBytes / summary.totalStorageBytes) * 100 : 0
  const typeDistribution = useMemo(() => Object.entries(categoryLabels).map(([category, label]) => ({
    category,
    label,
    value: fileRecords.filter(file => file.category === category).reduce((sum, file) => sum + file.sizeBytes, 0),
  })).filter(item => item.value > 0).sort((a, b) => b.value - a.value), [fileRecords])
  const maxTypeValue = Math.max(...typeDistribution.map(item => item.value), 1)
  const maxUserUsage = Math.max(...userQuotas.map(user => user.usedBytes), 1)
  const recentAudits = auditRecords.slice(0, 4)

  return (
    <AdminCloudDriveShell title="云盘运营总览" description="查看容量、文件健康度与近期运营动作">
      <div className="space-y-6">
        {usagePercent >= 90 && <WarningBanner tone="red" message={`存储使用率已达到 ${usagePercent.toFixed(1)}%，超过 90% 预警线。建议立即检查高占用用户或提升默认配额。`} />}
        {usagePercent >= 80 && usagePercent < 90 && <WarningBanner message={`存储使用率已达到 ${usagePercent.toFixed(1)}%，进入 80% 容量预警区间。`} />}

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricCard label="总容量" value={formatBytes(summary.totalStorageBytes)} helper="按用户默认配额汇总" icon={HardDrive} />
          <MetricCard label="已用容量" value={formatBytes(summary.usedStorageBytes)} helper={`${usagePercent.toFixed(1)}% 使用率`} icon={Activity} tone={usagePercent >= 80 ? 'orange' : 'blue'} />
          <MetricCard label="云盘用户" value={`${summary.userCount}`} helper="有文件记录的用户" icon={Users} tone="green" />
          <MetricCard label="文件总数" value={`${summary.fileCount}`} helper={`${summary.frozenFileCount} 个文件被冻结`} icon={Files} tone={summary.frozenFileCount > 0 ? 'orange' : 'blue'} />
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)] gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4"><div><h2 className="font-semibold">操作趋势</h2><p className="text-xs text-gray-500 mt-1">近 7 天云盘关键操作数量</p></div><div className="flex flex-wrap items-center gap-3 text-xs text-gray-500"><span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-blue-600" />上传</span><span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-orange-500" />冻结</span><span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-red-500" />删除</span></div></div>
            <div className="mt-6 grid grid-cols-7 items-end gap-3 h-44">
              {chartData.map(day => <div key={day.label} className="h-full flex flex-col items-center justify-end gap-2"><div className="w-full flex items-end justify-center gap-1 h-32"><span className="w-2.5 rounded-t bg-blue-600" style={{ height: `${(day.upload / 32) * 100}%` }} /><span className="w-2.5 rounded-t bg-orange-500" style={{ height: `${Math.max(5, (day.freeze / 3) * 100)}%` }} /><span className="w-2.5 rounded-t bg-red-500" style={{ height: `${Math.max(5, (day.delete / 4) * 100)}%` }} /></div><span className="text-[11px] text-gray-500">{day.label}</span></div>)}
            </div>
            <div className="mt-4 flex items-center gap-6 border-t border-gray-100 pt-4 text-sm"><span><b className="text-gray-900">{summary.uploadCount}</b> <span className="text-gray-500">当前上传文件</span></span><span><b className="text-gray-900">{summary.deleteCount}</b> <span className="text-gray-500">已删除记录</span></span><Link to="/admin/cloud-drive/audit" className="ml-auto inline-flex items-center gap-1 text-blue-600 font-medium hover:text-blue-700">查看审计 <ArrowRight size={15} /></Link></div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"><div className="flex items-start justify-between"><div><h2 className="font-semibold">容量健康度</h2><p className="text-xs text-gray-500 mt-1">当前全局存储状态</p></div><HardDrive className="text-blue-600" size={20} /></div><div className="mt-7 flex items-end gap-3"><span className="text-4xl font-bold tracking-tight">{usagePercent.toFixed(1)}%</span><span className="text-sm text-gray-500 mb-1">已使用</span></div><UsageBar used={summary.usedStorageBytes} total={summary.totalStorageBytes} /><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-gray-50 p-3"><p className="text-xs text-gray-500">可用容量</p><p className="font-semibold mt-1">{formatBytes(Math.max(0, summary.totalStorageBytes - summary.usedStorageBytes))}</p></div><div className="rounded-xl bg-gray-50 p-3"><p className="text-xs text-gray-500">冻结文件</p><p className="font-semibold mt-1">{summary.frozenFileCount} 个</p></div></div></div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="font-semibold">文件类型占用</h2><p className="text-xs text-gray-500 mt-1">按文件大小统计</p></div><Link to="/admin/cloud-drive/files" className="text-sm text-blue-600 hover:text-blue-700">文件管理</Link></div><div className="mt-5 space-y-4">{typeDistribution.map(item => <div key={item.category}><div className="flex items-center justify-between text-sm mb-1.5"><span className="font-medium">{item.label}</span><span className="text-gray-500">{formatBytes(item.value)}</span></div><div className="h-2 rounded-full bg-gray-100 overflow-hidden"><div className="h-full rounded-full bg-blue-600" style={{ width: `${(item.value / maxTypeValue) * 100}%` }} /></div></div>)}</div></div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="font-semibold">高占用用户</h2><p className="text-xs text-gray-500 mt-1">按已用空间排序</p></div><Link to="/admin/cloud-drive/quotas" className="text-sm text-blue-600 hover:text-blue-700">管理配额</Link></div><div className="mt-4 space-y-4">{userQuotas.slice(0, 4).map(user => <div key={user.userId}><div className="flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">{user.userName.slice(0, 1)}</span><div className="min-w-0 flex-1"><div className="flex justify-between gap-3 text-sm"><span className="font-medium truncate">{user.userName}</span><span className="text-gray-500 shrink-0">{formatBytes(user.usedBytes)}</span></div><div className="h-1.5 rounded-full bg-gray-100 mt-1.5 overflow-hidden"><div className="h-full rounded-full bg-blue-600" style={{ width: `${(user.usedBytes / maxUserUsage) * 100}%` }} /></div></div></div></div>)}</div></div>
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"><div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between"><div><h2 className="font-semibold">最近异常与变更</h2><p className="text-xs text-gray-500 mt-1">最近需要运营关注的云盘操作</p></div><Link to="/admin/cloud-drive/audit" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">全部审计 <ArrowRight size={15} /></Link></div><div className="divide-y divide-gray-100">{recentAudits.map(record => <div key={record.id} className="px-5 py-4 flex items-center gap-4"><span className={`w-9 h-9 rounded-xl flex items-center justify-center ${record.result === 'failed' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>{record.action === 'file.delete' ? <Trash2 size={17} /> : record.action === 'file.freeze' ? <ShieldAlert size={17} /> : <Upload size={17} />}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="font-medium text-sm">{actionLabels[record.action]}</span><span className="text-xs text-gray-400">{record.targetName}</span></div><p className="text-xs text-gray-500 mt-1 truncate">{record.reason}</p></div><div className="text-right shrink-0"><StatusBadge status={record.result} /><p className="text-[11px] text-gray-400 mt-1">{formatDateTime(record.createdAt)}</p></div></div>)}</div></section>
      </div>
    </AdminCloudDriveShell>
  )
}

export default CloudDriveOverviewPage
