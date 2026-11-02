import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { FileText, Monitor, Palette, Smartphone, XIcon, Search, ChevronRight, ChevronDown, ChevronUp, ChevronsDown, ChevronsUp, Pencil, Check } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { pages, type PageCategory } from '../config/pages'
import { docModules } from '../config/docs'
import { getThemeInfo, themeModules } from '../config/themes'
import { loadPageNavigation, savePageNavigation, type PageNavigationData, type PageTree } from '../lib/pageNavigation'
import { useBuildVerification } from '../hooks/useBuildVerification'

interface SidebarProps {
  projectName: string
  onProjectNameChange: (name: string) => void
  collapsed: boolean
}

interface PageListProps {
  filteredPages: typeof pages
  icon: typeof Smartphone
  tree: PageTree[]
  onTreeChange: (tree: PageTree[]) => void
}

const flattenTree = (tree: PageTree[]): string[] => tree.flatMap(node => [node.path, ...flattenTree(node.children)])

const findParentPath = (tree: PageTree[], path: string): string | null => {
  for (const node of tree) {
    if (node.children.some(child => child.path === path)) return node.path
    const parentPath = findParentPath(node.children, path)
    if (parentPath) return parentPath
  }
  return null
}

const createPageTree = (items: typeof pages, saved: PageTree[], category: PageCategory): PageTree[] => {
  const categoryPaths = new Set(items.filter(item => item.category === category).map(item => item.path))
  const used = new Set<string>()
  const clean = (nodes: PageTree[], depth = 0): PageTree[] => nodes.flatMap(node => {
    if (!categoryPaths.has(node.path) || used.has(node.path)) return []
    used.add(node.path)
    return [{ path: node.path, ...(node.label ? { label: node.label } : {}), children: clean(node.children, depth + 1) }]
  })
  const tree = clean(saved)
  items.filter(item => item.category === category && !used.has(item.path)).forEach(item => tree.push({ path: item.path, children: [] }))
  return tree
}

const updateTree = (tree: PageTree[], source: string, target: string, position: 'before' | 'after' | 'inside'): PageTree[] => {
  let moving: PageTree | undefined
  const extract = (nodes: PageTree[]): PageTree[] => nodes.flatMap(node => {
    if (node.path === source) { moving = node; return [] }
    return [{ ...node, children: extract(node.children) }]
  })
  const remaining = extract(tree)
  if (!moving || source === target || flattenTree([moving]).includes(target)) return tree
  if (position === 'inside') {
    const insert = (nodes: PageTree[]): PageTree[] => nodes.map(node => node.path === target ? { ...node, children: [...node.children, moving!] } : { ...node, children: insert(node.children) })
    return insert(remaining)
  }
  const insert = (nodes: PageTree[]): PageTree[] => {
    const index = nodes.findIndex(node => node.path === target)
    if (index >= 0) { const next = [...nodes]; next.splice(index + (position === 'after' ? 1 : 0), 0, moving!); return next }
    return nodes.map(node => ({ ...node, children: insert(node.children) }))
  }
  return insert(remaining)
}

const updateNodeLabel = (tree: PageTree[], path: string, label: string): PageTree[] => tree.map(node =>
  node.path === path ? { ...node, label } : { ...node, children: updateNodeLabel(node.children, path, label) },
)

