/**
 * @name Me Page
 * @description Telegram-style personal center with profile card, quick account switch, and flat feature list
 * @mode axure
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../themes/equatorial-minimalism/globals.css';
import './style.css';

interface Account {
  id: string;
  name: string;
  handle: string;
  initials: string;
  isCurrent: boolean;
  unreadCount: number;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  description?: string;
  path: string;
}

const mockAccounts: Account[] = [
  { id: '1', name: 'John Doe', handle: '@john.doe', initials: 'JD', isCurrent: true, unreadCount: 0 },
  { id: '2', name: 'Work Account', handle: '@john.work', initials: 'WK', isCurrent: false, unreadCount: 5 },
  { id: '3', name: 'Family', handle: '@john.family', initials: 'FA', isCurrent: false, unreadCount: 12 },
];

const mainItems: MenuItem[] = [
  {
    id: 'my-posts',
    label: 'My Posts',
    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    path: '/my-posts',
  },
  {
    id: 'saved-messages',
    label: 'Saved Messages',
    icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z',
    path: '/favorites',
  },
  {
    id: 'cloud-drive',
    label: 'Cloud Drive',
    icon: 'M7 16a4 4 0 01-.88-7.903A5.5 5.5 0 1116.9 8H17a4 4 0 010 8H7z M12 12v9m0 0l-3-3m3 3l3-3',
    description: '3.2 GB of 10 GB used',
    path: '/cloud-drive',
  },
  {
    id: 'wallet',
    label: 'Wallet',
    icon: 'M20 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M2 11h20 M16 16h.01',
    description: 'Base Mainnet · 2,480.32 USDC',
    path: '/wallet',
  },
  {
    id: 'chat-folders',
    label: 'Chat Folders',
    icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
    path: '/chat-folders',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    path: '/settings',
  },
];

const supportItems: MenuItem[] = [
  {
    id: 'help-center',
    label: 'Help Center',
    icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    path: '/help-center',
  },
  {
    id: 'about',
    label: 'About',
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    description: 'v1.2.0',
    path: '/about',
  },
  {
    id: 'terms-of-service',
    label: 'Terms of Service',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    path: '/terms-of-service',
  },
];

const tabs = [
  { id: 'chats', label: 'Chats', path: '/chats', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { id: 'contacts', label: 'Contacts', path: '/contacts', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  { id: 'feed', label: 'Feed', path: '/feed', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { id: 'calls', label: 'Calls', path: '/calls', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
  { id: 'me', label: 'Me', path: '/me', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
];

const ChevronRightIcon = () => (
  <svg className="w-5 h-5 text-[var(--outline)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
  </svg>
);

const MePage: React.FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const currentAccount = accounts.find((a) => a.isCurrent);
  const otherAccounts = accounts.filter((a) => !a.isCurrent);
  const hasMultipleAccounts = otherAccounts.length > 0;

  const showToast = (message: string) => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToast(message);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 2000);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const switchAccount = (id: string) => {
    setAccounts((prev) => {
      const target = prev.find((a) => a.id === id);
      if (target) {
        showToast(`Switched to ${target.name}`);
      }
      return prev.map((a) => ({
        ...a,
        isCurrent: a.id === id,
        unreadCount: a.id === id ? 0 : a.unreadCount,
      }));
    });
  };

  const renderMenuGroup = (items: MenuItem[]) => (
    <div className="bg-[var(--surface-container-lowest)] rounded-2xl overflow-hidden shadow-ambient-sm">
      {items.map((item, index) => (
        <button
          key={item.id}
          onClick={() => navigate(item.path)}
          className={`w-full flex items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-[var(--surface-container-low)] ${
            index !== items.length - 1 ? 'border-b border-[var(--outline-variant)]/50' : ''
          }`}
        >
          <svg className="w-5 h-5 text-[var(--secondary)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
          </svg>
          <div className="flex-1 min-w-0">
            <span className="text-body-md text-[var(--on-surface)]">{item.label}</span>
            {item.description && (
              <p className="text-label-sm text-[var(--on-surface-variant)] mt-0.5">{item.description}</p>
            )}
          </div>
          <ChevronRightIcon />
        </button>
      ))}
    </div>
  );

  return (
    <div className="h-full bg-[var(--surface)] flex flex-col">
      {/* Header */}
      <header className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] px-4 py-3 flex-shrink-0 z-20">
        <div className="flex items-center justify-between">
          <h1 className="text-headline-md text-[var(--primary)]">Me</h1>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Card */}
        <div className="px-4 pt-6 pb-2">
          <button
            onClick={() => navigate('/edit-profile')}
            className="w-full bg-[var(--surface-container-lowest)] rounded-2xl p-4 shadow-ambient-sm flex items-center gap-4 text-left transition-colors hover:bg-[var(--surface-container-high)]"
          >
            <div className="w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center text-[var(--on-primary)] text-xl font-bold border-4 border-[var(--surface)] shadow-ambient-md flex-shrink-0">
              {currentAccount?.initials || 'JD'}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-body-lg text-[var(--on-surface)] font-bold truncate">{currentAccount?.name || 'John Doe'}</h2>
              <p className="text-body-md text-[var(--on-surface-variant)] truncate">{currentAccount?.handle || '@john.doe'}</p>
              <p className="text-label-md text-[var(--secondary)] mt-1 truncate">"Living life one day at a time"</p>
            </div>
            <ChevronRightIcon />
          </button>
        </div>

        {/* Accounts */}
        {hasMultipleAccounts && (
          <div className="px-4 py-2">
            <h2 className="text-label-md text-[var(--on-surface-variant)] uppercase tracking-wider mb-2 px-2">
              Accounts
            </h2>
            <div className="bg-[var(--surface-container-lowest)] rounded-2xl overflow-hidden shadow-ambient-sm">
              {otherAccounts.map((account, index) => (
                <button
                  key={account.id}
                  onClick={() => switchAccount(account.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[var(--surface-container-low)] ${
                    index !== otherAccounts.length - 1 ? 'border-b border-[var(--outline-variant)]/50' : ''
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-body-md text-[var(--on-surface)] font-medium truncate">{account.name}</p>
                    <p className="text-label-sm text-[var(--on-surface-variant)] truncate">{account.handle}</p>
                  </div>
                  {account.unreadCount > 0 && (
                    <div className="min-w-[20px] h-5 px-1.5 bg-[var(--error)] text-[var(--on-error)] rounded-full text-label-xs flex items-center justify-center">
                      {account.unreadCount > 99 ? '99+' : account.unreadCount}
                    </div>
                  )}
                </button>
              ))}
              <button
                onClick={() => navigate('/account-switcher')}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[var(--surface-container-low)] border-t border-[var(--outline-variant)]/50"
              >
                <svg className="w-5 h-5 text-[var(--secondary)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span className="text-body-md text-[var(--secondary)] font-medium">Manage Accounts</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Feature List */}
        <div className="px-4 py-2 space-y-3">
          {renderMenuGroup(mainItems)}
          {renderMenuGroup(supportItems)}
        </div>

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-label-sm text-[var(--outline)]">SuperIM v2.1.0</p>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-lg bg-[var(--inverse-surface)] text-[var(--inverse-on-surface)] text-body-sm font-medium shadow-ambient-lg pointer-events-auto">
          {toast}
        </div>
      )}

      {/* Floating Bottom Navigation */}
      <nav className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div
          className="flex items-center gap-1 px-2 py-2 rounded-full shadow-ambient-lg border border-white/20"
          style={{
            background: 'rgba(255, 255, 255, 0.72)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 ${
                tab.id === 'me'
                  ? 'bg-[var(--primary)] text-[var(--on-primary)]'
                  : 'text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-low)]'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} />
              </svg>
              {tab.id === 'me' && <span className="text-sm font-medium whitespace-nowrap">{tab.label}</span>}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

const Component = MePage;
export default Component;
