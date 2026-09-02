/**
 * @name Forgot Password
 * @description Password recovery with phone/email verification and multi-step flow
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState, useRef, useEffect } from 'react';
import '../../themes/equatorial-minimalism/globals.css';
import './style.css';

type Step = 1 | 2 | 3 | 4;

const ForgotPasswordPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'phone' | 'email'>('phone');
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [countryCode, setCountryCode] = useState('+234');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [passwordError, setPasswordError] = useState('');
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

  const getPasswordStrength = (pwd: string): { strength: number; label: string; color: string } => {
    if (pwd.length === 0) return { strength: 0, label: '', color: '' };
    if (pwd.length < 8 || !/[A-Za-z]/.test(pwd) || !/[0-9]/.test(pwd)) return { strength: 1, label: 'Weak', color: 'bg-red-500' };
    if (pwd.length < 10 || !/[A-Z]/.test(pwd) || !/[!@#$%^&*]/.test(pwd)) return { strength: 2, label: 'Medium', color: 'bg-yellow-500' };
    return { strength: 3, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const accountValue = activeTab === 'phone' ? phoneNumber : email;
  const canSendCode = accountValue.trim().length > 0 && !codeSent;

  const handleSendCode = () => {
    if (!canSendCode) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCodeSent(true);
      setCurrentStep(2);
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
    }, 1000);
  };

  const canVerify = verificationCode.length >= 6;

  const handleVerify = () => {
    if (!canVerify) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep(3);
    }, 1000);
  };

  const passwordsValid = newPassword.length >= 6 && newPassword === confirmPassword;

  const handleResetPassword = () => {
    if (!passwordsValid) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep(4);
    }, 1500);
  };

  const handleConfirmPasswordChange = (val: string) => {
    setConfirmPassword(val);
    if (val && val !== newPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  const resetAll = () => {
    setPhoneNumber('');
    setEmail('');
    setVerificationCode('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setCurrentStep(1);
    setCodeSent(false);
    setCountdown(60);
  };

  const stepSubtitles: Record<Step, string> = {
    1: 'Enter your phone number or email to receive a reset code',
    2: 'Enter the 6-digit verification code sent to your device',
    3: 'Create a new password for your account',
    4: '',
  };

  return (
    <div className="h-full bg-[var(--surface)] flex flex-col overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[var(--primary)]/3 to-transparent" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--secondary)]/5 rounded-full blur-3xl" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 pb-safe relative z-10">
        <div className="flex items-center mb-6">
          <button
            onClick={() => {
              if (currentStep === 4) { resetAll(); }
              console.log('Navigate back');
            }}
            className="p-2 -ml-2 hover:bg-[var(--surface-container)] rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 bg-[var(--primary)] rounded-xl flex items-center justify-center shadow-ambient-md">
            <span className="text-[var(--on-primary)] text-2xl font-bold">S</span>
          </div>
          <h1 className="text-headline-md text-[var(--primary)] mb-2">Forgot Password</h1>
          {currentStep < 4 && (
            <p className="text-body-sm text-[var(--on-surface-variant)]">{stepSubtitles[currentStep]}</p>
          )}
        </div>

        {/* Step Indicators */}
        {currentStep < 4 && (
          <div className="flex items-center justify-center gap-3 mb-5">
            {([1, 2, 3] as Step[]).map((step) => (
              <div key={step} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-label-sm font-semibold transition-all ${
                    step < currentStep
                      ? 'bg-[var(--secondary)] text-[var(--on-secondary)]'
                      : step === currentStep
                        ? 'bg-[var(--primary)] text-[var(--on-primary)]'
                        : 'bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]'
                  }`}
                >
                  {step < currentStep ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && <div className={`w-8 h-0.5 ${step < currentStep ? 'bg-[var(--secondary)]' : 'bg-[var(--outline-variant)]'}`} />}
              </div>
            ))}
          </div>
        )}

        {/* Card */}
        <div className="bg-[var(--surface-container-low)] rounded-2xl shadow-ambient-lg p-5">
          {currentStep === 4 ? (
            /* Step 4: Success */
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-title-md font-semibold text-[var(--on-surface)] mb-2">Password Reset Successful!</h2>
              <p className="text-body-sm text-[var(--on-surface-variant)] mb-8">
                Your password has been updated. Please sign in with your new password.
              </p>
              <button
                onClick={() => console.log('Navigate to login')}
                className="w-full py-3 rounded-lg text-label-md font-medium bg-[var(--secondary)] text-[var(--on-secondary)] hover:bg-[var(--secondary)]/90 shadow-ambient transition-all"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <>
              {currentStep === 1 && (
                /* Tab Navigation — only on step 1 */
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
              )}

              <div className="space-y-4">
                {/* Step 1: Account entry */}
                {currentStep === 1 && (
                  <>
                    {activeTab === 'phone' ? (
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
                    ) : (
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
                    )}

                    <button
                      type="button"
                      onClick={handleSendCode}
                      disabled={!canSendCode || isLoading}
                      className={`w-full py-3 rounded-lg text-label-md font-medium transition-all ${
                        canSendCode && !isLoading
                          ? 'bg-[var(--secondary)] text-[var(--on-secondary)] hover:bg-[var(--secondary)]/90 shadow-ambient'
                          : 'bg-[var(--surface-container)] text-[var(--on-surface-variant)] cursor-not-allowed'
                      }`}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Sending...
                        </span>
                      ) : codeSent ? (
                        `Resend (${countdown}s)`
                      ) : (
                        'Send Reset Code'
                      )}
                    </button>
                  </>
                )}

                {/* Step 2: Verification code */}
                {currentStep === 2 && (
                  <>
                    <div>
                      <label className="block text-label-sm text-[var(--on-surface)] mb-1.5">Verification Code</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="Enter 6-digit code"
                          maxLength={6}
                          className="flex-1 px-3 py-2.5 bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] rounded-lg text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/60 focus:outline-none focus:border-[var(--secondary)] transition-colors text-sm tracking-[0.3em] text-center"
                        />
                        <button
                          type="button"
                          onClick={handleSendCode}
                          disabled={codeSent}
                          className={`px-4 py-2.5 rounded-lg text-label-sm font-medium transition-all whitespace-nowrap ${
                            codeSent
                              ? 'bg-[var(--surface-container)] text-[var(--on-surface-variant)] cursor-not-allowed'
                              : 'bg-[var(--secondary)] text-[var(--on-secondary)] hover:bg-[var(--secondary)]/90'
                          }`}
                        >
                          {codeSent ? `${countdown}s` : 'Resend'}
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleVerify}
                      disabled={!canVerify || isLoading}
                      className={`w-full py-3 rounded-lg text-label-md font-medium transition-all ${
                        canVerify && !isLoading
                          ? 'bg-[var(--secondary)] text-[var(--on-secondary)] hover:bg-[var(--secondary)]/90 shadow-ambient'
                          : 'bg-[var(--surface-container)] text-[var(--on-surface-variant)] cursor-not-allowed'
                      }`}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Verifying...
                        </span>
                      ) : (
                        'Verify & Next'
                      )}
                    </button>
                  </>
                )}

                {/* Step 3: New password */}
                {currentStep === 3 && (
                  <>
                    <div>
                      <label className="block text-label-sm text-[var(--on-surface)] mb-1.5">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => { setNewPassword(e.target.value); setPasswordError(''); }}
                        placeholder="Enter new password"
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

                    <div>
                      <label className="block text-label-sm text-[var(--on-surface)] mb-1.5">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                        placeholder="Re-enter new password"
                        className={`w-full px-3 py-2.5 bg-[var(--surface-container-lowest)] border rounded-lg text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/60 focus:outline-none transition-colors text-sm ${
                          passwordError
                            ? 'border-[var(--error)] focus:border-[var(--error)]'
                            : confirmPassword && confirmPassword === newPassword
                              ? 'border-green-500 focus:border-green-500'
                              : 'border-[var(--outline-variant)] focus:border-[var(--secondary)]'
                        }`}
                      />
                      {passwordError && (
                        <p className="mt-1 text-label-xs text-[var(--error)]">{passwordError}</p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleResetPassword}
                      disabled={!passwordsValid || isLoading}
                      className={`w-full py-3 rounded-lg text-label-md font-medium transition-all ${
                        passwordsValid && !isLoading
                          ? 'bg-[var(--secondary)] text-[var(--on-secondary)] hover:bg-[var(--secondary)]/90 shadow-ambient'
                          : 'bg-[var(--surface-container)] text-[var(--on-surface-variant)] cursor-not-allowed'
                      }`}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Resetting...
                        </span>
                      ) : (
                        'Reset Password'
                      )}
                    </button>
                  </>
                )}
              </div>

              {/* Back to login link — steps 1-3 */}
              <div className="mt-5 text-center">
                <button
                  onClick={() => console.log('Navigate to login')}
                  className="text-label-sm text-[var(--secondary)] font-medium hover:underline"
                >
                  Back to Sign In
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Component = ForgotPasswordPage;
export default Component;
