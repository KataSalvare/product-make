/**
 * @name 云盘操作审计
 * @description Read-only audit trail for cloud drive mutations
 */

import { useMemo, useState } from 'react'
import { ClipboardList, Eye, Search, X } from 'lucide-react'
import '../../themes/equatorial-minimalism/globals.css'
import { actionLabels, AdminCloudDriveShell, formatDateTime, StatusBadge, useAdminCloudDrive } from '../superim-admin-cloud-drive/shared'
import './style.css'

const CloudDriveAuditPage = () => {
  const { auditRecords } = useAdminCloudDrive()
  const [query, setQuery] = useState('')
  const [action, setAction] = useState('all')
  const [result, setResult] = useState('all')
  const [page, setPage] = useState(1)
  const [detailId, setDetailId] = useState<string | null>(null)
  const pageSize = 8
  const filteredRecords = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return auditRecords.filter(record => {
      const queryMatches = !normalized || record.operatorName.toLowerCase().includes(normalized) || record.targetName.toLowerCase().includes(normalized) || record.targetId.toLowerCase().includes(normalized)
      return queryMatches && (action === 'all' || record.action === action) && (result === 'all' || record.result === result)
    })
  }, [action, auditRecords, query, result])
  const pageCount = Math.max(1, Math.ceil(filteredRecords.length / pageSize))
  const visibleRecords = filteredRecords.slice((page - 1) * pageSize, page * pageSize)
  const detailRecord = auditRecords.find(record => record.id === detailId)

  return (
    <AdminCloudDriveShell title="操作审计" description="只读查看所有云盘配额和文件变更记录">
      <div className="space-y-5">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"><div className="flex flex-wrap items-center gap-3"><div className="relative flex-1 min-w-[240px]"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={query} onChange={event => { setQuery(event.target.value); setPage(1) }} placeholder="搜索管理员、目标名称或对象 ID" className="w-full h-10 rounded-xl border border-gray-200 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></div><select value={action} onChange={event => { setAction(event.target.value); setPage(1) }} className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500"><option value="all">全部操作</option>{Object.entries(actionLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><select value={result} onChange={event => { setResult(event.target.value); setPage(1) }} className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500"><option value="all">全部结果</option><option value="success">成功</option><option value="failed">失败</option></select></div></div>
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"><div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between"><div><h2 className="font-semibold">变更记录</h2><p className="text-xs text-gray-500 mt-1">审计日志不可删除或修改 · 共 {filteredRecords.length} 条</p></div><span className="inline-flex items-center gap-1.5 text-xs text-gray-500"><ClipboardList size={15} />只读模式</span></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-gray-50 text-xs text-gray-500"><tr><th className="px-5 py-3 font-medium">时间</th><th className="px-3 py-3 font-medium">操作</th><th className="px-3 py-3 font-medium">管理员</th><th className="px-3 py-3 font-medium">目标</th><th className="px-3 py-3 font-medium">原因</th><th className="px-3 py-3 font-medium">结果</th><th className="w-20 px-5 py-3 text-right font-medium">详情</th></tr></thead><tbody className="divide-y divide-gray-100">{visibleRecords.map(record => <tr key={record.id} className="hover:bg-gray-50/80"><td className="px-5 py-4 whitespace-nowrap text-gray-500">{formatDateTime(record.createdAt)}</td><td className="px-3 py-4"><span className="font-medium">{actionLabels[record.action]}</span><p className="text-[11px] text-gray-400 mt-0.5">{record.action}</p></td><td className="px-3 py-4">{record.operatorName}</td><td className="px-3 py-4"><p className="font-medium max-w-[210px] truncate">{record.targetName}</p><p className="text-xs text-gray-400 mt-0.5">{record.targetId}</p></td><td className="px-3 py-4 max-w-[250px] truncate text-gray-500">{record.reason}</td><td className="px-3 py-4"><StatusBadge status={record.result} /></td><td className="px-5 py-4 text-right"><button type="button" onClick={() => setDetailId(record.id)} className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-blue-600" title="查看审计详情"><Eye size={16} /></button></td></tr>)}</tbody></table>{visibleRecords.length === 0 && <div className="py-16 text-center"><ClipboardList className="mx-auto text-gray-300" size={32} /><p className="mt-3 text-sm font-medium text-gray-600">没有匹配的审计记录</p></div>}</div><div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between"><span className="text-xs text-gray-500">第 {page} / {pageCount} 页</span><div className="flex gap-2"><button type="button" disabled={page <= 1} onClick={() => setPage(value => value - 1)} className="h-8 px-3 rounded-lg border border-gray-200 text-sm disabled:opacity-40">上一页</button><button type="button" disabled={page >= pageCount} onClick={() => setPage(value => value + 1)} className="h-8 px-3 rounded-lg border border-gray-200 text-sm disabled:opacity-40">下一页</button></div></div></div>
      </div>

      {detailRecord && <div className="fixed inset-0 z-50 flex items-center justify-center p-4"><button type="button" className="absolute inset-0 bg-black/35" aria-label="关闭审计详情" onClick={() => setDetailId(null)} /><div className="relative w-full max-w-[520px] rounded-2xl bg-white shadow-2xl p-6"><div className="flex items-start justify-between"><div><p className="text-xs text-blue-600 font-medium">审计详情</p><h2 className="text-lg font-bold mt-1">{actionLabels[detailRecord.action]}</h2></div><button type="button" onClick={() => setDetailId(null)} className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100"><X size={18} /></button></div><dl className="mt-5 divide-y divide-gray-100">{[['日志 ID', detailRecord.id], ['发生时间', new Date(detailRecord.createdAt).toLocaleString('zh-CN')], ['操作管理员', detailRecord.operatorName], ['目标对象', `${detailRecord.targetName}（${detailRecord.targetId}）`], ['操作原因', detailRecord.reason], ['修改前', detailRecord.before || '—'], ['修改后', detailRecord.after || '—'], ['操作结果', detailRecord.result === 'success' ? '成功' : '失败']].map(([label, value]) => <div key={label} className="py-3 flex items-start justify-between gap-5 text-sm"><dt className="text-gray-500 shrink-0">{label}</dt><dd className="font-medium text-right break-all">{value}</dd></div>)}</dl><p className="mt-5 text-xs text-gray-400">审计页为只读页面，不提供日志删除或修改操作。</p></div></div>}
    </AdminCloudDriveShell>
  )
}

export default CloudDriveAuditPage
