/**
 * @name FavoriteDetail Page
 * @description View a single saved message bubble and forward or delete it
 * @mode axure
 */

import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../themes/equatorial-minimalism/globals.css';
import './style.css';

type FavoriteType = 'text' | 'image' | 'video' | 'link' | 'file';

interface Favorite {
  id: string;
  type: FavoriteType;
  source: string;
  content: string;
  preview?: string;
  time: string;
  title?: string;
  url?: string;
  fileName?: string;
  fileSize?: string;
  isFromMe?: boolean;
}

const mockFavorites: Favorite[] = [
  {
    id: '1',
    type: 'text',
    source: 'Design Team',
    content: 'Beautiful sunset at the beach today! Nothing beats the view from Lagos coast.',
    time: 'Today, 10:30 AM',
  },
  {
    id: '2',
    type: 'image',
    source: 'Amara Okafor',
    content: 'Photo',
    preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop',
    time: 'Yesterday, 4:15 PM',
  },
  {
    id: '3',
    type: 'video',
    source: 'Family Group',
    content: 'Birthday party highlights',
    preview: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
    time: 'Monday, 8:00 PM',
  },
  {
    id: '4',
    type: 'link',
    source: 'Tech Support',
    content: 'https://react.dev/learn',
    title: 'React – Learn',
    url: 'https://react.dev/learn',
    time: 'Sunday, 11:20 AM',
  },
  {
    id: '5',
    type: 'file',
    source: 'Chioma Nnamdi',
    content: 'Project brief.pdf',
    fileName: 'Project brief.pdf',
    fileSize: '2.4 MB',
    time: 'Last week',
  },
];

const FavoriteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const favorite = useMemo(() => mockFavorites.find((item) => item.id === id) || mockFavorites[0], [id]);

  const handleForward = () => {
    navigate(`/forward-message?favoriteId=${favorite.id}`);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    navigate('/favorites');
  };

  const renderContent = () => {
    switch (favorite.type) {
      case 'image':
        return favorite.preview ? (
          <img src={favorite.preview} alt="Saved" className="w-full max-w-[280px] h-auto rounded-xl object-cover" />
        ) : null;
      case 'video':
        return favorite.preview ? (
          <div className="relative w-full max-w-[280px] rounded-xl overflow-hidden">
            <img src={favorite.preview} alt="Video thumbnail" className="w-full h-auto object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-[var(--primary)] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        ) : null;
      case 'link':
        return (
          <a
            href={favorite.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--primary)] underline break-all text-body-lg"
          >
            {favorite.title || favorite.url}
          </a>
        );
      case 'file':
        return (
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <p className="text-body-lg text-[var(--on-surface)]">{favorite.fileName}</p>
              <p className="text-body-md text-[var(--on-surface-variant)]">{favorite.fileSize}</p>
            </div>
          </div>
        );
      default:
        return <p className="text-body-lg text-[var(--on-surface)] whitespace-pre-wrap">{favorite.content}</p>;
    }
  };

  return (
    <div className="h-full bg-[var(--surface)] flex flex-col">
      {/* Header */}
      <header className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 hover:bg-[var(--surface-container)] rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-headline-md text-[var(--primary)]">Saved Message</h1>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 hover:bg-[var(--error-container)] rounded-full transition-colors"
            aria-label="Delete favorite"
          >
            <svg className="w-6 h-6 text-[var(--error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center">
        {!favorite.isFromMe && (
          <span className="text-label-sm text-[var(--secondary)] mb-1 self-start">{favorite.source}</span>
        )}
        <div className={`w-full max-w-[320px] ${favorite.isFromMe ? 'self-end' : 'self-start'}`}>
          <div className={`rounded-2xl p-4 shadow-ambient-sm ${favorite.isFromMe ? 'bg-[var(--primary-container)] rounded-br-none' : 'bg-[var(--surface-container-lowest)] rounded-bl-none'}`}>
            {renderContent()}
            <p className="text-label-xs text-[var(--on-surface-variant)] mt-2 text-right">{favorite.time}</p>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="bg-[var(--surface-container-low)] border-t border-[var(--outline-variant)] px-4 py-4 safe-area-pb">
        <button
          onClick={handleForward}
          className="w-full py-3.5 rounded-xl text-body-lg font-semibold bg-[var(--primary)] text-[var(--on-primary)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
          Forward
        </button>
      </div>

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl w-full max-w-[320px] p-6">
            <h3 className="text-title-md font-semibold text-[var(--on-surface)] mb-2">Delete Message</h3>
            <p className="text-body-md text-[var(--on-surface-variant)] mb-6">Are you sure you want to delete this saved message?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
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

const Component = FavoriteDetailPage;
export default Component;
