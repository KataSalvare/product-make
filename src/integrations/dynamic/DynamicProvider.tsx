import type { FC, ReactNode } from 'react'
import {
  DynamicContextProvider,
  DynamicEmbeddedWidget,
  useDynamicContext,
  useIsLoggedIn,
  useUserWallets,
} from '@dynamic-labs/sdk-react-core'
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import { dynamicEnvironmentId, isDynamicConfigured } from './config'
import { bindDynamicWallet, walletBindingApiConfigured } from './walletBinding'
import { useEffect, useState } from 'react'

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
      {children}
    </DynamicContextProvider>
  )
}

export const DynamicWalletDemo: FC = () => {
  const { sdkHasLoaded, primaryWallet, user } = useDynamicContext()
  const isLoggedIn = useIsLoggedIn()
  const userWallets = useUserWallets()
  const walletAddress = primaryWallet?.address
  const [bindingState, setBindingState] = useState<'idle' | 'bound' | 'error'>('idle')

  useEffect(() => {
    if (!isLoggedIn || !primaryWallet || !user?.userId || !walletBindingApiConfigured) return

    let cancelled = false
    bindDynamicWallet(primaryWallet, user.userId)
      .then(() => { if (!cancelled) setBindingState('bound') })
      .catch(() => { if (!cancelled) setBindingState('error') })

    return () => { cancelled = true }
  }, [isLoggedIn, primaryWallet, user?.userId])

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
            <strong>Wallet address available to SuperIM</strong>
            <small>{walletAddress}</small>
          </div>
          <span>{bindingState === 'bound' ? 'Bound' : bindingState === 'error' ? 'Binding failed' : walletBindingApiConfigured && user?.userId ? 'Binding…' : `${userWallets.length} wallet${userWallets.length === 1 ? '' : 's'}`}</span>
        </div>
      )}
    </section>
  )
}
