/**
 * @name Favorites Page
 * @description Telegram-style Saved Messages self-chat with note input and message actions
 * @mode axure
 */

import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../themes/equatorial-minimalism/globals.css';
import './style.css';

type FavoriteType = 'text' | 'image' | 'video' | 'link' | 'file';

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
  isFromMe?: boolean;
  replyTo?: { id: string; content: string };
}

type MenuAction = 'reply' | 'forward' | 'copy' | 'delete' | 'select';

const mockFavorites: Favorite[] = [
  {
    id: '1',
    type: 'file',
    source: 'Chioma Nnamdi',
    content: 'Project brief.pdf',
    fileName: 'Project brief.pdf',
    fileSize: '2.4 MB',
    time: 'Last week',
  },
  {
    id: '2',
    type: 'text',
    source: 'You',
    content: 'Meeting notes: launch date confirmed for Aug 15.',
    time: 'Last week',
    isFromMe: true,
  },
  {
    id: '3',
    type: 'link',
    source: 'Tech Support',
    content: 'https://react.dev/learn',
    title: 'React – Learn',
    url: 'https://react.dev/learn',
    time: 'Sunday, 11:20 AM',
  },
  {
    id: '4',
    type: 'video',
    source: 'Family Group',
    content: 'Birthday party highlights',
    preview: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
    time: 'Monday, 8:00 PM',
  },
  {
    id: '5',
    type: 'image',
    source: 'Amara Okafor',
    content: 'Photo',
    preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop',
    time: 'Yesterday, 4:15 PM',
  },
  {
    id: '6',
    type: 'text',
    source: 'Design Team',
    content: 'Beautiful sunset at the beach today! Nothing beats the view from Lagos coast.',
    time: 'Today, 10:30 AM',
  },
];

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Favorite[]>(mockFavorites);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [replyTo, setReplyTo] = useState<Favorite | null>(null);
  const [viewMode, setViewMode] = useState<'chat' | 'message'>('chat');
  const [showViewMenu, setShowViewMenu] = useState(false);

  const [contextMenu, setContextMenu] = useState<{ item: Favorite; x: number; y: number } | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const viewMenuRef = useRef<HTMLDivElement>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const listEndRef = useRef<HTMLDivElement>(null);

  const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
    '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
    '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
    '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳',
    '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️',
    '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤',
    '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱',
    '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
    '👍', '👎', '👏', '🙌', '🤝', '✌️', '🤞', '🤟',
    '🔥', '⭐', '✨', '💫', '💥', '💯', '💢', '💬',
  ];

  const isSelectionMode = selectedIds.length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setContextMenu(null);
      }
      if (viewMenuRef.current && !viewMenuRef.current.contains(event.target as Node)) {
        setShowViewMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [contextMenu, showViewMenu]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (viewMode === 'chat') {
      listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [favorites, viewMode]);

  // Recording timer
  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  const filteredFavorites = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return favorites;
    return favorites.filter((item) =>
      item.content.toLowerCase().includes(q) ||
      item.source.toLowerCase().includes(q) ||
      (item.title && item.title.toLowerCase().includes(q))
    );
  }, [favorites, searchQuery]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2000);
  };

  const handleContextMenu = (e: React.MouseEvent | React.TouchEvent, item: Favorite) => {
    e.preventDefault();
    if (isSelectionMode) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const menuWidth = 160;
    const menuHeight = 220;
    let x = clientX;
    let y = clientY;
    if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - 16;
    if (y + menuHeight > window.innerHeight) y = window.innerHeight - menuHeight - 16;

    setContextMenu({ item, x, y });
  };

  const handleMenuAction = (action: MenuAction) => {
    if (!contextMenu) return;
    const item = contextMenu.item;
    setContextMenu(null);

    switch (action) {
      case 'reply':
        setReplyTo(item);
        break;
      case 'forward':
        navigate(`/forward-message?favoriteId=${item.id}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(item.content).catch(() => {});
        showToast('Copied to clipboard');
        break;
      case 'delete':
        setShowDeleteConfirm(true);
        break;
      case 'select':
        setSelectedIds([item.id]);
        break;
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;
    const newNote: Favorite = {
      id: `n${Date.now()}`,
      type: 'text',
      source: 'You',
      content: text,
      time: 'Just now',
      isFromMe: true,
      replyTo: replyTo ? { id: replyTo.id, content: replyTo.content.slice(0, 60) } : undefined,
    };
    setFavorites((prev) => [...prev, newNote]);
    setInputValue('');
    setReplyTo(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEmojiClick = (emoji: string) => {
    setInputValue(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileSelect = (type: 'image' | 'file' | 'camera') => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' ? 'image/*' : type === 'camera' ? 'image/*' : '*';
      fileInputRef.current.click();
    }
    setShowAttachMenu(false);
  };

  const handleVoiceRecord = () => {
    if (isRecording) {
      const duration = recordingTime;
      setIsRecording(false);
      setRecordingTime(0);
      const newNote: Favorite = {
        id: `v${Date.now()}`,
        type: 'text',
        source: 'You',
        content: `🎤 Voice note (${formatRecordingTime(duration)})`,
        time: 'Just now',
        isFromMe: true,
      };
      setFavorites((prev) => [...prev, newNote]);
    } else {
      setRecordingTime(0);
      setIsRecording(true);
    }
  };

  const handleDelete = () => {
    if (contextMenu) {
      setFavorites((prev) => prev.filter((item) => item.id !== contextMenu.item.id));
    }
    setShowDeleteConfirm(false);
    setContextMenu(null);
  };

  const handleBulkForward = () => {
    const query = selectedIds.map((id) => `favoriteId=${id}`).join('&');
    navigate(`/forward-message?${query}`);
  };

  const handleBulkDelete = () => {
    setFavorites((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]);
  };

  const exitSelectionMode = () => setSelectedIds([]);

  const renderBubbleContent = (item: Favorite) => {
    switch (item.type) {
      case 'image':
        return item.preview ? (
          <img src={item.preview} alt="Saved" className="w-full max-w-[240px] h-auto rounded-lg object-cover" />
        ) : null;
      case 'video':
        return item.preview ? (
          <div className="relative w-full max-w-[240px] rounded-lg overflow-hidden">
            <img src={item.preview} alt="Video thumbnail" className="w-full h-auto object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--primary)] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        ) : null;
      case 'link':
        return (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--primary)] underline break-all"
            onClick={(e) => e.stopPropagation()}
          >
            {item.title || item.url}
          </a>
        );
      case 'file':
        return (
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[var(--on-surface-variant)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <p className="text-body-md text-[var(--on-surface)]">{item.fileName}</p>
              <p className="text-label-sm text-[var(--on-surface-variant)]">{item.fileSize}</p>
            </div>
          </div>
        );
      default:
        return <p className="text-body-md text-[var(--on-surface)] whitespace-pre-wrap">{item.content}</p>;
    }
  };

  return (
    <div className="h-full bg-[var(--surface)] flex flex-col">
      {/* Header */}
      <header className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] px-4 py-3 sticky top-0 z-20">
        {isSelectionMode ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={exitSelectionMode} className="p-2 -ml-2 hover:bg-[var(--surface-container)] rounded-full transition-colors">
                <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h1 className="text-headline-md text-[var(--primary)]">{selectedIds.length} selected</h1>
            </div>
            <button
              onClick={() => setSelectedIds(filteredFavorites.map((i) => i.id))}
              className="text-label-lg font-medium text-[var(--secondary)] px-2 py-1 rounded-lg hover:bg-[var(--secondary-container)] transition-colors"
            >
              Select All
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-[var(--surface-container)] rounded-full transition-colors">
                <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-headline-md text-[var(--primary)]">Saved Messages</h1>
                <p className="text-label-sm text-[var(--on-surface-variant)]">{favorites.length} items</p>
              </div>
            </div>
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 hover:bg-[var(--surface-container)] rounded-full transition-colors ${isSearchOpen ? 'bg-[var(--surface-container)]' : ''}`}
            >
              <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <div className="relative" ref={viewMenuRef}>
              <button
                onClick={() => setShowViewMenu(!showViewMenu)}
                className={`p-2 hover:bg-[var(--surface-container)] rounded-full transition-colors ${showViewMenu ? 'bg-[var(--surface-container)]' : ''}`}
              >
                <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
              {showViewMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--surface-container-low)] rounded-xl shadow-ambient-lg py-2 z-50">
                  <button
                    onClick={() => { setViewMode('chat'); setShowViewMenu(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface)] ${viewMode === 'chat' ? 'bg-[var(--surface-container)]' : ''}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-body-md">Chat Mode</span>
                    {viewMode === 'chat' && (
                      <svg className="w-4 h-4 ml-auto text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => { setViewMode('message'); setShowViewMenu(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface)] ${viewMode === 'message' ? 'bg-[var(--surface-container)]' : ''}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    <span className="text-body-md">Message Mode</span>
                    {viewMode === 'message' && (
                      <svg className="w-4 h-4 ml-auto text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Search */}
      {isSearchOpen && !isSelectionMode && (
        <div className="px-4 py-3 bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)]">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved messages..."
              className="w-full pl-10 pr-10 py-2.5 bg-[var(--surface-container-lowest)] rounded-xl text-body-md text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-[var(--surface-container-high)] rounded-full transition-colors">
                <svg className="w-4 h-4 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto ${viewMode === 'chat' ? 'p-4 space-y-4' : ''}`}>
        {filteredFavorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-20 h-20 bg-[var(--surface-container-low)] rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-[var(--on-surface-variant)]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <p className="text-title-md font-semibold text-[var(--on-surface)] mb-1">No saved messages</p>
            <p className="text-body-md text-[var(--on-surface-variant)] text-center">
              Long press a message and choose Save to Favorites
            </p>
          </div>
        ) : viewMode === 'chat' ? (
          filteredFavorites.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`flex flex-col ${item.isFromMe ? 'items-end' : 'items-start'}`}
                onContextMenu={(e) => handleContextMenu(e, item)}
                onTouchStart={(e) => {
                  const timer = window.setTimeout(() => handleContextMenu(e, item), 600);
                  const clear = () => clearTimeout(timer);
                  e.currentTarget.addEventListener('touchend', clear, { once: true });
                  e.currentTarget.addEventListener('touchmove', clear, { once: true });
                }}
              >
                {!item.isFromMe && (
                  <span className="text-label-sm text-[var(--secondary)] mb-1 px-1">{item.source}</span>
                )}
                <div className="flex items-end gap-2 max-w-[80%]">
                  {isSelectionMode && (
                    <button
                      onClick={() => toggleSelection(item.id)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mb-1 ${
                        isSelected ? 'border-[var(--secondary)] bg-[var(--secondary)]' : 'border-[var(--outline)]'
                      }`}
                    >
                      {isSelected && <svg className="w-3 h-3 text-[var(--on-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </button>
                  )}
                  <div
                    onClick={() => isSelectionMode ? toggleSelection(item.id) : navigate(`/favorite/${item.id}`)}
                    className={`relative bg-[var(--surface-container-lowest)] rounded-2xl rounded-bl-none shadow-ambient-sm p-3 cursor-pointer transition-all ${
                      isSelected ? 'ring-2 ring-[var(--secondary)]' : ''
                    } ${item.isFromMe ? 'bg-[var(--primary-container)]' : ''}`}
                  >
                    {item.replyTo && (
                      <div className="border-l-2 border-[var(--secondary)] pl-2 mb-2 opacity-70">
                        <p className="text-label-sm text-[var(--on-surface-variant)] line-clamp-1">{item.replyTo.content}</p>
                      </div>
                    )}
                    {renderBubbleContent(item)}
                    <p className="text-label-xs text-[var(--on-surface-variant)] mt-1.5 text-right">{item.time}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="divide-y divide-[var(--outline-variant)]/50">
            {filteredFavorites.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onContextMenu={(e) => handleContextMenu(e, item)}
                  onTouchStart={(e) => {
                    const timer = window.setTimeout(() => handleContextMenu(e, item), 600);
                    const clear = () => clearTimeout(timer);
                    e.currentTarget.addEventListener('touchend', clear, { once: true });
                    e.currentTarget.addEventListener('touchmove', clear, { once: true });
                  }}
                  onClick={() => isSelectionMode ? toggleSelection(item.id) : navigate(`/favorite/${item.id}`)}
                  className={`flex items-center gap-3 px-4 py-3 bg-[var(--surface-container-lowest)] hover:bg-[var(--surface-container-low)] transition-colors cursor-pointer ${
                    isSelected ? 'bg-[var(--primary-fixed)]' : ''
                  }`}
                >
                  {isSelectionMode && (
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSelection(item.id); }}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'border-[var(--secondary)] bg-[var(--secondary)]' : 'border-[var(--outline)]'
                      }`}
                    >
                      {isSelected && <svg className="w-3 h-3 text-[var(--on-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </button>
                  )}
                  <div className="w-12 h-12 bg-[var(--primary-container)] rounded-full flex items-center justify-center text-[var(--on-primary-container)] text-sm font-semibold flex-shrink-0">
                    {item.source.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="font-semibold text-[var(--on-surface)] truncate">{item.source}</h3>
                      <span className="text-label-sm text-[var(--on-surface-variant)] whitespace-nowrap ml-2">{item.time}</span>
                    </div>
                    <p className="text-body-md text-[var(--on-surface-variant)] truncate">
                      {item.type === 'image' ? 'Photo' : item.type === 'video' ? 'Video' : item.type === 'file' ? item.fileName : item.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div ref={listEndRef} />
      </div>

      {/* Voice Recording Bar */}
      {isRecording && (
        <div className="bg-[var(--error-container)] border-t border-[var(--outline-variant)] px-4 py-3 safe-area-pb">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[var(--error)] rounded-full animate-pulse" />
              <span className="text-body-md text-[var(--on-error-container)] font-medium">Recording...</span>
              <span className="text-body-md text-[var(--on-error-container)]">{formatRecordingTime(recordingTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setIsRecording(false); setRecordingTime(0); }}
                className="px-4 py-2 text-label-sm text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleVoiceRecord}
                className="px-4 py-2 bg-[var(--primary)] text-[var(--on-primary)] rounded-lg text-label-sm font-medium"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Input or Selection Actions */}
      {isSelectionMode ? (
        <div className="bg-[var(--surface-container-low)] border-t border-[var(--outline-variant)] px-4 py-3 safe-area-pb flex items-center justify-between">
          <button onClick={handleBulkForward} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--on-primary)] text-body-md font-semibold hover:opacity-90 transition-opacity">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
            Forward
          </button>
          <button onClick={handleBulkDelete} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--error)] text-[var(--on-error)] text-body-md font-semibold hover:opacity-90 transition-opacity">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            Delete
          </button>
        </div>
      ) : !isRecording && (
        <div className="bg-[var(--surface-container-low)] border-t border-[var(--outline-variant)] px-3 py-2.5 safe-area-pb">
          {replyTo && (
            <div className="flex items-center justify-between px-1 py-2 mb-2">
              <div className="flex-1 min-w-0 border-l-2 border-[var(--secondary)] pl-3">
                <p className="text-label-sm text-[var(--on-surface-variant)] line-clamp-1">{replyTo.content}</p>
              </div>
              <button onClick={() => setReplyTo(null)} className="p-1 hover:bg-[var(--surface-container-high)] rounded-full ml-2">
                <svg className="w-4 h-4 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          )}
          <div className="flex items-center gap-2">
            {/* Attachment */}
            <button
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className={`h-11 w-11 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${showAttachMenu ? 'bg-[var(--primary)] text-[var(--on-primary)]' : 'text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)]'}`}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.44 11.05-9.19 9.19a6.003 6.003 0 0 1-8.49-8.49l9.19-9.19a4.002 4.002 0 0 1 5.66 5.66l-9.2 9.19a2.001 2.001 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </button>

            {/* Input Field */}
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write a note..."
                rows={1}
                className="w-full min-h-[44px] max-h-[120px] bg-[var(--surface-container-lowest)] text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/50 resize-none focus:outline-none rounded-2xl px-4 py-2.5 pr-10 text-body-md border border-[var(--outline-variant)] focus:border-[var(--primary)]/30 transition-colors"
              />
              {/* Emoji Button (inside input) */}
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`absolute right-2 top-1/2 -translate-y-1/2 transition-colors ${showEmojiPicker ? 'text-[var(--primary)]' : 'text-[var(--on-surface-variant)]/70 hover:text-[var(--on-surface-variant)]'}`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </button>
            </div>

            {/* Voice / Send */}
            {inputValue.trim() ? (
              <button
                onClick={handleSend}
                className="h-11 w-11 rounded-full bg-[var(--primary)] text-[var(--on-primary)] flex items-center justify-center flex-shrink-0 hover:opacity-90 active:scale-95 transition-all shadow-ambient-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2.01z" />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => setIsRecording(true)}
                className="h-11 w-11 rounded-full text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] flex items-center justify-center flex-shrink-0 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                  <line x1="8" y1="22" x2="16" y2="22" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && !isSelectionMode && (
        <div className="bg-[var(--surface-container)] border-t border-[var(--outline-variant)] animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--outline-variant)]">
            <span className="text-label-sm text-[var(--on-surface-variant)]">Emoji</span>
            <button
              onClick={() => setShowEmojiPicker(false)}
              className="p-1 hover:bg-[var(--surface-container-high)] rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-3 max-h-48 overflow-y-auto">
            <div className="grid grid-cols-8 gap-2">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiClick(emoji)}
                  className="aspect-square flex items-center justify-center text-2xl hover:bg-[var(--surface-container-high)] rounded-lg transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Attach Menu */}
      {showAttachMenu && (
        <div className="absolute inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowAttachMenu(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-[var(--surface-container-lowest)] rounded-t-3xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--outline-variant)]">
              <h3 className="text-body-lg font-semibold text-[var(--on-surface)]">Attachments</h3>
              <button
                onClick={() => setShowAttachMenu(false)}
                className="p-2 hover:bg-[var(--surface-container)] rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4 p-6">
              <button onClick={() => handleFileSelect('camera')} className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-[var(--surface-container-low)] transition-colors">
                <div className="w-14 h-14 bg-[var(--primary-container)] rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-[var(--on-primary-container)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-label-sm text-[var(--on-surface)]">Camera</span>
              </button>
              <button onClick={() => handleFileSelect('image')} className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-[var(--surface-container-low)] transition-colors">
                <div className="w-14 h-14 bg-[var(--secondary-container)] rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-[var(--on-secondary-container)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-label-sm text-[var(--on-surface)]">Gallery</span>
              </button>
              <button onClick={() => handleFileSelect('file')} className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-[var(--surface-container-low)] transition-colors">
                <div className="w-14 h-14 bg-[var(--tertiary-container)] rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-[var(--on-tertiary-container)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-label-sm text-[var(--on-surface)]">File</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            const newNote: Favorite = {
              id: `f${Date.now()}`,
              type: 'text',
              source: 'You',
              content: `📎 ${e.target.files[0].name}`,
              time: 'Just now',
              isFromMe: true,
            };
            setFavorites((prev) => [...prev, newNote]);
          }
        }}
      />

      {/* Context Menu */}
      {contextMenu && (
        <div
          ref={menuRef}
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed z-50 bg-[var(--surface-container-lowest)] rounded-xl shadow-ambient-lg py-2 min-w-[150px] border border-[var(--outline-variant)]/50"
        >
          {[
            { action: 'reply' as MenuAction, label: 'Reply', icon: 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6' },
            { action: 'forward' as MenuAction, label: 'Forward', icon: 'M13 5l7 7-7 7M5 5l7 7-7 7' },
            { action: 'copy' as MenuAction, label: 'Copy', icon: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' },
            { action: 'delete' as MenuAction, label: 'Delete', icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' },
            { action: 'select' as MenuAction, label: 'Select', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
          ].map((item) => (
            <button
              key={item.action}
              onClick={() => handleMenuAction(item.action)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[var(--surface-container-low)] ${
                item.action === 'delete' ? 'text-[var(--error)]' : 'text-[var(--on-surface)]'
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
              </svg>
              <span className="text-body-md">{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && contextMenu && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl w-full max-w-[320px] p-6">
            <h3 className="text-title-md font-semibold text-[var(--on-surface)] mb-2">Delete Message</h3>
            <p className="text-body-md text-[var(--on-surface-variant)] mb-6">Are you sure you want to delete this saved message?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 px-4 rounded-xl bg-[var(--surface-container)] text-[var(--on-surface)] text-label-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 py-3 px-4 rounded-xl bg-[var(--error)] text-[var(--on-error)] text-label-lg font-medium hover:opacity-90 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-lg bg-[var(--inverse-surface)] text-[var(--inverse-on-surface)] text-body-sm font-medium shadow-ambient-lg pointer-events-auto">
          {toast}
        </div>
      )}
    </div>
  );
};

const Component = FavoritesPage;
export default Component;
