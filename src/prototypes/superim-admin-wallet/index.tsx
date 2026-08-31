/**
 * @name 钱包运营后台
 * @description SuperIM v2.0 wallet operations and withdrawal rule configuration prototype
 */

import { useLocation, useNavigate } from 'react-router-dom'
import { useState, type FC, type ReactNode } from 'react'
import {
  Activity,
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  DollarSign,
  FileSearch,
  LayoutDashboard,
  ListFilter,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  UsersRound,
  WalletCards,
} from 'lucide-react'
import '../../themes/equatorial-minimalism/globals.css'
import './style.css'

type AdminView = 'dashboard' | 'transactions' | 'users' | 'settings' | 'audit'

const adminTransactions = [
  { id: 'tx-1042', user: 'Amina Yusuf', type: 'Internal transfer', amount: '84.00 USDC', status: 'Completed', time: '10:42' },
  { id: 'tx-1041', user: 'Amina Yusuf', type: 'Internal transfer', amount: '120.00 USDC', status: 'Completed', time: '09:18' },
  { id: 'tx-1039', user: 'Kwame Boateng', type: 'Withdrawal', amount: '250.80 USDC', status: 'Processing', time: 'Yesterday' },
  { id: 'tx-1036', user: 'Elena Rossi', type: 'Deposit', amount: '500.00 USDC', status: 'Completed', time: 'Aug 29' },
]

const adminUsers = [
  { name: 'Amina Yusuf', handle: '@amina', wallet: '0x7A2D...9C4D', balance: '2,480.32 USDC', status: 'Ready', joined: 'Aug 22, 2026' },
  { name: 'Kwame Boateng', handle: '@kwame', wallet: '0x91C2...1A7F', balance: '840.10 USDC', status: 'Ready', joined: 'Aug 20, 2026' },
  { name: 'Elena Rossi', handle: '@elena', wallet: '0xA90D...32B1', balance: '120.00 USDC', status: 'Ready', joined: 'Aug 18, 2026' },
  { name: 'Noah Williams', handle: '@noah', wallet: 'Pending', balance: '—', status: 'Pending', joined: 'Today, 09:22' },
]

const IconText: FC<{ icon: ReactNode; children: ReactNode; className?: string }> = ({ icon, children, className = '' }) => <span className={`admin-icon-text ${className}`}>{icon}{children}</span>

const AdminSidebar: FC<{ view: AdminView; onNavigate: (view: AdminView) => void }> = ({ view, onNavigate }) => {
  const items: { id: AdminView; label: string; icon: ReactNode }[] = [
    { id: 'dashboard', label: 'Wallet overview', icon: <LayoutDashboard aria-hidden="true" /> },
    { id: 'transactions', label: 'Transactions', icon: <Activity aria-hidden="true" /> },
    { id: 'users', label: 'User wallets', icon: <UsersRound aria-hidden="true" /> },
    { id: 'settings', label: 'Wallet rules', icon: <Settings2 aria-hidden="true" /> },
    { id: 'audit', label: 'Audit log', icon: <FileSearch aria-hidden="true" /> },
  ]
  return <aside className="admin-wallet-sidebar"><div className="admin-wallet-brand"><span><DollarSign aria-hidden="true" /></span><div><strong>SuperIM</strong><small>Operations console</small></div></div><div className="admin-sidebar-label">WALLET V2.0</div><nav>{items.map(item => <button type="button" key={item.id} className={view === item.id ? 'is-active' : ''} onClick={() => onNavigate(item.id)}>{item.icon}<span>{item.label}</span>{view === item.id && <ChevronRight aria-hidden="true" />}</button>)}</nav><div className="admin-sidebar-bottom"><div className="admin-network-lock"><span className="wallet-network-dot" /><div><strong>Base Mainnet</strong><small>USDC · primary network</small></div></div><div className="admin-user-chip"><span className="admin-avatar">JD</span><div><strong>Jordan Davis</strong><small>Wallet admin</small></div></div></div></aside>
}

const AdminTopbar: FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => <header className="admin-wallet-topbar"><div><span className="admin-breadcrumb">OPERATIONS / WALLET</span><h1>{title}</h1><p>{subtitle}</p></div><div className="admin-topbar-actions"><span className="admin-live-pill"><span />Mock data</span><button type="button" className="admin-round-button" aria-label="Search"><Search aria-hidden="true" /></button><button type="button" className="admin-round-button" aria-label="Filter"><SlidersHorizontal aria-hidden="true" /></button><span className="admin-avatar admin-avatar-top">JD</span></div></header>

