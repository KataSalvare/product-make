/**
 * @name NewPost Page
 * @description Create new post for social feed
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState } from 'react';
import '../../themes/equatorial-minimalism/globals.css';
import './style.css';

interface AttachedMedia {
  id: string;
  type: 'image' | 'video';
}

interface LocationInfo {
  name: string;
  address: string;
}

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

const mockLocations = [
  { name: 'Lagos, Nigeria', address: 'Victoria Island' },
  { name: 'Cairo, Egypt', address: 'Downtown Cairo' },
  { name: 'Nairobi, Kenya', address: 'Westlands' },
  { name: 'Cape Town, South Africa', address: 'City Center' },
  { name: 'Accra, Ghana', address: 'Airport City' },
];

const NewPostPage: React.FC = () => {
  const [content, setContent] = useState('');
  const [attachedMedia, setAttachedMedia] = useState<AttachedMedia[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationInfo | null>(null);
  const [searchLocation, setSearchLocation] = useState('');

  const maxLength = 500;
  const charCount = content.length;
  const canPost = content.trim().length > 0 || attachedMedia.length > 0;

  const handlePost = () => {
    if (!canPost) return;
    setIsPosting(true);
    setTimeout(() => {
      setIsPosting(false);
      setContent('');
      setAttachedMedia([]);
      setSelectedLocation(null);
    }, 1500);
  };

  const addMedia = () => {
    const newMedia: AttachedMedia = {
      id: Date.now().toString(),
      type: 'image',
    };
    setAttachedMedia([...attachedMedia, newMedia]);
  };

  const removeMedia = (id: string) => {
    setAttachedMedia(attachedMedia.filter(m => m.id !== id));
  };

  const insertEmoji = (emoji: string) => {
    if (content.length < maxLength) {
      setContent(content + emoji);
    }
  };

  const selectLocation = (location: LocationInfo) => {
    setSelectedLocation(location);
    setShowLocationPicker(false);
  };

  const removeLocation = () => {
    setSelectedLocation(null);
  };

  const filteredLocations = mockLocations.filter(
    loc => loc.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
           loc.address.toLowerCase().includes(searchLocation.toLowerCase())
  );

  return (
    <div className="h-full bg-[var(--surface)] flex flex-col">
      {/* Header */}
      <header className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <button className="px-3 py-1.5 text-body-md text-[var(--on-surface)] hover:bg-[var(--surface-container)] rounded-lg transition-colors">
            Cancel
          </button>
          <h1 className="text-headline-md text-[var(--primary)]">New Post</h1>
          <button
            onClick={handlePost}
            disabled={!canPost || isPosting}
            className={`px-4 py-1.5 rounded-full text-label-md font-medium transition-all ${
              canPost && !isPosting
                ? 'bg-[var(--secondary)] text-[var(--on-secondary)]'
                : 'bg-[var(--surface-container)] text-[var(--outline)] cursor-not-allowed'
            }`}
          >
            {isPosting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 px-4 py-4">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center text-[var(--on-primary)] font-semibold">
            JD
          </div>
          <div>
            <h2 className="text-body-md font-semibold text-[var(--on-surface)]">John Doe</h2>
            <p className="text-label-sm text-[var(--on-surface-variant)]">Public</p>
          </div>
        </div>

        {/* Text Input */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, maxLength))}
          placeholder="What's on your mind?"
          className="w-full h-40 bg-transparent text-headline-sm text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/50 resize-none focus:outline-none"
        />

        {/* Character Count */}
        <div className="flex justify-end">
          <span className={`text-label-sm ${charCount > maxLength * 0.9 ? 'text-[var(--error)]' : 'text-[var(--on-surface-variant)]'}`}>
            {charCount}/{maxLength}
          </span>
        </div>

        {/* Selected Location Tag */}
        {selectedLocation && (
          <div className="mt-3 flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--secondary-container)] rounded-full">
              <svg className="w-4 h-4 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-label-sm text-[var(--secondary)]">{selectedLocation.name}</span>
              <button
                onClick={removeLocation}
                className="ml-1 p-0.5 hover:bg-[var(--surface)] rounded-full transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Attached Media Preview */}
        {attachedMedia.length > 0 && (
          <div className={`grid gap-2 mt-4 ${
            attachedMedia.length === 1 ? 'grid-cols-1' :
            attachedMedia.length === 2 ? 'grid-cols-2' :
            attachedMedia.length === 4 ? 'grid-cols-2' : 'grid-cols-3'
          }`}>
            {attachedMedia.map((media) => (
              <div key={media.id} className="relative aspect-square bg-[var(--surface-container)] rounded-xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-10 h-10 text-[var(--outline)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <button
                  onClick={() => removeMedia(media.id)}
                  className="absolute top-2 right-2 w-6 h-6 bg-[var(--surface)]/80 rounded-full flex items-center justify-center hover:bg-[var(--error)] hover:text-[var(--on-error)] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Emoji Picker Panel */}
      {showEmojiPicker && (
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
                  onClick={() => insertEmoji(emoji)}
                  className="aspect-square flex items-center justify-center text-2xl hover:bg-[var(--surface-container-high)] rounded-lg transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Location Picker Panel */}
      {showLocationPicker && (
        <div className="bg-[var(--surface-container)] border-t border-[var(--outline-variant)] animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--outline-variant)]">
            <span className="text-label-sm text-[var(--on-surface-variant)]">Add Location</span>
            <button
              onClick={() => setShowLocationPicker(false)}
              className="p-1 hover:bg-[var(--surface-container-high)] rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Search Location */}
          <div className="px-4 py-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-[var(--surface-container-lowest)] rounded-lg">
              <svg className="w-4 h-4 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Search location..."
                className="flex-1 bg-transparent text-body-sm text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/50 focus:outline-none"
              />
            </div>
          </div>
          {/* Location List */}
          <div className="max-h-40 overflow-y-auto px-2 pb-2">
            {filteredLocations.map((location, index) => (
              <button
                key={index}
                onClick={() => selectLocation(location)}
                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-[var(--surface-container-high)] rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-[var(--secondary-container)] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-body-sm font-medium text-[var(--on-surface)]">{location.name}</p>
                  <p className="text-label-sm text-[var(--on-surface-variant)]">{location.address}</p>
                </div>
                {selectedLocation?.name === location.name && (
                  <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-[var(--surface-container)] border-t border-[var(--outline-variant)] px-4 py-3 pb-safe">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* Photo */}
            <button
              onClick={addMedia}
              className="p-2 hover:bg-[var(--surface-container-high)] rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>

            {/* Camera */}
            <button className="p-2 hover:bg-[var(--surface-container-high)] rounded-full transition-colors">
              <svg className="w-6 h-6 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {/* Location */}
            <button
              onClick={() => {
                setShowLocationPicker(!showLocationPicker);
                setShowEmojiPicker(false);
              }}
              className={`p-2 rounded-full transition-colors ${
                showLocationPicker || selectedLocation
                  ? 'bg-[var(--secondary-container)] text-[var(--secondary)]'
                  : 'hover:bg-[var(--surface-container-high)] text-[var(--secondary)]'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {/* Emoji */}
            <button
              onClick={() => {
                setShowEmojiPicker(!showEmojiPicker);
                setShowLocationPicker(false);
              }}
              className={`p-2 rounded-full transition-colors ${
                showEmojiPicker
                  ? 'bg-[var(--secondary-container)] text-[var(--secondary)]'
                  : 'hover:bg-[var(--surface-container-high)] text-[var(--secondary)]'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>

          <button className="p-2 hover:bg-[var(--surface-container-high)] rounded-full transition-colors">
            <svg className="w-6 h-6 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const Component = NewPostPage;
export default Component;
