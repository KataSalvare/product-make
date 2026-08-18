/**
 * @name 云盘文件管理
 * @description Metadata-only cloud file administration
 */

import { useMemo, useState } from 'react'
import { Eye, FileText, Filter, Lock, MoreHorizontal, Search, Trash2, Unlock, X } from 'lucide-react'
import '../../themes/equatorial-minimalism/globals.css'
import {
  AdminCloudDriveShell,
  categoryLabels,
  formatBytes,
  formatDateTime,
  sourceLabels,
  StatusBadge,
  useAdminCloudDrive,
} from '../superim-admin-cloud-drive/shared'
import './style.css'

type DateFilter = 'all' | 'today' | '7d' | '30d'
type SortMode = 'updated' | 'size' | 'name'

const CloudDriveFilesPage = () => {
  const { fileRecords, freezeFile, unfreezeFile, deleteFiles } = useAdminCloudDrive()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [source, setSource] = useState('all')
  const [status, setStatus] = useState('all')
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')
  const [sortMode, setSortMode] = useState<SortMode>('updated')
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [detailId, setDetailId] = useState<string | null>(null)
  const [freezeIds, setFreezeIds] = useState<string[]>([])
  const [deleteIds, setDeleteIds] = useState<string[]>([])
  const [freezeReason, setFreezeReason] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [referenceNow] = useState(() => Date.now())
  const pageSize = 6

  const filteredFiles = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const dateStart = dateFilter === 'today' ? new Date(referenceNow).setHours(0, 0, 0, 0)
      : dateFilter === '7d' ? referenceNow - 7 * 86400000
        : dateFilter === '30d' ? referenceNow - 30 * 86400000 : 0
    return [...fileRecords].filter(file => {
      const queryMatches = !normalized || file.name.toLowerCase().includes(normalized) || file.ownerUserId.includes(normalized)
      const categoryMatches = category === 'all' || file.category === category
      const sourceMatches = source === 'all' || file.source === source
      const statusMatches = status === 'all' || file.status === status
      const dateMatches = !dateStart || new Date(file.updatedAt).getTime() >= dateStart
      return queryMatches && categoryMatches && sourceMatches && statusMatches && dateMatches
    }).sort((a, b) => sortMode === 'name' ? a.name.localeCompare(b.name) : sortMode === 'size' ? b.sizeBytes - a.sizeBytes : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }, [category, dateFilter, fileRecords, query, referenceNow, sortMode, source, status])
  const pageCount = Math.max(1, Math.ceil(filteredFiles.length / pageSize))
  const visibleFiles = filteredFiles.slice((page - 1) * pageSize, page * pageSize)
  const selectedFiles = fileRecords.filter(file => selectedIds.includes(file.fileId))
  const detailFile = fileRecords.find(file => file.fileId === detailId)
  const freezeTargets = fileRecords.filter(file => freezeIds.includes(file.fileId))
  const deleteTargets = fileRecords.filter(file => deleteIds.includes(file.fileId))

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2400)
  }
  const toggleSelected = (fileId: string) => setSelectedIds(current => current.includes(fileId) ? current.filter(id => id !== fileId) : [...current, fileId])
  const resetPage = () => setPage(1)
  const selectAllVisible = () => setSelectedIds(current => visibleFiles.every(file => current.includes(file.fileId)) ? current.filter(id => !visibleFiles.some(file => file.fileId === id)) : Array.from(new Set([...current, ...visibleFiles.map(file => file.fileId)])))
  const submitFreeze = () => {
    if (!freezeReason.trim()) return
    freezeTargets.forEach(file => freezeFile(file.fileId, freezeReason))
    setFreezeIds([]); setFreezeReason(''); setSelectedIds(current => current.filter(id => !freezeIds.includes(id)))
    notify(`${freezeTargets.length} 个文件已冻结`)
  }
  const submitDelete = () => {
    deleteFiles(deleteIds)
    setDeleteIds([]); setSelectedIds(current => current.filter(id => !deleteIds.includes(id)))
    notify(`${deleteTargets.length} 个文件已永久删除`)
  }
  const freezeSelected = () => { if (selectedIds.length) { setFreezeIds(selectedIds); setFreezeReason(''); } }
  const unfreezeSelected = () => { selectedFiles.filter(file => file.status === 'frozen').forEach(file => unfreezeFile(file.fileId)); setSelectedIds([]); notify('已解冻选中文件') }

  return (
    <AdminCloudDriveShell title="文件管理" description="仅查看文件元数据，管理文件状态与生命周期">
      <div className="space-y-5">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"><div className="flex flex-wrap items-center gap-3"><div className="relative flex-1 min-w-[240px]"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={query} onChange={event => { setQuery(event.target.value); resetPage() }} placeholder="搜索文件名或用户 ID" className="w-full h-10 rounded-xl border border-gray-200 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></div><div className="flex items-center gap-2 text-sm text-gray-500"><Filter size={16} /><span>筛选</span></div>{[['category', category, setCategory, { all: '全部类型', ...categoryLabels }], ['source', source, setSource, { all: '全部来源', upload: '直接上传', chat: '聊天收存' }], ['status', status, setStatus, { all: '全部状态', active: '正常', frozen: '冻结' }], ['date', dateFilter, setDateFilter, { all: '全部时间', today: '今天', '7d': '近 7 天', '30d': '近 30 天' }]].map(([key, value, setter, options]) => <select key={key as string} value={value as string} onChange={event => { (setter as (value: string) => void)(event.target.value); resetPage() }} className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500">{Object.entries(options as Record<string, string>).map(([optionValue, label]) => <option key={optionValue} value={optionValue}>{label}</option>)}</select>)}<select value={sortMode} onChange={event => setSortMode(event.target.value as SortMode)} className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500"><option value="updated">最近更新</option><option value="size">文件大小</option><option value="name">文件名称</option></select></div></div>

        {selectedIds.length > 0 && <div className="flex flex-wrap items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3"><span className="text-sm font-medium text-blue-900">已选择 {selectedIds.length} 个文件</span><span className="h-4 w-px bg-blue-200" /><button type="button" onClick={freezeSelected} disabled={selectedFiles.every(file => file.status === 'frozen')} className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-medium text-orange-700 shadow-sm disabled:opacity-40"><Lock size={15} />冻结</button><button type="button" onClick={unfreezeSelected} disabled={selectedFiles.every(file => file.status !== 'frozen')} className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-medium text-emerald-700 shadow-sm disabled:opacity-40"><Unlock size={15} />解冻</button><button type="button" onClick={() => setDeleteIds(selectedIds)} className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-medium text-red-700 shadow-sm"><Trash2 size={15} />永久删除</button><button type="button" onClick={() => setSelectedIds([])} className="ml-auto text-sm text-blue-700">取消选择</button></div>}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"><div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between"><div><h2 className="font-semibold">文件元数据</h2><p className="text-xs text-gray-500 mt-1">共 {filteredFiles.length} 条记录 · 正文内容不会在后台展示</p></div><span className="text-sm text-gray-500">第 {page} / {pageCount} 页</span></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-gray-50 text-xs text-gray-500"><tr><th className="w-12 px-5 py-3"><input type="checkbox" checked={visibleFiles.length > 0 && visibleFiles.every(file => selectedIds.includes(file.fileId))} onChange={selectAllVisible} aria-label="全选当前页" /></th><th className="px-3 py-3 font-medium">文件</th><th className="px-3 py-3 font-medium">所属用户</th><th className="px-3 py-3 font-medium">来源 / 文件夹</th><th className="px-3 py-3 font-medium">大小</th><th className="px-3 py-3 font-medium">状态</th><th className="px-3 py-3 font-medium">更新时间</th><th className="w-24 px-5 py-3 text-right font-medium">操作</th></tr></thead><tbody className="divide-y divide-gray-100">{visibleFiles.map(file => <tr key={file.fileId} className="hover:bg-gray-50/80"><td className="px-5 py-4"><input type="checkbox" checked={selectedIds.includes(file.fileId)} onChange={() => toggleSelected(file.fileId)} aria-label={`选择 ${file.name}`} /></td><td className="px-3 py-4"><div className="flex items-center gap-3 min-w-[230px]"><span className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><FileText size={17} /></span><div className="min-w-0"><p className="font-medium truncate max-w-[260px]">{file.name}</p><p className="text-[11px] text-gray-400 mt-0.5">ID: {file.fileId}</p></div></div></td><td className="px-3 py-4"><p className="font-medium">{file.ownerName}</p><p className="text-xs text-gray-400 mt-0.5">UID {file.ownerUserId}</p></td><td className="px-3 py-4"><p>{sourceLabels[file.source]}</p><p className="text-xs text-gray-400 mt-0.5">{file.folderName || '根目录'}</p></td><td className="px-3 py-4 whitespace-nowrap">{formatBytes(file.sizeBytes)}</td><td className="px-3 py-4"><StatusBadge status={file.status} /></td><td className="px-3 py-4 whitespace-nowrap text-gray-500">{formatDateTime(file.updatedAt)}</td><td className="px-5 py-4"><div className="flex justify-end gap-1"><button type="button" onClick={() => setDetailId(file.fileId)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-blue-600" title="查看元数据"><Eye size={16} /></button><button type="button" onClick={() => file.status === 'frozen' ? unfreezeFile(file.fileId) && notify('文件已解冻') : (setFreezeIds([file.fileId]), setFreezeReason(''))} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-orange-600" title={file.status === 'frozen' ? '解冻文件' : '冻结文件'}>{file.status === 'frozen' ? <Unlock size={16} /> : <MoreHorizontal size={16} />}</button></div></td></tr>)}</tbody></table>{visibleFiles.length === 0 && <div className="py-16 text-center"><FileText className="mx-auto text-gray-300" size={32} /><p className="mt-3 text-sm font-medium text-gray-600">没有匹配的文件</p><p className="mt-1 text-xs text-gray-400">请调整搜索条件或筛选器</p></div>}</div><div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between"><span className="text-xs text-gray-500">已加载 {filteredFiles.length} 条元数据记录</span><div className="flex items-center gap-2"><button type="button" disabled={page <= 1} onClick={() => setPage(value => value - 1)} className="h-8 px-3 rounded-lg border border-gray-200 text-sm disabled:opacity-40">上一页</button><button type="button" disabled={page >= pageCount} onClick={() => setPage(value => value + 1)} className="h-8 px-3 rounded-lg border border-gray-200 text-sm disabled:opacity-40">下一页</button></div></div></div>
      </div>

      {detailFile && <div className="absolute inset-0 z-50"><button type="button" className="absolute inset-0 bg-black/30" aria-label="关闭抽屉" onClick={() => setDetailId(null)} /><aside className="absolute right-0 top-0 h-full w-full max-w-[440px] bg-white shadow-2xl overflow-y-auto"><div className="px-6 py-5 border-b border-gray-200 flex items-start justify-between"><div><p className="text-xs text-blue-600 font-medium">文件元数据</p><h2 className="text-lg font-bold mt-1 break-words pr-3">{detailFile.name}</h2></div><button type="button" onClick={() => setDetailId(null)} className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100"><X size={19} /></button></div><div className="p-6 space-y-6"><div className="rounded-xl border border-blue-100 bg-blue-50 p-4"><div className="flex items-center gap-3"><FileText className="text-blue-600" /><div><p className="text-sm font-semibold text-blue-900">后台仅处理元数据</p><p className="text-xs text-blue-700 mt-1">不提供正文预览、下载或对象存储访问。</p></div></div></div><dl className="divide-y divide-gray-100">{[['文件 ID', detailFile.fileId], ['文件类型', categoryLabels[detailFile.category]], ['文件大小', formatBytes(detailFile.sizeBytes)], ['所属用户', `${detailFile.ownerName}（${detailFile.ownerUserId}）`], ['来源', sourceLabels[detailFile.source]], ['所属文件夹', detailFile.folderName || '根目录'], ['更新时间', formatDateTime(detailFile.updatedAt)], ['当前状态', detailFile.status === 'frozen' ? `冻结 · ${detailFile.frozenReason || '未填写'}` : '正常']].map(([label, value]) => <div key={label} className="py-3 flex justify-between gap-4 text-sm"><dt className="text-gray-500 shrink-0">{label}</dt><dd className="text-right font-medium break-all">{value}</dd></div>)}</dl>{detailFile.status === 'frozen' ? <button type="button" onClick={() => { unfreezeFile(detailFile.fileId); setDetailId(null); notify('文件已解冻') }} className="w-full h-11 rounded-xl border border-emerald-200 text-emerald-700 font-medium">解冻文件</button> : <button type="button" onClick={() => { setFreezeIds([detailFile.fileId]); setFreezeReason(''); setDetailId(null) }} className="w-full h-11 rounded-xl border border-orange-200 text-orange-700 font-medium">冻结文件</button>}</div></aside></div>}
      {freezeIds.length > 0 && <div className="absolute inset-0 z-[60] flex items-center justify-center p-4"><button type="button" className="absolute inset-0 bg-black/35" aria-label="关闭冻结弹窗" onClick={() => setFreezeIds([])} /><div className="relative w-full max-w-[440px] rounded-2xl bg-white shadow-2xl p-6"><div className="flex items-start gap-3"><span className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center"><Lock size={19} /></span><div><h2 className="font-bold">冻结 {freezeIds.length} 个文件</h2><p className="text-sm text-gray-500 mt-1">冻结后用户端和 Picker 不再显示，容量仍会计入。</p></div></div><label className="block text-sm font-medium mt-5">冻结原因 <span className="text-red-500">*</span><textarea value={freezeReason} onChange={event => setFreezeReason(event.target.value)} rows={4} placeholder="请填写审核、合规或运营原因" className="mt-2 w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" /></label><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setFreezeIds([])} className="h-10 px-4 rounded-lg text-sm text-gray-600 hover:bg-gray-100">取消</button><button type="button" disabled={!freezeReason.trim()} onClick={submitFreeze} className="h-10 px-4 rounded-lg bg-orange-600 text-white text-sm font-medium disabled:opacity-40">确认冻结</button></div></div></div>}
      {deleteIds.length > 0 && <div className="absolute inset-0 z-[60] flex items-center justify-center p-4"><button type="button" className="absolute inset-0 bg-black/35" aria-label="关闭删除弹窗" onClick={() => setDeleteIds([])} /><div className="relative w-full max-w-[440px] rounded-2xl bg-white shadow-2xl p-6"><div className="flex items-start gap-3"><span className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center"><Trash2 size={19} /></span><div><h2 className="font-bold">永久删除文件？</h2><p className="text-sm text-gray-500 mt-1">将立即硬删除 {deleteIds.length} 个文件并释放 {formatBytes(deleteTargets.reduce((sum, file) => sum + file.sizeBytes, 0))}。此操作不可恢复。</p></div></div><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setDeleteIds([])} className="h-10 px-4 rounded-lg text-sm text-gray-600 hover:bg-gray-100">取消</button><button type="button" onClick={submitDelete} className="h-10 px-4 rounded-lg bg-red-600 text-white text-sm font-medium">永久删除</button></div></div></div>}
      {toast && <div role="status" className="absolute bottom-6 right-6 z-[80] rounded-xl bg-gray-900 px-4 py-3 text-sm text-white shadow-xl">{toast}</div>}
    </AdminCloudDriveShell>
  )
}

export default CloudDriveFilesPage
