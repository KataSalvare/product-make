/**
 * @name 云盘
 * @description Personal cloud drive home and chat file picker
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft, Check, ChevronRight, Cloud, FolderPlus, MoreHorizontal, Move,
  Plus, Search, Send, Trash2, Upload, X,
} from 'lucide-react'
import '../../themes/equatorial-minimalism/globals.css'
import './style.css'
import { BottomSheet, categoryMeta, ConfirmSheet, EmptyState, FileRow, FolderListItem } from './shared'
import { formatBytes, type CloudFileCategory, useCloudDrive } from './store'

const categoryOrder: CloudFileCategory[] = ['image', 'video', 'audio', 'document', 'other']

const CloudDrivePage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const drive = useCloudDrive()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadTimerRef = useRef<number | null>(null)
  const pendingFilesRef = useRef<File[]>([])
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<CloudFileCategory | 'all'>('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [selectionMode, setSelectionMode] = useState(false)
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [showMoreSheet, setShowMoreSheet] = useState(false)
  const [showFolderSheet, setShowFolderSheet] = useState(false)
  const [showMoveSheet, setShowMoveSheet] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [folderName, setFolderName] = useState('')
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [uploadName, setUploadName] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  const isPicker = searchParams.get('mode') === 'picker'
  const target = searchParams.get('target') === 'group-chat' ? 'group-chat' : 'chatroom'
  const isSelecting = isPicker || selectionMode
  const usedPercent = Math.min(100, (drive.usedBytes / drive.totalBytes) * 100)
  const visibleDriveFiles = useMemo(() => drive.files.filter(file => file.status !== 'frozen'), [drive.files])

  const sortedFiles = useMemo(
    () => [...visibleDriveFiles].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [visibleDriveFiles],
  )

  const filteredFiles = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return sortedFiles.filter(file => {
      const categoryMatches = activeCategory === 'all'
        || (activeCategory === 'other' ? file.category === 'archive' || file.category === 'other' : file.category === activeCategory)
      const queryMatches = !normalized || file.name.toLowerCase().includes(normalized) || file.sourceChat?.toLowerCase().includes(normalized)
      return categoryMatches && queryMatches
    })
  }, [activeCategory, query, sortedFiles])

  const filteredFolders = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return drive.folders.filter(folder => !normalized || folder.name.toLowerCase().includes(normalized))
  }, [drive.folders, query])

  const selectedFiles = useMemo(
    () => visibleDriveFiles.filter(file => selectedIds.includes(file.id)),
    [selectedIds, visibleDriveFiles],
  )

  useEffect(() => () => {
    if (uploadTimerRef.current !== null) window.clearInterval(uploadTimerRef.current)
  }, [])

  const showMessage = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2200)
  }

  const toggleFile = (fileId: string) => {
    if (!isSelecting) {
      navigate(`/cloud-drive/file/${fileId}`)
      return
    }
    setSelectedIds(current => current.includes(fileId) ? current.filter(id => id !== fileId) : [...current, fileId])
  }

  const enterSelectionMode = (fileId?: string) => {
    setSelectionMode(true)
    setSelectedIds(current => fileId
      ? current.includes(fileId) ? current : [...current, fileId]
      : [])
    setShowMoreSheet(false)
    if (fileId) showMessage('Selection mode on — choose more files or use a quick action below')
  }

  const openFolder = (folderId: string) => {
    const suffix = isPicker ? `?mode=picker&target=${target}` : ''
    navigate(`/cloud-drive/folder/${folderId}${suffix}`)
  }

  const createFolder = () => {
    const normalizedName = folderName.trim()
    if (normalizedName.length > 40) {
      showMessage('Folder name must be 40 characters or fewer')
      return
    }
    if (drive.folders.some(folder => folder.name.toLowerCase() === normalizedName.toLowerCase())) {
      showMessage('A folder with this name already exists')
      return
    }
    const folder = drive.createFolder(folderName)
    if (!folder) return
    setFolderName('')
    setShowFolderSheet(false)
    showMessage('Folder created')
  }

  const beginUpload = (fileList: FileList | null) => {
    if (!fileList?.length) return
    const files = Array.from(fileList)
    const totalSize = files.reduce((sum, file) => sum + file.size, 0)
    if (totalSize > drive.remainingBytes) {
      showMessage('Not enough storage available')
      return
    }
    pendingFilesRef.current = files
    setUploadName(files.length === 1 ? files[0].name : `${files.length} files`)
    setUploadProgress(0)
    setShowAddSheet(false)
    uploadTimerRef.current = window.setInterval(() => {
      setUploadProgress(current => {
        const next = Math.min(100, (current ?? 0) + 10)
        if (next === 100) {
          if (uploadTimerRef.current !== null) window.clearInterval(uploadTimerRef.current)
          uploadTimerRef.current = null
          const result = drive.addUploadedFiles(pendingFilesRef.current)
          pendingFilesRef.current = []
          window.setTimeout(() => setUploadProgress(null), 500)
          showMessage(result.error || `${result.added.length} ${result.added.length === 1 ? 'file' : 'files'} uploaded`)
        }
        return next
      })
    }, 110)
  }

  const cancelUpload = () => {
    if (uploadTimerRef.current !== null) window.clearInterval(uploadTimerRef.current)
    uploadTimerRef.current = null
    pendingFilesRef.current = []
    setUploadProgress(null)
    showMessage('Upload cancelled')
  }

  const moveSelected = (folderId: string | null) => {
    drive.moveFiles(selectedIds, folderId)
    setSelectedIds([])
    setSelectionMode(false)
    setShowMoveSheet(false)
    showMessage('Files moved')
  }

  const deleteSelected = () => {
    drive.deleteFiles(selectedIds)
    setSelectedIds([])
    setSelectionMode(false)
    setShowDeleteConfirm(false)
    showMessage('Files permanently deleted')
  }

  const sendSelected = () => {
    if (selectedIds.length === 0) return
    if (isPicker) {
      navigate(target === 'group-chat' ? '/group-chat' : '/chatroom', {
        state: { cloudDriveSelection: selectedFiles },
      })
      return
    }
    navigate(`/forward-message?source=cloud-drive&fileIds=${selectedIds.join(',')}`)
  }

  const cancelSelection = () => {
    if (isPicker) {
      navigate(target === 'group-chat' ? '/group-chat' : '/chatroom')
      return
    }
    setSelectedIds([])
    setSelectionMode(false)
  }

  const goBackToMe = () => {
    if (location.key === 'default') {
      navigate('/me')
      return
    }
    navigate(-1)
  }

  return (
    <div className="cloud-drive-page h-full bg-[var(--surface)] text-[var(--on-surface)] flex flex-col overscroll-contain">
      <header className="relative z-20 bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] px-4 pt-3 pb-3">
        <div className="flex items-center gap-2 min-h-[44px]">
          {isPicker && (
            <button type="button" onClick={cancelSelection} aria-label="Cancel file picker" className="w-11 h-11 -ml-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-[var(--surface-container)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary)]">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          {!isPicker && (
            <button type="button" onClick={goBackToMe} aria-label="Back to Me" className="w-11 h-11 -ml-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-[var(--surface-container)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary)]">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold text-[var(--primary)]">{isPicker ? 'Choose from Cloud Drive' : selectionMode ? 'Select files' : 'Cloud Drive'}</h1>
            {isPicker && <p className="text-xs text-[var(--on-surface-variant)]">Select files to send</p>}
            {!isPicker && selectionMode && <p className="text-xs text-[var(--on-surface-variant)]">{selectedIds.length} selected · tap to add more</p>}
          </div>
          {!isPicker && (
            <button
              type="button"
              aria-label={selectionMode ? 'Exit selection mode' : 'Select files'}
              onClick={() => selectionMode ? cancelSelection() : setSelectionMode(true)}
              className="min-w-11 h-11 px-2 rounded-full flex items-center justify-center cursor-pointer text-sm font-semibold hover:bg-[var(--surface-container)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary)]"
            >
              {selectionMode ? <X className="w-5 h-5" /> : 'Select'}
            </button>
          )}
          {!isPicker && !selectionMode && (
            <button type="button" onClick={() => setShowMoreSheet(true)} aria-label="More cloud drive options" title="More options" className="w-11 h-11 -mr-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-[var(--surface-container)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary)]">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          )}
        </div>
        <label className="mt-2 h-11 rounded-xl bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] flex items-center gap-2 px-3 focus-within:ring-2 focus-within:ring-[var(--secondary)]">
          <Search className="w-4 h-4 text-[var(--on-surface-variant)]" aria-hidden="true" />
          <span className="sr-only">Search files and folders</span>
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search files and folders"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--on-surface-variant)]"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-[var(--surface-container)]">
              <X className="w-4 h-4" />
            </button>
          )}
        </label>
      </header>

      <main className="flex-1 overflow-y-auto cloud-drive-scrollbar pb-[calc(7rem+env(safe-area-inset-bottom))]">
        {!isPicker && !query && activeCategory === 'all' && (
          <section className="px-4 pt-3">
            <div className="rounded-2xl bg-[var(--primary)] text-[var(--on-primary)] p-4 shadow-[0_12px_28px_rgba(3,22,49,0.14)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-[var(--on-primary)]/75">
                    <Cloud className="w-4 h-4" aria-hidden="true" />
                    Personal storage
                  </div>
                  <p className="mt-1 text-xl font-semibold">{formatBytes(drive.usedBytes)} <span className="text-sm font-normal opacity-65">of {formatBytes(drive.totalBytes)}</span></p>
                </div>
                <span className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold">{Math.round(usedPercent)}% used</span>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-white/15 overflow-hidden" role="progressbar" aria-label="Storage used" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(usedPercent)}>
                <div className="h-full rounded-full bg-[var(--secondary-fixed-dim)] transition-[width] duration-300" style={{ width: `${usedPercent}%` }} />
              </div>
              <p className="mt-1 text-xs text-white/65">{formatBytes(drive.remainingBytes)} available</p>
            </div>
          </section>
        )}

        {activeCategory === 'all' && filteredFolders.length > 0 && (
          <section className="pt-4 pb-0">
            <div className="px-4 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold tracking-wide">Folders</h2>
              {!isPicker && (
                <button type="button" onClick={() => setShowFolderSheet(true)} className="min-h-[44px] flex items-center gap-1 text-xs font-semibold text-[var(--secondary)] cursor-pointer">
                  <FolderPlus className="w-4 h-4" /> New
                </button>
              )}
            </div>
            <div className="px-4 flex gap-2 overflow-x-auto cloud-drive-scrollbar">
              {filteredFolders.map(folder => (
                <FolderListItem key={folder.id} folder={folder} count={visibleDriveFiles.filter(file => file.parentFolderId === folder.id).length} onClick={() => openFolder(folder.id)} />
              ))}
            </div>
          </section>
        )}

        <section className="pt-4 pb-0">
          <div className="px-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-wide text-[var(--on-surface)]">Browse by type</h2>
            {activeCategory !== 'all' && (
              <button type="button" onClick={() => setActiveCategory('all')} className="min-h-[44px] text-xs font-semibold text-[var(--secondary)] cursor-pointer">Show all</button>
            )}
          </div>
          <div className="cloud-drive-category-track mt-2 px-4 flex gap-2 overflow-x-auto cloud-drive-scrollbar">
            {categoryOrder.map(category => {
              const meta = categoryMeta[category]
              const Icon = meta.icon
              const count = visibleDriveFiles.filter(file => category === 'other' ? file.category === 'archive' || file.category === 'other' : file.category === category).length
              const active = activeCategory === category
              return (
                <button
                  type="button"
                  key={category}
                  onClick={() => setActiveCategory(active ? 'all' : category)}
                  className={`cloud-drive-category-card min-h-[64px] rounded-xl p-2 text-left cursor-pointer border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary)] ${active ? 'bg-[var(--primary)] text-[var(--on-primary)] border-[var(--primary)]' : 'bg-[var(--surface-container-lowest)] border-[var(--outline-variant)] hover:bg-[var(--surface-container-low)]'}`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[var(--secondary-fixed-dim)]' : 'text-[var(--secondary)]'}`} aria-hidden="true" />
                  <span className="block mt-1 text-[11px] font-semibold">{meta.label}</span>
                  <span className={`block mt-0.5 text-[10px] ${active ? 'text-white/60' : 'text-[var(--on-surface-variant)]'}`}>{count} {count === 1 ? 'file' : 'files'}</span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="px-4 pt-2">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-sm font-semibold tracking-wide">{query ? 'Search results' : activeCategory === 'all' ? 'Recent files' : categoryMeta[activeCategory].label}</h2>
            </div>
            <span className="text-xs text-[var(--on-surface-variant)]">{filteredFiles.length} items</span>
          </div>
          {filteredFiles.length > 0 ? (
            <div className="space-y-1">
              {filteredFiles.map(file => (
                <FileRow
                  key={file.id}
                  file={file}
                  selectionMode={isSelecting}
                  selected={selectedIds.includes(file.id)}
                  onClick={() => toggleFile(file.id)}
                  onLongPress={!isPicker ? () => enterSelectionMode(file.id) : undefined}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No files found"
              description={query ? `Try a different search for “${query}”.` : 'Upload a file or choose another category.'}
              action={!isPicker && !query ? (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="min-h-[44px] px-5 rounded-full bg-[var(--primary)] text-[var(--on-primary)] text-sm font-semibold cursor-pointer">Upload files</button>
              ) : undefined}
            />
          )}
        </section>

      </main>

      {!isPicker && !selectionMode && (
        <button
          type="button"
          onClick={() => setShowAddSheet(true)}
          className="absolute right-5 bottom-5 z-30 min-w-[132px] h-14 px-5 rounded-full bg-[var(--secondary)] text-[var(--on-secondary)] flex items-center justify-center gap-2 font-semibold shadow-[0_12px_30px_rgba(148,73,49,0.28)] cursor-pointer hover:brightness-95 transition-[filter] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--secondary)]"
        >
          <Plus className="w-5 h-5" /> Add new
        </button>
      )}

      {isSelecting && (
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-[var(--surface-container-lowest)] border-t border-[var(--outline-variant)] px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-12px_30px_rgba(3,22,49,0.08)]">
          {selectedIds.length === 0 && !isPicker ? (
            <div className="min-h-[48px] flex items-center justify-between gap-3">
              <span className="text-sm text-[var(--on-surface-variant)]">Select files to enable quick actions</span>
              <span className="text-xs font-semibold text-[var(--on-surface-variant)]">0 selected</span>
            </div>
          ) : (
            <div className="flex items-stretch gap-2">
              <span className="flex-[0_0_64px] self-center text-sm font-semibold leading-tight">{selectedIds.length} selected</span>
              {!isPicker && (
                <button type="button" disabled={!selectedIds.length} onClick={() => setShowMoveSheet(true)} className="flex-1 min-w-0 min-h-[52px] rounded-xl flex flex-col items-center justify-center text-xs gap-0.5 cursor-pointer disabled:opacity-35">
                  <Move className="w-5 h-5" /> <span>Move</span>
                </button>
              )}
              <button type="button" disabled={!selectedIds.length} onClick={sendSelected} className="flex-1 min-w-0 min-h-[52px] rounded-xl bg-[var(--primary)] text-[var(--on-primary)] flex flex-col items-center justify-center gap-0.5 text-xs font-semibold cursor-pointer disabled:opacity-35">
                <Send className="w-5 h-5" /> <span>{isPicker ? 'Send' : 'Share'}</span>
              </button>
              {!isPicker && (
                <button type="button" disabled={!selectedIds.length} onClick={() => setShowDeleteConfirm(true)} className="flex-1 min-w-0 min-h-[52px] rounded-xl flex flex-col items-center justify-center text-xs text-[var(--error)] gap-0.5 cursor-pointer disabled:opacity-35">
                  <Trash2 className="w-5 h-5" /> <span>Delete</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={event => { beginUpload(event.target.files); event.target.value = '' }} />

      {uploadProgress !== null && (
        <div className="absolute inset-x-4 top-24 z-40 rounded-2xl bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] shadow-xl p-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[var(--primary-fixed)] text-[var(--on-primary-fixed)] flex items-center justify-center"><Upload className="w-5 h-5" /></span>
            <div className="min-w-0 flex-1">
              <div className="flex justify-between gap-3 text-sm"><span className="font-semibold truncate">{uploadName}</span><span>{uploadProgress}%</span></div>
              <div className="mt-2 h-1.5 rounded-full bg-[var(--surface-container)] overflow-hidden"><div className="h-full bg-[var(--secondary)] transition-[width] duration-200" style={{ width: `${uploadProgress}%` }} /></div>
            </div>
            {uploadProgress < 100 && <button type="button" onClick={cancelUpload} aria-label="Cancel upload" className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer"><X className="w-5 h-5" /></button>}
          </div>
        </div>
      )}

      {toast && (
        <div role="status" className="absolute left-1/2 -translate-x-1/2 bottom-24 z-[70] max-w-[320px] px-4 py-2.5 rounded-full bg-[var(--inverse-surface)] text-[var(--inverse-on-surface)] text-sm font-medium shadow-xl whitespace-nowrap">{toast}</div>
      )}

      {showAddSheet && (
        <BottomSheet title="Add to Cloud Drive" onClose={() => setShowAddSheet(false)}>
          <div className="grid grid-cols-2 gap-3 p-5">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="min-h-[112px] rounded-2xl bg-[var(--surface-container-low)] flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[var(--surface-container)] transition-colors">
              <Upload className="w-7 h-7 text-[var(--secondary)]" />
              <span className="text-sm font-semibold">Upload files</span>
            </button>
            <button type="button" onClick={() => { setShowAddSheet(false); setShowFolderSheet(true) }} className="min-h-[112px] rounded-2xl bg-[var(--surface-container-low)] flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[var(--surface-container)] transition-colors">
              <FolderPlus className="w-7 h-7 text-[var(--secondary)]" />
              <span className="text-sm font-semibold">New folder</span>
            </button>
          </div>
        </BottomSheet>
      )}

      {showMoreSheet && (
        <BottomSheet title="Cloud Drive actions" onClose={() => setShowMoreSheet(false)}>
          <div className="p-3 space-y-1">
            <button type="button" onClick={() => { setShowMoreSheet(false); fileInputRef.current?.click() }} className="w-full min-h-[52px] rounded-xl px-3 flex items-center gap-3 text-left cursor-pointer hover:bg-[var(--surface-container-low)]">
              <Upload className="w-5 h-5 text-[var(--secondary)]" /><span className="font-medium">Upload files</span><ChevronRight className="w-4 h-4 ml-auto" />
            </button>
            <button type="button" onClick={() => { setShowMoreSheet(false); setShowFolderSheet(true) }} className="w-full min-h-[52px] rounded-xl px-3 flex items-center gap-3 text-left cursor-pointer hover:bg-[var(--surface-container-low)]">
              <FolderPlus className="w-5 h-5 text-[var(--secondary)]" /><span className="font-medium">New folder</span><ChevronRight className="w-4 h-4 ml-auto" />
            </button>
            <button type="button" onClick={() => enterSelectionMode()} className="w-full min-h-[52px] rounded-xl px-3 flex items-center gap-3 text-left cursor-pointer hover:bg-[var(--surface-container-low)]">
              <Check className="w-5 h-5 text-[var(--secondary)]" /><span className="font-medium">Select files</span><ChevronRight className="w-4 h-4 ml-auto" />
            </button>
          </div>
        </BottomSheet>
      )}

      {showFolderSheet && (
        <BottomSheet title="New folder" onClose={() => setShowFolderSheet(false)}>
          <div className="p-5">
            <label htmlFor="cloud-folder-name" className="text-sm font-semibold">Folder name</label>
            <input id="cloud-folder-name" autoFocus value={folderName} onChange={event => setFolderName(event.target.value)} onKeyDown={event => event.key === 'Enter' && createFolder()} placeholder="e.g. Project files" className="mt-2 w-full h-12 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-4 outline-none focus:ring-2 focus:ring-[var(--secondary)]" />
            <button type="button" disabled={!folderName.trim()} onClick={createFolder} className="mt-5 w-full min-h-[48px] rounded-xl bg-[var(--primary)] text-[var(--on-primary)] text-sm font-semibold cursor-pointer disabled:opacity-40">Create folder</button>
          </div>
        </BottomSheet>
      )}

      {showMoveSheet && (
        <BottomSheet title={`Move ${selectedIds.length} ${selectedIds.length === 1 ? 'file' : 'files'}`} onClose={() => setShowMoveSheet(false)}>
          <div className="p-3 space-y-1">
            <button type="button" onClick={() => moveSelected(null)} className="w-full min-h-[52px] px-3 rounded-xl flex items-center gap-3 text-left cursor-pointer hover:bg-[var(--surface-container-low)]"><Cloud className="w-5 h-5 text-[var(--secondary)]" /><span className="flex-1 font-medium">Cloud Drive root</span><ChevronRight className="w-4 h-4" /></button>
            {drive.folders.map(folder => (
              <button type="button" key={folder.id} onClick={() => moveSelected(folder.id)} className="w-full min-h-[52px] px-3 rounded-xl flex items-center gap-3 text-left cursor-pointer hover:bg-[var(--surface-container-low)]"><FolderPlus className="w-5 h-5 text-[var(--secondary)]" /><span className="flex-1 font-medium">{folder.name}</span><ChevronRight className="w-4 h-4" /></button>
            ))}
          </div>
        </BottomSheet>
      )}

      {showDeleteConfirm && (
        <ConfirmSheet title="Delete files permanently?" description={`${selectedIds.length} selected ${selectedIds.length === 1 ? 'file' : 'files'} will be removed immediately and the storage space will be released. This cannot be undone.`} confirmLabel="Delete" danger onConfirm={deleteSelected} onClose={() => setShowDeleteConfirm(false)} />
      )}
    </div>
  )
}

export default CloudDrivePage
