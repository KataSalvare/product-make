import React, { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  FileText,
  Keyboard,
  Monitor,
  Moon,
  Pencil,
  Save,
  Smartphone,
  Sun,
  Trash2,
  Eye,
  EyeOff,
  MousePointer,
  XIcon,
} from 'lucide-react'
import { TooltipButton } from './TooltipButton'
import { ShortcutsDialog } from '../tools/ShortcutsDialog'
import {
  formatShortcut,
  isShortcutModalOpen,
  matchShortcut,
  saveShortcuts,
  type ShortcutConfig,
  type Theme,
} from '../lib/shortcuts'
import { pages } from '../config/pages'
import type { AnnotationControllerActions, AnnotationControllerState } from '../tools/AnnotationController'

// 自定义侧边栏折叠/展开图标
const SidebarToggleIcon: React.FC<{ collapsed: boolean }> = ({ collapsed }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <line x1="9" y1="5" x2="9" y2="19" />
    {collapsed ? (
      <path d="M13 9l3 3-3 3" />
    ) : (
      <path d="M17 9l-3 3 3 3" />
    )}
  </svg>
)

interface TopbarProps {
  deviceMode: 'mobile' | 'pc'
  setDeviceMode: (mode: 'mobile' | 'pc') => void
  showToast: (message: string, type?: 'success' | 'error') => void
  shortcuts: ShortcutConfig
  setShortcuts: (shortcuts: ShortcutConfig) => void
  theme: Theme
  toggleTheme: () => void
  annotationState: AnnotationControllerState
  annotationActions: AnnotationControllerActions
  docOpen: boolean
  onOpenDoc: () => void
  onToggleDoc: () => void
  sidebarCollapsed: boolean
  onToggleSidebarCollapsed: () => void
}

