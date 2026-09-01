/**
 * @name 钱包原型
 * @description SuperIM v2.0 USDC wallet prototype. Mock-only, Base Mainnet.
 */

import { useEffect, useMemo, useRef, useState, type FC, type ReactNode } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  Cloud,
  ExternalLink,
  FileText,
  KeyRound,
  LockKeyhole,
  Mic,
  MoreVertical,
  Paperclip,
  ReceiptText,
  ScanLine,
  Settings2,
  ShieldCheck,
  Smile,
  TriangleAlert,
  X,
} from 'lucide-react'
import '../../themes/equatorial-minimalism/globals.css'
import './style.css'

type WalletView = 'home' | 'deposit' | 'transfer' | 'withdraw' | 'transactions' | 'detail' | 'security' | 'chat-transfer'
type AuthMethod = 'passkey' | 'password'

interface Transaction {
  id: string
  type: 'received' | 'sent' | 'withdrawal'
  title: string
  subtitle: string
  amount: string
  date: string
  status: 'completed' | 'processing' | 'failed'
  address?: string
}

const walletAddress = '0x7A2D...9C4D'
const fullWalletAddress = '0x7A2D31fA0C22B4cB6e88F412Aaa29C9C9C9C9C4D'

const transactions: Transaction[] = [
  { id: 'tx-1042', type: 'received', title: 'From Kofi Mensah', subtitle: 'Internal transfer · Base Mainnet', amount: '+84.00 USDC', date: 'Today, 10:42', status: 'completed', address: '0x2F4A...82D1' },
  { id: 'tx-1041', type: 'sent', title: 'To Amara Okafor', subtitle: 'Internal transfer · Base Mainnet', amount: '-120.00 USDC', date: 'Today, 09:18', status: 'completed', address: '0xB19E...51A0' },
  { id: 'tx-1039', type: 'withdrawal', title: 'External withdrawal', subtitle: 'Base Mainnet · 0x91C2...1A7F', amount: '-250.80 USDC', date: 'Yesterday, 18:05', status: 'processing', address: '0x91C2...1A7F' },
  { id: 'tx-1036', type: 'received', title: 'Deposit received', subtitle: 'Base Mainnet · Confirmed', amount: '+500.00 USDC', date: 'Aug 29, 14:20', status: 'completed', address: '0xA90D...32B1' },
]

const formatAmount = (value: string) => {
  const numeric = Number(value || 0)
  return Number.isFinite(numeric) ? numeric.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'
}

const shortAddress = (value: string) => `${value.slice(0, 6)}...${value.slice(-4)}`

const WalletIcon = ({ type }: { type: Transaction['type'] }) => {
  if (type === 'received') return <ArrowDownLeft aria-hidden="true" />
  if (type === 'withdrawal') return <ExternalLink aria-hidden="true" />
  return <ArrowUpRight aria-hidden="true" />
}

const StatusPill = ({ status }: { status: Transaction['status'] }) => {
  const statusMap = {
    completed: { label: 'Completed', className: 'wallet-status-success', icon: <Check aria-hidden="true" /> },
    processing: { label: 'Processing', className: 'wallet-status-warning', icon: <Clock3 aria-hidden="true" /> },
    failed: { label: 'Failed', className: 'wallet-status-error', icon: <AlertCircle aria-hidden="true" /> },
  }
  const item = statusMap[status]
  return <span className={`wallet-status ${item.className}`}>{item.icon}{item.label}</span>
}

const IconButton: FC<{
  label: string
  onClick?: () => void
  children: ReactNode
  className?: string
}> = ({ label, onClick, children, className = '' }) => (
  <button type="button" className={`wallet-icon-button ${className}`} aria-label={label} onClick={onClick}>
    {children}
  </button>
)

const PageHeader: FC<{
  title: string
  onBack: () => void
  action?: ReactNode
}> = ({ title, onBack, action }) => (
  <header className="wallet-page-header">
    <div className="wallet-page-header-inner">
      <div className="wallet-page-header-leading">
        <button type="button" className="wallet-page-header-back" aria-label="Back" onClick={onBack}>
          <ArrowLeft aria-hidden="true" />
        </button>
        <h1 className="wallet-page-header-title">{title}</h1>
      </div>
      {action ? <div className="wallet-page-header-action">{action}</div> : null}
    </div>
  </header>
)

