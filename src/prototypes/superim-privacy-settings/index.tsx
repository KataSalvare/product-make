/**
 * @name Privacy Settings
 * @description Privacy controls for profile visibility, online status, and data sharing with interactive selection sheets
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../themes/equatorial-minimalism/globals.css';
import './style.css';

interface PrivacyItem {
  id: string;
  label: string;
  icon: string;
  type: 'toggle' | 'select' | 'action';
  value?: boolean;
  description?: string;
}

interface PrivacySection {
  title: string;
  items: PrivacyItem[];
}

interface BlockedUser {
  id: string;
  name: string;
  avatar: string;
}

const visibilityOptions = ['Everyone', 'My Contacts', 'Nobody'];

const mockBlockedUsers: BlockedUser[] = [
  { id: '1', name: 'Spam Bot 01', avatar: 'SB' },
  { id: '2', name: 'Marcus Johnson', avatar: 'MJ' },
];

const PrivacySettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [privacy, setPrivacy] = useState<PrivacySection[]>([
    {
      title: 'Visibility',
      items: [
        { id: 'lastSeen', label: 'Last Seen', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', type: 'select', description: 'Everyone' },
        { id: 'profilePhoto', label: 'Profile Photo', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', type: 'select', description: 'Everyone' },
        { id: 'about', label: 'About', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', type: 'select', description: 'Everyone' },
      ],
    },
    {
      title: 'Status',
      items: [
        { id: 'readReceipts', label: 'Read Receipts', icon: 'M5 13l4 4L19 7', type: 'toggle', value: true },
        { id: 'onlineStatus', label: 'Show Online Status', icon: 'M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z', type: 'toggle', value: true },
        { id: 'typingIndicator', label: 'Typing Indicator', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', type: 'toggle', value: true },
      ],
    },
    {
      title: 'Contact',
      items: [
        { id: 'whoCanAdd', label: 'Who Can Add Me', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z', type: 'select', description: 'Everyone' },
        { id: 'phoneDiscover', label: 'Find Me by Phone', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', type: 'toggle', value: true },
        { id: 'emailDiscover', label: 'Find Me by Email', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', type: 'toggle', value: false },
      ],
    },
    {
      title: 'Blocked',
      items: [
        { id: 'blocked', label: 'Blocked Users', icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636', type: 'action', description: `${mockBlockedUsers.length} users` },
      ],
    },
  ]);

  const [selectionSheet, setSelectionSheet] = useState<{ itemId: string; sectionIndex: number; itemIndex: number } | null>(null);
  const [showBlockedUsers, setShowBlockedUsers] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>(mockBlockedUsers);
  const [unblockConfirm, setUnblockConfirm] = useState<string | null>(null);

  const handleToggle = (sectionIndex: number, itemIndex: number) => {
    const newPrivacy = [...privacy];
    const item = newPrivacy[sectionIndex].items[itemIndex];
    if (item.type === 'toggle') {
      item.value = !item.value;
      setPrivacy(newPrivacy);
    }
  };

  const handleSelectOption = (option: string) => {
    if (!selectionSheet) return;
    const newPrivacy = [...privacy];
    newPrivacy[selectionSheet.sectionIndex].items[selectionSheet.itemIndex].description = option;
    setPrivacy(newPrivacy);
    setSelectionSheet(null);
  };

  const handleUnblock = (id: string) => {
    const remaining = blockedUsers.filter(u => u.id !== id).length;
    setBlockedUsers(prev => prev.filter(u => u.id !== id));
    const newPrivacy = [...privacy];
    const blockedSection = newPrivacy.find(s => s.items.some(i => i.id === 'blocked'));
    const blockedItem = blockedSection?.items.find(i => i.id === 'blocked');
    if (blockedItem) {
      blockedItem.description = `${remaining} users`;
    }
    setPrivacy(newPrivacy);
    setUnblockConfirm(null);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="h-full bg-[var(--surface)] flex flex-col">
      {/* Header */}
      <header className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-[var(--surface-container)] rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-headline-md text-[var(--primary)]">Privacy Settings</h1>
        </div>
      </header>

      {/* Privacy Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {privacy.map((section, sectionIndex) => (
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
                  {item.type === 'select' && (
                    <button
                      onClick={() => setSelectionSheet({ itemId: item.id, sectionIndex, itemIndex })}
                      className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                    >
                      <span className="text-label-sm text-[var(--secondary)]">{item.description}</span>
                      <svg className="w-4 h-4 text-[var(--outline)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                  {item.type === 'action' && (
                    <button
                      onClick={() => {
                        if (item.id === 'blocked') setShowBlockedUsers(true);
                      }}
                      className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                    >
                      <span className="text-label-sm text-[var(--secondary)]">{item.description}</span>
                      <svg className="w-4 h-4 text-[var(--outline)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-label-sm text-[var(--outline)]">Privacy settings affect how others find and interact with you</p>
        </div>
      </div>

      {/* Option Selection Sheet */}
      {selectionSheet && (
        <div className="absolute inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectionSheet(null)} />
          <div className="absolute bottom-0 left-0 right-0 bg-[var(--surface-container-lowest)] rounded-t-3xl animate-in slide-in-from-bottom duration-200">
            <div className="px-5 py-4 border-b border-[var(--outline-variant)]">
              <h3 className="text-title-md font-semibold text-[var(--on-surface)]">
                {privacy[selectionSheet.sectionIndex].items[selectionSheet.itemIndex].label}
              </h3>
            </div>
            <div className="py-2 max-h-[360px] overflow-y-auto">
              {visibilityOptions.map((option) => {
                const current = privacy[selectionSheet.sectionIndex].items[selectionSheet.itemIndex].description;
                return (
                  <button
                    key={option}
                    onClick={() => handleSelectOption(option)}
                    className="w-full flex items-start gap-3 px-5 py-4 hover:bg-[var(--surface-container-low)] transition-colors text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-body-md text-[var(--on-surface)] font-medium">{option}</p>
                      {option === 'Everyone' && <p className="text-label-sm text-[var(--on-surface-variant)] mt-0.5">All SuperIM users can see this</p>}
                      {option === 'My Contacts' && <p className="text-label-sm text-[var(--on-surface-variant)] mt-0.5">Only your contacts can see this</p>}
                      {option === 'Nobody' && <p className="text-label-sm text-[var(--on-surface-variant)] mt-0.5">No one can see this</p>}
                    </div>
                    {current === option && (
                      <svg className="w-5 h-5 text-[var(--secondary)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="px-5 py-4 border-t border-[var(--outline-variant)]">
              <button
                onClick={() => setSelectionSheet(null)}
                className="w-full py-3 rounded-xl bg-[var(--surface-container)] text-[var(--on-surface)] text-label-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blocked Users Sheet */}
      {showBlockedUsers && (
        <div className="absolute inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowBlockedUsers(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-[var(--surface-container-lowest)] rounded-t-3xl animate-in slide-in-from-bottom duration-200 max-h-[70vh] flex flex-col">
            <div className="px-5 py-4 border-b border-[var(--outline-variant)] flex items-center justify-between">
              <h3 className="text-title-md font-semibold text-[var(--on-surface)]">Blocked Users</h3>
              <button onClick={() => setShowBlockedUsers(false)} className="p-2 -mr-2 hover:bg-[var(--surface-container)] rounded-full transition-colors">
                <svg className="w-5 h-5 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {blockedUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-[var(--surface-container)] rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </div>
                  <p className="text-body-md text-[var(--on-surface-variant)]">No blocked users</p>
                </div>
              ) : (
                blockedUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 px-5 py-3 border-b border-[var(--outline-variant)]/50">
                    <div className="w-10 h-10 bg-[var(--surface-container-high)] rounded-full flex items-center justify-center text-[var(--on-surface-variant)] font-semibold text-sm">
                      {getInitials(user.name)}
                    </div>
                    <span className="flex-1 text-body-md text-[var(--on-surface)]">{user.name}</span>
                    <button
                      onClick={() => setUnblockConfirm(user.id)}
                      className="px-3 py-1.5 rounded-full text-label-sm font-medium text-[var(--error)] border border-[var(--error)] hover:bg-[var(--error)]/10 transition-colors"
                    >
                      Unblock
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Unblock Confirmation */}
          {unblockConfirm && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-[60] px-4">
              <div className="bg-[var(--surface-container-lowest)] rounded-2xl w-full max-w-[320px] p-6">
                <h3 className="text-title-md font-semibold text-[var(--on-surface)] mb-2">Unblock User</h3>
                <p className="text-body-md text-[var(--on-surface-variant)] mb-6">
                  Are you sure you want to unblock {blockedUsers.find(u => u.id === unblockConfirm)?.name}?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setUnblockConfirm(null)}
                    className="flex-1 py-3 px-4 rounded-xl bg-[var(--surface-container)] text-[var(--on-surface)] text-label-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUnblock(unblockConfirm)}
                    className="flex-1 py-3 px-4 rounded-xl bg-[var(--secondary)] text-[var(--on-secondary)] text-label-lg font-medium hover:bg-[var(--secondary)]/90 transition-colors"
                  >
                    Unblock
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Component = PrivacySettingsPage;
export default Component;
