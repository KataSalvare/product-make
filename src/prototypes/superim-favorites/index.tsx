/**
 * @name Favorites Page
 * @description List saved messages, media, links and files with type filtering
 * @mode axure
 */

import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../themes/equatorial-minimalism/globals.css';
import './style.css';

type FavoriteType = 'text' | 'image' | 'video' | 'link' | 'file';
type FilterType = 'all' | FavoriteType;

interface Favorite {
  id: string;
  type: FavoriteType;
  source: string;
  content: string;
  preview?: string;
  time: string;
  title?: string;
  url?: string;
  fileName?: string;
  fileSize?: string;
}

const mockFavorites: Favorite[] = [
  {
    id: '1',
    type: 'text',
    source: 'Design Team',
    content: 'Beautiful sunset at the beach today! Nothing beats the view from Lagos coast.',
    time: 'Today',
  },
  {
    id: '2',
    type: 'image',
    source: 'Amara Okafor',
    content: 'Photo',
    preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop',
    time: 'Yesterday',
  },
  {
    id: '3',
    type: 'video',
    source: 'Family Group',
    content: 'Birthday party highlights',
    preview: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
    time: 'Monday',
  },
  {
    id: '4',
    type: 'link',
    source: 'Tech Support',
    content: 'https://react.dev/learn',
    title: 'React – Learn',
    url: 'https://react.dev/learn',
    time: 'Sunday',
  },
  {
    id: '5',
    type: 'file',
    source: 'Chioma Nnamdi',
    content: 'Project brief.pdf',
    fileName: 'Project brief.pdf',
    fileSize: '2.4 MB',
    time: 'Last week',
  },
  {
    id: '6',
    type: 'text',
    source: 'Oluwaseun Adeyemi',
    content: 'Meeting notes: launch date confirmed for Aug 15.',
    time: 'Last week',
  },
];

const filters: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'text', label: 'Text' },
  { id: 'image', label: 'Image' },
  { id: 'video', label: 'Video' },
  { id: 'link', label: 'Link' },
  { id: 'file', label: 'File' },
];