const NetworkBadge = () => (
  <span className="wallet-network-badge"><span className="wallet-network-dot" />Base Mainnet</span>
)

const Toast = ({ message }: { message: string | null }) => message ? <div className="wallet-toast" role="status"><CheckCircle2 aria-hidden="true" />{message}</div> : null

const AuthSheet: FC<{
  open: boolean
  onClose: () => void
  onComplete: (method: AuthMethod) => void
}> = ({ open, onClose, onComplete }) => {
  const [passwordMode, setPasswordMode] = useState(false)
  const [password, setPassword] = useState('')
  if (!open) return null

  const finish = (method: AuthMethod) => {
    setPasswordMode(false)
    setPassword('')
    onComplete(method)
  }

  return (
    <div className="wallet-modal-layer" role="presentation">
      <button type="button" className="wallet-modal-scrim" aria-label="Close payment verification" onClick={onClose} />
      <section className="wallet-auth-sheet" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <div className="wallet-sheet-handle" />
        <div className="wallet-sheet-topline"><span className="wallet-secure-icon"><LockKeyhole aria-hidden="true" /></span><IconButton label="Close" onClick={onClose}><X aria-hidden="true" /></IconButton></div>
        <span className="wallet-eyebrow">SECURE ACTION</span>
        <h2 id="auth-title">Confirm this transfer</h2>
        <p className="wallet-muted">Your signature is required. SuperIM cannot sign transactions on your behalf.</p>
        {!passwordMode ? (
          <div className="wallet-auth-options">
            <button type="button" className="wallet-auth-option wallet-auth-option-primary" onClick={() => finish('passkey')}>
              <span className="wallet-option-icon"><KeyRound aria-hidden="true" /></span>
              <span><strong>Use Passkey</strong><small>Recommended · Fast and secure</small></span>
              <ArrowRight aria-hidden="true" />
            </button>
            <button type="button" className="wallet-auth-option" onClick={() => setPasswordMode(true)}>
              <span className="wallet-option-icon wallet-option-icon-muted"><LockKeyhole aria-hidden="true" /></span>
              <span><strong>Use payment password</strong><small>Fallback verification</small></span>
              <ArrowRight aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="wallet-password-form">
            <label htmlFor="payment-password">Payment password</label>
            <input id="payment-password" type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter 6-digit password" inputMode="numeric" />
            <button type="button" className="wallet-primary-button" onClick={() => finish('password')} disabled={password.length < 4}>Confirm payment</button>
            <button type="button" className="wallet-text-button" onClick={() => setPasswordMode(false)}>Back to Passkey</button>
          </div>
        )}
        <p className="wallet-auth-footnote"><ShieldCheck aria-hidden="true" /> Protected by Dynamic Embedded Wallet</p>
      </section>
    </div>
  )
}

const ActionTile: FC<{ icon: ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button type="button" className="wallet-action-tile" onClick={onClick}><span>{icon}</span><strong>{label}</strong></button>
)

const TransactionRow: FC<{ transaction: Transaction; onClick: () => void }> = ({ transaction, onClick }) => (
  <button type="button" className="wallet-transaction-row" onClick={onClick}>
    <span className={`wallet-transaction-icon wallet-transaction-${transaction.type}`}><WalletIcon type={transaction.type} /></span>
    <span className="wallet-transaction-copy"><strong>{transaction.title}</strong><small>{transaction.subtitle}</small><small>{transaction.date}</small></span>
    <span className="wallet-transaction-amount"><strong>{transaction.amount}</strong><StatusPill status={transaction.status} /></span>
  </button>
)

