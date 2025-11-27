'use client';

import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { CreditCard, ExternalLink } from 'lucide-react';

/**
 * Ramp Network Fiat On-Ramp Widget
 * 
 * To use this:
 * 1. Install: npm install @ramp-network/ramp-instant-sdk
 * 2. Get API key from https://dashboard.ramp.network/
 * 3. Add to .env.local: NEXT_PUBLIC_RAMP_API_KEY=your_key
 */

interface RampWidgetProps {
  amount?: number;
  onClose?: () => void;
  onSuccess?: () => void;
}

export function RampWidget({ amount, onClose, onSuccess }: RampWidgetProps) {
  const { address, isConnected } = useAccount();
  const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production';

  const openRamp = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first!');
      return;
    }

    // Dynamically import to avoid SSR issues
    const { RampInstantSDK } = await import('@ramp-network/ramp-instant-sdk');

    const ramp = new RampInstantSDK({
      hostAppName: 'OnClick',
      hostLogoUrl: window.location.origin + '/logo.png',
      
      // Asset to purchase
      swapAsset: isProduction ? 'CELO_USDC' : 'CELO_CUSD',
      
      // Pre-fill amount if provided
      ...(amount && { swapAmount: amount.toString() }),
      
      // User's wallet address
      userAddress: address,
      
      // Your Ramp API key
      hostApiKey: process.env.NEXT_PUBLIC_RAMP_API_KEY,
      
      // Theme
      variant: 'auto', // 'auto', 'mobile', or 'desktop'
      
      // Callbacks - using type assertion as SDK types may be outdated
      onPurchaseCreated: (purchase: any) => {
        console.log('Purchase created:', purchase);
      },
      onPurchaseSuccess: (purchase: any) => {
        console.log('Purchase successful!', purchase);
        onSuccess?.();
        onClose?.();
      },
      onPurchaseFailed: (error: any) => {
        console.error('Purchase failed:', error);
      },
      onWidgetClose: () => {
        console.log('Widget closed');
        onClose?.();
      },
    } as any);

    ramp.show();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={openRamp}
      className="w-full p-4 rounded-xl border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 hover:shadow-lg transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-gray-900 dark:text-white">
              Buy Crypto with Card
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Powered by Ramp Network
            </div>
          </div>
        </div>
        <ExternalLink className="w-5 h-5 text-gray-400" />
      </div>
    </motion.button>
  );
}

/**
 * Alternative: Simple Link to Ramp (No SDK needed)
 * Good for MVP/testing without installing SDK
 */
export function RampLink({ amount }: { amount?: number }) {
  const { address } = useAccount();
  const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production';

  const rampUrl = new URL('https://buy.ramp.network/');
  rampUrl.searchParams.set('hostAppName', 'OnClick');
  rampUrl.searchParams.set('swapAsset', isProduction ? 'CELO_USDC' : 'CELO_CUSD');
  if (address) rampUrl.searchParams.set('userAddress', address);
  if (amount) rampUrl.searchParams.set('swapAmount', amount.toString());

  return (
    <a
      href={rampUrl.toString()}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full p-4 rounded-xl border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 hover:shadow-lg transition-all flex items-center justify-between"
    >
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
        <div className="text-left">
          <div className="font-semibold text-gray-900 dark:text-white">
            Buy Crypto with Card
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Powered by Ramp Network
          </div>
        </div>
      </div>
      <ExternalLink className="w-5 h-5 text-gray-400" />
    </a>
  );
}

