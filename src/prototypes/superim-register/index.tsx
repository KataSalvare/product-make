/**
 * @name Register Page
 * @description User registration with phone/email and verification
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { useDynamicContext, useIsLoggedIn, useUserWallets } from '@dynamic-labs/sdk-react-core';
import '../../themes/equatorial-minimalism/globals.css';
import './style.css';
import { isDynamicConfigured } from '../../integrations/dynamic/config';

const DynamicRegistrationBridge: React.FC<{
  request: number;
  onWalletCreated: (address: string) => void;
}> = ({ request, onWalletCreated }) => {
  const { sdkHasLoaded, primaryWallet, setShowAuthFlow } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();
  const userWallets = useUserWallets();
  const walletAddress = primaryWallet?.address ?? userWallets[0]?.address;

  useEffect(() => {
    if (request > 0 && sdkHasLoaded && !isLoggedIn) {
      setShowAuthFlow(true);
    }
  }, [isLoggedIn, request, sdkHasLoaded, setShowAuthFlow]);

  useEffect(() => {
    if (request > 0 && isLoggedIn && walletAddress) {
      onWalletCreated(walletAddress);
    }
  }, [isLoggedIn, onWalletCreated, request, walletAddress]);

  return null;
};

const RegisterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [countryCode, setCountryCode] = useState('+234');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [dynamicRegistrationRequest, setDynamicRegistrationRequest] = useState(0);
  const [createdWalletAddress, setCreatedWalletAddress] = useState<string | null>(null);
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

  const handleSendCode = () => {
    setCodeSent(true);
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCodeSent(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isDynamicConfigured) {
      setDynamicRegistrationRequest((request) => request + 1);
      return;
    }

    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const handleDynamicWalletCreated = useCallback((address: string) => {
    setCreatedWalletAddress(address);
  }, []);

  const getPasswordStrength = (pwd: string): { strength: number; label: string; color: string } => {
    if (pwd.length === 0) return { strength: 0, label: '', color: '' };
    if (pwd.length < 6) return { strength: 1, label: 'Weak', color: 'bg-red-500' };
    if (pwd.length < 10 || !/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return { strength: 2, label: 'Medium', color: 'bg-yellow-500' };
    return { strength: 3, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="h-full bg-[var(--surface)] flex flex-col overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[var(--primary)]/3 to-transparent" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--secondary)]/5 rounded-full blur-3xl" />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6 pb-safe relative z-10">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button className="p-2 -ml-2 hover:bg-[var(--surface-container)] rounded-full transition-colors">
            <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-headline-md text-[var(--primary)] mb-2">Create Account</h1>
          <p className="text-body-sm text-[var(--on-surface-variant)]">Join SuperIM today</p>
        </div>

        {isDynamicConfigured && (
          <DynamicRegistrationBridge
            request={dynamicRegistrationRequest}
            onWalletCreated={handleDynamicWalletCreated}
          />
        )}

        {createdWalletAddress && (
          <div className="mb-4 rounded-xl border border-[var(--success)]/30 bg-[var(--surface-container-lowest)] px-4 py-3 text-sm text-[var(--on-surface)]">
            <strong className="block">Account created · Wallet ready</strong>
            <span className="mt-1 block break-all text-xs">{createdWalletAddress}</span>
            <span className="mt-1 block text-xs opacity-80">Base Mainnet Embedded Wallet created by Dynamic.</span>
          </div>
        )}

        {/* Register Card */}
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
                  <label className="block text-label-sm text-[var(--on-surface)] mb-1.5">Verification Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Enter code"
                      maxLength={6}
                      className="flex-1 px-3 py-2.5 bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] rounded-lg text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/60 focus:outline-none focus:border-[var(--secondary)] transition-colors text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleSendCode}
                      disabled={codeSent}
                      className={`px-3 py-2.5 rounded-lg text-label-sm font-medium transition-all whitespace-nowrap ${
                        codeSent
                          ? 'bg-[var(--surface-container)] text-[var(--on-surface-variant)] cursor-not-allowed'
                          : 'bg-[var(--secondary)] text-[var(--on-secondary)] hover:bg-[var(--secondary)]/90'
                      }`}
                    >
                      {codeSent ? `${countdown}s` : 'Send Code'}
                    </button>
                  </div>
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
                  <label className="block text-label-sm text-[var(--on-surface)] mb-1.5">Verification Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Enter code"
                      maxLength={6}
                      className="flex-1 px-3 py-2.5 bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] rounded-lg text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/60 focus:outline-none focus:border-[var(--secondary)] transition-colors text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleSendCode}
                      disabled={codeSent}
                      className={`px-3 py-2.5 rounded-lg text-label-sm font-medium transition-all whitespace-nowrap ${
                        codeSent
                          ? 'bg-[var(--surface-container)] text-[var(--on-surface-variant)] cursor-not-allowed'
                          : 'bg-[var(--secondary)] text-[var(--on-secondary)] hover:bg-[var(--secondary)]/90'
                      }`}
                    >
                      {codeSent ? `${countdown}s` : 'Send Code'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Password */}
            <div>
              <label className="block text-label-sm text-[var(--on-surface)] mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full px-3 py-2.5 bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] rounded-lg text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/60 focus:outline-none focus:border-[var(--secondary)] transition-colors text-sm"
              />
              {passwordStrength.strength > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          level <= passwordStrength.strength ? passwordStrength.color : 'bg-[var(--outline-variant)]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-label-xs ${passwordStrength.color.replace('bg-', 'text-')}`}>
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => setAgreeTerms(!agreeTerms)}
                className={`w-6 h-6 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  agreeTerms
                    ? 'bg-[var(--primary)] border-[var(--primary)]'
                    : 'border-[var(--outline)]'
                }`}
              >
                {agreeTerms && (
                  <svg className="w-4 h-4 text-[var(--on-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <label className="text-label-sm text-[var(--on-surface-variant)] leading-tight cursor-pointer" onClick={() => setAgreeTerms(!agreeTerms)}>
                I agree to{' '}
                <a href="#" className="text-[var(--secondary)] hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-[var(--secondary)] hover:underline">Privacy Policy</a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !agreeTerms}
              className={`w-full py-3 rounded-lg text-label-md font-medium transition-all ${
                isLoading || !agreeTerms
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
                  Creating...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
            {isDynamicConfigured && (
              <p className="text-center text-xs text-[var(--on-surface-variant)]">
                Dynamic will create your Base Mainnet wallet after sign-up.
              </p>
            )}
          </form>

          {/* Sign In Link */}
          <div className="mt-5 text-center">
            <span className="text-label-sm text-[var(--on-surface-variant)]">
              Already have an account?{' '}
              <a href="#" className="text-[var(--secondary)] font-medium hover:underline">Sign In</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Component = RegisterPage;
export default Component;