const WalletHome: FC<{ onToast: (message: string) => void }> = ({ onToast }) => {
  const navigate = useNavigate()
  const copyAddress = async () => {
    try { await navigator.clipboard?.writeText(fullWalletAddress) } catch { /* mock clipboard fallback */ }
    onToast('Wallet address copied')
  }
  return <div className="wallet-screen wallet-home-screen">
    <PageHeader title="Wallet" onBack={() => navigate('/me')} action={<IconButton label="Wallet security" onClick={() => navigate('/wallet/security')}><Settings2 aria-hidden="true" /></IconButton>} />
    <main className="wallet-scroll-area">
      <section className="wallet-balance-card">
        <div className="wallet-card-topline"><span className="wallet-card-label">TOTAL BALANCE</span><NetworkBadge /></div>
        <div className="wallet-balance-value">2,480<span>.32</span> <small>USDC</small></div>
        <div className="wallet-address-row"><span>{walletAddress}</span><button type="button" onClick={copyAddress} aria-label="Copy wallet address"><Copy aria-hidden="true" /> Copy</button></div>
        <div className="wallet-card-footer"><span><ShieldCheck aria-hidden="true" /> Protected by Passkey</span><span>Available</span></div>
      </section>
      <section className="wallet-action-grid" aria-label="Wallet actions">
        <ActionTile label="Deposit" icon={<ArrowDownLeft aria-hidden="true" />} onClick={() => navigate('/wallet/deposit')} />
        <ActionTile label="Transfer" icon={<ArrowUpRight aria-hidden="true" />} onClick={() => navigate('/wallet/transfer')} />
        <ActionTile label="Withdraw" icon={<ExternalLink aria-hidden="true" />} onClick={() => navigate('/wallet/withdraw')} />
      </section>
      <section className="wallet-section"><div className="wallet-section-heading"><div><span className="wallet-eyebrow">YOUR ACTIVITY</span><h3>Recent transactions</h3></div><button type="button" className="wallet-link-button" onClick={() => navigate('/wallet/transactions')}>View all <ArrowRight aria-hidden="true" /></button></div><div className="wallet-transaction-list">{transactions.slice(0, 3).map(transaction => <TransactionRow key={transaction.id} transaction={transaction} onClick={() => navigate(`/wallet/transactions/${transaction.id}`)} />)}</div></section>
    </main>
  </div>
}

const DepositPage: FC<{ onToast: (message: string) => void }> = ({ onToast }) => {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard?.writeText(fullWalletAddress) } catch { /* mock clipboard fallback */ }
    setCopied(true); onToast('Deposit address copied')
    window.setTimeout(() => setCopied(false), 1600)
  }
  return <div className="wallet-screen"><PageHeader title="Deposit USDC" onBack={() => navigate('/wallet')} /><main className="wallet-scroll-area wallet-detail-scroll"><section className="wallet-page-intro"><span className="wallet-feature-icon wallet-feature-icon-sand"><ArrowDownLeft aria-hidden="true" /></span><span className="wallet-eyebrow">YOUR BASE ADDRESS</span><h2>Receive USDC<br /><em>on Base.</em></h2><p>Send USDC from an external wallet to this address. Only send assets on Base Mainnet.</p></section><div className="wallet-network-select"><NetworkBadge /><span>Network is fixed for v2.0</span></div><section className="wallet-qr-card"><div className="wallet-qr" aria-label="Demo QR code"><span className="qr-corner qr-corner-tl" /><span className="qr-corner qr-corner-tr" /><span className="qr-corner qr-corner-bl" /><span className="qr-dots" /></div><p>Scan to deposit USDC</p><span className="wallet-demo-tag">DEMO ADDRESS</span></section><section className="wallet-address-card"><span className="wallet-card-label">YOUR WALLET ADDRESS</span><strong>{fullWalletAddress}</strong><button type="button" className="wallet-secondary-button" onClick={copy}>{copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}{copied ? 'Copied' : 'Copy address'}</button></section><div className="wallet-info-callout"><TriangleAlert aria-hidden="true" /><p><strong>Send only USDC on Base</strong><br />Sending another asset or network may result in permanent loss.</p></div><section className="wallet-section wallet-steps"><div className="wallet-section-heading"><div><span className="wallet-eyebrow">HOW IT WORKS</span><h3>Deposit status</h3></div></div><div className="wallet-step is-done"><span><Check aria-hidden="true" /></span><div><strong>Address ready</strong><small>Your Base wallet is ready to receive.</small></div></div><div className="wallet-step"><span><Clock3 aria-hidden="true" /></span><div><strong>Waiting for deposit</strong><small>We will update your balance after confirmations.</small></div></div></section></main></div>
}

