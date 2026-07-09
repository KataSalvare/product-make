/**
 * @name Settings Page
 * @description Secondary settings page aggregating account, preferences, and account actions
 * @mode axure
 */

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../themes/equatorial-minimalism/globals.css';
import './style.css';

interface LinkItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  description?: string;
}

interface ToggleItem {
  id: string;
  label: string;
  icon: string;
  value: boolean;
}

const accountItems: LinkItem[] = [
  {
    id: 'edit-profile',
    label: 'Edit Profile',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    path: '/edit-profile',
  },
  {
    id: 'security',
    label: 'Security',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    path: '/security',
  },
  {
    id: 'privacy',
    label: 'Privacy',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    path: '/privacy-settings',
  },
];

const initialPreferences: ToggleItem[] = [
  {
    id: 'notifications',
    label: 'Notifications',
    icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
    value: true,
  },
  {
    id: 'sound',
    label: 'Sound & Vibration',
    icon: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z',
    value: true,
  },
];

const ChevronRightIcon = () => (
  <svg className="w-5 h-5 text-[var(--outline)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
  </svg>
);

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState<ToggleItem[]>(initialPreferences);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToastMessage = (message: string) => {
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

  const handleToggle = (id: string) => {
    setPreferences((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const next = { ...item, value: !item.value };
        showToastMessage(`${item.label} ${next.value ? 'on' : 'off'}`);
        return next;
      })
    );
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    showToastMessage('Logged out');
  };

  const renderLinkGroup = (items: LinkItem[]) => (
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

  const renderToggleGroup = (items: ToggleItem[]) => (
    <div className="bg-[var(--surface-container-lowest)] rounded-2xl overflow-hidden shadow-ambient-sm">
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`flex items-center gap-4 px-4 py-3.5 ${
            index !== items.length - 1 ? 'border-b border-[var(--outline-variant)]/50' : ''
          }`}
        >
          <svg className="w-5 h-5 text-[var(--secondary)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
          </svg>
          <span className="flex-1 text-body-md text-[var(--on-surface)]">{item.label}</span>
          <button
            onClick={() => handleToggle(item.id)}
            className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${
              item.value ? 'bg-[var(--secondary)]' : 'bg-[var(--surface-container)]'
            }`}
            aria-label={`Toggle ${item.label}`}
          >
            <div
              className={`w-5 h-5 bg-[var(--on-secondary)] rounded-full absolute top-0.5 transition-transform ${
                item.value ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-full bg-[var(--surface)] flex flex-col">
      {/* Header */}
      <header className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] px-4 py-3 flex-shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/me')}
            className="p-2 -ml-2 hover:bg-[var(--surface-container)] rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-headline-md text-[var(--primary)]">Settings</h1>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4 space-y-4">
          {/* Account */}
          <div>
            <h2 className="text-label-md text-[var(--on-surface-variant)] uppercase tracking-wider mb-2 px-2">Account</h2>
            {renderLinkGroup(accountItems)}
          </div>

          {/* Preferences */}
          <div>
            <h2 className="text-label-md text-[var(--on-surface-variant)] uppercase tracking-wider mb-2 px-2">Preferences</h2>
            {renderToggleGroup(preferences)}
            <div className="mt-2 bg-[var(--surface-container-lowest)] rounded-2xl overflow-hidden shadow-ambient-sm">
              <button
                onClick={() => showToastMessage('Language selector coming soon')}
                className="w-full flex items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-[var(--surface-container-low)]"
              >
                <svg className="w-5 h-5 text-[var(--secondary)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <div className="flex-1">
                  <span className="text-body-md text-[var(--on-surface)]">Language</span>
                </div>
                <span className="text-body-md text-[var(--on-surface-variant)]">English</span>
                <ChevronRightIcon />
              </button>
            </div>
          </div>

          {/* Account Actions */}
          <div>
            <h2 className="text-label-md text-[var(--on-surface-variant)] uppercase tracking-wider mb-2 px-2">Account Actions</h2>
            <div className="bg-[var(--surface-container-lowest)] rounded-2xl overflow-hidden shadow-ambient-sm">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-[var(--surface-container-low)]"
              >
                <svg className="w-5 h-5 text-[var(--error)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-body-md text-[var(--error)]">Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-lg bg-[var(--inverse-surface)] text-[var(--inverse-on-surface)] text-body-sm font-medium shadow-ambient-lg pointer-events-auto">
          {toast}
        </div>
      )}

      {/* Log Out Confirmation */}
      {showLogoutConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl w-full max-w-[320px] p-6">
            <h3 className="text-title-md font-semibold text-[var(--on-surface)] mb-2">Log Out</h3>
            <p className="text-body-md text-[var(--on-surface-variant)] mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--surface-container)] text-[var(--on-surface)] text-label-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--error)] text-[var(--on-error)] text-label-lg font-medium hover:opacity-90 transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const Component = SettingsPage;
export default Component;
