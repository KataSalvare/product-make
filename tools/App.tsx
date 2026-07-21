import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useCallback, useEffect, useMemo, useState } from 'react'
import DocDrawer from './components/DocDrawer'
import { Sidebar } from './shell/Sidebar'
import { Topbar } from './shell/Topbar'
import { useAnnotationController } from './tools/AnnotationController'
import { pages } from './config/pages'
import { loadProjectName, loadShortcuts, loadTheme, saveProjectName, saveTheme, type Theme } from './lib/shortcuts'
import { HomePage } from '@/workspace/HomePage'
import { ThemeDetailPage } from '@/workspace/ThemeDetailPage'
import { ThemesListPage } from '@/workspace/ThemesListPage'
import { DocDetailPage } from '@/workspace/DocDetailPage'
import { DocsListPage } from '@/workspace/DocsListPage'

const DEFAULT_PROJECT_NAME = '项目原型预览'

function AppContent() {
  const location = useLocation()
  const [previewContainer, setPreviewContainer] = useState<HTMLElement | null>(null)
  const previewRef = useCallback((node: HTMLDivElement | null) => {
    setPreviewContainer(node)
  }, [])

  const [deviceMode, setDeviceMode] = useState<'mobile' | 'pc'>(() => {
    const page = pages.find(p => p.path === location.pathname)
    return page?.category === 'admin' ? 'pc' : 'mobile'
  })

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('prototype-sidebar-collapsed') === 'true'
    } catch {
      return false
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem('prototype-sidebar-collapsed', String(sidebarCollapsed))
    } catch {
      // ignore
    }
  }, [sidebarCollapsed])

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [shortcuts, setShortcuts] = useState(loadShortcuts)
  const [theme, setTheme] = useState<Theme>(loadTheme)
  const [projectName, setProjectName] = useState<string>(loadProjectName)
  const [docOpen, setDocOpen] = useState(false)
  const [docTab, setDocTab] = useState<'spec' | 'annotations'>('spec')

  const { state: annotationState, actions: annotationActions, ui: annotationUI, docDrawerProps } = useAnnotationController({
    previewContainer,
    currentPath: location.pathname,
    theme,
    onOpenDocAnnotations: useCallback(() => {
      setDocTab('annotations')
      setDocOpen(true)
    }, []),
  })

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    saveTheme(newTheme)
  }, [theme])

  const handleProjectNameChange = useCallback((name: string) => {
    setProjectName(name)
    saveProjectName(name)
  }, [])

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const inferredDeviceMode = useMemo<'mobile' | 'pc'>(() => {
    const page = pages.find((p) => p.path === location.pathname)
    const isThemeOrDoc =
      location.pathname === '/' ||
      location.pathname.startsWith('/theme') ||
      location.pathname.startsWith('/doc') ||
      location.pathname === '/themes' ||
      location.pathname === '/docs'
    return page?.category === 'admin' || isThemeOrDoc ? 'pc' : 'mobile'
  }, [location.pathname])

  useEffect(() => {
    queueMicrotask(() => setDeviceMode(inferredDeviceMode))
  }, [inferredDeviceMode])

  const handleOpenDoc = useCallback(() => {
    setDocTab('spec')
    setDocOpen(true)
  }, [])

  const handleToggleDoc = useCallback(() => {
    if (docOpen) {
      setDocOpen(false)
    } else {
      setDocTab('spec')
      setDocOpen(true)
    }
  }, [docOpen])

  const currentPage = useMemo(() => pages.find(p => p.path === location.pathname), [location.pathname])

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-100'}`}>
      <Sidebar
        theme={theme}
        projectName={projectName || DEFAULT_PROJECT_NAME}
        onProjectNameChange={handleProjectNameChange}
        collapsed={sidebarCollapsed}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          deviceMode={deviceMode}
          setDeviceMode={setDeviceMode}
          showToast={showToast}
          shortcuts={shortcuts}
          setShortcuts={setShortcuts}
          theme={theme}
          toggleTheme={toggleTheme}
          annotationState={annotationState}
          annotationActions={annotationActions}
          docOpen={docOpen}
          onOpenDoc={handleOpenDoc}
          onToggleDoc={handleToggleDoc}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebarCollapsed={() => setSidebarCollapsed(prev => !prev)}
        />

        <main className="flex-1 overflow-hidden flex flex-col relative">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[400px] z-[1100] space-y-2 pointer-events-none">
            {toast && (
              <div className={`px-4 py-2 rounded-lg shadow-lg text-sm font-medium text-center pointer-events-auto ${
                toast.type === 'success'
                  ? 'bg-gray-900 text-white'
                  : 'bg-red-500 text-white'
              }`}>
                {toast.message}
              </div>
            )}
          </div>

          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-auto p-4">
              <div
                className={`relative z-[100] mx-auto transition-all duration-300 ${
                  deviceMode === 'mobile'
                    ? 'w-[400px] h-[852px] mt-20'
                    : 'w-full h-full'
                }`}
              >
                <div
                  ref={previewRef}
                  id="preview-container"
                  className={`w-full h-full bg-white shadow-lg ${
                    deviceMode === 'mobile' ? 'shadow-2xl overflow-hidden' : 'rounded-lg'
                  }`}
                  style={{ transform: 'translateZ(0)' }}
                >
                  <div className={`${deviceMode === 'mobile' ? 'h-full overflow-y-auto overscroll-contain' : 'w-full h-full overflow-auto'}`}>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      {pages.map(page => (
                        <Route key={page.path} path={page.path} element={<page.component />} />
                      ))}
                      <Route path="/themes" element={<ThemesListPage />} />
                      <Route path="/theme/:themeId" element={<ThemeDetailPage />} />
                      <Route path="/docs" element={<DocsListPage />} />
                      <Route path="/doc/:docId" element={<DocDetailPage />} />
                    </Routes>
                  </div>
                </div>

                {annotationUI}
              </div>
            </div>

            {docOpen && (
              <DocDrawer
                isOpen={docOpen}
                onClose={() => setDocOpen(false)}
                currentPage={currentPage}
                docTab={docTab}
                setDocTab={setDocTab}
                theme={theme}
                {...docDrawerProps}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