const TransferPage: FC<{ onToast: (message: string) => void }> = ({ onToast }) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const fromGroupChat = searchParams.get('source') === 'group-chat'
  const [amount, setAmount] = useState('120')
  const [note, setNote] = useState('Dinner split')
  const [authOpen, setAuthOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const submit = () => { if (Number(amount) > 0) setAuthOpen(true) }
  return <div className="wallet-screen"><PageHeader title="Transfer USDC" onBack={() => navigate('/wallet')} /><main className="wallet-scroll-area wallet-detail-scroll"><div className="wallet-form-stack"><div className="wallet-network-select"><NetworkBadge /><span>Same-network transfer only</span></div><section className="wallet-form-section"><label className="wallet-form-label">{fromGroupChat ? 'RECIPIENT · ONE ONLY' : 'RECIPIENT'}</label><button type="button" className="wallet-recipient-card"><span className="wallet-avatar wallet-avatar-small">AO</span><span><strong>Amara Okafor</strong><small>{fromGroupChat ? '@amara · selected from group' : '@amara · SuperIM user'}</small></span><ChevronRight aria-hidden="true" /></button></section><section className="wallet-form-section"><label className="wallet-form-label" htmlFor="transfer-amount">AMOUNT</label><div className="wallet-amount-input"><input id="transfer-amount" value={amount} onChange={event => setAmount(event.target.value.replace(/[^0-9.]/g, ''))} inputMode="decimal" aria-describedby="transfer-balance" /><span>USDC</span></div><span id="transfer-balance" className="wallet-form-hint">Available balance&nbsp; 2,480.32 USDC</span></section><section className="wallet-form-section"><label className="wallet-form-label" htmlFor="transfer-note">NOTE <span>OPTIONAL</span></label><input id="transfer-note" className="wallet-line-input" value={note} onChange={event => setNote(event.target.value)} placeholder="What is this for?" /></section><section className="wallet-review-card"><div><span>Sending</span><strong>{formatAmount(amount)} USDC</strong></div><div><span>Network</span><strong>Base Mainnet</strong></div><div><span>Network fee</span><strong className="wallet-fee-covered">Covered by SuperIM</strong></div><div className="wallet-review-total"><span>Recipient gets</span><strong>{formatAmount(amount)} USDC</strong></div></section><div className="wallet-security-note"><ShieldCheck aria-hidden="true" /><span>Passkey verification is required. Your transaction will be signed by your wallet.</span></div><button type="button" className="wallet-primary-button wallet-submit-button" onClick={submit} disabled={!Number(amount) || sent}>{sent ? <><Check aria-hidden="true" /> Transfer sent</> : <>Review transfer <ArrowRight aria-hidden="true" /></>}</button>{sent && <div className="wallet-success-banner"><CheckCircle2 aria-hidden="true" /><span><strong>Transfer complete</strong><small>{formatAmount(amount)} USDC sent to Amara</small></span><button type="button" onClick={() => navigate('/wallet/transactions/tx-1041')}>View details</button></div>}</div></main><AuthSheet open={authOpen} onClose={() => setAuthOpen(false)} onComplete={method => { setAuthOpen(false); setSent(true); onToast(`${method === 'passkey' ? 'Passkey' : 'Payment password'} verified · Transfer complete`) }} /></div>
}

