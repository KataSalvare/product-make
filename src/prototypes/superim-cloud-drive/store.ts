import { useCallback, useEffect, useMemo, useState } from 'react'

export type CloudFileCategory = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other'
export type CloudFileSource = 'upload' | 'chat'
export type CloudFileStatus = 'active' | 'frozen'

export interface CloudFile {
  id: string
  name: string
  category: CloudFileCategory
  mimeType: string
  sizeBytes: number
  parentFolderId: string | null
  source: CloudFileSource
  sourceMessageId?: string
  sourceChat?: string
  previewUrl?: string
  status?: CloudFileStatus
  frozenAt?: string
  frozenReason?: string
  createdAt: string
  updatedAt: string
}

export interface CloudFolder {
  id: string
  name: string
  createdAt: string
}

export interface CloudDriveState {
  files: CloudFile[]
  folders: CloudFolder[]
  totalBytes: number
}

export const CLOUD_DRIVE_STORAGE_KEY = 'superim-cloud-drive-state-v1'
export const CLOUD_DRIVE_EVENT = 'superim-cloud-drive-change'
export const TEN_GB = 10 * 1024 * 1024 * 1024

const seedFolders: CloudFolder[] = [
  { id: 'work', name: 'Work', createdAt: '2026-06-05T09:00:00.000Z' },
  { id: 'personal', name: 'Personal', createdAt: '2026-06-12T09:00:00.000Z' },
  { id: 'travel', name: 'Travel', createdAt: '2026-07-01T09:00:00.000Z' },
]

const seedFiles: CloudFile[] = [
  {
    id: 'brand-film', name: 'SuperIM brand film.mp4', category: 'video', mimeType: 'video/mp4',
    sizeBytes: 1556925645, parentFolderId: 'work', source: 'upload',
    previewUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=960&h=640&fit=crop',
    createdAt: '2026-07-20T08:30:00.000Z', updatedAt: '2026-08-08T10:20:00.000Z',
  },
  {
    id: 'research-assets', name: 'Research assets.zip', category: 'archive', mimeType: 'application/zip',
    sizeBytes: 964689920, parentFolderId: 'work', source: 'upload',
    createdAt: '2026-07-18T08:30:00.000Z', updatedAt: '2026-08-07T09:15:00.000Z',
  },
  {
    id: 'lagos-photos', name: 'Lagos photo collection.jpg', category: 'image', mimeType: 'image/jpeg',
    sizeBytes: 503316480, parentFolderId: 'travel', source: 'chat', sourceMessageId: 'seed-travel-photo', sourceChat: 'Design Team',
    previewUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=960&h=640&fit=crop',
    createdAt: '2026-07-14T08:30:00.000Z', updatedAt: '2026-08-05T16:45:00.000Z',
  },
  {
    id: 'voice-interviews', name: 'User interviews.m4a', category: 'audio', mimeType: 'audio/mp4',
    sizeBytes: 220200960, parentFolderId: 'work', source: 'upload',
    createdAt: '2026-07-10T08:30:00.000Z', updatedAt: '2026-08-04T11:10:00.000Z',
  },
  {
    id: 'design-system', name: 'Design system v1.2.pdf', category: 'document', mimeType: 'application/pdf',
    sizeBytes: 95420416, parentFolderId: 'work', source: 'chat', sourceMessageId: 'seed-design-pdf', sourceChat: 'Amara Okafor',
    createdAt: '2026-07-22T08:30:00.000Z', updatedAt: '2026-08-03T14:30:00.000Z',
  },
  {
    id: 'trip-plan', name: 'Cape Town trip plan.pdf', category: 'document', mimeType: 'application/pdf',
    sizeBytes: 35651584, parentFolderId: 'travel', source: 'upload',
    createdAt: '2026-07-08T08:30:00.000Z', updatedAt: '2026-08-01T10:00:00.000Z',
  },
  {
    id: 'budget', name: 'Q3 product budget.xlsx', category: 'document', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    sizeBytes: 13002342, parentFolderId: 'work', source: 'upload',
    createdAt: '2026-07-02T08:30:00.000Z', updatedAt: '2026-07-30T08:40:00.000Z',
  },
  {
    id: 'passport-copy', name: 'Passport copy.pdf', category: 'document', mimeType: 'application/pdf',
    sizeBytes: 2726298, parentFolderId: 'personal', source: 'upload',
    createdAt: '2026-06-28T08:30:00.000Z', updatedAt: '2026-07-28T12:10:00.000Z',
  },
]