const StatCard: FC<{ label: string; value: string; change: string; icon: ReactNode; tone?: 'indigo' | 'sand' | 'green' | 'dark' }> = ({ label, value, change, icon, tone = 'indigo' }) => <div className={`admin-stat-card admin-stat-${tone}`}><div className="admin-stat-top"><span>{label}</span><span className="admin-stat-icon">{icon}</span></div><strong>{value}</strong><small>{change}</small></div>

const StatusBadge = ({ status }: { status: string }) => <span className={`admin-status-badge admin-status-${status.toLowerCase()}`}><span />{status}</span>

const OverviewPage: FC<{ onNavigate: (view: AdminView) => void }> = ({ onNavigate }) => {
  const bars = [42, 54, 49, 68, 61, 78, 74, 88, 72, 94, 82, 100]
  return <div className="admin-page-content"><div className="admin-stat-grid"><StatCard label="TOTAL WALLET USERS" value="18,492" change="+12.8% vs last month" icon={<UsersRound aria-hidden="true" />} tone="indigo" /><StatCard label="USDC VOLUME · 30D" value="$2.84M" change="+8.4% vs last month" icon={<DollarSign aria-hidden="true" />} tone="sand" /><StatCard label="SUCCESS RATE" value="99.2%" change="+0.6% vs last month" icon={<CheckCircle2 aria-hidden="true" />} tone="green" /><StatCard label="PENDING ACTIONS" value="27" change="9 withdrawals need review" icon={<Clock3 aria-hidden="true" />} tone="dark" /></div><div className="admin-main-grid"><section className="admin-panel admin-volume-panel"><div className="admin-panel-heading"><div><span className="admin-section-label">TRANSACTION VOLUME</span><h2>Wallet activity</h2></div><button type="button" className="admin-select-button">Last 30 days <ChevronRight aria-hidden="true" /></button></div><div className="admin-chart-meta"><strong>$2.84M</strong><span><b>+8.4%</b> compared to previous period</span></div><div className="admin-chart"><div className="admin-chart-y"><span>$400k</span><span>$300k</span><span>$200k</span><span>$100k</span><span>$0</span></div><div className="admin-chart-bars">{bars.map((height, index) => <div className="admin-bar-column" key={index}><div className="admin-bar" style={{ height: `${height}%` }} /><span>{['Aug 1', '', '', 'Aug 10', '', '', 'Aug 20', '', '', 'Aug 30', '', ''][index]}</span></div>)}</div></div><div className="admin-chart-legend"><span><i className="admin-legend-indigo" />Transfers</span><span><i className="admin-legend-sand" />Withdrawals</span><span><i className="admin-legend-line" />USDC · Base Mainnet</span></div></section><section className="admin-panel admin-health-panel"><div className="admin-panel-heading"><div><span className="admin-section-label">SYSTEM HEALTH</span><h2>Wallet infrastructure</h2></div><ShieldCheck className="admin-health-icon" aria-hidden="true" /></div><div className="admin-health-score"><div className="admin-score-ring"><strong>99.2</strong><span>%</span></div><div><strong>Healthy</strong><small>All services operational</small></div></div><div className="admin-health-list"><div><span><i className="admin-health-dot is-green" />Embedded wallet creation</span><b>Operational</b></div><div><span><i className="admin-health-dot is-green" />Base Mainnet RPC</span><b>Operational</b></div><div><span><i className="admin-health-dot is-orange" />Gas sponsorship</span><b>Degraded</b></div></div><button type="button" className="admin-ghost-button" onClick={() => onNavigate('audit')}>View system events <ArrowRightIcon /></button></section></div><section className="admin-panel admin-pending-panel"><div className="admin-panel-heading"><div><span className="admin-section-label">NEEDS ATTENTION</span><h2>Pending withdrawals</h2></div><button type="button" className="admin-link-button" onClick={() => onNavigate('transactions')}>View all <ArrowRightIcon /></button></div><div className="admin-pending-list">{adminTransactions.filter(item => item.status === 'Processing').map(item => <div className="admin-pending-row" key={item.id}><span className="admin-pending-icon"><ArrowUpRight aria-hidden="true" /></span><div><strong>{item.user}</strong><small>{item.id} · {item.time}</small></div><b>{item.amount}</b><StatusBadge status={item.status} /><button type="button" aria-label={`View ${item.id}`} onClick={() => onNavigate('transactions')}><ChevronRight aria-hidden="true" /></button></div>)}<div className="admin-pending-row"><span className="admin-pending-icon admin-pending-icon-warning"><AlertCircle aria-hidden="true" /></span><div><strong>9 withdrawals require review</strong><small>Fee or limit rule triggered</small></div><button type="button" className="admin-review-button" onClick={() => onNavigate('transactions')}>Review queue <ArrowRightIcon /></button></div></div></section></div>
}

