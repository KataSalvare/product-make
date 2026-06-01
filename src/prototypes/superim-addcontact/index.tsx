/**
 * @name AddContact Page
 * @description Add friends via search, QR code, or contacts
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState } from 'react';
import '../../themes/equatorial-minimalism/globals.css';
import './style.css';

interface SearchResult {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: 'none' | 'pending' | 'friend';
}

const mockResults: SearchResult[] = [
  { id: '1', name: 'Amara Okafor', username: '@amara.okafor', avatar: 'AO', status: 'none' },
  { id: '2', name: 'Kwame Nkrumah', username: '@kwame.nkrumah', avatar: 'KN', status: 'friend' },
  { id: '3', name: 'Amina Ibrahim', username: '@amina.ibrahim', avatar: 'AI', status: 'pending' },
];

const AddContactPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>(mockResults);
  const [_, setActiveMethod] = useState<string | null>(null);

  const addMethods = [
    { id: 'username', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', label: 'Search by Username', color: 'bg-[var(--primary)]' },
    { id: 'phone', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', label: 'Search by Phone', color: 'bg-[var(--secondary)]' },
    { id: 'qr', icon: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z', label: 'Scan QR Code', color: 'bg-[var(--tertiary)]' },
    { id: 'contacts', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', label: 'Invite from Contacts', color: 'bg-[var(--primary-container)]' },
  ];

  const handleAdd = (id: string) => {
    setResults(results.map(r => r.id === id ? { ...r, status: 'pending' } : r));
  };

  return (
    <div className="h-full bg-[var(--surface)] flex flex-col">
      {/* Header */}
      <header className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button className="p-2 -ml-2 hover:bg-[var(--surface-container)] rounded-full transition-colors">
            <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-headline-md text-[var(--primary)]">Add Contact</h1>
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3 px-4 py-3 bg-[var(--surface-container-low)] rounded-xl">
          <svg className="w-5 h-5 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by username or phone"
            className="flex-1 bg-transparent text-body-md text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/60 focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-[var(--surface-container)] rounded-full">
              <svg className="w-4 h-4 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Add Methods */}
      {!searchQuery && (
        <div className="px-4 pb-4">
          <h2 className="text-label-md text-[var(--on-surface-variant)] uppercase tracking-wider mb-3">Add Methods</h2>
          <div className="grid grid-cols-2 gap-3">
            {addMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setActiveMethod(method.id)}
                className="flex flex-col items-center gap-2 p-4 bg-[var(--surface-container-lowest)] rounded-xl hover:bg-[var(--surface-container)] transition-colors"
              >
                <div className={`w-12 h-12 ${method.color} rounded-xl flex items-center justify-center`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={method.icon} />
                  </svg>
                </div>
                <span className="text-label-sm text-[var(--on-surface)] text-center">{method.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchQuery && (
        <div className="flex-1 px-4">
          <h2 className="text-label-md text-[var(--on-surface-variant)] uppercase tracking-wider mb-3">Search Results</h2>
          {results.length > 0 ? (
            <div className="space-y-2">
              {results.map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-3 bg-[var(--surface-container-lowest)] rounded-xl">
                  <div className="w-12 h-12 bg-[var(--primary)] rounded-full flex items-center justify-center text-[var(--on-primary)] font-semibold">
                    {user.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-body-md font-semibold text-[var(--on-surface)]">{user.name}</h3>
                    <p className="text-label-sm text-[var(--on-surface-variant)]">{user.username}</p>
                  </div>
                  {user.status === 'friend' ? (
                    <span className="px-3 py-1.5 bg-[var(--surface-container)] text-[var(--on-surface-variant)] rounded-full text-label-sm">Added</span>
                  ) : user.status === 'pending' ? (
                    <span className="px-3 py-1.5 bg-[var(--surface-container)] text-[var(--on-surface-variant)] rounded-full text-label-sm">Pending</span>
                  ) : (
                    <button
                      onClick={() => handleAdd(user.id)}
                      className="px-4 py-1.5 bg-[var(--secondary)] text-[var(--on-secondary)] rounded-full text-label-sm font-medium hover:bg-[var(--secondary)]/90 transition-colors"
                    >
                      Add
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <svg className="w-16 h-16 text-[var(--outline-variant)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-body-md text-[var(--on-surface-variant)]">No users found</p>
            </div>
          )}
        </div>
      )}

      {/* My QR Code Section */}
      {!searchQuery && (
        <div className="px-4 py-4 mt-auto">
          <div className="p-4 bg-[var(--surface-container-low)] rounded-xl flex items-center gap-4">
            <div className="w-16 h-16 bg-[var(--primary)] rounded-xl flex items-center justify-center text-[var(--on-primary)] text-xl font-bold">
              JD
            </div>
            <div className="flex-1">
              <h3 className="text-body-md font-semibold text-[var(--on-surface)]">John Doe</h3>
              <p className="text-label-sm text-[var(--on-surface-variant)]">@john.doe</p>
            </div>
            <button className="p-2 hover:bg-[var(--surface-container)] rounded-full transition-colors">
              <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Component = AddContactPage;
export default Component;
