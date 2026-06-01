/**
 * @name UserProfile Page
 * @description Detailed contact profile with actions
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState } from 'react';
import '../../themes/equatorial-minimalism/globals.css';
import './style.css';

interface UserProfile {
  name: string;
  username: string;
  bio: string;
  phone: string;
  location: string;
  isOnline: boolean;
  joinedDate: string;
}

const mockProfile: UserProfile = {
  name: 'Amara Okafor',
  username: '@amara.okafor',
  bio: 'Product Designer | Lagos, Nigeria 🇳🇬\nCreating beautiful experiences',
  phone: '+234 801 234 5678',
  location: 'Lagos, Nigeria',
  isOnline: true,
  joinedDate: 'March 2023',
};

const UserProfilePage: React.FC = () => {
  const [isBlocked, setIsBlocked] = useState(false);

  return (
    <div className="h-full bg-[var(--surface)] flex flex-col">
      {/* Header */}
      <header className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] px-4 py-3 flex-shrink-0 z-20">
        <div className="flex items-center justify-between">
          <button className="p-2 -ml-2 hover:bg-[var(--surface-container)] rounded-full transition-colors">
            <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-headline-md text-[var(--primary)]">Profile</h1>
          <button className="p-2 hover:bg-[var(--surface-container)] rounded-full transition-colors">
            <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Header */}
        <div className="bg-[var(--surface-container-low)] px-6 py-8">
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div className="relative">
              <div className="w-28 h-28 bg-[var(--primary)] rounded-full flex items-center justify-center text-[var(--on-primary)] text-3xl font-bold border-4 border-[var(--surface)] shadow-ambient-lg">
                AO
              </div>
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-[var(--secondary)] border-4 border-[var(--surface)] rounded-full" />
            </div>

            {/* Name & Username */}
            <h2 className="text-headline-md text-[var(--on-surface)] font-bold mt-4">{mockProfile.name}</h2>
            <p className="text-body-md text-[var(--on-surface-variant)]">{mockProfile.username}</p>

            {/* Bio */}
            <p className="text-body-md text-[var(--on-surface)] text-center mt-3 whitespace-pre-line">
              {mockProfile.bio}
            </p>

            {/* Status */}
            <div className="flex items-center gap-2 mt-3 px-3 py-1.5 bg-[var(--secondary-container)] rounded-full">
              <div className="w-2 h-2 bg-[var(--secondary)] rounded-full animate-pulse" />
              <span className="text-label-md text-[var(--on-secondary-container)]">Online</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-[var(--secondary)] text-[var(--on-secondary)] rounded-xl font-medium hover:bg-[var(--secondary-container)] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Message
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-[var(--surface-container-lowest)] text-[var(--on-surface)] border border-[var(--outline-variant)] rounded-xl font-medium hover:bg-[var(--surface-container)] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Voice
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-[var(--surface-container-lowest)] text-[var(--on-surface)] border border-[var(--outline-variant)] rounded-xl font-medium hover:bg-[var(--surface-container)] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Video
            </button>
          </div>
        </div>

        {/* Info Sections */}
        <div className="px-4 py-4 space-y-4">
        {/* Contact Info */}
        <div className="bg-[var(--surface-container-lowest)] rounded-xl overflow-hidden shadow-ambient-sm">
          <div className="px-4 py-3 border-b border-[var(--outline-variant)]/50">
            <h3 className="text-label-md text-[var(--on-surface-variant)] uppercase tracking-wider">Contact Info</h3>
          </div>

          <div className="px-4 py-3 flex items-center gap-3 border-b border-[var(--outline-variant)]/50">
            <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <div>
              <p className="text-body-md text-[var(--on-surface)]">{mockProfile.phone}</p>
              <p className="text-label-sm text-[var(--on-surface-variant)]">Mobile</p>
            </div>
          </div>

          <div className="px-4 py-3 flex items-center gap-3">
            <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <p className="text-body-md text-[var(--on-surface)]">{mockProfile.location}</p>
              <p className="text-label-sm text-[var(--on-surface-variant)]">Location</p>
            </div>
          </div>
        </div>

        {/* Shared Media */}
        <div className="bg-[var(--surface-container-lowest)] rounded-xl overflow-hidden shadow-ambient-sm">
          <div className="px-4 py-3 flex items-center justify-between border-b border-[var(--outline-variant)]/50">
            <h3 className="text-label-md text-[var(--on-surface-variant)] uppercase tracking-wider">Shared Media</h3>
            <button className="text-label-md text-[var(--secondary)]">View All</button>
          </div>
          <div className="grid grid-cols-4 gap-1 p-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-[var(--surface-container)] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--outline)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-[var(--surface-container-lowest)] rounded-xl overflow-hidden shadow-ambient-sm">
          <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[var(--surface-container-low)] transition-colors border-b border-[var(--outline-variant)]/50">
            <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="text-body-md text-[var(--on-surface)]">Share Contact</span>
          </button>

          <button
            onClick={() => setIsBlocked(!isBlocked)}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[var(--surface-container-low)] transition-colors border-b border-[var(--outline-variant)]/50"
          >
            <svg className={`w-5 h-5 ${isBlocked ? 'text-[var(--error)]' : 'text-[var(--error)]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            <span className={`text-body-md ${isBlocked ? 'text-[var(--error)]' : 'text-[var(--error)]'}`}>
              {isBlocked ? 'Unblock Contact' : 'Block Contact'}
            </span>
          </button>

          <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[var(--surface-container-low)] transition-colors">
            <svg className="w-5 h-5 text-[var(--error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-body-md text-[var(--error)]">Report Contact</span>
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

const Component = UserProfilePage;
export default Component;
