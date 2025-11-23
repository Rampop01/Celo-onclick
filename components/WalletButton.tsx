'use client';

import { useAccount, useDisconnect } from 'wagmi';
import { motion } from 'framer-motion';
import { Wallet, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { appKit } from '../lib/wagmi';

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
      <div className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse">
        <div className="w-24 h-5"></div>
      </div>
    );
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = () => {
    if (appKit) {
      appKit.open();
    }
  };

  const handleOpenAccount = () => {
    if (appKit) {
      appKit.open({ view: 'Account' });
    }
  };

  if (isConnected && address) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center space-x-2"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenAccount}
          className="px-4 py-2.5 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-full font-semibold text-base flex items-center space-x-2 hover:shadow-lg transition-shadow"
        >
          <span>{formatAddress(address)}</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => disconnect()}
          className="px-3 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          title="Disconnect"
        >
          <LogOut className="w-5 h-5" />
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleConnect}
      className="px-6 py-2.5 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-full font-semibold text-base flex items-center space-x-2 hover:shadow-lg transition-shadow"
    >
      <span>Connect Wallet</span>
    </motion.button>
  );
}

