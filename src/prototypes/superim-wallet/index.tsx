/**
 * @name 钱包原型
 * @description Dynamic-powered wallet entry and chat transfer orchestration.
 */

import { useCallback, useEffect, useState, type FC } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, ExternalLink, ShieldCheck, TriangleAlert } from 'lucide-react'
import { DynamicEmbeddedWidget, useDynamicContext, useIsLoggedIn, useSendBalance, useSwitchWallet, useUserWallets } from '@dynamic-labs/sdk-react-core'
import '../../themes/equatorial-minimalism/globals.css'
import { DynamicWalletDemo } from '../../integrations/dynamic/DynamicProvider'
import { findUserWalletAddress, walletBindingApiConfigured } from '../../integrations/dynamic/walletBinding'
import { isDynamicConfigured } from '../../integrations/dynamic/config'
import './style.css'

const PageHeader: FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
  <header className="wallet-page-header">
    <div className="wallet-page-header-inner">
      <div className="wallet-page-header-leading">
        <button type="button" className="wallet-page-header-back" aria-label="Back" onClick={onBack}>
          <ArrowLeft aria-hidden="true" />
        </button>
        <h1 className="wallet-page-header-title">{title}</h1>
      </div>
    </div>
  </header>
)

const DynamicSetupNotice: FC = () => (
  <section className="wallet-info-callout wallet-info-callout-warning">
    <TriangleAlert aria-hidden="true" />
    <p><strong>Dynamic is not configured</strong><br />Set <code>VITE_DYNAMIC_ENVIRONMENT_ID</code> to enable wallet activation and transactions.</p>
  </section>
)

