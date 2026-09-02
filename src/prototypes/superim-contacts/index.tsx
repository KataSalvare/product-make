/**
 * @name Contacts List
 * @description Contact management with alphabetical indexing
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../themes/equatorial-minimalism/globals.css';
import './style.css';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: string;
  isOnline: boolean;
  isNew?: boolean;
}

const mockContacts: Contact[] = [
  { id: '1', name: 'Amara Okafor', avatar: '', status: 'Available', isOnline: true },
  { id: '2', name: 'Amina Ibrahim', avatar: '', status: 'At work', isOnline: false },
  { id: '3', name: 'Chioma Nnamdi', avatar: '', status: 'Hey there!', isOnline: true, isNew: true },
  { id: '4', name: 'Fatima Hassan', avatar: '', status: 'Busy', isOnline: false },
  { id: '5', name: 'Kwame Asante', avatar: '', status: 'On vacation', isOnline: false },
  { id: '6', name: 'Oluwaseun Adeyemi', avatar: '', status: 'Available', isOnline: true },
  { id: '7', name: 'Youssef Mahmoud', avatar: '', status: 'In a meeting', isOnline: false },
];

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const ContactsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('contacts');
  const [filter, setFilter] = useState<'all' | 'groups' | 'new'>('all');
  const [contacts] = useState(mockContacts);
  const [searchQuery, setSearchQuery] = useState('');

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getFirstLetter = (name: string) => name.charAt(0).toUpperCase();

  const filteredContacts = contacts.filter(contact => {
    if (filter === 'new') return contact.isNew;
    return contact.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const groupedContacts = filteredContacts.reduce((acc, contact) => {
    const letter = getFirstLetter(contact.name);
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(contact);
    return acc;
  }, {} as Record<string, Contact[]>);

  const handleStartTempChat = (contactId: string) => {
    navigate(`/temp-chat/${contactId}`);
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
      <header className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <h1 className="text-headline-md text-[var(--primary)]">Contacts</h1>
          <button className="p-2 hover:bg-[var(--surface-container)] rounded-full transition-colors">
            <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Search */}
      <div className="px-4 py-3 bg-[var(--surface-container-low)]">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts..."
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--surface-container-lowest)] rounded-xl text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 px-4 py-3 bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)]">
        {(['all', 'groups', 'new'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-label-md transition-all ${
              filter === f
                ? 'bg-[var(--secondary)] text-[var(--on-secondary)]'
                : 'bg-[var(--surface-container)] text-[var(--on-surface)] hover:bg-[var(--surface-container-high)]'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto relative">
        {Object.keys(groupedContacts).sort().map((letter) => (
          <div key={letter}>
            <div className="sticky top-0 px-4 py-2 bg-[var(--surface-container)] border-b border-[var(--outline-variant)]">
              <span className="text-label-md text-[var(--secondary)] font-semibold">{letter}</span>
            </div>
            {groupedContacts[letter].map((contact) => (
              <div
                key={contact.id}
                className="flex items-center gap-3 px-4 py-3 bg-[var(--surface-container-lowest)] border-b border-[var(--outline-variant)]/50 hover:bg-[var(--surface-container-low)] transition-colors cursor-pointer"
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-[var(--primary-container)] rounded-full flex items-center justify-center text-[var(--on-primary-container)] font-semibold">
                    {getInitials(contact.name)}
                  </div>
                  {contact.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-[var(--secondary)] border-2 border-[var(--surface)] rounded-full" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--on-surface)]">{contact.name}</h3>
                  <p className="text-body-md text-[var(--on-surface-variant)]">{contact.status}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleStartTempChat(contact.id); }}
                  className="p-2 text-[var(--secondary)] hover:bg-[var(--secondary-container)] rounded-full transition-colors"
                  aria-label="Start temporary chat"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
                {contact.isNew && (
                  <span className="px-2 py-1 bg-[var(--secondary)] text-[var(--on-secondary)] text-label-sm rounded-full">New</span>
                )}
              </div>
            ))}
          </div>
        ))}

        {/* Alphabet Index */}
        <div className="absolute right-1 top-4 bottom-4 flex flex-col justify-center">
          {alphabet.map((letter) => (
            <button
              key={letter}
              className={`w-6 h-5 flex items-center justify-center text-label-sm ${
                groupedContacts[letter] ? 'text-[var(--secondary)] font-semibold' : 'text-[var(--outline)]'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="absolute bottom-24 right-4 w-14 h-14 bg-[var(--secondary)] text-[var(--on-secondary)] rounded-full shadow-ambient-lg flex items-center justify-center hover:bg-[var(--secondary-container)] transition-colors z-10">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      </button>

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

const Component = ContactsPage;
export default Component;
