/**
 * @name Chats List
 * @description Main chat list page with recent conversations
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../themes/equatorial-minimalism/globals.css';
import './style.css';

interface ChatItem {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isOnline: boolean;
  isPinned: boolean;
  isGroup: boolean;
  draft?: string;
  mentionedMe?: boolean;
  isMuted?: boolean;
  isTemp?: boolean;
  isSavedMessages?: boolean;
}

const now = new Date();

const mockChats: ChatItem[] = [
  {
    id: 'saved-messages',
    name: 'Saved Messages',
    avatar: '',
    lastMessage: 'My notes and saved messages',
    timestamp: new Date(now.getTime() - 30 * 60 * 1000),
    unreadCount: 0,
    isOnline: false,
    isPinned: false,
    isGroup: false,
    isSavedMessages: true,
  },
  {
    id: '1',
    name: 'Amara Okafor',
    avatar: '',
    lastMessage: 'Thanks for the help with the project!',
    timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    unreadCount: 3,
    isOnline: true,
    isPinned: true,
    isGroup: false,
  },
  {
    id: '2',
    name: 'Design Team',
    avatar: '',
    lastMessage: 'Zara: Check out this design I just finished!',
    timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000),
    unreadCount: 12,
    isOnline: false,
    isPinned: true,
    isGroup: true,
    mentionedMe: true,
  },
  {
    id: '3',
    name: 'Chioma Nnamdi',
    avatar: '',
    lastMessage: 'Are we still meeting tomorrow?',
    timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    unreadCount: 0,
    isOnline: true,
    isPinned: false,
    isGroup: false,
    draft: 'Yes, at 2 PM...',
  },
  {
    id: '4',
    name: 'Family Group',
    avatar: '',
    lastMessage: 'Mama: Dinner is ready!',
    timestamp: new Date(now.getTime() - 26 * 60 * 60 * 1000),
    unreadCount: 0,
    isOnline: false,
    isPinned: false,
    isGroup: true,
  },
  {
    id: '5',
    name: 'Oluwaseun Adeyemi',
    avatar: '',
    lastMessage: 'Sent you the files',
    timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    unreadCount: 0,
    isOnline: false,
    isPinned: false,
    isGroup: false,
  },
  {
    id: '6',
    name: 'Tech Support',
    avatar: '',
    lastMessage: 'Your ticket has been resolved',
    timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    unreadCount: 0,
    isOnline: false,
    isPinned: false,
    isGroup: false,
  },
  {
    id: '7',
    name: 'Amina Ibrahim',
    avatar: '',
    lastMessage: 'Happy birthday! 🎉',
    timestamp: new Date(now.getFullYear(), now.getMonth() - 1, 15, 10, 30),
    unreadCount: 0,
    isOnline: true,
    isPinned: false,
    isGroup: false,
  },
  {
    id: '8',
    name: 'Uncle Obi',
    avatar: '',
    lastMessage: 'Merry Christmas!',
    timestamp: new Date(now.getFullYear() - 1, 11, 25, 9, 0),
    unreadCount: 0,
    isOnline: false,
    isPinned: false,
    isGroup: false,
  },
  {
    id: 'temp-101',
    name: 'Unknown User',
    avatar: '',
    lastMessage: 'Hi! I saw your post about the event.',
    timestamp: new Date(now.getTime() - 60 * 60 * 1000),
    unreadCount: 1,
    isOnline: false,
    isPinned: false,
    isGroup: false,
    isTemp: true,
  },
];

interface ChatFolder {
  id: string;
  name: string;
  chatIds: string[];
}

const mockFolders: ChatFolder[] = [
  { id: 'all', name: 'All', chatIds: [] },
  { id: 'work', name: 'Work', chatIds: ['2', '6'] },
  { id: 'family', name: 'Family', chatIds: ['4'] },
];

interface AccountBadge {
  id: string;
  initials: string;
  unreadCount: number;
}

const mockAccountBadges: AccountBadge[] = [
  { id: 'work', initials: 'WK', unreadCount: 5 },
  { id: 'family', initials: 'FA', unreadCount: 12 },
];

const ChatsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chats');
  const [chats, setChats] = useState(mockChats);
  const [activeFolderId, setActiveFolderId] = useState('all');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChatMenu, setShowNewChatMenu] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ chatId: string; x: number; y: number } | null>(null);
  const [swipedChatId, setSwipedChatId] = useState<string | null>(null);
  const [deleteConfirmChatId, setDeleteConfirmChatId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; chatId: string } | null>(null);
  const mouseDragRef = useRef<{ startX: number; chatId: string; dragging: boolean } | null>(null);

  const folderFilteredChats = useMemo(() => {
    const folder = mockFolders.find(f => f.id === activeFolderId);
    if (!folder || folder.id === 'all') return chats;
    return chats.filter(chat => folder.chatIds.includes(chat.id));
  }, [chats, activeFolderId]);

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return folderFilteredChats;
    const q = searchQuery.toLowerCase();
    return folderFilteredChats.filter(chat => chat.name.toLowerCase().includes(q));
  }, [folderFilteredChats, searchQuery]);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowNewChatMenu(false);
      }
      if (contextRef.current && !contextRef.current.contains(e.target as Node)) {
        setContextMenu(null);
        setSwipedChatId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const isSameDay = (a: Date, b: Date): boolean =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const getWeekStart = (date: Date): Date => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    return d;
  };

  const isSameWeek = (a: Date, b: Date): boolean =>
    getWeekStart(a).getTime() === getWeekStart(b).getTime();

  const formatChatTime = (date: Date): string => {
    const now = new Date();

    if (isSameDay(date, now)) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }

    const sameYear = date.getFullYear() === now.getFullYear();

    if (sameYear && isSameWeek(date, now)) {
      return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    }

    if (sameYear) {
      return date
        .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        .toUpperCase();
    }

    return `${date.getMonth() + 1}.${date.getDate()}.${date.getFullYear().toString().slice(-2)}`;
  };

  const handleChatClick = useCallback((chat: ChatItem) => {
    if (mouseDragRef.current?.dragging) return;
    if (chat.isSavedMessages) {
      navigate('/favorites');
    } else if (chat.isTemp) {
      navigate(`/temp-chat/${chat.id}`);
    } else if (chat.isGroup) {
      navigate('/group-chat');
    } else {
      navigate('/chatroom');
    }
  }, [navigate]);

  const handleContextMenu = useCallback((e: React.MouseEvent, chat: ChatItem) => {
    e.preventDefault();
    setSwipedChatId(null);
    setContextMenu({ chatId: chat.id, x: e.clientX, y: e.clientY });
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent, chatId: string) => {
    touchStartRef.current = { x: e.touches[0].clientX, chatId };
    setContextMenu(null);
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    if (deltaX < -40) {
      setSwipedChatId(touchStartRef.current.chatId);
      setContextMenu(null);
    } else if (deltaX > 40) {
      setSwipedChatId(null);
    }
    touchStartRef.current = null;
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent, chatId: string) => {
    if (e.button !== 0) return;
    mouseDragRef.current = { startX: e.clientX, chatId, dragging: false };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!mouseDragRef.current) return;
    if (!(e.buttons & 1)) { mouseDragRef.current = null; return; }
    const deltaX = e.clientX - mouseDragRef.current.startX;
    if (Math.abs(deltaX) > 5) {
      mouseDragRef.current.dragging = true;
    }
    if (mouseDragRef.current.dragging) {
      setSwipedChatId(deltaX < -20 ? mouseDragRef.current.chatId : null);
      setContextMenu(null);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    // keep mouseDragRef intact so handleChatClick can check .dragging
    // cleared on next mousedown or mousemove without button
  }, []);

  const handleContextAction = useCallback((chatId: string, action: string) => {
    setContextMenu(null);
    setSwipedChatId(null);
    if (action === 'delete') {
      setDeleteConfirmChatId(chatId);
      return;
    }
    setChats(prev => prev.map(c => {
      if (c.id !== chatId) return c;
      switch (action) {
        case 'pin':
          return { ...c, isPinned: !c.isPinned };
        case 'mute':
          return { ...c, isMuted: !c.isMuted };
        case 'read':
          return { ...c, unreadCount: 0 };
        default:
          return c;
      }
    }));
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteConfirmChatId) return;
    setChats(prev => prev.filter(c => c.id !== deleteConfirmChatId));
    setDeleteConfirmChatId(null);
  }, [deleteConfirmChatId]);

  const deleteConfirmChat = deleteConfirmChatId ? chats.find(c => c.id === deleteConfirmChatId) : null;

  const tabs = [
    { id: 'chats', label: 'Chats', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { id: 'contacts', label: 'Contacts', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'feed', label: 'Feed', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'calls', label: 'Calls', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
    { id: 'me', label: 'Me', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  const contextMenuChat = contextMenu ? chats.find(c => c.id === contextMenu.chatId) : null;

  const renderChatItem = (chat: ChatItem) => (
    <div
      key={chat.id}
      className="relative overflow-hidden"
      onTouchStart={(e) => handleTouchStart(e, chat.id)}
      onTouchEnd={handleTouchEnd}
      onMouseDown={(e) => handleMouseDown(e, chat.id)}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => { mouseDragRef.current = null; }}
    >
      {/* Swipe Action Buttons (behind) */}
      <div className="absolute inset-y-0 right-0 flex">
        <button
          onClick={() => handleContextAction(chat.id, 'pin')}
          className="w-16 flex items-center justify-center bg-[var(--secondary-container)] text-[var(--on-secondary-container)]"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 12V4H17V2H7V4H8V12L6 14V16H11.2V22H12.8V16H18V14L16 12Z" />
          </svg>
        </button>
        <button
          onClick={() => handleContextAction(chat.id, 'read')}
          className="w-16 flex items-center justify-center bg-[var(--primary-container)] text-[var(--on-primary-container)]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </button>
        <button
          onClick={() => handleContextAction(chat.id, 'delete')}
          className="w-16 flex items-center justify-center bg-[var(--error)] text-[var(--on-error)]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Chat Item (slides left on swipe) */}
      <div
        onClick={() => handleChatClick(chat)}
        onContextMenu={(e) => handleContextMenu(e, chat)}
        className={`relative flex items-center gap-3 px-4 py-3 bg-[var(--surface-container-lowest)] border-b border-[var(--outline-variant)]/50 hover:bg-[var(--surface-container-low)] transition-all cursor-pointer ${
          swipedChatId === chat.id ? '-translate-x-48' : 'translate-x-0'
        }`}
        style={{ transitionDuration: '200ms' }}
      >
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {chat.isSavedMessages ? (
            <div className="w-12 h-12 bg-[var(--secondary-container)] rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-[var(--on-secondary-container)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
          ) : (
            <div className="w-12 h-12 bg-[var(--primary-container)] rounded-full flex items-center justify-center text-[var(--on-primary-container)] font-semibold text-sm">
              {getInitials(chat.name)}
            </div>
          )}
          {chat.isOnline && !chat.isSavedMessages && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[var(--secondary)] border-2 border-[var(--surface)] rounded-full" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <h3 className="font-semibold text-body-md text-[var(--on-surface)] truncate">
              {chat.name}
              {chat.isTemp && (
                <span className="ml-2 text-label-xs px-1.5 py-0.5 rounded bg-[var(--secondary-container)] text-[var(--on-secondary-container)] align-middle">Temp</span>
              )}
              {chat.isGroup && (
                <span className="ml-2 text-label-sm text-[var(--on-surface-variant)] align-middle">Group</span>
              )}
            </h3>
            {/* Time / Pinned Time */}
            {chat.isPinned && chat.unreadCount > 0 ? (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--secondary)] text-[var(--on-secondary)] ml-2 flex-shrink-0">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 12V4H17V2H7V4H8V12L6 14V16H11.2V22H12.8V16H18V14L16 12Z" />
                </svg>
                <span className="text-label-xs whitespace-nowrap">{formatChatTime(chat.timestamp)}</span>
              </div>
            ) : chat.isPinned ? (
              <div className="flex items-center gap-1 text-[var(--on-surface-variant)] ml-2 flex-shrink-0">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 12V4H17V2H7V4H8V12L6 14V16H11.2V22H12.8V16H18V14L16 12Z" />
                </svg>
                <span className="text-label-sm whitespace-nowrap">{formatChatTime(chat.timestamp)}</span>
              </div>
            ) : (
              <span className="text-label-sm text-[var(--on-surface-variant)] whitespace-nowrap ml-2 flex-shrink-0">{formatChatTime(chat.timestamp)}</span>
            )}
          </div>
          <div className="flex items-center justify-between min-w-0">
            <div className="flex items-center gap-1 min-w-0">
              {chat.draft ? (
                <p className="text-body-sm text-[var(--secondary)] truncate">
                  Draft: {chat.draft}
                </p>
              ) : chat.mentionedMe ? (
                <p className="text-body-sm truncate">
                  <span className="text-[var(--error)] font-semibold">[@You] </span>
                  <span className="text-[var(--on-surface-variant)]">{chat.lastMessage}</span>
                </p>
              ) : (
                <p className="text-body-sm text-[var(--on-surface-variant)] truncate">{chat.lastMessage}</p>
              )}
            </div>
            <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
              {chat.isMuted && (
                <svg className="w-4 h-4 text-[var(--on-surface-variant)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              )}
              {chat.unreadCount > 0 && (
                <div className={`rounded-full flex items-center justify-center flex-shrink-0 min-w-[20px] h-5 px-1 ${chat.mentionedMe ? 'bg-[var(--error)]' : 'bg-[var(--secondary)]'}`}>
                  <span className={`text-label-xs ${chat.mentionedMe ? 'text-[var(--on-error)]' : 'text-[var(--on-secondary)]'}`}>{chat.unreadCount > 99 ? '99+' : chat.unreadCount}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-[var(--surface)] flex flex-col">
      {/* Header */}
      <header className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] px-4 py-3 sticky top-0 z-20">
        {showSearch ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setShowSearch(false); setSearchQuery(''); }}
              className="p-2 -ml-2 hover:bg-[var(--surface-container)] rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats..."
                className="w-full pl-10 pr-10 py-2.5 bg-[var(--surface-container)] rounded-xl text-body-md text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
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
        ) : (
          <div className="flex items-center justify-between">
            <h1 className="text-headline-md text-[var(--primary)]">Chats</h1>
            <div className="flex items-center gap-2">
              {/* Account Switcher Badge */}
              <button
                onClick={() => navigate('/account-switcher')}
                className="relative p-1 hover:bg-[var(--surface-container)] rounded-full transition-colors"
                aria-label="Switch account"
              >
                <div className="w-8 h-8 bg-[var(--primary)] rounded-full flex items-center justify-center text-[var(--on-primary)] text-label-sm font-semibold">
                  JD
                </div>
                {mockAccountBadges.reduce((sum, a) => sum + a.unreadCount, 0) > 0 && (
                  <div className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-[var(--error)] text-[var(--on-error)] rounded-full text-[10px] flex items-center justify-center border-2 border-[var(--surface-container-low)]">
                    {mockAccountBadges.reduce((sum, a) => sum + a.unreadCount, 0) > 99 ? '99+' : mockAccountBadges.reduce((sum, a) => sum + a.unreadCount, 0)}
                  </div>
                )}
              </button>
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 hover:bg-[var(--surface-container)] rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => { setShowNewChatMenu(!showNewChatMenu); setContextMenu(null); }}
                  className={`p-2 rounded-full transition-colors ${showNewChatMenu ? 'bg-[var(--surface-container)]' : 'hover:bg-[var(--surface-container)]'}`}
                >
                  <svg className={`w-6 h-6 text-[var(--on-surface)] transition-transform ${showNewChatMenu ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
                {showNewChatMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--surface-container-low)] rounded-xl shadow-ambient-lg py-2 z-50">
                    <button
                      onClick={() => { setShowNewChatMenu(false); console.log('New chat'); }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface)]"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="text-body-sm">New Chat</span>
                    </button>
                    <button
                      onClick={() => { setShowNewChatMenu(false); console.log('New group'); }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface)]"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-body-sm">New Group</span>
                    </button>
                    <div className="border-t border-[var(--outline-variant)] my-1" />
                    <button
                      onClick={() => { setShowNewChatMenu(false); console.log('Add contact'); }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface)]"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      <span className="text-body-sm">Add Contact</span>
                    </button>
                    <button
                      onClick={() => { setShowNewChatMenu(false); console.log('Scan QR'); }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface)]"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2.48a2.5 2.5 0 00-4.02-1.17l-1.06 1.06M7 15h.01M4 7h1m12 0h2M4 4h4v4H4V4zm12 0h4v4h-4V4zM4 16h4v4H4v-4zm12 0h4v4h-4v-4z" />
                      </svg>
                      <span className="text-body-sm">Scan QR Code</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Folder Tabs */}
      <div className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] px-4 py-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {mockFolders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => setActiveFolderId(folder.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-label-md font-medium transition-all ${
                activeFolderId === folder.id
                  ? 'bg-[var(--secondary)] text-[var(--on-secondary)]'
                  : 'bg-[var(--surface-container)] text-[var(--on-surface)] hover:bg-[var(--surface-container-high)]'
              }`}
            >
              {folder.name}
            </button>
          ))}
          <button
            onClick={() => navigate('/chat-folders')}
            className="flex-shrink-0 px-3 py-2 rounded-full text-label-md text-[var(--secondary)] bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)] transition-colors"
            aria-label="Manage folders"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {!searchQuery && chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4">
            <div className="w-24 h-24 bg-[var(--surface-container-low)] rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-[var(--on-surface-variant)]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-title-md font-semibold text-[var(--on-surface)] mb-2">Start a conversation</p>
            <p className="text-body-md text-[var(--on-surface-variant)] text-center max-w-xs">Tap the + button above to start a new chat or add a contact</p>
          </div>
        ) : searchQuery && filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <svg className="w-16 h-16 text-[var(--on-surface-variant)]/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-body-md text-[var(--on-surface-variant)]">No chats found</p>
            <p className="text-label-sm text-[var(--on-surface-variant)]/60 mt-1">Try a different search term</p>
          </div>
        ) : (
          filteredChats.map(renderChatItem)
        )}
      </div>

      {/* Context Menu (Long Press / Right Click) */}
      {contextMenu && contextMenuChat && (
        <div
          ref={contextRef}
          className="fixed z-50 bg-[var(--surface-container-low)] rounded-xl shadow-ambient-lg py-2 min-w-[180px]"
          style={{
            left: Math.min(contextMenu.x, typeof window !== 'undefined' ? window.innerWidth - 190 : 100),
            top: Math.min(contextMenu.y, typeof window !== 'undefined' ? window.innerHeight - 220 : 100),
          }}
        >
          <div className="px-4 py-2 border-b border-[var(--outline-variant)]/50">
            <p className="text-label-sm font-semibold text-[var(--on-surface)] truncate">{contextMenuChat.name}</p>
          </div>
          <button
            onClick={() => handleContextAction(contextMenu.chatId, 'pin')}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface)]"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 12V4H17V2H7V4H8V12L6 14V16H11.2V22H12.8V16H18V14L16 12Z" />
            </svg>
            <span className="text-body-sm">{contextMenuChat.isPinned ? 'Unpin' : 'Pin'}</span>
          </button>
          <button
            onClick={() => handleContextAction(contextMenu.chatId, 'mute')}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface)]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              {contextMenuChat.isMuted && (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              )}
            </svg>
            <span className="text-body-sm">{contextMenuChat.isMuted ? 'Unmute' : 'Mute'}</span>
          </button>
          <button
            onClick={() => handleContextAction(contextMenu.chatId, 'read')}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface)]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-body-sm">Mark as Read</span>
          </button>
          <div className="border-t border-[var(--outline-variant)] my-1" />
          <button
            onClick={() => handleContextAction(contextMenu.chatId, 'delete')}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container)] transition-colors text-[var(--error)]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="text-body-sm">Delete</span>
          </button>
        </div>
      )}

      {/* Delete Chat Confirmation Dialog */}
      {deleteConfirmChatId && deleteConfirmChat && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl w-full max-w-[320px] p-6">
            <h3 className="text-title-md font-semibold text-[var(--on-surface)] mb-2">Delete Chat</h3>
            <p className="text-body-md text-[var(--on-surface-variant)] mb-6">
              Are you sure you want to delete this chat? All messages will be removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmChatId(null)}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--surface-container)] text-[var(--on-surface)] text-label-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--error)] text-[var(--on-error)] text-label-lg font-medium hover:opacity-90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation - Telegram Glass Style */}
      <nav className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div
          className="flex items-center gap-1 px-2 py-2 rounded-full shadow-ambient-lg border border-white/20"
          style={{
            background: 'rgba(255, 255, 255, 0.72)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)'
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-[var(--primary)] text-[var(--on-primary)]'
                  : 'text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-low)]'
              }`}
            >
              <svg
                className={`w-5 h-5 ${activeTab === tab.id ? 'text-[var(--on-primary)]' : 'text-current'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} />
              </svg>
              {activeTab === tab.id && (
                <span className="text-sm font-medium whitespace-nowrap">{tab.label}</span>
              )}
            </button>
          ))}
        </div>
      </nav>

    </div>
  );
};

const Component = ChatsPage;
export default Component;