const WalletActivationPrompt: FC = () => {
  const { setShowAuthFlow } = useDynamicContext()

  return (
    <section className="wallet-info-callout wallet-wallet-activation-prompt">
      <TriangleAlert aria-hidden="true" />
      <div className="wallet-unbound-copy">
        <strong>Open your wallet first</strong>
        <p>You need to open a Dynamic Embedded Wallet before sending funds.</p>
        <button type="button" className="wallet-primary-button wallet-open-wallet-button" onClick={() => setShowAuthFlow(true)}>
          Open wallet <ArrowRight aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}

const WalletHome: FC = () => {
  const navigate = useNavigate()
  return (
    <div className="wallet-screen wallet-home-screen">
      <PageHeader title="Wallet" onBack={() => navigate('/me')} />
      <main className="wallet-scroll-area">
        {isDynamicConfigured ? <DynamicWalletDemo /> : <DynamicSetupNotice />}
        <section className="wallet-security-note wallet-security-note-block">
          <ShieldCheck aria-hidden="true" />
          <span><strong>Wallet operations are powered by Dynamic.</strong><br />SuperIM never handles private keys or signs transactions for users.</span>
        </section>
        <div className="wallet-dynamic-route-links">
          <button type="button" onClick={() => navigate('/wallet/transfer')}>Open Dynamic Send <ArrowRight aria-hidden="true" /></button>
          <button type="button" onClick={() => navigate('/wallet/deposit')}>Open Dynamic Wallet <ExternalLink aria-hidden="true" /></button>
        </div>
      </main>
    </div>
  )
}

type LookupState = 'idle' | 'loading' | 'ready' | 'not-found' | 'unavailable' | 'error'

export interface DynamicTransferModalProps {
  inChat?: boolean
  recipientUserId?: string
  recipientName?: string
  recipientAddress?: string
  onClose?: () => void
}

interface DynamicSendPageProps extends DynamicTransferModalProps {
  modal?: boolean
}

export const DynamicSendPage: FC<DynamicSendPageProps> = ({
  inChat = false,
  modal = false,
  recipientUserId: recipientUserIdProp,
  recipientName: recipientNameProp,
  recipientAddress: recipientAddressProp,
  onClose,
}) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { open } = useSendBalance()
  const { primaryWallet } = useDynamicContext()
  const switchWallet = useSwitchWallet()
  const userWallets = useUserWallets()
  const embeddedWallet = userWallets.find(wallet => wallet.connector.isEmbeddedWallet)
  const isLoggedIn = useIsLoggedIn()
  const hasEmbeddedWallet = Boolean(embeddedWallet)
  const recipientUserId = recipientUserIdProp ?? searchParams.get('recipientUserId') ?? ''
  const recipientName = recipientNameProp ?? searchParams.get('recipientName') ?? 'SuperIM user'
  const explicitAddress = recipientAddressProp ?? searchParams.get('recipientAddress') ?? ''
  const isGroupTransfer = inChat || searchParams.get('source') === 'group-chat'
  const [recipientAddress, setRecipientAddress] = useState(explicitAddress)
  const [lookupState, setLookupState] = useState<LookupState>(explicitAddress || !recipientUserId || !walletBindingApiConfigured ? (explicitAddress ? 'ready' : 'unavailable') : 'idle')
  const [sendState, setSendState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const close = useCallback(
    () => onClose?.() ?? navigate(isGroupTransfer ? '/group-chat' : '/wallet'),
    [isGroupTransfer, navigate, onClose],
  )

  useEffect(() => {
    if (!modal) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [close, modal])

  useEffect(() => {
    if (explicitAddress || !recipientUserId) {
      return
    }
    let cancelled = false
    findUserWalletAddress(recipientUserId)
      .then(address => {
        if (cancelled) return
        if (address) {
          setRecipientAddress(address)
          setLookupState('ready')
        } else {
          setLookupState('not-found')
        }
      })
      .catch(() => { if (!cancelled) setLookupState('error') })
    return () => { cancelled = true }
  }, [explicitAddress, recipientUserId])

  const send = async () => {
    if (!recipientAddress || !embeddedWallet) return
    setSendState('sending')
    setError(null)
    try {
      if (primaryWallet?.id !== embeddedWallet.id) {
        await switchWallet(embeddedWallet.id)
      }
      const hash = await open({ recipientAddress })
      setTxHash(hash)
      setSendState('sent')
    } catch {
      setError('Dynamic transfer was canceled or failed. No success message was created.')
      setSendState('error')
    }
  }

  const content = !isLoggedIn || !hasEmbeddedWallet ? (
    <WalletActivationPrompt />
  ) : (
    <div className="wallet-form-stack">
      <section className="wallet-form-section">
        <span className="wallet-form-label">RECIPIENT</span>
        <div className="wallet-recipient-card">
          <span className="wallet-avatar wallet-avatar-small">{recipientName.slice(0, 2).toUpperCase()}</span>
          <span><strong>{recipientName}</strong><small>{recipientAddress ? `${recipientAddress.slice(0, 6)}...${recipientAddress.slice(-4)}` : 'Wallet address lookup required'}</small></span>
        </div>
      </section>
      {lookupState === 'not-found' && <section className="wallet-info-callout wallet-info-callout-warning"><TriangleAlert aria-hidden="true" /><p><strong>对方暂未开通钱包</strong><br />The recipient has no bound Dynamic wallet address.</p></section>}
      {lookupState === 'unavailable' && <section className="wallet-info-callout wallet-info-callout-warning"><TriangleAlert aria-hidden="true" /><p><strong>Wallet address unavailable</strong><br />Configure the SuperIM wallet API or provide a verified recipient address.</p></section>}
      {lookupState === 'error' && <section className="wallet-info-callout wallet-info-callout-warning"><TriangleAlert aria-hidden="true" /><p><strong>Wallet lookup failed</strong><br />Please retry after the SuperIM wallet service is available.</p></section>}
      {(lookupState === 'idle' || lookupState === 'loading') && <section className="wallet-security-note"><Clock3 aria-hidden="true" /><span>Looking up the recipient wallet address…</span></section>}
      <section className="wallet-security-note wallet-security-note-block"><ShieldCheck aria-hidden="true" /><span>Dynamic will collect the amount, show the network and request the user signature.</span></section>
      <button type="button" className="wallet-primary-button wallet-submit-button" onClick={send} disabled={!recipientAddress || !embeddedWallet || sendState === 'sending' || sendState === 'sent'}>
        {sendState === 'sending' ? 'Opening Dynamic…' : sendState === 'sent' ? 'Transfer submitted' : <>Continue in Dynamic <ArrowRight aria-hidden="true" /></>}
      </button>
      {sendState === 'sent' && txHash && <div className="wallet-success-banner"><CheckCircle2 aria-hidden="true" /><span><strong>Transfer submitted</strong><small>{txHash}</small></span></div>}
      {sendState === 'error' && error && <div className="wallet-info-callout wallet-info-callout-warning"><TriangleAlert aria-hidden="true" /><p>{error}</p></div>}
    </div>
  )

  if (modal) {
    return (
      <div className="wallet-transfer-modal-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close() }}>
        <div className="wallet-transfer-modal" role="dialog" aria-modal="true" aria-label={isGroupTransfer ? 'Transfer in chat' : 'Transfer USDC'}>
          <PageHeader title={isGroupTransfer ? 'Transfer in chat' : 'Transfer USDC'} onBack={close} />
          <div className="wallet-transfer-modal-body">{content}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="wallet-screen">
      <PageHeader title={isGroupTransfer ? 'Transfer in chat' : 'Transfer USDC'} onBack={close} />
      <main className="wallet-scroll-area wallet-detail-scroll">{content}</main>
    </div>
  )
}

export const DynamicTransferModal: FC<DynamicTransferModalProps> = (props) => {
  const handleClose = props.onClose ?? (() => undefined)
  if (!isDynamicConfigured) {
    return (
      <div className="wallet-transfer-modal-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) handleClose() }}>
        <div className="wallet-transfer-modal" role="dialog" aria-modal="true" aria-label="Transfer in chat">
          <PageHeader title="Transfer in chat" onBack={handleClose} />
          <div className="wallet-transfer-modal-body"><DynamicSetupNotice /></div>
        </div>
      </div>
    )
  }
  return <DynamicSendPage {...props} modal />
}

const DynamicWalletSurface: FC<{ title: string }> = ({ title }) => {
  const navigate = useNavigate()
  return (
    <div className="wallet-screen">
      <PageHeader title={title} onBack={() => navigate('/wallet')} />
      <main className="wallet-scroll-area wallet-detail-scroll">
        {isDynamicConfigured ? <div className="wallet-dynamic-surface"><DynamicEmbeddedWidget /></div> : <DynamicSetupNotice />}
      </main>
    </div>
  )
}

const WalletPage: FC = () => {
  const location = useLocation()
  const view = location.pathname === '/wallet' ? 'home' : location.pathname.includes('/chat-transfer') ? 'chat-transfer' : location.pathname.includes('/transfer') ? 'transfer' : location.pathname.includes('/deposit') ? 'deposit' : 'surface'
  if (view === 'home') return <WalletHome />
  if (view === 'transfer') return isDynamicConfigured ? <DynamicSendPage /> : <DynamicWalletSurface title="Transfer USDC" />
  if (view === 'chat-transfer') return isDynamicConfigured ? <DynamicSendPage inChat /> : <DynamicWalletSurface title="Transfer in chat" />
  return <DynamicWalletSurface title={view === 'deposit' ? 'Deposit' : 'Wallet'} />
}

export default WalletPage
