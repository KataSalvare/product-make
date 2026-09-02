/**
 * @name CallScreen Page
 * @description Active call interface with voice and video controls
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState, useEffect } from 'react';
import '../../themes/equatorial-minimalism/globals.css';
import './style.css';

interface CallState {
  status: 'calling' | 'ringing' | 'connected' | 'ended';
  duration: number;
  isMuted: boolean;
  isSpeakerOn: boolean;
  isVideoOn: boolean;
  isFrontCamera: boolean;
}

const CallScreenPage: React.FC = () => {
  const [callState, setCallState] = useState<CallState>({
    status: 'connected',
    duration: 32,
    isMuted: false,
    isSpeakerOn: false,
    isVideoOn: true,
    isFrontCamera: true,
  });

  useEffect(() => {
    if (callState.status === 'connected') {
      const timer = setInterval(() => {
        setCallState(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [callState.status]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusText = (): string => {
    switch (callState.status) {
      case 'calling': return 'Calling...';
      case 'ringing': return 'Ringing...';
      case 'connected': return formatDuration(callState.duration);
      case 'ended': return 'Call ended';
      default: return '';
    }
  };

  // Control button configuration with labels
  const controls = [
    {
      id: 'mute',
      label: callState.isMuted ? 'Unmute' : 'Mute',
      icon: callState.isMuted ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      ),
      isActive: callState.isMuted,
      onClick: () => setCallState(prev => ({ ...prev, isMuted: !prev.isMuted })),
    },
    {
      id: 'video',
      label: callState.isVideoOn ? 'Video Off' : 'Video On',
      icon: callState.isVideoOn ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
      ),
      isActive: !callState.isVideoOn,
      onClick: () => setCallState(prev => ({ ...prev, isVideoOn: !prev.isVideoOn })),
    },
    {
      id: 'speaker',
      label: callState.isSpeakerOn ? 'Speaker Off' : 'Speaker',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      ),
      isActive: callState.isSpeakerOn,
      onClick: () => setCallState(prev => ({ ...prev, isSpeakerOn: !prev.isSpeakerOn })),
    },
    ...(callState.isVideoOn ? [{
      id: 'flip',
      label: 'Flip',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      ),
      isActive: false,
      onClick: () => setCallState(prev => ({ ...prev, isFrontCamera: !prev.isFrontCamera })),
    }] : []),
  ];

  return (
    <div className="h-full bg-[var(--surface-container-low)] flex flex-col relative overflow-hidden">
      {/* Background Pattern - Soft gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary)]/5 to-transparent" />

      {/* Header - Call Status */}
      <div className="relative z-10 pt-12 px-6 flex items-center justify-between">
        <button className="w-10 h-10 rounded-full bg-[var(--surface-container)] flex items-center justify-center text-[var(--on-surface)] hover:bg-[var(--surface-container-high)] transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-2 bg-[var(--surface-container)] px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-label-sm text-[var(--on-surface)] font-medium">{getStatusText()}</span>
        </div>
        <button className="w-10 h-10 rounded-full bg-[var(--surface-container)] flex items-center justify-center text-[var(--on-surface)] hover:bg-[var(--surface-container-high)] transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Video Preview (small, corner) */}
      {callState.isVideoOn && (
        <div className="absolute top-24 right-4 w-28 h-36 bg-[var(--surface-container)] rounded-2xl overflow-hidden border-2 border-[var(--outline-variant)] z-10 shadow-lg">
          <div className="w-full h-full flex items-center justify-center text-[var(--on-surface-variant)] text-xs">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-[var(--primary-container)] flex items-center justify-center text-[var(--on-primary-container)] text-sm font-bold mx-auto mb-1">ME</div>
              <span>You</span>
            </div>
          </div>
          <div className="absolute bottom-2 right-2">
            <svg className="w-4 h-4 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">
        {/* Avatar with ripple effect */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-[var(--secondary)]/20 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-4 bg-[var(--secondary)]/10 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
          <div className="w-28 h-28 bg-[var(--secondary)] rounded-full flex items-center justify-center text-[var(--on-secondary)] text-3xl font-bold border-4 border-[var(--surface-container-highest)] shadow-xl">
            AO
          </div>
          <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-3 border-[var(--surface-container-low)] rounded-full" />
        </div>

        {/* Contact Info */}
        <h1 className="text-headline-lg text-[var(--on-surface)] font-bold mb-1">Amara Okafor</h1>
        <p className="text-body-md text-[var(--on-surface-variant)] mb-4">Video Call</p>

        {/* Network Quality */}
        <div className="flex items-center gap-2 bg-[var(--surface-container)] px-4 py-2 rounded-full">
          <div className="flex items-end gap-0.5 h-4">
            {[1, 2, 3, 4].map((bar) => (
              <div
                key={bar}
                className={`w-1 rounded-sm ${bar <= 3 ? 'bg-green-500' : 'bg-[var(--outline-variant)]'}`}
                style={{ height: `${bar * 3 + 2}px` }}
              />
            ))}
          </div>
          <span className="text-label-sm text-[var(--on-surface-variant)]">Good connection</span>
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 px-6 pb-10 pt-6">
        {/* Control Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {controls.map((control) => (
            <button
              key={control.id}
              onClick={control.onClick}
              className="flex flex-col items-center gap-2 group"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-md ${
                control.isActive
                  ? 'bg-[var(--primary)] text-[var(--on-primary)]'
                  : 'bg-[var(--surface-container-highest)] text-[var(--on-surface)] hover:bg-[var(--surface-container-high)]'
              }`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {control.icon}
                </svg>
              </div>
              <span className={`text-label-xs font-medium ${
                control.isActive ? 'text-[var(--primary)]' : 'text-[var(--on-surface-variant)]'
              }`}>
                {control.label}
              </span>
            </button>
          ))}
        </div>

        {/* End Call Button - Prominent */}
        <div className="flex justify-center mb-6">
          <button className="flex flex-col items-center gap-2 group">
            <div className="w-16 h-16 rounded-2xl bg-[var(--error)] flex items-center justify-center text-[var(--on-error)] shadow-lg hover:opacity-90 transition-all">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
              </svg>
            </div>
            <span className="text-label-xs font-medium text-[var(--error)]">End Call</span>
          </button>
        </div>

        {/* Swipe hint */}
        <div className="flex items-center justify-center gap-2 text-[var(--on-surface-variant)]">
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <span className="text-label-sm">Swipe down to minimize</span>
        </div>
      </div>
    </div>
  );
};

const Component = CallScreenPage;
export default Component;
