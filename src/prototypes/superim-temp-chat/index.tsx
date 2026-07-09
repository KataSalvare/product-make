/**
 * @name TempChat Page
 * @description Temporary chat room with 1-hour self-destruct timer and friend-add conversion
 * @mode axure
 */

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../themes/equatorial-minimalism/globals.css';
import './style.css';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isSent: boolean;
  isRead: boolean;
  sender?: string;
  senderAvatar?: string;
}

interface ContactInfo {
  name: string;
  initials: string;
}

const mockContacts: Record<string, ContactInfo> = {
  '101': { name: 'Unknown User', initials: 'UU' },
  '7': { name: 'Amina Ibrahim', initials: 'AI' },
  '12': { name: 'Emeka Okonkwo', initials: 'EO' },
};

const mockMessages: Message[] = [
  { id: '1', text: 'Hi! I saw your post about the event.', timestamp: '10:30 AM', isSent: false, isRead: true, sender: 'Stranger', senderAvatar: 'ST' },
  { id: '2', text: 'Yes, are you interested in joining?', timestamp: '10:32 AM', isSent: true, isRead: true, sender: 'You', senderAvatar: 'ME' },
];

const ONE_HOUR = 3600;
const WARNING_THRESHOLD = 300;

const TempChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const contact = mockContacts[userId || ''] || mockContacts['101'];
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputText, setInputText] = useState('');
  const [remaining, setRemaining] = useState(ONE_HOUR);
  const [isConverted, setIsConverted] = useState(false);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [showConvertedToast, setShowConvertedToast] = useState(false);
  const [showExpiredOverlay, setShowExpiredOverlay] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showDeleteChatConfirm, setShowDeleteChatConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatMenuRef.current && !chatMenuRef.current.contains(event.target as Node)) {
        setShowChatMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isConverted || showExpiredOverlay) return;
    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowExpiredOverlay(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isConverted, showExpiredOverlay]);

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSend = () => {
    if (!inputText.trim() || showExpiredOverlay) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSent: true,
      isRead: false,
      sender: 'You',
      senderAvatar: 'ME',
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleConvertToOfficial = () => {
    setIsConverted(true);
    setShowAddFriendModal(false);
    setShowConvertedToast(true);
    setTimeout(() => setShowConvertedToast(false), 3000);
  };

  const isWarning = remaining <= WARNING_THRESHOLD && !isConverted;

  return (
    <div className="h-full bg-[var(--surface-container-low)] flex flex-col">
      {/* Header */}
      <header className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] px-4 py-3 z-20">
        <div className="flex items-center gap-3">
          <button className="p-2 -ml-2 hover:bg-[var(--surface-container)] rounded-full transition-colors">
            <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => navigate(`/user-profile?isContact=false&name=${encodeURIComponent(contact.name)}`)}
            className="w-10 h-10 bg-[var(--primary-container)] rounded-full flex items-center justify-center text-[var(--on-primary-container)] font-semibold hover:opacity-90 transition-opacity"
          >
            {contact.initials}
          </button>
          <div className="flex-1 min-w-0">
            <button
              onClick={() => navigate(`/user-profile?isContact=false&name=${encodeURIComponent(contact.name)}`)}
              className="text-left"
            >
              <h1 className="text-body-lg font-semibold text-[var(--on-surface)] truncate">{contact.name}</h1>
            </button>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded text-label-xs bg-[var(--secondary-container)] text-[var(--on-secondary-container)]">
                Temp Chat
              </span>
            </div>
          </div>

          {/* Chat Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowChatMenu(!showChatMenu)}
              className="p-2 hover:bg-[var(--surface-container)] rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>

            {/* Chat Menu Dropdown */}
            {showChatMenu && (
              <div
                ref={chatMenuRef}
                className="absolute right-0 top-full mt-2 w-56 bg-[var(--surface-container-low)] rounded-xl shadow-ambient-lg py-2 z-50"
              >
                <button
                  onClick={() => { setShowAddFriendModal(true); setShowChatMenu(false); }}
                  disabled={isConverted || showExpiredOverlay}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span className="text-body-sm">Add Friend</span>
                </button>

                <div className="h-px bg-[var(--outline-variant)] mx-4 my-1" />

                <button
                  onClick={() => { setShowClearConfirm(true); setShowChatMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface)]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-body-sm">Clear History</span>
                </button>

                <div className="h-px bg-[var(--outline-variant)] mx-4 my-1" />

                <button
                  onClick={() => { setShowDeleteChatConfirm(true); setShowChatMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container)] transition-colors text-[var(--error)]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="text-body-sm">Delete Chat</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Countdown Banner */}
      {!isConverted && !showExpiredOverlay && (
        <div className={`px-4 py-2 flex items-center justify-between ${isWarning ? 'bg-[var(--error)] text-[var(--on-error)]' : 'bg-[var(--secondary-container)] text-[var(--on-secondary-container)]'}`}>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-body-sm font-medium">
              {isWarning ? 'Temp chat will expire soon' : `Auto-destructs in ${formatCountdown(remaining)}`}
            </span>
          </div>
          <button
            onClick={() => setShowAddFriendModal(true)}
            disabled={isConverted || showExpiredOverlay}
            className="px-3 py-1 bg-[var(--on-secondary)] text-[var(--secondary)] rounded-full text-label-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            Add Friend
          </button>
        </div>
      )}

      {/* Converted Banner */}
      {isConverted && (
        <div className="px-4 py-2 bg-[var(--primary-container)] text-[var(--on-primary-container)] flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-body-sm font-medium">Converted to official chat. History preserved</span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={message.isSent ? 'flex justify-end' : 'flex justify-start'}>
            <div className="max-w-[75%]">
              <div className={`px-4 py-2.5 rounded-2xl ${message.isSent ? 'bg-[var(--surface-container-lowest)] text-[var(--on-surface)] rounded-tr-sm' : 'bg-[var(--surface-container-lowest)] text-[var(--on-surface)] rounded-tl-sm'}`}>
                <p className="text-body-md">{message.text}</p>
              </div>
              <div className={`flex items-center gap-1 mt-1 ${message.isSent ? 'justify-end' : 'justify-start'}`}>
                <span className="text-label-xs text-[var(--on-surface-variant)]">{message.timestamp}</span>
                {message.isSent && (
                  <svg className={`w-4 h-4 ${message.isRead ? 'text-[var(--secondary)]' : 'text-[var(--outline)]'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    <path d="M5 16.17L1.83 13l-1.42 1.41L5 20l12-12-1.41-1.41z" opacity="0.5" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      {!showExpiredOverlay && (
        <div className="bg-[var(--surface-container)] border-t border-[var(--outline-variant)] px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message..."
                rows={1}
                className="w-full bg-[var(--surface-container-lowest)] text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/50 resize-none focus:outline-none rounded-2xl px-4 py-2.5 pr-10 text-body-md border border-[var(--outline-variant)] focus:border-[var(--primary)]/30 transition-colors"
                style={{ minHeight: '40px', maxHeight: '100px' }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="p-2 text-[var(--primary)] disabled:text-[var(--on-surface-variant)]/40 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Clear History Confirmation Modal */}
      {showClearConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl w-full max-w-[320px] p-6">
            <h3 className="text-title-md font-semibold text-[var(--on-surface)] mb-2">Clear History</h3>
            <p className="text-body-md text-[var(--on-surface-variant)] mb-6">
              Are you sure you want to clear all messages in this chat? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--surface-container)] text-[var(--on-surface)] text-label-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { setMessages([]); setShowClearConfirm(false); }}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--error)] text-[var(--on-error)] text-label-lg font-medium hover:opacity-90 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Chat Confirmation Modal */}
      {showDeleteChatConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl w-full max-w-[320px] p-6">
            <h3 className="text-title-md font-semibold text-[var(--on-surface)] mb-2">Delete Chat</h3>
            <p className="text-body-md text-[var(--on-surface-variant)] mb-6">
              Are you sure you want to delete this chat? All messages will be removed and the chat will disappear from your list.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteChatConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--surface-container)] text-[var(--on-surface)] text-label-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowDeleteChatConfirm(false); }}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--error)] text-[var(--on-error)] text-label-lg font-medium hover:opacity-90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Friend Confirmation Modal */}
      {showAddFriendModal && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl w-full max-w-[320px] p-6">
            <h3 className="text-title-md font-semibold text-[var(--on-surface)] mb-2">Add Friend</h3>
            <p className="text-body-md text-[var(--on-surface-variant)] mb-6">
              Adding {contact.name} as a friend will convert this temp chat to an official chat and preserve history.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddFriendModal(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--surface-container)] text-[var(--on-surface)] text-label-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConvertToOfficial}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--secondary)] text-[var(--on-secondary)] text-label-lg font-medium hover:opacity-90 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Converted Toast */}
      {showConvertedToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--on-primary)] rounded-full shadow-ambient-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-body-sm font-medium">Converted to official chat</span>
          </div>
        </div>
      )}

      {/* Expired Overlay */}
      {showExpiredOverlay && (
        <div className="absolute inset-0 bg-[var(--surface)]/95 flex flex-col items-center justify-center z-50 px-6">
          <div className="w-20 h-20 bg-[var(--surface-container-low)] rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-[var(--error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-title-lg font-semibold text-[var(--on-surface)] mb-2">Temp Chat Expired</h3>
          <p className="text-body-md text-[var(--on-surface-variant)] text-center mb-6">
            This temp chat has expired. Messages are no longer visible. Add friend to continue chatting.
          </p>
          <button
            onClick={() => setShowAddFriendModal(true)}
            className="px-6 py-3 bg-[var(--secondary)] text-[var(--on-secondary)] rounded-xl text-label-lg font-medium hover:opacity-90 transition-colors"
          >
            Add Friend
          </button>
        </div>
      )}
    </div>
  );
};

const Component = TempChatPage;
export default Component;
