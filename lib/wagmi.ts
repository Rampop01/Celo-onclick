import { cookieStorage, createStorage } from 'wagmi'
import { celo } from 'wagmi/chains'
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { celoSepolia } from './contract'
import type { AppKitNetwork } from '@reown/appkit/networks'

// Get your projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'fe72915b3fa7b7e81b11cc99a79a433e'

// Check if we're in production
const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'

// Set the metadata for your app
const metadata = {
  name: 'OnClick',
  description: 'One Click. Global Reach. Instant Crypto.',
  url: 'https://onclick.app',
  icons: ['https://onclick.app/favicon.ico']
}

// Define the chains - Focus on Celo testnet for now
const chains = [
  celoSepolia, // Celo Sepolia testnet (primary)
  celo, // Celo mainnet (for production later)
]

// Create wagmi adapter with chains and projectId
const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }) as any,
  ssr: true,
  projectId,
  networks: chains as any,
})

// Create the AppKit instance
export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  metadata,
  networks: chains as any,
  features: {
    analytics: true,
  },
})

// Export the wagmi config
export const wagmiConfig = wagmiAdapter.wagmiConfig
