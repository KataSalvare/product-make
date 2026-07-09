/**
 * @name Security
 * @description Account security settings including password, contact methods, sessions, and data management
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../themes/equatorial-minimalism/globals.css';
import './style.css';

const countryCodes = [
  { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+27', flag: '🇿🇦', name: 'South Africa' },
  { code: '+254', flag: '🇰🇪', name: 'Kenya' },
  { code: '+255', flag: '🇹🇿', name: 'Tanzania' },
  { code: '+233', flag: '🇬🇭', name: 'Ghana' },
];

interface QuickLogin {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
}

const SecurityPage: React.FC = () => {
  const navigate = useNavigate();
  const [biometric, setBiometric] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('+234 801 234 5678');
  const [email, setEmail] = useState('john@example.com');

  const [quickLogins, setQuickLogins] = useState<QuickLogin[]>([
    {
      id: 'google',
      name: 'Google',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
      connected: true,
    },
    {
      id: 'apple',
      name: 'Apple',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      ),
      connected: true,
    },
  ]);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [phoneCountry, setPhoneCountry] = useState('+234');
  const [phoneInput, setPhoneInput] = useState('801 234 5678');
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneStep, setPhoneStep] = useState<'input' | 'verify'>('input');
  const [phoneCountdown, setPhoneCountdown] = useState(0);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailInput, setEmailInput] = useState('john@example.com');
  const [emailCode, setEmailCode] = useState('');
  const [emailStep, setEmailStep] = useState<'input' | 'verify'>('input');
  const [emailCountdown, setEmailCountdown] = useState(0);

  const [unbindConfirm, setUnbindConfirm] = useState<string | null>(null);
  const [terminateSessionId, setTerminateSessionId] = useState<string | null>(null);

  const [showActiveSessions, setShowActiveSessions] = useState(false);
  const activeSessions = [
    { id: 's1', device: 'iPhone 15', location: 'Lagos, Nigeria', os: 'iOS 18.1', lastActive: 'Now', isCurrent: true },
    { id: 's2', device: 'MacBook Pro', location: 'Lagos, Nigeria', os: 'macOS 15', lastActive: '2 hours ago', isCurrent: false },
    { id: 's3', device: 'iPad Air', location: 'Abuja, Nigeria', os: 'iPadOS 18', lastActive: '3 days ago', isCurrent: false },
  ];

  const handleTerminateSession = (id: string) => {
    setTerminateSessionId(id);
  };

  const handleConfirmTerminate = () => {
    setTerminateSessionId(null);
    console.log('Terminate session:', terminateSessionId);
  };

  const [showLoginHistory, setShowLoginHistory] = useState(false);
  const loginHistory = [
    { id: 'l1', device: 'iPhone 15', location: 'Lagos, Nigeria', time: 'Today, 10:42 AM', ip: '192.168.1.1', icon: 'M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364a8 8 0 0114.066-5.148' },
    { id: 'l2', device: 'MacBook Pro', location: 'Lagos, Nigeria', time: 'Yesterday, 3:15 PM', ip: '192.168.1.2', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { id: 'l3', device: 'iPad Air', location: 'Abuja, Nigeria', time: 'May 25, 8:30 AM', ip: '10.0.0.45', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { id: 'l4', device: 'iPhone 15', location: 'Lagos, Nigeria', time: 'May 24, 11:00 PM', ip: '192.168.1.1', icon: 'M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364a8 8 0 0114.066-5.148' },
  ];

  const [showAutoDelete, setShowAutoDelete] = useState(false);
  const [autoDeleteValue, setAutoDeleteValue] = useState('never');
  const [autoDeleteLabel, setAutoDeleteLabel] = useState('Never');

  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const showToast = (message: string) => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToast(message);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 2000);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== 'DELETE') return;
    setShowDeleteConfirm(false);
    setDeleteConfirmText('');
    showToast('Account deleted');
  };

  const autoDeleteOptions = [
    { value: 'never', label: 'Never', hint: 'Messages are kept permanently' },
    { value: '24h', label: '24 Hours', hint: 'Messages are deleted after 24 hours' },
    { value: '7d', label: '7 Days', hint: 'Messages are deleted after 7 days' },
    { value: '30d', label: '30 Days', hint: 'Messages are deleted after 30 days' },
    { value: '90d', label: '90 Days', hint: 'Messages are deleted after 90 days' },
  ];

  const startCountdown = (setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter(60);
    let count = 60;
    const timer = setInterval(() => {
      count -= 1;
      if (count <= 0) { clearInterval(timer); setter(0); }
      else { setter(count); }
    }, 1000);
  };

  const handleChangePassword = () => {
    if (newPwd.length < 6) { setPasswordError('Password must be at least 6 characters'); return; }
    if (newPwd !== confirmPwd) { setPasswordError('Passwords do not match'); return; }
    setPasswordError('');
    setShowChangePassword(false);
    setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
  };

  const handleSendPhoneCode = () => {
    setPhoneStep('verify');
    startCountdown(setPhoneCountdown);
  };

  const handleVerifyPhone = () => {
    setPhoneNumber(`${phoneCountry} ${phoneInput}`);
    setShowPhoneDialog(false);
    setPhoneStep('input');
    setPhoneCode('');
    setPhoneCountdown(0);
  };

  const handleSendEmailCode = () => {
    setEmailStep('verify');
    startCountdown(setEmailCountdown);
  };

  const handleVerifyEmail = () => {
    setEmail(emailInput);
    setShowEmailDialog(false);
    setEmailStep('input');
    setEmailCode('');
    setEmailCountdown(0);
  };

  const handleUnbind = (id: string) => {
    setQuickLogins(prev => prev.map(q => q.id === id ? { ...q, connected: false } : q));
    setUnbindConfirm(null);
  };

  return (
    <div className="h-full bg-[var(--surface)] flex flex-col">
      <header className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-[var(--surface-container)] rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-headline-md text-[var(--primary)]">Security</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-4">
        {/* Account */}
        <div>
          <h2 className="text-label-md text-[var(--on-surface-variant)] uppercase tracking-wider mb-2 px-2">Account</h2>
          <div className="bg-[var(--surface-container-lowest)] rounded-xl overflow-hidden shadow-ambient-sm">
            <button onClick={() => setShowChangePassword(true)} className="w-full flex items-center gap-3 px-4 py-3 border-b border-[var(--outline-variant)]/50 hover:bg-[var(--surface-container-low)] transition-colors">
              <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
              <span className="flex-1 text-left text-body-md text-[var(--on-surface)]">Change Password</span>
              <svg className="w-5 h-5 text-[var(--outline)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
            </button>
            <div className="flex items-center gap-3 px-4 py-3">
              <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
              <div className="flex-1">
                <span className="text-body-md text-[var(--on-surface)]">Biometric Lock</span>
                <p className="text-label-sm text-[var(--on-surface-variant)]">Face ID / Touch ID</p>
              </div>
              <button onClick={() => setBiometric(!biometric)} className={`w-12 h-6 rounded-full transition-colors relative ${biometric ? 'bg-[var(--secondary)]' : 'bg-[var(--surface-container)]'}`}>
                <div className={`w-5 h-5 bg-[var(--on-secondary)] rounded-full absolute top-0.5 transition-transform ${biometric ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Contact Methods */}
        <div>
          <h2 className="text-label-md text-[var(--on-surface-variant)] uppercase tracking-wider mb-2 px-2">Contact Methods</h2>
          <div className="bg-[var(--surface-container-lowest)] rounded-xl overflow-hidden shadow-ambient-sm">
            <button onClick={() => { setShowPhoneDialog(true); setPhoneStep('input'); }} className="w-full flex items-center gap-3 px-4 py-3 border-b border-[var(--outline-variant)]/50 hover:bg-[var(--surface-container-low)] transition-colors">
              <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              <div className="flex-1 text-left">
                <span className="text-body-md text-[var(--on-surface)]">Phone Number</span>
                <p className="text-label-sm text-[var(--on-surface-variant)]">{phoneNumber}</p>
              </div>
              <svg className="w-5 h-5 text-[var(--outline)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
            </button>
            <button onClick={() => { setShowEmailDialog(true); setEmailStep('input'); setEmailInput(email); }} className="w-full flex items-center gap-3 px-4 py-3 border-b border-[var(--outline-variant)]/50 hover:bg-[var(--surface-container-low)] transition-colors">
              <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <div className="flex-1 text-left">
                <span className="text-body-md text-[var(--on-surface)]">Email Address</span>
                <p className="text-label-sm text-[var(--on-surface-variant)]">{email}</p>
              </div>
              <svg className="w-5 h-5 text-[var(--outline)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
            </button>
            {quickLogins.map((ql, idx) => (
              <div key={ql.id} className={`w-full flex items-center gap-3 px-4 py-3 ${idx !== quickLogins.length - 1 ? 'border-b border-[var(--outline-variant)]/50' : ''}`}>
                {ql.icon}
                <div className="flex-1 text-left">
                  <span className="text-body-md text-[var(--on-surface)]">{ql.name}</span>
                  <p className="text-label-sm text-[var(--on-surface-variant)]">{ql.connected ? 'Connected' : 'Not connected'}</p>
                </div>
                {ql.connected ? (
                  <button onClick={() => setUnbindConfirm(ql.id)} className="px-3 py-1 rounded-full text-label-sm font-medium text-[var(--error)] border border-[var(--error)] hover:bg-[var(--error)]/10 transition-colors">Unbind</button>
                ) : (
                  <button className="px-3 py-1 rounded-full text-label-sm font-medium text-[var(--secondary)] border border-[var(--secondary)] hover:bg-[var(--secondary)]/10 transition-colors">Connect</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sessions */}
        <div>
          <h2 className="text-label-md text-[var(--on-surface-variant)] uppercase tracking-wider mb-2 px-2">Sessions</h2>
          <div className="bg-[var(--surface-container-lowest)] rounded-xl overflow-hidden shadow-ambient-sm">
            <button onClick={() => setShowActiveSessions(true)} className="w-full flex items-center gap-3 px-4 py-3 border-b border-[var(--outline-variant)]/50 hover:bg-[var(--surface-container-low)] transition-colors">
              <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <div className="flex-1 text-left">
                <span className="text-body-md text-[var(--on-surface)]">Active Sessions</span>
                <p className="text-label-sm text-[var(--on-surface-variant)]">{activeSessions.length} active</p>
              </div>
              <svg className="w-5 h-5 text-[var(--outline)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
            </button>
            <button onClick={() => setShowLoginHistory(true)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container-low)] transition-colors">
              <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div className="flex-1 text-left">
                <span className="text-body-md text-[var(--on-surface)]">Login History</span>
                <p className="text-label-sm text-[var(--on-surface-variant)]">{loginHistory.length} records</p>
              </div>
              <svg className="w-5 h-5 text-[var(--outline)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        {/* Data */}
        <div>
          <h2 className="text-label-md text-[var(--on-surface-variant)] uppercase tracking-wider mb-2 px-2">Data</h2>
          <div className="bg-[var(--surface-container-lowest)] rounded-xl overflow-hidden shadow-ambient-sm">
            <button onClick={() => setShowAutoDelete(true)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container-low)] transition-colors">
              <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div className="flex-1 text-left">
                <span className="text-body-md text-[var(--on-surface)]">Auto-Delete Messages</span>
                <p className="text-label-sm text-[var(--on-surface-variant)]">{autoDeleteLabel}</p>
              </div>
              <svg className="w-5 h-5 text-[var(--outline)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        {/* Delete Account */}
        <div>
          <h2 className="text-label-md text-[var(--on-surface-variant)] uppercase tracking-wider mb-2 px-2">Account</h2>
          <div className="bg-[var(--surface-container-lowest)] rounded-xl overflow-hidden shadow-ambient-sm">
            <button
              onClick={() => { setShowDeleteConfirm(true); setDeleteConfirmText(''); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--surface-container-low)]"
            >
              <svg className="w-5 h-5 text-[var(--error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="flex-1 text-body-md text-[var(--error)]">Delete Account</span>
            </button>
          </div>
        </div>

        <div className="text-center py-4">
          <p className="text-label-sm text-[var(--outline)]">Keep your account secure with strong passwords and regular checks</p>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-lg bg-[var(--inverse-surface)] text-[var(--inverse-on-surface)] text-body-sm font-medium shadow-ambient-lg pointer-events-auto">
          {toast}
        </div>
      )}

      {/* Change Password Dialog */}
      {showChangePassword && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl w-full max-w-[340px] p-6">
            <h3 className="text-title-md font-semibold text-[var(--on-surface)] mb-4">Change Password</h3>
            <div className="space-y-3 mb-4">
              {[
                { label: 'Current Password', value: currentPwd, setter: setCurrentPwd, placeholder: 'Enter current password' },
                { label: 'New Password', value: newPwd, setter: setNewPwd, placeholder: 'Enter new password' },
                { label: 'Confirm New Password', value: confirmPwd, setter: setConfirmPwd, placeholder: 'Re-enter new password' },
              ].map((f, i) => (
                <div key={i}>
                  <label className="block text-label-sm text-[var(--on-surface)] mb-1">{f.label}</label>
                  <input type="password" value={f.value} onChange={(e) => f.setter(e.target.value)} placeholder={f.placeholder} className="w-full px-3 py-2.5 bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded-lg text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/60 focus:outline-none focus:border-[var(--secondary)] transition-colors text-sm" />
                </div>
              ))}
              {passwordError && <p className="text-label-sm text-[var(--error)]">{passwordError}</p>}
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowChangePassword(false); setPasswordError(''); }} className="flex-1 py-3 px-4 rounded-xl bg-[var(--surface-container)] text-[var(--on-surface)] text-label-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors">Cancel</button>
              <button onClick={handleChangePassword} className="flex-1 py-3 px-4 rounded-xl bg-[var(--secondary)] text-[var(--on-secondary)] text-label-lg font-medium hover:bg-[var(--secondary)]/90 transition-colors">Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Change Phone Dialog */}
      {showPhoneDialog && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl w-full max-w-[340px] p-6">
            <h3 className="text-title-md font-semibold text-[var(--on-surface)] mb-2">{phoneStep === 'input' ? 'Change Phone' : 'Verify Phone'}</h3>
            <p className="text-body-sm text-[var(--on-surface-variant)] mb-4">{phoneStep === 'input' ? 'Enter your new phone number' : 'Enter the verification code sent to your phone'}</p>
            {phoneStep === 'input' ? (
              <div className="flex gap-2 mb-4">
                <div className="relative">
                  <button onClick={() => setShowCountryPicker(!showCountryPicker)} className="w-24 h-full px-3 py-2.5 bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded-lg text-[var(--on-surface)] text-sm flex items-center justify-between">
                    <span>{phoneCountry}</span>
                    <svg className="w-3 h-3 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {showCountryPicker && (
                    <div className="absolute top-full left-0 mt-1 w-44 bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] rounded-xl shadow-ambient-lg py-1 z-40">
                      {countryCodes.map(c => (
                        <button key={c.code} onClick={() => { setPhoneCountry(c.code); setShowCountryPicker(false); }} className={`w-full flex items-center gap-2 px-3 py-2 text-sm ${phoneCountry === c.code ? 'bg-[var(--primary-fixed)] text-[var(--on-primary-fixed)]' : 'text-[var(--on-surface)] hover:bg-[var(--surface-container-low)]'}`}>
                          <span>{c.flag}</span><span>{c.code}</span><span className="ml-auto text-[var(--on-surface-variant)]">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <input type="tel" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} placeholder="800 000 0000" className="flex-1 px-3 py-2.5 bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded-lg text-[var(--on-surface)] text-sm focus:outline-none focus:border-[var(--secondary)]" />
              </div>
            ) : (
              <div className="flex gap-2 mb-4">
                <input type="text" value={phoneCode} onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6-digit code" maxLength={6} className="flex-1 px-3 py-2.5 bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded-lg text-[var(--on-surface)] text-sm tracking-[0.2em] text-center focus:outline-none focus:border-[var(--secondary)]" />
                <button onClick={handleSendPhoneCode} disabled={phoneCountdown > 0} className={`px-4 py-2.5 rounded-lg text-label-sm font-medium whitespace-nowrap ${phoneCountdown > 0 ? 'bg-[var(--surface-container)] text-[var(--on-surface-variant)]' : 'bg-[var(--secondary)] text-[var(--on-secondary)]'}`}>{phoneCountdown > 0 ? `${phoneCountdown}s` : 'Resend'}</button>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => { setShowPhoneDialog(false); setPhoneStep('input'); setPhoneCountdown(0); }} className="flex-1 py-3 px-4 rounded-xl bg-[var(--surface-container)] text-[var(--on-surface)] text-label-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors">Cancel</button>
              {phoneStep === 'input' ? (
                <button onClick={handleSendPhoneCode} disabled={!phoneInput.trim()} className={`flex-1 py-3 px-4 rounded-xl text-label-lg font-medium transition-colors ${phoneInput.trim() ? 'bg-[var(--secondary)] text-[var(--on-secondary)]' : 'bg-[var(--surface-container)] text-[var(--on-surface-variant)] cursor-not-allowed'}`}>Send Code</button>
              ) : (
                <button onClick={handleVerifyPhone} disabled={phoneCode.length < 4} className={`flex-1 py-3 px-4 rounded-xl text-label-lg font-medium transition-colors ${phoneCode.length >= 4 ? 'bg-[var(--secondary)] text-[var(--on-secondary)]' : 'bg-[var(--surface-container)] text-[var(--on-surface-variant)] cursor-not-allowed'}`}>Verify</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Change Email Dialog */}
      {showEmailDialog && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl w-full max-w-[340px] p-6">
            <h3 className="text-title-md font-semibold text-[var(--on-surface)] mb-2">{emailStep === 'input' ? 'Change Email' : 'Verify Email'}</h3>
            <p className="text-body-sm text-[var(--on-surface-variant)] mb-4">{emailStep === 'input' ? 'Enter your new email address' : 'Enter the verification code sent to your email'}</p>
            {emailStep === 'input' ? (
              <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} placeholder="your@email.com" className="w-full px-3 py-2.5 bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded-lg text-[var(--on-surface)] text-sm mb-4 focus:outline-none focus:border-[var(--secondary)]" />
            ) : (
              <div className="flex gap-2 mb-4">
                <input type="text" value={emailCode} onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6-digit code" maxLength={6} className="flex-1 px-3 py-2.5 bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded-lg text-[var(--on-surface)] text-sm tracking-[0.2em] text-center focus:outline-none focus:border-[var(--secondary)]" />
                <button onClick={handleSendEmailCode} disabled={emailCountdown > 0} className={`px-4 py-2.5 rounded-lg text-label-sm font-medium whitespace-nowrap ${emailCountdown > 0 ? 'bg-[var(--surface-container)] text-[var(--on-surface-variant)]' : 'bg-[var(--secondary)] text-[var(--on-secondary)]'}`}>{emailCountdown > 0 ? `${emailCountdown}s` : 'Resend'}</button>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => { setShowEmailDialog(false); setEmailStep('input'); setEmailCountdown(0); }} className="flex-1 py-3 px-4 rounded-xl bg-[var(--surface-container)] text-[var(--on-surface)] text-label-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors">Cancel</button>
              {emailStep === 'input' ? (
                <button onClick={handleSendEmailCode} disabled={!emailInput.trim()} className={`flex-1 py-3 px-4 rounded-xl text-label-lg font-medium transition-colors ${emailInput.trim() ? 'bg-[var(--secondary)] text-[var(--on-secondary)]' : 'bg-[var(--surface-container)] text-[var(--on-surface-variant)] cursor-not-allowed'}`}>Send Code</button>
              ) : (
                <button onClick={handleVerifyEmail} disabled={emailCode.length < 4} className={`flex-1 py-3 px-4 rounded-xl text-label-lg font-medium transition-colors ${emailCode.length >= 4 ? 'bg-[var(--secondary)] text-[var(--on-secondary)]' : 'bg-[var(--surface-container)] text-[var(--on-surface-variant)] cursor-not-allowed'}`}>Verify</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Unbind Quick Login Confirmation */}
      {unbindConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl w-full max-w-[320px] p-6">
            <h3 className="text-title-md font-semibold text-[var(--on-surface)] mb-2">Unbind {quickLogins.find(q => q.id === unbindConfirm)?.name}</h3>
            <p className="text-body-md text-[var(--on-surface-variant)] mb-6">You will no longer be able to sign in with {quickLogins.find(q => q.id === unbindConfirm)?.name}. Are you sure?</p>
            <div className="flex gap-3">
              <button onClick={() => setUnbindConfirm(null)} className="flex-1 py-3 px-4 rounded-xl bg-[var(--surface-container)] text-[var(--on-surface)] text-label-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors">Cancel</button>
              <button onClick={() => handleUnbind(unbindConfirm)} className="flex-1 py-3 px-4 rounded-xl bg-[var(--error)] text-[var(--on-error)] text-label-lg font-medium hover:opacity-90 transition-colors">Unbind</button>
            </div>
          </div>
        </div>
      )}

      {/* Active Sessions Sheet */}
      {showActiveSessions && (
        <div className="absolute inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowActiveSessions(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-[var(--surface-container-lowest)] rounded-t-3xl animate-in slide-in-from-bottom duration-200 max-h-[70vh] flex flex-col">
            <div className="px-5 py-4 border-b border-[var(--outline-variant)] flex items-center justify-between">
              <h3 className="text-title-md font-semibold text-[var(--on-surface)]">Active Sessions</h3>
              <button onClick={() => setShowActiveSessions(false)} className="p-2 -mr-2 hover:bg-[var(--surface-container)] rounded-full transition-colors">
                <svg className="w-5 h-5 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {activeSessions.map((s, i) => (
                <div key={s.id} className={`flex items-center gap-3 px-5 py-3 ${i !== activeSessions.length - 1 ? 'border-b border-[var(--outline-variant)]/50' : ''}`}>
                  <div className="w-10 h-10 bg-[var(--primary-container)] rounded-full flex items-center justify-center text-[var(--on-primary-container)] font-semibold text-sm">{s.device === 'iPhone 15' ? 'IP' : 'MB'}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-body-md text-[var(--on-surface)] font-medium">{s.device}</span>
                      {s.isCurrent && <span className="px-1.5 py-0.5 text-[10px] leading-none bg-[var(--secondary)] text-[var(--on-secondary)] rounded-full font-medium">Current</span>}
                    </div>
                    <p className="text-label-sm text-[var(--on-surface-variant)]">{s.location} · {s.os}</p>
                    <p className="text-label-xs text-[var(--outline)]">{s.lastActive}</p>
                  </div>
                  {!s.isCurrent && (
                    <button onClick={() => handleTerminateSession(s.id)} className="px-3 py-1 rounded-full text-label-sm font-medium text-[var(--error)] border border-[var(--error)] hover:bg-[var(--error)]/10 transition-colors whitespace-nowrap">Log Out</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Terminate Session Confirmation */}
      {terminateSessionId && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-[60] px-4">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl w-full max-w-[320px] p-6">
            <h3 className="text-title-md font-semibold text-[var(--on-surface)] mb-2">Log Out Device</h3>
            <p className="text-body-md text-[var(--on-surface-variant)] mb-6">
              Are you sure you want to log out this device?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setTerminateSessionId(null)} className="flex-1 py-3 px-4 rounded-xl bg-[var(--surface-container)] text-[var(--on-surface)] text-label-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors">Cancel</button>
              <button onClick={handleConfirmTerminate} className="flex-1 py-3 px-4 rounded-xl bg-[var(--error)] text-[var(--on-error)] text-label-lg font-medium hover:opacity-90 transition-colors">Log Out</button>
            </div>
          </div>
        </div>
      )}

      {/* Login History Sheet */}
      {showLoginHistory && (
        <div className="absolute inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowLoginHistory(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-[var(--surface-container-lowest)] rounded-t-3xl animate-in slide-in-from-bottom duration-200 max-h-[70vh] flex flex-col">
            <div className="px-5 py-4 border-b border-[var(--outline-variant)] flex items-center justify-between">
              <h3 className="text-title-md font-semibold text-[var(--on-surface)]">Login History</h3>
              <button onClick={() => setShowLoginHistory(false)} className="p-2 -mr-2 hover:bg-[var(--surface-container)] rounded-full transition-colors">
                <svg className="w-5 h-5 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loginHistory.map((entry, i) => (
                <div key={entry.id} className={`flex items-center gap-3 px-5 py-3 ${i !== loginHistory.length - 1 ? 'border-b border-[var(--outline-variant)]/50' : ''}`}>
                  <div className="w-10 h-10 bg-[var(--surface-container-high)] rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={entry.icon} />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body-md text-[var(--on-surface)]">{entry.device} · {entry.location}</p>
                    <p className="text-label-sm text-[var(--on-surface-variant)]">{entry.time} · IP {entry.ip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Auto-Delete Selection Sheet */}
      {showAutoDelete && (
        <div className="absolute inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAutoDelete(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-[var(--surface-container-lowest)] rounded-t-3xl animate-in slide-in-from-bottom duration-200">
            <div className="px-5 py-4 border-b border-[var(--outline-variant)]">
              <h3 className="text-title-md font-semibold text-[var(--on-surface)]">Auto-Delete Messages</h3>
            </div>
            <div className="py-2 max-h-[360px] overflow-y-auto">
              {autoDeleteOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => { setAutoDeleteValue(option.value); setAutoDeleteLabel(option.label); setShowAutoDelete(false); }}
                  className="w-full flex items-start gap-3 px-5 py-4 hover:bg-[var(--surface-container-low)] transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-body-md text-[var(--on-surface)] font-medium">{option.label}</p>
                    <p className="text-label-sm text-[var(--on-surface-variant)] mt-0.5">{option.hint}</p>
                  </div>
                  {autoDeleteValue === option.value && (
                    <svg className="w-5 h-5 text-[var(--secondary)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  )}
                </button>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-[var(--outline-variant)]">
              <button onClick={() => setShowAutoDelete(false)} className="w-full py-3 rounded-xl bg-[var(--surface-container)] text-[var(--on-surface)] text-label-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl w-full max-w-[320px] p-6">
            <h3 className="text-title-md font-semibold text-[var(--on-surface)] mb-2">Delete Account</h3>
            <p className="text-body-md text-[var(--on-surface-variant)] mb-4">
              This action is irreversible. All your data, messages, and contacts will be permanently removed.
            </p>
            <p className="text-label-sm text-[var(--on-surface-variant)] mb-3">
              Type <span className="font-bold text-[var(--error)]">DELETE</span> to confirm
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder='Type "DELETE" here'
              className="w-full px-3 py-2.5 bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded-lg text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/60 focus:outline-none focus:border-[var(--error)] transition-colors text-sm mb-6"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); }}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--surface-container)] text-[var(--on-surface)] text-label-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE'}
                className={`flex-1 py-3 px-4 rounded-xl text-label-lg font-medium transition-all ${
                  deleteConfirmText === 'DELETE'
                    ? 'bg-[var(--error)] text-[var(--on-error)] hover:opacity-90'
                    : 'bg-[var(--surface-container)] text-[var(--on-surface-variant)] cursor-not-allowed'
                }`}
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

const Component = SecurityPage;
export default Component;