const PageList = ({ filteredPages, icon: Icon, tree, onTreeChange }: PageListProps) => {
  const [draggedPath, setDraggedPath] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<{ path: string; position: 'before' | 'after' | 'inside' } | null>(null)
  const [collapsedPaths, setCollapsedPaths] = useState<Set<string>>(new Set())
  const [contextMenu, setContextMenu] = useState<{ path: string; x: number; y: number } | null>(null)
  const [renamingPath, setRenamingPath] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const pageByPath = new Map(filteredPages.map(page => [page.path, page]))
  const visiblePaths = new Set(filteredPages.map(page => page.path))
  const filterTree = (nodes: PageTree[]): PageTree[] => nodes.flatMap(node => {
    const children = filterTree(node.children)
    return visiblePaths.has(node.path) ? [{ ...node, children }] : children
  })
  const visibleTree = filterTree(tree)

  const moveByKeyboard = (path: string, direction: 'up' | 'down' | 'in' | 'out') => {
    const flat = flattenTree(tree)
    const index = flat.indexOf(path)
    const target = direction === 'up' ? flat[index - 1] : direction === 'down' ? flat[index + 1] : undefined
    if (target && (direction === 'up' || direction === 'down')) onTreeChange(updateTree(tree, path, target, direction === 'up' ? 'before' : 'after'))
    if (direction === 'in' && index > 0) onTreeChange(updateTree(tree, path, flat[index - 1], 'inside'))
    if (direction === 'out') {
      const parentPath = findParentPath(tree, path)
      if (parentPath) onTreeChange(updateTree(tree, path, parentPath, 'after'))
    }
  }

  const allPaths = flattenTree(tree)
  const getNode = (nodes: PageTree[], path: string): PageTree | undefined => {
    for (const node of nodes) {
      if (node.path === path) return node
      const child = getNode(node.children, path)
      if (child) return child
    }
    return undefined
  }
  const openContextMenu = (event: React.MouseEvent, path: string) => {
    event.preventDefault()
    setContextMenu({ path, x: Math.min(event.clientX, window.innerWidth - 205), y: Math.min(event.clientY, window.innerHeight - 230) })
    setRenamingPath(null)
  }
  const renameNode = () => {
    if (!contextMenu || !renameValue.trim()) return
    onTreeChange(updateNodeLabel(tree, contextMenu.path, renameValue.trim()))
    setContextMenu(null)
    setRenamingPath(null)
  }

  const renderContextMenu = () => {
    if (!contextMenu) return null
    const node = getNode(tree, contextMenu.path)
    if (!node) return null
    const actionClass = 'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs text-[var(--tool-text)] hover:bg-[var(--tool-surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tool-focus)]'
    return createPortal(<>
      <button aria-label="关闭菜单操作面板" className="fixed inset-0 z-[1100] cursor-default" onClick={() => { setContextMenu(null); setRenamingPath(null) }} />
      <div role="menu" className="fixed z-[1101] w-48 rounded-xl border border-[var(--tool-border)] tool-panel-light dark:tool-panel-dark p-1.5 shadow-xl" style={{ left: contextMenu.x, top: contextMenu.y }}>
        {renamingPath === contextMenu.path ? (
          <form className="flex gap-1 p-1" onSubmit={event => { event.preventDefault(); renameNode() }}>
            <input autoFocus value={renameValue} onChange={event => setRenameValue(event.target.value)} aria-label="菜单名称" className="min-w-0 flex-1 rounded-md border border-[var(--tool-border)] bg-[var(--tool-background)] px-2 py-1.5 text-xs text-[var(--tool-text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--tool-focus)]" />
            <button type="submit" aria-label="保存名称" className="rounded-md p-1.5 text-[var(--tool-text)] hover:bg-[var(--tool-surface-hover)]"><Check size={14} /></button>
          </form>
        ) : (
          <>
            <button role="menuitem" disabled={!node.children.length} className={`${actionClass} disabled:cursor-not-allowed disabled:opacity-40`} onClick={() => { setCollapsedPaths(current => { const next = new Set(current); if (next.has(node.path)) next.delete(node.path); else next.add(node.path); return next }); setContextMenu(null) }}>
              {collapsedPaths.has(node.path) ? <ChevronDown size={15} /> : <ChevronUp size={15} />}{collapsedPaths.has(node.path) ? '展开' : '折叠'}
            </button>
            <button role="menuitem" className={actionClass} onClick={() => { setCollapsedPaths(new Set(allPaths)); setContextMenu(null) }}><ChevronsDown size={15} />折叠全部</button>
            <button role="menuitem" className={actionClass} onClick={() => { setCollapsedPaths(new Set()); setContextMenu(null) }}><ChevronsUp size={15} />展开全部</button>
            <div className="my-1 border-t border-[var(--tool-border)]" />
            <button role="menuitem" className={actionClass} onClick={() => { setRenameValue(node.label ?? pageByPath.get(node.path)?.label ?? ''); setRenamingPath(node.path) }}><Pencil size={15} />重命名</button>
          </>
        )}
      </div>
    </>, document.body)
  }

  const renderNode = (node: PageTree, depth = 0): React.ReactNode => {
    const page = pageByPath.get(node.path)
    if (!page) return null
    return <div key={node.path}>
      <div
        draggable
        onContextMenu={event => openContextMenu(event, node.path)}
        onDragStart={event => { setDraggedPath(node.path); event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', node.path) }}
        onDragEnd={() => { setDraggedPath(null); setDropTarget(null) }}
        onDragOver={event => {
          if (!draggedPath || draggedPath === node.path) return
          event.preventDefault()
          const rect = event.currentTarget.getBoundingClientRect()
          const ratio = (event.clientY - rect.top) / rect.height
          setDropTarget({ path: node.path, position: ratio < 0.25 ? 'before' : ratio > 0.75 ? 'after' : 'inside' })
        }}
        onDrop={event => {
          event.preventDefault()
          if (draggedPath && dropTarget?.path === node.path) onTreeChange(updateTree(tree, draggedPath, node.path, dropTarget.position))
          setDraggedPath(null); setDropTarget(null)
        }}
        className={`relative flex items-center rounded-xl ${dropTarget?.path === node.path ? dropTarget.position === 'inside' ? 'ring-1 ring-inset ring-[var(--tool-focus)] bg-[var(--tool-surface-hover)]' : dropTarget.position === 'before' ? 'before:absolute before:inset-x-2 before:top-0 before:border-t-2 before:border-[var(--tool-focus)]' : 'after:absolute after:inset-x-2 after:bottom-0 after:border-b-2 after:border-[var(--tool-focus)]' : ''}`}
        style={{ marginLeft: depth ? 14 : 0 }}
      >
        <NavLink
          to={page.path}
          title={node.label ?? page.label}
          aria-label={`${node.label ?? page.label}。方向键上下来排序，右方向键设为上一项子项，左方向键移出父级`}
          aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight"
          onKeyDown={event => {
            const direction = { ArrowUp: 'up', ArrowDown: 'down', ArrowRight: 'in', ArrowLeft: 'out' }[event.key] as 'up' | 'down' | 'in' | 'out' | undefined
            if (direction) { event.preventDefault(); moveByKeyboard(node.path, direction) }
          }}
          className={({ isActive }) => `group flex min-w-0 flex-1 items-center gap-2.5 px-3 py-2 rounded-xl text-xs leading-5 tool-control cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tool-focus)] ${isActive ? 'tool-menu-active-light dark:tool-menu-active-dark' : 'text-[var(--tool-text-muted)] hover:bg-[var(--tool-surface-hover)] hover:text-[var(--tool-text)]'}`}
        >
          <Icon size={15} className="opacity-80" />
          <span className="truncate font-medium">{node.label ?? page.label}</span>
          <ChevronRight size={12} className="ml-auto opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
        </NavLink>
      </div>
      {!collapsedPaths.has(node.path) && node.children.map(child => renderNode(child, depth + 1))}
    </div>
  }

  return (
    <div className="space-y-0.5" onDragOver={event => event.preventDefault()} onDrop={() => { setDraggedPath(null); setDropTarget(null) }}>
      {visibleTree.map(node => renderNode(node))}
      {renderContextMenu()}
    </div>
  )
}

interface ThemeNavProps {
  searchQuery: string
}

const ThemeNav = ({ searchQuery }: ThemeNavProps) => {
  const themes = useMemo(() => Object.keys(themeModules).map((path) => {
      const match = path.match(/\.\.\/\.\.\/src\/themes\/([^/]+)\//)
      if (match) {
        const dirName = match[1]
        const info = getThemeInfo(dirName)
        return { id: dirName, name: info.name, description: info.description }
      }
      return null
    }).filter(Boolean) as { id: string; name: string; description: string }[], [])

  const filteredThemes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return query
      ? themes.filter(theme => theme.name.toLowerCase().includes(query) || theme.description.toLowerCase().includes(query))
      : themes
  }, [searchQuery, themes])

  return (
    <div className="space-y-0.5">
      <div className="px-3 py-2 tool-section-label">
        设计系统主题
      </div>
      {filteredThemes.map((theme) => (
        <NavLink
          key={theme.id}
          to={`/theme/${theme.id}`}
          title={theme.name}
          className={({ isActive }) =>
            `group flex items-center gap-3 px-3 py-2 rounded-xl text-xs leading-5 tool-control ${
              isActive
                ? 'tool-menu-active-light dark:tool-menu-active-dark'
                : 'text-[var(--tool-text-muted)] hover:bg-[var(--tool-surface-hover)] hover:text-[var(--tool-text)]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-[var(--tool-brand)]/10' : 'bg-[var(--tool-surface-muted)]'}`}>
                <Palette size={13} className={isActive ? 'tool-accent' : ''} />
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <span className="truncate font-medium">{theme.name}</span>
                <span className="text-[11px] leading-4 text-[var(--tool-text-subtle)]">{theme.description}</span>
              </div>
            </>
          )}
        </NavLink>
      ))}
    </div>
  )
}