const TransactionsPage: FC = () => <div className="admin-page-content"><div className="admin-toolbar"><div><span className="admin-section-label">BASE MAINNET · USDC</span><h2>All transactions <span>18,492 total</span></h2></div><div className="admin-toolbar-actions"><button type="button" className="admin-outline-button"><ListFilter aria-hidden="true" />Filter</button><button type="button" className="admin-primary-small">Export CSV</button></div></div><div className="admin-filter-summary"><span className="admin-filter-chip is-active">All transactions</span><span className="admin-filter-chip">Pending <b>27</b></span><span className="admin-filter-chip">Withdrawals</span><span className="admin-filter-chip">Failed</span><div className="admin-search-box"><Search aria-hidden="true" /><span>Search by ID, user or address</span></div></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Transaction ID</th><th>User</th><th>Type</th><th>Amount</th><th>Status</th><th>Created</th><th /></tr></thead><tbody>{adminTransactions.map(item => <tr key={item.id}><td><strong>{item.id}</strong></td><td><span className="admin-table-user"><span className="admin-table-avatar">{item.user.split(' ').map(word => word[0]).join('')}</span>{item.user}</span></td><td><IconText icon={item.type === 'Deposit' ? <ArrowDownLeft aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}>{item.type}</IconText></td><td><strong>{item.amount}</strong></td><td><StatusBadge status={item.status} /></td><td>{item.time}</td><td><button type="button" className="admin-row-more" aria-label={`Open ${item.id}`}><ChevronRight aria-hidden="true" /></button></td></tr>)}</tbody></table></div></div>

const UsersPage: FC = () => <div className="admin-page-content"><div className="admin-toolbar"><div><span className="admin-section-label">ACCOUNT LINKAGE</span><h2>User wallets <span>18,492 wallets</span></h2></div><button type="button" className="admin-outline-button"><Search aria-hidden="true" />Search users</button></div><div className="admin-user-summary"><div><strong>18,492</strong><span>Total wallets</span></div><div><strong>18,441</strong><span>Ready</span></div><div><strong>51</strong><span>Pending / failed</span></div><div><strong>$6.2M</strong><span>Total balance</span></div></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>User</th><th>Wallet address</th><th>Balance</th><th>Status</th><th>Registered</th><th /></tr></thead><tbody>{adminUsers.map(user => <tr key={user.handle}><td><span className="admin-table-user"><span className="admin-table-avatar admin-table-avatar-sand">{user.name.split(' ').map(word => word[0]).join('')}</span><span><strong>{user.name}</strong><small>{user.handle}</small></span></span></td><td className="admin-mono">{user.wallet}</td><td><strong>{user.balance}</strong></td><td><StatusBadge status={user.status} /></td><td>{user.joined}</td><td><button type="button" className="admin-row-more" aria-label={`Open ${user.name}`}><ChevronRight aria-hidden="true" /></button></td></tr>)}</tbody></table></div></div>

