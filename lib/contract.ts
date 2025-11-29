/**
 * OnClick Smart Contract Configuration
 * Supports Celo Sepolia Testnet and Mainnet
 */

import { celo } from 'wagmi/chains';
import { defineChain } from 'viem';
import onClickAbi from './onclick-abi.json';

/**
 * Celo Sepolia Testnet Chain Definition
 * Chain ID: 11142220 (0xA9EC5C)
 * Note: Celo Sepolia is the new testnet, replacing Alfajores
 */
export const celoSepolia = defineChain({
  id: 11142220, // Celo Sepolia chain ID
  name: 'Celo Sepolia Testnet',
  network: 'celo-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'CELO',
    symbol: 'CELO',
  },
  rpcUrls: {
    default: {
      http: [
        'https://forno.celo-sepolia.celo-testnet.org', // Primary - Official Celo Sepolia RPC
        'https://alfajores-forno.celo-testnet.org', // Backup 1 - Alfajores (compatible)
        'https://celo-sepolia.blockscout.com/api/eth-rpc', // Backup 2 - Blockscout
      ],
    },
    public: {
      http: [
        'https://forno.celo-sepolia.celo-testnet.org',
        'https://alfajores-forno.celo-testnet.org',
        'https://celo-sepolia.blockscout.com/api/eth-rpc',
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'Celo Sepolia Explorer',
      url: 'https://sepolia.celoscan.io', // CeloScan Sepolia
    },
  },
  testnet: true,
});

/**
 * Environment Configuration
 */
const IS_PRODUCTION = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production';

/**
 * Contract Addresses
 */
export const CONTRACTS = {
  // Testnet (Celo Sepolia) - Use this for development
  testnet: {
    onClick: '0x274f499201b0716e6CB632FF5BEc10cAD508eAD6', // ✅ Deployed!
    usdc: '0xd9fc6cC979472A5FA52750ae26805462E1638872', // ✅ Mock USDC
  },
  // Mainnet - Use this for production
  mainnet: {
    onClick: '0x073638da15e6e99ba50991f358a4b39000cdb48f',
    usdc: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
  },
} as const;

// Select the correct addresses based on environment
const currentNetwork = IS_PRODUCTION ? 'mainnet' : 'testnet';
export const ONCLICK_CONTRACT_ADDRESS = CONTRACTS[currentNetwork].onClick;
export const USDC_ADDRESS = CONTRACTS[currentNetwork].usdc;
export const CHAIN = IS_PRODUCTION ? celo : celoSepolia;

/**
 * Contract Configuration
 */
export const ONCLICK_CONTRACT = {
  address: ONCLICK_CONTRACT_ADDRESS,
  abi: onClickAbi,
  chainId: CHAIN.id,
} as const;

/**
 * Role Enum (matches smart contract)
 */
export enum Role {
  Freelancer = 0, // Freelancers offering services
  Business = 1,   // Businesses selling products
  Crowdfunder = 2, // Fundraising campaigns
}

/**
 * Platform Fee (in basis points, 100 = 1%)
 */
export const PLATFORM_FEE_BPS = 100; // 1%

/**
 * USDC Decimals
 */
export const USDC_DECIMALS = 6;

/**
 * Helper: Convert USDC amount to contract format (with decimals)
 */
export function toUSDCAmount(amount: number): bigint {
  return BigInt(Math.floor(amount * 10 ** USDC_DECIMALS));
}

/**
 * Helper: Convert contract format to USDC amount
 */
export function fromUSDCAmount(amount: bigint): number {
  return Number(amount) / 10 ** USDC_DECIMALS;
}

/**
 * Helper: Calculate platform fee
 */
export function calculatePlatformFee(amount: bigint): bigint {
  return (amount * BigInt(PLATFORM_FEE_BPS)) / BigInt(10000);
}

/**
 * Helper: Get total amount including fee
 */
export function getTotalWithFee(amount: bigint): bigint {
  return amount + calculatePlatformFee(amount);
}

/**
 * Type Definitions from Smart Contract
 */
export interface Page {
  owner: string;
  handle: string;
  role: Role;
  walletAddress: string;
  goal: bigint;
  deadline: bigint;
  totalRaised: bigint;
  supporterCount: bigint;
  exists: boolean;
}

export interface Payment {
  supporter: string;
  amount: bigint;
  timestamp: bigint;
  message: string;
  isFiatConverted: boolean;
}

/**
 * Contract Event Names
 */
export const EVENTS = {
  PAGE_CREATED: 'PageCreated',
  PAGE_UPDATED: 'PageUpdated',
  PAYMENT_MADE: 'PaymentMade',
  HANDLE_TRANSFERRED: 'HandleTransferred',
} as const;

/**
 * Network Info
 */
export const NETWORK_INFO = {
  testnet: {
    name: 'Celo Sepolia Testnet',
    explorer: 'https://sepolia.celoscan.io',
    faucet: 'https://faucet.celo.org/sepolia',
    rpcUrl: 'https://rpc.ankr.com/celo_sepolia',
    chainId: 11142220, // Correct Celo Sepolia chain ID
  },
  mainnet: {
    name: 'Celo Mainnet',
    explorer: 'https://celoscan.io',
    rpcUrl: 'https://forno.celo.org',
    chainId: 42220,
  },
};

export const CURRENT_NETWORK_INFO = NETWORK_INFO[currentNetwork];

/**
 * Helper: Get block explorer URL
 */
export function getExplorerUrl(type: 'tx' | 'address', hash: string): string {
  return `${CURRENT_NETWORK_INFO.explorer}/${type}/${hash}`;
}
