import type { FC, ReactNode } from 'react'
import {
  DynamicContextProvider,
  DynamicEmbeddedWidget,
  DynamicUserProfile,
  useDynamicContext,
  useIsLoggedIn,
  useUserWallets,
} from '@dynamic-labs/sdk-react-core'
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import { dynamicEnvironmentId, isDynamicConfigured } from './config'
import { bindDynamicWallet, walletBindingApiConfigured } from './walletBinding'
import { createContext, useContext, useEffect, useState } from 'react'

type WalletBindingState = 'idle' | 'binding' | 'bound' | 'error'

const DynamicWalletBindingContext = createContext<WalletBindingState>('idle')

const DynamicWalletBinding: FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useDynamicContext()
  const isLoggedIn = useIsLoggedIn()
  const userWallets = useUserWallets()
  const embeddedWallet = userWallets.find(wallet => wallet.connector.isEmbeddedWallet)
  const [bindingSnapshot, setBindingSnapshot] = useState<{ userId: string; walletId: string; state: Exclude<WalletBindingState, 'idle'> } | null>(null)
  const userId = user?.userId
  const walletId = embeddedWallet?.id
  const canBind = isLoggedIn && Boolean(embeddedWallet && userId && walletId && walletBindingApiConfigured)
  const hasMatchingSnapshot = Boolean(canBind && bindingSnapshot && bindingSnapshot.userId === userId && bindingSnapshot.walletId === walletId)
  const bindingState: WalletBindingState = !canBind
    ? 'idle'
    : hasMatchingSnapshot
      ? bindingSnapshot?.state ?? 'binding'
      : 'binding'

  useEffect(() => {
    if (!canBind || !embeddedWallet || !userId || !walletId) return

    let cancelled = false
    bindDynamicWallet(embeddedWallet)
      .then(() => {
        if (!cancelled) setBindingSnapshot({ userId, walletId, state: 'bound' })
      })
      .catch(() => {
        if (!cancelled) setBindingSnapshot({ userId, walletId, state: 'error' })
      })

    return () => { cancelled = true }
  }, [canBind, embeddedWallet, userId, walletId])

  return (
    <DynamicWalletBindingContext.Provider value={bindingState}>
      {children}
    </DynamicWalletBindingContext.Provider>
  )
}

const useDynamicWalletBinding = () => useContext(DynamicWalletBindingContext)

export const DynamicProvider: FC<{ children: ReactNode }> = ({ children }) => {
  if (!isDynamicConfigured) return <>{children}</>

  return (
    <DynamicContextProvider
      theme="auto"
      settings={{
        environmentId: dynamicEnvironmentId,
        walletConnectors: [EthereumWalletConnectors],
        initialAuthenticationMode: 'connect-and-sign',
      }}
    >
      <DynamicWalletBinding>
        <DynamicUserProfile variant="modal" />
        {children}
      </DynamicWalletBinding>
    </DynamicContextProvider>
  )
}

export const DynamicWalletDemo: FC = () => {
  const { sdkHasLoaded } = useDynamicContext()
  const isLoggedIn = useIsLoggedIn()
  const userWallets = useUserWallets()
  const bindingState = useDynamicWalletBinding()
  const embeddedWallet = userWallets.find(wallet => wallet.connector.isEmbeddedWallet)
  const walletAddress = embeddedWallet?.address

  return (
    <section className="wallet-dynamic-card" aria-labelledby="dynamic-demo-title">
      <div className="wallet-dynamic-heading">
        <div>
          <span className="wallet-eyebrow">DYNAMIC DEMO</span>
          <h3 id="dynamic-demo-title">SuperIM wallet powered by Dynamic</h3>
        </div>
        <span className={`wallet-dynamic-status ${sdkHasLoaded ? 'is-ready' : 'is-loading'}`}>
          <span aria-hidden="true" />
          {sdkHasLoaded ? 'Ready' : 'Loading'}
        </span>
      </div>

      <div className="wallet-dynamic-embedded">
        <DynamicEmbeddedWidget />
      </div>
      {isLoggedIn && walletAddress && (
        <div className="wallet-dynamic-connected">
          <div>
            <strong>Embedded Wallet address bound to SuperIM</strong>
            <small>{walletAddress}</small>
          </div>
          <span>{bindingState === 'bound' ? 'Bound' : bindingState === 'error' ? 'Binding failed' : bindingState === 'binding' ? 'Binding…' : `${userWallets.length} wallet${userWallets.length === 1 ? '' : 's'}`}</span>
        </div>
      )}
    </section>
  )
}
