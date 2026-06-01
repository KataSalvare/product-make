/**
 * @name ForwardMessage Page
 * @description Forward message to contacts or groups
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState, useMemo } from 'react';
import '../../themes/equatorial-minimalism/globals.css';
import './style.css';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  type: 'contact' | 'group';
  lastActive?: string;
  memberCount?: number;
}

interface ForwardMessage {
  type: 'text' | 'image' | 'video' | 'file' | 'voice' | 'location';
  content: string;
  preview?: string;
}

const mockRecent: Contact[] = [
  { id: '1', name: 'Amara Okafor', avatar: '', type: 'contact', lastActive: '10 min ago' },
  { id: '2', name: 'Design Team', avatar: '', type: 'group', memberCount: 12 },
  { id: '3', name: 'Chioma Nnamdi', avatar: '', type: 'contact', lastActive: '1 hour ago' },
  { id: '4', name: 'Family Group', avatar: '', type: 'group', memberCount: 8 },
  { id: '5', name: 'Kwame Asante', avatar: '', type: 'contact', lastActive: '2 hours ago' },
];

const mockContacts: Contact[] = [
  { id: '6', name: 'Amina Ibrahim', avatar: '', type: 'contact', lastActive: 'Online' },
  { id: '7', name: 'Oluwaseun Adeyemi', avatar: '', type: 'contact', lastActive: '3 hours ago' },
  { id: '8', name: 'Tech Support', avatar: '', type: 'contact', lastActive: 'Yesterday' },
  { id: '9', name: 'Project Alpha', avatar: '', type: 'group', memberCount: 25 },
  { id: '10', name: 'Marketing Team', avatar: '', type: 'group', memberCount: 15 },
  { id: '11', name: 'Zainab Mohammed', avatar: '', type: 'contact', lastActive: '2 days ago' },
  { id: '12', name: 'Emeka Okonkwo', avatar: '', type: 'contact', lastActive: 'Last week' },
];

const mockMessageToForward: ForwardMessage = {
  type: 'text',
  content: 'Beautiful sunset at the beach today! 🌅 Nothing beats the view from Lagos coast.',
};

const ForwardMessagePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return { recent: mockRecent, contacts: mockContacts };
    const query = searchQuery.toLowerCase();
    const filterFn = (c: Contact) => c.name.toLowerCase().includes(query);
    return {
      recent: mockRecent.filter(filterFn),
      contacts: mockContacts.filter(filterFn),
    };
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
      console.log('Navigate back');
    }, 2000);
  };

  const getMessagePreview = () => {
    const { type, content } = mockMessageToForward;
    switch (type) {
      case 'image':
        return { icon: '📷', text: 'Photo' };
      case 'video':
        return { icon: '🎥', text: 'Video' };
      case 'file':
        return { icon: '📎', text: 'File' };
      case 'voice':
        return { icon: '🎤', text: 'Voice Message' };
      case 'location':
        return { icon: '📍', text: 'Location' };
      default:
        return { icon: '💬', text: content.length > 60 ? content.slice(0, 60) + '...' : content };
    }
  };

  const preview = getMessagePreview();

  const renderContactItem = (contact: Contact, showDivider: boolean) => (
    <div
      key={contact.id}
      onClick={() => toggleSelection(contact.id)}
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
        selectedIds.includes(contact.id) ? 'bg-[var(--primary-fixed)]' : 'hover:bg-[var(--surface-container-low)]'
      } ${showDivider ? 'border-b border-[var(--outline-variant)]/50' : ''}`}
    >
      {/* Checkbox */}
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
        selectedIds.includes(contact.id)
          ? 'bg-[var(--primary)] border-[var(--primary)]'
          : 'border-[var(--outline)]'
      }`}>
        {selectedIds.includes(contact.id) && (
          <svg className="w-4 h-4 text-[var(--on-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {/* Avatar */}
      <div className="w-12 h-12 bg-[var(--primary-container)] rounded-full flex items-center justify-center text-[var(--on-primary-container)] text-sm font-semibold flex-shrink-0">
        {getInitials(contact.name)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-[var(--on-surface)] truncate">{contact.name}</h3>
          {contact.type === 'group' && (
            <span className="text-label-sm text-[var(--on-surface-variant)]">
              {contact.memberCount} members
            </span>
          )}
        </div>
        <p className="text-label-sm text-[var(--on-surface-variant)]">
          {contact.type === 'group' ? 'Group' : contact.lastActive}
        </p>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-[var(--surface)] flex flex-col">
      {/* Header */}
      <header className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <button className="p-2 -ml-2 hover:bg-[var(--surface-container)] rounded-full transition-colors">
            <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-headline-md text-[var(--primary)] font-semibold">
            Forward to{selectedIds.length > 0 && ` (${selectedIds.length})`}
          </h1>
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

      {/* Message Preview */}
      <div className="px-4 py-4 bg-[var(--secondary-container)]/30">
        <p className="text-label-sm text-[var(--on-surface-variant)] mb-2">Forwarding:</p>
        <div className="flex items-start gap-3 bg-[var(--surface-container-lowest)] rounded-xl p-3 shadow-ambient-sm">
          <span className="text-2xl">{preview.icon}</span>
          <p className="text-body-md text-[var(--on-surface)] line-clamp-2">{preview.text}</p>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-[var(--outline-variant)]">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts or groups"
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--surface-container-lowest)] rounded-xl text-body-md text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--surface-container-high)] rounded-full transition-colors">
              <svg className="w-4 h-4 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Selected Recipients Bar */}
      {selectedIds.length > 0 && (
        <div className="px-4 py-2 bg-[var(--primary-fixed)]/40 border-b border-[var(--outline-variant)] overflow-x-auto">
          <div className="flex gap-2">
            {[...mockRecent, ...mockContacts]
              .filter(c => selectedIds.includes(c.id))
              .map(contact => (
                <div key={contact.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--primary-fixed)] text-[var(--on-primary-fixed)] rounded-full text-sm">
                  <span className="font-medium whitespace-nowrap">{contact.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelection(contact.id);
                    }}
                    className="p-0.5 hover:bg-[var(--on-primary-fixed)]/10 rounded-full"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Contact Lists */}
      <div className="flex-1 overflow-y-auto">
        {/* Recent */}
        {filteredContacts.recent.length > 0 && (
          <div>
            <h3 className="text-label-sm text-[var(--on-surface-variant)] uppercase tracking-wider px-4 py-2 sticky top-0 bg-[var(--surface)]">
              Recent
            </h3>
            <div className="bg-[var(--surface-container-lowest)]">
              {filteredContacts.recent.map((contact, index) =>
                renderContactItem(contact, index < filteredContacts.recent.length - 1)
              )}
            </div>
          </div>
        )}

        {/* Contacts & Groups */}
        {filteredContacts.contacts.length > 0 && (
          <div>
            <h3 className="text-label-sm text-[var(--on-surface-variant)] uppercase tracking-wider px-4 py-2 sticky top-0 bg-[var(--surface)]">
              Contacts & Groups
            </h3>
            <div className="bg-[var(--surface-container-lowest)]">
              {filteredContacts.contacts.map((contact, index) =>
                renderContactItem(contact, index < filteredContacts.contacts.length - 1)
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredContacts.recent.length === 0 && filteredContacts.contacts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 bg-[var(--surface-container-low)] rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[var(--outline)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-body-md text-[var(--on-surface-variant)] text-center">
              No contacts found for "{searchQuery}"
            </p>
          </div>
        )}
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-2 px-4 py-3 bg-green-500 text-white rounded-full shadow-ambient-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">Message forwarded!</span>
          </div>
        </div>
      )}

      {/* Send Button (Fixed Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 bg-[var(--surface)] border-t border-[var(--outline-variant)] px-4 py-4 safe-area-pb">
        <button
          onClick={handleSend}
          disabled={selectedIds.length === 0 || isSending}
          className={`w-full py-3.5 rounded-xl text-body-lg font-semibold transition-all ${
            selectedIds.length > 0 && !isSending
              ? 'bg-[var(--primary)] text-[var(--on-primary)] shadow-ambient-sm'
              : 'bg-[var(--surface-container)] text-[var(--on-surface-variant)] cursor-not-allowed'
          }`}
        >
          {isSending ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sending...
            </span>
          ) : (
            `Send to ${selectedIds.length} recipient${selectedIds.length !== 1 ? 's' : ''}`
          )}
        </button>
      </div>
    </div>
  );
};

const Component = ForwardMessagePage;
export default Component;