export const Topbar: React.FC<TopbarProps> = ({
  deviceMode,
  setDeviceMode,
  showToast,
  shortcuts,
  setShortcuts,
  theme,
  toggleTheme,
  annotationState,
  annotationActions,
  docOpen,
  onOpenDoc,
  onToggleDoc,
  sidebarCollapsed,
  onToggleSidebarCollapsed,
}) => {
  const location = useLocation()
  const currentPage = pages.find(p => p.path === location.pathname)
  const [copying, setCopying] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [showAnnotationsBeforeEdit, setShowAnnotationsBeforeEdit] = useState(annotationState.showAnnotations)

  const { showAnnotations, annotationEditMode, annotationSelecting, hasDraft } = annotationState
  const { enableEditMode, exitEditMode, toggleSelecting, toggleShow, setShowAnnotations, saveDraft, clearDraft } = annotationActions

  const hasSpec = currentPage != null
  const isDark = theme === 'dark'

  const copyToFigma = useCallback(async () => {
    setCopying(true)
    try {
      const response = await fetch('/scripts/figma/runner.js')
      const scriptText = await response.text()
      const runnerFn = new Function('return ' + scriptText)()
      await runnerFn('#preview-container')
    } catch (error) {
      console.error('复制到 Figma 失败:', error)
      showToast('复制到 Figma 失败', 'error')
    } finally {
      setCopying(false)
    }
  }, [showToast])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isShortcutModalOpen()) return

      if (matchShortcut(e, shortcuts.copyToFigma)) {
        e.preventDefault()
        copyToFigma()
        return
      }

      if (matchShortcut(e, shortcuts.openDoc)) {
        e.preventDefault()
        onToggleDoc()
        return
      }

      if (matchShortcut(e, shortcuts.selectElement)) {
        e.preventDefault()
        if (!annotationEditMode) {
          setShowAnnotationsBeforeEdit(showAnnotations)
          enableEditMode()
        }
        toggleSelecting()
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts, onToggleDoc, copyToFigma, annotationEditMode, showAnnotations, enableEditMode, toggleSelecting])

  return (
    <>
      <header
        className={`h-12 flex items-center px-3 flex-shrink-0 z-[1000] ${isDark ? 'bg-slate-900 border-b border-slate-800' : 'bg-white border-b border-gray-200'}`}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <TooltipButton
          tooltip={sidebarCollapsed ? '展开侧边栏' : '折叠侧边栏'}
          onClick={(e) => {
            e.stopPropagation()
            onToggleSidebarCollapsed()
          }}
          className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
            isDark
              ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <SidebarToggleIcon collapsed={sidebarCollapsed} />
        </TooltipButton>

        <div className="flex items-center gap-2 ml-3 w-[180px]">
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>当前页面:</span>
          <span className={`text-xs font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{currentPage?.label || '未知页面'}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
            {currentPage?.category === 'frontend' ? '前端' : '后台'}
          </span>
        </div>

        <div className="flex items-center gap-1 rounded-lg p-1">
          <TooltipButton
            tooltip="切换为移动端预览"
            onClick={(e) => {
              e.stopPropagation()
              setDeviceMode('mobile')
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
              deviceMode === 'mobile'
                ? isDark
                  ? 'bg-slate-700 text-blue-400 shadow-sm'
                  : 'bg-white text-blue-600 shadow-sm'
                : isDark
                  ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Smartphone size={14} />
            <span>移动端</span>
          </TooltipButton>
          <TooltipButton
            tooltip="切换为PC端预览"
            onClick={(e) => {
              e.stopPropagation()
              setDeviceMode('pc')
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
              deviceMode === 'pc'
                ? isDark
                  ? 'bg-slate-700 text-blue-400 shadow-sm'
                  : 'bg-white text-blue-600 shadow-sm'
                : isDark
                  ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Monitor size={14} />
            <span>PC端</span>
          </TooltipButton>
        </div>

        <div className={`flex-1 flex items-center justify-center gap-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
          {annotationEditMode ? (
            <>
              <TooltipButton
                tooltip={`选择页面元素 (${formatShortcut(shortcuts.selectElement)})`}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleSelecting()
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                  annotationSelecting
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : isDark
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <MousePointer size={14} />
                <span>{annotationSelecting ? '选择中' : '选择元素'}</span>
              </TooltipButton>
              <TooltipButton
                tooltip="清空当前未保存的批注改动"
                onClick={(e) => {
                  e.stopPropagation()
                  clearDraft()
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                  hasDraft
                    ? isDark
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    : 'opacity-50 cursor-not-allowed'
                }`}
                disabled={!hasDraft}
              >
                <Trash2 size={14} />
                <span>清空</span>
              </TooltipButton>
              <TooltipButton
                tooltip="保存到本地文件"
                onClick={async (e) => {
                  e.stopPropagation()
                  try {
                    await saveDraft()
                    showToast('批注已保存到本地文件', 'success')
                  } catch {
                    showToast('保存失败，请重试', 'error')
                  }
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                  hasDraft
                    ? isDark
                      ? 'text-green-400 hover:bg-green-900/20 hover:text-green-300'
                      : 'text-green-600 hover:bg-green-50 hover:text-green-700'
                    : 'opacity-50 cursor-not-allowed'
                }`}
                disabled={!hasDraft}
              >
                <Save size={14} />
                <span>保存</span>
              </TooltipButton>
              <TooltipButton
                tooltip="退出编辑模式"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowAnnotations(showAnnotationsBeforeEdit)
                  exitEditMode()
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                  isDark
                    ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <XIcon size={14} />
                <span>退出</span>
              </TooltipButton>
            </>
          ) : (
            <>
              <TooltipButton
                tooltip="进入批注编辑模式"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowAnnotationsBeforeEdit(showAnnotations)
                  enableEditMode()
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                  isDark
                    ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Pencil size={14} />
                <span>批注</span>
              </TooltipButton>
              <TooltipButton
                tooltip={showAnnotations ? '隐藏批注图标' : '显示批注图标'}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleShow()
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                  showAnnotations
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : isDark
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {showAnnotations ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{showAnnotations ? '隐藏批注' : '显示批注'}</span>
              </TooltipButton>
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          <TooltipButton
            tooltip={isDark ? '切换到白天模式' : '切换到黑夜模式'}
            onClick={(e) => {
              e.stopPropagation()
              toggleTheme()
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
              isDark
                ? 'text-yellow-400 hover:bg-slate-800'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
            <span>{isDark ? '白天' : '黑夜'}</span>
          </TooltipButton>

          <TooltipButton
            tooltip={`复制到 Figma (${formatShortcut(shortcuts.copyToFigma)})`}
            onClick={async (e) => {
              e.stopPropagation()
              await copyToFigma()
            }}
            disabled={copying}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark
                ? 'text-pink-400 hover:bg-pink-900/20'
                : 'text-pink-700 hover:bg-pink-50'
            }`}
          >
            {copying ? (
              <div className="animate-spin w-3.5 h-3.5 border-2 border-pink-700 border-t-transparent rounded-full" />
            ) : (
              <svg width="14" height="14" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 28.5C19 25.9804 20.0009 23.5641 21.7825 21.7825C23.5641 20.0009 25.9804 19 28.5 19C31.0196 19 33.4359 20.0009 35.2175 21.7825C36.9991 23.5641 38 25.9804 38 28.5C38 31.0196 36.9991 33.4359 35.2175 35.2175C33.4359 36.9991 31.0196 38 28.5 38C25.9804 38 23.5641 36.9991 21.7825 35.2175C20.0009 33.4359 19 31.0196 19 28.5Z" fill="#1ABCFE"/>
                <path d="M0 47.5C0 44.9804 1.00089 42.5641 2.78249 40.7825C4.56408 39.0009 6.98044 38 9.5 38H19V47.5C19 50.0196 17.9991 52.4359 16.2175 54.2175C14.4359 55.9991 12.0196 57 9.5 57C6.98044 57 4.56408 55.9991 2.78249 54.2175C1.00089 52.4359 0 50.0196 0 47.5Z" fill="#0ACF83"/>
                <path d="M19 0V19H28.5C31.0196 19 33.4359 17.9991 35.2175 16.2175C36.9991 14.4359 38 12.0196 38 9.5C38 6.98044 36.9991 4.56408 35.2175 2.78249C33.4359 1.00089 31.0196 0 28.5 0H19Z" fill="#FF7262"/>
                <path d="M0 9.5C0 12.0196 1.00089 14.4359 2.78249 16.2175C4.56408 17.9991 6.98044 19 9.5 19H19V0H9.5C6.98044 0 4.56408 1.00089 2.78249 2.78249C1.00089 4.56408 0 6.98044 0 9.5Z" fill="#F24E1E"/>
                <path d="M0 28.5C0 31.0196 1.00089 33.4359 2.78249 35.2175C4.56408 36.9991 6.98044 38 9.5 38H19V19H9.5C6.98044 19 4.56408 20.0009 2.78249 21.7825C1.00089 23.5641 0 25.9804 0 28.5Z" fill="#A259FF"/>
              </svg>
            )}
            <span>{copying ? '复制中...' : '复制到 Figma'}</span>
          </TooltipButton>

          {hasSpec && (
            <TooltipButton
              tooltip={`查看文档 (${formatShortcut(shortcuts.openDoc)})`}
              onClick={onOpenDoc}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                docOpen
                  ? 'bg-indigo-100 text-indigo-800'
                  : isDark
                    ? 'text-indigo-400 hover:bg-indigo-900/20'
                    : 'text-indigo-700 hover:bg-indigo-50'
              }`}
            >
              <FileText size={14} />
              <span>查看文档</span>
            </TooltipButton>
          )}

          <TooltipButton
            tooltip="快捷键设置"
            onClick={(e) => {
              e.stopPropagation()
              setSettingsOpen(true)
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
              isDark
                ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Keyboard size={14} />
            <span>快捷键</span>
          </TooltipButton>
        </div>
      </header>

      <ShortcutsDialog
        key={settingsOpen ? 'shortcut-open' : 'shortcut-closed'}
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        shortcuts={shortcuts}
        onSave={(newShortcuts) => {
          setShortcuts(newShortcuts)
          saveShortcuts(newShortcuts)
        }}
        theme={theme}
      />
    </>
  )
}
