/**
 * @name 云盘文件夹
 * @description Cloud Drive folder contents with sorting and batch actions
 */

import { useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowDownAZ, ArrowLeft, Check, Cloud, Folder, Move, Send, Trash2, Upload, X } from 'lucide-react'
import '../../themes/equatorial-minimalism/globals.css'
import './style.css'
import { BottomSheet, ConfirmSheet, EmptyState, FileRow } from '../superim-cloud-drive/shared'
import { type CloudFile, useCloudDrive } from '../superim-cloud-drive/store'

type SortMode = 'newest' | 'name' | 'size'

const CloudDriveFolderPage: React.FC = () => {
  const navigate = useNavigate()
  const { folderId } = useParams<{ folderId: string }>()
  const [searchParams] = useSearchParams()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const drive = useCloudDrive()
  const [sortMode, setSortMode] = useState<SortMode>('newest')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [selectionMode, setSelectionMode] = useState(false)
  const [showSortSheet, setShowSortSheet] = useState(false)
  const [showMoveSheet, setShowMoveSheet] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const folder = drive.folders.find(item => item.id === folderId)
  const isPicker = searchParams.get('mode') === 'picker'
  const target = searchParams.get('target') === 'group-chat' ? 'group-chat' : 'chatroom'
  const isSelecting = isPicker || selectionMode

  const files = useMemo(() => {
    const folderFiles = drive.files.filter(file => file.parentFolderId === folderId && file.status !== 'frozen')
    return folderFiles.sort((a, b) => {
      if (sortMode === 'name') return a.name.localeCompare(b.name)
      if (sortMode === 'size') return b.sizeBytes - a.sizeBytes
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  }, [drive.files, folderId, sortMode])

  const selectedFiles = useMemo(() => drive.files.filter(file => file.status !== 'frozen' && selectedIds.includes(file.id)), [drive.files, selectedIds])

  const showMessage = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2200)
  }

  const goBack = () => {
    const suffix = isPicker ? `?mode=picker&target=${target}` : ''
    navigate(`/cloud-drive${suffix}`)
  }

  const toggleFile = (file: CloudFile) => {
    if (!isSelecting) {
      navigate(`/cloud-drive/file/${file.id}`)
      return
    }
    setSelectedIds(current => current.includes(file.id) ? current.filter(id => id !== file.id) : [...current, file.id])
  }

  const enterSelectionMode = (fileId: string) => {
    if (isPicker) return
    setSelectionMode(true)
    setSelectedIds(current => current.includes(fileId) ? current : [...current, fileId])
    showMessage('Selection mode on — choose more files or use a quick action below')
  }

  const handleUpload = (fileList: FileList | null) => {
    if (!fileList?.length) return
    const filesToUpload = Array.from(fileList)
    const totalSize = filesToUpload.reduce((sum, file) => sum + file.size, 0)
    if (totalSize > drive.remainingBytes) {
      showMessage('Not enough storage available')
      return
    }
    setUploading(true)
    window.setTimeout(() => {
      const result = drive.addUploadedFiles(filesToUpload, folderId || null)
      setUploading(false)
      showMessage(result.error || `${result.added.length} ${result.added.length === 1 ? 'file' : 'files'} uploaded`)
    }, 900)
  }

  const moveSelected = (targetFolderId: string | null) => {
    drive.moveFiles(selectedIds, targetFolderId)
    setSelectedIds([])
    setSelectionMode(false)
    setShowMoveSheet(false)
    showMessage('Files moved')
  }

  const sendSelected = () => {
    if (!selectedIds.length) return
    if (isPicker) {
      navigate(target === 'group-chat' ? '/group-chat' : '/chatroom', { state: { cloudDriveSelection: selectedFiles } })
      return
    }
    navigate(`/forward-message?source=cloud-drive&fileIds=${selectedIds.join(',')}`)
  }

  const deleteSelected = () => {
    drive.deleteFiles(selectedIds)
    setSelectedIds([])
    setSelectionMode(false)
    setShowDeleteConfirm(false)
    showMessage('Files permanently deleted')
  }

  if (!folder) {
    return (
      <div className="h-full bg-[var(--surface)] flex flex-col items-center justify-center px-8 text-center">
        <Folder className="w-12 h-12 text-[var(--on-surface-variant)]" />
        <h1 className="mt-4 text-lg font-semibold text-[var(--on-surface)]">Folder not found</h1>
        <button type="button" onClick={() => navigate('/cloud-drive')} className="mt-5 min-h-[44px] px-5 rounded-full bg-[var(--primary)] text-[var(--on-primary)] font-semibold cursor-pointer">Back to Cloud Drive</button>
      </div>
    )
  }

  return (
    <div className="cloud-drive-folder-page h-full bg-[var(--surface)] flex flex-col text-[var(--on-surface)] overscroll-contain">
      <header className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] px-3 py-3">
        <div className="flex items-center gap-2 min-h-[44px]">
          <button type="button" onClick={goBack} aria-label="Back to Cloud Drive" className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer hover:bg-[var(--surface-container)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary)]"><ArrowLeft className="w-5 h-5" /></button>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-[var(--primary)] truncate">{selectionMode ? 'Select files' : folder.name}</h1>
            <p className="text-xs text-[var(--on-surface-variant)]">{selectionMode ? `${selectedIds.length} selected · tap to add more` : isPicker ? 'Choose files to send' : `${files.length} ${files.length === 1 ? 'file' : 'files'}`}</p>
          </div>
          {!isPicker && (
            <button type="button" onClick={() => { setSelectionMode(current => !current); setSelectedIds([]) }} className="min-w-11 h-11 px-2 rounded-full text-sm font-semibold cursor-pointer hover:bg-[var(--surface-container)]">
              {selectionMode ? <X className="w-5 h-5 mx-auto" /> : 'Select'}
            </button>
          )}
          {!selectionMode && <button type="button" onClick={() => setShowSortSheet(true)} aria-label="Sort files" className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer hover:bg-[var(--surface-container)]"><ArrowDownAZ className="w-5 h-5" /></button>}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-[calc(7rem+env(safe-area-inset-bottom))]">
        <div className="rounded-2xl bg-[var(--surface-container-low)] border border-[var(--outline-variant)] p-4 flex items-center gap-3">
          <span className="w-11 h-11 rounded-xl bg-[var(--secondary-container)] text-[var(--on-secondary-container)] flex items-center justify-center"><Folder className="w-6 h-6" /></span>
          <div className="min-w-0 flex-1"><p className="font-semibold truncate">{folder.name}</p><p className="text-xs text-[var(--on-surface-variant)] mt-0.5">Sorted by {sortMode}</p></div>
          {!isPicker && (
            <button type="button" disabled={uploading} onClick={() => fileInputRef.current?.click()} className="min-w-[88px] min-h-[44px] rounded-xl bg-[var(--primary)] text-[var(--on-primary)] flex items-center justify-center gap-2 text-sm font-semibold cursor-pointer disabled:opacity-50">
              <Upload className="w-4 h-4" /> {uploading ? 'Uploading' : 'Upload'}
            </button>
          )}
        </div>

        <div className="mt-5">
          {files.length > 0 ? (
            <div className="space-y-1">{files.map(file => <FileRow key={file.id} file={file} selectionMode={isSelecting} selected={selectedIds.includes(file.id)} onClick={() => toggleFile(file)} onLongPress={!isPicker ? () => enterSelectionMode(file.id) : undefined} />)}</div>
          ) : (
            <EmptyState title="This folder is empty" description={isPicker ? 'There are no files to choose from here.' : 'Upload files or move existing Cloud Drive files into this folder.'} action={!isPicker ? <button type="button" onClick={() => fileInputRef.current?.click()} className="min-h-[44px] px-5 rounded-full bg-[var(--primary)] text-[var(--on-primary)] font-semibold cursor-pointer">Upload files</button> : undefined} />
          )}
        </div>
      </main>

      {isSelecting && (
        <div className="absolute bottom-0 left-0 right-0 z-30 px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-[var(--surface-container-lowest)] border-t border-[var(--outline-variant)] shadow-[0_-12px_30px_rgba(3,22,49,0.08)]">
          {selectedIds.length === 0 && !isPicker ? (
            <div className="min-h-[48px] flex items-center justify-between gap-3">
              <span className="text-sm text-[var(--on-surface-variant)]">Select files to enable quick actions</span>
              <span className="text-xs font-semibold text-[var(--on-surface-variant)]">0 selected</span>
            </div>
          ) : (
            <div className="flex items-stretch gap-2">
              <span className="flex-[0_0_64px] self-center text-sm font-semibold leading-tight">{selectedIds.length} selected</span>
              {!isPicker && <button type="button" disabled={!selectedIds.length} onClick={() => setShowMoveSheet(true)} className="flex-1 min-w-0 min-h-[52px] rounded-xl flex flex-col items-center justify-center gap-0.5 text-xs cursor-pointer disabled:opacity-35"><Move className="w-5 h-5" /><span>Move</span></button>}
              <button type="button" disabled={!selectedIds.length} onClick={sendSelected} className="flex-1 min-w-0 min-h-[52px] rounded-xl bg-[var(--primary)] text-[var(--on-primary)] flex flex-col items-center justify-center gap-0.5 text-xs font-semibold cursor-pointer disabled:opacity-35"><Send className="w-5 h-5" /><span>{isPicker ? 'Send' : 'Share'}</span></button>
              {!isPicker && <button type="button" disabled={!selectedIds.length} onClick={() => setShowDeleteConfirm(true)} className="flex-1 min-w-0 min-h-[52px] rounded-xl flex flex-col items-center justify-center gap-0.5 text-xs text-[var(--error)] cursor-pointer disabled:opacity-35"><Trash2 className="w-5 h-5" /><span>Delete</span></button>}
            </div>
          )}
        </div>
      )}

      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={event => { handleUpload(event.target.files); event.target.value = '' }} />
      {toast && <div role="status" className="absolute left-1/2 -translate-x-1/2 bottom-24 z-[70] max-w-[320px] px-4 py-2.5 rounded-full bg-[var(--inverse-surface)] text-[var(--inverse-on-surface)] text-sm font-medium whitespace-nowrap shadow-xl">{toast}</div>}

      {showSortSheet && (
        <BottomSheet title="Sort files" onClose={() => setShowSortSheet(false)}>
          <div className="p-3 space-y-1">
            {([['newest', 'Newest first'], ['name', 'File name'], ['size', 'Largest first']] as const).map(([value, label]) => (
              <button type="button" key={value} onClick={() => { setSortMode(value); setShowSortSheet(false) }} className="w-full min-h-[52px] rounded-xl px-4 flex items-center justify-between cursor-pointer hover:bg-[var(--surface-container-low)]"><span className="font-medium">{label}</span>{sortMode === value && <span className="w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center"><Check className="w-4 h-4" aria-hidden="true" /></span>}</button>
            ))}
          </div>
        </BottomSheet>
      )}

      {showMoveSheet && (
        <BottomSheet title={`Move ${selectedIds.length} ${selectedIds.length === 1 ? 'file' : 'files'}`} onClose={() => setShowMoveSheet(false)}>
          <div className="p-3 space-y-1">
            <button type="button" onClick={() => moveSelected(null)} className="w-full min-h-[52px] px-3 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-[var(--surface-container-low)]"><Cloud className="w-5 h-5 text-[var(--secondary)]" /><span className="font-medium">Cloud Drive root</span></button>
            {drive.folders.filter(item => item.id !== folderId).map(item => <button type="button" key={item.id} onClick={() => moveSelected(item.id)} className="w-full min-h-[52px] px-3 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-[var(--surface-container-low)]"><Folder className="w-5 h-5 text-[var(--secondary)]" /><span className="font-medium">{item.name}</span></button>)}
          </div>
        </BottomSheet>
      )}

      {showDeleteConfirm && <ConfirmSheet title="Delete files permanently?" description={`${selectedIds.length} selected ${selectedIds.length === 1 ? 'file' : 'files'} will be removed immediately. This cannot be undone.`} confirmLabel="Delete" danger onConfirm={deleteSelected} onClose={() => setShowDeleteConfirm(false)} />}
    </div>
  )
}

export default CloudDriveFolderPage
