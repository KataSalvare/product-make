import type { FC, ReactNode } from 'react'
import {
  DynamicContextProvider,
  DynamicWidget,
  useDynamicContext,
  useIsLoggedIn,
  useUserWallets,
} from '@dynamic-labs/sdk-react-core'
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import { dynamicEnvironmentId, isDynamicConfigured } from './config'

export const DynamicProvider: FC<{ children: ReactNode }> = ({ children }) => {
  if (!isDynamicConfigured) return <>{children}</>

  return (
    <DynamicContextProvider
      theme="auto"
      settings={{
        environmentId: dynamicEnvironmentId,
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      {children}
    </DynamicContextProvider>
  )
}

export const DynamicWalletDemo: FC = () => {
  const { sdkHasLoaded, primaryWallet } = useDynamicContext()
  const isLoggedIn = useIsLoggedIn()
  const userWallets = useUserWallets()
  const walletAddress = primaryWallet?.address

  return (
    <section className="wallet-dynamic-card" aria-labelledby="dynamic-demo-title">
      <div className="wallet-dynamic-heading">
        <div>
          <span className="wallet-eyebrow">DYNAMIC DEMO</span>
          <h3 id="dynamic-demo-title">Embedded wallet connection</h3>
        </div>
        <span className={`wallet-dynamic-status ${sdkHasLoaded ? 'is-ready' : 'is-loading'}`}>
          <span aria-hidden="true" />
          {sdkHasLoaded ? 'Ready' : 'Loading'}
        </span>
      </div>

      {isLoggedIn && walletAddress ? (
        <div className="wallet-dynamic-connected">
          <div>
            <strong>Wallet connected</strong>
            <small>{walletAddress}</small>
          </div>
          <span>{userWallets.length} wallet{userWallets.length === 1 ? '' : 's'}</span>
        </div>
      ) : (
        <div className="wallet-dynamic-connect">
          <p>Connect Dynamic to preview your Base Mainnet wallet. USDC transfers remain Mock-only in this demo.</p>
          <DynamicWidget
            variant="modal"
            innerButtonComponent={<span className="wallet-dynamic-connect-button">Connect Dynamic wallet</span>}
          />
        </div>
      )}
    </section>
  )
}
