/**
 * @name 云盘文件详情
 * @description Cloud file preview, metadata, and management actions
 */

import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, Check, ChevronRight, Download, FileAudio, FileText,
  Folder, Info, MoreHorizontal, Move, Pencil, Play,
  Send, Trash2,
} from 'lucide-react'
import '../../themes/equatorial-minimalism/globals.css'
import './style.css'
import { BottomSheet, ConfirmSheet, FileTypeIcon } from '../superim-cloud-drive/shared'
import { formatBytes, useCloudDrive } from '../superim-cloud-drive/store'

const CloudDriveFilePage: React.FC = () => {
  const navigate = useNavigate()
  const { fileId } = useParams<{ fileId: string }>()
  const drive = useCloudDrive()
  const [showActions, setShowActions] = useState(false)
  const [showRename, setShowRename] = useState(false)
  const [showMove, setShowMove] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [newName, setNewName] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  const file = drive.files.find(item => item.id === fileId)
  const folder = drive.folders.find(item => item.id === file?.parentFolderId)

  const previewKind = useMemo(() => {
    if (!file) return 'other'
    if (file.category === 'image') return 'image'
    if (file.category === 'video') return 'video'
    if (file.category === 'audio') return 'audio'
    if (file.mimeType === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) return 'pdf'
    return 'other'
  }, [file])

  const showMessage = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2200)
  }

  if (!file) {
    return (
      <div className="h-full bg-[var(--surface)] flex flex-col items-center justify-center px-8 text-center">
        <FileText className="w-12 h-12 text-[var(--on-surface-variant)]" />
        <h1 className="mt-4 text-lg font-semibold text-[var(--on-surface)]">File not found</h1>
        <p className="mt-1 text-sm text-[var(--on-surface-variant)]">It may have been moved or permanently deleted.</p>
        <button type="button" onClick={() => navigate('/cloud-drive')} className="mt-5 min-h-[44px] px-5 rounded-full bg-[var(--primary)] text-[var(--on-primary)] font-semibold cursor-pointer">Back to Cloud Drive</button>
      </div>
    )
  }

  if (file.status === 'frozen') {
    return (
      <div className="h-full bg-[var(--surface)] flex flex-col items-center justify-center px-8 text-center text-[var(--on-surface)]">
        <FileText className="w-12 h-12 text-[var(--error)]" />
        <h1 className="mt-4 text-lg font-semibold">File unavailable</h1>
        <p className="mt-1 max-w-[300px] text-sm text-[var(--on-surface-variant)]">This file has been frozen by an administrator and is not available in Cloud Drive.</p>
        <button type="button" onClick={() => navigate('/cloud-drive')} className="mt-5 min-h-[44px] px-5 rounded-full bg-[var(--primary)] text-[var(--on-primary)] font-semibold cursor-pointer">Back to Cloud Drive</button>
      </div>
    )
  }

  const downloadFile = () => {
    const blob = new Blob([`SuperIM Cloud Drive prototype file: ${file.name}`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = file.name
    anchor.click()
    URL.revokeObjectURL(url)
    showMessage('Download started')
  }

  const renameFile = () => {
    if (!newName.trim()) return
    drive.renameFile(file.id, newName)
    setShowRename(false)
    showMessage('File renamed')
  }

  const moveFile = (folderId: string | null) => {
    drive.moveFiles([file.id], folderId)
    setShowMove(false)
    showMessage('File moved')
  }

  const deleteFile = () => {
    drive.deleteFiles([file.id])
    setShowDelete(false)
    navigate('/cloud-drive', { replace: true })
  }

  const renderPreview = () => {
    if (previewKind === 'image' && file.previewUrl) {
      return (
        <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-[var(--primary-fixed)] via-[var(--surface-container)] to-[var(--secondary-container)] flex items-center justify-center">
          <FileTypeIcon file={file} className="w-16 h-16 text-[var(--secondary)]" />
          <img src={file.previewUrl} alt={`Preview of ${file.name}`} onError={event => { event.currentTarget.style.display = 'none' }} className="absolute inset-0 w-full h-full object-cover" />
        </div>
      )
    }
    if (previewKind === 'video') {
      return (
        <div className="w-full h-full relative overflow-hidden bg-[#0f172a] flex items-center justify-center">
          {file.previewUrl && <img src={file.previewUrl} alt="" onError={event => { event.currentTarget.style.display = 'none' }} className="absolute inset-0 w-full h-full object-cover opacity-55" />}
          <button type="button" aria-label="Play video preview" className="relative z-10 w-16 h-16 rounded-full bg-white/90 text-[var(--primary)] flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-white"><Play className="w-7 h-7 ml-1" fill="currentColor" /></button>
          <span className="absolute bottom-4 right-4 z-10 px-2 py-1 rounded-full bg-black/55 text-white text-xs">02:18</span>
        </div>
      )
    }
    if (previewKind === 'audio') {
      return (
        <div className="w-full h-full bg-[var(--primary)] text-[var(--on-primary)] flex flex-col items-center justify-center p-8">
          <span className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center"><FileAudio className="w-9 h-9" /></span>
          <p className="mt-5 max-w-[260px] text-center font-semibold truncate">{file.name}</p>
          <div className="mt-8 w-full max-w-[280px] flex items-center gap-3"><button type="button" aria-label="Play audio preview" className="w-12 h-12 rounded-full bg-white text-[var(--primary)] flex items-center justify-center cursor-pointer"><Play className="w-5 h-5 ml-0.5" fill="currentColor" /></button><div className="flex-1"><div className="h-1.5 rounded-full bg-white/20"><div className="w-1/3 h-full rounded-full bg-[var(--secondary-fixed-dim)]" /></div><div className="mt-2 flex justify-between text-xs text-white/60"><span>01:42</span><span>05:14</span></div></div></div>
        </div>
      )
    }
    if (previewKind === 'pdf') {
      return (
        <div className="w-full h-full bg-[var(--surface-container)] p-6 flex items-center justify-center">
          <div className="w-[230px] h-[300px] bg-white rounded-md shadow-xl p-6 text-slate-800 overflow-hidden">
            <div className="w-12 h-2 bg-slate-900 rounded" />
            <div className="mt-5 space-y-2">{Array.from({ length: 9 }).map((_, index) => <div key={index} className={`h-1.5 rounded bg-slate-200 ${index % 3 === 2 ? 'w-2/3' : 'w-full'}`} />)}</div>
            <div className="mt-8 h-20 rounded bg-blue-50 border border-blue-100 flex items-center justify-center"><FileText className="w-8 h-8 text-blue-600" /></div>
            <p className="mt-5 text-xs font-semibold text-center truncate">{file.name}</p>
          </div>
        </div>
      )
    }
    return (
      <div className="w-full h-full bg-[var(--surface-container-low)] flex flex-col items-center justify-center px-8 text-center">
        <span className="w-24 h-24 rounded-[28px] bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] text-[var(--secondary)] flex items-center justify-center shadow-sm"><FileTypeIcon file={file} className="w-11 h-11" /></span>
        <p className="mt-5 font-semibold max-w-[280px] truncate">{file.name}</p>
        <p className="mt-1 text-sm text-[var(--on-surface-variant)]">Preview is not available for this file type.</p>
      </div>
    )
  }

  return (
    <div className="cloud-drive-file-page h-full bg-[var(--surface)] flex flex-col text-[var(--on-surface)] overscroll-contain">
      <header className="relative z-20 bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] px-3 py-3">
        <div className="flex items-center gap-2 min-h-[44px]">
          <button type="button" onClick={() => navigate(-1)} aria-label="Back" className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer hover:bg-[var(--surface-container)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary)]"><ArrowLeft className="w-5 h-5" /></button>
          <div className="min-w-0 flex-1"><h1 className="text-base font-semibold text-[var(--primary)] truncate">{file.name}</h1><p className="text-xs text-[var(--on-surface-variant)]">{formatBytes(file.sizeBytes)}</p></div>
          <button type="button" onClick={() => setShowActions(true)} aria-label="File actions" className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer hover:bg-[var(--surface-container)]"><MoreHorizontal className="w-5 h-5" /></button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-28">
        <section className="h-[390px] border-b border-[var(--outline-variant)]">{renderPreview()}</section>

        <section className="p-4">
          <div className="grid grid-cols-3 gap-3">
            <button type="button" onClick={() => navigate(`/forward-message?source=cloud-drive&fileIds=${file.id}`)} className="min-h-[72px] rounded-2xl bg-[var(--primary)] text-[var(--on-primary)] flex flex-col items-center justify-center gap-2 text-xs font-semibold cursor-pointer"><Send className="w-5 h-5" />Send</button>
            <button type="button" onClick={downloadFile} className="min-h-[72px] rounded-2xl bg-[var(--surface-container-low)] flex flex-col items-center justify-center gap-2 text-xs font-semibold cursor-pointer hover:bg-[var(--surface-container)]"><Download className="w-5 h-5 text-[var(--secondary)]" />Download</button>
            <button type="button" onClick={() => setShowActions(true)} className="min-h-[72px] rounded-2xl bg-[var(--surface-container-low)] flex flex-col items-center justify-center gap-2 text-xs font-semibold cursor-pointer hover:bg-[var(--surface-container)]"><MoreHorizontal className="w-5 h-5 text-[var(--secondary)]" />More</button>
          </div>

          <div className="mt-5 rounded-2xl bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] divide-y divide-[var(--outline-variant)]">
            <div className="min-h-[58px] px-4 py-3 flex items-center gap-3"><Info className="w-5 h-5 text-[var(--secondary)]" /><div className="min-w-0 flex-1"><p className="text-xs text-[var(--on-surface-variant)]">Type</p><p className="text-sm font-medium truncate">{file.mimeType}</p></div></div>
            <div className="min-h-[58px] px-4 py-3 flex items-center gap-3"><Folder className="w-5 h-5 text-[var(--secondary)]" /><div className="min-w-0 flex-1"><p className="text-xs text-[var(--on-surface-variant)]">Location</p><p className="text-sm font-medium truncate">{folder?.name || 'Cloud Drive root'}</p></div></div>
            <div className="min-h-[58px] px-4 py-3 flex items-center gap-3"><Check className="w-5 h-5 text-[var(--secondary)]" /><div className="min-w-0 flex-1"><p className="text-xs text-[var(--on-surface-variant)]">Added</p><p className="text-sm font-medium">{new Date(file.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</p></div></div>
            {file.source === 'chat' && <div className="min-h-[58px] px-4 py-3 flex items-center gap-3"><Send className="w-5 h-5 text-[var(--secondary)]" /><div className="min-w-0 flex-1"><p className="text-xs text-[var(--on-surface-variant)]">Saved from</p><p className="text-sm font-medium truncate">{file.sourceChat}</p></div></div>}
          </div>
        </section>
      </main>

      {toast && <div role="status" className="absolute left-1/2 -translate-x-1/2 bottom-8 z-[70] max-w-[320px] px-4 py-2.5 rounded-full bg-[var(--inverse-surface)] text-[var(--inverse-on-surface)] text-sm font-medium whitespace-nowrap shadow-xl">{toast}</div>}

      {showActions && (
        <BottomSheet title="File actions" onClose={() => setShowActions(false)}>
          <div className="p-3 space-y-1">
            <button type="button" onClick={() => { setNewName(file.name); setShowActions(false); setShowRename(true) }} className="w-full min-h-[52px] rounded-xl px-3 flex items-center gap-3 cursor-pointer hover:bg-[var(--surface-container-low)]"><Pencil className="w-5 h-5 text-[var(--secondary)]" /><span className="font-medium">Rename</span><ChevronRight className="w-4 h-4 ml-auto" /></button>
            <button type="button" onClick={() => { setShowActions(false); setShowMove(true) }} className="w-full min-h-[52px] rounded-xl px-3 flex items-center gap-3 cursor-pointer hover:bg-[var(--surface-container-low)]"><Move className="w-5 h-5 text-[var(--secondary)]" /><span className="font-medium">Move</span><ChevronRight className="w-4 h-4 ml-auto" /></button>
            <button type="button" onClick={() => { setShowActions(false); navigate(`/forward-message?source=cloud-drive&fileIds=${file.id}`) }} className="w-full min-h-[52px] rounded-xl px-3 flex items-center gap-3 cursor-pointer hover:bg-[var(--surface-container-low)]"><Send className="w-5 h-5 text-[var(--secondary)]" /><span className="font-medium">Send to chat</span><ChevronRight className="w-4 h-4 ml-auto" /></button>
            <button type="button" onClick={() => { setShowActions(false); setShowDelete(true) }} className="w-full min-h-[52px] rounded-xl px-3 flex items-center gap-3 text-[var(--error)] cursor-pointer hover:bg-[var(--error-container)]"><Trash2 className="w-5 h-5" /><span className="font-medium">Delete permanently</span></button>
          </div>
        </BottomSheet>
      )}

      {showRename && (
        <BottomSheet title="Rename file" onClose={() => setShowRename(false)}>
          <div className="p-5"><label htmlFor="cloud-file-name" className="text-sm font-semibold">File name</label><input id="cloud-file-name" autoFocus value={newName} onChange={event => setNewName(event.target.value)} onKeyDown={event => event.key === 'Enter' && renameFile()} className="mt-2 w-full h-12 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-4 outline-none focus:ring-2 focus:ring-[var(--secondary)]" /><button type="button" disabled={!newName.trim()} onClick={renameFile} className="mt-5 w-full min-h-[48px] rounded-xl bg-[var(--primary)] text-[var(--on-primary)] text-sm font-semibold cursor-pointer disabled:opacity-40">Save name</button></div>
        </BottomSheet>
      )}

      {showMove && (
        <BottomSheet title="Move file" onClose={() => setShowMove(false)}>
          <div className="p-3 space-y-1"><button type="button" onClick={() => moveFile(null)} className="w-full min-h-[52px] px-3 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-[var(--surface-container-low)]"><Folder className="w-5 h-5 text-[var(--secondary)]" /><span className="font-medium flex-1 text-left">Cloud Drive root</span>{file.parentFolderId === null && <Check className="w-5 h-5" />}</button>{drive.folders.map(item => <button type="button" key={item.id} onClick={() => moveFile(item.id)} className="w-full min-h-[52px] px-3 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-[var(--surface-container-low)]"><Folder className="w-5 h-5 text-[var(--secondary)]" /><span className="font-medium flex-1 text-left">{item.name}</span>{file.parentFolderId === item.id && <Check className="w-5 h-5" />}</button>)}</div>
        </BottomSheet>
      )}

      {showDelete && <ConfirmSheet title="Delete file permanently?" description={`“${file.name}” will be removed immediately and ${formatBytes(file.sizeBytes)} of storage will be released. This cannot be undone.`} confirmLabel="Delete" danger onConfirm={deleteFile} onClose={() => setShowDelete(false)} />}
    </div>
  )
}

export default CloudDriveFilePage
