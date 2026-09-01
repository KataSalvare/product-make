import { getAuthToken, type Wallet } from '@dynamic-labs/sdk-react-core'

const superimApiBaseUrl = (import.meta.env.VITE_SUPERIM_API_BASE_URL as string | undefined)?.trim() ?? ''

export type WalletBindingPayload = {
  dynamicWalletId: string
  walletAddress: string
  walletType: 'embedded'
  network: 'Base'
}

export type WalletBindingResult =
  | { status: 'bound' }
  | { status: 'skipped'; reason: 'api-not-configured' | 'user-not-authenticated' }

export const walletBindingApiConfigured = Boolean(superimApiBaseUrl)

export async function bindDynamicWallet(wallet: Wallet): Promise<WalletBindingResult> {
  if (!superimApiBaseUrl) return { status: 'skipped', reason: 'api-not-configured' }

  const authToken = getAuthToken()
  if (!authToken) return { status: 'skipped', reason: 'user-not-authenticated' }

  const response = await fetch(`${superimApiBaseUrl.replace(/\/$/, '')}/api/wallet/bind`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dynamicWalletId: wallet.id,
      walletAddress: wallet.address,
      walletType: 'embedded',
      network: 'Base',
    } satisfies WalletBindingPayload),
  })

  if (!response.ok) throw new Error(`Wallet binding failed (${response.status})`)
  return { status: 'bound' }
}

export async function findUserWalletAddress(userId: string): Promise<string | null> {
  if (!superimApiBaseUrl || !userId) return null

  const response = await fetch(`${superimApiBaseUrl.replace(/\/$/, '')}/api/users/${encodeURIComponent(userId)}/wallet`, {
    credentials: 'include',
  })

  if (response.status === 404) return null
  if (!response.ok) throw new Error(`Wallet lookup failed (${response.status})`)

  const data = await response.json() as { address?: unknown }
  return typeof data.address === 'string' && /^0x[a-fA-F0-9]{40}$/.test(data.address) ? data.address : null
}
