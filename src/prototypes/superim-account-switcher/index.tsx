/**
 * @name AccountSwitcher Page
 * @description Manage multiple logged-in accounts and switch between them
 * @mode axure
 */

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../themes/equatorial-minimalism/globals.css';
import './style.css';

interface Account {
  id: string;
  name: string;
  handle: string;
  initials: string;
  isCurrent: boolean;
  unreadCount: number;
}

const MAX_ACCOUNTS = 3;

const countryCodes = [
  { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+27', flag: '🇿🇦', name: 'South Africa' },
  { code: '+254', flag: '🇰🇪', name: 'Kenya' },
  { code: '+255', flag: '🇹🇿', name: 'Tanzania' },
  { code: '+233', flag: '🇬🇭', name: 'Ghana' },
];

const mockAccounts: Account[] = [
  { id: '1', name: 'John Doe', handle: '@john.doe', initials: 'JD', isCurrent: true, unreadCount: 0 },
  { id: '2', name: 'Work Account', handle: '@john.work', initials: 'WK', isCurrent: false, unreadCount: 5 },
];

const AccountSwitcherPage: React.FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [showAddAccount, setShowAddAccount] = useState(false);

  // Add account flow
  const [addStep, setAddStep] = useState<'credential' | 'password'>('credential');
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [countryCode, setCountryCode] = useState('+234');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const countryPickerRef = useRef<HTMLDivElement>(null);

  const currentAccount = accounts.find((a) => a.isCurrent);
  const otherAccounts = accounts.filter((a) => !a.isCurrent);
  const canAddAccount = accounts.length < MAX_ACCOUNTS;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryPickerRef.current && !countryPickerRef.current.contains(e.target as Node)) {
        setShowCountryPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const resetAddFlow = () => {
    setShowAddAccount(false);
    setAddStep('credential');
    setLoginMethod('phone');
    setCountryCode('+234');
    setPhoneNumber('');
    setEmail('');
    setPassword('');
    setIsLoading(false);
    setShowCountryPicker(false);
  };

  const switchAccount = (id: string) => {
    setAccounts((prev) =>
      prev.map((a) => ({ ...a, isCurrent: a.id === id, unreadCount: a.id === id ? 0 : a.unreadCount }))
    );
  };

  const credentialValue = loginMethod === 'phone'
    ? `${countryCode} ${phoneNumber}`.trim()
    : email.trim();

  const canProceedToPassword = loginMethod === 'phone'
    ? phoneNumber.trim().length > 0
    : email.trim().length > 0 && email.includes('@');

  const handleNext = () => {
    if (!canProceedToPassword) return;
    setAddStep('password');
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || !canAddAccount) return;

    setIsLoading(true);
    setTimeout(() => {
      const displayValue = credentialValue;
      const newAccount: Account = {
        id: `a${Date.now()}`,
        name: displayValue,
        handle: displayValue,
        initials: displayValue.slice(0, 2).toUpperCase(),
        isCurrent: false,
        unreadCount: 0,
      };
      setAccounts((prev) => [...prev, newAccount]);
      resetAddFlow();
    }, 1200);
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
            <h1 className="text-headline-md text-[var(--primary)]">Accounts</h1>
          </div>
        </div>
      </header>

      {/* Current Account */}
      {currentAccount && (
        <div className="px-4 pt-4">
          <h2 className="text-label-md text-[var(--on-surface-variant)] uppercase tracking-wider mb-2 px-2">
            Current Account
          </h2>
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl p-4 shadow-ambient-sm border border-[var(--outline-variant)]/50">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-[var(--primary)] rounded-full flex items-center justify-center text-[var(--on-primary)] text-lg font-bold">
                {currentAccount.initials}
              </div>
              <div className="flex-1">
                <p className="text-body-lg font-semibold text-[var(--on-surface)]">{currentAccount.name}</p>
                <p className="text-body-md text-[var(--on-surface-variant)]">{currentAccount.handle}</p>
              </div>
              <span className="px-3 py-1 bg-[var(--secondary-container)] text-[var(--on-secondary-container)] text-label-sm rounded-full">
                Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Other Accounts */}
      <div className="flex-1 overflow-y-auto px-4 pt-4">
        <h2 className="text-label-md text-[var(--on-surface-variant)] uppercase tracking-wider mb-2 px-2">
          Other Accounts
        </h2>
        <div className="bg-[var(--surface-container-lowest)] rounded-2xl shadow-ambient-sm border border-[var(--outline-variant)]/50 overflow-hidden">
          {otherAccounts.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-body-md text-[var(--on-surface-variant)]">No other accounts logged in</p>
            </div>
          ) : (
            otherAccounts.map((account, index) => (
              <button
                key={account.id}
                onClick={() => switchAccount(account.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  index !== otherAccounts.length - 1 ? 'border-b border-[var(--outline-variant)]/50' : ''
                } hover:bg-[var(--surface-container-low)]`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-[var(--primary-container)] rounded-full flex items-center justify-center text-[var(--on-primary-container)] font-semibold">
                    {account.initials}
                  </div>
                  {account.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-[var(--error)] text-[var(--on-error)] rounded-full text-label-xs flex items-center justify-center border-2 border-[var(--surface-container-lowest)]">
                      {account.unreadCount > 99 ? '99+' : account.unreadCount}
                    </div>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-body-md font-semibold text-[var(--on-surface)]">{account.name}</p>
                  <p className="text-label-sm text-[var(--on-surface-variant)]">{account.handle}</p>
                </div>
                <svg className="w-5 h-5 text-[var(--outline)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))
          )}
        </div>

        {/* Account limit hint */}
        {!canAddAccount && (
          <p className="text-label-sm text-[var(--on-surface-variant)] mt-3 px-2">
            Maximum {MAX_ACCOUNTS} accounts reached. Remove an account to add a new one.
          </p>
        )}
      </div>

      {/* Add Account Button */}
      <div className="bg-[var(--surface-container-low)] border-t border-[var(--outline-variant)] px-4 py-4 safe-area-pb">
        <button
          onClick={() => canAddAccount && setShowAddAccount(true)}
          disabled={!canAddAccount}
          className={`w-full py-3.5 rounded-xl text-body-lg font-semibold flex items-center justify-center gap-2 transition-opacity ${
            canAddAccount
              ? 'bg-[var(--primary)] text-[var(--on-primary)] hover:opacity-90'
              : 'bg-[var(--surface-container)] text-[var(--on-surface-variant)] cursor-not-allowed'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Add Account
        </button>
      </div>

      {/* Add Account Modal */}
      {showAddAccount && (
        <div className="absolute inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={resetAddFlow} />
          <div className="absolute bottom-0 left-0 right-0 bg-[var(--surface-container-lowest)] rounded-t-3xl p-5 animate-in slide-in-from-bottom duration-200 max-h-[90%] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-title-lg font-semibold text-[var(--on-surface)]">
                {addStep === 'credential' ? 'Add Account' : 'Enter Password'}
              </h3>
              <button
                onClick={resetAddFlow}
                className="p-2 -mr-2 hover:bg-[var(--surface-container)] rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {addStep === 'credential' ? (
              <div className="space-y-4">
                {/* Method tabs */}
                <div className="flex gap-2 p-1 bg-[var(--surface-container)] rounded-lg">
                  <button
                    onClick={() => setLoginMethod('phone')}
                    className={`flex-1 py-2 px-3 rounded-md text-label-sm transition-all ${
                      loginMethod === 'phone'
                        ? 'bg-[var(--primary)] text-[var(--on-primary)]'
                        : 'text-[var(--on-surface)] hover:bg-[var(--surface-container-high)]'
                    }`}
                  >
                    Phone
                  </button>
                  <button
                    onClick={() => setLoginMethod('email')}
                    className={`flex-1 py-2 px-3 rounded-md text-label-sm transition-all ${
                      loginMethod === 'email'
                        ? 'bg-[var(--primary)] text-[var(--on-primary)]'
                        : 'text-[var(--on-surface)] hover:bg-[var(--surface-container-high)]'
                    }`}
                  >
                    Email
                  </button>
                </div>

                {loginMethod === 'phone' ? (
                  <div>
                    <label className="block text-label-sm text-[var(--on-surface)] mb-1.5">Phone Number</label>
                    <div className="flex gap-2">
                      <div className="relative" ref={countryPickerRef}>
                        <button
                          type="button"
                          onClick={() => setShowCountryPicker(!showCountryPicker)}
                          className="w-24 h-full px-3 py-2.5 bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded-lg text-[var(--on-surface)] text-sm focus:outline-none focus:border-[var(--secondary)] transition-colors flex items-center justify-between"
                        >
                          <span>{countryCode}</span>
                          <svg className={`w-4 h-4 text-[var(--on-surface-variant)] transition-transform ${showCountryPicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {showCountryPicker && (
                          <div className="absolute bottom-full left-0 mb-1 w-48 bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] rounded-xl shadow-ambient-lg py-2 z-30 max-h-60 overflow-y-auto">
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
                        className="flex-1 px-3 py-2.5 bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded-lg text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/60 focus:outline-none focus:border-[var(--secondary)] transition-colors text-sm"
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
                      className="w-full px-3 py-2.5 bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded-lg text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/60 focus:outline-none focus:border-[var(--secondary)] transition-colors text-sm"
                    />
                  </div>
                )}

                <button
                  onClick={handleNext}
                  disabled={!canProceedToPassword}
                  className={`w-full py-3.5 rounded-xl text-body-lg font-semibold transition-all ${
                    canProceedToPassword
                      ? 'bg-[var(--primary)] text-[var(--on-primary)] hover:opacity-90'
                      : 'bg-[var(--surface-container)] text-[var(--on-surface-variant)] cursor-not-allowed'
                  }`}
                >
                  Next
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddAccount} className="space-y-4">
                <div>
                  <label className="block text-label-sm text-[var(--on-surface)] mb-1.5">
                    Password for {credentialValue}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3 py-2.5 bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded-lg text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/60 focus:outline-none focus:border-[var(--secondary)] transition-colors text-sm"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setAddStep('credential')}
                    className="flex-1 py-3.5 rounded-xl text-body-lg font-semibold bg-[var(--surface-container)] text-[var(--on-surface)] hover:bg-[var(--surface-container-high)] transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!password.trim() || isLoading}
                    className={`flex-1 py-3.5 rounded-xl text-body-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                      password.trim() && !isLoading
                        ? 'bg-[var(--primary)] text-[var(--on-primary)] hover:opacity-90'
                        : 'bg-[var(--surface-container)] text-[var(--on-surface-variant)] cursor-not-allowed'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      'Log In'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Component = AccountSwitcherPage;
export default Component;
