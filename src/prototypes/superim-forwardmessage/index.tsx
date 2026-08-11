/**
 * @name ForwardMessage Page
 * @description Forward message to contacts or groups
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../../themes/equatorial-minimalism/globals.css';
import './style.css';
import { formatBytes, useCloudDrive } from '../superim-cloud-drive/store';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  type: 'contact' | 'group';
  lastActive?: string;
  memberCount?: number;
}

interface ChatFolder {
  id: string;
  name: string;
  chatIds: string[];
}

const mockChats: Contact[] = [
  { id: '1', name: 'Amara Okafor', avatar: '', type: 'contact' },
  { id: '2', name: 'Design Team', avatar: '', type: 'group' },
  { id: '3', name: 'Chioma Nnamdi', avatar: '', type: 'contact' },
  { id: '4', name: 'Family Group', avatar: '', type: 'group' },
  { id: '5', name: 'Kwame Asante', avatar: '', type: 'contact' },
  { id: '9', name: 'Project Alpha', avatar: '', type: 'group' },
  { id: '10', name: 'Marketing Team', avatar: '', type: 'group' },
];

const mockContacts: Contact[] = [
  { id: '6', name: 'Amina Ibrahim', avatar: '', type: 'contact', lastActive: 'Online' },
  { id: '7', name: 'Oluwaseun Adeyemi', avatar: '', type: 'contact', lastActive: '3 hours ago' },
  { id: '8', name: 'Tech Support', avatar: '', type: 'contact', lastActive: 'Yesterday' },
  { id: '11', name: 'Zainab Mohammed', avatar: '', type: 'contact', lastActive: '2 days ago' },
  { id: '12', name: 'Emeka Okonkwo', avatar: '', type: 'contact', lastActive: 'Last week' },
];

const mockFolders: ChatFolder[] = [
  { id: 'all', name: 'All', chatIds: [] },
  { id: 'work', name: 'Work', chatIds: ['2', '9', '10'] },
  { id: 'family', name: 'Family', chatIds: ['4'] },
];

const SAVED_MESSAGES_ID = 'saved-messages';

const savedMessagesTarget: Contact = {
  id: SAVED_MESSAGES_ID,
  name: 'Saved Messages',
  avatar: '',
  type: 'contact',
};

const ForwardMessagePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cloudDrive = useCloudDrive();
  const [activeTab, setActiveTab] = useState<'chats' | 'contacts'>('chats');
  const [activeFolderId, setActiveFolderId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const isCloudDriveSend = searchParams.get('source') === 'cloud-drive';
  const cloudFileIds = useMemo(() => (searchParams.get('fileIds') || '').split(',').filter(Boolean), [searchParams]);
  const cloudFiles = useMemo(() => cloudDrive.files.filter(file => cloudFileIds.includes(file.id)), [cloudDrive.files, cloudFileIds]);

  const allChatTargets = useMemo(() => [savedMessagesTarget, ...mockChats], []);

  const filteredChats = useMemo(() => {
    let list = allChatTargets;
    if (activeFolderId !== 'all') {
      const folder = mockFolders.find(f => f.id === activeFolderId);
      if (folder) {
        list = list.filter(c => c.id === SAVED_MESSAGES_ID || folder.chatIds.includes(c.id));
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q));
    }
    return list;
  }, [activeFolderId, searchQuery, allChatTargets]);

  const filteredContacts = useMemo(() => {
    let list = [...mockContacts];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q));
    }
    return list;
  }, [searchQuery]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSend = async () => {
    if (selectedIds.length === 0) return;
    setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSending(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate(-1);
    }, 1500);
  };

  const allSelectableTargets = useMemo(() => [savedMessagesTarget, ...mockChats, ...mockContacts], []);

  const renderCheckbox = (id: string) => (
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
      selectedIds.includes(id)
        ? 'bg-[var(--primary)] border-[var(--primary)]'
        : 'border-[var(--outline)]'
    }`}>
      {selectedIds.includes(id) && (
        <svg className="w-3.5 h-3.5 text-[var(--on-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  );

  const renderAvatar = (name: string, isSavedMessages = false) => (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
      isSavedMessages
        ? 'bg-[var(--secondary-container)] text-[var(--on-secondary-container)]'
        : 'bg-[var(--primary-container)] text-[var(--on-primary-container)]'
    }`}>
      {isSavedMessages ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      ) : (
        getInitials(name)
      )}
    </div>
  );

  const renderTargetItem = (contact: Contact, isContactTab = false) => (
    <div
      key={contact.id}
      onClick={() => toggleSelection(contact.id)}
      className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors border-b border-[var(--outline-variant)]/50 ${
        selectedIds.includes(contact.id) ? 'bg-[var(--primary-fixed)]' : 'hover:bg-[var(--surface-container-low)]'
      }`}
    >
      {renderCheckbox(contact.id)}
      {renderAvatar(contact.name, contact.id === SAVED_MESSAGES_ID)}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-body-sm text-[var(--on-surface)] truncate">{contact.name}</h3>
          {contact.type === 'group' && !isContactTab && (
            <span className="text-label-xs text-[var(--on-surface-variant)] flex-shrink-0">Group</span>
          )}
        </div>
        {isContactTab && contact.lastActive && (
          <p className="text-label-xs text-[var(--on-surface-variant)]">{contact.lastActive}</p>
        )}
      </div>
    </div>
  );

  const hasResults = activeTab === 'chats'
    ? filteredChats.length > 0
    : filteredContacts.length > 0;

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
            <h1 className="text-headline-md text-[var(--primary)]">
              {isCloudDriveSend ? `Send ${cloudFiles.length || ''} ${cloudFiles.length === 1 ? 'file' : 'files'} to` : 'Forward to'}{selectedIds.length > 0 && ` (${selectedIds.length})`}
            </h1>
          </div>
          <button
            onClick={handleSend}
            disabled={selectedIds.length === 0 || isSending}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedIds.length > 0 && !isSending
                ? 'bg-[var(--primary)] text-[var(--on-primary)]'
                : 'bg-[var(--surface-container)] text-[var(--on-surface-variant)] cursor-not-allowed'
            }`}
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </header>

      {isCloudDriveSend && cloudFiles.length > 0 && (
        <div className="px-4 py-3 bg-[var(--primary-fixed)]/45 border-b border-[var(--outline-variant)]">
          <p className="text-label-sm font-semibold text-[var(--on-primary-fixed)]">FROM CLOUD DRIVE</p>
          <div className="mt-2 flex gap-2 overflow-x-auto scrollbar-hide">
            {cloudFiles.map(file => (
              <div key={file.id} className="min-w-[170px] max-w-[210px] rounded-xl bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] px-3 py-2">
                <p className="text-sm font-semibold text-[var(--on-surface)] truncate">{file.name}</p>
                <p className="text-xs text-[var(--on-surface-variant)] mt-0.5">{formatBytes(file.sizeBytes)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="px-4 py-2 border-b border-[var(--outline-variant)]">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'chats' ? 'Search chats' : 'Search contacts'}
            className="w-full pl-10 pr-4 py-2 bg-[var(--surface-container-lowest)] rounded-xl text-body-sm text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--surface-container-high)] rounded-full transition-colors"
            >
              <svg className="w-4 h-4 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Folder Tabs */}
      {activeTab === 'chats' && (
        <div className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] px-4 py-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {mockFolders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setActiveFolderId(folder.id)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-label-sm font-medium transition-all ${
                  activeFolderId === folder.id
                    ? 'bg-[var(--secondary)] text-[var(--on-secondary)]'
                    : 'bg-[var(--surface-container)] text-[var(--on-surface)] hover:bg-[var(--surface-container-high)]'
                }`}
              >
                {folder.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Recipients Bar */}
      {selectedIds.length > 0 && (
        <div className="px-4 py-2 bg-[var(--primary-fixed)]/40 border-b border-[var(--outline-variant)] overflow-x-auto">
          <div className="flex gap-2">
            {allSelectableTargets
              .filter(c => selectedIds.includes(c.id))
              .map(contact => (
                <div key={contact.id} className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--primary-fixed)] text-[var(--on-primary-fixed)] rounded-full text-xs">
                  <span className="font-medium whitespace-nowrap">{contact.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelection(contact.id);
                    }}
                    className="p-0.5 hover:bg-[var(--on-primary-fixed)]/10 rounded-full"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Lists */}
      <div className="flex-1 overflow-y-auto pb-24">
        {!hasResults ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 bg-[var(--surface-container-low)] rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[var(--outline)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-body-md text-[var(--on-surface-variant)] text-center">
              No {activeTab} found for "{searchQuery}"
            </p>
          </div>
        ) : activeTab === 'chats' ? (
          <div className="bg-[var(--surface-container-lowest)]">
            {filteredChats.map(contact => renderTargetItem(contact, false))}
          </div>
        ) : (
          <div className="bg-[var(--surface-container-lowest)]">
            {filteredContacts.map(contact => renderTargetItem(contact, true))}
          </div>
        )}
      </div>

      {/* Bottom Floating Capsule */}
      <nav className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div
          className="flex items-center gap-1 px-1.5 py-1.5 rounded-full shadow-ambient-lg border border-white/20"
          style={{
            background: 'rgba(255, 255, 255, 0.72)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)'
          }}
        >
          <button
            onClick={() => setActiveTab('chats')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'chats'
                ? 'bg-[var(--primary)] text-[var(--on-primary)]'
                : 'text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-low)]'
            }`}
          >
            Chats
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'contacts'
                ? 'bg-[var(--primary)] text-[var(--on-primary)]'
                : 'text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-low)]'
            }`}
          >
            Contacts
          </button>
        </div>
      </nav>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-2 px-4 py-3 bg-green-500 text-white rounded-full shadow-ambient-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">{isCloudDriveSend ? `${cloudFiles.length} ${cloudFiles.length === 1 ? 'file' : 'files'} sent!` : 'Message forwarded!'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const Component = ForwardMessagePage;
export default Component;
