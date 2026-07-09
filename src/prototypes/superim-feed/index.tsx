/**
 * @name Feed Page
 * @description Social feed for sharing and browsing moments
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState } from 'react';
import '../../themes/equatorial-minimalism/globals.css';
import './style.css';

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  images: string[];
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

const mockPosts: Post[] = [
  {
    id: '1',
    author: { name: 'Amara Okafor', avatar: '' },
    content: 'Beautiful sunset at the beach today! 🌅 Nothing beats the view from Lagos coast.',
    images: ['', '', ''],
    timestamp: '2 hours ago',
    likes: 24,
    comments: 5,
    isLiked: true,
  },
  {
    id: '2',
    author: { name: 'Kwame Asante', avatar: '' },
    content: 'Just finished an amazing project with the team! Hard work pays off. 💪',
    images: [''],
    timestamp: '4 hours ago',
    likes: 56,
    comments: 12,
    isLiked: false,
  },
  {
    id: '3',
    author: { name: 'Chioma Nnamdi', avatar: '' },
    content: 'Weekend vibes with family ❤️',
    images: ['', '', '', ''],
    timestamp: 'Yesterday',
    likes: 89,
    comments: 8,
    isLiked: true,
  },
];

const FeedPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState(mockPosts);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));
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
          <h1 className="text-headline-md text-[var(--primary)]">Feed</h1>
          <button className="p-2 hover:bg-[var(--surface-container)] rounded-full transition-colors">
            <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Create Post Prompt */}
      <div className="px-4 py-4 bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center text-[var(--on-primary)] font-semibold">
            ME
          </div>
          <button className="flex-1 text-left px-4 py-2.5 bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] rounded-full text-[var(--on-surface-variant)] hover:border-[var(--secondary)] transition-colors">
            What's on your mind?
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto">
        {posts.map((post) => (
          <div key={post.id} className="bg-[var(--surface-container-lowest)] mb-3 shadow-ambient-sm">
            {/* Author */}
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 bg-[var(--primary-container)] rounded-full flex items-center justify-center text-[var(--on-primary-container)] font-semibold">
                {getInitials(post.author.name)}
              </div>
              <div>
                <h3 className="font-semibold text-[var(--on-surface)]">{post.author.name}</h3>
                <p className="text-label-sm text-[var(--on-surface-variant)]">{post.timestamp}</p>
              </div>
            </div>

            {/* Content */}
            <div className="px-4 pb-3">
              <p className="text-body-md text-[var(--on-surface)]">{post.content}</p>
            </div>

            {/* Images */}
            {post.images.length > 0 && (
              <div className={`px-4 pb-3 grid gap-1 ${
                post.images.length === 1 ? 'grid-cols-1' :
                post.images.length === 2 ? 'grid-cols-2' :
                post.images.length === 4 ? 'grid-cols-2' : 'grid-cols-3'
              }`}>
                {post.images.map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-[var(--surface-container)] rounded-lg flex items-center justify-center"
                  >
                    <svg className="w-8 h-8 text-[var(--outline)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="px-4 py-2 flex items-center justify-between border-t border-[var(--outline-variant)]/50">
              <span className="text-label-sm text-[var(--on-surface-variant)]">{post.likes} likes · {post.comments} comments</span>
            </div>

            {/* Actions */}
            <div className="flex border-t border-[var(--outline-variant)]">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 hover:bg-[var(--surface-container-low)] transition-colors ${
                  post.isLiked ? 'text-[var(--secondary)]' : 'text-[var(--on-surface-variant)]'
                }`}
              >
                <svg className="w-5 h-5" fill={post.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-label-md font-medium">Like</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-low)] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-label-md font-medium">Comment</span>
              </button>
            </div>
          </div>
        ))}
      </div>

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

const Component = FeedPage;
export default Component;