const WithdrawPage: FC<{ onToast: (message: string) => void }> = ({ onToast }) => {
  const navigate = useNavigate()
  const [address, setAddress] = useState('0x91C2a4D8e7F1...1A7F')
  const [amount, setAmount] = useState('250')
  const [authOpen, setAuthOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const fee = 0.8
  const received = Math.max(0, Number(amount || 0) - fee)
  return <div className="wallet-screen"><PageHeader title="Withdraw USDC" onBack={() => navigate('/wallet')} /><main className="wallet-scroll-area wallet-detail-scroll"><div className="wallet-form-stack"><div className="wallet-network-select"><NetworkBadge /><span>External address · no address book</span></div><section className="wallet-form-section"><label className="wallet-form-label" htmlFor="withdraw-address">DESTINATION ADDRESS</label><div className="wallet-address-input"><input id="withdraw-address" value={address} onChange={event => setAddress(event.target.value)} placeholder="Paste a Base address" /><ScanLine aria-hidden="true" /></div><span className="wallet-form-hint">Double-check the address before confirming.</span></section><section className="wallet-form-section"><label className="wallet-form-label" htmlFor="withdraw-amount">AMOUNT</label><div className="wallet-amount-input"><input id="withdraw-amount" value={amount} onChange={event => setAmount(event.target.value.replace(/[^0-9.]/g, ''))} inputMode="decimal" /><span>USDC</span></div><span className="wallet-form-hint">Available balance&nbsp; 2,480.32 USDC</span></section><section className="wallet-review-card"><div><span>Withdrawal amount</span><strong>{formatAmount(amount)} USDC</strong></div><div><span>Service fee</span><strong>{fee.toFixed(2)} USDC</strong></div><div><span>Network fee</span><strong className="wallet-fee-covered">Covered by SuperIM</strong></div><div className="wallet-review-total"><span>You'll receive</span><strong>{formatAmount(String(received))} USDC</strong></div></section><div className="wallet-info-callout wallet-info-callout-warning"><TriangleAlert aria-hidden="true" /><p><strong>External transfer</strong><br />Withdrawals cannot be reversed after signing.</p></div><button type="button" className="wallet-primary-button wallet-submit-button" onClick={() => setAuthOpen(true)} disabled={!address || !Number(amount) || submitted}>{submitted ? <><Check aria-hidden="true" /> Withdrawal submitted</> : <>Review withdrawal <ArrowRight aria-hidden="true" /></>}</button>{submitted && <div className="wallet-success-banner"><Clock3 aria-hidden="true" /><span><strong>Withdrawal processing</strong><small>Your funds are on the way to {shortAddress(address)}</small></span><button type="button" onClick={() => navigate('/wallet/transactions/tx-1039')}>View details</button></div>}</div></main><AuthSheet open={authOpen} onClose={() => setAuthOpen(false)} onComplete={method => { setAuthOpen(false); setSubmitted(true); onToast(`${method === 'passkey' ? 'Passkey' : 'Payment password'} verified · Withdrawal processing`) }} /></div>
}

const TransactionsPage: FC = () => {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'all' | Transaction['type']>('all')
  const visible = useMemo(() => filter === 'all' ? transactions : transactions.filter(item => item.type === filter), [filter])
  return <div className="wallet-screen"><PageHeader title="Transactions" onBack={() => navigate('/wallet')} action={<IconButton label="Reset transaction filters" onClick={() => setFilter('all')}><ReceiptText aria-hidden="true" /></IconButton>} /><main className="wallet-scroll-area wallet-detail-scroll"><div className="wallet-activity-summary"><span className="wallet-eyebrow">AUGUST 2026</span><strong>2,480.32 USDC</strong><small>Current available balance</small></div><div className="wallet-filter-row" role="tablist" aria-label="Transaction filters">{[['all', 'All'], ['received', 'Received'], ['sent', 'Sent'], ['withdrawal', 'Withdrawals']].map(([id, label]) => <button type="button" key={id} role="tab" aria-selected={filter === id} className={filter === id ? 'is-active' : ''} onClick={() => setFilter(id as typeof filter)}>{label}</button>)}</div><section className="wallet-section"><div className="wallet-section-heading"><div><span className="wallet-eyebrow">BASE MAINNET · USDC</span><h3>{visible.length} transactions</h3></div></div><div className="wallet-transaction-list wallet-transaction-list-full">{visible.map(transaction => <TransactionRow key={transaction.id} transaction={transaction} onClick={() => navigate(`/wallet/transactions/${transaction.id}`)} />)}</div></section><div className="wallet-empty-footnote"><ShieldCheck aria-hidden="true" /> Transactions are verified on Base Mainnet</div></main></div>
}

const TransactionDetailPage: FC = () => {
  const navigate = useNavigate()
  const transaction = transactions[2]
  return <div className="wallet-screen"><PageHeader title="Transaction details" onBack={() => navigate('/wallet/transactions')} /><main className="wallet-scroll-area wallet-detail-scroll"><section className="wallet-detail-status"><span className="wallet-detail-status-icon wallet-detail-status-processing"><Clock3 aria-hidden="true" /></span><span className="wallet-eyebrow">WITHDRAWAL PROCESSING</span><strong>-250.80 USDC</strong><small>Started yesterday at 18:05</small></section><section className="wallet-detail-card"><div className="wallet-detail-line"><span>Asset</span><strong><span className="wallet-token-mark">$</span>USDC</strong></div><div className="wallet-detail-line"><span>Network</span><strong><NetworkBadge /></strong></div><div className="wallet-detail-line"><span>Destination</span><strong className="wallet-detail-address">{transaction.address}</strong></div><div className="wallet-detail-line"><span>Service fee</span><strong>0.80 USDC</strong></div><div className="wallet-detail-line"><span>Network fee</span><strong className="wallet-fee-covered">Covered by SuperIM</strong></div></section><section className="wallet-timeline"><div className="wallet-timeline-item is-done"><span><Check aria-hidden="true" /></span><div><strong>Request submitted</strong><small>Yesterday, 18:05</small></div></div><div className="wallet-timeline-item is-current"><span><Clock3 aria-hidden="true" /></span><div><strong>Processing on Base</strong><small>Waiting for confirmation</small></div></div><div className="wallet-timeline-item"><span><Check aria-hidden="true" /></span><div><strong>Completed</strong><small>Funds arrive at destination</small></div></div></section><button type="button" className="wallet-secondary-button wallet-full-button"><ExternalLink aria-hidden="true" /> View on BaseScan</button><p className="wallet-detail-footnote">Transaction ID <strong>0x91f0...8b2a</strong><button type="button" aria-label="Copy transaction ID"><Copy aria-hidden="true" /></button></p></main></div>
}

const SecurityPage: FC = () => {
  const navigate = useNavigate()
  return <div className="wallet-screen"><PageHeader title="Wallet security" onBack={() => navigate('/wallet')} /><main className="wallet-scroll-area wallet-detail-scroll"><section className="wallet-security-hero"><span className="wallet-feature-icon wallet-feature-icon-indigo"><ShieldCheck aria-hidden="true" /></span><h2>Sign with<br /><em>confidence.</em></h2><p>Every transfer requires your explicit approval. Your private wallet credentials never leave the protected wallet layer.</p></section><section className="wallet-security-list"><div className="wallet-security-item wallet-security-item-active"><span className="wallet-option-icon"><KeyRound aria-hidden="true" /></span><span><strong>Passkey</strong><small>Preferred verification method</small></span><span className="wallet-security-state">Active <Check aria-hidden="true" /></span><ChevronRight aria-hidden="true" /></div><div className="wallet-security-item"><span className="wallet-option-icon wallet-option-icon-muted"><LockKeyhole aria-hidden="true" /></span><span><strong>Payment password</strong><small>Fallback verification method</small></span><span className="wallet-security-state">Set up</span><ChevronRight aria-hidden="true" /></div></section><div className="wallet-security-note wallet-security-note-block"><ShieldCheck aria-hidden="true" /><span><strong>Signature required</strong><br />SuperIM can sponsor network fees, but cannot bypass your wallet signature.</span></div><section className="wallet-section"><div className="wallet-section-heading"><div><span className="wallet-eyebrow">WALLET IDENTITY</span><h3>Connected wallet</h3></div></div><div className="wallet-address-card"><span className="wallet-card-label">BASE MAINNET · PRIMARY</span><strong>{fullWalletAddress}</strong><small>Created when your SuperIM account was registered.</small></div></section></main></div>
}

interface WalletChatMessage {
  id: string
  text: string
  timestamp: string
  isSent: boolean
  isRead: boolean
  fileName?: string
  fileSize?: string
  isCloudDrive?: boolean
}

const walletChatMessages: WalletChatMessage[] = [
  { id: '1', text: 'Hey! How are you doing?', timestamp: '10:30 AM', isSent: false, isRead: true },
  { id: '2', text: "I'm doing great! Just finished the project.", timestamp: '10:32 AM', isSent: true, isRead: true },
  { id: '3', text: "That's awesome! Congratulations 🎉", timestamp: '10:33 AM', isSent: false, isRead: true },
  { id: 'cd-1', text: 'Team photo album.zip', timestamp: '10:38 AM', isSent: true, isRead: true, fileName: 'Team photo album.zip', fileSize: '25 MB', isCloudDrive: true },
  { id: '4', text: 'Thanks for the help with the project!', timestamp: '10:42 AM', isSent: false, isRead: false },
  { id: 'file-brief', text: 'Project brief.pdf', timestamp: '10:44 AM', isSent: false, isRead: false, fileName: 'Project brief.pdf', fileSize: '2.4 MB' },
  { id: 'cd-2', text: 'Contract template.docx', timestamp: '10:48 AM', isSent: true, isRead: false, fileName: 'Contract template.docx', fileSize: '892 KB', isCloudDrive: true },
]

const WalletChatMessage: FC<{ message: WalletChatMessage }> = ({ message }) => {
  const bubble = (
    <div className={`bg-[var(--surface-container-lowest)] text-[var(--on-surface)] px-4 py-2.5 cursor-pointer active:scale-[0.98] transition-transform ${message.isSent ? 'rounded-2xl rounded-tr-sm' : 'rounded-2xl rounded-tl-sm'} mt-0.5`}>
      {message.fileName ? (
        <div className="min-w-[190px]">
          <div className="flex items-center gap-3">
            <span className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${message.isCloudDrive ? 'bg-[var(--primary-fixed)] text-[var(--on-primary-fixed)]' : 'bg-[var(--secondary-container)] text-[var(--on-secondary-container)]'}`}>
              {message.isCloudDrive ? <Cloud className="w-5 h-5" aria-hidden="true" /> : <FileText className="w-5 h-5" aria-hidden="true" />}
            </span>
            <span className="min-w-0 flex-1"><span className="block text-sm font-semibold truncate">{message.fileName}</span><span className="block text-xs text-[var(--on-surface-variant)]">{message.fileSize}</span></span>
          </div>
          {message.isCloudDrive && <div className="mt-2 flex items-center gap-1.5 pt-2 border-t border-[var(--outline-variant)]/60"><Cloud className="w-3.5 h-3.5 text-[var(--primary)] flex-shrink-0" aria-hidden="true" /><span className="text-label-xs font-medium text-[var(--primary)]">Shared from Cloud Drive</span></div>}
        </div>
      ) : <p className="text-body-md">{message.text}</p>}
    </div>
  )

  return message.isSent ? (
    <div className="flex gap-2">
      <div className="flex-1 flex justify-end"><div className="max-w-[70%]">{bubble}<div className="flex items-center gap-1 mt-1 justify-end"><span className="text-label-xs text-[var(--on-surface-variant)]">{message.timestamp}</span><svg className={`w-4 h-4 ${message.isRead ? 'text-[var(--secondary)]' : 'text-[var(--outline)]'}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /><path d="M5 16.17L1.83 13l-1.42 1.41L5 20l12-12-1.41-1.41z" opacity="0.5" /></svg></div></div></div>
    </div>
  ) : (
    <div className="flex gap-2"><div className="max-w-[70%]">{bubble}<span className="text-label-xs text-[var(--on-surface-variant)] mt-1 block">{message.timestamp}</span></div></div>
  )
}

const ChatTransferPage: FC<{ onToast: (message: string) => void }> = ({ onToast }) => {
  const navigate = useNavigate()
  const [authOpen, setAuthOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const messagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const messages = messagesRef.current
    if (messages) messages.scrollTop = messages.scrollHeight
  }, [])

  return <div className="h-full bg-[var(--surface-container-low)] flex flex-col wallet-chat-screen">
    <header className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] px-4 py-3 z-20">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => navigate('/wallet')} className="p-2 -ml-2 hover:bg-[var(--surface-container)] rounded-full transition-colors" aria-label="Back to wallet"><ArrowLeft className="w-6 h-6 text-[var(--on-surface)]" aria-hidden="true" /></button>
        <button type="button" onClick={() => navigate('/user-profile?isContact=true')} className="w-10 h-10 bg-[var(--primary-container)] rounded-full flex items-center justify-center text-[var(--on-primary-container)] font-semibold hover:opacity-90 transition-opacity" aria-label="AO">AO</button>
        <div className="flex-1"><button type="button" onClick={() => navigate('/user-profile?isContact=true')} className="text-left"><h1 className="text-body-lg font-semibold text-[var(--on-surface)]">Amara Okafor</h1></button><p className="text-label-sm text-[var(--secondary)]">Online</p></div>
        <button type="button" className="p-2 hover:bg-[var(--surface-container)] rounded-full transition-colors" aria-label="Chat menu"><MoreVertical className="w-6 h-6 text-[var(--on-surface)]" aria-hidden="true" /></button>
      </div>
    </header>

    <div ref={messagesRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      <div className="flex items-center justify-center"><span className="px-3 py-1 bg-[var(--surface-container)] rounded-full text-label-sm text-[var(--on-surface-variant)]">Today</span></div>
      {walletChatMessages.map(message => <WalletChatMessage key={message.id} message={message} />)}
      <div className="flex justify-end"><div className="wallet-transfer-card wallet-transfer-card-sent"><div className="wallet-transfer-card-top"><span className="wallet-transfer-card-icon"><ArrowUpRight aria-hidden="true" /></span><span><span className="wallet-eyebrow">USDC TRANSFER</span><strong>120.00 USDC</strong></span><StatusPill status={sent ? 'completed' : 'processing'} /></div><div className="wallet-transfer-card-meta"><span>{sent ? 'Sent to Amara' : 'Awaiting your approval'}</span><NetworkBadge /></div>{!sent && <button type="button" className="wallet-card-action" onClick={() => setAuthOpen(true)}>Approve transfer <ArrowRight aria-hidden="true" /></button>}{sent && <div className="wallet-transfer-complete"><CheckCircle2 aria-hidden="true" /> Transfer complete</div>}</div></div>
    </div>

    <div className="bg-[var(--surface-container-low)] border-t border-[var(--outline-variant)] px-3 py-2.5">
      <div className="flex items-center gap-2">
        <button type="button" className="h-11 w-11 rounded-full flex items-center justify-center flex-shrink-0 text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] transition-colors" aria-label="Attachments"><Paperclip className="w-6 h-6" aria-hidden="true" /></button>
        <div className="flex-1 relative"><textarea aria-label="Message" placeholder="Message..." rows={1} className="w-full min-h-[44px] max-h-[120px] bg-[var(--surface-container-lowest)] text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/50 resize-none focus:outline-none rounded-2xl px-4 py-2.5 pr-10 text-body-md border border-[var(--outline-variant)] focus:border-[var(--primary)]/30 transition-colors" /><button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 transition-colors text-[var(--on-surface-variant)]/70 hover:text-[var(--on-surface-variant)]" aria-label="Emoji"><Smile className="w-5 h-5" aria-hidden="true" /></button></div>
        <button type="button" className="h-11 w-11 rounded-full text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] flex items-center justify-center flex-shrink-0 transition-colors" aria-label="Record voice"><Mic className="w-5 h-5" aria-hidden="true" /></button>
      </div>
    </div>

    <AuthSheet open={authOpen} onClose={() => setAuthOpen(false)} onComplete={method => { setAuthOpen(false); setSent(true); onToast(`${method === 'passkey' ? 'Passkey' : 'Payment password'} verified · Chat transfer complete`) }} />
  </div>
}

const WalletPage: FC = () => {
  const location = useLocation()
  const [toast, setToast] = useState<string | null>(null)
  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(null), 2400) }
  const view: WalletView = location.pathname === '/wallet' ? 'home' : location.pathname.includes('/chat-transfer') ? 'chat-transfer' : location.pathname.includes('/transactions/') ? 'detail' : (location.pathname.split('/')[2] as WalletView) || 'home'
  return <div className="wallet-prototype"><div className="wallet-prototype-canvas">{view === 'home' && <WalletHome onToast={showToast} />}{view === 'deposit' && <DepositPage onToast={showToast} />}{view === 'transfer' && <TransferPage onToast={showToast} />}{view === 'withdraw' && <WithdrawPage onToast={showToast} />}{view === 'transactions' && <TransactionsPage />}{view === 'detail' && <TransactionDetailPage />}{view === 'security' && <SecurityPage />}{view === 'chat-transfer' && <ChatTransferPage onToast={showToast} />}<Toast message={toast} /></div></div>
}

export default WalletPage
