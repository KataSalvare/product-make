/**
 * @name GroupChat Page
 * @description Group chat room with multiple users and message actions
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../themes/equatorial-minimalism/globals.css';
import './style.css';

type MessageType = 'text' | 'image' | 'location' | 'video';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: string;
  senderAvatar: string;
  isMe: boolean;
  isSystem?: boolean;
  isPinned?: boolean;
  type?: MessageType;
  mediaUrl?: string;
  location?: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  };
  replyTo?: {
    id: string;
    text: string;
    sender: string;
  };
}

interface GroupInfo {
  name: string;
  memberCount: number;
  announcement: string;
}

const mockGroup: GroupInfo = {
  name: 'Design Team',
  memberCount: 12,
  announcement: '🎉 Welcome to Design Team! Please share your ideas freely.',
};

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
}

const mockMembers: GroupMember[] = [
  { id: '1', name: 'Amara Okafor', avatar: 'AO', isOnline: true },
  { id: '2', name: 'Kwame Nkrumah', avatar: 'KN', isOnline: false },
  { id: '3', name: 'Zara Mensah', avatar: 'ZM', isOnline: true },
  { id: '4', name: 'Kofi Annan', avatar: 'KA', isOnline: false },
  { id: '5', name: 'Amina Jalloh', avatar: 'AJ', isOnline: true },
  { id: '6', name: 'Chioma Okafor', avatar: 'CO', isOnline: false },
  { id: '7', name: 'Emmanuel Nkrumah', avatar: 'EN', isOnline: true },
  { id: '8', name: 'Fatima Abdullahi', avatar: 'FA', isOnline: false },
];

const mockMessages: Message[] = [
  { id: '1', text: 'Hey team! How is everyone doing?', timestamp: '10:30 AM', sender: 'Amara', senderAvatar: 'AO', isMe: false },
  { id: '2', text: 'Great! Working on the new mockups.', timestamp: '10:32 AM', sender: 'You', senderAvatar: 'ME', isMe: true },
  { id: '3', text: 'Can\'t wait to see them!', timestamp: '10:33 AM', sender: 'Kwame', senderAvatar: 'KN', isMe: false },
  { id: '4', text: '🎉 John joined the group', timestamp: '10:35 AM', sender: 'System', senderAvatar: '', isMe: false, isSystem: true },
  { id: '5', text: '@You Check out this design I just finished!', timestamp: '10:36 AM', sender: 'Zara', senderAvatar: 'ZM', isMe: false },
  { id: '6', text: 'Wow, that looks amazing! Love the color palette.', timestamp: '10:37 AM', sender: 'You', senderAvatar: 'ME', isMe: true },
  { id: '7', text: 'Thanks! Here\'s the full mockup:', timestamp: '10:38 AM', sender: 'Zara', senderAvatar: 'ZM', isMe: false, type: 'image', mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop' },
  { id: '8', text: 'I\'m at the coffee shop nearby, come join me!', timestamp: '10:40 AM', sender: 'Amara', senderAvatar: 'AO', isMe: false, type: 'location', location: { name: 'Blue Bottle Coffee', address: '123 Market St, San Francisco', lat: 37.7749, lng: -122.4194 } },
  { id: '9', text: 'On my way! Sending you a quick video of the prototype:', timestamp: '10:42 AM', sender: 'You', senderAvatar: 'ME', isMe: true },
  { id: '10', text: '', timestamp: '10:42 AM', sender: 'You', senderAvatar: 'ME', isMe: true, type: 'video', mediaUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop' },
];

type MessageAction = 'reply' | 'copy' | 'forward' | 'pin' | 'favorite' | 'delete';

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
  { action: 'favorite', label: 'Favorite', icon: 'M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z' },
  { action: 'delete', label: 'Delete', icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16', danger: true },
];

interface GroupSettings {
  muteNotifications: boolean;
  autoDeleteTimer: number | null; // in hours, null means disabled
}

const autoDeleteOptions = [
  { value: null, label: 'Off' },
  { value: 24, label: '24 Hours' },
  { value: 168, label: '1 Week' },
  { value: 720, label: '1 Month' },
];

const GroupChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputText, setInputText] = useState('');
  const [showAnnouncement, setShowAnnouncement] = useState(true);
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
  const [groupSettings, setGroupSettings] = useState<GroupSettings>({ muteNotifications: false, autoDeleteTimer: null });
  const [showAutoDeleteMenu, setShowAutoDeleteMenu] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showMentionPopup, setShowMentionPopup] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const chatMenuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
        setShowAutoDeleteMenu(false);
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

  // Filter members for mention
  const filteredMentionMembers = useMemo(() => {
    if (!mentionQuery) return mockMembers;
    return mockMembers.filter(m =>
      m.name.toLowerCase().includes(mentionQuery.toLowerCase())
    );
  }, [mentionQuery]);

  // Handle input change for mention detection
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputText(value);

    // Check for @ mention
    const lastAtIndex = value.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const afterAt = value.slice(lastAtIndex + 1);
      // Only show popup if no space after @ and cursor is after @
      if (!afterAt.includes(' ') && document.activeElement === inputRef.current) {
        setMentionQuery(afterAt);
        setShowMentionPopup(true);
      } else {
        setShowMentionPopup(false);
      }
    } else {
      setShowMentionPopup(false);
    }
  };

  // Handle member selection for mention
  const handleMentionSelect = (member: GroupMember) => {
    const lastAtIndex = inputText.lastIndexOf('@');
    const beforeAt = inputText.slice(0, lastAtIndex);
    const afterQuery = inputText.slice(lastAtIndex + 1 + mentionQuery.length);
    const newText = `${beforeAt}@${member.name} ${afterQuery}`;
    setInputText(newText);
    setShowMentionPopup(false);
    setMentionQuery('');
    inputRef.current?.focus();
  };

  // Render message text with highlighted mentions (Telegram style)
  const renderMessageText = (text: string): React.ReactNode[] => {
    const mentionRegex = /@([^\s]+(?:\s+[^\s]+)*)/g;
    const parts: string[] = text.split(mentionRegex);
    const matches: string[] = text.match(mentionRegex) || [];

    return parts.map((part, index) => {
      const isMention = matches.includes(`@${part}`);
      if (isMention) {
        return (
          <span
            key={index}
            className="text-[var(--primary)] font-medium underline decoration-[var(--primary)]/40 underline-offset-2"
          >
            @{part}
          </span>
        );
      }
      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'You',
      senderAvatar: 'ME',
      isMe: true,
      replyTo: replyingTo ? {
        id: replyingTo.id,
        text: replyingTo.text,
        sender: replyingTo.sender,
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
      const duration = recordingTime;
      setIsRecording(false);
      setRecordingTime(0);
      const newMessage: Message = {
        id: Date.now().toString(),
        text: `🎤 Voice message (${formatRecordingTime(duration)})`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'You',
        senderAvatar: 'ME',
        isMe: true,
      };
      setMessages([...messages, newMessage]);
    } else {
      setRecordingTime(0);
      setIsRecording(true);
    }
  };

  const handleMessageLongPress = (message: Message, e: React.MouseEvent | React.TouchEvent) => {
    if (message.isSystem) return; // Don't show menu for system messages
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
        console.log('Forward message:', selectedMessage);
        break;
      case 'pin':
        setMessages(prev => prev.map(m => 
          m.id === selectedMessage.id ? { ...m, isPinned: !m.isPinned } : m
        ));
        break;
      case 'favorite':
        // Add message to favorites
        console.log('Add to favorites:', selectedMessage);
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

  const emojis = ['😀', '😂', '🥰', '😎', '🤔', '👍', '❤️', '🎉', '🔥', '👏', '😊', '😉', '🤗', '😴', '😭', '😡'];

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
          <div className="w-10 h-10 bg-[var(--secondary)] rounded-xl flex items-center justify-center text-[var(--on-secondary)] font-semibold">
            DT
          </div>
          <div className="flex-1">
            <h1 className="text-body-lg font-semibold text-[var(--on-surface)]">{mockGroup.name}</h1>
            <p className="text-label-sm text-[var(--on-surface-variant)]">{mockGroup.memberCount} members</p>
          </div>
          {/* Group Menu Button */}
          <div className="relative">
            <button 
              onClick={() => setShowChatMenu(!showChatMenu)}
              className="p-2 hover:bg-[var(--surface-container)] rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>

            {/* Group Menu Dropdown */}
            {showChatMenu && (
              <div 
                ref={chatMenuRef}
                className="absolute right-0 top-full mt-2 w-64 bg-[var(--surface-container-low)] rounded-xl shadow-ambient-lg py-2 z-50"
              >
                {/* Mute Notifications */}
                <button
                  onClick={() => {
                    setGroupSettings(prev => ({ ...prev, muteNotifications: !prev.muteNotifications }));
                    setShowChatMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface)]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {groupSettings.muteNotifications ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    )}
                  </svg>
                  <span className="text-body-sm">{groupSettings.muteNotifications ? 'Unmute Notifications' : 'Mute Notifications'}</span>
                </button>

                <div className="h-px bg-[var(--outline-variant)] mx-4 my-1" />

                {/* Auto Delete */}
                <button
                  onClick={() => {
                    setShowChatMenu(false);
                    setShowAutoDeleteMenu(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface)]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1 text-left">
                    <span className="text-body-sm block">Auto Delete</span>
                    <span className="text-label-xs text-[var(--on-surface-variant)]">
                      {autoDeleteOptions.find(opt => opt.value === groupSettings.autoDeleteTimer)?.label || 'Off'}
                    </span>
                  </div>
                  <svg className="w-4 h-4 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <div className="h-px bg-[var(--outline-variant)] mx-4 my-1" />

                {/* Group Info */}
                <button
                  onClick={() => {
                    setShowChatMenu(false);
                    console.log('Navigate to group settings');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface)]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-body-sm">Group Info</span>
                </button>

                <div className="h-px bg-[var(--outline-variant)] mx-4 my-1" />

                {/* Leave Group */}
                <button
                  onClick={() => {
                    setShowLeaveConfirm(true);
                    setShowChatMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container)] transition-colors text-[var(--error)]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="text-body-sm">Leave Group</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Pinned Messages */}
      {messages.some(m => m.isPinned) && (
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

      {/* Announcement */}
      {showAnnouncement && (
        <div className="mx-4 mt-3 p-3 bg-[var(--secondary-container)] rounded-xl flex items-start gap-2">
          <svg className="w-5 h-5 text-[var(--secondary)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          <p className="flex-1 text-body-sm text-[var(--on-secondary-container)]">{mockGroup.announcement}</p>
          <button onClick={() => setShowAnnouncement(false)} className="p-1 hover:bg-[var(--surface-container)] rounded-full">
            <svg className="w-4 h-4 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id}>
            {message.isSystem ? (
              <div className="flex justify-center">
                <span className="text-label-sm text-[var(--on-surface-variant)] bg-[var(--surface-container)] px-3 py-1 rounded-full">
                  {message.text}
                </span>
              </div>
            ) : message.isMe ? (
              <div className="flex justify-end gap-2">
                <div className="max-w-[70%]">
                  {/* Reply Preview */}
                  {message.replyTo && (
                    <div className="mb-1 px-3 py-1.5 bg-[var(--surface-container-lowest)] rounded-t-xl border-l-2 border-[var(--primary)]/30">
                      <p className="text-label-xs text-[var(--on-surface-variant)]">{message.replyTo.sender}</p>
                      <p className="text-body-sm text-[var(--on-surface)]/80 line-clamp-1">{message.replyTo.text}</p>
                    </div>
                  )}
                  <div
                    className={`bg-[var(--surface-container-lowest)] text-[var(--on-surface)] overflow-hidden cursor-pointer active:scale-[0.98] transition-transform ${message.replyTo ? 'rounded-b-2xl rounded-tl-2xl rounded-tr-sm' : 'rounded-2xl rounded-tr-sm'} ${message.type === 'image' || message.type === 'video' ? 'p-0' : 'px-4 py-2.5'}`}
                    onContextMenu={(e) => handleMessageLongPress(message, e)}
                    onTouchStart={(e) => {
                      const timer = setTimeout(() => handleMessageLongPress(message, e), 500);
                      const clearTimer = () => {
                        clearTimeout(timer);
                        document.removeEventListener('touchend', clearTimer);
                      };
                      document.addEventListener('touchend', clearTimer);
                    }}
                  >
                    {message.type === 'image' && message.mediaUrl ? (
                      <div className="relative">
                        <img src={message.mediaUrl} alt="Shared image" className="w-full max-w-[280px] h-auto rounded-lg" />
                        {message.text && <p className="px-3 py-2 text-body-md text-[var(--on-surface)]">{renderMessageText(message.text)}</p>}
                      </div>
                    ) : message.type === 'video' && message.mediaUrl ? (
                      <div className="relative">
                        <div className="relative w-full max-w-[280px] aspect-video bg-black rounded-lg overflow-hidden">
                          <img src={message.mediaUrl} alt="Video thumbnail" className="w-full h-full object-cover opacity-80" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-[var(--primary)] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 rounded text-label-xs text-white">
                            0:15
                          </div>
                        </div>
                        {message.text && <p className="px-3 py-2 text-body-md text-[var(--on-surface)]">{renderMessageText(message.text)}</p>}
                      </div>
                    ) : message.type === 'location' && message.location ? (
                      <div className="w-full max-w-[280px]">
                        {/* Location Card - Telegram Style */}
                        <div className="rounded-lg overflow-hidden">
                          {/* Map Preview Area */}
                          <div className="h-24 bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)]/20 relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <svg className="w-8 h-8 text-[var(--primary)]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                              </svg>
                            </div>
                          </div>
                          {/* Location Info */}
                          <div className="p-3 bg-[var(--surface-container)]">
                            <p className="text-body-md font-medium text-[var(--on-surface)]">{message.location.name}</p>
                            <p className="text-body-sm text-[var(--on-surface-variant)] mt-0.5">{message.location.address}</p>
                          </div>
                        </div>
                        {message.text && <p className="text-body-md mt-2 text-[var(--on-surface)]">{renderMessageText(message.text)}</p>}
                      </div>
                    ) : (
                      <p className="text-body-md">{renderMessageText(message.text)}</p>
                    )}
                  </div>
                  <span className="text-label-xs text-[var(--on-surface-variant)] mt-1 block text-right">{message.timestamp}</span>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/user-profile?isContact=false&name=${encodeURIComponent(message.sender)}`)}
                  className="w-8 h-8 bg-[var(--primary-container)] rounded-full flex items-center justify-center text-[var(--on-primary-container)] text-xs font-semibold flex-shrink-0 hover:opacity-90 transition-opacity"
                >
                  {message.senderAvatar}
                </button>
                <div className="max-w-[70%]">
                  <button
                    onClick={() => navigate(`/user-profile?isContact=false&name=${encodeURIComponent(message.sender)}`)}
                    className="text-label-xs text-[var(--on-surface-variant)] ml-1 hover:underline"
                  >
                    {message.sender}
                  </button>
                  {/* Reply Preview */}
                  {message.replyTo && (
                    <div className="mb-1 px-3 py-1.5 bg-[var(--surface-container-lowest)] rounded-t-xl border-l-2 border-[var(--outline)]">
                      <p className="text-label-xs text-[var(--on-surface-variant)]">{message.replyTo.sender}</p>
                      <p className="text-body-sm text-[var(--on-surface)]/80 line-clamp-1">{message.replyTo.text}</p>
                    </div>
                  )}
                  <div
                    className={`bg-[var(--surface-container-lowest)] text-[var(--on-surface)] overflow-hidden cursor-pointer active:scale-[0.98] transition-transform ${message.replyTo ? 'rounded-b-2xl rounded-tr-2xl rounded-tl-sm' : 'rounded-2xl rounded-tl-sm'} mt-0.5 ${message.type === 'image' || message.type === 'video' ? 'p-0' : 'px-4 py-2.5'}`}
                    onContextMenu={(e) => handleMessageLongPress(message, e)}
                    onTouchStart={(e) => {
                      const timer = setTimeout(() => handleMessageLongPress(message, e), 500);
                      const clearTimer = () => {
                        clearTimeout(timer);
                        document.removeEventListener('touchend', clearTimer);
                      };
                      document.addEventListener('touchend', clearTimer);
                    }}
                  >
                    {message.type === 'image' && message.mediaUrl ? (
                      <div className="relative">
                        <img src={message.mediaUrl} alt="Shared image" className="w-full max-w-[280px] h-auto rounded-lg" />
                        {message.text && <p className="px-3 py-2 text-body-md text-[var(--on-surface)]">{renderMessageText(message.text)}</p>}
                      </div>
                    ) : message.type === 'video' && message.mediaUrl ? (
                      <div className="relative">
                        <div className="relative w-full max-w-[280px] aspect-video bg-black rounded-lg overflow-hidden">
                          <img src={message.mediaUrl} alt="Video thumbnail" className="w-full h-full object-cover opacity-80" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-[var(--primary)] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 rounded text-label-xs text-white">
                            0:15
                          </div>
                        </div>
                        {message.text && <p className="px-3 py-2 text-body-md text-[var(--on-surface)]">{renderMessageText(message.text)}</p>}
                      </div>
                    ) : message.type === 'location' && message.location ? (
                      <div className="w-full max-w-[280px]">
                        {/* Location Card - Telegram Style */}
                        <div className="bg-[var(--surface-container)] rounded-lg overflow-hidden">
                          {/* Map Preview Area */}
                          <div className="h-24 bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)]/20 relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <svg className="w-8 h-8 text-[var(--primary)]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                              </svg>
                            </div>
                          </div>
                          {/* Location Info */}
                          <div className="p-3">
                            <p className="text-body-md font-medium text-[var(--on-surface)]">{message.location.name}</p>
                            <p className="text-body-sm text-[var(--on-surface-variant)] mt-0.5">{message.location.address}</p>
                          </div>
                        </div>
                        {message.text && <p className="text-body-md mt-2">{renderMessageText(message.text)}</p>}
                      </div>
                    ) : (
                      <p className="text-body-md">{renderMessageText(message.text)}</p>
                    )}
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
      {showEmojiPicker && (
        <div className="bg-[var(--surface-container)] border-t border-[var(--outline-variant)] px-4 py-3">
          <div className="grid grid-cols-8 gap-2">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiClick(emoji)}
                className="w-10 h-10 flex items-center justify-center text-2xl hover:bg-[var(--surface-container-high)] rounded-lg transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Voice Recording Bar */}
      {isRecording && (
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
      {replyingTo && (
        <div className="bg-[var(--surface-container)] border-t border-[var(--outline-variant)] px-4 py-2">
          <div className="flex items-start gap-2">
            <div className="flex-1 border-l-2 border-[var(--secondary)] pl-3">
              <p className="text-label-xs text-[var(--secondary)]">{replyingTo.sender}</p>
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
      {!isRecording && (
        <div className="bg-[var(--surface-container)] border-t border-[var(--outline-variant)] px-3 py-2">
          <div className="flex items-center gap-2">
            {/* Voice Toggle */}
            <button
              onClick={() => setIsRecording(true)}
              className="p-2 text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>

            {/* Input Field */}
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="Message..."
                rows={1}
                className="w-full bg-[var(--surface-container-lowest)] text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/50 resize-none focus:outline-none rounded-2xl px-4 py-2.5 pr-10 text-body-md border border-[var(--outline-variant)] focus:border-[var(--primary)]/30 transition-colors"
                style={{ minHeight: '40px', maxHeight: '100px' }}
              />
              {/* Emoji Button (inside input) */}
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors ${showEmojiPicker ? 'text-[var(--primary)]' : 'text-[var(--on-surface-variant)]/60 hover:text-[var(--on-surface-variant)]'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>

            {/* Plus / Send Button */}
            {inputText.trim() ? (
              <button
                onClick={handleSend}
                className="p-2 text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className={`p-2 rounded-full transition-all ${showAttachMenu ? 'bg-[var(--primary)] text-[var(--on-primary)] rotate-45' : 'text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            )}
          </div>
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
      {showDeleteConfirm && selectedMessage && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl mx-4 w-full max-w-[320px] p-6">
            <h3 className="text-title-md font-semibold text-[var(--on-surface)] mb-2">Delete Message</h3>
            <p className="text-body-md text-[var(--on-surface-variant)] mb-4">
              Are you sure you want to delete this message?
            </p>
            
            {/* Delete for everyone option - only for my messages */}
            {selectedMessage.isMe && (
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
                onClick={handleConfirmDelete}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--error)] text-[var(--on-error)] text-label-lg font-medium hover:opacity-90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Group Confirmation Dialog */}
      {showLeaveConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl mx-4 w-full max-w-[320px] p-6">
            <h3 className="text-title-md font-semibold text-[var(--on-surface)] mb-2">Leave Group</h3>
            <p className="text-body-md text-[var(--on-surface-variant)] mb-6">
              Are you sure you want to leave "{mockGroup.name}"? You won't receive any new messages from this group.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--surface-container)] text-[var(--on-surface)] text-label-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLeaveConfirm(false);
                  // Navigate back to chats list
                  console.log('Left group, navigate back');
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--error)] text-[var(--on-error)] text-label-lg font-medium hover:opacity-90 transition-colors"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto Delete Dialog */}
      {showAutoDeleteMenu && (
        <div className="absolute inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-[var(--surface-container-lowest)] rounded-t-3xl w-full max-w-[420px] overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--outline-variant)]">
              <h3 className="text-title-lg font-semibold text-[var(--on-surface)]">Auto Delete</h3>
              <button
                onClick={() => setShowAutoDeleteMenu(false)}
                className="p-2 -mr-2 hover:bg-[var(--surface-container)] rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Options */}
            <div className="py-1">
              {autoDeleteOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => {
                    setGroupSettings(prev => ({ ...prev, autoDeleteTimer: option.value }));
                    setShowAutoDeleteMenu(false);
                  }}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface)]"
                >
                  <span className="text-body-lg">{option.label}</span>
                  {groupSettings.autoDeleteTimer === option.value && (
                    <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            {/* Description */}
            <div className="px-5 pb-6 pt-2">
              <p className="text-body-md text-[var(--on-surface-variant)] leading-relaxed">
                Messages will be automatically deleted for everyone after the selected time period.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mention Popup */}
      {showMentionPopup && (
        <div className="absolute bottom-20 left-4 right-4 bg-[var(--surface-container-lowest)] rounded-2xl shadow-ambient-lg max-h-[280px] overflow-hidden z-40">
          {/* Header */}
          <div className="px-4 py-3 border-b border-[var(--outline-variant)]">
            <p className="text-label-sm text-[var(--on-surface-variant)]">Mention someone</p>
          </div>

          {/* Member List */}
          <div className="overflow-y-auto max-h-[220px]">
            {filteredMentionMembers.length === 0 ? (
              <div className="px-4 py-4 text-center">
                <p className="text-body-md text-[var(--on-surface-variant)]">No members found</p>
              </div>
            ) : (
              filteredMentionMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => handleMentionSelect(member)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container)] transition-colors"
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-[var(--secondary-container)] rounded-full flex items-center justify-center text-[var(--on-secondary-container)] font-semibold">
                      {member.avatar}
                    </div>
                    {member.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--surface-container-lowest)]" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-body-md font-medium text-[var(--on-surface)]">{member.name}</p>
                    <p className="text-label-xs text-[var(--on-surface-variant)]">
                      {member.isOnline ? 'Online' : 'Last seen recently'}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            const file = e.target.files[0];
            const newMessage: Message = {
              id: Date.now().toString(),
              text: `📎 ${file.name}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              sender: 'You',
              senderAvatar: 'ME',
              isMe: true,
            };
            setMessages([...messages, newMessage]);
          }
        }}
      />

      {/* Attach Menu - WeChat Style Bottom Sheet */}
      {showAttachMenu && (
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

            {/* Grid Menu - First Row */}
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
                onClick={() => {
                  const locMsg: Message = {
                    id: Date.now().toString(),
                    text: '📍 Blue Bottle Coffee',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    sender: 'You',
                    senderAvatar: 'ME',
                    isMe: true,
                    type: 'location',
                    location: {
                      name: 'Blue Bottle Coffee',
                      address: '123 Market St, San Francisco',
                      lat: 37.7749,
                      lng: -122.4194,
                    },
                  };
                  setMessages([...messages, locMsg]);
                  setShowAttachMenu(false);
                }}
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

const Component = GroupChatPage;
export default Component;
