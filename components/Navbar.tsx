'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../app/providers';
import { usePathname } from 'next/navigation';
import { Sun, Moon, Menu, X, Sparkles } from 'lucide-react';
import Link from 'next/link';
import WalletButton from './WalletButton';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();
  
  // Use context only if available
  let theme: any = null;
  try {
    theme = useTheme();
  } catch (e) {
    // Theme context not available yet, will use state
  }
  
  useEffect(() => {
    setMounted(true);
    // Get initial theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDark(shouldBeDark);
  }, []);
  
  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
    if (newDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  // Use provided theme if available, otherwise use local state
  const currentIsDark = theme?.isDark ?? isDark;
  const currentToggleTheme = theme?.toggleTheme ?? toggleTheme;
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Get the handle from the current path only (no localStorage)
  const getHandle = () => {
    if (typeof window !== 'undefined') {
      // Check if we're on a handle route (not /, /role-selection, /create-page, etc.)
      const path = pathname || window.location.pathname;
      const reservedPaths = ['/', '/role-selection', '/create-page', '/public-page', '/business-dashboard', '/freelancer-dashboard', '/crowdfunder-dashboard', '/handle-selection'];
      if (path && !reservedPaths.some(reserved => path === reserved || path.startsWith(reserved + '/'))) {
        // Extract handle from path (remove leading slash)
        const handle = path.replace(/^\//, '');
        if (handle && !handle.includes('/')) {
          return handle;
        }
      }
    }
    return null;
  };

  const handle = getHandle();
  const logoHref = '/';

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/20 dark:border-gray-700/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href={logoHref}>
            <span className="text-2xl italic font-extrabold tracking-tight text-blue-700 dark:text-white select-none">OnClick</span>
          </Link>


          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Wallet Button */}
            <WalletButton />

          </div>
        </div>

      </div>
    </motion.nav>
  );
}