const SettingsPage: FC<{ onToast: (message: string) => void }> = ({ onToast }) => {
  const [fee, setFee] = useState('0.80')
  const [minimum, setMinimum] = useState('10.00')
  const [daily, setDaily] = useState('5,000.00')
  const [review, setReview] = useState('1,000.00')
  return <div className="admin-page-content"><div className="admin-toolbar"><div><span className="admin-section-label">POLICY CONFIGURATION</span><h2>Wallet rules <span>USDC · Base Mainnet</span></h2></div><span className="admin-draft-pill">Draft changes</span></div><div className="admin-settings-grid"><section className="admin-panel admin-settings-panel"><div className="admin-panel-heading"><div><span className="admin-section-label">WITHDRAWAL POLICY</span><h2>Limits & fees</h2></div><SlidersHorizontal aria-hidden="true" /></div><p className="admin-panel-description">These rules are applied to new withdrawal requests. Internal SuperIM transfers remain gas-sponsored and are not charged a service fee.</p><label className="admin-setting-field"><span>Service fee <small>USDC</small></span><div><input value={fee} onChange={event => setFee(event.target.value)} /><b>USDC</b></div><small>Flat fee deducted from the withdrawal amount.</small></label><label className="admin-setting-field"><span>Minimum withdrawal <small>USDC</small></span><div><input value={minimum} onChange={event => setMinimum(event.target.value)} /><b>USDC</b></div><small>Requests below this amount will be blocked.</small></label><label className="admin-setting-field"><span>Daily user limit <small>USDC</small></span><div><input value={daily} onChange={event => setDaily(event.target.value)} /><b>USDC</b></div><small>Rolling 24-hour limit per user.</small></label><label className="admin-setting-field"><span>Manual review threshold <small>USDC</small></span><div><input value={review} onChange={event => setReview(event.target.value)} /><b>USDC</b></div><small>Requests above this amount enter the review queue.</small></label><div className="admin-settings-footer"><span><ShieldCheck aria-hidden="true" /> Last saved by Jordan Davis · 12 min ago</span><button type="button" className="admin-primary-small" onClick={() => onToast('Wallet rules saved as draft')}>Save draft</button></div></section><section className="admin-panel admin-preview-panel"><div className="admin-panel-heading"><div><span className="admin-section-label">USER PREVIEW</span><h2>Confirmation summary</h2></div><EyeIcon /></div><div className="admin-preview-card"><span className="admin-preview-label">WITHDRAWAL</span><strong>250.00 USDC</strong><div><span>Service fee</span><b>-{fee} USDC</b></div><div><span>Network fee</span><b className="admin-green-text">Covered by SuperIM</b></div><div className="admin-preview-total"><span>You'll receive</span><b>{Math.max(0, 250 - Number(fee || 0)).toFixed(2)} USDC</b></div></div><div className="admin-info-box"><ShieldCheck aria-hidden="true" /><span>Rule changes are audited and take effect for new requests only.</span></div></section></div></div>
}

const AuditPage: FC = () => <div className="admin-page-content"><div className="admin-toolbar"><div><span className="admin-section-label">AUDIT TRAIL</span><h2>Wallet audit log <span>All rule and status changes</span></h2></div><button type="button" className="admin-outline-button"><FileSearch aria-hidden="true" />Export log</button></div><div className="admin-audit-list">{[
  ['Jordan Davis', 'Updated withdrawal service fee', '0.70 → 0.80 USDC', '12 min ago', 'Rule configuration'],
  ['System', 'Withdrawal entered manual review', 'tx-1039 · 250.80 USDC', 'Yesterday, 18:05', 'Transaction'],
  ['Maya Chen', 'Wallet binding retried', 'Noah Williams · wallet_pending', 'Today, 09:25', 'Wallet lifecycle'],
  ['System', 'Gas sponsorship degraded', 'Base Mainnet · Paymaster latency', 'Today, 08:40', 'Infrastructure'],
].map(([actor, action, detail, time, type]) => <div className="admin-audit-row" key={`${actor}-${time}`}><span className="admin-audit-icon"><FileSearch aria-hidden="true" /></span><div><strong>{action}</strong><small>{detail}</small></div><span className="admin-audit-type">{type}</span><span className="admin-audit-actor">{actor}<small>{time}</small></span><ChevronRight aria-hidden="true" /></div>)}</div></div>

const ArrowRightIcon = () => <ArrowUpRight aria-hidden="true" />
const EyeIcon = () => <WalletCards aria-hidden="true" />

const AdminWalletPage: FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [toast, setToast] = useState<string | null>(null)
  const view: AdminView = (location.pathname.split('/')[3] as AdminView) || 'dashboard'
  const titleMap: Record<AdminView, [string, string]> = { dashboard: ['Wallet overview', 'Monitor wallet health, volume and pending actions.'], transactions: ['Transactions', 'Review USDC activity across Base Mainnet.'], users: ['User wallets', 'View wallet readiness and account bindings.'], settings: ['Wallet rules', 'Configure withdrawal fees and limits.'], audit: ['Audit log', 'Trace wallet operations and rule changes.'] }
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(null), 2200) }
  return <div className="admin-wallet-prototype"><AdminSidebar view={view} onNavigate={next => navigate(next === 'dashboard' ? '/admin/wallet' : `/admin/wallet/${next}`)} /><div className="admin-wallet-main"><AdminTopbar title={titleMap[view][0]} subtitle={titleMap[view][1]} />{view === 'dashboard' && <OverviewPage onNavigate={next => navigate(next === 'dashboard' ? '/admin/wallet' : `/admin/wallet/${next}`)} />}{view === 'transactions' && <TransactionsPage />}{view === 'users' && <UsersPage />}{view === 'settings' && <SettingsPage onToast={notify} />}{view === 'audit' && <AuditPage />}{toast && <div className="admin-toast"><CheckCircle2 aria-hidden="true" />{toast}</div>}</div></div>
}

export default AdminWalletPage
