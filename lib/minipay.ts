/**
 * MiniPay Detection and Integration Utilities
 * MiniPay is Celo's mobile wallet (Opera + Celo partnership)
 */

/**
 * Check if user is on MiniPay browser
 */
export function isMiniPay(): boolean {
  if (typeof window === 'undefined') return false;
  
  // MiniPay sets these identifiers
  return (
    /MiniPay/i.test(navigator.userAgent) ||
    /Opera Mini/i.test(navigator.userAgent) ||
    (window as any).ethereum?.isMiniPay === true
  );
}

/**
 * Check if MiniPay wallet is available
 */
export function isMiniPayAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    isMiniPay() && 
    typeof (window as any).ethereum !== 'undefined'
  );
}

/**
 * Get MiniPay provider
 */
export function getMiniPayProvider() {
  if (typeof window === 'undefined') return null;
  return (window as any).ethereum;
}

/**
 * Connect to MiniPay wallet
 */
export async function connectMiniPay() {
  if (!isMiniPayAvailable()) {
    throw new Error('MiniPay wallet not available');
  }

  const provider = getMiniPayProvider();
  
  try {
    const accounts = await provider.request({ 
      method: 'eth_requestAccounts' 
    });
    return accounts[0];
  } catch (error: any) {
    console.error('Failed to connect MiniPay:', error);
    throw new Error(error.message || 'Failed to connect to MiniPay');
  }
}

/**
 * Get user's USDC balance on MiniPay
 */
export async function getMiniPayUSDCBalance(
  userAddress: string,
  usdcAddress: string
): Promise<string> {
  if (!isMiniPayAvailable()) return '0';
  
  const provider = getMiniPayProvider();
  
  try {
    // ERC20 balanceOf function signature
    const data = `0x70a08231000000000000000000000000${userAddress.slice(2)}`;
    
    const balance = await provider.request({
      method: 'eth_call',
      params: [{
        to: usdcAddress,
        data: data
      }, 'latest']
    });
    
    return balance;
  } catch (error) {
    console.error('Failed to get MiniPay USDC balance:', error);
    return '0';
  }
}

/**
 * Helper: Format balance for display
 */
export function formatMiniPayBalance(balance: string, decimals: number = 6): string {
  const value = parseInt(balance, 16);
  return (value / Math.pow(10, decimals)).toFixed(2);
}

/**
 * Get MiniPay installation URL
 */
export function getMiniPayInstallURL(): string {
  // Detect if on Android or iOS
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  if (isAndroid) {
    return 'https://play.google.com/store/apps/details?id=com.opera.mini.native';
  } else if (isIOS) {
    return 'https://apps.apple.com/app/opera-mini-browser/id363729560';
  }
  
  return 'https://www.opera.com/products/minipay';
}

/**
 * MiniPay Network Config (Celo Mainnet)
 */
export const MINIPAY_NETWORK = {
  chainId: '0xa4ec', // 42220 in hex (Celo Mainnet)
  chainName: 'Celo Mainnet',
  nativeCurrency: {
    name: 'CELO',
    symbol: 'CELO',
    decimals: 18
  },
  rpcUrls: ['https://forno.celo.org'],
  blockExplorerUrls: ['https://explorer.celo.org']
};

/**
 * MiniPay Testnet Config (Celo Alfajores)
 */
export const MINIPAY_TESTNET = {
  chainId: '0xaef3', // 44787 in hex (Celo Alfajores)
  chainName: 'Celo Alfajores Testnet',
  nativeCurrency: {
    name: 'CELO',
    symbol: 'CELO',
    decimals: 18
  },
  rpcUrls: ['https://alfajores-forno.celo-testnet.org'],
  blockExplorerUrls: ['https://alfajores.celoscan.io']
};