interface DocNavProps {
  searchQuery: string
}

const DocNav = ({ searchQuery }: DocNavProps) => {
  const docs = useMemo(() => Object.entries(docModules).map(([path]) => {
      const match = path.match(/\.\.\/\.\.\/src\/docs\/(.+)\.md$/)
      if (match) {
        const fileName = match[1]
        return { id: fileName, name: fileName, path: `/doc/${fileName}` }
      }
      return null
    }).filter(Boolean) as { id: string; name: string; path: string }[], [])

  const filteredDocs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return query ? docs.filter(doc => doc.name.toLowerCase().includes(query)) : docs
  }, [docs, searchQuery])

  return (
    <div className="space-y-0.5">
      <div className="px-3 py-2 tool-section-label">
        项目文档
      </div>
      {filteredDocs.map((doc) => (
        <NavLink
          key={doc.id}
          to={doc.path}
          title={doc.name}
          className={({ isActive }) =>
            `group flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs leading-5 tool-control ${
              isActive
                ? 'tool-menu-active-light dark:tool-menu-active-dark'
                : 'text-[var(--tool-text-muted)] hover:bg-[var(--tool-surface-hover)] hover:text-[var(--tool-text)]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <FileText size={15} className={isActive ? 'tool-accent' : ''} />
              <span className="truncate font-medium">{doc.name}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  )
}

export const Sidebar = ({ projectName, onProjectNameChange, collapsed }: SidebarProps) => {
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState(projectName)
  const [activeTab, setActiveTab] = useState<PageCategory | 'themes' | 'docs'>('frontend')
  const [searchQuery, setSearchQuery] = useState('')
  const [pageTrees, setPageTrees] = useState<PageNavigationData>({ frontend: [], admin: [] })
  const [navigationReady, setNavigationReady] = useState(false)
  const [navigationError, setNavigationError] = useState<string | null>(null)
  const { requestVerification, verificationDialog } = useBuildVerification()

  useEffect(() => {
    let cancelled = false
    loadPageNavigation()
      .then(data => { if (!cancelled) setPageTrees(data) })
      .catch(error => {
        if (!cancelled) setNavigationError(error instanceof Error ? error.message : '菜单配置读取失败')
      })
      .finally(() => { if (!cancelled) setNavigationReady(true) })
    return () => { cancelled = true }
  }, [])

  const pageTree = useMemo(() => activeTab === 'frontend' || activeTab === 'admin'
    ? createPageTree(pages, pageTrees[activeTab] ?? [], activeTab)
    : [], [activeTab, pageTrees])

  const savePageTree = async (nextTree: PageTree[]) => {
    if (activeTab !== 'frontend' && activeTab !== 'admin') return
    const nextTrees = { ...pageTrees, [activeTab]: nextTree }
    try {
      await savePageNavigation(nextTrees)
      setPageTrees(nextTrees)
      setNavigationError(null)
    } catch (error) {
      setNavigationError(error instanceof Error ? error.message : '菜单配置保存失败')
    }
  }

  const filteredPages = useMemo(() => {
    const categoryPages = pages.filter(p => p.category === activeTab as PageCategory)
    const query = searchQuery.trim().toLowerCase()
    if (!query) return categoryPages
    return categoryPages.filter(p => p.label.toLowerCase().includes(query))
  }, [activeTab, searchQuery])

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      onProjectNameChange(tempName.trim())
    } else {
      setTempName(projectName)
    }
    setIsEditingName(false)
  }

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit()
    } else if (e.key === 'Escape') {
      setTempName(projectName)
      setIsEditingName(false)
    }
  }

  const tabs = [
    { key: 'frontend' as const, label: '前端', icon: Smartphone },
    { key: 'admin' as const, label: '后台', icon: Monitor },
    { key: 'themes' as const, label: '主题', icon: Palette },
    { key: 'docs' as const, label: '文档', icon: FileText },
  ]

  return (
    <aside
      className={`flex flex-col h-screen z-[1000] transition-[width,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
        collapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-[260px] opacity-100'
      } tool-surface-light dark:tool-surface-dark shadow-[8px_0_24px_color-mix(in_srgb,var(--tool-text)_4%,transparent)]`}
    >
      {!collapsed && (
        <>
          <div className="flex items-center px-4 py-4 bg-[color-mix(in_srgb,var(--tool-surface)_72%,transparent)]">
            <div className="flex-1 min-w-0">
              {isEditingName ? (
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onBlur={handleNameSubmit}
                  onKeyDown={handleNameKeyDown}
                  autoFocus
                  className="w-full text-sm font-bold bg-transparent border-b-2 border-[var(--tool-brand)] text-[var(--tool-text)] placeholder-[var(--tool-text-subtle)] outline-none transition-colors"
                  placeholder="输入项目名称"
                />
              ) : (
                <h1 className="min-w-0">
                  <button
                    type="button"
                    onClick={() => {
                      setTempName(projectName)
                      setIsEditingName(true)
                    }}
                    title="点击编辑项目名称"
                    className="w-full truncate text-left text-sm font-bold text-[var(--tool-text)] transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tool-focus)]"
                  >
                    {projectName}
                  </button>
                </h1>
              )}
              <p className="text-[10px] mt-1 uppercase tracking-[0.16em] text-[var(--tool-text-subtle)]">
                Prototype Workspace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 p-2.5" role="tablist" aria-label="内容分类">
            {tabs.map(tab => {
              const TabIcon = tab.icon
              const isActive = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 flex flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-medium rounded-xl tool-control ${
                    isActive
                      ? 'tool-menu-active-light dark:tool-menu-active-dark'
                      : 'text-[var(--tool-text-muted)] hover:bg-[var(--tool-surface-hover)] hover:text-[var(--tool-text)]'
                  }`}
                >
                  <TabIcon size={14} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          <div className="px-3 pb-2">
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[var(--tool-border)] bg-[var(--tool-surface-raised)] tool-control focus-within:border-[var(--tool-focus)] focus-within:tool-focus-ring">
              <Search size={14} className="text-[var(--tool-text-subtle)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索..."
                aria-label="搜索当前分类"
                className="flex-1 bg-transparent text-xs text-[var(--tool-text)] placeholder-[var(--tool-text-subtle)] outline-none min-w-0"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-0.5 rounded-md text-[var(--tool-text-subtle)] transition-colors hover:bg-[var(--tool-surface-hover)] hover:text-[var(--tool-text)]"
                >
                  <XIcon size={12} />
                </button>
              )}
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-2 pb-4" aria-label="原型工作区导航">
            {navigationError && <p role="alert" className="px-3 py-2 text-xs text-red-600">菜单配置读写失败：{navigationError}</p>}
            {activeTab === 'frontend' && (
              <PageList filteredPages={filteredPages} icon={Smartphone} tree={pageTree} onTreeChange={nextTree => { if (navigationReady) requestVerification(() => { void savePageTree(nextTree) }) }} />
            )}
            {activeTab === 'admin' && (
              <PageList filteredPages={filteredPages} icon={Monitor} tree={pageTree} onTreeChange={nextTree => { if (navigationReady) requestVerification(() => { void savePageTree(nextTree) }) }} />
            )}
            {activeTab === 'themes' && (
              <ThemeNav searchQuery={searchQuery} />
            )}
            {activeTab === 'docs' && (
              <DocNav searchQuery={searchQuery} />
            )}
          </nav>
      {verificationDialog}
        </>
      )}
    </aside>
  )
}
