/**
 * @name My Posts
 * @description Personal posts page showing user's own moments sorted by time
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState } from 'react';
import '../../themes/equatorial-minimalism/globals.css';
import './style.css';

interface Post {
  id: string;
  content: string;
  images: string[];
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

const mockMyPosts: Post[] = [
  {
    id: '1',
    content: 'Weekend vibes with the crew! 🎉 Best rooftop party in Lagos.',
    images: ['', '', ''],
    timestamp: '3 hours ago',
    likes: 48,
    comments: 12,
    isLiked: false,
  },
  {
    id: '2',
    content: 'Sunset stroll along Tarkwa Bay. Nothing beats this view. 🌅',
    images: ['', ''],
    timestamp: 'Yesterday',
    likes: 102,
    comments: 28,
    isLiked: true,
  },
  {
    id: '3',
    content: 'New design concept for the mobile app. Thoughts? 💭',
    images: [''],
    timestamp: '2 days ago',
    likes: 76,
    comments: 19,
    isLiked: false,
  },
  {
    id: '4',
    content: 'Morning coffee and code. The best way to start any day. ☕️',
    images: ['', '', '', ''],
    timestamp: '3 days ago',
    likes: 55,
    comments: 8,
    isLiked: true,
  },
  {
    id: '5',
    content: 'Grateful for the amazing team at work. Big things coming soon! 🚀',
    images: [],
    timestamp: '5 days ago',
    likes: 134,
    comments: 42,
    isLiked: false,
  },
];

const MyPostsPage: React.FC = () => {
  const [posts, setPosts] = useState(mockMyPosts);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const getInitials = () => 'JD';

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

  const handleDelete = () => {
    if (!deleteConfirmId) return;
    setPosts(prev => prev.filter(p => p.id !== deleteConfirmId));
    setDeleteConfirmId(null);
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
          <h1 className="text-headline-md text-[var(--primary)]">My Posts</h1>
        </div>
      </header>

      {/* Posts Feed */}
      <div className="flex-1 overflow-y-auto">
        {posts.map((post) => (
          <div key={post.id} className="bg-[var(--surface-container-lowest)] mb-3 shadow-ambient-sm">
            {/* Author — always self */}
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center text-[var(--on-primary)] font-semibold">
                {getInitials()}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--on-surface)]">John Doe</h3>
                <p className="text-label-sm text-[var(--on-surface-variant)]">{post.timestamp}</p>
              </div>
              <button
                onClick={() => setDeleteConfirmId(post.id)}
                className="p-1.5 hover:bg-[var(--surface-container)] rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
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

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl w-full max-w-[320px] p-6">
            <h3 className="text-title-md font-semibold text-[var(--on-surface)] mb-2">Delete Post</h3>
            <p className="text-body-md text-[var(--on-surface-variant)] mb-6">
              This post will be permanently removed. Are you sure?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--surface-container)] text-[var(--on-surface)] text-label-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--error)] text-[var(--on-error)] text-label-lg font-medium hover:opacity-90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const Component = MyPostsPage;
export default Component;
