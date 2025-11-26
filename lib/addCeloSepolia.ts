/**
 * Utility to add Celo Sepolia Testnet to user's wallet
 */

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      isMetaMask?: boolean;
    };
  }
}

export const CELO_SEPOLIA_CHAIN_CONFIG = {
  chainId: '0xA981EC', // 11142220 in hex
  chainName: 'Celo Sepolia Testnet',
  nativeCurrency: {
    name: 'CELO',
    symbol: 'CELO',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.ankr.com/celo_sepolia'],
  blockExplorerUrls: ['https://sepolia.celoscan.io'],
};

/**
 * Prompt user to add Celo Sepolia Testnet to their wallet
 */
export async function addCeloSepoliaToWallet(): Promise<boolean> {
  if (typeof window === 'undefined' || !window.ethereum) {
    console.error('Wallet not found');
    return false;
  }

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [CELO_SEPOLIA_CHAIN_CONFIG],
    });
    return true;
  } catch (error: any) {
    console.error('Failed to add Celo Sepolia:', error);
    if (error.code === 4902) {
      // Chain doesn't exist, but we already tried to add it
      console.error('Chain configuration rejected by user');
    }
    return false;
  }
}

