/**
 * @name 用户存储配额
 * @description Global and per-user cloud storage quota controls
 */

import { useMemo, useState } from 'react'
import { Check, HardDrive, RotateCcw, Search, Settings2, Users, X } from 'lucide-react'
import '../../themes/equatorial-minimalism/globals.css'
import { AdminCloudDriveShell, formatBytes, useAdminCloudDrive, UsageBar } from '../superim-admin-cloud-drive/shared'
import './style.css'

const bytesToGb = (bytes: number) => (bytes / (1024 ** 3)).toFixed(1)
const gbToBytes = (gb: number) => Math.round(gb * 1024 ** 3)

const CloudDriveQuotasPage = () => {
  const { defaultQuotaBytes, userQuotas, updateDefaultQuota, updateUserQuota } = useAdminCloudDrive()
  const [globalGb, setGlobalGb] = useState(bytesToGb(defaultQuotaBytes))
  const [query, setQuery] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [overrideGb, setOverrideGb] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const selectedUser = userQuotas.find(user => user.userId === userId)
  const filteredUsers = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return userQuotas.filter(user => !normalized || user.userName.toLowerCase().includes(normalized) || user.userId.includes(normalized))
  }, [query, userQuotas])

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(null), 2400) }
  const saveGlobal = () => {
    const result = updateDefaultQuota(gbToBytes(Number(globalGb)))
    if (!result.ok) { setError(result.error || '默认配额保存失败'); return }
    setError(null); notify('全局默认配额已更新')
  }
  const openUser = (user: typeof userQuotas[number]) => { setUserId(user.userId); setOverrideGb(user.overrideQuotaBytes === undefined ? '' : bytesToGb(user.overrideQuotaBytes)); setError(null) }
  const saveUser = () => {
    if (!selectedUser) return
    const result = updateUserQuota(selectedUser.userId, overrideGb.trim() ? gbToBytes(Number(overrideGb)) : null)
    if (!result.ok) { setError(result.error || '配额保存失败'); return }
    setError(null); setUserId(null); notify('用户配额已更新')
  }
  const clearUser = () => {
    if (!selectedUser) return
    const result = updateUserQuota(selectedUser.userId, null)
    if (!result.ok) { setError(result.error || '覆盖清除失败'); return }
    setUserId(null); notify('已恢复使用全局默认配额')
  }

  return (
    <AdminCloudDriveShell title="用户存储配额" description="管理全局默认配额和单用户覆盖值">
      <div className="space-y-5">
        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,1fr)] gap-5">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"><div className="flex items-start gap-3"><span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><HardDrive size={19} /></span><div><h2 className="font-semibold">全局默认配额</h2><p className="text-xs text-gray-500 mt-1">没有单用户覆盖时，用户使用此容量。</p></div></div><div className="mt-5 flex flex-wrap items-end gap-3"><label className="flex-1 min-w-[210px]"><span className="text-sm font-medium">默认容量</span><div className="relative mt-2"><input type="number" min="0.1" step="0.1" value={globalGb} onChange={event => setGlobalGb(event.target.value)} className="w-full h-11 rounded-xl border border-gray-200 px-3 pr-12 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">GB</span></div></label><button type="button" onClick={saveGlobal} className="h-11 px-5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">保存默认配额</button></div>{error && !selectedUser && <p className="mt-3 text-sm text-red-600">{error}</p>}<p className="mt-4 text-xs text-gray-400">规则：默认值初始为 10 GB；不能低于当前无覆盖用户的已用空间。</p></div>
          <div className="bg-gray-900 text-white rounded-2xl p-5 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-300">当前默认配额</p><p className="text-3xl font-bold mt-2">{formatBytes(defaultQuotaBytes)}</p></div><Settings2 className="text-blue-300" size={23} /></div><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-white/10 p-3"><p className="text-xs text-gray-300">用户数量</p><p className="text-lg font-semibold mt-1">{userQuotas.length}</p></div><div className="rounded-xl bg-white/10 p-3"><p className="text-xs text-gray-300">覆盖用户</p><p className="text-lg font-semibold mt-1">{userQuotas.filter(user => user.overrideQuotaBytes !== undefined).length}</p></div></div></div>
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"><div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3"><div><h2 className="font-semibold">用户配额明细</h2><p className="text-xs text-gray-500 mt-1">已用空间包含正常和冻结文件</p></div><div className="relative ml-auto w-full sm:w-64"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索用户或 ID" className="w-full h-9 rounded-lg border border-gray-200 pl-9 pr-3 text-sm outline-none focus:border-blue-500" /></div></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-gray-50 text-xs text-gray-500"><tr><th className="px-5 py-3 font-medium">用户</th><th className="px-3 py-3 font-medium">有效配额</th><th className="px-3 py-3 font-medium min-w-[220px]">已用空间</th><th className="px-3 py-3 font-medium">文件数</th><th className="px-3 py-3 font-medium">最近上传</th><th className="px-5 py-3 text-right font-medium">操作</th></tr></thead><tbody className="divide-y divide-gray-100">{filteredUsers.map(user => { const effective = user.overrideQuotaBytes ?? user.defaultQuotaBytes; return <tr key={user.userId} className="hover:bg-gray-50/80"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">{user.userName.slice(0, 1)}</span><div><p className="font-medium">{user.userName}</p><p className="text-xs text-gray-400 mt-0.5">UID {user.userId}</p></div></div></td><td className="px-3 py-4"><p className="font-medium">{formatBytes(effective)}</p>{user.overrideQuotaBytes !== undefined && <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 mt-1"><Check size={12} />单用户覆盖</span>}</td><td className="px-3 py-4"><UsageBar used={user.usedBytes} total={effective} compact /></td><td className="px-3 py-4">{user.fileCount}</td><td className="px-3 py-4 text-gray-500">{user.lastUploadedAt ? new Date(user.lastUploadedAt).toLocaleDateString('zh-CN') : '—'}</td><td className="px-5 py-4 text-right"><button type="button" onClick={() => openUser(user)} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-gray-200 text-sm text-gray-700 hover:border-blue-300 hover:text-blue-600"><Settings2 size={14} />调整配额</button></td></tr> })}</tbody></table>{filteredUsers.length === 0 && <div className="py-14 text-center text-sm text-gray-500"><Users className="mx-auto text-gray-300" size={30} /><p className="mt-3">没有匹配用户</p></div>}</div></section>
      </div>

      {selectedUser && <div className="absolute inset-0 z-50 flex items-center justify-center p-4"><button type="button" className="absolute inset-0 bg-black/35" aria-label="关闭配额弹窗" onClick={() => setUserId(null)} /><div className="relative w-full max-w-[440px] rounded-2xl bg-white shadow-2xl p-6"><div className="flex items-start justify-between"><div><p className="text-xs text-blue-600 font-medium">单用户配额</p><h2 className="text-lg font-bold mt-1">{selectedUser.userName}</h2><p className="text-xs text-gray-400 mt-1">UID {selectedUser.userId} · 当前已用 {formatBytes(selectedUser.usedBytes)}</p></div><button type="button" onClick={() => setUserId(null)} className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100"><X size={18} /></button></div><label className="block mt-6"><span className="text-sm font-medium">覆盖配额</span><span className="text-xs text-gray-500 ml-2">留空则恢复全局默认</span><div className="relative mt-2"><input type="number" min={bytesToGb(selectedUser.usedBytes)} step="0.1" value={overrideGb} onChange={event => setOverrideGb(event.target.value)} placeholder={bytesToGb(selectedUser.defaultQuotaBytes)} className="w-full h-11 rounded-xl border border-gray-200 px-3 pr-12 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">GB</span></div></label><div className="mt-3 rounded-xl bg-gray-50 p-3 text-xs text-gray-500">最小可设置为 {formatBytes(selectedUser.usedBytes)}，修改结果会写入操作审计。</div>{error && <p className="mt-3 text-sm text-red-600">{error}</p>}<div className="mt-6 flex flex-wrap justify-between gap-2"><button type="button" onClick={clearUser} className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg text-sm text-gray-600 hover:bg-gray-100"><RotateCcw size={14} />清除覆盖</button><div className="flex gap-2"><button type="button" onClick={() => setUserId(null)} className="h-10 px-4 rounded-lg text-sm text-gray-600 hover:bg-gray-100">取消</button><button type="button" onClick={saveUser} className="h-10 px-4 rounded-lg bg-blue-600 text-white text-sm font-medium">保存</button></div></div></div></div>}
      {toast && <div role="status" className="absolute bottom-6 right-6 z-[80] rounded-xl bg-gray-900 px-4 py-3 text-sm text-white shadow-xl">{toast}</div>}
    </AdminCloudDriveShell>
  )
}

export default CloudDriveQuotasPage