const typeIcon = (type: FavoriteType) => {
  switch (type) {
    case 'text':
      return 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z';
    case 'image':
      return 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z';
    case 'video':
      return 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z';
    case 'link':
      return 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1';
    case 'file':
      return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
  }
};

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Favorite[]>(mockFavorites);
  const [contextMenu, setContextMenu] = useState<{ itemId: string; x: number; y: number } | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<'single' | 'multi' | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const isSelectionMode = selectedIds.length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setContextMenu(null);
      }
    };
    if (contextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [contextMenu]);

  const filteredFavorites = useMemo(() => {
    return favorites.filter((item) => {
      const matchesType = activeFilter === 'all' || item.type === activeFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q || item.content.toLowerCase().includes(q) || item.source.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [favorites, activeFilter, searchQuery]);

  const handleItemClick = (item: Favorite) => {
    if (isSelectionMode) {
      toggleSelection(item.id);
    } else {
      navigate(`/favorite/${item.id}`);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleContextMenu = (e: React.MouseEvent | React.TouchEvent, item: Favorite) => {
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const menuWidth = 180;
    const menuHeight = 160;
    let x = clientX;
    let y = clientY;

    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 16;
    }
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 16;
    }

    setContextMenu({ itemId: item.id, x, y });
  };

  const enterSelectionMode = (initialId: string) => {
    setSelectedIds([initialId]);
    setContextMenu(null);
  };

  const exitSelectionMode = () => {
    setSelectedIds([]);
  };

  const handleForward = (ids: string[]) => {
    const query = ids.map((id) => `favoriteId=${id}`).join('&');
    navigate(`/forward-message?${query}`);
  };

  const handleDelete = () => {
    if (showDeleteConfirm === 'single' && contextMenu) {
      setFavorites((prev) => prev.filter((item) => item.id !== contextMenu.itemId));
    } else if (showDeleteConfirm === 'multi') {
      setFavorites((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
      setSelectedIds([]);
    }
    setShowDeleteConfirm(null);
    setContextMenu(null);
  };

  return (
    <div className="h-full bg-[var(--surface)] flex flex-col">
      {/* Header */}
      <header className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          {isSelectionMode ? (
            <>
              <div className="flex items-center gap-3">
                <button
                  onClick={exitSelectionMode}
                  className="p-2 -ml-2 hover:bg-[var(--surface-container)] rounded-full transition-colors"
                >
                  <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h1 className="text-headline-md text-[var(--primary)]">{selectedIds.length} selected</h1>
              </div>
              <button
                onClick={() => setSelectedIds(filteredFavorites.map((item) => item.id))}
                className="text-label-lg font-medium text-[var(--secondary)] px-2 py-1 rounded-lg hover:bg-[var(--secondary-container)] transition-colors"
              >
                Select All
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button className="p-2 -ml-2 hover:bg-[var(--surface-container)] rounded-full transition-colors">
                <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-headline-md text-[var(--primary)]">Favorites</h1>
            </div>
          )}
        </div>
      </header>

      {/* Search */}
      <div className="px-4 py-3 bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)]">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search favorites..."
            className="w-full pl-10 pr-10 py-2.5 bg-[var(--surface-container-lowest)] rounded-xl text-body-md text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-[var(--surface-container-high)] rounded-full transition-colors"
            >
              <svg className="w-4 h-4 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Type Tabs */}
      <div className="px-4 py-3 bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full text-label-md transition-all ${
                activeFilter === filter.id
                  ? 'bg-[var(--secondary)] text-[var(--on-secondary)]'
                  : 'bg-[var(--surface-container)] text-[var(--on-surface)] hover:bg-[var(--surface-container-high)]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Favorites List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredFavorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-20 h-20 bg-[var(--surface-container-low)] rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-[var(--on-surface-variant)]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <p className="text-title-md font-semibold text-[var(--on-surface)] mb-1">No favorites</p>
            <p className="text-body-md text-[var(--on-surface-variant)] text-center">
              {searchQuery ? 'Try a different search term' : 'Long press a message to add it here'}
            </p>
          </div>
        ) : (
          filteredFavorites.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                onContextMenu={(e) => handleContextMenu(e, item)}
                onTouchStart={(e) => {
                  const timer = setTimeout(() => handleContextMenu(e, item), 600);
                  const clear = () => clearTimeout(timer);
                  e.currentTarget.addEventListener('touchend', clear, { once: true });
                  e.currentTarget.addEventListener('touchmove', clear, { once: true });
                }}
                className={`w-full text-left rounded-2xl p-4 shadow-ambient-sm border transition-colors relative ${
                  isSelected
                    ? 'bg-[var(--secondary-container)] border-[var(--secondary)]'
                    : 'bg-[var(--surface-container-lowest)] border-[var(--outline-variant)]/50 hover:bg-[var(--surface-container-low)]'
                }`}
              >
                <div className="flex items-start gap-3">
                  {isSelectionMode && (
                    <div className="mt-1 flex-shrink-0">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? 'bg-[var(--secondary)] border-[var(--secondary)]'
                            : 'border-[var(--on-surface-variant)]/40'
                        }`}
                      >
                        {isSelected && (
                          <svg className="w-3.5 h-3.5 text-[var(--on-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="w-10 h-10 bg-[var(--secondary-container)] rounded-xl flex items-center justify-center text-[var(--secondary)] flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={typeIcon(item.type)} />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-label-sm text-[var(--secondary)]">{item.source}</span>
                      <span className="text-label-xs text-[var(--on-surface-variant)]">{item.time}</span>
                    </div>
                    {item.type === 'image' && item.preview ? (
                      <img src={item.preview} alt="Favorite" className="w-full h-40 object-cover rounded-xl mb-2" />
                    ) : item.type === 'video' && item.preview ? (
                      <div className="relative w-full h-40 rounded-xl overflow-hidden mb-2">
                        <img src={item.preview} alt="Video thumbnail" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-[var(--primary)] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ) : null}
                    <p className={`text-body-md text-[var(--on-surface)] line-clamp-2 ${item.type === 'link' ? 'text-[var(--primary)] underline' : ''}`}>
                      {item.type === 'link' ? item.title || item.url : item.content}
                    </p>
                    {item.type === 'file' && (
                      <p className="text-label-xs text-[var(--on-surface-variant)] mt-1">{item.fileSize}</p>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          ref={menuRef}
          className="fixed z-50 min-w-[180px] bg-[var(--surface-container-low)] rounded-xl shadow-ambient-lg py-2"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => { handleForward([contextMenu.itemId]); setContextMenu(null); }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface)]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span className="text-body-sm">Forward</span>
          </button>
          <button
            onClick={() => enterSelectionMode(contextMenu.itemId)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface)]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-body-sm">Multi-select</span>
          </button>
          <div className="h-px bg-[var(--outline-variant)] mx-4 my-1" />
          <button
            onClick={() => { setShowDeleteConfirm('single'); setContextMenu(null); }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container)] transition-colors text-[var(--error)]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="text-body-sm">Delete</span>
          </button>
        </div>
      )}

      {/* Selection Bottom Bar */}
      {isSelectionMode && (
        <div className="bg-[var(--surface-container-low)] border-t border-[var(--outline-variant)] px-4 py-3 z-30">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => handleForward(selectedIds)}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[var(--secondary)] text-[var(--on-secondary)] text-label-lg font-medium hover:opacity-90 transition-colors disabled:opacity-50"
              disabled={selectedIds.length === 0}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Forward
            </button>
            <button
              onClick={() => setShowDeleteConfirm('multi')}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[var(--error)] text-[var(--on-error)] text-label-lg font-medium hover:opacity-90 transition-colors disabled:opacity-50"
              disabled={selectedIds.length === 0}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl w-full max-w-[320px] p-6">
            <h3 className="text-title-md font-semibold text-[var(--on-surface)] mb-2">
              {showDeleteConfirm === 'multi' ? `Delete ${selectedIds.length} items?` : 'Delete this item?'}
            </h3>
            <p className="text-body-md text-[var(--on-surface-variant)] mb-6">
              {showDeleteConfirm === 'multi'
                ? 'The selected favorites will be removed. This action cannot be undone.'
                : 'This favorite will be removed. This action cannot be undone.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--surface-container)] text-[var(--on-surface)] text-label-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--error)] text-[var(--on-error)] text-label-lg font-medium hover:opacity-90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Component = FavoritesPage;
export default Component;
