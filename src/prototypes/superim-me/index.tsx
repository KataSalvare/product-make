/**
 * @name Me Page
 * @description User profile and settings hub with integrated settings options
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState } from 'react';
import '../../themes/equatorial-minimalism/globals.css';
import './style.css';

interface SettingItem {
  id: string;
  label: string;
  icon: string;
  type: 'toggle' | 'link' | 'action';
  value?: boolean;
  description?: string;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

const MePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('me');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [settings, setSettings] = useState<SettingSection[]>([
    {
      title: 'Account',
      items: [
        { id: 'profile', label: 'Edit Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', type: 'link' },
        { id: 'privacy', label: 'Privacy Settings', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', type: 'link' },
        { id: 'security', label: 'Security', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', type: 'link' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { id: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', type: 'toggle', value: true },
        { id: 'sound', label: 'Sound & Vibration', icon: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z', type: 'toggle', value: true },
        { id: 'language', label: 'Language', icon: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129', type: 'link', description: 'English' },
      ],
    },
    {
      title: 'Support',
      items: [
        { id: 'help', label: 'Help Center', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', type: 'link' },
        { id: 'about', label: 'About', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', type: 'link', description: 'v2.1.0' },
        { id: 'terms', label: 'Terms of Service', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', type: 'link' },
        { id: 'privacyPolicy', label: 'Privacy Policy', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', type: 'link' },
      ],
    },
  ]);

  const handleToggle = (sectionIndex: number, itemIndex: number) => {
    const newSettings = [...settings];
    const item = newSettings[sectionIndex].items[itemIndex];
    if (item.type === 'toggle') {
      item.value = !item.value;
      setSettings(newSettings);
    }
  };

  const tabs = [
    { id: 'chats', label: 'Chats', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { id: 'contacts', label: 'Contacts', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'feed', label: 'Feed', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'calls', label: 'Calls', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
    { id: 'me', label: 'Me', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

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
      <div className="px-4 py-6 bg-[var(--surface-container-low)]">
        <div className="bg-[var(--surface-container-lowest)] rounded-2xl p-6 shadow-ambient-sm">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-[var(--primary)] rounded-full flex items-center justify-center text-[var(--on-primary)] text-2xl font-bold border-4 border-[var(--surface-container-lowest)] shadow-ambient-md">
              JD
            </div>
            <div className="flex-1">
              <h2 className="text-headline-sm text-[var(--on-surface)] font-bold">John Doe</h2>
              <p className="text-body-md text-[var(--on-surface-variant)] mt-1">@john999</p>
              <p className="text-label-md text-[var(--secondary)] mt-1">"Living life one day at a time 🌟"</p>
            </div>
            <button className="p-2 hover:bg-[var(--surface-container)] rounded-full transition-colors">
              <svg className="w-5 h-5 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* My Posts Section */}
      <div className="px-4 pt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-label-md text-[var(--on-surface-variant)] uppercase tracking-wider px-2">
            My Posts
          </h2>
          <button className="text-label-sm text-[var(--secondary)] font-medium hover:underline px-2">
            View All →
          </button>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <div className="aspect-square bg-gradient-to-br from-[var(--secondary-container)] to-[var(--secondary)]/40 rounded-xl flex items-center justify-center overflow-hidden">
            <svg className="w-8 h-8 text-[var(--on-secondary-container)]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="aspect-square bg-gradient-to-br from-[var(--primary-fixed)] to-[var(--primary)]/20 rounded-xl flex items-center justify-center overflow-hidden">
            <svg className="w-8 h-8 text-[var(--on-primary-container)]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="aspect-square bg-gradient-to-br from-[var(--tertiary-container)] to-[var(--tertiary)]/30 rounded-xl flex items-center justify-center overflow-hidden">
            <svg className="w-8 h-8 text-[var(--on-tertiary-container)]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="px-4 py-4 space-y-4">
        {settings.map((section, sectionIndex) => (
          <div key={section.title}>
            <h2 className="text-label-md text-[var(--on-surface-variant)] uppercase tracking-wider mb-2 px-2">
              {section.title}
            </h2>
            <div className="bg-[var(--surface-container-lowest)] rounded-xl overflow-hidden shadow-ambient-sm">
              {section.items.map((item, itemIndex) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    itemIndex !== section.items.length - 1 ? 'border-b border-[var(--outline-variant)]/50' : ''
                  }`}
                >
                  <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                  <div className="flex-1">
                    <span className="text-body-md text-[var(--on-surface)]">{item.label}</span>
                    {item.description && (
                      <p className="text-label-sm text-[var(--on-surface-variant)]">{item.description}</p>
                    )}
                  </div>
                  {item.type === 'toggle' && (
                    <button
                      onClick={() => handleToggle(sectionIndex, itemIndex)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        item.value ? 'bg-[var(--secondary)]' : 'bg-[var(--surface-container)]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-[var(--on-secondary)] rounded-full absolute top-0.5 transition-transform ${
                          item.value ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  )}
                  {(item.type === 'link' || item.type === 'action') && (
                    <svg className="w-5 h-5 text-[var(--outline)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Account Actions */}
        <div>
          <h2 className="text-label-md text-[var(--on-surface-variant)] uppercase tracking-wider mb-2 px-2">
            Account Actions
          </h2>
          <div className="bg-[var(--surface-container-lowest)] rounded-xl overflow-hidden shadow-ambient-sm">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center gap-3 px-4 py-3 border-b border-[var(--outline-variant)]/50 hover:bg-[var(--surface-container-low)] transition-colors">
              <svg className="w-5 h-5 text-[var(--error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-body-md text-[var(--error)]">Log Out</span>
            </button>
            <button
              onClick={() => { setShowDeleteAccountConfirm(true); setDeleteConfirmText(''); }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container-low)] transition-colors">
              <svg className="w-5 h-5 text-[var(--error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="text-body-md text-[var(--error)]">Delete Account</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-label-sm text-[var(--outline)]">SuperIM v2.1.0</p>
          <p className="text-label-xs text-[var(--outline)] mt-1">Made with ❤️ for Africa</p>
        </div>
      </div>
      </div>

      {/* Log Out Confirmation Dialog */}
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
                onClick={() => { setShowLogoutConfirm(false); console.log('Log out'); }}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--error)] text-[var(--on-error)] text-label-lg font-medium hover:opacity-90 transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Dialog */}
      {showDeleteAccountConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl w-full max-w-[320px] p-6">
            <h3 className="text-title-md font-semibold text-[var(--on-surface)] mb-2">Delete Account</h3>
            <p className="text-body-md text-[var(--on-surface-variant)] mb-4">
              This action is irreversible. All your data, messages, and contacts will be permanently removed.
            </p>
            <p className="text-label-sm text-[var(--on-surface-variant)] mb-3">
              Type <span className="font-bold text-[var(--error)]">DELETE</span> to confirm
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder='Type "DELETE" here'
              className="w-full px-3 py-2.5 bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded-lg text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/60 focus:outline-none focus:border-[var(--error)] transition-colors text-sm mb-6"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteAccountConfirm(false); setDeleteConfirmText(''); }}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--surface-container)] text-[var(--on-surface)] text-label-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowDeleteAccountConfirm(false); setDeleteConfirmText(''); console.log('Delete account'); }}
                disabled={deleteConfirmText !== 'DELETE'}
                className={`flex-1 py-3 px-4 rounded-xl text-label-lg font-medium transition-all ${
                  deleteConfirmText === 'DELETE'
                    ? 'bg-[var(--error)] text-[var(--on-error)] hover:opacity-90'
                    : 'bg-[var(--surface-container)] text-[var(--on-surface-variant)] cursor-not-allowed'
                }`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation */}
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

const Component = MePage;
export default Component;
