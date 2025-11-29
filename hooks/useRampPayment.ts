/**
 * Custom Hook for Ramp Network Fiat On-Ramp Integration
 */

'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';

interface RampConfig {
  amount?: number;
  recipientAddress?: string;
  onSuccess?: (purchase: any) => void;
  onClose?: () => void;
}

export function useRampPayment() {
  const { address, isConnected } = useAccount();
  const [isRampOpen, setIsRampOpen] = useState(false);
  const [purchaseData, setPurchaseData] = useState<any>(null);
  const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production';

  const openRamp = async (config: RampConfig) => {
    if (!isConnected || !address) {
      throw new Error('Please connect your wallet first');
    }

    try {
      // Dynamically import to avoid SSR issues
      const { RampInstantSDK } = await import('@ramp-network/ramp-instant-sdk');

      // Configure Ramp with proper settings for embedded widget
      const rampConfig: any = {
        hostAppName: 'OnClick',
        hostLogoUrl: typeof window !== 'undefined' ? window.location.origin + '/logo.png' : '',
        
        // Asset to purchase
        swapAsset: 'CELO_CUSD', // cUSD works best on testnet
        
        // Recipient wallet address
        userAddress: config.recipientAddress || address,
        
        // Variant controls display mode
        variant: 'embedded-mobile', // Options: 'auto', 'hosted-auto', 'embedded-desktop', 'embedded-mobile'
        
        // Container to render widget in (keeps it on your site)
        containerNode: typeof document !== 'undefined' ? document.body : undefined,
        
        // Default fiat settings
        defaultAsset: 'CELO_CUSD',
        fiatCurrency: 'USD',
        
        // Enable testnet/demo mode
        enabledFlows: ['ONRAMP'], // Only buying, not selling
      };
      
      // Add amount if provided
      if (config.amount) {
        rampConfig.swapAmount = config.amount.toString();
        rampConfig.fiatValue = config.amount.toString();
      }
      
      // Add API key if available (works without it on testnet)
      if (process.env.NEXT_PUBLIC_RAMP_API_KEY) {
        rampConfig.hostApiKey = process.env.NEXT_PUBLIC_RAMP_API_KEY;
      }

      console.log('🔧 Opening Ramp with config:', rampConfig);

      const ramp = new RampInstantSDK(rampConfig);

      // Set up event listeners
      ramp.on('PURCHASE_CREATED', (event: any) => {
        console.log('✅ Ramp purchase created:', event);
        setPurchaseData(event);
        setIsRampOpen(true);
      });

      ramp.on('PURCHASE_SUCCESSFUL', (event: any) => {
        console.log('✅ Ramp purchase successful!', event);
        setPurchaseData(event);
        setIsRampOpen(false);
        config.onSuccess?.(event);
      });

      ramp.on('PURCHASE_FAILED', (event: any) => {
        console.error('❌ Ramp purchase failed:', event);
        setIsRampOpen(false);
      });

      ramp.on('WIDGET_CLOSE', () => {
        console.log('Ramp widget closed');
        setIsRampOpen(false);
        config.onClose?.();
      });

      ramp.show();
      setIsRampOpen(true);
    } catch (error: any) {
      console.error('Failed to open Ramp:', error);
      throw new Error(error.message || 'Failed to open payment widget');
    }
  };

  const closeRamp = () => {
    setIsRampOpen(false);
    setPurchaseData(null);
  };

  return {
    openRamp,
    closeRamp,
    isRampOpen,
    purchaseData,
    isConnected,
  };
}