export const initialCloudDriveState: CloudDriveState = {
  files: seedFiles,
  folders: seedFolders,
  totalBytes: TEN_GB,
}

const cloneInitialState = (): CloudDriveState => JSON.parse(JSON.stringify(initialCloudDriveState)) as CloudDriveState

export const getUsedBytes = (state: CloudDriveState) => state.files.reduce((sum, file) => sum + file.sizeBytes, 0)

export const formatBytes = (bytes: number): string => {
  if (bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** unitIndex
  return `${value >= 10 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`
}

export const categoryForFile = (file: Pick<File, 'name' | 'type'>): CloudFileCategory => {
  const mime = file.type.toLowerCase()
  const extension = file.name.split('.').pop()?.toLowerCase() || ''
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('video/')) return 'video'
  if (mime.startsWith('audio/')) return 'audio'
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) return 'archive'
  if (mime.includes('pdf') || mime.includes('document') || mime.includes('sheet') || mime.includes('presentation') || ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].includes(extension)) return 'document'
  return 'other'
}

const isState = (value: unknown): value is CloudDriveState => {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<CloudDriveState>
  return Array.isArray(candidate.files) && Array.isArray(candidate.folders) && typeof candidate.totalBytes === 'number'
}

export const loadCloudDriveState = (): CloudDriveState => {
  if (typeof window === 'undefined') return cloneInitialState()
  try {
    const saved = window.localStorage.getItem(CLOUD_DRIVE_STORAGE_KEY)
    if (!saved) return cloneInitialState()
    const parsed: unknown = JSON.parse(saved)
    return isState(parsed) ? parsed : cloneInitialState()
  } catch {
    return cloneInitialState()
  }
}

export const saveCloudDriveState = (state: CloudDriveState) => {
  window.localStorage.setItem(CLOUD_DRIVE_STORAGE_KEY, JSON.stringify(state))
  window.dispatchEvent(new CustomEvent<CloudDriveState>(CLOUD_DRIVE_EVENT, { detail: state }))
}

const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

export interface SaveMessageFileInput {
  name: string
  sizeBytes?: number
  mimeType?: string
  sourceMessageId: string
  sourceChat: string
  previewUrl?: string
}

export interface CloudDriveActions {
  createFolder: (name: string) => CloudFolder | null
  addUploadedFiles: (files: File[], parentFolderId?: string | null) => { added: CloudFile[]; error?: string }
  saveMessageFile: (input: SaveMessageFileInput) => { file?: CloudFile; duplicate: boolean; error?: string }
  renameFile: (fileId: string, name: string) => void
  moveFiles: (fileIds: string[], folderId: string | null) => void
  deleteFiles: (fileIds: string[]) => void
  resetDrive: () => void
}

