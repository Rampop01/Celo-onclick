'use client';

import { useAccount, useDisconnect } from 'wagmi';
import { AppKitButton } from '@reown/appkit/react';
import { motion } from 'framer-motion';
import { Wallet, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function WalletButton() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse">
        <div className="w-20 h-5"></div>
      </div>
    );
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center space-x-2"
      >
        <AppKitButton />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => disconnect()}
          className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          title="Disconnect"
        >
          <LogOut className="w-4 h-4" />
        </motion.button>
      </motion.div>
    );
  }

  return <AppKitButton />;
}

