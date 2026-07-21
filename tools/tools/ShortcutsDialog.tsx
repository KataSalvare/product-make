import React, { useEffect, useState } from 'react'
import { Keyboard, XIcon } from 'lucide-react'
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

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative rounded-xl shadow-2xl w-[480px] max-w-[90vw] overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <Keyboard className="text-blue-600" size={24} />
            <div>
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>快捷键设置</h2>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                检测到系统: {os === 'mac' ? 'macOS' : os === 'windows' ? 'Windows' : os === 'linux' ? 'Linux' : '未知'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-600'}`}>
            <XIcon size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {(Object.keys(shortcutLabels) as Array<keyof ShortcutConfig>).map((key) => (
            <div key={key} className={`flex items-center justify-between p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-gray-50'}`}>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{shortcutLabels[key]}</span>
              <button
                onClick={() => setRecordingKey(recordingKey === key ? null : key)}
                className={`px-4 py-2 rounded-lg font-mono text-sm transition-colors ${
                  recordingKey === key
                    ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500 animate-pulse'
                    : isDark
                      ? 'bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600'
                      : 'bg-white border hover:bg-gray-50'
                }`}
              >
                {recordingKey === key ? '按下快捷键...' : formatShortcut(editingShortcuts[key])}
              </button>
            </div>
          ))}

          <div className={`text-sm p-3 rounded-lg ${isDark ? 'bg-blue-900/30 text-slate-300' : 'bg-blue-50 text-gray-500'}`}>
            <p className={`font-medium mb-1 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>提示</p>
            <p>• 快捷键必须包含 Ctrl (Windows) 或 ⌘ (Mac)</p>
            <p>• 可组合 Shift、Alt 等修饰键</p>
            <p>• 点击按钮后按下新的快捷键即可设置</p>
          </div>
        </div>

        <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${isDark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-gray-50'}`}>
          <button
            onClick={() => setEditingShortcuts(DEFAULT_SHORTCUTS)}
            className={`px-4 py-2 rounded-lg transition-colors ${isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-600 hover:bg-gray-200'}`}
          >
            恢复默认
          </button>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg transition-colors ${isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-600 hover:bg-gray-200'}`}
          >
            取消
          </button>
          <button
            onClick={() => {
              onSave(editingShortcuts)
              saveShortcuts(editingShortcuts)
              onClose()
            }}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}
