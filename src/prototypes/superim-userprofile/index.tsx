/**
 * @name UserProfile Page
 * @description Detailed contact profile with actions
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../../themes/equatorial-minimalism/globals.css';
import './style.css';

interface UserProfile {
  name: string;
  username: string;
  bio: string;
  phone: string;
  location: string;
  isOnline: boolean;
  joinedDate: string;
  isContact: boolean;
}

interface MutualGroup {
  id: string;
  name: string;
  avatar: string;
  memberCount: number;
}

const mockMutualGroups: MutualGroup[] = [
  { id: '1', name: 'Design Team', avatar: 'DT', memberCount: 12 },
  { id: '2', name: 'Lagos Creatives', avatar: 'LC', memberCount: 48 },
  { id: '3', name: 'Product Hub', avatar: 'PH', memberCount: 8 },
];

const mockProfile: UserProfile = {
  name: 'Amara Okafor',
  username: '@amara.okafor',
  bio: 'Product Designer | Lagos, Nigeria 🇳🇬\nCreating beautiful experiences',
  phone: '+234 801 234 5678',
  location: 'Lagos, Nigeria',
  isOnline: true,
  joinedDate: 'March 2023',
  isContact: false,
};

const tabs = [
  { id: 'media', label: 'Media' },
  { id: 'files', label: 'Files' },
  { id: 'links', label: 'Links' },
  { id: 'groups', label: 'Groups' },
] as const;

type TabId = typeof tabs[number]['id'];

const UserProfilePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const profile = useMemo(() => {
    const name = searchParams.get('name');
    const isContactParam = searchParams.get('isContact');
    return {
      ...mockProfile,
      name: name || mockProfile.name,
      username: name ? `@${name.toLowerCase().replace(/\s+/g, '.')}` : mockProfile.username,
      isContact: isContactParam ? isContactParam === 'true' : mockProfile.isContact,
    };
  }, [searchParams]);

  const [isBlocked, setIsBlocked] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('media');
  const [toast, setToast] = useState<string | null>(null);
  const navigate = useNavigate();
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        moreButtonRef.current &&
        !moreButtonRef.current.contains(event.target as Node)
      ) {
        setShowMoreMenu(false);
      }
    };
    if (showMoreMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMoreMenu]);

  const showToast = (message: string) => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToast(message);
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
    }, 2000);
  };

  const handleShareContact = () => {
    setShowMoreMenu(false);
    navigate('/forward-message?shareContact=user123');
  };

  const handleBlockToggle = () => {
    setIsBlocked((prev) => {
      const next = !prev;
      showToast(next ? 'Contact blocked' : 'Contact unblocked');
      return next;
    });
    setShowMoreMenu(false);
  };

  const handleReport = () => {
    setShowMoreMenu(false);
    showToast('Report submitted');
  };

  const quickActions = [
    { id: 'message', label: 'Message', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { id: 'mute', label: 'Mute', icon: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z' },
    { id: 'call', label: 'Call', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
    { id: 'video', label: 'Video', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'media':
        return (
          <div className="grid grid-cols-3 gap-1">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-[var(--surface-container)] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--outline)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            ))}
          </div>
        );
      case 'files':
        return (
          <div className="space-y-2">
            {['Project brief.pdf', 'Meeting notes.docx'].map((name, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-[var(--surface-container)] rounded-xl">
                <div className="w-10 h-10 bg-[var(--primary-container)] rounded-lg flex items-center justify-center text-[var(--on-primary-container)]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-body-md text-[var(--on-surface)]">{name}</p>
                  <p className="text-label-sm text-[var(--on-surface-variant)]">2.4 MB</p>
                </div>
              </div>
            ))}
          </div>
        );
      case 'links':
        return (
          <div className="space-y-2">
            {['https://react.dev/learn', 'https://tailwindcss.com'].map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noreferrer" className="block p-3 bg-[var(--surface-container)] rounded-xl">
                <p className="text-body-md text-[var(--primary)] underline line-clamp-1">{url}</p>
              </a>
            ))}
          </div>
        );
      case 'groups':
        return (
          <div className="space-y-1">
            {mockMutualGroups.map((group) => (
              <button
                key={group.id}
                onClick={() => navigate('/group-chat')}
                className="w-full px-3 py-3 flex items-center gap-3 hover:bg-[var(--surface-container-low)] transition-colors text-left rounded-xl"
              >
                <div className="w-10 h-10 bg-[var(--secondary)] rounded-xl flex items-center justify-center text-[var(--on-secondary)] text-label-lg font-semibold flex-shrink-0">
                  {group.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-md text-[var(--on-surface)] font-medium truncate">{group.name}</p>
                  <p className="text-label-sm text-[var(--on-surface-variant)]">{group.memberCount} members</p>
                </div>
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full bg-[var(--surface)] flex flex-col">
      {/* Header */}
      <header className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 hover:bg-[var(--surface-container)] rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-headline-md text-[var(--primary)]">Profile</h1>
          </div>
          <div className="relative">
            <button
              ref={moreButtonRef}
              onClick={() => setShowMoreMenu((prev) => !prev)}
              className="p-2 hover:bg-[var(--surface-container)] rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            {showMoreMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--surface-container-low)] rounded-xl shadow-ambient-lg py-2 z-50">
                <button
                  onClick={handleShareContact}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface)]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span className="text-body-sm">Share Contact</span>
                </button>
                <button
                  onClick={handleBlockToggle}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container)] transition-colors text-[var(--error)]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  <span className="text-body-sm">{isBlocked ? 'Unblock' : 'Block'}</span>
                </button>
                <button
                  onClick={handleReport}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container)] transition-colors text-[var(--error)]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-body-sm">Report</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Header */}
        <div className="bg-[var(--surface-container-low)] px-6 pt-8 pb-6">
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-[var(--primary)] rounded-full flex items-center justify-center text-[var(--on-primary)] text-3xl font-bold border-4 border-[var(--surface)] shadow-ambient-lg">
                AO
              </div>
              {profile.isOnline && (
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-[var(--secondary)] border-4 border-[var(--surface)] rounded-full" />
              )}
            </div>

            {/* Name */}
            <h2 className="text-headline-md text-[var(--on-surface)] font-bold mt-4">{profile.name}</h2>
            <p className="text-body-md text-[var(--on-surface-variant)] mt-1">
              {profile.isOnline ? 'online' : 'last seen recently'}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-center gap-6 mt-6">
            {quickActions.map((action) => (
              <button
                key={action.id}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-12 h-12 bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] rounded-2xl flex items-center justify-center text-[var(--on-surface)] group-hover:bg-[var(--surface-container)] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={action.icon} />
                  </svg>
                </div>
                <span className="text-label-sm text-[var(--on-surface-variant)]">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Add to Contacts (non-contact only) */}
        {!profile.isContact && (
          <div className="px-4 py-3">
            <button className="w-full flex items-center justify-center gap-3 py-3.5 bg-[var(--secondary)] text-[var(--on-secondary)] rounded-2xl font-medium hover:opacity-90 transition-opacity">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Add to Contacts
            </button>
          </div>
        )}

        {/* Info Card */}
        <div className="px-4 py-2">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl p-4 space-y-4 shadow-ambient-sm">
            <div>
              <p className="text-body-md text-[var(--on-surface)]">{profile.username}</p>
              <p className="text-label-sm text-[var(--on-surface-variant)]">Username</p>
            </div>
            <div>
              <p className="text-body-md text-[var(--on-surface)]">{profile.phone}</p>
              <p className="text-label-sm text-[var(--on-surface-variant)]">Mobile</p>
            </div>
            {profile.bio && (
              <div>
                <p className="text-body-md text-[var(--on-surface)] whitespace-pre-line">{profile.bio}</p>
                <p className="text-label-sm text-[var(--on-surface-variant)]">Bio</p>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex bg-[var(--surface-container-low)] rounded-2xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 rounded-xl text-label-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[var(--secondary)] text-[var(--on-secondary)]'
                    : 'text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 pb-6 pt-2">
          {renderTabContent()}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-[var(--on-surface)] text-[var(--on-inverse)] px-4 py-2.5 rounded-full shadow-ambient-lg text-body-sm">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
};

const Component = UserProfilePage;
export default Component;
