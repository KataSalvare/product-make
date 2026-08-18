/* eslint-disable react-refresh/only-export-components */
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { AlertTriangle, CheckCircle2, HardDrive, ShieldAlert, XCircle } from 'lucide-react'
import AdminSidebar from '../../components/AdminSidebar'
import {
  CLOUD_DRIVE_EVENT,
  TEN_GB,
  CLOUD_DRIVE_STORAGE_KEY,
  formatBytes,
  getUsedBytes,
  loadCloudDriveState,
  saveCloudDriveState,
  type CloudFileCategory,
  type CloudFileSource,
  type CloudDriveState,
} from '../superim-cloud-drive/store'

export type AdminCloudFileStatus = 'active' | 'frozen'
export type AdminCloudAuditAction = 'quota.update' | 'file.freeze' | 'file.unfreeze' | 'file.delete'

export interface AdminCloudDriveSummary {
  totalStorageBytes: number
  usedStorageBytes: number
  userCount: number
  fileCount: number
  frozenFileCount: number
  uploadCount: number
  deleteCount: number
}

export interface AdminCloudFileRecord {
  fileId: string
  name: string
  category: CloudFileCategory
  sizeBytes: number
  ownerUserId: string
  ownerName: string
  source: CloudFileSource
  folderName: string | null
  status: AdminCloudFileStatus
  updatedAt: string
  frozenAt?: string
  frozenReason?: string
}

export interface AdminCloudUserQuota {
  userId: string
  userName: string
  defaultQuotaBytes: number
  overrideQuotaBytes?: number
  usedBytes: number
  fileCount: number
  lastUploadedAt?: string
  status: 'active' | 'frozen'
}

export interface AdminCloudDriveAuditRecord {
  id: string
  action: AdminCloudAuditAction
  operatorName: string
  targetId: string
  targetName: string
  reason: string
  before?: string
  after?: string
  result: 'success' | 'failed'
  createdAt: string
}

interface AdminCloudDriveState {
  defaultQuotaBytes: number
  userOverrides: Record<string, number>
  auditRecords: AdminCloudDriveAuditRecord[]
}

interface OwnerFixture {
  userId: string
  userName: string
}

const OWNER_FIXTURES: Record<string, OwnerFixture> = {
  'brand-film': { userId: '10001', userName: 'Amina Yusuf' },
  'research-assets': { userId: '10002', userName: 'Chen Wei' },
  'lagos-photos': { userId: '10003', userName: 'Alex Wang' },
  'voice-interviews': { userId: '10004', userName: 'Priya Singh' },
  'design-system': { userId: '10002', userName: 'Chen Wei' },
  'trip-plan': { userId: '10005', userName: 'Tom Brown' },
  budget: { userId: '10001', userName: 'Amina Yusuf' },
  'passport-copy': { userId: '10003', userName: 'Alex Wang' },
}

const OWNER_FALLBACK = { userId: '10001', userName: 'Amina Yusuf' }
const ADMIN_CLOUD_DRIVE_STORAGE_KEY = 'superim-admin-cloud-drive-state-v1'
const ADMIN_CLOUD_DRIVE_EVENT = 'superim-admin-cloud-drive-change'

const seededAudits: AdminCloudDriveAuditRecord[] = [
  {
    id: 'audit-seed-failed-freeze',
    action: 'file.freeze',
    operatorName: 'Mina Patel',
    targetId: 'lagos-photos',
    targetName: 'Lagos photo collection.jpg',
    reason: 'Ownership review was incomplete',
    result: 'failed',
    createdAt: '2026-08-09T15:20:00.000Z',
  },
  {
    id: 'audit-seed-quota',
    action: 'quota.update',
    operatorName: 'Mina Patel',
    targetId: '10002',
    targetName: 'Chen Wei',
    reason: 'Temporary research allocation',
    before: '10 GB',
    after: '25 GB',
    result: 'success',
    createdAt: '2026-08-08T11:05:00.000Z',
  },
]

const initialAdminState: AdminCloudDriveState = {
  defaultQuotaBytes: TEN_GB,
  userOverrides: {},
  auditRecords: seededAudits,
}

const isAdminState = (value: unknown): value is AdminCloudDriveState => {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<AdminCloudDriveState>
  return typeof candidate.defaultQuotaBytes === 'number'
    && !!candidate.userOverrides && typeof candidate.userOverrides === 'object'
    && Array.isArray(candidate.auditRecords)
}

const cloneAdminState = (): AdminCloudDriveState => JSON.parse(JSON.stringify(initialAdminState)) as AdminCloudDriveState

