/**
 * @name ContactSelection Page
 * @description Contact selection page for adding members to group chat
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
  isOnline?: boolean;
  isSelected?: boolean;
}

const mockContacts: Contact[] = [
  { id: '1', name: 'Adebayo Johnson', avatar: 'AJ', isOnline: true },
  { id: '2', name: 'Chioma Okafor', avatar: 'CO', isOnline: false },
  { id: '3', name: 'Emmanuel Nkrumah', avatar: 'EN', isOnline: true },
  { id: '4', name: 'Fatima Abdullahi', avatar: 'FA', isOnline: false },
  { id: '5', name: 'Grace Mensah', avatar: 'GM', isOnline: true },
  { id: '6', name: 'Hassan Ibrahim', avatar: 'HI', isOnline: false },
  { id: '7', name: 'Ifeoma Chukwu', avatar: 'IC', isOnline: true },
  { id: '8', name: 'Jabari Osei', avatar: 'JO', isOnline: false },
  { id: '9', name: 'Kofi Asante', avatar: 'KA', isOnline: true },
  { id: '10', name: 'Laila Mohammed', avatar: 'LM', isOnline: false },
  { id: '11', name: 'Musa Bello', avatar: 'MB', isOnline: true },
  { id: '12', name: 'Ngozi Eze', avatar: 'NE', isOnline: false },
];

const ContactSelectionPage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contacts, searchQuery]);

  const selectedContacts = contacts.filter(c => c.isSelected);

  const toggleContact = (id: string) => {
    setContacts(prev => prev.map(c =>
      c.id === id ? { ...c, isSelected: !c.isSelected } : c
    ));
  };

  const handleAddMembers = () => {
    console.log('Adding members:', selectedContacts.map(c => c.name));
    setShowConfirmDialog(false);
    // Navigate back or show success
  };

  // Group contacts by first letter
  const groupedContacts = useMemo(() => {
    const groups: { [key: string]: Contact[] } = {};
    filteredContacts.forEach(contact => {
      const firstLetter = contact.name.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(contact);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredContacts]);

  return (
    <div className="h-full bg-[var(--surface)]">
      {/* Header */}
      <header className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button className="p-2 -ml-2 hover:bg-[var(--surface-container)] rounded-full transition-colors">
            <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-headline-md text-[var(--primary)] flex-1">Add Members</h1>
          {selectedContacts.length > 0 && (
            <button
              onClick={() => setShowConfirmDialog(true)}
              className="px-4 py-2 bg-[var(--primary)] text-[var(--on-primary)] rounded-full text-label-md font-medium hover:opacity-90 transition-colors"
            >
              Add ({selectedContacts.length})
            </button>
          )}
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-4 py-3">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts..."
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--surface-container-lowest)] rounded-xl text-body-md text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--surface-container-high)] rounded-full transition-colors"
            >
              <svg className="w-4 h-4 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Selected Contacts Chips */}
      {selectedContacts.length > 0 && (
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {selectedContacts.map(contact => (
              <button
                key={contact.id}
                onClick={() => toggleContact(contact.id)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[var(--primary-fixed)] text-[var(--on-primary-fixed)] rounded-full text-label-md whitespace-nowrap hover:bg-[var(--primary-fixed-dim)] transition-colors"
              >
                <span>{contact.name}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Contacts List */}
      <div className="pb-8">
        {groupedContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <svg className="w-16 h-16 text-[var(--on-surface-variant)] opacity-50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-body-md text-[var(--on-surface-variant)]">No contacts found</p>
          </div>
        ) : (
          groupedContacts.map(([letter, letterContacts]) => (
            <div key={letter}>
              {/* Section Header */}
              <div className="sticky top-[73px] bg-[var(--surface-container-low)] px-4 py-2">
                <span className="text-label-sm font-semibold text-[var(--primary)]">{letter}</span>
              </div>

              {/* Contacts in this section */}
              <div className="bg-[var(--surface-container-lowest)]">
                {letterContacts.map((contact, index) => (
                  <button
                    key={contact.id}
                    onClick={() => toggleContact(contact.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                      index !== letterContacts.length - 1 ? 'border-b border-[var(--outline-variant)]' : ''
                    } ${contact.isSelected ? 'bg-[var(--primary-fixed)]' : 'hover:bg-[var(--surface-container-high)]'}`}
                  >
                    {/* Checkbox */}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      contact.isSelected
                        ? 'bg-[var(--primary)] border-[var(--primary)]'
                        : 'border-[var(--outline)]'
                    }`}>
                      {contact.isSelected && (
                        <svg className="w-4 h-4 text-[var(--on-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 bg-[var(--primary-container)] rounded-full flex items-center justify-center text-[var(--on-primary-container)] font-semibold">
                        {contact.avatar}
                      </div>
                      {contact.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[var(--secondary)] rounded-full border-2 border-[var(--surface-container)]" />
                      )}
                    </div>

                    {/* Name */}
                    <div className="flex-1 text-left">
                      <p className="text-body-md font-semibold text-[var(--on-surface)]">{contact.name}</p>
                      <p className="text-label-xs text-[var(--on-surface-variant)]">
                        {contact.isOnline ? 'Online' : 'Last seen recently'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirm Dialog */}
      {showConfirmDialog && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl w-full max-w-[320px] p-6">
            <h3 className="text-title-md font-semibold text-[var(--on-surface)] mb-2">
              Add {selectedContacts.length} Member{selectedContacts.length > 1 ? 's' : ''}
            </h3>
            <p className="text-body-md text-[var(--on-surface-variant)] mb-6">
              Are you sure you want to add these members to the group?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--surface-container)] text-[var(--on-surface)] text-label-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMembers}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--primary)] text-[var(--on-primary)] text-label-lg font-medium hover:opacity-90 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Component = ContactSelectionPage;
export default Component;
