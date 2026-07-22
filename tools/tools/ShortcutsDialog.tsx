import React, { useEffect, useState } from 'react'
import { Keyboard, XIcon, RotateCcw } from 'lucide-react'
import {
  DEFAULT_SHORTCUTS,
  formatShortcut,
  getOS,
  saveShortcuts,
  setShortcutModalOpen,
  type ShortcutConfig,
  type Theme,
} from '../lib/shortcuts'

interface ShortcutsDialogProps {
  isOpen: boolean
  onClose: () => void
  shortcuts: ShortcutConfig
  onSave: (shortcuts: ShortcutConfig) => void
  theme: Theme
}

export const ShortcutsDialog: React.FC<ShortcutsDialogProps> = ({
  isOpen,
  onClose,
  shortcuts,
  onSave,
  theme,
}) => {
  const isDark = theme === 'dark'
  const [editingShortcuts, setEditingShortcuts] = useState<ShortcutConfig>(() => shortcuts)
  const [recordingKey, setRecordingKey] = useState<keyof ShortcutConfig | null>(null)
  const os = getOS()

  useEffect(() => {
    setShortcutModalOpen(isOpen)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!recordingKey) return

    const handleKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation()
      e.preventDefault()

      if (!e.ctrlKey && !e.metaKey) return

      const parts: string[] = []
      if (e.ctrlKey) parts.push('ctrl')
      if (e.metaKey) parts.push('cmd')
      if (e.altKey) parts.push('alt')
      if (e.shiftKey) parts.push('shift')

      const key = e.key.toLowerCase()
      if (key.length === 1 && /[a-z0-9]/.test(key)) {
        parts.push(key)
        setEditingShortcuts(prev => ({ ...prev, [recordingKey]: parts.join('+') }))
        setRecordingKey(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [recordingKey])

  if (!isOpen) return null

  const shortcutLabels: Record<keyof ShortcutConfig, string> = {
    copyToFigma: '复制到 Figma',
    openDoc: '查看文档',
    selectElement: '批注选择元素',
  }

  const textPrimary = isDark ? 'text-[#f5f2ed]' : 'text-[#1c1c1c]'
  const textSecondary = isDark ? 'text-[#a0a0a0]' : 'text-[#6b6b6b]'
  const textMuted = isDark ? 'text-[#808080]' : 'text-[#a0a0a0]'
  const borderClass = isDark ? 'border-[#ffffff]/8' : 'border-[#1c1c1c]/8'
  const surfaceClass = isDark ? 'bg-[#262626]' : 'bg-[#f7f3ed]'
  const hoverSurface = isDark ? 'hover:bg-[#333333]' : 'hover:bg-[#efe9e0]'

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center animate-tool-fade-in">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={[
          'relative rounded-2xl shadow-2xl w-[520px] max-w-[92vw] max-h-[90vh] flex flex-col overflow-hidden animate-tool-enter border',
          isDark ? 'bg-[#262626] border-[#ffffff]/12' : 'bg-[#f7f3ed] border-[#1c1c1c]/8',
        ].join(' ')}
      >
        {/* 头部 */}
        <div className={`flex items-center justify-between px-6 py-5 border-b ${borderClass}`}>
          <div className="flex items-center gap-3.5">
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${isDark ? 'bg-[#ffffff]/8' : 'bg-[#1c1c1c]/6'}`}>
              <Keyboard className="tool-accent" size={22} />
            </div>
            <div>
              <h2 className={`text-base font-bold ${textPrimary}`}>快捷键设置</h2>
              <p className={`text-xs mt-0.5 ${textMuted}`}>
                检测到系统: {os === 'mac' ? 'macOS' : os === 'windows' ? 'Windows' : os === 'linux' ? 'Linux' : '未知'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all duration-200 ${textSecondary} ${hoverSurface}`}
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* 快捷键列表 */}
        <div className="p-6 space-y-3 overflow-y-auto">
          {(Object.keys(shortcutLabels) as Array<keyof ShortcutConfig>).map((key) => (
            <div
              key={key}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                recordingKey === key
                  ? 'border-current tool-accent bg-current/[0.04]'
                  : `${borderClass} ${isDark ? 'bg-[#333333]' : 'bg-white'}`
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${isDark ? 'bg-[#ffffff]/8 text-[#f5f2ed]' : 'bg-[#1c1c1c]/6 text-[#1c1c1c]'}`}>
                  {shortcutLabels[key].charAt(0)}
                </span>
                <span className={`text-sm font-semibold ${textPrimary}`}>{shortcutLabels[key]}</span>
              </div>
              <button
                onClick={() => setRecordingKey(recordingKey === key ? null : key)}
                className={[
                  'px-4 py-2 rounded-xl font-mono text-xs font-semibold transition-all duration-200 min-w-[140px] text-center',
                  recordingKey === key
                    ? 'tool-accent-bg text-white shadow-sm animate-pulse'
                    : `${isDark ? 'bg-[#252525] text-[#f5f2ed] border-[#ffffff]/10' : 'bg-white text-[#1c1c1c] border-[#1c1c1c]/10'} border hover:opacity-80`,
                ].join(' ')}
              >
                {recordingKey === key ? '按下快捷键...' : formatShortcut(editingShortcuts[key])}
              </button>
            </div>
          ))}

          {/* 提示 */}
          <div className={`mt-4 p-4 rounded-xl border ${isDark ? 'bg-[#f4a261]/5 border-[#f4a261]/15' : 'bg-[#d65a31]/5 border-[#d65a31]/12'}`}>
            <p className={`text-xs font-bold mb-2 tool-accent`}>提示</p>
            <div className={`text-xs space-y-1 ${textSecondary}`}>
              <p>• 快捷键必须包含 Ctrl (Windows) 或 ⌘ (Mac)</p>
              <p>• 可组合 Shift、Alt 等修饰键</p>
              <p>• 点击按钮后按下新的快捷键即可设置</p>
            </div>
          </div>
        </div>

        {/* 底部操作 */}
        <div className={`flex items-center justify-between px-6 py-4 border-t ${borderClass} ${surfaceClass}`}>
          <button
            onClick={() => setEditingShortcuts(DEFAULT_SHORTCUTS)}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${textSecondary} ${hoverSurface}`}
          >
            <RotateCcw size={13} />
            恢复默认
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${textSecondary} ${hoverSurface}`}
            >
              取消
            </button>
            <button
              onClick={() => {
                onSave(editingShortcuts)
                saveShortcuts(editingShortcuts)
                onClose()
              }}
              className="px-5 py-2 text-xs font-bold rounded-xl transition-all duration-200 tool-accent-bg text-white hover:opacity-90 shadow-sm"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
