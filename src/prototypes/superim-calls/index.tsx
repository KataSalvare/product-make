/**
 * @name Calls History
 * @description Call log with voice and video call history
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState } from 'react';
import '../../themes/equatorial-minimalism/globals.css';
import './style.css';

interface CallLog {
  id: string;
  name: string;
  avatar: string;
  type: 'incoming' | 'outgoing' | 'missed';
  callType: 'voice' | 'video';
  timestamp: string;
  duration?: string;
}

const mockCalls: CallLog[] = [
  { id: '1', name: 'Amara Okafor', avatar: '', type: 'missed', callType: 'video', timestamp: '10:42 AM' },
  { id: '2', name: 'Kwame Asante', avatar: '', type: 'incoming', callType: 'voice', timestamp: '9:30 AM', duration: '5:23' },
  { id: '3', name: 'Chioma Nnamdi', avatar: '', type: 'outgoing', callType: 'video', timestamp: 'Yesterday', duration: '12:45' },
  { id: '4', name: 'Oluwaseun Adeyemi', avatar: '', type: 'incoming', callType: 'voice', timestamp: 'Yesterday', duration: '2:15' },
  { id: '5', name: 'Fatima Hassan', avatar: '', type: 'missed', callType: 'voice', timestamp: 'Monday' },
  { id: '6', name: 'Design Team', avatar: '', type: 'outgoing', callType: 'video', timestamp: 'Monday', duration: '45:30' },
];

const CallsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('calls');
  const [filter, setFilter] = useState<'all' | 'missed'>('all');
  const [calls] = useState(mockCalls);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const filteredCalls = filter === 'missed' ? calls.filter(c => c.type === 'missed') : calls;

  const getCallIcon = (type: string, callType: string) => {
    const color = type === 'missed' ? 'text-[var(--error)]' : 'text-[var(--secondary)]';
    if (callType === 'video') {
      return (
        <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    }
    return (
      <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    );
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
          <h1 className="text-headline-md text-[var(--primary)]">Calls</h1>
          <button className="p-2 hover:bg-[var(--surface-container)] rounded-full transition-colors">
            <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="flex gap-2 px-4 py-3 bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)]">
        {(['all', 'missed'] as const).map((f) => (
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

      {/* Call Log */}
      <div className="flex-1 overflow-y-auto">
        {filteredCalls.map((call) => (
          <div
            key={call.id}
            className="flex items-center gap-3 px-4 py-3 bg-[var(--surface-container-lowest)] border-b border-[var(--outline-variant)]/50 hover:bg-[var(--surface-container-low)] transition-colors cursor-pointer"
          >
            {/* Avatar */}
            <div className="w-12 h-12 bg-[var(--primary-container)] rounded-full flex items-center justify-center text-[var(--on-primary-container)] font-semibold">
              {getInitials(call.name)}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h3 className={`font-semibold ${call.type === 'missed' ? 'text-[var(--error)]' : 'text-[var(--on-surface)]'}`}>
                {call.name}
              </h3>
              <div className="flex items-center gap-2">
                {getCallIcon(call.type, call.callType)}
                <span className="text-label-sm text-[var(--on-surface-variant)]">
                  {call.type === 'incoming' ? 'Incoming' : call.type === 'outgoing' ? 'Outgoing' : 'Missed'} · {call.timestamp}
                </span>
                {call.duration && (
                  <span className="text-label-sm text-[var(--on-surface-variant)]">({call.duration})</span>
                )}
              </div>
            </div>

            {/* Call Button */}
            <button className="p-2 hover:bg-[var(--surface-container)] rounded-full transition-colors">
              <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <button className="absolute bottom-24 right-4 w-14 h-14 bg-[var(--secondary)] text-[var(--on-secondary)] rounded-full shadow-ambient-lg flex items-center justify-center hover:bg-[var(--secondary-container)] transition-colors z-10">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
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

const Component = CallsPage;
export default Component;
