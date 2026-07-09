/**
 * @name Login Page
 * @description User authentication with phone, email, and social login options
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState, useRef, useEffect } from 'react';
import '../../themes/equatorial-minimalism/globals.css';
import './style.css';

const Component: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('+234');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const countryPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryPickerRef.current && !countryPickerRef.current.contains(e.target as Node)) {
        setShowCountryPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const countryCodes = [
    { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
    { code: '+27', flag: '🇿🇦', name: 'South Africa' },
    { code: '+254', flag: '🇰🇪', name: 'Kenya' },
    { code: '+255', flag: '🇹🇿', name: 'Tanzania' },
    { code: '+233', flag: '🇬🇭', name: 'Ghana' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="h-full bg-[var(--surface)] flex flex-col overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[var(--primary)]/3 to-transparent" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--secondary)]/5 rounded-full blur-3xl" />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6 pb-safe relative z-10">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 bg-[var(--primary)] rounded-xl flex items-center justify-center shadow-ambient-md">
            <span className="text-[var(--on-primary)] text-2xl font-bold">S</span>
          </div>
          <h1 className="text-headline-md text-[var(--primary)] mb-2">Welcome Back</h1>
          <p className="text-body-sm text-[var(--on-surface-variant)]">Sign in to continue your conversation</p>
        </div>

        {/* Login Card */}
        <div className="bg-[var(--surface-container-low)] rounded-2xl shadow-ambient-lg p-5">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-5 p-1 bg-[var(--surface-container)] rounded-lg">
            <button
              onClick={() => setActiveTab('phone')}
              className={`flex-1 py-2 px-3 rounded-md text-label-sm transition-all duration-200 ${
                activeTab === 'phone'
                  ? 'bg-[var(--primary)] text-[var(--on-primary)]'
                  : 'text-[var(--on-surface)] hover:bg-[var(--surface-container-high)]'
              }`}
            >
              Phone
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`flex-1 py-2 px-3 rounded-md text-label-sm transition-all duration-200 ${
                activeTab === 'email'
                  ? 'bg-[var(--primary)] text-[var(--on-primary)]'
                  : 'text-[var(--on-surface)] hover:bg-[var(--surface-container-high)]'
              }`}
            >
              Email
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'phone' ? (
              <>
                <div>
                  <label className="block text-label-sm text-[var(--on-surface)] mb-1.5">Phone Number</label>
                  <div className="flex gap-2">
                    <div className="relative" ref={countryPickerRef}>
                      <button
                        type="button"
                        onClick={() => setShowCountryPicker(!showCountryPicker)}
                        className="w-24 h-full px-3 py-2.5 bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] rounded-lg text-[var(--on-surface)] text-sm focus:outline-none focus:border-[var(--secondary)] transition-colors flex items-center justify-between"
                      >
                        <span>{countryCode}</span>
                        <svg className={`w-4 h-4 text-[var(--on-surface-variant)] transition-transform ${showCountryPicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {showCountryPicker && (
                        <div className="absolute top-full left-0 mt-1 w-48 bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] rounded-xl shadow-ambient-lg py-2 z-30">
                          {countryCodes.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => { setCountryCode(c.code); setShowCountryPicker(false); }}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--surface-container-low)] transition-colors text-sm ${
                                countryCode === c.code ? 'bg-[var(--primary-fixed)] text-[var(--on-primary-fixed)]' : 'text-[var(--on-surface)]'
                              }`}
                            >
                              <span>{c.flag}</span>
                              <span>{c.code}</span>
                              <span className="text-[var(--on-surface-variant)] ml-auto">{c.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="800 000 0000"
                      className="flex-1 px-3 py-2.5 bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] rounded-lg text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/60 focus:outline-none focus:border-[var(--secondary)] transition-colors text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-label-sm text-[var(--on-surface)] mb-1.5">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3 py-2.5 bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] rounded-lg text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/60 focus:outline-none focus:border-[var(--secondary)] transition-colors text-sm"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-label-sm text-[var(--on-surface)] mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-3 py-2.5 bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] rounded-lg text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/60 focus:outline-none focus:border-[var(--secondary)] transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-label-sm text-[var(--on-surface)] mb-1.5">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3 py-2.5 bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] rounded-lg text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/60 focus:outline-none focus:border-[var(--secondary)] transition-colors text-sm"
                  />
                </div>
              </>
            )}

            {/* Forgot Password */}
            <div className="flex justify-end">
              <a href="#" className="text-label-sm text-[var(--secondary)] hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit Button - 样式与注册页对齐 */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg text-label-md font-medium transition-all ${
                isLoading
                  ? 'bg-[var(--surface-container)] text-[var(--on-surface-variant)] cursor-not-allowed'
                  : 'bg-[var(--secondary)] text-[var(--on-secondary)] hover:bg-[var(--secondary)]/90 shadow-ambient'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[var(--outline-variant)]" />
            <span className="text-label-xs text-[var(--on-surface-variant)]">Or continue with</span>
            <div className="flex-1 h-px bg-[var(--outline-variant)]" />
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-2.5">
            <button className="flex items-center justify-center gap-2 px-3 py-2.5 border border-[var(--outline-variant)] rounded-lg text-[var(--on-surface)] hover:border-[var(--secondary)] hover:bg-[var(--surface-container)] transition-all text-label-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 px-3 py-2.5 border border-[var(--outline-variant)] rounded-lg text-[var(--on-surface)] hover:border-[var(--secondary)] hover:bg-[var(--surface-container)] transition-all text-label-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Apple
            </button>
          </div>

          {/* Footer - 移到卡片内 */}
          <div className="mt-5 text-center">
            <span className="text-label-sm text-[var(--on-surface-variant)]">
              Don't have an account?{' '}
              <a href="#" className="text-[var(--secondary)] font-medium hover:underline">Sign up</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Component;
