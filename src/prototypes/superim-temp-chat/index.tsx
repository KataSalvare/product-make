/**
 * @name TempChat Page
 * @description Temporary chat room with 1-hour self-destruct timer, friend-add conversion and message actions
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
  replyTo?: {
    id: string;
    text: string;
    sender: string;
  };
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

type MessageAction = 'reply' | 'copy' | 'forward' | 'select' | 'delete';

interface MessageMenuItem {
  action: MessageAction;
  label: string;
  icon: string;
  danger?: boolean;
}

const getMessageMenuItems = (): MessageMenuItem[] => [
  { action: 'reply', label: 'Reply', icon: 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6' },
  { action: 'copy', label: 'Copy', icon: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' },
  { action: 'forward', label: 'Forward', icon: 'M13 5l7 7-7 7M5 5l7 7-7 7' },
  { action: 'select', label: 'Select', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { action: 'delete', label: 'Delete', icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16', danger: true },
];

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
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showMessageMenu, setShowMessageMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [toast, setToast] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteForEveryone, setDeleteForEveryone] = useState(false);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMenuRef = useRef<HTMLDivElement>(null);
  const messageMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
    '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
    '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
    '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳',
    '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️',
    '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤',
    '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱',
    '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
    '👍', '👎', '👏', '🙌', '🤝', '✌️', '🤞', '🤟',
    '🔥', '⭐', '✨', '💫', '💥', '💯', '💢', '💬',
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatMenuRef.current && !chatMenuRef.current.contains(event.target as Node)) {
        setShowChatMenu(false);
      }
      if (messageMenuRef.current && !messageMenuRef.current.contains(event.target as Node)) {
        setShowMessageMenu(false);
        setSelectedMessage(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Recording timer
  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

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

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEmojiClick = (emoji: string) => {
    setInputText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileSelect = (type: 'image' | 'file' | 'camera') => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' ? 'image/*' : type === 'camera' ? 'image/*' : '*';
      fileInputRef.current.click();
    }
    setShowAttachMenu(false);
  };

  const handleVoiceRecord = () => {
    if (isRecording) {
      const duration = recordingTime;
      setIsRecording(false);
      setRecordingTime(0);
      const newMessage: Message = {
        id: Date.now().toString(),
        text: `🎤 Voice message (${formatRecordingTime(duration)})`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSent: true,
        isRead: false,
        sender: 'You',
        senderAvatar: 'ME',
      };
      setMessages([...messages, newMessage]);
    } else {
      setRecordingTime(0);
      setIsRecording(true);
    }
  };

  const toggleMessageSelection = (messageId: string) => {
    setSelectedMessageIds(prev =>
      prev.includes(messageId) ? prev.filter(id => id !== messageId) : [...prev, messageId]
    );
  };

  const exitMultiSelectMode = () => {
    setIsMultiSelectMode(false);
    setSelectedMessageIds([]);
  };

  const handleMultiForward = () => {
    if (selectedMessageIds.length === 0) return;
    exitMultiSelectMode();
    navigate('/forward-message');
  };

  const handleMultiDelete = () => {
    if (selectedMessageIds.length === 0) return;
    setShowDeleteConfirm(true);
  };

  const handleConfirmMultiDelete = () => {
    setMessages(prev => prev.filter(m => !selectedMessageIds.includes(m.id)));
    setShowDeleteConfirm(false);
    setDeleteForEveryone(false);
    exitMultiSelectMode();
  };

  const handleMessageLongPress = (message: Message, e: React.MouseEvent | React.TouchEvent) => {
    if (isMultiSelectMode || showExpiredOverlay) return;
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    // Calculate menu position to keep it on screen
    const menuWidth = 180;
    const menuHeight = 220;
    let x = clientX;
    let y = clientY;

    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 16;
    }
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 16;
    }

    setMenuPosition({ x, y });
    setSelectedMessage(message);
    setShowMessageMenu(true);
  };

  const handleMessageAction = (action: MessageAction) => {
    if (!selectedMessage) return;

    switch (action) {
      case 'reply':
        setReplyingTo(selectedMessage);
        break;
      case 'copy':
        navigator.clipboard.writeText(selectedMessage.text);
        setToast('Copied');
        window.setTimeout(() => setToast(null), 2000);
        break;
      case 'forward':
        navigate('/forward-message');
        break;
      case 'select':
        setIsMultiSelectMode(true);
        setSelectedMessageIds([selectedMessage.id]);
        break;
      case 'delete':
        setShowDeleteConfirm(true);
        setShowMessageMenu(false);
        return;
    }
    setShowMessageMenu(false);
    setSelectedMessage(null);
  };

  const handleConfirmDelete = () => {
    if (!selectedMessage) return;
    setMessages(prev => prev.filter(m => m.id !== selectedMessage.id));
    setShowDeleteConfirm(false);
    setDeleteForEveryone(false);
    setSelectedMessage(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteForEveryone(false);
    setSelectedMessage(null);
  };

  const cancelReply = () => {
    setReplyingTo(null);
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
      replyTo: replyingTo ? {
        id: replyingTo.id,
        text: replyingTo.text,
        sender: replyingTo.sender || 'Unknown',
      } : undefined,
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    setReplyingTo(null);
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
  const isDeleteMulti = isMultiSelectMode && selectedMessageIds.length > 0 && !selectedMessage;

  const renderCheckbox = (messageId: string) => (
    <button
      onClick={() => toggleMessageSelection(messageId)}
      className={`self-center w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
        selectedMessageIds.includes(messageId)
          ? 'bg-[var(--primary)] border-[var(--primary)]'
          : 'border-[var(--outline)]'
      }`}
    >
      {selectedMessageIds.includes(messageId) && (
        <svg className="w-4 h-4 text-[var(--on-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  );

  return (
    <div className="h-full bg-[var(--surface-container-low)] flex flex-col">
      {/* Header */}
      <header className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] px-4 py-3 z-20">
        {isMultiSelectMode ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={exitMultiSelectMode}
                className="p-2 -ml-2 hover:bg-[var(--surface-container)] rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h1 className="text-body-lg font-semibold text-[var(--on-surface)]">{selectedMessageIds.length} Selected</h1>
            </div>
            <button
              onClick={handleMultiDelete}
              disabled={selectedMessageIds.length === 0}
              className={`p-2 rounded-full transition-colors ${selectedMessageIds.length > 0 ? 'text-[var(--error)] hover:bg-[var(--error-container)]' : 'text-[var(--outline)]'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ) : (
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
        )}
      </header>

      {/* Countdown Banner */}
      {!isConverted && !showExpiredOverlay && !isMultiSelectMode && (
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
      {isConverted && !isMultiSelectMode && (
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
          <div key={message.id}>
            {message.isSent ? (
              <div className="flex gap-2">
                {isMultiSelectMode && renderCheckbox(message.id)}
                <div className="flex-1 flex justify-end">
                  <div className="max-w-[70%]">
                    {/* Reply Preview */}
                    {message.replyTo && (
                      <div className="mb-1 px-3 py-1.5 bg-[var(--surface-container-lowest)] rounded-t-xl border-l-2 border-[var(--primary)]/30">
                        <p className="text-label-xs text-[var(--on-surface-variant)]">{message.replyTo.sender}</p>
                        <p className="text-body-sm text-[var(--on-surface)]/80 line-clamp-1">{message.replyTo.text}</p>
                      </div>
                    )}
                    <div
                      className={`bg-[var(--surface-container-lowest)] text-[var(--on-surface)] px-4 py-2.5 cursor-pointer active:scale-[0.98] transition-transform ${message.replyTo ? 'rounded-b-2xl rounded-tl-2xl rounded-tr-sm' : 'rounded-2xl rounded-tr-sm'}`}
                      onContextMenu={(e) => handleMessageLongPress(message, e)}
                      onTouchStart={(e) => {
                        const timer = window.setTimeout(() => handleMessageLongPress(message, e), 600);
                        const clearTimer = () => {
                          clearTimeout(timer);
                          document.removeEventListener('touchend', clearTimer);
                        };
                        document.addEventListener('touchend', clearTimer);
                      }}
                      onClick={() => isMultiSelectMode && toggleMessageSelection(message.id)}
                    >
                      <p className="text-body-md">{message.text}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-1 justify-end">
                      <span className="text-label-xs text-[var(--on-surface-variant)]">{message.timestamp}</span>
                      <svg className={`w-4 h-4 ${message.isRead ? 'text-[var(--secondary)]' : 'text-[var(--outline)]'}`} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        <path d="M5 16.17L1.83 13l-1.42 1.41L5 20l12-12-1.41-1.41z" opacity="0.5" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                {isMultiSelectMode && renderCheckbox(message.id)}
                <div className="max-w-[70%]">
                  {/* Reply Preview */}
                  {message.replyTo && (
                    <div className="mb-1 px-3 py-1.5 bg-[var(--surface-container-lowest)] rounded-t-xl border-l-2 border-[var(--outline)]">
                      <p className="text-label-xs text-[var(--on-surface-variant)]">{message.replyTo.sender}</p>
                      <p className="text-body-sm text-[var(--on-surface)]/80 line-clamp-1">{message.replyTo.text}</p>
                    </div>
                  )}
                  <div
                    className={`bg-[var(--surface-container-lowest)] text-[var(--on-surface)] px-4 py-2.5 cursor-pointer active:scale-[0.98] transition-transform ${message.replyTo ? 'rounded-b-2xl rounded-tr-2xl rounded-tl-sm' : 'rounded-2xl rounded-tl-sm'}`}
                    onContextMenu={(e) => handleMessageLongPress(message, e)}
                    onTouchStart={(e) => {
                      const timer = window.setTimeout(() => handleMessageLongPress(message, e), 600);
                      const clearTimer = () => {
                        clearTimeout(timer);
                        document.removeEventListener('touchend', clearTimer);
                      };
                      document.addEventListener('touchend', clearTimer);
                    }}
                    onClick={() => isMultiSelectMode && toggleMessageSelection(message.id)}
                  >
                    <p className="text-body-md">{message.text}</p>
                  </div>
                  <span className="text-label-xs text-[var(--on-surface-variant)] mt-1 block">{message.timestamp}</span>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice Recording Bar */}
      {!isMultiSelectMode && isRecording && (
        <div className="bg-[var(--error-container)] border-t border-[var(--outline-variant)] px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[var(--error)] rounded-full animate-pulse" />
              <span className="text-body-md text-[var(--on-error-container)] font-medium">Recording...</span>
              <span className="text-body-md text-[var(--on-error-container)]">{formatRecordingTime(recordingTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setIsRecording(false); setRecordingTime(0); }}
                className="px-4 py-2 text-label-sm text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleVoiceRecord}
                className="px-4 py-2 bg-[var(--primary)] text-[var(--on-primary)] rounded-lg text-label-sm font-medium"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Preview Bar */}
      {!isMultiSelectMode && replyingTo && (
        <div className="bg-[var(--surface-container)] border-t border-[var(--outline-variant)] px-4 py-2">
          <div className="flex items-start gap-2">
            <div className="flex-1 border-l-2 border-[var(--secondary)] pl-3">
              <p className="text-label-xs text-[var(--secondary)]">{replyingTo.sender || 'Unknown'}</p>
              <p className="text-body-sm text-[var(--on-surface)] line-clamp-1">{replyingTo.text}</p>
            </div>
            <button
              onClick={cancelReply}
              className="p-1 hover:bg-[var(--surface-container-high)] rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Input Bar */}
      {!isMultiSelectMode && !showExpiredOverlay && !isRecording && (
        <div className="bg-[var(--surface-container-low)] border-t border-[var(--outline-variant)] px-3 py-2.5">
          <div className="flex items-center gap-2">
            {/* Attachment */}
            <button
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className={`h-11 w-11 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${showAttachMenu ? 'bg-[var(--primary)] text-[var(--on-primary)]' : 'text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)]'}`}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.44 11.05-9.19 9.19a6.003 6.003 0 0 1-8.49-8.49l9.19-9.19a4.002 4.002 0 0 1 5.66 5.66l-9.2 9.19a2.001 2.001 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </button>

            {/* Input Field */}
            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message..."
                rows={1}
                className="w-full min-h-[44px] max-h-[120px] bg-[var(--surface-container-lowest)] text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/50 resize-none focus:outline-none rounded-2xl px-4 py-2.5 pr-10 text-body-md border border-[var(--outline-variant)] focus:border-[var(--primary)]/30 transition-colors"
              />
              {/* Emoji Button (inside input) */}
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`absolute right-2 top-1/2 -translate-y-1/2 transition-colors ${showEmojiPicker ? 'text-[var(--primary)]' : 'text-[var(--on-surface-variant)]/70 hover:text-[var(--on-surface-variant)]'}`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </button>
            </div>

            {/* Voice / Send */}
            {inputText.trim() ? (
              <button
                onClick={handleSend}
                className="h-11 w-11 rounded-full bg-[var(--primary)] text-[var(--on-primary)] flex items-center justify-center flex-shrink-0 hover:opacity-90 active:scale-95 transition-all shadow-ambient-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2.01z" />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => setIsRecording(true)}
                className="h-11 w-11 rounded-full text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] flex items-center justify-center flex-shrink-0 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                  <line x1="8" y1="22" x2="16" y2="22" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Emoji Picker */}
      {!isMultiSelectMode && showEmojiPicker && (
        <div className="bg-[var(--surface-container)] border-t border-[var(--outline-variant)] animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--outline-variant)]">
            <span className="text-label-sm text-[var(--on-surface-variant)]">Emoji</span>
            <button
              onClick={() => setShowEmojiPicker(false)}
              className="p-1 hover:bg-[var(--surface-container-high)] rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-3 max-h-48 overflow-y-auto">
            <div className="grid grid-cols-8 gap-2">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiClick(emoji)}
                  className="aspect-square flex items-center justify-center text-2xl hover:bg-[var(--surface-container-high)] rounded-lg transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Attach Menu */}
      {!isMultiSelectMode && showAttachMenu && (
        <div className="absolute inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowAttachMenu(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-[var(--surface-container-lowest)] rounded-t-3xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--outline-variant)]">
              <h3 className="text-body-lg font-semibold text-[var(--on-surface)]">Attachments</h3>
              <button
                onClick={() => setShowAttachMenu(false)}
                className="p-2 hover:bg-[var(--surface-container)] rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4 p-6">
              <button onClick={() => handleFileSelect('camera')} className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-[var(--surface-container-low)] transition-colors">
                <div className="w-14 h-14 bg-[var(--primary-container)] rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-[var(--on-primary-container)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-label-sm text-[var(--on-surface)]">Camera</span>
              </button>
              <button onClick={() => handleFileSelect('image')} className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-[var(--surface-container-low)] transition-colors">
                <div className="w-14 h-14 bg-[var(--secondary-container)] rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-[var(--on-secondary-container)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-label-sm text-[var(--on-surface)]">Gallery</span>
              </button>
              <button onClick={() => handleFileSelect('file')} className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-[var(--surface-container-low)] transition-colors">
                <div className="w-14 h-14 bg-[var(--tertiary-container)] rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-[var(--on-tertiary-container)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-label-sm text-[var(--on-surface)]">File</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            const newMessage: Message = {
              id: Date.now().toString(),
              text: `📎 ${e.target.files[0].name}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isSent: true,
              isRead: false,
              sender: 'You',
              senderAvatar: 'ME',
            };
            setMessages([...messages, newMessage]);
          }
        }}
      />

      {/* Multi-select Bottom Action Bar */}
      {isMultiSelectMode && (
        <div className="bg-[var(--surface-container-low)] border-t border-[var(--outline-variant)] px-4 py-3">
          <button
            onClick={handleMultiForward}
            disabled={selectedMessageIds.length === 0}
            className={`w-full py-3 rounded-xl text-body-md font-semibold transition-colors ${
              selectedMessageIds.length > 0
                ? 'bg-[var(--primary)] text-[var(--on-primary)] hover:opacity-90 active:scale-[0.98]'
                : 'bg-[var(--surface-container)] text-[var(--outline)] cursor-not-allowed'
            }`}
          >
            Forward {selectedMessageIds.length > 0 && `(${selectedMessageIds.length})`}
          </button>
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

      {/* Message Action Menu */}
      {showMessageMenu && selectedMessage && (
        <div
          ref={messageMenuRef}
          className="fixed bg-[var(--surface-container-low)] rounded-xl shadow-ambient-lg py-2 z-50 min-w-[160px]"
          style={{ left: menuPosition.x, top: menuPosition.y }}
        >
          {getMessageMenuItems().map((item: MessageMenuItem) => (
            <button
              key={item.action}
              onClick={() => handleMessageAction(item.action)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--surface-container)] transition-colors ${item.danger ? 'text-[var(--error)]' : 'text-[var(--on-surface)]'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
              </svg>
              <span className="text-body-sm">{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl w-full max-w-[320px] p-6">
            <h3 className="text-title-md font-semibold text-[var(--on-surface)] mb-2">
              {isDeleteMulti ? `Delete ${selectedMessageIds.length} Messages` : 'Delete Message'}
            </h3>
            <p className="text-body-md text-[var(--on-surface-variant)] mb-4">
              {isDeleteMulti
                ? 'Are you sure you want to delete these messages?'
                : 'Are you sure you want to delete this message?'}
            </p>

            {/* Delete for everyone option - only for sent messages */}
            {((selectedMessage && selectedMessage.isSent) || isDeleteMulti) && (
              <label className="flex items-center gap-3 mb-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deleteForEveryone}
                  onChange={(e) => setDeleteForEveryone(e.target.checked)}
                  className="w-5 h-5 rounded border-[var(--outline)] text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <span className="text-body-sm text-[var(--on-surface)]">Delete for everyone</span>
              </label>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--surface-container)] text-[var(--on-surface)] text-label-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={isDeleteMulti ? handleConfirmMultiDelete : handleConfirmDelete}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--error)] text-[var(--on-error)] text-label-lg font-medium hover:opacity-90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-lg bg-[var(--inverse-surface)] text-[var(--inverse-on-surface)] text-body-sm font-medium shadow-ambient-lg pointer-events-auto">
          {toast}
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
