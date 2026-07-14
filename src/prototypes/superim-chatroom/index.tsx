/**
 * @name ChatRoom Page
 * @description Individual chat conversation with message history and message actions
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  isPinned?: boolean;
  replyTo?: {
    id: string;
    text: string;
    sender: string;
  };
}

interface Contact {
  name: string;
  isOnline: boolean;
  lastSeen?: string;
}

const mockContact: Contact = {
  name: 'Amara Okafor',
  isOnline: true,
};

const mockMessages: Message[] = [
  { id: '1', text: 'Hey! How are you doing?', timestamp: '10:30 AM', isSent: false, isRead: true, sender: 'Amara', senderAvatar: 'AO' },
  { id: '2', text: 'I\'m doing great! Just finished the project.', timestamp: '10:32 AM', isSent: true, isRead: true, sender: 'You', senderAvatar: 'ME' },
  { id: '3', text: 'That\'s awesome! Congratulations 🎉', timestamp: '10:33 AM', isSent: false, isRead: true, sender: 'Amara', senderAvatar: 'AO' },
  { id: '4', text: 'Thanks for the help with the project!', timestamp: '10:42 AM', isSent: false, isRead: false, sender: 'Amara', senderAvatar: 'AO' },
];

type MessageAction = 'reply' | 'copy' | 'forward' | 'pin' | 'select' | 'delete';

interface MessageMenuItem {
  action: MessageAction;
  label: string;
  icon: string;
  danger?: boolean;
}

const getMessageMenuItems = (isPinned: boolean): MessageMenuItem[] => [
  { action: 'reply', label: 'Reply', icon: 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6' },
  { action: 'copy', label: 'Copy', icon: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' },
  { action: 'forward', label: 'Forward', icon: 'M13 5l7 7-7 7M5 5l7 7-7 7' },
  { action: 'pin', label: isPinned ? 'Unpin' : 'Pin', icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z' },
  { action: 'select', label: 'Select', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { action: 'delete', label: 'Delete', icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16', danger: true },
];

interface ChatSettings {
  muteNotifications: boolean;
}

const Component: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showMessageMenu, setShowMessageMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteForEveryone, setDeleteForEveryone] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [chatSettings, setChatSettings] = useState<ChatSettings>({ muteNotifications: false });
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showDeleteChatConfirm, setShowDeleteChatConfirm] = useState(false);
  const [toast] = useState<string | null>(null);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const chatMenuRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Recording timer
  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMessageMenu(false);
        setSelectedMessage(null);
      }
      if (chatMenuRef.current && !chatMenuRef.current.contains(event.target as Node)) {
        setShowChatMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

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

    setMessages([...messages, newMessage]);
    setInputText('');
    setReplyingTo(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
      // Stop recording and send voice message
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
    if (isMultiSelectMode) return;
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // Calculate menu position to keep it on screen
    const menuWidth = 180;
    const menuHeight = 260;
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
        break;
      case 'forward':
        // Navigate to forward message page or show forward dialog
        navigate('/forward-message');
        break;
      case 'pin':
        setMessages(prev => prev.map(m => 
          m.id === selectedMessage.id ? { ...m, isPinned: !m.isPinned } : m
        ));
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

  const isDeleteMulti = isMultiSelectMode && selectedMessageIds.length > 0 && !selectedMessage;

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
              onClick={() => navigate('/user-profile?isContact=true')}
              className="w-10 h-10 bg-[var(--primary-container)] rounded-full flex items-center justify-center text-[var(--on-primary-container)] font-semibold hover:opacity-90 transition-opacity"
            >
              AO
            </button>

            <div className="flex-1">
              <button
                onClick={() => navigate('/user-profile?isContact=true')}
                className="text-left"
              >
                <h1 className="text-body-lg font-semibold text-[var(--on-surface)]">{mockContact.name}</h1>
              </button>
              <p className="text-label-sm text-[var(--secondary)]">
                {mockContact.isOnline ? 'Online' : mockContact.lastSeen || 'Offline'}
              </p>
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
                  {/* Voice Call */}
                  <button
                    onClick={() => {
                      console.log('Start voice call');
                      setShowChatMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface)]"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-body-sm">Voice Call</span>
                  </button>

                  {/* Video Call */}
                  <button
                    onClick={() => {
                      console.log('Start video call');
                      setShowChatMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface)]"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-body-sm">Video Call</span>
                  </button>

                  <div className="h-px bg-[var(--outline-variant)] mx-4 my-1" />

                  {/* Mute Notifications */}
                  <button
                    onClick={() => {
                      setChatSettings(prev => ({ ...prev, muteNotifications: !prev.muteNotifications }));
                      setShowChatMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface)]"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {chatSettings.muteNotifications ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      )}
                    </svg>
                    <span className="text-body-sm">{chatSettings.muteNotifications ? 'Unmute Notifications' : 'Mute Notifications'}</span>
                  </button>

                  <div className="h-px bg-[var(--outline-variant)] mx-4 my-1" />

                  {/* Clear History */}
                  <button
                    onClick={() => {
                      setShowClearConfirm(true);
                      setShowChatMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface)]"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-body-sm">Clear History</span>
                  </button>

                  <div className="h-px bg-[var(--outline-variant)] mx-4 my-1" />

                  {/* Delete Chat */}
                  <button
                    onClick={() => {
                      setShowDeleteChatConfirm(true);
                      setShowChatMenu(false);
                    }}
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

      {/* Pinned Messages */}
      {!isMultiSelectMode && messages.some(m => m.isPinned) && (
        <div className="mx-4 mt-3 p-3 bg-[var(--secondary-container)] rounded-xl">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-[var(--secondary)] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
            </svg>
            <div className="flex-1">
              <p className="text-label-xs text-[var(--secondary)] mb-1">Pinned Message</p>
              {messages.filter(m => m.isPinned).map(m => (
                <p key={m.id} className="text-body-sm text-[var(--on-secondary-container)] line-clamp-2">{m.text}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Date Separator */}
        <div className="flex items-center justify-center">
          <span className="px-3 py-1 bg-[var(--surface-container)] rounded-full text-label-sm text-[var(--on-surface-variant)]">
            Today
          </span>
        </div>

        {messages.map((message) => (
          <div key={message.id}>
            {message.isSent ? (
              <div className="flex gap-2">
                {isMultiSelectMode && (
                  <button
                    onClick={() => toggleMessageSelection(message.id)}
                    className={`self-center w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      selectedMessageIds.includes(message.id)
                        ? 'bg-[var(--primary)] border-[var(--primary)]'
                        : 'border-[var(--outline)]'
                    }`}
                  >
                    {selectedMessageIds.includes(message.id) && (
                      <svg className="w-4 h-4 text-[var(--on-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                )}
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
                      const timer = setTimeout(() => handleMessageLongPress(message, e), 500);
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
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      <path d="M5 16.17L1.83 13l-1.42 1.41L5 20l12-12-1.41-1.41z" opacity="0.5"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            ) : (
              <div className="flex gap-2">
                {isMultiSelectMode && (
                  <button
                    onClick={() => toggleMessageSelection(message.id)}
                    className={`self-center w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      selectedMessageIds.includes(message.id)
                        ? 'bg-[var(--primary)] border-[var(--primary)]'
                        : 'border-[var(--outline)]'
                    }`}
                  >
                    {selectedMessageIds.includes(message.id) && (
                      <svg className="w-4 h-4 text-[var(--on-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                )}
                <div className="max-w-[70%]">
                  {/* Reply Preview */}
                    {message.replyTo && (
                      <div className="mb-1 px-3 py-1.5 bg-[var(--surface-container-lowest)] rounded-t-xl border-l-2 border-[var(--outline)]">
                        <p className="text-label-xs text-[var(--on-surface-variant)]">{message.replyTo.sender}</p>
                        <p className="text-body-sm text-[var(--on-surface)]/80 line-clamp-1">{message.replyTo.text}</p>
                      </div>
                    )}
                    <div 
                      className={`bg-[var(--surface-container-lowest)] text-[var(--on-surface)] px-4 py-2.5 cursor-pointer active:scale-[0.98] transition-transform ${message.replyTo ? 'rounded-b-2xl rounded-tr-2xl rounded-tl-sm' : 'rounded-2xl rounded-tl-sm'} mt-0.5`}
                      onContextMenu={(e) => handleMessageLongPress(message, e)}
                      onTouchStart={(e) => {
                        const timer = setTimeout(() => handleMessageLongPress(message, e), 500);
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

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            const file = e.target.files[0];
            const newMessage: Message = {
              id: Date.now().toString(),
              text: `📎 ${file.name}`,
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
      {!isMultiSelectMode && !isRecording && (
        <div className="bg-[var(--surface-container-low)] border-t border-[var(--outline-variant)] px-3 py-2.5">
          {replyingTo && (
            <div className="flex items-center justify-between px-1 py-2 mb-2">
              <div className="flex-1 min-w-0 border-l-2 border-[var(--secondary)] pl-3">
                <p className="text-label-sm text-[var(--on-surface-variant)] line-clamp-1">{replyingTo.sender}: {replyingTo.text}</p>
              </div>
              <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-[var(--surface-container-high)] rounded-full ml-2">
                <svg className="w-4 h-4 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
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
                onKeyDown={handleKeyPress}
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

      {/* Message Action Menu */}
      {showMessageMenu && selectedMessage && (
        <div 
          ref={menuRef}
          className="fixed bg-[var(--surface-container-low)] rounded-xl shadow-ambient-lg py-2 z-50 min-w-[160px]"
          style={{ left: menuPosition.x, top: menuPosition.y }}
        >
          {getMessageMenuItems(selectedMessage.isPinned || false).map((item: MessageMenuItem) => (
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
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl mx-4 w-full max-w-[320px] p-6">
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

      {/* Clear History Confirmation Dialog */}
      {showClearConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl mx-4 w-full max-w-[320px] p-6">
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
                onClick={() => {
                  setMessages([]);
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--error)] text-[var(--on-error)] text-label-lg font-medium hover:opacity-90 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Chat Confirmation Dialog */}
      {showDeleteChatConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl mx-4 w-full max-w-[320px] p-6">
            <h3 className="text-title-md font-semibold text-[var(--on-surface)] mb-2">Delete Chat</h3>
            <p className="text-body-md text-[var(--on-surface-variant)] mb-6">
              Are you sure you want to delete this chat? All messages will be removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteChatConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--surface-container)] text-[var(--on-surface)] text-label-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setMessages([]);
                  setShowDeleteChatConfirm(false);
                  // Navigate back to chats list
                  console.log('Chat deleted, navigate back');
                }}
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

      {/* Attach Menu - WeChat Style Bottom Sheet */}
      {!isMultiSelectMode && showAttachMenu && (
        <div className="absolute inset-0 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowAttachMenu(false)}
          />
          {/* Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-[var(--surface-container-lowest)] rounded-t-3xl animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--outline-variant)]">
              <h3 className="text-title-md font-semibold text-[var(--on-surface)]">Share</h3>
              <button
                onClick={() => setShowAttachMenu(false)}
                className="p-2 -mr-2 hover:bg-[var(--surface-container)] rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Grid Menu */}
            <div className="grid grid-cols-4 gap-2 px-4 py-6">
              <button
                onClick={() => {
                  handleFileSelect('image');
                  setShowAttachMenu(false);
                }}
                className="flex flex-col items-center gap-2 py-2"
              >
                <div className="w-14 h-14 bg-[var(--surface-container)] rounded-2xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-label-xs text-[var(--on-surface)]">Photos</span>
              </button>

              <button
                onClick={() => {
                  handleFileSelect('camera');
                  setShowAttachMenu(false);
                }}
                className="flex flex-col items-center gap-2 py-2"
              >
                <div className="w-14 h-14 bg-[var(--surface-container)] rounded-2xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-label-xs text-[var(--on-surface)]">Camera</span>
              </button>

              <button
                onClick={() => {
                  handleFileSelect('file');
                  setShowAttachMenu(false);
                }}
                className="flex flex-col items-center gap-2 py-2"
              >
                <div className="w-14 h-14 bg-[var(--surface-container)] rounded-2xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-label-xs text-[var(--on-surface)]">Files</span>
              </button>

              <button
                onClick={() => setShowAttachMenu(false)}
                className="flex flex-col items-center gap-2 py-2"
              >
                <div className="w-14 h-14 bg-[var(--surface-container)] rounded-2xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-label-xs text-[var(--on-surface)]">Location</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Component;
