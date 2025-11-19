import { cookieStorage, createStorage, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// Get your projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'fe72915b3fa7b7e81b11cc99a79a433e'

// Set the metadata for your app
const metadata = {
  name: 'OnClick',
  description: 'One Click. Global Reach. Instant Crypto.',
  url: 'https://onclick.app',
  icons: ['https://onclick.app/favicon.ico']
}

// Define the chains
const chains = [mainnet, sepolia] as const

// Create wagmi adapter with chains and projectId
const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks: chains
})

// Create the AppKit instance
export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  metadata,
  networks: chains
})

// Export the wagmi config
export const wagmiConfig = wagmiAdapter.wagmiConfig

