/* eslint-disable react-refresh/only-export-components */
import { useRef, type ReactNode } from 'react'
import {
  Archive, Check, File, FileAudio, FileImage, FileText, FileVideo, Folder,
  HardDrive, Image, Music2, Package, Video,
} from 'lucide-react'
import type { CloudFile, CloudFileCategory, CloudFolder } from './store'
import { formatBytes } from './store'

export const categoryMeta: Record<CloudFileCategory, { label: string; color: string; icon: typeof File }> = {
  image: { label: 'Images', color: 'bg-rose-100 text-rose-700', icon: Image },
  video: { label: 'Videos', color: 'bg-violet-100 text-violet-700', icon: Video },
  audio: { label: 'Audio', color: 'bg-amber-100 text-amber-700', icon: Music2 },
  document: { label: 'Documents', color: 'bg-blue-100 text-blue-700', icon: FileText },
  archive: { label: 'Archives', color: 'bg-emerald-100 text-emerald-700', icon: Package },
  other: { label: 'Other', color: 'bg-slate-100 text-slate-700', icon: File },
}

export const FileTypeIcon = ({ file, className = 'w-5 h-5' }: { file: CloudFile; className?: string }) => {
  const Icon = file.category === 'image' ? FileImage
    : file.category === 'video' ? FileVideo
      : file.category === 'audio' ? FileAudio
        : file.category === 'archive' ? Archive
          : file.category === 'document' ? FileText
            : File
  return <Icon className={className} aria-hidden="true" />
}

export const FileRow = ({
  file,
  selected = false,
  selectionMode = false,
  onClick,
  onLongPress,
}: {
  file: CloudFile
  selected?: boolean
  selectionMode?: boolean
  onClick: () => void
  onLongPress?: () => void
}) => {
  const longPressTimer = useRef<number | null>(null)
  const longPressTriggered = useRef(false)

  const clearLongPress = () => {
    if (longPressTimer.current !== null) {
      window.clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!onLongPress || event.button !== 0) return
    longPressTriggered.current = false
    longPressTimer.current = window.setTimeout(() => {
      longPressTriggered.current = true
      onLongPress()
    }, 500)
  }

  const handleClick = () => {
    if (longPressTriggered.current) {
      longPressTriggered.current = false
      return
    }
    onClick()
  }

  const handleContextMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!onLongPress) return
    event.preventDefault()
    clearLongPress()
    if (longPressTriggered.current) return
    longPressTriggered.current = true
    onLongPress()
  }

  return (
  <button
    type="button"
    onClick={handleClick}
    onPointerDown={handlePointerDown}
    onPointerUp={clearLongPress}
    onPointerLeave={clearLongPress}
    onPointerCancel={clearLongPress}
    onContextMenu={handleContextMenu}
    className={`w-full min-h-[68px] select-none flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary)] ${
      selected ? 'bg-[var(--primary-fixed)]' : 'hover:bg-[var(--surface-container-low)]'
    }`}
  >
    <span className={`relative w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${categoryMeta[file.category].color}`}>
      {file.previewUrl && file.category === 'image' ? (
        <img src={file.previewUrl} alt="" className="w-full h-full object-cover rounded-xl" loading="lazy" />
      ) : (
        <FileTypeIcon file={file} className="w-5 h-5" />
      )}
      {selectionMode && (
        <span className={`absolute -right-1 -top-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${selected ? 'bg-[var(--primary)] text-white' : 'bg-white'}`}>
          {selected && <Check className="w-3 h-3" strokeWidth={3} aria-hidden="true" />}
        </span>
      )}
    </span>
    <span className="min-w-0 flex-1">
      <span className="block text-[15px] font-semibold text-[var(--on-surface)] truncate">{file.name}</span>
      <span className="block mt-0.5 text-xs text-[var(--on-surface-variant)] truncate">
        {formatBytes(file.sizeBytes)} · {new Date(file.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </span>
    </span>
  </button>
  )
}

export const FolderListItem = ({ folder, count, onClick }: { folder: CloudFolder; count: number; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="min-w-[112px] h-[60px] px-2.5 rounded-xl bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] flex items-center gap-2 text-left cursor-pointer hover:bg-[var(--surface-container-low)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary)]"
  >
    <span className="w-8 h-8 rounded-lg bg-[var(--secondary-container)] text-[var(--on-secondary-container)] flex items-center justify-center flex-shrink-0">
      <Folder className="w-4 h-4" aria-hidden="true" />
    </span>
    <span className="min-w-0 flex-1">
      <span className="block text-xs font-semibold text-[var(--on-surface)] truncate">{folder.name}</span>
      <span className="block mt-0.5 text-[10px] text-[var(--on-surface-variant)]">{count} {count === 1 ? 'file' : 'files'}</span>
    </span>
  </button>
)

export const EmptyState = ({ title, description, action }: { title: string; description: string; action?: ReactNode }) => (
  <div className="px-8 py-14 flex flex-col items-center text-center">
    <span className="w-16 h-16 rounded-3xl bg-[var(--surface-container)] flex items-center justify-center text-[var(--on-surface-variant)]">
      <HardDrive className="w-8 h-8" aria-hidden="true" />
    </span>
    <h3 className="mt-4 text-base font-semibold text-[var(--on-surface)]">{title}</h3>
    <p className="mt-1 text-sm leading-6 text-[var(--on-surface-variant)]">{description}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
)

export const BottomSheet = ({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) => (
  <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true" aria-label={title}>
    <button type="button" aria-label="Close" className="absolute inset-0 bg-black/45 cursor-pointer" onClick={onClose} />
    <div className="relative w-full max-h-[82%] overflow-y-auto rounded-t-3xl bg-[var(--surface-container-lowest)] shadow-2xl">
      <div className="w-10 h-1 rounded-full bg-[var(--outline-variant)] mx-auto mt-3" />
      <div className="px-5 py-4 border-b border-[var(--outline-variant)]">
        <h2 className="text-lg font-semibold text-[var(--on-surface)]">{title}</h2>
      </div>
      {children}
    </div>
  </div>
)

export const ConfirmSheet = ({ title, description, confirmLabel, danger = false, onConfirm, onClose }: {
  title: string
  description: string
  confirmLabel: string
  danger?: boolean
  onConfirm: () => void
  onClose: () => void
}) => (
  <BottomSheet title={title} onClose={onClose}>
    <div className="p-5">
      <p className="text-sm leading-6 text-[var(--on-surface-variant)]">{description}</p>
      <div className="grid grid-cols-2 gap-3 mt-6">
        <button type="button" onClick={onClose} className="min-h-[48px] rounded-xl bg-[var(--surface-container)] text-sm font-semibold text-[var(--on-surface)] cursor-pointer">Cancel</button>
        <button type="button" onClick={onConfirm} className={`min-h-[48px] rounded-xl text-sm font-semibold text-white cursor-pointer ${danger ? 'bg-[var(--error)]' : 'bg-[var(--primary)]'}`}>{confirmLabel}</button>
      </div>
    </div>
  </BottomSheet>
)
