'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface RampEmbeddedProps {
  amount: number;
  recipientAddress: string;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * Embedded Ramp Network Widget
 * Opens Ramp as an iframe/overlay within your site (user never leaves)
 */
export default function RampEmbedded({ 
  amount, 
  recipientAddress, 
  onClose,
  onSuccess 
}: RampEmbeddedProps) {
  const [widgetUrl, setWidgetUrl] = useState('');

  useEffect(() => {
    // Build Ramp URL with all parameters
    const rampUrl = new URL('https://buy.ramp.network/');
    
    // Configuration
    rampUrl.searchParams.set('hostAppName', 'OnClick');
    rampUrl.searchParams.set('swapAsset', 'CELO_CUSD'); // cUSD on Celo
    rampUrl.searchParams.set('userAddress', recipientAddress);
    rampUrl.searchParams.set('swapAmount', amount.toString());
    rampUrl.searchParams.set('fiatValue', amount.toString());
    rampUrl.searchParams.set('fiatCurrency', 'USD');
    rampUrl.searchParams.set('variant', 'embedded');
    
    // Optional: Add host logo
    if (typeof window !== 'undefined') {
      rampUrl.searchParams.set('hostLogoUrl', window.location.origin + '/logo.png');
    }
    
    // Optional: Add API key if available
    if (process.env.NEXT_PUBLIC_RAMP_API_KEY) {
      rampUrl.searchParams.set('hostApiKey', process.env.NEXT_PUBLIC_RAMP_API_KEY);
    }

    setWidgetUrl(rampUrl.toString());

    // Listen for messages from Ramp iframe
    const handleMessage = (event: MessageEvent) => {
      // Verify it's from Ramp
      if (event.origin !== 'https://buy.ramp.network') return;

      const { type, payload } = event.data;

      switch (type) {
        case 'PURCHASE_CREATED':
          console.log('✅ Purchase created:', payload);
          break;
        case 'PURCHASE_SUCCESSFUL':
          console.log('✅ Purchase successful:', payload);
          onSuccess?.();
          setTimeout(() => onClose(), 2000);
          break;
        case 'PURCHASE_FAILED':
          console.error('❌ Purchase failed:', payload);
          break;
        case 'WIDGET_CLOSE':
          console.log('Widget closed by user');
          onClose();
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [amount, recipientAddress, onClose, onSuccess]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md h-[600px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
        >
          <X className="w-5 h-5 text-slate-700" />
        </button>

        {/* Loading State */}
        {!widgetUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Loading payment widget...</p>
            </div>
          </div>
        )}

        {/* Ramp Iframe */}
        {widgetUrl && (
          <iframe
            src={widgetUrl}
            title="Ramp Network Payment"
            className="w-full h-full border-0"
            allow="payment; camera; microphone"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        )}
      </motion.div>
    </motion.div>
  );
}