const loadAdminState = (): AdminCloudDriveState => {
  if (typeof window === 'undefined') return cloneAdminState()
  try {
    const saved = window.localStorage.getItem(ADMIN_CLOUD_DRIVE_STORAGE_KEY)
    if (!saved) return cloneAdminState()
    const parsed: unknown = JSON.parse(saved)
    return isAdminState(parsed) ? parsed : cloneAdminState()
  } catch {
    return cloneAdminState()
  }
}

const saveAdminState = (state: AdminCloudDriveState) => {
  window.localStorage.setItem(ADMIN_CLOUD_DRIVE_STORAGE_KEY, JSON.stringify(state))
  window.dispatchEvent(new CustomEvent<AdminCloudDriveState>(ADMIN_CLOUD_DRIVE_EVENT, { detail: state }))
}

const makeAuditId = () => `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

export const categoryLabels: Record<CloudFileCategory, string> = {
  image: '图片',
  video: '视频',
  audio: '音频',
  document: '文档',
  archive: '压缩包',
  other: '其他',
}

export const sourceLabels: Record<CloudFileSource, string> = {
  upload: '直接上传',
  chat: '聊天收存',
}

export const actionLabels: Record<AdminCloudAuditAction, string> = {
  'quota.update': '修改配额',
  'file.freeze': '冻结文件',
  'file.unfreeze': '解冻文件',
  'file.delete': '永久删除',
}

export const formatDateTime = (value?: string) => value
  ? new Date(value).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
  : '—'

const buildFileRecords = (cloudState: CloudDriveState): AdminCloudFileRecord[] => cloudState.files.map(file => {
  const owner = OWNER_FIXTURES[file.id] || OWNER_FALLBACK
  const folder = cloudState.folders.find(item => item.id === file.parentFolderId)
  return {
    fileId: file.id,
    name: file.name,
    category: file.category,
    sizeBytes: file.sizeBytes,
    ownerUserId: owner.userId,
    ownerName: owner.userName,
    source: file.source,
    folderName: folder?.name || null,
    status: file.status || 'active',
    updatedAt: file.updatedAt,
    frozenAt: file.frozenAt,
    frozenReason: file.frozenReason,
  }
})

const buildUserQuotas = (cloudState: CloudDriveState, adminState: AdminCloudDriveState): AdminCloudUserQuota[] => {
  const grouped = new Map<string, { userName: string; usedBytes: number; fileCount: number; lastUploadedAt?: string; frozenCount: number }>()
  buildFileRecords(cloudState).forEach(file => {
    const current = grouped.get(file.ownerUserId) || { userName: file.ownerName, usedBytes: 0, fileCount: 0, frozenCount: 0 }
    current.usedBytes += file.sizeBytes
    current.fileCount += 1
    if (file.status === 'frozen') current.frozenCount += 1
    if (!current.lastUploadedAt || new Date(file.updatedAt).getTime() > new Date(current.lastUploadedAt).getTime()) current.lastUploadedAt = file.updatedAt
    grouped.set(file.ownerUserId, current)
  })
  return Array.from(grouped.entries()).map(([userId, user]) => ({
    userId,
    userName: user.userName,
    defaultQuotaBytes: adminState.defaultQuotaBytes,
    overrideQuotaBytes: adminState.userOverrides[userId],
    usedBytes: user.usedBytes,
    fileCount: user.fileCount,
    lastUploadedAt: user.lastUploadedAt,
    status: (user.frozenCount === user.fileCount ? 'frozen' : 'active') as 'active' | 'frozen',
  })).sort((a, b) => b.usedBytes - a.usedBytes)
}

export const useAdminCloudDrive = () => {
  const [cloudState, setCloudState] = useState<CloudDriveState>(loadCloudDriveState)
  const [adminState, setAdminState] = useState<AdminCloudDriveState>(loadAdminState)

  useEffect(() => {
    const syncCloud = (event?: Event) => {
      const detail = (event as CustomEvent<CloudDriveState> | undefined)?.detail
      setCloudState(detail || loadCloudDriveState())
    }
    const syncAdmin = (event?: Event) => {
      const detail = (event as CustomEvent<AdminCloudDriveState> | undefined)?.detail
      setAdminState(detail || loadAdminState())
    }
    window.addEventListener(CLOUD_DRIVE_EVENT, syncCloud)
    window.addEventListener(ADMIN_CLOUD_DRIVE_EVENT, syncAdmin)
    window.addEventListener('storage', () => { syncCloud(); syncAdmin() })
    return () => {
      window.removeEventListener(CLOUD_DRIVE_EVENT, syncCloud)
      window.removeEventListener(ADMIN_CLOUD_DRIVE_EVENT, syncAdmin)
    }
  }, [])

  const fileRecords = useMemo(() => buildFileRecords(cloudState), [cloudState])
  const userQuotas = useMemo(() => buildUserQuotas(cloudState, adminState), [adminState, cloudState])
  const summary = useMemo<AdminCloudDriveSummary>(() => ({
    totalStorageBytes: adminState.defaultQuotaBytes * Math.max(userQuotas.length, 1),
    usedStorageBytes: getUsedBytes(cloudState),
    userCount: userQuotas.length,
    fileCount: fileRecords.length,
    frozenFileCount: fileRecords.filter(file => file.status === 'frozen').length,
    uploadCount: fileRecords.filter(file => file.source === 'upload').length,
    deleteCount: adminState.auditRecords.filter(record => record.action === 'file.delete' && record.result === 'success').length,
  }), [adminState, cloudState, fileRecords, userQuotas.length])

  const addAudit = (record: Omit<AdminCloudDriveAuditRecord, 'id' | 'operatorName' | 'createdAt'>) => {
    const current = loadAdminState()
    const next: AdminCloudDriveState = {
      ...current,
      auditRecords: [{ ...record, id: makeAuditId(), operatorName: '当前管理员', createdAt: new Date().toISOString() }, ...current.auditRecords],
    }
    saveAdminState(next)
    setAdminState(next)
  }

  const freezeFile = (fileId: string, reason: string) => {
    const target = fileRecords.find(file => file.fileId === fileId)
    if (!target) return { ok: false, error: '文件不存在' }
    if (!reason.trim()) return { ok: false, error: '请输入冻结原因' }
    const nextState = loadCloudDriveState()
    saveCloudDriveState({
      ...nextState,
      files: nextState.files.map(file => file.id === fileId ? { ...file, status: 'frozen' as const, frozenAt: new Date().toISOString(), frozenReason: reason.trim() } : file),
    })
    addAudit({ action: 'file.freeze', targetId: fileId, targetName: target.name, reason: reason.trim(), before: '正常', after: '冻结', result: 'success' })
    return { ok: true }
  }

  const unfreezeFile = (fileId: string) => {
    const target = fileRecords.find(file => file.fileId === fileId)
    if (!target) return { ok: false, error: '文件不存在' }
    const nextState = loadCloudDriveState()
    saveCloudDriveState({ ...nextState, files: nextState.files.map(file => file.id === fileId ? { ...file, status: 'active' as const, frozenAt: undefined, frozenReason: undefined } : file) })
    addAudit({ action: 'file.unfreeze', targetId: fileId, targetName: target.name, reason: '恢复文件可见性', before: '冻结', after: '正常', result: 'success' })
    return { ok: true }
  }

  const deleteFiles = (fileIds: string[]) => {
    const targets = fileRecords.filter(file => fileIds.includes(file.fileId))
    if (!targets.length) return { ok: false, error: '未找到可删除文件' }
    const nextState = loadCloudDriveState()
    saveCloudDriveState({ ...nextState, files: nextState.files.filter(file => !fileIds.includes(file.id)) })
    targets.forEach(target => addAudit({ action: 'file.delete', targetId: target.fileId, targetName: target.name, reason: '管理员永久删除', before: formatBytes(target.sizeBytes), after: '已释放', result: 'success' }))
    return { ok: true }
  }

  const updateDefaultQuota = (bytes: number) => {
    const maxUsed = userQuotas.filter(user => user.overrideQuotaBytes === undefined).reduce((max, user) => Math.max(max, user.usedBytes), 0)
    if (!Number.isFinite(bytes) || bytes < maxUsed) return { ok: false, error: `默认配额不能低于 ${formatBytes(maxUsed)}` }
    const before = formatBytes(adminState.defaultQuotaBytes)
    const next = { ...adminState, defaultQuotaBytes: bytes }
    saveAdminState(next)
    setAdminState(next)
    addAudit({ action: 'quota.update', targetId: 'global', targetName: '全局默认配额', reason: '更新云盘默认配额', before, after: formatBytes(bytes), result: 'success' })
    return { ok: true }
  }

  const updateUserQuota = (userId: string, bytes: number | null) => {
    const user = userQuotas.find(item => item.userId === userId)
    if (!user) return { ok: false, error: '用户不存在' }
    if (bytes !== null && (!Number.isFinite(bytes) || bytes < user.usedBytes)) return { ok: false, error: `配额不能低于已用空间 ${formatBytes(user.usedBytes)}` }
    const before = formatBytes(user.overrideQuotaBytes ?? user.defaultQuotaBytes)
    const nextOverrides = { ...adminState.userOverrides }
    if (bytes === null) delete nextOverrides[userId]
    else nextOverrides[userId] = bytes
    const next = { ...adminState, userOverrides: nextOverrides }
    saveAdminState(next)
    setAdminState(next)
    addAudit({ action: 'quota.update', targetId: userId, targetName: user.userName, reason: bytes === null ? '清除单用户覆盖' : '更新单用户配额', before, after: formatBytes(bytes ?? user.defaultQuotaBytes), result: 'success' })
    return { ok: true }
  }

  return {
    cloudState,
    fileRecords,
    userQuotas,
    auditRecords: adminState.auditRecords,
    defaultQuotaBytes: adminState.defaultQuotaBytes,
    summary,
    freezeFile,
    unfreezeFile,
    deleteFiles,
    updateDefaultQuota,
    updateUserQuota,
  }
}

export const AdminCloudDriveShell = ({ title, description, children, actions }: { title: string; description: string; children: ReactNode; actions?: ReactNode }) => (
  <div className="relative min-h-screen bg-gray-50 text-gray-900">
    <header className="h-[73px] bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center"><HardDrive size={21} /></div><div><p className="font-bold leading-tight">SuperIM Admin</p><p className="text-xs text-gray-500">云盘运营工作台</p></div></div>
      <div className="flex items-center gap-3"><span className="hidden sm:inline text-sm text-gray-500">当前管理员</span><span className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">A</span></div>
    </header>
    <div className="flex min-h-[calc(100vh-73px)]"><AdminSidebar /><main className="flex-1 min-w-0 p-6"><div className="max-w-[1440px] mx-auto"><div className="flex flex-wrap items-start justify-between gap-4 mb-6"><div><p className="text-sm font-medium text-blue-600">云盘管理</p><h1 className="text-2xl font-bold tracking-tight mt-1">{title}</h1><p className="text-sm text-gray-500 mt-1">{description}</p></div>{actions && <div className="flex items-center gap-2">{actions}</div>}</div>{children}</div></main></div>
  </div>
)

export const MetricCard = ({ label, value, helper, icon: Icon, tone = 'blue' }: { label: string; value: string; helper: string; icon: typeof HardDrive; tone?: 'blue' | 'orange' | 'red' | 'green' }) => {
  const tones = { blue: 'bg-blue-50 text-blue-700', orange: 'bg-orange-50 text-orange-700', red: 'bg-red-50 text-red-700', green: 'bg-emerald-50 text-emerald-700' }
  return <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-sm text-gray-500">{label}</p><p className="text-2xl font-bold mt-2 tracking-tight">{value}</p></div><span className={`w-10 h-10 rounded-xl flex items-center justify-center ${tones[tone]}`}><Icon size={19} /></span></div><p className="text-xs text-gray-500 mt-4">{helper}</p></div>
}

export const StatusBadge = ({ status }: { status: AdminCloudFileStatus | 'success' | 'failed' | 'active' }) => {
  if (status === 'frozen') return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700"><ShieldAlert size={13} />冻结</span>
  if (status === 'failed') return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700"><XCircle size={13} />失败</span>
  if (status === 'success') return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700"><CheckCircle2 size={13} />成功</span>
  return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700"><CheckCircle2 size={13} />正常</span>
}

export const UsageBar = ({ used, total, compact = false }: { used: number; total: number; compact?: boolean }) => {
  const percent = total > 0 ? Math.min(100, (used / total) * 100) : 0
  return <div><div className="flex items-center justify-between gap-3 text-xs text-gray-500"><span>{formatBytes(used)} / {formatBytes(total)}</span><span>{percent.toFixed(0)}%</span></div><div className={`${compact ? 'h-1.5 mt-1' : 'h-2 mt-2'} rounded-full bg-gray-100 overflow-hidden`}><div className={`h-full rounded-full ${percent >= 90 ? 'bg-red-500' : percent >= 80 ? 'bg-orange-500' : 'bg-blue-600'}`} style={{ width: `${percent}%` }} /></div></div>
}

export const WarningBanner = ({ message, tone = 'orange' }: { message: string; tone?: 'orange' | 'red' }) => <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${tone === 'red' ? 'border-red-200 bg-red-50 text-red-800' : 'border-orange-200 bg-orange-50 text-orange-800'}`}><AlertTriangle size={18} className="mt-0.5 shrink-0" /><span>{message}</span></div>

export { CLOUD_DRIVE_STORAGE_KEY, formatBytes }