export const useCloudDrive = (): CloudDriveState & CloudDriveActions & { usedBytes: number; remainingBytes: number } => {
  const [state, setState] = useState<CloudDriveState>(loadCloudDriveState)

  useEffect(() => {
    const syncFromEvent = (event: Event) => {
      const customEvent = event as CustomEvent<CloudDriveState>
      setState(customEvent.detail || loadCloudDriveState())
    }
    const syncFromStorage = () => setState(loadCloudDriveState())
    window.addEventListener(CLOUD_DRIVE_EVENT, syncFromEvent)
    window.addEventListener('storage', syncFromStorage)
    return () => {
      window.removeEventListener(CLOUD_DRIVE_EVENT, syncFromEvent)
      window.removeEventListener('storage', syncFromStorage)
    }
  }, [])

  const update = useCallback((updater: (current: CloudDriveState) => CloudDriveState) => {
    const next = updater(loadCloudDriveState())
    saveCloudDriveState(next)
    setState(next)
    return next
  }, [])

  const createFolder = useCallback((rawName: string) => {
    const name = rawName.trim()
    const current = loadCloudDriveState()
    if (!name || name.length > 40 || current.folders.some(folder => folder.name.toLowerCase() === name.toLowerCase())) return null
    const folder: CloudFolder = { id: makeId('folder'), name, createdAt: new Date().toISOString() }
    update(current => ({ ...current, folders: [...current.folders, folder] }))
    return folder
  }, [update])

  const addUploadedFiles = useCallback((files: File[], parentFolderId: string | null = null) => {
    const current = loadCloudDriveState()
    const totalSize = files.reduce((sum, file) => sum + file.size, 0)
    if (getUsedBytes(current) + totalSize > current.totalBytes) {
      return { added: [], error: 'Not enough storage available' }
    }
    const now = new Date().toISOString()
    const added: CloudFile[] = files.map(file => ({
      id: makeId('file'),
      name: file.name,
      category: categoryForFile(file),
      mimeType: file.type || 'application/octet-stream',
      sizeBytes: file.size,
      parentFolderId,
      source: 'upload',
      createdAt: now,
      updatedAt: now,
    }))
    update(value => ({ ...value, files: [...added, ...value.files] }))
    return { added }
  }, [update])

  const saveMessageFile = useCallback((input: SaveMessageFileInput) => {
    const current = loadCloudDriveState()
    const existing = current.files.find(file => file.sourceMessageId === input.sourceMessageId)
    if (existing) return { file: existing, duplicate: true }
    const sizeBytes = input.sizeBytes ?? 2.4 * 1024 * 1024
    if (getUsedBytes(current) + sizeBytes > current.totalBytes) {
      return { duplicate: false, error: 'Not enough storage available' }
    }
    const now = new Date().toISOString()
    const descriptor = { name: input.name, type: input.mimeType || '' } as File
    const cloudFile: CloudFile = {
      id: makeId('chat-file'),
      name: input.name,
      category: categoryForFile(descriptor),
      mimeType: input.mimeType || 'application/octet-stream',
      sizeBytes,
      parentFolderId: null,
      source: 'chat',
      sourceMessageId: input.sourceMessageId,
      sourceChat: input.sourceChat,
      previewUrl: input.previewUrl,
      createdAt: now,
      updatedAt: now,
    }
    update(value => ({ ...value, files: [cloudFile, ...value.files] }))
    return { file: cloudFile, duplicate: false }
  }, [update])

  const renameFile = useCallback((fileId: string, name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    update(current => ({
      ...current,
      files: current.files.map(file => file.id === fileId ? { ...file, name: trimmed, updatedAt: new Date().toISOString() } : file),
    }))
  }, [update])

  const moveFiles = useCallback((fileIds: string[], folderId: string | null) => {
    const selected = new Set(fileIds)
    update(current => ({
      ...current,
      files: current.files.map(file => selected.has(file.id) ? { ...file, parentFolderId: folderId, updatedAt: new Date().toISOString() } : file),
    }))
  }, [update])

  const deleteFiles = useCallback((fileIds: string[]) => {
    const selected = new Set(fileIds)
    update(current => ({ ...current, files: current.files.filter(file => !selected.has(file.id)) }))
  }, [update])

  const resetDrive = useCallback(() => saveCloudDriveState(cloneInitialState()), [])
  const usedBytes = useMemo(() => getUsedBytes(state), [state])

  return {
    ...state,
    usedBytes,
    remainingBytes: Math.max(0, state.totalBytes - usedBytes),
    createFolder,
    addUploadedFiles,
    saveMessageFile,
    renameFile,
    moveFiles,
    deleteFiles,
    resetDrive,
  }
}
