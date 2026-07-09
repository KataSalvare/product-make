import React from 'react';
import { Avatar } from '../components/Avatar';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

interface ChatUser {
  name: string;
  avatar?: string;
  status: 'online' | 'offline';
  lastSeen?: string;
}

const mockMessages: Message[] = [
  { id: '1', text: 'Hey! How are you doing?', sender: 'other', timestamp: '10:30 AM' },
  { id: '2', text: 'I\'m doing great! Just finished a meeting. How about you?', sender: 'me', timestamp: '10:32 AM', status: 'read' },
  { id: '3', text: 'Same here! Working on the new project. It\'s going well so far.', sender: 'other', timestamp: '10:33 AM' },
  { id: '4', text: 'That\'s awesome to hear! Let me know if you need any help.', sender: 'me', timestamp: '10:35 AM', status: 'read' },
  { id: '5', text: 'Thanks! I\'ll definitely reach out if I get stuck.', sender: 'other', timestamp: '10:36 AM' },
];

const chatUser: ChatUser = {
  name: 'Amara Okafor',
  status: 'online',
};

export const ChatTemplate: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Header */}
      <header className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-[var(--surface-container)] rounded-lg transition-colors">
            <svg className="w-5 h-5 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <Avatar name={chatUser.name} size="md" status={chatUser.status} />
          <div>
            <h2 className="font-semibold text-[var(--on-surface)]">{chatUser.name}</h2>
            <p className="text-sm text-[var(--secondary)]">
              {chatUser.status === 'online' ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-[var(--surface-container)] rounded-lg transition-colors">
            <svg className="w-5 h-5 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          <button className="p-2 hover:bg-[var(--surface-container)] rounded-lg transition-colors">
            <svg className="w-5 h-5 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button className="p-2 hover:bg-[var(--surface-container)] rounded-lg transition-colors">
            <svg className="w-5 h-5 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {mockMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                message.sender === 'me'
                  ? 'bg-[var(--primary)]/8 text-[var(--primary)] rounded-br-sm'
                  : 'bg-[var(--surface-container-lowest)] text-[var(--on-surface)] rounded-bl-sm shadow-ambient-sm'
              }`}
            >
              <p className="text-body-md">{message.text}</p>
              <div className={`flex items-center gap-1 mt-1 ${message.sender === 'me' ? 'justify-end' : ''}`}>
                <span className="text-label-sm text-[var(--on-surface-variant)]">
                  {message.timestamp}
                </span>
                {message.sender === 'me' && message.status && (
                  <svg className="w-4 h-4 text-[var(--secondary)]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-[var(--surface-container-low)] border-t border-[var(--outline-variant)] px-4 py-3">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-[var(--surface-container)] rounded-full transition-colors">
            <svg className="w-6 h-6 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <div className="flex-1 bg-[var(--surface-container-lowest)] rounded-full px-5 py-3 flex items-center gap-3">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-transparent text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/60 focus:outline-none"
            />
            <button className="p-1 hover:bg-[var(--surface-container)] rounded-full transition-colors">
              <svg className="w-5 h-5 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          <button className="p-3 bg-[var(--secondary)] text-[var(--on-secondary)] rounded-full hover:bg-[var(--secondary-container)] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
